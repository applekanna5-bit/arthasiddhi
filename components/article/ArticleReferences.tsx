import type { ArticleReference } from "@/lib/content/types";

export function ArticleReferences({ references }: { references?: readonly ArticleReference[] }) {
  if (!references?.length) return null;

  return (
    <section aria-labelledby="references-heading" className="border-t border-slate-200 pt-8">
      <h2 id="references-heading" className="text-2xl font-bold tracking-tight text-slate-950">References</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">Authoritative sources used for facts that may change over time.</p>
      <ul className="mt-4 space-y-3">
        {references.map((reference) => (
          <li key={reference.url} className="text-sm leading-6">
            <a
              href={reference.url}
              rel="noopener noreferrer"
              className="font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-4 hover:text-emerald-800 focus:outline-none focus:ring-3 focus:ring-emerald-100"
            >
              {reference.title}
            </a>
            <span className="text-slate-600"> — {reference.publisher}{reference.accessedAt ? ` (accessed ${reference.accessedAt})` : ""}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
