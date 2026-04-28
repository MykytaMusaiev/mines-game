import { useGameStore } from '../../shared/store/gameStore';
import { useBalance } from '../../shared/hooks/useBalance';
import { useCreateGame } from '../../shared/hooks/useCreateGame';
import { useCashOut } from '../../shared/hooks/useCashOut';
import { BetControls } from './BetControls/BetControls';
import { MinesSelector } from './MinesSelector/MinesSelector';
import type { MinesCount, GameStatus, RevealedCell } from '../../shared/types';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  gameStatus: GameStatus | null;
  revealedCells: RevealedCell[];
  currentMultiplier: number;
  nextMultiplier: number;
  onGameReset: () => void;
  onGameStart: () => void;
  onCashOut: () => void;
}

export function ControlPanel({
  gameStatus,
  revealedCells,
  currentMultiplier,
  nextMultiplier,
  onGameReset,
  onGameStart,
  onCashOut,
}: ControlPanelProps) {
  const { betAmount, minesCount, setBetAmount, setMinesCount } = useGameStore();
  const { data: balanceData } = useBalance();
  const createGame = useCreateGame();
  const cashOut = useCashOut();

  const balance = balanceData?.balance ?? 0;
  const isActive = gameStatus === 'active';
  const isEnded = gameStatus === 'won' || gameStatus === 'lost';
  const isLoading = createGame.isPending || cashOut.isPending;

  const gemsFound = revealedCells.filter((c) => c.type === 'gem').length;
  const totalGems = 25 - minesCount;
  const profit = isActive ? betAmount * currentMultiplier - betAmount : 0;
  const cashOutAmount = isActive ? betAmount * currentMultiplier : 0;

  const handleStart = () => {
    createGame.mutate(
      { betAmount, minesCount },
      { onSuccess: () => onGameStart() }
    );
  };

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

      {isActive && (
        <div className={styles.gameInfo}>
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
        </div>
      )}

      <button
        className={`${styles.mainBtn} ${isActive ? styles.cashOutBtn : styles.startBtn}`}
        onClick={isActive ? onCashOut : isEnded ? onGameReset : handleStart}
        disabled={isLoading}
        type="button"
      >
        {isLoading
          ? '...'
          : isActive
            ? `CASH OUT — $${cashOutAmount.toFixed(2)}`
            : isEnded
              ? 'NEW GAME'
              : 'START GAME'}
      </button>

      <div className={styles.balance}>
        <span className={styles.balanceIcon}>💰</span>
        <span className={styles.balanceValue}>${balance.toFixed(2)}</span>
      </div>
    </aside>
  );
}