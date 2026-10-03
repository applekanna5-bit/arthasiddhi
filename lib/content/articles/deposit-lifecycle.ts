import type { Article } from "../types";

export const depositLifecycleArticles = [
  {
    title: "FD Maturity and Renewal: What to Check Before Reinvesting",
    slug: "fd-maturity-and-renewal",
    description: "Check maturity instructions, access needs and renewed-deposit terms before receiving or reinvesting FD proceeds, with scoped RBI guidance on unpaid domestic deposits.",
    category: "banking",
    publishedAt: "2026-10-03",
    updatedAt: "2026-10-03",
    readingTime: "5 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: "rbi-commercial-bank-domestic-deposits-2026-10" },
    primaryCalculator: null,
    calculatorGuideRole: null,
    relatedCalculators: [],
    relatedArticles: ["choosing-bank-deposit", "premature-fd-withdrawal", "deposit-insurance-explained"],
    sections: [
      {
        id: "normal-maturity", heading: "When an FD reaches normal maturity",
        paragraphs: [
          "The maturity date marks the end of the agreed deposit term. Maturity proceeds include principal and interest payable under the contract. Interest already paid out during the term should not be assumed to appear again in the final proceeds.",
          [{ text: "For the underlying product and interest structures, see " }, { text: "Fixed Deposit Explained", link: { kind: "article", slug: "fixed-deposit-explained" } }, { text: ". This page owns the next decision: receiving, renewing or reinvesting money at normal maturity." }],
        ],
      },
      {
        id: "instructions", heading: "Check the recorded maturity instruction",
        paragraphs: [
          "Read the deposit advice or digital record and confirm the instruction actually attached to your deposit. Depending on the product and terms, proceeds may be paid or credited to a linked account, or the deposit may be renewed. Auto-renewal may apply where the recorded customer or product instruction provides for it; do not assume it applies to every FD.",
          "Check what would be renewed: principal alone or principal with interest, the selected term, and any deadline or process for changing the instruction. Ask the bank to clarify an instruction that is missing or ambiguous rather than relying on a general description of its products.",
        ],
      },
      {
        id: "renewed-rate", heading: "Do not assume the old rate continues",
        paragraphs: [
          "A renewed or newly reinvested deposit may use the terms and applicable rate for that renewed or new deposit. The original FD rate is not a promise of the rate available after maturity. Compare the renewal advice and applicable rate schedule with the instruction you intended to give.",
          "A calculator projection for the original term does not establish the next deposit's contractual proceeds. Confirm the new maturity date, interest structure and access conditions separately.",
        ],
      },
      {
        id: "before-renewing", heading: "Revisit the decision before committing again",
        paragraphs: [
          [{ text: "Return to " }, { text: "choosing a bank deposit", link: { kind: "article", slug: "choosing-bank-deposit" } }, { text: " if the intended use or available options have changed. For household priorities, use your " }, { text: "personal financial plan", link: { kind: "article", slug: "how-to-build-a-personal-financial-plan" } }, { text: "; for money that may need to stay accessible, review " }, { text: "emergency fund planning", link: { kind: "article", slug: "emergency-fund-planning" } }, { text: ". Those household frameworks remain separate from deposit terms." }],
        ],
        list: [
          "When might the money next be needed, and has its intended use changed?",
          "Have access needs changed, and what tenure and maturity date are being selected?",
          "What premature-closure conditions would apply to the renewed deposit?",
          "Will interest accumulate or be paid out, and on what schedule?",
          "What maturity instruction is recorded for the new term?",
          "What deposit-insurance considerations and separately verified tax implications matter?",
        ],
      },
      {
        id: "regulatory-scope", heading: "The scope of the RBI guidance here",
        paragraphs: [
          "The regulatory explanation below is limited to ordinary resident domestic rupee term deposits with commercial banks covered by RBI's Commercial Banks – Interest Rate on Deposits Directions, 2025, read with amendments effective by 1 October 2026 and verified on 3 October 2026.",
          "It does not extend these rules to Regional Rural Banks, Small Finance Banks, Payments Banks, Local Area Banks, co-operative banks, NRE, NRO or FCNR(B) deposits, or foreign-branch operations. Deceased-depositor cases and maturity on a non-business working day have separate provisions and are outside the ordinary unpaid-proceeds explanation here.",
        ],
      },
      {
        id: "unpaid-proceeds", heading: "If a matured deposit remains unpaid",
        paragraphs: [
          "Under paragraph 16 of the verified RBI framework, when a covered domestic term deposit matures and its proceeds remain unpaid, the amount left unclaimed with the bank attracts the lower of the applicable savings-account interest rate and the contracted interest rate on the matured term deposit. Do not assume the original FD rate continues unchanged for that post-maturity period.",
          "Confirm whether the bank's record shows unpaid maturity proceeds or a deposit already renewed under its instruction. Ask for the relevant dates and interest treatment; these are different situations, not interchangeable labels for the same calculation.",
        ],
      },
      {
        id: "overdue-renewal", heading: "Overdue renewal needs its own terms check",
        paragraphs: [
          "Paragraph 15 places interest on renewal of overdue term deposits within the general framework in paragraph 7, including the bank's approved interest-rate policy. This is not a promise of retrospective renewal, backdating or preservation of the old rate.",
          "If renewal is requested after maturity, ask the bank which dates, rate and terms apply to the overdue period and to the renewed term. Keep its explanation with the renewed-deposit advice.",
        ],
      },
      {
        id: "early-exit", heading: "Normal maturity is different from early exit",
        paragraphs: [
          [{ text: "Receiving proceeds at the agreed maturity date is different from closing a deposit before that date. " }, { text: "What Premature FD Withdrawal Can Change", link: { kind: "article", slug: "premature-fd-withdrawal" } }, { text: " remains the owner of early-exit questions. Review those terms if access before the renewed maturity date may be needed." }],
          [{ text: "Deposit insurance is a separate question from maturity instructions and access. Check " }, { text: "what DICGC covers", link: { kind: "article", slug: "deposit-insurance-explained" } }, { text: " rather than treating renewal or a maturity projection as evidence of protection." }],
        ],
      },
      {
        id: "records", heading: "Keep the records that explain the outcome",
        list: [
          "Deposit advice, receipt or digital record showing the original maturity date.",
          "Recorded maturity instruction and linked-account details.",
          "Payment or renewal confirmation, including the rate and terms for any new term.",
          "Ownership and nomination information where relevant.",
          "Bank communications about any unpaid period or instruction change.",
          "Interest and tax records where relevant; detailed tax treatment needs separate verification.",
        ],
      },
    ],
  },
  {
    title: "Managing an RD: Instalments, Early Closure and Maturity",
    slug: "manage-recurring-deposit",
    description: "Check RD instalment terms, changed contribution ability, early-closure treatment and maturity records without assuming universal penalties or calculator-guaranteed proceeds.",
    category: "banking",
    publishedAt: "2026-10-03",
    updatedAt: "2026-10-03",
    readingTime: "4 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: "rbi-commercial-bank-domestic-deposits-2026-10" },
    primaryCalculator: null,
    calculatorGuideRole: null,
    relatedCalculators: [],
    relatedArticles: ["rd-explained", "rd-calculator-projection-vs-actual-maturity", "choosing-bank-deposit"],
    sections: [
      {
        id: "commitment", heading: "Manage the commitment after opening",
        paragraphs: [
          [{ text: "An RD generally involves periodic instalments over an agreed term. " }, { text: "RD Explained", link: { kind: "article", slug: "rd-explained" } }, { text: " introduces the product; this page addresses what to check while managing an actual deposit." }],
          "Keep the instalment schedule, due dates, agreed contribution amount and payment method available. Check how payments are recorded, how the bank communicates a problem, and which access and maturity instructions apply. A scheduled payment should be reconciled with the actual account record.",
        ],
      },
      {
        id: "missed-instalments", heading: "If an instalment is missed or delayed",
        paragraphs: [
          "Do not assume a universal grace period, fixed missed-instalment penalty, permitted number of missed payments or automatic closure trigger. Check the terms of your specific RD and any bank communication. A consequence described for another product or institution is not enough to establish yours.",
        ],
        list: [
          "The scheduled due date and whether the payment was received and recorded.",
          "Missed or delayed-payment provisions and any applicable charges or penalties.",
          "Current account status and any action or deadline communicated by the bank.",
          "Whether delayed contributions change interest or expected maturity proceeds.",
          "How to obtain clarification where the terms and statement do not reconcile.",
        ],
      },
      {
        id: "cash-flow", heading: "If contribution ability changes",
        paragraphs: [
          [{ text: "A changed ability to contribute is first a household cash-flow issue, then a deposit-terms question. Use " }, { text: "Understand Your Household Cash Flow", link: { kind: "article", slug: "understand-household-cash-flow" } }, { text: " to examine commitments and timing before deciding what to ask the bank." }],
          [{ text: "Review " }, { text: "emergency fund planning", link: { kind: "article", slug: "emergency-fund-planning" } }, { text: " where access needs have changed, and your " }, { text: "personal financial plan", link: { kind: "article", slug: "how-to-build-a-personal-financial-plan" } }, { text: " where priorities need reconsideration. This page does not prescribe contributions or recommend borrowing to maintain an RD." }],
        ],
      },
      {
        id: "regulatory-scope", heading: "Where the regulatory context applies",
        paragraphs: [
          "The regulatory statements here concern ordinary resident domestic rupee RDs with commercial banks covered by RBI's Commercial Banks – Interest Rate on Deposits Directions, 2025, read with amendments effective by 1 October 2026 and verified on 3 October 2026. That framework includes recurring deposits within its definition of term deposits.",
          "These statements are not extended to Regional Rural Banks, Small Finance Banks, Payments Banks, Local Area Banks, co-operative banks, NRE, NRO or FCNR(B) deposits, or foreign-branch operations. They do not establish a universal missed-instalment consequence for every RD.",
        ],
      },
      {
        id: "early-closure", heading: "Check the outcome before closing early",
        paragraphs: [
          "For covered domestic term deposits, RBI's framework requires interest on premature withdrawal to use the rate applicable to the amount and period actually held, rather than the contracted rate. It also requires an approved premature-withdrawal penalty policy and disclosure of penalty components at acceptance; if not disclosed, no penalty is to be levied under that provision.",
          "The actual RD closure outcome still needs the applicable terms and account history. Ask the bank for the interest treatment, any penalty and the amount payable, including how missed or delayed instalments have been accounted for. This page supplies no universal penalty amount or early-closure formula.",
        ],
      },
      {
        id: "maturity", heading: "At maturity, use the actual deposit record",
        paragraphs: [
          "Check the maturity date, recorded contributions, proceeds shown by the bank and the payment or linked-account instruction. Verify any next-step options actually offered. Do not assume an entitlement to automatic conversion or reinvestment.",
          "Resolve differences between the statement, maturity advice and your expected amount with the bank. Keep the explanation and confirmation rather than replacing the actual account record with a generic estimate.",
        ],
      },
      {
        id: "projection-boundary", heading: "A projection is not an account statement",
        paragraphs: [
          [{ text: "ArthaSiddhi's RD calculator is an educational deterministic projection. " }, { text: "RD Calculator Projection vs Actual Maturity", link: { kind: "article", slug: "rd-calculator-projection-vs-actual-maturity" } }, { text: " owns its assumptions and limitations. It does not calculate missed-instalment penalties or early-closure proceeds; the bank's actual account statement and maturity advice govern the record for your specific deposit." }],
        ],
      },
      {
        id: "next-decision", heading: "After maturity, reconsider the money's next job",
        paragraphs: [
          [{ text: "If another deposit is being considered, return to " }, { text: "Choosing a Bank Deposit", link: { kind: "article", slug: "choosing-bank-deposit" } }, { text: " to compare access needs, contribution pattern and terms. Where protection matters, check " }, { text: "Deposit Insurance Explained", link: { kind: "article", slug: "deposit-insurance-explained" } }, { text: ". Detailed tax treatment remains a separate question under current rules and circumstances." }],
        ],
      },
    ],
  },
] as const satisfies readonly Article[];
