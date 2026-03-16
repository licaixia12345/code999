import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  icon?: ReactNode;
};

export function Toggle({ label, description, checked, onChange, icon }: Props) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-start justify-between gap-4 rounded-xl border px-3 py-2 text-left transition",
        checked ? "border-emerald-300/25 bg-emerald-300/10" : "border-white/10 bg-white/5 hover:bg-white/8",
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
          {icon ? <span className="text-white/70">{icon}</span> : null}
          <span className="truncate">{label}</span>
        </div>
        <div className="mt-1 text-xs text-white/55">{description}</div>
      </div>
      <span
        aria-hidden="true"
        className={cn(
          "relative mt-1 inline-flex h-5 w-9 items-center rounded-full border border-white/15 bg-black/20 p-0.5 transition",
          checked && "border-emerald-300/40 bg-emerald-300/20",
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-white/60 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.9)] transition",
            checked && "translate-x-4 bg-white/85",
          )}
        />
      </span>
    </button>
  );
}

