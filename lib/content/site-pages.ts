export type SiteLink = { href: string; label: string };

export const primaryLinks: SiteLink[] = [
  { href: "/", label: "Home" },
  { href: "/calculators", label: "Calculators" },
  { href: "/learn", label: "Learn" },
];

export const footerLinkGroups: { title: string; links: SiteLink[] }[] = [
  { title: "Explore", links: primaryLinks },
  {
    title: "Information",
    links: [
      { href: "/about", label: "About" },
      { href: "/editorial-policy", label: "Editorial Policy" },
      { href: "/methodology", label: "Calculator Methodology" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/disclaimer", label: "Financial Disclaimer" },
    ],
  },
];

export const staticSitemapRoutes = [
  "/",
  "/calculators",
  "/learn",
  "/about",
  "/contact",
  "/editorial-policy",
  "/methodology",
  "/privacy",
  "/terms",
  "/disclaimer",
] as const;
