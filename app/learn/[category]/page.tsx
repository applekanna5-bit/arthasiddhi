import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryDescriptions, categoryLabels, getArticleBySlug, getArticlesByCategory } from "@/lib/content/articles";
import { getLearnCategoryHub } from "@/lib/content/discovery";
import { pageMetadata } from "@/lib/content/seo";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import type { Article, ArticleSlug, ContentCategory } from "@/lib/content/types";
import { GuideCollection, LearnTopicGroup } from "@/components/learn/LearnTopicGroup";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() { return (Object.keys(categoryLabels) as ContentCategory[]).filter((category) => getArticlesByCategory(category).length > 0).map((category) => ({ category })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!(category in categoryLabels) || !getArticlesByCategory(category).length) return {};
  const label = categoryLabels[category as ContentCategory];
  return pageMetadata({ title: `${label} Guides | ArthaSiddhi`, description: categoryDescriptions[category as ContentCategory], path: `/learn/${category}` });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!(category in categoryLabels)) notFound();
  const contentCategory = category as ContentCategory;
  const articles = getArticlesByCategory(contentCategory);
  if (!articles.length) notFound();
  const hub = getLearnCategoryHub(contentCategory);
  const resolve = (slugs: readonly ArticleSlug[]) => slugs.map((slug) => getArticleBySlug(slug)).filter((article): article is Article => Boolean(article));

  return (
    <main className="learn-editorial flex-1 bg-[var(--as-surface-page)] px-4 py-9 text-[var(--as-text-primary)] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn", href: "/learn" }, { label: categoryLabels[contentCategory] }]} />
        <header className="mt-7 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--as-brand-copper)]">ArthaSiddhi Learn · Explore a topic</p><h1 className="learn-display mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">{categoryLabels[contentCategory]}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--as-text-secondary)]">{categoryDescriptions[contentCategory]}</p></header>
        <div className="mt-10 space-y-12 border-t border-[var(--as-border-subtle)] pt-9 sm:mt-12 sm:pt-11">
          {hub.groups.map((group) => {
            const core = getArticleBySlug(group.coreArticle);
            if (!core) return null;
            return <LearnTopicGroup key={group.id} group={group} core={core} supporting={resolve(group.supportingArticles)} />;
          })}
          {hub.comparisons && <GuideCollection id="comparisons" title="Compare approaches" articles={resolve(hub.comparisons)} />}
          {hub.broaderGuides && <GuideCollection id="foundations" title="Broader foundations" articles={resolve(hub.broaderGuides)} />}
        </div>
      </div>
    </main>
  );
}
