'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  ShieldCheck,
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
import { getDesignations, createDesignation, updateDesignation, deleteDesignation } from '@/src/services/staff.service';
import { designationSchema } from '@/src/lib/validations/staff';

export default function DesignationsPage() {
  const [loading, setLoading] = useState(true);
  const [designations, setDesignations] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesig, setEditingDesig] = useState<any>(null);
  const [formData, setFormData] = useState({
    schoolId: 'sch-ideal-101',
    nameEn: '',
    nameBn: '',
    code: '',
    status: 'ACTIVE',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const res = await getDesignations({
        search,
        status: statusFilter,
        page,
        pageSize: 8,
      });
      setDesignations(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, [search, statusFilter, page]);

  const handleOpenCreateModal = () => {
    setEditingDesig(null);
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

  const handleOpenEditModal = (desig: any) => {
    setEditingDesig(desig);
    setFormData({
      schoolId: desig.schoolId || 'sch-ideal-101',
      nameEn: desig.nameEn || '',
      nameBn: desig.nameBn || '',
      code: desig.code || '',
      status: desig.status || 'ACTIVE',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const validation = designationSchema.safeParse(formData);
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || 'Invalid form input.');
      setSubmitting(false);
      return;
    }

    try {
      if (editingDesig) {
        await updateDesignation(editingDesig.id, formData);
      } else {
        await createDesignation(formData);
      }
      setIsModalOpen(false);
      fetchDesignations();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this designation?')) {
      await deleteDesignation(id);
      fetchDesignations();
    }
  };

  const handleToggleStatus = async (desig: any) => {
    const newStatus = desig.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await updateDesignation(desig.id, { ...desig, status: newStatus });
    fetchDesignations();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Designation Management (পদবী ব্যবস্থাপনা)"
        subtitle="Manage faculty and staff official job titles and roles"
        breadcrumbs={[{ label: 'Designations' }]}
        action={
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Designation (পদবী যোগ করুন)</span>
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
              placeholder="Search by title or code..."
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
          Total Designations: <span className="font-bold text-slate-800">{totalCount}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading designations...</span>
          </div>
        ) : designations.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No designations found.</p>
            <p className="text-xs">Try adjusting your filters or create a new designation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Designation Name (English)</th>
                  <th className="px-4 py-3">Designation Name (বাংলা)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {designations.map((desig) => (
                  <tr key={desig.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-teal-700 font-mono">
                      {desig.code}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {desig.nameEn}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {desig.nameBn || '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={desig.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleToggleStatus(desig)}
                        title="Toggle Status"
                        className="p-1.5 text-slate-400 hover:text-teal-600 rounded-md hover:bg-slate-100"
                      >
                        {desig.status === 'ACTIVE' ? (
                          <XCircle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(desig)}
                        title="Edit Designation"
                        className="p-1.5 text-slate-400 hover:text-teal-600 rounded-md hover:bg-slate-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(desig.id)}
                        title="Delete Designation"
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
                {editingDesig ? 'Edit Designation (পদবী সম্পাদনা)' : 'Add New Designation (নতুন পদবী)'}
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
                <label className="block text-slate-700 font-semibold mb-1">Designation Code *</label>
                <input
                  type="text"
                  placeholder="e.g. SR-LEC"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Name (English) *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Lecturer"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Name (বাংলা)</label>
                <input
                  type="text"
                  placeholder="e.g. জ্যেষ্ঠ শিক্ষক"
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
                  <span>{editingDesig ? 'Save Changes' : 'Create Designation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
