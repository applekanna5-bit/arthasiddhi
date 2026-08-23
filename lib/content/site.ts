export const siteUrl = "https://arthasiddhi.com";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export const sitePublisher = {
  name: "ArthaSiddhi",
  url: absoluteUrl("/"),
  aboutUrl: absoluteUrl("/about"),
} as const;

export const robotsSitemapUrl = absoluteUrl("/sitemap.xml");
