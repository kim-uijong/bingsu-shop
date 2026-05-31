import { type BingsuTier } from './bingsus';

// 출석 선물은 1원 고정 (앱인토스 정책상 랜덤 보상 불가)
export const DAILY_GIFT_AMOUNT = 1;

// 빙수 티어별 보상 분포
// 2026-06-01 상위 티어 floor 인상: 황금/무지개(특별) 뽑고 10원이면 실망 → 바닥을 올림.
//   premium 최소 15원 / special 최소 25원 보장. 전체 기댓값은 약 5.5원으로 소폭 상향.
//   대신 흔한 빙수(classic·fruit)를 낮춰 전체 비용을 맞춤.
//   classic ≈ 2.35 / fruit ≈ 4.33 / premium ≈ 16.2 / special ≈ 28.5
//   전체 = 0.6×2.35 + 0.25×4.33 + 0.10×16.2 + 0.05×28.5 ≈ 5.54원
//   special에 301~1,000원 잭팟 0.1% 포함 → 전체 잭팟 확률 ≈ 1/20,000 (0.005%)
// 가중치는 % × 100 (정수 유지), 각 티어 합 10000.
export interface RewardRange {
  min: number;
  max: number;
  weight: number;
}

export const TIER_REWARD_DISTRIBUTIONS: Record<BingsuTier, RewardRange[]> = {
  // 추억 빙수 (기댓값 ≈ 2.35원)
  classic: [
    { min: 2,  max: 2,  weight: 9000 }, // 90%
    { min: 3,  max: 5,  weight: 800  }, // 8%
    { min: 6,  max: 12, weight: 150  }, // 1.5%
    { min: 13, max: 25, weight: 50   }, // 0.5%
  ],
  // 과일 빙수 (기댓값 ≈ 4.33원)
  fruit: [
    { min: 3,  max: 3,  weight: 6500 }, // 65%
    { min: 4,  max: 5,  weight: 2500 }, // 25%
    { min: 6,  max: 10, weight: 800  }, // 8%
    { min: 11, max: 50, weight: 200  }, // 2%
  ],
  // 프리미엄 빙수 (기댓값 ≈ 16.2원, 최소 15원 보장)
  premium: [
    { min: 15, max: 15,  weight: 8200 }, // 82%
    { min: 16, max: 18,  weight: 1400 }, // 14%
    { min: 19, max: 32,  weight: 320  }, // 3.2%
    { min: 33, max: 150, weight: 80   }, // 0.8%
  ],
  // 특별 빙수 (기댓값 ≈ 28.5원, 최소 25원 보장, 1,000원 잭팟 포함)
  special: [
    { min: 25,  max: 26,   weight: 8500 }, // 85%
    { min: 27,  max: 38,   weight: 1200 }, // 12%
    { min: 39,  max: 80,   weight: 250  }, // 2.5%
    { min: 81,  max: 300,  weight: 40   }, // 0.4%
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
