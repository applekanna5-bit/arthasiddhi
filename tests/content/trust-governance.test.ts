import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { footerLinkGroups, staticSitemapRoutes } from "../../lib/content/site-pages";

const sources = {
  about: readFileSync("app/about/page.tsx", "utf8"),
  contact: readFileSync("app/contact/page.tsx", "utf8"),
  editorial: readFileSync("app/editorial-policy/page.tsx", "utf8"),
  methodology: readFileSync("app/methodology/page.tsx", "utf8"),
  privacy: readFileSync("app/privacy/page.tsx", "utf8"),
};
const trustSource = Object.values(sources).join("\n");

describe("editorial governance", () => {
  it("publishes research, maintenance, responsible tooling, and correction principles", () => {
    expect(sources.editorial).toContain("Research and sources");
    expect(sources.editorial).toContain("Evergreen and rule-sensitive content");
    expect(sources.editorial).toContain("Technology and AI-assisted tools may support research, drafting, editing, testing, and consistency work.");
    expect(sources.editorial).toContain("Publication responsibility remains with the publisher.");
    expect(sources.editorial).toContain("Reported issues may be reviewed and corrected where warranted");
  });

  it("states current commercial independence without making a permanent promise", () => {
    expect(sources.editorial).toContain("At present, ArthaSiddhi does not carry advertising, affiliate links, sponsorships, or paid placements.");
    expect(sources.editorial).not.toMatch(/will never (?:carry|use|accept)/i);
  });

  it("uses only the owner-confirmed public mailbox", () => {
    const mailboxes = [...trustSource.matchAll(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g)].map(([email]) => email);
    expect(mailboxes.length).toBeGreaterThan(0);
    expect(new Set(mailboxes)).toEqual(new Set(["contact@arthasiddhi.com"]));
  });

  it("does not manufacture identities, reviewers, credentials, or social profiles", () => {
    for (const claim of ["ArthaSiddhi Editorial Team", "Founder", "reviewed by", "expert-approved", "SEBI registered", "RBI regulated", "sameAs"]) expect(trustSource).not.toContain(claim);
  });
});

describe("calculator methodology", () => {
  it("distinguishes defined models, local assumptions, and projections from guarantees", () => {
    expect(sources.methodology).toContain("Calculators do not all use the same formula.");
    expect(sources.methodology).toContain("The calculator page and its supporting guidance describe the scope and assumptions");
    expect(sources.methodology).toContain("Future-value and other projected outputs are illustrative, not guarantees.");
    expect(sources.methodology).toContain("An ArthaSiddhi estimate is not a lender quotation");
  });
});

describe("trust-route discovery", () => {
  it("exposes the two new routes through the footer and sitemap", () => {
    const footerRoutes = footerLinkGroups.flatMap(({ links }) => links.map(({ href }) => href));
    for (const route of ["/editorial-policy", "/methodology"]) {
      expect(footerRoutes).toContain(route);
      expect(staticSitemapRoutes).toContain(route);
    }
  });

  it("uses unique metadata titles and canonical paths", () => {
    const expected = [
      [sources.editorial, "Editorial Policy | ArthaSiddhi", "/editorial-policy"],
      [sources.methodology, "Calculator Methodology | ArthaSiddhi", "/methodology"],
    ] as const;
    for (const [source, title, path] of expected) {
      expect(source).toContain(`title: "${title}"`);
      expect(source).toContain(`path: "${path}"`);
    }
    expect(new Set(expected.map(([, title]) => title)).size).toBe(expected.length);
  });
});
