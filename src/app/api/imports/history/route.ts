import { NextResponse } from 'next/server';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { toClientData } from '@/src/lib/serialize';

export async function GET() {
  try {
    const session = await requirePermission(PERMISSIONS.IMPORTS_VIEW);
    const [imports, exports] = await Promise.all([
      prisma.importHistory.findMany({ where: { schoolId: session.schoolId }, orderBy: { createdAt: 'desc' }, take: 50, select: { id: true, importType: true, fileName: true, status: true, totalRows: true, validRows: true, invalidRows: true, successRows: true, failedRows: true, createdAt: true, completedAt: true, errorReport: true } }),
      prisma.exportHistory.findMany({ where: { schoolId: session.schoolId }, orderBy: { createdAt: 'desc' }, take: 50 }),
    ]);
    return NextResponse.json(toClientData({ imports, exports }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'History failed' }, { status: authorizationStatus(error) });
  }
}
