import { __export } from './chunk-STROURK6.mjs';

// src/game/systems/events.ts
var events_exports = {};
__export(events_exports, {
  emitGameEvent: () => emitGameEvent,
  getLocalTimeMode: () => getLocalTimeMode,
  onGameEvent: () => onGameEvent
});
function getLocalTimeMode() {
  const hour = (/* @__PURE__ */ new Date()).getHours();
  if (hour >= 19 || hour < 6) return "night";
  if (hour >= 17 && hour < 19) return "sunset";
  return "day";
}
function emitGameEvent(type, detail) {
  window.dispatchEvent(new CustomEvent(type, { detail }));
}
function onGameEvent(type, handler) {
  const listener = (e) => {
    handler(e.detail);
  };
  window.addEventListener(type, listener);
  return () => window.removeEventListener(type, listener);
}

// src/config/portfolio.ts
var portfolio = {
  name: "Yash Shingan",
  role: "Creative Developer",
  tagline: "I build playful, interactive experiences for the web.",
  location: "India",
  about: {
    emoji: "\u26F2",
    bio: [
      "Hi! I'm Yash \u2014 a creative developer who believes a portfolio should be an experience, not a PDF. A few years ago I built my first portfolio-as-a-game with Phaser. It was slow, unoptimized and honestly a bit janky \u2014 so I rebuilt it from scratch, properly this time.",
      "I care about the details most people scroll past: the feel of a keyboard shortcut, how a page loads on a phone, whether a button is satisfying to press. When I'm not coding you'll find me sketching game maps or replaying the soundtrack of whatever I last shipped."
    ],
    funFacts: [
      "This is my portfolio's second life \u2014 v1 was 2 years ago",
      "I once removed a sprite background at runtime... every frame (never again)",
      "The octopus you're walking around as? That's GitHub's mascot. Ink likes visitors."
    ]
  },
  // Each project gets its own noticeboard in the game world
  projects: [
    {
      id: "p0",
      emoji: "\u{1F579}\uFE0F",
      title: "This Portfolio Game",
      year: "2026",
      description: "My portfolio re-imagined as a top-down pixel RPG. Rebuilt from v1 with a fixed 3000\xD73000 world, camera scrolling, event-driven interactions, procedural chiptune audio, full mobile controls and achievements. Nostalgia, but optimized.",
      tags: ["Phaser 3", "Next.js 16", "TypeScript", "Canvas"],
      links: [
        { label: "Live Game Demo", url: "https://yashshingan.github.io/portfolio-game/" },
        { label: "View Source Code", url: "https://github.com/YashShingan/portfolio-game" }
      ]
    },
    {
      id: "p1",
      emoji: "\u{1F680}",
      title: "Your Awesome Project #1",
      year: "20XX",
      description: "TODO(you): Replace this with a real project. What did you build? What was hard about it? What did you learn? Recruiters love a concrete story: 'Dashboard that visualizes X for Y users'.",
      tags: ["React", "Node.js", "TODO"],
      links: [{ label: "TODO \u2014 add repo link", url: "https://github.com/YashShingan" }]
    },
    {
      id: "p2",
      emoji: "\u{1F6E0}\uFE0F",
      title: "Your Awesome Project #2",
      year: "20XX",
      description: "TODO(you): Another real project goes here. Open-source contributions, hackathon wins and side projects all count. Aim for 3\u20134 total \u2014 enough breadth without padding.",
      tags: ["TypeScript", "Python", "TODO"],
      links: [{ label: "TODO \u2014 add repo link", url: "https://github.com/YashShingan" }]
    },
    {
      id: "p3",
      emoji: "\u{1F52E}",
      title: "Your Awesome Project #3",
      year: "20XX",
      description: "TODO(you): Last board! This one could be the weird experimental thing you're proudest of, even if it never shipped. Those make the best conversations.",
      tags: ["WebGL", "Three.js", "TODO"],
      links: [{ label: "TODO \u2014 add repo link", url: "https://github.com/YashShingan" }]
    }
  ],
  // Each group blooms as one flower patch in the Skills Garden
  skills: [
    {
      id: "s0",
      name: "Frontend",
      emoji: "\u{1F3A8}",
      description: "The pixels people actually see \u2014 and the ones they don't (looking at you, z-index).",
      skills: ["React", "Next.js", "TypeScript", "Tailwind", "Phaser 3", "HTML/CSS"]
    },
    {
      id: "s1",
      name: "Backend",
      emoji: "\u2699\uFE0F",
      description: "Boring on the outside, load-bearing on the inside.",
      skills: ["Node.js", "Python", "REST APIs", "PostgreSQL", "Bun"]
    },
    {
      id: "s2",
      name: "Tools & Craft",
      emoji: "\u{1F9F0}",
      description: "Things I'd feel naked without.",
      skills: ["Git", "GitHub Actions", "Docker", "Figma", "Vitest"]
    }
  ],
  contact: {
    emoji: "\u{1F4EE}",
    email: "yash@example.com",
    discord: "yashshingan",
    blurb: "Whether it's a full-time engineering role, an ambitious creative project, or a quick coffee chat \u2014 my telegram desk is always open.",
    links: [
      { label: "Email", value: "yash@example.com", url: "mailto:yash@example.com" },
      { label: "GitHub", value: "@YashShingan", url: "https://github.com/YashShingan" },
      { label: "LinkedIn", value: "Connect on LinkedIn", url: "https://www.linkedin.com/in/yashshingan" },
      { label: "Discord", value: "@yashshingan", url: "https://discord.com" }
    ]
  },
  // NPCs you can chat with in the world
  npcs: [
    {
      id: "old-octo",
      name: "Old Octo",
      emoji: "\u{1F9D9}",
      tint: 10134704,
      intro: "Old Octo adjusts his tiny glasses and looks up.",
      lines: [
        "Ah, a visitor! Not many make it past the loading screen these days.",
        "I've watched Yash code for years. The boy once removed an image background pixel-by-pixel on every page load. EVERY. LOAD.",
        "We octopi have three hearts. He puts at least that many into his projects.",
        "Say... rumors speak of a treasure tucked away in the NORTH-EAST corner of this world. Nobody believed the last recruiter who saw it."
      ]
    },
    {
      id: "pixel",
      name: "Pixel the Recruiter",
      emoji: "\u{1F4BC}",
      tint: 14258063,
      intro: "Pixel stops tapping on her phone and smiles.",
      lines: [
        "Oh hey! I was just reading Yash's resume for the fifth time. Great whitepaper-length bullet points, very quantified.",
        "Between us? Candidates who build their portfolio as a GAME get remembered. Guess who's getting remembered right now.",
        "Check the noticeboards up north for his projects, and the garden to the east for his skills. I did. Twice.",
        "If you're hiring, you'll find a mailbox just south of here. Tell him Pixel sent you."
      ]
    }
  ],
  secret: {
    emoji: "\u{1F381}",
    lines: [
      "You found the hidden treasure chest!",
      "Inside is a note: 'If you found this, you're exactly the kind of curious person I want to work with. Seriously \u2014 email me. You win.'",
      "(Achievement unlocked, explorer. There's nothing else in the chest. The chest was inside you all along.)"
    ]
  }
};

