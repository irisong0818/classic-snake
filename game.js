export const BOARD_SIZE = 20;

export const DIRECTIONS = Object.freeze({
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
});

const DEFAULT_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

export function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

export function isOpposite(first, second) {
  return first.x + second.x === 0 && first.y + second.y === 0;
}

export function isInsideBoard(cell, size = BOARD_SIZE) {
  return cell.x >= 0 && cell.x < size && cell.y >= 0 && cell.y < size;
}

export function placeFood(snake, random = Math.random, size = BOARD_SIZE) {
  const openCells = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const cell = { x, y };
      if (!snake.some((segment) => sameCell(segment, cell))) openCells.push(cell);
    }
  }
  if (openCells.length === 0) return null;
  return openCells[Math.floor(random() * openCells.length)];
}

export function createGame(random = Math.random) {
  const snake = DEFAULT_SNAKE.map((cell) => ({ ...cell }));
  return {
    snake,
    direction: DIRECTIONS.right,
    food: placeFood(snake, random),
    score: 0,
    status: "playing",
    tick: 0
  };
}

export function setDirection(state, direction) {
  if (state.status !== "playing" || isOpposite(state.direction, direction)) return state;
  return { ...state, direction };
}

export function togglePause(state) {
  if (state.status === "game-over" || state.status === "won") return state;
  return { ...state, status: state.status === "paused" ? "playing" : "paused" };
}

export function advanceGame(state, random = Math.random, size = BOARD_SIZE) {
  if (state.status !== "playing") return state;

  const head = state.snake[0];
  const nextHead = { x: head.x + state.direction.x, y: head.y + state.direction.y };
  const eating = sameCell(nextHead, state.food);
  const bodyToCheck = eating ? state.snake : state.snake.slice(0, -1);

  if (!isInsideBoard(nextHead, size) || bodyToCheck.some((segment) => sameCell(segment, nextHead))) {
    return { ...state, status: "game-over", tick: state.tick + 1 };
  }

  const snake = eating ? [nextHead, ...state.snake] : [nextHead, ...state.snake.slice(0, -1)];
  const food = eating ? placeFood(snake, random, size) : state.food;
  return {
    ...state,
    snake,
    food,
    score: eating ? state.score + 1 : state.score,
    status: food === null ? "won" : "playing",
    tick: state.tick + 1
  };
}
