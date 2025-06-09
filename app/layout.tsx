import "./globals.css";
import { Poppins, Karla } from "next/font/google";
import { ThemeProvider } from "next-themes";
import HeaderAuth from "@/components/header-auth";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import clsx from "clsx";
import Head from "next/head";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL("https://swoletrack.vercel.app"),
  title: "SwoleTrac",
  description: "A workout tracker for getting your swole on.",
  openGraph: {
    title: "SwoleTrac",
    description: "A workout tracker for getting your swole on.",
    url: "https://swoletrack.vercel.app",
    siteName: "SwoleTrac",
    type: "website",
    locale: "en",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "SwoleTrac social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwoleTrac",
    description: "A workout tracker for getting your swole on.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-96x96.png",
    apple: "/favicon/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#0f172a",
};

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-title",
});

const karla = Karla({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
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
      className={clsx(poppins.variable, karla.variable)}
    >
      <Head>
        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" href="/splash/splash-640x1136.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="/splash/splash-750x1334.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" href="/splash/splash-1125x2436.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" href="/splash/splash-1170x2532.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" href="/splash/splash-1284x2778.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" href="/splash/splash-828x1792.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" href="/splash/splash-1242x2688.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" href="/splash/splash-1536x2048.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" href="/splash/splash-1668x2224.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" href="/splash/splash-1668x2388.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" href="/splash/splash-2048x2732.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 1112px) and (device-height: 834px) and (-webkit-device-pixel-ratio: 2)" href="/splash/splash-2224x1668.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 1194px) and (device-height: 834px) and (-webkit-device-pixel-ratio: 2)" href="/splash/splash-2388x1668.png" />
        <link rel="apple-touch-startup-image" media="(device-width: 1366px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" href="/splash/splash-2732x2048.png" />
      </Head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navbar */}
          <nav className="navbar border-b border-border px-4 sm:px-6 bg-background text-foreground">
            <div className="flex-1">
              <Link href="/" className="text-lg font-bold tracking-tight">
                ST
              </Link>
            </div>
            <div className="flex-none">
              {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
            </div>
          </nav>

          {/* Main */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 bg-background text-foreground">
            {children}
          </main>

          {/* Footer */}
          <footer className="footer p-4 border-t border-border bg-background text-sm text-foreground">
            <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>
                Swole <span className="font-bold">Trac</span> &copy;{" "}
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
