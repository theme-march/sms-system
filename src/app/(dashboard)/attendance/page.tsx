'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck2, CheckCircle2, Clock3, PlusCircle, RefreshCw, Save, Settings2, Users, XCircle } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { DatabaseEmptyState } from '@/src/components/ui/DatabaseEmptyState';
import { StatusBadge } from '@/src/components/ui/StatusBadge';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';
type AcademicYear = { id: string; name: string; isCurrent: boolean };
type SchoolClass = { id: string; name: string; sections: Array<{ id: string; name: string }> };
type ClassGroupOption = { id: string; academicYearId: string; classId: string; groupId: string; groupName: string };
type ClassSubjectOption = { id: string; academicYearId: string | null; classId: string; groupId: string | null; subjectId: string; subjectName: string; subjectCode: string };
type RosterRow = { studentId: string; name: string; studentCode: string; rollNumber: number | null; status: AttendanceStatus; remarks: string };
type RecentRow = { id: string; date: string; studentName: string; rollNumber: number | null; className: string; sectionName: string; status: AttendanceStatus; remarks: string | null };
type AttendanceScope = { academicYearId: string; classId: string; sectionId: string; groupId: string | null; subjectId: string; isClassTeacher: boolean };

const todayInDhaka = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' });
const statusStyles: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-600 text-white', absent: 'bg-rose-600 text-white',
  late: 'bg-amber-500 text-white', leave: 'bg-blue-600 text-white',
};

