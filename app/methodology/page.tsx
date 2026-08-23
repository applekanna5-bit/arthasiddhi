import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({ title: "Calculator Methodology | ArthaSiddhi", description: "How to interpret ArthaSiddhi calculator inputs, assumptions, projections, rounding, rule-sensitive models, and real-world differences.", path: "/methodology" });

export default function MethodologyPage() {
  return (
    <InfoPage eyebrow="Calculator transparency" title="Calculator Methodology" description="A general guide to how ArthaSiddhi's calculators model scenarios and how their estimates should be interpreted. Last updated: 23 August 2026.">
      <section><h2 className="text-2xl font-bold text-slate-950">Defined calculation models</h2><p className="mt-3">Each calculator uses a defined mathematical model based on the values entered and the assumptions programmed for that tool. Calculators do not all use the same formula. The calculator page and its supporting guidance describe the scope and assumptions that matter to that model.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Inputs and assumptions</h2><p className="mt-3">An output is only as meaningful as the entered values, selected assumptions, and calculator scope. Before comparing results, check details such as timing, rate conventions, tenure, contribution patterns, and any rule period shown with the tool.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Projections</h2><p className="mt-3">Future-value and other projected outputs are illustrative, not guarantees. A model may hold an entered rate or assumption constant for the selected period even though market returns, government rules, lender terms, employer records, taxes, fees, and product conditions can change in practice.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Display and rounding</h2><p className="mt-3">Results may be rounded for readable display. Calculator-specific pages explain material conventions where they affect interpretation; displayed figures should not be treated as a universal statement about an institution’s internal precision or settlement method.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Rule-sensitive calculators</h2><p className="mt-3">Some calculators depend partly on financial rules, thresholds, rates, or regulatory contexts that can change. Where relevant, the calculator or related guide identifies an applicable period, assumptions, or official sources. Current information from the responsible authority remains important.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Real-world systems can differ</h2><p className="mt-3">An ArthaSiddhi estimate is not a lender quotation, government-portal result, employer or payroll record, bank calculation, insurer or annuity-provider quotation, tax assessment, or investment outcome. Differences can arise from records, timing, fees, taxes, product terms, rules, and calculation conventions.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Limits and questions</h2><p className="mt-3">Calculators are educational decision-support tools. They do not guarantee an outcome or provide personalized professional advice. Read the local assumptions shown with a calculator and the <Link href="/disclaimer" className="font-semibold text-emerald-700 underline underline-offset-4">Financial Disclaimer</Link>. Suspected calculation problems can be reported through the <Link href="/contact" className="font-semibold text-emerald-700 underline underline-offset-4">Contact page</Link>.</p></section>
    </InfoPage>
  );
}
