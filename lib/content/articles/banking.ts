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
] satisfies readonly Article[];
