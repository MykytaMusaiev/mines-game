import { useCallback } from 'react';
import { BET_MIN, BET_MAX, QUICK_BET_AMOUNTS } from '../../../shared/constants/game';
import styles from './BetControls.module.css';

interface BetControlsProps {
  value: number;
  balance: number;
  onChange: (value: number) => void;
  disabled: boolean;
}

export function BetControls({ value, balance, onChange, disabled }: BetControlsProps) {
  const clamp = useCallback(
    (val: number) => Math.min(Math.max(val, BET_MIN), Math.min(BET_MAX, balance)),
    [balance]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value.replace(/\D/g, ''));
    onChange(Math.min(raw, Math.min(BET_MAX, balance)));
  };

  const handleHalf = () => onChange(clamp(Math.floor(value / 2)));
  const handleDouble = () => onChange(clamp(value * 2));
  const handleMax = () => onChange(clamp(Math.min(BET_MAX, balance)));

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>BET AMOUNT</span>

      <div className={styles.inputRow}>
        <span className={styles.currency}>$</span>
        <input
          className={styles.input}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>

      {/* Quick amounts — mobile only */}
      <div className={styles.quickAmounts}>
        {QUICK_BET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            className={`${styles.quickBtn} ${value === amount ? styles.active : ''}`}
            onClick={() => onChange(clamp(amount))}
            disabled={disabled}
            type="button"
          >
            ${amount}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={handleHalf} disabled={disabled} type="button">
          1/2
        </button>
        <button className={styles.actionBtn} onClick={handleDouble} disabled={disabled} type="button">
          x2
        </button>
        <button className={styles.actionBtn} onClick={handleMax} disabled={disabled} type="button">
          Max
        </button>
      </div>
    </div>
  );
}