// SIMS Fashion AI - Internationalization (i18n)
// 한국어(ko) / English(en) 다국어 지원

(function() {
  'use strict';

  // ========================================
  // Translation Data
  // ========================================
  var translations = {
    // --- Navigation ---
    'nav.features': { ko: 'Features', en: 'Features' },
    'nav.ai_styling': { ko: 'AI Styling', en: 'AI Styling' },
    'nav.lookbook': { ko: 'Lookbook', en: 'Lookbook' },
    'nav.about': { ko: 'About', en: 'About' },
    'nav.login': { ko: '로그인', en: 'Login' },
    'nav.logout': { ko: '로그아웃', en: 'Logout' },

    // --- Hero ---
    'hero.badge': { ko: 'AI-Powered Fashion', en: 'AI-Powered Fashion' },
    'hero.tagline': { ko: '나만의 컬러 × 나만의 무드 · 특별한 만남', en: 'Your Color × Your Mood · A Special Encounter' },
    'hero.title_line': { ko: '당신만을 위한', en: 'Exclusively for You' },
    'hero.title_highlight': { ko: '특별한 체험', en: 'A Special Experience' },
    'hero.desc': {
      ko: '퍼스널 컬러와 어울리는 무드·음악까지 한곳에서.<br>AI가 당신의 체형, 피부톤, 라이프스타일을 분석해<br><strong>세상에 단 하나뿐인</strong> 스타일과 특별한 경험을 제안합니다',
      en: 'Personal color, mood & music all in one place.<br>AI analyzes your body, skin tone & lifestyle to propose<br><strong>one-of-a-kind</strong> style and special experiences'
    },
    'hero.cta_start': { ko: '무료로 시작하기', en: 'Get Started Free' },
    'hero.cta_video': { ko: '소개 영상 보기', en: 'Watch Video' },
    'hero.stat_users': { ko: 'Active Users', en: 'Active Users' },
    'hero.stat_satisfaction': { ko: 'Satisfaction', en: 'Satisfaction' },
    'hero.stat_styles': { ko: 'Styles Created', en: 'Styles Created' },

    // Hero phone mockup
    'hero.phone_title': { ko: '나만의 컬러 & 무드', en: 'My Color & Mood' },
    'hero.phone_sub': { ko: '특별한 나를 만나는 순간', en: 'The Moment You Meet the Special You' },
    'hero.mood_1': { ko: '나의 무드 · 청량한', en: 'My Mood · Refreshing' },
    'hero.mood_2': { ko: '나의 무드 · 밝은 에너지', en: 'My Mood · Bright Energy' },
    'hero.ai_suggestion': {
      ko: '나만의 컬러와 만나는 <strong>특별한 체험</strong>, 지금 시작하세요',
      en: 'Discover your color in a <strong>special experience</strong> — start now'
    },

    // --- Features ---
    'features.badge': { ko: 'Features', en: 'Features' },
    'features.title': { ko: 'AI가 만드는 새로운 패션 경험', en: 'A New Fashion Experience Powered by AI' },
    'features.desc': { ko: '최첨단 AI 기술로 당신만의 스타일을 발견하세요', en: 'Discover your unique style with cutting-edge AI technology' },
    'features.body_title': { ko: '체형 분석', en: 'Body Analysis' },
    'features.body_desc': { ko: 'AI가 사진 한 장으로 체형을 분석하여 가장 잘 어울리는 실루엣과 핏을 추천합니다', en: 'AI analyzes your body from a single photo and recommends the best silhouette and fit' },
    'features.color_title': { ko: '퍼스널 컬러', en: 'Personal Color' },
    'features.color_desc': { ko: '피부톤, 눈동자, 머리카락 색상을 분석하여 당신에게 완벽한 컬러 팔레트를 제안합니다', en: 'Analyzes your skin tone, eyes & hair color to suggest the perfect color palette' },
    'features.curation_title': { ko: '스타일 큐레이션', en: 'Style Curation' },
    'features.curation_desc': { ko: '수백만 개의 패션 데이터를 학습한 AI가 트렌드와 취향을 반영한 스타일을 큐레이션합니다', en: 'AI trained on millions of fashion data curates styles reflecting trends and your taste' },
    'features.learning_title': { ko: '취향 학습', en: 'Taste Learning' },
    'features.learning_desc': { ko: '사용할수록 똑똑해지는 AI가 당신의 취향을 학습하여 점점 더 정확한 추천을 제공합니다', en: 'The more you use it, the smarter AI gets — learning your taste for more accurate recommendations' },
    'features.fitting_title': { ko: '가상 피팅', en: 'Virtual Fitting' },
    'features.fitting_desc': { ko: 'AR 기술로 옷을 입어보지 않고도 실제 착용 모습을 미리 확인할 수 있습니다', en: 'Preview how clothes look on you without trying them on, using AR technology' },
    'features.shopping_title': { ko: '원클릭 쇼핑', en: 'One-Click Shopping' },
    'features.shopping_desc': { ko: '마음에 드는 아이템을 발견하면 파트너 브랜드에서 바로 구매할 수 있습니다', en: 'When you find an item you love, purchase it directly from our partner brands' },

    // --- AI Styling ---
    'ai.badge': { ko: 'AI Styling', en: 'AI Styling' },
    'ai.title': { ko: '3단계로 완성되는<br>나만의 스타일', en: 'Your Personal Style<br>in 3 Steps' },
    'ai.step1_title': { ko: '프로필 분석', en: 'Profile Analysis' },
    'ai.step1_desc': { ko: '간단한 설문과 사진으로 AI가 당신을 분석합니다', en: 'AI analyzes you through a simple survey and photos' },
    'ai.step2_title': { ko: '스타일 생성', en: 'Style Generation' },
    'ai.step2_desc': { ko: '수백만 개의 패션 데이터에서 최적의 스타일을 찾습니다', en: 'Finding the optimal style from millions of fashion data' },
    'ai.step3_title': { ko: '맞춤 추천', en: 'Custom Recommendation' },
    'ai.step3_desc': { ko: '매일 새로운 코디와 아이템을 추천받으세요', en: 'Get daily new outfit and item recommendations' },
    'ai.cta': { ko: 'AI 스타일링 시작하기', en: 'Start AI Styling' },

    // --- Lookbook ---
    'lookbook.badge': { ko: 'Lookbook', en: 'Lookbook' },
    'lookbook.title': { ko: "AI가 추천하는 Today's Pick", en: "AI's Today's Pick" },
    'lookbook.desc': { ko: '실시간 트렌드와 날씨를 반영한 오늘의 추천 스타일', en: "Today's recommended styles reflecting real-time trends and weather" },
    'lookbook.minimal': { ko: '미니멀 시크', en: 'Minimal Chic' },
    'lookbook.minimal_desc': { ko: '깔끔한 라인과 뉴트럴 컬러로 완성하는 모던 룩', en: 'A modern look with clean lines and neutral colors' },
    'lookbook.street': { ko: '스트릿 캐주얼', en: 'Street Casual' },
    'lookbook.business': { ko: '비즈니스 캐주얼', en: 'Business Casual' },
    'lookbook.relax': { ko: '릴렉스 핏', en: 'Relaxed Fit' },
    'lookbook.romantic': { ko: '로맨틱 무드', en: 'Romantic Mood' },

    // --- Testimonials ---
    'testimonials.badge': { ko: 'Reviews', en: 'Reviews' },
    'testimonials.title': { ko: '사용자들의 이야기', en: 'User Stories' },
    'testimonials.review1': {
      ko: '"매일 아침 뭘 입을지 고민했는데, 이제는 AI가 추천해주는 대로 입으면 돼서 너무 편해요!"',
      en: '"I used to wonder what to wear every morning, but now AI recommends outfits for me — so convenient!"'
    },
    'testimonials.author1_name': { ko: '지영', en: 'Jiyoung' },
    'testimonials.author1_role': { ko: '직장인, 28세', en: 'Office Worker, 28' },
    'testimonials.review2': {
      ko: '"퍼스널 컬러 진단받고 완전 인생템들만 추천받아요. 옷 쇼핑 실패가 없어졌어요."',
      en: '"After getting my personal color diagnosis, I only get life-changing recommendations. No more shopping fails!"'
    },
    'testimonials.author2_name': { ko: '민준', en: 'Minjun' },
    'testimonials.author2_role': { ko: '대학생, 24세', en: 'College Student, 24' },
    'testimonials.review3': {
      ko: '"체형 분석 결과 보고 깜짝 놀랐어요. 제가 왜 그 스타일이 안 어울렸는지 이제 알겠어요!"',
      en: '"I was amazed by the body analysis results. Now I understand why certain styles didn\'t suit me!"'
    },
    'testimonials.author3_name': { ko: '서현', en: 'Seohyun' },
    'testimonials.author3_role': { ko: '프리랜서, 32세', en: 'Freelancer, 32' },

    // --- About ---
    'about.badge': { ko: 'About Us', en: 'About Us' },
    'about.title': { ko: '패션의 미래를<br>AI로 열어갑니다', en: 'Opening the Future<br>of Fashion with AI' },
    'about.desc': {
      ko: 'SIMS Fashion AI는 최첨단 인공지능 기술과 패션 전문가의 노하우를 결합하여, 모든 사람이 자신만의 스타일을 찾을 수 있도록 돕는 것을 목표로 합니다.',
      en: 'SIMS Fashion AI combines cutting-edge AI technology with fashion expertise to help everyone discover their own style.'
    },
    'about.tech_title': { ko: 'AI 기술력', en: 'AI Technology' },
    'about.tech_desc': { ko: '최신 딥러닝 모델 기반 분석', en: 'Analysis based on latest deep learning models' },
    'about.realtime_title': { ko: '실시간 추천', en: 'Real-time Picks' },
    'about.realtime_desc': { ko: '날씨, 일정에 맞는 즉시 코디', en: 'Instant outfits for weather & schedule' },
    'about.users_title': { ko: '50K+ 사용자', en: '50K+ Users' },
    'about.users_desc': { ko: '검증된 스타일링 서비스', en: 'Proven styling service' },

    // --- CTA ---
    'cta.title': { ko: '지금 바로 나만의 스타일을 발견하세요', en: 'Discover Your Style Now' },
    'cta.desc': { ko: 'AI 스타일리스트가 당신을 기다리고 있습니다', en: 'Your AI stylist is waiting for you' },
    'cta.start': { ko: '무료로 시작하기', en: 'Get Started Free' },
    'cta.learn': { ko: '더 알아보기', en: 'Learn More' },

    // --- Footer ---
    'footer.tagline': { ko: 'AI 기반 초개인화 패션 플랫폼', en: 'AI-Powered Hyper-Personalized Fashion Platform' },
    'footer.product': { ko: 'Product', en: 'Product' },
    'footer.ai_styling': { ko: 'AI 스타일링', en: 'AI Styling' },
    'footer.personal_color': { ko: '퍼스널 컬러', en: 'Personal Color' },
    'footer.virtual_fitting': { ko: '가상 피팅', en: 'Virtual Fitting' },
    'footer.pricing': { ko: '가격 정책', en: 'Pricing' },
    'footer.company': { ko: 'Company', en: 'Company' },
    'footer.partnership': { ko: '제휴문의', en: 'Partnership' },
    'footer.support': { ko: 'Support', en: 'Support' },
    'footer.copyright': { ko: '© 2026 SIMS Fashion AI. All rights reserved.', en: '© 2026 SIMS Fashion AI. All rights reserved.' },

    // --- Comments ---
    'comments.title': { ko: '댓글', en: 'Comments' },

    // --- Auth Modal ---
    'auth.welcome': { ko: 'Welcome', en: 'Welcome' },
    'auth.subtitle': { ko: 'SIMS Fashion AI에 오신 것을 환영합니다', en: 'Welcome to SIMS Fashion AI' },
    'auth.tab_login': { ko: '로그인', en: 'Login' },
    'auth.tab_signup': { ko: '회원가입', en: 'Sign Up' },
    'auth.email': { ko: '이메일', en: 'Email' },
    'auth.password': { ko: '비밀번호', en: 'Password' },
    'auth.password_confirm': { ko: '비밀번호 확인', en: 'Confirm Password' },
    'auth.login_btn': { ko: '로그인', en: 'Login' },
    'auth.signup_btn': { ko: '회원가입', en: 'Sign Up' },
    'auth.pw_placeholder': { ko: '비밀번호 입력', en: 'Enter password' },
    'auth.pw_min': { ko: '6자 이상', en: 'Min 6 characters' },
    'auth.pw_confirm_placeholder': { ko: '다시 입력', en: 'Re-enter password' },

    // --- Partnership ---
    'partnership.title': { ko: '제휴문의', en: 'Partnership Inquiry' },
    'partnership.desc': { ko: 'SIMS Fashion AI와 함께하고 싶으시다면 아래 양식을 작성해 주세요.', en: 'Fill out the form below to partner with SIMS Fashion AI.' },
    'partnership.name': { ko: '이름 / 담당자', en: 'Name / Contact Person' },
    'partnership.email': { ko: '이메일', en: 'Email' },
    'partnership.company': { ko: '회사 / 브랜드', en: 'Company / Brand' },
    'partnership.message': { ko: '문의 내용', en: 'Message' },
    'partnership.submit': { ko: '보내기', en: 'Send' },

    // --- Chat ---
    'chat.title': { ko: 'SIMS AI 스타일리스트', en: 'SIMS AI Stylist' },
    'chat.status': { ko: '온라인', en: 'Online' },
    'chat.hello': { ko: '안녕하세요!', en: 'Hello!' },
    'chat.intro': {
      ko: '저는 당신의 AI 스타일리스트입니다.<br>패션, 스타일, 코디에 대해 무엇이든 물어보세요.',
      en: "I'm your AI stylist.<br>Ask me anything about fashion, style & outfits."
    },
    'chat.placeholder': { ko: '메시지를 입력하세요...', en: 'Type a message...' },
    'chat.q1': { ko: '오늘의 코디 추천', en: "Today's Outfit" },
    'chat.q2': { ko: '퍼스널 컬러 진단', en: 'Personal Color' },
    'chat.q3': { ko: '2026 트렌드', en: '2026 Trends' },
    'chat.q4': { ko: '미니멀 스타일링', en: 'Minimal Styling' },
    'chat.q5': { ko: '내 취향 말해줘', en: 'Tell My Taste' }
  };

  // ========================================
  // i18n Engine
  // ========================================
  var currentLang = localStorage.getItem('sims-lang') || 'ko';

  function t(key) {
    var entry = translations[key];
    if (!entry) return '';
    return entry[currentLang] || entry['ko'] || '';
  }

  function setLang(lang) {
    if (lang !== 'ko' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem('sims-lang', lang);
    document.documentElement.lang = lang;
    applyTranslations();
    updateLangToggle();
  }

  function applyTranslations() {
    // data-i18n: set textContent
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      var val = t(key);
      if (val) els[i].textContent = val;
    }
    // data-i18n-html: set innerHTML (for tags like <br>, <strong>)
    var htmlEls = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlEls.length; j++) {
      var hkey = htmlEls[j].getAttribute('data-i18n-html');
      var hval = t(hkey);
      if (hval) htmlEls[j].innerHTML = hval;
    }
    // data-i18n-placeholder: set placeholder
    var phEls = document.querySelectorAll('[data-i18n-placeholder]');
    for (var k = 0; k < phEls.length; k++) {
      var pkey = phEls[k].getAttribute('data-i18n-placeholder');
      var pval = t(pkey);
      if (pval) phEls[k].placeholder = pval;
    }
    // Update page title
    document.title = currentLang === 'en'
      ? 'SIMS Fashion AI - Style Recommendation Just for You'
      : 'SIMS Fashion AI - 나만을 위한 스타일 추천';
  }

  function updateLangToggle() {
    var koBtn = document.getElementById('lang-ko');
    var enBtn = document.getElementById('lang-en');
    if (koBtn && enBtn) {
      koBtn.classList.toggle('active', currentLang === 'ko');
      enBtn.classList.toggle('active', currentLang === 'en');
    }
  }

  // ========================================
  // Initialize on DOM ready
  // ========================================
  function initI18n() {
    // Set initial language from storage or default
    document.documentElement.lang = currentLang;

    // Attach button handlers
    var koBtn = document.getElementById('lang-ko');
    var enBtn = document.getElementById('lang-en');
    if (koBtn) {
      koBtn.addEventListener('click', function() { setLang('ko'); });
    }
    if (enBtn) {
      enBtn.addEventListener('click', function() { setLang('en'); });
    }

    // Apply translations
    updateLangToggle();
    applyTranslations();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
  } else {
    initI18n();
  }

  // Expose for external use
  window.__simsI18n = {
    t: t,
    setLang: setLang,
    getLang: function() { return currentLang; }
  };

})();
