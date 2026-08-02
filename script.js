const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingBar = document.getElementById("loadingBar");
const loadingText = document.getElementById("loadingText");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const levelEl = document.getElementById("level");
const coinsEl = document.getElementById("coins");
const playerNameText = document.getElementById("playerNameText");
const playerLevelText = document.getElementById("playerLevelText");
const xpFill = document.getElementById("xpFill");
const xpText = document.getElementById("xpText");
const modeText = document.getElementById("modeText");
const prestigeText = document.getElementById("prestigeText");
const seasonText = document.getElementById("seasonText");
const avatarBadge = document.getElementById("avatarBadge");
const powerupList = document.getElementById("powerupList");
const skillTreeEl = document.getElementById("skillTree");
const skillPointsEl = document.getElementById("skillPoints");
const gamesPlayedEl = document.getElementById("gamesPlayed");
const foodEatenEl = document.getElementById("foodEaten");
const totalTimeEl = document.getElementById("totalTime");
const healthTextEl = document.getElementById("healthText");
const challengeListEl = document.getElementById("challengeList");
const rankingList = document.getElementById("rankingList");
const restartBtn = document.getElementById("restartBtn");
const pauseBtn = document.getElementById("pauseBtn");
const menuBtn = document.getElementById("menuBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const playerNameInput = document.getElementById("playerNameInput");
const avatarSelect = document.getElementById("avatarSelect");
const modeSelect = document.getElementById("modeSelect");
const biomeSelect = document.getElementById("biomeSelect");
const weatherSelect = document.getElementById("weatherSelect");
const themeSelect = document.getElementById("themeSelect");
const soundToggle = document.getElementById("soundToggle");
const musicToggle = document.getElementById("musicToggle");
const gridToggle = document.getElementById("gridToggle");
const qualitySelect = document.getElementById("qualitySelect");
const toastEl = document.getElementById("toast");

const STORAGE_KEYS = {
  profile: "snake-ascension-profile",
  leaderboard: "snake-ascension-rank",
  stats: "snake-ascension-stats"
};

const boardSize = 16;
const cellSize = 480 / boardSize;

const modes = {
  classic: { label: "Clássico", baseTick: 180, color: "#4ce6bf" },
  survival: { label: "Sobrevivência", baseTick: 155, color: "#ffd166" },
  hardcore: { label: "Hardcore", baseTick: 135, color: "#ff6b6b" },
  maze: { label: "Labirinto", baseTick: 145, color: "#5ee7ff" },
  infinite: { label: "Infinito", baseTick: 165, color: "#c084fc" },
  zen: { label: "Zen", baseTick: 190, color: "#f472b6" }
};

const biomes = {
  forest: { label: "Floresta", colorA: "#0d3a2b", colorB: "#45b75a" },
  desert: { label: "Deserto", colorA: "#4a2b0d", colorB: "#f59e0b" },
  volcano: { label: "Vulcão", colorA: "#2b0c0c", colorB: "#ef4444" },
  ice: { label: "Gelo", colorA: "#0f274d", colorB: "#60a5fa" },
  space: { label: "Espaço", colorA: "#070b2b", colorB: "#8b5cf6" },
  cyber: { label: "Cyberpunk", colorA: "#0b1327", colorB: "#22d3ee" }
};

const weatherTypes = {
  clear: { label: "Claro", intensity: 0 },
  rain: { label: "Chuva", intensity: 1 },
  snow: { label: "Neve", intensity: 1 },
  storm: { label: "Tempestade", intensity: 2 },
  fog: { label: "Neblina", intensity: 0.6 }
};

const foodTypes = {
  common: { label: "Comum", color: "#ff4d6d", points: 1, rarity: 0.62, effect: "none" },
  rare: { label: "Rara", color: "#4ec9f5", points: 2, rarity: 0.2, effect: "shield" },
  epic: { label: "Épica", color: "#a855f7", points: 4, rarity: 0.1, effect: "x2" },
  legendary: { label: "Lendária", color: "#fbbf24", points: 6, rarity: 0.06, effect: "heal" },
  mythic: { label: "Mítica", color: "#f472b6", points: 8, rarity: 0.015, effect: "slow" },
  divine: { label: "Divina", color: "#ffffff", points: 12, rarity: 0.005, effect: "invincible" }
};

const powerUps = {
  magnet: { label: "Ímã", icon: "🧲", desc: "Atrai comida próxima", duration: 5000 },
  shield: { label: "Escudo", icon: "🛡️", desc: "Protege por alguns segundos", duration: 4000 },
  slow: { label: "Slow Motion", icon: "🐢", desc: "Reduz a velocidade", duration: 5000 },
  turbo: { label: "Turbo", icon: "⚡", desc: "Aumenta a velocidade", duration: 4500 },
  x2: { label: "x2 Pontos", icon: "✨", desc: "Multiplica os pontos", duration: 6000 },
  ghost: { label: "Fantasma", icon: "👻", desc: "Passa pelo próprio corpo", duration: 5000 },
  dash: { label: "Dash", icon: "💨", desc: "Salto de movimento", duration: 3000 },
  freeze: { label: "Congelar", icon: "❄️", desc: "Congela o tempo", duration: 3500 },
  lightning: { label: "Raio", icon: "⚡", desc: "Descarrega energia", duration: 4000 },
  heal: { label: "Cura", icon: "💚", desc: "Restaura vida", duration: 1000 },
  clone: { label: "Clone", icon: "🪞", desc: "Cria um falso corpo", duration: 4000 },
  bomb: { label: "Bomba", icon: "💣", desc: "Limpa células", duration: 1000 },
  invincible: { label: "Invencível", icon: "☄️", desc: "Proteção máxima", duration: 6000 }
};

const skillDefinitions = [
  { key: "speed", name: "Velocidade", cost: 1, desc: "+10% de aceleração" },
  { key: "magnet", name: "Magnetismo", cost: 1, desc: "+atração de comida" },
  { key: "health", name: "Vida", cost: 2, desc: "+25 de vida máxima" },
  { key: "luck", name: "Sorte", cost: 1, desc: "+raridade de comida" },
  { key: "xp", name: "XP", cost: 1, desc: "+20% de XP" },
  { key: "duration", name: "Duração", cost: 2, desc: "+25% de duração" },
  { key: "resistance", name: "Resistência", cost: 2, desc: "+proteção contra dano" },
  { key: "regen", name: "Regeneração", cost: 2, desc: "+regeneração por tick" }
];

const state = {
  screen: "menu",
  mode: "classic",
  biome: "forest",
  weather: "clear",
  paused: false,
  gameOver: false,
  loadingProgress: 0,
  lastFrame: 0,
  accumulator: 0,
  tickMs: 180,
  timeMs: 0,
  score: 0,
  combo: 0,
  lastDirection: "right",
  nextDirection: "right",
  snake: [],
  food: null,
  powerUp: null,
  obstacles: [],
  portals: [],
  enemies: [],
  boss: null,
  activeEffects: {},
  effectsTime: {},
  floatingTexts: [],
  particles: [],
  shake: 0,
  profile: {
    name: "Jogador",
    avatar: "🐍",
    level: 1,
    xp: 0,
    xpToNext: 100,
    coins: 0,
    prestige: 0,
    seasonLevel: 1,
    seasonXp: 0,
    battlePassXp: 0,
    skillPoints: 0,
    unlockedSkins: ["cobra"],
    selectedSkin: "cobra"
  },
  stats: {
    gamesPlayed: 0,
    foodEaten: 0,
    totalTimeMs: 0,
    highestScore: 0,
    totalDeaths: 0,
    longestSurvivalMs: 0,
    totalPowerUps: 0,
    bossDefeats: 0
  },
  leaderboard: [],
  inventory: { magnet: 1, shield: 1, slow: 1, turbo: 1, x2: 1, ghost: 1, dash: 1, freeze: 1, lightning: 1, heal: 1, clone: 1, bomb: 1, invincible: 1 },
  settings: { theme: "dark", sound: true, music: true, showGrid: true, quality: "medium" },
  skills: { speed: 0, magnet: 0, health: 0, luck: 0, xp: 0, duration: 0, resistance: 0, regen: 0 },
  health: 100,
  maxHealth: 100,
  audioContext: null,
  musicTimer: null,
  challenges: [
    { key: "score10", label: "Marque 10 pontos", progress: 0, goal: 10 },
    { key: "food20", label: "Coma 20 frutas", progress: 0, goal: 20 },
    { key: "boss1", label: "Derrote 1 boss", progress: 0, goal: 1 }
  ]
};

function init() {
  loadProfile();
  loadStats();
  loadLeaderboard();
  bindEvents();
  applyTheme();
  renderAll();
  showOverlay("menu");
  requestAnimationFrame(loop);
}

function bindEvents() {
  restartBtn.addEventListener("click", () => startLoading());
  pauseBtn.addEventListener("click", togglePause);
  menuBtn.addEventListener("click", () => showOverlay("menu"));
  closeSettingsBtn.addEventListener("click", closeSettings);
  overlay.addEventListener("click", handleOverlayClick);
  skillTreeEl.addEventListener("click", handleSkillClick);
  powerupList.addEventListener("click", handlePowerUpClick);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (state.screen === "game") {
        openSettings();
      } else if (!settingsPanel.classList.contains("hidden")) {
        closeSettings();
      }
    }
  });
  [playerNameInput, avatarSelect, modeSelect, biomeSelect, weatherSelect, themeSelect, soundToggle, musicToggle, gridToggle, qualitySelect].forEach((element) => {
    element.addEventListener("change", saveSettingsFromUi);
    element.addEventListener("input", saveSettingsFromUi);
  });
}

