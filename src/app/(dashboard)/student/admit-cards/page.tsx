import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CreditCard,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import prisma from "@/src/lib/db/prisma";
import { getCurrentSession } from "@/src/lib/auth/session";
import { AdmitCardActions } from "@/src/components/student/AdmitCardActions";
import { ExamRoutineSelector } from "@/src/components/student/ExamRoutineSelector";
import { formatCurrency } from "@/src/lib/utils";

const displayDate = (value: Date) =>
  value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default async function StudentAdmitCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ examId?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect("/login");
  const student = await prisma.student.findFirst({
    where: { userId: session.id, schoolId: session.schoolId, status: "ACTIVE" },
    include: {
      school: true,
      class: true,
      section: true,
      enrollments: {
        where: { enrollmentStatus: "ACTIVE" },
        include: { academicYear: true, class: true, section: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  if (!student)
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        This account is not linked to a student profile.
      </div>
    );
  const enrollment = student.enrollments[0];
  const classId = enrollment?.classId || student.classId;
  const sectionId = enrollment?.sectionId || student.sectionId;
  const routines = classId
    ? await prisma.examRoutine.findMany({
        where: {
          schoolId: student.schoolId,
          classId,
          status: "PUBLISHED",
          ...(sectionId ? { OR: [{ sectionId }, { sectionId: null }] } : {}),
        },
        orderBy: [{ examDate: "asc" }, { startTime: "asc" }],
      })
    : [];
  const examIds = [...new Set(routines.map((item) => item.examId))];
  const subjectIds = [...new Set(routines.map((item) => item.subjectId))];
  const roomIds = [
    ...new Set(routines.map((item) => item.roomId).filter(Boolean)),
  ] as string[];
  const examFeeTypes = await prisma.feeType.findMany({
    where: { schoolId: student.schoolId, category: "EXAM" },
    select: { id: true },
  });
  const examStructureLinks = await prisma.feeStructureItem.findMany({
    where: {
      feeTypeId: { in: examFeeTypes.map((item) => item.id) },
      feeStructure: { schoolId: student.schoolId },
    },
    select: { feeStructureId: true },
  });
  const namedExamStructures = await prisma.feeStructure.findMany({
    where: { schoolId: student.schoolId, name: { contains: "Exam" } },
    select: { id: true },
  });
  const examStructureIds = [
    ...new Set([
      ...examStructureLinks.map((item) => item.feeStructureId),
      ...namedExamStructures.map((item) => item.id),
    ]),
  ];
  const [exams, subjects, rooms, cards, examFeeInvoices] = await Promise.all([
    prisma.exam.findMany({
      where: { schoolId: student.schoolId, id: { in: examIds } },
      orderBy: { startDate: "asc" },
    }),
    prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { id: true, nameEn: true },
    }),
    prisma.room.findMany({
      where: { id: { in: roomIds } },
      select: { id: true, name: true },
    }),
    prisma.admitCard.findMany({
      where: {
        schoolId: student.schoolId,
        studentId: student.id,
        examId: { in: examIds },
      },
    }),
    prisma.feeInvoice.findMany({
      where: {
        schoolId: student.schoolId,
        studentId: student.id,
        feeStructureId: { in: examStructureIds },
        status: { not: "CANCELLED" },
      },
      select: { amount: true, discount: true, paidAmount: true },
    }),
  ]);
  const subjectMap = new Map(subjects.map((item) => [item.id, item.nameEn]));
  const roomMap = new Map(rooms.map((item) => [item.id, item.name]));
  const cardMap = new Map(cards.map((item) => [item.examId, item]));
  const requestedExamId = (await searchParams).examId;
  const selectedExam =
    exams.find((exam) => exam.id === requestedExamId) || exams[0];
  const visibleExams = selectedExam ? [selectedExam] : [];
  const examFeeDue = examFeeInvoices.reduce(
    (sum, invoice) =>
      sum +
      Math.max(
        0,
        Number(invoice.amount) -
          Number(invoice.discount) -
          Number(invoice.paidAmount),
      ),
    0,
  );
  const className =
    enrollment?.class.name || student.class?.name || "Not assigned";
  const sectionName =
    enrollment?.section.name || student.section?.name || "Not assigned";
  const roll = enrollment?.rollNumber || student.rollNumber;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link
          href="/student/profile"
          className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-teal-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          My Profile
        </Link>
        <h1 className="flex items-center gap-2 text-2xl font-black text-slate-900">
          <CreditCard className="h-6 w-6 text-teal-700" />
          My Admit Cards
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          View and download admit cards prepared from your published examination
          schedule.
        </p>
      </div>
      {exams.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="max-w-xl">
            <ExamRoutineSelector
              basePath="/student/admit-cards"
              exams={exams.map(({ id, name, term, year }) => ({
                id,
                name,
                term,
                year,
              }))}
              selectedExamId={selectedExam?.id || ""}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Select an examination to view and download only that examination
            admit card.
          </p>
        </section>
      )}
      {examFeeDue > 0 && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <strong>Admit card download is locked.</strong> Outstanding exam
            fee: {formatCurrency(examFeeDue)}
          </span>
          <Link href="/student/payments" className="btn-secondary bg-white">
            View payments
          </Link>
        </div>
      )}
      {!visibleExams.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
          No published examination is currently available for your class.
        </div>
      ) : (
        <div className="space-y-8">
          {visibleExams.map((exam) => {
            const schedule = routines.filter((item) => item.examId === exam.id);
            const saved = cardMap.get(exam.id);
            const cardNumber =
              saved?.admitCardNumber ||
              `PORTAL-${exam.year}-${student.studentCode}`;
            const targetId = `admit-card-${exam.id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
            const actionSchedule = schedule.map((item) => ({
              date: displayDate(item.examDate),
              subject: subjectMap.get(item.subjectId) || "Subject",
              time: `${item.startTime}–${item.endTime}`,
              room: item.roomId
                ? roomMap.get(item.roomId) || "Room not set"
                : "Room not set",
              marks: String(Number(item.totalMarks)),
            }));
            return (
              <section
                key={exam.id}
                className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      Admit card
                    </p>
                    <h2 className="mt-1 font-black text-slate-900">
                      {exam.name}
                    </h2>
                  </div>
                  <AdmitCardActions
                    targetId={targetId}
                    disabled={examFeeDue > 0}
                    fileName={`${student.studentCode}-${exam.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-admit-card.pdf`}
                    schoolName={student.school.name}
                    examName={exam.name}
                    studentName={student.nameEn}
                    studentId={student.studentCode}
                    admissionNumber={student.admissionNumber}
                    admitCardNumber={cardNumber}
                    classSection={`${className} / ${sectionName}`}
                    roll={String(roll || "—")}
                    academicYear={
                      enrollment?.academicYear.name || String(exam.year)
                    }
                    feeClearance={
                      examFeeDue > 0
                        ? `Due ${formatCurrency(examFeeDue)}`
                        : "Cleared"
                    }
                    schedule={actionSchedule}
                  />
                </div>
                <div id={targetId} className="bg-white">
                  <div className="border-b border-teal-700 p-7 text-center">
                    <p className="text-xs font-semibold text-slate-500">
                      {student.school.name}
                    </p>
                    <h3 className="mt-2 text-xl font-black uppercase tracking-wider text-teal-800">
                      Examination Admit Card
                    </h3>
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {exam.name}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Published schedule
                    </span>
                  </div>
                  <div className="grid gap-x-8 gap-y-3 p-6 text-xs sm:grid-cols-2">
                    <Detail label="Student name" value={student.nameEn} />
                    <Detail label="Student ID" value={student.studentCode} />
                    <Detail
                      label="Admission no."
                      value={student.admissionNumber}
                    />
                    <Detail label="Admit card no." value={cardNumber} />
                    <Detail
                      label="Class / Section"
                      value={`${className} / ${sectionName}`}
                    />
                    <Detail label="Roll" value={String(roll || "—")} />
                    <Detail
                      label="Academic year"
                      value={enrollment?.academicYear.name || String(exam.year)}
                    />
                    <Detail
                      label="Fee clearance"
                      value={
                        examFeeDue > 0
                          ? `Due ${formatCurrency(examFeeDue)}`
                          : "Cleared"
                      }
                    />
                  </div>
                  <div className="overflow-x-auto border-t border-slate-200">
                    <table className="table-base min-w-[700px]">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Subject</th>
                          <th>Time</th>
                          <th>Room</th>
                          <th>Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((item) => (
                          <tr key={item.id}>
                            <td className="font-bold">
                              {displayDate(item.examDate)}
                            </td>
                            <td>
                              {subjectMap.get(item.subjectId) || "Subject"}
                            </td>
                            <td>
                              {item.startTime}–{item.endTime}
                            </td>
                            <td>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {item.roomId
                                  ? roomMap.get(item.roomId) || "Not set"
                                  : "Not set"}
                              </span>
                            </td>
                            <td>{Number(item.totalMarks)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    Bring this admit card and arrive at least 30 minutes before
                    the examination.
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 border-b border-slate-100 py-2">
      <span className="font-semibold text-slate-500">{label}</span>
      <strong className="text-slate-900">{value}</strong>
    </div>
  );
}
