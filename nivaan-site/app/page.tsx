"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/arcade/PageShell";
import SiteHeader from "@/components/arcade/SiteHeader";
import PixelAvatar from "@/components/arcade/PixelAvatar";
import PixelSprite, { type Px } from "@/components/arcade/PixelSprite";

const BULBA: Px[] = [
  [18.75, 0, 18.75, 12.5, "#6bff8f"],
  [62.5, 0, 18.75, 12.5, "#4bd96f"],
  [43.75, 6.25, 12.5, 12.5, "#2f7a45"],
  [25, 18.75, 50, 6.25, "#4fd97a"],
  [12.5, 25, 75, 50, "#4fd97a"],
  [25, 31.25, 12.5, 12.5, "#10331f"],
  [62.5, 31.25, 12.5, 12.5, "#10331f"],
  [28.125, 34.375, 6.25, 6.25, "#ffffff"],
  [65.625, 34.375, 6.25, 6.25, "#ffffff"],
  [43.75, 50, 12.5, 6.25, "#10331f"],
  [18.75, 62.5, 12.5, 12.5, "#2f7a45"],
  [68.75, 62.5, 12.5, 12.5, "#2f7a45"],
  [25, 75, 18.75, 12.5, "#2f7a45"],
  [56.25, 75, 18.75, 12.5, "#2f7a45"],
];

const CHAR: Px[] = [
  [81.25, 6.25, 12.5, 12.5, "#ffcc33"],
  [75, 18.75, 12.5, 12.5, "#ff8c3a"],
  [68.75, 31.25, 12.5, 12.5, "#ff5f9e"],
  [18.75, 12.5, 43.75, 12.5, "#ff8c3a"],
  [12.5, 25, 56.25, 37.5, "#ff8c3a"],
  [25, 31.25, 12.5, 12.5, "#2b1008"],
  [50, 31.25, 12.5, 12.5, "#2b1008"],
  [28.125, 34.375, 6.25, 6.25, "#ffffff"],
  [53.125, 34.375, 6.25, 6.25, "#ffffff"],
  [31.25, 50, 25, 6.25, "#2b1008"],
  [18.75, 62.5, 43.75, 12.5, "#ffcc33"],
  [18.75, 75, 12.5, 12.5, "#d9662a"],
  [50, 75, 12.5, 12.5, "#d9662a"],
];

const SQUIRT: Px[] = [
  [25, 6.25, 50, 12.5, "#4de3d4"],
  [18.75, 18.75, 62.5, 25, "#4de3d4"],
  [28.125, 25, 12.5, 12.5, "#062a33"],
  [59.375, 25, 12.5, 12.5, "#062a33"],
  [31.25, 28.125, 6.25, 6.25, "#ffffff"],
  [62.5, 28.125, 6.25, 6.25, "#ffffff"],
  [43.75, 37.5, 12.5, 6.25, "#062a33"],
  [12.5, 43.75, 75, 31.25, "#2b6fd4"],
  [25, 50, 50, 18.75, "#a9762f"],
  [37.5, 56.25, 25, 6.25, "#d69a4a"],
  [6.25, 50, 6.25, 12.5, "#4de3d4"],
  [87.5, 50, 6.25, 12.5, "#4de3d4"],
  [25, 75, 18.75, 12.5, "#4de3d4"],
  [56.25, 75, 18.75, 12.5, "#4de3d4"],
];

const CRIES = [
  "NIVAAN used SHIP IT! It's super effective.",
  "NIVAAN is reading. Do not disturb (much).",
  "NIVAAN wants to talk about autonomous hotels. Again.",
  "NIVAAN woke up at 5am. Attack rose sharply!",
  "Wild ADOPTION PROBLEM appeared. NIVAAN grins.",
];

