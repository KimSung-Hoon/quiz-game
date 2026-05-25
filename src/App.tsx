import './index.css';
import { useGameStore } from './store/gameStore';
import HomePage from './pages/HomePage';
import SelectPage from './pages/SelectPage';
import PlayingPage from './pages/PlayingPage';
import ResultPage from './pages/ResultPage';

export default function App() {
  const phase = useGameStore((s) => s.phase);

  switch (phase) {
    case 'home':    return <HomePage />;
    case 'select':  return <SelectPage />;
    case 'playing': return <PlayingPage />;
    case 'result':  return <ResultPage />;
  }
}
