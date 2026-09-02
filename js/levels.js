/**
 * AMAZÔNIA BOBBLE: GUARDIÕES DA FLORESTA
 * levels.js - Definição dos 10 Níveis com Padrões Estratégicos e Dificuldade Progressiva
 */

export const LEVELS = [
  // FASE 1: Entrada da Mata (Tutorial amigável - Açaí e Manga para testar a mecânica)
  {
    level: 1,
    name: 'Entrada da Mata',
    description: 'Aprenda a colher as frutas da Amazônia e sinta o poder dos guardiões!',
    missLimit: 6, // Quantos tiros sem match antes do teto descer
    grid: [
      ['acai', 'acai', 'manga', 'manga', 'acai', 'acai', 'manga', 'manga'],
      ['acai', 'manga', 'acai', 'manga', 'acai', 'manga', 'acai'],
      ['manga', 'manga', 'acai', 'acai', 'manga', 'manga', 'acai', 'acai']
    ]
  },

  // FASE 2: Copa das Castanheiras (Apresenta Castanha e Cupuaçu em blocos triangulares)
  {
    level: 2,
    name: 'Copa das Castanheiras',
    description: 'As grandiosas árvores escondem ricas castanhas e cupuaçus.',
    missLimit: 6,
    grid: [
      ['castanha', 'castanha', 'cupuacu', 'cupuacu', 'castanha', 'castanha', 'cupuacu', 'cupuacu'],
      ['castanha', 'cupuacu', 'manga', 'manga', 'cupuacu', 'castanha', 'cupuacu'],
      ['acai', 'acai', 'castanha', 'castanha', 'acai', 'acai', 'cupuacu', 'cupuacu'],
      ['acai', 'manga', 'castanha', 'cupuacu', 'manga', 'acai', 'castanha']
    ]
  },

  // FASE 3: Rio Amazonas (Ondas fluviais de Açaí, Manga e Guaraná)
  {
    level: 3,
    name: 'Rio Amazonas',
    description: 'Navegue pelas correntes dos grandes rios amazônicos.',
    missLimit: 5,
    grid: [
      ['guarana', 'guarana', 'acai', 'acai', 'manga', 'manga', 'guarana', 'guarana'],
      ['guarana', 'acai', 'acai', 'manga', 'manga', 'guarana', 'guarana'],
      ['acai', 'acai', 'manga', 'manga', 'guarana', 'guarana', 'acai', 'acai'],
      ['manga', 'manga', 'guarana', 'guarana', 'acai', 'acai', 'manga']
    ]
  },

  // FASE 4: Igarapé Encantado (Faixas diagonais com Buriti e Cupuaçu)
  {
    level: 4,
    name: 'Igarapé Encantado',
    description: 'Águas cristalinas cercadas pelas palmeiras de buriti.',
    missLimit: 5,
    grid: [
      ['buriti', 'buriti', 'cupuacu', 'cupuacu', 'buriti', 'buriti', 'cupuacu', 'cupuacu'],
      ['buriti', 'cupuacu', 'acai', 'acai', 'cupuacu', 'buriti', 'cupuacu'],
      ['manga', 'buriti', 'cupuacu', 'acai', 'acai', 'cupuacu', 'buriti', 'manga'],
      ['manga', 'manga', 'buriti', 'acai', 'buriti', 'manga', 'manga'],
      ['acai', 'acai', 'manga', 'buriti', 'manga', 'acai', 'acai', 'acai']
    ]
  },

  // FASE 5: Coração da Floresta (Formação densa de colmeia central)
  {
    level: 5,
    name: 'Coração da Floresta',
    description: 'No centro da selva, as frutas formam núcleos sagrados.',
    missLimit: 5,
    grid: [
      ['guarana', 'castanha', 'guarana', 'castanha', 'guarana', 'castanha', 'guarana', 'castanha'],
      ['acai', 'acai', 'manga', 'manga', 'acai', 'acai', 'manga'],
      ['castanha', 'acai', 'guarana', 'guarana', 'acai', 'castanha', 'manga', 'manga'],
      ['castanha', 'guarana', 'buriti', 'buriti', 'guarana', 'castanha', 'manga'],
      ['cupuacu', 'cupuacu', 'buriti', 'buriti', 'cupuacu', 'cupuacu', 'acai', 'acai']
    ]
  },

  // FASE 6: Encontro das Águas (Dois lados divididos: Rio Negro e Solimões)
  {
    level: 6,
    name: 'Encontro das Águas',
    description: 'Duas forças da natureza lado a lado sem se misturar.',
    missLimit: 5,
    grid: [
      ['acai', 'acai', 'acai', 'acai', 'manga', 'manga', 'manga', 'manga'],
      ['acai', 'acai', 'acai', 'manga', 'manga', 'manga', 'manga'],
      ['castanha', 'castanha', 'acai', 'acai', 'manga', 'manga', 'cupuacu', 'cupuacu'],
      ['castanha', 'acai', 'guarana', 'manga', 'cupuacu', 'cupuacu', 'cupuacu'],
      ['guarana', 'guarana', 'guarana', 'buriti', 'buriti', 'buriti', 'buriti', 'buriti']
    ]
  },

  // FASE 7: Dança do Fogo (Desafio com zigue-zague e foco no Boitatá)
  {
    level: 7,
    name: 'Dança do Fogo',
    description: 'O calor do Boitatá ilumina as sombras da mata fechada.',
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

  // FASE 8: Labirinto dos Cipós (Colunas alternadas que exigem rebote nas paredes)
  {
    level: 8,
    name: 'Labirinto dos Cipós',
    description: 'Use as paredes da floresta para rebater seus disparos!',
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

  // FASE 9: Vórtice do Boto (Círculos concêntricos e ilhas estratégicas)
  {
    level: 9,
    name: 'Vórtice do Boto',
    description: 'O encanto do Boto cria correntes de frutas nos igapós.',
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

  // FASE 10: Guardião Supremo (Todas as 6 frutas amazônicas no clímax épico)
  {
    level: 10,
    name: 'Guardião Supremo',
    description: 'O grande ritual de proteção! Use todo o seu poder especial!',
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
