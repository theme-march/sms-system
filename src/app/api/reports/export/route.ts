import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import prisma from '@/src/lib/db/prisma';
import { getReport, REPORT_TYPES, type ReportFilters, type ReportType } from '@/src/services/report.service';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { createAuditLog } from '@/src/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.REPORTS_EXPORT);
    const body = await request.json() as { type: ReportType; format: 'csv' | 'xlsx' | 'pdf'; filters?: ReportFilters; mode?: 'download' | 'print' };
    if (!REPORT_TYPES.includes(body.type) || !['csv', 'xlsx', 'pdf'].includes(body.format)) {
      return NextResponse.json({ error: 'Invalid export request' }, { status: 400 });
    }
    const filters = { ...(body.filters || {}), page: 1, pageSize: 500 };
    const first = await getReport(body.type, filters);
    const rows = [...first.data];
    for (let page = 2; page <= Math.min(first.totalPages, 100); page++) {
      const result = await getReport(body.type, { ...filters, page });
      rows.push(...result.data);
    }
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${body.type}-${stamp}.${body.format === 'pdf' ? 'html' : body.format}`;
    await prisma.exportHistory.create({
      data: {
        schoolId: session.schoolId, userId: session.id, reportType: body.type,
        format: body.format, filters: (body.filters || {}) as object, rowCount: rows.length,
        fileName, completedAt: new Date(),
      },
    });
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'EXPORT', module: 'Reports', details: `Exported ${body.type} as ${body.format} (${rows.length} rows)` });

    if (body.format === 'csv') {
      const sheet = XLSX.utils.json_to_sheet(rows);
      return new NextResponse(XLSX.utils.sheet_to_csv(sheet), {
        headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${fileName}"` },
      });
    }
    if (body.format === 'xlsx') {
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Report');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return new NextResponse(buffer, {
        headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': `attachment; filename="${fileName}"` },
      });
    }
    const headers = first.columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('');
    const tableRows = rows.map((row) => `<tr>${first.columns.map((column) => `<td>${escapeHtml(String(row[column.key] ?? ''))}</td>`).join('')}</tr>`).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(first.title)}</title><style>
      *{box-sizing:border-box}body{margin:0;padding:20px;color:#0f172a;font-family:Arial,sans-serif;background:#fff}
      .toolbar{display:flex;justify-content:flex-end;margin-bottom:16px}.toolbar button{border:0;border-radius:6px;background:#0d9488;color:#fff;padding:9px 14px;font-weight:700;cursor:pointer}
      .report-header{display:flex;align-items:flex-end;justify-content:space-between;border-bottom:2px solid #0d9488;padding-bottom:10px;margin-bottom:14px}
      h1{font-size:20px;margin:0 0 4px}.meta{color:#64748b;font-size:10px;margin:0}.count{font-size:11px;font-weight:700;color:#334155}
      table{border-collapse:collapse;width:100%;font-size:9px}thead{display:table-header-group}th{background:#f0fdfa;color:#115e59;font-weight:700}
      th,td{border:1px solid #cbd5e1;padding:5px 6px;text-align:left;vertical-align:top;overflow-wrap:anywhere}tr{break-inside:avoid}tbody tr:nth-child(even){background:#f8fafc}
      @page{size:A4 landscape;margin:10mm}@media print{body{padding:0}.toolbar{display:none}.report-header{margin-top:0}table{font-size:8px}th,td{padding:4px}}
    </style></head><body><div class="toolbar"><button onclick="window.print()">Print / Save as PDF</button></div><header class="report-header"><div><h1>${escapeHtml(first.title)}</h1><p class="meta">Generated ${escapeHtml(new Date().toLocaleString())}</p></div><div class="count">${rows.length.toLocaleString()} record${rows.length === 1 ? '' : 's'}</div></header><table><thead><tr>${headers}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Disposition': `${body.mode === 'print' ? 'inline' : 'attachment'}; filename="${fileName}"` },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Export failed' }, { status: authorizationStatus(error) });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}
