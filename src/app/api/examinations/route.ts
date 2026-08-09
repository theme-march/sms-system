import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/db/prisma";
import {
  authorizationStatus,
  requirePermission,
} from "@/src/lib/auth/authorize";
import { PERMISSIONS } from "@/src/config/permissions";
import { createAuditLog } from "@/src/lib/audit";
import { calculateOverallResult } from "@/src/lib/exam-calculations";

const MANAGEMENT_ROLES = [
  "Super Admin",
  "School Admin",
  "Academic Admin",
  "Admission Officer",
  "Accountant",
  "HR Manager",
];

type AuthorizedSession = Awaited<ReturnType<typeof requirePermission>>;

function isTeacherOnly(session: AuthorizedSession) {
  return (
    session.roles.includes("Teacher") &&
    !session.roles.some((role) => MANAGEMENT_ROLES.includes(role))
  );
}

async function getTeacherMarksAssignments(session: AuthorizedSession) {
  if (!isTeacherOnly(session)) return null;
  return prisma.teacherAssignment.findMany({
    where: {
      schoolId: session.schoolId,
      status: "ACTIVE",
      teacher: { userId: session.id, status: "ACTIVE" },
    },
    select: {
      classId: true,
      sectionId: true,
      subjectId: true,
      academicYear: { select: { name: true, startDate: true, endDate: true } },
    },
  });
}

function assignmentMatchesExam(
  assignment: NonNullable<Awaited<ReturnType<typeof getTeacherMarksAssignments>>>[number],
  exam: { year: number; startDate: Date; endDate: Date },
) {
  return (
    assignment.academicYear.name.includes(String(exam.year)) ||
    (assignment.academicYear.startDate <= exam.startDate &&
      assignment.academicYear.endDate >= exam.endDate)
  );
}

async function canAccessTeacherMarksSheet(
  session: AuthorizedSession,
  ids: { examId: string; classId: string; sectionId: string; subjectId: string },
) {
  const assignments = await getTeacherMarksAssignments(session);
  if (!assignments) return true;
  const exam = await prisma.exam.findFirst({
    where: { id: ids.examId, schoolId: session.schoolId },
    select: { year: true, startDate: true, endDate: true },
  });
  if (!exam) return false;
  return assignments.some(
    (assignment) =>
      assignment.classId === ids.classId &&
      assignment.sectionId === ids.sectionId &&
      assignment.subjectId === ids.subjectId &&
      assignmentMatchesExam(assignment, exam),
  );
}

const examSchema = z.object({
  name: z.string().trim().min(3).max(191),
  term: z.string().trim().min(2).max(100),
  year: z.coerce.number().int().min(2000).max(2100),
  startDate: z.string().date(),
  endDate: z.string().date(),
  classId: z.string().trim().min(1),
  sectionId: z.string().trim().optional().or(z.literal("")),
  assignments: z
    .array(
      z.object({
        classId: z.string().trim().min(1),
        sectionId: z.string().trim().optional().or(z.literal("")),
      }),
    )
    .min(1)
    .max(100)
    .optional(),
});

const routineSchema = z.object({
  id: z.string().optional(),
  academicYearId: z.string().min(1),
  examId: z.string().min(1),
  classId: z.string().min(1),
  sectionId: z.string().optional().or(z.literal("")),
  subjectId: z.string().min(1),
  examDate: z.string().date(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  roomId: z.string().optional().or(z.literal("")),
  totalMarks: z.coerce.number().positive().max(999),
  passMarks: z.coerce.number().nonnegative().max(999),
  instructions: z.string().max(2000).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]),
});

const marksSchema = z.object({
  examId: z.string().min(1),
  classId: z.string().min(1),
  sectionId: z.string().min(1),
  subjectId: z.string().min(1),
  rows: z
    .array(
      z.object({
        studentId: z.string().min(1),
        marks: z.coerce.number().min(0).max(999),
        absent: z.boolean().default(false),
        comments: z.string().max(500).optional().or(z.literal("")),
      }),
    )
    .min(1)
    .max(300),
});

function dateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}
function serialize<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, item) =>
      typeof item === "object" && item && typeof item.toNumber === "function"
        ? item.toNumber()
        : item,
    ),
  );
}
function grade(percent: number) {
  if (percent >= 80) return { letter: "A+", point: 5 };
  if (percent >= 70) return { letter: "A", point: 4 };
  if (percent >= 60) return { letter: "A-", point: 3.5 };
  if (percent >= 50) return { letter: "B", point: 3 };
  if (percent >= 40) return { letter: "C", point: 2 };
  if (percent >= 33) return { letter: "D", point: 1 };
  return { letter: "F", point: 0 };
}
function duration(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}
async function owns(
  schoolId: string,
  type: "exam" | "class" | "section" | "subject" | "year" | "room",
  id: string,
) {
  if (!id && (type === "section" || type === "room")) return true;
  if (type === "exam")
    return Boolean(
      await prisma.exam.findFirst({
        where: { id, schoolId },
        select: { id: true },
      }),
    );
  if (type === "class")
    return Boolean(
      await prisma.class.findFirst({
        where: { id, schoolId, deletedAt: null },
        select: { id: true },
      }),
    );
  if (type === "section")
    return Boolean(
      await prisma.section.findFirst({
        where: { id, schoolId, deletedAt: null },
        select: { id: true },
      }),
    );
  if (type === "subject")
    return Boolean(
      await prisma.subject.findFirst({
        where: { id, schoolId, deletedAt: null },
        select: { id: true },
      }),
    );
  if (type === "year")
    return Boolean(
      await prisma.academicYear.findFirst({
        where: { id, schoolId, deletedAt: null },
        select: { id: true },
      }),
    );
  return Boolean(
    await prisma.room.findFirst({
      where: { id, schoolId, deletedAt: null },
      select: { id: true },
    }),
  );
}

