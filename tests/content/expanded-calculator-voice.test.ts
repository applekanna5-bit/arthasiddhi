import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("components/calculator/ExpandedCalculator.tsx", "utf8");

describe("Batch B2 expanded calculator voice", () => {
  it("removes shared interface narration", () => {
    expect(source).not.toContain("Update any value to recalculate instantly.");
  });

  it("keeps the PPF rate-change meaning in the input hint", () => {
    expect(source).toContain("Enter the rate for this projection. Government-notified PPF rates can change.");
    expect(source).not.toContain("PPF interest rates are periodically notified by the Government and can change.");
  });

  it("retains the RD beginning-of-month explanation", () => {
    expect(source).toContain("Each monthly deposit is assumed at the beginning of the month");
  });

  it("explains CAGR as a constant rate rather than an actual yearly return", () => {
    expect(source).toContain("CAGR uses one constant annualised rate");
    expect(source).toContain("It does not mean the value changed by that rate in every individual year.");
  });

  it("binds the step-up SIP interpretation to contribution, growth and final value", () => {
    expect(source).toContain("you contribute ${formatIndianCurrency(result.totalInvested)} in total");
    expect(source).toContain("projected growth adds ${formatIndianCurrency(result.estimatedReturns)}");
    expect(source).toContain("taking the final value to ${formatIndianCurrency(result.futureValue)}");
  });

  it("keeps the gratuity legal-eligibility boundary", () => {
    expect(source).toContain("This result does not establish legal eligibility or limit better terms");
    expect(source).toContain("statutory estimate after the");
  });

  it("uses the accurate SWP month label and constant-return limitation", () => {
    expect(source).toContain('label: "Months with a withdrawal"');
    expect(source).not.toContain('label: "Withdrawals completed"');
    expect(source).toContain("This model uses one constant return. Actual returns vary");
    expect(source).not.toContain("sequence of returns");
  });

  it("includes both SWP interpretation branches", () => {
    expect(source).toContain("The corpus is exhausted before the chosen tenure");
    expect(source).toContain("The model makes withdrawals in ${formatNumber(result.withdrawalsCompleted)} months");
  });

  it("uses mode-specific inflation labels with the stable currentValue field", () => {
    expect(source).toContain('field.id === "currentValue"');
    expect(source).toContain('"Current cost (INR)"');
    expect(source).toContain('"Current amount (INR)"');
  });

  it("includes both inflation interpretations", () => {
    expect(source).toContain("a cost of ${formatIndianCurrency(result.currentValue)} becomes about");
    expect(source).toContain("has estimated purchasing power of ${formatIndianCurrency(result.estimatedValue)} later");
  });

  it("uses one coherent polite live region for expanded results", () => {
    expect(source.match(/aria-live="polite"/g)).toHaveLength(1);
  });
});
