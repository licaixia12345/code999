import { useState, useCallback, useRef, useEffect } from 'react';
import { Direction, Position, GameState, Difficulty, GAME_CONFIG, DIFFICULTY_SPEED } from '../types/game';

const getRandomPosition = (snake: Position[], gridSize: number): Position => {
  let position: Position;
  do {
    position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
  return position;
};

const getInitialSnake = (): Position[] => [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

const getInitialFood = (): Position => ({ x: 15, y: 10 });

const getHighScore = (): number => {
  const stored = localStorage.getItem('snakeHighScore');
  return stored ? parseInt(stored, 10) : 0;
};

const saveHighScore = (score: number): void => {
  localStorage.setItem('snakeHighScore', score.toString());
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: getInitialSnake(),
    food: getInitialFood(),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    highScore: getHighScore(),
    isGameOver: false,
    isPaused: false,
    isStarted: false,
    speed: GAME_CONFIG.INITIAL_SPEED,
  });

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const moveSnake = useCallback((snake: Position[], direction: Direction): Position[] => {
    const head = { ...snake[0] };
    
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }
    
    return [head, ...snake.slice(0, -1)];
  }, []);

  const checkCollision = useCallback((head: Position, snake: Position[], gridSize: number): boolean => {
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return true;
    }
    
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    
    return false;
  }, []);

  const updateGame = useCallback(() => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver || !prev.isStarted) {
        return prev;
      }

      const newDirection = prev.nextDirection;
      const newSnake = moveSnake([...prev.snake], newDirection);
      const head = newSnake[0];

      if (checkCollision(head, newSnake, GAME_CONFIG.GRID_SIZE)) {
        const newHighScore = Math.max(prev.score, prev.highScore);
        if (newHighScore > prev.highScore) {
          saveHighScore(newHighScore);
        }
        return {
          ...prev,
          isGameOver: true,
          highScore: newHighScore,
        };
      }

      const ateFood = head.x === prev.food.x && head.y === prev.food.y;
      
      if (ateFood) {
        const grownSnake = [...newSnake, prev.snake[prev.snake.length - 1]];
        const newFood = getRandomPosition(grownSnake, GAME_CONFIG.GRID_SIZE);
        const newScore = prev.score + 1;
        const newSpeed = Math.max(
          GAME_CONFIG.MIN_SPEED,
          prev.speed - GAME_CONFIG.SPEED_INCREMENT
        );

        return {
          ...prev,
          snake: grownSnake,
          food: newFood,
          direction: newDirection,
          score: newScore,
          speed: newSpeed,
        };
      }

      return {
        ...prev,
        snake: newSnake,
        direction: newDirection,
      };
    });
  }, [moveSnake, checkCollision]);

  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver) return prev;

      const opposites: Record<Direction, Direction> = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT',
      };

      if (opposites[newDirection] === prev.direction) {
        return prev;
      }

      return { ...prev, nextDirection: newDirection };
    });
  }, []);

  const startGame = useCallback((difficulty: Difficulty = 'normal') => {
    const initialSpeed = DIFFICULTY_SPEED[difficulty];
    setGameState(prev => ({
      snake: getInitialSnake(),
      food: getInitialFood(),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      highScore: prev.highScore,
      isGameOver: false,
      isPaused: false,
      isStarted: true,
      speed: initialSpeed,
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const restartGame = useCallback((difficulty: Difficulty = 'normal') => {
    startGame(difficulty);
  }, [startGame]);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (timestamp - lastUpdateRef.current >= gameState.speed) {
        updateGame();
        lastUpdateRef.current = timestamp;
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (gameState.isStarted && !gameState.isPaused && !gameState.isGameOver) {
      lastUpdateRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isStarted, gameState.isPaused, gameState.isGameOver, gameState.speed, updateGame]);

  return {
    gameState,
    changeDirection,
    startGame,
    pauseGame,
    restartGame,
  };
};
