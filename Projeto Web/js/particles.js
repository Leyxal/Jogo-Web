/**
 * AMAZÔNIA BOBBLE: GUARDIÕES DA FLORESTA
 * particles.js - Sistema de Partículas, Efeitos Visuais, Textos Flutuantes e Queda de Frutas
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, BUBBLE_RADIUS, FRUITS } from './constants.js';

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.fallingBubbles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
    this.screenShake = 0;
  }

  // Adiciona tremor de tela para impactos fortes
  addScreenShake(intensity = 6) {
    this.screenShake = Math.max(this.screenShake, intensity);
  }

  // Partículas de suco / polpa ao estourar frutas
  createFruitPop(x, y, fruitKey, count = 12) {
    const fruit = FRUITS[fruitKey.toUpperCase()] || FRUITS.ACAI;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.particles.push({
        x: x,
        y: y,
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

  // Efeito do Especial do Boitatá: Fogo e Brasas
  createFireBlast(x, y, count = 35) {
    this.addScreenShake(12);
    // Shockwave de fogo
    this.shockwaves.push({
      x,
      y,
      radius: 10,
      maxRadius: 100,
      color: '#FF4500',
      alpha: 1,
      speed: 6
    });

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      const colors = ['#FF0000', '#FF4500', '#FFA500', '#FFFF00', '#8B0000'];
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.015 + Math.random() * 0.025,
        gravity: -0.05, // Chamas sobem
        type: 'fire'
      });
    }
  }

  // Efeito do Especial do Boto: Onda de Choque de Água Rosa e Estrelas Mágicas
  createWaterBlast(x, y, count = 35) {
    this.addScreenShake(10);
    // Anel de água expansivo
    this.shockwaves.push({
      x,
      y,
      radius: 10,
      maxRadius: 120,
      color: '#FF69B4',
      alpha: 1,
      speed: 7
    });

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      const colors = ['#FF69B4', '#FF1493', '#00E5FF', '#FFFFFF', '#E0F7FA'];
      this.particles.push({
        x: x,
        y: y,
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

  // Bolhas que caem quando ficam sem sustentação (ilhas flutuantes)
  addFallingBubble(x, y, fruitKey) {
    const angle = (Math.random() - 0.5) * 1.5;
    this.fallingBubbles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 4,
      vy: -2 - Math.random() * 3,
      gravity: 0.45,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      fruitKey: fruitKey,
      alpha: 1
    });
  }

  // Textos flutuantes de pontuação / avisos
  addFloatingText(text, x, y, color = '#FFD700', fontSize = 20) {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -2,
      color,
      fontSize,
      alpha: 1,
      decay: 0.018
    });
  }

  // Atualização física de todos os efeitos
  update() {
    // Redução do tremor de tela
    if (this.screenShake > 0) {
      this.screenShake *= 0.88;
      if (this.screenShake < 0.1) this.screenShake = 0;
    }

    // Atualizar partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.decay;
      p.radius *= 0.98;

      if (p.alpha <= 0 || p.radius <= 0.5) {
        this.particles.splice(i, 1);
      }
    }

    // Atualizar shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed;
      sw.alpha = 1 - (sw.radius / sw.maxRadius);
      if (sw.radius >= sw.maxRadius || sw.alpha <= 0) {
        this.shockwaves.splice(i, 1);
      }
    }

    // Atualizar bolhas que caem
    for (let i = this.fallingBubbles.length - 1; i >= 0; i--) {
      const b = this.fallingBubbles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += b.gravity;
      b.rotation += b.rotationSpeed;

      if (b.y > CANVAS_HEIGHT + 50) {
        this.fallingBubbles.splice(i, 1);
      }
    }

    // Atualizar textos flutuantes
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= ft.decay;

      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  // Renderização de todas as partículas no Canvas
  render(ctx) {
    ctx.save();

    // Renderizar Shockwaves
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

    // Renderizar Bolhas em Queda
    for (const b of this.fallingBubbles) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation);
      ctx.globalAlpha = b.alpha;

      const fruit = FRUITS[b.fruitKey.toUpperCase()] || FRUITS.ACAI;

      // Sombra
      ctx.beginPath();
      ctx.arc(0, 0, BUBBLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = fruit.color;
      ctx.fill();

      // Brilho
      ctx.beginPath();
      ctx.arc(-8, -8, BUBBLE_RADIUS * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();

      // Emoji / Ícone
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(fruit.symbol, 0, 2);

      ctx.restore();
    }

    // Renderizar Partículas
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      if (p.type === 'sparkle') {
        ctx.translate(p.x, p.y);
        ctx.beginPath();
        for (let j = 0; j < 4; j++) {
          ctx.rotate(Math.PI / 2);
          ctx.lineTo(p.radius, 0);
          ctx.lineTo(p.radius * 0.3, p.radius * 0.3);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Renderizar Textos Flutuantes
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.font = `bold ${ft.fontSize}px 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Contorno escuro para leitura perfeita
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
