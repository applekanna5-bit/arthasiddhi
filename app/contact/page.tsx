import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact ArthaSiddhi",
  description: "Current contact availability and links to information about ArthaSiddhi's calculators, privacy and financial limitations.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <InfoPage eyebrow="Contact" title="Contact ArthaSiddhi" description="ArthaSiddhi does not currently provide a public email address or contact form.">
      <section aria-labelledby="site-information"><h2 id="site-information" className="text-2xl font-bold text-slate-950">Site information</h2><p className="mt-3">For how the calculators are intended to be used, read <Link href="/about" className="font-semibold text-emerald-700 underline underline-offset-4">About ArthaSiddhi</Link>. For data handling, read the <Link href="/privacy" className="font-semibold text-emerald-700 underline underline-offset-4">Privacy Policy</Link>. For the limits of calculator results and educational content, read the <Link href="/disclaimer" className="font-semibold text-emerald-700 underline underline-offset-4">Financial Disclaimer</Link>.</p></section>
    </InfoPage>
  );
}
