import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

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
      className={cn("flex items-center justify-end select-none py-4 pt-6", className)}
    >
      <div className="flex items-center gap-3 text-sm font-semibold text-[#1B803A]">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="text-lg leading-none disabled:opacity-30 hover:opacity-75 cursor-pointer px-1"
        >
          ‹
        </button>

        {getPageNumbers().map((page, idx) => {
          if (typeof page === "string") {
            return (
              <span key={`ellipsis-${idx}`} className="px-0.5 tracking-wider">
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
                "cursor-pointer px-1 transition-opacity",
                isActive ? "font-bold text-[#1B803A]" : "font-medium opacity-80 hover:opacity-100"
              )}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="text-lg leading-none disabled:opacity-30 hover:opacity-75 cursor-pointer px-1"
        >
          ›
        </button>
      </div>
    </nav>
  );
}

export default Pagination;