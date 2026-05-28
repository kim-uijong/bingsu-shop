import { BINGSU_MESSAGES, ARRIVAL_MESSAGES } from '../messages';
import { BINGSU_REACTIONS } from '../reactions';
import { BINGSU_LIST } from '../bingsus';

const FORBIDDEN_WORDS = ['당첨', '추첨', '복권', '꽝', '도박'];

describe('BINGSU_MESSAGES — 150개 메시지 풀', () => {
  it('15종 빙수가 모두 키로 존재해야 한다', () => {
    expect(Object.keys(BINGSU_MESSAGES).length).toBe(15);
    for (const info of BINGSU_LIST) {
      expect(BINGSU_MESSAGES[info.type]).toBeDefined();
    }
  });

  it('각 빙수마다 정확히 10개의 메시지가 있어야 한다', () => {
    for (const info of BINGSU_LIST) {
      expect(BINGSU_MESSAGES[info.type].length).toBe(10);
    }
  });

  it('총 메시지 개수가 정확히 150개여야 한다', () => {
    const total = Object.values(BINGSU_MESSAGES).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    expect(total).toBe(150);
  });

  it('어떤 메시지에도 금지어가 포함되면 안 된다', () => {
    for (const info of BINGSU_LIST) {
      for (const msg of BINGSU_MESSAGES[info.type]) {
        for (const word of FORBIDDEN_WORDS) {
          expect(msg.includes(word)).toBe(false);
        }
      }
    }
  });

  it('빈 메시지가 없어야 한다', () => {
    for (const info of BINGSU_LIST) {
      for (const msg of BINGSU_MESSAGES[info.type]) {
        expect(msg.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('각 빙수 내 10개 메시지는 모두 달라야 한다', () => {
    for (const info of BINGSU_LIST) {
      const set = new Set(BINGSU_MESSAGES[info.type]);
      expect(set.size).toBe(10);
    }
  });
});

describe('ARRIVAL_MESSAGES — 등장 인사 메시지', () => {
  it('15종 빙수가 모두 키로 존재해야 한다', () => {
    expect(Object.keys(ARRIVAL_MESSAGES).length).toBe(15);
    for (const info of BINGSU_LIST) {
      expect(ARRIVAL_MESSAGES[info.type]).toBeDefined();
      expect(ARRIVAL_MESSAGES[info.type].length).toBeGreaterThanOrEqual(1);
    }
  });

  it('등장 메시지에도 금지어가 없어야 한다', () => {
    for (const info of BINGSU_LIST) {
      for (const msg of ARRIVAL_MESSAGES[info.type]) {
        for (const word of FORBIDDEN_WORDS) {
          expect(msg.includes(word)).toBe(false);
        }
      }
    }
  });
});

describe('BINGSU_REACTIONS — 15가지 환호 반응', () => {
  it('15종 빙수가 모두 키로 존재해야 한다', () => {
    expect(Object.keys(BINGSU_REACTIONS).length).toBe(15);
    for (const info of BINGSU_LIST) {
      expect(BINGSU_REACTIONS[info.type]).toBeDefined();
    }
  });

  it('각 반응에 motion, particles, glowColor, label이 모두 있어야 한다', () => {
    for (const info of BINGSU_LIST) {
      const r = BINGSU_REACTIONS[info.type];
      expect(r.motion.length).toBeGreaterThan(0);
      expect(r.particles.length).toBeGreaterThanOrEqual(1);
      expect(r.glowColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(r.label.length).toBeGreaterThan(0);
    }
  });

  it('label과 motion에 금지어가 없어야 한다', () => {
    for (const info of BINGSU_LIST) {
      const r = BINGSU_REACTIONS[info.type];
      for (const word of FORBIDDEN_WORDS) {
        expect(r.label.includes(word)).toBe(false);
        expect(r.motion.includes(word)).toBe(false);
      }
    }
  });
});
