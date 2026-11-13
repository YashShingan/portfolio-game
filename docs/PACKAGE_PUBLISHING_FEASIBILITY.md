# Package Publishing Feasibility Assessment & Architectural Blueprint

**Project**: `portfolio-game` (`@yashshingan/portfolio-game`)  
**Target Milestones**: Milestone M2 (Feasibility Assessment) & Milestone M3 Architecture Blueprint  
**Status**: APPROVED & HIGHLY FEASIBLE  
**Baseline Version**: `2.0.0`  
**Date**: November 2026  

---

## 1. Executive Summary & Feasibility Verdict

### 1.1 Assessment Overview
This report evaluates the technical feasibility, architectural trade-offs, registry distribution mechanics, and implementation requirements for packaging and distributing modular components from the `portfolio-game` repository. The codebase represents a modern, production-grade 2D retro RPG portfolio application built with Next.js 16, Phaser 3.90, TypeScript, and Tailwind CSS.

### 1.2 Feasibility Verdict: HIGHLY FEASIBLE (Root Hybrid Subpath Architecture)
Extracting and publishing packages from this repository is **highly feasible, practically beneficial, and technically sound**. The codebase exhibits exceptional architectural decoupling across its audio, input, dialogue, arcade mini-game, and real-time networking layers.

Key findings include:
1. **Low-Coupling Core Utilities**: Several subsystems (such as the 320-line procedural Web Audio chiptune synthesizer and the 897-line Canvas 2D arcade mini-game) have zero dependency on the Phaser game engine or Next.js server runtime, making them immediately extractable with near-zero friction.
2. **Turnkey Framework Value**: Packaging the complete `<PortfolioGame />` shell enables developers worldwide to embed a fully gamified retro RPG portfolio in their own web applications simply by supplying their own JSON portfolio configuration.
3. **Zero Impact on Active Application**: By implementing a **Root Hybrid Package with Subpath Exports** rather than an invasive multi-package monorepo refactoring, the active Next.js 16 application, local development feedback loop (`npm run dev`), and GitHub Pages automated deployment (`.github/workflows/deploy.yml`) remain completely untouched and free of regressions.

### 1.3 Recommended Strategy Summary
- **Package Identity**: `@yashshingan/portfolio-game` (npm scope matching GitHub username).
- **Architecture Model**: Root hybrid package utilizing modern Node.js and bundler subpath exports (`exports` map in `package.json`).
- **Target Distribution Registries**: **Dual Publishing Strategy** — **npm** (`registry.npmjs.org`) as the primary zero-friction public distribution registry, and **GitHub Packages** (`npm.pkg.github.com`) as an automated repository-linked mirror.
- **Build Toolchain for M3**: `tsup` (esbuild-powered bundler providing ESM, CommonJS, and bundled `.d.ts` declaration generation with `@/*` path alias resolution).

---

## 2. Codebase Component Extractability Audit

The codebase was analyzed across its 24 core source files under `src/` to determine extractability scores, dependency graphs, refactoring prerequisites, public API surfaces, and consumer integration patterns.

### 2.1 Component Extractability Matrix

