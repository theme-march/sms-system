import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen, CalendarClock, Clock3, CreditCard, FileText, HeartPulse, MapPin, Phone, Receipt, ShieldCheck, UserRound } from "lucide-react";
import prisma from "@/src/lib/db/prisma";
import { getCurrentSession } from "@/src/lib/auth/session";

const date = (value: Date) => value.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

export default async function StudentProfilePage() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect("/login");
  const student = await prisma.student.findFirst({
    where: { userId: session.id, schoolId: session.schoolId, status: "ACTIVE" },
    include: {
      class: true,
      section: true,
      medicalInfo: true,
      documents: { orderBy: { uploadedAt: "desc" } },
      guardians: { where: { status: "ACTIVE" }, include: { guardian: true }, orderBy: { isPrimary: "desc" } },
      enrollments: { where: { enrollmentStatus: "ACTIVE" }, include: { academicYear: true, academicSession: true, class: true, section: true, group: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!student) return <div className="mx-auto max-w-3xl rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">This account is not linked to a student profile. Contact the School Admin.</div>;
  const enrollment = student.enrollments[0];
  return <div className="mx-auto max-w-6xl space-y-6">
    <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-teal-700">Personal record</p><h1 className="mt-1 text-2xl font-black text-slate-900">My Profile</h1></div><Link href="/student" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"><ArrowLeft className="h-4 w-4" />Dashboard</Link></div>
    <section className="dashboard-hero flex flex-col gap-5 rounded-2xl p-6 text-white sm:flex-row sm:items-center"><div className="dashboard-hero-panel flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black">{student.nameEn.split(" ").map((part) => part[0]).slice(0,2).join("")}</div><div><h2 className="text-2xl font-black">{student.nameEn}</h2><p className="dashboard-hero-muted mt-1 text-sm">{student.nameBn || "Student"}</p><p className="dashboard-hero-muted mt-2 text-xs">{enrollment?.class.name || student.class?.name} · {enrollment?.section.name || student.section?.name} · Roll {enrollment?.rollNumber || student.rollNumber}</p></div><ShieldCheck className="dashboard-hero-muted ml-auto hidden h-7 w-7 sm:block" /></section>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"><h2 className="mb-4 text-sm font-bold text-slate-900">Student services</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><Service href="/student/syllabus" icon={BookOpen} title="My Syllabus" detail="View and download" /><Service href="/student/class-routine" icon={Clock3} title="Class Routine" detail="View and download" /><Service href="/student/exam-routine" icon={CalendarClock} title="Exam Routine" detail="Published schedule" /><Service href="/student/admit-cards" icon={CreditCard} title="Admit Cards" detail="View and download PDF" /><Service href="/student/payments" icon={Receipt} title="Payment Details" detail="Invoices and receipts" /></div></section>
    <div className="grid gap-6 lg:grid-cols-2">
      <Card icon={UserRound} title="Student information"><Rows items={[["Student ID",student.studentCode],["Admission No.",student.admissionNumber],["Date of birth",date(student.dateOfBirth)],["Gender",student.gender],["Blood group",student.bloodGroup || "Not provided"],["Admission date",date(student.admissionDate)],["Academic year",enrollment?.academicYear.name || "Not assigned"],["Session",enrollment?.academicSession?.name || "Not assigned"],["Group",enrollment?.group?.name || "No group"]]} /></Card>
      <Card icon={Phone} title="Contact & family"><Rows items={[["Phone",student.phone || "Not provided"],["Email",student.email || "Not provided"],["Father",student.fatherName || "Not provided"],["Mother",student.motherName || "Not provided"],["Emergency phone",student.emergencyPhone || "Not provided"],["Primary guardian",student.guardians[0]?.guardian.name || "Not linked"],["Guardian phone",student.guardians[0]?.guardian.phone || "Not provided"]]} /></Card>
      <Card icon={MapPin} title="Address"><Rows items={[["Present address",student.presentAddress || "Not provided"],["Permanent address",student.permanentAddress || "Not provided"]]} /></Card>
      <Card icon={HeartPulse} title="Medical information"><Rows items={[["Blood group",student.medicalInfo?.bloodGroup || student.bloodGroup || "Not provided"],["Allergies",student.medicalInfo?.allergies || "None recorded"],["Medical conditions",student.medicalInfo?.medicalConditions || "None recorded"],["Emergency notes",student.medicalInfo?.emergencyNotes || "None recorded"]]} /></Card>
    </div>
    <Card icon={FileText} title="My documents">{student.documents.length ? <div className="grid gap-3 sm:grid-cols-2">{student.documents.map((document) => <a key={document.id} href={document.fileUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 p-4 hover:border-teal-200"><p className="text-sm font-bold text-slate-900">{document.title}</p><p className="mt-1 text-[11px] text-slate-500">{document.documentType} · {date(document.uploadedAt)}</p></a>)}</div> : <p className="text-xs text-slate-500">No document has been uploaded.</p>}</Card>
  </div>;
}
function Card({icon:Icon,title,children}:{icon:typeof UserRound;title:string;children:React.ReactNode}){return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"><h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900"><Icon className="h-4 w-4 text-teal-600" />{title}</h2>{children}</section>}
function Rows({items}:{items:Array<[string,string]>}){return <dl className="divide-y divide-slate-100">{items.map(([label,value])=><div key={label} className="grid grid-cols-[130px_1fr] gap-3 py-2.5 text-xs"><dt className="font-semibold text-slate-500">{label}</dt><dd className="font-bold text-slate-800">{value}</dd></div>)}</dl>}
function Service({href,icon:Icon,title,detail}:{href:string;icon:typeof Clock3;title:string;detail:string}){return <Link href={href} className="group rounded-xl border border-slate-200 p-4 hover:border-teal-300 hover:bg-teal-50/50"><Icon className="h-5 w-5 text-teal-700" /><p className="mt-3 text-sm font-black text-slate-900">{title}</p><p className="mt-1 text-[11px] text-slate-500">{detail}</p></Link>}
