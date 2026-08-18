import { describe, expect, it } from "vitest";
import * as articleBoundary from "../../lib/content/articles";
import * as articleIndex from "../../lib/content/articles/index";
import { articles, getArticle, getArticleMaintenanceContext, getArticleReferences, getArticleRegistryIssues, getPrimaryGuideForCalculator, getRelatedArticles, getSupportingGuidesForCalculator } from "../../lib/content/articles";
import { getRelatedCalculators } from "../../lib/content/calculators";
import { contentCategories, type Article, type ArticleSlug } from "../../lib/content/types";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl, siteUrl } from "../../lib/content/site";

describe("content registry", () => {
  it("finds articles by their category and slug", () => { expect(getArticle("loans", "home-loan-guide")?.title).toBe("Home Loan Guide for Beginners"); expect(getArticle("loans", "missing")).toBeUndefined(); });
  it("maps every related calculator to a real calculator", () => { for (const article of articles) expect(getRelatedCalculators(article.relatedCalculators)).toHaveLength(article.relatedCalculators.length); });
  it("passes all relationship and maintenance registry checks", () => { expect(getArticleRegistryIssues()).toEqual([]); });
  it("has unique article slugs and public paths", () => {
    expect(new Set(articles.map(({ slug }) => slug)).size).toBe(articles.length);
    expect(new Set(articles.map(getArticlePath)).size).toBe(articles.length);
  });
  it("uses only declared categories", () => {
    for (const article of articles) expect(contentCategories).toContain(article.category);
  });
  it("has valid, non-duplicated calculator relationships", () => {
    for (const article of articles) {
      const relations = article.primaryCalculator ? [article.primaryCalculator, ...article.relatedCalculators] : article.relatedCalculators;
      expect(new Set(relations).size).toBe(relations.length);
      expect(getRelatedCalculators(article.relatedCalculators)).toHaveLength(article.relatedCalculators.length);
    }
  });
  it("has valid, non-duplicated article relationships without self-links", () => {
    for (const article of articles) {
      expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
      expect(article.relatedArticles).not.toContain(article.slug);
      expect(getRelatedArticles(article)).toHaveLength(article.relatedArticles.length);
    }
  });
  it("only returns real related articles", () => { const article = getArticle("investments", "sip-explained"); expect(article).toBeDefined(); expect(getRelatedArticles(article!).map((item) => item.slug)).toEqual(["sip-return-calculation", "sip-vs-lumpsum", "fixed-sip-vs-step-up-sip", "sip-projection-assumptions", "compound-interest"]); });
  it("resolves calculator guides in both directions", () => {
    expect(getPrimaryGuideForCalculator("home-loan")?.slug).toBe("home-loan-guide");
    expect(getPrimaryGuideForCalculator("sip")?.slug).toBe("sip-explained");
    expect(getPrimaryGuideForCalculator("fd")?.slug).toBe("fixed-deposit-explained");
    expect(getSupportingGuidesForCalculator("home-loan").map(({ slug }) => slug)).toEqual(["home-loan-emi-calculation", "home-loan-tenure-comparison"]);
  });
  it("rejects two core guides for the same calculator", () => {
    const first = { ...articles[0], primaryCalculator: "home-loan", calculatorGuideRole: "core", relatedCalculators: [], relatedArticles: [] } as Article;
    const second = { ...articles[1], primaryCalculator: "home-loan", calculatorGuideRole: "core", relatedCalculators: [], relatedArticles: [] } as Article;
    expect(getArticleRegistryIssues([first, second], [first.slug, second.slug])).toContain("Multiple core guides for calculator: home-loan");
  });
  it("rejects an unresolved featured article", () => {
    const unresolvedSlug = "missing-article" as ArticleSlug;
    expect(getArticleRegistryIssues(articles, [...articleIndex.featuredArticleSlugs, unresolvedSlug])).toContain("Featured article slug does not resolve: missing-article");
  });
  it("rejects a duplicate featured article", () => {
    const duplicate = articleIndex.featuredArticleSlugs[0];
    expect(getArticleRegistryIssues(articles, [...articleIndex.featuredArticleSlugs, duplicate])).toContain("Duplicate featured article slug");
  });
  it("rejects missing rule-sensitive maintenance and official sources", () => {
    const candidate = { ...articles[0], primaryCalculator: null, calculatorGuideRole: null, relatedCalculators: [], relatedArticles: [], maintenance: { kind: "rule-sensitive", verifiedAt: "", applicablePeriod: "" }, references: [] } as Article;
    const issues = getArticleRegistryIssues([candidate], [candidate.slug]);
    expect(issues).toContain(`Missing maintenance metadata for ${candidate.slug}`);
    expect(issues).toContain(`Rule-sensitive article lacks an official source: ${candidate.slug}`);
  });
  it("derives rule-sensitive dates and official references from a known rule set", () => {
    const candidate = { ...articles[0], primaryCalculator: null, calculatorGuideRole: null, relatedCalculators: [], relatedArticles: [], maintenance: { kind: "rule-sensitive", ruleSetId: "income-tax-ty-2026-27" }, references: [] } as Article;
    expect(getArticleMaintenanceContext(candidate)).toEqual({ applicablePeriod: "Tax Year 2026–27", verifiedAt: "2026-08-16" });
    expect(getArticleReferences(candidate).every((reference) => reference.sourceType === "official")).toBe(true);
    expect(getArticleRegistryIssues([candidate], [candidate.slug])).toEqual([]);
  });
  it("accepts explicit maintenance and an official source without a rule set", () => {
    const candidate = { ...articles[0], primaryCalculator: null, calculatorGuideRole: null, relatedCalculators: [], relatedArticles: [], maintenance: { kind: "rule-sensitive", verifiedAt: "2026-08-16", applicablePeriod: "Rate verified for July–September 2026" }, references: [{ title: "PPF rate notification", publisher: "Ministry of Finance", url: "https://dea.gov.in/", sourceType: "official" }] } as Article;
    expect(getArticleRegistryIssues([candidate], [candidate.slug])).toEqual([]);
    expect(getArticleMaintenanceContext(candidate)).toEqual({ applicablePeriod: "Rate verified for July–September 2026", verifiedAt: "2026-08-16" });
    expect(getArticleReferences(candidate)).toEqual(candidate.references);
  });
  it("rejects an unknown rule set", () => {
    const candidate = { ...articles[0], primaryCalculator: null, calculatorGuideRole: null, relatedCalculators: [], relatedArticles: [], maintenance: { kind: "rule-sensitive", ruleSetId: "missing-rule-set" }, references: [] } as Article;
    expect(getArticleRegistryIssues([candidate], [candidate.slug])).toContain(`Unknown rule set for ${candidate.slug}: missing-rule-set`);
  });
});

