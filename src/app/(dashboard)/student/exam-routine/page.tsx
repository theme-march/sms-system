import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarClock, Clock3, FileText, MapPin } from "lucide-react";
import prisma from "@/src/lib/db/prisma";
import { getCurrentSession } from "@/src/lib/auth/session";
import { StudentDocumentActions } from "@/src/components/student/StudentDocumentActions";
import { ExamRoutineSelector } from "@/src/components/student/ExamRoutineSelector";

const date = (value: Date) => value.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default async function StudentExamRoutinePage({ searchParams }: { searchParams: Promise<{ examId?: string }> }) {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect("/login");
  const student = await prisma.student.findFirst({
    where: { userId: session.id, schoolId: session.schoolId, status: "ACTIVE" },
    include: {
      class: true,
      section: true,
      school: true,
      enrollments: { where: { enrollmentStatus: "ACTIVE" }, include: { academicYear: true, class: true, section: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!student) return <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">This account is not linked to a student profile.</div>;

  const enrollment = student.enrollments[0];
  const classId = enrollment?.classId || student.classId;
  const sectionId = enrollment?.sectionId || student.sectionId;
  const allRoutines = classId ? await prisma.examRoutine.findMany({
    where: { schoolId: student.schoolId, classId, status: "PUBLISHED", ...(sectionId ? { OR: [{ sectionId }, { sectionId: null }] } : {}) },
    orderBy: [{ examDate: "asc" }, { startTime: "asc" }],
  }) : [];
  const examIds = [...new Set(allRoutines.map((item) => item.examId))];
  const exams = await prisma.exam.findMany({
    where: { schoolId: student.schoolId, id: { in: examIds } },
    select: { id: true, name: true, term: true, year: true, startDate: true },
    orderBy: [{ year: "desc" }, { startDate: "desc" }],
  });
  const requestedExamId = (await searchParams).examId;
  const selectedExam = exams.find((exam) => exam.id === requestedExamId) || exams[0];
  const routines = selectedExam ? allRoutines.filter((item) => item.examId === selectedExam.id) : [];
  const subjectIds = [...new Set(routines.map((item) => item.subjectId))];
  const roomIds = [...new Set(routines.map((item) => item.roomId).filter(Boolean))] as string[];
  const [subjects, rooms] = await Promise.all([
    prisma.subject.findMany({ where: { id: { in: subjectIds } }, select: { id: true, nameEn: true, code: true } }),
    prisma.room.findMany({ where: { id: { in: roomIds } }, select: { id: true, name: true } }),
  ]);
  const subjectMap = new Map(subjects.map((item) => [item.id, item]));
  const roomMap = new Map(rooms.map((item) => [item.id, item.name]));
  const className = enrollment?.class.name || student.class?.name || "Not assigned";
  const sectionName = enrollment?.section.name || student.section?.name || "Not assigned";
  const examName = selectedExam?.name || "Exam Routine";
  const pdfLines = [
    student.school.name,
    examName,
    `Student: ${student.nameEn} | ID: ${student.studentCode}`,
    `Class: ${className} | Section: ${sectionName}`,
    "",
    ...routines.map((item) => `${date(item.examDate)} | ${item.startTime}-${item.endTime} | ${subjectMap.get(item.subjectId)?.nameEn || "Subject"} | ${item.roomId ? roomMap.get(item.roomId) || "Room not set" : "Room not set"}`),
  ];
  const safeExamName = examName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();

  return <div className="mx-auto max-w-6xl space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Link href="/student/profile" className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-teal-700"><ArrowLeft className="h-3.5 w-3.5" />My Profile</Link><h1 className="flex items-center gap-2 text-2xl font-black text-slate-900"><CalendarClock className="h-6 w-6 text-teal-700" />My Exam Routine</h1><p className="mt-1 text-xs text-slate-500">Published examination schedule for {className} · {sectionName}</p></div>{selectedExam && <StudentDocumentActions title={`${examName} - Exam Routine`} fileName={`${student.studentCode}-${safeExamName}-routine.pdf`} lines={pdfLines} />}</div>

    {exams.length > 0 && <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"><div className="max-w-xl"><ExamRoutineSelector exams={exams.map(({ id, name, term, year }) => ({ id, name, term, year }))} selectedExamId={selectedExam?.id || ""} /></div><p className="mt-2 text-[11px] text-slate-500">Select an examination to view and download only that examination routine.</p></section>}

    {!selectedExam || !routines.length ? <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No published exam routine is available for the selected examination.</div> : <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs"><div className="border-b border-slate-100 bg-slate-50 px-5 py-4"><p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Selected examination</p><h2 className="mt-1 text-base font-black text-slate-900">{selectedExam.name}</h2></div><div className="overflow-x-auto"><table className="table-base min-w-[850px]"><thead><tr><th>Date</th><th>Examination</th><th>Subject</th><th>Time</th><th>Duration</th><th>Room</th><th>Marks</th></tr></thead><tbody>{routines.map((item) => <tr key={item.id}><td className="font-bold text-teal-700">{date(item.examDate)}</td><td><p className="font-bold">{selectedExam.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.instructions || "Follow school examination rules"}</p></td><td><span className="inline-flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 text-teal-600" />{subjectMap.get(item.subjectId)?.nameEn || "Subject"}</span></td><td><span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" />{item.startTime}–{item.endTime}</span></td><td>{item.durationMinutes} min</td><td><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{item.roomId ? roomMap.get(item.roomId) || "Not set" : "Not set"}</span></td><td>{Number(item.totalMarks)}</td></tr>)}</tbody></table></div></section>}
  </div>;
}
