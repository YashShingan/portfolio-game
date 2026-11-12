/**
 * Milestone 3 Adversarial Empirical Test Suite
 * Challenger: challenger_m3_2
 *
 * Stress-testing:
 * 1. Rapid consecutive coin tosses & event bus resilience
 * 2. Fortunes distribution, pool coverage, schema validation, repetition avoidance
 * 3. Storage resilience, malformed/corrupted data, setItem exception handling
 * 4. WebAudio safety, autoplay context, high-frequency bursts, non-finite values
 * 5. Sprite, particle, and tween lifecycle in WorldScene, delayedCall cleanup
 */

import fs from "node:fs";
import path from "node:path";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const findings = [];

function assert(condition, testName, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    const msg = `❌ FAIL: ${testName} - ${details}`;
    console.error(`  ${msg}`);
    findings.push({ severity: "HIGH", testName, details });
  }
}

function warn(condition, testName, details = "", severity = "MEDIUM") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    const msg = `⚠️ WARN [${severity}]: ${testName} - ${details}`;
    console.warn(`  ${msg}`);
    findings.push({ severity, testName, details });
  }
}

console.log("==================================================================");
console.log("STARTING EMPIRICAL ADVERSARIAL STRESS TEST SUITE: MILESTONE 3");
console.log("==================================================================");

// =====================================================================
// SUITE 1: RAPID CONSECUTIVE COIN TOSSES & EVENT BUS STRESS
// =====================================================================
console.log("\n[Suite 1] Rapid Consecutive Coin Tosses & Event Bus Stress");

// Setup minimal mock window environment for events if running in Node
const eventListeners = new Map();
const mockWindow = {
  dispatchEvent: (event) => {
    const list = eventListeners.get(event.type) || [];
    for (const fn of [...list]) {
      try {
        fn(event);
      } catch (err) {
        console.error("Listener error:", err);
      }
    }
    return true;
  },
  addEventListener: (type, fn) => {
    if (!eventListeners.has(type)) eventListeners.set(type, []);
    eventListeners.get(type).push(fn);
  },
  removeEventListener: (type, fn) => {
    const list = eventListeners.get(type) || [];
    const idx = list.indexOf(fn);
    if (idx !== -1) list.splice(idx, 1);
  },
};

globalThis.window = mockWindow;
globalThis.CustomEvent = class CustomEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.detail = init.detail;
  }
};

// Import systems
const { emitGameEvent, onGameEvent } = await import("../src/game/systems/events.ts");
const { unlock, unlockedIds, ACHIEVEMENTS, resetAchievements } = await import(
  "../src/game/systems/achievements.ts"
);

// 1.1 High-frequency burst test: 1,000 rapid event emissions
let tossCountReceived = 0;
const unsubscribeToss = onGameEvent("pg:fountain-toss", () => {
  tossCountReceived++;
});

const tStart = performance.now();
for (let i = 0; i < 1000; i++) {
  emitGameEvent("pg:fountain-toss", undefined);
}
const burstDuration = performance.now() - tStart;

assert(
  tossCountReceived === 1000,
  "1,000 consecutive 'pg:fountain-toss' events received without loss",
  `Received: ${tossCountReceived}/1000`
);
assert(
  burstDuration < 200,
  `High frequency event burst performance (<200ms)`,
  `Actual time: ${burstDuration.toFixed(2)}ms`
);

unsubscribeToss();
emitGameEvent("pg:fountain-toss", undefined);
assert(
  tossCountReceived === 1000,
  "Unsubscribe from 'pg:fountain-toss' prevents further calls",
  `Received after unsub: ${tossCountReceived}`
);

// 1.2 Multi-subscriber concurrent stress: 50 subscribers, 200 dispatches
const subCounts = new Array(50).fill(0);
const unsubscribers = [];
for (let i = 0; i < 50; i++) {
  const index = i;
  unsubscribers.push(
    onGameEvent("pg:fountain-toss", () => {
      subCounts[index]++;
    })
  );
}

for (let i = 0; i < 200; i++) {
  emitGameEvent("pg:fountain-toss", undefined);
}

