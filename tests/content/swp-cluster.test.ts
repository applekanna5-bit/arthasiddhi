import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calculateSwp, type SwpInput } from "../../lib/calculator/expanded-calculators";
import { formatIndianCurrency, formatNumber } from "../../lib/calculator/formatting";
import { articles, getArticle, getArticleMaintenanceContext, getPrimaryGuideForCalculator, getRelatedArticles, getSupportingGuidesForCalculator } from "../../lib/content/articles";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import type { Article, ArticleInlineContent, ArticleInternalLink, ArticleSlug } from "../../lib/content/types";

const slugs = ["swp-explained", "swp-calculation", "swp-corpus-exhaustion"] as const satisfies readonly ArticleSlug[];
const coreInput: SwpInput = { initialInvestment: 1_000_000, monthlyWithdrawal: 10_000, annualReturnRate: 8, withdrawalYears: 10 };
const timingInput: SwpInput = { initialInvestment: 1_000, monthlyWithdrawal: 1_010, annualReturnRate: 12, withdrawalYears: 1 };
const exhaustionInput: SwpInput = { initialInvestment: 10_000, monthlyWithdrawal: 6_000, annualReturnRate: 0, withdrawalYears: 1 };
const endInput: SwpInput = { initialInvestment: 120_000, monthlyWithdrawal: 10_000, annualReturnRate: 0, withdrawalYears: 1 };
const zeroWithdrawalInput: SwpInput = { initialInvestment: 100_000, monthlyWithdrawal: 0, annualReturnRate: 12, withdrawalYears: 1 };

function article(slug: ArticleSlug) { const value = getArticle("investments", slug); expect(value).toBeDefined(); return value!; }
function text(value: Article) { return JSON.stringify(value).toLowerCase(); }
function links(value: Article): ArticleInternalLink[] {
  const inline = (content: ArticleInlineContent): ArticleInternalLink[] => typeof content === "string" ? [] : content.flatMap((item) => Array.isArray(item) ? inline(item) : item.link ? [item.link] : []);
  return value.sections.flatMap(({ paragraphs, callout }) => [...(paragraphs ?? []).flatMap(inline), ...(callout ? inline(callout.text) : [])]);
}
function tableRows(value: Article, id: string) { const section = value.sections.find((candidate) => candidate.id === id); expect(section).toBeDefined(); expect(section!.table).toBeDefined(); return section!.table!.rows; }

describe("SWP registry and discovery", () => {
  it("registers exactly three evergreen Investments articles", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "swp");
    expect(registered.map(({ slug }) => slug)).toEqual(slugs);
    expect(registered.map(({ category }) => category)).toEqual(["investments", "investments", "investments"]);
    expect(registered.map(({ calculatorGuideRole }) => calculatorGuideRole)).toEqual(["core", "supporting", "supporting"]);
    expect(registered.every(({ maintenance }) => maintenance.kind === "evergreen")).toBe(true);
  });

  it("curates the core and two supporting cards", () => {
    expect(getPrimaryGuideForCalculator("swp")?.slug).toBe("swp-explained");
    expect(getSupportingGuidesForCalculator("swp").map(({ slug }) => slug)).toEqual(["swp-calculation", "swp-corpus-exhaustion"]);
    expect(article("swp-calculation").calculatorDiscoveryPriority).toBe(100);
    expect(article("swp-corpus-exhaustion").calculatorDiscoveryPriority).toBe(50);
    expect(getSupportingGuidesForCalculator("swp")).toHaveLength(2);
    expect(getSupportingGuidesForCalculator("sip").map(({ slug }) => slug)).toEqual(["sip-return-calculation", "sip-projection-assumptions"]);
  });
});

