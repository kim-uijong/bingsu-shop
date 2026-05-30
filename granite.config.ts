import { router } from '@granite-js/plugin-router';
import { hermes } from '@granite-js/plugin-hermes';
import { defineConfig } from '@granite-js/react-native/config';
import { appsInToss } from '@apps-in-toss/framework/plugins';

// ait build로 .ait artifact를 만들려면 appsInToss plugin 필수.
// ⚠️ appType: 'general' 이 있어야 토스가 "비게임 네비게이션 바"
//    (앱이름 + 더보기 + X)를 정식으로 띄운다. 없으면 뒤로가기만 있는
//    최소 바만 표시됨. 'partner'는 typia 검증에서 거부되고 'general'|'game'만 허용.

export default defineConfig({
  appName: 'bingsu-shop',
  scheme: 'intoss',
  plugins: [
    router(),
    hermes(),
    appsInToss({
      // 비게임 미니앱 → 흰 배경 네비바(로고+이름+더보기+X) 활성화
      appType: 'general',
      // 네비바에 뒤로가기 + 홈 버튼 명시적 활성화
      navigationBar: {
        withBackButton: true,
        withHomeButton: true,
      },
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
