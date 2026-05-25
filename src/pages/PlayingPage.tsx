import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const TIMER_MAX = 30;
// answerQuestion에 넘기는 -1은 "시간 초과" 의미 — 어떤 answerIndex와도 불일치하므로 오답 처리됨
const TIMEOUT_IDX = -1;

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700',
};
const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
};
const CATEGORY_LABEL: Record<string, string> = {
  history: '역사',
  science: '과학',
  geography: '지리',
  general: '상식',
};

export default function PlayingPage() {
  const { questions, currentIndex, score, combo, answerQuestion } = useGameStore();
  const question = questions[currentIndex];

  const [elapsed, setElapsed] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  // interval 클로저가 stale selected를 참조하는 것을 방지
  const selectedRef = useRef<number | null>(null);

  useEffect(() => {
    setElapsed(0);
    setSelected(null);
    selectedRef.current = null;
    setShowResult(false);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (selectedRef.current !== null) return;

      const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);

      if (secs >= TIMER_MAX) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setElapsed(TIMER_MAX);
        // 시간 초과 처리
        selectedRef.current = TIMEOUT_IDX;
        setSelected(TIMEOUT_IDX);
        setShowResult(true);
        setTimeout(() => answerQuestion(TIMEOUT_IDX, TIMER_MAX), 1400);
      } else {
        setElapsed(secs);
      }
    }, 200);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, answerQuestion]);

  function handleSelect(idx: number) {
    if (selectedRef.current !== null) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
    selectedRef.current = idx;
    setSelected(idx);
    setShowResult(true);

    setTimeout(() => answerQuestion(idx, secs), 1400);
  }

  const progress = (currentIndex / questions.length) * 100;
  const timerRatio = elapsed / TIMER_MAX;
  const timerColor =
    elapsed <= 10 ? 'bg-emerald-400' : elapsed <= 20 ? 'bg-amber-400' : 'bg-rose-500';

  const comboMultiplier =
    combo >= 12 ? 1.5 : combo >= 9 ? 1.3 : combo >= 6 ? 1.2 : combo >= 3 ? 1.1 : 1.0;

  const isTimedOut = selected === TIMEOUT_IDX;
  const isCorrect = selected === question.answerIndex;

  function optionStyle(idx: number): string {
    const base =
      'w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all duration-200 flex items-center gap-3';
    if (!showResult) {
      return `${base} border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 active:scale-[0.98] cursor-pointer`;
    }
    if (idx === question.answerIndex) {
      return `${base} border-emerald-400 bg-emerald-50 text-emerald-800`;
    }
    if (idx === selected && !isTimedOut) {
      return `${base} border-rose-400 bg-rose-50 text-rose-800`;
    }
    return `${base} border-gray-100 bg-gray-50 text-gray-400`;
  }

  const resultStyle = isCorrect
    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
    : isTimedOut
    ? 'bg-orange-50 border border-orange-200 text-orange-800'
    : 'bg-rose-50 border border-rose-200 text-rose-800';

  const resultLabel = isCorrect
    ? '✅ 정답입니다!'
    : isTimedOut
    ? '⏰ 시간 초과!'
    : '❌ 오답입니다.';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">
        {/* 상단 상태바 */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-600 tabular-nums text-lg">{score}점</span>
            {combo >= 3 && (
              <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-xs font-bold animate-pulse">
                🔥 {combo}콤보 ×{comboMultiplier.toFixed(1)}
              </span>
            )}
          </div>
          <span className="text-gray-400 font-medium">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* 진행 바 */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 문제 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          {/* 카테고리·난이도 배지 */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
              {CATEGORY_LABEL[question.category]}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${DIFFICULTY_BADGE[question.difficulty]}`}>
              {DIFFICULTY_LABEL[question.difficulty]}
            </span>
          </div>

          {/* 타이머 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>남은 시간</span>
              <span className={
                elapsed <= 10 ? 'text-emerald-600 font-bold' :
                elapsed <= 20 ? 'text-amber-600 font-bold' :
                'text-rose-600 font-bold'
              }>
                {Math.max(TIMER_MAX - elapsed, 0)}초
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-200 ${timerColor}`}
                style={{ width: `${(1 - timerRatio) * 100}%` }}
              />
            </div>
            {elapsed <= 10 && !showResult && (
              <p className="text-xs text-emerald-600 font-medium">⚡ 10초 이내 정답 시 +5점 보너스!</p>
            )}
          </div>

          {/* 문제 */}
          <p className="text-gray-900 font-semibold text-lg leading-relaxed">{question.question}</p>

          {/* 선택지 */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => (
              <button key={idx} className={optionStyle(idx)} onClick={() => handleSelect(idx)}>
                <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                  {OPTION_LABELS[idx]}
                </span>
                <span>{opt}</span>
                {showResult && idx === question.answerIndex && (
                  <span className="ml-auto text-emerald-500 font-bold">✓</span>
                )}
                {showResult && idx === selected && !isTimedOut && idx !== question.answerIndex && (
                  <span className="ml-auto text-rose-500 font-bold">✗</span>
                )}
              </button>
            ))}
          </div>

          {/* 해설 */}
          {showResult && (
            <div className={`rounded-xl p-4 text-sm leading-relaxed ${resultStyle}`}>
              <p className="font-bold mb-1">{resultLabel}</p>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
