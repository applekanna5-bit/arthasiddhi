export const siteUrl = "https://arthasiddhi.com";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
