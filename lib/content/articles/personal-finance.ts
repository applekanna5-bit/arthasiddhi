import type { Article } from "../types";

export const personalFinanceArticles = [
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
] satisfies readonly Article[];
