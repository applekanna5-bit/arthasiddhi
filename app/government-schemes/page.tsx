import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/content/seo";
import { plannedSchemeGuides } from "@/lib/government-schemes/schemes";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Government Schemes Explained | ArthaSiddhi",
    description: "Independent educational introductions to Indian savings and housing schemes, with official information links.",
    path: "/government-schemes",
  }),
  robots: { index: false, follow: true },
};

export default function GovernmentSchemesPage() {
  return (
    <main className="learn-editorial flex-1 bg-[var(--as-surface-page)] px-4 py-10 text-[var(--as-text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--as-brand-copper)]">ArthaSiddhi · Financial education</p>
          <h1 className="learn-display mt-4 text-4xl leading-tight sm:text-5xl">Government Schemes, Explained Simply</h1>
          <p className="mt-5 text-lg leading-8 text-[var(--as-text-secondary)]">Explore independent educational information about Indian government schemes. Confirm current rules and benefits with official sources.</p>
        </header>
        <section aria-labelledby="planned-guides" className="mt-10">
          <h2 id="planned-guides" className="learn-display text-2xl">Guides under editorial review</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {plannedSchemeGuides.map((scheme) => (
              <article key={scheme.slug} className="rounded-xl border border-[var(--as-border-subtle)] bg-[var(--as-surface-card)] p-5">
                <h3 className="text-lg font-semibold"><Link href={`/government-schemes/${scheme.slug}`} className="underline-offset-4 hover:underline focus-visible:underline">{scheme.title}</Link></h3>
                <p className="mt-3 text-sm leading-6 text-[var(--as-text-secondary)]">{scheme.summary}</p>
                <p className="mt-3 text-xs text-[var(--as-text-secondary)]">Draft guide — current rules still under review.</p>
                <Link href={`/government-schemes/${scheme.slug}`} className="mt-4 block text-sm font-semibold text-[var(--as-brand-teal)] underline underline-offset-4">Read draft guide</Link>
                <a className="mt-4 inline-block text-sm font-semibold text-[var(--as-brand-teal)] underline underline-offset-4" href={scheme.sources[0].url} target="_blank" rel="noopener noreferrer">Official information</a>
              </article>
            ))}
          </div>
        </section>
        <p className="mt-10 max-w-3xl text-sm leading-6 text-[var(--as-text-secondary)]">ArthaSiddhi is an independent educational website, not a government portal. We do not determine eligibility, process applications or guarantee benefits.</p>
        <Link href="/learn" className="mt-6 inline-block text-sm font-semibold text-[var(--as-brand-teal)] underline underline-offset-4">Explore financial education guides</Link>
      </div>
    </main>
  );
}
