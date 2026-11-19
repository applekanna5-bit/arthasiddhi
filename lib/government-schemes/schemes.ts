import type { SchemeGuide } from "./types";

/** Planning records only. Full scheme guidance remains unpublished pending verification. */
export const plannedSchemeGuides: readonly SchemeGuide[] = [
  {
    slug: "ppf",
    title: "Public Provident Fund (PPF)",
    summary: "Understand contributions, interest assumptions, access rules and maturity.",
    category: "savings",
    reviewStatus: "needs-verification",
    sources: [{ title: "National Savings Institute", authority: "Government of India", url: "https://www.nsiindia.gov.in/" }],
    relatedPaths: ["/learn/banking/ppf-explained"],
  },
  {
    slug: "pmay-u-2",
    title: "PMAY-U 2.0",
    summary: "Understand urban housing assistance and why eligibility depends on the programme component.",
    category: "housing",
    reviewStatus: "needs-verification",
    sources: [{ title: "PMAY-U 2.0 guidelines", authority: "Ministry of Housing and Urban Affairs", url: "https://pmay-urban.gov.in/pmay-u-2.0-guidelines" }],
    relatedPaths: ["/learn/loans/how-much-house-can-i-afford"],
  },
  {
    slug: "sukanya-samriddhi",
    title: "Sukanya Samriddhi Account",
    summary: "Understand account eligibility, contributions, withdrawal rules and maturity.",
    category: "savings",
    reviewStatus: "needs-verification",
    sources: [{ title: "National Savings Institute", authority: "Government of India", url: "https://www.nsiindia.gov.in/" }],
    relatedPaths: [],
  },
];
