import * as React from "react";
import { cn } from "@/lib/utils";

function TableContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-card"
      className={cn("w-full bg-white rounded-2xl p-6 shadow-sm", className)}
      {...props}
    />
  );
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-sm text-[#1C2D27] border-separate border-spacing-y-2",
          className
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("border-b border-[#E8EDE9]", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />;
}

function TableRow({
  className,
  isHeader = false,
  ...props
}: React.ComponentProps<"tr"> & { isHeader?: boolean }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        !isHeader &&
          "bg-white even:bg-[#F9FAF9] hover:bg-[#F4F7F4] transition-colors rounded-xl",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "pb-4 px-4 text-center align-middle text-[11px] font-bold tracking-wider text-[#1C2D27] uppercase whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "py-4 px-4 align-middle text-sm font-medium text-[#1C2D27] first:rounded-l-xl last:rounded-r-xl whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}

export {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
};