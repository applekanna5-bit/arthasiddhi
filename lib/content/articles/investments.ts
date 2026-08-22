import { calculateCagr } from "../../calculator/expanded-calculators";
import { formatIndianCurrency, formatPercentage } from "../../calculator/formatting";
import type { Article } from "../types";

const positiveCagrExample = calculateCagr({ beginningValue: 100_000, endingValue: 200_000, durationYears: 5 });
const negativeCagrExample = calculateCagr({ beginningValue: 200_000, endingValue: 150_000, durationYears: 3 });
const zeroEndingCagrExample = calculateCagr({ beginningValue: 100_000, endingValue: 0, durationYears: 5 });
const absoluteReturnExample = ((positiveCagrExample.endingValue - positiveCagrExample.beginningValue) / positiveCagrExample.beginningValue) * 100;

export const investmentArticles = [
  {
    title: "SIP Explained for Beginners",
    slug: "sip-explained",
    description: "How monthly SIP contributions add up, where projected growth comes from and how to read the future value.",
    category: "investments",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-17",
    readingTime: "6 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "sip",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["sip-return-calculation", "sip-vs-lumpsum", "fixed-sip-vs-step-up-sip", "sip-projection-assumptions", "compound-interest"],
    sections: [
      {
        id: "monthly-investing",
        heading: "What happens when you invest every month",
        paragraphs: [
          "When you invest through a monthly SIP, the final projection has two parts: the money you contributed and the growth calculated at the return entered. Reading those parts separately shows how much came from you and how much depends on the projection.",
          "A systematic investment plan, or SIP, is a method of investing a fixed amount at regular intervals. It is not a separate investment product, and it does not decide which investment is suitable for you.",
        ],
      },
      {
        id: "worked-example",
        heading: "Worked example: ₹5,000 a month for 10 years",
        paragraphs: [
          "Suppose you invest ₹5,000 at the beginning of every month for 10 years and enter an assumed annual return of 10%. Using monthly compounding and the same beginning-of-month convention as the ArthaSiddhi SIP Calculator, the projection is:",
        ],
        table: {
          caption: "Illustrative SIP projection at a 10% assumed annual return",
          headers: ["Total invested", "Projected growth", "Projected future value"],
          rows: [["₹6,00,000", "₹4,32,760", "₹10,32,760"]],
        },
      },
      {
        id: "where-growth-comes-from",
        heading: "Where projected growth comes from",
        paragraphs: [
          "You make 120 contributions in this example. The earlier instalments stay invested for longer, while the later ones have less time to grow. Together, your contributions add up to ₹6,00,000; the other ₹4,32,760 is projected growth at the return entered.",
          [
            { text: "Once growth is added, that larger value can also take part in later growth. The " },
            { text: "compound interest guide", link: { kind: "article", slug: "compound-interest" } },
            { text: " explains that effect in more detail." },
          ],
        ],
      },
      {
        id: "return-assumption",
        heading: "Why the entered return is only an assumption",
        paragraphs: [
          "The calculator applies one constant return to build a projection. Actual investment returns are not constant or guaranteed: market values can rise or fall, and the path will not match a smooth monthly calculation.",
          "Change the assumed return and the projected growth changes too. Your ₹6,00,000 of contributions does not change, but the future value does.",
        ],
      },
      {
        id: "what-sip-decides",
        heading: "What a SIP does—and does not—decide",
        paragraphs: [
          "A SIP sets the amount and schedule for investing. It does not remove market risk, guarantee a return or choose the underlying investment for you.",
        ],
      },
      {
        id: "before-starting",
        heading: "What to choose before starting",
        list: [
          "Monthly amount: decide how much you plan to invest with each instalment.",
          "Investment period: decide how long you want the projection to run.",
          "Underlying investment: read the scheme information, costs and risk details before investing.",
        ],
      },
      {
        id: "read-the-result",
        heading: "Read the result in three parts",
        paragraphs: [
          "Start with total invested, then read projected growth, and only then look at the projected future value. Change the assumed return once to see how much of that final figure depends on the assumption.",
        ],
        callout: {
          title: "Check your own SIP projection",
          text: [
            { text: "Enter a monthly amount, period and assumed return in the " },
            { text: "SIP Calculator", link: { kind: "calculator", slug: "sip" } },
            { text: "." },
          ],
        },
      },
      {
        id: "explore-the-projection",
        heading: "Explore one question at a time",
        paragraphs: [
          [
            { text: "For the mechanics behind the projection, read " },
            { text: "how monthly contributions and their timing produce the displayed value", link: { kind: "article", slug: "sip-return-calculation" } },
            { text: "." },
          ],
          [
            { text: "The comparisons between " },
            { text: "a SIP and a one-time investment", link: { kind: "article", slug: "sip-vs-lumpsum" } },
            { text: " and between " },
            { text: "a fixed SIP and an annually increasing SIP", link: { kind: "article", slug: "fixed-sip-vs-step-up-sip" } },
            { text: " keep their assumptions explicit rather than naming a universal winner." },
          ],
          [
            { text: "Before treating any projected value as an outcome, review " },
            { text: "what the constant-return model leaves out", link: { kind: "article", slug: "sip-projection-assumptions" } },
            { text: "." },
          ],
        ],
      },
    ],
    faq: [
      { question: "Is a SIP guaranteed to make money?", answer: "No. A SIP is an investing method. Returns and capital value can rise or fall when the underlying investment is market-linked." },
      { question: "Can I change my SIP amount?", answer: "That depends on the investment platform and scheme. Check the current instructions and terms before changing the amount." },
    ],
  },
  {
    title: "How SIP Returns Are Calculated: Contributions, Timing and Projected Growth",
    slug: "sip-return-calculation",
    description: "How monthly SIP contributions, contribution timing and an assumed return produce total invested, projected growth and future value.",
    category: "investments",
    publishedAt: "2026-08-18",
    updatedAt: "2026-08-18",
    readingTime: "8 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "sip",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["sip-explained", "sip-projection-assumptions"],
    sections: [
      {
        id: "three-parts",
        heading: "A SIP projection has three parts",
        paragraphs: [
          "A SIP projection starts with every scheduled contribution, gives each contribution a growth period and adds the resulting values together. The output separates total invested from projected growth; their sum is the projected future value.",
          "Total invested follows from the contribution schedule. Projected growth depends on the assumed return and the model's timing convention, so it is not an earned result or a promise of return.",
        ],
      },
      {
        id: "different-growth-periods",
        heading: "Why every monthly contribution grows for a different period",
        paragraphs: [
          "A monthly SIP is a series of contributions, not one amount invested on the first day. The earliest contribution remains in the projection for almost the full duration. Each later contribution has one month less, and the final contribution has the shortest growth period.",
          "That difference in time is why multiplying the total contributions by one ten-year growth factor would be wrong. The model grows each monthly amount for the time available to it and then combines the results.",
        ],
      },
      {
        id: "calculator-convention",
        heading: "The contribution and return convention used here",
        paragraphs: [
          "ArthaSiddhi models each contribution at the beginning of the month. A contribution therefore receives that month's modelled growth before the next contribution is added.",
          "The entered annual percentage is divided by 12 and by 100 to produce the monthly rate used by the projection. At 12% a year, the periodic convention is 1% a month. This is a modelling conversion, not a claim that a market investment earns 1% in every month.",
        ],
      },
      {
        id: "worked-example",
        heading: "Worked example: ₹5,000 a month for 10 years",
        paragraphs: [
          "Suppose ₹5,000 is contributed at the beginning of every month for 10 years and the projection uses a constant 12% annual return, converted to 1% a month. There are 120 contributions under these assumptions.",
        ],
        table: {
          caption: "Beginning-of-month SIP projection at an illustrative 12% annual return",
          headers: ["Monthly contribution", "Duration", "Total invested", "Projected growth", "Projected future value"],
          rows: [["₹5,000", "10 years", "₹6,00,000", "₹5,61,695", "₹11,61,695"]],
        },
      },
      {
        id: "read-example",
        heading: "What the worked result means",
        paragraphs: [
          "The ₹6,00,000 is defined by ₹5,000 multiplied by 120 monthly contributions. The other ₹5,61,695 is projected growth produced by applying the smooth-return convention to contributions made at different times.",
          "The projected future value of ₹11,61,695 is the sum of those two parts. It does not mean every contribution earns the same rupee gain: the early contributions account for more projected growth because they remain in the model for longer.",
        ],
      },
      {
        id: "changing-inputs",
        heading: "What changes when one input moves",
        list: [
          "Monthly amount: a larger contribution raises both total invested and the capital available for projected growth.",
          "Duration: more months add more contributions and give the earlier contributions more time in the model.",
          "Assumed return: total invested stays unchanged, but projected growth and future value move.",
        ],
        paragraphs: [
          [
            { text: "The " },
            { text: "projection-assumptions guide", link: { kind: "article", slug: "sip-projection-assumptions" } },
            { text: " shows why changing only the assumed return can produce materially different values even though the contribution schedule is identical." },
          ],
        ],
        callout: {
          title: "Test the mechanics with your figures",
          text: [
            { text: "Use the " },
            { text: "SIP projection tool", link: { kind: "calculator", slug: "sip" } },
            { text: " to change one input at a time, or return to " },
            { text: "SIP Explained", link: { kind: "article", slug: "sip-explained" } },
            { text: " for the beginner overview." },
          ],
        },
      },
    ],
    faq: [
      { question: "Why is total invested different from projected growth?", answer: "Total invested is the sum of scheduled contributions. Projected growth is the modelled increase generated from those contributions using the entered return and timing convention." },
      { question: "Why does the first SIP contribution have more projected growth?", answer: "It enters the model earlier and therefore has more monthly growth periods than a contribution made near the end." },
      { question: "Does dividing an annual return by 12 predict each month's market return?", answer: "No. It is the periodic convention used for a smooth projection. Actual monthly returns can be positive, negative or uneven." },
    ],
  },
  {
    title: "SIP vs Lumpsum: How Contribution Timing Changes the Projection",
    slug: "sip-vs-lumpsum",
    description: "A controlled comparison showing how gradual monthly contributions and one amount invested upfront produce different projections.",
    category: "investments",
    publishedAt: "2026-08-18",
    updatedAt: "2026-08-18",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "sip",
    calculatorGuideRole: "supporting",
    relatedCalculators: ["lumpsum"],
    relatedArticles: ["sip-explained", "sip-return-calculation"],
    sections: [
      {
        id: "answer",
        heading: "Timing—not a universal winner—drives this comparison",
        paragraphs: [
          "A lumpsum placed at the start has the full period in the projection. SIP capital enters month by month, so later contributions have less time to grow. When total capital, duration and assumed annual return are held constant, that timing difference changes the projected value.",
          "This mathematical comparison does not establish which approach is suitable or which will produce a better real-world outcome. It isolates contribution timing under a smooth-return model.",
        ],
      },
      {
        id: "assumptions",
        heading: "What the comparison holds constant",
        list: [
          "Total capital contributed: ₹6,00,000 in both cases.",
          "Duration: 10 years.",
          "Assumed annual return: 12% in both projections.",
          "Fees, taxes and withdrawals: excluded.",
          "SIP timing: ₹5,000 at the beginning of each month for 120 months.",
          "Lumpsum timing: the full ₹6,00,000 at the start of the 10-year period.",
        ],
      },
      {
        id: "worked-comparison",
        heading: "Controlled projection with equal contributed capital",
        paragraphs: [
          "The SIP uses the site's monthly beginning-of-month convention. The lumpsum compounds once per year at the same entered annual rate. The conventions match the corresponding ArthaSiddhi tools.",
        ],
        table: {
          caption: "₹6 lakh contributed over or at the start of 10 years at an illustrative 12% annual return",
          headers: ["Method", "Contribution timing", "Capital contributed", "Projected growth", "Projected future value"],
          rows: [
            ["Monthly SIP", "₹5,000 at the beginning of each month", "₹6,00,000", "₹5,61,695", "₹11,61,695"],
            ["Lumpsum", "₹6,00,000 at the start", "₹6,00,000", "₹12,63,509", "₹18,63,509"],
          ],
        },
      },
      {
        id: "why-results-differ",
        heading: "Why the projected values differ",
        paragraphs: [
          "The difference is not created by contributing more to the lumpsum: both rows use ₹6,00,000. It arises because every rupee of the lumpsum is present from the start, while much of the SIP capital arrives years later.",
          [
            { text: "For a closer look at the monthly timing mechanics, read " },
            { text: "how SIP contributions build the projection", link: { kind: "article", slug: "sip-return-calculation" } },
            { text: "." },
          ],
        ],
      },
      {
        id: "real-world-limit",
        heading: "Real markets do not follow the smooth comparison",
        paragraphs: [
          "Market returns do not arrive as a constant 12% each year or 1% each month. Prices can rise or fall between contributions, so the actual sequence of returns can change the outcome for both approaches.",
          "The example also assumes the full lumpsum is available on day one. If capital becomes available gradually, that is a different cash-flow situation and should not be presented as the same comparison.",
        ],
        callout: {
          title: "Compare the two cash-flow patterns",
          text: [
            { text: "Model monthly contributions with the " },
            { text: "SIP tool", link: { kind: "calculator", slug: "sip" } },
            { text: " and a one-time amount with the " },
            { text: "lumpsum projection tool", link: { kind: "calculator", slug: "lumpsum" } },
            { text: ". For the underlying beginner concepts, see " },
            { text: "SIP Explained", link: { kind: "article", slug: "sip-explained" } },
            { text: "." },
          ],
        },
      },
    ],
    faq: [
      { question: "Is it fair to compare a ₹5,000 SIP with a ₹6 lakh lumpsum?", answer: "Only when the comparison clearly states that both contribute ₹6 lakh in total and explains that the lumpsum is available earlier. The cash-flow timing remains different." },
      { question: "Does the higher projected lumpsum value mean it will always perform better?", answer: "No. The table is a smooth-return timing illustration, not a forecast. Actual market returns are uneven, and personal cash availability and risk are outside the calculation." },
    ],
  },
  {
    title: "Fixed SIP vs Step-up SIP: What an Annual Increase Changes",
    slug: "fixed-sip-vs-step-up-sip",
    description: "How an annual increase changes total contributions and projected value compared with keeping the monthly SIP fixed.",
    category: "investments",
    publishedAt: "2026-08-18",
    updatedAt: "2026-08-18",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "sip",
    calculatorGuideRole: "supporting",
    relatedCalculators: ["step-up-sip"],
    relatedArticles: ["sip-explained", "sip-projection-assumptions"],
    sections: [
      {
        id: "difference",
        heading: "A step-up changes the contribution schedule",
        paragraphs: [
          "A fixed SIP keeps the monthly contribution unchanged. A step-up SIP raises that monthly amount at a stated interval; in this example, the increase happens once after every 12 contributions.",
          "The step-up projection can be higher for two separate reasons: more money is contributed, and those additional contributions receive modelled growth. Calling the entire difference 'extra return' would confuse capital added with projected growth.",
        ],
      },
      {
        id: "assumptions",
        heading: "What the worked comparison assumes",
        list: [
          "Starting monthly contribution: ₹5,000 in both cases.",
          "Fixed SIP increase: 0% a year.",
          "Step-up SIP increase: 10% once a year.",
          "Duration: 10 years.",
          "Assumed annual return: 12%, converted to the site's monthly convention.",
          "Contribution timing: beginning of each month; fees and taxes excluded.",
        ],
      },
      {
        id: "worked-example",
        heading: "Worked example: fixed ₹5,000 vs 10% annual step-up",
        table: {
          caption: "Ten-year projections at an illustrative 12% annual return",
          headers: ["Schedule", "Total invested", "Projected growth", "Projected future value", "Monthly contribution in year 10"],
          rows: [
            ["Fixed ₹5,000 a month", "₹6,00,000", "₹5,61,695", "₹11,61,695", "₹5,000"],
            ["₹5,000 initially; 10% annual step-up", "₹9,56,245", "₹7,30,918", "₹16,87,163", "₹11,790"],
          ],
        },
      },
      {
        id: "separate-contributions-growth",
        heading: "Separate additional contributions from projected growth",
        paragraphs: [
          "The step-up schedule contributes about ₹3,56,245 more over the decade. Its projected growth is about ₹1,69,222 higher. Together those two changes account for the roughly ₹5,25,468 difference between the projected future values, subject to displayed rounding.",
          "The annual increase also means the monthly contribution reaches about ₹11,790 in year 10. A projection should not hide that higher future cash commitment behind the larger final value.",
        ],
      },
      {
        id: "interpretation",
        heading: "What the comparison can and cannot show",
        paragraphs: [
          "The table shows the mathematical effect of one fixed escalation schedule. It does not show whether a future contribution will fit a person's income or whether the underlying investment will deliver the assumed return.",
          [
            { text: "Review the " },
            { text: "limits of smooth SIP projections", link: { kind: "article", slug: "sip-projection-assumptions" } },
            { text: " before treating either value as an expected outcome." },
          ],
        ],
        callout: {
          title: "Model each schedule separately",
          text: [
            { text: "Use the " },
            { text: "fixed-contribution SIP tool", link: { kind: "calculator", slug: "sip" } },
            { text: " and the " },
            { text: "annual step-up tool", link: { kind: "calculator", slug: "step-up-sip" } },
            { text: ". Return to " },
            { text: "SIP Explained", link: { kind: "article", slug: "sip-explained" } },
            { text: " for the core concept." },
          ],
        },
      },
    ],
    faq: [
      { question: "Is the difference in future value all investment growth?", answer: "No. A step-up schedule contributes more capital. Compare total invested and projected growth separately before comparing the final values." },
      { question: "When does the annual step-up occur in this example?", answer: "The monthly contribution increases after each block of 12 contributions, so the second year's monthly amount is 10% above the first year's amount." },
    ],
  },
  {
    title: "Why a SIP Projection Is Not a Return Guarantee",
    slug: "sip-projection-assumptions",
    description: "Why constant-return SIP projections differ from market outcomes, and how return assumptions, timing, costs and taxes affect interpretation.",
    category: "investments",
    publishedAt: "2026-08-18",
    updatedAt: "2026-08-18",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "sip",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 50,
    relatedCalculators: [],
    relatedArticles: ["sip-explained", "sip-return-calculation", "fixed-sip-vs-step-up-sip"],
    sections: [
      {
        id: "answer",
        heading: "A projection applies an assumption; the market supplies the outcome",
        paragraphs: [
          "A SIP projection is not a return guarantee because it applies one constant assumed rate to a contribution schedule. Actual investment values respond to changing market prices, costs, taxes and the timing of each contribution.",
          "Total contributions are defined by the schedule. Projected growth is model-dependent. Actual market growth remains uncertain.",
        ],
      },
      {
        id: "constant-return-model",
        heading: "What constant-return modelling does",
        paragraphs: [
          "The site's SIP model divides the entered annual percentage by 12 and applies that monthly rate to beginning-of-month contributions. That produces a consistent scenario that is useful for comparing inputs.",
          "It does not predict a repeated monthly market return. Real monthly results may be positive, negative or flat, and the path taken can matter as much as a long-period average.",
        ],
      },
      {
        id: "three-assumptions",
        heading: "One contribution schedule, three return assumptions",
        paragraphs: [
          "Each row below uses ₹5,000 at the beginning of every month for 10 years. Only the assumed annual return changes. None of the three rates is presented as expected or recommended.",
        ],
        table: {
          caption: "Illustrative SIP projections with total contributions fixed at ₹6,00,000",
          headers: ["Assumed annual return", "Total contributions", "Projected growth", "Projected future value"],
          rows: [
            ["8%", "₹6,00,000", "₹3,20,828", "₹9,20,828"],
            ["10%", "₹6,00,000", "₹4,32,760", "₹10,32,760"],
            ["12%", "₹6,00,000", "₹5,61,695", "₹11,61,695"],
          ],
        },
      },
      {
        id: "read-scenarios",
        heading: "What changes—and what does not—in the table",
        paragraphs: [
          "The ₹6,00,000 contribution total does not move because the amount and schedule are unchanged. The projected future value does move because each rate produces a different modelled growth path.",
          [
            { text: "The contribution-by-contribution mechanics are explained in " },
            { text: "the SIP return calculation guide", link: { kind: "article", slug: "sip-return-calculation" } },
            { text: "." },
          ],
        ],
      },
      {
        id: "sequence",
        heading: "Why the sequence of market returns matters",
        paragraphs: [
          "Two periods can have the same broad average return but different monthly paths. Because a SIP adds money throughout the period, a fall before many later contributions and a fall near the end do not affect the accumulated units and ending value in the same way.",
          "A constant-return table removes that sequence so inputs can be compared cleanly. Removing it from the model does not remove it from real investing.",
        ],
      },
      {
        id: "excluded-effects",
        heading: "Costs, taxes, timing and rounding can change the outcome",
        list: [
          "Fees and product costs can reduce the value retained by the investor and are not deducted by the projection.",
          "Taxes depend on the investment and the applicable rules and are not calculated in the displayed SIP result.",
          "Actual debit, allotment and valuation timing may differ from a beginning-of-month convention.",
          "Displayed rupee values are rounded, while the engine calculates with unrounded numbers.",
          "Changing, pausing or missing contributions changes both total capital and the periods available for growth.",
        ],
      },
      {
        id: "use-projection",
        heading: "Use a range to understand the assumption",
        paragraphs: [
          "Changing the assumed return is useful because it reveals how much of the displayed value depends on that input. It does not turn the highest or lowest scenario into a forecast.",
          [
            { text: "A rising contribution schedule introduces another variable; the " },
            { text: "fixed-versus-step-up comparison", link: { kind: "article", slug: "fixed-sip-vs-step-up-sip" } },
            { text: " separates additional capital from projected growth." },
          ],
        ],
        callout: {
          title: "Compare assumptions, not predictions",
          text: [
            { text: "Change one rate at a time in the " },
            { text: "SIP projection tool", link: { kind: "calculator", slug: "sip" } },
            { text: ". For the beginner overview, return to " },
            { text: "SIP Explained", link: { kind: "article", slug: "sip-explained" } },
            { text: "." },
          ],
        },
      },
    ],
    faq: [
      { question: "Are 8%, 10% or 12% expected SIP returns?", answer: "No. They are illustrative inputs used to show how the model changes. None is an expected, promised or recommended return." },
      { question: "Why can an actual SIP value differ from the projection?", answer: "Actual returns vary over time, while the projection uses a constant rate. Costs, taxes, transaction timing and changes to contributions can also alter the outcome." },
      { question: "Is the total contribution also uncertain?", answer: "The scheduled total is defined by the amount and number of contributions. It changes if contributions are increased, reduced, paused or missed." },
    ],
  },
  {
    title: "CAGR Explained: Beginning Value, Ending Value and Years",
    slug: "cagr-explained",
    description: "What CAGR means, how beginning value, ending value and whole years produce an annualized growth rate, and what the result leaves out.",
    category: "investments",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "8 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "cagr",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["cagr-vs-absolute-return", "cagr-and-year-to-year-volatility", "cagr-vs-average-annual-return"],
    sections: [
      {
        id: "meaning",
        heading: "CAGR annualizes the change between two values",
        paragraphs: [
          "Compound annual growth rate, or CAGR, is the constant annualized rate that connects a beginning value to an ending value over a specified duration. It smooths the full endpoint change into one yearly equivalent; it is not a record of the return achieved in each individual year.",
          "CAGR can make endpoint growth over periods of different lengths easier to compare on an annualized basis. That comparison still needs context because CAGR does not reveal volatility, cash flows, costs, taxes or the path taken between the endpoints.",
        ],
      },
      {
        id: "inputs",
        heading: "Beginning value, ending value and duration define the result",
        list: [
          "Beginning value is the positive value at the start of the measured period.",
          "Ending value is the value at the end of that period and may be zero or positive.",
          "Duration is the number of whole years between the endpoints.",
        ],
      },
      {
        id: "formula",
        heading: "How the CAGR formula connects the endpoints",
        paragraphs: [
          "The calculator uses: CAGR = ((ending value / beginning value)^(1 / duration in years) - 1) × 100. Dividing the ending value by the beginning value gives the full-period growth factor. Taking its whole-period annual root converts that factor into a constant yearly equivalent, and subtracting one expresses the growth rate before conversion to a percentage.",
          [
            { text: "This formula annualizes an endpoint relationship rather than teaching generic compounding mechanics. For that broader concept, see " },
            { text: "What Is Compound Interest?", link: { kind: "article", slug: "compound-interest" } },
            { text: "." },
          ],
        ],
      },
      {
        id: "positive-example",
        heading: "Worked example: value doubles over five years",
        paragraphs: ["A beginning value of ₹1,00,000 and ending value of ₹2,00,000 over five whole years produce the following engine-calculated result."],
        table: {
          caption: "CAGR from ₹1,00,000 to ₹2,00,000 over five years",
          headers: ["Beginning value", "Ending value", "Duration", "CAGR"],
          rows: [[formatIndianCurrency(positiveCagrExample.beginningValue), formatIndianCurrency(positiveCagrExample.endingValue), "5 years", formatPercentage(positiveCagrExample.cagrPercentage)]],
        },
      },
      {
        id: "result-signs",
        heading: "Positive, zero and negative CAGR describe endpoint direction",
        paragraphs: [
          "CAGR is positive when the ending value is above the beginning value and zero when the two values are equal. It is negative when the ending value is below the beginning value over the selected period; that description is mathematical, not investment advice.",
          `The current engine returns ${formatPercentage(zeroEndingCagrExample.cagrPercentage)} when the ending value is zero. It does not support a zero or negative beginning value, or a negative ending value.`,
        ],
        table: {
          caption: "Negative CAGR from ₹2,00,000 to ₹1,50,000 over three years",
          headers: ["Beginning value", "Ending value", "Duration", "CAGR"],
          rows: [[formatIndianCurrency(negativeCagrExample.beginningValue), formatIndianCurrency(negativeCagrExample.endingValue), "3 years", formatPercentage(negativeCagrExample.cagrPercentage)]],
        },
      },
      {
        id: "boundaries",
        heading: "Calculator boundaries and assumptions",
        list: [
          "The beginning value must be greater than zero, while the ending value may be zero or positive.",
          "Negative values are unsupported.",
          "Duration must be a whole number from 1 to 100 years; fractional years are unsupported.",
          "The calculation uses only the two endpoints and duration.",
          "Periodic contributions, withdrawals, dividends and other interim cash flows are unsupported.",
        ],
      },
      {
        id: "limitations",
        heading: "What CAGR does not show",
        paragraphs: [
          "CAGR does not show the sequence or volatility of values between the endpoints, and it does not prove that a constant return was actually realized each year. Two paths with identical endpoints and duration receive the same CAGR even when their interim movements differ.",
          "CAGR is not a forecast, guarantee or complete assessment of investment quality. A higher CAGR alone does not establish that one investment is better, because risk, cash-flow timing, costs and other facts are outside this calculation.",
          [
            { text: "Compare CAGR with " },
            { text: "absolute return", link: { kind: "article", slug: "cagr-vs-absolute-return" } },
            { text: ", examine its " },
            { text: "year-to-year volatility limitation", link: { kind: "article", slug: "cagr-and-year-to-year-volatility" } },
            { text: ", or distinguish it from " },
            { text: "average annual return", link: { kind: "article", slug: "cagr-vs-average-annual-return" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Annualize your endpoints",
          text: [
            { text: "Enter a beginning value, ending value and whole-year duration in the " },
            { text: "CAGR Calculator", link: { kind: "calculator", slug: "cagr" } },
            { text: "." },
          ],
        },
      },
    ],
    faq: [
      { question: "Is CAGR the return earned in every year?", answer: "No. CAGR is one constant annualized rate connecting the beginning and ending values. Actual values may have changed unevenly between those endpoints." },
      { question: "Can CAGR be negative?", answer: "Yes. When the ending value is below a positive beginning value, the calculator can produce a negative CAGR. An ending value of zero produces -100%." },
      { question: "Does the CAGR Calculator include contributions or dividends?", answer: "No. It uses only beginning value, ending value and whole-year duration. Contributions, withdrawals, dividends and other interim cash flows are not modeled." },
    ],
  },
  {
    title: "CAGR vs Absolute Return: Annualized Growth and Total Change",
    slug: "cagr-vs-absolute-return",
    description: "How absolute return measures total endpoint change while CAGR expresses the same beginning and ending values as an annualized rate.",
    category: "investments",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "6 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "cagr",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["cagr-explained", "cagr-vs-average-annual-return"],
    sections: [
      {
        id: "different-questions",
        heading: "Absolute return and CAGR answer different questions",
        paragraphs: [
          "Absolute return is the total percentage change from beginning value to ending value across the full period. It does not annualize that change or account for how long the change took.",
          "CAGR is the constant annualized equivalent connecting the same endpoints over the stated number of whole years. It provides a per-year equivalent, but not the actual return for each year.",
        ],
      },
      {
        id: "worked-comparison",
        heading: "Worked comparison: ₹1,00,000 becomes ₹2,00,000",
        paragraphs: ["For absolute return, transparent endpoint arithmetic gives ((₹2,00,000 - ₹1,00,000) / ₹1,00,000) × 100. The CAGR shown below comes from the calculator engine."],
        table: {
          caption: "Absolute return and CAGR for the same five-year endpoint change",
          headers: ["Measure", "Period covered", "Result"],
          rows: [
            ["Absolute return", "Full 5-year period", formatPercentage(absoluteReturnExample)],
            ["CAGR", "Annualized across 5 years", formatPercentage(positiveCagrExample.cagrPercentage)],
          ],
        },
      },
      {
        id: "interpretation",
        heading: "Why 100% and 14.87% can both be correct",
        paragraphs: [
          "The 100% absolute return says the ending value is twice the beginning value over the complete five-year period. The CAGR expresses that same endpoint relationship as the constant yearly rate that would connect the two values across five years.",
          "Neither measure is universally better. The useful measure depends on whether the question concerns total change or an annualized endpoint comparison. Neither shows volatility or interim cash flows.",
          [
            { text: "For the inputs, formula and supported boundaries, read " },
            { text: "CAGR Explained", link: { kind: "article", slug: "cagr-explained" } },
            { text: ". To avoid confusing annualization with arithmetic averaging, see " },
            { text: "CAGR vs Average Annual Return", link: { kind: "article", slug: "cagr-vs-average-annual-return" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Calculate the annualized measure",
          text: [
            { text: "Use the " },
            { text: "CAGR Calculator", link: { kind: "calculator", slug: "cagr" } },
            { text: " for the CAGR; absolute return remains a separate full-period calculation." },
          ],
        },
      },
    ],
    faq: [
      { question: "Is absolute return annualized?", answer: "No. Absolute return measures the total percentage change over the complete period without converting it to a yearly rate." },
      { question: "Why is CAGR lower than absolute return in the five-year example?", answer: "The 100% absolute return covers all five years, while 14.87% is the annualized equivalent connecting the same endpoints across those years." },
      { question: "Does either measure show volatility?", answer: "No. Both endpoint measures omit the path taken between the beginning and ending values." },
    ],
  },
  {
    title: "Why CAGR Can Hide Year-to-Year Volatility",
    slug: "cagr-and-year-to-year-volatility",
    description: "Why identical endpoints produce identical CAGR even when hypothetical paths differ, and why CAGR does not show volatility or interim cash flows.",
    category: "investments",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "6 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "cagr",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 50,
    relatedCalculators: [],
    relatedArticles: ["cagr-explained", "cagr-vs-absolute-return"],
    sections: [
      {
        id: "endpoint-only",
        heading: "CAGR knows the endpoints, not the path",
        paragraphs: [
          "The calculator receives beginning value, ending value and duration. It receives no year-by-year values, so it cannot observe the size, timing or frequency of movements between the endpoints.",
          "Identical beginning values, ending values and durations therefore produce identical CAGR. The result remains the same even when one hypothetical path changes gradually and another hypothetical path rises and falls sharply before reaching the same endpoint.",
        ],
      },
      {
        id: "controlled-example",
        heading: "Controlled hypothetical endpoint comparison",
        paragraphs: ["Both hypothetical cases below begin at ₹1,00,000 and end at ₹2,00,000 after five years. No actual security, fund, index or market history is represented, and no intervening annual values are supplied to the engine."],
        table: {
          caption: "Hypothetical paths with identical engine inputs",
          headers: ["Hypothetical path", "Beginning value", "Ending value", "Duration", "CAGR"],
          rows: [
            ["Path with smaller interim movements", formatIndianCurrency(positiveCagrExample.beginningValue), formatIndianCurrency(positiveCagrExample.endingValue), "5 years", formatPercentage(positiveCagrExample.cagrPercentage)],
            ["Path with larger interim movements", formatIndianCurrency(positiveCagrExample.beginningValue), formatIndianCurrency(positiveCagrExample.endingValue), "5 years", formatPercentage(positiveCagrExample.cagrPercentage)],
          ],
        },
      },
      {
        id: "limitations",
        heading: "The shared CAGR does not establish shared volatility",
        paragraphs: [
          "Matching CAGR does not mean matching volatility, risk or year-by-year returns. CAGR is a smoothed endpoint rate and does not prove that its displayed percentage was actually realized in every year.",
          "CAGR also does not model contributions, withdrawals, dividends or other interim or dated cash flows. It is not a forecast, guarantee or determination of investment quality.",
          [
            { text: "Return to " },
            { text: "CAGR Explained", link: { kind: "article", slug: "cagr-explained" } },
            { text: " for the complete boundaries, or compare the annualized result with " },
            { text: "absolute return", link: { kind: "article", slug: "cagr-vs-absolute-return" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Measure the endpoint rate only",
          text: [
            { text: "The " },
            { text: "CAGR Calculator", link: { kind: "calculator", slug: "cagr" } },
            { text: " annualizes endpoints; it cannot evaluate an unseen year-to-year path." },
          ],
        },
      },
    ],
    faq: [
      { question: "Can two different paths have the same CAGR?", answer: "Yes. If their beginning value, ending value and duration match, the calculator produces the same CAGR even if their hypothetical interim movements differ." },
      { question: "Does CAGR measure volatility?", answer: "No. The calculator has no year-by-year value series and cannot measure movement between the endpoints." },
      { question: "Is CAGR a forecast of future performance?", answer: "No. It annualizes the supplied endpoint relationship and does not predict or guarantee a future result." },
    ],
  },
  {
    title: "CAGR vs Average Annual Return",
    slug: "cagr-vs-average-annual-return",
    description: "Why CAGR is a geometric endpoint rate while an arithmetic average annual return requires actual period-by-period return observations.",
    category: "investments",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    readingTime: "6 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "cagr",
    calculatorGuideRole: "supporting",
    relatedCalculators: [],
    relatedArticles: ["cagr-explained", "cagr-and-year-to-year-volatility"],
    sections: [
      {
        id: "distinction",
        heading: "CAGR is not an arithmetic average annual return",
        paragraphs: [
          "CAGR is a geometric annualized rate connecting a beginning value and ending value across the specified duration. It answers what constant yearly rate is equivalent to that endpoint change.",
          "An arithmetic average annual return adds actual period-by-period returns and divides by the number of periods. That calculation requires the individual annual returns; it is not produced by the CAGR calculator.",
        ],
      },
      {
        id: "insufficient-endpoints",
        heading: "Endpoints alone cannot supply an arithmetic average",
        paragraphs: [
          `For ₹1,00,000 growing to ₹2,00,000 over five years, the engine calculates CAGR of ${formatPercentage(positiveCagrExample.cagrPercentage)}. Beginning value, ending value and years alone are not sufficient to calculate an arithmetic average of the actual annual returns because the intervening yearly observations are unknown.`,
          "Different hypothetical annual-return sequences can connect the same endpoints. Presenting an arithmetic average without those observations would invent data that the calculator neither requests nor calculates.",
        ],
      },
      {
        id: "use-carefully",
        heading: "Keep annualization separate from averaging",
        paragraphs: [
          "Use CAGR when the available question is limited to annualizing a beginning-to-ending relationship. Use the phrase average annual return only when the period-by-period returns and the averaging method are explicitly available.",
          "Neither label by itself shows volatility, interim cash flows or future performance. CAGR does not equal the arithmetic average annual return and is not an actual constant yearly return or forecast.",
          [
            { text: "Review the endpoint formula in " },
            { text: "CAGR Explained", link: { kind: "article", slug: "cagr-explained" } },
            { text: " and the missing-path issue in " },
            { text: "Why CAGR Can Hide Year-to-Year Volatility", link: { kind: "article", slug: "cagr-and-year-to-year-volatility" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Calculate CAGR from endpoints",
          text: [
            { text: "Use the " },
            { text: "CAGR Calculator", link: { kind: "calculator", slug: "cagr" } },
            { text: " only for the annualized endpoint rate, not an arithmetic average of unknown yearly returns." },
          ],
        },
      },
    ],
    faq: [
      { question: "Is CAGR the average of annual returns?", answer: "No. CAGR is a geometric annualized endpoint rate. An arithmetic average requires the actual return for every included period." },
      { question: "Can beginning value, ending value and years reveal the arithmetic average?", answer: "No. Those inputs determine CAGR but do not reveal the individual annual returns needed for an arithmetic average." },
      { question: "Does the CAGR Calculator contain annual return history?", answer: "No. It receives only beginning value, ending value and whole-year duration." },
    ],
  },
] satisfies readonly Article[];
