import { motion } from 'framer-motion';
import styles from './LoadingOverlay.module.css';

interface LoadingOverlayProps {
  type: 'app' | 'starting';
}

const dots = [
  { color: '#1e88e5' },
  { color: '#4caf50' },
  { color: '#ffc107' },
];

export function LoadingOverlay({ type }: LoadingOverlayProps) {
  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className={styles.content}>
        <div className={styles.dots}>
          {dots.map((dot, i) => (
            <motion.span
              key={i}
              className={styles.dot}
              style={{ background: dot.color }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {type === 'app' && (
          <>
            <h1 className={styles.title}>MINES</h1>
            <p className={styles.subtitle}>Loading game...</p>
          </>
        )}

        {type === 'starting' && (
          <p className={styles.startingText}>STARTING GAME...</p>
        )}
      </div>
    </motion.div>
  );
}