import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { type BingsuTier } from '../constants/bingsus';

interface Props {
  tier: BingsuTier;
  glowColor: string;
}

const SPARKLE_EMOJIS = ['✨', '⭐', '💫', '✦', '✨'];

export function SparkleEffect({ tier, glowColor }: Props) {
  const screenWidth = Dimensions.get('window').width;
  const isSpecial = tier === 'special';
  const count = isSpecial ? 14 : 8;

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: count }).map((_, idx) => (
        <Sparkle
          key={idx}
          startX={(idx * screenWidth) / count}
          emoji={SPARKLE_EMOJIS[idx % SPARKLE_EMOJIS.length]!}
          delay={idx * 80}
          isSpecial={isSpecial}
          color={glowColor}
        />
      ))}
    </View>
  );
}

interface SparkleProps {
  startX: number;
  emoji: string;
  delay: number;
  isSpecial: boolean;
  color: string;
}

function Sparkle({ startX, emoji, delay, isSpecial, color }: SparkleProps) {
  const y = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const cycle = Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: isSpecial ? 1.6 : 1.2,
          duration: 250,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
        Animated.timing(scale, { toValue: 0.4, duration: 150, useNativeDriver: true }),
      ]),
      Animated.timing(y, {
        toValue: -30,
        duration: 350,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    const loop = Animated.loop(
      Animated.sequence([
        cycle,
        Animated.parallel([
          Animated.timing(y, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );

    const timer = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, [y, opacity, scale, isSpecial]);

  return (
    <Animated.Text
      style={[
        styles.sparkle,
        {
          left: startX,
          color,
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
    bottom: 0,
    overflow: 'hidden',
  },
  sparkle: {
    position: 'absolute',
    top: '50%',
    fontSize: 22,
  },
});
