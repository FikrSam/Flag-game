// Web Audio API Synthesizer for rich, offline sound effects with reliable desktop/mobile auto-unlock

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

    // Auto-unlock audio on any user interaction across window and document
    if (typeof window !== 'undefined') {
      const unlockEvents = ['click', 'mousedown', 'pointerdown', 'touchstart', 'touchend', 'keydown'];
      const unlockHandler = () => {
        this.unlockAudio();
        unlockEvents.forEach(ev => {
          window.removeEventListener(ev, unlockHandler);
          document.removeEventListener(ev, unlockHandler);
        });
      };

      unlockEvents.forEach(ev => {
        window.addEventListener(ev, unlockHandler, { passive: true, capture: true });
        document.addEventListener(ev, unlockHandler, { passive: true, capture: true });
      });
    }
  }

  public unlockAudio(): AudioContext | null {
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
      // Audio failsafe
    }
    return this.ctx;
  }

  private getCtx(): AudioContext | null {
    if (!this.ctx) {
      this.unlockAudio();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('flaggle_muted', String(this.isMuted));
    } catch {
      // Ignore storage errors
    }
    if (!this.isMuted) {
      this.playSelect();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('flaggle_muted', String(this.isMuted));
    } catch {
      // Ignore storage errors
    }
  }

  private executeSound(fn: (ctx: AudioContext, now: number) => void) {
    if (this.isMuted) return;
    const ctx = this.getCtx();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        fn(ctx, ctx.currentTime);
      }).catch(() => {});
    } else {
      fn(ctx, ctx.currentTime);
    }
  }

  public playSelect() {
    this.executeSound((ctx, now) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.06);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
      } catch {
        // Audio playback failsafe
      }
    });
  }

  public playCorrect(streak: number = 1) {
    this.executeSound((ctx, now) => {
      try {
        const baseFreq = streak >= 5 ? 587.33 : streak >= 3 ? 523.25 : 440; // D5, C5, or A4
        const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2]; // Major chord arpeggio

        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          const startTime = now + idx * 0.06;
          const duration = 0.28;

          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + duration);
        });
      } catch {
        // Audio failsafe
      }
    });
  }

  public playIncorrect() {
    this.executeSound((ctx, now) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.2);

        gain.gain.setValueAtTime(0.20, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        // Filter to soften the buzz
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
      } catch {
        // Audio failsafe
      }
    });
  }

  public playReveal() {
    this.executeSound((ctx, now) => {
      try {
        const freqs = [330, 440, 554.37, 659.25, 880];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          const startTime = now + idx * 0.05;

          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.35);
        });
      } catch {
        // Audio failsafe
      }
    });
  }

  public playVictory() {
    this.executeSound((ctx, now) => {
      try {
        // Fanfare melody: C4, G4, C5, E5, G5, C6 (triumphant)
        const melody = [
          { freq: 261.63, time: 0, dur: 0.16 },
          { freq: 392.00, time: 0.16, dur: 0.16 },
          { freq: 523.25, time: 0.32, dur: 0.18 },
          { freq: 659.25, time: 0.50, dur: 0.18 },
          { freq: 783.99, time: 0.68, dur: 0.22 },
          { freq: 1046.50, time: 0.90, dur: 0.65 }
        ];

        melody.forEach(note => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          const noteStart = now + note.time;

          osc.frequency.setValueAtTime(note.freq, noteStart);

          gain.gain.setValueAtTime(0, noteStart);
          gain.gain.linearRampToValueAtTime(0.24, noteStart + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + note.dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(noteStart);
          osc.stop(noteStart + note.dur);
        });
      } catch {
        // Audio failsafe
      }
    });
  }
}

export const sound = new SoundEngine();
