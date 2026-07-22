'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Calendar,
  Plus,
  ArrowUpRight,
  School,
  Eye,
  Check,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  getAdmissionApplications,
  getAdmissionCampaigns,
  reviewAdmissionApplication,
  approveAdmissionApplicationTransaction,
  createAdmissionCampaign,
} from '@/src/services/admission.service';

export default function AdmissionOfficerDashboard() {
  const [activeTab, setActiveTab] = useState<'applications' | 'campaigns'>('applications');
  const [applications, setApplications] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');

  // Selected App for Detail / Review Modal
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [messageNotice, setMessageNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Review Form States
  const [rejectionReason, setRejectionReason] = useState('');
  const [correctionNotes, setCorrectionNotes] = useState('');

  // New Campaign Modal
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: 'Session 2026 Class 6-10 Special Admission',
    code: 'CAM-2026-SP',
    capacity: 200,
    startDate: '2026-02-01',
    endDate: '2026-03-31',
  });

  const loadData = async () => {
    const appsRes = await getAdmissionApplications({
      search,
      status: statusFilter,
      classId: classFilter,
    });
    setApplications(appsRes.data);
    setTotalCount(appsRes.total);

    const campRes = await getAdmissionCampaigns();
    setCampaigns(campRes);
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter, classFilter]);

  const handleApproveAndEnroll = async (appId: string) => {
    setActionLoading(true);
    setMessageNotice(null);
    try {
      const res = await approveAdmissionApplicationTransaction(appId);
      if (res.success) {
        setMessageNotice({
          type: 'success',
          text: `Application approved & enrolled! Student ID generated: ${res.student?.studentCode || 'STU-2026-1001'}`,
        });
        await loadData();
        setSelectedApp(null);
      }
    } catch (err: any) {
      setMessageNotice({ type: 'error', text: err.message || 'Failed to complete approval transaction.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewAction = async (decision: string) => {
    if (!selectedApp) return;
    setActionLoading(true);
    setMessageNotice(null);
    try {
      await reviewAdmissionApplication(selectedApp.id, {
        decision,
        rejectionReason,
        correctionNotes,
      });
      setMessageNotice({ type: 'success', text: `Application status updated to ${decision}` });
      await loadData();
      setSelectedApp(null);
      setRejectionReason('');
      setCorrectionNotes('');
    } catch (err: any) {
      setMessageNotice({ type: 'error', text: err.message || 'Failed to update review status.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await createAdmissionCampaign(newCampaign);
      setIsCampaignModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Stats calculation
  const stats = {
    total: totalCount,
    submitted: applications.filter((a) => a.status === 'submitted').length,
    underReview: applications.filter((a) => a.status === 'under_review').length,
    enrolled: applications.filter((a) => a.status === 'enrolled' || a.status === 'approved').length,
    waiting: applications.filter((a) => a.status === 'waiting_list').length,
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-teal-600" />
            Online Admission Management Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review applications, conduct candidate approvals with transactional enrollment, and manage campaigns.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCampaignModalOpen(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Admission Campaign
          </button>
        </div>
      </div>

      {messageNotice && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            messageNotice.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{messageNotice.text}</span>
          <button onClick={() => setMessageNotice(null)} className="text-xs underline font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Applications</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-100 bg-blue-50/20 shadow-2xs">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Submitted / New</p>
          <p className="text-xl font-bold text-blue-800 mt-1">{stats.submitted}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-100 bg-purple-50/20 shadow-2xs">
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Under Review</p>
          <p className="text-xl font-bold text-purple-800 mt-1">{stats.underReview}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-2xs">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Approved / Enrolled</p>
          <p className="text-xl font-bold text-emerald-800 mt-1">{stats.enrolled}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-100 bg-amber-50/20 shadow-2xs">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Waiting List</p>
          <p className="text-xl font-bold text-amber-800 mt-1">{stats.waiting}</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold gap-6">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 transition-colors ${activeTab === 'applications' ? 'border-b-2 border-teal-600 text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Applications List
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`pb-3 transition-colors ${activeTab === 'campaigns' ? 'border-b-2 border-teal-600 text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Admission Campaigns ({campaigns.length})
        </button>
      </div>

      {/* Tab 1: Applications List */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Controls Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name, App #, tracking code, or phone..."
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
              >
                <option value="">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="correction_requested">Correction Requested</option>
                <option value="waiting_list">Waiting List</option>
                <option value="approved">Approved</option>
                <option value="enrolled">Enrolled</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
              >
                <option value="">All Classes</option>
                <option value="cls-10">Class 10</option>
                <option value="cls-9">Class 9</option>
                <option value="cls-8">Class 8</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="p-3">App # & Tracking</th>
                  <th className="p-3">Candidate Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Guardian Info</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <p className="font-bold text-teal-700">{app.applicationNumber}</p>
                        <p className="text-[10px] text-slate-400">Code: {app.trackingCode}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{app.studentNameEn}</p>
                        <p className="text-[10px] text-slate-500">{app.gender} | DOB: {new Date(app.dateOfBirth).toLocaleDateString()}</p>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{app.class?.name || 'Class 10'}</td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-800">{app.guardians?.[0]?.name || 'N/A'}</p>
                        <p className="text-[10px] text-slate-500">{app.guardians?.[0]?.phone}</p>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg font-bold text-xs inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review & Action
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No applications found matching search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Admission Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 rounded-full text-[10px] font-bold uppercase">
                  {c.status}
                </span>
                <span className="text-xs text-slate-400 font-medium">Code: {c.code}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
              <p className="text-xs text-slate-500">{c.description}</p>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-600">
                <span>Capacity: <strong>{c.capacity}</strong></span>
                <span>Applications: <strong>{c._count?.applications || 0}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Application Review & Admission Approval</h3>
                <p className="text-xs text-slate-500">App #: {selectedApp.applicationNumber} | Candidate: {selectedApp.studentNameEn}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs grid grid-cols-2 gap-3">
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Gender & DOB</p>
                <p className="font-semibold text-slate-800">{selectedApp.gender} ({new Date(selectedApp.dateOfBirth).toLocaleDateString()})</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Class & Group</p>
                <p className="font-semibold text-slate-800">{selectedApp.class?.name || 'Class 10'}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Guardian Name & Phone</p>
                <p className="font-semibold text-slate-800">{selectedApp.guardians?.[0]?.name} ({selectedApp.guardians?.[0]?.phone})</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Present Address</p>
                <p className="font-semibold text-slate-800 truncate">{selectedApp.presentAddress}</p>
              </div>
            </div>

            {/* Review Decision Controls */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Take Review Action</h4>

              {/* Approval Box */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs font-bold text-emerald-900">Approve & Execute Transactional Enrollment</p>
                </div>
                <p className="text-[11px] text-emerald-800">
                  This executes a 11-step atomic transaction: Creates student record, connects guardian, generates login user accounts, creates student enrollment, generates admission fee invoice, creates audit log & notifications.
                </p>
                <button
                  disabled={actionLoading}
                  onClick={() => handleApproveAndEnroll(selectedApp.id)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
                >
                  {actionLoading ? 'Executing Approval Transaction...' : 'Approve & Enroll Candidate Now'}
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">Request Correction</label>
                  <input
                    type="text"
                    value={correctionNotes}
                    onChange={(e) => setCorrectionNotes(e.target.value)}
                    placeholder="Note what documents/info candidate must correct..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    disabled={actionLoading}
                    onClick={() => handleReviewAction('CORRECTION_REQUESTED')}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs"
                  >
                    Send Correction Request
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">Reject Application</label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Reason for rejection..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    disabled={actionLoading}
                    onClick={() => handleReviewAction('REJECTED')}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateCampaign} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Create New Admission Campaign</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Title</label>
              <input
                type="text"
                value={newCampaign.title}
                onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Code</label>
              <input
                type="text"
                value={newCampaign.code}
                onChange={(e) => setNewCampaign({ ...newCampaign, code: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Capacity</label>
              <input
                type="number"
                value={newCampaign.capacity}
                onChange={(e) => setNewCampaign({ ...newCampaign, capacity: Number(e.target.value) })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCampaignModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg"
              >
                Create Campaign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
