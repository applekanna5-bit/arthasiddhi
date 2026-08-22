import { calculateSwp } from "../../calculator/expanded-calculators";
import { formatIndianCurrency, formatNumber, formatPercentage } from "../../calculator/formatting";
import type { Article } from "../types";

const coreInput = { initialInvestment: 1_000_000, monthlyWithdrawal: 10_000, annualReturnRate: 8, withdrawalYears: 10 };
const coreExample = calculateSwp(coreInput);
const timingInput = { initialInvestment: 1_000, monthlyWithdrawal: 1_010, annualReturnRate: 12, withdrawalYears: 1 };
const timingExample = calculateSwp(timingInput);
const exhaustionInput = { initialInvestment: 10_000, monthlyWithdrawal: 6_000, annualReturnRate: 0, withdrawalYears: 1 };
const exhaustionExample = calculateSwp(exhaustionInput);
const endOfTenureExample = calculateSwp({ initialInvestment: 120_000, monthlyWithdrawal: 10_000, annualReturnRate: 0, withdrawalYears: 1 });
const zeroWithdrawalExample = calculateSwp({ initialInvestment: 100_000, monthlyWithdrawal: 0, annualReturnRate: 12, withdrawalYears: 1 });

const resultRow = (result: ReturnType<typeof calculateSwp>) => [
  formatIndianCurrency(result.totalWithdrawn),
  formatIndianCurrency(result.remainingBalance),
  formatNumber(result.withdrawalsCompleted),
  result.exhaustedBeforeTenure ? "Yes" : "No",
];

