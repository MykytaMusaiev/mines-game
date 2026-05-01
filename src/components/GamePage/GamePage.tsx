import { AnimatePresence } from 'framer-motion';
import { useGameSession } from '../../shared/hooks/useGameSession';
import { ControlPanel } from '../ControlPanel/ControlPanel';
import { GameGrid } from '../GameGrid/GameGrid';
import { GameResultModal } from '../GameResultModal/GameResultModal';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import { MuteButton } from '../MuteButton/MuteButton';
import { RecentGames } from '../RecentGames/RecentGames';
import styles from './GamePage.module.css';

export function GamePage() {
  const {
    revealedCells,
    fullBoard,
    hitCell,
    loadingCell,
    currentMultiplier,
    nextMultiplier,
    gameStatus,
    isRevealing,
    modalResult,
    isStarting,
    isCashOutPending,
    handleGameStart,
    handleCellClick,
    handleCashOut,
    handleGameReset,
    handleCellHover,
  } = useGameSession();

  return (
    <div className={styles.page}>
      <MuteButton />
      <div className={styles.inner}>
        <ControlPanel
          gameStatus={gameStatus}
          revealedCells={revealedCells}
          currentMultiplier={currentMultiplier}
          nextMultiplier={nextMultiplier}
          isStarting={isStarting}
          isCashOutPending={isCashOutPending}
          onGameStart={handleGameStart}
          onCashOut={handleCashOut}
        />
        <main className={styles.main}>
          <GameGrid
            status={gameStatus}
            revealedCells={revealedCells}
            fullBoard={fullBoard}
            hitCell={hitCell}
            loadingCell={loadingCell}
            onCellClick={handleCellClick}
            onCellHover={handleCellHover}
            isRevealing={isRevealing}
          />
        </main>
        <div className={styles.recentGames}>
          <RecentGames />
        </div>
      </div>

      <AnimatePresence>
        {isStarting && (
          <LoadingOverlay type="starting" key="starting-loader" />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalResult && (
          <GameResultModal
            type={modalResult.type}
            multiplier={modalResult.multiplier}
            winAmount={modalResult.winAmount}
            profit={modalResult.profit}
            lostAmount={modalResult.lostAmount}
            onClose={handleGameReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}