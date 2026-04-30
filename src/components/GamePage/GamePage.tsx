import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useActiveGame, ACTIVE_GAME_QUERY_KEY } from '../../shared/hooks/useActiveGame';
import { useRevealCell } from '../../shared/hooks/useRevealCell';
import { useCashOut } from '../../shared/hooks/useCashOut';
import { useCreateGame } from '../../shared/hooks/useCreateGame';
import { useGameStore } from '../../shared/store/gameStore';
import { useSound } from '../../shared/hooks/useSound';
import { HISTORY_QUERY_KEY } from '../../shared/hooks/useHistory';
import { ControlPanel } from '../ControlPanel/ControlPanel';
import { GameGrid } from '../GameGrid/GameGrid';
import { GameResultModal } from '../GameResultModal/GameResultModal';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import { MuteButton } from '../MuteButton/MuteButton';
import { RecentGames } from '../RecentGames/RecentGames';
import type { RevealedCell, FullBoard, GameStatus, ModalResult } from '../../shared/types';
import styles from './GamePage.module.css';



export function GamePage() {
  const queryClient = useQueryClient();
  const { data: activeGame } = useActiveGame();
  const revealCell = useRevealCell();
  const cashOut = useCashOut();
  const createGame = useCreateGame();
  const { play } = useSound();

  const [revealedCells, setRevealedCells] = useState<RevealedCell[]>([]);
  const [fullBoard, setFullBoard] = useState<FullBoard | null>(null);
  const [hitCell, setHitCell] = useState<{ row: number; col: number } | null>(null);
  const [loadingCell, setLoadingCell] = useState<{ row: number; col: number } | null>(null);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [nextMultiplier, setNextMultiplier] = useState<number>(1);
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [modalResult, setModalResult] = useState<ModalResult | null>(null);

  const restoredCells = !isGameStarted && activeGame ? activeGame.revealedCells : revealedCells;
  const restoredStatus = !isGameStarted && activeGame ? activeGame.status : gameStatus;
  const restoredMultiplier = !isGameStarted && activeGame ? activeGame.currentMultiplier : currentMultiplier;
  const restoredNextMultiplier = !isGameStarted && activeGame ? activeGame.nextMultiplier : nextMultiplier;

  const { betAmount, minesCount } = useGameStore();

  const handleGameStart = () => {
    createGame.mutate(
      { betAmount, minesCount },
      {
        onSuccess: () => {
          play('start');
          setIsGameStarted(true);
          setGameStatus('active');
          setRevealedCells([]);
          setFullBoard(null);
          setHitCell(null);
          setCurrentMultiplier(1);
          setNextMultiplier(1);
        },
      }
    );
  };

  const handleCellClick = (row: number, col: number) => {
    if (isRevealing) return;
    if (activeGame && !isGameStarted) {
      useGameStore.getState().setGameId(activeGame.gameId);
    }
    setIsGameStarted(true);
    setIsRevealing(true);
    setLoadingCell({ row, col });
    revealCell.mutate({ row, col }, {
      onSuccess: (data) => {
        setIsRevealing(false);
        setLoadingCell(null);
        setGameStatus(data.status);
        if (data.result === 'gem' && data.revealedCells) {
          play('gem');
          setRevealedCells(data.revealedCells);
          setCurrentMultiplier(data.currentMultiplier ?? 1);
          setNextMultiplier(data.nextMultiplier ?? 1);
        }
        if (data.result === 'mine') {
          play('mine');
          setHitCell({ row, col });
          setFullBoard(data.fullBoard ?? null);
          setModalResult({ type: 'lose', lostAmount: betAmount });
          queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
        }
      },
      onError: () => {
        setIsRevealing(false);
        setLoadingCell(null);
        setIsGameStarted(false);
      },
    });
  };

  const handleCashOut = () => {
    cashOut.mutate(undefined, {
      onSuccess: (data) => {
        play('cashout');
        useGameStore.getState().setGameId(null);
        setFullBoard(data.fullBoard);
        setGameStatus('won');
        setIsGameStarted(true);
        setModalResult({
          type: 'win',
          multiplier: data.cashedOutMultiplier,
          winAmount: data.winAmount,
          profit: data.profit,
        });
        queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
      },
    });
  };

  const handleGameReset = () => {
    useGameStore.getState().setGameId(null);
    setIsGameStarted(false);
    setIsRevealing(false);
    setGameStatus(null);
    setRevealedCells([]);
    setFullBoard(null);
    setHitCell(null);
    setLoadingCell(null);
    setCurrentMultiplier(1);
    setNextMultiplier(1);
    setModalResult(null);
    queryClient.setQueryData(ACTIVE_GAME_QUERY_KEY, null);
  };

  const handleCellHover = () => {
    play('hover');
  };

  return (
    <div className={styles.page}>
      <MuteButton />
      <ControlPanel
        gameStatus={restoredStatus}
        revealedCells={restoredCells}
        currentMultiplier={restoredMultiplier}
        nextMultiplier={restoredNextMultiplier}
        isStarting={createGame.isPending}
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
          onCellHover={handleCellHover}
          isRevealing={isRevealing}
        />
      </main>
      <div className={styles.recentGames}>
        <RecentGames />
      </div>

      <AnimatePresence>
        {createGame.isPending && (
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