export const swpArticles = [
  {
    title: "SWP Explained: Withdrawals, Returns and Remaining Corpus",
    slug: "swp-explained",
    description: "Understand how the SWP calculator models monthly withdrawals, an entered return and the remaining corpus.",
    category: "investments",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "swp",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["swp-calculation", "swp-corpus-exhaustion"],
    sections: [
      { id: "answer", heading: "An SWP projection models withdrawals from an existing corpus", paragraphs: ["A Systematic Withdrawal Plan (SWP) projection starts with an existing corpus, applies the entered annual return each month, and then deducts the requested monthly withdrawal. It shows what happens under those assumptions; it does not decide how much anyone should withdraw.", [{ text: "Enter the assumptions in the " }, { text: "SWP Calculator", link: { kind: "calculator", slug: "swp" } }, { text: "." }]] },
      { id: "inputs", heading: "The calculator uses four inputs", list: ["Starting corpus or initial investment", "Monthly withdrawal", "Entered annual return assumption", "Whole-year withdrawal period"], paragraphs: ["The model converts the annual return to a monthly rate, applies that return before each monthly withdrawal, and stops processing when the corpus reaches zero."] },
      { id: "example", heading: "Engine-derived example: ₹10,00,000 corpus and ₹10,000 monthly withdrawal", paragraphs: [`At an illustrative entered return of ${formatPercentage(coreInput.annualReturnRate)} for ${coreInput.withdrawalYears} years, the engine reports ${formatIndianCurrency(coreExample.totalWithdrawn)} withdrawn across ${formatNumber(coreExample.withdrawalsCompleted)} months and ${formatIndianCurrency(coreExample.remainingBalance)} remaining. Exhaustion before the tenure is ${coreExample.exhaustedBeforeTenure ? "Yes" : "No"}.`], table: { caption: "Engine-derived SWP projection", headers: ["Total withdrawn", "Remaining corpus", "Months with withdrawal", "Exhausted before tenure"], rows: [resultRow(coreExample)] } },
      { id: "interpretation", heading: "Read withdrawals and remaining corpus together", paragraphs: ["A larger withdrawal reduces the corpus faster, while the entered return can offset part of that reduction in this simplified projection. Total withdrawn is the amount actually withdrawn by the loop, not a promise that the requested amount will be available for every month.", [{ text: "The " }, { text: "SWP Calculation", link: { kind: "article", slug: "swp-calculation" } }, { text: " guide explains the timing, and " }, { text: "Why SWP Corpus Can Run Out", link: { kind: "article", slug: "swp-corpus-exhaustion" } }, { text: " covers exhaustion." }]] },
      { id: "limits", heading: "This is not a forecast or withdrawal recommendation", paragraphs: ["The engine uses one constant entered return and does not simulate changing monthly returns, sequence of returns, fees, taxes, inflation-linked withdrawals, missed payments or product-specific rules. Actual outcomes can differ materially. It does not calculate a safe withdrawal rate or retirement suitability."] },
    ],
    faq: [
      { question: "Does the SWP calculator guarantee that the corpus will last?", answer: "No. It projects the result under the entered constant return and withdrawal assumptions; it is not a guarantee or recommendation." },
      { question: "Does the calculator model changing market returns?", answer: "No. It converts one entered annual return into one constant monthly return." },
      { question: "Are fees and taxes included?", answer: "No. Fees, taxes and capital-gains treatment are outside the existing SWP engine." },
    ],
  },
  {
    title: "How SWP Is Calculated: Return Timing, Withdrawals and Balance",
    slug: "swp-calculation",
    description: "Trace the SWP calculator's monthly return conversion, return-before-withdrawal order and balance updates.",
    category: "investments",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "swp",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["swp-explained", "swp-corpus-exhaustion"],
    sections: [
      { id: "monthly-rate", heading: "The annual input becomes a monthly rate", paragraphs: ["For this calculator, the entered annual percentage is divided by 12 and then by 100. The resulting monthly rate is used for each modeled month. This describes the ArthaSiddhi model; other products or platforms may use different conventions.", [{ text: "Try the same assumptions in the " }, { text: "SWP Calculator", link: { kind: "calculator", slug: "swp" } }, { text: "." }]] },
      { id: "event-order", heading: "Return is applied before the monthly withdrawal", paragraphs: ["Each iteration first applies the monthly-equivalent return to the current corpus. The requested withdrawal is then deducted. If the requested amount is larger than the available balance, the withdrawal is limited to that balance and the corpus becomes zero."] },
      { id: "timing-example", heading: "Timing example: ₹1,000 becomes ₹1,010 before withdrawal", paragraphs: [`With ₹${formatNumber(timingInput.initialInvestment)}, a ${formatIndianCurrency(timingInput.monthlyWithdrawal)} monthly withdrawal, an entered ${formatPercentage(timingInput.annualReturnRate)} annual return and a one-year period, the first monthly rate is 1%. The engine moves from ${formatIndianCurrency(timingInput.initialInvestment)} to ${formatIndianCurrency(timingInput.initialInvestment * 1.01)}, then withdraws ${formatIndianCurrency(timingExample.totalWithdrawn)} and leaves ${formatIndianCurrency(timingExample.remainingBalance)}.`, `The result records ${formatNumber(timingExample.withdrawalsCompleted)} withdrawal month and exhaustion before tenure as ${timingExample.exhaustedBeforeTenure ? "Yes" : "No"}.`], table: { caption: "Engine-derived return-before-withdrawal example", headers: ["Total withdrawn", "Remaining corpus", "Months with withdrawal", "Exhausted before tenure"], rows: [resultRow(timingExample)] } },
      { id: "loop", heading: "The loop reports actual withdrawals", paragraphs: ["The model processes up to withdrawal period × 12 months. It counts months with a positive withdrawal, accumulates the amount actually withdrawn, prevents a negative balance and stops after exhaustion.", [{ text: "For an exhaustion case, see " }, { text: "Why SWP Corpus Can Run Out", link: { kind: "article", slug: "swp-corpus-exhaustion" } }, { text: "." }]] },
    ],
    faq: [
      { question: "Is return applied before or after withdrawal?", answer: "In the ArthaSiddhi model, the monthly-equivalent return is applied first and the monthly withdrawal is deducted second." },
      { question: "What happens when the balance is smaller than the requested withdrawal?", answer: "The final withdrawal is capped at the available corpus, the balance reaches zero and processing stops." },
      { question: "Does every SWP product use this exact timing?", answer: "No. This article documents the timing convention used by this calculator only." },
    ],
  },
  {
    title: "Why SWP Corpus Can Run Out",
    slug: "swp-corpus-exhaustion",
    description: "See how withdrawal size, starting corpus, tenure and an entered return affect modeled SWP corpus exhaustion.",
    category: "investments",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "6 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "swp",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 50,
    relatedCalculators: [],
    relatedArticles: ["swp-explained", "swp-calculation"],
    sections: [
      { id: "why", heading: "A corpus can reach zero when withdrawals outpace the modeled balance", paragraphs: ["Corpus exhaustion depends on the starting amount, monthly withdrawal, entered return and withdrawal duration. The calculator answers what happens under those inputs; it does not label a withdrawal amount safe or unsafe.", [{ text: "Use the " }, { text: "SWP Calculator", link: { kind: "calculator", slug: "swp" } }, { text: " to test a scenario." }]] },
      { id: "example", heading: "Engine-derived exhaustion example", paragraphs: [`With an initial corpus of ${formatIndianCurrency(exhaustionInput.initialInvestment)}, a requested ${formatIndianCurrency(exhaustionInput.monthlyWithdrawal)} monthly withdrawal, a ${formatPercentage(exhaustionInput.annualReturnRate)} return and a one-year period, the scheduled request would total ${formatIndianCurrency(exhaustionInput.monthlyWithdrawal * exhaustionInput.withdrawalYears * 12)}. The engine actually withdraws ${formatIndianCurrency(exhaustionExample.totalWithdrawn)} over ${formatNumber(exhaustionExample.withdrawalsCompleted)} months, leaves ${formatIndianCurrency(exhaustionExample.remainingBalance)}, and reports exhaustion before tenure as ${exhaustionExample.exhaustedBeforeTenure ? "Yes" : "No"}.`, "The second withdrawal is limited to the remaining ₹4,000 rather than the requested ₹6,000."], table: { caption: "Engine-derived corpus exhaustion", headers: ["Total withdrawn", "Remaining corpus", "Months with withdrawal", "Exhausted before tenure"], rows: [resultRow(exhaustionExample)] } },
      { id: "boundaries", heading: "The final withdrawal is capped and the loop stops", paragraphs: ["The engine never lets the balance become negative. It caps a partial final withdrawal at the available corpus, reports the actual total withdrawn and stops processing once the balance reaches zero.", `If the corpus reaches zero exactly at the intended end, exhaustion before tenure remains false. For example, the zero-return ₹1,20,000 corpus with ₹10,000 monthly withdrawals reaches zero after ${formatNumber(endOfTenureExample.withdrawalsCompleted)} months and reports ${endOfTenureExample.exhaustedBeforeTenure ? "Yes" : "No"}.` ] },
      { id: "limits", heading: "Exhaustion is not a safe-withdrawal calculation", paragraphs: ["The model does not simulate negative returns, changing return sequences, fees, taxes, inflation-linked withdrawals or actual fund behavior. Sequence risk can affect real withdrawals, but this calculator does not model it. A projected exhaustion result is not individualized financial advice.", [{ text: "The " }, { text: "SWP Explained", link: { kind: "article", slug: "swp-explained" } }, { text: " guide covers the broader assumptions." }]] },
      { id: "zero-withdrawal", heading: "A zero withdrawal is also a supported input", paragraphs: [`With ₹1,00,000, no monthly withdrawal, a 12% entered return and one year, the engine reports ${formatIndianCurrency(zeroWithdrawalExample.remainingBalance)} remaining and zero withdrawal months. This is an arithmetic projection, not a forecast.`] },
    ],
    faq: [
      { question: "Can the SWP balance become negative?", answer: "No. The engine caps the final withdrawal at the available corpus and floors the remaining balance at zero." },
      { question: "Does exhaustion mean the withdrawal amount is unsafe?", answer: "No. It only describes the result under the entered assumptions and is not a safe-withdrawal assessment." },
      { question: "Does the calculator determine a safe withdrawal rate?", answer: "No. It does not model the risks and suitability questions required for that conclusion." },
    ],
  },
] as const satisfies readonly Article[];
