import { calculateNps } from "../../calculator/rule-driven-calculators";
import { formatIndianCurrency, formatPercentage } from "../../calculator/formatting";
import { npsRuleSet } from "../../financial-rules/rule-sets";
import type { Article } from "../types";

const coreExampleInput = { currentAge: 40, retirementAge: 60, currentCorpus: 500_000, monthlyContribution: 10_000, annualReturnRate: 8, annualContributionIncrease: 0, annuityAllocation: 20, assumedAnnuityRate: 6 };
const coreExample = calculateNps(coreExampleInput, npsRuleSet);
const stepUpExampleInput = { currentAge: 30, retirementAge: 32, currentCorpus: 0, monthlyContribution: 5_000, annualReturnRate: 0, annualContributionIncrease: 10, annuityAllocation: 40, assumedAnnuityRate: 6 };
const stepUpExample = calculateNps(stepUpExampleInput, npsRuleSet);

export const retirementArticles = [
  {
    title: "NPS Explained: Contributions, Retirement Corpus and Annuity",
    slug: "nps-explained",
    description: "How NPS contributions build a projected retirement corpus, how the calculator allocates lump sum and annuity, and where current rules and assumptions matter.",
    category: "retirement",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "9 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: "nps-all-citizen-exits-2026-07" },
    primaryCalculator: "nps",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["nps-corpus-calculation", "nps-lump-sum-and-annuity", "nps-calculator-assumptions"],
    sections: [
      {
        id: "defined-contribution",
        heading: "NPS builds an individual retirement corpus from contributions and investment outcomes",
        paragraphs: [
          "The National Pension System is a defined-contribution retirement arrangement regulated by the Pension Fund Regulatory and Development Authority. Contributions are invested under the choices recorded for the account, so the eventual corpus depends on contributions, investment performance, charges and other account activity rather than a promised return.",
          "ArthaSiddhi's calculator is narrower. It projects one entered current corpus and a monthly contribution using a constant assumed return and an optional annual contribution increase. It does not reproduce an NPS account, fund history or statement.",
        ],
      },
      {
        id: "inputs",
        heading: "The projection starts with age, corpus and contribution assumptions",
        list: [
          "Current age and retirement age set a whole-year projection period.",
          "Current NPS corpus is the opening balance used by the model.",
          "Monthly contribution is added at the beginning of each modeled month.",
          "Expected annual return is a constant illustrative input, converted to a monthly rate by the engine.",
          "Annual contribution increase steps the monthly amount up after each completed 12-month block.",
        ],
      },
      {
        id: "worked-example",
        heading: "Illustrative projection from age 40 to 60",
        paragraphs: [
          "This example starts with ₹5,00,000, adds ₹10,000 at the beginning of every month for 20 years and uses an illustrative constant 8% annual return with no contribution increase. The 20% calculator allocation and 6% annuity-rate input demonstrate arithmetic only; they do not decide the rules applicable at exit or quote an annuity product.",
        ],
        table: {
          caption: "Engine-derived NPS projection using illustrative inputs",
          headers: ["Starting corpus", "Total contributions", "Estimated growth", "Projected corpus", "Lump sum", "Annuity corpus", "Monthly annuity estimate"],
          rows: [[formatIndianCurrency(coreExample.startingCorpus), formatIndianCurrency(coreExample.totalContributions), formatIndianCurrency(coreExample.estimatedGrowth), formatIndianCurrency(coreExample.retirementCorpus), formatIndianCurrency(coreExample.lumpSumCorpus), formatIndianCurrency(coreExample.annuityCorpus), formatIndianCurrency(coreExample.estimatedMonthlyAnnuity)]],
        },
      },
      {
        id: "allocation",
        heading: "Calculator allocation and actual NPS exit rules are separate",
        paragraphs: [
          "The calculator mechanically splits the projected corpus using the entered annuity allocation. Selecting a percentage is a projection control; it is not a finding that a subscriber is entitled or required to withdraw or annuitize that percentage.",
          "Actual treatment depends on the subscriber category, exit event, vesting conditions, accumulated pension wealth, exceptions and regulations applicable at exit. Current PFRDA material distinguishes normal and premature exits and includes corpus-based options, so no single split should be presented as universal.",
          [
            { text: "Read the calculator arithmetic and current-rule boundary in " },
            { text: "NPS Lump Sum and Annuity", link: { kind: "article", slug: "nps-lump-sum-and-annuity" } },
            { text: "." },
          ],
        ],
      },
      {
        id: "interpretation",
        heading: "Read contributions, growth and pension estimates separately",
        paragraphs: [
          "Total contributions follow the modeled payment schedule. Estimated growth depends on the return assumption. Their sum with the starting corpus produces the projected retirement corpus.",
          "The monthly annuity estimate then applies the entered assumed annuity rate to the allocated annuity corpus and divides the annual estimate by 12. It is not an insurer or annuity service provider quote, a guaranteed pension, or a tax calculation.",
          [
            { text: "See exactly " },
            { text: "how the corpus projection is calculated", link: { kind: "article", slug: "nps-corpus-calculation" } },
            { text: " and review " },
            { text: "why calculator results differ from actual pension outcomes", link: { kind: "article", slug: "nps-calculator-assumptions" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Project your own inputs",
          text: [
            { text: "Use the " },
            { text: "NPS Calculator", link: { kind: "calculator", slug: "nps" } },
            { text: " to change one assumption at a time." },
          ],
        },
      },
    ],
    faq: [
      { question: "Does the NPS Calculator guarantee the projected return?", answer: "No. NPS is market-linked, while the calculator applies one constant return assumption for illustration." },
      { question: "Does the annuity allocation determine what I may withdraw?", answer: "No. It controls the calculator's arithmetic. Actual treatment depends on the subscriber category, exit event, corpus and rules applicable at exit." },
      { question: "Is the estimated monthly annuity an actual pension quote?", answer: "No. It is a mathematical estimate using the entered annuity allocation and assumed annuity rate, without insurer pricing or annuity-option terms." },
    ],
  },
  {
    title: "How the NPS Calculator Builds Your Retirement Corpus",
    slug: "nps-corpus-calculation",
    description: "How current corpus, beginning-of-month contributions, monthly compounding and annual contribution increases produce the projected NPS corpus.",
    category: "retirement",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "nps",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["nps-explained", "nps-calculator-assumptions"],
    sections: [
      {
        id: "projection-period",
        heading: "Ages determine the number of modeled months",
        paragraphs: [
          "The engine subtracts current age from retirement age to obtain a whole-year duration, then multiplies that duration by 12. Retirement age must be greater than current age, and both ages must be whole numbers within the calculator's supported range.",
        "The calculator enforces its supported age boundaries, but entering an age does not establish NPS eligibility or an exit entitlement.",
        ],
      },
      {
        id: "monthly-mechanics",
        heading: "Current corpus and each contribution compound monthly",
        paragraphs: [
          "The current corpus is the opening balance. At the beginning of each modeled month, the engine adds that month's contribution and then applies a monthly-equivalent rate equal to the entered annual return divided by 12.",
          "This is a constant projection convention. It does not model daily valuation, unit allocation, asset allocation, charges or actual NPS fund performance.",
        ],
      },
      {
        id: "step-up",
        heading: "The contribution steps up after each completed year",
        paragraphs: [
          "The starting monthly contribution remains unchanged for the first 12 contributions. If an annual increase is entered, the engine increases the monthly amount before contribution 13 and after each later completed 12-month block.",
        ],
        table: {
          caption: "Two-year zero-return example showing contribution timing",
          headers: ["Starting monthly contribution", "Annual increase", "Modeled months", "Total contributions", "Final monthly contribution", "Projected corpus"],
          rows: [[formatIndianCurrency(stepUpExampleInput.monthlyContribution), formatPercentage(stepUpExampleInput.annualContributionIncrease), "24", formatIndianCurrency(stepUpExample.totalContributions), formatIndianCurrency(stepUpExample.finalMonthlyContribution), formatIndianCurrency(stepUpExample.retirementCorpus)]],
        },
      },
      {
        id: "result-parts",
        heading: "Projected corpus separates contributed capital from estimated growth",
        paragraphs: [
          "The result reports the starting corpus, total modeled contributions and estimated investment growth separately. Adding those three values reconciles to the projected retirement corpus, subject only to unrounded floating-point precision.",
          "Estimated growth is not an NPS return record or a promise. Changing the assumed return changes the projection rather than predicting a fund outcome.",
          [
            { text: "Return to " },
            { text: "NPS Explained", link: { kind: "article", slug: "nps-explained" } },
            { text: " or review the complete " },
            { text: "calculator assumptions", link: { kind: "article", slug: "nps-calculator-assumptions" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Test the projection mechanics",
          text: [
            { text: "Change the corpus, contribution or assumed return in the " },
            { text: "NPS Calculator", link: { kind: "calculator", slug: "nps" } },
            { text: "." },
          ],
        },
      },
    ],
    faq: [
      { question: "When is each monthly contribution added?", answer: "The engine adds it at the beginning of the modeled month before applying that month's return assumption." },
      { question: "How is the monthly return obtained?", answer: "The calculator divides the entered nominal annual return by 12. It then uses that constant monthly-equivalent rate throughout the projection." },
      { question: "Does estimated growth represent actual NPS fund performance?", answer: "No. It is produced by a constant user-entered assumption and is not current or historical fund performance." },
    ],
  },
  {
    title: "NPS Lump Sum and Annuity: How the Calculator Splits the Corpus",
    slug: "nps-lump-sum-and-annuity",
    description: "How the calculator allocates a projected NPS corpus, estimates annuity income, and differs from category- and corpus-dependent exit rules.",
    category: "retirement",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "8 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: "nps-all-citizen-exits-2026-07" },
    primaryCalculator: "nps",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 50,
    relatedCalculators: [],
    relatedArticles: ["nps-explained", "nps-calculator-assumptions"],
    sections: [
      {
        id: "calculator-arithmetic",
        heading: "The calculator mechanically applies the entered allocation",
        paragraphs: [
          "The annuity corpus equals the projected retirement corpus multiplied by the entered annuity-allocation percentage. The displayed lump-sum allocation is the projected corpus remaining after that annuity amount.",
          "The annual annuity estimate equals the annuity corpus multiplied by the entered assumed annual annuity rate. Dividing that amount by 12 produces the monthly estimate. These calculations do not determine legal eligibility or reproduce an annuity contract.",
        ],
        table: {
          caption: "Engine-derived 20% calculator allocation for the illustrative corpus",
          headers: ["Projected corpus", "Entered annuity allocation", "Lump-sum allocation", "Annuity corpus", "Annual annuity estimate", "Monthly annuity estimate"],
          rows: [[formatIndianCurrency(coreExample.retirementCorpus), formatPercentage(coreExample.annuityAllocation), formatIndianCurrency(coreExample.lumpSumCorpus), formatIndianCurrency(coreExample.annuityCorpus), formatIndianCurrency(coreExample.estimatedAnnualAnnuity), formatIndianCurrency(coreExample.estimatedMonthlyAnnuity)]],
        },
      },
      {
        id: "rule-boundary",
        heading: "Actual NPS treatment depends on category, event and corpus",
        paragraphs: [
          "Current PFRDA rules distinguish government and non-government subscribers, normal and premature exits, vesting events, post-60 entry, death and accumulated-pension-wealth bands. Exceptions and alternative payout treatments also apply in specified corpus bands.",
          "For the All Citizen context represented by the current rule set, general normal-exit treatment can permit up to 80% lump sum with at least 20% annuity, while current small- and intermediate-corpus provisions create other options. Premature-exit treatment is different. These facts describe regulatory context, not what the calculator decides for a particular subscriber.",
        ],
      },
      {
        id: "no-universal-split",
        heading: "No single allocation is universal",
        paragraphs: [
          "It is inaccurate to say that every NPS subscriber must buy a 40% annuity or that normal NPS exit always means 60% lump sum and 40% annuity. It is equally inaccurate to apply a universal 80%/20% split without identifying the subscriber model, exit event, corpus band and current exceptions.",
          "Selecting 20%, 40%, 75%, 80% or another supported allocation in the calculator changes only the projection. Verify the current regulations and the treatment applicable to the account before interpreting an actual exit.",
          [
            { text: "Start with " },
            { text: "NPS Explained", link: { kind: "article", slug: "nps-explained" } },
            { text: " and then review why the " },
            { text: "annuity estimate is not a provider quote", link: { kind: "article", slug: "nps-calculator-assumptions" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Model allocation arithmetic only",
          text: [
            { text: "Use the " },
            { text: "NPS Calculator", link: { kind: "calculator", slug: "nps" } },
            { text: " to compare mathematical allocations, not to determine exit eligibility." },
          ],
        },
      },
    ],
    faq: [
      { question: "Does entering 20% prove that 20% annuity applies to me?", answer: "No. It changes the calculator allocation only. Applicable treatment depends on subscriber category, exit event, corpus band and current regulations." },
      { question: "Does normal NPS exit always use a 60% lump sum and 40% annuity?", answer: "No. Current rules distinguish subscriber categories and corpus bands. A universal 60/40 statement is incomplete and can be outdated for the relevant context." },
      { question: "Is the monthly annuity estimate an ASP quote?", answer: "No. It is simple arithmetic using the entered assumed rate and does not model an annuity service provider's pricing or contract terms." },
    ],
  },
  {
    title: "Why the NPS Calculator Is Not an Actual Pension Quote",
    slug: "nps-calculator-assumptions",
    description: "Why constant returns, contribution schedules, allocation controls and an assumed annuity rate cannot reproduce an actual NPS account or pension quote.",
    category: "retirement",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "nps",
    calculatorGuideRole: "supporting",
    relatedCalculators: [],
    relatedArticles: ["nps-explained", "nps-lump-sum-and-annuity"],
    sections: [
      {
        id: "projection",
        heading: "A standardized projection is not an NPS account forecast",
        paragraphs: [
          "The calculator applies one constant entered return to a fixed monthly contribution schedule, with any entered annual step-up occurring after each completed year. Actual NPS investment values vary with fund performance, asset allocation, contribution timing, units, charges and account activity.",
          "The projected corpus is therefore a scenario, not current fund performance, a guaranteed NPS return or a prediction of the account balance at retirement.",
        ],
      },
      {
        id: "allocation-eligibility",
        heading: "An allocation control does not determine regulatory eligibility",
        paragraphs: [
          "The entered annuity allocation divides the projected corpus mathematically. It does not classify the subscriber, identify an exit event, test vesting, apply corpus exceptions, decide Tier I or Tier II treatment, or determine the withdrawal and annuity treatment allowed by current rules.",
          "Actual exit rules can also change. Verify current official material for the account and event rather than treating a calculator selection as statutory eligibility.",
        ],
      },
      {
        id: "annuity-pricing",
        heading: "Actual annuity pricing requires product-specific information",
        paragraphs: [
          "The assumed annuity rate is an editable illustration. The calculator does not request an annuity service provider, purchase age, annuity option, payment guarantee, spouse continuation, return-of-purchase-price feature or payout-frequency terms.",
          "Because insurer pricing and contract terms are absent, the estimated monthly annuity is not an insurer quote, ASP quote, guaranteed pension or guaranteed payout.",
        ],
      },
      {
        id: "excluded-effects",
        heading: "Taxes, charges, rules and rounding can change interpretation",
        list: [
          "Taxes are not calculated; applicable tax treatment depends on current law and circumstances.",
          "NPS intermediary, fund and transaction charges are not deducted by the projection.",
          "The calculator does not decide actual exit or withdrawal rules.",
          "Displayed currency is rounded to two decimal places while the engine retains full precision.",
          "Changing or missing contributions changes both contributed capital and estimated growth.",
        ],
        paragraphs: [
          [
            { text: "Return to " },
            { text: "NPS Explained", link: { kind: "article", slug: "nps-explained" } },
            { text: " or review the distinction between " },
            { text: "calculator allocation and actual rules", link: { kind: "article", slug: "nps-lump-sum-and-annuity" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Compare assumptions, not quotes",
          text: [
            { text: "Change one input at a time in the " },
            { text: "NPS Calculator", link: { kind: "calculator", slug: "nps" } },
            { text: " to see what drives the illustration." },
          ],
        },
      },
    ],
    faq: [
      { question: "Is the projected corpus guaranteed?", answer: "No. It depends on a constant entered return, while actual NPS performance and contribution activity vary." },
      { question: "Is the estimated annuity an insurer or ASP quote?", answer: "No. The calculator does not use provider pricing, purchase age or annuity-option terms." },
      { question: "Does the calculator include NPS charges and taxes?", answer: "No. It does not deduct charges or calculate tax treatment." },
    ],
  },
] satisfies readonly Article[];
