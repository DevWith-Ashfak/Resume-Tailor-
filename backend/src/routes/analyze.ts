import { Router, Request, Response } from "express";
import { runAnalysis } from "../services/analysis";

export const analyzeRouter = Router();

analyzeRouter.post("/", (req: Request, res: Response) => {
  try {
    const { resumeText, jobDescription, jobTitle, company } = req.body;

    if (!resumeText || !jobDescription) {
      res.status(400).json({ error: "resumeText and jobDescription are required" });
      return;
    }

    if (jobDescription.length < 50) {
      res.status(400).json({ error: "Job description must be at least 50 characters" });
      return;
    }

    // Simulate a small delay so the frontend progress animation is visible
    const result = runAnalysis(resumeText, jobDescription, jobTitle || "", company || "");

    res.json(result);
  } catch (err: any) {
    console.error("Analysis error:", err);
    res.status(500).json({ error: err.message || "Analysis failed" });
  }
});
