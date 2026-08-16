import { describe, expect, it } from "vitest";
import { articles, getArticle, getRelatedArticles } from "../../lib/content/articles";
import { getRelatedCalculators } from "../../lib/content/calculators";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl, siteUrl } from "../../lib/content/site";

describe("content registry", () => {
  it("finds articles by their category and slug", () => { expect(getArticle("loans", "home-loan-guide")?.title).toBe("Home Loan Guide for Beginners"); expect(getArticle("loans", "missing")).toBeUndefined(); });
  it("maps every related calculator to a real calculator", () => { for (const article of articles) expect(getRelatedCalculators(article.relatedCalculators)).toHaveLength(article.relatedCalculators.length); });
  it("only returns real related articles", () => { const article = getArticle("investments", "sip-explained"); expect(article).toBeDefined(); expect(getRelatedArticles(article!).map((item) => item.slug)).toEqual(["compound-interest", "home-loan-guide"]); });
});

describe("article SEO data", () => {
  const article = articles[0];
  it("builds a clean article path", () => { expect(getArticlePath(article)).toBe("/learn/loans/home-loan-guide"); });
  it("produces serializable matching JSON-LD", () => { const articleSchema = articleJsonLd(article); const breadcrumbSchema = breadcrumbJsonLd(article); const faqSchema = faqJsonLd(article); expect(() => JSON.parse(JSON.stringify([articleSchema, breadcrumbSchema, faqSchema]))).not.toThrow(); expect(articleSchema.headline).toBe(article.title); expect(breadcrumbSchema.itemListElement).toHaveLength(4); expect(faqSchema?.["@type"]).toBe("FAQPage"); });
});

describe("production SEO URLs", () => {
  const productionUrl = "https://arthasiddhi.com";
  const article = articles[0];

  it("uses the canonical production domain", () => {
    expect(siteUrl).toBe(productionUrl);
    expect(absoluteUrl("/")).toBe(`${productionUrl}/`);
  });

  it("builds the production sitemap URL", () => {
    expect(absoluteUrl("/sitemap.xml")).toBe(`${productionUrl}/sitemap.xml`);
  });

  it("uses absolute production URLs in article metadata and structured data", () => {
    const articleUrl = `${productionUrl}${getArticlePath(article)}`;
    const metadata = articleMetadata(article);
    const articleSchema = articleJsonLd(article);
    const breadcrumbSchema = breadcrumbJsonLd(article);

    expect(metadata.alternates?.canonical).toBe(articleUrl);
    expect(metadata.openGraph?.url).toBe(articleUrl);
    expect(articleSchema.mainEntityOfPage).toBe(articleUrl);
    expect(breadcrumbSchema.itemListElement.map(({ item }) => item)).toEqual([
      `${productionUrl}/`,
      `${productionUrl}/learn`,
      `${productionUrl}/learn/${article.category}`,
      articleUrl,
    ]);
  });
});
