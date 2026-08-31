import Link from "next/link";
import { SOCIALS } from "./socials";

export default function SiteFooter() {
  return (
    <footer
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "26px 2px 40px 2px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
        }}
      >
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="footer-social"
            style={{ ["--hb" as string]: s.hb }}
          >
            {s.label}
          </a>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="/" className="mono" style={{ fontSize: 8, color: "#6b70a0" }}>
          ◂ HOME
        </Link>
        <span className="mono" style={{ fontSize: 8, color: "#43497a" }}>
          © 2026 NIVAAN GUPTA
        </span>
      </div>
    </footer>
  );
}
