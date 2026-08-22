import { calculateGratuity } from "../../calculator/expanded-calculators";
import { formatIndianCurrency } from "../../calculator/formatting";
import { gratuityRuleSet } from "../../financial-rules/rule-sets";
import type { Article } from "../types";

const ordinaryInput = { eligibleMonthlyWage: 50_000, completedYears: 10, additionalMonths: 0 };
const sixMonthInput = { ...ordinaryInput, additionalMonths: 6 };
const sevenMonthInput = { ...ordinaryInput, additionalMonths: 7 };
const highValueInput = { eligibleMonthlyWage: 500_000, completedYears: 30, additionalMonths: 0 };
const ordinary = calculateGratuity(ordinaryInput, gratuityRuleSet);
const sixMonths = calculateGratuity(sixMonthInput, gratuityRuleSet);
const sevenMonths = calculateGratuity(sevenMonthInput, gratuityRuleSet);
const highValue = calculateGratuity(highValueInput, gratuityRuleSet);

export const gratuityArticles = [
  {
    title: "Gratuity Explained: Wage, Service, Eligibility and Statutory Limit",
    slug: "gratuity-explained",
    description: "Understand the ordinary gratuity formula, counted service, statutory ceiling, eligibility boundary and calculator limitations.",
    category: "retirement",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "8 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: gratuityRuleSet.id },
    primaryCalculator: "gratuity",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["gratuity-calculation", "gratuity-calculator-vs-employer-settlement", "gratuity-eligibility"],
    sections: [
      { id: "meaning", heading: "Gratuity is a service-linked employment benefit", paragraphs: ["Under the operative Code on Social Security framework, gratuity can become payable on specified events subject to applicable service, employee-category and other legal conditions. An amount calculation and legal eligibility are separate questions.", "ArthaSiddhi supports the ordinary monthly-rated amount model only. It does not decide continuous service, eligibility, forfeiture or whether a special category applies."] },
      { id: "formula", heading: "The ordinary model uses eligible wage and counted service", paragraphs: ["The calculator uses an already-determined eligible monthly wage, multiplies it by 15/26 and by counted service years. Eligible wage is contextual and is not universally identical to basic salary, basic plus DA, gross salary, CTC or take-home pay.", "Completed years count directly. Additional service adds one year only when it is in excess of six completed months: exactly six months adds no year, while seven months does."], callout: { title: "See the mechanics", text: [{ text: "Work through each boundary in " }, { text: "How Gratuity Is Calculated", link: { kind: "article", slug: "gratuity-calculation" } }, { text: "." }] } },
      { id: "example", heading: "A controlled ordinary-formula example", paragraphs: [`For an eligible monthly wage of ${formatIndianCurrency(ordinaryInput.eligibleMonthlyWage)} and 10 years of counted service, the engine produces a raw formula amount of ${formatIndianCurrency(ordinary.rawFormulaGratuity)}. Because it is below ${formatIndianCurrency(ordinary.statutoryCeiling)}, the estimated statutory gratuity is ${formatIndianCurrency(ordinary.estimatedGratuity)}.`], table: { caption: "Engine-derived ordinary gratuity example", headers: ["Eligible wage", "Counted years", "Raw formula", "Statutory estimate", "Ceiling applied"], rows: [[formatIndianCurrency(ordinary.eligibleMonthlyWage), String(ordinary.serviceYearsCounted), formatIndianCurrency(ordinary.rawFormulaGratuity), formatIndianCurrency(ordinary.estimatedGratuity), ordinary.ceilingApplied ? "Yes" : "No"]] } },
      { id: "ceiling", heading: "Raw formula and statutory estimate are shown separately", paragraphs: ["The engine caps its statutory estimate at the maintained ₹20,00,000 statutory ceiling while retaining the uncapped formula result. An award, agreement or contract may provide better terms, but an amount above the ceiling is not labelled an uncapped statutory entitlement."] },
      { id: "eligibility", heading: "The general five-year rule has important exceptions", paragraphs: ["The current framework generally refers to five years of continuous service, but that condition is not required for death or disablement and fixed-term employment has special current treatment. The calculator does not evaluate any of these facts.", [{ text: "Read the sourced boundaries in " }, { text: "Gratuity Eligibility", link: { kind: "article", slug: "gratuity-eligibility" } }, { text: ", and use the " }, { text: "Gratuity Calculator", link: { kind: "calculator", slug: "gratuity" } }, { text: " only as an amount estimate." }]] },
      { id: "limits", heading: "Special cases and employer records remain outside scope", paragraphs: ["Piece-rated, seasonal, fixed-term pro-rata and death/disablement-specific calculations are not modeled. Neither are forfeiture, enhanced employer schemes, tax exemption or employer settlement policy.", [{ text: "See why an actual result can differ in " }, { text: "Why a Gratuity Calculator May Differ From Employer Settlement", link: { kind: "article", slug: "gratuity-calculator-vs-employer-settlement" } }, { text: "." }]] },
    ],
    faq: [
      { question: "Does a calculator result prove gratuity eligibility?", answer: "No. It estimates an amount under the supported ordinary model and does not determine continuous service, qualifying events, employee category, exceptions or forfeiture." },
      { question: "Does exactly six additional months add another service year?", answer: "No. Under the supported ordinary model, additional months must be in excess of six; seven months adds one counted year." },
      { question: "Can an employer provide more favourable gratuity terms?", answer: "Yes, applicable award, agreement or contract terms may provide a better benefit. The calculator separately identifies its capped statutory estimate." },
    ],
  },
  {
    title: "How Gratuity Is Calculated: The 15/26 Formula and Service Rounding",
    slug: "gratuity-calculation",
    description: "See how eligible monthly wage, the 15/26 factor, service rounding and the statutory ceiling shape an ordinary gratuity estimate.",
    category: "retirement",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "7 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: gratuityRuleSet.id },
    primaryCalculator: "gratuity",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["gratuity-explained", "gratuity-eligibility"],
    sections: [
      { id: "formula", heading: "The supported formula is eligible monthly wage × 15 ÷ 26 × counted years", paragraphs: ["This is the ordinary monthly-rated calculation supported by the engine. It assumes the eligible wage has already been determined for the applicable context; it does not derive that wage from salary components.", "The engine retains floating-point precision internally and the interface formats the result as Indian currency."] },
      { id: "rounding", heading: "Exactly six months and seven months produce different counted service", paragraphs: ["The rule is more than six months, not six months or more. Ten years and exactly six months therefore remain 10 counted years; ten years and seven months become 11 counted years."], table: { caption: "Engine-derived service-rounding comparison", headers: ["Service input", "Counted years", "Raw formula", "Statutory estimate"], rows: [["10 years, 0 months", String(ordinary.serviceYearsCounted), formatIndianCurrency(ordinary.rawFormulaGratuity), formatIndianCurrency(ordinary.estimatedGratuity)], ["10 years, 6 months", String(sixMonths.serviceYearsCounted), formatIndianCurrency(sixMonths.rawFormulaGratuity), formatIndianCurrency(sixMonths.estimatedGratuity)], ["10 years, 7 months", String(sevenMonths.serviceYearsCounted), formatIndianCurrency(sevenMonths.rawFormulaGratuity), formatIndianCurrency(sevenMonths.estimatedGratuity)]] } },
      { id: "high-value", heading: "The statutory ceiling can reduce the displayed statutory estimate", paragraphs: [`At an eligible wage of ${formatIndianCurrency(highValueInput.eligibleMonthlyWage)} and 30 counted years, the engine's raw formula result is ${formatIndianCurrency(highValue.rawFormulaGratuity)}. It then applies the ${formatIndianCurrency(highValue.statutoryCeiling)} ceiling, so the statutory estimate is ${formatIndianCurrency(highValue.estimatedGratuity)}.`], table: { caption: "Engine-derived high-value ceiling example", headers: ["Raw formula", "Ceiling", "Statutory estimate", "Ceiling applied"], rows: [[formatIndianCurrency(highValue.rawFormulaGratuity), formatIndianCurrency(highValue.statutoryCeiling), formatIndianCurrency(highValue.estimatedGratuity), highValue.ceilingApplied ? "Yes" : "No"]] } },
      { id: "scope", heading: "A formula result is not an eligibility decision", paragraphs: ["Continuous service, qualifying events, death or disablement exceptions, fixed-term treatment, employee category and forfeiture require facts the calculator does not collect.", [{ text: "Check those boundaries in " }, { text: "Gratuity Eligibility", link: { kind: "article", slug: "gratuity-eligibility" } }, { text: ", return to " }, { text: "Gratuity Explained", link: { kind: "article", slug: "gratuity-explained" } }, { text: ", or model the supported inputs in the " }, { text: "Gratuity Calculator", link: { kind: "calculator", slug: "gratuity" } }, { text: "." }]] },
    ],
    faq: [
      { question: "Is service rounded up at exactly six additional months?", answer: "No. The supported rule adds a year only when additional completed service is in excess of six months." },
      { question: "Why does the calculator show raw and statutory amounts?", answer: "The raw amount preserves the ordinary formula output; the statutory estimate applies the maintained monetary ceiling." },
    ],
  },
  {
    title: "Why a Gratuity Calculator May Differ From Employer Settlement",
    slug: "gratuity-calculator-vs-employer-settlement",
    description: "Understand why wage definitions, service records, special cases, better benefit terms and accounting can change an employer settlement.",
    category: "retirement",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "6 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "gratuity",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 50,
    relatedCalculators: [],
    relatedArticles: ["gratuity-explained", "gratuity-eligibility"],
    sections: [
      { id: "estimate", heading: "The calculator begins after eligible wage has been determined", paragraphs: ["The engine accepts one eligible monthly wage and direct years and months. Employer records may use applicable wage definitions, exact service dates and continuous-service facts that the calculator does not derive.", "A difference does not by itself show that either result is wrong; the two may be using different facts or scope."] },
      { id: "legal", heading: "Eligibility and special employee categories can change the legal analysis", paragraphs: ["Piece-rated, seasonal, fixed-term, death/disablement-specific and forfeiture cases are outside the ordinary model. The calculator does not determine employee category or legal eligibility.", [{ text: "Review the high-level eligibility boundary in " }, { text: "Gratuity Eligibility", link: { kind: "article", slug: "gratuity-eligibility" } }, { text: "." }]] },
      { id: "ceiling", heading: "Statutory ceiling and better employer terms answer different questions", paragraphs: ["The calculator retains the raw ordinary-formula result but caps its statutory estimate. An applicable award, agreement or contract may provide more favourable gratuity terms, which the engine does not interpret or guarantee."] },
      { id: "records", heading: "Settlement and accounting inputs remain employer-specific", list: ["Actual service dates and continuous-service records", "Applicable wage and employee-category determination", "Special statutory treatment and any forfeiture question", "More favourable award, agreement or contract terms", "Tax withholding or accounting, which the calculator does not calculate"], callout: { title: "Use the estimate within scope", text: [{ text: "Start with " }, { text: "Gratuity Explained", link: { kind: "article", slug: "gratuity-explained" } }, { text: " and use the " }, { text: "Gratuity Calculator", link: { kind: "calculator", slug: "gratuity" } }, { text: " for the supported ordinary amount model." }] } },
    ],
    faq: [
      { question: "Does a different employer settlement mean the calculator is wrong?", answer: "Not necessarily. Wage determination, service records, employee category, special rules and better contractual terms can change the applicable result." },
      { question: "Does the calculator estimate gratuity tax?", answer: "No. It does not calculate tax exemption, taxable gratuity, tax due or withholding." },
    ],
  },
  {
    title: "Gratuity Eligibility: Five-Year Rule and Exceptions",
    slug: "gratuity-eligibility",
    description: "Understand the general continuous-service rule, death and disablement exceptions, fixed-term context, and the calculator's eligibility limits.",
    category: "retirement",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "7 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: gratuityRuleSet.id },
    primaryCalculator: "gratuity",
    calculatorGuideRole: "supporting",
    relatedCalculators: [],
    relatedArticles: ["gratuity-explained", "gratuity-calculation"],
    sections: [
      { id: "general", heading: "Five years is the general rule, not a universal answer", paragraphs: ["The operative framework generally requires at least five years of continuous service for ordinary qualifying events such as superannuation, retirement, resignation or termination. Whether service is continuous and whether an event qualifies depend on facts the calculator does not collect."] },
      { id: "exceptions", heading: "Death and disablement do not carry the general five-year condition", paragraphs: ["The five-year condition is not necessary where termination of employment is due to death or disablement. This is a legal boundary, not a separate death or disablement calculation in ArthaSiddhi.", "Fixed-term employees also have special current eligibility and pro-rata treatment. Ministry guidance identifies one year of service under the fixed-term contract; the ordinary calculator does not model that special case."] },
      { id: "not-determined", heading: "The calculator does not determine eligibility", paragraphs: ["Entering wage and service produces an amount under the ordinary monthly-rated model. It does not confirm continuous service, a qualifying event, death or disablement facts, fixed-term status, employee category, coverage or forfeiture.", [{ text: "Use " }, { text: "Gratuity Explained", link: { kind: "article", slug: "gratuity-explained" } }, { text: " for scope, " }, { text: "How Gratuity Is Calculated", link: { kind: "article", slug: "gratuity-calculation" } }, { text: " for arithmetic, and the " }, { text: "Gratuity Calculator", link: { kind: "calculator", slug: "gratuity" } }, { text: " only for an estimate." }]] },
      { id: "guidance", heading: "Individual cases require current facts and applicable terms", paragraphs: ["This guide is general information, not individualized employment-law advice. Applicable statutory provisions, official guidance, service records and any award, agreement or contract should be checked for the actual case."] },
    ],
    faq: [
      { question: "Is five years required when employment ends due to death?", answer: "No. The operative framework does not require the general five-year condition for termination due to death." },
      { question: "Is five years required when employment ends due to disablement?", answer: "No. Disablement is also an exception to the general five-year condition." },
      { question: "Does the calculator decide whether a fixed-term employee qualifies?", answer: "No. Fixed-term eligibility and pro-rata treatment are special legal matters outside the ordinary calculator model." },
    ],
  },
] as const satisfies readonly Article[];
