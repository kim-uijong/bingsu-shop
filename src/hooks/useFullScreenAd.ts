import { useCallback, useEffect, useRef, useState } from 'react';
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/framework';
import { AD_GROUP_IDS } from '../constants/adConfig';

type AdStatus = 'idle' | 'loading' | 'ready' | 'showing' | 'failed';

interface UseFullScreenAdResult {
  status: AdStatus;
  isSupported: boolean;
  show: () => Promise<'dismissed' | 'failed'>;
  reload: () => void;
}

// 전면 광고 로드 → 표시 → 다음 광고 미리 로드 패턴
export function useFullScreenAd(adGroupId: string = AD_GROUP_IDS.fullScreen): UseFullScreenAdResult {
  const [status, setStatus] = useState<AdStatus>('idle');
  const statusRef = useRef<AdStatus>('idle');
  const unregisterRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef(true);
  const isSupported = loadFullScreenAd.isSupported();

  const setStatusSafe = useCallback((s: AdStatus) => {
    statusRef.current = s;
    if (isMountedRef.current) setStatus(s);
  }, []);

  const load = useCallback(() => {
    if (!isSupported) {
      setStatusSafe('failed');
      return;
    }
    // 이미 로딩 중이거나 준비됐으면 중복 호출 방지
    if (statusRef.current === 'loading' || statusRef.current === 'ready' || statusRef.current === 'showing') {
      return;
    }
    // 기존 등록 정리 후 다시 load
    try { unregisterRef.current?.(); } catch {}
    unregisterRef.current = null;

    setStatusSafe('loading');
    unregisterRef.current = loadFullScreenAd({
      options: { adGroupId },
      onEvent: event => {
        if (event.type === 'loaded') {
          setStatusSafe('ready');
        }
      },
      onError: () => {
        setStatusSafe('failed');
      },
    });
  }, [adGroupId, isSupported, setStatusSafe]);

  // 마운트 시 한 번 로드. 언마운트 시 등록 해제.
  useEffect(() => {
    isMountedRef.current = true;
    load();
    return () => {
      isMountedRef.current = false;
      try { unregisterRef.current?.(); } catch {}
      unregisterRef.current = null;
    };
  }, [load]);

  // failed 상태로 갇히지 않도록 자동 재시도 (3초 후 1회)
  useEffect(() => {
    if (status !== 'failed' || !isSupported) return;
    const t = setTimeout(() => {
      // 그 사이 상태가 바뀌었으면 무시
      if (statusRef.current === 'failed') load();
    }, 3000);
    return () => clearTimeout(t);
  }, [status, isSupported, load]);

  const reload = useCallback(() => {
    // 'showing' 중이면 무시, 그 외 상태에선 강제 reload
    if (statusRef.current === 'showing') return;
    setStatusSafe('idle');
    load();
  }, [load, setStatusSafe]);

  const show = useCallback((): Promise<'dismissed' | 'failed'> => {
    return new Promise(resolve => {
      if (!isSupported || statusRef.current !== 'ready') {
        resolve('failed');
        return;
      }
      setStatusSafe('showing');

      let resolved = false;
      let unregister: (() => void) | null = null;
      const safeResolve = (v: 'dismissed' | 'failed') => {
        if (resolved) return;
        resolved = true;
        if (timeoutId) clearTimeout(timeoutId);
        try { unregister?.(); } catch {}
        resolve(v);
      };

      // 30초 안전 타임아웃 — 광고 응답이 없으면 실패로 처리해 UI 멈춤 방지
      const timeoutId = setTimeout(() => {
        setStatusSafe('failed');
        safeResolve('failed');
      }, 30000);

      unregister = showFullScreenAd({
        options: { adGroupId },
        onEvent: event => {
          if (event.type === 'dismissed') {
            setStatusSafe('idle');
            load();
            safeResolve('dismissed');
          } else if (event.type === 'failedToShow') {
            setStatusSafe('failed');
            safeResolve('failed');
          }
        },
        onError: () => {
          setStatusSafe('failed');
          safeResolve('failed');
        },
      });
    });
  }, [adGroupId, isSupported, load, setStatusSafe]);

  return { status, isSupported, show, reload };
}
