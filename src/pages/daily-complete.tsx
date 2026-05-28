import { createRoute } from '@granite-js/react-native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useGame } from '../contexts/GameContext';
import { BG_DEFAULT } from '../constants/bingsus';

export const Route = createRoute('/daily-complete', {
  component: DailyCompleteScreen,
});

function DailyCompleteScreen() {
  const navigation = Route.useNavigation();
  const { state } = useGame();

  function handleGoMain() {
    navigation.reset({ index: 0, routes: [{ name: '/' }] });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.title}>오늘 영업 완료!</Text>
        <Text style={styles.subtitle}>오늘 빙수 10그릇 모두 완성했어요</Text>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>오늘의 총 보상</Text>
          <Text style={styles.summaryAmount}>
            💰 {state.todayTotalPoints.toLocaleString()}원
          </Text>
        </View>

        <Text style={styles.thanks}>내일 또 만나요! 🍧</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGoMain}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG_DEFAULT,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  trophy: {
    fontSize: 72,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#202632',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  summaryBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 48,
    gap: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginVertical: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#00C4FF',
  },
  thanks: {
    fontSize: 18,
    color: '#666',
  },
  button: {
    backgroundColor: '#00C4FF',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 64,
    marginTop: 24,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