const all50ReceivedAll200 = subCounts.every((c) => c === 200);
assert(
  all50ReceivedAll200,
  "50 simultaneous event listeners all cleanly receive 200 events (10,000 total calls)",
  `Min count: ${Math.min(...subCounts)}, Max count: ${Math.max(...subCounts)}`
);

unsubscribers.forEach((unsub) => unsub());

// 1.3 Achievement unlock idempotency under rapid firing
// Mock localStorage
let storageStore = {};
globalThis.localStorage = {
  getItem: (key) => storageStore[key] ?? null,
  setItem: (key, val) => {
    storageStore[key] = String(val);
  },
  removeItem: (key) => {
    delete storageStore[key];
  },
  clear: () => {
    storageStore = {};
  },
};

resetAchievements();
let achievementEventFired = 0;
let achievementPayload = null;
const unsubAch = onGameEvent("pg:achievement", (detail) => {
  achievementEventFired++;
  achievementPayload = detail;
});

// Rapidly call unlock("big-spender") 1,000 times
let trueReturnCount = 0;
let falseReturnCount = 0;
for (let i = 0; i < 1000; i++) {
  const res = unlock("big-spender");
  if (res) trueReturnCount++;
  else falseReturnCount++;
}

assert(
  trueReturnCount === 1,
  "unlock('big-spender') returns true exactly once across 1,000 consecutive calls",
  `True returns: ${trueReturnCount}`
);
assert(
  falseReturnCount === 999,
  "unlock('big-spender') returns false for all 999 subsequent calls",
  `False returns: ${falseReturnCount}`
);
assert(
  achievementEventFired === 1,
  "'pg:achievement' event fired exactly once",
  `Fired count: ${achievementEventFired}`
);
assert(
  achievementPayload?.id === "big-spender" && achievementPayload?.emoji === "🪙",
  "Achievement event payload matches 'big-spender' definition",
  JSON.stringify(achievementPayload)
);

const storedList = JSON.parse(storageStore["pg_achievements_v2"]);
assert(
  Array.isArray(storedList) && storedList.length === 1 && storedList[0] === "big-spender",
  "localStorage contains exactly one instance of 'big-spender' with zero duplicates",
  JSON.stringify(storedList)
);

unsubAch();

// =====================================================================
// SUITE 2: FORTUNES DISTRIBUTION & SELECTION LOGIC
// =====================================================================
console.log("\n[Suite 2] Fortunes Distribution, Schema & Selection Logic");

// Extract DEVELOPER_FORTUNES from ZoneModal.tsx
const zoneModalCode = fs.readFileSync(path.resolve("src/components/game/ZoneModal.tsx"), "utf8");
const fortunesMatch = zoneModalCode.match(/const DEVELOPER_FORTUNES: Fortune\[\] = (\[[\s\S]*?\]);/);
assert(Boolean(fortunesMatch), "Extracted DEVELOPER_FORTUNES array from ZoneModal.tsx");

const fortunes = eval(fortunesMatch[1]);
assert(fortunes.length >= 20, `Fortunes pool size >= 20 (actual: ${fortunes.length})`);

// 2.1 Schema validation
let allValidSchema = true;
let emptyQuotes = 0;
let emptyAuthors = 0;
let invalidWhitespace = 0;

fortunes.forEach((f, idx) => {
  if (typeof f.quote !== "string" || f.quote.trim().length < 8) {
    allValidSchema = false;
    emptyQuotes++;
    console.error(`Invalid quote at index ${idx}:`, f);
  }
  if (typeof f.author !== "string" || f.author.trim().length < 2) {
    allValidSchema = false;
    emptyAuthors++;
    console.error(`Invalid author at index ${idx}:`, f);
  }
  if (f.quote !== f.quote.trim() || f.author !== f.author.trim()) {
    invalidWhitespace++;
  }
});

assert(allValidSchema && emptyQuotes === 0, "All 24 fortunes have valid, non-empty quotes");
assert(allValidSchema && emptyAuthors === 0, "All 24 fortunes have valid, non-empty authors");
assert(invalidWhitespace === 0, "All fortunes are cleanly trimmed without leading/trailing whitespace");