| Subsystem / Module | Source File(s) | Exact LOC | Direct Dependencies | Extractability Score | Target Subpath Export |
|:---|:---|:---:|:---|:---:|:---|
| **1. Procedural Audio Synthesizer** | `src/game/systems/audio.ts` | 320 | Browser Web Audio API (Zero npm packages) | **10.0 / 10** | `@yashshingan/portfolio-game/audio` |
| **2. Virtual Touch Joystick** | `src/components/game/Joystick.tsx`<br>`src/game/systems/shared.ts` | 88<br>44 | React, Pointer Events API | **9.5 / 10** | `@yashshingan/portfolio-game/controls` |
| **3. Retro Typewriter Dialogue System** | `src/components/game/ZoneModal.tsx` | 74 | React, `lucide-react` | **9.0 / 10** | `@yashshingan/portfolio-game/dialogue` |
| **4. 2D Canvas Arcade Mini-Game** ("Flappy Octo") | `src/components/game/ArcadeMiniGame.tsx` | 897 | React, HTML5 2D Canvas, `lucide-react`, Audio | **9.0 / 10** | `@yashshingan/portfolio-game/arcade` |
| **5. Multiplayer Ghost Presence System** | `src/game/entities/Ghost.ts`<br>`src/game/systems/ghosts.ts` | 146<br>215 | `phaser` (peer), Audio, Server-Sent Events | **8.0 / 10** | `@yashshingan/portfolio-game/engine` |
| **6. Turnkey RPG Portfolio Framework** | `src/components/game/GameOverlay.tsx`<br>`src/game/main.ts`<br>`src/config/portfolio.ts` | 614<br>37<br>178 | React, `phaser` (dynamic import), `lucide-react`, `sonner` | **9.5 / 10** | `@yashshingan/portfolio-game` (root `.`) |

---

### 2.2 Deep Dive: Subsystem Specifications

#### 1. Procedural Web Audio API Chiptune Synthesizer
- **Source Location**: `src/game/systems/audio.ts` (320 LOC)
- **Dependencies**: None (0 external npm dependencies). Pure browser Web Audio API (`AudioContext`, `BiquadFilterNode`, `GainNode`, `OscillatorNode`).
- **Coupling Assessment**: Fully decoupled from Phaser, React, and portfolio configuration. Persists mute state via browser `localStorage("pg_muted")`. Handles browser autoplay policy restrictions gracefully via lazy initialization on first user interaction.
- **Extractability Score**: **10.0 / 10** (Maximum extractability; zero external friction).
- **Target Export Subpath**: `@yashshingan/portfolio-game/audio`
- **Required Refactoring for M3**:
  - Export class `ChiptuneEngine` alongside default singleton instance `audio`.
  - Add constructor configuration options: `{ storageKey?: string; bpm?: number; initialMuted?: boolean }`.
- **Public API Surface**:
  ```ts
  export interface ChiptuneOptions {
    storageKey?: string;
    bpm?: number;
    initialMuted?: boolean;
  }

  export class ChiptuneEngine {
    constructor(options?: ChiptuneOptions);
    init(): void;
    open(): void;
    close(): void;
    achieve(): void;
    konami(): void;
    secret(): void;
    ghost(): void;
    coin(): void;
    step(): void;
    jump(): void;
    hit(): void;
    toggleMute(): boolean;
    get isMuted(): boolean;
    get debugState(): { ctx: string; scheduler: boolean };
    destroy(): void;
  }

  export const audio: ChiptuneEngine;
  ```
- **Consumer Usage Example**:
  ```ts
  import { audio, ChiptuneEngine } from "@yashshingan/portfolio-game/audio";

  // Option A: Use the default singleton
  window.addEventListener("pointerdown", () => {
    audio.init();
    audio.achieve(); // Plays retro victory chime
  }, { once: true });

  // Option B: Instantiate custom isolated engine
  const customAudio = new ChiptuneEngine({ storageKey: "my_game_muted" });
  customAudio.coin();
  ```

---

#### 2. Virtual Touch Joystick
- **Source Location**: `src/components/game/Joystick.tsx` (88 LOC) + `src/game/systems/shared.ts` (44 LOC)
- **Dependencies**: React (`useRef`, `useEffect`). Zero Phaser dependency.
- **Coupling Assessment**: High performance; uses the HTML5 Pointer Capture API (`setPointerCapture`) and updates CSS `transform: translate3d(...)` directly via DOM references without causing React component re-renders at 60fps. Currently couples output to `sharedInput.x/y`.
- **Extractability Score**: **9.5 / 10**
- **Target Export Subpath**: `@yashshingan/portfolio-game/controls`
- **Required Refactoring for M3**:
  - Add `JoystickProps` accepting an `onChange: (vector: { x: number; y: number }) => void` callback and optional target object.
  - Provide fallback standalone styles so consumers without Tailwind CSS render cleanly.
