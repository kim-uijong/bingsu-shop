import { createRoute } from '@granite-js/react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../contexts/GameContext';
import { useGrantReward } from '../hooks/useGrantReward';
import { BingsuDisplay } from '../components/BingsuDisplay';
import { SpecialBingsuOverlay } from '../components/SpecialBingsuOverlay';
import { BINGSU_LIST, ILLUSTRATION_BG, BG_DEFAULT } from '../constants/bingsus';
import { getRandomCheerMessage } from '../utils/bingsu';

export const Route = createRoute('/cheering', {
  component: CheeringScreen,
});

const MAX_BINGSU = 10;

type Phase = 'cheering' | 'granting' | 'done' | 'error';

function CheeringScreen() {
  const navigation = Route.useNavigation();
  const { state, completeBingsu, markBingsuGranted } = useGame();
  const { grant } = useGrantReward();

  const bingsu = state.currentBingsu;
  // 같은 빙수가 이미 grant 완료된 상태면 (앱 크래시 후 재진입 등) 직행 'done'
  const alreadyGranted =
    !!bingsu && state.lastGrantedBingsuId === bingsu.grantClientId;
  const [phase, setPhase] = useState<Phase>(alreadyGranted ? 'done' : 'cheering');
  const [errorMsg, setErrorMsg] = useState('');

  // 다음 화면으로 이동 시작했음을 표시 — completeBingsu로 bingsu가 null이 돼도
  // useEffect 가드가 중복 navigate를 호출하지 않도록 함
  const navigatedRef = useRef(false);
  // unmount 후 setState 경고 방지 — grant Promise 진행 중 사용자가 뒤로가기 등으로
  // 화면을 떠나도 안전하게 무시
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 이 빙수가 grant 완료(보상 지급)됐는지. 재진입(alreadyGranted) 시에도 확정 대상.
  const grantedRef = useRef(alreadyGranted);
  // completeBingsu 중복 호출 방지 (1회만 확정)
  const finalizedRef = useRef(false);

  // grant된 빙수를 화면 이탈 시 1회만 확정 — 카운트 증가 + currentBingsu 클리어.
  // 뒤로가기로 나가도 "받았는데 안 끝난" 어중간한 상태가 안 남고, 옛 보상 화면 재등장 X.
  const finalizeIfGranted = useCallback(() => {
    if (finalizedRef.current || !grantedRef.current) return;
    finalizedRef.current = true;
    navigatedRef.current = true; // 확정 후 currentBingsu=null로 인한 useEffect 재네비 방지
    completeBingsu();
  }, [completeBingsu]);

  // 뒤로가기·제스처 등 어떤 경로로든 화면을 떠날 때 grant된 빙수를 자동 확정
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      finalizeIfGranted();
    });
    return unsubscribe;
  }, [navigation, finalizeIfGranted]);

  // 응원 메시지는 환호 진입 시 한 번만 픽 (같은 화면에서 변경되지 않게)
  const [cheerMessage] = useState(() =>
    bingsu ? getRandomCheerMessage(bingsu.type) : ''
  );

  // 비정상 진입 가드: 보상 받기 전인데 빙수가 없으면 메인으로 복귀
  useEffect(() => {
    if (navigatedRef.current) return;
    if (!bingsu) {
      navigatedRef.current = true;
      navigation.reset({ index: 0, routes: [{ name: '/' }] });
    }
  }, [bingsu, navigation]);

  if (!bingsu) return null;

  const info = BINGSU_LIST.find(b => b.type === bingsu.type);
  // 일러스트 PNG의 박스 배경색을 화면 배경으로 → 박스 경계가 사라짐
  const bg = ILLUSTRATION_BG[bingsu.type] ?? BG_DEFAULT;

  async function handleClaim() {
    if (!bingsu) return;
    // 중복 지급 방어: 같은 grantClientId가 이미 성공으로 기록돼 있으면 grant 호출 생략
    if (state.lastGrantedBingsuId === bingsu.grantClientId) {
      grantedRef.current = true;
      setPhase('done');
      return;
    }
    setPhase('granting');
    const result = await grant(bingsu.tier, bingsu.reward);
    if (!isMountedRef.current) return; // 화면 떠난 뒤 응답 도착 → 무시
    if (result.status === 'success') {
      // 성공 직후 immediate mark — completeBingsu보다 먼저 호출해야
      // 사용자가 도중에 앱을 강제 종료해도 재진입 시 중복 grant가 안 됨
      markBingsuGranted(bingsu.grantClientId);
      grantedRef.current = true;
      setPhase('done');
    } else {
      setErrorMsg(result.errorMessage ?? '보상 지급에 실패했어요');
      setPhase('error');
    }
  }

  function handleNext() {
    const willBeLast = state.todayBingsuCount + 1 >= MAX_BINGSU;
    navigatedRef.current = true;
    finalizeIfGranted();
    if (willBeLast) {
      // 스택을 [메인, 완료] 두 개로 리셋 → 완료 화면에서 뒤로가기 = 메인
      navigation.reset({
        index: 1,
        routes: [{ name: '/' }, { name: '/daily-complete' }],
      });
    } else {
      // 게임 화면들을 모두 제거하고 메인을 새 인스턴스로 복귀
      navigation.reset({ index: 0, routes: [{ name: '/' }] });
    }
  }

  const isLastBingsu = state.todayBingsuCount + 1 >= MAX_BINGSU;
  const rewardText = `${bingsu.reward.toLocaleString()}원`;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <SpecialBingsuOverlay type={bingsu.type}>
        <View style={styles.content}>
          <View style={styles.illustrationWrap}>
            <BingsuDisplay type={bingsu.type} state="complete" size={300} />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.bingsuName}>
              {info?.emoji} {info?.name}
            </Text>
            <Text style={styles.message}>"{cheerMessage}"</Text>
          </View>

          <View style={styles.actionArea}>
            {phase === 'cheering' && (
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleClaim}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>💰 {rewardText} 받기</Text>
              </TouchableOpacity>
            )}

            {phase === 'granting' && (
              <View style={styles.grantingBox}>
                <ActivityIndicator size="large" color="#00C4FF" />
                <Text style={styles.grantingText}>보상 지급 중...</Text>
              </View>
            )}

            {phase === 'done' && (
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleNext}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>
                  ✅ {rewardText} 받음 ·{' '}
                  {isLastBingsu ? '오늘 영업 마무리' : '다음 빙수 🍧'}
                </Text>
              </TouchableOpacity>
            )}

            {phase === 'error' && (
              <>
                <Text style={styles.errorText}>{errorMsg}</Text>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleClaim}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>다시 시도</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </SpecialBingsuOverlay>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    // backgroundColor는 인라인으로 빙수별 색 주입
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    alignItems: 'center',
  },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  infoBox: {
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  bingsuName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#202632',
  },
  message: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
  actionArea: {
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 8,
  },
  grantingBox: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  grantingText: {
    fontSize: 16,
    color: '#444',
  },
  errorText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: '#00C4FF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 36,
    alignItems: 'center',
    minWidth: 280,
    shadowColor: '#00C4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
