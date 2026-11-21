"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchContent } from "@/lib/content/search";

const tabs = [{ value: "all", label: "All" }, { value: "calculator", label: "Calculators" }, { value: "guide", label: "Guides" }] as const;

export function SearchExperience() {
  const params = useSearchParams();
  const query = (params.get("q") ?? "").slice(0, 120).trim();
  const selectedType = params.get("type");
  const type = selectedType === "calculator" || selectedType === "guide" ? selectedType : "all";
  const results = searchContent(query, type);

  return (
    <main className="flex-1 bg-[var(--as-surface-page)] px-4 py-10 text-[var(--as-text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Search ArthaSiddhi</h1>
        <p className="mt-3 text-[var(--as-text-secondary)]">Find a calculator or learn about a money topic.</p>
        <form action="/search" method="get" role="search" className="mt-7 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="site-search" className="sr-only">Search calculators and guides</label>
          <input key={query} id="site-search" name="q" type="search" maxLength={120} defaultValue={query} placeholder="Try EMI, SIP, emergency fund..." className="min-h-12 w-full min-w-0 flex-1 rounded-lg border border-[var(--as-border-subtle)] bg-[var(--as-surface-card)] px-4 text-[var(--as-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--as-brand-teal)]" />
          <button type="submit" className="min-h-12 rounded-lg bg-[var(--as-brand-teal)] px-6 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--as-brand-teal)]">Search</button>
        </form>
        {query ? (
          <>
            <nav aria-label="Filter search results" className="mt-6 flex flex-wrap gap-2">
              {tabs.map((tab) => <Link key={tab.value} href={`/search?q=${encodeURIComponent(query)}&type=${tab.value}`} aria-current={type === tab.value ? "page" : undefined} className={`rounded-full border px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-[var(--as-brand-teal)] ${type === tab.value ? "border-[var(--as-brand-teal)] bg-[var(--as-surface-soft)]" : "border-[var(--as-border-subtle)] bg-[var(--as-surface-card)]"}`}>{tab.label}</Link>)}
            </nav>
            <p role="status" className="mt-6 text-sm text-[var(--as-text-secondary)]">{results.length} {results.length === 1 ? "result" : "results"} for “{query}”</p>
            {results.length ? <ul className="mt-4 grid gap-3 sm:grid-cols-2">{results.map((item) => <li key={item.href}><Link href={item.href} className="block h-full rounded-xl border border-[var(--as-border-subtle)] bg-[var(--as-surface-card)] p-5 hover:border-[var(--as-brand-teal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--as-brand-teal)]"><span className="text-xs font-semibold uppercase tracking-wide text-[var(--as-brand-teal)]">{item.kind === "calculator" ? "Calculator" : "Guide"} · {item.category}</span><h2 className="mt-2 text-lg font-semibold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-[var(--as-text-secondary)]">{item.description}</p></Link></li>)}</ul> : <p className="mt-6">No matching pages found. Try a shorter term such as “loan”, “tax” or “SIP”.</p>}
          </>
        ) : <p className="mt-8 text-[var(--as-text-secondary)]">Enter a topic to search our published calculators and guides.</p>}
      </div>
    </main>
  );
}
