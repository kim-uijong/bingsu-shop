export type BingsuTier = 'classic' | 'fruit' | 'premium' | 'special';

export type BingsuType =
  // 일반 (classic) - 5종 각 12%
  | 'patbingsu'
  | 'injeolmi'
  | 'milk'
  | 'choco'
  | 'oreo'
  // 과일 (fruit) - 5종 각 5%
  | 'strawberry'
  | 'melon'
  | 'mango'
  | 'peach'
  | 'blueberry'
  // 프리미엄 (premium) - 3종 각 약 3.33%
  | 'matcha'
  | 'heukimja'
  | 'fruitoverflow'
  // 특별 (special) - 2종 각 2.5%
  | 'golden'
  | 'rainbow';

export interface BingsuInfo {
  type: BingsuType;
  tier: BingsuTier;
  name: string;
  emoji: string;
}

export const BINGSU_LIST: BingsuInfo[] = [
  // 일반 빙수 (60%) - 5종 각 12%
  { type: 'patbingsu', tier: 'classic', name: '팥빙수',     emoji: '🫘' },
  { type: 'injeolmi',  tier: 'classic', name: '인절미빙수', emoji: '🍡' },
  { type: 'milk',      tier: 'classic', name: '우유빙수',   emoji: '🥛' },
  { type: 'choco',     tier: 'classic', name: '초코빙수',   emoji: '🍫' },
  { type: 'oreo',      tier: 'classic', name: '오레오빙수', emoji: '🍪' },
  // 과일 빙수 (25%) - 5종 각 5%
  { type: 'strawberry', tier: 'fruit', name: '딸기빙수',     emoji: '🍓' },
  { type: 'melon',      tier: 'fruit', name: '메론빙수',     emoji: '🍈' },
  { type: 'mango',      tier: 'fruit', name: '망고빙수',     emoji: '🥭' },
  { type: 'peach',      tier: 'fruit', name: '복숭아빙수',   emoji: '🍑' },
  { type: 'blueberry',  tier: 'fruit', name: '블루베리빙수', emoji: '🫐' },
  // 프리미엄 빙수 (10%) - 3종 각 약 3.33%
  { type: 'matcha',        tier: 'premium', name: '말차빙수',       emoji: '🍵' },
  { type: 'heukimja',      tier: 'premium', name: '흑임자빙수',     emoji: '🖤' },
  { type: 'fruitoverflow', tier: 'premium', name: '과일 듬뿍 빙수', emoji: '🍓' },
  // 특별 빙수 (5%) - 2종 각 2.5%
  { type: 'golden',  tier: 'special', name: '황금빙수',   emoji: '👑' },
  { type: 'rainbow', tier: 'special', name: '무지개빙수', emoji: '🌈' },
];

export const TIER_LABELS: Record<BingsuTier, string> = {
  classic: '🍧 일반 빙수',
  fruit:   '🍓 과일 빙수',
  premium: '✨ 프리미엄 빙수',
  special: '🌟 특별 빙수',
};

export const TIER_WEIGHTS = [
  { value: 'classic' as BingsuTier, weight: 60 },
  { value: 'fruit'   as BingsuTier, weight: 25 },
  { value: 'premium' as BingsuTier, weight: 10 },
  { value: 'special' as BingsuTier, weight: 5  },
];

export const SYRUP_COLORS: Record<BingsuTier, string[]> = {
  classic: ['#FF4444', '#FFFBE6', '#FFD700', '#8B4513', '#F5F5DC'],
  fruit:   ['#FF9EBC', '#C778E3', '#8B1A5E', '#FF8C00', '#9ACD32'],
  premium: ['#4CAF50', '#212121', '#FF8C00'],
  special: ['rainbow', '#FFD700'],
};

/**
 * 각 빙수 일러스트 PNG의 박스 배경색.
 * 화면 배경에 그대로 깔아 일러스트 박스의 사각 경계가 안 보이게 함.
 * (PNG에서 직접 추출한 값 — 빙수 교체 시 같이 갱신)
 */
export const ILLUSTRATION_BG: Record<BingsuType, string> = {
  patbingsu:     '#E6F8FC',
  injeolmi:      '#E5F7FB',
  milk:          '#C7EBFB',
  choco:         '#C6EAFA',
  oreo:          '#C8E9FC',
  strawberry:    '#C5E4F6',
  melon:         '#B7E1D5',
  mango:         '#E2F4FE',
  peach:         '#FAC5B3',
  blueberry:     '#CFC3E7',
  matcha:        '#CEC0E4',
  heukimja:      '#CFBDE7',
  fruitoverflow: '#CEBCE4',
  golden:        '#FCF3D6',
  rainbow:       '#CEB8E6',
};

/** 진행 중인 빙수가 없을 때(메인/완료 화면 등)의 기본 배경색 */
export const BG_DEFAULT = '#EAF6FC';

/**
 * 그릇 일러스트(empty-bowl, iced-bowl-1, iced-bowl-2)의 배경색.
 * 빈 그릇 / 얼음 갈기 / 토핑 단계 화면에서 SafeAreaView 배경으로 깔아
 * 일러스트 박스의 사각 경계가 사라지게 함. (PNG 좌상단 평균에서 추출)
 */
export const BOWL_ILLUSTRATION_BG = '#B7E3FD';
