import { type BingsuTier } from './bingsus';

// 앱인토스 콘솔에 등록된 프로모션 코드 (2개 체계, 콘솔 발급 UUID)
//  - 출석 선물            : 01KSJ2V479R2YNP28E0P9HA12T (1원 고정 지급)
//  - 빙수 완성 보상 (4티어): 01KSJ2WM07EEAR71HBXE3WT7XD (한도 1,000원, 변동 지급)
// 빙수 한도는 단일하지만 실제 지급 금액은 티어별 BM 분포(generateReward)에 따라
// 변동되어 평균 10.65원 수준을 유지함.
export const PROMOTION_CODES: Record<'daily' | BingsuTier, string> = {
  daily:   '01KSJ2V479R2YNP28E0P9HA12T',
  classic: '01KSJ2WM07EEAR71HBXE3WT7XD',
  fruit:   '01KSJ2WM07EEAR71HBXE3WT7XD',
  premium: '01KSJ2WM07EEAR71HBXE3WT7XD',
  special: '01KSJ2WM07EEAR71HBXE3WT7XD',
};
