import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../shared/store/gameStore';
import { useBalance } from '../../shared/hooks/useBalance';
import { BetControls } from './BetControls/BetControls';
import { MinesSelector } from './MinesSelector/MinesSelector';
import type { MinesCount, GameStatus, RevealedCell } from '../../shared/types';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  gameStatus: GameStatus | null;
  revealedCells: RevealedCell[];
  currentMultiplier: number;
  nextMultiplier: number;
  isStarting: boolean;
  isCashOutPending: boolean;
  onGameStart: () => void;
  onCashOut: () => void;
}

export function ControlPanel({
  gameStatus,
  revealedCells,
  currentMultiplier,
  nextMultiplier,
  isStarting,
  isCashOutPending,
  onGameStart,
  onCashOut,
}: ControlPanelProps) {
  const { betAmount, minesCount, setBetAmount, setMinesCount } = useGameStore();
  const { data: balanceData } = useBalance();

  const balance = balanceData?.balance ?? 0;
  const isActive = gameStatus === 'active';
  const isLoading = isStarting || isCashOutPending;

  const gemsFound = revealedCells.filter((c) => c.type === 'gem').length;
  const isCashOutDisabled = isLoading || gemsFound === 0;
  const totalGems = 25 - minesCount;
  const profit = isActive ? betAmount * currentMultiplier - betAmount : 0;
  const cashOutAmount = isActive ? betAmount * currentMultiplier : 0;

  return (
    <aside className={styles.panel}>
      <BetControls
        value={betAmount}
        balance={balance}
        onChange={setBetAmount}
        disabled={isActive || isLoading}
      />

      <MinesSelector
        value={minesCount}
        onChange={(val) => setMinesCount(val as MinesCount)}
        disabled={isActive || isLoading}
      />

      <AnimatePresence>
        {isActive && (
          <motion.div
            className={styles.gameInfo}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Current Multiplier</span>
              <span className={styles.infoValueGreen}>
                {currentMultiplier.toFixed(2)}x
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Profit</span>
              <span className={styles.infoValueGreen}>
                +${profit.toFixed(2)}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Gems Found</span>
              <span className={styles.infoValue}>
                {gemsFound} / {totalGems}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Next Multiplier</span>
              <span className={styles.infoValue}>
                {nextMultiplier.toFixed(2)}x
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`${styles.mainBtn} ${isActive ? styles.cashOutBtn : styles.startBtn}`}
        onClick={isActive ? onCashOut : onGameStart}
        disabled={isActive ? isCashOutDisabled : isLoading}
        type="button"
        animate={isActive && gemsFound > 0 ? { scale: [1, 1.02, 1] } : { scale: 1 }}
        transition={isActive && gemsFound > 0 ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
        whileHover={{ opacity: 0.9 }}
        whileTap={{ scale: 0.97 }}
      >
        {isLoading
          ? '...'
          : isActive
            ? `CASH OUT — $${cashOutAmount.toFixed(2)}`
            : 'START GAME'}
      </motion.button>

      <div className={styles.balance}>
        <span className={styles.balanceIcon}>💰</span>
        <motion.span
          className={styles.balanceValue}
          key={balance}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          ${balance.toFixed(2)}
        </motion.span>
      </div>
    </aside>
  );
}