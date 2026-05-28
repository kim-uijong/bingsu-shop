// raw_edit/ (사용자 수작업 크롭 + 원본 그릇) → 최적화해서 img/ 루트에 저장
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseDir = '/mnt/c/Users/82105/Claude/bingsu-shop/img';
const rawEditDir = path.join(baseDir, 'raw_edit');

// 빙수 mockup (사용자가 이미 크롭한 것)
const BINGSU = {
  'redbeen-bingsu.png':      'patbingsu.png',
  'ricecake-bingsu.png':     'injeolmi.png',
  'milk-binsu.png':          'milk.png',
  'choco-bingsu.png':        'choco.png',
  'cookie-bingsu.png':       'oreo.png',
  'strawberry-bingsu.png':   'strawberry.png',
  'melon-bingsu.png':        'melon.png',
  'mango-bingsu.png':        'mango.png',
  'peach-bingsu.png':        'peach.png',
  'blueberry-bingsu.png':    'blueberry.png',
  'matcha-bingsu.png':       'matcha.png',
  'blackseasame-bingsu.png': 'heukimja.png',
  'fruit-bingsu.png':        'fruitoverflow.png',
  'golden-bingsu.png':       'golden.png',
  'rainbow-bingsu.png':      'rainbow.png',
};

// 그릇 이미지 (이름에 공백 → 하이픈)
const BOWLS = {
  'empty-bowl.png':  'empty-bowl.png',
  'iced bowl.png':   'iced-bowl-1.png',
  'iced bowl-2.png': 'iced-bowl-2.png',
};

async function optimize(srcPath, dstPath) {
  const buf = await sharp(srcPath)
    .resize({ width: 600, withoutEnlargement: true })
    .png({ quality: 85, compressionLevel: 9, palette: true })
    .toBuffer();
  fs.writeFileSync(dstPath, buf);
  return buf.length;
}

(async () => {
  console.log('=== 빙수 mockup (15종) ===');
  let total = 0;
  for (const [src, dst] of Object.entries(BINGSU)) {
    const srcPath = path.join(rawEditDir, src);
    if (!fs.existsSync(srcPath)) {
      console.log(`⏭️  ${src}: raw_edit에 없음`);
      continue;
    }
    const bytes = await optimize(srcPath, path.join(baseDir, dst));
    total += bytes;
    console.log(`✅ ${dst.padEnd(22)} ${Math.round(bytes/1024)}KB`);
  }

  console.log('\n=== 그릇 (3종) ===');
  for (const [src, dst] of Object.entries(BOWLS)) {
    const srcPath = path.join(rawEditDir, src);
    if (!fs.existsSync(srcPath)) {
      console.log(`⏭️  ${src}: raw_edit에 없음`);
      continue;
    }
    const bytes = await optimize(srcPath, path.join(baseDir, dst));
    total += bytes;
    console.log(`✅ ${dst.padEnd(22)} ${Math.round(bytes/1024)}KB`);
  }

  console.log(`\n총 ${Math.round(total/1024)}KB`);
})();
