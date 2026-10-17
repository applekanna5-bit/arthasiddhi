import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
    <main className="learn-editorial flex-1 bg-[var(--as-surface-page)] px-4 text-[var(--as-text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="max-w-3xl py-9 sm:py-12">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--as-brand-copper)] uppercase">ArthaSiddhi Learn</p>
          <h1 className="learn-display mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">Learn the financial concepts behind the numbers</h1>
          <p className="mt-5 text-lg leading-8 text-[var(--as-text-secondary)]">Explore practical explanations of personal finance, borrowing, investing, savings, tax and retirement, with worked examples and clear calculator assumptions.</p>
        </section>
        <section aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="learn-display text-3xl leading-tight tracking-tight">Topics</h2>
          <div className="learn-topic-grid mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {publishedCategories.map((category) => <Link key={category} href={`/learn/${category}`} className="learn-card learn-topic-card flex min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--as-border-subtle)] bg-[var(--as-surface-card)]">
              <div className="learn-art flex h-44 items-center justify-center bg-[var(--as-surface-page)] sm:h-40 lg:h-44">
                <Image src={`/images/editorial/learn-${category}.webp`} alt="" width={1200} height={800}
                  sizes="(min-width: 1024px) 264px, (min-width: 640px) 240px, 264px"
                  loading="lazy" className="h-full w-auto max-w-full object-contain" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="learn-display text-2xl leading-tight">{categoryLabels[category]}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--as-text-secondary)]">{categoryDescriptions[category]}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--as-text-secondary)]">{learnCategoryHubs[category].topicPreview.join(" · ")}</p>
                <span className="mt-auto pt-5 text-sm font-semibold text-[var(--as-brand-teal)]">Explore topics <span aria-hidden="true">→</span></span>
              </div>
            </Link>)}
          </div>
        </section>
        <section aria-labelledby="latest-heading" className="mt-10 border-t border-[var(--as-border-subtle)] pb-12 pt-8 sm:mt-12 sm:pb-16 sm:pt-10">
          <h2 id="latest-heading" className="learn-display text-3xl leading-tight tracking-tight">Start with these foundations</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {featuredArticles.map((article) => <Link key={article.slug} href={getArticlePath(article)} className="learn-card rounded-xl border border-[var(--as-border-subtle)] bg-[var(--as-surface-card)] p-5"><p className="text-xs font-semibold tracking-wide text-[var(--as-brand-teal)] uppercase">{categoryLabels[article.category]}</p><h3 className="mt-2 text-lg font-semibold text-[var(--as-text-primary)]">{article.title}</h3><p className="mt-2 text-sm leading-6 text-[var(--as-text-secondary)]">{article.description}</p><p className="mt-4 text-sm text-[var(--as-text-secondary)]">{article.readingTime}</p></Link>)}
          </div>
        </section>
      </div>
    </main>
  );
}