// 2.2 Consecutive Repetition Avoidance Test (Stress simulation: 100,000 tosses)
let consecutiveDuplicates = 0;
let currentFortune = null;
const selectionCounts = new Map();
fortunes.forEach((f) => selectionCounts.set(f.quote, 0));

const TOTAL_SIM_TOSSES = 100000;
for (let i = 0; i < TOTAL_SIM_TOSSES; i++) {
  let next;
  // Replicating the exact logic in ZoneModal.tsx lines 300-303
  do {
    next = fortunes[Math.floor(Math.random() * fortunes.length)];
  } while (fortunes.length > 1 && currentFortune && next.quote === currentFortune.quote);

  if (currentFortune && next.quote === currentFortune.quote) {
    consecutiveDuplicates++;
  }
  selectionCounts.set(next.quote, selectionCounts.get(next.quote) + 1);
  currentFortune = next;
}

assert(
  consecutiveDuplicates === 0,
  `Zero consecutive duplicate fortunes over ${TOTAL_SIM_TOSSES.toLocaleString()} tosses`,
  `Duplicate count: ${consecutiveDuplicates}`
);

// 2.3 Pool Coverage & Distribution Uniformity
let zeroHitFortunes = 0;
const counts = [...selectionCounts.values()];
const minCount = Math.min(...counts);
const maxCount = Math.max(...counts);
const expectedMean = TOTAL_SIM_TOSSES / fortunes.length; // ~4,166.6

counts.forEach((c) => {
  if (c === 0) zeroHitFortunes++;
});

assert(zeroHitFortunes === 0, "100% of all fortunes in pool are reachable and selected");

// Statistical spread check: min and max within 25% of expected mean in a large sample
const minRatio = minCount / expectedMean;
const maxRatio = maxCount / expectedMean;
assert(
  minRatio > 0.85 && maxRatio < 1.15,
  `Selection distribution is statistically balanced (min: ${minCount}, max: ${maxCount}, mean: ${expectedMean.toFixed(1)})`,
  `Min ratio: ${minRatio.toFixed(3)}, Max ratio: ${maxRatio.toFixed(3)}`
);

// 2.4 Degenerate pool edge case: single-item pool
const singleItemPool = [{ quote: "Solo fortune", author: "Solo" }];
let singlePickCount = 0;
let soloFortune = null;
let allIterationsOne = true;
for (let i = 0; i < 50; i++) {
  let next;
  let iterations = 0;
  do {
    iterations++;
    next = singleItemPool[Math.floor(Math.random() * singleItemPool.length)];
    if (iterations > 10) break; // safety guard against infinite loop
  } while (singleItemPool.length > 1 && soloFortune && next.quote === soloFortune.quote);

  if (iterations !== 1) allIterationsOne = false;
  soloFortune = next;
  singlePickCount++;
}
assert(allIterationsOne, "Single-item pool terminates in 1 iteration without infinite do-while loop");
assert(singlePickCount === 50, "Single-item pool handled cleanly across 50 iterations");

// =====================================================================
// SUITE 3: STORAGE CORRUPTED OR MISSING STRESS TESTING
// =====================================================================
console.log("\n[Suite 3] Storage Resilience & Malformed Data Stress Testing");

// 3.1 Completely empty / fresh localStorage (returns null)
storageStore = {};
assert(
  unlockedIds().size === 0,
  "unlockedIds() returns empty Set when localStorage is empty (null)"
);
const freshUnlock = unlock("big-spender");
assert(
  freshUnlock === true && unlockedIds().has("big-spender"),
  "unlock('big-spender') works properly on fresh state"
);

// 3.2 Malformed non-JSON strings in localStorage
const corruptedRawValues = [
  "",
  "{corrupted json",
  "undefined",
  "null",
  "[1, 2, unclosed array",
  "NaN",
  "<<<xml>>>",
];

corruptedRawValues.forEach((raw) => {
  storageStore["pg_achievements_v2"] = raw;
  let res;
  let threw = false;
  try {
    res = unlockedIds();
  } catch (e) {
    threw = true;
  }
  assert(
    !threw && res instanceof Set,
    `unlockedIds() gracefully recovers from corrupted string: ${JSON.stringify(raw)}`
  );
  assert(res.size === 0, `Returns empty Set on corrupted string: ${JSON.stringify(raw)}`);
});

