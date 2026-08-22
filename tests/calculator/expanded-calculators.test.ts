import { describe, expect, it } from "vitest";
import { calculateSip } from "../../lib/calculator/sip-calculator";
import { calculateCagr, calculateGratuity, calculateInflation, calculateLumpsum, calculatePpf, calculateRd, calculateStepUpSip, calculateSwp } from "../../lib/calculator/expanded-calculators";
import { gratuityRuleSet } from "../../lib/financial-rules/rule-sets";

describe("PPF calculator", () => {
  it("accumulates annual beginning contributions", () => { const result = calculatePpf({ annualContribution: 150000, annualInterestRate: 7.1, tenureYears: 15 }); expect(result.totalContribution).toBe(2250000); expect(result.maturityAmount).toBeCloseTo(4_068_209.22, 2); expect(result.schedule).toHaveLength(15); });
  it("handles zero rate", () => expect(calculatePpf({ annualContribution: 1000, annualInterestRate: 0, tenureYears: 2 }).maturityAmount).toBe(2000));
  it("handles zero contribution", () => expect(calculatePpf({ annualContribution: 0, annualInterestRate: 7, tenureYears: 15 }).maturityAmount).toBe(0));
  it("handles a one-year tenure", () => expect(calculatePpf({ annualContribution: 1000, annualInterestRate: 10, tenureYears: 1 }).maturityAmount).toBeCloseTo(1100));
  it("rejects invalid tenure", () => expect(() => calculatePpf({ annualContribution: 1000, annualInterestRate: 7, tenureYears: 0 })).toThrow());
  it("accepts the inclusive amount, rate, and year upper limits", () => { const result = calculatePpf({ annualContribution: 100_000_000_000, annualInterestRate: 100, tenureYears: 100 }); expect(result.schedule).toHaveLength(100); expect(Number.isFinite(result.maturityAmount)).toBe(true); });
  it("rejects a fractional tenure", () => expect(() => calculatePpf({ annualContribution: 1000, annualInterestRate: 7, tenureYears: 1.5 })).toThrow(/whole number/));
  it("keeps every schedule row reconciled with the result", () => {
    const result = calculatePpf({ annualContribution: 1000, annualInterestRate: 10, tenureYears: 3 });
    result.schedule.forEach((row, index) => {
      expect(row.openingBalance).toBe(index === 0 ? 0 : result.schedule[index - 1].closingBalance);
      expect(row.closingBalance).toBeCloseTo(row.openingBalance + row.contribution + row.interest, 10);
    });
    expect(result.schedule.at(-1)?.closingBalance).toBe(result.maturityAmount);
    expect(result.schedule.reduce((sum, row) => sum + row.contribution, 0)).toBe(result.totalContribution);
  });
});

describe("RD calculator", () => {
  it("calculates beginning-of-month recurring deposits", () => { const result = calculateRd({ monthlyDeposit: 5000, annualInterestRate: 7, tenureYears: 5 }); expect(result.totalDeposits).toBe(300000); expect(result.maturityAmount).toBeCloseTo(360_052.63, 2); });
  it("handles zero rate", () => { const result = calculateRd({ monthlyDeposit: 1000, annualInterestRate: 0, tenureYears: 2 }); expect(result.maturityAmount).toBe(24000); expect(result.interestEarned).toBe(0); });
  it("handles zero deposit", () => expect(calculateRd({ monthlyDeposit: 0, annualInterestRate: 7, tenureYears: 5 }).maturityAmount).toBe(0));
  it("supports a long tenure", () => expect(calculateRd({ monthlyDeposit: 1000, annualInterestRate: 8, tenureYears: 40 }).maturityAmount).toBeGreaterThan(2_000_000));
  it("rejects invalid values", () => expect(() => calculateRd({ monthlyDeposit: -1, annualInterestRate: 7, tenureYears: 5 })).toThrow());
  it("rejects a fractional tenure", () => expect(() => calculateRd({ monthlyDeposit: 1000, annualInterestRate: 7, tenureYears: 1.5 })).toThrow(/whole number/));
});

