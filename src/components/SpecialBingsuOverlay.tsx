import React, { useEffect, useRef, type ReactNode } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { type BingsuType } from '../constants/bingsus';

interface Props {
  type: BingsuType;
  children: ReactNode;
}

// rainbow/golden 등장 시 화면 흔들림 + 황금빛 폭발 (CLAUDE.md 허용)
export function SpecialBingsuOverlay({ type, children }: Props) {
  const isSpecial = type === 'rainbow' || type === 'golden';
  const shake = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isSpecial) return;

    // 한 번만 폭발 + 진동 (반복 X)
    Animated.parallel([
      // 화면 진동 — 좌우 살짝
      Animated.sequence([
        Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 4, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -4, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]),
      // 빛 폭발 (페이드 인 → 아웃)
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 0.6,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 600,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [isSpecial, shake, flashOpacity]);

  if (!isSpecial) {
    return <>{children}</>;
  }

  const flashColor = type === 'rainbow' ? '#FF6B9D' : '#FFD700';

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateX: shake }] }]}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.flash,
          { backgroundColor: flashColor, opacity: flashOpacity },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
