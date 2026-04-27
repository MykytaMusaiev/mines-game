import { useGameStore } from '../../shared/store/gameStore';
import { useBalance } from '../../shared/hooks/useBalance';
import { useActiveGame } from '../../shared/hooks/useActiveGame';
import { useCreateGame } from '../../shared/hooks/useCreateGame';
import { useCashOut } from '../../shared/hooks/useCashOut';
import type { MinesCount } from '../../shared/types';
import styles from './ControlPanel.module.css';
import { BetControls } from '../BetControls/BetControls';
import { MinesSelector } from '../MinesSelector/MinesSelector';

export function ControlPanel() {
  const { betAmount, minesCount, setBetAmount, setMinesCount } = useGameStore();
  const { data: balanceData } = useBalance();
  const { data: activeGame } = useActiveGame();
  const createGame = useCreateGame();
  const cashOut = useCashOut();

  const balance = balanceData?.balance ?? 0;
  const isActive = !!activeGame;
  const isLoading = createGame.isPending || cashOut.isPending;

  const handleStart = () => {
    createGame.mutate({ betAmount, minesCount });
  };

  const handleCashOut = () => {
    cashOut.mutate();
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
              {activeGame.currentMultiplier.toFixed(2)}x
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Profit</span>
            <span className={styles.infoValueGreen}>
              +${(activeGame.currentMultiplier * betAmount - betAmount).toFixed(2)}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Gems Found</span>
            <span className={styles.infoValue}>
              {activeGame.gemsFound} / {25 - activeGame.minesCount}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Next Multiplier</span>
            <span className={styles.infoValue}>
              {activeGame.nextMultiplier.toFixed(2)}x
            </span>
          </div>
        </div>
      )}

      <button
        className={`${styles.mainBtn} ${isActive ? styles.cashOutBtn : styles.startBtn}`}
        onClick={isActive ? handleCashOut : handleStart}
        disabled={isLoading}
        type="button"
      >
        {isLoading
          ? '...'
          : isActive
            ? `CASH OUT — $${(activeGame.currentMultiplier * betAmount).toFixed(2)}`
            : 'START GAME'}
      </button>

      <div className={styles.balance}>
        <span className={styles.balanceIcon}>💰</span>
        <span className={styles.balanceValue}>${balance.toFixed(2)}</span>
      </div>
    </aside>
  );
}