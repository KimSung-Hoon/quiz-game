# 🧠 상식 퀴즈 게임

역사 · 과학 · 지리 · 일반상식 4개 카테고리, 총 40문제의 상식 퀴즈 게임입니다.

## 기술 스택

| 역할 | 라이브러리 |
|------|-----------|
| UI | React 18 + TypeScript |
| 빌드 | Vite |
| 스타일 | Tailwind CSS (v4, `@tailwindcss/vite`) |
| 전역 상태 | Zustand |
| 데이터 저장 | localStorage |

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 게임 방법

1. **닉네임 입력** → 시작하기
2. **카테고리 선택** — 역사 / 과학 / 지리 / 일반상식
3. **10문제 풀기** — 30초 타이머, 각 문제에 해설 제공
4. **결과 확인** — 점수·등급·문항 리뷰, 리더보드 자동 저장

## 점수 계산

| 조건 | 점수 |
|------|------|
| 정답 | +10점 |
| 10초 이내 정답 | +5점 (스피드 보너스) |
| 3연속 정답 | ×1.1 배율 (3연속마다 +0.1, 최대 ×1.5) |
| 시간 초과 (30초) | 0점, 콤보 리셋, 자동 다음 문제 진행 |

## 프로젝트 구조

```
src/
├── types/index.ts        # 공유 타입 정의
├── data/questions.ts     # 40문제 데이터 (교차 검증 완료)
├── store/gameStore.ts    # Zustand 스토어 + 점수 계산 로직
├── pages/
│   ├── HomePage.tsx      # 닉네임 입력, 리더보드
│   ├── SelectPage.tsx    # 카테고리 선택
│   ├── PlayingPage.tsx   # 퀴즈 진행, 타이머
│   └── ResultPage.tsx    # 결과, 문항 리뷰
└── components/           # 재사용 컴포넌트 (확장용)
```

## 빌드

```bash
npm run build    # dist/ 생성
npm run preview  # 빌드 결과 미리보기
```
