import { BOARD_SIZE, DIRECTIONS, advanceGame, createGame, setDirection, togglePause } from "./game.js";

const board = document.querySelector("[data-board]");
const score = document.querySelector("[data-score]");
const status = document.querySelector("[data-status]");
const pauseButton = document.querySelector("[data-pause]");
const restartButton = document.querySelector("[data-restart]");
const controls = document.querySelectorAll("[data-direction]");

let state = createGame();
let timerId = null;

function cellKey(cell) {
  return `${cell.x},${cell.y}`;
}

function render() {
  const snake = new Set(state.snake.map(cellKey));
  const food = state.food && cellKey(state.food);
  const cells = [];
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const key = `${x},${y}`;
      const type = snake.has(key) ? (key === cellKey(state.snake[0]) ? " snake head" : " snake") : key === food ? " food" : "";
      cells.push(`<div class="cell${type}"></div>`);
    }
  }
  board.innerHTML = cells.join("");
  score.textContent = String(state.score);
  status.textContent = state.status === "game-over" ? "게임 오버" : state.status === "won" ? "승리!" : state.status === "paused" ? "일시정지" : "플레이 중";
  pauseButton.textContent = state.status === "paused" ? "계속" : "일시정지";
  pauseButton.disabled = state.status === "game-over" || state.status === "won";
}

function startTimer() {
  window.clearInterval(timerId);
  timerId = window.setInterval(() => {
    state = advanceGame(state);
    render();
  }, 120);
}

function changeDirection(name) {
  state = setDirection(state, DIRECTIONS[name]);
  render();
}

document.addEventListener("keydown", (event) => {
  const keyMap = { ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" };
  if (keyMap[event.key]) {
    event.preventDefault();
    changeDirection(keyMap[event.key]);
  }
  if (event.key === " ") {
    event.preventDefault();
    state = togglePause(state);
    render();
  }
});

controls.forEach((button) => button.addEventListener("click", () => changeDirection(button.dataset.direction)));
pauseButton.addEventListener("click", () => {
  state = togglePause(state);
  render();
});
restartButton.addEventListener("click", () => {
  state = createGame();
  render();
});

render();
startTimer();