export default function AttendancePage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [classGroups, setClassGroups] = useState<ClassGroupOption[]>([]);
  const [classSubjects, setClassSubjects] = useState<ClassSubjectOption[]>([]);
  const [attendanceScope, setAttendanceScope] = useState<AttendanceScope[] | null>(null);
  const [academicYearId, setAcademicYearId] = useState('');
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [sessionType, setSessionType] = useState<'DAILY' | 'SUBJECT_WISE'>('DAILY');
  const [date, setDate] = useState(todayInDhaka());
  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [recent, setRecent] = useState<RecentRow[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [canManageAcademic, setCanManageAcademic] = useState(false);
  const [alreadyRecorded, setAlreadyRecorded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'roll-call' | 'recent'>('roll-call');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedClass = useMemo(() => classes.find((item) => item.id === classId), [classId, classes]);
  const availableGroups = useMemo(() => classGroups.filter((item) => item.classId === classId && item.academicYearId === academicYearId), [academicYearId, classGroups, classId]);
  const availableSubjects = useMemo(() => {
    const seen = new Set<string>();
    return classSubjects
      .filter((item) => item.classId === classId && (!item.academicYearId || item.academicYearId === academicYearId) && (!item.groupId || item.groupId === groupId))
      .filter((item) => !attendanceScope || attendanceScope.some((scope) => scope.academicYearId === academicYearId && scope.classId === classId && scope.sectionId === sectionId && scope.subjectId === item.subjectId && (!groupId || !scope.groupId || scope.groupId === groupId)))
      .filter((item) => !seen.has(item.subjectId) && Boolean(seen.add(item.subjectId)));
  }, [academicYearId, attendanceScope, classId, classSubjects, groupId, sectionId]);
  const selectedGroup = availableGroups.find((item) => item.groupId === groupId);
  const selectedSubject = availableSubjects.find((item) => item.subjectId === subjectId);
  const counts = useMemo(() => roster.reduce<Record<AttendanceStatus, number>>((result, row) => {
    result[row.status] += 1;
    return result;
  }, { present: 0, absent: 0, late: 0, leave: 0 }), [roster]);

  const loadAttendance = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ date });
      if (classId) query.set('classId', classId);
      if (sectionId) query.set('sectionId', sectionId);
      if (academicYearId) query.set('academicYearId', academicYearId);
      if (groupId) query.set('groupId', groupId);
      if (subjectId) query.set('subjectId', subjectId);
      query.set('sessionType', sessionType);
      const response = await fetch(`/api/attendance?${query}`, { signal, cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load attendance.');
      setAcademicYears(payload.academicYears);
      setClasses(payload.classes);
      setClassGroups(payload.classGroups);
      setClassSubjects(payload.classSubjects);
      setAttendanceScope(payload.attendanceScope ?? null);
      setRoster(payload.roster);
      setRecent(payload.recent);
      setCanManage(payload.canManage);
      setCanManageAcademic(payload.canManageAcademic);
      setAlreadyRecorded(payload.alreadyRecorded);
      if (!academicYearId && payload.academicYears.length) setAcademicYearId((payload.academicYears.find((item: AcademicYear) => item.isCurrent) || payload.academicYears[0]).id);
      const validClass = payload.classes.find((item: SchoolClass) => item.id === classId);
      if (!validClass && payload.classes.length) {
        const firstClass = payload.classes[0] as SchoolClass;
        setClassId(firstClass.id);
        setSectionId(firstClass.sections[0]?.id || '');
      } else if (validClass && !validClass.sections.some((item: { id: string }) => item.id === sectionId)) {
        setSectionId(validClass.sections[0]?.id || '');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to load attendance.' });
    } finally {
      setLoading(false);
    }
  }, [academicYearId, classId, date, groupId, sectionId, sessionType, subjectId]);

  useEffect(() => {
    const controller = new AbortController();
    loadAttendance(controller.signal);
    return () => controller.abort();
  }, [loadAttendance]);

  function changeClass(nextClassId: string) {
    const nextClass = classes.find((item) => item.id === nextClassId);
    setClassId(nextClassId);
    setSectionId(nextClass?.sections[0]?.id || '');
    setGroupId('');
    setSubjectId('');
    setMessage(null);
  }

  function changeAcademicYear(value: string) {
    setAcademicYearId(value);
    setGroupId('');
    setSubjectId('');
    setMessage(null);
  }

  function changeGroup(value: string) {
    setGroupId(value);
    setSubjectId('');
    setMessage(null);
  }

  function changeSessionType(value: string) {
    const next = value === 'SUBJECT_WISE' ? 'SUBJECT_WISE' : 'DAILY';
    setSessionType(next);
    if (next === 'DAILY') setSubjectId('');
    setMessage(null);
  }

  function setStatus(studentId: string, status: AttendanceStatus) {
    setRoster((current) => current.map((row) => row.studentId === studentId ? { ...row, status } : row));
  }

  function markAll(status: AttendanceStatus) {
    setRoster((current) => current.map((row) => ({ ...row, status })));
  }

  async function submitAttendance() {
    if (!academicYearId || !classId || !sectionId || !roster.length) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ academicYearId, classId, sectionId, groupId, subjectId, sessionType, date, records: roster.map(({ studentId, status, remarks }) => ({ studentId, status, remarks })) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to save attendance.');
      setMessage({ type: 'success', text: `${payload.savedCount} students' attendance saved successfully.` });
      await loadAttendance();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to save attendance.' });
    } finally {
      setSaving(false);
    }
  }

  return <div className="space-y-6">
    <PageHeader
      title="Attendance Management"
      subtitle="Select a class and section, mark every student, then submit the daily roll call"
      breadcrumbs={[{ label: 'Attendance' }]}
      action={activeTab === 'roll-call' && canManage ? <button onClick={submitAttendance} disabled={saving || loading || !roster.length || (sessionType === 'SUBJECT_WISE' && !subjectId)} className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"><Save className="h-4 w-4" />{saving ? 'Saving…' : alreadyRecorded ? 'Update Attendance' : 'Submit Attendance'}</button> : undefined}
    />

    {message && <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>{message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}{message.text}</div>}

    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div><h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Settings2 className="h-4 w-4 text-teal-600" />Roll call setup</h2><p className="mt-1 text-xs text-slate-500">Options are loaded from Academic Management and update automatically.</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => loadAttendance()} disabled={loading} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />Refresh options</button>
          {canManageAcademic && <>
            <SetupLink href="/dashboard/academics/years" label="Years" />
            <SetupLink href="/dashboard/academics/classes" label="Classes" />
            <SetupLink href="/dashboard/academics/sections" label="Sections" />
            <SetupLink href="/dashboard/academics/groups" label="Groups" />
            <SetupLink href="/dashboard/academics/class-groups" label="Class–Group" />
            <SetupLink href="/dashboard/academics/subjects" label="Subjects" />
            <SetupLink href="/dashboard/academics/class-subjects" label="Class–Subject" />
          </>}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Select label="Attendance mode" value={sessionType} onChange={changeSessionType} options={[{ value: 'DAILY', label: 'Daily attendance' }, { value: 'SUBJECT_WISE', label: 'Subject-wise attendance' }]} />
        <Select label="Academic year" value={academicYearId} onChange={changeAcademicYear} options={academicYears.map((item) => ({ value: item.id, label: `${item.name}${item.isCurrent ? ' (Current)' : ''}` }))} />
        <Select label="Class" value={classId} onChange={changeClass} options={classes.map((item) => ({ value: item.id, label: item.name }))} />
        <Select label="Section" value={sectionId} onChange={setSectionId} options={(selectedClass?.sections || []).map((item) => ({ value: item.id, label: item.name }))} />
        <Select label="Group (optional)" placeholder="All students / no group filter" value={groupId} onChange={changeGroup} options={availableGroups.map((item) => ({ value: item.groupId, label: item.groupName }))} />
        {sessionType === 'SUBJECT_WISE' && <Select label="Subject" placeholder="Select assigned subject" value={subjectId} onChange={setSubjectId} options={availableSubjects.map((item) => ({ value: item.subjectId, label: `${item.subjectName} (${item.subjectCode})` }))} />}
        <label className="min-w-48 flex-1"><span className="mb-1.5 block text-xs font-bold text-slate-600">Attendance date</span><input type="date" value={date} onChange={(event) => { setDate(event.target.value); setMessage(null); }} className="form-input" /></label>
      </div>
      {sessionType === 'SUBJECT_WISE' && !availableSubjects.length && <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">No active Class–Subject mapping is available for this selection. Use “Manage Class–Subject” above first.</p>}
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-bold">
        <button onClick={() => setActiveTab('roll-call')} className={`flex items-center gap-1.5 rounded-md px-3 py-2 ${activeTab === 'roll-call' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500'}`}><Users className="h-4 w-4" />Daily Roll Call</button>
        <button onClick={() => setActiveTab('recent')} className={`flex items-center gap-1.5 rounded-md px-3 py-2 ${activeTab === 'recent' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500'}`}><Clock3 className="h-4 w-4" />Recent Records</button>
      </div>
      {activeTab === 'roll-call' && roster.length > 0 && <div className="flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700">Present {counts.present}</span><span className="rounded-full bg-rose-50 px-3 py-1 font-bold text-rose-700">Absent {counts.absent}</span><span className="rounded-full bg-amber-50 px-3 py-1 font-bold text-amber-700">Late {counts.late}</span><span className="rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700">Leave {counts.leave}</span></div>}
    </div>

    {activeTab === 'roll-call' ? <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div><h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><CalendarCheck2 className="h-4 w-4 text-teal-600" />{[selectedClass?.name || 'Class', selectedClass?.sections.find((item) => item.id === sectionId)?.name || 'Section', selectedGroup?.groupName, selectedSubject?.subjectName].filter(Boolean).join(' · ')}</h2><p className="mt-1 text-xs text-slate-500">{alreadyRecorded ? 'Attendance exists for this date and mode. Changes will update the existing sheet.' : 'All students default to Present. Change exceptions before submitting.'}</p></div>
        {canManage && roster.length > 0 && <div className="flex gap-2"><button onClick={() => markAll('present')} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100">Mark all Present</button><button onClick={() => markAll('absent')} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100">Mark all Absent</button></div>}
      </div>
      {loading ? <div className="space-y-3 p-6 animate-pulse"><div className="h-10 rounded bg-slate-100" /><div className="h-14 rounded bg-slate-50" /><div className="h-14 rounded bg-slate-50" /></div> : !classId || !sectionId ? <DatabaseEmptyState title="Select a class and section" description="Choose the attendance group above to load its active student roster." /> : !roster.length ? <DatabaseEmptyState title="No active students found" description="There are no active students assigned to this class and section." /> : <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-4 py-3">Roll</th><th className="px-4 py-3">Student</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Quick mark</th><th className="px-4 py-3">Remarks</th></tr></thead><tbody className="divide-y divide-slate-100">{roster.map((row) => <tr key={row.studentId} className="hover:bg-slate-50"><td className="px-4 py-3 font-bold">{row.rollNumber ?? '—'}</td><td className="px-4 py-3"><p className="font-bold text-slate-900">{row.name}</p><p className="text-[10px] text-slate-400">{row.studentCode}</p></td><td className="px-4 py-3"><StatusBadge status={row.status} /></td><td className="px-4 py-3"><div className="flex gap-1">{(['present', 'absent', 'late', 'leave'] as AttendanceStatus[]).map((status) => <button key={status} disabled={!canManage} onClick={() => setStatus(row.studentId, status)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold capitalize transition ${row.status === status ? statusStyles[status] : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} disabled:cursor-not-allowed`}>{status}</button>)}</div></td><td className="px-4 py-3"><input disabled={!canManage} value={row.remarks} onChange={(event) => setRoster((current) => current.map((item) => item.studentId === row.studentId ? { ...item, remarks: event.target.value } : item))} placeholder="Optional note" className="form-input min-w-48 py-1.5 text-xs disabled:bg-slate-50" /></td></tr>)}</tbody></table></div>}
    </section> : <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 px-5 py-4"><h2 className="text-sm font-bold text-slate-900">Recent attendance records</h2><p className="mt-1 text-xs text-slate-500">Latest 50 records stored in MySQL</p></div>{!recent.length ? <DatabaseEmptyState title="No attendance records" description="Submit a daily roll call to populate attendance history." /> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Date</th><th className="p-3">Roll</th><th className="p-3">Student</th><th className="p-3">Class</th><th className="p-3">Section</th><th className="p-3">Status</th><th className="p-3">Remarks</th></tr></thead><tbody className="divide-y divide-slate-100">{recent.map((record) => <tr key={record.id}><td className="p-3">{new Date(`${record.date}T00:00:00`).toLocaleDateString('en-GB')}</td><td className="p-3">{record.rollNumber ?? '—'}</td><td className="p-3 font-semibold">{record.studentName}</td><td className="p-3">{record.className}</td><td className="p-3">{record.sectionName}</td><td className="p-3"><StatusBadge status={record.status} /></td><td className="p-3">{record.remarks || '—'}</td></tr>)}</tbody></table></div>}</section>}
  </div>;
}

function Select({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; placeholder?: string }) {
  return <label className="min-w-48 flex-1"><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="form-input"><option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>{options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>;
}

function SetupLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100"><PlusCircle className="h-3.5 w-3.5" />Manage {label}</Link>;
}
