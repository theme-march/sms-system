"use client";

import { useRouter } from "next/navigation";

export function ExamRoutineSelector({
  exams,
  selectedExamId,
  basePath = "/student/exam-routine",
}: {
  exams: Array<{ id: string; name: string; term: string; year: number }>;
  selectedExamId: string;
  basePath?: string;
}) {
  const router = useRouter();
  return (
    <label className="block">
      <span className="field-label">Select Exam Type</span>
      <select
        className="form-input mt-1 font-semibold"
        value={selectedExamId}
        onChange={(event) => router.push(`${basePath}?examId=${encodeURIComponent(event.target.value)}`)}
      >
        {exams.map((exam) => (
          <option key={exam.id} value={exam.id}>{exam.name} — {exam.term} {exam.year}</option>
        ))}
      </select>
    </label>
  );
}
