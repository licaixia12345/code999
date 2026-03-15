import { Play, Pause, RotateCcw } from 'lucide-react';
import { Difficulty } from '../types/game';

interface ControlPanelProps {
  isStarted: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  difficulty: Difficulty;
  onStart: (difficulty: Difficulty) => void;
  onPause: () => void;
  onRestart: (difficulty: Difficulty) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isStarted,
  isPaused,
  isGameOver,
  difficulty,
  onStart,
  onPause,
  onRestart,
  onDifficultyChange,
}) => {
  const handleStartOrPause = () => {
    if (!isStarted || isGameOver) {
      onStart(difficulty);
    } else {
      onPause();
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleStartOrPause}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff88] to-[#00ffcc] rounded-lg opacity-50 blur group-hover:opacity-75 transition duration-300" />
          <div className="relative bg-[#0a0a0f] px-6 py-3 rounded-lg border border-[#00ff88]/30 flex items-center gap-2 group-hover:border-[#00ff88]/60 transition duration-300">
            {!isStarted || isGameOver ? (
              <>
                <Play className="w-5 h-5 text-[#00ff88]" />
                <span className="text-[#00ff88] font-['Orbitron'] text-sm uppercase tracking-wider">开始游戏</span>
              </>
            ) : (
              <>
                <Pause className="w-5 h-5 text-[#00ff88]" />
                <span className="text-[#00ff88] font-['Orbitron'] text-sm uppercase tracking-wider">
                  {isPaused ? '继续' : '暂停'}
                </span>
              </>
            )}
          </div>
        </button>

        <button
          onClick={() => onRestart(difficulty)}
          disabled={!isStarted}
          className="relative group disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e8e] rounded-lg opacity-50 blur group-hover:opacity-75 transition duration-300" />
          <div className="relative bg-[#0a0a0f] px-6 py-3 rounded-lg border border-[#ff6b6b]/30 flex items-center gap-2 group-hover:border-[#ff6b6b]/60 transition duration-300">
            <RotateCcw className="w-5 h-5 text-[#ff6b6b]" />
            <span className="text-[#ff6b6b] font-['Orbitron'] text-sm uppercase tracking-wider">重新开始</span>
          </div>
        </button>
      </div>

      <div className="flex justify-center">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] rounded-lg opacity-50 blur group-hover:opacity-75 transition duration-300" />
          <div className="relative bg-[#0a0a0f] px-4 py-2 rounded-lg border border-[#8b5cf6]/30">
            <label className="flex items-center gap-3">
              <span className="text-[#8b5cf6] font-['Orbitron'] text-xs uppercase tracking-wider">难度</span>
              <select
                value={difficulty}
                onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                className="bg-transparent text-[#a78bfa] font-['Orbitron'] text-sm outline-none cursor-pointer"
              >
                <option value="easy" className="bg-[#0a0a0f]">简单</option>
                <option value="normal" className="bg-[#0a0a0f]">普通</option>
                <option value="hard" className="bg-[#0a0a0f]">困难</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
