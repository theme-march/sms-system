import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/db/prisma";
import { normalizeWebsiteContent } from "@/src/lib/website-content";
import { jsPDF } from "jspdf";
import { readFile } from "node:fs/promises";

const WEEKDAYS: Record<string, string> = {
  SUNDAY: "রবিবার",
  MONDAY: "সোমবার",
  TUESDAY: "মঙ্গলবার",
  WEDNESDAY: "বুধবার",
  THURSDAY: "বৃহস্পতিবার",
  FRIDAY: "শুক্রবার",
  SATURDAY: "শনিবার",
};
const WEEKDAY_ORDER = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
async function loadData(classId = "", sectionId = "") {
  const school = await prisma.school.findFirst({
    where: { deletedAt: null },
    include: { websiteSettings: true },
    orderBy: { createdAt: "asc" },
  });
  if (!school) return null;
  const [classes, routines] = await Promise.all([
    prisma.class.findMany({
      where: { schoolId: school.id, status: "ACTIVE", deletedAt: null },
      select: {
        id: true,
        name: true,
        sections: {
          where: { status: "ACTIVE", deletedAt: null },
          select: { id: true, name: true },
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    }),
    classId && sectionId
      ? prisma.classRoutine.findMany({
          where: {
            schoolId: school.id,
            classId,
            sectionId,
            status: "PUBLISHED",
          },
          orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
        })
      : Promise.resolve([]),
  ]);
  const [subjects, teachers, periods, rooms] = routines.length
    ? await Promise.all([
        prisma.subject.findMany({
          where: { id: { in: routines.map((r) => r.subjectId) } },
          select: { id: true, nameEn: true, nameBn: true },
        }),
        prisma.teacher.findMany({
          where: { id: { in: routines.map((r) => r.teacherId) } },
          select: { id: true, nameEn: true, nameBn: true },
        }),
        prisma.period.findMany({
          where: { id: { in: routines.map((r) => r.periodId) } },
          select: { id: true, name: true },
        }),
        prisma.room.findMany({
          where: {
            id: { in: routines.flatMap((r) => (r.roomId ? [r.roomId] : [])) },
          },
          select: { id: true, name: true },
        }),
      ])
    : [[], [], [], []];
  const map = <T extends { id: string }>(items: T[]) =>
    new Map(items.map((item) => [item.id, item]));
  const sm = map(subjects),
    tm = map(teachers),
    pm = map(periods),
    rm = map(rooms);
  return {
    schoolName: school.name,
    classes,
    documents: normalizeWebsiteContent(
      school.websiteSettings?.content,
    ).downloads.filter(
      (item) =>
        item.title.trim() &&
        (item.fileUrl.startsWith("/") || /^https?:\/\//i.test(item.fileUrl)),
    ),
    routines: routines
      .map((r) => ({
        id: r.id,
        weekday: r.weekday,
        weekdayLabel: WEEKDAYS[r.weekday] || r.weekday,
        startTime: r.startTime,
        endTime: r.endTime,
        subject:
          sm.get(r.subjectId)?.nameBn || sm.get(r.subjectId)?.nameEn || "—",
        teacher:
          tm.get(r.teacherId)?.nameBn || tm.get(r.teacherId)?.nameEn || "—",
        period: pm.get(r.periodId)?.name || "—",
        room: r.roomId ? rm.get(r.roomId)?.name || "—" : "—",
      }))
      .sort(
        (a, b) =>
          WEEKDAY_ORDER.indexOf(a.weekday) - WEEKDAY_ORDER.indexOf(b.weekday) ||
          a.startTime.localeCompare(b.startTime),
      ),
  };
}
export async function GET(request: NextRequest) {
  try {
    const classId = request.nextUrl.searchParams.get("classId") || "",
      sectionId = request.nextUrl.searchParams.get("sectionId") || "";
    const data = await loadData(classId, sectionId);
    if (!data)
      return NextResponse.json({ classes: [], documents: [], routines: [] });
    if (request.nextUrl.searchParams.get("format") === "pdf") {
      const cls = data.classes.find((c) => c.id === classId);
      const section = cls?.sections.find((s) => s.id === sectionId);
      if (!cls || !section || !data.routines.length)
        return NextResponse.json(
          { error: "Published routine not found." },
          { status: 404 },
        );
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      let fontName = "helvetica";
      try {
        const font = await readFile("C:/Windows/Fonts/Nirmala.ttf");
        doc.addFileToVFS("Nirmala.ttf", font.toString("base64"));
        doc.addFont("Nirmala.ttf", "Nirmala", "normal");
        fontName = "Nirmala";
      } catch (fontError) {
        console.warn("Bangla PDF font unavailable:", fontError);
      }
      doc.setFont(fontName, "normal");
      doc.setTextColor(45, 39, 32);
      doc.setFontSize(19);
      doc.text(data.schoolName, 148.5, 17, { align: "center" });
      doc.setFontSize(14);
      doc.text("ক্লাস রুটিন", 148.5, 27, { align: "center" });
      doc.setFontSize(10);
      doc.setTextColor(105, 94, 80);
      doc.text(`শ্রেণি: ${cls.name}    সেকশন: ${section.name}`, 148.5, 34, {
        align: "center",
      });
      doc.setDrawColor(161, 43, 31);
      doc.setLineWidth(0.7);
      doc.line(122, 38, 175, 38);
      const columns = [14, 52, 88, 128, 194, 249, 283];
      const headers = ["দিন", "পিরিয়ড", "সময়", "বিষয়", "শিক্ষক", "কক্ষ"];
      let y = 46;
      doc.setFillColor(244, 240, 232);
      doc.rect(14, y, 269, 12, "F");
      doc.setTextColor(70, 61, 51);
      doc.setFontSize(9.5);
      headers.forEach((header, i) => doc.text(header, columns[i] + 3, y + 7.5));
      y += 12;
      for (const routine of data.routines) {
        if (y > 185) {
          doc.addPage("a4", "landscape");
          y = 18;
        }
        doc.setDrawColor(220, 213, 202);
        doc.line(14, y + 11, 283, y + 11);
        doc.setTextColor(45, 39, 32);
        doc.setFontSize(9);
        const values = [
          routine.weekdayLabel,
          routine.period,
          `${routine.startTime}-${routine.endTime}`,
          routine.subject,
          routine.teacher,
          routine.room,
        ];
        values.forEach((value, i) => {
          const maxWidth = columns[i + 1] - columns[i] - 6;
          doc.text(
            doc.splitTextToSize(value, maxWidth)[0] || "",
            columns[i] + 3,
            y + 7,
          );
        });
        y += 11;
      }
      const pages = doc.getNumberOfPages();
      for (let page = 1; page <= pages; page++) {
        doc.setPage(page);
        doc.setFontSize(8);
        doc.setTextColor(125, 115, 101);
        doc.text(`পৃষ্ঠা ${page}/${pages}`, 283, 202, { align: "right" });
      }
      const bytes = Buffer.from(doc.output("arraybuffer"));
      const filename = `class-routine-${cls.name}-${section.name}.pdf`.replace(
        /[^a-zA-Z0-9._-]+/g,
        "-",
      );
      return new NextResponse(bytes, {
        headers: {
          "content-type": "application/pdf",
          "content-disposition": `attachment; filename="${filename}"`,
          "cache-control": "no-store",
        },
      });
    }
    if (request.nextUrl.searchParams.get("format") === "csv") {
      const cls = data.classes.find((c) => c.id === classId),
        section = cls?.sections.find((s) => s.id === sectionId);
      const rows = [
        ["দিন", "পিরিয়ড", "সময়", "বিষয়", "শিক্ষক", "কক্ষ"],
        ...data.routines.map((r) => [
          r.weekdayLabel,
          r.period,
          `${r.startTime}-${r.endTime}`,
          r.subject,
          r.teacher,
          r.room,
        ]),
      ];
      const csv =
        "\uFEFF" +
        rows
          .map((row) =>
            row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
          )
          .join("\r\n");
      const name =
        `class-routine-${cls?.name || "class"}-${section?.name || "section"}.csv`.replace(
          /[^a-zA-Z0-9._-]+/g,
          "-",
        );
      return new NextResponse(csv, {
        headers: {
          "content-type": "text/csv; charset=utf-8",
          "content-disposition": `attachment; filename="${name}"`,
        },
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Public downloads failed:", error);
    return NextResponse.json(
      { error: "Downloads could not be loaded." },
      { status: 500 },
    );
  }
}
