import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleReferences } from "../../components/article/ArticleReferences";
import { calculateLoanDetails } from "../../lib/engine/loan";
import {
  articles,
  getArticle,
  getArticleReferences,
  getArticlesByCategory,
  getPrimaryGuideForCalculator,
  getSupportingGuidesForCalculator,
} from "../../lib/content/articles";
import { getCalculator } from "../../lib/content/calculators";
import { articleMetadata, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import type { Article, ArticleSlug, ArticleTextSegment } from "../../lib/content/types";

const wholeRupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatWholeRupees(value: number) {
  return wholeRupeeFormatter.format(value);
}

const newSlugs = [
  "home-loan-emi-calculation",
  "home-loan-tenure-comparison",
  "home-loan-prepayment",
] as const satisfies readonly ArticleSlug[];

function newArticles() {
  return newSlugs.map((slug) => getArticle("loans", slug)!);
}

function section(article: Article, id: string) {
  return article.sections.find((candidate) => candidate.id === id)!;
}

describe("Home Loan search cluster", () => {
  it("resolves exactly three new slugs while preserving the four original article paths", () => {
    expect(newArticles().map(({ slug }) => slug)).toEqual(newSlugs);
    expect(articles).toHaveLength(33);
    expect([
      getArticlePath(getArticle("loans", "home-loan-guide")!),
      getArticlePath(getArticle("investments", "sip-explained")!),
      getArticlePath(getArticle("banking", "fixed-deposit-explained")!),
      getArticlePath(getArticle("personal-finance", "compound-interest")!),
    ]).toEqual([
      "/learn/loans/home-loan-guide",
      "/learn/investments/sip-explained",
      "/learn/banking/fixed-deposit-explained",
      "/learn/personal-finance/compound-interest",
    ]);
  });

  it("keeps one Home Loan core guide and three supporting guides in the expanded Loans category", () => {
    const loanArticles = getArticlesByCategory("loans");
    const homeLoanGuides = articles.filter(({ primaryCalculator }) => primaryCalculator === "home-loan");
    expect(loanArticles).toHaveLength(10);
    expect(homeLoanGuides.filter(({ calculatorGuideRole }) => calculatorGuideRole === "core")).toHaveLength(1);
    expect(getPrimaryGuideForCalculator("home-loan")?.slug).toBe("home-loan-guide");
    expect(homeLoanGuides.filter(({ calculatorGuideRole }) => calculatorGuideRole === "supporting")).toHaveLength(3);
    expect(getSupportingGuidesForCalculator("home-loan").map(({ slug }) => slug)).toEqual(["home-loan-emi-calculation", "home-loan-tenure-comparison"]);
  });

  it("keeps supporting relationships valid without self-links or duplicates", () => {
    for (const article of newArticles()) {
      expect(article.primaryCalculator).toBe("home-loan");
      expect(article.calculatorGuideRole).toBe("supporting");
      expect(article.relatedArticles).not.toContain(article.slug);
      expect(new Set(article.relatedArticles).size).toBe(article.relatedArticles.length);
      for (const relatedSlug of article.relatedArticles) expect(articles.some(({ slug }) => slug === relatedSlug)).toBe(true);
    }
  });

  it("publishes .com metadata and sitemap URLs for all three routes", () => {
    const sitemapUrls = new Set(buildSitemap().map(({ url }) => url));
    for (const article of newArticles()) {
      const url = absoluteUrl(getArticlePath(article));
      expect(articleMetadata(article).alternates?.canonical).toBe(url);
      expect(articleMetadata(article).openGraph?.url).toBe(url);
      expect(sitemapUrls.has(url)).toBe(true);
    }
  });

  it("uses official RBI references that render as source links", () => {
    for (const article of newArticles()) {
      const references = getArticleReferences(article);
      expect(references.length).toBeGreaterThan(0);
      expect(references.every(({ publisher, sourceType, url }) => publisher === "Reserve Bank of India" && sourceType === "official" && new URL(url).hostname.endsWith("rbi.org.in"))).toBe(true);
      const html = renderToStaticMarkup(createElement(ArticleReferences, { references }));
      expect(html).toContain("Reserve Bank of India");
      expect(html).toContain(`href="${references[0].url.replaceAll("&", "&amp;")}"`);
    }
  });

  it("resolves every new article callout to the registry-derived Home Loan calculator route", () => {
    for (const article of newArticles()) {
      const segments = article.sections.flatMap(({ callout }) => typeof callout?.text === "string" ? [] : callout?.text ?? []) as readonly ArticleTextSegment[];
      const calculatorLinks = segments.filter((segment) => segment.link?.kind === "calculator");
      expect(calculatorLinks).toHaveLength(1);
      const link = calculatorLinks[0].link;
      expect(link?.kind).toBe("calculator");
      if (link?.kind === "calculator") expect(getCalculator(link.slug).href).toBe("/calculators/home-loan");
    }
  });
});

describe("Home Loan article numeric examples", () => {
  it("reconciles the tenure table and 20-versus-30 comparison with the frozen engine", () => {
    const article = getArticle("loans", "home-loan-tenure-comparison")!;
    const tenures = [15, 20, 25, 30];
    const results = tenures.map((years) => calculateLoanDetails({ principal: 5_000_000, annualInterestRate: 8.5, tenureMonths: years * 12 }));
    const expectedRows = results.map((result, index) => [
      `${tenures[index]} years`,
      formatWholeRupees(result.monthlyEmi),
      `${formatWholeRupees(result.totalInterest)} (₹${(result.totalInterest / 100_000).toFixed(2)} lakh)`,
    ]);
    expect(section(article, "comparison").table?.rows).toEqual(expectedRows);

    const emiDifference = formatWholeRupees(results[1].monthlyEmi - results[3].monthlyEmi);
    const interestDifference = formatWholeRupees(results[3].totalInterest - results[1].totalInterest);
    const comparisonText = section(article, "why-interest-rises").paragraphs?.join(" ") ?? "";
    expect(comparisonText).toContain(`${emiDifference} lower`);
    expect(comparisonText).toContain(`${interestDifference} higher`);
  });

  it("reconciles the EMI and first three amortization rows with the frozen engine", () => {
    const article = getArticle("loans", "home-loan-emi-calculation")!;
    const result = calculateLoanDetails({ principal: 1_000_000, annualInterestRate: 8.5, tenureMonths: 240 });
    const expectedRows = result.amortizationSchedule.slice(0, 3).map((row) => [
      String(row.month),
      formatWholeRupees(row.emi),
      formatWholeRupees(row.interestComponent),
      formatWholeRupees(row.principalComponent),
      formatWholeRupees(row.remainingBalance),
    ]);
    expect(section(article, "worked-example").table?.rows).toEqual(expectedRows);
    expect(section(article, "worked-example").paragraphs?.join(" ")).toContain(`the EMI is ${formatWholeRupees(result.monthlyEmi)}`);
  });
});
