import test from "node:test";
import assert from "node:assert/strict";
import { DIRECTIONS, advanceGame, createGame, placeFood, setDirection } from "./game.js";

test("moves one cell in its direction", () => {
  const state = createGame(() => 0);
  const next = advanceGame(state, () => 0);
  assert.deepEqual(next.snake[0], { x: 11, y: 10 });
  assert.equal(next.score, 0);
});

test("grows and increases score when it eats food", () => {
  const state = { ...createGame(() => 0), food: { x: 11, y: 10 } };
  const next = advanceGame(state, () => 0);
  assert.equal(next.snake.length, 4);
  assert.equal(next.score, 1);
  assert.deepEqual(next.food, { x: 0, y: 0 });
});

test("ends the game at the board edge", () => {
  const state = { ...createGame(() => 0), snake: [{ x: 19, y: 0 }], direction: DIRECTIONS.right };
  assert.equal(advanceGame(state).status, "game-over");
});

test("rejects an immediate reverse direction", () => {
  const state = createGame(() => 0);
  assert.equal(setDirection(state, DIRECTIONS.left), state);
});

test("food placement never returns an occupied cell", () => {
  const food = placeFood([{ x: 0, y: 0 }, { x: 1, y: 0 }], () => 0, 2);
  assert.deepEqual(food, { x: 0, y: 1 });
});
