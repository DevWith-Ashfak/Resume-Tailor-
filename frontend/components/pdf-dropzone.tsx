"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { uploadResume } from "@/lib/api";

export function PdfDropzone() {
  const {
    file,
    setFile,
    setResumeText,
    setIsUploading,
    setUploadError,
    isUploading,
    uploadError,
  } = useAppStore();

  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const f = acceptedFiles[0];
      if (!f) return;

      // Client-side validation
      if (f.type !== "application/pdf") {
        setUploadError("Only PDF files are accepted.");
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        setUploadError("File must be under 5 MB.");
        return;
      }

      setFile(f);
      setUploadError(null);
      setIsUploading(true);

      try {
        const result = await uploadResume(f);
        setResumeText(result.text);
      } catch (err: any) {
        setUploadError(err.message || "Failed to upload resume.");
        setFile(null);
      } finally {
        setIsUploading(false);
      }
    },
    [setFile, setResumeText, setIsUploading, setUploadError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: isUploading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const removeFile = () => {
    setFile(null);
    setResumeText(null);
    setUploadError(null);
  };

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 p-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
            <FileText className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button
          onClick={removeFile}
          className="rounded-full p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer",
          dragActive || isDragActive
            ? "border-brand-500 bg-brand-50"
            : "border-gray-300 hover:border-brand-400 hover:bg-gray-50",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
            <Upload className="h-6 w-6 text-brand-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isUploading
                ? "Uploading..."
                : "Drop your resume PDF here"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {isUploading ? "Please wait…" : "or click to browse · PDF only · Max 5 MB"}
            </p>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