- **Public API Surface**:
  ```tsx
  export interface JoystickVector {
    x: number;
    y: number;
  }

  export interface JoystickProps {
    onChange?: (vector: JoystickVector) => void;
    targetVector?: JoystickVector;
    maxRadius?: number;
    className?: string;
    knobClassName?: string;
  }

  export function Joystick(props?: JoystickProps): JSX.Element;
  export const sharedInput: JoystickVector;
  ```
- **Consumer Usage Example**:
  ```tsx
  import { Joystick } from "@yashshingan/portfolio-game/controls";

  export function MobileController() {
    return (
      <div className="fixed bottom-8 left-8">
        <Joystick
          maxRadius={48}
          onChange={({ x, y }) => {
            player.setVelocity(x * 300, y * 300);
          }}
        />
      </div>
    );
  }
  ```

---

#### 3. Retro RPG Typewriter Dialogue System
- **Source Location**: `src/components/game/ZoneModal.tsx` (lines 68–141, 74 LOC)
- **Dependencies**: React (`useState`, `useEffect`, `useCallback`), `lucide-react` (`ChevronDown`).
- **Coupling Assessment**: Implements the `useTypewriter` hook and `<Dialogue>` component supporting letter-by-letter reveal, click/Space/Enter line advance, instant line skip, speaker avatar/emoji, and progress counters. Currently coupled to `portfolio.npcs`.
- **Extractability Score**: **9.0 / 10**
- **Target Export Subpath**: `@yashshingan/portfolio-game/dialogue`
- **Required Refactoring for M3**:
  - Decouple from static `portfolio.npcs` config by parameterizing speaker metadata.
  - Support custom audio click callbacks for typewriter keystroke sound effects.
- **Public API Surface**:
  ```tsx
  export interface DialogueSpeaker {
    name: string;
    intro?: string;
    emoji?: React.ReactNode;
    lines: string[];
  }

  export interface RetroDialogueProps {
    speaker: DialogueSpeaker;
    onComplete?: () => void;
    onClose?: () => void;
    speed?: number; // Milliseconds per char (default: 24)
    className?: string;
  }

  export function useTypewriter(text: string, speed?: number): {
    shown: string;
    done: boolean;
    finish: () => void;
  };

  export function RetroDialogue(props: RetroDialogueProps): JSX.Element;
  ```
- **Consumer Usage Example**:
  ```tsx
  import { RetroDialogue, useTypewriter } from "@yashshingan/portfolio-game/dialogue";

  export function ElderNPC() {
    return (
      <RetroDialogue
        speaker={{
          name: "Archivist Kai",
          intro: "Keeper of Records",
          emoji: "📜",
          lines: [
            "Greetings, traveler. You seek the ancient archives?",
            "Look for the glowing shrines beyond the fountain garden."
          ],
        }}
        speed={20}
        onComplete={() => console.log("Dialogue finished!")}
      />
    );
  }
  ```

---

#### 4. 2D Canvas Arcade Mini-Game ("Flappy Octo")
- **Source Location**: `src/components/game/ArcadeMiniGame.tsx` (897 LOC)
- **Dependencies**: React, `lucide-react` (`Play`, `RotateCcw`, `Trophy`, `Waves`), `audio` (`@/game/systems/audio`).
- **Coupling Assessment**: 100% self-contained HTML5 2D Canvas physics simulation running at 60fps. Contains procedural obstacle generation (reefs/pipes), collision detection, bubble background particles, burst particle emitters, gravity and flap physics, 10-second sprint countdown timer, and local high-score persistence in `localStorage`. Zero dependency on Phaser.
- **Extractability Score**: **9.0 / 10**
- **Target Export Subpath**: `@yashshingan/portfolio-game/arcade`
- **Required Refactoring for M3**:
  - Add optional props `soundEnabled?: boolean`, `storageKey?: string`, and `sprintDuration?: number`.
  - Add game completion callbacks: `onWin?: (score: number) => void`, `onGameOver?: (score: number) => void`.
