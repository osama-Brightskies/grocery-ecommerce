import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ImagePreviewProps = {
  file: File;
  onRemove: () => void;
  className?: string;
};

export function ImagePreview({ file, onRemove, className }: ImagePreviewProps) {
  const [previewSrc, setPreviewSrc] = React.useState<string>("");

  React.useEffect(() => {
    if (!file) return;

    let isMounted = true;
    const reader = new FileReader();

    reader.onloadend = () => {
      if (isMounted && typeof reader.result === "string") {
        setPreviewSrc(reader.result);
      }
    };

    reader.readAsDataURL(file);

    return () => {
      isMounted = false;
    };
  }, [file]);

  return (
    <div
      className={cn(
        "relative w-full h-44 rounded-xl border border-border bg-surface-soft p-3 flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      {previewSrc ? (
        <img
          src={previewSrc}
          alt="Selected preview"
          className="max-h-full max-w-full object-contain rounded-lg animate-in fade-in"
        />
      ) : (
        <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-sidebar-bg/80 text-white hover:bg-status-danger-text transition-colors cursor-pointer shadow-md"
        title="Remove image"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default ImagePreview;
