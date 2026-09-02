/**
 * AMAZÔNIA BOBBLE: GUARDIÕES DA FLORESTA
 * constants.js - Configurações centrais, frutas amazônicas e personagens
 */

export const CANVAS_WIDTH = 448;
export const CANVAS_HEIGHT = 640;

// Configurações da Grade Hexagonal (Puzzle Bobble clássico)
export const GRID_COLS = 8;          // Colunas em linhas pares (0, 2, 4...)
export const GRID_COLS_ODD = 7;      // Colunas em linhas ímpares (1, 3, 5...)
export const GRID_MAX_ROWS = 14;     // Máximo de linhas visíveis
export const BUBBLE_RADIUS = 28;     // Raio da bolha em pixels (diâmetro = 56px, 8 * 56 = 448px)
export const ROW_HEIGHT = Math.round(BUBBLE_RADIUS * Math.sqrt(3)); // ~48.5px altura entre linhas hexagonais

// Linha de perigo (Game Over quando as bolhas tocarem aqui)
export const DANGER_ROW = 10;
export const DANGER_Y = DANGER_ROW * ROW_HEIGHT + BUBBLE_RADIUS;

// Posição do Canhão Lançador
export const CANNON_X = CANVAS_WIDTH / 2;
export const CANNON_Y = CANVAS_HEIGHT - 45;
export const BUBBLE_SPEED = 18; // Velocidade do projétil

// Ângulos limites do canhão (em radianos)
export const MIN_ANGLE = Math.PI * 0.08; // ~15 graus
export const MAX_ANGLE = Math.PI * 0.92; // ~165 graus
export const ROTATION_SPEED = 0.045;     // Velocidade de rotação via teclado

// Definição das Frutas Amazônicas (Cores, Ícones e Identidade)
export const FRUITS = {
  ACAI: {
    id: 'acai',
    name: 'Açaí',
    color: '#3B1443',        // Roxo açaí profundo
    highlight: '#6A2578',    // Brilho da casca
    accent: '#B35CC4',
    symbol: '🫐',
    description: 'Fruta rica em energia da floresta. Favorita do Boitatá!'
  },
  MANGA: {
    id: 'manga',
    name: 'Manga',
    color: '#E67E22',        // Laranja manga suculenta
    highlight: '#F39C12',    // Dourado
    accent: '#F1C40F',
    symbol: '🥭',
    description: 'Fruta doce e refrescante dos rios. Favorita do Boto!'
  },
  CUPUACU: {
    id: 'cupuacu',
    name: 'Cupuaçu',
    color: '#8D6E63',        // Marrom casca / polpa
    highlight: '#D7CCC8',    // Polpa cremosa clara
    accent: '#FFFFFF',
    symbol: '🥥',
    description: 'A jóia aromática da Amazônia.'
  },
  GUARANA: {
    id: 'guarana',
    name: 'Guaraná',
    color: '#C0392B',        // Vermelho vivo
    highlight: '#E74C3C',    // Olho do guaraná
    accent: '#FFFFFF',
    symbol: '👁️',
    description: 'O fruto sagrado dos olhos da floresta.'
  },
  BURITI: {
    id: 'buriti',
    name: 'Buriti',
    color: '#D35400',        // Terracota / laranja escuro
    highlight: '#E67E22',
    accent: '#FAD7A0',
    symbol: '🌴',
    description: 'O fruto da palmeira da vida.'
  },
  CASTANHA: {
    id: 'castanha',
    name: 'Castanha-do-Pará',
    color: '#4E342E',        // Marrom castanha nobre
    highlight: '#795548',
    accent: '#D7CCC8',
    symbol: '🌰',
    description: 'Fruta da grandiosa castanheira amazônica.'
  }
};

export const FRUIT_KEYS = Object.keys(FRUITS);

// Personagens Jogáveis: Boitatá e Boto Cor-de-Rosa
export const CHARACTERS = {
  BOITATA: {
    id: 'boitata',
    name: 'Boitatá',
    title: 'A Serpente de Fogo da Amazônia',
    favoriteFruit: 'acai',
    favoriteFruitName: 'Açaí',
    favoriteFruitIcon: '🫐',
    avatarEmoji: '🐍🔥',
    themeColor: '#FF4500',
    specialName: 'Baforada de Fogo',
    specialDescription: 'Lança uma bolha incandescente que incinera tudo pelo caminho e causa devastação!',
    specialIcon: '🔥',
    specialColor: '#FF2200',
    dialogue: 'O fogo sagrado protegerá as matas!',
    bgGradient: 'linear-gradient(135deg, #3d1308 0%, #1a0802 100%)'
  },
  BOTO: {
    id: 'boto',
    name: 'Boto Cor-de-Rosa',
    title: 'O Encantador das Águas Amazônicas',
    favoriteFruit: 'manga',
    favoriteFruitName: 'Manga',
    favoriteFruitIcon: '🥭',
    avatarEmoji: '🐬✨',
    themeColor: '#FF69B4',
    specialName: 'Explosão Encantada',
    specialDescription: 'Lança uma esfera mística d\'água que explode em grande área ao atingir as bolhas!',
    specialIcon: '💖',
    specialColor: '#FF1493',
    dialogue: 'As águas doces curam e purificam a floresta!',
    bgGradient: 'linear-gradient(135deg, #092c3e 0%, #03141d 100%)'
  }
};

// Configurações do Especial
export const SPECIAL_CHARGE_MAX = 100;
export const SPECIAL_CHARGE_PER_FRUIT = 18; // ~5 a 6 frutas favoritas carregam o especial 100%
export const COMBO_BONUS_MULTIPLIER = 1.5;
