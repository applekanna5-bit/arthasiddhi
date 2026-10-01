import { describe, expect, it } from "vitest";
import { articles, getArticle, getArticleBySlug, getArticleRegistryIssues } from "../../lib/content/articles";
import { calculators } from "../../lib/content/calculators";
import { getDiscoveryRegistryIssues, learnCategoryHubs } from "../../lib/content/discovery";
import { articleMetadata, breadcrumbJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import { articleSlugs, type Article, type ArticleInlineContent } from "../../lib/content/types";

const slugs = ["home-loan-down-payment", "home-buying-costs-beyond-property-price", "emergency-fund-before-home-loan"] as const;
const planning = slugs.map((slug) => getArticle("loans", slug)!);
const affordability = getArticle("loans", "how-much-house-can-i-afford")!;

function links(article: Article) {
  return article.sections.flatMap((section) => {
    const content: ArticleInlineContent[] = [...(section.paragraphs ?? []), ...(section.callout ? [section.callout.text] : [])];
    return content.flatMap((item) => typeof item === "string" ? [] : item).flatMap(({ link }) => link ? [link] : []);
  });
}

describe("Home Buying planning cluster", () => {
  it("registers exactly the three intended additions with unique Loans routes", () => {
    expect(articles).toHaveLength(70);
    expect(planning.map(({ slug }) => slug)).toEqual(slugs);
    expect(getArticleRegistryIssues()).toEqual([]);
    for (const article of planning) {
      expect(articles.filter(({ slug }) => slug === article.slug)).toHaveLength(1);
      expect(articleSlugs.filter((slug) => slug === article.slug)).toHaveLength(1);
      expect(article.category).toBe("loans");
      expect(getArticle("banking", article.slug)).toBeUndefined();
      expect(getArticlePath(article)).toBe(`/learn/loans/${article.slug}`);
    }
    expect(new Set(articles.map(({ slug }) => slug)).size).toBe(articles.length);
  });

  it("uses evergreen metadata, existing canonical helpers and native discovery", () => {
    expect(getDiscoveryRegistryIssues()).toEqual([]);
    expect(buildSitemap()).toHaveLength(103);
    for (const article of planning) {
      const url = absoluteUrl(getArticlePath(article));
      expect(article.maintenance).toEqual({ kind: "evergreen" });
      expect(article.description.length).toBeGreaterThan(50);
      expect(Number.isNaN(Date.parse(article.publishedAt))).toBe(false);
      expect(article.updatedAt >= article.publishedAt).toBe(true);
      expect(articleMetadata(article)).toMatchObject({ title: article.title, description: article.description, alternates: { canonical: url } });
      expect(breadcrumbJsonLd(article).itemListElement.map(({ item }) => item)).toEqual([absoluteUrl("/"), absoluteUrl("/learn"), absoluteUrl("/learn/loans"), url]);
      expect(learnCategoryHubs.loans.broaderGuides?.filter((slug) => slug === article.slug)).toHaveLength(1);
      expect(buildSitemap().filter((entry) => entry.url === url)).toHaveLength(1);
      expect(new Set(article.sections.map(({ id }) => id)).size).toBe(article.sections.length);
    }
  });

  it("links affordability contextually from the relevant existing sections", () => {
    for (const [sectionId, slug] of [
      ["usable-cash", "emergency-fund-before-home-loan"],
      ["costs-beyond-price", "home-buying-costs-beyond-property-price"],
      ["price-contribution-and-borrowing", "home-loan-down-payment"],
    ]) {
      const section = affordability.sections.find(({ id }) => id === sectionId)!;
      expect(links({ ...affordability, sections: [section] })).toContainEqual({ kind: "article", slug });
    }
  });

  it("resolves the planning graph without unpublished destinations", () => {
    for (const article of planning) {
      const expected = [affordability.slug, ...slugs.filter((slug) => slug !== article.slug)].sort();
      expect([...article.relatedArticles].sort()).toEqual(expected);
      const bodyLinks = links(article);
      expect(bodyLinks.filter(({ kind }) => kind === "article").map(({ slug }) => slug).sort()).toEqual(expected);
      for (const link of bodyLinks) {
        if (link.kind === "article") expect(getArticleBySlug(link.slug)).toBeDefined();
        else expect(calculators[link.slug]).toBeDefined();
      }
      // Typed links plus exhaustive destinations exclude future V2.1D/E pages.
      expect(JSON.stringify(article)).not.toMatch(/\/learn\//);
    }
  });

  it("keeps calculators optional and Purchase Costs entirely independent", () => {
    expect(Object.keys(calculators)).toHaveLength(17);
    for (const article of planning) {
      expect(article.primaryCalculator).toBeNull();
      expect(article.calculatorGuideRole).toBeNull();
      expect(calculators).not.toHaveProperty(article.slug);
      const costs = article.slug === "home-buying-costs-beyond-property-price";
      expect(article.relatedCalculators).toEqual(costs ? [] : ["home-loan"]);
      expect(links(article).filter(({ kind }) => kind === "calculator")).toEqual(costs ? [] : [{ kind: "calculator", slug: "home-loan" }]);
    }
  });

  it("avoids numerical prescriptions, state-rate tables and universal lender rules", () => {
    const copy = JSON.stringify(planning.map(({ sections }) => sections));
    expect(copy).not.toMatch(/\d+(?:\.\d+)?\s*(?:%|percent|months?|EMIs?)/i);
    expect(copy).not.toMatch(/(?:six|twelve)\s+(?:months?|EMIs?)|always put|banks finance exactly|maximum down payment possible/i);
    expect(planning[1].sections.some(({ table }) => table)).toBe(false);
    expect(copy).not.toMatch(/guaranteed tax benefits|property always appreciates|approval probability/i);
  });

  it("keeps source scope separate from the household reserve framework", () => {
    for (const article of planning.slice(0, 2)) {
      expect(article.references).toEqual([expect.objectContaining({ publisher: "Reserve Bank of India", sourceType: "official", accessedAt: "2026-09-30", url: "https://www.rbi.org.in/commonperson/English/Scripts/FAQs.aspx?Id=701" })]);
    }
    expect(planning[2].references ?? []).toEqual([]);
  });
});
