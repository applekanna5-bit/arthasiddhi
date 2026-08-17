import type { Article } from "../types";

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
    relatedArticles: ["compound-interest"],
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
    ],
    faq: [
      { question: "Is a SIP guaranteed to make money?", answer: "No. A SIP is an investing method. Returns and capital value can rise or fall when the underlying investment is market-linked." },
      { question: "Can I change my SIP amount?", answer: "That depends on the investment platform and scheme. Check the current instructions and terms before changing the amount." },
    ],
  },
] satisfies readonly Article[];
