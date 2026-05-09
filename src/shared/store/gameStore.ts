import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MinesCount } from "../types";
import { BET_MIN, MINES_OPTIONS } from "../constants/game";

interface GameStoreState {
    gameId: string | null;
    betAmount: number;
    minesCount: MinesCount;
    isMuted: boolean;
}

interface GameStoreActions {
    setGameId: (id: string | null) => void;
    setBetAmount: (amount: number) => void;
    setMinesCount: (count: MinesCount) => void;
    toggleMute: () => void;
}

type GameStore = GameStoreState & GameStoreActions;

export const useGameStore = create<GameStore>()(
    persist(
        (set) => ({
            gameId: null,
            betAmount: BET_MIN,
            minesCount: MINES_OPTIONS[1],
            isMuted: false,

            setGameId: (id) => set({ gameId: id }),
            setBetAmount: (amount) => set({ betAmount: amount }),
            setMinesCount: (count) => set({ minesCount: count }),
            toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
        }),
        {
            name: "mines-game-store",
            partialize: (state) => ({
                gameId: state.gameId,
                isMuted: state.isMuted,
            }),
        },
    ),
);
