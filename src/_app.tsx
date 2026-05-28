import React, { type PropsWithChildren } from 'react';
import { Granite, type InitialProps } from '@granite-js/react-native';
import { context } from '../require.context';
import { ErrorBoundary } from './components/ErrorBoundary';

// 데모 검증용 단순 _app — ErrorBoundary는 유지 (검은 화면 방지).
// 원본은 main 브랜치 또는 git checkout main 으로 복귀 가능.

function AppContainer({ children }: PropsWithChildren<InitialProps>) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

export default Granite.registerApp(AppContainer, {
  appName: 'bingsu-shop',
  context,
});
