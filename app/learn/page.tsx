import type { Metadata } from "next";
import Link from "next/link";
import { categoryDescriptions, categoryLabels, publishedCategories } from "@/lib/content/articles";
import { getFeaturedArticles, learnCategoryHubs } from "@/lib/content/discovery";
import { getArticlePath, pageMetadata } from "@/lib/content/seo";

export const metadata: Metadata = pageMetadata({
  title: "Learn Personal Finance | ArthaSiddhi",
  description: "Practical guides to personal finance, loans, investing, savings, tax and retirement in India.",
  path: "/learn",
});

export default function LearnPage() {
  const featuredArticles = getFeaturedArticles();
  return (
    <main className="flex-1 bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="max-w-3xl py-12">
          <p className="text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">ArthaSiddhi Learn</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Learn the financial concepts behind the numbers</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Explore practical explanations of personal finance, borrowing, investing, savings, tax and retirement, with worked examples and clear calculator assumptions.</p>
        </section>
        <section aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="text-2xl font-bold tracking-tight text-slate-950">Topics</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {publishedCategories.map((category) => <Link key={category} href={`/learn/${category}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100"><h3 className="font-semibold text-slate-950">{categoryLabels[category]}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{categoryDescriptions[category]}</p><p className="mt-3 text-sm leading-6 text-slate-500">{learnCategoryHubs[category].topicPreview.join(" · ")}</p><span className="mt-4 inline-block text-sm font-semibold text-emerald-700">Explore topics <span aria-hidden="true">→</span></span></Link>)}
          </div>
        </section>
        <section aria-labelledby="latest-heading" className="mt-12 pb-12">
          <h2 id="latest-heading" className="text-2xl font-bold tracking-tight text-slate-950">Start with these foundations</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {featuredArticles.map((article) => <Link key={article.slug} href={getArticlePath(article)} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100"><p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">{categoryLabels[article.category]}</p><h3 className="mt-2 text-lg font-semibold text-slate-950">{article.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{article.description}</p><p className="mt-4 text-sm text-slate-500">{article.readingTime}</p></Link>)}
          </div>
        </section>
      </div>
    </main>
  );
}
