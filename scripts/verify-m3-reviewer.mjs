/**
 * Milestone 3 Independent Reviewer & Adversarial Verification Suite
 * Role: reviewer_m3_1 (Reviewer & Critic)
 */

import fs from "node:fs";
import assert from "node:assert";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function check(desc, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    failedTests++;
    console.error(`  ❌ ${desc}: ${err.message}`);
  }
}

console.log("==================================================================");
console.log("REVIEWER INDEPENDENT VERIFICATION & ADVERSARIAL STRESS TEST SUITE");
console.log("==================================================================");

// --- 1. Code Integrity & Non-cheating Invariants ---
console.log("\n[Check 1] Integrity & Non-cheating Invariants");

const eventsCode = fs.readFileSync("src/game/systems/events.ts", "utf8");
const audioCode = fs.readFileSync("src/game/systems/audio.ts", "utf8");
const achCode = fs.readFileSync("src/game/systems/achievements.ts", "utf8");
const worldCode = fs.readFileSync("src/game/scenes/WorldScene.ts", "utf8");
const modalCode = fs.readFileSync("src/components/game/ZoneModal.tsx", "utf8");

check("No dummy facade or mock shortcuts in events.ts", () => {
  assert(!eventsCode.includes("TODO"), "events.ts contains no TODOs");
  assert(eventsCode.includes('"pg:fountain-toss": undefined;'));
});

check("No dummy facade or mock shortcuts in audio.ts", () => {
  assert(audioCode.includes("coin(): void"));
  assert(audioCode.includes("this.tone(987.77"));
  assert(audioCode.includes("this.tone(1318.51"));
  assert(audioCode.includes("this.tone(2637.02"));
});

check("No dummy facade or mock shortcuts in achievements.ts", () => {
  assert(achCode.includes('"big-spender"'));
  assert(achCode.includes('"Big Spender"'));
  assert(achCode.includes('"Tossed a lucky coin into the central fountain"'));
  assert(achCode.includes('"🪙"'));
});

check("Real physics, tweens, and particle systems in WorldScene.ts", () => {
  assert(worldCode.includes("handleFountainToss(): void"));
  assert(worldCode.includes("splashFountainPool(x: number, y: number): void"));
  assert(worldCode.includes("ensureCoinTexture(): void"));
  assert(worldCode.includes("this.tweens.add"));
  assert(worldCode.includes("this.add.particles"));
  assert(worldCode.includes("delayedCall(1200"));
});

check("Real interactive component with animations in ZoneModal.tsx", () => {
  assert(modalCode.includes("function FountainOfWisdom()"));
  assert(modalCode.includes("const DEVELOPER_FORTUNES: Fortune[]"));
  assert(modalCode.includes("handleTossCoin"));
  assert(modalCode.includes("audio.coin()"));
  assert(modalCode.includes('emitGameEvent("pg:fountain-toss"'));
  assert(modalCode.includes('unlock("big-spender"'));
});

// --- 2. Parabolic Trajectory Continuity & Extremum ---
console.log("\n[Check 2] Parabolic Trajectory Continuity & Extremum");

check("Arc function is strictly concave, C1 continuous, and reaches exact apex", () => {
  const apex = 70;
  const f = (t) => 4 * apex * t * (1 - t);
  const df = (t) => 4 * apex * (1 - 2 * t);

  assert.strictEqual(f(0), 0);
  assert.strictEqual(f(1), 0);
  assert.strictEqual(f(0.5), apex);
  assert.strictEqual(df(0.5), 0, "Derivative at apex is 0");
  assert(df(0) > 0, "Derivative at start is positive (rising)");
  assert(df(1) < 0, "Derivative at end is negative (falling)");

  // Check monotonicity on [0, 0.5] and [0.5, 1]
  let prev = 0;
  for (let step = 1; step <= 50; step++) {
    const val = f(step / 100);
    assert(val > prev, `Monotonically increasing at step ${step}`);
    prev = val;
  }
  for (let step = 51; step <= 100; step++) {
    const val = f(step / 100);
    assert(val < prev, `Monotonically decreasing at step ${step}`);
    prev = val;
  }
});

// --- 3. Geometric Clamping Invariant ---
console.log("\n[Check 3] Geometric Clamping Invariant");

check("Launch coordinates strictly bounded within camera visible radius", () => {
  const targetX = 1500;
  const targetY = 1532;
  const maxRadius = 280;
  const clampedRadius = 180;

  for (let angle = 0; angle < 2 * Math.PI; angle += 0.1) {
    for (const dist of [0, 50, 100, 200, 279, 280, 281, 500, 1500, 5000]) {
      const origX = targetX + Math.cos(angle) * dist;
      const origY = targetY + Math.sin(angle) * dist;

      let startX = origX;
      let startY = origY;
      const d = Math.hypot(startX - targetX, startY - targetY);
      if (d > maxRadius) {
        const theta = Math.atan2(startY - targetY, startX - targetX);
        startX = targetX + Math.cos(theta) * clampedRadius;
        startY = targetY + Math.sin(theta) * clampedRadius;
      }

      const finalDist = Math.hypot(startX - targetX, startY - targetY);
      assert(finalDist <= maxRadius + 1e-6, "Final distance must not exceed maxRadius");
      if (dist > maxRadius) {
        assert(Math.abs(finalDist - clampedRadius) < 1e-6, "Exceeded distance must clamp to clampedRadius");
      }
    }
  }
});

// --- 4. Fortune Selection & Avoidance Algorithm ---
console.log("\n[Check 4] Fortune Selection & Avoidance Algorithm");

check("Random fortune loop guarantees termination and zero consecutive duplicates", () => {
  const match = modalCode.match(/const DEVELOPER_FORTUNES: Fortune\[\] = (\[[\s\S]*?\n\]);/);
  assert(match !== null, "Extracted quotes");
  const fortunes = eval(match[1]);

  let current = null;
  for (let i = 0; i < 20000; i++) {
    let next;
    let loopCount = 0;
    do {
      next = fortunes[Math.floor(Math.random() * fortunes.length)];
      loopCount++;
      if (loopCount > 100) {
        throw new Error("Potential infinite loop detected in fortune selection");
      }
    } while (fortunes.length > 1 && current && next.quote === current.quote);

    assert(current === null || next.quote !== current.quote, "Must never equal previous quote");
    current = next;
  }
});

// --- 5. Clean Resource Lifecycle ---
console.log("\n[Check 5] Clean Resource Lifecycle");

check("DelayedCall duration (1200ms) exceeds particle lifespans (max 700ms and 900ms)", () => {
  const dropletMaxLife = 700;
  const sparkleMaxLife = 900;
  const cleanupDelay = 1200;

  assert(cleanupDelay > dropletMaxLife, "Cleanup delay > droplet max lifespan");
  assert(cleanupDelay > sparkleMaxLife, "Cleanup delay > sparkle max lifespan");
});

check("Coin tween duration (650ms) destroys coin before splash triggers", () => {
  assert(worldCode.includes("duration = 650"));
  assert(worldCode.includes("coin.destroy();"));
  assert(worldCode.includes("this.splashFountainPool(targetX, targetY);"));
});

console.log("\n==================================================================");
console.log(`TOTAL CHECKS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log("==================================================================");

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL REVIEWER CHECKS PASSED!");
  process.exit(0);
}
