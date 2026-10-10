import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--as-border-subtle)] bg-[var(--as-surface-card)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3 sm:gap-4 sm:py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-sm text-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--as-brand-teal)]"
        >
          <BrandLogo />
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
