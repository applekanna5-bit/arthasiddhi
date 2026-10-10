import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";
import { categoryLabels, publishedCategories } from "@/lib/content/articles";
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
const guides = getHomeGuides();
const journeys: Record<ContentCategory, { title: string; description: string }> = {
  "personal-finance": { title: "Give your money a clear purpose", description: "Understand cash flow, competing commitments and the money you may need to keep accessible." },
  loans: { title: "Look beyond the monthly payment", description: "Explore borrowing costs, repayment choices and the commitments behind a loan." },
  investments: { title: "Put investment scenarios in context", description: "Understand contributions, time horizons and the limits of projected returns." },
  banking: { title: "Choose and manage your deposits", description: "Consider access, maturity, deposit protection and the differences between saving approaches." },
  tax: { title: "Understand the tax calculation", description: "Explore income-tax and GST concepts, supported calculations and their applicable assumptions." },
  retirement: { title: "Understand longer-term planning", description: "Explore EPF, NPS and gratuity, including the rules and assumptions behind their estimates." },
};
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--as-brand-teal)]";
const card = `group rounded-xl border border-[var(--as-border-subtle)] bg-[var(--as-surface-card)] p-5 sm:p-6 hover:border-[var(--as-brand-teal)] ${focus}`;
const textLink = `inline-flex min-h-11 items-center gap-2 rounded-sm py-2 text-sm font-semibold text-[var(--as-brand-teal)] underline decoration-transparent underline-offset-4 hover:decoration-current ${focus}`;
const eyebrow = "text-xs font-semibold tracking-[0.16em] uppercase text-[var(--as-brand-copper)]";
const heading = "text-3xl font-semibold leading-tight tracking-tight sm:text-4xl";
const steps = [
  { title: "Understand", copy: "Start with the question and the context." },
  { title: "Calculate", copy: "Explore a scenario using your own figures." },
  { title: "Compare", copy: "See what changes when assumptions change." },
  { title: "Decide", copy: "Bring the numbers back to your priorities." },
];
function Arrow() { return <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.5} />; }

