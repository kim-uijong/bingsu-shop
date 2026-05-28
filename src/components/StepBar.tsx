import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface Props {
  currentStage: 1 | 2;
  currentStep: number;
  totalSteps?: number;
}

export function StepBar({ currentStage, currentStep, totalSteps = 5 }: Props) {
  const stage1Step = currentStage === 1 ? currentStep : totalSteps;
  const stage2Step = currentStage === 2 ? currentStep : 0;

  return (
    <View style={styles.container}>
      <StageLine
        label="STAGE 1 · 얼음 갈기"
        step={stage1Step}
        total={totalSteps}
        active={currentStage === 1}
        completed={currentStage === 2}
      />
      <StageLine
        label="STAGE 2 · 토핑 올리기"
        step={stage2Step}
        total={totalSteps}
        active={currentStage === 2}
        completed={false}
      />
    </View>
  );
}

interface StageLineProps {
  label: string;
  step: number;
  total: number;
  active: boolean;
  completed: boolean;
}

function StageLine({ label, step, total, active, completed }: StageLineProps) {
  const widthAnim = useRef(new Animated.Value((step / total) * 100)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: (step / total) * 100,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [step, total, widthAnim]);

  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.lineWrap}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, active && styles.labelActive]}>
          {completed ? '✓ ' : ''}
          {label}
        </Text>
        <Text style={[styles.count, active && styles.countActive]}>
          {step}/{total}
        </Text>
      </View>
      <View style={styles.barBg}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: widthInterpolated,
              backgroundColor: active ? '#00C4FF' : completed ? '#9CE2F2' : '#DDDDDD',
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingVertical: 8,
  },
  lineWrap: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  labelActive: {
    color: '#202632',
    fontSize: 16,
  },
  count: {
    fontSize: 14,
    color: '#999',
    fontWeight: '700',
  },
  countActive: {
    color: '#00C4FF',
    fontSize: 18,
  },
  barBg: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
});
