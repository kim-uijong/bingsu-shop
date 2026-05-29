import { createRoute, IOScrollView } from '@granite-js/react-native';
import { useTopNavigation } from '@apps-in-toss/framework';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../contexts/GameContext';
import { DailyCounter } from '../components/DailyCounter';
import { DailyGiftCard } from '../components/DailyGiftCard';
import { DailyGiftModal } from '../components/DailyGiftModal';
import { IntroModal } from '../components/IntroModal';
import { BannerAd } from '../components/BannerAd';
import { BG_DEFAULT } from '../constants/bingsus';

export const Route = createRoute('/', {
  component: MainScreen,
});

const MAX_BINGSU = 10;

function MainScreen() {
  const navigation = Route.useNavigation();
  const { state, claimDailyGift, isFirstLaunch, dismissIntro } = useGame();
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const { addAccessoryButton, removeAccessoryButton } = useTopNavigation();

  const isDailyComplete = state.todayBingsuCount >= MAX_BINGSU;

  // useTopNavigation 동적 액세서리 버튼 추가 시도.
  // 헤더 우측 영역 활성화 트리거가 될 수 있는지 검증 목적.
  // 가이드(/bedrock/reference/framework/UI/NavigationBar)의 RN 예제 그대로 적용.
  useEffect(() => {
    try {
      addAccessoryButton({
        id: 'bingsu-info',
        title: '빙수 안내',
        icon: { name: 'icon-heart-mono' },
        onPress: () => {
          navigation.navigate('/probability-info');
        },
      });
    } catch {
      // 호스트가 비활성 상태면 silent
    }
    return () => {
      try { removeAccessoryButton(); } catch {}
    };
  }, [addAccessoryButton, removeAccessoryButton, navigation]);

  function handleDailyGift() {
    setGiftModalVisible(true);
  }

  function handleGiftClaimed(amount: number) {
    claimDailyGift(amount);
  }

  function handleStartBingsu() {
    navigation.navigate('/bingsu-arrival');
  }

  function handleProbabilityInfo() {
    navigation.navigate('/probability-info');
  }

  function handlePolicy() {
    navigation.navigate('/policy');
  }

  // 상단 헤더(미니앱 이름 + ⋯ + ✕)는 토스 호스트가 자동 제공.
  // 자체 헤더는 그리지 않음 — 사용자 의도에 따라 토스 표준 헤더 사용.

  return (
    <SafeAreaView style={styles.safe}>
      <IOScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.lifetimeCard}>
          <Text style={styles.lifetimeLabel}>💰 지금까지 받은 포인트</Text>
          <Text style={styles.lifetimeAmount}>
            {state.lifetimeTotalPoints.toLocaleString()}원
          </Text>
        </View>

        <DailyGiftCard claimed={state.todayGiftClaimed} onPress={handleDailyGift} />

        <View style={styles.centerSection}>
          <Text style={styles.todayLabel}>🍧 오늘의 빙수는?</Text>

          {isDailyComplete ? (
            <View style={styles.completeBox}>
              <Text style={styles.completeEmoji}>🏆</Text>
              <Text style={styles.completeTitle}>오늘 영업 완료!</Text>
              <Text style={styles.completeSubtitle}>내일 또 만나요!</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartBingsu}
              activeOpacity={0.85}
            >
              <Text style={styles.startButtonText}>🍧 빙수 만들기</Text>
            </TouchableOpacity>
          )}
        </View>

        <DailyCounter
          count={state.todayBingsuCount}
          totalPoints={state.todayTotalPoints}
        />

        <TouchableOpacity
          style={styles.infoButton}
          onPress={handleProbabilityInfo}
          activeOpacity={0.7}
        >
          <Text style={styles.infoButtonText}>📊 빙수 안내</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.policyLink}
          onPress={handlePolicy}
          activeOpacity={0.7}
        >
          <Text style={styles.policyLinkText}>이용 안내 · 고객센터</Text>
        </TouchableOpacity>

        {/* BannerAd는 InlineAd의 ImpressionArea가 IOContext를 요구하므로
            반드시 IOScrollView 내부에 둬야 함 (granite-js 규약) */}
        <BannerAd />
      </IOScrollView>

      <DailyGiftModal
        visible={giftModalVisible}
        onClose={() => setGiftModalVisible(false)}
        onClaimed={handleGiftClaimed}
      />

      <IntroModal visible={isFirstLaunch} onClose={dismissIntro} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG_DEFAULT,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
  },
  lifetimeCard: {
    backgroundColor: '#EEF7FF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#B3DDFB',
  },
  lifetimeLabel: {
    fontSize: 15,
    color: '#5A7A99',
    fontWeight: '600',
    marginBottom: 4,
  },
  lifetimeAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0A6BBF',
  },
  centerSection: {
    alignItems: 'center',
    gap: 16,
  },
  todayLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202632',
  },
  startButton: {
    backgroundColor: '#00C4FF',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 48,
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
  completeBox: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 20,
  },
  completeEmoji: {
    fontSize: 48,
  },
  completeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202632',
  },
  completeSubtitle: {
    fontSize: 16,
    color: '#888',
  },
  infoButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
  },
  infoButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  policyLink: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  policyLinkText: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'underline',
  },
});
