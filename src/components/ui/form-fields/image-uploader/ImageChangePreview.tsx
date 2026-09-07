import * as React from "react";
import { UploadCloud } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { getImageUrl, cn } from "@/lib/utils";

export type ImageChangePreviewProps = {
  existingImageUrl: string;
  onFileSelect: (file?: File) => void;
  className?: string;
};

export function ImageChangePreview({
  existingImageUrl,
  onFileSelect,
  className,
}: ImageChangePreviewProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Existing S3 Image Preview */}
      <div className="relative w-28 h-28 rounded-xl border border-border bg-surface-soft p-2 flex items-center justify-center shrink-0 overflow-hidden">
        <img
          src={getImageUrl(existingImageUrl)}
          alt="Current category image"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Change Image Button Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex-1 h-28 rounded-xl border-2 border-dashed border-border-input hover:border-brand-primary bg-surface-soft flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors select-none",
          isDragging && "border-brand-primary bg-surface-mint",
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".png,.jpg,.jpeg,.webp"
          onChange={(e) => onFileSelect(e.target.files?.[0])}
          className="hidden"
        />
        <UploadCloud className="w-5 h-5 text-text-secondary mb-1" />
        <Typography
          variant="body"
          className="text-xs font-semibold text-sidebar-bg"
        >
          Change image
        </Typography>
        <Typography
          variant="muted"
          className="text-[10px] text-text-secondary mt-0.5"
        >
          PNG, JPG or WEBP (Max. 5MB)
        </Typography>
      </div>
    </div>
  );
}
