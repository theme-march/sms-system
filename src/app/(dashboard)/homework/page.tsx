"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  Edit2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { DatabaseEmptyState } from "@/src/components/ui/DatabaseEmptyState";
import { ConfirmDialog } from "@/src/components/ui/ConfirmDialog";

type Homework = {
  id: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  title: string;
  description: string;
  dueDate: string;
  className: string;
  sectionName: string;
  subjectName: string;
  teacherName: string;
};

type Assignment = {
  id: string;
  teacherId: string;
  teacherName: string;
  className: string;
  sectionName: string;
  subjectName: string;
};

type FormState = {
  assignmentId: string;
  title: string;
  description: string;
  dueDate: string;
};

const blankForm: FormState = {
  assignmentId: "",
  title: "",
  description: "",
  dueDate: new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Dhaka",
  }),
};

export default function HomeworkPage() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [isTeacherScope, setIsTeacherScope] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Homework | null>(null);
  const [deleting, setDeleting] = useState<Homework | null>(null);
  const [form, setForm] = useState<FormState>(blankForm);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/homework", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to load homework.");
      }
      setHomeworks(payload.data);
      setAssignments(payload.assignments);
      setCanManage(Boolean(payload.canManage));
      setIsTeacherScope(Boolean(payload.isTeacherScope));
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to load homework.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ ...blankForm, assignmentId: assignments[0]?.id || "" });
    setMessage(null);
    setModalOpen(true);
  }

  function openEdit(item: Homework) {
    const assignment = assignments.find(
      (option) =>
        option.teacherId === item.teacherId &&
        option.className === item.className &&
        option.sectionName === item.sectionName &&
        option.subjectName === item.subjectName,
    );
    setEditing(item);
    setForm({
      assignmentId: assignment?.id || "",
      title: item.title,
      description: item.description,
      dueDate: item.dueDate,
    });
    setMessage(null);
    setModalOpen(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(
        `/api/homework${editing ? `?id=${editing.id}` : ""}`,
        {
          method: editing ? "PUT" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to save homework.");
      }
      setModalOpen(false);
      setMessage({
        type: "success",
        text: editing
          ? "Homework updated successfully."
          : "Homework assigned successfully.",
      });
      await load();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to save homework.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!deleting) return;
    try {
      const response = await fetch(`/api/homework?id=${deleting.id}`, {
        method: "DELETE",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete homework.");
      }
      setDeleting(null);
      setMessage({ type: "success", text: "Homework deleted successfully." });
      await load();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to delete homework.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isTeacherScope ? "My Homework Assignments" : "Homework Assignments"}
        subtitle={
          isTeacherScope
            ? "Create and manage homework for your assigned students"
            : "Create and manage homework records"
        }
        breadcrumbs={[{ label: "Homework" }]}
        action={
          canManage ? (
            <button
              onClick={openCreate}
              disabled={!assignments.length}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add Homework
            </button>
          ) : undefined
        }
      />

      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {canManage && !assignments.length && !loading && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">
          No active Class–Section–Subject assignment is linked to your teacher
          profile. Ask the Academic Admin to create a Teacher Assignment first.
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-44 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-44 animate-pulse rounded-xl bg-slate-100" />
        </div>
      ) : !homeworks.length ? (
        <DatabaseEmptyState
          title="No homework assignments"
          description="Use Add Homework to assign work to students in your assigned classes."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {homeworks.map((item) => (
            <article
              key={item.id}
              className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-teal-700">
                  {item.subjectName}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-rose-600">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(`${item.dueDate}T00:00:00`).toLocaleDateString(
                    "en-GB",
                  )}
                </span>
              </div>
              <div>
                <h2 className="font-bold text-slate-900">{item.title}</h2>
                <p className="mt-1 whitespace-pre-wrap text-xs text-slate-500">
                  {item.description}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>
                  {item.className} · {item.sectionName}
                </span>
                <div className="flex items-center gap-2">
                  {!isTeacherScope && <span>{item.teacherName}</span>}
                  {canManage && (
                    <>
                      <button
                        onClick={() => openEdit(item)}
                        title="Edit homework"
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(item)}
                        title="Delete homework"
                        className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-xs">
          <form
            onSubmit={submit}
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-bold">
                  {editing ? "Edit Homework" : "Add Homework"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Students in the selected class and section will see this on
                  their dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <label className="block">
                <span className="field-label">Class, section & subject</span>
                <select
                  required
                  className="form-input"
                  value={form.assignmentId}
                  onChange={(event) =>
                    setForm({ ...form, assignmentId: event.target.value })
                  }
                >
                  <option value="">Select assignment</option>
                  {assignments.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.className} · {item.sectionName} · {item.subjectName}
                      {!isTeacherScope ? ` · ${item.teacherName}` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="field-label">Homework title</span>
                <input
                  required
                  minLength={2}
                  maxLength={180}
                  className="form-input"
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="e.g. Complete chapter 5 exercises"
                />
              </label>
              <label className="block">
                <span className="field-label">Instructions</span>
                <textarea
                  required
                  minLength={2}
                  rows={5}
                  className="form-input resize-y"
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Write clear homework instructions for students"
                />
              </label>
              <label className="block">
                <span className="field-label">Due date</span>
                <input
                  required
                  type="date"
                  className="form-input"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm({ ...form, dueDate: event.target.value })
                  }
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 p-5">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button disabled={saving} className="btn-primary">
                <Save className="h-4 w-4" />
                {saving
                  ? "Saving…"
                  : editing
                    ? "Save Changes"
                    : "Assign Homework"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Delete homework?"
        description={`"${deleting?.title || "This homework"}" will be permanently deleted.`}
        confirmText="Delete homework"
      />
    </div>
  );
}
