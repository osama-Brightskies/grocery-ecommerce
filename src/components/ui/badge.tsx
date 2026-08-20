import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold select-none transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-[#EBF7EE] text-[#1B803A] border border-[#1B803A]/20",
        warning:
          "bg-status-warning-bg text-status-warning-text border border-status-warning-text/20",
        danger:
          "bg-status-danger-bg text-status-danger-text border border-status-danger-text/20",
        outline: "border border-border-input bg-transparent text-sidebar-bg",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "primary",
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {children}
    </span>
  );
}

export default Badge;
