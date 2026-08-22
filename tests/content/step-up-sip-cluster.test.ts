import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calculateStepUpSip, type StepUpSipInput } from "../../lib/calculator/expanded-calculators";
import { formatIndianCurrency, formatPercentage } from "../../lib/calculator/formatting";
import { articles, getArticle, getArticleMaintenanceContext, getPrimaryGuideForCalculator, getRelatedArticles, getSupportingGuidesForCalculator } from "../../lib/content/articles";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import type { Article, ArticleInlineContent, ArticleInternalLink, ArticleSection, ArticleSlug } from "../../lib/content/types";

const slugs = ["step-up-sip-explained", "step-up-sip-calculation", "step-up-sip-projection-assumptions"] as const satisfies readonly ArticleSlug[];
const baseInput = { startingMonthlyInvestment: 5_000, annualStepUpRate: 10, investmentYears: 10 };
const exampleInput: StepUpSipInput = { ...baseInput, annualReturnRate: 12 };
const calculate = (input: StepUpSipInput) => calculateStepUpSip(input);
const engineSource = readFileSync("lib/calculator/expanded-calculators.ts", "utf8");

function article(slug: ArticleSlug) { const value = getArticle("investments", slug); expect(value).toBeDefined(); return value!; }
function section(value: Article, id: string): ArticleSection { const found = value.sections.find((candidate) => candidate.id === id); expect(found).toBeDefined(); return found!; }
function text(value: Article) { return JSON.stringify(value).toLowerCase(); }
function links(value: Article): ArticleInternalLink[] {
  const inline = (content: ArticleInlineContent): ArticleInternalLink[] => typeof content === "string" ? [] : content.flatMap((item) => Array.isArray(item) ? inline(item) : item.link ? [item.link] : []);
  return value.sections.flatMap(({ paragraphs, callout }) => [...(paragraphs ?? []).flatMap(inline), ...(callout ? inline(callout.text) : [])]);
}

describe("Step-up SIP registry and discovery", () => {
  it("registers exactly three approved evergreen Investments articles", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "step-up-sip");
    expect(registered.map(({ slug }) => slug)).toEqual(slugs);
    expect(registered.map(({ category }) => category)).toEqual(["investments", "investments", "investments"]);
    expect(registered.map(({ calculatorGuideRole }) => calculatorGuideRole)).toEqual(["core", "supporting", "supporting"]);
    expect(registered.every(({ maintenance }) => maintenance.kind === "evergreen")).toBe(true);
  });

  it("curates the core and exactly two supporting cards", () => {
    expect(getPrimaryGuideForCalculator("step-up-sip")?.slug).toBe("step-up-sip-explained");
    expect(getSupportingGuidesForCalculator("step-up-sip").map(({ slug }) => slug)).toEqual(["step-up-sip-calculation", "step-up-sip-projection-assumptions"]);
    expect(article("step-up-sip-calculation").calculatorDiscoveryPriority).toBe(100);
    expect(article("step-up-sip-projection-assumptions").calculatorDiscoveryPriority).toBe(50);
    expect(getSupportingGuidesForCalculator("step-up-sip")).toHaveLength(2);
  });
});