// src/game/systems/achievements.ts
var STORAGE_KEY = "pg_achievements_v2";
var ACHIEVEMENTS = [
  { id: "first-steps", title: "First Steps", desc: "Moved your tiny octopus legs", emoji: "\u{1F463}" },
  { id: "explorer", title: "World Explorer", desc: "Visited all four districts", emoji: "\u{1F5FA}\uFE0F" },
  { id: "bookworm", title: "Bookworm", desc: "Read every project noticeboard", emoji: "\u{1F4DA}" },
  { id: "social", title: "Social Butterfly", desc: "Talked to every NPC in the world", emoji: "\u{1F4AC}" },
  { id: "curious", title: "Curious Mind", desc: "Found what hides in the north-east", emoji: "\u{1F48E}" },
  { id: "big-spender", title: "Big Spender", desc: "Tossed a lucky coin into the central fountain", emoji: "\u{1FA99}" },
  { id: "konami", title: "Cheater Detected", desc: "\u2191\u2191\u2193\u2193\u2190\u2192\u2190\u2192BA", emoji: "\u{1F3AE}" }
];
function unlockedIds() {
  if (typeof window === "undefined") return /* @__PURE__ */ new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return /* @__PURE__ */ new Set();
  }
}
function unlock(id) {
  const all = unlockedIds();
  if (all.has(id)) return false;
  all.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...all]));
  const def = ACHIEVEMENTS.find((a) => a.id === id);
  if (def) emitGameEvent("pg:achievement", def);
  return true;
}

export { ACHIEVEMENTS, emitGameEvent, events_exports, getLocalTimeMode, onGameEvent, portfolio, unlock, unlockedIds };
