import { assertFiniteNumber, assertInRange } from "./validation";
import type { FinancialRuleSet } from "../financial-rules/types";
import type { GratuityRules } from "../financial-rules/rule-sets";

function validateAmount(value: number, label: string, allowZero = true) {
  assertFiniteNumber(value, label);
  assertInRange(value, label, 0, 100_000_000_000, allowZero);
}

function validateRate(value: number, label: string) {
  assertFiniteNumber(value, label);
  assertInRange(value, label, 0, 100);
}

function validateYears(value: number, label = "Investment period") {
  assertFiniteNumber(value, label);
  assertInRange(value, label, 0, 100, false);
  if (!Number.isInteger(value)) throw new Error(`${label} must be a whole number of years.`);
}

export interface PpfInput { annualContribution: number; annualInterestRate: number; tenureYears: number }
export interface PpfScheduleRow { year: number; openingBalance: number; contribution: number; interest: number; closingBalance: number }
export interface PpfResult { totalContribution: number; interestEarned: number; maturityAmount: number; schedule: PpfScheduleRow[] }

export function calculatePpf(input: PpfInput): PpfResult {
  validateAmount(input.annualContribution, "Annual contribution");
  validateRate(input.annualInterestRate, "Assumed annual interest rate");
  validateYears(input.tenureYears, "Investment tenure");
  const rate = input.annualInterestRate / 100;
  const schedule: PpfScheduleRow[] = [];
  let balance = 0;
  for (let year = 1; year <= input.tenureYears; year += 1) {
    const openingBalance = balance;
    const interest = (openingBalance + input.annualContribution) * rate;
    balance = openingBalance + input.annualContribution + interest;
    schedule.push({ year, openingBalance, contribution: input.annualContribution, interest, closingBalance: balance });
  }
  const totalContribution = input.annualContribution * input.tenureYears;
  return { totalContribution, interestEarned: balance - totalContribution, maturityAmount: balance, schedule };
}

export interface RdInput { monthlyDeposit: number; annualInterestRate: number; tenureYears: number }
export interface RdResult { totalDeposits: number; interestEarned: number; maturityAmount: number }

export function calculateRd(input: RdInput): RdResult {
  validateAmount(input.monthlyDeposit, "Monthly deposit");
  validateRate(input.annualInterestRate, "Annual interest rate");
  validateYears(input.tenureYears, "Tenure");
  const months = input.tenureYears * 12;
  const rate = input.annualInterestRate / 12 / 100;
  const totalDeposits = input.monthlyDeposit * months;
  const maturityAmount = rate === 0 ? totalDeposits : input.monthlyDeposit * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
  return { totalDeposits, interestEarned: maturityAmount - totalDeposits, maturityAmount };
}

export interface LumpsumInput { initialInvestment: number; annualReturnRate: number; investmentYears: number }
export interface LumpsumResult { investedAmount: number; estimatedGain: number; futureValue: number }

export function calculateLumpsum(input: LumpsumInput): LumpsumResult {
  validateAmount(input.initialInvestment, "Initial investment");
  validateRate(input.annualReturnRate, "Expected annual return");
  validateYears(input.investmentYears);
  const futureValue = input.initialInvestment * Math.pow(1 + input.annualReturnRate / 100, input.investmentYears);
  return { investedAmount: input.initialInvestment, estimatedGain: futureValue - input.initialInvestment, futureValue };
}

export interface CagrInput { beginningValue: number; endingValue: number; durationYears: number }
export interface CagrResult { beginningValue: number; endingValue: number; absoluteGainLoss: number; cagrPercentage: number }

export function calculateCagr(input: CagrInput): CagrResult {
  validateAmount(input.beginningValue, "Beginning value", false);
  validateAmount(input.endingValue, "Ending value");
  validateYears(input.durationYears, "Duration");
  const cagrPercentage = (Math.pow(input.endingValue / input.beginningValue, 1 / input.durationYears) - 1) * 100;
  return { beginningValue: input.beginningValue, endingValue: input.endingValue, absoluteGainLoss: input.endingValue - input.beginningValue, cagrPercentage };
}

export interface StepUpSipInput { startingMonthlyInvestment: number; annualReturnRate: number; investmentYears: number; annualStepUpRate: number }
export interface StepUpSipResult { totalInvested: number; estimatedReturns: number; futureValue: number; finalMonthlyInvestment: number }

