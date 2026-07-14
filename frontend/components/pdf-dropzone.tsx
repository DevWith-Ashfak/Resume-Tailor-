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
      <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 animate-fade-in shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 shadow-sm">
            <FileText className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button
          onClick={removeFile}
          className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all hover:scale-110"
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
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all cursor-pointer",
          dragActive || isDragActive
            ? "border-blue-400 bg-blue-50/70 scale-[1.02]"
            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50/80",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-sm">
            <Upload className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {isUploading ? "Uploading…" : "Drop your resume PDF here"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {isUploading ? "Please wait…" : "or click to browse · PDF only · Max 5 MB"}
            </p>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
