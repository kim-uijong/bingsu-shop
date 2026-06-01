import { createRoute, IOScrollView } from '@granite-js/react-native';
import React from 'react';
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
import { IntroModal } from '../components/IntroModal';
import { BannerAd } from '../components/BannerAd';
import { BG_DEFAULT } from '../constants/bingsus';

export const Route = createRoute('/', {
  component: MainScreen,
});

const MAX_BINGSU = 10;

function MainScreen() {
  const navigation = Route.useNavigation();
  const { state, isFirstLaunch, dismissIntro } = useGame();

  const isDailyComplete = state.todayBingsuCount >= MAX_BINGSU;

  function handleDailyGift() {
    // 전체화면 출석 선물 라우트로 이동.
    // (Modal 위에서 전면 광고를 띄우면 iOS에서 멈추므로 라우트로 분리)
    navigation.navigate('/daily-gift');
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
        <TouchableOpacity
          style={styles.policyLink}
          onPress={handlePolicy}
          activeOpacity={0.7}
        >
          <Text style={styles.policyLinkText}>이용 안내 · 고객센터</Text>
        </TouchableOpacity>

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

        <View style={styles.lifetimeCard}>
          {/* numberOfLines+adjustsFontSizeToFit: 화면이 좁아도 라벨이 줄바꿈/겹침 없이
              한 줄로 자동 축소돼 금액과 붙지 않음 (One UI 등 넓은 폰트 기기 대응) */}
          <Text style={styles.lifetimeLabel} numberOfLines={1} adjustsFontSizeToFit>
            💰 지금까지 받은 포인트
          </Text>
          <Text style={styles.lifetimeAmount} numberOfLines={1}>
            {state.lifetimeTotalPoints.toLocaleString()}원
          </Text>
        </View>

        {/* BannerAd는 InlineAd의 ImpressionArea가 IOContext를 요구하므로
            반드시 IOScrollView 내부에 둬야 함 (granite-js 규약) */}
        <BannerAd />
      </IOScrollView>

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
    paddingTop: 16,
    paddingBottom: 12,
    gap: 14,
  },
  lifetimeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8, // 라벨과 금액이 붙지 않도록 최소 간격 확보
    backgroundColor: '#EEF7FF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: '#B3DDFB',
  },
  lifetimeLabel: {
    fontSize: 14,
    color: '#5A7A99',
    fontWeight: '600',
    flexShrink: 1, // 공간 부족 시 라벨이 줄어들어 금액을 밀어내지 않음
  },
  lifetimeAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A6BBF',
  },
  centerSection: {
    alignItems: 'center',
    gap: 12,
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
