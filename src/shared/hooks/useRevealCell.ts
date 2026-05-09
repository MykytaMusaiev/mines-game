import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "../api/apiClient";
import { useGameStore } from "../store/gameStore";
import type { RevealCellRequest, RevealCellResponse } from "../types";
import { BALANCE_QUERY_KEY } from "./useBalance";
import { HISTORY_QUERY_KEY } from "./useHistory";

export function useRevealCell() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: RevealCellRequest) => {
            const gameId = useGameStore.getState().gameId;
            if (!gameId) throw new Error("No active game");
            return apiClient.post<RevealCellResponse>(
                `/api/games/${gameId}/reveal`,
                body,
            );
        },

        onSuccess: (data) => {
            if (data.status === "lost") {
                useGameStore.getState().setGameId(null);
                queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
                queryClient.invalidateQueries({ queryKey: BALANCE_QUERY_KEY });
            }
        },

        onError: () => {
            toast.error("Failed to reveal cell. Please try again.");
        },
    });
}
