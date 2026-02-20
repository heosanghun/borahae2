/**
 * 이름 → 자·모음 분리 → 28 한글 페르소나 서사
 * 이미지: image/name/ja(자음14), image/name/mo(모음14), image/name/hangeulalpabat(28 자모 흰배경), image/name/hangeulalpabat/only(28 자모 배경제거)
 */
(function () {
  'use strict';

  var CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');
  var JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split('');
  var JONG = ('\u0000ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ').split(''); // [0]=empty
  // 겹받침 → 기본 자모 2개로 분리 (모두 입력한 자·모음이 쭉 나열되도록)
  var JONG_EXPAND = { 'ㄳ':['ㄱ','ㅅ'],'ㄵ':['ㄴ','ㅈ'],'ㄶ':['ㄴ','ㅎ'],'ㄺ':['ㄹ','ㄱ'],'ㄻ':['ㄹ','ㅁ'],'ㄼ':['ㄹ','ㅂ'],'ㄽ':['ㄹ','ㅅ'],'ㄾ':['ㄹ','ㅌ'],'ㄿ':['ㄹ','ㅍ'],'ㅀ':['ㄹ','ㅎ'],'ㅄ':['ㅂ','ㅅ'] };
  // 쌍자음 5개 → 쌍둥이 컨셉: 같은 기본 자음 2개로 확장 (ㄲ→ㄱㄱ, ㄸ→ㄷㄷ, ㅃ→ㅂㅂ, ㅆ→ㅅㅅ, ㅉ→ㅈㅈ)
  var SANG_EXPAND = { 'ㄲ':['ㄱ','ㄱ'],'ㄸ':['ㄷ','ㄷ'],'ㅃ':['ㅂ','ㅂ'],'ㅆ':['ㅅ','ㅅ'],'ㅉ':['ㅈ','ㅈ'] };

  // 복합 모음 → 기본 모음(14) 매핑 (ㅘ→ㅗ, ㅝ→ㅜ 등). 우리 페르소나는 기본 14모음만 있음.
  var JUNG_TO_BASIC = { 'ㅘ':'ㅗ','ㅙ':'ㅐ','ㅚ':'ㅗ','ㅝ':'ㅜ','ㅞ':'ㅔ','ㅟ':'ㅣ','ㅢ':'ㅡ' };

  // 자음(14+쌍/겹자음) → 페르소나 파일명(ja 폴더). 쌍자음은 해당 단자음과 동일 페르소나로.
  var JA_MAP = { 'ㄱ':'golong','ㄲ':'golong','ㄴ':'nolong','ㄷ':'dolong','ㄸ':'dolong','ㄹ':'lolong','ㅁ':'molong','ㅂ':'bolong','ㅃ':'bolong','ㅅ':'solong','ㅆ':'solong','ㅇ':'olong','ㅈ':'jolong','ㅉ':'jolong','ㅊ':'cholong','ㅋ':'kolong','ㅌ':'tolong','ㅍ':'polong','ㅎ':'holong','ㄳ':'golong','ㄵ':'nolong','ㄶ':'nolong','ㄺ':'lolong','ㄻ':'molong','ㄼ':'lolong','ㄽ':'solong','ㄾ':'lolong','ㄿ':'polong','ㅀ':'lolong','ㅄ':'bolong' };
  // 모음(14) → 페르소나 파일명(mo 폴더, 한글 이름)
  var MO_MAP = { 'ㅏ':'아롱','ㅐ':'애롱','ㅑ':'야롱','ㅒ':'얍롱','ㅓ':'어롱','ㅔ':'에이롱','ㅕ':'여롱','ㅖ':'예롱','ㅗ':'오롱','ㅛ':'요롱','ㅜ':'우롱','ㅠ':'유롱','ㅡ':'으롱','ㅣ':'이롱' };

  // 자음/모음 → 페르소나 이름·역할 (표시용). ㅗ→오롱(웃음꽃), ㅏ→아롱(화가)
  var JA_INFO = { 'ㄱ':{ name:'고롱', role:'발명가' },'ㄴ':{ name:'노롱', role:'가수' },'ㄷ':{ name:'도롱', role:'도우미' },'ㄹ':{ name:'로롱', role:'요리사' },'ㅁ':{ name:'모롱', role:'뚝딱이' },'ㅂ':{ name:'보롱', role:'천문학자' },'ㅅ':{ name:'소롱', role:'시인' },'ㅇ':{ name:'오롱', role:'웃음꽃' },'ㅈ':{ name:'조롱', role:'상상가' },'ㅊ':{ name:'초롱', role:'댄서' },'ㅋ':{ name:'코롱', role:'파수꾼' },'ㅌ':{ name:'토롱', role:'달변가' },'ㅍ':{ name:'포롱', role:'탐정' },'ㅎ':{ name:'호롱', role:'천하장사' } };
  var MO_INFO = { 'ㅏ':{ name:'아롱', role:'화가' },'ㅐ':{ name:'애롱', role:'선생님' },'ㅑ':{ name:'야롱', role:'전령사' },'ㅒ':{ name:'얍롱', role:'사진가' },'ㅓ':{ name:'어롱', role:'정원사' },'ㅔ':{ name:'에이롱', role:'길잡이' },'ㅕ':{ name:'여롱', role:'치유사' },'ㅖ':{ name:'예롱', role:'연주가' },'ㅗ':{ name:'올롱', role:'마법사' },'ㅛ':{ name:'요롱', role:'동물 조련사' },'ㅜ':{ name:'우롱', role:'기록가' },'ㅠ':{ name:'유롱', role:'해양 탐험가' },'ㅡ':{ name:'으롱', role:'명상가' },'ㅣ':{ name:'이롱', role:'재단사' } };

  var BASE = 'image/name';
  var MO_SUFFIX = '_draphed_01_896x1200.png';
  // 모음별 실제 파일 접미사 (아롱만 944x1120, 나머지는 896x1200)
  var MO_SUFFIX_BY_NAME = { '아롱': '_draphed_01_944x1120.png' };

  /** 역할별 에피소드 한 줄 (주어 제외한 동작). 스토리 풍부화용 */
  var ROLE_EPISODES = {
    '시인': ['하늘을 보며 시 한 줄을 읊더니 모두를 감동시켰어요.', '종이에 낙서처럼 시를 써 내려가며 오늘의 이야기를 남겼어요.'],
    '정원사': ['꽃잎을 하늘에 뿌리며 정원을 꾸몄어요. 사계절 꽃이 피어났죠.', '씨앗을 나눠 주며 "이걸 심으면 네 마음도 자랄 거야"라고 속삭였어요.'],
    '가수': ['갑자기 노래를 부르기 시작했어요. 숲에 활기가 넘쳤죠.', '무대 위에 선 것처럼 목소리를 높이더니 모두가 따라 흥얼거렸어요.'],
    '발명가': ['고장 난 오래된 시계를 뚝딱 고쳐서 모두를 놀라게 했어요.', '새로운 장난감을 만들더니 "이건 비밀 발명품이야"라고 말했어요.'],
    '도우미': ['누군가 힘들어하자 가장 먼저 달려가 손을 내밀었어요.', '모두의 짐을 조금씩 나눠 들며 든든한 버팀목이 되어 주었어요.'],
    '요리사': ['간을 보더니 "맛있는 건 마음이랑 같이 먹는 거야" 하며 요리를 대접했어요.', '맛있는 걸 만들면 슬픈 마음도 금세 사라진대요.'],
    '뚝딱이': ['나무와 흙으로 작은 의자를 만들더니 "여기 앉아 봐!" 했어요.', '숲속 다리를 손수 고쳐서 모두가 안전히 건넜어요.'],
    '천문학자': ['밤하늘 별을 가리키며 "저기 보면 길을 찾을 수 있어" 알려줬어요.', '망원경을 들고 오며 우주의 비밀을 재미있게 풀어줬어요.'],
    '웃음꽃': ['엉뚱한 농담을 하더니 모두가 배꼽을 잡고 웃었어요.', '우울한 분위기를 한순간에 바꿔 놓으며 즐거움을 선사했어요.'],
    '마법사': ['엉뚱한 마술을 보여 주더니 모두가 "우와!" 소리를 냈어요.', '상상을 현실로 만드는 마법으로 놀라움과 웃음을 선물했어요.'],
    '상상가': ['잠깐 잠들었다 깨어나더니 "꿈에서 대박 아이디어 났어!" 외쳤어요.', '꿈속 이야기를 하며 모두를 상상의 나라로 이끌었어요.'],
    '댄서': ['음악이 나오자 몸이 먼저 반응해 춤을 추기 시작했어요.', '리듬에 맞춰 춤을 추더니 친구들에게까지 열정이 전염됐어요.'],
    '파수꾼': ['키가 커서 멀리 보이다가 "저기 뭔가 온다!" 하고 알려줬어요.', '숲을 지키며 모두가 안심하고 놀 수 있게 해줬어요.'],
    '달변가': ['어려운 문제가 생기자 지혜롭게 해결책을 제시했어요.', '아는 것을 조리 있게 설명하더니 모두가 고개를 끄덕였어요.'],
    '탐정': ['작은 단서를 발견하더니 "이거면 진실을 찾을 수 있어!" 했어요.', '궁금한 건 끝까지 파헤치며 미스터리를 풀어냈어요.'],
    '천하장사': ['무거운 것을 번쩍 들어 옮기며 "나한테 맡겨!" 했어요.', '약한 친구를 지키며 힘으로 든든한 의리가 되어 줬어요.'],
    '화가': ['붓을 들어 알록달록 그림을 그리더니 밋밋한 벽이 예술이 됐어요.', '색깔로 오늘의 기분을 그려 내며 모두에게 선물했어요.'],
    '전령사': ['바람처럼 달려가며 "급한 소식이야!" 하고 소식을 전했어요.', '날쌘돌이처럼 심부름을 도맡아 해주었어요.'],
    '치유사': ['아픈 친구에게 약초를 건네며 마음까지 어루만져 줬어요.', '따뜻하게 치료하더니 상처가 금방 나았어요.'],
    '마술사': ['엉뚱한 마술을 보여 주더니 모두가 "우와!" 소리를 냈어요.', '상상을 현실로 만드는 마법으로 놀라움과 웃음을 선물했어요.'],
    '동물 조련사': ['숲속 동물과 대화하더니 사나운 친구도 순해졌어요.', '동물들과 소통하며 모두가 한자리에서 지내게 해줬어요.'],
    '기록가': ['오늘 일을 한 줄 한 줄 꼼꼼히 기록했어요. 걸어 다니는 백과사전이죠.', '모든 이야기를 책에 남기며 "이건 소중한 기록이야" 했어요.'],
    '명상가': ['친구들이 싸우자 마음의 중심을 잡아 주며 평정심을 되찾게 했어요.', '흔들리지 않는 평정으로 모두를 편안하게 해줬어요.'],
    '재단사': ['찢어진 옷을 정교하게 꿰매 주며 "딱 맞는 게 최고지" 했어요.', '예쁜 옷을 지어 주더니 찢어진 마음도 꿰매 준다고 했어요.'],
    '선생님': ['어려운 걸 친절하게 설명하더니 금방 이해가 됐어요.', '모르는 것을 쉽게 가르쳐 주며 모두가 "아하!" 했어요.'],
    '사진가': ['"얍!" 하고 셔터를 누르며 특별한 순간을 포착했어요.', '행복한 순간을 놓치지 않고 추억으로 남겼어요.'],
    '길잡이': ['새로운 길을 안내하며 가장 안전한 길로 이끌어 줬어요.', '지도를 펼쳐 보여 주며 모험의 첫걸음을 도왔어요.'],
    '연주가': ['노래에 맞춰 환상적인 반주를 들려줬어요.', '여러 악기를 다루며 숲에 음악이 넘치게 했어요.'],
    '해양 탐험가': ['물속 보물 이야기를 하더니 모두가 신나서 귀를 기울였어요.', '깊은 강 바닥 탐험 이야기로 상상의 나래를 펼쳐 줬어요.']
  };
  function hasJong(str) {
    if (!str || str.length === 0) return false;
    var last = str.charCodeAt(str.length - 1);
    if (last < 0xAC00 || last > 0xD7A3) return false;
    return (last - 0xAC00) % 28 !== 0;
  }
  function subject(name) { return name + (hasJong(name) ? '이' : '가'); }
  function topic(name) { return name + (hasJong(name) ? '은' : '는'); }
  function roleEpisode(agent, idx) {
    var role = (agent && agent.role) ? agent.role : '';
    var arr = ROLE_EPISODES[role];
    var snippet = (arr && arr.length) ? arr[idx % arr.length] : (agent ? topic(agent.name) + ' ' + (role || '친구') + '답게 함께해 줬어요.' : '');
    if (!agent) return snippet;
    return '<strong>' + agent.name + '</strong>' + (hasJong(agent.name) ? '이' : '가') + ' ' + (snippet || (role ? role + '답게 활약했어요.' : '함께했어요.'));
  }

  // 로마자(영어 이름) → 한글 표기 (Revised Romanization 역변환, 긴 패턴 우선)
  var ROMAN_CHO = [
    ['kk','ㄲ'],['gg','ㄲ'],['dd','ㄸ'],['tt','ㄸ'],['bb','ㅃ'],['pp','ㅃ'],['ss','ㅆ'],['jj','ㅉ'],
    ['ch','ㅊ'],['sh','ㅅ'],['ph','ㅍ'],
    ['g','ㄱ'],['k','ㅋ'],['n','ㄴ'],['d','ㄷ'],['t','ㅌ'],['r','ㄹ'],['l','ㄹ'],['m','ㅁ'],['b','ㅂ'],['p','ㅍ'],['s','ㅅ'],['j','ㅈ'],['h','ㅎ'],['c','ㅋ'],['q','ㅋ'],['x','ㅅ'],['z','ㅈ'],['f','ㅍ'],['v','ㅂ'],['w','ㅇ']
  ];
  var ROMAN_JUNG = [
    ['yae','ㅒ'],['wae','ㅙ'],['we','ㅞ'],['wo','ㅝ'],['wi','ㅟ'],['yeo','ㅕ'],['ye','ㅖ'],['ya','ㅑ'],['yo','ㅛ'],['yu','ㅠ'],
    ['ae','ㅐ'],['eo','ㅓ'],['eu','ㅡ'],['oe','ㅚ'],['ui','ㅢ'],['wa','ㅘ'],
    ['a','ㅏ'],['e','ㅔ'],['e','ㅔ'],['i','ㅣ'],['o','ㅗ'],['u','ㅜ']
  ];
  var ROMAN_JONG = [
    ['kk','ㄲ'],['gs','ㄳ'],['nj','ㄵ'],['nh','ㄶ'],['lg','ㄺ'],['lm','ㄻ'],['lb','ㄼ'],['ls','ㄽ'],['lt','ㄾ'],['lp','ㄿ'],['lh','ㅀ'],
    ['g','ㄱ'],['n','ㄴ'],['d','ㄷ'],['r','ㄹ'],['l','ㄹ'],['m','ㅁ'],['b','ㅂ'],['s','ㅅ'],['ng','ㅇ'],['j','ㅈ'],['ch','ㅊ'],['k','ㅋ'],['t','ㅌ'],['p','ㅍ'],['h','ㅎ']
  ];
  var JONG_IDX = {}; (function(){ for (var i = 0; i < JONG.length; i++) JONG_IDX[JONG[i]] = i; })();

  /** 로마자(영어 이름) → 한글 표기. Revised Romanization 역변환. */
  function romanToHangul(roman) {
    if (!roman || !/^[a-zA-Z\s\-']+$/.test(roman)) return '';
    var s = roman.replace(/\s+/g, ' ').trim().replace(/\s|-|'/g, '').toLowerCase();
    if (!s || s.length > 20) return '';
    var out = '';
    var pos = 0;
    while (pos < s.length) {
      var rest = s.slice(pos);
      var cho = 'ㅇ', choLen = 0, jung = null, jong = null;
      for (var i = 0; i < ROMAN_CHO.length; i++) {
        if (rest.indexOf(ROMAN_CHO[i][0]) === 0) {
          cho = ROMAN_CHO[i][1];
          choLen = ROMAN_CHO[i][0].length;
          break;
        }
      }
      pos += choLen;
      rest = s.slice(pos);
      for (var i = 0; i < ROMAN_JUNG.length; i++) {
        if (rest.indexOf(ROMAN_JUNG[i][0]) === 0) {
          jung = ROMAN_JUNG[i][1];
          pos += ROMAN_JUNG[i][0].length;
          break;
        }
      }
      if (!jung) { pos++; continue; }
      rest = s.slice(pos);
      for (var i = 0; i < ROMAN_JONG.length; i++) {
        if (rest.indexOf(ROMAN_JONG[i][0]) === 0) {
          jong = ROMAN_JONG[i][1];
          pos += ROMAN_JONG[i][0].length;
          break;
        }
      }
      var choIdx = CHO.indexOf(cho);
      if (choIdx < 0) choIdx = 11;
      var jungIdx = JUNG.indexOf(jung);
      if (jungIdx < 0) jungIdx = 0;
      var jongIdx = (jong && JONG_IDX[jong] !== undefined) ? JONG_IDX[jong] : 0;
      out += String.fromCharCode(0xAC00 + choIdx * 588 + jungIdx * 28 + jongIdx);
    }
    return out;
  }

  /** 입력이 한글만 있는지 여부 */
  function isHangulOnly(str) {
    if (!str) return false;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 0xAC00 || c > 0xD7A3) return false;
    }
    return true;
  }

  function normalizeJung(j) {
    return JUNG_TO_BASIC[j] || j;
  }

  /** 한글 음절 하나를 초성·중성·종성(자·모음) 배열로 분해. 쌍자음(ㄲ,ㄸ,ㅃ,ㅆ,ㅉ)은 쌍둥이처럼 기본자음 2개로, 겹받침은 기본 자모 2개로 풀어서 반환. */
  function decomposeOne(ch) {
    var code = ch.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return []; // 한글이 아니면 빈 배열
    var idx = code - 0xAC00;
    var choIdx = Math.floor(idx / 588);
    var jungIdx = Math.floor((idx % 588) / 28);
    var jongIdx = idx % 28;
    var jungChar = JUNG[jungIdx];
    var basicJung = normalizeJung(jungChar); // ㅘ→ㅗ, ㅝ→ㅜ 등
    var choChar = CHO[choIdx];
    var arr = [];
    var choArr = SANG_EXPAND[choChar] || [choChar];
    for (var c = 0; c < choArr.length; c++) arr.push(choArr[c]);
    arr.push(basicJung);
    // [수정] 복합 모음 정밀 분해 (홍길동 'ㅏ' 중복 방지 & 환 'ㅏ' 누락 방지)
    // ㅘ(wa) -> ㅗ + ㅏ
    if (jungChar === 'ㅘ') arr.push('ㅏ');
    // ㅝ(wo) -> ㅜ + ㅓ
    if (jungChar === 'ㅝ') arr.push('ㅓ');
    // ㅢ(ui) -> ㅡ + ㅣ
    if (jungChar === 'ㅢ') arr.push('ㅣ');
    
    if (jongIdx > 0) {
      var jongChar = JONG[jongIdx];
      var sangJong = SANG_EXPAND[jongChar];
      if (sangJong) {
        for (var s = 0; s < sangJong.length; s++) arr.push(sangJong[s]);
      } else {
        var expanded = JONG_EXPAND[jongChar];
        if (expanded) {
          for (var k = 0; k < expanded.length; k++) arr.push(expanded[k]);
        } else {
          arr.push(jongChar);
        }
      }
    }
    return arr;
  }

  /** 이름 문자열을 자·모음 순서 배열로 분해 (초성→중성→종성, 글자 순) */
  function decomposeName(name) {
    var list = [];
    for (var i = 0; i < name.length; i++) {
      var arr = decomposeOne(name[i]);
      for (var j = 0; j < arr.length; j++) list.push(arr[j]);
    }
    return list;
  }

  // 쌍/겹자음 → 표시용 단자음 (이름·역할은 14자음 기준)
  var JA_DISPLAY = { 'ㄲ':'ㄱ','ㄸ':'ㄷ','ㅃ':'ㅂ','ㅆ':'ㅅ','ㅉ':'ㅈ','ㄳ':'ㄱ','ㄵ':'ㄴ','ㄶ':'ㄴ','ㄺ':'ㄹ','ㄻ':'ㅁ','ㄼ':'ㄹ','ㄽ':'ㅅ','ㄾ':'ㄹ','ㄿ':'ㅍ','ㅀ':'ㄹ','ㅄ':'ㅂ' };

  /** 자모 하나가 자음인지 모음인지 판별 후 페르소나 이미지 경로·정보 반환 */
  function getAgentForJamo(jamo) {
    var isJa = JA_MAP.hasOwnProperty(jamo);
    var charName, role, imgUrl, jamoImgUrl, jamoOnlyUrl;
    if (isJa) {
    var displayJa = JA_DISPLAY[jamo] || jamo;
      charName = JA_INFO[displayJa].name;
      role = JA_INFO[displayJa].role;
      imgUrl = BASE + '/ja/' + JA_MAP[jamo] + '.png';
    } else {
      var basic = normalizeJung(jamo);
      if (!MO_MAP[basic]) return null;
      charName = MO_INFO[basic].name;
      role = MO_INFO[basic].role;
      var moFileName = MO_MAP[basic];
      var suffix = MO_SUFFIX_BY_NAME[moFileName] || MO_SUFFIX;
      imgUrl = BASE + '/mo/' + encodeURIComponent(moFileName + suffix);
    }
    // hangeulalpabat: 28개 자모 이미지 (흰배경 .jpg)
    jamoImgUrl = BASE + '/hangeulalpabat/' + encodeURIComponent(jamo) + '.jpg';
    jamoOnlyUrl = BASE + '/hangeulalpabat/only/' + encodeURIComponent(jamo) + '-removebg-preview.png';
    return { jamo: jamo, name: charName, role: role, characterImage: imgUrl, jamoImage: jamoImgUrl, jamoOnly: jamoOnlyUrl, isConsonant: isJa };
  }

  /** 이름으로 서사용 리스트 생성 (자·모음 순서대로 각 페르소나 정보) */
  function nameToEpisodeList(name) {
    var jamos = decomposeName(name);
    var list = [];
    for (var i = 0; i < jamos.length; i++) {
      var agent = getAgentForJamo(jamos[i]);
      if (agent) list.push(agent);
    }
    return list;
  }

  /** 4컷 기승전결: 각 장면 제목 + 이미지용 장면 설명 */
  var NARRATIVE_SCENES = [
    { phase: 'Setup', caption: '이름 속 페르소나가 모여요', prompt: 'All characters gathering together in a cozy place, welcoming [이름]. Fluffy sheep-like creatures with soft wool, round faces, bright eyes.' },
    { phase: 'Conflict', caption: '첫 번째 페르소나가 반갑게 맞아요', prompt: 'First character greeting [이름] warmly, small fun commotion or surprise. Cute chaos, expressive faces.' },
    { phase: 'Action', caption: '각자의 재능을 보여 줘요', prompt: 'Each character showing their unique talent and role, solving something together. Teamwork, variety of actions.' },
    { phase: 'Ending', caption: '특별한 하루가 되어요', prompt: 'Everyone laughing together or striking a cool pose, happy ending. Group shot, warm atmosphere, memorable moment.' }
  ];
  /** 이미지 생성용 고정 스타일 (Pixar 통일) */
  var NARRATIVE_STYLE_PREFIX = 'Cute 3D Pixar Style render, bright lighting, soft texture. Hangul persona diary, fluffy white sheep-like creatures. Characters: [페르소나]. For [이름]. ';
  var NARRATIVE_PROMPT_TEMPLATE = '[스타일][장면] Full body or group shot, no text.';

  /** 4개 이미지 URL로 슬라이드 영상(WebM) 생성. 각 이미지 2초씩. */
  function buildVideoFromFourImages(dataUrls, options) {
    options = options || {};
    var durationPerImage = options.durationPerImage || 2;
    var width = options.width || 640;
    var height = options.height || 360;
    var fps = 30;
    return new Promise(function (resolve, reject) {
      if (!dataUrls || dataUrls.length !== 4) {
        reject(new Error('4개의 이미지가 필요해요'));
        return;
      }
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');
      var stream = canvas.captureStream(fps);
      var mime = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) mime = 'video/webm;codecs=vp9';
      else if (MediaRecorder.isTypeSupported('video/webm')) mime = 'video/webm';
      var recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 2500000 });
      var chunks = [];
      recorder.ondataavailable = function (e) { if (e.data && e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = function () {
        var blob = new Blob(chunks, { type: 'video/webm' });
        resolve(URL.createObjectURL(blob));
      };
      recorder.onerror = function () { reject(new Error('영상 녹화 실패')); };
      var imgs = [];
      var loaded = 0;
      function onAllLoaded() {
        recorder.start(100);
        var idx = 0;
        function drawNext() {
          if (idx >= 4) {
            recorder.stop();
            return;
          }
          var img = imgs[idx];
          ctx.fillStyle = '#1a1a1a';
          ctx.fillRect(0, 0, width, height);
          if (img && img.width) {
            var scale = Math.max(width / img.width, height / img.height);
            var sw = img.width;
            var sh = img.height;
            var dw = Math.ceil(sw * scale);
            var dh = Math.ceil(sh * scale);
            ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
          }
          idx++;
          if (idx < 4) setTimeout(drawNext, durationPerImage * 1000);
          else setTimeout(function () { recorder.stop(); }, durationPerImage * 1000);
        }
        drawNext();
      }
      for (var i = 0; i < 4; i++) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        (function (idx) {
          img.onload = function () { loaded++; if (loaded === 4) onAllLoaded(); };
          img.onerror = function () { loaded++; if (loaded === 4) onAllLoaded(); };
        })(i);
        img.src = dataUrls[i];
        imgs.push(img);
      }
    });
  }

  function fillPromptTemplate(template, values) {
    var s = template;
    for (var key in values) {
      if (values.hasOwnProperty(key)) {
        s = s.split('[' + key + ']').join(values[key] || '');
      }
    }
    return s;
  }

  /** 서사 스토리 생성 (웹툰형: 기승전결 + 우당탕탕, 한글 에이전트 다이어리 톤) */
  function buildEpisodeStory(list, name) {
    if (!list || list.length === 0) return { title: '', paragraphs: [], panels: [] };
    var names = list.map(function (a) { return a.name; });
    var title = name + '의 한글 페르소나 이야기';
    var paragraphs = [];
    var panels = [];
    var first = list[0];
    var last = list[list.length - 1];

    if (list.length <= 2) {
      var nameList = names.length === 2 ? (names[0] + '와 ' + names[1] + '가') : (names[0] + '가');
      paragraphs = [
        name + '님의 이름 속에는 ' + nameList + ' 당신의 본질을 투영하고 있어요.',
        list[0].name + '는 ' + list[0].role + '로서, ' + (list.length > 1 ? list[1].name + '는 ' + list[1].role + '로서 ' : '') + name + '님의 여정을 위한 특별한 서사를 깨웠어요.'
      ];
      panels = [
        '오늘은 조금 특별한 날. ' + name + '님 이름 속에서 ' + subject(list[0].name) + ' 문을 두드렸어요.',
        roleEpisode(list[0], 0),
        list.length > 1 ? roleEpisode(list[1], 1) : (list[0].name + '와 함께한 ' + name + '님만의 작은 이야기가 오늘도 이어졌어요.'),
        '그렇게 ' + name + '님만의 서사가 조용히 피어났어요. 다음에도 또 만나요.'
      ];
      return { title: title, paragraphs: paragraphs, panels: panels };
    }

    var mid = list.slice(1, -1);
    var midText = mid.map(function (a) { return a.name + '(' + a.role + ')'; }).join(', ');
    var displayNames = names.length > 8 ? (names.slice(0, 4).join(', ') + ' 외 ' + (names.length - 4) + '명') : names.join(', ');
    paragraphs = [
      name + '님의 이름 속에는 ' + displayNames + '이 깃들어 있어요. 이들은 오늘 ' + name + '님의 삶을 비추는 고유한 서사를 펼쳐 보입니다.',
      first.name + '는 ' + first.role + '로서 서막을 열었고, ' + (mid.length ? midText + '을 비롯해 ' : '') + last.name + '(' + last.role + ')이 차례로 등장하며 다채로운 페르소나를 보여 주었어요.',
      '각자의 재능이 터져 나오고, 작은 소동도 있었지만 이름 속 친구들이 웃음으로 풀어 주며 ' + name + '님만의 서사가 완성됐어요.'
    ];

    var recordLead = mid.length >= 1 ? (mid[mid.length - 1].name + '와 ' + last.name) : last.name;
    var crowdText = names.length > 6 ? '앞선 페르소나들이' : (mid.length >= 1 ? (mid.map(function (a) { return a.name; }).join(', ') + '이') : (last.name + '가'));
    panels = [
      '오늘은 ' + name + '님 이름 속에서 페르소나들이 깨어난 날. 먼저 <strong>' + first.name + '</strong>(' + first.role + ')' + (hasJong(first.name) ? '이' : '가') + ' 등장해 반갑게 인사했어요.',
      subject(first.name) + ' 서막을 열자, ' + crowdText + ' 차례로 몰려왔어요. 숲속 동화 같은 소동이 벌어지기 시작했죠.',
      roleEpisode(list[0], 0),
      list.length > 1 ? roleEpisode(list[1], 1) : '',
      list.length > 2 ? roleEpisode(list[2], 2) : '',
      list.length > 3 ? roleEpisode(list[3], 3) : ''
    ];
    panels = panels.filter(Boolean);
    // 우당탕탕: 구체적 소동 한 줄 (역할 활용)
    var jo = list.find(function (a) { return a.role === '상상가'; });
    var o = list.find(function (a) { return a.role === '웃음꽃'; });
    if (jo) panels.push('한참 신나게 놀다 보니 ' + subject(jo.name) + ' 잠들었다가 "꿈에서 대박 아이디어 났어!" 하며 깨어나서 모두를 웃겼어요.');
    else if (o) panels.push('분위기가 살짝 험해지자 ' + subject(o.name) + ' 엉뚱한 농담을 하더니 모두가 배꼽을 잡고 웃었어요.');
    else panels.push('서로 맞장구치며 우당탕탕 놀다 보니, 누군가는 뭘 깨뜨렸고 누군가는 웃으며 치웠어요.');
    var peacemaker = list.find(function (a) { return a.role === '웃음꽃' || a.role === '명상가' || a.role === '도우미'; }) || list[list.length - 1];
    panels.push('작은 다툼이 있었지만, ' + subject(peacemaker.name) + ' 나서서 웃음과 평정으로 풀어 주었어요. 이름 속 친구들의 우정이에요.');
    panels.push('어느새 해가 기울자 ' + recordLead + '가 나서서, 오늘의 이야기를 한 줄 한 줄 기록했어요. ' + name + '님만의 서사가 완성되는 순간.');
    panels.push('그렇게 ' + name + '님의 이름 속 페르소나들이 만든, 특별한 하루가 되었어요. 다음에도 또 만나요.');

    return { title: title, paragraphs: paragraphs, panels: panels };
  }

  function renderEpisodeStrip(list, name, romanInput) {
    var summaryEl = document.getElementById('name-episodes-summary');
    var stripEl = document.getElementById('name-episodes-strip');
    var resultEl = document.getElementById('name-episodes-result');
    if (!stripEl || !resultEl) return;
    var names = list.map(function (a) { return a.name; });
    if (romanInput) {
      summaryEl.innerHTML = '<span class="name-episodes-roman-result">' + escapeHtml(romanInput) + ' → <strong>' + escapeHtml(name) + '</strong></span><br>' + name + '님의 이름에는 ' + names.join(', ') + '이 깃들어 있습니다.';
    } else {
      summaryEl.textContent = name + '님의 이름에는 ' + names.join(', ') + '이 깃들어 있습니다.';
    }
    stripEl.innerHTML = '';
    var rarityColors = ['#c9a227', '#e8b923', '#7c3aed', '#a78bfa', '#ec4899'];
    function fireConfetti(rect) {
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var wrap = document.createElement('div');
      wrap.className = 'name-episodes-confetti';
      for (var i = 0; i < 12; i++) {
        var s = document.createElement('span');
        s.style.left = cx + 'px';
        s.style.top = cy + 'px';
        s.style.background = rarityColors[i % rarityColors.length];
        s.style.animationDelay = (i * 0.03) + 's';
        s.style.setProperty('--tx', (Math.random() * 120 - 60) + 'px');
        s.style.setProperty('--ty', (-60 - Math.random() * 80) + 'px');
        wrap.appendChild(s);
      }
      document.body.appendChild(wrap);
      setTimeout(function () { wrap.remove(); }, 1400);
    }
    list.forEach(function (agent, i) {
      var rarity = i < 2 ? 'rare' : 'normal';
      var card = document.createElement('div');
      card.className = 'name-episode-card';
      card.setAttribute('data-rarity', rarity);
      card.style.cssText = 'min-height:220px;border-radius:16px;overflow:hidden;background:var(--bg);cursor:pointer;';
      var inner = document.createElement('div');
      inner.className = 'name-episode-card-inner';
      var front = document.createElement('div');
      front.className = 'name-episode-card-face name-episode-card-front';
      var jamoImg = document.createElement('img');
      jamoImg.alt = agent.jamo;
      jamoImg.src = agent.jamoOnly;
      jamoImg.style.cssText = 'height:36px;width:auto;object-fit:contain;margin-bottom:8px;';
      jamoImg.onerror = function () { this.src = agent.jamoImage; };
      var charImg = document.createElement('img');
      charImg.alt = agent.name;
      charImg.src = agent.characterImage;
      charImg.style.cssText = 'width:80px;height:80px;object-fit:contain;border-radius:12px;';
      var nameEl = document.createElement('strong');
      nameEl.textContent = agent.name;
      nameEl.style.cssText = 'margin-top:8px;font-size:0.95rem;';
      var roleEl = document.createElement('span');
      roleEl.textContent = agent.role;
      roleEl.style.cssText = 'font-size:0.8rem;color:var(--text-muted);';
      front.appendChild(jamoImg);
      front.appendChild(charImg);
      front.appendChild(nameEl);
      front.appendChild(roleEl);
      var back = document.createElement('div');
      back.className = 'name-episode-card-face name-episode-card-back';
      var backImg = document.createElement('img');
      backImg.alt = agent.name;
      backImg.src = agent.characterImage;
      backImg.className = 'name-episode-card-back-img';
      back.appendChild(backImg);
      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);
      card.addEventListener('click', function (e) {
        e.preventDefault();
        card.classList.toggle('flipped');
      });
      stripEl.appendChild(card);
    });
    resultEl.style.display = 'block';
    // 미리보기 목업 숨기고, 오른쪽에 웹툰 스토리 패널 표시
    var previewEl = document.getElementById('name-episodes-preview');
    var storySideEl = document.getElementById('name-episodes-story-side');
    if (previewEl) previewEl.style.display = 'none';
    var cards = stripEl.querySelectorAll('.name-episode-card');
    cards.forEach(function (card, idx) {
      var delay = 180 + idx * 220;
      setTimeout(function () {
        card.classList.add('reveal');
        var r = card.getBoundingClientRect();
        fireConfetti(r);
      }, delay);
    });

    var story = buildEpisodeStory(list, name);
    var panelsToShow = (story.panels && story.panels.length > 0) ? story.panels : (story.paragraphs || []);
    if (storySideEl && panelsToShow.length > 0) {
      var sideTitle = storySideEl.querySelector('.name-episodes-story-side-title');
      var sidePanels = storySideEl.querySelector('.name-episodes-story-side-panels');
      if (sideTitle) sideTitle.textContent = story.title;
      if (sidePanels) {
        sidePanels.innerHTML = '';
        panelsToShow.forEach(function (text) {
          var panel = document.createElement('div');
          panel.className = 'name-episodes-story-panel';
          panel.innerHTML = typeof text === 'string' ? text : '';
          sidePanels.appendChild(panel);
        });
      }
      storySideEl.style.display = 'block';
    }
    var episodeBlock = document.getElementById('name-episodes-story');
    if (episodeBlock) {
      episodeBlock.style.display = 'block';
      var titleEl = episodeBlock.querySelector('.name-episodes-story-title');
      var bodyEl = episodeBlock.querySelector('.name-episodes-story-body');
      var cutsContainer = document.getElementById('name-episodes-cuts');
      if (titleEl) titleEl.textContent = story.title;
      if (bodyEl) {
        bodyEl.innerHTML = '';
        (story.paragraphs || []).forEach(function (p) {
          var para = document.createElement('p');
          para.className = 'name-episodes-story-p';
          para.textContent = p;
          bodyEl.appendChild(para);
        });
      }
    }
    if (episodeBlock) {
      var cutsContainer2 = document.getElementById('name-episodes-cuts');
      if (cutsContainer2) cutsContainer2.style.display = 'none';
      var scenes = NARRATIVE_SCENES;
      var charList = list.map(function (a) { return a.name + '(' + a.role + ')'; }).join(', ');
      var cutDataUrls = [];
      var cutLoadingEls = [];
      var hasApiKey = typeof window.__hasGeminiApiKey !== 'undefined' ? window.__hasGeminiApiKey : (typeof window.__simsGenerateImage === 'function');

      function showCutsAndStartImageGeneration() {
        if (cutsContainer) cutsContainer.style.display = 'grid';
      }
      for (var c = 1; c <= 4; c++) {
        var cutEl = episodeBlock.querySelector('.name-episodes-cut[data-cut="' + c + '"]');
        if (cutEl) {
          var cutImg = cutEl.querySelector('.name-episodes-cut-img');
          var cutCap = cutEl.querySelector('.name-episodes-cut-caption');
          if (cutCap) cutCap.textContent = scenes[c - 1].caption;
          if (cutImg) {
            cutImg.alt = name + ' 서사 컷 ' + c;
            cutImg.onerror = function () { this.style.display = 'none'; };
          }
          if (hasApiKey) {
            var loadingEl = document.createElement('div');
            loadingEl.className = 'name-episodes-cut-loading';
            loadingEl.setAttribute('aria-live', 'polite');
            loadingEl.textContent = '이미지 생성 중...';
            loadingEl.dataset.cutIndex = String(c - 1);
            cutEl.appendChild(loadingEl);
            cutLoadingEls.push(loadingEl);
            if (cutImg) cutImg.style.display = 'none';
          } else {
            if (cutImg) {
              cutImg.src = BASE + '/episode/episode-cut' + c + '.png';
              cutImg.style.display = 'block';
            }
          }
        }
      }

      var aiBlock = document.getElementById('name-episodes-ai-image-block');
      var aiVideoWrap = document.getElementById('name-episodes-ai-video-wrap');
      var aiVideoLoading = document.getElementById('name-episodes-ai-video-loading');
      var aiVideoEl = document.getElementById('name-episodes-ai-video');
      var aiVideoSave = document.getElementById('name-episodes-ai-video-save');
      var aiVideoError = document.getElementById('name-episodes-ai-video-error');
      if (aiBlock) aiBlock.style.display = 'block';
      if (aiVideoLoading) aiVideoLoading.style.display = hasApiKey ? 'block' : 'none';
      if (aiVideoWrap) aiVideoWrap.style.display = 'none';
      if (aiVideoError) aiVideoError.style.display = 'none';
      window.__nameEpisodesCurrent = { name: name, charList: charList };

      // [수정] 공유하기 데이터 미리 생성 (버튼 즉시 활성화)
      var staticCuts = [];
      for (var i = 1; i <= 4; i++) staticCuts.push(BASE + '/episode/episode-cut' + i + '.png');
      // API 키가 있으면 나중에 덮어씌워짐, 없으면 이 데이터 사용
      window.__nameEpisodesLastResult = {
        name: name,
        charList: charList,
        list: list,
        story: story,
        cutDataUrls: staticCuts
      };

      if (!hasApiKey) {
        if (cutsContainer) cutsContainer.style.display = 'grid';
        if (aiVideoError) {
          aiVideoError.textContent = 'API 키가 설정되지 않았어요. .env에 GEMINI_API_KEY를 넣고, 터미널에서 node scripts/build-config.js 를 실행한 뒤 페이지를 새로고침해 주세요.';
          aiVideoError.style.display = 'block';
        }
        hasApiKey = false;
        
        // [수정] 정적 모드에서도 공유하기가 가능하도록 결과 데이터 저장
        var staticCuts = [];
        for (var i = 1; i <= 4; i++) staticCuts.push(BASE + '/episode/episode-cut' + i + '.png');
        window.__nameEpisodesLastResult = {
          name: name,
          charList: charList,
          list: list,
          story: story,
          cutDataUrls: staticCuts
        };
        var actionsWrap = document.getElementById('name-episodes-actions-wrap');
        if (actionsWrap) actionsWrap.style.display = 'flex';
      }

      var loadingPhrases = ['망치를 찾는 중', '물감을 섞는 중', '노래를 준비하는 중', '포즈를 잡는 중', '장면을 그리는 중', '빛을 맞추는 중', '친구들을 부르는 중', '이야기를 만드는 중'];
      function setCutLoadingText(cutIndex, text) {
        if (cutLoadingEls[cutIndex]) cutLoadingEls[cutIndex].textContent = text;
      }
      function finishCutLoading(cutIndex, dataUrl) {
        if (cutLoadingEls[cutIndex]) cutLoadingEls[cutIndex].style.display = 'none';
        var cutEl = episodeBlock.querySelector('.name-episodes-cut[data-cut="' + (cutIndex + 1) + '"]');
        if (cutEl) {
          var cutImg = cutEl.querySelector('.name-episodes-cut-img');
          if (cutImg && dataUrl) {
            cutImg.style.display = 'block';
            cutImg.classList.add('name-episodes-cut-img-loading');
            cutImg.onload = function () { cutImg.classList.remove('name-episodes-cut-img-loading'); cutImg.classList.add('name-episodes-cut-img-reveal'); };
            cutImg.src = dataUrl;
          }
        }
      }

      function tryBuildVideo() {
        if (cutDataUrls.length !== 4) return;
        if (aiVideoLoading) aiVideoLoading.textContent = '영상을 만들고 있어요...';
        var actionsWrap = document.getElementById('name-episodes-actions-wrap');
        if (actionsWrap) actionsWrap.style.display = 'flex';
        window.__nameEpisodesLastResult = { name: name, charList: charList, list: list, story: story, cutDataUrls: cutDataUrls.slice() };
        buildVideoFromFourImages(cutDataUrls)
          .then(function (videoUrl) {
            if (aiVideoLoading) aiVideoLoading.style.display = 'none';
            if (aiVideoError) aiVideoError.style.display = 'none';
            if (aiVideoEl && aiVideoWrap) {
              aiVideoEl.src = videoUrl;
              aiVideoWrap.style.display = 'block';
            }
            if (aiVideoSave) {
              aiVideoSave.href = videoUrl;
              aiVideoSave.download = (name || '나만의-서사') + '-영상-' + Date.now() + '.webm';
              aiVideoSave.style.display = 'inline-block';
            }
          })
          .catch(function () {
            if (aiVideoLoading) aiVideoLoading.style.display = 'none';
            if (aiVideoError) {
              aiVideoError.textContent = '영상 만들기에 실패했어요.';
              aiVideoError.style.display = 'block';
            }
          });
      }

      function startRepresentativeImageGeneration() {
        if (!hasApiKey) return;
      var generateCut = typeof window.__simsGenerateImage === 'function' ? window.__simsGenerateImage : function () { return Promise.resolve(null); };
      var pending = 4;
      for (var ci = 0; ci < 4; ci++) {
        (function (cutIndex) {
          var charName = list[cutIndex % list.length].name;
          var phrase = loadingPhrases[cutIndex % loadingPhrases.length];
          setCutLoadingText(cutIndex, charName + ' 페르소나가 ' + phrase + '...');
          var sceneInfo = scenes[cutIndex];
          var stylePart = fillPromptTemplate(NARRATIVE_STYLE_PREFIX, { '이름': name, '페르소나': charList });
          var scenePart = fillPromptTemplate(sceneInfo.prompt, { '이름': name });
          var filled = stylePart + scenePart + ' Full body or group shot, no text.';
          generateCut(filled).then(function (base64) {
            var dataUrl = base64 ? ('data:image/png;base64,' + base64) : null;
            if (dataUrl) {
              cutDataUrls[cutIndex] = dataUrl;
              finishCutLoading(cutIndex, dataUrl);
            } else {
              cutDataUrls[cutIndex] = null;
              var cutEl = episodeBlock.querySelector('.name-episodes-cut[data-cut="' + (cutIndex + 1) + '"]');
              if (cutEl) {
                var img = cutEl.querySelector('.name-episodes-cut-img');
                var loading = cutEl.querySelector('.name-episodes-cut-loading');
                if (loading) loading.style.display = 'none';
                if (img) {
                  img.src = BASE + '/episode/episode-cut' + (cutIndex + 1) + '.png';
                  img.style.display = 'block';
                }
              }
            }
            pending--;
            if (pending === 0) {
              if (aiVideoLoading) aiVideoLoading.style.display = 'none';
              var valid = cutDataUrls.filter(Boolean);
              if (valid.length === 4) {
                // [수정] 공유하기 위해 결과 데이터 저장 (비디오 생성이 없더라도)
                window.__nameEpisodesLastResult = {
                  name: name,
                  charList: charList,
                  list: list,
                  story: story,
                  cutDataUrls: cutDataUrls.slice()
                };
                var actionsWrap = document.getElementById('name-episodes-actions-wrap');
                if (actionsWrap) actionsWrap.style.display = 'flex';
              } else if (aiVideoError) {
                aiVideoError.textContent = window.__hasGeminiApiKey
                  ? '4개의 컷 이미지가 모두 생성되지 않았어요. (실패 시: API 할당량·네트워크·키 유효성을 확인해 주세요.)'
                  : 'API 키가 설정되지 않았어요. .env에 GEMINI_API_KEY를 넣고, 터미널에서 node scripts/build-config.js 를 실행한 뒤 페이지를 새로고침해 주세요.';
                aiVideoError.style.display = 'block';
              }
            }
          }).catch(function () {
            pending--;
            cutDataUrls[cutIndex] = null;
            var cutEl = episodeBlock.querySelector('.name-episodes-cut[data-cut="' + (cutIndex + 1) + '"]');
            if (cutEl) {
              var loading = cutEl.querySelector('.name-episodes-cut-loading');
              if (loading) loading.style.display = 'none';
              var img = cutEl.querySelector('.name-episodes-cut-img');
              if (img) { img.src = BASE + '/episode/episode-cut' + (cutIndex + 1) + '.png'; img.style.display = 'block'; }
            }
            if (pending === 0 && cutDataUrls.filter(Boolean).length < 4) {
              if (aiVideoLoading) aiVideoLoading.style.display = 'none';
              if (aiVideoError) {
                aiVideoError.textContent = window.__hasGeminiApiKey
                  ? '4개의 컷 이미지가 모두 생성되지 않았어요. (실패 시: API 할당량·네트워크·키 유효성을 확인해 주세요.)'
                  : 'API 키가 설정되지 않았어요. .env에 GEMINI_API_KEY를 넣고, 터미널에서 node scripts/build-config.js 를 실행한 뒤 페이지를 새로고침해 주세요.';
                aiVideoError.style.display = 'block';
              }
            }
          });
        })(ci);
      }
      }
      setTimeout(function () {
        if (cutsContainer && cutsContainer.style.display !== 'grid') cutsContainer.style.display = 'grid';
        startRepresentativeImageGeneration();
      }, 300);
    }
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function onNameEpisodesSubmit() {
    var input = document.getElementById('name-episodes-input');
    var raw = (input && input.value) ? input.value.trim() : '';
    if (!raw) {
      alert('한글 또는 영어 이름을 입력해 주세요.');
      return;
    }
    var name = raw;
    var hangulName = null;
    if (!isHangulOnly(raw)) {
      hangulName = romanToHangul(raw);
      if (hangulName) name = hangulName;
      else {
        alert('영어 이름을 한글로 변환할 수 없어요. 한글로 입력하시거나, 로마자 발음으로 다시 입력해 주세요. (예: Michael → maikeul)');
        return;
      }
    }
    var list = nameToEpisodeList(name);
    if (list.length === 0) {
      alert('한글 이름만 사용할 수 있어요. (2~8글자 권장)');
      return;
    }
    renderEpisodeStrip(list, name, hangulName ? raw : null);
    if (typeof window.saveUserProfileToLocal === 'function') window.saveUserProfileToLocal();
  }

  // 인라인 onclick에서 호출 가능하도록 먼저 전역 노출 (다른 스크립트·초기화 실패와 무관하게 버튼 클릭 동작)
  window.nameEpisodesMake = onNameEpisodesSubmit;

  var ALL_28_JAMOS = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣㅔㅖㅐㅒ'.split('');
  var STORAGE_KEY_PERSONAS = 'sims_selected_personas';

  function getSelectedPersonaRoles() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_PERSONAS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveSelectedPersonaRoles(roles) {
    try {
      localStorage.setItem(STORAGE_KEY_PERSONAS, JSON.stringify(roles || []));
    } catch (e) {}
  }

  function init28PersonaCards() {
    var trigger = document.getElementById('name-episodes-learn-more-trigger');
    var grid = document.getElementById('name-episodes-28-grid');
    var cardsContainer = document.getElementById('name-episodes-28-cards');
    var countEl = document.getElementById('name-episodes-28-selected-count');
    if (!trigger || !grid || !cardsContainer) return;

    var selectedRoles = getSelectedPersonaRoles();

    function t(k) { return (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t(k) : k; }

    function updateCount() {
      if (countEl) {
        var s = t('ai.selected_count') || '{n}개 선택됨';
        countEl.textContent = s.replace(/\{n\}/g, String(selectedRoles.length));
      }
    }

    function renderCards() {
      cardsContainer.innerHTML = '';
      ALL_28_JAMOS.forEach(function (jamo) {
        var agent = getAgentForJamo(jamo);
        if (!agent) return;
        var card = document.createElement('div');
        card.className = 'name-episodes-28-card' + (selectedRoles.indexOf(agent.role) >= 0 ? ' selected' : '');
        card.dataset.jamo = jamo;
        card.dataset.role = agent.role;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        var nameText = t('persona.name.' + agent.name) || agent.name;
        var roleText = t('persona.role.' + agent.role) || agent.role;
        card.innerHTML = '<div class="name-episodes-28-card-hover-overlay" aria-hidden="true">' +
          '<img src="' + agent.characterImage + '" alt="' + escapeHtml(agent.name) + '" loading="lazy">' +
          '</div>' +
          '<img class="name-episodes-28-card-jamo" src="' + agent.jamoOnly + '" alt="' + escapeHtml(jamo) + '" loading="lazy" onerror="this.style.display=\'none\'">' +
          '<img class="name-episodes-28-card-char" src="' + agent.characterImage + '" alt="' + escapeHtml(agent.name) + '" loading="lazy" onerror="this.style.display=\'none\'">' +
          '<p class="name-episodes-28-card-name">' + escapeHtml(nameText) + '</p>' +
          '<p class="name-episodes-28-card-role">' + escapeHtml(roleText) + '</p>' +
          '<span class="name-episodes-28-card-check" aria-hidden="true">✓</span>';
        card.addEventListener('click', function () {
          var idx = selectedRoles.indexOf(agent.role);
          if (idx >= 0) {
            selectedRoles.splice(idx, 1);
          } else if (selectedRoles.length < 5) {
            selectedRoles.push(agent.role);
          }
          saveSelectedPersonaRoles(selectedRoles);
          cardsContainer.querySelectorAll('.name-episodes-28-card').forEach(function (c) {
            c.classList.toggle('selected', selectedRoles.indexOf(c.dataset.role) >= 0);
          });
          updateCount();
        });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
        });
        cardsContainer.appendChild(card);
      });
      updateCount();
    }

    trigger.addEventListener('click', function () {
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !expanded);
      grid.hidden = expanded;
      grid.setAttribute('aria-hidden', expanded);
      if (!expanded && cardsContainer.children.length === 0) renderCards();
    });

    document.addEventListener('sims-lang-changed', function () {
      if (cardsContainer.children.length === 0) return;
      cardsContainer.querySelectorAll('.name-episodes-28-card').forEach(function (card) {
        var role = card.dataset.role;
        var nameEl = card.querySelector('.name-episodes-28-card-name');
        var roleEl = card.querySelector('.name-episodes-28-card-role');
        if (nameEl && roleEl && role) {
          var agent = getAgentForJamo(card.dataset.jamo);
          if (agent) {
            nameEl.textContent = t('persona.name.' + agent.name) || agent.name;
            roleEl.textContent = t('persona.role.' + agent.role) || agent.role;
          }
        }
      });
      updateCount();
    });

    renderCards();
  }

  var nameEpisodesInited = false;
  function initNameEpisodes() {
    if (nameEpisodesInited) return;
    nameEpisodesInited = true;
    try {
      init28PersonaCards();
      document.body.addEventListener('click', function (e) {
        var target = e.target && (e.target.closest ? e.target.closest('#name-episodes-btn') : e.target);
        if (target && target.id === 'name-episodes-btn') {
          e.preventDefault();
          onNameEpisodesSubmit();
        }
      });
      var btn = document.getElementById('name-episodes-btn');
      if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); onNameEpisodesSubmit(); });
      var input = document.getElementById('name-episodes-input');
      if (input) input.addEventListener('keypress', function (e) { if (e.key === 'Enter') { e.preventDefault(); onNameEpisodesSubmit(); } });
      var shareBtn = document.getElementById('name-episodes-share-btn');
      var shareCard = document.getElementById('name-episodes-share-card');
      if (shareBtn && shareCard) {
        shareBtn.addEventListener('click', function () {
          var cur = window.__nameEpisodesLastResult;
          if (!cur) return;
          
          // 공유 카드 내용 업데이트 (다운로드용)
          var titleEl = document.getElementById('name-episodes-share-title');
          var charsEl = document.getElementById('name-episodes-share-chars');
          var cutsEl = document.getElementById('name-episodes-share-cuts');
          var summaryEl = document.getElementById('name-episodes-share-summary');
          if (titleEl) titleEl.textContent = cur.name + '님의 한글 페르소나 이야기';
          if (charsEl) charsEl.textContent = cur.list.map(function (a) { return a.name; }).join(' · ');
          if (summaryEl) summaryEl.textContent = (cur.story && cur.story.paragraphs && cur.story.paragraphs[0]) ? cur.story.paragraphs[0] : '';
          if (cutsEl && cur.cutDataUrls && cur.cutDataUrls.length) {
            cutsEl.innerHTML = '';
            cur.cutDataUrls.forEach(function (dataUrl) {
              if (!dataUrl) return;
              var im = document.createElement('img');
              im.src = dataUrl;
              im.style.cssText = 'width:100%;height:auto;border-radius:12px;display:block;';
              im.alt = '';
              cutsEl.appendChild(im);
            });
          }

          // [수정] 공유 옵션: 소셜 링크 노출 및 이미지 다운로드 바로 실행
          var socialLinks = document.getElementById('name-episodes-social-links');
          if (socialLinks) {
            socialLinks.style.display = 'block';
            socialLinks.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          // 이미지 다운로드 실행
          if (typeof html2canvas !== 'undefined') {
            // 버튼 텍스트 변경
            var originalText = shareBtn.textContent;
            shareBtn.textContent = '이미지 생성 중...';
            shareBtn.disabled = true;

            html2canvas(shareCard, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#1a1a2e' }).then(function (canvas) {
              var link = document.createElement('a');
              link.download = (cur.name || '나만의-서사') + '-한글페르소나.png';
              link.href = canvas.toDataURL('image/png');
              link.click();
              
              // 복원
              shareBtn.textContent = originalText;
              shareBtn.disabled = false;
              
              // 알림
              setTimeout(function() {
                alert('이미지가 저장되었습니다! 아래 링크를 통해 팬들과 공유해보세요.');
              }, 500);
            }).catch(function(err) {
              console.error(err);
              shareBtn.textContent = originalText;
              shareBtn.disabled = false;
              alert('이미지 생성에 실패했습니다. 다시 시도해 주세요.');
            });
          } else {
            alert('이미지 생성 라이브러리를 불러오지 못했어요.');
          }
          return; // 기존 모달 로직 실행 방지

          // (이하 기존 모달 코드는 삭제 예정)

          var grid = document.createElement('div');
          grid.style.cssText = 'display:grid;gap:12px;';

          function createBtn(text, bg, icon, onClick) {
            var b = document.createElement('button');
            b.innerHTML = '<span style="margin-right:8px;">' + icon + '</span>' + text;
            b.style.cssText = 'width:100%;padding:14px;border:none;border-radius:12px;background:' + bg + ';color:#fff;font-weight:600;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:transform 0.1s, opacity 0.2s;box-shadow:0 4px 6px rgba(0,0,0,0.1);';
            b.onmouseover = function() { b.style.opacity = '0.9'; b.style.transform = 'translateY(-1px)'; };
            b.onmouseout = function() { b.style.opacity = '1'; b.style.transform = 'translateY(0)'; };
            b.onclick = onClick;
            return b;
          }

          // 1. 이미지 다운로드
          grid.appendChild(createBtn('이미지 저장', 'linear-gradient(135deg, #7c3aed, #ec4899)', '⬇️', function() {
            overlay.remove();
            if (typeof html2canvas !== 'undefined') {
              html2canvas(shareCard, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#1a1a2e' }).then(function (canvas) {
                var link = document.createElement('a');
                link.download = (cur.name || '나만의-서사') + '-인스타-공유.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
              });
            } else {
              alert('이미지 생성 라이브러리를 불러오지 못했어요.');
            }
          }));

          // 2. 트위터/X
          grid.appendChild(createBtn('X (트위터) 공유', '#000000', '🐦', function() {
            var url = encodeURIComponent(window.location.href);
            var text = encodeURIComponent('나만의 한글 페르소나 서사를 일깨웠어요! #보라해 #Borahae #HangulPersona');
            window.open('https://twitter.com/intent/tweet?url=' + url + '&text=' + text, '_blank');
          }));

          // 3. 페이스북
          grid.appendChild(createBtn('페이스북 공유', '#1877f2', '📘', function() {
            var url = encodeURIComponent(window.location.href);
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
          }));

          // 4. 링크 복사
          grid.appendChild(createBtn('링크 복사', '#4b5563', '🔗', function() {
            navigator.clipboard.writeText(window.location.href).then(function() {
              alert('링크가 클립보드에 복사되었습니다!');
              overlay.remove();
            }).catch(function() {
              alert('링크 복사에 실패했어요.');
            });
          }));
          
          var closeBtn = document.createElement('button');
          closeBtn.textContent = '닫기';
          closeBtn.style.cssText = 'margin-top:20px;background:transparent;border:none;color:var(--text-muted, #9ca3af);text-decoration:underline;cursor:pointer;font-size:0.9rem;padding:8px;';
          closeBtn.onclick = function() { overlay.remove(); };

          box.appendChild(grid);
          box.appendChild(closeBtn);
          overlay.appendChild(box);
          document.body.appendChild(overlay);
        });
      }
    } catch (err) { /* 보조 리스너 실패해도 onclick으로 동작 */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNameEpisodes);
  } else {
    initNameEpisodes();
  }
  setTimeout(initNameEpisodes, 100);

  window.NameEpisodes = {
    decomposeName: decomposeName,
    nameToEpisodeList: nameToEpisodeList,
    getAgentForJamo: getAgentForJamo,
    renderEpisodeStrip: renderEpisodeStrip,
    run: onNameEpisodesSubmit,
    JA_INFO: JA_INFO,
    MO_INFO: MO_INFO
  };

  // 셀프 검증: "환" → ㅎ,ㅗ,ㅏ,ㄴ 4개인지 (콘솔에서 확인 가능)
  (function selfCheck() {
    var jamos = decomposeName('환');
    var list = nameToEpisodeList('환');
    var ok = jamos.length === 4 && list.length === 4 && list[2].name === '아롱';
    if (!ok && typeof console !== 'undefined' && console.warn) {
      console.warn('[name-episodes] 셀프검증: 환 분해 자모=', jamos, '페르소나 수=', list.length, list.length >= 3 ? '이름=' + list.map(function(a){ return a.name; }).join(',') : '');
    }
  })();
})();
