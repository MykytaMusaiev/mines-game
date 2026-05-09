import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { GamePage } from './components/GamePage/GamePage';
import { LoadingOverlay } from './components/LoadingOverlay/LoadingOverlay';
import { useActiveGame } from './shared/hooks/useActiveGame';
import { useBalance } from './shared/hooks/useBalance';
import { useHistory } from './shared/hooks/useHistory';
import styles from './App.module.css';

export default function App() {
  const { isLoading: isActiveGameLoading } = useActiveGame();
  const { isLoading: isBalanceLoading } = useBalance();
  const { isLoading: isHistoryLoading } = useHistory();

  const isAppLoading = isActiveGameLoading || isBalanceLoading || isHistoryLoading;

  return (
    <div className={styles.app}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a2035',
            color: '#ffffff',
            border: '1px solid #2a3550',
          },
          duration: 3000,
        }}
      />

      <AnimatePresence>
        {isAppLoading && <LoadingOverlay type="app" key="app-loader" />}
      </AnimatePresence>

      {!isAppLoading && <GamePage />}
    </div>
  );
}