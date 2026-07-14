"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getResult } from "@/lib/api";
import { AnalysisResultView } from "@/components/analysis-result";
import { AnalysisResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getResult(id)
      .then(setResult)
      .catch((err) => setError(err.message || "Result not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Result Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          {error || "The analysis result you're looking for doesn't exist or has expired."}
        </p>
        <Button onClick={() => router.push("/tailor")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tailor
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/tailor")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Analysis Result</h1>
      </div>
      <AnalysisResultView result={result} />
    </div>
  );
}
