import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-brand-primary" />,
        info: <InfoIcon className="size-4 text-brand-primary" />,
        warning: (
          <TriangleAlertIcon className="size-4 text-status-warning-text" />
        ),
        error: <OctagonXIcon className="size-4 text-status-danger-text" />,
        loading: (
          <Loader2Icon className="size-4 animate-spin text-brand-primary" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "0.4375rem", // 7px radius
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-sidebar-bg group-[.toaster]:border-border-input group-[.toaster]:shadow-md group-[.toaster]:rounded-[7px] font-sans text-sm",
          description: "group-[.toast]:text-text-secondary",
          actionButton:
            "group-[.toast]:bg-brand-primary group-[.toast]:text-white font-medium",
          cancelButton:
            "group-[.toast]:bg-surface-soft group-[.toast]:text-text-secondary",
          // Freshly Brand Tokens for Success Toast
          success:
            "!bg-surface-mint !text-brand-primary !border-brand-primary/30 font-medium",
          // Freshly Brand Tokens for Error Toast
          error:
            "!bg-status-danger-bg !text-status-danger-text !border-status-danger-text/30 font-medium",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
