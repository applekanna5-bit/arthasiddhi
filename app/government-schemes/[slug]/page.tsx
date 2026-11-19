import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/content/seo";
import { schemeDrafts } from "@/lib/government-schemes/guide-content";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return schemeDrafts.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = schemeDrafts.find((item) => item.slug === slug);
  if (!guide) return {};
  return { ...pageMetadata({ title: guide.title + " | ArthaSiddhi", description: guide.intro, path: "/government-schemes/" + slug }), robots: { index: false, follow: true } };
}
export default async function SchemeGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = schemeDrafts.find((item) => item.slug === slug);
  if (!guide) notFound();
  return (
    <main className="learn-editorial flex-1 bg-[var(--as-surface-page)] px-4 py-10 text-[var(--as-text-primary)] sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <Link href="/government-schemes" className="text-sm font-semibold text-[var(--as-brand-teal)] underline underline-offset-4">Government Schemes</Link>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--as-brand-copper)]">Independent education · Editorial draft</p>
        <h1 className="learn-display mt-3 text-4xl leading-tight sm:text-5xl">{guide.title}</h1>
        <p className="mt-5 text-lg leading-8 text-[var(--as-text-secondary)]">{guide.intro}</p>
        <p className="mt-5 rounded-lg border border-[var(--as-border-subtle)] p-4 text-sm leading-6">Editorial review in progress. Confirm the latest scheme rules, amendments and rates with official authorities before relying on this guide.</p>
        {slug === "ppf" && (
          <section aria-label="PPF at a glance" className="mt-7 rounded-xl border border-[var(--as-border-subtle)] bg-[var(--as-surface-card)] p-5">
            <h2 className="learn-display text-xl">PPF at a glance</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              <div><dt className="text-sm text-[var(--as-text-secondary)]">Annual deposit</dt><dd className="mt-1 font-semibold">₹500–₹1,50,000</dd></div>
              <div><dt className="text-sm text-[var(--as-text-secondary)]">Normal maturity</dt><dd className="mt-1 font-semibold">15 complete financial years after opening FY</dd></div>
              <div><dt className="text-sm text-[var(--as-text-secondary)]">Interest</dt><dd className="mt-1 font-semibold">Government-notified, variable</dd></div>
            </dl>
          </section>
        )}
        {slug === "sukanya-samriddhi" && (
          <section aria-label="Sukanya Samriddhi at a glance" className="mt-7 rounded-xl border border-[var(--as-border-subtle)] bg-[var(--as-surface-card)] p-5">
            <h2 className="learn-display text-xl">Sukanya Samriddhi at a glance</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              <div><dt className="text-sm text-[var(--as-text-secondary)]">Annual deposit</dt><dd className="mt-1 font-semibold">₹250–₹1,50,000</dd></div>
              <div><dt className="text-sm text-[var(--as-text-secondary)]">Deposit period</dt><dd className="mt-1 font-semibold">15 years from opening</dd></div>
              <div><dt className="text-sm text-[var(--as-text-secondary)]">Normal maturity</dt><dd className="mt-1 font-semibold">21 years from opening</dd></div>
            </dl>
          </section>
        )}
        {slug === "pmay-u-2" && (
          <section aria-label="PMAY-U 2.0 components" className="mt-7">
            <h2 className="learn-display text-xl">Four pathways at a glance</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { name: "BLC", description: "Beneficiary-led construction for eligible households building on their own land, subject to programme rules." },
                { name: "AHP", description: "Affordable housing in partnership through qualifying housing projects." },
                { name: "ARH", description: "Affordable rental housing for eligible urban households." },
                { name: "ISS", description: "Interest subsidy on qualifying home loans, subject to specific loan and household conditions." },
              ].map((component) => (
                <div key={component.name} className="rounded-xl border border-[var(--as-border-subtle)] bg-[var(--as-surface-card)] p-4">
                  <h3 className="font-semibold">{component.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--as-text-secondary)]">{component.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--as-text-secondary)]">These are different programme components, not automatic or cumulative entitlements.</p>
          </section>
        )}
        {guide.sections.map((section) => (
          <section key={section.heading} className={`mt-9 ${section.heading.toLowerCase().includes("example") ? "rounded-xl border border-[var(--as-border-subtle)] bg-[var(--as-surface-card)] p-5 sm:p-6" : "border-b border-[var(--as-border-subtle)] pb-7 last:border-b-0"}`}>
            <h2 className="learn-display text-2xl leading-snug">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 text-base leading-8 text-[var(--as-text-secondary)]">{paragraph}</p>)}
          </section>
        ))}
        <section className="mt-10 border-t border-[var(--as-border-subtle)] pt-6">
          <h2 className="learn-display text-2xl">Official sources</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">{guide.sources.map((source) => <li key={source.url}><a className="text-[var(--as-brand-teal)] underline underline-offset-4" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul>
        </section>
        {guide.related.length > 0 && <section className="mt-8"><h2 className="learn-display text-2xl">Related ArthaSiddhi guides</h2><ul className="mt-3 list-disc space-y-2 pl-5">{guide.related.map((item) => <li key={item.href}><Link className="text-[var(--as-brand-teal)] underline underline-offset-4" href={item.href}>{item.label}</Link></li>)}</ul></section>}
        <p className="mt-8 text-sm leading-6 text-[var(--as-text-secondary)]">ArthaSiddhi is not affiliated with the Government of India. This guide does not assess eligibility, accept applications or guarantee benefits.</p>
      </article>
    </main>
  );
}
