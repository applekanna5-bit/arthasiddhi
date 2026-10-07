import {
  calculateLoanDetails,
  type LoanResult,
} from "../engine/loan";
import { formatIndianCurrency as formatCurrency } from "./formatting";

export interface CalculatorFormValues {
  principal: string;
  annualInterestRate: string;
  tenureYears: string;
}

/** Formats a value for display only; the calculation engine retains full precision. */
export function formatIndianCurrency(value: number): string {
  return formatCurrency(value);
}

/**
 * Converts the calculator's years-based form values and delegates all financial
 * work to the frozen loan engine.
 */
export function calculateFromFormValues(
  values: CalculatorFormValues
): LoanResult {
  if (values.principal.trim() === "") throw new Error("Loan amount is required.");
  if (values.annualInterestRate.trim() === "") throw new Error("Annual interest rate is required.");
  if (values.tenureYears.trim() === "") throw new Error("Loan tenure is required.");

  return calculateLoanDetails({
    principal: Number(values.principal),
    annualInterestRate: Number(values.annualInterestRate),
    tenureMonths: Number(values.tenureYears) * 12,
  });
}
