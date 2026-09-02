/**
 * AMAZÔNIA BOBBLE: GUARDIÕES DA FLORESTA
 * audio.js - Motor de Efeitos Sonoros e Música Procedural com Web Audio API
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.musicVolume = 0.15;
    this.sfxVolume = 0.3;
  }

  // Inicializa o AudioContext com clique do usuário para evitar bloqueio do navegador
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBgm();
    } else {
      this.init();
      this.startBgm();
    }
    return this.isMuted;
  }

  // Som de Disparo do Canhão
  playShoot() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

      gain.gain.setValueAtTime(this.sfxVolume * 0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Som de Quique na Parede
  playWallBounce() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

      gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Som de Estouro de Bolha (Escala musical conforme o combo)
  playPop(combo = 1) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Notas da escala pentatônica da floresta
      const scale = [392, 440, 523.25, 587.33, 659.25, 783.99, 880]; // G4, A4, C5, D5, E5, G5, A5
      const note = scale[Math.min(combo - 1, scale.length - 1)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, now);
      osc.frequency.exponentialRampToValueAtTime(note * 1.5, now + 0.09);

      gain.gain.setValueAtTime(this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch (e) {}
  }

  // Som de Queda de Frutas Desconectadas (Cascata)
  playDrop(count = 1) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < Math.min(count, 5); i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const delay = i * 0.05;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500 - i * 60, now + delay);
        osc.frequency.exponentialRampToValueAtTime(200, now + delay + 0.15);

        gain.gain.setValueAtTime(this.sfxVolume * 0.5, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.15);
      }
    } catch (e) {}
  }

  // Som de Carga do Especial
  playSpecialCharge() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // Som de Especial Pronto (100% Carregado)
  playSpecialReady() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde C Maior brilhante
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(this.sfxVolume * 0.7, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch (e) {}
  }

  // Especial do Boitatá: Baforada de Fogo Incandescente
  playBoitataFire() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Ruído branco filtrado para simular o rugido das chamas
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.sfxVolume * 1.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.5);

      // Tom grave ascendente de impacto
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.4);
      oscGain.gain.setValueAtTime(this.sfxVolume * 0.7, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  // Especial do Boto: Explosão Mística de Águas
  playBotoWater() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Ondas senoidais moduladas (splash + magia)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.45);

      gain.gain.setValueAtTime(this.sfxVolume * 0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);

      // Brilho de magia rosa
      const sparkles = [659.25, 880, 1174.66, 1318.51];
      sparkles.forEach((freq, idx) => {
        const sOsc = this.ctx.createOscillator();
        const sGain = this.ctx.createGain();
        const t = now + idx * 0.07;
        sOsc.type = 'triangle';
        sOsc.frequency.setValueAtTime(freq, t);
        sGain.gain.setValueAtTime(this.sfxVolume * 0.4, t);
        sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        sOsc.connect(sGain);
        sGain.connect(this.ctx.destination);
        sOsc.start(t);
        sOsc.stop(t + 0.2);
      });
    } catch (e) {}
  }

  // Vitória da Fase
  playLevelClear() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 587.33, 659.25, 783.99, 1046.50]; // C, D, E, G, C(oitava)
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(this.sfxVolume * 0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch (e) {}
  }

  // Game Over
  playGameOver() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4 descida menor
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.16;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(this.sfxVolume * 0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch (e) {}
  }

  // Trilha Sonora Procedural da Floresta Amazônica (Marimba suave e ritmo tropical)
  startBgm() {
    if (this.isMuted || this.bgmPlaying || !this.ctx) return;
    this.bgmPlaying = true;

    const melody = [
      { note: 261.63, dur: 0.25 }, // C4
      { note: 329.63, dur: 0.25 }, // E4
      { note: 392.00, dur: 0.25 }, // G4
      { note: 440.00, dur: 0.25 }, // A4
      { note: 523.25, dur: 0.50 }, // C5
      { note: 392.00, dur: 0.25 }, // G4
      { note: 329.63, dur: 0.25 }, // E4
      { note: 293.66, dur: 0.50 }, // D4
      { note: 349.23, dur: 0.25 }, // F4
      { note: 440.00, dur: 0.25 }, // A4
      { note: 392.00, dur: 0.50 }, // G4
      { note: 329.63, dur: 0.50 }  // E4
    ];

    let step = 0;
    const playNextNote = () => {
      if (!this.bgmPlaying || this.isMuted || !this.ctx) return;

      const item = melody[step % melody.length];
      step++;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.note, now);

        // Ataque percussivo como xilofone de madeira / marimba
        gain.gain.setValueAtTime(this.musicVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur * 0.95);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + item.dur);

        this.bgmTimer = setTimeout(playNextNote, item.dur * 1000);
      } catch (e) {
        this.bgmPlaying = false;
      }
    };

    playNextNote();
  }

  stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sound = new SoundEngine();
