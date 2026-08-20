import { ErrorMessage } from "@hookform/error-message";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  get,
  useFormContext,
} from "react-hook-form";
import { cn } from "../../../lib/utils";
import { Typography } from "../../Typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

// Type definition for options
export type SelectOption = {
  label: string;
  value: string;
};

// Props typed dynamically against RHF FieldValues
type FormSelectProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label: string;
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export const FormSelect = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  options = [],
  placeholder = "Select an option",
  className,
  disabled,
}: FormSelectProps<TFieldValues>) => {
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

      {/* Controller for Radix UI Select Integration */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            {/* Select Trigger */}
            <SelectTrigger
              className={cn(
                "h-11 w-full bg-white px-4 flex justify-between items-center",
                "rounded-[7px] border-border-input",
                "text-sidebar-bg font-normal text-sm placeholder:text-text-subtle",
                "focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                "transition-all duration-200 shadow-none",
                errMsg &&
                  "border-status-danger-text focus:ring-status-danger-text",
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            {/* Select Dropdown Content */}
            <SelectContent
              position="popper"
              side="bottom"
              sideOffset={0}
              className={cn(
                "bg-white border-border-input rounded-b-[7px] rounded-t-none shadow-md",
                "w-(--radix-select-trigger-width)",
                "min-w-(--radix-select-trigger-width)",
                "max-h-75 overflow-y-auto",
                "animate-in fade-in-0 slide-in-from-top-1 duration-200",
              )}
            >
              {options.length === 0 ? (
                <div className="p-4 text-center">
                  <Typography variant="muted">No options available</Typography>
                </div>
              ) : (
                options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={cn(
                      "cursor-pointer py-2.5 px-4 outline-none",
                      "focus:bg-surface-mint focus:text-brand-primary",
                      "transition-colors duration-150",
                    )}
                  >
                    <Typography
                      variant="body"
                      as="span"
                      className="text-sidebar-bg"
                    >
                      {option.label}
                    </Typography>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
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

FormSelect.displayName = "FormSelect";
