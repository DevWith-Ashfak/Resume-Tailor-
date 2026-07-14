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
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-red-500";

  return (
    <div className="flex flex-col items-center">
      <svg width={130} height={130} className="-rotate-90">
        <circle
          cx={65}
          cy={65}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={10}
        />
        <circle
          cx={65}
          cy={65}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={color}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <span className="absolute mt-1 text-2xl font-bold text-gray-900">
        {score}%
      </span>
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
      {/* Score Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {result.jobTitle || "Analysis"} {result.company && `· ${result.company}`}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Match Score based on {result.gaps.length} criteria
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <ScoreRing score={result.score} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="gaps" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
        </TabsList>

        {/* Gap Analysis Tab */}
        <TabsContent value="gaps" className="space-y-3">
          {result.gaps.map((gap, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-gray-200 p-4"
            >
              <GapIcon status={gap.status} />
              <div>
                <p className="text-sm font-medium capitalize text-gray-900">
                  {gap.area}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{gap.detail}</p>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-3">
          {["high", "medium", "low"].map((level) => {
            const items = result.keywords.filter(
              (k) => k.importance === level
            );
            if (!items.length) return null;
            return (
              <Card key={level}>
                <CardHeader>
                  <CardTitle className="text-sm capitalize flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        level === "high"
                          ? "bg-red-500"
                          : level === "medium"
                          ? "bg-amber-500"
                          : "bg-gray-400"
                      }`}
                    />
                    {level} Importance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {items.map((kw, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                          kw.found
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
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
        <TabsContent value="cover-letter">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Tailored Cover Letter
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.coverLetter)}
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
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.coverLetter}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Portfolio Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Tailored Portfolio
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(result.portfolio)}
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
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-table:text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result.portfolio}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
