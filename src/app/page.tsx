"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ExternalLink, Gamepad2, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";
import { GameOverlay } from "@/components/game/GameOverlay";
import { portfolio } from "@/config/portfolio";

/* Deterministic starfield — same seed on server & client, no hydration drift */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(1337);
const STARS = Array.from({ length: 46 }, () => ({
  left: `${(rng() * 100).toFixed(2)}%`,
  top: `${(rng() * 70).toFixed(2)}%`,
  size: rng() > 0.7 ? 3 : 2,
  delay: `${(rng() * 3).toFixed(2)}s`,
}));

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: portfolio.name,
  jobTitle: portfolio.role,
  url: "https://github.com/YashShingan",
  sameAs: ["https://github.com/YashShingan"],
  knowsAbout: portfolio.skills.flatMap((s) => s.skills),
};

const V1_FIXES = [
  {
    v1: "The world WAS the browser window",
    v2: "A fixed 3000×3000 world with a camera that scrolls — and districts you can actually walk to",
  },
  {
    v1: "Every window resize rebuilt every path, wall and zone",
    v2: "Resize only adjusts camera zoom. Nothing is ever rebuilt",
  },
  {
    v1: "The game loop wrote to the DOM 60× per second",
    v2: "Event bus: the UI updates only when something actually changes",
  },
  {
    v1: "Keyboard-only — unplayable on phones",
    v2: "Virtual joystick + tap-to-interact. Phones welcome",
  },
  {
    v1: "Stripped a sprite's background pixel-by-pixel on every load",
    v2: "Processed once at build time. RIP that loop",
  },
  {
    v1: "Invisible to Google — canvas-only, no crawlable text",
    v2: "This page you're reading. Hello, search engines",
  },
  {
    v1: "You explored alone — nobody knew you were there",
    v2: "Live ghost visitors: everyone currently in the world wanders it as a translucent little spirit you can watch",
  },
];

