import { useCallback, useEffect, useRef, useState } from 'react';
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/framework';
import { AD_GROUP_IDS } from '../constants/adConfig';

// 친구 strawberry-farm-share/app/src/utils/ads.ts 패턴 적용.
// 이전: 마운트 시 pre-load → show 호출 시 ready 상태 체크 후 표시.
//   문제: iOS에서 여러 화면(DailyGiftModal, ice-crushing, topping-up)의
//   useFullScreenAd 인스턴스가 동시에 pre-load → 광고 SDK 충돌 → 출석체크
//   광고가 안 뜨는 현상 발생.
// 현재: 마운트 시 pre-load 제거. show() 호출 시점에 load → show 순차 진행.
//   1~2초 추가 대기 시간은 'loading' 상태로 UI 표시.

type AdStatus = 'idle' | 'loading' | 'showing' | 'failed';

interface UseFullScreenAdResult {
  status: AdStatus;
  isSupported: boolean;
  show: () => Promise<'dismissed' | 'failed'>;
  reload: () => void;
}

function loadAdAsync(adGroupId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let unregister: (() => void) | undefined;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      try { unregister?.(); } catch {}
      fn();
    };
    unregister = loadFullScreenAd({
      options: { adGroupId },
      onEvent: (e) => {
        if (e.type === 'loaded') finish(resolve);
      },
      onError: () => finish(() => reject(new Error('load-failed'))),
    });
  });
}

function showAdAsync(adGroupId: string): Promise<'dismissed' | 'failed'> {
  return new Promise((resolve) => {
    let settled = false;
    let unregister: (() => void) | undefined;
    const finish = (v: 'dismissed' | 'failed') => {
      if (settled) return;
      settled = true;
      if (timeoutId) clearTimeout(timeoutId);
      try { unregister?.(); } catch {}
      resolve(v);
    };

    // 30초 안전 타임아웃 — 광고 응답이 없으면 실패로 처리해 UI 멈춤 방지.
    const timeoutId = setTimeout(() => finish('failed'), 30000);

    unregister = showFullScreenAd({
      options: { adGroupId },
      onEvent: (e) => {
        if (e.type === 'dismissed') finish('dismissed');
        else if (e.type === 'failedToShow') finish('failed');
      },
      onError: () => finish('failed'),
    });
  });
}

export function useFullScreenAd(adGroupId: string = AD_GROUP_IDS.fullScreen): UseFullScreenAdResult {
  const [status, setStatus] = useState<AdStatus>('idle');
  const isMountedRef = useRef(true);
  const isSupported = loadFullScreenAd.isSupported() && showFullScreenAd.isSupported();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const setStatusSafe = useCallback((s: AdStatus) => {
    if (isMountedRef.current) setStatus(s);
  }, []);

  const show = useCallback(async (): Promise<'dismissed' | 'failed'> => {
    if (!isSupported) {
      setStatusSafe('failed');
      return 'failed';
    }

    setStatusSafe('loading');
    try {
      await loadAdAsync(adGroupId);
    } catch {
      setStatusSafe('failed');
      return 'failed';
    }

    if (!isMountedRef.current) return 'failed';
    setStatusSafe('showing');

    const result = await showAdAsync(adGroupId);
    setStatusSafe(result === 'dismissed' ? 'idle' : 'failed');
    return result;
  }, [adGroupId, isSupported, setStatusSafe]);

  // 'failed' 상태에서 다시 시도하고 싶을 때 idle로 초기화.
  // show() 호출 시 내부에서 load+show를 다시 진행하므로 별도 load 호출 불필요.
  const reload = useCallback(() => {
    setStatusSafe('idle');
  }, [setStatusSafe]);

  return { status, isSupported, show, reload };
}
