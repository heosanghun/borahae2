/**
 * 다운로드된 이미지를 누락된 항목에 복사 (모든 카드에 이미지 표시)
 * 실행: node scripts/copy-korea-placeholders.js
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'image', 'korea');

const HAVE = ['gwanghwamun', 'gyeongbokgung', 'namsan', 'hanriver', 'bukchon', 'dongdaemun', 'sejongro', 'sejong_lake'];
const COPY_MAP = {
  insadong: 'bukchon',
  cheongwadae: 'gyeongbokgung',
  namiseom: 'hanriver',
  gamcheon: 'bukchon',
  haeundae: 'hanriver',
  gyeongju: 'gyeongbokgung',
  jeonju: 'bukchon',
  jeju: 'sejong_lake',
  suwonhwaseong: 'gyeongbokgung',
  ieung_bridge: 'sejong_lake',
  sejong_arboretum: 'sejong_lake',
  beartree_park: 'hanriver',
  sejong_central_park: 'sejong_lake',
  sejong_library: 'gyeongbokgung',
  presidential_archive: 'gyeongbokgung',
  government_rooftop: 'gwanghwamun',
  jocheon_cherry: 'hanriver',
  gobok_park: 'sejong_lake',
  sejong_art_center: 'dongdaemun',
  hanul_gil: 'gwanghwamun',
};

let n = 0;
for (const [dest, src] of Object.entries(COPY_MAP)) {
  const srcPath = path.join(OUT, src + '.jpg');
  const destPath = path.join(OUT, dest + '.jpg');
  if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(dest + '.jpg <- ' + src + '.jpg');
    n++;
  }
}
console.log('복사 완료: ' + n + '개');
