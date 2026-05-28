#!/usr/bin/env node
/**
 * postinstall — Windows 빌드에 필요한 환경 보정
 *
 * 1) patch-package — node_modules 안의 패치 적용 (plugin-micro-frontend, plugin-compat)
 * 2) Windows에서만:
 *    - hermesc.exe + DLL을 plugin-compat 안에서 react-native/sdks/hermesc/로 복사
 *    - @swc/core-win32-x64-msvc 바인딩이 빠져 있으면 설치
 *
 * macOS/Linux에서는 (1)만 실행 (2)는 no-op.
 *
 * 메모리에 기록된 [[project-build-env]] 패치들을 자동화한 것.
 */
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

function log(...args) {
  console.log('[postinstall]', ...args);
}

// (1) patch-package
try {
  execSync('node node_modules/patch-package/index.js', {
    cwd: ROOT,
    stdio: 'inherit',
  });
} catch (err) {
  console.error('[postinstall] patch-package failed:', err.message);
  // 부분적으로 적용된 상태가 더 위험하므로 종료
  process.exit(1);
}

// (2) Windows 전용 보정
if (process.platform !== 'win32') {
  log('non-Windows platform → skip Windows-only fixes');
  process.exit(0);
}

// (2a) hermesc.exe 복사
const HERMESC_SRC = path.join(
  ROOT,
  'node_modules/@apps-in-toss/plugin-compat/node_modules/react-native/sdks/hermesc/win64-bin'
);
const HERMESC_DST_DIR = path.join(ROOT, 'node_modules/react-native/sdks/hermesc');
const HERMESC_DST = path.join(HERMESC_DST_DIR, 'win64-bin');

if (!fs.existsSync(path.join(HERMESC_DST, 'hermesc.exe'))) {
  if (!fs.existsSync(HERMESC_SRC)) {
    log('WARNING: hermesc win64-bin not found in plugin-compat — skip');
  } else {
    fs.mkdirSync(HERMESC_DST_DIR, { recursive: true });
    fs.cpSync(HERMESC_SRC, HERMESC_DST, { recursive: true });
    log(`copied hermesc.exe + DLLs → ${path.relative(ROOT, HERMESC_DST)}`);
  }
} else {
  log('hermesc.exe already present');
}

// (2b) @swc/core Windows binding
const SWC_WIN = path.join(ROOT, 'node_modules/@swc/core-win32-x64-msvc');
if (!fs.existsSync(SWC_WIN)) {
  // @swc/core와 정확히 같은 버전을 깔아야 함
  let swcVersion;
  try {
    swcVersion = require(path.join(ROOT, 'node_modules/@swc/core/package.json')).version;
  } catch {
    log('WARNING: @swc/core not found — skip win32 binding install');
    process.exit(0);
  }
  log(`installing @swc/core-win32-x64-msvc@${swcVersion}...`);
  try {
    execSync(
      `npm install --no-save --no-audit --no-fund @swc/core-win32-x64-msvc@${swcVersion}`,
      { cwd: ROOT, stdio: 'inherit' }
    );
  } catch (err) {
    log('WARNING: failed to install @swc/core-win32-x64-msvc:', err.message);
  }
} else {
  log('@swc/core-win32-x64-msvc already installed');
}
