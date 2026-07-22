import React from 'react';
import { BookOpen, Plus, Calendar, User } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';

export default function HomeworkPage() {
  const assignments = [
    {
      id: 'hw-1',
      title: 'Higher Mathematics - Trigonometric Identities Exercise 7.2',
      class: 'Class 10 (Padma & Meghna)',
      subject: 'Higher Mathematics',
      teacher: 'Mohammad Ali Hossain',
      dueDate: '25/07/2026',
      description: 'Solve problems 1 to 15 from NCTB textbook page 142 in homework notebook.',
    },
    {
      id: 'hw-2',
      title: 'Physics - Newton Laws of Motion & Momentum Problems',
      class: 'Class 10 (Padma)',
      subject: 'Physics',
      teacher: 'Dr. Shahabuddin Ahmed',
      dueDate: '26/07/2026',
      description: 'Complete mathematical problem set 3 from chapter 4.',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homework Assignments"
        subtitle="Subject homework tasks, instructions, and due dates"
        breadcrumbs={[{ label: 'Homework' }]}
        action={
          <button className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Post Assignment</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((hw) => (
          <div key={hw.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 uppercase">
                {hw.subject}
              </span>
              <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Due: {hw.dueDate}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{hw.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{hw.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{hw.class}</span>
              <span className="font-medium text-slate-700">Teacher: {hw.teacher}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
