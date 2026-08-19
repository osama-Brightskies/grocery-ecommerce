import { cn } from "@/lib/utils";

export interface SidebarUserCardProps {
  name: string;
  role: string;
  initials?: string;
  avatarUrl?: string;
  className?: string;
}

export function SidebarUserCard({
  name,
  role,
  initials,
  avatarUrl,
  className,
}: SidebarUserCardProps) {
  const displayInitials =
    initials ||
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className={cn("flex items-center gap-3 px-2 select-none", className)}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-semibold shrink-0">
          {displayInitials}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white truncate leading-tight">
          {name}
        </p>
        <p className="text-xs text-text-subtle truncate">{role}</p>
      </div>
    </div>
  );
}

export default SidebarUserCard;
