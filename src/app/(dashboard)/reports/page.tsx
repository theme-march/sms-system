'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Download, FileSpreadsheet, Printer, RefreshCw, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';

const reportTypes = [
  ['student', 'Student report'], ['admission', 'Admission report'], ['enrollment', 'Enrollment report'],
  ['promotion', 'Promotion report'], ['attendance', 'Attendance report'], ['class-routine', 'Class routine report'],
  ['exam-routine', 'Exam routine report'], ['exam-result', 'Exam result report'],
  ['subject-performance', 'Subject performance'], ['class-performance', 'Class performance'],
  ['fee-collection', 'Fee collection report'], ['monthly-tuition', 'Monthly tuition report'],
  ['exam-fee', 'Exam fee report'], ['outstanding-due', 'Outstanding due report'],
  ['scholarship-waiver', 'Scholarship and waiver report'], ['income', 'Income report'],
  ['expense', 'Expense report'], ['profit-loss', 'Profit and loss report'], ['payroll', 'Payroll report'],
  ['salary-payment', 'Salary payment report'], ['teacher-workload', 'Teacher workload report'],
  ['audit-activity', 'Audit activity report'],
] as const;
const importTypes = ['students', 'guardians', 'teachers', 'employees', 'subjects', 'attendance', 'marks', 'fee-records', 'legacy-installments'];
type Option = { id: string; name: string };
type Options = Record<'academicYears' | 'sessions' | 'classes' | 'sections' | 'groups' | 'subjects' | 'students' | 'teachers', Option[]>;
type Report = { title: string; columns: { key: string; label: string }[]; data: Record<string, any>[]; total: number; page: number; pageSize: number; totalPages: number };
type ImportPreview = { historyId: string; totalRows: number; validRows: number; invalidRows: number; columns: string[]; expectedColumns: string[]; preview: { row: number; data: Record<string, any>; errors: { field: string; message: string }[] }[]; canConfirm: boolean };

const emptyOptions: Options = { academicYears: [], sessions: [], classes: [], sections: [], groups: [], subjects: [], students: [], teachers: [] };
const fieldClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/10';

