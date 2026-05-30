import { useState, useCallback, useEffect, useRef } from 'react';
import { getServerTime } from '@apps-in-toss/framework';
import { type BingsuType, type BingsuTier } from '../constants/bingsus';
import { STEPS_PER_STAGE } from '../constants/gameConfig';
import { loadPersistedState, savePersistedState } from '../storage/userState';
import { formatDateKST } from '../utils/dateUtils';

export type Stage = 'idle' | 'arrived' | 'crushing' | 'topping' | 'complete';

export interface CurrentBingsu {
  type: BingsuType;
  tier: BingsuTier;
  syrupColor: string;
  message: string;
  reward: number;
  /** grant API 중복 호출 방지용 클라이언트 고유 ID */
  grantClientId: string;
}

export interface GameState {
  todayGiftClaimed: boolean;
  todayBingsuCount: number;
  currentStage: Stage;
  currentStageStep: number;
  currentBingsu: CurrentBingsu | null;
  todayTotalPoints: number;
  lastPlayDate: string;
  lifetimeBingsus: number;
  lifetimeMaxReward: number;
  lifetimeTotalPoints: number; // 누적 받은 토스 포인트 (출석 선물 + 빙수 합계)
  /**
   * 마지막으로 grant 성공한 빙수의 grantClientId.
   * cheering 화면 재진입 시 같은 ID면 done 상태로 직행해 재호출 방지.
   */
  lastGrantedBingsuId: string | null;
}

const INITIAL_STATE: GameState = {
  todayGiftClaimed: false,
  todayBingsuCount: 0,
  currentStage: 'idle',
  currentStageStep: 0,
  currentBingsu: null,
  todayTotalPoints: 0,
  lastPlayDate: '',
  lifetimeBingsus: 0,
  lifetimeMaxReward: 0,
  lifetimeTotalPoints: 0,
  lastGrantedBingsuId: null,
};

function resetDailyFields(state: GameState, today: string): GameState {
  return {
    ...state,
    todayGiftClaimed: false,
    todayBingsuCount: 0,
    currentStage: 'idle',
    currentStageStep: 0,
    currentBingsu: null,
    todayTotalPoints: 0,
    lastPlayDate: today,
  };
}

/**
 * 서버 시간 기반 오늘 날짜(KST) 반환.
 *
 * ⚠️ 클라이언트 시간 폴백 절대 X — 사용자가 디바이스 시간을 조작하면
 *    일일 리셋을 우회해 일 10그릇 상한을 초과할 수 있는 보안 취약점이 됨.
 *    SDK 실패 시 null을 반환하고 호출부에서 reset 자체를 보류함.
 *
 * 3회 재시도 (0.5s / 1.5s 백오프). 모두 실패하면 null.
 */
