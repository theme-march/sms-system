'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  User,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  ArrowRight,
  School,
  Sparkles,
} from 'lucide-react';
import { getAdmissionCampaigns, submitAdmissionApplication } from '@/src/services/admission.service';

export default function OnlineAdmissionPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    campaignId: '',
    classId: 'cls-10',
    groupId: '',
    studentNameEn: '',
    studentNameBn: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    dateOfBirth: '2012-05-10',
    bloodGroup: 'B+',
    birthRegistrationNumber: '',
    phone: '',
    email: '',
    presentAddress: '',
    permanentAddress: '',
    previousSchool: '',
    guardianName: '',
    guardianRelation: 'FATHER',
    guardianPhone: '',
    guardianEmail: '',
    guardianOccupation: '',
    guardianNationalId: '',
    guardianAddress: '',
    docType: 'Birth Certificate',
    docTitle: 'Birth Certificate Scanned Copy',
    docUrl: 'https://example.com/docs/birth_certificate.pdf',
  });

  useEffect(() => {
    async function loadCampaigns() {
      const res = await getAdmissionCampaigns();
      setCampaigns(res);
      if (res.length > 0) {
        setFormData((prev) => ({ ...prev, campaignId: res[0].id }));
      }
    }
    loadCampaigns();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const result = await submitAdmissionApplication({
        campaignId: formData.campaignId || undefined,
        classId: formData.classId,
        groupId: formData.groupId || undefined,
        studentNameEn: formData.studentNameEn,
        studentNameBn: formData.studentNameBn,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        birthRegistrationNumber: formData.birthRegistrationNumber,
        phone: formData.phone,
        email: formData.email,
        presentAddress: formData.presentAddress,
        permanentAddress: formData.permanentAddress,
        previousSchool: formData.previousSchool,
        guardians: [
          {
            name: formData.guardianName,
            relationship: formData.guardianRelation,
            phone: formData.guardianPhone,
            email: formData.guardianEmail,
            occupation: formData.guardianOccupation,
            nationalId: formData.guardianNationalId,
            address: formData.guardianAddress || formData.presentAddress,
            isPrimary: true,
            isFinancialContact: true,
            isEmergencyContact: true,
          },
        ],
        documents: formData.docUrl
          ? [
              {
                documentType: formData.docType,
                title: formData.docTitle,
                fileUrl: formData.docUrl,
              },
            ]
          : [],
      });

      setSubmittedData(result);
      setStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting your application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard: ' + text);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Banner Header */}
      <header className="bg-teal-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white text-teal-700 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <School className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Online Admission Portal</h1>
              <p className="text-xs text-teal-100 font-medium">Online Admission Portal & Student Application — Session 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admission/track"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Track Application Status
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Step Indicator */}
        {step < 4 && (
          <div className="mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-500'}`}>1</div>
                <span className="hidden sm:inline text-xs">Student Info</span>
              </div>
              <div className="flex-1 h-0.5 mx-3 bg-slate-200">
                <div className={`h-full bg-teal-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-500'}`}>2</div>
                <span className="hidden sm:inline text-xs">Guardian & Documents</span>
              </div>
              <div className="flex-1 h-0.5 mx-3 bg-slate-200">
                <div className={`h-full bg-teal-600 transition-all ${step >= 3 ? 'w-full' : 'w-0'}`} />
              </div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-500'}`}>3</div>
                <span className="hidden sm:inline text-xs">Review & Submit</span>
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Candidate Basic Information */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                Step 1: Student Information & Academic Program
              </h2>
              <p className="text-xs text-slate-500 mt-1">Provide student's official details as shown in Birth Registration / Previous School Certificate.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Campaign</label>
                <select
                  name="campaignId"
                  value={formData.campaignId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-500"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code}) — Cap: {c.capacity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Applying For Class *</label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-500"
                >
                  <option value="cls-6">Class 6</option>
                  <option value="cls-7">Class 7</option>
                  <option value="cls-8">Class 8</option>
                  <option value="cls-9">Class 9</option>
                  <option value="cls-10">Class 10</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Group (Class 9 & 10)</label>
                <select
                  name="groupId"
                  value={formData.groupId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">General / None</option>
                  <option value="grp-science">Science</option>
                  <option value="grp-commerce">Business Studies</option>
                  <option value="grp-humanities">Humanities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name (English) *</label>
                <input
                  type="text"
                  name="studentNameEn"
                  value={formData.studentNameEn}
                  onChange={handleChange}
                  required
                  placeholder="Applicant's full name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name (Bangla)</label>
                <input
                  type="text"
                  name="studentNameBn"
                  value={formData.studentNameBn}
                  onChange={handleChange}
                  placeholder="e.g. তানভীর হোসেন"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Birth Registration Number (17-digit)</label>
                <input
                  type="text"
                  name="birthRegistrationNumber"
                  value={formData.birthRegistrationNumber}
                  onChange={handleChange}
                  placeholder="20122692812000123"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Phone / Mobile</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+8801700112233"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Present Address *</label>
                <textarea
                  name="presentAddress"
                  value={formData.presentAddress}
                  onChange={handleChange}
                  rows={2}
                  required
                  placeholder="House/Road, Area, Upazila/Thana, District"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Permanent Address</label>
                <textarea
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Village, Post Office, Upazila, District"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Previous School Name & Class</label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  placeholder="e.g. Dhanmondi Govt Primary School (Passed Class 5)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (!formData.studentNameEn || !formData.presentAddress) {
                    setErrorMsg('Please complete required candidate fields (Name and Present Address).');
                    return;
                  }
                  setErrorMsg('');
                  setStep(2);
                }}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-sm transition-colors"
              >
                Next: Guardian Details & Documents
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Guardian Information & Documents */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                Step 2: Guardian Information & Document Metadata
              </h2>
              <p className="text-xs text-slate-500 mt-1">Provide primary parent/guardian contact for portal access & communication.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Full Name *</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Anwarul Islam"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship *</label>
                <select
                  name="guardianRelation"
                  value={formData.guardianRelation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                >
                  <option value="FATHER">Father</option>
                  <option value="MOTHER">Mother</option>
                  <option value="LEGAL_GUARDIAN">Legal Guardian</option>
                  <option value="OTHER">Other Relative</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Mobile Phone *</label>
                <input
                  type="text"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  required
                  placeholder="+8801711002233"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Email</label>
                <input
                  type="email"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleChange}
                  placeholder="guardian@gmail.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation</label>
                <input
                  type="text"
                  name="guardianOccupation"
                  value={formData.guardianOccupation}
                  onChange={handleChange}
                  placeholder="e.g. Service Holder / Business"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">National ID (NID) Number</label>
                <input
                  type="text"
                  name="guardianNationalId"
                  value={formData.guardianNationalId}
                  onChange={handleChange}
                  placeholder="1980269281200045"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Address</label>
                <textarea
                  name="guardianAddress"
                  value={formData.guardianAddress}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Leave empty to use same as student's present address"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Document Upload Metadata */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800">Document Upload Metadata</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Type</label>
                  <select
                    name="docType"
                    value={formData.docType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Birth Certificate">Birth Certificate</option>
                    <option value="Transfer Certificate">Transfer Certificate (TC)</option>
                    <option value="Previous Marksheet">Previous Grade Marksheet</option>
                    <option value="Guardian NID">Guardian NID Card</option>
                    <option value="Passport Photo">Passport Photo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Title</label>
                  <input
                    type="text"
                    name="docTitle"
                    value={formData.docTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document URL / File Path</label>
                  <input
                    type="text"
                    name="docUrl"
                    value={formData.docUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!formData.guardianName || !formData.guardianPhone) {
                    setErrorMsg('Please enter Guardian Name and Phone Number.');
                    return;
                  }
                  setErrorMsg('');
                  setStep(3);
                }}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-sm transition-colors"
              >
                Next: Review Application
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Application Review & Confirm */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                Step 3: Summary & Application Submission
              </h2>
              <p className="text-xs text-slate-500 mt-1">Please verify all information before final submission.</p>
            </div>

            <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[10px] text-teal-700 uppercase font-bold">Candidate Name</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{formData.studentNameEn} {formData.studentNameBn ? `(${formData.studentNameBn})` : ''}</p>
                <p className="text-slate-500 mt-1">Gender: <span className="font-semibold text-slate-800">{formData.gender}</span> | DOB: <span className="font-semibold text-slate-800">{formData.dateOfBirth}</span></p>
              </div>

              <div>
                <p className="text-[10px] text-teal-700 uppercase font-bold">Applying Class & Campaign</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Class 10 — General Campaign</p>
                <p className="text-slate-500 mt-1">Blood Group: <span className="font-semibold text-slate-800">{formData.bloodGroup}</span></p>
              </div>

              <div>
                <p className="text-[10px] text-teal-700 uppercase font-bold">Guardian Details</p>
                <p className="font-semibold text-slate-900 mt-0.5">{formData.guardianName} ({formData.guardianRelation})</p>
                <p className="text-slate-500">Phone: <span className="font-semibold text-slate-800">{formData.guardianPhone}</span></p>
              </div>

              <div>
                <p className="text-[10px] text-teal-700 uppercase font-bold">Address</p>
                <p className="text-slate-700 mt-0.5">{formData.presentAddress}</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Important Notice for Admission Applicants
              </p>
              <p>Upon submission, you will instantly receive an <strong>Application Number</strong> and <strong>Tracking Code</strong>. Please save these codes to track your admission test, interview, and approval status.</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
              >
                Back to Edit
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Online Application'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Success & Tracking Credentials */}
        {step === 4 && submittedData && (
          <div className="bg-white rounded-2xl border border-teal-200 shadow-md p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold uppercase tracking-wider">
                Application Submitted Successfully
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-3">Welcome to Ideal Model High School Admission 2026</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Your online application has been received. Please save your application credentials below for status tracking.
              </p>
            </div>

            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 p-6 rounded-xl space-y-4 text-left shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Application Number</p>
                  <p className="text-lg font-black text-teal-700">{submittedData.applicationNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(submittedData.applicationNumber)}
                  className="p-2 text-slate-500 hover:text-teal-700 hover:bg-slate-200 rounded-lg"
                  title="Copy Application Number"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Secret Tracking Code</p>
                  <p className="text-lg font-black text-slate-800">{submittedData.trackingCode}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(submittedData.trackingCode)}
                  className="p-2 text-slate-500 hover:text-teal-700 hover:bg-slate-200 rounded-lg"
                  title="Copy Tracking Code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href={`/admission/track?code=${submittedData.trackingCode}`}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-xs"
              >
                Track Status Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Confirmation
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
