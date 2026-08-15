/**
 * ArthaSiddhi Loan Calculation Engine
 *
 * MODEL: Standard monthly-compounding amortization model.
 * NOTE: Real lenders may differ from these calculations due to daily interest
 * accrual, specific payment dates, rate resets, rounding conventions, processing
 * fees, insurance premiums, and other lender-specific rules.
 *
 * PRECISION POLICY:
 * - Financial calculations use full internal floating-point precision.
 * - Calculation precision must NOT be destroyed or pre-rounded merely for display purposes.
 * - UI formatting controls display precision.
 */

export interface LoanParams {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
}

export interface AmortizationRow {
  month: number;
  emi: number;
  principalComponent: number;
  interestComponent: number;
  remainingBalance: number;
}

export interface LoanResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: AmortizationRow[];
}

const MAX_PRINCIPAL = 10_000_000_000;
const MAX_RATE = 100;
const MAX_TENURE_MONTHS = 600;

export function calculateLoanDetails(params: LoanParams): LoanResult {
  const { principal, annualInterestRate, tenureMonths } = params;

  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(annualInterestRate) ||
    !Number.isFinite(tenureMonths)
  ) {
    throw new Error("Inputs must be finite numbers.");
  }

  if (principal <= 0 || principal > MAX_PRINCIPAL) {
    throw new Error(
      `Principal must be greater than 0 and up to ₹${MAX_PRINCIPAL.toLocaleString("en-IN")}.`
    );
  }

  if (annualInterestRate < 0 || annualInterestRate > MAX_RATE) {
    throw new Error(
      `Interest rate must be between 0% and ${MAX_RATE}%.`
    );
  }

  if (
    tenureMonths <= 0 ||
    !Number.isInteger(tenureMonths) ||
    tenureMonths > MAX_TENURE_MONTHS
  ) {
    throw new Error(
      `Tenure must be a positive integer up to ${MAX_TENURE_MONTHS} months.`
    );
  }

  const schedule: AmortizationRow[] = [];
  let totalInterest = 0;

  if (annualInterestRate === 0) {
    const baseEmi = principal / tenureMonths;
    let balance = principal;

    for (let i = 1; i <= tenureMonths; i++) {
      const isFinalMonth = i === tenureMonths;
      const principalForMonth = isFinalMonth ? balance : baseEmi;

      balance -= principalForMonth;

      schedule.push({
        month: i,
        emi: principalForMonth,
        principalComponent: principalForMonth,
        interestComponent: 0,
        remainingBalance: isFinalMonth ? 0 : balance,
      });
    }

    return {
      monthlyEmi: baseEmi,
      totalInterest: 0,
      totalPayment: principal,
      amortizationSchedule: schedule,
    };
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const mathPow = Math.pow(1 + monthlyRate, tenureMonths);

  const monthlyEmi =
    (principal * monthlyRate * mathPow) /
    (mathPow - 1);

  let balance = principal;

  for (let i = 1; i <= tenureMonths; i++) {
    const isFinalMonth = i === tenureMonths;
    const interestForMonth = balance * monthlyRate;

    let principalForMonth: number;
    let actualEmi: number;

    if (isFinalMonth) {
      principalForMonth = balance;
      actualEmi = principalForMonth + interestForMonth;
      balance = 0;
    } else {
      principalForMonth = monthlyEmi - interestForMonth;
      actualEmi = monthlyEmi;
      balance -= principalForMonth;
    }

    totalInterest += interestForMonth;

    schedule.push({
      month: i,
      emi: actualEmi,
      principalComponent: principalForMonth,
      interestComponent: interestForMonth,
      remainingBalance: Math.max(0, balance),
    });
  }

  return {
    monthlyEmi,
    totalInterest,
    totalPayment: principal + totalInterest,
    amortizationSchedule: schedule,
  };
}
