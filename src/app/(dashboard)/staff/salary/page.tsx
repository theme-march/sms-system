import React from 'react';
import { prisma } from '../../../../lib/prisma';

export default async function StaffSalaryDashboard() {
  const userId = 'teacher-1';

  const payrolls = await prisma.payroll.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  }).catch(() => []);

  const periodIds = payrolls.map(p => p.payrollPeriodId);
  const periods = await prisma.payrollPeriod.findMany({
    where: { id: { in: periodIds } }
  }).catch(() => [] as any[]);
  const periodMap = new Map<string, any>(periods.map((p: any) => [p.id, p] as const));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Salary & Payslips</h1>

      <div className="bg-white border rounded p-4 shadow-sm">
        <h2 className="font-bold mb-4">Salary History</h2>
        {payrolls.length === 0 ? (
          <p className="text-muted-foreground">No salary records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Period</th>
                  <th className="py-2">Gross Salary</th>
                  <th className="py-2">Deductions</th>
                  <th className="py-2">Net Salary</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((payroll) => {
                  const period = periodMap.get(payroll.payrollPeriodId);
                  return (
                  <tr key={payroll.id} className="border-b">
                    <td className="py-2">
                      {period ? `${period.payrollMonth}/${period.payrollYear}` : 'Unknown'}
                    </td>
                    <td className="py-2">${Number(payroll.grossSalary).toFixed(2)}</td>
                    <td className="py-2">${(Number(payroll.totalDeductions) + Number(payroll.tax) + Number(payroll.absenceDeduction)).toFixed(2)}</td>
                    <td className="py-2 font-bold">${Number(payroll.netSalary).toFixed(2)}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        payroll.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payroll.status}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <button className="border px-3 py-1 rounded text-sm hover:bg-gray-50" disabled={payroll.status !== 'PAID'}>
                        Download PDF
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
