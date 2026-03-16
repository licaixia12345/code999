export type Direction = "up" | "down" | "left" | "right";
export type FoodKind = "normal" | "bonus" | "slow";

export type Point = {
  x: number;
  y: number;
};

export type Food = {
  pos: Point;
  kind: FoodKind;
};

export type LastEvent = { type: "eat"; kind: FoodKind } | { type: "gameOver" };

export type GameConfig = {
  gridWidth: number;
  gridHeight: number;
  wrapMode: boolean;
  baseStepMs: number;
  bonusFoodChance: number;
  slowFoodChance: number;
  rng?: () => number;
};

export type GameStatus = "idle" | "running" | "paused" | "gameOver";

export type GameState = {
  status: GameStatus;
  snake: Point[];
  direction: Direction;
  directionQueue: Direction[];
  food: Food;
  score: number;
  growthRemaining: number;
  slowTicksRemaining: number;
  lastEvent: LastEvent | null;
};

const opposite: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function key(p: Point) {
  return `${p.x},${p.y}`;
}

function clampWrap(n: number, max: number) {
  const r = n % max;
  return r < 0 ? r + max : r;
}

function nextPoint(head: Point, dir: Direction): Point {
  if (dir === "up") return { x: head.x, y: head.y - 1 };
  if (dir === "down") return { x: head.x, y: head.y + 1 };
  if (dir === "left") return { x: head.x - 1, y: head.y };
  return { x: head.x + 1, y: head.y };
}

function pickFoodKind(rng: () => number, cfg: GameConfig): FoodKind {
  const r = rng();
  if (r < cfg.slowFoodChance) return "slow";
  if (r < cfg.slowFoodChance + cfg.bonusFoodChance) return "bonus";
  return "normal";
}

export function spawnFood(cfg: GameConfig, snake: Point[]): Food {
  const rng = cfg.rng ?? Math.random;
  const occupied = new Set(snake.map(key));
  const cells = cfg.gridWidth * cfg.gridHeight;
  const attempts = Math.min(800, Math.max(80, cells * 2));

  for (let i = 0; i < attempts; i++) {
    const x = Math.floor(rng() * cfg.gridWidth);
    const y = Math.floor(rng() * cfg.gridHeight);
    const p = { x, y };
    if (!occupied.has(key(p))) {
      return { pos: p, kind: pickFoodKind(rng, cfg) };
    }
  }

  for (let y = 0; y < cfg.gridHeight; y++) {
    for (let x = 0; x < cfg.gridWidth; x++) {
      const p = { x, y };
      if (!occupied.has(key(p))) return { pos: p, kind: pickFoodKind(rng, cfg) };
    }
  }

  return { pos: { x: 0, y: 0 }, kind: "normal" };
}

export function createInitialState(cfg: GameConfig): GameState {
  const cx = Math.floor(cfg.gridWidth / 2);
  const cy = Math.floor(cfg.gridHeight / 2);

  const snake: Point[] = [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
    { x: cx - 3, y: cy },
  ];

  return {
    status: "idle",
    snake,
    direction: "right",
    directionQueue: [],
    food: spawnFood(cfg, snake),
    score: 0,
    growthRemaining: 0,
    slowTicksRemaining: 0,
    lastEvent: null,
  };
}

export function enqueueDirection(state: GameState, dir: Direction): GameState {
  const last = state.directionQueue[state.directionQueue.length - 1] ?? state.direction;
  if (dir === last) return state;
  if (dir === opposite[last]) return state;
  const nextQueue = state.directionQueue.length >= 2 ? state.directionQueue.slice(1) : state.directionQueue;
  return { ...state, directionQueue: [...nextQueue, dir] };
}

export function stepGame(state: GameState, cfg: GameConfig): GameState {
  const queued = state.directionQueue[0] ?? null;
  const direction = queued && queued !== opposite[state.direction] ? queued : state.direction;
  const directionQueue = queued ? state.directionQueue.slice(1) : state.directionQueue;

  const head = state.snake[0];
  const rawNext = nextPoint(head, direction);

  const nextPos = cfg.wrapMode
    ? { x: clampWrap(rawNext.x, cfg.gridWidth), y: clampWrap(rawNext.y, cfg.gridHeight) }
    : rawNext;

  if (!cfg.wrapMode) {
    if (nextPos.x < 0 || nextPos.x >= cfg.gridWidth || nextPos.y < 0 || nextPos.y >= cfg.gridHeight) {
      return { ...state, status: "gameOver", lastEvent: { type: "gameOver" } };
    }
  }

  const eating = nextPos.x === state.food.pos.x && nextPos.y === state.food.pos.y;
  const tailMoves = state.growthRemaining === 0 && !eating;
  const bodyForCollision = tailMoves ? state.snake.slice(0, -1) : state.snake;
  const occupied = new Set(bodyForCollision.map(key));
  if (occupied.has(key(nextPos))) {
    return { ...state, status: "gameOver", lastEvent: { type: "gameOver" } };
  }

  let score = state.score;
  let growthRemaining = state.growthRemaining > 0 ? state.growthRemaining - 1 : 0;
  let slowTicksRemaining = Math.max(0, state.slowTicksRemaining - 1);
  let food = state.food;
  let lastEvent: LastEvent | null = null;

  let grow = 0;
  if (eating) {
    const kind = state.food.kind;
    const gain = kind === "bonus" ? 25 : kind === "slow" ? 8 : 10;
    grow = kind === "bonus" ? 2 : 1;
    score += gain;
    if (kind === "slow") slowTicksRemaining = Math.max(slowTicksRemaining, 28);
    lastEvent = { type: "eat", kind };
  }

  const keepTailThisStep = state.growthRemaining > 0 || eating;
  const nextSnake = [nextPos, ...state.snake];
  if (!keepTailThisStep) nextSnake.pop();

  if (eating) {
    growthRemaining += Math.max(0, grow - 1);
    food = spawnFood(cfg, nextSnake);
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    directionQueue,
    score,
    growthRemaining,
    slowTicksRemaining,
    food,
    lastEvent,
  };
}
