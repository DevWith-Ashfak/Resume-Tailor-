import { AnalysisResult, UploadResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

/** Upload a PDF resume file and get parsed text back */
export async function uploadResume(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Upload failed");
  }

  return res.json();
}

/** Send resume text and job description for analysis */
export async function analyzeResume(payload: {
  resumeText: string;
  jobDescription: string;
  jobTitle: string;
  company: string;
}): Promise<AnalysisResult> {
  return request<AnalysisResult>("/analyze", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Fetch a previously saved result by ID */
export async function getResult(id: string): Promise<AnalysisResult> {
  return request<AnalysisResult>(`/result/${id}`);
}
