import { router } from '@granite-js/plugin-router';
import { hermes } from '@granite-js/plugin-hermes';
import { defineConfig } from '@granite-js/react-native/config';
import { appsInToss } from '@apps-in-toss/framework/plugins';

// 토스 공식 예시 그대로 모든 옵션 적용.
// bridgeColorMode + navigationBar (withBackButton/withHomeButton/initialAccessoryButton)
// SDK 2.6.0 typia 검증 통과 여부 빌드로 확인.

export default defineConfig({
  appName: 'bingsu-shop',
  scheme: 'intoss',
  plugins: [
    router(),
    hermes(),
    appsInToss({
      brand: {
        displayName: '빙수만들고 포인트 받기',
        primaryColor: '#00C4FF',
        icon: 'https://raw.githubusercontent.com/kim-uijong/bingsu-asset/main/icon.png',
        bridgeColorMode: 'basic',
      } as {
        displayName: string;
        primaryColor: string;
        icon: string;
        bridgeColorMode: string;
      },
      permissions: [],
      navigationBar: {
        withBackButton: true,
        withHomeButton: true,
        initialAccessoryButton: {
          icon: {
            name: 'icon-heart-mono',
          },
          id: 'heart',
          title: '하트',
        },
      },
    }),
  ],
});
