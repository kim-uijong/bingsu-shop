import { type BingsuTier } from './bingsus';

// 출석 선물은 1원 고정 (앱인토스 정책상 랜덤 보상 불가)
export const DAILY_GIFT_AMOUNT = 1;
export const DAILY_GIFT_LIMIT = 5;                  // 하루 출석 선물 횟수
export const GIFT_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 출석 사이 쿨타임 2시간(페이싱·리텐션)

// 빙수 티어별 보상 분포
// 2026-06-11 전체 기댓값 6.5 → 가능한 최저 ~4.8원으로 하향(광고10회≈4.8원). 티어 확률(60/25/10/5) 유지.
//   ※ premium 최소 15 / special 최소 25 보장 때문에 전체 EV는 ~4.73원 아래로 불가(수학적 하한).
//   classic ≈ 2.11 / fruit ≈ 3.16 / premium ≈ 15.16 / special ≈ 26.12
//   전체 = 0.6×2.11 + 0.25×3.16 + 0.10×15.16 + 0.05×26.12 ≈ 4.88원
//   special 301~1,000원 잭팟 0.05%(≈1/20,000) 유지.
// 가중치는 % × 100 (정수 유지), 각 티어 합 10000.
export interface RewardRange {
  min: number;
  max: number;
  weight: number;
}

export const TIER_REWARD_DISTRIBUTIONS: Record<BingsuTier, RewardRange[]> = {
  // 추억 빙수 (기댓값 ≈ 2.11원) — 최소치 위주
  classic: [
    { min: 2,  max: 2,  weight: 9200 }, // 92%
    { min: 3,  max: 3,  weight: 600  }, // 6%
    { min: 4,  max: 5,  weight: 200  }, // 2%
  ],
  // 과일 빙수 (기댓값 ≈ 3.16원)
  fruit: [
    { min: 3,  max: 3,  weight: 9300 }, // 93%
    { min: 4,  max: 5,  weight: 550  }, // 5.5%
    { min: 6,  max: 10, weight: 150  }, // 1.5%
  ],
  // 프리미엄 빙수 (기댓값 ≈ 15.16원, 최소 15원 보장)
  premium: [
    { min: 15, max: 15,  weight: 9750 }, // 97.5%
    { min: 16, max: 18,  weight: 200  }, // 2%
    { min: 19, max: 32,  weight: 40   }, // 0.4%
    { min: 33, max: 150, weight: 10   }, // 0.1%
  ],
  // 특별 빙수 (기댓값 ≈ 26.12원, 최소 25원 보장, 1,000원 잭팟 포함)
  special: [
    { min: 25,  max: 26,   weight: 9880 }, // 98.8%
    { min: 27,  max: 38,   weight: 80   }, // 0.8%
    { min: 39,  max: 80,   weight: 25   }, // 0.25%
    { min: 81,  max: 300,  weight: 10   }, // 0.1%
    { min: 301, max: 1000, weight: 5    }, // 0.05% 🎰 잭팟 (최대 1,000원)
  ],
};

// 티어별 한도 (보상 상/하한 안전장치)
export const TIER_MIN: Record<BingsuTier, number> = {
  classic: 1,
  fruit:   1,
  premium: 15, // 프리미엄 빙수 최소 15원
  special: 25, // 특별 빙수 최소 25원
};

export const TIER_MAX: Record<BingsuTier, number> = {
  classic: 25,
  fruit:   50,
  premium: 150,
  special: 1000, // 1,000원 잭팟 포함
};
