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
import { IceParticles } from '../components/IceParticles';
import { BannerAd } from '../components/BannerAd';
import { BOWL_ILLUSTRATION_BG } from '../constants/bingsus';
import { STEPS_PER_STAGE } from '../constants/gameConfig';

export const Route = createRoute('/ice-crushing', {
  component: IceCrushingScreen,
});

const TOTAL_STEPS = STEPS_PER_STAGE;

function IceCrushingScreen() {
  const navigation = Route.useNavigation();
  const { state, crushIceStep } = useGame();
  const ad = useFullScreenAd();
  const processingRef = useRef(false); // 더블탭 방어

  const bingsu = state.currentBingsu;
  const step = state.currentStageStep;

  // 빙수 없거나 잘못된 단계 진입 시 메인으로
  useEffect(() => {
    if (!bingsu) {
      navigation.reset({ index: 0, routes: [{ name: '/' }] });
      return;
    }
    if (state.currentStage === 'topping') {
      navigation.replace('/topping-up');
    } else if (state.currentStage === 'complete') {
      navigation.replace('/cheering');
    }
  }, [bingsu, state.currentStage, navigation]);

  if (!bingsu) return null;

  // 시각적으로는 step 진행도에 따라 'empty' → 'ice'
  const visualState: BingsuState = step >= 3 ? 'ice' : 'empty';

  async function handleCrush() {
    if (processingRef.current) return; // 더블탭 차단
    if (ad.status === 'loading' || ad.status === 'showing') return;

    processingRef.current = true;
    try {
      const result = await ad.show();
      if (result === 'dismissed') {
        crushIceStep();
      } else {
        Alert.alert('광고 표시 실패', '잠시 후 다시 시도해주세요.');
      }
    } finally {
      processingRef.current = false;
    }
  }

  const isBusy = ad.status === 'loading' || ad.status === 'showing';
  const buttonLabel =
    ad.status === 'idle'    ? '🧊 얼음 더 갈기'
    : ad.status === 'failed' ? '🔄 다시 시도'
    : '광고 준비 중...';

  return (
    <SafeAreaView style={styles.safe}>
      <IOScrollView contentContainerStyle={styles.content}>
        <View style={styles.bingsuWrap}>
          <BingsuDisplay type={bingsu.type} state={visualState} size={200} />
          <IceParticles count={14} fallHeight={260} />
        </View>

        <StepBar currentStage={1} currentStep={step} totalSteps={TOTAL_STEPS} />

        <Text style={styles.guide}>
          {step === 0 && '얼음을 갈아주세요!'}
          {step >= 1 && step < 3 && '얼음이 쌓이고 있어요'}
          {step >= 3 && step < TOTAL_STEPS && '거의 다 됐어요!'}
        </Text>

        <TouchableOpacity
          style={[styles.actionButton, isBusy && styles.btnDisabled]}
          onPress={handleCrush}
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
    paddingTop: 24,
    gap: 24,
    alignItems: 'center',
  },
  bingsuWrap: {
    width: '100%',
    height: 260,
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
    marginTop: 'auto',
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