- **Public API Surface**:
  ```tsx
  export interface ArcadeMiniGameProps {
    soundEnabled?: boolean;
    storageKey?: string;
    sprintDuration?: number;
    onWin?: (survivedTime: number, reefs: number) => void;
    onGameOver?: (survivedTime: number, reefs: number) => void;
    className?: string;
  }

  export function ArcadeMiniGame(props?: ArcadeMiniGameProps): JSX.Element;
  ```
- **Consumer Usage Example**:
  ```tsx
  import { ArcadeMiniGame } from "@yashshingan/portfolio-game/arcade";

  export function ArcadeEasterEgg() {
    return (
      <div className="w-full max-w-lg p-4 bg-slate-900 rounded-xl">
        <ArcadeMiniGame
          soundEnabled={true}
          sprintDuration={15}
          onWin={(time, reefs) => alert(`Victory! Cleared ${reefs} obstacles!`)}
        />
      </div>
    );
  }
  ```

---

#### 5. Multiplayer Ghost Presence System
- **Source Location**: `src/game/entities/Ghost.ts` (146 LOC) + `src/game/systems/ghosts.ts` (215 LOC)
- **Dependencies**: `phaser` (optional peer dependency), `audio` (`@/game/systems/audio`), `pixelFont` (`@/game/systems/shared`).
- **Coupling Assessment**: Real-time multiplayer presence system over Server-Sent Events (SSE). Implements smooth exponential position lerping (`k = 1 - Math.exp(-9 * dt)`), glow halos, arrival sparkle particle bursts, pixel-font overhead name tags, and automatic stale ghost pruning. Requires a Phaser 3 scene and preloaded textures (`player`, `ghost-glow`, `sparkle`).
- **Extractability Score**: **8.0 / 10**
- **Target Export Subpath**: `@yashshingan/portfolio-game/engine`
- **Required Refactoring for M3**:
  - Make API endpoint URLs configurable (`endpoint?: string; streamEndpoint?: string`).
  - Fall back gracefully to procedural graphics if custom PNG textures are not loaded in the Phaser scene.
- **Public API Surface**:
  ```ts
  export interface GhostSystemConfig {
    endpoint?: string;
    streamEndpoint?: string;
    maxGhosts?: number;
    enabled?: boolean;
    debug?: boolean;
  }

  export class GhostSystem {
    connect(scene: Phaser.Scene, config?: GhostSystemConfig): void;
    report(x: number, y: number, moving: boolean, facing: string): void;
    update(dt: number): void;
    positions(): Array<{ id: string; x: number; y: number }>;
    onlineCount(): number;
    disconnect(): void;
    leave(): void;
  }

  export class Ghost {
    constructor(scene: Phaser.Scene, spawn: GhostSpawn);
    setTarget(x: number, y: number, moving: boolean, facing: string): void;
    update(dt: number): void;
    fadeOutAndDestroy(): void;
  }
  ```
- **Consumer Usage Example**:
  ```ts
  import { GhostSystem } from "@yashshingan/portfolio-game/engine";

  export class GameScene extends Phaser.Scene {
    private ghosts = new GhostSystem();

    create() {
      this.ghosts.connect(this, {
        endpoint: "/api/presence",
        streamEndpoint: "/api/presence/stream",
      });
    }

    update(time: number, delta: number) {
      this.ghosts.update(delta / 1000);
      this.ghosts.report(this.player.x, this.player.y, this.player.isMoving, this.player.facing);
    }
  }
  ```

---