function loadProfile() {
  const stored = localStorage.getItem(STORAGE_KEYS.profile);
  if (stored) {
    const parsed = JSON.parse(stored);
    state.profile = { ...state.profile, ...parsed };
    state.settings = { ...state.settings, ...(parsed.settings || {}) };
    state.mode = parsed.mode || state.mode;
    state.biome = parsed.biome || state.biome;
    state.weather = parsed.weather || state.weather;
    state.skills = { ...state.skills, ...(parsed.skills || {}) };
  }
  state.profile.name = state.profile.name || "Jogador";
}

function saveProfile() {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify({ ...state.profile, settings: state.settings, mode: state.mode, biome: state.biome, weather: state.weather, skills: state.skills }));
}

function loadStats() {
  const stored = localStorage.getItem(STORAGE_KEYS.stats);
  if (stored) state.stats = { ...state.stats, ...JSON.parse(stored) };
}

function saveStats() {
  localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(state.stats));
}

function loadLeaderboard() {
  const stored = localStorage.getItem(STORAGE_KEYS.leaderboard);
  if (stored) state.leaderboard = JSON.parse(stored);
  renderRanking();
}

function saveLeaderboard() {
  localStorage.setItem(STORAGE_KEYS.leaderboard, JSON.stringify(state.leaderboard));
  renderRanking();
}

function renderAll() {
  renderHud();
  renderSkillTree();
  renderPowerUps();
  renderChallenges();
  renderRanking();
}

