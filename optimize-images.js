// 빙수 PNG 일괄 최적화: width<=600px, PNG palette 8-bit
// 사용: cd /tmp/img-opt && npm install sharp && node /mnt/c/.../optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const bingsusDir = '/mnt/c/Users/82105/Claude/bingsu-shop/src/assets/bingsus';
const assetsDir = '/mnt/c/Users/82105/Claude/bingsu-shop/src/assets';
const outDir = '/mnt/c/Users/82105/Claude/bingsu-shop/img/optimized';

fs.mkdirSync(outDir, { recursive: true });

const files = [];
for (const f of fs.readdirSync(bingsusDir)) {
  if (f.endsWith('.png')) files.push(path.join(bingsusDir, f));
}
for (const f of ['empty-bowl.png', 'iced-bowl-1.png', 'iced-bowl-2.png']) {
  files.push(path.join(assetsDir, f));
}

(async () => {
  let totalBefore = 0, totalAfter = 0;
  for (const src of files) {
    const stat = fs.statSync(src);
    totalBefore += stat.size;
    const buf = await sharp(src)
      .resize({ width: 600, withoutEnlargement: true })
      .png({ quality: 85, compressionLevel: 9, palette: true })
      .toBuffer();
    const outFile = path.join(outDir, path.basename(src));
    fs.writeFileSync(outFile, buf);
    totalAfter += buf.length;
    console.log(`${path.basename(src).padEnd(22)}: ${(stat.size/1024).toFixed(0).padStart(5)}KB → ${(buf.length/1024).toFixed(0).padStart(5)}KB`);
  }
  console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB`);
})();
