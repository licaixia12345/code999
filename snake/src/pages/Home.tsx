import { SnakeGame } from "@/components/snake/SnakeGame";

export default function Home() {
  return (
    <div className="min-h-dvh px-6 py-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col gap-4 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.28em] text-emerald-200/70">NEON CRT</div>
            <h1 className="mt-2 font-display text-4xl leading-[1.05] text-white/95 lg:text-5xl">
              贪吃蛇
              <span className="ml-3 text-white/35">S N A K E</span>
            </h1>
            <div className="mt-3 max-w-[58ch] text-sm text-white/60">
              吃掉脉冲食物，别咬到自己。奖励食物更高分，减速食物给你一点喘息。
            </div>
          </div>
          <div className="text-xs font-semibold tracking-[0.18em] text-white/45">
            ↑↓←→ / WASD · SPACE · R
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_90px_-30px_rgba(0,0,0,0.85)] backdrop-blur">
          <SnakeGame />
        </div>
      </div>
    </div>
  );
}
