import { describe, expect, it } from "vitest";
import { calculateSip } from "../../lib/calculator/sip-calculator";

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
