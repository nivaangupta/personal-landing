import Link from "next/link";

export default function SiteFooter({
  right = "SAVE POINT REACHED",
}: {
  right?: string;
}) {
  return (
    <footer
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 14,
        justifyContent: "space-between",
        alignItems: "center",
        padding: "26px 2px 40px 2px",
      }}
    >
      <Link
        href="/"
        className="mono"
        style={{ fontSize: 8, color: "#9aa0d0" }}
      >
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
    </footer>
  );
}
