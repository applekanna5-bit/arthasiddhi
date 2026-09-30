import { describe, expect, it } from "vitest";
import { articles, getArticle, getArticleBySlug, getArticleRegistryIssues } from "../../lib/content/articles";
import { calculators } from "../../lib/content/calculators";
import { getDiscoveryRegistryIssues, learnCategoryHubs } from "../../lib/content/discovery";
import { articleMetadata, breadcrumbJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import { articleSlugs, type ArticleInlineContent } from "../../lib/content/types";

const slug = "how-much-house-can-i-afford";
const article = getArticle("loans", slug)!;
const links = article.sections.flatMap((section) => {
  const content: ArticleInlineContent[] = [...(section.paragraphs ?? []), ...(section.callout ? [section.callout.text] : [])];
  return content.flatMap((item) => typeof item === "string" ? [] : item).flatMap(({ link }) => link ? [link] : []);
});

describe("Home affordability planning article", () => {
  it("publishes one unique Loans article with complete evergreen metadata", () => {
    expect(articles.filter((item) => item.slug === slug)).toHaveLength(1);
    expect(articleSlugs.filter((item) => item === slug)).toHaveLength(1);
    expect(getArticle("banking", slug)).toBeUndefined();
    expect(getArticleRegistryIssues()).toEqual([]);
    expect(article.title).toBe("How Much House Can I Afford?");
    expect(article.description.length).toBeGreaterThan(50);
    expect(article.readingTime).toMatch(/^\d+ min read$/);
    for (const date of [article.publishedAt, article.updatedAt]) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(date))).toBe(false);
    }
    expect(article.maintenance).toEqual({ kind: "evergreen" });
    expect(new Set(article.sections.map(({ id }) => id)).size).toBe(article.sections.length);
  });

  it("uses native discovery, canonical, sitemap and breadcrumbs", () => {
    const path = "/learn/loans/how-much-house-can-i-afford";
    expect(getArticlePath(article)).toBe(path);
    expect(learnCategoryHubs.loans.broaderGuides).toContain(slug);
    expect(getDiscoveryRegistryIssues()).toEqual([]);
    expect(buildSitemap().filter(({ url }) => url === absoluteUrl(path))).toHaveLength(1);
    expect(articleMetadata(article)).toMatchObject({ title: article.title, description: article.description, alternates: { canonical: absoluteUrl(path) } });
    expect(breadcrumbJsonLd(article).itemListElement.map(({ item }) => item)).toEqual([absoluteUrl("/"), absoluteUrl("/learn"), absoluteUrl("/learn/loans"), absoluteUrl(path)]);
  });

  it("keeps the calculator secondary and every destination within the existing journey", () => {
    expect(article.primaryCalculator).toBeNull();
    expect(article.calculatorGuideRole).toBeNull();
    expect(article.relatedCalculators).toEqual(["home-loan"]);
    const owners = ["home-loan-guide", "home-loan-tenure-comparison", "home-loan-emi-calculation", "when-home-loan-emi-starts"];
    expect(article.relatedArticles).toEqual(owners);
    expect(links.filter(({ kind }) => kind === "article").map(({ slug }) => slug)).toEqual(owners);
    expect(links.filter(({ kind }) => kind === "calculator")).toEqual([{ kind: "calculator", slug: "home-loan" }]);
    for (const link of links) {
      if (link.kind === "article") expect(getArticleBySlug(link.slug)).toBeDefined();
      else expect(calculators[link.slug]).toBeDefined();
    }
    // An exhaustive destination allowlist also excludes uncreated V2.1C pages.
    expect(JSON.stringify(article)).not.toMatch(/\/learn\//);
    expect(Object.keys(calculators)).toHaveLength(17);
    expect(Object.keys(calculators)).not.toContain(slug);
    const ids = article.sections.map(({ id }) => id);
    expect(ids.indexOf("test-loan-scenarios")).toBeGreaterThan(ids.indexOf("stress-test"));
  });

  it("protects the planning distinction without prescribing numerical affordability rules", () => {
    const opening = JSON.stringify(article.sections[0]);
    for (const concept of ["Personal affordability", "Lender eligibility", "Mathematical EMI projection"]) expect(opening).toContain(concept);
    const copy = JSON.stringify(article.sections);
    expect(copy).not.toMatch(/\d+(?:\.\d+)?\s*(?:%|percent|times\s+(?:your\s+)?(?:annual\s+)?(?:income|salary))/i);
    expect(copy).not.toMatch(/guaranteed tax benefits|property always appreciates|always choose the shortest|borrow the maximum/i);
    expect(article.references).toEqual([expect.objectContaining({ publisher: "Reserve Bank of India", sourceType: "official", accessedAt: "2026-09-30", url: "https://www.rbi.org.in/commonperson/English/Scripts/FAQs.aspx?Id=701" })]);
  });
});
