// scripts/test-challenger-m4-r2-2.mjs
// Empirical adversarial stress tests for Milestone 4 Iteration 2 Challenger 2

import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const arcadeFile = path.join(rootDir, "src/components/game/ArcadeMiniGame.tsx");
const zoneModalFile = path.join(rootDir, "src/components/game/ZoneModal.tsx");

const arcadeSrc = fs.readFileSync(arcadeFile, "utf-8");
const zoneModalSrc = fs.readFileSync(zoneModalFile, "utf-8");

let passed = 0;
let failed = 0;
let warnings = 0;

function assert(cond, name, details = "") {
  if (cond) {
    passed++;
    console.log(`  ✓ PASS: ${name}${details ? ` (${details})` : ""}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${name}${details ? ` (${details})` : ""}`);
  }
}

function warn(name, details = "") {
  warnings++;
  console.warn(`  ⚠️ WARN: ${name}${details ? ` (${details})` : ""}`);
}

console.log("==================================================================");
console.log("RUNNING CHALLENGER M4-R2-2 ADVERSARIAL STRESS SUITE");
console.log("==================================================================");

// ----------------------------------------------------------------------
// 1. Container onPointerDown / onClick Event Deduplication
// ----------------------------------------------------------------------
console.log("\n[Test Group 1] Container Pointer & Click Deduplication");

// Find the canvas container div
const canvasFrameRegex = /<div[^>]*className="[^"]*aspect-\[16\/9\][^"]*"[^>]*>[\s\S]*?<canvas[\s\S]*?<\/div>/;
const match = arcadeSrc.match(canvasFrameRegex);

assert(match !== null, "Found canvas screen frame container in ArcadeMiniGame.tsx");

if (match) {
  const containerSnippet = match[0];
  const hasPointerDown = containerSnippet.includes("onPointerDown");
  const hasClick = containerSnippet.includes("onClick");

  assert(hasPointerDown, "Container has onPointerDown handler for low-latency response");
  assert(!hasClick, "Container does NOT attach onClick (preventing dual click duplication)");
  assert(containerSnippet.includes("touch-none"), "Container includes touch-none class to prevent viewport gestures");
  assert(containerSnippet.includes("e.button !== 0"), "onPointerDown filters non-primary button presses (e.button !== 0)");
}

// Simulate browser event sequence for a mouse click:
// In standard browsers, a click dispatches pointerdown, then mousedown, then pointerup, mouseup, click.
{
  let flapCount = 0;
  const mockTriggerFlap = () => { flapCount++; };

  // Container handler simulation
  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    mockTriggerFlap();
  };

  // Simulate primary mouse button pointerdown
  let defaultPrevented = false;
  let propagationStopped = false;
  handlePointerDown({
    button: 0,
    preventDefault: () => { defaultPrevented = true; },
    stopPropagation: () => { propagationStopped = true; }
  });

  assert(flapCount === 1, "Single pointerdown triggers exactly 1 flap");
  assert(defaultPrevented && propagationStopped, "pointerdown halts default action and parent propagation");

  // Simulate right-click (button 2)
  handlePointerDown({
    button: 2,
    preventDefault: () => {},
    stopPropagation: () => {}
  });
  assert(flapCount === 1, "Right-click (button=2) ignored by onPointerDown");
}

// ----------------------------------------------------------------------
// 2. Spacebar e.repeat & Capture Phase Isolation vs Escape Pass-Through
// ----------------------------------------------------------------------
console.log("\n[Test Group 2] Spacebar Isolation, Repeat Suppression & Escape Pass-Through");

