import { calculateStepUpSip } from "../../calculator/expanded-calculators";
import { formatIndianCurrency, formatPercentage } from "../../calculator/formatting";
import type { Article } from "../types";

const baseInput = { startingMonthlyInvestment: 5_000, annualStepUpRate: 10, investmentYears: 10 };
const example = calculateStepUpSip({ ...baseInput, annualReturnRate: 12 });
const sensitivity = [8, 10, 12].map((annualReturnRate) => ({ annualReturnRate, result: calculateStepUpSip({ ...baseInput, annualReturnRate }) }));

const projectionRow = (result: ReturnType<typeof calculateStepUpSip>) => [formatIndianCurrency(result.totalInvested), formatIndianCurrency(result.estimatedReturns), formatIndianCurrency(result.futureValue), formatIndianCurrency(result.finalMonthlyInvestment)];

export const stepUpSipArticles = [
  {
    title: "Step-up SIP Explained: Contributions, Annual Increase and Projected Value",
    slug: "step-up-sip-explained",
    description: "Understand how a Step-up SIP increases contributions annually and how the calculator separates invested capital from projected growth.",
    category: "investments",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "step-up-sip",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["step-up-sip-calculation", "step-up-sip-projection-assumptions", "fixed-sip-vs-step-up-sip"],
    sections: [
      { id: "answer", heading: "A Step-up SIP raises the monthly contribution on an annual schedule", paragraphs: ["The ArthaSiddhi Step-up SIP Calculator starts with a monthly contribution, increases it after each completed 12-month block by the entered step-up percentage, and projects the result at one entered annual return.", [{ text: "Use the " }, { text: "Step-up SIP Calculator", link: { kind: "calculator", slug: "step-up-sip" } }, { text: " to see how changing the contribution schedule changes the projection." }]] },
      { id: "inputs", heading: "The projection uses four assumptions", list: ["Starting monthly investment", "Annual step-up percentage", "Entered annual return assumption", "Whole-year investment duration"], paragraphs: ["Contributions are modeled at the beginning of each month. The annual step-up changes the contribution only after the prior 12-month block has completed."] },
      { id: "example", heading: "Engine-derived example: ₹5,000 starting contribution, 10% annual step-up and 12% entered return", paragraphs: [`For 10 years, the engine produces total invested capital of ${formatIndianCurrency(example.totalInvested)}, projected growth of ${formatIndianCurrency(example.estimatedReturns)}, and a projected future value of ${formatIndianCurrency(example.futureValue)}. The final modeled monthly contribution is ${formatIndianCurrency(example.finalMonthlyInvestment)}.`], table: { caption: "Engine-derived Step-up SIP projection", headers: ["Total invested", "Projected growth", "Projected future value", "Final monthly contribution"], rows: [projectionRow(example)] } },
      { id: "capital-growth", heading: "More projected value can reflect more contributed capital as well as growth", paragraphs: ["A Step-up SIP changes the amount invested over time. A higher projected value therefore cannot be attributed only to superior investment performance: part of the difference may come from the additional contributions themselves.", [{ text: "For the exact monthly sequence, read " }, { text: "How Step-up SIP Is Calculated", link: { kind: "article", slug: "step-up-sip-calculation" } }, { text: ". The existing " }, { text: "Fixed SIP vs Step-up SIP", link: { kind: "article", slug: "fixed-sip-vs-step-up-sip" } }, { text: " article remains the comparison guide." }]] },
      { id: "limits", heading: "This is a projection, not a promise about future value", paragraphs: ["The calculator holds the entered return constant, uses its beginning-of-month contribution convention and applies a fixed annual step-up schedule. Actual returns, contribution dates and investor decisions can differ.", [{ text: "Review those assumptions in " }, { text: "Step-up SIP Projection Assumptions", link: { kind: "article", slug: "step-up-sip-projection-assumptions" } }, { text: "." }]] },
    ],
    faq: [
      { question: "Does a Step-up SIP increase the return rate each year?", answer: "No. The calculator increases the contribution by the entered annual step-up percentage. The entered annual return remains the projection assumption throughout." },
      { question: "Does a higher projected value mean better investment performance?", answer: "Not necessarily. A Step-up SIP also contributes more capital over time, so the result reflects both contributions and modeled growth." },
      { question: "Are Step-up SIP projections guaranteed?", answer: "No. The result is an assumption-based projection and is not a guaranteed future value or return." },
    ],
  },
  {
    title: "How Step-up SIP Is Calculated: Monthly Contributions and Annual Step-up",
    slug: "step-up-sip-calculation",
    description: "Trace the Step-up SIP calculator's beginning-of-month contributions, monthly compounding and annual contribution increases.",
    category: "investments",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "step-up-sip",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["step-up-sip-explained", "step-up-sip-projection-assumptions", "fixed-sip-vs-step-up-sip"],
    sections: [
      { id: "sequence", heading: "The calculator models each month in sequence", paragraphs: ["The starting monthly investment is added at the beginning of the month. The entered annual return is converted to a monthly rate, and the balance plus that month's contribution is compounded using that rate.", [{ text: "Use the " }, { text: "Step-up SIP Calculator", link: { kind: "calculator", slug: "step-up-sip" } }, { text: " to inspect the same inputs." }], "The engine keeps full internal floating-point precision. Existing Indian-currency formatting controls what is displayed."] },
      { id: "step-up", heading: "The first annual step-up applies after the first 12-month block", paragraphs: ["Months 1 through 12 use the starting contribution. At the beginning of month 13, the monthly contribution increases by the entered annual step-up percentage. The same timing repeats after each completed 12-month block.", "This means the annual increase changes future contributions; it does not retroactively change earlier monthly investments."] },
      { id: "example", heading: "The 10-year example separates capital from projected growth", paragraphs: [`Using a starting monthly contribution of ${formatIndianCurrency(baseInput.startingMonthlyInvestment)}, a ${formatPercentage(baseInput.annualStepUpRate)} annual step-up, a ${formatPercentage(12)} entered annual return and ${baseInput.investmentYears} years, the engine returns the following values.`], table: { caption: "Engine-derived Step-up SIP calculation", headers: ["Total invested", "Projected growth", "Projected future value", "Final monthly contribution"], rows: [projectionRow(example)] } },
      { id: "scope", heading: "The calculation does not model changing market returns or investor behavior", paragraphs: ["The engine uses one constant entered return and a fixed annual contribution schedule. It does not model fees, taxes, pauses, missed payments, withdrawals, variable returns or fund performance.", [{ text: "For interpretation limits, read " }, { text: "Step-up SIP Projection Assumptions", link: { kind: "article", slug: "step-up-sip-projection-assumptions" } }, { text: ". The existing " }, { text: "Fixed SIP vs Step-up SIP", link: { kind: "article", slug: "fixed-sip-vs-step-up-sip" } }, { text: " article covers the comparison intent." }]] },
    ],
    faq: [
      { question: "When does the first Step-up SIP increase happen?", answer: "After the first completed 12-month block, at the start of month 13 in the calculator's sequence." },
      { question: "Are contributions made at the beginning or end of each month?", answer: "The engine models each contribution at the beginning of the month before applying that month's assumed return." },
    ],
  },
  {
    title: "Step-up SIP Projection Assumptions: What the Calculator Does and Does Not Predict",
    slug: "step-up-sip-projection-assumptions",
    description: "Understand the constant-return, annual-step-up and beginning-of-month assumptions behind a Step-up SIP projection.",
    category: "investments",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "step-up-sip",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 50,
    relatedCalculators: [],
    relatedArticles: ["step-up-sip-explained", "step-up-sip-calculation", "fixed-sip-vs-step-up-sip"],
    sections: [
      { id: "assumptions", heading: "The projection holds the main assumptions steady", list: ["One constant entered annual return converted to a monthly rate", "A fixed annual step-up percentage", "Beginning-of-month contributions", "A whole-year modeled tenure", "Full internal precision with currency rounding only for display"], paragraphs: ["The annual step-up schedule is mathematical: it increases the contribution after each completed 12-month block. It is not a prediction that an investor will or can increase contributions in that way."] },
      { id: "sensitivity", heading: "Changing only the entered return changes the projection", paragraphs: ["The following controlled scenarios use the same ₹5,000 starting contribution, 10% annual step-up and 10-year duration. Only the illustrative return assumption changes; none of these rates represents an expected or assured market return."], table: { caption: "Engine-derived sensitivity scenarios", headers: ["Illustrative entered return", "Total invested", "Projected growth", "Projected future value"], rows: sensitivity.map(({ annualReturnRate, result }) => [formatPercentage(annualReturnRate), formatIndianCurrency(result.totalInvested), formatIndianCurrency(result.estimatedReturns), formatIndianCurrency(result.futureValue)]) } },
      { id: "real-world", heading: "Actual contributions and returns can differ", paragraphs: ["Investors may change, pause, increase, decrease or stop contributions. Actual contribution dates may not match the beginning-of-month convention, and market returns vary rather than remaining constant.", "The calculator does not model fees, taxes, withdrawals, missed contributions or fund-specific performance. A displayed future value is not guaranteed."] },
      { id: "links", heading: "Keep comparison and mechanics separate", paragraphs: [[{ text: "Read " }, { text: "Step-up SIP Explained", link: { kind: "article", slug: "step-up-sip-explained" } }, { text: " for the main interpretation, " }, { text: "How Step-up SIP Is Calculated", link: { kind: "article", slug: "step-up-sip-calculation" } }, { text: " for timing, and the existing " }, { text: "Fixed SIP vs Step-up SIP", link: { kind: "article", slug: "fixed-sip-vs-step-up-sip" } }, { text: " article for comparison." }], [{ text: "Open the " }, { text: "Step-up SIP Calculator", link: { kind: "calculator", slug: "step-up-sip" } }, { text: " to test a scenario." }]] },
    ],
    faq: [
      { question: "Is 10% the ideal annual Step-up SIP increase?", answer: "No. Ten percent is only an illustrative input in the example. The calculator does not assess affordability or recommend a contribution increase." },
      { question: "Does the calculator predict actual market returns?", answer: "No. It applies the constant annual return entered for the projection and does not forecast actual performance." },
      { question: "Are fees and taxes included?", answer: "No. Fees and taxes are outside the existing Step-up SIP engine." },
    ],
  },
] as const satisfies readonly Article[];
