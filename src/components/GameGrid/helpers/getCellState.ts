import type {
    CellState,
    RevealedCell,
    FullBoard,
    GameStatus,
} from "../../../shared/types";

export function getCellState(
    row: number,
    col: number,
    status: GameStatus | null,
    revealedCells: RevealedCell[],
    fullBoard: FullBoard | null,
    hitCell: { row: number; col: number } | null,
): CellState {
    if (!status) return "inactive";

    if ((status === "lost" || status === "won") && fullBoard) {
        const cellType = fullBoard[row]?.[col];
        if (!cellType) return "inactive";
        if (cellType === "gem") return "gem";
        if (hitCell && hitCell.row === row && hitCell.col === col)
            return "mine-hit";
        return "mine";
    }

    const revealed = revealedCells.find(
        (cell) => cell.row === row && cell.col === col,
    );
    if (revealed) return revealed.type === "gem" ? "gem" : "mine-hit";

    return "hidden";
}
