import { NextRequest, NextResponse } from 'next/server';
import { getSchoolProfile, updateSchoolProfile } from '@/src/services/school.service';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';

export async function GET() {
  try {
    const session = await requirePermission(PERMISSIONS.SCHOOL_SETTINGS_MANAGE);
    return NextResponse.json(await getSchoolProfile(session.schoolId));
  } catch (error) {
    return NextResponse.json({ error: 'Unable to load school settings.' }, { status: authorizationStatus(error) });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.SCHOOL_SETTINGS_MANAGE);
    const body = await request.json();
    const { id: _ignoredId, ...data } = body;
    const profile = await updateSchoolProfile(session.schoolId, data, session.id);
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Unable to update school settings.' }, { status: authorizationStatus(error) });
  }
}
