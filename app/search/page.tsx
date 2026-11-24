import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/content/seo";
import { SearchExperience } from "@/components/site/SearchExperience";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Search Calculators and Guides | ArthaSiddhi", description: "Find Indian financial calculators and beginner-friendly guides.", path: "/search" }),
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="flex-1 bg-[var(--as-surface-page)] px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-3xl font-semibold">Search ArthaSiddhi</h1><p className="mt-3">Loading search…</p></div></main>}>
      <SearchExperience />
    </Suspense>
  );
}
