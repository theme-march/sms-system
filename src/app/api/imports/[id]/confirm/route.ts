import { NextRequest, NextResponse } from 'next/server';
import { processImport } from '@/src/services/import.service';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { createAuditLog } from '@/src/lib/audit';

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requirePermission(PERMISSIONS.IMPORTS_MANAGE);
    const { id } = await context.params;
    const result = await processImport(id, session.schoolId, session.id);
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'IMPORT', module: 'Imports', recordId: id, details: `Imported ${result.imported} rows; ${result.failed + result.invalid} errors` });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Import failed' }, { status: authorizationStatus(error) });
  }
}
