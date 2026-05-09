import { motion, AnimatePresence } from 'framer-motion';
import { useHistory } from '../../shared/hooks/useHistory';
import { formatAmount } from '../../shared/utils/formatAmount';
import styles from './RecentGames.module.css';

export function RecentGames() {
  const { data, isLoading } = useHistory();
  const games = data?.games ?? [];

  return (
    <aside className={styles.aside}>
      <h3 className={styles.title}>RECENT GAMES</h3>

      {isLoading && (
        <div className={styles.loadingWrap}>
          <span className={styles.spinner} />
        </div>
      )}

      {!isLoading && games.length === 0 && (
        <p className={styles.empty}>No games yet</p>
      )}

      {/* Desktop: vertical list */}
      <div className={styles.listDesktop}>
        <AnimatePresence initial={false}>
          {games.map((game, i) => {
            const isWin = game.status === 'won';
            return (
              <motion.div
                key={game.gameId}
                className={styles.row}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
              >
                <div className={styles.rowTop}>
                  <span className={styles.bet}>${formatAmount(game.betAmount)}</span>
                  {isWin ? (
                    <span className={styles.multiplierWin}>
                      {formatAmount(game.multiplier)}×
                    </span>
                  ) : (
                    <span className={styles.bombIcon}>💣</span>
                  )}
                </div>
                <div className={styles.rowBottom}>
                  <span className={isWin ? styles.statusWin : styles.statusBust}>
                    {isWin ? 'WIN' : 'BUST'}
                  </span>
                  <span className={isWin ? styles.profitPos : styles.profitNeg}>
                    {isWin
                      ? `+$${formatAmount(game.profit)}`
                      : `-$${formatAmount(game.betAmount)}`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className={styles.listMobile}>
        {games.map((game, i) => {
          const isWin = game.status === 'won';
          return (
            <motion.div
              key={game.gameId}
              className={styles.card}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <div className={styles.cardTop}>
                <span className={styles.bet}>${formatAmount(game.betAmount)}</span>
                {isWin ? (
                  <span className={styles.multiplierWin}>
                    {formatAmount(game.multiplier)}×
                  </span>
                ) : (
                  <span className={styles.bombIcon}>💣</span>
                )}
              </div>
              <div className={styles.cardBottom}>
                <span className={isWin ? styles.statusWin : styles.statusBust}>
                  {isWin ? 'WIN' : 'BUST'}
                </span>
                <span className={isWin ? styles.profitPos : styles.profitNeg}>
                  {isWin
                    ? `+$${formatAmount(game.profit)}`
                    : `-$${formatAmount(game.betAmount)}`}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </aside>
  );
}