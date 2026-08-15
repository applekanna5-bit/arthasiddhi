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
  return calculateLoanDetails({
    principal: Number(values.principal),
    annualInterestRate: Number(values.annualInterestRate),
    tenureMonths: Number(values.tenureYears) * 12,
  });
}
