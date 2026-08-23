import * as React from "react";
import { cn } from "@/lib/utils";
import { Typography } from "../Typography";

export interface DataTableProps<T> {
  data: T[];
  isLoading?: boolean;
  paginationBar?: React.ReactNode;
  className?: string;
  customCells?: Partial<Record<keyof T, (item: T) => React.ReactNode>>;
  headerLabels?: Partial<Record<keyof T, string>>;
}

export function DataTable<T extends { id: string | number }>({
  data,
  isLoading = false,
  paginationBar,
  className,
  customCells = {},
  headerLabels = {},
}: DataTableProps<T>) {
  const keys = data.length > 0 ? (Object.keys(data[0]) as (keyof T)[]) : [];
  const filteredKeys = keys.filter((key) => key !== "id");

  return (
    <div
      data-slot="table-card"
      className={cn("w-full bg-white rounded-2xl p-6 shadow-sm", className)}
    >
      <div
        data-slot="table-container"
        className="relative w-full overflow-x-auto"
      >
        <table
          data-slot="table"
          className="w-full caption-bottom text-sm text-[#1C2D27] border-separate border-spacing-y-2"
        >
          <thead data-slot="table-header" className="border-b border-[#E8EDE9]">
            <tr data-slot="table-row">
              {filteredKeys.map((key) => {
                const label =
                  headerLabels[key] ||
                  String(key).charAt(0).toUpperCase() + String(key).slice(1);
                return (
                  <th
                    key={String(key)}
                    data-slot="table-head"
                    className="pb-4 px-4 text-center align-middle text-[11px] font-bold tracking-wider text-[#1C2D27] uppercase whitespace-nowrap"
                  >
                    <Typography
                      variant="body"
                      className="font-bold text-[#1C2D27]"
                    >
                      {label}
                    </Typography>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody data-slot="table-body">
            {isLoading ? (
              <tr>
                <td
                  colSpan={filteredKeys.length}
                  className="py-12 text-center text-[#64748B] font-medium"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#1B803A] border-t-transparent rounded-full animate-spin" />
                    <Typography variant="muted" className="text-[#64748B]">
                      Loading data...
                    </Typography>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={filteredKeys.length}
                  className="py-12 text-center text-[#64748B] font-medium"
                >
                  <Typography variant="muted" className="text-[#64748B]">
                    No records found.
                  </Typography>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  data-slot="table-row"
                  className="bg-white even:bg-[#F9FAF9] hover:bg-[#F4F7F4] transition-colors rounded-xl"
                >
                  {filteredKeys.map((key) => (
                    <td
                      key={String(key)}
                      data-slot="table-cell"
                      className="py-4 px-4 align-middle text-sm font-medium text-[#1C2D27] first:rounded-l-xl last:rounded-r-xl whitespace-nowrap text-center"
                    >
                      {customCells[key] ? (
                        customCells[key]!(item)
                      ) : (
                        <Typography
                          variant="body"
                          className={cn(
                            "font-medium text-[#1C2D27]",
                            String(key) === "category" &&
                              "text-[#64748B] font-normal",
                          )}
                        >
                          {String(item[key] ?? "")}
                        </Typography>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginationBar && <div className="mt-4">{paginationBar}</div>}
    </div>
  );
}

export default DataTable;
