import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger";
  size?: "default" | "figma_white" | "figma_green";
  children?: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "figma_green",
  children,
  className,
  ...props
}: ButtonProps) {
  let styleClasses = "bg-brand-primary text-white hover:bg-brand-accent"; // default primary (#1F7D47)

  if (variant === "outline") {
    styleClasses =
      "border border-border-input bg-transparent text-brand-primary hover:bg-surface-mint";
  } else if (variant === "danger") {
    styleClasses =
      "bg-status-danger-bg text-status-danger-text border border-status-danger-text/20 hover:bg-status-danger-bg/80";
  }

  let sizeClasses = "w-[160px] h-[42px] px-4";
  if (size === "default") {
    sizeClasses = "h-[42px] px-5 py-2";
  } else if (size === "figma_white") {
    sizeClasses = "h-[42px] w-[105px] p-0";
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[8px] text-sm font-medium transition-colors disabled:opacity-50 select-none [&_svg]:size-4",
        styleClasses,
        sizeClasses,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
