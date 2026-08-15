import type { ArticleSection } from "@/lib/content/types";

export function TableOfContents({ sections }: { sections: ArticleSection[] }) {
  if (sections.length < 3) return null;
  return <nav aria-label="Table of contents" className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-semibold text-slate-950">On this page</h2><ol className="mt-3 space-y-2 text-sm">{sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="rounded-sm text-slate-700 hover:text-emerald-700 focus:outline-none focus:ring-3 focus:ring-emerald-100">{section.heading}</a></li>)}</ol></nav>;
}
