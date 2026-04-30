import { useGameStore } from '../../shared/store/gameStore';
import styles from './MuteButton.module.css';

export function MuteButton() {
  const { isMuted, toggleMute } = useGameStore();

  return (
    <button
      className={styles.btn}
      onClick={toggleMute}
      type="button"
      aria-label={isMuted ? 'Unmute' : 'Mute'}
      title={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? '🔇' : '🔊'}
    </button>
  );
}