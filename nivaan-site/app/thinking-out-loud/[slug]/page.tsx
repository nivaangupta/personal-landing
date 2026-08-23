import Link from "next/link";
import { getPost, getAllPosts } from "@/lib/markdown";
import { notFound } from "next/navigation";
import PageShell from "@/components/arcade/PageShell";
import SiteHeader from "@/components/arcade/SiteHeader";
import SiteFooter from "@/components/arcade/SiteFooter";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

const PILL_COLORS: Record<string, { border: string; bg: string }> = {
  "#ff5f9e": { border: "#5c2440", bg: "#250f1b" },
  "#4de3d4": { border: "#235a56", bg: "#0f2523" },
  "#ffcc33": { border: "#5c4610", bg: "#241f0c" },
  "#6bff8f": { border: "#23562f", bg: "#0f2416" },
};

function pill(accent: string) {
  return PILL_COLORS[accent] ?? PILL_COLORS["#4de3d4"];
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await getPost(slug);
  } catch {
    notFound();
  }

  const all = getAllPosts();
  const idx = all.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const accent = post.accent ?? "#4de3d4";
  const p = pill(accent);

  return (
    <PageShell maxWidth={900}>
      <SiteHeader variant="post" />

      <article
        style={{
          marginTop: 26,
          border: "4px solid #c7cae8",
          background: "#ffffff",
          boxShadow: "6px 6px 0 #b7bce0",
          padding: "32px 30px 34px 30px",
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
              border: `2px solid ${p.border}`,
              background: p.bg,
              padding: "7px 10px",
            }}
          >
            {post.category}
          </span>
          <span style={{ fontSize: 21, color: "#6f76ad", letterSpacing: 2 }}>
            {post.date.toUpperCase()}
          </span>
        </div>

        <h1
          className="mono"
          style={{
            fontSize: 22,
            lineHeight: 1.65,
            margin: "20px 0 26px 0",
            color: "#14163a",
            textShadow: `3px 3px 0 ${accent}`,
          }}
        >
          {post.title.toUpperCase()}
        </h1>

        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div style={{ marginTop: 24 }}>
          <Link href="/lets-talk" className="btn btn-gold">
            LET&apos;S TALK ▸
          </Link>
        </div>
      </article>

      {(prev || next) && (
        <section style={{ marginTop: 22 }}>
          {next && (
            <Link
              href={`/thinking-out-loud/${next.slug}`}
              className="card-link"
              style={{
                background: "#ffffff",
                padding: "22px 24px",
                ["--acc" as string]: next.accent ?? "#ff5f9e",
              }}
            >
              <div className="mono" style={{ fontSize: 8, color: "#6f76ad" }}>
                NEXT ▸
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 13,
                  color: "#14163a",
                  lineHeight: 1.7,
                  marginTop: 12,
                }}
              >
                {next.title.toUpperCase()}
              </div>
            </Link>
          )}
          {prev && (
            <Link
              href={`/thinking-out-loud/${prev.slug}`}
              className="card-link"
              style={{
                background: "#ffffff",
                padding: "22px 24px",
                ["--acc" as string]: prev.accent ?? "#4de3d4",
              }}
            >
              <div className="mono" style={{ fontSize: 8, color: "#6f76ad" }}>
                ◂ PREVIOUS
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 13,
                  color: "#14163a",
                  lineHeight: 1.7,
                  marginTop: 12,
                }}
              >
                {prev.title.toUpperCase()}
              </div>
            </Link>
          )}
        </section>
      )}

      <SiteFooter right="END OF LOG" />
    </PageShell>
  );
}
