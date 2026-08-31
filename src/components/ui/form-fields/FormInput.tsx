import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  get,
  useFormContext,
} from "react-hook-form";
import { cn } from "../../../lib/utils";
import { Input } from "../input";
import { Typography } from "../shared/Typography";

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

  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const inputType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

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
          <div className="relative w-full">
            <Input
              {...field}
              value={field.value ?? ""}
              type={inputType}
              ref={ref}
              className={cn(
                "h-11 w-full bg-white px-4",
                isPasswordType && "pr-10", // Extra padding right for the eye icon
                "rounded-[7px] border-border-input",
                "text-sidebar-bg font-normal text-sm placeholder:text-text-subtle",
                "focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary",
                "transition-all duration-200 shadow-none",
                errMsg &&
                  "border-status-danger-text focus-visible:ring-status-danger-text",
              )}
              {...props}
            />

            {/* Password Toggle Button */}
            {isPasswordType && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-sidebar-bg transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        )}
      />

      {typeof errMsg === "string" && (
          <Typography
            variant="muted"
            className="text-status-danger-text text-[12px] ml-0.5 mt-0.5 animate-in fade-in slide-in-from-top-1"
          >
            {errMsg}
          </Typography>
      )}
    </div>
  );
};

FormInput.displayName = "FormInput";
