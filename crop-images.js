// 빙수 mockup PNG에서 캐릭터 중심만 크롭 (위 15%, 아래 25% 제거)
// 원본은 img/raw/, 결과는 img/ 루트에 덮어쓰기
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseDir = '/mnt/c/Users/82105/Claude/bingsu-shop/img';

// 원본 파일명 → 표준 파일명
const MAPPING = {
  'redbeen-bingsu.png':      'patbingsu.png',
  'ricecake-bingsu.png':     'injeolmi.png',
  'milk-binsu.png':          'milk.png',
  'choco-bingsu.png':        'choco.png',
  'cookie-bingsu.png':       'oreo.png',
  'strawberry-bingsu.png':   'strawberry.png',
  'melon-bingsu.png':        'melon.png',
  'mango-bingsu-img.png':    'mango.png',
  'peach-bingsu.png':        'peach.png',
  'blueberry-bingsu.png':    'blueberry.png',
  'matcha-bingsu.png':       'matcha.png',
  'blackseasame-bingsu.png': 'heukimja.png',
  'fruit-bingsu.png':        'fruitoverflow.png',
  'golden-bingsu.png':       'golden.png',
  'rainbow-bingsu.png':      'rainbow.png',
};

// 크롭 비율: 위 22% 제거, 중앙 42% 유지, 아래 36% 제거
// → header·tag·말풍선·name·button 다 빠지고 그릇+캐릭터만 정확히
const TOP_RATIO = 0.22;
const KEEP_RATIO = 0.42;

(async () => {
  let total = 0;
  for (const [src, dst] of Object.entries(MAPPING)) {
    const srcPath = path.join(baseDir, 'raw', src);
    const dstPath = path.join(baseDir, dst);

    if (!fs.existsSync(srcPath)) {
      console.log(`⏭️  ${src}: 원본 없음`);
      continue;
    }

    const meta = await sharp(srcPath).metadata();
    const top = Math.floor(meta.height * TOP_RATIO);
    const cropHeight = Math.floor(meta.height * KEEP_RATIO);

    const buf = await sharp(srcPath)
      .extract({ left: 0, top, width: meta.width, height: cropHeight })
      .resize({ width: 600, withoutEnlargement: true })
      .png({ quality: 85, compressionLevel: 9, palette: true })
      .toBuffer();

    fs.writeFileSync(dstPath, buf);
    const kb = Math.round(buf.length / 1024);
    console.log(`✅ ${dst.padEnd(20)} ${meta.width}×${meta.height} → 크롭 → ${kb}KB`);
    total += buf.length;
  }
  console.log(`\n총 ${Math.round(total / 1024)}KB`);
})();
