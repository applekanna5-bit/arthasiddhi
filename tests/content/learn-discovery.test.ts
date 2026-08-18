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
  const expectedCategories = ["personal-finance", "loans", "investments", "banking", "tax"];

  it("shows only categories containing published articles", () => {
    expect(publishedCategories).toEqual(expectedCategories);
    expect(publishedCategories.every((category) => getArticlesByCategory(category).length > 0)).toBe(true);
  });

  it("exposes Tax but not empty Retirement in primary discovery", () => {
    expect(publishedCategories).toContain("tax");
    expect(publishedCategories).not.toContain("retirement");
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

  it("adds populated Tax and keeps empty Retirement out of the sitemap", () => {
    const sitemapUrls = new Set(buildSitemap().map(({ url }) => url));
    expect(sitemapUrls.has(absoluteUrl("/learn/tax"))).toBe(true);
    expect(sitemapUrls.has(absoluteUrl("/learn/retirement"))).toBe(false);
  });

  it("keeps article relationships valid and public URLs unchanged", () => {
    expect(getArticleRegistryIssues()).toEqual([]);
    expect(articles.map(getArticlePath)).toEqual([
      "/learn/loans/home-loan-guide",
      "/learn/loans/home-loan-emi-calculation",
      "/learn/loans/home-loan-tenure-comparison",
      "/learn/loans/home-loan-prepayment",
      "/learn/investments/sip-explained",
      "/learn/investments/sip-return-calculation",
      "/learn/investments/sip-vs-lumpsum",
      "/learn/investments/fixed-sip-vs-step-up-sip",
      "/learn/investments/sip-projection-assumptions",
      "/learn/banking/fixed-deposit-explained",
      "/learn/banking/fd-interest-calculation",
      "/learn/banking/fd-vs-rd",
      "/learn/banking/premature-fd-withdrawal",
      "/learn/personal-finance/compound-interest",
      "/learn/tax/new-tax-regime-slab-calculation",
      "/learn/tax/section-87a-rebate",
      "/learn/tax/health-education-cess-calculation",
      "/learn/tax/gross-income-vs-taxable-income",
      "/learn/tax/income-tax-calculator-vs-payroll-tds",
    ]);
  });
});
