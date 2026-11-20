import { describe, expect, it } from "vitest";
import { schemeDrafts } from "./guide-content";
import { buildSitemap } from "../content/sitemap";
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

  it("excludes all unpublished scheme routes from the public sitemap", () => {
    const urls = buildSitemap().map((entry) => entry.url);
    expect(urls.some((url) => new URL(url).pathname.startsWith("/government-schemes"))).toBe(false);
  });

  it("labels the ministry-confirmed AHP PDF as pending full-text review", () => {
    const pmay = schemeDrafts.find((guide) => guide.slug === "pmay-u-2");
    expect(pmay).toBeDefined();
    const ahpSources = pmay?.sources.filter((source) => source.url.endsWith("/AHP-SOP.pdf")) ?? [];
    expect(ahpSources).toHaveLength(1);
    expect(ahpSources[0].url).toBe("https://pmay-urban.gov.in/uploads/guidelines/AHP-SOP.pdf");
    expect(ahpSources[0].title.toLowerCase()).toContain("pending");
  });
});