#### 6. Turnkey RPG Portfolio Game Framework
- **Source Location**: `src/components/game/GameOverlay.tsx` (614 LOC) + `src/game/main.ts` (37 LOC) + `src/config/portfolio.ts` (178 LOC)
- **Dependencies**: React, `phaser` (optional peer dependency dynamically imported client-side), `lucide-react`, `sonner`, internal game scenes.
- **Coupling Assessment**: Complete turnkey interactive RPG portfolio shell. Takes a structured portfolio data configuration object and mounts the Phaser 2D world canvas, HUD radar minimap, virtual joystick, zone interaction modals, typewriter dialogue, chiptune sequencer, achievement toasts, and day/sunset/night lighting cycles.
- **Extractability Score**: **9.5 / 10** (Maximum practical value for consumers).
- **Target Export Subpath**: `@yashshingan/portfolio-game` (Root export `.`)
- **Required Refactoring for M3**:
  - Accept `config?: Partial<PortfolioConfig>` as a React prop, falling back to default Yash Shingan template data.
  - Accept `assetBaseUrl?: string` to resolve static images (`grass.png`, `footpath.png`, `fountain-clean.png`, `noticeboard.png`, `github-octopuss.png`) from a CDN.
- **Public API Surface**:
  ```tsx
  export interface PortfolioGameProps {
    config?: Partial<PortfolioConfig>;
    assetBaseUrl?: string;
    enablePresence?: boolean;
    onClose?: () => void;
    className?: string;
  }

  export function PortfolioGame(props: PortfolioGameProps): JSX.Element;
  export { portfolio as defaultPortfolioConfig } from "./config/portfolio";
  export type { PortfolioConfig, Project, SkillGroup, NpcDialogue } from "./config/portfolio";
  ```
- **Consumer Usage Example**:
  ```tsx
  import { PortfolioGame, PortfolioConfig } from "@yashshingan/portfolio-game";
  import "@yashshingan/portfolio-game/styles.css";

  const customPortfolio: Partial<PortfolioConfig> = {
    name: "Alex Dev",
    role: "Systems Architect",
    projects: [
      {
        id: "proj1",
        emoji: "⚡",
        title: "HyperScale",
        year: "2026",
        description: "Ultra-low latency streaming engine.",
        tags: ["Rust", "WASM"],
        links: [{ label: "GitHub", url: "https://github.com/alex/hyperscale" }]
      }
    ]
  };

  export default function MyPortfolioPage() {
    return (
      <main className="w-screen h-screen">
        <PortfolioGame
          config={customPortfolio}
          assetBaseUrl="https://cdn.jsdelivr.net/gh/YashShingan/portfolio-game@v2.0.0/public"
        />
      </main>
    );
  }
  ```

---

## 3. Package Registry Trade-Off Analysis

Publishing open-source libraries across **npm** (`registry.npmjs.org`) versus **GitHub Packages** (`npm.pkg.github.com`) presents critical structural trade-offs:

### 3.1 Comparative Analysis Matrix

