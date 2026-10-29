import * as Phaser from "phaser";
import { pixelFont } from "@/game/systems/shared";

export interface GhostSpawn {
  id: string;
  name: string;
  x: number;
  y: number;
  facing: string;
  moving: boolean;
}

/**
 * A translucent echo of another real visitor walking through the world.
 * No physics body — it's a friendly apparition, not a collision. The
 * sprite lerps toward the last reported position so movement looks
 * smooth even at 1-2 position reports per second.
 */
export class Ghost {
  readonly id: string;
  private readonly scene: Phaser.Scene;
  private readonly sprite: Phaser.GameObjects.Sprite;
  private readonly glow: Phaser.GameObjects.Image;
  private readonly label: Phaser.GameObjects.Text;
  private readonly fadeTween?: Phaser.Tweens.Tween;

  private tx: number;
  private ty: number;
  private moving = false;
  private facing = "right";

  constructor(scene: Phaser.Scene, spawn: GhostSpawn) {
    this.scene = scene;
    this.id = spawn.id;
    this.tx = spawn.x;
    this.ty = spawn.y;
    this.facing = spawn.facing;

    this.glow = scene.add
      .image(spawn.x, spawn.y + 26, "ghost-glow")
      .setScale(3.4)
      .setAlpha(0)
      .setDepth(spawn.y - 1)
      .setBlendMode(Phaser.BlendModes.ADD);

    this.sprite = scene.add
      .sprite(spawn.x, spawn.y, "player", 0)
      .setScale(1.6)
      .setAlpha(0)
      .setDepth(spawn.y);
    this.sprite.setTint(0xa8d8ff);

    this.label = scene.add
      .text(spawn.x, spawn.y - 64, spawn.name, {
        fontFamily: pixelFont(),
        fontSize: "10px",
        color: "#cfeaff",
        stroke: "#0a1420",
        strokeThickness: 4,
      })
      .setOrigin(0.5, 1)
      .setResolution(2)
      .setAlpha(0)
      .setDepth(2999);

    this.sprite.setFlipX(this.facing === "left");

    // Fade in like a proper haunting
    this.fadeTween = scene.tweens.add({
      targets: [this.sprite, this.label],
      alpha: { from: 0, to: 1 },
      duration: 650,
      ease: "Sine.easeOut",
    });
    scene.tweens.add({
      targets: this.glow,
      alpha: { from: 0, to: 0.55 },
      duration: 650,
      ease: "Sine.easeOut",
    });

    // One-time sparkle so you notice someone just joined
    const burst = scene.add
      .particles(spawn.x, spawn.y, "sparkle", {
        speed: { min: 30, max: 130 },
        lifespan: 700,
        scale: { start: 0.9, end: 0 },
        quantity: 1,
        frequency: 24,
        tint: 0xa8d8ff,
        blendMode: "ADD",
        emitting: false,
      })
      .setDepth(3100);
    burst.explode(18);
    scene.time.delayedCall(1200, () => burst.destroy());
  }

  setTarget(x: number, y: number, moving: boolean, facing: string): void {
    this.tx = x;
    this.ty = y;
    this.moving = moving;
    if (facing === "left" || facing === "right") this.facing = facing;
  }

  /** Current visual position (for the minimap). */
  visualPosition(): { x: number; y: number } {
    return { x: Math.round(this.sprite.x), y: Math.round(this.sprite.y) };
  }

  update(dt: number): void {
    // Exponential smoothing toward the last reported position
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

    this.sprite.setDepth(this.sprite.y);
    this.glow.setPosition(this.sprite.x, this.sprite.y + 26);
    this.glow.setDepth(this.sprite.y - 1);
    this.label.setPosition(this.sprite.x, this.sprite.y - 64);
  }

  fadeOutAndDestroy(): void {
    this.fadeTween?.remove();
    this.scene.tweens.add({
      targets: [this.sprite, this.label, this.glow],
      alpha: 0,
      duration: 550,
      ease: "Sine.easeIn",
      onComplete: () => {
        this.label.destroy();
        this.glow.destroy();
        this.sprite.destroy();
      },
    });
  }
}
