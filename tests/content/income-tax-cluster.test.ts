import { describe, expect, it } from "vitest";
import { calculateIncomeTax } from "../../lib/calculator/rule-driven-calculators";
import { incomeTaxRuleSet } from "../../lib/financial-rules/rule-sets";
import { articles, getArticle, getArticleMaintenanceContext, getArticleReferences, getArticlesByCategory, getPrimaryGuideForCalculator, getRelatedArticles, getSupportingGuidesForCalculator } from "../../lib/content/articles";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import type { Article, ArticleInternalLink, ArticleSection, ArticleSlug } from "../../lib/content/types";

const taxSlugs = ["new-tax-regime-slab-calculation", "section-87a-rebate", "health-education-cess-calculation", "gross-income-vs-taxable-income", "income-tax-calculator-vs-payroll-tds"] as const satisfies readonly ArticleSlug[];
const ruleSetId = "income-tax-tax-year-2026-27";
const money = (value: number) => `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value)}`;
const calculate = (income: number) => calculateIncomeTax({ regime: "new", ageCategory: "below-60", taxableOrdinaryIncome: income }, incomeTaxRuleSet);

function taxArticle(slug: ArticleSlug) { const article = getArticle("tax", slug); expect(article).toBeDefined(); return article!; }
function section(article: Article, id: string): ArticleSection { const found = article.sections.find((item) => item.id === id); expect(found).toBeDefined(); return found!; }
function text(article: Article) { return JSON.stringify(article).toLowerCase(); }
function links(article: Article) {
  const found: ArticleInternalLink[] = [];
  for (const item of article.sections) {
    for (const paragraph of item.paragraphs ?? []) if (typeof paragraph !== "string") for (const segment of paragraph) if (segment.link) found.push(segment.link);
    if (item.callout && typeof item.callout.text !== "string") for (const segment of item.callout.text) if (segment.link) found.push(segment.link);
  }
  return found;
}

describe("Income Tax cluster registry and maintenance", () => {
  it("registers exactly five Tax articles with one core and four supporting guides", () => {
    expect(getArticlesByCategory("tax").filter(({ primaryCalculator }) => primaryCalculator === "income-tax").map(({ slug }) => slug)).toEqual(taxSlugs);
    expect(new Set(taxSlugs).size).toBe(5);
    for (const slug of taxSlugs) { const article = taxArticle(slug); expect(article.category).toBe("tax"); expect(article.primaryCalculator).toBe("income-tax"); }
    expect(articles.filter(({ primaryCalculator, calculatorGuideRole }) => primaryCalculator === "income-tax" && calculatorGuideRole === "core")).toHaveLength(1);
    expect(articles.filter(({ primaryCalculator, calculatorGuideRole }) => primaryCalculator === "income-tax" && calculatorGuideRole === "supporting")).toHaveLength(4);
    expect(getPrimaryGuideForCalculator("income-tax")?.slug).toBe("new-tax-regime-slab-calculation");
  });

  it("inherits tax year, verification date and official sources from the current rule set", () => {
    expect(incomeTaxRuleSet.id).toBe(ruleSetId);
    for (const slug of taxSlugs) {
      const article = taxArticle(slug);
      expect(article.maintenance).toEqual({ kind: "rule-sensitive", ruleSetId });
      expect(article.publishedAt).toBe("2026-08-18");
      expect(article.updatedAt).toBe("2026-08-23");
      expect(getArticleMaintenanceContext(article)).toEqual({ applicablePeriod: "Tax Year 2026–27 (FY 2026–27)", periodLabels: [{ label: "Applicable Tax Year", value: "Tax Year 2026–27" }, { label: "Corresponding Financial Year", value: "FY 2026–27" }], verifiedAt: "2026-08-23" });
      const references = getArticleReferences(article);
      expect(references.length).toBeGreaterThan(0);
      expect(references.every(({ sourceType, url }) => sourceType === "official" && new URL(url).protocol === "https:")).toBe(true);
      expect(references.some(({ url }) => ["incometax.gov.in", "incometaxindia.gov.in", "indiabudget.gov.in"].some((domain) => new URL(url).hostname.endsWith(domain)))).toBe(true);
    }
  });
});