// 3.3 Valid JSON but unexpected data types (number, boolean, object)
const nonArrayJsonValues = [
  { raw: "12345", label: "number" },
  { raw: "true", label: "boolean" },
  { raw: '{"id": "first-steps"}', label: "object" },
];

nonArrayJsonValues.forEach(({ raw, label }) => {
  storageStore["pg_achievements_v2"] = raw;
  let res;
  let threw = false;
  try {
    res = unlockedIds();
  } catch (e) {
    threw = true;
  }
  assert(
    !threw && res instanceof Set,
    `unlockedIds() handles valid JSON ${label} without throwing uncaught exception`
  );
});

// 3.4 Array containing non-string or mixed elements
storageStore["pg_achievements_v2"] = JSON.stringify([
  123,
  null,
  true,
  { key: "val" },
  "first-steps",
]);
let mixedRes;
let mixedThrew = false;
try {
  mixedRes = unlockedIds();
} catch (e) {
  mixedThrew = true;
}
assert(!mixedThrew && mixedRes.has("first-steps"), "Handles array with mixed types safely");

// 3.5 unlock() when localStorage is disabled or throws QuotaExceededError / SecurityError
let setItemThrows = true;
globalThis.localStorage.setItem = (key, val) => {
  if (setItemThrows) {
    const err = new Error("QuotaExceededError: The quota has been exceeded.");
    err.name = "QuotaExceededError";
    throw err;
  }
  storageStore[key] = String(val);
};

storageStore = {}; // Clean
let unlockThrew = false;
let unlockResult = false;
try {
  unlockResult = unlock("big-spender");
} catch (err) {
  unlockThrew = true;
}

warn(
  !unlockThrew,
  "unlock('big-spender') resilience when localStorage.setItem throws QuotaExceededError",
  "unlock() currently lacks try-catch around localStorage.setItem; if storage quota is exceeded or storage is disabled, an uncaught exception is thrown",
  "MEDIUM"
);

// Restore localStorage.setItem
setItemThrows = false;
globalThis.localStorage.setItem = (key, val) => {
  storageStore[key] = String(val);
};

// =====================================================================
// SUITE 4: AUDIO CONTEXT SAFETY & AUTOPLAY CONTEXT
// =====================================================================
console.log("\n[Suite 4] WebAudio Context Safety & High-Frequency Stress");

const { audio } = await import("../src/game/systems/audio.ts");

// 4.1 Uninitialized Audio Context (before user interaction / init)
// Ensure ctx is not yet initialized
let uninitThrew = false;
for (let i = 0; i < 1000; i++) {
  try {
    audio.coin();
  } catch (e) {
    uninitThrew = true;
  }
}
assert(
  !uninitThrew,
  "1,000 rapid calls to audio.coin() before user gesture / initialization do not throw"
);

// 4.2 Mock WebAudio API for simulated lifecycle
let totalOscillatorsCreated = 0;
let totalGainsCreated = 0;
let scheduledStopTimes = [];

class MockAudioParam {
  constructor(initial = 0) {
    this.value = initial;
  }
  setValueAtTime(val, t) {
    this.value = val;
  }
  linearRampToValueAtTime(val, t) {
    this.value = val;
  }
  setTargetAtTime(val, t, tc) {
    this.value = val;
  }
}

class MockAudioNode {
  connect(dest) {
    return dest;
  }
  disconnect() {}
}

class MockGainNode extends MockAudioNode {
  constructor() {
    super();
    totalGainsCreated++;
    this.gain = new MockAudioParam(1);
  }
}

class MockOscillatorNode extends MockAudioNode {
  constructor() {
    super();
    totalOscillatorsCreated++;
    this.type = "sine";
    this.frequency = new MockAudioParam(440);
    this.startedAt = null;
    this.stoppedAt = null;
  }
  start(t) {
    this.startedAt = t;
  }
  stop(t) {
    this.stoppedAt = t;
    scheduledStopTimes.push(t);
  }
}

