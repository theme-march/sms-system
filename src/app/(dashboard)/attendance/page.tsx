'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  UserCheck,
  Building,
  Bell,
  FileSpreadsheet,
  Download,
  Check,
  Send,
  X,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  recordBulkStudentAttendance,
  getStudentAttendance,
  getStudentAttendanceSummary,
  recordTeacherAttendance,
  getTeacherAttendance,
  recordEmployeeAttendance,
  getEmployeeAttendance,
  requestAttendanceCorrection,
  getAttendanceCorrections,
  approveAttendanceCorrection,
  getAttendanceNotifications,
  StudentAttendanceRecord,
  AttendanceNotificationRecord,
  AttendanceCorrectionRecord,
} from '@/src/services/attendance.service';

export default function AttendanceConsolePage() {
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'TEACHER' | 'EMPLOYEE' | 'CORRECTIONS' | 'NOTIFICATIONS'>('STUDENT');
  const [selectedClass, setSelectedClass] = useState('c-6');
  const [selectedSection, setSelectedSection] = useState('s-padma');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Roster State for Bulk Roll Call
  const [studentRoster, setStudentRoster] = useState<
    Array<{
      studentId: string;
      name: string;
      rollNumber: string;
      status: 'present' | 'absent' | 'late' | 'leave' | 'holiday';
      remarks: string;
    }>
  >([
    { studentId: 'st-1', name: 'Tanvir Hossain', rollNumber: '01', status: 'present', remarks: '' },
    { studentId: 'st-2', name: 'Sumaiya Akter', rollNumber: '02', status: 'absent', remarks: 'Uninformed' },
    { studentId: 'st-3', name: 'Sajid Islam', rollNumber: '03', status: 'present', remarks: '' },
    { studentId: 'st-4', name: 'Fariha Karim', rollNumber: '04', status: 'late', remarks: 'Arrived at 08:45 AM' },
    { studentId: 'st-5', name: 'Mahir Faisal', rollNumber: '05', status: 'leave', remarks: 'Medical Leave Approved' },
  ]);

  // Staff States
  const [teacherRoster, setTeacherRoster] = useState([
    { teacherId: 't-1', name: 'Dr. Rafiqul Islam', code: 'TCH-001', status: 'present' as const, inTime: '08:15', outTime: '14:30' },
    { teacherId: 't-2', name: 'Nusrat Jahan', code: 'TCH-002', status: 'present' as const, inTime: '08:20', outTime: '14:30' },
    { teacherId: 't-3', name: 'Mahmudul Hasan', code: 'TCH-003', status: 'absent' as const, inTime: '', outTime: '' },
  ]);

  const [employeeRoster, setEmployeeRoster] = useState([
    { employeeId: 'emp-1', name: 'Kamrul Hassan', code: 'EMP-001', dept: 'Accounts', status: 'present' as const, inTime: '08:00', outTime: '16:00' },
    { employeeId: 'emp-2', name: 'Nasreen Sultana', code: 'EMP-002', dept: 'Library', status: 'present' as const, inTime: '08:10', outTime: '16:00' },
  ]);

  const [corrections, setCorrections] = useState<AttendanceCorrectionRecord[]>([]);
  const [notifications, setNotifications] = useState<AttendanceNotificationRecord[]>([]);

  useEffect(() => {
    async function loadData() {
      const corrs = await getAttendanceCorrections();
      setCorrections(corrs);
      const notifs = await getAttendanceNotifications();
      setNotifications(notifs);
    }
    loadData();
  }, [activeTab]);

  const handleToggleStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late' | 'leave' | 'holiday') => {
    setStudentRoster((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status } : s))
    );
  };

  const handleSaveBulkStudentAttendance = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await recordBulkStudentAttendance({
        schoolId: 'school-1',
        academicYearId: 'ay-2026',
        classId: selectedClass,
        sectionId: selectedSection,
        date: attendanceDate,
        takenById: 'usr-tch-1',
        records: studentRoster.map((s) => ({
          studentId: s.studentId,
          studentName: s.name,
          rollNumber: s.rollNumber,
          status: s.status,
          remarks: s.remarks,
        })),
      });

      setSuccessMessage(
        `Attendance roll call saved! ${res.savedCount} student records processed. ${res.notificationsSent} guardian absent notifications created.`
      );
      const notifs = await getAttendanceNotifications();
      setNotifications(notifs);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit attendance roll call.');
    }
  };

  const handleApproveCorrection = async (id: string) => {
    try {
      await approveAttendanceCorrection(id, 'usr-admin-1');
      setSuccessMessage('Attendance correction approved and status updated.');
      const corrs = await getAttendanceCorrections();
      setCorrections(corrs);
    } catch {
      // Handled
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Roll,Student Name,Status,Date']
        .concat(studentRoster.map((s) => `${s.rollNumber},${s.name},${s.status},${attendanceDate}`))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Report_${attendanceDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Management Console"
        subtitle="Daily roll call, teacher/employee attendance, absent notifications, and corrections"
        breadcrumbs={[{ label: 'Attendance' }]}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-teal-600" />
              <span>Export CSV Report</span>
            </button>
            {activeTab === 'STUDENT' && (
              <button
                onClick={handleSaveBulkStudentAttendance}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Attendance Sheet</span>
              </button>
            )}
          </div>
        }
      />

      {/* Messages */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')}>
            <X className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')}>
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-2 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-bold">
          <button
            onClick={() => setActiveTab('STUDENT')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'STUDENT' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Daily Roll Call</span>
          </button>
          <button
            onClick={() => setActiveTab('TEACHER')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'TEACHER' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Teacher Attendance</span>
          </button>
          <button
            onClick={() => setActiveTab('EMPLOYEE')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'EMPLOYEE' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Employee Attendance</span>
          </button>
          <button
            onClick={() => setActiveTab('CORRECTIONS')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'CORRECTIONS' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Corrections ({corrections.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'NOTIFICATIONS' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Guardian Alerts ({notifications.length})</span>
          </button>
        </div>

        {activeTab === 'STUDENT' && (
          <div className="flex items-center gap-3 text-xs p-1">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            >
              <option value="c-6">Class 6</option>
              <option value="c-7">Class 7</option>
              <option value="c-8">Class 8</option>
              <option value="c-9">Class 9</option>
              <option value="c-10">Class 10</option>
            </select>

            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            >
              <option value="s-padma">Padma Section</option>
              <option value="s-meghna">Meghna Section</option>
              <option value="s-jamuna">Jamuna Section</option>
            </select>

            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Student Roll Call */}
      {activeTab === 'STUDENT' && (
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="px-4 py-3">Roll</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Quick Action Toggle</th>
                  <th className="px-4 py-3">Remarks / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {studentRoster.map((st) => (
                  <tr key={st.studentId} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-bold text-slate-900">#{st.rollNumber}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{st.name}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={st.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleToggleStudentStatus(st.studentId, 'present')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                            st.status === 'present'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleToggleStudentStatus(st.studentId, 'absent')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                            st.status === 'absent'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleToggleStudentStatus(st.studentId, 'late')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                            st.status === 'late'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleToggleStudentStatus(st.studentId, 'leave')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                            st.status === 'leave'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={st.remarks || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStudentRoster((prev) =>
                            prev.map((item) =>
                              item.studentId === st.studentId ? { ...item, remarks: val } : item
                            )
                          );
                        }}
                        placeholder="Add note..."
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Teacher Attendance */}
      {activeTab === 'TEACHER' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Faculty & Staff Attendance Register</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="px-4 py-3">Employee Code</th>
                  <th className="px-4 py-3">Teacher Name</th>
                  <th className="px-4 py-3 text-center">In Time</th>
                  <th className="px-4 py-3 text-center">Out Time</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {teacherRoster.map((t) => (
                  <tr key={t.teacherId}>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">{t.code}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{t.name}</td>
                    <td className="px-4 py-3 text-center font-mono">{t.inTime || '—'}</td>
                    <td className="px-4 py-3 text-center font-mono">{t.outTime || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Employee Attendance */}
      {activeTab === 'EMPLOYEE' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Administrative Employee Attendance Register</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Employee Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3 text-center">In Time</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {employeeRoster.map((e) => (
                  <tr key={e.employeeId}>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">{e.code}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{e.name}</td>
                    <td className="px-4 py-3 text-slate-600">{e.dept}</td>
                    <td className="px-4 py-3 text-center font-mono">{e.inTime || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={e.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Corrections */}
      {activeTab === 'CORRECTIONS' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Attendance Correction Requests</h3>
          {corrections.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No pending correction requests.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {corrections.map((corr) => (
                <div key={corr.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-900">
                      {corr.attendanceType} — Target ID #{corr.targetId} ({corr.date})
                    </p>
                    <p className="text-slate-600 mt-0.5">
                      Change Status from <strong className="uppercase">{corr.currentStatus}</strong> to{' '}
                      <strong className="text-emerald-700 uppercase">{corr.requestedStatus}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Reason: {corr.reason}</p>
                  </div>

                  {corr.status === 'PENDING' ? (
                    <button
                      onClick={() => handleApproveCorrection(corr.id)}
                      className="px-3.5 py-1.5 font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shrink-0"
                    >
                      Approve Correction
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                      APPROVED
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Guardian Alerts */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Guardian Absent Notification Dispatch Log</h3>
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No absent notifications dispatched yet.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {notifications.map((n) => (
                <div key={n.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">{n.studentName || `Student #${n.studentId}`}</span>
                    <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-800 bg-emerald-100 rounded-md">
                      {n.deliveryStatus} ({n.channel})
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">{n.message}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Guardian: {n.guardianName} ({n.guardianPhone}) • Dispatched on {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
