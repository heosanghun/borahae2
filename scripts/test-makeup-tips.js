/**
 * 화장 전/후 아래 "전문 메이크업 포인트" 텍스트 로직 검증
 * node scripts/test-makeup-tips.js
 */
function getMakeupTipsBySeason(season) {
  var tips = {
    '봄웜': '· 베이스: 쿠션·파운데이션은 웜톤 아이보리·골드 베이스로 통일하고, 피부 결을 자연스럽게 덮어줍니다.\n· 립: 코랄, 피치, 오렌지 레드 등 따뜻한 톤의 립으로 생기를 더합니다.\n· 블러셔: 피치·코랄 블러셔를 광대뼈 위에서 살짝 대비시켜 건강한 윤기를 연출합니다.\n· 아이: 브라운·골드·피치 계열 아이섀도로 부드럽게 링클하고, 아이라인은 갈색으로 자연스럽게 마무리합니다.',
    '여름쿨': '· 베이스: 핑크·쿨 베이스 파운데이션으로 맑고 시원한 피부 톤을 유지합니다.\n· 립: 로즈, 멜론 핑크, 라벤더 톤 립으로 쿨한 인상을 더합니다.\n· 블러셔: 로즈·라벤더 블러셔를 살짝만 톤업해 청량한 느낌을 줍니다.\n· 아이: 그레이·실버·로즈 계열 아이섀도와 갈색 아이라인으로 시원한 눈매를 강조합니다.',
    '가을웜': '· 베이스: 골드·베이지 베이스로 깊이 있는 웜톤을 살립니다.\n· 립: 브릭, 테라코타, 머드 로즈 등 어스톤 립으로 고급스러움을 더합니다.\n· 블러셔: 테라코타·브릭 블러셔로 광대를 자연스럽게 강조합니다.\n· 아이: 브라운·버건디·골드 아이섀도와 소프트 아이라인으로 깊이감을 연출합니다.',
    '겨울쿨': '· 베이스: 쿨 베이스·핑크 톤업으로 맑고 선명한 피부를 표현합니다.\n· 립: 레드, 베리, 딥 로즈 등 시원한 레드 톤 립을 포인트로 줍니다.\n· 블러셔: 쿨 핑크·플럼 블러셔로 얼굴 윤곽을 살립니다.\n· 아이: 그레이·네이비·실버 아이섀도와 선명한 아이라인으로 시크한 눈매를 완성합니다.'
  };
  if (season && tips[season]) return tips[season];
  return '· 베이스: 자신의 피부 톤(웜/쿨)에 맞는 파운데이션으로 균일한 밝기를 만듭니다.\n· 립·블러셔: 퍼스널 컬러에 맞는 톤으로 입술과 광대를 포인트 줍니다.\n· 아이: 톤에 맞는 아이섀도와 자연스러운 아이라인으로 눈매를 정돈합니다.';
}

const seasons = ['봄웜', '여름쿨', '가을웜', '겨울쿨'];
let ok = true;

for (const s of seasons) {
  const text = getMakeupTipsBySeason(s);
  if (!text || typeof text !== 'string') {
    console.error('FAIL:', s, '- no string');
    ok = false;
  } else if (!text.includes('·') || !text.includes('베이스') || !text.includes('립')) {
    console.error('FAIL:', s, '- missing expected content');
    ok = false;
  } else {
    console.log('OK:', s, '- length', text.length);
  }
}

const defaultText = getMakeupTipsBySeason(null);
if (!defaultText || !defaultText.includes('·')) {
  console.error('FAIL: default tips');
  ok = false;
} else {
  console.log('OK: default tips - length', defaultText.length);
}

if (ok) {
  console.log('\n[전문 메이크업 포인트] 텍스트 로직 검증 통과.');
  process.exit(0);
} else {
  console.error('\n[전문 메이크업 포인트] 검증 실패.');
  process.exit(1);
}
