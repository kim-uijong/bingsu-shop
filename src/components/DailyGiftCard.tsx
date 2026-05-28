import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  claimed: boolean;
  onPress: () => void;
}

export function DailyGiftCard({ claimed, onPress }: Props) {
  // 이미 받은 경우 — null로 사라지게 두면 사용자가 "받은 흔적이 없다"고 혼란.
  // 비활성 카드로 흔적을 남겨 다음 날 재오픈 신호를 전달.
  if (claimed) {
    return (
      <View style={[styles.card, styles.claimedCard]}>
        <Text style={[styles.emoji, styles.claimedEmoji]}>🎁</Text>
        <View style={styles.textArea}>
          <Text style={[styles.title, styles.claimedText]}>오늘 출석 선물 받았어요</Text>
          <Text style={[styles.subtitle, styles.claimedSubtitle]}>내일 자정에 다시 만나요</Text>
        </View>
        <Text style={styles.checkmark}>✓</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.emoji}>🎁</Text>
      <View style={styles.textArea}>
        <Text style={styles.title}>출석 선물</Text>
        <Text style={styles.subtitle}>매일 한번 광고를 보고 포인트 받아요</Text>
      </View>
      <Text style={styles.arrow}>▶</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E4',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    gap: 12,
  },
  claimedCard: {
    backgroundColor: '#F5F5F5',
    borderColor: '#D0D0D0',
  },
  emoji: {
    fontSize: 32,
  },
  claimedEmoji: {
    opacity: 0.5,
  },
  textArea: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202632',
  },
  claimedText: {
    color: '#888',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  claimedSubtitle: {
    color: '#AAA',
  },
  arrow: {
    fontSize: 16,
    color: '#FFD700',
  },
  checkmark: {
    fontSize: 22,
    color: '#4CAF50',
    fontWeight: '700',
  },
});