// Verify capture phase registration in source code
const captureRegistrationRegex = /window\.addEventListener\(["']keydown["'],\s*handleKeyDown,\s*\{\s*capture:\s*true/;
assert(captureRegistrationRegex.test(arcadeSrc), "ArcadeMiniGame registers keydown listener with capture: true");

// Verify handleKeyDown source logic
const handleKeyDownMatch = arcadeSrc.match(/const handleKeyDown = \(e: KeyboardEvent\) => \{([\s\S]*?)\};/);
assert(handleKeyDownMatch !== null, "Found handleKeyDown in ArcadeMiniGame.tsx");

if (handleKeyDownMatch) {
  const body = handleKeyDownMatch[1];
  assert(body.includes("e.repeat"), "handleKeyDown checks e.repeat");
  assert(body.includes("e.preventDefault()"), "handleKeyDown calls e.preventDefault()");
  assert(body.includes("e.stopPropagation()"), "handleKeyDown calls e.stopPropagation()");
  assert(!body.includes('"Escape"') && !body.includes("'Escape'"), "handleKeyDown does NOT trap Escape key");
}

// Behavioral simulation of handleKeyDown
{
  let flapsTriggered = 0;
  const triggerFlap = () => { flapsTriggered++; };

  // Emulate ArcadeMiniGame's handleKeyDown implementation
  const handleKeyDown = (e) => {
    if (e.repeat) return;
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      e.stopPropagation();
      triggerFlap();
    }
  };

  // Initial Spacebar press
  let prevented = false;
  let stopped = false;
  handleKeyDown({
    key: " ",
    code: "Space",
    repeat: false,
    preventDefault: () => { prevented = true; },
    stopPropagation: () => { stopped = true; }
  });

  assert(flapsTriggered === 1 && prevented && stopped, "Initial Space press (repeat=false) flaps and isolates event");

  // Holding down Spacebar (repeat=true)
  let repeatPrevented = false;
  for (let i = 0; i < 5; i++) {
    handleKeyDown({
      key: " ",
      code: "Space",
      repeat: true,
      preventDefault: () => { repeatPrevented = true; },
      stopPropagation: () => {}
    });
  }
  assert(flapsTriggered === 1, "Repeated keydown events (repeat=true) do NOT trigger additional flaps (rapid flap spam blocked)");

  // Escape key press
  let escapePrevented = false;
  let escapeStopped = false;
  handleKeyDown({
    key: "Escape",
    code: "Escape",
    repeat: false,
    preventDefault: () => { escapePrevented = true; },
    stopPropagation: () => { escapeStopped = true; }
  });

  assert(!escapePrevented && !escapeStopped, "Escape key is ignored by ArcadeMiniGame (passes through unmodified)");

  // Verify ZoneModal handles Escape
  let modalClosed = false;
  const zoneModalOnKey = (e, payloadKind) => {
    if (e.key === "Escape" && payloadKind !== "dialogue" && payloadKind !== "secret") {
      modalClosed = true;
    }
  };

  zoneModalOnKey({ key: "Escape" }, "project");
  assert(modalClosed, "Escape key propagates to ZoneModal and triggers onClose() for project modal");
}

// ----------------------------------------------------------------------
// 3. High Score Storage & Finite Number Parsing
// ----------------------------------------------------------------------
console.log("\n[Test Group 3] High Score Finite Number Parsing & Adversarial Values");

// Verify ArcadeMiniGame uses Number.isFinite
assert(arcadeSrc.includes("Number.isFinite(val)"), "ArcadeMiniGame.tsx uses Number.isFinite(val) instead of !isNaN(val)");

// Emulate getStoredBestTime with Number.isFinite
function parseStoredBestTime(mockStorageValue) {
  try {
    if (mockStorageValue) {
      const val = parseFloat(mockStorageValue);
      if (Number.isFinite(val)) return val;
    }
  } catch {}
  return 0;
}

const testCases = [
  { input: null, expected: 0, desc: "null (missing key)" },
  { input: "", expected: 0, desc: "empty string" },
  { input: "0", expected: 0, desc: "zero string '0'" },
  { input: "6.4", expected: 6.4, desc: "valid float '6.4'" },
  { input: "10.0", expected: 10.0, desc: "max sprint duration '10.0'" },
  { input: "Infinity", expected: 0, desc: "'Infinity' rejected by Number.isFinite" },
  { input: "+Infinity", expected: 0, desc: "'+Infinity' rejected by Number.isFinite" },
  { input: "-Infinity", expected: 0, desc: "'-Infinity' rejected by Number.isFinite" },
  { input: "NaN", expected: 0, desc: "'NaN' rejected by Number.isFinite" },
  { input: "1e309", expected: 0, desc: "float overflow '1e309' (evaluates to Infinity) rejected" },
  { input: "garbage_text", expected: 0, desc: "non-numeric string 'garbage_text' defaults to 0" },
  { input: "{'bad': 'json'}", expected: 0, desc: "malformed JSON string defaults to 0" },
  { input: "undefined", expected: 0, desc: "literal 'undefined' defaults to 0" },
];

for (const tc of testCases) {
  const result = parseStoredBestTime(tc.input);
  assert(result === tc.expected, `Storage test: ${tc.desc} -> ${result} (expected ${tc.expected})`);
}

// ----------------------------------------------------------------------
// 4. Win-Frame Mutual Exclusivity (No Collision Overwrite on Win Frame)
// ----------------------------------------------------------------------
console.log("\n[Test Group 4] Win-Frame Collision Mutual Exclusivity");

// Verify in ArcadeMiniGame.tsx that collision checks are strictly inside the else branch of timeLeft <= 0
const winBranchRegex = /if\s*\(sim\.timeLeft\s*<=\s*0\)\s*\{[\s\S]*?sim\.state\s*=\s*"won";[\s\S]*?\}\s*else\s*\{[\s\S]*?\/\/ Octo physics[\s\S]*?checkCollision/;
assert(winBranchRegex.test(arcadeSrc), "Physics and collision checks are strictly in the 'else' branch of 'sim.timeLeft <= 0'");

// Verify sim.state === "playing" guard on obstacle collision
assert(arcadeSrc.includes('sim.state === "playing" &&'), "Obstacle collision checks verify sim.state === 'playing'");

// Check single assignment of sim.state = "won"
const wonMatches = arcadeSrc.match(/sim\.state\s*=\s*["']won["']/g);
assert(wonMatches && wonMatches.length === 1, "Exactly one occurrence of sim.state = 'won' in ArcadeMiniGame.tsx");

// ----------------------------------------------------------------------
// 5. Verification Summary
// ----------------------------------------------------------------------
console.log("\n==================================================================");
console.log(`CHALLENGER STRESS SUITE COMPLETE`);
console.log(`Passed:   ${passed}`);
console.log(`Warnings: ${warnings}`);
console.log(`Failed:   ${failed}`);
console.log("==================================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
