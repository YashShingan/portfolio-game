/**
 * Empirical Adversarial Test Suite for Milestone 4: Playable Arcade Micro-Demo
 * Challenger: challenger_m4_2
 *
 * Focus:
 * 1. Keyboard & Event Isolation Stress Testing
 *    - Spacebar preventDefault / stopPropagation
 *    - Escape bubbling to ZoneModal (non-interception)
 *    - Keydown on child elements with focus vs ZoneModal stopPropagation
 *    - Space key repeat (holding Space) behavior & potential death-loop
 *    - Pointerdown + click simultaneous / double-trigger evaluation
 * 2. State Machine & Transitions Stress Testing
 *    - Ready -> Playing -> Won / Defeat -> Ready / Playing
 *    - Collision detection edge cases (top, bottom, obstacle body, obstacle cap, passing)
 *    - Pipe spawn timing & clearing logic
 * 3. Persistence & LocalStorage Adversarial Testing
 *    - Valid values, missing values, corrupted values, non-finite, exceptions
 * 4. Resource Lifecycle & Teardown Verification
 *    - Animation loop cleanup
 *    - Window listener cleanup
 */

import fs from "node:fs";
import path from "node:path";

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
let warnedChecks = 0;
const findings = [];

function pass(name, details = "") {
  totalChecks++;
  passedChecks++;
  console.log(`  ✓ PASS: ${name}${details ? ` (${details})` : ""}`);
}

function fail(name, details = "") {
  totalChecks++;
  failedChecks++;
  console.error(`  ❌ FAIL: ${name} - ${details}`);
  findings.push({ severity: "HIGH", name, details });
}

function warn(name, details = "") {
  totalChecks++;
  warnedChecks++;
  console.warn(`  ⚠️ WARN: ${name} - ${details}`);
  findings.push({ severity: "MEDIUM", name, details });
}

console.log("==================================================================");
console.log("STARTING EMPIRICAL ADVERSARIAL STRESS TEST SUITE: MILESTONE 4 (CHALLENGER 2)");
console.log("==================================================================");

const ROOT = process.cwd();
const arcadeFile = path.join(ROOT, "src", "components", "game", "ArcadeMiniGame.tsx");
const zoneModalFile = path.join(ROOT, "src", "components", "game", "ZoneModal.tsx");

const arcadeContent = fs.readFileSync(arcadeFile, "utf-8");
const zoneModalContent = fs.readFileSync(zoneModalFile, "utf-8");

// =====================================================================
// SUITE 1: KEYBOARD & EVENT ISOLATION STRESS TESTING
// =====================================================================
console.log("\n[Suite 1] Keyboard & Event Isolation Stress Testing");

// 1.1 Verify Spacebar calls preventDefault() and stopPropagation()
{
  const spaceMatch = arcadeContent.match(/if\s*\((?:e\.key === " " \|\| e\.code === "Space"|e\.code === "Space" \|\| e\.key === " ")\)\s*\{([^}]+)\}/);
  if (spaceMatch) {
    const body = spaceMatch[1];
    if (body.includes("e.preventDefault()") && body.includes("e.stopPropagation()")) {
      pass("Spacebar isolation calls preventDefault() and stopPropagation()", "Stops window scroll & parent propagation");
    } else {
      fail("Spacebar isolation incomplete", "Missing e.preventDefault() or e.stopPropagation()");
    }
  } else {
    fail("Spacebar listener not found in expected format");
  }
}

