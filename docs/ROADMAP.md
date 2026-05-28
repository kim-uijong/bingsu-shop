# ROADMAP.md — 오늘의 빙수 가게

## 전체 일정 (14~15일)

| Phase | 기간 | 내용 | 상태 |
|-------|------|------|------|
| -1 | 1일 | 개발자센터 정독 + 정책 확인 | ✅ 완료 |
| 0 | 1일 | 산출물 작성 | ✅ 완료 |
| 0.5a | 3~4일 | ChatGPT/Gemini 일러스트 52개 | 🟡 진행 중 |
| 0.5b | 1일 | UI 와이어프레임 | 대기 |
| 1 | 1일 | 메인 UI | ✅ 완료 |
| 2 | 1일 | 출석 선물 시스템 | ✅ 완료 |
| 3 | 2일 | 2단계 얼음/토핑 + 상태 전환 | ✅ 완료 |
| 4 | 1일 | 13종 빙수 + 4티어 + 0원 검증 | ✅ 완료 |
| 5 | 1일 | 130개 대사 + 13가지 환호 | ✅ 완료 |
| 6 | 1일 | SDK 연동 (2개 프로모션 코드 + 배너) | ✅ 코드 완료 (콘솔 실 ID 교체 대기) |
| 7 | 1일 | 일일 시스템 + CSS 애니메이션 | ✅ 완료 |
| 8 | 1일 | 환경 효과 (얼음 입자, 시럽 방울) | ✅ 완료 |
| 9 | 0.5일 | 확률표 + UI 마무리 | ✅ 완료 |
| 10 | 0.5일 | 검수 대응 | ✅ 완료 |

## Phase별 상세

### Phase 0.5a — 일러스트 (병렬 진행 가능)
- ChatGPT Plus로 팥빙수 베이스 생성
- 4상태 변형 (빈그릇/얼음/토핑/완성)
- 나머지 12종 동일 스타일로 제작
- Gemini로 배경/소품 보조 제작
- 총 52개 PNG → `src/assets/bingsus/`

### Phase 1 — 메인 UI
- `pages/index.tsx` (메인 화면)
- `src/components/DailyCounter.tsx`
- `src/components/DailyGiftCard.tsx`
- `src/components/BannerAd.tsx`

### Phase 3 — 핵심 메커니즘 (2일)
- `src/hooks/useBingsu.ts`
- `pages/ice-crushing.tsx`
- `pages/topping-up.tsx`
- `src/components/StepBar.tsx`
- `src/components/IceParticle.tsx`

### Phase 6 — SDK 연동
- ✅ `grantPromotionReward` 2개 코드 연결 (`useGrantReward`, daily/reward 분리)
- ✅ `loadFullScreenAd` / `showFullScreenAd` 전면 광고 (`useFullScreenAd`)
- ✅ `InlineAd` 배너 광고 (`BannerAd` 컴포넌트, dev은 placeholder)
- ✅ `getServerTime` 일일 리셋 (`useGameState`)
- ⏳ 콘솔에서 실 광고 ID 발급 후 `adConfig.ts` + `IS_PRODUCTION=true` 전환

## 콘솔 준비 체크리스트

- [ ] 앱인토스 콘솔 가입
- [ ] 워크스페이스 생성
- [ ] 사업자 등록 완료
- [ ] 앱 등록 (비게임 카테고리)
- [ ] 2개 프로모션 코드 등록 (BINGSU_DAILY + BINGSU_REWARD)
- [ ] 비즈월렛 30만원 이상 충전
- [ ] 샌드박스 앱 설치 (테스트용)
