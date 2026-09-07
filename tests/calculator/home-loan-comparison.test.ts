import { describe, expect, it } from "vitest";
import { calculateFromFormValues } from "../../lib/calculator/loan-calculator";
import { calculateAlternative, compareLoanResults, selectLoanSchedule } from "../../lib/calculator/home-loan-comparison";

const values = { principal: "5000000", annualInterestRate: "8.5", tenureYears: "20" };
const current = calculateFromFormValues(values);

describe("Home Loan comparison mathematics", () => {
  it("starts with identical scenarios and exact zero differences", () => {
    const alternative = calculateAlternative(values.principal, values);
    expect(alternative.result).toEqual(current);
    expect(compareLoanResults(current, alternative.result)).toEqual({ monthlyEmi: 0, totalInterest: 0, totalPayment: 0, tenureMonths: 0 });
  });

  it("lowers EMI and increases interest with a longer tenure at the same positive rate", () => {
    const alternative = calculateAlternative(values.principal, { ...values, tenureYears: "25" });
    const difference = compareLoanResults(current, alternative.result)!;
    expect(difference.monthlyEmi).toBeLessThan(0);
    expect(difference.totalInterest).toBeGreaterThan(0);
    expect(difference.totalPayment).toBeGreaterThan(0);
    expect(difference.tenureMonths).toBe(60);
  });

  it("increases EMI and interest with a higher rate at the same tenure", () => {
    const alternative = calculateAlternative(values.principal, { ...values, annualInterestRate: "9" });
    const difference = compareLoanResults(current, alternative.result)!;
    expect(difference.monthlyEmi).toBeGreaterThan(0);
    expect(difference.totalInterest).toBeGreaterThan(0);
    expect(difference.tenureMonths).toBe(0);
  });

  it("preserves zero interest across different tenures", () => {
    const baseline = calculateFromFormValues({ ...values, annualInterestRate: "0" });
    const alternative = calculateAlternative(values.principal, { annualInterestRate: "0", tenureYears: "25" });
    expect(baseline.totalInterest).toBe(0);
    expect(alternative.result!.totalInterest).toBe(0);
    expect(compareLoanResults(baseline, alternative.result)).toMatchObject({ totalInterest: 0, totalPayment: 0, tenureMonths: 60 });
  });

  it("supports a zero-rate baseline against positive interest", () => {
    const baseline = calculateFromFormValues({ ...values, annualInterestRate: "0" });
    const difference = compareLoanResults(baseline, current)!;
    expect(difference.monthlyEmi).toBeGreaterThan(0);
    expect(difference.totalInterest).toBe(current.totalInterest);
  });

  it.each(["-1", "101", "NaN", "Infinity", "", " "])("withholds invalid alternative rate %j without changing the baseline", (annualInterestRate) => {
    const alternative = calculateAlternative(values.principal, { ...values, annualInterestRate });
    expect(alternative.error).toBeTruthy();
    expect(alternative.result).toBeNull();
    expect(compareLoanResults(current, alternative.result)).toBeNull();
    expect(current).toEqual(calculateFromFormValues(values));
    expect(selectLoanSchedule(current, alternative.result, "current")).toBe(current.amortizationSchedule);
  });

  it.each(["0", "-1", "50.5", "0.1", ""])("preserves validation for invalid tenure %j", (tenureYears) => {
    expect(calculateAlternative(values.principal, { ...values, tenureYears }).error).toBeTruthy();
  });

  it("supports half-year tenures and the existing 50-year modeling boundary", () => {
    expect(calculateAlternative(values.principal, { ...values, tenureYears: "20.5" }).result!.amortizationSchedule).toHaveLength(246);
    expect(calculateAlternative(values.principal, { ...values, tenureYears: "50" }).result!.amortizationSchedule).toHaveLength(600);
  });

  it("subtracts raw results rather than rounded displayed amounts", () => {
    const alternative = calculateAlternative(values.principal, { ...values, annualInterestRate: "9.01" }).result!;
    const difference = compareLoanResults(current, alternative)!;
    for (const key of ["monthlyEmi", "totalInterest", "totalPayment"] as const) {
      expect(difference[key]).toBe(alternative[key] - current[key]);
      expect(difference[key]).not.toBe(Number(alternative[key].toFixed(2)) - Number(current[key].toFixed(2)));
    }
  });

  it("uses the shared principal even if a caller supplies a stale alternative principal", () => {
    const alternative = calculateAlternative("1000000", values).result!;
    expect(alternative).toEqual(calculateFromFormValues({ ...values, principal: "1000000" }));
  });

  it("selects the requested schedule and never substitutes stale rows for an invalid scenario", () => {
    const alternative = calculateAlternative(values.principal, { ...values, tenureYears: "25" }).result!;
    expect(selectLoanSchedule(current, alternative, "current")).toBe(current.amortizationSchedule);
    expect(selectLoanSchedule(current, alternative, "comparison")).toBe(alternative.amortizationSchedule);
    expect(selectLoanSchedule(current, null, "comparison")).toEqual([]);
    expect(selectLoanSchedule(null, alternative, "comparison")).toBe(alternative.amortizationSchedule);
    expect(compareLoanResults(null, alternative)).toBeNull();
  });
});
