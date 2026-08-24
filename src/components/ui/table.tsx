import * as React from "react";
import { cn } from "@/lib/utils";
import { Typography } from "../Typography";

export interface DataTableProps<T> {
  data: T[];
  isLoading?: boolean;
  paginationBar?: React.ReactNode;
  className?: string;
  renderCell?: (key: string, item: T) => React.ReactNode;
  columnMapping?: Record<string, string>;
  headerLabels?: Record<string, string>;
}

export function DataTable<T extends { id: string | number }>({
  data,
  isLoading = false,
  paginationBar,
  className,
  renderCell,
  columnMapping = {},
  headerLabels = {},
}: DataTableProps<T>) {
  const firstItem = data[0];
  const rawKeys = firstItem ? (Object.keys(firstItem) as string[]) : [];
  const filteredKeys = rawKeys.filter((key) => key !== "id");

  const mappedKeys = filteredKeys.map((key) => columnMapping[key] || key);
  const allColumns = [...mappedKeys, "actions"];

  return (
    <div
      className={cn(
        "w-full bg-card rounded-2xl border border-border p-6 shadow-xs",
        className
      )}
    >
      <div className="relative w-full overflow-x-auto">
        <table className="w-full caption-bottom text-sm border-separate border-spacing-y-2">
          <thead className="border-b border-border">
            <tr>
              {allColumns.map((colKey) => {
                const title =
                  headerLabels[colKey] ||
                  (colKey === "actions"
                    ? "Actions"
                    : colKey.charAt(0).toUpperCase() + colKey.slice(1));
                return (
                  <th
                    key={colKey}
                    className={cn(
                      "pb-4 px-4 text-center align-middle whitespace-nowrap",
                      colKey === "name" && "text-left",
                      colKey === "actions" && "text-right pr-10"
                    )}
                  >
                    <Typography
                      variant="body"
                      className="font-bold text-sidebar-bg uppercase text-[11px] tracking-wider"
                    >
                      {title}
                    </Typography>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={allColumns.length} className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <Typography variant="muted" className="text-muted-foreground">
                      Loading data...
                    </Typography>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={allColumns.length} className="py-12 text-center">
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
                    {allColumns.map((colKey) => {
                      const originalKey =
                        Object.keys(columnMapping).find(
                          (k) => columnMapping[k] === colKey
                        ) || colKey;

                      return (
                        <td
                          key={colKey}
                          className={cn(
                            "py-4 px-4 align-middle text-sm font-medium first:rounded-l-xl last:rounded-r-xl whitespace-nowrap text-center",
                            colKey === "name" && "text-left font-bold text-sidebar-bg",
                            colKey === "category" && "text-muted-foreground font-normal",
                            colKey === "price" && "font-semibold text-sidebar-bg",
                            colKey === "stock" && "font-normal text-sidebar-bg",
                            colKey === "actions" && "text-center "
                          )}
                        >
                          {renderCell ? (
                            renderCell(colKey, item)
                          ) : (
                            <Typography
                              variant="body"
                              className="font-medium text-sidebar-bg"
                            >
                              {colKey !== "actions"
                                ? String(record[originalKey] ?? "")
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