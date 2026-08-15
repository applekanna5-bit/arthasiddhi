import { describe, expect, it } from "vitest";
import { calculateLoanDetails } from "../../lib/engine/loan";
import {
  calculateFromFormValues,
  formatIndianCurrency,
} from "../../lib/calculator/loan-calculator";

describe("Loan calculator UI integration", () => {
  it("converts tenure years to months and delegates results to the engine", () => {
    const formResult = calculateFromFormValues({
      principal: "2500000",
      annualInterestRate: "8.5",
      tenureYears: "20",
    });
    const engineResult = calculateLoanDetails({
      principal: 2500000,
      annualInterestRate: 8.5,
      tenureMonths: 240,
    });

    expect(formResult).toEqual(engineResult);
  });

  it("surfaces the frozen engine validation messages", () => {
    expect(() =>
      calculateFromFormValues({
        principal: "0",
        annualInterestRate: "8.5",
        tenureYears: "20",
      })
    ).toThrow(/Principal must be greater than 0/);
  });

  it("formats INR values with Indian digit grouping without changing values", () => {
    expect(formatIndianCurrency(1234567.89)).toBe("₹12,34,567.89");
  });
});
