import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Receipt } from "lucide-react";
import prisma from "@/src/lib/db/prisma";
import { getCurrentSession } from "@/src/lib/auth/session";
import { PortalFees } from "@/src/components/fees/PortalFees";

export default async function StudentPaymentsPage() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect("/login");
  const student = await prisma.student.findFirst({ where: { userId: session.id, schoolId: session.schoolId, status: "ACTIVE" }, select: { id: true, nameEn: true, studentCode: true } });
  if (!student) return <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">This account is not linked to a student profile.</div>;
  return <div className="mx-auto max-w-7xl space-y-6"><div><Link href="/student/profile" className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-teal-700"><ArrowLeft className="h-3.5 w-3.5" />My Profile</Link><h1 className="flex items-center gap-2 text-2xl font-black text-slate-900"><Receipt className="h-6 w-6 text-teal-700" />Payment Details</h1><p className="mt-1 text-xs text-slate-500">All invoices, dues, payments, transaction references and receipts for {student.nameEn} ({student.studentCode})</p></div><PortalFees studentId={student.id} studentName={student.nameEn} /></div>;
}
