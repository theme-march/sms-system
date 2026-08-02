import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { IMPORT_TEMPLATES, IMPORT_TYPES, type ImportType } from '@/src/services/import.service';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';

export async function GET(request: NextRequest) {
  try {
    await requirePermission(PERMISSIONS.IMPORTS_VIEW);
    const type = request.nextUrl.searchParams.get('type') as ImportType;
    const format = request.nextUrl.searchParams.get('format') === 'xlsx' ? 'xlsx' : 'csv';
    if (!IMPORT_TYPES.includes(type)) return NextResponse.json({ error: 'Invalid import type' }, { status: 400 });
    const sample = [Object.fromEntries(IMPORT_TEMPLATES[type].map((header) => [header, '']))];
    const sheet = XLSX.utils.json_to_sheet(sample, { header: IMPORT_TEMPLATES[type] });
    if (format === 'csv') {
      return new NextResponse(XLSX.utils.sheet_to_csv(sheet), {
        headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${type}-template.csv"` },
      });
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Import');
    return new NextResponse(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }), {
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': `attachment; filename="${type}-template.xlsx"` },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Template failed' }, { status: authorizationStatus(error) });
  }
}
