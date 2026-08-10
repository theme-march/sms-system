"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  GalleryHorizontal,
  Globe2,
  GraduationCap,
  Home,
  Image,
  Mail,
  Plus,
  Save,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import {
  defaultWebsiteContent,
  type WebsiteContent,
} from "@/src/lib/website-content";

const websiteSections = [
  {
    title: "Custom Pages",
    description: "Create and manage new public website pages",
    href: "/dashboard/website-settings/custom-pages",
    icon: FileText,
  },
  {
    title: "Banner Slider",
    description: "Homepage banner images, titles and buttons",
    href: "/dashboard/website-settings/banners",
    icon: Image,
  },
  {
    title: "Home Page",
    description: "Homepage notices, cards and featured content",
    href: "/dashboard/website-settings/home",
    icon: Home,
  },
  {
    title: "About Page",
    description: "School introduction and detailed sections",
    href: "/dashboard/website-settings/about",
    icon: Building2,
  },
  {
    title: "Academics Page",
    description: "Academic activities and curriculum content",
    href: "/dashboard/website-settings/academic-activities",
    icon: BookOpen,
  },
  {
    title: "Programs Page",
    description: "Programs, clubs and co-curricular activities",
    href: "/dashboard/website-settings/programs",
    icon: GraduationCap,
  },
  {
    title: "Gallery Page",
    description: "Public gallery page content and sections",
    href: "/dashboard/website-settings/gallery",
    icon: GalleryHorizontal,
  },
  {
    title: "Events Page",
    description: "Upcoming and previous event information",
    href: "/dashboard/website-settings/events",
    icon: CalendarDays,
  },
  {
    title: "Admission Page",
    description: "Admission information and requirements",
    href: "/dashboard/website-settings/admission-information",
    icon: FileText,
  },
  {
    title: "Teachers Page",
    description: "Choose teachers for the public directory",
    href: "/dashboard/website-settings/our-teachers",
    icon: Users,
  },
  {
    title: "Facilities Page",
    description: "Campus facilities and services",
    href: "/dashboard/website-settings/facilities",
    icon: Building2,
  },
  {
    title: "Achievements Page",
    description: "Awards, results and achievements",
    href: "/dashboard/website-settings/achievements",
    icon: Trophy,
  },
  {
    title: "Downloads Page",
    description: "Forms, syllabus, routines and publications",
    href: "/dashboard/website-settings/downloads",
    icon: Download,
  },
  {
    title: "Contact Page",
    description: "Public contact page and office information",
    href: "/dashboard/website-settings/contact",
    icon: Mail,
  },
];

