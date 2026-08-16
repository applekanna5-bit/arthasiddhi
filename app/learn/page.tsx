import type { Metadata } from "next";
import Link from "next/link";
import { categoryDescriptions, categoryLabels, getArticlesByCategory, getFeaturedArticles } from "@/lib/content/articles";
import { getArticlePath, pageMetadata } from "@/lib/content/seo";
import type { ContentCategory } from "@/lib/content/types";

export const metadata: Metadata = pageMetadata({
  title: "Learn Personal Finance | ArthaSiddhi",
  description: "Short Indian finance guides on home loans, SIPs, fixed deposits and compound interest.",
  path: "/learn",
});

const allCategories = Object.keys(categoryLabels) as ContentCategory[];

export default function LearnPage() {
  const featuredArticles = getFeaturedArticles();
  return (
    <main className="flex-1 bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="max-w-3xl py-12">
          <p className="text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">ArthaSiddhi Learn</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Financial concepts, explained through the numbers.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Read short guides on home loans, SIPs, fixed deposits and compound interest. Each guide explains the calculation, the terms used and the assumptions that matter.</p>
        </section>
        <section aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="text-2xl font-bold tracking-tight text-slate-950">Topics</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allCategories.map((category) => {
              const categoryArticles = getArticlesByCategory(category);
              const content = <><h3 className="font-semibold text-slate-950">{categoryLabels[category]}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{categoryDescriptions[category]}</p>{categoryArticles.length > 0 ? <span className="mt-4 inline-block text-sm font-semibold text-emerald-700">View guides <span aria-hidden="true">→</span></span> : <span className="mt-4 inline-block text-sm font-medium text-slate-500">Guides not yet available</span>}</>;
              return categoryArticles.length > 0 ? <Link key={category} href={`/learn/${category}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100">{content}</Link> : <div key={category} className="rounded-xl border border-slate-200 bg-white p-5">{content}</div>;
            })}
          </div>
        </section>
        <section aria-labelledby="latest-heading" className="mt-12 pb-12">
          <h2 id="latest-heading" className="text-2xl font-bold tracking-tight text-slate-950">Start with these guides</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {featuredArticles.map((article) => <Link key={article.slug} href={getArticlePath(article)} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100"><p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">{categoryLabels[article.category]}</p><h3 className="mt-2 text-lg font-semibold text-slate-950">{article.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{article.description}</p><p className="mt-4 text-sm text-slate-500">{article.readingTime}</p></Link>)}
          </div>
        </section>
      </div>
    </main>
  );
}
