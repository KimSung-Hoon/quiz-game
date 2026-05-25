import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';

const CATEGORY_LABEL: Record<string, string> = {
  history: '역사',
  science: '과학',
  geography: '지리',
  general: '상식',
};

function ScoreGrade({ score, total }: { score: number; total: number }) {
  const ratio = score / (total * 15); // 최대 15점/문제
  if (ratio >= 0.9) return <span className="text-yellow-500 font-black text-5xl">S</span>;
  if (ratio >= 0.75) return <span className="text-indigo-500 font-black text-5xl">A</span>;
  if (ratio >= 0.6) return <span className="text-emerald-500 font-black text-5xl">B</span>;
  if (ratio >= 0.4) return <span className="text-amber-500 font-black text-5xl">C</span>;
  return <span className="text-rose-500 font-black text-5xl">D</span>;
}

export default function ResultPage() {
  const { score, answers, questions, startTime, currentCategory, nickname, saveToLeaderboard, startGame, goHome } =
    useGameStore();

  const [saved, setSaved] = useState(false);
  const hasSaved = useRef(false);

  const totalTime = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const maxCombo = answers.reduce((max, _, i) => {
    const streak = answers.slice(0, i + 1).reverse().findIndex((a) => !a.isCorrect);
    return Math.max(max, streak === -1 ? i + 1 : streak);
  }, 0);

  useEffect(() => {
    if (!hasSaved.current) {
      hasSaved.current = true;
      saveToLeaderboard();
      setSaved(true);
    }
  }, [saveToLeaderboard]);

  const mins = Math.floor(totalTime / 60);
  const secs = totalTime % 60;
  const timeStr = mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">
        {/* 결과 헤더 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-3">
          <p className="text-sm text-gray-400">
            {nickname} · {currentCategory ? CATEGORY_LABEL[currentCategory] : ''} · {timeStr}
          </p>
          <div className="flex items-center justify-center gap-6">
            <ScoreGrade score={score} total={questions.length} />
            <div>
              <p className="text-5xl font-black text-gray-900 tabular-nums">{score}</p>
              <p className="text-sm text-gray-400">점</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-black text-indigo-600">{correctCount}/{questions.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">정답</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-black text-rose-500">{maxCombo}</p>
              <p className="text-xs text-gray-400 mt-0.5">최대 콤보</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-black text-amber-500">
                {answers.filter((a) => a.isCorrect && a.elapsedSeconds <= 10).length}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">스피드</p>
            </div>
          </div>

          {saved && (
            <p className="text-xs text-emerald-600 font-medium">🏆 리더보드에 저장되었습니다!</p>
          )}
        </div>

        {/* 문항별 결과 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">문항 리뷰</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {answers.map((ans, i) => {
              const q = questions[i];
              return (
                <div
                  key={q.id}
                  className={`rounded-xl p-3 text-sm border ${
                    ans.isCorrect
                      ? 'bg-emerald-50 border-emerald-100'
                      : 'bg-rose-50 border-rose-100'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0 text-base">{ans.isCorrect ? '✅' : '❌'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 leading-snug">{q.question}</p>
                      {!ans.isCorrect && (
                        <p className="text-xs text-gray-500 mt-1">
                          정답: <span className="font-semibold text-emerald-700">{q.options[q.answerIndex]}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ans.elapsedSeconds}초 소요
                        {ans.isCorrect && ans.elapsedSeconds <= 10 && (
                          <span className="ml-1 text-amber-500 font-medium">⚡ 스피드 보너스</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          {currentCategory && (
            <button
              onClick={() => startGame(currentCategory)}
              className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
            >
              다시 도전
            </button>
          )}
          <button
            onClick={goHome}
            className="py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-200 transition-colors"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
