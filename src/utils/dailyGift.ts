// 출석 선물 보상
// 앱인토스 프로모션 정책상 랜덤 보상 불가 — 1원 고정 지급.
// 콘솔에 등록된 BINGSU_DAILY 프로모션도 "고정 금액 1,000원" 한도 내에서
// 실제 지급은 1원으로 항상 동일.
export function generateDailyGift(): number {
  return 1;
}
