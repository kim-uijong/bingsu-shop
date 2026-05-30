import { createRoute } from '@granite-js/react-native';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../contexts/GameContext';
import { generateBingsu } from '../utils/bingsu';
import { BINGSU_LIST, TIER_LABELS } from '../constants/bingsus';
import { BingsuDisplay } from '../components/BingsuDisplay';
import { BOWL_ILLUSTRATION_BG } from '../constants/bingsus';

export const Route = createRoute('/bingsu-arrival', {
  component: BingsuArrivalScreen,
});

function BingsuArrivalScreen() {
  const navigation = Route.useNavigation();
  const { state, startBingsu, beginCrushing } = useGame();

  // 진입 시 빙수가 없으면 새로 생성, 진행 중이면 해당 단계로 자동 이동
  useEffect(() => {
    if (!state.currentBingsu) {
      const bingsu = generateBingsu();
      startBingsu(bingsu);
      return;
    }
    // 이미 진행 중인 빙수가 있으면 알맞은 화면으로 복귀 (스택 누적 X)
    if (state.currentStage === 'crushing') {
      navigation.replace('/ice-crushing');
    } else if (state.currentStage === 'topping') {
      navigation.replace('/topping-up');
    } else if (state.currentStage === 'complete') {
      navigation.replace('/cheering');
    }
    // 'idle' 또는 'arrived' 상태는 이 화면에 머무름 (얼음 갈기 시작 대기)
  }, [
    state.currentBingsu,
    state.currentStage,
    startBingsu,
    navigation,
  ]);

  const bingsu = state.currentBingsu;
  if (!bingsu) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>빙수 준비 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const info = BINGSU_LIST.find(b => b.type === bingsu.type);
  const tierLabel = TIER_LABELS[bingsu.tier];

  function handleStart() {
    beginCrushing();
    navigation.replace('/ice-crushing');
  }

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.content}>
        <BingsuDisplay type={bingsu.type} state="empty" size={220} />

        <View style={styles.infoBox}>
          <Text style={styles.tierLabel}>{tierLabel}</Text>
          <Text style={styles.bingsuName}>
            {info?.emoji} {info?.name}
          </Text>
          <Text style={styles.message}>"{bingsu.message}"</Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.85}
        >
          <Text style={styles.startButtonText}>🧊 얼음 갈기 시작</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BOWL_ILLUSTRATION_BG,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 32,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
  },
  infoBox: {
    alignItems: 'center',
    gap: 8,
  },
  tierLabel: {
    fontSize: 18,
    color: '#00C4FF',
    fontWeight: '600',
  },
  bingsuName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#202632',
  },
  message: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#00C4FF',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 36,
    alignItems: 'center',
    shadowColor: '#00C4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
