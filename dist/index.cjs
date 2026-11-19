'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Phaser4 = require('phaser');
var React = require('react');
var sonner = require('sonner');
var lucideReact = require('lucide-react');
var jsxRuntime = require('react/jsx-runtime');
var framerMotion = require('framer-motion');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var Phaser4__namespace = /*#__PURE__*/_interopNamespace(Phaser4);
var React__default = /*#__PURE__*/_interopDefault(React);

var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/game/systems/shared.ts
function resetSharedState() {
  exports.sharedInput.x = 0;
  exports.sharedInput.y = 0;
  exports.gameRuntime.modalOpen = false;
  exports.gameRuntime.interactQueued = false;
}
function pixelFont() {
  if (cachedPixelFont) return cachedPixelFont;
  if (typeof window === "undefined") return "monospace";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-pixel");
  cachedPixelFont = v ? v.trim() : '"Press Start 2P", monospace';
  return cachedPixelFont;
}
exports.sharedInput = void 0; exports.gameRuntime = void 0; var cachedPixelFont;
var init_shared = __esm({
  "src/game/systems/shared.ts"() {
    exports.sharedInput = {
      /** -1..1 normalized joystick vector */
      x: 0,
      y: 0
    };
    exports.gameRuntime = {
      /** True while a modal/dialog is open — freezes player input */
      modalOpen: false,
      /** Set by the mobile action button / E key, consumed by WorldScene */
      interactQueued: false
    };
    cachedPixelFont = "";
  }
});

// src/game/systems/events.ts
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
var init_events = __esm({
  "src/game/systems/events.ts"() {
  }
});

