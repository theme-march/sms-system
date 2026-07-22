import React from 'react';
import { prisma } from '../../../../lib/prisma';
import { format } from 'date-fns';

export default async function StaffLeaveDashboard() {
  const schoolId = 'school-1';
  const userId = 'teacher-1';

  const applications = await prisma.leaveApplication.findMany({
    where: { userId },
    orderBy: { appliedAt: 'desc' }
  }).catch(() => []);

  const leaveTypes = await prisma.leaveType.findMany({
    where: { schoolId, isActive: true }
  }).catch(() => []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Leave Applications</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Apply for Leave</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaveTypes.map((type) => (
          <div key={type.id} className="bg-white p-4 rounded border shadow-sm">
            <h2 className="text-sm font-medium">{type.name}</h2>
            <div className="text-2xl font-bold">{type.daysAllowed} Days</div>
            <p className="text-xs text-muted-foreground">{type.isPaid ? 'Paid' : 'Unpaid'}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded border shadow-sm">
        <h2 className="font-bold mb-4">History</h2>
        {applications.length === 0 ? (
          <p className="text-muted-foreground">No leave history found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Date Range</th>
                  <th className="py-2">Days</th>
                  <th className="py-2">Reason</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b">
                    <td className="py-2">{format(new Date(app.startDate), 'MMM d, yyyy')} - {format(new Date(app.endDate), 'MMM d, yyyy')}</td>
                    <td className="py-2">{app.totalDays}</td>
                    <td className="py-2 max-w-xs truncate">{app.reason}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
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
