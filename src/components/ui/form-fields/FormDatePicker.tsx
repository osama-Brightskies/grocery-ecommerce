import { ErrorMessage } from "@hookform/error-message";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  get,
  useFormContext,
} from "react-hook-form";
import { cn } from "../../../lib/utils";
import { Typography } from "../shared/Typography";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

type FormDatePickerProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export const FormDatePicker = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder = "Pick a date",
  className,
  disabled,
}: FormDatePickerProps<TFieldValues>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const errMsg = get(errors, name)?.message;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {/* Label */}
      <Typography
        variant="label"
        as="label"
        className="text-text-secondary ml-0.5"
      >
        {label}
      </Typography>

      {/* RHF Controller */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={disabled}
                className={cn(
                  "h-11 w-full bg-white px-4 flex justify-between items-center text-left font-normal",
                  "rounded-[7px] border border-border-input",
                  "text-sidebar-bg text-sm shadow-none",
                  "hover:bg-white hover:text-sidebar-bg",
                  "focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary",
                  !field.value && "text-text-subtle",
                  errMsg &&
                    "border-status-danger-text focus-visible:ring-status-danger-text",
                )}
              >
                {field.value ? (
                  format(new Date(field.value), "PPP")
                ) : (
                  <span>{placeholder}</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-text-secondary" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-0 bg-white border border-border-input rounded-[7px] shadow-md"
              align="start"
            >
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date)}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                autoFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />

      {/* Error Message */}
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

FormDatePicker.displayName = "FormDatePicker";
