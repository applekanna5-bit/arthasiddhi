import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({
  title: "About ArthaSiddhi | Indian Financial Calculators",
  description: "What ArthaSiddhi calculates, how its short finance guides support the tools, and the limits of its estimates.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <InfoPage eyebrow="About" title="Calculators that show their assumptions" description="ArthaSiddhi provides Indian financial calculators and short guides that explain what the results include and what can change them.">
      <section aria-labelledby="what-we-offer"><h2 id="what-we-offer" className="text-2xl font-bold text-slate-950">What you can calculate</h2><p className="mt-3">The calculators cover loan EMIs and repayment schedules, SIP and lumpsum projections, FD, RD and PPF maturity amounts, income tax and GST, EPF and NPS, gratuity, inflation and related planning calculations. The <Link href="/learn" className="font-semibold text-emerald-700 underline underline-offset-4">Learn section</Link> has short guides on the concepts behind selected tools.</p></section>
      <section aria-labelledby="how-to-use"><h2 id="how-to-use" className="text-2xl font-bold text-slate-950">How the calculators should be used</h2><p className="mt-3">Each result depends on the figures and assumptions entered. Where timing conventions, editable rates or rule periods matter, the calculator shows them on the page. An estimate can help compare scenarios, but it is not a quote, forecast or determination of eligibility.</p></section>
      <section aria-labelledby="our-focus"><h2 id="our-focus" className="text-2xl font-bold text-slate-950">Accounts and limitations</h2><p className="mt-3">The calculators currently work without an account. Educational articles provide general information, not recommendations tailored to an individual. Check important figures against current official information and product documents, and read the <Link href="/disclaimer" className="font-semibold text-emerald-700 underline underline-offset-4">Financial Disclaimer</Link> for the limits of the information provided.</p></section>
    </InfoPage>
  );
}
