import { describe, expect, it } from "vitest";
import { calculateEpf, calculateGst, calculateIncomeTax, calculateNps, type IncomeTaxInput } from "../../lib/calculator/rule-driven-calculators";
import { epfRuleSet, gstRuleSet, incomeTaxRuleSet, npsRuleSet } from "../../lib/financial-rules/rule-sets";

const tax = (overrides: Partial<IncomeTaxInput> = {}) => calculateIncomeTax({ regime: "new", ageCategory: "below-60", taxableOrdinaryIncome: 0, ...overrides }, incomeTaxRuleSet);

describe("Income Tax calculator", () => {
  it("returns zero for zero income", () => expect(tax()).toMatchObject({ taxBeforeRebate: 0, rebate: 0, cess: 0, totalTax: 0, effectiveTaxRate: 0 }));
  it.each([
    [399_999, 0], [400_000, 0], [400_001, 0.05],
    [799_999, 19_999.95], [800_000, 20_000], [800_001, 20_000.1],
    [1_199_999, 59_999.9], [1_200_000, 60_000], [1_200_001, 60_000.15],
    [1_599_999, 119_999.85], [1_600_000, 120_000], [1_600_001, 120_000.2],
    [1_999_999, 199_999.8], [2_000_000, 200_000], [2_000_001, 200_000.25],
    [2_399_999, 299_999.75], [2_400_000, 300_000], [2_400_001, 300_000.3],
  ])("calculates the new-regime boundary at ₹%i progressively", (income, expectedSlabTax) => expect(tax({ taxableOrdinaryIncome: income }).taxBeforeRebate).toBeCloseTo(expectedSlabTax, 8));
  it("rebates the calculated tax below ₹12 lakh without exceeding the cap", () => expect(tax({ taxableOrdinaryIncome: 1_100_000 })).toMatchObject({ taxBeforeRebate: 50_000, rebate: 50_000, marginalRelief: 0, taxAfterRelief: 0, totalTax: 0 }));
  it("applies the full new-regime rebate at ₹12 lakh", () => expect(tax({ taxableOrdinaryIncome: 1_200_000 })).toMatchObject({ taxBeforeRebate: 60_000, rebate: 60_000, marginalRelief: 0, taxAfterRelief: 0, totalTax: 0 }));
  it.each([
    [1_200_001, 60_000.15, 60_000.15 - 1, 1, 0.04, 1.04],
    [1_200_100, 60_015, 59_915, 100, 4, 104],
    [1_250_000, 67_500, 17_500, 50_000, 2_000, 52_000],
    [1_270_588, 70_588.2, 0.2, 70_588, 2_823.52, 73_411.52],
  ])("applies section 156 marginal relief at ₹%i before cess", (income, taxBeforeRebate, marginalRelief, taxAfterRelief, cess, totalTax) => { const result = tax({ taxableOrdinaryIncome: income }); expect(result.rebate).toBe(0); expect(result.taxBeforeRebate).toBeCloseTo(taxBeforeRebate, 8); expect(result.marginalRelief).toBeCloseTo(marginalRelief, 8); expect(result.taxAfterRelief).toBeCloseTo(taxAfterRelief, 8); expect(result.cess).toBeCloseTo(cess, 8); expect(result.totalTax).toBeCloseTo(totalTax, 8); });
  it.each([[1_270_589, 70_588.35], [1_300_000, 75_000]])("ceases marginal relief at and beyond ₹%i", (income, taxAfterRelief) => expect(tax({ taxableOrdinaryIncome: income })).toMatchObject({ marginalRelief: 0, taxAfterRelief }));
  it("applies 4% cess after marginal relief ceases", () => expect(tax({ taxableOrdinaryIncome: 1_300_000 })).toMatchObject({ taxAfterRelief: 75_000, cess: 3_000, totalTax: 78_000 }));
  it("uses below-60 old-regime slabs", () => expect(tax({ regime: "old", taxableOrdinaryIncome: 1_100_000 }).taxBeforeRebate).toBe(142_500));
  it("uses senior old-regime slabs", () => expect(tax({ regime: "old", ageCategory: "60-to-below-80", taxableOrdinaryIncome: 600_000 }).taxBeforeRebate).toBe(30_000));
  it("uses super-senior old-regime slabs", () => expect(tax({ regime: "old", ageCategory: "80-or-above", taxableOrdinaryIncome: 600_000 }).taxBeforeRebate).toBe(20_000));
  it.each([
    ["below-60", 250_000, 0], ["below-60", 250_001, 0.05],
    ["60-to-below-80", 300_000, 0], ["60-to-below-80", 300_001, 0.05],
    ["80-or-above", 500_000, 0], ["80-or-above", 500_001, 0.2],
  ] as const)("respects the %s old-regime threshold at ₹%i", (ageCategory, taxableOrdinaryIncome, taxBeforeRebate) => expect(tax({ regime: "old", ageCategory, taxableOrdinaryIncome }).taxBeforeRebate).toBeCloseTo(taxBeforeRebate, 8));
  it.each([
    ["below-60", 249_999, 0], ["below-60", 250_000, 0], ["below-60", 250_001, 0.05], ["below-60", 499_999, 12_499.95], ["below-60", 500_000, 12_500], ["below-60", 500_001, 12_500.2], ["below-60", 999_999, 112_499.8], ["below-60", 1_000_000, 112_500], ["below-60", 1_000_001, 112_500.3],
    ["60-to-below-80", 299_999, 0], ["60-to-below-80", 300_000, 0], ["60-to-below-80", 300_001, 0.05], ["60-to-below-80", 499_999, 9_999.95], ["60-to-below-80", 500_000, 10_000], ["60-to-below-80", 500_001, 10_000.2], ["60-to-below-80", 999_999, 109_999.8], ["60-to-below-80", 1_000_000, 110_000], ["60-to-below-80", 1_000_001, 110_000.3],
    ["80-or-above", 499_999, 0], ["80-or-above", 500_000, 0], ["80-or-above", 500_001, 0.2], ["80-or-above", 999_999, 99_999.8], ["80-or-above", 1_000_000, 100_000], ["80-or-above", 1_000_001, 100_000.3],
  ] as const)("checks every %s old-regime slab edge at ₹%i", (ageCategory, taxableOrdinaryIncome, taxBeforeRebate) => expect(tax({ regime: "old", ageCategory, taxableOrdinaryIncome }).taxBeforeRebate).toBeCloseTo(taxBeforeRebate, 8));
  it("applies the old-regime rebate through ₹5 lakh", () => expect(tax({ regime: "old", taxableOrdinaryIncome: 500_000 })).toMatchObject({ taxBeforeRebate: 12_500, rebate: 12_500, totalTax: 0 }));
  it("ends the old-regime rebate immediately above ₹5 lakh and applies cess afterward", () => {
    const result = tax({ regime: "old", taxableOrdinaryIncome: 500_001 });
    expect(result.rebate).toBe(0);
    expect(result.taxAfterRelief).toBeCloseTo(12_500.2, 8);
    expect(result.cess).toBeCloseTo(500.008, 8);
    expect(result.totalTax).toBeCloseTo(13_000.208, 8);
  });
  it("ignores age category under the new regime", () => { const values = (["below-60", "60-to-below-80", "80-or-above"] as const).map((ageCategory) => tax({ ageCategory, taxableOrdinaryIncome: 1_500_000 }).totalTax); expect(new Set(values).size).toBe(1); });
  it("rejects income above ₹50 lakh", () => expect(() => tax({ taxableOrdinaryIncome: 5_000_001 })).toThrow(/up to 5000000/));
  it("accepts income exactly at the ₹50 lakh scope ceiling", () => expect(tax({ taxableOrdinaryIncome: 5_000_000 }).taxableIncome).toBe(5_000_000));
  it("rejects an invalid regime", () => expect(() => tax({ regime: "invalid" as never })).toThrow(/regime/));
  it("rejects an invalid age category", () => expect(() => tax({ ageCategory: "invalid" as never })).toThrow(/Age category/));
  it("rejects NaN and Infinity", () => { expect(() => tax({ taxableOrdinaryIncome: Number.NaN })).toThrow(/finite/); expect(() => tax({ taxableOrdinaryIncome: Infinity })).toThrow(/finite/); });
  it("reconciles the breakdown with slab tax", () => { const result = tax({ taxableOrdinaryIncome: 3_250_000 }); expect(result.breakdown.reduce((sum, row) => sum + row.tax, 0)).toBe(result.taxBeforeRebate); });
});

