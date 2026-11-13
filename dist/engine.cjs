'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Phaser4 = require('phaser');

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

var __defProp = Object.defineProperty;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/game/systems/shared.ts
var sharedInput = {
  /** -1..1 normalized joystick vector */
  x: 0,
  y: 0
};
var gameRuntime = {
  /** True while a modal/dialog is open — freezes player input */
  modalOpen: false,
  /** Set by the mobile action button / E key, consumed by WorldScene */
  interactQueued: false
};
var cachedPixelFont = "";
function pixelFont() {
  if (cachedPixelFont) return cachedPixelFont;
  if (typeof window === "undefined") return "monospace";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-pixel");
  cachedPixelFont = v ? v.trim() : '"Press Start 2P", monospace';
  return cachedPixelFont;
}

// src/game/scenes/BootScene.ts
var BootScene = class extends Phaser4__namespace.Scene {
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

// src/config/portfolio.ts
var portfolio = {
  name: "Yash Shingan",
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
  ]};

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

// src/game/systems/audio.ts
var NOTE = {
  C2: 65.41,
  E2: 82.41,
  F2: 87.31,
  G2: 98,
  A2: 110,
  C3: 130.81,
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
var LEAD = [
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
var BASS = [
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
var BPM = 152;
var STEP = 60 / BPM / 2;
var STEPS = 32;
var ChiptuneEngine = class {
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
var audio = new ChiptuneEngine();
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  window.__pgAudio = () => audio.debugState;
}

// src/game/systems/ground.ts
var ground_exports = {};
__export(ground_exports, {
  addGroundImage: () => addGroundImage,
  buildGroundTexture: () => buildGroundTexture
});

// src/game/data/world.ts
var world_exports = {};
__export(world_exports, {
  CHEST_TREES: () => CHEST_TREES,
  CLEAR_ZONES: () => CLEAR_ZONES,
  COURIER_PLAZA: () => COURIER_PLAZA,
  GROUND_CELL: () => GROUND_CELL,
  GROUND_PADS: () => GROUND_PADS,
  HALF_PATH: () => HALF_PATH,
  LABELS: () => LABELS,
  PATHS: () => PATHS,
  PATH_W: () => PATH_W,
  PLAZA: () => PLAZA,
  POINTS: () => POINTS,
  PROJECT_BOARDS: () => PROJECT_BOARDS,
  SECRET_MARK: () => SECRET_MARK,
  SKILL_PATCHES: () => SKILL_PATCHES,
  SPAWN: () => SPAWN,
  WORLD: () => WORLD,
  mulberry32: () => mulberry32,
  zoomFor: () => zoomFor
});
var WORLD = { width: 3e3, height: 3e3 };
var PATH_W = 128;
var HALF_PATH = PATH_W / 2;
var PLAZA = {
  cx: 1500,
  cy: 1500,
  /** Half-size of the plaza floor */
  half: 480
};
var SPAWN = { x: 430, y: 1500 };
var PATHS = [
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
var COURIER_PLAZA = {
  cx: 1500,
  cy: 2340,
  w: 400,
  h: 260,
  r: 16
};
var CLEAR_ZONES = PATHS.map((p) => ({
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
var PROJECT_BOARDS = portfolio.projects.map((p, i) => ({
  id: p.id,
  x: 1060 + i * 300,
  y: 335
}));
var SKILL_PATCHES = [
  { id: "s0", x: 2404, y: 1220 },
  // Frontend (North Blooming Pavilion)
  { id: "s1", x: 2640, y: 1500 },
  // Backend (East Zen Rockery & Monolith)
  { id: "s2", x: 2404, y: 1780 }
  // Tools & Craft (South Timber Pergola)
];
var POINTS = {
  welcomeSign: { x: 560, y: 1330 },
  fountain: { x: PLAZA.cx, y: PLAZA.cy },
  mailbox: { x: 1450, y: 2350 },
  // tucked at the end of the secret trail — actually hidden now
  chest: { x: 2668, y: 640 },
  npcOldOcto: { x: 700, y: 1450 },
  npcPixel: { x: 1570, y: 2320 }
};
var GROUND_CELL = 8;
var GROUND_PADS = [
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
var CHEST_TREES = [
  { x: 2452, y: 548 },
  { x: 2452, y: 742 },
  { x: 2884, y: 520 },
  { x: 2884, y: 728 },
  { x: 2568, y: 856 },
  { x: 2772, y: 856 }
];
var LABELS = [
  { text: "PROJECTS", x: 1500, y: 220 },
  { text: "ABOUT", x: 1500, y: 1230 },
  { text: "SKILLS GARDEN", x: 2404, y: 1110 },
  { text: "CONTACT", x: 1500, y: 2180 }
];
var SECRET_MARK = { x: 2668, y: 452 };
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

// src/game/systems/ground.ts
var GW = WORLD.width / GROUND_CELL;
var GH = WORLD.height / GROUND_CELL;
var STONE_PALETTE = [
  [154, 149, 138],
  // light flagstone
  [139, 134, 124],
  // mid
  [125, 120, 110],
  // dark
  [165, 160, 149]
  // pale fleck
];
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
var Ghost = class {
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

// src/game/systems/ghosts.ts
var MAX_GHOSTS = 14;
var REPORT_MIN_MS = 240;
var REPORT_IDLE_MS = 2500;
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
var GhostSystem = class {
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
          audio.ghost();
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
var ghosts = new GhostSystem();

// src/game/entities/Player.ts
var Player = class {
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

// src/game/entities/NPC.ts
var NPC = class {
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

// src/game/scenes/WorldScene.ts
var KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
var zoneSource = (shape) => shape;
var WorldScene = class extends Phaser4__namespace.Scene {
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
        gameRuntime.modalOpen = false;
        audio.close();
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
      const project = portfolio.projects[i];
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
      const group = portfolio.skills[i];
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
    this.npcs.push(new NPC(this, portfolio.npcs[0], POINTS.npcOldOcto.x, POINTS.npcOldOcto.y, 70));
    this.npcs.push(new NPC(this, portfolio.npcs[1], POINTS.npcPixel.x, POINTS.npcPixel.y - 14, 24));
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
      label: `About ${portfolio.name.split(" ")[0]}`,
      district: "about",
      payload: { kind: "about", id: "about", title: "About Me" }
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
        payload: { kind: "project", id: `proj:${project.id}`, title: project.title, projectId: project.id }
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
    portfolio.npcs.forEach((npc) => {
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
    if (gameRuntime.modalOpen) {
      this.player.stop();
      gameRuntime.interactQueued = false;
      return;
    }
    let vx = 0;
    let vy = 0;
    if (((_b = this.keys.A) == null ? void 0 : _b.isDown) || ((_c = this.keys.LEFT) == null ? void 0 : _c.isDown)) vx -= 1;
    if (((_d = this.keys.D) == null ? void 0 : _d.isDown) || ((_e = this.keys.RIGHT) == null ? void 0 : _e.isDown)) vx += 1;
    if (((_f = this.keys.W) == null ? void 0 : _f.isDown) || ((_g = this.keys.UP) == null ? void 0 : _g.isDown)) vy -= 1;
    if (((_h = this.keys.S) == null ? void 0 : _h.isDown) || ((_i = this.keys.DOWN) == null ? void 0 : _i.isDown)) vy += 1;
    vx += sharedInput.x;
    vy += sharedInput.y;
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
    if (ePressed || gameRuntime.interactQueued) {
      gameRuntime.interactQueued = false;
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
    if (gameRuntime.modalOpen) return;
    const it = this.findNearest();
    if (!it) return;
    gameRuntime.modalOpen = true;
    emitGameEvent("pg:zone-open", it.payload);
    audio.open();
    if (it.district) {
      this.visitedDistricts.add(it.district);
      if (this.visitedDistricts.size >= 4) unlock("explorer");
    }
    switch (it.payload.kind) {
      case "project":
        this.readProjects.add(it.payload.projectId);
        if (this.readProjects.size >= portfolio.projects.length) unlock("bookworm");
        break;
      case "dialogue":
        this.talkedNpcs.add(it.payload.npcId);
        (_a = this.npcs.find((n) => n.def.id === it.payload.npcId)) == null ? void 0 : _a.celebrate();
        if (this.talkedNpcs.size >= portfolio.npcs.length) unlock("social");
        break;
      case "secret":
        unlock("curious");
        audio.secret();
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
    audio.konami();
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

// src/game/main.ts
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

// src/engine.ts
var engine_default = createGame;

exports.BootScene = BootScene;
exports.Ghost = Ghost;
exports.GhostSystem = GhostSystem;
exports.NPC = NPC;
exports.Player = Player;
exports.WorldScene = WorldScene;
exports.createGame = createGame;
exports.default = engine_default;
exports.events = events_exports;
exports.ghosts = ghosts;
exports.ground = ground_exports;
exports.world = world_exports;
