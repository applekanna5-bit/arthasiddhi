import Link from "next/link";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded-sm text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase focus:outline-none focus:ring-3 focus:ring-emerald-100"
        >
          ArthaSiddhi
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
