import { type BingsuTier } from './bingsus';

// 출석 선물은 1원 고정 (앱인토스 정책상 랜덤 보상 불가)
export const DAILY_GIFT_AMOUNT = 1;

// 빙수 티어별 보상 분포 (BM_DESIGN.md 표 그대로)
// 가중치는 % × 100 (정수 유지)
export interface RewardRange {
  min: number;
  max: number;
  weight: number;
}

export const TIER_REWARD_DISTRIBUTIONS: Record<BingsuTier, RewardRange[]> = {
  // 추억 빙수 (기댓값 5.57원)
  classic: [
    { min: 5,  max: 5,  weight: 8500 }, // 85%
    { min: 6,  max: 10, weight: 800  }, // 8%
    { min: 7,  max: 10, weight: 500  }, // 5%
    { min: 11, max: 20, weight: 150  }, // 1.5%
    { min: 21, max: 50, weight: 50   }, // 0.5%
  ],
  // 과일 빙수 (기댓값 10.47원)
  fruit: [
    { min: 6,  max: 8,   weight: 6000 }, // 60%
    { min: 9,  max: 12,  weight: 2500 }, // 25%
    { min: 13, max: 20,  weight: 1100 }, // 11%
    { min: 21, max: 50,  weight: 300  }, // 3%
    { min: 51, max: 100, weight: 100  }, // 1%
  ],
  // 프리미엄 빙수 (기댓값 21.33원)
  premium: [
    { min: 10,  max: 15,  weight: 6000 }, // 60%
    { min: 16,  max: 25,  weight: 2500 }, // 25%
    { min: 26,  max: 50,  weight: 1200 }, // 12%
    { min: 51,  max: 150, weight: 250  }, // 2.5%
    { min: 151, max: 500, weight: 50   }, // 0.5%
  ],
  // 특별 빙수 (기댓값 51.18원, 최소 16원)
  special: [
    { min: 16,  max: 30,   weight: 6500 }, // 65%
    { min: 31,  max: 80,   weight: 2500 }, // 25%
    { min: 81,  max: 200,  weight: 700  }, // 7%
    { min: 201, max: 500,  weight: 250  }, // 2.5%
    { min: 501, max: 1000, weight: 50   }, // 0.5%
  ],
};

// 티어별 한도 (보상 상/하한 안전장치)
export const TIER_MIN: Record<BingsuTier, number> = {
  classic: 1,
  fruit:   1,
  premium: 1,
  special: 16, // 특별 빙수는 절대 16원 미만 X
};

export const TIER_MAX: Record<BingsuTier, number> = {
  classic: 50,
  fruit:   100,
  premium: 500,
  special: 1000,
};
