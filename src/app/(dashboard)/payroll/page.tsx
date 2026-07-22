import React from 'react';
import { DollarSign, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { formatCurrency } from '@/src/lib/utils';

export default function PayrollPage() {
  const payrolls = [
    {
      id: 'pay-1',
      teacherName: 'Dr. Shahabuddin Ahmed',
      designation: 'Headmaster',
      basicSalary: 65000,
      allowances: 5000,
      deductions: 2000,
      netSalary: 68000,
      month: 'July 2026',
      status: 'APPROVED',
    },
    {
      id: 'pay-2',
      teacherName: 'Mohammad Ali Hossain',
      designation: 'Assistant Headmaster',
      basicSalary: 58000,
      allowances: 4000,
      deductions: 1500,
      netSalary: 60500,
      month: 'July 2026',
      status: 'APPROVED',
    },
    {
      id: 'pay-3',
      teacherName: 'Nusrat Jahan Sultana',
      designation: 'Senior Teacher',
      basicSalary: 52000,
      allowances: 3500,
      deductions: 1000,
      netSalary: 54500,
      month: 'July 2026',
      status: 'PENDING',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll & Staff Salaries"
        subtitle="Monthly salary sheet generation, allowances, deductions, and bank transfer disbursements"
        breadcrumbs={[{ label: 'Payroll' }]}
        action={
          <button className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Generate July Payroll</span>
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Salary Sheet - July 2026</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="px-4 py-3">Teacher / Employee</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Basic Salary</th>
                <th className="px-4 py-3">Allowances</th>
                <th className="px-4 py-3">Deductions</th>
                <th className="px-4 py-3 font-bold">Net Payable (BDT)</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payrolls.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900">{p.teacherName}</td>
                  <td className="px-4 py-3 text-slate-600">{p.designation}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{formatCurrency(p.basicSalary)}</td>
                  <td className="px-4 py-3 text-emerald-700 font-medium">+{formatCurrency(p.allowances)}</td>
                  <td className="px-4 py-3 text-rose-600 font-medium">-{formatCurrency(p.deductions)}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{formatCurrency(p.netSalary)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
