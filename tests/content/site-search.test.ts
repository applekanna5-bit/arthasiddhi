import { describe, expect, it } from "vitest";
import { articles } from "../../lib/content/articles";
import { calculators } from "../../lib/content/calculators";
import { searchContent, searchItems } from "../../lib/content/search";

describe("Site-wide search", () => {
  it("indexes every published guide and calculator exactly once", () => {
    expect(searchItems).toHaveLength(articles.length + Object.keys(calculators).length);
    expect(new Set(searchItems.map((item) => item.href)).size).toBe(searchItems.length);
  });
  it("finds common Indian finance abbreviations", () => {
    expect(searchContent("EMI").some((item) => item.href === "/calculators/home-loan")).toBe(true);
    expect(searchContent("fixed deposit").some((item) => item.href === "/calculators/fd")).toBe(true);
    expect(searchContent("SIP").some((item) => item.href === "/calculators/sip")).toBe(true);
  });
  it("filters guides and calculators without mixing types", () => {
    expect(searchContent("loan", "calculator").every((item) => item.kind === "calculator")).toBe(true);
    expect(searchContent("loan", "guide").every((item) => item.kind === "guide")).toBe(true);
  });
  it("returns no results for blank or unmatched queries", () => {
    expect(searchContent("  ")).toEqual([]);
    expect(searchContent("zzzznonexistenttopic")).toEqual([]);
  });
  it("matches regardless of case and punctuation", () => {
    expect(searchContent("home-loan").some((item) => item.href === "/calculators/home-loan")).toBe(true);
    expect(searchContent("HOME LOAN").some((item) => item.href === "/calculators/home-loan")).toBe(true);
  });
});
