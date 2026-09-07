import * as React from "react";
import { UploadCloud } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { cn } from "@/lib/utils";

export type ImageDropzoneProps = {
  onFileSelect: (file?: File) => void;
  className?: string;
};

export function ImageDropzone({ onFileSelect, className }: ImageDropzoneProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "w-full h-44 rounded-xl border-2 border-dashed border-border-input hover:border-brand-primary bg-surface-soft flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 group select-none",
        isDragging && "border-brand-primary bg-surface-mint",
        className,
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept=".png,.jpg,.jpeg,.webp"
        onChange={(e) => onFileSelect(e.target.files?.[0])}
        className="hidden"
      />
      <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs">
        <UploadCloud className="w-5 h-5 text-brand-primary" />
      </div>
      <Typography
        variant="body"
        className="text-sm font-semibold text-sidebar-bg"
      >
        Drag and drop image here
      </Typography>
      <Typography
        variant="muted"
        className="text-xs text-text-secondary mt-0.5"
      >
        or click to browse
      </Typography>
      <Typography
        variant="caption"
        className="text-[11px] text-text-secondary mt-3"
      >
        PNG, JPG or WEBP (Max. 5MB)
      </Typography>
    </div>
  );
}
