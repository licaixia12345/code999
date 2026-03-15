import { Trophy, RotateCcw } from 'lucide-react';
import { Difficulty } from '../types/game';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: (difficulty: Difficulty) => void;
  difficulty: Difficulty;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHighScore,
  onRestart,
  difficulty,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#ff6b6b] via-[#ffd700] to-[#ff6b6b] rounded-2xl opacity-50 blur-lg animate-pulse" />
        <div className="relative bg-[#0a0a0f] p-8 rounded-2xl border border-[#ff6b6b]/30 min-w-[320px]">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#ff6b6b] font-['Orbitron'] mb-2">游戏结束</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#ff6b6b] to-transparent mx-auto" />
          </div>

          {isNewHighScore && (
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffd700]/10 rounded-full border border-[#ffd700]/30">
                <Trophy className="w-5 h-5 text-[#ffd700]" />
                <span className="text-[#ffd700] font-['Orbitron'] text-sm uppercase tracking-wider">新纪录!</span>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-[#00ff88]/60 text-xs uppercase tracking-wider font-['Orbitron'] mb-1">最终分数</p>
              <p className="text-4xl font-bold text-[#00ff88] font-['Orbitron'] tabular-nums">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-[#ffd700]/60 text-xs uppercase tracking-wider font-['Orbitron'] mb-1">最高分数</p>
              <p className="text-4xl font-bold text-[#ffd700] font-['Orbitron'] tabular-nums">{highScore}</p>
            </div>
          </div>

          <button
            onClick={() => onRestart(difficulty)}
            className="w-full relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff88] to-[#00ffcc] rounded-lg opacity-50 blur group-hover:opacity-75 transition duration-300" />
            <div className="relative bg-[#0a0a0f] px-6 py-4 rounded-lg border border-[#00ff88]/30 flex items-center justify-center gap-2 group-hover:border-[#00ff88]/60 transition duration-300">
              <RotateCcw className="w-5 h-5 text-[#00ff88]" />
              <span className="text-[#00ff88] font-['Orbitron'] text-sm uppercase tracking-wider">再来一局</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
