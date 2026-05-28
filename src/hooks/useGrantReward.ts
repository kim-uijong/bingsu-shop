import { useCallback, useState } from 'react';
import { grantPromotionReward } from '@apps-in-toss/framework';
import { PROMOTION_CODES } from '../constants/promotionCodes';
import { type BingsuTier } from '../constants/bingsus';

export type RewardStatus = 'idle' | 'pending' | 'success' | 'failed';

export interface GrantResult {
  status: RewardStatus;
  errorCode?: string;
  errorMessage?: string;
  key?: string;
}

type RewardType = 'daily' | BingsuTier;

export function useGrantReward() {
  const [status, setStatus] = useState<RewardStatus>('idle');

  const grant = useCallback(async (type: RewardType, amount: number): Promise<GrantResult> => {
    if (amount < 1) {
      return { status: 'failed', errorCode: 'INVALID_AMOUNT', errorMessage: '0원 보상은 지급할 수 없어요' };
    }

    // 광고 ID의 IS_PRODUCTION 플래그와는 무관하게, 콘솔에 등록된 프로모션 코드는
    // 항상 실제 호출. (TEST_ 프리픽스 코드는 샌드박스에서 안전하게 테스트 가능)
    setStatus('pending');
    const promotionCode = PROMOTION_CODES[type];

    try {
      const result = await grantPromotionReward({
        params: { promotionCode, amount },
      });

      if (!result) {
        setStatus('failed');
        return { status: 'failed', errorCode: 'UNSUPPORTED_VERSION', errorMessage: '지원하지 않는 앱 버전이에요' };
      }
      if (result === 'ERROR') {
        setStatus('failed');
        return { status: 'failed', errorCode: 'ERROR', errorMessage: '알 수 없는 오류가 발생했어요' };
      }
      if ('errorCode' in result) {
        setStatus('failed');
        return { status: 'failed', errorCode: result.errorCode, errorMessage: result.message };
      }
      setStatus('success');
      return { status: 'success', key: result.key };
    } catch (e: unknown) {
      setStatus('failed');
      return { status: 'failed', errorCode: 'EXCEPTION', errorMessage: String(e) };
    }
  }, []);

  return { grant, status };
}
