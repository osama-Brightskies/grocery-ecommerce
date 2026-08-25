import { ErrorMessage } from "@hookform/error-message";
import { type TextareaHTMLAttributes } from "react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  get,
  useFormContext,
} from "react-hook-form";
import { cn } from "../../../lib/utils";
import { Typography } from "../shared/Typography";
import { Textarea } from "../textarea";

type FormTextareaProps<TFieldValues extends FieldValues> = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "name"
> & {
  label: string;
  name: FieldPath<TFieldValues>;
};

export const FormTextarea = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  className,
  rows = 4,
  ...props
}: FormTextareaProps<TFieldValues>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const errMsg = get(errors, name)?.message;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <Typography
        variant="label"
        as="label"
        className="text-text-secondary ml-0.5"
      >
        {label}
      </Typography>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            rows={rows}
            className={cn(
              "w-full bg-white px-4 py-3",
              "rounded-[7px] border-border-input",
              "text-sidebar-bg font-normal text-sm placeholder:text-text-subtle",
              "focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary outline-none",
              "transition-all duration-200 shadow-none resize-y min-h-25",
              errMsg &&
                "border-status-danger-text focus-visible:ring-status-danger-text",
            )}
            {...props}
          />
        )}
      />

      <ErrorMessage
        name={name}
        render={({ message }) => (
          <Typography
            variant="muted"
            className="text-status-danger-text text-[12px] ml-0.5 mt-0.5 animate-in fade-in slide-in-from-top-1"
          >
            {message}
          </Typography>
        )}
      />
    </div>
  );
};

FormTextarea.displayName = "FormTextarea";