// src/config/portfolio.ts
exports.portfolio = void 0;
var init_portfolio = __esm({
  "src/config/portfolio.ts"() {
    exports.portfolio = {
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
        email: "yash.shingan007@gmail.com",
        discord: "KLEDXYASH#3204",
        blurb: "Whether it's a full-time engineering role, an ambitious creative project, or a quick coffee chat \u2014 my telegram desk is always open.",
        links: [
          { label: "Email", value: "yash.shingan007@gmail.com", url: "mailto:yash.shingan007@gmail.com" },
          { label: "GitHub", value: "@YashShingan", url: "https://github.com/YashShingan" },
          { label: "LinkedIn", value: "Connect on LinkedIn", url: "https://www.linkedin.com/in/yashshingan" },
          { label: "Discord", value: "KLEDXYASH#3204", url: "https://discord.com" }
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
  }
});

// src/game/data/world.ts
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function zoomFor(width, height) {
  return Math.min(1.2, Math.max(0.65, Math.min(width / 1e3, height / 700)));
}
var WORLD, PATH_W, PLAZA, SPAWN, PATHS, COURIER_PLAZA, CLEAR_ZONES, PROJECT_BOARDS, SKILL_PATCHES, POINTS, GROUND_CELL, GROUND_PADS, CHEST_TREES, LABELS, SECRET_MARK;
var init_world = __esm({
  "src/game/data/world.ts"() {
    init_portfolio();
    WORLD = { width: 3e3, height: 3e3 };
    PATH_W = 128;
    PLAZA = {
      cx: 1500,
      cy: 1500,
      /** Half-size of the plaza floor */
      half: 480
    };
    SPAWN = { x: 430, y: 1500 };
    PATHS = [
      // 4 spokes from the plaza edges outward
      { x: 1436, y: 420, w: PATH_W, h: 600, horizontal: false },
      // north
      { x: 1436, y: 1980, w: PATH_W, h: 250, horizontal: false },
      // south: leads directly into Courier Plaza
      { x: 420, y: 1436, w: 600, h: PATH_W, horizontal: true },
      // west
      { x: 1980, y: 1436, w: 700, h: PATH_W, horizontal: true },
      // east (leads through skill garden to east sanctuary)
      // Projects walkway (north district)
      { x: 900, y: 380, w: 1200, h: PATH_W, horizontal: true },
      // Skills walkway (east district, connects north and south sanctuaries)
      { x: 2340, y: 1220, w: PATH_W, h: 560, horizontal: false },
      // Secret trail — narrower, branches off the projects walkway
      // and dead-ends at a hidden chest clearing in the woods
      { x: 2100, y: 380, w: 600, h: 64, horizontal: true },
      { x: 2636, y: 380, w: 64, h: 320, horizontal: false }
    ];
    COURIER_PLAZA = {
      cx: 1500,
      cy: 2340,
      w: 400,
      h: 260,
      r: 16
    };
    CLEAR_ZONES = PATHS.map((p) => ({
      x: p.x - 60,
      y: p.y - 60,
      w: p.w + 120,
      h: p.h + 120
    })).concat([
      // plaza + margin
      { x: PLAZA.cx - PLAZA.half - 50, y: PLAZA.cy - PLAZA.half - 50, w: PLAZA.half * 2 + 100, h: PLAZA.half * 2 + 100 },
      // projects boards area
      { x: 860, y: 200, w: 1340, h: 440 },
      // skills garden sanctuary area (spacious botanical courtyard)
      { x: 2180, y: 1100, w: 580, h: 780 },
      // Courier Plaza / Contact courtyard
      { x: 1260, y: 2170, w: 480, h: 330 },
      // secret chest clearing (around the trail's dead end)
      { x: 2520, y: 480, w: 400, h: 360 },
      // NPC spots
      { x: 560, y: 1330, w: 280, h: 240 },
      // spawn area
      { x: 320, y: 1360, w: 240, h: 280 }
    ]);
    PROJECT_BOARDS = exports.portfolio.projects.map((p, i) => ({
      id: p.id,
      x: 1060 + i * 300,
      y: 335
    }));
    SKILL_PATCHES = [
      { id: "s0", x: 2404, y: 1220 },
      // Frontend (North Blooming Pavilion)
      { id: "s1", x: 2640, y: 1500 },
      // Backend (East Zen Rockery & Monolith)
      { id: "s2", x: 2404, y: 1780 }
      // Tools & Craft (South Timber Pergola)
    ];
    POINTS = {
      welcomeSign: { x: 560, y: 1330 },
      fountain: { x: PLAZA.cx, y: PLAZA.cy },
      mailbox: { x: 1450, y: 2350 },
      // tucked at the end of the secret trail — actually hidden now
      chest: { x: 2668, y: 640 },
      npcOldOcto: { x: 700, y: 1450 },
      npcPixel: { x: 1570, y: 2320 }
    };
    GROUND_CELL = 8;
    GROUND_PADS = [
      { x: POINTS.welcomeSign.x, y: POINTS.welcomeSign.y + 44, r: 66 },
      { x: POINTS.npcOldOcto.x, y: POINTS.npcOldOcto.y + 26, r: 74 },
      // Botanical garden pads under each shrine
      { x: 2404, y: 1220, r: 80 },
      { x: 2640, y: 1500, r: 80 },
      { x: 2404, y: 1780, r: 80 },
      // Project exhibition pads
      { x: 1060, y: 375, r: 54 },
      { x: 1360, y: 375, r: 54 },
      { x: 1660, y: 375, r: 54 },
      { x: 1960, y: 375, r: 54 }
    ];
    CHEST_TREES = [
      { x: 2452, y: 548 },
      { x: 2452, y: 742 },
      { x: 2884, y: 520 },
      { x: 2884, y: 728 },
      { x: 2568, y: 856 },
      { x: 2772, y: 856 }
    ];
    LABELS = [
      { text: "PROJECTS", x: 1500, y: 220 },
      { text: "ABOUT", x: 1500, y: 1230 },
      { text: "SKILLS GARDEN", x: 2404, y: 1110 },
      { text: "CONTACT", x: 1500, y: 2180 }
    ];
    SECRET_MARK = { x: 2668, y: 452 };
  }
});

// src/game/systems/achievements.ts
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
var STORAGE_KEY, ACHIEVEMENTS;
var init_achievements = __esm({
  "src/game/systems/achievements.ts"() {
    init_events();
    STORAGE_KEY = "pg_achievements_v2";
    ACHIEVEMENTS = [
      { id: "first-steps", title: "First Steps", desc: "Moved your tiny octopus legs", emoji: "\u{1F463}" },
      { id: "explorer", title: "World Explorer", desc: "Visited all four districts", emoji: "\u{1F5FA}\uFE0F" },
      { id: "bookworm", title: "Bookworm", desc: "Read every project noticeboard", emoji: "\u{1F4DA}" },
      { id: "social", title: "Social Butterfly", desc: "Talked to every NPC in the world", emoji: "\u{1F4AC}" },
      { id: "curious", title: "Curious Mind", desc: "Found what hides in the north-east", emoji: "\u{1F48E}" },
      { id: "big-spender", title: "Big Spender", desc: "Tossed a lucky coin into the central fountain", emoji: "\u{1FA99}" },
      { id: "konami", title: "Cheater Detected", desc: "\u2191\u2191\u2193\u2193\u2190\u2192\u2190\u2192BA", emoji: "\u{1F3AE}" }
    ];
  }
});

// src/game/systems/audio.ts
var NOTE, LEAD, BASS, BPM, STEP, STEPS; exports.ChiptuneEngine = void 0; exports.audio = void 0;
var init_audio = __esm({
  "src/game/systems/audio.ts"() {
    NOTE = {
      C2: 65.41,
      E2: 82.41,
      F2: 87.31,
      G2: 98,
      A2: 110,
      C3: 130.81,
      E3: 164.81,
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      G4: 392,
      A4: 440,
      C5: 523.25,
      D5: 587.33,
      E5: 659.25,
      G5: 783.99,
      A5: 880,
      C6: 1046.5
    };
    LEAD = [
      NOTE.E4,
      NOTE.G4,
      NOTE.A4,
      NOTE.G4,
      NOTE.E4,
      NOTE.D4,
      NOTE.C4,
      null,
      NOTE.D4,
      NOTE.E4,
      NOTE.G4,
      NOTE.E4,
      NOTE.D4,
      null,
      NOTE.C4,
      null,
      NOTE.A4,
      NOTE.G4,
      NOTE.E4,
      NOTE.G4,
      NOTE.A4,
      NOTE.C5,
      NOTE.D5,
      null,
      NOTE.C5,
      NOTE.A4,
      NOTE.G4,
      NOTE.E4,
      NOTE.D4,
      null,
      NOTE.C4,
      null
    ];
    BASS = [
      NOTE.C2,
      null,
      NOTE.G2,
      null,
      NOTE.A2,
      null,
      NOTE.E2,
      null,
      NOTE.C2,
      null,
      NOTE.G2,
      null,
      NOTE.C3,
      null,
      NOTE.G2,
      null,
      NOTE.F2,
      null,
      NOTE.C3,
      null,
      NOTE.G2,
      null,
      NOTE.C3,
      null,
      NOTE.A2,
      null,
      NOTE.E2,
      null,
      NOTE.G2,
      null,
      NOTE.G2,
      null
    ];
    BPM = 152;
    STEP = 60 / BPM / 2;
    STEPS = 32;
    exports.ChiptuneEngine = class {
      constructor() {
        this.ctx = null;
        this.master = null;
        this.musicBus = null;
        this.sfxBus = null;
        this.timer = null;
        this.nextStepTime = 0;
        this.step = 0;
        this.muted = false;
        this.started = false;
        if (typeof window !== "undefined") {
          this.muted = localStorage.getItem("pg_muted") === "1";
        }
      }
      /** Must be called from a user gesture (browser autoplay policy). */
      init() {
        var _a;
        if (this.ctx) {
          void this.ctx.resume();
          return;
        }
        const Ctx = (_a = window.AudioContext) != null ? _a : window.webkitAudioContext;
        if (!Ctx) return;
        this.ctx = new Ctx();
        const lp = this.ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 2600;
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 1;
        this.master.connect(lp);
        lp.connect(this.ctx.destination);
        this.musicBus = this.ctx.createGain();
        this.musicBus.gain.value = 0.5;
        this.musicBus.connect(this.master);
        this.sfxBus = this.ctx.createGain();
        this.sfxBus.gain.value = 0.9;
        this.sfxBus.connect(this.master);
        this.startBgm();
        this.started = true;
      }
      startBgm() {
        if (!this.ctx || this.timer) return;
        this.step = 0;
        this.nextStepTime = this.ctx.currentTime + 0.1;
        this.timer = setInterval(() => this.schedule(), 50);
      }
      schedule() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        if (!Number.isFinite(now)) return;
        while (this.nextStepTime < now + 0.15) {
          this.scheduleStep(this.step % STEPS, this.nextStepTime);
          this.step++;
          this.nextStepTime += STEP;
        }
      }
      scheduleStep(step, t) {
        if (!this.ctx || !this.musicBus) return;
        const lead = LEAD[step];
        if (lead) this.tone(lead, t, STEP * 0.92, "square", 0.045, this.musicBus, 0.01);
        const bass = BASS[step];
        if (bass) this.tone(bass, t, STEP * 1.7, "triangle", 0.085, this.musicBus, 0.02);
        if (step % 2 === 1) this.hat(t, this.musicBus);
      }
      tone(freq, t, dur, type, gain, bus, attack = 5e-3) {
        if (!this.ctx) return;
        if (!Number.isFinite(t) || !Number.isFinite(freq) || !Number.isFinite(dur)) return;
        try {
          const osc = this.ctx.createOscillator();
          const env = this.ctx.createGain();
          osc.type = type;
          osc.frequency.value = freq;
          env.gain.setValueAtTime(0, t);
          env.gain.linearRampToValueAtTime(gain, t + attack);
          env.gain.linearRampToValueAtTime(1e-4, t + dur);
          osc.connect(env);
          env.connect(bus);
          osc.start(t);
          osc.stop(t + dur + 0.02);
        } catch (e) {
        }
      }
      hat(t, bus) {
        if (!this.ctx || !Number.isFinite(t)) return;
        try {
          const len = Math.floor(this.ctx.sampleRate * 0.03);
          const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
          const data = buf.getChannelData(0);
          for (let i = 0; i < len; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
          }
          const src = this.ctx.createBufferSource();
          const env = this.ctx.createGain();
          src.buffer = buf;
          env.gain.value = 0.02;
          src.connect(env);
          env.connect(bus);
          src.start(t);
        } catch (e) {
        }
      }
      // ---------- SFX ----------
      blip(from, to, dur, type, gain) {
        if (!this.ctx || !this.sfxBus || !this.started) return;
        const t = this.ctx.currentTime;
        if (!Number.isFinite(t)) return;
        try {
          const osc = this.ctx.createOscillator();
          const env = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(from, t);
          osc.frequency.linearRampToValueAtTime(to, t + dur);
          env.gain.setValueAtTime(gain, t);
          env.gain.linearRampToValueAtTime(1e-4, t + dur);
          osc.connect(env);
          env.connect(this.sfxBus);
          osc.start(t);
          osc.stop(t + dur + 0.02);
        } catch (e) {
        }
      }
      open() {
        this.blip(NOTE.E5, NOTE.A5, 0.12, "square", 0.06);
      }
      close() {
        this.blip(NOTE.A5, NOTE.E5, 0.1, "square", 0.05);
      }
      achieve() {
        if (!this.ctx || !this.sfxBus || !this.started) return;
        const t0 = this.ctx.currentTime;
        if (!Number.isFinite(t0)) return;
        [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((f, i) => {
          this.tone(f, t0 + i * 0.09, 0.22, "square", 0.05, this.sfxBus);
        });
      }
      konami() {
        if (!this.ctx || !this.sfxBus || !this.started) return;
        const t0 = this.ctx.currentTime;
        if (!Number.isFinite(t0)) return;
        [NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.E5, NOTE.G5].forEach((f, i) => {
          this.tone(f, t0 + i * 0.11, i === 6 ? 0.6 : 0.14, "square", 0.06, this.sfxBus);
        });
      }
      secret() {
        if (!this.ctx || !this.sfxBus || !this.started) return;
        const t0 = this.ctx.currentTime;
        if (!Number.isFinite(t0)) return;
        [NOTE.E5, NOTE.G5, NOTE.E5, NOTE.C6].forEach((f, i) => {
          this.tone(f, t0 + i * 0.13, 0.3, "triangle", 0.09, this.sfxBus);
        });
      }
      /** Soft airy two-note chime — another visitor just faded in. */
      ghost() {
        if (!this.ctx || !this.sfxBus || !this.started) return;
        const t0 = this.ctx.currentTime;
        if (!Number.isFinite(t0)) return;
        this.tone(NOTE.E5, t0, 0.4, "triangle", 0.03, this.sfxBus);
        this.tone(NOTE.G5, t0 + 0.14, 0.5, "triangle", 0.026, this.sfxBus);
      }
      /** Dual frequency sine ping with bright metallic chime decay — fountain coin toss. */
      coin() {
        if (!this.ctx || !this.sfxBus || !this.started) return;
        const t0 = this.ctx.currentTime;
        if (!Number.isFinite(t0)) return;
        this.tone(987.77, t0, 0.09, "sine", 0.065, this.sfxBus, 2e-3);
        this.tone(1318.51, t0 + 0.065, 0.38, "sine", 0.08, this.sfxBus, 2e-3);
        this.tone(2637.02, t0 + 0.065, 0.2, "sine", 0.025, this.sfxBus, 2e-3);
      }
      // ---------- Mute ----------
      get isMuted() {
        return this.muted;
      }
      toggleMute() {
        this.muted = !this.muted;
        if (this.master && this.ctx) {
          this.master.gain.setTargetAtTime(
            this.muted ? 0 : 1,
            this.ctx.currentTime,
            0.05
          );
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("pg_muted", this.muted ? "1" : "0");
        }
        return this.muted;
      }
      /** Dev/test introspection: what state is the engine in right now? */
      get debugState() {
        return {
          ctx: this.ctx ? this.ctx.state === "closed" ? "closed" : this.ctx.state : "none",
          scheduler: this.timer !== null
        };
      }
      /**
       * Full shutdown — called when the player EXITS the game. Fades the
       * master bus out over ~250ms instead of a jarring hard cut, then
       * closes the AudioContext. The singleton is reset so a later re-entry
       * (audio.init) builds a fresh context from scratch.
       */
      destroy() {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
        this.started = false;
        const ctx = this.ctx;
        const master = this.master;
        this.ctx = null;
        this.master = null;
        this.musicBus = null;
        this.sfxBus = null;
        this.nextStepTime = 0;
        this.step = 0;
        if (!ctx || ctx.state === "closed") return;
        try {
          master == null ? void 0 : master.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
        } catch (e) {
        }
        setTimeout(() => {
          try {
            void ctx.close();
          } catch (e) {
          }
        }, 350);
      }
    };
    exports.audio = new exports.ChiptuneEngine();
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      window.__pgAudio = () => exports.audio.debugState;
    }
  }
});
var BootScene;
var init_BootScene = __esm({
  "src/game/scenes/BootScene.ts"() {
    init_shared();
    BootScene = class extends Phaser4__namespace.Scene {
      constructor() {
        super("BootScene");
      }
      preload() {
        const { width, height } = this.scale.gameSize;
        const g = this.add.graphics();
        const bw = 360;
        const bx = (width - bw) / 2;
        const by = height / 2;
        this.add.text(width / 2, by - 32, "ENTERING THE WORLD...", {
          fontFamily: pixelFont(),
          fontSize: "12px",
          color: "#f4e8c8"
        }).setOrigin(0.5).setResolution(2);
        g.fillStyle(854792, 0.8);
        g.fillRect(bx - 4, by - 4, bw + 8, 28);
        this.load.on("progress", (p) => {
          g.fillStyle(15253872, 1);
          g.fillRect(bx, by, bw * p, 20);
        });
        const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
        this.load.image("grass", `${base}/game-assets/tiles/grass.png`);
        this.load.image("footpath", `${base}/game-assets/tiles/footpath.png`);
        this.load.image("fountain", `${base}/game-assets/images/fountain-clean.png`);
        this.load.image("noticeboard", `${base}/game-assets/images/noticeboard.png`);
        this.load.spritesheet("player", `${base}/game-assets/sprites/github-octopuss.png`, {
          frameWidth: 50,
          frameHeight: 50
        });
      }
      create() {
        this.generateTextures();
        this.createAnimations();
        this.scene.start("WorldScene");
      }
      /** All extra sprites are drawn once into textures at boot — cheap at runtime. */
      generateTextures() {
        const drop = this.make.graphics({ x: 0, y: 0 }, false);
        drop.fillStyle(10410239, 1);
        drop.fillCircle(4, 4, 4);
        drop.generateTexture("droplet", 8, 8);
        drop.destroy();
        const fly = this.make.graphics({ x: 0, y: 0 }, false);
        fly.fillStyle(16773800, 1);
        fly.fillCircle(4, 4, 3.5);
        fly.fillStyle(16777215, 1);
        fly.fillCircle(4, 4, 1.5);
        fly.generateTexture("firefly", 8, 8);
        fly.destroy();
        const sp = this.make.graphics({ x: 0, y: 0 }, false);
        sp.fillStyle(16777215, 1);
        sp.fillRect(3, 0, 2, 8);
        sp.fillRect(0, 3, 8, 2);
        sp.generateTexture("sparkle", 8, 8);
        sp.destroy();
        for (const [key, canopy, canopy2, canopyHi] of [
          ["tree1", 3107635, 4033089, 6534238],
          ["tree2", 2580031, 3572303, 6269548]
        ]) {
          const t = this.make.graphics({ x: 0, y: 0 }, false);
          t.fillStyle(7227951, 1);
          t.fillRect(66, 130, 18, 62);
          t.fillStyle(5453599, 1);
          t.fillRect(66, 130, 5, 62);
          t.fillStyle(4008470, 1);
          t.fillRect(58, 184, 34, 12);
          t.fillStyle(canopy, 1);
          t.fillCircle(75, 92, 52);
          t.fillCircle(44, 112, 28);
          t.fillCircle(106, 114, 26);
          t.fillStyle(canopy2, 1);
          t.fillCircle(54, 62, 30);
          t.fillCircle(98, 68, 26);
          t.fillStyle(canopyHi, 1);
          t.fillCircle(74, 50, 18);
          t.generateTexture(key, 150, 200);
          t.destroy();
        }
        const rp = this.make.graphics({ x: 0, y: 0 }, false);
        rp.lineStyle(3, 14217983, 1);
        rp.strokeEllipse(34, 15, 60, 24);
        rp.generateTexture("ripple", 68, 30);
        rp.destroy();
        const b = this.make.graphics({ x: 0, y: 0 }, false);
        b.fillStyle(3832384, 1);
        b.fillEllipse(20, 14, 36, 22);
        b.fillStyle(5020242, 1);
        b.fillEllipse(14, 10, 18, 12);
        b.generateTexture("bush", 40, 26);
        b.destroy();
        const flowerColors = [
          [16748467, 16765286],
          [11701759, 16773800],
          [16765286, 16747100]
        ];
        flowerColors.forEach(([petal, core], i) => {
          const f = this.make.graphics({ x: 0, y: 0 }, false);
          f.fillStyle(petal, 1);
          f.fillRect(1, 0, 3, 3);
          f.fillRect(6, 1, 3, 3);
          f.fillRect(1, 6, 3, 3);
          f.fillRect(5, 5, 3, 3);
          f.fillStyle(core, 1);
          f.fillRect(3, 2, 3, 4);
          f.generateTexture(`flower${i}`, 10, 9);
          f.destroy();
        });
        const ch = this.make.graphics({ x: 0, y: 0 }, false);
        ch.fillStyle(9067051, 1);
        ch.fillRect(2, 14, 44, 26);
        ch.fillStyle(11039034, 1);
        ch.fillRect(2, 14, 44, 10);
        ch.fillStyle(16107883, 1);
        ch.fillRect(2, 14, 44, 3);
        ch.fillRect(20, 16, 8, 12);
        ch.fillStyle(3811862, 1);
        ch.fillRect(22, 20, 4, 5);
        ch.generateTexture("chest", 48, 42);
        ch.destroy();
        const sh = this.make.graphics({ x: 0, y: 0 }, false);
        sh.fillStyle(0, 0.22);
        sh.fillEllipse(32, 10, 56, 16);
        sh.generateTexture("shadow", 64, 20);
        sh.destroy();
        const gl = this.make.graphics({ x: 0, y: 0 }, false);
        gl.fillStyle(6732031, 0.3);
        gl.fillCircle(12, 12, 11);
        gl.fillStyle(12576511, 0.45);
        gl.fillCircle(12, 12, 6);
        gl.generateTexture("ghost-glow", 24, 24);
        gl.destroy();
        const pet = this.make.graphics({ x: 0, y: 0 }, false);
        pet.fillStyle(16751035, 0.9);
        pet.fillEllipse(4, 4, 6, 4);
        pet.fillStyle(16777215, 0.7);
        pet.fillRect(3, 3, 2, 2);
        pet.generateTexture("petal", 8, 8);
        pet.destroy();
        const ws = this.make.graphics({ x: 0, y: 0 }, false);
        ws.fillStyle(5387803, 1);
        ws.fillRect(16, 26, 6, 26);
        ws.fillRect(42, 26, 6, 26);
        ws.fillStyle(3679249, 1);
        ws.fillRect(16, 26, 2, 26);
        ws.fillRect(42, 26, 2, 26);
        ws.fillStyle(7555106, 1);
        ws.fillRoundedRect(4, 4, 56, 30, 4);
        ws.fillStyle(9723697, 1);
        ws.fillRect(6, 6, 52, 26);
        ws.fillStyle(4861461, 1);
        ws.strokeRoundedRect(5, 5, 54, 28, 3);
        ws.fillStyle(16117463, 1);
        ws.fillRect(10, 10, 44, 18);
        ws.fillStyle(11740702, 1);
        ws.fillCircle(15, 14, 3);
        ws.fillStyle(5850674, 1);
        ws.fillRect(22, 12, 28, 2);
        ws.fillRect(22, 16, 24, 2);
        ws.fillRect(22, 20, 18, 2);
        ws.fillStyle(13935431, 1);
        ws.fillRect(14, 2, 36, 6);
        ws.fillStyle(2825484, 1);
        ws.fillRect(18, 4, 28, 2);
        ws.generateTexture("welcome-sign", 64, 52);
        ws.destroy();
        const sd = this.make.graphics({ x: 0, y: 0 }, false);
        sd.fillStyle(7235674, 1);
        sd.fillRect(6, 28, 24, 10);
        sd.fillStyle(9735548, 1);
        sd.fillRect(8, 26, 20, 4);
        sd.fillStyle(8025189, 1);
        sd.fillRect(12, 12, 12, 15);
        sd.fillStyle(10919821, 1);
        sd.fillRect(14, 12, 4, 15);
        sd.fillStyle(9406583, 1);
        sd.fillEllipse(18, 10, 32, 12);
        sd.fillStyle(11906458, 1);
        sd.fillEllipse(18, 9, 28, 10);
        sd.fillStyle(4867385, 0.6);
        sd.fillTriangle(18, 9, 25, 11, 18, 11);
        sd.fillStyle(13938487, 1);
        sd.fillTriangle(18, 4, 18, 9, 23, 9);
        sd.generateTexture("garden-sundial", 36, 40);
        sd.destroy();
        const gb = this.make.graphics({ x: 0, y: 0 }, false);
        gb.fillStyle(1976098, 1);
        gb.fillRect(6, 18, 4, 16);
        gb.fillRect(46, 18, 4, 16);
        gb.fillRect(4, 12, 6, 4);
        gb.fillRect(46, 12, 6, 4);
        for (const sy of [4, 8, 12]) {
          gb.fillStyle(8538914, 1);
          gb.fillRect(8, sy, 40, 3);
          gb.fillStyle(11562041, 1);
          gb.fillRect(8, sy, 40, 1);
        }
        gb.fillStyle(8538914, 1);
        gb.fillRect(4, 18, 48, 8);
        gb.fillStyle(10379054, 1);
        gb.fillRect(6, 19, 44, 3);
        gb.fillStyle(6042388, 1);
        gb.fillRect(4, 25, 48, 2);
        gb.generateTexture("garden-bench", 56, 36);
        gb.destroy();
        const glamp = this.make.graphics({ x: 0, y: 0 }, false);
        glamp.fillStyle(2565930, 1);
        glamp.fillRect(6, 56, 12, 8);
        glamp.fillRect(8, 52, 8, 4);
        glamp.fillStyle(1579035, 1);
        glamp.fillRect(10, 24, 4, 28);
        glamp.fillStyle(4144966, 1);
        glamp.fillRect(11, 24, 1, 28);
        glamp.fillStyle(2565930, 1);
        glamp.fillRect(6, 10, 12, 14);
        glamp.fillRect(4, 8, 16, 3);
        glamp.fillRect(8, 4, 8, 4);
        glamp.fillRect(11, 1, 2, 3);
        glamp.fillStyle(16770447, 1);
        glamp.fillRect(7, 12, 10, 10);
        glamp.fillStyle(16777215, 1);
        glamp.fillRect(9, 14, 6, 6);
        glamp.generateTexture("garden-lamp", 24, 64);
        glamp.destroy();
        const gh = this.make.graphics({ x: 0, y: 0 }, false);
        gh.fillStyle(1786674, 1);
        gh.fillRoundedRect(2, 6, 40, 20, 6);
        gh.fillStyle(2976335, 1);
        gh.fillRoundedRect(4, 4, 36, 18, 5);
        gh.fillStyle(4231532, 1);
        gh.fillRoundedRect(6, 2, 32, 14, 4);
        gh.fillStyle(5420936, 1);
        gh.fillRect(8, 4, 10, 4);
        gh.fillRect(24, 4, 10, 4);
        gh.fillStyle(7653021, 1);
        gh.fillRect(10, 5, 4, 2);
        gh.fillRect(26, 5, 4, 2);
        gh.fillStyle(16765286, 0.9);
        gh.fillRect(12, 10, 2, 2);
        gh.fillRect(30, 11, 2, 2);
        gh.fillStyle(16741775, 0.9);
        gh.fillRect(20, 8, 2, 2);
        gh.generateTexture("garden-hedge", 44, 28);
        gh.destroy();
        const sfe = this.make.graphics({ x: 0, y: 0 }, false);
        sfe.fillStyle(7564383, 1);
        sfe.fillRoundedRect(10, 36, 110, 56, 12);
        sfe.fillStyle(9735293, 1);
        sfe.fillRoundedRect(14, 38, 102, 50, 10);
        sfe.fillStyle(3876116, 1);
        sfe.fillRoundedRect(18, 42, 94, 34, 6);
        sfe.fillStyle(2976335, 1);
        sfe.fillRect(20, 68, 8, 14);
        sfe.fillRect(52, 70, 10, 16);
        sfe.fillRect(88, 68, 8, 12);
        sfe.fillStyle(5420936, 1);
        sfe.fillRect(22, 72, 4, 8);
        sfe.fillRect(54, 74, 6, 10);
        const bloomColors = [16731501, 16741775, 16758531, 4770532, 7473591, 16196997];
        for (let bx = 22; bx <= 98; bx += 14) {
          for (let by = 42; by <= 60; by += 10) {
            const col = bloomColors[(bx * 3 + by * 7) % bloomColors.length];
            sfe.fillStyle(col, 1);
            sfe.fillCircle(bx + 4, by + 4, 5);
            sfe.fillStyle(16777215, 0.8);
            sfe.fillRect(bx + 3, by + 3, 2, 2);
          }
        }
        sfe.fillStyle(1709584, 1);
        sfe.fillRoundedRect(28, 76, 74, 18, 4);
        sfe.lineStyle(2, 16107883, 1);
        sfe.strokeRoundedRect(28, 76, 74, 18, 4);
        sfe.fillStyle(16107883, 1);
        sfe.fillRect(34, 84, 4, 3);
        sfe.fillRect(92, 84, 4, 3);
        sfe.fillStyle(16050376, 1);
        sfe.fillRect(42, 83, 46, 5);
        sfe.generateTexture("shrine-frontend", 130, 100);
        sfe.destroy();
        const sbe = this.make.graphics({ x: 0, y: 0 }, false);
        sbe.fillStyle(4804695, 1);
        sbe.fillEllipse(60, 84, 96, 28);
        sbe.fillStyle(7107965, 1);
        sbe.fillEllipse(60, 82, 88, 24);
        sbe.fillStyle(3422784, 1);
        sbe.fillEllipse(36, 88, 28, 14);
        sbe.fillEllipse(84, 88, 32, 14);
        sbe.fillStyle(2172201, 1);
        sbe.fillRect(48, 14, 24, 68);
        sbe.fillStyle(3422784, 1);
        sbe.fillRect(52, 16, 16, 64);
        sbe.fillStyle(2172201, 1);
        sbe.fillTriangle(48, 14, 72, 14, 60, 4);
        sbe.fillStyle(62932, 1);
        sbe.fillRect(58, 20, 4, 14);
        sbe.fillRect(54, 30, 12, 3);
        sbe.fillRect(54, 42, 4, 16);
        sbe.fillRect(62, 48, 4, 16);
        sbe.fillRect(56, 54, 8, 3);
        sbe.fillStyle(4861461, 1);
        sbe.fillRect(80, 52, 6, 26);
        sbe.fillStyle(1786674, 1);
        sbe.fillCircle(83, 44, 16);
        sbe.fillStyle(2976335, 1);
        sbe.fillCircle(80, 40, 12);
        sbe.fillStyle(1120295, 1);
        sbe.fillRoundedRect(26, 78, 68, 18, 4);
        sbe.lineStyle(2, 62932, 0.85);
        sbe.strokeRoundedRect(26, 78, 68, 18, 4);
        sbe.fillStyle(62932, 1);
        sbe.fillRect(38, 85, 44, 4);
        sbe.generateTexture("shrine-backend", 120, 104);
        sbe.destroy();
        const stl = this.make.graphics({ x: 0, y: 0 }, false);
        stl.fillStyle(4859920, 1);
        stl.fillRect(16, 14, 8, 76);
        stl.fillRect(106, 14, 8, 76);
        stl.fillStyle(6634267, 1);
        stl.fillRect(18, 14, 4, 76);
        stl.fillRect(108, 14, 4, 76);
        stl.fillStyle(6042388, 1);
        stl.fillRect(10, 10, 110, 8);
        stl.fillStyle(8012571, 1);
        stl.fillRect(10, 10, 110, 3);
        for (let rx = 18; rx <= 104; rx += 18) {
          stl.fillStyle(4005640, 1);
          stl.fillRect(rx, 6, 6, 14);
        }
        stl.fillStyle(2976335, 1);
        stl.fillRect(14, 8, 22, 12);
        stl.fillRect(80, 8, 28, 14);
        stl.fillStyle(5420936, 1);
        stl.fillRect(16, 12, 16, 6);
        stl.fillStyle(7226143, 1);
        stl.fillRect(28, 48, 74, 34);
        stl.fillStyle(9065511, 1);
        stl.fillRect(26, 46, 78, 6);
        stl.fillStyle(12271107, 1);
        stl.fillRect(34, 36, 12, 10);
        stl.fillRect(52, 38, 10, 8);
        stl.fillRect(82, 34, 14, 12);
        stl.fillStyle(7397376, 1);
        stl.fillCircle(40, 33, 6);
        stl.fillCircle(57, 35, 5);
        stl.fillStyle(16758531, 1);
        stl.fillCircle(89, 31, 7);
        stl.fillStyle(3715072, 1);
        stl.fillCircle(30, 22, 8);
        stl.fillStyle(2758408, 1);
        stl.fillRoundedRect(30, 74, 70, 18, 4);
        stl.lineStyle(2, 13935431, 0.9);
        stl.strokeRoundedRect(30, 74, 70, 18, 4);
        stl.fillStyle(16107883, 1);
        stl.fillRect(40, 82, 50, 4);
        stl.generateTexture("shrine-tools", 130, 100);
        stl.destroy();
        const ph = this.make.graphics({ x: 0, y: 0 }, false);
        ph.fillStyle(15253872, 0.25);
        ph.fillEllipse(32, 12, 56, 18);
        ph.fillStyle(16771235, 0.45);
        ph.fillEllipse(32, 12, 36, 10);
        ph.generateTexture("proj-halo", 64, 24);
        ph.destroy();
        const pk0 = this.make.graphics({ x: 0, y: 0 }, false);
        pk0.fillStyle(3870993, 1);
        pk0.fillRoundedRect(12, 12, 72, 94, 6);
        pk0.fillStyle(5511192, 1);
        pk0.fillRect(16, 16, 64, 88);
        pk0.lineStyle(2, 16107883, 1);
        pk0.strokeRoundedRect(13, 13, 70, 92, 5);
        pk0.fillStyle(984862, 1);
        pk0.fillRect(18, 16, 60, 16);
        pk0.lineStyle(1, 3718648, 1);
        pk0.strokeRect(18, 16, 60, 16);
        pk0.fillStyle(3718648, 1);
        pk0.fillRect(24, 22, 48, 4);
        pk0.fillStyle(724761, 1);
        pk0.fillRoundedRect(18, 36, 60, 38, 4);
        pk0.fillStyle(3718648, 1);
        pk0.fillRect(22, 39, 52, 18);
        pk0.fillStyle(16777215, 0.85);
        pk0.fillRect(26, 42, 12, 4);
        pk0.fillStyle(1483594, 1);
        pk0.fillRect(22, 54, 52, 16);
        pk0.fillStyle(2278750, 1);
        pk0.fillRect(22, 52, 52, 4);
        pk0.fillStyle(15485081, 1);
        pk0.fillRect(36, 56, 8, 8);
        pk0.fillStyle(16777215, 1);
        pk0.fillRect(38, 58, 2, 2);
        pk0.fillStyle(9684477, 1);
        pk0.fillRect(56, 54, 10, 8);
        pk0.fillStyle(1970706, 1);
        pk0.fillRect(16, 76, 64, 12);
        pk0.fillStyle(10265519, 1);
        pk0.fillRect(26, 80, 2, 5);
        pk0.fillRect(52, 80, 2, 5);
        pk0.fillStyle(15680580, 1);
        pk0.fillCircle(27, 79, 3);
        pk0.fillCircle(53, 79, 3);
        pk0.fillStyle(3900150, 1);
        pk0.fillCircle(36, 82, 2);
        pk0.fillStyle(16436245, 1);
        pk0.fillCircle(42, 82, 2);
        pk0.fillStyle(2278750, 1);
        pk0.fillCircle(62, 82, 2);
        pk0.fillStyle(15485081, 1);
        pk0.fillCircle(68, 82, 2);
        pk0.fillStyle(2825484, 1);
        pk0.fillRoundedRect(20, 92, 56, 12, 2);
        pk0.lineStyle(1, 16107883, 1);
        pk0.strokeRoundedRect(20, 92, 56, 12, 2);
        pk0.fillStyle(16107883, 1);
        pk0.fillRect(26, 96, 44, 3);
        pk0.generateTexture("proj-kiosk-0", 96, 112);
        pk0.destroy();
        const pk1 = this.make.graphics({ x: 0, y: 0 }, false);
        pk1.fillStyle(988970, 1);
        pk1.fillRoundedRect(12, 12, 72, 94, 6);
        pk1.fillStyle(1976635, 1);
        pk1.fillRect(16, 16, 64, 88);
        pk1.fillStyle(15381256, 1);
        pk1.fillRect(16, 16, 10, 4);
        pk1.fillRect(70, 16, 10, 4);
        pk1.fillStyle(988970, 1);
        pk1.fillRect(20, 16, 4, 4);
        pk1.fillRect(74, 16, 4, 4);
        pk1.fillStyle(9741240, 1);
        pk1.fillRect(22, 2, 2, 12);
        pk1.fillRect(72, 2, 2, 12);
        pk1.fillStyle(3718648, 1);
        pk1.fillCircle(23, 2, 2);
        pk1.fillCircle(73, 2, 2);
        pk1.fillStyle(223649, 1);
        pk1.fillRect(28, 14, 40, 12);
        pk1.fillStyle(3718648, 1);
        pk1.fillRect(32, 18, 32, 3);
        pk1.fillStyle(132631, 1);
        pk1.fillRoundedRect(18, 30, 60, 44, 4);
        pk1.lineStyle(1, 1400437, 0.7);
        pk1.strokeCircle(48, 52, 18);
        pk1.strokeCircle(48, 52, 10);
        pk1.fillStyle(16347926, 1);
        pk1.fillTriangle(48, 56, 45, 66, 51, 66);
        pk1.fillStyle(16436245, 1);
        pk1.fillTriangle(48, 56, 46, 62, 50, 62);
        pk1.fillStyle(15857145, 1);
        pk1.fillRect(46, 44, 4, 12);
        pk1.fillTriangle(48, 38, 45, 44, 51, 44);
        pk1.fillStyle(15680580, 1);
        pk1.fillRect(44, 52, 2, 4);
        pk1.fillRect(50, 52, 2, 4);
        pk1.fillStyle(988970, 1);
        pk1.fillRect(16, 76, 64, 12);
        pk1.fillStyle(2278750, 1);
        pk1.fillCircle(24, 82, 2);
        pk1.fillStyle(3718648, 1);
        pk1.fillCircle(30, 82, 2);
        pk1.fillStyle(15680580, 1);
        pk1.fillCircle(36, 82, 2);
        pk1.fillStyle(6583435, 1);
        pk1.fillRect(46, 80, 20, 4);
        pk1.fillStyle(805486, 1);
        pk1.fillRoundedRect(20, 92, 56, 12, 2);
        pk1.lineStyle(1, 3718648, 1);
        pk1.strokeRoundedRect(20, 92, 56, 12, 2);
        pk1.fillStyle(14742270, 1);
        pk1.fillRect(26, 96, 44, 3);
        pk1.generateTexture("proj-kiosk-1", 96, 112);
        pk1.destroy();
        const pk2 = this.make.graphics({ x: 0, y: 0 }, false);
        pk2.fillStyle(2696484, 1);
        pk2.fillRoundedRect(12, 12, 72, 94, 6);
        pk2.fillStyle(4472892, 1);
        pk2.fillRect(16, 16, 64, 88);
        pk2.fillStyle(14078929, 1);
        for (let ry = 20; ry <= 100; ry += 16) {
          pk2.fillRect(14, ry, 2, 2);
          pk2.fillRect(80, ry, 2, 2);
        }
        pk2.fillStyle(11817737, 1);
        pk2.fillCircle(36, 10, 8);
        pk2.fillCircle(60, 10, 8);
        pk2.fillStyle(16639626, 1);
        pk2.fillCircle(36, 10, 3);
        pk2.fillCircle(60, 10, 3);
        pk2.fillStyle(1841431, 1);
        pk2.fillRoundedRect(18, 28, 60, 46, 4);
        pk2.lineStyle(1, 7877903, 0.6);
        for (let gx = 24; gx <= 72; gx += 8) pk2.lineBetween(gx, 32, gx, 70);
        for (let gy = 34; gy <= 68; gy += 8) pk2.lineBetween(22, gy, 74, gy);
        pk2.fillStyle(16096779, 1);
        pk2.fillCircle(44, 50, 10);
        pk2.fillStyle(1841431, 1);
        pk2.fillCircle(44, 50, 5);
        pk2.fillStyle(16639626, 1);
        pk2.fillRect(52, 44, 14, 4);
        pk2.fillRect(62, 40, 5, 12);
        pk2.fillStyle(1841431, 1);
        pk2.fillRect(16, 76, 64, 12);
        pk2.fillStyle(11817737, 1);
        pk2.fillRect(26, 79, 4, 7);
        pk2.fillRect(36, 79, 4, 7);
        pk2.fillStyle(14251782, 1);
        pk2.fillCircle(56, 82, 4);
        pk2.fillStyle(4528643, 1);
        pk2.fillRoundedRect(20, 92, 56, 12, 2);
        pk2.lineStyle(1, 16096779, 1);
        pk2.strokeRoundedRect(20, 92, 56, 12, 2);
        pk2.fillStyle(16639626, 1);
        pk2.fillRect(26, 96, 44, 3);
        pk2.generateTexture("proj-kiosk-2", 96, 112);
        pk2.destroy();
        const pk3 = this.make.graphics({ x: 0, y: 0 }, false);
        pk3.fillStyle(1579035, 1);
        pk3.fillRoundedRect(12, 12, 72, 94, 6);
        pk3.fillStyle(2565930, 1);
        pk3.fillRect(16, 16, 64, 88);
        pk3.fillStyle(11032055, 1);
        pk3.fillRect(16, 16, 4, 8);
        pk3.fillRect(76, 16, 4, 8);
        pk3.fillRect(16, 96, 4, 8);
        pk3.fillRect(76, 96, 4, 8);
        pk3.fillStyle(9647082, 1);
        pk3.fillTriangle(48, 0, 42, 14, 54, 14);
        pk3.fillStyle(12616956, 1);
        pk3.fillTriangle(48, 0, 45, 14, 51, 14);
        pk3.fillTriangle(38, 4, 34, 14, 44, 14);
        pk3.fillTriangle(58, 4, 52, 14, 62, 14);
        pk3.fillStyle(591124, 1);
        pk3.fillRoundedRect(18, 28, 60, 46, 4);
        pk3.lineStyle(1, 15485081, 0.8);
        pk3.strokeCircle(48, 51, 14);
        pk3.lineStyle(1, 3718648, 0.9);
        pk3.strokeTriangle(48, 40, 37, 58, 59, 58);
        pk3.lineStyle(1, 11032055, 0.9);
        pk3.strokeTriangle(48, 62, 37, 44, 59, 44);
        pk3.fillStyle(16777215, 1);
        pk3.fillCircle(48, 51, 3);
        pk3.fillStyle(1579035, 1);
        pk3.fillRect(16, 76, 64, 12);
        pk3.fillStyle(15485081, 1);
        pk3.fillCircle(32, 82, 3);
        pk3.fillStyle(11032055, 1);
        pk3.fillCircle(48, 82, 3);
        pk3.fillStyle(3718648, 1);
        pk3.fillCircle(64, 82, 3);
        pk3.fillStyle(3868516, 1);
        pk3.fillRoundedRect(20, 92, 56, 12, 2);
        pk3.lineStyle(1, 12616956, 1);
        pk3.strokeRoundedRect(20, 92, 56, 12, 2);
        pk3.fillStyle(15984895, 1);
        pk3.fillRect(26, 96, 44, 3);
        pk3.generateTexture("proj-kiosk-3", 96, 112);
        pk3.destroy();
        const dp = this.make.graphics({ x: 0, y: 0 }, false);
        dp.fillStyle(13943976, 0.85);
        dp.fillCircle(3, 3, 2.5);
        dp.fillStyle(16774886, 0.95);
        dp.fillCircle(2.5, 2.5, 1);
        dp.generateTexture("dust-puff", 6, 6);
        dp.destroy();
        const lf = this.make.graphics({ x: 0, y: 0 }, false);
        lf.fillStyle(14251782, 0.9);
        lf.fillEllipse(5, 4, 8, 5);
        lf.fillStyle(16498468, 0.95);
        lf.fillRect(3, 3, 3, 2);
        lf.fillStyle(7877903, 0.8);
        lf.fillRect(0, 4, 2, 1);
        lf.generateTexture("autumn-leaf", 10, 8);
        lf.destroy();
        const lp = this.make.graphics({ x: 0, y: 0 }, false);
        lp.fillStyle(16708551, 0.95);
        lp.fillRect(1, 1, 8, 6);
        lp.lineStyle(1, 11817737, 0.6);
        lp.strokeRect(1, 1, 8, 6);
        lp.fillStyle(14427686, 1);
        lp.fillCircle(5, 4, 1.5);
        lp.generateTexture("letter-particle", 10, 8);
        lp.destroy();
        const ps = this.make.graphics({ x: 0, y: 0 }, false);
        ps.fillStyle(4144966, 1);
        ps.fillRoundedRect(6, 56, 60, 10, 3);
        ps.fillStyle(5395035, 1);
        ps.fillRect(8, 56, 56, 3);
        ps.fillStyle(2565930, 1);
        ps.fillRect(20, 42, 10, 15);
        ps.fillStyle(4144966, 1);
        ps.fillRect(21, 42, 3, 15);
        ps.fillStyle(10033947, 1);
        ps.fillRoundedRect(10, 14, 30, 32, 6);
        ps.fillStyle(12131356, 1);
        ps.fillRoundedRect(12, 16, 26, 8, 4);
        ps.fillStyle(8330525, 1);
        ps.fillRect(10, 40, 30, 6);
        ps.fillStyle(16096779, 1);
        ps.fillRect(15, 20, 20, 5);
        ps.fillStyle(4528643, 1);
        ps.fillRect(17, 23, 16, 2);
        ps.fillStyle(16498468, 1);
        ps.fillCircle(25, 32, 4);
        ps.fillStyle(10033947, 1);
        ps.fillCircle(25, 32, 2.5);
        ps.fillStyle(16498468, 1);
        ps.fillRect(21, 30, 3, 4);
        ps.fillRect(24, 35, 6, 2);
        ps.fillStyle(14251782, 1);
        ps.fillRect(18, 38, 14, 4);
        ps.fillStyle(16777215, 0.85);
        ps.fillRect(20, 39, 10, 2);
        ps.fillStyle(13935475, 1);
        ps.fillRect(40, 38, 24, 18);
        ps.fillStyle(12348453, 1);
        ps.fillRect(40, 38, 4, 18);
        ps.fillStyle(5779214, 1);
        ps.fillRect(40, 46, 24, 2);
        ps.fillRect(52, 38, 2, 18);
        ps.fillStyle(14427686, 1);
        ps.fillCircle(53, 47, 2);
        ps.fillStyle(16444877, 1);
        ps.fillRect(44, 26, 18, 13);
        ps.fillStyle(15330761, 1);
        ps.fillRect(44, 26, 3, 13);
        ps.fillStyle(5779214, 1);
        ps.fillRect(44, 32, 18, 2);
        ps.fillRect(52, 26, 2, 13);
        ps.fillStyle(2976335, 1);
        ps.fillRect(42, 34, 4, 6);
        ps.fillStyle(10727818, 1);
        ps.fillEllipse(36, 48, 14, 12);
        ps.fillStyle(5800279, 1);
        ps.fillEllipse(36, 44, 8, 5);
        ps.fillStyle(14251782, 1);
        ps.fillRect(4, 10, 8, 2);
        ps.fillRect(4, 10, 2, 6);
        ps.fillStyle(11817737, 1);
        ps.fillRect(2, 16, 6, 3);
        ps.fillStyle(16639626, 1);
        ps.fillRect(3, 19, 4, 6);
        ps.fillStyle(16777215, 1);
        ps.fillRect(4, 20, 2, 4);
        ps.generateTexture("post-station", 72, 68);
        ps.destroy();
        const postH = this.make.graphics({ x: 0, y: 0 }, false);
        postH.fillStyle(16096779, 0.28);
        postH.fillEllipse(36, 14, 68, 24);
        postH.fillStyle(16639626, 0.45);
        postH.fillEllipse(36, 14, 40, 12);
        postH.generateTexture("post-halo", 72, 28);
        postH.destroy();
        const rk = this.make.graphics({ x: 0, y: 0 }, false);
        rk.fillStyle(4528643, 1);
        rk.fillRoundedRect(8, 22, 56, 30, 4);
        rk.fillStyle(7877903, 1);
        rk.fillRoundedRect(12, 26, 48, 22, 3);
        rk.fillStyle(16096779, 1);
        rk.fillRect(12, 26, 4, 4);
        rk.fillRect(56, 26, 4, 4);
        rk.fillRect(12, 44, 4, 4);
        rk.fillRect(56, 44, 4, 4);
        rk.fillStyle(7877903, 1);
        rk.fillRect(6, 18, 60, 7);
        rk.fillStyle(10105874, 1);
        rk.fillRect(6, 18, 60, 2);
        rk.fillStyle(1332013, 1);
        rk.fillRect(18, 19, 34, 5);
        rk.fillStyle(10105874, 1);
        rk.fillRoundedRect(44, 28, 24, 18, 3);
        rk.lineStyle(1, 16107883, 1);
        rk.strokeRoundedRect(44, 28, 24, 18, 3);
        rk.fillStyle(16707722, 1);
        rk.fillRect(52, 32, 8, 6);
        rk.fillRect(54, 30, 4, 2);
        rk.fillStyle(10105874, 1);
        rk.fillRect(55, 33, 2, 4);
        rk.fillStyle(16707722, 0.9);
        rk.fillRect(48, 41, 16, 2);
        rk.fillStyle(14251782, 1);
        rk.fillRect(12, 10, 2, 9);
        rk.fillRect(10, 18, 6, 2);
        rk.fillStyle(366185, 1);
        rk.fillRoundedRect(8, 7, 12, 5, 2);
        rk.fillStyle(16707722, 1);
        rk.fillRect(10, 11, 8, 2);
        rk.fillStyle(16317180, 1);
        rk.fillRect(22, 15, 6, 6);
        rk.fillRect(20, 16, 2, 4);
        rk.fillStyle(4528643, 1);
        rk.fillRect(23, 16, 4, 2);
        rk.fillStyle(16777215, 0.7);
        rk.fillRect(24, 12, 2, 2);
        rk.fillRect(25, 9, 2, 2);
        rk.fillStyle(2450411, 1);
        rk.fillRect(32, 18, 12, 3);
        rk.fillStyle(16317180, 1);
        rk.fillRect(33, 16, 10, 3);
        rk.fillStyle(14251782, 1);
        rk.fillRect(45, 17, 6, 1);
        rk.generateTexture("recruiter-kiosk", 72, 56);
        rk.destroy();
        const clamp = this.make.graphics({ x: 0, y: 0 }, false);
        clamp.fillStyle(2565930, 1);
        clamp.fillRect(6, 56, 12, 8);
        clamp.fillStyle(14251782, 1);
        clamp.fillRect(7, 54, 10, 3);
        clamp.fillStyle(1579035, 1);
        clamp.fillRect(10, 22, 4, 32);
        clamp.fillStyle(16096779, 1);
        clamp.fillRect(10, 36, 4, 2);
        clamp.fillRect(10, 48, 4, 2);
        clamp.fillStyle(14251782, 1);
        clamp.fillRect(5, 8, 14, 4);
        clamp.fillRect(8, 4, 8, 4);
        clamp.fillStyle(16772565, 1);
        clamp.fillRect(6, 12, 12, 10);
        clamp.fillStyle(16777215, 1);
        clamp.fillRect(8, 14, 8, 6);
        clamp.fillStyle(1579035, 1);
        clamp.fillRect(6, 21, 12, 3);
        clamp.generateTexture("courier-lamp", 24, 64);
        clamp.destroy();
        const cbn = this.make.graphics({ x: 0, y: 0 }, false);
        cbn.fillStyle(1976098, 1);
        cbn.fillRect(6, 18, 4, 16);
        cbn.fillRect(46, 18, 4, 16);
        cbn.fillStyle(14251782, 1);
        cbn.fillRect(4, 12, 6, 4);
        cbn.fillRect(46, 12, 6, 4);
        for (const sy of [4, 8, 12]) {
          cbn.fillStyle(6634267, 1);
          cbn.fillRect(8, sy, 40, 3);
          cbn.fillStyle(9196070, 1);
          cbn.fillRect(8, sy, 40, 1);
        }
        cbn.fillStyle(6634267, 1);
        cbn.fillRect(4, 18, 48, 8);
        cbn.fillStyle(9196070, 1);
        cbn.fillRect(6, 19, 44, 3);
        cbn.fillStyle(16708551, 1);
        cbn.fillRect(24, 18, 10, 6);
        cbn.fillStyle(14427686, 1);
        cbn.fillCircle(29, 21, 1.5);
        cbn.generateTexture("courier-bench", 56, 36);
        cbn.destroy();
      }
      createAnimations() {
        this.anims.create({
          key: "player-walk",
          frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });
      }
    };
  }
});
function hash2(x, y) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = (h ^ h >>> 13) >>> 0;
  h = Math.imul(h, 1274126177) >>> 0;
  return ((h ^ h >>> 16) >>> 0) / 4294967296;
}
function samplePalette(scene, key, limit = 512) {
  const src = scene.textures.get(key).getSourceImage();
  const cnv = document.createElement("canvas");
  const w = src.naturalWidth || src.width;
  const h = src.naturalHeight || src.height;
  cnv.width = w;
  cnv.height = h;
  const ctx = cnv.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(src, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;
  const palette = [];
  for (let i = 0; i < data.length && palette.length < limit; i += 4) {
    if (data[i + 3] < 200) continue;
    palette.push([data[i], data[i + 1], data[i + 2]]);
  }
  return palette.length ? palette : [[120, 100, 70]];
}
function smoothRamp(palette) {
  const avg = (c) => (c[0] + c[1] + c[2]) / 3;
  const sorted = [...palette].sort((a, b) => avg(a) - avg(b));
  const ramp = [];
  for (let i = 0; i < 5; i++) {
    const lo = sorted[Math.floor(i / 5 * sorted.length)];
    const hi = sorted[Math.floor((i + 1) / 5 * (sorted.length - 1))];
    ramp.push([
      Math.round((lo[0] + hi[0]) / 2),
      Math.round((lo[1] + hi[1]) / 2),
      Math.round((lo[2] + hi[2]) / 2)
    ]);
  }
  return ramp;
}
function buildGroundTexture(scene) {
  const dirtPal = smoothRamp(samplePalette(scene, "footpath"));
  const grassPal = smoothRamp(samplePalette(scene, "grass"));
  const rng = mulberry32(20261025);
  const pathMask = new Uint8Array(GW * GH);
  const plazaMask = new Uint8Array(GW * GH);
  const ringMask = new Uint8Array(GW * GH);
  const padMask = new Uint8Array(GW * GH);
  const dirtMask = new Uint8Array(GW * GH);
  const fillRect = (m, x0, y0, w, h) => {
    const xa = Math.max(0, Math.floor(x0));
    const ya = Math.max(0, Math.floor(y0));
    const xb = Math.min(GW - 1, Math.ceil(x0 + w) - 1);
    const yb = Math.min(GH - 1, Math.ceil(y0 + h) - 1);
    for (let y = ya; y <= yb; y++)
      for (let x = xa; x <= xb; x++) m[y * GW + x] = 1;
  };
  const fillCircle = (m, cx, cy, r) => {
    const x0 = Math.max(0, Math.floor(cx - r));
    const x1 = Math.min(GW - 1, Math.ceil(cx + r));
    const y0 = Math.max(0, Math.floor(cy - r));
    const y1 = Math.min(GH - 1, Math.ceil(cy + r));
    const r2 = r * r;
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        if (dx * dx + dy * dy <= r2) m[y * GW + x] = 1;
      }
  };
  const fillRoundRect = (m, x0, y0, w, h, r) => {
    fillRect(m, x0 + r, y0, w - 2 * r, h);
    fillRect(m, x0, y0 + r, w, h - 2 * r);
    fillCircle(m, x0 + r, y0 + r, r);
    fillCircle(m, x0 + w - r, y0 + r, r);
    fillCircle(m, x0 + r, y0 + h - r, r);
    fillCircle(m, x0 + w - r, y0 + h - r, r);
  };
  const S = (v) => v / GROUND_CELL;
  const centerlines = PATHS.map((p) => {
    fillRect(pathMask, S(p.x), S(p.y), S(p.w), S(p.h));
    if (p.w >= p.h) {
      const r = S(p.h) / 2;
      fillCircle(pathMask, S(p.x), S(p.y + p.h / 2), r);
      fillCircle(pathMask, S(p.x + p.w), S(p.y + p.h / 2), r);
    } else {
      const r = S(p.w) / 2;
      fillCircle(pathMask, S(p.x + p.w / 2), S(p.y), r);
      fillCircle(pathMask, S(p.x + p.w / 2), S(p.y + p.h), r);
    }
    return {
      horiz: p.w >= p.h,
      x0: S(p.x),
      x1: S(p.x + p.w),
      y0: S(p.y),
      y1: S(p.y + p.h),
      cx: S(p.x + p.w / 2),
      cy: S(p.y + p.h / 2),
      half: S(Math.min(p.w, p.h)) / 2
    };
  });
  const pzX = S(PLAZA.cx - PLAZA.half);
  const pzY = S(PLAZA.cy - PLAZA.half);
  const pzS = S(PLAZA.half * 2);
  fillRoundRect(plazaMask, pzX, pzY, pzS, pzS, 8);
  const fC = { x: S(POINTS.fountain.x), y: S(POINTS.fountain.y + 42) };
  const fR = S(185);
  fillCircle(ringMask, fC.x, fC.y, fR);
  const gardenCourtyardMask = new Uint8Array(GW * GH);
  const gCourtyardC = { x: S(2404), y: S(1500) };
  const gCourtyardR = S(80);
  fillCircle(gardenCourtyardMask, gCourtyardC.x, gCourtyardC.y, gCourtyardR);
  const courierPlazaMask = new Uint8Array(GW * GH);
  const cpX0 = S(COURIER_PLAZA.cx - COURIER_PLAZA.w / 2);
  const cpY0 = S(COURIER_PLAZA.cy - COURIER_PLAZA.h / 2);
  const cpW = S(COURIER_PLAZA.w);
  const cpH = S(COURIER_PLAZA.h);
  fillRoundRect(courierPlazaMask, cpX0, cpY0, cpW, cpH, S(COURIER_PLAZA.r));
  for (const p of GROUND_PADS) fillCircle(padMask, S(p.x), S(p.y), S(p.r));
  for (let i = 0; i < dirtMask.length; i++) dirtMask[i] = pathMask[i] | padMask[i];
  const neighbor0 = (m, x, y) => x === 0 || y === 0 || x === GW - 1 || y === GH - 1 || m[y * GW + x - 1] === 0 || m[y * GW + x + 1] === 0 || m[(y - 1) * GW + x] === 0 || m[(y + 1) * GW + x] === 0;
  for (let y = 0; y < GH; y++)
    for (let x = 0; x < GW; x++) {
      const i = y * GW + x;
      if (dirtMask[i] === 1 && neighbor0(dirtMask, x, y) && rng() < 0.3) dirtMask[i] = 0;
    }
  for (let y = 1; y < GH - 1; y++)
    for (let x = 1; x < GW - 1; x++) {
      const i = y * GW + x;
      if (dirtMask[i]) continue;
      const n = (dirtMask[i - 1] ? 1 : 0) + (dirtMask[i + 1] ? 1 : 0) + (dirtMask[i - GW] ? 1 : 0) + (dirtMask[i + GW] ? 1 : 0);
      if (n >= 3 && rng() < 0.5) dirtMask[i] = 1;
    }
  const cnv = document.createElement("canvas");
  cnv.width = GW;
  cnv.height = GH;
  const ctx = cnv.getContext("2d");
  const img = ctx.createImageData(GW, GH);
  const px = img.data;
  const put = (i, c, mul = 1) => {
    px[i] = Math.min(255, c[0] * mul) | 0;
    px[i + 1] = Math.min(255, c[1] * mul) | 0;
    px[i + 2] = Math.min(255, c[2] * mul) | 0;
    px[i + 3] = 255;
  };
  const toneAt = (x, y, ramp) => {
    const big = ramp[hash2(x >> 4, y >> 4) * ramp.length | 0];
    const small = ramp[hash2(x >> 2, y >> 2) * ramp.length | 0];
    return [
      big[0] * 3 + small[0] >> 2,
      big[1] * 3 + small[1] >> 2,
      big[2] * 3 + small[2] >> 2
    ];
  };
  const onDirtEdge = (x, y) => neighbor0(dirtMask, x, y) || !plazaMask[y * GW + x] && (x === 0 || plazaMask[y * GW + x - 1] || plazaMask[y * GW + x + 1] || plazaMask[(y - 1 < 0 ? 0 : y - 1) * GW + x] || plazaMask[(y + 1 >= GH ? GH - 1 : y + 1) * GW + x]);
  const gardenBeds = [
    { x: S(2404), y: S(1220), r: S(76) },
    { x: S(2640), y: S(1500), r: S(76) },
    { x: S(2404), y: S(1780), r: S(76) }
  ];
  const projectPads = [
    { x: S(1060), y: S(375), r: S(52) },
    { x: S(1360), y: S(375), r: S(52) },
    { x: S(1660), y: S(375), r: S(52) },
    { x: S(1960), y: S(375), r: S(52) }
  ];
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      const idx = y * GW + x;
      const i = idx * 4;
      if (gardenCourtyardMask[idx]) {
        const dx2 = x + 0.5 - gCourtyardC.x;
        const dy2 = y + 0.5 - gCourtyardC.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        const ring = Math.abs(dist2 - gCourtyardR * 0.48) < 0.6 || Math.abs(dist2 - gCourtyardR * 0.88) < 0.5;
        const curb = dist2 > gCourtyardR - 1.2;
        const grout = (x + y) % 4 === 0 || (x - y) % 4 === 0;
        const tone = STONE_PALETTE[hash2(x, y) * STONE_PALETTE.length | 0];
        put(i, tone, curb ? 0.7 : ring ? 0.64 : grout ? 0.78 : 0.96 + hash2(x, y) * 0.08);
        continue;
      }
      const inProjPad = projectPads.find((b) => Math.hypot(x + 0.5 - b.x, y + 0.5 - b.y) <= b.r);
      if (inProjPad) {
        const dist2 = Math.hypot(x + 0.5 - inProjPad.x, y + 0.5 - inProjPad.y);
        const curb = dist2 > inProjPad.r - 1.2;
        const ring = Math.abs(dist2 - inProjPad.r * 0.6) < 0.6;
        const tone = STONE_PALETTE[hash2(x, y) * STONE_PALETTE.length | 0];
        put(i, tone, curb ? 0.72 : ring ? 0.8 : 0.94 + hash2(x, y) * 0.08);
        continue;
      }
      if (courierPlazaMask[idx]) {
        const dx2 = x + 0.5 - S(COURIER_PLAZA.cx);
        const dy2 = y + 0.5 - S(COURIER_PLAZA.cy);
        const dist2 = Math.hypot(dx2, dy2);
        const rosetteRing = Math.abs(dist2 - S(52)) < 0.6 || Math.abs(dist2 - S(24)) < 0.6;
        const isNorthEntrance = y < cpY0 + 1.8 && x >= S(1436) - 0.5 && x <= S(1436 + PATH_W) + 0.5;
        const curb = !isNorthEntrance && (x < cpX0 + 1.2 || x > cpX0 + cpW - 1.4 || y < cpY0 + 1.2 || y > cpY0 + cpH - 1.4);
        const grout = (x + y) % 4 === 0 || (x - y) % 4 === 0;
        const tone = STONE_PALETTE[hash2(x + 80, y + 80) * STONE_PALETTE.length | 0];
        const toneMul = curb ? 0.72 : rosetteRing ? 0.65 : grout ? 0.78 : 0.95 + hash2(x, y) * 0.08;
        put(i, tone, toneMul);
        continue;
      }
      if (dirtMask[idx]) {
        const inBed = gardenBeds.find(
          (b) => Math.hypot(x + 0.5 - b.x, y + 0.5 - b.y) <= b.r
        );
        if (inBed) {
          const distToBed = Math.hypot(x + 0.5 - inBed.x, y + 0.5 - inBed.y);
          if (distToBed > inBed.r - 1.4) {
            put(i, [154, 149, 138], 0.82);
            continue;
          }
          const rLoam = hash2(x * 3, y * 3);
          if (rLoam < 0.04) {
            put(i, [245, 143, 179]);
          } else if (rLoam < 0.07) {
            put(i, [255, 209, 102]);
          } else {
            const loamShade = 0.82 + hash2(x, y) * 0.16;
            put(i, [84, 60, 42], loamShade);
          }
          continue;
        }
        if (rng() < 0.015) {
          put(i, [172, 158, 130], 0.94 + rng() * 0.12);
          continue;
        }
        const c2 = toneAt(x, y, dirtPal);
        let mul = 0.95 + hash2(x, y) * 0.1;
        for (const cl of centerlines) {
          if (cl.horiz && y + 0.5 > cl.cy - cl.half && y + 0.5 < cl.cy + cl.half) {
            const d = Math.abs(y + 0.5 - cl.cy) / cl.half;
            if (d < 0.5 && x + 0.5 > cl.x0 + 1 && x + 0.5 < cl.x1 - 1) mul *= 1.05;
          } else if (!cl.horiz && x + 0.5 > cl.cx - cl.half && x + 0.5 < cl.cx + cl.half) {
            const d = Math.abs(x + 0.5 - cl.cx) / cl.half;
            if (d < 0.5 && y + 0.5 > cl.y0 + 1 && y + 0.5 < cl.y1 - 1) mul *= 1.05;
          }
        }
        if (onDirtEdge(x, y)) mul *= 0.78;
        put(i, c2, mul);
        continue;
      }
      const dx = x + 0.5 - fC.x;
      const dy = y + 0.5 - fC.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= fR) {
        const ring = Math.abs(dist - fR * 0.55) < 0.6 || Math.abs(dist - fR * 0.82) < 0.5;
        const c2 = STONE_PALETTE[hash2(x, y) * STONE_PALETTE.length | 0];
        put(i, c2, ring ? 0.62 : 0.95 + hash2(x, y) * 0.1);
        continue;
      }
      if (plazaMask[idx]) {
        const curb = x < pzX + 3 || y < pzY + 3 || x > pzX + pzS - 4 || y > pzY + pzS - 4;
        const grout = x % 5 === 0 || y % 5 === 0;
        const tone = STONE_PALETTE[hash2(Math.floor(x / 5) + 1e3, Math.floor(y / 5) + 1e3) * STONE_PALETTE.length | 0];
        put(i, tone, curb ? 0.72 : grout ? 0.6 : 0.92 + hash2(x, y) * 0.16);
        continue;
      }
      const c = toneAt(x, y, grassPal);
      put(i, c, hash2(x + 7, y + 7) < 0.04 ? 0.84 : 0.98 + hash2(x, y) * 0.06);
    }
  }
  const ax = Math.round(SECRET_MARK.x / GROUND_CELL);
  const ay = Math.round(SECRET_MARK.y / GROUND_CELL);
  for (let k = 0; k < 3; k++) {
    const cy = ay + k * 4;
    for (let d = -3; d <= 3; d++) {
      const yy = cy + (3 - Math.abs(d));
      if (yy >= 0 && yy < GH) put((yy * GW + ax + d) * 4, [186, 176, 156], 1);
    }
  }
  ctx.putImageData(img, 0, 0);
  if (scene.textures.exists("world-ground")) scene.textures.remove("world-ground");
  scene.textures.addCanvas("world-ground", cnv);
  scene.textures.get("world-ground").setFilter(Phaser4__namespace.Textures.FilterMode.NEAREST);
}
function addGroundImage(scene) {
  buildGroundTexture(scene);
  return scene.add.image(WORLD.width / 2, WORLD.height / 2, "world-ground").setOrigin(0.5).setScale(GROUND_CELL).setDepth(-1e3);
}
var GW, GH, STONE_PALETTE;
var init_ground = __esm({
  "src/game/systems/ground.ts"() {
    init_world();
    GW = WORLD.width / GROUND_CELL;
    GH = WORLD.height / GROUND_CELL;
    STONE_PALETTE = [
      [154, 149, 138],
      // light flagstone
      [139, 134, 124],
      // mid
      [125, 120, 110],
      // dark
      [165, 160, 149]
      // pale fleck
    ];
  }
});
var Ghost;
var init_Ghost = __esm({
  "src/game/entities/Ghost.ts"() {
    init_shared();
    Ghost = class {
      constructor(scene, spawn) {
        this.moving = false;
        this.facing = "right";
        this.scene = scene;
        this.id = spawn.id;
        this.tx = spawn.x;
        this.ty = spawn.y;
        this.facing = spawn.facing;
        this.glow = scene.add.image(spawn.x, spawn.y + 26, "ghost-glow").setScale(3.4).setAlpha(0).setDepth(spawn.y + 35).setBlendMode(Phaser4__namespace.BlendModes.ADD);
        this.sprite = scene.add.sprite(spawn.x, spawn.y, "player", 0).setScale(1.6).setAlpha(0).setDepth(spawn.y + 36);
        this.sprite.setTint(11065599);
        this.label = scene.add.text(spawn.x, spawn.y - 64, spawn.name, {
          fontFamily: pixelFont(),
          fontSize: "10px",
          color: "#cfeaff",
          stroke: "#0a1420",
          strokeThickness: 4
        }).setOrigin(0.5, 1).setResolution(2).setAlpha(0).setDepth(2999);
        this.sprite.setFlipX(this.facing === "left");
        this.fadeTween = scene.tweens.add({
          targets: [this.sprite, this.label],
          alpha: { from: 0, to: 1 },
          duration: 650,
          ease: "Sine.easeOut"
        });
        scene.tweens.add({
          targets: this.glow,
          alpha: { from: 0, to: 0.55 },
          duration: 650,
          ease: "Sine.easeOut"
        });
        const burst = scene.add.particles(spawn.x, spawn.y, "sparkle", {
          speed: { min: 30, max: 130 },
          lifespan: 700,
          scale: { start: 0.9, end: 0 },
          quantity: 1,
          frequency: 24,
          tint: 11065599,
          blendMode: "ADD",
          emitting: false
        }).setDepth(3100);
        burst.explode(18);
        scene.time.delayedCall(1200, () => burst.destroy());
      }
      setTarget(x, y, moving, facing) {
        this.tx = x;
        this.ty = y;
        this.moving = moving;
        if (facing === "left" || facing === "right") this.facing = facing;
      }
      /** Current visual position (for the minimap). */
      visualPosition() {
        return { x: Math.round(this.sprite.x), y: Math.round(this.sprite.y) };
      }
      update(dt) {
        const k = 1 - Math.exp(-9 * dt);
        this.sprite.x += (this.tx - this.sprite.x) * k;
        this.sprite.y += (this.ty - this.sprite.y) * k;
        const dist = Math.hypot(this.tx - this.sprite.x, this.ty - this.sprite.y);
        if (this.moving && dist > 3) {
          this.sprite.play("player-walk", true);
        } else {
          this.sprite.anims.stop();
          this.sprite.setTexture("player", 0);
        }
        this.sprite.setFlipX(this.facing === "left");
        this.sprite.setDepth(this.sprite.y + 36);
        this.glow.setPosition(this.sprite.x, this.sprite.y + 26);
        this.glow.setDepth(this.sprite.y + 35);
        this.label.setPosition(this.sprite.x, this.sprite.y - 64);
      }
      fadeOutAndDestroy() {
        var _a;
        (_a = this.fadeTween) == null ? void 0 : _a.remove();
        this.scene.tweens.add({
          targets: [this.sprite, this.label, this.glow],
          alpha: 0,
          duration: 550,
          ease: "Sine.easeIn",
          onComplete: () => {
            this.label.destroy();
            this.glow.destroy();
            this.sprite.destroy();
          }
        });
      }
    };
  }
});

