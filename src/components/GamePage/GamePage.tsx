import { useState } from 'react';
import { useActiveGame } from '../../shared/hooks/useActiveGame';
import { useRevealCell } from '../../shared/hooks/useRevealCell';
import { useCashOut } from '../../shared/hooks/useCashOut';
import { useGameStore } from '../../shared/store/gameStore';
import { ControlPanel } from '../ControlPanel/ControlPanel';
import { GameGrid } from '../GameGrid/GameGrid';
import type {
  RevealedCell,
  FullBoardCell,
  GameStatus,
} from '../../shared/types';
import styles from './GamePage.module.css';

export function GamePage() {
  const { data: activeGame, isLoading: isActiveGameLoading } = useActiveGame();
  const revealCell = useRevealCell();
  const cashOut = useCashOut();
  const { setGameId } = useGameStore();

  const [revealedCells, setRevealedCells] = useState<RevealedCell[]>([]);
  const [fullBoard, setFullBoard] = useState<FullBoardCell[] | null>(null);
  const [hitCell, setHitCell] = useState<{ row: number; col: number } | null>(null);
  const [loadingCell, setLoadingCell] = useState<{ row: number; col: number } | null>(null);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [nextMultiplier, setNextMultiplier] = useState<number>(1);
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  const restoredCells = !isGameStarted && activeGame ? activeGame.revealedCells : revealedCells;
  const restoredStatus = !isGameStarted && activeGame ? activeGame.status : gameStatus;
  const restoredMultiplier = !isGameStarted && activeGame ? activeGame.currentMultiplier : currentMultiplier;
  const restoredNextMultiplier = !isGameStarted && activeGame ? activeGame.nextMultiplier : nextMultiplier;

  const handleCellClick = (row: number, col: number) => {
    if (activeGame && !isGameStarted) {
      setGameId(activeGame.gameId);
    }

    setLoadingCell({ row, col });

    revealCell.mutate(
      { row, col },
      {
        onSuccess: (data) => {
          setLoadingCell(null);
          setIsGameStarted(true);
          setRevealedCells((prev) => [...prev, { row, col, type: data.type }]);
          setGameStatus(data.status);
          setCurrentMultiplier(data.currentMultiplier);
          setNextMultiplier(data.nextMultiplier);

          if (data.status === 'lost') {
            setHitCell({ row, col });
            setFullBoard(data.fullBoard);
          }
        },
        onError: () => {
          setLoadingCell(null);
        },
      }
    );
  };

  const handleCashOut = () => {
    cashOut.mutate(undefined, {
      onSuccess: (data) => {
        setGameId(null);
        setFullBoard(data.fullBoard);
        setGameStatus('won');
        setIsGameStarted(true);
      },
    });
  };

  const handleGameReset = () => {
    setIsGameStarted(false);
    setGameStatus(null);
    setRevealedCells([]);
    setFullBoard(null);
    setHitCell(null);
    setLoadingCell(null);
    setCurrentMultiplier(1);
    setNextMultiplier(1);
  };

  const handleGameStart = () => {
    setIsGameStarted(true);
    setGameStatus('active');
    setRevealedCells([]);
    setFullBoard(null);
    setHitCell(null);
    setCurrentMultiplier(1);
    setNextMultiplier(1);
  };

  if (isActiveGameLoading) {
    return (
      <div className={styles.loadingScreen}>
        <span className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ControlPanel
        gameStatus={restoredStatus}
        revealedCells={restoredCells}
        currentMultiplier={restoredMultiplier}
        nextMultiplier={restoredNextMultiplier}
        onGameReset={handleGameReset}
        onGameStart={handleGameStart}
        onCashOut={handleCashOut}
      />
      <main className={styles.main}>
        <GameGrid
          status={restoredStatus}
          revealedCells={restoredCells}
          fullBoard={fullBoard}
          hitCell={hitCell}
          loadingCell={loadingCell}
          onCellClick={handleCellClick}
        />
      </main>
    </div>
  );
}