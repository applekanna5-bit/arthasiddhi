import { describe, expect, it } from "vitest";
import { articles, getArticle, getArticleBySlug, getArticleReferences, getArticleRegistryIssues, getArticlesByCategory } from "../../lib/content/articles";
import { calculators } from "../../lib/content/calculators";
import { getDiscoveryRegistryIssues, learnCategoryHubs, calculatorGuideCuration } from "../../lib/content/discovery";
import { articleMetadata, getArticlePath, faqJsonLd } from "../../lib/content/seo";
import { buildSitemap } from "../../lib/content/sitemap";
import { absoluteUrl } from "../../lib/content/site";
import { isBankingArticleSlug } from "../../lib/analytics";
import type { Article } from "../../lib/content/types";

const slugs = ["choosing-bank-deposit", "deposit-insurance-explained"] as const;
const linkTargets = (article: Article) => article.sections.flatMap(({ paragraphs, callout }) => [...(paragraphs ?? []), ...(callout ? [callout.text] : [])]).flatMap((value) => typeof value === "string" ? [] : value.flatMap(({ link }) => link ? [link] : []));

describe("bank deposit decision and insurance owners", () => {
  it("registers two unique Banking routes with indexable canonical metadata", () => {
    for (const slug of slugs) {
      expect(articles.filter((article) => article.slug === slug)).toHaveLength(1);
      const article = getArticle("banking", slug)!;
      const path = `/learn/banking/${slug}`;
      expect(getArticlePath(article)).toBe(path);
      expect(articleMetadata(article)).toMatchObject({ title: article.title, description: article.description, alternates: { canonical: absoluteUrl(path) } });
      expect(articleMetadata(article).robots).toBeUndefined();
      expect(faqJsonLd(article)).toBeNull();
      expect(articles.filter(({ description }) => description === article.description)).toHaveLength(1);
    }
  });
  it("preserves inventory and gives each new route one sitemap entry", () => {
    expect(articles).toHaveLength(76);
    expect(getArticlesByCategory("banking")).toHaveLength(15);
    expect(getArticlesByCategory("personal-finance")).toHaveLength(10);
    expect(Object.keys(calculators)).toHaveLength(17);
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(109);
    expect(new Set(urls).size).toBe(109);
    for (const slug of slugs) expect(urls.filter((url) => url === absoluteUrl(`/learn/banking/${slug}`))).toHaveLength(1);
  });
  it("keeps both owners outside primary calculator and frozen analytics contracts", () => {
    for (const slug of slugs) {
      expect(getArticleBySlug(slug)).toMatchObject({ primaryCalculator: null, calculatorGuideRole: null, relatedCalculators: [] });
      expect(isBankingArticleSlug(slug)).toBe(false);
    }
    expect(linkTargets(getArticleBySlug(slugs[1])!).every(({ kind }) => kind === "article")).toBe(true);
    expect(linkTargets(getArticleBySlug(slugs[0])!).filter(({ kind }) => kind === "calculator").map(({ slug }) => slug)).toEqual(["fd", "rd"]);
  });
  it("keeps decision context separate from existing framework and arithmetic owners", () => {
    const article = getArticleBySlug(slugs[0])!;
    const targets = linkTargets(article).map(({ slug }) => slug);
    for (const slug of ["understand-household-cash-flow", "emergency-fund-planning", "how-to-build-a-personal-financial-plan", "fd-vs-rd", "inflation-explained", slugs[1]]) expect(targets).toContain(slug);
    expect(article.maintenance).toEqual({ kind: "evergreen" });
    expect(JSON.stringify(article)).not.toMatch(/best bank|highest FD|guaranteed return|optimal tenure calculator/i);
  });
  it("uses verified official DICGC references and preserves ownership nuance", () => {
    const article = getArticleBySlug(slugs[1])!;
    expect(article.maintenance).toMatchObject({ kind: "rule-sensitive", ruleSetId: "dicgc-deposit-insurance-2026-10" });
    const refs = getArticleReferences(article);
    expect(refs).toHaveLength(4);
    for (const ref of refs) {
      expect(ref.sourceType).toBe("official");
      expect(new URL(ref.url).hostname).toBe("www.dicgc.org.in");
      expect(ref.accessedAt).toBe("2026-10-02");
    }
    const text = JSON.stringify(article);
    for (const concept of ["principal plus interest", "same right and capacity", "same holders in the same order", "different holder combination", "does not mean each holder", "sole proprietor", "set off", "not guaranteed to be immediately available"]) expect(text).toContain(concept);
    expect(article.sections.map(({ id }) => id)).toContain("different-banks");
  });
  it("places the decision owners once in the integrated Banking hub and preserves curation", () => {
    const hub = learnCategoryHubs.banking;
    expect(hub.groups.map(({ id }) => id)).toEqual(["choose-deposit", "fixed-deposits", "recurring-deposits", "deposit-safety", "ppf"]);
    expect(hub.topicPreview).toEqual(["Deposit choices", "FD & RD management", "Deposit safety", "PPF"]);
    expect(hub.broaderGuides).toBeUndefined();
    const placements = [...hub.groups.flatMap(({ coreArticle, supportingArticles }) => [coreArticle, ...supportingArticles]), ...(hub.comparisons ?? []), ...(hub.broaderGuides ?? [])];
    expect(placements).toHaveLength(15);
    expect(new Set(placements).size).toBe(15);
    expect(calculatorGuideCuration.fd).toEqual({ core: "fixed-deposit-explained", supporting: ["fd-interest-calculation", "fd-vs-rd"] });
    expect(calculatorGuideCuration.ppf.supporting).toEqual(["ppf-interest-calculation", "ppf-calculator-projection-vs-actual-maturity"]);
  });
  it("provides minimal inbound context and validates every article relationship", () => {
    for (const slug of ["fixed-deposit-explained", "rd-explained"] as const) for (const target of slugs) expect(linkTargets(getArticleBySlug(slug)!).map(({ slug }) => slug)).toContain(target);
    for (const article of articles) for (const link of linkTargets(article)) expect(link.kind === "article" ? getArticleBySlug(link.slug) : calculators[link.slug]).toBeDefined();
    expect(getArticleRegistryIssues()).toEqual([]);
    expect(getDiscoveryRegistryIssues()).toEqual([]);
  });
});