describe("lumpsum calculator", () => {
  it("compounds a normal investment", () => expect(calculateLumpsum({ initialInvestment: 100000, annualReturnRate: 12, investmentYears: 10 }).futureValue).toBeCloseTo(310_584.82, 2));
  it("handles zero return", () => expect(calculateLumpsum({ initialInvestment: 100000, annualReturnRate: 0, investmentYears: 10 }).futureValue).toBe(100000));
  it("handles zero principal", () => expect(calculateLumpsum({ initialInvestment: 0, annualReturnRate: 12, investmentYears: 10 })).toEqual({ investedAmount: 0, estimatedGain: 0, futureValue: 0 }));
  it("rejects invalid duration", () => expect(() => calculateLumpsum({ initialInvestment: 1000, annualReturnRate: 10, investmentYears: 0 })).toThrow());
  it("rejects a fractional investment period", () => expect(() => calculateLumpsum({ initialInvestment: 1000, annualReturnRate: 10, investmentYears: 1.5 })).toThrow(/whole number/));
});

describe("CAGR calculator", () => {
  it("calculates positive growth", () => expect(calculateCagr({ beginningValue: 100, endingValue: 200, durationYears: 5 }).cagrPercentage).toBeCloseTo(14.8698, 4));
  it("handles flat value", () => expect(calculateCagr({ beginningValue: 100, endingValue: 100, durationYears: 5 }).cagrPercentage).toBe(0));
  it("handles a loss", () => expect(calculateCagr({ beginningValue: 100, endingValue: 50, durationYears: 5 }).cagrPercentage).toBeLessThan(0));
  it("supports an ending value of zero", () => expect(calculateCagr({ beginningValue: 100, endingValue: 0, durationYears: 5 }).cagrPercentage).toBe(-100));
  it("rejects a zero beginning value", () => expect(() => calculateCagr({ beginningValue: 0, endingValue: 100, durationYears: 5 })).toThrow());
  it("rejects invalid years", () => expect(() => calculateCagr({ beginningValue: 100, endingValue: 200, durationYears: 0 })).toThrow());
  it("rejects a negative beginning value", () => expect(() => calculateCagr({ beginningValue: -1, endingValue: 100, durationYears: 5 })).toThrow());
  it("rejects a fractional duration", () => expect(() => calculateCagr({ beginningValue: 100, endingValue: 200, durationYears: 1.5 })).toThrow(/whole number/));
});

describe("step-up SIP calculator", () => {
  it("matches the fixed SIP convention with zero step-up", () => { const input = { startingMonthlyInvestment: 5000, annualReturnRate: 12, investmentYears: 10, annualStepUpRate: 0 }; expect(calculateStepUpSip(input).futureValue).toBeCloseTo(calculateSip({ monthlyInvestment: 5000, annualReturnRate: 12, investmentYears: 10 }).futureValue, 8); });
  it("increases contributions annually", () => { const result = calculateStepUpSip({ startingMonthlyInvestment: 1000, annualReturnRate: 0, investmentYears: 2, annualStepUpRate: 10 }); expect(result.totalInvested).toBe(25200); expect(result.finalMonthlyInvestment).toBeCloseTo(1100); });
  it("handles positive step-up and return", () => expect(calculateStepUpSip({ startingMonthlyInvestment: 5000, annualReturnRate: 12, investmentYears: 10, annualStepUpRate: 10 }).futureValue).toBeGreaterThan(1_161_695));
  it("handles zero return", () => expect(calculateStepUpSip({ startingMonthlyInvestment: 1000, annualReturnRate: 0, investmentYears: 1, annualStepUpRate: 10 }).futureValue).toBe(12000));
  it("keeps the starting contribution for one year", () => expect(calculateStepUpSip({ startingMonthlyInvestment: 1000, annualReturnRate: 0, investmentYears: 1, annualStepUpRate: 100 }).finalMonthlyInvestment).toBe(1000));
  it("rejects invalid values", () => expect(() => calculateStepUpSip({ startingMonthlyInvestment: 1000, annualReturnRate: 10, investmentYears: 1, annualStepUpRate: -1 })).toThrow());
  it("handles a zero starting investment", () => expect(calculateStepUpSip({ startingMonthlyInvestment: 0, annualReturnRate: 10, investmentYears: 2, annualStepUpRate: 10 })).toEqual({ totalInvested: 0, estimatedReturns: 0, futureValue: 0, finalMonthlyInvestment: 0 }));
  it("rejects a fractional investment period", () => expect(() => calculateStepUpSip({ startingMonthlyInvestment: 1000, annualReturnRate: 10, investmentYears: 1.5, annualStepUpRate: 10 })).toThrow(/whole number/));
});

