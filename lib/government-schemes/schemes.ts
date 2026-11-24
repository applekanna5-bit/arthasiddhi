import type { SchemeGuide } from "./types";

/** Planning records only. Full scheme guidance remains unpublished pending verification. */
export const plannedSchemeGuides: readonly SchemeGuide[] = [
  {
    slug: "ppf",
    title: "Public Provident Fund (PPF)",
    summary: "Understand contributions, interest assumptions, access rules and maturity.",
    category: "savings",
    reviewStatus: "needs-verification",
    sources: [{ title: "National Savings Institute", authority: "Government of India", url: "https://www.nsiindia.gov.in/writereaddata/SchemeRules/PublicProvidentFundSchemeRule.pdf" }],
    relatedPaths: ["/calculators/ppf"],
  },
  {
    slug: "pmay-u-2",
    title: "PMAY-U 2.0",
    summary: "Understand urban housing assistance and why eligibility depends on the programme component.",
    category: "housing",
    reviewStatus: "needs-verification",
    sources: [{ title: "PMAY-U 2.0 guidelines", authority: "Ministry of Housing and Urban Affairs", url: "https://pmay-urban.gov.in/uploads/guidelines/Operational-Guidelines-of-PMAY-U-2.pdf" }],
    relatedPaths: ["/learn/loans/how-much-house-can-i-afford"],
  },
  {
    slug: "sukanya-samriddhi",
    title: "Sukanya Samriddhi Account",
    summary: "Understand account eligibility, contributions, withdrawal rules and maturity.",
    category: "savings",
    reviewStatus: "needs-verification",
    sources: [{ title: "Sukanya Samriddhi Scheme Rules", authority: "Government of India", url: "https://www.nsiindia.gov.in/writereaddata/SchemeRules/SukanyaSamriddhiAccountSchemeRule.pdf" }],
    relatedPaths: [],
  },
  {
    "slug": "scss",
    "title": "Senior Citizens Savings Scheme",
    "summary": "Understand a savings option designed for eligible senior citizens.",
    "category": "savings",
    "reviewStatus": "research",
    "sources": [
      {
        "title": "National Savings Institute official website",
        "authority": "National Savings Institute",
        "url": "https://www.nsiindia.gov.in/"
      }
    ],
    "relatedPaths": []
  },
  {
    "slug": "nsc",
    "title": "National Savings Certificate",
    "summary": "Understand fixed-term small savings and maturity.",
    "category": "savings",
    "reviewStatus": "research",
    "sources": [
      {
        "title": "National Savings Institute official website",
        "authority": "National Savings Institute",
        "url": "https://www.nsiindia.gov.in/"
      }
    ],
    "relatedPaths": []
  },
  {
    "slug": "kvp",
    "title": "Kisan Vikas Patra",
    "summary": "Understand the notified maturity period and savings commitment.",
    "category": "savings",
    "reviewStatus": "research",
    "sources": [
      {
        "title": "National Savings Institute official website",
        "authority": "National Savings Institute",
        "url": "https://www.nsiindia.gov.in/"
      }
    ],
    "relatedPaths": []
  },
  {
    "slug": "post-office-mis",
    "title": "Post Office Monthly Income Scheme",
    "summary": "Understand regular interest income from a deposit.",
    "category": "savings",
    "reviewStatus": "research",
    "sources": [
      {
        "title": "India Post official website",
        "authority": "India Post",
        "url": "https://www.indiapost.gov.in/"
      }
    ],
    "relatedPaths": []
  },
];
