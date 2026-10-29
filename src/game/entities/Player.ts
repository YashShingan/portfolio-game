import * as Phaser from "phaser";

/**
 * The player — GitHub's octopus, walking on tiny legs.
 * Movement reads a normalized vector from keyboard OR the virtual
 * joystick; diagonal is normalized so you don't move faster at 45°.
 */
export class Player {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly speed = 340;
  private readonly walkKey = "player-walk";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, "player");
    this.sprite.setScale(1.6);
    // Body smaller than the 80px sprite, anchored at the feet — feels fair
    this.sprite.body?.setSize(36, 30);
    this.sprite.body?.setOffset(7, 18);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(y);
    this.sprite.setTexture("player", 0);
  }

  /**
   * @param mvx,mvy normalized -1..1 input vector
   * @returns true if the player actually moved this frame
   */
  update(mvx: number, mvy: number): boolean {
    const moving = mvx !== 0 || mvy !== 0;
    if (moving) {
      const len = Math.hypot(mvx, mvy) || 1;
      this.sprite.setVelocity(
        (mvx / len) * this.speed,
        (mvy / len) * this.speed,
      );
      this.sprite.play(this.walkKey, true);
    } else {
      this.sprite.setVelocity(0, 0);
      this.sprite.anims.stop();
      this.sprite.setTexture("player", 0);
    }
    // The octopus sprite faces RIGHT — flip when walking left (v1 did
    // this, v2 had lost it: you moonwalked west). Keep last facing while idle.
    if (mvx < -0.05) this.sprite.setFlipX(true);
    else if (mvx > 0.05) this.sprite.setFlipX(false);
    // Depth-sort against props for the 2.5D feel
    this.sprite.setDepth(this.sprite.y);
    return moving;
  }

  stop(): void {
    this.sprite.setVelocity(0, 0);
    this.sprite.anims.pause();
  }
}