describe("Income Tax discovery and relationships", () => {
  it("curates Section 87A and Gross vs Taxable as the two supporting calculator cards", () => {
    expect(getSupportingGuidesForCalculator("income-tax").map(({ slug }) => slug)).toEqual(["section-87a-rebate", "gross-income-vs-taxable-income"]);
    expect(getSupportingGuidesForCalculator("income-tax")).toHaveLength(2);
    expect(getSupportingGuidesForCalculator("income-tax").map(({ slug }) => slug)).not.toContain("health-education-cess-calculation");
    expect(getSupportingGuidesForCalculator("income-tax").map(({ slug }) => slug)).not.toContain("income-tax-calculator-vs-payroll-tds");
    expect(getSupportingGuidesForCalculator("gst").map(({ slug }) => slug)).toEqual(["gst-remove-from-inclusive-price", "gst-calculator-vs-invoice"]);
  });

  it.each([
    ["new-tax-regime-slab-calculation", ["section-87a-rebate", "health-education-cess-calculation", "gross-income-vs-taxable-income", "income-tax-calculator-vs-payroll-tds"]],
    ["section-87a-rebate", ["new-tax-regime-slab-calculation", "health-education-cess-calculation"]],
    ["health-education-cess-calculation", ["new-tax-regime-slab-calculation", "section-87a-rebate"]],
    ["gross-income-vs-taxable-income", ["new-tax-regime-slab-calculation", "income-tax-calculator-vs-payroll-tds"]],
    ["income-tax-calculator-vs-payroll-tds", ["new-tax-regime-slab-calculation", "gross-income-vs-taxable-income"]],
  ] as const)("matches the approved graph for %s", (slug, related) => {
    const article = taxArticle(slug);
    expect(article.relatedArticles).toEqual(related);
    expect(getRelatedArticles(article).map(({ slug: value }) => value)).toEqual(related);
    expect(links(article)).toContainEqual({ kind: "calculator", slug: "income-tax" });
    for (const destination of related) expect(links(article)).toContainEqual({ kind: "article", slug: destination });
    expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
    expect(article.relatedArticles).not.toContain(article.slug);
  });
});

describe("Income Tax numerical integrity", () => {
  it("reconciles the core ₹15 lakh example and slab table with the rule set", () => {
    const result = calculate(1_500_000);
    expect(section(taxArticle("new-tax-regime-slab-calculation"), "worked-example").table?.rows).toEqual([[money(result.taxBeforeRebate), money(result.rebate), money(result.marginalRelief), money(result.taxAfterRelief), money(result.cess), money(result.totalTax)]]);
    expect(section(taxArticle("new-tax-regime-slab-calculation"), "slabs").table?.rows).toEqual([["Up to ₹4,00,000", "Nil"], ["₹4,00,001–₹8,00,000", "5%"], ["₹8,00,001–₹12,00,000", "10%"], ["₹12,00,001–₹16,00,000", "15%"], ["₹16,00,001–₹20,00,000", "20%"], ["₹20,00,001–₹24,00,000", "25%"], ["Above ₹24,00,000", "30%"]]);
    expect(incomeTaxRuleSet.rules.newRegime.slabs).toEqual([{ upTo: 400_000, rate: 0 }, { upTo: 800_000, rate: 5 }, { upTo: 1_200_000, rate: 10 }, { upTo: 1_600_000, rate: 15 }, { upTo: 2_000_000, rate: 20 }, { upTo: 2_400_000, rate: 25 }, { upTo: null, rate: 30 }]);
  });

  it("binds every visible resident-individual rebate boundary row to the corrected engine", () => {
    const results = [1_200_000, 1_200_001, 1_250_000, 1_270_588].map(calculate);
    const rows = results.map((result) => [money(result.taxableIncome), money(result.taxBeforeRebate), money(result.rebate), money(result.marginalRelief), money(result.taxAfterRelief), money(result.cess), money(result.totalTax)]);
    expect(section(taxArticle("section-87a-rebate"), "examples").table?.rows).toEqual(rows);
    expect(results[0]).toMatchObject({ rebate: 60_000, marginalRelief: 0, totalTax: 0 });
    expect(results[1]).toMatchObject({ rebate: 0, taxAfterRelief: 1, totalTax: 1.04 });
    expect(results[1].marginalRelief).toBeCloseTo(59_999.15, 8);
    expect(results[2]).toMatchObject({ marginalRelief: 17_500, taxAfterRelief: 50_000, totalTax: 52_000 });
    expect(results[3].marginalRelief).toBeCloseTo(0.2, 8);
  });

  it("reconciles cess after relief at ₹13 lakh", () => {
    const result = calculate(1_300_000);
    expect(section(taxArticle("health-education-cess-calculation"), "example").table?.rows).toEqual([[money(result.taxBeforeRebate), money(result.rebate), money(result.marginalRelief), money(result.taxAfterRelief), money(result.cess), money(result.totalTax)]]);
    expect(result).toMatchObject({ taxAfterRelief: 75_000, cess: 3_000, totalTax: 78_000 });
  });
});

