import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen, Download, Eye, FileText, GraduationCap } from "lucide-react";
import prisma from "@/src/lib/db/prisma";
import { getCurrentSession } from "@/src/lib/auth/session";
import { normalizeWebsiteContent } from "@/src/lib/website-content";
import { StudentDocumentActions } from "@/src/components/student/StudentDocumentActions";

export default async function StudentSyllabusPage() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect("/login");
  const student = await prisma.student.findFirst({
    where: { userId: session.id, schoolId: session.schoolId, status: "ACTIVE" },
    include: {
      school: { include: { websiteSettings: true } },
      class: true,
      section: true,
      enrollments: { where: { enrollmentStatus: "ACTIVE" }, include: { academicYear: true, class: true, section: true, group: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!student) return <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">This account is not linked to a student profile.</div>;

  const enrollment = student.enrollments[0];
  const classId = enrollment?.classId || student.classId;
  const sectionId = enrollment?.sectionId || student.sectionId;
  const groupId = enrollment?.groupId || null;
  const academicYearId = enrollment?.academicYearId;
  const className = enrollment?.class.name || student.class?.name || "Not assigned";
  const sectionName = enrollment?.section.name || student.section?.name || "Not assigned";
  const yearName = enrollment?.academicYear.name || "Current";
  const groupName = enrollment?.group?.name || "All groups";

  const subjects = classId ? await prisma.classSubject.findMany({
    where: {
      schoolId: student.schoolId,
      classId,
      status: "ACTIVE",
      deletedAt: null,
      AND: [
        { OR: [{ academicYearId: academicYearId || null }, { academicYearId: null }] },
        { OR: [{ groupId }, { groupId: null }] },
      ],
    },
    include: { subject: true, teacher: { select: { nameEn: true } } },
    orderBy: [{ subjectType: "asc" }, { subject: { nameEn: "asc" } }],
  }) : [];

  const downloads = normalizeWebsiteContent(student.school.websiteSettings?.content).downloads.filter((item) => {
    if (item.category !== "SYLLABUS" || !item.title.trim() || !(item.fileUrl.startsWith("/") || /^https?:\/\//i.test(item.fileUrl))) return false;
    if (item.classId && item.classId !== classId) return false;
    if (item.sectionId && item.sectionId !== sectionId) return false;
    return true;
  });
  const uniqueSubjects = [...new Map(subjects.map((item) => [item.subjectId, item])).values()];
  const pdfLines = [
    student.school.name,
    "STUDENT SYLLABUS",
    `Student: ${student.nameEn} | ID: ${student.studentCode}`,
    `Class: ${className} | Section: ${sectionName} | Group: ${groupName}`,
    `Academic year: ${yearName}`,
    "",
    ...uniqueSubjects.map((item, index) => `${index + 1}. ${item.subject.nameEn} (${item.subject.code}) | ${item.subjectType} | Full marks: ${item.fullMarks} | Pass marks: ${item.passMarks}${item.subject.description ? ` | ${item.subject.description}` : ""}`),
  ];

  return <div className="mx-auto max-w-6xl space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Link href="/student/profile" className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-teal-700"><ArrowLeft className="h-3.5 w-3.5" />My Profile</Link><h1 className="flex items-center gap-2 text-2xl font-black text-slate-900"><BookOpen className="h-6 w-6 text-teal-700" />My Syllabus</h1><p className="mt-1 text-xs text-slate-500">Syllabus for {className} · {sectionName} · {yearName}</p></div><StudentDocumentActions disabled={!uniqueSubjects.length} title={`${className} Syllabus`} fileName={`${student.studentCode}-${className.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-syllabus.pdf`} lines={pdfLines} /></div>

    <section className="grid gap-4 rounded-xl bg-gradient-to-r from-teal-800 to-slate-900 p-5 text-white sm:grid-cols-4"><div className="sm:col-span-2"><p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">Student</p><p className="mt-1 font-black">{student.nameEn}</p><p className="mt-1 text-xs text-teal-100">{student.studentCode} · Roll {enrollment?.rollNumber || student.rollNumber || "—"}</p></div><Detail label="Class / Section" value={`${className} / ${sectionName}`} /><Detail label="Academic year / Group" value={`${yearName} / ${groupName}`} /></section>

    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs"><div className="border-b border-slate-100 p-5"><h2 className="flex items-center gap-2 text-sm font-black text-slate-900"><GraduationCap className="h-4 w-4 text-teal-700" />Subject syllabus overview</h2><p className="mt-1 text-xs text-slate-500">Subjects assigned to your active class, academic year and group</p></div>{!uniqueSubjects.length ? <p className="p-10 text-center text-sm text-slate-500">No class syllabus has been configured yet.</p> : <div className="overflow-x-auto"><table className="table-base min-w-[780px]"><thead><tr><th>#</th><th>Subject</th><th>Type</th><th>Full marks</th><th>Pass marks</th><th>Teacher</th><th>Curriculum</th></tr></thead><tbody>{uniqueSubjects.map((item, index) => <tr key={item.id}><td className="font-bold text-teal-700">{index + 1}</td><td><p className="font-black text-slate-900">{item.subject.nameEn}</p><p className="text-[10px] text-slate-400">{item.subject.nameBn || item.subject.code}</p></td><td><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase">{item.subjectType}</span></td><td>{item.fullMarks}</td><td>{item.passMarks}</td><td>{item.teacher?.nameEn || "Not assigned"}</td><td className="max-w-sm text-xs text-slate-500">{item.subject.description || "Curriculum details will be provided by the subject teacher."}</td></tr>)}</tbody></table></div>}</section>

    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"><h2 className="flex items-center gap-2 text-sm font-black text-slate-900"><FileText className="h-4 w-4 text-teal-700" />Uploaded syllabus files</h2><p className="mt-1 text-xs text-slate-500">Files published by the school for your class and section</p>{!downloads.length ? <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">No separate syllabus file has been uploaded for your class. You can still download the generated subject syllabus above.</p> : <div className="mt-4 grid gap-3 sm:grid-cols-2">{downloads.map((item, index) => <article key={`${item.fileUrl}-${index}`} className="rounded-xl border border-slate-200 p-4"><p className="font-black text-slate-900">{item.title}</p><p className="mt-1 text-[11px] text-slate-500">{item.publishedAt ? `Published ${new Date(item.publishedAt).toLocaleDateString("en-GB")}` : `${className} syllabus`}</p><div className="mt-4 flex gap-2"><a href={item.fileUrl} target="_blank" rel="noreferrer" className="btn-secondary"><Eye className="h-4 w-4" />View</a><a href={item.fileUrl} download className="btn-primary"><Download className="h-4 w-4" />Download</a></div></article>)}</div>}</section>
  </div>;
}

function Detail({label,value}:{label:string;value:string}) { return <div><p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">{label}</p><p className="mt-1 text-sm font-bold">{value}</p></div>; }
