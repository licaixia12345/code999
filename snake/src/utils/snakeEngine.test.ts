import { describe, expect, it } from "vitest";
import { createInitialState, enqueueDirection, stepGame, type GameConfig } from "@/utils/snakeEngine";

function cfg(partial: Partial<GameConfig> = {}): GameConfig {
  return {
    gridWidth: 10,
    gridHeight: 8,
    wrapMode: true,
    baseStepMs: 120,
    bonusFoodChance: 0,
    slowFoodChance: 0,
    rng: () => 0.42,
    ...partial,
  };
}

describe("snakeEngine", () => {
  it("creates a stable initial state", () => {
    const s = createInitialState(cfg());
    expect(s.status).toBe("idle");
    expect(s.snake.length).toBe(4);
    expect(s.score).toBe(0);
  });

  it("prevents immediate reverse direction", () => {
    const s0 = createInitialState(cfg());
    const s1 = enqueueDirection(s0, "left");
    expect(s1.directionQueue.length).toBe(0);
    const s2 = enqueueDirection(s0, "up");
    expect(s2.directionQueue).toEqual(["up"]);
  });

  it("moves one step and keeps length when not eating", () => {
    const c = cfg({ wrapMode: true });
    const s0 = createInitialState(c);
    const s1 = { ...s0, status: "running" as const };
    const s2 = stepGame(s1, c);
    expect(s2.snake.length).toBe(s1.snake.length);
    expect(s2.snake[0].x).toBe(s1.snake[0].x + 1);
  });

  it("eats food and increases score", () => {
    const c = cfg({ wrapMode: true });
    const s0 = createInitialState(c);
    const head = s0.snake[0];
    const s1 = {
      ...s0,
      status: "running" as const,
      food: { pos: { x: head.x + 1, y: head.y }, kind: "normal" as const },
    };
    const s2 = stepGame(s1, c);
    expect(s2.score).toBe(10);
    expect(s2.snake.length).toBe(s1.snake.length + 1);
    expect(s2.lastEvent?.type).toBe("eat");
  });

  it("wraps around when wrapMode is true", () => {
    const c = cfg({ gridWidth: 5, gridHeight: 5, wrapMode: true });
    const s0 = createInitialState(c);
    const s1 = {
      ...s0,
      status: "running" as const,
      snake: [{ x: 4, y: 2 }],
      direction: "right" as const,
      directionQueue: [],
    };
    const s2 = stepGame(s1, c);
    expect(s2.status).toBe("running");
    expect(s2.snake[0]).toEqual({ x: 0, y: 2 });
  });

  it("game overs on wall collision when wrapMode is false", () => {
    const c = cfg({ gridWidth: 5, gridHeight: 5, wrapMode: false });
    const s0 = createInitialState(c);
    const s1 = {
      ...s0,
      status: "running" as const,
      snake: [{ x: 4, y: 2 }],
      direction: "right" as const,
      directionQueue: [],
    };
    const s2 = stepGame(s1, c);
    expect(s2.status).toBe("gameOver");
    expect(s2.lastEvent?.type).toBe("gameOver");
  });
});

