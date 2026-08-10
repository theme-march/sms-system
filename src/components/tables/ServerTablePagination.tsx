import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ServerTablePaginationProps = {
  basePath: string;
  page: number;
  pageSize: number;
  total: number;
  query?: Record<string, string | undefined>;
  className?: string;
};

export function ServerTablePagination({
  basePath,
  page,
  pageSize,
  total,
  query = {},
  className = "",
}: ServerTablePaginationProps) {
  if (!total) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const hrefFor = (nextPage: number, nextPageSize = pageSize) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set("page", String(nextPage));
    params.set("pageSize", String(nextPageSize));
    return `${basePath}?${params.toString()}`;
  };
  const buttonClass = "grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50";

  return (
    <div className={`flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <div className="flex overflow-hidden rounded-lg border border-slate-200">
          {[10, 25, 50, 100].map((size) => (
            <Link
              key={size}
              href={hrefFor(1, size)}
              aria-current={size === pageSize ? "page" : undefined}
              className={`px-2 py-1.5 font-semibold transition ${size === pageSize ? "bg-teal-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              {size}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <span className="whitespace-nowrap font-medium">{start}&ndash;{end} of {total}</span>
        <div className="flex items-center gap-1">
          {page > 1 ? (
            <Link href={hrefFor(page - 1)} aria-label="Previous page" className={buttonClass}><ChevronLeft className="h-4 w-4" /></Link>
          ) : (
            <span aria-disabled="true" className={`${buttonClass} cursor-not-allowed opacity-35`}><ChevronLeft className="h-4 w-4" /></span>
          )}
          <span className="min-w-16 text-center text-[11px] font-semibold text-slate-600">{page} / {totalPages}</span>
          {page < totalPages ? (
            <Link href={hrefFor(page + 1)} aria-label="Next page" className={buttonClass}><ChevronRight className="h-4 w-4" /></Link>
          ) : (
            <span aria-disabled="true" className={`${buttonClass} cursor-not-allowed opacity-35`}><ChevronRight className="h-4 w-4" /></span>
          )}
        </div>
      </div>
    </div>
  );
}
