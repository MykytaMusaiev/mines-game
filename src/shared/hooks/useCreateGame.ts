import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "../api/apiClient";
import { useGameStore } from "../store/gameStore";
import type {
    BalanceResponse,
    CreateGameRequest,
    CreateGameResponse,
} from "../types";
import { BALANCE_QUERY_KEY } from "./useBalance";
import { ACTIVE_GAME_QUERY_KEY } from "./useActiveGame";

export function useCreateGame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CreateGameRequest) =>
            apiClient.post<CreateGameResponse>("/api/games", body),

        onSuccess: (data) => {
            useGameStore.getState().setGameId(data.gameId);

            const cached =
                queryClient.getQueryData<BalanceResponse>(BALANCE_QUERY_KEY);
            if (cached) {
                queryClient.setQueryData(BALANCE_QUERY_KEY, {
                    balance: cached.balance - data.betAmount,
                });
            }

            queryClient.setQueryData(ACTIVE_GAME_QUERY_KEY, {
                gameId: data.gameId,
                minesCount: data.minesCount,
                betAmount: data.betAmount,
                status: data.status,
                currentMultiplier: 1,
                nextMultiplier: 1,
                revealedCells: [],
                gemsFound: 0,
            });
        },

        onError: () => {
            toast.error("Failed to start game. Please try again.");
        },
    });
}
