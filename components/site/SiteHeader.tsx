import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return (
    <header className="site-header border-b border-[var(--as-border-subtle)] bg-[var(--as-surface-card)]">
      <div className="site-header-inner mx-auto flex max-w-6xl flex-col items-start justify-between gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-4 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-sm text-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--as-brand-teal)]"
        >
          <BrandLogo />
        </Link>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
          <SiteNav />
          <Link href="/search" aria-label="Search ArthaSiddhi" className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md border border-[var(--as-border-subtle)] text-[var(--as-text-primary)] hover:bg-[var(--as-surface-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--as-brand-teal)]">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