export default function Home() {
  const [gameOpen, setGameOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#12160f] text-[#e8e3d0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============================ HERO ============================ */}
      <header className="scanlines relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {STARS.map((s, i) => (
            <span
              key={i}
              className="star"
              style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}
            />
          ))}
        </div>
        {/* pixel hills */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-[#1d3520]" aria-hidden />
        <div className="pointer-events-none absolute bottom-24 left-0 right-0 h-6 bg-[#2d5a27]" aria-hidden />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 pb-40 pt-20 text-center sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="pixel-chip font-pixel text-[9px] tracking-wider text-[#e8c170]"
          >
            ✦ MY PORTFOLIO IS A GAME ✦
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-pixel text-2xl leading-relaxed text-[#f4e8c8] sm:text-4xl sm:leading-relaxed"
          >
            {portfolio.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-retro text-2xl text-[#cdb87e] sm:text-3xl"
          >
            {portfolio.role} · {portfolio.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex flex-col items-center gap-4 sm:flex-row"
          >
            <button
              onClick={() => setGameOpen(true)}
              className="group inline-flex items-center gap-3 border-b-4 border-[#a8862f] bg-[#e8c170] px-8 py-4 font-pixel text-[11px] text-[#221d14] shadow-[8px_8px_0_0_rgba(0,0,0,0.45)] transition-all hover:bg-[#f5d78e] active:translate-x-[2px] active:translate-y-[4px] active:shadow-[2px_2px_0_0_rgba(0,0,0,0.45)]"
            >
              <Gamepad2 className="h-5 w-5 transition-transform group-hover:-rotate-6" />
              ENTER THE GAME
            </button>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 border-b-4 border-[#3d3625] bg-[#221d14] px-8 py-4 font-pixel text-[11px] text-[#cdb87e] shadow-[8px_8px_0_0_rgba(0,0,0,0.45)] transition-all hover:border-[#e8c170] hover:text-[#e8c170] active:translate-x-[2px] active:translate-y-[4px] active:shadow-[2px_2px_0_0_rgba(0,0,0,0.45)]"
            >
              BORING VERSION
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4">
        {/* ============================ ABOUT ============================ */}
        <section className="py-16" aria-labelledby="about-heading">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              ⛲
            </span>
            <h2 id="about-heading" className="font-pixel text-sm text-[#e8c170] sm:text-base">
              ABOUT
            </h2>
            <span className="hidden h-px flex-1 bg-[#3d3625] sm:block" aria-hidden />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {portfolio.about.bio.map((p, i) => (
                <p key={i} className="leading-relaxed text-[#cdb87e]">
                  {p}
                </p>
              ))}
            </div>
            <aside className="pixel-panel p-5">
              <div className="font-pixel text-[9px] text-[#e8c170]">FUN FACTS</div>
              <ul className="mt-3 space-y-2.5">
                {portfolio.about.funFacts.map((f, i) => (
                  <li key={i} className="flex gap-2 text-xs leading-relaxed text-[#cdb87e]">
                    <span className="text-[#e8c170]" aria-hidden>
                      ✦
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {/* ========================= V1 → V2 STORY ========================= */}
        <section className="py-16" aria-labelledby="rewrite-heading">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              🛠️
            </span>
            <h2 id="rewrite-heading" className="font-pixel text-sm text-[#e8c170] sm:text-base">
              WHY I REBUILT IT
            </h2>
            <span className="hidden h-px flex-1 bg-[#3d3625] sm:block" aria-hidden />
          </div>
          <p className="mb-6 max-w-3xl leading-relaxed text-[#cdb87e]">
            Two years ago I made my first portfolio-game. It was janky — because I made every
            classic mistake in the book. I kept the idea, thanked the octopus, and rewrote the
            whole thing properly. The receipts:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {V1_FIXES.map((fix, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="border-2 border-[#3d3625] bg-[#1a221a] p-4"
              >
                <div className="text-xs text-[#a35d5d]">
                  <span className="mr-1.5 font-pixel text-[8px]">V1</span>
                  {fix.v1}
                </div>
                <div className="mt-3 flex gap-2 text-sm text-[#f4e8c8]">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#e8c170]" aria-hidden />
                  <span>{fix.v2}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* =========================== PROJECTS =========================== */}
        <section id="projects" className="scroll-mt-8 py-16" aria-labelledby="projects-heading">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              📋
            </span>
            <h2 id="projects-heading" className="font-pixel text-sm text-[#e8c170] sm:text-base">
              PROJECTS
            </h2>
            <span className="hidden h-px flex-1 bg-[#3d3625] sm:block" aria-hidden />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {portfolio.projects.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col border-2 border-[#3d3625] bg-[#1a221a] p-5 transition-colors hover:border-[#e8c170]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl" aria-hidden>
                    {p.emoji}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-pixel text-[10px] leading-relaxed text-[#f4e8c8]">{p.title}</h3>
                    <div className="mt-1 font-pixel text-[8px] text-[#8a7c58]">{p.year}</div>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[#cdb87e]">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="border-2 border-[#6b5b33] bg-[#141008] px-2 py-1 text-[11px] text-[#cdb87e]">
                      {t}
                    </span>
                  ))}
                </div>
                {p.links.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {p.links.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#e8c170] underline-offset-4 hover:underline"
                      >
                        <Github className="h-3.5 w-3.5" aria-hidden />
                        {l.label}
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </section>

        {/* ============================ SKILLS ============================ */}
        <section className="py-16" aria-labelledby="skills-heading">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              🌿
            </span>
            <h2 id="skills-heading" className="font-pixel text-sm text-[#e8c170] sm:text-base">
              SKILLS GARDEN
            </h2>
            <span className="hidden h-px flex-1 bg-[#3d3625] sm:block" aria-hidden />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {portfolio.skills.map((s, i) => (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border-2 border-[#3d3625] bg-[#1a221a] p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>
                    {s.emoji}
                  </span>
                  <h3 className="font-pixel text-[10px] text-[#f4e8c8]">{s.name}</h3>
                </div>
                <p className="mt-3 text-xs italic text-[#8a7c58]">{s.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.skills.map((sk) => (
                    <li key={sk} className="border-2 border-[#6b5b33] bg-[#141008] px-2 py-1 text-[11px] text-[#cdb87e]">
                      {sk}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ============================ CONTACT ============================ */}
        <section className="py-16" aria-labelledby="contact-heading">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              📮
            </span>
            <h2 id="contact-heading" className="font-pixel text-sm text-[#e8c170] sm:text-base">
              CONTACT
            </h2>
            <span className="hidden h-px flex-1 bg-[#3d3625] sm:block" aria-hidden />
          </div>
          <p className="mb-6 max-w-2xl leading-relaxed text-[#cdb87e]">{portfolio.contact.blurb}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {portfolio.contact.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target={l.url.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center gap-3 border-2 border-[#3d3625] bg-[#1a221a] p-4 transition-colors hover:border-[#e8c170]"
              >
                {l.label === "Email" ? (
                  <Mail className="h-5 w-5 text-[#e8c170]" aria-hidden />
                ) : l.label === "GitHub" ? (
                  <Github className="h-5 w-5 text-[#e8c170]" aria-hidden />
                ) : (
                  <Linkedin className="h-5 w-5 text-[#e8c170]" aria-hidden />
                )}
                <span className="font-pixel text-[9px] text-[#f4e8c8]">{l.label}</span>
                <span className="ml-auto truncate text-xs text-[#8a7c58]">{l.value}</span>
              </a>
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-[#8a7c58]">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {portfolio.location} — usually online, always building something
          </p>
        </section>
      </main>

      {/* ============================ FOOTER ============================ */}
      <footer className="mt-auto border-t-2 border-[#3d3625] bg-[#0d100c] pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:text-left">
          <p className="font-pixel text-[8px] leading-relaxed text-[#8a7c58]">
            © {new Date().getFullYear()} {portfolio.name.toUpperCase()} — BUILT WITH NEXT.JS 16 + PHASER 3
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/YashShingan/portfolio-game"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-[#cdb87e] hover:text-[#e8c170]"
            >
              <Github className="h-4 w-4" aria-hidden />
              v1 source
            </a>
            <button
              onClick={() => setGameOpen(true)}
              className="inline-flex items-center gap-2 text-xs text-[#e8c170] hover:underline"
            >
              <Gamepad2 className="h-4 w-4" aria-hidden />
              Play the game
            </button>
          </div>
        </div>
      </footer>

      {/* The game itself — full-screen overlay */}
      <GameOverlay open={gameOpen} onClose={() => setGameOpen(false)} />
    </div>
  );
}
