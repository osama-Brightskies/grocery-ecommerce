import * as React from "react";
import { Typography } from "@/components/ui/shared/Typography";
import { cn } from "@/lib/utils";

export interface DataTableProps<T> {
  data: T[];
  columns: { key: string; header: string; className?: string }[];
  isLoading?: boolean;
  paginationBar?: React.ReactNode;
  renderCell?: (key: string, item: T) => React.ReactNode;
  columnMapping?: Record<string, string>;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading = false,
  paginationBar,
  renderCell,
  columnMapping = {},
}: DataTableProps<T>) {
  return (
    <div className="w-full bg-card rounded-2xl border border-border p-6 shadow-xs">
      <div className="relative w-full overflow-x-auto">
        <table className="w-full caption-bottom text-sm border-separate border-spacing-y-2">
          <thead className="border-b border-border">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "pb-4 px-4 text-center align-middle whitespace-nowrap",
                    col.key === "name" || col.key === "title"
                      ? "text-left"
                      : "",
                    col.key === "actions" ? "text-right" : "",
                    col.className,
                  )}
                >
                  <Typography
                    variant="body"
                    className="font-bold text-sidebar-bg uppercase text-[11px] tracking-wider"
                  >
                    {col.header}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <Typography
                      variant="muted"
                      className="text-muted-foreground"
                    >
                      Loading data...
                    </Typography>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <Typography variant="muted" className="text-muted-foreground">
                    No records found.
                  </Typography>
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const record = item as unknown as Record<string, unknown>;
                return (
                  <tr
                    key={String(item.id)}
                    className="bg-card even:bg-surface-soft hover:bg-surface-mint transition-colors rounded-xl"
                  >
                    {columns.map((col) => {
                      const originalKey =
                        Object.keys(columnMapping).find(
                          (k) => columnMapping[k] === col.key,
                        ) || col.key;

                      return (
                        <td
                          key={col.key}
                          className={cn(
                            "py-4 px-4 align-middle text-sm font-medium first:rounded-l-xl last:rounded-r-xl whitespace-nowrap text-center",
                            (col.key === "name" || col.key === "title") &&
                              "text-left font-bold text-sidebar-bg",
                            col.key === "category" &&
                              "text-muted-foreground font-normal",
                            col.key === "price" &&
                              "font-semibold text-sidebar-bg",
                            col.key === "actions" && "text-right",
                          )}
                        >
                          {renderCell ? (
                            renderCell(col.key, item)
                          ) : (
                            <Typography
                              variant="body"
                              className="font-medium text-sidebar-bg"
                            >
                              {col.key !== "actions"
                                ? String(record[originalKey] ?? "—")
                                : null}
                            </Typography>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {paginationBar && <div className="mt-4">{paginationBar}</div>}
    </div>
  );
}

export default DataTable;
