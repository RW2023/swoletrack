// app/layout.tsx
import "./globals.css";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import HeaderAuth from "@/components/header-auth";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import clsx from "clsx";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Swole Tracker",
  description: "A workout tracker for getting your swole on.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx(geistSans.className)}
    >
      <body className="min-h-screen flex flex-col">
        {/* ✅ ThemeProvider goes inside <body> */}
        <ThemeProvider
          attribute="class" // Applies class="light" or "dark" on html
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navbar */}
          <nav className="navbar border-b border-base-300 px-4 sm:px-6 bg-base-100 text-base-content">
            <div className="flex-1">
              <Link href="/" className="text-lg font-bold tracking-tight">
                SwoleTrac
              </Link>
            </div>
            <div className="flex-none">
              {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
            </div>
          </nav>

          {/* Main */}
          <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 bg-base-100 text-base-content">
            {children}
          </main>

          {/* Footer */}
          <footer className="footer p-4 border-t border-base-300 bg-base-100 text-sm text-base-content">
            <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>
                Swole <span className="font-bold">Tracker</span> &copy;{" "}
                {new Date().getFullYear()}
              </p>
              <ThemeSwitcher />
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
