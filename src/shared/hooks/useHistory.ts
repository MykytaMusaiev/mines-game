import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/apiClient";
import type { HistoryResponse } from "../types";

export const HISTORY_QUERY_KEY = ["history"] as const;

export function useHistory() {
    return useQuery({
        queryKey: HISTORY_QUERY_KEY,
        queryFn: () => apiClient.get<HistoryResponse>("/api/history"),
    });
}
