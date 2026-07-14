"use client";

import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function JdTextarea() {
  const { jobDescription, setJobDescription } = useAppStore();
  const charCount = jobDescription.length;
  const isValid = charCount === 0 || charCount >= 50;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        Job Description
      </label>
      <Textarea
        placeholder="Paste the full job description here…"
        className="min-h-[200px] resize-y"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-xs",
            charCount > 0 && charCount < 50
              ? "text-amber-600"
              : "text-gray-400"
          )}
        >
          {charCount} characters
          {charCount > 0 && charCount < 50 && " (min 50 required)"}
        </p>
        {!isValid && charCount > 0 && (
          <p className="text-xs text-amber-600">
            Please enter at least 50 characters
          </p>
        )}
      </div>
    </div>
  );
}
