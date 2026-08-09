"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Award, CalendarDays, Printer, RotateCcw, Search } from "lucide-react";

type ExamOption = {
  id: string;
  name: string;
  term: string;
  year: number;
  classes: { id: string; name: string }[];
};

type ResultData = {
  school: { name: string; code: string; eiin?: string; address?: string };
  exam: { name: string; term: string; year: number };
  publication: { publishedAt: string };
  student: {
    name: string;
    nameEn: string;
    admissionNumber: string;
    studentCode: string;
    rollNumber?: number;
    registrationNumber?: string;
    fatherName?: string;
    motherName?: string;
    className: string;
    sectionName: string;
    academicYear: string;
  };
  summary: {
    totalMarks: number;
    average: number;
    percentage: number;
    gpa: number;
    letterGrade: string;
    failedSubjectCount: number;
    classPosition?: number;
    isPassed: boolean;
    remarks?: string;
  };
  subjects: {
    id: string;
    name: string;
    code: string;
    fullMarks: number;
    passMarks: number;
    obtainedMarks: number;
    letterGrade: string;
    gradePoint: number;
    isOptional: boolean;
    isPassed: boolean;
    isAbsent: boolean;
  }[];
};

const formatNumber = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

export function PublicResultLookup({ schoolName }: { schoolName: string }) {
  const [exams, setExams] = useState<ExamOption[]>([]);
  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResultData | null>(null);
  const selectedExam = useMemo(
    () => exams.find((exam) => exam.id === examId),
    [examId, exams],
  );

  useEffect(() => {
    fetch("/api/public/results", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
        setExams(body.exams || []);
      })
      .catch((reason) =>
        setError(reason instanceof Error ? reason.message : "তালিকা লোড করা যায়নি।"),
      )
      .finally(() => setLoadingOptions(false));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setResult(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/public/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId, classId, identifier }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "ফলাফল পাওয়া যায়নি।");
      setResult(body);
      requestAnimationFrame(() =>
        document.getElementById("published-result")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "ফলাফল পাওয়া যায়নি।");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setExamId("");
    setClassId("");
    setIdentifier("");
    setResult(null);
    setError("");
  }

  return (
    <div className="result-publication">
      <section className="classic-section result-page-title no-print">
        <h2>ফলাফল প্রকাশনা সিস্টেম</h2>
        <div className="result-page-title-body">
          <div className="result-title-icon"><Award size={22} /></div>
          <div>
            <span>অনলাইন ফলাফল সেবা</span>
            <p>প্রকাশিত পরীক্ষার ফলাফল ও বিস্তারিত নম্বরপত্র দেখুন</p>
          </div>
        </div>
      </section>

      <section className="result-search-card no-print">
        <div className="result-card-heading">
          <Search size={20} />
          <div>
            <h2>শিক্ষার্থীর ফলাফল অনুসন্ধান</h2>
            <p>নিচের তথ্যগুলো সঠিকভাবে পূরণ করুন</p>
          </div>
        </div>
        <form className="result-search-form" onSubmit={submit}>
          <label>
            পরীক্ষার নাম <b>*</b>
            <select
              value={examId}
              onChange={(event) => {
                setExamId(event.target.value);
                setClassId("");
              }}
              required
              disabled={loadingOptions}
            >
              <option value="">
                {loadingOptions ? "লোড হচ্ছে..." : "পরীক্ষা নির্বাচন করুন"}
              </option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name} — {exam.year}
                </option>
              ))}
            </select>
          </label>
          <label>
            শ্রেণি <b>*</b>
            <select
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
              required
              disabled={!selectedExam}
            >
              <option value="">শ্রেণি নির্বাচন করুন</option>
              {selectedExam?.classes.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
          <label className="result-identifier-field">
            রোল / Student ID / Admission No. <b>*</b>
            <input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="যেমন: 12 বা STD-2026-001"
              autoComplete="off"
              required
            />
          </label>
          <div className="result-form-actions">
            <button type="submit" className="result-primary-button" disabled={submitting || !exams.length}>
              <Search size={17} /> {submitting ? "খোঁজা হচ্ছে..." : "ফলাফল দেখুন"}
            </button>
            <button type="button" className="result-reset-button" onClick={reset}>
              <RotateCcw size={16} /> রিসেট
            </button>
          </div>
        </form>
        {!loadingOptions && !exams.length && !error ? (
          <div className="result-info-message">বর্তমানে কোনো পরীক্ষার ফলাফল প্রকাশিত নেই।</div>
        ) : null}
        {error ? <div className="result-error" role="alert">{error}</div> : null}
      </section>

      {result ? (
        <section className="result-sheet" id="published-result">
          <div className="result-sheet-actions no-print">
            <span>ফলাফল পাওয়া গেছে</span>
            <button type="button" onClick={() => window.print()}><Printer size={16} /> প্রিন্ট করুন</button>
          </div>
          <header className="marksheet-header">
            <div className="marksheet-seal"><Award size={34} /></div>
            <div>
              <h2>{result.school.name || schoolName}</h2>
              <p>{result.school.address}</p>
              <p>EIIN: {result.school.eiin || "—"} · School Code: {result.school.code}</p>
              <h3>একাডেমিক ট্রান্সক্রিপ্ট / নম্বরপত্র</h3>
              <strong>{result.exam.name} — {result.exam.year}</strong>
            </div>
          </header>

          <div className="student-result-grid">
            <dl>
              <div><dt>শিক্ষার্থীর নাম</dt><dd>{result.student.name}</dd></div>
              <div><dt>পিতার নাম</dt><dd>{result.student.fatherName || "—"}</dd></div>
              <div><dt>মাতার নাম</dt><dd>{result.student.motherName || "—"}</dd></div>
              <div><dt>Student ID</dt><dd>{result.student.studentCode}</dd></div>
            </dl>
            <dl>
              <div><dt>শ্রেণি</dt><dd>{result.student.className}</dd></div>
              <div><dt>শাখা</dt><dd>{result.student.sectionName}</dd></div>
              <div><dt>রোল</dt><dd>{result.student.rollNumber ?? "—"}</dd></div>
              <div><dt>শিক্ষাবর্ষ</dt><dd>{result.student.academicYear}</dd></div>
            </dl>
          </div>

          <div className="result-summary-row">
            <div><span>ফলাফল</span><strong className={result.summary.isPassed ? "pass" : "fail"}>{result.summary.isPassed ? "উত্তীর্ণ" : "অনুত্তীর্ণ"}</strong></div>
            <div><span>মোট নম্বর</span><strong>{formatNumber(result.summary.totalMarks)}</strong></div>
            <div><span>শতকরা</span><strong>{result.summary.percentage.toFixed(2)}%</strong></div>
            <div><span>GPA</span><strong>{result.summary.gpa.toFixed(2)}</strong></div>
            <div><span>গ্রেড</span><strong>{result.summary.letterGrade}</strong></div>
            <div><span>মেধাক্রম</span><strong>{result.summary.classPosition ?? "—"}</strong></div>
          </div>

          <div className="result-table-wrap">
            <table className="result-marks-table">
              <thead><tr><th>ক্রম</th><th>বিষয়</th><th>পূর্ণমান</th><th>পাস</th><th>প্রাপ্ত নম্বর</th><th>গ্রেড</th><th>GP</th><th>অবস্থা</th></tr></thead>
              <tbody>
                {result.subjects.map((subject, index) => (
                  <tr key={subject.id} className={!subject.isPassed ? "failed-row" : ""}>
                    <td>{index + 1}</td>
                    <td><b>{subject.name}</b>{subject.isOptional ? <small>ঐচ্ছিক</small> : null}</td>
                    <td>{formatNumber(subject.fullMarks)}</td>
                    <td>{formatNumber(subject.passMarks)}</td>
                    <td>{subject.isAbsent ? "অনুপস্থিত" : formatNumber(subject.obtainedMarks)}</td>
                    <td>{subject.letterGrade}</td>
                    <td>{subject.gradePoint.toFixed(2)}</td>
                    <td><span className={subject.isPassed ? "subject-pass" : "subject-fail"}>{subject.isPassed ? "পাস" : "ফেল"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="result-remarks">
            <b>মন্তব্য:</b> {result.summary.remarks || (result.summary.isPassed ? "Promoted" : "Needs improvement")}
          </div>
          <div className="marksheet-footer">
            <span><CalendarDays size={14} /> প্রকাশের তারিখ: {new Date(result.publication.publishedAt).toLocaleDateString("bn-BD", { dateStyle: "long" })}</span>
            <span>এটি সিস্টেম কর্তৃক প্রস্তুতকৃত ফলাফল।</span>
          </div>
        </section>
      ) : null}
    </div>
  );
}
