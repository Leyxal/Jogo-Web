/**
 * AMAZÔNIA BOBBLE: GUARDIÕES DA FLORESTA
 * shooter.js - Canhão Lançador, Mira com Guia Pontilhada e Suporte Completo (Teclado, Mouse e Touch)
 */

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CANNON_X,
  CANNON_Y,
  BUBBLE_RADIUS,
  BUBBLE_SPEED,
  MIN_ANGLE,
  MAX_ANGLE,
  ROTATION_SPEED,
  FRUITS,
  CHARACTERS
} from './constants.js';

export class Shooter {
  constructor(canvas) {
    this.canvas = canvas;
    this.angle = Math.PI / 2; // Começa apontando para cima (90 graus)
    this.projectile = null;    // Projétil em voo
    this.currentFruit = 'acai';
    this.nextFruit = 'manga';
    this.isSpecialLoaded = false;
    this.character = CHARACTERS.BOITATA;

    // Estado dos controles de entrada
    this.keys = {
      left: false,
      right: false,
      fire: false
    };
    this.isTouchAiming = false;
    this.fireRequested = false;

    this.initEventListeners();
  }

  setCharacter(charObj) {
    this.character = charObj;
  }

  // Gera uma fruta válida baseada nas frutas que ainda existem na grade
  getRandomFruit(activeFruits = []) {
    if (!activeFruits || activeFruits.length === 0) {
      const keys = Object.keys(FRUITS);
      return keys[Math.floor(Math.random() * keys.length)].toLowerCase();
    }
    return activeFruits[Math.floor(Math.random() * activeFruits.length)].toLowerCase();
  }

  // Recarrega o canhão para o próximo disparo
  reload(activeFruits = []) {
    if (this.isSpecialLoaded) {
      // O especial acabou de ser disparado
      this.isSpecialLoaded = false;
      this.currentFruit = this.nextFruit;
      this.nextFruit = this.getRandomFruit(activeFruits);
    } else {
      this.currentFruit = this.nextFruit;
      this.nextFruit = this.getRandomFruit(activeFruits);
    }
  }

  // Carrega a bolha especial lendária no canhão
  loadSpecial() {
    this.isSpecialLoaded = true;
    this.currentFruit = this.character.favoriteFruit;
  }

