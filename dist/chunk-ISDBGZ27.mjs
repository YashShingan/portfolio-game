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

export { ChiptuneEngine, audio };
