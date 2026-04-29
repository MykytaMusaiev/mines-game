import { motion, type Variants } from 'framer-motion';
import styles from './GameResultModal.module.css';
import type { GameResultModalProps } from '../../shared/types';



const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const winVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.85, y: 20, transition: { duration: 0.18 } },
};

const loseVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, x: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    x: [0, -10, 10, -8, 8, -4, 4, 0],
    transition: { type: 'spring', stiffness: 280, damping: 20, x: { duration: 0.5, delay: 0.15 } },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.18 } },
};

export function GameResultModal({
  type,
  multiplier,
  winAmount,
  profit,
  lostAmount,
  onClose,
}: GameResultModalProps) {
  const isWin = type === 'win';
  const cardVariants = isWin ? winVariants : loseVariants;

  return (
    <motion.div
      className={styles.overlay}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className={`${styles.card} ${isWin ? styles.cardWin : styles.cardLose}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className={styles.icon}>{isWin ? '💎' : '💣'}</div>

        <h2 className={`${styles.title} ${isWin ? styles.titleWin : styles.titleLose}`}>
          {isWin ? 'Cashed Out!' : 'Busted!'}
        </h2>

        {isWin && multiplier !== undefined && (
          <div className={styles.multiplier}>{multiplier.toFixed(2)}×</div>
        )}

        {isWin && winAmount !== undefined && (
          <div className={styles.amount}>${winAmount.toFixed(2)}</div>
        )}

        {isWin && profit !== undefined && (
          <div className={styles.profit}>+${profit.toFixed(2)} profit</div>
        )}

        {!isWin && lostAmount !== undefined && (
          <div className={styles.lost}>
            <span className={styles.lostAmount}>${lostAmount.toFixed(2)}</span>
            {' '}lost
          </div>
        )}

        <motion.button
          className={`${styles.btn} ${isWin ? styles.btnWin : styles.btnLose}`}
          onClick={onClose}
          whileHover={{ opacity: 0.88 }}
          whileTap={{ scale: 0.96 }}
          type="button"
        >
          {isWin ? 'PLAY AGAIN' : 'TRY AGAIN'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}