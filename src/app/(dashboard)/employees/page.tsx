'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  UserCog,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
} from 'lucide-react';
import {
  getEmployees,
  getDepartments,
  getDesignations,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '@/src/services/staff.service';
import { employeeSchema } from '@/src/lib/validations/staff';
import { useSchoolContext } from '@/src/components/layout/DashboardLayout';

export default function EmployeesPage() {
  const { schoolId } = useSchoolContext();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [desigFilter, setDesigFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [formData, setFormData] = useState({
    schoolId,
    employeeCode: '',
    nameEn: '',
    nameBn: '',
    phone: '',
    email: '',
    departmentId: '',
    designationId: '',
    joiningDate: new Date().toISOString().slice(0, 10),
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resEmps, resDepts, resDesigs] = await Promise.all([
        getEmployees({
          search,
          departmentId: deptFilter,
          designationId: desigFilter,
          employmentType: typeFilter,
          status: statusFilter,
          page,
          pageSize: 6,
        }),
        getDepartments({ pageSize: 100 }),
        getDesignations({ pageSize: 100 }),
      ]);

      setEmployees(resEmps.data);
      setTotalPages(resEmps.totalPages);
      setTotalCount(resEmps.total);
      setDepartments(resDepts.data);
      setDesignations(resDesigs.data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, deptFilter, desigFilter, typeFilter, statusFilter, page]);

  const handleOpenCreateModal = () => {
    setEditingEmployee(null);
    setFormData({
      schoolId,
      employeeCode: '',
      nameEn: '',
      nameBn: '',
      phone: '',
      email: '',
      departmentId: departments[0]?.id || '',
      designationId: designations[0]?.id || '',
      joiningDate: new Date().toISOString().slice(0, 10),
      employmentType: 'FULL_TIME',
      status: 'ACTIVE',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp: any) => {
    setEditingEmployee(emp);
    setFormData({
      schoolId: emp.schoolId || schoolId,
      employeeCode: emp.employeeCode || '',
      nameEn: emp.nameEn || '',
      nameBn: emp.nameBn || '',
      phone: emp.phone || '',
      email: emp.email || '',
      departmentId: emp.departmentId || '',
      designationId: emp.designationId || '',
      joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : '2026-01-01',
      employmentType: emp.employmentType || 'FULL_TIME',
      status: emp.status || 'ACTIVE',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const validation = employeeSchema.safeParse(formData);
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || 'Validation error.');
      setSubmitting(false);
      return;
    }

    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, formData);
      } else {
        await createEmployee(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee record?')) {
      await deleteEmployee(id);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Directory (কর্মকর্তা ও কর্মচারী তালিকা)"
        subtitle="Manage non-teaching staff, administration officers, accounts, and IT personnel"
        breadcrumbs={[{ label: 'Employees' }]}
        action={
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee (নতুন কর্মচারী)</span>
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employee by name, code, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={desigFilter}
              onChange={(e) => setDesigFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="">All Designations</option>
              {designations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="">All Employment Types</option>
              <option value="FULL_TIME">FULL_TIME</option>
              <option value="PART_TIME">PART_TIME</option>
              <option value="CONTRACT">CONTRACT</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Non-teaching administrative staff roster</span>
          <span>
            Total Employees: <strong className="text-slate-900">{totalCount}</strong>
          </span>
        </div>
      </div>

      {/* Employees Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
          <span>Loading employee directory...</span>
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <UserCog className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No employees found.</p>
          <p className="text-xs">Adjust your search parameters or register a new employee.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employees.map((emp) => {
            const desigName = emp.designation?.nameEn || 'Administrative Officer';
            const deptName = emp.department?.nameEn || 'Administration';

            return (
              <div
                key={emp.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                        {emp.nameEn.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{emp.nameEn}</h3>
                        {emp.nameBn && <p className="text-[11px] text-slate-500">{emp.nameBn}</p>}
                        <p className="text-xs font-semibold text-teal-700 mt-0.5">{desigName}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Code: {emp.employeeCode}</p>
                      </div>
                    </div>
                    <StatusBadge status={emp.status || 'ACTIVE'} />
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg grid grid-cols-2 gap-2 text-xs text-slate-600 border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Department:</p>
                      <p className="font-medium text-slate-800 truncate">{deptName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Employment Type:</p>
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-slate-800 bg-slate-200/70 rounded-md">
                        {emp.employmentType || 'FULL_TIME'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {emp.email || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {emp.phone || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <Link
                    href={`/dashboard/employees/${emp.id}`}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Profile</span>
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(emp)}
                      title="Edit Profile"
                      className="p-1.5 text-slate-400 hover:text-teal-600 rounded-md hover:bg-slate-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      title="Delete Employee"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center justify-between text-xs text-slate-500 shadow-2xs">
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

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingEmployee ? 'Edit Employee Record' : 'Register New Employee'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-semibold">
                  {formError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Employee Code *</label>
                  <input
                    type="text"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name (English) *</label>
                  <input
                    type="text"
                    placeholder="e.g. Kamrul Islam"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name (বাংলা)</label>
                  <input
                    type="text"
                    placeholder="e.g. কামরুল ইসলাম"
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. +8801722334455"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. kamrul@dhakaideal.edu.bd"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Department</label>
                    <select
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.nameEn}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Designation</label>
                    <select
                      value={formData.designationId}
                      onChange={(e) => setFormData({ ...formData, designationId: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="">Select Designation</option>
                      {designations.map((d) => (
                        <option key={d.id} value={d.id}>{d.nameEn}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Joining Date *</label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Employment Type</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="FULL_TIME">FULL_TIME</option>
                      <option value="PART_TIME">PART_TIME</option>
                      <option value="CONTRACT">CONTRACT</option>
                    </select>
                  </div>
                </div>
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
                  <span>{editingEmployee ? 'Save Changes' : 'Register Employee'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