export async function GET(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.EXAMS_VIEW);
    const teacherMarksAssignments = await getTeacherMarksAssignments(session);
    const examId = request.nextUrl.searchParams.get("examId") || "";
    const classId = request.nextUrl.searchParams.get("classId") || "";
    const sectionId = request.nextUrl.searchParams.get("sectionId") || "";
    const subjectId = request.nextUrl.searchParams.get("subjectId") || "";
    const [
      school,
      years,
      classes,
      subjects,
      rooms,
      classSubjectMappings,
      exams,
      examClasses,
      examSubjects,
      routines,
      marks,
      results,
      publications,
    ] = await Promise.all([
      prisma.school.findUnique({
        where: { id: session.schoolId },
        select: { name: true },
      }),
      prisma.academicYear.findMany({
        where: {
          schoolId: session.schoolId,
          status: "ACTIVE",
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          isCurrent: true,
          startDate: true,
          endDate: true,
        },
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
          code: true,
          sections: {
            where: { status: "ACTIVE", deletedAt: null },
            select: { id: true, name: true },
            orderBy: { displayOrder: "asc" },
          },
        },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      }),
      prisma.subject.findMany({
        where: {
          schoolId: session.schoolId,
          status: "ACTIVE",
          deletedAt: null,
        },
        select: { id: true, nameEn: true, code: true },
        orderBy: { nameEn: "asc" },
      }),
      prisma.room.findMany({
        where: {
          schoolId: session.schoolId,
          status: "ACTIVE",
          deletedAt: null,
        },
        select: { id: true, name: true, code: true },
        orderBy: { name: "asc" },
      }),
      prisma.classSubject.findMany({
        where: {
          schoolId: session.schoolId,
          status: "ACTIVE",
          deletedAt: null,
        },
        select: {
          classId: true,
          subjectId: true,
          fullMarks: true,
          passMarks: true,
          subjectType: true,
        },
      }),
      prisma.exam.findMany({
        where: { schoolId: session.schoolId },
        orderBy: [{ year: "desc" }, { startDate: "desc" }],
      }),
      prisma.examClass.findMany({
        where: {
          examId: {
            in: (
              await prisma.exam.findMany({
                where: { schoolId: session.schoolId },
                select: { id: true },
              })
            ).map((item) => item.id),
          },
        },
      }),
      prisma.examSubject.findMany({
        where: {
          examId: {
            in: (
              await prisma.exam.findMany({
                where: { schoolId: session.schoolId },
                select: { id: true },
              })
            ).map((item) => item.id),
          },
        },
      }),
      prisma.examRoutine.findMany({
        where: {
          schoolId: session.schoolId,
          ...(examId ? { examId } : {}),
          ...(classId ? { classId } : {}),
          ...(sectionId ? { sectionId } : {}),
          ...(subjectId ? { subjectId } : {}),
        },
        orderBy: [{ examDate: "asc" }, { startTime: "asc" }],
        take: 500,
      }),
      prisma.mark.findMany({
        where: {
          exam: { schoolId: session.schoolId },
          ...(examId ? { examId } : {}),
          ...(subjectId ? { subjectId } : {}),
          ...(classId || sectionId
            ? {
                student: {
                  ...(classId ? { classId } : {}),
                  ...(sectionId ? { sectionId } : {}),
                },
              }
            : {}),
        },
        include: {
          student: {
            select: {
              nameEn: true,
              rollNumber: true,
              classId: true,
              sectionId: true,
            },
          },
        },
        orderBy: [{ student: { rollNumber: "asc" } }, { subjectId: "asc" }],
        take: 2000,
      }),
      prisma.studentResult.findMany({
        where: {
          schoolId: session.schoolId,
          ...(examId ? { examId } : {}),
          ...(classId ? { classId } : {}),
          ...(sectionId ? { sectionId } : {}),
        },
        orderBy: [{ classPosition: "asc" }, { totalMarks: "desc" }],
        take: 1000,
      }),
      prisma.resultPublication.findMany({
        where: { schoolId: session.schoolId },
        orderBy: { publishedAt: "desc" },
      }),
    ]);
    const classMap = new Map(classes.map((item) => [item.id, item]));
    const sectionMap = new Map(
      classes.flatMap((item) => item.sections).map((item) => [item.id, item]),
    );
    const subjectMap = new Map(subjects.map((item) => [item.id, item]));
    const examMap = new Map(exams.map((item) => [item.id, item]));
    const studentIds = [
      ...new Set([
        ...marks.map((item) => item.studentId),
        ...results.map((item) => item.studentId),
      ]),
    ];
    const students = await prisma.student.findMany({
      where: { schoolId: session.schoolId, id: { in: studentIds } },
      select: { id: true, nameEn: true, rollNumber: true },
    });
    const studentMap = new Map(students.map((item) => [item.id, item]));
    const selectedExam = examId ? examMap.get(examId) : undefined;
    const marksScope = teacherMarksAssignments
      ? exams.flatMap((exam) =>
          teacherMarksAssignments
            .filter((assignment) => assignmentMatchesExam(assignment, exam))
            .map((assignment) => ({
              examId: exam.id,
              classId: assignment.classId,
              sectionId: assignment.sectionId,
              subjectId: assignment.subjectId,
            })),
        )
      : null;
    const requestedMarksSheetAllowed =
      !marksScope ||
      !examId ||
      !classId ||
      !sectionId ||
      !subjectId ||
      marksScope.some(
        (scope) =>
          scope.examId === examId &&
          scope.classId === classId &&
          scope.sectionId === sectionId &&
          scope.subjectId === subjectId,
      );
    const visibleMarks = marksScope
      ? marks.filter((mark) =>
          marksScope.some(
            (scope) =>
              scope.examId === mark.examId &&
              scope.classId === mark.student.classId &&
              scope.sectionId === mark.student.sectionId &&
              scope.subjectId === mark.subjectId,
          ),
        )
      : marks;
    let roster: Array<{
      studentId: string;
      name: string;
      roll: number;
      existingMark: number | null;
      absent: boolean;
      comments: string;
      locked: boolean;
    }> = [];
    if (
      requestedMarksSheetAllowed &&
      selectedExam &&
      classId &&
      sectionId &&
      subjectId
    ) {
      const year =
        years.find((item) => item.name.includes(String(selectedExam.year))) ||
        years.find((item) => item.isCurrent);
      const enrollments = await prisma.studentEnrollment.findMany({
        where: {
          schoolId: session.schoolId,
          classId,
          sectionId,
          enrollmentStatus: "ACTIVE",
          ...(year ? { academicYearId: year.id } : {}),
        },
        include: { student: { select: { id: true, nameEn: true } } },
        orderBy: { rollNumber: "asc" },
      });
      const existing = new Map(
        visibleMarks
          .filter(
            (item) => item.examId === examId && item.subjectId === subjectId,
          )
          .map((item) => [item.studentId, item]),
      );
      roster = enrollments.map((item) => {
        const mark = existing.get(item.studentId);
        return {
          studentId: item.studentId,
          name: item.student.nameEn,
          roll: item.rollNumber,
          existingMark: mark ? Number(mark.marksObtained) : null,
          absent: mark?.comments === "ABSENT",
          comments:
            mark?.comments && mark.comments !== "ABSENT" ? mark.comments : "",
          locked: mark?.isLocked || false,
        };
      });
    }
    const effectiveExamClasses = [...examClasses];
    for (const routine of routines) {
      if (
        !effectiveExamClasses.some(
          (item) =>
            item.examId === routine.examId &&
            item.classId === routine.classId &&
            item.sectionId === routine.sectionId,
        )
      ) {
        effectiveExamClasses.push({
          id: `legacy-${routine.examId}-${routine.classId}-${routine.sectionId || "all"}`,
          examId: routine.examId,
          classId: routine.classId,
          sectionId: routine.sectionId,
          createdAt: routine.createdAt,
        });
      }
    }
    for (const mark of marks) {
      if (!mark.student.classId) continue;
      if (
        !effectiveExamClasses.some(
          (item) =>
            item.examId === mark.examId &&
            item.classId === mark.student.classId &&
            item.sectionId === mark.student.sectionId,
        )
      ) {
        effectiveExamClasses.push({
          id: `legacy-${mark.examId}-${mark.student.classId}-${mark.student.sectionId || "all"}`,
          examId: mark.examId,
          classId: mark.student.classId,
          sectionId: mark.student.sectionId,
          createdAt: mark.createdAt,
        });
      }
    }
    const effectiveExamSubjects = [...examSubjects];
    for (const link of effectiveExamClasses) {
      const mappings = classSubjectMappings.filter(
        (item) => item.classId === link.classId,
      );
      for (const mapping of mappings) {
        if (
          !effectiveExamSubjects.some(
            (item) =>
              item.examId === link.examId &&
              item.classId === link.classId &&
              item.subjectId === mapping.subjectId,
          )
        ) {
          effectiveExamSubjects.push({
            id: `legacy-${link.examId}-${link.classId}-${mapping.subjectId}`,
            examId: link.examId,
            classId: link.classId,
            subjectId: mapping.subjectId,
            fullMarks: mapping.fullMarks as any,
            passMarks: mapping.passMarks as any,
            isOptional:
              mapping.subjectType === "optional" ||
              mapping.subjectType === "additional",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }
    const configuredSubjects = effectiveExamSubjects.map((item) => ({
      ...serialize(item),
      subjectName: subjectMap.get(item.subjectId)?.nameEn || "—",
      subjectCode: subjectMap.get(item.subjectId)?.code || "",
      inferred: item.id.startsWith("legacy-"),
    }));
    return NextResponse.json({
      schoolName: school?.name || "School",
      permissions: {
        manage:
          session.roles.includes("Super Admin") ||
          session.permissions.includes(PERMISSIONS.EXAMS_MANAGE),
        enterMarks:
          session.roles.includes("Super Admin") ||
          session.permissions.includes(PERMISSIONS.MARKS_ENTER),
        verifyMarks:
          session.roles.includes("Super Admin") ||
          session.permissions.includes(PERMISSIONS.MARKS_VERIFY),
        unlockMarks:
          session.roles.includes("Super Admin") ||
          session.permissions.includes(PERMISSIONS.MARKS_LOCK),
        calculate:
          session.roles.includes("Super Admin") ||
          session.permissions.includes(PERMISSIONS.RESULTS_CALCULATE),
        publish:
          session.roles.includes("Super Admin") ||
          session.permissions.includes(PERMISSIONS.RESULTS_PUBLISH),
      },
      marksScope,
      years: years.map((item) => ({
        ...item,
        startDate: dateOnly(item.startDate),
        endDate: dateOnly(item.endDate),
      })),
      classes,
      subjects,
      rooms,
      exams: exams.map((item) => ({
        ...item,
        startDate: dateOnly(item.startDate),
        endDate: dateOnly(item.endDate),
        classes: effectiveExamClasses
          .filter((link) => link.examId === item.id)
          .map((link) => ({
            classId: link.classId,
            sectionId: link.sectionId,
            className: classMap.get(link.classId)?.name || "—",
            sectionName: link.sectionId
              ? sectionMap.get(link.sectionId)?.name || "—"
              : "All sections",
          })),
        subjectCount: configuredSubjects.filter(
          (subject) => subject.examId === item.id,
        ).length,
      })),
      examSubjects: configuredSubjects,
      routines: routines.map((item) => ({
        ...serialize(item),
        examDate: dateOnly(item.examDate),
        examName: examMap.get(item.examId)?.name || "—",
        className: classMap.get(item.classId)?.name || "—",
        sectionName: item.sectionId
          ? sectionMap.get(item.sectionId)?.name || "—"
          : "All sections",
        subjectName: subjectMap.get(item.subjectId)?.nameEn || "—",
      })),
      marks: visibleMarks.map((item) => ({
        id: item.id,
        examId: item.examId,
        examName: examMap.get(item.examId)?.name || "—",
        studentId: item.studentId,
        studentName: item.student.nameEn,
        roll: item.student.rollNumber,
        classId: item.student.classId,
        sectionId: item.student.sectionId,
        subjectId: item.subjectId,
        subjectName: subjectMap.get(item.subjectId)?.nameEn || "—",
        marks: Number(item.marksObtained),
        maxMarks: Number(item.maxMarks),
        grade: item.grade,
        comments: item.comments,
        locked: item.isLocked,
      })),
      roster,
      results: results.map((item) => ({
        ...serialize(item),
        studentName: studentMap.get(item.studentId)?.nameEn || "—",
        roll: studentMap.get(item.studentId)?.rollNumber,
        className: classMap.get(item.classId)?.name || "—",
        sectionName: sectionMap.get(item.sectionId)?.name || "—",
      })),
      publications,
    });
  } catch (error) {
    console.error("GET /api/examinations error", error);
    return NextResponse.json(
      { error: "Unable to load examination data." },
      { status: authorizationStatus(error) },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = typeof body.action === "string" ? body.action : "";
    if (action === "createExam") {
      const session = await requirePermission(PERMISSIONS.EXAMS_MANAGE);
      const parsed = examSchema.parse(body);
      const assignments = parsed.assignments?.length
        ? parsed.assignments
        : [{ classId: parsed.classId, sectionId: parsed.sectionId }];
      const uniqueAssignments = assignments.filter(
        (item, index, rows) =>
          rows.findIndex(
            (row) =>
              row.classId === item.classId &&
              (row.sectionId || "") === (item.sectionId || ""),
          ) === index,
      );
      if (parsed.endDate < parsed.startDate)
        return NextResponse.json(
          { error: "End date cannot be before start date." },
          { status: 400 },
        );
      const assignmentValidity = await Promise.all(
        uniqueAssignments.flatMap((item) => [
          owns(session.schoolId, "class", item.classId),
          owns(session.schoolId, "section", item.sectionId || ""),
        ]),
      );
      if (assignmentValidity.some((item) => !item))
        return NextResponse.json(
          { error: "Invalid class or section." },
          { status: 400 },
        );
      const year = await prisma.academicYear.findFirst({
        where: {
          schoolId: session.schoolId,
          name: { contains: String(parsed.year) },
          status: "ACTIVE",
          deletedAt: null,
        },
        select: { id: true },
      });
      const classSubjects = await prisma.classSubject.findMany({
        where: {
          schoolId: session.schoolId,
          classId: { in: uniqueAssignments.map((item) => item.classId) },
          status: "ACTIVE",
          deletedAt: null,
          AND: [
            { OR: [{ academicYearId: year?.id }, { academicYearId: null }] },
          ],
        },
        select: {
          classId: true,
          subjectId: true,
          fullMarks: true,
          passMarks: true,
          subjectType: true,
        },
      });
      if (!classSubjects.length)
        return NextResponse.json(
          {
            error:
              "Configure Class–Subject mappings before creating this exam.",
          },
          { status: 409 },
        );
      const missingClassIds = uniqueAssignments
        .map((item) => item.classId)
        .filter(
          (classId) =>
            !classSubjects.some((subject) => subject.classId === classId),
        );
      if (missingClassIds.length)
        return NextResponse.json(
          {
            error:
              "One or more selected classes have no Class–Subject mapping.",
          },
          { status: 409 },
        );
      const exam = await prisma.$transaction(async (tx) => {
        const created = await tx.exam.create({
          data: {
            schoolId: session.schoolId,
            name: parsed.name,
            term: parsed.term,
            year: parsed.year,
            startDate: new Date(`${parsed.startDate}T00:00:00.000Z`),
            endDate: new Date(`${parsed.endDate}T00:00:00.000Z`),
          },
        });
        await tx.examClass.createMany({
          data: uniqueAssignments.map((item) => ({
            examId: created.id,
            classId: item.classId,
            sectionId: item.sectionId || null,
          })),
        });
        await tx.examSubject.createMany({
          data: classSubjects.map((item) => ({
            examId: created.id,
            classId: item.classId,
            subjectId: item.subjectId,
            fullMarks: item.fullMarks,
            passMarks: item.passMarks,
            isOptional:
              item.subjectType === "optional" ||
              item.subjectType === "additional",
          })),
        });
        return created;
      });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "CREATE",
        module: "Examinations",
        recordId: exam.id,
        details: `Created ${exam.name} for ${uniqueAssignments.length} class/section assignment(s) with ${classSubjects.length} subjects`,
      });
      return NextResponse.json(exam, { status: 201 });
    }
    if (action === "updateExam") {
      const session = await requirePermission(PERMISSIONS.EXAMS_MANAGE);
      const parsed = examSchema.extend({ id: z.string().min(1) }).parse(body);
      const exam = await prisma.exam.findFirst({
        where: { id: parsed.id, schoolId: session.schoolId },
      });
      if (!exam)
        return NextResponse.json({ error: "Exam not found." }, { status: 404 });
      if (parsed.endDate < parsed.startDate)
        return NextResponse.json(
          { error: "End date cannot be before start date." },
          { status: 400 },
        );
      const requestedAssignments = parsed.assignments?.length
        ? parsed.assignments
        : [{ classId: parsed.classId, sectionId: parsed.sectionId }];
      const existingAssignments = await prisma.examClass.findMany({
        where: { examId: parsed.id },
      });
      const additions = requestedAssignments.filter(
        (item) =>
          !existingAssignments.some(
            (existing) =>
              existing.classId === item.classId &&
              (existing.sectionId || "") === (item.sectionId || ""),
          ),
      );
      const additionValidity = await Promise.all(
        additions.flatMap((item) => [
          owns(session.schoolId, "class", item.classId),
          owns(session.schoolId, "section", item.sectionId || ""),
        ]),
      );
      if (additionValidity.some((item) => !item))
        return NextResponse.json(
          { error: "Invalid class or section." },
          { status: 400 },
        );
      const year = await prisma.academicYear.findFirst({
        where: {
          schoolId: session.schoolId,
          name: { contains: String(parsed.year) },
          status: "ACTIVE",
          deletedAt: null,
        },
        select: { id: true },
      });
      const existingClassIds = new Set(
        existingAssignments.map((item) => item.classId),
      );
      const additionClassIds = [
        ...new Set(
          additions
            .map((item) => item.classId)
            .filter((classId) => !existingClassIds.has(classId)),
        ),
      ];
      const additionSubjects = additionClassIds.length
        ? await prisma.classSubject.findMany({
            where: {
              schoolId: session.schoolId,
              classId: { in: additionClassIds },
              status: "ACTIVE",
              deletedAt: null,
              AND: [
                { OR: [{ academicYearId: year?.id }, { academicYearId: null }] },
              ],
            },
          })
        : [];
      if (
        additionClassIds.some(
          (classId) =>
            !additionSubjects.some((subject) => subject.classId === classId),
        )
      )
        return NextResponse.json(
          { error: "A selected class has no Class–Subject mapping." },
          { status: 409 },
        );
      await prisma.$transaction(async (tx) => {
        await tx.exam.update({
          where: { id: parsed.id },
          data: {
            name: parsed.name,
            term: parsed.term,
            year: parsed.year,
            startDate: new Date(`${parsed.startDate}T00:00:00.000Z`),
            endDate: new Date(`${parsed.endDate}T00:00:00.000Z`),
          },
        });
        if (additions.length)
          await tx.examClass.createMany({
            data: additions.map((item) => ({
              examId: parsed.id,
              classId: item.classId,
              sectionId: item.sectionId || null,
            })),
          });
        if (additionSubjects.length)
          await tx.examSubject.createMany({
            data: additionSubjects.map((item) => ({
              examId: parsed.id,
              classId: item.classId,
              subjectId: item.subjectId,
              fullMarks: item.fullMarks,
              passMarks: item.passMarks,
              isOptional:
                item.subjectType === "optional" ||
                item.subjectType === "additional",
            })),
          });
      });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "UPDATE",
        module: "Examinations",
        recordId: parsed.id,
        details: `Updated ${parsed.name}`,
      });
      return NextResponse.json({ ok: true });
    }
    if (action === "saveRoutine") {
      const session = await requirePermission(PERMISSIONS.EXAMS_MANAGE);
      const parsed = routineSchema.parse(body);
      const valid = await Promise.all([
        owns(session.schoolId, "exam", parsed.examId),
        owns(session.schoolId, "year", parsed.academicYearId),
        owns(session.schoolId, "class", parsed.classId),
        owns(session.schoolId, "section", parsed.sectionId || ""),
        owns(session.schoolId, "subject", parsed.subjectId),
        owns(session.schoolId, "room", parsed.roomId || ""),
      ]);
      if (valid.some((item) => !item))
        return NextResponse.json(
          { error: "One or more schedule options are invalid." },
          { status: 400 },
        );
      const [examRow, assignedClass, configuredSubject] = await Promise.all([
        prisma.exam.findFirst({
          where: { id: parsed.examId, schoolId: session.schoolId },
        }),
        prisma.examClass.count({
          where: {
            examId: parsed.examId,
            classId: parsed.classId,
            OR: [{ sectionId: null }, { sectionId: parsed.sectionId || null }],
          },
        }),
        prisma.examSubject.count({
          where: {
            examId: parsed.examId,
            classId: parsed.classId,
            subjectId: parsed.subjectId,
          },
        }),
      ]);
      if (!assignedClass || !configuredSubject)
        return NextResponse.json(
          { error: "This class/subject is not assigned to the selected exam." },
          { status: 409 },
        );
      const examDate = new Date(`${parsed.examDate}T00:00:00.000Z`);
      if (
        !examRow ||
        examDate < examRow.startDate ||
        examDate > examRow.endDate
      )
        return NextResponse.json(
          { error: "Exam date must be inside the examination date range." },
          { status: 409 },
        );
      if (
        parsed.startTime >= parsed.endTime ||
        parsed.passMarks > parsed.totalMarks
      )
        return NextResponse.json(
          { error: "Check time and marks values." },
          { status: 400 },
        );
      const duplicate = await prisma.examRoutine.findFirst({
        where: {
          schoolId: session.schoolId,
          examId: parsed.examId,
          classId: parsed.classId,
          sectionId: parsed.sectionId || null,
          subjectId: parsed.subjectId,
          status: { not: "CANCELLED" },
          ...(parsed.id ? { id: { not: parsed.id } } : {}),
        },
      });
      if (duplicate)
        return NextResponse.json(
          {
            error:
              "This subject already has a schedule for the selected exam and class.",
          },
          { status: 409 },
        );
      const conflicts = await prisma.examRoutine.findMany({
        where: {
          schoolId: session.schoolId,
          academicYearId: parsed.academicYearId,
          examDate: new Date(`${parsed.examDate}T00:00:00.000Z`),
          status: { not: "CANCELLED" },
          ...(parsed.id ? { id: { not: parsed.id } } : {}),
        },
      });
      if (
        conflicts.some(
          (item) =>
            parsed.startTime < item.endTime &&
            item.startTime < parsed.endTime &&
            ((item.classId === parsed.classId &&
              (!item.sectionId ||
                !parsed.sectionId ||
                item.sectionId === parsed.sectionId)) ||
              (parsed.roomId && item.roomId === parsed.roomId)),
        )
      )
        return NextResponse.json(
          { error: "Class/section or room has another exam during this time." },
          { status: 409 },
        );
      const data = {
        schoolId: session.schoolId,
        academicYearId: parsed.academicYearId,
        examId: parsed.examId,
        classId: parsed.classId,
        sectionId: parsed.sectionId || null,
        subjectId: parsed.subjectId,
        examDate: new Date(`${parsed.examDate}T00:00:00.000Z`),
        startTime: parsed.startTime,
        endTime: parsed.endTime,
        durationMinutes: duration(parsed.startTime, parsed.endTime),
        roomId: parsed.roomId || null,
        totalMarks: parsed.totalMarks,
        passMarks: parsed.passMarks,
        instructions: parsed.instructions || null,
        status: parsed.status,
      };
      const row = parsed.id
        ? await prisma.examRoutine.update({ where: { id: parsed.id }, data })
        : await prisma.examRoutine.create({ data });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: parsed.id ? "UPDATE" : "CREATE",
        module: "Exam Routine",
        recordId: row.id,
        details: `${parsed.id ? "Updated" : "Created"} exam schedule`,
      });
      return NextResponse.json(serialize(row), {
        status: parsed.id ? 200 : 201,
      });
    }
    if (action === "saveMarks") {
      const session = await requirePermission(PERMISSIONS.MARKS_ENTER);
      const parsed = marksSchema.parse(body);
      if (!(await canAccessTeacherMarksSheet(session, parsed)))
        return NextResponse.json(
          { error: "You can enter marks only for your assigned class, section and subject." },
          { status: 403 },
        );
      if (
        !(await owns(session.schoolId, "exam", parsed.examId)) ||
        !(await owns(session.schoolId, "subject", parsed.subjectId))
      )
        return NextResponse.json(
          { error: "Invalid exam or subject." },
          { status: 400 },
        );
      let config = await prisma.examSubject.findFirst({
        where: {
          examId: parsed.examId,
          classId: parsed.classId,
          subjectId: parsed.subjectId,
        },
      });
      if (!config) {
        const mapping = await prisma.classSubject.findFirst({
          where: {
            schoolId: session.schoolId,
            classId: parsed.classId,
            subjectId: parsed.subjectId,
            status: "ACTIVE",
            deletedAt: null,
          },
        });
        if (!mapping)
          return NextResponse.json(
            { error: "Subject is not configured for this exam." },
            { status: 409 },
          );
        config = await prisma.examSubject.create({
          data: {
            examId: parsed.examId,
            classId: parsed.classId,
            subjectId: parsed.subjectId,
            fullMarks: mapping.fullMarks,
            passMarks: mapping.passMarks,
            isOptional:
              mapping.subjectType === "optional" ||
              mapping.subjectType === "additional",
          },
        });
        const examClass = await prisma.examClass.findFirst({
          where: {
            examId: parsed.examId,
            classId: parsed.classId,
            sectionId: parsed.sectionId,
          },
        });
        if (!examClass)
          await prisma.examClass.create({
            data: {
              examId: parsed.examId,
              classId: parsed.classId,
              sectionId: parsed.sectionId,
            },
          });
      }
      const allowed = await prisma.studentEnrollment.findMany({
        where: {
          schoolId: session.schoolId,
          classId: parsed.classId,
          sectionId: parsed.sectionId,
          enrollmentStatus: "ACTIVE",
          studentId: { in: parsed.rows.map((item) => item.studentId) },
        },
        select: { studentId: true },
      });
      const allowedIds = new Set(allowed.map((item) => item.studentId));
      if (allowedIds.size !== parsed.rows.length)
        return NextResponse.json(
          {
            error:
              "One or more students are not enrolled in this class and section.",
          },
          { status: 400 },
        );
      const locked = await prisma.mark.count({
        where: {
          examId: parsed.examId,
          subjectId: parsed.subjectId,
          studentId: { in: parsed.rows.map((item) => item.studentId) },
          isLocked: true,
        },
      });
      if (locked)
        return NextResponse.json(
          {
            error:
              "Verified marks are locked. An authorized unlock workflow is required before editing.",
          },
          { status: 409 },
        );
      await prisma.$transaction(
        parsed.rows.map((row) => {
          const obtained = row.absent ? 0 : row.marks;
          if (obtained > Number(config.fullMarks))
            throw new Error(`Marks cannot exceed ${Number(config.fullMarks)}.`);
          const calculated = grade((obtained / Number(config.fullMarks)) * 100);
          return prisma.mark.upsert({
            where: {
              examId_studentId_subjectId: {
                examId: parsed.examId,
                studentId: row.studentId,
                subjectId: parsed.subjectId,
              },
            },
            create: {
              examId: parsed.examId,
              studentId: row.studentId,
              subjectId: parsed.subjectId,
              marksObtained: obtained,
              maxMarks: config.fullMarks,
              grade: row.absent ? "F" : calculated.letter,
              comments: row.absent ? "ABSENT" : row.comments || null,
            },
            update: {
              marksObtained: obtained,
              maxMarks: config.fullMarks,
              grade: row.absent ? "F" : calculated.letter,
              comments: row.absent ? "ABSENT" : row.comments || null,
            },
          });
        }),
      );
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "UPDATE",
        module: "Marks Entry",
        recordId: parsed.examId,
        details: `Saved ${parsed.rows.length} marks for subject ${parsed.subjectId}`,
      });
      return NextResponse.json({ ok: true, saved: parsed.rows.length });
    }
    if (action === "verifyMarks") {
      const session = await requirePermission(PERMISSIONS.MARKS_VERIFY);
      const ids = z
        .object({
          examId: z.string().min(1),
          classId: z.string().min(1),
          sectionId: z.string().min(1),
          subjectId: z.string().min(1),
          remarks: z.string().max(500).optional(),
        })
        .parse(body);
      if (!(await canAccessTeacherMarksSheet(session, ids)))
        return NextResponse.json(
          { error: "You can verify marks only for your assigned class, section and subject." },
          { status: 403 },
        );
      if (!(await owns(session.schoolId, "exam", ids.examId)))
        return NextResponse.json({ error: "Invalid exam." }, { status: 400 });
      const studentIds = (
        await prisma.student.findMany({
          where: {
            schoolId: session.schoolId,
            classId: ids.classId,
            sectionId: ids.sectionId,
          },
          select: { id: true },
        })
      ).map((item) => item.id);
      const savedMarkCount = await prisma.mark.count({
        where: {
          examId: ids.examId,
          subjectId: ids.subjectId,
          studentId: { in: studentIds },
        },
      });
      if (!studentIds.length || savedMarkCount !== studentIds.length)
        return NextResponse.json(
          {
            error:
              "Save marks or mark absent for every student before verification.",
          },
          { status: 409 },
        );
      await prisma.$transaction(async (tx) => {
        await tx.mark.updateMany({
          where: {
            examId: ids.examId,
            subjectId: ids.subjectId,
            studentId: { in: studentIds },
          },
          data: { isLocked: true },
        });
        await tx.marksVerification.deleteMany({
          where: {
            schoolId: session.schoolId,
            examId: ids.examId,
            classId: ids.classId,
            subjectId: ids.subjectId,
          },
        });
        await tx.marksVerification.create({
          data: {
            schoolId: session.schoolId,
            examId: ids.examId,
            classId: ids.classId,
            subjectId: ids.subjectId,
            status: "VERIFIED",
            verifiedById: session.id,
            remarks: ids.remarks,
          },
        });
      });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "UPDATE",
        module: "Marks Verification",
        recordId: ids.examId,
        details: `Verified and locked marks for subject ${ids.subjectId}`,
      });
      return NextResponse.json({ ok: true });
    }
    if (action === "unlockMarks") {
      const session = await requirePermission(PERMISSIONS.MARKS_LOCK);
      const ids = z
        .object({
          examId: z.string().min(1),
          classId: z.string().min(1),
          sectionId: z.string().min(1),
          subjectId: z.string().min(1),
          reason: z.string().trim().min(3).max(500),
        })
        .parse(body);
      if (!(await owns(session.schoolId, "exam", ids.examId)))
        return NextResponse.json({ error: "Invalid exam." }, { status: 400 });
      const studentIds = (
        await prisma.student.findMany({
          where: {
            schoolId: session.schoolId,
            classId: ids.classId,
            sectionId: ids.sectionId,
          },
          select: { id: true },
        })
      ).map((item) => item.id);
      await prisma.$transaction(async (tx) => {
        await tx.mark.updateMany({
          where: {
            examId: ids.examId,
            subjectId: ids.subjectId,
            studentId: { in: studentIds },
          },
          data: { isLocked: false },
        });
        await tx.marksVerification.updateMany({
          where: {
            schoolId: session.schoolId,
            examId: ids.examId,
            classId: ids.classId,
            subjectId: ids.subjectId,
          },
          data: { status: "REJECTED", remarks: `Unlocked: ${ids.reason}` },
        });
      });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "UPDATE",
        module: "Marks Verification",
        recordId: ids.examId,
        details: `Unlocked subject ${ids.subjectId}: ${ids.reason}`,
      });
      return NextResponse.json({ ok: true });
    }
    if (action === "calculateResults") {
      const session = await requirePermission(PERMISSIONS.RESULTS_CALCULATE);
      const ids = z
        .object({
          examId: z.string().min(1),
          academicYearId: z.string().min(1),
          classId: z.string().min(1),
          sectionId: z.string().min(1),
        })
        .parse(body);
      if (
        !(await owns(session.schoolId, "exam", ids.examId)) ||
        !(await owns(session.schoolId, "year", ids.academicYearId))
      )
        return NextResponse.json(
          { error: "Invalid exam or academic year." },
          { status: 400 },
        );
      const enrollments = await prisma.studentEnrollment.findMany({
        where: {
          schoolId: session.schoolId,
          academicYearId: ids.academicYearId,
          classId: ids.classId,
          sectionId: ids.sectionId,
          enrollmentStatus: "ACTIVE",
        },
        select: { studentId: true },
      });
      let configs = await prisma.examSubject.findMany({
        where: { examId: ids.examId, classId: ids.classId },
      });
      const mappings = await prisma.classSubject.findMany({
        where: {
          schoolId: session.schoolId,
          classId: ids.classId,
          status: "ACTIVE",
          deletedAt: null,
        },
      });
      const configuredSubjectIds = new Set(configs.map((item) => item.subjectId));
      const missingMappings = mappings.filter(
        (mapping) => !configuredSubjectIds.has(mapping.subjectId),
      );
      if (missingMappings.length) {
        await prisma.examSubject.createMany({
            data: missingMappings.map((mapping) => ({
              examId: ids.examId,
              classId: ids.classId,
              subjectId: mapping.subjectId,
              fullMarks: mapping.fullMarks,
              passMarks: mapping.passMarks,
              isOptional:
                mapping.subjectType === "optional" ||
                mapping.subjectType === "additional",
            })),
        });
        configs = await prisma.examSubject.findMany({
          where: { examId: ids.examId, classId: ids.classId },
        });
      }
      const allMarks = await prisma.mark.findMany({
        where: {
          examId: ids.examId,
          studentId: { in: enrollments.map((item) => item.studentId) },
        },
      });
      if (!enrollments.length || !configs.length)
        return NextResponse.json(
          { error: "No enrolled students or configured subjects were found." },
          { status: 409 },
        );
      const calculatedSubjectIds = new Set(
        configs.map((item) => item.subjectId),
      );
      const relevantMarks = allMarks.filter((item) =>
        calculatedSubjectIds.has(item.subjectId),
      );
      const expectedMarkCount = enrollments.length * configs.length;
      if (relevantMarks.length < expectedMarkCount)
        return NextResponse.json(
          {
            error: `Marks are incomplete. Save marks or mark absent for every student in all ${configs.length} subjects before calculating.`,
          },
          { status: 409 },
        );
      if (relevantMarks.some((item) => !item.isLocked))
        return NextResponse.json(
          {
            error:
              "Verify & lock every subject marks sheet before calculating results.",
          },
          { status: 409 },
        );
      const calculated = enrollments
        .map((enrollment) => {
          const overall = calculateOverallResult(
            configs.map((config) => {
              const mark = relevantMarks.find(
                (item) =>
                  item.studentId === enrollment.studentId &&
                  item.subjectId === config.subjectId,
              );
              return {
                subjectId: config.subjectId,
                isOptional: config.isOptional,
                fullMarks: Number(config.fullMarks),
                passMarks: Number(config.passMarks),
                written: mark ? Number(mark.marksObtained) : 0,
                isAbsent: mark?.comments === "ABSENT" || !mark,
              };
            }),
          );
          const rows = overall.subjectResults.map((subjectResult) => {
            const config = configs.find(
              (item) => item.subjectId === subjectResult.subjectId,
            )!;
            return {
              config,
              obtained: subjectResult.obtainedMarks,
              absent: subjectResult.isAbsent,
              passed: subjectResult.isPassed,
              grade: {
                letter: subjectResult.letterGrade,
                point: subjectResult.gradePoint,
              },
            };
          });
          return {
            studentId: enrollment.studentId,
            rows,
            total: overall.totalMarks,
            average: overall.average,
            percentage: overall.percentage,
            gpa: overall.gpa,
            letter: overall.letterGrade,
            failed: overall.failedSubjectCount,
            passed: overall.isPassed,
          };
        })
        .sort(
          (a, b) => Number(b.passed) - Number(a.passed) || b.total - a.total,
        );
      await prisma.$transaction(async (tx) => {
        for (let index = 0; index < calculated.length; index += 1) {
          const item = calculated[index];
          const existing = await tx.studentResult.findUnique({
            where: {
              examId_studentId: {
                examId: ids.examId,
                studentId: item.studentId,
              },
            },
            select: { id: true },
          });
          if (existing)
            await tx.resultSubject.deleteMany({
              where: { resultId: existing.id },
            });
          const result = await tx.studentResult.upsert({
            where: {
              examId_studentId: {
                examId: ids.examId,
                studentId: item.studentId,
              },
            },
            create: {
              schoolId: session.schoolId,
              academicYearId: ids.academicYearId,
              examId: ids.examId,
              studentId: item.studentId,
              classId: ids.classId,
              sectionId: ids.sectionId,
              totalMarks: item.total,
              average: item.average,
              percentage: item.percentage,
              gpa: item.gpa,
              letterGrade: item.letter,
              failedSubjectCount: item.failed,
              classPosition: index + 1,
              isPassed: item.passed,
              remarks: item.passed ? "Promoted" : "Needs improvement",
            },
            update: {
              academicYearId: ids.academicYearId,
              classId: ids.classId,
              sectionId: ids.sectionId,
              totalMarks: item.total,
              average: item.average,
              percentage: item.percentage,
              gpa: item.gpa,
              letterGrade: item.letter,
              failedSubjectCount: item.failed,
              classPosition: index + 1,
              isPassed: item.passed,
              remarks: item.passed ? "Promoted" : "Needs improvement",
              calculatedAt: new Date(),
            },
          });
          await tx.resultSubject.createMany({
            data: item.rows.map((row) => ({
              resultId: result.id,
              subjectId: row.config.subjectId,
              fullMarks: row.config.fullMarks,
              passMarks: row.config.passMarks,
              obtainedMarks: row.obtained,
              letterGrade: row.absent ? "F" : row.grade.letter,
              gradePoint: row.absent ? 0 : row.grade.point,
              isOptional: row.config.isOptional,
              isPassed: row.passed,
              isAbsent: row.absent,
            })),
          });
        }
      });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "UPDATE",
        module: "Result Processing",
        recordId: ids.examId,
        details: `Calculated ${calculated.length} student results`,
      });
      return NextResponse.json({ ok: true, calculated: calculated.length });
    }
    if (action === "publishResults") {
      const session = await requirePermission(PERMISSIONS.RESULTS_PUBLISH);
      const ids = z
        .object({
          examId: z.string().min(1),
          classId: z.string().optional().or(z.literal("")),
          publish: z.boolean(),
          reason: z.string().max(500).optional(),
        })
        .parse(body);
      if (!(await owns(session.schoolId, "exam", ids.examId)))
        return NextResponse.json({ error: "Invalid exam." }, { status: 400 });
      if (ids.publish) {
        const resultCount = await prisma.studentResult.count({
          where: {
            schoolId: session.schoolId,
            examId: ids.examId,
            ...(ids.classId ? { classId: ids.classId } : {}),
          },
        });
        if (!resultCount)
          return NextResponse.json(
            { error: "Calculate this class result before publishing." },
            { status: 409 },
          );
      }
      await prisma.$transaction(async (tx) => {
        const existing = await tx.resultPublication.findFirst({
          where: {
            schoolId: session.schoolId,
            examId: ids.examId,
            classId: ids.classId || null,
          },
        });
        const data = ids.publish
          ? {
              status: "PUBLISHED",
              publishedById: session.id,
              publishedAt: new Date(),
              unpublishedById: null,
              unpublishedAt: null,
              unpublishReason: null,
            }
          : {
              status: "UNPUBLISHED",
              unpublishedById: session.id,
              unpublishedAt: new Date(),
              unpublishReason: ids.reason || "Unpublished by administrator",
            };
        if (existing)
          await tx.resultPublication.update({
            where: { id: existing.id },
            data,
          });
        else
          await tx.resultPublication.create({
            data: {
              schoolId: session.schoolId,
              examId: ids.examId,
              classId: ids.classId || null,
              publishedById: session.id,
              ...data,
            },
          });
        const activePublications = await tx.resultPublication.count({
          where: {
            schoolId: session.schoolId,
            examId: ids.examId,
            status: "PUBLISHED",
          },
        });
        await tx.exam.update({
          where: { id: ids.examId },
          data: { isPublished: activePublications > 0 },
        });
      });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "TOGGLE_STATUS",
        module: "Result Publication",
        recordId: ids.examId,
        details: ids.publish ? "Published results" : "Unpublished results",
      });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "Unsupported examination action." },
      { status: 400 },
    );
  } catch (error) {
    console.error("POST /api/examinations error", error);
    const status = authorizationStatus(error);
    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError
            ? error.issues[0]?.message
            : error instanceof Error
              ? error.message
              : "Examination operation failed.",
      },
      { status: status === 500 ? 400 : status },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.EXAMS_MANAGE);
    const type = request.nextUrl.searchParams.get("type");
    const id = request.nextUrl.searchParams.get("id") || "";
    if (type === "routine") {
      const row = await prisma.examRoutine.findFirst({
        where: { id, schoolId: session.schoolId },
      });
      if (!row)
        return NextResponse.json(
          { error: "Schedule not found." },
          { status: 404 },
        );
      await prisma.examRoutine.delete({ where: { id } });
      await createAuditLog({
        schoolId: session.schoolId,
        userId: session.id,
        action: "DELETE",
        module: "Exam Routine",
        recordId: id,
        details: "Deleted exam schedule",
      });
      return NextResponse.json({ ok: true });
    }
    const exam = await prisma.exam.findFirst({
      where: { id, schoolId: session.schoolId },
      include: { _count: { select: { marks: true } } },
    });
    if (!exam)
      return NextResponse.json({ error: "Exam not found." }, { status: 404 });
    if (exam._count.marks)
      return NextResponse.json(
        { error: "An exam with recorded marks cannot be deleted." },
        { status: 409 },
      );
    await prisma.$transaction([
      prisma.examRoutine.deleteMany({
        where: { examId: id, schoolId: session.schoolId },
      }),
      prisma.examSubject.deleteMany({ where: { examId: id } }),
      prisma.examClass.deleteMany({ where: { examId: id } }),
      prisma.exam.delete({ where: { id } }),
    ]);
    await createAuditLog({
      schoolId: session.schoolId,
      userId: session.id,
      action: "DELETE",
      module: "Examinations",
      recordId: id,
      details: `Deleted ${exam.name}`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/examinations error", error);
    return NextResponse.json(
      { error: "Unable to delete examination record." },
      { status: authorizationStatus(error) },
    );
  }
}
