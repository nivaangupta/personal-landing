import PageShell from "@/components/arcade/PageShell";
import SiteHeader from "@/components/arcade/SiteHeader";
import SiteFooter from "@/components/arcade/SiteFooter";

const SOCIALS = [
  { label: "X", href: "https://x.com/nivusd", hb: "#ffffff" },
  { label: "GITHUB", href: "https://github.com/nivaangupta", hb: "#ffffff" },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/nivaangupta/",
    hb: "#4de3d4",
  },
  { label: "NAPX", href: "https://napx.com", hb: "#ffcc33" },
];

export default function LetsTalk() {
  return (
    <PageShell maxWidth={1120}>
      <SiteHeader />

      <section
        style={{
          marginTop: 26,
          border: "4px solid #2a2a52",
          background: "linear-gradient(180deg, #10102a 0%, #0b0b1c 100%)",
          boxShadow: "6px 6px 0 #16163a",
          padding: "30px 28px",
        }}
      >
        <div
          className="mono"
          style={{ fontSize: 9, color: "#ffcc33", letterSpacing: 1 }}
        >
          FINAL LEVEL · CO-OP MODE
        </div>
        <h1
          className="mono"
          style={{
            fontSize: 28,
            lineHeight: 1.5,
            margin: "18px 0 0 0",
            color: "#fff",
            textShadow: "3px 3px 0 #ffcc33",
          }}
        >
          LET&apos;S TALK
        </h1>
        <p
          style={{
            fontSize: 27,
            color: "#a9afe0",
            margin: "18px 0 0 0",
            maxWidth: 720,
          }}
        >
          Happy to chat about ideas, projects, or anything interesting. If
          something here sparked a thought — or you just want to connect — pick
          whichever works best for you.
        </p>
      </section>

      <section
        className="grid-2"
        style={{
          marginTop: 22,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 18,
        }}
      >
        <a
          href="https://cal.com/nivaan/ideation-general-chat"
          target="_blank"
          rel="noreferrer"
          className="contact-card"
          style={{
            background: "#1a1408",
            padding: "26px 24px",
            color: "#ffcc33",
            animation: "glowBtn 2.8s ease-in-out infinite",
            ["--acc" as string]: "#ffcc33",
            ["--acc-sh" as string]: "#7a5c00",
            ["--acc-hover" as string]: "#241c09",
          }}
        >
          <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
            <span style={{ width: 26, height: 18, background: "#ffcc33", display: "block" }} />
            <span style={{ width: 10, height: 18, background: "#7a5c00", display: "block" }} />
          </div>
          <div
            className="mono"
            style={{ fontSize: 13, color: "#fff", lineHeight: 1.6 }}
          >
            BOOK A TIME
          </div>
          <p
            style={{
              fontSize: 24,
              color: "#cdb87d",
              margin: "12px 0 0 0",
              lineHeight: 1.35,
            }}
          >
            Grab a slot on my calendar. Thirty minutes, no agenda required.
          </p>
          <div
            className="mono"
            style={{ fontSize: 9, color: "#ffcc33", marginTop: 18 }}
          >
            CAL.COM ↗
          </div>
        </a>

        <a
          href="mailto:nivaangupta29@gmail.com"
          className="contact-card"
          style={{
            background: "#08201e",
            padding: "26px 24px",
            color: "#4de3d4",
            ["--acc" as string]: "#4de3d4",
            ["--acc-sh" as string]: "#10403c",
            ["--acc-hover" as string]: "#0c2b28",
          }}
        >
          <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
            <span style={{ width: 14, height: 18, background: "#4de3d4", display: "block" }} />
            <span style={{ width: 14, height: 18, background: "#10403c", display: "block" }} />
            <span style={{ width: 14, height: 18, background: "#4de3d4", display: "block" }} />
          </div>
          <div
            className="mono"
            style={{ fontSize: 13, color: "#fff", lineHeight: 1.6 }}
          >
            SEND AN EMAIL
          </div>
          <p
            style={{
              fontSize: 24,
              color: "#86c9c3",
              margin: "12px 0 0 0",
              lineHeight: 1.35,
            }}
          >
            nivaangupta29@gmail.com — I read everything, I reply to most.
          </p>
          <div
            className="mono"
            style={{ fontSize: 9, color: "#4de3d4", marginTop: 18 }}
          >
            COMPOSE ↗
          </div>
        </a>
      </section>

      <section className="cab" style={{ marginTop: 22, padding: 24 }}>
        <div
          className="mono"
          style={{
            fontSize: 9,
            color: "#9aa0d0",
            letterSpacing: 1,
            marginBottom: 18,
          }}
        >
          OTHER CHANNELS
        </div>
        <div
          className="grid-4"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="chip-link"
              style={{ ["--hb" as string]: s.hb }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <SiteFooter right="PLAYER 2 READY" />
    </PageShell>
  );
}
