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
      <body className={inter.className}>
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <a href="/" className="flex items-center gap-2 font-bold text-brand-700">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-brand-600"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
              Resume Tailor
            </a>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/tailor" className="text-gray-600 hover:text-gray-900 transition-colors">
                Tailor
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Resume Tailor. Built to help you land the job.
        </footer>
      </body>
    </html>
  );
}