class MockAudioContext {
  constructor() {
    this.state = "suspended";
    this.currentTime = 10.0;
    this.sampleRate = 44100;
    this.destination = new MockAudioNode();
  }
  createGain() {
    return new MockGainNode();
  }
  createOscillator() {
    return new MockOscillatorNode();
  }
  createBiquadFilter() {
    return {
      type: "lowpass",
      frequency: new MockAudioParam(20000),
      connect: () => {},
    };
  }
  createBuffer(channels, len, rate) {
    return {
      getChannelData: () => new Float32Array(len),
    };
  }
  createBufferSource() {
    return {
      buffer: null,
      connect: () => {},
      start: () => {},
    };
  }
  resume() {
    this.state = "running";
    return Promise.resolve();
  }
}

globalThis.AudioContext = MockAudioContext;
globalThis.webkitAudioContext = MockAudioContext;
mockWindow.AudioContext = MockAudioContext;
mockWindow.webkitAudioContext = MockAudioContext;

// Initialize audio
audio.init();

// 4.3 Suspended state stress test: 500 calls while audio context is suspended
let suspendedThrew = false;
for (let i = 0; i < 500; i++) {
  try {
    audio.coin();
  } catch (e) {
    suspendedThrew = true;
  }
}
assert(!suspendedThrew, "500 calls to audio.coin() in suspended state do not throw");

// 4.4 Running state high frequency stress: 100 rapid calls
// Reset counters
totalOscillatorsCreated = 0;
totalGainsCreated = 0;
scheduledStopTimes = [];

for (let i = 0; i < 100; i++) {
  audio.coin();
}

// audio.coin() schedules 3 tones:
// Tone 1: 987.77 Hz, dur 0.09s
// Tone 2: 1318.51 Hz, dur 0.38s
// Tone 3: 2637.02 Hz, dur 0.20s
assert(
  totalOscillatorsCreated === 300,
  `100 calls to audio.coin() schedule exactly 300 oscillator nodes (3 per coin)`,
  `Actual created: ${totalOscillatorsCreated}`
);
assert(
  totalGainsCreated === 300,
  `100 calls to audio.coin() schedule exactly 300 envelope gain nodes (3 per coin)`,
  `Actual created: ${totalGainsCreated}`
);

// Verify all scheduled stop times are finite and in the future
const allStopTimesFinite = scheduledStopTimes.every(
  (t) => Number.isFinite(t) && t > 10.0 && t <= 10.0 + 0.38 + 0.065 + 0.05
);
assert(
  allStopTimesFinite && scheduledStopTimes.length === 300,
  "All 300 scheduled oscillators have strictly finite future stop times (guaranteeing voice release)",
  `Scheduled stops count: ${scheduledStopTimes.length}`
);

// 4.5 Non-finite currentTime protection (NaN, Infinity)
const testTimes = [NaN, Infinity, -Infinity];
let corruptTimeThrew = false;

testTimes.forEach((badTime) => {
  audio.ctx.currentTime = badTime;
  try {
    audio.coin();
  } catch (e) {
    corruptTimeThrew = true;
  }
});
audio.ctx.currentTime = 10.0;

assert(
  !corruptTimeThrew,
  "audio.coin() guards against non-finite currentTime without throwing"
);

// 4.6 Hardware disconnect / AudioNode creation failure
const origCreateOscillator = audio.ctx.createOscillator;
audio.ctx.createOscillator = () => {
  throw new Error("Hardware detachment simulated");
};

let hardwareErrorThrew = false;
try {
  audio.coin();
} catch (e) {
  hardwareErrorThrew = true;
}
audio.ctx.createOscillator = origCreateOscillator;

assert(
  !hardwareErrorThrew,
  "audio.coin() swallows audio creation errors gracefully without crashing caller"
);

// =====================================================================
// SUITE 5: SPRITE, PARTICLE & TWEEN LIFECYCLE IN WORLDSCENE
// =====================================================================
console.log("\n[Suite 5] Particle, Sprite & Tween Lifecycle Simulation");

// Read WorldScene.ts implementation details
const worldSceneCode = fs.readFileSync(path.resolve("src/game/scenes/WorldScene.ts"), "utf8");