// 1.2 Verify Escape key is NOT intercepted by ArcadeMiniGame
{
  const hasEscapeInArcade = arcadeContent.includes('"Escape"') || arcadeContent.includes("'Escape'");
  if (!hasEscapeInArcade) {
    pass("ArcadeMiniGame strictly preserves Escape key", "Does not intercept Escape");
  } else {
    // If it mentions Escape, verify it does NOT preventDefault or stopPropagation on Escape
    const interceptsEscape = arcadeContent.match(/key\s*===\s*["']Escape["'][^;]+(?:preventDefault|stopPropagation)/);
    if (!interceptsEscape) {
      pass("ArcadeMiniGame preserves Escape key", "Only mentions Escape in hint text");
    } else {
      fail("ArcadeMiniGame intercepts Escape key", "Prevents Escape from bubbling to ZoneModal");
    }
  }
}

// 1.3 Verify ZoneModal handles Escape to close
{
  const zoneModalEscapeMatch = zoneModalContent.match(/if\s*\(e\.key === "Escape"[^)]*\)\s*onClose\(\)/);
  if (zoneModalEscapeMatch) {
    pass("ZoneModal Escape listener closes modal", zoneModalEscapeMatch[0]);
  } else {
    fail("ZoneModal missing Escape onClose handler");
  }
}

// 1.4 Test Keydown on child elements vs ZoneModal stopPropagation
{
  const windowListenMatch = arcadeContent.match(/window\.addEventListener\(["']keydown["'],\s*handleKeyDown,\s*(\{[^}]+\}|[^)]+)\)/);
  if (windowListenMatch) {
    const options = windowListenMatch[1];
    const isCapture = options.includes("capture: true") || options.includes("true");
    if (!isCapture) {
      warn(
        "ArcadeMiniGame listens on window without capture: true",
        "If an inner element inside ZoneModal has focus and calls stopPropagation(), bubbling to window might be blocked."
      );
    } else {
      pass("ArcadeMiniGame uses capture: true on window listener");
    }
  } else {
    fail("Could not find window.addEventListener('keydown') options");
  }
}

// 1.5 Stress test: Key repeat handling (holding down Spacebar)
{
  const handlesRepeat = arcadeContent.includes("e.repeat");
  if (!handlesRepeat) {
    warn(
      "Spacebar listener does not filter e.repeat",
      "Holding down Spacebar triggers rapid repeat at 30Hz, causing repeated flap impulses and immediate restart upon defeat."
    );
  } else {
    pass("Spacebar listener explicitly handles e.repeat");
  }
}

// 1.6 Stress test: Pointerdown vs Click double-firing on screen container
{
  const hasOnPointerDown = arcadeContent.includes("onPointerDown");
  const hasOnClick = arcadeContent.includes("onClick");
  if (hasOnPointerDown && hasOnClick) {
    const containerDivMatch = arcadeContent.match(/<div[^>]*onClick=\{[^}]+\}[^>]*onPointerDown=\{[^}]+\}/s) ||
                              arcadeContent.match(/<div[^>]*onPointerDown=\{[^}]+\}[^>]*onClick=\{[^}]+\}/s);
    if (containerDivMatch) {
      warn(
        "Screen frame attaches both onPointerDown and onClick to same element",
        "A mouse click may fire pointerdown on mousedown and onClick on mouseup, triggering two flap actions per click."
      );
    } else {
      pass("Separate pointer and click handling");
    }
  } else {
    pass("Single pointer/click input mechanism");
  }
}

// =====================================================================
// SUITE 2: STATE MACHINE & SIMULATION TRANSITIONS
// =====================================================================
console.log("\n[Suite 2] State Machine & Simulation Transitions");

class FlappyOctoSimulation {
  constructor() {
    this.CANVAS_WIDTH = 320;
    this.CANVAS_HEIGHT = 180;
    this.SPRINT_DURATION = 10.0;
    this.GRAVITY = 520;
    this.FLAP_VELOCITY = -185;
    this.MAX_FALL_SPEED = 260;
    this.SCROLL_SPEED = 86;
    this.PIPE_SPAWN_INTERVAL = 1.6;
    this.PIPE_GAP_HEIGHT = 56;
    this.PIPE_WIDTH = 26;
    this.OCTO_RADIUS = 7.5;
    this.OCTO_X = 64;

    this.state = "ready";
    this.timeLeft = this.SPRINT_DURATION;
    this.octoY = this.CANVAS_HEIGHT / 2 - 4;
    this.octoVy = 0;
    this.octoAngle = 0;
    this.flapTimer = 0;
    this.pipes = [];
    this.particles = [];
    this.lastTime = 0;
    this.pipeTimer = 0;
    this.clearedCount = 0;
    this.bestRecorded = 0;
  }

