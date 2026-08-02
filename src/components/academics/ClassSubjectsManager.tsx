'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, AlertCircle, FileCheck } from 'lucide-react';
import {
  getClassSubjectsList,
  createClassSubject,
  updateClassSubject,
  toggleClassSubjectStatus,
  deleteClassSubject,
  getClassesList,
  getSubjectsList,
  ClassSubjectRecord,
  ClassRecord,
  SubjectRecord,
} from '@/src/services/academic-management.service';
import { classSubjectSchema } from '@/src/lib/validations/academic';
import { createAuditLog } from '@/src/lib/audit';
import { useSchoolContext } from '@/src/components/layout/DashboardLayout';

export function ClassSubjectsManager() {
  const { schoolId } = useSchoolContext();
  const [data, setData] = useState<ClassSubjectRecord[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassSubjectRecord | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    subjectType: 'compulsory' as 'compulsory' | 'optional' | 'additional' | 'practical',
    fullMarks: 100,
    passMarks: 33,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, clsRes, sbjRes] = await Promise.all([
        getClassSubjectsList({
          page,
          pageSize,
          search,
          classId: classFilter,
          status: statusFilter,
        }),
        getClassesList({ page: 1, pageSize: 50 }),
        getSubjectsList({ page: 1, pageSize: 50 }),
      ]);
      setData(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
      setClasses(clsRes.data);
      setSubjects(sbjRes.data);
    } catch {
      setError('Failed to load class-subject mappings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize, search, classFilter, statusFilter]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      classId: classes[0]?.id || '',
      subjectId: subjects[0]?.id || '',
      subjectType: 'compulsory',
      fullMarks: 100,
      passMarks: 33,
      status: 'ACTIVE',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ClassSubjectRecord) => {
    setEditingItem(item);
    setFormData({
      classId: item.classId,
      subjectId: item.subjectId,
      subjectType: item.subjectType || 'compulsory',
      fullMarks: item.fullMarks,
      passMarks: item.passMarks,
      status: item.status,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const payload = {
      schoolId,
      ...formData,
    };

    const validation = classSubjectSchema.safeParse(payload);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    try {
      if (editingItem) {
        await updateClassSubject(editingItem.id, payload);
        await createAuditLog({
          action: 'UPDATE',
          module: 'ClassSubjects',
          recordId: editingItem.id,
          details: `Updated class subject mapping`,
        });
        showNotification('Subject configuration updated');
      } else {
        const created = await createClassSubject(payload);
        await createAuditLog({
          action: 'CREATE',
          module: 'ClassSubjects',
          recordId: created.id,
          details: `Assigned subject to class`,
        });
        showNotification('Subject assigned to class successfully');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (item: ClassSubjectRecord) => {
    try {
      await toggleClassSubjectStatus(item.id);
      await createAuditLog({
        action: 'TOGGLE_STATUS',
        module: 'ClassSubjects',
        recordId: item.id,
        details: `Toggled status for class subject mapping`,
      });
      showNotification('Status updated');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (item: ClassSubjectRecord) => {
    if (!confirm('Are you sure you want to remove this subject from class?')) return;
    try {
      await deleteClassSubject(item.id);
      await createAuditLog({
        action: 'DELETE',
        module: 'ClassSubjects',
        recordId: item.id,
        details: `Removed subject from class`,
      });
      showNotification('Subject unassigned from class');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove subject');
    }
  };

  return (
    <div className="space-y-4">
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap flex-1 items-center gap-3">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects or classes..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Subject to Class</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading class-subject assignments...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileCheck className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No Class-Subject Mappings Found</p>
            <p className="text-xs text-slate-400">Map subjects to classes with pass marks and full marks rules.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Subject Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Full Marks</th>
                  <th className="px-4 py-3">Pass Marks</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{item.className}</td>
                    <td className="px-4 py-3 font-bold text-teal-700">{item.subjectName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded border border-slate-200 uppercase">
                        {item.subjectType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{item.fullMarks}</td>
                    <td className="px-4 py-3 text-emerald-700 font-bold">{item.passMarks}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                          item.status === 'ACTIVE'
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-md"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <span className="font-bold">{data.length}</span> of <span className="font-bold">{totalCount}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-semibold text-slate-800">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? 'Edit Class-Subject Mapping' : 'Assign Subject to Class'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Class <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                {formErrors.classId && <p className="mt-1 text-[11px] text-rose-600">{formErrors.classId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Subject <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameEn} ({s.code})
                    </option>
                  ))}
                </select>
                {formErrors.subjectId && <p className="mt-1 text-[11px] text-rose-600">{formErrors.subjectId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category / Type</label>
                <select
                  value={formData.subjectType}
                  onChange={(e) => setFormData({ ...formData, subjectType: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="compulsory">Compulsory Subject</option>
                  <option value="optional">Optional Subject</option>
                  <option value="additional">Additional Subject</option>
                  <option value="practical">Practical Subject</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Marks</label>
                  <input
                    type="number"
                    value={formData.fullMarks}
                    onChange={(e) => setFormData({ ...formData, fullMarks: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                  {formErrors.fullMarks && <p className="mt-1 text-[11px] text-rose-600">{formErrors.fullMarks}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pass Marks</label>
                  <input
                    type="number"
                    value={formData.passMarks}
                    onChange={(e) => setFormData({ ...formData, passMarks: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                  {formErrors.passMarks && <p className="mt-1 text-[11px] text-rose-600">{formErrors.passMarks}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                >
                  {editingItem ? 'Save Changes' : 'Assign Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
