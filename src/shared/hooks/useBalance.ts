import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/apiClient";
import type { BalanceResponse } from "../types";

export const BALANCE_QUERY_KEY = ["balance"] as const;

export function useBalance() {
    return useQuery({
        queryKey: BALANCE_QUERY_KEY,
        queryFn: () => apiClient.get<BalanceResponse>("/api/balance"),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
}
