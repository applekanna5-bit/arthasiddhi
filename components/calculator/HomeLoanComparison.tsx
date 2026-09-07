import type { AlternativeLoanValues, LoanCalculation } from "@/lib/calculator/home-loan-comparison";
import { compareLoanResults } from "@/lib/calculator/home-loan-comparison";
import { formatIndianCurrency } from "@/lib/calculator/formatting";
import type { LoanResult } from "@/lib/engine/loan";
import { CalculatorInput } from "./CalculatorInput";

function currencyDifference(value: number) {
  const amount = formatIndianCurrency(Math.abs(value));
  if (value === 0) return `${amount} difference`;
  if (Math.abs(value) < 0.005) return `Less than ₹0.01 ${value > 0 ? "higher" : "lower"}`;
  return `${amount} ${value > 0 ? "higher" : "lower"}`;
}

export function HomeLoanComparison({ values, onChange, onClose, current, alternative }: {
  values: AlternativeLoanValues;
  onChange: (field: keyof AlternativeLoanValues, value: string) => void;
  onClose: () => void;
  current: LoanResult | null;
  alternative: LoanCalculation;
}) {
  const differences = compareLoanResults(current, alternative.result);
  const metrics = current && alternative.result && differences ? [
    { label: "Monthly EMI", current: formatIndianCurrency(current.monthlyEmi), alternative: formatIndianCurrency(alternative.result.monthlyEmi), difference: currencyDifference(differences.monthlyEmi) },
    { label: "Total interest", current: formatIndianCurrency(current.totalInterest), alternative: formatIndianCurrency(alternative.result.totalInterest), difference: currencyDifference(differences.totalInterest) },
    { label: "Total scheduled repayment", current: formatIndianCurrency(current.totalPayment), alternative: formatIndianCurrency(alternative.result.totalPayment), difference: currencyDifference(differences.totalPayment) },
    { label: "Tenure", current: `${current.amortizationSchedule.length} months`, alternative: `${alternative.result.amortizationSchedule.length} months`, difference: `${Math.abs(differences.tenureMonths)} months ${differences.tenureMonths === 0 ? "difference" : differences.tenureMonths > 0 ? "longer" : "shorter"}` },
  ] : [];

  return <section id="home-loan-comparison" aria-labelledby="comparison-heading" className="mt-4 min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 id="comparison-heading" className="text-lg font-semibold text-slate-950">Compare loan scenarios</h2>
      <button type="button" aria-expanded={true} aria-controls="home-loan-comparison" onClick={onClose} className="min-h-11 rounded-lg border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-800 focus:outline-none focus:ring-3 focus:ring-emerald-100">Close comparison</button>
    </div>
    <p className="mt-2 text-sm leading-6 text-slate-600">Both scenarios use the loan amount entered above. Try changing one assumption at a time.</p>
    <p className="mt-2 text-sm leading-6 text-slate-600">Each scenario assumes its entered annual rate stays constant throughout its repayment schedule. This does not simulate a lender rate reset or predict future rates. Scheduled repayment includes principal and modeled interest, excluding fees and other charges.</p>
    <div className="mt-5 grid gap-5 sm:grid-cols-2">
      <CalculatorInput id="comparison-rate" label="Comparison assumed annual interest rate (%)" value={values.annualInterestRate} onChange={(value) => onChange("annualInterestRate", value)} min={0} max={100} step={0.01} error={Boolean(alternative.error)} errorId="comparison-error" />
      <CalculatorInput id="comparison-tenure" label="Comparison tenure (years)" value={values.tenureYears} onChange={(value) => onChange("tenureYears", value)} min={0} max={50} step={0.5} hint="Up to 50 years. Half-year tenures are supported. This modeling range does not establish lender availability or eligibility." error={Boolean(alternative.error)} errorId="comparison-error" />
    </div>
    {alternative.error && <p id="comparison-error" role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{alternative.error}</p>}
    <div aria-live="polite" className="mt-6">
      {metrics.length ? <>
        <p className="mb-4 text-sm text-slate-600">See how the comparison scenario changes your EMI, interest, repayment and tenure. Values are rounded for display only.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => <section key={metric.label} className="min-w-0 rounded-xl bg-slate-50 p-4 [overflow-wrap:anywhere]">
            <h3 className="font-semibold text-slate-950">{metric.label}</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div><dt className="text-slate-600">Current scenario</dt><dd className="mt-1 font-semibold text-slate-900">{metric.current}</dd></div>
              <div><dt className="text-slate-600">Comparison scenario</dt><dd className="mt-1 font-semibold text-slate-900">{metric.alternative}</dd></div>
              <div><dt className="text-slate-600">Difference</dt><dd className="mt-1 font-semibold text-slate-900">{metric.difference}</dd></div>
            </dl>
          </section>)}
        </div>
      </> : <p className="text-sm text-slate-600">Enter valid details for both scenarios to see their differences.</p>}
    </div>
  </section>;
}
