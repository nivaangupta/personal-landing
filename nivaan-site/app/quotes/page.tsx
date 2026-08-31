import Link from "next/link";
import { getPageContent } from "@/lib/markdown";
import PageShell from "@/components/arcade/PageShell";
import SiteHeader from "@/components/arcade/SiteHeader";
import SiteFooter from "@/components/arcade/SiteFooter";

type Category = { name: string; lines: string[] };

const ACCENTS = [
  { bg: "#4de3d4", ink: "#0d7d72" },
  { bg: "#ff5f9e", ink: "#b8225f" },
  { bg: "#ffcc33", ink: "#8a6400" },
  { bg: "#6bff8f", ink: "#1f7a3f" },
];

export default async function Quotes() {
  const { data } = await getPageContent("quotes");
  const categories = (data.categories ?? []) as Category[];
  const total = categories.reduce((sum, c) => sum + c.lines.length, 0);

  return (
    <PageShell maxWidth={1120}>
      <SiteHeader />

      {/* hero */}
      <section
        style={{
          marginTop: 26,
          border: "1px solid #e3e5f2",
          background: "#ffffff",
          boxShadow: "0 1px 3px rgba(20,22,58,0.06)",
          padding: "28px 26px",
        }}
      >
        <h1
          className="mono"
          style={{
            fontSize: 26,
            lineHeight: 1.5,
            margin: 0,
            color: "#14163a",
          }}
        >
          QUOTES
        </h1>
        <p style={{ fontSize: 26, color: "#383c66", margin: "16px 0 0 0" }}>
          Lines that move me. Collected, not always sourced — just what
          stuck.
        </p>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 19,
              letterSpacing: 1,
              color: "#6f76ad",
              border: "1px solid #e3e5f2",
              background: "#f6f7fc",
              padding: "7px 12px",
            }}
          >
            {total} QUOTES
          </span>
        </div>
      </section>

      {/* quote wall, grouped by category */}
      {categories.map((cat, ci) => {
        const accent = ACCENTS[ci % ACCENTS.length];
        return (
          <section key={cat.name} style={{ marginTop: 22 }}>
            <div
              className="mono"
              style={{
                fontSize: 9,
                color: accent.ink,
                letterSpacing: 1,
                marginBottom: 14,
              }}
            >
              {cat.name.toUpperCase()}
            </div>
            <div
              className="grid-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 18,
              }}
            >
              {cat.lines.map((q, i) => (
                <div
                  key={i}
                  className="cab"
                  style={{
                    borderLeft: `4px solid ${accent.bg}`,
                    padding: "20px 22px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 23,
                      lineHeight: 1.45,
                      color: "#14163a",
                      margin: 0,
                    }}
                  >
                    &quot;{q}&quot;
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* recommend CTA */}
      <section
        style={{
          marginTop: 22,
          border: "1px solid #ffcc33",
          background: "#fdf6e0",
          boxShadow: "0 1px 3px rgba(122,90,9,0.12)",
          padding: "24px 26px",
          display: "flex",
          flexWrap: "wrap",
          gap: 18,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            className="mono"
            style={{ fontSize: 11, color: "#8a6400", lineHeight: 1.6 }}
          >
            GOT ONE I SHOULD KNOW?
          </div>
          <p style={{ fontSize: 23, color: "#7a5a1f", margin: "10px 0 0 0" }}>
            Send it over. Always collecting lines worth keeping.
          </p>
        </div>
        <Link href="/lets-talk" className="btn btn-gold">
          LET&apos;S TALK ▸
        </Link>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
