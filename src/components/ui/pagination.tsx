import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/shared/Typography";

// ============================================================================
// 1. Pure Pagination Control (Numbers & Arrows only)
// ============================================================================
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex items-center gap-2 select-none", className)}
    >
      {/* Previous Button */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="text-lg leading-none disabled:opacity-30 hover:opacity-75 cursor-pointer px-1 text-brand-primary transition-opacity"
        title="Previous page"
      >
        ‹
      </button>

      {/* Page Numbers & Ellipsis */}
      {getPageNumbers().map((page, idx) => {
        if (typeof page === "string") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="px-0.5 tracking-wider text-text-secondary font-normal"
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              "cursor-pointer px-2 py-0.5 rounded text-sm transition-colors",
              isActive
                ? "font-bold text-brand-primary bg-surface-mint"
                : "font-medium text-sidebar-bg/80 hover:text-sidebar-bg hover:bg-surface-soft",
            )}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="text-lg leading-none disabled:opacity-30 hover:opacity-75 cursor-pointer px-1 text-brand-primary transition-opacity"
        title="Next page"
      >
        ›
      </button>
    </nav>
  );
}

// ============================================================================
// 2. Full Pagination Bar (Showing Info + Dropdown + <Pagination />)
// ============================================================================
export type PaginationBarProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount?: number;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelect?: boolean;
  showShowingInfo?: boolean;
  className?: string;
};

export function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 15, 20, 25, 50],
  showPageSizeSelect = true,
  showShowingInfo = true,
  className,
}: PaginationBarProps) {
  const hasShowingInfo = showShowingInfo && totalCount !== undefined;
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount ?? 0);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border select-none",
        className,
      )}
    >
      {/* 1. Left: Showing entries text */}
      {hasShowingInfo ? (
        <Typography variant="muted" className="text-xs text-text-secondary">
          Showing {startItem}-{endItem} of {totalCount}
        </Typography>
      ) : (
        <div />
      )}

      {/* 2. Right: Page Size Dropdown + Inner <Pagination /> */}
      <div className="flex items-center gap-4">
        {showPageSizeSelect && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-medium text-sidebar-bg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:border-border-input transition-colors"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} per page
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pure Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

export default PaginationBar;
