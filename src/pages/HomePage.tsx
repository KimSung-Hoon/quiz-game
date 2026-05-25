import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { LeaderboardEntry } from '../types';

const CATEGORY_LABELS = {
  history: '역사',
  science: '과학',
  geography: '지리',
  general: '상식',
};

function LeaderboardRow({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
      <span className="w-8 text-center text-sm font-bold text-gray-500">{medal}</span>
      <span className="flex-1 font-medium text-gray-800 truncate">{entry.nickname}</span>
      <span className="text-indigo-600 font-bold tabular-nums">{entry.score}점</span>
      <span className="text-xs text-gray-400 w-20 text-right">
        {Object.entries(entry.categoryScores)
          .filter(([, v]) => v > 0)
          .map(([k]) => CATEGORY_LABELS[k as keyof typeof CATEGORY_LABELS])
          .join(', ')}
      </span>
    </div>
  );
}

export default function HomePage() {
  const { setNickname, goToSelect, getLeaderboard } = useGameStore();
  const [input, setInput] = useState('');
  const leaderboard = getLeaderboard().slice(0, 5);

  function handleStart() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setNickname(trimmed);
    goToSelect();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* 타이틀 */}
        <div className="text-center space-y-2">
          <div className="text-6xl mb-2">🧠</div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">상식 퀴즈</h1>
          <p className="text-gray-500">역사 · 과학 · 지리 · 일반상식</p>
        </div>

        {/* 닉네임 입력 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <label className="block text-sm font-semibold text-gray-700">닉네임 입력</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="닉네임을 입력하세요"
            maxLength={12}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 placeholder-gray-300 transition"
          />
          <button
            onClick={handleStart}
            disabled={!input.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-colors text-lg"
          >
            시작하기
          </button>
        </div>

        {/* 점수판 */}
        {leaderboard.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              명예의 전당
            </h2>
            <div className="divide-y divide-gray-50">
              {leaderboard.map((entry, i) => (
                <LeaderboardRow key={i} entry={entry} rank={i + 1} />
              ))}
            </div>
          </div>
        )}

        {/* 게임 안내 */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <div className="text-xl mb-1">⚡</div>
            <div>10초 이내<br />스피드 보너스</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <div className="text-xl mb-1">🔥</div>
            <div>3연속 정답<br />콤보 배율</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <div className="text-xl mb-1">🏆</div>
            <div>최고 점수<br />리더보드 등록</div>
          </div>
        </div>
      </div>
    </div>
  );
}
