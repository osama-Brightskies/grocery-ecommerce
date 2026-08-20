import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: "In stock" | "Low stock" | "Out of stock" | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getBadgeVariant = (val: string) => {
    switch (val.toLowerCase()) {
      case "in stock":
        return "primary";
      case "low stock":
        return "warning";
      case "out of stock":
        return "danger";
      default:
        return "outline";
    }
  };

  return (
    <Badge variant={getBadgeVariant(status)} className={cn(className)}>
      {status}
    </Badge>
  );
}

export default StatusBadge;