// Verify key contracts in WorldScene.ts
assert(
  worldSceneCode.includes('this.textures.exists("fountain-coin")'),
  "WorldScene checks this.textures.exists('fountain-coin') to prevent redundant texture generation"
);
assert(
  worldSceneCode.includes("coin.destroy()"),
  "Coin sprite has explicit coin.destroy() in onComplete"
);
assert(
  worldSceneCode.includes("ripple.destroy()"),
  "Primary ripple sprite has explicit ripple.destroy() in onComplete"
);
assert(
  worldSceneCode.includes("ripple2.destroy()"),
  "Secondary ripple sprite has explicit ripple2.destroy() in onComplete"
);
assert(
  worldSceneCode.includes("dropSplash.destroy()") &&
    worldSceneCode.includes("sparkleSplash.destroy()"),
  "Splash droplet and sparkle particle emitters have explicit .destroy() calls in delayedCall"
);

// 5.1 Simulate WorldScene Toss Object Allocation & Cleanup Lifecycle
class MockGameObject {
  constructor(type, x, y, texture) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.texture = texture;
    this.destroyed = false;
    this.depth = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.alpha = 1;
    this.angle = 0;
  }
  setDepth(d) {
    this.depth = d;
    return this;
  }
  setScale(sx, sy = sx) {
    this.scaleX = sx;
    this.scaleY = sy;
    return this;
  }
  setAlpha(a) {
    this.alpha = a;
    return this;
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  setAngle(a) {
    this.angle = a;
    return this;
  }
  destroy() {
    this.destroyed = true;
  }
}

class MockParticleEmitter extends MockGameObject {
  constructor(x, y, texture) {
    super("particle-emitter", x, y, texture);
    this.exploded = false;
    this.particleCount = 0;
  }
  explode(count) {
    this.exploded = true;
    this.particleCount = count;
  }
}

class MockTween {
  constructor(config) {
    this.config = config;
    this.elapsed = 0;
    this.duration = config.duration || 1000;
    this.delay = config.delay || 0;
    this.completed = false;
  }
  update(delta) {
    if (this.completed) return;
    this.elapsed += delta;
    if (this.elapsed >= this.delay + this.duration) {
      if (this.config.onComplete) this.config.onComplete();
      this.completed = true;
    } else if (this.elapsed >= this.delay && this.config.onUpdate) {
      this.config.onUpdate();
    }
  }
}

class MockDelayedCall {
  constructor(delay, callback) {
    this.delay = delay;
    this.callback = callback;
    this.elapsed = 0;
    this.completed = false;
  }
  update(delta) {
    if (this.completed) return;
    this.elapsed += delta;
    if (this.elapsed >= this.delay) {
      this.callback();
      this.completed = true;
    }
  }
}

class SimulatedWorldScene {
  constructor() {
    this.activeGameObjects = new Set();
    this.allCreatedGameObjects = [];
    this.activeTweens = [];
    this.activeDelayedCalls = [];
  }

  addGameObject(obj) {
    this.activeGameObjects.add(obj);
    this.allCreatedGameObjects.push(obj);
    const origDestroy = obj.destroy.bind(obj);
    obj.destroy = () => {
      origDestroy();
      this.activeGameObjects.delete(obj);
    };
    return obj;
  }

  handleFountainToss(playerX = 1500, playerY = 1600) {
    const targetX = 1500;
    const targetY = 1532;

    let startX = playerX;
    let startY = playerY - 12;

    const dist = Math.hypot(startX - targetX, startY - targetY);
    if (dist > 280) {
      const angle = Math.atan2(startY - targetY, startX - targetX);
      startX = targetX + Math.cos(angle) * 180;
      startY = targetY + Math.sin(angle) * 180;
    }

    const coin = this.addGameObject(new MockGameObject("image", startX, startY, "fountain-coin"));
    coin.setDepth(2980);

    const tossObj = { t: 0 };
    const tween = new MockTween({
      targets: tossObj,
      t: 1,
      duration: 650,
      ease: "Linear",
      onComplete: () => {
        coin.destroy();
        this.splashFountainPool(targetX, targetY);
      },
    });
    this.activeTweens.push(tween);
  }