export default function ReportsPage() {
  const [tab, setTab] = useState<'reports' | 'imports' | 'history'>('reports');
  const [type, setType] = useState('student');
  const [filters, setFilters] = useState<Record<string, string>>({ page: '1', pageSize: '25', sortOrder: 'asc' });
  const [options, setOptions] = useState<Options>(emptyOptions);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const optionsInitialized = useRef(false);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [importType, setImportType] = useState('students');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importResult, setImportResult] = useState<any>(null);
  const [history, setHistory] = useState<any>({ imports: [], exports: [] });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const params = new URLSearchParams();
    ['academicYearId', 'sessionId', 'classId', 'sectionId', 'groupId', 'subjectId'].forEach((key) => {
      if (filters[key]) params.set(key, filters[key]);
    });
    setOptionsLoading(true);
    fetch(`/api/reports/options?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load report filters.');
        return data;
      })
      .then((data) => {
        if (!active) return;
        setOptions(data);
        if (!optionsInitialized.current) {
          optionsInitialized.current = true;
          setFilters((current) => ({
            ...current,
            academicYearId: data.defaults?.academicYearId || '',
            sessionId: data.defaults?.sessionId || '',
          }));
        }
      })
      .catch((cause) => {
        if (active && cause instanceof Error && cause.name !== 'AbortError') setError(cause.message);
      })
      .finally(() => { if (active) setOptionsLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [filters.academicYearId, filters.sessionId, filters.classId, filters.sectionId, filters.groupId, filters.subjectId]);

  const loadReport = async (overrides: Record<string, string> = {}) => {
    setLoading(true); setError('');
    const nextFilters = { ...filters, ...overrides };
    const params = new URLSearchParams({ type });
    Object.entries(nextFilters).forEach(([key, value]) => value && params.set(key, value));
    try {
      const response = await fetch(`/api/reports?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Report generation failed');
      setFilters(nextFilters); setReport(data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Report generation failed'); }
    finally { setLoading(false); }
  };

  const exportReport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/reports/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, format, filters }) });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Export failed'); }
      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition') || '';
      const name = disposition.match(/filename="([^"]+)"/)?.[1] || `${type}.${format}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = name; link.click();
      URL.revokeObjectURL(url);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Export failed'); }
    finally { setLoading(false); }
  };

  const printReport = async () => {
    if (!report) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setError('Print window was blocked. Allow pop-ups for this site and try again.');
      return;
    }
    printWindow.opener = null;
    printWindow.document.write('<!doctype html><title>Preparing report…</title><p style="font-family:Arial;padding:24px">Preparing report for printing…</p>');
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, format: 'pdf', mode: 'print', filters }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Print preparation failed');
      }
      const html = await response.text();
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      window.setTimeout(() => printWindow.print(), 250);
    } catch (cause) {
      printWindow.close();
      setError(cause instanceof Error ? cause.message : 'Print preparation failed');
    } finally {
      setLoading(false);
    }
  };

  const previewImport = async () => {
    if (!file) return setError('Choose a CSV or Excel file first.');
    setLoading(true); setError(''); setImportResult(null);
    const form = new FormData(); form.set('file', file); form.set('type', importType); form.set('mapping', JSON.stringify(mapping));
    try {
      const response = await fetch('/api/imports/preview', { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Import validation failed');
      setPreview(data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Import validation failed'); }
    finally { setLoading(false); }
  };

  const confirmImport = async () => {
    if (!preview) return;
    setLoading(true); setError('');
    try {
      const response = await fetch(`/api/imports/${preview.historyId}/confirm`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Import failed');
      setImportResult(data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Import failed'); }
    finally { setLoading(false); }
  };

  const loadHistory = async () => {
    setLoading(true);
    try { const response = await fetch('/api/imports/history'); const data = await response.json(); if (!response.ok) throw new Error(data.error); setHistory(data); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'History failed'); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (tab === 'history') loadHistory(); }, [tab]);

  const updateFilter = (key: string, value: string) => {
    const dependentFields: Record<string, string[]> = {
      academicYearId: ['sessionId', 'classId', 'sectionId', 'groupId', 'subjectId', 'studentId', 'teacherId'],
      sessionId: ['classId', 'sectionId', 'groupId', 'subjectId', 'studentId', 'teacherId'],
      classId: ['sectionId', 'groupId', 'subjectId', 'studentId', 'teacherId'],
      sectionId: ['studentId', 'teacherId'],
      groupId: ['studentId', 'teacherId'],
      subjectId: ['teacherId'],
    };
    setFilters((current) => {
      const next = { ...current, [key]: value, page: '1' };
      dependentFields[key]?.forEach((field) => { next[field] = ''; });
      return next;
    });
    setReport(null);
  };

  const selectFilter = (label: string, key: string, items: Option[]) => (
    <label className="space-y-1"><span className="text-[10px] font-bold uppercase text-slate-400">{label}</span>
      <select className={fieldClass} value={filters[key] || ''} disabled={optionsLoading || items.length === 0} onChange={(event) => updateFilter(key, event.target.value)}>
        <option value="">{items.length ? `All (${items.length})` : `No ${label.toLowerCase()} available`}</option>{items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
    </label>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Reports, Import & Export" subtitle="Tenant-scoped analytics, official exports, and validated bulk data operations" breadcrumbs={[{ label: 'Reports' }]} />
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
        {(['reports', 'imports', 'history'] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-lg px-4 py-2 text-xs font-bold capitalize ${tab === item ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{item === 'imports' ? 'Bulk Import' : item}</button>)}
      </div>
      {error && <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700"><AlertCircle className="h-4 w-4" />{error}</div>}

      {tab === 'reports' && <>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            <label className="space-y-1 md:col-span-2"><span className="text-[10px] font-bold uppercase text-slate-400">Report</span>
              <select className={fieldClass} value={type} onChange={(event) => { setType(event.target.value); setReport(null); }}>{reportTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            </label>
            {selectFilter('Academic year', 'academicYearId', options.academicYears)}
            {selectFilter('Session', 'sessionId', options.sessions)}
            {selectFilter('Class', 'classId', options.classes)}
            {selectFilter('Section', 'sectionId', options.sections)}
            {selectFilter('Group', 'groupId', options.groups)}
            {selectFilter('Subject', 'subjectId', options.subjects)}
            {selectFilter('Student', 'studentId', options.students)}
            {selectFilter('Teacher', 'teacherId', options.teachers)}
            <label className="space-y-1"><span className="text-[10px] font-bold uppercase text-slate-400">From</span><input type="date" className={fieldClass} value={filters.startDate || ''} onChange={(event) => setFilters({ ...filters, startDate: event.target.value, page: '1' })} /></label>
            <label className="space-y-1"><span className="text-[10px] font-bold uppercase text-slate-400">To</span><input type="date" className={fieldClass} value={filters.endDate || ''} onChange={(event) => setFilters({ ...filters, endDate: event.target.value, page: '1' })} /></label>
            <label className="space-y-1"><span className="text-[10px] font-bold uppercase text-slate-400">Month</span><select className={fieldClass} value={filters.month || ''} onChange={(event) => setFilters({ ...filters, month: event.target.value, page: '1' })}><option value="">All</option>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{new Date(2026, index).toLocaleString(undefined, { month: 'long' })}</option>)}</select></label>
            <label className="space-y-1"><span className="text-[10px] font-bold uppercase text-slate-400">Calendar year</span><input type="number" min="2000" max="2200" className={fieldClass} value={filters.year || ''} onChange={(event) => setFilters({ ...filters, year: event.target.value, page: '1' })} /></label>
            <label className="space-y-1"><span className="text-[10px] font-bold uppercase text-slate-400">Payment status</span><select className={fieldClass} value={filters.paymentStatus || ''} onChange={(event) => setFilters({ ...filters, paymentStatus: event.target.value, page: '1' })}><option value="">All</option>{['unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled'].map((status) => <option key={status}>{status}</option>)}</select></label>
            <label className="space-y-1 md:col-span-2"><span className="text-[10px] font-bold uppercase text-slate-400">Search</span><input className={fieldClass} placeholder="Search report rows…" value={filters.search || ''} onChange={(event) => setFilters({ ...filters, search: event.target.value, page: '1' })} /></label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => loadReport()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Generate</button>
            <button onClick={printReport} disabled={!report || loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold disabled:opacity-40"><Printer className="h-4 w-4" />Print</button>
            <button onClick={() => exportReport('csv')} disabled={!report} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold disabled:opacity-40">CSV</button>
            <button onClick={() => exportReport('xlsx')} disabled={!report} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold disabled:opacity-40"><FileSpreadsheet className="h-4 w-4" />Excel</button>
            <button onClick={() => exportReport('pdf')} disabled={!report} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold disabled:opacity-40"><Download className="h-4 w-4" />PDF-ready</button>
          </div>
        </div>
        {report && <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs print:shadow-none">
          <div className="flex items-center justify-between border-b border-slate-100 p-4"><div><h2 className="text-sm font-bold">{report.title}</h2><p className="text-xs text-slate-400">{report.total.toLocaleString()} rows</p></div></div>
          <div className="overflow-x-auto"><table className="min-w-full text-left text-xs"><thead className="bg-slate-50"><tr>{report.columns.map((column) => <th key={column.key} className="whitespace-nowrap px-3 py-3 font-bold text-slate-500"><button onClick={() => loadReport({ sortBy: column.key, sortOrder: filters.sortBy === column.key && filters.sortOrder === 'asc' ? 'desc' : 'asc' })}>{column.label}</button></th>)}</tr></thead><tbody className="divide-y divide-slate-100">{report.data.map((row, index) => <tr key={index} className="hover:bg-slate-50">{report.columns.map((column) => <td key={column.key} className="max-w-xs whitespace-nowrap px-3 py-2.5 text-slate-700">{String(row[column.key] ?? '—')}</td>)}</tr>)}</tbody></table></div>
          {!report.data.length && <p className="p-10 text-center text-xs text-slate-400">No records match these filters.</p>}
          <div className="flex items-center justify-between border-t border-slate-100 p-3 text-xs"><span>Page {report.page} of {report.totalPages || 1}</span><div className="flex gap-2"><button disabled={report.page <= 1} onClick={() => loadReport({ page: String(report.page - 1) })} className="rounded border px-3 py-1 disabled:opacity-40">Previous</button><button disabled={report.page >= report.totalPages} onClick={() => loadReport({ page: String(report.page + 1) })} className="rounded border px-3 py-1 disabled:opacity-40">Next</button></div></div>
        </div>}
      </>}

      {tab === 'imports' && <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-3"><label className="space-y-1"><span className="text-xs font-bold">Import type</span><select className={fieldClass} value={importType} onChange={(event) => { setImportType(event.target.value); setPreview(null); setMapping({}); }}>{importTypes.map((item) => <option key={item} value={item}>{item.replace(/-/g, ' ')}</option>)}</select></label><label className="space-y-1 md:col-span-2"><span className="text-xs font-bold">CSV or Excel file (max 5 MB)</span><input type="file" accept=".csv,.xls,.xlsx" className={fieldClass} onChange={(event) => { setFile(event.target.files?.[0] || null); setPreview(null); }} /></label></div>
        <div className="flex flex-wrap gap-2"><a href={`/api/imports/template?type=${importType}&format=xlsx`} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold"><Download className="h-4 w-4" />Download template</a><button onClick={previewImport} disabled={!file || loading} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-40"><Upload className="h-4 w-4" />Validate & preview</button></div>
        {preview && <><div className="grid grid-cols-3 gap-3">{[['Total', preview.totalRows], ['Valid', preview.validRows], ['Invalid', preview.invalidRows]].map(([label, value]) => <div key={String(label)} className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] uppercase text-slate-400">{label}</p><p className="text-xl font-black">{value}</p></div>)}</div>
          <div><h3 className="mb-2 text-xs font-bold">Column mapping</h3><div className="grid gap-2 md:grid-cols-3">{preview.columns.map((column) => <label key={column} className="flex items-center gap-2 text-xs"><span className="w-28 truncate">{column}</span><select className={fieldClass} value={mapping[column] || column} onChange={(event) => setMapping({ ...mapping, [column]: event.target.value })}><option value="">Ignore</option>{preview.expectedColumns.map((target) => <option key={target} value={target}>{target}</option>)}</select></label>)}</div><button onClick={previewImport} className="mt-2 text-xs font-bold text-teal-600">Revalidate with mapping</button></div>
          <div className="max-h-96 overflow-auto rounded-lg border"><table className="min-w-full text-xs"><thead className="sticky top-0 bg-slate-50"><tr><th className="p-2">Row</th><th className="p-2">Data</th><th className="p-2">Validation</th></tr></thead><tbody>{preview.preview.map((row) => <tr key={row.row} className="border-t align-top"><td className="p-2">{row.row}</td><td className="p-2 font-mono text-[10px]">{JSON.stringify(row.data)}</td><td className="p-2">{row.errors.length ? row.errors.map((item, index) => <p key={index} className="text-rose-600">{item.field}: {item.message}</p>) : <span className="text-emerald-600">Valid</span>}</td></tr>)}</tbody></table></div>
          <button onClick={confirmImport} disabled={!preview.canConfirm || loading || !!importResult} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-40">Confirm import of {preview.validRows} valid rows</button>
        </>}
        {importResult && <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800"><CheckCircle2 className="h-4 w-4" />Imported {importResult.imported}; failed {importResult.failed}; invalid {importResult.invalid}. Reports are saved in import history.</div>}
        {importType === 'legacy-installments' && <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">Legacy installments are stored in isolated legacy tables. They never modify current invoices without a separately authorized migration operation.</p>}
      </div>}

      {tab === 'history' && <div className="grid gap-4 lg:grid-cols-2">{[['Import history', history.imports], ['Export history', history.exports]].map(([label, records]: any) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4"><h2 className="mb-3 text-sm font-bold">{label}</h2><div className="divide-y">{records.map((item: any) => <div key={item.id} className="py-3 text-xs"><div className="flex justify-between"><span className="font-bold">{item.importType || item.reportType}</span><span className="text-slate-400">{new Date(item.createdAt).toLocaleString()}</span></div><p className="mt-1 text-slate-500">{item.fileName || item.format} · {item.status} · {item.successRows ?? item.rowCount ?? 0} rows</p>{item.importType && <div className="mt-2 flex gap-3"><a className="font-bold text-teal-700" href={`/api/imports/${item.id}/report?kind=success`}>Success CSV</a><a className="font-bold text-rose-700" href={`/api/imports/${item.id}/report?kind=error`}>Error CSV</a></div>}</div>)}{!records.length && <p className="py-8 text-center text-xs text-slate-400">No history yet.</p>}</div></div>)}</div>}
    </div>
  );
}
