"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function usePagination<T>(items: T[], initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return {
    page,
    pageSize,
    pageItems,
    total: items.length,
    totalPages,
    start: items.length ? (page - 1) * pageSize + 1 : 0,
    end: Math.min(page * pageSize, items.length),
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
  };
}

type TablePaginationProps = Omit<ReturnType<typeof usePagination<unknown>>, "pageItems"> & {
  className?: string;
};

export function TablePagination({
  page, pageSize, total, totalPages, start, end, setPage, setPageSize, className = "",
}: TablePaginationProps) {
  if (!total) return null;
  return (
    <div className={`flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <label className="flex items-center gap-2">
        <span>Rows per page</span>
        <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-semibold text-slate-700 outline-none focus:border-teal-500">
          {[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <span className="whitespace-nowrap font-medium">{start}–{end} of {total}</span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} aria-label="Previous page" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"><ChevronLeft className="h-4 w-4" /></button>
          <span className="min-w-16 text-center text-[11px] font-semibold text-slate-600">{page} / {totalPages}</span>
          <button type="button" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} aria-label="Next page" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
