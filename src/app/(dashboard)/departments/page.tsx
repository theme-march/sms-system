'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/src/services/staff.service';
import { departmentSchema } from '@/src/lib/validations/staff';

export default function DepartmentsPage() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [formData, setFormData] = useState({
    schoolId: 'sch-ideal-101',
    nameEn: '',
    nameBn: '',
    code: '',
    status: 'ACTIVE',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await getDepartments({
        search,
        status: statusFilter,
        page,
        pageSize: 8,
      });
      setDepartments(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [search, statusFilter, page]);

  const handleOpenCreateModal = () => {
    setEditingDept(null);
    setFormData({
      schoolId: 'sch-ideal-101',
      nameEn: '',
      nameBn: '',
      code: '',
      status: 'ACTIVE',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dept: any) => {
    setEditingDept(dept);
    setFormData({
      schoolId: dept.schoolId || 'sch-ideal-101',
      nameEn: dept.nameEn || '',
      nameBn: dept.nameBn || '',
      code: dept.code || '',
      status: dept.status || 'ACTIVE',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const validation = departmentSchema.safeParse(formData);
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || 'Invalid form input.');
      setSubmitting(false);
      return;
    }

    try {
      if (editingDept) {
        await updateDepartment(editingDept.id, formData);
      } else {
        await createDepartment(formData);
      }
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      await deleteDepartment(id);
      fetchDepartments();
    }
  };

  const handleToggleStatus = async (dept: any) => {
    const newStatus = dept.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await updateDepartment(dept.id, { ...dept, status: newStatus });
    fetchDepartments();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Management (বিভাগ ব্যবস্থাপনা)"
        subtitle="Configure school administrative and academic departments with English and Bangla labels"
        breadcrumbs={[{ label: 'Departments' }]}
        action={
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department (বিভাগ যোগ করুন)</span>
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Departments: <span className="font-bold text-slate-800">{totalCount}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading departments...</span>
          </div>
        ) : departments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No departments found.</p>
            <p className="text-xs">Try adjusting your filters or create a new department.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Department Name (English)</th>
                  <th className="px-4 py-3">Department Name (বাংলা)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-teal-700 font-mono">
                      {dept.code}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {dept.nameEn}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {dept.nameBn || '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={dept.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleToggleStatus(dept)}
                        title="Toggle Status"
                        className="p-1.5 text-slate-400 hover:text-teal-600 rounded-md hover:bg-slate-100"
                      >
                        {dept.status === 'ACTIVE' ? (
                          <XCircle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(dept)}
                        title="Edit Department"
                        className="p-1.5 text-slate-400 hover:text-teal-600 rounded-md hover:bg-slate-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        title="Delete Department"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingDept ? 'Edit Department (বিভাগ সম্পাদনা)' : 'Add New Department (নতুন বিভাগ)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department Code *</label>
                <input
                  type="text"
                  placeholder="e.g. SCI-MATH"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Name (English) *</label>
                <input
                  type="text"
                  placeholder="e.g. Science & Mathematics"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Name (বাংলা)</label>
                <input
                  type="text"
                  placeholder="e.g. বিজ্ঞান ও গণিত"
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
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
                  <span>{editingDept ? 'Save Changes' : 'Create Department'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
