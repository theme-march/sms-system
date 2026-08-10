import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarCheck2 } from "lucide-react";
import prisma from "@/src/lib/db/prisma";
import { getCurrentSession } from "@/src/lib/auth/session";
import { DatabaseEmptyState } from "@/src/components/ui/DatabaseEmptyState";

export default async function GuardianAttendancePage() {
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
  if (!guardian) redirect("/guardian");

  const wards = await Promise.all(
    guardian.students.map(async ({ student }) => {
      const rows = await prisma.studentAttendanceRecord.findMany({
        where: { schoolId: guardian.schoolId, studentId: student.id },
        select: { date: true, status: true, remarks: true },
        orderBy: { date: "desc" },
        take: 365,
      });
      const priority: Record<string, number> = {
        present: 4,
        late: 3,
        leave: 2,
        absent: 1,
        holiday: 0,
      };
      const byDate = new Map<
        string,
        { date: Date; status: string; remarks: string | null }
      >();
      for (const row of rows) {
        const key = row.date.toISOString().slice(0, 10);
        const current = byDate.get(key);
        if (
          !current ||
          (priority[row.status.toLowerCase()] ?? -1) >
            (priority[current.status.toLowerCase()] ?? -1)
        ) {
          byDate.set(key, row);
        }
      }
      const records = [...byDate.values()].sort(
        (first, second) => second.date.getTime() - first.date.getTime(),
      );
      const counted = records.filter(
        (record) => record.status.toLowerCase() !== "holiday",
      );
      const presentDays = counted.filter((record) =>
        ["present", "late"].includes(record.status.toLowerCase()),
      ).length;
      const missingDays = counted.filter(
        (record) => record.status.toLowerCase() === "absent",
      ).length;
      const enrollment = student.enrollments[0];
      return {
        student,
        records,
        presentDays,
        missingDays,
        attendance: counted.length ? (presentDays / counted.length) * 100 : null,
        className: enrollment?.class.name || student.class?.name || "No class",
        sectionName:
          enrollment?.section.name || student.section?.name || "No section",
      };
    }),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link href="/guardian" className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-teal-700"><ArrowLeft className="h-3.5 w-3.5" />Dashboard</Link>
          <h1 className="flex items-center gap-2 text-2xl font-black text-slate-900"><CalendarCheck2 className="h-6 w-6 text-teal-700" />Attendance Details</h1>
          <p className="mt-1 text-xs text-slate-500">Day-by-day attendance for your linked children</p>
        </div>
      </div>

      {!wards.length ? (
        <DatabaseEmptyState title="No linked students" description="No student is linked to this guardian account." />
      ) : (
        <div className="space-y-5">
          {wards.map(({ student, records, presentDays, missingDays, attendance, className, sectionName }) => (
            <section key={student.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="dashboard-hero flex flex-col justify-between gap-4 p-5 text-white sm:flex-row sm:items-center">
                <div><p className="font-black">{student.nameEn}</p><p className="dashboard-hero-muted mt-1 text-xs">{student.studentCode} · {className} · {sectionName} · Roll {student.rollNumber ?? "—"}</p></div>
                <div className="flex flex-wrap gap-2 text-xs"><span className="dashboard-hero-panel rounded-lg px-3 py-2 font-bold">Attendance {attendance === null ? "No records" : `${attendance.toFixed(1)}%`}</span><span className="rounded-lg bg-emerald-50 px-3 py-2 font-bold text-emerald-700">Present {presentDays} days</span><span className="rounded-lg bg-rose-50 px-3 py-2 font-bold text-rose-700">Missing {missingDays} days</span></div>
              </div>
              {!records.length ? <p className="p-10 text-center text-xs text-slate-500">No attendance records available.</p> : <div className="max-h-[560px] overflow-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="sticky top-0 bg-slate-50 text-slate-500"><tr><th className="p-3">Date</th><th className="p-3">Day</th><th className="p-3">Status</th><th className="p-3">Remarks</th></tr></thead><tbody className="divide-y divide-slate-100">{records.map((record) => <tr key={record.date.toISOString()} className="hover:bg-slate-50"><td className="p-3 font-semibold">{record.date.toLocaleDateString("en-GB")}</td><td className="p-3">{record.date.toLocaleDateString("en-GB", { weekday: "long" })}</td><td className="p-3"><AttendanceBadge status={record.status} /></td><td className="p-3 text-slate-500">{record.remarks || "—"}</td></tr>)}</tbody></table></div>}
            </section>
          ))}
        </div>
      )}
    </div>
  );
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
