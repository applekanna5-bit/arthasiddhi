import { describe, expect, it } from "vitest";
import { articles, getArticle, getArticleBySlug, getArticlesByCategory, getArticleReferences, getArticleRegistryIssues, getPrimaryGuideForCalculator } from "../../lib/content/articles";
import { calculators } from "../../lib/content/calculators";
import { getDiscoveryRegistryIssues, getLearnCategoryHub } from "../../lib/content/discovery";
import { articleMetadata, faqJsonLd, getArticlePath } from "../../lib/content/seo";
import { absoluteUrl } from "../../lib/content/site";
import { buildSitemap } from "../../lib/content/sitemap";
import { getHomeBuyingJourneyLink } from "../../lib/analytics";
import { articleSlugs, type Article } from "../../lib/content/types";

const debtSlug = "prioritize-debt-financial-commitments";
const investmentSlug = "risk-return-time-horizon";
const newSlugs = [debtSlug, investmentSlug] as const;
const foundationSlugs = ["how-to-build-a-personal-financial-plan", "understand-household-cash-flow", "emergency-fund-planning"] as const;
const debt = () => getArticle("personal-finance", debtSlug)!;
const investment = () => getArticle("personal-finance", investmentSlug)!;
function links(article: Article) {
  return article.sections.flatMap(({ paragraphs, callout }) => [...(paragraphs ?? []), ...(callout ? [callout.text] : [])])
    .flatMap((content) => typeof content === "string" ? [] : content.flatMap(({ link }) => link ? [link] : []));
}
function text(article: Article) {
  return article.sections.flatMap((section) => [section.heading, ...(section.paragraphs ?? []).map((content) => typeof content === "string" ? content : content.map(({ text }) => text).join("")), ...(section.list ?? []), ...(section.table?.rows.flat() ?? [])]).join(" ");
}

