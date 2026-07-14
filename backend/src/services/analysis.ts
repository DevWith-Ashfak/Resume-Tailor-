import crypto from "crypto";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  score: number; // 0-100 match score
  gaps: Gap[];
  keywords: KeywordSuggestion[];
  coverLetter: string; // markdown
  portfolio: string; // markdown
}

// ---------------------------------------------------------------------------
// In-memory store (replace with DB in production)
// ---------------------------------------------------------------------------

const resultStore = new Map<string, AnalysisResult>();

// ---------------------------------------------------------------------------
// Keyword extraction helpers
// ---------------------------------------------------------------------------

const TECH_KEYWORDS = [
  "javascript", "typescript", "python", "java", "c#", "go", "rust", "ruby",
  "react", "angular", "vue", "next.js", "node.js", "express", "django",
  "spring", "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
  "ci/cd", "git", "sql", "nosql", "mongodb", "postgresql", "mysql",
  "redis", "graphql", "rest", "api", "microservices", "serverless",
  "machine learning", "ai", "data science", "agile", "scrum", "jira",
];

const SOFT_KEYWORDS = [
  "leadership", "communication", "teamwork", "problem-solving",
  "collaboration", "mentoring", "stakeholder management",
  "presentation", "negotiation", "conflict resolution",
];

const TOOL_KEYWORDS = [
  "jira", "confluence", "slack", "figma", "adobe", "excel",
  "tableau", "power bi", "salesforce", "hubspot", "snowflake",
  "datadog", "sentry", "github actions",
];

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const allKeywords = [...TECH_KEYWORDS, ...SOFT_KEYWORDS, ...TOOL_KEYWORDS];
  return [...new Set(allKeywords.filter((kw) => lower.includes(kw)))];
}

function categorizeKeyword(kw: string): KeywordSuggestion["category"] {
  if (TECH_KEYWORDS.includes(kw)) return "technical";
  if (SOFT_KEYWORDS.includes(kw)) return "soft";
  if (TOOL_KEYWORDS.includes(kw)) return "tool";
  return "qualification";
}

