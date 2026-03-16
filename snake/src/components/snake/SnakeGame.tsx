import { useEffect, useMemo, useReducer, useRef } from "react";
import { cn } from "@/lib/utils";
import { useSnakePrefs } from "@/stores/snakePrefs";
import {
  type Direction,
  type GameConfig,
  type GameState,
  createInitialState,
  enqueueDirection,
  stepGame,
} from "@/utils/snakeEngine";
import { SnakeBoard } from "@/components/snake/SnakeBoard";
import { SnakePanel } from "@/components/snake/SnakePanel";

type Action =
  | { type: "start" }
  | { type: "pauseToggle" }
  | { type: "restart" }
  | { type: "direction"; direction: Direction }
  | { type: "tick" };

function reducer(state: GameState, action: Action, config: GameConfig): GameState {
  if (action.type === "start") {
    if (state.status === "idle") return { ...state, status: "running" };
    return state;
  }
  if (action.type === "pauseToggle") {
    if (state.status === "running") return { ...state, status: "paused" };
    if (state.status === "paused") return { ...state, status: "running" };
    return state;
  }
  if (action.type === "restart") {
    return createInitialState(config);
  }
  if (action.type === "direction") {
    return enqueueDirection(state, action.direction);
  }
  if (action.type === "tick") {
    if (state.status !== "running") return state;
    return stepGame(state, config);
  }
  return state;
}

export function SnakeGame() {
  const prefs = useSnakePrefs();

  const config = useMemo<GameConfig>(() => {
    const baseStepMsByLevel = [150, 130, 115, 102, 92];
    return {
      gridWidth: 26,
      gridHeight: 18,
      wrapMode: prefs.wrapMode,
      baseStepMs: baseStepMsByLevel[Math.max(0, Math.min(4, prefs.speedLevel - 1))],
      bonusFoodChance: 0.12,
      slowFoodChance: 0.1,
    };
  }, [prefs.speedLevel, prefs.wrapMode]);

  const [state, dispatch] = useReducer((s: GameState, a: Action) => reducer(s, a, config), createInitialState(config));
  const appliedConfigKeyRef = useRef<string>("");

  useEffect(() => {
    const key = `${config.gridWidth}x${config.gridHeight}-${config.wrapMode}`;
    if (appliedConfigKeyRef.current && appliedConfigKeyRef.current !== key) dispatch({ type: "restart" });
    appliedConfigKeyRef.current = key;
  }, [config.gridHeight, config.gridWidth, config.wrapMode]);

  useEffect(() => {
    if (state.status === "gameOver") {
      if (state.score > prefs.bestScore) prefs.setBestScore(state.score);
    }
  }, [prefs, state.score, state.status]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const dir =
        key === "arrowup" || key === "w"
          ? "up"
          : key === "arrowdown" || key === "s"
            ? "down"
            : key === "arrowleft" || key === "a"
              ? "left"
              : key === "arrowright" || key === "d"
                ? "right"
                : null;

      if (dir) {
        e.preventDefault();
        if (state.status === "idle") dispatch({ type: "start" });
        dispatch({ type: "direction", direction: dir });
        return;
      }

      if (key === " " || key === "space") {
        e.preventDefault();
        if (state.status === "idle") dispatch({ type: "start" });
        else dispatch({ type: "pauseToggle" });
        return;
      }

      if (key === "r") {
        e.preventDefault();
        dispatch({ type: "restart" });
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.status]);

  useEffect(() => {
    if (!prefs.soundEnabled) return;
    if (!state.lastEvent) return;

    if (state.lastEvent.type === "eat") {
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = state.lastEvent.kind === "bonus" ? 520 : state.lastEvent.kind === "slow" ? 160 : 380;
      g.gain.value = 0.03;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.05);
      void ctx.close();
      return;
    }

    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(220, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.25);
    g.gain.value = 0.04;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.26);
    void ctx.close();
  }, [prefs.soundEnabled, state.lastEvent]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const loop = (now: number) => {
      const dt = Math.min(60, now - last);
      last = now;
      acc += dt;

      const slowFactor = state.slowTicksRemaining > 0 ? 1.35 : 1;
      const stepMs = config.baseStepMs * slowFactor;

      if (state.status === "running") {
        while (acc >= stepMs) {
          acc -= stepMs;
          dispatch({ type: "tick" });
        }
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [config.baseStepMs, state.slowTicksRemaining, state.status]);

  const statusLabel =
    state.status === "idle"
      ? "待机"
      : state.status === "running"
        ? "运行中"
        : state.status === "paused"
          ? "已暂停"
          : "已结束";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <div className="text-[11px] font-semibold tracking-[0.22em] text-emerald-200/70">SCORE</div>
            <div className="font-display text-3xl text-emerald-100 tabular-nums">{state.score}</div>
            <div className="text-[11px] font-semibold tracking-[0.22em] text-fuchsia-200/70">BEST</div>
            <div className="font-display text-3xl text-fuchsia-100 tabular-nums">{prefs.bestScore}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.22em] text-white/55">{statusLabel}</span>
            <span className={cn("h-2.5 w-2.5 rounded-full", state.status === "running" ? "bg-emerald-400" : "bg-white/20")} />
          </div>
        </div>

        <SnakeBoard
          config={config}
          state={state}
          reduceMotion={prefs.reduceMotion}
          onStart={() => dispatch({ type: "start" })}
          onDirection={(direction) => dispatch({ type: "direction", direction })}
        />
      </div>

      <SnakePanel
        prefs={prefs}
        state={state}
        onStartOrPauseToggle={() => dispatch({ type: state.status === "idle" ? "start" : "pauseToggle" })}
        onRestart={() => dispatch({ type: "restart" })}
      />
    </div>
  );
}
