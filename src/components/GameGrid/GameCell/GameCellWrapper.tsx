import { memo } from 'react';
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