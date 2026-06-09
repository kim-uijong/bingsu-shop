import { createRoute, IOScrollView } from '@granite-js/react-native';
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../contexts/GameContext';
import { useFullScreenAd } from '../hooks/useFullScreenAd';
import { BingsuDisplay, type BingsuState } from '../components/BingsuDisplay';
import { StepBar } from '../components/StepBar';
import { SyrupDrops } from '../components/SyrupDrops';
import { BannerAd } from '../components/BannerAd';
import { BOWL_ILLUSTRATION_BG } from '../constants/bingsus';
import { STEPS_PER_STAGE } from '../constants/gameConfig';

export const Route = createRoute('/topping-up', {
  component: ToppingUpScreen,
});

const TOTAL_STEPS = STEPS_PER_STAGE;

function ToppingUpScreen() {
  const navigation = Route.useNavigation();
  const { state, addToppingStep } = useGame();
  const ad = useFullScreenAd();
  const processingRef = useRef(false); // 더블탭 방어

  const bingsu = state.currentBingsu;
  const step = state.currentStageStep;

  useEffect(() => {
    if (!bingsu) {
      navigation.reset({ index: 0, routes: [{ name: '/' }] });
      return;
    }
    if (state.currentStage === 'complete') {
      navigation.replace('/cheering');
    }
  }, [bingsu, state.currentStage, navigation]);

  if (!bingsu) return null;

  // 토핑 단계 전체에서 얼음 쌓인 그릇 표시 (완성은 cheering 화면에서만)
  const visualState: BingsuState = 'topping';

  async function handleAddTopping() {
    if (processingRef.current) return; // 더블탭 차단
    if (ad.status === 'loading' || ad.status === 'showing') return;

    processingRef.current = true;
    try {
      const result = await ad.show();
      if (result === 'dismissed') {
        addToppingStep();
      } else {
        Alert.alert('광고 표시 실패', '잠시 후 다시 시도해주세요.');
      }
    } finally {
      processingRef.current = false;
    }
  }

  const isBusy = ad.status === 'loading' || ad.status === 'showing';
  const buttonLabel =
    ad.status === 'idle'    ? '🥄 토핑 더 올리기'
    : ad.status === 'failed' ? '🔄 다시 시도'
    : '광고 준비 중...';

  return (
    <SafeAreaView style={styles.safe}>
      <IOScrollView contentContainerStyle={styles.content}>
        <View style={styles.bingsuWrap}>
          <BingsuDisplay type={bingsu.type} state={visualState} size={160} />
          <SyrupDrops type={bingsu.type} count={12} fallHeight={200} />
        </View>

        <StepBar currentStage={2} currentStep={step} totalSteps={TOTAL_STEPS} />

        <Text style={styles.guide}>
          {step === 0 && '토핑을 올려주세요!'}
          {step >= 1 && step < 3 && '토핑이 쌓이고 있어요'}
          {step >= 3 && step < TOTAL_STEPS && '거의 완성됐어요!'}
        </Text>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={[styles.actionButton, isBusy && styles.btnDisabled]}
          onPress={handleAddTopping}
          disabled={isBusy}
          activeOpacity={0.85}
        >
          <Text style={styles.actionButtonText}>{buttonLabel}</Text>
        </TouchableOpacity>

        <BannerAd />
      </IOScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BOWL_ILLUSTRATION_BG,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 14,
    alignItems: 'center',
  },
  spacer: {
    flexGrow: 1,
  },
  bingsuWrap: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  guide: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#00C4FF',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 36,
    alignItems: 'center',
    minWidth: 240,
    shadowColor: '#00C4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  btnDisabled: {
    backgroundColor: '#B0E5F5',
  },
  actionButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