export default function HomePage() {
  return (
    <main className="flex-1 bg-[var(--as-surface-page)] text-[var(--as-text-primary)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section aria-labelledby="home-heading" className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16 lg:py-24">
          <div className="min-w-0">
            <p className={eyebrow}>Indian personal finance</p>
            <h1 id="home-heading" className="mt-5 max-w-2xl text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-6xl lg:text-[4.25rem]">Make smarter money decisions.</h1>
            <p className="mt-6 text-xl font-medium leading-relaxed text-[var(--as-brand-teal)]">Understand. Calculate. Compare. Decide.</p>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--as-text-secondary)] sm:text-lg sm:leading-8">Explore clear explanations, compare financial scenarios and use calculators to understand the assumptions behind everyday money decisions in India.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#decisions" className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[var(--as-action-primary)] px-5 py-3 text-sm font-semibold text-[var(--as-text-on-action)] hover:bg-[var(--as-action-primary-hover)] ${focus}`}>Explore money decisions <Arrow /></a>
              <Link href="/calculators" className={`inline-flex min-h-12 items-center justify-center rounded-lg border border-[var(--as-border-control)] px-5 py-3 text-sm font-semibold hover:bg-[var(--as-surface-card)] ${focus}`}>Browse calculators</Link>
            </div>
          </div>
          <aside aria-label="A thoughtful approach to money decisions" className="min-w-0 rounded-2xl bg-[var(--as-brand-navy)] p-6 text-white sm:p-8">
            <div className="text-xl"><BrandLogo treatment="monochrome" /></div>
            <p className="mt-6 text-sm leading-6 text-white">A little clarity, before your next step.</p>
            <ol className="mt-6 divide-y divide-white/20">
              {steps.map((step, index) => <li key={step.title} className="flex gap-4 py-4 first:pt-0 last:pb-0"><span aria-hidden="true" className="pt-1 text-xs font-medium text-white">0{index + 1}</span><div><h2 className="text-lg font-medium">{step.title}</h2><p className="mt-1 text-sm leading-6 text-white">{step.copy}</p></div></li>)}
            </ol>
          </aside>
        </section>

        <section id="decisions" tabIndex={-1} aria-labelledby="decisions-heading" className={`scroll-mt-6 border-t border-[var(--as-border-subtle)] py-10 sm:py-16 ${focus}`}>
          <p className={eyebrow}>Start with your decision</p>
          <h2 id="decisions-heading" className={`mt-3 max-w-3xl ${heading}`}>What financial decision are you working through?</h2>
          <p className="mt-4 max-w-2xl leading-7 text-[var(--as-text-secondary)]">Choose a topic to explore the questions, trade-offs and explanations that matter to you.</p>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publishedCategories.map((category) => <Link key={category} href={`/learn/${category}`} className={`${card} flex flex-col`}>
              <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold tracking-wide text-[var(--as-brand-teal)] uppercase">{categoryLabels[category]}</p><Arrow /></div>
              <h3 className="mt-4 text-xl font-semibold leading-7 tracking-tight sm:mt-5">{journeys[category].title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--as-text-secondary)]">{journeys[category].description}</p>
              <span className="mt-auto pt-4 text-sm sm:pt-6 font-semibold text-[var(--as-brand-teal)]">Explore guides</span>
            </Link>)}
          </div>
        </section>

        <section aria-labelledby="calculators-heading" className="border-t border-[var(--as-border-subtle)] py-10 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className={eyebrow}>Tools for perspective</p><h2 id="calculators-heading" className={`mt-3 ${heading}`}>Work through the numbers</h2><p className="mt-4 max-w-2xl leading-7 text-[var(--as-text-secondary)]">Use a calculator to explore a scenario, then read the assumptions behind the result.</p></div><Link href="/calculators" className={textLink}>View all calculators <Arrow /></Link></div>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {calculatorCardSlugs.map((slug) => { const calculator = calculators[slug]; return <Link key={slug} href={calculator.href} className={`${card} flex flex-col`}><h3 className="flex items-start justify-between gap-3 text-lg font-semibold">{calculator.name}<Arrow /></h3><p className="mt-3 text-sm leading-6 text-[var(--as-text-secondary)]">{calculator.description}</p><span className="mt-auto pt-4 text-sm font-semibold text-[var(--as-brand-teal)] sm:pt-6">Open calculator</span></Link>; })}
          </div>
        </section>

        <section aria-labelledby="guides-heading" className="border-t border-[var(--as-border-subtle)] py-10 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className={eyebrow}>Financial education</p><h2 id="guides-heading" className={`mt-3 ${heading}`}>Build your understanding</h2><p className="mt-4 max-w-2xl leading-7 text-[var(--as-text-secondary)]">Start with these home-loan guides, or browse the full collection for other money questions.</p></div><Link href="/learn" className={textLink}>Browse all guides <Arrow /></Link></div>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-3">
            {guides.map((article) => <Link key={article.slug} href={getArticlePath(article)} className={`${card} flex flex-col`}><p className="text-xs font-semibold tracking-wide text-[var(--as-brand-teal)] uppercase">{categoryLabels[article.category]}</p><h3 className="mt-4 text-xl font-semibold leading-7 tracking-tight">{article.title}</h3><p className="mt-3 text-sm leading-6 text-[var(--as-text-secondary)]">{article.description}</p><div className="mt-auto flex items-center justify-between gap-3 pt-4 text-sm text-[var(--as-text-secondary)] sm:pt-6"><span>{article.readingTime}</span><Arrow /></div></Link>)}
          </div>
        </section>

        <section aria-labelledby="trust-heading" className="mb-10 rounded-2xl border border-[var(--as-border-subtle)] bg-[var(--as-surface-soft)] p-6 sm:mb-16 sm:p-10">
          <p className={eyebrow}>Context matters</p><h2 id="trust-heading" className={`mt-3 ${heading}`}>Understand the assumptions</h2>
          <p className="mt-4 max-w-3xl leading-7 text-[var(--as-text-secondary)]">A calculation is a model, not a promise. Explore how the tools work, how content is researched and where ArthaSiddhi draws the line between education and personal advice.</p>
          <div className="mt-7 grid gap-6 md:grid-cols-3">
            <div><Link href="/methodology" className={textLink}>Calculator methodology <Arrow /></Link><p className="mt-2 text-sm leading-6 text-[var(--as-text-secondary)]">Read about input assumptions, projections, rounding and real-world differences.</p></div>
            <div><Link href="/editorial-policy" className={textLink}>Editorial policy <Arrow /></Link><p className="mt-2 text-sm leading-6 text-[var(--as-text-secondary)]">See the approach to sources, rule-sensitive information and corrections.</p></div>
            <div><Link href="/about" className={textLink}>About ArthaSiddhi <Arrow /></Link><p className="mt-2 text-sm leading-6 text-[var(--as-text-secondary)]">Understand the purpose and scope of this financial education platform.</p></div>
          </div>
          <p className="mt-8 border-t border-[var(--as-border-subtle)] pt-5 text-sm leading-6 text-[var(--as-text-secondary)]">Educational information and illustrative calculations. Not personalized financial advice.</p>
        </section>
      </div>
    </main>
  );
}