function showOverlay(screen) {
  state.screen = screen;
  overlay.classList.add("active");
  if (screen === "menu") {
    overlay.innerHTML = `
      <div class="overlay-card">
        <h2>Snake Legends: Ascension</h2>
        <p>Uma experiência RPG de cobra com progressão, biomas, bosses e long-term replayability.</p>
        <div class="menu-grid">
          <button data-action="play">▶ Iniciar partida</button>
          <button data-action="ranking">🏆 Ranking</button>
          <button data-action="skills">⚔️ Habilidades</button>
          <button data-action="settings">⚙️ Configurações</button>
          <button data-action="credits">🎖️ Créditos</button>
        </div>
      </div>`;
  } else if (screen === "ranking") {
    overlay.innerHTML = `
      <div class="overlay-card">
        <h2>Ranking</h2>
        <div class="menu-grid">
          ${state.leaderboard.length ? state.leaderboard.map((entry, index) => `<div class="pill"><span>#${index + 1} ${entry.name}</span><strong>${entry.score}</strong></div>`).join("") : `<div class="pill"><span>Nenhuma partida ainda</span><strong>—</strong></div>`}
        </div>
        <div class="menu-grid" style="margin-top:12px;"><button data-action="menu">Voltar</button></div>
      </div>`;
  } else if (screen === "skills") {
    overlay.innerHTML = `
      <div class="overlay-card">
        <h2>Árvore de habilidades</h2>
        <p>Melhore velocidade, vida, sorte, XP e duração dos buffs.</p>
        <div class="menu-grid">
          <button data-action="menu">Voltar</button>
        </div>
      </div>`;
  } else if (screen === "pause") {
    overlay.innerHTML = `
      <div class="overlay-card">
        <h2>Pausado</h2>
        <p>Use o painel para continuar ou voltar ao menu.</p>
        <div class="menu-grid">
          <button data-action="resume">Continuar</button>
          <button data-action="menu">Menu</button>
        </div>
      </div>`;
  } else if (screen === "game-over") {
    overlay.innerHTML = `
      <div class="overlay-card">
        <h2>Fim de partida</h2>
        <p>Pontuação: ${state.score} · Recorde: ${Math.max(state.stats.highestScore, state.score)}</p>
        <div class="menu-grid">
          <button data-action="play">Jogar de novo</button>
          <button data-action="menu">Menu</button>
        </div>
      </div>`;
  }
  updateProfileUI();
}

function handleOverlayClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const action = button.getAttribute("data-action");
  if (action === "play") startLoading();
  else if (action === "resume") { state.paused = false; overlay.classList.remove("active"); state.screen = "game"; }
  else if (action === "ranking") showOverlay("ranking");
  else if (action === "skills") showOverlay("skills");
  else if (action === "settings") { showOverlay("settings"); openSettings(); }
  else if (action === "credits") { showOverlay("menu"); showToast("Projeto inspirado em uma visão premium de arcade RPG"); }
  else if (action === "menu") showOverlay("menu");
}

function startLoading() {
  state.screen = "loading";
  overlay.classList.remove("active");
  loadingOverlay.classList.remove("hidden");
  state.loadingProgress = 0;
  loadingBar.style.width = "0%";
  loadingText.textContent = "Preparando a arena...";
  const steps = ["Preparando a arena...", "Gerando bioma...", "Criando comida...", "Ativando buffs..."];
  const interval = setInterval(() => {
    state.loadingProgress += 25;
    loadingBar.style.width = `${Math.min(state.loadingProgress, 100)}%`;
    loadingText.textContent = steps[Math.floor(state.loadingProgress / 25)] || steps[steps.length - 1];
    if (state.loadingProgress >= 100) {
      clearInterval(interval);
      loadingOverlay.classList.add("hidden");
      startGame();
    }
  }, 160);
}

function startGame() {
  state.paused = false;
  state.gameOver = false;
  state.score = 0;
  state.combo = 0;
  state.timeMs = 0;
  state.accumulator = 0;
  state.lastFrame = 0;
  state.activeEffects = {};
  state.effectsTime = {};
  state.floatingTexts = [];
  state.particles = [];
  state.enemies = [];
  state.boss = null;
  state.health = 100 + state.skills.health * 25;
  state.maxHealth = state.health;
  state.stats.gamesPlayed += 1;
  state.snake = [
    { x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }
  ];
  state.lastDirection = "right";
  state.nextDirection = "right";
  state.food = null;
  state.powerUp = null;
  state.obstacles = [];
  state.portals = [];
  if (state.mode === "maze") state.obstacles = createMazeObstacles();
  if (state.mode === "survival" || state.mode === "hardcore") state.obstacles = createRandomObstacles(4);
  if (state.mode === "infinite") state.portals = createPortals();
  state.tickMs = getBaseTick();
  spawnFood();
  overlay.classList.remove("active");
  state.screen = "game";
  renderHud();
  saveStats();
  saveProfile();
  if (state.settings.music) startBackgroundMusic(); else stopBackgroundMusic();
}

function createMazeObstacles() {
  return [
    { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 },
    { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 },
    { x: 7, y: 11 }, { x: 8, y: 11 }, { x: 9, y: 11 }
  ];
}

function createRandomObstacles(amount) {
  const obstacles = [];
  while (obstacles.length < amount) {
    const candidate = { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };
    if (!state.snake.some((segment) => segment.x === candidate.x && segment.y === candidate.y)) obstacles.push(candidate);
  }
  return obstacles;
}

function createPortals() {
  return [{ x: 2, y: 2 }, { x: 13, y: 13 }];
}

function getBaseTick() {
  const mode = modes[state.mode] || modes.classic;
  const speedBonus = state.skills.speed * 8;
  return Math.max(70, Math.round(mode.baseTick - speedBonus - state.profile.level * 1.1));
}

function loop(timestamp) {
  if (!state.lastFrame) state.lastFrame = timestamp;
  const delta = timestamp - state.lastFrame;
  state.lastFrame = timestamp;
  if (state.screen === "game" && !state.paused && !state.gameOver) {
    state.timeMs += delta;
    state.accumulator += delta;
    updateActiveEffects(delta);
    while (state.accumulator >= state.tickMs) {
      step();
      state.accumulator -= state.tickMs;
    }
    updateEnemies(delta);
    updateBoss(delta);
    updateParticles(delta);
    if (state.health <= 0) endGame();
  }
  if (state.screen === "game" && state.food && state.food.expiresAt && performance.now() > state.food.expiresAt) {
    state.food = null;
    spawnFood();
  }
  updateFloatingTexts(delta);
  render();
  requestAnimationFrame(loop);
}

function updateActiveEffects(delta) {
  Object.keys(state.effectsTime).forEach((key) => {
    state.effectsTime[key] -= delta;
    if (state.effectsTime[key] <= 0) {
      delete state.effectsTime[key];
      delete state.activeEffects[key];
    }
  });
  const baseTick = getBaseTick();
  if (state.activeEffects.slow) state.tickMs = Math.round(baseTick * 1.6);
  else if (state.activeEffects.turbo) state.tickMs = Math.max(65, Math.round(baseTick * 0.72));
  else state.tickMs = baseTick;
  if (state.activeEffects.freeze) state.tickMs = Math.max(70, Math.round(baseTick * 1.8));
  if (state.activeEffects.heal) { state.health = Math.min(state.maxHealth, state.health + 4); delete state.activeEffects.heal; delete state.effectsTime.heal; }
  if (state.activeEffects.invincible) { state.maxHealth = 140 + state.skills.health * 25; }
  if (state.skills.regen > 0 && Math.random() < 0.02) state.health = Math.min(state.maxHealth, state.health + state.skills.regen * 0.4);
}

function step() {
  state.lastDirection = state.nextDirection;
  const head = { ...state.snake[0] };
  if (state.lastDirection === "up") head.y -= 1;
  if (state.lastDirection === "down") head.y += 1;
  if (state.lastDirection === "left") head.x -= 1;
  if (state.lastDirection === "right") head.x += 1;

  if (state.mode === "zen" || state.mode === "infinite") {
    if (head.x < 0) head.x = boardSize - 1;
    if (head.x >= boardSize) head.x = 0;
    if (head.y < 0) head.y = boardSize - 1;
    if (head.y >= boardSize) head.y = 0;
  }

  const hitWall = state.mode !== "zen" && state.mode !== "infinite" && (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize);
  const hitObstacle = state.obstacles.some((segment) => segment.x === head.x && segment.y === head.y);
  let hitSelf = state.snake.some((segment) => segment.x === head.x && segment.y === head.y);
  if (state.activeEffects.ghost) hitSelf = false;

  if (state.activeEffects.shield || state.activeEffects.invincible) {
    if (hitWall || hitObstacle || hitSelf) {
      delete state.activeEffects.shield;
      delete state.effectsTime.shield;
      showToast("Buff protegido!" );
    }
  } else if (hitWall || hitObstacle || hitSelf) {
    takeDamage(20);
    if (state.health <= 0) { endGame(); return; }
    return;
  }

  const portalIndex = state.portals.findIndex((portal) => portal.x === head.x && portal.y === head.y);
  if (portalIndex >= 0) {
    const target = state.portals[1 - portalIndex];
    head.x = target.x;
    head.y = target.y;
  }

  state.snake.unshift(head);
  const ateFood = state.food && head.x === state.food.x && head.y === state.food.y;
  const atePower = state.powerUp && head.x === state.powerUp.x && head.y === state.powerUp.y;
  if (atePower) {
    activatePowerUp(state.powerUp.type);
    state.powerUp = null;
  } else if (ateFood) {
    eatFood();
  } else {
    state.snake.pop();
  }

  maybeSpawnPowerUp();
  maybeSpawnEnemy();
  maybeSpawnBoss();
  renderHud();
}

function takeDamage(amount) {
  if (state.activeEffects.invincible || state.activeEffects.shield) return;
  state.health = Math.max(0, state.health - amount * (1 - state.skills.resistance * 0.08));
  state.shake = 10;
  addParticle(state.snake[0], "#ff6b6b", 18);
  showToast("Recebeu dano!");
}

function eatFood() {
  const foodInfo = foodTypes[state.food.type] || foodTypes.common;
  const multiplier = state.activeEffects.x2 ? 2 : 1;
  const points = Math.round(foodInfo.points * multiplier * (1 + state.skills.luck * 0.15));
  state.score += points;
  state.combo += 1;
  state.stats.foodEaten += 1;
  state.stats.highestScore = Math.max(state.stats.highestScore, state.score);
  state.profile.coins += Math.max(1, Math.floor(points / 2));
  const xpGain = Math.max(8, points * 6 + state.skills.xp * 4);
  state.profile.xp += xpGain;
  state.health = Math.min(state.maxHealth, state.health + (foodInfo.effect === "heal" ? 16 : 0));
  if (foodInfo.effect === "shield") {
    state.activeEffects.shield = true;
    state.effectsTime.shield = 4000;
  }
  if (foodInfo.effect === "x2") {
    state.activeEffects.x2 = true;
    state.effectsTime.x2 = 5000;
  }
  if (foodInfo.effect === "slow") {
    state.activeEffects.slow = true;
    state.effectsTime.slow = 4000;
  }
  if (foodInfo.effect === "invincible") {
    state.activeEffects.invincible = true;
    state.effectsTime.invincible = 4000;
  }
  state.floatingTexts.push({ text: `+${points}`, x: state.food.x, y: state.food.y, life: 900 });
  addParticle(state.food, "#ffffff", 18);
  updateProgression();
  state.stats.longestSurvivalMs = Math.max(state.stats.longestSurvivalMs, state.timeMs);
  renderHud();
  spawnFood();
  saveProfile();
  saveStats();
  playFoodSound(state.food.type);
}

function updateProgression() {
  while (state.profile.xp >= state.profile.xpToNext) {
    state.profile.xp -= state.profile.xpToNext;
    state.profile.level += 1;
    state.profile.skillPoints += 1;
    state.profile.xpToNext = 100 + (state.profile.level - 1) * 50;
    state.profile.seasonLevel += 1;
    state.profile.seasonXp += 12;
    state.profile.battlePassXp += 8;
    showToast(`Nível ${state.profile.level}!`);
    playTone(880, 0.12, "triangle", 0.05);
  }
  if (state.profile.level >= 100) {
    state.profile.prestige += 1;
    state.profile.level = 1;
    state.profile.xp = 0;
    state.profile.xpToNext = 100;
    showToast(`Prestígio ${state.profile.prestige}`);
  }
  renderSkillTree();
  renderHud();
}

function spawnFood() {
  const availableCells = [];
  for (let y = 0; y < boardSize; y += 1) {
    for (let x = 0; x < boardSize; x += 1) {
      const occupiedBySnake = state.snake.some((segment) => segment.x === x && segment.y === y);
      const occupiedByObstacle = state.obstacles.some((segment) => segment.x === x && segment.y === y);
      const occupiedByPowerUp = state.powerUp && state.powerUp.x === x && state.powerUp.y === y;
      if (!occupiedBySnake && !occupiedByObstacle && !occupiedByPowerUp) availableCells.push({ x, y });
    }
  }
  if (!availableCells.length) { endGame(); return; }
  const choice = availableCells[Math.floor(Math.random() * availableCells.length)];
  const roll = Math.random();
  let type = "common";
  if (roll < 0.005) type = "divine";
  else if (roll < 0.015) type = "mythic";
  else if (roll < 0.06) type = "legendary";
  else if (roll < 0.16) type = "epic";
  else if (roll < 0.34) type = "rare";
  const points = foodTypes[type].points;
  state.food = { ...choice, type, points, expiresAt: type === "legendary" ? performance.now() + 5000 : null };
}

function maybeSpawnPowerUp() {
  if (state.powerUp || Math.random() > 0.12) return;
  const availableCells = [];
  for (let y = 0; y < boardSize; y += 1) {
    for (let x = 0; x < boardSize; x += 1) {
      const occupiedBySnake = state.snake.some((segment) => segment.x === x && segment.y === y);
      const occupiedByObstacle = state.obstacles.some((segment) => segment.x === x && segment.y === y);
      const occupiedByFood = state.food && state.food.x === x && state.food.y === y;
      if (!occupiedBySnake && !occupiedByObstacle && !occupiedByFood) availableCells.push({ x, y });
    }
  }
  if (!availableCells.length) return;
  const choice = availableCells[Math.floor(Math.random() * availableCells.length)];
  const keys = Object.keys(powerUps);
  state.powerUp = { ...choice, type: keys[Math.floor(Math.random() * keys.length)] };
}

function maybeSpawnEnemy() {
  if (state.enemies.length >= 2 || state.score < 10) return;
  if (Math.random() < 0.02) {
    const spawn = findFreeCell();
    if (spawn) state.enemies.push({ id: Date.now() + Math.random(), ...spawn, dir: "right", alive: true });
  }
}

function maybeSpawnBoss() {
  if (state.boss || state.score < 25 || Math.random() > 0.01) return;
  const spawn = findFreeCell();
  if (!spawn) return;
  state.boss = { id: "boss", ...spawn, hp: 45, maxHp: 45, cooldown: 0 };
  showToast("Boss surgiu!");
}

function findFreeCell() {
  const candidates = [];
  for (let y = 0; y < boardSize; y += 1) {
    for (let x = 0; x < boardSize; x += 1) {
      const occupiedBySnake = state.snake.some((segment) => segment.x === x && segment.y === y);
      const occupiedByObstacle = state.obstacles.some((segment) => segment.x === x && segment.y === y);
      const occupiedByFood = state.food && state.food.x === x && state.food.y === y;
      if (!occupiedBySnake && !occupiedByObstacle && !occupiedByFood) candidates.push({ x, y });
    }
  }
  return candidates[Math.floor(Math.random() * candidates.length)] || null;
}

function updateEnemies(delta) {
  state.enemies = state.enemies.filter((enemy) => enemy.alive);
  state.enemies.forEach((enemy) => {
    if (Math.random() < 0.6) {
      const target = state.food || { x: state.snake[0].x, y: state.snake[0].y };
      const dx = target.x - enemy.x;
      const dy = target.y - enemy.y;
      if (Math.abs(dx) > Math.abs(dy)) enemy.x += dx > 0 ? 1 : -1;
      else enemy.y += dy > 0 ? 1 : -1;
      if (enemy.x < 0) enemy.x = boardSize - 1;
      if (enemy.y < 0) enemy.y = boardSize - 1;
      if (enemy.x >= boardSize) enemy.x = 0;
      if (enemy.y >= boardSize) enemy.y = 0;
    }
    const collided = state.snake.some((segment) => segment.x === enemy.x && segment.y === enemy.y);
    if (collided) {
      takeDamage(12);
      enemy.alive = false;
    }
    if (state.food && enemy.x === state.food.x && enemy.y === state.food.y) {
      state.food = null;
      spawnFood();
    }
  });
}

function updateBoss(delta) {
  if (!state.boss) return;
  state.boss.cooldown -= delta;
  if (state.boss.cooldown <= 0) {
    const target = state.snake[0];
    const dx = target.x - state.boss.x;
    const dy = target.y - state.boss.y;
    if (Math.abs(dx) > Math.abs(dy)) state.boss.x += dx > 0 ? 1 : -1;
    else state.boss.y += dy > 0 ? 1 : -1;
    state.boss.cooldown = 1000;
    addParticle(state.boss, "#ff6b6b", 12);
  }
  const hitPlayer = state.snake.some((segment) => segment.x === state.boss.x && segment.y === state.boss.y);
  if (hitPlayer) {
    takeDamage(18);
    state.boss.hp -= 1;
  }
  if (state.boss.hp <= 0) {
    state.stats.bossDefeats += 1;
    state.profile.coins += 40;
    state.profile.xp += 120;
    updateProgression();
    showToast("Boss derrotado!");
    state.boss = null;
  }
}

function activatePowerUp(type) {
  if (!state.inventory[type]) return;
  state.inventory[type] = Math.max(0, state.inventory[type] - 1);
  state.stats.totalPowerUps += 1;
  state.activeEffects[type] = true;
  state.effectsTime[type] = powerUps[type].duration;
  if (type === "heal") {
    state.health = Math.min(state.maxHealth, state.health + 24);
    showToast("Vida restaurada");
  } else if (type === "bomb") {
    state.obstacles = [];
    showToast("Campo limpo");
  } else {
    showToast(`${powerUps[type].label} ativado!`);
  }
  renderPowerUps();
  playTone(700 + Object.keys(state.activeEffects).length * 70, 0.14, "triangle", 0.04);
}

function endGame() {
  if (state.gameOver) return;
  state.gameOver = true;
  state.paused = false;
  state.stats.totalDeaths += 1;
  state.stats.totalTimeMs += state.timeMs;
  state.stats.highestScore = Math.max(state.stats.highestScore, state.score);
  addToLeaderboard();
  saveStats();
  showOverlay("game-over");
  stopBackgroundMusic();
  playTone(220, 0.16, "sawtooth", 0.05);
  setTimeout(() => playTone(180, 0.16, "sawtooth", 0.05), 120);
}

function addToLeaderboard() {
  state.leaderboard.push({ name: state.profile.name, score: state.score, date: new Date().toLocaleDateString("pt-BR") });
  state.leaderboard.sort((a, b) => b.score - a.score);
  state.leaderboard = state.leaderboard.slice(0, 10);
  saveLeaderboard();
}

function renderHud() {
  scoreEl.textContent = state.score;
  highScoreEl.textContent = Math.max(state.stats.highestScore, state.score);
  levelEl.textContent = state.profile.level;
  coinsEl.textContent = state.profile.coins;
  prestigeText.textContent = state.profile.prestige;
  seasonText.textContent = `S${state.profile.seasonLevel} • ${state.profile.seasonXp}`;
  gamesPlayedEl.textContent = state.stats.gamesPlayed;
  foodEatenEl.textContent = state.stats.foodEaten;
  totalTimeEl.textContent = `${Math.floor((state.stats.totalTimeMs + state.timeMs) / 1000)}s`;
  healthTextEl.textContent = `${Math.max(0, Math.round(state.health))}/${Math.round(state.maxHealth)}`;
  updateProfileUI();
}

function updateProfileUI() {
  playerNameText.textContent = state.profile.name;
  playerLevelText.textContent = `Nível ${state.profile.level} • ${state.profile.xp} XP`;
  xpText.textContent = `${state.profile.xp} / ${state.profile.xpToNext} XP`;
  modeText.textContent = modes[state.mode]?.label || "Clássico";
  avatarBadge.textContent = state.profile.avatar;
  const percent = Math.min(100, (state.profile.xp / state.profile.xpToNext) * 100);
  xpFill.style.width = `${percent}%`;
  if (state.screen === "game") overlay.classList.remove("active");
}

function renderSkillTree() {
  skillPointsEl.textContent = state.profile.skillPoints;
  skillTreeEl.innerHTML = skillDefinitions.map((skill) => `
    <button class="skill-btn ${state.skills[skill.key] ? "active" : ""}" data-skill="${skill.key}">
      <span>${skill.name} ${state.skills[skill.key] ? `(${state.skills[skill.key]})` : ""}</span>
      <strong>${skill.cost} pts</strong>
    </button>`).join("");
}

function handleSkillClick(event) {
  const button = event.target.closest("button[data-skill]");
  if (!button) return;
  const key = button.getAttribute("data-skill");
  const skill = skillDefinitions.find((entry) => entry.key === key);
  if (!skill || state.profile.skillPoints < skill.cost) return;
  state.profile.skillPoints -= skill.cost;
  state.skills[key] += 1;
  state.maxHealth = 100 + state.skills.health * 25;
  state.health = Math.min(state.maxHealth, state.health + 10);
  saveProfile();
  renderSkillTree();
  renderHud();
  showToast(`${skill.name} melhorada`);
}

function renderPowerUps() {
  const entries = Object.entries(powerUps).map(([key, value]) => `
    <div class="powerup-pill">
      <div class="meta">
        <strong>${value.icon} ${value.label}</strong>
        <span>${value.desc}</span>
      </div>
      <button data-powerup="${key}" class="secondary">Usar (${state.inventory[key] || 0})</button>
    </div>`).join("");
  powerupList.innerHTML = entries;
}

function handlePowerUpClick(event) {
  const button = event.target.closest("button[data-powerup]");
  if (!button) return;
  const key = button.getAttribute("data-powerup");
  if ((state.inventory[key] || 0) > 0) activatePowerUp(key);
}

function renderChallenges() {
  challengeListEl.innerHTML = state.challenges.map((challenge) => {
    const progress = Math.min(challenge.goal, challenge.progress);
    const pct = (progress / challenge.goal) * 100;
    return `<div class="challenge-pill"><div class="meta"><strong>${challenge.label}</strong><span>${progress}/${challenge.goal}</span></div><span class="pill-light">${pct.toFixed(0)}%</span></div>`;
  }).join("");
}

function renderRanking() {
  if (!state.leaderboard.length) {
    rankingList.innerHTML = '<li><span>Nenhuma partida ainda</span><strong>—</strong></li>';
    return;
  }
  rankingList.innerHTML = state.leaderboard.map((entry, index) => `<li><span>#${index + 1} ${entry.name}</span><strong>${entry.score}</strong></li>`).join("");
}

function render() {
  drawBackground();
  drawBoard();
  drawFood();
  drawPowerUp();
  drawObstacles();
  drawPortals();
  drawEnemies();
  drawBoss();
  drawSnake();
  drawParticles();
  drawFloatingTexts();
}

function drawBackground() {
  const biome = biomes[state.biome] || biomes.forest;
  const gradient = ctx.createLinearGradient(0, 0, 480, 480);
  gradient.addColorStop(0, biome.colorA);
  gradient.addColorStop(1, biome.colorB);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (state.weather === "rain") {
    for (let i = 0; i < 32; i += 1) {
      const x = (i * 17 + performance.now() * 0.03) % 480;
      const y = (i * 28 + performance.now() * 0.08) % 480;
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(x, y, 2, 10);
    }
  }
  if (state.weather === "snow") {
    for (let i = 0; i < 24; i += 1) {
      const x = (i * 19 + performance.now() * 0.01) % 480;
      const y = (i * 29 + performance.now() * 0.02) % 480;
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (state.weather === "storm") { ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(0, 0, 480, 480); }
  if (state.weather === "fog") { ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(0, 0, 480, 480); }
}

function drawBoard() {
  ctx.save();
  const shakeX = (Math.random() - 0.5) * state.shake;
  const shakeY = (Math.random() - 0.5) * state.shake;
  ctx.translate(shakeX, shakeY);
  const size = cellSize;
  if (state.settings.showGrid) {
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= boardSize; i += 1) {
      const pos = i * size;
      ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, 480); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(480, pos); ctx.stroke();
    }
  }
  ctx.restore();
  state.shake = Math.max(0, state.shake - 0.4);
}

function drawFood() {
  if (!state.food) return;
  const size = cellSize;
  const x = state.food.x * size + size / 2;
  const y = state.food.y * size + size / 2;
  const pulse = 1 + Math.sin(performance.now() / 220) * 0.08;
  const radius = size * 0.28 * pulse;
  const info = foodTypes[state.food.type] || foodTypes.common;
  ctx.save();
  ctx.shadowBlur = 18;
  ctx.shadowColor = info.color;
  ctx.fillStyle = info.color;
  ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawPowerUp() {
  if (!state.powerUp) return;
  const size = cellSize;
  const x = state.powerUp.x * size + size / 2;
  const y = state.powerUp.y * size + size / 2;
  ctx.save();
  ctx.shadowBlur = 16;
  ctx.shadowColor = "#f59e0b";
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath(); ctx.arc(x, y, size * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawObstacles() {
  const size = cellSize;
  state.obstacles.forEach((obstacle) => {
    const x = obstacle.x * size + 2;
    const y = obstacle.y * size + 2;
    ctx.fillStyle = "#64748b";
    ctx.fillRect(x, y, size - 4, size - 4);
  });
}

function drawPortals() {
  const size = cellSize;
  state.portals.forEach((portal, index) => {
    const x = portal.x * size + size / 2;
    const y = portal.y * size + size / 2;
    ctx.save();
    ctx.fillStyle = index === 0 ? "#8b5cf6" : "#22d3ee";
    ctx.beginPath(); ctx.arc(x, y, size * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
}

function drawEnemies() {
  state.enemies.forEach((enemy) => {
    const size = cellSize;
    const x = enemy.x * size + 1;
    const y = enemy.y * size + 1;
    ctx.save();
    ctx.fillStyle = "#f43f5e";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#f43f5e";
    ctx.fillRect(x, y, size - 2, size - 2);
    ctx.restore();
  });
}

function drawBoss() {
  if (!state.boss) return;
  const size = cellSize;
  const x = state.boss.x * size + 1;
  const y = state.boss.y * size + 1;
  ctx.save();
  const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
  gradient.addColorStop(0, "#ef4444");
  gradient.addColorStop(1, "#fbbf24");
  ctx.fillStyle = gradient;
  ctx.shadowBlur = 16;
  ctx.shadowColor = "#ef4444";
  ctx.fillRect(x, y, size - 2, size - 2);
  ctx.restore();
}

function drawSnake() {
  const size = cellSize;
  state.snake.forEach((segment, index) => {
    const x = segment.x * size + 1;
    const y = segment.y * size + 1;
    const block = size - 2;
    ctx.save();
    if (index === 0) {
      const gradient = ctx.createLinearGradient(x, y, x + block, y + block);
      gradient.addColorStop(0, modes[state.mode].color);
      gradient.addColorStop(1, "#ffffff");
      ctx.fillStyle = gradient;
      ctx.shadowBlur = 9;
      ctx.shadowColor = "rgba(36,232,179,0.35)";
      ctx.fillRect(x, y, block, block);
      drawEyes(x, y, block, state.lastDirection);
    } else {
      ctx.fillStyle = index < 3 ? "#34d399" : "#2c7a7b";
      ctx.fillRect(x, y, block, block);
    }
    ctx.restore();
  });
}

function drawEyes(x, y, size, direction) {
  const eye = size * 0.16;
  ctx.fillStyle = "#071a28";
  if (direction === "left") {
    ctx.fillRect(x + size * 0.24, y + size * 0.24, eye, eye);
    ctx.fillRect(x + size * 0.24, y + size * 0.60, eye, eye);
  } else if (direction === "right") {
    ctx.fillRect(x + size * 0.60, y + size * 0.24, eye, eye);
    ctx.fillRect(x + size * 0.60, y + size * 0.60, eye, eye);
  } else if (direction === "up") {
    ctx.fillRect(x + size * 0.24, y + size * 0.24, eye, eye);
    ctx.fillRect(x + size * 0.60, y + size * 0.24, eye, eye);
  } else {
    ctx.fillRect(x + size * 0.24, y + size * 0.60, eye, eye);
    ctx.fillRect(x + size * 0.60, y + size * 0.60, eye, eye);
  }
}

function drawParticles() {
  state.particles.forEach((particle) => {
    ctx.save();
    ctx.globalAlpha = particle.life / 1000;
    ctx.fillStyle = particle.color;
    ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
}

function addParticle(target, color, count) {
  for (let i = 0; i < count; i += 1) {
    const x = target.x * cellSize + cellSize / 2 + (Math.random() - 0.5) * 10;
    const y = target.y * cellSize + cellSize / 2 + (Math.random() - 0.5) * 10;
    state.particles.push({ x, y, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, size: 2 + Math.random() * 2, life: 1000, color });
  }
}

function updateParticles(delta) {
  state.particles = state.particles.filter((particle) => particle.life > 0);
  state.particles.forEach((particle) => {
    particle.life -= delta;
    particle.x += particle.vx * (delta / 16);
    particle.y += particle.vy * (delta / 16);
  });
}

function drawFloatingTexts() {
  state.floatingTexts.forEach((item) => {
    const x = item.x * cellSize + cellSize / 2;
    const y = item.y * cellSize + cellSize / 2;
    ctx.save();
    ctx.globalAlpha = Math.max(0, item.life / 900);
    ctx.font = "bold 16px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillStyle = item.text.startsWith("+") ? "#ffffff" : "#ffd166";
    ctx.fillText(item.text, x, y);
    ctx.restore();
  });
}

function updateFloatingTexts(delta) {
  state.floatingTexts = state.floatingTexts.filter((item) => item.life > 0);
  state.floatingTexts.forEach((item) => { item.life -= delta; item.y -= 0.03 * delta; });
}

function togglePause() {
  if (state.screen === "game") {
    state.paused = !state.paused;
    if (state.paused) showOverlay("pause"); else overlay.classList.remove("active");
  }
}

function openSettings() {
  settingsPanel.classList.remove("hidden");
  settingsPanel.setAttribute("aria-hidden", "false");
  updateSettingsForm();
}

function closeSettings() {
  settingsPanel.classList.add("hidden");
  settingsPanel.setAttribute("aria-hidden", "true");
}

function updateSettingsForm() {
  playerNameInput.value = state.profile.name;
  avatarSelect.value = state.profile.avatar;
  modeSelect.value = state.mode;
  biomeSelect.value = state.biome;
  weatherSelect.value = state.weather;
  themeSelect.value = state.settings.theme;
  soundToggle.checked = state.settings.sound;
  musicToggle.checked = state.settings.music;
  gridToggle.checked = state.settings.showGrid;
  qualitySelect.value = state.settings.quality;
}

function saveSettingsFromUi() {
  state.profile.name = playerNameInput.value.trim() || "Jogador";
  state.profile.avatar = avatarSelect.value;
  state.mode = modeSelect.value;
  state.biome = biomeSelect.value;
  state.weather = weatherSelect.value;
  state.settings.theme = themeSelect.value;
  state.settings.sound = soundToggle.checked;
  state.settings.music = musicToggle.checked;
  state.settings.showGrid = gridToggle.checked;
  state.settings.quality = qualitySelect.value;
  applyTheme();
  saveProfile();
  renderHud();
  if (state.settings.music) startBackgroundMusic(); else stopBackgroundMusic();
}

function applyTheme() {
  document.body.setAttribute("data-theme", state.settings.theme);
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toastEl.classList.remove("show"), 1800);
}

function ensureAudioContext() {
  if (!state.audioContext) state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (state.audioContext.state === "suspended") state.audioContext.resume();
  return state.audioContext;
}

function playTone(freq, duration, type = "sine", gainLevel = 0.05) {
  if (!state.settings.sound) return;
  const ctx = ensureAudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = freq;
  gain.gain.value = gainLevel;
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
}

function playFoodSound(type) {
  if (!state.settings.sound) return;
  const map = { common: [660], rare: [780], epic: [900], legendary: [1040], mythic: [1180], divine: [1320] };
  const list = map[type] || map.common;
  list.forEach((freq, index) => setTimeout(() => playTone(freq, 0.08, "triangle", 0.04), index * 40));
}

function startBackgroundMusic() {
  if (!state.settings.music || state.musicTimer) return;
  ensureAudioContext();
  stopBackgroundMusic();
  state.musicTimer = setInterval(() => {
    if (!state.settings.music || state.screen !== "game" || state.paused || state.gameOver) return;
    playTone(392, 0.16, "sine", 0.012);
    setTimeout(() => playTone(523, 0.16, "triangle", 0.012), 110);
  }, 700);
}

function stopBackgroundMusic() {
  if (state.musicTimer) {
    clearInterval(state.musicTimer);
    state.musicTimer = null;
  }
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();
  if (key === "p") { event.preventDefault(); togglePause(); return; }
  if (key === " ") { event.preventDefault(); startLoading(); return; }
  if (key === "arrowup" || key === "w") { event.preventDefault(); state.nextDirection = "up"; return; }
  if (key === "arrowdown" || key === "s") { event.preventDefault(); state.nextDirection = "down"; return; }
  if (key === "arrowleft" || key === "a") { event.preventDefault(); state.nextDirection = "left"; return; }
  if (key === "arrowright" || key === "d") { event.preventDefault(); state.nextDirection = "right"; return; }
  if (key === "e") { event.preventDefault(); openSettings(); }
}
