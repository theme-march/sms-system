import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/db/prisma";
import { getCurrentSession } from "@/src/lib/auth/session";
import {
  requirePermission,
  authorizationStatus,
} from "@/src/lib/auth/authorize";
import { PERMISSIONS } from "@/src/config/permissions";
import { toClientData } from "@/src/lib/serialize";
import { createAuditLog } from "@/src/lib/audit";

const typeSchema = z.object({
  action: z.literal("saveType"),
  id: z.string().optional(),
  name: z.string().trim().min(2).max(80),
  code: z.string().trim().min(2).max(20),
  description: z.string().trim().max(300).optional().default(""),
  daysAllowed: z.coerce.number().int().min(0).max(365),
  isPaid: z.boolean().default(true),
  isCarryForward: z.boolean().default(false),
});
const applySchema = z.object({
  action: z.literal("apply"),
  leaveTypeId: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().trim().min(5).max(1000),
  attachmentUrl: z.string().url().optional().or(z.literal("")),
});
const reviewSchema = z.object({
  action: z.literal("review"),
  id: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
  remarks: z.string().trim().max(500).optional().default(""),
});
const cancelSchema = z.object({
  action: z.literal("cancel"),
  id: z.string().min(1),
});
const toggleSchema = z.object({
  action: z.literal("toggleType"),
  id: z.string().min(1),
  isActive: z.boolean(),
});
const schema = z.discriminatedUnion("action", [
  typeSchema,
  applySchema,
  reviewSchema,
  cancelSchema,
  toggleSchema,
]);
const day = (v: string) => new Date(`${v}T12:00:00.000Z`);

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session?.schoolId)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const admin = request.nextUrl.searchParams.get("scope") === "admin";
    if (
      admin &&
      !session.roles.includes("Super Admin") &&
      !session.permissions.includes(PERMISSIONS.LEAVE_VIEW)
    )
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const [
      types,
      applications,
      teachers,
      employees,
      approvals,
      payrolls,
      periods,
      payslips,
    ] = await Promise.all([
      prisma.leaveType.findMany({
        where: { schoolId: session.schoolId },
        orderBy: { name: "asc" },
      }),
      prisma.leaveApplication.findMany({
        where: {
          schoolId: session.schoolId,
          ...(!admin ? { userId: session.id } : {}),
        },
        orderBy: { appliedAt: "desc" },
        take: 500,
      }),
      admin
        ? prisma.teacher.findMany({
            where: { schoolId: session.schoolId, userId: { not: null } },
            select: { userId: true, nameEn: true, employeeCode: true },
          })
        : Promise.resolve([]),
      admin
        ? prisma.employee.findMany({
            where: { schoolId: session.schoolId, userId: { not: null } },
            select: { userId: true, nameEn: true, employeeCode: true },
          })
        : Promise.resolve([]),
      prisma.leaveApproval.findMany({
        where: {
          leaveApplicationId: {
            in: (
              await prisma.leaveApplication.findMany({
                where: {
                  schoolId: session.schoolId,
                  ...(!admin ? { userId: session.id } : {}),
                },
                select: { id: true },
              })
            ).map((x) => x.id),
          },
        },
        orderBy: { actionDate: "desc" },
      }),
      !admin
        ? prisma.payroll.findMany({
            where: { schoolId: session.schoolId, userId: session.id },
            orderBy: { createdAt: "desc" },
            take: 60,
          })
        : Promise.resolve([]),
      !admin
        ? prisma.payrollPeriod.findMany({
            where: { schoolId: session.schoolId },
            orderBy: [{ payrollYear: "desc" }, { payrollMonth: "desc" }],
          })
        : Promise.resolve([]),
      !admin
        ? prisma.payslip.findMany({
            where: {
              payrollId: {
                in: (
                  await prisma.payroll.findMany({
                    where: { schoolId: session.schoolId, userId: session.id },
                    select: { id: true },
                  })
                ).map((x) => x.id),
              },
            },
          })
        : Promise.resolve([]),
    ]);
    const payrollIds = payrolls.map((item) => item.id);
    const [
      salaryPayments,
      salaryAdjustments,
      salaryItems,
      currentAssignment,
      selfTeacher,
      selfEmployee,
    ] = !admin
      ? await Promise.all([
          prisma.salaryPayment.findMany({
            where: { payrollId: { in: payrollIds } },
            orderBy: { paymentDate: "desc" },
          }),
          prisma.payrollAdjustment.findMany({
            where: { payrollId: { in: payrollIds } },
            orderBy: { createdAt: "desc" },
          }),
          prisma.payrollItem.findMany({
            where: { payrollId: { in: payrollIds } },
          }),
          prisma.employeeSalaryAssignment.findFirst({
            where: {
              schoolId: session.schoolId,
              userId: session.id,
              isActive: true,
            },
            orderBy: { effectiveDate: "desc" },
          }),
          prisma.teacher.findFirst({
            where: { schoolId: session.schoolId, userId: session.id },
            select: {
              nameEn: true,
              employeeCode: true,
              designation: { select: { nameEn: true } },
            },
          }),
          prisma.employee.findFirst({
            where: { schoolId: session.schoolId, userId: session.id },
            select: {
              nameEn: true,
              employeeCode: true,
              designation: { select: { nameEn: true } },
            },
          }),
        ])
      : [[], [], [], null, null, null];
    const currentStructure = currentAssignment
      ? await prisma.salaryStructure.findFirst({
          where: {
            id: currentAssignment.salaryStructureId,
            schoolId: session.schoolId,
            isActive: true,
          },
        })
      : null;
    const currentComponents = currentStructure
      ? await prisma.salaryComponent.findMany({
          where: { salaryStructureId: currentStructure.id, isActive: true },
          orderBy: [{ type: "asc" }, { name: "asc" }],
        })
      : [];
    const selfSchool = !admin
      ? await prisma.school.findUnique({
          where: { id: session.schoolId },
          select: { name: true },
        })
      : null;
    const people = [
      ...teachers.map((x) => ({ ...x, type: "Teacher" })),
      ...employees.map((x) => ({ ...x, type: "Employee" })),
    ];
    const peopleMap = new Map(people.map((x) => [x.userId, x]));
    const typeMap = new Map(types.map((x) => [x.id, x]));
    const periodMap = new Map(periods.map((x) => [x.id, x]));
    const rows = applications.map((x) => ({
      ...x,
      startDate: x.startDate.toISOString().slice(0, 10),
      endDate: x.endDate.toISOString().slice(0, 10),
      appliedAt: x.appliedAt.toISOString(),
      leaveType: typeMap.get(x.leaveTypeId) || null,
      employee: peopleMap.get(x.userId) || null,
      approval: approvals.find((a) => a.leaveApplicationId === x.id) || null,
    }));
    const year = new Date().getFullYear();
    const balances = types
      .filter((x) => x.isActive)
      .map((t) => {
        const used = applications
          .filter(
            (a) =>
              a.leaveTypeId === t.id &&
              a.status === "APPROVED" &&
              a.startDate.getFullYear() === year,
          )
          .reduce((s, a) => s + a.totalDays, 0);
        const pending = applications
          .filter(
            (a) =>
              a.leaveTypeId === t.id &&
              a.status === "PENDING" &&
              a.startDate.getFullYear() === year,
          )
          .reduce((s, a) => s + a.totalDays, 0);
        return {
          ...t,
          used,
          pending,
          remaining: Math.max(0, t.daysAllowed - used),
        };
      });
    const salary = payrolls.map((p) => ({
      ...p,
      basicSalary: Number(p.basicSalary),
      grossSalary: Number(p.grossSalary),
      netSalary: Number(p.netSalary),
      paidAmount: Number(p.paidAmount),
      dueAmount: Math.max(0, Number(p.netSalary) - Number(p.paidAmount)),
      totalAllowances: Number(p.totalAllowances),
      totalDeductions: Number(p.totalDeductions),
      overtime: Number(p.overtime),
      bonus: Number(p.bonus),
      tax: Number(p.tax),
      loanDeduction: Number(p.loanDeduction),
      absenceDeduction: Number(p.absenceDeduction),
      deductions:
        Number(p.totalDeductions) +
        Number(p.tax) +
        Number(p.absenceDeduction) +
        Number(p.loanDeduction),
      period: periodMap.get(p.payrollPeriodId) || null,
      payslip: payslips.find((s) => s.payrollId === p.id) || null,
      payments: salaryPayments
        .filter((item) => item.payrollId === p.id)
        .map((item) => ({
          ...item,
          amount: Number(item.amount),
          paymentDate: item.paymentDate.toISOString(),
        })),
      adjustments: salaryAdjustments
        .filter((item) => item.payrollId === p.id)
        .map((item) => ({
          ...item,
          amount: Number(item.amount),
          createdAt: item.createdAt.toISOString(),
        })),
      items: salaryItems
        .filter((item) => item.payrollId === p.id)
        .map((item) => ({ ...item, amount: Number(item.amount) })),
    }));
    const salaryTotals = salary.reduce(
      (sum, item) => ({
        gross: sum.gross + item.grossSalary,
        net: sum.net + item.netSalary,
        paid: sum.paid + item.paidAmount,
        due: sum.due + item.dueAmount,
      }),
      { gross: 0, net: 0, paid: 0, due: 0 },
    );
    return NextResponse.json(
      toClientData({
        canManage:
          admin &&
          (session.roles.includes("Super Admin") ||
            session.permissions.includes(PERMISSIONS.LEAVE_MANAGE)),
        types,
        applications: rows,
        balances,
        people,
        salary,
        salaryTotals,
        salaryProfile: selfTeacher
          ? { ...selfTeacher, type: "Teacher", schoolName: selfSchool?.name }
          : selfEmployee
            ? {
                ...selfEmployee,
                type: "Employee",
                schoolName: selfSchool?.name,
              }
            : null,
        currentSalary:
          currentAssignment && currentStructure
            ? {
                assignmentId: currentAssignment.id,
                effectiveDate: currentAssignment.effectiveDate
                  .toISOString()
                  .slice(0, 10),
                structure: currentStructure,
                components: currentComponents.map((item) => ({
                  ...item,
                  amount: Number(item.amount),
                })),
                estimatedEarnings: currentComponents
                  .filter((item) => item.type === "EARNING")
                  .reduce((sum, item) => sum + Number(item.amount), 0),
                estimatedDeductions: currentComponents
                  .filter((item) => item.type === "DEDUCTION")
                  .reduce((sum, item) => sum + Number(item.amount), 0),
              }
            : null,
      }),
    );
  } catch (e) {
    console.error("GET /api/leaves", e);
    return NextResponse.json(
      { error: "Unable to load leave records." },
      { status: authorizationStatus(e) },
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json());
    if (input.action === "apply") {
      const session = await getCurrentSession();
      if (!session?.schoolId)
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      const start = day(input.startDate),
        end = day(input.endDate);
      if (end < start)
        return NextResponse.json(
          { error: "End date must be on or after start date." },
          { status: 400 },
        );
      const totalDays =
        Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
      const type = await prisma.leaveType.findFirst({
        where: {
          id: input.leaveTypeId,
          schoolId: session.schoolId,
          isActive: true,
        },
      });
      if (!type)
        return NextResponse.json(
          { error: "Leave type is not available." },
          { status: 404 },
        );
      const overlap = await prisma.leaveApplication.findFirst({
        where: {
          schoolId: session.schoolId,
          userId: session.id,
          status: { in: ["PENDING", "APPROVED"] },
          startDate: { lte: end },
          endDate: { gte: start },
        },
      });
      if (overlap)
        return NextResponse.json(
          {
            error: "The selected dates overlap an existing leave application.",
          },
          { status: 409 },
        );
      const used = await prisma.leaveApplication.aggregate({
        where: {
          schoolId: session.schoolId,
          userId: session.id,
          leaveTypeId: type.id,
          status: "APPROVED",
          startDate: { gte: new Date(Date.UTC(start.getUTCFullYear(), 0, 1)) },
        },
        _sum: { totalDays: true },
      });
      if (Number(used._sum.totalDays || 0) + totalDays > type.daysAllowed)
        return NextResponse.json(
          {
            error: `Only ${Math.max(0, type.daysAllowed - Number(used._sum.totalDays || 0))} ${type.name} day(s) remain.`,
          },
          { status: 409 },
        );
      const record = await prisma.leaveApplication.create({
        data: {
          schoolId: session.schoolId,
          userId: session.id,
          leaveTypeId: type.id,
          startDate: start,
          endDate: end,
          totalDays,
          reason: input.reason,
          attachmentUrl: input.attachmentUrl || null,
        },
      });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "CREATE",
        module: "Leave",
        recordId: record.id,
        details: `Applied for ${totalDays} day(s) ${type.name}`,
      });
      return NextResponse.json(toClientData(record), { status: 201 });
    }
    if (input.action === "cancel") {
      const current = await getCurrentSession();
      if (!current?.schoolId)
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      const own = await prisma.leaveApplication.findFirst({
        where: {
          id: input.id,
          schoolId: current.schoolId,
          userId: current.id,
          status: "PENDING",
        },
      });
      if (!own)
        return NextResponse.json(
          { error: "Pending application not found." },
          { status: 404 },
        );
      await prisma.leaveApplication.update({
        where: { id: own.id },
        data: { status: "CANCELLED" },
      });
      return NextResponse.json({ ok: true });
    }
    const session = await requirePermission(PERMISSIONS.LEAVE_MANAGE);
    if (input.action === "saveType") {
      const data = {
        schoolId: session.schoolId,
        name: input.name,
        code: input.code.toUpperCase(),
        description: input.description || null,
        daysAllowed: input.daysAllowed,
        isPaid: input.isPaid,
        isCarryForward: input.isCarryForward,
      };
      const record = input.id
        ? await prisma.leaveType.update({ where: { id: input.id }, data })
        : await prisma.leaveType.create({ data });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: input.id ? "UPDATE" : "CREATE",
        module: "Leave",
        recordId: record.id,
        details: `${input.id ? "Updated" : "Created"} leave policy ${record.name}`,
      });
      return NextResponse.json(toClientData(record), {
        status: input.id ? 200 : 201,
      });
    }
    if (input.action === "toggleType") {
      const owned = await prisma.leaveType.findFirst({
        where: { id: input.id, schoolId: session.schoolId },
      });
      if (!owned)
        return NextResponse.json(
          { error: "Leave policy not found." },
          { status: 404 },
        );
      await prisma.leaveType.update({
        where: { id: owned.id },
        data: { isActive: input.isActive },
      });
      return NextResponse.json({ ok: true });
    }
    if (input.action === "review") {
      const app = await prisma.leaveApplication.findFirst({
        where: { id: input.id, schoolId: session.schoolId, status: "PENDING" },
      });
      if (!app)
        return NextResponse.json(
          { error: "Pending application not found." },
          { status: 404 },
        );
      await prisma.$transaction([
        prisma.leaveApplication.update({
          where: { id: app.id },
          data: { status: input.status },
        }),
        prisma.leaveApproval.create({
          data: {
            leaveApplicationId: app.id,
            approvedById: session.id,
            status: input.status,
            remarks: input.remarks || null,
          },
        }),
      ]);
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "UPDATE",
        module: "Leave",
        recordId: app.id,
        details: `${input.status} leave application`,
      });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "Unsupported operation." },
      { status: 400 },
    );
  } catch (e) {
    console.error("POST /api/leaves", e);
    const msg =
      e instanceof z.ZodError
        ? e.issues[0]?.message
        : e instanceof Error &&
            !["UNAUTHORIZED", "FORBIDDEN", "SCHOOL_CONTEXT_REQUIRED"].includes(
              e.message,
            )
          ? e.message
          : "Leave operation failed.";
    return NextResponse.json(
      { error: msg },
      { status: authorizationStatus(e) === 500 ? 400 : authorizationStatus(e) },
    );
  }
}
