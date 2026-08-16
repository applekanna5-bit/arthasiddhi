import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({
  title: "About ArthaSiddhi | Financial Calculators & Education",
  description: "Learn what ArthaSiddhi offers and how its calculators and educational guides support practical financial understanding in India.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <InfoPage eyebrow="About" title="Practical tools for clearer financial understanding" description="ArthaSiddhi brings financial calculations and plain-language education together in one public resource for Indian users.">
      <section aria-labelledby="what-we-offer"><h2 id="what-we-offer" className="text-2xl font-bold text-slate-950">What ArthaSiddhi offers</h2><p className="mt-3">You can use ArthaSiddhi to explore loan repayments, systematic investment scenarios, and fixed-deposit maturity estimates. The <Link href="/learn" className="font-semibold text-emerald-700 underline underline-offset-4">Learn section</Link> explains the concepts behind these calculations so that inputs and results are easier to understand.</p></section>
      <section aria-labelledby="how-to-use"><h2 id="how-to-use" className="text-2xl font-bold text-slate-950">How to use the information</h2><p className="mt-3">Calculator results are illustrative and depend on the assumptions you enter. Educational articles provide general information, not recommendations tailored to an individual. Important decisions should be checked against current official information, product documents, and appropriately qualified advice where needed.</p></section>
      <section aria-labelledby="our-focus"><h2 id="our-focus" className="text-2xl font-bold text-slate-950">Our focus</h2><p className="mt-3">The project focuses on practical Indian financial understanding: clear terminology, transparent assumptions, useful internal links, and lightweight tools that work without an account. Read the <Link href="/disclaimer" className="font-semibold text-emerald-700 underline underline-offset-4">Financial Disclaimer</Link> for the limits of the information provided.</p></section>
    </InfoPage>
  );
}
