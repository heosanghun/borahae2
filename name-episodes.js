/**
 * 이름 → 자·모음 분리 → 28 한글 에이전트 에피소드
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

  // 복합 모음 → 기본 모음(14) 매핑 (ㅘ→ㅗ, ㅝ→ㅜ 등). 우리 에이전트는 기본 14모음만 있음.
  var JUNG_TO_BASIC = { 'ㅘ':'ㅗ','ㅙ':'ㅐ','ㅚ':'ㅗ','ㅝ':'ㅜ','ㅞ':'ㅔ','ㅟ':'ㅣ','ㅢ':'ㅡ' };

  // 자음(14+쌍/겹자음) → 에이전트 파일명(ja 폴더). 쌍자음은 해당 단자음과 동일 캐릭터로.
  var JA_MAP = { 'ㄱ':'golong','ㄲ':'golong','ㄴ':'nolong','ㄷ':'dolong','ㄸ':'dolong','ㄹ':'lolong','ㅁ':'molong','ㅂ':'bolong','ㅃ':'bolong','ㅅ':'solong','ㅆ':'solong','ㅇ':'olong','ㅈ':'jolong','ㅉ':'jolong','ㅊ':'cholong','ㅋ':'kolong','ㅌ':'tolong','ㅍ':'polong','ㅎ':'holong','ㄳ':'golong','ㄵ':'nolong','ㄶ':'nolong','ㄺ':'lolong','ㄻ':'molong','ㄼ':'lolong','ㄽ':'solong','ㄾ':'lolong','ㄿ':'polong','ㅀ':'lolong','ㅄ':'bolong' };
  // 모음(14) → 에이전트 파일명(mo 폴더, 한글 이름)
  var MO_MAP = { 'ㅏ':'아롱','ㅐ':'애롱','ㅑ':'야롱','ㅒ':'얍롱','ㅓ':'어롱','ㅔ':'에이롱','ㅕ':'여롱','ㅖ':'예롱','ㅗ':'오롱','ㅛ':'요롱','ㅜ':'우롱','ㅠ':'유롱','ㅡ':'으롱','ㅣ':'이롱' };

  // 자음/모음 → 캐릭터 이름·역할 (표시용). ㅗ→오롱(웃음꽃), ㅏ→아롱(화가)
  var JA_INFO = { 'ㄱ':{ name:'고롱', role:'발명가' },'ㄴ':{ name:'노롱', role:'가수' },'ㄷ':{ name:'도롱', role:'도우미' },'ㄹ':{ name:'로롱', role:'요리사' },'ㅁ':{ name:'모롱', role:'뚝딱이' },'ㅂ':{ name:'보롱', role:'천문학자' },'ㅅ':{ name:'소롱', role:'시인' },'ㅇ':{ name:'오롱', role:'웃음꽃' },'ㅈ':{ name:'조롱', role:'상상가' },'ㅊ':{ name:'초롱', role:'댄서' },'ㅋ':{ name:'코롱', role:'파수꾼' },'ㅌ':{ name:'토롱', role:'달변가' },'ㅍ':{ name:'포롱', role:'탐정' },'ㅎ':{ name:'호롱', role:'천하장사' } };
  var MO_INFO = { 'ㅏ':{ name:'아롱', role:'화가' },'ㅐ':{ name:'애롱', role:'선생님' },'ㅑ':{ name:'야롱', role:'전령사' },'ㅒ':{ name:'얍롱', role:'사진가' },'ㅓ':{ name:'어롱', role:'정원사' },'ㅔ':{ name:'에이롱', role:'길잡이' },'ㅕ':{ name:'여롱', role:'치유사' },'ㅖ':{ name:'예롱', role:'연주가' },'ㅗ':{ name:'오롱', role:'웃음꽃' },'ㅛ':{ name:'요롱', role:'동물 조련사' },'ㅜ':{ name:'우롱', role:'기록가' },'ㅠ':{ name:'유롱', role:'해양 탐험가' },'ㅡ':{ name:'으롱', role:'명상가' },'ㅣ':{ name:'이롱', role:'재단사' } };

  var BASE = 'image/name';
  var MO_SUFFIX = '_draphed_01_896x1200.png';
  // 모음별 실제 파일 접미사 (아롱만 944x1120, 나머지는 896x1200)
  var MO_SUFFIX_BY_NAME = { '아롱': '_draphed_01_944x1120.png' };

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
    if (basicJung === '\u3157' || basicJung === 'ㅗ') arr.push('\u314F'); // ㅗ/ㅘ/ㅚ 등 → ㅗ+ㅏ 추가
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

  /** 자모 하나가 자음인지 모음인지 판별 후 에이전트 이미지 경로·정보 반환 */
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

  /** 이름으로 에피소드용 리스트 생성 (자·모음 순서대로 각 에이전트 정보) */
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
  var EPISODE_SCENES = [
    { phase: 'Setup', caption: '이름 속 에이전트가 모여요', prompt: 'All characters gathering together in a cozy place, welcoming [이름]. Fluffy sheep-like creatures with soft wool, round faces, bright eyes.' },
    { phase: 'Conflict', caption: '첫 번째 에이전트가 반갑게 맞아요', prompt: 'First character greeting [이름] warmly, small fun commotion or surprise. Cute chaos, expressive faces.' },
    { phase: 'Action', caption: '각자의 재능을 보여 줘요', prompt: 'Each character showing their unique talent and role, solving something together. Teamwork, variety of actions.' },
    { phase: 'Ending', caption: '특별한 하루가 되어요', prompt: 'Everyone laughing together or striking a cool pose, happy ending. Group shot, warm atmosphere, memorable moment.' }
  ];
  /** 이미지 생성용 고정 스타일 (Pixar 통일) */
  var EPISODE_STYLE_PREFIX = 'Cute 3D Pixar Style render, bright lighting, soft texture. Hangul agent diary, fluffy white sheep-like creatures. Characters: [캐릭터]. For [이름]. ';
  var EPISODE_PROMPT_TEMPLATE = '[스타일][장면] Full body or group shot, no text.';

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

  /** 에피소드 스토리 생성 (한글 에이전트 다이어리 톤: 친근·따뜻, 역할 반영) */
  function buildEpisodeStory(list, name) {
    if (!list || list.length === 0) return { title: '', paragraphs: [] };
    var names = list.map(function (a) { return a.name; });
    var title = name + '의 한글 에이전트 이야기';
    if (names.length <= 2) {
      var nameList = names.length === 2 ? (names[0] + '와 ' + names[1] + '가') : (names[0] + '가');
      return {
        title: title,
        paragraphs: [
          name + '의 이름 속에는 ' + nameList + ' 숨어 있어요.',
          list[0].name + '는 ' + list[0].role + '답게 ' + (list.length > 1 ? list[1].name + '는 ' + list[1].role + '답게 ' : '') + name + '를 위해 오늘도 특별한 하루를 만들어 주었어요.'
        ]
      };
    }
    var first = list[0];
    var mid = list.slice(1, -1);
    var last = list[list.length - 1];
    var midText = mid.map(function (a) { return a.name + '(' + a.role + ')'; }).join(', ');
    var p1 = name + '의 이름 속에는 ' + names.join(', ') + '이 숨어 있어요. 오늘은 그들이 모여 ' + name + '을 위한 작은 이야기를 만들었어요.';
    var p2 = first.name + '는 ' + first.role + '답게 맨 앞에서 반갑게 맞아 주었고, ' + midText + '이 차례로 등장해 각자의 재능을 보여 주었어요.';
    var p3 = '마지막으로 ' + last.name + '(' + last.role + ')이 이야기를 마무리하며, ' + name + '의 하루가 더 특별해졌어요.';
    return { title: title, paragraphs: [p1, p2, p3] };
  }

  function renderEpisodeStrip(list, name, romanInput) {
    var summaryEl = document.getElementById('name-episodes-summary');
    var stripEl = document.getElementById('name-episodes-strip');
    var resultEl = document.getElementById('name-episodes-result');
    if (!stripEl || !resultEl) return;
    var names = list.map(function (a) { return a.name; });
    if (romanInput) {
      summaryEl.innerHTML = '<span class="name-episodes-roman-result">' + escapeHtml(romanInput) + ' → <strong>' + escapeHtml(name) + '</strong></span><br>' + name + '의 이름에는 ' + names.join(', ') + '이 숨어 있어요.';
    } else {
      summaryEl.textContent = name + '의 이름에는 ' + names.join(', ') + '이 숨어 있어요.';
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
      if (cutsContainer) cutsContainer.style.display = 'none';
      var scenes = EPISODE_SCENES;
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
            cutImg.alt = name + ' 에피소드 컷 ' + c;
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

      if (!hasApiKey) {
        if (cutsContainer) cutsContainer.style.display = 'grid';
        if (aiVideoError) {
          aiVideoError.textContent = 'API 키가 설정되지 않았어요. .env에 GEMINI_API_KEY를 넣고, 터미널에서 node scripts/build-config.js 를 실행한 뒤 페이지를 새로고침해 주세요.';
          aiVideoError.style.display = 'block';
        }
        hasApiKey = false;
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
              aiVideoSave.download = (name || '나만의-에피소드') + '-영상-' + Date.now() + '.webm';
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
          setCutLoadingText(cutIndex, charName + '이가 ' + phrase + '...');
          var sceneInfo = scenes[cutIndex];
          var stylePart = fillPromptTemplate(EPISODE_STYLE_PREFIX, { '이름': name, '캐릭터': charList });
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
  }

  // 인라인 onclick에서 호출 가능하도록 먼저 전역 노출 (다른 스크립트·초기화 실패와 무관하게 버튼 클릭 동작)
  window.nameEpisodesMake = onNameEpisodesSubmit;

  var nameEpisodesInited = false;
  function initNameEpisodes() {
    if (nameEpisodesInited) return;
    nameEpisodesInited = true;
    try {
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
          var titleEl = document.getElementById('name-episodes-share-title');
          var charsEl = document.getElementById('name-episodes-share-chars');
          var cutsEl = document.getElementById('name-episodes-share-cuts');
          var summaryEl = document.getElementById('name-episodes-share-summary');
          if (titleEl) titleEl.textContent = cur.name + '의 한글 에이전트 이야기';
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
          if (typeof html2canvas !== 'undefined') {
            html2canvas(shareCard, { scale: 0.5, useCORS: true, allowTaint: true, width: 1080, height: 1350 }).then(function (canvas) {
              var link = document.createElement('a');
              link.download = (cur.name || '나만의-에피소드') + '-인스타-공유.png';
              link.href = canvas.toDataURL('image/png');
              link.click();
            });
          } else {
            alert('공유 이미지 생성 중입니다. 잠시 후 다시 시도해 주세요.');
          }
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
      console.warn('[name-episodes] 셀프검증: 환 분해 자모=', jamos, '캐릭터 수=', list.length, list.length >= 3 ? '이름=' + list.map(function(a){ return a.name; }).join(',') : '');
    }
  })();
})();
