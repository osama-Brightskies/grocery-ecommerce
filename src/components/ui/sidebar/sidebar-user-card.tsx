import { cn } from "@/lib/utils";

export interface SidebarUserCardProps {
  className?: string;
}

export function SidebarUserCard({ className }: SidebarUserCardProps) {
  const user = {
    name: "Ahmed Tamim",
    role: "Administrator",
    initials: "AT",
  };

  return (
    <div className={cn("flex items-center gap-3 px-2 select-none", className)}>
      <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-semibold shrink-0">
        {user.initials}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white truncate leading-tight">
          {user.name}
        </p>
        <p className="text-xs text-text-subtle truncate">{user.role}</p>
      </div>
    </div>
  );
}

export default SidebarUserCard;
