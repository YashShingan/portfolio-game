# Project Worklog

---
Task ID: 1
Agent: main
Task: Portfolio Game 2.0 — complete rewrite of github.com/YashShingan/portfolio-game as Next.js 16 + Phaser 3 app

Work Log:
- Analyzed original repo (main.js, player.js, paths.js, zones.js, utils.js) — identified core flaws: world=viewport, rebuild-on-resize, per-frame DOM writes, keyboard-only, template content, runtime fountain pixel surgery, zero SEO
- Initialized fullstack env (Next.js 16 + TS + Tailwind 4 + shadcn), installed phaser@3.90.0
- Downloaded 7 original assets from repo into public/game-assets/ (grass, footpath, roadturn, cornerjoin, github-octopuss spritesheet, fountain, noticeboard)
- Built-time chroma-key of fountain.png (border-connected BFS flood fill — actual bg was BLACK, not brown as old code assumed) → fountain-clean.png

Stage Summary:
- Assets preserved & cleaned at build time; ready to build game architecture (fixed 3000x3000 world, event-driven interactions, mobile joystick, procedural chiptune audio, achievements)

---
Task ID: 2
Agent: main
Task: Build, verify and harden Portfolio Game 2.0 (Next.js 16 + Phaser 3.90)

Work Log:
- Built full game architecture: BootScene (loading bar + procedural textures), WorldScene (fixed 3000x3000 world built once, camera follow, diff-based proximity prompts, resize=zoom-only), Player/NPC entities, event bus bridge to React
- Built React shell: GameOverlay (HUD, mute, achievements panel), ZoneModal (7 content kinds incl. RPG dialogue with typewriter), Joystick, SEO landing page with JSON-LD, pixel font via next/font (Press Start 2P) with runtime CSS-var lookup for canvas text
- Browser-verified with agent-browser: landing SEO content, game boot, WASD movement, first-steps achievement, proximity prompts, E-interaction with full NPC dialogue flow (open → 4 lines typewriter → close), konami code, achievements panel (6 defs, 2 unlocked), mute toggle, exit, mobile 390px layout (no overflow)
- Fixed real bugs found during verification:
  1. Phaser ESM has no default export → switched all game files to `import * as Phaser`
  2. E-key per-key event unreliable → switched to addKey("E") + JustDown polling drained every frame
  3. undefined vs null diff bug in proximity prompt (per-frame emit spam) → coalesce with ?? null
  4. audio.open() threw in WebAudio-broken environments (NaN currentTime + exponentialRamp) killing interactions → hardened entire audio module (finite guards, try/catch, linearRamp) and moved emit BEFORE audio: gameplay never depends on audio health
  5. Konami tracker on Phaser keydown missed repeat-suppressed events → moved to raw window listener
  6. Touch detection extended: pointer:coarse OR maxTouchPoints>1
- Lint clean; dev.log clean (all 200s)

Stage Summary:
- Deliverable: fully playable, browser-verified portfolio game at / (landing) with full-screen game overlay
- Content editable in src/config/portfolio.ts; assets from original repo in public/game-assets/ with build-time fountain chroma-key (scripts/process-fountain.js)

---
Task ID: 3
Agent: main
Task: Fix messed-up roads, add ghost visitors (multiplayer presence), minimap, and bug sweep per user feedback

Work Log:
- Diagnosed road mess via VLM on user screenshot + tile pixel analysis: tileSprites tiling from different origins (grid seams at junctions), rotated-tileSprite artifacts, wallpaper repetition, roadturn/cornerjoin were OPAQUE noise squares (not real corners), hard rectangular edges, dead-end trails
- NEW src/game/systems/ground.ts: paints ENTIRE ground (grass+paths+plaza) into one 375x375 canvas (1 texel = 8 world px) added as ONE NEAREST-filtered texture — layered masks (paths cut through plaza as dirt gates), rounded path caps, dithered/eroded organic edges, smooth low-frequency tones (smoothRamp kills static), flagstone plaza (grout+curb+corner radius), stone ring under fountain, dirt pads under off-path props, pale chevrons at secret trail branch; palettes sampled from ORIGINAL v1 grass/footpath tiles; worn centerline effect
- Fixed own RGBA indexing bug during verification (put() needs idx*4)
- GHOST VISITORS: src/lib/presence-store.ts (globalThis Map, TTL 12s, deterministic generated names "Curious Puffin" style), POST /api/presence (upsert/leave), GET /api/presence/stream (SSE snapshots every 700ms); client src/game/systems/ghosts.ts (EventSource + throttled 240ms reports + 2.5s idle heartbeat, pagehide sendBeacon for instant removal on hard close, graceful leave on scene shutdown), src/game/entities/Ghost.ts (no-physics sprite, tint 0xa8d8ff, alpha fade, lerp 1-exp(-9dt), walk anim by distance, name tags, ghost-glow additive halo, spawn sparkle + soft chime audio.ghost())
- MINIMAP: src/components/game/Minimap.tsx — 150px canvas, static roads/plaza/POI dots from world.ts, player white pulse dot + cyan ghost dots via pg:tick (~4Hz), rAF-coalesced redraw; hidden during modals; 92px on mobile
- WorldScene: replaced buildGround/buildPlaza/buildPaths with addGroundImage; ghost connect/report/update/leave; pg:tick + diff-based pg:presence emits; CHEST_TREES framing the secret clearing via new addTree() helper
- Bug fixes: (1) Player never setFlipX walking left (octopus faces RIGHT, verified via VLM) — moonwalk fixed, facing persists idle; (2) secret chest was in PLAIN SIGHT on the projects walkway, vertical trail dead-ended into grass — chest moved to (2668,640) at trail end, trail lengthened, CLEAR_ZONES updated, framing trees + painted chevron hint added; (3) Secret modal had ZERO keyboard support (Escape/E dead) — now same contract as Dialogue (Escape closes, E/Enter/Space advance); (4) NOTE.A5 missing from note map — open()/close() interaction chimes silently no-op'd since launch (undefined freq guarded) — A5 added, sounds now play; (5) roadturn/cornerjoin loads removed
- HUD: presence chip "👻 N GHOSTS HERE" (animate-pulse) under title chip; landing page: 7th V1→V2 card about ghosts + hero line updated
- Dev-only window.__pg debug handle (NODE_ENV guarded) for camera/sprite/scene introspection in tests
- VERIFIED with agent-browser 2 parallel sessions: whole-world zoomed VLM PASS (organic paths, integrated plaza, secret clearing readable); ghost appears with name tag+glow, tracks B walking east in real time, presence chip 1 GHOST HERE, minimap cyan dot (99 cyan px crop-verified), ghost vanishes ≤2.5s after B hard-reloads (pagehide beacon) and after graceful exit; NPC dialogue open→Escape→movement resumes; chest open at NEW location → curious achievement + confetti + Escape closes (fix verified); flip logic verified (left=true, right=false, persists idle); achievements panel 6 items + minimap hidden while open; mobile 390px: no overflow, minimap 92px (joystick path unchanged from prior verified session — detection runs at page mount, before test stubs)
- Test-harness notes: agent-browser key events carry keyCode 0 (Phaser maps by keyCode) — used synthetic KeyboardEvent dispatch on canvas instead; headless background tabs throttle setInterval ~100ms → typewriter appears slow in automation only, not a bug
- tsc --noEmit clean (app code), eslint clean, zero page errors both sessions, dev.log clean

