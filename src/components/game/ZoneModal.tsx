"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ExternalLink, Github, Linkedin, Mail, X } from "lucide-react";
import { portfolio } from "@/config/portfolio";
import type { ZonePayload } from "@/game/types";

/* ---------------------------------- bits ---------------------------------- */

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-7 items-center justify-center border-2 border-[#a8862f] bg-[#141008] px-1.5 py-0.5 font-pixel text-[9px] text-[#e8c170]">
      {children}
    </kbd>
  );
}

function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-2 border-[#6b5b33] bg-[#141008] px-2 py-1 text-[11px] text-[#cdb87e]">
      {children}
    </span>
  );
}

function GoldButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="inline-flex items-center gap-2 border-b-4 border-[#a8862f] bg-[#e8c170] px-4 py-2.5 font-pixel text-[10px] text-[#221d14] transition-transform hover:bg-[#f5d78e] active:translate-y-[2px] active:border-b-0"
    >
      {children}
    </a>
  );
}

/* ------------------------------- typewriter ------------------------------- */

function useTypewriter(text: string, speed = 17) {
  const [count, setCount] = useState(0);
  const [prevText, setPrevText] = useState(text);
  // Adjust state during render when the line changes (documented React pattern)
  if (prevText !== text) {
    setPrevText(text);
    setCount(0);
  }
  useEffect(() => {
    const iv = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(iv);
          return c;
        }
        return c + 1;
      });
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return { shown: text.slice(0, count), done: count >= text.length, finish: () => setCount(text.length) };
}

function Dialogue({ npcId, onClose }: { npcId: string; onClose: () => void }) {
  const npc = portfolio.npcs.find((n) => n.id === npcId);
  const [line, setLine] = useState(0);
  const tw = useTypewriter(npc?.lines[line] ?? "");

  const next = useCallback(() => {
    if (!tw.done) tw.finish();
    else if (npc && line < npc.lines.length - 1) setLine((l) => l + 1);
    else onClose();
  }, [tw, npc, line, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (["Enter", " ", "e", "E"].includes(e.key)) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, onClose]);

  return (
    <div
      className="cursor-pointer select-none"
      onClick={next}
      role="button"
      tabIndex={-1}
      aria-label="Dialogue — click to continue"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center border-4 border-[#e8c170] bg-[#141008] text-3xl">
          {npc?.emoji}
        </div>
        <div>
          <div className="font-pixel text-[11px] text-[#e8c170]">{npc?.name}</div>
          <div className="mt-1 text-xs italic text-[#a89a76]">{npc?.intro}</div>
        </div>
        <span className="ml-auto font-pixel text-[9px] text-[#8a7c58]">
          {line + 1}/{npc?.lines.length}
        </span>
      </div>
      <p className="min-h-20 text-sm leading-relaxed text-[#f4e8c8]">
        {tw.shown}
        <span className="animate-blink">▌</span>
      </p>
      <div className="mt-4 flex items-center justify-end gap-1 text-[#e8c170]">
        <span className="font-pixel text-[9px]">{tw.done ? "CLICK TO CONTINUE" : ""}</span>
        {tw.done && <ChevronDown className="h-4 w-4 animate-bounce" />}
      </div>
    </div>
  );
}

/* --------------------------------- panels --------------------------------- */

function Welcome() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-[#f4e8c8]">
      <p>
        Welcome to <strong className="text-[#e8c170]">{portfolio.name}&apos;s</strong> world. This
        whole site is a game — walk around, poke things, see what responds.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="border-2 border-[#6b5b33] bg-[#141008] p-3">
          <div className="mb-2 font-pixel text-[9px] text-[#e8c170]">DESKTOP</div>
          <div className="flex items-center gap-2">
            <Kbd>W</Kbd>
            <Kbd>A</Kbd>
            <Kbd>S</Kbd>
            <Kbd>D</Kbd>
            <span className="text-xs text-[#a89a76]">or arrows to walk</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Kbd>E</Kbd>
            <span className="text-xs text-[#a89a76]">to interact</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Kbd>ESC</Kbd>
            <span className="text-xs text-[#a89a76]">to close popups</span>
          </div>
        </div>
        <div className="border-2 border-[#6b5b33] bg-[#141008] p-3">
          <div className="mb-2 font-pixel text-[9px] text-[#e8c170]">MOBILE</div>
          <p className="text-xs text-[#a89a76]">
            Use the joystick (bottom-left) to walk and the big gold button (bottom-right) to
            interact.
          </p>
        </div>
      </div>
      <p className="text-xs text-[#a89a76]">
        Heads up: there are achievements. And at least one thing hidden in the north-east that
        most people never find.
      </p>
    </div>
  );
}

