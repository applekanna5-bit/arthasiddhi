import Link from "next/link";
import { getArticlePath } from "@/lib/content/seo";
import type { Article } from "@/lib/content/types";

type Calculator = { name: string; href: string; description: string };

export function RelatedCalculators({ calculators }: { calculators: readonly Calculator[] }) {
  if (!calculators.length) return null;
  return <section aria-labelledby="related-calculators-heading"><h2 id="related-calculators-heading" className="text-2xl font-bold tracking-tight text-slate-950">Try a calculator</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{calculators.map((calculator) => <Link key={calculator.href} href={calculator.href} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100"><h3 className="font-semibold text-slate-950">{calculator.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{calculator.description}</p><span className="mt-4 inline-block text-sm font-semibold text-emerald-700">Open calculator <span aria-hidden="true">→</span></span></Link>)}</div></section>;
}

export function RelatedArticles({ articles }: { articles: readonly Article[] }) {
  if (!articles.length) return null;
  return <section aria-labelledby="related-articles-heading"><h2 id="related-articles-heading" className="text-2xl font-bold tracking-tight text-slate-950">Related guides</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{articles.map((article) => <Link key={article.slug} href={getArticlePath(article)} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100"><p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">{article.category.replace("-", " ")}</p><h3 className="mt-2 font-semibold text-slate-950">{article.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{article.description}</p></Link>)}</div></section>;
}