Stage Summary:
- Roads: from "messed up patchwork" to VLM-PASS organic painted world (one draw call, zero seams)
- Ghost visitors feature complete end-to-end (SSE presence, rendered ghosts, HUD chip, minimap, chime, beacon cleanup)
- 5 real bugs fixed (moonwalk, chest-in-plain-sight + dead-end trail, secret-modal keyboard dead-end, silent open/close SFX, corner-stamp artifacts)
- All flows browser-verified with two simultaneous visitors

---
Task ID: 4
Agent: main
Task: User-feedback fix pass — mobile joystick, music-stops-on-exit, fountain "shower" artifact, tree size, AI-ish landing line

Work Log:
- MUSIC ON EXIT: GameOverlay cleanup destroyed the Phaser game but never the audio singleton — chiptune scheduler (setInterval) played forever. audio.destroy() now called on close; destroy() rewritten: captures ctx+master, nulls all refs, fades master gain to 0 (~250ms, no hard click), closes ctx after 350ms; re-entry builds a fresh context. Added dev-only __pgAudio() introspection.
- MOBILE JOYSTICK: static detection (pointer:coarse || maxTouchPoints>1) can be false in real webviews — REPRODUCED in agent-browser iPhone-14 emulation (coarse:false, maxTouch:0 → no joystick, no E button). Fix: broadened static check (adds any-pointer:coarse) + bulletproof first-touch fallback — one-shot window listener flips touch UI on the first real touchstart/touch-pointerdown anywhere in the page session (catches the tap on ENTER THE GAME itself).
- FOUNTAIN SHOWER: probe-fountain.py mapped fountain-clean.png geometry (crown y-108, upper lip y-14, pool surface +30, ±95 wide). Old jet (origin y-60, speed 60-120, life 900ms) flung droplets up that died mid-face = the "random shower". New 4-part water story anchored to real sprite: (1) tight crown jet (speed 70-100, dies inside crown tier), (2) THE POUR — droplets from upper-basin lip via Line emitZone falling down the face into the pool, (3) pool shimmer (Rect emitZone, ADD), (4) 3 staggered expanding ripple rings (new "ripple" texture). Phaser d.ts mistypes Geom shapes vs RandomZoneSource — bridged with contained zoneSource() cast.
- TREES: regrew textures 96×124 → 150×200 (3-tone canopy, shaded trunk, root flare); per-tree scale variance 0.92-1.12; collider/shadow re-anchored to new trunk base (+78/+84).
- LANDING: removed "6 achievements · 2 NPCs · live ghost visitors · 1 secret most people never find" line + unused Trophy/ACHIEVEMENTS imports.
- VERIFIED (agent-browser): music lifecycle enter→running/exit→none/re-enter→running/exit→none; mobile session reproduced missing controls then first-touch → joystick+E appear, VLM PASS on 390px shot, drag moved player 430→804, knob re-centers; fountain VLM PASS (pour stream visible, zero stray spray, ripples); trees VLM PASS (2-2.5× player height); desktop WASD+E regression PASS via synthetic keyEvents (harness keyCode-0 quirk documented in Task 3); zero page errors; tsc/eslint clean.
- Screenshot framing lesson: player-teleport framing must account for camera zoom (0.82-1.2) or the target ends half out of frame — set explicit viewport+zoom before verifying visuals.

Stage Summary:
- All 5 user-reported items fixed and browser-verified; music now dies on exit, touch controls appear on any device that can produce a touch at all, fountain pours instead of showers, trees 2-2.5× player, landing line gone.
- Upgrade suggestions delivered to user: ambient audio zones, day/night cycle, pet companion, ghost emotes, photo mode, visitor counter, fast-travel signposts, gamepad support, achievement chain, OG share image.
