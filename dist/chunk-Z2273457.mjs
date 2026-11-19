import { ArcadeMiniGame } from './chunk-PKPKEXDZ.mjs';
import { portfolio, emitGameEvent, unlock } from './chunk-OHMSBSCU.mjs';
import { audio } from './chunk-ISDBGZ27.mjs';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, X, Github, Check, Copy, Download, FileText, Send, Mail, ExternalLink, Sparkles, Coins, MessageSquare, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { jsxs, jsx } from 'react/jsx-runtime';

function Kbd({ children }) {
  return /* @__PURE__ */ jsx("kbd", { className: "inline-flex min-w-7 items-center justify-center border-2 border-[#a8862f] bg-[#141008] px-1.5 py-0.5 font-pixel text-[9px] text-[#e8c170]", children });
}
function TagChip({ children }) {
  return /* @__PURE__ */ jsx("span", { className: "border-2 border-[#6b5b33] bg-[#141008] px-2 py-1 text-[11px] text-[#cdb87e]", children });
}
function GoldButton({
  href,
  children
}) {
  return /* @__PURE__ */ jsx(
    "a",
    {
      href,
      target: href.startsWith("http") ? "_blank" : void 0,
      rel: "noreferrer",
      className: "inline-flex items-center gap-2 border-b-4 border-[#a8862f] bg-[#e8c170] px-4 py-2.5 font-pixel text-[10px] text-[#221d14] transition-transform hover:bg-[#f5d78e] active:translate-y-[2px] active:border-b-0",
      children
    }
  );
}
function useTypewriter(text, speed = 17) {
  const [count, setCount] = useState(0);
  const [prevText, setPrevText] = useState(text);
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
function Dialogue({ npcId, onClose }) {
  var _a;
  const npc = portfolio.npcs.find((n) => n.id === npcId);
  const [line, setLine] = useState(0);
  const tw = useTypewriter((_a = npc == null ? void 0 : npc.lines[line]) != null ? _a : "");
  const next = useCallback(() => {
    if (!tw.done) tw.finish();
    else if (npc && line < npc.lines.length - 1) setLine((l) => l + 1);
    else onClose();
  }, [tw, npc, line, onClose]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (["Enter", " ", "e", "E"].includes(e.key)) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, onClose]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "cursor-pointer select-none",
      onClick: next,
      role: "button",
      tabIndex: -1,
      "aria-label": "Dialogue \u2014 click to continue",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center border-4 border-[#e8c170] bg-[#141008] text-3xl", children: npc == null ? void 0 : npc.emoji }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-pixel text-[11px] text-[#e8c170]", children: npc == null ? void 0 : npc.name }),
            /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs italic text-[#a89a76]", children: npc == null ? void 0 : npc.intro })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "ml-auto font-pixel text-[9px] text-[#8a7c58]", children: [
            line + 1,
            "/",
            npc == null ? void 0 : npc.lines.length
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "min-h-20 text-sm leading-relaxed text-[#f4e8c8]", children: [
          tw.shown,
          /* @__PURE__ */ jsx("span", { className: "animate-blink", children: "\u258C" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 text-[#e8c170]", children: [
          /* @__PURE__ */ jsx("span", { className: "font-pixel text-[9px]", children: tw.done ? "CLICK TO CONTINUE" : "" }),
          tw.done && /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 animate-bounce" })
        ] })
      ]
    }
  );
}
function Welcome() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-sm leading-relaxed text-[#f4e8c8]", children: [
    /* @__PURE__ */ jsxs("p", { children: [
      "Welcome to ",
      /* @__PURE__ */ jsxs("strong", { className: "text-[#e8c170]", children: [
        portfolio.name,
        "'s"
      ] }),
      " world. This whole site is a game \u2014 walk around, poke things, see what responds."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-2 border-[#6b5b33] bg-[#141008] p-3", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-2 font-pixel text-[9px] text-[#e8c170]", children: "DESKTOP" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Kbd, { children: "W" }),
          /* @__PURE__ */ jsx(Kbd, { children: "A" }),
          /* @__PURE__ */ jsx(Kbd, { children: "S" }),
          /* @__PURE__ */ jsx(Kbd, { children: "D" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-[#a89a76]", children: "or arrows to walk" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Kbd, { children: "E" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-[#a89a76]", children: "to interact" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Kbd, { children: "ESC" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-[#a89a76]", children: "to close popups" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-2 border-[#6b5b33] bg-[#141008] p-3", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-2 font-pixel text-[9px] text-[#e8c170]", children: "MOBILE" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#a89a76]", children: "Use the joystick (bottom-left) to walk and the big gold button (bottom-right) to interact." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-[#a89a76]", children: "Heads up: there are achievements. And at least one thing hidden in the north-east that most people never find." })
  ] });
}
var DEVELOPER_FORTUNES = [
  {
    quote: "There are only two hard things in Computer Science: cache invalidation and naming things.",
    author: "Phil Karlton"
  },
  {
    quote: "It's not a bug, it's an undocumented feature.",
    author: "Anonymous Sysadmin"
  },
  {
    quote: "The code works on my machine. Therefore, we will ship your machine to production.",
    author: "DevOps Oracle"
  },
  {
    quote: "A git commit a day keeps the catastrophic merge conflicts away.",
    author: "Ancient Git Proverb"
  },
  {
    quote: "Before software can be reusable it first has to be usable.",
    author: "Ralph Johnson"
  },
  {
    quote: "Any code you haven't looked at for six months might as well have been written by someone else.",
    author: "Eagleson's Law"
  },
  {
    quote: "Deleted code is debugged code.",
    author: "Jeff Sickel"
  },
  {
    quote: "Walking on water and developing software from a specification are easy if both are frozen.",
    author: "Edward V. Berard"
  },
  {
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    quote: "There is nothing quite so permanent as a quick temporary workaround.",
    author: "Senior Staff Engineer"
  },
  {
    quote: "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
    author: "John Woods"
  },
  {
    quote: "A lucky commit awaits you. May your next pull request be approved without a single review comment.",
    author: "Fountain Oracle"
  },
  {
    quote: "The best error message is the one that never shows up.",
    author: "Site Reliability Sage"
  },
  {
    quote: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra"
  },
  {
    quote: "May your queries be fast, your caches warm, and your p99 latency strictly sub-millisecond.",
    author: "Database Guardian"
  },
  {
    quote: "Good code is its own best documentation. As you're about to add a comment, ask yourself: How can I improve the code so that this comment isn't needed?",
    author: "Steve McConnell"
  },
  {
    quote: "The secret to 10x developer productivity: 8 hours of sleep and reading the actual error stack trace.",
    author: "Pragmatic Octo"
  },
  {
    quote: "You will soon discover that one missing semicolon that kept you awake until 3 AM.",
    author: "Compiler Whisperer"
  },
  {
    quote: "Premature optimization is the root of all evil (or at least 97% of it).",
    author: "Donald Knuth"
  },
  {
    quote: "In theory, there is no difference between theory and practice. In practice, there is.",
    author: "Jan L. A. van de Snepscheut"
  },
  {
    quote: "Weeks of programming can save you hours of planning.",
    author: "Engineering Folklore"
  },
  {
    quote: "Today's fortune: That flaky test in CI will pass on the third retry without changing a single line of code.",
    author: "Pipeline Mystic"
  },
  {
    quote: "Make it work, make it right, make it fast.",
    author: "Kent Beck"
  },
  {
    quote: "Beware of bugs in the above code; I have only proved it correct, not tried it.",
    author: "Donald Knuth"
  }
];
function FountainOfWisdom() {
  const [currentFortune, setCurrentFortune] = useState(null);
  const [tossCount, setTossCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const handleTossCoin = () => {
    audio.coin();
    emitGameEvent("pg:fountain-toss", void 0);
    unlock("big-spender");
    let next;
    do {
      next = DEVELOPER_FORTUNES[Math.floor(Math.random() * DEVELOPER_FORTUNES.length)];
    } while (DEVELOPER_FORTUNES.length > 1 && currentFortune && next.quote === currentFortune.quote);
    setCurrentFortune(next);
    setTossCount((c) => c + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden border-2 border-[#a8862f] bg-[#1a140b] p-4 text-[#f4e8c8] shadow-inner", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-x-0 top-0 h-1.5 opacity-80",
        style: {
          backgroundImage: "repeating-linear-gradient(45deg, #38bdf8 0px, #38bdf8 10px, #fef08a 10px, #fef08a 20px, #0284c7 20px, #0284c7 30px, #f59e0b 30px, #f59e0b 40px)"
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-[#856b28] pb-2.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xl", children: "\u26F2" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-pixel text-[9px] tracking-widest text-[#e8c170]", children: "FOUNTAIN OF WISDOM \xB7 WISHING WELL" }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-[10px] text-[#a89a76]", children: "CENTRAL PLAZA ORACLE \xB7 MAKE A WISH" })
        ] })
      ] }),
      tossCount > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 rounded border border-[#856b28] bg-[#241c10] px-2 py-0.5 font-pixel text-[8px] text-[#fde68a]", children: /* @__PURE__ */ jsxs("span", { children: [
        "\u{1FA99} TOSSES: ",
        tossCount
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "my-3 min-h-16", children: currentFortune ? /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.25 },
        className: "rounded border border-[#a8862f]/60 bg-[#120e07] p-3 shadow-md",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-1 flex items-center justify-between font-pixel text-[8px] text-[#e8c170]", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 text-[#fde047]" }),
              " THE ORACLE SPEAKS:"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[#856b28]", children: [
              "LUCKY COIN #",
              tossCount
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "border-l-2 border-[#e8c170] pl-2.5 italic text-sm text-[#fef08a] leading-relaxed", children: [
            "\u201C",
            currentFortune.quote,
            "\u201D"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1.5 text-right font-pixel text-[8px] text-[#cdb87e]", children: [
            "\u2014 ",
            currentFortune.author
          ] })
        ]
      },
      currentFortune.quote + tossCount
    ) : /* @__PURE__ */ jsx("p", { className: "text-xs italic leading-relaxed text-[#cdb87e]", children: "Legend whispers that tossing a golden coin into the fountain grants crystal-clear compiler insight and reveals ancient developer fortunes. Toss a coin to test your luck!" }) }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: handleTossCoin,
        className: `flex w-full items-center justify-center gap-2 border-b-4 border-[#a8862f] bg-[#e8c170] py-2.5 font-pixel text-[10px] text-[#221d14] transition-all hover:bg-[#f5d78e] active:translate-y-[2px] active:border-b-0 ${isAnimating ? "scale-[0.98] ring-2 ring-[#fde047]" : ""}`,
        children: [
          /* @__PURE__ */ jsx(Coins, { className: "h-4 w-4 text-[#854d0e]" }),
          /* @__PURE__ */ jsx("span", { children: "\u{1FA99} TOSS A COIN INTO THE FOUNTAIN" })
        ]
      }
    )
  ] });
}
function About() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 shrink-0 items-center justify-center border-4 border-[#e8c170] bg-[#141008] text-3xl", children: portfolio.about.emoji }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "font-pixel text-[11px] text-[#e8c170]", children: [
          portfolio.name,
          " \u2014 ",
          portfolio.role
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs italic text-[#a89a76]", children: portfolio.tagline })
      ] })
    ] }),
    portfolio.about.bio.map((p, i) => /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-[#f4e8c8]", children: p }, i)),
    /* @__PURE__ */ jsx(FountainOfWisdom, {}),
    /* @__PURE__ */ jsxs("div", { className: "border-2 border-[#6b5b33] bg-[#141008] p-3", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-2 font-pixel text-[9px] text-[#e8c170]", children: "FUN FACTS" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: portfolio.about.funFacts.map((f, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2 text-xs text-[#cdb87e]", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[#e8c170]", children: "\u2726" }),
        f
      ] }, i)) })
    ] })
  ] });
}
function Project({ projectId }) {
  const p = portfolio.projects.find((x) => x.id === projectId);
  if (!p) return null;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 shrink-0 items-center justify-center border-4 border-[#e8c170] bg-[#141008] text-3xl", children: p.emoji }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "font-pixel text-[11px] leading-relaxed text-[#e8c170]", children: p.title }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 font-pixel text-[9px] text-[#8a7c58]", children: p.year })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-[#f4e8c8]", children: p.description }),
    projectId === "p0" && /* @__PURE__ */ jsx(ArcadeMiniGame, {}),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: p.tags.map((t) => /* @__PURE__ */ jsx(TagChip, { children: t }, t)) }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: p.links.map((l) => /* @__PURE__ */ jsxs(GoldButton, { href: l.url, children: [
      /* @__PURE__ */ jsx(Github, { className: "h-3.5 w-3.5" }),
      l.label
    ] }, l.url)) })
  ] });
}
function Skills({ skillId }) {
  const s = portfolio.skills.find((x) => x.id === skillId);
  if (!s) return null;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 shrink-0 items-center justify-center border-4 border-[#e8c170] bg-[#141008] text-3xl", children: s.emoji }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "font-pixel text-[11px] text-[#e8c170]", children: s.name }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs italic text-[#a89a76]", children: s.description })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: s.skills.map((sk) => /* @__PURE__ */ jsx(TagChip, { children: sk }, sk)) })
  ] });
}
function Contact({ onOpenResumeSheet }) {
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
      setTimeout(() => setCopiedEmail(false), 2e3);
      toast.success(`Copied email (${email}) to clipboard!`);
    } catch (e) {
      toast.error("Could not access clipboard");
    }
  };
  const handleCopyDiscord = async () => {
    try {
      await navigator.clipboard.writeText(discord);
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2e3);
      toast.success(`Copied Discord (@${discord}) to clipboard!`);
    } catch (e) {
      toast.error("Could not access clipboard");
    }
  };
  const handleDownloadResume = () => {
    const resumeText = `================================================================
${portfolio.name.toUpperCase()} \u2014 ${portfolio.role.toUpperCase()}
Location: ${portfolio.location} | Email: ${email} | Discord: @${discord}
GitHub: https://github.com/YashShingan
LinkedIn: https://www.linkedin.com/in/yashshingan
Portfolio Game: https://yashshingan.github.io/portfolio-game/
================================================================

SUMMARY:
${portfolio.about.bio.join("\n\n")}

CORE SKILLS:
${portfolio.skills.map((s) => `\u2022 ${s.name}: ${s.skills.join(", ")}`).join("\n")}

FEATURED PROJECTS:
${portfolio.projects.map(
      (p) => `\u2022 ${p.title} (${p.year})
  ${p.description}
  Tech Stack: ${p.tags.join(", ")}
  Links: ${p.links.map((l) => `${l.label}: ${l.url}`).join(" | ")}`
    ).join("\n\n")}

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
  const handleSendMail = (e) => {
    e.preventDefault();
    const cleanName = senderName.trim() || "Traveler";
    const subject = `[${topic}] Dispatch from ${cleanName}`;
    const body = `${message.trim() || "Hi Yash, I came across your portfolio game and would love to connect!"}

\u2014 Sent by ${cleanName} via Portfolio RPG Telegram`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    toast.success("Opening your mail client...");
  };
  const iconFor = (label) => {
    if (label === "Email") return /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" });
    if (label === "GitHub") return /* @__PURE__ */ jsx(Github, { className: "h-4 w-4" });
    if (label === "Discord") return /* @__PURE__ */ jsx(MessageSquare, { className: "h-4 w-4" });
    return /* @__PURE__ */ jsx(Linkedin, { className: "h-4 w-4" });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden border-2 border-[#a8862f] bg-[#1a140b] p-4 text-[#f4e8c8] shadow-inner", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-x-0 top-0 h-1.5 opacity-80",
          style: {
            backgroundImage: "repeating-linear-gradient(45deg, #dc2626 0px, #dc2626 10px, #fef3c7 10px, #fef3c7 20px, #2563eb 20px, #2563eb 30px, #fef3c7 30px, #fef3c7 40px)"
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-[#856b28] pb-2.5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-pixel text-[9px] tracking-widest text-[#e8c170]", children: "TELEGRAPH DISPATCH \xB7 POSTAL STATION" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-0.5 text-[10px] text-[#a89a76]", children: [
            "ORIGIN: ",
            portfolio.location.toUpperCase(),
            " \xB7 ROUTE: PRIORITY"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded border border-[#dc2626]/70 px-2 py-0.5 font-pixel text-[8px] tracking-wider text-[#f87171]", children: "EXPRESS" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "my-3 space-y-1.5 font-mono text-xs leading-relaxed text-[#fef3c7]", children: /* @__PURE__ */ jsxs("p", { className: "border-l-2 border-[#e8c170] pl-2.5 italic", children: [
        "\u201C",
        portfolio.contact.blurb,
        " STOP.\u201D"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleCopyEmail,
            className: "flex items-center justify-center gap-1.5 border border-[#856b28] bg-[#241c10] px-2 py-2 font-pixel text-[8px] sm:text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717] active:scale-95",
            children: [
              copiedEmail ? /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 text-[#86efac]" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3 text-[#e8c170]" }),
              /* @__PURE__ */ jsx("span", { children: copiedEmail ? "COPIED" : "COPY EMAIL" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleCopyDiscord,
            className: "flex items-center justify-center gap-1.5 border border-[#856b28] bg-[#241c10] px-2 py-2 font-pixel text-[8px] sm:text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717] active:scale-95",
            children: [
              copiedDiscord ? /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 text-[#86efac]" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3 text-[#e8c170]" }),
              /* @__PURE__ */ jsx("span", { children: copiedDiscord ? "COPIED" : "COPY DISCORD" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleDownloadResume,
            className: "flex items-center justify-center gap-1.5 border border-[#856b28] bg-[#241c10] px-2 py-2 font-pixel text-[8px] sm:text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717] active:scale-95",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "h-3 w-3 text-[#e8c170]" }),
              /* @__PURE__ */ jsx("span", { children: "RESUME (TXT)" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: onOpenResumeSheet,
            className: "flex items-center justify-center gap-1.5 border border-[#a8862f] bg-[#332717] px-2 py-2 font-pixel text-[8px] sm:text-[9px] text-[#fef08a] transition hover:border-[#fde68a] hover:bg-[#42331c] active:scale-95",
            children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-3 w-3 text-[#e8c170]" }),
              /* @__PURE__ */ jsx("span", { children: "RESUME (PDF)" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleSendMail,
        onKeyDown: (e) => e.stopPropagation(),
        className: "space-y-3 border-2 border-[#6b5b33] bg-[#141008] p-3.5",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[#3d321d] pb-1.5 font-pixel text-[9px] text-[#e8c170]", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Send, { className: "h-3 w-3 text-[#e8c170]" }),
              " QUICK TELEGRAM COMPOSER"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[8px] text-[#8a7c58]", children: "DIRECT MAILTO" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block font-pixel text-[8px] text-[#a89a76]", children: "SELECT TOPIC" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-1.5 sm:grid-cols-4", children: ["Job Offer", "Project Collab", "Coffee Chat", "Say Hello"].map((t) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setTopic(t),
                className: `border px-2 py-1 text-center font-pixel text-[8px] transition ${topic === t ? "border-[#e8c170] bg-[#e8c170]/20 text-[#f5d78e]" : "border-[#4a3f24] bg-[#1a140c] text-[#a89a76] hover:border-[#7a673b]"}`,
                children: t
              },
              t
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-1", children: [
              /* @__PURE__ */ jsx("label", { className: "mb-1 block font-pixel text-[8px] text-[#a89a76]", children: "YOUR NAME" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: senderName,
                  onChange: (e) => setSenderName(e.target.value),
                  onKeyDown: (e) => e.stopPropagation(),
                  placeholder: "e.g. Pixel / HR",
                  className: "w-full border border-[#4a3f24] bg-[#0d0a06] px-2.5 py-1.5 text-xs text-[#f4e8c8] outline-none transition focus:border-[#e8c170]"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "mb-1 block font-pixel text-[8px] text-[#a89a76]", children: "NOTE" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: message,
                  onChange: (e) => setMessage(e.target.value),
                  onKeyDown: (e) => e.stopPropagation(),
                  placeholder: "Loved your game! Let's talk about...",
                  className: "w-full border border-[#4a3f24] bg-[#0d0a06] px-2.5 py-1.5 text-xs text-[#f4e8c8] outline-none transition focus:border-[#e8c170]"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              className: "flex w-full items-center justify-center gap-2 border-b-4 border-[#a8862f] bg-[#e8c170] py-2 font-pixel text-[10px] text-[#221d14] transition hover:bg-[#f5d78e] active:translate-y-[1px] active:border-b-2",
              children: [
                /* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "DISPATCH TELEGRAM MESSAGE" })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: portfolio.contact.links.map((l) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: l.url,
        target: l.url.startsWith("http") ? "_blank" : void 0,
        rel: "noreferrer",
        className: "flex items-center gap-2.5 border-2 border-[#4a3f24] bg-[#141008] px-3 py-2.5 transition-colors hover:border-[#e8c170]",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#e8c170]", children: iconFor(l.label) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "font-pixel text-[9px] text-[#f4e8c8]", children: l.label }),
            /* @__PURE__ */ jsx("div", { className: "truncate text-[11px] text-[#a89a76]", children: l.value })
          ] }),
          /* @__PURE__ */ jsx(ExternalLink, { className: "ml-auto h-3.5 w-3.5 shrink-0 text-[#8a7c58]" })
        ]
      },
      l.url
    )) })
  ] });
}
function Secret({ onClose }) {
  var _a;
  const [line, setLine] = useState(0);
  const tw = useTypewriter((_a = portfolio.secret.lines[line]) != null ? _a : "", 14);
  const next = useCallback(() => {
    if (!tw.done) tw.finish();
    else if (line < portfolio.secret.lines.length - 1) setLine((l) => l + 1);
    else onClose();
  }, [tw, line, onClose]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (["Enter", " ", "e", "E"].includes(e.key)) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, onClose]);
  return /* @__PURE__ */ jsxs("div", { className: "cursor-pointer select-none space-y-3", onClick: next, role: "button", tabIndex: -1, children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-20 w-20 items-center justify-center border-4 border-[#f5d78e] bg-[#141008] text-4xl shadow-[0_0_30px_rgba(232,193,112,0.35)]", children: portfolio.secret.emoji }),
    /* @__PURE__ */ jsxs("p", { className: "min-h-16 text-sm leading-relaxed text-[#f5d78e]", children: [
      tw.shown,
      /* @__PURE__ */ jsx("span", { className: "animate-blink", children: "\u258C" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-right font-pixel text-[9px] text-[#c9a44e]", children: tw.done ? `${line + 1}/${portfolio.secret.lines.length} \xB7 CLICK TO CONTINUE` : "" })
  ] });
}
var KIND_META = {
  welcome: "\u{1F4D6}",
  about: "\u26F2",
  project: "\u{1F4CB}",
  skills: "\u{1F33F}",
  contact: "\u{1F4EE}",
  dialogue: "\u{1F4AC}",
  secret: "\u2728"
};
function ZoneModal({
  payload,
  onClose,
  onOpenResumeSheet
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && payload.kind !== "dialogue" && payload.kind !== "secret") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, payload.kind]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "absolute inset-0 z-30 flex items-end justify-center p-4 sm:items-center",
      onKeyDown: (e) => {
        if (e.key !== "Escape") e.stopPropagation();
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 bg-black/60",
            onClick: payload.kind === "dialogue" || payload.kind === "secret" ? void 0 : onClose,
            "aria-hidden": true
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 24, scale: 0.96 },
            animate: { opacity: 1, y: 0, scale: 1 },
            transition: { type: "spring", stiffness: 380, damping: 28 },
            role: "dialog",
            "aria-modal": "true",
            "aria-label": payload.title,
            className: `pixel-panel relative z-10 max-h-[82dvh] w-full max-w-lg overflow-y-auto p-5 sm:p-6 ${payload.kind === "secret" ? "border-[#f5d78e]" : ""}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between border-b-2 border-dashed border-[#6b5b33] pb-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xl", children: KIND_META[payload.kind] }),
                /* @__PURE__ */ jsx("span", { className: "font-pixel text-[11px] text-[#e8c170]", children: payload.title }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: onClose,
                    "aria-label": "Close",
                    className: "border-2 border-[#6b5b33] bg-[#141008] p-1.5 text-[#cdb87e] transition-colors hover:border-[#e8c170] hover:text-[#e8c170]",
                    children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
                  }
                )
              ] }),
              payload.kind === "welcome" && /* @__PURE__ */ jsx(Welcome, {}),
              payload.kind === "about" && /* @__PURE__ */ jsx(About, {}),
              payload.kind === "project" && /* @__PURE__ */ jsx(Project, { projectId: payload.projectId }),
              payload.kind === "skills" && /* @__PURE__ */ jsx(Skills, { skillId: payload.skillId }),
              payload.kind === "contact" && /* @__PURE__ */ jsx(Contact, { onOpenResumeSheet }),
              payload.kind === "dialogue" && /* @__PURE__ */ jsx(Dialogue, { npcId: payload.npcId, onClose }),
              payload.kind === "secret" && /* @__PURE__ */ jsx(Secret, { onClose }),
              payload.kind !== "dialogue" && payload.kind !== "secret" && /* @__PURE__ */ jsx("p", { className: "mt-5 border-t-2 border-dashed border-[#6b5b33] pt-3 text-center font-pixel text-[8px] text-[#8a7c58]", children: "ESC OR TAP OUTSIDE TO CLOSE" })
            ]
          }
        )
      ]
    }
  );
}

export { Dialogue, ZoneModal, useTypewriter };
