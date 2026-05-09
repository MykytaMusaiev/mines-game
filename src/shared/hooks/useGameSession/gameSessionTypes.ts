import type {
    RevealedCell,
    FullBoard,
    GameStatus,
    ModalResult,
} from "../../types";

export interface GameState {
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

export type GameAction =
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