describe("gratuity calculator", () => {
  const calculate = (input: Parameters<typeof calculateGratuity>[0]) => calculateGratuity(input, gratuityRuleSet);
  it("calculates whole years", () => expect(calculate({ eligibleMonthlyWage: 50000, completedYears: 10, additionalMonths: 0 }).estimatedGratuity).toBeCloseTo(288_461.54, 2));
  it("does not round up six additional months", () => expect(calculate({ eligibleMonthlyWage: 50000, completedYears: 10, additionalMonths: 6 }).serviceYearsCounted).toBe(10));
  it("rounds up more than six additional months", () => expect(calculate({ eligibleMonthlyWage: 50000, completedYears: 10, additionalMonths: 7 }).serviceYearsCounted).toBe(11));
  it("caps the statutory estimate while retaining the raw amount", () => expect(calculate({ eligibleMonthlyWage: 500_000, completedYears: 30, additionalMonths: 0 })).toMatchObject({ statutoryCeiling: 2_000_000, estimatedGratuity: 2_000_000, ceilingApplied: true }));
  it("handles zero wage", () => expect(calculate({ eligibleMonthlyWage: 0, completedYears: 10, additionalMonths: 0 }).estimatedGratuity).toBe(0));
  it("rejects invalid month count", () => expect(() => calculate({ eligibleMonthlyWage: 50000, completedYears: 10, additionalMonths: 12 })).toThrow());
  it("rejects negative values", () => expect(() => calculate({ eligibleMonthlyWage: 50000, completedYears: -1, additionalMonths: 0 })).toThrow());
  it("accepts the inclusive service and month upper limits", () => expect(calculate({ eligibleMonthlyWage: 100_000_000_000, completedYears: 100, additionalMonths: 11 }).serviceYearsCounted).toBe(101));
  it("rejects fractional completed years", () => expect(() => calculate({ eligibleMonthlyWage: 50000, completedYears: 10.5, additionalMonths: 0 })).toThrow(/whole number/));
  it("rejects fractional additional months", () => expect(() => calculate({ eligibleMonthlyWage: 50000, completedYears: 10, additionalMonths: 6.5 })).toThrow(/whole number/));
});