describe("GST calculator", () => {
  const gst = (overrides = {}) => calculateGst({ mode: "exclusive" as const, transactionType: "intra-state" as const, amount: 1000, gstRate: 18, ...overrides }, gstRuleSet);
  it("handles a zero rate", () => expect(gst({ gstRate: 0 })).toMatchObject({ taxableValue: 1000, totalGst: 0, invoiceTotal: 1000 }));
  it.each([[5, 50, 1050], [18, 180, 1180], [12, 120, 1120], [28, 280, 1280]])("adds %i%% GST to an exclusive amount", (gstRate, totalGst, invoiceTotal) => expect(gst({ gstRate })).toMatchObject({ totalGst, invoiceTotal }));
  it("removes GST from an inclusive amount", () => expect(gst({ mode: "inclusive", amount: 1180 })).toMatchObject({ taxableValue: 1000, totalGst: 180, invoiceTotal: 1180 }));
  it("reconciles exclusive and inclusive calculations", () => { const exclusive = gst({ amount: 1234.56, gstRate: 17.25 }); const inclusive = gst({ mode: "inclusive", amount: exclusive.invoiceTotal, gstRate: 17.25 }); expect(inclusive.taxableValue).toBeCloseTo(exclusive.taxableValue, 10); expect(inclusive.totalGst).toBeCloseTo(exclusive.totalGst, 10); });
  it("splits intra-state GST equally", () => { const result = gst(); expect(result.cgst + result.sgst).toBe(result.totalGst); expect(result.igst).toBe(0); });
  it("assigns all inter-state GST to IGST", () => expect(gst({ transactionType: "inter-state" })).toMatchObject({ cgst: 0, sgst: 0, igst: 180, totalGst: 180 }));
  it("supports an odd custom percentage without intermediate rounding", () => { const result = gst({ amount: 999.99, gstRate: 7.123 }); expect(result.totalGst).toBe(999.99 * 7.123 / 100); expect(result.cgst).toBe(result.totalGst / 2); });
  it("handles zero amount", () => expect(gst({ amount: 0 })).toMatchObject({ taxableValue: 0, totalGst: 0, invoiceTotal: 0 }));
  it("rejects negative amounts and invalid rates", () => { expect(() => gst({ amount: -1 })).toThrow(); expect(() => gst({ gstRate: 100.01 })).toThrow(); });
  it("rejects non-finite values", () => { expect(() => gst({ amount: Number.NaN })).toThrow(/finite/); expect(() => gst({ gstRate: Infinity })).toThrow(/finite/); });
  it("rejects invalid mode and transaction type", () => { expect(() => gst({ mode: "invalid" })).toThrow(/mode/); expect(() => gst({ transactionType: "invalid" })).toThrow(/transaction type/); });
});

