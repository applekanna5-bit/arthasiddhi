import type { Article } from "../types";

export const depositDecisionArticles = [
  {
    title: "Choosing a Bank Deposit: Access, Cash Flow and Terms",
    slug: "choosing-bank-deposit",
    description: "Examine access needs, contribution timing, tenure, payout terms and deposit protection before choosing how to hold money in a bank deposit.",
    category: "banking",
    publishedAt: "2026-10-02",
    updatedAt: "2026-10-03",
    readingTime: "6 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: null,
    calculatorGuideRole: null,
    relatedCalculators: [],
    relatedArticles: ["fixed-deposit-explained", "rd-explained", "deposit-insurance-explained"],
    sections: [
      {
        id: "start-with-money", heading: "Start with the money and its intended job",
        paragraphs: [
          "Choosing a deposit starts with what the money needs to do. An amount already available, money expected from future monthly savings and money that may be needed unexpectedly have different constraints. This ArthaSiddhi educational decision framework helps you examine those constraints; it does not rank banks or prescribe a product.",
          [{ text: "Identify the intended use and competing priorities in your " }, { text: "personal financial plan", link: { kind: "article", slug: "how-to-build-a-personal-financial-plan" } }, { text: ". Here, the narrower question is which deposit terms to examine once that household context is understood." }],
        ],
      },
      {
        id: "access", heading: "Decide what access you may need",
        paragraphs: [
          "Money visible in an account is not necessarily uncommitted money. A known bill may arrive before a deposit matures, and an unexpected need may arise before the expected use date. Examine access conditions before committing money to a term.",
          [{ text: "Use the " }, { text: "household cash-flow framework", link: { kind: "article", slug: "understand-household-cash-flow" } }, { text: " to understand timing, and " }, { text: "emergency fund planning", link: { kind: "article", slug: "emergency-fund-planning" } }, { text: " for the separate question of household emergency liquidity. Neither framework prescribes a deposit allocation." }],
          [{ text: "Savings-account access and access before a term deposit's maturity perform different jobs. Early access may have contractual consequences; check whether it is permitted and how the bank treats it. " }, { text: "Premature FD withdrawal", link: { kind: "article", slug: "premature-fd-withdrawal" } }, { text: " explains what to check without assuming a universal penalty." }],
        ],
      },
      {
        id: "contributions", heading: "Compare contribution patterns before amounts",
        paragraphs: [
          [{ text: "An " }, { text: "FD", link: { kind: "article", slug: "fixed-deposit-explained" } }, { text: " places an available amount under agreed deposit terms. An " }, { text: "RD", link: { kind: "article", slug: "rd-explained" } }, { text: " builds a deposit through recurring contributions. Consider whether the money is available now or expected periodically, and whether recurring commitments leave enough flexibility." }],
          [{ text: "The existing " }, { text: "FD-versus-RD comparison", link: { kind: "article", slug: "fd-vs-rd" } }, { text: " compares deposit timing mathematically. It does not establish a universal winner. This page owns the broader decision about access, contribution pattern and terms." }],
        ],
      },
      {
        id: "tenure", heading: "Read tenure against the expected use date",
        paragraphs: [
          [{ text: "For the later operational decision, see " }, { text: "FD maturity and renewal", link: { kind: "article", slug: "fd-maturity-and-renewal" } }, { text: " or " }, { text: "managing an RD", link: { kind: "article", slug: "manage-recurring-deposit" } }, { text: ". These guides address what to check after opening." }],
          "Compare the contractual maturity date with when the money may be needed. A reasonably known use date can help frame the comparison, but plans may change. A longer tenure is not automatically better, and there is no universal optimal tenure.",
          "Check maturity instructions as well as tenure: whether money is paid out or renewed, what is renewed and which terms apply next. A present rate or projection does not settle the terms available for a later renewal or reinvestment.",
          [{ text: "For the broader relationship between uncertainty and goal timing, read " }, { text: "risk, return and time horizon", link: { kind: "article", slug: "risk-return-time-horizon" } }, { text: ". Deposit-specific terms remain the question here." }],
        ],
      },
      {
        id: "return-structure", heading: "Compare accumulated interest with payouts",
        paragraphs: [
          "A cumulative structure keeps interest within the deposit under its terms. Periodic payouts instead make interest available along the way. Compare the intended cash flow, payout schedule and contractual calculation method, rather than assuming every deposit compounds in the same way.",
          [{ text: "The " }, { text: "FD interest calculation guide", link: { kind: "article", slug: "fd-interest-calculation" } }, { text: " owns the detailed mechanics. For an illustrative cumulative projection, use the " }, { text: "FD calculator", link: { kind: "calculator", slug: "fd" } }, { text: "; for a modeled monthly contribution pattern, use the " }, { text: "RD calculator", link: { kind: "calculator", slug: "rd" } }, { text: ". These tools do not quote contractual proceeds or calculate every payout arrangement." }],
        ],
      },
      {
        id: "safety", heading: "Separate protection from access and purchasing power",
        paragraphs: [
          [{ text: "Deposit terms, access restrictions and bank-failure protection are different questions. Check " }, { text: "what DICGC deposit insurance covers", link: { kind: "article", slug: "deposit-insurance-explained" } }, { text: " for the current scope and ownership rules. Insured does not mean risk-free in every financial sense." }],
          [{ text: "Insurance does not settle whether money will be accessible when needed or what it will buy later. The existing " }, { text: "inflation explanation", link: { kind: "article", slug: "inflation-explained" } }, { text: " owns purchasing-power concepts; those are separate from deposit protection." }],
        ],
      },
      {
        id: "before-acting", heading: "Terms to check before acting",
        list: [
          "Deposit type and the institution accepting it.",
          "Contribution amount and pattern, including any recurring commitment.",
          "Applicable interest structure, compounding or payout method and schedule.",
          "Tenure, maturity date and payout or renewal instructions.",
          "Premature-closure conditions and how any reduction or penalty is applied.",
          "Ownership and nomination details where relevant; do not assume these mean the same thing.",
          "Deposit-insurance applicability and ownership/capacity treatment.",
          "Tax implications to verify separately under current rules and circumstances.",
        ],
      },
      {
        id: "boundaries", heading: "What this framework leaves for you to verify",
        paragraphs: ["Individual banks set product-specific terms, and rates can change. Tax treatment depends on current rules and circumstances; this page does not determine it. Liquidity needs are personal. Read the applicable documents and ask the institution to clarify terms you cannot reconcile. Calculators provide projections, not contractual quotes. Revisit the comparison when the intended use or relevant terms change."],
      },
    ],
  },
  {
    title: "Deposit Insurance Explained: What DICGC Covers",
    slug: "deposit-insurance-explained",
    description: "Understand current DICGC coverage, principal and interest limits, same-bank aggregation and joint-account ownership before assessing deposit protection.",
    category: "banking",
    publishedAt: "2026-10-02",
    updatedAt: "2026-10-02",
    readingTime: "5 min read",
    maintenance: { kind: "rule-sensitive", ruleSetId: "dicgc-deposit-insurance-2026-10" },
    primaryCalculator: null,
    calculatorGuideRole: null,
    relatedCalculators: [],
    relatedArticles: ["choosing-bank-deposit", "fixed-deposit-explained", "rd-explained"],
    sections: [
      { id: "scope", heading: "Check the institution and deposit first", paragraphs: ["The Deposit Insurance and Credit Guarantee Corporation (DICGC), an RBI-owned subsidiary, insures eligible deposits at insured banks. Its scope includes savings, fixed, current and recurring deposits. Primary cooperative societies are not insured.", "DICGC excludes government and inter-bank deposits, deposits received outside India and deposits specifically exempted with RBI approval. Check the official insured-bank list and deposit scope; a product's name alone does not establish protection."] },
      { id: "limit", heading: "The current ceiling includes interest", paragraphs: ["Verified on 2 October 2026, the ceiling is ₹5,00,000 for principal plus interest per depositor per bank in the same right and capacity. DICGC applies the relevant event date, such as liquidation, licence cancellation, a reconstruction scheme taking effect or RBI All Inclusive Directions. This is not a separate allowance for principal and interest."] },
      { id: "same-bank", heading: "Multiple accounts do not automatically multiply cover", paragraphs: ["Accounts held in the same right and capacity are combined across the same bank's branches. Separate savings, FD and RD accounts in your individual capacity do not each receive a fresh ceiling. A sole proprietor's business deposits and personal deposits are also aggregated.", "Right and capacity concern the ownership role in which deposits are held. DICGC distinguishes certain roles, such as individual ownership and holding as a partner or guardian. Do not infer a separate allowance from an account label; check the actual ownership classification."] },
      { id: "different-banks", heading: "Separate banks are different from separate branches", paragraphs: ["DICGC applies coverage separately at different banks. Branches of one bank are not separate banks for this purpose. Ownership/capacity rules still apply within each bank; this distinction is not a recommendation to distribute money in a particular way."] },
      { id: "joint-accounts", heading: "Joint ownership needs its own check", paragraphs: ["Joint accounts at the same bank with the same holders in the same order are aggregated. DICGC treats a different holder combination or different order as a different right and capacity for coverage. This does not mean each holder automatically receives an extra full limit within one joint account. Verify the recorded holders and order against the official guidance rather than assuming a per-person multiplier."] },
      { id: "claim-boundary", heading: "Insurance is not immediate access", paragraphs: ["Claim settlement follows the applicable process; insured money is not guaranteed to be immediately available in every situation. DICGC also states that bank dues may be set off before determining the insured claim. An account balance alone is therefore not a claim quote.", "Deposit insurance does not protect purchasing power, promise a particular interest rate or remove contractual access conditions. Read protection and access as separate questions.", [{ text: "For the household decision about accessible reserves, use " }, { text: "emergency fund planning", link: { kind: "article", slug: "emergency-fund-planning" } }, { text: ". For deposit terms, return to " }, { text: "choosing a bank deposit", link: { kind: "article", slug: "choosing-bank-deposit" } }, { text: "." }]] },
      { id: "check", heading: "What to check with the official sources", list: ["Institution status on DICGC's current insured-bank list and whether the deposit falls within scope.", "Recorded ownership, capacity and joint-holder order where relevant.", "Combined balances at all branches of the same bank, including relevant interest.", "Current coverage rules, any relevant set-off and the applicable claim process."], paragraphs: ["The official references below support the rules on this page. Use their latest guidance for a specific ownership or claim question; this explanation does not determine an individual legal or tax outcome."] },
    ],
  },
] as const satisfies readonly Article[];
