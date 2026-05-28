import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { type BingsuType } from '../constants/bingsus';

interface Props {
  type: BingsuType;
  count?: number;
  fallHeight?: number;
}

// 빙수 종류별 토핑 이모지 (3가지 랜덤 사용)
const TOPPING_EMOJIS: Record<BingsuType, string[]> = {
  // 일반 빙수
  patbingsu:  ['🫘', '🟤', '💧'],
  injeolmi:   ['🍡', '🌾', '🟫'],
  milk:       ['🥛', '🤍', '💧'],
  choco:      ['🍫', '🟫', '🤎'],
  oreo:       ['🍪', '🖤', '🤍'],
  // 과일 빙수
  strawberry: ['🍓', '🩷', '❤️'],
  melon:      ['🍈', '💚', '🟢'],
  mango:      ['🥭', '🧡', '💛'],
  peach:      ['🍑', '🩷', '💧'],
  blueberry:  ['🫐', '💜', '💧'],
  // 프리미엄
  matcha:     ['🍵', '💚', '🟢'],
  heukimja:   ['⚫', '🖤', '💛'],
  fruitoverflow: ['🍓', '🥭', '🫐'],
  // 특별
  golden:     ['👑', '✨', '💛'],
  rainbow:    ['🌈', '✨', '🩷'],
};

export function SyrupDrops({ type, count = 10, fallHeight }: Props) {
  const screenWidth = Dimensions.get('window').width;
  const height = fallHeight ?? 280;
  const emojis = TOPPING_EMOJIS[type];

  return (
    <View style={[styles.container, { height }]} pointerEvents="none">
      {Array.from({ length: count }).map((_, idx) => (
        <Drop
          key={idx}
          startX={(idx * screenWidth) / count + (idx % 2) * 16}
          emoji={emojis[idx % emojis.length]!}
          delay={idx * 160}
          duration={900 + (idx % 4) * 150}
          height={height}
        />
      ))}
    </View>
  );
}

interface DropProps {
  startX: number;
  emoji: string;
  delay: number;
  duration: number;
  height: number;
}

function Drop({ startX, emoji, delay, duration, height }: DropProps) {
  const y = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const cycle = Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: height,
          duration,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]);

    const loop = Animated.loop(
      Animated.sequence([
        cycle,
        Animated.parallel([
          Animated.timing(y, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.8, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );

    const timer = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, [y, opacity, scale, duration, height]);

  return (
    <Animated.Text
      style={[
        styles.drop,
        {
          left: startX,
          opacity,
          transform: [{ translateY: y }, { scale }],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  drop: {
    position: 'absolute',
    top: 0,
    fontSize: 20,
  },
});
