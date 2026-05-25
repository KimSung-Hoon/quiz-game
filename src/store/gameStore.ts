import { create } from 'zustand';
import type { Category, GamePhase, GameState, Question, LeaderboardEntry } from '../types';
import { questions as allQuestions } from '../data/questions';

const QUESTIONS_PER_GAME = 10;
const BASE_SCORE = 10;
const SPEED_BONUS = 5;
const SPEED_THRESHOLD_SECONDS = 10;
const COMBO_STEP = 3;
const COMBO_MULTIPLIER_INCREMENT = 0.1;
const MAX_COMBO_MULTIPLIER = 1.5;

const LEADERBOARD_KEY = 'quiz_leaderboard';

function calcComboMultiplier(combo: number): number {
  const steps = Math.floor(combo / COMBO_STEP);
  return Math.min(1 + steps * COMBO_MULTIPLIER_INCREMENT, MAX_COMBO_MULTIPLIER);
}

function calcScore(isCorrect: boolean, elapsedSeconds: number, combo: number): number {
  if (!isCorrect) return 0;
  const base = BASE_SCORE + (elapsedSeconds <= SPEED_THRESHOLD_SECONDS ? SPEED_BONUS : 0);
  return Math.round(base * calcComboMultiplier(combo));
}

function shuffleQuestions(category: Category): Question[] {
  const pool = allQuestions.filter((q) => q.category === category);
  return [...pool].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_GAME);
}

interface GameActions {
  setNickname: (nickname: string) => void;
  goToSelect: () => void;
  startGame: (category: Category) => void;
  answerQuestion: (optionIndex: number, elapsedSeconds: number) => void;
  goHome: () => void;
  saveToLeaderboard: () => void;
  getLeaderboard: () => LeaderboardEntry[];
}

const initialState: GameState = {
  phase: 'home',
  currentCategory: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  combo: 0,
  answers: [],
  nickname: '',
  startTime: null,
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  setNickname: (nickname) => set({ nickname }),

  goToSelect: () => set({ phase: 'select' }),

  startGame: (category) => {
    set({
      phase: 'playing',
      currentCategory: category,
      questions: shuffleQuestions(category),
      currentIndex: 0,
      score: 0,
      combo: 0,
      answers: [],
      startTime: Date.now(),
    });
  },

  answerQuestion: (optionIndex, elapsedSeconds) => {
    const { questions, currentIndex, score, combo, answers } = get();
    const question = questions[currentIndex];
    const isCorrect = optionIndex === question.answerIndex;
    const newCombo = isCorrect ? combo + 1 : 0;
    const gained = calcScore(isCorrect, elapsedSeconds, combo);

    const newAnswers = [
      ...answers,
      { questionId: question.id, selectedIndex: optionIndex, isCorrect, elapsedSeconds },
    ];

    const isLast = currentIndex === questions.length - 1;

    set({
      score: score + gained,
      combo: newCombo,
      answers: newAnswers,
      currentIndex: isLast ? currentIndex : currentIndex + 1,
      phase: isLast ? 'result' : 'playing',
    });
  },

  goHome: () => set({ ...initialState }),

  saveToLeaderboard: () => {
    const { nickname, score, answers, startTime, currentCategory } = get();
    if (!nickname || !startTime || !currentCategory) return;

    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const categoryScores = { history: 0, science: 0, geography: 0, general: 0 } as Record<Category, number>;
    categoryScores[currentCategory] = score;

    const entry: LeaderboardEntry = {
      nickname,
      score,
      totalTime,
      date: new Date().toISOString(),
      categoryScores,
    };

    const prev = get().getLeaderboard();
    const updated = [...prev, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  },

  getLeaderboard: (): LeaderboardEntry[] => {
    try {
      const raw = localStorage.getItem(LEADERBOARD_KEY);
      return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
    } catch {
      return [];
    }
  },
}));

export { calcComboMultiplier, calcScore };
