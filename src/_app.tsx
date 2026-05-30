import React, { type PropsWithChildren } from 'react';
import { type InitialProps } from '@granite-js/react-native';
import { AppsInToss } from '@apps-in-toss/framework';
import { context } from '../require.context';
import { GameProvider } from './contexts/GameContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContainer({ children }: PropsWithChildren<InitialProps>) {
  return (
    <ErrorBoundary>
      <GameProvider>{children}</GameProvider>
    </ErrorBoundary>
  );
}

// AppsInToss.registerApp: 토스 호스트 통합(네비게이션 바 + TDS Overlay 등)을 연결.
// Granite.registerApp은 저수준이라 호스트 네비바가 안 떴음 (커뮤니티 사례 기반).
export default AppsInToss.registerApp(AppContainer, {
  context,
});
