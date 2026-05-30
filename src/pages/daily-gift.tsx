import { createRoute } from '@granite-js/react-native';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useGame } from '../contexts/GameContext';
import { generateDailyGift } from '../utils/dailyGift';
import { useFullScreenAd } from '../hooks/useFullScreenAd';
import { useGrantReward } from '../hooks/useGrantReward';

export const Route = createRoute('/daily-gift', {
  component: DailyGiftScreen,
});

type Phase = 'intro' | 'ad' | 'result' | 'error';

// 출석 선물 — 전체화면 라우트.
// (이전 Modal 구조는 iOS에서 RN Modal 위에 전면 광고를 띄울 수 없어
//  "광고 준비 중..."에 멈췄음. 빙수만들기와 동일한 전체화면으로 전환해 해결.)
function DailyGiftScreen() {
  const navigation = Route.useNavigation();
  const { state, claimDailyGift } = useGame();
  const ad = useFullScreenAd();
  const { grant } = useGrantReward();

  const [phase, setPhase] = useState<Phase>('intro');
  const [reward, setReward] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const processingRef = useRef(false); // 더블탭 방어

  function goBack() {
    navigation.navigate('/');
  }

  async function handleOpen() {
    if (processingRef.current) return;
    processingRef.current = true;
    setPhase('ad');
    try {
      const adResult = await ad.show();

      if (adResult === 'failed') {
        setErrorMsg('광고를 불러올 수 없어요. 잠시 후 다시 시도해주세요.');
        setPhase('error');
        return;
      }

      const amount = generateDailyGift();
      const grantResult = await grant('daily', amount);

      if (grantResult.status === 'success') {
        setReward(amount);
        setPhase('result');
        claimDailyGift(amount);
      } else {
        setErrorMsg(grantResult.errorMessage ?? '선물 지급에 실패했어요.');
        setPhase('error');
      }
    } finally {
      processingRef.current = false;
    }
  }

  const btnDisabled = !ad.isSupported || ad.status === 'loading' || ad.status === 'showing';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        {/* 이미 오늘 받은 상태로 진입(중복 네비게이션 등) → 재지급 차단 */}
        {phase === 'intro' && state.todayGiftClaimed && (
          <>
            <Text style={styles.emoji}>🎁</Text>
            <Text style={styles.title}>오늘 출석 선물 받았어요</Text>
            <Text style={styles.subtitle}>내일 자정에 다시 만나요</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={goBack} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>확인</Text>
            </TouchableOpacity>
          </>
        )}

        {phase === 'intro' && !state.todayGiftClaimed && (
          <>
            <Text style={styles.emoji}>🎁</Text>
            <Text style={styles.title}>오늘의 출석 선물</Text>
            <Text style={styles.subtitle}>매일 한번 광고를 보고 포인트 받아요</Text>
            <TouchableOpacity
              style={[styles.primaryBtn, btnDisabled && styles.btnDisabled]}
              onPress={handleOpen}
              disabled={btnDisabled}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {ad.status === 'idle'   ? '🎁 선물 열기'
                : ad.status === 'failed' ? '🔄 다시 시도'
                : '광고 준비 중...'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goBack} style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>나중에 받기</Text>
            </TouchableOpacity>
          </>
        )}

        {phase === 'ad' && (
          <>
            <ActivityIndicator size="large" color="#00C4FF" />
            <Text style={styles.title}>광고 준비 중...</Text>
            <Text style={styles.subtitle}>잠시만 기다려주세요</Text>
          </>
        )}

        {phase === 'result' && (
          <>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.title}>선물 획득!</Text>
            <Text style={styles.rewardText}>{reward.toLocaleString()}원</Text>
            <Text style={styles.subtitle}>토스 포인트로 지급됐어요</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={goBack} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>확인</Text>
            </TouchableOpacity>
          </>
        )}

        {phase === 'error' && (
          <>
            <Text style={styles.emoji}>😔</Text>
            <Text style={styles.title}>잠시 후 다시 시도해주세요</Text>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity
              style={[styles.primaryBtn, btnDisabled && styles.btnDisabled]}
              onPress={handleOpen}
              disabled={btnDisabled}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {(ad.status === 'idle' || ad.status === 'failed') ? '🔄 다시 시도' : '광고 준비 중...'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goBack} style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>닫기</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202632',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  rewardText: {
    fontSize: 44,
    fontWeight: '800',
    color: '#00C4FF',
    marginVertical: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: '#00C4FF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 240,
    alignItems: 'center',
    marginTop: 16,
  },
  btnDisabled: {
    backgroundColor: '#B0E5F5',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  secondaryBtnText: {
    color: '#888',
    fontSize: 16,
  },
});
