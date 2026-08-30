import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-sidebar-bg group-[.toaster]:border-border-input group-[.toaster]:shadow-lg group-[.toaster]:rounded-[7px]",
          description: "group-[.toast]:text-text-secondary",
          actionButton:
            "group-[.toast]:bg-brand-primary group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-surface-mint group-[.toast]:text-brand-primary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
