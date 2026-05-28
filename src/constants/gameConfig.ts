import type { BingsuTier } from './bingsus';

/**
 * 게임 진행 상수
 *
 * 광고 10개 = 빙수 1그릇 (얼음 5 + 토핑 5).
 * CLAUDE.md 핵심 변경 금지 규칙.
 */
export const STEPS_PER_STAGE = 5;

/**
 * 테스트용 강제 티어 풀.
 * null: 정상 가중치(60/25/10/5)로 픽
 * 배열: 해당 티어들 중에서만 균등 픽 (테스트 빌드 전용)
 *
 * 운영 출시 = null (BM_DESIGN.md 분포 그대로).
 */
export const FORCED_TIER_POOL: BingsuTier[] | null = null;