async function fetchToday(): Promise<string | null> {
  const supported = typeof getServerTime.isSupported === 'function'
    ? getServerTime.isSupported()
    : true;
  if (!supported) return null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ts = await getServerTime();
      if (typeof ts === 'number') {
        return formatDateKST(ts);
      }
    } catch {
      // 다음 재시도
    }
    if (attempt < 2) {
      await new Promise(resolve => setTimeout(resolve, attempt === 0 ? 500 : 1500));
    }
  }
  return null;
}

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const isLoadedRef = useRef(false);

  // 1) 영속 상태 로드 + 일일 리셋 체크 (서버 시간 기반)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const persisted = await loadPersistedState();
      const today = await fetchToday();
      if (cancelled) return;

      // 기존 영속 상태에 새 필드가 없을 수 있으므로 기본값과 머지
      let initial: GameState = persisted
        ? { ...INITIAL_STATE, ...persisted }
        : INITIAL_STATE;

      // 서버 시간 획득 성공한 경우에만 일일 리셋 적용.
      // 실패하면 기존 lastPlayDate 그대로 유지 → 진행 보호 + 시간 조작 방지.
      // 첫 실행이라면 today가 없어도 빈 lastPlayDate로 시작 가능.
      if (today && initial.lastPlayDate !== today) {
        initial = resetDailyFields(initial, today);
      }

      setState(initial);
      setIsFirstLaunch(persisted === null);
      isLoadedRef.current = true;
      setIsLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2) 로드 후 상태 변경 시 자동 저장
  useEffect(() => {
    if (!isLoadedRef.current) return;
    savePersistedState(state);
  }, [state]);

  const claimDailyGift = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      todayGiftClaimed: true,
      todayTotalPoints: prev.todayTotalPoints + amount,
      lifetimeMaxReward: Math.max(prev.lifetimeMaxReward, amount),
      lifetimeTotalPoints: prev.lifetimeTotalPoints + amount,
    }));
  }, []);

  const startBingsu = useCallback((bingsu: CurrentBingsu) => {
    setState(prev => ({
      ...prev,
      currentBingsu: bingsu,
      currentStage: 'arrived',
      currentStageStep: 0,
    }));
  }, []);

  const beginCrushing = useCallback(() => {
    setState(prev => ({ ...prev, currentStage: 'crushing' }));
  }, []);

  const crushIceStep = useCallback(() => {
    setState(prev => {
      const nextStep = prev.currentStageStep + 1;
      if (nextStep >= STEPS_PER_STAGE) {
        return { ...prev, currentStage: 'topping', currentStageStep: 0 };
      }
      return { ...prev, currentStageStep: nextStep };
    });
  }, []);

  const addToppingStep = useCallback(() => {
    setState(prev => {
      const nextStep = prev.currentStageStep + 1;
      if (nextStep >= STEPS_PER_STAGE) {
        return { ...prev, currentStage: 'complete', currentStageStep: STEPS_PER_STAGE };
      }
      return { ...prev, currentStageStep: nextStep };
    });
  }, []);

  const completeBingsu = useCallback(() => {
    setState(prev => {
      const reward = prev.currentBingsu?.reward ?? 0;
      return {
        ...prev,
        todayBingsuCount: prev.todayBingsuCount + 1,
        todayTotalPoints: prev.todayTotalPoints + reward,
        lifetimeBingsus: prev.lifetimeBingsus + 1,
        lifetimeMaxReward: Math.max(prev.lifetimeMaxReward, reward),
        lifetimeTotalPoints: prev.lifetimeTotalPoints + reward,
        currentStage: 'idle',
        currentStageStep: 0,
        currentBingsu: null,
      };
    });
  }, []);

  /**
   * 빙수 grant 성공 직후 호출 — grantClientId를 저장해 같은 빙수의 재지급 차단.
   * completeBingsu보다 먼저 호출하면, 사용자가 도중에 앱을 종료해도
   * 재진입 시 cheering 화면이 done 상태로 직행해 중복 grant API 호출이 안 됨.
   */
  const markBingsuGranted = useCallback((grantClientId: string) => {
    setState(prev => ({ ...prev, lastGrantedBingsuId: grantClientId }));
  }, []);

  const resetDaily = useCallback(async () => {
    const today = await fetchToday();
    if (!today) return; // 서버 시간 획득 실패 시 reset 보류 (시간 조작 방지)
    setState(prev => resetDailyFields(prev, today));
  }, []);

  const dismissIntro = useCallback(() => {
    setIsFirstLaunch(false);
    // 다음 진입 시 인트로 표시 여부는 `loadPersistedState() === null`로 판정.
    // state는 이미 메인 useEffect를 통해 영속화돼 있어 추가 setState 불필요.
  }, []);

  return {
    state,
    isLoaded,
    isFirstLaunch,
    claimDailyGift,
    startBingsu,
    beginCrushing,
    crushIceStep,
    addToppingStep,
    completeBingsu,
    resetDaily,
    dismissIntro,
    markBingsuGranted,
  };
}
