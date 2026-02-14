/**
 * 한글 공감각 건축 시스템 (Hangeul Synesthetic Architecture)
 * - 4군 x 7음계 매핑 (메뉴얼 v2.0, doc/사랑의 인사_악보 한글번역.pdf 기준)
 * - 규칙 기반: 악보별 음계 유추 → 한글 자모 그리드 생성
 */
(function(global) {
  'use strict';

  // 7음계 표준 색상 (메뉴얼 제2법칙)
  var SCALE_COLORS = {
    do:   '#C62828',   // 빨강 Red
    re:   '#EF6C00',   // 주황 Orange
    mi:   '#F9A825',   // 노랑 Yellow
    fa:   '#2E7D32',   // 초록 Green
    sol:  '#1565C0',   // 파랑 Blue
    la:   '#283593',   // 남색 Indigo
    si:   '#6A1B9A'    // 보라 Violet
  };

  // 자모 → 음계 (28자: 4군 x 7음계)
  var JAMO_TO_SCALE = {
    // 제1군 구조체 (도~시)
    'ㄱ': 'do', 'ㄴ': 're', 'ㄷ': 'mi', 'ㄹ': 'fa', 'ㅁ': 'sol', 'ㅂ': 'la', 'ㅅ': 'si',
    // 제2군 장식체
    'ㅇ': 'do', 'ㅈ': 're', 'ㅊ': 'mi', 'ㅋ': 'fa', 'ㅌ': 'sol', 'ㅍ': 'la', 'ㅎ': 'si',
    // 제3군 수평 연결체
    'ㅏ': 'do', 'ㅑ': 're', 'ㅓ': 'mi', 'ㅕ': 'fa', 'ㅗ': 'sol', 'ㅛ': 'la', 'ㅜ': 'si',
    // 제4군 수직 연결체
    'ㅠ': 'do', 'ㅡ': 're', 'ㅣ': 'mi', 'ㅔ': 'fa', 'ㅖ': 'sol', 'ㅐ': 'la', 'ㅒ': 'si'
  };

  /**
   * 한글 표준 메뉴얼: 음계(1~7) + 역할 → 자모
   * 제1군(베이스), 제2군(멜로디), 제3군(오른손 반주), 제4군(왼손 반주)
   */
  var SCALE_DEGREE_TO_JAMO = {
    1: { B: 'ㄱ', M: 'ㅇ', RAcc: 'ㅏ', LAcc: 'ㅠ' },   // 도
    2: { B: 'ㄴ', M: 'ㅈ', RAcc: 'ㅑ', LAcc: 'ㅡ' },   // 레
    3: { B: 'ㄷ', M: 'ㅊ', RAcc: 'ㅓ', LAcc: 'ㅣ' },   // 미
    4: { B: 'ㄹ', M: 'ㅋ', RAcc: 'ㅕ', LAcc: 'ㅔ' },   // 파
    5: { B: 'ㅁ', M: 'ㅌ', RAcc: 'ㅗ', LAcc: 'ㅖ' },   // 솔
    6: { B: 'ㅂ', M: 'ㅍ', RAcc: 'ㅛ', LAcc: 'ㅐ' },   // 라
    7: { B: 'ㅅ', M: 'ㅎ', RAcc: 'ㅜ', LAcc: 'ㅒ' }    // 시
  };

  /**
   * 조(key)별 7음계 음이름 (도~시 = 1~7). #/b 동의이명 포함.
   * 형식: keyName -> { degree: [note1, note2, ...] } (예: 'E Major' -> 1: ['C#','Db'])
   */
  var KEY_SCALE_NOTES = {
    'C Major':   { 1: ['C'], 2: ['D'], 3: ['E'], 4: ['F'], 5: ['G'], 6: ['A'], 7: ['B'] },
    'G Major':   { 1: ['G'], 2: ['A'], 3: ['B'], 4: ['C'], 5: ['D'], 6: ['E'], 7: ['F#'] },
    'D Major':   { 1: ['D'], 2: ['E'], 3: ['F#'], 4: ['G'], 5: ['A'], 6: ['B'], 7: ['C#'] },
    'A Major':   { 1: ['A'], 2: ['B'], 3: ['C#'], 4: ['D'], 5: ['E'], 6: ['F#'], 7: ['G#'] },
    'E Major':   { 1: ['C#'], 2: ['D#'], 3: ['E'], 4: ['F#'], 5: ['G#'], 6: ['A'], 7: ['B'] },
    'B Major':   { 1: ['B'], 2: ['C#'], 3: ['D#'], 4: ['E'], 5: ['F#'], 6: ['G#'], 7: ['A#'] },
    'F# Major':  { 1: ['F#'], 2: ['G#'], 3: ['A#'], 4: ['B'], 5: ['C#'], 6: ['D#'], 7: ['E#'] },
    'F Major':   { 1: ['F'], 2: ['G'], 3: ['A'], 4: ['Bb'], 5: ['C'], 6: ['D'], 7: ['E'] },
    'Bb Major':  { 1: ['Bb'], 2: ['C'], 3: ['D'], 4: ['Eb'], 5: ['F'], 6: ['G'], 7: ['A'] },
    'Eb Major':  { 1: ['Eb'], 2: ['F'], 3: ['G'], 4: ['Ab'], 5: ['Bb'], 6: ['C'], 7: ['D'] },
    'Ab Major':  { 1: ['Ab'], 2: ['Bb'], 3: ['C'], 4: ['Db'], 5: ['Eb'], 6: ['F'], 7: ['G'] },
    'Db Major':  { 1: ['Db'], 2: ['Eb'], 3: ['F'], 4: ['Gb'], 5: ['Ab'], 6: ['Bb'], 7: ['C'] },
    'A Minor':   { 1: ['A'], 2: ['B'], 3: ['C'], 4: ['D'], 5: ['E'], 6: ['F'], 7: ['G'] },
    'E Minor':   { 1: ['E'], 2: ['F#'], 3: ['G'], 4: ['A'], 5: ['B'], 6: ['C'], 7: ['D'] },
    'D Minor':   { 1: ['D'], 2: ['E'], 3: ['F'], 4: ['G'], 5: ['A'], 6: ['Bb'], 7: ['C'] }
  };

  /** 음이름 정규화 (대문자 + #/b 통일) */
  function normalizeNoteName(str) {
    if (!str || typeof str !== 'string') return '';
    var s = str.trim().replace(/\s/g, '');
    var upper = s.charAt(0).toUpperCase();
    var acc = s.slice(1).replace(/sharp|#/gi, '#').replace(/flat|b/gi, 'b').replace(/[^#b]/g, '');
    if (acc.length > 1) acc = acc.includes('#') ? '#' : 'b';
    return upper + acc;
  }

  /**
   * 조(key)와 음이름으로 음계 도수(1~7) 반환. 없으면 null.
   */
  function noteToScaleDegree(noteName, keyName) {
    var key = KEY_SCALE_NOTES[keyName];
    if (!key) return null;
    var n = normalizeNoteName(noteName);
    for (var d = 1; d <= 7; d++) {
      var list = key[d];
      if (!list) continue;
      for (var i = 0; i < list.length; i++) {
        if (normalizeNoteName(list[i]) === n) return d;
      }
    }
    return null;
  }

  /**
   * API/프롬프트에서 반환된 조 이름 정규화 (예: "E major" -> "E Major", "Bb" -> "Bb Major")
   */
  function normalizeKeyName(str) {
    if (!str || typeof str !== 'string') return 'C Major';
    var s = str.trim();
    if (/major|minor|maj|min/i.test(s)) return s.replace(/\s*maj(or)?\s*/i, ' Major').replace(/\s*min(or)?\s*/i, ' Minor').replace(/\s+/g, ' ').trim();
    var base = s.replace(/#|b/g, '').trim();
    var acc = s.includes('#') ? '#' : s.includes('b') ? 'b' : '';
    var letter = base.charAt(0).toUpperCase();
    if (letter === 'B' && acc === 'b') return 'Bb Major';
    if (letter === 'B') return 'B Major';
    if (letter === 'E' && acc === 'b') return 'Eb Major';
    if (letter === 'E') return 'E Major';
    if (letter === 'A' && acc === 'b') return 'Ab Major';
    if (letter === 'A') return 'A Major';
    if (letter === 'D' && acc === 'b') return 'Db Major';
    if (letter === 'D') return 'D Major';
    if (letter === 'G' && acc === 'b') return 'Gb Major';
    if (letter === 'G') return 'G Major';
    if (letter === 'F' && acc === '#') return 'F# Major';
    if (letter === 'F') return 'F Major';
    if (letter === 'C' && acc === '#') return 'C# Major';
    return 'C Major';
  }

  /**
   * 악보 분석 결과(마디별 음이름) → 한글 자모 그리드 데이터로 변환 (메뉴얼 규칙 기반)
   * @param {Array} analyzedBars - [ { bar: 1, B: ['E'], M: ['B'], RAcc: ['G#','B'], LAcc: ['G#','B'] }, ... ]
   * @param {string} keyName - 예: 'E Major', 'C Major'
   * @returns {Array} SALUT_DAMOUR_BARS 형식의 자모 배열 (최대 16마디)
   */
  function notesToJamoBars(analyzedBars, keyName) {
    var normalizedKey = normalizeKeyName(keyName || '');
    var key = KEY_SCALE_NOTES[normalizedKey] ? normalizedKey : 'C Major';
    var out = [];
    var roles = ['B', 'M', 'RAcc', 'LAcc'];
    var maxBars = 16;
    for (var i = 0; i < maxBars; i++) {
      var src = analyzedBars && analyzedBars[i] ? analyzedBars[i] : { bar: i + 1 };
      var barNum = typeof src.bar === 'number' ? src.bar : (i + 1);
      var row = { bar: barNum };
      for (var r = 0; r < roles.length; r++) {
        var role = roles[r];
        var notes = src[role];
        var jamos = [];
        if (Array.isArray(notes)) {
          for (var n = 0; n < notes.length; n++) {
            var deg = noteToScaleDegree(notes[n], key);
            if (deg && SCALE_DEGREE_TO_JAMO[deg] && SCALE_DEGREE_TO_JAMO[deg][role]) {
              jamos.push(SCALE_DEGREE_TO_JAMO[deg][role]);
            }
          }
        }
        row[role] = jamos;
      }
      out.push(row);
    }
    return out;
  }

  // 역할 라벨 (한/영)
  var ROLE_LABELS = {
    B:    { ko: '구조 (베이스)', en: 'Structure (Bass)' },
    M:    { ko: '멜로디 (장식)', en: 'Melody (Facade)' },
    RAcc: { ko: '반주 오른손', en: 'R.H. Accompaniment' },
    LAcc: { ko: '반주 왼손', en: 'L.H. Accompaniment' }
  };

  /**
   * 사랑의 인사 (Salut d'Amour) Op.12 - 1~16마디 한글 자모 번역 결과
   * (doc/사랑의 인사_악보 한글번역.pdf 기준, E Major)
   */
  var SALUT_DAMOUR_BARS = [
    { bar: 1,  B: ['ㄷ'],     M: ['ㅎ'],       RAcc: ['ㅗ','ㅜ'],   LAcc: ['ㅖ','ㅡ'] },
    { bar: 2,  B: ['ㄷ'],     M: ['ㅇ'],       RAcc: ['ㅗ'],       LAcc: ['ㅖ','ㅠ'] },
    { bar: 3,  B: ['ㄷ'],     M: ['ㅈ'],       RAcc: ['ㅛ','ㅕ'],   LAcc: ['ㅐ','ㅠ'] },
    { bar: 4,  B: ['ㄷ'],     M: ['ㅊ'],       RAcc: ['ㅗ','ㅓ'],   LAcc: ['ㅡ','ㅖ'] },
    { bar: 5,  B: ['ㄷ'],     M: ['ㅈ'],       RAcc: ['ㅛ'],       LAcc: ['ㅐ','ㅡ'] },
    { bar: 6,  B: ['ㅅ'],     M: ['ㅇ'],       RAcc: ['ㅗ'],       LAcc: ['ㅖ','ㅠ'] },
    { bar: 7,  B: ['ㄴ'],     M: ['ㅎ'],       RAcc: ['ㅗ','ㅕ'],   LAcc: ['ㅖ','ㅔ'] },
    { bar: 8,  B: ['ㄱ'],     M: ['ㅈ'],       RAcc: ['ㅛ'],       LAcc: ['ㅐ','ㅠ'] },
    { bar: 9,  B: ['ㅂ'],     M: ['ㅊ'],       RAcc: ['ㅓ'],       LAcc: ['ㅣ','ㅐ'] },
    { bar: 10, B: ['ㅂ'],     M: ['ㅊ'],       RAcc: ['ㅓ'],       LAcc: ['ㅣ','ㅐ'] },
    { bar: 11, B: ['ㅂ'],     M: ['ㅋ'],       RAcc: ['ㅕ'],       LAcc: ['ㅐ','ㅔ'] },
    { bar: 12, B: ['ㅂ'],     M: ['ㅊ'],       RAcc: ['ㅓ'],       LAcc: ['ㅣ','ㅐ'] },
    { bar: 13, B: ['ㅂ'],     M: ['ㅈ'],       RAcc: ['ㅛ'],       LAcc: ['ㅐ','ㅡ'] },
    { bar: 14, B: ['ㅂ'],     M: ['ㅇ'],       RAcc: ['ㅗ'],       LAcc: ['ㅐ','ㅠ'] },
    { bar: 15, B: ['ㅂ'],     M: ['ㅎ'],       RAcc: ['ㅜ'],       LAcc: ['ㅐ','ㅒ'] },
    { bar: 16, B: ['ㅂ'],     M: ['ㅎ'],       RAcc: ['ㅜ'],       LAcc: ['ㅒ'] }
  ];

  function getColorForJamo(jamo) {
    var scale = JAMO_TO_SCALE[jamo];
    return scale ? SCALE_COLORS[scale] : '#9E9E9E';
  }

  /**
   * 한글 건축 2D 그리드 렌더링
   * @param {HTMLElement} container - 부모 요소
   * @param {Object} options - { bars: array, lang: 'ko'|'en' }
   */
  function renderArchitectureGrid(container, options) {
    var bars = options && options.bars ? options.bars : SALUT_DAMOUR_BARS;
    var lang = (options && options.lang) || 'ko';
    var roles = ['B', 'M', 'RAcc', 'LAcc'];

    container.innerHTML = '';
    container.classList.add('hangeul-arch-grid-wrap');

    var table = document.createElement('div');
    table.className = 'hangeul-arch-grid';
    table.setAttribute('role', 'table');
    table.setAttribute('aria-label', lang === 'ko' ? '사랑의 인사 한글 건축 마디별 자모' : 'Salut d\'Amour Hangeul architecture by bar');

    // 헤더: 마디 번호
    var headerRow = document.createElement('div');
    headerRow.className = 'hangeul-arch-row hangeul-arch-header';
    var corner = document.createElement('div');
    corner.className = 'hangeul-arch-cell hangeul-arch-corner';
    corner.textContent = '';
    headerRow.appendChild(corner);
    for (var b = 0; b < bars.length; b++) {
      var th = document.createElement('div');
      th.className = 'hangeul-arch-cell hangeul-arch-bar-num';
      th.textContent = bars[b].bar;
      th.setAttribute('title', (lang === 'ko' ? '마디 ' : 'Bar ') + bars[b].bar);
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // 역할별 행
    for (var r = 0; r < roles.length; r++) {
      var role = roles[r];
      var row = document.createElement('div');
      row.className = 'hangeul-arch-row';
      var roleLabel = document.createElement('div');
      roleLabel.className = 'hangeul-arch-cell hangeul-arch-role-label';
      roleLabel.textContent = ROLE_LABELS[role][lang];
      row.appendChild(roleLabel);

      for (var i = 0; i < bars.length; i++) {
        var barData = bars[i];
        var jamos = barData[role] || [];
        var cell = document.createElement('div');
        cell.className = 'hangeul-arch-cell hangeul-arch-bar-cell';
        cell.setAttribute('data-bar', barData.bar);
        cell.setAttribute('data-role', role);

        var blocks = document.createElement('div');
        blocks.className = 'hangeul-arch-blocks';
        for (var j = 0; j < jamos.length; j++) {
          var jamo = jamos[j];
          var block = document.createElement('span');
          block.className = 'hangeul-arch-block';
          block.textContent = jamo;
          block.style.backgroundColor = getColorForJamo(jamo);
          block.style.color = jamo === 'ㅇ' || jamo === 'ㅡ' ? '#333' : '#fff';
          block.setAttribute('title', jamo + ' → ' + (JAMO_TO_SCALE[jamo] || ''));
          blocks.appendChild(block);
        }
        cell.appendChild(blocks);
        row.appendChild(cell);
      }
      table.appendChild(row);
    }

    container.appendChild(table);

    // 범례 (7음계 색상)
    var legend = document.createElement('div');
    legend.className = 'hangeul-arch-legend';
    legend.setAttribute('aria-label', lang === 'ko' ? '음계별 색상' : 'Scale colors');
    var scaleNames = lang === 'ko'
      ? { do: '도', re: '레', mi: '미', fa: '파', sol: '솔', la: '라', si: '시' }
      : { do: 'C', re: 'D', mi: 'E', fa: 'F', sol: 'G', la: 'A', si: 'B' };
    for (var s in SCALE_COLORS) {
      var item = document.createElement('span');
      item.className = 'hangeul-arch-legend-item';
      item.style.backgroundColor = SCALE_COLORS[s];
      item.textContent = scaleNames[s] || s;
      item.style.color = s === 'mi' || s === 'do' ? '#333' : '#fff';
      legend.appendChild(item);
    }
    container.appendChild(legend);
  }

  /**
   * 한글 건축 그리드를 캔버스에 그려 PNG 이미지로 반환
   * @param {Array} bars - 마디별 데이터 (SALUT_DAMOUR_BARS 형식)
   * @param {Object} options - { lang: 'ko'|'en', title?: string }
   * @returns {string} data URL (image/png)
   */
  function generateArchitectureImage(bars, options) {
    bars = bars || SALUT_DAMOUR_BARS;
    var lang = (options && options.lang) || 'ko';
    var title = (options && options.title) || (lang === 'ko' ? '사랑의 인사 (Salut d\'Amour), Op.12' : 'Salut d\'Amour, Op.12');
    var roles = ['B', 'M', 'RAcc', 'LAcc'];

    var pad = 24;
    var cellW = 44;
    var cellH = 36;
    var labelW = 100;
    var headerH = 40;
    var rowH = cellH + 4;
    var legendH = 44;
    var titleH = 56;
    var scaleOrder = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];
    var scaleNames = lang === 'ko' ? { do: '도', re: '레', mi: '미', fa: '파', sol: '솔', la: '라', si: '시' } : { do: 'C', re: 'D', mi: 'E', fa: 'F', sol: 'G', la: 'A', si: 'B' };

    var w = labelW + bars.length * cellW + pad * 2;
    var h = titleH + headerH + 4 * rowH + legendH + pad * 2;

    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');

    // 배경
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    ctx.font = 'bold 18px "Noto Sans KR", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    ctx.fillText(title, w / 2, 32);

    var y = titleH + pad;

    // 헤더 행 (마디 번호)
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(pad, y, labelW, headerH);
    for (var b = 0; b < bars.length; b++) {
      ctx.fillRect(pad + labelW + b * cellW, y, cellW, headerH);
    }
    ctx.fillStyle = '#64748b';
    ctx.font = '12px "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center';
    for (var b = 0; b < bars.length; b++) {
      ctx.fillText(String(bars[b].bar), pad + labelW + b * cellW + cellW / 2, y + headerH / 2 + 4);
    }
    y += headerH;

    // 역할별 행
    for (var r = 0; r < roles.length; r++) {
      var role = roles[r];
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(pad, y, labelW, rowH);
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'left';
      ctx.font = '11px "Noto Sans KR", sans-serif';
      ctx.fillText(ROLE_LABELS[role][lang], pad + 8, y + rowH / 2 + 4);

      for (var i = 0; i < bars.length; i++) {
        var barData = bars[i];
        var jamos = barData[role] || [];
        var cx = pad + labelW + i * cellW;
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(cx, y, cellW, rowH);

        var blockSize = 20;
        var gap = 3;
        var startX = cx + (cellW - (jamos.length * (blockSize + gap) - gap)) / 2;
        var by = y + (rowH - blockSize) / 2;
        for (var j = 0; j < jamos.length; j++) {
          var jamo = jamos[j];
          var bx = startX + j * (blockSize + gap);
          ctx.fillStyle = getColorForJamo(jamo);
          ctx.fillRect(bx, by, blockSize, blockSize);
          ctx.fillStyle = (jamo === 'ㅇ' || jamo === 'ㅡ') ? '#333' : '#fff';
          ctx.font = 'bold 14px "Noto Sans KR", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(jamo, bx + blockSize / 2, by + blockSize / 2);
        }
      }
      y += rowH;
    }

    // 범례
    y += 8;
    ctx.font = '11px "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center';
    var lx = pad;
    for (var s = 0; s < scaleOrder.length; s++) {
      var sk = scaleOrder[s];
      var sc = SCALE_COLORS[sk];
      ctx.fillStyle = sc;
      ctx.fillRect(lx, y, 28, 24);
      ctx.fillStyle = (sk === 'mi' || sk === 'do') ? '#333' : '#fff';
      ctx.fillText(scaleNames[sk] || sk, lx + 14, y + 12);
      lx += 36;
    }

    return canvas.toDataURL('image/png');
  }

  global.HANGEUL_ARCHITECTURE = {
    SCALE_COLORS: SCALE_COLORS,
    JAMO_TO_SCALE: JAMO_TO_SCALE,
    KEY_SCALE_NOTES: KEY_SCALE_NOTES,
    SCALE_DEGREE_TO_JAMO: SCALE_DEGREE_TO_JAMO,
    ROLE_LABELS: ROLE_LABELS,
    SALUT_DAMOUR_BARS: SALUT_DAMOUR_BARS,
    getColorForJamo: getColorForJamo,
    normalizeKeyName: normalizeKeyName,
    noteToScaleDegree: noteToScaleDegree,
    notesToJamoBars: notesToJamoBars,
    renderArchitectureGrid: renderArchitectureGrid,
    generateArchitectureImage: generateArchitectureImage
  };
})(typeof window !== 'undefined' ? window : this);
