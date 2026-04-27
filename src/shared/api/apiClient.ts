import { API_BASE_URL, PLAYER_ID, API_TIMEOUT_MS } from "../constants/game";
import type { ApiError } from "../types";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                "X-Player-Id": PLAYER_ID,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            const error: ApiError = {
                message: errorBody.message ?? "Something went wrong",
                statusCode: response.status,
            };
            throw error;
        }

        return response.json() as Promise<T>;
    } catch (err) {
        if ((err as DOMException).name === "AbortError") {
            const error: ApiError = {
                message: "Request timed out. Please try again.",
                statusCode: 408,
            };
            throw error;
        }
        throw err;
    } finally {
        clearTimeout(timeoutId);
    }
}

export const apiClient = {
    get: <T>(path: string) => request<T>(path),

    post: <T>(path: string, body?: unknown) =>
        request<T>(path, {
            method: "POST",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }),
};
