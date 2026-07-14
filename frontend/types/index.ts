// Shared types between frontend and API

export interface KeywordSuggestion {
  keyword: string;
  found: boolean;
  category: "technical" | "soft" | "tool" | "qualification";
  importance: "high" | "medium" | "low";
}

export interface Gap {
  area: string;
  status: "match" | "partial" | "missing";
  detail: string;
}

export interface AnalysisResult {
  id: string;
  jobTitle: string;
  company: string;
  createdAt: string;
  score: number;
  gaps: Gap[];
  keywords: KeywordSuggestion[];
  coverLetter: string;
  portfolio: string;
}

export interface UploadResponse {
  filename: string;
  size: number;
  text: string;
}

export interface AppState {
  // Upload
  file: File | null;
  resumeText: string | null;
  isUploading: boolean;
  uploadError: string | null;

  // Job description
  jobDescription: string;
  jobTitle: string;
  company: string;

  // Analysis
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  statusMessage: string;
}
