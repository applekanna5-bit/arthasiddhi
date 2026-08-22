import { describe, expect, it } from "vitest";
import { calculateGst, type GstInput } from "../../lib/calculator/rule-driven-calculators";
import { formatIndianCurrency } from "../../lib/calculator/formatting";
import { articles, categoryDescriptions, getArticle, getArticleMaintenanceContext, getPrimaryGuideForCalculator, getRelatedArticles, getSupportingGuidesForCalculator } from "../../lib/content/articles";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import type { Article, ArticleInlineContent, ArticleInternalLink, ArticleSection, ArticleSlug } from "../../lib/content/types";
import { gstRuleSet } from "../../lib/financial-rules/rule-sets";

const gstSlugs = ["gst-explained", "gst-remove-from-inclusive-price", "gst-calculator-vs-invoice"] as const satisfies readonly ArticleSlug[];
const exclusiveInput: GstInput = { mode: "exclusive", transactionType: "intra-state", amount: 1_000, gstRate: 18 };
const inclusiveInput: GstInput = { mode: "inclusive", transactionType: "intra-state", amount: 1_180, gstRate: 18 };
const fivePercentInput: GstInput = { ...exclusiveInput, gstRate: 5 };
const twelvePercentInput: GstInput = { mode: "inclusive", transactionType: "inter-state", amount: 1_120, gstRate: 12 };
const calculate = (input: GstInput) => calculateGst(input, gstRuleSet);

function article(slug: ArticleSlug) { const value = getArticle("tax", slug); expect(value).toBeDefined(); return value!; }
function section(value: Article, id: string): ArticleSection { const found = value.sections.find((candidate) => candidate.id === id); expect(found).toBeDefined(); return found!; }
function text(value: Article) { return JSON.stringify(value).toLowerCase(); }
function links(value: Article): ArticleInternalLink[] {
  const inline = (content: ArticleInlineContent) => typeof content === "string" ? [] : content.flatMap(({ link }) => link ? [link] : []);
  return value.sections.flatMap(({ paragraphs, callout }) => [...(paragraphs ?? []).flatMap(inline), ...(callout ? inline(callout.text) : [])]);
}

describe("GST cluster registry and discovery", () => {
  it("registers exactly three approved Tax articles", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "gst");
    expect(registered.map(({ slug }) => slug)).toEqual(gstSlugs);
    expect(registered.map(({ category }) => category)).toEqual(["tax", "tax", "tax"]);
    expect(registered.map(({ calculatorGuideRole }) => calculatorGuideRole)).toEqual(["core", "supporting", "supporting"]);
    expect(registered.every(({ maintenance }) => maintenance.kind === "evergreen")).toBe(true);
  });

  it("keeps GST Explained as the sole core and curates two supporting cards", () => {
    expect(getPrimaryGuideForCalculator("gst")?.slug).toBe("gst-explained");
    expect(articles.filter(({ primaryCalculator, calculatorGuideRole }) => primaryCalculator === "gst" && calculatorGuideRole === "core")).toHaveLength(1);
    expect(getSupportingGuidesForCalculator("gst").map(({ slug }) => slug)).toEqual(["gst-remove-from-inclusive-price", "gst-calculator-vs-invoice"]);
    expect(article("gst-remove-from-inclusive-price").calculatorDiscoveryPriority).toBe(100);
    expect(article("gst-calculator-vs-invoice").calculatorDiscoveryPriority).toBe(50);
    expect(getSupportingGuidesForCalculator("gst")).toHaveLength(2);
    expect(getSupportingGuidesForCalculator("income-tax").map(({ slug }) => slug)).toEqual(["section-87a-rebate", "gross-income-vs-taxable-income"]);
  });

  it("keeps Tax category wording concise and mixed-purpose", () => {
    expect(categoryDescriptions.tax).toContain("income-tax calculations");
    expect(categoryDescriptions.tax).toContain("GST arithmetic");
  });
});

