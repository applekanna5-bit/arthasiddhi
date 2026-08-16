import { describe, expect, it } from "vitest";
import { financialRuleSets, incomeTaxRuleSet, npsRuleSet } from "../../lib/financial-rules/rule-sets";

describe("financial rule registry", () => {
  it("uses stable, unique rule-set IDs", () => { const ids = Object.values(financialRuleSets).map((ruleSet) => ruleSet.id); expect(new Set(ids).size).toBe(4); expect(ids).toEqual(["income-tax-ty-2026-27", "gst-generic-arithmetic-2026-08", "epf-standard-contributions-2026-08", "nps-normal-exit-illustration-2026-08"]); });
  it("identifies the income-tax period as Tax Year 2026–27", () => expect(incomeTaxRuleSet.effectivePeriod).toBe("Tax Year 2026–27"));
  it("configures the All Citizen Model normal-exit illustration at a 20% minimum annuity allocation", () => expect(npsRuleSet.rules).toMatchObject({ minimumAnnuityAllocation: 20, maximumAnnuityAllocation: 100 }));
  it("records a verification date and official HTTPS sources for every rule set", () => { for (const ruleSet of Object.values(financialRuleSets)) { expect(ruleSet.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/); expect(ruleSet.sources.length).toBeGreaterThan(0); for (const source of ruleSet.sources) { expect(source.authority).toBeTruthy(); expect(source.reference).toMatch(/^https:\/\//); expect(source.reference).not.toMatch(/blog|newspaper|affiliate/i); } } });
});
