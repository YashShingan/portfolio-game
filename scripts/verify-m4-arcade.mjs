/**
 * Automated Verification Script for Milestone 4: Playable Arcade Micro-Demo
 * Verifies component architecture, contracts, canvas loop, keyboard isolation, and collision logic.
 */

import fs from "fs";
import path from "path";
import assert from "assert";

const ROOT = process.cwd();

console.log("=== Running Milestone 4 Verification Checks ===");

// 1. Verify files exist
const arcadePath = path.join(ROOT, "src", "components", "game", "ArcadeMiniGame.tsx");
const zoneModalPath = path.join(ROOT, "src", "components", "game", "ZoneModal.tsx");

assert.ok(fs.existsSync(arcadePath), "ArcadeMiniGame.tsx must exist");
assert.ok(fs.existsSync(zoneModalPath), "ZoneModal.tsx must exist");
console.log("✔ File existence: PASS");

// 2. Verify ZoneModal integration
const zoneModalContent = fs.readFileSync(zoneModalPath, "utf-8");
assert.ok(
  zoneModalContent.includes('import { ArcadeMiniGame } from "./ArcadeMiniGame";'),
  "ZoneModal must import ArcadeMiniGame"
);
assert.ok(
  zoneModalContent.includes('projectId === "p0"') && zoneModalContent.includes("<ArcadeMiniGame"),
  "ZoneModal must render ArcadeMiniGame when projectId === 'p0'"
);
console.log("✔ ZoneModal integration: PASS");

// 3. Verify ArcadeMiniGame requirements
const arcadeContent = fs.readFileSync(arcadePath, "utf-8");

// 3.1 320x180 resolution & pixelated styling
assert.ok(arcadeContent.includes("CANVAS_WIDTH = 320"), "Must define CANVAS_WIDTH = 320");
assert.ok(arcadeContent.includes("CANVAS_HEIGHT = 180"), "Must define CANVAS_HEIGHT = 180");
assert.ok(arcadeContent.includes('imageRendering: "pixelated"'), "Canvas must use pixelated rendering");
console.log("✔ 320x180 pixelated resolution: PASS");

// 3.2 10-second sprint timer
assert.ok(arcadeContent.includes("SPRINT_DURATION = 10.0"), "Must define 10-second sprint duration");
assert.ok(arcadeContent.includes("sim.timeLeft = Math.max(0, sim.timeLeft - dt)"), "Must decrease timeLeft by dt");
console.log("✔ 10-second sprint timer: PASS");

// 3.3 Keyboard & Event Isolation
assert.ok(arcadeContent.includes('e.key === " "') || arcadeContent.includes('e.code === "Space"'), "Must listen for Space key");
assert.ok(arcadeContent.includes("e.preventDefault()"), "Must call preventDefault on Space to prevent page scroll");
assert.ok(arcadeContent.includes("e.stopPropagation()"), "Must call stopPropagation on Space");
assert.ok(!arcadeContent.includes('e.key === "Escape"') && !arcadeContent.includes('key === "Escape"'), "Must NOT trap Escape key");
console.log("✔ Keyboard event isolation (Space captured, Escape preserved): PASS");

// 3.4 Animation frame cleanup
assert.ok(arcadeContent.includes("requestAnimationFrame(loop)"), "Must use requestAnimationFrame");
assert.ok(arcadeContent.includes("cancelAnimationFrame(animId)"), "Must clean up cancelAnimationFrame on unmount");
assert.ok(arcadeContent.includes("removeEventListener"), "Must clean up event listeners on unmount");
console.log("✔ Lifecycle & resource cleanup: PASS");

// 3.5 Collision detection logic check
assert.ok(arcadeContent.includes("OCTO_RADIUS"), "Must define octo collision radius");
assert.ok(arcadeContent.includes("closestX") && arcadeContent.includes("closestY"), "Must use AABB vs circle collision");
assert.ok(arcadeContent.includes("floorY") || arcadeContent.includes("CANVAS_HEIGHT"), "Must check bounds collision");
console.log("✔ Collision detection logic: PASS");

// 3.6 State transitions (ready, playing, won, gameover)
assert.ok(arcadeContent.includes('"ready"'), "Must support ready state");
assert.ok(arcadeContent.includes('"playing"'), "Must support playing state");
assert.ok(arcadeContent.includes('"won"'), "Must support won state");
assert.ok(arcadeContent.includes('"gameover"'), "Must support gameover state");
assert.ok(arcadeContent.includes("SURVIVED"), "Must display victory message");
assert.ok(arcadeContent.includes("CRASHED"), "Must display defeat message");
console.log("✔ Game state transitions & screens: PASS");

// 3.7 Audio integration
assert.ok(arcadeContent.includes("@/game/systems/audio"), "Must import audio system");
assert.ok(arcadeContent.includes("audio.open"), "Must trigger flap sfx");
assert.ok(arcadeContent.includes("audio.achieve"), "Must trigger victory sfx");
assert.ok(arcadeContent.includes("audio.close"), "Must trigger crash sfx");
console.log("✔ Audio integration: PASS");

console.log("\nALL MILSTONE 4 VERIFICATION CHECKS PASSED!");
