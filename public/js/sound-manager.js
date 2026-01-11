
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem("soundEnabled") === "true";
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    // Resume context if it's suspended (browsers auto-suspend)
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem("soundEnabled", this.enabled);
    return this.enabled;
  }

  // Helper to play a tone
  playTone(freq, type, duration, volume = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playSent() {
    // Satisfying "pop" or "click" for sending
    // Sine wave starting at 600Hz dropping fast
    if (!this.enabled) return;
    this.playTone(600, "sine", 0.15, 0.1);
  }

  playReceived() {
    // Soft "bloop" for receiving
    // Sine wave starting at 400Hz
    if (!this.enabled) return;
    this.playTone(400, "sine", 0.15, 0.1);
  }

  playWhisper() {
    // Distinct "ding" for whispers
    // Two tones slightly separated
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Tone 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.frequency.setValueAtTime(800, now);
    gain1.gain.setValueAtTime(0.1, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Tone 2 (higher)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.frequency.setValueAtTime(1200, now + 0.1);
    gain2.gain.setValueAtTime(0.1, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.4);
  }
}

window.SoundManager = new SoundManager();