const LINES: Record<string, string> = {
  none: "PROF. OAK: Nivaan! Three of these are yours to take. Books that rewired how I think, half-formed thoughts I published anyway, and an open invitation to talk. Pick one — or be greedy, take all three.",
  grass:
    "BULBAREAD, the grass type. Slow to level, but every point is permanent. 16 books, honest verdicts, no polite ratings.",
  fire: "CHARTHINK, the fire type. Attacks consensus directly. Data centers are the ENIAC of this century, and prompting is a transitional behaviour.",
  water:
    "SQUIRTALK, the water type. High defence, higher reply rate. Calendar slot or email — both actually reach me.",
};

const mono = "mono";
const DRIFTS = [
  { l: "8%", t: "60%", s: 8, c: "#4de3d4", d: "9s", delay: "0s" },
  { l: "22%", t: "80%", s: 6, c: "#ff5f9e", d: "13s", delay: "2s" },
  { l: "41%", t: "70%", s: 10, c: "#ffcc33", d: "11s", delay: "4s" },
  { l: "63%", t: "88%", s: 6, c: "#6bff8f", d: "15s", delay: "1s" },
  { l: "79%", t: "66%", s: 8, c: "#4de3d4", d: "10s", delay: "6s" },
  { l: "91%", t: "84%", s: 6, c: "#ffcc33", d: "14s", delay: "3s" },
];

const infoRow = (label: string, value: string, color: string) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      border: "2px solid #2a2a52",
      padding: "11px 14px",
      background: "#101024",
    }}
  >
    <span style={{ fontSize: 21, color: "#6f76ad", letterSpacing: 1 }}>
      {label}
    </span>
    <span style={{ fontSize: 21, color, letterSpacing: 1 }}>{value}</span>
  </div>
);

