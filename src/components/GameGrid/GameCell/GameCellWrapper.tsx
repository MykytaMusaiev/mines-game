import { memo, useRef } from 'react';
import { motion } from 'framer-motion';
import { GameCell } from './GameCell';
import type { CellState } from '../../../shared/types';

interface GameCellWrapperProps {
  row: number;
  col: number;
  cellState: CellState;
  isLoading: boolean;
  isEnded: boolean;
  hasFullBoard: boolean;
  onClick: (row: number, col: number) => void;
  onHover?: () => void;
}

const cellWrapperVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

export const GameCellWrapper = memo(function GameCellWrapper({
  row,
  col,
  cellState,
  isLoading,
  isEnded,
  hasFullBoard,
  onClick,
  onHover,
}: GameCellWrapperProps) {
  console.log(`render ${row}-${col}`);

  const prev = useRef({ cellState, isLoading, isEnded, hasFullBoard, onClick, onHover });

  if (row === 0 && col === 0) {
    const p = prev.current;
    console.log('0-0 changed props:', {
      cellState: p.cellState !== cellState ? `${p.cellState} → ${cellState}` : '—',
      isLoading: p.isLoading !== isLoading ? `${p.isLoading} → ${isLoading}` : '—',
      isEnded: p.isEnded !== isEnded ? `${p.isEnded} → ${isEnded}` : '—',
      hasFullBoard: p.hasFullBoard !== hasFullBoard ? `${p.hasFullBoard} → ${hasFullBoard}` : '—',
      onClick: p.onClick !== onClick ? 'CHANGED' : '—',
      onHover: p.onHover !== onHover ? 'CHANGED' : '—',
    });
    prev.current = { cellState, isLoading, isEnded, hasFullBoard, onClick, onHover };
  }
  return (
    <motion.div
      variants={isEnded && hasFullBoard ? cellWrapperVariants : undefined}
    >
      <GameCell
        row={row}
        col={col}
        state={cellState}
        isLoading={isLoading}
        isDisabled={false}
        onClick={onClick}
        onHover={onHover}
      />
    </motion.div>
  );
});