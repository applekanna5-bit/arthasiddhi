import { describe, expect, it } from "vitest";
import { calculateGratuity, type GratuityInput } from "../../lib/calculator/expanded-calculators";
import { formatIndianCurrency } from "../../lib/calculator/formatting";
import { articles, getArticle, getArticleMaintenanceContext, getArticleReferences, getPrimaryGuideForCalculator, getRelatedArticles, getSupportingGuidesForCalculator } from "../../lib/content/articles";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import type { Article, ArticleInlineContent, ArticleInternalLink, ArticleSection, ArticleSlug } from "../../lib/content/types";
import { gratuityRuleSet } from "../../lib/financial-rules/rule-sets";

const gratuitySlugs = ["gratuity-explained", "gratuity-calculation", "gratuity-calculator-vs-employer-settlement", "gratuity-eligibility"] as const satisfies readonly ArticleSlug[];

function article(slug: ArticleSlug) {
  const value = getArticle("retirement", slug);
  expect(value).toBeDefined();
  return value!;
}

function section(value: Article, id: string): ArticleSection {
  const found = value.sections.find((candidate) => candidate.id === id);
  expect(found).toBeDefined();
  return found!;
}

function links(value: Article): ArticleInternalLink[] {
  const inline = (content: ArticleInlineContent) => typeof content === "string" ? [] : content.flatMap(({ link }) => link ? [link] : []);
  return value.sections.flatMap(({ paragraphs, callout }) => [...(paragraphs ?? []).flatMap(inline), ...(callout ? inline(callout.text) : [])]);
}

function text(value: Article) { return JSON.stringify(value).toLowerCase(); }
const calculate = (input: GratuityInput) => calculateGratuity(input, gratuityRuleSet);

describe("Gratuity registry, maintenance and discovery", () => {
  it("registers exactly four approved Retirement articles", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "gratuity");
    expect(registered.map(({ slug }) => slug)).toEqual(gratuitySlugs);
    expect(registered.every(({ category }) => category === "retirement")).toBe(true);
    expect(registered.map(({ calculatorGuideRole }) => calculatorGuideRole)).toEqual(["core", "supporting", "supporting", "supporting"]);
  });

  it("keeps Gratuity Explained as the sole core guide", () => {
    expect(getPrimaryGuideForCalculator("gratuity")?.slug).toBe("gratuity-explained");
    expect(articles.filter(({ primaryCalculator, calculatorGuideRole }) => primaryCalculator === "gratuity" && calculatorGuideRole === "core")).toHaveLength(1);
  });

  it("uses shared rule metadata for three pages and evergreen settlement guidance", () => {
    for (const slug of ["gratuity-explained", "gratuity-calculation", "gratuity-eligibility"] as const) {
      const value = article(slug);
      expect(value.maintenance).toEqual({ kind: "rule-sensitive", ruleSetId: gratuityRuleSet.id });
      expect(getArticleMaintenanceContext(value)).toMatchObject({ applicablePeriod: gratuityRuleSet.effectivePeriod, verifiedAt: "2026-08-22" });
      expect(getArticleReferences(value)).toHaveLength(5);
      expect(getArticleReferences(value).every(({ sourceType, accessedAt }) => sourceType === "official" && /^2026-08-(22|28)$/.test(accessedAt ?? ""))).toBe(true);
    }
    expect(article("gratuity-calculator-vs-employer-settlement").maintenance).toEqual({ kind: "evergreen" });
  });

  it("curates calculation and settlement while keeping eligibility outside two cards", () => {
    expect(getSupportingGuidesForCalculator("gratuity").map(({ slug }) => slug)).toEqual(["gratuity-calculation", "gratuity-calculator-vs-employer-settlement"]);
    expect(article("gratuity-calculation").calculatorDiscoveryPriority).toBe(100);
    expect(article("gratuity-calculator-vs-employer-settlement").calculatorDiscoveryPriority).toBe(50);
    expect(article("gratuity-eligibility").calculatorDiscoveryPriority).toBeUndefined();
    expect(getSupportingGuidesForCalculator("nps").map(({ slug }) => slug)).toEqual(["nps-corpus-calculation", "nps-lump-sum-and-annuity"]);
    expect(getSupportingGuidesForCalculator("epf").map(({ slug }) => slug)).toEqual(["epf-contribution-calculation", "epf-calculator-projection-assumptions"]);
  });
});

