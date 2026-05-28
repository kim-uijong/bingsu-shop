import { router } from '@granite-js/plugin-router';
import { hermes } from '@granite-js/plugin-hermes';
import { defineConfig } from '@granite-js/react-native/config';
import { appsInToss } from '@apps-in-toss/framework/plugins';

// 토스 공식 예시 적용. initialAccessoryButton은 (선택사항)이라 제외.
// 컬러 빙수 아이콘은 brand.icon 으로 이미 사용 중이며, 액세서리 버튼은
// 모노톤 아이콘만 지원해 빙수 아이콘 적용 불가.

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
      },
    }),
  ],
});
