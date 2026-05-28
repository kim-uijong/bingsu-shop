import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { BINGSU_REACTIONS } from '../constants/reactions';
import { type BingsuType } from '../constants/bingsus';

interface Props {
  type: BingsuType;
}

// 13가지 빙수 고유 환호 반응
export function BingsuReaction({ type }: Props) {
  const reaction = BINGSU_REACTIONS[type];
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.15,
          duration: 250,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 250,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse]);

  return (
    <View style={styles.container}>
      <View style={styles.particleRow}>
        {reaction.particles.map((p, idx) => (
          <ParticleEmoji key={idx} emoji={p} delay={idx * 100} />
        ))}
      </View>
      <Animated.View
        style={[
          styles.labelBox,
          {
            backgroundColor: `${reaction.glowColor}22`,
            borderColor: reaction.glowColor,
            transform: [{ scale: pulse }],
          },
        ]}
      >
        <Text style={[styles.label, { color: reaction.glowColor }]}>{reaction.label}</Text>
      </Animated.View>
      <Text style={styles.motion}>{reaction.motion}</Text>
    </View>
  );
}

function ParticleEmoji({ emoji, delay }: { emoji: string; delay: number }) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(y, {
          toValue: -8,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: 0,
          duration: 260,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    const timer = setTimeout(() => animation.start(), delay);
    return () => {
      clearTimeout(timer);
      animation.stop();
    };
  }, [y, delay]);

  return (
    <Animated.Text style={[styles.particle, { transform: [{ translateY: y }] }]}>
      {emoji}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
  },
  particleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  particle: {
    fontSize: 28,
  },
  labelBox: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
  },
  motion: {
    fontSize: 14,
    color: '#888',
  },
});
