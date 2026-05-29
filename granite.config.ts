import { router } from '@granite-js/plugin-router';
import { hermes } from '@granite-js/plugin-hermes';
import { defineConfig } from '@granite-js/react-native/config';
import { appsInToss } from '@apps-in-toss/framework/plugins';

// 친구 strawberry-farm-share/app 은 appsInToss plugin 없이도 정상 출시.
// 우리는 ait build로 .ait artifact를 만들어야 하므로 plugin 필수.
// 다만 옵션은 minimal — brand(필수) + permissions(필수)만.
// navigationBar / appType / bridgeColorMode 등 모두 제거.
// 호스트가 콘솔 등록 정보만으로 헤더 자동 활성화하도록 유도.

export default defineConfig({
  appName: 'bingsu-shop',
  scheme: 'intoss',
  plugins: [
    router(),
    hermes(),
    appsInToss({
      // SDK 2.6.1에서 'partner' 재시도. 이전 2.6.0에서는 typia 거부했지만
      // 패치 버전에서 검증 로직 완화됐을 가능성 검증.
      appType: 'partner' as 'general',
      brand: {
        // ⚠️ 콘솔 '앱 정보 등록'에 제출된 이름과 정확히 일치해야 함
        displayName: '빙수만들고 포인트 받기',
        primaryColor: '#00C4FF',
        icon: 'https://raw.githubusercontent.com/kim-uijong/bingsu-asset/main/icon.png',
      },
      permissions: [],
    }),
  ],
});
