import { Typography } from "../Typography";

export interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 pb-2">
      <Typography variant="h1" className="text-2xl text-sidebar-bg">
        {title}
      </Typography>
      {description && (
        <Typography variant="muted" className="text-sm text-muted-foreground">
          {description}
        </Typography>
      )}
    </div>
  );
}

export default PageHeader;
