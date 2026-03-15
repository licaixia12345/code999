import { useEffect, useCallback } from 'react';
import { Direction } from '../types/game';

export const useKeyboard = (
  onDirectionChange: (direction: Direction) => void,
  onPause: () => void,
  isGameActive: boolean
) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isGameActive) return;

      const keyMap: Record<string, { direction?: Direction; action?: 'pause' }> = {
        ArrowUp: { direction: 'UP' },
        ArrowDown: { direction: 'DOWN' },
        ArrowLeft: { direction: 'LEFT' },
        ArrowRight: { direction: 'RIGHT' },
        KeyW: { direction: 'UP' },
        KeyS: { direction: 'DOWN' },
        KeyA: { direction: 'LEFT' },
        KeyD: { direction: 'RIGHT' },
        Space: { action: 'pause' },
        Escape: { action: 'pause' },
      };

      const mapping = keyMap[event.code];
      if (!mapping) return;

      event.preventDefault();

      if (mapping.action === 'pause') {
        onPause();
      } else if (mapping.direction) {
        onDirectionChange(mapping.direction);
      }
    },
    [onDirectionChange, onPause, isGameActive]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
