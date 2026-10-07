import { describe, expect, it } from "vitest";
import { calculateLoanDetails } from "../../lib/engine/loan";
import {
  calculateFromFormValues,
  formatIndianCurrency,
  type CalculatorFormValues,
} from "../../lib/calculator/loan-calculator";

describe("Loan calculator UI integration", () => {
  const defaults = { principal: "2500000", annualInterestRate: "8.5", tenureYears: "20" };
  const fields = [
    ["principal", "Loan amount"],
    ["annualInterestRate", "Annual interest rate"],
    ["tenureYears", "Loan tenure"],
  ] as const;

  it.each(fields.flatMap(([field, label]) => ["", "   "].map((value) => ({ field, label, value }))))(
    "rejects required $field containing '$value' before numeric conversion",
    ({ field, label, value }) => {
      expect(() => calculateFromFormValues({ ...defaults, [field]: value })).toThrow(`${label} is required.`);
    }
  );

  it.each(fields.flatMap(([field]) => ["-", ".", "1e"].map((value) => ({ field, value }))))(
    "does not return a result for incomplete $field '$value'",
    ({ field, value }) => {
      expect(() => calculateFromFormValues({ ...defaults, [field]: value })).toThrow(/finite/);
    }
  );

  it("preserves explicitly entered zero interest", () => {
    const result = calculateFromFormValues({ ...defaults, annualInterestRate: "0" });
    expect(result).toEqual(calculateLoanDetails({ principal: 2500000, annualInterestRate: 0, tenureMonths: 240 }));
    expect(result.totalInterest).toBe(0);
  });

  it.each([
    ["principal", "0", /Principal must be greater than 0/],
    ["principal", "10000000001", /Principal must be greater than 0/],
    ["annualInterestRate", "-1", /Interest rate must be between/],
    ["annualInterestRate", "101", /Interest rate must be between/],
    ["tenureYears", "0", /Tenure must be a positive integer/],
    ["tenureYears", "51", /Tenure must be a positive integer/],
    ["tenureYears", "0.01", /Tenure must be a positive integer/],
  ] satisfies [keyof CalculatorFormValues, string, RegExp][])(
    "preserves the engine rejection for %s = %s",
    (field, value, message) => {
      expect(() => calculateFromFormValues({ ...defaults, [field]: value })).toThrow(message);
    }
  );

  it.each([
    ["Home Loan", "5000000", "8.5", "20"],
    ["Personal Loan", "300000", "12", "3"],
    ["Car Loan", "800000", "9", "5"],
  ])("preserves %s defaults through the shared boundary", (_route, principal, annualInterestRate, tenureYears) => {
    expect(calculateFromFormValues({ principal, annualInterestRate, tenureYears })).toEqual(
      calculateLoanDetails({ principal: Number(principal), annualInterestRate: Number(annualInterestRate), tenureMonths: Number(tenureYears) * 12 })
    );
  });

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
