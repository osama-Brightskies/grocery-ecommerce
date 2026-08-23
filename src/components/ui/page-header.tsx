import * as React from "react";
import { cn } from "@/lib/utils";
import { Typography } from "../Typography";

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2",
        className,
      )}
    >
      <div>
        <Typography variant="h1" className="text-2xl font-bold text-[#1C2D27]">
          {title}
        </Typography>
        {description && (
          <Typography variant="muted" className="text-sm text-[#64748B] mt-1">
            {description}
          </Typography>
        )}
      </div>

      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

export default PageHeader;
