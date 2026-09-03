import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/shared/Typography";

/* ==========================================================================
   1. PURE PAGINATION CONTROL (Page Numbers & Navigation Arrows Only)
   ========================================================================== */

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

/**
 * Pure, lightweight pagination component that renders numbered page buttons,
 * smart ellipsis (...), and previous/next arrow triggers.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  // Generate numbered pages with smart ellipsis for large page counts
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // If 5 or fewer pages, display all numbers directly
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show the first page
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      // Calculate sliding window around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      // Ellipsis before the final page
      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  // Hide component if there is only 1 page or none
  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex items-center gap-2 select-none", className)}
    >
      {/* Previous Page Arrow Button */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="text-lg leading-none disabled:opacity-30 hover:opacity-75 cursor-pointer px-1 text-brand-primary transition-opacity"
        title="Previous page"
      >
        ‹
      </button>

      {/* Numbered Page Buttons & Ellipsis */}
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

      {/* Next Page Arrow Button */}
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

/* ==========================================================================
   2. COMPLETE PAGINATION BAR (Info Text + Dropdown + Inner <Pagination />)
   ========================================================================== */

export type PaginationBarProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount?: number;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelect?: boolean;
  isCurrentPaginationInfoVisible?: boolean;
  className?: string;
};

/**
 * Enterprise-grade composite pagination bar designed for table footers.
 * Features automatic "Showing X-Y of Z" calculations, customizable page-size
 * dropdown selector, and embedded <Pagination /> controls.
 */
export function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 15, 20, 25, 50],
  showPageSizeSelect = true,
  isCurrentPaginationInfoVisible = true,
  className,
}: PaginationBarProps) {
  // Calculate item range ("Showing 1-10 of 32")
  const hasShowingInfo =
    isCurrentPaginationInfoVisible && totalCount !== undefined;
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount ?? 0);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border select-none",
        className,
      )}
    >
      {/* Left: Dynamic Record Count Summary */}
      {hasShowingInfo ? (
        <Typography variant="muted" className="text-xs text-text-secondary">
          Showing {startItem}-{endItem} of {totalCount}
        </Typography>
      ) : (
        <div />
      )}

      {/* Right: Page Size Selector & Numbered Pagination */}
      <div className="flex items-center gap-4">
        {/* Optional Page Size Dropdown */}
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

        {/* Embedded Pure Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

// Default export for standard import convenience
export default PaginationBar;
