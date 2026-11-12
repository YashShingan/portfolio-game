"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Coins,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { portfolio } from "@/config/portfolio";
import { unlock } from "@/game/systems/achievements";
import { audio } from "@/game/systems/audio";
import { emitGameEvent } from "@/game/systems/events";
import type { ZonePayload } from "@/game/types";
import { ArcadeMiniGame } from "./ArcadeMiniGame";

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

interface Fortune {
  quote: string;
  author: string;
}

const DEVELOPER_FORTUNES: Fortune[] = [
  {
    quote: "There are only two hard things in Computer Science: cache invalidation and naming things.",
    author: "Phil Karlton",
  },
  {
    quote: "It's not a bug, it's an undocumented feature.",
    author: "Anonymous Sysadmin",
  },
  {
    quote: "The code works on my machine. Therefore, we will ship your machine to production.",
    author: "DevOps Oracle",
  },
  {
    quote: "A git commit a day keeps the catastrophic merge conflicts away.",
    author: "Ancient Git Proverb",
  },
  {
    quote: "Before software can be reusable it first has to be usable.",
    author: "Ralph Johnson",
  },
  {
    quote: "Any code you haven't looked at for six months might as well have been written by someone else.",
    author: "Eagleson's Law",
  },
  {
    quote: "Deleted code is debugged code.",
    author: "Jeff Sickel",
  },
  {
    quote: "Walking on water and developing software from a specification are easy if both are frozen.",
    author: "Edward V. Berard",
  },
  {
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
  },
  {
    quote: "There is nothing quite so permanent as a quick temporary workaround.",
    author: "Senior Staff Engineer",
  },
  {
    quote: "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
    author: "John Woods",
  },
  {
    quote: "A lucky commit awaits you. May your next pull request be approved without a single review comment.",
    author: "Fountain Oracle",
  },
  {
    quote: "The best error message is the one that never shows up.",
    author: "Site Reliability Sage",
  },
  {
    quote: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
  },
  {
    quote: "May your queries be fast, your caches warm, and your p99 latency strictly sub-millisecond.",
    author: "Database Guardian",
  },
  {
    quote: "Good code is its own best documentation. As you're about to add a comment, ask yourself: How can I improve the code so that this comment isn't needed?",
    author: "Steve McConnell",
  },
  {
    quote: "The secret to 10x developer productivity: 8 hours of sleep and reading the actual error stack trace.",
    author: "Pragmatic Octo",
  },
  {
    quote: "You will soon discover that one missing semicolon that kept you awake until 3 AM.",
    author: "Compiler Whisperer",
  },
  {
    quote: "Premature optimization is the root of all evil (or at least 97% of it).",
    author: "Donald Knuth",
  },
  {
    quote: "In theory, there is no difference between theory and practice. In practice, there is.",
    author: "Jan L. A. van de Snepscheut",
  },
  {
    quote: "Weeks of programming can save you hours of planning.",
    author: "Engineering Folklore",
  },
  {
    quote: "Today's fortune: That flaky test in CI will pass on the third retry without changing a single line of code.",
    author: "Pipeline Mystic",
  },
  {
    quote: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
  },
  {
    quote: "Beware of bugs in the above code; I have only proved it correct, not tried it.",
    author: "Donald Knuth",
  },
];

