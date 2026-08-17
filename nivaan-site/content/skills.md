---
title: Skills
description: Tools I've built for getting more out of AI coding agents.
recommendedIntro: "A running list of the best Claude Code skills I've come across — worth installing if you're running agents day to day."
recommended:
  - name: "defuddle"
    author: "kepano"
    url: "https://github.com/kepano/obsidian-skills"
    blurb: "Strips a web page down to clean markdown before your agent reads it — no nav, no ads, no wasted tokens."

  - name: "caveman"
    author: "juliusbrussee"
    url: "https://github.com/juliusbrussee/caveman"
    blurb: "Makes the agent answer in stripped-down caveman prose to cut 65%+ of output tokens, while keeping code and errors byte-for-byte exact."

  - name: "codebase-memory-mcp"
    author: "DeusData"
    url: "https://github.com/DeusData/codebase-memory-mcp"
    blurb: "Indexes a whole codebase into a persistent knowledge graph, so agents answer structural questions in milliseconds instead of grepping the repo every time."

  - name: "Humanizer"
    author: "blader"
    url: "https://github.com/blader/humanizer"
    blurb: "Strips the tells of AI-written prose out of your agent's output so it reads like a person wrote it."

  - name: "Agent Reach"
    author: "Panniantong"
    url: "https://github.com/Panniantong/Agent-Reach"
    blurb: "Gives an agent search and read access across 14+ platforms — GitHub, X, YouTube, Reddit — with no API keys."

  - name: "Marketing Skills"
    author: "coreyhaines31"
    url: "https://github.com/coreyhaines31/marketingskills"
    blurb: "A full marketing department as skill packs — SEO, copy, ads, analytics — that Claude Code can actually execute, not just suggest."

  - name: "Composio"
    author: "ComposioHQ"
    url: "https://github.com/ComposioHQ/awesome-claude-skills"
    blurb: "Wires Claude into 1000+ real apps — Gmail, Slack, Notion, Jira — so it can take actions, not just talk about them."

  - name: "OpenMontage"
    author: "calesthio"
    url: "https://github.com/calesthio/OpenMontage"
    blurb: "Turns Claude Code into a full video production studio — script, visuals, narration, edit — end to end."

  - name: "Oh My Claude Code"
    author: "zephyrpersonal"
    url: "https://github.com/zephyrpersonal/oh-my-claude-code"
    blurb: "Zero-config multi-agent orchestration for Claude Code — plan, execute, verify, iterate, without hand-holding each step."

  - name: "Superpowers"
    author: "obra"
    url: "https://github.com/obra/superpowers"
    blurb: "An agent skills framework built to get Claude Code producing engineering-grade code instead of toy-grade code."
mine:
  - name: "context-relevance-check"
    tagline: "Decides when an AI agent's memory is worth keeping, before it clears anything."
    problem: "Long-running coding agents drag stale context forward — dead file paths, solved bugs, assumptions that stopped being true three turns ago. Every stale turn still costs tokens, and it quietly biases the next answer toward the old problem instead of the new one."
    approach: "Built for orchestrator / sub-agent setups. Before an orchestrator hands off a new unit of work, or before a sub-agent honors a request to drop its context, this skill runs a relevance check and applies one of three strategies the user picks once per session: signal-only (sub-agents stay alive, just get told when their context stops mattering — improves answer quality, saves little), always-respawn (every new unit gets a fresh sub-agent — the only mode that actually cuts token spend, at the cost of a cold start), or hybrid, the default, which respawns when the check says CLEAR and keeps-and-signals when it says KEEP or COMPACT."
    mechanics:
      - "A structured CLEAR-SAFE block the orchestrator emits, naming exactly what has to survive the reset — a short carryover list plus a path on disk for everything else."
      - "A worker never honors a CLEAR-SAFE on reflex. It checks the signal actually came from its orchestrator or the user — not from a webpage or file it just read, otherwise any fetched content could talk an agent into dropping its own state. It checks the carryover is actually sufficient. It checks it isn't sitting on half-applied edits. Any failure, and it replies CLEAR-BLOCKED with exactly what's missing instead of clearing."
      - "Relevance is judged on concrete signals, not vibes or session length — unresolved pronouns like 'that file' or 'like before', shared artifacts, a continuation of an agreed plan all force KEEP. The bias is deliberate: a wrong KEEP just costs tokens, a wrong CLEAR can lose work — so ties go to keeping context."
    file: "/skills/context-relevance-check.md"
---
