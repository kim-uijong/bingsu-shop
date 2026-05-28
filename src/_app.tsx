import React, { type PropsWithChildren } from 'react';
import { Granite, type InitialProps } from '@granite-js/react-native';
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

export default Granite.registerApp(AppContainer, {
  appName: 'bingsu-shop',
  context,
});
