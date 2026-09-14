import Link from "next/link";
import { getCalculator } from "@/lib/content/calculators";
import { isHomeLoanPrimaryArticleSlug, isTaxArticleSlug, type HomeLoanPrimaryArticleSlug } from "@/lib/analytics";
import type { CalculatorSlug } from "@/lib/content/calculators";
import type { ArticleSlug } from "@/lib/content/types";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export function PrimaryCalculatorCallout({ slug, articleSlug }: { slug: CalculatorSlug; articleSlug: ArticleSlug }) {
  const calculator = getCalculator(slug);
  const tracked = slug === "home-loan" && isHomeLoanPrimaryArticleSlug(articleSlug);
  return (
    <aside className="mt-7 max-w-3xl rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
      <h2 className="font-semibold">Use the {calculator.shortName} calculator</h2>
      <p className="mt-2 text-sm leading-6">{calculator.description}</p>
      {tracked ? <TrackedLink href={calculator.href} analytics={{ eventName: "guide_calculator_click", parameters: { article_slug: articleSlug as HomeLoanPrimaryArticleSlug, calculator_slug: "home-loan", placement: "primary_callout" } }} className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4 focus:outline-none focus:ring-3 focus:ring-emerald-100">Open the {calculator.name} <span aria-hidden="true">→</span></TrackedLink> : slug === "income-tax" && isTaxArticleSlug(articleSlug) ? <TrackedLink analytics={{ eventName: "tax_guide_calculator_click", parameters: { article_slug: articleSlug, calculator_slug: "income-tax", placement: "primary_callout" } }} href={calculator.href} className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4 focus:outline-none focus:ring-3 focus:ring-emerald-100">Open the {calculator.name} <span aria-hidden="true">→</span></TrackedLink> : <Link href={calculator.href} className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4 focus:outline-none focus:ring-3 focus:ring-emerald-100">Open the {calculator.name} <span aria-hidden="true">→</span></Link>}
    </aside>
  );
}
