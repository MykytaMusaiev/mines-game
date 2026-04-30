import { useRef, useCallback } from "react";
import { useGameStore } from "../store/gameStore";

export type SoundName = "gem" | "mine" | "cashout" | "start" | "hover";

const SOUND_SOURCES: Record<SoundName, string> = {
    gem: "/sounds/gem.mp3",
    mine: "/sounds/mine.mp3",
    cashout: "/sounds/cashout.mp3",
    start: "/sounds/start.mp3",
    hover: "/sounds/hover.mp3",
};

export function useSound() {
    const isMuted = useGameStore((s) => s.isMuted);
    const audioRefs = useRef<Partial<Record<SoundName, HTMLAudioElement>>>({});

    const getAudio = useCallback((name: SoundName): HTMLAudioElement => {
        if (!audioRefs.current[name]) {
            const audio = new Audio(SOUND_SOURCES[name]);
            audio.preload = "auto";
            audioRefs.current[name] = audio;
        }
        return audioRefs.current[name]!;
    }, []);

    const play = useCallback(
        (name: SoundName) => {
            if (isMuted) return;
            try {
                const audio = getAudio(name);
                audio.currentTime = 0;
                audio.play().catch(() => {});
            } catch {
                // ignoring play errors
            }
        },
        [isMuted, getAudio],
    );

    return { play };
}
