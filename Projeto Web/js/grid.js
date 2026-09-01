/**
 * AMAZÔNIA BOBBLE: GUARDIÕES DA FLORESTA
 * grid.js - Lógica da Grade Hexagonal, Colisão, Combinação Match-3+ e Queda de Bolhas Órfãs
 */

import {
  CANVAS_WIDTH,
  GRID_COLS,
  GRID_COLS_ODD,
  GRID_MAX_ROWS,
  BUBBLE_RADIUS,
  ROW_HEIGHT,
  DANGER_ROW,
  DANGER_Y,
  FRUITS
} from './constants.js';

export class HexGrid {
  constructor() {
    this.rows = GRID_MAX_ROWS;
    this.offsetY = 0; // Deslocamento visual caso o teto desça
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

  // Retorna quantidade de colunas (8 para pares, 7 para ímpares)
  getColsInRow(row) {
    return (row % 2 === 0) ? GRID_COLS : GRID_COLS_ODD;
  }

  // Calcula a posição central X e Y no Canvas de uma célula
  getCellCenter(row, col) {
    const isEven = (row % 2 === 0);
    const startX = isEven ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2;
    const x = startX + col * (BUBBLE_RADIUS * 2);
    const y = this.offsetY + row * ROW_HEIGHT + BUBBLE_RADIUS;
    return { x, y };
  }

  // Verifica se uma posição da grade é válida
  isValidCell(row, col) {
    if (row < 0 || row >= this.rows) return false;
    if (col < 0 || col >= this.getColsInRow(row)) return false;
    return true;
  }

  // Retorna os vizinhos hexagonais de uma célula
  getNeighbors(row, col) {
    const neighbors = [];
    const isEven = (row % 2 === 0);

    const offsets = isEven ? [
      { r: 0, c: -1 }, { r: 0, c: 1 },    // Esquerda, Direita
      { r: -1, c: -1 }, { r: -1, c: 0 },  // Cima-Esq, Cima-Dir
      { r: 1, c: -1 }, { r: 1, c: 0 }     // Baixo-Esq, Baixo-Dir
    ] : [
      { r: 0, c: -1 }, { r: 0, c: 1 },    // Esquerda, Direita
      { r: -1, c: 0 }, { r: -1, c: 1 },   // Cima-Esq, Cima-Dir
      { r: 1, c: 0 }, { r: 1, c: 1 }      // Baixo-Esq, Baixo-Dir
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

  // Carrega uma matriz de nível
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

  // Encontra a célula vazia mais próxima para encaixar a bolha disparada
  snapToGrid(x, y) {
    let bestDist = Infinity;
    let bestCell = null;

    for (let r = 0; r < this.rows; r++) {
      const cols = this.getColsInRow(r);
      for (let c = 0; c < cols; c++) {
        // Apenas células vazias
        if (this.grid[r][c] === null) {
          const center = this.getCellCenter(r, c);
          const dist = Math.hypot(x - center.x, y - center.y);

          // Células da primeira linha ou que tenham pelo menos um vizinho preenchido
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

  // Insere uma bolha na grade
  setBubble(row, col, fruitKey) {
    if (this.isValidCell(row, col)) {
      this.grid[row][col] = fruitKey ? fruitKey.toLowerCase() : null;
    }
  }

  // Retorna a fruta de uma célula
  getBubble(row, col) {
    if (!this.isValidCell(row, col)) return null;
    return this.grid[row][col];
  }

  // Busca em Largura (BFS) para encontrar combinações de 3 ou mais frutas iguais
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
          const bubbleFruit = this.getBubble(n.row, n.col);
          if (bubbleFruit === target) {
            visited.add(key);
            queue.push(n);
          }
        }
      }
    }

    return cluster;
  }

  // Remove um grupo de bolhas da grade
  removeBubbles(cells) {
    for (const cell of cells) {
      this.setBubble(cell.row, cell.col, null);
    }
  }

  // Detecta bolhas flutuantes/órfãs desconectadas do teto (Linha 0)
  findFloatingBubbles() {
    const anchored = new Set();
    const queue = [];

    // Todas as bolhas na linha 0 estão ancoradas
    const colsTop = this.getColsInRow(0);
    for (let c = 0; c < colsTop; c++) {
      if (this.grid[0][c] !== null) {
        anchored.add(`0,${c}`);
        queue.push({ row: 0, col: c });
      }
    }

    // BFS a partir do teto
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

    // Coleta todas as bolhas não ancoradas
    const floating = [];
    for (let r = 0; r < this.rows; r++) {
      const cols = this.getColsInRow(r);
      for (let c = 0; c < cols; c++) {
        const fruit = this.grid[r][c];
        if (fruit !== null && !anchored.has(`${r},${c}`)) {
          const center = this.getCellCenter(r, c);
          floating.push({
            row: r,
            col: c,
            x: center.x,
            y: center.y,
            fruitKey: fruit
          });
          this.setBubble(r, c, null); // Remove da grade
        }
      }
    }

    return floating;
  }

  // Explosão em área para o Especial do Boto (Raio AOE)
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

  // Linha de Fogo para o Especial do Boitatá (Destrói coluna e adjacências)
  getBubblesInFirePath(targetRow, targetCol) {
    const affected = [];
    for (let r = 0; r <= targetRow + 1 && r < this.rows; r++) {
      const cols = this.getColsInRow(r);
      for (let c = 0; c < cols; c++) {
        const fruit = this.grid[r][c];
        if (fruit !== null) {
          const pos = this.getCellCenter(r, c);
          const center = this.getCellCenter(targetRow, targetCol);
          // Destrói tudo próximo ao eixo horizontal do impacto e acima
          if (Math.abs(pos.x - center.x) <= BUBBLE_RADIUS * 2.8) {
            affected.push({ row: r, col: c, fruitKey: fruit, x: pos.x, y: pos.y });
          }
        }
      }
    }
    return affected;
  }

  // Retorna lista de todas as frutas atualmente ativas na grade
  getActiveFruits() {
    const fruits = new Set();
    for (let r = 0; r < this.rows; r++) {
      const cols = this.getColsInRow(r);
      for (let c = 0; c < cols; c++) {
        if (this.grid[r][c] !== null) {
          fruits.add(this.grid[r][c]);
        }
      }
    }
    return Array.from(fruits);
  }

  // Verifica se o tabuleiro foi totalmente limpo (Vitória)
  isClear() {
    for (let r = 0; r < this.rows; r++) {
      const cols = this.getColsInRow(r);
      for (let c = 0; c < cols; c++) {
        if (this.grid[r][c] !== null) return false;
      }
    }
    return true;
  }

  // Verifica se alguma fruta ultrapassou a linha de perigo (Game Over)
  isDangerExceeded() {
    for (let r = DANGER_ROW; r < this.rows; r++) {
      const cols = this.getColsInRow(r);
      for (let c = 0; c < cols; c++) {
        if (this.grid[r][c] !== null) return true;
      }
    }
    return false;
  }

  // Renderiza o teto, linha de perigo e todas as bolhas da grade
  render(ctx) {
    ctx.save();

    // 1. Linha de Perigo (Cipó de alerta estilizado)
    ctx.beginPath();
    ctx.setLineDash([8, 6]);
    ctx.moveTo(0, DANGER_Y);
    ctx.lineTo(CANVAS_WIDTH, DANGER_Y);
    ctx.strokeStyle = 'rgba(231, 76, 60, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.setLineDash([]); // Restaura traço contínuo

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
    ctx.textAlign = 'right';
    ctx.fillText('LINHA DE PERIGO ⚠️', CANVAS_WIDTH - 12, DANGER_Y - 6);

    // 2. Renderizar Bolhas da Grade
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

    // 3. Moldura Superior da Copa da Floresta
    ctx.fillStyle = '#1b3815';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 6);

    ctx.restore();
  }

  // Desenha uma bolha de fruta com alto padrão visual
  drawBubble(ctx, x, y, fruitKey, isSpecial = false, specialColor = '#FF4500') {
    const fruit = FRUITS[fruitKey.toUpperCase()] || FRUITS.ACAI;

    ctx.save();
    ctx.translate(x, y);

    // Efeito de brilho especial caso seja bolha lendária
    if (isSpecial) {
      ctx.beginPath();
      ctx.arc(0, 0, BUBBLE_RADIUS + 5, 0, Math.PI * 2);
      ctx.fillStyle = specialColor;
      ctx.shadowColor = specialColor;
      ctx.shadowBlur = 15;
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.008) * 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    // Sombra da esfera
    ctx.beginPath();
    ctx.arc(2, 3, BUBBLE_RADIUS - 1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fill();

    // Corpo da Bolha (Gradiente radial 3D)
    const grad = ctx.createRadialGradient(-7, -7, 2, 0, 0, BUBBLE_RADIUS);
    grad.addColorStop(0, fruit.highlight);
    grad.addColorStop(0.65, fruit.color);
    grad.addColorStop(1, '#111111');

    ctx.beginPath();
    ctx.arc(0, 0, BUBBLE_RADIUS - 1, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Borda delicada
    ctx.strokeStyle = fruit.accent;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Ponto de Luz Superior (Efeito de reflexo de vidro/água)
    ctx.beginPath();
    ctx.ellipse(-8, -10, 8, 4, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fill();

    // Ícone da Fruta Amazônica Centralizado
    ctx.font = '22px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fruit.symbol, 0, 2);

    ctx.restore();
  }
}
