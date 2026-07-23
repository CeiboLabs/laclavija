import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { TopProgress } from "@/components/layout/top-progress";
import { BUSINESS } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BUSINESS.name} — Guitarras en Montevideo`,
    template: `%s · ${BUSINESS.name}`,
  },
  description: BUSINESS.tagline,
  openGraph: {
    title: BUSINESS.name,
    description: BUSINESS.tagline,
    type: "website",
    locale: "es_UY",
    url: siteUrl,
    siteName: BUSINESS.name,
  },
  twitter: {
    card: "summary_large_image",
    title: BUSINESS.name,
    description: BUSINESS.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh bg-background text-foreground font-sans antialiased">
        <Suspense fallback={null}>
          <TopProgress />
        </Suspense>
        {children}
        <Analytics />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            classNames: {
              toast: "bg-card border border-border text-foreground",
              title: "font-medium",
              description: "text-muted-foreground",
              actionButton: "bg-accent text-accent-foreground",
              success: "border-accent/40",
            },
          }}
        />
      </body>
    </html>
  );
}
