import { Toaster } from 'react-hot-toast';
import { GamePage } from './components/GamePage/GamePage';
import styles from './App.module.css';

export default function App() {
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
      <GamePage />
    </div>
  );
}