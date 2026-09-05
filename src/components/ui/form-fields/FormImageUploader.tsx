import {
  useFormContext,
  Controller,
  type FieldValues,
  type FieldPath,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Typography } from "@/components/ui/shared/Typography";
import { ImageDropzone } from "./image-uploader/ImageDropzone";
import { ImagePreview } from "./image-uploader/ImagePreview";
import { ImageChangePreview } from "./image-uploader/ImageChangePreview";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export type FormImageUploaderProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  required?: boolean;
  existingImageUrl?: string;
  className?: string;
};

export function FormImageUploader<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  label = "Category image",
  required = false,
  existingImageUrl,
  className,
}: FormImageUploaderProps<TFieldValues>) {
  const { control, setError, clearErrors } = useFormContext<TFieldValues>();

  const validateAndSelect = (
    file: File | undefined,
    onChange: (val?: File) => void,
  ) => {
    if (!file) {
      onChange(undefined);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(name, {
        type: "manual",
        message: "Only PNG, JPG, or WEBP formats are supported",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(name, {
        type: "manual",
        message: "Image size must be under 5MB",
      });
      return;
    }

    clearErrors(name);
    onChange(file);
  };

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <Typography
          variant="label"
          as="label"
          className="text-text-secondary ml-0.5 text-xs font-medium"
        >
          {label}{" "}
          {required && <span className="text-status-danger-text">*</span>}
        </Typography>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => {
          const selectedFile =
            (value as unknown) instanceof File
              ? (value as unknown as File)
              : undefined;

          if (selectedFile) {
            return (
              <ImagePreview
                file={selectedFile}
                onRemove={() => onChange(undefined)}
              />
            );
          }

          if (existingImageUrl) {
            return (
              <ImageChangePreview
                existingImageUrl={existingImageUrl}
                onFileSelect={(file) => validateAndSelect(file, onChange)}
              />
            );
          }

          return (
            <ImageDropzone
              onFileSelect={(file) => validateAndSelect(file, onChange)}
            />
          );
        }}
      />

      <ErrorMessage
        name={name}
        render={({ message }) => (
          <Typography
            variant="muted"
            className="text-status-danger-text text-[12px] ml-0.5 mt-0.5 animate-in fade-in"
          >
            {message}
          </Typography>
        )}
      />
    </div>
  );
}

export default FormImageUploader;
