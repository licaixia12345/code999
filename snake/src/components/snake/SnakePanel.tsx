import { Pause, Play, RotateCcw, Volume2, VolumeX, WrapText } from "lucide-react";
import type { GameState } from "@/utils/snakeEngine";
import type { SnakePrefsState } from "@/stores/snakePrefs";
import { Slider } from "@/components/snake/components/Slider";
import { Toggle } from "@/components/snake/components/Toggle";

type Props = {
  prefs: SnakePrefsState;
  state: GameState;
  onStartOrPauseToggle: () => void;
  onRestart: () => void;
};

export function SnakePanel({ prefs, state, onStartOrPauseToggle, onRestart }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-white/85">控制</div>
          <div className="text-xs font-semibold tracking-[0.18em] text-white/45">SPACE / R</div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onStartOrPauseToggle}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85 transition hover:border-emerald-300/30 hover:bg-emerald-300/10"
          >
            {state.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {state.status === "running" ? "暂停" : "开始"}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85 transition hover:border-fuchsia-300/30 hover:bg-fuchsia-300/10"
          >
            <RotateCcw className="h-4 w-4" />
            重开
          </button>
          <button
            type="button"
            onClick={() => prefs.setSoundEnabled(!prefs.soundEnabled)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85 transition hover:border-white/20 hover:bg-white/10"
          >
            {prefs.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            音效
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-white/85">难度</div>
          <div className="text-xs font-semibold tabular-nums text-white/55">Lv {prefs.speedLevel}</div>
        </div>
        <div className="mt-3">
          <Slider min={1} max={5} value={prefs.speedLevel} onChange={(v) => prefs.setSpeedLevel(v)} ariaLabel="速度等级" />
        </div>
        <div className="mt-4 grid gap-3">
          <Toggle
            icon={<WrapText className="h-4 w-4" />}
            label="穿墙模式"
            description="到边缘会从另一侧出现"
            checked={prefs.wrapMode}
            onChange={(v) => prefs.setWrapMode(v)}
          />
          <Toggle
            label="减少动效"
            description="降低闪烁与扫描线强度"
            checked={prefs.reduceMotion}
            onChange={(v) => prefs.setReduceMotion(v)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 backdrop-blur">
        <div className="text-xs font-semibold tracking-[0.18em] text-white/45">提示</div>
        <div className="mt-2 space-y-1">
          <div>方向键 / WASD：转向</div>
          <div>空格：开始/暂停</div>
          <div>R：重开</div>
        </div>
      </div>
    </div>
  );
}
