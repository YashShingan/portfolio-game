# 🎮 Pixel Portfolio Game v2

An interactive 2D top-down RPG portfolio website built with **Next.js 16**, **Phaser 3.90**, **TypeScript**, and **Tailwind CSS**.

Rebuilt from the ground up as a complete rewrite of the original prototype, featuring a fixed 3000×3000 world, real-time multiplayer ghost visitors, procedural chiptune audio, interactive NPCs, unlockable achievements, and full mobile support.

---

## ✨ Features

- 🗺️ **Expansive 3000×3000 World**: Seamless camera scrolling across a custom-rendered organic landscape featuring a central flagstone plaza, winding dirt paths, gardens, a fountain, and secret clearings.
- 👻 **Multiplayer Ghost Visitors**: Real-time visitor presence powered by Server-Sent Events (SSE). Other visitors walking through the world appear as translucent ghosts with custom names and minimap radar pings.
- 💬 **Interactive RPG Zones & NPCs**:
  - ⛲ **Fountain Plaza**: Developer bio and background story with anchored 4-stage water cascade animations.
  - 📋 **Noticeboards**: Interactive project showcases featuring descriptions, tech tags, and links.
  - 🌱 **Skill Garden**: Visual breakdown of technical skills, frameworks, and tools.
  - 📬 **Mailbox**: Contact links, social profiles, and quick messaging.
  - 🐙 **NPC Dialogue**: In-game characters with retro RPG typewriter dialogue sequences.
  - 🗝️ **Secret Clearing**: Hidden area and treasure chest with confetti rewards.
- 🏆 **Achievements System**: Unlockable achievements (First Steps, Curious Explorer, Social Butterfly, Konami Code master, etc.) with a progress drawer and HUD badge.
- 🗺️ **Live Minimap Radar**: Real-time HUD radar showing world landmarks, player position, and active visitor locations.
- 🎵 **Procedural Chiptune Audio**: Zero external audio assets to download — 100% synthesized retro chiptune background melodies, footsteps, chime sounds, and fanfares synthesized via Web Audio API.
- 📱 **Cross-Platform Responsive Controls**:
  - **Desktop**: Full keyboard navigation (`W`, `A`, `S`, `D` or Arrow keys, `E` to interact, `ESC` to close).
  - **Mobile / Touch**: Auto-detecting virtual floating joystick and on-screen action buttons.
- ⚡ **SEO & Performance Optimized**: Instant-loading Next.js App Router shell with JSON-LD structured data and retro pixel typography (Press Start 2P).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server-Sent Events)
- **Game Engine**: [Phaser 3.90](https://phaser.io/)
- **UI & Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- **Audio**: Web Audio API (procedural chiptune synthesizer)
- **Language**: TypeScript
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.18 or higher (Node.js 20+ recommended)
- **npm**, **pnpm**, or **bun**

### 1. Installation

```bash
git clone https://github.com/YashShingan/portfolio-game.git
cd portfolio-game
npm install
```

### 2. Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the game.

### 3. Production Build

To build and run the production application:

```bash
npm run build
npm start
```

---

## 🎨 Customizing Content

All portfolio content is centralized in a single configuration file:

👉 **[`src/config/portfolio.ts`](src/config/portfolio.ts)**

You can easily update:
- Your name, role, bio, and social links
- Showcase projects (titles, descriptions, tags, and repo links)
- Technical skill groups
- NPC dialogue lines and custom character tints

---

## 📁 Project Structure

```
├── public/
│   └── game-assets/          # Sprites, tiles, and cleaned pixel art
├── src/
│   ├── app/                  # Next.js App Router pages & SSE presence API
│   │   ├── api/presence/     # Real-time ghost presence endpoints
│   │   └── page.tsx          # Landing page & game mount
│   ├── components/
│   │   ├── game/             # React HUD, Minimap, Joystick, and Modals
│   │   └── ui/               # UI components
│   ├── config/
│   │   └── portfolio.ts      # Portfolio content configuration
│   ├── game/
│   │   ├── entities/         # Player, NPC, and Ghost game objects
│   │   ├── scenes/           # BootScene and WorldScene
│   │   └── systems/          # Ground painting, Audio synth, Achievements
│   └── lib/                  # Presence store and utilities
├── scripts/                  # Build-time asset processing utilities
├── package.json
└── tsconfig.json
```

---

## 🎮 Controls

| Action | Desktop | Mobile / Touch |
| :--- | :--- | :--- |
| **Move** | `W`, `A`, `S`, `D` / Arrow Keys | Virtual Joystick |
| **Interact** | `E` | Tap `(E)` Action Button |
| **Close Window** | `ESC` / Click backdrop | Tap `✕` Button |
| **Easter Egg** | Konami Code (`↑ ↑ ↓ ↓ ← → ← → B A`) | — |

---

## 📜 Version History

- **v2.0 (Current)**: Complete rewrite with Next.js 16, Phaser 3.90, multiplayer ghosts, procedural audio, minimap, achievements, and responsive mobile controls.
- **v1.0 (Legacy)**: Original vanilla JavaScript prototype (preserved on Git tag [`v1.0`](https://github.com/YashShingan/portfolio-game/tree/v1.0)).

---

## 📄 License

MIT © [Yash Shingan](https://github.com/YashShingan)
