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
    "reviewStatus": "needs-verification",
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
    "reviewStatus": "needs-verification",
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
    "reviewStatus": "needs-verification",
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
    "reviewStatus": "needs-verification",
    "sources": [
      {
        "title": "India Post official website",
        "authority": "India Post",
        "url": "https://www.indiapost.gov.in/"
      }
    ],
    "relatedPaths": []
  },
  {
    "slug": "apy",
    "title": "Atal Pension Yojana",
    "summary": "Understand a pension scheme intended to support retirement income.",
    "category": "retirement",
    "reviewStatus": "needs-verification",
    "sources": [
      {
        "title": "Pension Fund Regulatory and Development Authority",
        "authority": "Pension Fund Regulatory and Development Authority",
        "url": "https://www.pfrda.org.in/"
      }
    ],
    "relatedPaths": []
  },
  {
    "slug": "pmjjby",
    "title": "Pradhan Mantri Jeevan Jyoti Bima Yojana",
    "summary": "Understand life insurance protection under a government-supported scheme.",
    "category": "insurance",
    "reviewStatus": "needs-verification",
    "sources": [
      {
        "title": "Department of Financial Services",
        "authority": "Department of Financial Services",
        "url": "https://financialservices.gov.in/"
      }
    ],
    "relatedPaths": []
  },
  {
    "slug": "pmsby",
    "title": "Pradhan Mantri Suraksha Bima Yojana",
    "summary": "Understand accident insurance protection.",
    "category": "insurance",
    "reviewStatus": "needs-verification",
    "sources": [
      {
        "title": "Department of Financial Services",
        "authority": "Department of Financial Services",
        "url": "https://financialservices.gov.in/"
      }
    ],
    "relatedPaths": []
  },
  {
    "slug": "pmjdy",
    "title": "Pradhan Mantri Jan Dhan Yojana",
    "summary": "Understand access to basic banking services.",
    "category": "banking",
    "reviewStatus": "needs-verification",
    "sources": [
      {
        "title": "PMJDY official portal",
        "authority": "PMJDY official portal",
        "url": "https://pmjdy.gov.in/"
      }
    ],
    "relatedPaths": []
  },
  {
    "slug": "pmay-g",
    "title": "Pradhan Mantri Awaas Yojana – Gramin",
    "summary": "Understand rural housing assistance and household eligibility.",
    "category": "housing",
    "reviewStatus": "needs-verification",
    "sources": [
      {
        "title": "PMAY-G official portal",
        "authority": "PMAY-G official portal",
        "url": "https://pmayg.nic.in/"
      }
    ],
    "relatedPaths": []
  },
  {
    "slug": "mudra",
    "title": "Pradhan Mantri MUDRA Yojana",
    "summary": "Understand business credit for eligible small enterprises.",
    "category": "business",
    "reviewStatus": "needs-verification",
    "sources": [
      {
        "title": "MUDRA",
        "authority": "MUDRA",
        "url": "https://www.mudra.org.in/"
      }
    ],
    "relatedPaths": []
  },
  {
    "slug": "pm-vishwakarma",
    "title": "PM Vishwakarma",
    "summary": "Understand support for eligible traditional artisans.",
    "category": "business",
    "reviewStatus": "needs-verification",
    "sources": [
      {
        "title": "PM Vishwakarma official portal",
        "authority": "PM Vishwakarma official portal",
        "url": "https://pmvishwakarma.gov.in/"
      }
    ],
    "relatedPaths": []
  },
  {
    "slug": "pm-jay",
    "title": "Ayushman Bharat PM-JAY",
    "summary": "Understand eligible household healthcare protection.",
    "category": "health",
    "reviewStatus": "needs-verification",
    "sources": [
      {
        "title": "National Health Authority",
        "authority": "National Health Authority",
        "url": "https://nha.gov.in/"
      }
    ],
    "relatedPaths": []
  },
  {
    "slug": "pm-surya-ghar",
    "title": "PM Surya Ghar Muft Bijli Yojana",
    "summary": "Understand household rooftop solar support and electricity savings.",
    "category": "energy",
    "reviewStatus": "needs-verification",
    "sources": [
      {
        "title": "PM Surya Ghar official portal",
        "authority": "PM Surya Ghar official portal",
        "url": "https://pmsuryaghar.gov.in/"
      }
    ],
    "relatedPaths": []
  },
];
