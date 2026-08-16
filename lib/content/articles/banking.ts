import type { Article } from "../types";

export const bankingArticles = [
  {
    title: "Fixed Deposit Explained",
    slug: "fixed-deposit-explained",
    description: "How fixed deposits work in India, including rates, tenure, compounding, payout options and maturity amount.",
    category: "banking",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    readingTime: "5 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "fd",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["compound-interest"],
    sections: [
      { id: "what-is-an-fd", heading: "What is a fixed deposit?", paragraphs: ["A fixed deposit (FD) is a bank deposit for a chosen tenure at an interest rate specified by the institution when the deposit is opened. The amount and interest are generally paid at maturity or on another agreed schedule.", "Terms vary by bank and product, so always review the current deposit conditions before investing."] },
      { id: "how-fd-interest-works", heading: "How FD interest works", paragraphs: ["Interest may be paid periodically or compounded, depending on the product. Compounding means interest can be added to the deposit balance for later interest calculations.", "The stated rate, tenure, payment option, and compounding frequency all influence the estimated maturity amount."] },
      { id: "points-to-check", heading: "What to check before opening an FD", list: ["Tenure and maturity date.", "Interest payout versus cumulative option.", "Premature withdrawal terms and any applicable penalty.", "Current tax treatment and the documents you may need."] },
      { id: "estimating-maturity", heading: "Estimating your maturity amount", paragraphs: ["An FD calculator can help you compare illustrative maturity values across tenures and compounding frequencies. Your bank’s actual calculation and current terms are the final reference."], callout: { title: "Compare FD terms", text: [{ text: "Enter the deposit amount, rate, tenure and compounding frequency in the " }, { text: "FD Calculator", link: { kind: "calculator", slug: "fd" } }, { text: " to compare maturity amounts." }] } },
    ],
    faq: [
      { question: "Is the interest rate the same for every fixed deposit?", answer: "No. Rates can vary by bank, deposit amount, tenure, customer type, and when the deposit is opened." },
      { question: "Can I withdraw an FD before maturity?", answer: "Many deposits permit premature withdrawal, subject to the product’s terms and possible penalties. Confirm the conditions with the bank." },
    ],
  },
] satisfies readonly Article[];
