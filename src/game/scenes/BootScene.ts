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
