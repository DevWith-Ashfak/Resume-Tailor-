"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { analyzeResume } from "@/lib/api";
import { PdfDropzone } from "@/components/pdf-dropzone";
import { JdTextarea } from "@/components/jd-textarea";
import { AnalysisLoading } from "@/components/analysis-loading";
import { AnalysisResultView } from "@/components/analysis-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  FileText,
  Briefcase,
  Building2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

export default function TailorPage() {
  const router = useRouter();
  const {
    file,
    resumeText,
    jobDescription,
    jobTitle,
    company,
    result,
    isAnalyzing,
    analysisError,
    setJobTitle,
    setCompany,
    setResult,
    setIsAnalyzing,
    setAnalysisError,
    reset,
  } = useAppStore();

  const canAnalyze =
    !!file && !!resumeText && jobDescription.length >= 50 && !isAnalyzing;

  const handleAnalyze = async () => {
    if (!canAnalyze || !resumeText) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const data = await analyzeResume({
        resumeText,
        jobDescription,
        jobTitle,
        company,
      });
      setResult(data);
      // Optionally navigate to shareable URL
      router.replace(`/tailor/result/${data.id}`, {});
    } catch (err: any) {
      setAnalysisError(err.message || "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    reset();
    router.replace("/tailor");
  };

  // Show result view if we have results
  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Your <span className="gradient-text">Analysis</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {result.jobTitle && `${result.jobTitle}`}
              {result.company && ` · ${result.company}`}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2 border-gray-200 hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            New Analysis
          </Button>
        </div>
        <AnalysisResultView result={result} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Page header ── */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Resume Tailor
        </div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Tailor Your <span className="gradient-text">Resume</span>
        </h1>
        <p className="mt-2 text-gray-500 max-w-lg">
          Upload your resume and paste a job description to get an instant gap
          analysis, keyword breakdown, and tailored cover letter.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* LEFT COLUMN — Inputs (3/5 width) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Step 1 */}
          <Card className="card-glow overflow-hidden border-gray-100">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-500" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 text-sm font-bold">
                  1
                </div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Resume Upload
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <PdfDropzone />
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="card-glow overflow-hidden border-gray-100">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-violet-500 to-purple-500" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 text-sm font-bold">
                  2
                </div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="h-4 w-4 text-violet-600" />
                  Job Details
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <Input
                    placeholder="e.g. Frontend Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="focus-visible:ring-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <Input
                    placeholder="e.g. Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="focus-visible:ring-violet-500"
                  />
                </div>
              </div>
              <JdTextarea />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN — Analysis (2/5 width) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 card-glow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-bl-3xl" />
            <CardContent className="relative pt-6">
              <div className="flex flex-col items-center text-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ready to Analyze
                  </h3>
                  <p className="text-sm text-gray-500 mt-1.5 max-w-xs mx-auto">
                    {!file || !resumeText
                      ? "Upload your resume PDF to continue"
                      : jobDescription.length < 50
                      ? "Paste a job description (min 50 chars)"
                      : "Click below to run the analysis"}
                  </p>
                </div>

                {/* Status dots */}
                <div className="flex items-center gap-2 w-full justify-center">
                  <div
                    className={`h-2 w-2 rounded-full transition-colors ${
                      file && resumeText ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                  <div className="h-px w-6 bg-gray-200" />
                  <div
                    className={`h-2 w-2 rounded-full transition-colors ${
                      jobDescription.length >= 50 ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  size="lg"
                  className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all disabled:opacity-40"
                >
                  {isAnalyzing ? (
                    <>Analyzing…</>
                  ) : (
                    <>
                      Analyze &amp; Tailor
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {analysisError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600 w-full">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{analysisError}</span>
                  </div>
                )}

                {!isAnalyzing && (
                  <p className="text-xs text-gray-400">
                    Analysis typically takes 5–15 seconds
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Loading state */}
          <AnalysisLoading />

          {/* Empty-state hint */}
          {!isAnalyzing && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50/50">
              <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-medium">
                Your results will appear here
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Gap analysis · Keywords · Cover letter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
