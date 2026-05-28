import { type BingsuType } from './bingsus';

// 15가지 빙수 고유 환호 반응
// motion: 빙수 환호 동작 설명 (애니메이션은 Phase 8)
// particles: 흩날리는 효과 이모지 (정적 표현)
// glowColor: 글로우 색상 (6자리 hex)
// label: 환호 텍스트
export interface BingsuReaction {
  motion: string;
  particles: string[];
  glowColor: string;
  label: string;
}

export const BINGSU_REACTIONS: Record<BingsuType, BingsuReaction> = {
  // 일반 빙수 (6종)
  patbingsu: {
    motion: '팥알이 퐁퐁 튀어요',
    particles: ['❤️', '🫘', '❤️'],
    glowColor: '#FF4444',
    label: '팥알 퐁퐁!',
  },
  injeolmi: {
    motion: '인절미가 쫀득쫀득 흔들려요',
    particles: ['🌾', '🍡', '🌾'],
    glowColor: '#D2A875',
    label: '쫀득쫀득!',
  },
  milk: {
    motion: '우유 거품이 뽀글뽀글 올라와요',
    particles: ['🤍', '🥛', '🤍'],
    glowColor: '#FFF8E7',
    label: '우유 뽀글뽀글!',
  },
  choco: {
    motion: '초코가 진하게 흘러내려요',
    particles: ['🟫', '🍫', '🟫'],
    glowColor: '#5D4037',
    label: '초코 폭발!',
  },
  oreo: {
    motion: '오레오가 바삭하게 부서져요',
    particles: ['🤍', '🍪', '🖤'],
    glowColor: '#2D2D2D',
    label: '바삭바삭!',
  },
  // 과일 빙수 (5종)
  strawberry: {
    motion: '딸기 하트 모양이 그려져요',
    particles: ['💖', '🍓', '💖'],
    glowColor: '#FF6B9D',
    label: '딸기 하트!',
  },
  melon: {
    motion: '메론이 시원하게 빛나요',
    particles: ['💚', '🍈', '💚'],
    glowColor: '#90EE90',
    label: '메론 향긋!',
  },
  mango: {
    motion: '망고가 황금빛을 발산해요',
    particles: ['🧡', '🥭', '🧡'],
    glowColor: '#FF8C00',
    label: '황금빛 망고!',
  },
  peach: {
    motion: '복숭아가 빙글빙글 돌아요',
    particles: ['🩷', '🍑', '🩷'],
    glowColor: '#FFB6C1',
    label: '복숭아 빙글빙글!',
  },
  blueberry: {
    motion: '블루베리가 통통 튀어요',
    particles: ['💜', '🫐', '💜'],
    glowColor: '#9B7EDE',
    label: '블루베리 통통!',
  },
  // 프리미엄 빙수 (3종)
  matcha: {
    motion: '말차가 소용돌이쳐요',
    particles: ['💚', '🍵', '💚'],
    glowColor: '#4CAF50',
    label: '말차 소용돌이!',
  },
  heukimja: {
    motion: '흑임자가 반짝반짝 빛나요',
    particles: ['🖤', '✨', '🖤'],
    glowColor: '#424242',
    label: '흑임자 반짝!',
  },
  fruitoverflow: {
    motion: '과일이 화려하게 쏟아져요',
    particles: ['🍓', '🥭', '🫐'],
    glowColor: '#FF6B9D',
    label: '과일 풍성!',
  },
  // 특별 빙수 (2종)
  golden: {
    motion: '황금빛이 폭발하고 왕관이 빛나요',
    particles: ['✨', '👑', '✨'],
    glowColor: '#FFD700',
    label: '✨ 황금 폭발!',
  },
  rainbow: {
    motion: '7색이 폭발하며 점프해요',
    particles: ['🌈', '✨', '🌈'],
    glowColor: '#FF6B9D',
    label: '🌈 무지개 폭발!',
  },
};
