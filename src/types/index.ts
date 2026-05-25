export type Category = 'history' | 'science' | 'geography' | 'general';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  category: Category;
  difficulty: Difficulty;
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation: string;
}

export interface AnswerRecord {
  questionId: number;
  selectedIndex: number;
  isCorrect: boolean;
  elapsedSeconds: number;
}

export type GamePhase = 'home' | 'select' | 'playing' | 'result';

export interface GameState {
  phase: GamePhase;
  currentCategory: Category | null;
  questions: Question[];
  currentIndex: number;
  score: number;
  combo: number;
  answers: AnswerRecord[];
  nickname: string;
  startTime: number | null;
}

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  totalTime: number;
  date: string;
  categoryScores: Record<Category, number>;
}
