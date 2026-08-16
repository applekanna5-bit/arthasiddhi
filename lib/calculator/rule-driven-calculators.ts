import { assertFiniteNumber, assertInRange } from "./validation";
import type { FinancialRuleSet } from "../financial-rules/types";
import type { EpfRules, GstRules, IncomeTaxRules, NpsRules, TaxSlab } from "../financial-rules/rule-sets";

const MAX_AMOUNT = 100_000_000_000;

function validateAmount(value: number, label: string, maximum = MAX_AMOUNT) {
  assertFiniteNumber(value, label);
  assertInRange(value, label, 0, maximum);
}

function validateRate(value: number, label: string, minimum = 0, maximum = 100) {
  assertFiniteNumber(value, label);
  assertInRange(value, label, minimum, maximum);
}

function validateWholeNumber(value: number, label: string, minimum: number, maximum: number) {
  assertFiniteNumber(value, label);
  assertInRange(value, label, minimum, maximum);
  if (!Number.isInteger(value)) throw new Error(`${label} must be a whole number.`);
}

export type TaxRegime = "new" | "old";
export type TaxAgeCategory = "below-60" | "60-to-below-80" | "80-or-above";
export type IncomeTaxInput = { regime: TaxRegime; ageCategory: TaxAgeCategory; taxableOrdinaryIncome: number };
export type IncomeTaxBreakdownRow = { lowerBound: number; upperBound: number | null; rate: number; taxableAmount: number; tax: number };
export type IncomeTaxResult = { ruleSetId: string; taxYear: string; regime: TaxRegime; ageCategory: TaxAgeCategory; taxableIncome: number; taxBeforeRebate: number; rebate: number; taxAfterRebate: number; cess: number; totalTax: number; effectiveTaxRate: number; breakdown: IncomeTaxBreakdownRow[] };

function calculateSlabTax(income: number, slabs: TaxSlab[]) {
  let lowerBound = 0;
  const breakdown = slabs.map((slab) => {
    const upper = slab.upTo ?? income;
    const taxableAmount = Math.max(0, Math.min(income, upper) - lowerBound);
    const tax = taxableAmount * slab.rate / 100;
    const row = { lowerBound, upperBound: slab.upTo, rate: slab.rate, taxableAmount, tax };
    lowerBound = upper;
    return row;
  });
  return { breakdown, tax: breakdown.reduce((sum, row) => sum + row.tax, 0) };
}

export function calculateIncomeTax(input: IncomeTaxInput, ruleSet: FinancialRuleSet<IncomeTaxRules>): IncomeTaxResult {
  if (input.regime !== "new" && input.regime !== "old") throw new Error("Tax regime is invalid.");
  if (!(["below-60", "60-to-below-80", "80-or-above"] as string[]).includes(input.ageCategory)) throw new Error("Age category is invalid.");
  validateAmount(input.taxableOrdinaryIncome, "Taxable ordinary income", ruleSet.rules.maximumSupportedIncome);
  const regimeRules = input.regime === "new" ? ruleSet.rules.newRegime : ruleSet.rules.oldRegime;
  const slabs = input.regime === "new" ? ruleSet.rules.newRegime.slabs : ruleSet.rules.oldRegime.slabsByAge[input.ageCategory];
  const slabResult = calculateSlabTax(input.taxableOrdinaryIncome, slabs);
  const rebate = input.taxableOrdinaryIncome <= regimeRules.rebateIncomeLimit ? Math.min(slabResult.tax, regimeRules.maximumRebate) : 0;
  const taxAfterRebate = Math.max(0, slabResult.tax - rebate);
  const cess = taxAfterRebate * ruleSet.rules.cessRate / 100;
  const totalTax = taxAfterRebate + cess;
  return { ruleSetId: ruleSet.id, taxYear: ruleSet.effectivePeriod, regime: input.regime, ageCategory: input.ageCategory, taxableIncome: input.taxableOrdinaryIncome, taxBeforeRebate: slabResult.tax, rebate, taxAfterRebate, cess, totalTax, effectiveTaxRate: input.taxableOrdinaryIncome === 0 ? 0 : totalTax / input.taxableOrdinaryIncome * 100, breakdown: slabResult.breakdown };
}

