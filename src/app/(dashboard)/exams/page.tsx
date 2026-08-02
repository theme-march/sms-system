"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Edit2,
  FileSpreadsheet,
  GraduationCap,
  Lock,
  Plus,
  Printer,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { DatabaseEmptyState } from "@/src/components/ui/DatabaseEmptyState";
import { StatusBadge } from "@/src/components/ui/StatusBadge";

type Tab = "overview" | "setup" | "routine" | "marks" | "results";
type Data = any;
const emptyData: Data = {
  permissions: {},
  years: [],
  classes: [],
  subjects: [],
  rooms: [],
  exams: [],
  examSubjects: [],
  routines: [],
  marks: [],
  roster: [],
  results: [],
  publications: [],
};
const today = new Date().toLocaleDateString("en-CA", {
  timeZone: "Asia/Dhaka",
});

export default function ExaminationsPage() {
  const [data, setData] = useState<Data>(emptyData);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [examModal, setExamModal] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [routineModal, setRoutineModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<any>(null);
  const [examForm, setExamForm] = useState({
    name: "",
    term: "",
    year: new Date().getFullYear(),
    startDate: today,
    endDate: today,
    classId: "",
    sectionId: "",
  });
  const [routineForm, setRoutineForm] = useState({
    academicYearId: "",
    examId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
    examDate: today,
    startTime: "10:00",
    endTime: "13:00",
    roomId: "",
    totalMarks: 100,
    passMarks: 33,
    instructions: "",
    status: "DRAFT",
  });
  const [markRows, setMarkRows] = useState<
    Record<
      string,
      { marks: string; absent: boolean; comments: string; locked: boolean }
    >
  >({});

  const query = useMemo(() => {
    const value = new URLSearchParams();
    if (examId) value.set("examId", examId);
    if (classId) value.set("classId", classId);
    if (sectionId) value.set("sectionId", sectionId);
    if (subjectId) value.set("subjectId", subjectId);
    return value.toString();
  }, [classId, examId, sectionId, subjectId]);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/examinations?${query}`, {
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Unable to load examinations.");
      setData(payload);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to load examinations.",
      });
    } finally {
      setLoading(false);
    }
  }, [query]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    const next: typeof markRows = {};
    for (const row of data.roster || [])
      next[row.studentId] = {
        marks: row.existingMark === null ? "" : String(row.existingMark),
        absent: row.absent,
        comments: row.comments || "",
        locked: row.locked,
      };
    setMarkRows(next);
  }, [data.roster]);

  const selectedClass = data.classes.find((item: any) => item.id === classId);
  const examClass =
    selectedClass ||
    data.classes.find((item: any) => item.id === examForm.classId);
  const selectedExam = data.exams.find((item: any) => item.id === examId);
  const examClasses = selectedExam?.classes || [];
  const availableSubjects = Array.from(
    new Map(
      data.examSubjects
        .filter((item: any) => !examId || item.examId === examId)
        .filter((item: any) => !classId || item.classId === classId)
        .map((item: any) => [item.subjectId, item]),
    ).values(),
  ) as any[];
  const selectedSubject = availableSubjects.find(
    (item: any) => item.subjectId === subjectId,
  );
  const scheduled = data.routines.length;
  const entered = data.marks.length;
  const published = data.exams.filter((item: any) => item.isPublished).length;
  const upcoming = data.exams.filter(
    (item: any) => item.endDate >= today,
  ).length;

  async function action(body: object, success: string) {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/examinations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Operation failed.");
      setMessage({ type: "success", text: success });
      await load();
      return true;
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Operation failed.",
      });
      return false;
    } finally {
      setBusy(false);
    }
  }
  function openExam(exam?: any) {
    const year =
      data.years.find((item: any) => item.isCurrent) || data.years[0];
    const link = exam?.classes?.[0];
    const cls =
      data.classes.find((item: any) => item.id === link?.classId) ||
      data.classes[0];
    setEditingExam(exam || null);
    setExamForm({
      name: exam?.name || "",
      term: exam?.term || "",
      year: Number(
        exam?.year ||
          year?.name?.match(/\d{4}/)?.[0] ||
          new Date().getFullYear(),
      ),
      startDate: exam?.startDate || today,
      endDate: exam?.endDate || today,
      classId: link?.classId || cls?.id || "",
      sectionId: link?.sectionId || cls?.sections[0]?.id || "",
    });
    setExamModal(true);
  }
  async function createExam(event: FormEvent) {
    event.preventDefault();
    const ok = await action(
      {
        action: editingExam ? "updateExam" : "createExam",
        ...(editingExam ? { id: editingExam.id } : {}),
        ...examForm,
      },
      editingExam
        ? "Exam details updated."
        : "Exam created with its class subjects.",
    );
    if (ok) {
      setExamModal(false);
      setTab("setup");
    }
  }
  function openRoutine(row?: any) {
    const exam =
      data.exams.find((item: any) => item.id === (row?.examId || examId)) ||
      data.exams[0];
    const linked = exam?.classes?.[0];
    const cls = data.classes.find(
      (item: any) => item.id === (row?.classId || linked?.classId),
    );
    const year =
      data.years.find((item: any) => item.name.includes(String(exam?.year))) ||
      data.years.find((item: any) => item.isCurrent) ||
      data.years[0];
    const subject = data.examSubjects.find(
      (item: any) => item.examId === exam?.id && item.classId === cls?.id,
    );
    setEditingRoutine(row || null);
    setRoutineForm({
      academicYearId: row?.academicYearId || year?.id || "",
      examId: row?.examId || exam?.id || "",
      classId: row?.classId || cls?.id || "",
      sectionId:
        row?.sectionId || linked?.sectionId || cls?.sections[0]?.id || "",
      subjectId: row?.subjectId || subject?.subjectId || "",
      examDate: row?.examDate || exam?.startDate || today,
      startTime: row?.startTime || "10:00",
      endTime: row?.endTime || "13:00",
      roomId: row?.roomId || "",
      totalMarks: Number(row?.totalMarks ?? subject?.fullMarks ?? 100),
      passMarks: Number(row?.passMarks ?? subject?.passMarks ?? 33),
      instructions: row?.instructions || "",
      status: row?.status || "DRAFT",
    });
    setRoutineModal(true);
  }
  async function saveRoutine(event: FormEvent) {
    event.preventDefault();
    if (
      await action(
        {
          action: "saveRoutine",
          ...(editingRoutine ? { id: editingRoutine.id } : {}),
          ...routineForm,
        },
        editingRoutine ? "Exam schedule updated." : "Exam schedule added.",
      )
    )
      setRoutineModal(false);
  }
  async function remove(type: "exam" | "routine", id: string) {
    if (!window.confirm(`Delete this ${type}? This action cannot be undone.`))
      return;
    setBusy(true);
    try {
      const response = await fetch(`/api/examinations?type=${type}&id=${id}`, {
        method: "DELETE",
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Delete failed.");
      setMessage({
        type: "success",
        text: `${type === "exam" ? "Exam" : "Schedule"} deleted.`,
      });
      await load();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Delete failed.",
      });
    } finally {
      setBusy(false);
    }
  }
  async function saveMarks() {
    const rows = data.roster.map((student: any) => ({
      studentId: student.studentId,
      marks: Number(markRows[student.studentId]?.marks || 0),
      absent: markRows[student.studentId]?.absent || false,
      comments: markRows[student.studentId]?.comments || "",
    }));
    await action(
      { action: "saveMarks", examId, classId, sectionId, subjectId, rows },
      `${rows.length} student marks saved.`,
    );
  }
  async function verifyMarks() {
    await action(
      { action: "verifyMarks", examId, classId, subjectId },
      "Marks verified and locked.",
    );
  }
  async function unlockMarks() {
    const reason = window.prompt("Why are these marks being unlocked?");
    if (!reason) return;
    await action(
      { action: "unlockMarks", examId, classId, subjectId, reason },
      "Marks unlocked for authorized correction.",
    );
  }
  async function calculate() {
    const year =
      data.years.find((item: any) =>
        item.name.includes(String(selectedExam?.year)),
      ) || data.years.find((item: any) => item.isCurrent);
    await action(
      {
        action: "calculateResults",
        examId,
        academicYearId: year?.id,
        classId,
        sectionId,
      },
      "Results calculated and merit positions generated.",
    );
    setTab("results");
  }
  async function publish(publishValue: boolean) {
    await action(
      {
        action: "publishResults",
        examId,
        classId,
        publish: publishValue,
        reason: publishValue ? "" : "Correction in progress",
      },
      publishValue ? "Results published to portals." : "Results unpublished.",
    );
  }

  return (
    <div className="space-y-5 pb-10">
      <div className="print:hidden">
        <PageHeader
          title="Examinations & Results"
          subtitle="Plan exams, publish schedules, enter and verify marks, calculate and publish results"
          breadcrumbs={[{ label: "Examinations" }]}
          action={
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="btn-secondary">
                <Printer className="h-4 w-4" />
                Print
              </button>
              {data.permissions.manage && (
                <button onClick={() => openExam()} className="btn-primary">
                  <Plus className="h-4 w-4" />
                  New Exam
                </button>
              )}
            </div>
          }
        />
      </div>
      <div className="hidden text-center print:block">
        <h1 className="text-xl font-bold">
          {data.schoolName} — Examination & Result Register
        </h1>
        <p className="text-xs">Generated from MySQL</p>
      </div>
      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-semibold ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}
        >
          {message.text}
        </div>
      )}

      <nav className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm print:hidden">
        {(
          [
            ["overview", BarChart3, "Overview"],
            ["setup", GraduationCap, "Exam Setup"],
            ["routine", CalendarDays, "Exam Routine"],
            ["marks", FileSpreadsheet, "Marks Entry"],
            ["results", CheckCircle2, "Results"],
          ] as const
        ).map(([key, Icon, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold ${tab === key ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Metric label="Total exams" value={data.exams.length} />
            <Metric label="Upcoming / running" value={upcoming} />
            <Metric label="Scheduled papers" value={scheduled} />
            <Metric label="Marks records" value={entered} />
            <Metric label="Published exams" value={published} />
          </div>
          <section className="card p-5">
            <Title icon={ClipboardList} text="Examination workflow" />
            <div className="mt-4 grid gap-3 md:grid-cols-5">
              {[
                "1. Create exam",
                "2. Build routine",
                "3. Enter marks",
                "4. Verify & calculate",
                "5. Publish results",
              ].map((item, index) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                    {index + 1}
                  </span>
                  <p className="text-xs font-bold text-slate-700">
                    {item.slice(3)}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <ExamTable
            data={data}
            canManage={data.permissions.manage}
            onEdit={openExam}
            onDelete={(id: string) => remove("exam", id)}
          />{" "}
        </>
      )}

      {tab === "setup" && (
        <ExamTable
          data={data}
          canManage={data.permissions.manage}
          onEdit={openExam}
          onDelete={(id: string) => remove("exam", id)}
        />
      )}

      {tab === "routine" && (
        <>
          <FilterBar
            data={data}
            examId={examId}
            setExamId={(value: string) => {
              setExamId(value);
              setClassId("");
              setSectionId("");
              setSubjectId("");
            }}
            classId={classId}
            setClassId={(value: string) => {
              setClassId(value);
              setSectionId("");
              setSubjectId("");
            }}
            sectionId={sectionId}
            setSectionId={setSectionId}
            subjectId={subjectId}
            setSubjectId={setSubjectId}
            examClasses={examClasses}
            selectedClass={selectedClass}
            availableSubjects={availableSubjects}
          />
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <Title icon={CalendarDays} text="Official exam routine" />
              {data.permissions.manage && (
                <button
                  onClick={() => openRoutine()}
                  disabled={!data.exams.length}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4" />
                  Add Schedule
                </button>
              )}
            </div>
            {loading ? (
              <Loading />
            ) : !data.routines.length ? (
              <DatabaseEmptyState
                title="No exam schedule"
                description="Select Add Schedule to create an exam timetable."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Exam</th>
                      <th>Date & time</th>
                      <th>Class</th>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Status</th>
                      <th className="print:hidden">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.routines.map((row: any) => (
                      <tr key={row.id}>
                        <td className="font-semibold">{row.examName}</td>
                        <td>
                          {row.examDate}
                          <br />
                          <span className="text-slate-400">
                            {row.startTime}–{row.endTime}
                          </span>
                        </td>
                        <td>
                          {row.className}
                          <br />
                          <span className="text-slate-400">
                            {row.sectionName}
                          </span>
                        </td>
                        <td>{row.subjectName}</td>
                        <td>
                          {row.totalMarks} / pass {row.passMarks}
                        </td>
                        <td>
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="print:hidden">
                          <button
                            onClick={() => openRoutine(row)}
                            className="icon-edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => remove("routine", row.id)}
                            className="icon-delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {tab === "marks" && (
        <>
          <FilterBar
            data={data}
            examId={examId}
            setExamId={(value: string) => {
              setExamId(value);
              setClassId("");
              setSectionId("");
              setSubjectId("");
            }}
            classId={classId}
            setClassId={(value: string) => {
              setClassId(value);
              setSectionId("");
              setSubjectId("");
            }}
            sectionId={sectionId}
            setSectionId={setSectionId}
            subjectId={subjectId}
            setSubjectId={setSubjectId}
            examClasses={examClasses}
            selectedClass={selectedClass}
            availableSubjects={availableSubjects}
          />
          <section className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Title icon={FileSpreadsheet} text="Student marks sheet" />
                <p className="text-xs text-slate-500">
                  {selectedSubject
                    ? `Full marks ${selectedSubject.fullMarks} · Pass marks ${selectedSubject.passMarks}`
                    : "Select exam, class, section and subject"}
                </p>
              </div>
              <div className="flex gap-2">
                {data.permissions.unlockMarks &&
                  data.roster.some((row: any) => row.locked) && (
                    <button
                      disabled={busy}
                      onClick={unlockMarks}
                      className="btn-secondary"
                    >
                      Unlock
                    </button>
                  )}
                {data.permissions.verifyMarks && (
                  <button
                    disabled={
                      !data.roster.length ||
                      busy ||
                      data.roster.every((row: any) => row.locked)
                    }
                    onClick={verifyMarks}
                    className="btn-secondary"
                  >
                    <Lock className="h-4 w-4" />
                    Verify & Lock
                  </button>
                )}
                {data.permissions.enterMarks && (
                  <button
                    disabled={
                      !data.roster.length ||
                      busy ||
                      data.roster.some((row: any) => row.locked)
                    }
                    onClick={saveMarks}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4" />
                    Save Marks
                  </button>
                )}
              </div>
            </div>
            {loading ? (
              <Loading />
            ) : !data.roster.length ? (
              <DatabaseEmptyState
                title="Select a marks sheet"
                description="Choose all four filters to load enrolled students from MySQL."
              />
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Roll</th>
                      <th>Student</th>
                      <th className="w-40">Marks</th>
                      <th>Absent</th>
                      <th>Remarks</th>
                      <th>State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.roster.map((student: any) => {
                      const row = markRows[student.studentId] || {
                        marks: "",
                        absent: false,
                        comments: "",
                        locked: false,
                      };
                      return (
                        <tr key={student.studentId}>
                          <td className="font-bold">{student.roll}</td>
                          <td className="font-semibold">{student.name}</td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              max={selectedSubject?.fullMarks || 100}
                              step="0.01"
                              disabled={row.absent || row.locked}
                              value={row.marks}
                              onChange={(event) =>
                                setMarkRows({
                                  ...markRows,
                                  [student.studentId]: {
                                    ...row,
                                    marks: event.target.value,
                                  },
                                })
                              }
                              className="form-input"
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              disabled={row.locked}
                              checked={row.absent}
                              onChange={(event) =>
                                setMarkRows({
                                  ...markRows,
                                  [student.studentId]: {
                                    ...row,
                                    absent: event.target.checked,
                                  },
                                })
                              }
                              className="h-4 w-4 accent-teal-600"
                            />
                          </td>
                          <td>
                            <input
                              disabled={row.locked}
                              value={row.comments}
                              onChange={(event) =>
                                setMarkRows({
                                  ...markRows,
                                  [student.studentId]: {
                                    ...row,
                                    comments: event.target.value,
                                  },
                                })
                              }
                              className="form-input"
                              placeholder="Optional"
                            />
                          </td>
                          <td>
                            {row.locked ? (
                              <span className="badge-neutral">Locked</span>
                            ) : (
                              <span className="badge-warning">Draft</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {tab === "results" && (
        <>
          <FilterBar
            data={data}
            examId={examId}
            setExamId={(value: string) => {
              setExamId(value);
              setClassId("");
              setSectionId("");
              setSubjectId("");
            }}
            classId={classId}
            setClassId={(value: string) => {
              setClassId(value);
              setSectionId("");
            }}
            sectionId={sectionId}
            setSectionId={setSectionId}
            subjectId=""
            setSubjectId={() => {}}
            examClasses={examClasses}
            selectedClass={selectedClass}
            availableSubjects={[]}
            hideSubject
          />
          <section className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Title
                icon={CheckCircle2}
                text="Calculated results & merit list"
              />
              <div className="flex gap-2">
                {data.permissions.calculate && (
                  <button
                    disabled={!examId || !classId || !sectionId || busy}
                    onClick={calculate}
                    className="btn-secondary"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Calculate
                  </button>
                )}
                {data.permissions.publish && selectedExam && (
                  <button
                    disabled={!data.results.length || busy}
                    onClick={() => publish(!selectedExam.isPublished)}
                    className="btn-primary"
                  >
                    {selectedExam.isPublished ? "Unpublish" : "Publish Results"}
                  </button>
                )}
              </div>
            </div>
            {loading ? (
              <Loading />
            ) : !data.results.length ? (
              <DatabaseEmptyState
                title="No calculated result"
                description="Select an exam, class and section, then calculate results after marks verification."
              />
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th>Roll</th>
                      <th>Student</th>
                      <th>Total</th>
                      <th>Percentage</th>
                      <th>GPA</th>
                      <th>Grade</th>
                      <th>Failed</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.results.map((row: any) => (
                      <tr key={row.id}>
                        <td className="font-bold">
                          {row.classPosition || "—"}
                        </td>
                        <td>{row.roll || "—"}</td>
                        <td className="font-semibold">{row.studentName}</td>
                        <td>{Number(row.totalMarks).toFixed(2)}</td>
                        <td>{Number(row.percentage).toFixed(2)}%</td>
                        <td>{Number(row.gpa).toFixed(2)}</td>
                        <td>{row.letterGrade}</td>
                        <td>{row.failedSubjectCount}</td>
                        <td>
                          <StatusBadge
                            status={row.isPassed ? "PASSED" : "FAILED"}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {examModal && (
        <Modal
          title={editingExam ? "Edit Examination" : "Create Examination"}
          subtitle={
            editingExam
              ? "Update the official exam name, term and date range."
              : "Class subjects are attached automatically from Academic Management."
          }
          close={() => setExamModal(false)}
        >
          <form onSubmit={createExam}>
            <div className="form-grid">
              <Input
                label="Exam name"
                required
                value={examForm.name}
                change={(value) => setExamForm({ ...examForm, name: value })}
                placeholder="e.g. First Term Examination 2026"
              />
              <Input
                label="Term"
                required
                value={examForm.term}
                change={(value) => setExamForm({ ...examForm, term: value })}
                placeholder="First Term"
              />
              <Input
                label="Calendar year"
                required
                type="number"
                value={String(examForm.year)}
                change={(value) =>
                  setExamForm({ ...examForm, year: Number(value) })
                }
              />
              <Input
                label="Start date"
                required
                type="date"
                value={examForm.startDate}
                change={(value) =>
                  setExamForm({ ...examForm, startDate: value })
                }
              />
              <Input
                label="End date"
                required
                type="date"
                value={examForm.endDate}
                change={(value) => setExamForm({ ...examForm, endDate: value })}
              />
              <Select
                label="Class"
                required
                value={examForm.classId}
                change={(value) =>
                  setExamForm({
                    ...examForm,
                    classId: value,
                    sectionId:
                      data.classes.find((item: any) => item.id === value)
                        ?.sections[0]?.id || "",
                  })
                }
                options={data.classes.map((item: any) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
              <Select
                label="Section"
                value={examForm.sectionId}
                change={(value) =>
                  setExamForm({ ...examForm, sectionId: value })
                }
                options={(examClass?.sections || []).map((item: any) => ({
                  value: item.id,
                  label: item.name,
                }))}
                placeholder="All sections"
              />
            </div>
            <Footer
              busy={busy}
              close={() => setExamModal(false)}
              label={editingExam ? "Update Exam" : "Create Exam"}
            />
          </form>
        </Modal>
      )}
      {routineModal && (
        <Modal
          title={editingRoutine ? "Edit Exam Schedule" : "Add Exam Schedule"}
          subtitle="Duplicate subjects and class/room time conflicts are blocked."
          close={() => setRoutineModal(false)}
        >
          <form onSubmit={saveRoutine}>
            <div className="form-grid">
              <Select
                label="Academic year"
                required
                value={routineForm.academicYearId}
                change={(value) =>
                  setRoutineForm({ ...routineForm, academicYearId: value })
                }
                options={data.years.map((item: any) => ({
                  value: item.id,
                  label: `${item.name}${item.isCurrent ? " (Current)" : ""}`,
                }))}
              />
              <Select
                label="Exam"
                required
                value={routineForm.examId}
                change={(value) => {
                  const exam = data.exams.find(
                    (item: any) => item.id === value,
                  );
                  const link = exam?.classes?.[0];
                  setRoutineForm({
                    ...routineForm,
                    examId: value,
                    classId: link?.classId || "",
                    sectionId: link?.sectionId || "",
                    subjectId: "",
                  });
                }}
                options={data.exams.map((item: any) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
              <Select
                label="Class"
                required
                value={routineForm.classId}
                change={(value) =>
                  setRoutineForm({
                    ...routineForm,
                    classId: value,
                    subjectId: "",
                  })
                }
                options={data.classes
                  .filter((item: any) =>
                    data.exams
                      .find((exam: any) => exam.id === routineForm.examId)
                      ?.classes.some((link: any) => link.classId === item.id),
                  )
                  .map((item: any) => ({ value: item.id, label: item.name }))}
              />
              <Select
                label="Section"
                value={routineForm.sectionId}
                change={(value) =>
                  setRoutineForm({ ...routineForm, sectionId: value })
                }
                options={(
                  data.classes.find(
                    (item: any) => item.id === routineForm.classId,
                  )?.sections || []
                ).map((item: any) => ({ value: item.id, label: item.name }))}
                placeholder="All sections"
              />
              <Select
                label="Subject"
                required
                value={routineForm.subjectId}
                change={(value) => {
                  const config = data.examSubjects.find(
                    (item: any) =>
                      item.examId === routineForm.examId &&
                      item.classId === routineForm.classId &&
                      item.subjectId === value,
                  );
                  setRoutineForm({
                    ...routineForm,
                    subjectId: value,
                    totalMarks: Number(config?.fullMarks || 100),
                    passMarks: Number(config?.passMarks || 33),
                  });
                }}
                options={data.examSubjects
                  .filter(
                    (item: any) =>
                      item.examId === routineForm.examId &&
                      item.classId === routineForm.classId,
                  )
                  .map((item: any) => ({
                    value: item.subjectId,
                    label: `${item.subjectName} (${item.subjectCode})`,
                  }))}
              />
              <Input
                label="Exam date"
                required
                type="date"
                value={routineForm.examDate}
                change={(value) =>
                  setRoutineForm({ ...routineForm, examDate: value })
                }
              />
              <Input
                label="Start time"
                required
                type="time"
                value={routineForm.startTime}
                change={(value) =>
                  setRoutineForm({ ...routineForm, startTime: value })
                }
              />
              <Input
                label="End time"
                required
                type="time"
                value={routineForm.endTime}
                change={(value) =>
                  setRoutineForm({ ...routineForm, endTime: value })
                }
              />
              <Select
                label="Room"
                value={routineForm.roomId}
                change={(value) =>
                  setRoutineForm({ ...routineForm, roomId: value })
                }
                options={data.rooms.map((item: any) => ({
                  value: item.id,
                  label: `${item.name} (${item.code})`,
                }))}
                placeholder="No fixed room"
              />
              <Input
                label="Full marks"
                required
                type="number"
                value={String(routineForm.totalMarks)}
                change={(value) =>
                  setRoutineForm({ ...routineForm, totalMarks: Number(value) })
                }
              />
              <Input
                label="Pass marks"
                required
                type="number"
                value={String(routineForm.passMarks)}
                change={(value) =>
                  setRoutineForm({ ...routineForm, passMarks: Number(value) })
                }
              />
              <Select
                label="Status"
                required
                value={routineForm.status}
                change={(value) =>
                  setRoutineForm({ ...routineForm, status: value })
                }
                options={["DRAFT", "PUBLISHED", "CANCELLED"].map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
              <label className="md:col-span-2 xl:col-span-3">
                <span className="field-label">Instructions</span>
                <textarea
                  value={routineForm.instructions}
                  onChange={(event) =>
                    setRoutineForm({
                      ...routineForm,
                      instructions: event.target.value,
                    })
                  }
                  className="form-input min-h-20"
                />
              </label>
            </div>
            <Footer
              busy={busy}
              close={() => setRoutineModal(false)}
              label="Save Schedule"
            />
          </form>
        </Modal>
      )}
    </div>
  );
}

function FilterBar({
  data,
  examId,
  setExamId,
  classId,
  setClassId,
  sectionId,
  setSectionId,
  subjectId,
  setSubjectId,
  examClasses,
  selectedClass,
  availableSubjects,
  hideSubject = false,
}: any) {
  const linkedClassIds = new Set(examClasses.map((item: any) => item.classId));
  return (
    <div
      className={`grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm print:hidden ${hideSubject ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4"}`}
    >
      <Select
        label="Examination"
        value={examId}
        change={setExamId}
        options={data.exams.map((item: any) => ({
          value: item.id,
          label: item.name,
        }))}
        placeholder="Select exam"
      />
      <Select
        label="Class"
        value={classId}
        change={setClassId}
        options={data.classes
          .filter((item: any) => linkedClassIds.has(item.id))
          .map((item: any) => ({ value: item.id, label: item.name }))}
        placeholder="Select class"
      />
      <Select
        label="Section"
        value={sectionId}
        change={setSectionId}
        options={(selectedClass?.sections || []).map((item: any) => ({
          value: item.id,
          label: item.name,
        }))}
        placeholder="Select section"
      />
      {!hideSubject && (
        <Select
          label="Subject"
          value={subjectId}
          change={setSubjectId}
          options={availableSubjects.map((item: any) => ({
            value: item.subjectId,
            label: `${item.subjectName} (${item.subjectCode})`,
          }))}
          placeholder="Select subject"
        />
      )}
    </div>
  );
}
function ExamTable({ data, canManage, onEdit, onDelete }: any) {
  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <Title icon={GraduationCap} text="Exam register" />
        <span className="text-xs text-slate-500">
          {data.exams.length} exams
        </span>
      </div>
      {!data.exams.length ? (
        <DatabaseEmptyState
          title="No examinations configured"
          description="Create an exam to begin the organized assessment workflow."
        />
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Term / Year</th>
                <th>Date range</th>
                <th>Classes</th>
                <th>Subjects</th>
                <th>Publication</th>
                <th className="print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.exams.map((exam: any) => (
                <tr key={exam.id}>
                  <td className="font-semibold">{exam.name}</td>
                  <td>
                    {exam.term}
                    <br />
                    <span className="text-slate-400">{exam.year}</span>
                  </td>
                  <td>
                    {exam.startDate} — {exam.endDate}
                  </td>
                  <td>
                    {exam.classes.length ? (
                      <div className="flex max-w-xl flex-wrap gap-1.5">
                        {exam.classes
                          .slice(0, 4)
                          .map((item: any, index: number) => (
                            <span
                              key={`${item.classId}-${item.sectionId || "all"}-${index}`}
                              className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600"
                            >
                              {item.className} · {item.sectionName}
                            </span>
                          ))}
                        {exam.classes.length > 4 && (
                          <span className="rounded-md bg-teal-50 px-2 py-1 text-[10px] font-bold text-teal-700">
                            +{exam.classes.length - 4} more
                          </span>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{exam.subjectCount}</td>
                  <td>
                    <StatusBadge
                      status={exam.isPublished ? "PUBLISHED" : "DRAFT"}
                    />
                  </td>
                  <td className="print:hidden">
                    {canManage && (
                      <>
                        <button
                          onClick={() => onEdit(exam)}
                          className="icon-edit"
                          title="Edit exam"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(exam.id)}
                          className="icon-delete"
                          title="Delete exam"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}
function Title({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
      <Icon className="h-4 w-4 text-teal-600" />
      {text}
    </h2>
  );
}
function Loading() {
  return (
    <div className="mt-4 space-y-2 animate-pulse">
      <div className="h-10 rounded bg-slate-100" />
      <div className="h-14 rounded bg-slate-50" />
    </div>
  );
}
function Modal({ title, subtitle, close, children }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/45 p-4 backdrop-blur-xs">
      <div className="my-auto w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          </div>
          <button
            onClick={close}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Footer({ busy, close, label }: any) {
  return (
    <div className="flex justify-end gap-2 border-t border-slate-200 p-5">
      <button type="button" onClick={close} className="btn-secondary">
        Cancel
      </button>
      <button disabled={busy} className="btn-primary">
        <Save className="h-4 w-4" />
        {busy ? "Saving…" : label}
      </button>
    </div>
  );
}
function Select({
  label,
  value,
  change,
  options,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  change: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="field-label">
        {label}
        {required && <b className="text-rose-500"> *</b>}
      </span>
      <select
        required={required}
        value={value}
        onChange={(event) => change(event.target.value)}
        className="form-input"
      >
        <option value="">
          {placeholder || `Select ${label.toLowerCase()}`}
        </option>
        {options.map((item, index) => (
          <option key={`${item.value}-${index}`} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
function Input({
  label,
  value,
  change,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  change: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="field-label">
        {label}
        {required && <b className="text-rose-500"> *</b>}
      </span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => change(event.target.value)}
        placeholder={placeholder}
        className="form-input"
      />
    </label>
  );
}