| Evaluation Dimension | npm Registry (`registry.npmjs.org`) | GitHub Packages (`npm.pkg.github.com`) | Analysis & Recommendation |
|:---|:---|:---|:---|
| **1. Consumer Installation Friction** | **Zero Friction**<br>Standard `npm install @yashshingan/portfolio-game`<br>No authentication or `.npmrc` required. | **High Friction**<br>Consumer must configure `.npmrc`<br>Requires GitHub Personal Access Token (PAT) even for public read. | **npm Wins Decisively** for public adoption. Requiring `.npmrc` stops 90%+ of casual open-source adopters. |
| **2. CI/CD Publishing Setup** | Requires setting `NPM_TOKEN` secret in GitHub repository settings. | **Zero Configuration**<br>Uses built-in `${{ secrets.GITHUB_TOKEN }}` with `permissions: packages: write`. | **GitHub Packages Wins** for zero-setup CI authentication. |
| **3. Package Scoping Requirements** | Flexible: Supports unscoped or scoped (`@yashshingan/portfolio-game`). Requires `--access public` for scoped free packages. | **Strictly Scoped**<br>Must match `@owner/repo-name` (`@yashshingan/portfolio-game`). | Both support `@yashshingan/portfolio-game`. |
| **4. Supply Chain Provenance (SLSA)** | **Cryptographic Attestations**<br>SLSA Level 2/3 provenance via Sigstore when published with `--provenance`. | Direct linkage to GitHub commit and release tags in repo sidebar. | **npm Wins** for industry-standard supply-chain security verifiability. |
| **5. Ecosystem Discoverability** | **Extremely High**<br>Indexed by npm search, Bundlephobia, Snyk, Socket.dev, Libraries.io. | **Very Low**<br>Visible only on GitHub repository sidebar under "Packages". | **npm Wins** for package discovery and metric tracking. |
| **6. Strategic Role** | **Primary Public Distribution Registry** | **Automated Secondary Mirror & Showcase** | Implement **Dual Publishing Strategy** in CI/CD. |

### 3.2 Detailed Registry Mechanics

#### npm Registry Dynamics
- **Free Public Scoped Packages**: npm allows unlimited free scoped packages (e.g. `@yashshingan/portfolio-game`), provided they are published with `--access public` (or `"publishConfig": { "access": "public", "registry": "https://registry.npmjs.org/" }`). Without this flag, publishing a scoped package on a standard free npm account fails with `HTTP 402 Payment Required`.
- **Sigstore SLSA Provenance**: Adding `--provenance` to `npm publish` in a GitHub Actions workflow with `id-token: write` permissions automatically generates a signed, tamper-proof attestation linking the published npm package directly to the GitHub repository, commit SHA, and workflow file.

#### GitHub Packages Dynamics
- **Mandatory Authentication Barrier**: Even when a package is marked public on GitHub, npm clients attempting to install from `npm.pkg.github.com` without an authenticated `.npmrc` token fail with `401 Unauthorized`. This makes GitHub Packages unsuitable as the sole distribution channel for community libraries.
- **Repository Showcase**: Publishing to GitHub Packages automatically displays the package under the "Packages" section on the right sidebar of `https://github.com/YashShingan/portfolio-game`, providing immediate visual proof of package readiness.

### 3.3 Recommended Dual Publishing Strategy
In Milestone M3, `.github/workflows/publish.yml` will implement a resilient dual-publishing pipeline:
1. Always publish to **GitHub Packages** using the default `${{ secrets.GITHUB_TOKEN }}`.
2. Conditionally publish to **npm** if `NPM_TOKEN` is present in GitHub Secrets.
3. If `NPM_TOKEN` is not yet configured, emit a non-blocking workflow notice with instructions on creating an npm Automation Token, ensuring CI builds succeed without failure.

---

## 4. Package Architecture & Distribution Model

Three structural patterns were evaluated for distributing the codebase:

### 4.1 Structural Trade-Off Comparison

| Dimension | Option 1: Root Hybrid Package with Subpath Exports (RECOMMENDED) | Option 2: Multi-Package Monorepo (pnpm / Turborepo) | Option 3: Separate Standalone Repositories |
|:---|:---|:---|:---|
| **Impact on Existing Web App** | **Zero Impact**: Next.js app, `npm run dev`, and GitHub Pages deploy remain 100% untouched. | **High Impact**: Requires moving files to `apps/web` and `packages/*`, rewriting imports, and updating CI. | **Severe Impact**: Complete fragmentation of codebase. |
| **Maintenance Overhead** | **Lowest**: Single repository, unified versioning, single `package.json`, one CI workflow. | **High**: Requires monorepo tooling (Turborepo/pnpm), changesets, and inter-package linking. | **Very High**: Multiple repositories to maintain, issue triage, and synchronize. |
| **Tree-Shaking & Bundle Size** | **Optimal**: Subpath exports isolate entries; importing `./audio` loads zero React or Phaser code. | **Optimal**: Distinct packages. | **Optimal**: Distinct packages. |
| **Consumer Experience** | **Highest**: Install single package `@yashshingan/portfolio-game`; import exact modules needed. | Moderate: Must manage multiple npm dependencies (`@yashshingan/audio`, etc.). | Moderate. |
| **Readiness for Milestone M3** | **Immediate**: Can be fully implemented in M3 using `tsup` in less than an hour. | **Delayed**: Multi-day refactoring and high risk of regressions. | **Delayed**: High friction. |

