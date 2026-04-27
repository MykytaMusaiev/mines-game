import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/apiClient";
import type { ActiveGameResponse, ApiError } from "../types";

export const ACTIVE_GAME_QUERY_KEY = ["games", "active"] as const;

export function useActiveGame() {
    return useQuery({
        queryKey: ACTIVE_GAME_QUERY_KEY,
        queryFn: async () => {
            try {
                return await apiClient.get<ActiveGameResponse>(
                    "/api/games/active",
                );
            } catch (err) {
                const apiError = err as ApiError;
                if (apiError.statusCode === 404) return null;
                throw err;
            }
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
}
