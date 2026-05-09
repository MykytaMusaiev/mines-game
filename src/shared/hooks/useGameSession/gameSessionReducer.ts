import type { ActiveGameResponse } from "../../types";
import { useGameStore } from "../../store/gameStore";
import type { GameState, GameAction } from "./gameSessionTypes";

export const DEFAULT_STATE: GameState = {
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

export function gameReducer(state: GameState, action: GameAction): GameState {
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

// Called once at mount. activeGame is guaranteed to be resolved at this point
// because GamePage renders only after useActiveGame settles (see App.tsx:
// {!isAppLoading && <GamePage />}). No useEffect needed.
export function initGameState(
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
