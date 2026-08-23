import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({ title: "Terms of Use | ArthaSiddhi", description: "Terms governing use of ArthaSiddhi's educational finance content and illustrative calculators.", path: "/terms" });

export default function TermsPage() {
  return (
    <InfoPage eyebrow="Legal" title="Terms of Use" description="These terms apply when you access or use ArthaSiddhi. Last updated: 23 August 2026.">
      <section><h2 className="text-2xl font-bold text-slate-950">Educational use</h2><p className="mt-3">ArthaSiddhi provides general educational information and illustrative financial calculators. It does not provide individualized financial, investment, tax, or legal advice, and no content creates a professional or advisory relationship.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Calculator results and accuracy</h2><p className="mt-3">Results depend on the values and assumptions entered. Although reasonable care is taken in presenting calculations and content, completeness, accuracy, or suitability for a particular purpose is not guaranteed. Verify important figures using current information from the relevant lender, bank, investment provider, government authority or qualified professional.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Your responsibility</h2><p className="mt-3">You remain responsible for evaluating information and for decisions made using it. Rates, fees, taxes, regulations, eligibility, and product terms can change or apply differently to individual circumstances.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Acceptable use</h2><p className="mt-3">Do not misuse the site, interfere with its operation or security, attempt unauthorized access, or use its content in a way that violates applicable law or the rights of others.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Content and intellectual property</h2><p className="mt-3">The ArthaSiddhi name, site presentation, original articles, and original supporting material may not be copied or represented as another party’s work without permission, except where use is permitted by applicable law. External source material remains subject to its respective owner’s terms.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Availability and limitations</h2><p className="mt-3">The site or individual features may be corrected, changed, suspended, or withdrawn. To the extent permitted by applicable law, ArthaSiddhi is not responsible for losses arising solely from reliance on illustrative outputs, service interruptions, or use of external links.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Related policies</h2><p className="mt-3">Please also read the <Link href="/privacy" className="font-semibold text-emerald-700 underline underline-offset-4">Privacy Policy</Link>, <Link href="/disclaimer" className="font-semibold text-emerald-700 underline underline-offset-4">Financial Disclaimer</Link>, and <Link href="/methodology" className="font-semibold text-emerald-700 underline underline-offset-4">Calculator Methodology</Link>. Questions can be sent through the <Link href="/contact" className="font-semibold text-emerald-700 underline underline-offset-4">Contact page</Link>.</p></section>
    </InfoPage>
  );
}
