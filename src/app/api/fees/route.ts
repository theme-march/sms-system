import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/db/prisma";
import {
  requirePermission,
  requireAnyPermission,
  authorizationStatus,
} from "@/src/lib/auth/authorize";
import { PERMISSIONS } from "@/src/config/permissions";
import { createAuditLog } from "@/src/lib/audit";
import { toClientData } from "@/src/lib/serialize";

const structureSchema = z.object({
  action: z.literal("createStructure"),
  name: z.string().trim().min(2).max(120),
  category: z.enum([
    "TUITION",
    "ADMISSION",
    "EXAM",
    "SESSION",
    "TRANSPORT",
    "LAB",
    "LIBRARY",
    "LATE_FINE",
    "EVENT",
    "OTHER",
  ]),
  amount: z.coerce.number().positive().max(10_000_000),
  frequency: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(
      /^[A-Za-z][A-Za-z0-9 _-]*$/,
      "Frequency may contain letters, numbers, spaces, underscores and hyphens.",
    ),
  description: z.string().trim().max(500).optional().default(""),
});
const invoiceSchema = z.object({
  action: z.literal("createInvoice"),
  studentId: z.string().min(1),
  feeStructureId: z.string().min(1),
  amount: z.coerce.number().positive().max(10_000_000),
  discount: z.coerce.number().min(0).max(10_000_000).default(0),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
const paymentSchema = z.object({
  action: z.literal("recordPayment"),
  invoiceId: z.string().min(1),
  amount: z.coerce.number().positive().max(10_000_000),
  paymentMethod: z.enum([
    "CASH",
    "BANK_TRANSFER",
    "BKASH",
    "NAGAD",
    "CHEQUE",
    "CARD",
  ]),
  transactionId: z.string().trim().max(120).optional().default(""),
  notes: z.string().trim().max(500).optional().default(""),
});
const cancelSchema = z.object({
  action: z.literal("cancelInvoice"),
  invoiceId: z.string().min(1),
});
const updateStructureSchema = z.object({
  action: z.literal("updateStructure"),
  id: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  category: z.enum([
    "TUITION",
    "ADMISSION",
    "EXAM",
    "SESSION",
    "TRANSPORT",
    "LAB",
    "LIBRARY",
    "LATE_FINE",
    "EVENT",
    "OTHER",
  ]),
  amount: z.coerce.number().positive().max(10_000_000),
  frequency: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[A-Za-z][A-Za-z0-9 _-]*$/),
  description: z.string().trim().max(500).optional().default(""),
});
const deleteStructureSchema = z.object({
  action: z.literal("deleteStructure"),
  id: z.string().min(1),
});
const bulkSchema = z.object({
  action: z.literal("generateTargetedInvoices"),
  category: z.enum([
    "TUITION",
    "ADMISSION",
    "EXAM",
    "SESSION",
    "TRANSPORT",
    "LAB",
    "LIBRARY",
    "LATE_FINE",
    "EVENT",
    "OTHER",
  ]),
  feeStructureId: z.string().min(1),
  academicYearId: z.string().min(1),
  classId: z.string().optional().default(""),
  groupId: z.string().optional().default(""),
  sectionId: z.string().optional().default(""),
  examId: z.string().optional().default(""),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
const requestSchema = z.discriminatedUnion("action", [
  structureSchema,
  updateStructureSchema,
  deleteStructureSchema,
  invoiceSchema,
  paymentSchema,
  cancelSchema,
  bulkSchema,
]);

function invoiceStatus(total: number, paid: number, dueDate: Date) {
  if (paid >= total) return "PAID" as const;
  if (paid > 0) return "PARTIAL" as const;
  if (dueDate < new Date()) return "OVERDUE" as const;
  return "PENDING" as const;
}

function inferCategory(name: string) {
  const value = name.toUpperCase();
  if (value.includes("EXAM")) return "EXAM";
  if (value.includes("ADMISSION")) return "ADMISSION";
  if (value.includes("TRANSPORT")) return "TRANSPORT";
  if (value.includes("LIBRARY")) return "LIBRARY";
  if (value.includes("LAB")) return "LAB";
  if (value.includes("SESSION")) return "SESSION";
  if (value.includes("LATE") || value.includes("FINE")) return "LATE_FINE";
  if (value.includes("EVENT")) return "EVENT";
  if (value.includes("TUITION") || value.includes("MONTHLY")) return "TUITION";
  return "OTHER";
}

async function linkStructureToFeeType(
  tx: any,
  schoolId: string,
  structureId: string,
  category: string,
  name: string,
  amount: number,
  description?: string,
) {
  const code = category;
  const feeType = await tx.feeType.upsert({
    where: { schoolId_code: { schoolId, code } },
    update: {
      name: category === "OTHER" ? name : `${category.replace(/_/g, " ")} Fee`,
      category,
      description: description || null,
      isRecurring: category === "TUITION",
    },
    create: {
      schoolId,
      name: category === "OTHER" ? name : `${category.replace(/_/g, " ")} Fee`,
      code,
      category,
      description: description || null,
      isRecurring: category === "TUITION",
    },
  });
  await tx.feeStructureItem.deleteMany({
    where: { feeStructureId: structureId },
  });
  await tx.feeStructureItem.create({
    data: { feeStructureId: structureId, feeTypeId: feeType.id, amount },
  });
  return feeType;
}

export async function GET() {
  try {
    const session = await requirePermission(PERMISSIONS.FEES_VIEW);
    const [
      rawStructures,
      invoices,
      students,
      payments,
      academicYears,
      classes,
      classGroups,
      exams,
      feeTypes,
      structureItems,
    ] = await Promise.all([
      prisma.feeStructure.findMany({
        where: { schoolId: session.schoolId },
        orderBy: { name: "asc" },
      }),
      prisma.feeInvoice.findMany({
        where: { schoolId: session.schoolId },
        include: {
          student: {
            select: {
              nameEn: true,
              studentCode: true,
              class: { select: { name: true } },
              section: { select: { name: true } },
            },
          },
          feeStructure: { select: { name: true, frequency: true } },
          payments: { orderBy: { paidAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
        take: 500,
      }),
      prisma.student.findMany({
        where: { schoolId: session.schoolId, status: "ACTIVE" },
        select: {
          id: true,
          nameEn: true,
          studentCode: true,
          class: { select: { name: true } },
          section: { select: { name: true } },
        },
        orderBy: { nameEn: "asc" },
        take: 2000,
      }),
      prisma.payment.findMany({
        where: { invoice: { schoolId: session.schoolId } },
        include: {
          invoice: {
            select: {
              invoiceNumber: true,
              student: { select: { nameEn: true, studentCode: true } },
            },
          },
        },
        orderBy: { paidAt: "desc" },
        take: 300,
      }),
      prisma.academicYear.findMany({
        where: {
          schoolId: session.schoolId,
          status: "ACTIVE",
          deletedAt: null,
        },
        select: { id: true, name: true, isCurrent: true },
        orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
      }),
      prisma.class.findMany({
        where: {
          schoolId: session.schoolId,
          status: "ACTIVE",
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          sections: {
            where: { status: "ACTIVE", deletedAt: null },
            select: { id: true, name: true },
            orderBy: { displayOrder: "asc" },
          },
        },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      }),
      prisma.classGroup.findMany({
        where: {
          schoolId: session.schoolId,
          status: "ACTIVE",
          deletedAt: null,
        },
        select: {
          academicYearId: true,
          classId: true,
          group: { select: { id: true, name: true } },
        },
      }),
      prisma.exam.findMany({
        where: { schoolId: session.schoolId },
        select: { id: true, name: true, year: true },
        orderBy: { startDate: "desc" },
        take: 100,
      }),
      prisma.feeType.findMany({
        where: { schoolId: session.schoolId },
        orderBy: { name: "asc" },
      }),
      prisma.feeStructureItem.findMany({
        where: { feeStructure: { schoolId: session.schoolId } },
        select: { feeStructureId: true, feeTypeId: true },
      }),
    ]);
    const feeTypeById = new Map(feeTypes.map((item) => [item.id, item]));
    const categoryByStructure = new Map(
      structureItems.map((item) => [
        item.feeStructureId,
        feeTypeById.get(item.feeTypeId)?.category,
      ]),
    );
    const structures = rawStructures.map((item) => ({
      ...item,
      category: categoryByStructure.get(item.id) || inferCategory(item.name),
    }));
    const normalizedInvoices = invoices.map((item) => {
      const total = Number(item.amount) - Number(item.discount);
      const paid = Number(item.paidAmount);
      const computed =
        item.status === "CANCELLED"
          ? "CANCELLED"
          : invoiceStatus(total, paid, item.dueDate);
      return {
        ...item,
        amount: Number(item.amount),
        discount: Number(item.discount),
        paidAmount: paid,
        dueAmount: Math.max(0, total - paid),
        status: computed,
        dueDate: item.dueDate.toISOString().slice(0, 10),
        createdAt: item.createdAt.toISOString(),
        payments: item.payments.map((payment) => ({
          ...payment,
          amount: Number(payment.amount),
          paidAt: payment.paidAt.toISOString(),
        })),
      };
    });
    const totals = normalizedInvoices
      .filter((item) => item.status !== "CANCELLED")
      .reduce(
        (sum, item) => ({
          invoiced: sum.invoiced + item.amount - item.discount,
          collected: sum.collected + item.paidAmount,
          outstanding: sum.outstanding + item.dueAmount,
          overdue:
            sum.overdue + (item.status === "OVERDUE" ? item.dueAmount : 0),
        }),
        { invoiced: 0, collected: 0, outstanding: 0, overdue: 0 },
      );
    return NextResponse.json(
      toClientData({
        canManage:
          session.roles.includes("Super Admin") ||
          session.permissions.includes(PERMISSIONS.FEES_MANAGE),
        canCollect:
          session.roles.includes("Super Admin") ||
          session.permissions.includes(PERMISSIONS.PAYMENTS_COLLECT),
        feeTypes,
        structures,
        invoices: normalizedInvoices,
        students,
        payments,
        totals,
        academicYears,
        classes,
        classGroups: classGroups.map((item) => ({
          academicYearId: item.academicYearId,
          classId: item.classId,
          groupId: item.group.id,
          groupName: item.group.name,
        })),
        exams,
      }),
    );
  } catch (error) {
    console.error("GET /api/fees error", error);
    return NextResponse.json(
      { error: "Unable to load fees and invoices." },
      { status: authorizationStatus(error) },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAnyPermission([
      PERMISSIONS.FEES_MANAGE,
      PERMISSIONS.PAYMENTS_COLLECT,
    ]);
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid fee data." },
        { status: 400 },
      );
    const input = parsed.data;
    const isSuperAdmin = session.roles.includes("Super Admin");
    const canManageFees =
      isSuperAdmin || session.permissions.includes(PERMISSIONS.FEES_MANAGE);
    const canCollectPayments =
      isSuperAdmin ||
      session.permissions.includes(PERMISSIONS.PAYMENTS_COLLECT);
    if (input.action === "recordPayment") {
      if (!canCollectPayments) throw new Error("FORBIDDEN");
    } else if (!canManageFees) {
      throw new Error("FORBIDDEN");
    }
    if (input.action === "createStructure") {
      const duplicate = await prisma.feeStructure.findFirst({
        where: {
          schoolId: session.schoolId,
          name: input.name,
          frequency: input.frequency,
        },
      });
      if (duplicate)
        return NextResponse.json(
          {
            error:
              "A fee structure with this name and frequency already exists.",
          },
          { status: 409 },
        );
      const record = await prisma.$transaction(async (tx) => {
        const created = await tx.feeStructure.create({
          data: {
            schoolId: session.schoolId,
            name: input.name,
            amount: input.amount,
            frequency: input.frequency,
            description: input.description || null,
          },
        });
        await linkStructureToFeeType(
          tx,
          session.schoolId,
          created.id,
          input.category,
          input.name,
          input.amount,
          input.description,
        );
        return created;
      });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "CREATE",
        module: "Fees",
        recordId: record.id,
        details: `Created fee structure ${record.name}`,
      });
      return NextResponse.json(toClientData(record), { status: 201 });
    }
    if (input.action === "updateStructure") {
      const owned = await prisma.feeStructure.findFirst({
        where: { id: input.id, schoolId: session.schoolId },
        select: { id: true },
      });
      if (!owned)
        return NextResponse.json(
          { error: "Fee structure was not found." },
          { status: 404 },
        );
      const duplicate = await prisma.feeStructure.findFirst({
        where: {
          schoolId: session.schoolId,
          name: input.name,
          frequency: input.frequency,
          id: { not: input.id },
        },
        select: { id: true },
      });
      if (duplicate)
        return NextResponse.json(
          {
            error:
              "Another fee structure with this name and frequency already exists.",
          },
          { status: 409 },
        );
      const record = await prisma.$transaction(async (tx) => {
        const updated = await tx.feeStructure.update({
          where: { id: input.id },
          data: {
            name: input.name,
            amount: input.amount,
            frequency: input.frequency,
            description: input.description || null,
          },
        });
        await linkStructureToFeeType(
          tx,
          session.schoolId,
          updated.id,
          input.category,
          input.name,
          input.amount,
          input.description,
        );
        return updated;
      });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "UPDATE",
        module: "Fees",
        recordId: record.id,
        details: `Updated fee structure ${record.name}. Existing invoices were not changed.`,
      });
      return NextResponse.json(toClientData(record));
    }
    if (input.action === "deleteStructure") {
      const owned = await prisma.feeStructure.findFirst({
        where: { id: input.id, schoolId: session.schoolId },
        select: {
          id: true,
          name: true,
          _count: { select: { invoices: true } },
        },
      });
      if (!owned)
        return NextResponse.json(
          { error: "Fee structure was not found." },
          { status: 404 },
        );
      if (owned._count.invoices > 0)
        return NextResponse.json(
          {
            error: `Cannot delete this structure because ${owned._count.invoices} invoice(s) use it. Cancel unused invoices or keep the structure for financial history.`,
          },
          { status: 409 },
        );
      await prisma.feeStructure.delete({ where: { id: owned.id } });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "DELETE",
        module: "Fees",
        recordId: owned.id,
        details: `Deleted unused fee structure ${owned.name}`,
      });
      return NextResponse.json({ ok: true });
    }
    if (input.action === "createInvoice") {
      const [student, structure] = await Promise.all([
        prisma.student.findFirst({
          where: { id: input.studentId, schoolId: session.schoolId },
          select: { id: true },
        }),
        prisma.feeStructure.findFirst({
          where: { id: input.feeStructureId, schoolId: session.schoolId },
        }),
      ]);
      if (!student || !structure)
        return NextResponse.json(
          { error: "Student or fee structure was not found." },
          { status: 404 },
        );
      if (input.discount >= input.amount)
        return NextResponse.json(
          { error: "Discount must be less than the invoice amount." },
          { status: 400 },
        );
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;
      const record = await prisma.feeInvoice.create({
        data: {
          schoolId: session.schoolId,
          studentId: input.studentId,
          feeStructureId: input.feeStructureId,
          invoiceNumber,
          amount: input.amount,
          discount: input.discount,
          dueDate: new Date(`${input.dueDate}T12:00:00.000Z`),
          status: invoiceStatus(
            input.amount - input.discount,
            0,
            new Date(`${input.dueDate}T12:00:00.000Z`),
          ),
        },
      });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "CREATE",
        module: "Fees",
        recordId: record.id,
        details: `Created invoice ${invoiceNumber}`,
      });
      return NextResponse.json(toClientData(record), { status: 201 });
    }
    if (input.action === "recordPayment") {
      const invoice = await prisma.feeInvoice.findFirst({
        where: { id: input.invoiceId, schoolId: session.schoolId },
        include: { student: { select: { nameEn: true } } },
      });
      if (!invoice || invoice.status === "CANCELLED")
        return NextResponse.json(
          { error: "Active invoice was not found." },
          { status: 404 },
        );
      const total = Number(invoice.amount) - Number(invoice.discount);
      const due = total - Number(invoice.paidAmount);
      if (input.amount > due)
        return NextResponse.json(
          {
            error: `Payment cannot exceed the outstanding amount (${due.toFixed(2)}).`,
          },
          { status: 400 },
        );
      const receiptNumber = `REC-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;
      const paidAmount = Number(invoice.paidAmount) + input.amount;
      const result = await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.create({
          data: {
            invoiceId: invoice.id,
            receiptNumber,
            amount: input.amount,
            paymentMethod: input.paymentMethod,
            transactionId: input.transactionId || null,
            notes: input.notes || null,
          },
        });
        await tx.feeInvoice.update({
          where: { id: invoice.id },
          data: {
            paidAmount,
            status: invoiceStatus(total, paidAmount, invoice.dueDate),
          },
        });
        return payment;
      });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "CREATE",
        module: "Fees",
        recordId: result.id,
        details: `Recorded ${receiptNumber} for ${invoice.invoiceNumber}`,
      });
      return NextResponse.json(toClientData(result), { status: 201 });
    }
    if (input.action === "generateTargetedInvoices") {
      if (input.category === "EXAM" && !input.examId)
        return NextResponse.json(
          { error: "Select an examination for exam fees." },
          { status: 400 },
        );
      const structure = await prisma.feeStructure.findFirst({
        where: { id: input.feeStructureId, schoolId: session.schoolId },
      });
      if (!structure)
        return NextResponse.json(
          { error: "Select a valid fee structure." },
          { status: 404 },
        );
      const structureLink = await prisma.feeStructureItem.findFirst({
        where: { feeStructureId: structure.id },
        select: { feeTypeId: true },
      });
      const linkedType = structureLink
        ? await prisma.feeType.findFirst({
            where: { id: structureLink.feeTypeId, schoolId: session.schoolId },
            select: { category: true },
          })
        : null;
      const structureCategory =
        linkedType?.category || inferCategory(structure.name);
      if (structureCategory !== input.category)
        return NextResponse.json(
          { error: "The selected fee structure does not match this category." },
          { status: 400 },
        );
      const structureAmount = Number(structure.amount);
      const enrollments = await prisma.studentEnrollment.findMany({
        where: {
          schoolId: session.schoolId,
          academicYearId: input.academicYearId,
          ...(input.classId ? { classId: input.classId } : {}),
          enrollmentStatus: "ACTIVE",
          ...(input.sectionId ? { sectionId: input.sectionId } : {}),
          ...(input.groupId ? { groupId: input.groupId } : {}),
        },
        select: { studentId: true },
      });
      if (!enrollments.length)
        return NextResponse.json(
          {
            error:
              "No active students match the selected academic year, class, group and section.",
          },
          { status: 404 },
        );
      await prisma.$transaction((tx) =>
        linkStructureToFeeType(
          tx,
          session.schoolId,
          structure.id,
          input.category,
          structure.name,
          structureAmount,
          structure.description || `${input.category} fee`,
        ),
      );
      const dueDate = new Date(`${input.dueDate}T12:00:00.000Z`);
      let generatedCount = 0;
      let skippedCount = 0;
      for (const enrollment of enrollments) {
        const duplicate = await prisma.feeInvoice.findFirst({
          where: {
            schoolId: session.schoolId,
            studentId: enrollment.studentId,
            feeStructureId: structure.id,
            dueDate,
          },
        });
        if (duplicate) {
          skippedCount++;
          continue;
        }
        await prisma.feeInvoice.create({
          data: {
            schoolId: session.schoolId,
            studentId: enrollment.studentId,
            feeStructureId: structure.id,
            invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-7)}-${generatedCount}`,
            amount: structureAmount,
            discount: 0,
            dueDate,
            status: invoiceStatus(structureAmount, 0, dueDate),
          },
        });
        generatedCount++;
      }
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "CREATE",
        module: "Fees",
        recordId: structure.id,
        details: `Generated ${generatedCount} ${input.category} invoices for targeted class/group/section; skipped ${skippedCount}`,
      });
      return NextResponse.json(
        { generatedCount, skippedCount },
        { status: 201 },
      );
    }
    const invoice = await prisma.feeInvoice.findFirst({
      where: { id: input.invoiceId, schoolId: session.schoolId },
      select: { id: true, invoiceNumber: true, paidAmount: true },
    });
    if (!invoice)
      return NextResponse.json(
        { error: "Invoice was not found." },
        { status: 404 },
      );
    if (Number(invoice.paidAmount) > 0)
      return NextResponse.json(
        { error: "An invoice with payments cannot be cancelled." },
        { status: 409 },
      );
    await prisma.feeInvoice.update({
      where: { id: invoice.id },
      data: { status: "CANCELLED" },
    });
    await createAuditLog({
      schoolId: session.schoolId,
      userId: session.id,
      action: "UPDATE",
      module: "Fees",
      recordId: invoice.id,
      details: `Cancelled invoice ${invoice.invoiceNumber}`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/fees error", error);
    const message =
      error instanceof Error &&
      !["UNAUTHORIZED", "FORBIDDEN", "SCHOOL_CONTEXT_REQUIRED"].includes(
        error.message,
      )
        ? error.message
        : "Unable to save fee operation.";
    return NextResponse.json(
      { error: message },
      {
        status:
          authorizationStatus(error) === 500 ? 500 : authorizationStatus(error),
      },
    );
  }
}
