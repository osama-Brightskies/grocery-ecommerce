import React from "react";
import { cn } from "@/lib/utils"; /* Shadcn class merger helper */

export type TypographyVariant = 
  | "h1"       /* Page Titles (e.g., "Products", "Create product") */
  | "h2"       /* Section Headers (e.g., "Inventory overview", "Basic information") */
  | "h3"       /* Card Subheadings / Table Section Titles */
  | "body"     /* Default Body Text / Table Row Cells */
  | "muted"    /* Subtext / Muted Descriptions */
  | "label"    /* Input Field Labels */
  | "caption"; /* Table Column Headers (UPPERCASE small text) */

export type TypographyProps = React.HTMLAttributes<HTMLElement> & {
  variant?: TypographyVariant;
  as?: React.ElementType; /* Allows overriding the HTML tag (h1, h2, p, span, label) */
  children: React.ReactNode;
  className?: string;
};

/* Tailwind utility mappings for each variant */
const variantStyles: Record<TypographyVariant, string> = {
  h1: "text-2xl md:text-3xl font-bold tracking-tight text-sidebar-bg",
  h2: "text-lg md:text-xl font-semibold tracking-tight text-sidebar-bg",
  h3: "text-base font-semibold text-sidebar-bg",
  body: "text-sm text-sidebar-bg font-normal leading-relaxed",
  muted: "text-sm text-text-secondary font-normal",
  label: "text-xs md:text-sm font-medium text-sidebar-bg select-none",
  caption: "text-[11px] font-bold uppercase tracking-wider text-text-secondary",
};

/* Default HTML element for each variant */
const defaultElements: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  muted: "p",
  label: "label",
  caption: "span",
};

export function Typography({
  variant = "body",
  as,
  children,
  className,
  ...props
}: TypographyProps) {
  const Component = as || defaultElements[variant];

  return (
    <Component 
      className={cn(variantStyles[variant], className)} 
      {...props}
    >
      {children}
    </Component>
  );
}