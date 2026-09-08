"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { calculateFromFormValues, type CalculatorFormValues } from "@/lib/calculator/loan-calculator";
import { formatIndianCurrency } from "@/lib/calculator/formatting";
import { CalculatorInput } from "./CalculatorInput";
import { CalculatorResult } from "./CalculatorResult";
import { HomeLoanComparison } from "./HomeLoanComparison";
import { calculateAlternative, compareLoanResults, selectLoanSchedule, type AlternativeLoanValues, type ScheduleScenario } from "@/lib/calculator/home-loan-comparison";

const ROWS_PER_PAGE = 24;

export function LoanCalculator({ defaults, enableComparison = false }: { defaults: CalculatorFormValues; enableComparison?: boolean }) {
  const [values, setValues] = useState(defaults);
  const [schedulePage, setSchedulePage] = useState(1);
  const [alternativeValues, setAlternativeValues] = useState<AlternativeLoanValues | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ScheduleScenario>("current");
  const comparisonUsedSent = useRef(false);
  const comparisonInitialValues = useRef<AlternativeLoanValues | null>(null);
  const comparisonOpen = enableComparison && alternativeValues !== null;
  const alternative = useMemo(() => comparisonOpen ? calculateAlternative(values.principal, alternativeValues) : { result: null, error: null }, [comparisonOpen, values.principal, alternativeValues]);
  const toggleComparison = () => {
    const nextAlternative = { annualInterestRate: values.annualInterestRate, tenureYears: values.tenureYears };
    if (!comparisonOpen) comparisonInitialValues.current = nextAlternative;
    setAlternativeValues(comparisonOpen ? null : nextAlternative);
    setSelectedScenario("current");
    setSchedulePage(1);
  };
  const updateAlternative = (field: keyof AlternativeLoanValues, value: string) => {
    setAlternativeValues((current) => current ? { ...current, [field]: value } : null);
    setSchedulePage(1);
  };
  const calculation = useMemo(() => { try { return { result: calculateFromFormValues(values), error: null }; } catch (error) { return { result: null, error: error instanceof Error ? error.message : "Unable to calculate this loan." }; } }, [values]);
  useEffect(() => {
    const initial = comparisonInitialValues.current;
    if (comparisonUsedSent.current || !comparisonOpen || !initial || !alternativeValues || !calculation.result || !alternative.result) return;
    const changedFromInitialization = alternativeValues.annualInterestRate !== initial.annualInterestRate || alternativeValues.tenureYears !== initial.tenureYears;
    const differences = compareLoanResults(calculation.result, alternative.result);
    const meaningfullyDifferent = differences && (differences.monthlyEmi !== 0 || differences.totalInterest !== 0 || differences.totalPayment !== 0 || differences.tenureMonths !== 0);
    if (!changedFromInitialization || !meaningfullyDifferent) return;
    if (trackEvent("loan_comparison_used", { calculator_slug: "home-loan", comparison_mode: "tenure_rate" })) comparisonUsedSent.current = true;
  }, [alternative, alternativeValues, calculation.result, comparisonOpen]);
  const schedule = selectLoanSchedule(calculation.result, alternative.result, comparisonOpen ? selectedScenario : "current");
  const pageCount = Math.max(1, Math.ceil(schedule.length / ROWS_PER_PAGE));
  const visibleRows = schedule.slice((schedulePage - 1) * ROWS_PER_PAGE, schedulePage * ROWS_PER_PAGE);
  const update = (field: keyof CalculatorFormValues) => (value: string) => { setValues((current) => ({ ...current, [field]: value })); setSchedulePage(1); };
  return <><div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"><section aria-labelledby="loan-details" className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 id="loan-details" className="text-lg font-semibold text-slate-950">Loan details</h2><div className="mt-6 space-y-5"><CalculatorInput id="principal" label="Loan amount (INR)" value={values.principal} onChange={update("principal")} min={0} max={10000000000} step={1000} prefix="₹" error={Boolean(calculation.error)} errorId="loan-error" /><CalculatorInput id="annualInterestRate" label="Annual interest rate (%)" value={values.annualInterestRate} onChange={update("annualInterestRate")} min={0} max={100} step={0.01} error={Boolean(calculation.error)} errorId="loan-error" /><CalculatorInput id="tenureYears" label="Loan tenure (years)" value={values.tenureYears} onChange={update("tenureYears")} min={0} max={50} step={0.5} hint="Up to 50 years. Half-year tenures are supported." error={Boolean(calculation.error)} errorId="loan-error" /></div>{calculation.error && <p id="loan-error" role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{calculation.error}</p>}</section><section aria-labelledby="loan-results" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 id="loan-results" className="text-lg font-semibold text-slate-950">Your estimated repayment</h2><p className="mt-1 text-sm text-slate-600">Based on monthly reducing-balance interest.</p>{calculation.result ? <div aria-live="polite" className="mt-6"><div className="grid gap-3 sm:grid-cols-3"><CalculatorResult label="Monthly EMI" value={formatIndianCurrency(calculation.result.monthlyEmi)} emphasis /><CalculatorResult label="Total interest" value={formatIndianCurrency(calculation.result.totalInterest)} /><CalculatorResult label="Total payment" value={formatIndianCurrency(calculation.result.totalPayment)} /></div><p className="mt-4 text-sm leading-6 text-slate-700">The monthly EMI is {formatIndianCurrency(calculation.result.monthlyEmi)}. Over the full tenure, total interest comes to {formatIndianCurrency(calculation.result.totalInterest)}.</p></div> : <p className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">Enter valid loan details to view your repayment estimate.</p>}</section></div>{enableComparison && <div className="mt-6">
    {!comparisonOpen && <button type="button" aria-expanded={false} onClick={() => { trackEvent("loan_comparison_open", { calculator_slug: "home-loan", comparison_mode: "tenure_rate" }); toggleComparison(); }} className="min-h-11 rounded-lg border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-800 focus:outline-none focus:ring-3 focus:ring-emerald-100">Compare another scenario</button>}
    {comparisonOpen && <HomeLoanComparison values={alternativeValues} onChange={updateAlternative} onClose={toggleComparison} current={calculation.result} alternative={alternative} />}
  </div>}{comparisonOpen && <div className="mt-6">
    <label htmlFor="schedule-scenario" className="block text-sm font-medium text-slate-800">Schedule to inspect</label>
    <select id="schedule-scenario" value={selectedScenario} onChange={(event) => { setSelectedScenario(event.target.value as ScheduleScenario); setSchedulePage(1); }} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base focus:outline-none focus:ring-3 focus:ring-emerald-100 sm:w-auto">
      <option value="current">Current scenario</option><option value="comparison">Comparison scenario</option>
    </select>
    <p role="status" className="mt-2 text-sm text-slate-600">{selectedScenario === "current" ? "Current scenario" : "Comparison scenario"} schedule{schedule.length ? "." : " is unavailable. Enter valid details for this scenario."}</p>
  </div>}{schedule.length > 0 && <section aria-labelledby="schedule-heading" className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:px-6"><div><h2 id="schedule-heading" className="text-lg font-semibold text-slate-950">Amortization schedule</h2><p className="mt-1 text-sm text-slate-600">Showing months {(schedulePage - 1) * ROWS_PER_PAGE + 1}–{Math.min(schedulePage * ROWS_PER_PAGE, schedule.length)} of {schedule.length}.</p></div><p className="text-xs text-slate-500">Values are rounded for display only.</p></div><div className="overflow-x-auto"><table className="min-w-[720px] w-full text-right text-sm"><caption className="sr-only">{comparisonOpen ? `${selectedScenario === "current" ? "Current" : "Comparison"} scenario monthly loan repayment schedule` : "Monthly loan repayment schedule"}</caption><thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-600 uppercase"><tr><th scope="col" className="px-5 py-3 text-left sm:px-6">Month</th><th scope="col" className="px-5 py-3">EMI</th><th scope="col" className="px-5 py-3">Principal</th><th scope="col" className="px-5 py-3">Interest</th><th scope="col" className="px-5 py-3 sm:px-6">Remaining balance</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-700">{visibleRows.map((row) => <tr key={row.month}><th scope="row" className="px-5 py-3.5 text-left font-medium text-slate-900 sm:px-6">{row.month}</th><td className="px-5 py-3.5">{formatIndianCurrency(row.emi)}</td><td className="px-5 py-3.5">{formatIndianCurrency(row.principalComponent)}</td><td className="px-5 py-3.5">{formatIndianCurrency(row.interestComponent)}</td><td className="px-5 py-3.5 sm:px-6">{formatIndianCurrency(row.remainingBalance)}</td></tr>)}</tbody></table></div>{pageCount > 1 && <nav aria-label="Amortization schedule pages" className="flex items-center justify-between gap-4 border-t border-slate-200 px-5 py-4 sm:px-6"><button type="button" onClick={() => setSchedulePage((page) => Math.max(1, page - 1))} disabled={schedulePage === 1} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-3 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50">Previous</button><span aria-current="page" className="text-sm text-slate-600">Page {schedulePage} of {pageCount}</span><button type="button" onClick={() => setSchedulePage((page) => Math.min(pageCount, page + 1))} disabled={schedulePage === pageCount} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-3 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50">Next</button></nav>}</section>}</>;
}
