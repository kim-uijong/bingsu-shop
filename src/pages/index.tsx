import { createRoute } from '@granite-js/react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export const Route = createRoute('/', {
  component: MainScreen,
});

// 데모 미니앱 — 단순 카운터 버튼.
// React Native 기본 컴포넌트만 사용 (IOContext/InlineAd/native-modules 의존성 X).
// 헤더 자동 활성화가 코드 단순성에 영향받는지 검증 목적.

function MainScreen() {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>헤더 검증 데모</Text>
        <Text style={styles.subtitle}>버튼 1개만 있는 minimal 미니앱</Text>

        <Text style={styles.count}>{count}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCount(c => c + 1)}
          activeOpacity={0.8}
          accessibilityLabel="카운트 증가"
        >
          <Text style={styles.buttonText}>+1</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          상단 헤더 우측에 ⋯ / ✕ 자동 표시되는지 확인
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F8FB' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#202632' },
  subtitle: { fontSize: 14, color: '#666' },
  count: {
    fontSize: 64,
    fontWeight: '800',
    color: '#00C4FF',
    marginVertical: 24,
  },
  button: {
    backgroundColor: '#00C4FF',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  buttonText: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  hint: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 24,
  },
});
