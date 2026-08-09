"use client";

import { Download, Printer } from "lucide-react";

type ScheduleRow = { date: string; subject: string; time: string; room: string; marks: string };

export function AdmitCardActions({
  targetId,
  fileName,
  schoolName,
  examName,
  studentName,
  studentId,
  admissionNumber,
  admitCardNumber,
  classSection,
  roll,
  academicYear,
  feeClearance,
  schedule,
  disabled = false,
}: {
  targetId: string;
  fileName: string;
  schoolName: string;
  examName: string;
  studentName: string;
  studentId: string;
  admissionNumber: string;
  admitCardNumber: string;
  classSection: string;
  roll: string;
  academicYear: string;
  feeClearance: string;
  schedule: ScheduleRow[];
  disabled?: boolean;
}) {
  function printCard() {
    document.body.classList.add("printing-admit-card");
    const cleanup = () => document.body.classList.remove("printing-admit-card");
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
    window.setTimeout(cleanup, 1000);
  }

  async function downloadPdf() {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const red: [number, number, number] = [153, 38, 27];
    const teal: [number, number, number] = [13, 120, 110];
    const dark: [number, number, number] = [28, 25, 23];
    const muted: [number, number, number] = [100, 92, 83];
    const line: [number, number, number] = [221, 214, 203];
    const left = 14;
    const right = 196;

    pdf.setTextColor(...muted);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(schoolName, 105, 18, { align: "center" });
    pdf.setTextColor(...red);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(19);
    pdf.text("EXAMINATION ADMIT CARD", 105, 29, { align: "center" });
    pdf.setTextColor(...dark);
    pdf.setFontSize(11);
    pdf.text(examName, 105, 38, { align: "center" });
    pdf.setFillColor(236, 253, 245);
    pdf.roundedRect(84, 43, 42, 8, 4, 4, "F");
    pdf.setTextColor(5, 130, 92);
    pdf.setFontSize(8);
    pdf.text("PUBLISHED SCHEDULE", 105, 48.3, { align: "center" });
    pdf.setDrawColor(...teal);
    pdf.setLineWidth(0.45);
    pdf.line(left, 60, right, 60);

    const details: Array<[string, string, string, string]> = [
      ["Student name", studentName, "Student ID", studentId],
      ["Admission no.", admissionNumber, "Admit card no.", admitCardNumber],
      ["Class / Section", classSection, "Roll", roll],
      ["Academic year", academicYear, "Fee clearance", feeClearance],
    ];
    let y = 70;
    pdf.setFontSize(9);
    for (const [labelA, valueA, labelB, valueB] of details) {
      pdf.setTextColor(...muted); pdf.setFont("helvetica", "normal"); pdf.text(labelA, 18, y);
      pdf.setTextColor(...dark); pdf.setFont("helvetica", "bold"); pdf.text(valueA, 48, y);
      pdf.setTextColor(...muted); pdf.setFont("helvetica", "normal"); pdf.text(labelB, 110, y);
      pdf.setTextColor(...dark); pdf.setFont("helvetica", "bold"); pdf.text(valueB, 145, y);
      pdf.setDrawColor(...line); pdf.setLineWidth(0.2); pdf.line(18, y + 4, 98, y + 4); pdf.line(110, y + 4, 192, y + 4);
      y += 14;
    }

    y += 2;
    const columns = [14, 60, 112, 145, 179, 196];
    const headers = ["Date", "Subject", "Time", "Room", "Marks"];
    pdf.setFillColor(247, 249, 250);
    pdf.rect(left, y, right - left, 11, "F");
    pdf.setTextColor(74, 85, 104); pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5);
    headers.forEach((header, index) => pdf.text(header, columns[index] + 2, y + 7));
    y += 11;
    pdf.setFontSize(8.5);
    for (const row of schedule) {
      pdf.setTextColor(...dark); pdf.setFont("helvetica", "bold"); pdf.text(row.date, columns[0] + 2, y + 7);
      pdf.setFont("helvetica", "normal");
      pdf.text(pdf.splitTextToSize(row.subject, 47)[0] || "", columns[1] + 2, y + 7);
      pdf.text(row.time, columns[2] + 2, y + 7);
      pdf.text(pdf.splitTextToSize(row.room, 30)[0] || "", columns[3] + 2, y + 7);
      pdf.text(row.marks, columns[4] + 2, y + 7);
      pdf.setDrawColor(230, 233, 237); pdf.line(left, y + 11, right, y + 11);
      y += 11;
    }
    pdf.setFillColor(248, 246, 242);
    pdf.rect(left, y + 4, right - left, 14, "F");
    pdf.setTextColor(...muted); pdf.setFontSize(8.5);
    pdf.text("Bring this admit card and arrive at least 30 minutes before the examination.", 19, y + 13);
    pdf.save(fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
  }

  return <>
    <div className="flex flex-wrap gap-2 print:hidden">
      <button type="button" onClick={printCard} className="btn-secondary"><Printer className="h-4 w-4" />Print</button>
      <button type="button" disabled={disabled} onClick={downloadPdf} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" />Download PDF</button>
    </div>
    <style jsx global>{`
      @media print {
        @page { size: A4 portrait; margin: 10mm; }
        body.printing-admit-card * { visibility: hidden !important; }
        body.printing-admit-card #${targetId}, body.printing-admit-card #${targetId} * { visibility: visible !important; }
        body.printing-admit-card #${targetId} { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; border: 1px solid #d8d1c7 !important; border-radius: 0 !important; box-shadow: none !important; background: white !important; }
        body.printing-admit-card { background: white !important; }
      }
    `}</style>
  </>;
}
