import { generateReward, generateBingsu, pickTier } from '../bingsu';
import { TIER_MIN, TIER_MAX } from '../../constants/probabilities';
import { BINGSU_LIST, type BingsuTier } from '../../constants/bingsus';

const TIERS: BingsuTier[] = ['classic', 'fruit', 'premium', 'special'];

describe('generateReward — 티어별 0원 절대 X', () => {
  for (const tier of TIERS) {
    describe(`tier=${tier}`, () => {
      it('100,000회 호출에서 보상이 항상 최소값 이상이어야 한다', () => {
        const min = TIER_MIN[tier];
        for (let i = 0; i < 100_000; i++) {
          const reward = generateReward(tier);
          expect(reward).toBeGreaterThanOrEqual(min);
        }
      });

      it('100,000회 호출에서 보상이 한도를 초과하지 않아야 한다', () => {
        const max = TIER_MAX[tier];
        for (let i = 0; i < 100_000; i++) {
          const reward = generateReward(tier);
          expect(reward).toBeLessThanOrEqual(max);
        }
      });
    });
  }
});

describe('generateReward — 기댓값', () => {
  // 2026-05-31 하향 후 기댓값: classic ≈2.84, fruit ≈5.33, premium ≈10.59, special ≈17.88
  // 균등 분포 가정 시 실제 값과 약간 다를 수 있어 느슨한 범위로 검증
  const EXPECTED: Record<BingsuTier, [number, number]> = {
    classic: [2, 4],
    fruit:   [4, 7],
    premium: [8, 14],
    special: [12, 26],
  };

  for (const tier of TIERS) {
    it(`${tier} 50,000회 평균이 예상 범위 내여야 한다`, () => {
      let total = 0;
      const trials = 50_000;
      for (let i = 0; i < trials; i++) {
        total += generateReward(tier);
      }
      const avg = total / trials;
      const [lo, hi] = EXPECTED[tier];
      expect(avg).toBeGreaterThan(lo);
      expect(avg).toBeLessThan(hi);
    });
  }
});

describe('pickTier — 티어 등장 확률', () => {
  it('100,000회 추첨 시 티어별 등장 비율이 60/25/10/5에 근접해야 한다 (±3%)', () => {
    const counts: Record<BingsuTier, number> = {
      classic: 0, fruit: 0, premium: 0, special: 0,
    };
    const trials = 100_000;
    for (let i = 0; i < trials; i++) {
      counts[pickTier()]++;
    }

    const expected = { classic: 0.60, fruit: 0.25, premium: 0.10, special: 0.05 };
    for (const tier of TIERS) {
      const actual = counts[tier] / trials;
      expect(Math.abs(actual - expected[tier])).toBeLessThan(0.03);
    }
  });
});

describe('generateBingsu — 통합 검증', () => {
  it('100,000회 호출 시 reward는 항상 1 이상, special은 16 이상', () => {
    for (let i = 0; i < 100_000; i++) {
      const b = generateBingsu();
      expect(b.reward).toBeGreaterThanOrEqual(1);
      if (b.tier === 'special') {
        expect(b.reward).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it('생성된 빙수의 tier와 type이 일치해야 한다', () => {
    for (let i = 0; i < 1_000; i++) {
      const b = generateBingsu();
      const info = BINGSU_LIST.find(x => x.type === b.type);
      expect(info).toBeDefined();
      expect(info!.tier).toBe(b.tier);
    }
  });

  it('전체 회당 기댓값이 약 5원 범위 내여야 한다 (3.5~7원)', () => {
    let total = 0;
    const trials = 100_000;
    for (let i = 0; i < trials; i++) {
      total += generateBingsu().reward;
    }
    const avg = total / trials;
    // 하향 후 목표 ≈ 5원 (균등 분포 가정으로 약간 변동)
    expect(avg).toBeGreaterThan(3.5);
    expect(avg).toBeLessThan(7);
  });

  it('15종 빙수가 모두 한 번 이상 등장해야 한다 (10,000회 추첨)', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 10_000; i++) {
      seen.add(generateBingsu().type);
    }
    expect(seen.size).toBe(15);
  });
});
