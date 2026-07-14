"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult, Gap, KeywordSuggestion } from "@/types";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  Copy,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function GapIcon({ status }: { status: Gap["status"] }) {
  switch (status) {
    case "match":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
    case "partial":
      return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
    case "missing":
      return <XCircle className="h-4 w-4 text-red-400 shrink-0" />;
  }
}

function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70
      ? { stroke: "#10b981", bg: "#d1fae5", text: "text-emerald-600" }
      : score >= 40
      ? { stroke: "#f59e0b", bg: "#fef3c7", text: "text-amber-600" }
      : { stroke: "#ef4444", bg: "#fee2e2", text: "text-red-500" };

  const label =
    score >= 70 ? "Strong Match" : score >= 40 ? "Partial Match" : "Needs Work";

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={140} height={140} className="-rotate-90 drop-shadow-lg">
          <circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={12}
          />
          <circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-gray-900">{score}%</span>
          <span className={`text-xs font-medium ${color.text} mt-0.5`}>{label}</span>
        </div>
      </div>
    </div>
  );
}

interface Props {
  result: AnalysisResult;
}

export function AnalysisResultView({ result }: Props) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-slide-up space-y-6">
      {/* ── Score Card ── */}
      <Card className="overflow-hidden border-gray-100 card-glow">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-violet-500" />
        <CardContent className="pt-8 pb-6">
          <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {result.jobTitle || "Analysis"}
              </h2>
              {result.company && (
                <span className="inline-flex items-center gap-1 mt-1 text-sm text-gray-500">
                  <Building2 className="h-3.5 w-3.5" />
                  {result.company}
                </span>
              )}
              <p className="text-sm text-gray-400 mt-2">
                Analyzed {result.gaps.length} criteria &middot;{" "}
                {new Date(result.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <ScoreRing score={result.score} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="gaps" className="w-full">
        <TabsList className="w-full grid grid-cols-3 p-1 bg-gray-100/80 rounded-xl">
          <TabsTrigger
            value="gaps"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
          >
            <span className="hidden sm:inline">Gap Analysis</span>
            <span className="sm:hidden">Gaps</span>
          </TabsTrigger>
          <TabsTrigger
            value="keywords"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
          >
            Keywords
          </TabsTrigger>
          <TabsTrigger
            value="cover-letter"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
          >
            <span className="hidden sm:inline">Cover Letter</span>
            <span className="sm:hidden">Letter</span>
          </TabsTrigger>
        </TabsList>

        {/* Gap Analysis Tab */}
        <TabsContent value="gaps" className="space-y-3 mt-4">
          {result.gaps.map((gap, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-gray-100 p-4 bg-white hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <GapIcon status={gap.status} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium capitalize text-gray-900">
                  {gap.area}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {gap.detail}
                </p>
              </div>
              <span
                className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                  gap.status === "match"
                    ? "bg-emerald-50 text-emerald-700"
                    : gap.status === "partial"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {gap.status}
              </span>
            </div>
          ))}
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4 mt-4">
          {["high", "medium", "low"].map((level) => {
            const items = result.keywords.filter(
              (k) => k.importance === level
            );
            if (!items.length) return null;
            return (
              <Card key={level} className="border-gray-100 card-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm capitalize flex items-center gap-2">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        level === "high"
                          ? "bg-red-500 shadow-sm shadow-red-200"
                          : level === "medium"
                          ? "bg-amber-500 shadow-sm shadow-amber-200"
                          : "bg-gray-400"
                      }`}
                    />
                    {level} Importance
                    <span className="text-gray-400 font-normal text-xs ml-1">
                      ({items.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {items.map((kw, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 ${
                          kw.found
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        {kw.found ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {kw.keyword}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Cover Letter Tab */}
        <TabsContent value="cover-letter" className="mt-4">
          <Card className="border-gray-100 card-glow">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-violet-400" />
            <CardHeader className="flex flex-row items-center justify-between pt-7">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-blue-600" />
                Tailored Cover Letter
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.coverLetter)}
                  className="border-gray-200 hover:bg-gray-50 text-xs"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    downloadMarkdown(
                      result.coverLetter,
                      `cover-letter-${result.id.slice(0, 8)}.md`
                    )
                  }
                  className="border-gray-200 hover:bg-gray-50 text-xs"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.coverLetter}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Portfolio Section ── */}
      <Card className="border-gray-100 card-glow">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
        <CardHeader className="flex flex-row items-center justify-between pt-7">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-amber-600" />
            Tailored Portfolio
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(result.portfolio)}
              className="border-gray-200 hover:bg-gray-50 text-xs"
            >
              <Copy className="h-3.5 w-3.5 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadMarkdown(
                  result.portfolio,
                  `portfolio-${result.id.slice(0, 8)}.md`
                )
              }
              className="border-gray-200 hover:bg-gray-50 text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-table:text-sm prose-th:bg-gray-50 prose-th:font-semibold prose-td:border-gray-100">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result.portfolio}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
