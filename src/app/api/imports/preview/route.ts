import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import * as XLSX from 'xlsx';
import prisma from '@/src/lib/db/prisma';
import { IMPORT_TEMPLATES, IMPORT_TYPES, mapColumns, validateImportRows, type ImportType } from '@/src/services/import.service';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { createAuditLog } from '@/src/lib/audit';

const MAX_SIZE = 5 * 1024 * 1024;
const MIME_TYPES = new Set([
  'text/csv', 'application/csv', 'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.IMPORTS_MANAGE);
    const form = await request.formData();
    const file = form.get('file');
    const type = form.get('type') as ImportType;
    if (!(file instanceof File) || !IMPORT_TYPES.includes(type)) {
      return NextResponse.json({ error: 'A valid file and import type are required' }, { status: 400 });
    }
    const extensionValid = /\.(csv|xlsx|xls)$/i.test(file.name);
    if ((!MIME_TYPES.has(file.type) && !extensionValid) || file.size > MAX_SIZE || file.size === 0) {
      return NextResponse.json({ error: 'Only non-empty CSV/XLS/XLSX files up to 5 MB are allowed' }, { status: 400 });
    }
    let mapping: Record<string, string> = {};
    try { mapping = JSON.parse(String(form.get('mapping') || '{}')); } catch { return NextResponse.json({ error: 'Invalid column mapping' }, { status: 400 }); }
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) return NextResponse.json({ error: 'The workbook has no worksheet' }, { status: 400 });
    const raw = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });
    if (!raw.length) return NextResponse.json({ error: 'The file contains no data rows' }, { status: 400 });
    if (raw.length > 10000) return NextResponse.json({ error: 'A single import is limited to 10,000 rows' }, { status: 400 });
    const validated = validateImportRows(type, mapColumns(raw, mapping));
    const validRows = validated.filter((row) => !row.errors.length).length;
    const history = await prisma.importHistory.create({
      data: {
        schoolId: session.schoolId, userId: session.id, importType: type, fileName: file.name,
        fileSize: file.size, mimeType: file.type || 'application/octet-stream', totalRows: validated.length,
        validRows, invalidRows: validated.length - validRows, columnMapping: mapping as Prisma.InputJsonValue,
        payload: { rows: validated } as Prisma.InputJsonValue,
        errorReport: validated.flatMap((row) => row.errors) as Prisma.InputJsonValue,
      },
    });
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'IMPORT_PREVIEW', module: 'Imports', recordId: history.id, details: `Validated ${type}: ${validRows}/${validated.length} valid rows` });
    return NextResponse.json({
      historyId: history.id, totalRows: validated.length, validRows, invalidRows: validated.length - validRows,
      columns: Object.keys(raw[0] || {}), expectedColumns: IMPORT_TEMPLATES[type],
      preview: validated.slice(0, 100), canConfirm: validRows > 0,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Import preview failed' }, { status: authorizationStatus(error) });
  }
}
