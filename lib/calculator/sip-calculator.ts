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

/**
 * Calculates SIP growth using end-of-month contributions and a monthly rate
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
