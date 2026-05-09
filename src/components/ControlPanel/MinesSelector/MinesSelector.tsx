import { MINES_OPTIONS } from '../../../shared/constants/game';
import type { MinesCount } from '../../../shared/types';
import styles from './MinesSelector.module.css';

interface MinesSelectorProps {
  value: MinesCount;
  onChange: (value: MinesCount) => void;
  disabled: boolean;
}

export function MinesSelector({ value, onChange, disabled }: MinesSelectorProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>MINES</span>
      <div className={styles.options}>
        {MINES_OPTIONS.map((option) => (
          <button
            key={option}
            className={`${styles.option} ${value === option ? styles.active : ''}`}
            onClick={() => onChange(option)}
            disabled={disabled}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}