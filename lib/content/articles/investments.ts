import type { Article } from "../types";

export const investmentArticles = [
  {
    title: "SIP Explained for Beginners",
    slug: "sip-explained",
    description: "How a systematic investment plan works, what affects its projected value and why an assumed return is not a promise.",
    category: "investments",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    readingTime: "6 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "sip",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["compound-interest"],
    sections: [
      { id: "what-is-a-sip", heading: "What is a SIP?", paragraphs: ["A systematic investment plan (SIP) is a way to invest a fixed amount at regular intervals, often monthly, in an eligible investment such as a mutual fund. It is a method of investing, not a separate investment product.", "The amount invested and the timing can be chosen around your cash flow. The value of market-linked investments can rise or fall, so future value is not assured."] },
      { id: "how-regular-investing-works", heading: "How regular investing works", paragraphs: ["With a regular investment schedule, you buy more or fewer units depending on the price at each contribution date. This can help create a disciplined habit, but it does not remove investment risk.", "The monthly amount and investment period should fit the purpose of the investment, your cash flow and your comfort with market movements."] },
      { id: "factors-to-review", heading: "Factors to review before starting", list: ["Goal and time horizon: short-term goals may need a different approach from long-term goals.", "Monthly amount: choose an amount you can continue without compromising essentials.", "Fund suitability: read scheme information and understand the underlying risk.", "Review process: periodically reassess whether the plan still fits your goal."] },
      { id: "estimating-future-value", heading: "Reading a projected value", paragraphs: ["A calculator can illustrate how monthly contributions, an assumed return and time work together. It cannot predict market outcomes or guarantee a maturity amount.", "Small changes in the return or period can produce meaningfully different projections over a long period."], callout: { title: "Compare the assumptions", text: [{ text: "Change the monthly amount, period and assumed return in the " }, { text: "SIP Calculator", link: { kind: "calculator", slug: "sip" } }, { text: ". The result is an illustration, not a forecast." }] } },
    ],
    faq: [
      { question: "Is a SIP guaranteed to make money?", answer: "No. A SIP is an investing method. When it is used for market-linked investments, returns and capital value can fluctuate." },
      { question: "Can I change my SIP amount?", answer: "The available options depend on the investment platform and scheme. Review the current instructions and terms before making a change." },
    ],
  },
] satisfies readonly Article[];
