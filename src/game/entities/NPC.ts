import * as Phaser from "phaser";
import type { NpcDialogue } from "@/config/portfolio";
import { pixelFont } from "@/game/systems/shared";

/**
 * An NPC octopus — tinted so it reads as a character, not a clone of
 * the player. Bobs idly and shuffles between two points. Uses a
 * dynamic IMMUTABLE body so the player can't push them around.
 */
export class NPC {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly def: NpcDialogue;
  private readonly scene: Phaser.Scene;
  private readonly label: Phaser.GameObjects.Text;
  private readonly wanderTween?: Phaser.Tweens.Tween;

  constructor(
    scene: Phaser.Scene,
    def: NpcDialogue,
    x: number,
    y: number,
    wanderDist: number,
  ) {
    this.scene = scene;
    this.def = def;

    this.sprite = scene.physics.add.sprite(x, y, "player", 0);
    this.sprite.setScale(1.5);
    this.sprite.setTint(def.tint);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setSize(36, 30);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setOffset(7, 18);
    this.sprite.setDepth(y);

    // Idle bob — subtle life without burning CPU
    scene.tweens.add({
      targets: this.sprite,
      y: y - 6,
      duration: 1100 + Math.random() * 500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Slow shuffle along a short patrol path
    this.wanderTween = scene.tweens.add({
      targets: this.sprite,
      x: x + wanderDist,
      duration: 3800 + Math.random() * 2400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      onYoyo: () => this.setFlip(true),
      onRepeat: () => this.setFlip(false),
    });

    this.label = scene.add
      .text(x, y - 66, def.name, {
        fontFamily: pixelFont(),
        fontSize: "11px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5, 1)
      .setResolution(2)
      .setDepth(2999);
  }

  private setFlip(flip: boolean): void {
    this.sprite.setFlipX(flip);
  }

  /** Little hop + label bump when a conversation starts. */
  celebrate(): void {
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 18,
      duration: 130,
      yoyo: true,
      ease: "Quad.easeOut",
    });
  }

  update(): void {
    // Keep the name tag above the wander/bob position
    this.label.setPosition(this.sprite.x, this.sprite.y - 66);
    this.sprite.setDepth(this.sprite.y);
  }

  destroy(): void {
    this.wanderTween?.remove();
    this.label.destroy();
    this.sprite.destroy();
  }
}
