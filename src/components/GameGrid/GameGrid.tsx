import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GameCell } from './GameCell/GameCell';
import { GRID_SIZE } from '../../shared/constants/game';
import type { CellState, RevealedCell, FullBoard, GameStatus } from '../../shared/types';
import styles from './GameGrid.module.css';

interface GameGridProps {
  status: GameStatus | null;
  revealedCells: RevealedCell[];
  fullBoard: FullBoard | null;
  hitCell: { row: number; col: number } | null;
  loadingCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  onCellHover?: () => void;
  isRevealing: boolean;
}

function getCellState(
  row: number,
  col: number,
  status: GameStatus | null,
  revealedCells: RevealedCell[],
  fullBoard: FullBoard | null,
  hitCell: { row: number; col: number } | null
): CellState {
  if (!status) return 'inactive';

  if ((status === 'lost' || status === 'won') && fullBoard) {
    const cellType = fullBoard[row]?.[col];
    if (!cellType) return 'inactive';
    if (cellType === 'gem') return 'gem';
    if (hitCell && hitCell.row === row && hitCell.col === col) return 'mine-hit';
    return 'mine';
  }

  const revealed = revealedCells.find((c) => c.row === row && c.col === col);
  if (revealed) return revealed.type === 'gem' ? 'gem' : 'mine-hit';

  return 'hidden';
}

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03 },
  },
};

const cellWrapperVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

export function GameGrid({
  status,
  revealedCells,
  fullBoard,
  hitCell,
  loadingCell,
  isRevealing,
  onCellClick,
  onCellHover,
}: GameGridProps) {
  const cells = useMemo(() => {
    const result: { row: number; col: number }[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        result.push({ row, col });
      }
    }
    return result;
  }, []);

  const isEnded = status === 'lost' || status === 'won';

  return (
    <motion.div
      className={styles.grid}
      variants={gridVariants}
      animate={isEnded && fullBoard ? 'visible' : 'hidden'}
      initial="hidden"
    >
      {cells.map(({ row, col }) => {
        const cellState = getCellState(row, col, status, revealedCells, fullBoard, hitCell);
        const isLoading = !!loadingCell && loadingCell.row === row && loadingCell.col === col;

        return (
          <motion.div
            key={`${row}-${col}`}
            variants={isEnded && fullBoard ? cellWrapperVariants : undefined}
          >
            <GameCell
              row={row}
              col={col}
              state={cellState}
              isLoading={isLoading}
              onClick={onCellClick}
              onHover={onCellHover}
              isDisabled={isRevealing && !isLoading}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}