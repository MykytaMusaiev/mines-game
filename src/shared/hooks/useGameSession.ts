import { useReducer, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useActiveGame, ACTIVE_GAME_QUERY_KEY } from "./useActiveGame";
import { useRevealCell } from "./useRevealCell";
import { useCashOut } from "./useCashOut";
import { useCreateGame } from "./useCreateGame";
import { useGameStore } from "../store/gameStore";
import { useSound } from "./useSound";
import { HISTORY_QUERY_KEY } from "./useHistory";
import type {
    RevealedCell,
    FullBoard,
    GameStatus,
    ModalResult,
    ActiveGameResponse,
} from "../types";

// ─── State ────────────────────────────────────────────────────────────────────

interface GameState {
    revealedCells: RevealedCell[];
    fullBoard: FullBoard | null;
    hitCell: { row: number; col: number } | null;
    loadingCell: { row: number; col: number } | null;
    currentMultiplier: number;
    nextMultiplier: number;
    gameStatus: GameStatus | null;
    isRevealing: boolean;
    modalResult: ModalResult | null;
}

const DEFAULT_STATE: GameState = {
    revealedCells: [],
    fullBoard: null,
    hitCell: null,
    loadingCell: null,
    currentMultiplier: 1,
    nextMultiplier: 1,
    gameStatus: null,
    isRevealing: false,
    modalResult: null,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type GameAction =
    | { type: "GAME_STARTED" }
    | { type: "CELL_LOADING"; payload: { row: number; col: number } }
    | {
          type: "GEM_REVEALED";
          payload: {
              revealedCells: RevealedCell[];
              currentMultiplier: number;
              nextMultiplier: number;
              gameStatus: GameStatus;
          };
      }
    | {
          type: "MINE_HIT";
          payload: {
              row: number;
              col: number;
              fullBoard: FullBoard;
              lostAmount: number;
              gameStatus: GameStatus;
          };
      }
    | { type: "REVEAL_ERROR" }
    | {
          type: "CASHED_OUT";
          payload: {
              fullBoard: FullBoard;
              multiplier: number;
              winAmount: number;
              profit: number;
          };
      }
    | { type: "RESET" };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case "GAME_STARTED":
            return { ...DEFAULT_STATE, gameStatus: "active" };

        case "CELL_LOADING":
            return { ...state, isRevealing: true, loadingCell: action.payload };

        case "GEM_REVEALED":
            return {
                ...state,
                isRevealing: false,
                loadingCell: null,
                revealedCells: action.payload.revealedCells,
                currentMultiplier: action.payload.currentMultiplier,
                nextMultiplier: action.payload.nextMultiplier,
                gameStatus: action.payload.gameStatus,
            };

        case "MINE_HIT":
            return {
                ...state,
                isRevealing: false,
                loadingCell: null,
                gameStatus: action.payload.gameStatus,
                hitCell: { row: action.payload.row, col: action.payload.col },
                fullBoard: action.payload.fullBoard,
                modalResult: {
                    type: "lose",
                    lostAmount: action.payload.lostAmount,
                },
            };

        case "REVEAL_ERROR":
            return { ...state, isRevealing: false, loadingCell: null };

        case "CASHED_OUT":
            return {
                ...state,
                gameStatus: "won",
                fullBoard: action.payload.fullBoard,
                modalResult: {
                    type: "win",
                    multiplier: action.payload.multiplier,
                    winAmount: action.payload.winAmount,
                    profit: action.payload.profit,
                },
            };

        case "RESET":
            return DEFAULT_STATE;
    }
}

// ─── Lazy initializer ─────────────────────────────────────────────────────────

// Called once at mount. activeGame is guaranteed to be resolved at this point
// because GamePage renders only after useActiveGame settles (see App.tsx:
// {!isAppLoading && <GamePage />}). No useEffect needed.
function initGameState(
    activeGame: ActiveGameResponse | null | undefined,
): GameState {
    if (!activeGame) return DEFAULT_STATE;

    useGameStore.getState().setGameId(activeGame.gameId);

    return {
        ...DEFAULT_STATE,
        revealedCells: activeGame.revealedCells,
        gameStatus: activeGame.status,
        currentMultiplier: activeGame.currentMultiplier,
        nextMultiplier: activeGame.nextMultiplier,
    };
}

