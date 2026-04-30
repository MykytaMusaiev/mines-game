import { motion, type Variants } from 'framer-motion';
import styles from './GameCell.module.css';
import { CELL_ICONS } from '../../../shared/constants/game';
import type { GameCellProps } from '../../../shared/types';

const shakeVariants: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -8, 8, -6, 6, -4, 4, 0],
    transition: {
      duration: 0.4,
      type: 'keyframes',
      ease: 'easeInOut',
    },
  },
};

const iconVariants: Variants = {
  hidden: { scale: 0, rotate: -20, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 18 },
  },
};

export function GameCell({ row, col, state, isLoading, isDisabled, onClick, onHover }: GameCellProps) {
  const isClickable = state === 'hidden' && !isLoading && !isDisabled;

  const icon = CELL_ICONS[state as keyof typeof CELL_ICONS];

  return (
    <motion.button
      type="button"
      className={`${styles.cell} ${styles[state]}`}
      onClick={() => isClickable && onClick(row, col)}
      onMouseEnter={() => isClickable && onHover?.()}
      disabled={!isClickable}
      variants={shakeVariants}
      animate={state === 'mine-hit' ? 'shake' : 'idle'}
      whileHover={isClickable ? { scale: 1.06, transition: { duration: 0.1 } } : {}}
      whileTap={isClickable ? { scale: 0.94 } : {}}
    >
      {isLoading ? (
        <span className={styles.spinner} />
      ) : (state === 'gem' || state === 'mine' || state === 'mine-hit') ? (
        <motion.img
          src={icon.src}
          alt={icon.alt}
          className={styles.icon}
          variants={iconVariants}
          initial="hidden"
          animate="visible"
        />
      ) : null}
    </motion.button>
  );
}