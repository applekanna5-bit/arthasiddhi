import { assertFiniteNumber, assertInRange } from "./validation";

export interface SipInput {
  monthlyInvestment: number;
  annualReturnRate: number;
  investmentYears: number;
}

export interface SipResult {
  totalInvested: number;
  estimatedReturns: number;
  futureValue: number;
}

/** Reject unfinished required inputs before converting values for the unchanged model. */
export function calculateSipFromFormValues(values: { [Field in keyof SipInput]: string }): SipResult {
  if (values.monthlyInvestment.trim() === "") throw new Error("Monthly investment is required.");
  if (values.annualReturnRate.trim() === "") throw new Error("Expected annual return is required.");
  if (values.investmentYears.trim() === "") throw new Error("Investment period is required.");

  return calculateSip({
    monthlyInvestment: Number(values.monthlyInvestment),
    annualReturnRate: Number(values.annualReturnRate),
    investmentYears: Number(values.investmentYears),
  });
}

/**
 * Calculates SIP growth using beginning-of-month contributions and a monthly rate
 * derived from the annual percentage rate: FV = P * (((1 + r)^n - 1) / r) * (1 + r).
 */
export function calculateSip(input: SipInput): SipResult {
  const { monthlyInvestment, annualReturnRate, investmentYears } = input;
  assertFiniteNumber(monthlyInvestment, "Monthly investment");
  assertFiniteNumber(annualReturnRate, "Expected annual return");
  assertFiniteNumber(investmentYears, "Investment period");
  assertInRange(monthlyInvestment, "Monthly investment", 0, 100_000_000);
  assertInRange(annualReturnRate, "Expected annual return", 0, 100);
  assertInRange(investmentYears, "Investment period", 0, 100);

  const months = investmentYears * 12;
  const totalInvested = monthlyInvestment * months;
  const monthlyRate = annualReturnRate / 12 / 100;
  const futureValue = monthlyRate === 0
    ? totalInvested
    : monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

  return { totalInvested, estimatedReturns: futureValue - totalInvested, futureValue };
}
