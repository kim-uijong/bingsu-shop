import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  available: boolean; // 지금 받을 수 있는지 (쿨타임/완료면 false)
  subtitle: string;   // 상태 설명 (부모가 계산)
  onPress: () => void;
}

export function DailyGiftCard({ available, subtitle, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, !available && styles.claimedCard]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.emoji, !available && styles.claimedEmoji]}>🎁</Text>
      <View style={styles.textArea}>
        <Text style={[styles.title, !available && styles.claimedText]}>출석 선물</Text>
        <Text style={[styles.subtitle, !available && styles.claimedSubtitle]}>{subtitle}</Text>
      </View>
      <Text style={available ? styles.arrow : styles.claimedSubtitle}>{available ? '▶' : '⏳'}</Text>
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
