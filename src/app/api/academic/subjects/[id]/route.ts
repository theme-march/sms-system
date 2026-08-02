import { NextResponse } from 'next/server';
import { updateSubject, deleteSubject, toggleSubjectStatus } from '@/src/services/academic-management.service';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { createAuditLog } from '@/src/lib/audit';

async function requireOwnedSubject(id: string) {
  const session = await requirePermission(PERMISSIONS.ACADEMIC_MANAGE);
  const subject = await prisma.subject.findFirst({ where: { id, schoolId: session.schoolId, deletedAt: null }, select: { id: true } });
  if (!subject) throw new Error('FORBIDDEN');
  return session;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireOwnedSubject(id);
    const body = await request.json();
    const updated = await updateSubject(id, { ...body, schoolId: session.schoolId });
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'UPDATE', module: 'Subjects', recordId: id, details: `Updated subject ${updated.nameEn}` });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('PUT /api/academic/subjects/[id] error', err);
    return NextResponse.json({ error: 'Unable to update subject.' }, { status: authorizationStatus(err) });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireOwnedSubject(id);
    await deleteSubject(id);
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'DELETE', module: 'Subjects', recordId: id, details: `Deleted subject ${id}` });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/academic/subjects/[id] error', err);
    return NextResponse.json({ error: 'Unable to delete subject.' }, { status: authorizationStatus(err) });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireOwnedSubject(id);
    // treat patch as toggle
    const result = await toggleSubjectStatus(id);
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'TOGGLE_STATUS', module: 'Subjects', recordId: id, details: `Updated subject status to ${result.status}` });
    return NextResponse.json(result);
  } catch (err) {
    console.error('PATCH /api/academic/subjects/[id] error', err);
    return NextResponse.json({ error: 'Unable to update subject status.' }, { status: authorizationStatus(err) });
  }
}
