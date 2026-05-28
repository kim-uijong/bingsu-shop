// 한국 표준시(KST = UTC+9) 기준 날짜 문자열 변환
// 한국 사용자가 자정에 리셋되도록
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function formatDateKST(timestampMs: number): string {
  const d = new Date(timestampMs + KST_OFFSET_MS);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function isSameDayKST(tsA: number, tsB: number): boolean {
  return formatDateKST(tsA) === formatDateKST(tsB);
}
