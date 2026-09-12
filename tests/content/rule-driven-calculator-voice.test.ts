import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("components/calculator/RuleDrivenCalculator.tsx", "utf8");

describe("Batch B3 rule-driven calculator voice", () => {
  it("removes shared narration and keeps the quiet disclaimer link", () => {
    expect(source).not.toContain("Update any value to recalculate instantly.");
    expect(source).toContain("Read the <Link");
    expect(source).toContain(">Financial Disclaimer</Link>.");
  });

  it("retains official-source guidance and live regions for the primary result and optional tax comparison", () => {
    expect(source).toContain("verify current rules before making an actual decision");
    expect(source.match(/aria-live="polite"/g)).toHaveLength(2);
  });

  it("keeps the shortened income label beside complete scope help", () => {
    expect(source).toContain('label="Taxable ordinary income (INR)"');
    expect(source).toContain("Enter the amount after applicable deductions and exemptions. This calculator does not determine them.");
    expect(source).toContain("Income above ₹50,00,000 is outside scope because surcharge is not supported.");
    expect(source).toContain('resultsTitle="Estimated income tax"');
  });

  it("binds the income-tax interpretation to income, regime and total tax", () => {
    expect(source).toContain("formatIndianCurrency(calculation.result.taxableIncome)");
    expect(source).toContain('calculation.result.regime === "new" ? "new" : "old"');
    expect(source).toContain("estimated total tax including cess is ${formatIndianCurrency(calculation.result.totalTax)}");
  });

  it("keeps one GST classification warning beside the rate", () => {
    expect(source).toContain("Enter the applicable rate. Presets are not a complete rate list and do not determine HSN/SAC classification.");
    expect(source.match(/HSN\/SAC classification/g)).toHaveLength(1);
  });

  it("includes both GST interpretation modes and material limitations", () => {
    expect(source).toContain("GST of ${formatIndianCurrency(calculation.result.totalGst)} takes the taxable value");
    expect(source).toContain("Of the GST-inclusive total of ${formatIndianCurrency(calculation.result.invoiceTotal)}");
    expect(source).toContain("Cess, special valuation situations, place-of-supply analysis, and return filing are outside scope.");
    expect(source).toContain("Transaction value and place-of-supply rules can affect actual tax treatment");
  });

  it("keeps the EPF rate explicitly assumed and binds the employer split", () => {
    expect(source).toContain('label="Assumed EPF annual interest rate (%)"');
    expect(source).toContain("Enter the rate for this projection. Future notified rates may differ.");
    expect(source).toContain("formatIndianCurrency(calculation.result.monthlyEmployerTotal)");
    expect(source).toContain("formatIndianCurrency(calculation.result.monthlyEmployerEps)");
    expect(source).toContain("formatIndianCurrency(calculation.result.monthlyEmployerEpf)");
    expect(source).toContain("formatIndianCurrency(calculation.result.closingBalance)");
  });

  it("retains EPF ceiling, statutory and passbook limitations", () => {
    expect(source).toContain("wages above the statutory ceiling");
    expect(source).toContain("EDLI and administrative charges are not included");
    expect(source).toContain("will not exactly reproduce EPFO passbook accounting");
  });

  it("presents EPS diversion as a projection assumption rather than eligibility", () => {
    expect(source).toContain('label="Include EPS diversion in projection"');
    expect(source).toContain("it does not determine statutory EPS eligibility");
    expect(source).not.toContain('label="EPS eligibility"');
  });

  it("keeps the NPS 20% minimum without advisory language", () => {
    expect(source).toContain("The configured All Citizen Model normal-exit minimum is 20%, subject to the rules applicable at exit.");
    expect(source).not.toContain("conservative");
    expect(source).toContain("Used only to estimate annuity income; it is not a guaranteed rate.");
  });

  it("keeps the current NPS age ceiling synchronized in the UI", () => {
    expect(source).toContain('id="currentAge" label="Current age" value={values.currentAge} onChange={set("currentAge")} min={18} max={84}');
    expect(source).toContain('id="retirementAge" label="Retirement age" value={values.retirementAge} onChange={set("retirementAge")} min={19} max={85}');
  });

  it("binds all NPS allocation values and rejects a pension guarantee", () => {
    expect(source).toContain("formatIndianCurrency(calculation.result.retirementCorpus)");
    expect(source).toContain("formatIndianCurrency(calculation.result.lumpSumCorpus)");
    expect(source).toContain("formatIndianCurrency(calculation.result.annuityCorpus)");
    expect(source).toContain("formatIndianCurrency(calculation.result.estimatedMonthlyAnnuity)");
    expect(source).toContain("—not a guaranteed pension.");
  });

  it("retains NPS category, corpus, market, exception, tax and exit limits", () => {
    expect(source).toContain("subscriber category, corpus, vesting period");
    expect(source).toContain("NPS is market-linked");
    expect(source).toContain("Small-corpus or full-withdrawal exceptions may exist");
    expect(source).toContain("Tax treatment and legal exit eligibility are outside scope.");
  });
});

describe("Income Tax comparison semantics", () => {
  const comparison = source.slice(source.indexOf('<section aria-labelledby="income-tax-comparison-heading"'), source.indexOf('function GstCalculator'));

  it("makes the same-income assumption and material exclusions visible beside the comparison", () => {
    expect(comparison).toContain("same already-determined taxable ordinary income under both regimes");
    expect(comparison).toContain("Actual taxable income may differ between Old and New regimes");
    expect(comparison).toContain("does not derive deductions, exemptions, HRA, or standard deduction");
    expect(comparison).toContain("does not calculate special-rate income or surcharge");
    expect(comparison).toContain("educational estimate, not personalized tax advice or a filing computation");
    expect(comparison).toContain("Age affects the Old Regime calculation; current New Regime slabs are age-independent");
    expect(comparison).toContain("regardless of the selected tax regime");
  });

  it.each(["best regime", "recommended regime", "choose this regime", "guaranteed savings", "personalized recommendation", "you should choose", "you save"])("rejects advisory wording: %s", (phrase) => {
    expect(comparison.toLowerCase()).not.toContain(phrase);
  });

  it("provides optional disclosure and replaces invalid comparison results", () => {
    expect(source).toContain("const [comparisonOpen, setComparisonOpen] = useState(false)");
    expect(comparison).toContain('aria-expanded={comparisonOpen} aria-controls="income-tax-comparison"');
    expect(comparison).toContain("<IncomeTaxComparison result={calculation.result} />");
    expect(comparison).toContain("Enter valid taxable ordinary income and age details above to compare both regimes.");
    expect(comparison).toContain('scope="col"');
    expect(comparison).toContain('scope="row"');
  });

  it("links deliberately to the existing input and rebate guides", () => {
    expect(comparison).toContain('href="/learn/tax/gross-income-vs-taxable-income"');
    expect(comparison).toContain('href="/learn/tax/section-87a-rebate"');
    expect(comparison).not.toContain("old-vs-new-tax-regime");
  });
});
