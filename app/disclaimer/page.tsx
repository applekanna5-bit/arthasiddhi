import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({ title: "Financial Disclaimer | ArthaSiddhi", description: "Important limits of ArthaSiddhi's educational finance content, assumptions, and illustrative calculator results.", path: "/disclaimer" });

export default function DisclaimerPage() {
  return (
    <InfoPage eyebrow="Important information" title="Financial Disclaimer" description="ArthaSiddhi provides educational information and scenario-based estimates, not individualized financial or investment advice. Last updated: 16 August 2026.">
      <section><h2 className="text-2xl font-bold text-slate-950">Educational information</h2><p className="mt-3">Articles explain general financial concepts for learning. They are not recommendations to borrow, invest, buy, sell, or select a particular product, and they do not account for your complete financial circumstances.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Illustrative calculator outputs</h2><p className="mt-3">Calculator results are estimates based on the values and assumptions entered. Actual interest calculations, rates, taxes, charges, regulations, lender terms, investment returns, product conditions, rounding, and timing may differ.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Investment risk</h2><p className="mt-3">Assumed or historical returns do not guarantee future results. Market-linked investments can rise or fall in value, and capital may be at risk.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Verify important decisions</h2><p className="mt-3">Use current official documents, regulated product disclosures, and information from relevant institutions when making important decisions. Consider advice from an appropriately qualified professional where your circumstances require it.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Using this website</h2><p className="mt-3">By using ArthaSiddhi, you acknowledge these limitations. The <Link href="/terms" className="font-semibold text-emerald-700 underline underline-offset-4">Terms of Use</Link> provide the broader conditions for use of the website.</p></section>
    </InfoPage>
  );
}
