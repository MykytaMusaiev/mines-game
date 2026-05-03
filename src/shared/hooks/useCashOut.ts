import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "../api/apiClient";
import { useGameStore } from "../store/gameStore";
import type { CashOutResponse } from "../types";

export function useCashOut() {
    return useMutation({
        mutationFn: () => {
            const gameId = useGameStore.getState().gameId;
            if (!gameId) throw new Error("No active game");
            return apiClient.post<CashOutResponse>(
                `/api/games/${gameId}/cashout`,
            );
        },
        onError: () => {
            toast.error("Failed to cash out. Please try again.");
        },
    });
}
