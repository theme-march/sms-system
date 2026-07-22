'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  Plus,
  Printer,
  CheckCircle2,
  AlertTriangle,
  X,
  Filter,
  Lock,
  Eye,
  Megaphone,
} from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  getExamRoutines,
  createExamRoutine,
  updateExamRoutine,
  publishExamRoutine,
  deleteExamRoutine,
  ExamRoutineRecord,
} from '@/src/services/exam-routine.service';

export default function ExamRoutinePage() {
  const [loading, setLoading] = useState(true);
  const [examRoutines, setExamRoutines] = useState<ExamRoutineRecord[]>([]);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUARDIAN'>('ADMIN');

  // Filters
  const [selectedClass, setSelectedClass] = useState('c-6');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Messages & Modals
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formPayload, setFormPayload] = useState({
    schoolId: 'school-1',
    academicYearId: 'ay-2026',
    examId: 'ex-1',
    examName: 'First Term Final Examination 2026',
    classId: 'c-6',
    sectionId: 's-padma',
    subjectId: 'sub-1',
    examDate: '2026-04-10',
    startTime: '10:00',
    endTime: '13:00',
    durationMinutes: 180,
    roomId: 'r-101',
    totalMarks: 100,
    passMarks: 33,
    instructions: 'Bring admit card and standard stationery. Electronic devices prohibited.',
    status: 'DRAFT' as const,
  });

  const fetchExams = async () => {
    setLoading(true);
    try {
      const data = await getExamRoutines({
        classId: selectedClass,
        status: statusFilter,
        userRole: selectedRole,
        search: searchQuery,
      });
      setExamRoutines(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [selectedClass, statusFilter, selectedRole, searchQuery]);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await createExamRoutine(formPayload);
      setSuccessMessage('Exam routine schedule created successfully!');
      setShowAddModal(false);
      fetchExams();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to schedule exam routine due to validation conflict.');
    }
  };

  const handlePublishAll = async () => {
    try {
      const res = await publishExamRoutine('ex-1', selectedClass);
      setSuccessMessage(`Published ${res.publishedCount} exam schedule routines! Publication notifications generated for students & guardians.`);
      fetchExams();
    } catch {
      // Handled
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <PageHeader
          title="Exam Routine Management"
          subtitle="Term end examination schedules, room allocations, and student publishing"
          breadcrumbs={[{ label: 'Exams' }, { label: 'Exam Routines' }]}
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Exam Schedule</span>
              </button>
              {selectedRole === 'ADMIN' && (
                <>
                  <button
                    onClick={handlePublishAll}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Megaphone className="w-4 h-4" />
                    <span>Publish Routine & Notify</span>
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Schedule Exam</span>
                  </button>
                </>
              )}
            </div>
          }
        />
      </div>

      {/* Printable Header */}
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black text-slate-900">DHAKA IDEAL HIGH SCHOOL</h1>
        <h2 className="text-sm font-bold text-slate-700">Official Term Examination Routine (2026)</h2>
        <p className="text-xs text-slate-500">
          Published Date: April 2026 • Valid for Students & Guardians
        </p>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')}>
            <X className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')}>
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Role & Filter Selector Controls */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Simulate Access Role:</span>
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-bold">
              {(['ADMIN', 'TEACHER', 'STUDENT', 'GUARDIAN'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    selectedRole === role ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            >
              <option value="c-6">Class 6</option>
              <option value="c-7">Class 7</option>
              <option value="c-8">Class 8</option>
              <option value="c-9">Class 9</option>
              <option value="c-10">Class 10</option>
            </select>

            {selectedRole !== 'STUDENT' && selectedRole !== 'GUARDIAN' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            )}
          </div>
        </div>

        {(selectedRole === 'STUDENT' || selectedRole === 'GUARDIAN') && (
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg text-xs font-medium text-teal-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Student & Guardian Access Restriction Enforced: Showing <strong>PUBLISHED</strong> exam routines only. Draft schedules remain hidden until official release.</span>
          </div>
        )}
      </div>

      {/* Exam Routine Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="px-4 py-3">Exam Date & Time</th>
                <th className="px-4 py-3">Subject & Code</th>
                <th className="px-4 py-3">Class & Section</th>
                <th className="px-4 py-3 text-center">Room</th>
                <th className="px-4 py-3 text-center">Duration</th>
                <th className="px-4 py-3 text-center">Marks (Total / Pass)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Instructions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {examRoutines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                    No exam routines scheduled for the selected filters.
                  </td>
                </tr>
              ) : (
                examRoutines.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>{ex.examDate}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono pl-5">
                        {ex.startTime} - {ex.endTime}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-extrabold text-slate-900">{ex.subjectName || 'Subject'}</div>
                      <div className="text-[10px] text-teal-700 font-mono">{ex.subjectCode || 'SUB-101'}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{ex.className || 'Class 6'}</div>
                      <div className="text-[10px] text-slate-500">{ex.sectionName || 'Padma Section'}</div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-slate-100 rounded-md font-mono text-[10px] font-bold text-slate-700">
                        {ex.roomName || ex.roomId || 'RM-101'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center font-semibold text-slate-700">
                      {ex.durationMinutes} mins
                    </td>

                    <td className="px-4 py-3 text-center font-bold text-slate-800">
                      {ex.totalMarks} / <span className="text-emerald-700">{ex.passMarks}</span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={ex.status} />
                    </td>

                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                      {ex.instructions || 'Standard examination hall rules apply.'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Schedule Exam Routine</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={formPayload.classId}
                    onChange={(e) => setFormPayload({ ...formPayload, classId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="c-6">Class 6</option>
                    <option value="c-7">Class 7</option>
                    <option value="c-8">Class 8</option>
                    <option value="c-9">Class 9</option>
                    <option value="c-10">Class 10</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={formPayload.subjectId}
                    onChange={(e) => setFormPayload({ ...formPayload, subjectId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="sub-1">Bangla 1st Paper</option>
                    <option value="sub-2">English 1st Paper</option>
                    <option value="sub-3">General Mathematics</option>
                    <option value="sub-5">Physics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={formPayload.examDate}
                    onChange={(e) => setFormPayload({ ...formPayload, examDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={formPayload.startTime}
                    onChange={(e) => setFormPayload({ ...formPayload, startTime: e.target.value })}
                    placeholder="10:00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={formPayload.endTime}
                    onChange={(e) => setFormPayload({ ...formPayload, endTime: e.target.value })}
                    placeholder="13:00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={formPayload.totalMarks}
                    onChange={(e) => setFormPayload({ ...formPayload, totalMarks: parseFloat(e.target.value) || 100 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pass Marks</label>
                  <input
                    type="number"
                    value={formPayload.passMarks}
                    onChange={(e) => setFormPayload({ ...formPayload, passMarks: parseFloat(e.target.value) || 33 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formPayload.status}
                    onChange={(e) => setFormPayload({ ...formPayload, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructions</label>
                <textarea
                  rows={2}
                  value={formPayload.instructions}
                  onChange={(e) => setFormPayload({ ...formPayload, instructions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
                >
                  Save Exam Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
