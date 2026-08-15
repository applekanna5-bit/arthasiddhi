import type { CompoundingFrequency } from "./types";
import { assertFiniteNumber, assertInRange } from "./validation";

export interface FdInput {
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
  compoundingFrequency: CompoundingFrequency;
}

export interface FdResult {
  principal: number;
  interestEarned: number;
  maturityAmount: number;
}

const compoundsPerYear: Record<CompoundingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  "half-yearly": 2,
  yearly: 1,
};

/** Calculates FD maturity using A = P(1 + r/n)^(nt), with no display rounding. */
export function calculateFd(input: FdInput): FdResult {
  const { principal, annualInterestRate, tenureYears, compoundingFrequency } = input;
  assertFiniteNumber(principal, "Principal");
  assertFiniteNumber(annualInterestRate, "Annual interest rate");
  assertFiniteNumber(tenureYears, "Tenure");
  assertInRange(principal, "Principal", 0, 100_000_000_000, false);
  assertInRange(annualInterestRate, "Annual interest rate", 0, 100);
  assertInRange(tenureYears, "Tenure", 0, 100, false);

  const periods = compoundsPerYear[compoundingFrequency];
  if (!periods) throw new Error("Compounding frequency is invalid.");

  const rate = annualInterestRate / 100;
  const maturityAmount = principal * Math.pow(1 + rate / periods, periods * tenureYears);
  return { principal, interestEarned: maturityAmount - principal, maturityAmount };
}
