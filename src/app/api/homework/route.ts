import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/db/prisma";
import {
  authorizationStatus,
  requirePermission,
} from "@/src/lib/auth/authorize";
import { PERMISSIONS } from "@/src/config/permissions";
import { createAuditLog } from "@/src/lib/audit";

const MANAGEMENT_ROLES = [
  "Super Admin",
  "School Admin",
  "Academic Admin",
];
type AuthorizedSession = Awaited<ReturnType<typeof requirePermission>>;

const homeworkSchema = z.object({
  assignmentId: z.string().trim().min(1).max(191),
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().min(2).max(5000),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

function isTeacherOnly(session: AuthorizedSession) {
  return (
    session.roles.includes("Teacher") &&
    !session.roles.some((role) => MANAGEMENT_ROLES.includes(role))
  );
}

function assignmentWhere(session: AuthorizedSession) {
  return {
    schoolId: session.schoolId,
    status: "ACTIVE" as const,
    ...(isTeacherOnly(session)
      ? { teacher: { userId: session.id, status: "ACTIVE" as const } }
      : {}),
  };
}

async function getAssignment(session: AuthorizedSession, assignmentId: string) {
  return prisma.teacherAssignment.findFirst({
    where: { id: assignmentId, ...assignmentWhere(session) },
    select: {
      teacherId: true,
      classId: true,
      sectionId: true,
      subjectId: true,
    },
  });
}

function homeworkWhere(session: AuthorizedSession) {
  return {
    class: { schoolId: session.schoolId },
    ...(isTeacherOnly(session)
      ? { teacher: { userId: session.id, status: "ACTIVE" as const } }
      : {}),
  };
}

export async function GET() {
  try {
    const session = await requirePermission(PERMISSIONS.HOMEWORK_VIEW);
    const [homeworks, assignments] = await Promise.all([
      prisma.homework.findMany({
        where: homeworkWhere(session),
        include: { class: true, section: true, subject: true, teacher: true },
        orderBy: [{ dueDate: "desc" }, { createdAt: "desc" }],
        take: 300,
      }),
      prisma.teacherAssignment.findMany({
        where: assignmentWhere(session),
        include: { class: true, section: true, subject: true, teacher: true },
        orderBy: [
          { class: { displayOrder: "asc" } },
          { section: { displayOrder: "asc" } },
          { subject: { nameEn: "asc" } },
        ],
      }),
    ]);

    return NextResponse.json({
      isTeacherScope: isTeacherOnly(session),
      canManage:
        session.roles.includes("Super Admin") ||
        session.permissions.includes(PERMISSIONS.HOMEWORK_MANAGE),
      assignments: assignments.map((item) => ({
        id: item.id,
        teacherId: item.teacherId,
        teacherName: item.teacher.nameEn,
        className: item.class.name,
        sectionName: item.section.name,
        subjectName: item.subject.nameEn,
      })),
      data: homeworks.map((item) => ({
        id: item.id,
        classId: item.classId,
        sectionId: item.sectionId,
        subjectId: item.subjectId,
        teacherId: item.teacherId,
        title: item.title,
        description: item.description,
        dueDate: item.dueDate.toISOString().slice(0, 10),
        className: item.class.name,
        sectionName: item.section.name,
        subjectName: item.subject.nameEn,
        teacherName: item.teacher.nameEn,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to load homework assignments." },
      { status: authorizationStatus(error) },
    );
  }
}

async function save(request: NextRequest, id?: string) {
  const session = await requirePermission(PERMISSIONS.HOMEWORK_MANAGE);
  const parsed = homeworkSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid homework data." },
      { status: 400 },
    );
  }
  const assignment = await getAssignment(session, parsed.data.assignmentId);
  if (!assignment) {
    return NextResponse.json(
      { error: "This class, section and subject is not assigned to you." },
      { status: 403 },
    );
  }
  if (id) {
    const owned = await prisma.homework.findFirst({
      where: { id, ...homeworkWhere(session) },
      select: { id: true },
    });
    if (!owned) {
      return NextResponse.json(
        { error: "Homework not found or you cannot edit it." },
        { status: 404 },
      );
    }
  }
  const data = {
    ...assignment,
    title: parsed.data.title,
    description: parsed.data.description,
    dueDate: new Date(`${parsed.data.dueDate}T00:00:00.000Z`),
  };
  const homework = id
    ? await prisma.homework.update({ where: { id }, data })
    : await prisma.homework.create({ data });
  await createAuditLog({
    schoolId: session.schoolId,
    userId: session.id,
    action: id ? "UPDATE" : "CREATE",
    module: "Homework",
    recordId: homework.id,
    details: `${id ? "Updated" : "Created"} homework ${homework.title}`,
  });
  return NextResponse.json({ id: homework.id }, { status: id ? 200 : 201 });
}

export async function POST(request: NextRequest) {
  try {
    return await save(request);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to create homework." },
      { status: authorizationStatus(error) },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id") || "";
    return await save(request, id);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to update homework." },
      { status: authorizationStatus(error) },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.HOMEWORK_MANAGE);
    const id = request.nextUrl.searchParams.get("id") || "";
    const owned = await prisma.homework.findFirst({
      where: { id, ...homeworkWhere(session) },
      select: { id: true, title: true },
    });
    if (!owned) {
      return NextResponse.json(
        { error: "Homework not found or you cannot delete it." },
        { status: 404 },
      );
    }
    await prisma.homework.delete({ where: { id } });
    await createAuditLog({
      schoolId: session.schoolId,
      userId: session.id,
      action: "DELETE",
      module: "Homework",
      recordId: id,
      details: `Deleted homework ${owned.title}`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to delete homework." },
      { status: authorizationStatus(error) },
    );
  }
}
