import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typography } from "@/components/ui/shared/Typography";

export type SelectOption = {
  label: string;
  value: string;
};

export interface AppSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AppSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className,
  disabled,
}: AppSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "h-10 w-full bg-white px-4 flex justify-between items-center",
          "rounded-[7px] border-border-input",
          "text-sidebar-bg font-normal text-sm placeholder:text-text-subtle",
          "focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
          "transition-all duration-200 shadow-none outline-none",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent
        position="popper"
        side="bottom"
        sideOffset={4}
        className={cn(
          "bg-white border-border-input rounded-[7px] shadow-md z-50",
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
              <Typography variant="body" as="span" className="text-sidebar-bg">
                {option.label}
              </Typography>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
