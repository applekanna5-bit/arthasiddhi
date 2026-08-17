import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readSource = (path: string) => readFileSync(path, "utf8");

describe("Batch B1 calculator voice", () => {
  const loan = readSource("components/calculator/LoanCalculator.tsx");
  const sip = readSource("components/calculator/SipCalculator.tsx");
  const fd = readSource("components/calculator/FdCalculator.tsx");

  it("removes redundant recalculation narration", () => {
    for (const source of [loan, sip, fd]) {
      expect(source).not.toContain("Update any value to recalculate instantly.");
    }
  });

  it("states the SIP contribution timing correctly", () => {
    expect(sip).toContain("Monthly contributions are assumed at the beginning of each month.");
    expect(sip).not.toContain("Monthly contributions are assumed at the end of each month.");
  });

  it("binds the loan interpretation to the current EMI and total interest", () => {
    expect(loan).toContain("The monthly EMI is {formatIndianCurrency(calculation.result.monthlyEmi)}.");
    expect(loan).toContain("total interest comes to {formatIndianCurrency(calculation.result.totalInterest)}.");
  });

  it("binds the SIP interpretation to all three existing result values", () => {
    expect(sip).toContain("You invest {formatIndianCurrency(calculation.result.totalInvested)} over the period.");
    expect(sip).toContain("projected growth adds {formatIndianCurrency(calculation.result.estimatedReturns)}");
    expect(sip).toContain("taking the value to {formatIndianCurrency(calculation.result.futureValue)}.");
  });

  it("binds the FD interpretation to principal, interest and maturity", () => {
    expect(fd).toContain("Your {formatIndianCurrency(calculation.result.principal)} deposit earns {formatIndianCurrency(calculation.result.interestEarned)} in interest");
    expect(fd).toContain("taking the maturity amount to {formatIndianCurrency(calculation.result.maturityAmount)}.");
  });

  it("keeps one live result region in each shared calculator", () => {
    for (const source of [loan, sip, fd]) {
      expect(source.match(/aria-live="polite"/g)).toHaveLength(1);
    }
  });
});
