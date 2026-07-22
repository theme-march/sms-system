import React from 'react';
import { prisma } from '../../../../lib/prisma';
import { format } from 'date-fns';

export default async function HRLeaveManagement() {
  const schoolId = 'school-1';
  
  const applications = await prisma.leaveApplication.findMany({
    where: { schoolId },
    orderBy: { appliedAt: 'desc' },
  }).catch(() => []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leave Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Leave Policies</button>
      </div>

      <div className="bg-white border rounded p-4 shadow-sm">
        <h2 className="font-bold mb-4">Pending Leave Applications</h2>
        {applications.length === 0 ? (
          <p className="text-muted-foreground">No leave applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Employee ID</th>
                  <th className="py-2">Leave Type</th>
                  <th className="py-2">Date Range</th>
                  <th className="py-2">Days</th>
                  <th className="py-2">Reason</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b">
                    <td className="py-2">{app.userId}</td>
                    <td className="py-2">{app.leaveTypeId}</td>
                    <td className="py-2">{format(new Date(app.startDate), 'MMM d')} - {format(new Date(app.endDate), 'MMM d, yyyy')}</td>
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
                    <td className="py-2 text-right space-x-2">
                      {app.status === 'PENDING' && (
                        <>
                          <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">Approve</button>
                          <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Reject</button>
                        </>
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
