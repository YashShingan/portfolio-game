import * as Phaser from "phaser";
import { portfolio } from "@/config/portfolio";
import { emitGameEvent, onGameEvent } from "@/game/systems/events";
import { gameRuntime, pixelFont, sharedInput } from "@/game/systems/shared";
import { unlock } from "@/game/systems/achievements";
import { audio } from "@/game/systems/audio";
import { addGroundImage } from "@/game/systems/ground";
import { ghosts } from "@/game/systems/ghosts";
import { Player } from "@/game/entities/Player";
import { NPC } from "@/game/entities/NPC";
import {
  CHEST_TREES,
  CLEAR_ZONES,
  LABELS,
  PLAZA,
  POINTS,
  PROJECT_BOARDS,
  SKILL_PATCHES,
  SPAWN,
  WORLD,
  mulberry32,
  zoomFor,
} from "@/game/data/world";
import type { ZonePayload } from "@/game/types";

type District = "about" | "projects" | "skills" | "contact";

interface Interactable {
  id: string;
  x: number;
  y: number;
  r: number;
  label: string;
  district?: District;
  payload: ZonePayload;
}

const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

/**
 * Phaser's bundled d.ts mistypes Geom shapes against RandomZoneSource
 * (its own runtime examples pass Geom shapes directly) — this is the one
 * contained, documented cast to bridge that gap.
 */
const zoneSource = (shape: Phaser.Geom.Line | Phaser.Geom.Rectangle) =>
  shape as unknown as Phaser.Types.GameObjects.Particles.RandomZoneSource;

/**
 * WorldScene — builds the whole world ONCE in create(), then never
 * rebuilds anything. Resizing the window only adjusts camera zoom.
 * Interactions are diff-based: the event bus fires only when the
 * nearest interactable CHANGES, never per-frame.
 */
