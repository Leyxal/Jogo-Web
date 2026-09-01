# 🌿 Amazônia Bobble: Guardiões da Floresta

> **Projeto Final de Programação Web — Curso Técnico de Programação em Jogos Digitais**  
> **Desafio Web Games • Missão Amazônia Criativa**

---

## 📝 Mini-Apresentação do Jogo (Trabalho Acadêmico)

**Amazônia Bobble: Guardiões da Floresta** é um jogo de quebra-cabeça e ação no estilo *Puzzle Bobble / Bust-a-Move* desenvolvido com HTML5 Canvas, CSS3 e JavaScript modular. O jogo conecta-se profundamente com a riqueza da Amazônia ao colocar o jogador no controle de duas das maiores lendas do folclore regional — o **Boitatá** (serpente protetora de fogo) e o **Boto Cor-de-Rosa** (o guardião místico das águas fluviais) — com a nobre missão de defender a floresta colhendo e combinando frutas nativas da biodiversidade amazônica (como o açaí, o cupuaçu, o guaraná, a manga, o buriti e a castanha-do-pará) antes que a copa da selva ultrapasse a linha de perigo ecológico. Cada guardião possui mecânicas de especial exclusivas energizadas pela sua fruta preferida (a *Baforada de Fogo* do Boitatá com o Açaí e a *Explosão Encantada* do Boto com a Manga), unindo preservação ambiental, folclore brasileiro e jogabilidade arcade envolvente.

---

## 🎮 Mecânicas Principais do Jogo

- **Grade Hexagonal & Física de Rebote:** Disparos precisos com reflexão elástica nas paredes e encaixe automático na grade de colmeia.
- **Combinação Match-3+:** Combine 3 ou mais frutas idênticas para colhê-las e pontuar.
- **Sistema de Cascata / Bolhas Órfãs:** Ao estourar as bolhas de sustentação, todas as frutas desconectadas do teto caem, gerando bônus gigantescos de pontuação.
- **Barra de Especial Dinâmica:**
  - **Boitatá:** Coletar **Açaí** carrega o especial. Ao atingir 100%, dispara a **Baforada de Fogo 🔥**, incinerando todas as bolhas em linha reta.
  - **Boto Cor-de-Rosa:** Coletar **Manga** carrega o especial. Ao atingir 100%, dispara a **Explosão Encantada 💖**, que detona em grande área de impacto (AOE).
- **10 Fases Desafiadoras:** Progressão balanceada que introduz novas frutas, formatos geométricos e padrões táticos da floresta.
- **Áudio Procedural Nativo:** Efeitos sonoros e música de percussão amazônica sintetizados em tempo real via **Web Audio API** (100% autônomo, sem risco de falha de carregamento de arquivos externos).

---

## 🕹️ Controles

O jogo foi projetado para ser intuitivo e acessível em qualquer dispositivo:

| Dispositivo | Controle | Ação |
| :--- | :--- | :--- |
| **Teclado** | <kbd>←</kbd> / <kbd>A</kbd> e <kbd>→</kbd> / <kbd>D</kbd> | Girar a mira do canhão para a esquerda ou direita |
| **Teclado** | <kbd>↑</kbd> / <kbd>W</kbd> ou <kbd>Espaço</kbd> | Disparar a bolha |
| **Mouse** | Mover o cursor na tela | Apontar a mira na direção desejada |
| **Mouse** | Clique com o botão esquerdo | Disparar a bolha |
| **Touch (Celular/Tablet)** | Tocar e arrastar o dedo | Mirar com precisão e visualizar a guia |
| **Touch (Celular/Tablet)** | Soltar o dedo da tela | Disparar a bolha |

---

## 📂 Estrutura de Arquivos

```
Projeto Web/
├── index.html              # Estrutura semântica HTML5 (Header, Placar, Canvas, Modais, Footer)
├── style.css               # Estilização CSS3 temática amazônica, responsividade e animações
├── js/
│   ├── constants.js        # Configurações gerais, paleta de frutas e personagens
│   ├── audio.js            # Motor de efeitos sonoros e música (Web Audio API)
│   ├── particles.js        # Sistema de partículas, sucos de frutas, fogo, água e textos flutuantes
│   ├── grid.js             # Grade hexagonal, colisão, BFS match-3 e detecção de bolhas órfãs
│   ├── levels.js           # Matrizes e balanceamento das 10 fases
│   ├── shooter.js          # Canhão lançador, mira laser pontilhada e controles (teclado/mouse/touch)
│   └── game.js             # Loop do jogo, máquina de estados, combate e integração com a UI
└── README.md               # Documentação completa e instruções de publicação
```

---

## 🚀 Como Publicar no Itch.io (Passo a Passo)

1. **Compactar os arquivos do jogo:**
   - Selecione os seguintes itens dentro da pasta do projeto:
     - `index.html`
     - `style.css`
     - Pasta `js/`
   - Clique com o botão direito e escolha **Compactar para arquivo ZIP** (ou Enviar para > Pasta compactada).
   - Nomeie o arquivo como `amazonia-bobble.zip`.
   - *Atenção: O arquivo `index.html` deve estar na raiz do arquivo `.zip`.*

2. **Criar o projeto no Itch.io:**
   - Acesse [itch.io](https://itch.io) e faça login na sua conta.
   - No menu superior, clique em **Create** > **Upload new project**.
   - Preencha o título: `Amazônia Bobble: Guardiões da Floresta`.
   - Em **Kind of project**, selecione: **HTML** (*You have a ZIP or HTML file that will be played in the browser*).
   - Em **Pricing**, selecione **$0 or donate** (ou No payments).

3. **Fazer o Upload do Arquivo:**
   - Na seção **Uploads**, clique em **Upload files** e selecione seu `amazonia-bobble.zip`.
   - Marque a opção: `[X] This file will be played in the browser`.
   - Em **Embed options**:
     - Marque **Manually set size**:
       - **Width:** `450`
       - **Height:** `650`
     - Marque a caixa `[X] Automatically start on page load`.
     - Marque a caixa `[X] Mobile friendly` (já que o jogo possui suporte total a touchscreen).

4. **Publicar:**
   - Preencha a descrição com a **Mini-Apresentação** acima.
   - Em **Visibility & access**, selecione **Public**.
   - Clique em **Save & View Page** para testar e pegar o link público para entregar à professora!

---

## 🌐 Publicação Alternativa no GitHub Pages

1. Crie um repositório no GitHub com os arquivos do projeto.
2. Vá em **Settings** > **Pages**.
3. Em **Branch**, selecione `main` (ou `master`) e a pasta `/ (root)`.
4. Clique em **Save**. Em instantes, o link público `https://seu-usuario.github.io/nome-do-repositorio/` estará disponível!