export type GstMode = "exclusive" | "inclusive";
export type GstTransactionType = "intra-state" | "inter-state";
export type GstInput = { mode: GstMode; transactionType: GstTransactionType; amount: number; gstRate: number };
export type GstResult = { ruleSetId: string; mode: GstMode; transactionType: GstTransactionType; gstRate: number; taxableValue: number; cgst: number; sgst: number; igst: number; totalGst: number; invoiceTotal: number };

export function calculateGst(input: GstInput, ruleSet: FinancialRuleSet<GstRules>): GstResult {
  if (input.mode !== "exclusive" && input.mode !== "inclusive") throw new Error("GST calculation mode is invalid.");
  if (input.transactionType !== "intra-state" && input.transactionType !== "inter-state") throw new Error("GST transaction type is invalid.");
  validateAmount(input.amount, "Amount");
  validateRate(input.gstRate, "GST rate", ruleSet.rules.minimumRate, ruleSet.rules.maximumRate);
  const factor = 1 + input.gstRate / 100;
  const taxableValue = input.mode === "exclusive" ? input.amount : input.amount / factor;
  const totalGst = input.mode === "exclusive" ? input.amount * input.gstRate / 100 : input.amount - taxableValue;
  const invoiceTotal = input.mode === "exclusive" ? taxableValue + totalGst : input.amount;
  const cgst = input.transactionType === "intra-state" ? totalGst / 2 : 0;
  const sgst = input.transactionType === "intra-state" ? totalGst / 2 : 0;
  const igst = input.transactionType === "inter-state" ? totalGst : 0;
  return { ruleSetId: ruleSet.id, mode: input.mode, transactionType: input.transactionType, gstRate: input.gstRate, taxableValue, cgst, sgst, igst, totalGst, invoiceTotal };
}

export type EpfInput = { monthlyEpfWage: number; currentEpfBalance: number; employeeContributionRate: number; employerContributionRate: number; annualInterestRate: number; projectionYears: number; epsEligible: boolean };
export type EpfResult = { ruleSetId: string; openingBalance: number; monthlyEmployeeEpf: number; monthlyEmployerTotal: number; monthlyEmployerEpf: number; monthlyEmployerEps: number; totalEmployeeEpfContributions: number; totalEmployerEpfContributions: number; totalEpsDiversion: number; estimatedGrowth: number; closingBalance: number };

export function calculateEpf(input: EpfInput, ruleSet: FinancialRuleSet<EpfRules>): EpfResult {
  validateAmount(input.monthlyEpfWage, "Monthly EPF wage");
  validateAmount(input.currentEpfBalance, "Current EPF balance");
  validateRate(input.employeeContributionRate, "Employee contribution rate");
  validateRate(input.employerContributionRate, "Employer contribution rate");
  validateRate(input.annualInterestRate, "Assumed EPF annual interest rate");
  validateWholeNumber(input.projectionYears, "Projection years", 1, 100);
  if (typeof input.epsEligible !== "boolean") throw new Error("EPS eligibility is invalid.");
  const monthlyEmployeeEpf = input.monthlyEpfWage * input.employeeContributionRate / 100;
  const monthlyEmployerTotal = input.monthlyEpfWage * input.employerContributionRate / 100;
  const monthlyEmployerEps = input.epsEligible ? Math.min(input.monthlyEpfWage, ruleSet.rules.epsWageCeiling) * ruleSet.rules.epsDiversionRate / 100 : 0;
  const monthlyEmployerEpf = Math.max(0, monthlyEmployerTotal - monthlyEmployerEps);
  const months = input.projectionYears * 12;
  const monthlyRate = input.annualInterestRate / 12 / 100;
  let balance = input.currentEpfBalance;
  for (let month = 0; month < months; month += 1) balance = (balance + monthlyEmployeeEpf + monthlyEmployerEpf) * (1 + monthlyRate);
  const totalEmployeeEpfContributions = monthlyEmployeeEpf * months;
  const totalEmployerEpfContributions = monthlyEmployerEpf * months;
  const totalEpsDiversion = monthlyEmployerEps * months;
  return { ruleSetId: ruleSet.id, openingBalance: input.currentEpfBalance, monthlyEmployeeEpf, monthlyEmployerTotal, monthlyEmployerEpf, monthlyEmployerEps, totalEmployeeEpfContributions, totalEmployerEpfContributions, totalEpsDiversion, estimatedGrowth: balance - input.currentEpfBalance - totalEmployeeEpfContributions - totalEmployerEpfContributions, closingBalance: balance };
}

