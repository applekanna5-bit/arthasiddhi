import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { articles, getArticleMaintenanceContext } from "../../lib/content/articles";
import { getDiscoveryRegistryIssues } from "../../lib/content/discovery";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { sitePublisher } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";

const articleLayoutSource = readFileSync("components/article/ArticleLayout.tsx", "utf8");

describe("truthful organization article attribution", () => {
  it("centralizes the approved public identity", () => {
    expect(sitePublisher).toEqual({
      name: "ArthaSiddhi",
      url: "https://arthasiddhi.com/",
      aboutUrl: "https://arthasiddhi.com/about",
    });
  });

  it("attributes all 62 legacy articles to the organization in JSON-LD", () => {
    expect(articles).toHaveLength(62);
    for (const article of articles) {
      const schema = articleJsonLd(article);
      expect(schema.author).toEqual({ "@type": "Organization", name: sitePublisher.name, url: sitePublisher.aboutUrl });
      expect(schema.publisher).toEqual({ "@type": "Organization", name: sitePublisher.name, url: sitePublisher.url });
      expect(schema.author["@type"]).not.toBe("Person");
      expect(schema).not.toHaveProperty("reviewedBy");
      expect(schema).not.toHaveProperty("reviewer");
    }
  });

  it("renders matching, accessible organization attribution near article metadata", () => {
    expect(articleLayoutSource).toContain("Published by");
    expect(articleLayoutSource).toContain('href="/about"');
    expect(articleLayoutSource).toContain("{sitePublisher.name}</Link>");
    expect(articleLayoutSource).toContain('<dt className="sr-only">Author</dt>');
    expect(articleLayoutSource).not.toMatch(/Reviewed by|Expert reviewed|ArthaSiddhi Editorial Team/);
  });

  it("preserves existing Article, Breadcrumb, and FAQ schema behavior", () => {
    const article = articles[0];
    const schema = articleJsonLd(article);
    expect(schema).toMatchObject({
      "@type": "Article",
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      mainEntityOfPage: `https://arthasiddhi.com${getArticlePath(article)}`,
    });
    expect(breadcrumbJsonLd(article).itemListElement).toHaveLength(4);
    expect(faqJsonLd(article)?.["@type"]).toBe("FAQPage");
  });

  it("keeps publication, update, and source-verification semantics separate", () => {
    for (const article of articles) {
      expect(article.updatedAt >= article.publishedAt).toBe(true);
      expect("byline" in article).toBe(false);
      const maintenance = getArticleMaintenanceContext(article);
      if (article.maintenance.kind === "evergreen") expect(maintenance).toBeNull();
      else expect(maintenance?.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("preserves article routes, discovery, and the unique 95-URL sitemap", () => {
    expect(new Set(articles.map(getArticlePath)).size).toBe(62);
    expect(getDiscoveryRegistryIssues()).toEqual([]);
    const sitemapUrls = buildSitemap().map(({ url }) => url);
    expect(sitemapUrls).toHaveLength(95);
    expect(new Set(sitemapUrls).size).toBe(95);
  });
});
