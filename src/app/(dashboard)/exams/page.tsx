"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
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
import { TablePagination, usePagination } from "@/src/components/tables/TablePagination";

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
  marksScope: null,
  roster: [],
  results: [],
  publications: [],
};
const today = new Date().toLocaleDateString("en-CA", {
  timeZone: "Asia/Dhaka",
});

export default function ExaminationsPage() {
  const [data, setData] = useState<Data>(emptyData);
  const routinePagination = usePagination<any>(data.routines);
  const rosterPagination = usePagination<any>(data.roster);
  const resultPagination = usePagination<any>(data.results);
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
    assignments: [] as Array<{ classId: string; sectionId: string }>,
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
  useEffect(() => {
    if (tab !== "marks" || !Array.isArray(data.marksScope)) return;
    const currentIsAssigned = data.marksScope.some(
      (scope: any) =>
        scope.examId === examId &&
        scope.classId === classId &&
        scope.sectionId === sectionId &&
        scope.subjectId === subjectId,
    );
    if (currentIsAssigned) return;
    const firstAssigned =
      data.marksScope.find((scope: any) => scope.examId === examId) ||
      data.marksScope[0];
    if (!firstAssigned) {
      setExamId("");
      setClassId("");
      setSectionId("");
      setSubjectId("");
      return;
    }
    setExamId(firstAssigned.examId);
    setClassId(firstAssigned.classId);
    setSectionId(firstAssigned.sectionId);
    setSubjectId(firstAssigned.subjectId);
  }, [classId, data.marksScope, examId, sectionId, subjectId, tab]);

  const selectedClass = data.classes.find((item: any) => item.id === classId);
  const examClass =
    selectedClass ||
    data.classes.find((item: any) => item.id === examForm.classId);
  const selectedExam = data.exams.find((item: any) => item.id === examId);
  const selectedPublication = data.publications.find(
    (item: any) =>
      item.examId === examId &&
      (item.classId === classId || item.classId === null) &&
      item.status === "PUBLISHED",
  );
  const selectedResultPublished = Boolean(selectedPublication);
  const examClasses = selectedExam?.classes || [];
  const availableSubjects = Array.from(
    new Map(
      data.examSubjects
        .filter((item: any) => !examId || item.examId === examId)
        .filter((item: any) => !classId || item.classId === classId)
        .filter(
          (item: any) =>
            tab !== "marks" ||
            !Array.isArray(data.marksScope) ||
            data.marksScope.some(
              (scope: any) =>
                scope.examId === item.examId &&
                scope.classId === item.classId &&
                (!sectionId || scope.sectionId === sectionId) &&
                scope.subjectId === item.subjectId,
            ),
        )
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

  function chooseExam(value: string) {
    const exam = data.exams.find((item: any) => item.id === value);
    const marksLink =
      tab === "marks" && Array.isArray(data.marksScope)
        ? data.marksScope.find((scope: any) => scope.examId === value)
        : null;
    const link = marksLink || exam?.classes?.[0];
    const nextClass = data.classes.find(
      (item: any) => item.id === link?.classId,
    );
    const nextSubject = marksLink || data.examSubjects.find(
      (item: any) => item.examId === value && item.classId === link?.classId,
    );
    setExamId(value);
    setClassId(link?.classId || "");
    setSectionId(link?.sectionId || nextClass?.sections?.[0]?.id || "");
    setSubjectId(nextSubject?.subjectId || "");
  }

  function chooseClass(value: string) {
    const marksLink =
      tab === "marks" && Array.isArray(data.marksScope)
        ? data.marksScope.find(
            (scope: any) => scope.examId === examId && scope.classId === value,
          )
        : null;
    const link = marksLink || selectedExam?.classes?.find(
      (item: any) => item.classId === value,
    );
    const nextClass = data.classes.find((item: any) => item.id === value);
    const nextSubject = marksLink || data.examSubjects.find(
      (item: any) => item.examId === examId && item.classId === value,
    );
    setClassId(value);
    setSectionId(link?.sectionId || nextClass?.sections?.[0]?.id || "");
    setSubjectId(nextSubject?.subjectId || "");
  }

  function goToTab(nextTab: Tab) {
    setTab(nextTab);
    if (
      !examId &&
      nextTab !== "overview" &&
      nextTab !== "setup" &&
      data.exams[0]
    )
      chooseExam(data.exams[0].id);
  }

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
      return payload;
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
      assignments: (exam?.classes || []).map((item: any) => ({
        classId: item.classId,
        sectionId: item.sectionId || "",
      })),
    });
    setExamModal(true);
  }
  async function createExam(event: FormEvent) {
    event.preventDefault();
    const assignments = [...examForm.assignments];
    if (
      examForm.classId &&
      !assignments.some(
        (item) =>
          item.classId === examForm.classId &&
          item.sectionId === examForm.sectionId,
      )
    )
      assignments.push({
        classId: examForm.classId,
        sectionId: examForm.sectionId,
      });
    const saved = await action(
      {
        action: editingExam ? "updateExam" : "createExam",
        ...(editingExam ? { id: editingExam.id } : {}),
        ...examForm,
        assignments,
      },
      editingExam
        ? "Exam details updated."
        : "Exam created with its class subjects.",
    );
    if (saved) {
      setExamModal(false);
      if (!editingExam && saved.id) {
        setExamId(saved.id);
        setClassId(assignments[0]?.classId || "");
        setSectionId(assignments[0]?.sectionId || "");
        setSubjectId("");
        setTab("routine");
        setMessage({
          type: "success",
          text: "Exam created. Now add the schedule for each subject.",
        });
      } else setTab("setup");
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
    const incomplete = data.roster.filter((student: any) => {
      const row = markRows[student.studentId];
      return !row?.absent && !String(row?.marks ?? "").trim();
    });
    if (incomplete.length) {
      setMessage({
        type: "error",
        text: `${incomplete.length} student mark(s) are blank. Enter marks or select Absent.`,
      });
      return;
    }
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
      { action: "verifyMarks", examId, classId, sectionId, subjectId },
      "Marks verified and locked.",
    );
  }
  async function unlockMarks() {
    const reason = window.prompt("Why are these marks being unlocked?");
    if (!reason) return;
    await action(
      {
        action: "unlockMarks",
        examId,
        classId,
        sectionId,
        subjectId,
        reason,
      },
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
          subtitle="Create exams, build routines, enter marks and publish results step by step"
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
            ["overview", BarChart3, "Quick Guide"],
            ["setup", GraduationCap, "1. Exams"],
            ["routine", CalendarDays, "2. Routine"],
            ["marks", FileSpreadsheet, "3. Marks Entry"],
            ["results", CheckCircle2, "4. Results"],
          ] as const
        ).map(([key, Icon, label]) => (
          <button
            key={key}
            onClick={() => goToTab(key)}
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
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Title icon={ClipboardList} text="How it works" />
                <p className="mt-1 text-xs text-slate-500">
                  Complete one step, then continue to the next. Click a step card to open it.
                </p>
              </div>
              {!data.exams.length && data.permissions.manage ? (
                <button className="btn-primary" onClick={() => openExam()}>
                  <Plus className="h-4 w-4" /> Get Started
                </button>
              ) : null}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {[
                { tab: "setup" as Tab, title: "Create Exam", detail: "Add a name, dates and one or more classes" },
                { tab: "routine" as Tab, title: "Build Routine", detail: "Set the date, time and room for every subject" },
                { tab: "marks" as Tab, title: "Enter & Verify Marks", detail: "Save marks, then Verify & Lock" },
                { tab: "results" as Tab, title: "Publish Results", detail: "Calculate, review and publish results" },
              ].map((item, index) => (
                <button
                  type="button"
                  key={item.title}
                  onClick={() => goToTab(item.tab)}
                  className="group rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-teal-300 hover:bg-teal-50"
                >
                  <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                    {index + 1}
                  </span>
                  <span className="flex items-center justify-between gap-2 text-xs font-bold text-slate-700">
                    {item.title}<ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600" />
                  </span>
                  <small className="mt-1 block text-[11px] leading-5 text-slate-500">{item.detail}</small>
                </button>
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
          <StepHelp
            number="2"
            title="Build the examination routine"
            detail="Select the exam, class, section and subject. Add a date and time for each subject."
          />
          <FilterBar
            data={data}
            examId={examId}
            setExamId={chooseExam}
            classId={classId}
            setClassId={chooseClass}
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
              {data.permissions.manageRoutines && (
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
                    {routinePagination.pageItems.map((row: any) => (
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
                          {data.permissions.manageRoutines ? <>
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
                          </> : <span className="text-xs text-slate-400">View only</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!loading && <TablePagination {...routinePagination} className="print:hidden" />}
          </section>
        </>
      )}

      {tab === "marks" && (
        <>
          <StepHelp
            number="3"
            title="Enter and verify marks"
            detail={
              Array.isArray(data.marksScope)
                ? "Only your assigned classes, sections and subjects are available. Enter the marks and select Save Marks."
                : "Select the four options to load students. Save Marks first; when everything is correct, select Verify & Lock."
            }
          />
          <FilterBar
            data={data}
            examId={examId}
            setExamId={chooseExam}
            classId={classId}
            setClassId={chooseClass}
            sectionId={sectionId}
            setSectionId={setSectionId}
            subjectId={subjectId}
            setSubjectId={setSubjectId}
            examClasses={examClasses}
            selectedClass={selectedClass}
            availableSubjects={availableSubjects}
            marksScope={data.marksScope}
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
                    Unlock for Correction
                    </button>
                  )}
                {data.permissions.verifyMarks && (
                  <button
                    disabled={
                      !data.roster.length ||
                      busy ||
                      data.roster.some(
                        (row: any) => row.existingMark === null,
                      ) ||
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
                    {rosterPagination.pageItems.map((student: any) => {
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
            {!loading && <TablePagination {...rosterPagination} className="print:hidden" />}
          </section>
        </>
      )}

      {tab === "results" && (
        <>
          <StepHelp
            number="4"
            title="Calculate and publish results"
            detail="After every subject is verified and locked, calculate the results. Review the list, then publish."
          />
          <FilterBar
            data={data}
            examId={examId}
            setExamId={chooseExam}
            classId={classId}
            setClassId={chooseClass}
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
                    Calculate Results
                  </button>
                )}
                {data.permissions.publish && selectedExam && (
                  <button
                    disabled={!data.results.length || busy}
                    onClick={() => publish(!selectedResultPublished)}
                    className="btn-primary"
                  >
                    {selectedResultPublished
                      ? "Unpublish Results"
                      : "Publish Results"}
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
                    {resultPagination.pageItems.map((row: any) => (
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
            {!loading && <TablePagination {...resultPagination} className="print:hidden" />}
          </section>
        </>
      )}

      {examModal && (
        <Modal
          title={editingExam ? "Edit Examination" : "Create Examination"}
          subtitle={
            editingExam
              ? "Update the name and dates, or add more classes if needed."
              : "Add one or more classes and sections. Subjects are attached automatically."
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
              <div className="md:col-span-2 xl:col-span-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-700">Selected classes and sections</p>
                    <p className="mt-1 text-[11px] text-slate-500">Choose a class and section above, then select Add.</p>
                  </div>
                  <button
                    type="button"
                    disabled={!examForm.classId}
                    onClick={() => {
                      if (
                        examForm.assignments.some(
                          (item) =>
                            item.classId === examForm.classId &&
                            item.sectionId === examForm.sectionId,
                        )
                      )
                        return;
                      setExamForm({
                        ...examForm,
                        assignments: [
                          ...examForm.assignments,
                          {
                            classId: examForm.classId,
                            sectionId: examForm.sectionId,
                          },
                        ],
                      });
                    }}
                    className="btn-secondary"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {examForm.assignments.length ? (
                    examForm.assignments.map((assignment, index) => {
                      const assignedClass = data.classes.find(
                        (item: any) => item.id === assignment.classId,
                      );
                      const assignedSection = assignedClass?.sections.find(
                        (item: any) => item.id === assignment.sectionId,
                      );
                      return (
                        <span
                          key={`${assignment.classId}-${assignment.sectionId}-${index}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                          {assignedClass?.name || "Class"} · {assignedSection?.name || "All sections"}
                          {!editingExam ? (
                            <button
                              type="button"
                              aria-label="Remove class"
                              onClick={() =>
                                setExamForm({
                                  ...examForm,
                                  assignments: examForm.assignments.filter(
                                    (_, itemIndex) => itemIndex !== index,
                                  ),
                                })
                              }
                              className="text-rose-500 hover:text-rose-700"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          ) : null}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xs text-slate-400">The current selection will be added when you save.</span>
                  )}
                </div>
              </div>
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
  marksScope = null,
  hideSubject = false,
}: any) {
  const scopedLinks = Array.isArray(marksScope)
    ? marksScope.filter((item: any) => item.examId === examId)
    : examClasses;
  const linkedClassIds = new Set(scopedLinks.map((item: any) => item.classId));
  const classLinks = scopedLinks.filter(
    (item: any) => item.classId === classId,
  );
  const allowsAllSections = classLinks.some((item: any) => !item.sectionId);
  const linkedSectionIds = new Set(
    classLinks.flatMap((item: any) =>
      item.sectionId ? [item.sectionId] : [],
    ),
  );
  return (
    <div
      className={`grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm print:hidden ${hideSubject ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4"}`}
    >
      <Select
        label="Examination"
        value={examId}
        change={setExamId}
        options={data.exams
          .filter(
            (item: any) =>
              !Array.isArray(marksScope) ||
              marksScope.some((scope: any) => scope.examId === item.id),
          )
          .map((item: any) => ({
          value: item.id,
          label: item.name,
          }))}
        placeholder="Select examination"
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
        options={(selectedClass?.sections || [])
          .filter(
            (item: any) =>
              allowsAllSections || linkedSectionIds.has(item.id),
          )
          .map((item: any) => ({
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
          options={availableSubjects
            .filter(
              (item: any) =>
                !Array.isArray(marksScope) ||
                marksScope.some(
                  (scope: any) =>
                    scope.examId === examId &&
                    scope.classId === classId &&
                    scope.sectionId === sectionId &&
                    scope.subjectId === item.subjectId,
                ),
            )
            .map((item: any) => ({
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
  const pagination = usePagination<any>(data.exams);
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
              {pagination.pageItems.map((exam: any) => (
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
      <TablePagination {...pagination} className="mt-4 print:hidden" />
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
function StepHelp({
  number,
  title,
  detail,
}: {
  number: string;
  title: string;
  detail: string;
}) {
  return (
    <section className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 print:hidden">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
        {number}
      </span>
      <div>
        <h2 className="text-sm font-bold text-teal-950">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-teal-800">{detail}</p>
      </div>
    </section>
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
