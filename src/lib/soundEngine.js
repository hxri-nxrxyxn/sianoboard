class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.convolver = null;
    this.reverbGain = null;
    this.dryGain = null;
    this.activeVoices = new Map();
    this.volume = 0.7;
    this.isMuted = false;
    this.isSustainPedalDown = false;
    this.sustainedVoices = new Set();
    this.touchCurve = 'normal'; // 'normal' | 'intimate' | 'concert'
    this.reverbEnabled = true;
    this.lastStrikeTime = 0;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.85;

    // Create algorithmic wooden concert hall reverb impulse
    this.createHallReverb();

    // Master chain: [dry + reverb] -> masterGain -> analyser -> destination
    this.dryGain = this.ctx.createGain();
    this.dryGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    this.dryGain.connect(this.masterGain);
    if (this.convolver) {
      this.convolver.connect(this.reverbGain);
      this.reverbGain.connect(this.masterGain);
    }

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  createHallReverb() {
    // Generate a natural acoustic recital hall impulse response with warm wood absorption
    const sampleRate = this.ctx.sampleRate;
    const length = Math.floor(sampleRate * 2.2); // 2.2s room decay
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    const decayTime = 1.6;
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      // Exponential decay envelope with warm high-frequency damping
      const envelope = Math.exp(-t / decayTime);
      const damping = Math.exp(-t * 2.5); // high frequencies decay faster in wooden room

      // Diffuse stereo reflections
      left[i] = (Math.random() * 2 - 1) * envelope * (0.6 + 0.4 * damping);
      right[i] = (Math.random() * 2 - 1) * envelope * (0.6 + 0.4 * damping);
    }

    this.convolver = this.ctx.createConvolver();
    this.convolver.buffer = impulse;
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setTouchCurve(curve) {
    this.touchCurve = curve;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.01
      );
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.01
      );
    }
    return this.isMuted;
  }

  toggleReverb() {
    this.reverbEnabled = !this.reverbEnabled;
    if (this.reverbGain && this.ctx) {
      this.reverbGain.gain.setTargetAtTime(
        this.reverbEnabled ? 0.35 : 0,
        this.ctx.currentTime,
        0.02
      );
    }
    return this.reverbEnabled;
  }

  setSustainPedal(isDown) {
    this.isSustainPedalDown = isDown;

    if (!isDown && this.ctx) {
      const t = this.ctx.currentTime;
      for (const keyId of this.sustainedVoices) {
        if (!this.activeVoices.has(keyId)) {
          this.releaseVoice(keyId, t);
        }
      }
      this.sustainedVoices.clear();
    }
  }

  playFeltHammerTransient(freq, t, velocity) {
    // Acoustic felt hammer impact transient
    const sampleRate = this.ctx.sampleRate;
    const duration = 0.02;
    const bufferSize = Math.floor(sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.18));
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(Math.min(freq * 3.5, 4500), t);
    filter.Q.value = 2.2;

    const gain = this.ctx.createGain();
    const hammerAmp = 0.07 * velocity;
    gain.gain.setValueAtTime(hammerAmp, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.dryGain);

    noiseSource.start(t);
    noiseSource.stop(t + duration + 0.005);
  }

  calculateVelocity() {
    const now = performance.now();
    const interval = now - this.lastStrikeTime;
    this.lastStrikeTime = now;

    // Organic micro-humanization (±3% subtle variation between finger strikes)
    const humanJitter = (Math.random() - 0.5) * 0.06;

    let base = 0.8;
    if (this.touchCurve === 'intimate') {
      base = 0.55;
    } else if (this.touchCurve === 'concert') {
      base = 1.0;
    } else {
      // Dynamic: faster typing intervals strike with slightly more energetic velocity
      if (interval < 120) {
        base = 0.95;
      } else if (interval < 250) {
        base = 0.82;
      } else {
        base = 0.72;
      }
    }

    return Math.max(0.3, Math.min(1.2, base + humanJitter));
  }

  keyDown(keyId, freq, midi = 60) {
    this.ensureContext();
    if (!this.ctx || this.isMuted || !freq) return;

    const t = this.ctx.currentTime;

    if (this.activeVoices.has(keyId)) {
      this.keyUp(keyId, true);
    }

    const velocity = this.calculateVelocity();

    // 1. Physical hammer transient
    this.playFeltHammerTransient(freq, t, velocity);

    // 2. Binaural Stereo Panning (Piano Spatial Field):
    // Bass strings sit on the left, treble strings on the right
    let panner = null;
    if (this.ctx.createStereoPanner) {
      panner = this.ctx.createStereoPanner();
      // midi 48 (C3) -> -0.42 (left), midi 84 (C6) -> +0.42 (right)
      const panPos = Math.max(-0.45, Math.min(0.45, (midi - 66) / 40));
      panner.pan.setValueAtTime(panPos, t);
    }

    // 3. Multi-harmonic string wire synthesis
    const voiceGain = this.ctx.createGain();
    const stringFilter = this.ctx.createBiquadFilter();

    // Fundamental (f0)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t);

    // 2nd Harmonic (2*f0 + inharmonic string stiffness dispersion)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.003, t);

    // 3rd Sparkle Harmonic
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3.008, t);

    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.24 * velocity, t);

    const osc3Gain = this.ctx.createGain();
    osc3Gain.gain.setValueAtTime(0.11 * velocity, t);

    // If bass note (freq < 200Hz), add rich woody body harmonic
    let bassOsc = null;
    if (freq < 220) {
      bassOsc = this.ctx.createOscillator();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(freq * 0.5, t); // sub octave warmth
      const bassGain = this.ctx.createGain();
      bassGain.gain.setValueAtTime(0.18, t);
      bassOsc.connect(bassGain);
      bassGain.connect(stringFilter);
      bassOsc.start(t);
    }

    // Dynamic Filter: Hit harder = brighter piano tone (higher cutoff)
    // Hit softer = warmer, darker, intimate tone
    stringFilter.type = 'lowpass';
    const initialCutoff = Math.min(freq * (3.5 + velocity * 3.0), 10000);
    const singingCutoff = Math.max(freq * 1.6, 350);
    stringFilter.frequency.setValueAtTime(initialCutoff, t);
    stringFilter.frequency.exponentialRampToValueAtTime(singingCutoff, t + 0.38);

    osc1.connect(stringFilter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(stringFilter);
    osc3.connect(osc3Gain);
    osc3Gain.connect(stringFilter);

    stringFilter.connect(voiceGain);

    // Connect to Binaural Panner or direct
    if (panner) {
      voiceGain.connect(panner);
      panner.connect(this.dryGain);
      if (this.convolver && this.reverbEnabled) {
        panner.connect(this.convolver);
      }
    } else {
      voiceGain.connect(this.dryGain);
      if (this.convolver && this.reverbEnabled) {
        voiceGain.connect(this.convolver);
      }
    }

    // Authentic Dual-Phase Grand Piano Decay:
    // Phase 1 (Prompt Decay): 0.32s initial hammer punch
    // Phase 2 (Singing Aftersound): 4.5s long singing decay
    const peakAmp = 0.34 * velocity;
    voiceGain.gain.setValueAtTime(0.0001, t);
    voiceGain.gain.linearRampToValueAtTime(peakAmp, t + 0.005);
    voiceGain.gain.exponentialRampToValueAtTime(peakAmp * 0.55, t + 0.32);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, t + 5.2);

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);

    const oscillators = [osc1, osc2, osc3];
    if (bassOsc) oscillators.push(bassOsc);

    const voiceData = {
      oscillators,
      gainNode: voiceGain,
      filter: stringFilter,
      panner,
      startTime: t
    };

    this.activeVoices.set(keyId, voiceData);
  }

  keyUp(keyId, immediate = false) {
    if (!this.ctx) return;

    if (this.isSustainPedalDown && !immediate) {
      this.sustainedVoices.add(keyId);
      this.activeVoices.delete(keyId);
      return;
    }

    this.releaseVoice(keyId, this.ctx.currentTime);
    this.activeVoices.delete(keyId);
    this.sustainedVoices.delete(keyId);
  }

  releaseVoice(keyId, t) {
    const voice = this.activeVoices.get(keyId);
    if (!voice) return;

    // Felt damper drops onto vibrating strings (~0.22s)
    const releaseTime = 0.22;
    voice.gainNode.gain.cancelScheduledValues(t);
    voice.gainNode.gain.setValueAtTime(Math.max(0.0001, voice.gainNode.gain.value), t);
    voice.gainNode.gain.exponentialRampToValueAtTime(0.0001, t + releaseTime);

    setTimeout(() => {
      voice.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (_) {}
      });
      voice.gainNode.disconnect();
      voice.filter.disconnect();
      if (voice.panner) voice.panner.disconnect();
    }, (releaseTime + 0.06) * 1000);
  }

  stopAllVoices() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    for (const keyId of this.activeVoices.keys()) {
      this.releaseVoice(keyId, t);
    }
    this.activeVoices.clear();
    this.sustainedVoices.clear();
  }
}

export const sound = new SoundEngine();
