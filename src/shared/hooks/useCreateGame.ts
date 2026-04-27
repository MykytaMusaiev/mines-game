import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "../api/apiClient";
import { useGameStore } from "../store/gameStore";
import type { CreateGameRequest, CreateGameResponse } from "../types";
import { BALANCE_QUERY_KEY } from "./useBalance";
import { ACTIVE_GAME_QUERY_KEY } from "./useActiveGame";

export function useCreateGame() {
    const queryClient = useQueryClient();
    const setGameId = useGameStore((state) => state.setGameId);

    return useMutation({
        mutationFn: (body: CreateGameRequest) =>
            apiClient.post<CreateGameResponse>("/api/games", body),

        onSuccess: (data) => {
            setGameId(data.gameId);
            queryClient.invalidateQueries({ queryKey: BALANCE_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ACTIVE_GAME_QUERY_KEY });
        },

        onError: () => {
            toast.error("Failed to start game. Please try again.");
        },
    });
}
