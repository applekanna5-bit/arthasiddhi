import Link from "next/link";
import { getCalculatorGuideCuration } from "@/lib/content/discovery";
import { getArticlePath } from "@/lib/content/seo";
import { getCalculator, getRelatedCalculators, type CalculatorSlug } from "@/lib/content/calculators";

export function CalculatorRelatedContent({ slug }: { slug: CalculatorSlug }) {
  const calculator = getCalculator(slug);
  const { core: primaryGuide, supporting: supportingGuides } = getCalculatorGuideCuration(slug);
  const relatedCalculators = getRelatedCalculators(calculator.relatedCalculators);

  if (!primaryGuide && !supportingGuides.length && !relatedCalculators.length) return null;

  return (
    <div className="mt-10 space-y-8">
      {(primaryGuide || supportingGuides.length > 0) && (
        <section aria-labelledby="calculator-guides-heading">
          <h2 id="calculator-guides-heading" className="text-2xl font-bold tracking-tight text-slate-950">Guides for this calculator</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {primaryGuide && <Link href={getArticlePath(primaryGuide)} className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 transition hover:border-emerald-300 focus:outline-none focus:ring-3 focus:ring-emerald-100"><p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">Main guide</p><h3 className="mt-2 font-semibold text-slate-950">{primaryGuide.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{primaryGuide.description}</p></Link>}
            {supportingGuides.map((article) => <Link key={article.slug} href={getArticlePath(article)} className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 focus:outline-none focus:ring-3 focus:ring-emerald-100"><p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">Related guide</p><h3 className="mt-2 font-semibold text-slate-950">{article.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{article.description}</p></Link>)}
          </div>
        </section>
      )}
      {relatedCalculators.length > 0 && (
        <section aria-labelledby="calculator-related-heading">
          <h2 id="calculator-related-heading" className="text-2xl font-bold tracking-tight text-slate-950">Related calculators</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCalculators.map((related) => <Link key={related.slug} href={related.href} className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 focus:outline-none focus:ring-3 focus:ring-emerald-100"><h3 className="font-semibold text-slate-950">{related.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{related.description}</p></Link>)}
          </div>
        </section>
      )}
    </div>
  );
}
