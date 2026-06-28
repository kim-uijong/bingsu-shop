import { type BingsuTier } from './bingsus';

// 출석 선물은 1원 고정 (앱인토스 정책상 랜덤 보상 불가)
export const DAILY_GIFT_AMOUNT = 1;
export const DAILY_GIFT_LIMIT = 5;                  // 하루 출석 선물 횟수
export const GIFT_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 출석 사이 쿨타임 2시간(페이싱·리텐션)

// 빙수 티어별 보상 분포
// 2026-06-11 eCPM 하락(1,500→800)으로 전체 기댓값 8 → 6.5원으로 하향. 티어 확률(60/25/10/5)은 유지.
//   classic ≈ 3.92 / fruit ≈ 4.99 / premium ≈ 15.66 / special ≈ 27.23
//   전체 = 0.6×3.92 + 0.25×4.99 + 0.10×15.66 + 0.05×27.23 ≈ 6.52원
//   premium 최소 15원 / special 최소 25원 유지. special 301~1,000원 잭팟 0.1%(≈1/20,000) 유지.
// 가중치는 % × 100 (정수 유지), 각 티어 합 10000.
export interface RewardRange {
  min: number;
  max: number;
  weight: number;
}

export const TIER_REWARD_DISTRIBUTIONS: Record<BingsuTier, RewardRange[]> = {
  // 추억 빙수 (기댓값 ≈ 3.92원) — 저액 비중↑
  classic: [
    { min: 2,  max: 2,  weight: 4000 }, // 40%
    { min: 3,  max: 3,  weight: 2500 }, // 25%
    { min: 4,  max: 5,  weight: 2100 }, // 21%
    { min: 6,  max: 10, weight: 1100 }, // 11%
    { min: 11, max: 25, weight: 300  }, // 3%
  ],
  // 과일 빙수 (기댓값 ≈ 4.99원)
  fruit: [
    { min: 3,  max: 3,  weight: 5800 }, // 58%
    { min: 4,  max: 5,  weight: 2600 }, // 26%
    { min: 6,  max: 10, weight: 1100 }, // 11%
    { min: 11, max: 25, weight: 350  }, // 3.5%
    { min: 26, max: 50, weight: 150  }, // 1.5%
  ],
  // 프리미엄 빙수 (기댓값 ≈ 15.66원, 최소 15원 보장)
  premium: [
    { min: 15, max: 15,  weight: 9000 }, // 90%
    { min: 16, max: 18,  weight: 850  }, // 8.5%
    { min: 19, max: 32,  weight: 100  }, // 1%
    { min: 33, max: 150, weight: 50   }, // 0.5%
  ],
  // 특별 빙수 (기댓값 ≈ 27.23원, 최소 25원 보장, 1,000원 잭팟 포함)
  special: [
    { min: 25,  max: 26,   weight: 9400 }, // 94%
    { min: 27,  max: 38,   weight: 480  }, // 4.8%
    { min: 39,  max: 80,   weight: 80   }, // 0.8%
    { min: 81,  max: 300,  weight: 30   }, // 0.3%
    { min: 301, max: 1000, weight: 10   }, // 0.1% 🎰 잭팟 (최대 1,000원)
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
