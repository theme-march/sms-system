import {
  BookOpen,
  CalendarCheck2,
  ClipboardList,
  Download,
  Eye,
  GraduationCap,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/src/lib/db/prisma";
import { getCurrentSession } from "@/src/lib/auth/session";
import { DatabaseEmptyState } from "@/src/components/ui/DatabaseEmptyState";
import { formatCurrency } from "@/src/lib/utils";
import { PortalFees } from "@/src/components/fees/PortalFees";
import {
  getPortalDownloads,
  normalizeWebsiteContent,
} from "@/src/lib/website-content";

export default async function GuardianPortalDashboard() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect("/login");

  const guardian = await prisma.guardian.findFirst({
    where: {
      userId: session.id,
      schoolId: session.schoolId,
      status: "ACTIVE",
      portalAccessEnabled: true,
    },
    include: {
      school: { include: { websiteSettings: true } },
      students: {
        where: { status: "ACTIVE" },
        include: {
          student: {
            include: {
              class: true,
              section: true,
              enrollments: {
                where: { enrollmentStatus: "ACTIVE" },
                include: { class: true, section: true },
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!guardian) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 pt-10">
        <div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs font-semibold text-teal-900">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          Guardian portal access is isolated to linked students.
        </div>
        <DatabaseEmptyState
          title={`Welcome, ${session.name}`}
          description="This login is not linked to a guardian profile. Ask the School Admin to link it from Guardians Directory."
        />
      </div>
    );
  }

  const websiteDownloads = normalizeWebsiteContent(
    guardian.school.websiteSettings?.content,
  ).downloads;
  const wards = await Promise.all(
    guardian.students.map(async ({ student }) => {
      const enrollment = student.enrollments[0];
      const classId = enrollment?.classId || student.classId;
      const sectionId = enrollment?.sectionId || student.sectionId;
      const [attendanceRows, fees, homeworks] = await Promise.all([
        prisma.studentAttendanceRecord.findMany({
          where: { schoolId: guardian.schoolId, studentId: student.id },
          select: { date: true, status: true, remarks: true },
          orderBy: { date: "desc" },
          take: 180,
        }),
        prisma.feeInvoice.aggregate({
          where: { schoolId: guardian.schoolId, studentId: student.id },
          _sum: { amount: true, discount: true, paidAmount: true },
        }),
        classId && sectionId
          ? prisma.homework.findMany({
              where: {
                classId,
                sectionId,
                dueDate: { gte: new Date() },
              },
              include: { subject: true },
              orderBy: { dueDate: "asc" },
              take: 6,
            })
          : Promise.resolve([]),
      ]);
      const priority: Record<string, number> = {
        present: 4,
        late: 3,
        leave: 2,
        absent: 1,
        holiday: 0,
      };
      const attendanceByDate = new Map<
        string,
        { date: Date; status: string; remarks: string | null }
      >();
      for (const row of attendanceRows) {
        const key = row.date.toISOString().slice(0, 10);
        const current = attendanceByDate.get(key);
        if (
          !current ||
          (priority[row.status.toLowerCase()] ?? -1) >
            (priority[current.status.toLowerCase()] ?? -1)
        ) {
          attendanceByDate.set(key, row);
        }
      }
      const attendanceRecords = [...attendanceByDate.values()].sort(
        (first, second) => second.date.getTime() - first.date.getTime(),
      );
      const attendanceDays = attendanceRecords.filter(
        (item) => item.status.toLowerCase() !== "holiday",
      );
      const presentDays = attendanceDays.filter((item) =>
        ["present", "late"].includes(item.status.toLowerCase()),
      ).length;
      const missingDays = attendanceDays.filter(
        (item) => item.status.toLowerCase() === "absent",
      ).length;
      const due = Math.max(
        0,
        Number(fees._sum.amount || 0) -
          Number(fees._sum.discount || 0) -
          Number(fees._sum.paidAmount || 0),
      );
      return {
        student,
        attendance: attendanceDays.length
          ? (presentDays / attendanceDays.length) * 100
          : null,
        attendanceRecords,
        presentDays,
        missingDays,
        due,
        className: enrollment?.class.name || student.class?.name || "No class",
        sectionName:
          enrollment?.section.name || student.section?.name || "No section",
        syllabusDownloads: getPortalDownloads(
          websiteDownloads,
          classId,
          sectionId,
        ),
        homeworks,
      };
    }),
  );
  const attendanceValues = wards.flatMap((ward) =>
    ward.attendance === null ? [] : [ward.attendance],
  );
  const averageAttendance = attendanceValues.length
    ? attendanceValues.reduce((sum, value) => sum + value, 0) /
      attendanceValues.length
    : null;
  const totalDue = wards.reduce((sum, ward) => sum + ward.due, 0);
  const totalDownloads = wards.reduce(
    (sum, ward) => sum + ward.syllabusDownloads.length,
    0,
  );
  const totalHomework = wards.reduce(
    (sum, ward) => sum + ward.homeworks.length,
    0,
  );

  return (
    <div className="space-y-6">
      <section className="dashboard-hero overflow-hidden rounded-2xl text-white shadow-sm">
        <div className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="dashboard-hero-panel flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black">
              {guardian.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="dashboard-hero-muted text-[10px] font-bold uppercase tracking-[0.2em]">Parent / Guardian Portal</p>
              <h1 className="mt-1 text-xl font-black sm:text-2xl">Welcome, {guardian.name}</h1>
              <p className="dashboard-hero-muted mt-1 text-xs">{guardian.relationship} · {guardian.phone} · {guardian.school.name}</p>
            </div>
          </div>
          <Link href="/guardian/profile" className="dashboard-hero-panel inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-bold"><UserRound className="h-4 w-4" />My Profile</Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={GraduationCap} label="Linked children" value={String(wards.length)} detail="Students connected to your account" />
        <Metric icon={CalendarCheck2} label="Average attendance" value={averageAttendance === null ? "No records" : `${averageAttendance.toFixed(1)}%`} detail="Across all linked children" />
        <Metric icon={ClipboardList} label="Upcoming homework" value={String(totalHomework)} detail="Assigned work still due" />
        <Metric icon={WalletCards} label="Total outstanding" value={formatCurrency(totalDue)} detail={`${totalDownloads} published files available`} />
      </div>

      <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <QuickLink href="#children" icon={GraduationCap} label="My Children" />
        <QuickLink href="#attendance" icon={CalendarCheck2} label="Attendance" />
        <QuickLink href="#homework" icon={ClipboardList} label="Homework" />
        <QuickLink href="#syllabus" icon={BookOpen} label="Files & Syllabus" />
        <QuickLink href="#fees" icon={WalletCards} label="Fees & Receipts" />
      </section>

      <section id="children" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold">
          <GraduationCap className="h-4 w-4 text-teal-600" />
          Linked students
        </h2>
        {!wards.length ? (
          <DatabaseEmptyState
            title="No linked students"
            description="Student-guardian relationships created by the School Admin will appear here."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {wards.map(({ student, attendance, due, className, sectionName }) => (
              <article
                key={student.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <h3 className="font-bold">{student.nameEn}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {student.studentCode} · {className} · {sectionName} · Roll{" "}
                  {student.rollNumber ?? "—"}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-slate-400">Attendance</p>
                    <p className="mt-1 font-bold">
                      {attendance === null
                        ? "No records"
                        : `${attendance.toFixed(1)}%`}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-slate-400">Outstanding</p>
                    <p className="mt-1 font-bold">{formatCurrency(due)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {!!wards.length && (
        <section id="attendance" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold"><CalendarCheck2 className="h-4 w-4 text-teal-600" />Attendance Details</h2>
          <p className="mt-1 text-xs text-slate-500">Day-by-day attendance for your linked children</p>
          <div className="mt-4 space-y-5">
            {wards.map(({ student, className, sectionName, attendanceRecords, presentDays, missingDays }) => (
              <article key={`attendance-${student.id}`} className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex flex-col justify-between gap-3 bg-slate-50 p-4 sm:flex-row sm:items-center">
                  <div><h3 className="font-bold text-slate-900">{student.nameEn}</h3><p className="mt-1 text-xs text-slate-500">{className} · {sectionName}</p></div>
                  <div className="flex gap-2 text-xs"><span className="rounded-lg bg-emerald-50 px-3 py-2 font-bold text-emerald-700">Present {presentDays} days</span><span className="rounded-lg bg-rose-50 px-3 py-2 font-bold text-rose-700">Missing {missingDays} days</span></div>
                </div>
                {!attendanceRecords.length ? <p className="p-8 text-center text-xs text-slate-500">No attendance records available.</p> : <div className="max-h-96 overflow-auto"><table className="w-full min-w-[560px] text-left text-xs"><thead className="sticky top-0 bg-white text-slate-500"><tr><th className="p-3">Date</th><th className="p-3">Day</th><th className="p-3">Status</th><th className="p-3">Remarks</th></tr></thead><tbody className="divide-y divide-slate-100">{attendanceRecords.map((record) => <tr key={record.date.toISOString()}><td className="p-3 font-semibold">{record.date.toLocaleDateString("en-GB")}</td><td className="p-3">{record.date.toLocaleDateString("en-GB", { weekday: "long" })}</td><td className="p-3"><AttendanceBadge status={record.status} /></td><td className="p-3 text-slate-500">{record.remarks || "—"}</td></tr>)}</tbody></table></div>}
              </article>
            ))}
          </div>
        </section>
      )}

      {!!wards.length && (
        <section id="homework" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold"><ClipboardList className="h-4 w-4 text-teal-600" />Upcoming Homework</h2>
          <p className="mt-1 text-xs text-slate-500">Homework assigned to your linked children</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {wards.map(({ student, className, sectionName, homeworks }) => (
              <article key={`homework-${student.id}`} className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold text-slate-900">{student.nameEn}</h3>
                <p className="mt-1 text-xs text-slate-500">{className} · {sectionName}</p>
                {!homeworks.length ? <p className="mt-4 rounded-lg bg-slate-50 p-5 text-center text-xs text-slate-500">No upcoming homework.</p> : <div className="mt-3 divide-y divide-slate-100">{homeworks.map((item) => <div key={item.id} className="py-3"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-slate-900">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.subject.nameEn}</p></div><span className="shrink-0 rounded-lg bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700">Due {item.dueDate.toLocaleDateString("en-GB")}</span></div><p className="mt-2 line-clamp-2 text-[11px] text-slate-500">{item.description}</p></div>)}</div>}
              </article>
            ))}
          </div>
        </section>
      )}

      {!!wards.length && (
        <section id="syllabus" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <BookOpen className="h-4 w-4 text-teal-600" />
            My Syllabus
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Files published by the school for your linked students
          </p>
          <div className="mt-4 space-y-4">
            {wards.map(
              ({
                student,
                className,
                sectionName,
                syllabusDownloads,
              }) => (
                <article
                  key={`syllabus-${student.id}`}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <h3 className="font-bold text-slate-900">
                    {student.nameEn}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {student.studentCode} · {className} · {sectionName}
                  </p>
                  {!syllabusDownloads.length ? (
                    <p className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-xs text-slate-500">
                      No file has been uploaded for this class and section.
                    </p>
                  ) : (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {syllabusDownloads.map((item, index) => (
                        <div
                          key={`${item.fileUrl}-${index}`}
                          className="rounded-lg bg-slate-50 p-4"
                        >
                          <p className="font-bold text-slate-900">
                            {item.title}
                          </p>
                          <span className="mt-2 inline-flex rounded-full bg-teal-50 px-2 py-1 text-[9px] font-black text-teal-700">
                            {item.category}
                          </span>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {item.publishedAt
                              ? `Published ${new Date(item.publishedAt).toLocaleDateString("en-GB")}`
                              : `${className} syllabus`}
                          </p>
                          <div className="mt-3 flex gap-2">
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-secondary"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </a>
                            <a
                              href={item.fileUrl}
                              download
                              className="btn-primary"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ),
            )}
          </div>
        </section>
      )}

      <section id="fees" className="scroll-mt-24 space-y-5">
        {wards.map(({ student }) => (
          <PortalFees
            key={`fees-${student.id}`}
            studentId={student.id}
            studentName={student.nameEn}
          />
        ))}
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof BookOpen; label: string; value: string; detail: string }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-xl font-black text-slate-900">{value}</p></div><span className="rounded-lg bg-teal-50 p-2 text-teal-700"><Icon className="h-4 w-4" /></span></div><p className="mt-2 text-[11px] text-slate-500">{detail}</p></article>;
}

function QuickLink({ href, icon: Icon, label }: { href: string; icon: typeof BookOpen; label: string }) {
  return <a href={href} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-800 transition hover:border-teal-200 hover:bg-teal-50"><Icon className="h-4 w-4 text-teal-700" />{label}</a>;
}

function AttendanceBadge({ status }: { status: string }) {
  const value = status.toLowerCase();
  const style = value === "present"
    ? "bg-emerald-50 text-emerald-700"
    : value === "late"
      ? "bg-amber-50 text-amber-700"
      : value === "leave"
        ? "bg-blue-50 text-blue-700"
        : value === "absent"
          ? "bg-rose-50 text-rose-700"
          : "bg-slate-100 text-slate-600";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${style}`}>{value}</span>;
}
