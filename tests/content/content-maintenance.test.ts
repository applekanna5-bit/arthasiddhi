import { describe, expect, it } from "vitest";
import { articles, getArticleBySlug, publishedCategories } from "../../lib/content/articles";
import { buildSitemap } from "../../lib/content/sitemap";
import { calculators } from "../../lib/content/calculators";
import {
  buildMaintenanceReport,
  getArticleMaintenanceStatus,
  getRuleSetMaintenanceStatus,
  ruleSetMaintenancePolicies,
  type RuleSetMaintenancePolicy,
} from "../../lib/content/maintenance";
import { epfRuleSet, financialRuleSets, gstRuleSet, incomeTaxRuleSet, ppfRuleSet } from "../../lib/financial-rules/rule-sets";

const boundaryPolicy: RuleSetMaintenancePolicy = {
  reviewAfterDays: 90,
  overdueAfterDays: 120,
  priority: "P1",
  eventHints: [],
  calculators: ["income-tax"],
};

const boundaryRuleSet = { ...incomeTaxRuleSet, lastVerified: "2026-01-01" };

describe("maintenance inventory and policy coverage", () => {
  it("preserves the approved content and route inventory", () => {
    const evergreen = articles.filter(({ maintenance }) => maintenance.kind === "evergreen");
    const ruleSensitive = articles.filter(({ maintenance }) => maintenance.kind === "rule-sensitive");
    const local = ruleSensitive.filter(({ maintenance }) => maintenance.kind === "rule-sensitive" && !maintenance.ruleSetId);
    const unresolved = ruleSensitive.filter(({ maintenance }) => maintenance.kind === "rule-sensitive" && maintenance.ruleSetId && !Object.values(financialRuleSets).some(({ id }) => id === maintenance.ruleSetId));
    expect(Object.keys(calculators)).toHaveLength(17);
    expect(articles).toHaveLength(63);
    expect(publishedCategories).toHaveLength(6);
    expect(evergreen).toHaveLength(47);
    expect(ruleSensitive).toHaveLength(16);
    expect(Object.values(financialRuleSets)).toHaveLength(6);
    expect(local).toHaveLength(0);
    expect(unresolved).toHaveLength(0);
    expect(Object.keys(ruleSetMaintenancePolicies).toSorted()).toEqual(Object.values(financialRuleSets).map(({ id }) => id).toSorted());
    expect(new Set(buildSitemap().map(({ url }) => url)).size).toBe(96);
  });

  it("uses distinct valid review windows", () => {
    const policies = Object.values(ruleSetMaintenancePolicies);
    expect(new Set(policies.map(({ reviewAfterDays }) => reviewAfterDays)).size).toBeGreaterThan(1);
    for (const policy of policies) expect(policy.overdueAfterDays).toBeGreaterThan(policy.reviewAfterDays);
  });
});

describe("deterministic age evaluation", () => {
  it.each([
    ["2026-03-31", "current"],
    ["2026-04-01", "review-due"],
    ["2026-04-30", "review-due"],
    ["2026-05-01", "review-overdue"],
  ])("evaluates %s at the inclusive boundaries", (referenceDate, expected) => {
    expect(getRuleSetMaintenanceStatus(boundaryRuleSet, boundaryPolicy, referenceDate).status).toBe(expected);
  });

  it("strictly rejects malformed or normalized dates", () => {
    expect(() => getRuleSetMaintenanceStatus(boundaryRuleSet, boundaryPolicy, "2026-02-30")).toThrow(/valid ISO calendar date/);
    expect(() => getRuleSetMaintenanceStatus(boundaryRuleSet, boundaryPolicy, "23-08-2026")).toThrow(/valid ISO calendar date/);
  });
});

