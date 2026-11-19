/** Editorial drafts based on scheme rules; publication verification remains required. */
export type SchemeSection = { heading: string; paragraphs: readonly string[] };
export type SchemeDraft = { slug: string; title: string; intro: string; sections: readonly SchemeSection[]; sources: readonly { title: string; url: string }[]; related: readonly { label: string; href: string }[] };
export const schemeDrafts: readonly SchemeDraft[] = [
  {
    slug: "ppf", title: "Public Provident Fund (PPF): Rules and Planning",
    intro: "PPF is a long-term government-backed savings scheme. Understand the statutory account rules before interpreting a projection.",
    sections: [
      { heading: "Contributions", paragraphs: ["The Public Provident Fund Scheme, 2019 specifies an annual minimum of ₹500 and maximum of ₹1,50,000, subject to its account and guardian contribution rules. Deposits are made in multiples of ₹50."] },
      { heading: "Maturity and access", paragraphs: ["An account matures after fifteen complete financial years from the end of the financial year in which it was opened. The scheme permits specified loans, partial withdrawals and extensions subject to conditions. Do not treat PPF as an on-demand emergency fund."] },
      { heading: "A practical ₹5,000-a-month example", paragraphs: ["Depositing ₹5,000 in each of twelve months adds ₹60,000 in a financial year. If that same annual amount is deposited for fifteen full years, total contributions would be ₹9,00,000, before interest. This is only a contribution example: actual interest and the maturity date depend on the account opening date, deposit dates, government-notified rates and scheme rules.", "For monthly interest, the scheme uses the lowest account balance between the close of the fifth day and the end of the month. Depositing early enough to count for that month can affect interest; a late-month deposit may not earn interest for that month." ] },
      { heading: "Interest and projections", paragraphs: ["The government-notified interest rate can change. Actual account interest depends on the scheme's calculation and crediting rules, deposit timing and applicable rates. A calculator that assumes a fixed rate and beginning-of-year contributions is illustrative, not an exact maturity quotation."] },
      { heading: "Tax and practical checks", paragraphs: ["The scheme has specified tax treatment, but eligibility for a Section 80C deduction depends on the applicable income-tax regime and individual circumstances. Check the current rules and your account records before making a decision."] },
    ],
    sources: [{ title: "PPF Scheme Rules (National Savings Institute)", url: "https://www.nsiindia.gov.in/writereaddata/SchemeRules/PublicProvidentFundSchemeRule.pdf" }, { title: "Latest small-savings interest notifications (Department of Economic Affairs)", url: "https://dea.gov.in/budget-division/475" }],
    related: [{ label: "PPF Calculator", href: "/calculators/ppf" }],
  },
  {
    slug: "pmay-u-2", title: "PMAY-U 2.0: Urban Housing Assistance",
    intro: "PMAY-U 2.0 is an urban housing programme. Its assistance is conditional and varies by component; a home-loan EMI does not determine eligibility.",
    sections: [
      { heading: "Four programme components", paragraphs: ["The operational guidelines describe Beneficiary Led Construction (BLC), Affordable Housing in Partnership (AHP), Affordable Rental Housing (ARH) and the Interest Subsidy Scheme (ISS). These are different pathways, not four benefits that one household automatically receives together."] },
      { heading: "Who may qualify", paragraphs: ["The programme targets eligible urban EWS, LIG and MIG households. The operational guidelines include household-income categories, pucca-house ownership restrictions, past housing-benefit restrictions and further component-specific conditions. Local validation and official decisions govern eligibility."] },
      { heading: "Interest subsidy is not an EMI discount calculator", paragraphs: ["ISS has its own loan, property, income, timing and disbursement requirements. Do not subtract an assumed subsidy from a home-loan EMI or assume a lender must approve an application. Review the current ISS rules and lender documentation."] },
      { heading: "An eligibility example, not an approval", paragraphs: ["A household may appear to fit an income category but still fail another condition, such as already owning a pucca house or having received a disqualifying housing benefit. Conversely, meeting an income threshold alone does not establish ISS eligibility. Only the competent authority and participating institutions can determine entitlement under the applicable rules." ] },
      { heading: "How to proceed safely", paragraphs: ["Identify the relevant component, read the latest operational guidelines and applicable amendments, and use official application or verification channels. ArthaSiddhi does not collect applications or make eligibility determinations."] },
    ],
    sources: [{ title: "PMAY-U 2.0 Operational Guidelines", url: "https://pmay-urban.gov.in/uploads/guidelines/Operational-Guidelines-of-PMAY-U-2.pdf" }, { title: "PMAY-U Guidelines and Updates", url: "https://pmay-urban.gov.in/index.php/guideline" }],
    related: [{ label: "Home affordability guide", href: "/learn/loans/how-much-house-can-i-afford" }, { label: "Home Loan EMI Calculator", href: "/calculators/home-loan" }],
  },
  {
    slug: "sukanya-samriddhi", title: "Sukanya Samriddhi Account: Rules and Maturity",
    intro: "Sukanya Samriddhi is a small-savings account opened for an eligible girl child. The deposit period and the account's maturity date are not the same.",
    sections: [
      { heading: "Opening an account", paragraphs: ["Under the 2019 scheme, a guardian may open an account for a girl child who has not attained ten years of age, subject to the scheme's account limits and exceptions. Check documentation requirements with an authorised bank or post office."] },
      { heading: "Deposits and maturity", paragraphs: ["The minimum annual deposit is ₹250 and the maximum is ₹1,50,000. Deposits are permitted for fifteen years from opening, while the account normally matures twenty-one years after opening. This difference matters when planning contributions."] },
      { heading: "Education withdrawals", paragraphs: ["Subject to documentary requirements, up to 50% of the eligible prior financial-year balance may be withdrawn for education after the account holder turns eighteen or passes Class 10, whichever occurs earlier. The amount and payment schedule are restricted by the rules."] },
      { heading: "A practical deposit-period example", paragraphs: ["A family contributing ₹2,000 every month would contribute ₹24,000 over twelve months, within the annual limit. Fifteen full years of such contributions would total ₹3,60,000 before interest. This is not a maturity estimate: the account normally matures twenty-one years after opening, and actual interest depends on notified rates and deposit timing." ] },
      { heading: "Interest and tax", paragraphs: ["Government-notified rates can change. Tax deductions are not universally available under every income-tax regime. Do not infer a guaranteed maturity amount from a single assumed rate."] },
    ],
    sources: [{ title: "Sukanya Samriddhi Account Scheme Rules", url: "https://www.nsiindia.gov.in/writereaddata/SchemeRules/SukanyaSamriddhiAccountSchemeRule.pdf" }, { title: "Latest small-savings interest notifications (Department of Economic Affairs)", url: "https://dea.gov.in/budget-division/475" }],
    related: [],
  },
];
