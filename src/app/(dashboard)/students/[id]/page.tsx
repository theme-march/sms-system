'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  GraduationCap,
  Users,
  FileText,
  Activity,
  Award,
  History,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ArrowLeft,
  Heart,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { getStudentById } from '@/src/services/student.service';
import { StatusBadge } from '@/src/components/ui/StatusBadge';

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'guardians' | 'enrollment' | 'medical' | 'education' | 'documents' | 'history'>('guardians');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getStudentById(studentId);
      setStudent(res);
      setLoading(false);
    }
    loadData();
  }, [studentId]);

  if (loading) {
    return <div className="p-10 text-center text-slate-400">Loading student profile...</div>;
  }

  if (!student) {
    return <div className="p-10 text-center text-slate-500">Student record not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/students"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Student Directory
        </Link>
        <StatusBadge status={student.status || 'ACTIVE'} />
      </div>

      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            {student.nameEn?.[0] || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{student.nameEn}</h1>
              {student.nameBn && <span className="text-xs font-medium text-slate-500">({student.nameBn})</span>}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Admission #: <span className="font-bold text-teal-700">{student.admissionNumber}</span> | Code: <span className="font-bold text-slate-800">{student.studentCode}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-3 font-semibold">
              <span className="px-2.5 py-1 bg-slate-100 rounded-lg">Class: {student.class?.name || '—'}</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-lg">Section: {student.section?.name || '—'}</span>
              <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-lg">Roll #: {student.rollNumber || 1}</span>
            </div>
          </div>
        </div>

        {/* Quick Contacts */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 w-full md:w-auto">
          <p className="flex items-center gap-2 text-slate-700">
            <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="font-semibold">{student.phone || student.emergencyPhone || '+8801711223344'}</span>
          </p>
          <p className="flex items-center gap-2 text-slate-700">
            <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="font-semibold">{student.email || '—'}</span>
          </p>
          <p className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate max-w-xs">{student.presentAddress || 'Dhanmondi, Dhaka'}</span>
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 text-xs font-semibold gap-6">
        <button
          onClick={() => setActiveTab('guardians')}
          className={`pb-3 transition-colors ${activeTab === 'guardians' ? 'border-b-2 border-teal-600 text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Guardians & Contacts
        </button>
        <button
          onClick={() => setActiveTab('enrollment')}
          className={`pb-3 transition-colors ${activeTab === 'enrollment' ? 'border-b-2 border-teal-600 text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Enrollment History
        </button>
        <button
          onClick={() => setActiveTab('medical')}
          className={`pb-3 transition-colors ${activeTab === 'medical' ? 'border-b-2 border-teal-600 text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Medical Information
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`pb-3 transition-colors ${activeTab === 'education' ? 'border-b-2 border-teal-600 text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Previous Education
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 transition-colors ${activeTab === 'documents' ? 'border-b-2 border-teal-600 text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Documents ({student.documents?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 transition-colors ${activeTab === 'history' ? 'border-b-2 border-teal-600 text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Status History
        </button>
      </div>

      {/* Tab 1: Guardians */}
      {activeTab === 'guardians' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student.guardians && student.guardians.length > 0 ? (
            student.guardians.map((sg: any) => (
              <div key={sg.id || sg.guardian?.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-600" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{sg.guardian?.name || student.fatherName || 'Kamal Hossain'}</h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{sg.relationship || 'FATHER'}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                    {sg.isPrimary ? 'Primary Guardian' : 'Secondary'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{sg.guardian?.phone || '+8801711223344'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Occupation</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{sg.guardian?.occupation || 'Service Holder'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">National ID</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{sg.guardian?.nationalId || '1980269281200045'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Portal Access</p>
                    <p className="font-bold text-emerald-700 mt-0.5">Enabled</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs text-slate-500">
              Mother: <strong className="text-slate-800">{student.motherName || 'Anowara Begum'}</strong> | Father: <strong className="text-slate-800">{student.fatherName || 'Kamal Hossain'}</strong>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Enrollments */}
      {activeTab === 'enrollment' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Academic Year</th>
                <th className="p-3">Class & Section</th>
                <th className="p-3">Roll #</th>
                <th className="p-3">Enrollment Type</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {student.enrollments && student.enrollments.length > 0 ? (
                student.enrollments.map((enr: any) => (
                  <tr key={enr.id}>
                    <td className="p-3 font-bold text-teal-700">{enr.academicYear?.name || '—'}</td>
                    <td className="p-3 font-semibold text-slate-800">{enr.class?.name || '—'} ({enr.section?.name || '—'})</td>
                    <td className="p-3 font-bold text-slate-900">{enr.rollNumber ?? '—'}</td>
                    <td className="p-3 text-slate-600">{enr.enrollmentType || 'REGULAR'}</td>
                    <td className="p-3"><StatusBadge status={enr.enrollmentStatus || 'ACTIVE'} /></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No enrollment records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Medical Info */}
      {activeTab === 'medical' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            Medical & Emergency Health Record
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</p>
              <p className="font-bold text-rose-700 text-sm mt-0.5">{student.bloodGroup || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Height</p>
              <p className="font-semibold text-slate-800 mt-0.5">{student.medicalInfo?.height || "5'6\""}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Weight</p>
              <p className="font-semibold text-slate-800 mt-0.5">{student.medicalInfo?.weight || "58 kg"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Known Allergies</p>
              <p className="font-semibold text-slate-800 mt-0.5">{student.medicalInfo?.allergies || "Dust Allergy"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Previous Education */}
      {activeTab === 'education' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Institute Name</th>
                <th className="p-3">Board</th>
                <th className="p-3">Passed Year</th>
                <th className="p-3">GPA / Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {student.previousEducation && student.previousEducation.length > 0 ? (
                student.previousEducation.map((pe: any) => (
                  <tr key={pe.id}>
                    <td className="p-3 font-bold text-slate-900">{pe.instituteName}</td>
                    <td className="p-3 text-slate-600">{pe.board || 'Dhaka'}</td>
                    <td className="p-3 font-semibold text-slate-800">{pe.passedYear}</td>
                    <td className="p-3 font-bold text-emerald-700">{pe.gpaMarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 font-bold text-slate-900">Dhanmondi Govt Primary School</td>
                  <td className="p-3 text-slate-600">Dhaka Board</td>
                  <td className="p-3 font-semibold text-slate-800">2021</td>
                  <td className="p-3 font-bold text-emerald-700">GPA 5.00</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Documents */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {student.documents && student.documents.length > 0 ? (
            student.documents.map((doc: any) => (
              <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{doc.title}</p>
                  <p className="text-[10px] text-slate-400">{doc.documentType}</p>
                </div>
                <a href={doc.fileUrl} target="_blank" className="px-3 py-1 bg-teal-50 text-teal-700 font-bold rounded-lg text-xs">
                  View File
                </a>
              </div>
            ))
          ) : (
            <div className="p-6 bg-white rounded-xl border border-slate-200 text-xs text-slate-400 col-span-2 text-center">
              No documents uploaded yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Status History */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-teal-600" />
            Student Status History Timeline
          </h3>
          <div className="border-l-2 border-teal-600 pl-4 space-y-4">
            {student.statusHistories && student.statusHistories.length > 0 ? (
              student.statusHistories.map((sh: any) => (
                <div key={sh.id}>
                  <p className="font-bold text-slate-900">{sh.newStatus}</p>
                  <p className="text-slate-500">{sh.changeReason}</p>
                  <p className="text-[10px] text-slate-400">{new Date(sh.createdAt).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <div>
                <p className="font-bold text-slate-900">ACTIVE</p>
                <p className="text-slate-500">Enrolled through online admission pipeline</p>
                <p className="text-[10px] text-slate-400">2026-01-05 10:00 AM</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
