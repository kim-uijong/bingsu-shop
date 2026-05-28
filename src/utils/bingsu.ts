import { weightedRandom, randomInt, pickRandom } from './random';
import {
  BINGSU_LIST,
  TIER_WEIGHTS,
  SYRUP_COLORS,
  type BingsuTier,
  type BingsuType,
} from '../constants/bingsus';
import {
  TIER_REWARD_DISTRIBUTIONS,
  TIER_MIN,
  TIER_MAX,
} from '../constants/probabilities';
import { BINGSU_MESSAGES, ARRIVAL_MESSAGES } from '../constants/messages';
import { FORCED_TIER_POOL } from '../constants/gameConfig';
import { type CurrentBingsu } from '../hooks/useGameState';

export function generateReward(tier: BingsuTier): number {
  const ranges = TIER_REWARD_DISTRIBUTIONS[tier];
  const range = weightedRandom(
    ranges.map(r => ({ value: r, weight: r.weight }))
  );
  let amount = randomInt(range.min, range.max);

  // 안전장치 — 0원 절대 X, 티어별 최소/최대 보장
  const min = TIER_MIN[tier];
  const max = TIER_MAX[tier];
  if (amount < min) amount = min;
  if (amount > max) amount = max;

  return amount;
}

export function pickTier(): BingsuTier {
  // 테스트 빌드용: 특정 티어 풀로 제한
  if (FORCED_TIER_POOL && FORCED_TIER_POOL.length > 0) {
    return pickRandom(FORCED_TIER_POOL);
  }
  return weightedRandom(TIER_WEIGHTS);
}

export function getRandomArrivalMessage(type: BingsuType): string {
  return pickRandom(ARRIVAL_MESSAGES[type]);
}

export function getRandomCheerMessage(type: BingsuType): string {
  return pickRandom(BINGSU_MESSAGES[type]);
}

/** 빙수 grant 중복 방지용 클라이언트 ID 생성 — UUID 라이브러리 의존성 없이 충돌 거의 X */
function generateGrantClientId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function generateBingsu(): CurrentBingsu {
  const tier: BingsuTier = pickTier();
  const candidates = BINGSU_LIST.filter(b => b.tier === tier);
  const bingsu = pickRandom(candidates);
  const syrupColor = pickRandom(SYRUP_COLORS[tier]);
  const reward = generateReward(tier);

  return {
    type: bingsu.type,
    tier,
    syrupColor,
    message: getRandomArrivalMessage(bingsu.type), // 등장 메시지
    reward,
    grantClientId: generateGrantClientId(),
  };
}
