import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "../api/apiClient";
import { useGameStore } from "../store/gameStore";
import type { CashOutResponse } from "../types";
import { BALANCE_QUERY_KEY } from "./useBalance";
import { HISTORY_QUERY_KEY } from "./useHistory";
import { ACTIVE_GAME_QUERY_KEY } from "./useActiveGame";

export function useCashOut() {
    const queryClient = useQueryClient();
    const gameId = useGameStore((state) => state.gameId);
    const setGameId = useGameStore((state) => state.setGameId);

    return useMutation({
        mutationFn: () => {
            if (!gameId) throw new Error("No active game");
            return apiClient.post<CashOutResponse>(
                `/api/games/${gameId}/cashout`,
            );
        },

        onSuccess: (data) => {
            setGameId(null);
            toast.success(`You won $${data.winAmount.toFixed(2)}! 🎉`);
            queryClient.invalidateQueries({ queryKey: BALANCE_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ACTIVE_GAME_QUERY_KEY });
        },

        onError: () => {
            toast.error("Failed to cash out. Please try again.");
        },
    });
}
