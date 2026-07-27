export type Social = { label: string; href: string; hb: string };

// Single source of truth for social links across the site.
export const SOCIALS: Social[] = [
  { label: "X", href: "https://x.com/nivusd", hb: "#ffffff" },
  { label: "GITHUB", href: "https://github.com/nivaangupta", hb: "#ffffff" },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/nivaangupta/",
    hb: "#4de3d4",
  },
  { label: "NAPX", href: "https://napx.com", hb: "#ffcc33" },
];
