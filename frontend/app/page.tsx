import Link from "next/link";
import { ArrowRight, FileText, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileText,
    title: "Smart PDF Parsing",
    description:
      "Upload your resume in PDF format and we'll extract every detail automatically — no manual typing required.",
  },
  {
    icon: Search,
    title: "Gap Analysis",
    description:
      "See exactly which skills and keywords from the job description are present in your resume, and which are missing.",
  },
  {
    icon: Sparkles,
    title: "Tailored Output",
    description:
      "Get a customized cover letter and portfolio summary written specifically for the job you're targeting.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex flex-col items-center text-center max-w-2xl pt-16 pb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Resume Tailoring
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl text-balance">
          Land more interviews with a resume tailored to every job
        </h1>
        <p className="mt-4 text-lg text-gray-500 text-balance max-w-xl">
          Upload your resume, paste a job description, and let our AI identify
          skill gaps, suggest keywords, and generate a tailored cover letter —
          all in seconds.
        </p>
        <Link href="/tailor" className="mt-8">
          <Button size="lg" className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="grid gap-6 sm:grid-cols-3 w-full max-w-4xl pb-16">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex flex-col items-center text-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow animate-slide-up"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 mb-4">
              <f.icon className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{f.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{f.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