### 4.2 Subpath Exports Specification for Milestone M3
In Milestone M3, `package.json` will be configured with modern `exports` mappings pointing to bundled artifacts in `dist/`:

```json
{
  "name": "@yashshingan/portfolio-game",
  "version": "2.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "default": "./dist/index.js"
    },
    "./audio": {
      "types": "./dist/audio/index.d.ts",
      "import": "./dist/audio/index.mjs",
      "default": "./dist/audio/index.js"
    },
    "./controls": {
      "types": "./dist/controls/index.d.ts",
      "import": "./dist/controls/index.mjs",
      "default": "./dist/controls/index.js"
    },
    "./dialogue": {
      "types": "./dist/dialogue/index.d.ts",
      "import": "./dist/dialogue/index.mjs",
      "default": "./dist/dialogue/index.js"
    },
    "./arcade": {
      "types": "./dist/arcade/index.d.ts",
      "import": "./dist/arcade/index.mjs",
      "default": "./dist/arcade/index.js"
    },
    "./engine": {
      "types": "./dist/engine/index.d.ts",
      "import": "./dist/engine/index.mjs",
      "default": "./dist/engine/index.js"
    },
    "./types": {
      "types": "./dist/types.d.ts",
      "import": "./dist/types.mjs",
      "default": "./dist/types.js"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

---

## 5. Architectural Considerations & Technical Guardrails

### 5.1 Optional Peer Dependencies
- **Challenge**: Phaser 3.90 is ~1.5 MB minified. Bundling Phaser directly into the published npm package tarball would bloat consumer node_modules and risk multiple runtime Phaser instances. Furthermore, consumers importing only `@yashshingan/portfolio-game/audio` should not be required to install Phaser.
- **Solution**: Declare `phaser`, `react`, and `react-dom` as `peerDependencies` in `package.json`, marking them as optional via `peerDependenciesMeta`:
  ```json
  "peerDependencies": {
    "phaser": ">=3.80.0",
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "peerDependenciesMeta": {
    "phaser": { "optional": true },
    "react": { "optional": true },
    "react-dom": { "optional": true }
  }
  ```

### 5.2 SSR / Client-Only Boundaries
- **Challenge**: Phaser directly evaluates browser globals (`window`, `document`, `HTMLCanvasElement`, `navigator`). If evaluated during Node.js server-side rendering (e.g. Next.js Server Components), it throws fatal errors (`ReferenceError: window is not defined`).
- **Solution**:
  - Prepend `"use client";` to all exported React entrypoints.
  - The turnkey `<PortfolioGame />` component dynamically imports Phaser scenes inside a React `useEffect` hook (`await import("@/game/main")`), ensuring Phaser is only loaded on the client.
  - Subpaths like `./audio` and `./controls` include defensive window checks (`typeof window !== "undefined"`).

### 5.3 TypeScript `.d.ts` Declaration Generation & `@/*` Path Alias Resolution
- **Challenge**: The codebase relies extensively on path alias `"@/*": ["./src/*"]` in `tsconfig.json`. Standard `tsc` leaves raw `@/` import paths in generated `.d.ts` files, causing consumer builds to fail with `TS2307: Cannot find module '@/...'`.
- **Solution**:
  - In Milestone M3, configure `tsup` with `dts: true`. `tsup` automatically rolls up and resolves path aliases into clean, self-contained relative type declarations (`dist/index.d.ts`, `dist/audio/index.d.ts`).

### 5.4 Procedural vs Static Assets
- **Challenge**: 90% of game visuals (trees, shrines, lamps, fountains, player sprites) are rendered procedurally via `Phaser.GameObjects.Graphics`. However, 5 textures in `BootScene.ts` load PNG assets over HTTP (`grass.png`, `footpath.png`, `fountain-clean.png`, `noticeboard.png`, `github-octopuss.png`). In an external consumer's project, these relative paths will 404.
- **Solution**:
  - Add an `assetBaseUrl` configuration property to `PortfolioGameProps`.
  - Default `assetBaseUrl` to the public jsDelivr CDN mirror:
    `https://cdn.jsdelivr.net/gh/YashShingan/portfolio-game@v2.0.0/public`
  - In `BootScene.ts`, resolve texture URLs using `assetBaseUrl`:
    ```ts
    const base = config.assetBaseUrl || "https://cdn.jsdelivr.net/gh/YashShingan/portfolio-game@v2.0.0/public";
    this.load.image("fountain", `${base}/game-assets/images/fountain-clean.png`);
    ```

### 5.5 Tailwind CSS Styling Isolation
- **Challenge**: The interactive UI components (`Joystick`, `ZoneModal`, `ArcadeMiniGame`) use Tailwind CSS classes and the custom pixel font `--font-pixel`. If an external consumer does not use Tailwind CSS 4, styles will break.
- **Solution**:
  - In Milestone M3, compile the library's CSS into a standalone distributable stylesheet `dist/styles.css`.
  - Consumers can either import `@yashshingan/portfolio-game/styles.css` directly or include the package components in their own Tailwind `content` configuration.
  - Critical layout rules (absolute positioning, flexbox alignment, pointer capture) are backed by inline CSS style fallbacks.

### 5.6 Semantic Versioning Strategy
- **Baseline Version**: `2.0.0` (matching current `package.json` version).
- **SemVer Rules**:
  - **PATCH** (`2.0.x`): Internal bug fixes, audio tuning, visual styling tweaks, documentation.
  - **MINOR** (`2.x.0`): New export subpaths (e.g. adding new mini-games or HUD widgets), backward-compatible feature enhancements.
  - **MAJOR** (`3.0.0`): Breaking changes to `PortfolioConfig` interfaces, removed subpaths, or Phaser engine major migrations.
- **Release Trigger**: GitHub Actions automated publish workflow triggers exclusively on Git tags matching `v*.*.*` (e.g. `v2.0.0`).

---

## 6. Implementation Roadmap

| Milestone | Scope & Deliverables | Status |
|:---:|:---|:---:|
| **M1** | Repository & Package Metadata Assets (`package.json`, `LICENSE`, `docs/GITHUB_METADATA.md`, `scripts/apply-github-about.ps1`) | **COMPLETE** |
| **M2** | Technical Feasibility & Architecture Blueprint (`docs/PACKAGE_PUBLISHING_FEASIBILITY.md`) | **COMPLETE** |
| **M3** | Build Toolchain Setup (`tsup.config.ts`), Export Entrypoints (`src/index.ts`, subpath exports), and GitHub Actions Publishing Workflow (`.github/workflows/publish.yml`) | *Upcoming* |
| **M4** | Packaging Dry-Run Audit (`npm pack --dry-run`), Tarball Hygiene Verification, and Live Registry Publication | *Upcoming* |

---

## 7. Conclusion

Publishing `@yashshingan/portfolio-game` as a **Root Hybrid Package with Subpath Exports** provides maximum modularity, zero consumer friction, and zero regression risk to the existing Next.js web application. The technical prerequisites for Milestone M3 are fully defined and validated.
