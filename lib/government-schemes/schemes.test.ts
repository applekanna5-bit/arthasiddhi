import { describe, expect, it } from "vitest";
import { schemeDrafts } from "./guide-content";
import { plannedSchemeGuides } from "./schemes";

describe("government scheme draft publication safeguards", () => {
  it("keeps all planned guides under verification", () => {
    expect(plannedSchemeGuides).toHaveLength(3);
    expect(plannedSchemeGuides.every((scheme) => scheme.reviewStatus === "needs-verification")).toBe(true);
  });

  it("has matching, unique slugs for the hub and guide pages", () => {
    const hubSlugs = plannedSchemeGuides.map((scheme) => scheme.slug);
    const guideSlugs = schemeDrafts.map((guide) => guide.slug);
    expect(new Set(hubSlugs).size).toBe(hubSlugs.length);
    expect(new Set(guideSlugs).size).toBe(guideSlugs.length);
    expect(guideSlugs.slice().sort()).toEqual(hubSlugs.slice().sort());
  });

  it("provides distinct official HTTPS sources for every guide", () => {
    for (const guide of schemeDrafts) {
      expect(guide.sources.length).toBeGreaterThan(0);
      const urls = guide.sources.map((source) => source.url);
      expect(new Set(urls).size).toBe(urls.length);
      expect(urls.every((url) => url.startsWith("https://"))).toBe(true);
      expect(guide.sections.length).toBeGreaterThan(0);
    }
  });

  it("does not reintroduce the unverified AHP PDF link", () => {
    const pmay = schemeDrafts.find((guide) => guide.slug === "pmay-u-2");
    expect(pmay).toBeDefined();
    expect(pmay?.sources.some((source) => source.url.endsWith("/AHP-SOP.pdf"))).toBe(false);
  });
});