describe("Income Tax scope, intent and editorial safety", () => {
  it("preserves required scope boundaries", () => {
    const combined = taxSlugs.map((slug) => text(taxArticle(slug))).join(" ");
    for (const phrase of ["ordinary slab-rate", "resident individual", "special-rate income", "surcharge", "payroll tds", "does not derive", "statutory filing and payment rounding"]) expect(combined).toContain(phrase);
    expect(text(taxArticle("income-tax-calculator-vs-payroll-tds"))).toContain("does not simulate payroll");
    expect(text(taxArticle("gross-income-vs-taxable-income"))).toContain("already-determined taxable ordinary income");
  });

  it("keeps five distinct intents and no limitations article", () => {
    expect(taxSlugs).toHaveLength(5);
    expect(taxSlugs.some((slug) => /limitations/.test(slug))).toBe(false);
    expect(taxSlugs.filter((slug) => /section-87a-rebate/.test(slug))).toHaveLength(1);
    expect(taxSlugs.filter((slug) => /slab-calculation/.test(slug))).toHaveLength(1);
  });

  it("rejects unsafe or overstated claims", () => {
    const combined = taxSlugs.map((slug) => text(taxArticle(slug))).join(" ");
    for (const phrase of ["guaranteed tax", "exact tax liability", "everyone earning ₹12 lakh pays zero tax", "calculator replaces filing computation", "calculator equals payroll tds", "individualized tax advice", "100% accurate", "financial journey", "unlock", "empower", "take control", "make informed decisions"]) expect(combined).not.toContain(phrase);
  });
});

describe("Income Tax SEO and sitemap", () => {
  it("uses unique metadata, production canonicals and existing schemas", () => {
    const titles = new Set<string>(); const descriptions = new Set<string>();
    for (const slug of taxSlugs) {
      const article = taxArticle(slug); const url = absoluteUrl(getArticlePath(article)); const metadata = articleMetadata(article);
      expect(url).toMatch(/^https:\/\/arthasiddhi\.com\/learn\/tax\//); expect(metadata.alternates?.canonical).toBe(url);
      expect(articleJsonLd(article)).toMatchObject({ "@type": "Article", mainEntityOfPage: url, headline: article.title, datePublished: "2026-08-18", dateModified: "2026-08-23" }); expect(breadcrumbJsonLd(article).itemListElement).toHaveLength(4); expect(faqJsonLd(article)).toMatchObject({ "@type": "FAQPage" });
      titles.add(article.title); descriptions.add(article.description);
    }
    expect(titles.size).toBe(5); expect(descriptions.size).toBe(5);
  });

  it("publishes the Tax category and five articles in the expanded unique sitemap", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(96); expect(new Set(urls).size).toBe(96); expect(urls).toContain(absoluteUrl("/learn/tax"));
    for (const slug of taxSlugs) expect(urls).toContain(absoluteUrl(getArticlePath(taxArticle(slug))));
  });
});
