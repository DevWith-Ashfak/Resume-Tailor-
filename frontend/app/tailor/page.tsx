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
          <h1 className="text-2xl font-bold text-gray-900">Your Analysis</h1>
          <Button variant="outline" onClick={handleReset} className="gap-2">
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tailor Your Resume</h1>
        <p className="mt-1 text-gray-500">
          Upload your resume and paste a job description to get instant
          analysis.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* LEFT COLUMN — Inputs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-brand-600" />
                Resume Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PdfDropzone />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="h-4 w-4 text-brand-600" />
                Job Details
              </CardTitle>
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
                  />
                </div>
              </div>
              <JdTextarea />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN — Analysis trigger & loading */}
        <div className="space-y-6">
          <Card className="border-brand-200 bg-gradient-to-br from-brand-50 to-white">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                  <Sparkles className="h-7 w-7 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Ready to Analyze
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {!file || !resumeText
                      ? "Upload your resume PDF to continue"
                      : jobDescription.length < 50
                      ? "Paste a job description (min 50 chars)"
                      : "Click below to run the analysis"}
                  </p>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  size="lg"
                  className="w-full gap-2"
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
                  <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 w-full">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{analysisError}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Loading state */}
          <AnalysisLoading />

          {/* Empty-state hint when nothing has happened yet */}
          {!isAnalyzing && (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
              <Building2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">
                Your gap analysis, keyword suggestions, and tailored cover
                letter will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
