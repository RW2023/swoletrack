import "./globals.css";
import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import React from "react";

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
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      {/* 
        1) "flex flex-col min-h-screen" makes the whole viewport
           a vertical flex container.
      */}
      <body className="bg-background text-foreground flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 2) Main is now a flex column that can grow to fill leftover space */}
          <main className="flex flex-col flex-grow w-full">
            {/* Nav at the top */}
            <nav className="w-full border-b border-b-foreground/10 h-16 flex justify-center">
              <div className="max-w-5xl w-full flex justify-between items-center px-5 py-3 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                  {/* If you had a brand/logo link, put it here */}
                </div>
                {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
              </div>
            </nav>

            {/* Page content in the middle, uses flex-grow to push footer down */}
            <div className="flex-grow w-full flex flex-col gap-20 items-center">
              <div className="flex flex-col gap-20 max-w-5xl w-full p-5">
                {children}
              </div>
            </div>
          </main>

          {/* 3) Footer at the bottom, after main */}
          <footer className="w-full border-t border-border bg-background text-foreground py-10">
            <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <p className="text-muted-foreground">
                Swole <span className="font-semibold text-foreground">Tracker</span> &copy; {new Date().getFullYear()}
              </p>
              <ThemeSwitcher />
            </div>
          </footer>

        </ThemeProvider>
      </body>
    </html>
  );
}
