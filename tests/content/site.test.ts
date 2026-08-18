import { describe, expect, it } from "vitest";
import { articles } from "../../lib/content/articles";
import { calculators } from "../../lib/content/calculators";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, getArticlePath, pageMetadata, websiteJsonLd } from "../../lib/content/seo";
import { absoluteUrl, robotsSitemapUrl, siteUrl } from "../../lib/content/site";
import { footerLinkGroups, primaryLinks, staticSitemapRoutes } from "../../lib/content/site-pages";
import { buildSitemap } from "../../lib/content/sitemap";

describe("production URL regression protection", () => {
  const origin = "https://arthasiddhi.com";
  const article = articles[0];

  it("uses the canonical production origin for homepage metadata and robots", () => {
    const homepage = pageMetadata({ title: "ArthaSiddhi", description: "Financial education", path: "/" });
    expect(siteUrl).toBe(origin);
    expect(homepage.alternates?.canonical).toBe(`${origin}/`);
    expect(homepage.openGraph?.url).toBe(`${origin}/`);
    expect(robotsSitemapUrl).toBe(`${origin}/sitemap.xml`);
  });

  it("uses the production origin for article metadata and schemas", () => {
    const articleUrl = `${origin}${getArticlePath(article)}`;
    expect(articleMetadata(article).alternates?.canonical).toBe(articleUrl);
    expect(articleJsonLd(article).mainEntityOfPage).toBe(articleUrl);
    expect(breadcrumbJsonLd(article).itemListElement.every(({ item }) => item.startsWith(origin))).toBe(true);
    expect(websiteJsonLd().url).toBe(`${origin}/`);
  });

  it("uses only production URLs in the generated sitemap", () => {
    const sitemap = buildSitemap();
    expect(sitemap.length).toBe(new Set(sitemap.map(({ url }) => url)).size);
    expect(sitemap.every(({ url }) => url.startsWith(`${origin}/`))).toBe(true);
  });
});

describe("public site routes", () => {
  const trustRoutes = ["/about", "/contact", "/privacy", "/terms", "/disclaimer"];

  it("includes every trust route in the sitemap", () => {
    for (const route of trustRoutes) expect(staticSitemapRoutes).toContain(route);
  });

  it("maps every footer link to a known public route", () => {
    const knownRoutes = new Set<string>([...staticSitemapRoutes, ...primaryLinks.map(({ href }) => href)]);
    for (const group of footerLinkGroups) {
      for (const link of group.links) expect(knownRoutes.has(link.href)).toBe(true);
    }
  });

  it("builds absolute URLs without changing the route", () => {
    for (const route of staticSitemapRoutes) expect(new URL(absoluteUrl(route)).pathname).toBe(route);
  });

  it("registers exactly seventeen calculators with valid related routes", () => {
    expect(Object.keys(calculators)).toHaveLength(17);
    for (const calculator of Object.values(calculators)) {
      expect(calculator.href).toBe(`/calculators/${calculator.slug}`);
      for (const relatedSlug of calculator.relatedCalculators) expect(calculators[relatedSlug]).toBeDefined();
    }
  });

  it("includes every calculator route in the sitemap", () => {
    const sitemapUrls = new Set(buildSitemap().map(({ url }) => url));
    for (const calculator of Object.values(calculators)) expect(sitemapUrls.has(absoluteUrl(calculator.href))).toBe(true);
  });

  it("includes every article and every non-empty category in the sitemap", () => {
    const sitemapUrls = new Set(buildSitemap().map(({ url }) => url));
    for (const article of articles) {
      expect(sitemapUrls.has(absoluteUrl(getArticlePath(article)))).toBe(true);
      expect(sitemapUrls.has(absoluteUrl(`/learn/${article.category}`))).toBe(true);
    }
  });

  it("includes populated Tax and excludes empty Retirement from the sitemap", () => {
    const sitemapUrls = new Set(buildSitemap().map(({ url }) => url));
    expect(sitemapUrls.has("https://arthasiddhi.com/learn/tax")).toBe(true);
    expect(sitemapUrls.has("https://arthasiddhi.com/learn/retirement")).toBe(false);
  });

  it("has no duplicate calculator routes", () => {
    const routes = Object.values(calculators).map(({ href }) => href);
    expect(new Set(routes).size).toBe(17);
  });

  it("builds .com canonical metadata for every calculator", () => {
    for (const calculator of Object.values(calculators)) {
      const metadata = pageMetadata({ ...calculator.metadata, path: calculator.href });
      expect(metadata.alternates?.canonical).toBe(`https://arthasiddhi.com${calculator.href}`);
      expect(metadata.openGraph).toMatchObject({ url: `https://arthasiddhi.com${calculator.href}` });
      expect(metadata.twitter).toMatchObject({ card: "summary" });
    }
  });
});
