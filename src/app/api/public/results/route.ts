import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/db/prisma";
import { calculateOverallResult } from "@/src/lib/exam-calculations";

const lookupSchema = z.object({
  examId: z.string().trim().min(1).max(191),
  classId: z.string().trim().min(1).max(191),
  identifier: z.string().trim().min(1).max(50),
});

const asNumber = (value: unknown) => Number(value || 0);

export async function GET() {
  try {
    const school = await prisma.school.findFirst({
      where: { deletedAt: null, status: "ACTIVE" },
      select: { id: true, name: true, code: true, eiin: true },
      orderBy: { createdAt: "asc" },
    });
    if (!school) return NextResponse.json({ school: null, exams: [] });

    const publications = await prisma.resultPublication.findMany({
      where: { schoolId: school.id, status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
    const examIds = [...new Set(publications.map((item) => item.examId))];
    const [exams, resultScopes, classes] = await Promise.all([
      prisma.exam.findMany({
        where: { id: { in: examIds }, schoolId: school.id, isPublished: true },
        select: { id: true, name: true, term: true, year: true },
        orderBy: [{ year: "desc" }, { startDate: "desc" }],
      }),
      prisma.studentResult.findMany({
        where: { schoolId: school.id, examId: { in: examIds } },
        select: { examId: true, classId: true },
        distinct: ["examId", "classId"],
      }),
      prisma.class.findMany({
        where: { schoolId: school.id, deletedAt: null, status: "ACTIVE" },
        select: { id: true, name: true },
        orderBy: [{ displayOrder: "asc" }, { numericLevel: "asc" }],
      }),
    ]);

    return NextResponse.json({
      school: { name: school.name, code: school.code, eiin: school.eiin },
      exams: exams.map((exam) => {
        const scoped = publications.filter((item) => item.examId === exam.id);
        const global = scoped.some((item) => !item.classId);
        const configured = resultScopes
          .filter((item) => item.examId === exam.id)
          .map((item) => item.classId);
        const allowed = global
          ? configured
          : scoped.flatMap((item) => (item.classId ? [item.classId] : []));
        return {
          ...exam,
          classes: classes.filter((item) => [...new Set(allowed)].includes(item.id)),
        };
      }),
    });
  } catch (error) {
    console.error("GET /api/public/results error", error);
    return NextResponse.json(
      { error: "ফলাফলের তালিকা লোড করা যায়নি।" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = lookupSchema.parse(await request.json());
    const school = await prisma.school.findFirst({
      where: { deletedAt: null, status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        code: true,
        eiin: true,
        address: true,
      },
      orderBy: { createdAt: "asc" },
    });
    if (!school)
      return NextResponse.json(
        { error: "বিদ্যালয় পাওয়া যায়নি।" },
        { status: 404 },
      );

    const exam = await prisma.exam.findFirst({
      where: { id: parsed.examId, schoolId: school.id, isPublished: true },
      select: { id: true, name: true, term: true, year: true },
    });
    if (!exam)
      return NextResponse.json(
        { error: "এই ফলাফলটি প্রকাশিত নয়।" },
        { status: 404 },
      );

    const publication = await prisma.resultPublication.findFirst({
      where: {
        schoolId: school.id,
        examId: exam.id,
        status: "PUBLISHED",
        OR: [{ classId: null }, { classId: parsed.classId }],
      },
      orderBy: { publishedAt: "desc" },
    });
    if (!publication)
      return NextResponse.json(
        { error: "এই শ্রেণির ফলাফল এখনো প্রকাশিত হয়নি।" },
        { status: 404 },
      );

    let student = await prisma.student.findFirst({
      where: {
        schoolId: school.id,
        status: "ACTIVE",
        OR: [
          { admissionNumber: parsed.identifier },
          { studentCode: parsed.identifier },
        ],
      },
    });
    if (!student && /^\d+$/.test(parsed.identifier)) {
      const enrollments = await prisma.studentEnrollment.findMany({
        where: {
          schoolId: school.id,
          classId: parsed.classId,
          rollNumber: Number(parsed.identifier),
        },
        orderBy: { createdAt: "desc" },
      });
      for (const enrollment of enrollments) {
        const candidate = await prisma.student.findFirst({
          where: {
            id: enrollment.studentId,
            schoolId: school.id,
            status: "ACTIVE",
          },
        });
        if (!candidate) continue;
        const hasResult = await prisma.studentResult.count({
          where: {
            schoolId: school.id,
            examId: exam.id,
            classId: parsed.classId,
            studentId: candidate.id,
          },
        });
        if (hasResult) {
          student = candidate;
          break;
        }
      }
    }

    if (!student) {
      return NextResponse.json(
        { error: "প্রদত্ত শিক্ষার্থী তথ্য সঠিক নয়।" },
        { status: 404 },
      );
    }

    const result = await prisma.studentResult.findFirst({
      where: {
        schoolId: school.id,
        examId: exam.id,
        classId: parsed.classId,
        studentId: student.id,
      },
    });
    if (!result)
      return NextResponse.json(
        { error: "এই শিক্ষার্থীর ফলাফল পাওয়া যায়নি।" },
        { status: 404 },
      );

    const [storedResultSubjects, classRow, section, academicYear, enrollment, classSubjectMappings] =
      await Promise.all([
        prisma.resultSubject.findMany({ where: { resultId: result.id } }),
        prisma.class.findUnique({
          where: { id: result.classId },
          select: { name: true },
        }),
        prisma.section.findUnique({
          where: { id: result.sectionId },
          select: { name: true },
        }),
        prisma.academicYear.findUnique({
          where: { id: result.academicYearId },
          select: { name: true },
        }),
        prisma.studentEnrollment.findFirst({
          where: {
            studentId: student.id,
            academicYearId: result.academicYearId,
            classId: result.classId,
            sectionId: result.sectionId,
          },
          select: {
            rollNumber: true,
            registrationNumber: true,
            groupId: true,
          },
        }),
        prisma.classSubject.findMany({
          where: {
            schoolId: school.id,
            classId: result.classId,
            status: "ACTIVE",
            deletedAt: null,
          },
          select: {
            id: true,
            academicYearId: true,
            groupId: true,
            subjectId: true,
            fullMarks: true,
            passMarks: true,
            subjectType: true,
          },
        }),
      ]);
    const normalizedStoredSubjects = storedResultSubjects.map((item) => ({
      ...item,
      fullMarks: asNumber(item.fullMarks),
      passMarks: asNumber(item.passMarks),
      obtainedMarks: asNumber(item.obtainedMarks),
      gradePoint: asNumber(item.gradePoint),
    }));
    const applicableMappings = classSubjectMappings
      .filter(
        (mapping) =>
          (!mapping.academicYearId ||
            mapping.academicYearId === result.academicYearId) &&
          (!mapping.groupId || mapping.groupId === enrollment?.groupId),
      )
      .filter(
        (mapping, index, list) =>
          list.findIndex((item) => item.subjectId === mapping.subjectId) ===
          index,
      );
    const resultSubjects = applicableMappings.length
      ? applicableMappings.map((mapping) => {
          const stored = normalizedStoredSubjects.find(
            (item) => item.subjectId === mapping.subjectId,
          );
          return (
            stored || {
              id: `configured-${mapping.id}`,
              resultId: result.id,
              subjectId: mapping.subjectId,
              fullMarks: asNumber(mapping.fullMarks),
              passMarks: asNumber(mapping.passMarks),
              obtainedMarks: 0,
              letterGrade: "F",
              gradePoint: 0,
              isOptional:
                mapping.subjectType === "optional" ||
                mapping.subjectType === "additional",
              isPassed: false,
              isAbsent: true,
            }
          );
        })
      : normalizedStoredSubjects;
    const verifiedMarks = await prisma.mark.findMany({
      where: {
        examId: exam.id,
        studentId: student.id,
        subjectId: { in: resultSubjects.map((item) => item.subjectId) },
        isLocked: true,
      },
      select: { subjectId: true, marksObtained: true, comments: true },
    });
    const verifiedMarkMap = new Map(
      verifiedMarks.map((item) => [item.subjectId, item]),
    );
    const liveOverall = calculateOverallResult(
      resultSubjects.map((item) => {
        const verifiedMark = verifiedMarkMap.get(item.subjectId);
        return {
          subjectId: item.subjectId,
          isOptional: item.isOptional,
          fullMarks: asNumber(item.fullMarks),
          passMarks: asNumber(item.passMarks),
          written: verifiedMark
            ? asNumber(verifiedMark.marksObtained)
            : asNumber(item.obtainedMarks),
          isAbsent: verifiedMark
            ? verifiedMark.comments === "ABSENT"
            : item.isAbsent,
        };
      }),
    );
    const liveSubjectMap = new Map(
      liveOverall.subjectResults.map((item) => [item.subjectId, item]),
    );
    const subjects = await prisma.subject.findMany({
      where: { id: { in: resultSubjects.map((item) => item.subjectId) } },
      select: { id: true, nameEn: true, nameBn: true, code: true },
    });
    const subjectMap = new Map(subjects.map((item) => [item.id, item]));

    return NextResponse.json({
      school,
      exam,
      publication: { publishedAt: publication.publishedAt.toISOString() },
      student: {
        name: student.nameBn || student.nameEn,
        nameEn: student.nameEn,
        admissionNumber: student.admissionNumber,
        studentCode: student.studentCode,
        rollNumber: enrollment?.rollNumber ?? student.rollNumber,
        registrationNumber: enrollment?.registrationNumber,
        fatherName: student.fatherName,
        motherName: student.motherName,
        className: classRow?.name || "—",
        sectionName: section?.name || "—",
        academicYear: academicYear?.name || String(exam.year),
      },
      summary: {
        totalMarks: liveOverall.totalMarks,
        average: liveOverall.average,
        percentage: liveOverall.percentage,
        gpa: liveOverall.gpa,
        letterGrade: liveOverall.letterGrade,
        failedSubjectCount: liveOverall.failedSubjectCount,
        classPosition: result.classPosition,
        isPassed: liveOverall.isPassed,
        remarks: liveOverall.isPassed ? "Promoted" : "Needs improvement",
      },
      subjects: resultSubjects.map((item) => {
        const subject = subjectMap.get(item.subjectId);
        const liveSubject = liveSubjectMap.get(item.subjectId);
        return {
          id: item.id,
          name: subject?.nameBn || subject?.nameEn || "বিষয়",
          code: subject?.code || "—",
          fullMarks: asNumber(item.fullMarks),
          passMarks: asNumber(item.passMarks),
          obtainedMarks: liveSubject?.obtainedMarks ?? asNumber(item.obtainedMarks),
          letterGrade: liveSubject?.letterGrade || item.letterGrade,
          gradePoint: liveSubject?.gradePoint ?? asNumber(item.gradePoint),
          isOptional: item.isOptional,
          isPassed: liveSubject?.isPassed ?? item.isPassed,
          isAbsent: liveSubject?.isAbsent ?? item.isAbsent,
        };
      }),
    });
  } catch (error) {
    console.error("POST /api/public/results error", error);
    const invalid = error instanceof z.ZodError;
    return NextResponse.json(
      {
        error: invalid
          ? "সকল তথ্য সঠিকভাবে পূরণ করুন।"
          : "ফলাফল খুঁজে পাওয়া যায়নি।",
      },
      { status: invalid ? 400 : 500 },
    );
  }
}
