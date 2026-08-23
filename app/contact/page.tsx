import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact ArthaSiddhi",
  description: "Contact ArthaSiddhi about factual corrections, outdated information, calculator issues, broken pages, privacy, or general enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <InfoPage eyebrow="Contact" title="Contact ArthaSiddhi" description="Use the public mailbox below for general enquiries or to report an issue with the website, its content, or a calculator.">
      <section aria-labelledby="email"><h2 id="email" className="text-2xl font-bold text-slate-950">Email</h2><p className="mt-3">Write to <a href="mailto:contact@arthasiddhi.com" className="font-semibold text-emerald-700 underline underline-offset-4">contact@arthasiddhi.com</a>. ArthaSiddhi does not use a contact-form backend, and no response time is promised.</p></section>
      <section aria-labelledby="what-to-report"><h2 id="what-to-report" className="text-2xl font-bold text-slate-950">What you can report</h2><ul className="mt-3 list-disc space-y-2 pl-6"><li>A suspected factual error or outdated rule-sensitive information</li><li>A calculator result or assumption that may need review</li><li>A broken page, link, or other technical problem</li><li>A privacy-related question or general enquiry</li></ul><p className="mt-3">When reporting a content or calculator issue, include the page address and enough detail to reproduce or understand it. Avoid sending sensitive personal or financial information.</p></section>
      <section aria-labelledby="site-information"><h2 id="site-information" className="text-2xl font-bold text-slate-950">Related information</h2><p className="mt-3">Read the <Link href="/editorial-policy" className="font-semibold text-emerald-700 underline underline-offset-4">Editorial Policy</Link> for the corrections process, the <Link href="/privacy" className="font-semibold text-emerald-700 underline underline-offset-4">Privacy Policy</Link> for data handling, and the <Link href="/disclaimer" className="font-semibold text-emerald-700 underline underline-offset-4">Financial Disclaimer</Link> for the limits of calculator results and educational content.</p></section>
    </InfoPage>
  );
}