export function calculateStepUpSip(input: StepUpSipInput): StepUpSipResult {
  validateAmount(input.startingMonthlyInvestment, "Starting monthly investment");
  validateRate(input.annualReturnRate, "Expected annual return");
  validateYears(input.investmentYears);
  validateRate(input.annualStepUpRate, "Annual SIP increase");
  const monthlyRate = input.annualReturnRate / 12 / 100;
  const stepRate = input.annualStepUpRate / 100;
  let monthlyInvestment = input.startingMonthlyInvestment;
  let totalInvested = 0;
  let balance = 0;
  for (let month = 0; month < input.investmentYears * 12; month += 1) {
    if (month > 0 && month % 12 === 0) monthlyInvestment *= 1 + stepRate;
    totalInvested += monthlyInvestment;
    balance = (balance + monthlyInvestment) * (1 + monthlyRate);
  }
  return { totalInvested, estimatedReturns: balance - totalInvested, futureValue: balance, finalMonthlyInvestment: monthlyInvestment };
}

export interface GratuityInput { eligibleMonthlyWage: number; completedYears: number; additionalMonths: number }
export interface GratuityResult { eligibleMonthlyWage: number; serviceYearsCounted: number; rawFormulaGratuity: number; statutoryCeiling: number; estimatedGratuity: number; ceilingApplied: boolean }

export function calculateGratuity(input: GratuityInput, ruleSet: FinancialRuleSet<GratuityRules>): GratuityResult {
  validateAmount(input.eligibleMonthlyWage, "Eligible monthly wage");
  assertFiniteNumber(input.completedYears, "Completed years of service");
  assertInRange(input.completedYears, "Completed years of service", 0, 100);
  if (!Number.isInteger(input.completedYears)) throw new Error("Completed years of service must be a whole number.");
  assertFiniteNumber(input.additionalMonths, "Additional completed months");
  assertInRange(input.additionalMonths, "Additional completed months", 0, 11);
  if (!Number.isInteger(input.additionalMonths)) throw new Error("Additional completed months must be a whole number.");
  const serviceYearsCounted = input.completedYears + (input.additionalMonths > ruleSet.rules.additionalMonthsMustExceed ? 1 : 0);
  const rawFormulaGratuity = input.eligibleMonthlyWage * ruleSet.rules.ordinaryMonthlyRatedNumerator / ruleSet.rules.ordinaryMonthlyRatedDenominator * serviceYearsCounted;
  const estimatedGratuity = Math.min(rawFormulaGratuity, ruleSet.rules.statutoryCeiling);
  return { eligibleMonthlyWage: input.eligibleMonthlyWage, serviceYearsCounted, rawFormulaGratuity, statutoryCeiling: ruleSet.rules.statutoryCeiling, estimatedGratuity, ceilingApplied: rawFormulaGratuity > ruleSet.rules.statutoryCeiling };
}

export interface SwpInput { initialInvestment: number; monthlyWithdrawal: number; annualReturnRate: number; withdrawalYears: number }
export interface SwpResult { initialInvestment: number; totalWithdrawn: number; remainingBalance: number; withdrawalsCompleted: number; exhaustedBeforeTenure: boolean }

export function calculateSwp(input: SwpInput): SwpResult {
  validateAmount(input.initialInvestment, "Initial investment");
  validateAmount(input.monthlyWithdrawal, "Monthly withdrawal");
  validateRate(input.annualReturnRate, "Expected annual return");
  validateYears(input.withdrawalYears, "Withdrawal period");
  const intendedMonths = input.withdrawalYears * 12;
  const monthlyRate = input.annualReturnRate / 12 / 100;
  let balance = input.initialInvestment;
  let totalWithdrawn = 0;
  let withdrawalsCompleted = 0;
  for (let month = 0; month < intendedMonths && balance > 0; month += 1) {
    balance *= 1 + monthlyRate;
    const withdrawal = Math.min(input.monthlyWithdrawal, balance);
    balance = Math.max(0, balance - withdrawal);
    totalWithdrawn += withdrawal;
    if (withdrawal > 0) withdrawalsCompleted += 1;
  }
  return { initialInvestment: input.initialInvestment, totalWithdrawn, remainingBalance: balance, withdrawalsCompleted, exhaustedBeforeTenure: balance === 0 && withdrawalsCompleted < intendedMonths };
}

export type InflationMode = "future-cost" | "purchasing-power";
export interface InflationInput { mode: InflationMode; currentValue: number; annualInflationRate: number; years: number }
export interface InflationResult { mode: InflationMode; currentValue: number; estimatedValue: number; change: number }

export function calculateInflation(input: InflationInput): InflationResult {
  if (input.mode !== "future-cost" && input.mode !== "purchasing-power") throw new Error("Inflation mode is invalid.");
  validateAmount(input.currentValue, input.mode === "future-cost" ? "Current cost" : "Current amount");
  validateRate(input.annualInflationRate, "Expected inflation rate");
  validateYears(input.years, "Number of years");
  const factor = Math.pow(1 + input.annualInflationRate / 100, input.years);
  const estimatedValue = input.mode === "future-cost" ? input.currentValue * factor : input.currentValue / factor;
  return { mode: input.mode, currentValue: input.currentValue, estimatedValue, change: input.mode === "future-cost" ? estimatedValue - input.currentValue : input.currentValue - estimatedValue };
}
