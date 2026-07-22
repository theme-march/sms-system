import { jsPDF } from 'jspdf';

export interface PDFTableColumn {
  header: string;
  dataKey: string;
}

export function generatePDF(
  title: string,
  subtitle: string,
  columns: PDFTableColumn[],
  data: Record<string, any>[]
) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.setTextColor(13, 148, 136); // Teal color
  doc.text(title, 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(subtitle, 14, 28);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 14, 34);

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 38, 196, 38);

  // Simple Table Rendering
  let y = 46;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  // Render Table Headers
  let x = 14;
  const colWidth = Math.floor(180 / columns.length);

  doc.setFillColor(240, 240, 240);
  doc.rect(14, y - 5, 182, 8, 'F');

  columns.forEach((col) => {
    doc.setFont('helvetica', 'bold');
    doc.text(col.header, x, y);
    x += colWidth;
  });

  y += 10;
  doc.setFont('helvetica', 'normal');

  // Render Rows
  data.forEach((row, rowIndex) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    x = 14;
    columns.forEach((col) => {
      const val = String(row[col.dataKey] ?? '');
      doc.text(val, x, y);
      x += colWidth;
    });

    y += 8;
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
}
