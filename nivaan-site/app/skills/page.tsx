import Link from "next/link";
import {
  getPageContent,
  type RecommendedSkill,
  type OwnSkill,
} from "@/lib/markdown";
import PageShell from "@/components/arcade/PageShell";
import SiteHeader from "@/components/arcade/SiteHeader";
import SiteFooter from "@/components/arcade/SiteFooter";

export default async function Skills() {
  const { data } = await getPageContent("skills");
  const recommended = (data.recommended ?? []) as RecommendedSkill[];
  const mine = (data.mine ?? []) as OwnSkill[];
  const recommendedIntro = (data.recommendedIntro ?? "") as string;

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
          style={{ fontSize: 9, color: "#ffcc33", letterSpacing: 1 }}
        >
          LEVEL 03 · THE WORKSHOP
        </div>
        <h1
          className="mono"
          style={{
            fontSize: 26,
            lineHeight: 1.5,
            margin: "18px 0 0 0",
            color: "#fff",
            textShadow: "3px 3px 0 #ffcc33",
          }}
        >
          SKILLS
        </h1>
        <p style={{ fontSize: 26, color: "#a9afe0", margin: "16px 0 0 0" }}>
          Tools I use and build for getting more out of AI coding agents.
          Some I made myself, some I just think are worth stealing.
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
              color: "#6bff8f",
              border: "2px solid #23562f",
              background: "#0f2416",
              padding: "7px 12px",
            }}
          >
            {mine.length} MADE BY ME
          </span>
          <span
            style={{
              fontSize: 19,
              letterSpacing: 1,
              color: "#4de3d4",
              border: "2px solid #235a56",
              background: "#0f2523",
              padding: "7px 12px",
            }}
          >
            {recommended.length} RECOMMENDED
          </span>
        </div>
      </section>

      {/* skills made by me */}
      <section style={{ marginTop: 22 }}>
        <div
          className="mono"
          style={{
            fontSize: 9,
            color: "#6bff8f",
            letterSpacing: 1,
            marginBottom: 14,
          }}
        >
          ★ SKILLS MADE BY ME
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {mine.map((skill) => (
            <article
              key={skill.name}
              className="cab"
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  background: "#16163a",
                  padding: "10px 14px",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: 9, color: "#fff", letterSpacing: 1 }}
                >
                  {skill.name}
                </span>
                <span
                  className="mono"
                  style={{ fontSize: 9, color: "#6bff8f" }}
                >
                  ORIGINAL
                </span>
              </div>
              <div style={{ padding: 20 }}>
                <p
                  style={{
                    fontSize: 25,
                    lineHeight: 1.4,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  {skill.tagline}
                </p>

                <div
                  style={{
                    marginTop: 18,
                    borderLeft: "4px solid #ff5f9e",
                    padding: "2px 0 2px 14px",
                  }}
                >
                  <div
                    className="mono"
                    style={{ fontSize: 8, color: "#ff5f9e", letterSpacing: 1 }}
                  >
                    THE PROBLEM
                  </div>
                  <p
                    style={{
                      fontSize: 22,
                      lineHeight: 1.45,
                      color: "#a9afe0",
                      margin: "8px 0 0 0",
                    }}
                  >
                    {skill.problem}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 18,
                    borderLeft: "4px solid #4de3d4",
                    padding: "2px 0 2px 14px",
                  }}
                >
                  <div
                    className="mono"
                    style={{ fontSize: 8, color: "#4de3d4", letterSpacing: 1 }}
                  >
                    THE APPROACH
                  </div>
                  <p
                    style={{
                      fontSize: 22,
                      lineHeight: 1.45,
                      color: "#a9afe0",
                      margin: "8px 0 0 0",
                    }}
                  >
                    {skill.approach}
                  </p>
                </div>

                {skill.mechanics.length > 0 && (
                  <div
                    style={{
                      marginTop: 18,
                      borderLeft: "4px solid #ffcc33",
                      padding: "2px 0 2px 14px",
                    }}
                  >
                    <div
                      className="mono"
                      style={{
                        fontSize: 8,
                        color: "#ffcc33",
                        letterSpacing: 1,
                      }}
                    >
                      HOW IT WORKS
                    </div>
                    <ul
                      style={{
                        margin: "8px 0 0 0",
                        padding: "0 0 0 18px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {skill.mechanics.map((m, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: 22,
                            lineHeight: 1.45,
                            color: "#a9afe0",
                          }}
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {skill.file && (
                  <a
                    href={skill.file}
                    download
                    className="btn btn-teal"
                    style={{
                      display: "inline-block",
                      marginTop: 20,
                      fontSize: 10,
                    }}
                  >
                    ⬇ DOWNLOAD SKILL.MD
                  </a>
                )}
              </div>
            </article>
          ))}
          {mine.length === 0 && (
            <div
              className="cab"
              style={{
                padding: "26px 24px",
                fontSize: 22,
                color: "#6f76ad",
                textAlign: "center",
              }}
            >
              Nothing shipped yet. Check back soon.
            </div>
          )}
        </div>
      </section>

      {/* recommended skills */}
      <section style={{ marginTop: 22 }}>
        <div
          className="mono"
          style={{
            fontSize: 9,
            color: "#4de3d4",
            letterSpacing: 1,
            marginBottom: 14,
          }}
        >
          ◆ RECOMMENDED SKILLS
        </div>
        {recommendedIntro && (
          <p
            style={{
              fontSize: 23,
              lineHeight: 1.4,
              color: "#a9afe0",
              margin: "0 0 16px 0",
            }}
          >
            {recommendedIntro}
          </p>
        )}
        {recommended.length > 0 ? (
          <div
            className="grid-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 18,
            }}
          >
            {recommended.map((skill) => (
              <article key={skill.name} className="cab">
                <div style={{ padding: 20 }}>
                  <div
                    className="mono"
                    style={{ fontSize: 12, color: "#fff", lineHeight: 1.6 }}
                  >
                    {skill.name.toUpperCase()}
                  </div>
                  {skill.author && (
                    <div
                      style={{
                        fontSize: 21,
                        color: "#6f76ad",
                        letterSpacing: 1,
                        marginTop: 8,
                      }}
                    >
                      {skill.author.toUpperCase()}
                    </div>
                  )}
                  <p
                    style={{
                      fontSize: 23,
                      lineHeight: 1.4,
                      color: "#a9afe0",
                      margin: "14px 0 0 0",
                    }}
                  >
                    {skill.blurb}
                  </p>
                  {skill.url && (
                    <a
                      href={skill.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mono"
                      style={{
                        display: "inline-block",
                        marginTop: 14,
                        fontSize: 9,
                        color: "#4de3d4",
                      }}
                    >
                      VIEW ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            className="cab"
            style={{
              padding: "26px 24px",
              fontSize: 22,
              color: "#6f76ad",
              textAlign: "center",
            }}
          >
            Queue&apos;s empty. Send over a skill worth trying and it&apos;ll
            land here.
          </div>
        )}
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
            GOT A SKILL I SHOULD TRY?
          </div>
          <p style={{ fontSize: 23, color: "#cdb87d", margin: "10px 0 0 0" }}>
            Send it over. Always looking for better ways to run agents.
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
