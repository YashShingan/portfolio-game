/**
 * Procedural chiptune engine — BGM and SFX are synthesized with WebAudio,
 * so there are zero audio files to download (v1 shipped none at all).
 *
 * Cozy pentatonic adventure loop: square lead + triangle bass + soft hats,
 * gently low-passed, scheduled with a lookahead timer.
 */

const NOTE = {
  C2: 65.41, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0,
  C3: 130.81, E3: 164.81,
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0, C6: 1046.5,
} as const;
type Freq = (typeof NOTE)[keyof typeof NOTE];

// 16 eighth-note steps per pattern; null = rest
const LEAD: Array<Freq | null> = [
  NOTE.E4, NOTE.G4, NOTE.A4, NOTE.G4, NOTE.E4, NOTE.D4, NOTE.C4, null,
  NOTE.D4, NOTE.E4, NOTE.G4, NOTE.E4, NOTE.D4, null, NOTE.C4, null,
  NOTE.A4, NOTE.G4, NOTE.E4, NOTE.G4, NOTE.A4, NOTE.C5, NOTE.D5, null,
  NOTE.C5, NOTE.A4, NOTE.G4, NOTE.E4, NOTE.D4, null, NOTE.C4, null,
];
const BASS: Array<Freq | null> = [
  NOTE.C2, null, NOTE.G2, null, NOTE.A2, null, NOTE.E2, null,
  NOTE.C2, null, NOTE.G2, null, NOTE.C3, null, NOTE.G2, null,
  NOTE.F2, null, NOTE.C3, null, NOTE.G2, null, NOTE.C3, null,
  NOTE.A2, null, NOTE.E2, null, NOTE.G2, null, NOTE.G2, null,
];

const BPM = 152;
const STEP = 60 / BPM / 2; // eighth note in seconds
const STEPS = 32;

class ChiptuneEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextStepTime = 0;
  private step = 0;
  private muted = false;
  private started = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.muted = localStorage.getItem("pg_muted") === "1";
    }
  }

  /** Must be called from a user gesture (browser autoplay policy). */
  init(): void {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
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

  private startBgm(): void {
    if (!this.ctx || this.timer) return;
    this.step = 0;
    this.nextStepTime = this.ctx.currentTime + 0.1;
    this.timer = setInterval(() => this.schedule(), 50);
  }

  private schedule(): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Headless/locked-down audio environments can report a non-finite clock;
    // guard so the scheduler never spins or schedules garbage.
    if (!Number.isFinite(now)) return;
    while (this.nextStepTime < now + 0.15) {
      this.scheduleStep(this.step % STEPS, this.nextStepTime);
      this.step++;
      this.nextStepTime += STEP;
    }
  }

  private scheduleStep(step: number, t: number): void {
    if (!this.ctx || !this.musicBus) return;
    const lead = LEAD[step];
    if (lead) this.tone(lead, t, STEP * 0.92, "square", 0.045, this.musicBus, 0.01);
    const bass = BASS[step];
    if (bass) this.tone(bass, t, STEP * 1.7, "triangle", 0.085, this.musicBus, 0.02);
    if (step % 2 === 1) this.hat(t, this.musicBus);
  }

  private tone(
    freq: number,
    t: number,
    dur: number,
    type: OscillatorType,
    gain: number,
    bus: AudioNode,
    attack = 0.005,
  ): void {
    if (!this.ctx) return;
    // Audio is best-effort: it must NEVER break gameplay.
    if (!Number.isFinite(t) || !Number.isFinite(freq) || !Number.isFinite(dur)) return;
    try {
      const osc = this.ctx.createOscillator();
      const env = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(gain, t + attack);
      env.gain.linearRampToValueAtTime(0.0001, t + dur);
      osc.connect(env);
      env.connect(bus);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch {
      /* best-effort */
    }
  }

  private hat(t: number, bus: AudioNode): void {
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
    } catch {
      /* best-effort */
    }
  }

  // ---------- SFX ----------

  private blip(from: number, to: number, dur: number, type: OscillatorType, gain: number): void {
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
      env.gain.linearRampToValueAtTime(0.0001, t + dur);
      osc.connect(env);
      env.connect(this.sfxBus);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch {
      /* best-effort */
    }
  }

  open(): void {
    this.blip(NOTE.E5, NOTE.A5, 0.12, "square", 0.06);
  }

  close(): void {
    this.blip(NOTE.A5, NOTE.E5, 0.1, "square", 0.05);
  }

  achieve(): void {
    if (!this.ctx || !this.sfxBus || !this.started) return;
    const t0 = this.ctx.currentTime;
    if (!Number.isFinite(t0)) return;
    [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((f, i) => {
      this.tone(f, t0 + i * 0.09, 0.22, "square", 0.05, this.sfxBus!);
    });
  }

  konami(): void {
    if (!this.ctx || !this.sfxBus || !this.started) return;
    const t0 = this.ctx.currentTime;
    if (!Number.isFinite(t0)) return;
    [NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.E5, NOTE.G5].forEach((f, i) => {
      this.tone(f, t0 + i * 0.11, i === 6 ? 0.6 : 0.14, "square", 0.06, this.sfxBus!);
    });
  }

  secret(): void {
    if (!this.ctx || !this.sfxBus || !this.started) return;
    const t0 = this.ctx.currentTime;
    if (!Number.isFinite(t0)) return;
    [NOTE.E5, NOTE.G5, NOTE.E5, NOTE.C6].forEach((f, i) => {
      this.tone(f, t0 + i * 0.13, 0.3, "triangle", 0.09, this.sfxBus!);
    });
  }

  /** Soft airy two-note chime — another visitor just faded in. */
  ghost(): void {
    if (!this.ctx || !this.sfxBus || !this.started) return;
    const t0 = this.ctx.currentTime;
    if (!Number.isFinite(t0)) return;
    this.tone(NOTE.E5, t0, 0.4, "triangle", 0.03, this.sfxBus);
    this.tone(NOTE.G5, t0 + 0.14, 0.5, "triangle", 0.026, this.sfxBus);
  }

  // ---------- Mute ----------

  get isMuted(): boolean {
    return this.muted;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(
        this.muted ? 0 : 1,
        this.ctx.currentTime,
        0.05,
      );
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("pg_muted", this.muted ? "1" : "0");
    }
    return this.muted;
  }

  /** Dev/test introspection: what state is the engine in right now? */
  get debugState(): { ctx: string; scheduler: boolean } {
    return {
      ctx: this.ctx
        ? this.ctx.state === "closed"
          ? "closed"
          : this.ctx.state
        : "none",
      scheduler: this.timer !== null,
    };
  }

  /**
   * Full shutdown — called when the player EXITS the game. Fades the
   * master bus out over ~250ms instead of a jarring hard cut, then
   * closes the AudioContext. The singleton is reset so a later re-entry
   * (audio.init) builds a fresh context from scratch.
   */
  destroy(): void {
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
      // Gentle fade so the loop doesn't end on an abrupt click.
      master?.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
    } catch {
      /* best-effort */
    }
    setTimeout(() => {
      try {
        void ctx.close();
      } catch {
        /* already closed */
      }
    }, 350);
  }
}

/** Client-side singleton (imported by both the game and React shell). */
export const audio = new ChiptuneEngine();

declare global {
  var __pgAudio: (() => { ctx: string; scheduler: boolean }) | undefined;
}

// Dev-only handle for automated verification ("does music stop on exit?")
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  window.__pgAudio = () => audio.debugState;
}
