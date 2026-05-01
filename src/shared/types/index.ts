export type CellType = "gem" | "mine";

export type CellState = "inactive" | "hidden" | "gem" | "mine" | "mine-hit";

export interface RevealedCell {
    row: number;
    col: number;
    type: CellType;
}

export type GameStatus = "active" | "won" | "lost";

export type MinesCount = 1 | 3 | 5 | 10 | 24;

export interface Game {
    gameId: string;
    minesCount: number;
    betAmount: number;
    currentMultiplier: number;
    status: GameStatus;
    revealedCells: RevealedCell[];
    gemsFound: number;
    nextMultiplier: number;
}

export type FullBoard = CellType[][];

export interface CreateGameRequest {
    betAmount: number;
    minesCount: number;
}

export interface RevealCellRequest {
    row: number;
    col: number;
}

export interface BalanceResponse {
    balance: number;
}

export interface CreateGameResponse {
    gameId: string;
    minesCount: number;
    betAmount: number;
    status: GameStatus;
}

export interface GameCellProps {
    row: number;
    col: number;
    state: CellState;
    isLoading: boolean;
    onClick: (row: number, col: number) => void;
    isDisabled: boolean;
    onHover?: () => void;
}

export interface RevealCellResponse {
    result: CellType;
    status: GameStatus;
    revealedCells?: RevealedCell[];
    currentMultiplier?: number;
    nextMultiplier?: number;
    gemsFound?: number;
    revealedCell?: RevealedCell;
    fullBoard?: FullBoard;
    balance?: number;
}

export interface CashOutResponse {
    status: "won";
    cashedOutMultiplier: number;
    winAmount: number;
    profit: number;
    fullBoard: FullBoard;
    balance: number;
}

export interface HistoryGame {
    gameId: string;
    betAmount: number;
    minesCount: number;
    status: GameStatus;
    multiplier: number;
    profit: number;
    gemsFound: number;
    createdAt: string;
}

export interface HistoryResponse {
    games: HistoryGame[];
}

export type ActiveGameResponse = Game;

export interface ApiError {
    message: string;
    statusCode: number;
}

export interface GameResultModalProps {
    type: "win" | "lose";
    multiplier?: number;
    winAmount?: number;
    profit?: number;
    lostAmount?: number;
    onClose: () => void;
}

export interface ModalResult {
    type: "win" | "lose";
    multiplier?: number;
    winAmount?: number;
    profit?: number;
    lostAmount?: number;
}

export interface HistoryGame {
    gameId: string;
    betAmount: number;
    minesCount: number;
    status: GameStatus;
    multiplier: number;
    profit: number;
    gemsFound: number;
    createdAt: string;
}

export interface HistoryResponse {
    games: HistoryGame[];
}

export interface ControlPanelProps {
    gameStatus: GameStatus | null;
    revealedCells: RevealedCell[];
    currentMultiplier: number;
    nextMultiplier: number;
    isStarting: boolean;
    isCashOutPending: boolean;
    onGameStart: () => void;
    onCashOut: () => void;
}
