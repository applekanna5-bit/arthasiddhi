import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const privacySource = readFileSync("app/privacy/page.tsx", "utf8");
const disclaimerSource = readFileSync("app/disclaimer/page.tsx", "utf8");
const termsSource = readFileSync("app/terms/page.tsx", "utf8");

describe("Batch F legal copy", () => {
  it("protects the approved Privacy storage and infrastructure wording", () => {
    expect(privacySource).toContain("the calculator code does not save inputs in local or session storage");
    expect(privacySource).toContain("Hosting or network infrastructure may still use essential cookies or similar technical storage for security or delivery.");
  });

  it("applies the site-wide external-link scope and revision date", () => {
    expect(privacySource).toContain("The site may link to external official or supporting sources.");
    expect(privacySource).not.toContain("Articles may link to external sources.");
    expect(privacySource).toContain("Last updated: 17 August 2026.");
  });

  it("protects the eligibility boundary and unchanged investment-risk wording", () => {
    expect(disclaimerSource).toContain("They do not determine eligibility for a financial product or benefit.");
    expect(disclaimerSource).toContain("Assumed or historical returns do not guarantee future results. Market-linked investments can rise or fall in value, and capital may be at risk.");
    expect(disclaimerSource).toContain("Last updated: 17 August 2026.");
  });

  it("keeps the Terms of Use at its approved baseline", () => {
    expect(createHash("sha256").update(termsSource).digest("hex")).toBe("46991bcd1eae0a19bd24ff63d36488b7eca917e7030b7464ef2e88a820bc0e89");
  });
});
