'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Lock, CheckCircle, Award } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';

export default function ExamsPage() {
  const [marks, setMarks] = useState([
    { id: 'm-1', studentName: 'Tanvir Hossain', roll: 1, subject: 'Higher Mathematics', marksObtained: 92, grade: 'A+' },
    { id: 'm-2', studentName: 'Ayesha Rahman', roll: 2, subject: 'Higher Mathematics', marksObtained: 88, grade: 'A+' },
    { id: 'm-3', studentName: 'Sajid Islam', roll: 3, subject: 'Higher Mathematics', marksObtained: 74, grade: 'A' },
    { id: 'm-4', studentName: 'Fariha Karim', roll: 4, subject: 'Higher Mathematics', marksObtained: 81, grade: 'A+' },
  ]);

  const handleMarkChange = (id: string, val: string) => {
    const num = parseFloat(val) || 0;
    let gr = 'F';
    if (num >= 80) gr = 'A+';
    else if (num >= 70) gr = 'A';
    else if (num >= 60) gr = 'A-';
    else if (num >= 50) gr = 'B';
    else if (num >= 40) gr = 'C';
    else if (num >= 33) gr = 'D';

    setMarks((prev) =>
      prev.map((m) => (m.id === id ? { ...m, marksObtained: num, grade: gr } : m))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examinations & Result Ledger"
        subtitle="S.S.C Test Examination 2026 | Marks Verification Sheet"
        breadcrumbs={[{ label: 'Exams' }]}
        action={
          <button className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Marks & Publish</span>
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Mark Sheet Entry - Class 10 (Higher Mathematics)</h3>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">Max Marks: 100</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Marks Obtained (Out of 100)</th>
                <th className="px-4 py-3 text-center">Letter Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marks.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-bold text-slate-900">#{m.roll}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{m.studentName}</td>
                  <td className="px-4 py-3 text-slate-600">{m.subject}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={m.marksObtained}
                      onChange={(e) => handleMarkChange(m.id, e.target.value)}
                      className="w-24 px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-900 focus:outline-hidden focus:border-teal-600"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                      {m.grade}
                    </span>
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
