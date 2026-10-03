import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { articles, categoryDescriptions, getArticleBySlug, getArticlesByCategory } from "../../lib/content/articles";
import { calculators } from "../../lib/content/calculators";
import { getDiscoveryRegistryIssues, learnCategoryHubs } from "../../lib/content/discovery";
import { buildSitemap } from "../../lib/content/sitemap";
import { LearnTopicGroup } from "../../components/learn/LearnTopicGroup";

vi.mock("@/lib/content/seo", async () => import("../../lib/content/seo"));
vi.mock("@/lib/content/calculators", async () => import("../../lib/content/calculators"));

const hub = learnCategoryHubs.banking;
const membership = [
  ["choosing-bank-deposit"],
  ["fixed-deposit-explained", "fd-interest-calculation", "premature-fd-withdrawal", "fd-maturity-and-renewal"],
  ["rd-explained", "rd-interest-calculation", "rd-calculator-projection-vs-actual-maturity", "manage-recurring-deposit"],
  ["deposit-insurance-explained"],
  ["ppf-explained", "ppf-interest-calculation", "ppf-tenure-extension", "ppf-calculator-projection-vs-actual-maturity"],
];
function renderGroup(group: typeof hub.groups[number]) {
  return renderToStaticMarkup(createElement(LearnTopicGroup, {
    group, core: getArticleBySlug(group.coreArticle)!,
    supporting: group.supportingArticles.map((slug) => getArticleBySlug(slug)!),
  }));
}

describe("Banking decision and lifecycle hub", () => {
  it("uses the exact five ordered groups and core-first membership", () => {
    expect(hub.groups.map(({ title }) => title)).toEqual(["Choose a deposit", "Fixed deposits: understand and manage", "Recurring deposits: understand and manage", "Deposit safety", "PPF"]);
    expect(hub.groups.map(({ coreArticle, supportingArticles }) => [coreArticle, ...supportingArticles])).toEqual(membership);
    expect(hub.comparisons).toEqual(["fd-vs-rd"]);
    expect(hub.broaderGuides).toBeUndefined();
    const placements = [...membership.flat(), ...hub.comparisons!];
    expect(placements).toHaveLength(15);
    expect(new Set(placements).size).toBe(15);
    expect(new Set(placements)).toEqual(new Set(getArticlesByCategory("banking").map(({ slug }) => slug)));
    expect(getDiscoveryRegistryIssues()).toEqual([]);
  });
  it("renders one highlighted Start here, four neutral Overviews and nine Guides", () => {
    expect(hub.groups.map(({ corePresentation }) => corePresentation)).toEqual(["start-here", "overview", "overview", "overview", "overview"]);
    const html = hub.groups.map(renderGroup).join("");
    expect(html.match(/>Start here</g)).toHaveLength(1);
    expect(html.match(/>Overview</g)).toHaveLength(4);
    expect(html.match(/>Guide</g)).toHaveLength(9);
    expect(html.match(/bg-emerald-50/g)).toHaveLength(1);
    for (const group of hub.groups.slice(1)) expect(renderGroup(group)).not.toContain("bg-emerald-50");
  });
  it("renders exactly the FD, RD and PPF calculator CTAs", () => {
    expect(hub.groups.map(({ calculator }) => calculator)).toEqual([undefined, "fd", "rd", undefined, "ppf"]);
    for (const group of hub.groups) {
      const html = renderGroup(group);
      expect((html.match(/href="\/calculators\//g) ?? []).length).toBe(group.calculator ? 1 : 0);
      if (group.calculator) expect(html).toContain(calculators[group.calculator].href);
    }
  });
  it("uses the approved shared category description and Learn preview", () => {
    expect(categoryDescriptions.banking).toBe("Choose and manage bank deposits by understanding access, contribution patterns, maturity, protection and product terms, then use calculators to explore FD, RD and PPF projections.");
    expect(hub.topicPreview).toEqual(["Deposit choices", "FD & RD management", "Deposit safety", "PPF"]);
  });
  it("preserves inventories and all Banking sitemap routes", () => {
    expect(articles).toHaveLength(76);
    expect(getArticlesByCategory("banking")).toHaveLength(15);
    expect(getArticlesByCategory("personal-finance")).toHaveLength(10);
    expect(Object.keys(calculators)).toHaveLength(17);
    const urls = buildSitemap().map(({ url }) => url);
    expect(urls).toHaveLength(109);
    expect(new Set(urls).size).toBe(109);
    for (const slug of [...membership.flat(), "fd-vs-rd"]) expect(urls.filter((url) => url === `https://arthasiddhi.com/learn/banking/${slug}`)).toHaveLength(1);
  });
});
