import * as Phaser from "phaser";

/**
 * The player — GitHub's octopus, walking on tiny legs.
 * Movement reads a normalized vector from keyboard OR the virtual
 * joystick; diagonal is normalized so you don't move faster at 45°.
 */
export class Player {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly scene: Phaser.Scene;
  private readonly dustEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private readonly speed = 340;
  private readonly walkKey = "player-walk";
  private stepTimer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "player");
    this.sprite.setScale(1.6);
    // Body smaller than the 80px sprite, anchored at the feet — feels fair
    this.sprite.body?.setSize(36, 30);
    this.sprite.body?.setOffset(7, 18);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(y + 36);
    this.sprite.setTexture("player", 0);

    // Walking dust puffs at the octopus's tentacles for classic RPG game feel
    this.dustEmitter = scene.add.particles(0, 0, "dust-puff", {
      lifespan: 280,
      scale: { start: 1.3, end: 0.2 },
      alpha: { start: 0.75, end: 0 },
      speedY: { min: -15, max: -35 },
      speedX: { min: -18, max: 18 },
      emitting: false,
    });
    this.dustEmitter.setDepth(y + 20);
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

      // Periodically emit footstep dust puffs behind tentacles
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
      this.stepTimer = 100; // ready to puff shortly after starting to walk
    }
    // The octopus sprite faces RIGHT — flip when walking left (v1 did
    // this, v2 had lost it: you moonwalked west). Keep last facing while idle.
    if (mvx < -0.05) this.sprite.setFlipX(true);
    else if (mvx > 0.05) this.sprite.setFlipX(false);
    // Depth-sort against props using feet position for true 2.5D sorting
    this.sprite.setDepth(this.sprite.y + 36);
    return moving;
  }

  stop(): void {
    this.sprite.setVelocity(0, 0);
    this.sprite.anims.pause();
  }

  destroy(): void {
    this.dustEmitter.destroy();
    this.sprite.destroy();
  }
}
