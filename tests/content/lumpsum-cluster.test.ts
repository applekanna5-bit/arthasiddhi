import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calculateLumpsum, type LumpsumInput } from "../../lib/calculator/expanded-calculators";
import { formatIndianCurrency } from "../../lib/calculator/formatting";
import { articles, getArticle, getArticleMaintenanceContext, getPrimaryGuideForCalculator, getRelatedArticles, getSupportingGuidesForCalculator } from "../../lib/content/articles";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import type { Article, ArticleInlineContent, ArticleInternalLink, ArticleSlug } from "../../lib/content/types";

const slugs = ["lumpsum-explained", "lumpsum-projection-assumptions"] as const satisfies readonly ArticleSlug[];
const exampleInput: LumpsumInput = { initialInvestment: 100_000, annualReturnRate: 12, investmentYears: 10 };

function article(slug: ArticleSlug) { const value = getArticle("investments", slug); expect(value).toBeDefined(); return value!; }
function text(value: Article) { return JSON.stringify(value).toLowerCase(); }
function links(value: Article): ArticleInternalLink[] {
  const inline = (content: ArticleInlineContent): ArticleInternalLink[] => typeof content === "string" ? [] : content.flatMap((item) => Array.isArray(item) ? inline(item) : item.link ? [item.link] : []);
  return value.sections.flatMap(({ paragraphs, callout }) => [...(paragraphs ?? []).flatMap(inline), ...(callout ? inline(callout.text) : [])]);
}
function tableRows(value: Article, id: string) { const section = value.sections.find((candidate) => candidate.id === id); expect(section).toBeDefined(); expect(section!.table).toBeDefined(); return section!.table!.rows; }

describe("Lumpsum registry and discovery", () => {
  it("registers exactly two evergreen Investments articles", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "lumpsum");
    expect(registered.map(({ slug }) => slug)).toEqual(slugs);
    expect(registered.map(({ category }) => category)).toEqual(["investments", "investments"]);
    expect(registered.map(({ calculatorGuideRole }) => calculatorGuideRole)).toEqual(["core", "supporting"]);
    expect(registered.every(({ maintenance }) => maintenance.kind === "evergreen")).toBe(true);
  });

  it("curates one supporting card without inventing a second article", () => {
    expect(getPrimaryGuideForCalculator("lumpsum")?.slug).toBe("lumpsum-explained");
    expect(getSupportingGuidesForCalculator("lumpsum").map(({ slug }) => slug)).toEqual(["lumpsum-projection-assumptions"]);
    expect(article("lumpsum-projection-assumptions").calculatorDiscoveryPriority).toBe(100);
    expect(getSupportingGuidesForCalculator("lumpsum")).toHaveLength(1);
    expect(articles.filter(({ slug }) => slug === "sip-vs-lumpsum")).toHaveLength(1);
  });
});

describe("Lumpsum engine-derived numerical integrity", () => {
  it("reconciles the approved ₹1 lakh example", () => {
    const result = calculateLumpsum(exampleInput);
    expect(result.investedAmount).toBe(100_000);
    expect(result.estimatedGain).toBeCloseTo(210_584.8208344212, 8);
    expect(result.futureValue).toBeCloseTo(310_584.8208344212, 8);
    expect(tableRows(article("lumpsum-explained"), "example")).toEqual([[formatIndianCurrency(result.investedAmount), formatIndianCurrency(result.estimatedGain), formatIndianCurrency(result.futureValue)]]);
  });

  it("reconciles the additional, zero-return and zero-principal cases", () => {
    const fiveLakh = calculateLumpsum({ initialInvestment: 500_000, annualReturnRate: 8, investmentYears: 5 });
    expect(fiveLakh.investedAmount).toBe(500_000);
    expect(fiveLakh.estimatedGain).toBeCloseTo(234_664.0384, 8);
    expect(fiveLakh.futureValue).toBeCloseTo(734_664.0384, 8);
    expect(calculateLumpsum({ initialInvestment: 100_000, annualReturnRate: 0, investmentYears: 10 })).toEqual({ investedAmount: 100_000, estimatedGain: 0, futureValue: 100_000 });
    expect(calculateLumpsum({ initialInvestment: 0, annualReturnRate: 12, investmentYears: 10 })).toEqual({ investedAmount: 0, estimatedGain: 0, futureValue: 0 });
  });

  it("protects annual compounding and input boundaries", () => {
    const source = readFileSync("lib/calculator/expanded-calculators.ts", "utf8");
    expect(source).toContain("const futureValue = input.initialInvestment * Math.pow(1 + input.annualReturnRate / 100, input.investmentYears);");
    expect(() => calculateLumpsum({ ...exampleInput, annualReturnRate: -1 })).toThrow();
    expect(() => calculateLumpsum({ ...exampleInput, investmentYears: 2.5 })).toThrow(/whole number/);
    expect(() => calculateLumpsum({ ...exampleInput, investmentYears: 0 })).toThrow();
  });
});

describe("Lumpsum relationships, boundaries and SEO", () => {
  it("implements contextual links without duplicate or self relationships", () => {
    for (const slug of slugs) {
      const value = article(slug);
      expect(links(value)).toContainEqual({ kind: "calculator", slug: "lumpsum" });
      expect(new Set(value.relatedArticles).size).toBe(value.relatedArticles.length);
      expect(value.relatedArticles).not.toContain(value.slug);
      expect(getRelatedArticles(value)).toHaveLength(value.relatedArticles.length);
    }
    expect(links(article("lumpsum-explained"))).toContainEqual({ kind: "article", slug: "sip-vs-lumpsum" });
  });

  it("protects CAGR, Compound Interest, SIP and advice boundaries", () => {
    const cluster = slugs.map((slug) => text(article(slug))).join(" ");
    expect(cluster).toContain("illustrative entered annual return");
    expect(cluster).toContain("not a guaranteed");
    expect(cluster).toContain("negative returns");
    expect(cluster).not.toContain("lumpsum vs sip");
    expect(cluster).not.toContain("which is better");
    expect(cluster).not.toContain("expected 12% return");
    expect(cluster).not.toContain("best mutual fund");
    expect(cluster).not.toContain("market timing recommendation");
    expect(cluster).not.toContain("guaranteed future value is");
    expect(cluster).not.toContain("lumpsum calculation article");
  });

  it("has unique production metadata and existing schemas", () => {
    expect(new Set(slugs.map((slug) => articleMetadata(article(slug)).title))).toHaveLength(2);
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

  it("adds exactly two URLs to the unique 95-URL sitemap", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(95);
    expect(new Set(urls).size).toBe(95);
    for (const slug of slugs) expect(urls.filter((url) => url === absoluteUrl(`/learn/investments/${slug}`))).toHaveLength(1);
    expect(urls.filter((url) => url === absoluteUrl("/learn/investments"))).toHaveLength(1);
  });
});
