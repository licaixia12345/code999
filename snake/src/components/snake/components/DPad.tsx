import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import type { Direction } from "@/utils/snakeEngine";
import { cn } from "@/lib/utils";

type Props = {
  disabled?: boolean;
  onDirection: (direction: Direction) => void;
};

export function DPad({ disabled, onDirection }: Props) {
  return (
    <div className="mx-auto w-[min(360px,100%)] select-none rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="grid grid-cols-3 gap-2">
        <div />
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDirection("up")}
          className={cn(
            "grid place-items-center rounded-xl border border-white/10 bg-white/5 p-3 text-white/80 transition active:scale-[0.99]",
            disabled ? "opacity-50" : "hover:border-emerald-300/25 hover:bg-emerald-300/10",
          )}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
        <div />
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDirection("left")}
          className={cn(
            "grid place-items-center rounded-xl border border-white/10 bg-white/5 p-3 text-white/80 transition active:scale-[0.99]",
            disabled ? "opacity-50" : "hover:border-emerald-300/25 hover:bg-emerald-300/10",
          )}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDirection("down")}
          className={cn(
            "grid place-items-center rounded-xl border border-white/10 bg-white/5 p-3 text-white/80 transition active:scale-[0.99]",
            disabled ? "opacity-50" : "hover:border-emerald-300/25 hover:bg-emerald-300/10",
          )}
        >
          <ArrowDown className="h-5 w-5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDirection("right")}
          className={cn(
            "grid place-items-center rounded-xl border border-white/10 bg-white/5 p-3 text-white/80 transition active:scale-[0.99]",
            disabled ? "opacity-50" : "hover:border-emerald-300/25 hover:bg-emerald-300/10",
          )}
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-3 text-center text-[11px] font-semibold tracking-[0.18em] text-white/45">TOUCH</div>
    </div>
  );
}

