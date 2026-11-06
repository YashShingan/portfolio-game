// ============================================================
// ✏️ YOUR PORTFOLIO LIVES HERE — edit this file to make it yours!
// Everything in the game AND the landing page reads from this
// single config. Items marked with "TODO(you)" are placeholders.
// ============================================================

export interface Project {
  id: string;
  emoji: string;
  title: string;
  year: string;
  description: string;
  tags: string[];
  links: { label: string; url: string }[];
}

export interface SkillGroup {
  id: string;
  name: string;
  emoji: string;
  description: string;
  skills: string[];
}

export interface NpcDialogue {
  id: string;
  name: string;
  emoji: string;
  /** CSS tint applied to the octopus sprite */
  tint: number;
  intro: string;
  lines: string[];
}

export const portfolio = {
  name: "Yash Shingan",
  role: "Creative Developer",
  tagline: "I build playful, interactive experiences for the web.",
  location: "India",

  about: {
    emoji: "⛲",
    bio: [
      "Hi! I'm Yash — a creative developer who believes a portfolio should be an experience, not a PDF. A few years ago I built my first portfolio-as-a-game with Phaser. It was slow, unoptimized and honestly a bit janky — so I rebuilt it from scratch, properly this time.",
      "I care about the details most people scroll past: the feel of a keyboard shortcut, how a page loads on a phone, whether a button is satisfying to press. When I'm not coding you'll find me sketching game maps or replaying the soundtrack of whatever I last shipped.",
    ],
    funFacts: [
      "This is my portfolio's second life — v1 was 2 years ago",
      "I once removed a sprite background at runtime... every frame (never again)",
      "The octopus you're walking around as? That's GitHub's mascot. Ink likes visitors.",
    ],
  },

  // Each project gets its own noticeboard in the game world
  projects: [
    {
      id: "p0",
      emoji: "🕹️",
      title: "This Portfolio Game",
      year: "2026",
      description:
        "My portfolio re-imagined as a top-down pixel RPG. Rebuilt from v1 with a fixed 3000×3000 world, camera scrolling, event-driven interactions, procedural chiptune audio, full mobile controls and achievements. Nostalgia, but optimized.",
      tags: ["Phaser 3", "Next.js 16", "TypeScript", "Canvas"],
      links: [
        { label: "Live Game Demo", url: "https://yashshingan.github.io/portfolio-game/" },
        { label: "View Source Code", url: "https://github.com/YashShingan/portfolio-game" },
      ],
    },
    {
      id: "p1",
      emoji: "🚀",
      title: "Your Awesome Project #1",
      year: "20XX",
      description:
        "TODO(you): Replace this with a real project. What did you build? What was hard about it? What did you learn? Recruiters love a concrete story: 'Dashboard that visualizes X for Y users'.",
      tags: ["React", "Node.js", "TODO"],
      links: [{ label: "TODO — add repo link", url: "https://github.com/YashShingan" }],
    },
    {
      id: "p2",
      emoji: "🛠️",
      title: "Your Awesome Project #2",
      year: "20XX",
      description:
        "TODO(you): Another real project goes here. Open-source contributions, hackathon wins and side projects all count. Aim for 3–4 total — enough breadth without padding.",
      tags: ["TypeScript", "Python", "TODO"],
      links: [{ label: "TODO — add repo link", url: "https://github.com/YashShingan" }],
    },
    {
      id: "p3",
      emoji: "🔮",
      title: "Your Awesome Project #3",
      year: "20XX",
      description:
        "TODO(you): Last board! This one could be the weird experimental thing you're proudest of, even if it never shipped. Those make the best conversations.",
      tags: ["WebGL", "Three.js", "TODO"],
      links: [{ label: "TODO — add repo link", url: "https://github.com/YashShingan" }],
    },
  ] as Project[],

  // Each group blooms as one flower patch in the Skills Garden
  skills: [
    {
      id: "s0",
      name: "Frontend",
      emoji: "🎨",
      description: "The pixels people actually see — and the ones they don't (looking at you, z-index).",
      skills: ["React", "Next.js", "TypeScript", "Tailwind", "Phaser 3", "HTML/CSS"],
    },
    {
      id: "s1",
      name: "Backend",
      emoji: "⚙️",
      description: "Boring on the outside, load-bearing on the inside.",
      skills: ["Node.js", "Python", "REST APIs", "PostgreSQL", "Bun"],
    },
    {
      id: "s2",
      name: "Tools & Craft",
      emoji: "🧰",
      description: "Things I'd feel naked without.",
      skills: ["Git", "GitHub Actions", "Docker", "Figma", "Vitest"],
    },
  ] as SkillGroup[],

  contact: {
    emoji: "📮",
    blurb:
      "Whether it's a role, a collab, or you just want to argue about the best Zelda game — my inbox is open.",
    links: [
      // TODO(you): replace with your real email / LinkedIn
      { label: "Email", value: "yash@example.com", url: "mailto:yash@example.com" },
      { label: "GitHub", value: "@YashShingan", url: "https://github.com/YashShingan" },
      { label: "LinkedIn", value: "Connect with me", url: "https://www.linkedin.com/" },
    ],
  },

  // NPCs you can chat with in the world
  npcs: [
    {
      id: "old-octo",
      name: "Old Octo",
      emoji: "🧙",
      tint: 0x9aa4b0,
      intro: "Old Octo adjusts his tiny glasses and looks up.",
      lines: [
        "Ah, a visitor! Not many make it past the loading screen these days.",
        "I've watched Yash code for years. The boy once removed an image background pixel-by-pixel on every page load. EVERY. LOAD.",
        "We octopi have three hearts. He puts at least that many into his projects.",
        "Say... rumors speak of a treasure tucked away in the NORTH-EAST corner of this world. Nobody believed the last recruiter who saw it.",
      ],
    },
    {
      id: "pixel",
      name: "Pixel the Recruiter",
      emoji: "💼",
      tint: 0xd98f8f,
      intro: "Pixel stops tapping on her phone and smiles.",
      lines: [
        "Oh hey! I was just reading Yash's resume for the fifth time. Great whitepaper-length bullet points, very quantified.",
        "Between us? Candidates who build their portfolio as a GAME get remembered. Guess who's getting remembered right now.",
        "Check the noticeboards up north for his projects, and the garden to the east for his skills. I did. Twice.",
        "If you're hiring, you'll find a mailbox just south of here. Tell him Pixel sent you.",
      ],
    },
  ] as NpcDialogue[],

  secret: {
    emoji: "🎁",
    lines: [
      "You found the hidden treasure chest!",
      "Inside is a note: 'If you found this, you're exactly the kind of curious person I want to work with. Seriously — email me. You win.'",
      "(Achievement unlocked, explorer. There's nothing else in the chest. The chest was inside you all along.)",
    ],
  },
};
