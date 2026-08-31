"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PixelAvatar from "./PixelAvatar";
import PixelSprite, { type Px } from "./PixelSprite";
import { BULBA, CHAR, SQUIRT, PIKA, PIGEOTTO } from "./sprites";

const NAV: {
  label: string;
  nickname: string;
  href: string;
  hb: string;
  tint: string;
  sprite: Px[];
}[] = [
  {
    label: "BOOKS",
    nickname: "BULBAREAD",
    href: "/book-recommendations",
    hb: "#6bff8f",
    tint: "#eafcf0",
    sprite: BULBA,
  },
  {
    label: "THINKING OUT LOUD",
    nickname: "CHARTHINK",
    href: "/thinking-out-loud",
    hb: "#ff5f9e",
    tint: "#fdeef3",
    sprite: CHAR,
  },
  {
    label: "SKILLS",
    nickname: "PIKASKILLS",
    href: "/skills",
    hb: "#ffcc33",
    tint: "#fdf6e0",
    sprite: PIKA,
  },
  {
    label: "QUOTES",
    nickname: "PIGEQUOTE",
    href: "/quotes",
    hb: "#c99a5b",
    tint: "#faf3e8",
    sprite: PIGEOTTO,
  },
  {
    label: "LET'S TALK",
    nickname: "SQUIRTALK",
    href: "/lets-talk",
    hb: "#4de3d4",
    tint: "#e5faf7",
    sprite: SQUIRT,
  },
];

const headerStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 20,
  alignItems: "center",
  justifyContent: "space-between",
  border: "1px solid #e3e5f2",
  background: "#ffffff",
  padding: "14px 18px",
  boxShadow: "0 1px 3px rgba(20,22,58,0.06)",
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
          aria-label="Party"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
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
                className={`party-slot${active ? " is-active" : ""}`}
                style={{
                  ["--hb" as string]: item.hb,
                  ["--tint" as string]: item.tint,
                }}
              >
                <span className="party-slot-sprite">
                  <PixelSprite pixels={item.sprite} size={22} />
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span className="mono party-slot-name">
                    {item.nickname}
                  </span>
                  <span className="party-slot-label">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
