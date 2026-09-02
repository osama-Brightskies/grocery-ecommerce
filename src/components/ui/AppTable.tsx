import * as React from "react";
import {
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { Typography } from "@/components/ui/shared/Typography";
import { cn } from "@/lib/utils";

// 1. Internal features instance (Not exported as a runtime constant to satisfy Fast Refresh)
const defaultTableFeatures = tableFeatures({});
export type DefaultTableFeatures = typeof defaultTableFeatures;

export type AppTableProps<TData extends RowData> = {
  data: TData[];
  columns: ColumnDef<DefaultTableFeatures, TData>[];
  isLoading?: boolean;
  paginationBar?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
};

export function AppTable<TData extends RowData>({
  data,
  columns,
  isLoading = false,
  paginationBar,
  emptyMessage = "No records found.",
  className,
}: AppTableProps<TData>) {
  // 2. Initialize V9 Table
  const table = useTable<DefaultTableFeatures, TData>(
    {
      features: defaultTableFeatures,
      columns,
      data,
    },
    (state) => state,
  );

  return (
    <div
      className={cn(
        "w-full bg-card rounded-2xl border border-border p-6 shadow-xs",
        className,
      )}
    >
      <div className="relative w-full overflow-x-auto">
        <table className="w-full caption-bottom text-sm border-separate border-spacing-y-2">
          {/* Table Header */}
          <thead className="border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="pb-4 px-4 text-center align-middle whitespace-nowrap"
                  >
                    {header.isPlaceholder ? null : (
                      <Typography
                        variant="body"
                        className="font-bold text-sidebar-bg uppercase text-[11px] tracking-wider"
                      >
                        <table.FlexRender header={header} />
                      </Typography>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                    <Typography
                      variant="muted"
                      className="text-text-secondary text-sm"
                    >
                      Loading data...
                    </Typography>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <Typography
                    variant="muted"
                    className="text-text-secondary text-sm"
                  >
                    {emptyMessage}
                  </Typography>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="bg-card even:bg-surface-soft hover:bg-surface-mint transition-colors rounded-xl group"
                >
                  {row.getAllCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="py-4 px-4 align-middle text-sm font-medium first:rounded-l-xl last:rounded-r-xl whitespace-nowrap text-center"
                    >
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar Slot */}
      {paginationBar && <div className="mt-4">{paginationBar}</div>}
    </div>
  );
}

export default AppTable;
