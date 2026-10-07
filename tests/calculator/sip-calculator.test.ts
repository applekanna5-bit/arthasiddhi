import { describe, expect, it } from "vitest";
import { calculateSip, calculateSipFromFormValues, type SipInput } from "../../lib/calculator/sip-calculator";

describe("SIP calculator form boundary", () => {
  const defaults = { monthlyInvestment: "5000", annualReturnRate: "12", investmentYears: "10" };
  const fields = [
    ["monthlyInvestment", "Monthly investment"],
    ["annualReturnRate", "Expected annual return"],
    ["investmentYears", "Investment period"],
  ] as const;

  it.each(fields.flatMap(([field, label]) => ["", "   "].map((value) => ({ field, label, value }))))(
    "rejects required $field containing '$value' before numeric conversion",
    ({ field, label, value }) => {
      expect(() => calculateSipFromFormValues({ ...defaults, [field]: value })).toThrow(`${label} is required.`);
    }
  );

  it.each(fields.flatMap(([field]) => ["-", ".", "1e"].map((value) => ({ field, value }))))(
    "does not return a result for incomplete $field '$value'",
    ({ field, value }) => {
      expect(() => calculateSipFromFormValues({ ...defaults, [field]: value })).toThrow(/finite/);
    }
  );

  it.each(fields)("preserves explicit zero for %s where the existing model allows it", (field) => {
    const numeric = { monthlyInvestment: 5000, annualReturnRate: 12, investmentYears: 10, [field]: 0 };
    expect(calculateSipFromFormValues({ ...defaults, [field]: "0" })).toEqual(calculateSip(numeric));
  });

  it("keeps explicit zero return distinct from a missing return", () => {
    expect(calculateSipFromFormValues({ ...defaults, annualReturnRate: "0" })).toEqual({ totalInvested: 600000, estimatedReturns: 0, futureValue: 600000 });
    expect(() => calculateSipFromFormValues({ ...defaults, annualReturnRate: "" })).toThrow(/required/);
  });

  it.each([
    ["monthlyInvestment", "-1", /at least 0/],
    ["monthlyInvestment", "100000001", /up to 100000000/],
    ["annualReturnRate", "-1", /at least 0/],
    ["annualReturnRate", "101", /up to 100/],
    ["investmentYears", "-1", /at least 0/],
    ["investmentYears", "101", /up to 100/],
  ] satisfies [keyof SipInput, string, RegExp][])("preserves model rejection for %s = %s", (field, value, message) => {
    expect(() => calculateSipFromFormValues({ ...defaults, [field]: value })).toThrow(message);
  });

  it("preserves the normal calculation including unrounded precision", () => {
    expect(calculateSipFromFormValues(defaults)).toEqual(calculateSip({ monthlyInvestment: 5000, annualReturnRate: 12, investmentYears: 10 }));
  });
});

describe("SIP calculator", () => {
  it("calculates monthly-compounded returns for a standard SIP", () => {
    const result = calculateSip({ monthlyInvestment: 5000, annualReturnRate: 12, investmentYears: 10 });
    expect(result.totalInvested).toBe(600000);
    expect(result.futureValue).toBeCloseTo(1_161_695.38, 2);
    expect(result.estimatedReturns).toBeCloseTo(561_695.38, 2);
  });

  it("handles zero investment and zero return without rounding internally", () => {
    expect(calculateSip({ monthlyInvestment: 0, annualReturnRate: 12, investmentYears: 10 })).toEqual({ totalInvested: 0, estimatedReturns: 0, futureValue: 0 });
    expect(calculateSip({ monthlyInvestment: 1000, annualReturnRate: 0, investmentYears: 1 })).toEqual({ totalInvested: 12000, estimatedReturns: 0, futureValue: 12000 });
  });

  it("handles short and long investment periods", () => {
    expect(calculateSip({ monthlyInvestment: 1000, annualReturnRate: 12, investmentYears: 1 }).futureValue).toBeCloseTo(12_809.33, 2);
    expect(calculateSip({ monthlyInvestment: 1000, annualReturnRate: 12, investmentYears: 40 }).futureValue).toBeGreaterThan(10_000_000);
  });

  it("rejects invalid and out-of-bound inputs", () => {
    expect(() => calculateSip({ monthlyInvestment: NaN, annualReturnRate: 12, investmentYears: 1 })).toThrow(/finite/);
    expect(() => calculateSip({ monthlyInvestment: 1000, annualReturnRate: -1, investmentYears: 1 })).toThrow(/at least 0/);
    expect(() => calculateSip({ monthlyInvestment: 1000, annualReturnRate: 10, investmentYears: 101 })).toThrow(/up to 100/);
  });
});
