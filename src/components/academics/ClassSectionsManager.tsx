'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, AlertCircle, Link2 } from 'lucide-react';
import {
  getClassSectionsList,
  createClassSection,
  updateClassSection,
  toggleClassSectionStatus,
  deleteClassSection,
  getClassesList,
  getSectionsList,
  ClassSectionRecord,
  ClassRecord,
  SectionRecord,
  getAcademicYears,
} from '@/src/services/academic-management.service';
import { classSectionSchema } from '@/src/lib/validations/academic';
import { createAuditLog } from '@/src/lib/audit';
import { useSchoolContext } from '@/src/components/layout/DashboardLayout';

export function ClassSectionsManager() {
  const { schoolId } = useSchoolContext();
  const [data, setData] = useState<ClassSectionRecord[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [sections, setSections] = useState<SectionRecord[]>([]);
  const [academicYearId, setAcademicYearId] = useState('');
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
  const [editingItem, setEditingItem] = useState<ClassSectionRecord | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    classId: '',
    sectionId: '',
    capacity: 40,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, clsRes, secRes, yearRes] = await Promise.all([
        getClassSectionsList({
          page,
          pageSize,
          search,
          classId: classFilter,
          status: statusFilter,
        }),
        getClassesList({ page: 1, pageSize: 50 }),
        getSectionsList({ page: 1, pageSize: 50 }),
        getAcademicYears({ page: 1, pageSize: 50, schoolId }),
      ]);
      setData(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
      setClasses(clsRes.data);
      setSections(secRes.data);
      setAcademicYearId(yearRes.data.find((year) => year.isCurrent)?.id || yearRes.data[0]?.id || '');
    } catch {
      setError('Failed to load class-section assignments');
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
      sectionId: sections[0]?.id || '',
      capacity: 40,
      status: 'ACTIVE',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ClassSectionRecord) => {
    setEditingItem(item);
    setFormData({
      classId: item.classId,
      sectionId: item.sectionId,
      capacity: item.capacity || 40,
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
      academicYearId,
      ...formData,
    };

    const validation = classSectionSchema.safeParse(payload);
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
        await updateClassSection(editingItem.id, payload);
        await createAuditLog({
          action: 'UPDATE',
          module: 'ClassSections',
          recordId: editingItem.id,
          details: `Updated class-section assignment`,
        });
        showNotification('Assignment updated');
      } else {
        const created = await createClassSection(payload);
        await createAuditLog({
          action: 'CREATE',
          module: 'ClassSections',
          recordId: created.id,
          details: `Assigned section to class`,
        });
        showNotification('Class-section assignment created');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (item: ClassSectionRecord) => {
    try {
      await toggleClassSectionStatus(item.id);
      await createAuditLog({
        action: 'TOGGLE_STATUS',
        module: 'ClassSections',
        recordId: item.id,
        details: `Toggled status for class section assignment`,
      });
      showNotification('Assignment status updated');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (item: ClassSectionRecord) => {
    if (!confirm('Are you sure you want to remove this section assignment?')) return;
    try {
      await deleteClassSection(item.id);
      await createAuditLog({
        action: 'DELETE',
        module: 'ClassSections',
        recordId: item.id,
        details: `Removed class-section assignment`,
      });
      showNotification('Assignment removed');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove assignment');
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
              placeholder="Search assignments..."
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
          <span>Assign Section</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading class-section mappings...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Link2 className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No Class-Section Mappings Found</p>
            <p className="text-xs text-slate-400">Map sections (e.g. Section A) to specific classes.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Assigned Section</th>
                  <th className="px-4 py-3">Section Capacity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{item.className}</td>
                    <td className="px-4 py-3 font-bold text-teal-700">{item.sectionName}</td>
                    <td className="px-4 py-3 text-slate-700 font-semibold">{item.capacity} Students</td>
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
                {editingItem ? 'Edit Class-Section Assignment' : 'Assign Section to Class'}
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
                  Select Section <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.sectionId}
                  onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                >
                  <option value="">Select Section</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
                {formErrors.sectionId && <p className="mt-1 text-[11px] text-rose-600">{formErrors.sectionId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity for this Class Section</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
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
                  {editingItem ? 'Save Changes' : 'Assign Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