// ─── Public interface ─────────────────────────────────────────────────────────

export interface GameSessionState {
    revealedCells: RevealedCell[];
    fullBoard: FullBoard | null;
    hitCell: { row: number; col: number } | null;
    loadingCell: { row: number; col: number } | null;
    currentMultiplier: number;
    nextMultiplier: number;
    gameStatus: GameStatus | null;
    isRevealing: boolean;
    modalResult: ModalResult | null;
    isStarting: boolean;
    isCashOutPending: boolean;
    handleGameStart: () => void;
    handleCellClick: (row: number, col: number) => void;
    handleCashOut: () => void;
    handleGameReset: () => void;
    handleCellHover: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGameSession(): GameSessionState {
    const queryClient = useQueryClient();
    const { data: activeGame } = useActiveGame();
    const revealCell = useRevealCell();
    const cashOut = useCashOut();
    const createGame = useCreateGame();
    const { play } = useSound();
    const { betAmount, minesCount } = useGameStore();

    // UI state — local, not persisted, not needed outside this hook's tree.
    // Initialized once from activeGame via lazy initializer (no useEffect needed).
    // Server state (revealedCells, multipliers, status) lives here after restore
    // because React Query cache is the source of truth only until the game starts —
    // after that mutations update local state directly for instant UI feedback.
    const [state, dispatch] = useReducer(
        gameReducer,
        activeGame,
        initGameState,
    );

    const handleGameStart = useCallback(() => {
        createGame.mutate(
            { betAmount, minesCount },
            {
                onSuccess: () => {
                    play("start");
                    dispatch({ type: "GAME_STARTED" });
                },
            },
        );
    }, [betAmount, minesCount, createGame, play]);

    const handleCellClick = useCallback(
        (row: number, col: number) => {
            if (state.isRevealing) return;

            dispatch({ type: "CELL_LOADING", payload: { row, col } });

            revealCell.mutate(
                { row, col },
                {
                    onSuccess: (data) => {
                        if (data.result === "gem" && data.revealedCells) {
                            play("gem");
                            dispatch({
                                type: "GEM_REVEALED",
                                payload: {
                                    revealedCells: data.revealedCells,
                                    currentMultiplier:
                                        data.currentMultiplier ?? 1,
                                    nextMultiplier: data.nextMultiplier ?? 1,
                                    gameStatus: data.status,
                                },
                            });
                        }

                        if (data.result === "mine" && data.fullBoard) {
                            play("mine");
                            dispatch({
                                type: "MINE_HIT",
                                payload: {
                                    row,
                                    col,
                                    fullBoard: data.fullBoard,
                                    lostAmount: betAmount,
                                    gameStatus: data.status,
                                },
                            });
                            queryClient.invalidateQueries({
                                queryKey: HISTORY_QUERY_KEY,
                            });
                        }
                    },
                    onError: () => {
                        dispatch({ type: "REVEAL_ERROR" });
                    },
                },
            );
        },
        [state.isRevealing, betAmount, revealCell, play, queryClient],
    );

    const handleCashOut = useCallback(() => {
        cashOut.mutate(undefined, {
            onSuccess: (data) => {
                play("cashout");
                useGameStore.getState().setGameId(null);
                dispatch({
                    type: "CASHED_OUT",
                    payload: {
                        fullBoard: data.fullBoard,
                        multiplier: data.cashedOutMultiplier,
                        winAmount: data.winAmount,
                        profit: data.profit,
                    },
                });
                queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
            },
        });
    }, [cashOut, play, queryClient]);

    const handleGameReset = useCallback(() => {
        useGameStore.getState().setGameId(null);
        queryClient.setQueryData(ACTIVE_GAME_QUERY_KEY, null);
        dispatch({ type: "RESET" });
    }, [queryClient]);

    const handleCellHover = useCallback(() => {
        play("hover");
    }, [play]);

    return {
        ...state,
        isStarting: createGame.isPending,
        isCashOutPending: cashOut.isPending,
        handleGameStart,
        handleCellClick,
        handleCashOut,
        handleGameReset,
        handleCellHover,
    };
}
