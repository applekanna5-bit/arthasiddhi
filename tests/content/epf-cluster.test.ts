import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calculateEpf, type EpfInput } from "../../lib/calculator/rule-driven-calculators";
import { formatIndianCurrency } from "../../lib/calculator/formatting";
import {
  articles,
  categoryDescriptions,
  getArticle,
  getArticleMaintenanceContext,
  getArticleReferences,
  getPrimaryGuideForCalculator,
  getRelatedArticles,
  getSupportingGuidesForCalculator,
} from "../../lib/content/articles";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import { epfRuleSet } from "../../lib/financial-rules/rule-sets";
import type { Article, ArticleInternalLink, ArticleSection, ArticleSlug } from "../../lib/content/types";

const epfSlugs = ["epf-explained", "epf-contribution-calculation", "epf-calculator-projection-assumptions"] as const satisfies readonly ArticleSlug[];
const engineSource = readFileSync("lib/calculator/rule-driven-calculators.ts", "utf8");
const uiSource = readFileSync("components/calculator/RuleDrivenCalculator.tsx", "utf8");
const defaultInput: EpfInput = { monthlyEpfWage: 15_000, currentEpfBalance: 0, employeeContributionRate: 12, employerContributionRate: 12, annualInterestRate: 8.25, projectionYears: 10, epsEligible: true };

function epfArticle(slug: ArticleSlug) {
  const article = getArticle("retirement", slug);
  expect(article).toBeDefined();
  return article!;
}

function section(article: Article, id: string): ArticleSection {
  const value = article.sections.find((candidate) => candidate.id === id);
  expect(value).toBeDefined();
  return value!;
}

function articleText(article: Article) {
  return JSON.stringify(article).toLowerCase();
}

function links(article: Article): ArticleInternalLink[] {
  return article.sections.flatMap(({ paragraphs, callout }) => [
    ...(paragraphs ?? []),
    ...(callout ? [callout.text] : []),
  ]).flatMap((content) => typeof content === "string" ? [] : content.flatMap(({ link }) => link ? [link] : []));
}

describe("EPF cluster registry, maintenance and discovery", () => {
  it("registers exactly three approved EPF articles in Retirement", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "epf");
    expect(registered.map(({ slug }) => slug)).toEqual(epfSlugs);
    expect(registered.every(({ category }) => category === "retirement")).toBe(true);
  });

  it("keeps EPF Explained as the sole core guide", () => {
    expect(getPrimaryGuideForCalculator("epf")?.slug).toBe("epf-explained");
    expect(epfSlugs.map((slug) => epfArticle(slug).calculatorGuideRole)).toEqual(["core", "supporting", "supporting"]);
    expect(articles.filter(({ primaryCalculator, calculatorGuideRole }) => primaryCalculator === "epf" && calculatorGuideRole === "core")).toHaveLength(1);
  });

  it("uses rule-sensitive contribution pages and evergreen assumptions", () => {
    for (const slug of ["epf-explained", "epf-contribution-calculation"] as const) {
      const article = epfArticle(slug);
      expect(article.maintenance).toEqual({ kind: "rule-sensitive", ruleSetId: epfRuleSet.id });
      expect(getArticleMaintenanceContext(article)).toMatchObject({ applicablePeriod: epfRuleSet.effectivePeriod, verifiedAt: "2026-08-22" });
      expect(getArticleReferences(article)).toHaveLength(6);
      expect(getArticleReferences(article).every(({ sourceType, accessedAt }) => sourceType === "official" && accessedAt === "2026-08-22")).toBe(true);
    }
    expect(epfArticle("epf-calculator-projection-assumptions").maintenance).toEqual({ kind: "evergreen" });
  });

  it("curates both supporting cards without changing NPS discovery", () => {
    expect(getSupportingGuidesForCalculator("epf").map(({ slug }) => slug)).toEqual(["epf-contribution-calculation", "epf-calculator-projection-assumptions"]);
    expect(epfArticle("epf-contribution-calculation").calculatorDiscoveryPriority).toBe(100);
    expect(epfArticle("epf-calculator-projection-assumptions").calculatorDiscoveryPriority).toBe(50);
    expect(getSupportingGuidesForCalculator("nps").map(({ slug }) => slug)).toEqual(["nps-corpus-calculation", "nps-lump-sum-and-annuity"]);
    expect(categoryDescriptions.retirement).toBe("Understand retirement contributions, corpus projections, annuity assumptions and how to interpret calculator estimates.");
  });
});

