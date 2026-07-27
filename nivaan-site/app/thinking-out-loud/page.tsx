import Link from "next/link";
import { getAllPosts } from "@/lib/markdown";
import PageShell from "@/components/arcade/PageShell";
import SiteHeader from "@/components/arcade/SiteHeader";
import SiteFooter from "@/components/arcade/SiteFooter";

function tagColors(accent: string) {
  // pink → deep-pink pill, otherwise teal pill
  if (accent === "#ff5f9e") return { border: "#5c2440", bg: "#250f1b" };
  return { border: "#235a56", bg: "#0f2523" };
}

export default async function ThinkingOutLoud() {
  const posts = getAllPosts();

  return (
    <PageShell maxWidth={1120}>
      <SiteHeader />

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
          style={{ fontSize: 9, color: "#ff5f9e", letterSpacing: 1 }}
        >
          LEVEL 02 · THE BRAIN DUMP
        </div>
        <h1
          className="mono"
          style={{
            fontSize: 26,
            lineHeight: 1.5,
            margin: "18px 0 0 0",
            color: "#fff",
            textShadow: "3px 3px 0 #ff5f9e",
          }}
        >
          THINKING OUT LOUD
        </h1>
        <p style={{ fontSize: 26, color: "#a9afe0", margin: "16px 0 0 0" }}>
          Loosely formed thoughts, published anyway. Mostly about compute,
          robots, and the next fifty years.
        </p>
      </section>

      <section
        style={{
          marginTop: 22,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {posts.map((post) => {
          const accent = post.accent ?? "#4de3d4";
          const pill = tagColors(accent);
          return (
            <Link
              key={post.slug}
              href={`/thinking-out-loud/${post.slug}`}
              className="card-link"
              style={{
                background: "#0d0d1e",
                padding: "26px 24px",
                ["--acc" as string]: accent,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 8,
                    color: accent,
                    border: `2px solid ${pill.border}`,
                    background: pill.bg,
                    padding: "7px 10px",
                  }}
                >
                  {post.category}
                </span>
                <span
                  style={{ fontSize: 21, color: "#6f76ad", letterSpacing: 2 }}
                >
                  {post.date.toUpperCase()}
                </span>
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 15,
                  color: "#fff",
                  lineHeight: 1.7,
                  marginTop: 18,
                }}
              >
                {post.title.toUpperCase()}
              </div>
              <p
                style={{
                  fontSize: 24,
                  lineHeight: 1.4,
                  color: "#a9afe0",
                  margin: "14px 0 0 0",
                }}
              >
                {post.excerpt}
              </p>
              <div
                className="mono"
                style={{ fontSize: 8, color: accent, marginTop: 18 }}
              >
                READ ▸
              </div>
            </Link>
          );
        })}
      </section>

      <SiteFooter right="MORE LOADING" />
    </PageShell>
  );
}
