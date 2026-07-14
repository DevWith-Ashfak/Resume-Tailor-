import { create } from "zustand";
import { AppState, AnalysisResult } from "@/types";

interface AppActions {
  setFile: (file: File | null) => void;
  setResumeText: (text: string | null) => void;
  setIsUploading: (v: boolean) => void;
  setUploadError: (e: string | null) => void;
  setJobDescription: (jd: string) => void;
  setJobTitle: (t: string) => void;
  setCompany: (c: string) => void;
  setResult: (r: AnalysisResult | null) => void;
  setIsAnalyzing: (v: boolean) => void;
  setAnalysisError: (e: string | null) => void;
  setStatusMessage: (m: string) => void;
  reset: () => void;
}

const initialState: AppState = {
  file: null,
  resumeText: null,
  isUploading: false,
  uploadError: null,
  jobDescription: "",
  jobTitle: "",
  company: "",
  result: null,
  isAnalyzing: false,
  analysisError: null,
  statusMessage: "",
};

export const useAppStore = create<AppState & AppActions>((set) => ({
  ...initialState,
  setFile: (file) => set({ file, uploadError: null }),
  setResumeText: (resumeText) => set({ resumeText }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setUploadError: (uploadError) => set({ uploadError }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setJobTitle: (jobTitle) => set({ jobTitle }),
  setCompany: (company) => set({ company }),
  setResult: (result) => set({ result }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setAnalysisError: (analysisError) => set({ analysisError }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
  reset: () => set(initialState),
}));
