import { useRef, useEffect, useCallback } from 'react';
import { Position, GAME_CONFIG } from '../types/game';

interface GameCanvasProps {
  snake: Position[];
  food: Position;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ snake, food }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const foodPulseRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { GRID_SIZE, CELL_SIZE } = GAME_CONFIG;
    const canvasSize = GRID_SIZE * CELL_SIZE;

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvasSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvasSize, i * CELL_SIZE);
      ctx.stroke();
    }

    const pulse = Math.sin(foodPulseRef.current * 0.1) * 0.3 + 0.7;
    const foodSize = CELL_SIZE * 0.8 * pulse;
    const foodX = food.x * CELL_SIZE + CELL_SIZE / 2;
    const foodY = food.y * CELL_SIZE + CELL_SIZE / 2;
    
    ctx.save();
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(foodX, foodY, foodSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    snake.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;
      const padding = 1;
      const segmentSize = CELL_SIZE - padding * 2;
      
      const isHead = index === 0;
      const brightness = 1 - (index / snake.length) * 0.4;
      
      ctx.save();
      
      if (isHead) {
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#00ff88';
      } else {
        ctx.shadowColor = `rgba(0, 255, 136, ${brightness * 0.5})`;
        ctx.shadowBlur = 10;
        const green = Math.floor(255 * brightness);
        ctx.fillStyle = `rgb(0, ${green}, ${Math.floor(136 * brightness)})`;
      }
      
      const radius = isHead ? 6 : 4;
      ctx.beginPath();
      ctx.roundRect(x + padding, y + padding, segmentSize, segmentSize, radius);
      ctx.fill();
      
      if (isHead) {
        ctx.fillStyle = '#0a0a0f';
        const eyeSize = 3;
        const eyeOffset = 5;
        ctx.beginPath();
        ctx.arc(x + CELL_SIZE / 2 - eyeOffset, y + CELL_SIZE / 2 - 2, eyeSize, 0, Math.PI * 2);
        ctx.arc(x + CELL_SIZE / 2 + eyeOffset, y + CELL_SIZE / 2 - 2, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    });

    foodPulseRef.current++;
  }, [snake, food]);

  useEffect(() => {
    const animate = () => {
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [draw]);

  const canvasSize = GAME_CONFIG.GRID_SIZE * GAME_CONFIG.CELL_SIZE;

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88] via-[#00ffcc] to-[#00ff88] rounded-lg opacity-50 blur-sm animate-pulse" />
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="relative rounded-lg border-2 border-[#00ff88]/30"
      />
    </div>
  );
};
