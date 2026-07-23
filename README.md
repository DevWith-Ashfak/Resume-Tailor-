# Resume Tailor 🎯

> An AI-powered web app that compares your resume against a job description and gives you a gap analysis, keyword suggestions, and a tailored cover letter — so you can stop guessing what recruiters want to see.

I built this because I was tired of manually cross-referencing every job description with my resume. Paste a JD, upload your PDF, and in seconds you get a clear picture of where you stand and what to improve.

---

##  What It Does

- **PDF Resume Parsing** — Drag-and-drop upload (or click to browse). Extracts text from your PDF automatically. Validates file type and size (PDF only, max 5 MB).

- **Smart Gap Analysis** — The engine scans the job description for technical skills, tools, soft skills, and qualifications, then checks how many of them appear in your resume. Each keyword is tagged as a match, partial match, or missing — with a human-readable explanation.

- **Keyword Breakdown** — Keywords are categorized by importance (high / medium / low) based on how frequently they show up in the JD. You get color-coded chips showing what you have and what you're missing.

- **Match Score** — A 0–100 score visualized as a ring chart so you can see at a glance how well your resume aligns.

- **Tailored Cover Letter** — Auto-generates a markdown cover letter that highlights your matching strengths and acknowledges growth areas. Ready to copy or download as a `.md` file.

- **Tailored Portfolio Summary** — A markdown breakdown with a match summary table, detailed gap list, and actionable next steps you can use for interview prep.

- **Shareable Results** — Every analysis gets a unique ID and a permanent URL (`/tailor/result/[id]`), so you can bookmark or share your results later.

---

## Tech Stack

| Layer | Technology | Why I Chose It |
|-------|-----------|----------------|
| **Frontend** | Next.js 14 (App Router) + TypeScript | Server components, file-based routing, great DX |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS with pre-built accessible primitives |
| **State** | Zustand | Lightweight, no boilerplate, perfect for client-side form state |
| **PDF Upload** | react-dropzone | Clean drag-and-drop UX with built-in validation hooks |
| **Markdown Rendering** | react-markdown + remark-gfm | Renders the generated cover letter and portfolio with proper formatting |
| **Backend** | Express + TypeScript | Simple, fast REST API that handles file uploads and analysis |
| **PDF Parsing** | pdf-parse | Extracts text from uploaded PDF resumes on the server |
| **File Uploads** | multer | Handles multipart form data with file size/type validation |



##  How to Run Locally

### Prerequisites
- Node.js 18+
- npm


### 1. Backend

```bash
cd backend
npm install
npm run dev

# API runs on http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

Then open `http://localhost:3000`, upload a PDF resume, paste a job description, and hit **Analyze & Tailor**.

---

## 🔮 What I'd Add Next


- **LLM Integration** — Swap the current rule-based keyword matching with an actual LLM (OpenAI / Claude) for smarter, more nuanced analysis.
- **Database** — Replace the in-memory store with MySQL or MongoDB so results persist across restarts.
- **User Accounts** — Auth (NextAuth.js) so users can save and revisit their analyses.
- **More Resume Formats** — Support for DOCX and plain-text resumes in addition to PDF.
- **ATS Score** — Parse the resume against common ATS filters to give an actual ATS compatibility score.
- **Dark Mode** — Already set up with Tailwind, just needs a theme toggle.


---
