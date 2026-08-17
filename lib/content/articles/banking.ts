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
    relatedArticles: ["compound-interest"],
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
    ],
    faq: [
      { question: "Is the interest rate the same for every fixed deposit?", answer: "No. FD rates and terms can differ across institutions, tenures and deposit products. Check the current rate for the specific deposit you are comparing." },
      { question: "Can I withdraw an FD before maturity?", answer: "Premature withdrawal availability and terms vary by product. If it is allowed, any reduction or penalty depends on the deposit terms." },
    ],
  },
] satisfies readonly Article[];
