import * as Phaser from "phaser";
import { pixelFont } from "@/game/systems/shared";

/**
 * BootScene — loads the 7 real assets from the v1 repo, generates all
 * remaining textures procedurally (trees, bushes, flowers, chest, drop,
 * sparkle...), creates the walk animation, then hands over to WorldScene.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload(): void {
    const { width, height } = this.scale.gameSize;
    const g = this.add.graphics();

    // Pixel loading bar
    const bw = 360;
    const bx = (width - bw) / 2;
    const by = height / 2;
    this.add
      .text(width / 2, by - 32, "ENTERING THE WORLD...", {
        fontFamily: pixelFont(),
        fontSize: "12px",
        color: "#f4e8c8",
      })
      .setOrigin(0.5)
      .setResolution(2);
    g.fillStyle(0x0d0b08, 0.8);
    g.fillRect(bx - 4, by - 4, bw + 8, 28);
    this.load.on("progress", (p: number) => {
      g.fillStyle(0xe8c170, 1);
      g.fillRect(bx, by, bw * p, 20);
    });

    // ---- Real assets (carried over from v1) ----
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    this.load.image("grass", `${base}/game-assets/tiles/grass.png`);
    this.load.image("footpath", `${base}/game-assets/tiles/footpath.png`);
    // (roadturn/cornerjoin dropped — they were opaque noise squares that
    //  produced the mismatched "corner stamps" on the old plaza. The
    //  painted ground texture now handles all geometry properly.)
    this.load.image("fountain", `${base}/game-assets/images/fountain-clean.png`);
    this.load.image("noticeboard", `${base}/game-assets/images/noticeboard.png`);
    this.load.spritesheet("player", `${base}/game-assets/sprites/github-octopuss.png`, {
      frameWidth: 50,
      frameHeight: 50,
    });
  }

  create(): void {
    this.generateTextures();
    this.createAnimations();
    this.scene.start("WorldScene");
  }

  /** All extra sprites are drawn once into textures at boot — cheap at runtime. */
  private generateTextures(): void {
    // Water droplet (for the fountain jet — same vibe as v1)
    const drop = this.make.graphics({ x: 0, y: 0 }, false);
    drop.fillStyle(0x9ed8ff, 1);
    drop.fillCircle(4, 4, 4);
    drop.generateTexture("droplet", 8, 8);
    drop.destroy();

    // Firefly glow
    const fly = this.make.graphics({ x: 0, y: 0 }, false);
    fly.fillStyle(0xfff2a8, 1);
    fly.fillCircle(4, 4, 3.5);
    fly.fillStyle(0xffffff, 1);
    fly.fillCircle(4, 4, 1.5);
    fly.generateTexture("firefly", 8, 8);
    fly.destroy();

    // Sparkle (achievement/konami confetti)
    const sp = this.make.graphics({ x: 0, y: 0 }, false);
    sp.fillStyle(0xffffff, 1);
    sp.fillRect(3, 0, 2, 8);
    sp.fillRect(0, 3, 8, 2);
    sp.generateTexture("sparkle", 8, 8);
    sp.destroy();

    // Trees ×2 — big, layered canopies so they read as actual trees
    // (the first pass drew shrub-sized ones). Three-tone canopy + shaded
    // trunk + root flare; the world places them with size variance.
    for (const [key, canopy, canopy2, canopyHi] of [
      ["tree1", 0x2f6b33, 0x3d8a41, 0x63b45e],
      ["tree2", 0x275e3f, 0x36824f, 0x5faa6c],
    ] as const) {
      const t = this.make.graphics({ x: 0, y: 0 }, false);
      // trunk: shaded core + dark root flare
      t.fillStyle(0x6e4a2f, 1);
      t.fillRect(66, 130, 18, 62);
      t.fillStyle(0x53371f, 1);
      t.fillRect(66, 130, 5, 62);
      t.fillStyle(0x3d2a16, 1);
      t.fillRect(58, 184, 34, 12);
      // canopy: base disc + side lobes break the perfect circle
      t.fillStyle(canopy, 1);
      t.fillCircle(75, 92, 52);
      t.fillCircle(44, 112, 28);
      t.fillCircle(106, 114, 26);
      // mid-tone lobes
      t.fillStyle(canopy2, 1);
      t.fillCircle(54, 62, 30);
      t.fillCircle(98, 68, 26);
      // sun-side highlight
      t.fillStyle(canopyHi, 1);
      t.fillCircle(74, 50, 18);
      t.generateTexture(key, 150, 200);
      t.destroy();
    }

    // Ripple ring — expanding ellipse for the fountain's pool surface
    const rp = this.make.graphics({ x: 0, y: 0 }, false);
    rp.lineStyle(3, 0xd8f2ff, 1);
    rp.strokeEllipse(34, 15, 60, 24);
    rp.generateTexture("ripple", 68, 30);
    rp.destroy();

    // Bush
    const b = this.make.graphics({ x: 0, y: 0 }, false);
    b.fillStyle(0x3a7a40, 1);
    b.fillEllipse(20, 14, 36, 22);
    b.fillStyle(0x4c9a52, 1);
    b.fillEllipse(14, 10, 18, 12);
    b.generateTexture("bush", 40, 26);
    b.destroy();

    // Flowers ×3
    const flowerColors: Array<[number, number]> = [
      [0xff8fb3, 0xffd166],
      [0xb28dff, 0xfff2a8],
      [0xffd166, 0xff8a5c],
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

    // Treasure chest
    const ch = this.make.graphics({ x: 0, y: 0 }, false);
    ch.fillStyle(0x8a5a2b, 1);
    ch.fillRect(2, 14, 44, 26);
    ch.fillStyle(0xa8713a, 1);
    ch.fillRect(2, 14, 44, 10);
    ch.fillStyle(0xf5c96b, 1);
    ch.fillRect(2, 14, 44, 3);
    ch.fillRect(20, 16, 8, 12);
    ch.fillStyle(0x3a2a16, 1);
    ch.fillRect(22, 20, 4, 5);
    ch.generateTexture("chest", 48, 42);
    ch.destroy();

    // Soft shadow blob for entities & props
    const sh = this.make.graphics({ x: 0, y: 0 }, false);
    sh.fillStyle(0x000000, 0.22);
    sh.fillEllipse(32, 10, 56, 16);
    sh.generateTexture("shadow", 64, 20);
    sh.destroy();

    // Ghost glow — soft blue halo beneath visitor ghosts
    const gl = this.make.graphics({ x: 0, y: 0 }, false);
    gl.fillStyle(0x66b8ff, 0.3);
    gl.fillCircle(12, 12, 11);
    gl.fillStyle(0xbfe6ff, 0.45);
    gl.fillCircle(12, 12, 6);
    gl.generateTexture("ghost-glow", 24, 24);
    gl.destroy();

    // Flower petal particle (drifts in the skills arboretum)
    const pet = this.make.graphics({ x: 0, y: 0 }, false);
    pet.fillStyle(0xff99bb, 0.9);
    pet.fillEllipse(4, 4, 6, 4);
    pet.fillStyle(0xffffff, 0.7);
    pet.fillRect(3, 3, 2, 2);
    pet.generateTexture("petal", 8, 8);
    pet.destroy();

    // Welcome sign — rustic wooden signpost with parchment map & wax seal
    const ws = this.make.graphics({ x: 0, y: 0 }, false);
    ws.fillStyle(0x52361b, 1);
    ws.fillRect(16, 26, 6, 26);
    ws.fillRect(42, 26, 6, 26);
    ws.fillStyle(0x382411, 1);
    ws.fillRect(16, 26, 2, 26);
    ws.fillRect(42, 26, 2, 26);
    ws.fillStyle(0x734822, 1);
    ws.fillRoundedRect(4, 4, 56, 30, 4);
    ws.fillStyle(0x945f31, 1);
    ws.fillRect(6, 6, 52, 26);
    ws.fillStyle(0x4a2e15, 1);
    ws.strokeRoundedRect(5, 5, 54, 28, 3);
    ws.fillStyle(0xf5eed7, 1);
    ws.fillRect(10, 10, 44, 18);
    ws.fillStyle(0xb3261e, 1);
    ws.fillCircle(15, 14, 3);
    ws.fillStyle(0x594632, 1);
    ws.fillRect(22, 12, 28, 2);
    ws.fillRect(22, 16, 24, 2);
    ws.fillRect(22, 20, 18, 2);
    ws.fillStyle(0xd4a347, 1);
    ws.fillRect(14, 2, 36, 6);
    ws.fillStyle(0x2b1d0c, 1);
    ws.fillRect(18, 4, 28, 2);
    ws.generateTexture("welcome-sign", 64, 52);
    ws.destroy();

    // Garden sundial & compass rose centerpiece
    const sd = this.make.graphics({ x: 0, y: 0 }, false);
    sd.fillStyle(0x6e685a, 1);
    sd.fillRect(6, 28, 24, 10);
    sd.fillStyle(0x948d7c, 1);
    sd.fillRect(8, 26, 20, 4);
    sd.fillStyle(0x7a7465, 1);
    sd.fillRect(12, 12, 12, 15);
    sd.fillStyle(0xa69f8d, 1);
    sd.fillRect(14, 12, 4, 15);
    sd.fillStyle(0x8f8877, 1);
    sd.fillEllipse(18, 10, 32, 12);
    sd.fillStyle(0xb5ad9a, 1);
    sd.fillEllipse(18, 9, 28, 10);
    sd.fillStyle(0x4a4539, 0.6);
    sd.fillTriangle(18, 9, 25, 11, 18, 11);
    sd.fillStyle(0xd4af37, 1);
    sd.fillTriangle(18, 4, 18, 9, 23, 9);
    sd.generateTexture("garden-sundial", 36, 40);
    sd.destroy();

    // Garden wooden park bench
    const gb = this.make.graphics({ x: 0, y: 0 }, false);
    gb.fillStyle(0x1e2722, 1);
    gb.fillRect(6, 18, 4, 16);
    gb.fillRect(46, 18, 4, 16);
    gb.fillRect(4, 12, 6, 4);
    gb.fillRect(46, 12, 6, 4);
    for (const sy of [4, 8, 12]) {
      gb.fillStyle(0x824b22, 1);
      gb.fillRect(8, sy, 40, 3);
      gb.fillStyle(0xb06c39, 1);
      gb.fillRect(8, sy, 40, 1);
    }
    gb.fillStyle(0x824b22, 1);
    gb.fillRect(4, 18, 48, 8);
    gb.fillStyle(0x9e5f2e, 1);
    gb.fillRect(6, 19, 44, 3);
    gb.fillStyle(0x5c3314, 1);
    gb.fillRect(4, 25, 48, 2);
    gb.generateTexture("garden-bench", 56, 36);
    gb.destroy();

    // Garden wrought iron lantern post
    const glamp = this.make.graphics({ x: 0, y: 0 }, false);
    glamp.fillStyle(0x27272a, 1);
    glamp.fillRect(6, 56, 12, 8);
    glamp.fillRect(8, 52, 8, 4);
    glamp.fillStyle(0x18181b, 1);
    glamp.fillRect(10, 24, 4, 28);
    glamp.fillStyle(0x3f3f46, 1);
    glamp.fillRect(11, 24, 1, 28);
    glamp.fillStyle(0x27272a, 1);
    glamp.fillRect(6, 10, 12, 14);
    glamp.fillRect(4, 8, 16, 3);
    glamp.fillRect(8, 4, 8, 4);
    glamp.fillRect(11, 1, 2, 3);
    glamp.fillStyle(0xffe58f, 1);
    glamp.fillRect(7, 12, 10, 10);
    glamp.fillStyle(0xffffff, 1);
    glamp.fillRect(9, 14, 6, 6);
    glamp.generateTexture("garden-lamp", 24, 64);
    glamp.destroy();

    // Garden trimmed boxwood hedge
    const gh = this.make.graphics({ x: 0, y: 0 }, false);
    gh.fillStyle(0x1b4332, 1);
    gh.fillRoundedRect(2, 6, 40, 20, 6);
    gh.fillStyle(0x2d6a4f, 1);
    gh.fillRoundedRect(4, 4, 36, 18, 5);
    gh.fillStyle(0x40916c, 1);
    gh.fillRoundedRect(6, 2, 32, 14, 4);
    gh.fillStyle(0x52b788, 1);
    gh.fillRect(8, 4, 10, 4);
    gh.fillRect(24, 4, 10, 4);
    gh.fillStyle(0x74c69d, 1);
    gh.fillRect(10, 5, 4, 2);
    gh.fillRect(26, 5, 4, 2);
    // tiny golden & pink floral flecks in the hedge
    gh.fillStyle(0xffd166, 0.9);
    gh.fillRect(12, 10, 2, 2);
    gh.fillRect(30, 11, 2, 2);
    gh.fillStyle(0xff758f, 0.9);
    gh.fillRect(20, 8, 2, 2);
    gh.generateTexture("garden-hedge", 44, 28);
    gh.destroy();

    // Skill Shrine 0: Frontend (Lush curved stone planter terrace)
    const sfe = this.make.graphics({ x: 0, y: 0 }, false);
    sfe.fillStyle(0x736c5f, 1);
    sfe.fillRoundedRect(10, 36, 110, 56, 12);
    sfe.fillStyle(0x948c7d, 1);
    sfe.fillRoundedRect(14, 38, 102, 50, 10);
    sfe.fillStyle(0x3b2514, 1);
    sfe.fillRoundedRect(18, 42, 94, 34, 6);
    sfe.fillStyle(0x2d6a4f, 1);
    sfe.fillRect(20, 68, 8, 14);
    sfe.fillRect(52, 70, 10, 16);
    sfe.fillRect(88, 68, 8, 12);
    sfe.fillStyle(0x52b788, 1);
    sfe.fillRect(22, 72, 4, 8);
    sfe.fillRect(54, 74, 6, 10);
    const bloomColors = [0xff4d6d, 0xff758f, 0xffb703, 0x48cae4, 0x7209b7, 0xf72585];
    for (let bx = 22; bx <= 98; bx += 14) {
      for (let by = 42; by <= 60; by += 10) {
        const col = bloomColors[(bx * 3 + by * 7) % bloomColors.length];
        sfe.fillStyle(col, 1);
        sfe.fillCircle(bx + 4, by + 4, 5);
        sfe.fillStyle(0xffffff, 0.8);
        sfe.fillRect(bx + 3, by + 3, 2, 2);
      }
    }
    sfe.fillStyle(0x1a1610, 1);
    sfe.fillRoundedRect(28, 76, 74, 18, 4);
    sfe.lineStyle(2, 0xf5c96b, 1);
    sfe.strokeRoundedRect(28, 76, 74, 18, 4);
    sfe.fillStyle(0xf5c96b, 1);
    sfe.fillRect(34, 84, 4, 3);
    sfe.fillRect(92, 84, 4, 3);
    sfe.fillStyle(0xf4e8c8, 1);
    sfe.fillRect(42, 83, 46, 5);
    sfe.generateTexture("shrine-frontend", 130, 100);
    sfe.destroy();

    // Skill Shrine 1: Backend (Zen rockery & glowing runic monolith)
    const sbe = this.make.graphics({ x: 0, y: 0 }, false);
    sbe.fillStyle(0x495057, 1);
    sbe.fillEllipse(60, 84, 96, 28);
    sbe.fillStyle(0x6c757d, 1);
    sbe.fillEllipse(60, 82, 88, 24);
    sbe.fillStyle(0x343a40, 1);
    sbe.fillEllipse(36, 88, 28, 14);
    sbe.fillEllipse(84, 88, 32, 14);
    sbe.fillStyle(0x212529, 1);
    sbe.fillRect(48, 14, 24, 68);
    sbe.fillStyle(0x343a40, 1);
    sbe.fillRect(52, 16, 16, 64);
    sbe.fillStyle(0x212529, 1);
    sbe.fillTriangle(48, 14, 72, 14, 60, 4);
    sbe.fillStyle(0x00f5d4, 1);
    sbe.fillRect(58, 20, 4, 14);
    sbe.fillRect(54, 30, 12, 3);
    sbe.fillRect(54, 42, 4, 16);
    sbe.fillRect(62, 48, 4, 16);
    sbe.fillRect(56, 54, 8, 3);
    sbe.fillStyle(0x4a2e15, 1);
    sbe.fillRect(80, 52, 6, 26);
    sbe.fillStyle(0x1b4332, 1);
    sbe.fillCircle(83, 44, 16);
    sbe.fillStyle(0x2d6a4f, 1);
    sbe.fillCircle(80, 40, 12);
    sbe.fillStyle(0x111827, 1);
    sbe.fillRoundedRect(26, 78, 68, 18, 4);
    sbe.lineStyle(2, 0x00f5d4, 0.85);
    sbe.strokeRoundedRect(26, 78, 68, 18, 4);
    sbe.fillStyle(0x00f5d4, 1);
    sbe.fillRect(38, 85, 44, 4);
    sbe.generateTexture("shrine-backend", 120, 104);
    sbe.destroy();

    // Skill Shrine 2: Tools & Craft (Artisan timber pergola & potting atelier)
    const stl = this.make.graphics({ x: 0, y: 0 }, false);
    stl.fillStyle(0x4a2810, 1);
    stl.fillRect(16, 14, 8, 76);
    stl.fillRect(106, 14, 8, 76);
    stl.fillStyle(0x653b1b, 1);
    stl.fillRect(18, 14, 4, 76);
    stl.fillRect(108, 14, 4, 76);
    stl.fillStyle(0x5c3314, 1);
    stl.fillRect(10, 10, 110, 8);
    stl.fillStyle(0x7a431b, 1);
    stl.fillRect(10, 10, 110, 3);
    for (let rx = 18; rx <= 104; rx += 18) {
      stl.fillStyle(0x3d1f08, 1);
      stl.fillRect(rx, 6, 6, 14);
    }
    stl.fillStyle(0x2d6a4f, 1);
    stl.fillRect(14, 8, 22, 12);
    stl.fillRect(80, 8, 28, 14);
    stl.fillStyle(0x52b788, 1);
    stl.fillRect(16, 12, 16, 6);
    stl.fillStyle(0x6e431f, 1);
    stl.fillRect(28, 48, 74, 34);
    stl.fillStyle(0x8a5427, 1);
    stl.fillRect(26, 46, 78, 6);
    stl.fillStyle(0xbb3e03, 1);
    stl.fillRect(34, 36, 12, 10);
    stl.fillRect(52, 38, 10, 8);
    stl.fillRect(82, 34, 14, 12);
    stl.fillStyle(0x70e000, 1);
    stl.fillCircle(40, 33, 6);
    stl.fillCircle(57, 35, 5);
    stl.fillStyle(0xffb703, 1);
    stl.fillCircle(89, 31, 7);
    stl.fillStyle(0x38b000, 1);
    stl.fillCircle(30, 22, 8);
    stl.fillStyle(0x2a1708, 1);
    stl.fillRoundedRect(30, 74, 70, 18, 4);
    stl.lineStyle(2, 0xd4a347, 0.9);
    stl.strokeRoundedRect(30, 74, 70, 18, 4);
    stl.fillStyle(0xf5c96b, 1);
    stl.fillRect(40, 82, 50, 4);
    stl.generateTexture("shrine-tools", 130, 100);
    stl.destroy();

    // Interactive halo disk beneath project kiosks
    const ph = this.make.graphics({ x: 0, y: 0 }, false);
    ph.fillStyle(0xe8c170, 0.25);
    ph.fillEllipse(32, 12, 56, 18);
    ph.fillStyle(0xffe8a3, 0.45);
    ph.fillEllipse(32, 12, 36, 10);
    ph.generateTexture("proj-halo", 64, 24);
    ph.destroy();

    // Project Kiosk 0: Retro Arcade Cabinet (Portfolio Game)
    const pk0 = this.make.graphics({ x: 0, y: 0 }, false);
    pk0.fillStyle(0x3b1111, 1);
    pk0.fillRoundedRect(12, 12, 72, 94, 6);
    pk0.fillStyle(0x541818, 1);
    pk0.fillRect(16, 16, 64, 88);
    pk0.lineStyle(2, 0xf5c96b, 1);
    pk0.strokeRoundedRect(13, 13, 70, 92, 5);
    pk0.fillStyle(0x0f071e, 1);
    pk0.fillRect(18, 16, 60, 16);
    pk0.lineStyle(1, 0x38bdf8, 1);
    pk0.strokeRect(18, 16, 60, 16);
    pk0.fillStyle(0x38bdf8, 1);
    pk0.fillRect(24, 22, 48, 4);
    pk0.fillStyle(0x0b0f19, 1);
    pk0.fillRoundedRect(18, 36, 60, 38, 4);
    pk0.fillStyle(0x38bdf8, 1);
    pk0.fillRect(22, 39, 52, 18);
    pk0.fillStyle(0xffffff, 0.85);
    pk0.fillRect(26, 42, 12, 4);
    pk0.fillStyle(0x16a34a, 1);
    pk0.fillRect(22, 54, 52, 16);
    pk0.fillStyle(0x22c55e, 1);
    pk0.fillRect(22, 52, 52, 4);
    pk0.fillStyle(0xec4899, 1);
    pk0.fillRect(36, 56, 8, 8);
    pk0.fillStyle(0xffffff, 1);
    pk0.fillRect(38, 58, 2, 2);
    pk0.fillStyle(0x93c5fd, 1);
    pk0.fillRect(56, 54, 10, 8);
    pk0.fillStyle(0x1e1212, 1);
    pk0.fillRect(16, 76, 64, 12);
    pk0.fillStyle(0x9ca3af, 1);
    pk0.fillRect(26, 80, 2, 5);
    pk0.fillRect(52, 80, 2, 5);
    pk0.fillStyle(0xef4444, 1);
    pk0.fillCircle(27, 79, 3);
    pk0.fillCircle(53, 79, 3);
    pk0.fillStyle(0x3b82f6, 1); pk0.fillCircle(36, 82, 2);
    pk0.fillStyle(0xfacc15, 1); pk0.fillCircle(42, 82, 2);
    pk0.fillStyle(0x22c55e, 1); pk0.fillCircle(62, 82, 2);
    pk0.fillStyle(0xec4899, 1); pk0.fillCircle(68, 82, 2);
    pk0.fillStyle(0x2b1d0c, 1);
    pk0.fillRoundedRect(20, 92, 56, 12, 2);
    pk0.lineStyle(1, 0xf5c96b, 1);
    pk0.strokeRoundedRect(20, 92, 56, 12, 2);
    pk0.fillStyle(0xf5c96b, 1);
    pk0.fillRect(26, 96, 44, 3);
    pk0.generateTexture("proj-kiosk-0", 96, 112);
    pk0.destroy();

    // Project Kiosk 1: Aerospace & Launch Telemetry (Rocket Project)
    const pk1 = this.make.graphics({ x: 0, y: 0 }, false);
    pk1.fillStyle(0x0f172a, 1);
    pk1.fillRoundedRect(12, 12, 72, 94, 6);
    pk1.fillStyle(0x1e293b, 1);
    pk1.fillRect(16, 16, 64, 88);
    pk1.fillStyle(0xeab308, 1);
    pk1.fillRect(16, 16, 10, 4);
    pk1.fillRect(70, 16, 10, 4);
    pk1.fillStyle(0x0f172a, 1);
    pk1.fillRect(20, 16, 4, 4);
    pk1.fillRect(74, 16, 4, 4);
    pk1.fillStyle(0x94a3b8, 1);
    pk1.fillRect(22, 2, 2, 12);
    pk1.fillRect(72, 2, 2, 12);
    pk1.fillStyle(0x38bdf8, 1);
    pk1.fillCircle(23, 2, 2);
    pk1.fillCircle(73, 2, 2);
    pk1.fillStyle(0x0369a1, 1);
    pk1.fillRect(28, 14, 40, 12);
    pk1.fillStyle(0x38bdf8, 1);
    pk1.fillRect(32, 18, 32, 3);
    pk1.fillStyle(0x020617, 1);
    pk1.fillRoundedRect(18, 30, 60, 44, 4);
    pk1.lineStyle(1, 0x155e75, 0.7);
    pk1.strokeCircle(48, 52, 18);
    pk1.strokeCircle(48, 52, 10);
    pk1.fillStyle(0xf97316, 1);
    pk1.fillTriangle(48, 56, 45, 66, 51, 66);
    pk1.fillStyle(0xfacc15, 1);
    pk1.fillTriangle(48, 56, 46, 62, 50, 62);
    pk1.fillStyle(0xf1f5f9, 1);
    pk1.fillRect(46, 44, 4, 12);
    pk1.fillTriangle(48, 38, 45, 44, 51, 44);
    pk1.fillStyle(0xef4444, 1);
    pk1.fillRect(44, 52, 2, 4);
    pk1.fillRect(50, 52, 2, 4);
    pk1.fillStyle(0x0f172a, 1);
    pk1.fillRect(16, 76, 64, 12);
    pk1.fillStyle(0x22c55e, 1); pk1.fillCircle(24, 82, 2);
    pk1.fillStyle(0x38bdf8, 1); pk1.fillCircle(30, 82, 2);
    pk1.fillStyle(0xef4444, 1); pk1.fillCircle(36, 82, 2);
    pk1.fillStyle(0x64748b, 1);
    pk1.fillRect(46, 80, 20, 4);
    pk1.fillStyle(0x0c4a6e, 1);
    pk1.fillRoundedRect(20, 92, 56, 12, 2);
    pk1.lineStyle(1, 0x38bdf8, 1);
    pk1.strokeRoundedRect(20, 92, 56, 12, 2);
    pk1.fillStyle(0xe0f2fe, 1);
    pk1.fillRect(26, 96, 44, 3);
    pk1.generateTexture("proj-kiosk-1", 96, 112);
    pk1.destroy();

    // Project Kiosk 2: Industrial Drafting Workbench (Maker Project)
    const pk2 = this.make.graphics({ x: 0, y: 0 }, false);
    pk2.fillStyle(0x292524, 1);
    pk2.fillRoundedRect(12, 12, 72, 94, 6);
    pk2.fillStyle(0x44403c, 1);
    pk2.fillRect(16, 16, 64, 88);
    pk2.fillStyle(0xd6d3d1, 1);
    for (let ry = 20; ry <= 100; ry += 16) {
      pk2.fillRect(14, ry, 2, 2);
      pk2.fillRect(80, ry, 2, 2);
    }
    pk2.fillStyle(0xb45309, 1);
    pk2.fillCircle(36, 10, 8);
    pk2.fillCircle(60, 10, 8);
    pk2.fillStyle(0xfde68a, 1);
    pk2.fillCircle(36, 10, 3);
    pk2.fillCircle(60, 10, 3);
    pk2.fillStyle(0x1c1917, 1);
    pk2.fillRoundedRect(18, 28, 60, 46, 4);
    pk2.lineStyle(1, 0x78350f, 0.6);
    for (let gx = 24; gx <= 72; gx += 8) pk2.lineBetween(gx, 32, gx, 70);
    for (let gy = 34; gy <= 68; gy += 8) pk2.lineBetween(22, gy, 74, gy);
    pk2.fillStyle(0xf59e0b, 1);
    pk2.fillCircle(44, 50, 10);
    pk2.fillStyle(0x1c1917, 1);
    pk2.fillCircle(44, 50, 5);
    pk2.fillStyle(0xfde68a, 1);
    pk2.fillRect(52, 44, 14, 4);
    pk2.fillRect(62, 40, 5, 12);
    pk2.fillStyle(0x1c1917, 1);
    pk2.fillRect(16, 76, 64, 12);
    pk2.fillStyle(0xb45309, 1);
    pk2.fillRect(26, 79, 4, 7);
    pk2.fillRect(36, 79, 4, 7);
    pk2.fillStyle(0xd97706, 1);
    pk2.fillCircle(56, 82, 4);
    pk2.fillStyle(0x451a03, 1);
    pk2.fillRoundedRect(20, 92, 56, 12, 2);
    pk2.lineStyle(1, 0xf59e0b, 1);
    pk2.strokeRoundedRect(20, 92, 56, 12, 2);
    pk2.fillStyle(0xfde68a, 1);
    pk2.fillRect(26, 96, 44, 3);
    pk2.generateTexture("proj-kiosk-2", 96, 112);
    pk2.destroy();

    // Project Kiosk 3: Arcane & WebGL Hologram Chamber (Experimental)
    const pk3 = this.make.graphics({ x: 0, y: 0 }, false);
    pk3.fillStyle(0x18181b, 1);
    pk3.fillRoundedRect(12, 12, 72, 94, 6);
    pk3.fillStyle(0x27272a, 1);
    pk3.fillRect(16, 16, 64, 88);
    pk3.fillStyle(0xa855f7, 1);
    pk3.fillRect(16, 16, 4, 8);
    pk3.fillRect(76, 16, 4, 8);
    pk3.fillRect(16, 96, 4, 8);
    pk3.fillRect(76, 96, 4, 8);
    pk3.fillStyle(0x9333ea, 1);
    pk3.fillTriangle(48, 0, 42, 14, 54, 14);
    pk3.fillStyle(0xc084fc, 1);
    pk3.fillTriangle(48, 0, 45, 14, 51, 14);
    pk3.fillTriangle(38, 4, 34, 14, 44, 14);
    pk3.fillTriangle(58, 4, 52, 14, 62, 14);
    pk3.fillStyle(0x090514, 1);
    pk3.fillRoundedRect(18, 28, 60, 46, 4);
    pk3.lineStyle(1, 0xec4899, 0.8);
    pk3.strokeCircle(48, 51, 14);
    pk3.lineStyle(1, 0x38bdf8, 0.9);
    pk3.strokeTriangle(48, 40, 37, 58, 59, 58);
    pk3.lineStyle(1, 0xa855f7, 0.9);
    pk3.strokeTriangle(48, 62, 37, 44, 59, 44);
    pk3.fillStyle(0xffffff, 1);
    pk3.fillCircle(48, 51, 3);
    pk3.fillStyle(0x18181b, 1);
    pk3.fillRect(16, 76, 64, 12);
    pk3.fillStyle(0xec4899, 1); pk3.fillCircle(32, 82, 3);
    pk3.fillStyle(0xa855f7, 1); pk3.fillCircle(48, 82, 3);
    pk3.fillStyle(0x38bdf8, 1); pk3.fillCircle(64, 82, 3);
    pk3.fillStyle(0x3b0764, 1);
    pk3.fillRoundedRect(20, 92, 56, 12, 2);
    pk3.lineStyle(1, 0xc084fc, 1);
    pk3.strokeRoundedRect(20, 92, 56, 12, 2);
    pk3.fillStyle(0xf3e8ff, 1);
    pk3.fillRect(26, 96, 44, 3);
    pk3.generateTexture("proj-kiosk-3", 96, 112);
    pk3.destroy();
  }

  private createAnimations(): void {
    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