export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private statics!: Phaser.Physics.Arcade.StaticGroup;
  private npcs: NPC[] = [];
  private interactables: Interactable[] = [];
  private activeId: string | null = null;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private moveUnlocked = false;
  private visitedDistricts = new Set<District>();
  private readProjects = new Set<string>();
  private talkedNpcs = new Set<string>();
  private konamiIndex = 0;
  private konamiListener: (e: KeyboardEvent) => void = () => {};
  private offBusCleanups: Array<() => void> = [];
  private tickAcc = 0;
  private lastPresence = 0;
  private lastFacing: "left" | "right" = "right";

  constructor() {
    super("WorldScene");
  }

  create(): void {
    // FIXED world bounds — the world does not care about the window
    this.physics.world.setBounds(0, 0, WORLD.width, WORLD.height);
    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);

    // One static group for ALL collision bodies (trees, props, fountain...)
    this.statics = this.physics.add.staticGroup();

    // ONE painted ground texture: grass, paths (rounded caps, dithered
    // edges), flagstone plaza, fountain ring — no more tileSprite seams
    addGroundImage(this);
    this.scatterDecor();
    this.buildProps();
    this.buildNpcs();
    this.buildInteractables();
    this.buildAtmosphere();

    // Player + colliders
    this.player = new Player(this, SPAWN.x, SPAWN.y);
    this.physics.add.collider(this.player.sprite, this.statics);
    this.npcs.forEach((n) => this.physics.add.collider(this.player.sprite, n.sprite));

    // Ghost visitors — see everyone else wandering the world
    ghosts.connect(this);

    // Camera — the whole point of a scrolling world
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);
    this.cameras.main.setZoom(zoomFor(this.scale.width, this.scale.height));
    this.cameras.main.fadeIn(700, 15, 25, 15);

    // Input
    this.keys = this.input.keyboard!.addKeys(
      "W,A,S,D,UP,DOWN,LEFT,RIGHT",
    ) as Record<string, Phaser.Input.Keyboard.Key>;
    this.interactKey = this.input.keyboard!.addKey("E");
    this.input.keyboard!.addCapture("W,A,S,D,UP,DOWN,LEFT,RIGHT,E");
    // Konami tracked on the raw window stream — immune to Phaser's
    // queue/repeat filtering (a held key's "down" can be suppressed as a repeat).
    this.konamiListener = (e: KeyboardEvent) => this.trackKonami(e.keyCode);
    window.addEventListener("keydown", this.konamiListener);

    // THE resize fix: adjust zoom only. No rebuilds. Ever.
    this.scale.on(
      "resize",
      (gs: Phaser.Structs.Size) => {
        this.cameras.main.setZoom(zoomFor(gs.width, gs.height));
      },
      this,
    );

    // React → game commands
    this.offBusCleanups.push(
      onGameEvent("pg:zone-close", () => {
        gameRuntime.modalOpen = false;
        audio.close();
      }),
    );

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.offBusCleanups.forEach((off) => off());
      this.scale.off("resize");
      window.removeEventListener("keydown", this.konamiListener);
      ghosts.leave();
    });

    emitGameEvent("pg:ready", undefined);
  }

  // ------------------------------------------------------------------
  // World building (runs ONCE)
  // ------------------------------------------------------------------

  private addTree(x: number, y: number, rng: () => number): void {
    const key = rng() > 0.5 ? "tree1" : "tree2";
    // Size variance so forests don't look like a cloned sprite wall
    const scale = 0.92 + rng() * 0.2;
    this.add.image(x, y, key).setDepth(y + 84).setScale(scale);
    this.add.image(x, y + 84, "shadow").setDepth(y + 83).setScale(1);
    // Static collider on the trunk only
    const body = this.add.rectangle(x, y + 78, 30, 14, 0x000000, 0);
    this.statics.add(body);
    body.setDepth(-200);
  }

  private scatterDecor(): void {
    const rng = mulberry32(20261024);
    const inClear = (x: number, y: number, pad: number) =>
      CLEAR_ZONES.some((z) => x >= z.x - pad && x <= z.x + z.w + pad && y >= z.y - pad && y <= z.y + z.h + pad);

    const trees: Array<{ x: number; y: number }> = [];
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

    // Deliberate trees framing the secret chest clearing
    // (the trail enters from the north, the chest sits in the nook)
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
      this.add
        .image(x, y, `flower${Math.floor(rng() * 3)}`)
        .setDepth(-350)
        .setScale(0.9 + rng() * 0.9);
    }
  }

  private buildProps(): void {
    // --- Fountain (About) ---
    // Fountain base touches the ground at y = POINTS.fountain.y + 98 (1598).
    // Using 1598 as depth ensures proper 2.5D y-sorting:
    // When player feet Y < 1598 (north), player is behind the fountain statue.
    // When player feet Y > 1598 (south), player is in front of the basin rim.
    const fountainDepth = POINTS.fountain.y + 98;
    const f = this.add.image(POINTS.fountain.x, POINTS.fountain.y, "fountain");
    f.setScale(0.72).setDepth(fountainDepth);
    this.add
      .image(POINTS.fountain.x, POINTS.fountain.y + 95, "shadow")
      .setDepth(fountainDepth - 6)
      .setScale(1.6, 1.1);

    // Precise 4-tier colliders tightly enclosing the oval water basin
    // (from y=1480 to 1598, leaving the entire north and south plaza pavement clear):
    const b1 = this.add.rectangle(POINTS.fountain.x, POINTS.fountain.y - 5, 170, 30, 0, 0); // 1480..1510
    const b2 = this.add.rectangle(POINTS.fountain.x, POINTS.fountain.y + 25, 210, 30, 0, 0); // 1510..1540
    const b3 = this.add.rectangle(POINTS.fountain.x, POINTS.fountain.y + 55, 210, 30, 0, 0); // 1540..1570
    const b4 = this.add.rectangle(POINTS.fountain.x, POINTS.fountain.y + 84, 150, 28, 0, 0); // 1570..1598
    [b1, b2, b3, b4].forEach((b) => {
      this.statics.add(b);
      b.setDepth(-200);
    });

    // Fountain glow
    const glow = this.add
      .circle(POINTS.fountain.x, POINTS.fountain.y - 20, 80, 0xffffff, 0.12)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(fountainDepth + 3);
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.07, to: 0.3 },
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // --- Project Exhibition Showcases ---
    PROJECT_BOARDS.forEach((b, i) => {
      const project = portfolio.projects[i];
      const emoji = project?.emoji ?? "📋";
      const kioskKey = `proj-kiosk-${i}`;

      // Ground shadow & interactive halo
      this.add
        .image(b.x, b.y + 50, "shadow")
        .setScale(1.6, 1)
        .setDepth(b.y + 48);
      const halo = this.add
        .image(b.x, b.y + 54, "proj-halo")
        .setDepth(b.y + 49)
        .setAlpha(0.6);
      this.tweens.add({
        targets: halo,
        alpha: { from: 0.35, to: 0.85 },
        scaleX: { from: 0.95, to: 1.08 },
        duration: 1600 + i * 200,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      // The distinctive showcase kiosk
      this.add.image(b.x, b.y, kioskKey).setDepth(b.y + 54);

      // Solid base collider (resting along north edge of walkway)
      const body = this.add.rectangle(b.x, b.y + 44, 88, 22, 0, 0);
      this.statics.add(body);
      body.setDepth(-200);

      // Floating interactive badge with project title & emoji
      const badge = this.add.container(b.x, b.y - 66).setDepth(2990);
      const plaqueW = Math.min(184, Math.max(126, project.title.length * 8 + 48));
      const badgeBg = this.add
        .graphics()
        .fillStyle(0x141008, 0.94)
        .fillRoundedRect(-plaqueW / 2, -18, plaqueW, 36, 8)
        .lineStyle(2, 0xe8c170, 0.95)
        .strokeRoundedRect(-plaqueW / 2, -18, plaqueW, 36, 8);
      const icon = this.add.text(-plaqueW / 2 + 18, 0, emoji, { fontSize: "18px" }).setOrigin(0.5);
      const title = this.add
        .text(-plaqueW / 2 + 34, 0, project.title, {
          fontFamily: pixelFont(),
          fontSize: "10px",
          color: "#f5e6c8",
        })
        .setOrigin(0, 0.5)
        .setResolution(2);
      badge.add([badgeBg, icon, title]);

      this.tweens.add({
        targets: badge,
        y: b.y - 74,
        duration: 1400 + i * 160,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });

    // --- Skills Garden / Arboretum ---
    const gardenCx = 2404;
    const gardenCy = 1500;

    // Central Sundial Centerpiece
    this.add.image(gardenCx, gardenCy, "garden-sundial").setDepth(gardenCy + 18);
    this.add.image(gardenCx, gardenCy + 18, "shadow").setScale(0.8, 0.6).setDepth(gardenCy + 15);
    const sundialBody = this.add.rectangle(gardenCx, gardenCy + 8, 32, 22, 0, 0);
    this.statics.add(sundialBody);
    sundialBody.setDepth(-200);

    // Park benches placed in courtyard corners (off walkways)
    const benches = [
      { x: gardenCx - 88, y: 1400 },
      { x: gardenCx - 88, y: 1600 },
    ];
    benches.forEach((bn) => {
      this.add.image(bn.x, bn.y, "garden-bench").setDepth(bn.y + 20);
      this.add.image(bn.x, bn.y + 16, "shadow").setScale(1, 0.7).setDepth(bn.y + 14);
      const bBody = this.add.rectangle(bn.x, bn.y + 10, 52, 18, 0, 0);
      this.statics.add(bBody);
      bBody.setDepth(-200);
    });

    // Decorative trimmed boxwood hedges framing garden paths & borders
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
      { x: gardenCx + 90, y: 1780 },
    ];
    hedges.forEach((h) => {
      this.add.image(h.x, h.y, "garden-hedge").setDepth(h.y + 14);
      const hBody = this.add.rectangle(h.x, h.y + 6, 40, 16, 0, 0);
      this.statics.add(hBody);
      hBody.setDepth(-200);
    });

    // Wrought-iron garden lamps with soft glowing lanterns
    const lamps = [
      { x: 2160, y: 1390 },
      { x: 2160, y: 1610 },
      { x: gardenCx + 110, y: 1390 },
      { x: gardenCx + 110, y: 1610 },
      { x: gardenCx - 90, y: 1270 },
      { x: gardenCx + 90, y: 1270 },
      { x: gardenCx - 90, y: 1730 },
      { x: gardenCx + 90, y: 1730 },
    ];
    lamps.forEach((lamp) => {
      this.add.image(lamp.x, lamp.y, "garden-lamp").setDepth(lamp.y + 34);
      this.add.image(lamp.x, lamp.y + 30, "shadow").setScale(0.5, 0.4).setDepth(lamp.y + 28);
      const lBody = this.add.rectangle(lamp.x, lamp.y + 28, 16, 12, 0, 0);
      this.statics.add(lBody);
      lBody.setDepth(-200);

      const lampHalo = this.add
        .circle(lamp.x, lamp.y - 14, 38, 0xffe58f, 0.18)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(lamp.y + 35);
      this.tweens.add({
        targets: lampHalo,
        alpha: { from: 0.12, to: 0.28 },
        duration: 1800 + Math.random() * 600,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });

    // The 3 Distinct Garden Sanctuaries (Frontend, Backend, Tools)
    const shrineKeys = ["shrine-frontend", "shrine-backend", "shrine-tools"];
    SKILL_PATCHES.forEach((s, i) => {
      const group = portfolio.skills[i];
      const shrineKey = shrineKeys[i];

      // Ground shadow
      this.add.image(s.x, s.y + 44, "shadow").setScale(2.2, 1.3).setDepth(s.y + 38);

      // Sanctuary pavilion
      this.add.image(s.x, s.y, shrineKey).setDepth(s.y + 44);

      // Solid base collider
      const body = this.add.rectangle(s.x, s.y + 28, 108, 30, 0, 0);
      this.statics.add(body);
      body.setDepth(-200);

      // Floating illuminated skill badge & plaque
      const badge = this.add.container(s.x, s.y - 62).setDepth(2990);
      const plaqueW = 152;
      const badgeBg = this.add
        .graphics()
        .fillStyle(0x141008, 0.94)
        .fillRoundedRect(-plaqueW / 2, -18, plaqueW, 36, 8)
        .lineStyle(2, 0x8fce6b, 0.95)
        .strokeRoundedRect(-plaqueW / 2, -18, plaqueW, 36, 8);
      const icon = this.add.text(-plaqueW / 2 + 18, 0, group.emoji, { fontSize: "18px" }).setOrigin(0.5);
      const title = this.add
        .text(-plaqueW / 2 + 34, 0, `${group.name} Skills`, {
          fontFamily: pixelFont(),
          fontSize: "11px",
          color: "#d8f3dc",
        })
        .setOrigin(0, 0.5)
        .setResolution(2);
      badge.add([badgeBg, icon, title]);

      this.tweens.add({
        targets: badge,
        y: s.y - 70,
        duration: 1500 + i * 200,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });

    // --- Mailbox (Contact), procedural like v1 ---
    const m = this.add.graphics().setDepth(POINTS.mailbox.y + 40);
    m.fillStyle(0x666666, 1);
    m.fillRect(POINTS.mailbox.x - 5, POINTS.mailbox.y - 10, 10, 46);
    m.fillStyle(0xcc3333, 1);
    m.fillRoundedRect(POINTS.mailbox.x - 22, POINTS.mailbox.y - 42, 44, 34, 6);
    m.fillStyle(0x992222, 1);
    m.fillRect(POINTS.mailbox.x - 22, POINTS.mailbox.y - 42, 44, 8);
    const mBody = this.add.rectangle(POINTS.mailbox.x, POINTS.mailbox.y + 14, 48, 34, 0, 0);
    this.statics.add(mBody);
    mBody.setDepth(-200);

    // --- Welcome sign ---
    this.add
      .image(POINTS.welcomeSign.x, POINTS.welcomeSign.y, "welcome-sign")
      .setScale(1.6)
      .setDepth(POINTS.welcomeSign.y + 46);
    this.add
      .image(POINTS.welcomeSign.x, POINTS.welcomeSign.y + 40, "shadow")
      .setDepth(POINTS.welcomeSign.y + 42)
      .setScale(1.2, 0.8);
    const wBody = this.add.rectangle(POINTS.welcomeSign.x, POINTS.welcomeSign.y + 36, 76, 18, 0, 0);
    this.statics.add(wBody);
    wBody.setDepth(-200);

    // --- Secret chest ---
    const chest = this.add
      .image(POINTS.chest.x, POINTS.chest.y, "chest")
      .setScale(1.3)
      .setDepth(POINTS.chest.y + 27);
    const cBody = this.add.rectangle(POINTS.chest.x, POINTS.chest.y + 18, 52, 22, 0, 0);
    this.statics.add(cBody);
    cBody.setDepth(-200);
    this.tweens.add({
      targets: chest,
      angle: { from: -2, to: 2 },
      duration: 1700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // --- District labels ---
    LABELS.forEach((l, i) => {
      const t = this.add
        .text(l.x, l.y, l.text, {
          fontFamily: pixelFont(),
          fontSize: "18px",
          color: "#f5c96b",
          stroke: "#1a1408",
          strokeThickness: 6,
        })
        .setOrigin(0.5)
        .setResolution(2)
        .setDepth(2995);
      this.tweens.add({
        targets: t,
        y: l.y - 7,
        duration: 1600 + i * 240,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });
  }

  private buildNpcs(): void {
    this.npcs.push(new NPC(this, portfolio.npcs[0], POINTS.npcOldOcto.x, POINTS.npcOldOcto.y, 70));
    this.npcs.push(new NPC(this, portfolio.npcs[1], POINTS.npcPixel.x, POINTS.npcPixel.y, 110));
  }

  private buildInteractables(): void {
    const push = (i: Interactable) => this.interactables.push(i);

    push({
      id: "welcome",
      x: POINTS.welcomeSign.x,
      y: POINTS.welcomeSign.y + 20,
      r: 130,
      label: "Read the welcome sign",
      payload: { kind: "welcome", id: "welcome", title: "Welcome, Traveler!" },
    });

    push({
      id: "about",
      x: POINTS.fountain.x,
      y: POINTS.fountain.y + 40,
      r: 175,
      label: `About ${portfolio.name.split(" ")[0]}`,
      district: "about",
      payload: { kind: "about", id: "about", title: "About Me" },
    });

    PROJECT_BOARDS.forEach((b, i) => {
      const project = portfolio.projects[i];
      push({
        id: `proj:${project.id}`,
        x: b.x,
        y: b.y + 50,
        r: 130,
        label: `Inspect: ${project.title}`,
        district: "projects",
        payload: { kind: "project", id: `proj:${project.id}`, title: project.title, projectId: project.id },
      });
    });

    SKILL_PATCHES.forEach((s, i) => {
      const skill = portfolio.skills[i];
      push({
        id: `skill:${skill.id}`,
        x: s.x,
        y: s.y + 40,
        r: 140,
        label: `${skill.name} Skills`,
        district: "skills",
        payload: { kind: "skills", id: `skill:${skill.id}`, title: `${skill.name} Skills`, skillId: skill.id },
      });
    });

    push({
      id: "contact",
      x: POINTS.mailbox.x,
      y: POINTS.mailbox.y,
      r: 150,
      label: "Open the mailbox",
      district: "contact",
      payload: { kind: "contact", id: "contact", title: "Contact" },
    });

    portfolio.npcs.forEach((npc) => {
      const p = npc.id === "old-octo" ? POINTS.npcOldOcto : POINTS.npcPixel;
      push({
        id: `npc:${npc.id}`,
        x: p.x,
        y: p.y,
        r: 170,
        label: `Talk to ${npc.name}`,
        payload: { kind: "dialogue", id: `npc:${npc.id}`, title: npc.name, npcId: npc.id },
      });
    });

    push({
      id: "secret",
      x: POINTS.chest.x,
      y: POINTS.chest.y,
      r: 130,
      label: "Open the treasure chest",
      payload: { kind: "secret", id: "secret", title: "???" },
    });
  }

  private buildAtmosphere(): void {
    // --- Fountain water, anchored to the real sprite geometry ---
    const fountainX = POINTS.fountain.x;
    const fountainY = POINTS.fountain.y;
    const fountainDepth = fountainY + 98;

    // 1. Crown jet — water source at the top
    this.add
      .particles(fountainX, fountainY - 108, "droplet", {
        speed: { min: 70, max: 100 },
        angle: { min: 256, max: 284 },
        gravityY: 260,
        lifespan: { min: 520, max: 680 },
        scale: { start: 0.38, end: 0 },
        frequency: 55,
        blendMode: "ADD",
      })
      .setDepth(fountainDepth + 1);

    // 2. The pour — droplets spill over the upper basin lip into pool
    this.add
      .particles(fountainX, fountainY - 14, "droplet", {
        speed: { min: 28, max: 50 },
        angle: { min: 87, max: 93 },
        gravityY: 280,
        lifespan: { min: 420, max: 540 },
        scale: { start: 0.5, end: 0.12 },
        alpha: { start: 0.8, end: 0.3 },
        frequency: 60,
        tint: 0xaadcff,
        emitZone: {
          type: "random",
          source: zoneSource(new Phaser.Geom.Line(-58, 0, 58, 0)),
        },
      })
      .setDepth(fountainDepth + 2);

    // 3. Pool shimmer — faint glints on pool surface
    this.add
      .particles(fountainX, fountainY + 30, "droplet", {
        speed: { min: 2, max: 8 },
        lifespan: { min: 1200, max: 2000 },
        scale: { start: 0.22, end: 0 },
        alpha: { start: 0.45, end: 0 },
        frequency: 130,
        blendMode: "ADD",
        tint: 0xd8f2ff,
        emitZone: {
          type: "random",
          source: zoneSource(new Phaser.Geom.Rectangle(-72, -18, 144, 40)),
        },
      })
      .setDepth(fountainDepth + 2);

    // 4. Ripples — expanding rings inside the basin
    for (let i = 0; i < 3; i++) {
      const ring = this.add
        .image(fountainX, fountainY + 32, "ripple")
        .setDepth(fountainDepth + 1)
        .setAlpha(0);
      this.tweens.add({
        targets: ring,
        scale: { from: 0.25, to: 1.15 },
        alpha: { from: 0.4, to: 0 },
        duration: 2400,
        repeat: -1,
        delay: i * 800,
        ease: "Sine.easeOut",
      });
    }

    // --- Garden Arboretum Atmosphere ---
    // Frontend Sanctuary: drifting sakura & blossom petals
    this.add
      .particles(2404, 1220, "petal", {
        speed: { min: 10, max: 28 },
        angle: { min: 40, max: 130 },
        lifespan: { min: 2400, max: 4000 },
        scale: { start: 1, end: 0.2 },
        alpha: { start: 0.85, end: 0 },
        frequency: 420,
        emitZone: {
          type: "random",
          source: zoneSource(new Phaser.Geom.Rectangle(-60, -30, 120, 60)),
        },
      })
      .setDepth(2980);

    // Backend Sanctuary: mystical cyan sparks
    this.add
      .particles(2640, 1500, "sparkle", {
        speed: { min: 6, max: 22 },
        lifespan: { min: 1600, max: 3000 },
        scale: { start: 0.85, end: 0 },
        tint: 0x00f5d4,
        alpha: { start: 0.85, end: 0 },
        blendMode: "ADD",
        frequency: 400,
        emitZone: {
          type: "random",
          source: zoneSource(new Phaser.Geom.Rectangle(-45, -30, 90, 60)),
        },
      })
      .setDepth(2980);

    // Tools & Craft Sanctuary: golden amber pollen fireflies
    this.add
      .particles(2404, 1780, "firefly", {
        speed: { min: 8, max: 24 },
        lifespan: { min: 2000, max: 3600 },
        scale: { start: 0.9, end: 0.15 },
        tint: 0xffd166,
        alpha: { start: 0.85, end: 0 },
        blendMode: "ADD",
        frequency: 400,
        emitZone: {
          type: "random",
          source: zoneSource(new Phaser.Geom.Rectangle(-50, -30, 100, 60)),
        },
      })
      .setDepth(2980);

    // Fireflies drifting near the plaza and garden
    for (const [fx, fy] of [
      [PLAZA.cx - 420, PLAZA.cy - 420],
      [PLAZA.cx + 420, PLAZA.cy + 430],
      [2450, 1980],
    ] as const) {
      this.add
        .particles(fx, fy, "firefly", {
          speed: { min: 8, max: 32 },
          lifespan: { min: 2600, max: 4600 },
          scale: { start: 1.1, end: 0.1 },
          alpha: { start: 0.85, end: 0 },
          quantity: 1,
          frequency: 420,
          blendMode: "ADD",
        })
        .setDepth(2980);
    }

    // Chest sparkle hint (subtle — for the observant)
    this.add
      .particles(POINTS.chest.x, POINTS.chest.y - 20, "sparkle", {
        speed: { min: 4, max: 14 },
        lifespan: 900,
        scale: { start: 0.8, end: 0 },
        quantity: 1,
        frequency: 780,
        tint: 0xf5c96b,
        blendMode: "ADD",
      })
      .setDepth(2980);
  }

  // ------------------------------------------------------------------
  // Per-frame logic
  // ------------------------------------------------------------------

  update(_time: number, delta: number): void {
    const dt = Math.min(delta, 100) / 1000; // clamp tab-switch spikes
    this.npcs.forEach((n) => n.update());
    ghosts.update(dt);

    // Poll E every frame (JustDown is edge-triggered and must be drained
    // every frame, otherwise a stale press could fire later).
    const ePressed = Phaser.Input.Keyboard.JustDown(this.interactKey);

    if (gameRuntime.modalOpen) {
      this.player.stop();
      // Discard any interaction input pressed while a modal was open
      gameRuntime.interactQueued = false;
      return;
    }

    // Merge keyboard + virtual joystick input
    let vx = 0;
    let vy = 0;
    if (this.keys.A?.isDown || this.keys.LEFT?.isDown) vx -= 1;
    if (this.keys.D?.isDown || this.keys.RIGHT?.isDown) vx += 1;
    if (this.keys.W?.isDown || this.keys.UP?.isDown) vy -= 1;
    if (this.keys.S?.isDown || this.keys.DOWN?.isDown) vy += 1;
    vx += sharedInput.x;
    vy += sharedInput.y;
    vx = Math.max(-1, Math.min(1, vx));
    vy = Math.max(-1, Math.min(1, vy));

    const moved = this.player.update(vx, vy);
    if (moved && !this.moveUnlocked) {
      this.moveUnlocked = true;
      unlock("first-steps");
    }

    // --- Ghost visitors: report our position (throttled inside) ---
    if (vx < -0.05) this.lastFacing = "left";
    else if (vx > 0.05) this.lastFacing = "right";
    ghosts.report(
      Math.round(this.player.sprite.x),
      Math.round(this.player.sprite.y),
      moved,
      this.lastFacing,
    );

    // --- Minimap tick (throttled ~4 Hz, cheap on purpose) ---
    this.tickAcc += delta;
    if (this.tickAcc >= 250) {
      this.tickAcc = 0;
      emitGameEvent("pg:tick", {
        x: this.player.sprite.x,
        y: this.player.sprite.y,
        ghosts: ghosts.positions(),
      });
    }

    // --- Presence counter (diff-based, for the HUD chip) ---
    const total = ghosts.onlineCount() + 1;
    if (total !== this.lastPresence) {
      this.lastPresence = total;
      emitGameEvent("pg:presence", { count: total });
    }

    // --- Diff-based proximity: emit ONLY when the nearest changes ---
    // (coalesce undefined → null so the diff actually settles)
    const near = this.findNearest();
    const nearId = near?.id ?? null;
    if (nearId !== this.activeId) {
      this.activeId = nearId;
      emitGameEvent("pg:prompt", { label: near ? near.label : null });
    }

    // Interact: polled E key, or a queued tap from the mobile button
    if (ePressed || gameRuntime.interactQueued) {
      gameRuntime.interactQueued = false;
      this.tryInteract();
    }
  }

  private findNearest(): Interactable | null {
    let best: Interactable | null = null;
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

  private tryInteract(): void {
    if (gameRuntime.modalOpen) return;
    const it = this.findNearest();
    if (!it) return;

    gameRuntime.modalOpen = true;
    // Gameplay first — the UI must open regardless of audio health.
    emitGameEvent("pg:zone-open", it.payload);
    audio.open();

    if (it.district) {
      this.visitedDistricts.add(it.district);
      if (this.visitedDistricts.size >= 4) unlock("explorer");
    }
    switch (it.payload.kind) {
      case "project":
        this.readProjects.add(it.payload.projectId!);
        if (this.readProjects.size >= portfolio.projects.length) unlock("bookworm");
        break;
      case "dialogue":
        this.talkedNpcs.add(it.payload.npcId!);
        this.npcs.find((n) => n.def.id === it.payload.npcId)?.celebrate();
        if (this.talkedNpcs.size >= portfolio.npcs.length) unlock("social");
        break;
      case "secret":
        unlock("curious");
        audio.secret();
        this.confetti(POINTS.chest.x, POINTS.chest.y - 30);
        break;
      default:
        break;
    }
  }

  private trackKonami(keyCode: number): void {
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

  private konamiReward(): void {
    unlock("konami");
    audio.konami();
    const px = this.player.sprite.x;
    const py = this.player.sprite.y - 40;
    this.confetti(px, py);
    // Rainbow tint party for 2.4s
    const tints = [0xff5964, 0xffa85c, 0xffe156, 0x6bd66b, 0x5ca9ff, 0xb36bff];
    let i = 0;
    this.time.addEvent({
      delay: 120,
      repeat: 19,
      callback: () => {
        this.player.sprite.setTint(tints[i++ % tints.length]);
        if (i === 20) this.player.sprite.clearTint();
      },
    });
  }

  private confetti(x: number, y: number): void {
    this.add
      .particles(x, y, "sparkle", {
        speed: { min: 60, max: 260 },
        angle: { min: 240, max: 300 },
        gravityY: 260,
        lifespan: 1500,
        scale: { start: 1.4, end: 0 },
        quantity: 14,
        frequency: 30,
        tint: [0xff5964, 0xffe156, 0x6bd66b, 0x5ca9ff, 0xb36bff, 0xf5c96b],
        blendMode: "ADD",
        emitting: false,
      })
      .setDepth(3100)
      .explode(60);
  }
}
