"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PixelAvatar from "./PixelAvatar";

const NAV = [
  { label: "BOOKS", href: "/book-recommendations", hb: "#4de3d4" },
  { label: "THINKING OUT LOUD", href: "/thinking-out-loud", hb: "#ff5f9e" },
  { label: "SKILLS", href: "/skills", hb: "#ffcc33" },
];

const headerStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 20,
  alignItems: "center",
  justifyContent: "space-between",
  border: "4px solid #c7cae8",
  background: "#ffffff",
  padding: "14px 18px",
  boxShadow: "6px 6px 0 #b7bce0",
};

export default function SiteHeader({
  variant = "full",
  back,
  backLabel,
}: {
  variant?: "full" | "post";
  back?: string;
  backLabel?: string;
}) {
  const pathname = usePathname();

  return (
    <header style={headerStyle}>
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          color: "#14163a",
        }}
      >
        <PixelAvatar size={variant === "post" ? 44 : 48} className="bob" />
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span className="brand-name">NIVAAN GUPTA</span>
          <span
            className="mono"
            style={{ fontSize: 8, color: "#6b70a0", letterSpacing: 0.5 }}
          >
            Make it exist first, make it good later.
          </span>
        </div>
      </Link>

      {variant === "post" ? (
        <Link
          href={back ?? "/thinking-out-loud"}
          className="nav-link"
          style={{ ["--hb" as string]: "#ff5f9e" }}
        >
          {backLabel ?? "◂ THINKING OUT LOUD"}
        </Link>
      ) : (
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
          }}
        >
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href === "/thinking-out-loud" &&
                pathname.startsWith("/thinking-out-loud"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${active ? " is-active" : ""}`}
                style={{ ["--hb" as string]: item.hb }}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/lets-talk"
            className={`nav-cta${pathname === "/lets-talk" ? " is-active" : ""}`}
          >
            LET&apos;S TALK
          </Link>
        </nav>
      )}
    </header>
  );
}
