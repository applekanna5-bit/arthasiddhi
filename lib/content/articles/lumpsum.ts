import { calculateLumpsum } from "../../calculator/expanded-calculators";
import { formatIndianCurrency, formatPercentage } from "../../calculator/formatting";
import type { Article } from "../types";

const exampleInput = { initialInvestment: 100_000, annualReturnRate: 12, investmentYears: 10 };
const example = calculateLumpsum(exampleInput);
const sensitivity = [8, 10, 12].map((annualReturnRate) => ({ annualReturnRate, result: calculateLumpsum({ ...exampleInput, annualReturnRate }) }));

const projectionRow = (result: ReturnType<typeof calculateLumpsum>) => [formatIndianCurrency(result.investedAmount), formatIndianCurrency(result.estimatedGain), formatIndianCurrency(result.futureValue)];

export const lumpsumArticles = [
  {
    title: "Lumpsum Investment Explained: Principal, Growth and Future Value",
    slug: "lumpsum-explained",
    description: "Understand how a one-time principal, entered annual return and whole-year period produce a projected Lumpsum value.",
    category: "investments",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "lumpsum",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["lumpsum-projection-assumptions", "sip-vs-lumpsum", "compound-interest", "cagr-explained"],
    sections: [
      { id: "answer", heading: "A Lumpsum projection starts with one principal amount", paragraphs: ["The ArthaSiddhi Lumpsum Calculator projects a future value from a one-time starting principal, an entered annual return and a whole-year investment period. It also separates the amount invested from the estimated gain produced by the projection.", [{ text: "Enter those assumptions in the " }, { text: "Lumpsum Calculator", link: { kind: "calculator", slug: "lumpsum" } }, { text: "." }]] },
      { id: "inputs", heading: "The calculator uses three inputs", list: ["Initial investment or principal", "Entered annual return assumption", "Investment period in whole years"], paragraphs: ["The engine compounds the one-time amount once per year at the same entered rate throughout the selected period. It does not add later contributions or withdrawals."] },
      { id: "example", heading: "Engine-derived example: ₹1,00,000 at an illustrative 12%", paragraphs: [`For ${exampleInput.investmentYears} years, the engine reports ${formatIndianCurrency(example.investedAmount)} invested, ${formatIndianCurrency(example.estimatedGain)} estimated gain and a projected future value of ${formatIndianCurrency(example.futureValue)}. The ${formatPercentage(exampleInput.annualReturnRate)} is an illustrative entered assumption, not an expected or guaranteed market return.`], table: { caption: "Engine-derived Lumpsum projection", headers: ["Invested amount", "Estimated gain", "Projected future value"], rows: [projectionRow(example)] } },
      { id: "formula-boundary", heading: "The formula belongs to this projection model", paragraphs: ["In this calculator, the future value is the initial investment multiplied by one plus the entered annual rate, raised to the entered whole-year duration. That brief explanation describes the calculator's annual-compounding convention; it is not a replacement for the existing generic Compound Interest guide.", [{ text: "For the recurring-contribution comparison, read " }, { text: "SIP vs Lumpsum", link: { kind: "article", slug: "sip-vs-lumpsum" } }, { text: ". CAGR answers a different endpoint-annualisation question." }]] },
      { id: "limits", heading: "A projection is not a promise about future value", paragraphs: ["The calculator holds the entered return constant and does not model variable market paths, negative returns, fees, taxes, inflation, dividends, interim contributions, withdrawals or fund-specific behaviour. Actual outcomes can differ.", [{ text: "Review the assumptions in " }, { text: "Lumpsum Projection Assumptions", link: { kind: "article", slug: "lumpsum-projection-assumptions" } }, { text: "." }]] },
    ],
    faq: [
      { question: "What does the Lumpsum calculator project?", answer: "It projects a future value from one starting principal, one entered annual return and a whole-year period under annual compounding." },
      { question: "Does the calculator guarantee the future value?", answer: "No. The result is an assumption-based projection, not a guaranteed return or future value." },
      { question: "Is Lumpsum the same as CAGR?", answer: "No. Lumpsum projects a future value from an assumed return, while CAGR measures an annualized rate between known beginning and ending values." },
    ],
  },
  {
    title: "Lumpsum Projection Assumptions: What the Calculator Does and Does Not Predict",
    slug: "lumpsum-projection-assumptions",
    description: "Learn which constant-return and annual-compounding assumptions shape a Lumpsum projection and what it excludes.",
    category: "investments",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "6 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "lumpsum",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["lumpsum-explained", "sip-vs-lumpsum"],
    sections: [
      { id: "assumptions", heading: "The projection keeps the cash flow and rate simple", list: ["One-time starting principal", "One constant entered annual return", "Annual compounding", "Whole-year investment period", "No additional contributions or withdrawals", "Currency rounding only for display"], paragraphs: ["The model uses the same entered annual rate for every modeled year. It does not simulate a changing return path or predict what markets will do.", [{ text: "Open the " }, { text: "Lumpsum Calculator", link: { kind: "calculator", slug: "lumpsum" } }, { text: " to test the assumptions." }]] },
      { id: "sensitivity", heading: "Changing only the entered return changes the projection", paragraphs: ["These controlled scenarios keep the ₹1,00,000 principal and 10-year duration unchanged. Each percentage is an illustrative entered annual return, not an expected, conservative or assured market outcome."], table: { caption: "Engine-derived illustrative return scenarios", headers: ["Illustrative entered return", "Invested amount", "Estimated gain", "Projected future value"], rows: sensitivity.map(({ annualReturnRate, result }) => [formatPercentage(annualReturnRate), ...projectionRow(result)]) } },
      { id: "exclusions", heading: "Important exclusions", list: ["Variable or negative returns", "Market crashes, drawdowns and historical paths", "Fees, taxes and inflation", "Dividends or fund-specific behaviour", "Interim contributions or withdrawals", "Fractional-year or arbitrary day/month durations"], paragraphs: ["The calculator accepts a non-negative annual rate and whole years only. A displayed value is therefore a smooth projection under the selected inputs, not a forecast or investment recommendation."] },
      { id: "comparison", heading: "Keep comparison intent separate", paragraphs: [[{ text: "The existing " }, { text: "SIP vs Lumpsum", link: { kind: "article", slug: "sip-vs-lumpsum" } }, { text: " article owns the comparison between monthly contributions and one upfront amount. " }, { text: "Lumpsum Explained", link: { kind: "article", slug: "lumpsum-explained" } }, { text: " focuses on this calculator's projection." }]] },
    ],
    faq: [
      { question: "Does the Lumpsum calculator support negative returns?", answer: "No. The current input range is 0% to 100%, so negative-return years are outside the model." },
      { question: "Does it accept fractional years?", answer: "No. The calculator validates a whole number of investment years from 1 to 100." },
      { question: "Are fees, taxes or inflation included?", answer: "No. Those factors are outside the existing Lumpsum engine." },
    ],
  },
] as const satisfies readonly Article[];
