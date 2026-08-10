"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, FilePlus2, Plus, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import {
  defaultWebsiteContent,
  type WebsiteContent,
} from "@/src/lib/website-content";

const builtInSlugs = new Set(
  defaultWebsiteContent.pages.map((page) => page.slug),
);

export function CustomPagesManager() {
  const [content, setContent] = useState<WebsiteContent>(defaultWebsiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/website?admin=1")
      .then((response) => response.json())
      .then((data) => data.content && setContent(data.content))
      .finally(() => setLoading(false));
  }, []);

  const customPages = useMemo(
    () =>
      content.pages
        .map((page, index) => ({ page, index }))
        .filter(({ page }) => page.custom || !builtInSlugs.has(page.slug)),
    [content.pages],
  );

  const addPage = () => {
    let number = customPages.length + 1;
    let slug = `custom-page-${number}`;
    while (content.pages.some((page) => page.slug === slug)) {
      number += 1;
      slug = `custom-page-${number}`;
    }
    setContent((previous) => ({
      ...previous,
      pages: [
        ...previous.pages,
        {
          slug,
          title: "নতুন কাস্টম পেজ",
          content: "এই পেজের পরিচিতি লিখুন।",
          image: "",
          sections: [],
          custom: true,
        },
      ],
    }));
  };

  const updatePage = (
    pageIndex: number,
    field: "slug" | "title" | "content" | "image",
    value: string,
  ) =>
    setContent((previous) => {
      const currentPage = previous.pages[pageIndex];
      if (!currentPage) return previous;
      const oldHref = `/${currentPage.slug}`;
      const newHref =
        field === "slug" ? `/${value.replace(/^\/+/, "")}` : oldHref;
      const pages = previous.pages.map((page, index) =>
        index === pageIndex ? { ...page, [field]: value, custom: true } : page,
      );
      const menu = previous.menu.map((item) => ({
        ...item,
        ...(item.href === oldHref
          ? {
              href: newHref,
              ...(field === "title" && item.label === currentPage.title
                ? { label: value }
                : {}),
            }
          : {}),
        children: item.children?.map((child) => ({
          ...child,
          ...(child.href === oldHref
            ? {
                href: newHref,
                ...(field === "title" && child.label === currentPage.title
                  ? { label: value }
                  : {}),
              }
            : {}),
        })),
      }));
      return { ...previous, pages, menu };
    });

  const addSection = (pageIndex: number) =>
    setContent((previous) => ({
      ...previous,
      pages: previous.pages.map((page, index) =>
        index === pageIndex
          ? {
              ...page,
              sections: [
                ...(page.sections || []),
                { heading: "নতুন সেকশন", content: "", image: "" },
              ],
            }
          : page,
      ),
    }));

  const updateSection = (
    pageIndex: number,
    sectionIndex: number,
    field: "heading" | "content" | "image",
    value: string,
  ) =>
    setContent((previous) => ({
      ...previous,
      pages: previous.pages.map((page, index) =>
        index === pageIndex
          ? {
              ...page,
              sections: (page.sections || []).map((section, itemIndex) =>
                itemIndex === sectionIndex
                  ? { ...section, [field]: value }
                  : section,
              ),
            }
          : page,
      ),
    }));

  const removeSection = (pageIndex: number, sectionIndex: number) =>
    setContent((previous) => ({
      ...previous,
      pages: previous.pages.map((page, index) =>
        index === pageIndex
          ? {
              ...page,
              sections: (page.sections || []).filter(
                (_, itemIndex) => itemIndex !== sectionIndex,
              ),
            }
          : page,
      ),
    }));

  const toggleNavbar = (pageIndex: number, enabled: boolean) =>
    setContent((previous) => {
      const page = previous.pages[pageIndex];
      if (!page) return previous;
      const href = `/${page.slug}`;
      return {
        ...previous,
        menu: enabled
          ? previous.menu.some((item) => item.href === href)
            ? previous.menu
            : [
                ...previous.menu,
                { label: page.title, href, color: "#0f766e", children: [] },
              ]
          : previous.menu.filter((item) => item.href !== href),
      };
    });

  const removePage = (pageIndex: number) => {
    const page = content.pages[pageIndex];
    if (!page) return;
    if (!window.confirm(`Delete “${page.title}” custom page?`)) return;
    const href = `/${page.slug}`;
    setContent((previous) => ({
      ...previous,
      pages: previous.pages.filter((_, index) => index !== pageIndex),
      menu: previous.menu
        .filter((item) => item.href !== href)
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) => child.href !== href),
        })),
    }));
  };

  const save = async () => {
    const normalizedSlugs = customPages.map(({ page }) => page.slug.trim());
    const invalidPage = customPages.find(
      ({ page }) =>
        !page.title.trim() ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.slug.trim()) ||
        builtInSlugs.has(page.slug.trim()),
    );
    if (invalidPage) {
      alert(
        "প্রতিটি custom page-এ title দিন এবং slug ছোট হাতের ইংরেজি অক্ষর, সংখ্যা ও hyphen দিয়ে লিখুন। Built-in page slug ব্যবহার করা যাবে না।",
      );
      return;
    }
    if (new Set(normalizedSlugs).size !== normalizedSlugs.length) {
      alert("প্রতিটি custom page-এর slug আলাদা হতে হবে।");
      return;
    }

    setSaving(true);
    setSaved(false);
    try {
      const response = await fetch("/api/website?section=custom-pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Custom pages could not be saved.");
      if (result.content) setContent(result.content);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Custom pages could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
        Custom pages loading…
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Custom Pages"
        subtitle="Create new public website pages and manage their content"
        breadcrumbs={[
          { label: "Website Settings", href: "/dashboard/website-settings" },
          { label: "Custom Pages" },
        ]}
        action={
          <button type="button" onClick={addPage} className="btn-primary">
            <FilePlus2 className="h-4 w-4" />
            Add Custom Page
          </button>
        }
      />

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Custom pages published successfully.
        </div>
      )}

      {customPages.map(({ page, index: pageIndex }, displayIndex) => {
        const href = `/${page.slug}`;
        const inNavbar = content.menu.some((item) => item.href === href);
        return (
          <section
            key={`${page.slug}-${pageIndex}`}
            className="rounded-xl border border-slate-200 bg-white shadow-xs"
          >
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Custom Page {displayIndex + 1}: {page.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Public URL: {href}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={inNavbar}
                    onChange={(event) =>
                      toggleNavbar(pageIndex, event.target.checked)
                    }
                    className="h-4 w-4 accent-teal-600"
                  />
                  Show in Navbar
                </label>
                <a href={href} target="_blank" className="btn-secondary">
                  <Eye className="h-4 w-4" />
                  Preview
                </a>
                <button
                  type="button"
                  onClick={() => removePage(pageIndex)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
                  aria-label={`Delete ${page.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div className="space-y-5 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Page Title"
                  value={page.title}
                  onChange={(value) => updatePage(pageIndex, "title", value)}
                />
                <Field
                  label="Page Slug"
                  value={page.slug}
                  hint="Example: school-history → /school-history"
                  onChange={(value) =>
                    updatePage(
                      pageIndex,
                      "slug",
                      value.toLowerCase().replace(/\s+/g, "-"),
                    )
                  }
                />
                <Field
                  label="Header Image URL"
                  value={page.image || ""}
                  onChange={(value) => updatePage(pageIndex, "image", value)}
                />
              </div>
              <Area
                label="Page Introduction"
                value={page.content}
                onChange={(value) => updatePage(pageIndex, "content", value)}
              />

              <div className="border-t border-slate-100 pt-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Detailed Content Sections
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Add as many detailed sections as this page needs.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addSection(pageIndex)}
                    className="btn-secondary"
                  >
                    <Plus className="h-4 w-4" />
                    Add Section
                  </button>
                </div>

                <div className="space-y-3">
                  {(page.sections || []).map((section, sectionIndex) => (
                    <div
                      key={sectionIndex}
                      className="rounded-xl border border-slate-200 bg-slate-50/40 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <b className="text-xs text-slate-700">
                          Section {sectionIndex + 1}
                        </b>
                        <button
                          type="button"
                          onClick={() => removeSection(pageIndex, sectionIndex)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
                          aria-label={`Remove section ${sectionIndex + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field
                          label="Section Heading"
                          value={section.heading}
                          onChange={(value) =>
                            updateSection(
                              pageIndex,
                              sectionIndex,
                              "heading",
                              value,
                            )
                          }
                        />
                        <Field
                          label="Section Image URL"
                          value={section.image || ""}
                          onChange={(value) =>
                            updateSection(
                              pageIndex,
                              sectionIndex,
                              "image",
                              value,
                            )
                          }
                        />
                      </div>
                      <div className="mt-4">
                        <Area
                          label="Section Content"
                          value={section.content}
                          onChange={(value) =>
                            updateSection(
                              pageIndex,
                              sectionIndex,
                              "content",
                              value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                  {(page.sections || []).length === 0 && (
                    <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                      No detailed sections yet. Click Add Section.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {customPages.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <FilePlus2 className="mx-auto h-10 w-10 text-slate-300" />
          <h2 className="mt-4 text-base font-bold text-slate-800">
            No custom pages yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Create a new public page and optionally add it to the navbar.
          </p>
          <button type="button" onClick={addPage} className="btn-primary mt-5">
            <Plus className="h-4 w-4" />
            Create First Page
          </button>
        </div>
      )}

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-primary min-w-44 shadow-lg"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save & Publish Pages"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        className="form-input"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && <small className="mt-1 block text-slate-400">{hint}</small>}
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
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea
        rows={4}
        className="form-input resize-y"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
