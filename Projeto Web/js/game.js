/**
 * ==========================================================================
 * AMAZÔNIA BOBBLE: GUARDIÕES DA FLORESTA
 * game.js - Código Completo e Otimizado do Jogo (100% Compatível com file:// e Web)
 * ==========================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONSTANTES E CONFIGURAÇÕES CENTRAIS
  // ==========================================================================
  const CANVAS_WIDTH = 448;
  const CANVAS_HEIGHT = 640;

  // Grade Hexagonal (Puzzle Bobble clássico: 8 colunas pares, 7 ímpares)
  const GRID_COLS = 8;
  const GRID_COLS_ODD = 7;
  const GRID_MAX_ROWS = 14;
  const BUBBLE_RADIUS = 28;
  const ROW_HEIGHT = Math.round(BUBBLE_RADIUS * Math.sqrt(3)); // ~48.5px

  // Linha de perigo (Game Over)
  const DANGER_ROW = 10;
  const DANGER_Y = DANGER_ROW * ROW_HEIGHT + BUBBLE_RADIUS;

  // Canhão Lançador
  const CANNON_X = CANVAS_WIDTH / 2;
  const CANNON_Y = CANVAS_HEIGHT - 45;
  const BUBBLE_SPEED = 18;

  const MIN_ANGLE = Math.PI * 0.08; // ~15°
  const MAX_ANGLE = Math.PI * 0.92; // ~165°
  const ROTATION_SPEED = 0.045;

  // Frutas Regionais da Amazônia (Cores vivas e translúcidas)
  const FRUITS = {
    ACAI: {
      id: 'acai',
      name: 'Açaí',
      color: '#4a1555',
      rgba: '74, 21, 85',
      highlight: '#9c27b0',
      accent: '#e1bee7',
      symbol: '🫐'
    },
    MANGA: {
      id: 'manga',
      name: 'Manga',
      color: '#e65100',
      rgba: '230, 81, 0',
      highlight: '#ff9800',
      accent: '#ffe082',
      symbol: '🥭'
    },
    CUPUACU: {
      id: 'cupuacu',
      name: 'Cupuaçu',
      color: '#5d4037',
      rgba: '93, 64, 55',
      highlight: '#8d6e63',
      accent: '#d7ccc8',
      symbol: '🥥'
    },
    GUARANA: {
      id: 'guarana',
      name: 'Guaraná',
      color: '#b71c1c',
      rgba: '183, 28, 28',
      highlight: '#f44336',
      accent: '#ffcdd2',
      symbol: '👁️'
    },
    BURITI: {
      id: 'buriti',
      name: 'Buriti',
      color: '#bf360c',
      rgba: '191, 54, 12',
      highlight: '#ff5722',
      accent: '#ffccbc',
      symbol: '🌴'
    },
    CASTANHA: {
      id: 'castanha',
      name: 'Castanha-do-Pará',
      color: '#3e2723',
      rgba: '62, 39, 35',
      highlight: '#6d4c41',
      accent: '#bcaaa4',
      symbol: '🌰'
    }
  };

  // Personagens do Folclore
  const CHARACTERS = {
    BOITATA: {
      id: 'boitata',
      name: 'Boitatá',
      favoriteFruit: 'acai',
      favoriteFruitName: 'Açaí',
      avatarEmoji: '🐍🔥',
      themeColor: '#FF4500',
      specialName: 'Baforada de Fogo',
      specialColor: '#FF2200',
      specialSymbol: '🔥'
    },
    BOTO: {
      id: 'boto',
      name: 'Boto Cor-de-Rosa',
      favoriteFruit: 'manga',
      favoriteFruitName: 'Manga',
      avatarEmoji: '🐬✨',
      themeColor: '#FF69B4',
      specialName: 'Explosão Encantada',
      specialColor: '#FF1493',
      specialSymbol: '💖'
    }
  };

  const SPECIAL_CHARGE_MAX = 100;
  const SPECIAL_CHARGE_PER_FRUIT = 20; // 5 frutas favoritas = 100%

  // ==========================================================================
  // 2. MATRIZES DAS 10 FASES
  // ==========================================================================
  const LEVELS = [
    // FASE 1: Entrada da Mata
    {
      level: 1,
      name: 'Entrada da Mata',
      missLimit: 6,
      grid: [
        ['acai', 'acai', 'manga', 'manga', 'acai', 'acai', 'manga', 'manga'],
        ['acai', 'manga', 'acai', 'manga', 'acai', 'manga', 'acai'],
        ['manga', 'manga', 'acai', 'acai', 'manga', 'manga', 'acai', 'acai']
      ]
    },
    // FASE 2: Copa das Castanheiras
    {
      level: 2,
      name: 'Copa das Castanheiras',
      missLimit: 6,
      grid: [
        ['castanha', 'castanha', 'cupuacu', 'cupuacu', 'castanha', 'castanha', 'cupuacu', 'cupuacu'],
        ['castanha', 'cupuacu', 'manga', 'manga', 'cupuacu', 'castanha', 'cupuacu'],
        ['acai', 'acai', 'castanha', 'castanha', 'acai', 'acai', 'cupuacu', 'cupuacu'],
        ['acai', 'manga', 'castanha', 'cupuacu', 'manga', 'acai', 'castanha']
      ]
    },
    // FASE 3: Rio Amazonas
    {
      level: 3,
      name: 'Rio Amazonas',
      missLimit: 5,
      grid: [
        ['guarana', 'guarana', 'acai', 'acai', 'manga', 'manga', 'guarana', 'guarana'],
        ['guarana', 'acai', 'acai', 'manga', 'manga', 'guarana', 'guarana'],
        ['acai', 'acai', 'manga', 'manga', 'guarana', 'guarana', 'acai', 'acai'],
        ['manga', 'manga', 'guarana', 'guarana', 'acai', 'acai', 'manga']
      ]
    },
    // FASE 4: Igarapé Encantado
    {
      level: 4,
      name: 'Igarapé Encantado',
      missLimit: 5,
      grid: [
        ['buriti', 'buriti', 'cupuacu', 'cupuacu', 'buriti', 'buriti', 'cupuacu', 'cupuacu'],
        ['buriti', 'cupuacu', 'acai', 'acai', 'cupuacu', 'buriti', 'cupuacu'],
        ['manga', 'buriti', 'cupuacu', 'acai', 'acai', 'cupuacu', 'buriti', 'manga'],
        ['manga', 'manga', 'buriti', 'acai', 'buriti', 'manga', 'manga'],
        ['acai', 'acai', 'manga', 'buriti', 'manga', 'acai', 'acai', 'acai']
      ]
    },
    // FASE 5: Coração da Floresta
    {
      level: 5,
      name: 'Coração da Floresta',
      missLimit: 5,
      grid: [
        ['guarana', 'castanha', 'guarana', 'castanha', 'guarana', 'castanha', 'guarana', 'castanha'],
        ['acai', 'acai', 'manga', 'manga', 'acai', 'acai', 'manga'],
        ['castanha', 'acai', 'guarana', 'guarana', 'acai', 'castanha', 'manga', 'manga'],
        ['castanha', 'guarana', 'buriti', 'buriti', 'guarana', 'castanha', 'manga'],
        ['cupuacu', 'cupuacu', 'buriti', 'buriti', 'cupuacu', 'cupuacu', 'acai', 'acai']
      ]
    },
    // FASE 6: Encontro das Águas
    {
      level: 6,
      name: 'Encontro das Águas',
      missLimit: 5,
      grid: [
        ['acai', 'acai', 'acai', 'acai', 'manga', 'manga', 'manga', 'manga'],
        ['acai', 'acai', 'acai', 'manga', 'manga', 'manga', 'manga'],
        ['castanha', 'castanha', 'acai', 'acai', 'manga', 'manga', 'cupuacu', 'cupuacu'],
        ['castanha', 'acai', 'guarana', 'manga', 'cupuacu', 'cupuacu', 'cupuacu'],
        ['guarana', 'guarana', 'guarana', 'buriti', 'buriti', 'buriti', 'buriti', 'buriti']
      ]
    },
    // FASE 7: Dança do Fogo
    {
      level: 7,
      name: 'Dança do Fogo',
      missLimit: 4,
      grid: [
        ['guarana', 'guarana', 'acai', 'acai', 'guarana', 'guarana', 'acai', 'acai'],
        ['acai', 'guarana', 'guarana', 'acai', 'guarana', 'guarana', 'acai'],
        ['buriti', 'acai', 'guarana', 'castanha', 'castanha', 'guarana', 'acai', 'buriti'],
        ['buriti', 'buriti', 'castanha', 'manga', 'castanha', 'buriti', 'buriti'],
        ['manga', 'manga', 'manga', 'manga', 'manga', 'manga', 'manga', 'manga'],
        ['cupuacu', 'cupuacu', 'acai', 'acai', 'acai', 'cupuacu', 'cupuacu']
      ]
    },
    // FASE 8: Labirinto dos Cipós
    {
      level: 8,
      name: 'Labirinto dos Cipós',
      missLimit: 4,
      grid: [
        ['castanha', 'cupuacu', 'castanha', 'cupuacu', 'castanha', 'cupuacu', 'castanha', 'cupuacu'],
        ['castanha', null, 'castanha', null, 'castanha', null, 'castanha'],
        ['manga', 'manga', 'acai', 'acai', 'manga', 'manga', 'acai', 'acai'],
        ['manga', null, 'acai', null, 'manga', null, 'acai'],
        ['guarana', 'buriti', 'guarana', 'buriti', 'guarana', 'buriti', 'guarana', 'buriti'],
        ['guarana', 'guarana', 'buriti', 'buriti', 'guarana', 'guarana', 'buriti']
      ]
    },
    // FASE 9: Vórtice do Boto
    {
      level: 9,
      name: 'Vórtice do Boto',
      missLimit: 4,
      grid: [
        ['manga', 'manga', 'manga', 'manga', 'manga', 'manga', 'manga', 'manga'],
        ['manga', 'acai', 'acai', 'cupuacu', 'cupuacu', 'acai', 'manga'],
        ['buriti', 'buriti', 'guarana', 'guarana', 'guarana', 'buriti', 'buriti', 'buriti'],
        ['buriti', 'castanha', 'castanha', 'castanha', 'buriti', 'buriti', 'buriti'],
        ['acai', 'acai', 'manga', 'manga', 'manga', 'acai', 'acai', 'acai'],
        ['cupuacu', 'cupuacu', 'guarana', 'guarana', 'cupuacu', 'cupuacu', 'cupuacu']
      ]
    },
    // FASE 10: Guardião Supremo
    {
      level: 10,
      name: 'Guardião Supremo',
      missLimit: 4,
      grid: [
        ['acai', 'manga', 'cupuacu', 'guarana', 'buriti', 'castanha', 'acai', 'manga'],
        ['acai', 'manga', 'cupuacu', 'guarana', 'buriti', 'castanha', 'acai'],
        ['castanha', 'buriti', 'guarana', 'cupuacu', 'manga', 'acai', 'castanha', 'buriti'],
        ['castanha', 'buriti', 'guarana', 'cupuacu', 'manga', 'acai', 'castanha'],
        ['acai', 'acai', 'manga', 'manga', 'guarana', 'guarana', 'buriti', 'buriti'],
        ['cupuacu', 'cupuacu', 'castanha', 'castanha', 'acai', 'acai', 'manga'],
        ['guarana', 'guarana', 'buriti', 'buriti', 'cupuacu', 'cupuacu', 'castanha', 'castanha']
      ]
    }
  ];

  // ==========================================================================
  // 3. MOTOR DE ÁUDIO PROCEDURAL (Web Audio API)
  // ==========================================================================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.bgmPlaying = false;
      this.bgmTimer = null;
      this.musicVolume = 0.15;
      this.sfxVolume = 0.3;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
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
      } catch (e) {}
    }

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

    playPop(combo = 1) {
      if (this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const scale = [392, 440, 523.25, 587.33, 659.25, 783.99, 880];
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

    playSpecialReady() {
      if (this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
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

    playBoitataFire() {
      if (this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.5);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

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
      } catch (e) {}
    }

    playBotoWater() {
      if (this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
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
      } catch (e) {}
    }

    playLevelClear() {
      if (this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [523.25, 587.33, 659.25, 783.99, 1046.50];
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

    playGameOver() {
      if (this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [440, 392, 349.23, 293.66];
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

    startBgm() {
      if (this.isMuted || this.bgmPlaying || !this.ctx) return;
      this.bgmPlaying = true;
      const melody = [
        { note: 261.63, dur: 0.25 },
        { note: 329.63, dur: 0.25 },
        { note: 392.00, dur: 0.25 },
        { note: 440.00, dur: 0.25 },
        { note: 523.25, dur: 0.50 },
        { note: 392.00, dur: 0.25 },
        { note: 329.63, dur: 0.25 },
        { note: 293.66, dur: 0.50 },
        { note: 349.23, dur: 0.25 },
        { note: 440.00, dur: 0.25 },
        { note: 392.00, dur: 0.50 },
        { note: 329.63, dur: 0.50 }
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

  const sound = new SoundEngine();

  // ==========================================================================
  // 4. SISTEMA DE PARTÍCULAS E EFEITOS
  // ==========================================================================
  class ParticleSystem {
    constructor() {
      this.particles = [];
      this.fallingBubbles = [];
      this.floatingTexts = [];
      this.shockwaves = [];
      this.screenShake = 0;
    }

    addScreenShake(intensity = 6) {
      this.screenShake = Math.max(this.screenShake, intensity);
    }

    createFruitPop(x, y, fruitKey, count = 12) {
      const fruit = FRUITS[fruitKey.toUpperCase()] || FRUITS.ACAI;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          radius: 3 + Math.random() * 4,
          color: Math.random() > 0.4 ? fruit.color : fruit.highlight,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.03,
          gravity: 0.15,
          type: 'circle'
        });
      }
    }

    createFireBlast(x, y, count = 35) {
      this.addScreenShake(12);
      this.shockwaves.push({
        x, y,
        radius: 10,
        maxRadius: 100,
        color: '#FF4500',
        alpha: 1,
        speed: 6
      });

      const colors = ['#FF0000', '#FF4500', '#FFA500', '#FFFF00', '#8B0000'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 8;
        this.particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          radius: 4 + Math.random() * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.015 + Math.random() * 0.025,
          gravity: -0.05,
          type: 'circle'
        });
      }
    }

    createWaterBlast(x, y, count = 35) {
      this.addScreenShake(10);
      this.shockwaves.push({
        x, y,
        radius: 10,
        maxRadius: 120,
        color: '#FF69B4',
        alpha: 1,
        speed: 7
      });

      const colors = ['#FF69B4', '#FF1493', '#00E5FF', '#FFFFFF', '#E0F7FA'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 7;
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 3 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.02 + Math.random() * 0.02,
          gravity: 0.12,
          type: Math.random() > 0.5 ? 'sparkle' : 'circle'
        });
      }
    }

    addFallingBubble(x, y, fruitKey) {
      this.fallingBubbles.push({
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: -2 - Math.random() * 3,
        gravity: 0.45,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        fruitKey,
        alpha: 1
      });
    }

    addFloatingText(text, x, y, color = '#FFD700', fontSize = 20) {
      this.floatingTexts.push({
        text, x, y,
        vy: -2,
        color,
        fontSize,
        alpha: 1,
        decay: 0.018
      });
    }

    update() {
      if (this.screenShake > 0) {
        this.screenShake *= 0.88;
        if (this.screenShake < 0.1) this.screenShake = 0;
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;
        p.radius *= 0.98;
        if (p.alpha <= 0 || p.radius <= 0.5) this.particles.splice(i, 1);
      }

      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.radius += sw.speed;
        sw.alpha = 1 - (sw.radius / sw.maxRadius);
        if (sw.radius >= sw.maxRadius || sw.alpha <= 0) this.shockwaves.splice(i, 1);
      }

      for (let i = this.fallingBubbles.length - 1; i >= 0; i--) {
        const b = this.fallingBubbles[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += b.gravity;
        b.rotation += b.rotationSpeed;
        if (b.y > CANVAS_HEIGHT + 50) this.fallingBubbles.splice(i, 1);
      }

      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= ft.decay;
        if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
      }
    }

    render(ctx) {
      ctx.save();

      for (const sw of this.shockwaves) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 6 * sw.alpha;
        ctx.globalAlpha = sw.alpha;
        ctx.stroke();
        ctx.restore();
      }

      for (const b of this.fallingBubbles) {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);
        ctx.globalAlpha = b.alpha;
        const fruit = FRUITS[b.fruitKey.toUpperCase()] || FRUITS.ACAI;
        
        ctx.beginPath();
        ctx.arc(0, 0, BUBBLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${fruit.rgba || '100,100,100'}, 0.65)`;
        ctx.fill();
        ctx.strokeStyle = fruit.accent;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fruit.symbol, 0, 2);
        ctx.restore();
      }

      for (const p of this.particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (const ft of this.floatingTexts) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = `bold ${ft.fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 4;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();
    }

    clear() {
      this.particles = [];
      this.fallingBubbles = [];
      this.floatingTexts = [];
      this.shockwaves = [];
      this.screenShake = 0;
    }
  }

  // ==========================================================================
  // 5. GRADE HEXAGONAL (HexGrid)
  // ==========================================================================
  class HexGrid {
    constructor() {
      this.rows = GRID_MAX_ROWS;
      this.offsetY = 0;
      this.grid = [];
      this.reset();
    }

    reset() {
      this.offsetY = 0;
      this.grid = [];
      for (let r = 0; r < this.rows; r++) {
        const cols = this.getColsInRow(r);
        this.grid[r] = new Array(cols).fill(null);
      }
    }

    getColsInRow(row) {
      return (row % 2 === 0) ? GRID_COLS : GRID_COLS_ODD;
    }

    getCellCenter(row, col) {
      const isEven = (row % 2 === 0);
      const startX = isEven ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2;
      const x = startX + col * (BUBBLE_RADIUS * 2);
      const y = this.offsetY + row * ROW_HEIGHT + BUBBLE_RADIUS;
      return { x, y };
    }

    isValidCell(row, col) {
      if (row < 0 || row >= this.rows) return false;
      if (col < 0 || col >= this.getColsInRow(row)) return false;
      return true;
    }

    getNeighbors(row, col) {
      const neighbors = [];
      const isEven = (row % 2 === 0);
      const offsets = isEven ? [
        { r: 0, c: -1 }, { r: 0, c: 1 },
        { r: -1, c: -1 }, { r: -1, c: 0 },
        { r: 1, c: -1 }, { r: 1, c: 0 }
      ] : [
        { r: 0, c: -1 }, { r: 0, c: 1 },
        { r: -1, c: 0 }, { r: -1, c: 1 },
        { r: 1, c: 0 }, { r: 1, c: 1 }
      ];

      for (const offset of offsets) {
        const nr = row + offset.r;
        const nc = col + offset.c;
        if (this.isValidCell(nr, nc)) {
          neighbors.push({ row: nr, col: nc });
        }
      }
      return neighbors;
    }

    loadLevel(levelLayout) {
      this.reset();
      for (let r = 0; r < levelLayout.length; r++) {
        if (r >= this.rows) break;
        const rowData = levelLayout[r];
        const maxCols = this.getColsInRow(r);
        for (let c = 0; c < rowData.length; c++) {
          if (c >= maxCols) break;
          this.grid[r][c] = rowData[c] ? rowData[c].toLowerCase() : null;
        }
      }
    }

    snapToGrid(x, y) {
      let bestDist = Infinity;
      let bestCell = null;
      for (let r = 0; r < this.rows; r++) {
        const cols = this.getColsInRow(r);
        for (let c = 0; c < cols; c++) {
          if (this.grid[r][c] === null) {
            const center = this.getCellCenter(r, c);
            const dist = Math.hypot(x - center.x, y - center.y);
            const hasNeighbor = (r === 0) || this.getNeighbors(r, c).some(n => this.grid[n.row][n.col] !== null);
            if (hasNeighbor && dist < bestDist) {
              bestDist = dist;
              bestCell = { row: r, col: c };
            }
          }
        }
      }
      return bestCell;
    }

    setBubble(row, col, fruitKey) {
      if (this.isValidCell(row, col)) {
        this.grid[row][col] = fruitKey ? fruitKey.toLowerCase() : null;
      }
    }

    getBubble(row, col) {
      if (!this.isValidCell(row, col)) return null;
      return this.grid[row][col];
    }

    findMatchingCluster(startRow, startCol, fruitKey) {
      if (!this.isValidCell(startRow, startCol)) return [];
      const target = fruitKey.toLowerCase();
      const cluster = [];
      const visited = new Set();
      const queue = [{ row: startRow, col: startCol }];
      visited.add(`${startRow},${startCol}`);

      while (queue.length > 0) {
        const current = queue.shift();
        cluster.push(current);
        const neighbors = this.getNeighbors(current.row, current.col);
        for (const n of neighbors) {
          const key = `${n.row},${n.col}`;
          if (!visited.has(key)) {
            if (this.getBubble(n.row, n.col) === target) {
              visited.add(key);
              queue.push(n);
            }
          }
        }
      }
      return cluster;
    }

    removeBubbles(cells) {
      for (const cell of cells) {
        this.setBubble(cell.row, cell.col, null);
      }
    }

    findFloatingBubbles() {
      const anchored = new Set();
      const queue = [];
      const colsTop = this.getColsInRow(0);

      for (let c = 0; c < colsTop; c++) {
        if (this.grid[0][c] !== null) {
          anchored.add(`0,${c}`);
          queue.push({ row: 0, col: c });
        }
      }

      while (queue.length > 0) {
        const current = queue.shift();
        const neighbors = this.getNeighbors(current.row, current.col);
        for (const n of neighbors) {
          const key = `${n.row},${n.col}`;
          if (!anchored.has(key) && this.getBubble(n.row, n.col) !== null) {
            anchored.add(key);
            queue.push(n);
          }
        }
      }

      const floating = [];
      for (let r = 0; r < this.rows; r++) {
        const cols = this.getColsInRow(r);
        for (let c = 0; c < cols; c++) {
          const fruit = this.grid[r][c];
          if (fruit !== null && !anchored.has(`${r},${c}`)) {
            const center = this.getCellCenter(r, c);
            floating.push({ row: r, col: c, x: center.x, y: center.y, fruitKey: fruit });
            this.setBubble(r, c, null);
          }
        }
      }
      return floating;
    }

    getBubblesInRadius(centerRow, centerCol, radiusCells = 2) {
      const affected = [];
      const targetCenter = this.getCellCenter(centerRow, centerCol);
      const maxPixelDist = radiusCells * (BUBBLE_RADIUS * 2.2);

      for (let r = 0; r < this.rows; r++) {
        const cols = this.getColsInRow(r);
        for (let c = 0; c < cols; c++) {
          const fruit = this.grid[r][c];
          if (fruit !== null) {
            const pos = this.getCellCenter(r, c);
            const dist = Math.hypot(pos.x - targetCenter.x, pos.y - targetCenter.y);
            if (dist <= maxPixelDist) {
              affected.push({ row: r, col: c, fruitKey: fruit, x: pos.x, y: pos.y });
            }
          }
        }
      }
      return affected;
    }

    getBubblesInFirePath(targetRow, targetCol) {
      const affected = [];
      const center = this.getCellCenter(targetRow, targetCol);
      for (let r = 0; r <= targetRow + 1 && r < this.rows; r++) {
        const cols = this.getColsInRow(r);
        for (let c = 0; c < cols; c++) {
          const fruit = this.grid[r][c];
          if (fruit !== null) {
            const pos = this.getCellCenter(r, c);
            if (Math.abs(pos.x - center.x) <= BUBBLE_RADIUS * 2.8) {
              affected.push({ row: r, col: c, fruitKey: fruit, x: pos.x, y: pos.y });
            }
          }
        }
      }
      return affected;
    }

    getActiveFruits() {
      const fruits = new Set();
      for (let r = 0; r < this.rows; r++) {
        const cols = this.getColsInRow(r);
        for (let c = 0; c < cols; c++) {
          if (this.grid[r][c] !== null) fruits.add(this.grid[r][c]);
        }
      }
      return Array.from(fruits);
    }

    isClear() {
      for (let r = 0; r < this.rows; r++) {
        const cols = this.getColsInRow(r);
        for (let c = 0; c < cols; c++) {
          if (this.grid[r][c] !== null) return false;
        }
      }
      return true;
    }

    isDangerExceeded() {
      for (let r = DANGER_ROW; r < this.rows; r++) {
        const cols = this.getColsInRow(r);
        for (let c = 0; c < cols; c++) {
          if (this.grid[r][c] !== null) return true;
        }
      }
      return false;
    }

    render(ctx) {
      ctx.save();
      // Linha de Perigo
      ctx.beginPath();
      ctx.setLineDash([8, 6]);
      ctx.moveTo(0, DANGER_Y);
      ctx.lineTo(CANVAS_WIDTH, DANGER_Y);
      ctx.strokeStyle = 'rgba(231, 76, 60, 0.6)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
      ctx.textAlign = 'right';
      ctx.fillText('LINHA DE PERIGO ⚠️', CANVAS_WIDTH - 12, DANGER_Y - 6);

      // Renderizar Bolhas da Grade
      for (let r = 0; r < this.rows; r++) {
        const cols = this.getColsInRow(r);
        for (let c = 0; c < cols; c++) {
          const fruitKey = this.grid[r][c];
          if (fruitKey !== null) {
            const { x, y } = this.getCellCenter(r, c);
            this.drawBubble(ctx, x, y, fruitKey);
          }
        }
      }

      ctx.fillStyle = '#1b3815';
      ctx.fillRect(0, 0, CANVAS_WIDTH, 6);
      ctx.restore();
    }

    // Desenha bolha translúcida brilhante com alto contraste nas frutas
    drawBubble(ctx, x, y, fruitKey, isSpecial = false, specialColor = '#FF4500', specialSymbol = null) {
      ctx.save();
      ctx.translate(x, y);

      // 1. RENDERIZAÇÃO DE BOLHA ESPECIAL (Lendária)
      if (isSpecial) {
        const pulse = Math.sin(Date.now() * 0.008) * 4;
        
        // Aura externa radiante
        ctx.beginPath();
        ctx.arc(0, 0, BUBBLE_RADIUS + 6 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = specialColor;
        ctx.shadowColor = specialColor;
        ctx.shadowBlur = 20;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Esfera mística do especial
        const spGrad = ctx.createRadialGradient(-6, -6, 2, 0, 0, BUBBLE_RADIUS);
        if (specialColor === '#FF2200' || specialColor === '#FF4500') {
          // Fogo do Boitatá
          spGrad.addColorStop(0, '#FFFF88');
          spGrad.addColorStop(0.4, '#FF4500');
          spGrad.addColorStop(1, '#8B0000');
        } else {
          // Água/Magia do Boto
          spGrad.addColorStop(0, '#FFFFFF');
          spGrad.addColorStop(0.4, '#FF69B4');
          spGrad.addColorStop(1, '#4A148C');
        }

        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.arc(0, 0, BUBBLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = spGrad;
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Ícone do Especial (🔥 ou 💖)
        ctx.font = '25px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
        ctx.fillText(specialSymbol || '⚡', 0, 2);
        ctx.restore();
        return;
      }

      // 2. RENDERIZAÇÃO DE BOLHA NORMAL (Translúcida com Alto Contraste)
      const fruit = FRUITS[fruitKey.toUpperCase()] || FRUITS.ACAI;
      const rgbaBase = fruit.rgba || '100, 100, 100';

      // Sombra suave
      ctx.beginPath();
      ctx.arc(2, 2, BUBBLE_RADIUS - 1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fill();

      // Esfera de vidro/água translúcida
      const grad = ctx.createRadialGradient(-7, -7, 3, 0, 0, BUBBLE_RADIUS);
      grad.addColorStop(0, `rgba(${rgbaBase}, 0.7)`);
      grad.addColorStop(0.55, `rgba(${rgbaBase}, 0.45)`);
      grad.addColorStop(1, `rgba(${rgbaBase}, 0.2)`);

      ctx.beginPath();
      ctx.arc(0, 0, BUBBLE_RADIUS - 1, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Borda luminosa nítida
      ctx.strokeStyle = fruit.accent;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Fundo suave branco atrás do emoji para contraste perfeito
      ctx.beginPath();
      ctx.arc(0, 0, BUBBLE_RADIUS * 0.58, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.fill();

      // Reflexo especular no canto superior esquerdo (brilho de bolha de sabão/água)
      ctx.beginPath();
      ctx.ellipse(-7, -9, 7, 3.5, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fill();

      // Arco de luz inferior
      ctx.beginPath();
      ctx.arc(0, 0, BUBBLE_RADIUS - 3, 0.3, 1.2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Ícone da Fruta Amazônica com leitura nítida
      ctx.font = '23px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 4;
      ctx.fillText(fruit.symbol, 0, 2);

      ctx.restore();
    }
  }

  // ==========================================================================
  // 6. CANHÃO LANÇADOR E CONTROLES (Shooter)
  // ==========================================================================
  class Shooter {
    constructor(canvas) {
      this.canvas = canvas;
      this.angle = Math.PI / 2;
      this.projectile = null;
      this.currentFruit = 'acai';
      this.nextFruit = 'manga';
      this.isSpecialLoaded = false;
      this.character = CHARACTERS.BOITATA;

      this.keys = { left: false, right: false };
      this.isTouchAiming = false;
      this.fireRequested = false;

      this.initEventListeners();
    }

    setCharacter(charObj) {
      this.character = charObj;
    }

    getRandomFruit(activeFruits = []) {
      if (!activeFruits || activeFruits.length === 0) {
        const keys = Object.keys(FRUITS);
        return keys[Math.floor(Math.random() * keys.length)].toLowerCase();
      }
      return activeFruits[Math.floor(Math.random() * activeFruits.length)].toLowerCase();
    }

    reload(activeFruits = []) {
      // Se a bolha especial estiver engatilhada, preserva ela!
      if (this.isSpecialLoaded) {
        return;
      }
      this.currentFruit = this.nextFruit;
      this.nextFruit = this.getRandomFruit(activeFruits);
    }

    loadSpecial() {
      this.isSpecialLoaded = true;
      this.currentFruit = this.character.favoriteFruit;
    }

    initEventListeners() {
      // 1. Teclado
      window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          this.keys.left = true;
          e.preventDefault();
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          this.keys.right = true;
          e.preventDefault();
        }
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
          this.fireRequested = true;
          e.preventDefault();
        }
      });

      window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
      });

      // 2. Mouse
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        this.aimAt(mouseX, mouseY);
      });

      this.canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) this.fireRequested = true;
      });

      // 3. Touchscreen Smartphone
      this.canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
          this.isTouchAiming = true;
          const rect = this.canvas.getBoundingClientRect();
          const scaleX = CANVAS_WIDTH / rect.width;
          const scaleY = CANVAS_HEIGHT / rect.height;
          const touchX = (e.touches[0].clientX - rect.left) * scaleX;
          const touchY = (e.touches[0].clientY - rect.top) * scaleY;
          this.aimAt(touchX, touchY);
        }
      }, { passive: false });

      this.canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (this.isTouchAiming && e.touches.length > 0) {
          const rect = this.canvas.getBoundingClientRect();
          const scaleX = CANVAS_WIDTH / rect.width;
          const scaleY = CANVAS_HEIGHT / rect.height;
          const touchX = (e.touches[0].clientX - rect.left) * scaleX;
          const touchY = (e.touches[0].clientY - rect.top) * scaleY;
          this.aimAt(touchX, touchY);
        }
      }, { passive: false });

      this.canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (this.isTouchAiming) {
          this.isTouchAiming = false;
          this.fireRequested = true;
        }
      }, { passive: false });
    }

    aimAt(targetX, targetY) {
      const dx = targetX - CANNON_X;
      const dy = CANNON_Y - targetY;
      if (dy > 15) {
        const newAngle = Math.atan2(dy, -dx);
        this.angle = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, newAngle));
      }
    }

    update(onFireCallback) {
      if (this.keys.left) this.angle = Math.max(MIN_ANGLE, this.angle - ROTATION_SPEED);
      if (this.keys.right) this.angle = Math.min(MAX_ANGLE, this.angle + ROTATION_SPEED);

      if (this.fireRequested && !this.projectile) {
        this.fireRequested = false;
        this.fire(onFireCallback);
      } else {
        this.fireRequested = false;
      }
    }

    fire(onFireCallback) {
      if (this.projectile) return;
      const vx = -Math.cos(this.angle) * BUBBLE_SPEED;
      const vy = -Math.sin(this.angle) * BUBBLE_SPEED;

      this.projectile = {
        x: CANNON_X,
        y: CANNON_Y,
        vx, vy,
        fruitKey: this.currentFruit,
        isSpecial: this.isSpecialLoaded,
        character: this.character.id
      };

      if (this.isSpecialLoaded) {
        this.isSpecialLoaded = false;
      }

      if (onFireCallback) onFireCallback(this.projectile);
    }

    render(ctx, grid) {
      ctx.save();
      if (!this.projectile) this.drawAimGuide(ctx, grid);
      this.drawCannonBarrel(ctx);
      
      // Desenha bolha carregada no canhão
      if (!this.projectile) {
        grid.drawBubble(
          ctx,
          CANNON_X,
          CANNON_Y,
          this.currentFruit,
          this.isSpecialLoaded,
          this.character.specialColor,
          this.character.specialSymbol
        );
      }

      this.drawNextBubble(ctx, grid);
      this.drawCharacterMascot(ctx);
      ctx.restore();
    }

    drawAimGuide(ctx, grid) {
      ctx.save();
      let curX = CANNON_X;
      let curY = CANNON_Y;
      let dirX = -Math.cos(this.angle);
      let dirY = -Math.sin(this.angle);

      const stepSize = 10;
      const maxSteps = 70;
      let steps = 0;
      let collided = false;

      ctx.fillStyle = this.isSpecialLoaded ? this.character.specialColor : 'rgba(255, 255, 255, 0.75)';
      ctx.shadowColor = this.isSpecialLoaded ? this.character.specialColor : '#A7F3D0';
      ctx.shadowBlur = this.isSpecialLoaded ? 10 : 4;

      while (steps < maxSteps && !collided && curY > BUBBLE_RADIUS) {
        curX += dirX * stepSize;
        curY += dirY * stepSize;
        steps++;

        if (curX <= BUBBLE_RADIUS) {
          curX = BUBBLE_RADIUS;
          dirX = -dirX;
        } else if (curX >= CANVAS_WIDTH - BUBBLE_RADIUS) {
          curX = CANVAS_WIDTH - BUBBLE_RADIUS;
          dirX = -dirX;
        }

        for (let r = 0; r < grid.rows; r++) {
          const cols = grid.getColsInRow(r);
          for (let c = 0; c < cols; c++) {
            if (grid.grid[r][c] !== null) {
              const center = grid.getCellCenter(r, c);
              const dist = Math.hypot(curX - center.x, curY - center.y);
              if (dist < BUBBLE_RADIUS * 1.8) {
                collided = true;
                break;
              }
            }
          }
          if (collided) break;
        }

        if (steps % 2 === 0) {
          ctx.beginPath();
          const dotRadius = this.isSpecialLoaded ? 3.5 : 2.5;
          ctx.arc(curX, curY, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    drawCannonBarrel(ctx) {
      ctx.save();
      ctx.translate(CANNON_X, CANNON_Y);
      ctx.rotate(this.angle - Math.PI / 2);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(-14, -58, 28, 50);

      const barrelGrad = ctx.createLinearGradient(-12, 0, 12, 0);
      barrelGrad.addColorStop(0, '#5D4037');
      barrelGrad.addColorStop(0.5, '#8D6E63');
      barrelGrad.addColorStop(1, '#3E2723');

      ctx.fillStyle = barrelGrad;
      ctx.beginPath();
      ctx.roundRect(-13, -55, 26, 50, [6, 6, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = '#271914';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#F39C12';
      ctx.fillRect(-14, -45, 28, 4);
      ctx.fillRect(-14, -20, 28, 4);
      ctx.restore();

      ctx.save();
      ctx.translate(CANNON_X, CANNON_Y);
      const baseGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 36);
      baseGrad.addColorStop(0, '#2E7D32');
      baseGrad.addColorStop(0.7, '#1B5E20');
      baseGrad.addColorStop(1, '#0D3811');
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.fillStyle = baseGrad;
      ctx.fill();
      ctx.strokeStyle = '#F1C40F';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }

    drawNextBubble(ctx, grid) {
      ctx.save();
      const nextX = 54;
      const nextY = CANNON_Y;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(nextX, nextY + 22, 22, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#A7F3D0';
      ctx.textAlign = 'center';
      ctx.fillText('PRÓXIMA', nextX, nextY - BUBBLE_RADIUS - 6);

      grid.drawBubble(ctx, nextX, nextY, this.nextFruit);
      ctx.restore();
    }

    drawCharacterMascot(ctx) {
      ctx.save();
      const mascotX = CANVAS_WIDTH - 54;
      const mascotY = CANNON_Y;
      const floatOffset = Math.sin(Date.now() * 0.004) * 4;

      ctx.beginPath();
      ctx.arc(mascotX, mascotY + floatOffset, 24, 0, Math.PI * 2);
      ctx.fillStyle = this.character.themeColor;
      ctx.shadowColor = this.character.themeColor;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.character.avatarEmoji.slice(0, 2), mascotX, mascotY + floatOffset);

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(this.character.name.toUpperCase(), mascotX, mascotY + 36);
      ctx.restore();
    }
  }

  // ==========================================================================
  // 7. MOTOR PRINCIPAL DO JOGO (Game)
  // ==========================================================================
  const GAME_STATES = {
    CHARACTER_SELECT: 'CHARACTER_SELECT',
    PLAYING: 'PLAYING',
    LEVEL_CLEAR: 'LEVEL_CLEAR',
    GAME_OVER: 'GAME_OVER',
    ALL_CLEAR: 'ALL_CLEAR'
  };

  class Game {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = CANVAS_WIDTH;
      this.canvas.height = CANVAS_HEIGHT;

      this.state = GAME_STATES.CHARACTER_SELECT;
      this.isPaused = false;
      this.currentLevelIndex = 0;
      this.score = 0;
      this.highScore = parseInt(localStorage.getItem('amazonia_bobble_highscore') || '0', 10);
      this.combo = 0;
      this.specialCharge = 0;
      this.missCount = 0;

      this.character = CHARACTERS.BOITATA;
      this.grid = new HexGrid();
      this.particles = new ParticleSystem();
      this.shooter = new Shooter(this.canvas);

      this.bindDomElements();
      this.bindUiEvents();
      this.updateDomUI();

      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.gameLoop(t));
    }

    bindDomElements() {
      this.ui = {
        score: document.getElementById('scoreDisplay'),
        highScore: document.getElementById('highScoreDisplay'),
        level: document.getElementById('levelDisplay'),
        specialFill: document.getElementById('specialFill'),
        specialText: document.getElementById('specialText'),
        specialBarContainer: document.getElementById('specialBarContainer'),
        charAvatar: document.getElementById('heroAvatar'),
        charName: document.getElementById('heroName'),

        // Modais
        modalSelect: document.getElementById('modalCharacterSelect'),
        modalLevelClear: document.getElementById('modalLevelClear'),
        modalGameOver: document.getElementById('modalGameOver'),
        modalAllClear: document.getElementById('modalAllClear'),
        modalInstructions: document.getElementById('modalInstructions'),
        modalPause: document.getElementById('modalPause'),

        // Botões do Menu de Pausa e Header
        btnPause: document.getElementById('btnPause'),
        btnResume: document.getElementById('btnResume'),
        btnPauseInstructions: document.getElementById('btnPauseInstructions'),
        btnPauseSound: document.getElementById('btnPauseSound'),
        btnMainMenu: document.getElementById('btnMainMenu'),

        // Botões Gerais
        btnChooseBoitata: document.getElementById('btnChooseBoitata'),
        btnChooseBoto: document.getElementById('btnChooseBoto'),
        btnNextLevel: document.getElementById('btnNextLevel'),
        btnRestart: document.getElementById('btnRestart'),
        btnRestartAll: document.getElementById('btnRestartAll'),
        btnCloseInstructions: document.getElementById('btnCloseInstructions'),

        gameOverScore: document.getElementById('gameOverScore'),
        clearLevelScore: document.getElementById('clearLevelScore'),
        allClearScore: document.getElementById('allClearScore')
      };
    }

    bindUiEvents() {
      const selectBoitataAction = (e) => {
        if (e) e.preventDefault();
        sound.init();
        sound.startBgm();
        this.selectCharacter(CHARACTERS.BOITATA);
      };

      const selectBotoAction = (e) => {
        if (e) e.preventDefault();
        sound.init();
        sound.startBgm();
        this.selectCharacter(CHARACTERS.BOTO);
      };

      // Escolha de Personagem
      if (this.ui.btnChooseBoitata) {
        this.ui.btnChooseBoitata.addEventListener('click', selectBoitataAction);
        this.ui.btnChooseBoitata.addEventListener('touchend', selectBoitataAction);
      }
      if (this.ui.btnChooseBoto) {
        this.ui.btnChooseBoto.addEventListener('click', selectBotoAction);
        this.ui.btnChooseBoto.addEventListener('touchend', selectBotoAction);
      }

      // Função para alternar o Menu de Pausa
      const togglePauseAction = (e) => {
        if (e) e.preventDefault();
        if (this.state !== GAME_STATES.PLAYING) return;
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
          if (this.ui.modalPause) this.ui.modalPause.classList.remove('hidden');
        } else {
          if (this.ui.modalPause) this.ui.modalPause.classList.add('hidden');
        }
      };

      // Botão Pausa no Header
      if (this.ui.btnPause) {
        this.ui.btnPause.addEventListener('click', togglePauseAction);
        this.ui.btnPause.addEventListener('touchend', togglePauseAction);
      }

      // Botão Continuar no Menu de Pausa
      if (this.ui.btnResume) {
        this.ui.btnResume.addEventListener('click', () => {
          this.isPaused = false;
          if (this.ui.modalPause) this.ui.modalPause.classList.add('hidden');
        });
        this.ui.btnResume.addEventListener('touchend', () => {
          this.isPaused = false;
          if (this.ui.modalPause) this.ui.modalPause.classList.add('hidden');
        });
      }

      // Botão Como Jogar no Menu de Pausa
      if (this.ui.btnPauseInstructions) {
        this.ui.btnPauseInstructions.addEventListener('click', () => {
          if (this.ui.modalInstructions) this.ui.modalInstructions.classList.remove('hidden');
        });
      }

      // Botão Som no Menu de Pausa
      if (this.ui.btnPauseSound) {
        this.ui.btnPauseSound.addEventListener('click', () => {
          sound.init();
          const isMuted = sound.toggleMute();
          this.ui.btnPauseSound.textContent = isMuted ? '🔇 Som: Desligado' : '🔊 Som: Ligado';
        });
      }

      // Botão Menu Principal / Trocar Guardião
      if (this.ui.btnMainMenu) {
        this.ui.btnMainMenu.addEventListener('click', () => {
          this.isPaused = false;
          if (this.ui.modalPause) this.ui.modalPause.classList.add('hidden');
          if (this.ui.modalGameOver) this.ui.modalGameOver.classList.add('hidden');
          if (this.ui.modalLevelClear) this.ui.modalLevelClear.classList.add('hidden');
          if (this.ui.modalAllClear) this.ui.modalAllClear.classList.add('hidden');
          if (this.ui.modalSelect) this.ui.modalSelect.classList.remove('hidden');
          this.state = GAME_STATES.CHARACTER_SELECT;
        });
      }

      // Teclado: Tecla 'P' ou 'Escape' para pausar
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
          togglePauseAction(e);
        }
      });

      // Próxima fase
      if (this.ui.btnNextLevel) {
        this.ui.btnNextLevel.addEventListener('click', () => this.nextLevel());
        this.ui.btnNextLevel.addEventListener('touchend', () => this.nextLevel());
      }

      // Reinício Game Over
      if (this.ui.btnRestart) {
        this.ui.btnRestart.addEventListener('click', () => this.restartGame());
        this.ui.btnRestart.addEventListener('touchend', () => this.restartGame());
      }

      // Reinício Vitória Total
      if (this.ui.btnRestartAll) {
        this.ui.btnRestartAll.addEventListener('click', () => this.restartGame());
        this.ui.btnRestartAll.addEventListener('touchend', () => this.restartGame());
      }

      // Fechar Instruções
      if (this.ui.btnCloseInstructions) {
        this.ui.btnCloseInstructions.addEventListener('click', () => {
          this.ui.modalInstructions.classList.add('hidden');
        });
        this.ui.btnCloseInstructions.addEventListener('touchend', () => {
          this.ui.modalInstructions.classList.add('hidden');
        });
      }
    }

    selectCharacter(charObj) {
      this.character = charObj;
      this.shooter.setCharacter(charObj);
      if (this.ui.modalSelect) this.ui.modalSelect.classList.add('hidden');

      this.currentLevelIndex = 0;
      this.score = 0;
      this.specialCharge = 0;
      this.combo = 0;
      this.isPaused = false;

      this.loadLevel(this.currentLevelIndex);
      this.state = GAME_STATES.PLAYING;
      this.updateDomUI();
    }

    loadLevel(levelIndex) {
      const levelData = LEVELS[levelIndex] || LEVELS[0];
      this.grid.loadLevel(levelData.grid);
      this.missCount = 0;
      this.combo = 0;

      const active = this.grid.getActiveFruits();
      this.shooter.currentFruit = this.shooter.getRandomFruit(active);
      this.shooter.nextFruit = this.shooter.getRandomFruit(active);
      this.shooter.projectile = null;
      this.shooter.isSpecialLoaded = false;

      this.particles.clear();
      this.particles.addFloatingText(`FASE ${levelData.level}: ${levelData.name.toUpperCase()}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '#FFD700', 24);
      this.updateDomUI();
    }

    nextLevel() {
      if (this.ui.modalLevelClear) this.ui.modalLevelClear.classList.add('hidden');
      this.currentLevelIndex++;
      if (this.currentLevelIndex < LEVELS.length) {
        this.loadLevel(this.currentLevelIndex);
        this.state = GAME_STATES.PLAYING;
      } else {
        this.state = GAME_STATES.ALL_CLEAR;
        if (this.ui.allClearScore) this.ui.allClearScore.textContent = this.score;
        if (this.ui.modalAllClear) this.ui.modalAllClear.classList.remove('hidden');
        sound.playLevelClear();
      }
    }

    restartGame() {
      if (this.ui.modalGameOver) this.ui.modalGameOver.classList.add('hidden');
      if (this.ui.modalAllClear) this.ui.modalAllClear.classList.add('hidden');
      if (this.ui.modalLevelClear) this.ui.modalLevelClear.classList.add('hidden');
      if (this.ui.modalPause) this.ui.modalPause.classList.add('hidden');

      this.currentLevelIndex = 0;
      this.score = 0;
      this.specialCharge = 0;
      this.combo = 0;
      this.isPaused = false;

      this.loadLevel(this.currentLevelIndex);
      this.state = GAME_STATES.PLAYING;
      this.updateDomUI();
    }

    updateDomUI() {
      if (this.ui.score) this.ui.score.textContent = this.score.toLocaleString('pt-BR');
      if (this.ui.highScore) this.ui.highScore.textContent = this.highScore.toLocaleString('pt-BR');
      if (this.ui.level) this.ui.level.textContent = `${this.currentLevelIndex + 1} / ${LEVELS.length}`;

      const percent = Math.min(100, Math.round(this.specialCharge));
      if (this.ui.specialFill) this.ui.specialFill.style.width = `${percent}%`;

      if (this.character) {
        if (this.ui.charAvatar) this.ui.charAvatar.textContent = this.character.avatarEmoji.slice(0, 2);
        if (this.ui.charName) this.ui.charName.textContent = this.character.name;

        if (percent >= SPECIAL_CHARGE_MAX) {
          if (this.ui.specialText) this.ui.specialText.textContent = `⚡ ${this.character.specialName.toUpperCase()} PRONTO! ⚡`;
          if (this.ui.specialBarContainer) this.ui.specialBarContainer.classList.add('special-ready');
          if (this.ui.specialFill) this.ui.specialFill.style.backgroundColor = this.character.specialColor;
        } else {
          if (this.ui.specialText) this.ui.specialText.textContent = `Especial (${this.character.favoriteFruitName}): ${percent}%`;
          if (this.ui.specialBarContainer) this.ui.specialBarContainer.classList.remove('special-ready');
          if (this.ui.specialFill) this.ui.specialFill.style.backgroundColor = this.character.themeColor;
        }
      }
    }

    addSpecialCharge(fruitCount = 1) {
      if (this.specialCharge >= SPECIAL_CHARGE_MAX) return;
      const oldCharge = this.specialCharge;
      this.specialCharge = Math.min(SPECIAL_CHARGE_MAX, this.specialCharge + fruitCount * SPECIAL_CHARGE_PER_FRUIT);

      sound.playSpecialCharge();

      if (oldCharge < SPECIAL_CHARGE_MAX && this.specialCharge >= SPECIAL_CHARGE_MAX) {
        sound.playSpecialReady();
        // Transforma IMEDIATAMENTE a bolha do canhão na bolha especial
        this.shooter.loadSpecial();
        this.particles.addFloatingText(`⚡ ${this.character.specialName.toUpperCase()} PRONTO! ⚡`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 120, this.character.specialColor, 22);
      }
      this.updateDomUI();
    }

    addScore(points) {
      const multiplier = 1 + (this.combo * 0.2);
      const finalPoints = Math.round(points * multiplier);
      this.score += finalPoints;

      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('amazonia_bobble_highscore', this.highScore.toString());
      }
      this.updateDomUI();
      return finalPoints;
    }

    handleShoot() {
      this.shooter.update(() => {
        sound.playShoot();
      });
    }

    updateProjectile() {
      const p = this.shooter.projectile;
      if (!p) return;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x - BUBBLE_RADIUS <= 0) {
        p.x = BUBBLE_RADIUS;
        p.vx = -p.vx;
        sound.playWallBounce();
      } else if (p.x + BUBBLE_RADIUS >= CANVAS_WIDTH) {
        p.x = CANVAS_WIDTH - BUBBLE_RADIUS;
        p.vx = -p.vx;
        sound.playWallBounce();
      }

      if (p.y - BUBBLE_RADIUS <= 0) {
        this.handleBubbleImpact(p);
        return;
      }

      for (let r = 0; r < this.grid.rows; r++) {
        const cols = this.grid.getColsInRow(r);
        for (let c = 0; c < cols; c++) {
          if (this.grid.grid[r][c] !== null) {
            const center = this.grid.getCellCenter(r, c);
            const dist = Math.hypot(p.x - center.x, p.y - center.y);
            if (dist <= BUBBLE_RADIUS * 1.85) {
              this.handleBubbleImpact(p);
              return;
            }
          }
        }
      }
    }

    handleBubbleImpact(proj) {
      const snapCell = this.grid.snapToGrid(proj.x, proj.y);
      if (!snapCell) {
        this.shooter.projectile = null;
        this.shooter.reload(this.grid.getActiveFruits());
        return;
      }

      const { row, col } = snapCell;
      const impactPos = this.grid.getCellCenter(row, col);

      // 1. RESOLVER ESPECIAL DO BOITATÁ (Baforada de Fogo Incandescente)
      if (proj.isSpecial && proj.character === CHARACTERS.BOITATA.id) {
        sound.playBoitataFire();
        this.particles.createFireBlast(impactPos.x, impactPos.y, 40);
        const affected = this.grid.getBubblesInFirePath(row, col);
        this.grid.removeBubbles(affected);
        const pts = this.addScore(affected.length * 150);
        this.particles.addFloatingText(`🔥 BAFORADA DE FOGO! +${pts}`, impactPos.x, impactPos.y, '#FF4500', 24);
        this.dropFloatingBubbles();
        this.specialCharge = 0; // Zera a barra após usar
        this.finishShotResolution(true);
        return;
      }

      // 2. RESOLVER ESPECIAL DO BOTO (Explosão Encantada em Área)
      if (proj.isSpecial && proj.character === CHARACTERS.BOTO.id) {
        sound.playBotoWater();
        this.particles.createWaterBlast(impactPos.x, impactPos.y, 45);
        const affected = this.grid.getBubblesInRadius(row, col, 2);
        this.grid.removeBubbles(affected);
        const pts = this.addScore(affected.length * 150);
        this.particles.addFloatingText(`💖 EXPLOSÃO ENCANTADA! +${pts}`, impactPos.x, impactPos.y, '#FF69B4', 24);
        this.dropFloatingBubbles();
        this.specialCharge = 0; // Zera a barra após usar
        this.finishShotResolution(true);
        return;
      }

      // 3. RESOLVER DISPARO NORMAL (Match-3+)
      this.grid.setBubble(row, col, proj.fruitKey);
      const cluster = this.grid.findMatchingCluster(row, col, proj.fruitKey);

      if (cluster.length >= 3) {
        this.combo++;
        sound.playPop(this.combo);
        this.grid.removeBubbles(cluster);

        for (const cell of cluster) {
          const pos = this.grid.getCellCenter(cell.row, cell.col);
          this.particles.createFruitPop(pos.x, pos.y, proj.fruitKey, 10);
        }

        const earned = this.addScore(cluster.length * 100);
        const comboText = this.combo > 1 ? ` COMBO x${this.combo}!` : '';
        this.particles.addFloatingText(`+${earned}${comboText}`, impactPos.x, impactPos.y, '#FFD700', 20);

        // Se a fruta for a favorita do personagem, carrega o especial
        if (proj.fruitKey.toLowerCase() === this.character.favoriteFruit.toLowerCase()) {
          this.addSpecialCharge(cluster.length);
        }

        this.dropFloatingBubbles();
      } else {
        this.combo = 0;
        this.missCount++;
        sound.playWallBounce();
      }

      this.finishShotResolution(false);
    }

    dropFloatingBubbles() {
      const floating = this.grid.findFloatingBubbles();
      if (floating.length > 0) {
        sound.playDrop(floating.length);
        for (const f of floating) {
          this.particles.addFallingBubble(f.x, f.y, f.fruitKey);
        }
        const bonus = this.addScore(floating.length * 200);
        this.particles.addFloatingText(`✨ CASCATA! +${bonus}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30, '#00E5FF', 22);

        const favCount = floating.filter(f => f.fruitKey.toLowerCase() === this.character.favoriteFruit.toLowerCase()).length;
        if (favCount > 0) {
          this.addSpecialCharge(favCount);
        }
      }
    }

    finishShotResolution(wasSpecial = false) {
      this.shooter.projectile = null;
      this.updateDomUI();

      if (this.grid.isClear()) {
        sound.playLevelClear();
        this.state = GAME_STATES.LEVEL_CLEAR;
        if (this.ui.clearLevelScore) this.ui.clearLevelScore.textContent = this.score;
        if (this.ui.modalLevelClear) this.ui.modalLevelClear.classList.remove('hidden');
        return;
      }

      if (this.grid.isDangerExceeded()) {
        sound.playGameOver();
        this.state = GAME_STATES.GAME_OVER;
        if (this.ui.gameOverScore) this.ui.gameOverScore.textContent = this.score;
        if (this.ui.modalGameOver) this.ui.modalGameOver.classList.remove('hidden');
        return;
      }

      const activeFruits = this.grid.getActiveFruits();
      
      // Se a barra de especial estiver cheia (e não acabou de disparar), mantém a bolha especial carregada!
      if (this.specialCharge >= SPECIAL_CHARGE_MAX && !wasSpecial) {
        this.shooter.loadSpecial();
      } else {
        this.shooter.reload(activeFruits);
      }
    }

    gameLoop(currentTime) {
      this.lastTime = currentTime;
      if (this.state === GAME_STATES.PLAYING && !this.isPaused) {
        this.handleShoot();
        this.updateProjectile();
        this.particles.update();
      }
      this.render();
      requestAnimationFrame((t) => this.gameLoop(t));
    }

    render() {
      this.ctx.save();
      if (this.particles.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * this.particles.screenShake;
        const shakeY = (Math.random() - 0.5) * this.particles.screenShake;
        this.ctx.translate(shakeX, shakeY);
      }

      this.drawBackground();
      this.grid.render(this.ctx);

      // Projétil em Voo
      if (this.shooter.projectile) {
        const p = this.shooter.projectile;
        this.grid.drawBubble(
          this.ctx,
          p.x,
          p.y,
          p.fruitKey,
          p.isSpecial,
          p.isSpecial ? this.character.specialColor : '#FFFFFF',
          p.isSpecial ? this.character.specialSymbol : null
        );
      }

      this.shooter.render(this.ctx, this.grid);
      this.particles.render(this.ctx);
      this.ctx.restore();
    }

    drawBackground() {
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGrad.addColorStop(0, '#0a2312');
      bgGrad.addColorStop(0.6, '#081c0f');
      bgGrad.addColorStop(1, '#05120a');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      this.ctx.save();
      this.ctx.globalAlpha = 0.04;
      this.ctx.fillStyle = '#FFD700';

      this.ctx.beginPath();
      this.ctx.moveTo(80, 0);
      this.ctx.lineTo(160, 0);
      this.ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT * 0.7);
      this.ctx.lineTo(CANVAS_WIDTH - 100, CANVAS_HEIGHT * 0.7);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(250, 0);
      this.ctx.lineTo(340, 0);
      this.ctx.lineTo(CANVAS_WIDTH + 80, CANVAS_HEIGHT);
      this.ctx.lineTo(CANVAS_WIDTH - 60, CANVAS_HEIGHT);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  function initGame() {
    window.amazoniaGame = new Game();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }
})();
