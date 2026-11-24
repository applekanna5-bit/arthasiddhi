/** Editorial scheme data; never a substitute for official eligibility decisions. */
export type SchemeCategory = "savings" | "housing" | "retirement" | "insurance" | "banking" | "business" | "health" | "energy";
export type SchemeReviewStatus = "research" | "needs-verification" | "verified";
export type SchemeSource = { title: string; authority: string; url: string; checkedAt?: string };
export type SchemeGuide = {
  slug: string;
  title: string;
  summary: string;
  category: SchemeCategory;
  reviewStatus: SchemeReviewStatus;
  lastVerifiedAt?: string;
  applicablePeriod?: string;
  sources: readonly SchemeSource[];
  relatedPaths: readonly string[];
};
