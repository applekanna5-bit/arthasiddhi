import type { Article } from "../types";

export const loanArticles = [
  {
    title: "Home Loan Guide for Beginners",
    slug: "home-loan-guide",
    description: "How home-loan EMIs, tenure and interest affect the total cost, with points to check before borrowing.",
    category: "loans",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "home-loan",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["compound-interest"],
    sections: [
      { id: "what-is-a-home-loan", heading: "What is a home loan?", paragraphs: ["A home loan is a secured loan used to buy, build, or improve a residential property. The property generally serves as security until the loan is repaid.", "Before applying, compare the total borrowing cost, not only the monthly EMI. The loan amount, interest rate, tenure, fees, and prepayment terms can all change the cost of ownership."] },
      { id: "understanding-emi", heading: "What your EMI includes", paragraphs: ["An EMI, or equated monthly instalment, is the regular payment made toward a loan. In a typical reducing-balance loan, each EMI includes both interest and principal.", "At the start of a long loan, the interest part is usually larger. As the outstanding balance falls, a larger share of later EMIs goes toward principal."] },
      { id: "what-affects-your-emi", heading: "What affects your EMI?", list: ["Loan amount: borrowing more generally raises the EMI and total interest.", "Interest rate: even small rate changes can matter over a long tenure.", "Tenure: a longer tenure can lower the monthly EMI but may increase total interest paid.", "Prepayments: reducing the outstanding principal early may reduce future interest, subject to your loan terms."] },
      { id: "tenure-trade-off", heading: "The tenure trade-off", paragraphs: ["Choosing the longest possible tenure may make the monthly payment feel easier, but it is not automatically the cheapest choice. Choose a repayment plan that leaves room for emergency savings and other essential goals.", "Compare a few tenures and rates. Look at both the EMI you would pay each month and the total interest over the full loan."], table: { caption: "How common home-loan choices can affect your plan", headers: ["Choice", "Possible effect", "Question to consider"], rows: [["Higher down payment", "Lower amount borrowed", "Will emergency savings remain adequate?"], ["Longer tenure", "Lower EMI, potentially more total interest", "Is the monthly relief worth the extra interest?"], ["Part-prepayment", "May reduce outstanding principal", "Are there conditions or charges in your agreement?"]] } },
      { id: "before-you-borrow", heading: "Before you borrow", paragraphs: ["Read the lender’s current terms carefully and ask how interest-rate changes, processing charges, insurance, and prepayment are handled. Your eligibility and final rate depend on the lender’s assessment; this guide is educational, not a loan recommendation."], callout: { title: "Useful next step", text: [{ text: "Try different loan amounts, rates, and tenures with the " }, { text: "Home Loan EMI Calculator", link: { kind: "calculator", slug: "home-loan" } }, { text: " to see how the monthly payment and total interest change." }] } },
    ],
    faq: [
      { question: "Does a lower EMI always mean a better home loan?", answer: "Not necessarily. A lower EMI can come from a longer tenure, which may increase the total interest paid. Compare both affordability and total repayment." },
      { question: "Can I pay a home loan early?", answer: "Many loans allow part-prepayment or foreclosure, but the terms and any charges depend on the loan agreement and applicable rules. Check with the lender before deciding." },
    ],
  },
] satisfies readonly Article[];
