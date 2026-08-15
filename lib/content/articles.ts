import type { Article, ContentCategory } from "./types";

export const categoryLabels: Record<ContentCategory, string> = {
  "personal-finance": "Personal Finance",
  loans: "Loans",
  investments: "Investments",
  banking: "Banking",
  tax: "Tax",
  insurance: "Insurance",
  retirement: "Retirement",
  "real-estate": "Real Estate",
};

export const categoryDescriptions: Record<ContentCategory, string> = {
  "personal-finance": "Build practical habits for everyday money decisions.",
  loans: "Understand borrowing, EMIs, and repayment decisions.",
  investments: "Learn the basics of long-term investing and risk.",
  banking: "Make sense of deposits and everyday banking products.",
  tax: "Clear explainers for tax-aware financial planning.",
  insurance: "Learn how protection products fit into a financial plan.",
  retirement: "Plan for financial independence over the long term.",
  "real-estate": "Understand the financial side of owning property.",
};

export const articles: Article[] = [
  {
    title: "Home Loan Guide for Beginners",
    slug: "home-loan-guide",
    description: "A practical introduction to home loans in India: EMIs, tenure, interest cost, and the questions to ask before borrowing.",
    category: "loans",
    author: "ArthaSiddhi Editorial Team",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    readingTime: "7 min read",
    relatedCalculators: ["home-loan"],
    relatedArticles: ["compound-interest", "sip-explained"],
    sections: [
      { id: "what-is-a-home-loan", heading: "What is a home loan?", paragraphs: ["A home loan is a secured loan used to buy, build, or improve a residential property. The property generally serves as security until the loan is repaid.", "Before applying, compare the total borrowing cost, not only the monthly EMI. The loan amount, interest rate, tenure, fees, and prepayment terms can all change the cost of ownership."] },
      { id: "understanding-emi", heading: "Understanding your EMI", paragraphs: ["An EMI, or equated monthly instalment, is the regular payment made toward a loan. In a typical reducing-balance loan, each EMI includes both interest and principal.", "At the start of a long loan, the interest part is usually larger. As the outstanding balance falls, a larger share of later EMIs goes toward principal."] },
      { id: "what-affects-your-emi", heading: "What affects your EMI?", list: ["Loan amount: borrowing more generally raises the EMI and total interest.", "Interest rate: even small rate changes can matter over a long tenure.", "Tenure: a longer tenure can lower the monthly EMI but may increase total interest paid.", "Prepayments: reducing the outstanding principal early may reduce future interest, subject to your loan terms."] },
      { id: "tenure-trade-off", heading: "The tenure trade-off", paragraphs: ["Choosing the longest possible tenure may make the monthly payment feel easier, but it is not automatically the cheapest choice. Choose a repayment plan that leaves room for emergency savings and other essential goals.", "Use an EMI estimate to compare a few tenure and rate scenarios before making a decision."], table: { caption: "How common home-loan choices can affect your plan", headers: ["Choice", "Possible effect", "Question to consider"], rows: [["Higher down payment", "Lower amount borrowed", "Will emergency savings remain adequate?"], ["Longer tenure", "Lower EMI, potentially more total interest", "Is the monthly relief worth the extra interest?"], ["Part-prepayment", "May reduce outstanding principal", "Are there conditions or charges in your agreement?"]] } },
      { id: "before-you-borrow", heading: "Before you borrow", paragraphs: ["Read the lender’s current terms carefully and ask how interest-rate changes, processing charges, insurance, and prepayment are handled. Your eligibility and final rate depend on the lender’s assessment; this guide is educational, not a loan recommendation."], callout: { title: "Useful next step", text: "Try different loan amounts, rates, and tenures with the Home Loan EMI Calculator to see how the monthly payment and total interest change." } },
    ],
    faq: [
      { question: "Does a lower EMI always mean a better home loan?", answer: "Not necessarily. A lower EMI can come from a longer tenure, which may increase the total interest paid. Compare both affordability and total repayment." },
      { question: "Can I pay a home loan early?", answer: "Many loans allow part-prepayment or foreclosure, but the terms and any charges depend on the loan agreement and applicable rules. Check with the lender before deciding." },
    ],
  },
  {
    title: "SIP Explained for Beginners",
    slug: "sip-explained",
    description: "Understand what a systematic investment plan is, how regular investing works, and why returns should never be assumed.",
    category: "investments",
    author: "ArthaSiddhi Editorial Team",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    readingTime: "6 min read",
    relatedCalculators: ["sip"],
    relatedArticles: ["compound-interest", "home-loan-guide"],
    sections: [
      { id: "what-is-a-sip", heading: "What is a SIP?", paragraphs: ["A systematic investment plan (SIP) is a way to invest a fixed amount at regular intervals, often monthly, in an eligible investment such as a mutual fund. It is a method of investing, not a separate investment product.", "The amount invested and the timing can be chosen around your cash flow. The value of market-linked investments can rise or fall, so future value is not assured."] },
      { id: "how-regular-investing-works", heading: "How regular investing works", paragraphs: ["With a regular investment schedule, you buy more or fewer units depending on the price at each contribution date. This can help create a disciplined habit, but it does not remove investment risk.", "A SIP plan should be connected to a clear goal, time horizon, and your comfort with market movements."] },
      { id: "factors-to-review", heading: "Factors to review before starting", list: ["Goal and time horizon: short-term goals may need a different approach from long-term goals.", "Monthly amount: choose an amount you can continue without compromising essentials.", "Fund suitability: read scheme information and understand the underlying risk.", "Review process: periodically reassess whether the plan still fits your goal."] },
      { id: "estimating-future-value", heading: "Estimating a future value", paragraphs: ["A calculator can illustrate how monthly contributions, a selected assumed return, and time work together. It cannot predict market outcomes or guarantee a maturity amount.", "Small changes in assumptions can lead to meaningfully different results over a long period."], callout: { title: "Try a scenario", text: "Use the SIP Calculator to compare contribution amounts and time horizons. Treat return inputs as illustrations, not forecasts." } },
    ],
    faq: [
      { question: "Is a SIP guaranteed to make money?", answer: "No. A SIP is an investing method. When it is used for market-linked investments, returns and capital value can fluctuate." },
      { question: "Can I change my SIP amount?", answer: "The available options depend on the investment platform and scheme. Review the current instructions and terms before making a change." },
    ],
  },
  {
    title: "Fixed Deposit Explained",
    slug: "fixed-deposit-explained",
    description: "Learn how fixed deposits work in India, including interest, tenure, compounding, and maturity value.",
    category: "banking",
    author: "ArthaSiddhi Editorial Team",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    readingTime: "5 min read",
    relatedCalculators: ["fd"],
    relatedArticles: ["compound-interest", "sip-explained"],
    sections: [
      { id: "what-is-an-fd", heading: "What is a fixed deposit?", paragraphs: ["A fixed deposit (FD) is a bank deposit for a chosen tenure at an interest rate specified by the institution when the deposit is opened. The amount and interest are generally paid at maturity or on another agreed schedule.", "Terms vary by bank and product, so always review the current deposit conditions before investing."] },
      { id: "how-fd-interest-works", heading: "How FD interest works", paragraphs: ["Interest may be paid periodically or compounded, depending on the product. Compounding means interest can be added to the deposit balance for later interest calculations.", "The stated rate, tenure, payment option, and compounding frequency all influence the estimated maturity amount."] },
      { id: "points-to-check", heading: "Points to check before opening an FD", list: ["Tenure and maturity date.", "Interest payout versus cumulative option.", "Premature withdrawal terms and any applicable penalty.", "Current tax treatment and the documents you may need."] },
      { id: "estimating-maturity", heading: "Estimating your maturity amount", paragraphs: ["An FD calculator can help you compare illustrative maturity values across tenures and compounding frequencies. Your bank’s actual calculation and current terms are the final reference."], callout: { title: "Plan before you deposit", text: "Try the FD Calculator to compare deposit amounts, tenures, rates, and compounding options." } },
    ],
    faq: [
      { question: "Is the interest rate the same for every fixed deposit?", answer: "No. Rates can vary by bank, deposit amount, tenure, customer type, and when the deposit is opened." },
      { question: "Can I withdraw an FD before maturity?", answer: "Many deposits permit premature withdrawal, subject to the product’s terms and possible penalties. Confirm the conditions with the bank." },
    ],
  },
  {
    title: "What Is Compound Interest?",
    slug: "compound-interest",
    description: "A clear explanation of compound interest, how it differs from simple interest, and why time matters in financial planning.",
    category: "personal-finance",
    author: "ArthaSiddhi Editorial Team",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    readingTime: "6 min read",
    relatedCalculators: ["sip", "fd"],
    relatedArticles: ["sip-explained", "fixed-deposit-explained"],
    sections: [
      { id: "compound-interest-basics", heading: "Compound interest basics", paragraphs: ["Compound interest is interest calculated on the original amount and on interest previously added to it. Over time, this can make the balance grow faster than simple interest, assuming the rate and contributions remain unchanged.", "It is a mathematical concept, not a promise of investment performance. In a market-linked investment, the return is not fixed."] },
      { id: "simple-vs-compound", heading: "Simple interest versus compound interest", table: { caption: "A high-level comparison of interest methods", headers: ["Method", "Interest is calculated on", "Why time matters"], rows: [["Simple interest", "Original principal", "Growth is linear when the rate stays constant."], ["Compound interest", "Principal plus accumulated interest", "Growth can accelerate as interest is added to the base."]] } },
      { id: "role-of-time", heading: "Why time matters", paragraphs: ["Compounding has more opportunity to work over longer periods. Regular contributions can also add to the balance that may earn future returns.", "That does not mean every long-term investment will deliver the same outcome. Rate assumptions, fees, taxes, withdrawals, and market performance can all affect results."] },
      { id: "using-calculators", heading: "Using calculators responsibly", paragraphs: ["Use a calculator to explore what different assumptions would mean, then consider the limits of those assumptions. For an FD, use the rate and terms supplied by the bank. For a SIP, treat expected returns as illustrative only."], callout: { title: "Explore the numbers", text: "Compare regular investment scenarios with the SIP Calculator or estimate an FD maturity amount with the FD Calculator." } },
    ],
  },
];

export function getArticle(category: string, slug: string) {
  return articles.find((article) => article.category === category && article.slug === slug);
}

export function getArticlesByCategory(category: string) {
  return articles.filter((article) => article.category === category);
}

export function getRelatedArticles(article: Article) {
  return article.relatedArticles
    .map((slug) => articles.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is Article => Boolean(candidate));
}