describe("Gratuity numerical and legal integrity", () => {
  it("binds the engine to the maintained 15/26 factors and ceiling", () => {
    expect(gratuityRuleSet.rules).toMatchObject({ ordinaryMonthlyRatedNumerator: 15, ordinaryMonthlyRatedDenominator: 26, additionalMonthsMustExceed: 6, statutoryCeiling: 2_000_000 });
    expect(calculate({ eligibleMonthlyWage: 50_000, completedYears: 10, additionalMonths: 0 })).toMatchObject({ eligibleMonthlyWage: 50_000, serviceYearsCounted: 10, statutoryCeiling: gratuityRuleSet.rules.statutoryCeiling, ceilingApplied: false });
  });

  it("preserves exactly-six and seven-month behavior", () => {
    expect(calculate({ eligibleMonthlyWage: 50_000, completedYears: 10, additionalMonths: 6 }).serviceYearsCounted).toBe(10);
    expect(calculate({ eligibleMonthlyWage: 50_000, completedYears: 10, additionalMonths: 7 }).serviceYearsCounted).toBe(11);
  });

  it("caps the high-value statutory estimate while retaining raw formula gratuity", () => {
    const result = calculate({ eligibleMonthlyWage: 500_000, completedYears: 30, additionalMonths: 0 });
    expect(result.rawFormulaGratuity).toBeGreaterThan(2_000_000);
    expect(result).toMatchObject({ statutoryCeiling: 2_000_000, estimatedGratuity: 2_000_000, ceilingApplied: true });
  });

  it("renders all controlled calculation examples from calculateGratuity", () => {
    const inputs: GratuityInput[] = [
      { eligibleMonthlyWage: 50_000, completedYears: 10, additionalMonths: 0 },
      { eligibleMonthlyWage: 50_000, completedYears: 10, additionalMonths: 6 },
      { eligibleMonthlyWage: 50_000, completedYears: 10, additionalMonths: 7 },
    ];
    expect(section(article("gratuity-calculation"), "rounding").table?.rows).toEqual(inputs.map((input) => {
      const result = calculate(input);
      return [`10 years, ${input.additionalMonths} months`, String(result.serviceYearsCounted), formatIndianCurrency(result.rawFormulaGratuity), formatIndianCurrency(result.estimatedGratuity)];
    }));
    const high = calculate({ eligibleMonthlyWage: 500_000, completedYears: 30, additionalMonths: 0 });
    expect(section(article("gratuity-calculation"), "high-value").table?.rows).toEqual([[formatIndianCurrency(high.rawFormulaGratuity), formatIndianCurrency(high.statutoryCeiling), formatIndianCurrency(high.estimatedGratuity), "Yes"]]);
  });

  it("states eligibility exceptions without treating five years as universal", () => {
    const eligibility = text(article("gratuity-eligibility"));
    expect(eligibility).toContain("general rule, not a universal answer");
    expect(eligibility).toContain("death");
    expect(eligibility).toContain("disablement");
    expect(eligibility).toContain("fixed-term");
    expect(eligibility).toContain("does not determine eligibility");
  });

  it("discloses excluded scope without calculating it", () => {
    const cluster = gratuitySlugs.map((slug) => text(article(slug))).join(" ");
    for (const boundary of ["piece-rated", "seasonal", "forfeiture", "tax"]) expect(cluster).toContain(boundary);
    expect(cluster).toContain("not universally identical to basic salary");
    expect(cluster).toContain("does not calculate tax");
    expect(cluster).not.toContain("guaranteed employer settlement");
    expect(cluster).toContain("not individualized employment-law advice");
  });
});

describe("Gratuity relationships, SEO, schema and sitemap", () => {
  it("implements a compact, valid internal link graph", () => {
    const core = article("gratuity-explained");
    expect(getRelatedArticles(core).map(({ slug }) => slug)).toEqual(gratuitySlugs.slice(1));
    for (const slug of gratuitySlugs) {
      const value = article(slug);
      expect(links(value)).toContainEqual({ kind: "calculator", slug: "gratuity" });
      expect(new Set(value.relatedArticles).size).toBe(value.relatedArticles.length);
      expect(value.relatedArticles).not.toContain(value.slug);
      expect(getRelatedArticles(value)).toHaveLength(value.relatedArticles.length);
    }
    for (const slug of gratuitySlugs.slice(1)) expect(links(article(slug))).toContainEqual({ kind: "article", slug: "gratuity-explained" });
  });

  it("has unique production canonicals, matching Open Graph URLs and existing schemas", () => {
    const metadata = gratuitySlugs.map((slug) => articleMetadata(article(slug)));
    expect(new Set(metadata.map(({ title }) => title))).toHaveLength(4);
    expect(new Set(metadata.map(({ description }) => description))).toHaveLength(4);
    for (const slug of gratuitySlugs) {
      const value = article(slug);
      const canonical = absoluteUrl(getArticlePath(value));
      expect(articleMetadata(value).alternates?.canonical).toBe(canonical);
      expect(articleMetadata(value).openGraph?.url).toBe(canonical);
      expect(articleJsonLd(value)["@type"]).toBe("Article");
      expect(breadcrumbJsonLd(value)["@type"]).toBe("BreadcrumbList");
      expect(faqJsonLd(value)?.["@type"]).toBe("FAQPage");
    }
  });

  it("keeps four article URLs in the unique 96-URL sitemap", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(96);
    expect(new Set(urls).size).toBe(96);
    for (const slug of gratuitySlugs) expect(urls.filter((url) => url === absoluteUrl(`/learn/retirement/${slug}`))).toHaveLength(1);
    expect(urls.filter((url) => url === absoluteUrl("/learn/retirement"))).toHaveLength(1);
  });
});