describe("V2.2D debt and investment-readiness foundations", () => {
  it("adds exactly two declared articles in Personal Finance without adding calculators", () => {
    expect(articles).toHaveLength(76);
    expect(getArticlesByCategory("personal-finance")).toHaveLength(8 + 2);
    expect(Object.keys(calculators)).toHaveLength(17);
    expect(getArticleRegistryIssues()).toEqual([]);
    expect(getDiscoveryRegistryIssues()).toEqual([]);
    for (const slug of newSlugs) {
      expect(articles.filter((article) => article.slug === slug)).toHaveLength(1);
      expect(articleSlugs.filter((declared) => declared === slug)).toHaveLength(1);
      expect(getArticleBySlug(slug)).toMatchObject({ category: "personal-finance", maintenance: { kind: "evergreen" }, primaryCalculator: null, calculatorGuideRole: null, relatedCalculators: [] });
      expect(links(getArticleBySlug(slug)!).every((link) => link.kind === "article")).toBe(true);
    }
  });

  it("keeps stable routes, unique descriptions and matching canonical metadata", () => {
    const titles = ["How to Prioritize Debt and Financial Commitments", "Risk, Return and Time Horizon: Foundations for Investing"];
    for (const [index, slug] of newSlugs.entries()) {
      const article = getArticleBySlug(slug)!;
      const path = `/learn/personal-finance/${slug}`;
      expect(getArticlePath(article)).toBe(path);
      expect(articleMetadata(article)).toMatchObject({ title: titles[index], description: article.description, alternates: { canonical: absoluteUrl(path) } });
      expect(articleMetadata(article).robots).toBeUndefined();
      expect(faqJsonLd(article)).toBeNull();
      expect(articles.filter(({ description }) => description === article.description)).toHaveLength(1);
    }
  });

  it("owns debt decisions and planning without a payoff score or unconditional method", () => {
    expect(debt().sections.map(({ id }) => id)).toEqual(["household-decision", "cash-flow-and-obligations", "compare-obligations", "liquidity-and-competing-goals", "loan-specific-questions", "plan-and-review"]);
    const content = text(debt());
    expect(content).toContain("ArthaSiddhi educational planning framework");
    expect(content).toContain("not a universal repayment method");
    expect(content).toContain("no assigned weights");
    expect(content).toContain("no fixed review interval or universal payoff sequence");
    expect(content).not.toMatch(/snowball|avalanche|highest-interest-first|smallest-balance-first|\d+%|\d+ months/i);
    expect(debt().sections.find(({ id }) => id === "compare-obligations")?.table?.headers).toEqual(["Factor", "Why it matters", "What to check"]);
    expect(getArticleReferences(debt())).toEqual([]);
  });

  it("owns understanding uncertainty before product decisions without expanding products", () => {
    expect(investment().sections.map(({ id }) => id)).toEqual(["decision-context", "risk-and-return", "time-horizon", "liquidity-and-access", "diversification-boundary", "concept-and-product-handoffs"]);
    const content = text(investment());
    expect(content).toContain("ArthaSiddhi educational framework");
    expect(content).toContain("A past gain does not guarantee a future gain");
    expect(content).toContain("taking more risk does not ensure a higher realized return");
    expect(content).toContain("different kinds of uncertainty");
    expect(content).toContain("longer horizon does not guarantee recovery");
    expect(content).toContain("reduce concentration");
    expect(content).toContain("does not eliminate the possibility of loss");
    expect(content).toContain("before product selection");
    expect(content).not.toMatch(/\b(stocks?|mutual funds?|ETFs?|index funds?|bonds?|gold|REITs?|InvITs?|derivatives|commodities|cryptocurrency)\b|\d+%|\d+ months|\d+ years/i);
    expect(investment().sections.every(({ table }) => !table)).toBe(true);
  });

  it("leaves general goals and saving versus investing with the flagship", () => {
    expect(text(investment())).toContain("Identifying and ordering household goals belongs in");
    expect(text(investment())).toContain("not a rigid saving-versus-investing time threshold");
    expect(getArticleBySlug(foundationSlugs[0])?.sections.some(({ id }) => id === "goals-and-timing")).toBe(true);
    expect(getArticleBySlug(foundationSlugs[0])?.sections.some(({ id }) => id === "access-and-investing")).toBe(true);
    expect(getArticlesByCategory("personal-finance").filter(({ primaryCalculator, slug }) => primaryCalculator === null && slug !== "compound-interest").map(({ slug }) => slug)).toEqual([...foundationSlugs, ...newSlugs]);
  });

  it("integrates only contextual V2.2C progression and bounded specialist handoffs", () => {
    const flagship = getArticleBySlug(foundationSlugs[0])!;
    expect(links(flagship).map(({ slug }) => slug)).toContain(debtSlug);
    expect(links(flagship).map(({ slug }) => slug)).toContain(investmentSlug);
    for (const slug of foundationSlugs.slice(1)) expect(links(getArticleBySlug(slug)!).map(({ slug }) => slug)).toContain(debtSlug);
    expect(links(debt()).map(({ slug }) => slug)).toEqual([foundationSlugs[1], foundationSlugs[2], "personal-loan-emi-explained", foundationSlugs[0], investmentSlug]);
    expect(links(investment()).map(({ slug }) => slug)).toEqual([foundationSlugs[0], foundationSlugs[2], "inflation-explained", "compound-interest", "sip-projection-assumptions"]);
    expect(text(debt())).toContain("loan-specific action");
    expect(text(investment())).toContain("not a recommendation to use a SIP");
  });

  it("uses official SEBI education references in the existing reference schema", () => {
    const references = getArticleReferences(investment());
    expect(references.map(({ url }) => url)).toEqual(["https://investor.sebi.gov.in/investment-thingsbeforeinv.html", "https://investor.sebi.gov.in/investment_risk_managment.html"]);
    for (const reference of references) expect(reference).toMatchObject({ publisher: "Securities and Exchange Board of India", sourceType: "official", accessedAt: "2026-10-02" });
  });

  it("preserves Inflation and Compound Interest ownership without duplicate explanations", () => {
    expect(getPrimaryGuideForCalculator("inflation")?.slug).toBe("inflation-explained");
    expect(articles.filter(({ primaryCalculator }) => primaryCalculator === "inflation").map(({ slug }) => slug)).toEqual(["inflation-explained", "inflation-future-cost", "purchasing-power-explained", "inflation-calculator-projection-assumptions"]);
    expect(getArticleBySlug("compound-interest")).toMatchObject({ category: "personal-finance", primaryCalculator: null, relatedCalculators: ["sip", "fd"] });
    expect(text(investment())).toContain("Those pages own the detailed explanations and mathematics");
    expect(investment().sections.map(({ heading }) => heading).join(" ")).not.toMatch(/what is inflation|what is compound interest|inflation calculation|compounding mechanics/i);
  });

  it("keeps V2.2C and Home Buying routes intact and extends no frozen events", () => {
    for (const slug of foundationSlugs) expect(getArticlePath(getArticleBySlug(slug)!)).toBe(`/learn/personal-finance/${slug}`);
    expect(getArticlePath(getArticleBySlug("emergency-fund-before-home-loan")!)).toBe("/learn/loans/emergency-fund-before-home-loan");
    expect(getArticleBySlug("emergency-fund-before-home-loan")?.relatedArticles).toEqual(["home-buying-costs-beyond-property-price", "home-loan-down-payment", "how-much-house-can-i-afford"]);
    for (const slug of [...newSlugs, ...foundationSlugs]) {
      for (const link of links(getArticleBySlug(slug)!)) expect(getHomeBuyingJourneyLink(slug, link.slug, "article_body")).toBeUndefined();
    }
  });

  it("resolves every internal body and related article link", () => {
    for (const article of articles) {
      for (const link of links(article)) {
        if (link.kind === "article") expect(getArticleBySlug(link.slug)).toBeDefined();
        else expect(calculators[link.slug]).toBeDefined();
      }
      for (const slug of article.relatedArticles) expect(getArticleBySlug(slug)).toBeDefined();
    }
  });

  it("adds each canonical once to the sitemap and existing discovery list", () => {
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(109);
    expect(new Set(urls).size).toBe(urls.length);
    for (const slug of newSlugs) {
      expect(urls.filter((url) => url === absoluteUrl(`/learn/personal-finance/${slug}`))).toHaveLength(1);
      expect(getLearnCategoryHub("personal-finance").groups.flatMap((group) => [group.coreArticle, ...group.supportingArticles]).filter((entry) => entry === slug)).toHaveLength(1);
    }
    expect(getLearnCategoryHub("personal-finance").groups.map(({ id }) => id)).toEqual(["household-planning", "investment-readiness", "inflation", "compound-growth"]);
  });
});