function FountainOfWisdom() {
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
  const [tossCount, setTossCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTossCoin = () => {
    audio.coin();
    emitGameEvent("pg:fountain-toss", undefined);
    unlock("big-spender");

    let next: Fortune;
    do {
      next = DEVELOPER_FORTUNES[Math.floor(Math.random() * DEVELOPER_FORTUNES.length)];
    } while (DEVELOPER_FORTUNES.length > 1 && currentFortune && next.quote === currentFortune.quote);

    setCurrentFortune(next);
    setTossCount((c) => c + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="relative overflow-hidden border-2 border-[#a8862f] bg-[#1a140b] p-4 text-[#f4e8c8] shadow-inner">
      {/* Decorative top water/gold ribbon */}
      <div
        className="absolute inset-x-0 top-0 h-1.5 opacity-80"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #38bdf8 0px, #38bdf8 10px, #fef08a 10px, #fef08a 20px, #0284c7 20px, #0284c7 30px, #f59e0b 30px, #f59e0b 40px)",
        }}
      />

      {/* Header */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-[#856b28] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">⛲</span>
          <div>
            <div className="font-pixel text-[9px] tracking-widest text-[#e8c170]">
              FOUNTAIN OF WISDOM · WISHING WELL
            </div>
            <div className="mt-0.5 text-[10px] text-[#a89a76]">
              CENTRAL PLAZA ORACLE · MAKE A WISH
            </div>
          </div>
        </div>
        {tossCount > 0 && (
          <div className="flex items-center gap-1 rounded border border-[#856b28] bg-[#241c10] px-2 py-0.5 font-pixel text-[8px] text-[#fde68a]">
            <span>🪙 TOSSES: {tossCount}</span>
          </div>
        )}
      </div>

      {/* Oracle prompt or revealed fortune */}
      <div className="my-3 min-h-16">
        {currentFortune ? (
          <motion.div
            key={currentFortune.quote + tossCount}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="rounded border border-[#a8862f]/60 bg-[#120e07] p-3 shadow-md"
          >
            <div className="mb-1 flex items-center justify-between font-pixel text-[8px] text-[#e8c170]">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#fde047]" /> THE ORACLE SPEAKS:
              </span>
              <span className="text-[#856b28]">LUCKY COIN #{tossCount}</span>
            </div>
            <p className="border-l-2 border-[#e8c170] pl-2.5 italic text-sm text-[#fef08a] leading-relaxed">
              &ldquo;{currentFortune.quote}&rdquo;
            </p>
            <div className="mt-1.5 text-right font-pixel text-[8px] text-[#cdb87e]">
              — {currentFortune.author}
            </div>
          </motion.div>
        ) : (
          <p className="text-xs italic leading-relaxed text-[#cdb87e]">
            Legend whispers that tossing a golden coin into the fountain grants crystal-clear compiler
            insight and reveals ancient developer fortunes. Toss a coin to test your luck!
          </p>
        )}
      </div>

      {/* Interactive Toss Button */}
      <button
        type="button"
        onClick={handleTossCoin}
        className={`flex w-full items-center justify-center gap-2 border-b-4 border-[#a8862f] bg-[#e8c170] py-2.5 font-pixel text-[10px] text-[#221d14] transition-all hover:bg-[#f5d78e] active:translate-y-[2px] active:border-b-0 ${
          isAnimating ? "scale-[0.98] ring-2 ring-[#fde047]" : ""
        }`}
      >
        <Coins className="h-4 w-4 text-[#854d0e]" />
        <span>🪙 TOSS A COIN INTO THE FOUNTAIN</span>
      </button>
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

      {/* Fountain of Wisdom / Coin Toss Interactive Section */}
      <FountainOfWisdom />

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

      {/* Embedded 10-second Retro Arcade Mini-Game (Flappy Octo) for Project 0 */}
      {projectId === "p0" && <ArcadeMiniGame />}

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

function Contact({ onOpenResumeSheet }: { onOpenResumeSheet?: () => void }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [topic, setTopic] = useState("Job Offer");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");

  const email = portfolio.contact.email;
  const discord = portfolio.contact.discord;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
      toast.success(`Copied email (${email}) to clipboard!`);
    } catch {
      toast.error("Could not access clipboard");
    }
  };

  const handleCopyDiscord = async () => {
    try {
      await navigator.clipboard.writeText(discord);
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2000);
      toast.success(`Copied Discord (@${discord}) to clipboard!`);
    } catch {
      toast.error("Could not access clipboard");
    }
  };

  const handleDownloadResume = () => {
    const resumeText = `================================================================
${portfolio.name.toUpperCase()} — ${portfolio.role.toUpperCase()}
Location: ${portfolio.location} | Email: ${email} | Discord: @${discord}
GitHub: https://github.com/YashShingan
LinkedIn: https://www.linkedin.com/in/yashshingan
Portfolio Game: https://yashshingan.github.io/portfolio-game/
================================================================

SUMMARY:
${portfolio.about.bio.join("\n\n")}

CORE SKILLS:
${portfolio.skills.map((s) => `• ${s.name}: ${s.skills.join(", ")}`).join("\n")}

FEATURED PROJECTS:
${portfolio.projects
  .map(
    (p) => `• ${p.title} (${p.year})
  ${p.description}
  Tech Stack: ${p.tags.join(", ")}
  Links: ${p.links.map((l) => `${l.label}: ${l.url}`).join(" | ")}`,
  )
  .join("\n\n")}

CONTACT & DISPATCH:
Email: ${email}
Discord: @${discord}
Open for: Full-time Roles, Freelance Collabs & Creative Tech Systems.
================================================================`;

    const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Yash_Shingan_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Resume document downloaded!");
  };

  const handleSendMail = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = senderName.trim() || "Traveler";
    const subject = `[${topic}] Dispatch from ${cleanName}`;
    const body = `${message.trim() || "Hi Yash, I came across your portfolio game and would love to connect!"}\n\n— Sent by ${cleanName} via Portfolio RPG Telegram`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    toast.success("Opening your mail client...");
  };

  const iconFor = (label: string) => {
    if (label === "Email") return <Mail className="h-4 w-4" />;
    if (label === "GitHub") return <Github className="h-4 w-4" />;
    if (label === "Discord") return <MessageSquare className="h-4 w-4" />;
    return <Linkedin className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Retro Telegram Parchment Card */}
      <div className="relative overflow-hidden border-2 border-[#a8862f] bg-[#1a140b] p-4 text-[#f4e8c8] shadow-inner">
        {/* Airmail Ribbon Border */}
        <div
          className="absolute inset-x-0 top-0 h-1.5 opacity-80"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #dc2626 0px, #dc2626 10px, #fef3c7 10px, #fef3c7 20px, #2563eb 20px, #2563eb 30px, #fef3c7 30px, #fef3c7 40px)",
          }}
        />

        {/* Telegram Header */}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-[#856b28] pb-2.5">
          <div>
            <div className="font-pixel text-[9px] tracking-widest text-[#e8c170]">
              TELEGRAPH DISPATCH · POSTAL STATION
            </div>
            <div className="mt-0.5 text-[10px] text-[#a89a76]">
              ORIGIN: {portfolio.location.toUpperCase()} · ROUTE: PRIORITY
            </div>
          </div>
          <div className="rounded border border-[#dc2626]/70 px-2 py-0.5 font-pixel text-[8px] tracking-wider text-[#f87171]">
            EXPRESS
          </div>
        </div>

        {/* Telegram Body Text */}
        <div className="my-3 space-y-1.5 font-mono text-xs leading-relaxed text-[#fef3c7]">
          <p className="border-l-2 border-[#e8c170] pl-2.5 italic">
            &ldquo;{portfolio.contact.blurb} STOP.&rdquo;
          </p>
        </div>

        {/* 1-Click Action Bar */}
        <div className="mt-3 grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="flex items-center justify-center gap-1.5 border border-[#856b28] bg-[#241c10] px-2 py-2 font-pixel text-[8px] sm:text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717] active:scale-95"
          >
            {copiedEmail ? (
              <Check className="h-3 w-3 text-[#86efac]" />
            ) : (
              <Copy className="h-3 w-3 text-[#e8c170]" />
            )}
            <span>{copiedEmail ? "COPIED" : "COPY EMAIL"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyDiscord}
            className="flex items-center justify-center gap-1.5 border border-[#856b28] bg-[#241c10] px-2 py-2 font-pixel text-[8px] sm:text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717] active:scale-95"
          >
            {copiedDiscord ? (
              <Check className="h-3 w-3 text-[#86efac]" />
            ) : (
              <Copy className="h-3 w-3 text-[#e8c170]" />
            )}
            <span>{copiedDiscord ? "COPIED" : "COPY DISCORD"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadResume}
            className="flex items-center justify-center gap-1.5 border border-[#856b28] bg-[#241c10] px-2 py-2 font-pixel text-[8px] sm:text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717] active:scale-95"
          >
            <Download className="h-3 w-3 text-[#e8c170]" />
            <span>RESUME (TXT)</span>
          </button>

          <button
            type="button"
            onClick={onOpenResumeSheet}
            className="flex items-center justify-center gap-1.5 border border-[#a8862f] bg-[#332717] px-2 py-2 font-pixel text-[8px] sm:text-[9px] text-[#fef08a] transition hover:border-[#fde68a] hover:bg-[#42331c] active:scale-95"
          >
            <FileText className="h-3 w-3 text-[#e8c170]" />
            <span>RESUME (PDF)</span>
          </button>
        </div>
      </div>

      {/* Quick Telegram Message Composer (Mailto) */}
      <form
        onSubmit={handleSendMail}
        onKeyDown={(e) => e.stopPropagation()}
        className="space-y-3 border-2 border-[#6b5b33] bg-[#141008] p-3.5"
      >
        <div className="flex items-center justify-between border-b border-[#3d321d] pb-1.5 font-pixel text-[9px] text-[#e8c170]">
          <span className="flex items-center gap-1.5">
            <Send className="h-3 w-3 text-[#e8c170]" /> QUICK TELEGRAM COMPOSER
          </span>
          <span className="text-[8px] text-[#8a7c58]">DIRECT MAILTO</span>
        </div>

        {/* Topic Selector */}
        <div>
          <label className="mb-1 block font-pixel text-[8px] text-[#a89a76]">SELECT TOPIC</label>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {["Job Offer", "Project Collab", "Coffee Chat", "Say Hello"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTopic(t)}
                className={`border px-2 py-1 text-center font-pixel text-[8px] transition ${
                  topic === t
                    ? "border-[#e8c170] bg-[#e8c170]/20 text-[#f5d78e]"
                    : "border-[#4a3f24] bg-[#1a140c] text-[#a89a76] hover:border-[#7a673b]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sender Name & Short Note */}
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="mb-1 block font-pixel text-[8px] text-[#a89a76]">YOUR NAME</label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="e.g. Pixel / HR"
              className="w-full border border-[#4a3f24] bg-[#0d0a06] px-2.5 py-1.5 text-xs text-[#f4e8c8] outline-none transition focus:border-[#e8c170]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block font-pixel text-[8px] text-[#a89a76]">NOTE</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Loved your game! Let's talk about..."
              className="w-full border border-[#4a3f24] bg-[#0d0a06] px-2.5 py-1.5 text-xs text-[#f4e8c8] outline-none transition focus:border-[#e8c170]"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 border-b-4 border-[#a8862f] bg-[#e8c170] py-2 font-pixel text-[10px] text-[#221d14] transition hover:bg-[#f5d78e] active:translate-y-[1px] active:border-b-2"
        >
          <Mail className="h-3.5 w-3.5" />
          <span>DISPATCH TELEGRAM MESSAGE</span>
        </button>
      </form>

      {/* All Links Cards */}
      <div className="grid gap-2 sm:grid-cols-2">
        {portfolio.contact.links.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target={l.url.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="flex items-center gap-2.5 border-2 border-[#4a3f24] bg-[#141008] px-3 py-2.5 transition-colors hover:border-[#e8c170]"
          >
            <span className="text-[#e8c170]">{iconFor(l.label)}</span>
            <div className="min-w-0">
              <div className="font-pixel text-[9px] text-[#f4e8c8]">{l.label}</div>
              <div className="truncate text-[11px] text-[#a89a76]">{l.value}</div>
            </div>
            <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-[#8a7c58]" />
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

export function ZoneModal({
  payload,
  onClose,
  onOpenResumeSheet,
}: {
  payload: ZonePayload;
  onClose: () => void;
  onOpenResumeSheet?: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && payload.kind !== "dialogue" && payload.kind !== "secret") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, payload.kind]);

  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center p-4 sm:items-center"
      onKeyDown={(e) => {
        if (e.key !== "Escape") e.stopPropagation();
      }}
    >
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
        {payload.kind === "contact" && <Contact onOpenResumeSheet={onOpenResumeSheet} />}
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
