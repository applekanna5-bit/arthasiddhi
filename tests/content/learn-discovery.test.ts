import { describe, expect, it } from "vitest";
import {
  articles,
  featuredArticleSlugs,
  getArticleRegistryIssues,
  getArticlesByCategory,
  getFeaturedArticles,
  publishedCategories,
} from "../../lib/content/articles";
import { getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";

describe("Batch C Learn discovery", () => {
  const expectedCategories = ["personal-finance", "loans", "investments", "banking", "tax", "retirement"];

  it("shows only categories containing published articles", () => {
    expect(publishedCategories).toEqual(expectedCategories);
    expect(publishedCategories.every((category) => getArticlesByCategory(category).length > 0)).toBe(true);
  });

  it("exposes populated Tax and Retirement in primary discovery", () => {
    expect(publishedCategories).toContain("tax");
    expect(publishedCategories).toContain("retirement");
  });

  it("keeps every populated category discoverable", () => {
    for (const category of expectedCategories) {
      expect(publishedCategories).toContain(category);
      expect(getArticlesByCategory(category).length).toBeGreaterThan(0);
    }
  });

  it("keeps featured-guide curation explicit and unchanged", () => {
    expect(featuredArticleSlugs).toEqual([
      "home-loan-guide",
      "sip-explained",
      "fixed-deposit-explained",
      "compound-interest",
    ]);
    expect(getFeaturedArticles().map(({ slug }) => slug)).toEqual(featuredArticleSlugs);
  });

  it("includes populated Tax and Retirement in the sitemap", () => {
    const sitemapUrls = new Set(buildSitemap().map(({ url }) => url));
    expect(sitemapUrls.has(absoluteUrl("/learn/tax"))).toBe(true);
    expect(sitemapUrls.has(absoluteUrl("/learn/retirement"))).toBe(true);
  });

  it("keeps article relationships valid and public URLs unchanged", () => {
    expect(getArticleRegistryIssues()).toEqual([]);
    expect(articles.map(getArticlePath)).toEqual([
      "/learn/loans/home-loan-guide",
      "/learn/loans/home-loan-emi-calculation",
      "/learn/loans/home-loan-tenure-comparison",
      "/learn/loans/home-loan-prepayment",
      "/learn/loans/personal-loan-emi-explained",
      "/learn/loans/personal-loan-tenure-comparison",
      "/learn/loans/personal-loan-calculator-vs-lender-quote",
      "/learn/loans/car-loan-cost-guide",
      "/learn/loans/car-loan-down-payment-and-loan-amount",
      "/learn/loans/car-loan-on-road-price-vs-loan-amount",
      "/learn/investments/sip-explained",
      "/learn/investments/sip-return-calculation",
      "/learn/investments/sip-vs-lumpsum",
      "/learn/investments/fixed-sip-vs-step-up-sip",
      "/learn/investments/sip-projection-assumptions",
      "/learn/investments/cagr-explained",
      "/learn/investments/cagr-vs-absolute-return",
      "/learn/investments/cagr-and-year-to-year-volatility",
      "/learn/investments/cagr-vs-average-annual-return",
      "/learn/banking/fixed-deposit-explained",
      "/learn/banking/fd-interest-calculation",
      "/learn/banking/fd-vs-rd",
      "/learn/banking/premature-fd-withdrawal",
      "/learn/banking/ppf-explained",
      "/learn/banking/ppf-interest-calculation",
      "/learn/banking/ppf-tenure-extension",
      "/learn/banking/ppf-calculator-projection-vs-actual-maturity",
      "/learn/banking/rd-explained",
      "/learn/banking/rd-interest-calculation",
      "/learn/banking/rd-calculator-projection-vs-actual-maturity",
      "/learn/personal-finance/compound-interest",
      "/learn/personal-finance/inflation-explained",
      "/learn/personal-finance/inflation-future-cost",
      "/learn/personal-finance/purchasing-power-explained",
      "/learn/personal-finance/inflation-calculator-projection-assumptions",
      "/learn/tax/new-tax-regime-slab-calculation",
      "/learn/tax/section-87a-rebate",
      "/learn/tax/health-education-cess-calculation",
      "/learn/tax/gross-income-vs-taxable-income",
      "/learn/tax/income-tax-calculator-vs-payroll-tds",
      "/learn/retirement/nps-explained",
      "/learn/retirement/nps-corpus-calculation",
      "/learn/retirement/nps-lump-sum-and-annuity",
      "/learn/retirement/nps-calculator-assumptions",
      "/learn/retirement/epf-explained",
      "/learn/retirement/epf-contribution-calculation",
      "/learn/retirement/epf-calculator-projection-assumptions",
      "/learn/retirement/gratuity-explained",
      "/learn/retirement/gratuity-calculation",
      "/learn/retirement/gratuity-calculator-vs-employer-settlement",
      "/learn/retirement/gratuity-eligibility",
      "/learn/tax/gst-explained",
      "/learn/tax/gst-remove-from-inclusive-price",
      "/learn/tax/gst-calculator-vs-invoice",
      "/learn/investments/step-up-sip-explained",
      "/learn/investments/step-up-sip-calculation",
      "/learn/investments/step-up-sip-projection-assumptions",
      "/learn/investments/swp-explained",
      "/learn/investments/swp-calculation",
      "/learn/investments/swp-corpus-exhaustion",
    ]);
  });
});