// src/game/systems/ghosts.ts
function visitorId() {
  var _a, _b;
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem("pg_visitor_id");
    if (!id) {
      id = ((_b = (_a = crypto.randomUUID) == null ? void 0 : _a.call(crypto)) != null ? _b : `${Date.now()}-${Math.random()}`) + "";
      sessionStorage.setItem("pg_visitor_id", id);
    }
    return id;
  } catch (e) {
    return `anon-${Math.random().toString(36).slice(2)}`;
  }
}
var MAX_GHOSTS, REPORT_MIN_MS, REPORT_IDLE_MS, GhostSystem, ghosts;
var init_ghosts = __esm({
  "src/game/systems/ghosts.ts"() {
    init_Ghost();
    init_audio();
    MAX_GHOSTS = 14;
    REPORT_MIN_MS = 240;
    REPORT_IDLE_MS = 2500;
    GhostSystem = class {
      constructor() {
        this.scene = null;
        this.es = null;
        this.ghosts = /* @__PURE__ */ new Map();
        this.id = visitorId();
        this.lastReport = 0;
        this.lastReportedPos = { x: -1, y: -1, moving: false };
        this.lastChime = 0;
        this.pageHide = () => {
          if (!this.id || typeof navigator === "undefined" || !navigator.sendBeacon) return;
          try {
            navigator.sendBeacon(
              "/api/presence",
              new Blob([JSON.stringify({ id: this.id, leave: true })], {
                type: "application/json"
              })
            );
          } catch (e) {
          }
        };
      }
      connect(scene) {
        this.disconnect();
        this.scene = scene;
        this.id = visitorId();
        if (!this.id) return;
        if (process.env.NEXT_PUBLIC_ENABLE_PRESENCE !== "true") return;
        window.addEventListener("pagehide", this.pageHide);
        try {
          this.es = new EventSource(
            `/api/presence/stream?id=${encodeURIComponent(this.id)}`
          );
          this.es.onmessage = (ev) => {
            var _a;
            try {
              const data = JSON.parse(ev.data);
              this.applySnapshot((_a = data.visitors) != null ? _a : []);
            } catch (e) {
            }
          };
          this.es.onerror = () => {
          };
        } catch (e) {
        }
      }
      applySnapshot(list) {
        const scene = this.scene;
        if (!scene || !scene.scene.isActive()) return;
        const seen = /* @__PURE__ */ new Set();
        for (const v of list) {
          if (!v || typeof v.id !== "string") continue;
          seen.add(v.id);
          const existing = this.ghosts.get(v.id);
          if (existing) {
            existing.setTarget(v.x, v.y, !!v.moving, v.facing);
          } else if (this.ghosts.size < MAX_GHOSTS) {
            this.ghosts.set(
              v.id,
              new Ghost(scene, {
                id: v.id,
                name: v.name || "Visitor",
                x: v.x,
                y: v.y,
                facing: v.facing,
                moving: !!v.moving
              })
            );
            const now = performance.now();
            if (now - this.lastChime > 1800) {
              this.lastChime = now;
              exports.audio.ghost();
            }
          }
        }
        for (const [id, ghost] of this.ghosts) {
          if (!seen.has(id)) {
            ghost.fadeOutAndDestroy();
            this.ghosts.delete(id);
          }
        }
      }
      /** Throttled heartbeat to the server. Fire-and-forget. */
      report(x, y, moving, facing) {
        if (!this.id || process.env.NEXT_PUBLIC_ENABLE_PRESENCE !== "true") return;
        const now = performance.now();
        const moved = Math.abs(x - this.lastReportedPos.x) > 2 || Math.abs(y - this.lastReportedPos.y) > 2 || moving !== this.lastReportedPos.moving;
        if (!moved && now - this.lastReport < REPORT_IDLE_MS) return;
        if (moved && now - this.lastReport < REPORT_MIN_MS) return;
        this.lastReport = now;
        this.lastReportedPos = { x, y, moving };
        try {
          void fetch("/api/presence", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: this.id, x, y, moving, facing })
          }).catch(() => {
          });
        } catch (e) {
        }
      }
      update(dt) {
        for (const ghost of this.ghosts.values()) ghost.update(dt);
      }
      /** Positions for the minimap. */
      positions() {
        const out = [];
        for (const ghost of this.ghosts.values()) {
          out.push(__spreadValues({ id: ghost.id }, ghost.visualPosition()));
        }
        return out;
      }
      onlineCount() {
        return this.ghosts.size;
      }
      disconnect() {
        var _a;
        (_a = this.es) == null ? void 0 : _a.close();
        this.es = null;
        window.removeEventListener("pagehide", this.pageHide);
      }
      /** Full teardown — also tells the server we left, so ghosts vanish fast. */
      leave() {
        this.disconnect();
        for (const ghost of this.ghosts.values()) ghost.fadeOutAndDestroy();
        this.ghosts.clear();
        this.scene = null;
        this.lastReport = 0;
        this.lastReportedPos = { x: -1, y: -1, moving: false };
        if (this.id && process.env.NEXT_PUBLIC_ENABLE_PRESENCE === "true") {
          try {
            void fetch("/api/presence", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: this.id, leave: true }),
              keepalive: true
            }).catch(() => {
            });
          } catch (e) {
          }
        }
      }
    };
    ghosts = new GhostSystem();
  }
});