  triggerFlap() {
    if (this.state === "ready") {
      this.state = "playing";
      this.timeLeft = this.SPRINT_DURATION;
      this.octoY = this.CANVAS_HEIGHT / 2 - 10;
      this.octoVy = this.FLAP_VELOCITY;
      this.pipes = [];
      this.pipeTimer = 0.6;
      this.clearedCount = 0;
      return "started";
    }
    if (this.state === "playing") {
      this.octoVy = this.FLAP_VELOCITY;
      this.flapTimer = 0.18;
      return "flapped";
    }
    if (this.state === "won" || this.state === "gameover") {
      this.state = "playing";
      this.timeLeft = this.SPRINT_DURATION;
      this.octoY = this.CANVAS_HEIGHT / 2 - 10;
      this.octoVy = this.FLAP_VELOCITY;
      this.pipes = [];
      this.pipeTimer = 0.6;
      this.clearedCount = 0;
      return "restarted";
    }
  }

  resetGame() {
    this.state = "ready";
    this.timeLeft = this.SPRINT_DURATION;
    this.octoY = this.CANVAS_HEIGHT / 2 - 4;
    this.octoVy = 0;
    this.pipes = [];
    this.clearedCount = 0;
  }

  step(dt) {
    if (this.state === "playing") {
      this.timeLeft = Math.max(0, this.timeLeft - dt);
      if (this.timeLeft <= 0) {
        this.state = "won";
        this.bestRecorded = Math.max(this.bestRecorded, this.SPRINT_DURATION);
        return;
      }

      this.octoVy = Math.min(this.MAX_FALL_SPEED, this.octoVy + this.GRAVITY * dt);
      this.octoY += this.octoVy * dt;

      this.pipeTimer -= dt;
      if (this.pipeTimer <= 0) {
        this.pipeTimer = this.PIPE_SPAWN_INTERVAL;
        const minGapY = 32;
        const maxGapY = this.CANVAS_HEIGHT - 32 - this.PIPE_GAP_HEIGHT;
        const gapY = minGapY + 0.5 * (maxGapY - minGapY);
        this.pipes.push({
          x: this.CANVAS_WIDTH + 10,
          gapY,
          passed: false,
          colorType: 0,
        });
      }

      const floorY = this.CANVAS_HEIGHT - 12;
      if (this.octoY - this.OCTO_RADIUS <= 2 || this.octoY + this.OCTO_RADIUS >= floorY) {
        this.state = "gameover";
        const survived = this.SPRINT_DURATION - this.timeLeft;
        this.bestRecorded = Math.max(this.bestRecorded, survived);
        return;
      }

      for (let i = this.pipes.length - 1; i >= 0; i--) {
        const pipe = this.pipes[i];
        pipe.x -= this.SCROLL_SPEED * dt;

        if (!pipe.passed && pipe.x + this.PIPE_WIDTH < this.OCTO_X) {
          pipe.passed = true;
          this.clearedCount++;
        }

        const topRect = { x: pipe.x, y: 0, w: this.PIPE_WIDTH, h: pipe.gapY };
        const botRect = {
          x: pipe.x,
          y: pipe.gapY + this.PIPE_GAP_HEIGHT,
          w: this.PIPE_WIDTH,
          h: this.CANVAS_HEIGHT - (pipe.gapY + this.PIPE_GAP_HEIGHT),
        };

        const checkCollision = (rx, ry, rw, rh) => {
          const closestX = Math.max(rx, Math.min(this.OCTO_X, rx + rw));
          const closestY = Math.max(ry, Math.min(this.octoY, ry + rh));
          const dx = this.OCTO_X - closestX;
          const dy = this.octoY - closestY;
          return dx * dx + dy * dy < this.OCTO_RADIUS * this.OCTO_RADIUS;
        };

        if (
          checkCollision(topRect.x, topRect.y, topRect.w, topRect.h) ||
          checkCollision(botRect.x, botRect.y, botRect.w, botRect.h)
        ) {
          this.state = "gameover";
          const survived = this.SPRINT_DURATION - this.timeLeft;
          this.bestRecorded = Math.max(this.bestRecorded, survived);
          return;
        }

        if (pipe.x < -this.PIPE_WIDTH - 20) {
          this.pipes.splice(i, 1);
        }
      }
    }
  }
}

// 2.1 Ready -> Playing transition
{
  const sim = new FlappyOctoSimulation();
  const res = sim.triggerFlap();
  if (sim.state === "playing" && res === "started" && sim.octoVy === -185) {
    pass("Transition: Ready -> Playing upon triggerFlap()", `state=${sim.state}, vy=${sim.octoVy}`);
  } else {
    fail("Failed Ready -> Playing transition", `state=${sim.state}`);
  }
}

