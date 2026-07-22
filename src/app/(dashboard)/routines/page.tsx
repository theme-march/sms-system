'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  BookOpen,
  Plus,
  Printer,
  History,
  AlertTriangle,
  CheckCircle2,
  X,
  Filter,
  UserCheck,
  Building,
  Layers,
  FileText,
} from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  getClassRoutines,
  createClassRoutine,
  updateClassRoutine,
  deleteClassRoutine,
  getRoutineVersions,
  createRoutineVersion,
  ClassRoutineRecord,
  RoutineVersionRecord,
} from '@/src/services/routine.service';
import { WEEKDAYS, Weekday } from '@/src/lib/validations/routine';

export default function ClassRoutinesPage() {
  const [loading, setLoading] = useState(true);
  const [routines, setRoutines] = useState<ClassRoutineRecord[]>([]);
  const [viewMode, setViewMode] = useState<'CLASS' | 'TEACHER' | 'ROOM'>('CLASS');

  // Filters
  const [selectedClass, setSelectedClass] = useState('c-6');
  const [selectedSection, setSelectedSection] = useState('s-padma');
  const [selectedTeacher, setSelectedTeacher] = useState('t-1');
  const [selectedRoom, setSelectedRoom] = useState('r-101');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVersionDrawer, setShowVersionDrawer] = useState(false);
  const [versions, setVersions] = useState<RoutineVersionRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [formPayload, setFormPayload] = useState({
    schoolId: 'school-1',
    academicYearId: 'ay-2026',
    classId: 'c-6',
    sectionId: 's-padma',
    subjectId: 'sub-1',
    teacherId: 't-1',
    roomId: 'r-101',
    weekday: 'SUNDAY' as Weekday,
    periodId: 'p-1',
    startTime: '08:30',
    endTime: '09:15',
    effectiveFrom: new Date().toISOString().split('T')[0],
    status: 'PUBLISHED' as const,
  });

  const periodsList = [
    { id: 'p-1', name: '1st Period', startTime: '08:30', endTime: '09:15', isBreak: false, isAssembly: false },
    { id: 'p-2', name: '2nd Period', startTime: '09:15', endTime: '10:00', isBreak: false, isAssembly: false },
    { id: 'p-3', name: '3rd Period', startTime: '10:00', endTime: '10:45', isBreak: false, isAssembly: false },
    { id: 'p-brk', name: 'Tiffin Break', startTime: '10:45', endTime: '11:15', isBreak: true, isAssembly: false },
    { id: 'p-4', name: '4th Period', startTime: '11:15', endTime: '12:00', isBreak: false, isAssembly: false },
    { id: 'p-5', name: '5th Period', startTime: '12:00', endTime: '12:45', isBreak: false, isAssembly: false },
    { id: 'p-6', name: '6th Period', startTime: '12:45', endTime: '01:30', isBreak: false, isAssembly: false },
  ];

  const fetchRoutinesData = async () => {
    setLoading(true);
    try {
      const data = await getClassRoutines({
        classId: viewMode === 'CLASS' ? selectedClass : undefined,
        sectionId: viewMode === 'CLASS' ? selectedSection : undefined,
        teacherId: viewMode === 'TEACHER' ? selectedTeacher : undefined,
        roomId: viewMode === 'ROOM' ? selectedRoom : undefined,
        search: searchQuery,
      });
      setRoutines(data);

      const verData = await getRoutineVersions(selectedClass, selectedSection);
      setVersions(verData);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutinesData();
  }, [viewMode, selectedClass, selectedSection, selectedTeacher, selectedRoom, searchQuery]);

  const handleCreateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await createClassRoutine(formPayload);
      setSuccessMessage('Class routine slot added successfully!');
      setShowAddModal(false);
      fetchRoutinesData();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create routine slot due to validation conflict.');
    }
  };

  const handleCreateSnapshotVersion = async () => {
    try {
      await createRoutineVersion(
        selectedClass,
        selectedSection,
        `Snapshot created on ${new Date().toLocaleDateString()}`,
        'admin@school.com'
      );
      setSuccessMessage('Routine version snapshot saved successfully.');
      const verData = await getRoutineVersions(selectedClass, selectedSection);
      setVersions(verData);
    } catch {
      // Handled
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <PageHeader
          title="Class Routine Management"
          subtitle="Timetable scheduling, conflict detection, and version history"
          breadcrumbs={[{ label: 'Academics' }, { label: 'Class Routines' }]}
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Timetable</span>
              </button>
              <button
                onClick={() => setShowVersionDrawer(true)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <History className="w-4 h-4 text-teal-600" />
                <span>Versions ({versions.length})</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Routine Slot</span>
              </button>
            </div>
          }
        />
      </div>

      {/* Printable Title Block for Print Mode */}
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black text-slate-900">DHAKA IDEAL HIGH SCHOOL</h1>
        <h2 className="text-sm font-bold text-slate-700">Official Weekly Class Timetable (Academic Year 2026)</h2>
        <p className="text-xs text-slate-500">
          View Mode: {viewMode} • Class 6 (Padma Section) • Effective Date: Jan 2026
        </p>
      </div>

      {/* Error & Success Messages */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
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

      {/* Controls Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* View Mode Switcher */}
          <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-bold">
            <button
              onClick={() => setViewMode('CLASS')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'CLASS' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Class View</span>
            </button>
            <button
              onClick={() => setViewMode('TEACHER')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'TEACHER' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Teacher View</span>
            </button>
            <button
              onClick={() => setViewMode('ROOM')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'ROOM' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Room View</span>
            </button>
          </div>

          {/* Dynamic Dropdown Selectors */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {viewMode === 'CLASS' && (
              <>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-hidden"
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
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-hidden"
                >
                  <option value="s-padma">Padma Section</option>
                  <option value="s-meghna">Meghna Section</option>
                  <option value="s-jamuna">Jamuna Section</option>
                </select>
              </>
            )}

            {viewMode === 'TEACHER' && (
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-hidden"
              >
                <option value="t-1">Dr. Rafiqul Islam (Bangla)</option>
                <option value="t-2">Nusrat Jahan (English)</option>
                <option value="t-3">Mahmudul Hasan (Mathematics)</option>
              </select>
            )}

            {viewMode === 'ROOM' && (
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-hidden"
              >
                <option value="r-101">Classroom 101</option>
                <option value="r-102">Classroom 102</option>
                <option value="r-201">Science Laboratory</option>
                <option value="r-301">Computer Lab (ICT)</option>
              </select>
            )}

            <button
              onClick={handleCreateSnapshotVersion}
              className="px-3 py-1.5 bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 font-bold rounded-lg transition-colors"
            >
              Save Version Snapshot
            </button>
          </div>
        </div>
      </div>

      {/* Timetable Grid Matrix */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                <th className="px-3 py-3 border-r border-slate-200 text-center w-32">Period & Time</th>
                {WEEKDAYS.map((day) => {
                  const isWeekend = day === 'FRIDAY' || day === 'SATURDAY';
                  return (
                    <th
                      key={day}
                      className={`px-3 py-3 text-center border-r border-slate-200 ${
                        isWeekend ? 'bg-amber-50/70 text-amber-900' : ''
                      }`}
                    >
                      {day}
                      {isWeekend && (
                        <span className="block text-[9px] font-normal text-amber-700 uppercase">
                          Weekly Holiday
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periodsList.map((period) => (
                <tr key={period.id} className={period.isBreak ? 'bg-slate-50/80 font-bold' : 'hover:bg-slate-50/50'}>
                  {/* Period Name & Time */}
                  <td className="px-3 py-3 font-bold text-teal-800 border-r border-slate-200 whitespace-nowrap text-center bg-slate-50/40">
                    <div>{period.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {period.startTime} - {period.endTime}
                    </div>
                  </td>

                  {/* Weekday Cells */}
                  {WEEKDAYS.map((day) => {
                    const isWeekend = day === 'FRIDAY' || day === 'SATURDAY';

                    if (period.isBreak) {
                      return (
                        <td key={day} className="px-2 py-3 text-center text-slate-400 border-r border-slate-200 italic font-semibold bg-amber-50/30">
                          --- BREAK ---
                        </td>
                      );
                    }

                    if (isWeekend) {
                      return (
                        <td key={day} className="px-2 py-3 text-center text-amber-600/70 border-r border-slate-200 font-medium bg-amber-50/20 italic">
                          Holiday
                        </td>
                      );
                    }

                    // Find matching routine slot
                    const matchSlot = routines.find(
                      (r) => r.weekday === day && r.periodId === period.id
                    );

                    return (
                      <td
                        key={day}
                        className="px-2 py-2.5 text-center border-r border-slate-200 align-top min-w-[130px]"
                      >
                        {matchSlot ? (
                          <div className="p-2 bg-teal-50/70 border border-teal-200/80 rounded-lg text-left space-y-1 shadow-2xs hover:border-teal-400 transition-colors">
                            <p className="font-extrabold text-slate-900 text-[11px] leading-tight">
                              {matchSlot.subjectName || 'Subject'}
                            </p>
                            <p className="text-[10px] font-semibold text-teal-800">
                              {matchSlot.teacherName || 'Teacher'}
                            </p>
                            <div className="flex items-center justify-between text-[9px] text-slate-500 border-t border-teal-100 pt-1">
                              <span>{matchSlot.roomName || 'Room 101'}</span>
                              <span className="font-mono font-bold text-slate-600">{matchSlot.startTime}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full min-h-[50px] flex items-center justify-center text-slate-300 hover:text-slate-400 text-[10px]">
                            <span className="opacity-0 hover:opacity-100 font-bold text-teal-600 cursor-pointer">+ Add</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Class Routine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Add New Class Routine Slot</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoutine} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={formPayload.classId}
                    onChange={(e) => setFormPayload({ ...formPayload, classId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="c-6">Class 6</option>
                    <option value="c-7">Class 7</option>
                    <option value="c-8">Class 8</option>
                    <option value="c-9">Class 9</option>
                    <option value="c-10">Class 10</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={formPayload.sectionId}
                    onChange={(e) => setFormPayload({ ...formPayload, sectionId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="s-padma">Padma Section</option>
                    <option value="s-meghna">Meghna Section</option>
                    <option value="s-jamuna">Jamuna Section</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={formPayload.subjectId}
                    onChange={(e) => setFormPayload({ ...formPayload, subjectId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="sub-1">Bangla 1st Paper</option>
                    <option value="sub-2">English 1st Paper</option>
                    <option value="sub-3">General Mathematics</option>
                    <option value="sub-5">Physics</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teacher</label>
                  <select
                    value={formPayload.teacherId}
                    onChange={(e) => setFormPayload({ ...formPayload, teacherId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="t-1">Dr. Rafiqul Islam</option>
                    <option value="t-2">Nusrat Jahan</option>
                    <option value="t-3">Mahmudul Hasan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weekday</label>
                  <select
                    value={formPayload.weekday}
                    onChange={(e) => setFormPayload({ ...formPayload, weekday: e.target.value as Weekday })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    {WEEKDAYS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Period</label>
                  <select
                    value={formPayload.periodId}
                    onChange={(e) => setFormPayload({ ...formPayload, periodId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    {periodsList
                      .filter((p) => !p.isBreak)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room</label>
                  <select
                    value={formPayload.roomId || ''}
                    onChange={(e) => setFormPayload({ ...formPayload, roomId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="r-101">Classroom 101</option>
                    <option value="r-102">Classroom 102</option>
                    <option value="r-201">Science Lab</option>
                    <option value="r-301">ICT Lab</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time (HH:MM)</label>
                  <input
                    type="text"
                    value={formPayload.startTime}
                    onChange={(e) => setFormPayload({ ...formPayload, startTime: e.target.value })}
                    placeholder="08:30"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time (HH:MM)</label>
                  <input
                    type="text"
                    value={formPayload.endTime}
                    onChange={(e) => setFormPayload({ ...formPayload, endTime: e.target.value })}
                    placeholder="09:15"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
                >
                  Validate & Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Routine Versions Drawer */}
      {showVersionDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-teal-600" />
                <span>Routine Version Snapshots</span>
              </h3>
              <button onClick={() => setShowVersionDrawer(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {versions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No saved version history found.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {versions.map((ver) => (
                  <div key={ver.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-teal-800">Version #{ver.versionNumber}</span>
                      <span className="text-[10px] text-slate-400">{new Date(ver.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 font-medium">{ver.changeSummary || 'Routine Update Snapshot'}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Created By: {ver.createdBy}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