describe("SWP engine-derived numerical integrity", () => {
  it("reconciles the approved core example", () => {
    const result = calculateSwp(coreInput);
    expect(result.totalWithdrawn).toBe(1_200_000);
    expect(result.remainingBalance).toBeCloseTo(390_179.88272762543, 8);
    expect(result.withdrawalsCompleted).toBe(120);
    expect(result.exhaustedBeforeTenure).toBe(false);
    expect(tableRows(article("swp-explained"), "example")).toEqual([[formatIndianCurrency(result.totalWithdrawn), formatIndianCurrency(result.remainingBalance), formatNumber(result.withdrawalsCompleted), "No"]]);
  });

  it("protects return-before-withdrawal timing", () => {
    const result = calculateSwp(timingInput);
    expect(result).toEqual({ initialInvestment: 1_000, totalWithdrawn: 1_010, remainingBalance: 0, withdrawalsCompleted: 1, exhaustedBeforeTenure: true });
    expect(tableRows(article("swp-calculation"), "timing-example")).toEqual([[formatIndianCurrency(result.totalWithdrawn), formatIndianCurrency(result.remainingBalance), formatNumber(result.withdrawalsCompleted), "Yes"]]);
  });

  it("protects partial final withdrawal and exhaustion", () => {
    const result = calculateSwp(exhaustionInput);
    expect(result).toEqual({ initialInvestment: 10_000, totalWithdrawn: 10_000, remainingBalance: 0, withdrawalsCompleted: 2, exhaustedBeforeTenure: true });
    expect(tableRows(article("swp-corpus-exhaustion"), "example")).toEqual([[formatIndianCurrency(result.totalWithdrawn), formatIndianCurrency(result.remainingBalance), formatNumber(result.withdrawalsCompleted), "Yes"]]);
    expect(result.remainingBalance).toBeGreaterThanOrEqual(0);
  });

  it("preserves exact-end-of-tenure and zero-withdrawal behavior", () => {
    const end = calculateSwp(endInput);
    expect(end).toEqual({ initialInvestment: 120_000, totalWithdrawn: 120_000, remainingBalance: 0, withdrawalsCompleted: 12, exhaustedBeforeTenure: false });
    const zero = calculateSwp(zeroWithdrawalInput);
    expect(zero.totalWithdrawn).toBe(0);
    expect(zero.withdrawalsCompleted).toBe(0);
    expect(zero.remainingBalance).toBeCloseTo(112_682.503013197, 8);
    expect(zero.exhaustedBeforeTenure).toBe(false);
  });

  it("keeps the approved monthly mechanics and validation boundary", () => {
    const source = readFileSync("lib/calculator/expanded-calculators.ts", "utf8");
    expect(source).toContain("const monthlyRate = input.annualReturnRate / 12 / 100;");
    expect(source).toContain("balance *= 1 + monthlyRate;");
    expect(source).toContain("const withdrawal = Math.min(input.monthlyWithdrawal, balance);");
    expect(source).toContain("for (let month = 0; month < intendedMonths && balance > 0; month += 1)");
    expect(() => calculateSwp({ ...coreInput, annualReturnRate: -1 })).toThrow();
    expect(() => calculateSwp({ ...coreInput, withdrawalYears: 1.5 })).toThrow(/whole number/);
  });
});

describe("SWP relationships, editorial boundaries and SEO", () => {
  it("implements the compact relationship graph", () => {
    for (const slug of slugs) {
      const value = article(slug);
      expect(links(value)).toContainEqual({ kind: "calculator", slug: "swp" });
      expect(new Set(value.relatedArticles).size).toBe(value.relatedArticles.length);
      expect(value.relatedArticles).not.toContain(value.slug);
      expect(getRelatedArticles(value)).toHaveLength(value.relatedArticles.length);
    }
    expect(article("swp-explained").relatedArticles).toEqual(["swp-calculation", "swp-corpus-exhaustion"]);
  });

  it("protects against unsupported advice and cannibalization", () => {
    const cluster = slugs.map((slug) => text(article(slug))).join(" ");
    expect(cluster).toContain("constant");
    expect(cluster).toContain("sequence of returns");
    expect(cluster).toContain("not a safe-withdrawal assessment");
    expect(cluster).not.toContain("safe withdrawal rate is");
    expect(cluster).not.toContain("recommended withdrawal amount is");
    expect(cluster).not.toContain("guaranteed monthly income");
    expect(cluster).not.toContain("retirement-safe income");
    expect(cluster).not.toContain("capital-gains calculation");
    expect(cluster).not.toContain("swp vs sip");
    expect(cluster).not.toContain("swp vs fd");
    expect(cluster).not.toContain("cagr for swp");
    expect(cluster).not.toContain("inflation-adjusted withdrawal");
  });

  it("has unique production metadata and existing schemas", () => {
    expect(new Set(slugs.map((slug) => articleMetadata(article(slug)).title))).toHaveLength(3);
    for (const slug of slugs) {
      const value = article(slug);
      const canonical = absoluteUrl(getArticlePath(value));
      expect(articleMetadata(value).alternates?.canonical).toBe(canonical);
      expect(articleMetadata(value).openGraph?.url).toBe(canonical);
      expect(articleJsonLd(value)["@type"]).toBe("Article");
      expect(breadcrumbJsonLd(value)["@type"]).toBe("BreadcrumbList");
      expect(faqJsonLd(value)?.["@type"]).toBe("FAQPage");
      expect(getArticleMaintenanceContext(value)).toBeNull();
    }
  });

  it("adds exactly three URLs to the unique 91-URL sitemap", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(91);
    expect(new Set(urls).size).toBe(91);
    for (const slug of slugs) expect(urls.filter((url) => url === absoluteUrl(`/learn/investments/${slug}`))).toHaveLength(1);
    expect(urls.filter((url) => url === absoluteUrl("/learn/investments"))).toHaveLength(1);
  });
});