describe("EPF employer allocation and projection integrity", () => {
  const calculate = (overrides: Partial<EpfInput> = {}) => calculateEpf({ ...defaultInput, ...overrides }, epfRuleSet);

  it.each([
    { monthlyEpfWage: 15_000, employerContributionRate: 0, epsEligible: true },
    { monthlyEpfWage: 15_000, employerContributionRate: 5, epsEligible: true },
    { monthlyEpfWage: 10_000, employerContributionRate: 12, epsEligible: true },
    { monthlyEpfWage: 15_000, employerContributionRate: 12, epsEligible: true },
    { monthlyEpfWage: 30_000, employerContributionRate: 12, epsEligible: true },
    { monthlyEpfWage: 15_000, employerContributionRate: 12, epsEligible: false },
  ])("reconciles employer EPF and EPS for $monthlyEpfWage wage at $employerContributionRate%", (input) => {
    const result = calculate(input);
    expect(result.monthlyEmployerEpf + result.monthlyEmployerEps).toBeCloseTo(result.monthlyEmployerTotal, 10);
    expect(result.monthlyEmployerEps).toBeLessThanOrEqual(result.monthlyEmployerTotal);
    expect(result.monthlyEmployerEpf).toBeGreaterThanOrEqual(0);
  });

  it("eliminates the zero-employer-rate defect", () => {
    expect(calculate({ employerContributionRate: 0, epsEligible: true })).toMatchObject({ monthlyEmployerTotal: 0, monthlyEmployerEps: 0, monthlyEmployerEpf: 0 });
  });

  it("caps a low-rate EPS candidate and preserves standard and disabled behavior", () => {
    const low = calculate({ employerContributionRate: 5 });
    expect(low.monthlyEmployerEps).toBe(low.monthlyEmployerTotal);
    expect(low.monthlyEmployerEpf).toBe(0);
    expect(calculate()).toMatchObject({ monthlyEmployeeEpf: 1_800, monthlyEmployerTotal: 1_800, monthlyEmployerEps: 1_249.5, monthlyEmployerEpf: 550.5 });
    expect(calculate({ epsEligible: false })).toMatchObject({ monthlyEmployerEps: 0, monthlyEmployerEpf: 1_800 });
  });

  it("retains the EPS ceiling below, at and above ₹15,000", () => {
    expect(calculate({ monthlyEpfWage: 10_000 }).monthlyEmployerEps).toBeCloseTo(833, 10);
    expect(calculate({ monthlyEpfWage: 15_000 }).monthlyEmployerEps).toBeCloseTo(1_249.5, 10);
    expect(calculate({ monthlyEpfWage: 30_000 }).monthlyEmployerEps).toBeCloseTo(1_249.5, 10);
  });

  it("reconciles period totals, opening balance, growth and closing balance", () => {
    const result = calculate({ currentEpfBalance: 250_000, projectionYears: 5 });
    expect(result.totalEmployeeEpfContributions).toBe(result.monthlyEmployeeEpf * 60);
    expect(result.totalEmployerEpfContributions).toBe(result.monthlyEmployerEpf * 60);
    expect(result.totalEpsDiversion).toBe(result.monthlyEmployerEps * 60);
    expect(result.openingBalance + result.totalEmployeeEpfContributions + result.totalEmployerEpfContributions + result.estimatedGrowth).toBeCloseTo(result.closingBalance, 8);
  });

  it("renders article examples from calculateEpf results", () => {
    const standard = calculate();
    expect(section(epfArticle("epf-explained"), "worked-example").table?.rows).toEqual([[
      formatIndianCurrency(standard.monthlyEmployeeEpf), formatIndianCurrency(standard.monthlyEmployerEpf), formatIndianCurrency(standard.monthlyEmployerEps), formatIndianCurrency(standard.totalEmployeeEpfContributions), formatIndianCurrency(standard.totalEmployerEpfContributions), formatIndianCurrency(standard.totalEpsDiversion), formatIndianCurrency(standard.estimatedGrowth), formatIndianCurrency(standard.closingBalance),
    ]]);
  });

  it("freezes the approved timing and interest sequence", () => {
    expect(engineSource).toContain("const months = input.projectionYears * 12;");
    expect(engineSource).toContain("const monthlyRate = input.annualInterestRate / 12 / 100;");
    expect(engineSource).toContain("balance = (balance + monthlyEmployeeEpf + monthlyEmployerEpf) * (1 + monthlyRate)");
    expect(engineSource).not.toContain("salaryGrowth");
  });

  it("labels EPS as a projection assumption in the UI", () => {
    expect(uiSource).toContain('label="Include EPS diversion in projection"');
    expect(uiSource).toContain("it does not determine statutory EPS eligibility");
  });
});

