import { useGameStore } from '../store/gameStore';
import type { Category } from '../types';

interface CategoryCard {
  id: Category;
  label: string;
  emoji: string;
  description: string;
  color: string;
  bg: string;
  border: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: 'history',
    label: '역사',
    emoji: '🏛️',
    description: '고조선부터 세계사까지',
    color: 'text-amber-700',
    bg: 'bg-amber-50 hover:bg-amber-100',
    border: 'border-amber-200 hover:border-amber-400',
  },
  {
    id: 'science',
    label: '과학',
    emoji: '🔬',
    description: '물리·화학·생물·우주',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    border: 'border-emerald-200 hover:border-emerald-400',
  },
  {
    id: 'geography',
    label: '지리',
    emoji: '🌍',
    description: '나라·산·강·도시',
    color: 'text-blue-700',
    bg: 'bg-blue-50 hover:bg-blue-100',
    border: 'border-blue-200 hover:border-blue-400',
  },
  {
    id: 'general',
    label: '일반상식',
    emoji: '💡',
    description: '문화·예술·스포츠·IT',
    color: 'text-purple-700',
    bg: 'bg-purple-50 hover:bg-purple-100',
    border: 'border-purple-200 hover:border-purple-400',
  },
];

export default function SelectPage() {
  const { nickname, startGame, goHome } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* 헤더 */}
        <div className="text-center space-y-1">
          <p className="text-sm text-gray-400">안녕하세요, <span className="font-semibold text-indigo-600">{nickname}</span>님!</p>
          <h1 className="text-2xl font-extrabold text-gray-900">카테고리를 선택하세요</h1>
          <p className="text-sm text-gray-400">10문제 · 난이도 혼합</p>
        </div>

        {/* 카테고리 카드 */}
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => startGame(cat.id)}
              className={`${cat.bg} ${cat.border} border-2 rounded-2xl p-5 text-left transition-all duration-150 active:scale-95 shadow-sm`}
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <div className={`text-lg font-bold ${cat.color}`}>{cat.label}</div>
              <div className="text-xs text-gray-400 mt-1">{cat.description}</div>
            </button>
          ))}
        </div>

        {/* 점수 안내 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">점수 계산 방식</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>정답 기본 점수</span>
              <span className="font-bold text-gray-800">+10점</span>
            </div>
            <div className="flex justify-between">
              <span>⚡ 10초 이내 정답</span>
              <span className="font-bold text-amber-600">+5점</span>
            </div>
            <div className="flex justify-between">
              <span>🔥 3연속 정답 콤보</span>
              <span className="font-bold text-rose-600">×1.1 ~ ×1.5</span>
            </div>
          </div>
        </div>

        <button
          onClick={goHome}
          className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 홈으로
        </button>
      </div>
    </div>
  );
}
