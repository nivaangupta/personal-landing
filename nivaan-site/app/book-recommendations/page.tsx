import Link from "next/link";
import { getPageContent, type Book } from "@/lib/markdown";
import PageShell from "@/components/arcade/PageShell";
import SiteHeader from "@/components/arcade/SiteHeader";
import SiteFooter from "@/components/arcade/SiteFooter";

type Tier = "S" | "A" | "B" | "C";

const TIERS: Record<Tier, { color: string; border: string; bg: string }> = {
  S: { color: "#6bff8f", border: "#23562f", bg: "#0f2416" },
  A: { color: "#4de3d4", border: "#235a56", bg: "#0f2523" },
  B: { color: "#ffcc33", border: "#5c4610", bg: "#241f0c" },
  C: { color: "#ff5f9e", border: "#5c2440", bg: "#250f1b" },
};

function tierOf(stars: number): Tier {
  if (stars >= 2.5) return "S";
  if (stars >= 1.5) return "A";
  if (stars >= 1) return "B";
  return "C";
}

export default async function BookRecommendations() {
  const { data } = await getPageContent("book-recommendations");
  const books = ((data.books ?? []) as Book[])
    .map((b) => ({ ...b, tier: tierOf(b.stars) }))
    .sort((a, b) => b.stars - a.stars);

  const counts: Record<Tier, number> = { S: 0, A: 0, B: 0, C: 0 };
  books.forEach((b) => (counts[b.tier] += 1));

  return (
    <PageShell maxWidth={1120}>
      <SiteHeader />

      {/* hero */}
      <section
        style={{
          marginTop: 26,
          border: "4px solid #2a2a52",
          background: "linear-gradient(180deg, #10102a 0%, #0b0b1c 100%)",
          boxShadow: "6px 6px 0 #16163a",
          padding: "28px 26px",
        }}
      >
        <div
          className="mono"
          style={{ fontSize: 9, color: "#4de3d4", letterSpacing: 1 }}
        >
          LEVEL 01 · THE LIBRARY
        </div>
        <h1
          className="mono"
          style={{
            fontSize: 26,
            lineHeight: 1.5,
            margin: "18px 0 0 0",
            color: "#fff",
            textShadow: "3px 3px 0 #4de3d4",
          }}
        >
          BOOK RECOMMENDATIONS
        </h1>
        <p style={{ fontSize: 26, color: "#a9afe0", margin: "16px 0 0 0" }}>
          Books that changed how I think. Honest verdicts — including the ones
          that didn&apos;t land.
        </p>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {(["S", "A", "B", "C"] as Tier[]).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 19,
                letterSpacing: 1,
                color: TIERS[t].color,
                border: `2px solid ${TIERS[t].border}`,
                background: TIERS[t].bg,
                padding: "7px 12px",
              }}
            >
              {t}-TIER · {counts[t]}
            </span>
          ))}
          <span
            style={{
              fontSize: 19,
              letterSpacing: 1,
              color: "#6f76ad",
              border: "2px solid #2a2a52",
              background: "#101024",
              padding: "7px 12px",
            }}
          >
            {books.length} TOTAL
          </span>
        </div>
      </section>

      {/* book grid */}
      <section
        className="grid-2"
        style={{
          marginTop: 22,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 18,
        }}
      >
        {books.map((book, i) => {
          const tier = TIERS[book.tier];
          return (
            <article key={book.title} className="cab">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  background: "#16163a",
                  padding: "10px 14px",
                }}
              >
                <span className="mono" style={{ fontSize: 9, color: "#fff" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="mono"
                  style={{ fontSize: 9, color: tier.color }}
                >
                  {book.tier}-TIER
                </span>
              </div>
              <div style={{ padding: 20 }}>
                <div
                  className="mono"
                  style={{ fontSize: 12, color: "#fff", lineHeight: 1.6 }}
                >
                  {book.title.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 21,
                    color: "#6f76ad",
                    letterSpacing: 1,
                    marginTop: 8,
                  }}
                >
                  {book.author.toUpperCase()}
                </div>
                <p
                  style={{
                    fontSize: 23,
                    lineHeight: 1.4,
                    color: "#a9afe0",
                    margin: "14px 0 0 0",
                  }}
                >
                  {book.note}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      {/* recommend CTA */}
      <section
        style={{
          marginTop: 22,
          border: "4px solid #ffcc33",
          background: "#1a1408",
          boxShadow: "6px 6px 0 #4a3a09",
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
            style={{ fontSize: 11, color: "#ffcc33", lineHeight: 1.6 }}
          >
            GOT ONE I SHOULD READ?
          </div>
          <p style={{ fontSize: 23, color: "#cdb87d", margin: "10px 0 0 0" }}>
            Send it over. I read most things people bother to recommend.
          </p>
        </div>
        <Link href="/lets-talk" className="btn btn-gold">
          LET&apos;S TALK ▸
        </Link>
      </section>

      <SiteFooter right="SAVE POINT REACHED" />
    </PageShell>
  );
}