describe("EPF calculator", () => {
  const epf = (overrides = {}) => calculateEpf({ monthlyEpfWage: 15_000, currentEpfBalance: 0, employeeContributionRate: 12, employerContributionRate: 12, annualInterestRate: 0, projectionYears: 1, epsEligible: true, ...overrides }, epfRuleSet);
  it("calculates the standard 12% employee and employer totals", () => expect(epf()).toMatchObject({ monthlyEmployeeEpf: 1800, monthlyEmployerTotal: 1800 }));
  it("diverts 8.33% of eligible wage to EPS", () => expect(epf().monthlyEmployerEps).toBeCloseTo(1249.5, 10));
  it("caps EPS eligible wage at ₹15,000", () => expect(epf({ monthlyEpfWage: 30_000 }).monthlyEmployerEps).toBeCloseTo(1249.5, 10));
  it("uses actual wage below the EPS ceiling", () => expect(epf({ monthlyEpfWage: 10_000 }).monthlyEmployerEps).toBeCloseTo(833, 10));
  it("sends the full employer contribution to EPF when EPS is disabled", () => expect(epf({ epsEligible: false })).toMatchObject({ monthlyEmployerTotal: 1800, monthlyEmployerEpf: 1800, monthlyEmployerEps: 0 }));
  it("handles zero wage and zero opening balance", () => expect(epf({ monthlyEpfWage: 0 })).toMatchObject({ closingBalance: 0, estimatedGrowth: 0 }));
  it("handles zero interest for one year", () => { const result = epf(); expect(result.closingBalance).toBe(result.totalEmployeeEpfContributions + result.totalEmployerEpfContributions); expect(result.estimatedGrowth).toBe(0); });
  it("projects multiple years with beginning-of-month contributions", () => expect(epf({ annualInterestRate: 8.25, projectionYears: 5 }).closingBalance).toBeGreaterThan(epf({ annualInterestRate: 0, projectionYears: 5 }).closingBalance));
  it("reconciles employer EPF and EPS with the employer total", () => { const result = epf({ monthlyEpfWage: 25_000 }); expect(result.monthlyEmployerEpf + result.monthlyEmployerEps).toBe(result.monthlyEmployerTotal); });
  it("caps EPS at zero when no modeled employer contribution is available", () => expect(epf({ employerContributionRate: 0 })).toMatchObject({ monthlyEmployerTotal: 0, monthlyEmployerEpf: 0, monthlyEmployerEps: 0 }));
  it("caps EPS at a modeled employer contribution below the usual candidate", () => { const result = epf({ employerContributionRate: 5 }); expect(result.monthlyEmployerEps).toBe(result.monthlyEmployerTotal); expect(result.monthlyEmployerEpf).toBe(0); });
  it.each([10_000, 15_000, 30_000])("reconciles the employer allocation at wage %s", (monthlyEpfWage) => { const result = epf({ monthlyEpfWage }); expect(result.monthlyEmployerEpf + result.monthlyEmployerEps).toBeCloseTo(result.monthlyEmployerTotal, 10); });
  it("excludes EPS diversion from the EPF closing balance", () => { const enabled = epf(); const disabled = epf({ epsEligible: false }); expect(disabled.closingBalance - enabled.closingBalance).toBeCloseTo(enabled.totalEpsDiversion, 8); });
  it("rejects invalid rates and years", () => { expect(() => epf({ employeeContributionRate: -1 })).toThrow(); expect(() => epf({ projectionYears: 0 })).toThrow(); expect(() => epf({ projectionYears: 1.5 })).toThrow(/whole number/); });
  it("rejects NaN and Infinity", () => { expect(() => epf({ monthlyEpfWage: Number.NaN })).toThrow(/finite/); expect(() => epf({ annualInterestRate: Infinity })).toThrow(/finite/); });
});

