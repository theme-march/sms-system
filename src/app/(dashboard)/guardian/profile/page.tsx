import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import prisma from "@/src/lib/db/prisma";
import { getCurrentSession } from "@/src/lib/auth/session";

export default async function GuardianProfilePage() {
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
      school: { select: { name: true } },
      students: {
        where: { status: "ACTIVE" },
        include: { student: { include: { class: true, section: true } } },
      },
    },
  });
  if (!guardian) redirect("/guardian");

  const initials = guardian.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Guardian account</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">My Profile</h1>
        </div>
        <Link href="/guardian" className="btn-secondary"><ArrowLeft className="h-4 w-4" />Dashboard</Link>
      </div>

      <section className="dashboard-hero flex flex-col gap-5 rounded-2xl p-6 text-white sm:flex-row sm:items-center">
        <div className="dashboard-hero-panel flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black">{initials || "G"}</div>
        <div>
          <p className="dashboard-hero-muted text-[10px] font-bold uppercase tracking-[0.2em]">Parent / Guardian</p>
          <h2 className="mt-1 text-2xl font-black">{guardian.name}</h2>
          <p className="dashboard-hero-muted mt-2 text-xs">{guardian.relationship} · {guardian.school.name}</p>
        </div>
        <ShieldCheck className="dashboard-hero-muted ml-auto hidden h-8 w-8 sm:block" />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <ProfileCard icon={Phone} title="Contact information" rows={[
          ["Primary phone", guardian.phone],
          ["Alternate phone", guardian.alternatePhone || "Not provided"],
          ["Email", guardian.email || "Not provided"],
        ]} />
        <ProfileCard icon={UserRound} title="Personal information" rows={[
          ["Relationship", guardian.relationship],
          ["Occupation", guardian.occupation || "Not provided"],
          ["National ID", guardian.nationalId || "Not provided"],
        ]} />
        <ProfileCard icon={MapPin} title="Address" rows={[["Current address", guardian.address || "Not provided"]]} />
        <ProfileCard icon={BriefcaseBusiness} title="Portal access" rows={[
          ["Account status", "Active"],
          ["Linked children", String(guardian.students.length)],
          ["Access", "Student records, homework, files and fees"],
        ]} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><ShieldCheck className="h-4 w-4 text-teal-600" />Linked children</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{guardian.students.map(({ student }) => <article key={student.id} className="rounded-xl bg-slate-50 p-4"><p className="font-bold text-slate-900">{student.nameEn}</p><p className="mt-1 text-xs text-slate-500">{student.studentCode} · {student.class?.name || "No class"} · {student.section?.name || "No section"} · Roll {student.rollNumber ?? "—"}</p></article>)}</div>
      </section>
    </div>
  );
}

function ProfileCard({ icon: Icon, title, rows }: { icon: typeof Mail; title: string; rows: string[][] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><span className="rounded-lg bg-teal-50 p-2 text-teal-700"><Icon className="h-4 w-4" /></span>{title}</h2><div className="mt-4 divide-y divide-slate-100">{rows.map(([label, value]) => <div key={label} className="flex items-start justify-between gap-4 py-3 text-xs"><span className="text-slate-500">{label}</span><strong className="max-w-[65%] text-right text-slate-800">{value}</strong></div>)}</div></section>;
}
