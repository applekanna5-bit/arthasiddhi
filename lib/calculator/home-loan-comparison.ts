import { calculateFromFormValues, type CalculatorFormValues } from "./loan-calculator";
import type { LoanResult } from "../engine/loan";

export type AlternativeLoanValues = Pick<CalculatorFormValues, "annualInterestRate" | "tenureYears">;
export type LoanCalculation = { result: LoanResult | null; error: string | null };
export type ScheduleScenario = "current" | "comparison";

/** Principal always comes from the current scenario, never from alternative state. */
export function calculateAlternative(principal: string, values: AlternativeLoanValues): LoanCalculation {
  try {
    // Number("") is zero; an unfinished input must not become an assumed 0% rate.
    if (!principal.trim() || !values.annualInterestRate.trim() || !values.tenureYears.trim()) {
      throw new Error("Enter the shared loan amount, comparison rate and comparison tenure.");
    }
    return { result: calculateFromFormValues({ ...values, principal }), error: null };
  } catch (error) {
    return { result: null, error: error instanceof Error ? error.message : "Unable to calculate this comparison." };
  }
}

/** Signed B minus A differences. Formatting and absolute-value display belong to the UI. */
export function compareLoanResults(current: LoanResult | null, alternative: LoanResult | null) {
  if (!current || !alternative) return null;
  return {
    monthlyEmi: alternative.monthlyEmi - current.monthlyEmi,
    totalInterest: alternative.totalInterest - current.totalInterest,
    totalPayment: alternative.totalPayment - current.totalPayment,
    tenureMonths: alternative.amortizationSchedule.length - current.amortizationSchedule.length,
  };
}

export function selectLoanSchedule(current: LoanResult | null, alternative: LoanResult | null, selected: ScheduleScenario) {
  return (selected === "comparison" ? alternative : current)?.amortizationSchedule ?? [];
}