export default function WebsiteSettingsPage() {
  const router = useRouter();
  const [content, setContent] = useState<WebsiteContent>(defaultWebsiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dropdownPageSelections, setDropdownPageSelections] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    fetch("/api/website?admin=1")
      .then((response) => response.json())
      .then((data) => data.content && setContent(data.content))
      .finally(() => setLoading(false));
  }, []);

  const addMenuItem = () =>
    setContent((previous) => ({
      ...previous,
      menu: [
        ...previous.menu,
        {
          label: "নতুন মেনু",
          href: "/new-page",
          color: "#0f766e",
          children: [],
        },
      ],
    }));

  const updateMenuItem = (
    index: number,
    field: "label" | "href" | "color",
    value: string,
  ) =>
    setContent((previous) => ({
      ...previous,
      menu: previous.menu.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));

  const removeMenuItem = (index: number) =>
    setContent((previous) => ({
      ...previous,
      menu: previous.menu.filter((_, itemIndex) => itemIndex !== index),
    }));

  const addDropdownItem = (menuIndex: number) =>
    setContent((previous) => ({
      ...previous,
      menu: previous.menu.map((item, itemIndex) =>
        itemIndex === menuIndex
          ? {
              ...item,
              children: [
                ...(item.children || []),
                { label: "নতুন সাব-মেনু", href: "/new-page" },
              ],
            }
          : item,
      ),
    }));

  const addCustomPageToDropdown = (menuIndex: number) => {
    const slug = dropdownPageSelections[menuIndex];
    const page = content.pages.find(
      (item) => item.custom && item.slug === slug,
    );
    if (!page) return;
    const href = `/${page.slug}`;
    setContent((previous) => ({
      ...previous,
      menu: previous.menu
        .map((item, itemIndex) =>
          itemIndex === menuIndex
            ? {
                ...item,
                children: (item.children || []).some(
                  (child) => child.href === href,
                )
                  ? item.children
                  : [...(item.children || []), { label: page.title, href }],
              }
            : item,
        )
        .filter(
          (item, itemIndex) => itemIndex === menuIndex || item.href !== href,
        ),
    }));
    setDropdownPageSelections((previous) => ({
      ...previous,
      [menuIndex]: "",
    }));
  };

  const updateDropdownItem = (
    menuIndex: number,
    childIndex: number,
    field: "label" | "href",
    value: string,
  ) =>
    setContent((previous) => ({
      ...previous,
      menu: previous.menu.map((item, itemIndex) =>
        itemIndex === menuIndex
          ? {
              ...item,
              children: (item.children || []).map((child, index) =>
                index === childIndex ? { ...child, [field]: value } : child,
              ),
            }
          : item,
      ),
    }));

  const removeDropdownItem = (menuIndex: number, childIndex: number) =>
    setContent((previous) => ({
      ...previous,
      menu: previous.menu.map((item, itemIndex) =>
        itemIndex === menuIndex
          ? {
              ...item,
              children: (item.children || []).filter(
                (_, index) => index !== childIndex,
              ),
            }
          : item,
      ),
    }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const response = await fetch("/api/website?section=overview", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Website settings could not be saved.");
      if (result.content) setContent(result.content);
      router.refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Website settings could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
        Website settings loading…
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Website Settings"
        subtitle="Manage global website settings and open each page editor"
        action={
          <a href="/" target="_blank" className="btn-secondary">
            <Eye className="h-4 w-4" />
            Preview Website
          </a>
        }
        breadcrumbs={[{ label: "Website Settings" }]}
      />

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Global website settings saved successfully.
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white shadow-xs">
        <header className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <Globe2 className="h-4 w-4 text-teal-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Global Header & Identity
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              These settings are shared across the whole public website.
            </p>
          </div>
        </header>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Field
            label="School Tagline"
            value={content.tagline}
            onChange={(value) =>
              setContent((previous) => ({ ...previous, tagline: value }))
            }
          />
          <Field
            label="Fallback Banner Image URL"
            value={content.bannerImage}
            onChange={(value) =>
              setContent((previous) => ({ ...previous, bannerImage: value }))
            }
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-xs">
        <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Shared Theme Palette
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              These colors apply to both the public website and admin dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setContent((previous) => ({
                ...previous,
                theme: { ...defaultWebsiteContent.theme },
              }))
            }
            className="btn-secondary"
          >
            Reset Default Colors
          </button>
        </header>
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <ColorField
            label="Primary / Brick Red"
            value={content.theme.primary}
            onChange={(value) =>
              setContent((previous) => ({
                ...previous,
                theme: { ...previous.theme, primary: value },
              }))
            }
          />
          <ColorField
            label="Secondary / Taupe"
            value={content.theme.secondary}
            onChange={(value) =>
              setContent((previous) => ({
                ...previous,
                theme: { ...previous.theme, secondary: value },
              }))
            }
          />
          <ColorField
            label="Page Background"
            value={content.theme.background}
            onChange={(value) =>
              setContent((previous) => ({
                ...previous,
                theme: { ...previous.theme, background: value },
              }))
            }
          />
          <ColorField
            label="Card Border"
            value={content.theme.border}
            onChange={(value) =>
              setContent((previous) => ({
                ...previous,
                theme: { ...previous.theme, border: value },
              }))
            }
          />
        </div>
        <div
          className="mx-5 mb-5 grid overflow-hidden rounded-lg border sm:grid-cols-4"
          style={{ borderColor: content.theme.border }}
        >
          {[
            ["Primary", content.theme.primary],
            ["Secondary", content.theme.secondary],
            ["Background", content.theme.background],
            ["Border", content.theme.border],
          ].map(([label, color]) => (
            <div
              key={label}
              className="flex min-h-14 items-center justify-center px-3 text-xs font-bold"
              style={{
                backgroundColor: color,
                color:
                  label === "Background" || label === "Border"
                    ? "#29261f"
                    : "#ffffff",
              }}
            >
              {label}: {color}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-xs">
        <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Navigation Menu
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Edit navbar items and add hover dropdown links from here.
            </p>
          </div>
          <button
            type="button"
            onClick={addMenuItem}
            className="btn-secondary shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Menu Item
          </button>
        </header>
        <div className="space-y-3 p-5">
          {content.menu.map((item, index) => (
            <div
              key={`${item.href}-${index}`}
              className="rounded-xl border border-slate-200 bg-slate-50/40 p-4"
            >
              <div className="grid items-end gap-3 md:grid-cols-[1fr_1fr_160px_40px]">
                <Field
                  label="Menu Label"
                  value={item.label}
                  onChange={(value) => updateMenuItem(index, "label", value)}
                />
                <Field
                  label="Page Link"
                  value={item.href}
                  onChange={(value) => updateMenuItem(index, "href", value)}
                />
                <Field
                  label="Text Color"
                  value={item.color}
                  onChange={(value) => updateMenuItem(index, "color", value)}
                />
                <button
                  type="button"
                  onClick={() => removeMenuItem(index)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
                  aria-label={`Remove ${item.label}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      Hover Dropdown Items
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      These related links appear when visitors hover this menu.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addDropdownItem(index)}
                    className="btn-secondary shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Dropdown Item
                  </button>
                </div>

                <div className="mb-3 grid items-end gap-3 rounded-lg border border-teal-100 bg-teal-50/60 p-3 md:grid-cols-[1fr_auto]">
                  <label className="block">
                    <span className="field-label">
                      Add an Existing Custom Page
                    </span>
                    <select
                      className="form-input"
                      value={dropdownPageSelections[index] || ""}
                      onChange={(event) =>
                        setDropdownPageSelections((previous) => ({
                          ...previous,
                          [index]: event.target.value,
                        }))
                      }
                    >
                      <option value="">Select Custom Page</option>
                      {content.pages
                        .filter(
                          (page) =>
                            page.custom &&
                            !(item.children || []).some(
                              (child) => child.href === `/${page.slug}`,
                            ),
                        )
                        .map((page) => (
                          <option key={page.slug} value={page.slug}>
                            {page.title} (/{page.slug})
                          </option>
                        ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => addCustomPageToDropdown(index)}
                    disabled={!dropdownPageSelections[index]}
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add Selected Page
                  </button>
                </div>

                <div className="space-y-2">
                  {(item.children || []).map((child, childIndex) => (
                    <div
                      key={`${child.href}-${childIndex}`}
                      className="grid items-end gap-3 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-[1fr_1fr_40px]"
                    >
                      <Field
                        label="Dropdown Label"
                        value={child.label}
                        onChange={(value) =>
                          updateDropdownItem(index, childIndex, "label", value)
                        }
                      />
                      <Field
                        label="Dropdown Link"
                        value={child.href}
                        onChange={(value) =>
                          updateDropdownItem(index, childIndex, "href", value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeDropdownItem(index, childIndex)}
                        className="grid h-9 w-9 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
                        aria-label={`Remove ${child.label}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {(item.children || []).length === 0 && (
                    <p className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-400">
                      No dropdown items. This menu will open its Page Link
                      directly.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {content.menu.length === 0 && (
            <p className="rounded-lg bg-slate-50 p-6 text-center text-xs text-slate-500">
              No navigation items yet. Click Add Menu Item.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-xs">
        <header className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">Global Footer</h2>
          <p className="mt-1 text-xs text-slate-500">
            Footer text is shared by every public website page.
          </p>
        </header>
        <div className="p-5">
          <Field
            label="Footer Copyright Text"
            value={content.footerText}
            onChange={(value) =>
              setContent((previous) => ({ ...previous, footerText: value }))
            }
          />
        </div>
      </section>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-primary min-w-44 shadow-lg"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save Global Settings"}
        </button>
      </div>

      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Page & Section Management
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Each item opens its own editor, so the same content is not repeated
            on this page.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {websiteSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <b className="block text-sm text-slate-900">
                    {section.title}
                  </b>
                  <small className="mt-1 block leading-5 text-slate-500">
                    {section.description}
                  </small>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Field({
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
      <input
        className="form-input"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const validColor = /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <span className="flex overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
        <input
          type="color"
          value={validColor}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-12 shrink-0 cursor-pointer border-0 bg-transparent p-1"
          aria-label={`${label} color picker`}
        />
        <input
          value={value}
          maxLength={7}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm font-semibold uppercase text-slate-800 outline-none"
          placeholder="#a12b1f"
          aria-label={`${label} hex value`}
        />
      </span>
    </label>
  );
}
