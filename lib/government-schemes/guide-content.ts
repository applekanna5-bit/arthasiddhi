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
      { heading: "Interest and projections", paragraphs: ["The government-notified interest rate can change. Actual account interest depends on the scheme's calculation and crediting rules, deposit timing and applicable rates. A calculator that assumes a fixed rate and beginning-of-year contributions is illustrative, not an exact maturity quotation."] },
      { heading: "Tax and practical checks", paragraphs: ["The scheme has specified tax treatment, but eligibility for a Section 80C deduction depends on the applicable income-tax regime and individual circumstances. Check the current rules and your account records before making a decision."] },
    ],
    sources: [{ title: "PPF Scheme Rules (National Savings Institute)", url: "https://www.nsiindia.gov.in/writereaddata/SchemeRules/PublicProvidentFundSchemeRule.pdf" }],
    related: [{ label: "PPF explained", href: "/learn/banking/ppf-explained" }, { label: "PPF interest calculation", href: "/learn/banking/ppf-interest-calculation" }],
  },
  {
    slug: "pmay-u-2", title: "PMAY-U 2.0: Urban Housing Assistance",
    intro: "PMAY-U 2.0 is an urban housing programme. Its assistance is conditional and varies by component; a home-loan EMI does not determine eligibility.",
    sections: [
      { heading: "Four programme components", paragraphs: ["The operational guidelines describe Beneficiary Led Construction (BLC), Affordable Housing in Partnership (AHP), Affordable Rental Housing (ARH) and the Interest Subsidy Scheme (ISS). These are different pathways, not four benefits that one household automatically receives together."] },
      { heading: "Who may qualify", paragraphs: ["The programme targets eligible urban EWS, LIG and MIG households. The operational guidelines include household-income categories, pucca-house ownership restrictions, past housing-benefit restrictions and further component-specific conditions. Local validation and official decisions govern eligibility."] },
      { heading: "Interest subsidy is not an EMI discount calculator", paragraphs: ["ISS has its own loan, property, income, timing and disbursement requirements. Do not subtract an assumed subsidy from a home-loan EMI or assume a lender must approve an application. Review the current ISS rules and lender documentation."] },
      { heading: "How to proceed safely", paragraphs: ["Identify the relevant component, read the latest operational guidelines and applicable amendments, and use official application or verification channels. ArthaSiddhi does not collect applications or make eligibility determinations."] },
    ],
    sources: [{ title: "PMAY-U 2.0 Operational Guidelines", url: "https://pmay-urban.gov.in/uploads/guidelines/Operational-Guidelines-of-PMAY-U-2.pdf" }, { title: "PMAY-U Guidelines Index", url: "https://pmay-urban.gov.in/guideline" }],
    related: [{ label: "Home affordability guide", href: "/learn/loans/how-much-house-can-i-afford" }, { label: "Home Loan EMI Calculator", href: "/calculators/home-loan" }],
  },
  {
    slug: "sukanya-samriddhi", title: "Sukanya Samriddhi Account: Rules and Maturity",
    intro: "Sukanya Samriddhi is a small-savings account opened for an eligible girl child. The deposit period and the account's maturity date are not the same.",
    sections: [
      { heading: "Opening an account", paragraphs: ["Under the 2019 scheme, a guardian may open an account for a girl child who has not attained ten years of age, subject to the scheme's account limits and exceptions. Check documentation requirements with an authorised bank or post office."] },
      { heading: "Deposits and maturity", paragraphs: ["The minimum annual deposit is ₹250 and the maximum is ₹1,50,000. Deposits are permitted for fifteen years from opening, while the account normally matures twenty-one years after opening. This difference matters when planning contributions."] },
      { heading: "Education withdrawals", paragraphs: ["Subject to documentary requirements, up to 50% of the eligible prior financial-year balance may be withdrawn for education after the account holder turns eighteen or passes Class 10, whichever occurs earlier. The amount and payment schedule are restricted by the rules."] },
      { heading: "Interest and tax", paragraphs: ["Government-notified rates can change. Tax deductions are not universally available under every income-tax regime. Do not infer a guaranteed maturity amount from a single assumed rate."] },
    ],
    sources: [{ title: "Sukanya Samriddhi Account Scheme Rules", url: "https://www.nsiindia.gov.in/writereaddata/SchemeRules/SukanyaSamriddhiAccountSchemeRule.pdf" }],
    related: [{ label: "Understand compound interest", href: "/learn/investments/compound-interest" }],
  },
];
