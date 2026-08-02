import { NextResponse } from 'next/server';
import { getSubjectsList, createSubject } from '@/src/services/academic-management.service';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { subjectSchema } from '@/src/lib/validations/academic';
import { createAuditLog } from '@/src/lib/audit';

export async function GET(request: Request) {
  try {
    const session = await requirePermission(PERMISSIONS.ACADEMIC_VIEW);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const subjectType = url.searchParams.get('subjectType') || undefined;

    const result = await getSubjectsList({ page, pageSize, search, status, subjectType, schoolId: session.schoolId });
    return NextResponse.json(result);
  } catch (err) {
    console.error('GET /api/academic/subjects error', err);
    return NextResponse.json({ error: 'Unable to load subjects.' }, { status: authorizationStatus(err) });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission(PERMISSIONS.ACADEMIC_MANAGE);
    const body = await request.json();
    const validation = subjectSchema.safeParse({ ...body, schoolId: session.schoolId });
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0]?.message || 'Invalid subject data.' }, { status: 400 });
    }
    const created = await createSubject({
      ...validation.data,
      nameBn: validation.data.nameBn ?? undefined,
      description: validation.data.description ?? undefined,
    });
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'CREATE', module: 'Subjects', recordId: created.id, details: `Created subject ${created.nameEn}` });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('POST /api/academic/subjects error', err);
    const status = authorizationStatus(err);
    const message = err instanceof Error ? err.message : 'Unable to create subject.';
    return NextResponse.json({ error: message }, { status: status === 500 && message.includes('already exists') ? 409 : status });
  }
}
