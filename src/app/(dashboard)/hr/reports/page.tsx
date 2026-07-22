import React from 'react';
import { DocumentArrowDownIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';

const reports = [
  { name: 'Monthly Salary Sheet', description: 'Detailed salary sheet for all employees' },
  { name: 'Teacher Salary Report', description: 'Salary details specifically for teaching staff' },
  { name: 'Employee Salary Report', description: 'Salary details for non-teaching staff' },
  { name: 'Department-wise Salary', description: 'Aggregated salary expenses by department' },
  { name: 'Paid Salary Report', description: 'List of successfully paid salaries' },
  { name: 'Unpaid Salary Report', description: 'List of pending salary payments' },
  { name: 'Salary Expense Report', description: 'Overall financial summary of salary expenses' },
];

export default function HRReportsDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">HR & Payroll Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.name} className="bg-white p-4 rounded-lg border shadow-sm hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="flex flex-row items-center space-y-0 gap-3 pb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DocumentChartBarIcon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-base font-bold">{report.name}</h2>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <div className="flex gap-2">
                <button className="text-xs flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800">
                  <DocumentArrowDownIcon className="w-4 h-4" /> PDF
                </button>
                <button className="text-xs flex items-center gap-1 font-medium text-green-600 hover:text-green-800">
                  <DocumentArrowDownIcon className="w-4 h-4" /> Excel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
