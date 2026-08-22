import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calculateNps } from "../../lib/calculator/rule-driven-calculators";
import { formatIndianCurrency, formatPercentage } from "../../lib/calculator/formatting";
import {
  articles,
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
import { npsRuleSet } from "../../lib/financial-rules/rule-sets";
import type { Article, ArticleInternalLink, ArticleSection, ArticleSlug } from "../../lib/content/types";

const npsSlugs = ["nps-explained", "nps-corpus-calculation", "nps-lump-sum-and-annuity", "nps-calculator-assumptions"] as const satisfies readonly ArticleSlug[];
const ruleDrivenSource = readFileSync("components/calculator/RuleDrivenCalculator.tsx", "utf8");
const engineSource = readFileSync("lib/calculator/rule-driven-calculators.ts", "utf8");

function npsArticle(slug: ArticleSlug) {
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

describe("NPS cluster registry, maintenance and discovery", () => {
  it("registers exactly four approved NPS articles in Retirement", () => {
    const registered = articles.filter(({ primaryCalculator }) => primaryCalculator === "nps");
    expect(registered.map(({ slug }) => slug)).toEqual(npsSlugs);
    for (const article of registered) expect(article.category).toBe("retirement");
  });

  it("keeps NPS Explained as the sole core and the other three as supporting", () => {
    expect(getPrimaryGuideForCalculator("nps")?.slug).toBe("nps-explained");
    expect(npsSlugs.map((slug) => npsArticle(slug).calculatorGuideRole)).toEqual(["core", "supporting", "supporting", "supporting"]);
    expect(articles.filter(({ primaryCalculator, calculatorGuideRole }) => primaryCalculator === "nps" && calculatorGuideRole === "core")).toHaveLength(1);
  });

  it("uses the approved mixed maintenance classes with official NPS metadata", () => {
    expect(npsArticle("nps-explained").maintenance).toEqual({ kind: "rule-sensitive", ruleSetId: npsRuleSet.id });
    expect(npsArticle("nps-corpus-calculation").maintenance).toEqual({ kind: "evergreen" });
    expect(npsArticle("nps-lump-sum-and-annuity").maintenance).toEqual({ kind: "rule-sensitive", ruleSetId: npsRuleSet.id });
    expect(npsArticle("nps-calculator-assumptions").maintenance).toEqual({ kind: "evergreen" });
    for (const slug of ["nps-explained", "nps-lump-sum-and-annuity"] as const) {
      const article = npsArticle(slug);
      expect(getArticleMaintenanceContext(article)).toMatchObject({ applicablePeriod: npsRuleSet.effectivePeriod, verifiedAt: "2026-08-22" });
      expect(getArticleReferences(article)).toHaveLength(3);
      expect(getArticleReferences(article).every(({ sourceType, accessedAt }) => sourceType === "official" && accessedAt === "2026-08-22")).toBe(true);
    }
  });

  it("curates corpus and allocation guides while leaving assumptions outside the card limit", () => {
    expect(getSupportingGuidesForCalculator("nps").map(({ slug }) => slug)).toEqual(["nps-corpus-calculation", "nps-lump-sum-and-annuity"]);
    expect(npsArticle("nps-corpus-calculation").calculatorDiscoveryPriority).toBe(100);
    expect(npsArticle("nps-lump-sum-and-annuity").calculatorDiscoveryPriority).toBe(50);
    expect(npsArticle("nps-calculator-assumptions").calculatorDiscoveryPriority).toBeUndefined();
    expect(getSupportingGuidesForCalculator("sip").map(({ slug }) => slug)).toEqual(["sip-return-calculation", "sip-projection-assumptions"]);
    expect(getSupportingGuidesForCalculator("cagr").map(({ slug }) => slug)).toEqual(["cagr-vs-absolute-return", "cagr-and-year-to-year-volatility"]);
  });
});

describe("NPS age integrity and frozen projection mechanics", () => {
  it("synchronizes the official 85 ceiling across rule, engine validation and UI", () => {
    expect(npsRuleSet.rules).toMatchObject({ minimumCurrentAge: 18, maximumRetirementAge: 85 });
    expect(calculateNps({ currentAge: 84, retirementAge: 85, currentCorpus: 0, monthlyContribution: 0, annualReturnRate: 0, annualContributionIncrease: 0, annuityAllocation: 20, assumedAnnuityRate: 0 }, npsRuleSet).yearsUntilRetirement).toBe(1);
    expect(() => calculateNps({ currentAge: 84, retirementAge: 86, currentCorpus: 0, monthlyContribution: 0, annualReturnRate: 0, annualContributionIncrease: 0, annuityAllocation: 20, assumedAnnuityRate: 0 }, npsRuleSet)).toThrow();
    expect(ruleDrivenSource).toContain('id="currentAge" label="Current age" value={values.currentAge} onChange={set("currentAge")} min={18} max={84}');
    expect(ruleDrivenSource).toContain('id="retirementAge" label="Retirement age" value={values.retirementAge} onChange={set("retirementAge")} min={19} max={85}');
  });

  it("retains the approved monthly projection sequence", () => {
    expect(engineSource).toContain("const yearsUntilRetirement = input.retirementAge - input.currentAge;");
    expect(engineSource).toContain("const months = yearsUntilRetirement * 12;");
    expect(engineSource).toContain("const monthlyRate = input.annualReturnRate / 12 / 100;");
    expect(engineSource).toContain("if (month > 0 && month % 12 === 0) contribution *= 1 + stepRate;");
    expect(engineSource).toContain("balance = (balance + contribution) * (1 + monthlyRate);");
    expect(engineSource).toContain("estimatedMonthlyAnnuity: estimatedAnnualAnnuity / 12");
  });
});

describe("NPS numerical integrity", () => {
  const coreInput = { currentAge: 40, retirementAge: 60, currentCorpus: 500_000, monthlyContribution: 10_000, annualReturnRate: 8, annualContributionIncrease: 0, annuityAllocation: 20, assumedAnnuityRate: 6 };
  const coreResult = calculateNps(coreInput, npsRuleSet);

  it("reconciles the core example with calculateNps", () => {
    expect(section(npsArticle("nps-explained"), "worked-example").table?.rows).toEqual([[
      formatIndianCurrency(coreResult.startingCorpus),
      formatIndianCurrency(coreResult.totalContributions),
      formatIndianCurrency(coreResult.estimatedGrowth),
      formatIndianCurrency(coreResult.retirementCorpus),
      formatIndianCurrency(coreResult.lumpSumCorpus),
      formatIndianCurrency(coreResult.annuityCorpus),
      formatIndianCurrency(coreResult.estimatedMonthlyAnnuity),
    ]]);
    expect(coreResult.startingCorpus + coreResult.totalContributions + coreResult.estimatedGrowth).toBeCloseTo(coreResult.retirementCorpus, 8);
  });

  it("reconciles lump sum, annuity corpus, annual annuity and monthly annuity", () => {
    expect(section(npsArticle("nps-lump-sum-and-annuity"), "calculator-arithmetic").table?.rows).toEqual([[
      formatIndianCurrency(coreResult.retirementCorpus),
      formatPercentage(coreResult.annuityAllocation),
      formatIndianCurrency(coreResult.lumpSumCorpus),
      formatIndianCurrency(coreResult.annuityCorpus),
      formatIndianCurrency(coreResult.estimatedAnnualAnnuity),
      formatIndianCurrency(coreResult.estimatedMonthlyAnnuity),
    ]]);
    expect(coreResult.lumpSumCorpus + coreResult.annuityCorpus).toBe(coreResult.retirementCorpus);
    expect(coreResult.estimatedMonthlyAnnuity * 12).toBe(coreResult.estimatedAnnualAnnuity);
  });

  it("verifies beginning-of-month contribution and annual step-up timing", () => {
    const result = calculateNps({ currentAge: 30, retirementAge: 32, currentCorpus: 0, monthlyContribution: 5_000, annualReturnRate: 0, annualContributionIncrease: 10, annuityAllocation: 40, assumedAnnuityRate: 6 }, npsRuleSet);
    expect(result).toMatchObject({ totalContributions: 126_000, retirementCorpus: 126_000, estimatedGrowth: 0, finalMonthlyContribution: 5_500 });
    expect(section(npsArticle("nps-corpus-calculation"), "step-up").table?.rows).toEqual([[
      formatIndianCurrency(5_000), "10%", "24", formatIndianCurrency(result.totalContributions), formatIndianCurrency(result.finalMonthlyContribution), formatIndianCurrency(result.retirementCorpus),
    ]]);
    const oneMonthGrowth = calculateNps({ currentAge: 30, retirementAge: 31, currentCorpus: 0, monthlyContribution: 1_000, annualReturnRate: 12, annualContributionIncrease: 0, annuityAllocation: 40, assumedAnnuityRate: 0 }, npsRuleSet);
    expect(oneMonthGrowth.retirementCorpus).toBeGreaterThan(12_000);
  });
});

describe("NPS relationships and regulatory safety", () => {
  it("links the core to the calculator and every supporting article", () => {
    const core = npsArticle("nps-explained");
    expect(getRelatedArticles(core).map(({ slug }) => slug)).toEqual(npsSlugs.slice(1));
    expect(links(core)).toContainEqual({ kind: "calculator", slug: "nps" });
    for (const slug of npsSlugs.slice(1)) expect(links(core)).toContainEqual({ kind: "article", slug });
  });

  it.each(npsSlugs.slice(1))("keeps %s relationships valid and compact", (slug) => {
    const article = npsArticle(slug);
    const articleLinks = links(article);
    expect(articleLinks).toContainEqual({ kind: "calculator", slug: "nps" });
    expect(articleLinks).toContainEqual({ kind: "article", slug: "nps-explained" });
    expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
    expect(article.relatedArticles).not.toContain(article.slug);
    expect(getRelatedArticles(article)).toHaveLength(article.relatedArticles.length);
  });

  it("rejects universal allocation and eligibility claims", () => {
    const combined = npsSlugs.map((slug) => articleText(npsArticle(slug))).join(" ");
    for (const claim of ["the calculator determines exit eligibility", "the selected allocation is legally required", "one allocation applies to every subscriber", "all exits use the same allocation"] ) expect(combined).not.toContain(claim);
    expect(combined).toContain("projection control; it is not a finding that a subscriber is entitled or required");
    expect(combined).toContain("no single allocation is universal");
    expect(combined).toContain("it is inaccurate to say that every nps subscriber must buy a 40% annuity");
    expect(combined).toContain("it is equally inaccurate to apply a universal 80%/20% split");
  });

  it("excludes guarantees, tax calculations, quotes and current-return claims", () => {
    const combined = npsSlugs.map((slug) => articleText(npsArticle(slug))).join(" ");
    for (const claim of ["guaranteed nps return.", "guaranteed pension.", "this is an asp quote", "this is an insurer quote", "current nps fund return is", "tax saving is ₹", "section 80ccd deduction is"] ) expect(combined).not.toContain(claim);
    expect(combined).toContain("not an insurer quote, asp quote, guaranteed pension or guaranteed payout");
    expect(combined).toContain("taxes are not calculated");
  });
});

describe("NPS SEO, schema and sitemap", () => {
  it("provides unique metadata, production canonicals and existing schemas", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const slug of npsSlugs) {
      const article = npsArticle(slug);
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
    expect(titles.size).toBe(4);
    expect(descriptions.size).toBe(4);
  });

  it("keeps four NPS articles and one Retirement route in the 93-URL sitemap", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(93);
    expect(new Set(urls).size).toBe(93);
    for (const slug of npsSlugs) expect(urls.filter((url) => url === absoluteUrl(getArticlePath(npsArticle(slug))))).toHaveLength(1);
    expect(urls.filter((url) => url === absoluteUrl("/learn/retirement"))).toHaveLength(1);
  });
});
