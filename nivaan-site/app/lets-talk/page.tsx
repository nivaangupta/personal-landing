import PageShell from "@/components/arcade/PageShell";
import SiteHeader from "@/components/arcade/SiteHeader";
import SiteFooter from "@/components/arcade/SiteFooter";
import { SOCIALS } from "@/components/arcade/socials";

export default function LetsTalk() {
  return (
    <PageShell maxWidth={1120}>
      <SiteHeader />

      <section
        style={{
          marginTop: 26,
          border: "1px solid #e3e5f2",
          background: "#ffffff",
          boxShadow: "0 1px 3px rgba(20,22,58,0.06)",
          padding: "30px 28px",
        }}
      >
        <h1
          className="mono"
          style={{
            fontSize: 28,
            lineHeight: 1.5,
            margin: 0,
            color: "#14163a",
          }}
        >
          LET&apos;S TALK
        </h1>
        <p
          style={{
            fontSize: 27,
            color: "#383c66",
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
            background: "#ffffff",
            padding: "26px 24px",
            ["--acc" as string]: "#ffcc33",
            ["--acc-hover" as string]: "#fdf6e0",
          }}
        >
          <div
            className="mono"
            style={{ fontSize: 13, color: "#14163a", lineHeight: 1.6 }}
          >
            BOOK A TIME
          </div>
          <p
            style={{
              fontSize: 24,
              color: "#383c66",
              margin: "12px 0 0 0",
              lineHeight: 1.35,
            }}
          >
            Grab a slot on my calendar. Thirty minutes, no agenda required.
          </p>
          <div
            className="mono"
            style={{ fontSize: 9, color: "#8a6400", marginTop: 18 }}
          >
            CAL.COM ↗
          </div>
        </a>

        <a
          href="mailto:nivaangupta29@gmail.com"
          className="contact-card"
          style={{
            background: "#ffffff",
            padding: "26px 24px",
            ["--acc" as string]: "#4de3d4",
            ["--acc-hover" as string]: "#e5faf7",
          }}
        >
          <div
            className="mono"
            style={{ fontSize: 13, color: "#14163a", lineHeight: 1.6 }}
          >
            SEND AN EMAIL
          </div>
          <p
            style={{
              fontSize: 24,
              color: "#383c66",
              margin: "12px 0 0 0",
              lineHeight: 1.35,
            }}
          >
            nivaangupta29@gmail.com — I read everything, I reply to most.
          </p>
          <div
            className="mono"
            style={{ fontSize: 9, color: "#0d7d72", marginTop: 18 }}
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
            color: "#4d5286",
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

      <SiteFooter />
    </PageShell>
  );
}
