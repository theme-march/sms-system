'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { formatCurrency } from '@/src/lib/utils';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  Eye,
  BookOpen,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Briefcase,
} from 'lucide-react';
import {
  getTeachers,
  getDepartments,
  getDesignations,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '@/src/services/staff.service';
import { teacherSchema } from '@/src/lib/validations/staff';
import { useSchoolContext } from '@/src/components/layout/DashboardLayout';

export default function TeachersPage() {
  const { schoolId } = useSchoolContext();
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [desigFilter, setDesigFilter] = useState('');
  const [employmentFilter, setEmploymentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [formData, setFormData] = useState({
    schoolId,
    employeeCode: '',
    nameEn: '',
    nameBn: '',
    phone: '',
    email: '',
    gender: 'MALE',
    dateOfBirth: '',
    joiningDate: new Date().toISOString().slice(0, 10),
    qualification: '',
    specialization: '',
    departmentId: '',
    designationId: '',
    employmentStatus: 'PERMANENT',
    status: 'ACTIVE',
    salary: 0,
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resTeachers, resDepts, resDesigs] = await Promise.all([
        getTeachers({
          search,
          departmentId: deptFilter,
          designationId: desigFilter,
          employmentStatus: employmentFilter,
          status: statusFilter,
          page,
          pageSize: 6,
        }),
        getDepartments({ pageSize: 100 }),
        getDesignations({ pageSize: 100 }),
      ]);

      setTeachers(resTeachers.data);
      setTotalPages(resTeachers.totalPages);
      setTotalCount(resTeachers.total);
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
  }, [search, deptFilter, desigFilter, employmentFilter, statusFilter, page]);

  const handleOpenRecruitModal = () => {
    setEditingTeacher(null);
    setFormData({
      schoolId,
      employeeCode: '',
      nameEn: '',
      nameBn: '',
      phone: '',
      email: '',
      gender: 'MALE',
      dateOfBirth: '',
      joiningDate: new Date().toISOString().slice(0, 10),
      qualification: '',
      specialization: '',
      departmentId: departments[0]?.id || '',
      designationId: designations[0]?.id || '',
      employmentStatus: 'PERMANENT',
      status: 'ACTIVE',
      salary: 0,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tch: any) => {
    setEditingTeacher(tch);
    setFormData({
      schoolId: tch.schoolId || schoolId,
      employeeCode: tch.employeeCode || tch.employeeId || '',
      nameEn: tch.nameEn || tch.user?.name || '',
      nameBn: tch.nameBn || '',
      phone: tch.phone || tch.user?.phone || '',
      email: tch.email || tch.user?.email || '',
      gender: tch.gender || 'MALE',
      dateOfBirth: tch.dateOfBirth ? new Date(tch.dateOfBirth).toISOString().split('T')[0] : '',
      joiningDate: tch.joiningDate ? new Date(tch.joiningDate).toISOString().split('T')[0] : '2026-01-01',
      qualification: tch.qualification || '',
      specialization: tch.specialization || '',
      departmentId: tch.departmentId || '',
      designationId: tch.designationId || '',
      employmentStatus: tch.employmentStatus || 'PERMANENT',
      status: tch.status || 'ACTIVE',
      salary: tch.salary || 50000,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const validation = teacherSchema.safeParse(formData);
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || 'Validation error.');
      setSubmitting(false);
      return;
    }

    try {
      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, formData);
      } else {
        await createTeacher(formData);
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
    if (confirm('Are you sure you want to delete this teacher profile?')) {
      await deleteTeacher(id);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers & Faculty Roster (শিক্ষকমণ্ডলী তালিকা)"
        subtitle="Manage teaching faculty, qualifications, department assignments, and class workloads"
        breadcrumbs={[{ label: 'Teachers' }]}
        action={
          <button
            onClick={handleOpenRecruitModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Recruit Teacher (নতুন শিক্ষক নিয়োগ)</span>
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
              placeholder="Search teacher by name, code, email, phone..."
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
              value={employmentFilter}
              onChange={(e) => setEmploymentFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="">All Employment Statuses</option>
              <option value="PERMANENT">PERMANENT</option>
              <option value="PROBATION">PROBATION</option>
              <option value="CONTRACTUAL">CONTRACTUAL</option>
              <option value="PART_TIME">PART_TIME</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Showing teachers matching criteria</span>
          <span>
            Total Teachers: <strong className="text-slate-900">{totalCount}</strong>
          </span>
        </div>
      </div>

      {/* Teachers Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
          <span>Loading teachers roster...</span>
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No teachers found.</p>
          <p className="text-xs">Adjust your search parameters or recruit a new teacher.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teachers.map((tch) => {
            const name = tch.nameEn || tch.user?.name || 'Teacher';
            const desigName = tch.designation?.nameEn || tch.designation || 'Faculty Member';
            const deptName = tch.department?.nameEn || 'General Department';
            const code = tch.employeeCode || tch.employeeId || '—';

            return (
              <div
                key={tch.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {tch.profilePhoto ? (
                        <img
                          src={tch.profilePhoto}
                          alt={name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                          {name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{name}</h3>
                        {tch.nameBn && <p className="text-[11px] text-slate-500">{tch.nameBn}</p>}
                        <p className="text-xs font-semibold text-teal-700 mt-0.5">{desigName}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Code: {code}</p>
                      </div>
                    </div>
                    <StatusBadge status={tch.status || 'ACTIVE'} />
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg grid grid-cols-2 gap-2 text-xs text-slate-600 border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Department:</p>
                      <p className="font-medium text-slate-800 truncate">{deptName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Employment:</p>
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-teal-800 bg-teal-100 rounded-md">
                        {tch.employmentStatus || 'PERMANENT'}
                      </span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200/60">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Qualification:</p>
                      <p className="font-medium text-slate-800 truncate">
                        {tch.qualification || 'M.Sc / M.A in Education'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {tch.email || tch.user?.email || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {tch.phone || tch.user?.phone || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/dashboard/teachers/${tch.id}`}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href={`/dashboard/teachers/${tch.id}/workload`}
                      className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                      <span>Workload</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(tch)}
                      title="Edit Profile"
                      className="p-1.5 text-slate-400 hover:text-teal-600 rounded-md hover:bg-slate-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tch.id)}
                      title="Delete Teacher"
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

      {/* Recruit/Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-teal-600" />
                <span>{editingTeacher ? 'Edit Teacher Profile (শিক্ষক প্রোফাইল সম্পাদনা)' : 'Recruit New Teacher (নতুন শিক্ষক নিয়োগ)'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Employee Code *</label>
                  <input
                    type="text"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name (English) *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Shahabuddin Ahmed"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name (বাংলা)</label>
                  <input
                    type="text"
                    placeholder="e.g. ড. সাহাবুদ্দিন আহমেদ"
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. +8801711112233"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. headmaster@dhakaideal.edu.bd"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Designation</label>
                  <select
                    value={formData.designationId}
                    onChange={(e) => setFormData({ ...formData, designationId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="">Select Designation</option>
                    {designations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Joining Date *</label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Employment Status</label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="PERMANENT">PERMANENT</option>
                    <option value="PROBATION">PROBATION</option>
                    <option value="CONTRACTUAL">CONTRACTUAL</option>
                    <option value="PART_TIME">PART_TIME</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. M.Sc in Physics (Dhaka University)"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Quantum Mechanics, Calculus"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
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
                  <span>{editingTeacher ? 'Save Changes' : 'Recruit Teacher'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