describe("EPF relationships and editorial safety", () => {
  it("links the core to the calculator and both supporting articles", () => {
    const core = epfArticle("epf-explained");
    expect(getRelatedArticles(core).map(({ slug }) => slug)).toEqual(epfSlugs.slice(1));
    expect(links(core)).toContainEqual({ kind: "calculator", slug: "epf" });
    for (const slug of epfSlugs.slice(1)) expect(links(core)).toContainEqual({ kind: "article", slug });
  });

  it.each(epfSlugs.slice(1))("keeps %s relationships valid and compact", (slug) => {
    const article = epfArticle(slug);
    expect(links(article)).toContainEqual({ kind: "calculator", slug: "epf" });
    expect(links(article)).toContainEqual({ kind: "article", slug: "epf-explained" });
    expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
    expect(article.relatedArticles).not.toContain(article.slug);
    expect(getRelatedArticles(article)).toHaveLength(article.relatedArticles.length);
  });

  it("states statutory and projection boundaries without unsupported claims", () => {
    const combined = epfSlugs.map((slug) => articleText(epfArticle(slug))).join(" ");
    for (const claim of ["epf is always 12%", "every employer contributes exactly 3.67%", "every employee is eligible for eps", "guaranteed epf balance", "exact epfo passbook forecast.", "the calculator determines withdrawal eligibility", "the calculator calculates tax", "the calculator calculates eps pension"] ) expect(combined).not.toContain(claim);
    expect(combined).toContain("12% is not universal");
    expect(combined).toContain("not a determination that eps does or does not legally apply");
    expect(combined).toContain("not an eps pension quote");
    expect(combined).toContain("does not determine withdrawal eligibility or tax treatment");
  });
});

describe("EPF SEO, schema and sitemap", () => {
  it("provides unique metadata, production canonicals and existing schemas", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const slug of epfSlugs) {
      const article = epfArticle(slug);
      const url = absoluteUrl(getArticlePath(article));
      const metadata = articleMetadata(article);
      expect(url).toBe(`https://arthasiddhi.com/learn/retirement/${slug}`);
      expect(metadata.alternates?.canonical).toBe(url);
      expect(metadata.openGraph).toMatchObject({ type: "article", url, title: article.title });
      expect(articleJsonLd(article)).toMatchObject({ "@type": "Article", headline: article.title, mainEntityOfPage: url });
      expect(breadcrumbJsonLd(article).itemListElement).toHaveLength(4);
      expect(faqJsonLd(article)).toMatchObject({ "@type": "FAQPage" });
      titles.add(article.title);
      descriptions.add(article.description);
    }
    expect(titles.size).toBe(3);
    expect(descriptions.size).toBe(3);
  });

  it("adds exactly three articles to the 78-URL sitemap", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(78);
    expect(new Set(urls).size).toBe(78);
    for (const slug of epfSlugs) expect(urls.filter((url) => url === absoluteUrl(getArticlePath(epfArticle(slug))))).toHaveLength(1);
    expect(urls.filter((url) => url === absoluteUrl("/learn/retirement"))).toHaveLength(1);
  });
});