function StatBar({
  label,
  value,
  pct,
  from,
  to,
  delay,
}: {
  label: string;
  value: string;
  pct: number;
  from: string;
  to: string;
  delay: string;
}) {
  return (
    <div>
      <div
        className={mono}
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 8,
          color: "#9aa0d0",
          marginBottom: 6,
        }}
      >
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div
        style={{ height: 14, background: "#131331", border: "2px solid #2a2a52" }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `repeating-linear-gradient(90deg, ${from} 0 6px, ${to} 6px 12px)`,
            animation: `barGrow ${delay} ease-out`,
          }}
        />
      </div>
    </div>
  );
}

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
    <>
      {/* drifting pixel dust */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {DRIFTS.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.l,
              top: d.t,
              width: d.s,
              height: d.s,
              background: d.c,
              animation: `drift ${d.d} linear infinite ${d.delay}`,
            }}
          />
        ))}
      </div>

      <PageShell maxWidth={1120}>
        <SiteHeader />

        {/* hero + trainer card */}
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
              border: "4px solid #2a2a52",
              background: "linear-gradient(180deg, #10102a 0%, #0b0b1c 100%)",
              padding: "30px 30px 26px 30px",
              boxShadow: "6px 6px 0 #16163a",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -30,
                top: -30,
                width: 160,
                height: 160,
                background:
                  "repeating-linear-gradient(45deg, #16163a 0 8px, transparent 8px 16px)",
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{ width: 10, height: 10, background: "#6bff8f", display: "block" }}
              />
              <span
                className={mono}
                style={{ fontSize: 9, color: "#6bff8f", letterSpacing: 1 }}
              >
                PLAYER 1 &nbsp;·&nbsp; ONLINE
              </span>
            </div>
            <h1
              className={mono}
              style={{
                position: "relative",
                fontSize: 30,
                lineHeight: 1.5,
                margin: "20px 0 0 0",
                color: "#fff",
                textShadow: "3px 3px 0 #ff5f9e, 6px 6px 0 rgba(77,227,212,0.35)",
              }}
            >
              BUILDING THE INFRASTRUCTURE LAYER FOR AUTONOMOUS HOTELS
            </h1>
            <p
              style={{
                position: "relative",
                fontSize: 25,
                lineHeight: 1.35,
                margin: "22px 0 0 0",
                color: "#a9afe0",
              }}
            >
              Cofounder at{" "}
              <a
                href="https://napx.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#ffcc33", borderBottom: "3px solid #ffcc33" }}
              >
                NapX
              </a>{" "}
              — the orchestration layer for IoT, SaaS, humanoids and AI agents
              inside a property. Currently in stealth.
            </p>
            <div
              style={{
                position: "relative",
                marginTop: 24,
                borderLeft: "6px solid #4de3d4",
                padding: "6px 0 6px 16px",
              }}
            >
              <p
                style={{ margin: 0, fontSize: 26, lineHeight: 1.25, color: "#e6e8ff" }}
              >
                &quot;Better tools exist. Adoption doesn&apos;t.&quot;
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 19,
                  color: "#6f76ad",
                  letterSpacing: 1,
                }}
              >
                — THE PROBLEM I KEEP CHASING
              </p>
            </div>
            <div
              style={{
                position: "relative",
                marginTop: 26,
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <Link href="/lets-talk" className="btn btn-gold glow">
                ▶ PRESS START
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

          {/* trainer card */}
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
                    style={{ fontSize: 11, color: "#fff", lineHeight: 1.6 }}
                  >
                    NIVAAN
                  </div>
                  <div
                    style={{
                      fontSize: 21,
                      color: "#6bff8f",
                      letterSpacing: 1,
                      marginTop: 6,
                    }}
                  >
                    CLASS: COFOUNDER
                  </div>
                  <div style={{ fontSize: 21, color: "#6f76ad", letterSpacing: 1 }}>
                    GUILD: NAPX INC.
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      border: "2px solid #ffcc33",
                      background: "#1a1408",
                      padding: "6px 8px",
                      fontSize: 19,
                      color: "#ffcc33",
                      lineHeight: 1.25,
                    }}
                  >
                    {cry}
                  </div>
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <StatBar
                  label="SHIPPING"
                  value="92"
                  pct={92}
                  from="#6bff8f"
                  to="#4bd96f"
                  delay="1.4s"
                />
                <StatBar
                  label="READING"
                  value="84"
                  pct={84}
                  from="#4de3d4"
                  to="#35b3a7"
                  delay="1.7s"
                />
                <StatBar
                  label="PATIENCE FOR STATUS QUO"
                  value="07"
                  pct={7}
                  from="#ff5f9e"
                  to="#cc3f78"
                  delay="2s"
                />
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

        {/* current quest */}
        <section className="cab" style={{ marginTop: 22 }}>
          <div className="cab-head" style={{ color: "#ffcc33" }}>
            ★ CURRENT QUEST
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
                style={{ fontSize: 18, color: "#fff", letterSpacing: 2 }}
              >
                NAP×
              </div>
              <p
                style={{
                  fontSize: 24,
                  lineHeight: 1.4,
                  color: "#a9afe0",
                  margin: "14px 0 0 0",
                }}
              >
                Reimagining properties for the agentic era. One infrastructure
                layer that lets every device, system, agent and humanoid in a
                hotel act as one. The hard part was never the tech — it was
                getting people to adopt it. That&apos;s the whole game.
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
              {infoRow("STATUS", "STEALTH MODE", "#6bff8f")}
              {infoRow("ROLE", "COFOUNDER", "#ffcc33")}
              {infoRow("ORCHESTRATING", "IOT · SAAS · AGENTS", "#4de3d4")}
              {infoRow("BOSS FIGHT", "LEGACY ADOPTION", "#ff5f9e")}
            </div>
          </div>
        </section>

        {/* choose your starter */}
        <section
          style={{
            marginTop: 22,
            border: "4px solid #2a2a52",
            background: "linear-gradient(180deg, #101a2e 0%, #0a0e1c 100%)",
            boxShadow: "6px 6px 0 #16163a",
            padding: "26px 24px 28px 24px",
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
              className={mono}
              style={{ fontSize: 9, color: "#6bff8f", letterSpacing: 1 }}
            >
              OAK&apos;S LAB · CHOOSE YOUR STARTER
            </span>
            <span style={{ fontSize: 21, color: "#6f76ad", letterSpacing: 1 }}>
              3 AVAILABLE · PICK ANY · TAKE ALL THREE
            </span>
          </div>

          <div
            style={{
              marginTop: 18,
              border: "4px solid #ffffff",
              background: "#101024",
              padding: "18px 20px",
              position: "relative",
              boxShadow: "inset 0 0 0 3px #2a2a52",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 25,
                lineHeight: 1.35,
                color: "#fff",
                minHeight: 68,
              }}
            >
              {dialog}
            </p>
            <span
              className={mono}
              style={{
                position: "absolute",
                right: 14,
                bottom: 10,
                fontSize: 10,
                color: "#ffcc33",
                animation: "arrowBob 0.9s ease-in-out infinite",
              }}
            >
              ▼
            </span>
          </div>

          <div
            className="grid-starters"
            style={{
              marginTop: 22,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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

        {/* bag / inventory */}
        <section className="cab" style={{ marginTop: 22, padding: "22px 24px" }}>
          <div
            className={mono}
            style={{
              fontSize: 9,
              color: "#9aa0d0",
              letterSpacing: 1,
              marginBottom: 18,
            }}
          >
            BAG · INVENTORY
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { t: "HOSPITALITY TECH", c: "#4de3d4", b: "#235a56", bg: "#0f2523" },
              { t: "AGENTIC SYSTEMS", c: "#ffcc33", b: "#5c4610", bg: "#241f0c" },
              { t: "ROBOTICS", c: "#ff5f9e", b: "#5c2440", bg: "#250f1b" },
              { t: "GO-TO-MARKET", c: "#6bff8f", b: "#23562f", bg: "#0f2416" },
              { t: "FIRST PRINCIPLES", c: "#9aa0d0", b: "#2a2a52", bg: "#101024" },
              { t: "5AM STARTS", c: "#9aa0d0", b: "#2a2a52", bg: "#101024" },
              { t: "LONG BOOK LISTS", c: "#9aa0d0", b: "#2a2a52", bg: "#101024" },
              { t: "ARGUING WITH DEFAULTS", c: "#9aa0d0", b: "#2a2a52", bg: "#101024" },
            ].map((it) => (
              <span
                key={it.t}
                style={{
                  fontSize: 21,
                  letterSpacing: 1,
                  color: it.c,
                  border: `2px solid ${it.b}`,
                  background: it.bg,
                  padding: "8px 13px",
                }}
              >
                {it.t}
              </span>
            ))}
          </div>
        </section>

        {/* marquee */}
        <div
          style={{
            marginTop: 22,
            border: "4px solid #2a2a52",
            background: "#101024",
            overflow: "hidden",
            boxShadow: "6px 6px 0 #16163a",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "max-content",
              animation: "marquee 26s linear infinite",
            }}
          >
            {[0, 1].map((k) => (
              <div
                key={k}
                className={mono}
                style={{
                  display: "flex",
                  gap: 34,
                  padding: "12px 17px",
                  fontSize: 9,
                  color: "#6f76ad",
                  whiteSpace: "nowrap",
                }}
              >
                <span>NAPX · STEALTH MODE</span>
                <span style={{ color: "#ffcc33" }}>★</span>
                <span>BETTER TOOLS EXIST. ADOPTION DOESN&apos;T.</span>
                <span style={{ color: "#4de3d4" }}>★</span>
                <span>INFRASTRUCTURE FOR AUTONOMOUS HOTELS</span>
                <span style={{ color: "#ff5f9e" }}>★</span>
                <span>NOW READING · ALWAYS</span>
                <span style={{ color: "#6bff8f" }}>★</span>
              </div>
            ))}
          </div>
        </div>

        {/* badge case footer */}
        <footer
          className="cab"
          style={{
            marginTop: 22,
            background: "linear-gradient(180deg, #10102a 0%, #0a0a18 100%)",
          }}
        >
          <div className="cab-head">BADGE CASE · PROGRESS</div>
          <div
            className="grid-collapse"
            style={{
              padding: 24,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
              gap: 26,
            }}
          >
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                {[
                  { label: "READER", c: "#6bff8f", bg: "#0f2416", shape: "pentagon", earned: true },
                  { label: "WRITER", c: "#ff5f9e", bg: "#250f1b", shape: "diamond", earned: true },
                  { label: "FOUNDER", c: "#ffcc33", bg: "#241f0c", shape: "star", earned: true },
                  { label: "BUILDER", c: "#4de3d4", bg: "#0f2523", shape: "square", earned: true },
                  { label: "SHIPPED V1", c: "#2a2a52", bg: "#101024", shape: "pentagon", earned: false },
                  { label: "OUT OF STEALTH", c: "#2a2a52", bg: "#101024", shape: "diamond", earned: false },
                  { label: "FIRST 100", c: "#2a2a52", bg: "#101024", shape: "square", earned: false },
                  { label: "???", c: "#2a2a52", bg: "#101024", shape: "star", earned: false },
                ].map((b) => {
                  const clip: Record<string, string | undefined> = {
                    pentagon: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                    diamond: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                    star: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                    square: undefined,
                  };
                  return (
                    <div
                      key={b.label}
                      style={{
                        border: `3px solid ${b.c}`,
                        background: b.bg,
                        padding: "12px 8px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          margin: "0 auto",
                          background: b.c,
                          clipPath: clip[b.shape],
                        }}
                      />
                      <div
                        className={mono}
                        style={{
                          fontSize: 7,
                          color: b.earned ? b.c : "#43497a",
                          marginTop: 10,
                          lineHeight: 1.5,
                        }}
                      >
                        {b.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p
                style={{
                  fontSize: 21,
                  color: "#6f76ad",
                  margin: "16px 0 0 0",
                  lineHeight: 1.35,
                }}
              >
                4 of 8 earned. The greyed-out ones are the whole reason I get up
                at 5am.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  border: "3px solid #2a2a52",
                  background: "#101024",
                  padding: 16,
                }}
              >
                <div
                  className={mono}
                  style={{ fontSize: 8, color: "#9aa0d0", letterSpacing: 1 }}
                >
                  PARTY
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 14,
                    flexWrap: "wrap",
                  }}
                >
                  {["#6bff8f", "#ff8c3a", "#4de3d4", "#ffcc33"].map((c, i) => (
                    <span
                      key={c}
                      style={{
                        width: 20,
                        height: 20,
                        background: c,
                        display: "block",
                        animation: `hop 2.2s ease-in-out infinite ${i * 0.2}s`,
                      }}
                    />
                  ))}
                  <span
                    style={{ width: 20, height: 20, border: "2px dashed #2a2a52", display: "block" }}
                  />
                  <span
                    style={{ width: 20, height: 20, border: "2px dashed #2a2a52", display: "block" }}
                  />
                </div>
              </div>
              <div
                style={{
                  border: "3px solid #2a2a52",
                  background: "#101024",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                }}
              >
                {[
                  ["REGION", "BAY AREA", "#d8d8f0"],
                  ["PLAYTIME", "ALL OF IT", "#d8d8f0"],
                  ["SAVE FILE", "AUTOSAVING", "#6bff8f"],
                ].map(([l, v, c]) => (
                  <div
                    key={l}
                    style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
                  >
                    <span style={{ fontSize: 20, color: "#6f76ad", letterSpacing: 1 }}>
                      {l}
                    </span>
                    <span style={{ fontSize: 20, color: c, letterSpacing: 1 }}>{v}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/lets-talk"
                className="btn btn-gold"
                style={{ textAlign: "center", fontSize: 10, padding: "14px 12px" }}
              >
                CHALLENGE ME ▸
              </Link>
            </div>
          </div>
          <div
            style={{
              borderTop: "4px solid #2a2a52",
              padding: "16px 24px",
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className={mono} style={{ fontSize: 8, color: "#43497a" }}>
              © 2026 NIVAAN GUPTA
            </span>
            <span className={mono} style={{ fontSize: 8, color: "#43497a" }}>
              INSERT COIN
              <span style={{ animation: "caret 1s steps(1) infinite", color: "#ffcc33" }}>
                _
              </span>
            </span>
          </div>
        </footer>
        <div style={{ height: 34 }} />
      </PageShell>
    </>
  );
}
