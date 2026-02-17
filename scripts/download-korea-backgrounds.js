/**
 * 한국 대표 배경 이미지 다운로드
 * Wikimedia Commons 등 무료 이미지를 image/korea/ 에 저장합니다.
 * 실행: node scripts/download-korea-backgrounds.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'image', 'korea');

// 로컬 파일명 -> 다운로드 URL (Commons Special:Redirect/file 은 자동 리다이렉트)
const IMAGES = {
  gwanghwamun: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Gwanghwamun_Plaza,_Seoul.jpg',
  gyeongbokgung: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Gyeongbok-gung_palace.jpg',
  namsan: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/N_Seoul_Tower_%2813952097192%29.jpg',
  hanriver: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Han_River%2C_Seoul_%2849531954927%29.jpg',
  bukchon: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Bukchon-ro_11-gil.jpg',
  dongdaemun: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dongdaemun_Design_Plaza_at_night,_Seoul,_Korea.jpg',
  insadong: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Seoul-Insadong-flea-market.jpg',
  cheongwadae: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Cheong_Wa_Dae_2019-04-15.jpg',
  namiseom: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Nami_Island_Autumn_1.jpg',
  gamcheon: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Gamcheon_Colored_Houses%2C_Busan%2C_Korea.jpg',
  haeundae: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Haeundae_Beach_Busan_South_Korea.jpg',
  gyeongju: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bulguksa_-_Daeungjeon_Hall_-_Gyeongju_-_South_Korea.jpg',
  jeonju: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Jeonju_Hanok_Village_01.jpg',
  jeju: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Seongsan_Ilchulbong_Jeju_Island_South_Korea.jpg',
  suwonhwaseong: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Suwon_Hwaseong_Fortress_South_Korea.jpg',
  sejongro: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Gwanghwamun_Square_20220806_06.jpg',
  sejong_lake: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Seonam_Lake_Park%2C_Ulsan.jpg',
  ieung_bridge: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Seonam_Lake_Park%2C_Ulsan.jpg',
  sejong_arboretum: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Korea-Gyeongbokgung-07.jpg',
  beartree_park: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Bukchon-ro_11-gil.jpg',
  sejong_central_park: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Han_River%2C_Seoul_%2849531954927%29.jpg',
  sejong_library: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Gyeongbok-gung_palace.jpg',
  presidential_archive: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Gyeongbok-gung_palace.jpg',
  government_rooftop: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Bukchon-ro_11-gil.jpg',
  jocheon_cherry: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Han_River%2C_Seoul_%2849531954927%29.jpg',
  gobok_park: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Han_River%2C_Seoul_%2849531954927%29.jpg',
  sejong_art_center: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Seoul-Insadong-flea-market.jpg',
  hanul_gil: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Gwanghwamun_Square_20220806_06.jpg',
};

function getUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { headers: { 'User-Agent': 'BORAHAE-Bot/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        getUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`${url} => ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0, fail = 0;
  for (const [localName, url] of Object.entries(IMAGES)) {
    const filePath = path.join(OUT_DIR, localName + '.jpg');
    try {
      process.stdout.write(`${localName}.jpg ... `);
      const buf = await getUrl(url);
      fs.writeFileSync(filePath, buf);
      console.log('OK');
      ok++;
    } catch (e) {
      console.log('FAIL ' + (e.message || e));
      fail++;
    }
  }
  console.log(`\n완료: ${ok}개 저장, ${fail}개 실패`);
}

main().catch((e) => { console.error(e); process.exit(1); });