// src/game/entities/Player.ts
var Player;
var init_Player = __esm({
  "src/game/entities/Player.ts"() {
    Player = class {
      constructor(scene, x, y) {
        this.speed = 340;
        this.walkKey = "player-walk";
        this.stepTimer = 0;
        var _a, _b;
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, "player");
        this.sprite.setScale(1.6);
        (_a = this.sprite.body) == null ? void 0 : _a.setSize(36, 30);
        (_b = this.sprite.body) == null ? void 0 : _b.setOffset(7, 18);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDepth(y + 36);
        this.sprite.setTexture("player", 0);
        this.dustEmitter = scene.add.particles(0, 0, "dust-puff", {
          lifespan: 280,
          scale: { start: 1.3, end: 0.2 },
          alpha: { start: 0.75, end: 0 },
          speedY: { min: -15, max: -35 },
          speedX: { min: -18, max: 18 },
          emitting: false
        });
        this.dustEmitter.setDepth(y + 20);
      }
      /**
       * @param mvx,mvy normalized -1..1 input vector
       * @returns true if the player actually moved this frame
       */
      update(mvx, mvy) {
        const moving = mvx !== 0 || mvy !== 0;
        if (moving) {
          const len = Math.hypot(mvx, mvy) || 1;
          this.sprite.setVelocity(
            mvx / len * this.speed,
            mvy / len * this.speed
          );
          this.sprite.play(this.walkKey, true);
          this.stepTimer += 16;
          if (this.stepTimer >= 130) {
            this.stepTimer = 0;
            const footX = this.sprite.x + (this.sprite.flipX ? 8 : -8);
            const footY = this.sprite.y + 22;
            this.dustEmitter.emitParticleAt(footX, footY, 1);
            this.dustEmitter.setDepth(this.sprite.depth - 1);
          }
        } else {
          this.sprite.setVelocity(0, 0);
          this.sprite.anims.stop();
          this.sprite.setTexture("player", 0);
          this.stepTimer = 100;
        }
        if (mvx < -0.05) this.sprite.setFlipX(true);
        else if (mvx > 0.05) this.sprite.setFlipX(false);
        this.sprite.setDepth(this.sprite.y + 36);
        return moving;
      }
      stop() {
        this.sprite.setVelocity(0, 0);
        this.sprite.anims.pause();
      }
      destroy() {
        this.dustEmitter.destroy();
        this.sprite.destroy();
      }
    };
  }
});