describe("SWP calculator", () => {
  it("calculates a standard withdrawal plan", () => { const result = calculateSwp({ initialInvestment: 1000000, monthlyWithdrawal: 10000, annualReturnRate: 8, withdrawalYears: 10 }); expect(result.withdrawalsCompleted).toBe(120); expect(result.remainingBalance).toBeGreaterThan(0); });
  it("handles zero return", () => { const result = calculateSwp({ initialInvestment: 120000, monthlyWithdrawal: 10000, annualReturnRate: 0, withdrawalYears: 1 }); expect(result.totalWithdrawn).toBe(120000); expect(result.remainingBalance).toBe(0); });
  it("handles zero withdrawal", () => { const result = calculateSwp({ initialInvestment: 100000, monthlyWithdrawal: 0, annualReturnRate: 12, withdrawalYears: 1 }); expect(result.totalWithdrawn).toBe(0); expect(result.withdrawalsCompleted).toBe(0); expect(result.remainingBalance).toBeGreaterThan(100000); });
  it("reports early fund exhaustion", () => { const result = calculateSwp({ initialInvestment: 10000, monthlyWithdrawal: 6000, annualReturnRate: 0, withdrawalYears: 1 }); expect(result.exhaustedBeforeTenure).toBe(true); expect(result.withdrawalsCompleted).toBe(2); });
  it("never creates a negative balance", () => expect(calculateSwp({ initialInvestment: 100, monthlyWithdrawal: 1000, annualReturnRate: 0, withdrawalYears: 1 }).remainingBalance).toBe(0));
  it("rejects invalid inputs", () => expect(() => calculateSwp({ initialInvestment: Infinity, monthlyWithdrawal: 100, annualReturnRate: 5, withdrawalYears: 1 })).toThrow(/finite/));
  it("applies return before the withdrawal", () => { const result = calculateSwp({ initialInvestment: 1000, monthlyWithdrawal: 1010, annualReturnRate: 12, withdrawalYears: 1 }); expect(result.totalWithdrawn).toBe(1010); expect(result.withdrawalsCompleted).toBe(1); expect(result.remainingBalance).toBe(0); });
  it("caps a partial final withdrawal and terminates immediately", () => { const result = calculateSwp({ initialInvestment: 1000, monthlyWithdrawal: 600, annualReturnRate: 0, withdrawalYears: 1 }); expect(result.totalWithdrawn).toBe(1000); expect(result.withdrawalsCompleted).toBe(2); expect(result.remainingBalance).toBe(0); });
  it("handles a zero initial investment without attempting withdrawals", () => expect(calculateSwp({ initialInvestment: 0, monthlyWithdrawal: 100, annualReturnRate: 5, withdrawalYears: 1 })).toEqual({ initialInvestment: 0, totalWithdrawn: 0, remainingBalance: 0, withdrawalsCompleted: 0, exhaustedBeforeTenure: true }));
  it("rejects a fractional withdrawal period", () => expect(() => calculateSwp({ initialInvestment: 1000, monthlyWithdrawal: 100, annualReturnRate: 5, withdrawalYears: 1.5 })).toThrow(/whole number/));
});

describe("inflation calculator", () => {
  it("calculates future cost", () => expect(calculateInflation({ mode: "future-cost", currentValue: 100000, annualInflationRate: 6, years: 10 }).estimatedValue).toBeCloseTo(179_084.77, 2));
  it("calculates purchasing power", () => expect(calculateInflation({ mode: "purchasing-power", currentValue: 100000, annualInflationRate: 6, years: 10 }).estimatedValue).toBeCloseTo(55_839.48, 2));
  it("handles zero inflation", () => expect(calculateInflation({ mode: "future-cost", currentValue: 100000, annualInflationRate: 0, years: 10 }).estimatedValue).toBe(100000));
  it("handles zero value", () => expect(calculateInflation({ mode: "purchasing-power", currentValue: 0, annualInflationRate: 6, years: 10 }).estimatedValue).toBe(0));
  it("rejects invalid tenure", () => expect(() => calculateInflation({ mode: "future-cost", currentValue: 100, annualInflationRate: 6, years: 0 })).toThrow());
  it("handles zero inflation in purchasing-power mode", () => expect(calculateInflation({ mode: "purchasing-power", currentValue: 100000, annualInflationRate: 0, years: 10 })).toEqual({ mode: "purchasing-power", currentValue: 100000, estimatedValue: 100000, change: 0 }));
  it("rejects an invalid mode", () => expect(() => calculateInflation({ mode: "invalid" as never, currentValue: 100, annualInflationRate: 6, years: 1 })).toThrow(/mode is invalid/));
  it("rejects a fractional duration", () => expect(() => calculateInflation({ mode: "future-cost", currentValue: 100, annualInflationRate: 6, years: 1.5 })).toThrow(/whole number/));
});

describe("expanded calculator finite-number validation", () => {
  it("rejects NaN through a representative amount field", () => expect(() => calculatePpf({ annualContribution: Number.NaN, annualInterestRate: 7, tenureYears: 1 })).toThrow(/finite/));
  it("rejects Infinity through a representative rate field", () => expect(() => calculateInflation({ mode: "future-cost", currentValue: 100, annualInflationRate: Infinity, years: 1 })).toThrow(/finite/));
});
