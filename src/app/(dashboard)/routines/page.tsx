'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Clock, Edit2, Plus, Printer, Save, Trash2, X } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { DatabaseEmptyState } from '@/src/components/ui/DatabaseEmptyState';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
type Routine = { id: string; academicYearId: string; sessionId: string | null; classId: string; sectionId: string; groupId: string | null; subjectId: string; teacherId: string; roomId: string | null; weekday: typeof WEEKDAYS[number]; periodId: string; startTime: string; endTime: string; effectiveFrom: string; effectiveTo: string; status: 'DRAFT' | 'PUBLISHED' | 'INACTIVE'; versionNumber: number; className: string; sectionName: string; groupName: string; subjectName: string; subjectCode: string; teacherName: string; teacherCode: string; roomName: string; periodName: string };
type OptionData = {
  academicYears: Array<{ id: string; name: string; isCurrent: boolean }>;
  sessions: Array<{ id: string; name: string; academicYearId: string }>;
  classes: Array<{ id: string; name: string; sections: Array<{ id: string; name: string }> }>;
  classGroups: Array<{ academicYearId: string; classId: string; groupId: string; groupName: string }>;
  classSubjects: Array<{ academicYearId: string | null; classId: string; groupId: string | null; subjectId: string; subjectName: string; subjectCode: string }>;
  teachers: Array<{ id: string; nameEn: string; employeeCode: string }>;
  rooms: Array<{ id: string; name: string; code: string }>;
  periods: Array<{ id: string; name: string; startTime: string; endTime: string }>;
};
type FormState = { academicYearId: string; sessionId: string; classId: string; sectionId: string; groupId: string; subjectId: string; teacherId: string; roomId: string; weekday: typeof WEEKDAYS[number]; periodId: string; startTime: string; endTime: string; effectiveFrom: string; effectiveTo: string; status: Routine['status'] };
const emptyOptions: OptionData = { academicYears: [], sessions: [], classes: [], classGroups: [], classSubjects: [], teachers: [], rooms: [], periods: [] };
const blankForm: FormState = { academicYearId: '', sessionId: '', classId: '', sectionId: '', groupId: '', subjectId: '', teacherId: '', roomId: '', weekday: 'SUNDAY', periodId: '', startTime: '', endTime: '', effectiveFrom: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' }), effectiveTo: '', status: 'PUBLISHED' };

export default function RoutinesPage() {
  const [data, setData] = useState<Routine[]>([]);
  const [options, setOptions] = useState<OptionData>(emptyOptions);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [weekdayFilter, setWeekdayFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Routine | null>(null);
  const [deleting, setDeleting] = useState<Routine | null>(null);
  const [form, setForm] = useState<FormState>(blankForm);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (classFilter) query.set('classId', classFilter);
      if (sectionFilter) query.set('sectionId', sectionFilter);
      if (teacherFilter) query.set('teacherId', teacherFilter);
      if (weekdayFilter) query.set('weekday', weekdayFilter);
      if (statusFilter) query.set('status', statusFilter);
      const response = await fetch(`/api/routines?${query}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load class routines.');
      setData(payload.data.sort((a: Routine, b: Routine) => WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b.weekday) || a.startTime.localeCompare(b.startTime)));
      setOptions({ academicYears: payload.academicYears, sessions: payload.sessions, classes: payload.classes, classGroups: payload.classGroups, classSubjects: payload.classSubjects, teachers: payload.teachers, rooms: payload.rooms, periods: payload.periods });
      setCanManage(payload.canManage);
    } catch (error) { setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to load routines.' }); }
    finally { setLoading(false); }
  }, [classFilter, sectionFilter, statusFilter, teacherFilter, weekdayFilter]);

  useEffect(() => { load(); }, [load]);

  const filterClass = options.classes.find((item) => item.id === classFilter);
  const formClass = options.classes.find((item) => item.id === form.classId);
  const formSessions = options.sessions.filter((item) => item.academicYearId === form.academicYearId);
  const formGroups = options.classGroups.filter((item) => item.academicYearId === form.academicYearId && item.classId === form.classId);
  const formSubjects = useMemo(() => {
    const seen = new Set<string>();
    return options.classSubjects.filter((item) => item.classId === form.classId && (!item.academicYearId || item.academicYearId === form.academicYearId) && (!item.groupId || item.groupId === form.groupId)).filter((item) => !seen.has(item.subjectId) && Boolean(seen.add(item.subjectId)));
  }, [form.academicYearId, form.classId, form.groupId, options.classSubjects]);

  function openCreate() {
    const year = options.academicYears.find((item) => item.isCurrent) || options.academicYears[0];
    const cls = options.classes[0];
    const section = cls?.sections[0];
    const session = options.sessions.find((item) => item.academicYearId === year?.id);
    const subject = options.classSubjects.find((item) => item.classId === cls?.id && (!item.academicYearId || item.academicYearId === year?.id));
    const period = options.periods[0];
    setEditing(null);
    setForm({ ...blankForm, academicYearId: year?.id || '', sessionId: session?.id || '', classId: cls?.id || '', sectionId: section?.id || '', subjectId: subject?.subjectId || '', teacherId: options.teachers[0]?.id || '', roomId: options.rooms[0]?.id || '', periodId: period?.id || '', startTime: period?.startTime || '', endTime: period?.endTime || '' });
    setMessage(null); setModalOpen(true);
  }

  function openEdit(item: Routine) {
    setEditing(item);
    setForm({ academicYearId: item.academicYearId, sessionId: item.sessionId || '', classId: item.classId, sectionId: item.sectionId, groupId: item.groupId || '', subjectId: item.subjectId, teacherId: item.teacherId, roomId: item.roomId || '', weekday: item.weekday, periodId: item.periodId, startTime: item.startTime, endTime: item.endTime, effectiveFrom: item.effectiveFrom, effectiveTo: item.effectiveTo, status: item.status });
    setMessage(null); setModalOpen(true);
  }

  function changeYear(value: string) { setForm((current) => ({ ...current, academicYearId: value, sessionId: options.sessions.find((item) => item.academicYearId === value)?.id || '', groupId: '', subjectId: '' })); }
  function changeClass(value: string) { const cls = options.classes.find((item) => item.id === value); setForm((current) => ({ ...current, classId: value, sectionId: cls?.sections[0]?.id || '', groupId: '', subjectId: options.classSubjects.find((item) => item.classId === value && (!item.academicYearId || item.academicYearId === current.academicYearId))?.subjectId || '' })); }
  function changeGroup(value: string) { setForm((current) => ({ ...current, groupId: value, subjectId: '' })); }
  function changePeriod(value: string) { const period = options.periods.find((item) => item.id === value); setForm((current) => ({ ...current, periodId: value, startTime: period?.startTime || '', endTime: period?.endTime || '' })); }

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage(null);
    try {
      const response = await fetch(`/api/routines${editing ? `?id=${editing.id}` : ''}`, { method: editing ? 'PUT' : 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to save routine slot.');
      setModalOpen(false); setMessage({ type: 'success', text: editing ? 'Routine slot updated successfully.' : 'Routine slot created successfully.' }); await load();
    } catch (error) { setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to save routine.' }); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (!deleting) return;
    try { const response = await fetch(`/api/routines?id=${deleting.id}`, { method: 'DELETE' }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error || 'Unable to delete routine.'); setMessage({ type: 'success', text: 'Routine slot deleted.' }); setDeleting(null); await load(); }
    catch (error) { setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to delete routine.' }); }
  }

  return <div className="space-y-6">
    <div className="print:hidden"><PageHeader title="Class Routine Management" subtitle="Build weekly timetables with teacher, room, class and period conflict protection" breadcrumbs={[{ label: 'Routines' }]} action={<div className="flex gap-2"><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"><Printer className="h-4 w-4" />Print</button>{canManage && <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700"><Plus className="h-4 w-4" />Add Routine Slot</button>}</div>} /></div>
    <div className="hidden text-center print:block"><h1 className="text-xl font-bold">Official Weekly Class Timetable</h1><p className="text-sm">Generated from MySQL</p></div>
    {message && <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>{message.text}</div>}

    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm print:hidden md:grid-cols-2 xl:grid-cols-5">
      <Select label="Class" value={classFilter} onChange={(value) => { setClassFilter(value); setSectionFilter(''); }} placeholder="All classes" options={options.classes.map((item) => ({ value: item.id, label: item.name }))} />
      <Select label="Section" value={sectionFilter} onChange={setSectionFilter} placeholder="All sections" options={(filterClass?.sections || []).map((item) => ({ value: item.id, label: item.name }))} />
      <Select label="Teacher" value={teacherFilter} onChange={setTeacherFilter} placeholder="All teachers" options={options.teachers.map((item) => ({ value: item.id, label: `${item.nameEn} (${item.employeeCode})` }))} />
      <Select label="Day" value={weekdayFilter} onChange={setWeekdayFilter} placeholder="All days" options={WEEKDAYS.map((item) => ({ value: item, label: item }))} />
      <Select label="Status" value={statusFilter} onChange={setStatusFilter} placeholder="All statuses" options={['PUBLISHED', 'DRAFT', 'INACTIVE'].map((item) => ({ value: item, label: item }))} />
    </div>

    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><h2 className="flex items-center gap-2 text-sm font-bold"><Clock className="h-4 w-4 text-teal-600" />Weekly timetable</h2><span className="text-xs text-slate-500">{data.length} slots</span></div>
      {loading ? <div className="space-y-3 p-6 animate-pulse"><div className="h-10 rounded bg-slate-100" /><div className="h-14 rounded bg-slate-50" /></div> : !data.length ? <DatabaseEmptyState title="No class routine" description="Use Add Routine Slot to build the weekly timetable." /> : <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Day / Period</th><th className="p-3">Time</th><th className="p-3">Class</th><th className="p-3">Group</th><th className="p-3">Subject</th><th className="p-3">Teacher</th><th className="p-3">Room</th><th className="p-3">Status</th><th className="p-3 print:hidden">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{data.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="p-3"><p className="font-bold">{item.weekday}</p><p className="text-[10px] text-slate-400">{item.periodName}</p></td><td className="p-3 font-mono">{item.startTime}–{item.endTime}</td><td className="p-3"><p className="font-bold">{item.className}</p><p className="text-[10px] text-slate-400">{item.sectionName}</p></td><td className="p-3">{item.groupName || 'All'}</td><td className="p-3"><p className="font-semibold">{item.subjectName}</p><p className="text-[10px] text-slate-400">{item.subjectCode}</p></td><td className="p-3"><p>{item.teacherName}</p><p className="text-[10px] text-slate-400">{item.teacherCode}</p></td><td className="p-3">{item.roomName}</td><td className="p-3"><StatusBadge status={item.status} /></td><td className="p-3 print:hidden">{canManage && <div className="flex gap-1"><button onClick={() => openEdit(item)} title="Edit" className="rounded-md p-2 text-blue-600 hover:bg-blue-50"><Edit2 className="h-4 w-4" /></button><button onClick={() => setDeleting(item)} title="Delete" className="rounded-md p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button></div>}</td></tr>)}</tbody></table></div>}
    </section>

    {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-xs print:hidden"><form onSubmit={submit} className="my-auto w-full max-w-4xl rounded-xl border border-slate-200 bg-white shadow-xl"><div className="flex items-start justify-between border-b border-slate-200 p-5"><div><h2 className="text-lg font-bold">{editing ? 'Edit Routine Slot' : 'Add Routine Slot'}</h2><p className="mt-1 text-xs text-slate-500">Conflicting teacher, room, class-section and period assignments are blocked automatically.</p></div><button type="button" onClick={() => setModalOpen(false)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
      <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
        <Select label="Academic year" required value={form.academicYearId} onChange={changeYear} options={options.academicYears.map((item) => ({ value: item.id, label: `${item.name}${item.isCurrent ? ' (Current)' : ''}` }))} />
        <Select label="Session" value={form.sessionId} onChange={(value) => setForm({ ...form, sessionId: value })} placeholder="No session" options={formSessions.map((item) => ({ value: item.id, label: item.name }))} />
        <Select label="Class" required value={form.classId} onChange={changeClass} options={options.classes.map((item) => ({ value: item.id, label: item.name }))} />
        <Select label="Section" required value={form.sectionId} onChange={(value) => setForm({ ...form, sectionId: value })} options={(formClass?.sections || []).map((item) => ({ value: item.id, label: item.name }))} />
        <Select label="Group" value={form.groupId} onChange={changeGroup} placeholder="All groups" options={formGroups.map((item) => ({ value: item.groupId, label: item.groupName }))} />
        <Select label="Subject" required value={form.subjectId} onChange={(value) => setForm({ ...form, subjectId: value })} options={formSubjects.map((item) => ({ value: item.subjectId, label: `${item.subjectName} (${item.subjectCode})` }))} />
        <Select label="Teacher" required value={form.teacherId} onChange={(value) => setForm({ ...form, teacherId: value })} options={options.teachers.map((item) => ({ value: item.id, label: `${item.nameEn} (${item.employeeCode})` }))} />
        <Select label="Room" value={form.roomId} onChange={(value) => setForm({ ...form, roomId: value })} placeholder="No fixed room" options={options.rooms.map((item) => ({ value: item.id, label: `${item.name} (${item.code})` }))} />
        <Select label="Day" required value={form.weekday} onChange={(value) => setForm({ ...form, weekday: value as FormState['weekday'] })} options={WEEKDAYS.map((item) => ({ value: item, label: item }))} />
        <Select label="Period" required value={form.periodId} onChange={changePeriod} options={options.periods.map((item) => ({ value: item.id, label: `${item.name} (${item.startTime}–${item.endTime})` }))} />
        <Input label="Start time" required type="time" value={form.startTime} onChange={(value) => setForm({ ...form, startTime: value })} />
        <Input label="End time" required type="time" value={form.endTime} onChange={(value) => setForm({ ...form, endTime: value })} />
        <Input label="Effective from" required type="date" value={form.effectiveFrom} onChange={(value) => setForm({ ...form, effectiveFrom: value })} />
        <Input label="Effective to" type="date" value={form.effectiveTo} onChange={(value) => setForm({ ...form, effectiveTo: value })} />
        <Select label="Status" required value={form.status} onChange={(value) => setForm({ ...form, status: value as Routine['status'] })} options={['PUBLISHED', 'DRAFT', 'INACTIVE'].map((item) => ({ value: item, label: item }))} />
      </div>
      {!formSubjects.length && form.classId && <div className="mx-5 mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800"><AlertTriangle className="h-4 w-4" />No Class–Subject mapping exists for this selection. Configure it in Academic Management first.</div>}
      <div className="flex justify-end gap-2 border-t border-slate-200 p-5"><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700">Cancel</button><button disabled={saving || !formSubjects.length} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 disabled:bg-slate-300"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save Routine'}</button></div></form></div>}
    <ConfirmDialog isOpen={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={remove} title="Delete routine slot?" description={`${deleting?.weekday || ''} ${deleting?.startTime || ''} ${deleting?.className || ''} routine will be permanently removed.`} confirmText="Delete slot" />
  </div>;
}

function Select({ label, value, onChange, options, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; placeholder?: string; required?: boolean }) {
  return <label className="block min-w-0"><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}{required && <span className="text-rose-500"> *</span>}</span><select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="form-input"><option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>{options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>;
}
function Input({ label, value, onChange, type, required }: { label: string; value: string; onChange: (value: string) => void; type: string; required?: boolean }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}{required && <span className="text-rose-500"> *</span>}</span><input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="form-input" /></label>;
}
