export const MINES_OPTIONS = [1, 3, 5, 10, 24] as const;

export const BET_MIN = 1;
export const BET_MAX = 10_000;

export const GRID_SIZE = 5;
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

export const API_BASE_URL = "https://mines-be.vercel.app";
export const PLAYER_ID = "int_april_HW4_dev_M";

export const STAGGER_DELAY_MS = 60;
export const API_TIMEOUT_MS = 10_000;

export const QUICK_BET_AMOUNTS = [
    10, 25, 50, 100, 250, 500, 1000, 2500,
] as const;

export const CELL_ICONS = {
    gem: { src: "/images/diamond.svg", alt: "gem" },
    mine: { src: "/images/bomb.png", alt: "mine" },
    "mine-hit": { src: "/images/bomb.png", alt: "mine" },
} as const;
