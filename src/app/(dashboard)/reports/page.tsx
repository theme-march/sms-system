'use client';

import React from 'react';
import { BarChart3, Download, FileSpreadsheet, Printer } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { generatePDF } from '@/src/lib/pdf';
import { exportToExcel } from '@/src/lib/export';

export default function ReportsPage() {
  const handlePDFReport = () => {
    const cols = [
      { header: 'Metric Name', dataKey: 'metric' },
      { header: 'Academic Session 2026', dataKey: 'value' },
      { header: 'Status / YoY Growth', dataKey: 'status' },
    ];
    const data = [
      { metric: 'Total Enrolled Students', value: '1,250 Students', status: '+12% Growth' },
      { metric: 'Total Teaching Faculty', value: '48 Teachers', status: 'Full Capacity' },
      { metric: 'Annual Fee Collections', value: 'BDT ৳ 1,845,000', status: '+18.4% Revenue' },
      { metric: 'Average Attendance Rate', value: '94.8%', status: 'Exceeds Benchmark' },
    ];
    generatePDF('Executive Annual School Report 2026', 'Dhaka Ideal Model High School & College', cols, data);
  };

  const handleExcelReport = () => {
    const data = [
      { Metric: 'Total Enrolled Students', Value: 1250, Status: 'Active' },
      { Metric: 'Total Teaching Faculty', Value: 48, Status: 'Active' },
      { Metric: 'Fee Collection Total (BDT)', Value: 1845000, Status: 'Collected' },
      { Metric: 'Attendance Percentage', Value: '94.8%', Status: 'Optimal' },
    ];
    exportToExcel('School_Management_Report_2026', 'Executive_Summary', data);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics Console"
        subtitle="Generate official transcripts, attendance statistics, fee collection logs, and PDF / Excel exports"
        breadcrumbs={[{ label: 'Reports' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Executive Summary PDF Report</h3>
          </div>
          <p className="text-xs text-slate-500">
            Includes total student enrollment, faculty counts, fee collection summaries, and overall academic performance metrics.
          </p>
          <button
            onClick={handlePDFReport}
            className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Generate PDF Summary</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Financial & Fee Audit Excel Export</h3>
          </div>
          <p className="text-xs text-slate-500">
            Export structured XLSX worksheets containing monthly payment receipts, pending dues, and payroll breakdown.
          </p>
          <button
            onClick={handleExcelReport}
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export XLSX Audit Worksheet</span>
          </button>
        </div>
      </div>
    </div>
  );
}
