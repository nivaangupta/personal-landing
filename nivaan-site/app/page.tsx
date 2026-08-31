"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/arcade/PageShell";
import SiteHeader from "@/components/arcade/SiteHeader";
import SiteFooter from "@/components/arcade/SiteFooter";
import PixelAvatar from "@/components/arcade/PixelAvatar";
import PixelSprite, { type Px } from "@/components/arcade/PixelSprite";
import { BULBA, CHAR, SQUIRT, PIKA, PIGEOTTO } from "@/components/arcade/sprites";

const CRIES = [
  "NIVAAN used SHIP IT! It's super effective.",
  "NIVAAN is reading. Do not disturb (much).",
  "NIVAAN wants to talk about autonomous hotels. Again.",
  "NIVAAN woke up at 5am. Attack rose sharply!",
  "Wild ADOPTION PROBLEM appeared. NIVAAN grins.",
];

const LINES: Record<string, string> = {
  none: "Five of these are yours to take. Books that rewired how I think, half-formed thoughts I published anyway, the agent skills I actually run with, lines that move me, and an open invitation to talk.",
  grass:
    "BULBAREAD, the grass type. Slow to level, but every point is permanent. 16 books, honest verdicts, no polite ratings.",
  fire: "CHARTHINK, the fire type. Attacks consensus directly. Data centers are the ENIAC of this century, and prompting is a transitional behaviour.",
  water:
    "SQUIRTALK, the water type. High defence, higher reply rate. Calendar slot or email — both actually reach me.",
  electric:
    "PIKASKILLS, the electric type. Static charge on contact. Skills I built and skills I steal, all runnable, one downloadable.",
  flying:
    "PIGEQUOTE, the flying type. Carries lines that stuck and drops them when you least expect it. Sixty-plus quotes, zero sources tracked.",
};

const mono = "mono";

const infoRow = (label: string, value: string, color: string) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      border: "1px solid #e3e5f2",
      padding: "11px 14px",
      background: "#f6f7fc",
    }}
  >
    <span style={{ fontSize: 21, color: "#6f76ad", letterSpacing: 1 }}>
      {label}
    </span>
    <span style={{ fontSize: 21, color, letterSpacing: 1 }}>{value}</span>
  </div>
);

function StarterCard({
  href,
  onHover,
  onLeave,
  bg,
  accent,
  sprite,
  spriteAnim,
  twinkles,
  name,
  tags,
  desc,
  descColor,
  chooseColor,
}: {
  href: string;
  onHover: () => void;
  onLeave: () => void;
  bg: string;
  accent: string;
  sprite: Px[];
  spriteAnim: string;
  twinkles: { l?: string; r?: string; t: string; s: number; c: string; a: string }[];
  name: string;
  tags: { text: string; bg: string }[];
  desc: string;
  descColor: string;
  chooseColor: string;
}) {
  return (
    <Link
      href={href}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="card-link"
      style={{
        background: bg,
        padding: "22px 18px 20px 18px",
        textAlign: "center",
        ["--acc" as string]: accent,
      }}
    >
      <div
        style={{
          position: "relative",
          height: 118,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {twinkles.map((tw, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: tw.l,
              right: tw.r,
              top: tw.t,
              width: tw.s,
              height: tw.s,
              background: tw.c,
              animation: `twinkle ${tw.a} ease-in-out infinite`,
            }}
          />
        ))}
        <PixelSprite pixels={sprite} size={84} animation={spriteAnim} />
      </div>
      <div
        style={{
          margin: "10px auto 0 auto",
          width: 34,
          height: 34,
          border: "3px solid #0b0b1c",
          borderRadius: "50%",
          background:
            "linear-gradient(180deg, #ff4d4d 0 46%, #0b0b1c 46% 54%, #f4f4f4 54% 100%)",
          position: "relative",
          animation: "ballShake 3.4s ease-in-out infinite",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 10,
            height: 10,
            background: "#f4f4f4",
            border: "2px solid #0b0b1c",
            borderRadius: "50%",
            display: "block",
          }}
        />
      </div>
      <div
        className={mono}
        style={{ fontSize: 11, color: "#fff", lineHeight: 1.7, marginTop: 16 }}
      >
        {name}
      </div>
      <div
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        {tags.map((t) => (
          <span
            key={t.text}
            className={mono}
            style={{
              fontSize: 7,
              color: "#07070f",
              background: t.bg,
              padding: "5px 7px",
            }}
          >
            {t.text}
          </span>
        ))}
      </div>
      <p
        style={{
          fontSize: 21,
          color: descColor,
          margin: "12px 0 0 0",
          lineHeight: 1.35,
        }}
      >
        {desc}
      </p>
      <div
        className={mono}
        style={{ fontSize: 8, color: chooseColor, marginTop: 14 }}
      >
        CHOOSE ▸
      </div>
    </Link>
  );
}

