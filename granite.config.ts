import { router } from '@granite-js/plugin-router';
import { hermes } from '@granite-js/plugin-hermes';
import { defineConfig } from '@granite-js/react-native/config';
import { appsInToss } from '@apps-in-toss/framework/plugins';

// [실험] export default defineConfig 전체 주석 처리.
// ait build가 config 없는 상태에서 어떻게 동작하는지 + 어떤 에러가
// 나오는지 확인 목적.

// export default defineConfig({
//   appName: 'bingsu-shop',
//   scheme: 'intoss',
//   plugins: [
//     router(),
//     hermes(),
//     appsInToss({
//       brand: {
//         displayName: '빙수만들고 포인트 받기',
//         primaryColor: '#00C4FF',
//         icon: 'https://raw.githubusercontent.com/kim-uijong/bingsu-asset/main/icon.png',
//       },
//       permissions: [],
//     }),
//   ],
// });