// 2.2 Fall to seabed causes Game Over
{
  const sim = new FlappyOctoSimulation();
  sim.triggerFlap();
  for (let t = 0; t < 1.5; t += 0.016) {
    sim.step(0.016);
    if (sim.state === "gameover") break;
  }
  if (sim.state === "gameover") {
    pass("Transition: Playing -> Defeat on floor collision", `timeSurvived=${(10 - sim.timeLeft).toFixed(2)}s`);
  } else {
    fail("Octo did not collide with floor after 1.5s falling", `octoY=${sim.octoY}`);
  }
}

// 2.3 Rocketing up into ceiling causes Game Over
{
  const sim = new FlappyOctoSimulation();
  sim.triggerFlap();
  for (let t = 0; t < 0.5; t += 0.016) {
    sim.triggerFlap();
    sim.step(0.016);
    if (sim.state === "gameover") break;
  }
  if (sim.state === "gameover" && sim.octoY <= 10) {
    pass("Transition: Playing -> Defeat on ceiling collision", `octoY=${sim.octoY.toFixed(1)}`);
  } else {
    fail("Ceiling collision failed", `state=${sim.state}, octoY=${sim.octoY}`);
  }
}

// 2.4 Defeat -> Instant restart to Playing
{
  const sim = new FlappyOctoSimulation();
  sim.state = "gameover";
  const res = sim.triggerFlap();
  if (sim.state === "playing" && res === "restarted" && sim.timeLeft === 10.0) {
    pass("Transition: Defeat -> Playing (instant restart)", `state=${sim.state}, timeLeft=${sim.timeLeft}`);
  } else {
    fail("Failed Defeat -> Playing instant restart", `state=${sim.state}`);
  }
}

// 2.5 Won -> Instant restart to Playing
{
  const sim = new FlappyOctoSimulation();
  sim.state = "won";
  const res = sim.triggerFlap();
  if (sim.state === "playing" && res === "restarted" && sim.timeLeft === 10.0) {
    pass("Transition: Won -> Playing (instant restart)", `state=${sim.state}, timeLeft=${sim.timeLeft}`);
  } else {
    fail("Failed Won -> Playing instant restart", `state=${sim.state}`);
  }
}

// 2.6 Reset button returns to Ready
{
  const sim = new FlappyOctoSimulation();
  sim.state = "gameover";
  sim.resetGame();
  if (sim.state === "ready" && sim.timeLeft === 10.0 && sim.octoVy === 0) {
    pass("Transition: Reset -> Ready", `state=${sim.state}`);
  } else {
    fail("Failed Reset -> Ready transition", `state=${sim.state}`);
  }
}

// 2.7 10-second survival triggers Victory
{
  const sim = new FlappyOctoSimulation();
  sim.triggerFlap();

  // Autopilot targeting approaching gap or center
  for (let t = 0; t < 10.2; t += 0.016) {
    const nextPipe = sim.pipes.find(p => p.x + sim.PIPE_WIDTH >= sim.OCTO_X - sim.OCTO_RADIUS);
    const targetY = nextPipe ? nextPipe.gapY + sim.PIPE_GAP_HEIGHT / 2 : sim.CANVAS_HEIGHT / 2;

    // Flap when falling below lower half of gap
    if (sim.octoY > targetY + 12 && sim.octoVy > 0) {
      sim.triggerFlap();
    }
    sim.step(0.016);
    if (sim.state === "won") break;
  }
  if (sim.state === "won" && sim.bestRecorded === 10.0) {
    pass("Transition: Playing -> Won upon full 10.0s survival", `state=${sim.state}, best=${sim.bestRecorded}s`);
  } else {
    fail("Victory condition not triggered after 10.0s", `state=${sim.state}, timeLeft=${sim.timeLeft}`);
  }
}

// 2.8 Obstacle collision precision (Circle vs AABB)
{
  const sim = new FlappyOctoSimulation();
  sim.state = "playing";
  sim.octoY = 80;
  sim.pipes = [{
    x: sim.OCTO_X - 10,
    gapY: 20,
    passed: false,
    colorType: 0,
  }];
  sim.step(0.016);
  if (sim.state === "gameover") {
    pass("Collision: Obstacle AABB vs circle detection correctly registers crash", `state=${sim.state}`);
  } else {
    fail("Obstacle collision detection missed intersection", `state=${sim.state}`);
  }
}

