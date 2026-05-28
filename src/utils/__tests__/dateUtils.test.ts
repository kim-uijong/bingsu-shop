import { formatDateKST, isSameDayKST } from '../dateUtils';

describe('formatDateKST', () => {
  it('YYYY-MM-DD 형식으로 반환해야 한다', () => {
    const result = formatDateKST(Date.UTC(2026, 4, 18, 0, 0, 0));
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('UTC 자정은 KST 오전 9시 → 같은 날 18일이어야 한다', () => {
    // 2026-05-18 00:00 UTC = 2026-05-18 09:00 KST
    const ts = Date.UTC(2026, 4, 18, 0, 0, 0);
    expect(formatDateKST(ts)).toBe('2026-05-18');
  });

  it('UTC 15시는 KST 자정 → 다음 날로 넘어가야 한다', () => {
    // 2026-05-17 15:00 UTC = 2026-05-18 00:00 KST
    const ts = Date.UTC(2026, 4, 17, 15, 0, 0);
    expect(formatDateKST(ts)).toBe('2026-05-18');
  });

  it('UTC 14:59는 KST 23:59 → 17일 (KST 자정 직전)', () => {
    const ts = Date.UTC(2026, 4, 17, 14, 59, 0);
    expect(formatDateKST(ts)).toBe('2026-05-17');
  });

  it('월말/연말 처리: 12월 31일 자정 KST', () => {
    // 2025-12-31 15:00 UTC = 2026-01-01 00:00 KST
    const ts = Date.UTC(2025, 11, 31, 15, 0, 0);
    expect(formatDateKST(ts)).toBe('2026-01-01');
  });
});

describe('isSameDayKST', () => {
  it('같은 KST 날짜면 true', () => {
    const a = Date.UTC(2026, 4, 18, 0, 0, 0);  // 18일 09:00 KST
    const b = Date.UTC(2026, 4, 18, 12, 0, 0); // 18일 21:00 KST
    expect(isSameDayKST(a, b)).toBe(true);
  });

  it('KST 자정 경계에서 다른 날 판정', () => {
    const before = Date.UTC(2026, 4, 17, 14, 59, 0); // 17일 23:59 KST
    const after  = Date.UTC(2026, 4, 17, 15, 0, 0);  // 18일 00:00 KST
    expect(isSameDayKST(before, after)).toBe(false);
  });
});
