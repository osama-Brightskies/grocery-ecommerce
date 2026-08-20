import { cn } from "@/lib/utils";

export interface ProductCellProps {
  name: string;
  imageUrl: string;
  className?: string;
}

export function ProductCell({ name, imageUrl, className }: ProductCellProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="w-10 h-10 rounded-lg object-cover bg-surface-soft border border-border-input shrink-0"
        />
      )}
      <span className="font-semibold text-sidebar-bg">{name}</span>
    </div>
  );
}

export default ProductCell;
