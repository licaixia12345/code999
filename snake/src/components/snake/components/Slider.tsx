import { cn } from "@/lib/utils";

type Props = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
};

export function Slider({ min, max, value, onChange, ariaLabel }: Props) {
  return (
    <div className="relative">
      <input
        aria-label={ariaLabel}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 outline-none"
      />
      <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-white/45">
        <span>慢</span>
        <span>快</span>
      </div>
      <div
        className={cn(
          "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_24px_rgba(104,255,219,0.14)]",
        )}
        style={{
          left: `calc(${((value - min) / Math.max(1, max - min)) * 100}% - 8px)`,
        }}
      />
    </div>
  );
}

