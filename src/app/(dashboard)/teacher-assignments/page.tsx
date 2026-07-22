'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  BookOpen,
  Plus,
  Filter,
  Trash2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Award,
} from 'lucide-react';
import {
  getTeacherAssignments,
  createTeacherAssignment,
  deleteTeacherAssignment,
  getTeachers,
} from '@/src/services/staff.service';
import { teacherAssignmentSchema } from '@/src/lib/validations/staff';

export default function TeacherAssignmentsPage() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  // Filters
  const [yearFilter, setYearFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    schoolId: 'sch-ideal-101',
    academicYearId: 'ay-2026',
    sessionId: 'sess-2026',
    teacherId: '',
    classId: 'c-10',
    sectionId: 's-padma',
    groupId: '',
    subjectId: 'sub-phys',
    isClassTeacher: false,
    status: 'ACTIVE',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAssignments, resTeachers] = await Promise.all([
        getTeacherAssignments({
          academicYearId: yearFilter,
          teacherId: teacherFilter,
          classId: classFilter,
          page,
          pageSize: 8,
        }),
        getTeachers({ pageSize: 100 }),
      ]);

      setAssignments(resAssignments.data);
      setTotalPages(resAssignments.totalPages);
      setTotalCount(resAssignments.total);
      setTeachers(resTeachers.data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [yearFilter, teacherFilter, classFilter, page]);

  const handleOpenAssignModal = () => {
    setFormData({
      schoolId: 'sch-ideal-101',
      academicYearId: 'ay-2026',
      sessionId: 'sess-2026',
      teacherId: teachers[0]?.id || '',
      classId: 'c-10',
      sectionId: 's-padma',
      groupId: '',
      subjectId: 'sub-phys',
      isClassTeacher: false,
      status: 'ACTIVE',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const validation = teacherAssignmentSchema.safeParse(formData);
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || 'Validation error.');
      setSubmitting(false);
      return;
    }

    try {
      await createTeacherAssignment(formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to unassign this teacher slot?')) {
      await deleteTeacherAssignment(id);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Assignments (শিক্ষক দায়িত্ব বণ্টন)"
        subtitle="Allocate teachers to subject classes, sections, academic years, and assign class teacher responsibilities"
        breadcrumbs={[{ label: 'Teacher Assignments' }]}
        action={
          <button
            onClick={handleOpenAssignModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Teacher (দায়িত্ব বণ্টন করুন)</span>
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 min-w-[200px]"
            >
              <option value="">All Teachers</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nameEn} ({t.employeeCode})
                </option>
              ))}
            </select>
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">All Classes</option>
            <option value="c-10">Class 10</option>
            <option value="c-9">Class 9</option>
            <option value="c-8">Class 8</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Allocations: <span className="font-bold text-slate-800">{totalCount}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading teacher assignments...</span>
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No teacher assignments found.</p>
            <p className="text-xs">Click "Assign Teacher" to map a teacher to a class subject.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Teacher</th>
                  <th className="px-4 py-3">Class & Section</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Class Teacher?</th>
                  <th className="px-4 py-3">Academic Year</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((asgn) => {
                  const tchName = asgn.teacher?.nameEn || 'Teacher';
                  const tchCode = asgn.teacher?.employeeCode || 'EMP';
                  const className = asgn.class?.name || 'Class 10';
                  const sectionName = asgn.section?.name || 'Padma';
                  const subjectName = asgn.subject?.nameEn || 'Physics';

                  return (
                    <tr key={asgn.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {tchName} <span className="text-[10px] font-mono text-slate-400 font-normal">({tchCode})</span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        {className} - Section {sectionName}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-teal-700">
                        {subjectName}
                      </td>
                      <td className="px-4 py-3.5">
                        {asgn.isClassTeacher ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200">
                            <Award className="w-3 h-3 text-amber-600" />
                            Class Teacher
                          </span>
                        ) : (
                          <span className="text-slate-400">Subject Teacher</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-mono">
                        {asgn.academicYear?.name || '2026-2027'}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={asgn.status || 'ACTIVE'} />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(asgn.id)}
                          title="Remove Assignment"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assign Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Assign Teacher to Subject & Class</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-semibold">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Teacher *</label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                >
                  <option value="">-- Choose Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nameEn} ({t.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Class *</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="c-10">Class 10</option>
                    <option value="c-9">Class 9</option>
                    <option value="c-8">Class 8</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Section *</label>
                  <select
                    value={formData.sectionId}
                    onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="s-padma">Padma</option>
                    <option value="s-meghna">Meghna</option>
                    <option value="s-jamuna">Jamuna</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject *</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="sub-phys">Physics (PHYS)</option>
                  <option value="sub-math">Higher Mathematics (HMATH)</option>
                  <option value="sub-eng">English 1st Paper (ENG1)</option>
                  <option value="sub-ict">Information Technology (ICT)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/70 flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-900">Designate as Class Teacher?</p>
                  <p className="text-[10px] text-amber-800">Teacher will manage section attendance & guardian communications</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isClassTeacher}
                  onChange={(e) => setFormData({ ...formData, isClassTeacher: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
