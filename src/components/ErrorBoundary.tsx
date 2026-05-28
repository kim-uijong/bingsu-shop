import React, { Component, type ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * 어떤 자식 컴포넌트라도 동기 에러를 던지면 검은 화면 대신 친절한 폴백 UI로 잡아냄.
 * 잠재 원인: 광고 SDK 동기 throw, 비호환 빌드 등.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message ? String(error.message).slice(0, 200) : '알 수 없는 오류',
    };
  }

  componentDidCatch(error: Error) {
    // 추후 텔레메트리 연동 자리. 현재는 콘솔에만.
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.box}>
          <Text style={styles.emoji}>😔</Text>
          <Text style={styles.title}>잠시 문제가 생겼어요</Text>
          <Text style={styles.body}>
            앱을 종료한 뒤 다시 열어보시거나,{'\n'}
            아래 버튼으로 다시 시도해 주세요.
          </Text>
          <Text style={styles.detail}>오류: {this.state.errorMessage}</Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry} activeOpacity={0.85}>
            <Text style={styles.buttonText}>🔄 다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202632',
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  detail: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#00C4FF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 36,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
