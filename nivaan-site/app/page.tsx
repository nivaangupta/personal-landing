"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/arcade/PageShell";
import SiteHeader from "@/components/arcade/SiteHeader";
import SiteFooter from "@/components/arcade/SiteFooter";
import PixelProfessor from "@/components/arcade/PixelProfessor";
import PixelSprite, { type Px } from "@/components/arcade/PixelSprite";
import { BULBA, CHAR, SQUIRT, PIKA, PIGEOTTO } from "@/components/arcade/sprites";

const LINES: Record<string, string> = {
  none: "Welcome to Nivaan’s corner of the world! Books, ideas, agent skills, a few good quotes, or a conversation. Pick one of the five below to begin.",
  grass:
    "BULBAREAD knows the library well. Explore Nivaan’s book recommendations, with honest verdicts and a few lasting favorites.",
  fire: "CHARTHINK has a few ideas to share. Read Nivaan’s thoughts on computing, robots, and whatever he’s figuring out next.",
  water:
    "SQUIRTALK is always up for a conversation. Book a time with Nivaan or send him an email. Both reach him directly.",
  electric:
    "PIKASKILLS keeps the tools ready. Explore the agent skills Nivaan builds and uses, and take one along for your own work.",
  flying:
    "PIGEQUOTE collects words worth keeping. Browse the quotes that have stayed with Nivaan. You might find one to keep, too.",
};

const mono = "mono";

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
      onFocus={onHover}
      onBlur={onLeave}
      className="card-link starter-card"
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
  const [hover, setHover] = useState<string>("none");

  const dialog = LINES[hover] ?? LINES.none;

  return (
    <PageShell maxWidth={1120}>
      <SiteHeader />

      <section className="starter-lab" aria-labelledby="starter-title">
        <div className="professor-welcome">
          <div className="professor-portrait">
            <PixelProfessor />
            <span className="mono professor-name">THE PROFESSOR</span>
          </div>
          <div className="professor-dialogue">
            <h1 id="starter-title" className="mono">Choose your starter.</h1>
            <p aria-live="polite" aria-atomic="true">{dialog}</p>
            <span className="dialogue-arrow" aria-hidden="true">▼</span>
          </div>
        </div>

        <div
          className="starter-choices"
          style={{
            marginTop: 22,
            display: "grid",
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

      <SiteFooter />
      <div style={{ height: 34 }} />
    </PageShell>
  );
}
