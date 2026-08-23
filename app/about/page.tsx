import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({
  title: "About ArthaSiddhi | Financial Education & Calculators",
  description: "Learn how ArthaSiddhi's Indian financial calculators and educational guides help people understand concepts, assumptions, and scenarios.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <InfoPage eyebrow="About" title="Understand the numbers behind financial decisions" description="ArthaSiddhi is an independently operated financial education and calculator platform focused on Indian financial decisions.">
      <section aria-labelledby="what-we-offer"><h2 id="what-we-offer" className="text-2xl font-bold text-slate-950">What you can calculate</h2><p className="mt-3">Use <Link href="/calculators" className="font-semibold text-emerald-700 underline underline-offset-4">the calculators</Link> to check loan repayments, investment and deposit projections, tax or GST arithmetic, and longer-term planning figures. When you want the reasoning behind a number, the <Link href="/learn" className="font-semibold text-emerald-700 underline underline-offset-4">Learn section</Link> uses worked examples to explain selected topics.</p></section>
      <section aria-labelledby="how-to-use"><h2 id="how-to-use" className="text-2xl font-bold text-slate-950">What sits behind a result</h2><p className="mt-3">A result comes from the figures you enter and the calculation convention used. Where contribution timing, compounding, editable rates or rule periods can change the number, the page states them close to the result. You can use an estimate to compare scenarios, but it is not a quote, forecast or decision about eligibility.</p><p className="mt-3">Rule-sensitive calculators show the applicable period, verification date and official sources used. Those references let you check the rule behind the calculation; they do not replace current official information or product documents.</p></section>
      <section aria-labelledby="our-focus"><h2 id="our-focus" className="text-2xl font-bold text-slate-950">What ArthaSiddhi does not do</h2><p className="mt-3">You do not need an account to use the calculators. ArthaSiddhi does not provide recommendations tailored to you or determine whether you qualify for a financial product or benefit. Before acting on an important result, check it against current official information and the terms of the product you are considering, and read the <Link href="/disclaimer" className="font-semibold text-emerald-700 underline underline-offset-4">Financial Disclaimer</Link>.</p></section>
      <section aria-labelledby="standards"><h2 id="standards" className="text-2xl font-bold text-slate-950">How the platform works</h2><p className="mt-3">The <Link href="/editorial-policy" className="font-semibold text-emerald-700 underline underline-offset-4">Editorial Policy</Link> explains how research, rule-sensitive information, numerical examples, and corrections are handled. The <Link href="/methodology" className="font-semibold text-emerald-700 underline underline-offset-4">Calculator Methodology</Link> explains how to interpret inputs, assumptions, projections, and real-world differences.</p><p className="mt-3">Questions, suspected errors, and calculator issues can be sent through the <Link href="/contact" className="font-semibold text-emerald-700 underline underline-offset-4">Contact page</Link>.</p></section>
    </InfoPage>
  );
}
