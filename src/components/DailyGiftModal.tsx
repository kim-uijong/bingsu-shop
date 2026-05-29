import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { generateDailyGift } from '../utils/dailyGift';
import { useFullScreenAd } from '../hooks/useFullScreenAd';
import { useGrantReward } from '../hooks/useGrantReward';

type Phase = 'intro' | 'ad' | 'result' | 'error';

interface Props {
  visible: boolean;
  onClose: () => void;
  onClaimed: (amount: number) => void;
}

export function DailyGiftModal({ visible, onClose, onClaimed }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [reward, setReward] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const ad = useFullScreenAd();
  const { grant } = useGrantReward();

  function reset() {
    setPhase('intro');
    setReward(0);
    setErrorMsg('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleOpen() {
    setPhase('ad');
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
      onClaimed(amount);
    } else {
      setErrorMsg(grantResult.errorMessage ?? '선물 지급에 실패했어요.');
      setPhase('error');
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {phase === 'intro' && (
            <>
              <Text style={styles.emoji}>🎁</Text>
              <Text style={styles.title}>오늘의 출석 선물</Text>
              <Text style={styles.subtitle}>매일 한번 광고를 보고 포인트 받아요</Text>
              <TouchableOpacity
                style={[styles.primaryBtn, (ad.status === 'loading' || !ad.isSupported) && styles.btnDisabled]}
                onPress={handleOpen}
                disabled={!ad.isSupported || ad.status === 'loading' || ad.status === 'showing'}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>
                  {ad.status === 'idle'    ? '🎁 선물 열기'
                  : ad.status === 'failed'  ? '🔄 다시 시도'
                  : '광고 준비 중...'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClose} style={styles.secondaryBtn}>
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
              <TouchableOpacity style={styles.primaryBtn} onPress={handleClose} activeOpacity={0.85}>
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
                style={[styles.primaryBtn, (ad.status === 'loading' || !ad.isSupported) && styles.btnDisabled]}
                onPress={handleOpen}
                disabled={!ad.isSupported || ad.status === 'loading' || ad.status === 'showing'}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>
                  {(ad.status === 'idle' || ad.status === 'failed') ? '🔄 다시 시도' : '광고 준비 중...'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClose} style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>닫기</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202632',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  notice: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  rewardText: {
    fontSize: 40,
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
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
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
