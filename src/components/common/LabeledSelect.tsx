import { Typography } from "./Typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "../../lib/utils";

// 1. Type definition for data options
type SelectOption = {
  label: string;
  value: string;
};

// 2. Props for the reusable component
type LabeledSelectProps = {
  label: string;
  options?: SelectOption[]; // Optional to prevent crashes
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

export const LabeledSelect = ({
  label,
  options = [], // Defaults to empty array
  placeholder = "Select an option",
  value,
  onValueChange,
  className,
  disabled,
}: LabeledSelectProps) => {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Label: Using Typography with secondary text color from theme */}
      <Typography
        variant="label"
        as="label"
        className="text-text-secondary ml-0.5"
      >
        {label}
      </Typography>

      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        {/* Trigger: Figma height 44px, radius 7px, border #E0E8E0 */}
        <SelectTrigger
          className={cn(
            "h-11 w-full bg-white px-4 flex justify-between items-center",
            "rounded-[7px] border-border-input",
            "text-sidebar-bg font-normal text-sm",
            "focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
            "transition-all duration-200 shadow-none",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        {/* Content: Positioned "stuck" to the bottom with Tailwind v4 syntax */}
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
          {/* Handling Empty State (API Fail Case) */}
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
    </div>
  );
};
