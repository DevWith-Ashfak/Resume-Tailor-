"use client";

import { useEffect, useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";

const STATUS_MESSAGES = [
  "Reading your resume…",
  "Extracting key information…",
  "Comparing against job description…",
  "Identifying skill gaps…",
  "Drafting suggestions…",
  "Polishing your portfolio…",
];

export function AnalysisLoading() {
  const { statusMessage, setStatusMessage, isAnalyzing } = useAppStore();
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const msgIndexRef = useRef(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setProgress(0);
      msgIndexRef.current = 0;
      return;
    }

    // Rotate status messages every 3s
    setStatusMessage(STATUS_MESSAGES[0]);
    msgIndexRef.current = 0;

    const msgInterval = setInterval(() => {
      msgIndexRef.current = (msgIndexRef.current + 1) % STATUS_MESSAGES.length;
      setStatusMessage(STATUS_MESSAGES[msgIndexRef.current]);
    }, 3000);

    // Simulate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 8 + 2;
      });
    }, 600);

    intervalRef.current = msgInterval;

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-brand-700 animate-pulse-slow">
            {statusMessage || STATUS_MESSAGES[0]}
          </p>
          <span className="text-xs text-gray-400">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
