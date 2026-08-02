import { NextRequest, NextResponse } from 'next/server';
import { getReport, REPORT_TYPES, type ReportFilters, type ReportType } from '@/src/services/report.service';
import { authorizationStatus } from '@/src/lib/auth/authorize';

const filtersFrom = (request: NextRequest): ReportFilters => {
  const params = request.nextUrl.searchParams;
  const value = (name: string) => params.get(name) || undefined;
  return {
    academicYearId: value('academicYearId'), sessionId: value('sessionId'),
    startDate: value('startDate'), endDate: value('endDate'), classId: value('classId'),
    sectionId: value('sectionId'), groupId: value('groupId'), subjectId: value('subjectId'),
    studentId: value('studentId'), teacherId: value('teacherId'),
    month: value('month') ? Number(value('month')) : undefined,
    year: value('year') ? Number(value('year')) : undefined,
    paymentStatus: value('paymentStatus'), search: value('search'), sortBy: value('sortBy'),
    sortOrder: value('sortOrder') === 'desc' ? 'desc' : 'asc',
    page: Math.max(1, Number(value('page') || 1)),
    pageSize: Math.min(500, Math.max(1, Number(value('pageSize') || 25))),
  };
};

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') as ReportType;
    if (!REPORT_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
    return NextResponse.json(await getReport(type, filtersFrom(request)));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Report generation failed' },
      { status: authorizationStatus(error) },
    );
  }
}