// src/game/entities/NPC.ts
var NPC;
var init_NPC = __esm({
  "src/game/entities/NPC.ts"() {
    init_shared();
    NPC = class {
      constructor(scene, def, x, y, wanderDist) {
        this.scene = scene;
        this.def = def;
        this.sprite = scene.physics.add.sprite(x, y, "player", 0);
        this.sprite.setScale(1.5);
        this.sprite.setTint(def.tint);
        this.sprite.body.setImmovable(true);
        this.sprite.body.setSize(36, 30);
        this.sprite.body.setOffset(7, 18);
        this.sprite.setDepth(y + 34);
        scene.tweens.add({
          targets: this.sprite,
          y: y - 6,
          duration: 1100 + Math.random() * 500,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });
        this.wanderTween = scene.tweens.add({
          targets: this.sprite,
          x: x + wanderDist,
          duration: 3800 + Math.random() * 2400,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
          onYoyo: () => this.setFlip(true),
          onRepeat: () => this.setFlip(false)
        });
        this.label = scene.add.text(x, y - 66, def.name, {
          fontFamily: pixelFont(),
          fontSize: "11px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4
        }).setOrigin(0.5, 1).setResolution(2).setDepth(2999);
      }
      setFlip(flip) {
        this.sprite.setFlipX(flip);
      }
      /** Little hop + label bump when a conversation starts. */
      celebrate() {
        this.scene.tweens.add({
          targets: this.sprite,
          y: this.sprite.y - 18,
          duration: 130,
          yoyo: true,
          ease: "Quad.easeOut"
        });
      }
      update() {
        this.label.setPosition(this.sprite.x, this.sprite.y - 66);
        this.sprite.setDepth(this.sprite.y + 34);
      }
      destroy() {
        var _a;
        (_a = this.wanderTween) == null ? void 0 : _a.remove();
        this.label.destroy();
        this.sprite.destroy();
      }
    };
  }
});
var KONAMI, zoneSource, WorldScene;
var init_WorldScene = __esm({
  "src/game/scenes/WorldScene.ts"() {
    init_portfolio();
    init_events();
    init_shared();
    init_achievements();
    init_audio();
    init_ground();
    init_ghosts();
    init_Player();
    init_NPC();
    init_world();
    KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    zoneSource = (shape) => shape;
    WorldScene = class extends Phaser4__namespace.Scene {
      constructor() {
        super("WorldScene");
        this.npcs = [];
        this.interactables = [];
        this.activeId = null;
        this.moveUnlocked = false;
        this.visitedDistricts = /* @__PURE__ */ new Set();
        this.readProjects = /* @__PURE__ */ new Set();
        this.talkedNpcs = /* @__PURE__ */ new Set();
        this.konamiIndex = 0;
        this.konamiListener = () => {
        };
        this.offBusCleanups = [];
        this.tickAcc = 0;
        this.lastPresence = 0;
        this.lastFacing = "right";
        this.currentTimeMode = "day";
        this.lampHalos = [];
        this.fireflyEmitters = [];
      }
      create() {
        this.physics.world.setBounds(0, 0, WORLD.width, WORLD.height);
        this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
        this.statics = this.physics.add.staticGroup();
        addGroundImage(this);
        this.scatterDecor();
        this.buildProps();
        this.buildNpcs();
        this.buildInteractables();
        this.buildAtmosphere();
        this.buildAmbientLighting();
        this.player = new Player(this, SPAWN.x, SPAWN.y);
        this.physics.add.collider(this.player.sprite, this.statics);
        this.npcs.forEach((n) => this.physics.add.collider(this.player.sprite, n.sprite));
        ghosts.connect(this);
        this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);
        this.cameras.main.setZoom(zoomFor(this.scale.width, this.scale.height));
        this.cameras.main.fadeIn(700, 15, 25, 15);
        this.keys = this.input.keyboard.addKeys(
          "W,A,S,D,UP,DOWN,LEFT,RIGHT"
        );
        this.interactKey = this.input.keyboard.addKey("E");
        this.input.keyboard.addCapture("W,A,S,D,UP,DOWN,LEFT,RIGHT,E");
        this.konamiListener = (e) => this.trackKonami(e.keyCode);
        window.addEventListener("keydown", this.konamiListener);
        this.scale.on(
          "resize",
          (gs) => {
            this.cameras.main.setZoom(zoomFor(gs.width, gs.height));
            this.updateAmbientOverlaySize(gs.width, gs.height);
          },
          this
        );
        this.offBusCleanups.push(
          onGameEvent("pg:time-mode", (d) => {
            var _a;
            this.setTimeMode(d.mode, (_a = d.instant) != null ? _a : false);
          }),
          onGameEvent("pg:fountain-toss", () => {
            this.handleFountainToss();
          }),
          onGameEvent("pg:zone-open", () => {
            var _a;
            (_a = this.input.keyboard) == null ? void 0 : _a.clearCaptures();
          }),
          onGameEvent("pg:zone-close", () => {
            var _a;
            exports.gameRuntime.modalOpen = false;
            exports.audio.close();
            (_a = this.input.keyboard) == null ? void 0 : _a.addCapture("W,A,S,D,UP,DOWN,LEFT,RIGHT,E");
          })
        );
        this.events.once(Phaser4__namespace.Scenes.Events.SHUTDOWN, () => {
          var _a, _b;
          this.offBusCleanups.forEach((off) => off());
          this.scale.off("resize");
          window.removeEventListener("keydown", this.konamiListener);
          (_a = this.ambientTween) == null ? void 0 : _a.stop();
          (_b = this.player) == null ? void 0 : _b.destroy();
          ghosts.leave();
        });
        emitGameEvent("pg:ready", void 0);
      }
      // ------------------------------------------------------------------
      // World building (runs ONCE)
      // ------------------------------------------------------------------
      addTree(x, y, rng) {
        const key = rng() > 0.5 ? "tree1" : "tree2";
        const scale = 0.92 + rng() * 0.2;
        this.add.image(x, y, key).setDepth(y + 84).setScale(scale);
        this.add.image(x, y + 84, "shadow").setDepth(y + 83).setScale(1);
        const body = this.add.rectangle(x, y + 78, 30, 14, 0, 0);
        this.statics.add(body);
        body.setDepth(-200);
      }
      scatterDecor() {
        const rng = mulberry32(20261024);
        const inClear = (x, y, pad) => CLEAR_ZONES.some((z) => x >= z.x - pad && x <= z.x + z.w + pad && y >= z.y - pad && y <= z.y + z.h + pad);
        const trees = [];
        let attempts = 0;
        while (trees.length < 58 && attempts < 900) {
          attempts++;
          const x = 120 + rng() * (WORLD.width - 240);
          const y = 120 + rng() * (WORLD.height - 240);
          if (inClear(x, y, 70)) continue;
          if (trees.some((t) => Math.hypot(t.x - x, t.y - y) < 130)) continue;
          trees.push({ x, y });
        }
        for (const t of trees) {
          this.addTree(t.x, t.y, rng);
        }
        for (const t of CHEST_TREES) {
          this.addTree(t.x, t.y, () => Math.random());
        }
        for (let i = 0; i < 26; i++) {
          const x = 120 + rng() * (WORLD.width - 240);
          const y = 120 + rng() * (WORLD.height - 240);
          if (inClear(x, y, 50)) continue;
          this.add.image(x, y, "bush").setDepth(-350).setScale(0.8 + rng() * 0.5);
        }
        for (let i = 0; i < 90; i++) {
          const x = 60 + rng() * (WORLD.width - 120);
          const y = 60 + rng() * (WORLD.height - 120);
          if (inClear(x, y, 20)) continue;
          this.add.image(x, y, `flower${Math.floor(rng() * 3)}`).setDepth(-350).setScale(0.9 + rng() * 0.9);
        }
      }
      buildProps() {
        const fountainDepth = POINTS.fountain.y + 98;
        const f = this.add.image(POINTS.fountain.x, POINTS.fountain.y, "fountain");
        f.setScale(0.72).setDepth(fountainDepth);
        this.add.image(POINTS.fountain.x, POINTS.fountain.y + 95, "shadow").setDepth(fountainDepth - 6).setScale(1.6, 1.1);
        const b1 = this.add.rectangle(POINTS.fountain.x, POINTS.fountain.y - 5, 170, 30, 0, 0);
        const b2 = this.add.rectangle(POINTS.fountain.x, POINTS.fountain.y + 25, 210, 30, 0, 0);
        const b3 = this.add.rectangle(POINTS.fountain.x, POINTS.fountain.y + 55, 210, 30, 0, 0);
        const b4 = this.add.rectangle(POINTS.fountain.x, POINTS.fountain.y + 84, 150, 28, 0, 0);
        [b1, b2, b3, b4].forEach((b) => {
          this.statics.add(b);
          b.setDepth(-200);
        });
        this.fountainGlow = this.add.circle(POINTS.fountain.x, POINTS.fountain.y - 20, 80, 16777215, 0.12).setBlendMode(Phaser4__namespace.BlendModes.ADD).setDepth(2975);
        PROJECT_BOARDS.forEach((b, i) => {
          var _a;
          const project = exports.portfolio.projects[i];
          const emoji = (_a = project == null ? void 0 : project.emoji) != null ? _a : "\u{1F4CB}";
          const kioskKey = `proj-kiosk-${i}`;
          this.add.image(b.x, b.y + 50, "shadow").setScale(1.6, 1).setDepth(b.y + 48);
          const halo = this.add.image(b.x, b.y + 54, "proj-halo").setDepth(b.y + 49).setAlpha(0.6);
          this.tweens.add({
            targets: halo,
            alpha: { from: 0.35, to: 0.85 },
            scaleX: { from: 0.95, to: 1.08 },
            duration: 1600 + i * 200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
          });
          this.add.image(b.x, b.y, kioskKey).setDepth(b.y + 54);
          const body = this.add.rectangle(b.x, b.y + 44, 88, 22, 0, 0);
          this.statics.add(body);
          body.setDepth(-200);
          const badge = this.add.container(b.x, b.y - 66).setDepth(2990);
          const plaqueW = Math.min(184, Math.max(126, project.title.length * 8 + 48));
          const badgeBg = this.add.graphics().fillStyle(1314824, 0.94).fillRoundedRect(-plaqueW / 2, -18, plaqueW, 36, 8).lineStyle(2, 15253872, 0.95).strokeRoundedRect(-plaqueW / 2, -18, plaqueW, 36, 8);
          const icon = this.add.text(-plaqueW / 2 + 18, 0, emoji, { fontSize: "18px" }).setOrigin(0.5);
          const title = this.add.text(-plaqueW / 2 + 34, 0, project.title, {
            fontFamily: pixelFont(),
            fontSize: "10px",
            color: "#f5e6c8"
          }).setOrigin(0, 0.5).setResolution(2);
          badge.add([badgeBg, icon, title]);
          this.tweens.add({
            targets: badge,
            y: b.y - 74,
            duration: 1400 + i * 160,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
          });
        });
        const gardenCx = 2404;
        const gardenCy = 1500;
        this.add.image(gardenCx, gardenCy, "garden-sundial").setDepth(gardenCy + 18);
        this.add.image(gardenCx, gardenCy + 18, "shadow").setScale(0.8, 0.6).setDepth(gardenCy + 15);
        const sundialBody = this.add.rectangle(gardenCx, gardenCy + 8, 32, 22, 0, 0);
        this.statics.add(sundialBody);
        sundialBody.setDepth(-200);
        const benches = [
          { x: gardenCx - 88, y: 1400 },
          { x: gardenCx - 88, y: 1600 }
        ];
        benches.forEach((bn) => {
          this.add.image(bn.x, bn.y, "garden-bench").setDepth(bn.y + 20);
          this.add.image(bn.x, bn.y + 16, "shadow").setScale(1, 0.7).setDepth(bn.y + 14);
          const bBody = this.add.rectangle(bn.x, bn.y + 10, 52, 18, 0, 0);
          this.statics.add(bBody);
          bBody.setDepth(-200);
        });
        const hedges = [
          // Along path from plaza (north & south borders)
          { x: 2060, y: 1395 },
          { x: 2110, y: 1395 },
          { x: 2210, y: 1395 },
          { x: 2260, y: 1395 },
          { x: 2060, y: 1605 },
          { x: 2110, y: 1605 },
          { x: 2210, y: 1605 },
          { x: 2260, y: 1605 },
          // Courtyard corner hedges
          { x: gardenCx - 88, y: 1350 },
          { x: gardenCx - 88, y: 1650 },
          { x: gardenCx + 88, y: 1350 },
          { x: gardenCx + 88, y: 1650 },
          // Flanking Frontend sanctuary
          { x: gardenCx - 90, y: 1220 },
          { x: gardenCx + 90, y: 1220 },
          // Flanking Tools sanctuary
          { x: gardenCx - 90, y: 1780 },
          { x: gardenCx + 90, y: 1780 }
        ];
        hedges.forEach((h) => {
          this.add.image(h.x, h.y, "garden-hedge").setDepth(h.y + 14);
          const hBody = this.add.rectangle(h.x, h.y + 6, 40, 16, 0, 0);
          this.statics.add(hBody);
          hBody.setDepth(-200);
        });
        const lamps = [
          { x: 2160, y: 1390 },
          { x: 2160, y: 1610 },
          { x: gardenCx + 110, y: 1390 },
          { x: gardenCx + 110, y: 1610 },
          { x: gardenCx - 90, y: 1270 },
          { x: gardenCx + 90, y: 1270 },
          { x: gardenCx - 90, y: 1730 },
          { x: gardenCx + 90, y: 1730 }
        ];
        lamps.forEach((lamp) => {
          this.add.image(lamp.x, lamp.y, "garden-lamp").setDepth(lamp.y + 34);
          this.add.image(lamp.x, lamp.y + 30, "shadow").setScale(0.5, 0.4).setDepth(lamp.y + 28);
          const lBody = this.add.rectangle(lamp.x, lamp.y + 28, 16, 12, 0, 0);
          this.statics.add(lBody);
          lBody.setDepth(-200);
          const lampHalo = this.add.circle(lamp.x, lamp.y - 14, 38, 16770447, 0.18).setBlendMode(Phaser4__namespace.BlendModes.ADD).setDepth(2975);
          this.lampHalos.push(lampHalo);
        });
        const shrineKeys = ["shrine-frontend", "shrine-backend", "shrine-tools"];
        SKILL_PATCHES.forEach((s, i) => {
          const group = exports.portfolio.skills[i];
          const shrineKey = shrineKeys[i];
          this.add.image(s.x, s.y + 44, "shadow").setScale(2.2, 1.3).setDepth(s.y + 38);
          this.add.image(s.x, s.y, shrineKey).setDepth(s.y + 44);
          const body = this.add.rectangle(s.x, s.y + 28, 108, 30, 0, 0);
          this.statics.add(body);
          body.setDepth(-200);
          const badge = this.add.container(s.x, s.y - 62).setDepth(2990);
          const plaqueW = 152;
          const badgeBg = this.add.graphics().fillStyle(1314824, 0.94).fillRoundedRect(-plaqueW / 2, -18, plaqueW, 36, 8).lineStyle(2, 9424491, 0.95).strokeRoundedRect(-plaqueW / 2, -18, plaqueW, 36, 8);
          const icon = this.add.text(-plaqueW / 2 + 18, 0, group.emoji, { fontSize: "18px" }).setOrigin(0.5);
          const title = this.add.text(-plaqueW / 2 + 34, 0, `${group.name} Skills`, {
            fontFamily: pixelFont(),
            fontSize: "11px",
            color: "#d8f3dc"
          }).setOrigin(0, 0.5).setResolution(2);
          badge.add([badgeBg, icon, title]);
          this.tweens.add({
            targets: badge,
            y: s.y - 70,
            duration: 1500 + i * 200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
          });
        });
        const mbX = POINTS.mailbox.x;
        const mbY = POINTS.mailbox.y;
        this.add.image(mbX, mbY + 30, "shadow").setScale(1.4, 0.9).setDepth(mbY + 24);
        const postHalo = this.add.image(mbX, mbY + 32, "post-halo").setDepth(mbY + 25).setAlpha(0.65);
        this.tweens.add({
          targets: postHalo,
          alpha: { from: 0.4, to: 0.85 },
          scaleX: { from: 0.95, to: 1.08 },
          duration: 1800,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });
        this.add.image(mbX, mbY, "post-station").setDepth(mbY + 34);
        const mBody = this.add.rectangle(mbX, mbY + 20, 64, 24, 0, 0);
        this.statics.add(mBody);
        mBody.setDepth(-200);
        const postGlow = this.add.circle(mbX - 26, mbY - 14, 22, 16765286, 0.22).setBlendMode(Phaser4__namespace.BlendModes.ADD).setDepth(mbY + 36);
        this.tweens.add({
          targets: postGlow,
          alpha: { from: 0.14, to: 0.32 },
          duration: 1200,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });
        const mBadge = this.add.container(mbX, mbY - 54).setDepth(2990);
        const mPlaqueW = 144;
        const mBadgeBg = this.add.graphics().fillStyle(1314824, 0.94).fillRoundedRect(-mPlaqueW / 2, -18, mPlaqueW, 36, 8).lineStyle(2, 15680580, 0.95).strokeRoundedRect(-mPlaqueW / 2, -18, mPlaqueW, 36, 8);
        const mIcon = this.add.text(-mPlaqueW / 2 + 18, 0, "\u{1F4EE}", { fontSize: "18px" }).setOrigin(0.5);
        const mTitle = this.add.text(-mPlaqueW / 2 + 34, 0, "Post Station", {
          fontFamily: pixelFont(),
          fontSize: "11px",
          color: "#fecaca"
        }).setOrigin(0, 0.5).setResolution(2);
        mBadge.add([mBadgeBg, mIcon, mTitle]);
        this.tweens.add({
          targets: mBadge,
          y: mbY - 62,
          duration: 1600,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });
        const pkX = POINTS.npcPixel.x;
        const pkY = POINTS.npcPixel.y;
        this.add.image(pkX, pkY + 22, "shadow").setScale(1.4, 0.8).setDepth(pkY + 18);
        this.add.image(pkX, pkY, "recruiter-kiosk").setDepth(pkY + 30);
        const pkBody = this.add.rectangle(pkX, pkY + 14, 62, 20, 0, 0);
        this.statics.add(pkBody);
        pkBody.setDepth(-200);
        const lampGlow = this.add.circle(pkX - 22, pkY - 12, 22, 3462041, 0.2).setBlendMode(Phaser4__namespace.BlendModes.ADD).setDepth(pkY + 32);
        this.tweens.add({
          targets: lampGlow,
          alpha: { from: 0.12, to: 0.28 },
          duration: 1400,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });
        const courierLamps = [
          { x: 1400, y: 2210 },
          { x: 1600, y: 2210 }
        ];
        courierLamps.forEach((lamp) => {
          this.add.image(lamp.x, lamp.y, "courier-lamp").setDepth(lamp.y + 34);
          this.add.image(lamp.x, lamp.y + 30, "shadow").setScale(0.5, 0.4).setDepth(lamp.y + 28);
          const lBody = this.add.rectangle(lamp.x, lamp.y + 28, 16, 12, 0, 0);
          this.statics.add(lBody);
          lBody.setDepth(-200);
          const lampHalo = this.add.circle(lamp.x, lamp.y - 14, 38, 16765286, 0.2).setBlendMode(Phaser4__namespace.BlendModes.ADD).setDepth(2975);
          this.lampHalos.push(lampHalo);
        });
        const benchX = 1350;
        const benchY = 2350;
        this.add.image(benchX, benchY, "courier-bench").setDepth(benchY + 20);
        this.add.image(benchX, benchY + 16, "shadow").setScale(1, 0.7).setDepth(benchY + 14);
        const cbnBody = this.add.rectangle(benchX, benchY + 10, 52, 18, 0, 0);
        this.statics.add(cbnBody);
        cbnBody.setDepth(-200);
        this.add.image(POINTS.welcomeSign.x, POINTS.welcomeSign.y, "welcome-sign").setScale(1.6).setDepth(POINTS.welcomeSign.y + 46);
        this.add.image(POINTS.welcomeSign.x, POINTS.welcomeSign.y + 40, "shadow").setDepth(POINTS.welcomeSign.y + 42).setScale(1.2, 0.8);
        const wBody = this.add.rectangle(POINTS.welcomeSign.x, POINTS.welcomeSign.y + 36, 76, 18, 0, 0);
        this.statics.add(wBody);
        wBody.setDepth(-200);
        const chest = this.add.image(POINTS.chest.x, POINTS.chest.y, "chest").setScale(1.3).setDepth(POINTS.chest.y + 27);
        const cBody = this.add.rectangle(POINTS.chest.x, POINTS.chest.y + 18, 52, 22, 0, 0);
        this.statics.add(cBody);
        cBody.setDepth(-200);
        this.tweens.add({
          targets: chest,
          angle: { from: -2, to: 2 },
          duration: 1700,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });
        LABELS.forEach((l, i) => {
          const t = this.add.text(l.x, l.y, l.text, {
            fontFamily: pixelFont(),
            fontSize: "18px",
            color: "#f5c96b",
            stroke: "#1a1408",
            strokeThickness: 6
          }).setOrigin(0.5).setResolution(2).setDepth(2995);
          this.tweens.add({
            targets: t,
            y: l.y - 7,
            duration: 1600 + i * 240,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
          });
        });
      }
      buildNpcs() {
        this.npcs.push(new NPC(this, exports.portfolio.npcs[0], POINTS.npcOldOcto.x, POINTS.npcOldOcto.y, 70));
        this.npcs.push(new NPC(this, exports.portfolio.npcs[1], POINTS.npcPixel.x, POINTS.npcPixel.y - 14, 24));
      }
      buildInteractables() {
        const push = (i) => this.interactables.push(i);
        push({
          id: "welcome",
          x: POINTS.welcomeSign.x,
          y: POINTS.welcomeSign.y + 20,
          r: 130,
          label: "Read the welcome sign",
          payload: { kind: "welcome", id: "welcome", title: "Welcome, Traveler!" }
        });
        push({
          id: "about",
          x: POINTS.fountain.x,
          y: POINTS.fountain.y + 40,
          r: 175,
          label: `About ${exports.portfolio.name.split(" ")[0]}`,
          district: "about",
          payload: { kind: "about", id: "about", title: "About Me" }
        });
        PROJECT_BOARDS.forEach((b, i) => {
          const project = exports.portfolio.projects[i];
          push({
            id: `proj:${project.id}`,
            x: b.x,
            y: b.y + 50,
            r: 130,
            label: `Inspect: ${project.title}`,
            district: "projects",
            payload: { kind: "project", id: `proj:${project.id}`, title: project.title, projectId: project.id }
          });
        });
        SKILL_PATCHES.forEach((s, i) => {
          const skill = exports.portfolio.skills[i];
          push({
            id: `skill:${skill.id}`,
            x: s.x,
            y: s.y + 40,
            r: 140,
            label: `${skill.name} Skills`,
            district: "skills",
            payload: { kind: "skills", id: `skill:${skill.id}`, title: `${skill.name} Skills`, skillId: skill.id }
          });
        });
        push({
          id: "contact",
          x: POINTS.mailbox.x,
          y: POINTS.mailbox.y,
          r: 150,
          label: "Open the Post Station",
          district: "contact",
          payload: { kind: "contact", id: "contact", title: "Contact" }
        });
        exports.portfolio.npcs.forEach((npc) => {
          const p = npc.id === "old-octo" ? POINTS.npcOldOcto : POINTS.npcPixel;
          push({
            id: `npc:${npc.id}`,
            x: p.x,
            y: p.y,
            r: 170,
            label: `Talk to ${npc.name}`,
            payload: { kind: "dialogue", id: `npc:${npc.id}`, title: npc.name, npcId: npc.id }
          });
        });
        push({
          id: "secret",
          x: POINTS.chest.x,
          y: POINTS.chest.y,
          r: 130,
          label: "Open the treasure chest",
          payload: { kind: "secret", id: "secret", title: "???" }
        });
      }
      buildAtmosphere() {
        const fountainX = POINTS.fountain.x;
        const fountainY = POINTS.fountain.y;
        const fountainDepth = fountainY + 98;
        this.add.particles(fountainX, fountainY - 108, "droplet", {
          speed: { min: 70, max: 100 },
          angle: { min: 256, max: 284 },
          gravityY: 260,
          lifespan: { min: 520, max: 680 },
          scale: { start: 0.38, end: 0 },
          frequency: 55,
          blendMode: "ADD"
        }).setDepth(fountainDepth + 1);
        this.add.particles(fountainX, fountainY - 14, "droplet", {
          speed: { min: 28, max: 50 },
          angle: { min: 87, max: 93 },
          gravityY: 280,
          lifespan: { min: 420, max: 540 },
          scale: { start: 0.5, end: 0.12 },
          alpha: { start: 0.8, end: 0.3 },
          frequency: 60,
          tint: 11197695,
          emitZone: {
            type: "random",
            source: zoneSource(new Phaser4__namespace.Geom.Line(-58, 0, 58, 0))
          }
        }).setDepth(fountainDepth + 2);
        this.add.particles(fountainX, fountainY + 30, "droplet", {
          speed: { min: 2, max: 8 },
          lifespan: { min: 1200, max: 2e3 },
          scale: { start: 0.22, end: 0 },
          alpha: { start: 0.45, end: 0 },
          frequency: 130,
          blendMode: "ADD",
          tint: 14217983,
          emitZone: {
            type: "random",
            source: zoneSource(new Phaser4__namespace.Geom.Rectangle(-72, -18, 144, 40))
          }
        }).setDepth(fountainDepth + 2);
        for (let i = 0; i < 3; i++) {
          const ring = this.add.image(fountainX, fountainY + 32, "ripple").setDepth(fountainDepth + 1).setAlpha(0);
          this.tweens.add({
            targets: ring,
            scale: { from: 0.25, to: 1.15 },
            alpha: { from: 0.4, to: 0 },
            duration: 2400,
            repeat: -1,
            delay: i * 800,
            ease: "Sine.easeOut"
          });
        }
        this.add.particles(2404, 1220, "petal", {
          speed: { min: 10, max: 28 },
          angle: { min: 40, max: 130 },
          lifespan: { min: 2400, max: 4e3 },
          scale: { start: 1, end: 0.2 },
          alpha: { start: 0.85, end: 0 },
          frequency: 420,
          emitZone: {
            type: "random",
            source: zoneSource(new Phaser4__namespace.Geom.Rectangle(-60, -30, 120, 60))
          }
        }).setDepth(2980);
        this.add.particles(2640, 1500, "sparkle", {
          speed: { min: 6, max: 22 },
          lifespan: { min: 1600, max: 3e3 },
          scale: { start: 0.85, end: 0 },
          tint: 62932,
          alpha: { start: 0.85, end: 0 },
          blendMode: "ADD",
          frequency: 400,
          emitZone: {
            type: "random",
            source: zoneSource(new Phaser4__namespace.Geom.Rectangle(-45, -30, 90, 60))
          }
        }).setDepth(2980);
        const craftFireflies = this.add.particles(2404, 1780, "firefly", {
          speed: { min: 8, max: 24 },
          lifespan: { min: 2e3, max: 3600 },
          scale: { start: 0.9, end: 0.15 },
          tint: 16765286,
          alpha: { start: 0.85, end: 0 },
          blendMode: "ADD",
          frequency: 400,
          emitZone: {
            type: "random",
            source: zoneSource(new Phaser4__namespace.Geom.Rectangle(-50, -30, 100, 60))
          }
        }).setDepth(2980);
        this.fireflyEmitters.push(craftFireflies);
        for (const [fx, fy] of [
          [PLAZA.cx - 420, PLAZA.cy - 420],
          [PLAZA.cx + 420, PLAZA.cy + 430],
          [2450, 1980]
        ]) {
          const e = this.add.particles(fx, fy, "firefly", {
            speed: { min: 8, max: 32 },
            lifespan: { min: 2600, max: 4600 },
            scale: { start: 1.1, end: 0.1 },
            alpha: { start: 0.85, end: 0 },
            quantity: 1,
            frequency: 420,
            blendMode: "ADD"
          }).setDepth(2980);
          this.fireflyEmitters.push(e);
        }
        this.add.particles(POINTS.chest.x, POINTS.chest.y - 20, "sparkle", {
          speed: { min: 4, max: 14 },
          lifespan: 900,
          scale: { start: 0.8, end: 0 },
          quantity: 1,
          frequency: 780,
          tint: 16107883,
          blendMode: "ADD"
        }).setDepth(2980);
        this.add.particles(1500, 2330, "letter-particle", {
          speedX: { min: 8, max: 24 },
          speedY: { min: -4, max: 12 },
          rotate: { min: -18, max: 18 },
          lifespan: { min: 2600, max: 4200 },
          scale: { start: 0.9, end: 1.1 },
          alpha: { start: 0.85, end: 0 },
          frequency: 800,
          emitZone: {
            type: "random",
            source: zoneSource(new Phaser4__namespace.Geom.Rectangle(-160, -80, 320, 160))
          }
        }).setDepth(2980);
        this.leafEmitter = this.add.particles(SPAWN.x, SPAWN.y, "autumn-leaf", {
          speedX: { min: 24, max: 54 },
          speedY: { min: 14, max: 36 },
          rotate: { min: 0, max: 360 },
          lifespan: { min: 3600, max: 6200 },
          scale: { min: 0.75, max: 1.15 },
          alpha: { start: 0.8, end: 0 },
          frequency: 550,
          emitZone: {
            type: "random",
            source: zoneSource(new Phaser4__namespace.Geom.Rectangle(-460, -360, 920, 720))
          }
        }).setDepth(2985);
      }
      buildAmbientLighting() {
        const w = this.scale.width;
        const h = this.scale.height;
        this.ambientOverlay = this.add.rectangle(w / 2, h / 2, w, h, 0, 0).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(2970);
        this.updateAmbientOverlaySize(w, h);
        const initialMode = getLocalTimeMode();
        this.setTimeMode(initialMode, true);
      }
      updateAmbientOverlaySize(width, height) {
        if (!this.ambientOverlay) return;
        const w = width != null ? width : this.scale.width;
        const h = height != null ? height : this.scale.height;
        const zoom = this.cameras.main.zoom || 1;
        this.ambientOverlay.setPosition(w / 2, h / 2);
        this.ambientOverlay.setSize(w / zoom + 40, h / zoom + 40);
      }
      getTimeMode() {
        return this.currentTimeMode;
      }
      setTimeMode(mode, instant = false) {
        this.currentTimeMode = mode;
        const targetColor = mode === "night" ? 659752 : mode === "sunset" ? 14244395 : 0;
        const targetAlpha = mode === "night" ? 0.46 : mode === "sunset" ? 0.24 : 0;
        const targetLampAlpha = mode === "night" ? 0.48 : mode === "sunset" ? 0.22 : 0;
        const targetFountainAlpha = mode === "night" ? 0.38 : mode === "sunset" ? 0.2 : 0.08;
        const targetFireflyAlpha = mode === "night" ? 1 : mode === "sunset" ? 0.45 : 0;
        const fireflyFreq = mode === "night" ? 380 : 800;
        if (instant) {
          if (this.ambientTween) {
            this.ambientTween.stop();
            this.ambientTween = void 0;
          }
          this.ambientOverlay.setFillStyle(targetColor, targetAlpha);
          this.lampHalos.forEach((halo) => {
            this.tweens.killTweensOf(halo);
            halo.setAlpha(targetLampAlpha);
          });
          if (this.fountainGlow) {
            this.tweens.killTweensOf(this.fountainGlow);
            this.fountainGlow.setAlpha(targetFountainAlpha);
          }
          this.fireflyEmitters.forEach((emitter) => {
            this.tweens.killTweensOf(emitter);
            emitter.setAlpha(targetFireflyAlpha);
            if (mode === "day") {
              emitter.stop();
            } else {
              emitter.start();
              emitter.setFrequency(fireflyFreq);
            }
          });
        } else {
          if (this.ambientTween) {
            this.ambientTween.stop();
            this.ambientTween = void 0;
          }
          const startColor = this.ambientOverlay.fillColor;
          const startAlpha = this.ambientOverlay.fillAlpha;
          const startR = startColor >> 16 & 255;
          const startG = startColor >> 8 & 255;
          const startB = startColor & 255;
          const endR = targetColor >> 16 & 255;
          const endG = targetColor >> 8 & 255;
          const endB = targetColor & 255;
          const proxy = { progress: 0 };
          this.ambientTween = this.tweens.add({
            targets: proxy,
            progress: 1,
            duration: 900,
            ease: "Sine.easeInOut",
            onUpdate: () => {
              const t = proxy.progress;
              const r = Math.round(startR + (endR - startR) * t);
              const g = Math.round(startG + (endG - startG) * t);
              const b = Math.round(startB + (endB - startB) * t);
              const a = startAlpha + (targetAlpha - startAlpha) * t;
              const col = r << 16 | g << 8 | b;
              this.ambientOverlay.setFillStyle(col, a);
            },
            onComplete: () => {
              this.ambientOverlay.setFillStyle(targetColor, targetAlpha);
              this.ambientTween = void 0;
            }
          });
          this.lampHalos.forEach((halo) => {
            this.tweens.killTweensOf(halo);
            this.tweens.add({
              targets: halo,
              alpha: targetLampAlpha,
              duration: 900,
              ease: "Sine.easeInOut"
            });
          });
          if (this.fountainGlow) {
            this.tweens.killTweensOf(this.fountainGlow);
            this.tweens.add({
              targets: this.fountainGlow,
              alpha: targetFountainAlpha,
              duration: 900,
              ease: "Sine.easeInOut"
            });
          }
          this.fireflyEmitters.forEach((emitter) => {
            this.tweens.killTweensOf(emitter);
            if (mode === "day") {
              this.tweens.add({
                targets: emitter,
                alpha: 0,
                duration: 900,
                ease: "Sine.easeInOut",
                onComplete: () => emitter.stop()
              });
            } else {
              emitter.start();
              emitter.setFrequency(fireflyFreq);
              this.tweens.add({
                targets: emitter,
                alpha: targetFireflyAlpha,
                duration: 900,
                ease: "Sine.easeInOut"
              });
            }
          });
        }
      }
      // ------------------------------------------------------------------
      // Per-frame logic
      // ------------------------------------------------------------------
      update(_time, delta) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const dt = Math.min(delta, 100) / 1e3;
        this.npcs.forEach((n) => n.update());
        ghosts.update(dt);
        if (this.leafEmitter && ((_a = this.player) == null ? void 0 : _a.sprite)) {
          this.leafEmitter.setPosition(this.player.sprite.x, this.player.sprite.y);
        }
        const ePressed = Phaser4__namespace.Input.Keyboard.JustDown(this.interactKey);
        if (exports.gameRuntime.modalOpen) {
          this.player.stop();
          exports.gameRuntime.interactQueued = false;
          return;
        }
        let vx = 0;
        let vy = 0;
        if (((_b = this.keys.A) == null ? void 0 : _b.isDown) || ((_c = this.keys.LEFT) == null ? void 0 : _c.isDown)) vx -= 1;
        if (((_d = this.keys.D) == null ? void 0 : _d.isDown) || ((_e = this.keys.RIGHT) == null ? void 0 : _e.isDown)) vx += 1;
        if (((_f = this.keys.W) == null ? void 0 : _f.isDown) || ((_g = this.keys.UP) == null ? void 0 : _g.isDown)) vy -= 1;
        if (((_h = this.keys.S) == null ? void 0 : _h.isDown) || ((_i = this.keys.DOWN) == null ? void 0 : _i.isDown)) vy += 1;
        vx += exports.sharedInput.x;
        vy += exports.sharedInput.y;
        vx = Math.max(-1, Math.min(1, vx));
        vy = Math.max(-1, Math.min(1, vy));
        const moved = this.player.update(vx, vy);
        if (moved && !this.moveUnlocked) {
          this.moveUnlocked = true;
          unlock("first-steps");
        }
        if (vx < -0.05) this.lastFacing = "left";
        else if (vx > 0.05) this.lastFacing = "right";
        ghosts.report(
          Math.round(this.player.sprite.x),
          Math.round(this.player.sprite.y),
          moved,
          this.lastFacing
        );
        this.tickAcc += delta;
        if (this.tickAcc >= 250) {
          this.tickAcc = 0;
          emitGameEvent("pg:tick", {
            x: this.player.sprite.x,
            y: this.player.sprite.y,
            ghosts: ghosts.positions()
          });
        }
        const total = ghosts.onlineCount() + 1;
        if (total !== this.lastPresence) {
          this.lastPresence = total;
          emitGameEvent("pg:presence", { count: total });
        }
        const near = this.findNearest();
        const nearId = (_j = near == null ? void 0 : near.id) != null ? _j : null;
        if (nearId !== this.activeId) {
          this.activeId = nearId;
          emitGameEvent("pg:prompt", { label: near ? near.label : null });
        }
        if (ePressed || exports.gameRuntime.interactQueued) {
          exports.gameRuntime.interactQueued = false;
          this.tryInteract();
        }
      }
      findNearest() {
        let best = null;
        let bestDist = Infinity;
        const px = this.player.sprite.x;
        const py = this.player.sprite.y;
        for (const it of this.interactables) {
          const d = Math.hypot(it.x - px, it.y - py);
          if (d < it.r && d < bestDist) {
            best = it;
            bestDist = d;
          }
        }
        return best;
      }
      tryInteract() {
        var _a;
        if (exports.gameRuntime.modalOpen) return;
        const it = this.findNearest();
        if (!it) return;
        exports.gameRuntime.modalOpen = true;
        emitGameEvent("pg:zone-open", it.payload);
        exports.audio.open();
        if (it.district) {
          this.visitedDistricts.add(it.district);
          if (this.visitedDistricts.size >= 4) unlock("explorer");
        }
        switch (it.payload.kind) {
          case "project":
            this.readProjects.add(it.payload.projectId);
            if (this.readProjects.size >= exports.portfolio.projects.length) unlock("bookworm");
            break;
          case "dialogue":
            this.talkedNpcs.add(it.payload.npcId);
            (_a = this.npcs.find((n) => n.def.id === it.payload.npcId)) == null ? void 0 : _a.celebrate();
            if (this.talkedNpcs.size >= exports.portfolio.npcs.length) unlock("social");
            break;
          case "secret":
            unlock("curious");
            exports.audio.secret();
            this.confetti(POINTS.chest.x, POINTS.chest.y - 30);
            break;
        }
      }
      trackKonami(keyCode) {
        if (keyCode === KONAMI[this.konamiIndex]) {
          this.konamiIndex++;
          if (this.konamiIndex === KONAMI.length) {
            this.konamiIndex = 0;
            this.konamiReward();
          }
        } else {
          this.konamiIndex = keyCode === KONAMI[0] ? 1 : 0;
        }
      }
      konamiReward() {
        unlock("konami");
        exports.audio.konami();
        const px = this.player.sprite.x;
        const py = this.player.sprite.y - 40;
        this.confetti(px, py);
        const tints = [16734564, 16754780, 16769366, 7067243, 6072831, 11758591];
        let i = 0;
        this.time.addEvent({
          delay: 120,
          repeat: 19,
          callback: () => {
            this.player.sprite.setTint(tints[i++ % tints.length]);
            if (i === 20) this.player.sprite.clearTint();
          }
        });
      }
      confetti(x, y) {
        this.add.particles(x, y, "sparkle", {
          speed: { min: 60, max: 260 },
          angle: { min: 240, max: 300 },
          gravityY: 260,
          lifespan: 1500,
          scale: { start: 1.4, end: 0 },
          quantity: 14,
          frequency: 30,
          tint: [16734564, 16769366, 7067243, 6072831, 11758591, 16107883],
          blendMode: "ADD",
          emitting: false
        }).setDepth(3100).explode(60);
      }
      ensureCoinTexture() {
        if (this.textures.exists("fountain-coin")) return;
        const cg = this.make.graphics({ x: 0, y: 0 }, false);
        cg.fillStyle(14251782, 1);
        cg.fillCircle(7, 7, 6);
        cg.fillStyle(16107883, 1);
        cg.fillCircle(7, 7, 5);
        cg.fillStyle(16707722, 1);
        cg.fillCircle(5, 5, 2);
        cg.lineStyle(1, 9584654, 0.9);
        cg.strokeCircle(7, 7, 5);
        cg.generateTexture("fountain-coin", 14, 14);
        cg.destroy();
      }
      handleFountainToss() {
        var _a, _b;
        this.ensureCoinTexture();
        const targetX = 1500;
        const targetY = 1532;
        let startX = ((_a = this.player) == null ? void 0 : _a.sprite) ? this.player.sprite.x : targetX;
        let startY = ((_b = this.player) == null ? void 0 : _b.sprite) ? this.player.sprite.y - 12 : targetY + 120;
        const dist = Math.hypot(startX - targetX, startY - targetY);
        if (dist > 280) {
          const angle = Math.atan2(startY - targetY, startX - targetX);
          startX = targetX + Math.cos(angle) * 180;
          startY = targetY + Math.sin(angle) * 180;
        }
        const coin = this.add.image(startX, startY, "fountain-coin").setDepth(2980);
        const duration = 650;
        const apexHeight = 70;
        const tossObj = { t: 0 };
        this.tweens.add({
          targets: tossObj,
          t: 1,
          duration,
          ease: "Linear",
          onUpdate: () => {
            const t = tossObj.t;
            const curX = startX + (targetX - startX) * t;
            const baseLineY = startY + (targetY - startY) * t;
            const arcOffset = 4 * apexHeight * t * (1 - t);
            coin.setPosition(curX, baseLineY - arcOffset);
            coin.setAngle(t * 720);
            coin.setScale(1 + Math.sin(t * Math.PI) * 0.35, 1);
          },
          onComplete: () => {
            coin.destroy();
            this.splashFountainPool(targetX, targetY);
          }
        });
      }
      splashFountainPool(x, y) {
        const fountainDepth = POINTS.fountain.y + 98;
        const ripple = this.add.image(x, y, "ripple").setDepth(fountainDepth + 3).setScale(0.2).setAlpha(0.9);
        this.tweens.add({
          targets: ripple,
          scale: 1.8,
          alpha: 0,
          duration: 1e3,
          ease: "Sine.easeOut",
          onComplete: () => ripple.destroy()
        });
        const ripple2 = this.add.image(x, y, "ripple").setDepth(fountainDepth + 3).setScale(0.15).setAlpha(0.75);
        this.tweens.add({
          targets: ripple2,
          scale: 1.5,
          alpha: 0,
          delay: 140,
          duration: 900,
          ease: "Sine.easeOut",
          onComplete: () => ripple2.destroy()
        });
        const dropSplash = this.add.particles(x, y, "droplet", {
          speed: { min: 45, max: 135 },
          angle: { min: 220, max: 320 },
          gravityY: 300,
          lifespan: { min: 450, max: 700 },
          scale: { start: 0.7, end: 0.1 },
          alpha: { start: 1, end: 0 },
          tint: 11197695,
          blendMode: "ADD",
          emitting: false
        });
        dropSplash.setDepth(2980);
        dropSplash.explode(20);
        const sparkleSplash = this.add.particles(x, y, "sparkle", {
          speed: { min: 30, max: 110 },
          angle: { min: 210, max: 330 },
          gravityY: 180,
          lifespan: { min: 550, max: 900 },
          scale: { start: 0.95, end: 0 },
          alpha: { start: 1, end: 0 },
          tint: 16107883,
          blendMode: "ADD",
          emitting: false
        });
        sparkleSplash.setDepth(2981);
        sparkleSplash.explode(14);
        this.time.delayedCall(1200, () => {
          dropSplash.destroy();
          sparkleSplash.destroy();
        });
      }
    };
  }
});

