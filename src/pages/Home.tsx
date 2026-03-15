import { useState } from 'react';
import { GameCanvas } from '@/components/GameCanvas';
import { ScoreBoard } from '@/components/ScoreBoard';
import { ControlPanel } from '@/components/ControlPanel';
import { GameOverModal } from '@/components/GameOverModal';
import { useGame } from '@/hooks/useGame';
import { useKeyboard } from '@/hooks/useKeyboard';
import { Difficulty } from '@/types/game';
import { Gamepad2 } from 'lucide-react';

export default function Home() {
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const { gameState, changeDirection, startGame, pauseGame, restartGame } = useGame();

  useKeyboard(
    changeDirection,
    pauseGame,
    gameState.isStarted && !gameState.isGameOver
  );

  const isNewHighScore = gameState.score > 0 && gameState.score >= gameState.highScore;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00ff88]/5 via-transparent to-transparent" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8">
          <Gamepad2 className="w-10 h-10 text-[#00ff88]" />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00ffcc] font-['Orbitron'] tracking-wider">
            贪吃蛇
          </h1>
        </div>

        <ScoreBoard score={gameState.score} highScore={gameState.highScore} />

        <GameCanvas snake={gameState.snake} food={gameState.food} />

        <ControlPanel
          isStarted={gameState.isStarted}
          isPaused={gameState.isPaused}
          isGameOver={gameState.isGameOver}
          difficulty={difficulty}
          onStart={startGame}
          onPause={pauseGame}
          onRestart={restartGame}
          onDifficultyChange={setDifficulty}
        />

        <div className="mt-8 text-center">
          <p className="text-[#00ff88]/40 text-xs font-['Orbitron'] uppercase tracking-wider mb-2">
            操作说明
          </p>
          <p className="text-[#00ff88]/60 text-sm font-['Rajdhani']">
            方向键 / WASD 控制移动 · 空格键 暂停
          </p>
        </div>
      </div>

      {gameState.isGameOver && (
        <GameOverModal
          score={gameState.score}
          highScore={gameState.highScore}
          isNewHighScore={isNewHighScore}
          onRestart={restartGame}
          difficulty={difficulty}
        />
      )}
    </div>
  );
}