describe("GST engine-derived numerical integrity", () => {
  it("renders exclusive and inclusive examples from calculateGst", () => {
    const exclusive = calculate(exclusiveInput);
    const inclusive = calculate(inclusiveInput);
    expect(section(article("gst-explained"), "exclusive").table?.rows).toEqual([[formatIndianCurrency(exclusive.taxableValue), formatIndianCurrency(exclusive.totalGst), formatIndianCurrency(exclusive.cgst), formatIndianCurrency(exclusive.sgst), formatIndianCurrency(exclusive.igst), formatIndianCurrency(exclusive.invoiceTotal)]]);
    expect(section(article("gst-remove-from-inclusive-price"), "example").table?.rows).toEqual([[formatIndianCurrency(inclusive.invoiceTotal), formatIndianCurrency(inclusive.taxableValue), formatIndianCurrency(inclusive.totalGst), formatIndianCurrency(inclusive.cgst), formatIndianCurrency(inclusive.sgst), formatIndianCurrency(inclusive.invoiceTotal)]]);
  });

  it("reconciles the required rate examples directly through the engine", () => {
    expect(calculate(exclusiveInput)).toMatchObject({ taxableValue: 1_000, totalGst: 180, cgst: 90, sgst: 90, igst: 0, invoiceTotal: 1_180 });
    expect(calculate(inclusiveInput)).toMatchObject({ taxableValue: 1_000, totalGst: 180, cgst: 90, sgst: 90, igst: 0, invoiceTotal: 1_180 });
    expect(calculate(fivePercentInput)).toMatchObject({ taxableValue: 1_000, totalGst: 50, cgst: 25, sgst: 25, igst: 0, invoiceTotal: 1_050 });
    const twelve = calculate(twelvePercentInput);
    expect(twelve.taxableValue).toBeCloseTo(1_000, 10);
    expect(twelve.totalGst).toBeCloseTo(120, 10);
    expect(twelve).toMatchObject({ cgst: 0, sgst: 0, invoiceTotal: 1_120 });
    expect(twelve.igst).toBeCloseTo(120, 10);
  });

  it("preserves inclusive/exclusive equivalence and custom rates", () => {
    const exclusive = calculate({ ...exclusiveInput, amount: 1_234.56, gstRate: 17.25 });
    const inclusive = calculate({ ...inclusiveInput, amount: exclusive.invoiceTotal, gstRate: 17.25 });
    expect(inclusive.taxableValue).toBeCloseTo(exclusive.taxableValue, 10);
    expect(inclusive.totalGst).toBeCloseTo(exclusive.totalGst, 10);
    expect(calculate({ ...exclusiveInput, gstRate: 0 })).toMatchObject({ totalGst: 0, invoiceTotal: 1_000 });
  });

  it("keeps component allocation tied to the selected transaction assumption", () => {
    expect(calculate(exclusiveInput).cgst + calculate(exclusiveInput).sgst).toBe(calculate(exclusiveInput).totalGst);
    expect(calculate({ ...exclusiveInput, transactionType: "inter-state" })).toMatchObject({ cgst: 0, sgst: 0, igst: 180 });
    expect(text(article("gst-explained"))).toContain("does not determine place of supply");
  });
});

describe("GST editorial boundaries and relationships", () => {
  it("protects reverse-GST wording and compliance exclusions", () => {
    const reverse = text(article("gst-remove-from-inclusive-price"));
    expect(reverse).toContain("not found by subtracting the rate percentage");
    expect(reverse).toContain("does not determine legal place of supply");
    const cluster = gstSlugs.map((slug) => text(article(slug))).join(" ");
    for (const boundary of ["hsn/sac", "reverse charge", "composition", "place of supply", "invoice compliance"]) expect(cluster).toContain(boundary);
    expect(cluster).toContain("not a complete gst rate list");
    expect(cluster).not.toContain("correct gst rate for your product");
    expect(cluster).not.toContain("your invoice is wrong");
  });

  it("implements the approved compact graph without self-links", () => {
    expect(getRelatedArticles(article("gst-explained")).map(({ slug }) => slug)).toEqual(["gst-remove-from-inclusive-price", "gst-calculator-vs-invoice"]);
    for (const slug of gstSlugs) {
      const value = article(slug);
      expect(links(value)).toContainEqual({ kind: "calculator", slug: "gst" });
      expect(new Set(value.relatedArticles).size).toBe(value.relatedArticles.length);
      expect(value.relatedArticles).not.toContain(value.slug);
      expect(getRelatedArticles(value)).toHaveLength(value.relatedArticles.length);
    }
    expect(links(article("gst-remove-from-inclusive-price"))).toContainEqual({ kind: "article", slug: "gst-calculator-vs-invoice" });
    expect(links(article("gst-calculator-vs-invoice"))).toContainEqual({ kind: "article", slug: "gst-remove-from-inclusive-price" });
  });

  it("has canonical, Open Graph and existing schema coverage", () => {
    const titles = new Set(gstSlugs.map((slug) => articleMetadata(article(slug)).title));
    expect(titles).toHaveLength(3);
    for (const slug of gstSlugs) {
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

  it("adds exactly three GST URLs to the unique 93-URL sitemap", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(93);
    expect(new Set(urls).size).toBe(93);
    for (const slug of gstSlugs) expect(urls.filter((url) => url === absoluteUrl(`/learn/tax/${slug}`))).toHaveLength(1);
    expect(urls.filter((url) => url === absoluteUrl("/learn/tax"))).toHaveLength(1);
  });
});
