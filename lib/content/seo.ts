import type { Metadata } from "next";
import { categoryLabels } from "./articles";
import { absoluteUrl, sitePublisher } from "./site";
import type { Article } from "./types";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url, siteName: "ArthaSiddhi" },
    twitter: { card: "summary", title, description },
  };
}

export function getArticlePath(article: Article) {
  return `/learn/${article.category}/${article.slug}`;
}

export function articleMetadata(article: Article): Metadata {
  const url = absoluteUrl(getArticlePath(article));
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: { type: "article", title: article.title, description: article.description, url, siteName: "ArthaSiddhi", publishedTime: article.publishedAt, modifiedTime: article.updatedAt },
    twitter: { card: "summary", title: article.title, description: article.description },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ArthaSiddhi",
    url: absoluteUrl("/"),
    description: "Indian financial calculators and short guides for loans, investments, savings, tax and retirement planning.",
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: { "@type": "Organization", name: sitePublisher.name, url: sitePublisher.aboutUrl },
    publisher: { "@type": "Organization", name: sitePublisher.name, url: sitePublisher.url },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: absoluteUrl(getArticlePath(article)),
  };
}

export function breadcrumbJsonLd(article: Article) {
  const path = getArticlePath(article);
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "Learn", item: absoluteUrl("/learn") }, { "@type": "ListItem", position: 3, name: categoryLabels[article.category], item: absoluteUrl(`/learn/${article.category}`) }, { "@type": "ListItem", position: 4, name: article.title, item: absoluteUrl(path) }] };
}

export function faqJsonLd(article: Article) {
  if (!article.faq?.length) return null;
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.faq.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
}
