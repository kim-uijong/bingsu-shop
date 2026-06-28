import { createRoute } from '@granite-js/react-native';
import React, { useEffect, useRef, useState } from 'react';
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
import { DAILY_GIFT_LIMIT, GIFT_COOLDOWN_MS } from '../constants/probabilities';

export const Route = createRoute('/daily-gift', {
  component: DailyGiftScreen,
});

type Phase = 'intro' | 'ad' | 'granting' | 'result' | 'error';

// 출석 쿨타임 남은 시간 표시 (H시간 M분 / M분 S초 / S초)
function formatCooldown(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}시간 ${m}분 후`;
  if (m > 0) return `${m}분 ${s}초 후`;
  return `${s}초 후`;
}

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
  // 쿨타임 카운트다운용 1초 틱
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const giftDone = state.todayGiftCount >= DAILY_GIFT_LIMIT;
  const cooldownLeft = Math.max(0, GIFT_COOLDOWN_MS - (now - state.lastGiftTime));
  const cooldownActive = !giftDone && cooldownLeft > 0;
  const giftLeft = DAILY_GIFT_LIMIT - state.todayGiftCount;
  const processingRef = useRef(false); // 중복 클릭 방어
  const isMountedRef = useRef(true);   // 언마운트 후 setState 방지
  // 광고는 시청 완료했는데 grant만 실패한 경우, 광고 없이 재시도할 금액 보관
  const pendingAmountRef = useRef<number | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  function goBack() {
    navigation.navigate('/');
  }

  // 보상 지급만 수행 (광고 없이). grant 실패 시 pendingAmount를 보관해
  // 재시도 시 광고를 다시 보지 않고 grant만 재호출하도록 함.
  async function runGrant(amount: number) {
    setPhase('granting');
    const grantResult = await grant('daily', amount);
    if (!isMountedRef.current) return; // 화면 떠난 뒤 응답 도착 → 무시
    if (grantResult.status === 'success') {
      pendingAmountRef.current = null;
      setReward(amount);
      setPhase('result');
      claimDailyGift(amount);
    } else {
      pendingAmountRef.current = amount; // 광고 재시청 없이 grant만 재시도 가능
      setErrorMsg(grantResult.errorMessage ?? '선물 지급에 실패했어요.');
      setPhase('error');
    }
  }

  // 광고 시청 → 보상 지급
  async function handleOpen() {
    if (processingRef.current) return;
    if (giftDone || cooldownActive) return; // 다 받았거나 쿨타임 중
    processingRef.current = true;
    setPhase('ad');
    try {
      const adResult = await ad.show();
      if (!isMountedRef.current) return;
      if (adResult === 'failed') {
        pendingAmountRef.current = null;
        setErrorMsg('광고를 불러올 수 없어요. 잠시 후 다시 시도해주세요.');
        setPhase('error');
        return;
      }
      await runGrant(generateDailyGift());
    } finally {
      processingRef.current = false;
    }
  }

  // 에러 화면 재시도: 광고는 이미 봤고 grant만 실패했으면 광고 없이 grant만 재시도.
  // 그 외(광고 실패)에는 광고부터 다시.
  async function handleRetry() {
    if (processingRef.current) return;
    if (pendingAmountRef.current != null) {
      processingRef.current = true;
      try {
        await runGrant(pendingAmountRef.current);
      } finally {
        processingRef.current = false;
      }
    } else {
      await handleOpen();
    }
  }

  const btnDisabled = !ad.isSupported || ad.status === 'loading' || ad.status === 'showing';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        {/* 오늘 5번 다 받음 */}
        {phase === 'intro' && giftDone && (
          <>
            <Text style={styles.emoji}>🎁</Text>
            <Text style={styles.title}>오늘 출석 선물 다 받았어요</Text>
            <Text style={styles.subtitle}>내일 자정에 다시 만나요</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={goBack} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>확인</Text>
            </TouchableOpacity>
          </>
        )}

        {/* 쿨타임 중 */}
        {phase === 'intro' && cooldownActive && (
          <>
            <Text style={styles.emoji}>⏳</Text>
            <Text style={styles.title}>다음 출석 {formatCooldown(cooldownLeft)}</Text>
            <Text style={styles.subtitle}>오늘 {giftLeft}번 더 받을 수 있어요</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={goBack} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>확인</Text>
            </TouchableOpacity>
          </>
        )}

        {phase === 'intro' && !giftDone && !cooldownActive && (
          <>
            <Text style={styles.emoji}>🎁</Text>
            <Text style={styles.title}>오늘의 출석 선물</Text>
            <Text style={styles.subtitle}>광고를 보고 포인트 받아요 · 오늘 {giftLeft}번 가능</Text>
            {ad.isSupported ? (
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
            ) : (
              <Text style={styles.errorText}>
                이 기기에서는 광고를 지원하지 않아 받을 수 없어요.{'\n'}최신 토스 앱에서 다시 시도해주세요.
              </Text>
            )}
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

        {phase === 'granting' && (
          <>
            <ActivityIndicator size="large" color="#00C4FF" />
            <Text style={styles.title}>보상 지급 중...</Text>
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
              onPress={handleRetry}
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
