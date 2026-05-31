import { type BingsuTier } from './bingsus';

// 출석 선물은 1원 고정 (앱인토스 정책상 랜덤 보상 불가)
export const DAILY_GIFT_AMOUNT = 1;

// 빙수 티어별 보상 분포
// 2026-05-31 비용 절감: 빙수 1개(광고 10회) 기댓값 10.65원 → 약 5원으로 하향.
//   classic ≈ 2.84 / fruit ≈ 5.33 / premium ≈ 10.59 / special ≈ 18.08
//   전체 = 0.6×2.84 + 0.25×5.33 + 0.10×10.59 + 0.05×18.08 ≈ 5.00원
//   special에 501~1,000원 잭팟 0.1% 포함 → 전체 잭팟 확률 ≈ 1/20,000 (0.005%)
// 가중치는 % × 100 (정수 유지), 각 티어 합 10000.
export interface RewardRange {
  min: number;
  max: number;
  weight: number;
}

export const TIER_REWARD_DISTRIBUTIONS: Record<BingsuTier, RewardRange[]> = {
  // 추억 빙수 (기댓값 ≈ 2.84원)
  classic: [
    { min: 2,  max: 2,  weight: 7500 }, // 75%
    { min: 3,  max: 4,  weight: 1700 }, // 17%
    { min: 5,  max: 9,  weight: 600  }, // 6%
    { min: 10, max: 18, weight: 150  }, // 1.5%
    { min: 19, max: 25, weight: 50   }, // 0.5%
  ],
  // 과일 빙수 (기댓값 ≈ 5.33원)
  fruit: [
    { min: 3,  max: 4,  weight: 6000 }, // 60%
    { min: 5,  max: 6,  weight: 2500 }, // 25%
    { min: 7,  max: 10, weight: 1100 }, // 11%
    { min: 11, max: 25, weight: 300  }, // 3%
    { min: 26, max: 50, weight: 100  }, // 1%
  ],
  // 프리미엄 빙수 (기댓값 ≈ 10.59원)
  premium: [
    { min: 5,  max: 8,   weight: 6000 }, // 60%
    { min: 9,  max: 13,  weight: 2500 }, // 25%
    { min: 14, max: 25,  weight: 1200 }, // 12%
    { min: 26, max: 60,  weight: 250  }, // 2.5%
    { min: 61, max: 150, weight: 50   }, // 0.5%
  ],
  // 특별 빙수 (기댓값 ≈ 18.08원, 1,000원 잭팟 포함)
  special: [
    { min: 6,   max: 12,   weight: 6500 }, // 65%
    { min: 13,  max: 25,   weight: 2500 }, // 25%
    { min: 26,  max: 60,   weight: 700  }, // 7%
    { min: 61,  max: 150,  weight: 260  }, // 2.6%
    { min: 151, max: 500,  weight: 30   }, // 0.3%
    { min: 501, max: 1000, weight: 10   }, // 0.1% 🎰 잭팟 (최대 1,000원)
  ],
};

// 티어별 한도 (보상 상/하한 안전장치)
export const TIER_MIN: Record<BingsuTier, number> = {
  classic: 1,
  fruit:   1,
  premium: 1,
  special: 6, // 특별 빙수 최소 6원 (하향 후)
};

export const TIER_MAX: Record<BingsuTier, number> = {
  classic: 25,
  fruit:   50,
  premium: 150,
  special: 1000, // 1,000원 잭팟 포함
};
