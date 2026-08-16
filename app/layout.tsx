import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { websiteJsonLd } from "@/lib/content/seo";
import { siteUrl } from "@/lib/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ArthaSiddhi | Indian Financial Calculators",
  description: "Indian financial calculators and short guides for loans, investments, savings, tax and retirement planning.",
  openGraph: { siteName: "ArthaSiddhi", type: "website", url: siteUrl },
  twitter: { card: "summary", title: "ArthaSiddhi | Indian Financial Calculators", description: "Indian financial calculators and short guides for loans, investments, savings, tax and retirement planning." },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </body>
    </html>
  );
}