// src/game/main.ts
var main_exports = {};
__export(main_exports, {
  createGame: () => createGame
});
function createGame(parent) {
  const game = new Phaser4__namespace.Game({
    type: Phaser4__namespace.AUTO,
    parent,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: "#1d3520",
    scale: {
      mode: Phaser4__namespace.Scale.RESIZE,
      width: parent.clientWidth || window.innerWidth,
      height: parent.clientHeight || window.innerHeight
    },
    physics: {
      default: "arcade",
      arcade: { debug: false }
    },
    scene: [BootScene, WorldScene]
  });
  if (process.env.NODE_ENV !== "production") {
    window.__pg = game;
  }
  return game;
}
var init_main = __esm({
  "src/game/main.ts"() {
    init_BootScene();
    init_WorldScene();
  }
});

// src/components/game/Joystick.tsx
init_shared();
function Joystick() {
  const baseRef = React.useRef(null);
  const knobRef = React.useRef(null);
  const activeId = React.useRef(null);
  React.useEffect(() => {
    const base = baseRef.current;
    const knob = knobRef.current;
    if (!base || !knob) return;
    const MAX = 42;
    const setKnob = (dx, dy) => {
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const handleDown = (e) => {
      if (activeId.current !== null) return;
      activeId.current = e.pointerId;
      base.setPointerCapture(e.pointerId);
      handleMove(e);
    };
    const handleMove = (e) => {
      if (activeId.current !== e.pointerId) return;
      const rect = base.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > MAX) {
        dx = dx / dist * MAX;
        dy = dy / dist * MAX;
      }
      setKnob(dx, dy);
      exports.sharedInput.x = dx / MAX;
      exports.sharedInput.y = dy / MAX;
    };
    const handleUp = (e) => {
      if (activeId.current !== e.pointerId) return;
      activeId.current = null;
      exports.sharedInput.x = 0;
      exports.sharedInput.y = 0;
      setKnob(0, 0);
    };
    base.addEventListener("pointerdown", handleDown);
    base.addEventListener("pointermove", handleMove);
    base.addEventListener("pointerup", handleUp);
    base.addEventListener("pointercancel", handleUp);
    return () => {
      base.removeEventListener("pointerdown", handleDown);
      base.removeEventListener("pointermove", handleMove);
      base.removeEventListener("pointerup", handleUp);
      base.removeEventListener("pointercancel", handleUp);
      exports.sharedInput.x = 0;
      exports.sharedInput.y = 0;
    };
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref: baseRef,
      className: "pointer-events-auto absolute bottom-6 left-5 z-20 flex h-32 w-32 touch-none select-none items-center justify-center rounded-full border-4 border-[#e8c170]/70 bg-black/30 backdrop-blur-[2px]",
      role: "application",
      "aria-label": "Movement joystick",
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          ref: knobRef,
          className: "h-14 w-14 rounded-full border-4 border-[#e8c170] bg-[#e8c170]/40 shadow-[0_0_12px_rgba(232,193,112,0.5)] transition-transform duration-75",
          "aria-hidden": true
        }
      )
    }
  );
}

