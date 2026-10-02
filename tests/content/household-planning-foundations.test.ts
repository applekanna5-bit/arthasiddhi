import { describe, expect, it } from "vitest";
import { articles, getArticle, getArticleBySlug, getArticlesByCategory, getArticleRegistryIssues, getPrimaryGuideForCalculator } from "../../lib/content/articles";
import { calculators } from "../../lib/content/calculators";
import { getDiscoveryRegistryIssues, getLearnCategoryHub } from "../../lib/content/discovery";
import { articleMetadata, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { buildSitemap } from "../../lib/content/sitemap";
import { absoluteUrl } from "../../lib/content/site";
import { getHomeBuyingJourneyLink } from "../../lib/analytics";
import { articleSlugs, type Article } from "../../lib/content/types";

const slugs = ["how-to-build-a-personal-financial-plan", "understand-household-cash-flow", "emergency-fund-planning"] as const;
const titles = ["How to Build a Personal Financial Plan", "Understand Your Household Cash Flow", "Emergency Fund Planning: What Money Should Stay Accessible?"];
const foundation = (index: number) => getArticle("personal-finance", slugs[index])!;
function links(article: Article) {
  return article.sections.flatMap(({ paragraphs, callout }) => [...(paragraphs ?? []), ...(callout ? [callout.text] : [])])
    .flatMap((content) => typeof content === "string" ? [] : content.flatMap(({ link }) => link ? [link] : []));
}

describe("V2.2C household planning foundations", () => {
  it("adds exactly three declared, unique Personal Finance articles and no calculators", () => {
    expect(articles).toHaveLength(70 + 2);
    expect(getArticlesByCategory("personal-finance")).toHaveLength(8 + 2);
    expect(Object.keys(calculators)).toHaveLength(17);
    expect(getArticleRegistryIssues()).toEqual([]);
    expect(getDiscoveryRegistryIssues()).toEqual([]);
    for (const [index, slug] of slugs.entries()) {
      expect(articles.filter((article) => article.slug === slug)).toHaveLength(1);
      expect(articleSlugs.filter((declared) => declared === slug)).toHaveLength(1);
      expect(foundation(index)).toMatchObject({ title: titles[index], category: "personal-finance", maintenance: { kind: "evergreen" }, primaryCalculator: null, calculatorGuideRole: null, relatedCalculators: [] });
      expect(links(foundation(index)).every((link) => link.kind === "article")).toBe(true);
      expect(getLearnCategoryHub("personal-finance").groups.flatMap((group) => [group.coreArticle, ...group.supportingArticles]).filter((entry) => entry === slug)).toHaveLength(1);
    }
  });

  it("provides contextual planning progression and return paths", () => {
    const destinations = slugs.map((_, index) => links(foundation(index)).map(({ slug }) => slug));
    expect(destinations[0]).toEqual([slugs[1], slugs[2], "prioritize-debt-financial-commitments", "risk-return-time-horizon", "how-much-house-can-i-afford", "premature-fd-withdrawal"]);
    expect(destinations[1]).toEqual(["prioritize-debt-financial-commitments", slugs[2], slugs[0], "how-much-house-can-i-afford"]);
    expect(destinations[2]).toEqual([slugs[1], "prioritize-debt-financial-commitments", "emergency-fund-before-home-loan", slugs[0]]);
    expect(foundation(0).relatedArticles).toEqual([slugs[1], slugs[2]]);
    expect(foundation(1).relatedArticles).toEqual([slugs[0], slugs[2]]);
    expect(foundation(2).relatedArticles).toEqual([slugs[1], slugs[0], "emergency-fund-before-home-loan"]);
  });

  it("keeps general emergency liquidity distinct from the untouched Home Buying application", () => {
    const handoff = foundation(2).sections.find(({ id }) => id === "competing-uses")!;
    const text = handoff.paragraphs!.map((content) => typeof content === "string" ? content : content.map(({ text }) => text).join("")).join(" ");
    expect(text).toContain("down payment, borrowing and purchase-related commitments");
    expect(text).toContain("general household emergency liquidity");
    expect(getArticlePath(getArticle("loans", "emergency-fund-before-home-loan")!)).toBe("/learn/loans/emergency-fund-before-home-loan");
    expect(getArticle("loans", "emergency-fund-before-home-loan")?.relatedArticles).toEqual(["home-buying-costs-beyond-property-price", "home-loan-down-payment", "how-much-house-can-i-afford"]);
  });

  it("resolves every body and related article link across the registry", () => {
    for (const article of articles) {
      for (const link of links(article)) {
        if (link.kind === "article") expect(getArticleBySlug(link.slug)).toBeDefined();
        else expect(calculators[link.slug]).toBeDefined();
      }
      for (const slug of article.relatedArticles) expect(getArticleBySlug(slug)).toBeDefined();
    }
  });

  it("has stable canonical routes once each in the expanded sitemap and unique metadata", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(103 + 2);
    expect(new Set(urls).size).toBe(urls.length);
    expect(new Set(articles.map(({ title }) => title)).size).toBe(articles.length);
    expect(new Set(articles.map(({ description }) => description)).size).toBe(articles.length);
    for (const [index, slug] of slugs.entries()) {
      const article = foundation(index);
      const path = `/learn/personal-finance/${slug}`;
      expect(getArticlePath(article)).toBe(path);
      expect(articleMetadata(article)).toMatchObject({ title: titles[index], description: article.description, alternates: { canonical: absoluteUrl(path) } });
      expect(articleMetadata(article).robots).toBeUndefined();
      expect(urls.filter((url) => url === absoluteUrl(path))).toHaveLength(1);
      expect(faqJsonLd(article)).toBeNull();
    }
  });

  it("preserves frozen owners without extending journey events", () => {
    expect(getPrimaryGuideForCalculator("inflation")?.slug).toBe("inflation-explained");
    expect(getArticle("personal-finance", "compound-interest")?.primaryCalculator).toBeNull();
    expect(getArticle("personal-finance", "compound-interest")?.relatedCalculators).toEqual(["sip", "fd"]);
    for (const slug of slugs) {
      for (const link of links(getArticleBySlug(slug)!)) expect(getHomeBuyingJourneyLink(slug, link.slug, "article_body")).toBeUndefined();
    }
  });

  it("states an educational framework without turning variables into recommended ratios", () => {
    for (const slug of slugs) {
      const article = getArticleBySlug(slug)!;
      const text = JSON.stringify(article).toLowerCase();
      expect(text).toContain("arthasiddhi educational planning framework");
      expect(text).toContain("individualized financial advice");
      expect(text).not.toMatch(/50\/30\/20|\d+%|\d+ months|guaranteed outcomes|affordability score/);
      expect(article.references ?? []).toEqual([]);
      expect(new Set(article.sections.map(({ id }) => id)).size).toBe(article.sections.length);
    }
  });
});
