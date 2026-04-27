// ─── Cell ───────────────────────────────────────────────────────────────────

export type CellType = "gem" | "mine";

export type CellState = "inactive" | "hidden" | "gem" | "mine" | "mine-hit";

export interface RevealedCell {
    row: number;
    col: number;
    type: CellType;
}

// ─── Game ────────────────────────────────────────────────────────────────────

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

export interface FullBoardCell {
    row: number;
    col: number;
    type: CellType;
}

// ─── API Requests ────────────────────────────────────────────────────────────

export interface CreateGameRequest {
    betAmount: number;
    minesCount: number;
}

export interface RevealCellRequest {
    row: number;
    col: number;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface BalanceResponse {
    balance: number;
}

export interface CreateGameResponse {
    gameId: string;
    minesCount: number;
    betAmount: number;
    status: GameStatus;
}

export interface RevealCellResponse {
    status: GameStatus;
    type: CellType;
    currentMultiplier: number;
    nextMultiplier: number;
    gemsFound: number;
    fullBoard: FullBoardCell[] | null;
}

export interface CashOutResponse {
    status: "won";
    cashedOutMultiplier: number;
    winAmount: number;
    profit: number;
    fullBoard: FullBoardCell[];
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

// ─── API Error ───────────────────────────────────────────────────────────────

export interface ApiError {
    message: string;
    statusCode: number;
}