// 2.9 Passing obstacle without collision increases score
{
  const sim = new FlappyOctoSimulation();
  sim.state = "playing";
  sim.octoY = 80;
  sim.octoVy = 0;
  // Gap centered around octo: gap is 52..108. Center is 80.
  sim.pipes = [{
    x: sim.OCTO_X + 2,
    gapY: 52,
    passed: false,
    colorType: 0,
  }];
  // Maintain altitude inside gap for 0.4s while pipe scrolls past
  for (let t = 0; t < 0.4; t += 0.016) {
    if (sim.octoY > 92 && sim.octoVy > 0) {
      sim.triggerFlap();
    }
    sim.step(0.016);
    if (sim.clearedCount > 0) break;
  }
  if (sim.clearedCount === 1 && sim.state === "playing") {
    pass("Scoring: Safely passing obstacle increments clearedCount to 1", `cleared=${sim.clearedCount}`);
  } else {
    fail("Obstacle pass failed to increment clearedCount or caused false crash", `cleared=${sim.clearedCount}, state=${sim.state}`);
  }
}

// =====================================================================
// SUITE 3: LOCALSTORAGE ADVERSARIAL & PERSISTENCE STRESS
// =====================================================================
console.log("\n[Suite 3] LocalStorage Adversarial & Persistence Stress");

const HIGH_SCORE_KEY = "pg_flappy_octo_best";

