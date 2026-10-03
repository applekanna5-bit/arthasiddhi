import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { articles, categoryDescriptions, getArticleBySlug, getArticlesByCategory } from "../../lib/content/articles";
import { calculators } from "../../lib/content/calculators";
import { getDiscoveryRegistryIssues, learnCategoryHubs } from "../../lib/content/discovery";
import { getArticlePath } from "../../lib/content/seo";
import { buildSitemap } from "../../lib/content/sitemap";
import { LearnTopicGroup } from "../../components/learn/LearnTopicGroup";

vi.mock("@/lib/content/seo", async () => import("../../lib/content/seo"));
vi.mock("@/lib/content/calculators", async () => import("../../lib/content/calculators"));

const hub = learnCategoryHubs["personal-finance"];
const membership = [
  ["how-to-build-a-personal-financial-plan", "understand-household-cash-flow", "emergency-fund-planning", "prioritize-debt-financial-commitments"],
  ["risk-return-time-horizon"],
  ["inflation-explained", "inflation-future-cost", "purchasing-power-explained", "inflation-calculator-projection-assumptions"],
  ["compound-interest"],
] as const;
function renderGroup(group: typeof hub.groups[number]) {
  return renderToStaticMarkup(createElement(LearnTopicGroup, {
    group,
    core: getArticleBySlug(group.coreArticle)!,
    supporting: group.supportingArticles.map((slug) => getArticleBySlug(slug)!),
  }));
}

describe("Personal Finance hub integration", () => {
  it("uses the approved four groups and exact core-first membership", () => {
    expect(hub.groups.map(({ title }) => title)).toEqual(["Plan your household finances", "Before you invest", "Inflation and purchasing power", "Understand compound growth"]);
    expect(hub.groups.map((group) => [group.coreArticle, ...group.supportingArticles])).toEqual(membership);
    const placements = membership.flat();
    expect(placements).toHaveLength(10);
    expect(new Set(placements)).toEqual(new Set(getArticlesByCategory("personal-finance").map(({ slug }) => slug)));
    expect(hub.broaderGuides).toBeUndefined();
    expect(hub.comparisons).toBeUndefined();
    expect(getDiscoveryRegistryIssues()).toEqual([]);
  });

  it("keeps only the preserved Inflation group calculator CTA", () => {
    expect(hub.groups.map(({ calculator }) => calculator)).toEqual([undefined, undefined, "inflation", undefined]);
    expect(hub.groups[2].id).toBe("inflation");
    for (const [index, group] of hub.groups.entries()) {
      expect(renderGroup(group).includes(calculators.inflation.href)).toBe(index === 2);
      expect(renderGroup(group)).not.toContain(calculators.sip.href);
      expect(renderGroup(group)).not.toContain(calculators.fd.href);
    }
  });

  it("renders the flagship as the sole visible highlighted category entry", () => {
    expect(hub.groups.filter(({ corePresentation }) => corePresentation === "start-here").map(({ coreArticle }) => coreArticle)).toEqual([membership[0][0]]);
    const html = hub.groups.map(renderGroup).join("");
    expect(html.match(/>Start here</g)).toHaveLength(1);
    expect(html.match(/bg-emerald-50/g)).toHaveLength(1);
    expect(renderGroup(hub.groups[0])).toContain('>Start here<');
    expect(renderGroup(hub.groups[0])).toContain('bg-emerald-50');
    expect(html.match(/>Guide</g)).toHaveLength(6);
  });

  it.each([1, 2, 3])("renders group %i core as a visible neutral Overview", (index) => {
    expect(hub.groups[index].corePresentation).toBe("overview");
    const html = renderGroup(hub.groups[index]);
    expect(html).toContain('>Overview<');
    expect(html).not.toContain('>Start here<');
    expect(html).not.toContain('bg-emerald-50');
    expect(html).toContain('bg-white');
  });

  it("preserves Start here and highlighted cores in every untouched category", () => {
    for (const other of Object.values(learnCategoryHubs).filter(({ category }) => category !== "personal-finance")) {
      for (const group of other.groups) {
        expect(group.corePresentation).toBeUndefined();
        const html = renderGroup(group);
        expect(html.match(/>Start here</g)).toHaveLength(1);
        expect(html.match(/bg-emerald-50/g)).toHaveLength(1);
        expect(html).not.toContain('>Overview<');
        expect(html.match(/>Guide</g)).toHaveLength(group.supportingArticles.length);
      }
    }
  });

  it("uses approved shared category copy and concise Learn preview", () => {
    expect(categoryDescriptions["personal-finance"]).toBe("Understand household cash flow, financial priorities, debt and access needs, then explore risk, inflation and compounding before comparing products.");
    expect(hub.topicPreview).toEqual(["Financial planning", "Cash flow", "Risk and return", "Inflation and growth"]);
    expect(hub.groups[0].description).toBe("Start with an overview, or go directly to the household decision you are considering.");
  });

  it("preserves inventories and all ten canonical article paths", () => {
    expect(articles).toHaveLength(76);
    expect(getArticlesByCategory("personal-finance")).toHaveLength(10);
    expect(Object.keys(calculators)).toHaveLength(17);
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(109);
    expect(new Set(urls).size).toBe(109);
    for (const slug of membership.flat()) {
      const article = getArticleBySlug(slug)!;
      expect(getArticlePath(article)).toBe(`/learn/personal-finance/${slug}`);
      expect(urls.filter((url) => url === `https://arthasiddhi.com/learn/personal-finance/${slug}`)).toHaveLength(1);
    }
  });
});
