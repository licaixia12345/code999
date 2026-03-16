import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SnakePrefsState = {
  speedLevel: number;
  wrapMode: boolean;
  soundEnabled: boolean;
  reduceMotion: boolean;
  bestScore: number;
  setSpeedLevel: (level: number) => void;
  setWrapMode: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setReduceMotion: (enabled: boolean) => void;
  setBestScore: (score: number) => void;
};

export const useSnakePrefs = create<SnakePrefsState>()(
  persist(
    (set) => ({
      speedLevel: 3,
      wrapMode: true,
      soundEnabled: true,
      reduceMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false,
      bestScore: 0,
      setSpeedLevel: (level) => set({ speedLevel: Math.max(1, Math.min(5, Math.round(level))) }),
      setWrapMode: (enabled) => set({ wrapMode: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setReduceMotion: (enabled) => set({ reduceMotion: enabled }),
      setBestScore: (score) => set((s) => ({ bestScore: Math.max(s.bestScore, Math.floor(score)) })),
    }),
    {
      name: "snake_prefs_v1",
      version: 1,
      partialize: (s) => ({
        speedLevel: s.speedLevel,
        wrapMode: s.wrapMode,
        soundEnabled: s.soundEnabled,
        reduceMotion: s.reduceMotion,
        bestScore: s.bestScore,
      }),
    },
  ),
);
