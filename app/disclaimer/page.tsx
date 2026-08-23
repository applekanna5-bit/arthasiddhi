import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({ title: "Financial Disclaimer | ArthaSiddhi", description: "Important limits of ArthaSiddhi's educational finance content, assumptions, and illustrative calculator results.", path: "/disclaimer" });

export default function DisclaimerPage() {
  return (
    <InfoPage eyebrow="Important information" title="Financial Disclaimer" description="ArthaSiddhi provides educational information and scenario-based estimates, not individualized financial, investment, tax, legal, or lending advice. Last updated: 23 August 2026.">
      <section><h2 className="text-2xl font-bold text-slate-950">Educational information</h2><p className="mt-3">Articles explain general financial concepts for learning. They are not recommendations to borrow, invest, buy, sell, or select a particular product, and they do not account for your complete financial circumstances.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Illustrative calculator outputs</h2><p className="mt-3">Calculator results are estimates based on the values and assumptions entered. They do not determine eligibility for a financial product or benefit. Actual outcomes may differ because interest methods, rates, taxes, charges, regulations, lender or product terms, rounding and timing can differ.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Investment risk</h2><p className="mt-3">Assumed or historical returns do not guarantee future results. Market-linked investments can rise or fall in value, and capital may be at risk.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Tax, legal, lending, and regulatory information</h2><p className="mt-3">Tax treatment, legal requirements, lending eligibility, government schemes, and regulatory rules can change and may apply differently to individual circumstances. ArthaSiddhi cannot approve a loan or benefit, issue a tax assessment, or replace information from the relevant authority or provider.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Product and provider differences</h2><p className="mt-3">A lender, bank, employer, government portal, insurer, annuity provider, or investment product may use terms, records, fees, timing, or calculation conventions that differ from an ArthaSiddhi estimate. Calculator-specific assumptions and limitations shown near a tool continue to apply.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Verify important decisions</h2><p className="mt-3">Use current official documents, regulated product disclosures, and information from relevant institutions when making important decisions. Consider advice from an appropriately qualified professional where your circumstances require it.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Using this website</h2><p className="mt-3">By using ArthaSiddhi, you acknowledge these limitations. Read the <Link href="/methodology" className="font-semibold text-emerald-700 underline underline-offset-4">Calculator Methodology</Link> for the general modelling approach and the <Link href="/terms" className="font-semibold text-emerald-700 underline underline-offset-4">Terms of Use</Link> for the broader conditions of use.</p></section>
    </InfoPage>
  );
}
