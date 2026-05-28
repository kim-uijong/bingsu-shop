import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

interface Props {
  count?: number;
  fallHeight?: number;
}

const FLAKES = ['❄️', '🧊', '❄️', '✦', '❄️'];

export function IceParticles({ count = 12, fallHeight }: Props) {
  const screenWidth = Dimensions.get('window').width;
  const height = fallHeight ?? 280;

  return (
    <View style={[styles.container, { height }]} pointerEvents="none">
      {Array.from({ length: count }).map((_, idx) => (
        <Flake
          key={idx}
          startX={(idx * screenWidth) / count + (idx % 2) * 8}
          emoji={FLAKES[idx % FLAKES.length]!}
          delay={idx * 120}
          duration={800 + (idx % 3) * 200}
          height={height}
        />
      ))}
    </View>
  );
}

interface FlakeProps {
  startX: number;
  emoji: string;
  delay: number;
  duration: number;
  height: number;
}

function Flake({ startX, emoji, delay, duration, height }: FlakeProps) {
  const y = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const cycle = Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: height,
          duration,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]);

    const loop = Animated.loop(
      Animated.sequence([
        cycle,
        Animated.timing(y, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );

    const timer = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, [y, opacity, duration, height]);

  return (
    <Animated.Text
      style={[
        styles.flake,
        {
          left: startX,
          opacity,
          transform: [{ translateY: y }],
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
  flake: {
    position: 'absolute',
    top: 0,
    fontSize: 18,
    color: '#A5DDFF',
  },
});
