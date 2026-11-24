/** Editorial drafts based on scheme rules; publication verification remains required. */
export type SchemeSection = { heading: string; paragraphs: readonly string[] };
export type SchemeDraft = { slug: string; title: string; intro: string; sections: readonly SchemeSection[]; sources: readonly { title: string; url: string }[]; related: readonly { label: string; href: string }[] };
export const schemeDrafts: readonly SchemeDraft[] = [
  {
    slug: "ppf", title: "Public Provident Fund (PPF): Rules and Planning",
    intro: "PPF is a government-backed savings scheme for long-term goals. If you are setting aside money from your salary each month, this guide helps you understand when you can access your savings, how contributions work and why a calculator estimate may differ from your actual balance.",
    sections: [
      { heading: "Contributions", paragraphs: ["The Public Provident Fund Scheme, 2019 specifies an annual minimum of ₹500 and maximum of ₹1,50,000, subject to its account and guardian contribution rules. Deposits are made in multiples of ₹50."] },
      { heading: "Maturity and access", paragraphs: ["An account matures after fifteen complete financial years from the end of the financial year in which it was opened. The scheme permits loans and partial withdrawals only within specified windows and subject to conditions. Do not treat PPF as an on-demand emergency fund."] },
      { heading: "Loans and partial withdrawals", paragraphs: ["Under the 2019 scheme, a loan may be requested after one year but before five years have elapsed from the end of the financial year of the initial subscription (commonly described as the third through sixth financial years). The maximum loan is 25% of the qualifying balance at the end of the second year preceding the application year. An existing loan and its interest must be repaid before a fresh loan can be obtained.", "Partial withdrawals may be requested after five years have elapsed from the end of the opening financial year (commonly from the seventh financial year). The maximum is 50% of the lower of the balances at the end of the fourth financial year preceding the withdrawal year and the immediately preceding financial year. Only one partial withdrawal is permitted per year, and outstanding loan dues must first be settled. Discontinued accounts are not eligible for loans or partial withdrawals." ] },
      { heading: "Options after maturity", paragraphs: ["At maturity, an account holder can close the account, retain it without further deposits while continuing to earn the applicable interest, or elect to extend it with deposits in five-year blocks. An extension with deposits must be opted for within one year of maturity using the prescribed process; otherwise later deposits are irregular.", "During a five-year extension with deposits, total withdrawals are subject to a 60% ceiling based on the balance at the start of that block. A matured account continued without deposits instead permits one withdrawal per year within the available balance. These are different withdrawal rules." ] },
      { heading: "Premature closure is restricted", paragraphs: ["The 2019 scheme permits premature closure after the prescribed five-year period only on specified grounds, including qualifying serious medical treatment, higher education or a change in residency status, with supporting documents. The applicable interest is reduced by one percentage point under the scheme's calculation rules. Premature closure is not the same as a routine partial withdrawal." ] },
      { heading: "A practical ₹5,000-a-month example", paragraphs: ["Depositing ₹5,000 in each of twelve months adds ₹60,000 in a financial year. If that same annual amount is deposited for fifteen full years, total contributions would be ₹9,00,000, before interest. This is only a contribution example: actual interest and the maturity date depend on the account opening date, deposit dates, government-notified rates and scheme rules.", "For monthly interest, the scheme uses the lowest account balance between the close of the fifth day and the end of the month. Depositing early enough to count for that month can affect interest; a late-month deposit may not earn interest for that month." ] },
      { heading: "Interest and projections", paragraphs: ["The government-notified interest rate can change. Actual account interest depends on the scheme's calculation and crediting rules, deposit timing and applicable rates. A calculator that assumes a fixed rate and beginning-of-year contributions is illustrative, not an exact maturity quotation."] },
      { heading: "Before opening an account", paragraphs: ["Check the current scheme rules, account eligibility, required identity and address documents, and the authorised bank or post office application process. Ask how to record deposits and nominations, and keep your account records. Consider whether you can set aside money for the long term without using your emergency savings."] },
      { heading: "Tax and practical checks", paragraphs: ["The scheme has specified tax treatment, but eligibility for a Section 80C deduction depends on the applicable income-tax regime and individual circumstances. Check the current rules and your account records before making a decision."] },
    ],
    sources: [{ title: "PPF Scheme Rules (National Savings Institute)", url: "https://www.nsiindia.gov.in/writereaddata/SchemeRules/PublicProvidentFundSchemeRule.pdf" }, { title: "Latest small-savings interest notifications (Department of Economic Affairs)", url: "https://dea.gov.in/budget-division/475" }],
    related: [{ label: "PPF Calculator", href: "/calculators/ppf" }],
  },
  {
    slug: "pmay-u-2", title: "PMAY-U 2.0: Urban Housing Assistance",
    intro: "If you are planning to buy, build or rent a home in an urban area, PMAY-U 2.0 may be relevant to your housing plans. Different programme components serve different needs. Assistance is conditional, and a home-loan EMI estimate does not establish eligibility.",
    sections: [
      { heading: "Four programme components", paragraphs: ["The operational guidelines describe Beneficiary Led Construction (BLC), Affordable Housing in Partnership (AHP), Affordable Rental Housing (ARH) and the Interest Subsidy Scheme (ISS). These are different pathways, not four benefits that one household automatically receives together."] },
      { heading: "Who may qualify", paragraphs: ["The programme targets eligible urban EWS, LIG and MIG households. The operational guidelines include household-income categories, pucca-house ownership restrictions, past housing-benefit restrictions and further component-specific conditions. The four components do not share identical eligibility rules; check the specific component and any later implementation instructions. Local validation and official decisions govern eligibility."] },
      { heading: "Income bands and past housing benefits", paragraphs: ["The September 2024 PMAY-U 2.0 guidelines define EWS as annual household income up to ₹3 lakh, LIG as above ₹3 lakh up to ₹6 lakh, and MIG as above ₹6 lakh up to ₹9 lakh. States and Union Territories may redefine the EWS income criterion with the Ministry’s concurrence. These are programme definitions, not proof of approval.", "The guidelines generally exclude households that own a pucca house anywhere in India, and those allotted a house under a Central, State/UT or local-government housing scheme within the preceding twenty years. Check the current component rules, exceptions and verification requirements before applying." ] },
      { heading: "AHP: who it serves and how it works", paragraphs: ["The April 2026 Ministry of Housing and Urban Affairs AHP Standard Operating Procedure describes AHP as an ownership-housing pathway for eligible EWS beneficiaries, with houses generally measuring 30–45 square metres of carpet area and basic civic services. Do not assume that LIG or MIG eligibility elsewhere in PMAY-U 2.0 also makes a household eligible for an AHP allotment.", "AHP projects may be developed by public agencies or eligible private developers. Applicants may use the official PMAY-U 2.0 portal, a Common Service Centre or their Urban Local Body. Project selection, eligibility checks, approvals and allotment are governed by the competent authorities; an application is not an entitlement to a house or financial assistance.", "For private-sector AHP, the SOP describes approved or whitelisted projects and redeemable housing vouchers, with assistance tied to verification and occupancy. These arrangements are not an upfront cash payment automatically available to every applicant. The SOP states that the overarching PMAY-U 2.0 scheme guidelines prevail if provisions conflict." ] },
      { heading: "Interest subsidy is not an EMI discount calculator", paragraphs: ["ISS has its own loan, property, income, timing and disbursement requirements. Do not subtract an assumed subsidy from a home-loan EMI or assume a lender must approve an application. Review the current ISS rules and lender documentation."] },
      { heading: "An eligibility example, not an approval", paragraphs: ["A household may appear to fit an income category but still fail another condition, such as already owning a pucca house or having received a disqualifying housing benefit. Conversely, meeting an income threshold alone does not establish ISS eligibility. Only the competent authority and participating institutions can determine entitlement under the applicable rules." ] },
      { heading: "Prepare before applying", paragraphs: ["Start by identifying the housing component that matches your needs. Check the official application channel for the current document checklist, including any required household income, identity, property or prior housing-benefit information. Keep your application acknowledgement and confirm any requests for payment through official channels. Do not share sensitive documents with unofficial intermediaries."] },
      { heading: "How to proceed safely", paragraphs: ["Identify the relevant component, read the latest operational guidelines and applicable amendments, and use official application or verification channels. ArthaSiddhi does not collect applications or make eligibility determinations."] },
    ],
    sources: [{ title: "PMAY-U 2.0 Operational Guidelines", url: "https://pmay-urban.gov.in/uploads/guidelines/Operational-Guidelines-of-PMAY-U-2.pdf" }, { title: "PMAY-U Guidelines and Updates", url: "https://pmay-urban.gov.in/guideline" }, { title: "AHP Standard Operating Procedure (MoHUA, April 2026; reviewed)", url: "https://pmay-urban.gov.in/uploads/guidelines/AHP-SOP.pdf" }],
    related: [{ label: "Home affordability guide", href: "/learn/loans/how-much-house-can-i-afford" }, { label: "Home Loan EMI Calculator", href: "/calculators/home-loan" }],
  },
  {
    slug: "sukanya-samriddhi", title: "Sukanya Samriddhi Account: Rules and Maturity",
    intro: "Sukanya Samriddhi is a government small-savings account for an eligible girl child. Families exploring long-term savings for their daughter should understand how long they can contribute, when money can be accessed and when the account matures.",
    sections: [
      { heading: "Opening an account", paragraphs: ["Under the 2019 scheme, a guardian may open an account for a girl child who has not attained ten years of age, subject to the scheme's account limits and exceptions. Check documentation requirements with an authorised bank or post office."] },
      { heading: "Deposits and maturity", paragraphs: ["The minimum deposit required in a financial year is ₹250 and the maximum is ₹1,50,000. Deposits may be made during the fifteen-year period from opening, while the account normally matures twenty-one years after opening. These are different milestones: the account may continue earning applicable interest after the contribution window closes."] },
      { heading: "Education withdrawals", paragraphs: ["Subject to documentary requirements, up to 50% of the eligible prior financial-year balance may be withdrawn for education after the account holder turns eighteen or passes Class 10, whichever occurs earlier. The amount and payment schedule are restricted by the rules."] },
      { heading: "A practical deposit-period example", paragraphs: ["A family contributing ₹2,000 every month would contribute ₹24,000 over twelve months, within the annual limit. Fifteen full years of such contributions would total ₹3,60,000 before interest. This is not a maturity estimate: the account normally matures twenty-one years after opening, and actual interest depends on notified rates and deposit timing." ] },
      { heading: "Before opening an account", paragraphs: ["Ask an authorised bank or post office for its current application and documentation checklist, including the documents required for the child and guardian. Check account limits and any applicable exceptions. Plan contributions around your household budget rather than assuming you must deposit the maximum each year."] },
      { heading: "Interest and tax", paragraphs: ["Government-notified rates can change. Tax deductions are not universally available under every income-tax regime. Do not infer a guaranteed maturity amount from a single assumed rate."] },
    ],
    sources: [{ title: "Sukanya Samriddhi Account Scheme Rules", url: "https://www.nsiindia.gov.in/writereaddata/SchemeRules/SukanyaSamriddhiAccountSchemeRule.pdf" }, { title: "Latest small-savings interest notifications (Department of Economic Affairs)", url: "https://dea.gov.in/budget-division/475" }],
    related: [],
  },
  {
    "slug": "scss",
    "title": "Senior Citizens Savings Scheme",
    "intro": "Understand a savings option designed for eligible senior citizens.",
    "sections": [
      {"heading":"Scheme rules at a glance","paragraphs":["SCSS is intended for eligible older savers. The NSI overview describes a five-year term, quarterly interest, deposits from ₹1,000 and a ₹30 lakh ceiling. People aged 60 or above are the main eligible group; certain retirees aged 55–59 and qualifying retired defence personnel aged 50 or above may qualify under additional conditions.","Based on the National Savings Institute overview and published scheme text; subsequent amendments and current tax treatment require final review."]},
      {"heading":"Worked example","paragraphs":["At an illustrative annual rate of 8%, ₹10 lakh would generate ₹20,000 for a full quarter before tax. Initial payment periods and actual applicable rates may differ."]},
      {
        "heading": "How it fits your savings plan",
        "paragraphs": [
          "Consider how regular interest payments fit your household expenses. For example, list your monthly expenses and other income before deciding how much savings to commit."
        ]
      },
      {
        "heading": "What to check before applying",
        "paragraphs": [
          "Check current age and retirement-related eligibility, deposit limits, interest payment schedule, maturity, extension and premature closure rules with an authorised institution."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Use the official information link to locate the current scheme rules and authorised application channel. Confirm documentation requirements and keep your account or purchase records. This introductory draft does not establish eligibility or quote current rates."
        ]
      }
    ],
    "sources": [
      {"title":"Published scheme rules (2019, amended 2020)","url":"https://www.nsiindia.gov.in/writereaddata/SchemeRules/SeniorCitizensSavingsSchemeRule.pdf"},
      {"title":"National Savings Institute scheme overview","url":"https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=27"},
      {
        "title": "National Savings Institute official website",
        "url": "https://www.nsiindia.gov.in/"
      }
    ],
    "related": [{"label":"Plan your household cash flow","href":"/learn/personal-finance/understand-household-cash-flow"},{"label":"Fixed deposit calculator","href":"/calculators/fd"}]
  },
  {
    "slug": "nsc",
    "title": "National Savings Certificate",
    "intro": "Understand fixed-term small savings and maturity.",
    "sections": [
      {"heading":"Scheme rules at a glance","paragraphs":["The NSC rules describe a five-year deposit, starting at ₹1,000 with further amounts in ₹100 increments and no maximum deposit limit. Interest accumulates rather than providing regular monthly income. Early closure is restricted.","Based on the National Savings Institute overview and published scheme text; subsequent amendments and current tax treatment require final review."]},
      {"heading":"Worked example","paragraphs":["At an assumed annual compound rate of 7%, ₹10,000 grows to about ₹14,026 over five years before tax. This is an illustration, not a notified maturity quotation."]},
      {
        "heading": "How it fits your savings plan",
        "paragraphs": [
          "If you are saving for a future expense, compare the date you need the money with the certificate maturity date. Do not assume you can withdraw whenever you want."
        ]
      },
      {
        "heading": "What to check before applying",
        "paragraphs": [
          "Check current purchase limits, applicable interest, maturity, early encashment restrictions and tax treatment before purchasing."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Use the official information link to locate the current scheme rules and authorised application channel. Confirm documentation requirements and keep your account or purchase records. This introductory draft does not establish eligibility or quote current rates."
        ]
      }
    ],
    "sources": [
      {"title":"Published scheme rules (2019, amended 2020)","url":"https://www.nsiindia.gov.in/writereaddata/SchemeRules/NationalSavingsCertificatesRule.pdf"},
      {"title":"National Savings Institute scheme overview","url":"https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=27"},
      {
        "title": "National Savings Institute official website",
        "url": "https://www.nsiindia.gov.in/"
      }
    ],
    "related": [{"label":"Understand compound interest","href":"/learn/personal-finance/compound-interest"},{"label":"Fixed deposit calculator (compare assumptions)","href":"/calculators/fd"}]
  },
  {
    "slug": "kvp",
    "title": "Kisan Vikas Patra",
    "intro": "Understand the notified maturity period and savings commitment.",
    "sections": [
      {"heading":"Scheme rules at a glance","paragraphs":["The NSI overview describes a minimum investment of ₹1,000 with no maximum limit. The amount doubles at the prescribed maturity date, which depends on the terms applicable at purchase. Early encashment is subject to rules and prescribed values.","Based on the National Savings Institute overview and published scheme text; subsequent amendments and current tax treatment require final review."]},
      {"heading":"Worked example","paragraphs":["A ₹50,000 purchase would have a scheduled maturity value of ₹1 lakh under the doubling terms. Check the applicable maturity period rather than assuming a fixed number of years."]},
      {
        "heading": "How it fits your savings plan",
        "paragraphs": [
          "If you set aside ₹50,000, check when the certificate is scheduled to mature before committing money needed for nearer-term expenses."
        ]
      },
      {
        "heading": "What to check before applying",
        "paragraphs": [
          "Check the notified maturity period applicable on purchase, eligibility, transfer and premature encashment rules."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Use the official information link to locate the current scheme rules and authorised application channel. Confirm documentation requirements and keep your account or purchase records. This introductory draft does not establish eligibility or quote current rates."
        ]
      }
    ],
    "sources": [
      {"title":"Published scheme rules (2019, amended 2020)","url":"https://www.nsiindia.gov.in/writereaddata/SchemeRules/KisanVikasPatra.pdf"},
      {"title":"National Savings Institute scheme overview","url":"https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=27"},
      {
        "title": "National Savings Institute official website",
        "url": "https://www.nsiindia.gov.in/"
      }
    ],
    "related": [{"label":"Understand annualised growth","href":"/calculators/cagr"}]
  },
  {
    "slug": "post-office-mis",
    "title": "Post Office Monthly Income Scheme",
    "intro": "Understand regular interest income from a deposit.",
    "sections": [
      {"heading":"Scheme rules at a glance","paragraphs":["The NSI overview describes a five-year account paying monthly interest, with a ₹1,000 minimum and ceilings of ₹9 lakh for single accounts and ₹15 lakh for joint accounts. Individual aggregate holdings and joint shares are subject to scheme rules. Early closure is available after one year subject to deductions.","Based on the National Savings Institute overview and published scheme text; subsequent amendments and current tax treatment require final review."]},
      {"heading":"Worked example","paragraphs":["At an assumed 7% annual rate, ₹6 lakh produces ₹3,500 monthly before tax. The actual rate and permitted deposit depend on the applicable rules."]},
      {
        "heading": "How it fits your savings plan",
        "paragraphs": [
          "If you need ₹5,000 each month for household expenses, compare your required income with the interest payable under the applicable deposit terms. This is a budgeting example, not a promised payout."
        ]
      },
      {
        "heading": "What to check before applying",
        "paragraphs": [
          "Check current deposit limits, joint account rules, interest rate, maturity and early closure conditions at an authorised post office."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Use the official information link to locate the current scheme rules and authorised application channel. Confirm documentation requirements and keep your account or purchase records. This introductory draft does not establish eligibility or quote current rates."
        ]
      }
    ],
    "sources": [
      {"title":"Published scheme rules (2019, amended 2020)","url":"https://www.nsiindia.gov.in/writereaddata/SchemeRules/MonthlyIncomeAccountRule.pdf"},
      {"title":"National Savings Institute scheme overview","url":"https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=27"},
      {
        "title": "India Post official website",
        "url": "https://www.indiapost.gov.in/"
      }
    ],
    "related": [{"label":"Plan household cash flow","href":"/learn/personal-finance/understand-household-cash-flow"}]
  },
  {
    "slug": "apy",
    "title": "Atal Pension Yojana",
    "intro": "Understand a pension scheme intended to support retirement income.",
    "sections": [
      {"heading":"Eligibility and benefits","paragraphs":["Indian citizens aged 18–40 with a savings account at a bank or post office may qualify. New enrolment from 1 October 2022 excludes citizens who are or have been income-tax payers as described in the FAQ. This restriction does not prevent subscribers enrolled by 30 September 2022 from continuing."]},
      {"heading":"Practical example and restrictions","paragraphs":["Choose a minimum monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000 or ₹5,000 from age 60, subject to scheme conditions. Contributions depend on joining age and pension choice. A ₹3,000 monthly pension corresponds to ₹36,000 annually; consider inflation when planning future expenses."]},
      {"heading":"Application and documentation","paragraphs":["Ask your bank or post office for the contribution chart, enrolment form, nomination and spouse details, and auto-debit arrangements. Confirm early exit and survivor rules before enrolling."]},
      {
        "heading": "Why it matters",
        "paragraphs": [
          "Consider how a future monthly pension might fit alongside your other retirement savings."
        ]
      },
      {
        "heading": "What to check before enrolling",
        "paragraphs": [
          "Check current joining eligibility, contribution schedule, pension options, exit and nominee rules."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Consult the official scheme information and authorised institution for current enrolment and documentation requirements. This research draft does not establish eligibility or promise benefits."
        ]
      }
    ],
    "sources": [
      {"title":"PFRDA FAQ (accessed 24 November 2026)","url":"https://pfrda.org.in/web/pfrda/w/faqs/atal-pension-yojana"},
      {
        "title": "Pension Fund Regulatory and Development Authority",
        "url": "https://www.pfrda.org.in/"
      }
    ],
    "related": [{"label":"Explore retirement projections","href":"/calculators/nps"},{"label":"Understand inflation","href":"/calculators/inflation"}]
  },
  {
    "slug": "pmjjby",
    "title": "Pradhan Mantri Jeevan Jyoti Bima Yojana",
    "intro": "Understand life insurance protection under a government-supported scheme.",
    "sections": [
      {"heading":"Eligibility and benefits","paragraphs":["New enrolment is available to eligible individual bank or post office account holders aged 18–50, through one account per person. The official FAQ lists ₹436 annual renewal premium and ₹2 lakh death cover, subject to policy conditions."]},
      {"heading":"Practical example and restrictions","paragraphs":["This is life cover, not an investment. A household paying ₹436 for the full annual premium should not expect a maturity payout. For first-time enrolment, the published premium schedule is ₹436 for June–August, ₹342 for September–November, ₹228 for December–February and ₹114 for March–May. Renewal requires the full annual premium. The standard policy year runs from 1 June to 31 May. The first 30 days exclude non-accidental death claims for first-time entrants under the FAQ conditions."]},
      {"heading":"Application and documentation","paragraphs":["Ask the participating institution for its enrolment form, auto-debit consent, nominee details, insurer and current renewal terms. Keep confirmation of cover and ask the insurer for claim documentation."]},
      {
        "heading": "Why it matters",
        "paragraphs": [
          "Consider how your family would meet essential expenses if your income stopped because of your death."
        ]
      },
      {
        "heading": "What to check before enrolling",
        "paragraphs": [
          "Check current eligibility, premium, coverage, renewal, exclusions and claim requirements."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Consult the official scheme information and authorised institution for current enrolment and documentation requirements. This research draft does not establish eligibility or promise benefits."
        ]
      }
    ],
    "sources": [
      {"title":"Department of Financial Services FAQ (accessed 24 November 2026)","url":"https://financialservices.gov.in/pmjjby"},
      {
        "title": "Department of Financial Services",
        "url": "https://financialservices.gov.in/"
      }
    ],
    "related": [{"label":"Build a financial plan","href":"/learn/personal-finance/how-to-build-a-personal-financial-plan"}]
  },
  {
    "slug": "pmsby",
    "title": "Pradhan Mantri Suraksha Bima Yojana",
    "intro": "Understand accident insurance protection.",
    "sections": [
      {"heading":"Eligibility and benefits","paragraphs":["Eligible account holders aged 18–70 can enrol through one participating bank or post office account. The official FAQ lists ₹20 annual premium, with ₹2 lakh for covered accidental death or specified total permanent disability and ₹1 lakh for specified partial permanent disability."]},
      {"heading":"Practical example and restrictions","paragraphs":["A hospital bill following an accident does not itself qualify for reimbursement under PMSBY. The benefit depends on the covered event and disability definitions, rather than the amount spent on medical care. The published policy year runs from 1 June to 31 May; cover can cease at the scheme age limit, account closure or insufficient funds for renewal."]},
      {"heading":"Application and documentation","paragraphs":["Submit enrolment and auto-debit consent through the participating institution. Confirm the insurer, nominee and renewal status. For claims, promptly obtain the relevant accident and medical evidence and follow insurer instructions."]},
      {
        "heading": "Why it matters",
        "paragraphs": [
          "Accident insurance and life insurance address different risks. Compare what each policy actually covers before relying on it."
        ]
      },
      {
        "heading": "What to check before enrolling",
        "paragraphs": [
          "Check current age eligibility, premium, accidental death and disability benefits, renewal and claim conditions."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Consult the official scheme information and authorised institution for current enrolment and documentation requirements. This research draft does not establish eligibility or promise benefits."
        ]
      }
    ],
    "sources": [
      {"title":"Department of Financial Services FAQ (accessed 24 November 2026)","url":"https://financialservices.gov.in/pmsby"},
      {
        "title": "Department of Financial Services",
        "url": "https://financialservices.gov.in/"
      }
    ],
    "related": [{"label":"Plan emergency savings","href":"/learn/personal-finance/emergency-fund-planning"}]
  },
  {
    "slug": "pmjdy",
    "title": "Pradhan Mantri Jan Dhan Yojana",
    "intro": "Understand access to basic banking services.",
    "sections": [
      {"heading":"Eligibility and benefits","paragraphs":["The scheme provides basic banking access for people without another account. The official overview describes no minimum balance requirement, interest on deposits and a RuPay debit card. Eligible holders may access an overdraft up to ₹10,000 subject to conditions."]},
      {"heading":"Practical example and restrictions","paragraphs":["An overdraft is borrowed money that must be repaid, not a free ₹10,000 benefit. The official overview describes accident cover associated with eligible RuPay cards, including enhanced cover of ₹2 lakh for new accounts opened after 28 August 2018; confirm card and insurance conditions."]},
      {"heading":"Application and documentation","paragraphs":["Visit a bank branch or authorised Bank Mitra and ask for current identity and address documentation requirements. Confirm account features, card terms and eligibility separately for insurance, pension, overdraft and direct benefit transfers."]},
      {
        "heading": "Why it matters",
        "paragraphs": [
          "A bank account can help a household receive payments and keep savings separate from everyday cash."
        ]
      },
      {
        "heading": "What to check before enrolling",
        "paragraphs": [
          "Check account opening requirements, applicable account features and conditions for any additional benefits."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Consult the official scheme information and authorised institution for current enrolment and documentation requirements. This research draft does not establish eligibility or promise benefits."
        ]
      }
    ],
    "sources": [
      {"title":"PMJDY official scheme details (accessed 24 November 2026)","url":"https://pmjdy.gov.in/scheme-detail.aspx"},
      {
        "title": "PMJDY official portal",
        "url": "https://pmjdy.gov.in/"
      }
    ],
    "related": [{"label":"Understand household cash flow","href":"/learn/personal-finance/understand-household-cash-flow"}]
  },
  {
    "slug": "pmay-g",
    "title": "Pradhan Mantri Awaas Yojana – Gramin",
    "intro": "Understand rural housing assistance and household eligibility.",
    "sections": [
      {"heading":"Housing assistance and selection","paragraphs":["PMAY-G supports eligible rural households without adequate housing. Beneficiary selection uses programme records and local verification rather than income alone. Assistance is generally released in stages linked to construction progress. Confirm the applicable assistance amount and convergence benefits locally."]},
      {"heading":"Practical example","paragraphs":["If a construction estimate is ₹3 lakh, prepare a budget for materials, labour and any amount not covered by approved assistance. Do not count a proposed benefit as cash already received."]},
      {"heading":"Application and documentation","paragraphs":["Contact the Gram Panchayat or block programme office to check beneficiary records, survey procedures, required documents and sanction status. Use the official PMAY-G portal to locate programme information."]},
      {
        "heading": "How it relates to household finances",
        "paragraphs": [
          "A family planning a rural home should distinguish government assistance from its own construction budget."
        ]
      },
      {
        "heading": "What to check before applying",
        "paragraphs": [
          "Check beneficiary selection, local verification, assistance amounts and instalment conditions through the official programme and local authorities."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Consult the official programme information and authorised application channel for current requirements. Keep application records and verify requests for documents or payments. This research draft does not establish eligibility or guarantee benefits."
        ]
      }
    ],
    "sources": [
      {
        "title": "PMAY-G official portal",
        "url": "https://pmayg.nic.in/"
      }
    ],
    "related": [{"label":"Understand home buying costs","href":"/learn/loans/home-buying-costs-beyond-property-price"}]
  },
  {
    "slug": "mudra",
    "title": "Pradhan Mantri MUDRA Yojana",
    "intro": "Understand business credit for eligible small enterprises.",
    "sections": [
      {"heading":"Loan categories and repayment","paragraphs":["MUDRA supports eligible microenterprise borrowing for income-generating activities. The Shishu, Kishor, Tarun and Tarun Plus categories distinguish borrowing requirements; Tarun Plus is intended for qualifying borrowers who successfully repaid an earlier Tarun loan. Confirm current limits and eligibility with the lender. Interest and repayment terms are lender-specific."]},
      {"heading":"Practical example","paragraphs":["A business borrowing ₹1 lakh at an illustrative 12% annual reducing-balance rate for 24 months would pay about ₹4,707 monthly, excluding fees. Compare repayment with conservative business cash flow, not gross sales."]},
      {"heading":"Application and documentation","paragraphs":["Prepare a business plan, equipment quotations, identity documents and financial records as applicable. Approach a participating lender and obtain a written quotation before accepting credit."]},
      {
        "heading": "How it relates to household finances",
        "paragraphs": [
          "A tailor buying a sewing machine should estimate monthly business receipts, expenses and loan repayments before borrowing."
        ]
      },
      {
        "heading": "What to check before applying",
        "paragraphs": [
          "Check current loan categories, eligible activities, lender requirements, interest and repayment terms. A loan is not a grant."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Consult the official programme information and authorised application channel for current requirements. Keep application records and verify requests for documents or payments. This research draft does not establish eligibility or guarantee benefits."
        ]
      }
    ],
    "sources": [
      {
        "title": "MUDRA",
        "url": "https://www.mudra.org.in/"
      }
    ],
    "related": [{"label":"Understand loan repayment calculations","href":"/learn/loans/personal-loan-emi-explained"}]
  },
  {
    "slug": "pm-vishwakarma",
    "title": "PM Vishwakarma",
    "intro": "Understand support for eligible traditional artisans.",
    "sections": [
      {"heading":"Support for traditional trades","paragraphs":["The programme combines recognition, skills training, toolkit support, credit and marketing assistance for eligible traditional artisans in specified trades. Registration and verification requirements apply, and credit assistance is repayable. Confirm current trade lists, benefit amounts and conditions on the official portal."]},
      {"heading":"Practical example","paragraphs":["A carpenter planning a ₹40,000 equipment purchase should distinguish approved toolkit assistance from a loan and budget for any remaining cost and repayment."]},
      {"heading":"Application and documentation","paragraphs":["Consult the official portal or authorised Common Service Centre for registration, identity and trade verification, training and benefit procedures. Keep acknowledgement records."]},
      {
        "heading": "How it relates to household finances",
        "paragraphs": [
          "An artisan planning to purchase tools should separate equipment costs from working capital and household expenses."
        ]
      },
      {
        "heading": "What to check before applying",
        "paragraphs": [
          "Check eligible trades, registration, training, toolkit support and credit conditions; benefits depend on official approval."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Consult the official programme information and authorised application channel for current requirements. Keep application records and verify requests for documents or payments. This research draft does not establish eligibility or guarantee benefits."
        ]
      }
    ],
    "sources": [
      {
        "title": "PM Vishwakarma official portal",
        "url": "https://pmvishwakarma.gov.in/"
      }
    ],
    "related": [{"label":"Understand financial commitments","href":"/learn/personal-finance/prioritize-debt-financial-commitments"}]
  },
  {
    "slug": "pm-jay",
    "title": "Ayushman Bharat PM-JAY",
    "intro": "Understand eligible household healthcare protection.",
    "sections": [
      {"heading":"Healthcare coverage and eligibility","paragraphs":["PM-JAY provides eligible beneficiaries access to covered hospital treatment through empanelled facilities. Coverage is package-based and does not automatically reimburse all outpatient expenses or every hospital bill. Eligibility pathways include qualifying households and a separate expansion for senior citizens aged 70 and above; confirm current state implementation and applicable coverage."]},
      {"heading":"Practical example","paragraphs":["Before admission, ask the hospital help desk whether the proposed treatment package is covered and whether authorisation is required. Do not assume an unrelated private hospital bill will be reimbursed."]},
      {"heading":"Application and documentation","paragraphs":["Use the National Health Authority beneficiary and hospital information channels or an authorised help desk to confirm eligibility, identity documentation and card procedures."]},
      {
        "heading": "How it relates to household finances",
        "paragraphs": [
          "Before a planned hospital visit, confirm whether the household, hospital and treatment are covered rather than assuming every medical expense is reimbursed."
        ]
      },
      {
        "heading": "What to check before applying",
        "paragraphs": [
          "Check current beneficiary eligibility, covered packages, empanelled hospitals and state-specific implementation."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Consult the official programme information and authorised application channel for current requirements. Keep application records and verify requests for documents or payments. This research draft does not establish eligibility or guarantee benefits."
        ]
      }
    ],
    "sources": [
      {
        "title": "National Health Authority",
        "url": "https://nha.gov.in/"
      }
    ],
    "related": [{"label":"Plan emergency savings","href":"/learn/personal-finance/emergency-fund-planning"}]
  },
  {
    "slug": "pm-surya-ghar",
    "title": "PM Surya Ghar Muft Bijli Yojana",
    "intro": "Understand household rooftop solar support and electricity savings.",
    "sections": [
      {"heading":"Solar assistance and electricity bills","paragraphs":["The programme supports eligible residential rooftop solar installations. Central financial assistance depends on applicable capacity and programme conditions; local distribution-company procedures and inspection matter. The advertised electricity savings are not an unconditional guarantee of a zero bill."]},
      {"heading":"Practical example","paragraphs":["If a system saves 150 billed units monthly at an illustrative ₹6 per unit, the energy-charge saving is ₹900 before fixed charges and other billing adjustments. Actual generation, self-consumption and export settlement vary."]},
      {"heading":"Application and documentation","paragraphs":["Use the official portal to check registration, electricity connection details, vendor selection, feasibility, installation, inspection and subsidy disbursement procedures. Compare written quotations and avoid unofficial advance-payment requests."]},
      {
        "heading": "How it relates to household finances",
        "paragraphs": [
          "Compare your electricity bills, installation quotation and expected generation before estimating savings. Actual savings depend on consumption, tariffs and system performance."
        ]
      },
      {
        "heading": "What to check before applying",
        "paragraphs": [
          "Check current residential eligibility, subsidy conditions, vendor and electricity distribution company procedures, installation and inspection requirements."
        ]
      },
      {
        "heading": "How to proceed",
        "paragraphs": [
          "Consult the official programme information and authorised application channel for current requirements. Keep application records and verify requests for documents or payments. This research draft does not establish eligibility or guarantee benefits."
        ]
      }
    ],
    "sources": [
      {
        "title": "PM Surya Ghar official portal",
        "url": "https://pmsuryaghar.gov.in/"
      }
    ],
    "related": [{"label":"Plan household cash flow","href":"/learn/personal-finance/understand-household-cash-flow"}]
  },
];
