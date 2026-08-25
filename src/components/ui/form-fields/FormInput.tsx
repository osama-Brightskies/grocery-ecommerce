import { ErrorMessage } from "@hookform/error-message";
import { type InputHTMLAttributes } from "react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  get,
  useFormContext,
} from "react-hook-form";
import { cn } from "../../../lib/utils";
import { Typography } from "../shared/Typography";
import { Input } from "../input";

type FormInputProps<TFieldValues extends FieldValues> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name"
> & {
  label: string;
  name: FieldPath<TFieldValues>;
  ref?: React.Ref<HTMLInputElement> | undefined;
};

export const FormInput = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  className,
  type,
  ref,
  ...props
}: FormInputProps<TFieldValues>) => {
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
          <Input
            {...field}
            value={field.value ?? ""} //new added line for undefined state handles switching from uncontrolled to controlled.
            type={type}
            ref={ref}
            className={cn(
              "h-11 w-full bg-white px-4",
              "rounded-[7px] border-border-input",
              "text-sidebar-bg font-normal text-sm placeholder:text-text-subtle",
              "focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary",
              "transition-all duration-200 shadow-none",
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

FormInput.displayName = "FormInput";
