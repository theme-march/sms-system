"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Download, Eye, FileText, Search } from "lucide-react";
type Data = {
  classes: {
    id: string;
    name: string;
    sections: { id: string; name: string }[];
  }[];
  documents: {
    title: string;
    category: string;
    fileUrl: string;
    classId?: string;
    sectionId?: string;
    publishedAt?: string;
  }[];
  routines: {
    id: string;
    weekdayLabel: string;
    period: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    room: string;
  }[];
};
const labels: Record<string, string> = {
  FORM: "ফরম",
  SYLLABUS: "সিলেবাস",
  PUBLICATION: "প্রকাশনা",
  OTHER: "অন্যান্য",
};
export function DownloadCenter() {
  const [data, setData] = useState<Data>({
    classes: [],
    documents: [],
    routines: [],
  });
  const [classId, setClassId] = useState(""),
    [sectionId, setSectionId] = useState(""),
    [category, setCategory] = useState("ALL"),
    [loading, setLoading] = useState(true),
    [searched, setSearched] = useState<{
      category: string;
      classId: string;
      sectionId: string;
    } | null>(null),
    [message, setMessage] = useState(""),
    [resultMinHeight, setResultMinHeight] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setLoading(true);
    fetch("/api/website/downloads", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => !d.error && setData(d))
      .finally(() => setLoading(false));
  }, []);
  const sections = data.classes.find((c) => c.id === classId)?.sections || [];
  const docs = useMemo(
    () =>
      searched && searched.category !== "ROUTINE"
        ? data.documents.filter(
            (d) =>
              (searched.category === "ALL" ||
                d.category === searched.category) &&
              (!d.classId || d.classId === searched.classId) &&
              (!d.sectionId || d.sectionId === searched.sectionId),
          )
        : [],
    [data.documents, searched],
  );
  const changeFilter = () => {
    const currentHeight = resultsRef.current?.offsetHeight || 0;
    if (currentHeight)
      setResultMinHeight((height) => Math.max(height, currentHeight));
    setSearched(null);
    setMessage("");
  };
  useLayoutEffect(() => {
    if (!searched) return;
    const height = resultsRef.current?.scrollHeight || 0;
    if (height) setResultMinHeight((current) => Math.max(current, height));
  }, [searched, docs.length, data.routines.length]);
  const search = async () => {
    setMessage("");
    if (category === "ROUTINE" && (!classId || !sectionId)) {
      setMessage("ক্লাস রুটিন দেখতে শ্রেণি ও সেকশন নির্বাচন করুন।");
      return;
    }
    if (category === "ROUTINE") {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/website/downloads?classId=${encodeURIComponent(classId)}&sectionId=${encodeURIComponent(sectionId)}`,
          { cache: "no-store" },
        );
        const result = await response.json();
        if (!response.ok) throw new Error();
        setData(result);
      } catch {
        setMessage("রুটিন লোড করা যায়নি। আবার চেষ্টা করুন।");
        return;
      } finally {
        setLoading(false);
      }
    }
    setSearched({ category, classId, sectionId });
  };
  return (
    <div className="download-center">
      <section className="download-filter">
        <div className="download-filter-title">
          <Search size={20} />
          <span>
            <b>আপনার প্রয়োজনীয় ফাইল খুঁজুন</b>
            <small>ক্যাটাগরি, শ্রেণি ও সেকশন নির্বাচন করুন</small>
          </span>
        </div>
        <div className="download-filter-grid">
          <label>
            <span>ক্যাটাগরি</span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                changeFilter();
              }}
            >
              <option value="ALL">সব ডকুমেন্ট</option>
              <option value="ROUTINE">ক্লাস রুটিন</option>
              {Object.entries(labels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>শ্রেণি</span>
            <select
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setSectionId("");
                changeFilter();
              }}
            >
              <option value="">শ্রেণি নির্বাচন করুন</option>
              {data.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>সেকশন</span>
            <select
              value={sectionId}
              disabled={!classId}
              onChange={(e) => {
                setSectionId(e.target.value);
                changeFilter();
              }}
            >
              <option value="">সেকশন নির্বাচন করুন</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="download-search-button"
            onClick={search}
            disabled={loading}
          >
            <Search size={17} />
            {loading ? "খোঁজা হচ্ছে…" : "খুঁজুন"}
          </button>
        </div>
        {message && <p className="download-filter-message">{message}</p>}
      </section>
      <div
        ref={resultsRef}
        className="download-results"
        style={resultMinHeight ? { minHeight: resultMinHeight } : undefined}
      >
        {!searched && resultMinHeight > 0 && (
          <p className="download-search-placeholder">
            নতুন নির্বাচন অনুযায়ী ফলাফল দেখতে “খুঁজুন” বাটনে চাপুন।
          </p>
        )}
        {searched?.category === "ROUTINE" && (
          <section className="routine-panel">
            <header>
              <div>
                <h2>ক্লাস রুটিন</h2>
                <p>
                  {data.classes.find((c) => c.id === searched.classId)?.name} —{" "}
                  {
                    data.classes
                      .find((c) => c.id === searched.classId)
                      ?.sections.find((s) => s.id === searched.sectionId)?.name
                  }
                </p>
              </div>
              {data.routines.length > 0 && (
                <a
                  className="download-action primary"
                  href={`/api/website/downloads?classId=${searched.classId}&sectionId=${searched.sectionId}&format=pdf`}
                >
                  <Download size={16} />
                  PDF ডাউনলোড
                </a>
              )}
            </header>
            {loading ? (
              <p className="download-empty">রুটিন লোড হচ্ছে…</p>
            ) : data.routines.length ? (
              <div className="routine-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>দিন</th>
                      <th>পিরিয়ড</th>
                      <th>সময়</th>
                      <th>বিষয়</th>
                      <th>শিক্ষক</th>
                      <th>কক্ষ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.routines.map((r) => (
                      <tr key={r.id}>
                        <td>{r.weekdayLabel}</td>
                        <td>{r.period}</td>
                        <td>
                          {r.startTime}–{r.endTime}
                        </td>
                        <td>
                          <b>{r.subject}</b>
                        </td>
                        <td>{r.teacher}</td>
                        <td>{r.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="download-empty">
                এই শ্রেণি ও সেকশনের কোনো প্রকাশিত রুটিন পাওয়া যায়নি।
              </p>
            )}
          </section>
        )}
        {searched && searched.category !== "ROUTINE" && (
          <section className="document-panel">
            <header>
              <h2>ফরম, সিলেবাস ও প্রকাশনা</h2>
              <span>{docs.length}টি ফাইল</span>
            </header>
            {docs.length ? (
              <div className="document-list">
                {docs.map((d, i) => (
                  <article key={`${d.title}-${i}`}>
                    <span className="document-icon">
                      <FileText size={23} />
                    </span>
                    <div>
                      <span className="document-category">
                        {labels[d.category] || "ডকুমেন্ট"}
                      </span>
                      <h3>{d.title}</h3>
                      {d.publishedAt && <small>প্রকাশ: {d.publishedAt}</small>}
                    </div>
                    <div className="document-actions">
                      <a href={d.fileUrl} target="_blank" rel="noreferrer">
                        <Eye size={16} />
                        দেখুন
                      </a>
                      <a
                        href={d.fileUrl}
                        download
                        className="download-action primary"
                      >
                        <Download size={16} />
                        ডাউনলোড
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="download-empty">
                নির্বাচিত অপশনে কোনো ফাইল পাওয়া যায়নি।
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
