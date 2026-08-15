import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article/ArticleLayout";
import { articles, getArticle } from "@/lib/content/articles";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/content/seo";

type Props = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() { return articles.map((article) => ({ category: article.category, slug: article.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> { const { category, slug } = await params; const article = getArticle(category, slug); return article ? articleMetadata(article) : {}; }

export default async function ArticlePage({ params }: Props) { const { category, slug } = await params; const article = getArticle(category, slug); if (!article) notFound(); const schema = [articleJsonLd(article), breadcrumbJsonLd(article), faqJsonLd(article)].filter(Boolean); return <><ArticleLayout article={article} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></>; }
