import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { articles, getArticle, getArticleBySlug, getArticleReferences, getArticleRegistryIssues, getArticlesByCategory } from "../../lib/content/articles";
import { calculators } from "../../lib/content/calculators";
import { calculatorGuideCuration, getDiscoveryRegistryIssues, learnCategoryHubs } from "../../lib/content/discovery";
import { getArticleMaintenanceStatus, ruleSetMaintenancePolicies } from "../../lib/content/maintenance";
import { articleMetadata, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import { domesticDepositRuleSet } from "../../lib/financial-rules/rule-sets";
import { isBankingArticleSlug } from "../../lib/analytics";
import type { Article } from "../../lib/content/types";

const slugs = ["fd-maturity-and-renewal", "manage-recurring-deposit"] as const;
const links = (article: Article) => article.sections.flatMap(({ paragraphs, callout }) => [...(paragraphs ?? []), ...(callout ? [callout.text] : [])]).flatMap((value) => typeof value === "string" ? [] : value.flatMap(({ link }) => link ? [link] : []));
const text = (article: Article) => JSON.stringify(article);

describe("deposit lifecycle ownership and safety", () => {
  it("registers each unique, indexable Banking route with canonical metadata", () => {
    for (const slug of slugs) {
      const article = getArticle("banking", slug)!;
      expect(articles.filter((candidate) => candidate.slug === slug)).toHaveLength(1);
      expect(getArticlePath(article)).toBe(`/learn/banking/${slug}`);
      expect(articleMetadata(article)).toMatchObject({ title: article.title, description: article.description, alternates: { canonical: absoluteUrl(`/learn/banking/${slug}`) } });
      expect(articleMetadata(article).robots).toBeUndefined();
      expect(articles.filter(({ description }) => description === article.description)).toHaveLength(1);
    }
    expect(getArticleRegistryIssues()).toEqual([]);
  });
  it("adds exactly two articles and sitemap URLs while leaving calculators and Personal Finance unchanged", () => {
    expect(articles).toHaveLength(76);
    expect(getArticlesByCategory("banking")).toHaveLength(15);
    expect(getArticlesByCategory("personal-finance")).toHaveLength(10);
    expect(Object.keys(calculators)).toHaveLength(17);
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(109);
    expect(new Set(urls).size).toBe(109);
    for (const slug of slugs) expect(urls.filter((url) => url === absoluteUrl(`/learn/banking/${slug}`))).toHaveLength(1);
  });
  it("keeps the new lifecycle owners independent of calculator CTAs and analytics allowlists", () => {
    for (const slug of slugs) {
      const article = getArticleBySlug(slug)!;
      expect(article).toMatchObject({ primaryCalculator: null, calculatorGuideRole: null, relatedCalculators: [] });
      expect(links(article).every(({ kind }) => kind === "article")).toBe(true);
      expect(isBankingArticleSlug(slug)).toBe(false);
    }
  });
  it("inherits current official RBI lineage, review policy and applicability without using the challenged PDF", () => {
    expect(domesticDepositRuleSet.lastVerified).toBe("2026-10-03");
    expect(domesticDepositRuleSet.sources).toHaveLength(6);
    expect(ruleSetMaintenancePolicies["rbi-commercial-bank-domestic-deposits-2026-10"].calculators).toEqual([]);
    for (const slug of slugs) {
      const article = getArticleBySlug(slug)!;
      expect(getArticleMaintenanceStatus(article, "2026-10-03")?.status).toBe("current");
      const refs = getArticleReferences(article);
      expect(refs).toHaveLength(6);
      for (const ref of refs) {
        expect(ref.sourceType).toBe("official");
        expect(new URL(ref.url).hostname).toMatch(/^(www\.)?rbi\.org\.in$/);
        expect(ref.accessedAt).toBe("2026-10-03");
        expect(ref.url).not.toContain("153MD.PDF");
      }
      const scope = article.sections.find(({ id }) => id === "regulatory-scope")!;
      for (const excluded of domesticDepositRuleSet.rules.excludedContexts) expect(text({ ...article, sections: [scope] })).toContain(excluded);
    }
  });
  it("keeps normal FD maturity distinct from early exit and avoids unsupported renewal promises", () => {
    const article = getArticleBySlug(slugs[0])!;
    expect(article.sections.map(({ id }) => id)).toContain("normal-maturity");
    expect(links(article).map(({ slug }) => slug)).toContain("premature-fd-withdrawal");
    expect(text(article)).not.toMatch(/14[ -]day|always renew|always withdraw|best tenure/i);
    expect(article.sections.find(({ id }) => id === "unpaid-proceeds")?.paragraphs?.[0]).toMatch(/lower of.*savings-account.*contracted interest rate/);
    expect(article.sections.find(({ id }) => id === "instructions")?.paragraphs?.[0]).toMatch(/do not assume/i);
    expect(article.sections.find(({ id }) => id === "overdue-renewal")?.paragraphs?.[0]).toMatch(/not a promise/);
  });
  it("keeps RD operational checks separate from household planning and projection methodology", () => {
    const article = getArticleBySlug(slugs[1])!;
    expect(article.sections.map(({ id }) => id)).toEqual(["commitment", "missed-instalments", "cash-flow", "regulatory-scope", "early-closure", "maturity", "projection-boundary", "next-decision"]);
    const targets = links(article).map(({ slug }) => slug);
    for (const target of ["rd-calculator-projection-vs-actual-maturity", "understand-household-cash-flow", "emergency-fund-planning", "how-to-build-a-personal-financial-plan", "choosing-bank-deposit", "deposit-insurance-explained"]) expect(targets).toContain(target);
    expect(article.sections.find(({ id }) => id === "missed-instalments")?.paragraphs?.[0]).toMatch(/Do not assume a universal/);
    expect(text(article)).not.toMatch(/penalty of|grace period of|after \d+ missed|automatically closes/i);
  });
  it("provides bounded inbound handoffs and resolves all internal article relationships", () => {
    for (const [source, target] of [["fixed-deposit-explained", slugs[0]], ["premature-fd-withdrawal", slugs[0]], ["rd-explained", slugs[1]], ["rd-calculator-projection-vs-actual-maturity", slugs[1]], ["choosing-bank-deposit", slugs[0]], ["choosing-bank-deposit", slugs[1]]] as const) expect(links(getArticleBySlug(source)!).map(({ slug }) => slug)).toContain(target);
    for (const article of articles) {
      for (const target of article.relatedArticles) expect(getArticleBySlug(target)).toBeDefined();
      for (const link of links(article)) expect(link.kind === "article" ? getArticleBySlug(link.slug) : calculators[link.slug]).toBeDefined();
    }
  });
  it("uses temporary broader placements without implementing V2.3D or changing calculator curation", () => {
    const hub = learnCategoryHubs.banking;
    expect(hub.groups.map(({ id }) => id)).toEqual(["fixed-deposits", "recurring-deposits", "ppf"]);
    expect(hub.topicPreview).toEqual(["Fixed deposits", "Recurring deposits", "PPF"]);
    expect(hub.broaderGuides).toEqual(["choosing-bank-deposit", "deposit-insurance-explained", ...slugs]);
    const placed = [...hub.groups.flatMap(({ coreArticle, supportingArticles }) => [coreArticle, ...supportingArticles]), ...(hub.comparisons ?? []), ...(hub.broaderGuides ?? [])];
    expect(placed).toHaveLength(15);
    expect(new Set(placed).size).toBe(15);
    expect(getDiscoveryRegistryIssues()).toEqual([]);
    expect(calculatorGuideCuration.fd).toEqual({ core: "fixed-deposit-explained", supporting: ["fd-interest-calculation", "fd-vs-rd"] });
  });
  it("preserves the frozen DICGC owner and rule plus PPF content and rule", () => {
    const hash = (value: string) => createHash("sha256").update(value).digest("hex");
    const banking = readFileSync("lib/content/articles/banking.ts", "utf8").replace(/\r\n/g, "\n");
    const rules = readFileSync("lib/financial-rules/rule-sets.ts", "utf8").replace(/\r\n/g, "\n");
    const decisions = readFileSync("lib/content/articles/deposit-decisions.ts", "utf8").replace(/\r\n/g, "\n");
    expect(hash(banking.slice(banking.indexOf('    title: "PPF Explained:'), banking.indexOf('    title: "RD Explained:')))).toBe("c4ab358ee97d8aafd4c23d901c3b4b2b4c06ad88b4a165fdf5be74e058c8a067");
    expect(hash(rules.slice(rules.indexOf("export const ppfRuleSet"), rules.indexOf("export const gstRuleSet")))).toBe("0cb42d54cad876fccb44c8a1b7fef5a180a3cc6f08af37fe2a2a549db0fc6b27");
    expect(hash(rules.slice(rules.indexOf("export const dicgcRuleSet"), rules.indexOf("// Shared content-only facts")))).toBe("7eb2e6b69d9962de8b39b748b123ed748c0ca57f5309e1be6f56a9fe5d8a319f");
    expect(hash(decisions.slice(decisions.indexOf('    title: "Deposit Insurance Explained:')))).toBe("fb22b6a43d56e8f620a08506eed69f72d727f37414434dcb2185470d6f66ed1c");
  });
});
