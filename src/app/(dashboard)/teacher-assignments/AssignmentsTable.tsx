"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { TablePagination, usePagination } from "@/src/components/tables/TablePagination";

export type AssignmentRow = {
  id: string;
  teacher: string;
  academicYear: string;
  className: string;
  section: string;
  group: string;
  subject: string;
  responsibility: string;
  status: string;
};

export function AssignmentsTable({ assignments }: { assignments: AssignmentRow[] }) {
  const [search, setSearch] = useState("");
  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return assignments;
    return assignments.filter((item) =>
      [item.teacher, item.academicYear, item.className, item.section, item.group, item.subject, item.responsibility, item.status]
        .some((value) => value.toLocaleLowerCase().includes(query)),
    );
  }, [assignments, search]);
  const pagination = usePagination(filteredAssignments, 10);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="flex flex-col gap-2 border-b border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              pagination.setPage(1);
            }}
            placeholder="Search teacher, class, subject or status..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>
        <span className="text-xs font-medium text-slate-500">{filteredAssignments.length} assignment{filteredAssignments.length === 1 ? "" : "s"}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Teacher</th><th className="p-3">Academic year</th><th className="p-3">Class</th><th className="p-3">Section</th><th className="p-3">Group</th><th className="p-3">Subject</th><th className="p-3">Responsibility</th><th className="p-3">Status</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {pagination.pageItems.map((item) => <tr key={item.id} className="hover:bg-slate-50/70"><td className="p-3 font-semibold">{item.teacher}</td><td className="p-3">{item.academicYear}</td><td className="p-3">{item.className}</td><td className="p-3">{item.section}</td><td className="p-3">{item.group}</td><td className="p-3">{item.subject}</td><td className="p-3">{item.responsibility}</td><td className="p-3">{item.status}</td></tr>)}
          </tbody>
        </table>
        {!filteredAssignments.length && <div className="px-4 py-10 text-center text-xs text-slate-400">No assignments match “{search}”.</div>}
      </div>
      <TablePagination {...pagination} />
    </div>
  );
}
