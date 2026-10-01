import type { Article } from "../types";

export const personalFinanceArticles = [
  {
    title: "How to Build a Personal Financial Plan",
    slug: "how-to-build-a-personal-financial-plan",
    description: "Turn your household's resources, commitments, goals and access needs into an ordered plan, with clear next steps for each decision.",
    category: "personal-finance",
    publishedAt: "2026-10-02",
    updatedAt: "2026-10-02",
    readingTime: "5 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: null,
    calculatorGuideRole: null,
    relatedCalculators: [],
    relatedArticles: ["understand-household-cash-flow", "emergency-fund-planning"],
    sections: [
      {
        id: "current-position",
        heading: "Start with your current financial position",
        paragraphs: [
          "A personal financial plan connects what your household has today with the decisions it needs to make next. This ArthaSiddhi educational planning framework offers a sequence of questions to work through; it is not a regulatory requirement or individualized financial advice.",
          "Begin with a lightweight snapshot of income and other resources, existing assets, debts, recurring commitments and money already assigned to known goals. Approximate values can help you see the position without requiring an exact valuation of every asset. Net worth, a broad comparison of assets and debts, is one possible snapshot; it does not show when money will be available.",
        ],
      },
      {
        id: "cash-flow",
        heading: "Understand what comes in and what is already committed",
        paragraphs: [
          "Before making a larger decision, consider the resources arriving, the obligations they must cover and the flexibility left over. Timing matters: an expected inflow after a bill falls due cannot meet that bill on its own.",
          [{ text: "Use " }, { text: "Understand Your Household Cash Flow", link: { kind: "article", slug: "understand-household-cash-flow" } }, { text: " to map those commitments and their timing before assigning money to another priority." }],
        ],
      },
      {
        id: "known-costs-and-emergencies",
        heading: "Separate known costs from emergency liquidity",
        paragraphs: [
          "Money needed for a known upcoming obligation has a different job from money retained for an unexpected disruption. A planned school fee or repair should remain visible as a commitment rather than also being counted as an untouched emergency reserve.",
          [{ text: "Consider " }, { text: "Emergency Fund Planning: What Money Should Stay Accessible?", link: { kind: "article", slug: "emergency-fund-planning" } }, { text: " for the household factors that can shape this decision. This framework does not prescribe an emergency-fund amount." }],
        ],
      },
      {
        id: "goals-and-timing",
        heading: "Identify competing goals and their timing",
        paragraphs: [
          "List the decisions the household is trying to fund and when each may need money. Different goals compete for limited resources. A near-term payment and a longer-term ambition may need different treatment because their dates and room for adjustment differ.",
          "Compare what is already committed, what can be changed and the consequences of delaying a goal. The order depends on household circumstances; no goal is objectively first for everyone. Record the priority you choose and the reason so you can revisit it when circumstances change.",
        ],
      },
      {
        id: "debt-and-commitments",
        heading: "Consider existing debt and recurring commitments",
        paragraphs: [
          "Existing debt payments and other recurring commitments affect what can be assigned to new goals. Include their amounts, dates and expected duration in the plan, and check the actual terms before considering a change.",
          "A change that releases money for one purpose can alter another obligation. Compare those effects in your household context rather than applying a universal debt payoff order. Loan terms and product-specific processes belong with the relevant Loans guide and lender information.",
        ],
      },
      {
        id: "access-and-investing",
        heading: "Distinguish access needs from longer-term investing decisions",
        paragraphs: [
          "Identify money that may need to be available for bills, near-term goals or disruption before considering longer-horizon uses. An asset's stated value is not enough if its money cannot be accessed when required.",
          "Money considered for a longer horizon raises a different set of questions about the specific investment and its assumptions. The household plan frames those questions; it does not select products, recommend investments or allocate assets.",
        ],
      },
      {
        id: "specialist-questions",
        heading: "Take specific questions to the relevant specialist guide",
        paragraphs: [
          "Once a question becomes about a product, eligibility, current rules, a calculation or a process, use the vertical that owns that detail. Banking owns deposit and access mechanics; Loans owns borrowing mechanics; Investments, Tax and Retirement own their respective product and rule questions.",
          [{ text: "For example, a decision about a property price belongs in " }, { text: "How Much House Can I Afford?", link: { kind: "article", slug: "how-much-house-can-i-afford" } }, { text: ". If your question concerns accessing an existing fixed deposit before its term ends, use " }, { text: "Premature FD Withdrawal", link: { kind: "article", slug: "premature-fd-withdrawal" } }, { text: " for the product-specific considerations. Neither link is a product recommendation." }],
        ],
      },
      {
        id: "review-plan",
        heading: "Review the plan when something meaningful changes",
        paragraphs: [
          "Turn the chosen order into practical next steps: identify which commitment or decision needs attention, what information is missing and what can wait. The plan can remain a short record of priorities and reasons rather than an exhaustive financial document.",
          "Revisit it when income, dependants, debts, commitments or goals materially change. Check whether earlier allocations still serve their intended purpose and whether the timing has shifted. A review can change the order without treating the earlier plan as a failure; there is no fixed review interval prescribed here.",
        ],
      },
    ],
  },
  {
    title: "Understand Your Household Cash Flow",
    slug: "understand-household-cash-flow",
    description: "Map household resources, committed and flexible spending, periodic costs and payment timing before assigning money to competing priorities.",
    category: "personal-finance",
    publishedAt: "2026-10-02",
    updatedAt: "2026-10-02",
    readingTime: "4 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: null,
    calculatorGuideRole: null,
    relatedCalculators: [],
    relatedArticles: ["how-to-build-a-personal-financial-plan", "emergency-fund-planning"],
    sections: [
      {
        id: "why-cash-flow-matters",
        heading: "Cash flow shows what money needs to do and when",
        paragraphs: [
          "Household cash flow is the movement of resources into and out of the household over time. It helps distinguish what is already needed from what remains flexible for competing priorities. This is an ArthaSiddhi educational planning framework, not a required budget method or individualized financial advice.",
          "A total account balance is not automatically the money available for a decision on a particular date. Part of that balance may already be assigned to a bill, while another expected payment may arrive too late to cover it.",
        ],
      },
      {
        id: "resources-and-timing",
        heading: "Map resources and the timing of inflows",
        paragraphs: [
          "Identify income and other resources the household expects to use, along with when they may become available. Distinguish dependable inflows from variable business receipts, irregular work or payments whose arrival remains uncertain.",
          "Existing accessible money can help bridge timing gaps, but it is a stock of money rather than a new recurring income source. Keep its existing assignments visible. An expected future receipt should not silently become money available today.",
        ],
      },
      {
        id: "required-commitments",
        heading: "Identify required or committed obligations",
        paragraphs: [
          "Note payments the household is already obliged or committed to make, such as rent, debt instalments and agreed recurring payments. Their due dates and expected duration matter alongside the amount.",
          "If income arrives after an obligation falls due, review how that gap will be covered. A positive total across a period can still hide a shortfall on an earlier date.",
        ],
      },
      {
        id: "essential-and-flexible-spending",
        heading: "Separate essential recurring spending from flexible spending",
        paragraphs: [
          "Essential recurring spending may include food, utilities, transport and routine care. These costs can vary even when their purpose is essential. Variable spending is therefore not automatically discretionary.",
          "Identify spending whose amount or timing the household can adjust, including discretionary purchases. The distinction depends on your circumstances; it does not require a universal budget ratio or savings percentage. Classify overlapping items once so the same cost is not counted twice.",
        ],
      },
      {
        id: "periodic-costs",
        heading: "Keep irregular and periodic commitments visible",
        paragraphs: [
          "Annual fees, scheduled maintenance, planned travel and other known periodic costs can be missed by a view focused only on a typical month. Record when they are due and whether money has already been assigned to them.",
          "A known future bill is still a commitment even if no payment leaves the account today. The same money should not simultaneously be treated as allocated to that bill and retained for another purpose.",
        ],
        table: {
          caption: "Illustrative cash-flow map: purposes and dates, not a budget template",
          headers: ["Item", "What to identify", "Why timing matters"],
          rows: [
            ["Income or other resources", "Expected arrival and uncertainty", "A receipt after a due date cannot cover the earlier payment by itself."],
            ["Committed and essential costs", "Due dates and amounts that may vary", "Recurring needs use money before a new priority can claim it."],
            ["Known periodic bill", "Date due and money already assigned", "An account balance may include money reserved for this bill."],
            ["Flexible spending or a new goal", "What can change and when money is needed", "Flexibility depends on the other assignments and their dates."],
          ],
        },
      },
      {
        id: "remaining-flexibility",
        heading: "Understand what remains and when it is available",
        paragraphs: [
          "Read the map across dates, not just as one total. Check which resources are accessible before each commitment, what is assigned already and what remains unassigned. If a receipt or cost is uncertain, keep that uncertainty visible rather than treating the remaining flexibility as assured.",
          [{ text: "Unassigned money can still have competing jobs. " }, { text: "Emergency Fund Planning", link: { kind: "article", slug: "emergency-fund-planning" } }, { text: " explains why retaining access for disruption is a separate decision from covering known bills. This view does not produce a safe-to-spend formula." }],
        ],
      },
      {
        id: "later-decisions",
        heading: "Use the view to frame later decisions",
        paragraphs: [
          [{ text: "Take the resulting view back to " }, { text: "How to Build a Personal Financial Plan", link: { kind: "article", slug: "how-to-build-a-personal-financial-plan" } }, { text: " to compare goals and decide which questions need attention next. Revisit the cash-flow view when inflows or commitments change." }],
          [{ text: "If the next question is about buying a home, " }, { text: "How Much House Can I Afford?", link: { kind: "article", slug: "how-much-house-can-i-afford" } }, { text: " owns the property-price decision. Household cash flow supplies context; this page does not calculate home affordability or lender approval." }],
        ],
      },
    ],
  },
  {
    title: "Emergency Fund Planning: What Money Should Stay Accessible?",
    slug: "emergency-fund-planning",
    description: "Understand the purpose of emergency liquidity, the household factors that affect it and why access needs differ from known future bills.",
    category: "personal-finance",
    publishedAt: "2026-10-02",
    updatedAt: "2026-10-02",
    readingTime: "4 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: null,
    calculatorGuideRole: null,
    relatedCalculators: [],
    relatedArticles: ["understand-household-cash-flow", "how-to-build-a-personal-financial-plan", "emergency-fund-before-home-loan"],
    sections: [
      {
        id: "purpose-and-known-bills",
        heading: "Separate emergency liquidity from known future bills",
        paragraphs: [
          "Emergency liquidity is money kept accessible to help the household respond to an unexpected disruption or essential cost. This ArthaSiddhi educational planning framework explains the decision factors; it does not prescribe an amount, a universal reserve or individualized financial advice.",
          "A known upcoming expense is not automatically an emergency. Money assigned to a scheduled fee, planned repair or other foreseeable bill already has a job and should not also be counted as an untouched reserve.",
          [{ text: "Start with " }, { text: "Understand Your Household Cash Flow", link: { kind: "article", slug: "understand-household-cash-flow" } }, { text: " to distinguish known commitments from money available for other purposes." }],
        ],
      },
      {
        id: "possible-disruption",
        heading: "Consider the kinds of disruption the household may need to handle",
        paragraphs: [
          "An interruption in employment or business receipts, or an unexpected essential repair, may change when the household needs money. These are examples of possible disruption, not predictions that such events will occur.",
          "Consider which essential costs and recurring obligations would continue, and what other resources could realistically be available at the time. The purpose is to understand the household's dependence on uninterrupted inflows, rather than to plan from fear.",
        ],
      },
      {
        id: "household-factors",
        heading: "Review the factors that affect the access decision",
        paragraphs: [
          "Households differ in how much uncertainty they face and how quickly they can respond. These factors are planning variables to discuss together, not inputs to a formula or a financial-health score.",
        ],
        list: [
          "Income stability and variability: whether job or business receipts are dependable and how a delay would affect ongoing costs.",
          "Number of income sources: whether one source could continue if another pauses, including whether the sources depend on the same circumstances.",
          "Essential spending, recurring commitments and debt obligations: what would still need payment during a disruption.",
          "Dependants and care responsibilities: whose needs rely on the household's available resources.",
          "Insurance context: what the actual cover, exclusions and claim process mean for a particular situation; do not assume every unexpected cost will be covered or paid immediately.",
          "Access constraints and speed: what can actually become usable money before an urgent payment is due.",
          "Foreseeable near-term commitments: money already needed for known obligations that cannot also serve as an unassigned reserve.",
        ],
      },
      {
        id: "accessibility",
        heading: "Consider availability as well as the amount",
        paragraphs: [
          "A resource may have value without being usable on the required date. Consider how quickly money can be accessed, any conditions that could delay access and who in the household can complete the necessary steps.",
          "Banking owns the mechanics and terms of particular accounts and deposits. Check the relevant product information when an access question reaches that level. This framework does not recommend a banking product or treat every asset as immediately accessible cash.",
        ],
      },
      {
        id: "competing-uses",
        heading: "Compare liquidity with other uses of the same money",
        paragraphs: [
          "Keeping money accessible can compete with paying a known cost, reducing borrowing or funding a longer-term goal. Releasing it for another use may leave less flexibility during disruption; retaining it may delay that other use. The appropriate balance depends on the household rather than a universal amount.",
          [{ text: "When the decision is specifically about buying a home, use " }, { text: "Emergency Fund Before Taking a Home Loan", link: { kind: "article", slug: "emergency-fund-before-home-loan" } }, { text: ". That Home Buying guide owns the trade-off between retained liquidity, down payment, borrowing and purchase-related commitments. This page covers general household emergency liquidity." }],
        ],
      },
      {
        id: "review-liquidity",
        heading: "Review the decision when household circumstances change",
        paragraphs: [
          "Record why you want money to remain accessible and check that it is not also assigned to a known bill. If you choose to retain liquidity, check the actual access arrangements rather than relying only on a balance on paper.",
          [{ text: "Reconsider the decision when income sources, dependants, essential spending, debt obligations, insurance context or near-term commitments materially change. Return to " }, { text: "How to Build a Personal Financial Plan", link: { kind: "article", slug: "how-to-build-a-personal-financial-plan" } }, { text: " to review how it fits with the household's other priorities. No fixed review interval is prescribed." }],
        ],
      },
    ],
  },
  {
    title: "What Is Compound Interest?",
    slug: "compound-interest",
    description: "How compound interest adds interest to both the original amount and earlier interest, with a simple two-year example.",
    category: "personal-finance",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    readingTime: "6 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: null,
    calculatorGuideRole: null,
    relatedCalculators: ["sip", "fd"],
    relatedArticles: ["sip-explained", "fixed-deposit-explained"],
    sections: [
      { id: "compound-interest-basics", heading: "How compound interest works", paragraphs: ["Compound interest is calculated on the original amount and on interest already added to it. Once interest becomes part of the balance, it can earn interest in the next period.", "For this example, suppose ₹1,00,000 grows at a fixed rate of 10% a year. After the first year, the balance is ₹1,10,000. In the second year, 10% is calculated on ₹1,10,000, so the balance becomes ₹1,21,000. The second year adds ₹11,000 because the first year’s ₹10,000 interest also earns a return."] },
      { id: "simple-vs-compound", heading: "Simple interest and compound interest", table: { caption: "How the two interest methods differ", headers: ["Method", "Interest is calculated on", "Effect over time"], rows: [["Simple interest", "Original principal", "The same interest amount is added when the rate stays constant."], ["Compound interest", "Principal plus accumulated interest", "The interest amount can increase as the balance grows."]] } },
      { id: "role-of-time", heading: "Why time changes the result", paragraphs: ["Each compounding period gives earlier interest another opportunity to earn interest. A longer period therefore has a larger effect when the rate stays the same. Regular contributions can also increase the balance on which future returns are calculated.", "The example shows how compounding works; it is not a forecast of investment returns. In practice, fees, taxes, withdrawals and changing returns can all alter the result. Market-linked returns are not fixed or guaranteed."] },
      { id: "using-calculators", heading: "How compounding applies to an FD or SIP", paragraphs: ["For an FD, use the rate, tenure and compounding frequency supplied by the bank. For a SIP or another market-linked investment, the return entered is only an assumption. Compare more than one assumption instead of treating a single projected value as certain."], callout: { title: "Compare the calculation", text: [{ text: "Use the " }, { text: "FD Calculator", link: { kind: "calculator", slug: "fd" } }, { text: " for a deposit with a stated rate, or the " }, { text: "SIP Calculator", link: { kind: "calculator", slug: "sip" } }, { text: " to see how monthly contributions and an assumed return affect projected value." }] } },
    ],
  },
  {
    title: "Inflation Explained: Future Cost, Purchasing Power and Calculator Assumptions",
    slug: "inflation-explained",
    description: "How inflation can raise future costs, reduce purchasing power and change a projection under one assumed annual rate.",
    category: "personal-finance",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    readingTime: "8 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "inflation",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["inflation-future-cost", "purchasing-power-explained", "inflation-calculator-projection-assumptions", "compound-interest"],
    sections: [
      {
        id: "practical-meaning",
        heading: "Inflation changes what an amount of money can represent",
        paragraphs: [
          "Inflation describes a rise in the general price level over time. In practical terms, a cost may require more rupees in the future, while the same nominal amount of money may represent less purchasing power.",
          "The Inflation Calculator turns an entered amount, assumed annual inflation rate and whole-year period into a controlled scenario. It does not retrieve live CPI data or predict the future price of a particular item.",
        ],
      },
      {
        id: "two-modes",
        heading: "Future cost and purchasing power answer different questions",
        table: {
          caption: "The two Inflation Calculator modes",
          headers: ["Mode", "Question answered", "Direction under positive inflation"],
          rows: [
            ["Future cost", "What might today's cost become under the entered assumption?", "The estimated nominal cost rises."],
            ["Purchasing power", "What might the same nominal amount represent later?", "The estimated purchasing power falls."],
          ],
        },
        paragraphs: [
          "Future cost grows today's cost by the annual inflation assumption. Purchasing-power mode divides the entered amount by the same compounded factor. The two values are related, but they should not be treated as interchangeable answers.",
        ],
      },
      {
        id: "worked-example",
        heading: "Worked example: ₹1,00,000 at an assumed 6% for 10 years",
        paragraphs: [
          "Both rows below use ₹1,00,000, an illustrative constant annual inflation assumption of 6% and a 10-year period. The 6% input is not India's current CPI, an inflation forecast, a guaranteed future rate or an investment return.",
        ],
        table: {
          caption: "Two engine-generated inflation scenarios using the same inputs",
          headers: ["Mode", "Current amount", "Assumed annual inflation", "Period", "Estimated value", "Mode-specific change"],
          rows: [
            ["Future cost", "₹1,00,000.00", "6%", "10 years", "₹1,79,084.77", "₹79,084.77 increase"],
            ["Purchasing power", "₹1,00,000.00", "6%", "10 years", "₹55,839.48", "₹44,160.52 erosion"],
          ],
        },
      },
      {
        id: "interpretation",
        heading: "Read each result in the context of its mode",
        paragraphs: [
          "The future-cost result says that a ₹1,00,000 cost becomes about ₹1,79,084.77 in this constant-rate model. It does not forecast the price of a named product or service.",
          "The purchasing-power result does not reduce a ₹1,00,000 bank balance to ₹55,839.48. It estimates what the original nominal amount could represent later under the entered assumption.",
          [
            { text: "See the dedicated explanations of " },
            { text: "future cost", link: { kind: "article", slug: "inflation-future-cost" } },
            { text: " and " },
            { text: "purchasing power", link: { kind: "article", slug: "purchasing-power-explained" } },
            { text: " for the two interpretations." },
          ],
        ],
      },
      {
        id: "compounding",
        heading: "The calculator compounds one entered rate annually",
        paragraphs: [
          "The engine uses one constant rate for every whole year. Each year's modeled price change becomes part of the base for the next year, so the effect accumulates rather than adding the same rupee amount each year.",
          [
            { text: "The generic growth-on-growth idea is covered in " },
            { text: "What Is Compound Interest?", link: { kind: "article", slug: "compound-interest" } },
            { text: ". Here, the calculation is being used to model prices and purchasing power, not interest earned on an investment." },
          ],
        ],
      },
      {
        id: "limitations",
        heading: "A constant-rate result is a scenario, not a forecast",
        paragraphs: [
          "Actual inflation varies, and different goods, services and household spending patterns need not change at the same rate. The calculator does not model a changing annual path, monthly periods or a personal consumption basket.",
          [
            { text: "Read " },
            { text: "why Inflation Calculator results are only projections", link: { kind: "article", slug: "inflation-calculator-projection-assumptions" } },
            { text: ", or test another assumption in the " },
            { text: "Inflation Calculator", link: { kind: "calculator", slug: "inflation" } },
            { text: "." },
          ],
        ],
      },
    ],
    faq: [
      { question: "Is future cost the same as future purchasing power?", answer: "No. Future cost estimates what a present cost may become. Purchasing power estimates what the same nominal amount may represent later." },
      { question: "Is 6% the current Indian inflation rate in this example?", answer: "No. It is an illustrative constant input chosen to explain the calculator. The example does not state a current CPI rate or forecast." },
      { question: "Does the calculator predict an exact future price?", answer: "No. It applies one entered assumption to create a scenario and does not predict a specific product or service price." },
    ],
  },
  {
    title: "How Inflation Changes Future Cost",
    slug: "inflation-future-cost",
    description: "How a current cost compounds under one assumed annual inflation rate, and why the result is not an investment future value or price forecast.",
    category: "personal-finance",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "inflation",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["inflation-explained", "purchasing-power-explained", "inflation-calculator-projection-assumptions"],
    sections: [
      {
        id: "answer",
        heading: "Future cost applies an inflation assumption to today's cost",
        paragraphs: [
          "A future-cost estimate shows how much more nominal money may be required if a current cost rises at the same entered inflation rate for every selected year. The estimate is about a cost, not the future value of an investment.",
          "The ArthaSiddhi engine compounds the current cost annually over a whole-year period. It does not add a fixed rupee increase or model different inflation rates in different years.",
        ],
      },
      {
        id: "inputs",
        heading: "Three inputs define the scenario",
        list: [
          "Current cost: the amount being expressed in today's rupees.",
          "Assumed annual inflation: one constant percentage used for illustration.",
          "Period: the number of whole years over which the assumption is applied.",
        ],
      },
      {
        id: "worked-example",
        heading: "Worked example: a ₹1,00,000 current cost",
        paragraphs: [
          "Using a current cost of ₹1,00,000, an illustrative 6% annual inflation assumption and 10 years, future-cost mode produces the following result:",
        ],
        table: {
          caption: "Engine-generated future-cost scenario",
          headers: ["Current cost", "Assumed annual inflation", "Period", "Estimated future cost", "Modeled increase"],
          rows: [["₹1,00,000.00", "6%", "10 years", "₹1,79,084.77", "₹79,084.77"]],
        },
      },
      {
        id: "interpretation",
        heading: "The increase comes from compounding the assumption",
        paragraphs: [
          "The estimated cost is ₹79,084.77 above the current amount because each modeled year's percentage change applies after the previous changes have accumulated. The calculation keeps the rate constant so the effect of the selected inputs can be compared consistently.",
          "This is not investment growth: there is no asset, contribution schedule or investment return in the inflation engine. A higher estimated future cost describes a price scenario, not money earned.",
        ],
      },
      {
        id: "not-specific-forecast",
        heading: "The result does not forecast a specific price",
        paragraphs: [
          "The ₹1,79,084.77 estimate does not predict the exact future price of a product, service, education course, medical expense, house or household basket. Those prices may follow different paths from the single rate entered here.",
          [
            { text: "The " },
            { text: "projection-assumptions guide", link: { kind: "article", slug: "inflation-calculator-projection-assumptions" } },
            { text: " explains why actual outcomes vary. To understand the inverse view, read " },
            { text: "Purchasing Power Explained", link: { kind: "article", slug: "purchasing-power-explained" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Model a future-cost scenario",
          text: [
            { text: "Enter a current cost, assumed rate and whole-year period in the " },
            { text: "Inflation Calculator", link: { kind: "calculator", slug: "inflation" } },
            { text: ", or return to " },
            { text: "Inflation Explained", link: { kind: "article", slug: "inflation-explained" } },
            { text: " for the broad overview." },
          ],
        },
      },
    ],
    faq: [
      { question: "Is future cost an investment future value?", answer: "No. Future cost models how a price may rise under an inflation assumption. It does not calculate an asset balance or investment return." },
      { question: "Does the estimate predict a specific product's price?", answer: "No. The calculator applies one generic constant rate and does not forecast a named product or service." },
      { question: "Why is the modeled increase not the same every year?", answer: "The percentage is applied to a base that includes earlier modeled price changes, so the rupee effect compounds over time." },
    ],
  },
  {
    title: "Purchasing Power Explained: What Inflation Does to Money",
    slug: "purchasing-power-explained",
    description: "Why the same nominal amount may represent less purchasing power later, without implying an investment loss or lower account balance.",
    category: "personal-finance",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "inflation",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 50,
    relatedCalculators: [],
    relatedArticles: ["inflation-explained", "inflation-future-cost", "inflation-calculator-projection-assumptions"],
    sections: [
      {
        id: "answer",
        heading: "Purchasing power describes what money can buy",
        paragraphs: [
          "Purchasing power is the value represented by an amount of money in terms of goods and services. When prices rise, the same nominal amount may cover less than it did before.",
          "The nominal ₹1,00,000 does not change merely because the calculator is switched to purchasing-power mode. The calculator estimates what that amount may represent later under the entered inflation assumption.",
        ],
      },
      {
        id: "worked-example",
        heading: "Worked example: the future purchasing power of ₹1,00,000",
        paragraphs: [
          "With ₹1,00,000, an illustrative constant inflation assumption of 6% and a 10-year period, purchasing-power mode returns:",
        ],
        table: {
          caption: "Engine-generated purchasing-power scenario",
          headers: ["Nominal amount", "Assumed annual inflation", "Period", "Estimated future purchasing power", "Estimated erosion"],
          rows: [["₹1,00,000.00", "6%", "10 years", "₹55,839.48", "₹44,160.52"]],
        },
      },
      {
        id: "nominal-vs-power",
        heading: "The nominal amount and its represented value are different concepts",
        paragraphs: [
          "The ₹55,839.48 result is not a future bank-account balance. It does not say that ₹44,160.52 physically disappears. It expresses the modeled erosion in what the original ₹1,00,000 may represent after 10 years.",
          "It is also not an investment loss or portfolio return. The engine receives no investment, market value, interest rate, contribution or fee information.",
        ],
      },
      {
        id: "inverse-view",
        heading: "Purchasing power is the inverse view of future cost",
        paragraphs: [
          "Future-cost mode increases a present cost by the compounded inflation factor. Purchasing-power mode divides the nominal amount by that same factor. This is why positive inflation moves the two displayed values in opposite directions.",
          [
            { text: "Compare that interpretation with " },
            { text: "How Inflation Changes Future Cost", link: { kind: "article", slug: "inflation-future-cost" } },
            { text: "." },
          ],
        ],
      },
      {
        id: "limitations",
        heading: "The represented value still depends on the assumption",
        paragraphs: [
          "Actual inflation varies, and a person's spending mix can differ from a general price index. The estimated purchasing power therefore remains a scenario based on one constant entered rate.",
          [
            { text: "Review the " },
            { text: "projection limitations", link: { kind: "article", slug: "inflation-calculator-projection-assumptions" } },
            { text: ", return to " },
            { text: "Inflation Explained", link: { kind: "article", slug: "inflation-explained" } },
            { text: ", or select Purchasing Power in the " },
            { text: "Inflation Calculator", link: { kind: "calculator", slug: "inflation" } },
            { text: "." },
          ],
        ],
      },
    ],
    faq: [
      { question: "Does ₹1,00,000 stop being ₹1,00,000?", answer: "No. The nominal amount remains ₹1,00,000. The estimate describes what that amount may represent in purchasing-power terms later." },
      { question: "Is purchasing-power erosion an investment loss?", answer: "No. The calculator does not model an investment or portfolio. It applies an inflation assumption to the represented value of money." },
      { question: "Why is purchasing power lower when future cost is higher?", answer: "Both use the same compounded assumption from opposite directions: future cost multiplies by the factor, while purchasing power divides by it." },
    ],
  },
  {
    title: "Why Inflation Calculator Results Are Only Projections",
    slug: "inflation-calculator-projection-assumptions",
    description: "Why one constant inflation assumption cannot predict every future price, household spending basket or year-by-year inflation path.",
    category: "personal-finance",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "inflation",
    calculatorGuideRole: "supporting",
    relatedCalculators: [],
    relatedArticles: ["inflation-explained", "inflation-future-cost", "purchasing-power-explained"],
    references: [
      { title: "Consumer Price Indices", publisher: "Ministry of Statistics and Programme Implementation", url: "https://cpi.mospi.gov.in/", sourceType: "official", accessedAt: "2026-08-20" },
      { title: "National Metadata Structure for Consumer Price Index", publisher: "Ministry of Statistics and Programme Implementation", url: "https://mospi.gov.in/sites/default/files/CPI/National_Metadata_Structure_for_CPI.pdf", sourceType: "official", accessedAt: "2026-08-20" },
    ],
    sections: [
      {
        id: "answer",
        heading: "The calculator standardizes a scenario rather than predicting inflation",
        paragraphs: [
          "The Inflation Calculator repeats one entered annual rate over a selected whole-year period. That makes different assumptions easy to compare, but it does not predict the actual inflation rate in each future year.",
          "The calculator does not connect to live CPI data, forecast a variable annual path or determine the future price of an individual item.",
        ],
      },
      {
        id: "constant-rate",
        heading: "Actual inflation need not follow one constant rate",
        paragraphs: [
          "Inflation can rise, fall or remain uneven across a period. The engine removes that variation and compounds the same entered percentage once per whole year.",
          "It does not accept monthly periods or negative inflation. A zero rate is supported and leaves both future cost and purchasing power unchanged.",
        ],
      },
      {
        id: "basket-differences",
        heading: "A general price index is not every household's price experience",
        paragraphs: [
          "Consumer price indices summarize price movement across a basket of goods and services using defined coverage and weights. An individual household may spend in different proportions, so its experienced price changes need not match a general index.",
          "Housing, medical care, education, food and other services also need not move at identical rates. A generic inflation input should not be presented as an exact forecast for any one category.",
        ],
      },
      {
        id: "sensitivity-example",
        heading: "One cost and period, three illustrative assumptions",
        paragraphs: [
          "Each future-cost row uses ₹1,00,000 and 10 years. Only the constant annual inflation input changes. The 5%, 6% and 7% rates are sensitivity assumptions—not current Indian CPI readings or forecasts.",
        ],
        table: {
          caption: "Engine-generated future-cost sensitivity scenarios",
          headers: ["Illustrative constant rate", "Current cost", "Period", "Estimated future cost", "Modeled increase"],
          rows: [
            ["5%", "₹1,00,000.00", "10 years", "₹1,62,889.46", "₹62,889.46"],
            ["6%", "₹1,00,000.00", "10 years", "₹1,79,084.77", "₹79,084.77"],
            ["7%", "₹1,00,000.00", "10 years", "₹1,96,715.14", "₹96,715.14"],
          ],
        },
      },
      {
        id: "rounding",
        heading: "Display rounding can create small presentation differences",
        paragraphs: [
          "The engine retains its full numerical precision, while displayed currency is rounded to two decimal places. Repeatedly calculating from rounded intermediate values can therefore differ slightly from the displayed final result.",
          "The larger difference between a scenario and an actual outcome usually comes from assumptions and real price paths, not from ordinary display rounding.",
        ],
      },
      {
        id: "use-results",
        heading: "Use multiple assumptions to understand the range",
        paragraphs: [
          "Changing only the inflation input shows how sensitive the estimate is to that assumption. It does not make the highest or lowest row a prediction.",
          [
            { text: "Use the " },
            { text: "Inflation Calculator", link: { kind: "calculator", slug: "inflation" } },
            { text: " to compare assumptions, return to " },
            { text: "Inflation Explained", link: { kind: "article", slug: "inflation-explained" } },
            { text: ", or review the separate explanations of " },
            { text: "future cost", link: { kind: "article", slug: "inflation-future-cost" } },
            { text: " and " },
            { text: "purchasing power", link: { kind: "article", slug: "purchasing-power-explained" } },
            { text: "." },
          ],
        ],
      },
    ],
    faq: [
      { question: "Does the Inflation Calculator use live CPI data?", answer: "No. It applies the rate entered by the user and does not retrieve live CPI observations." },
      { question: "Are 5%, 6% and 7% forecasts of Indian inflation?", answer: "No. They are illustrative constant-rate inputs used to show how the calculator result changes." },
      { question: "Why might my personal inflation experience differ from CPI?", answer: "A published index uses a defined basket and weights, while a household may buy different items in different proportions." },
    ],
  },
] satisfies readonly Article[];
