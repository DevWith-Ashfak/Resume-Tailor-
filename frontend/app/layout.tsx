import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resume Tailor — AI-Powered Resume Analysis",
  description:
    "Upload your resume, paste a job description, and get an AI-powered gap analysis, keyword suggestions, and a tailored cover letter.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* ── Header ── */}
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/50">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <a
              href="/"
              className="flex items-center gap-2.5 font-bold text-gray-900 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200 group-hover:shadow-lg group-hover:scale-105 transition-all">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <span className="text-lg">Resume Tailor</span>
            </a>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <a
                href="/"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Home
              </a>
              <a
                href="/tailor"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Tailor
              </a>
              <a
                href="/tailor"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:scale-105 transition-all text-sm"
              >
                Get Started
              </a>
            </nav>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="flex-1">{children}</main>

        {/* ── Footer ── */}
        <footer className="relative border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span>
                  &copy; {new Date().getFullYear()} Resume Tailor. Built to
                  help you land the job.
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <a href="/" className="hover:text-gray-600 transition-colors">
                  Home
                </a>
                <a
                  href="/tailor"
                  className="hover:text-gray-600 transition-colors"
                >
                  Tailor
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
