'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  UserCog,
  Mail,
  Phone,
  Calendar,
  FileText,
  Briefcase,
  Plus,
  ChevronLeft,
  Loader2,
  Building2,
} from 'lucide-react';
import { addEmploymentHistory, addStaffDocument, getEmployeeById } from '@/src/services/staff.service';

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<any>(null);

  // Document Upload State
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docData, setDocData] = useState({
    title: '',
    documentType: 'Employment Contract',
    fileUrl: '',
  });

  // Employment History State
  const [histModalOpen, setHistModalOpen] = useState(false);
  const [histData, setHistData] = useState({
    companyName: '',
    designation: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
  });

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const data = await getEmployeeById(id);
      setEmployee(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docData.title || !docData.fileUrl) return;

    await addStaffDocument({ employeeId: id }, docData);
    await fetchEmployee();
    setDocModalOpen(false);
    setDocData({ title: '', documentType: 'Employment Contract', fileUrl: '' });
  };

  const handleAddHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!histData.companyName || !histData.designation) return;

    await addEmploymentHistory({ employeeId: id }, histData);
    await fetchEmployee();
    setHistModalOpen(false);
    setHistData({ companyName: '', designation: '', startDate: '', endDate: '', responsibilities: '' });
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
        <span>Loading employee profile...</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-4">
        <p className="font-semibold text-sm">Employee profile not found.</p>
        <Link href="/dashboard/employees" className="text-xs text-teal-600 underline font-semibold">
          Return to Employee Directory
        </Link>
      </div>
    );
  }

  const name = employee.nameEn || 'Employee Profile';
  const desigName = employee.designation?.nameEn || employee.designation || 'Administrative Staff';
  const deptName = employee.department?.nameEn || 'Administration';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/employees"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Employee Directory</span>
        </Link>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              {name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{name}</h2>
                <StatusBadge status={employee.status || 'ACTIVE'} />
              </div>
              {employee.nameBn && <p className="text-xs text-slate-500 font-medium">{employee.nameBn}</p>}
              <p className="text-xs font-bold text-teal-700 mt-1">{desigName}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Code: {employee.employeeCode}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-right space-y-1 text-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Employment Type</p>
            <p className="text-sm font-bold text-slate-800">{employee.employmentType || 'FULL_TIME'}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Administrative Assignment</span>
            </h4>
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p><strong className="text-slate-700">Department:</strong> {deptName}</p>
              <p><strong className="text-slate-700">Designation:</strong> {desigName}</p>
              <p><strong className="text-slate-700">Joining Date:</strong> {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-600" />
              <span>Contact Details</span>
            </h4>
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p><strong className="text-slate-700">Phone:</strong> {employee.phone || 'N/A'}</p>
              <p><strong className="text-slate-700">Email:</strong> {employee.email || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents & History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documents */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Employee Documents ({employee.documents?.length || 0})</span>
            </h3>
            <button
              onClick={() => setDocModalOpen(true)}
              className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          {!employee.documents || employee.documents.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">No documents uploaded.</p>
          ) : (
            <div className="space-y-2">
              {employee.documents.map((doc: any) => (
                <div key={doc.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{doc.title}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{doc.documentType} • {doc.uploadedAt || '2026-01-01'}</p>
                  </div>
                  <a
                    href={doc.fileUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-[10px] font-semibold text-teal-700 bg-white border border-teal-200 rounded-md hover:bg-teal-50"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Employment History */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-teal-600" />
              <span>Prior Employment History ({employee.employmentHistories?.length || 0})</span>
            </h3>
            <button
              onClick={() => setHistModalOpen(true)}
              className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add History</span>
            </button>
          </div>

          {!employee.employmentHistories || employee.employmentHistories.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">No prior employment recorded.</p>
          ) : (
            <div className="space-y-2">
              {employee.employmentHistories.map((hist: any) => (
                <div key={hist.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900">{hist.companyName}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{hist.startDate} - {hist.endDate || 'Present'}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-teal-700">{hist.designation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Modal */}
      {docModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Upload Document</h3>
              <button onClick={() => setDocModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddDocument} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. NID Copy"
                  value={docData.title}
                  onChange={(e) => setDocData({ ...docData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Type</label>
                <input
                  type="text"
                  placeholder="e.g. National ID"
                  value={docData.documentType}
                  onChange={(e) => setDocData({ ...docData, documentType: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">File URL *</label>
                <input
                  type="text"
                  placeholder="e.g. /docs/nid.pdf"
                  value={docData.fileUrl}
                  onChange={(e) => setDocData({ ...docData, fileUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setDocModalOpen(false)} className="px-4 py-2 border rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {histModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Add Employment History</h3>
              <button onClick={() => setHistModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddHistory} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Institution *</label>
                <input
                  type="text"
                  placeholder="e.g. Agrani Bank"
                  value={histData.companyName}
                  onChange={(e) => setHistData({ ...histData, companyName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Designation *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Cashier"
                  value={histData.designation}
                  onChange={(e) => setHistData({ ...histData, designation: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={histData.startDate}
                    onChange={(e) => setHistData({ ...histData, startDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={histData.endDate}
                    onChange={(e) => setHistData({ ...histData, endDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setHistModalOpen(false)} className="px-4 py-2 border rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
