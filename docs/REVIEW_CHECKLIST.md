# REVIEW_CHECKLIST.md — 검수 대응 현황

> 앱인토스 비게임 미니앱 검수 체크리스트 점검 결과
> 최종 갱신: 2026-05-18

## ✅ 코드로 충족 완료

### 기술 요구사항

| 항목 | 충족 위치 | 비고 |
|------|----------|------|
| `getServerTime` 기반 일일 리셋 | `src/hooks/useGameState.ts` | KST 자정 기준 리셋, fallback 안전망 |
| 클라이언트 시간 사용 X | `src/utils/dateUtils.ts` | 항상 서버 시간 우선 |
| 광고 로드 실패 폴백 | `src/hooks/useFullScreenAd.ts` | `failedToShow` 이벤트 처리 + 사용자 안내 |
| 예산 소진(4109) 에러 처리 | `src/hooks/useGrantReward.ts` | 4100/4109/4110/4112 등 코드별 안내 |
| 광고 테스트 ID 사용 | `src/constants/adConfig.ts` | `IS_PRODUCTION=false` 분기 |
| CSS 애니메이션만 사용 | 모든 컴포넌트 | RN Animated API, Lottie/영상 없음 |

### 비즈니스 규칙

| 항목 | 충족 위치 | 검증 |
|------|----------|------|
| **0원 절대 발생 X** | `src/utils/bingsu.ts`, `src/utils/dailyGift.ts` | 단위 테스트 100,000회 × 5세트 |
| 하루 10그릇 상한 | `src/hooks/useGameState.ts` | `todayBingsuCount >= MAX_BINGSU` 분기 |
| 출석 선물 1일 1회 | `src/hooks/useGameState.ts` | `todayGiftClaimed` 플래그 + 매일 리셋 |
| 2개 프로모션 코드 매핑 | `src/constants/promotionCodes.ts` | daily → BINGSU_DAILY, 그 외 4티어 → BINGSU_REWARD |
| 확률 공시 (티어 등장만) | `src/pages/probability-info.tsx` | 4티어 % + 보상 범위만 노출 |

### UX/안전성

| 항목 | 충족 위치 |
|------|----------|
| 메시지 안전성 (가족/연애/부정 X) | `src/constants/messages.ts` 130개 |
| 금지어 검증 (당첨/추첨/복권/꽝/도박) | `src/constants/__tests__/messages.test.ts` |
| UX 라이팅 해요체 | 모든 화면 |
| 5060 타겟 큰 글씨/큰 버튼 | DESIGN_SPEC.md 기준, 본문 16sp+, 버튼 48dp+ |
| 인트로 페이지 (첫 사용자) | `src/components/IntroModal.tsx` |
| 개인정보 처리 방침 | `src/pages/policy.tsx` |
| 고객센터 연락처 | `src/pages/policy.tsx` |
| 뒤로가기 중복 방지 | 모든 화면 navigate 단방향 |

### 도박 방지 (CLAUDE.md 정책)

| 금지어 | 사용 안 함 | 검증 |
|--------|----------|------|
| 당첨 | ✅ | messages.test.ts |
| 추첨 | ✅ | messages.test.ts |
| 복권 | ✅ | messages.test.ts |
| 꽝 | ✅ | messages.test.ts (대체: "0원 절대 없어요!") |
| 도박 | ✅ | messages.test.ts |

---

## 🟡 콘솔/외부 작업 필요 (Phase 6)

| 항목 | 작업자 | 메모 |
|------|--------|------|
| 앱인토스 콘솔 가입 | 사용자 | 사업자 등록 완료 후 |
| 워크스페이스 생성 | 사용자 | "오늘의 빙수 가게" |
| 비게임 카테고리 등록 | 사용자 | 게임 카테고리 금지 |
| 2개 프로모션 코드 등록 | 사용자 | BINGSU_DAILY (출석) + BINGSU_REWARD (빙수 완성, 4티어 공통) |
| 각 코드별 테스트 호출 1회 | 사용자 | 토스 앱 QR (샌드박스 X) |
| 비즈월렛 30만원 이상 충전 | 사용자 | 필수 |
| 실 광고 ID 발급 | 사용자 | 콘솔에서 adGroupId 받기 |
| `adConfig.ts`의 ID 교체 | 개발자 | `IS_PRODUCTION=true` |
| 개인정보 처리방침 외부 URL (선택) | 사용자 | 콘솔에 입력 |

---

## 📋 빠른 점검 (검수 제출 전)

1. **0원 검증**: `npm test` 통과 확인
2. **타입 안전성**: `npm run typecheck` 통과
3. **광고 ID**: `adConfig.ts`가 실 ID인지 확인 (`IS_PRODUCTION=true`)
4. **프로모션 코드**: 콘솔에 5개 모두 등록 + 테스트 호출 완료
5. **비즈월렛**: 30만원 이상 잔액
6. **고객센터 이메일**: `policy.tsx`의 `CONTACT_EMAIL` 실제 주소로 수정
7. **사업자 정보**: 콘솔에 등록 완료 (1~2일 검토)
8. **확률 공시**: `/probability-info` 화면 정책상 정확한지 확인
9. **인트로 모달**: 첫 진입 시 표시되는지 확인
10. **일러스트**: 52개 PNG 자산 통합 (Phase 0.5a)