describe("Income Tax period semantics", () => {
  const policy = ruleSetMaintenancePolicies["income-tax-tax-year-2026-27"];
  const periodFixture = { ...incomeTaxRuleSet, lastVerified: "2026-04-01" };

  it("uses current-calculation intent supported by the calculator UI", () => {
    expect(policy.period).toMatchObject({
      kind: "tax-year",
      taxYearEndsOn: "2027-03-31",
      intendedUse: "current-calculation",
    });
  });

  it("does not roll over until the day after the current tax year ends", () => {
    expect(getRuleSetMaintenanceStatus(periodFixture, policy, "2027-03-30").status).toBe("review-overdue");
    expect(getRuleSetMaintenanceStatus(periodFixture, policy, "2027-03-31").status).toBe("review-overdue");
    expect(getRuleSetMaintenanceStatus(periodFixture, policy, "2027-04-01").status).toBe("period-review-required");
  });

  it("keeps the actually verified current rule set current at the milestone reference date", () => {
    const result = getRuleSetMaintenanceStatus(incomeTaxRuleSet, policy, "2026-08-23");
    expect(result.status).toBe("current");
    expect(result.priority).toBe("P3");
    expect(result.ageDays).toBe(0);
    expect(result.reasons.some(({ code }) => code === "financial-year-rollover")).toBe(false);
  });
});

describe("rule-specific boundaries", () => {
  it("keeps the PPF 7.1% editable assumption outside rule freshness", () => {
    const policy = ruleSetMaintenancePolicies["ppf-scheme-2019-amended-2020"];
    expect(policy.reviewAfterDays).toBe(365);
    expect(policy.eventHints).toEqual(["scheme-amendment"]);
    expect(JSON.stringify(policy)).not.toContain("7.1");
    expect(JSON.stringify(ppfRuleSet.rules)).not.toContain("7.1");
  });

  it("reports EPF's encoded pending-notification context", () => {
    const row = buildMaintenanceReport("2026-08-28").find(({ ruleSetId }) => ruleSetId === epfRuleSet.id);
    expect(row?.reasons.some(({ code }) => code === "pending-notification")).toBe(true);
  });

  it("treats GST's missing CBIC access date as advisory only", () => {
    const row = buildMaintenanceReport("2026-08-28").find(({ ruleSetId }) => ruleSetId === gstRuleSet.id);
    expect(row?.status).toBe("current");
    expect(row?.sourceAdvisories).toEqual([expect.objectContaining({ code: "missing-source-access-date", sourceReference: gstRuleSet.sources[0].reference })]);
  });
});

describe("article inheritance, blast radius, and evergreen exclusion", () => {
  it("applies one shared status to every rule-sensitive dependent", () => {
    const report = buildMaintenanceReport("2026-08-28");
    const sensitive = articles.filter(({ maintenance }) => maintenance.kind === "rule-sensitive");
    for (const article of sensitive) {
      const result = getArticleMaintenanceStatus(article, "2026-08-28");
      const row = report.find(({ ruleSetId }) => ruleSetId === result?.ruleSetId);
      expect(result?.status).toBe(row?.status);
      expect(row?.articleSlugs).toContain(article.slug);
    }
    expect(report.every(({ calculators: dependents }) => dependents.length > 0)).toBe(true);
  });

  it.each(["inflation-explained", "sip-explained", "lumpsum-explained", "cagr-explained", "swp-explained", "fixed-deposit-explained", "rd-explained"] as const)(
    "excludes evergreen article %s",
    (slug) => expect(getArticleMaintenanceStatus(getArticleBySlug(slug)!, "2026-08-23")).toBeNull(),
  );
});

describe("immutability", () => {
  it("does not mutate rules, articles, sources, or dates", () => {
    const before = structuredClone({ financialRuleSets, articles });
    buildMaintenanceReport("2026-08-28");
    getArticleMaintenanceStatus(articles.find(({ maintenance }) => maintenance.kind === "rule-sensitive")!, "2026-08-28");
    expect({ financialRuleSets, articles }).toEqual(before);
  });
});