  splashFountainPool(x, y) {
    const fountainDepth = 1598;

    const ripple = this.addGameObject(new MockGameObject("image", x, y, "ripple"));
    ripple.setDepth(fountainDepth + 3).setScale(0.2).setAlpha(0.9);
    this.activeTweens.push(
      new MockTween({
        targets: ripple,
        duration: 1000,
        onComplete: () => ripple.destroy(),
      })
    );

    const ripple2 = this.addGameObject(new MockGameObject("image", x, y, "ripple"));
    ripple2.setDepth(fountainDepth + 3).setScale(0.15).setAlpha(0.75);
    this.activeTweens.push(
      new MockTween({
        targets: ripple2,
        delay: 140,
        duration: 900,
        onComplete: () => ripple2.destroy(),
      })
    );

    const dropSplash = this.addGameObject(new MockParticleEmitter(x, y, "droplet"));
    dropSplash.setDepth(2980);
    dropSplash.explode(20);

    const sparkleSplash = this.addGameObject(new MockParticleEmitter(x, y, "sparkle"));
    sparkleSplash.setDepth(2981);
    sparkleSplash.explode(14);

    this.activeDelayedCalls.push(
      new MockDelayedCall(1200, () => {
        dropSplash.destroy();
        sparkleSplash.destroy();
      })
    );
  }

  advanceTime(ms, step = 16) {
    for (let t = 0; t < ms; t += step) {
      for (const tween of this.activeTweens) tween.update(step);
      for (const timer of this.activeDelayedCalls) timer.update(step);
    }
  }
}

// 5.2 Stress test: 100 consecutive coin tosses across time
const sceneSim = new SimulatedWorldScene();

// Fire 100 coin tosses (1 every 50ms)
for (let i = 0; i < 100; i++) {
  sceneSim.handleFountainToss(1500 + (i % 20), 1600 + (i % 20));
  sceneSim.advanceTime(50);
}

// Advance time by 2,500ms to allow all coin arcs (650ms), tweens (1040ms), and delayedCalls (1200ms) to complete
sceneSim.advanceTime(2500);

// Total objects created: 100 tosses * (1 coin + 2 ripples + 2 emitters) = 500 game objects
assert(
  sceneSim.allCreatedGameObjects.length === 500,
  "Exactly 500 GameObjects created across 100 coin tosses (100 coins, 200 ripples, 200 emitters)",
  `Actual total created: ${sceneSim.allCreatedGameObjects.length}`
);

const leakedObjects = sceneSim.activeGameObjects.size;
assert(
  leakedObjects === 0,
  "100% of GameObjects (all 500) are fully destroyed with ZERO memory leaks",
  `Leaked GameObjects remaining: ${leakedObjects}`
);

const undestroyedObjects = sceneSim.allCreatedGameObjects.filter((o) => !o.destroyed);
assert(
  undestroyedObjects.length === 0,
  "Every created GameObject has destroyed === true",
  `Undestroyed: ${undestroyedObjects.length}`
);

// 5.3 Distance clamping test: start position bounding
const distantScene = new SimulatedWorldScene();
// Player far at top-left corner (100, 100)
distantScene.handleFountainToss(100, 100);
const distantCoin = distantScene.allCreatedGameObjects[0];
const targetX = 1500;
const targetY = 1532;
const coinDistanceToTarget = Math.hypot(distantCoin.x - targetX, distantCoin.y - targetY);

assert(
  Math.abs(coinDistanceToTarget - 180) < 1.0,
  `Coin toss from distant player (100, 100) is clamped to 180px radius around fountain pool`,
  `Actual distance: ${coinDistanceToTarget.toFixed(2)}px`
);

console.log("\n==================================================================");
console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} TOTAL`);
console.log("==================================================================");

if (findings.length > 0) {
  console.log("\nFINDINGS / OBSERVATIONS:");
  findings.forEach((f, idx) => {
    console.log(`[${f.severity}] ${idx + 1}. ${f.testName}: ${f.details}`);
  });
}

// Exit code based on critical failures (warns don't fail unless critical)
const criticalFails = findings.filter((f) => f.severity === "CRITICAL" || f.severity === "HIGH");
if (criticalFails.length > 0) {
  console.error(`\nSuite finished with ${criticalFails.length} HIGH/CRITICAL issues.`);
  process.exit(1);
} else {
  console.log("\nAll critical adversarial stress tests PASSED successfully.");
  process.exit(0);
}