describe("NPS calculator", () => {
  const nps = (overrides = {}) => calculateNps({ currentAge: 30, retirementAge: 31, currentCorpus: 0, monthlyContribution: 1000, annualReturnRate: 0, annualContributionIncrease: 0, annuityAllocation: 40, assumedAnnuityRate: 6, ...overrides }, npsRuleSet);
  it("handles zero current corpus", () => expect(nps().startingCorpus).toBe(0));
  it("compounds a current corpus with zero contributions", () => expect(nps({ currentCorpus: 100_000, monthlyContribution: 0, annualReturnRate: 12 }).retirementCorpus).toBeGreaterThan(100_000));
  it("handles zero return without rounding", () => expect(nps()).toMatchObject({ totalContributions: 12_000, estimatedGrowth: 0, retirementCorpus: 12_000 }));
  it("uses a 40% annuity allocation", () => expect(nps()).toMatchObject({ annuityCorpus: 4800, lumpSumCorpus: 7200 }));
  it("accepts a 20% annuity allocation and reconciles the 80% lump sum", () => { const result = nps({ annuityAllocation: 20 }); expect(result).toMatchObject({ annuityCorpus: 2400, lumpSumCorpus: 9600 }); expect(result.annuityCorpus + result.lumpSumCorpus).toBe(result.retirementCorpus); });
  it("supports a higher annuity allocation", () => expect(nps({ annuityAllocation: 75 })).toMatchObject({ annuityCorpus: 9000, lumpSumCorpus: 3000 }));
  it("steps contributions only after 12 completed months", () => expect(nps({ retirementAge: 32, annualContributionIncrease: 10 })).toMatchObject({ totalContributions: 25_200, finalMonthlyContribution: 1100 }));
  it("reconciles lump sum and annuity to corpus", () => { const result = nps({ currentCorpus: 12_345, annualReturnRate: 9.5 }); expect(result.lumpSumCorpus + result.annuityCorpus).toBe(result.retirementCorpus); });
  it("reconciles annual and monthly annuity estimates", () => { const result = nps(); expect(result.estimatedMonthlyAnnuity * 12).toBe(result.estimatedAnnualAnnuity); expect(result.estimatedAnnualAnnuity).toBe(result.annuityCorpus * result.assumedAnnuityRate / 100); });
  it("requires retirement age greater than current age", () => expect(() => nps({ retirementAge: 30 })).toThrow(/greater than/));
  it("accepts retirement at 85 and rejects retirement above 85", () => { expect(nps({ currentAge: 84, retirementAge: 85 }).yearsUntilRetirement).toBe(1); expect(() => nps({ retirementAge: 86 })).toThrow(); });
  it("rejects annuity allocation outside 20% to 100%", () => { expect(() => nps({ annuityAllocation: 19.99 })).toThrow(); expect(() => nps({ annuityAllocation: 100.01 })).toThrow(); });
  it("rejects negative values", () => expect(() => nps({ monthlyContribution: -1 })).toThrow());
  it("rejects NaN and Infinity", () => { expect(() => nps({ currentCorpus: Number.NaN })).toThrow(/finite/); expect(() => nps({ annualReturnRate: Infinity })).toThrow(/finite/); });
  it("retains full precision through accumulation", () => { const result = nps({ monthlyContribution: 1234.56, annualReturnRate: 7.89 }); expect(result.retirementCorpus).not.toBe(Math.round(result.retirementCorpus)); });
});
