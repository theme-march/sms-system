import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requirePermission(PERMISSIONS.IMPORTS_VIEW);
    const { id } = await context.params;
    const kind = request.nextUrl.searchParams.get('kind') === 'success' ? 'success' : 'error';
    const history = await prisma.importHistory.findFirst({
      where: { id, schoolId: session.schoolId },
      select: { importType: true, successReport: true, errorReport: true },
    });
    if (!history) return NextResponse.json({ error: 'Import history not found' }, { status: 404 });

    const rows = (kind === 'success' ? history.successReport : history.errorReport) as object[] | null;
    const worksheet = XLSX.utils.json_to_sheet(Array.isArray(rows) ? rows : []);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    return new NextResponse(csv, {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="${history.importType}-${kind}-report.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import report download failed' },
      { status: authorizationStatus(error) },
    );
  }
}
