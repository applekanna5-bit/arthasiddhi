import { calculateEpf } from "../../calculator/rule-driven-calculators";
import { formatIndianCurrency, formatPercentage } from "../../calculator/formatting";
import { epfRuleSet } from "../../financial-rules/rule-sets";
import type { Article } from "../types";

const standardInput = { monthlyEpfWage: 15_000, currentEpfBalance: 0, employeeContributionRate: 12, employerContributionRate: 12, annualInterestRate: 8.25, projectionYears: 10, epsEligible: true };
const standardExample = calculateEpf(standardInput, epfRuleSet);
const aboveCeilingInput = { ...standardInput, monthlyEpfWage: 30_000, currentEpfBalance: 250_000, projectionYears: 5 };
const aboveCeilingExample = calculateEpf(aboveCeilingInput, epfRuleSet);
const epsDisabledInput = { ...standardInput, monthlyEpfWage: 10_000, annualInterestRate: 0, projectionYears: 1, epsEligible: false };
const epsDisabledExample = calculateEpf(epsDisabledInput, epfRuleSet);

export const epfArticles = [
  {
    title: "EPF Explained: Employee Contributions, Employer Share and Balance Growth",
    slug: "epf-explained",
    description: "Understand employee EPF, the employer EPF and EPS allocation, projected balance growth, and why a calculator differs from EPFO accounting.",
    category: "retirement",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "8 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: "epf-schemes-contributions-2026-08" },
    primaryCalculator: "epf",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["epf-contribution-calculation", "epf-calculator-projection-assumptions"],
    sections: [
      {
        id: "what-epf-is",
        heading: "EPF combines member savings with an employer-side allocation",
        paragraphs: [
          "The Employees' Provident Funds Scheme, 1952 provides a workplace provident-fund framework administered by EPFO. Contributions depend on the applicable wage, rate, membership and employment context; the balance is not produced by one universal payroll pattern.",
          "The ArthaSiddhi calculator accepts a monthly EPF wage, separate employee and employer rates, an opening balance, an EPS-diversion assumption, an entered annual interest rate and a whole-year duration. It is a simplified projection rather than an EPFO payroll or passbook engine.",
        ],
      },
      {
        id: "contribution-parts",
        heading: "Employee EPF and employer allocation are separate result parts",
        paragraphs: [
          "Employee EPF is the entered wage multiplied by the entered employee rate. The modeled employer total is the same wage multiplied by the entered employer rate. When EPS diversion is included, the engine allocates no more than the available employer total to EPS and leaves the remainder as employer EPF.",
          "Official Government material shows 12% as the standard contribution context. A 10% rate applies only where the relevant establishment or class is legally eligible under applicable notifications and rules. EPS application and higher-wage contributions have additional conditions, so the calculator inputs are assumptions rather than legal classifications.",
          "For International Workers, the Karnataka High Court invalidated the special provisions while the Delhi High Court upheld the framework; Supreme Court proceedings remain pending, and no final nationwide determination was located as of 28 August 2026. Treatment can also depend on an applicable Social Security Agreement and detached-worker circumstances. This calculator does not determine an individual's statutory International Worker contribution liability.",
          [
            { text: "See the allocation examples in " },
            { text: "How EPF Contributions Are Calculated", link: { kind: "article", slug: "epf-contribution-calculation" } },
            { text: "." },
          ],
        ],
      },
      {
        id: "worked-example",
        heading: "A ten-year projection using standard illustrative inputs",
        paragraphs: [
          `This engine-derived scenario uses an entered EPF wage of ${formatIndianCurrency(standardInput.monthlyEpfWage)}, employee and employer rates of ${formatPercentage(standardInput.employeeContributionRate)}, EPS diversion enabled and a constant ${formatPercentage(standardInput.annualInterestRate)} annual interest assumption for ten years. The rate is an editable projection input, not a promise about future notified rates.`,
        ],
        table: {
          caption: "Engine-derived EPF contribution and balance projection",
          headers: ["Employee EPF/month", "Employer EPF/month", "EPS/month", "Employee total", "Employer EPF total", "EPS total", "Estimated growth", "Closing EPF balance"],
          rows: [[formatIndianCurrency(standardExample.monthlyEmployeeEpf), formatIndianCurrency(standardExample.monthlyEmployerEpf), formatIndianCurrency(standardExample.monthlyEmployerEps), formatIndianCurrency(standardExample.totalEmployeeEpfContributions), formatIndianCurrency(standardExample.totalEmployerEpfContributions), formatIndianCurrency(standardExample.totalEpsDiversion), formatIndianCurrency(standardExample.estimatedGrowth), formatIndianCurrency(standardExample.closingBalance)]],
        },
      },
      {
        id: "projection-boundary",
        heading: "Projected balance and actual EPFO accounting answer different questions",
        paragraphs: [
          "The projection starts with the entered current EPF balance, adds employee and employer EPF at the beginning of each modeled month and applies the entered annual rate divided by 12. Estimated growth is the closing balance less the opening balance and modeled EPF contributions.",
          "Actual records can differ because EPFO uses notified annual interest, payroll dates and statutory rounding, while employment events, contribution changes, passbook posting and account adjustments are outside this model. EPS diversion is not an EPS pension estimate.",
          [
            { text: "Review every difference in " },
            { text: "EPF Calculator Projection Assumptions", link: { kind: "article", slug: "epf-calculator-projection-assumptions" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Model your own inputs",
          text: [
            { text: "Use the " },
            { text: "EPF Calculator", link: { kind: "calculator", slug: "epf" } },
            { text: " to compare projection assumptions rather than predict an EPFO statement." },
          ],
        },
      },
    ],
    faq: [
      { question: "Is 12% the contribution rate in every EPF situation?", answer: "No. Official Government material identifies a standard 12% context. A 10% rate applies only where the relevant establishment or class is legally eligible under applicable notifications and rules; this calculator does not determine that eligibility." },
      { question: "Does the projected closing balance match an EPFO passbook exactly?", answer: "No. The calculator uses beginning-of-month additions and monthly projection compounding without reproducing payroll timing, statutory rounding or EPFO annual interest crediting." },
      { question: "Does the EPS amount calculate a pension?", answer: "No. It is only a modeled employer-contribution diversion. Pensionable salary, service and EPS pension rules are not calculated." },
    ],
  },
  {
    title: "How EPF Contributions Are Calculated: Employee, Employer and EPS Shares",
    slug: "epf-contribution-calculation",
    description: "How the calculator separates employee EPF, total employer contribution, employer EPF and an optional ceiling-based EPS diversion.",
    category: "retirement",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "8 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: "epf-schemes-contributions-2026-08" },
    primaryCalculator: "epf",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["epf-explained", "epf-calculator-projection-assumptions"],
    sections: [
      {
        id: "employee-employer",
        heading: "The employee amount and employer allocation use separate inputs",
        paragraphs: [
          "The calculator multiplies the entered monthly EPF wage by the entered employee rate for employee EPF. It separately multiplies that wage by the employer rate to obtain the total modeled employer contribution.",
          "Those rates default to 12% for a standard illustration, but 12% is not universal. A 10% rate applies only where the relevant establishment or class is legally eligible under applicable notifications and rules; the calculator does not determine that eligibility. Voluntary employee contributions do not automatically require an employer to match the excess.",
        ],
      },
      {
        id: "standard-allocation",
        heading: "The standard example separates EPF accumulation from EPS diversion",
        paragraphs: [
          "With EPS diversion included, the candidate is 8.33% of the lower of entered wage and the configured ₹15,000 EPS ceiling. The engine caps that candidate at the total employer contribution available, then allocates the remainder to employer EPF. This guarantees that employer EPF plus EPS equals the modeled employer total.",
          "The familiar 3.67% shorthand is not a universal employer EPF result. Rates, wage context, EPS application and rounding can change the actual allocation.",
        ],
        table: {
          caption: "Standard engine-derived monthly allocation",
          headers: ["Entered wage", "Employee EPF", "Employer total", "Employer EPF", "EPS diversion"],
          rows: [[formatIndianCurrency(standardInput.monthlyEpfWage), formatIndianCurrency(standardExample.monthlyEmployeeEpf), formatIndianCurrency(standardExample.monthlyEmployerTotal), formatIndianCurrency(standardExample.monthlyEmployerEpf), formatIndianCurrency(standardExample.monthlyEmployerEps)]],
        },
      },
      {
        id: "ceiling-example",
        heading: "A wage above ₹15,000 does not increase the modeled EPS candidate",
        paragraphs: [
          "In this controlled example, the entered wage is ₹30,000 but the EPS candidate continues to use the configured ₹15,000 ceiling. Employee and total employer contributions use the full entered EPF wage because the calculator treats it as the wage selected for projection.",
          "That input does not establish permission or obligation to contribute on higher wages. The ordinary higher-wage framework includes a joint-request process and employer-specific circumstances that the calculator does not decide.",
        ],
        table: {
          caption: "Engine-derived allocation with entered wage above the EPS ceiling",
          headers: ["Entered wage", "Employee EPF/month", "Employer total/month", "Employer EPF/month", "EPS/month", "Five-year EPS total"],
          rows: [[formatIndianCurrency(aboveCeilingInput.monthlyEpfWage), formatIndianCurrency(aboveCeilingExample.monthlyEmployeeEpf), formatIndianCurrency(aboveCeilingExample.monthlyEmployerTotal), formatIndianCurrency(aboveCeilingExample.monthlyEmployerEpf), formatIndianCurrency(aboveCeilingExample.monthlyEmployerEps), formatIndianCurrency(aboveCeilingExample.totalEpsDiversion)]],
        },
      },
      {
        id: "eps-disabled",
        heading: "Disabling EPS sends the modeled employer total to EPF",
        paragraphs: [
          "When the projection excludes EPS diversion, the EPS amount is zero and the complete modeled employer contribution goes to employer EPF. This is an arithmetic assumption, not a determination that EPS does or does not legally apply.",
        ],
        table: {
          caption: "Engine-derived one-year projection with EPS diversion excluded",
          headers: ["Entered wage", "Employer total/month", "Employer EPF/month", "EPS/month", "Employer EPF total"],
          rows: [[formatIndianCurrency(epsDisabledInput.monthlyEpfWage), formatIndianCurrency(epsDisabledExample.monthlyEmployerTotal), formatIndianCurrency(epsDisabledExample.monthlyEmployerEpf), formatIndianCurrency(epsDisabledExample.monthlyEmployerEps), formatIndianCurrency(epsDisabledExample.totalEmployerEpfContributions)]],
        },
        callout: {
          title: "Compare allocations",
          text: [
            { text: "Change the rates and EPS-diversion assumption in the " },
            { text: "EPF Calculator", link: { kind: "calculator", slug: "epf" } },
            { text: ", then return to " },
            { text: "EPF Explained", link: { kind: "article", slug: "epf-explained" } },
            { text: " for interpretation." },
          ],
        },
      },
      {
        id: "actual-payroll",
        heading: "Actual payroll allocation requires statutory and employment context",
        paragraphs: [
          "The calculator does not determine EPF or EPS membership, qualifying reduced-rate eligibility, higher-wage approvals, exempt-establishment treatment or statutory payroll rounding.",
          "For International Workers, the Karnataka High Court invalidated the special provisions while the Delhi High Court upheld the framework; Supreme Court proceedings remain pending, and no final nationwide determination was located as of 28 August 2026. Social Security Agreement and detached-worker circumstances may also matter, so the calculator does not determine statutory International Worker contribution liability.",
          [
            { text: "For the wider model boundary, read " },
            { text: "Why an EPF Calculator Projection May Differ From Your Actual Balance", link: { kind: "article", slug: "epf-calculator-projection-assumptions" } },
            { text: "." },
          ],
        ],
      },
    ],
    faq: [
      { question: "Does every employer contribute 3.67% to EPF?", answer: "No. That shorthand assumes a particular contribution and EPS context. Entered rates, EPS application, wage treatment and statutory circumstances can change the allocation." },
      { question: "Why is EPS not included in the projected EPF balance?", answer: "The calculator treats EPS as a diversion from the modeled employer contribution, so only employee EPF and employer EPF accumulate in the projected EPF balance." },
      { question: "Does selecting EPS diversion confirm eligibility?", answer: "No. It controls the projection allocation only and does not determine statutory EPS membership or pension eligibility." },
    ],
  },
  {
    title: "Why an EPF Calculator Projection May Differ From Your Actual Balance",
    slug: "epf-calculator-projection-assumptions",
    description: "Understand the constant-rate monthly projection convention and why payroll timing, EPFO interest crediting and account events can produce different balances.",
    category: "retirement",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "epf",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 50,
    relatedCalculators: [],
    relatedArticles: ["epf-explained", "epf-contribution-calculation"],
    sections: [
      {
        id: "constant-inputs",
        heading: "The calculator holds wage, rates and monthly contributions constant",
        paragraphs: [
          "The entered EPF wage and employee and employer contribution rates remain unchanged for every modeled month. Salary revisions, missed contributions, employer changes and payroll corrections are not simulated.",
          "The entered opening balance is included from the first month. Each modeled employee and employer EPF contribution is added at the beginning of the month before that month's projection interest is applied.",
        ],
      },
      {
        id: "interest-convention",
        heading: "Monthly projection compounding is not EPFO annual interest crediting",
        paragraphs: [
          "ArthaSiddhi divides the entered annual interest assumption by 12 and applies that constant monthly rate throughout the selected whole-year duration. It does not vary the rate by financial year or reconstruct EPFO's annual interest-credit process.",
          "Actual notified rates can change between years. A default or entered rate is a scenario input, not a guaranteed future EPF rate, maturity amount or account return.",
        ],
      },
      {
        id: "accounting-differences",
        heading: "Payroll and passbook records contain timing and rounding the model omits",
        list: [
          "Actual contribution dates and passbook posting can differ from beginning-of-month modeling.",
          "Statutory contribution rounding is not reproduced; the engine retains floating-point precision and the UI formats currency to two decimals.",
          "Employer-specific payroll treatment and corrections are not modeled.",
          "EPS allocation depends on statutory context; the toggle is only a projection assumption.",
          "Higher-wage arrangements and exempt establishments are outside scope. International Worker coverage and wage-base treatment are also outside scope: the Karnataka High Court invalidated the special provisions, the Delhi High Court upheld the framework, Supreme Court proceedings remain pending, and Social Security Agreement or detached-worker circumstances may affect the position.",
          "Withdrawals, transfers, taxes, EDLI, fees, charges and other account events are not calculated.",
        ],
      },
      {
        id: "not-a-quote",
        heading: "Read the result as an illustration, not an account entitlement",
        paragraphs: [
          "The closing balance is not a guaranteed EPF maturity amount, exact EPFO passbook forecast or actual payroll calculation. The EPS diversion is not an EPS pension quote, and the calculator does not determine withdrawal eligibility or tax treatment.",
          [
            { text: "Return to " },
            { text: "EPF Explained", link: { kind: "article", slug: "epf-explained" } },
            { text: " or inspect the " },
            { text: "contribution allocation", link: { kind: "article", slug: "epf-contribution-calculation" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Test projection sensitivity",
          text: [
            { text: "Use the " },
            { text: "EPF Calculator", link: { kind: "calculator", slug: "epf" } },
            { text: " to change one assumption at a time." },
          ],
        },
      },
    ],
    faq: [
      { question: "Does the calculator reproduce EPFO interest crediting?", answer: "No. It uses a constant monthly-equivalent projection rate, while actual EPFO interest is notified and credited under a different annual accounting process." },
      { question: "Why can my passbook balance differ from the projection?", answer: "Contribution dates, changing wages and rates, payroll rounding, posting timing, account events and notified interest can all differ from the simplified inputs." },
      { question: "Does the result determine EPS pension, withdrawal or tax?", answer: "No. The calculator provides none of those calculations or eligibility determinations." },
    ],
  },
] satisfies readonly Article[];
