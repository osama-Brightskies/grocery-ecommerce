import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[8px] text-sm font-medium transition-colors disabled:opacity-50 select-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary text-white hover:bg-brand-accent",
        outline:
          "border border-border-input bg-transparent text-brand-primary hover:bg-surface-mint",
        danger:
          "bg-status-danger-bg text-status-danger-text border border-status-danger-text/20 hover:bg-status-danger-bg/80",
      },
      size: {
        lg: "w-[160px] h-[42px] px-4",
        default: "h-[42px] px-5 py-2",
        md: "h-[42px] w-[105px] p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "lg",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
