import { describe, expect, it } from "vitest";
import { articles } from "../../lib/content/articles";
import { calculators, type CalculatorSlug } from "../../lib/content/calculators";
import { calculatorGuideCuration, getCalculatorGuideCuration, getDiscoveryRegistryIssues, learnCategoryHubs } from "../../lib/content/discovery";

describe("explicit calculator guide curation", () => {
  it("explicitly represents every calculator", () => {
    expect(Object.keys(calculatorGuideCuration)).toEqual(Object.keys(calculators));
    expect(Object.keys(calculatorGuideCuration)).toHaveLength(17);
  });

  it("resolves every curated entry and preserves declared order", () => {
    expect(getDiscoveryRegistryIssues()).toEqual([]);
    for (const slug of Object.keys(calculators) as CalculatorSlug[]) {
      const declared = calculatorGuideCuration[slug];
      const resolved = getCalculatorGuideCuration(slug);
      expect(resolved.core?.slug).toBe(declared.core);
      expect(resolved.supporting.map((article) => article.slug)).toEqual(declared.supporting);
    }
  });

  it("keeps the approved visible card sets stable", () => {
    expect(calculatorGuideCuration["home-loan"].supporting).toEqual(["home-loan-emi-calculation", "home-loan-tenure-comparison"]);
    expect(calculatorGuideCuration.sip.supporting).toEqual(["sip-return-calculation", "sip-projection-assumptions"]);
    expect(calculatorGuideCuration.lumpsum.supporting).toEqual(["lumpsum-projection-assumptions"]);
  });

  it("does not derive cards from article registry order or priority", () => {
    const syntheticArticles = [
      ...articles,
      { ...articles.find((article) => article.slug === "home-loan-prepayment")!, calculatorDiscoveryPriority: 10_000 },
    ];
    expect(getCalculatorGuideCuration("home-loan", syntheticArticles).supporting.map((article) => article.slug)).toEqual([
      "home-loan-emi-calculation",
      "home-loan-tenure-comparison",
    ]);
    expect(syntheticArticles.at(-1)?.calculatorDiscoveryPriority).toBe(10_000);
  });
});

describe("category hub structure", () => {
  it("uses unique non-empty groups with core-first declared content", () => {
    for (const hub of Object.values(learnCategoryHubs)) {
      expect(hub.groups.length).toBeGreaterThan(0);
      expect(new Set(hub.groups.map((group) => group.id)).size).toBe(hub.groups.length);
      expect(new Set(hub.groups.map((group) => group.title)).size).toBe(hub.groups.length);
      for (const group of hub.groups) expect(group.coreArticle).toBeTruthy();
    }
  });

  it("places comparisons and broader guides only in their principal sections", () => {
    expect(learnCategoryHubs.investments.comparisons).toEqual(["sip-vs-lumpsum", "fixed-sip-vs-step-up-sip"]);
    expect(learnCategoryHubs.banking.comparisons).toEqual(["fd-vs-rd"]);
    expect(learnCategoryHubs["personal-finance"].broaderGuides).toEqual(["compound-interest"]);
  });

  it("makes calculator-hidden guides intentionally discoverable", () => {
    const categoryPlacements = Object.values(learnCategoryHubs).flatMap((hub) => [
      ...hub.groups.flatMap((group) => [group.coreArticle, ...group.supportingArticles]),
      ...(hub.comparisons ?? []),
      ...(hub.broaderGuides ?? []),
    ]);
    for (const slug of ["home-loan-prepayment", "cagr-vs-average-annual-return", "premature-fd-withdrawal", "ppf-tenure-extension", "health-education-cess-calculation", "income-tax-calculator-vs-payroll-tds", "nps-calculator-assumptions", "inflation-calculator-projection-assumptions", "gratuity-eligibility"]) expect(categoryPlacements).toContain(slug);
  });
});
