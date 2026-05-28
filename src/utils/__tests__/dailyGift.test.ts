import { generateDailyGift } from '../dailyGift';

describe('generateDailyGift — 1원 고정', () => {
  it('모든 호출에서 항상 1원을 반환한다', () => {
    for (let i = 0; i < 10_000; i++) {
      expect(generateDailyGift()).toBe(1);
    }
  });
});
