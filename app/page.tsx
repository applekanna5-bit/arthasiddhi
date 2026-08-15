"use client";

import { useMemo, useState } from "react";
import {
  calculateFromFormValues,
  formatIndianCurrency,
  type CalculatorFormValues,
} from "@/lib/calculator/loan-calculator";

const ROWS_PER_PAGE = 24;

const initialValues: CalculatorFormValues = {
  principal: "2500000",
  annualInterestRate: "8.5",
  tenureYears: "20",
};

export default function Home() {
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [schedulePage, setSchedulePage] = useState(1);

  const calculation = useMemo(() => {
    try {
      return { result: calculateFromFormValues(values), error: null };
    } catch (caughtError) {
      return {
        result: null,
        error:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to calculate this loan.",
      };
    }
  }, [values]);

  const schedule = calculation.result?.amortizationSchedule ?? [];
  const pageCount = Math.max(1, Math.ceil(schedule.length / ROWS_PER_PAGE));
  const visibleRows = schedule.slice(
    (schedulePage - 1) * ROWS_PER_PAGE,
    schedulePage * ROWS_PER_PAGE
  );

  function updateValue(field: keyof CalculatorFormValues, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setSchedulePage(1);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">
            ArthaSiddhi
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Loan EMI Calculator
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Estimate your monthly repayment and review a complete amortization schedule.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <section aria-labelledby="loan-details-heading" className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="loan-details-heading" className="text-lg font-semibold text-slate-950">
              Loan details
            </h2>
            <p className="mt-1 text-sm text-slate-600">Update any value to recalculate instantly.</p>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="principal" className="block text-sm font-medium text-slate-800">Loan amount (INR)</label>
                <div className="relative mt-2">
                  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">₹</span>
                  <input id="principal" name="principal" type="number" inputMode="decimal" min="0" max="10000000000" step="1000" value={values.principal} onChange={(event) => updateValue("principal", event.target.value)} aria-invalid={Boolean(calculation.error)} aria-describedby={calculation.error ? "calculator-error" : undefined} className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-3 pl-7 text-base shadow-xs outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100" />
                </div>
              </div>

              <div>
                <label htmlFor="annualInterestRate" className="block text-sm font-medium text-slate-800">Annual interest rate (%)</label>
                <input id="annualInterestRate" name="annualInterestRate" type="number" inputMode="decimal" min="0" max="100" step="0.01" value={values.annualInterestRate} onChange={(event) => updateValue("annualInterestRate", event.target.value)} aria-invalid={Boolean(calculation.error)} aria-describedby={calculation.error ? "calculator-error" : undefined} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base shadow-xs outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100" />
              </div>

              <div>
                <label htmlFor="tenureYears" className="block text-sm font-medium text-slate-800">Loan tenure (years)</label>
                <input id="tenureYears" name="tenureYears" type="number" inputMode="decimal" min="0" max="50" step="0.5" value={values.tenureYears} onChange={(event) => updateValue("tenureYears", event.target.value)} aria-invalid={Boolean(calculation.error)} aria-describedby={calculation.error ? "calculator-error" : undefined} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base shadow-xs outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100" />
                <p className="mt-2 text-xs leading-5 text-slate-500">Up to 50 years (600 months). Half-year tenures are supported.</p>
              </div>
            </div>

            {calculation.error && <p id="calculator-error" role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{calculation.error}</p>}
          </section>

          <section aria-labelledby="results-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="results-heading" className="text-lg font-semibold text-slate-950">Your estimated repayment</h2>
                <p className="mt-1 text-sm text-slate-600">Based on monthly reducing-balance interest.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">Illustrative estimate</span>
            </div>

            {calculation.result ? (
              <div aria-live="polite" className="mt-6 grid gap-3 sm:grid-cols-3">
                <ResultCard label="Monthly EMI" value={formatIndianCurrency(calculation.result.monthlyEmi)} emphasis />
                <ResultCard label="Total interest" value={formatIndianCurrency(calculation.result.totalInterest)} />
                <ResultCard label="Total payment" value={formatIndianCurrency(calculation.result.totalPayment)} />
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">Enter valid loan details to view your repayment estimate.</div>
            )}
          </section>
        </div>

        {calculation.result && (
          <section aria-labelledby="schedule-heading" className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:px-6">
              <div>
                <h2 id="schedule-heading" className="text-lg font-semibold text-slate-950">Amortization schedule</h2>
                <p className="mt-1 text-sm text-slate-600">Showing months {(schedulePage - 1) * ROWS_PER_PAGE + 1}–{Math.min(schedulePage * ROWS_PER_PAGE, schedule.length)} of {schedule.length}.</p>
              </div>
              <p className="text-xs text-slate-500">Values are rounded for display only.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full text-right text-sm">
                <caption className="sr-only">Monthly loan repayment schedule</caption>
                <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                  <tr><th scope="col" className="px-5 py-3 text-left sm:px-6">Month</th><th scope="col" className="px-5 py-3">EMI</th><th scope="col" className="px-5 py-3">Principal</th><th scope="col" className="px-5 py-3">Interest</th><th scope="col" className="px-5 py-3 sm:px-6">Remaining balance</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {visibleRows.map((row) => <tr key={row.month} className="hover:bg-slate-50"><th scope="row" className="px-5 py-3.5 text-left font-medium text-slate-900 sm:px-6">{row.month}</th><td className="px-5 py-3.5">{formatIndianCurrency(row.emi)}</td><td className="px-5 py-3.5">{formatIndianCurrency(row.principalComponent)}</td><td className="px-5 py-3.5">{formatIndianCurrency(row.interestComponent)}</td><td className="px-5 py-3.5 sm:px-6">{formatIndianCurrency(row.remainingBalance)}</td></tr>)}
                </tbody>
              </table>
            </div>

            {pageCount > 1 && <nav aria-label="Amortization schedule pages" className="flex items-center justify-between gap-4 border-t border-slate-200 px-5 py-4 sm:px-6"><button type="button" onClick={() => setSchedulePage((page) => Math.max(1, page - 1))} disabled={schedulePage === 1} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-3 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50">Previous</button><span aria-current="page" className="text-sm text-slate-600">Page {schedulePage} of {pageCount}</span><button type="button" onClick={() => setSchedulePage((page) => Math.min(pageCount, page + 1))} disabled={schedulePage === pageCount} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-3 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50">Next</button></nav>}
          </section>
        )}
      </div>
    </main>
  );
}

function ResultCard({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className={`rounded-xl border p-4 ${emphasis ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}><p className="text-sm text-slate-600">{label}</p><p className={`mt-2 text-xl font-bold tracking-tight ${emphasis ? "text-emerald-900" : "text-slate-900"}`}>{value}</p></div>;
}
