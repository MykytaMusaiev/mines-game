import { motion } from 'framer-motion';
import type { CellState } from '../../../shared/types';
import styles from './GameCell.module.css';

interface GameCellProps {
  row: number;
  col: number;
  state: CellState;
  isLoading: boolean;
  onClick: (row: number, col: number) => void;
}

export function GameCell({ row, col, state, isLoading, onClick }: GameCellProps) {
  const isClickable = state === 'hidden' && !isLoading;

  const handleClick = () => {
    if (isClickable) onClick(row, col);
  };

  return (
    <motion.button
      type="button"
      className={`${styles.cell} ${styles[state]}`}
      onClick={handleClick}
      disabled={!isClickable}
      whileHover={isClickable ? { scale: 1.05 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      animate={state === 'mine-hit' ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.2 }}
    >
      {isLoading && state === 'hidden' ? (
        <span className={styles.spinner} />
      ) : (state === 'gem') ? (
        <motion.img
          src="/images/diamond.svg"
          alt="gem"
          className={styles.icon}
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      ) : (state === 'mine' || state === 'mine-hit') ? (
        <motion.img
          src="/images/bomb.svg"
          alt="mine"
          className={styles.icon}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      ) : null}
    </motion.button>
  );
}