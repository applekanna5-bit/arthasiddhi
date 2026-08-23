import type { Metadata } from "next";
import Link from "next/link";
import { categoryDescriptions, categoryLabels, getArticlesByCategory } from "@/lib/content/articles";
import { getHomeGuides } from "@/lib/content/discovery";
import { calculators, type CalculatorSlug } from "@/lib/content/calculators";
import { getArticlePath, pageMetadata } from "@/lib/content/seo";
import type { ContentCategory } from "@/lib/content/types";

export const metadata: Metadata = pageMetadata({
  title: "ArthaSiddhi | Indian Financial Calculators & Guides",
  description:
    "Indian financial calculators and short guides covering loans, investments, savings, income tax, GST and retirement planning.",
  path: "/",
});

const calculatorCardSlugs = ["home-loan", "sip", "fd", "ppf", "inflation", "income-tax"] as const satisfies readonly CalculatorSlug[];
const calculatorCards = calculatorCardSlugs.map((slug) => calculators[slug]);
const learnCategories = (Object.keys(categoryLabels) as ContentCategory[]).filter(
  (category) => getArticlesByCategory(category).length > 0
);
const popularGuides = getHomeGuides();

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">
              Indian financial calculators and guides
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Calculate the numbers. See what they mean.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Check a loan EMI, project how an investment may grow, work out a deposit&apos;s maturity value or estimate tax. You&apos;ll see the result first, followed by the assumptions that matter to that calculation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/calculators"
                className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-3 focus:ring-emerald-200"
              >
                Choose a calculator
              </Link>
              <Link
                href="/learn"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-3 focus:ring-emerald-100"
              >
                Browse learning guides
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8" aria-label="How ArthaSiddhi helps">
            <h2 className="text-xl font-semibold text-slate-950">What do you need to work out?</h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
              <li className="border-l-2 border-emerald-600 pl-4">See a loan&apos;s monthly repayment and its total interest together.</li>
              <li className="border-l-2 border-emerald-600 pl-4">See how much you put in and how much of the projected value comes from growth.</li>
              <li className="border-l-2 border-emerald-600 pl-4">Check the rule period and official sources on tax and retirement calculators.</li>
            </ul>
          </aside>
        </section>

        <section aria-labelledby="calculators-heading" className="border-t border-slate-200 py-12 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">Calculators</p>
              <h2 id="calculators-heading" className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Start with the calculation you need</h2>
              <p className="mt-3 leading-7 text-slate-600">Choose the calculation you need and use your own figures.</p>
            </div>
            <Link href="/calculators" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 focus:outline-none focus:ring-3 focus:ring-emerald-100">View all calculators <span aria-hidden="true">→</span></Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calculatorCards.map((calculator) => (
              <Link key={calculator.href} href={calculator.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100">
                <h3 className="text-lg font-semibold text-slate-950">{calculator.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{calculator.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-emerald-700">Open calculator <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="learn-heading" className="border-t border-slate-200 py-12 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">Learn</p>
            <h2 id="learn-heading" className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Read how the numbers work</h2>
            <p className="mt-3 leading-7 text-slate-600">Short guides break down borrowing, SIPs, fixed deposits and compound interest with examples you can follow.</p>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {learnCategories.map((category) => (
              <Link key={category} href={`/learn/${category}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100">
                <h3 className="font-semibold text-slate-950">{categoryLabels[category]}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{categoryDescriptions[category]}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-emerald-700">View guides <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="popular-guides-heading" className="border-t border-slate-200 py-12 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">Popular guides</p>
              <h2 id="popular-guides-heading" className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Guides worth starting with</h2>
            </div>
            <Link href="/learn" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 focus:outline-none focus:ring-3 focus:ring-emerald-100">View all guides <span aria-hidden="true">→</span></Link>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {popularGuides.map((article) => (
              <Link key={article.slug} href={getArticlePath(article)} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100">
                <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">{categoryLabels[article.category]}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{article.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{article.description}</p>
                <p className="mt-4 text-sm text-slate-500">{article.readingTime}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
