import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { BINGSU_LIST, type BingsuType } from '../constants/bingsus';

export type BingsuState = 'empty' | 'ice' | 'topping' | 'complete';

// GitHub raw 호스팅 (granite는 로컬 require 미지원 — URL 방식 필수)
const ASSET_BASE = 'https://raw.githubusercontent.com/kim-uijong/bingsu-asset/main';

// 15종 빙수 일러스트 URL
const BINGSU_URLS: Record<BingsuType, string> = {
  patbingsu:     `${ASSET_BASE}/patbingsu.png`,
  injeolmi:      `${ASSET_BASE}/injeolmi.png`,
  milk:          `${ASSET_BASE}/milk.png`,
  choco:         `${ASSET_BASE}/choco.png`,
  oreo:          `${ASSET_BASE}/oreo.png`,
  strawberry:    `${ASSET_BASE}/strawberry.png`,
  melon:         `${ASSET_BASE}/melon.png`,
  mango:         `${ASSET_BASE}/mango.png`,
  peach:         `${ASSET_BASE}/peach.png`,
  blueberry:     `${ASSET_BASE}/blueberry.png`,
  matcha:        `${ASSET_BASE}/matcha.png`,
  heukimja:      `${ASSET_BASE}/heukimja.png`,
  fruitoverflow: `${ASSET_BASE}/fruitoverflow.png`,
  golden:        `${ASSET_BASE}/golden.png`,
  rainbow:       `${ASSET_BASE}/rainbow.png`,
};

// 그릇 상태 단계별 URL
const EMPTY_BOWL_URL = `${ASSET_BASE}/empty-bowl.png`;
const ICED_BOWL_PILED_URL = `${ASSET_BASE}/iced-bowl-1.png`;   // 얼음 소복히 쌓인 (토핑 단계)
const ICED_BOWL_GRINDING_URL = `${ASSET_BASE}/iced-bowl-2.png`; // 얼음 갈리는 중 (그라인더)

interface Props {
  type: BingsuType;
  state: BingsuState;
  size?: number;
  showLabel?: boolean;
}

export function BingsuDisplay({ type, state, size = 260, showLabel = false }: Props) {
  const info = BINGSU_LIST.find(b => b.type === type);
  const yOffset = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [imgError, setImgError] = useState<string | null>(null);

  // 상태별 애니메이션 (모두 0.3초 이하)
  useEffect(() => {
    yOffset.stopAnimation();
    scale.stopAnimation();
    yOffset.setValue(0);
    scale.setValue(1);

    let loopAnim: Animated.CompositeAnimation;
    if (state === 'complete') {
      // 완성: 점프 + 살짝 커짐 반복
      loopAnim = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(yOffset, {
              toValue: -10,
              duration: 250,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(yOffset, {
              toValue: 0,
              duration: 250,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.06,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    } else {
      // 진행 중: 살짝 들썩들썩
      loopAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(yOffset, {
            toValue: -3,
            duration: 280,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(yOffset, {
            toValue: 0,
            duration: 280,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    }
    loopAnim.start();
    // 언마운트/상태 변경 시 애니메이션 정리 (메모리 누수 방지)
    return () => {
      loopAnim.stop();
      yOffset.stopAnimation();
      scale.stopAnimation();
    };
  }, [state, yOffset, scale]);

  if (!info) return null;

  // 상태에 따라 이미지 URL 선택
  // empty: 빈 그릇 / ice: 얼음 갈리는 중(그라인더) / topping: 얼음 쌓인 그릇 / complete: 빙수 완성
  let uri: string;
  switch (state) {
    case 'empty':
      uri = EMPTY_BOWL_URL;
      break;
    case 'ice':
      uri = ICED_BOWL_GRINDING_URL;
      break;
    case 'topping':
      uri = ICED_BOWL_PILED_URL;
      break;
    case 'complete':
    default:
      uri = BINGSU_URLS[type];
      break;
  }

  const expression: Record<BingsuState, string> = {
    empty:    '기대 중',
    ice:      '얼음 가득',
    topping:  '토핑 중',
    complete: '완성!',
  };

  // complete 상태 변형(scale 1.06 + translateY -10dp) 시 가장자리 콘텐츠가 잘리지 않도록
  // 무지개 빙수 완성 화면에서만 안전 여유 인셋 적용. size의 약 10% 정도면 충분.
  const inset = state === 'complete' && type === 'rainbow' ? Math.round(size * 0.1) : 0;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {imgError ? (
        <View style={[styles.errorBox, { width: size, height: size }]}>
          <Text style={styles.errorText}>🖼️ 이미지 로드 실패</Text>
          <Text style={styles.errorSub}>{imgError}</Text>
        </View>
      ) : (
        // Animated.Image 직접 사용 + 명시 dp 크기 + contain.
        // rainbow PNG는 7색 시럽이 캔버스 위/아래 가장자리에 거의 닿게 그려져 있어
        // complete 상태의 scale(1.06) + translateY(-10dp) 변형 시 잘려 보임 → 무지개만
        // 안전 여유 inset을 두어 박스 안에 머물도록 함. 다른 빙수는 콘텐츠 여백이
        // 충분해 크기 유지.
        <Animated.Image
          source={{ uri }}
          style={{
            width: size - inset,
            height: size - inset,
            transform: [{ translateY: yOffset }, { scale }],
          }}
          resizeMode="contain"
          onError={(e) => {
            const msg = e?.nativeEvent?.error ?? 'unknown';
            setImgError(String(msg).slice(0, 60));
          }}
        />
      )}
      {showLabel && <Text style={styles.expression}>{expression[state]}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  expression: {
    fontSize: 14,
    color: '#888',
    marginTop: 6,
  },
  errorBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#E65100',
    fontWeight: '600',
  },
  errorSub: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
});