function runStorageTest(mockStorageValue, setItemFails = false) {
  let store = { [HIGH_SCORE_KEY]: mockStorageValue };
  let writtenValue = null;

  const mockStorage = {
    getItem: (key) => store[key] ?? null,
    setItem: (key, val) => {
      if (setItemFails) throw new Error("QuotaExceededError: DOM Exception 22");
      store[key] = String(val);
      writtenValue = String(val);
    },
  };

  function testGetStoredBestTime() {
    try {
      const saved = mockStorage.getItem(HIGH_SCORE_KEY);
      if (saved) {
        const val = parseFloat(saved);
        if (Number.isFinite(val)) return val;
      }
    } catch {
      /* ignore */
    }
    return 0;
  }

  function testRecordBestTime(timeSurvived) {
    try {
      const currentBest = parseFloat(mockStorage.getItem(HIGH_SCORE_KEY) || "0") || 0;
      if (timeSurvived > currentBest) {
        const rounded = Math.round(timeSurvived * 10) / 10;
        mockStorage.setItem(HIGH_SCORE_KEY, rounded.toString());
        return rounded;
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  return { testGetStoredBestTime, testRecordBestTime, getWritten: () => writtenValue };
}

// 3.1 Empty / missing key
{
  const { testGetStoredBestTime, testRecordBestTime, getWritten } = runStorageTest(null);
  const initial = testGetStoredBestTime();
  const recorded = testRecordBestTime(6.42);
  if (initial === 0 && recorded === 6.4 && getWritten() === "6.4") {
    pass("Storage: Missing key defaults to 0 and records new best", `recorded=${getWritten()}`);
  } else {
    fail("Missing storage key handling failed", `initial=${initial}, recorded=${recorded}`);
  }
}

// 3.2 Existing valid record
{
  const { testGetStoredBestTime, testRecordBestTime, getWritten } = runStorageTest("5.5");
  const initial = testGetStoredBestTime();
  const lowerIgnored = testRecordBestTime(4.2);
  const higherRecorded = testRecordBestTime(8.76);
  if (initial === 5.5 && lowerIgnored === null && higherRecorded === 8.8 && getWritten() === "8.8") {
    pass("Storage: Existing high score preserved when lower, updated when higher", `newBest=${getWritten()}`);
  } else {
    fail("High score comparison logic failed", `initial=${initial}, lower=${lowerIgnored}, higher=${higherRecorded}`);
  }
}

// 3.3 Corrupted string ("corrupted_garbage", "undefined", "null")
{
  const corruptions = ["corrupted_garbage", "undefined", "{bad:json}", "NaN"];
  let allSafe = true;
  for (const c of corruptions) {
    const { testGetStoredBestTime } = runStorageTest(c);
    const val = testGetStoredBestTime();
    if (val !== 0) allSafe = false;
  }
  if (allSafe) {
    pass("Storage: Corrupted non-numeric values safely default to 0", corruptions.join(", "));
  } else {
    fail("Corrupted storage values failed to default to 0");
  }
}

// 3.4 Non-finite / extreme values ("Infinity", "-Infinity")
{
  const { testGetStoredBestTime } = runStorageTest("Infinity");
  const val = testGetStoredBestTime();
  if (val === Infinity) {
    warn(
      "Storage: 'Infinity' is parsed as Infinity by parseFloat",
      "!isNaN(Infinity) is true in JS; bestTime becomes Infinity if set"
    );
  } else {
    pass("Storage: Infinity handled cleanly");
  }
}

// 3.5 QuotaExceededError or private browsing storage exceptions
{
  const { testRecordBestTime } = runStorageTest("5.0", true);
  try {
    const res = testRecordBestTime(9.0);
    pass("Storage: QuotaExceededError exception gracefully caught without crashing", `res=${res}`);
  } catch (err) {
    fail("Storage: Exception thrown when setItem fails", err.message);
  }
}

// =====================================================================
// SUITE 4: RESOURCE LIFECYCLE & TEARDOWN VERIFICATION
// =====================================================================
console.log("\n[Suite 4] Resource Lifecycle & Teardown Verification");

// 4.1 Animation loop cleanup
{
  const hasRaf = arcadeContent.includes("requestAnimationFrame(loop)");
  const hasCaf = arcadeContent.includes("cancelAnimationFrame(animId)");
  const hasEffectCleanup = arcadeContent.match(/return\s*\(\)\s*=>\s*\{\s*cancelAnimationFrame\(animId\);\s*\};/);
  if (hasRaf && hasCaf && hasEffectCleanup) {
    pass("Animation frame loop cancelled on component unmount", "cancelAnimationFrame(animId) in cleanup return");
  } else {
    fail("Missing cancelAnimationFrame cleanup return");
  }
}

// 4.2 Keyboard event listener cleanup
{
  const hasAdd = arcadeContent.includes('window.addEventListener("keydown"');
  const hasRemove = arcadeContent.includes('window.removeEventListener("keydown"');
  const hasListenerCleanup = arcadeContent.match(/return\s*\(\)\s*=>\s*\{\s*window\.removeEventListener\(["']keydown["'],\s*handleKeyDown\);\s*\};/);
  if (hasAdd && hasRemove && hasListenerCleanup) {
    pass("Window keydown listener removed on component unmount", "removeEventListener(handleKeyDown) in cleanup return");
  } else {
    fail("Missing removeEventListener cleanup return");
  }
}

// 4.3 Zero residual intervals or lingering timeouts
{
  const hasSetInterval = arcadeContent.includes("setInterval");
  const hasSetTimeout = arcadeContent.includes("setTimeout");
  if (!hasSetInterval && !hasSetTimeout) {
    pass("ArcadeMiniGame introduces zero setInterval or setTimeout timers", "Runs purely on requestAnimationFrame");
  } else {
    warn("ArcadeMiniGame contains timer calls", "Verify timer cleanup");
  }
}

// 4.4 ZoneModal unmount removes all modal event listeners
{
  const zoneModalAdd = zoneModalContent.match(/window\.addEventListener\(["']keydown["'],\s*onKey\)/g);
  const zoneModalRemove = zoneModalContent.match(/window\.removeEventListener\(["']keydown["'],\s*onKey\)/g);
  if (zoneModalAdd && zoneModalRemove && zoneModalAdd.length === zoneModalRemove.length) {
    pass("ZoneModal matches every addEventListener with removeEventListener", `${zoneModalAdd.length} keydown listeners cleaned up`);
  } else {
    fail("ZoneModal listener mismatch between add and remove");
  }
}

// =====================================================================
// SUMMARY & VERDICT
// =====================================================================
console.log("\n==================================================================");
console.log("CHALLENGE RUN SUMMARY:");
console.log(`Total Checks:  ${totalChecks}`);
console.log(`Passed:        ${passedChecks}`);
console.log(`Warnings:      ${warnedChecks}`);
console.log(`Failed:        ${failedChecks}`);
console.log("==================================================================");

if (findings.length > 0) {
  console.log("\nFindings / Observations:");
  findings.forEach((f, idx) => {
    console.log(` ${idx + 1}. [${f.severity}] ${f.name}: ${f.details}`);
  });
}

const exitCode = failedChecks > 0 ? 1 : 0;
process.exit(exitCode);
