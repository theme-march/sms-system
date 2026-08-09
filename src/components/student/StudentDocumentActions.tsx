"use client";

import { Download, Printer } from "lucide-react";

export function StudentDocumentActions({
  fileName,
  title,
  lines,
  disabled = false,
}: {
  fileName: string;
  title: string;
  lines: string[];
  disabled?: boolean;
}) {
  async function downloadPdf() {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text(title, 15, 18);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    let y = 28;
    for (const line of lines) {
      const wrapped = pdf.splitTextToSize(line, 180) as string[];
      if (y + wrapped.length * 6 > 282) {
        pdf.addPage();
        y = 18;
      }
      pdf.text(wrapped, 15, y);
      y += Math.max(6, wrapped.length * 6);
    }
    pdf.save(fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
  }

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button type="button" onClick={() => window.print()} className="btn-secondary">
        <Printer className="h-4 w-4" /> Print
      </button>
      <button type="button" disabled={disabled} onClick={downloadPdf} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">
        <Download className="h-4 w-4" /> Download PDF
      </button>
    </div>
  );
}
