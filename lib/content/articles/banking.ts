import type { Article } from "../types";

export const bankingArticles = [
  {
    title: "Fixed Deposit Explained",
    slug: "fixed-deposit-explained",
    description: "How principal, rate, tenure and compounding determine an FD’s maturity amount, with terms to compare before opening one.",
    category: "banking",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-17",
    readingTime: "5 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "fd",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["fd-interest-calculation", "fd-vs-rd", "premature-fd-withdrawal", "compound-interest"],
    sections: [
      {
        id: "maturity-factors",
        heading: "What determines your maturity amount",
        paragraphs: [
          "The interest rate is not the only number that decides an FD’s maturity amount. The principal, tenure and compounding frequency matter too, along with whether interest stays in the deposit or is paid out.",
          "Read the product terms with the quoted rate. Two deposits showing the same annual rate need not produce the same maturity amount if their compounding or payout treatment differs.",
        ],
      },
      {
        id: "worked-comparison",
        heading: "A simple FD maturity comparison",
        paragraphs: [
          "Take a principal of ₹1,00,000, an annual rate of 7% and a tenure of three years. The 7% rate is an illustrative input, not a current bank quote. Using the ArthaSiddhi FD Calculator’s compounding convention, the results are:",
        ],
        table: {
          caption: "₹1 lakh FD at an illustrative 7% annual rate for three years",
          headers: ["Compounding frequency", "Interest earned", "Maturity amount"],
          rows: [
            ["Yearly", "₹22,504", "₹1,22,504"],
            ["Quarterly", "₹23,144", "₹1,23,144"],
          ],
        },
      },
      {
        id: "compounding-frequency",
        heading: "Why compounding frequency changes the result",
        paragraphs: [
          "In this comparison, quarterly compounding adds interest to the balance more often. Interest added earlier can itself earn interest during later periods, so the quarterly maturity amount is ₹640 higher.",
          [
            { text: "This interest-on-interest effect is explained further in the " },
            { text: "compound interest guide", link: { kind: "article", slug: "compound-interest" } },
            { text: ". Actual contractual maturity values follow the bank’s product terms and calculation method." },
          ],
        ],
      },
      {
        id: "cumulative-or-payout",
        heading: "Cumulative FD or periodic payout?",
        paragraphs: [
          "With cumulative treatment, interest remains with the deposit and is added to the balance according to the product’s compounding terms. The maturity amount includes the principal and accumulated interest.",
          "A payout option distributes interest instead. The available payout schedules and calculation terms vary by product, so compare the cash flow as well as the quoted annual rate.",
        ],
      },
      {
        id: "terms-to-compare",
        heading: "Terms to compare before opening the deposit",
        list: [
          "Tenure and contractual maturity date.",
          "Cumulative or payout treatment, including the available payout schedule.",
          "Compounding convention and the maturity amount shown in the product terms.",
          "Premature-withdrawal conditions and any applicable reduction or penalty.",
        ],
      },
      {
        id: "compare-maturity",
        heading: "Compare maturity, not rate alone",
        paragraphs: [
          "Try the same principal, rate and tenure with a different compounding frequency. The change in maturity amount shows why the headline rate needs to be read with the deposit terms.",
        ],
        callout: {
          title: "Compare the maturity amounts",
          text: [
            { text: "Use the " },
            { text: "FD Calculator", link: { kind: "calculator", slug: "fd" } },
            { text: " to change one input at a time." },
          ],
        },
      },
      {
        id: "explore-specific-questions",
        heading: "Explore one FD question at a time",
        paragraphs: [
          [
            { text: "For the formula and periodic-rate mechanics, read " },
            { text: "how FD interest is calculated", link: { kind: "article", slug: "fd-interest-calculation" } },
            { text: "." },
          ],
          [
            { text: "To compare money deposited upfront with the same total deposited monthly, see the controlled " },
            { text: "FD and RD timing comparison", link: { kind: "article", slug: "fd-vs-rd" } },
            { text: "." },
          ],
          [
            { text: "If the deposit may be closed before maturity, review " },
            { text: "what premature withdrawal can change", link: { kind: "article", slug: "premature-fd-withdrawal" } },
            { text: " before relying on the original maturity amount." },
          ],
        ],
      },
    ],
    faq: [
      { question: "Is the interest rate the same for every fixed deposit?", answer: "No. FD rates and terms can differ across institutions, tenures and deposit products. Check the current rate for the specific deposit you are comparing." },
      { question: "Can I withdraw an FD before maturity?", answer: "Premature withdrawal availability and terms vary by product. If it is allowed, any reduction or penalty depends on the deposit terms." },
    ],
  },
  {
    title: "How FD Interest Is Calculated: Rate, Tenure and Compounding",
    slug: "fd-interest-calculation",
    description: "How principal, rate, tenure and compounding periods produce an FD's interest earned and maturity amount.",
    category: "banking",
    publishedAt: "2026-08-18",
    updatedAt: "2026-08-18",
    readingTime: "8 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "fd",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["fixed-deposit-explained", "premature-fd-withdrawal"],
    sections: [
      {
        id: "calculation-parts",
        heading: "An FD calculation connects four inputs",
        paragraphs: [
          "An FD maturity calculation starts with the principal, applies an annual rate according to the selected compounding frequency and repeats that process over the tenure. Interest earned is the maturity amount minus the original principal.",
          "The calculation explains a contracted growth scenario. It does not select a deposit, compare institutions or supply a current bank rate.",
        ],
      },
      {
        id: "formula",
        heading: "The maturity formula and its terms",
        paragraphs: [
          "For the convention used here, maturity amount A = P × (1 + r ÷ n)^(n × t). P is principal, r is the annual rate written as a decimal, n is the number of compounding periods per year, and t is the tenure in years.",
          "The interest earned is A minus P. The formula applies the same stated rate and frequency throughout the entered tenure; actual contractual values follow the institution's product terms and calculation method.",
        ],
      },
      {
        id: "periodic-rate",
        heading: "How the annual rate becomes a periodic rate",
        paragraphs: [
          "The annual rate is divided by the number of compounding periods. A 7% annual rate becomes 7% for yearly compounding, 3.5% for each half-year, 1.75% for each quarter or about 0.5833% for each month under this convention.",
          "The number of periods changes with both frequency and tenure. Over three years there are 3 yearly, 6 half-yearly, 12 quarterly or 36 monthly compounding periods.",
        ],
      },
      {
        id: "worked-example",
        heading: "Worked example: ₹2 lakh for three years",
        paragraphs: [
          "Take a principal of ₹2,00,000, an illustrative annual rate of 7% and a three-year tenure. The rate is used only to explain the calculation and is not a current bank offer. Keeping principal, rate and tenure unchanged gives these results under the FD Calculator's supported conventions:",
        ],
        table: {
          caption: "₹2 lakh FD at an illustrative 7% annual rate for three years",
          headers: ["Compounding frequency", "Periods over 3 years", "Principal", "Interest earned", "Maturity amount"],
          rows: [
            ["Yearly", "3", "₹2,00,000", "₹45,009", "₹2,45,009"],
            ["Half-yearly", "6", "₹2,00,000", "₹45,851", "₹2,45,851"],
            ["Quarterly", "12", "₹2,00,000", "₹46,288", "₹2,46,288"],
            ["Monthly", "36", "₹2,00,000", "₹46,585", "₹2,46,585"],
          ],
        },
      },
      {
        id: "read-comparison",
        heading: "What the comparison shows",
        paragraphs: [
          "More frequent compounding adds calculated interest to the balance more often. That allows earlier interest additions to take part in later periods, so the displayed maturity amount rises across this controlled example.",
          "The principal remains ₹2,00,000 in every row. Only the periodic convention changes, which means the difference appears in interest earned and therefore in maturity amount.",
          [
            { text: "For the beginner overview of deposits and their terms, return to " },
            { text: "Fixed Deposit Explained", link: { kind: "article", slug: "fixed-deposit-explained" } },
            { text: ". If a deposit is closed early, the " },
            { text: "original maturity may no longer apply", link: { kind: "article", slug: "premature-fd-withdrawal" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Compare the supported conventions",
          text: [
            { text: "Enter the principal, stated rate, tenure and contractual compounding frequency in the " },
            { text: "FD maturity tool", link: { kind: "calculator", slug: "fd" } },
            { text: "." },
          ],
        },
      },
    ],
    faq: [
      { question: "Is FD interest earned the same as the maturity amount?", answer: "No. Interest earned is the calculated increase over principal. The maturity amount is principal plus that interest under the stated assumptions." },
      { question: "Why does compounding frequency change FD maturity?", answer: "More frequent compounding adds calculated interest to the balance at shorter intervals, allowing those additions to participate in later periods." },
      { question: "Does a 7% example represent a current FD offer?", answer: "No. It is an illustrative input used to explain the calculation. Check the rate and terms for the specific deposit being considered." },
    ],
  },
  {
    title: "FD vs RD: How Deposit Timing Changes the Maturity Value",
    slug: "fd-vs-rd",
    description: "A controlled comparison of one upfront FD deposit and equal total capital deposited monthly through an RD.",
    category: "banking",
    publishedAt: "2026-08-18",
    updatedAt: "2026-08-18",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "fd",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 50,
    relatedCalculators: ["rd"],
    relatedArticles: ["fixed-deposit-explained", "fd-interest-calculation"],
    sections: [
      {
        id: "timing-answer",
        heading: "Equal capital does not mean equal time invested",
        paragraphs: [
          "An FD places one amount into the calculation at the start. An RD adds money month by month. Even when total deposits, duration and entered annual rate are the same, each rupee does not remain in the model for the same length of time.",
          "The comparison below demonstrates the behaviour of the two ArthaSiddhi calculators under their supported conventions. It does not establish that either deposit is universally better.",
        ],
      },
      {
        id: "controlled-assumptions",
        heading: "What this comparison holds constant",
        list: [
          "Total deposited: ₹1,20,000 in each case.",
          "Entered annual rate: an illustrative 7%, not a current bank offer.",
          "Duration: one year.",
          "FD cash flow: ₹1,20,000 deposited at the start.",
          "RD cash flow: ₹10,000 deposited at the beginning of each month for 12 months.",
          "Fees, penalties, missed deposits and taxes: excluded.",
        ],
      },
      {
        id: "engine-conventions",
        heading: "The calculators use different supported conventions",
        paragraphs: [
          "The FD row uses quarterly compounding. The RD row uses the RD engine's beginning-of-month contribution convention and a monthly rate derived from the entered annual percentage.",
          "Those conventions reflect the current calculators. The table therefore compares calculator behaviour and cash-flow timing; it is not a claim that every bank uses identical contractual methods.",
        ],
      },
      {
        id: "worked-comparison",
        heading: "Worked comparison: ₹1.2 lakh deposited in two patterns",
        table: {
          caption: "Equal total deposits over one year at an illustrative 7% annual rate",
          headers: ["Deposit pattern", "Timing", "Total deposited", "Interest earned", "Maturity amount"],
          rows: [
            ["FD", "₹1,20,000 at the start; quarterly compounding", "₹1,20,000", "₹8,623", "₹1,28,623"],
            ["RD", "₹10,000 at the beginning of each month", "₹1,20,000", "₹4,649", "₹1,24,649"],
          ],
        },
      },
      {
        id: "interpret-difference",
        heading: "Why the displayed interest differs",
        paragraphs: [
          "The FD starts with the full ₹1,20,000 in the model. The RD reaches the same total only after 12 monthly deposits, so later deposits receive fewer monthly growth periods.",
          "The numerical difference should not be labelled simply as extra return. It combines different deposit timing with the calculators' respective compounding conventions.",
          [
            { text: "Read " },
            { text: "the FD calculation mechanics", link: { kind: "article", slug: "fd-interest-calculation" } },
            { text: " for the quarterly formula, or return to " },
            { text: "Fixed Deposit Explained", link: { kind: "article", slug: "fixed-deposit-explained" } },
            { text: " for the core deposit overview." },
          ],
        ],
        callout: {
          title: "Model each cash-flow pattern",
          text: [
            { text: "Use the " },
            { text: "FD tool", link: { kind: "calculator", slug: "fd" } },
            { text: " for one upfront amount and the " },
            { text: "RD tool", link: { kind: "calculator", slug: "rd" } },
            { text: " for monthly deposits." },
          ],
        },
      },
    ],
    faq: [
      { question: "Is an FD always better than an RD when the total deposit is equal?", answer: "No. The example isolates two calculator cash-flow patterns. Actual suitability, product terms, available capital and deposit timing are outside the calculation." },
      { question: "Why does the RD have less time to earn interest?", answer: "Its capital enters month by month. A deposit made near the end has fewer modelled growth periods than money placed at the start." },
      { question: "Do all banks calculate FD and RD maturity exactly this way?", answer: "Not necessarily. Actual maturity follows the institution's product terms, deposit dates, calculation method and rounding." },
    ],
  },
  {
    title: "What Premature FD Withdrawal Can Change",
    slug: "premature-fd-withdrawal",
    description: "Why closing an FD early can change the applicable rate, interest and proceeds compared with the original maturity estimate.",
    category: "banking",
    publishedAt: "2026-08-18",
    updatedAt: "2026-08-18",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "fd",
    calculatorGuideRole: "supporting",
    relatedCalculators: [],
    relatedArticles: ["fixed-deposit-explained", "fd-interest-calculation"],
    sections: [
      {
        id: "original-vs-early",
        heading: "Closing early changes the scenario being calculated",
        paragraphs: [
          "An original FD maturity estimate assumes the principal remains deposited for the full entered tenure at the stated rate and compounding frequency. Closing the deposit after 18 months instead of three years breaks that original set of assumptions.",
          "The amount paid on premature closure depends on the institution's terms. The rate applicable to the completed tenure, any permitted reduction or penalty, prior interest payments and the final closure calculation can all matter.",
        ],
      },
      {
        id: "original-example",
        heading: "Original example: ₹2 lakh contracted for three years",
        paragraphs: [
          "Suppose ₹2,00,000 is entered at an illustrative contracted rate of 7% for three years with quarterly compounding. The rate is not a current bank offer. Under the FD Calculator's original full-tenure convention, the result is:",
        ],
        table: {
          caption: "Original three-year scenario before considering early closure",
          headers: ["Principal", "Original tenure", "Compounding", "Original interest estimate", "Original maturity estimate"],
          rows: [["₹2,00,000", "3 years", "Quarterly", "₹46,288", "₹2,46,288"]],
        },
      },
      {
        id: "known-must-check",
        heading: "Known from the original scenario—and what must be checked",
        table: {
          caption: "Hypothetical request to close the deposit after 18 months",
          headers: ["Known", "Must check with the institution"],
          rows: [
            ["Original principal: ₹2,00,000", "Rate applicable to the completed 18-month tenure"],
            ["Original assumptions: 7%, 3 years, quarterly", "Any premature-withdrawal reduction or penalty under the product terms"],
            ["Original maturity estimate: ₹2,46,288", "Exact closure date and interest treatment up to that date"],
            ["Requested closure point: 18 months", "Any interest already paid and the institution's final calculation and rounding"],
          ],
        },
      },
      {
        id: "not-withdrawal-result",
        heading: "The original estimate is not the withdrawal proceeds",
        paragraphs: [
          "The ₹2,46,288 figure is the original three-year maturity estimate. It is not an 18-month withdrawal amount and should not be reduced by an assumed universal percentage.",
          "The current FD Calculator does not calculate premature-withdrawal proceeds. It does not model a completed-tenure rate, institution-specific reduction, closure-specific rounding or interest already paid.",
        ],
      },
      {
        id: "documents-to-check",
        heading: "What to check before requesting closure",
        list: [
          "Deposit receipt or advice showing principal, start date, maturity date and contracted terms.",
          "Premature-closure terms for the specific deposit and institution.",
          "The rate the institution says applies to the completed tenure.",
          "Any reduction, penalty or adjustment permitted by those terms.",
          "A final closure statement showing the institution's calculation.",
        ],
        paragraphs: [
          [
            { text: "The " },
            { text: "FD calculation guide", link: { kind: "article", slug: "fd-interest-calculation" } },
            { text: " explains the original full-tenure mechanics. For the broader product overview, see " },
            { text: "Fixed Deposit Explained", link: { kind: "article", slug: "fixed-deposit-explained" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Review the original schedule only",
          text: [
            { text: "Use the " },
            { text: "FD maturity tool", link: { kind: "calculator", slug: "fd" } },
            { text: " for the original principal, rate, tenure and compounding scenario—not for premature-withdrawal proceeds." },
          ],
        },
      },
    ],
    faq: [
      { question: "Can I subtract a standard penalty from the original maturity amount?", answer: "No universal adjustment applies to every deposit. The completed-tenure rate and any reduction or penalty depend on the institution's terms and final calculation." },
      { question: "Does the FD Calculator show the amount payable after 18 months?", answer: "No. It shows the full entered scenario. It does not calculate premature-withdrawal proceeds or institution-specific closure treatment." },
      { question: "Why might the rate used at closure differ from the original rate?", answer: "The institution may apply terms linked to the period the deposit actually remained open. Check the specific deposit terms and final closure statement." },
    ],
  },
  {
    title: "PPF Explained: Contributions, Interest, Tenure and Maturity",
    slug: "ppf-explained",
    description: "How PPF contributions, notified rates, deposit timing and the statutory maturity framework relate to an illustrative calculator projection.",
    category: "banking",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    readingTime: "8 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: "ppf-scheme-2019-amended-2020" },
    primaryCalculator: "ppf",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["ppf-interest-calculation", "ppf-tenure-extension", "ppf-calculator-projection-vs-actual-maturity"],
    sections: [
      {
        id: "structure",
        heading: "PPF is a Government savings scheme with defined account rules",
        paragraphs: [
          "The Public Provident Fund is governed by the Public Provident Fund Scheme, 2019 under the Government Savings Promotion framework. Its contribution limits, interest treatment, maturity and continuation options come from the applicable scheme and Government notifications, rather than from the calculator.",
          "The ArthaSiddhi PPF Calculator is an educational projection tool. It applies the contribution, assumed rate and whole-year tenure entered by the user; it does not decide whether an account action complies with the scheme.",
        ],
      },
      {
        id: "contributions",
        heading: "Annual contributions have a verified minimum and maximum",
        paragraphs: [
          "Under the verified scheme, a deposit of at least ₹500 and no more than ₹1,50,000 may be made in an account in a financial year, in multiples of ₹50. The ₹1,50,000 individual limit includes deposits in the person's own account and an account opened on behalf of a minor.",
          "Subject to those limits, deposits may be made in one lump sum or in instalments. The calculator simplifies that flexibility into one fixed annual contribution made at the beginning of every modeled year.",
        ],
      },
      {
        id: "interest",
        heading: "The notified rate and deposit dates both matter",
        paragraphs: [
          "PPF interest is governed by the rate applicable to the scheme, and Government-notified rates can change. The calculator does not retrieve notifications or build a rate history; it repeats the single assumed annual rate entered by the user across the full projection.",
          "Actual scheme interest eligibility uses the lowest balance at credit between the close of the fifth day and the end of each month. Interest is credited at the end of the year. This monthly eligible-balance rule is different from the calculator's one-contribution-at-the-beginning-of-each-year convention.",
          [
            { text: "Read " },
            { text: "how PPF interest and contribution timing are separated", link: { kind: "article", slug: "ppf-interest-calculation" } },
            { text: " for the calculation mechanics." },
          ],
        ],
      },
      {
        id: "maturity",
        heading: "Maturity is measured from the end of the opening financial year",
        paragraphs: [
          "The scheme permits closure after the expiry of 15 years from the end of the financial year in which the account was opened. That wording matters: it is not simply a generic 15-year period counted from any date entered into a calculator.",
          "After maturity, the scheme provides for retaining the account without further deposits or extending it with deposits in five-year blocks, subject to the applicable conditions and option timing.",
          [
            { text: "The " },
            { text: "tenure and extension guide", link: { kind: "article", slug: "ppf-tenure-extension" } },
            { text: " explains those choices without treating a calculator tenure as an extension election." },
          ],
        ],
      },
      {
        id: "worked-example",
        heading: "Illustrative projection: ₹1,50,000 a year for 15 years",
        paragraphs: [
          "Suppose the calculator receives an annual contribution of ₹1,50,000, an assumed annual rate of 7.1% and a 15-year tenure. It adds the contribution at the beginning of each modeled year and applies the same rate annually.",
        ],
        table: {
          caption: "Constant-rate PPF calculator projection at an illustrative 7.1% annual rate",
          headers: ["Annual contribution", "Modeled tenure", "Total contribution", "Estimated interest", "Estimated maturity"],
          rows: [["₹1,50,000", "15 years", "₹22,50,000", "₹18,18,209", "₹40,68,209"]],
        },
      },
      {
        id: "interpretation",
        heading: "Read the result as a scenario, not a promised account value",
        paragraphs: [
          "The ₹22,50,000 contribution total follows from 15 equal annual additions. The estimated interest and maturity depend on the calculator's beginning-of-year timing and illustrative constant rate.",
          "The 7.1% input is not a claim that the same rate will apply for 15 years. Actual notified rates can change, actual deposit dates affect eligible balances, and account events are outside this projection. The ₹40,68,209 figure is therefore illustrative, not a guaranteed maturity value.",
          [
            { text: "See " },
            { text: "why the projection and eventual account value can differ", link: { kind: "article", slug: "ppf-calculator-projection-vs-actual-maturity" } },
            { text: ", or change one assumption in the " },
            { text: "PPF Calculator", link: { kind: "calculator", slug: "ppf" } },
            { text: "." },
          ],
        ],
      },
    ],
    faq: [
      { question: "Does the PPF Calculator apply the Government rate automatically?", answer: "No. The rate is editable and the calculator repeats the entered rate throughout the projection. Check the applicable Government notification for an actual account period." },
      { question: "Does every PPF deposit earn a full year of interest?", answer: "Not necessarily. Actual interest eligibility depends on the scheme's monthly eligible-balance rule and the deposit date. The calculator instead models one beginning-of-year annual contribution." },
      { question: "Is the displayed maturity amount guaranteed?", answer: "No. It is an illustrative constant-rate projection under the calculator's timing convention, not a guaranteed statutory account outcome." },
    ],
  },
  {
    title: "How PPF Interest Is Calculated: Contribution Timing, Rate and Maturity",
    slug: "ppf-interest-calculation",
    description: "The PPF calculator's annual projection mechanics, and how its simplified timing differs from actual scheme interest eligibility and crediting.",
    category: "banking",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    readingTime: "8 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: "ppf-scheme-2019-amended-2020" },
    primaryCalculator: "ppf",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["ppf-explained", "ppf-calculator-projection-vs-actual-maturity"],
    sections: [
      {
        id: "two-methods",
        heading: "Keep the projection method and scheme accounting separate",
        paragraphs: [
          "The ArthaSiddhi calculator produces a smooth annual projection. An actual PPF account follows scheme rules, actual deposit dates and the rates applicable over time. The two share concepts such as contributions and interest, but they are not the same accounting process.",
        ],
      },
      {
        id: "calculator-method",
        heading: "How the ArthaSiddhi projection builds each year",
        list: [
          "Start with the previous modeled closing balance.",
          "Add one fixed annual contribution at the beginning of the modeled year.",
          "Apply the same entered annual rate to that combined amount.",
          "Add the modeled interest to produce the closing balance.",
          "Repeat for the selected whole-year tenure.",
        ],
        paragraphs: [
          "The engine does not model monthly deposits, intra-year balance changes or a history of variable notified rates. Its schedule labels each row as opening balance, contribution, interest and closing balance so those assumptions remain visible.",
        ],
      },
      {
        id: "schedule-example",
        heading: "First two years of the controlled projection",
        paragraphs: [
          "For ₹1,50,000 contributed annually, a 7.1% illustrative constant rate and 15 modeled years, the first contribution is added before the first year's interest. The first year's modeled interest is ₹10,650, producing a ₹1,60,650 closing balance.",
        ],
        table: {
          caption: "Selected rows generated by the PPF calculator engine",
          headers: ["Year", "Opening balance", "Contribution", "Estimated interest", "Closing balance"],
          rows: [
            ["1", "₹0", "₹1,50,000", "₹10,650", "₹1,60,650"],
            ["2", "₹1,60,650", "₹1,50,000", "₹22,056", "₹3,32,706"],
          ],
        },
      },
      {
        id: "actual-scheme-method",
        heading: "Actual PPF interest eligibility depends on monthly balances",
        paragraphs: [
          "Under the verified PPF Scheme, the lowest balance at credit between the close of the fifth day and the end of each month is eligible for interest. Interest is credited to the account at the end of the year.",
          "A deposit's date can therefore affect actual interest eligibility. The annual calculator schedule does not reproduce this monthly balance selection and should not be used to infer that every actual annual contribution receives a full year's interest.",
        ],
      },
      {
        id: "rate-treatment",
        heading: "One entered rate is an assumption, not a rate history",
        paragraphs: [
          "Government-notified PPF rates can change. The calculator has one editable rate field and applies that percentage across every modeled year. It does not dynamically consume rate notifications or apply different rates to different periods.",
          [
            { text: "For the broader scheme context, return to " },
            { text: "PPF Explained", link: { kind: "article", slug: "ppf-explained" } },
            { text: ". For the practical consequence of these assumptions, read " },
            { text: "why a projection may differ from actual maturity", link: { kind: "article", slug: "ppf-calculator-projection-vs-actual-maturity" } },
            { text: "." },
          ],
        ],
        callout: {
          title: "Inspect the annual schedule",
          text: [
            { text: "Change the contribution, assumed rate or tenure in the " },
            { text: "PPF Calculator", link: { kind: "calculator", slug: "ppf" } },
            { text: " and read each row under the calculator's annual convention." },
          ],
        },
      },
    ],
    faq: [
      { question: "Does the calculator calculate interest month by month?", answer: "No. It makes one beginning-of-year contribution and one annual interest addition for each modeled year." },
      { question: "Why does the actual deposit date matter?", answer: "The scheme determines monthly interest eligibility from the lowest balance between the close of the fifth day and month-end, so deposit timing can affect the eligible balance." },
      { question: "Can the entered rate change automatically during the projection?", answer: "No. The same editable rate is applied throughout. Actual Government-notified rates can change over time." },
    ],
  },
  {
    title: "PPF Tenure and Extension Explained",
    slug: "ppf-tenure-extension",
    description: "How the PPF maturity period is defined and how continuation without deposits or extension with deposits works after maturity.",
    category: "banking",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    readingTime: "7 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: "ppf-scheme-2019-amended-2020" },
    primaryCalculator: "ppf",
    calculatorGuideRole: "supporting",
    relatedCalculators: [],
    relatedArticles: ["ppf-explained", "ppf-interest-calculation"],
    sections: [
      {
        id: "maturity-definition",
        heading: "The maturity clock starts from the end of the opening financial year",
        paragraphs: [
          "The PPF Scheme allows closure after the expiry of 15 years from the end of the financial year in which the account was opened. An account opening date and a generic 15-year calculator input therefore answer different questions.",
          "The calculator accepts a whole number of years to build a mathematical projection. It does not calculate a statutory maturity date from an opening date or determine whether an account has matured.",
        ],
      },
      {
        id: "without-deposits",
        heading: "An account may continue after maturity without further deposits",
        paragraphs: [
          "The verified scheme allows an account holder to retain the account after maturity without making further deposits. The balance continues to earn interest at the rate applicable to the scheme, subject to the operative rules.",
          "Once the account has continued without deposits for more than a year, the scheme says the holder cannot later switch back to continuation with deposits. This is an account-rule decision, not a calculator setting.",
        ],
      },
      {
        id: "with-deposits",
        heading: "Extension with deposits uses five-year blocks",
        paragraphs: [
          "After the initial maturity period, the scheme permits extension with deposits for a further block of five years. The account holder must exercise the option through the prescribed process before one year expires from maturity.",
          "The five-year framework can apply again after an extended block, subject to the scheme. Current forms and account-office instructions should be checked when an actual election is made.",
        ],
      },
      {
        id: "calculator-boundary",
        heading: "A 20-year projection is not an extension election",
        paragraphs: [
          "Entering 20 years in the PPF Calculator merely asks the engine to repeat its fixed annual contribution and constant-rate convention for 20 modeled years. It does not verify maturity, submission of the prescribed option, the one-year deadline or the status of an actual account.",
          [
            { text: "Use the " },
            { text: "PPF Calculator", link: { kind: "calculator", slug: "ppf" } },
            { text: " only for numerical scenarios. Return to " },
            { text: "PPF Explained", link: { kind: "article", slug: "ppf-explained" } },
            { text: " for the broad scheme overview, or read the " },
            { text: "interest calculation guide", link: { kind: "article", slug: "ppf-interest-calculation" } },
            { text: " for the engine's timing convention." },
          ],
        ],
      },
    ],
    faq: [
      { question: "Is PPF maturity exactly 15 years from the opening date?", answer: "The scheme frames closure after 15 years from the end of the financial year in which the account was opened, so an exact maturity date should be checked from the account records and applicable rules." },
      { question: "Can PPF continue without further deposits after maturity?", answer: "Yes, the verified scheme provides for retention without further deposits, with the balance continuing to earn the rate applicable to the scheme." },
      { question: "Does selecting 20 years in the calculator complete a PPF extension?", answer: "No. It creates a mathematical projection only. It does not submit or validate the prescribed extension option for an actual account." },
    ],
  },
  {
    title: "Why a PPF Calculator Projection May Differ From Actual Maturity",
    slug: "ppf-calculator-projection-vs-actual-maturity",
    description: "Why constant-rate assumptions, annual modeled contributions and actual PPF account timing can produce different maturity values.",
    category: "banking",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    readingTime: "7 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: "ppf-scheme-2019-amended-2020" },
    primaryCalculator: "ppf",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 50,
    relatedCalculators: [],
    relatedArticles: ["ppf-explained", "ppf-interest-calculation"],
    sections: [
      {
        id: "answer",
        heading: "A projection standardizes assumptions; the account follows actual events",
        paragraphs: [
          "A PPF calculator projection may differ from eventual account maturity because the calculator applies one constant assumed rate to one beginning-of-year contribution in every modeled year. An actual account follows notified rates, deposit dates and applicable scheme processing over time.",
          "A difference does not by itself mean the calculator made an arithmetic error. It can mean that the projection assumptions and the account's actual history were different.",
        ],
      },
      {
        id: "rate-difference",
        heading: "Notified rates can change while the calculator rate stays constant",
        paragraphs: [
          "The calculator repeats the rate entered by the user for the full tenure. It does not retrieve Government notifications or reproduce historical and future rate changes.",
          "An actual account receives the treatment applicable under the scheme for the relevant periods. A 15-year projection at 7.1% is therefore an illustrative constant-rate scenario, not a promise that 7.1% will apply for 15 years.",
        ],
      },
      {
        id: "timing-difference",
        heading: "Actual deposit dates can change the eligible balance",
        paragraphs: [
          "The projection adds the full annual contribution at the beginning of each modeled year. Actual deposits may be made in a lump sum or instalments, and the verified scheme uses the lowest balance between the close of the fifth day and month-end for monthly interest eligibility.",
          "Interest is credited at the end of the year. The calculator does not model those monthly eligible balances, intra-year deposits or account-office entries.",
        ],
      },
      {
        id: "sensitivity-example",
        heading: "One contribution schedule, three illustrative constant rates",
        paragraphs: [
          "Each row below uses ₹1,00,000 at the beginning of every modeled year for 15 years. Only the assumed rate changes. The rates are sensitivity inputs, not forecasts of future PPF rates.",
        ],
        table: {
          caption: "PPF calculator sensitivity with total contributions fixed at ₹15,00,000",
          headers: ["Illustrative constant rate", "Total contribution", "Estimated interest", "Estimated maturity"],
          rows: [
            ["6%", "₹15,00,000", "₹9,67,253", "₹24,67,253"],
            ["7%", "₹15,00,000", "₹11,88,805", "₹26,88,805"],
            ["8%", "₹15,00,000", "₹14,32,428", "₹29,32,428"],
          ],
        },
      },
      {
        id: "other-differences",
        heading: "Account events and processing are outside the projection",
        paragraphs: [
          "Changes to contribution amounts or dates, continuation after maturity and other account events can alter the real history. The calculator does not determine extension, withdrawal, loan, premature-closure or tax treatment.",
          "Displayed rupee values are rounded to whole rupees while the engine retains unrounded values. Official account records and the account office's processing under the applicable rules determine the statutory account outcome.",
          [
            { text: "Review the calculation convention in " },
            { text: "How PPF Interest Is Calculated", link: { kind: "article", slug: "ppf-interest-calculation" } },
            { text: ", return to " },
            { text: "PPF Explained", link: { kind: "article", slug: "ppf-explained" } },
            { text: ", or test another assumption in the " },
            { text: "PPF Calculator", link: { kind: "calculator", slug: "ppf" } },
            { text: "." },
          ],
        ],
      },
    ],
    faq: [
      { question: "Why can the calculator and passbook show different values?", answer: "The calculator uses a constant rate and one annual timing convention. The account follows actual notified rates, deposit dates, eligible monthly balances and applicable processing." },
      { question: "Are the 6%, 7% and 8% examples forecasts?", answer: "No. They are illustrative constant-rate inputs used only to show the model's sensitivity to the entered rate." },
      { question: "Does a different actual value mean the calculator is wrong?", answer: "Not necessarily. A projection and an account history can use different rates, dates and events. Compare the assumptions before comparing the values." },
    ],
  },
] satisfies readonly Article[];
