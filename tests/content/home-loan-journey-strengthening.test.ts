import { describe, expect, it } from "vitest";
import { articles, getArticle, getArticleReferences, getArticleRegistryIssues, getRelatedArticles } from "../../lib/content/articles";
import { calculators } from "../../lib/content/calculators";
import { articleMetadata, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import type { Article, ArticleInlineContent, ArticleInternalLink, ArticleSlug } from "../../lib/content/types";

const paths = {
  tenure: "/learn/loans/home-loan-tenure-comparison",
  emiStart: "/learn/loans/when-home-loan-emi-starts",
} as const;

function article(slug: Extract<ArticleSlug, "home-loan-tenure-comparison" | "when-home-loan-emi-starts">) {
  const value = getArticle("loans", slug);
  expect(value).toBeDefined();
  return value!;
}

function content(value: Article) {
  return JSON.stringify({ sections: value.sections, faq: value.faq }).toLowerCase();
}

function links(value: Article): ArticleInternalLink[] {
  const fromInline = (inline: ArticleInlineContent): ArticleInternalLink[] => typeof inline === "string" ? [] : inline.flatMap(({ link }) => link ? [link] : []);
  return value.sections.flatMap((section) => [
    ...(section.paragraphs ?? []).flatMap(fromInline),
    ...(section.callout ? fromInline(section.callout.text) : []),
  ]);
}

describe("V2.1D Home Loan journey strengthening", () => {
  it("keeps the published owner URLs and article inventory unchanged", () => {
    expect(articles).toHaveLength(67);
    expect(new Set(articles.map(({ slug }) => slug)).size).toBe(67);
    expect(articles.filter(({ slug }) => slug === "home-loan-tenure-comparison")).toHaveLength(1);
    expect(articles.filter(({ slug }) => slug === "when-home-loan-emi-starts")).toHaveLength(1);
    expect(article("home-loan-tenure-comparison").category).toBe("loans");
    expect(article("when-home-loan-emi-starts").category).toBe("loans");
    expect(getArticleRegistryIssues()).toEqual([]);
    expect(getArticlePath(article("home-loan-tenure-comparison"))).toBe(paths.tenure);
    expect(getArticlePath(article("when-home-loan-emi-starts"))).toBe(paths.emiStart);
    expect(buildSitemap()).toHaveLength(100);
    for (const value of [article("home-loan-tenure-comparison"), article("when-home-loan-emi-starts")]) {
      const canonical = absoluteUrl(getArticlePath(value));
      expect(articleMetadata(value).alternates?.canonical).toBe(canonical);
      expect(buildSitemap().filter(({ url }) => url === canonical)).toHaveLength(1);
      expect(value.maintenance).toEqual({ kind: "evergreen" });
      expect(value.primaryCalculator).toBe("home-loan");
      expect(value.calculatorGuideRole).toBe("supporting");
      expect(getRelatedArticles(value)).toHaveLength(value.relatedArticles.length);
    }
  });

  it("keeps tenure trade-offs conditional and avoids universal thresholds", () => {
    const value = article("home-loan-tenure-comparison");
    const text = content(value);
    expect(text).toContain("no universally best or ideal");
    expect(text).toContain("same principal and rate assumptions");
    expect(text).toContain("do not assume a single minimum or maximum tenure");
    expect(text).toContain("does not forecast future rates");
    expect(text).not.toMatch(/\b(?:10|15|20|25|30)\s+years?\s+(?:is|are)\s+(?:the\s+)?(?:best|ideal|optimal)\b/i);
    expect(text).not.toMatch(/\b(?:emi|instalment)\b[^.]{0,50}\b\d{1,2}%\s*(?:of|of your)\s*(?:salary|income)\b/i);
    expect(value.relatedArticles).toContain("how-much-house-can-i-afford");
    expect(value.relatedArticles).toContain("emergency-fund-before-home-loan");
    expect(links(value)).toContainEqual({ kind: "calculator", slug: "home-loan" });
  });

  it("keeps repayment commencement distinct from sanction and possession", () => {
    const value = article("when-home-loan-emi-starts");
    const text = content(value);
    expect(text).toContain("application and assessment");
    expect(text).toContain("sanction");
    expect(text).toContain("disbursement");
    expect(text).toContain("first emi or debit date depends on the loan agreement");
    expect(text).toContain("possession does not itself set a universal emi start date");
    expect(text).toContain("does not determine the sanction date, disbursement date, first debit date");
    expect(text).not.toMatch(/(?:emi|first debit)[^.]{0,60}\balways\b[^.]{0,50}\b(?:next month|30 days|possession)\b/i);
    expect(value.relatedArticles).toContain("how-much-house-can-i-afford");
    expect(links(value)).toContainEqual({ kind: "calculator", slug: "home-loan" });
  });

  it("retains only official sources supporting the EMI-start explanations", () => {
    const references = getArticleReferences(article("when-home-loan-emi-starts"));
    expect(references).toHaveLength(3);
    expect(references.every(({ publisher, sourceType, accessedAt }) => publisher === "Reserve Bank of India" && sourceType === "official" && accessedAt === "2026-10-01")).toBe(true);
    expect(references.map(({ title }) => title)).toEqual(expect.arrayContaining([
      "Housing Loans — FAQs",
      "Fair Practices Code — Charging of Interest",
      "Key Facts Statement (KFS) for Loans & Advances",
    ]));
    expect(getArticleReferences(article("home-loan-tenure-comparison"))).toEqual([]);
  });

  it("resolves planning links and introduces no calculator relationship or calculator", () => {
    const before = articles.map(({ slug }) => slug).sort();
    for (const value of [article("home-loan-tenure-comparison"), article("when-home-loan-emi-starts")]) {
      for (const link of links(value)) {
        if (link.kind === "article") expect(getArticle("loans", link.slug) ?? articles.find(({ slug }) => slug === link.slug)).toBeDefined();
      }
    }
    expect(before).toHaveLength(67);
    expect(Object.keys(calculators)).toHaveLength(17);
    expect(article("home-loan-tenure-comparison").relatedCalculators).toEqual([]);
    expect(article("when-home-loan-emi-starts").relatedCalculators).toEqual([]);
  });
});