function About() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center border-4 border-[#e8c170] bg-[#141008] text-3xl">
          {portfolio.about.emoji}
        </div>
        <div>
          <div className="font-pixel text-[11px] text-[#e8c170]">
            {portfolio.name} — {portfolio.role}
          </div>
          <div className="mt-1 text-xs italic text-[#a89a76]">{portfolio.tagline}</div>
        </div>
      </div>
      {portfolio.about.bio.map((p, i) => (
        <p key={i} className="text-sm leading-relaxed text-[#f4e8c8]">
          {p}
        </p>
      ))}
      <div className="border-2 border-[#6b5b33] bg-[#141008] p-3">
        <div className="mb-2 font-pixel text-[9px] text-[#e8c170]">FUN FACTS</div>
        <ul className="space-y-1.5">
          {portfolio.about.funFacts.map((f, i) => (
            <li key={i} className="flex gap-2 text-xs text-[#cdb87e]">
              <span className="text-[#e8c170]">✦</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Project({ projectId }: { projectId: string }) {
  const p = portfolio.projects.find((x) => x.id === projectId);
  if (!p) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center border-4 border-[#e8c170] bg-[#141008] text-3xl">
          {p.emoji}
        </div>
        <div>
          <div className="font-pixel text-[11px] leading-relaxed text-[#e8c170]">{p.title}</div>
          <div className="mt-1 font-pixel text-[9px] text-[#8a7c58]">{p.year}</div>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-[#f4e8c8]">{p.description}</p>
      <div className="flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <TagChip key={t}>{t}</TagChip>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {p.links.map((l) => (
          <GoldButton key={l.url} href={l.url}>
            <Github className="h-3.5 w-3.5" />
            {l.label}
          </GoldButton>
        ))}
      </div>
    </div>
  );
}

function Skills({ skillId }: { skillId: string }) {
  const s = portfolio.skills.find((x) => x.id === skillId);
  if (!s) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center border-4 border-[#e8c170] bg-[#141008] text-3xl">
          {s.emoji}
        </div>
        <div>
          <div className="font-pixel text-[11px] text-[#e8c170]">{s.name}</div>
          <div className="mt-1 text-xs italic text-[#a89a76]">{s.description}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {s.skills.map((sk) => (
          <TagChip key={sk}>{sk}</TagChip>
        ))}
      </div>
    </div>
  );
}

function Contact() {
  const icon = (label: string) =>
    label === "Email" ? <Mail className="h-4 w-4" /> : label === "GitHub" ? <Github className="h-4 w-4" /> : <Linkedin className="h-4 w-4" />;
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-[#f4e8c8]">{portfolio.contact.blurb}</p>
      <div className="grid gap-3">
        {portfolio.contact.links.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target={l.url.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="flex items-center gap-3 border-2 border-[#6b5b33] bg-[#141008] px-3 py-3 transition-colors hover:border-[#e8c170]"
          >
            <span className="text-[#e8c170]">{icon(l.label)}</span>
            <span className="font-pixel text-[10px] text-[#f4e8c8]">{l.label}</span>
            <span className="ml-auto truncate text-xs text-[#a89a76]">{l.value}</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#8a7c58]" />
          </a>
        ))}
      </div>
    </div>
  );
}

function Secret({ onClose }: { onClose: () => void }) {
  const [line, setLine] = useState(0);
  const tw = useTypewriter(portfolio.secret.lines[line] ?? "", 14);
  const next = useCallback(() => {
    if (!tw.done) tw.finish();
    else if (line < portfolio.secret.lines.length - 1) setLine((l) => l + 1);
    else onClose();
  }, [tw, line, onClose]);

  // Same keyboard contract as NPC dialogue: Escape closes, E/Enter/Space
  // advances. Without this the chest was a keyboard dead-end.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (["Enter", " ", "e", "E"].includes(e.key)) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, onClose]);

  return (
    <div className="cursor-pointer select-none space-y-3" onClick={next} role="button" tabIndex={-1}>
      <div className="flex h-20 w-20 items-center justify-center border-4 border-[#f5d78e] bg-[#141008] text-4xl shadow-[0_0_30px_rgba(232,193,112,0.35)]">
        {portfolio.secret.emoji}
      </div>
      <p className="min-h-16 text-sm leading-relaxed text-[#f5d78e]">
        {tw.shown}
        <span className="animate-blink">▌</span>
      </p>
      <div className="text-right font-pixel text-[9px] text-[#c9a44e]">
        {tw.done ? `${line + 1}/${portfolio.secret.lines.length} · CLICK TO CONTINUE` : ""}
      </div>
    </div>
  );
}

/* --------------------------------- shell ---------------------------------- */

const KIND_META: Record<ZonePayload["kind"], string> = {
  welcome: "📖",
  about: "⛲",
  project: "📋",
  skills: "🌿",
  contact: "📮",
  dialogue: "💬",
  secret: "✨",
};

export function ZoneModal({ payload, onClose }: { payload: ZonePayload; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && payload.kind !== "dialogue" && payload.kind !== "secret") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, payload.kind]);

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={payload.kind === "dialogue" || payload.kind === "secret" ? undefined : onClose}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        role="dialog"
        aria-modal="true"
        aria-label={payload.title}
        className={`pixel-panel relative z-10 max-h-[82dvh] w-full max-w-lg overflow-y-auto p-5 sm:p-6 ${
          payload.kind === "secret" ? "border-[#f5d78e]" : ""
        }`}
      >
        <div className="mb-4 flex items-center justify-between border-b-2 border-dashed border-[#6b5b33] pb-3">
          <span className="text-xl">{KIND_META[payload.kind]}</span>
          <span className="font-pixel text-[11px] text-[#e8c170]">{payload.title}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="border-2 border-[#6b5b33] bg-[#141008] p-1.5 text-[#cdb87e] transition-colors hover:border-[#e8c170] hover:text-[#e8c170]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {payload.kind === "welcome" && <Welcome />}
        {payload.kind === "about" && <About />}
        {payload.kind === "project" && <Project projectId={payload.projectId!} />}
        {payload.kind === "skills" && <Skills skillId={payload.skillId!} />}
        {payload.kind === "contact" && <Contact />}
        {payload.kind === "dialogue" && <Dialogue npcId={payload.npcId!} onClose={onClose} />}
        {payload.kind === "secret" && <Secret onClose={onClose} />}

        {payload.kind !== "dialogue" && payload.kind !== "secret" && (
          <p className="mt-5 border-t-2 border-dashed border-[#6b5b33] pt-3 text-center font-pixel text-[8px] text-[#8a7c58]">
            ESC OR TAP OUTSIDE TO CLOSE
          </p>
        )}
      </motion.div>
    </div>
  );
}
