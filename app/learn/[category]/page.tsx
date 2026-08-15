import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categoryDescriptions, categoryLabels, getArticlesByCategory } from "@/lib/content/articles";
import { getArticlePath } from "@/lib/content/seo";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { SiteNav } from "@/components/site/SiteNav";
import type { ContentCategory } from "@/lib/content/types";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() { return (Object.keys(categoryLabels) as ContentCategory[]).filter((category) => getArticlesByCategory(category).length > 0).map((category) => ({ category })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> { const { category } = await params; if (!(category in categoryLabels) || !getArticlesByCategory(category).length) return {}; const label = categoryLabels[category as ContentCategory]; const description = categoryDescriptions[category as ContentCategory]; return { title: `${label} Guides | ArthaSiddhi`, description, alternates: { canonical: `/learn/${category}` }, openGraph: { title: `${label} Guides | ArthaSiddhi`, description, url: `/learn/${category}` }, twitter: { card: "summary", title: `${label} Guides | ArthaSiddhi`, description } }; }

export default async function CategoryPage({ params }: Props) { const { category } = await params; if (!(category in categoryLabels)) notFound(); const contentCategory = category as ContentCategory; const articles = getArticlesByCategory(contentCategory); if (!articles.length) notFound(); return <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8"><div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5"><Link href="/" className="text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">ArthaSiddhi</Link><SiteNav /></header><div className="py-8"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn", href: "/learn" }, { label: categoryLabels[contentCategory] }]} /><h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950">{categoryLabels[contentCategory]}</h1><p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">{categoryDescriptions[contentCategory]}</p><div className="mt-8 grid gap-4 md:grid-cols-2">{articles.map((article) => <Link key={article.slug} href={getArticlePath(article)} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-emerald-100"><h2 className="text-lg font-semibold text-slate-950">{article.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{article.description}</p><p className="mt-4 text-sm text-slate-500">{article.readingTime}</p></Link>)}</div></div></div></main>; }
