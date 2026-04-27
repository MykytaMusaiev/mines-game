import { useMemo } from 'react';
import { GameCell } from './GameCell/GameCell';
import { GRID_SIZE } from '../../shared/constants/game';
import type { CellState, RevealedCell, FullBoardCell, GameStatus } from '../../shared/types';
import styles from './GameGrid.module.css';

interface GameGridProps {
  status: GameStatus | null;
  revealedCells: RevealedCell[];
  fullBoard: FullBoardCell[] | null;
  hitCell: { row: number; col: number } | null;
  loadingCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
}

function getCellState(
  row: number,
  col: number,
  status: GameStatus | null,
  revealedCells: RevealedCell[],
  fullBoard: FullBoardCell[] | null,
  hitCell: { row: number; col: number } | null
): CellState {
  // Гра не почата
  if (!status) return 'inactive';

  // Гра завершена — показуємо fullBoard
  if ((status === 'lost' || status === 'won') && fullBoard) {
    const boardCell = fullBoard.find((c) => c.row === row && c.col === col);
    if (!boardCell) return 'inactive';

    if (boardCell.type === 'gem') return 'gem';

    // Міна — перевіряємо чи це та що вбила
    if (hitCell && hitCell.row === row && hitCell.col === col) return 'mine-hit';
    return 'mine';
  }

  // Активна гра — шукаємо в revealedCells
  const revealed = revealedCells.find((c) => c.row === row && c.col === col);
  if (revealed) return revealed.type === 'gem' ? 'gem' : 'mine-hit';

  return 'hidden';
}

export function GameGrid({
  status,
  revealedCells,
  fullBoard,
  hitCell,
  loadingCell,
  onCellClick,
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

  return (
    <div className={styles.grid}>
      {cells.map(({ row, col }) => {
        const cellState = getCellState(row, col, status, revealedCells, fullBoard, hitCell);
        const isLoading =
          !!loadingCell && loadingCell.row === row && loadingCell.col === col;

        return (
          <GameCell
            key={`${row}-${col}`}
            row={row}
            col={col}
            state={cellState}
            isLoading={isLoading}
            onClick={onCellClick}
          />
        );
      })}
    </div>
  );
}