export default function Home() {
  const [pokes, setPokes] = useState(0);
  const [hover, setHover] = useState<string>("none");

  const cry = pokes === 0 ? "Poke me →" : CRIES[(pokes - 1) % CRIES.length];
  const dialog = LINES[hover] ?? LINES.none;

  return (
    <PageShell maxWidth={1120}>
      <SiteHeader />

      {/* hero + profile card */}
      <section
        style={{
          marginTop: 26,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
          gap: 22,
          alignItems: "stretch",
        }}
        className="grid-collapse"
      >
        <div
          style={{
            border: "1px solid #e3e5f2",
            background: "#ffffff",
            padding: "30px 30px 26px 30px",
            boxShadow: "0 1px 3px rgba(20,22,58,0.06)",
          }}
        >
          <h1
            className={mono}
            style={{
              fontSize: 30,
              lineHeight: 1.5,
              margin: 0,
              color: "#14163a",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            BUILDING THE COLLABORATION INFRASTRUCTURE FOR AGENTS AND
            ROBOTS IN HOSPITALITY
          </h1>
          <p
            style={{
              fontSize: 25,
              lineHeight: 1.35,
              margin: "22px 0 0 0",
              color: "#383c66",
            }}
          >
            Cofounder at{" "}
            <a
              href="https://napx.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#8a6400", borderBottom: "1px solid #8a6400" }}
            >
              NapX
            </a>{" "}
            — the orchestration layer for IoT, SaaS, humanoids and AI agents
            inside a property. Currently in stealth.
          </p>
          <div
            style={{
              marginTop: 24,
              borderLeft: "3px solid #4de3d4",
              padding: "6px 0 6px 16px",
            }}
          >
            <p
              style={{ margin: 0, fontSize: 26, lineHeight: 1.25, color: "#20234a" }}
            >
              &quot;When someone tells me I can&apos;t do something,
              that&apos;s when I know what I need to figure out
              next.&quot;
            </p>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: 19,
                color: "#6f76ad",
                letterSpacing: 1,
              }}
            >
              — HOW I PICK WHAT&apos;S NEXT
            </p>
          </div>
          <div
            style={{
              marginTop: 26,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <Link href="/lets-talk" className="btn btn-gold">
              LET&apos;S TALK
            </Link>
            <a
              href="https://napx.com"
              target="_blank"
              rel="noreferrer"
              className="btn btn-teal"
            >
              VISIT NAPX ↗
            </a>
          </div>
        </div>

        {/* profile / trainer card */}
        <div
          className="cab"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="cab-head">TRAINER CARD</div>
          <div
            style={{
              padding: "22px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              flex: 1,
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <PixelAvatar
                size={88}
                className="bob pokeable"
                onClick={() => setPokes((p) => p + 1)}
                title="poke me"
              />
              <div style={{ minWidth: 0 }}>
                <div
                  className={mono}
                  style={{ fontSize: 11, color: "#14163a", lineHeight: 1.6 }}
                >
                  NIVAAN
                </div>
                <div
                  style={{
                    fontSize: 21,
                    color: "#1f7a3f",
                    letterSpacing: 1,
                    marginTop: 6,
                  }}
                >
                  Cofounder, NapX
                </div>
                <div style={{ fontSize: 21, color: "#6f76ad", letterSpacing: 1 }}>
                  Bay Area
                </div>
                <div
                  style={{
                    marginTop: 8,
                    border: "1px solid #ffcc33",
                    background: "#fdf6e0",
                    padding: "6px 8px",
                    fontSize: 19,
                    color: "#8a6400",
                    lineHeight: 1.25,
                  }}
                >
                  {cry}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "auto",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <a
                href="https://x.com/nivusd"
                target="_blank"
                rel="noreferrer"
                className="social-link"
              >
                X
              </a>
              <a
                href="https://github.com/nivaangupta"
                target="_blank"
                rel="noreferrer"
                className="social-link"
              >
                GITHUB
              </a>
              <a
                href="https://www.linkedin.com/in/nivaangupta/"
                target="_blank"
                rel="noreferrer"
                className="social-link"
                style={{ gridColumn: "span 2", ["--hb" as string]: "#4de3d4" }}
              >
                LINKEDIN
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* what I'm building */}
      <section className="cab" style={{ marginTop: 22 }}>
        <div className="cab-head" style={{ color: "#8a6400" }}>
          WHAT I&apos;M BUILDING
        </div>
        <div
          className="grid-collapse"
          style={{
            padding: "26px 24px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: 26,
          }}
        >
          <div>
            <div
              className={mono}
              style={{ fontSize: 18, color: "#14163a", letterSpacing: 2 }}
            >
              NAP×
            </div>
            <p
              style={{
                fontSize: 24,
                lineHeight: 1.4,
                color: "#383c66",
                margin: "14px 0 0 0",
              }}
            >
              Reimagining properties for the agentic era. One infrastructure
              layer that lets every device, system, agent and humanoid in a
              hotel act as one. The hard part was never the tech — it was
              getting people to adopt it.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
            }}
          >
            {infoRow("STATUS", "STEALTH MODE", "#1f7a3f")}
            {infoRow("ROLE", "COFOUNDER", "#8a6400")}
            {infoRow("ORCHESTRATING", "IOT · SAAS · AGENTS", "#0d7d72")}
            {infoRow("BIGGEST CHALLENGE", "LEGACY ADOPTION", "#b8225f")}
          </div>
        </div>
      </section>

      {/* choose a starter */}
      <section
        style={{
          marginTop: 22,
          border: "1px solid #e3e5f2",
          background: "#ffffff",
          boxShadow: "0 1px 3px rgba(20,22,58,0.06)",
          padding: "26px 24px 28px 24px",
        }}
      >
        <span
          className={mono}
          style={{ fontSize: 9, color: "#1f7a3f", letterSpacing: 1 }}
        >
          CHOOSE A STARTER
        </span>

        <div
          style={{
            marginTop: 18,
            border: "1px solid #c7cae8",
            background: "#f6f7fc",
            padding: "18px 20px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 25,
              lineHeight: 1.35,
              color: "#14163a",
              minHeight: 68,
            }}
          >
            {dialog}
          </p>
        </div>

        <div
          className="grid-starters"
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 18,
          }}
        >
          <StarterCard
            href="/book-recommendations"
            onHover={() => setHover("grass")}
            onLeave={() => setHover("none")}
            bg="#0d1a12"
            accent="#6bff8f"
            sprite={BULBA}
            spriteAnim="hop 2.4s ease-in-out infinite"
            twinkles={[
              { l: "12%", t: "6%", s: 8, c: "#6bff8f", a: "2.2s" },
              { r: "14%", t: "22%", s: 6, c: "#ffffff", a: "2.6s" },
            ]}
            name="BULBAREAD"
            tags={[
              { text: "GRASS", bg: "#6bff8f" },
              { text: "LORE", bg: "#4de3d4" },
            ]}
            desc="Book Recommendations. 16 books, honest verdicts, S-to-C tiers. Slow growth, permanent buffs."
            descColor="#8fb79c"
            chooseColor="#6bff8f"
          />
          <StarterCard
            href="/thinking-out-loud"
            onHover={() => setHover("fire")}
            onLeave={() => setHover("none")}
            bg="#1c0f14"
            accent="#ff5f9e"
            sprite={CHAR}
            spriteAnim="wiggle 1.8s ease-in-out infinite"
            twinkles={[
              { l: "14%", t: "14%", s: 6, c: "#ffcc33", a: "2.4s" },
              { r: "10%", t: "4%", s: 8, c: "#ff5f9e", a: "2.8s" },
            ]}
            name="CHARTHINK"
            tags={[
              { text: "FIRE", bg: "#ff8c3a" },
              { text: "TAKES", bg: "#ff5f9e" },
            ]}
            desc="Thinking Out Loud. Compute, robots, the next fifty years. High damage, low patience for consensus."
            descColor="#d1a08f"
            chooseColor="#ff5f9e"
          />
          <StarterCard
            href="/skills"
            onHover={() => setHover("electric")}
            onLeave={() => setHover("none")}
            bg="#221c08"
            accent="#ffcc33"
            sprite={PIKA}
            spriteAnim="wiggle 1.6s ease-in-out infinite"
            twinkles={[
              { l: "10%", t: "8%", s: 8, c: "#ffcc33", a: "2s" },
              { r: "12%", t: "20%", s: 6, c: "#ffffff", a: "2.4s" },
            ]}
            name="PIKASKILLS"
            tags={[
              { text: "ELECTRIC", bg: "#ffcc33" },
              { text: "TOOLS", bg: "#6bff8f" },
            ]}
            desc="Skills. What I've built for running agents, plus what's worth stealing. One is a download."
            descColor="#cdb87d"
            chooseColor="#ffcc33"
          />
          <StarterCard
            href="/quotes"
            onHover={() => setHover("flying")}
            onLeave={() => setHover("none")}
            bg="#1c150a"
            accent="#c99a5b"
            sprite={PIGEOTTO}
            spriteAnim="hop 2.2s ease-in-out infinite"
            twinkles={[
              { l: "10%", t: "10%", s: 8, c: "#c99a5b", a: "2.3s" },
              { r: "12%", t: "22%", s: 6, c: "#ffffff", a: "2.7s" },
            ]}
            name="PIGEQUOTE"
            tags={[
              { text: "FLYING", bg: "#c99a5b" },
              { text: "QUOTES", bg: "#ffcc33" },
            ]}
            desc="Quotes. Sixty-plus lines that stuck, no sources tracked, just what moved me."
            descColor="#c2ad8f"
            chooseColor="#c99a5b"
          />
          <StarterCard
            href="/lets-talk"
            onHover={() => setHover("water")}
            onLeave={() => setHover("none")}
            bg="#0b1622"
            accent="#4de3d4"
            sprite={SQUIRT}
            spriteAnim="hop 2.9s ease-in-out infinite"
            twinkles={[
              { l: "10%", t: "10%", s: 8, c: "#4de3d4", a: "2.5s" },
              { r: "16%", t: "26%", s: 6, c: "#ffffff", a: "2.1s" },
            ]}
            name="SQUIRTALK"
            tags={[
              { text: "WATER", bg: "#4de3d4" },
              { text: "SOCIAL", bg: "#ffcc33" },
            ]}
            desc="Let's Talk. Calendar slot or email, both reach me. Best defence: actually replying to people."
            descColor="#8fabc4"
            chooseColor="#4de3d4"
          />
        </div>
      </section>

      {/* focus areas */}
      <section className="cab" style={{ marginTop: 22, padding: "22px 24px" }}>
        <div
          className={mono}
          style={{
            fontSize: 9,
            color: "#4d5286",
            letterSpacing: 1,
            marginBottom: 18,
          }}
        >
          FOCUS AREAS
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[
            { t: "HOSPITALITY TECH", c: "#4de3d4", b: "#235a56", bg: "#0f2523" },
            { t: "AGENTIC SYSTEMS", c: "#ffcc33", b: "#5c4610", bg: "#241f0c" },
            { t: "ROBOTICS", c: "#ff5f9e", b: "#5c2440", bg: "#250f1b" },
            { t: "GO-TO-MARKET", c: "#6bff8f", b: "#23562f", bg: "#0f2416" },
            { t: "FIRST PRINCIPLES", c: "#4d5286", b: "#e3e5f2", bg: "#f6f7fc" },
            { t: "5AM STARTS", c: "#4d5286", b: "#e3e5f2", bg: "#f6f7fc" },
            { t: "LONG BOOK LISTS", c: "#4d5286", b: "#e3e5f2", bg: "#f6f7fc" },
            { t: "ARGUING WITH DEFAULTS", c: "#4d5286", b: "#e3e5f2", bg: "#f6f7fc" },
          ].map((it) => (
            <span
              key={it.t}
              style={{
                fontSize: 21,
                letterSpacing: 1,
                color: it.c,
                border: `1px solid ${it.b}`,
                background: it.bg,
                padding: "8px 13px",
              }}
            >
              {it.t}
            </span>
          ))}
        </div>
      </section>

      {/* closing CTA */}
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
            GOT SOMETHING TO BUILD?
          </div>
          <p style={{ fontSize: 23, color: "#7a5a1f", margin: "10px 0 0 0" }}>
            Calendar slot or email, both actually reach me.
          </p>
        </div>
        <Link href="/lets-talk" className="btn btn-gold">
          LET&apos;S TALK ▸
        </Link>
      </section>

      <SiteFooter />
      <div style={{ height: 34 }} />
    </PageShell>
  );
}
