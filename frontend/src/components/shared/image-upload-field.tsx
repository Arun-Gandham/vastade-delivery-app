"use client";
/* eslint-disable @next/next/no-img-element */

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadApi } from "@/features/uploads/upload.api";
import { getErrorMessage } from "@/lib/utils/errors";

type ImageUploadFieldProps = {
  label: string;
  folder: string;
  value?: string | null;
  previewUrl?: string | null;
  error?: string;
  helperText?: string;
  onChange: (value: string) => void;
};

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const ImageUploadField = ({
  label,
  folder,
  value,
  previewUrl,
  error,
  helperText,
  onChange
}: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFileMeta, setSelectedFileMeta] = useState<{ name: string; size: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  useEffect(() => {
    if (!value && !previewUrl) {
      setUploadedPreviewUrl("");
    }
  }, [previewUrl, value]);

  const resolvedPreviewUrl = localPreviewUrl || uploadedPreviewUrl || previewUrl || "";

  const clearImage = () => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setLocalPreviewUrl("");
    setUploadedPreviewUrl("");
    setSelectedFileMeta(null);
    setUploadError(null);
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!acceptedImageTypes.includes(file.type)) {
      setUploadError("Select a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    setLocalPreviewUrl(nextPreviewUrl);
    setSelectedFileMeta({ name: file.name, size: file.size });
    setUploadError(null);
    setIsUploading(true);

    try {
      const upload = await uploadApi.uploadImage(file, folder);
      onChange(upload.key);
      setUploadedPreviewUrl(upload.imageUrl);
      setLocalPreviewUrl("");
    } catch (uploadFailure) {
      setUploadError(getErrorMessage(uploadFailure, "Failed to upload image"));
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
        <div className="flex flex-wrap gap-3">
          <input
            ref={inputRef}
            accept={acceptedImageTypes.join(",")}
            className="hidden"
            onChange={handleFileChange}
            type="file"
          />
          <Button loading={isUploading} onClick={() => inputRef.current?.click()} type="button" variant="outline">
            {resolvedPreviewUrl ? "Replace Image" : "Upload Image"}
          </Button>
          {resolvedPreviewUrl ? (
            <Button onClick={clearImage} type="button" variant="ghost">
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-muted)]">
        {resolvedPreviewUrl ? (
          <img alt={label} className="h-48 w-full object-cover" src={resolvedPreviewUrl} />
        ) : (
          <div className="flex h-48 items-center justify-center px-4 text-center text-sm text-[var(--color-text-muted)]">
            No image selected yet.
          </div>
        )}
      </div>

      {selectedFileMeta ? (
        <p className="text-xs text-[var(--color-text-muted)]">
          Selected: {selectedFileMeta.name} ({formatBytes(selectedFileMeta.size)})
        </p>
      ) : null}
      {value ? <p className="break-all text-xs text-[var(--color-text-muted)]">Stored key: {value}</p> : null}
      {uploadError ? <p className="text-xs text-[var(--color-danger)]">{uploadError}</p> : null}
      {!uploadError && error ? <p className="text-xs text-[var(--color-danger)]">{error}</p> : null}
      {!uploadError && !error && helperText ? (
        <p className="text-xs text-[var(--color-text-muted)]">{helperText}</p>
      ) : null}
    </div>
  );
};
