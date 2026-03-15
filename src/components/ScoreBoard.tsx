import { Trophy, Target } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore }) => {
  return (
    <div className="flex gap-6 mb-6">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff88] to-[#00ffcc] rounded-lg opacity-50 blur group-hover:opacity-75 transition duration-300" />
        <div className="relative bg-[#0a0a0f] px-6 py-4 rounded-lg border border-[#00ff88]/30">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-[#00ff88]" />
            <div>
              <p className="text-[#00ff88]/60 text-xs uppercase tracking-wider font-['Orbitron']">当前分数</p>
              <p className="text-2xl font-bold text-[#00ff88] font-['Orbitron'] tabular-nums">{score}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ffd700] to-[#ffaa00] rounded-lg opacity-50 blur group-hover:opacity-75 transition duration-300" />
        <div className="relative bg-[#0a0a0f] px-6 py-4 rounded-lg border border-[#ffd700]/30">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-[#ffd700]" />
            <div>
              <p className="text-[#ffd700]/60 text-xs uppercase tracking-wider font-['Orbitron']">最高分数</p>
              <p className="text-2xl font-bold text-[#ffd700] font-['Orbitron'] tabular-nums">{highScore}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
