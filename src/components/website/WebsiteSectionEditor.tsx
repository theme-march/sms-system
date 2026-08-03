"use client";
import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Plus,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import {
  defaultWebsiteContent,
  type WebsiteContent,
} from "@/src/lib/website-content";

const titles: Record<string, string> = {
  banners: "Banner Slider",
  home: "Home Page",
  about: "About Page",
  "academic-activities": "Academics Page",
  programs: "Programs Page",
  gallery: "Gallery Page",
  events: "Events Page",
  "admission-information": "Admission Page",
  "our-teachers": "Teachers Page",
  facilities: "Facilities Page",
  achievements: "Achievements Page",
  downloads: "Downloads Page",
  contact: "Contact Page",
};
export function WebsiteSectionEditor({ section }: { section: string }) {
  const [content, setContent] = useState<WebsiteContent>(defaultWebsiteContent),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [saved, setSaved] = useState(false);
  const [teacherOptions, setTeacherOptions] = useState<
    Array<{
      id: string;
      employeeCode: string;
      name: string;
      nameEn: string;
      photo?: string;
      designation: string;
      department: string;
      qualification: string;
    }>
  >([]);
  const [downloadClasses, setDownloadClasses] = useState<
    Array<{
      id: string;
      name: string;
      sections: { id: string; name: string }[];
    }>
  >([]);
  useEffect(() => {
    fetch("/api/website?admin=1")
      .then((r) => r.json())
      .then((d) => d.content && setContent(d.content))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (section === "our-teachers" || section === "home")
      fetch("/api/website/teachers")
        .then((r) => r.json())
        .then((d) => Array.isArray(d) && setTeacherOptions(d));
  }, [section]);
  useEffect(() => {
    if (section === "downloads")
      fetch("/api/website/downloads")
        .then((r) => r.json())
        .then((d) => Array.isArray(d.classes) && setDownloadClasses(d.classes));
  }, [section]);
  const save = async () => {
    if (section === "downloads") {
      const invalid = content.downloads.find(
        (item) =>
          !item.title.trim() ||
          !(item.fileUrl.startsWith("/") || /^https?:\/\//i.test(item.fileUrl)),
      );
      if (invalid) {
        alert(
          "প্রতিটি Download Item-এ শিরোনাম দিন এবং একটি ফাইল Upload করুন অথবা সঠিক http/https File URL দিন।",
        );
        return;
      }
    }
    setSaving(true);
    setSaved(false);
    try {
      const teacherSelectionOnly = section === "our-teachers";
      const r = await fetch(
        teacherSelectionOnly ? "/api/website/teachers" : "/api/website",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            teacherSelectionOnly
              ? { teacherIds: content.publicTeacherIds }
              : content,
          ),
        },
      );
      const result = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(result.error || "Content could not be saved.");
      if (result.content) setContent(result.content);
      if (result.publicTeacherIds)
        setContent((p) => ({
          ...p,
          publicTeacherIds: result.publicTeacherIds,
        }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Content could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  };
  const updatePage = (field: string, value: string) =>
    setContent((p) => ({
      ...p,
      pages: p.pages.map((x) =>
        x.slug === section ? { ...x, [field]: value } : x,
      ),
    }));
  const page = content.pages.find((x) => x.slug === section);
  const updateSection = (index: number, field: string, value: string) =>
    setContent((p) => ({
      ...p,
      pages: p.pages.map((x) =>
        x.slug === section
          ? {
              ...x,
              sections: (x.sections || []).map((s, i) =>
                i === index ? { ...s, [field]: value } : s,
              ),
            }
          : x,
      ),
    }));
  const addSection = () =>
    setContent((p) => ({
      ...p,
      pages: p.pages.map((x) =>
        x.slug === section
          ? {
              ...x,
              sections: [
                ...(x.sections || []),
                { heading: "", content: "", image: "" },
              ],
            }
          : x,
      ),
    }));
  const removeSection = (index: number) =>
    setContent((p) => ({
      ...p,
      pages: p.pages.map((x) =>
        x.slug === section
          ? { ...x, sections: (x.sections || []).filter((_, i) => i !== index) }
          : x,
      ),
    }));
  const addDownload = () =>
    setContent((p) => ({
      ...p,
      downloads: [
        ...p.downloads,
        {
          title: "",
          category: "FORM",
          fileUrl: "",
          classId: "",
          sectionId: "",
          publishedAt: new Date().toISOString().slice(0, 10),
        },
      ],
    }));
  const updateDownload = (index: number, field: string, value: string) =>
    setContent((p) => ({
      ...p,
      downloads: p.downloads.map((d, i) =>
        i === index
          ? {
              ...d,
              [field]: value,
              ...(field === "classId" ? { sectionId: "" } : {}),
            }
          : d,
      ),
    }));
  if (loading)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
        Content loading…
      </div>
    );
  return (
    <div className="space-y-6">
      <PageHeader
        title={titles[section]}
        subtitle={`Edit and publish the public ${titles[section].toLowerCase()} content`}
        breadcrumbs={[
          { label: "Website Settings", href: "/dashboard/website-settings" },
          { label: titles[section] },
        ]}
        action={
          <a
            href={
              section === "home"
                ? "/"
                : section === "banners"
                  ? "/"
                  : `/${section}`
            }
            target="_blank"
            className="btn-secondary"
          >
            <Eye className="h-4 w-4" />
            Preview Page
          </a>
        }
      />
      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Content published successfully.
        </div>
      )}
      {section === "downloads" && (
        <DownloadItems
          content={content}
          setContent={setContent}
          classes={downloadClasses}
          add={addDownload}
          update={updateDownload}
        />
      )}
      {section === "banners" && (
        <Card
          title="Banner Slides"
          action={
            <button
              className="btn-secondary"
              onClick={() =>
                setContent((p) => ({
                  ...p,
                  banners: [
                    ...p.banners,
                    {
                      title: "",
                      subtitle: "",
                      image: "",
                      buttonText: "",
                      buttonHref: "",
                    },
                  ],
                }))
              }
            >
              <Plus className="h-4 w-4" />
              Add Slide
            </button>
          }
        >
          <div className="space-y-4">
            {content.banners.map((b, i) => (
              <div
                key={i}
                className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 lg:grid-cols-5"
              >
                <Field
                  label="Slide Title"
                  value={b.title}
                  onChange={(v) =>
                    setContent((p) => ({
                      ...p,
                      banners: p.banners.map((x, n) =>
                        n === i ? { ...x, title: v } : x,
                      ),
                    }))
                  }
                />
                <Field
                  label="Subtitle"
                  value={b.subtitle}
                  onChange={(v) =>
                    setContent((p) => ({
                      ...p,
                      banners: p.banners.map((x, n) =>
                        n === i ? { ...x, subtitle: v } : x,
                      ),
                    }))
                  }
                />
                <Field
                  label="Image URL"
                  value={b.image}
                  onChange={(v) =>
                    setContent((p) => ({
                      ...p,
                      banners: p.banners.map((x, n) =>
                        n === i ? { ...x, image: v } : x,
                      ),
                    }))
                  }
                />
                <Field
                  label="Button Text"
                  value={b.buttonText || ""}
                  onChange={(v) =>
                    setContent((p) => ({
                      ...p,
                      banners: p.banners.map((x, n) =>
                        n === i ? { ...x, buttonText: v } : x,
                      ),
                    }))
                  }
                />
                <div className="flex items-end gap-2">
                  <Field
                    label="Button Link"
                    value={b.buttonHref || ""}
                    onChange={(v) =>
                      setContent((p) => ({
                        ...p,
                        banners: p.banners.map((x, n) =>
                          n === i ? { ...x, buttonHref: v } : x,
                        ),
                      }))
                    }
                  />
                  <button
                    className="mb-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
                    onClick={() =>
                      setContent((p) => ({
                        ...p,
                        banners: p.banners.filter((_, n) => n !== i),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      {section === "home" && (
        <HomePageManager
          content={content}
          setContent={setContent}
          teachers={teacherOptions}
        />
      )}
      {page && (
        <>
          <Card title={`${page.title} — Page Introduction`}>
            <div className="space-y-5">
              <Field
                label="Page Title"
                value={page.title}
                onChange={(v) => updatePage("title", v)}
              />
              <Field
                label="Header Image URL"
                value={page.image || ""}
                onChange={(v) => updatePage("image", v)}
              />
              <Area
                label="Introduction / Overview"
                value={page.content}
                onChange={(v) => updatePage("content", v)}
              />
              {section === "contact" && (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <b className="block text-sm text-slate-800">
                    Homepage & Contact Page Office Details
                  </b>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field
                      label="School Address"
                      value={content.contactAddress}
                      onChange={(v) =>
                        setContent((p) => ({ ...p, contactAddress: v }))
                      }
                    />
                    <Field
                      label="Phone Number"
                      value={content.contactPhone}
                      onChange={(v) =>
                        setContent((p) => ({ ...p, contactPhone: v }))
                      }
                    />
                    <Field
                      label="Email Address"
                      value={content.contactEmail}
                      onChange={(v) =>
                        setContent((p) => ({ ...p, contactEmail: v }))
                      }
                    />
                  </div>
                  <Area
                    label="Office Hours / Additional Contact Text"
                    value={content.contactText}
                    onChange={(v) =>
                      setContent((p) => ({ ...p, contactText: v }))
                    }
                  />
                </div>
              )}
            </div>
          </Card>
          {section === "our-teachers" && (
            <Card title="Website-এ প্রদর্শিত শিক্ষক নির্বাচন">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Teacher Directory থেকে যাদের public website-এ দেখাতে চান তাদের
                  নির্বাচন করুন।
                </p>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                  Selected: {content.publicTeacherIds.length}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {teacherOptions.map((t) => {
                  const checked = content.publicTeacherIds.includes(t.id);
                  return (
                    <label
                      key={t.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${checked ? "border-teal-300 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-teal-600"
                        checked={checked}
                        onChange={(e) =>
                          setContent((p) => ({
                            ...p,
                            publicTeacherIds: e.target.checked
                              ? [...p.publicTeacherIds, t.id]
                              : p.publicTeacherIds.filter((id) => id !== t.id),
                          }))
                        }
                      />
                      {t.photo ? (
                        <img
                          src={t.photo}
                          alt=""
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
                          {t.name.slice(0, 1)}
                        </span>
                      )}
                      <span className="min-w-0">
                        <b className="block truncate text-sm text-slate-900">
                          {t.name}
                        </b>
                        <small className="block truncate text-slate-500">
                          {t.designation}
                          {t.department ? ` · ${t.department}` : ""}
                        </small>
                        <small className="text-[10px] text-slate-400">
                          {t.employeeCode}
                        </small>
                      </span>
                    </label>
                  );
                })}
                {teacherOptions.length === 0 && (
                  <p className="col-span-full rounded-lg bg-slate-50 p-6 text-center text-xs text-slate-500">
                    Active teacher record পাওয়া যায়নি। আগে Teachers Roster-এ
                    শিক্ষক যোগ করুন।
                  </p>
                )}
              </div>
            </Card>
          )}
          <Card
            title="Detailed Content Sections"
            action={
              <button className="btn-secondary" onClick={addSection}>
                <Plus className="h-4 w-4" />
                Add Section
              </button>
            }
          >
            <div className="space-y-4">
              {(page.sections || []).length === 0 && (
                <p className="rounded-lg bg-slate-50 p-5 text-center text-xs text-slate-500">
                  No detailed sections yet. Click Add Section.
                </p>
              )}
              {(page.sections || []).map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <b className="text-xs text-slate-600">Section {i + 1}</b>
                    <button
                      className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
                      onClick={() => removeSection(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Section Heading"
                      value={item.heading}
                      onChange={(v) => updateSection(i, "heading", v)}
                    />
                    <Field
                      label="Section Image URL"
                      value={item.image || ""}
                      onChange={(v) => updateSection(i, "image", v)}
                    />
                    <div className="md:col-span-2">
                      <Area
                        label="Section Content"
                        value={item.content}
                        onChange={(v) => updateSection(i, "content", v)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      <div className="flex justify-end">
        <button
          className="btn-primary min-w-44"
          onClick={save}
          disabled={saving}
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save & Publish"}
        </button>
      </div>
    </div>
  );
}
function HomePageManager({
  content,
  setContent,
  teachers,
}: {
  content: WebsiteContent;
  setContent: React.Dispatch<React.SetStateAction<WebsiteContent>>;
  teachers: Array<{
    id: string;
    employeeCode: string;
    name: string;
    photo?: string;
    designation: string;
    department: string;
  }>;
}) {
  const updateList = (
    key:
      | "notices"
      | "academics"
      | "gallery"
      | "meetingDates"
      | "emergencyContacts"
      | "campaignLinks",
    index: number,
    field: string,
    value: string | boolean,
  ) =>
    setContent((p) => ({
      ...p,
      [key]: p[key].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  const remove = (
    key:
      | "notices"
      | "academics"
      | "gallery"
      | "meetingDates"
      | "emergencyContacts"
      | "campaignLinks",
    index: number,
  ) =>
    setContent((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== index) }));
  return (
    <>
      <Card
        title="Notice Board"
        action={
          <button
            className="btn-secondary"
            onClick={() =>
              setContent((p) => ({
                ...p,
                notices: [
                  ...p.notices,
                  { title: "", date: "", href: "", featured: false },
                ],
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Add Notice
          </button>
        }
      >
        <HomeNoticeList
          items={content.notices}
          update={(i, f, v) => updateList("notices", i, f, v)}
          remove={(i) => remove("notices", i)}
        />
      </Card>
      <Card title="About School & Principal Message">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="About Section Title"
            value={content.aboutTitle}
            onChange={(v) => setContent((p) => ({ ...p, aboutTitle: v }))}
          />
          <Field
            label="Principal Name / Title"
            value={content.principalName}
            onChange={(v) => setContent((p) => ({ ...p, principalName: v }))}
          />
          <Area
            label="About School"
            value={content.aboutText}
            onChange={(v) => setContent((p) => ({ ...p, aboutText: v }))}
          />
          <Area
            label="Principal Message"
            value={content.principalMessage}
            onChange={(v) => setContent((p) => ({ ...p, principalMessage: v }))}
          />
          <Field
            label="Principal Photo URL"
            value={content.principalImage}
            onChange={(v) => setContent((p) => ({ ...p, principalImage: v }))}
          />
        </div>
      </Card>
      <Card
        title="Academic Program Cards"
        action={
          <button
            className="btn-secondary"
            onClick={() =>
              setContent((p) => ({
                ...p,
                academics: [...p.academics, { title: "", text: "" }],
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Add Program
          </button>
        }
      >
        <HomeList
          items={content.academics}
          fields={[
            ["title", "Program Title"],
            ["text", "Description"],
          ]}
          update={(i, f, v) => updateList("academics", i, f, v)}
          remove={(i) => remove("academics", i)}
        />
      </Card>
      <Card
        title="Homepage Photo Gallery"
        action={
          <button
            className="btn-secondary"
            onClick={() =>
              setContent((p) => ({
                ...p,
                gallery: [...p.gallery, { title: "", image: "" }],
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Add Photo
          </button>
        }
      >
        <HomeList
          items={content.gallery}
          fields={[
            ["title", "Photo Caption"],
            ["image", "Image URL"],
          ]}
          update={(i, f, v) => updateList("gallery", i, f, v)}
          remove={(i) => remove("gallery", i)}
        />
      </Card>
      <Card title="Homepage Teacher Profiles">
        <p className="mb-4 text-xs text-slate-500">
          Teacher Directory থেকে শুধু homepage-এ যাদের দেখাবেন তাদের নির্বাচন
          করুন। Teachers page-এর নির্বাচন আলাদা থাকবে।
        </p>
        <div className="mb-4 flex justify-end">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            Homepage selected: {content.homeTeacherIds.length}/4
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {teachers.map((t) => {
            const checked = content.homeTeacherIds.includes(t.id);
            const selectionFull = content.homeTeacherIds.length >= 4;
            return (
              <label
                key={t.id}
                className={`flex items-center gap-3 rounded-xl border p-3 ${checked ? "cursor-pointer border-teal-300 bg-teal-50" : selectionFull ? "cursor-not-allowed border-slate-200 opacity-55" : "cursor-pointer border-slate-200"}`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-teal-600"
                  checked={checked}
                  disabled={!checked && selectionFull}
                  onChange={(e) =>
                    setContent((p) => ({
                      ...p,
                      homeTeacherIds: e.target.checked
                        ? [...p.homeTeacherIds, t.id]
                        : p.homeTeacherIds.filter((id) => id !== t.id),
                    }))
                  }
                />
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 font-bold">
                    {t.name.slice(0, 1)}
                  </span>
                )}
                <span className="min-w-0">
                  <b className="block truncate text-xs">{t.name}</b>
                  <small className="block truncate text-slate-500">
                    {t.designation}
                    {t.department ? ` · ${t.department}` : ""}
                  </small>
                </span>
              </label>
            );
          })}
          {teachers.length === 0 && (
            <p className="col-span-full rounded-lg bg-slate-50 p-5 text-center text-xs text-slate-500">
              Teacher Directory-তে active শিক্ষক পাওয়া যায়নি।
            </p>
          )}
        </div>
      </Card>
      <Card
        title="School Calendar"
        action={
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              setContent((p) => ({
                ...p,
                meetingDates: [
                  ...p.meetingDates,
                  { date: "", label: "", type: "EVENT" },
                ],
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Add Calendar Item
          </button>
        }
      >
        <p className="mb-4 text-xs text-slate-500">
          Add meetings, school events and special holidays. Visitors can hover
          or focus a date to see its details. Date format: YYYY-MM-DD.
        </p>
        <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <b className="mb-3 block text-xs text-slate-700">
            Weekly School Off Days
          </b>
          <div className="flex flex-wrap gap-2">
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day, dayIndex) => {
              const checked = content.calendarWeeklyOffDays.includes(dayIndex);
              return (
                <label
                  key={day}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs ${checked ? "border-teal-300 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-600"}`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-teal-600"
                    checked={checked}
                    onChange={(event) =>
                      setContent((previous) => ({
                        ...previous,
                        calendarWeeklyOffDays: event.target.checked
                          ? [...previous.calendarWeeklyOffDays, dayIndex].sort(
                              (a, b) => a - b,
                            )
                          : previous.calendarWeeklyOffDays.filter(
                              (savedDay) => savedDay !== dayIndex,
                            ),
                      }))
                    }
                  />
                  {day}
                </label>
              );
            })}
          </div>
        </div>
        <CalendarEntryList
          items={content.meetingDates}
          update={(i, f, v) => updateList("meetingDates", i, f, v)}
          remove={(i) => remove("meetingDates", i)}
        />
      </Card>
      <Card
        title="Sidebar Emergency Contacts"
        action={
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              setContent((p) => ({
                ...p,
                emergencyContacts: [
                  ...p.emergencyContacts,
                  { label: "", number: "" },
                ],
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </button>
        }
      >
        <HomeList
          items={content.emergencyContacts}
          fields={[
            ["label", "Service Name"],
            ["number", "Hotline Number"],
          ]}
          update={(i, f, v) => updateList("emergencyContacts", i, f, v)}
          remove={(i) => remove("emergencyContacts", i)}
        />
      </Card>
      <Card
        title="Sidebar Campaign Links"
        action={
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              setContent((p) => ({
                ...p,
                campaignLinks: [...p.campaignLinks, { label: "", href: "" }],
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Add Campaign
          </button>
        }
      >
        <HomeList
          items={content.campaignLinks}
          fields={[
            ["label", "Campaign Name"],
            ["href", "Campaign Link"],
          ]}
          update={(i, f, v) => updateList("campaignLinks", i, f, v)}
          remove={(i) => remove("campaignLinks", i)}
        />
      </Card>
      <Card title="Homepage Admission & Contact">
        <div className="grid gap-4 md:grid-cols-2">
          <Area
            label="Admission Information"
            value={content.admissionText}
            onChange={(v) => setContent((p) => ({ ...p, admissionText: v }))}
          />
          <Area
            label="Contact Office Text"
            value={content.contactText}
            onChange={(v) => setContent((p) => ({ ...p, contactText: v }))}
          />
        </div>
      </Card>
    </>
  );
}
function HomeList({
  items,
  fields,
  update,
  remove,
}: {
  items: Array<Record<string, string>>;
  fields: string[][];
  update: (index: number, field: string, value: string) => void;
  remove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="grid items-end gap-3 rounded-lg border border-slate-200 bg-slate-50/40 p-3 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))_40px]"
        >
          {fields.map(([field, label]) => (
            <Field
              key={field}
              label={label}
              value={item[field] || ""}
              onChange={(v) => update(i, field, v)}
            />
          ))}
          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
            onClick={() => remove(i)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="rounded-lg bg-slate-50 p-5 text-center text-xs text-slate-500">
          No items added yet.
        </p>
      )}
    </div>
  );
}

function CalendarEntryList({
  items,
  update,
  remove,
}: {
  items: WebsiteContent["meetingDates"];
  update: (index: number, field: string, value: string) => void;
  remove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="grid items-end gap-3 rounded-lg border border-slate-200 bg-slate-50/40 p-3 md:grid-cols-[minmax(160px,0.8fr)_minmax(220px,1.5fr)_minmax(150px,0.7fr)_40px]"
        >
          <Field
            label="Date"
            value={item.date}
            onChange={(value) => update(index, "date", value)}
          />
          <Field
            label="Title / Details"
            value={item.label}
            onChange={(value) => update(index, "label", value)}
          />
          <label className="block w-full">
            <span className="field-label">Type</span>
            <select
              className="form-input"
              value={item.type}
              onChange={(event) => update(index, "type", event.target.value)}
            >
              <option value="MEETING">Meeting</option>
              <option value="EVENT">Event</option>
              <option value="HOLIDAY">Holiday / School Closed</option>
            </select>
          </label>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
            onClick={() => remove(index)}
            aria-label="Remove calendar item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="rounded-lg bg-slate-50 p-5 text-center text-xs text-slate-500">
          No calendar items added yet.
        </p>
      )}
    </div>
  );
}

function HomeNoticeList({
  items,
  update,
  remove,
}: {
  items: WebsiteContent["notices"];
  update: (index: number, field: string, value: string | boolean) => void;
  remove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="grid items-end gap-3 rounded-lg border border-slate-200 bg-slate-50/40 p-3 md:grid-cols-[minmax(220px,2fr)_minmax(140px,1fr)_minmax(180px,1fr)_150px_40px]"
        >
          <Field
            label="Notice Title"
            value={item.title}
            onChange={(v) => update(i, "title", v)}
          />
          <Field
            label="Date"
            value={item.date}
            onChange={(v) => update(i, "date", v)}
          />
          <Field
            label="Optional Link"
            value={item.href || ""}
            onChange={(v) => update(i, "href", v)}
          />
          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 accent-teal-600"
              checked={Boolean(item.featured)}
              onChange={(e) => update(i, "featured", e.target.checked)}
            />
            Homepage-এ দেখান
          </label>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
            onClick={() => remove(i)}
            aria-label="Remove notice"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="rounded-lg bg-slate-50 p-5 text-center text-xs text-slate-500">
          No notices added yet.
        </p>
      )}
    </div>
  );
}

function DownloadItems({
  content,
  setContent,
  classes,
  add,
  update,
}: {
  content: WebsiteContent;
  setContent: React.Dispatch<React.SetStateAction<WebsiteContent>>;
  classes: Array<{
    id: string;
    name: string;
    sections: { id: string; name: string }[];
  }>;
  add: () => void;
  update: (index: number, field: string, value: string) => void;
}) {
  const [uploading, setUploading] = useState<number | null>(null);
  const uploadFile = async (index: number, file?: File) => {
    if (!file) return;
    setUploading(index);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/website/uploads", {
        method: "POST",
        body,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "File upload failed.");
      update(index, "fileUrl", result.url);
      if (!content.downloads[index]?.title.trim())
        update(index, "title", file.name.replace(/\.[^.]+$/, ""));
    } catch (error) {
      alert(error instanceof Error ? error.message : "File upload failed.");
    } finally {
      setUploading(null);
    }
  };
  return (
    <Card
      title="Downloadable Forms, Syllabus & Publications"
      action={
        <button className="btn-secondary" onClick={add}>
          <Plus className="h-4 w-4" />
          Add File
        </button>
      }
    >
      <div className="mb-5 rounded-lg border border-teal-100 bg-teal-50 p-4 text-xs leading-5 text-teal-900">
        <b className="block text-sm">এই সেকশনের কাজ কী?</b>ফরম, সিলেবাস,
        নোটিশ/প্রকাশনা বা অন্য প্রয়োজনীয় ফাইল এখানে Upload করে public Downloads
        পেজে প্রকাশ করুন। ক্লাস রুটিন আলাদাভাবে Class Routine Management থেকে
        স্বয়ংক্রিয়ভাবে আসে।
      </div>
      <div className="space-y-4">
        {content.downloads.map((item, index) => {
          const sections =
            classes.find((c) => c.id === item.classId)?.sections || [];
          const validFile =
            item.fileUrl.startsWith("/") || /^https?:\/\//i.test(item.fileUrl);
          return (
            <div
              key={index}
              className={`rounded-xl border p-4 ${validFile ? "border-slate-200 bg-slate-50/50" : "border-rose-200 bg-rose-50/30"}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <b className="text-xs text-slate-600">
                  Download Item {index + 1}
                </b>
                <button
                  className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
                  onClick={() =>
                    setContent((p) => ({
                      ...p,
                      downloads: p.downloads.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field
                  label="File Title"
                  value={item.title}
                  onChange={(v) => update(index, "title", v)}
                />
                <label>
                  <span className="field-label">Category</span>
                  <select
                    className="form-input"
                    value={item.category}
                    onChange={(e) => update(index, "category", e.target.value)}
                  >
                    <option value="FORM">Form</option>
                    <option value="SYLLABUS">Syllabus</option>
                    <option value="PUBLICATION">Publication</option>
                    <option value="OTHER">Other</option>
                  </select>
                </label>
                <label>
                  <span className="field-label">
                    Upload File (PDF/Word/Excel/Image)
                  </span>
                  <span className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-teal-300 bg-teal-50 px-3 text-xs font-bold text-teal-700 hover:bg-teal-100">
                    <UploadCloud className="h-4 w-4" />
                    {uploading === index ? "Uploading…" : "Choose File"}
                    <input
                      type="file"
                      className="hidden"
                      disabled={uploading === index}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      onChange={(e) => uploadFile(index, e.target.files?.[0])}
                    />
                  </span>
                  {validFile ? (
                    <small className="mt-1 block truncate text-[10px] text-emerald-700">
                      Ready: {item.fileUrl}
                    </small>
                  ) : (
                    <small className="mt-1 block text-[10px] font-bold text-rose-600">
                      কোনো আসল ফাইল Upload করা হয়নি - public পেজে দেখাবে না।
                    </small>
                  )}
                </label>
                <div className="xl:col-span-3">
                  <Field
                    label="Or External File URL (optional)"
                    value={item.fileUrl}
                    onChange={(v) => update(index, "fileUrl", v)}
                  />
                </div>
                <label>
                  <span className="field-label">Class (optional)</span>
                  <select
                    className="form-input"
                    value={item.classId || ""}
                    onChange={(e) => update(index, "classId", e.target.value)}
                  >
                    <option value="">All classes</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="field-label">Section (optional)</span>
                  <select
                    className="form-input"
                    value={item.sectionId || ""}
                    disabled={!item.classId}
                    onChange={(e) => update(index, "sectionId", e.target.value)}
                  >
                    <option value="">All sections</option>
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Publication Date"
                  value={item.publishedAt || ""}
                  onChange={(v) => update(index, "publishedAt", v)}
                />
              </div>
            </div>
          );
        })}
        {content.downloads.length === 0 && (
          <p className="rounded-lg bg-slate-50 p-6 text-center text-xs text-slate-500">
            No downloadable files yet. Click Add File.
          </p>
        )}
      </div>
    </Card>
  );
}
function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-xs">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block w-full">
      <span className="field-label">{label}</span>
      <input
        className="form-input"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea
        rows={7}
        className="form-input resize-y"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
