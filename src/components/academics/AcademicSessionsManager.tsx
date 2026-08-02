'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import {
  getAcademicSessions,
  createAcademicSession,
  updateAcademicSession,
  toggleAcademicSessionStatus,
  deleteAcademicSession,
  getAcademicYears,
  AcademicSessionRecord,
  AcademicYearRecord,
} from '@/src/services/academic-management.service';
import { academicSessionSchema } from '@/src/lib/validations/academic';
import { createAuditLog } from '@/src/lib/audit';
import { useSchoolContext } from '@/src/components/layout/DashboardLayout';

export function AcademicSessionsManager() {
  const { schoolId } = useSchoolContext();
  const [data, setData] = useState<AcademicSessionRecord[]>([]);
  const [years, setYears] = useState<AcademicYearRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AcademicSessionRecord | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    academicYearId: '',
    name: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sessionsRes, yearsRes] = await Promise.all([
        getAcademicSessions({
          page,
          pageSize,
          search,
          status: statusFilter,
          academicYearId: yearFilter,
        }),
        getAcademicYears({ page: 1, pageSize: 50 }),
      ]);
      setData(sessionsRes.data);
      setTotalPages(sessionsRes.totalPages);
      setTotalCount(sessionsRes.total);
      setYears(yearsRes.data);
    } catch {
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize, search, statusFilter, yearFilter]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    const defaultYear = years.find((y) => y.isCurrent) || years[0];
    setFormData({
      academicYearId: defaultYear?.id || '',
      name: 'First Term / Semester',
      startDate: `${new Date().getFullYear()}-01-01`,
      endDate: `${new Date().getFullYear()}-04-30`,
      status: 'ACTIVE',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AcademicSessionRecord) => {
    setEditingItem(item);
    setFormData({
      academicYearId: item.academicYearId,
      name: item.name,
      startDate: item.startDate,
      endDate: item.endDate,
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

    const validation = academicSessionSchema.safeParse(payload);
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
        await updateAcademicSession(editingItem.id, payload);
        await createAuditLog({
          action: 'UPDATE',
          module: 'AcademicSessions',
          recordId: editingItem.id,
          details: `Updated session ${formData.name}`,
        });
        showNotification('Academic session updated successfully');
      } else {
        const created = await createAcademicSession(payload);
        await createAuditLog({
          action: 'CREATE',
          module: 'AcademicSessions',
          recordId: created.id,
          details: `Created session ${formData.name}`,
        });
        showNotification('Academic session created successfully');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (item: AcademicSessionRecord) => {
    try {
      await toggleAcademicSessionStatus(item.id);
      await createAuditLog({
        action: 'TOGGLE_STATUS',
        module: 'AcademicSessions',
        recordId: item.id,
        details: `Toggled status for session ${item.name}`,
      });
      showNotification('Session status updated');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (item: AcademicSessionRecord) => {
    if (!confirm(`Are you sure you want to delete session ${item.name}?`)) return;
    try {
      await deleteAcademicSession(item.id);
      await createAuditLog({
        action: 'DELETE',
        module: 'AcademicSessions',
        recordId: item.id,
        details: `Deleted session ${item.name}`,
      });
      showNotification('Session deleted');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete session');
    }
  };

  return (
    <div className="space-y-4">
      {/* Alert Banners */}
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
              placeholder="Search session..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
            />
          </div>

          <select
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="">All Academic Years</option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>
                {y.name}
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
          <span>New Session</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading sessions...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Clock className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No Academic Sessions Found</p>
            <p className="text-xs text-slate-400">Add terms or term sessions for academic years above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Session Name</th>
                  <th className="px-4 py-3">Academic Year</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{item.name}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {item.academicYearName || 'Academic Year'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.startDate} &rarr; {item.endDate}
                    </td>
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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? 'Edit Session' : 'Create Academic Session'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Year <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.academicYearId}
                  onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                >
                  <option value="">Select Academic Year</option>
                  {years.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name} {y.isCurrent ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
                {formErrors.academicYearId && (
                  <p className="mt-1 text-[11px] text-rose-600">{formErrors.academicYearId}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. First Term (Jan - Apr)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                />
                {formErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-600">{formErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                  {formErrors.startDate && (
                    <p className="mt-1 text-[11px] text-rose-600">{formErrors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                  {formErrors.endDate && (
                    <p className="mt-1 text-[11px] text-rose-600">{formErrors.endDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
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
                  {editingItem ? 'Save Changes' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