function importanceLevel(kw: string, jdText: string): KeywordSuggestion["importance"] {
  const lower = jdText.toLowerCase();
  const count = (lower.match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length;
  if (count >= 3) return "high";
  if (count >= 1) return "medium";
  return "low";
}

// ---------------------------------------------------------------------------
// Gap analysis (rule‑based – swap with an LLM call in production)
// ---------------------------------------------------------------------------

function analyzeGaps(resumeText: string, jdText: string): Gap[] {
  const gaps: Gap[] = [];
  const jdKeywords = extractKeywords(jdText);
  const resumeKeywords = extractKeywords(resumeText);

  for (const kw of jdKeywords) {
    const found = resumeKeywords.includes(kw);
    gaps.push({
      area: kw,
      status: found ? "match" : "missing",
      detail: found
        ? `Found "${kw}" in your resume.`
        : `"${kw}" appears in the job description but was not detected in your resume.`,
    });
  }

  // Check for partial matches via fuzzy substring
  for (const kw of jdKeywords) {
    if (resumeKeywords.includes(kw)) continue;
    const foundPartial = resumeKeywords.some((rk) => rk.includes(kw) || kw.includes(rk));
    if (foundPartial) {
      gaps.push({
        area: kw,
        status: "partial",
        detail: `"${kw}" is partially reflected in your resume via related terms.`,
      });
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  return gaps.filter((g) => {
    const key = `${g.area}:${g.status}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ---------------------------------------------------------------------------
// Markdown generators
// ---------------------------------------------------------------------------

function generateCoverLetter(
  resumeText: string,
  jdText: string,
  jobTitle: string,
  company: string,
  gaps: Gap[],
  keywords: KeywordSuggestion[]
): string {
  const matches = gaps.filter((g) => g.status === "match");
  const missings = gaps.filter((g) => g.status === "missing");
  const highKeywords = keywords.filter((k) => k.importance === "high" && !k.found);

  const lines: string[] = [];

  lines.push(`# Cover Letter – ${jobTitle || "Position"}${company ? ` at ${company}` : ""}`);
  lines.push("");
  lines.push(`Dear Hiring Manager,`);
  lines.push("");
  lines.push(
    `I am writing to express my enthusiasm for the **${jobTitle || "role"}**${company ? ` at **${company}**` : ""}. ` +
    `After carefully reviewing the job description, I am confident that my background aligns well with your needs.`
  );
  lines.push("");

  if (matches.length > 0) {
    lines.push("## ✅ Key Strengths Matching Your Requirements");
    lines.push("");
    for (const m of matches.slice(0, 5)) {
      lines.push(`- **${m.area}**: ${m.detail}`);
    }
    lines.push("");
  }

  if (missings.length > 0) {
    lines.push("## 📈 Growth Areas I'm Actively Developing");
    lines.push("");
    for (const m of missings.slice(0, 3)) {
      lines.push(`- **${m.area}**: While this is not yet reflected in my resume, I am committed to bridging this gap.`);
    }
    lines.push("");
  }

  if (highKeywords.length > 0) {
    lines.push("## 🔑 Recommendations to Strengthen Your Application");
    lines.push("");
    for (const k of highKeywords.slice(0, 5)) {
      lines.push(`- Emphasize **${k.keyword}** in your resume or cover letter if you have relevant experience.`);
    }
    lines.push("");
  }

  lines.push("I look forward to the opportunity to discuss how I can contribute to your team.");
  lines.push("");
  lines.push("Sincerely,");
  lines.push("[Your Name]");

  return lines.join("\n");
}

function generatePortfolio(
  resumeText: string,
  jdText: string,
  jobTitle: string,
  company: string,
  gaps: Gap[]
): string {
  const matches = gaps.filter((g) => g.status === "match");
  const partials = gaps.filter((g) => g.status === "partial");
  const missings = gaps.filter((g) => g.status === "missing");

  const lines: string[] = [];

  lines.push(`# Tailored Portfolio – ${jobTitle || "Position"}${company ? ` at ${company}` : ""}`);
  lines.push("");
  lines.push("## 📊 Match Summary");
  lines.push("");

  const total = gaps.length || 1;
  const matchPct = Math.round((matches.length / total) * 100);
  const partialPct = Math.round((partials.length / total) * 100);
  const missingPct = Math.round((missings.length / total) * 100);

  lines.push(`| Category | Count | Percentage |`);
  lines.push(`|----------|-------|-----------|`);
  lines.push(`| ✅ Match | ${matches.length} | ${matchPct}% |`);
  lines.push(`| ⚠️ Partial | ${partials.length} | ${partialPct}% |`);
  lines.push(`| ❌ Missing | ${missings.length} | ${missingPct}% |`);
  lines.push("");

  lines.push("## 🎯 Detailed Gap Analysis");
  lines.push("");
  for (const g of gaps) {
    const icon = g.status === "match" ? "✅" : g.status === "partial" ? "⚠️" : "❌";
    lines.push(`- ${icon} **${g.area}**: ${g.detail}`);
  }
  lines.push("");

  lines.push("## 💡 Actionable Next Steps");
  lines.push("");
  lines.push("1. **Update Resume**: Incorporate the missing keywords and qualifications listed above.");
  lines.push("2. **Tailor Your Cover Letter**: Use the generated cover letter as a starting point.");
  lines.push("3. **Skill Development**: Prioritize high-importance missing skills for your learning roadmap.");
  lines.push("4. **Networking**: Research the company culture and connect with current employees on LinkedIn.");
  lines.push("");

  lines.push("---");
  lines.push(`*Generated by Resume Tailor on ${new Date().toLocaleDateString()}*`);

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function runAnalysis(
  resumeText: string,
  jdText: string,
  jobTitle: string,
  company: string
): AnalysisResult {
  const id = crypto.randomUUID();
  const gaps = analyzeGaps(resumeText, jdText);
  const jdKeywords = extractKeywords(jdText);
  const resumeKeywords = extractKeywords(resumeText);

  const keywords: KeywordSuggestion[] = jdKeywords.map((kw) => ({
    keyword: kw,
    found: resumeKeywords.includes(kw),
    category: categorizeKeyword(kw),
    importance: importanceLevel(kw, jdText),
  }));

  const matchCount = gaps.filter((g) => g.status === "match").length;
  const score = gaps.length ? Math.round((matchCount / gaps.length) * 100) : 100;

  const coverLetter = generateCoverLetter(resumeText, jdText, jobTitle, company, gaps, keywords);
  const portfolio = generatePortfolio(resumeText, jdText, jobTitle, company, gaps);

  const result: AnalysisResult = {
    id,
    jobTitle,
    company,
    createdAt: new Date().toISOString(),
    score,
    gaps,
    keywords,
    coverLetter,
    portfolio,
  };

  resultStore.set(id, result);
  return result;
}

export function getResult(id: string): AnalysisResult | undefined {
  return resultStore.get(id);
}
