import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import { Toaster } from "sonner";
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
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
  // Cuando des de alta el sitio en Google Search Console, Google te va a pedir un
  // meta tag para verificar la propiedad. Pegá el token acá (el string después
  // de content=... en el tag que te da Google) o dejalo vacío si todavía no.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

const cfAnalyticsToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh bg-background text-foreground font-sans antialiased">
        <Suspense fallback={null}>
          <TopProgress />
        </Suspense>
        {children}
        {cfAnalyticsToken ? (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${cfAnalyticsToken}"}`}
            strategy="afterInteractive"
          />
        ) : null}
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
