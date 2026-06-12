/* Synthesized sound engine (Web Audio API) — no asset files, offline-friendly.
   Interaction SFX (paper page-turn / shuffle) + ambient beds (forest / library / fire). */

export type Ambient = "off" | "forest" | "rain" | "fire";

// soft low pentatonic notes (G2 A2 C3 D3 E3 G3) — warm, dreamy, never dissonant
const SCALE = [196.0, 220.0, 261.63, 293.66, 329.63, 392.0];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private reverbIn: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private buffers: Record<string, AudioBuffer> = {};
  private ambientNodes: AudioNode[] = [];
  private ambientTimers: number[] = [];

  sfxOn = false;
  ambient: Ambient = "off";

  private ensure() {
    if (this.ctx) return;
    const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    const ctx = new AC();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(ctx.destination);

    this.sfxGain = ctx.createGain();
    this.sfxGain.gain.value = 0.6;
    this.sfxGain.connect(this.master);

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = 0.0001;
    this.ambientGain.connect(this.master);

    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noise = buf;

    // algorithmic reverb (decaying-noise impulse) — gives the tones space & depth
    this.convolver = ctx.createConvolver();
    this.convolver.buffer = this.makeIR(2.8, 2.6);
    this.reverbIn = ctx.createGain();
    this.reverbIn.gain.value = 1;
    const reverbReturn = ctx.createGain();
    reverbReturn.gain.value = 0.6;
    this.reverbIn.connect(this.convolver);
    this.convolver.connect(reverbReturn);
    reverbReturn.connect(this.master);
  }

  private makeIR(seconds: number, decay: number): AudioBuffer {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return ir;
  }

  private resume() {
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  }

  // ---------- public controls ----------
  async setSfx(on: boolean) {
    this.sfxOn = on;
    if (on) {
      this.ensure();
      await this.ctx!.resume();
    }
  }

  async setAmbient(a: Ambient) {
    this.ambient = a;
    this.ensure();
    await this.ctx!.resume();
    await this.applyAmbient();
  }

  // load a real field-recording (public/sounds/<name>.mp3) if it exists
  private async loadFile(name: string): Promise<AudioBuffer | null> {
    if (this.buffers[name]) return this.buffers[name];
    try {
      const res = await fetch(`/sounds/${name}.mp3`);
      if (!res.ok) return null;
      const arr = await res.arrayBuffer();
      const buf = await this.ctx!.decodeAudioData(arr);
      this.buffers[name] = buf;
      return buf;
    } catch {
      return null;
    }
  }

  private playFileBed(buf: AudioBuffer) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const g = ctx.createGain();
    g.gain.value = 1;
    src.connect(g);
    g.connect(this.ambientGain!);
    src.start();
    this.ambientNodes.push(src, g);
  }

  // ---------- interaction sfx: soft dreamy tones ----------
  private tone(delay: number, freq: number, dur: number, gain: number) {
    const ctx = this.ctx!;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    const od = ctx.createOscillator(); // detuned twin -> warmth & thickness
    od.type = "sine";
    od.frequency.value = freq * 1.004;
    const odg = ctx.createGain();
    odg.gain.value = 0.5;
    const o2 = ctx.createOscillator(); // quiet octave shimmer
    o2.type = "sine";
    o2.frequency.value = freq * 2;
    const o2g = ctx.createGain();
    o2g.gain.value = 0.09;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1100;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.05); // gentle attack
    g.gain.exponentialRampToValueAtTime(0.0006, t + dur); // soft tail
    o.connect(g);
    od.connect(odg);
    odg.connect(g);
    o2.connect(o2g);
    o2g.connect(g);
    g.connect(lp);
    lp.connect(this.sfxGain!); // dry
    if (this.reverbIn) lp.connect(this.reverbIn); // wet send -> reverb
    o.start(t);
    od.start(t);
    o2.start(t);
    o.stop(t + dur + 0.05);
    od.stop(t + dur + 0.05);
    o2.stop(t + dur + 0.05);
  }

  playFlip() {
    if (!this.sfxOn || !this.ctx) return;
    this.resume();
    this.tone(0, SCALE[Math.floor(Math.random() * SCALE.length)], 0.55, 0.16);
  }

  playSwipe() {
    if (!this.sfxOn || !this.ctx) return;
    this.resume();
    this.tone(0, SCALE[Math.floor(Math.random() * 3)], 0.46, 0.14);
  }

  playShuffle() {
    if (!this.sfxOn || !this.ctx) return;
    this.resume();
    // dreamy ascending sparkle across the scale
    for (let i = 0; i < 5; i++) {
      this.tone(i * 0.085, SCALE[i % SCALE.length], 0.5, 0.1);
    }
  }

  // soft warm "open" when entering a deck — a gentle open fifth
  playEnter() {
    if (!this.sfxOn || !this.ctx) return;
    this.resume();
    this.tone(0, SCALE[1], 0.85, 0.14); // A
    this.tone(0.05, SCALE[4], 0.85, 0.09); // E
  }

  // gentle "close" when going back — the open fifth, descending
  playBack() {
    if (!this.sfxOn || !this.ctx) return;
    this.resume();
    this.tone(0, SCALE[4], 0.7, 0.12); // E
    this.tone(0.05, SCALE[1], 0.7, 0.09); // A
  }

  // short soft tick for toggles (language)
  playToggle() {
    if (!this.sfxOn || !this.ctx) return;
    this.resume();
    this.tone(0, SCALE[3], 0.32, 0.1);
  }

  // ---------- ambient helpers ----------
  private startBed(type: BiquadFilterType, freq: number, Q: number, gain: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = Q;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(f);
    f.connect(g);
    g.connect(this.ambientGain!);
    src.start();
    this.ambientNodes.push(src, f, g);
    return { f, g, src };
  }

  private addLfo(param: AudioParam, freq: number, depth: number) {
    const ctx = this.ctx!;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = freq;
    const lg = ctx.createGain();
    lg.gain.value = depth;
    lfo.connect(lg);
    lg.connect(param);
    lfo.start();
    this.ambientNodes.push(lfo, lg);
  }

  private scheduleSparse(fn: () => void, min: number, max: number) {
    const tick = () => {
      fn();
      const id = window.setTimeout(tick, min + Math.random() * (max - min));
      this.ambientTimers.push(id);
    };
    const id = window.setTimeout(tick, min + Math.random() * (max - min));
    this.ambientTimers.push(id);
  }

  // birds
  private playChirp() {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const notes = [1700 + Math.random() * 700, 2300 + Math.random() * 900];
    notes.forEach((fr, i) => {
      const t = now + i * 0.08;
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(fr, t);
      o.frequency.exponentialRampToValueAtTime(fr * 1.3, t + 0.06);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 0.12);
      o.connect(g);
      g.connect(this.ambientGain!);
      o.start(t);
      o.stop(t + 0.14);
    });
  }

  // leaves / paper rustle
  private playRustle(hp = 2200, gain = 0.035) {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = hp;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(gain, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0005, now + 0.3);
    src.connect(f);
    f.connect(g);
    g.connect(this.ambientGain!);
    src.start(now);
    src.stop(now + 0.33);
  }

  // fire crackle pop
  private playCrackle() {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const big = Math.random() < 0.14;
    const dur = big ? 0.05 + Math.random() * 0.04 : 0.012 + Math.random() * 0.03;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = big ? 1100 : 2200;
    const g = ctx.createGain();
    const gain = big ? 0.11 + Math.random() * 0.05 : 0.025 + Math.random() * 0.045;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(gain, now + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0004, now + dur);
    src.connect(hp);
    hp.connect(g);
    g.connect(this.ambientGain!);
    src.start(now);
    src.stop(now + dur + 0.02);
  }

  private stopAmbient() {
    this.ambientTimers.forEach((id) => clearTimeout(id));
    this.ambientTimers = [];
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
    }
    const nodes = this.ambientNodes;
    this.ambientNodes = [];
    window.setTimeout(() => {
      nodes.forEach((n) => {
        try {
          (n as any).stop && (n as any).stop();
        } catch {}
        try {
          n.disconnect();
        } catch {}
      });
    }, 260);
  }

  // a soft rain drip
  private playDrip() {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const f = 500 + Math.random() * 500;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f * 1.4, now);
    o.frequency.exponentialRampToValueAtTime(f, now + 0.04);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.022, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0004, now + 0.12);
    o.connect(g);
    g.connect(this.ambientGain!);
    o.start(now);
    o.stop(now + 0.14);
  }

  private async applyAmbient() {
    this.stopAmbient();
    const a = this.ambient;
    if (a === "off") return;

    const ctx = this.ctx!;
    let target = 0.22;

    // prefer a real field-recording file when present, else synthesize
    const buf = await this.loadFile(a);
    if (this.ambient !== a) return; // switched while loading

    if (buf) {
      this.playFileBed(buf);
      target = 0.4;
    } else if (a === "fire") {
      this.startBed("lowpass", 440, 0.5, 0.4);
      target = 0.24;
      this.scheduleSparse(() => this.playCrackle(), 60, 360);
    } else if (a === "rain") {
      // steady soft hiss + body + occasional drip
      this.startBed("bandpass", 2400, 0.4, 0.6);
      this.startBed("lowpass", 600, 0.5, 0.25);
      target = 0.18;
      this.scheduleSparse(() => this.playDrip(), 250, 1300);
    } else if (a === "forest") {
      const bed = this.startBed("lowpass", 480, 0.6, 0.5);
      this.addLfo(bed.g.gain, 0.09, 0.32);
      target = 0.2;
      this.scheduleSparse(() => this.playChirp(), 1500, 4000);
      this.scheduleSparse(() => this.playRustle(1400, 0.03), 5000, 12000);
    }

    this.ambientGain!.gain.cancelScheduledValues(ctx.currentTime);
    this.ambientGain!.gain.setValueAtTime(0.0001, ctx.currentTime);
    this.ambientGain!.gain.linearRampToValueAtTime(target, ctx.currentTime + 1.2);
  }
}

export const sound = new SoundEngine();
