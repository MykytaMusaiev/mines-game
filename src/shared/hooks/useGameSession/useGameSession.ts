import { useReducer, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useActiveGame, ACTIVE_GAME_QUERY_KEY } from "../useActiveGame";
import { useRevealCell } from "../useRevealCell";
import { useCashOut } from "../useCashOut";
import { useCreateGame } from "../useCreateGame";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../useSound";
import { HISTORY_QUERY_KEY } from "../useHistory";
import { BALANCE_QUERY_KEY } from "../useBalance";
import { gameReducer, initGameState } from "./gameSessionReducer";
import type { GameSessionState } from "./gameSessionTypes";

export function useGameSession(): GameSessionState {
    const queryClient = useQueryClient();
    const { data: activeGame } = useActiveGame();
    const { play } = useSound();
    const { betAmount, minesCount } = useGameStore();

    const { mutate: revealCellMutate } = useRevealCell();
    const { mutate: cashOutMutate, isPending: isCashOutPending } = useCashOut();
    const { mutate: createGameMutate, isPending: isStarting } = useCreateGame();

    const [state, dispatch] = useReducer(
        gameReducer,
        activeGame,
        initGameState,
    );

    const handleGameStart = useCallback(() => {
        createGameMutate(
            { betAmount, minesCount },
            {
                onSuccess: () => {
                    play("start");
                    dispatch({ type: "GAME_STARTED" });
                },
            },
        );
    }, [betAmount, minesCount, createGameMutate, play]);

    const handleCellClick = useCallback(
        (row: number, col: number) => {
            dispatch({ type: "CELL_LOADING", payload: { row, col } });

            revealCellMutate(
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
        [betAmount, revealCellMutate, play, queryClient],
    );

    const handleCashOut = useCallback(() => {
        cashOutMutate(undefined, {
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
                queryClient.setQueryData(BALANCE_QUERY_KEY, {
                    balance: data.balance,
                });
                queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
            },
        });
    }, [cashOutMutate, play, queryClient]);

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
        isStarting,
        isCashOutPending,
        handleGameStart,
        handleCellClick,
        handleCashOut,
        handleGameReset,
        handleCellHover,
    };
}
