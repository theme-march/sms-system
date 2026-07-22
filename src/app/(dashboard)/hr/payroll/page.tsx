import React from 'react';
import { prisma } from '../../../../lib/prisma';

export default async function HRPayrollManagement() {
  const schoolId = 'school-1';

  const payrollPeriods = await prisma.payrollPeriod.findMany({
    where: { schoolId },
    orderBy: [{ payrollYear: 'desc' }, { payrollMonth: 'desc' }]
  }).catch(() => []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payroll Processing</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Generate Payroll</button>
      </div>

      <div className="bg-white border rounded p-4 shadow-sm">
        <h2 className="font-bold mb-4">Payroll Periods</h2>
        {payrollPeriods.length === 0 ? (
          <p className="text-muted-foreground">No payroll periods found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Period</th>
                  <th className="py-2">Start Date</th>
                  <th className="py-2">End Date</th>
                  <th className="py-2">Working Days</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrollPeriods.map((period) => (
                  <tr key={period.id} className="border-b">
                    <td className="py-2 font-bold">{period.payrollMonth}/{period.payrollYear}</td>
                    <td className="py-2">{new Date(period.startDate).toLocaleDateString()}</td>
                    <td className="py-2">{new Date(period.endDate).toLocaleDateString()}</td>
                    <td className="py-2">{period.workingDays}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        period.status === 'PAID' || period.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {period.status}
                      </span>
                    </td>
                    <td className="py-2 text-right space-x-2">
                      <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">View Details</button>
                      {period.status === 'CALCULATED' && (
                        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">Approve</button>
                      )}
                      {period.status === 'APPROVED' && (
                        <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">Process Payment</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