export type NpsInput = { currentAge: number; retirementAge: number; currentCorpus: number; monthlyContribution: number; annualReturnRate: number; annualContributionIncrease: number; annuityAllocation: number; assumedAnnuityRate: number };
export type NpsResult = { ruleSetId: string; yearsUntilRetirement: number; startingCorpus: number; totalContributions: number; estimatedGrowth: number; retirementCorpus: number; lumpSumCorpus: number; annuityCorpus: number; annuityAllocation: number; assumedAnnuityRate: number; estimatedAnnualAnnuity: number; estimatedMonthlyAnnuity: number; finalMonthlyContribution: number };

export function calculateNps(input: NpsInput, ruleSet: FinancialRuleSet<NpsRules>): NpsResult {
  validateWholeNumber(input.currentAge, "Current age", ruleSet.rules.minimumCurrentAge, ruleSet.rules.maximumRetirementAge - 1);
  validateWholeNumber(input.retirementAge, "Retirement age", ruleSet.rules.minimumCurrentAge + 1, ruleSet.rules.maximumRetirementAge);
  if (input.retirementAge <= input.currentAge) throw new Error("Retirement age must be greater than current age.");
  validateAmount(input.currentCorpus, "Current NPS corpus");
  validateAmount(input.monthlyContribution, "Monthly contribution");
  validateRate(input.annualReturnRate, "Expected annual return");
  validateRate(input.annualContributionIncrease, "Annual contribution increase");
  validateRate(input.annuityAllocation, "Annuity allocation", ruleSet.rules.minimumAnnuityAllocation, ruleSet.rules.maximumAnnuityAllocation);
  validateRate(input.assumedAnnuityRate, "Assumed annuity rate");
  const yearsUntilRetirement = input.retirementAge - input.currentAge;
  const months = yearsUntilRetirement * 12;
  const monthlyRate = input.annualReturnRate / 12 / 100;
  const stepRate = input.annualContributionIncrease / 100;
  let contribution = input.monthlyContribution;
  let totalContributions = 0;
  let balance = input.currentCorpus;
  for (let month = 0; month < months; month += 1) {
    if (month > 0 && month % 12 === 0) contribution *= 1 + stepRate;
    totalContributions += contribution;
    balance = (balance + contribution) * (1 + monthlyRate);
  }
  const annuityCorpus = balance * input.annuityAllocation / 100;
  const lumpSumCorpus = balance - annuityCorpus;
  const estimatedAnnualAnnuity = annuityCorpus * input.assumedAnnuityRate / 100;
  return { ruleSetId: ruleSet.id, yearsUntilRetirement, startingCorpus: input.currentCorpus, totalContributions, estimatedGrowth: balance - input.currentCorpus - totalContributions, retirementCorpus: balance, lumpSumCorpus, annuityCorpus, annuityAllocation: input.annuityAllocation, assumedAnnuityRate: input.assumedAnnuityRate, estimatedAnnualAnnuity, estimatedMonthlyAnnuity: estimatedAnnualAnnuity / 12, finalMonthlyContribution: contribution };
}

