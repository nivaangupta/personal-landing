import Link from "next/link";
import { SOCIALS } from "./socials";

export default function SiteFooter({
  right = "SAVE POINT REACHED",
}: {
  right?: string;
}) {
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
        <Link href="/" className="mono" style={{ fontSize: 8, color: "#9aa0d0" }}>
          ◂ BACK TO START SCREEN
        </Link>
        <span className="mono" style={{ fontSize: 8, color: "#43497a" }}>
          {right}
          <span
            style={{ color: "#ffcc33", animation: "caret 1s steps(1) infinite" }}
          >
            _
          </span>
        </span>
      </div>
    </footer>
  );
}
