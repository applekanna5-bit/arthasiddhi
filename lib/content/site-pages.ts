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
  "/calculators/home-loan",
  "/calculators/car-loan",
  "/calculators/personal-loan",
  "/calculators/sip",
  "/calculators/fd",
  "/learn",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
] as const;
