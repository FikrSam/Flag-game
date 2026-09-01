// Web Audio API Synthesizer for rich, offline sound effects with automatic mobile unlock

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Load mute preference safely
    try {
      const saved = localStorage.getItem('flaggle_muted');
      this.isMuted = saved === 'true';
    } catch {
      this.isMuted = false;
    }

    // Auto-unlock audio on initial user gesture on window
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.unlock();
        ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach(ev => {
          window.removeEventListener(ev, unlock);
        });
      };
      ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach(ev => {
        window.addEventListener(ev, unlock, { passive: true, once: false });
      });
    }
  }

  public unlock() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // Ignore web audio creation errors in restricted environments
    }
  }

  private initCtx(): AudioContext | null {
    this.unlock();
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('flaggle_muted', String(this.isMuted));
    } catch {
      // Ignore storage errors
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playSelect() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio playback failsafe
    }
  }

  public playCorrect(streak: number = 1) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const baseFreq = streak >= 5 ? 587.33 : streak >= 3 ? 523.25 : 440; // D5, C5, or A4
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2]; // Major chord arpeggio

      notes.forEach((freq, idx) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        const startTime = ctx.currentTime + idx * 0.06;
        const duration = 0.25;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // Audio failsafe
    }
  }

  public playIncorrect() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      // Filter to soften the buzz
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio failsafe
    }
  }

  public playReveal() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const freqs = [330, 440, 554.37, 659.25, 880];
      freqs.forEach((freq, idx) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

        const startTime = ctx.currentTime + idx * 0.05;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.09, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // Audio failsafe
    }
  }

  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      // Fanfare melody: C4, G4, C5, E5, G5, C6 (triumphant)
      const melody = [
        { freq: 261.63, time: 0, dur: 0.15 },
        { freq: 392.00, time: 0.15, dur: 0.15 },
        { freq: 523.25, time: 0.30, dur: 0.18 },
        { freq: 659.25, time: 0.48, dur: 0.18 },
        { freq: 783.99, time: 0.66, dur: 0.22 },
        { freq: 1046.50, time: 0.88, dur: 0.60 }
      ];

      melody.forEach(note => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

        gain.gain.setValueAtTime(0, ctx.currentTime + note.time);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + note.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + note.time + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + note.time);
        osc.stop(ctx.currentTime + note.time + note.dur);
      });
    } catch {
      // Audio failsafe
    }
  }
}

export const sound = new SoundEngine();
