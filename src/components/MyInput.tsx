import { forwardRef, type InputHTMLAttributes } from "react";
import { Input } from "./ui/input";
import { Typography } from "./Typography";
import { cn } from "../lib/utils";

type MyInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const MyInput = forwardRef<HTMLInputElement, MyInputProps>(
  ({ label, error, className, type, ...props }, ref) => {
    if (!label) return null;

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", className)}>
        <Typography
          variant="label"
          as="label"
          className="text-text-secondary ml-0.5"
        >
          {label}
        </Typography>

        <Input
          type={type}
          ref={ref}
          className={cn(
            "h-11 w-full bg-white px-4",
            "rounded-[7px] border-border-input",
            "text-sidebar-bg font-normal text-sm placeholder:text-text-subtle",
            "focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary",
            "transition-all duration-200 shadow-none",
            error &&
              "border-status-danger-text focus-visible:ring-status-danger-text",
          )}
          {...props}
        />

        {error && (
          <Typography
            variant="muted"
            className="text-status-danger-text text-[12px] ml-0.5 mt-0.5 animate-in fade-in slide-in-from-top-1"
          >
            {error}
          </Typography>
        )}
      </div>
    );
  },
);

MyInput.displayName = "MyInput";