describe("article compatibility boundary", () => {
  it("re-exports the authoritative collection and helpers by identity", () => {
    expect(articleBoundary.articles).toBe(articleIndex.articles);
    expect(articleBoundary.getArticle).toBe(articleIndex.getArticle);
    expect(articleBoundary.getPrimaryGuideForCalculator).toBe(articleIndex.getPrimaryGuideForCalculator);
  });
});

describe("article SEO data", () => {
  const article = articles[0];
  it("builds a clean article path", () => { expect(getArticlePath(article)).toBe("/learn/loans/home-loan-guide"); });
  it("produces serializable matching JSON-LD", () => { const articleSchema = articleJsonLd(article); const breadcrumbSchema = breadcrumbJsonLd(article); const faqSchema = faqJsonLd(article); expect(() => JSON.parse(JSON.stringify([articleSchema, breadcrumbSchema, faqSchema]))).not.toThrow(); expect(articleSchema.headline).toBe(article.title); expect(articleSchema).not.toHaveProperty("author"); expect(articleSchema).not.toHaveProperty("publisher"); expect(breadcrumbSchema.itemListElement).toHaveLength(4); expect(faqSchema?.["@type"]).toBe("FAQPage"); });
  it("keeps metadata dates aligned with article data", () => { const metadata = articleMetadata(article); expect(metadata.openGraph).toMatchObject({ publishedTime: article.publishedAt, modifiedTime: article.updatedAt }); });
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
