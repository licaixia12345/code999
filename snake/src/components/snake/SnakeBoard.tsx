import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { DPad } from "@/components/snake/components/DPad";
import { useElementSize } from "@/hooks/useElementSize";
import type { GameConfig, GameState } from "@/utils/snakeEngine";

type Props = {
  config: GameConfig;
  state: GameState;
  reduceMotion: boolean;
  onStart: () => void;
  onDirection: (direction: "up" | "down" | "left" | "right") => void;
};

export function SnakeBoard({ config, state, reduceMotion, onStart, onDirection }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const { width: frameWidth } = useElementSize(frameRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const safeWidth = Math.max(320, frameWidth);
    const maxBoardWidth = Math.min(920, safeWidth);
    const cell = Math.max(12, Math.min(22, Math.floor((maxBoardWidth - 24) / config.gridWidth)));

    const cssW = cell * config.gridWidth;
    const cssH = cell * config.gridHeight;
    const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));

    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = cssW;
    const h = cssH;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "rgba(5, 10, 18, 0.94)";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(104, 255, 219, 0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= config.gridWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cell + 0.5, 0);
      ctx.lineTo(x * cell + 0.5, h);
      ctx.stroke();
    }
    for (let y = 0; y <= config.gridHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cell + 0.5);
      ctx.lineTo(w, y * cell + 0.5);
      ctx.stroke();
    }

    const food = state.food;
    const foodX = food.pos.x * cell;
    const foodY = food.pos.y * cell;
    const foodCx = foodX + cell / 2;
    const foodCy = foodY + cell / 2;

    const glow = ctx.createRadialGradient(foodCx, foodCy, 1, foodCx, foodCy, cell * 1.1);
    const foodHue = food.kind === "bonus" ? 48 : food.kind === "slow" ? 205 : 160;
    glow.addColorStop(0, `hsla(${foodHue} 100% 62% / 0.85)`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(foodX - cell, foodY - cell, cell * 3, cell * 3);

    ctx.fillStyle = `hsla(${foodHue} 100% 55% / 0.95)`;
    ctx.beginPath();
    ctx.roundRect(foodX + cell * 0.18, foodY + cell * 0.18, cell * 0.64, cell * 0.64, cell * 0.22);
    ctx.fill();

    for (let i = state.snake.length - 1; i >= 0; i--) {
      const seg = state.snake[i];
      const x = seg.x * cell;
      const y = seg.y * cell;
      const t = i / Math.max(1, state.snake.length - 1);
      const hue = 175 + t * 55;
      const alpha = 0.88 - t * 0.25;
      ctx.fillStyle = `hsla(${hue} 100% 55% / ${alpha})`;
      const r = i === 0 ? cell * 0.28 : cell * 0.2;
      ctx.beginPath();
      ctx.roundRect(x + cell * 0.12, y + cell * 0.12, cell * 0.76, cell * 0.76, r);
      ctx.fill();

      if (i === 0) {
        ctx.fillStyle = "rgba(250, 250, 255, 0.9)";
        ctx.beginPath();
        ctx.roundRect(x + cell * 0.58, y + cell * 0.26, cell * 0.16, cell * 0.16, cell * 0.08);
        ctx.fill();
      }
    }

    if (state.status !== "running") {
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, w, h);
    }
  }, [config.gridHeight, config.gridWidth, frameWidth, state.food, state.snake, state.status]);

  return (
    <div className="space-y-4">
      <div
        ref={frameRef}
        className={cn(
          "crt relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_-18px_rgba(0,0,0,0.85)]",
          reduceMotion && "reduce-motion",
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.9] mix-blend-screen">
          <div className="crt-scanlines absolute inset-0" />
          <div className="crt-noise absolute inset-0" />
          <div className="crt-vignette absolute inset-0" />
        </div>

        <div className="relative grid place-items-center">
          <canvas ref={canvasRef} className="rounded-xl border border-white/10 bg-black/50" />
          {state.status !== "running" && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="w-[min(520px,92%)] rounded-2xl border border-white/12 bg-black/70 p-5 text-center shadow-[0_18px_60px_-18px_rgba(0,0,0,0.9)] backdrop-blur">
                <div className="font-display text-2xl text-white/95">
                  {state.status === "idle" ? "准备就绪" : state.status === "paused" ? "暂停中" : "游戏结束"}
                </div>
                <div className="mt-2 text-sm text-white/70">
                  {state.status === "idle"
                    ? "按 空格 开始，方向键或 WASD 转向"
                    : state.status === "paused"
                      ? "按 空格 继续，或点击右侧按钮"
                      : `最终得分 ${state.score}，按 R 重开`}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden">
        <DPad
          disabled={state.status === "gameOver"}
          onDirection={(d) => {
            if (state.status === "idle") onStart();
            onDirection(d);
          }}
        />
      </div>
    </div>
  );
}

