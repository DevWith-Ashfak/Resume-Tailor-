import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Search,
  Sparkles,
  Upload,
  ClipboardPaste,
  Trophy,
  Users,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Users, value: "75%", label: "of resumes never reach a human" },
  { icon: BarChart3, value: "3×", label: "more interviews with tailored resumes" },
  { icon: CheckCircle2, value: "63%", label: "of recruiters prefer keyword-matched CVs" },
];

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Resume",
    desc: "Drag and drop your PDF resume — we'll parse every section automatically.",
    color: "from-blue-500 to-blue-600",
  },
  {
    step: "02",
    icon: ClipboardPaste,
    title: "Paste the Job Description",
    desc: "Copy any job posting and paste it in. The more detail, the better the analysis.",
    color: "from-violet-500 to-purple-600",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Get Instant Insights",
    desc: "Receive a gap analysis, keyword breakdown, and a tailored cover letter in seconds.",
    color: "from-amber-500 to-orange-600",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
        {/* Animated blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-3xl animate-blob1" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-100/60 blur-3xl animate-blob2" />
          <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-50/50 blur-3xl animate-blob3" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #2563eb 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="mx-auto max-w-3xl px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-2 text-sm font-medium text-blue-700 shadow-sm mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-blue-500" />
            AI-Powered Resume Tailoring
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl text-balance animate-fade-in leading-[1.1]">
            Land more interviews
            <br />
            <span className="gradient-text">without the guesswork</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-500 text-balance max-w-xl mx-auto animate-slide-up">
            Upload your resume, paste a job description, and get a detailed gap
            analysis, keyword suggestions, and a tailored cover letter — all
            powered by smart matching that knows what recruiters look for.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link href="/tailor">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:shadow-blue-300 hover:scale-105"
              >
                Get Started — It's Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              See how it works ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="w-full max-w-4xl pb-20 animate-fade-in">
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-6 shadow-sm card-glow"
            >
              <s.icon className="h-8 w-8 text-blue-500 mb-3" />
              <span className="text-3xl font-extrabold text-gray-900">{s.value}</span>
              <span className="text-sm text-gray-500 mt-1 max-w-[180px]">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" className="w-full max-w-5xl pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="mt-3 text-gray-500">Three simple steps to a job-winning application</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="relative flex flex-col items-center text-center rounded-2xl border border-gray-100 bg-white p-8 shadow-sm card-glow"
            >
              <span className="absolute -top-4 left-6 text-5xl font-black text-gray-100 select-none">
                {s.step}
              </span>
              <div
                className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-lg mb-5`}
              >
                <s.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full max-w-2xl pb-20 text-center">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-10 sm:p-14 shadow-2xl shadow-blue-200">
          <Trophy className="h-10 w-10 text-amber-300 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to land your next role?
          </h2>
          <p className="mt-3 text-blue-100 text-balance">
            Stop sending the same resume everywhere. Tailor it in seconds and
            stand out from the stack.
          </p>
          <Link href="/tailor" className="mt-8 inline-block">
            <Button
              size="lg"
              className="gap-2 bg-white text-blue-700 hover:bg-blue-50 shadow-lg transition-all hover:scale-105"
            >
              Start Tailoring Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