  // Inicialização de controles (Teclado, Mouse e Touchscreen para celular)
  initEventListeners() {
    // 1. TECLADO (Setas: Esquerda/Direita para girar mira, Cima/Espaço para disparar)
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
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.keys.right = false;
      }
    });

    // 2. MOUSE (Move o cursor para controlar a mira e clica com botão esquerdo para disparar)
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      this.aimAt(mouseX, mouseY);
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // Botão esquerdo do mouse
        this.fireRequested = true;
      }
    });

    // 3. TOUCHSCREEN / SMARTPHONE (Arrasta o dedo para mirar e solta para disparar)
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
        this.fireRequested = true; // Dispara ao soltar o dedo!
      }
    }, { passive: false });
  }

  // Mira suavemente em direção a uma coordenada (x, y)
  aimAt(targetX, targetY) {
    const dx = targetX - CANNON_X;
    const dy = CANNON_Y - targetY; // dy positivo para cima

    if (dy > 15) { // Apenas se o alvo estiver acima do canhão
      let newAngle = Math.atan2(dy, -dx);
      // Ajuste trigonométrico: quando dx > 0 (direita), angle menor que PI/2. Quando dx < 0 (esquerda), angle maior que PI/2.
      newAngle = Math.atan2(dy, -dx);
      // Math.atan2(dy, -dx): dx > 0 -> angle < PI/2; dx < 0 -> angle > PI/2
      this.angle = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, newAngle));
    }
  }

  // Atualização de rotação por teclado e disparo
  update(onFireCallback) {
    // Rotação por teclado
    if (this.keys.left) {
      this.angle = Math.max(MIN_ANGLE, this.angle - ROTATION_SPEED);
    }
    if (this.keys.right) {
      this.angle = Math.min(MAX_ANGLE, this.angle + ROTATION_SPEED);
    }

    // Processamento de disparo
    if (this.fireRequested && !this.projectile) {
      this.fireRequested = false;
      this.fire(onFireCallback);
    } else {
      this.fireRequested = false;
    }
  }

  // Dispara o projétil ativo
  fire(onFireCallback) {
    if (this.projectile) return;

    // Vetor de velocidade baseado no ângulo do canhão
    // angle = PI/2 -> vx = 0, vy = -BUBBLE_SPEED
    // angle > PI/2 (esquerda) -> vx < 0
    // angle < PI/2 (direita) -> vx > 0
    const vx = -Math.cos(this.angle) * BUBBLE_SPEED;
    const vy = -Math.sin(this.angle) * BUBBLE_SPEED;

    this.projectile = {
      x: CANNON_X,
      y: CANNON_Y,
      vx: vx,
      vy: vy,
      fruitKey: this.currentFruit,
      isSpecial: this.isSpecialLoaded,
      character: this.character.id
    };

    if (onFireCallback) {
      onFireCallback(this.projectile);
    }
  }

  // Renderiza o canhão, a mira pontilhada com reflexão nas paredes e a próxima fruta
  render(ctx, grid) {
    ctx.save();

    // 1. Linha Guia de Mira Pontilhada (com reflexão nas paredes)
    if (!this.projectile) {
      this.drawAimGuide(ctx, grid);
    }

    // 2. Base e Canhão da Floresta
    this.drawCannonBarrel(ctx);

    // 3. Bolha Carregada no Canhão
    if (!this.projectile) {
      grid.drawBubble(ctx, CANNON_X, CANNON_Y, this.currentFruit, this.isSpecialLoaded, this.character.specialColor);
    }

    // 4. Previsão da Próxima Fruta (Pedestal lateral)
    this.drawNextBubble(ctx, grid);

    // 5. Mascote do Personagem Animado no Canto
    this.drawCharacterMascot(ctx);

    ctx.restore();
  }

  // Traça a mira laser / pontilhada que reflete nas paredes e para nas bolhas
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

      // Rebote na parede esquerda
      if (curX <= BUBBLE_RADIUS) {
        curX = BUBBLE_RADIUS;
        dirX = -dirX;
      }
      // Rebote na parede direita
      else if (curX >= CANVAS_WIDTH - BUBBLE_RADIUS) {
        curX = CANVAS_WIDTH - BUBBLE_RADIUS;
        dirX = -dirX;
      }

      // Verifica colisão com bolhas da grade
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

      // Desenha ponto da mira a cada 2 passos
      if (steps % 2 === 0) {
        ctx.beginPath();
        const dotRadius = this.isSpecialLoaded ? 3.5 : 2.5;
        ctx.arc(curX, curY, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // Desenha o canhão com textura rústica de madeira/bambu amazônico
  drawCannonBarrel(ctx) {
    ctx.save();
    ctx.translate(CANNON_X, CANNON_Y);

    // Rotação do cano (ajuste trigonométrico do ângulo)
    ctx.rotate(this.angle - Math.PI / 2);

    // Sombra do cano
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(-14, -58, 28, 50);

    // Tubo do lançador (Madeira nobre amazônica)
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

    // Detalhe de cipó/anéis dourados
    ctx.fillStyle = '#F39C12';
    ctx.fillRect(-14, -45, 28, 4);
    ctx.fillRect(-14, -20, 28, 4);

    ctx.restore();

    // Base circular do canhão
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

  // Desenha a próxima fruta na fila (Next)
  drawNextBubble(ctx, grid) {
    ctx.save();
    const nextX = 54;
    const nextY = CANNON_Y;

    // Pedestal de folhas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(nextX, nextY + 22, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Texto indicativo
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#A7F3D0';
    ctx.textAlign = 'center';
    ctx.fillText('PRÓXIMA', nextX, nextY - BUBBLE_RADIUS - 6);

    // Bolha da próxima fruta
    grid.drawBubble(ctx, nextX, nextY, this.nextFruit);

    ctx.restore();
  }

  // Mascote expressivo do guardião selecionado
  drawCharacterMascot(ctx) {
    ctx.save();
    const mascotX = CANVAS_WIDTH - 54;
    const mascotY = CANNON_Y;

    // Leve flutuação suave
    const floatOffset = Math.sin(Date.now() * 0.004) * 4;

    // Círculo com a cor temática do guardião
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

    // Avatar Emoji do Guardião
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.character.avatarEmoji.slice(0, 2), mascotX, mascotY + floatOffset);

    // Nome curto do Guardião
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(this.character.name.toUpperCase(), mascotX, mascotY + 36);

    ctx.restore();
  }
}