describe("Step-up SIP engine reconciliation and timing", () => {
  it("renders the core example directly from calculateStepUpSip", () => {
    const result = calculate(exampleInput);
    expect(section(article("step-up-sip-explained"), "example").table?.rows).toEqual([[
      formatIndianCurrency(result.totalInvested), formatIndianCurrency(result.estimatedReturns), formatIndianCurrency(result.futureValue), formatIndianCurrency(result.finalMonthlyInvestment),
    ]]);
    expect(section(article("step-up-sip-calculation"), "example").table?.rows).toEqual([[
      formatIndianCurrency(result.totalInvested), formatIndianCurrency(result.estimatedReturns), formatIndianCurrency(result.futureValue), formatIndianCurrency(result.finalMonthlyInvestment),
    ]]);
  });

  it("preserves the first 12-month block and later annual step-ups", () => {
    const firstYear = calculate({ ...baseInput, annualReturnRate: 0, investmentYears: 1 });
    const secondYear = calculate({ ...baseInput, annualReturnRate: 0, investmentYears: 2 });
    expect(firstYear.totalInvested).toBe(5_000 * 12);
    expect(firstYear.finalMonthlyInvestment).toBe(5_000);
    expect(secondYear.totalInvested).toBe(5_000 * 12 + 5_500 * 12);
    expect(secondYear.finalMonthlyInvestment).toBe(5_500);
  });

  it("protects beginning-of-month contribution and month-13 step-up sequence", () => {
    expect(engineSource).toContain("if (month > 0 && month % 12 === 0) monthlyInvestment *= 1 + stepRate;");
    expect(engineSource).toContain("balance = (balance + monthlyInvestment) * (1 + monthlyRate);");
    const oneYear = calculate({ ...baseInput, annualReturnRate: 12, investmentYears: 1 });
    expect(oneYear.futureValue).toBeGreaterThan(oneYear.totalInvested);
  });

  it("reconciles all sensitivity scenarios through the engine", () => {
    const rows = [8, 10, 12].map((annualReturnRate) => {
      const result = calculate({ ...baseInput, annualReturnRate });
      return [formatPercentage(annualReturnRate), formatIndianCurrency(result.totalInvested), formatIndianCurrency(result.estimatedReturns), formatIndianCurrency(result.futureValue)];
    });
    expect(section(article("step-up-sip-projection-assumptions"), "sensitivity").table?.rows).toEqual(rows);
  });
});

describe("Step-up SIP boundaries, relationships and SEO", () => {
  it("protects SIP comparison ownership and avoids duplicate intents", () => {
    const cluster = slugs.map((slug) => text(article(slug))).join(" ");
    expect(cluster).toContain("fixed-sip-vs-step-up-sip");
    expect(cluster).toContain("fixed sip vs step-up sip");
    expect(cluster).not.toContain("universally better");
    expect(cluster).not.toContain("guaranteed return");
    expect(cluster).not.toContain("guaranteed corpus");
    expect(cluster).not.toContain("expected market return");
    expect(cluster).not.toContain("cagr");
    expect(cluster).not.toContain("compound interest formula");
    expect(articles.filter(({ slug }) => slug === "fixed-sip-vs-step-up-sip")).toHaveLength(1);
  });

  it("implements the compact relationship graph", () => {
    for (const slug of slugs) {
      const value = article(slug);
      expect(links(value)).toContainEqual({ kind: "calculator", slug: "step-up-sip" });
      expect(new Set(value.relatedArticles).size).toBe(value.relatedArticles.length);
      expect(value.relatedArticles).not.toContain(value.slug);
      expect(getRelatedArticles(value)).toHaveLength(value.relatedArticles.length);
    }
    expect(getRelatedArticles(article("step-up-sip-explained")).map(({ slug }) => slug)).toEqual(["step-up-sip-calculation", "step-up-sip-projection-assumptions", "fixed-sip-vs-step-up-sip"]);
    expect(links(article("step-up-sip-calculation"))).toContainEqual({ kind: "article", slug: "fixed-sip-vs-step-up-sip" });
    expect(links(article("step-up-sip-projection-assumptions"))).toContainEqual({ kind: "article", slug: "fixed-sip-vs-step-up-sip" });
  });

  it("has unique production metadata, canonical URLs and existing schemas", () => {
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

  it("adds exactly three Step-up SIP URLs to the unique 93-URL sitemap", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(93);
    expect(new Set(urls).size).toBe(93);
    for (const slug of slugs) expect(urls.filter((url) => url === absoluteUrl(`/learn/investments/${slug}`))).toHaveLength(1);
    expect(urls.filter((url) => url === absoluteUrl("/learn/investments"))).toHaveLength(1);
  });
});
