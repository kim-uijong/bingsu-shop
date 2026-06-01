import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  count: number;
  totalPoints: number;
}

const MAX_COUNT = 10;

export function DailyCounter({ count, totalPoints }: Props) {
  const icons = Array.from({ length: MAX_COUNT }, (_, i) => (i < count ? '🍧' : '⬜'));

  return (
    <View style={styles.container}>
      {/* numberOfLines+adjustsFontSizeToFit: 좁은 화면에서도 10칸이 줄바꿈되지 않고
          한 줄로 자동 축소돼, 아래 요소가 밀리지 않음 */}
      <Text style={styles.iconsRow} numberOfLines={1} adjustsFontSizeToFit>
        {icons.join('')}
      </Text>
      <Text style={styles.countText}>
        오늘 빙수: {count}/{MAX_COUNT}
      </Text>
      <Text style={styles.pointsText}>
        오늘 보상: {totalPoints.toLocaleString()}원
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F0FAFF',
    borderRadius: 12,
    gap: 4,
  },
  iconsRow: {
    fontSize: 20,
    letterSpacing: 2,
  },
  countText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202632',
  },
  pointsText: {
    fontSize: 16,
    color: '#00C4FF',
    fontWeight: '700',
  },
});