// src/components/game/Minimap.tsx
init_events();
init_world();
var SIZE = 150;
var K = SIZE / WORLD.width;
function drawStatic(ctx) {
  ctx.fillStyle = "#0d1a0e";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "#6b5537";
  for (const p of PATHS) {
    ctx.fillRect(p.x * K, p.y * K, Math.max(1, p.w * K), Math.max(1, p.h * K));
  }
  ctx.fillStyle = "#7d786e";
  ctx.fillRect(
    (PLAZA.cx - PLAZA.half) * K,
    (PLAZA.cy - PLAZA.half) * K,
    PLAZA.half * 2 * K,
    PLAZA.half * 2 * K
  );
  ctx.fillRect(
    (COURIER_PLAZA.cx - COURIER_PLAZA.w / 2) * K,
    (COURIER_PLAZA.cy - COURIER_PLAZA.h / 2) * K,
    COURIER_PLAZA.w * K,
    COURIER_PLAZA.h * K
  );
  const dot = (x, y, r, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x * K, y * K, r, 0, Math.PI * 2);
    ctx.fill();
  };
  dot(POINTS.fountain.x, POINTS.fountain.y, 3, "#e8c170");
  for (const b of PROJECT_BOARDS) dot(b.x, b.y, 1.8, "#7fb0ff");
  for (const s of SKILL_PATCHES) dot(s.x, s.y, 1.8, "#8fce6b");
  dot(POINTS.mailbox.x, POINTS.mailbox.y, 2, "#ff8a5c");
  dot(POINTS.chest.x, POINTS.chest.y, 1.8, "#b28dff");
  dot(POINTS.npcOldOcto.x, POINTS.npcOldOcto.y, 1.5, "#c9c9d9");
  dot(POINTS.npcPixel.x, POINTS.npcPixel.y, 1.5, "#d98f8f");
}
function Minimap() {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    drawStatic(ctx);
    let frame = null;
    const off = onGameEvent("pg:tick", (d) => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        drawStatic(ctx);
        ctx.fillStyle = "#9fe0ff";
        for (const g of d.ghosts) {
          ctx.beginPath();
          ctx.arc(g.x * K, g.y * K, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        const px = d.x * K;
        const py = d.y * K;
        const pulse = 3.2 + Math.sin(performance.now() / 240) * 1.1;
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, pulse + 1.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, 2.6, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    return () => {
      off();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "canvas",
    {
      ref: canvasRef,
      width: SIZE,
      height: SIZE,
      "aria-label": "World minimap",
      className: "pointer-events-none absolute right-3 top-16 z-10 w-[96px] border-2 border-[#e8c170]/50 bg-[#0d1a0e] shadow-[0_0_12px_rgba(0,0,0,0.5)] sm:w-[150px]"
    }
  );
}

// src/components/game/ZoneModal.tsx
init_portfolio();
init_achievements();
init_audio();
init_events();

// src/components/game/ArcadeMiniGame.tsx
init_audio();
var CANVAS_WIDTH = 320;
var CANVAS_HEIGHT = 180;
var SPRINT_DURATION = 10;
var GRAVITY = 520;
var FLAP_VELOCITY = -185;
var MAX_FALL_SPEED = 260;
var SCROLL_SPEED = 86;
var PIPE_SPAWN_INTERVAL = 1.6;
var PIPE_GAP_HEIGHT = 56;
var PIPE_WIDTH = 26;
var OCTO_RADIUS = 7.5;
var OCTO_X = 64;
var HIGH_SCORE_KEY = "pg_flappy_octo_best";
function getStoredBestTime() {
  if (typeof window === "undefined") return 0;
  try {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    if (saved) {
      const val = parseFloat(saved);
      if (Number.isFinite(val)) return val;
    }
  } catch (e) {
  }
  return 0;
}
function createInitialBubbles() {
  const bubbles = [];
  for (let i = 0; i < 18; i++) {
    bubbles.push({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      speed: 12 + Math.random() * 20,
      radius: 1 + Math.random() * 2.2,
      wiggleOffset: Math.random() * Math.PI * 2,
      alpha: 0.2 + Math.random() * 0.45
    });
  }
  return bubbles;
}
function ArcadeMiniGame() {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [gameState, setGameState] = React.useState("ready");
  const [timeLeft, setTimeLeft] = React.useState(SPRINT_DURATION);
  const [bestTime, setBestTime] = React.useState(getStoredBestTime);
  const [clearedCount, setClearedCount] = React.useState(0);
  const simRef = React.useRef({
    state: "ready",
    timeLeft: SPRINT_DURATION,
    octoY: CANVAS_HEIGHT / 2 - 4,
    octoVy: 0,
    octoAngle: 0,
    flapTimer: 0,
    pipes: [],
    particles: [],
    bubbles: createInitialBubbles(),
    lastTime: 0,
    pipeTimer: 0,
    clearedCount: 0,
    runId: 0
  });
  const recordBestTime = React.useCallback((timeSurvived) => {
    try {
      const currentBest = parseFloat(localStorage.getItem(HIGH_SCORE_KEY) || "0") || 0;
      if (timeSurvived > currentBest) {
        const rounded = Math.round(timeSurvived * 10) / 10;
        localStorage.setItem(HIGH_SCORE_KEY, rounded.toString());
        setBestTime(rounded);
      }
    } catch (e) {
    }
  }, []);
  const spawnFlapParticles = React.useCallback((x, y) => {
    const sim = simRef.current;
    for (let i = 0; i < 4; i++) {
      sim.particles.push({
        x: x - 6 + (Math.random() * 4 - 2),
        y: y + 4 + (Math.random() * 4 - 2),
        vx: -25 - Math.random() * 35,
        vy: (Math.random() - 0.5) * 30,
        size: 1.5 + Math.random() * 2,
        alpha: 0.8,
        color: "#a5f3fc",
        life: 0,
        maxLife: 0.35 + Math.random() * 0.2
      });
    }
  }, []);
  const spawnVictoryParticles = React.useCallback(() => {
    const sim = simRef.current;
    const colors = ["#fde047", "#f43f5e", "#38bdf8", "#4ade80", "#c084fc", "#fb923c"];
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 120;
      sim.particles.push({
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        size: 2 + Math.random() * 2.5,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 1.2 + Math.random() * 0.8
      });
    }
  }, []);
  const spawnCrashParticles = React.useCallback((x, y) => {
    const sim = simRef.current;
    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * 85;
      sim.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2.5,
        alpha: 1,
        color: Math.random() > 0.4 ? "#f43f5e" : "#fdba74",
        life: 0,
        maxLife: 0.45 + Math.random() * 0.35
      });
    }
  }, []);
  const triggerFlap = React.useCallback(() => {
    const sim = simRef.current;
    if (sim.state === "ready") {
      sim.state = "playing";
      sim.timeLeft = SPRINT_DURATION;
      sim.octoY = CANVAS_HEIGHT / 2 - 10;
      sim.octoVy = FLAP_VELOCITY;
      sim.pipes = [];
      sim.pipeTimer = 0.6;
      sim.clearedCount = 0;
      setGameState("playing");
      setTimeLeft(SPRINT_DURATION);
      setClearedCount(0);
      spawnFlapParticles(OCTO_X, sim.octoY);
      try {
        exports.audio.open();
      } catch (e) {
      }
      return;
    }
    if (sim.state === "playing") {
      sim.octoVy = FLAP_VELOCITY;
      sim.flapTimer = 0.18;
      spawnFlapParticles(OCTO_X, sim.octoY);
      try {
        exports.audio.open();
      } catch (e) {
      }
      return;
    }
    if (sim.state === "won" || sim.state === "gameover") {
      sim.state = "playing";
      sim.timeLeft = SPRINT_DURATION;
      sim.octoY = CANVAS_HEIGHT / 2 - 10;
      sim.octoVy = FLAP_VELOCITY;
      sim.pipes = [];
      sim.pipeTimer = 0.6;
      sim.clearedCount = 0;
      setGameState("playing");
      setTimeLeft(SPRINT_DURATION);
      setClearedCount(0);
      spawnFlapParticles(OCTO_X, sim.octoY);
      try {
        exports.audio.open();
      } catch (e) {
      }
      return;
    }
  }, [spawnFlapParticles]);
  const resetGame = React.useCallback(() => {
    const sim = simRef.current;
    sim.state = "ready";
    sim.timeLeft = SPRINT_DURATION;
    sim.octoY = CANVAS_HEIGHT / 2 - 4;
    sim.octoVy = 0;
    sim.pipes = [];
    sim.clearedCount = 0;
    setGameState("ready");
    setTimeLeft(SPRINT_DURATION);
    setClearedCount(0);
  }, []);
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        e.stopPropagation();
        triggerFlap();
      }
    };
    window.addEventListener("keydown", handleKeyDown, { capture: true, passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [triggerFlap]);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId;
    const sim = simRef.current;
    sim.lastTime = performance.now();
    const loop = (now) => {
      animId = requestAnimationFrame(loop);
      let dt = (now - sim.lastTime) / 1e3;
      sim.lastTime = now;
      if (dt > 0.08) dt = 0.08;
      if (dt <= 0) dt = 0.016;
      for (const b of sim.bubbles) {
        b.y -= b.speed * dt;
        b.x += Math.sin(now * 3e-3 + b.wiggleOffset) * 0.3;
        if (b.y < -10) {
          b.y = CANVAS_HEIGHT + 10;
          b.x = Math.random() * CANVAS_WIDTH;
        }
      }
      for (let i = sim.particles.length - 1; i >= 0; i--) {
        const p = sim.particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          sim.particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      }
      if (sim.state === "ready") {
        sim.octoY = CANVAS_HEIGHT / 2 + Math.sin(now * 5e-3) * 5;
        sim.octoAngle = Math.sin(now * 4e-3) * 0.1;
      } else if (sim.state === "playing") {
        sim.timeLeft = Math.max(0, sim.timeLeft - dt);
        setTimeLeft(Math.round(sim.timeLeft * 10) / 10);
        if (sim.timeLeft <= 0) {
          sim.state = "won";
          setGameState("won");
          recordBestTime(SPRINT_DURATION);
          spawnVictoryParticles();
          try {
            exports.audio.achieve();
          } catch (e) {
          }
        } else {
          sim.octoVy = Math.min(MAX_FALL_SPEED, sim.octoVy + GRAVITY * dt);
          sim.octoY += sim.octoVy * dt;
          const targetAngle = Math.max(-0.4, Math.min(0.7, sim.octoVy * 35e-4));
          sim.octoAngle += (targetAngle - sim.octoAngle) * 0.2;
          if (sim.flapTimer > 0) {
            sim.flapTimer -= dt;
          }
          sim.pipeTimer -= dt;
          if (sim.pipeTimer <= 0) {
            sim.pipeTimer = PIPE_SPAWN_INTERVAL;
            const minGapY = 32;
            const maxGapY = CANVAS_HEIGHT - 32 - PIPE_GAP_HEIGHT;
            const gapY = minGapY + Math.random() * (maxGapY - minGapY);
            sim.pipes.push({
              x: CANVAS_WIDTH + 10,
              gapY,
              passed: false,
              colorType: Math.random() > 0.45 ? 1 : 0
            });
          }
          const floorY = CANVAS_HEIGHT - 12;
          if (sim.octoY - OCTO_RADIUS <= 2 || sim.octoY + OCTO_RADIUS >= floorY) {
            sim.state = "gameover";
            setGameState("gameover");
            const survived = SPRINT_DURATION - sim.timeLeft;
            recordBestTime(survived);
            spawnCrashParticles(OCTO_X, sim.octoY);
            try {
              exports.audio.close();
            } catch (e) {
            }
          }
          for (let i = sim.pipes.length - 1; i >= 0; i--) {
            const pipe = sim.pipes[i];
            pipe.x -= SCROLL_SPEED * dt;
            if (!pipe.passed && pipe.x + PIPE_WIDTH < OCTO_X) {
              pipe.passed = true;
              sim.clearedCount++;
              setClearedCount(sim.clearedCount);
            }
            const topRect = {
              x: pipe.x,
              y: 0,
              w: PIPE_WIDTH,
              h: pipe.gapY
            };
            const botRect = {
              x: pipe.x,
              y: pipe.gapY + PIPE_GAP_HEIGHT,
              w: PIPE_WIDTH,
              h: CANVAS_HEIGHT - (pipe.gapY + PIPE_GAP_HEIGHT)
            };
            const checkCollision = (rx, ry, rw, rh) => {
              const closestX = Math.max(rx, Math.min(OCTO_X, rx + rw));
              const closestY = Math.max(ry, Math.min(sim.octoY, ry + rh));
              const dx = OCTO_X - closestX;
              const dy = sim.octoY - closestY;
              return dx * dx + dy * dy < OCTO_RADIUS * OCTO_RADIUS;
            };
            if (sim.state === "playing" && (checkCollision(topRect.x, topRect.y, topRect.w, topRect.h) || checkCollision(botRect.x, botRect.y, botRect.w, botRect.h))) {
              sim.state = "gameover";
              setGameState("gameover");
              const survived = SPRINT_DURATION - sim.timeLeft;
              recordBestTime(survived);
              spawnCrashParticles(OCTO_X, sim.octoY);
              try {
                exports.audio.close();
              } catch (e) {
              }
            }
            if (pipe.x < -PIPE_WIDTH - 20) {
              sim.pipes.splice(i, 1);
            }
          }
        }
      } else if (sim.state === "gameover") {
        if (sim.octoY + OCTO_RADIUS < CANVAS_HEIGHT - 12) {
          sim.octoY += 40 * dt;
          sim.octoAngle += 0.5 * dt;
        }
      } else if (sim.state === "won") {
        sim.octoY = CANVAS_HEIGHT / 2 + Math.sin(now * 8e-3) * 8;
        sim.octoAngle = Math.sin(now * 6e-3) * 0.15;
      }
      ctx.imageSmoothingEnabled = false;
      const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGrad.addColorStop(0, "#0b263b");
      bgGrad.addColorStop(0.5, "#081b2b");
      bgGrad.addColorStop(1, "#040d16");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.save();
      ctx.globalAlpha = 0.07;
      ctx.fillStyle = "#38bdf8";
      for (let r = 0; r < 4; r++) {
        const offset = Math.sin(now * 1e-3 + r * 1.5) * 18;
        ctx.beginPath();
        ctx.moveTo(30 + r * 70 + offset, 0);
        ctx.lineTo(60 + r * 70 + offset, 0);
        ctx.lineTo(95 + r * 70 + offset, CANVAS_HEIGHT);
        ctx.lineTo(45 + r * 70 + offset, CANVAS_HEIGHT);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      for (const b of sim.bubbles) {
        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = "#bae6fd";
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(b.x - b.radius * 0.4, b.y - b.radius * 0.4, 1, 1);
        ctx.restore();
      }
      ctx.save();
      ctx.fillStyle = "#06222b";
      ctx.globalAlpha = 0.45;
      for (let s = 0; s < 6; s++) {
        const sx = (s * 60 + now * 0.015 % 360) % 360 - 20;
        const sway = Math.sin(now * 2e-3 + s) * 6;
        ctx.beginPath();
        ctx.moveTo(sx, CANVAS_HEIGHT - 12);
        ctx.quadraticCurveTo(sx + sway, CANVAS_HEIGHT - 45, sx - sway * 0.5, CANVAS_HEIGHT - 70);
        ctx.lineTo(sx + 10 - sway * 0.5, CANVAS_HEIGHT - 70);
        ctx.quadraticCurveTo(sx + 10 + sway, CANVAS_HEIGHT - 45, sx + 10, CANVAS_HEIGHT - 12);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      for (const pipe of sim.pipes) {
        const isCoral = pipe.colorType === 1;
        const mainColor = isCoral ? "#ea580c" : "#059669";
        const lightColor = isCoral ? "#fb923c" : "#10b981";
        const darkColor = isCoral ? "#9a3412" : "#064e3b";
        const rimColor = isCoral ? "#ffedd5" : "#a7f3d0";
        ctx.fillStyle = mainColor;
        ctx.fillRect(pipe.x + 2, 0, PIPE_WIDTH - 4, pipe.gapY - 6);
        ctx.fillStyle = lightColor;
        ctx.fillRect(pipe.x + 4, 0, 3, pipe.gapY - 6);
        ctx.fillStyle = darkColor;
        ctx.fillRect(pipe.x + PIPE_WIDTH - 5, 0, 3, pipe.gapY - 6);
        ctx.fillStyle = mainColor;
        ctx.fillRect(pipe.x, pipe.gapY - 8, PIPE_WIDTH, 8);
        ctx.fillStyle = lightColor;
        ctx.fillRect(pipe.x, pipe.gapY - 8, PIPE_WIDTH, 2);
        ctx.fillStyle = darkColor;
        ctx.fillRect(pipe.x, pipe.gapY - 2, PIPE_WIDTH, 2);
        ctx.fillStyle = rimColor;
        ctx.fillRect(pipe.x + 3, pipe.gapY - 6, 2, 2);
        ctx.fillRect(pipe.x + 11, pipe.gapY - 5, 3, 2);
        ctx.fillRect(pipe.x + 19, pipe.gapY - 6, 2, 2);
        const botY = pipe.gapY + PIPE_GAP_HEIGHT;
        const botH = CANVAS_HEIGHT - botY;
        ctx.fillStyle = mainColor;
        ctx.fillRect(pipe.x + 2, botY + 6, PIPE_WIDTH - 4, botH - 6);
        ctx.fillStyle = lightColor;
        ctx.fillRect(pipe.x + 4, botY + 6, 3, botH - 6);
        ctx.fillStyle = darkColor;
        ctx.fillRect(pipe.x + PIPE_WIDTH - 5, botY + 6, 3, botH - 6);
        ctx.fillStyle = mainColor;
        ctx.fillRect(pipe.x, botY, PIPE_WIDTH, 8);
        ctx.fillStyle = lightColor;
        ctx.fillRect(pipe.x, botY, PIPE_WIDTH, 2);
        ctx.fillStyle = darkColor;
        ctx.fillRect(pipe.x, botY + 6, PIPE_WIDTH, 2);
        ctx.fillStyle = rimColor;
        ctx.fillRect(pipe.x + 4, botY + 2, 2, 2);
        ctx.fillRect(pipe.x + 12, botY + 3, 3, 2);
        ctx.fillRect(pipe.x + 18, botY + 2, 2, 2);
      }
      const floorH = 12;
      ctx.fillStyle = "#78350f";
      ctx.fillRect(0, CANVAS_HEIGHT - floorH, CANVAS_WIDTH, floorH);
      ctx.fillStyle = "#b45309";
      ctx.fillRect(0, CANVAS_HEIGHT - floorH, CANVAS_WIDTH, 3);
      ctx.fillStyle = "#fde68a";
      for (let p = 0; p < CANVAS_WIDTH; p += 14) {
        ctx.fillRect(p + p % 7, CANVAS_HEIGHT - floorH + 4 + p % 5, 2, 1.5);
      }
      for (const p of sim.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.restore();
      }
      ctx.save();
      ctx.translate(OCTO_X, sim.octoY);
      ctx.rotate(sim.octoAngle);
      const octoMain = "#f43f5e";
      const octoLight = "#fb7185";
      const octoDark = "#9f1239";
      const octoBlush = "#fda4af";
      const isFlapping = sim.flapTimer > 0;
      const tentacleKick = isFlapping ? -4 : Math.sin(now * 0.012) * 2;
      ctx.fillStyle = octoDark;
      ctx.fillRect(-7, 5, 2.5, 4 + tentacleKick);
      ctx.fillRect(-3.5, 5, 2.5, 5 - tentacleKick * 0.5);
      ctx.fillRect(0, 5, 2.5, 6 + tentacleKick);
      ctx.fillRect(3.5, 5, 2.5, 5 - tentacleKick * 0.5);
      ctx.fillRect(7, 5, 2.5, 4 + tentacleKick);
      ctx.fillStyle = octoMain;
      ctx.fillRect(-6.5, 5, 2, 3 + tentacleKick);
      ctx.fillRect(-3, 5, 2, 4 - tentacleKick * 0.5);
      ctx.fillRect(0.5, 5, 2, 5 + tentacleKick);
      ctx.fillRect(4, 5, 2, 4 - tentacleKick * 0.5);
      ctx.fillRect(7.5, 5, 2, 3 + tentacleKick);
      ctx.fillStyle = octoDark;
      ctx.fillRect(-8, -6, 16, 12);
      ctx.fillRect(-7, -8, 14, 15);
      ctx.fillRect(-5, -9, 10, 17);
      ctx.fillStyle = octoMain;
      ctx.fillRect(-7, -5, 14, 10);
      ctx.fillRect(-6, -7, 12, 13);
      ctx.fillRect(-4, -8, 8, 14);
      ctx.fillStyle = octoLight;
      ctx.fillRect(-5, -7, 5, 3);
      ctx.fillRect(-4, -8, 3, 1);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, -3, 5, 6);
      ctx.fillRect(5, -2, 2, 4);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(2, -2, 3, 4);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(2, -2, 1.5, 1.5);
      ctx.fillStyle = octoBlush;
      ctx.fillRect(-1, 3, 3, 2);
      ctx.restore();
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      for (let y = 0; y < CANVAS_HEIGHT; y += 3) {
        ctx.fillRect(0, y, CANVAS_WIDTH, 1);
      }
      ctx.restore();
      if (sim.state === "ready") {
        ctx.fillStyle = "rgba(4, 13, 22, 0.72)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.textAlign = "center";
        ctx.font = "bold 13px monospace";
        ctx.fillStyle = "#fde047";
        ctx.fillText("FLAPPY OCTO \xB7 10s SPRINT", CANVAS_WIDTH / 2, 48);
        ctx.font = "10px monospace";
        ctx.fillStyle = "#e0f2fe";
        ctx.fillText("Survive 10 Seconds of Coral Reefs!", CANVAS_WIDTH / 2, 68);
        const blink = Math.floor(now * 3e-3) % 2 === 0;
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = blink ? "#38bdf8" : "#fef08a";
        ctx.fillText("\u25B6 PRESS SPACE OR CLICK TO SWIM \u25C0", CANVAS_WIDTH / 2, 108);
        ctx.font = "9px monospace";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Controls: [SPACE] / Click / Touch to Flap", CANVAS_WIDTH / 2, 132);
      } else if (sim.state === "playing") {
        const t = Math.max(0, sim.timeLeft).toFixed(1);
        const timerColor = sim.timeLeft <= 3 ? "#ef4444" : sim.timeLeft <= 6 ? "#f59e0b" : "#22c55e";
        const pct = Math.max(0, sim.timeLeft / SPRINT_DURATION);
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(10, 8, 100, 7);
        ctx.fillStyle = timerColor;
        ctx.fillRect(10, 8, 100 * pct, 7);
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 8, 100, 7);
        ctx.textAlign = "left";
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`\u23F1 ${t}s`, 116, 15);
        ctx.textAlign = "right";
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#fef08a";
        ctx.fillText(`REEFS: ${sim.clearedCount}`, CANVAS_WIDTH - 12, 15);
      } else if (sim.state === "won") {
        ctx.fillStyle = "rgba(4, 25, 20, 0.78)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.textAlign = "center";
        ctx.font = "bold 16px monospace";
        ctx.fillStyle = "#4ade80";
        ctx.fillText("\u{1F3C6} SURVIVED! 10.0s CLEARED! \u{1F3C6}", CANVAS_WIDTH / 2, 54);
        ctx.font = "11px monospace";
        ctx.fillStyle = "#fef08a";
        ctx.fillText(`Reefs Cleared: ${sim.clearedCount} \xB7 Star Surfer \u2B50\u2B50\u2B50`, CANVAS_WIDTH / 2, 78);
        const blink = Math.floor(now * 3e-3) % 2 === 0;
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = blink ? "#38bdf8" : "#ffffff";
        ctx.fillText("\u25B6 PLAY AGAIN (SPACE / CLICK) \u25C0", CANVAS_WIDTH / 2, 116);
      } else if (sim.state === "gameover") {
        ctx.fillStyle = "rgba(30, 10, 15, 0.82)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.textAlign = "center";
        ctx.font = "bold 15px monospace";
        ctx.fillStyle = "#f87171";
        ctx.fillText("\u{1F4A5} CRASHED! \u{1F4A5}", CANVAS_WIDTH / 2, 52);
        const survived = Math.max(0, SPRINT_DURATION - sim.timeLeft).toFixed(1);
        ctx.font = "11px monospace";
        ctx.fillStyle = "#fef3c7";
        ctx.fillText(`Survived: ${survived}s / 10.0s \xB7 Reefs: ${sim.clearedCount}`, CANVAS_WIDTH / 2, 74);
        const blink = Math.floor(now * 3e-3) % 2 === 0;
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = blink ? "#fbbf24" : "#ffffff";
        ctx.fillText("\u25B6 TRY AGAIN (SPACE / CLICK) \u25C0", CANVAS_WIDTH / 2, 114);
      }
    };
    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [recordBestTime, spawnCrashParticles, spawnVictoryParticles]);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref: containerRef,
      className: "relative my-3 overflow-hidden rounded border-2 border-[#a8862f] bg-[#100c06] p-3 text-[#f4e8c8] shadow-2xl",
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-2 flex items-center justify-between border-b border-dashed border-[#856b28] pb-2", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-lg", children: "\u{1F579}\uFE0F" }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[9px] tracking-widest text-[#e8c170]", children: "OCTO-CADE 2026 \xB7 FLAPPY OCTO" }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-[10px] text-[#a89a76]", children: "10-SECOND REEF SURVIVAL SPRINT" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            bestTime > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1 rounded border border-[#856b28] bg-[#241c10] px-2 py-0.5 font-pixel text-[8px] text-[#fde68a]", children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Trophy, { className: "h-3 w-3 text-[#facc15]" }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
                "BEST: ",
                bestTime.toFixed(1),
                "s"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "rounded border border-[#38bdf8]/60 bg-[#0c2233] px-2 py-0.5 font-pixel text-[8px] text-[#38bdf8]", children: "60 FPS" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            className: "relative mx-auto aspect-[16/9] w-full max-w-[440px] cursor-pointer overflow-hidden rounded border-2 border-[#543b17] bg-[#040d16] shadow-inner select-none touch-none",
            onPointerDown: (e) => {
              if (e.button !== 0) return;
              e.preventDefault();
              e.stopPropagation();
              triggerFlap();
            },
            children: /* @__PURE__ */ jsxRuntime.jsx(
              "canvas",
              {
                ref: canvasRef,
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                className: "h-full w-full object-contain",
                style: { imageRendering: "pixelated" }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#3a2f1a] pt-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-2", children: gameState === "playing" ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1.5 font-pixel text-[9px] text-[#86efac]", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "inline-block h-2 w-2 animate-ping rounded-full bg-[#22c55e]" }),
            /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
              "SPRINT: ",
              timeLeft.toFixed(1),
              "s REMAINING"
            ] })
          ] }) : gameState === "won" ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[9px] text-[#4ade80]", children: "\u{1F389} SURVIVED THE 10s SPRINT!" }) : gameState === "gameover" ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[9px] text-[#f87171]", children: "\u{1F4A5} REEF COLLISION" }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[9px] text-[#cdb87e]", children: "READY \xB7 TAP OR PRESS SPACE" }) }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                type: "button",
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  triggerFlap();
                },
                className: "flex items-center gap-1.5 border-b-2 border-[#a8862f] bg-[#e8c170] px-3 py-1.5 font-pixel text-[9px] text-[#221d14] transition hover:bg-[#f5d78e] active:translate-y-[1px] active:border-b-0",
                children: gameState === "ready" ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Play, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { children: "START SPRINT" })
                ] }) : gameState === "playing" ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Waves, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { children: "SWIM / FLAP" })
                ] }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(lucideReact.RotateCcw, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { children: "TRY AGAIN" })
                ] })
              }
            ),
            gameState !== "ready" && /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                type: "button",
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  resetGame();
                },
                className: "flex items-center gap-1 border border-[#6b5b33] bg-[#1a140b] px-2 py-1.5 font-pixel text-[8px] text-[#a89a76] hover:border-[#a8862f] hover:text-[#f4e8c8]",
                title: "Reset to title",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx(lucideReact.RotateCcw, { className: "h-2.5 w-2.5" }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { children: "RESET" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-1 flex items-center justify-between text-[8px] text-[#8a7c58]", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Tip: Press Spacebar or Tap anywhere on the arcade screen" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: "ESC to exit kiosk" })
        ] })
      ]
    }
  );
}
function Kbd({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsx("kbd", { className: "inline-flex min-w-7 items-center justify-center border-2 border-[#a8862f] bg-[#141008] px-1.5 py-0.5 font-pixel text-[9px] text-[#e8c170]", children });
}
function TagChip({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsx("span", { className: "border-2 border-[#6b5b33] bg-[#141008] px-2 py-1 text-[11px] text-[#cdb87e]", children });
}
function GoldButton({
  href,
  children
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  const [count, setCount] = React.useState(0);
  const [prevText, setPrevText] = React.useState(text);
  if (prevText !== text) {
    setPrevText(text);
    setCount(0);
  }
  React.useEffect(() => {
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
  const npc = exports.portfolio.npcs.find((n) => n.id === npcId);
  const [line, setLine] = React.useState(0);
  const tw = useTypewriter((_a = npc == null ? void 0 : npc.lines[line]) != null ? _a : "");
  const next = React.useCallback(() => {
    if (!tw.done) tw.finish();
    else if (npc && line < npc.lines.length - 1) setLine((l) => l + 1);
    else onClose();
  }, [tw, npc, line, onClose]);
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (["Enter", " ", "e", "E"].includes(e.key)) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, onClose]);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: "cursor-pointer select-none",
      onClick: next,
      role: "button",
      tabIndex: -1,
      "aria-label": "Dialogue \u2014 click to continue",
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex h-16 w-16 items-center justify-center border-4 border-[#e8c170] bg-[#141008] text-3xl", children: npc == null ? void 0 : npc.emoji }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[11px] text-[#e8c170]", children: npc == null ? void 0 : npc.name }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-1 text-xs italic text-[#a89a76]", children: npc == null ? void 0 : npc.intro })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "ml-auto font-pixel text-[9px] text-[#8a7c58]", children: [
            line + 1,
            "/",
            npc == null ? void 0 : npc.lines.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "min-h-20 text-sm leading-relaxed text-[#f4e8c8]", children: [
          tw.shown,
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "animate-blink", children: "\u258C" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-4 flex items-center justify-end gap-1 text-[#e8c170]", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-pixel text-[9px]", children: tw.done ? "CLICK TO CONTINUE" : "" }),
          tw.done && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { className: "h-4 w-4 animate-bounce" })
        ] })
      ]
    }
  );
}
function Welcome() {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4 text-sm leading-relaxed text-[#f4e8c8]", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("p", { children: [
      "Welcome to ",
      /* @__PURE__ */ jsxRuntime.jsxs("strong", { className: "text-[#e8c170]", children: [
        exports.portfolio.name,
        "'s"
      ] }),
      " world. This whole site is a game \u2014 walk around, poke things, see what responds."
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border-2 border-[#6b5b33] bg-[#141008] p-3", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mb-2 font-pixel text-[9px] text-[#e8c170]", children: "DESKTOP" }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Kbd, { children: "W" }),
          /* @__PURE__ */ jsxRuntime.jsx(Kbd, { children: "A" }),
          /* @__PURE__ */ jsxRuntime.jsx(Kbd, { children: "S" }),
          /* @__PURE__ */ jsxRuntime.jsx(Kbd, { children: "D" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-[#a89a76]", children: "or arrows to walk" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Kbd, { children: "E" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-[#a89a76]", children: "to interact" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Kbd, { children: "ESC" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-[#a89a76]", children: "to close popups" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border-2 border-[#6b5b33] bg-[#141008] p-3", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mb-2 font-pixel text-[9px] text-[#e8c170]", children: "MOBILE" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-[#a89a76]", children: "Use the joystick (bottom-left) to walk and the big gold button (bottom-right) to interact." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-[#a89a76]", children: "Heads up: there are achievements. And at least one thing hidden in the north-east that most people never find." })
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
  const [currentFortune, setCurrentFortune] = React.useState(null);
  const [tossCount, setTossCount] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const handleTossCoin = () => {
    exports.audio.coin();
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
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative overflow-hidden border-2 border-[#a8862f] bg-[#1a140b] p-4 text-[#f4e8c8] shadow-inner", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: "absolute inset-x-0 top-0 h-1.5 opacity-80",
        style: {
          backgroundImage: "repeating-linear-gradient(45deg, #38bdf8 0px, #38bdf8 10px, #fef08a 10px, #fef08a 20px, #0284c7 20px, #0284c7 30px, #f59e0b 30px, #f59e0b 40px)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-1 flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-[#856b28] pb-2.5", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xl", children: "\u26F2" }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[9px] tracking-widest text-[#e8c170]", children: "FOUNTAIN OF WISDOM \xB7 WISHING WELL" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-0.5 text-[10px] text-[#a89a76]", children: "CENTRAL PLAZA ORACLE \xB7 MAKE A WISH" })
        ] })
      ] }),
      tossCount > 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-1 rounded border border-[#856b28] bg-[#241c10] px-2 py-0.5 font-pixel text-[8px] text-[#fde68a]", children: /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
        "\u{1FA99} TOSSES: ",
        tossCount
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "my-3 min-h-16", children: currentFortune ? /* @__PURE__ */ jsxRuntime.jsxs(
      framerMotion.motion.div,
      {
        initial: { opacity: 0, y: 8, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.25 },
        className: "rounded border border-[#a8862f]/60 bg-[#120e07] p-3 shadow-md",
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-1 flex items-center justify-between font-pixel text-[8px] text-[#e8c170]", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Sparkles, { className: "h-3 w-3 text-[#fde047]" }),
              " THE ORACLE SPEAKS:"
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-[#856b28]", children: [
              "LUCKY COIN #",
              tossCount
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "border-l-2 border-[#e8c170] pl-2.5 italic text-sm text-[#fef08a] leading-relaxed", children: [
            "\u201C",
            currentFortune.quote,
            "\u201D"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-1.5 text-right font-pixel text-[8px] text-[#cdb87e]", children: [
            "\u2014 ",
            currentFortune.author
          ] })
        ]
      },
      currentFortune.quote + tossCount
    ) : /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs italic leading-relaxed text-[#cdb87e]", children: "Legend whispers that tossing a golden coin into the fountain grants crystal-clear compiler insight and reveals ancient developer fortunes. Toss a coin to test your luck!" }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        type: "button",
        onClick: handleTossCoin,
        className: `flex w-full items-center justify-center gap-2 border-b-4 border-[#a8862f] bg-[#e8c170] py-2.5 font-pixel text-[10px] text-[#221d14] transition-all hover:bg-[#f5d78e] active:translate-y-[2px] active:border-b-0 ${isAnimating ? "scale-[0.98] ring-2 ring-[#fde047]" : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Coins, { className: "h-4 w-4 text-[#854d0e]" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u{1FA99} TOSS A COIN INTO THE FOUNTAIN" })
        ]
      }
    )
  ] });
}
function About() {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex h-16 w-16 shrink-0 items-center justify-center border-4 border-[#e8c170] bg-[#141008] text-3xl", children: exports.portfolio.about.emoji }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "font-pixel text-[11px] text-[#e8c170]", children: [
          exports.portfolio.name,
          " \u2014 ",
          exports.portfolio.role
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-1 text-xs italic text-[#a89a76]", children: exports.portfolio.tagline })
      ] })
    ] }),
    exports.portfolio.about.bio.map((p, i) => /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm leading-relaxed text-[#f4e8c8]", children: p }, i)),
    /* @__PURE__ */ jsxRuntime.jsx(FountainOfWisdom, {}),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border-2 border-[#6b5b33] bg-[#141008] p-3", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mb-2 font-pixel text-[9px] text-[#e8c170]", children: "FUN FACTS" }),
      /* @__PURE__ */ jsxRuntime.jsx("ul", { className: "space-y-1.5", children: exports.portfolio.about.funFacts.map((f, i) => /* @__PURE__ */ jsxRuntime.jsxs("li", { className: "flex gap-2 text-xs text-[#cdb87e]", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-[#e8c170]", children: "\u2726" }),
        f
      ] }, i)) })
    ] })
  ] });
}
function Project({ projectId }) {
  const p = exports.portfolio.projects.find((x) => x.id === projectId);
  if (!p) return null;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex h-16 w-16 shrink-0 items-center justify-center border-4 border-[#e8c170] bg-[#141008] text-3xl", children: p.emoji }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[11px] leading-relaxed text-[#e8c170]", children: p.title }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-1 font-pixel text-[9px] text-[#8a7c58]", children: p.year })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm leading-relaxed text-[#f4e8c8]", children: p.description }),
    projectId === "p0" && /* @__PURE__ */ jsxRuntime.jsx(ArcadeMiniGame, {}),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap gap-2", children: p.tags.map((t) => /* @__PURE__ */ jsxRuntime.jsx(TagChip, { children: t }, t)) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap gap-3", children: p.links.map((l) => /* @__PURE__ */ jsxRuntime.jsxs(GoldButton, { href: l.url, children: [
      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Github, { className: "h-3.5 w-3.5" }),
      l.label
    ] }, l.url)) })
  ] });
}
function Skills({ skillId }) {
  const s = exports.portfolio.skills.find((x) => x.id === skillId);
  if (!s) return null;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex h-16 w-16 shrink-0 items-center justify-center border-4 border-[#e8c170] bg-[#141008] text-3xl", children: s.emoji }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[11px] text-[#e8c170]", children: s.name }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-1 text-xs italic text-[#a89a76]", children: s.description })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap gap-2", children: s.skills.map((sk) => /* @__PURE__ */ jsxRuntime.jsx(TagChip, { children: sk }, sk)) })
  ] });
}
function Contact({ onOpenResumeSheet }) {
  const [copiedEmail, setCopiedEmail] = React.useState(false);
  const [copiedDiscord, setCopiedDiscord] = React.useState(false);
  const [topic, setTopic] = React.useState("Job Offer");
  const [senderName, setSenderName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const email = exports.portfolio.contact.email;
  const discord = exports.portfolio.contact.discord;
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2e3);
      sonner.toast.success(`Copied email (${email}) to clipboard!`);
    } catch (e) {
      sonner.toast.error("Could not access clipboard");
    }
  };
  const handleCopyDiscord = async () => {
    try {
      await navigator.clipboard.writeText(discord);
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2e3);
      sonner.toast.success(`Copied Discord (@${discord}) to clipboard!`);
    } catch (e) {
      sonner.toast.error("Could not access clipboard");
    }
  };
  const handleDownloadResume = () => {
    const resumeText = `================================================================
${exports.portfolio.name.toUpperCase()} \u2014 ${exports.portfolio.role.toUpperCase()}
Location: ${exports.portfolio.location} | Email: ${email} | Discord: @${discord}
GitHub: https://github.com/YashShingan
LinkedIn: https://www.linkedin.com/in/yashshingan
Portfolio Game: https://yashshingan.github.io/portfolio-game/
================================================================

SUMMARY:
${exports.portfolio.about.bio.join("\n\n")}

CORE SKILLS:
${exports.portfolio.skills.map((s) => `\u2022 ${s.name}: ${s.skills.join(", ")}`).join("\n")}

FEATURED PROJECTS:
${exports.portfolio.projects.map(
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
    sonner.toast.success("Resume document downloaded!");
  };
  const handleSendMail = (e) => {
    e.preventDefault();
    const cleanName = senderName.trim() || "Traveler";
    const subject = `[${topic}] Dispatch from ${cleanName}`;
    const body = `${message.trim() || "Hi Yash, I came across your portfolio game and would love to connect!"}

\u2014 Sent by ${cleanName} via Portfolio RPG Telegram`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    sonner.toast.success("Opening your mail client...");
  };
  const iconFor = (label) => {
    if (label === "Email") return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Mail, { className: "h-4 w-4" });
    if (label === "GitHub") return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Github, { className: "h-4 w-4" });
    if (label === "Discord") return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.MessageSquare, { className: "h-4 w-4" });
    return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Linkedin, { className: "h-4 w-4" });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative overflow-hidden border-2 border-[#a8862f] bg-[#1a140b] p-4 text-[#f4e8c8] shadow-inner", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          className: "absolute inset-x-0 top-0 h-1.5 opacity-80",
          style: {
            backgroundImage: "repeating-linear-gradient(45deg, #dc2626 0px, #dc2626 10px, #fef3c7 10px, #fef3c7 20px, #2563eb 20px, #2563eb 30px, #fef3c7 30px, #fef3c7 40px)"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-1 flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-[#856b28] pb-2.5", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[9px] tracking-widest text-[#e8c170]", children: "TELEGRAPH DISPATCH \xB7 POSTAL STATION" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-0.5 text-[10px] text-[#a89a76]", children: [
            "ORIGIN: ",
            exports.portfolio.location.toUpperCase(),
            " \xB7 ROUTE: PRIORITY"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "rounded border border-[#dc2626]/70 px-2 py-0.5 font-pixel text-[8px] tracking-wider text-[#f87171]", children: "EXPRESS" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "my-3 space-y-1.5 font-mono text-xs leading-relaxed text-[#fef3c7]", children: /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "border-l-2 border-[#e8c170] pl-2.5 italic", children: [
        "\u201C",
        exports.portfolio.contact.blurb,
        " STOP.\u201D"
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: handleCopyEmail,
            className: "flex items-center justify-center gap-1.5 border border-[#856b28] bg-[#241c10] px-2 py-2 font-pixel text-[8px] sm:text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717] active:scale-95",
            children: [
              copiedEmail ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Check, { className: "h-3 w-3 text-[#86efac]" }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Copy, { className: "h-3 w-3 text-[#e8c170]" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: copiedEmail ? "COPIED" : "COPY EMAIL" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: handleCopyDiscord,
            className: "flex items-center justify-center gap-1.5 border border-[#856b28] bg-[#241c10] px-2 py-2 font-pixel text-[8px] sm:text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717] active:scale-95",
            children: [
              copiedDiscord ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Check, { className: "h-3 w-3 text-[#86efac]" }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Copy, { className: "h-3 w-3 text-[#e8c170]" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: copiedDiscord ? "COPIED" : "COPY DISCORD" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: handleDownloadResume,
            className: "flex items-center justify-center gap-1.5 border border-[#856b28] bg-[#241c10] px-2 py-2 font-pixel text-[8px] sm:text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717] active:scale-95",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Download, { className: "h-3 w-3 text-[#e8c170]" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: "RESUME (TXT)" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: onOpenResumeSheet,
            className: "flex items-center justify-center gap-1.5 border border-[#a8862f] bg-[#332717] px-2 py-2 font-pixel text-[8px] sm:text-[9px] text-[#fef08a] transition hover:border-[#fde68a] hover:bg-[#42331c] active:scale-95",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileText, { className: "h-3 w-3 text-[#e8c170]" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: "RESUME (PDF)" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs(
      "form",
      {
        onSubmit: handleSendMail,
        onKeyDown: (e) => e.stopPropagation(),
        className: "space-y-3 border-2 border-[#6b5b33] bg-[#141008] p-3.5",
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between border-b border-[#3d321d] pb-1.5 font-pixel text-[9px] text-[#e8c170]", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Send, { className: "h-3 w-3 text-[#e8c170]" }),
              " QUICK TELEGRAM COMPOSER"
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-[8px] text-[#8a7c58]", children: "DIRECT MAILTO" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("label", { className: "mb-1 block font-pixel text-[8px] text-[#a89a76]", children: "SELECT TOPIC" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid grid-cols-2 gap-1.5 sm:grid-cols-4", children: ["Job Offer", "Project Collab", "Coffee Chat", "Say Hello"].map((t) => /* @__PURE__ */ jsxRuntime.jsx(
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
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid gap-2 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "sm:col-span-1", children: [
              /* @__PURE__ */ jsxRuntime.jsx("label", { className: "mb-1 block font-pixel text-[8px] text-[#a89a76]", children: "YOUR NAME" }),
              /* @__PURE__ */ jsxRuntime.jsx(
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
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsxRuntime.jsx("label", { className: "mb-1 block font-pixel text-[8px] text-[#a89a76]", children: "NOTE" }),
              /* @__PURE__ */ jsxRuntime.jsx(
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
          /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              type: "submit",
              className: "flex w-full items-center justify-center gap-2 border-b-4 border-[#a8862f] bg-[#e8c170] py-2 font-pixel text-[10px] text-[#221d14] transition hover:bg-[#f5d78e] active:translate-y-[1px] active:border-b-2",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Mail, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: "DISPATCH TELEGRAM MESSAGE" })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: exports.portfolio.contact.links.map((l) => /* @__PURE__ */ jsxRuntime.jsxs(
      "a",
      {
        href: l.url,
        target: l.url.startsWith("http") ? "_blank" : void 0,
        rel: "noreferrer",
        className: "flex items-center gap-2.5 border-2 border-[#4a3f24] bg-[#141008] px-3 py-2.5 transition-colors hover:border-[#e8c170]",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-[#e8c170]", children: iconFor(l.label) }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[9px] text-[#f4e8c8]", children: l.label }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "truncate text-[11px] text-[#a89a76]", children: l.value })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ExternalLink, { className: "ml-auto h-3.5 w-3.5 shrink-0 text-[#8a7c58]" })
        ]
      },
      l.url
    )) })
  ] });
}
function Secret({ onClose }) {
  var _a;
  const [line, setLine] = React.useState(0);
  const tw = useTypewriter((_a = exports.portfolio.secret.lines[line]) != null ? _a : "", 14);
  const next = React.useCallback(() => {
    if (!tw.done) tw.finish();
    else if (line < exports.portfolio.secret.lines.length - 1) setLine((l) => l + 1);
    else onClose();
  }, [tw, line, onClose]);
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (["Enter", " ", "e", "E"].includes(e.key)) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, onClose]);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "cursor-pointer select-none space-y-3", onClick: next, role: "button", tabIndex: -1, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex h-20 w-20 items-center justify-center border-4 border-[#f5d78e] bg-[#141008] text-4xl shadow-[0_0_30px_rgba(232,193,112,0.35)]", children: exports.portfolio.secret.emoji }),
    /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "min-h-16 text-sm leading-relaxed text-[#f5d78e]", children: [
      tw.shown,
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "animate-blink", children: "\u258C" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-right font-pixel text-[9px] text-[#c9a44e]", children: tw.done ? `${line + 1}/${exports.portfolio.secret.lines.length} \xB7 CLICK TO CONTINUE` : "" })
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
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && payload.kind !== "dialogue" && payload.kind !== "secret") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, payload.kind]);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: "absolute inset-0 z-30 flex items-end justify-center p-4 sm:items-center",
      onKeyDown: (e) => {
        if (e.key !== "Escape") e.stopPropagation();
      },
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            className: "absolute inset-0 bg-black/60",
            onClick: payload.kind === "dialogue" || payload.kind === "secret" ? void 0 : onClose,
            "aria-hidden": true
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          framerMotion.motion.div,
          {
            initial: { opacity: 0, y: 24, scale: 0.96 },
            animate: { opacity: 1, y: 0, scale: 1 },
            transition: { type: "spring", stiffness: 380, damping: 28 },
            role: "dialog",
            "aria-modal": "true",
            "aria-label": payload.title,
            className: `pixel-panel relative z-10 max-h-[82dvh] w-full max-w-lg overflow-y-auto p-5 sm:p-6 ${payload.kind === "secret" ? "border-[#f5d78e]" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-4 flex items-center justify-between border-b-2 border-dashed border-[#6b5b33] pb-3", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xl", children: KIND_META[payload.kind] }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-pixel text-[11px] text-[#e8c170]", children: payload.title }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    onClick: onClose,
                    "aria-label": "Close",
                    className: "border-2 border-[#6b5b33] bg-[#141008] p-1.5 text-[#cdb87e] transition-colors hover:border-[#e8c170] hover:text-[#e8c170]",
                    children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-3.5 w-3.5" })
                  }
                )
              ] }),
              payload.kind === "welcome" && /* @__PURE__ */ jsxRuntime.jsx(Welcome, {}),
              payload.kind === "about" && /* @__PURE__ */ jsxRuntime.jsx(About, {}),
              payload.kind === "project" && /* @__PURE__ */ jsxRuntime.jsx(Project, { projectId: payload.projectId }),
              payload.kind === "skills" && /* @__PURE__ */ jsxRuntime.jsx(Skills, { skillId: payload.skillId }),
              payload.kind === "contact" && /* @__PURE__ */ jsxRuntime.jsx(Contact, { onOpenResumeSheet }),
              payload.kind === "dialogue" && /* @__PURE__ */ jsxRuntime.jsx(Dialogue, { npcId: payload.npcId, onClose }),
              payload.kind === "secret" && /* @__PURE__ */ jsxRuntime.jsx(Secret, { onClose }),
              payload.kind !== "dialogue" && payload.kind !== "secret" && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mt-5 border-t-2 border-dashed border-[#6b5b33] pt-3 text-center font-pixel text-[8px] text-[#8a7c58]", children: "ESC OR TAP OUTSIDE TO CLOSE" })
            ]
          }
        )
      ]
    }
  );
}

// src/components/game/GameOverlay.tsx
init_portfolio();
init_achievements();
init_audio();
init_events();
init_shared();
function GameOverlay({ open, onClose }) {
  const containerRef = React.useRef(null);
  const gameRef = React.useRef(null);
  const [prompt, setPrompt] = React.useState(null);
  const [zone, setZone] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const [resumeModeOpen, setResumeModeOpen] = React.useState(false);
  const [muted, setMuted] = React.useState(() => exports.audio.isMuted);
  const [timeMode, setTimeMode] = React.useState(() => getLocalTimeMode());
  const timeModeRef = React.useRef(timeMode);
  React.useEffect(() => {
    timeModeRef.current = timeMode;
  }, [timeMode]);
  const [touch, setTouch] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(any-pointer: coarse)").matches || navigator.maxTouchPoints > 1;
  });
  const [achOpen, setAchOpen] = React.useState(false);
  const [achCount, setAchCount] = React.useState(() => unlockedIds().size);
  const [presence, setPresence] = React.useState(1);
  React.useEffect(() => {
    if (touch) return;
    const onTouchStart = () => {
      setTouch(true);
      detach();
    };
    const onPointerDown = (e) => {
      if (e.pointerType === "touch") onTouchStart();
    };
    const detach = () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("pointerdown", onPointerDown);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return detach;
  }, [touch]);
  React.useEffect(() => {
    if (!open) return;
    let destroyed = false;
    const cleanups = [];
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    resetSharedState();
    exports.audio.init();
    queueMicrotask(() => {
      if (!destroyed) {
        setMuted(exports.audio.isMuted);
        setAchCount(unlockedIds().size);
      }
    });
    Promise.race([
      typeof document !== "undefined" && document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((r) => setTimeout(r, 1500))
    ]).then(async () => {
      if (destroyed || !containerRef.current) return;
      const { createGame: createGame2 } = await Promise.resolve().then(() => (init_main(), main_exports));
      if (destroyed || !containerRef.current) return;
      gameRef.current = createGame2(containerRef.current);
    });
    cleanups.push(
      onGameEvent("pg:ready", () => {
        setReady(true);
        emitGameEvent("pg:time-mode", { mode: timeModeRef.current, instant: true });
      })
    );
    cleanups.push(onGameEvent("pg:prompt", (d) => setPrompt(d.label)));
    cleanups.push(onGameEvent("pg:zone-open", (d) => setZone(d)));
    cleanups.push(onGameEvent("pg:presence", (d) => setPresence(d.count)));
    cleanups.push(
      onGameEvent("pg:achievement", (d) => {
        setAchCount(unlockedIds().size);
        exports.audio.achieve();
        toastAchievement(d.emoji, d.title, d.desc);
      })
    );
    return () => {
      var _a;
      destroyed = true;
      cleanups.forEach((c) => c());
      (_a = gameRef.current) == null ? void 0 : _a.destroy(true);
      gameRef.current = null;
      exports.audio.destroy();
      document.body.style.overflow = prevOverflow;
      resetSharedState();
    };
  }, [open]);
  const closeZone = React.useCallback(() => {
    setZone(null);
    exports.gameRuntime.modalOpen = false;
    emitGameEvent("pg:zone-close", void 0);
  }, []);
  const handleInteract = React.useCallback(() => {
    exports.gameRuntime.interactQueued = true;
  }, []);
  const toggleResumeMode = React.useCallback((active) => {
    setResumeModeOpen((prev) => {
      const next = active !== void 0 ? active : !prev;
      exports.gameRuntime.modalOpen = next || zone !== null;
      if (next) {
        emitGameEvent("pg:zone-open", { kind: "welcome", id: "resume", title: "Resume" });
      } else if (!zone) {
        emitGameEvent("pg:zone-close", void 0);
      }
      return next;
    });
  }, [zone]);
  const toggleMute = React.useCallback(() => {
    setMuted(exports.audio.toggleMute());
  }, []);
  const cycleTimeMode = React.useCallback(() => {
    setTimeMode((prev) => {
      const next = prev === "day" ? "sunset" : prev === "sunset" ? "night" : "day";
      emitGameEvent("pg:time-mode", { mode: next, instant: false });
      return next;
    });
  }, []);
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "fixed inset-0 z-50 bg-[#1d3520]", role: "dialog", "aria-label": "Interactive portfolio game", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { ref: containerRef, className: "absolute inset-0", "aria-hidden": true }),
    !ready && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-[#12160f]", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "animate-bounce font-pixel text-lg text-[#e8c170]", children: "\u{1F3AE}" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[10px] text-[#a89a76]", children: "BUILDING THE WORLD..." })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pixel-chip font-pixel text-[9px] sm:text-[10px]", children: [
          "\u{1F3AE} ",
          exports.portfolio.name.toUpperCase(),
          "'S WORLD"
        ] }),
        ready && presence > 1 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pixel-chip animate-pulse font-pixel text-[8px] text-[#9fe0ff] sm:text-[9px]", children: [
          "\u{1F47B} ",
          presence - 1,
          " GHOST",
          presence === 2 ? "" : "S",
          " HERE"
        ] })
      ] }),
      ready && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pointer-events-auto flex items-center border-2 border-[#a8862f] bg-[#141008] p-0.5 shadow-md", children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            onClick: () => toggleResumeMode(true),
            className: `flex items-center gap-1.5 px-2.5 py-1 font-pixel text-[8px] sm:text-[9px] transition ${resumeModeOpen ? "bg-[#e8c170] text-[#1c160a]" : "text-[#cdb87e] hover:text-[#f5d78e]"}`,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileText, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u{1F4C4} RESUME MODE" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            onClick: () => toggleResumeMode(false),
            className: `flex items-center gap-1.5 px-2.5 py-1 font-pixel text-[8px] sm:text-[9px] transition ${!resumeModeOpen ? "bg-[#e8c170] text-[#1c160a]" : "text-[#cdb87e] hover:text-[#f5d78e]"}`,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Gamepad2, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u{1F3AE} GAME" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pointer-events-auto flex gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            onClick: cycleTimeMode,
            "aria-label": `Current time of day: ${timeMode}. Click to switch.`,
            title: `Lighting: ${timeMode.toUpperCase()} (Click to toggle)`,
            className: "hud-btn flex items-center gap-1.5",
            children: [
              timeMode === "day" && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Sun, { className: "h-4 w-4 text-[#f5c96b]" }),
              timeMode === "sunset" && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Sunset, { className: "h-4 w-4 text-[#f97316]" }),
              timeMode === "night" && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Moon, { className: "h-4 w-4 text-[#93c5fd]" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "hidden font-pixel text-[8px] uppercase sm:inline", children: timeMode })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: toggleMute,
            "aria-label": muted ? "Unmute sound" : "Mute sound",
            className: "hud-btn",
            children: muted ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Volume2, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            onClick: () => setAchOpen(true),
            "aria-label": "Open achievements",
            className: "hud-btn flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Trophy, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "font-pixel text-[9px]", children: [
                achCount,
                "/",
                ACHIEVEMENTS.length
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: onClose, "aria-label": "Exit game", className: "hud-btn", children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-4 w-4" }) })
      ] })
    ] }),
    ready && prompt && !zone && !resumeModeOpen && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pixel-chip absolute bottom-32 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap font-pixel text-[9px] sm:text-[10px]", children: touch ? /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
      "\u2728 ",
      prompt
    ] }) : /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-[#e8c170]", children: "[E]" }),
      " ",
      prompt
    ] }) }),
    ready && !zone && !achOpen && !resumeModeOpen && /* @__PURE__ */ jsxRuntime.jsx(Minimap, {}),
    touch && ready && !zone && !resumeModeOpen && /* @__PURE__ */ jsxRuntime.jsx(Joystick, {}),
    touch && ready && !zone && !resumeModeOpen && /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        onClick: handleInteract,
        "aria-label": "Interact",
        className: "absolute bottom-7 right-5 z-20 flex h-20 w-20 touch-none select-none items-center justify-center rounded-full border-4 border-[#e8c170] bg-[#e8c170]/30 font-pixel text-[11px] text-[#f5d78e] shadow-[0_0_20px_rgba(232,193,112,0.4)] backdrop-blur-[2px] active:scale-95",
        children: "E"
      }
    ),
    zone && !resumeModeOpen && /* @__PURE__ */ jsxRuntime.jsx(
      ZoneModal,
      {
        payload: zone,
        onClose: closeZone,
        onOpenResumeSheet: () => {
          closeZone();
          toggleResumeMode(true);
        }
      }
    ),
    resumeModeOpen && /* @__PURE__ */ jsxRuntime.jsx(ResumeSheet, { onClose: () => toggleResumeMode(false) }),
    achOpen && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "absolute inset-0 z-30 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute inset-0 bg-black/60", onClick: () => setAchOpen(false), "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pixel-panel relative z-10 w-full max-w-md p-5", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-4 flex items-center justify-between border-b-2 border-dashed border-[#6b5b33] pb-3", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-pixel text-[11px] text-[#e8c170]", children: "\u{1F3C6} ACHIEVEMENTS" }),
          /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: () => setAchOpen(false), "aria-label": "Close", className: "text-[#cdb87e] hover:text-[#e8c170]", children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("ul", { className: "max-h-96 space-y-2 overflow-y-auto pr-1", children: ACHIEVEMENTS.map((a) => {
          const got = unlockedIds().has(a.id);
          return /* @__PURE__ */ jsxRuntime.jsxs(
            "li",
            {
              className: `flex items-center gap-3 border-2 p-2.5 ${got ? "border-[#e8c170] bg-[#e8c170]/10" : "border-[#3d3625] bg-[#141008] opacity-60"}`,
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xl", children: got ? a.emoji : "\u2754" }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[9px] text-[#f4e8c8]", children: a.title }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "truncate text-xs text-[#a89a76]", children: a.desc })
                ] }),
                got && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ml-auto text-[#e8c170]", children: "\u2713" })
              ]
            },
            a.id
          );
        }) })
      ] })
    ] })
  ] });
}
function toastAchievement(emoji, title, desc) {
  sonner.toast.custom(
    () => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pixel-panel flex items-center gap-3 p-4", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-2xl", children: emoji }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-pixel text-[10px] text-[#e8c170]", children: "ACHIEVEMENT UNLOCKED" }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-1 text-sm text-[#f4e8c8]", children: title }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xs text-[#a89a76]", children: desc })
      ] })
    ] }),
    { duration: 4200, position: "top-center" }
  );
}
function ResumeSheet({ onClose }) {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const handleDownload = () => {
    const resumeText = `================================================================
${exports.portfolio.name.toUpperCase()} \u2014 ${exports.portfolio.role.toUpperCase()}
Location: ${exports.portfolio.location} | Email: ${exports.portfolio.contact.email}
GitHub: https://github.com/YashShingan
LinkedIn: https://www.linkedin.com/in/yashshingan
Portfolio Game: https://yashshingan.github.io/portfolio-game/
================================================================

SUMMARY:
${exports.portfolio.about.bio.join("\n\n")}

TECHNICAL EXPERTISE:
${exports.portfolio.skills.map((s) => `\u2022 ${s.name}: ${s.skills.join(", ")}`).join("\n")}

SELECTED WORKS & PORTFOLIO:
${exports.portfolio.projects.map(
      (p) => `\u2022 ${p.title} (${p.year})
  ${p.description}
  Tech Stack: ${p.tags.join(", ")}
  Links: ${p.links.map((l) => `${l.label}: ${l.url}`).join(" | ")}`
    ).join("\n\n")}

CONTACT:
Email: ${exports.portfolio.contact.email}
Discord: @${exports.portfolio.contact.discord}
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
    sonner.toast.success("Resume text downloaded!");
  };
  const handlePrint = () => {
    window.print();
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: "fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm printable-resume-dialog",
      onKeyDown: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute inset-0 no-print", onClick: onClose, "aria-hidden": true }),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: "pixel-panel relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden border-2 border-[#e8c170] bg-[#141008] p-0 shadow-2xl printable-resume-dialog",
            role: "dialog",
            "aria-label": "Recruiter Resume Fast Track",
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "no-print flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-[#856b28] bg-[#1a140b] px-4 py-3 sm:px-6", children: [
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-pixel text-xs text-[#e8c170]", children: "\u{1F4C4} RECRUITER FAST TRACK" }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "rounded border border-[#856b28] bg-[#241c10] px-2 py-0.5 font-pixel text-[8px] text-[#cdb87e]", children: "EXECUTIVE SHEET" })
                ] }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntime.jsxs(
                    "button",
                    {
                      onClick: handlePrint,
                      "aria-label": "Print resume",
                      className: "flex items-center gap-1 border border-[#856b28] bg-[#241c10] px-2.5 py-1.5 font-pixel text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717]",
                      children: [
                        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Printer, { className: "h-3.5 w-3.5 text-[#e8c170]" }),
                        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "hidden sm:inline", children: "PRINT / PDF" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntime.jsxs(
                    "button",
                    {
                      onClick: handleDownload,
                      "aria-label": "Download plaintext resume",
                      className: "flex items-center gap-1 border border-[#856b28] bg-[#241c10] px-2.5 py-1.5 font-pixel text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717]",
                      children: [
                        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Download, { className: "h-3.5 w-3.5 text-[#e8c170]" }),
                        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "hidden sm:inline", children: "DOWNLOAD TXT" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntime.jsx(
                    "button",
                    {
                      onClick: onClose,
                      "aria-label": "Close resume mode",
                      className: "border border-[#856b28] bg-[#241c10] p-1.5 text-[#cdb87e] transition hover:border-[#e8c170] hover:text-[#e8c170]",
                      children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-6 overflow-y-auto p-4 sm:p-6 text-sm text-[#f4e8c8] printable-resume-body", children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "border-2 border-[#4a3f24] bg-[#1b150c] p-4 sm:p-5 printable-card", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "font-pixel text-base sm:text-lg text-[#f5d78e]", children: exports.portfolio.name }),
                    /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "mt-1 font-pixel text-[10px] text-[#e8c170]", children: [
                      exports.portfolio.role,
                      " \xB7 ",
                      exports.portfolio.location
                    ] }),
                    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mt-1 text-xs italic text-[#cdb87e]", children: exports.portfolio.tagline })
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-wrap gap-2 text-xs", children: [
                    /* @__PURE__ */ jsxRuntime.jsxs(
                      "a",
                      {
                        href: `mailto:${exports.portfolio.contact.email}`,
                        className: "flex items-center gap-1.5 border border-[#856b28] bg-[#141008] px-2.5 py-1 text-[#f4e8c8] hover:border-[#e8c170]",
                        children: [
                          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Mail, { className: "h-3 w-3 text-[#e8c170]" }),
                          " ",
                          exports.portfolio.contact.email
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsxs(
                      "a",
                      {
                        href: "https://github.com/YashShingan",
                        target: "_blank",
                        rel: "noreferrer",
                        className: "flex items-center gap-1.5 border border-[#856b28] bg-[#141008] px-2.5 py-1 text-[#f4e8c8] hover:border-[#e8c170]",
                        children: [
                          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Github, { className: "h-3 w-3 text-[#e8c170]" }),
                          " GitHub"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsxs(
                      "a",
                      {
                        href: "https://www.linkedin.com/",
                        target: "_blank",
                        rel: "noreferrer",
                        className: "flex items-center gap-1.5 border border-[#856b28] bg-[#141008] px-2.5 py-1 text-[#f4e8c8] hover:border-[#e8c170]",
                        children: [
                          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Linkedin, { className: "h-3 w-3 text-[#e8c170]" }),
                          " LinkedIn"
                        ]
                      }
                    )
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntime.jsxs("h2", { className: "mb-2 font-pixel text-[10px] text-[#e8c170] flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u2726" }),
                    " SUMMARY & PHILOSOPHY"
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "space-y-2 border-l-2 border-[#856b28] pl-3 text-xs leading-relaxed text-[#f4e8c8]/90", children: exports.portfolio.about.bio.map((p, i) => /* @__PURE__ */ jsxRuntime.jsx("p", { children: p }, i)) })
                ] }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntime.jsxs("h2", { className: "mb-2.5 font-pixel text-[10px] text-[#e8c170] flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u2726" }),
                    " TECHNICAL COMPETENCIES"
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: exports.portfolio.skills.map((grp) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border border-[#4a3f24] bg-[#19140c] p-3", children: [
                    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-base", children: grp.emoji }),
                      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-pixel text-[9px] text-[#f5d78e]", children: grp.name })
                    ] }),
                    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap gap-1.5", children: grp.skills.map((sk) => /* @__PURE__ */ jsxRuntime.jsx(
                      "span",
                      {
                        className: "border border-[#594b29] bg-[#120e07] px-1.5 py-0.5 text-[10px] text-[#cdb87e]",
                        children: sk
                      },
                      sk
                    )) })
                  ] }, grp.id)) })
                ] }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntime.jsxs("h2", { className: "mb-2.5 font-pixel text-[10px] text-[#e8c170] flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u2726" }),
                    " FEATURED PROJECTS"
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: exports.portfolio.projects.map((proj) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col border border-[#4a3f24] bg-[#19140c] p-3.5", children: [
                    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-start justify-between gap-2 mb-1.5", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-lg", children: proj.emoji }),
                      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-pixel text-[10px] text-[#f5d78e]", children: proj.title }),
                        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-pixel text-[8px] text-[#8a7c58]", children: proj.year })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mb-3 text-xs leading-relaxed text-[#dcd4c0] flex-1", children: proj.description }),
                    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap gap-1 mb-3", children: proj.tags.map((t) => /* @__PURE__ */ jsxRuntime.jsx("span", { className: "border border-[#3d341c] bg-[#100c06] px-1.5 py-0.5 text-[9px] text-[#a89a76]", children: t }, t)) }),
                    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-auto flex flex-wrap gap-2 border-t border-[#3d321d] pt-2", children: proj.links.map((l) => /* @__PURE__ */ jsxRuntime.jsxs(
                      "a",
                      {
                        href: l.url,
                        target: "_blank",
                        rel: "noreferrer",
                        className: "inline-flex items-center gap-1 font-pixel text-[8px] text-[#e8c170] hover:text-[#fde68a]",
                        children: [
                          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ExternalLink, { className: "h-2.5 w-2.5" }),
                          /* @__PURE__ */ jsxRuntime.jsx("span", { children: l.label })
                        ]
                      },
                      l.url
                    )) })
                  ] }, proj.id)) })
                ] }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "no-print border-t-2 border-dashed border-[#856b28] pt-4 text-center", children: /* @__PURE__ */ jsxRuntime.jsxs(
                  "button",
                  {
                    onClick: onClose,
                    className: "inline-flex items-center gap-2 border-b-4 border-[#a8862f] bg-[#e8c170] px-5 py-2.5 font-pixel text-[10px] text-[#221d14] transition hover:bg-[#f5d78e] active:translate-y-[2px] active:border-b-0",
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Gamepad2, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "RETURN TO EXPLORING THE WORLD" })
                    ]
                  }
                ) })
              ] })
            ]
          }
        )
      ]
    }
  );
}

// src/index.ts
init_portfolio();
init_audio();
init_main();
init_shared();
function PortfolioGame({
  open = true,
  onClose,
  className
}) {
  const [isOpen, setIsOpen] = React.useState(open);
  const handleClose = () => {
    setIsOpen(false);
    onClose == null ? void 0 : onClose();
  };
  if (!isOpen) return null;
  return React__default.default.createElement(
    "div",
    { className },
    React__default.default.createElement(GameOverlay, { open: isOpen, onClose: handleClose })
  );
}
var src_default = PortfolioGame;

exports.ArcadeMiniGame = ArcadeMiniGame;
exports.GameOverlay = GameOverlay;
exports.Joystick = Joystick;
exports.PortfolioGame = PortfolioGame;
exports.createGame = createGame;
exports.default = src_default;
exports.pixelFont = pixelFont;
exports.resetSharedState = resetSharedState;
