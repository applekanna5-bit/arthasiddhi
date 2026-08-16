import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact ArthaSiddhi",
  description: "Current contact information and guidance for questions about ArthaSiddhi's public calculators and educational content.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <InfoPage eyebrow="Contact" title="Contact ArthaSiddhi" description="ArthaSiddhi does not currently operate a public contact form or publish a support email address.">
      <section aria-labelledby="contact-status"><h2 id="contact-status" className="text-2xl font-bold text-slate-950">Current contact options</h2><p className="mt-3">A verified public contact channel is being established. This page will be updated when one is available. We have not included a form that cannot deliver messages or an unverified email address.</p></section>
      <section aria-labelledby="helpful-resources"><h2 id="helpful-resources" className="text-2xl font-bold text-slate-950">Helpful resources</h2><p className="mt-3">For information about how the site handles data, read the <Link href="/privacy" className="font-semibold text-emerald-700 underline underline-offset-4">Privacy Policy</Link>. For the limits of calculator results and educational content, read the <Link href="/disclaimer" className="font-semibold text-emerald-700 underline underline-offset-4">Financial Disclaimer</Link>.</p></section>
    </InfoPage>
  );
}
