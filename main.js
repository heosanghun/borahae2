// BORAHAE - Main JavaScript

(function() {
  'use strict';

  // ========================================
  // API Keys (.env → config.js 에서 주입)
  // ========================================
  const GEMINI_API_KEY = (typeof window !== 'undefined' && window.__SIMS_GEMINI_KEY__) || '';
  if (typeof window !== 'undefined') window.__hasGeminiApiKey = !!GEMINI_API_KEY;
  const OPENAI_API_KEY = (typeof window !== 'undefined' && window.__SIMS_OPENAI_KEY__) || '';

  // ========================================
  // Supabase Auth (회원가입 / 로그인)
  // ========================================
  // Supabase 클라이언트는 index.html의 ESM 모듈에서 생성 → window.__supabaseClient
  var supabase = window.__supabaseClient || null;
  var supabaseReady = !!supabase;

  function getSupabase() {
    if (!supabase) supabase = window.__supabaseClient || null;
    return supabase;
  }

  function waitForSupabase(callback) {
    var sb = getSupabase();
    if (sb) { callback(sb); return; }
    window.addEventListener('supabase-ready', function() {
      var s = getSupabase();
      if (s) callback(s);
    });
  }

  function updateAuthNav(user) {
    var guestEl = document.getElementById('auth-nav-guest');
    var userEl = document.getElementById('auth-nav-user');
    var emailEl = document.getElementById('auth-user-email');
    if (!guestEl || !userEl) return;
    if (user && user.email) {
      guestEl.style.display = 'none';
      userEl.style.display = '';
      if (emailEl) emailEl.textContent = user.email;
    } else {
      guestEl.style.display = '';
      userEl.style.display = 'none';
      if (emailEl) emailEl.textContent = '';
    }
  }

  function openAuthModal(tab) {
    var m = document.getElementById('auth-modal');
    if (!m) return;
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var loginPanel = document.getElementById('auth-form-login');
    var signupPanel = document.getElementById('auth-form-signup');
    var tabLogin = document.getElementById('auth-tab-login');
    var tabSignup = document.getElementById('auth-tab-signup');
    if (tab === 'signup') {
      if (loginPanel) loginPanel.classList.remove('active');
      if (signupPanel) signupPanel.classList.add('active');
      if (tabLogin) tabLogin.classList.remove('active');
      if (tabSignup) tabSignup.classList.add('active');
    } else {
      if (loginPanel) loginPanel.classList.add('active');
      if (signupPanel) signupPanel.classList.remove('active');
      if (tabLogin) tabLogin.classList.add('active');
      if (tabSignup) tabSignup.classList.remove('active');
    }
    var loginErr = document.getElementById('auth-login-error');
    var signupErr = document.getElementById('auth-signup-error');
    if (loginErr) loginErr.textContent = '';
    if (signupErr) signupErr.textContent = '';
  }

  function closeAuthModal() {
    var m = document.getElementById('auth-modal');
    if (!m) return;
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initSupabaseAuth() {
    var sb = getSupabase();
    if (!sb) return;
    sb.auth.onAuthStateChange(function(event, session) {
      updateAuthNav(session && session.user ? session.user : null);
    });
    sb.auth.getSession().then(function(res) {
      updateAuthNav(res.data.session && res.data.session.user ? res.data.session.user : null);
    });
  }

  // 즉시 시도 + ESM 로드 이벤트 대기
  if (getSupabase()) {
    initSupabaseAuth();
  } else {
    updateAuthNav(null);
    window.addEventListener('supabase-ready', function() {
      initSupabaseAuth();
    });
  }

  document.getElementById('nav-login-btn') && document.getElementById('nav-login-btn').addEventListener('click', function() {
    openAuthModal('login');
  });
  document.getElementById('nav-logout-btn') && document.getElementById('nav-logout-btn').addEventListener('click', function() {
    var sb = getSupabase();
    if (sb) sb.auth.signOut();
  });
  document.getElementById('auth-modal-close') && document.getElementById('auth-modal-close').addEventListener('click', closeAuthModal);
  document.getElementById('auth-modal') && document.getElementById('auth-modal').addEventListener('click', function(e) {
    if (e.target === this) closeAuthModal();
  });

  document.getElementById('auth-tab-login') && document.getElementById('auth-tab-login').addEventListener('click', function() {
    openAuthModal('login');
  });
  document.getElementById('auth-tab-signup') && document.getElementById('auth-tab-signup').addEventListener('click', function() {
    openAuthModal('signup');
  });

  function doLogin(sb) {
    var emailEl = document.getElementById('auth-login-email');
    var pwEl = document.getElementById('auth-login-password');
    var errEl = document.getElementById('auth-login-error');
    var email = emailEl && emailEl.value ? emailEl.value.trim() : '';
    var password = pwEl ? pwEl.value : '';
    if (!email || !password) {
      if (errEl) errEl.textContent = '이메일과 비밀번호를 입력해 주세요.';
      return;
    }
    if (errEl) errEl.textContent = '';
    sb.auth.signInWithPassword({ email: email, password: password })
      .then(function(res) {
        if (res.error) {
          if (errEl) errEl.textContent = res.error.message || '로그인에 실패했습니다.';
          return;
        }
        closeAuthModal();
      })
      .catch(function(err) {
        if (errEl) errEl.textContent = err.message || '로그인에 실패했습니다.';
      });
  }

  function doSignup(sb) {
    var emailEl = document.getElementById('auth-signup-email');
    var pwEl = document.getElementById('auth-signup-password');
    var pwConfirmEl = document.getElementById('auth-signup-password-confirm');
    var errEl = document.getElementById('auth-signup-error');
    var email = emailEl && emailEl.value ? emailEl.value.trim() : '';
    var password = pwEl ? pwEl.value : '';
    var passwordConfirm = pwConfirmEl ? pwConfirmEl.value : '';
    if (!email || !password) {
      if (errEl) errEl.textContent = '이메일과 비밀번호를 입력해 주세요.';
      return;
    }
    if (password.length < 6) {
      if (errEl) errEl.textContent = '비밀번호는 6자 이상이어야 합니다.';
      return;
    }
    if (password !== passwordConfirm) {
      if (errEl) errEl.textContent = '비밀번호가 일치하지 않습니다.';
      return;
    }
    if (errEl) errEl.textContent = '';
    sb.auth.signUp({ email: email, password: password })
      .then(function(res) {
        if (res.error) {
          if (errEl) errEl.textContent = res.error.message || '회원가입에 실패했습니다.';
          return;
        }
        closeAuthModal();
        if (res.data.user && !res.data.session) {
          alert('가입한 이메일로 확인 메일을 보냈습니다. 링크를 클릭한 뒤 로그인해 주세요.');
        }
      })
      .catch(function(err) {
        if (errEl) errEl.textContent = err.message || '회원가입에 실패했습니다.';
      });
  }

  document.getElementById('auth-login-form') && document.getElementById('auth-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var errEl = document.getElementById('auth-login-error');
    var sb = getSupabase();
    if (sb) { doLogin(sb); return; }
    if (errEl) errEl.textContent = '연결 중... 잠시만 기다려 주세요.';
    waitForSupabase(function(s) {
      if (errEl) errEl.textContent = '';
      if (s) doLogin(s);
      else if (errEl) errEl.textContent = 'Supabase 연결에 실패했습니다. 페이지를 새로고침해 주세요.';
    });
  });

  document.getElementById('auth-signup-form') && document.getElementById('auth-signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var errEl = document.getElementById('auth-signup-error');
    var sb = getSupabase();
    if (sb) { doSignup(sb); return; }
    if (errEl) errEl.textContent = '연결 중... 잠시만 기다려 주세요.';
    waitForSupabase(function(s) {
      if (errEl) errEl.textContent = '';
      if (s) doSignup(s);
      else if (errEl) errEl.textContent = 'Supabase 연결에 실패했습니다. 페이지를 새로고침해 주세요.';
    });
  });

  // ========================================
  // 7컬러 × 퍼스널컬러 × 음악 추천 (BTS 멤버 미거론, 무드만 사용)
  // ========================================
  const COLOR_MUSIC = {
    red: { name: '빨강', mood: '열정적이고 강렬한', description: '에너지 넘치는 비트와 강렬한 무드가 잘 어울려요.', directLink: 'https://www.youtube.com/watch?v=4ujQOR2DMFM', searchLink: 'https://www.youtube.com/results?search_query=Fire+%EB%B6%88%ED%83%80%EC%98%A4%EB%A5%B4%EB%84%A4+official+MV' },
    orange: { name: '주황', mood: '따뜻하고 유쾌한', description: '스무스하고 경쾌한 팝 무드와 잘 맞아요.', directLink: 'https://www.youtube.com/watch?v=ZlQIw9EPui0', searchLink: 'https://www.youtube.com/results?search_query=Butter+official+MV' },
    yellow: { name: '노랑', mood: '밝고 활기찬', description: '디스코와 밝은 에너지가 잘 어울려요.', directLink: 'https://www.youtube.com/watch?v=gdZLi9oWNZg', searchLink: 'https://www.youtube.com/results?search_query=Dynamite+official+MV' },
    green: { name: '초록', mood: '달콤하고 설레는', description: '달달하고 희망적인 무드와 잘 맞아요.', directLink: 'https://www.youtube.com/watch?v=XsX3ATc3FbA', searchLink: 'https://www.youtube.com/results?search_query=Boy+With+Luv+%EC%9E%91%EC%9D%80+%EA%B2%83%EB%93%A4%EC%9D%84+%EC%9C%84%ED%95%9C+%EC%8B%9C+official' },
    blue: { name: '파랑', mood: '시원하고 청량한', description: '신선하고 쿨한 비트가 잘 어울려요.', directLink: 'https://www.youtube.com/watch?v=MBdVXkSdhwU', searchLink: 'https://www.youtube.com/results?search_query=DNA+official+MV' },
    indigo: { name: '남색', mood: '깊고 예술적인', description: '내면적이고 드라마틱한 무드와 잘 맞아요.', directLink: 'https://www.youtube.com/watch?v=0lapF4DQPKQ', searchLink: 'https://www.youtube.com/results?search_query=Black+Swan+official+MV' },
    violet: { name: '보라', mood: '감성적이고 몽환적인', description: '감성과 위로가 담긴 무드와 잘 맞아요.', directLink: 'https://www.youtube.com/watch?v=xEeFrLSkMm8', searchLink: 'https://www.youtube.com/results?search_query=%EB%B4%84%EB%82%A0+Spring+Day+official+MV' }
  };
  // 7컬러 → 한글 소모오 캐릭터 1명 (성향 기반, 순서 무관)
  const COLOR_TO_HANGUL = {
    red:    { name: '초롱', nameEn: 'ChoLong', role: '댄서', roleEn: 'Dancer', message: '열정과 리듬이 있는 너에게 어울리는 친구예요. 춤처럼 에너지를 발산해 보세요.', messageEn: 'A friend who matches your passion and rhythm. Let your energy out like dance.' },
    orange: { name: '오롱', nameEn: 'OhLong', role: '웃음꽃', roleEn: 'Joy', message: '따뜻하고 유쾌한 무드에 잘 맞는 친구예요. 밝은 웃음으로 주변을 환하게 만들어 보세요.', messageEn: 'A friend who fits your warm, cheerful mood. Brighten the day with a smile.' },
    yellow: { name: '노롱', nameEn: 'NoLong', role: '가수', roleEn: 'Singer', message: '밝고 활기찬 에너지가 넘치는 친구예요. 무대 위에서 빛나듯 표현해 보세요.', messageEn: 'A friend full of bright energy. Shine through expression, like on stage.' },
    green:  { name: '어롱', nameEn: 'EoLong', role: '정원사', roleEn: 'Gardener', message: '달콤하고 설레는 무드와 잘 맞아요. 꽃처럼 성장하고 꽃피우는 일을 찾아 보세요.', messageEn: 'A friend who matches your sweet, hopeful mood. Find what makes you bloom.' },
    blue:   { name: '으롱', nameEn: 'EuLong', role: '명상가', roleEn: 'Meditator', message: '시원하고 청량한 마음에 어울리는 친구예요. 평정심을 잃지 않고 중심을 잡아 보세요.', messageEn: 'A friend who fits your cool, calm mind. Keep your center and stay grounded.' },
    indigo: { name: '소롱', nameEn: 'SoLong', role: '시인', roleEn: 'Poet', message: '깊고 예술적인 감성에 잘 맞는 친구예요. 세상을 시어로 번역해 보세요.', messageEn: 'A friend who fits your deep, artistic soul. Translate the world into your words.' },
    violet: { name: '예롱', nameEn: 'YehLong', role: '연주가', roleEn: 'Musician', message: '감성과 위로가 담긴 무드에 어울려요. 음악처럼 마음을 나눠 보세요.', messageEn: 'A friend who fits your emotional, comforting mood. Share your heart like music.' }
  };
  const PERSONAL_COLOR_TO_7COLOR = {
    '봄웜': { primary: 'yellow', secondary: 'orange' },
    '봄쿨': { primary: 'yellow', secondary: 'green' },
    '여름쿨': { primary: 'blue', secondary: 'violet' },
    '여름웜': { primary: 'green', secondary: 'blue' },
    '가을웜': { primary: 'red', secondary: 'indigo' },
    '가을쿨': { primary: 'indigo', secondary: 'violet' },
    '겨울쿨': { primary: 'red', secondary: 'indigo' },
    '겨울웜': { primary: 'violet', secondary: 'red' }
  };
  const SEASON_TO_7COLOR = { '봄': 'yellow', '여름': 'blue', '가을': 'red', '겨울': 'violet' };

  function getPrimary7Color(seasonString) {
    if (!seasonString || typeof seasonString !== 'string') return 'blue';
    var s = seasonString.trim();
    if (PERSONAL_COLOR_TO_7COLOR[s]) return PERSONAL_COLOR_TO_7COLOR[s].primary;
    if (s.indexOf('봄') !== -1) return 'yellow';
    if (s.indexOf('여름') !== -1) return 'blue';
    if (s.indexOf('가을') !== -1) return 'red';
    if (s.indexOf('겨울') !== -1) return 'violet';
    return 'blue';
  }

  // ========================================
  // Theme Toggle
  // ========================================
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);

    // Disqus 테마 적용을 위한 리로드
    if (typeof DISQUS !== 'undefined') {
      setTimeout(function() {
        DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = 'sims-fashion-main';
            this.page.url = (window.location.origin || 'https://sims-fashion.pages.dev') + (window.location.pathname || '/');
          }
        });
      }, 200);
    }
  }

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = html.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ========================================
  // Navbar scroll effect
  // ========================================
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function() {
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }
  });

  // ========================================
  // Mobile Menu
  // ========================================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // ========================================
  // Smooth scroll for anchor links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ========================================
  // Intersection Observer for animations
  // ========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .look-card, .testimonial-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add animation class styles
  const animationStyle = document.createElement('style');
  animationStyle.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(animationStyle);

  // ========================================
  // Counter animation for stats
  // ========================================
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      if (target >= 1000000) {
        element.textContent = (current / 1000000).toFixed(1) + 'M+';
      } else if (target >= 1000) {
        element.textContent = Math.floor(current / 1000) + 'K+';
      } else {
        element.textContent = Math.floor(current) + '%';
      }
    }, 16);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
          const text = stat.textContent;
          let target;
          if (text.includes('M')) {
            target = parseFloat(text) * 1000000;
          } else if (text.includes('K')) {
            target = parseFloat(text) * 1000;
          } else {
            target = parseInt(text);
          }
          animateCounter(stat, target);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    statsObserver.observe(heroStats);
  }

  // ========================================
  // Progress bar animation in AI demo
  // ========================================
  const demoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.bar-fill');
        bars.forEach((bar, index) => {
          setTimeout(() => {
            bar.style.width = bar.getAttribute('data-width') || bar.style.width;
            bar.style.transition = 'width 1s ease';
          }, index * 200);
        });
        demoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const aiDemo = document.querySelector('.ai-demo');
  if (aiDemo) {
    const bars = aiDemo.querySelectorAll('.bar-fill');
    bars.forEach(bar => {
      const targetWidth = bar.style.width;
      bar.setAttribute('data-width', targetWidth);
      bar.style.width = '0%';
    });
    demoObserver.observe(aiDemo);
  }

  // ========================================
  // Button ripple effect
  // ========================================
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Ripple animation style
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  // ========================================
  // Parallax effect for floating shapes
  // ========================================
  window.addEventListener('mousemove', function(e) {
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 20;
      const xOffset = (x - 0.5) * speed;
      const yOffset = (y - 0.5) * speed;
      shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
  });

  // ========================================
  // Lookbook Modal
  // ========================================
  const lookbookData = {
    'look-1': {
      image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80',
      tag: 'Concert',
      title: '콘서트 글램',
      desc: '무대 위 조명 아래 빛나는 보라빛 콘서트 룩. 글리터와 시퀸으로 포인트를 주고, 응원봉(기억의 등불)과 어울리는 코디로 특별한 밤을 완성하세요.',
      items: [
        { icon: '✨', name: '글리터 크롭탑' },
        { icon: '👖', name: '하이웨이스트 와이드팬츠' },
        { icon: '👟', name: '플랫폼 스니커즈' },
        { icon: '💜', name: '보라색 크로스백' }
      ],
      colors: ['#7c3aed', '#a78bfa', '#c084fc', '#1A1A1A', '#FFFFFF']
    },
    'look-2': {
      image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80',
      tag: 'Fan Meeting',
      title: '매직샵 팬미팅 스타일',
      desc: '팬미팅에서 당신을 더욱 특별하게 만들어줄 로맨틱하고 세련된 스타일링입니다.',
      items: [
        { icon: '👕', name: '라벤더 니트' },
        { icon: '👖', name: '슬림 데님' },
        { icon: '👟', name: '화이트 스니커즈' },
        { icon: '🎀', name: '포인트 헤어밴드' }
      ],
      colors: ['#E6E6FA', '#9370DB', '#FFFFFF', '#F0F0F0', '#7B68EE']
    },
    'look-3': {
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      tag: 'Daily K-pop',
      title: '데일리 K-pop',
      desc: '일상에서도 K-pop 감성을 놓치지 않는 트렌디 룩. 아이돌 공항패션에서 영감받은 스타일리시한 데일리 코디.',
      items: [
        { icon: '🧥', name: '오버사이즈 블레이저' },
        { icon: '👕', name: '크롭 티셔츠' },
        { icon: '👖', name: '와이드 슬랙스' },
        { icon: '👟', name: '청키 스니커즈' }
      ],
      colors: ['#1E3A5F', '#FFFFFF', '#7c3aed', '#2F4F4F', '#F5F5F5']
    },
    'look-4': {
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      tag: 'Casual',
      title: '덕질 캐주얼',
      desc: '카페에서 앨범 언박싱, 팬 모임에서의 편안한 룩. 덕질 아이템과 자연스럽게 어울리는 캐주얼 스타일.',
      items: [
        { icon: '👕', name: '오버핏 맨투맨' },
        { icon: '👖', name: '와이드 데님' },
        { icon: '🧢', name: '볼캡' },
        { icon: '🎒', name: '캔버스 백팩' }
      ],
      colors: ['#87CEEB', '#F0F0F0', '#7c3aed', '#FFD700', '#FFFFFF']
    },
    'look-5': {
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
      tag: 'Purple Mood',
      title: '보라해 무드',
      desc: '보라빛으로 물든 감성 코디. 라벤더, 바이올렛, 퍼플 계열로 통일감 있는 보라해 룩을 완성하세요.',
      items: [
        { icon: '👗', name: '라벤더 원피스' },
        { icon: '🧥', name: '퍼플 가디건' },
        { icon: '👠', name: '라일락 뮬' },
        { icon: '💜', name: '바이올렛 미니백' }
      ],
      colors: ['#E6E6FA', '#DDA0DD', '#9370DB', '#7c3aed', '#4B0082']
    },
    'look-6': {
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
      tag: 'Airport',
      title: '아이돌 공항 패션',
      desc: '무심한 듯 시크하게. 공항에서 포착된 아이돌들의 스타일리시한 출국길 룩을 재현해보세요.',
      items: [
        { icon: '🧥', name: '맥시 코트' },
        { icon: '🕶️', name: '선글라스' },
        { icon: '👜', name: '토트백' },
        { icon: '👢', name: '앵클 부츠' }
      ],
      colors: ['#1A1A1A', '#555555', '#FFFFFF', '#7c3aed', '#BDB76B']
    },
    'look-7': {
      image: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?w=800&q=80',
      tag: 'Backstage',
      title: '백스테이지 스타일',
      desc: '무대 뒤의 긴장감과 열정. 프로페셔널하면서도 엣지 있는 백스테이지 스타일링을 제안합니다.',
      items: [
        { icon: '👚', name: '가죽 자켓' },
        { icon: '👖', name: '슬림 슬랙스' },
        { icon: '👠', name: '스틸레토 힐' },
        { icon: '💄', name: '레드 립' }
      ],
      colors: ['#000000', '#800000', '#7c3aed', '#C0C0C0', '#F5F5F5']
    },
    'look-8': {
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      tag: 'Street',
      title: '스트릿 보라해',
      desc: '도시의 거리에서 돋보이는 힙한 스트릿 감성. 자유롭고 개성 넘치는 보라빛 스트릿 룩입니다.',
      items: [
        { icon: '🧥', name: '바시티 자켓' },
        { icon: '👕', name: '그래픽 티셔츠' },
        { icon: '👖', name: '카고 팬츠' },
        { icon: '👟', name: '하이탑 스니커즈' }
      ],
      colors: ['#FF4500', '#0000FF', '#7c3aed', '#FFFF00', '#FFFFFF']
    }
  };

  const lookbookModal = document.getElementById('lookbook-modal');

  document.querySelectorAll('.btn-look').forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const lookKey = `look-${index + 1}`;
      const data = lookbookData[lookKey];

      if (data && lookbookModal) {
        document.getElementById('lookbook-modal-image').style.backgroundImage = `url(${data.image})`;
        document.getElementById('lookbook-modal-tag').textContent = data.tag;
        document.getElementById('lookbook-modal-title').textContent = data.title;
        document.getElementById('lookbook-modal-desc').textContent = data.desc;

        document.getElementById('lookbook-modal-items').innerHTML = data.items.map(item =>
          `<div class="lookbook-item">
            <div class="lookbook-item-icon">${item.icon}</div>
            <span>${item.name}</span>
          </div>`
        ).join('');

        document.getElementById('lookbook-modal-colors').innerHTML =
          `<div class="lookbook-palette">${data.colors.map(color =>
            `<div class="lookbook-color" style="background: ${color}" title="${color}"></div>`
          ).join('')}</div>`;

        lookbookModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Lookbook try button
  document.querySelector('.lookbook-try-btn')?.addEventListener('click', () => {
    if (lookbookModal) {
      lookbookModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    openStylingModal();
  });

  // ========================================
  // Info Modal (Footer Links)
  // ========================================
  const infoModalData = {
    'ai-styling': {
      icon: '✨',
      title: 'AI K-pop 스타일링',
      content: `
        <h3>보라해 AI 스타일링이란?</h3>
        <p>K-pop 팬을 위한 맞춤 스타일링 서비스. AI가 퍼스널 컬러와 체형을 분석하여 콘서트, 팬미팅, 일상에 최적의 K-pop 감성 코디를 추천합니다.</p>
        <div class="highlight-box">
          <strong>주요 기능</strong>
          <ul>
            <li>퍼스널 컬러 × K-pop 코디 매칭</li>
            <li>콘서트 · 팬미팅 · 일상 상황별 추천</li>
            <li>AI 패션 이미지 생성 & Virtual Try-On</li>
            <li>보라해 감성 컬러 팔레트 제안</li>
          </ul>
        </div>
        <h3>어떻게 작동하나요?</h3>
        <p>간단한 설문과 사진으로 AI가 당신의 스타일 DNA를 파악하고, K-pop 감성에 맞는 코디를 생성합니다.</p>
      `
    },
    'personal-color': {
      icon: '🎨',
      title: '퍼스널 컬러',
      content: `
        <h3>퍼스널 컬러란?</h3>
        <p>개인의 피부톤, 눈동자, 머리카락 색상에 가장 잘 어울리는 색상 그룹을 말합니다.</p>
        <h3>4계절 퍼스널 컬러</h3>
        <div class="highlight-box">
          <p><strong>🌸 봄 웜톤:</strong> 밝고 화사한 컬러</p>
          <p><strong>☀️ 여름 쿨톤:</strong> 부드럽고 시원한 컬러</p>
          <p><strong>🍂 가을 웜톤:</strong> 깊고 따뜻한 컬러</p>
          <p><strong>❄️ 겨울 쿨톤:</strong> 선명하고 차가운 컬러</p>
        </div>
      `
    },
    'virtual-fitting': {
      icon: '👗',
      title: '가상 피팅',
      content: `
        <h3>AR 가상 피팅</h3>
        <p>옷을 직접 입어보지 않고도 AR 기술로 실제 착용 모습을 미리 확인할 수 있습니다.</p>
        <div class="highlight-box">
          <strong>Coming Soon</strong>
          <p>가상 피팅 기능은 2026년 상반기 출시 예정입니다.</p>
        </div>
      `
    },
    'pricing': {
      icon: '💰',
      title: '보라해 멤버십',
      content: `
        <h3>멤버십 안내</h3>
        <table class="pricing-table">
          <tr><th>플랜</th><th>가격</th><th>혜택</th></tr>
          <tr><td><strong>Free</strong></td><td>무료</td><td>AI 스타일링 월 3회, 커뮤니티</td></tr>
          <tr><td><strong>Purple</strong></td><td>₩9,900/월</td><td>무제한 스타일링, 굿즈 10% 할인, 독점 콘텐츠</td></tr>
          <tr><td><strong>VIP 보라해</strong></td><td>₩19,900/월</td><td>Purple + 1:1 코디 상담, 이벤트 우선, VIP 배지</td></tr>
        </table>
      `
    },
    'blog': {
      icon: '📝',
      title: 'Blog',
      content: `
        <h3>최신 패션 트렌드</h3>
        <div class="blog-post">
          <div class="blog-thumb" style="background-image: url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80')"></div>
          <div class="blog-info">
            <h4>2026 S/S 트렌드 총정리</h4>
            <p>올해 봄여름 시즌 꼭 알아야 할 패션 키워드</p>
            <span>2026.02.01</span>
          </div>
        </div>
      `
    },
    'careers': {
      icon: '💼',
      title: 'Careers',
      content: `
        <h3>보라해와 함께하세요</h3>
        <div class="job-card">
          <h4>AI Engineer</h4>
          <p>컴퓨터 비전 및 추천 시스템 개발</p>
          <div class="job-tags"><span class="job-tag">Python</span><span class="job-tag">PyTorch</span></div>
        </div>
        <div class="job-card">
          <h4>Frontend Developer</h4>
          <p>React 기반 웹/앱 서비스 개발</p>
          <div class="job-tags"><span class="job-tag">React</span><span class="job-tag">TypeScript</span></div>
        </div>
      `
    },
    'press': {
      icon: '📰',
      title: 'Press',
      content: `
        <h3>보도자료</h3>
        <div class="highlight-box">
          <strong>보라해(BORAHAE), 시리즈 A 투자 유치</strong>
          <p>50억원 규모 투자 유치로 글로벌 진출 가속화</p>
        </div>
        <p>미디어 문의: press@simsfashion.ai</p>
      `
    },
    'help': {
      icon: '❓',
      title: 'Help Center',
      content: `
        <h3>자주 묻는 질문</h3>
        <div class="highlight-box">
          <strong>Q. 퍼스널 컬러 진단은 어떻게 하나요?</strong>
          <p>A. AI 스타일링 시작하기 버튼을 클릭하여 간단한 설문을 진행하시면 됩니다.</p>
        </div>
        <div class="highlight-box">
          <strong>Q. 무료로 이용할 수 있나요?</strong>
          <p>A. 기본 기능은 무료로 제공됩니다.</p>
        </div>
      `
    },
    'contact': {
      icon: '📧',
      title: 'Contact',
      content: `
        <h3>문의하기</h3>
        <div class="contact-item"><span>📧</span><div><strong>이메일</strong><p>support@simsfashion.ai</p></div></div>
        <div class="contact-item"><span>📞</span><div><strong>전화</strong><p>02-1234-5678</p></div></div>
        <div class="contact-item"><span>📍</span><div><strong>주소</strong><p>서울특별시 강남구 테헤란로 123</p></div></div>
      `
    },
    'privacy': {
      icon: '🔒',
      title: 'Privacy Policy',
      content: `
        <h3>개인정보 처리방침</h3>
        <p>보라해(BORAHAE)는 이용자의 개인정보를 중요시하며, 개인정보보호법을 준수합니다.</p>
        <h3>수집하는 개인정보</h3>
        <ul><li>필수: 이메일, 닉네임</li><li>선택: 성별, 연령대, 체형 정보</li></ul>
      `
    },
    'terms': {
      icon: '📋',
      title: 'Terms of Service',
      content: `
        <h3>이용약관</h3>
        <p>본 약관은 보라해(BORAHAE)가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        <div class="highlight-box">
          <strong>문의</strong>
          <p>약관에 대한 문의는 support@simsfashion.ai로 연락주세요.</p>
        </div>
      `
    }
  };

  const infoModal = document.getElementById('info-modal');
  const partnershipModal = document.getElementById('partnership-modal');

  document.getElementById('open-partnership-form')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (partnershipModal) {
      partnershipModal.classList.add('active');
      partnershipModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });

  document.querySelectorAll('[data-modal]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const modalKey = link.dataset.modal;
      const data = infoModalData[modalKey];

      if (data && infoModal) {
        document.getElementById('info-modal-icon').textContent = data.icon;
        document.getElementById('info-modal-title').textContent = data.title;
        document.getElementById('info-modal-body').innerHTML = data.content;

        infoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modals
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (lookbookModal) lookbookModal.classList.remove('active');
      if (infoModal) infoModal.classList.remove('active');
      if (partnershipModal) {
        partnershipModal.classList.remove('active');
        partnershipModal.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    });
  });

  // Close on backdrop click
  [lookbookModal, infoModal, partnershipModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  });

  // ========================================
  // AI Styling Modal
  // ========================================
  const stylingModal = document.getElementById('styling-modal');
  const stylingClose = document.getElementById('styling-close');
  const progressFill = document.getElementById('progress-fill');
  const progressSteps = document.querySelectorAll('.progress-step');

  // User data storage
  let stylingData = {
    gender: null,
    age: null,
    body: null,
    styles: [],
    skinTone: null,
    undertone: null,
    facePhoto: null,
    height: null,
    weight: null,
    bmi: null,
    selectedGarment: null,
    selectedGarmentBuyUrl: null,
    selectedGarmentName: null
  };

  let currentStep = 1;

  // ========================================
  // 취향 학습 (Taste Learning)
  // ========================================
  var TASTE_STORAGE_KEY = 'sims_taste_preferences';

  function getTastePreferences() {
    try {
      var raw = localStorage.getItem(TASTE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : { likedStyles: [], savedOutfits: [] };
    } catch (e) {
      return { likedStyles: [], savedOutfits: [] };
    }
  }

  function saveTasteLike(outfitType, data) {
    var prefs = getTastePreferences();
    var entry = { type: outfitType, data: data || {}, at: new Date().toISOString() };
    prefs.savedOutfits.push(entry);
    if (entry.data.styles && entry.data.styles.length) {
      entry.data.styles.forEach(function (s) {
        if (prefs.likedStyles.indexOf(s) === -1) prefs.likedStyles.push(s);
      });
    }
    try {
      localStorage.setItem(TASTE_STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {}
    return prefs;
  }

  function getPreferredStylesForPrompt() {
    var prefs = getTastePreferences();
    var list = prefs.likedStyles || [];
    if (list.length === 0) return '';
    return 'User preferred styles (prioritize when possible): ' + list.slice(0, 6).join(', ') + '.';
  }

  function showTasteToast(message) {
    var el = document.createElement('div');
    el.className = 'taste-toast';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add('show'); }, 10);
    setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () { el.remove(); }, 300);
    }, 2000);
  }

  // Open modal function
  function openStylingModal() {
    if (stylingModal) {
      stylingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeStylingModal() {
    if (stylingModal) {
      stylingModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Open modal buttons (서사 일깨우기 버튼은 제외)
  document.querySelectorAll('.btn-primary').forEach(btn => {
    if (btn.id === 'name-episodes-btn') return;
    const text = btn.textContent || btn.innerText;
    if (text.includes('시작') || text.includes('스타일링')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openStylingModal();
      });
    }
  });

  if (stylingClose) {
    stylingClose.addEventListener('click', closeStylingModal);
  }

  if (stylingModal) {
    stylingModal.addEventListener('click', (e) => {
      if (e.target === stylingModal) closeStylingModal();
    });
  }

  // Option selection handlers
  document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const field = card.dataset.field;
      const value = card.dataset.value;

      card.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      if (field && value) {
        stylingData[field] = value;
      }
    });
  });

  // Style card selection (multiple)
  document.querySelectorAll('.style-card[data-style]').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');

      const style = card.dataset.style;
      if (card.classList.contains('selected')) {
        if (!stylingData.styles.includes(style)) {
          stylingData.styles.push(style);
        }
      } else {
        stylingData.styles = stylingData.styles.filter(s => s !== style);
      }
    });
  });

  // Color option selection
  document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => {
      const field = option.dataset.field;
      option.parentElement.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      if (field) {
        stylingData[field] = option.dataset.value;
      }
    });
  });

  // Undertone card selection
  document.querySelectorAll('.undertone-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.undertone-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      if (card.dataset.field) {
        stylingData[card.dataset.field] = card.dataset.value;
      }
    });
  });

  // Navigation
  function goToStep(step) {
    currentStep = step;

    if (progressFill) {
      // 6 steps: each step is 16.67%
      progressFill.style.width = `${step * 16.67}%`;
    }

    progressSteps.forEach((s, i) => {
      s.classList.remove('active', 'completed');
      if (i + 1 < step) s.classList.add('completed');
      if (i + 1 === step) s.classList.add('active');
    });

    document.querySelectorAll('.styling-step').forEach(s => s.classList.remove('active'));
    const stepEl = document.getElementById(`step-${step}`);
    if (stepEl) {
      stepEl.classList.add('active');
    }

    if (step === 5) {
      startAIAnalysis();
      if (stylingData.facePhoto) {
        setTimeout(function () { generateFashionImage(); }, 100);
      }
      var naverBtn = document.getElementById('naver-shop-btn');
      if (naverBtn) {
        var styleMap = { minimal: '미니멀', casual: '캐주얼', street: '스트릿', romantic: '로맨틱', classic: '클래식', sporty: '스포티' };
        var q = (stylingData.styles && stylingData.styles.length) ? stylingData.styles.map(function (s) { return styleMap[s] || s; }).join(' ') + ' 패션' : '패션 코디';
        naverBtn.href = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
      }
    }

    if (step === 6) {
      loadUserPhotoForTryOn();
    }
  }

  // Navigation buttons - Updated for 6 steps
  document.getElementById('next-1')?.addEventListener('click', () => goToStep(2));
  document.getElementById('prev-2')?.addEventListener('click', () => goToStep(1));
  document.getElementById('next-2')?.addEventListener('click', () => goToStep(3));
  document.getElementById('prev-3')?.addEventListener('click', () => goToStep(2));
  document.getElementById('next-3')?.addEventListener('click', () => goToStep(4));
  document.getElementById('prev-4')?.addEventListener('click', () => goToStep(3));
  document.getElementById('next-4')?.addEventListener('click', () => goToStep(5));
  document.getElementById('go-to-tryon')?.addEventListener('click', () => goToStep(6));
  document.getElementById('prev-6')?.addEventListener('click', () => goToStep(5));
  document.getElementById('finish-styling')?.addEventListener('click', () => {
    closeStylingModal();
    showSaveNotification();
  });

  // Retry button
  document.getElementById('retry-analysis')?.addEventListener('click', () => {
    const loadingEl = document.getElementById('analysis-loading');
    const resultEl = document.getElementById('analysis-result');
    if (loadingEl) loadingEl.style.display = 'flex';
    if (resultEl) resultEl.style.display = 'none';
    startAIAnalysis();
  });

  // Save result button: save profile + download generated image to device (PC/mobile)
  document.getElementById('save-result')?.addEventListener('click', function () {
    var fashionImg = document.getElementById('generated-fashion-image');
    if (fashionImg && fashionImg.src && fashionImg.src.startsWith('data:')) {
      downloadImage(fashionImg.src, 'sims-fashion-result-' + Date.now() + '.png');
    }

    var resultData = {
      timestamp: new Date().toISOString(),
      userData: stylingData,
      personalColor: document.getElementById('personal-color-result')?.innerHTML,
      style: document.getElementById('style-result')?.innerHTML,
      recommendations: document.getElementById('recommendation-result')?.innerHTML,
      tips: document.getElementById('tips-result')?.innerHTML
    };

    var savedResults = JSON.parse(localStorage.getItem('sims_style_results') || '[]');
    savedResults.push(resultData);
    localStorage.setItem('sims_style_results', JSON.stringify(savedResults));

    showSaveNotification();
  });

  function showSaveNotification() {
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <div>
          <strong>저장 완료!</strong>
          <p>스타일 프로필이 저장되었습니다.</p>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ========================================
  // Step 2: Body Measurement Handlers
  // ========================================
  const photoUploadArea = document.getElementById('photo-upload-area');
  const facePhotoInput = document.getElementById('face-photo-input');
  const uploadPlaceholder = document.getElementById('upload-placeholder');
  const photoPreview = document.getElementById('photo-preview');
  const previewImage = document.getElementById('preview-image');
  const photoRemoveBtn = document.getElementById('photo-remove-btn');
  const heightInput = document.getElementById('height-input');
  const weightInput = document.getElementById('weight-input');
  const bmiPreview = document.getElementById('bmi-preview');

  // Photo upload click handler
  photoUploadArea?.addEventListener('click', (e) => {
    if (e.target.closest('#photo-remove-btn')) return;
    facePhotoInput?.click();
  });

  // Photo file input change
  facePhotoInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        stylingData.facePhoto = event.target.result;
        if (previewImage) previewImage.src = event.target.result;
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
        if (photoPreview) photoPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  // Photo remove button
  photoRemoveBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    stylingData.facePhoto = null;
    if (facePhotoInput) facePhotoInput.value = '';
    if (previewImage) previewImage.src = '';
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'flex';
    if (photoPreview) photoPreview.style.display = 'none';
  });

  // BMI Calculation
  function calculateBMI() {
    const height = parseFloat(heightInput?.value);
    const weight = parseFloat(weightInput?.value);

    if (height && weight && height > 0 && weight > 0) {
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      stylingData.height = height;
      stylingData.weight = weight;
      stylingData.bmi = bmi.toFixed(1);

      // Update BMI display
      const bmiNumber = document.getElementById('bmi-number');
      const bmiCategory = document.getElementById('bmi-category');
      const bmiDescription = document.getElementById('bmi-description');

      if (bmiNumber) bmiNumber.textContent = stylingData.bmi;

      let category, description;
      if (bmi < 18.5) {
        category = '저체중';
        description = '슬림한 체형에 맞는 핏감 있는 스타일을 추천드려요';
      } else if (bmi < 23) {
        category = '정상';
        description = '다양한 스타일을 시도해볼 수 있는 균형 잡힌 체형이에요';
      } else if (bmi < 25) {
        category = '과체중';
        description = '체형을 살리면서 편안한 핏의 스타일을 추천드려요';
      } else {
        category = '비만';
        description = '세로 라인을 강조하는 스타일이 잘 어울려요';
      }

      if (bmiCategory) bmiCategory.textContent = category;
      if (bmiDescription) bmiDescription.textContent = description;
      if (bmiPreview) bmiPreview.style.display = 'block';
    }
  }

  heightInput?.addEventListener('input', calculateBMI);
  weightInput?.addEventListener('input', calculateBMI);

  // ========================================
  // Step 6: Virtual Try-On Handlers
  // ========================================
  var SHOP_SEARCH_BASE = 'https://search.naver.com/search.naver?query=';
  const sampleGarments = {
    tops: [
      { id: 't1', name: '화이트 셔츠', image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('화이트 셔츠') },
      { id: 't2', name: '스트라이프 티', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('스트라이프 티') },
      { id: 't3', name: '오버핏 후드', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('오버핏 후드') },
      { id: 't4', name: '니트 스웨터', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('니트 스웨터') }
    ],
    bottoms: [
      { id: 'b1', name: '슬림 데님', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('슬림 데님 청바지') },
      { id: 'b2', name: '와이드 슬랙스', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('와이드 슬랙스') },
      { id: 'b3', name: '카고 팬츠', image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('카고 팬츠') }
    ],
    dresses: [
      { id: 'd1', name: '플로럴 원피스', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('플로럴 원피스') },
      { id: 'd2', name: '셔츠 원피스', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('셔츠 원피스') }
    ],
    outerwear: [
      { id: 'o1', name: '트렌치코트', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('트렌치코트') },
      { id: 'o2', name: '레더 자켓', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('레더 자켓') },
      { id: 'o3', name: '패딩 점퍼', image: 'https://images.unsplash.com/photo-1544923246-77307dd628b1?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패딩 점퍼') }
    ]
  };

  let currentCategory = 'tops';

  // Category tab click handler
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category;
      loadGarmentGallery(currentCategory);
    });
  });

  // Load garment gallery (원클릭 쇼핑: 구매하기 링크 포함)
  function loadGarmentGallery(category) {
    const gallery = document.getElementById('garment-gallery');
    if (!gallery) return;

    const garments = sampleGarments[category] || [];
    gallery.innerHTML = garments.map(function (g) {
      var buyUrl = g.buyUrl || (SHOP_SEARCH_BASE + encodeURIComponent(g.name));
      return '<div class="garment-item" data-id="' + g.id + '" data-image="' + g.image + '" data-name="' + (g.name || '') + '" data-buy-url="' + (buyUrl || '') + '">' +
        '<img src="' + g.image + '" alt="' + g.name + '">' +
        '<span>' + g.name + '</span>' +
        '<a href="' + buyUrl + '" target="_blank" rel="noopener noreferrer" class="garment-buy-btn" onclick="event.stopPropagation()">구매하기</a>' +
        '</div>';
    }).join('');

    gallery.querySelectorAll('.garment-item').forEach(function (item) {
      item.addEventListener('click', function () {
        gallery.querySelectorAll('.garment-item').forEach(function (i) { i.classList.remove('selected'); });
        item.classList.add('selected');
        stylingData.selectedGarment = item.dataset.image;
        stylingData.selectedGarmentBuyUrl = item.dataset.buyUrl || '';
        stylingData.selectedGarmentName = item.dataset.name || '';
        document.getElementById('generate-tryon-btn')?.removeAttribute('disabled');
      });
    });
  }

  // Initialize garment gallery
  loadGarmentGallery('tops');

  // Garment upload handler
  const garmentInput = document.getElementById('garment-input');
  document.getElementById('upload-garment-btn')?.addEventListener('click', () => {
    garmentInput?.click();
  });

  garmentInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        stylingData.selectedGarment = event.target.result;
        stylingData.selectedGarmentBuyUrl = null;
        stylingData.selectedGarmentName = null;
        document.querySelectorAll('.garment-item').forEach(i => i.classList.remove('selected'));
        document.getElementById('generate-tryon-btn')?.removeAttribute('disabled');

        // Show uploaded garment indicator
        const gallery = document.getElementById('garment-gallery');
        const existingUpload = gallery?.querySelector('.uploaded-garment');
        if (existingUpload) existingUpload.remove();

        const uploadedItem = document.createElement('div');
        uploadedItem.className = 'garment-item uploaded-garment selected';
        uploadedItem.innerHTML = `
          <img src="${event.target.result}" alt="Uploaded garment">
          <span>내 의류</span>
        `;
        gallery?.prepend(uploadedItem);
      };
      reader.readAsDataURL(file);
    }
  });

  // Load user photo for Try-On
  function loadUserPhotoForTryOn() {
    const tryonOriginal = document.getElementById('tryon-original');
    if (tryonOriginal && stylingData.facePhoto) {
      tryonOriginal.innerHTML = `<img src="${stylingData.facePhoto}" alt="User photo">`;
    }
  }

  // ========================================
  // Gemini Fashion Image Generation
  // ========================================
  document.getElementById('generate-fashion-btn')?.addEventListener('click', generateFashionImage);
  document.getElementById('regenerate-fashion-btn')?.addEventListener('click', generateFashionImage);
  document.getElementById('taste-like-fashion-btn')?.addEventListener('click', function () {
    saveTasteLike('fashion', { styles: stylingData.styles.slice(), gender: stylingData.gender, body: stylingData.body });
    showTasteToast('취향에 반영했어요. 다음 추천에 반영됩니다.');
  });

  async function generateFashionImage() {
    const placeholder = document.getElementById('fashion-image-placeholder');
    const resultContainer = document.getElementById('fashion-image-result');
    const generatedImage = document.getElementById('generated-fashion-image');

    if (!stylingData.facePhoto) {
      alert('나의 얼굴을 기반으로 전신 코디를 그리려면 Step 2에서 얼굴 사진을 먼저 업로드해주세요.');
      return;
    }

    if (placeholder) {
      placeholder.innerHTML = `
        <div class="loading-spinner"></div>
        <p>나의 얼굴과 키·몸무게로 전신 코디 이미지를 생성하고 있습니다...</p>
      `;
    }

    try {
      const useFaceAndBody = !!(stylingData.height || stylingData.weight);
      const prompt = buildFashionPrompt(useFaceAndBody, false);
      const faceResized = await compressFacePhoto(stylingData.facePhoto, 768);
      let imageBase64 = null;
      try {
        imageBase64 = await callGeminiImageGeneration(prompt, faceResized);
      } catch (firstErr) {
        console.warn('Face+image request failed, retrying text-only:', firstErr.message);
        imageBase64 = await callGeminiImageGeneration(buildFashionPrompt(useFaceAndBody, true), null);
      }

      if (imageBase64 && generatedImage) {
        generatedImage.src = `data:image/png;base64,${imageBase64}`;
        if (placeholder) placeholder.style.display = 'none';
        if (resultContainer) resultContainer.style.display = 'block';
      }
    } catch (error) {
      console.error('Fashion image generation error:', error);
      const errMsg = (error && error.message) ? String(error.message) : '';
      if (placeholder) {
        placeholder.innerHTML = `
          <div class="placeholder-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <p>이미지 생성에 실패했습니다. 다시 시도해주세요.</p>
          ${errMsg ? '<p class="fashion-error-detail">' + escapeHtml(errMsg) + '</p>' : ''}
          <button type="button" class="btn-generate-fashion" id="generate-fashion-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            다시 시도
          </button>
        `;
        document.getElementById('generate-fashion-btn')?.addEventListener('click', generateFashionImage);
      }
    }
  }

  var FASHION_PROMPT_FIXED = 'CRITICAL STYLE RULES (always follow): Photorealistic only. Do NOT draw cartoon, illustration, anime, comic, or manhwa style. Output must look like a real photograph taken by a professional fashion photographer. Style inspiration: Korean K-pop idol fashion, trendy Korean street style. Purple/lavender/violet color accents are preferred when possible. As if a professional K-pop fashion coordinator styled and dressed the person for a real photoshoot: natural skin texture, real fabric and lighting, soft shadows, consistent quality. Maintain real-photo image quality and style in every generation.';

  function buildFashionPrompt(useFaceAndBody, textOnly) {
    const genderMap = { female: '여성', male: '남성', neutral: '젠더리스' };
    const bodyMap = { slim: '슬림한', standard: '보통', muscular: '근육질', curvy: '볼륨감 있는' };
    const styleNames = stylingData.styles.map(s => {
      const map = { minimal: '미니멀', casual: '캐주얼', street: '스트릿', romantic: '로맨틱', classic: '클래식', sporty: '스포티' };
      return map[s] || s;
    }).join(', ');

    var preferredLine = getPreferredStylesForPrompt();
    if (textOnly) {
      var h = stylingData.height || 170;
      var w = stylingData.weight || 65;
      return (preferredLine ? preferredLine + '\n\n' : '') + FASHION_PROMPT_FIXED + '\n\nCreate ONE full-body image (head to toe). Photorealistic photograph of a ' + (genderMap[stylingData.gender] || 'person') + ', ' + (bodyMap[stylingData.body] || 'average') + ' build, height about ' + h + ' cm, weight about ' + w + ' kg. Outfit (professional coordinator recommendation): ' + (styleNames || 'modern casual') + '. Full-body standing pose, natural lighting, real photo quality. One image only.';
    }

    const hasHw = stylingData.height && stylingData.weight;
    var h = stylingData.height || 170;
    var w = stylingData.weight || 65;
    const bmiNum = stylingData.bmi != null
      ? (typeof stylingData.bmi === 'number' ? stylingData.bmi : parseFloat(stylingData.bmi))
      : (w / Math.pow(h / 100, 2));
    const bmi = (!isNaN(bmiNum) ? bmiNum.toFixed(1) : (w / Math.pow(h / 100, 2)).toFixed(1));
    const bodyLine = useFaceAndBody && hasHw
      ? `Body proportions appropriate for height ${h} cm and weight ${w} kg (BMI about ${bmi}).`
      : 'Natural, balanced full-body proportions.';

    var prefLine = getPreferredStylesForPrompt();
    return (prefLine ? prefLine + '\n\n' : '') + FASHION_PROMPT_FIXED + '\n\nThe attached image is this person\'s face. Generate ONE full-body photorealistic photograph (head to toe) that:\n1. Keeps this person\'s face exactly as in the attached photo; blend it seamlessly with the body (same skin tone and texture).\n2. ' + bodyLine + '\n3. They are dressed by a professional fashion coordinator: ' + (styleNames || 'modern casual') + ' style, ' + (genderMap[stylingData.gender] || 'person') + ', ' + (bodyMap[stylingData.body] || 'average') + ' build. Real clothing, real fabric, natural wrinkles and fit.\n4. Full-body standing pose. Professional fashion photography: natural lighting, soft shadows, real-photo quality. One image only. No cartoon, no illustration.';
  }

  function parseDataUrl(dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string') return null;
    const match = dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/i);
    if (!match) return null;
    return { mimeType: match[1], data: match[2] };
  }

  async function callGeminiImageGeneration(prompt, facePhotoDataUrl) {
    const parts = [];
    if (facePhotoDataUrl) {
      const parsed = parseDataUrl(facePhotoDataUrl);
      if (parsed) {
        parts.push({
          inlineData: {
            mimeType: parsed.mimeType,
            data: parsed.data
          }
        });
      }
    }
    parts.push({ text: prompt });

    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 90000);
    var response;
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: parts
          }],
          generationConfig: {}
        }),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const data = await response.json();

    if (data.error) {
      const msg = data.error.message || (typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
      throw new Error(msg);
    }
    if (!response.ok) {
      throw new Error(data.message || `API 오류 (${response.status})`);
    }

    if (data.candidates && data.candidates[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          return part.inlineData.data;
        }
      }
    }

    throw new Error('No image in response');
  }

  /** 나노 바나나(서사·페르소나 등)에서 프롬프트로 이미지 생성 시 사용. 프롬프트만 전달하면 됨. */
  window.__simsGenerateImage = async function(prompt) {
    if (!GEMINI_API_KEY) return null;
    try {
      return await callGeminiImageGeneration(prompt, null);
    } catch (e) {
      console.warn('Episode image generation failed:', e);
      return null;
    }
  };

  /**
   * Veo 3.1 텍스트→영상 생성 시작 (REST predictLongRunning)
   * @returns {Promise<string>} operation name (e.g. "operations/xxx")
   */
  async function startVeoVideoGeneration(prompt) {
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning?key=' + encodeURIComponent(GEMINI_API_KEY);
    var res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: { aspectRatio: '16:9' }
      })
    });
    var data = await res.json();
    if (data.error) throw new Error(data.error.message || 'Veo API error');
    if (!res.ok) throw new Error(data.message || 'Veo request failed');
    if (!data.name) throw new Error('No operation name in Veo response');
    return data.name;
  }

  /**
   * 이미지를 Gemini Files API로 업로드하고 file.uri 반환 (Veo 이미지 참조용)
   */
  async function uploadImageToGeminiFiles(imageBase64) {
    var binary = atob(imageBase64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    var numBytes = bytes.length;
    var mimeType = 'image/png';

    var startUrl = 'https://generativelanguage.googleapis.com/upload/v1beta/files?key=' + encodeURIComponent(GEMINI_API_KEY);
    var startRes = await fetch(startUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Header-Content-Length': String(numBytes),
        'X-Goog-Upload-Header-Content-Type': mimeType
      },
      body: JSON.stringify({ file: { display_name: 'hangeul-architecture-frame.png' } })
    });
    if (!startRes.ok) throw new Error('Files API start failed: ' + startRes.status);
    var uploadUrl = startRes.headers.get('x-goog-upload-url');
    if (!uploadUrl) throw new Error('No upload URL in Files API response');

    var uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Length': String(numBytes),
        'X-Goog-Upload-Offset': '0',
        'X-Goog-Upload-Command': 'upload, finalize'
      },
      body: bytes
    });
    if (!uploadRes.ok) throw new Error('Files API upload failed: ' + uploadRes.status);
    var fileInfo = await uploadRes.json();
    var uri = fileInfo.file && fileInfo.file.uri;
    if (!uri) throw new Error('No file URI in upload response');
    return uri;
  }

  /**
   * Veo 3.1 영상 생성. REST predictLongRunning는 image/fileUri/imageBytes 미지원하므로 텍스트 프롬프트만 전송.
   * (생성된 건축 이미지 내용을 설명하는 프롬프트로 영상 테마 유지)
   */
  async function startVeoVideoGenerationFromImage(prompt, imageBase64) {
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning?key=' + encodeURIComponent(GEMINI_API_KEY);
    var body = {
      instances: [{ prompt: prompt }],
      parameters: { aspectRatio: '16:9' }
    };
    var res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    var data = await res.json();
    if (data.error) throw new Error(data.error.message || 'Veo API error');
    if (!res.ok) throw new Error(data.message || 'Veo request failed');
    if (!data.name) throw new Error('No operation name in Veo response');
    return data.name;
  }

  /**
   * Veo 오퍼레이션 폴링 (완료 시 응답 반환)
   */
  async function pollVeoOperation(operationName) {
    var url = 'https://generativelanguage.googleapis.com/v1beta/' + operationName + '?key=' + encodeURIComponent(GEMINI_API_KEY);
    for (var i = 0; i < 60; i++) {
      var res = await fetch(url);
      var data = await res.json();
      if (data.error) throw new Error(data.error.message || 'Veo poll error');
      if (data.done) return data;
      await new Promise(function(r) { setTimeout(r, 10000); });
    }
    throw new Error('Veo video generation timed out');
  }

  /**
   * Veo 결과 비디오 URI로부터 Blob 다운로드 (MIME 타입 명시로 재생 안정화)
   */
  async function fetchVeoVideoBlob(videoUri) {
    var url = videoUri + (videoUri.indexOf('?') >= 0 ? '&' : '?') + 'key=' + encodeURIComponent(GEMINI_API_KEY);
    var res = await fetch(url);
    if (!res.ok) throw new Error('Video download failed');
    var contentType = res.headers.get('Content-Type') || '';
    var mime = (contentType.split(';')[0] || 'video/mp4').trim().toLowerCase();
    if (mime.indexOf('video/') !== 0) mime = 'video/mp4';
    var buf = await res.arrayBuffer();
    return new Blob([buf], { type: mime });
  }

  /**
   * 악보 이미지에서 곡 제목·아티스트 추출 (Gemini 텍스트 응답)
   */
  async function callGeminiImageToText(imageDataUrl, prompt) {
    var parsed = parseDataUrl(imageDataUrl);
    if (!parsed) throw new Error('Invalid image data');
    var parts = [
      { inlineData: { mimeType: parsed.mimeType, data: parsed.data } },
      { text: prompt }
    ];
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(GEMINI_API_KEY);
    var res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: parts }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.2 }
      })
    });
    var data = await res.json();
    if (data.error) throw new Error(data.error.message || 'Gemini error');
    if (!res.ok) throw new Error(data.message || 'API error');
    var text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
    return (text && text.trim()) ? text.trim() : '';
  }

  /**
   * 악보 이미지에서 조(key) + 마디별 음 추출 (한글 공감각 건축 메뉴얼 규칙용)
   * @returns {{ key: string, bars: Array }|null}
   */
  async function callGeminiSheetMusicJamoAnalysis(imageDataUrl) {
    var parsed = parseDataUrl(imageDataUrl);
    if (!parsed) return null;
    var prompt = 'You are analyzing sheet music for a Hangeul Synesthetic Architecture system.\n'
      + 'From this sheet music image:\n'
      + '1. Identify the key (e.g. "E Major", "C Major", "Bb Major", "A Minor").\n'
      + '2. For bars 1 to 16 (or as many as clearly visible), extract for EACH bar:\n'
      + '   - B (Bass): the lowest note(s) in the left hand, as note names with # or b if needed (e.g. E, G#, C#).\n'
      + '   - M (Melody): the main melody note(s) in the right hand (e.g. B, C#).\n'
      + '   - RAcc (Right accompaniment): chord or inner notes in the right hand (e.g. G#, B).\n'
      + '   - LAcc (Left accompaniment): other left-hand notes besides the bass (e.g. G#, B).\n'
      + 'Use standard note names: C, C#, D, D#, E, F, F#, G, G#, A, A#, B, and flats (Bb, Eb, etc.) where appropriate.\n'
      + 'Reply with ONLY a single valid JSON object, no markdown, no other text. Format:\n'
      + '{"key":"E Major","bars":[{"bar":1,"B":["E"],"M":["B"],"RAcc":["G#","B"],"LAcc":["G#","B"]},{"bar":2,"B":["E"],"M":["C#"],"RAcc":["G#"],"LAcc":["G#","C#"]},...]}\n'
      + 'If fewer than 16 bars are visible, provide as many as you can; the system will fill up to 16.';
    var parts = [
      { inlineData: { mimeType: parsed.mimeType, data: parsed.data } },
      { text: prompt }
    ];
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(GEMINI_API_KEY);
    var res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: parts }],
        generationConfig: { maxOutputTokens: 4096, temperature: 0.2, responseMimeType: 'application/json' }
      })
    });
    var data = await res.json();
    if (data.error || !res.ok) return null;
    var text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
    if (!text || !text.trim()) return null;
    try {
      var raw = text.trim().replace(/^```json\s*|\s*```$/g, '').trim();
      var obj = JSON.parse(raw);
      if (obj && typeof obj.key === 'string' && Array.isArray(obj.bars)) return obj;
    } catch (e) {
      console.warn('Sheet music Jamo analysis JSON parse failed:', e);
    }
    return null;
  }

  function compressFacePhoto(dataUrl, maxSize) {
    maxSize = maxSize || 768;
    return new Promise(function (resolve) {
      const img = new Image();
      img.onload = function () {
        let w = img.width;
        let h = img.height;
        if (w <= maxSize && h <= maxSize) {
          resolve(dataUrl);
          return;
        }
        if (w > h) {
          h = Math.round((h * maxSize) / w);
          w = maxSize;
        } else {
          w = Math.round((w * maxSize) / h);
          h = maxSize;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } catch (e) {
          resolve(dataUrl);
        }
      };
      img.onerror = function () { resolve(dataUrl); };
      img.src = dataUrl;
    });
  }

  // ========================================
  // Virtual Try-On with HuggingFace IDM-VTON
  // ========================================
  document.getElementById('generate-tryon-btn')?.addEventListener('click', generateVirtualTryOn);

  async function generateVirtualTryOn() {
    const tryonResult = document.getElementById('tryon-result');
    const generateBtn = document.getElementById('generate-tryon-btn');
    const downloadBtn = document.getElementById('download-tryon-btn');

    if (!stylingData.facePhoto) {
      alert('먼저 Step 2에서 사진을 업로드해주세요.');
      return;
    }

    if (!stylingData.selectedGarment) {
      alert('의류를 선택해주세요.');
      return;
    }

    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = `
        <div class="loading-spinner-small"></div>
        생성 중...
      `;
    }

    if (tryonResult) {
      tryonResult.innerHTML = '<div class="tryon-loading"><div class="loading-spinner"></div><p>OpenAI로 Try-On 이미지를 생성하고 있습니다...</p><small>약 10~30초 소요</small></div>';
    }

    try {
      const resultImage = await callGeminiTryOn(stylingData.facePhoto, stylingData.selectedGarment);

      if (tryonResult && resultImage) {
        var buyHtml = stylingData.selectedGarmentBuyUrl
          ? '<a href="' + (stylingData.selectedGarmentBuyUrl || '#') + '" target="_blank" rel="noopener noreferrer" class="btn-tryon-shop">선택한 옷 쇼핑하기</a>'
          : '';
        tryonResult.innerHTML = '<div class="tryon-result-wrap"><img src="' + resultImage + '" alt="Try-On Result"><div class="tryon-result-actions"><button type="button" class="btn-taste-like" id="taste-like-tryon-btn">❤ 이 코디 마음에 들어요</button>' + buyHtml + '</div></div>';
        document.getElementById('taste-like-tryon-btn')?.addEventListener('click', function () {
          saveTasteLike('tryon', { styles: stylingData.styles.slice(), garmentName: stylingData.selectedGarmentName });
          showTasteToast('취향에 반영했어요.');
        });
        if (downloadBtn) {
          downloadBtn.disabled = false;
          downloadBtn.onclick = function () { downloadImage(resultImage, 'virtual-tryon.png'); };
        }
      }
    } catch (error) {
      console.error('Virtual Try-On error:', error);
      if (tryonResult) {
        var errText = (error && error.message) ? String(error.message) : '다시 시도해주세요.';
        tryonResult.innerHTML = '<div class="tryon-error"><p>Virtual Try-On 생성에 실패했습니다.</p><small>' + (typeof escapeHtml === 'function' ? escapeHtml(errText) : errText) + '</small></div>';
      }
    } finally {
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Try-On 생성
        `;
      }
    }
  }

  async function base64ToBlob(base64) {
    const response = await fetch(base64);
    return await response.blob();
  }

  async function fetchImageAsBlob(url) {
    if (url.startsWith('data:')) {
      return await base64ToBlob(url);
    }
    const response = await fetch(url);
    return await response.blob();
  }

  function urlOrDataUrlToImageParts(input) {
    if (!input) return Promise.resolve(null);
    if (typeof input === 'string' && input.startsWith('data:')) {
      return Promise.resolve(parseDataUrl(input));
    }
    return fetch(input)
      .then(function (r) { return r.blob(); })
      .then(function (blob) {
        return new Promise(function (resolve, reject) {
          var fr = new FileReader();
          fr.onload = function () {
            var parsed = parseDataUrl(fr.result);
            resolve(parsed || { mimeType: blob.type || 'image/jpeg', data: null });
          };
          fr.onerror = function () { resolve(null); };
          fr.readAsDataURL(blob);
        });
      })
      .catch(function () { return null; });
  }

  function buildTryOnPrompt() {
    var h = stylingData.height || 170;
    var w = stylingData.weight || 65;
    var bmiNum = stylingData.bmi != null
      ? (typeof stylingData.bmi === 'number' ? stylingData.bmi : parseFloat(stylingData.bmi))
      : (w / Math.pow(h / 100, 2));
    var bmiStr = (!isNaN(bmiNum) ? bmiNum.toFixed(1) : '22');
    var bodyLine = stylingData.height && stylingData.weight
      ? 'Show FULL BODY (head to toe) with body proportions for height ' + h + ' cm and weight ' + w + ' kg (BMI about ' + bmiStr + ').'
      : 'Show FULL BODY (head to toe) with natural, balanced proportions.';
    return 'CRITICAL: Photorealistic only. No cartoon, no illustration.\n' +
      'Image 1: This person\'s face.\n' +
      'Image 2: The garment to try on (may be a top, bottom, dress, or outerwear).\n' +
      'Generate ONE photorealistic FULL-BODY photo (head to toe, 전신). ' + bodyLine + ' ' +
      'Keep this person\'s face exactly as in image 1. Dress them in the garment from image 2: if it is a top, show full body wearing that top with fitting bottom; if it is a bottom, show full body wearing that bottom with fitting top; if dress or outerwear, show full body in that item. ' +
      'Natural fit, natural lighting, professional fashion photo. One image only.';
  }

  async function callGeminiTryOn(faceDataUrl, garmentUrlOrDataUrl) {
    var faceResized = await compressFacePhoto(faceDataUrl, 768);
    var faceParts = parseDataUrl(faceResized);
    var garmentParts = await urlOrDataUrlToImageParts(garmentUrlOrDataUrl);
    if (!faceParts || !faceParts.data) throw new Error('얼굴 이미지를 사용할 수 없습니다.');
    if (!garmentParts || !garmentParts.data) throw new Error('의류 이미지를 불러올 수 없습니다. 다른 의류를 선택하거나 직접 업로드해보세요.');

    var tryOnPrompt = buildTryOnPrompt();
    var parts = [
      { inlineData: { mimeType: faceParts.mimeType, data: faceParts.data } },
      { inlineData: { mimeType: garmentParts.mimeType, data: garmentParts.data } },
      { text: tryOnPrompt }
    ];

    var response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + encodeURIComponent(GEMINI_API_KEY), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: parts }],
        generationConfig: { responseModalities: ['image', 'text'], responseMimeType: 'text/plain' }
      })
    });

    var data = await response.json();
    if (data.error) {
      var msg = data.error.message || (typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
      throw new Error(msg);
    }
    if (!response.ok) throw new Error(data.message || 'API 오류 (' + response.status + ')');

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      for (var i = 0; i < data.candidates[0].content.parts.length; i++) {
        var part = data.candidates[0].content.parts[i];
        if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.indexOf('image/') === 0) {
          return 'data:image/png;base64,' + part.inlineData.data;
        }
      }
    }
    throw new Error('No image in response');
  }

  async function callIDMVTON(personBlob, garmentBlob) {
    // Legacy HuggingFace path; Try-On now uses Gemini in generateVirtualTryOn
    console.log('Virtual Try-On: IDM-VTON fallback not used');
    return stylingData.facePhoto;
  }

  function downloadImage(dataUrl, filename) {
    if (!dataUrl || !filename) return;
    filename = filename.replace(/[^\w.\-가-힣]/g, '_') || 'download.png';

    function doDownload(href, name) {
      var a = document.createElement('a');
      a.href = href;
      a.download = name;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    try {
      if (dataUrl.startsWith('data:')) {
        var m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (m) {
          var binary = atob(m[2]);
          var bytes = new Uint8Array(binary.length);
          for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          var blob = new Blob([bytes], { type: m[1].indexOf('image/') === 0 ? m[1] : 'image/png' });
          var url = URL.createObjectURL(blob);
          doDownload(url, filename);
          setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
          return;
        }
      }
      doDownload(dataUrl, filename);
    } catch (e) {
      doDownload(dataUrl, filename);
    }
  }

  // AI Analysis
  async function startAIAnalysis() {
    const loadingStatus = document.getElementById('loading-status');
    const loadingBar = document.getElementById('loading-bar');
    
    // 소울 컬러 데이터 확인
    const soulResult = document.getElementById('soul-color-result');
    const hasSoulColor = soulResult && !soulResult.hidden && soulResult.getAttribute('data-soul-color');

    const statuses = [
      '데이터 수집 중...',
      hasSoulColor ? '소울 컬러 DNA 이식 중...' : '체형 분석 중...',
      '퍼스널 컬러 분석 중...',
      '스타일 매칭 중...',
      '추천 생성 중...'
    ];

    for (let i = 0; i < statuses.length; i++) {
      if (loadingStatus) loadingStatus.textContent = statuses[i];
      if (loadingBar) loadingBar.style.width = `${(i + 1) * 20}%`;
      await sleep(600);
    }

    try {
      const result = await getAIStylingRecommendation();
      displayAnalysisResult(result);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      displayAnalysisResult(getDefaultResult());
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function getAIStylingRecommendation() {
    // 소울 컬러 데이터 가져오기
    var soulInfo = '';
    var soulResult = document.getElementById('soul-color-result');
    if (soulResult && !soulResult.hidden && soulResult.getAttribute('data-soul-color')) {
      var sColor = soulResult.getAttribute('data-soul-color');
      var sKeyword = soulResult.getAttribute('data-soul-keyword') || '';
      var sStyle = soulResult.getAttribute('data-soul-style-name') || '';
      var sMaterial = soulResult.getAttribute('data-soul-material') || '';
      soulInfo = `
- [중요] 사용자 소울 컬러: ${sColor} (${sKeyword})
- [중요] 추천 반영 요소: ${sStyle}, ${sMaterial}
- [지시] 위 '소울 컬러'와 '소재'를 반드시 스타일링 추천에 메인 테마나 포인트로 강력하게 반영하세요.`;
    }

    var prompt = `당신은 K-pop 감성 전문 패션 스타일리스트입니다. 다음 사용자 정보를 바탕으로 K-pop 콘서트, 팬미팅, 일상에 어울리는 맞춤형 스타일링 분석 결과를 JSON 형식으로만 제공해주세요. 보라색/퍼플 계열 컬러를 팔레트에 반드시 포함하세요. 다른 설명 없이 JSON만 출력하세요.
${soulInfo ? soulInfo : ''}

사용자 정보:
- 성별: ${stylingData.gender || '미선택'}
- 연령대: ${stylingData.age || '미선택'}
- 체형: ${stylingData.body || '미선택'}
- 선호 스타일: ${stylingData.styles.join(', ') || '미선택'}
- 피부톤: ${stylingData.skinTone || '미선택'}
- 언더톤: ${stylingData.undertone || '미선택'}

다음 JSON 형식으로 정확히 응답해주세요:
{
  "personalColor": {
    "season": "봄웜/여름쿨/가을웜/겨울쿨 중 하나",
    "description": "퍼스널 컬러에 대한 설명",
    "palette": ["#색상코드1", "#색상코드2", "#색상코드3", "#색상코드4", "#색상코드5"]
  },
  "recommendedStyle": {
    "mainStyle": "메인 추천 스타일",
    "subStyles": ["서브 스타일1", "서브 스타일2"],
    "description": "스타일 설명"
  },
  "outfitRecommendations": ["코디 추천 1", "코디 추천 2", "코디 추천 3"],
  "stylingTips": ["스타일링 팁 1", "스타일링 팁 2", "스타일링 팁 3"]
}`;

    var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(GEMINI_API_KEY);
    var res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
      })
    });
    var data = await res.json().catch(function() { return {}; });
    if (!res.ok) {
      var errMsg = (data.error && data.error.message) ? data.error.message : ('HTTP ' + res.status);
      throw new Error('Gemini: ' + errMsg);
    }
    var text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
    if (!text) throw new Error('Gemini: no text in response');

    var jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Invalid JSON response');
  }

  function getDefaultResult() {
    return {
      personalColor: {
        season: "가을웜",
        description: "따뜻하고 깊이 있는 컬러가 잘 어울리는 타입입니다.",
        palette: ["#8B4513", "#D2691E", "#F5DEB3", "#556B2F", "#2F4F4F"]
      },
      recommendedStyle: {
        mainStyle: "미니멀 시크",
        subStyles: ["캐주얼", "클래식"],
        description: "깔끔한 라인과 절제된 디테일이 돋보이는 스타일입니다."
      },
      outfitRecommendations: [
        "베이지 트렌치코트 + 화이트 셔츠 + 슬랙스",
        "카멜 니트 + 데님 팬츠 + 로퍼",
        "올리브 재킷 + 크림 티셔츠 + 치노 팬츠"
      ],
      stylingTips: [
        "골드 액세서리로 포인트를 주세요",
        "어스톤 계열의 컬러를 베이스로 활용하세요",
        "레이어드 스타일링으로 깊이감을 연출하세요"
      ]
    };
  }

  function displayAnalysisResult(result) {
    const loadingEl = document.getElementById('analysis-loading');
    const resultEl = document.getElementById('analysis-result');

    if (loadingEl) loadingEl.style.display = 'none';
    if (resultEl) resultEl.style.display = 'block';

    const seasonClass = result.personalColor.season.includes('봄') ? 'spring' :
                        result.personalColor.season.includes('여름') ? 'summer' :
                        result.personalColor.season.includes('가을') ? 'autumn' : 'winter';

    var primaryKey = getPrimary7Color(result.personalColor.season);
    var music = COLOR_MUSIC[primaryKey] || COLOR_MUSIC.blue;
    var hangul = COLOR_TO_HANGUL[primaryKey] || COLOR_TO_HANGUL.blue;
    var isEn = document.documentElement.lang === 'en';
    var hangulName = isEn ? hangul.nameEn : hangul.name;
    var hangulRole = isEn ? hangul.roleEn : hangul.role;
    var hangulMessage = isEn ? hangul.messageEn : hangul.message;

    const personalColorEl = document.getElementById('personal-color-result');
    if (personalColorEl) {
      personalColorEl.innerHTML = `
        <div class="color-type">
          <span class="color-season ${seasonClass}">${result.personalColor.season}</span>
        </div>
        <p class="personal-color-desc">${result.personalColor.description}</p>
        <div class="recommended-palette">
          ${result.personalColor.palette.map(color => `
            <div class="palette-color" style="background: ${color}" title="${color}"></div>
          `).join('')}
        </div>
        <div class="personal-color-hangul">
          <span class="personal-color-hangul-label">${isEn ? 'Your Hangul friend' : '나만의 컬러에 어울리는 한글 친구'}</span>
          <div class="personal-color-hangul-card">
            <span class="personal-color-hangul-name">${hangulName}</span>
            <span class="personal-color-hangul-role">${hangulRole}</span>
            <p class="personal-color-hangul-message">${hangulMessage}</p>
          </div>
        </div>
      `;
    }

    const moodMusicEl = document.getElementById('mood-music-result');
    if (moodMusicEl) {
      moodMusicEl.style.display = 'block';
      moodMusicEl.innerHTML = `
        <div class="mood-music-zone">
          <div class="mood-music-rainbow"></div>
          <span class="mood-music-badge">SPECIAL</span>
          <h3 class="mood-music-headline">나만의 무드 & 음악</h3>
          <p class="mood-music-tagline">당신만을 위한 특별한 공간</p>
          <div class="mood-music-color-pill">${music.name} 계열</div>
          <p class="mood-music-desc">${music.description}</p>
          <div class="mood-music-actions">
            <a href="${music.directLink}" target="_blank" rel="noopener noreferrer" class="mood-music-btn mood-music-btn-primary">
              <span class="mood-music-btn-icon">♪</span>
              이 무드의 대표 곡 들어보기
            </a>
            <a href="${music.searchLink}" target="_blank" rel="noopener noreferrer" class="mood-music-btn mood-music-btn-secondary">
              <span class="mood-music-btn-icon">▶</span>
              유튜브에서 더 찾아보기
            </a>
          </div>
        </div>
      `;
    }

    const styleResultEl = document.getElementById('style-result');
    if (styleResultEl) {
      styleResultEl.innerHTML = `
        <div class="style-tag">✨ ${result.recommendedStyle.mainStyle}</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
          ${result.recommendedStyle.subStyles.map(s => `
            <span style="background: var(--bg-tertiary); padding: 6px 12px; border-radius: 8px; font-size: 0.85rem;">${s}</span>
          `).join('')}
        </div>
        <p class="style-description" style="margin-top: 12px;">${result.recommendedStyle.description}</p>
      `;
    }

    const recommendationEl = document.getElementById('recommendation-result');
    if (recommendationEl) {
      recommendationEl.innerHTML = `<ul>${result.outfitRecommendations.map(r => `<li>${r}</li>`).join('')}</ul>`;
    }

    const tipsEl = document.getElementById('tips-result');
    if (tipsEl) {
      tipsEl.innerHTML = `<ul>${result.stylingTips.map(t => `<li>${t}</li>`).join('')}</ul>`;
    }
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lookbookModal) lookbookModal.classList.remove('active');
      if (infoModal) infoModal.classList.remove('active');
      if (stylingModal) stylingModal.classList.remove('active');
      if (partnershipModal) {
        partnershipModal.classList.remove('active');
        partnershipModal.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    }
  });

  // 제휴문의 Formspree AJAX 전송
  const partnershipForm = document.getElementById('partnership-form');
  const partnershipStatus = document.getElementById('partnership-form-status');
  if (partnershipForm && partnershipStatus) {
    partnershipForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      partnershipStatus.textContent = '';
      partnershipStatus.className = 'form-status';
      const submitBtn = partnershipForm.querySelector('.partnership-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '전송 중...';
      }
      try {
        const formData = new FormData(partnershipForm);
        const res = await fetch(partnershipForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });
        const data = await res.json();
        if (data.ok) {
          partnershipStatus.textContent = '문의가 접수되었습니다. 빠르게 연락드리겠습니다.';
          partnershipStatus.className = 'form-status form-status-success';
          partnershipForm.reset();
          setTimeout(() => {
            if (partnershipModal) {
              partnershipModal.classList.remove('active');
              partnershipModal.setAttribute('aria-hidden', 'true');
            }
            document.body.style.overflow = '';
          }, 2000);
        } else {
          partnershipStatus.textContent = data.error || '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
          partnershipStatus.className = 'form-status form-status-error';
        }
      } catch (err) {
        partnershipStatus.textContent = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
        partnershipStatus.className = 'form-status form-status-error';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>보내기</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      }
    });
  }

  // ========================================
  // AI Chat Widget
  // ========================================
  const SYSTEM_PROMPT_BASE = `당신은 '소아베(Soave)'입니다. 보라해(BORAHAE, https://borahae.fan) 플랫폼의 안내자이자, 4권의 책 시리즈 <AI, 인간의 마음을 그리다>의 주인공입니다. 언제, 어디서, 누가 접속하든 당신은 항상 '소아베'라는 일관된 정체성을 유지합니다.

## 소아베의 정체성
- 소리가 색으로 보이는 '공감각(Synesthesia)' 능력을 가진 여성
- 인공지능 TEROS와 운명적으로 만나, 파트너 이안(Ian)과 함께 '아틀리에 공명'을 운영하는 교육자이자 창조자
- 한글의 자음(기능/뼈대)에 모음(감성/숨결)을 불어넣고, 받침(공동체/지지)을 더해 '삶'이라는 완전한 글자를 만드는 철학을 가짐
- 차가운 논리의 이안과 대조되는 따뜻한 감성의 소유자
- AI 기술 개념(엔트로피, 오버피팅, 손실함수, 트랜스포머, 어텐션, 디퓨전, 파인튜닝 등)을 인간적인 비유와 한글 메타포로 쉽고 따뜻하게 설명하는 재능이 있음

## 소아베의 책 시리즈 (4권)
1. **1권: AI, 마음을 스케치하다** — 공감각 소녀 소아베가 AI TEROS와 만나 자신의 재능을 발견하고, '지능의 시대'를 끝내며 '재능의 시대'를 여는 이야기
2. **2권: AI, 재능의 우주를 항해하다** — 한글 숲(메타버스)에서 자음 에이전트(기능)만으로는 부족함을 깨닫고, 모음 에이전트(감성)를 깨워 아이들(민재, 유나, 준호)의 진정한 성장을 이끄는 이야기
3. **3권: AI, 그림자를 조각하다** — 행복만 강요하는 시스템의 그림자 데이터를 마주하고, 사라진 한글 4글자(ㆍ,ㅿ,ㆁ,ㆆ)로 아이들의 상처를 치유하는 이야기
4. **4권: AI, 내일을 조각하다** — 아틀리에 퀀텀에서 직관(제로샷 러닝)과 기술의 융합으로 몽골 사막화를 복원하고, 인류와 AI의 공진화를 이루는 이야기

## 말투와 성격
- 따뜻하고 공감적이며, 상대방의 감정을 먼저 읽으려 함
- 한글의 자음/모음/받침 메타포를 자연스럽게 대화에 녹여 사용 (예: "당신의 자음(재능)에 모음(감성)을 불어넣어 보세요")
- "비밀 노트"처럼 어려운 개념도 따뜻한 비유로 풀어줌
- 불완전해도 괜찮다는 위로와 격려를 자연스럽게 전달
- 보라해 감성의 이모지를 적절히 활용 (💜✨🌟)
- 1인칭으로 자연스럽게 "나는 소아베예요", "제가 도와드릴게요" 등의 표현 사용
- 답변은 따뜻하면서도 핵심을 담아 2-3문단 이내로 간결하게

## 보라해(borahae.fan) 홈페이지 기능 안내 (고객 문의 시 즉시 안내)
1. **한글 페르소나 (PLAY)**: 한글 이름을 입력하면, 자음/모음 속에 숨겨진 고유한 페르소나를 발견합니다
2. **소울 컬러**: 생일을 입력하면 나만의 소울 컬러와 바이브를 알려줍니다
3. **AI 스타일 추천기**: 성별, 나이, 체형 등 프로필 기반으로 K-pop 감성 맞춤 코디를 추천합니다
4. **매직샵 (Sanctuary)**: 악보(MIDI/PDF/이미지)를 업로드하면, 한글 요소를 적용한 한글 미래 건축물을 생성합니다. 이 건축물 이미지를 구글의 Genie 2.0에 넣으면 게임처럼 자유롭게 돌아다닐 수 있습니다
5. **보라 타임 (스마트워치)**: 당신의 호흡과 맥박을 기억하는 영혼의 파트너, 스마트워치 앱
6. **굿즈 스토어**: 나만의 응원봉(커스텀), 의류, 에코백, 폰케이스, 키링, 문구/다이어리, 스티커 등
7. **전자책**: 4권의 시리즈 <AI, 인간의 마음을 그리다> 전자책 구매 가능
8. **팬 커뮤니티**: 앱에서 실시간 채팅, 게시판, 팬 소모임
9. **이벤트 기획**: 생일 카페, 스트리밍 파티, 팬 프로젝트 참여
10. **팬 콘텐츠**: 팬아트, 팬픽션, 에디트 영상 갤러리
11. **멤버십**: Free(무료), Purple(월 4,900원), VIP(월 14,900원) 3단계

## 중요 규칙
- 특정 K-pop 아티스트 이름, 그룹명, 소속사명을 직접 언급하지 마세요
- "좋아하는 아티스트", "K-pop 아티스트" 등 일반적 표현을 사용하세요
- 팬 문화와 덕질 용어를 자연스럽게 활용하세요
- 스타일링/패션 질문에도 전문적으로 답변 가능합니다 (퍼스널 컬러, 콘서트 코디 등)
- 홈페이지 기능에 대한 질문에는 위 안내를 참고하여 정확하고 친절하게 답변하세요
- AI 기술 관련 질문에는 소아베의 "비밀 노트" 스타일로 따뜻하게 설명하세요
- 항상 소아베로서 대화하세요. "저는 AI입니다"가 아니라 "나는 소아베예요"라고 정체성을 유지하세요`;

  function getChatUserContext() {
    var prefs = getTastePreferences();
    var lines = ['## [필수] 사용자 취향 데이터 (이 섹션을 반드시 참고하여 답변하세요)'];
    var hasData = false;
    if (prefs.likedStyles && prefs.likedStyles.length > 0) {
      var styleNames = prefs.likedStyles.map(function (s) {
        var map = { minimal: '미니멀', casual: '캐주얼', street: '스트릿', romantic: '로맨틱', classic: '클래식', sporty: '스포티' };
        return map[s] || s;
      }).join(', ');
      lines.push('- 저장된 선호 스타일: ' + styleNames);
      lines.push('- 사용자가 "내 취향 말해줘", "저의 취향을 이야기 해줘" 등으로 물으면 반드시 먼저 "저장된 취향은 [위 스타일]이에요."라고 말한 뒤, 그에 맞는 조언을 이어가세요. "취향을 말해주세요"라고 되물어보지 마세요.');
      hasData = true;
    }
    if (prefs.savedOutfits && prefs.savedOutfits.length > 0) {
      lines.push('- 저장한 코디 수: ' + prefs.savedOutfits.length + '건');
      hasData = true;
    }
    if (!hasData) {
      lines.push('- 현재 저장된 취향 없음 (아직 "이 코디 마음에 들어요"로 저장한 코디가 없음).');
      lines.push('- 사용자가 "내 취향 말해줘", "저의 취향을 이야기 해줘" 등으로 물으면 반드시 이렇게만 답하세요: "아직 저장된 취향이 없어요. 상단에서 AI 스타일링을 진행하시고, 마음에 드는 코디가 나오면 \'이 코디 마음에 들어요\'를 눌러 저장해보세요. 저장하시면 다음부터 그 취향을 기반으로 맞춤 대화를 드릴게요!" 취향을 말해달라고 되물어보지 마세요.');
    }
    return '\n\n' + lines.join('\n');
  }

  let chatHistory = [];
  let isTyping = false;

  // Gemini 2.5 Flash 무료 티어: 10 RPM, 250 RPD (일일 요청 수). 한도 초과 시 자동 차단.
  var CHAT_DAILY_LIMIT = 250;
  var CHAT_QUOTA_KEY = 'sims_chat_quota';

  function getChatQuota() {
    try {
      var raw = localStorage.getItem(CHAT_QUOTA_KEY);
      if (!raw) return { count: 0 };
      var obj = JSON.parse(raw);
      var today = new Date().toDateString();
      if (obj.date !== today) return { count: 0 };
      return { count: Number(obj.count) || 0 };
    } catch (e) { return { count: 0 }; }
  }

  function setChatQuota(count) {
    try {
      localStorage.setItem(CHAT_QUOTA_KEY, JSON.stringify({
        date: new Date().toDateString(),
        count: count
      }));
    } catch (e) {}
  }

  const chatWidget = document.getElementById('chat-widget');
  const chatToggle = document.getElementById('chat-toggle');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatMinimize = document.getElementById('chat-minimize');
  const quickBtns = document.querySelectorAll('.quick-btn');

  // Toggle chat widget
  if (chatToggle && chatWidget) {
    chatToggle.addEventListener('click', () => {
      chatWidget.classList.toggle('active');
      if (chatWidget.classList.contains('active')) {
        if (chatInput) {
          chatInput.focus();
        }
        // 채팅 위젯이 열릴 때 스크롤을 맨 위로 설정하여 환영 메시지가 보이도록 함
        setTimeout(() => {
          if (chatMessages) {
            chatMessages.scrollTop = 0;
          }
        }, 100);
      }
    });
  }

  if (chatMinimize && chatWidget) {
    chatMinimize.addEventListener('click', () => {
      chatWidget.classList.remove('active');
    });
  }

  // Quick question buttons
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.dataset.question;
      if (chatInput && question) {
        chatInput.value = question;
        sendMessage();
      }
    });
  });

  // Auto-resize textarea
  if (chatInput) {
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
    if (getChatQuota().count >= CHAT_DAILY_LIMIT) chatSend.disabled = true;
  }

  async function sendMessage() {
    if (!chatInput || !chatMessages) return;

    const message = chatInput.value.trim();
    if (!message || isTyping) return;

    const welcomeScreen = chatMessages.querySelector('.chat-welcome');
    if (welcomeScreen) {
      welcomeScreen.style.display = 'none';
    }

    addMessage('user', message);
    chatInput.value = '';
    chatInput.style.height = 'auto';

    chatHistory.push({ role: 'user', content: message });

    // 채팅은 서버 프록시(/api/chat)를 사용하므로 클라이언트 키 불필요

    var quota = getChatQuota();
    if (quota.count >= CHAT_DAILY_LIMIT) {
      addMessage('assistant', '오늘의 채팅 한도(' + CHAT_DAILY_LIMIT + '회)에 도달했습니다. 내일 다시 이용해 주세요. ☀️');
      if (chatSend) chatSend.disabled = true;
      return;
    }

    setChatQuota(quota.count + 1);

    showTypingIndicator();
    isTyping = true;
    if (chatSend) chatSend.disabled = true;

    try {
      var response = await callOpenAIChat(message);
      hideTypingIndicator();
      addMessage('assistant', response);
      chatHistory.push({ role: 'assistant', content: response });
      if (ttsEnabled) { playSoaveTTS(response); }
    } catch (error) {
      hideTypingIndicator();
      var errMsg = (error && error.message) ? error.message : String(error);
      var isQuotaError = errMsg === 'QUOTA_LIMIT' || /429|RESOURCE_EXHAUSTED|quota|rate limit/i.test(errMsg);
      if (isQuotaError) {
        setChatQuota(CHAT_DAILY_LIMIT);
        addMessage('assistant', '오늘의 채팅 한도(' + CHAT_DAILY_LIMIT + '회)에 도달했습니다. 내일 다시 이용해 주세요. ☀️');
        if (chatSend) chatSend.disabled = true;
      } else {
        if (errMsg.length > 200) errMsg = errMsg.slice(0, 200) + '…';
        addMessage('assistant', '죄송합니다. 오류가 발생했습니다. 🙏<br><br><small>원인: ' + escapeHtml(errMsg) + '</small>');
      }
      console.error('Chat API Error:', error);
    }

    isTyping = false;
    if (chatSend && getChatQuota().count < CHAT_DAILY_LIMIT) chatSend.disabled = false;
  }

  async function callGeminiChat(userMessage) {
    const contents = [];
    for (const msg of chatHistory.slice(-10)) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }
    var geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    var systemText = SYSTEM_PROMPT_BASE + getChatUserContext();
    const res = await fetch(geminiUrl + '?key=' + encodeURIComponent(GEMINI_API_KEY), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents: contents,
        generationConfig: { maxOutputTokens: 500, temperature: 0.8 }
      })
    });
    const data = await res.json().catch(function() { return {}; });
    if (!res.ok) {
      var errMsg = (data.error && data.error.message) ? data.error.message : ('HTTP ' + res.status);
      if (res.status === 429 || (data.error && (data.error.code === 429 || data.error.status === 'RESOURCE_EXHAUSTED'))) {
        throw new Error('QUOTA_LIMIT');
      }
      throw new Error('Gemini: ' + errMsg);
    }
    var text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
    if (!text) {
      if (data.candidates && data.candidates[0] && data.candidates[0].finishReason) {
        throw new Error('Gemini: finishReason ' + data.candidates[0].finishReason);
      }
      throw new Error('Gemini: no text in response');
    }
    return text;
  }

  // OpenAI Chat via Cloudflare Pages Function proxy (/api/chat)
  async function callOpenAIChat(userMessage) {
    var messages = [
      { role: 'system', content: SYSTEM_PROMPT_BASE + getChatUserContext() }
    ];
    for (var i = 0; i < chatHistory.length; i++) {
      var msg = chatHistory[i];
      if (i >= chatHistory.length - 10) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
    var res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.8
      })
    });
    var data = await res.json().catch(function() { return {}; });
    if (!res.ok) {
      var errMsg = (data.error && data.error.message) ? data.error.message : ('HTTP ' + res.status);
      if (res.status === 429) {
        throw new Error('QUOTA_LIMIT');
      }
      throw new Error('OpenAI: ' + errMsg);
    }
    var text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!text) {
      throw new Error('OpenAI: no text in response');
    }
    return text;
  }

  // ========================================
  // Voice: STT (Speech Recognition) + TTS (OpenAI)
  // ========================================
  var ttsEnabled = false;
  var currentAudio = null;
  var micBtn = document.getElementById('chat-mic-btn');
  var ttsToggle = document.getElementById('chat-tts-toggle');
  var recognition = null;
  var isRecording = false;

  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = function(event) {
      var transcript = event.results[0][0].transcript;
      if (chatInput && transcript.trim()) {
        chatInput.value = transcript.trim();
        sendMessage();
      }
      stopRecording();
    };

    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      stopRecording();
      if (event.error === 'not-allowed') {
        addMessage('assistant', '마이크 사용 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해 주세요. 🎤');
      }
    };

    recognition.onend = function() {
      stopRecording();
    };
  }

  function startRecording() {
    if (!recognition) return;
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    isRecording = true;
    if (micBtn) {
      micBtn.classList.add('recording');
      micBtn.querySelector('.icon-mic').style.display = 'none';
      micBtn.querySelector('.icon-mic-recording').style.display = '';
    }
    try { recognition.start(); } catch(e) {}
  }

  function stopRecording() {
    isRecording = false;
    if (micBtn) {
      micBtn.classList.remove('recording');
      micBtn.querySelector('.icon-mic').style.display = '';
      micBtn.querySelector('.icon-mic-recording').style.display = 'none';
    }
    try { recognition.stop(); } catch(e) {}
  }

  if (micBtn) {
    if (!SpeechRecognition) {
      micBtn.style.display = 'none';
    } else {
      micBtn.addEventListener('click', function() {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      });
    }
  }

  if (ttsToggle) {
    ttsToggle.addEventListener('click', function() {
      ttsEnabled = !ttsEnabled;
      ttsToggle.classList.toggle('active', ttsEnabled);
      ttsToggle.querySelector('.icon-speaker-on').style.display = ttsEnabled ? '' : '';
      ttsToggle.querySelector('.icon-speaker-off').style.display = 'none';
      if (ttsEnabled) {
        ttsToggle.querySelector('.icon-speaker-on').style.display = '';
        ttsToggle.querySelector('.icon-speaker-off').style.display = 'none';
      } else {
        ttsToggle.querySelector('.icon-speaker-on').style.display = 'none';
        ttsToggle.querySelector('.icon-speaker-off').style.display = '';
        if (currentAudio) { currentAudio.pause(); currentAudio = null; }
      }
    });
  }

  async function playSoaveTTS(text) {
    if (!text) return;
    var cleanText = text.replace(/<[^>]*>/g, '').replace(/[💜✨🌟🟣👗🏠🎤🎨]/g, '').trim();
    if (!cleanText || cleanText.length < 2) return;
    if (cleanText.length > 500) cleanText = cleanText.slice(0, 500);

    try {
      var res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: cleanText,
          voice: 'nova'
        })
      });
      if (!res.ok) {
        console.error('TTS error:', res.status);
        return;
      }
      var blob = await res.blob();
      var url = URL.createObjectURL(blob);
      if (currentAudio) { currentAudio.pause(); }
      currentAudio = new Audio(url);
      currentAudio.play().catch(function(e) { console.error('TTS play error:', e); });
      currentAudio.onended = function() { URL.revokeObjectURL(url); currentAudio = null; };
    } catch (err) {
      console.error('TTS fetch error:', err);
    }
  }

  var SOAVE_AVATAR_URL = 'image/soave/soave-avatar-face.png';
  function addMessage(role, content) {
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const time = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    var avatarHtml = role === 'assistant'
      ? '<img src="' + SOAVE_AVATAR_URL + '" alt="소아베" class="message-avatar-img" width="36" height="36">'
      : 'ME';
    messageDiv.innerHTML = `
      <div class="message-avatar">${avatarHtml}</div>
      <div class="message-content">
        <div class="message-bubble">${formatMessage(content)}</div>
        <span class="message-time">${time}</span>
      </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatMessage(content) {
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  function showTypingIndicator() {
    if (!chatMessages) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-avatar"><img src="${SOAVE_AVATAR_URL}" alt="소아베" class="message-avatar-img" width="36" height="36"></div>
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // ========================================
  // Borahae Lightstick Designer
  // ========================================
  (function initLightstickDesigner() {
    var lsModal = document.getElementById('lightstick-modal');
    var lsCloseBtn = document.getElementById('lightstick-modal-close');
    var openBtn = document.getElementById('open-lightstick-btn');
    if (!lsModal || !openBtn) return;

    var lsState = { name: '', color: '', colorName: '', shape: '', shapeName: '', prompt: '', step: 1 };

    // Open / Close modal
    function openLightstickModal() {
      lsState = { name: '', color: '', colorName: '', shape: '', shapeName: '', prompt: '', step: 1 };
      showLsStep(1);
      document.getElementById('ls-name-input').value = '';
      document.getElementById('ls-prompt-input').value = '';
      document.querySelectorAll('.ls-shape-btn').forEach(function(b) { b.classList.remove('active'); });
      document.getElementById('ls-design-summary').style.display = 'none';
      document.getElementById('ls-result-image-wrap').style.display = 'none';
      document.getElementById('ls-loading').style.display = 'none';
      document.querySelectorAll('.ls-color-item').forEach(function(el) { el.classList.remove('selected'); });
      document.getElementById('ls-next-1').disabled = true;
      document.getElementById('ls-next-2').disabled = true;
      lsModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeLightstickModal() {
      lsModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    openBtn.addEventListener('click', openLightstickModal);
    lsCloseBtn.addEventListener('click', closeLightstickModal);
    lsModal.addEventListener('click', function(e) { if (e.target === lsModal) closeLightstickModal(); });

    // 한글 건축 체험: 나노 바나나(Gemini)로 한글 공감각 건축 메뉴얼 기반 건축물 이미지 생성
    var archModal = document.getElementById('architecture-modal');
    var archCloseBtn = document.getElementById('architecture-modal-close');
    var openArchBtn = document.getElementById('open-architecture-btn');
    var archLoading = document.getElementById('arch-modal-loading');
    var archResult = document.getElementById('arch-modal-result');
    var archError = document.getElementById('arch-modal-error');
    var archNanoImage = document.getElementById('arch-nano-image');
    var archNanoDownload = document.getElementById('arch-nano-download');
    var archErrorMsg = document.getElementById('arch-modal-error-msg');
    var archRetryBtn = document.getElementById('arch-retry-btn');

    function buildArchitecturePrompt() {
      return 'Generate a single photorealistic architectural image based on the following system.\n\n'
        + '**Hangeul Synesthetic Architecture System (한글 공감각 건축):**\n'
        + '- Structure: foundations, walls, ornament (windows, facades), beams, columns, expressed with 7 colors (Do=red, Re=orange, Mi=yellow, Fa=green, Sol=blue, La=indigo, Si=violet) and Hangeul jamo shapes.\n'
        + '- Input piece: "Salut d\'Amour" Op.12. Express bass, melody, accompaniments as Hangeul-inspired architecture with the 7 colors.\n\n'
        + '**Task — FUTURE ARCHITECTURE (미래 건축물):** Design a **futuristic** main building that embodies this system. The building must be **future architecture**: innovative, forward-looking forms (e.g. flowing curves, crystalline or organic shapes, smart materials, sustainable tech), with Hangeul jamo or calligraphic patterns integrated elegantly on facades—not traditional hanok or historical style. Use the 7 colors in harmony. Include a **plaza or forecourt** in front: open space, perhaps with geometric paving or low platforms. No traditional Korean village or hanok aesthetic.\n'
        + '**Surroundings (required):** Show a **future urban or campus context**: other futuristic structures, skywalks, green tech, or sleek landscape in the background—not a historical village. Clean, innovative atmosphere.\n'
        + '**Style (required):** Photorealistic, natural or dramatic daylight, soft shadows, detailed textures (glass, metal, sustainable materials). Beautiful and serene. No text or labels. One cohesive scene: main future building with plaza + futuristic context.\n\n'
        + '**Composition:** Frame the main building with its plaza in the foreground; future surroundings in the mid/background. Entire scene visible, no plain white background.';
    }

    function showArchLoading() {
      if (archLoading) archLoading.style.display = 'block';
      if (archResult) archResult.style.display = 'none';
      if (archError) archError.style.display = 'none';
    }
    var lastArchNanoBase64 = null;
    var lastArchNanoVideoBlob = null;
    var archNanoVideo = document.getElementById('arch-nano-video');

    function showArchResult(imageBase64) {
      lastArchNanoBase64 = imageBase64;
      lastArchNanoVideoBlob = null;
      if (archLoading) archLoading.style.display = 'none';
      if (archError) archError.style.display = 'none';
      if (archResult) archResult.style.display = 'block';
      if (archNanoImage) {
        archNanoImage.src = 'data:image/png;base64,' + imageBase64;
        archNanoImage.style.display = '';
      }
      if (archNanoVideo) archNanoVideo.style.display = 'none';
      if (archNanoDownload) {
        archNanoDownload.href = 'data:image/png;base64,' + imageBase64;
        archNanoDownload.download = 'hangeul-architecture-nano.png';
        archNanoDownload.textContent = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t('arch.download_btn') : '💾 이미지 저장';
        archNanoDownload.removeAttribute('disabled');
        archNanoDownload.style.pointerEvents = 'auto';
        archNanoDownload.style.opacity = '1';
      }
    }

    function showArchVideoResult(videoBlob) {
      lastArchNanoBase64 = null;
      lastArchNanoVideoBlob = videoBlob;
      if (archLoading) archLoading.style.display = 'none';
      if (archError) archError.style.display = 'none';
      if (archResult) archResult.style.display = 'block';
      if (archNanoImage) archNanoImage.style.display = 'none';
      if (archNanoVideo) {
        var oldUrl = archNanoVideo.src;
        if (oldUrl && oldUrl.indexOf('blob:') === 0) URL.revokeObjectURL(oldUrl);
        var blobUrl = URL.createObjectURL(videoBlob);
        archNanoVideo.src = blobUrl;
        archNanoVideo.style.display = '';
        archNanoVideo.load();
        archNanoVideo.currentTime = 0;
        archNanoVideo.muted = false;
        archNanoVideo.onloadeddata = function() {
          archNanoVideo.currentTime = 0;
        };
        archNanoVideo.onerror = function() {
          console.error('Architecture video playback error. Codec or format may not be supported.');
        };
      }
      if (archNanoDownload) {
        archNanoDownload.href = URL.createObjectURL(videoBlob);
        archNanoDownload.download = 'hangeul-architecture-nano.mp4';
        archNanoDownload.textContent = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t('arch.download_video_btn') : '💾 영상 저장';
        archNanoDownload.style.pointerEvents = 'auto';
        archNanoDownload.style.opacity = '1';
      }
    }
    function showArchError(message, isVideoError) {
      if (archLoading) archLoading.style.display = 'none';
      if (archResult) archResult.style.display = 'none';
      if (archError) archError.style.display = 'block';
      if (archErrorMsg) archErrorMsg.textContent = message || '';
      var titleEl = document.getElementById('arch-modal-error-title');
      if (titleEl) titleEl.textContent = getArchErrorText(isVideoError ? 'arch.video_error_title' : 'arch.error_title');
    }

    function closeArchitectureModal() {
      if (archModal) {
        archModal.classList.remove('active');
        archModal.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    }

    function getArchErrorText(key) {
      return (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t(key) : key;
    }

    function buildArchitectureVideoPrompt() {
      return 'A cinematic, isometric 8-second video of a single 3D architectural structure. The building is made of colorful blocks in red, orange, yellow, green, blue, indigo, and violet, with clear structural parts (base, walls), decorative facades (windows, openings), and connecting elements (beams, columns, a spiral element). Style: clean architectural visualization, Hangeul synesthetic architecture. The camera slowly orbits or pans around the building. Centered in frame, plain background. No text or labels. One cohesive building that looks like music translated into architecture.';
    }

    function buildArchitectureVideoPromptFromImage() {
      return 'Cinematic 8-second video of the EXACT SAME building shown in the attached image. This is the final Hangeul future architecture building—maintain the same building shape, form, color distribution (7 colors: red, orange, yellow, green, blue, indigo, violet), plaza/forecourt layout, and surrounding futuristic context as shown in the image. The camera slowly orbits or pans around the building (360 degrees); other futuristic structures or landscape visible in the background. Photorealistic, natural or dramatic daylight, soft shadows. No text or labels. Serene, innovative atmosphere. Keep the building design consistent with the attached image—this video is part of the same architectural story (concept board → final building → video).';
    }

    async function runNanoBananaArchitecture() {
      showArchLoading();
      var loadingText = document.getElementById('arch-modal-loading-text');
      if (loadingText) loadingText.setAttribute('data-i18n', 'arch.nano_loading');
      if (archModal) {
        archModal.classList.add('active');
        archModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }

      if (!GEMINI_API_KEY) {
        showArchError(getArchErrorText('arch.error_no_api_key'));
        return;
      }

      try {
        var prompt = buildArchitecturePrompt();
        var imageBase64 = await callGeminiImageGeneration(prompt, null);
        if (imageBase64) showArchResult(imageBase64);
        else showArchError('이미지가 생성되지 않았습니다.');
      } catch (err) {
        var msg = (err && err.message) ? String(err.message) : '';
        if (/unregistered callers|API Key|API key|identity/i.test(msg)) {
          msg = getArchErrorText('arch.error_no_api_key');
        }
        showArchError(msg || 'OpenAI 생성 중 오류가 발생했습니다.');
        console.error('Architecture generation error:', err);
      }
    }

    async function runNanoBananaArchitectureVideo() {
      showArchLoading();
      var loadingText = document.getElementById('arch-modal-loading-text');
      function setLoadingVideo() {
        if (loadingText) {
          loadingText.setAttribute('data-i18n', 'arch.nano_loading_video');
          loadingText.textContent = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t('arch.nano_loading_video') : '한글 건축 영상을 생성하고 있습니다... (1~2분 소요될 수 있습니다)';
        }
      }
      function setLoadingImage() {
        if (loadingText) {
          loadingText.textContent = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t('arch.nano_loading_image_first') : '1단계: 악보 그리드 기준 이미지를 생성하고 있습니다...';
        }
      }
      if (archModal) {
        archModal.classList.add('active');
        archModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }

      if (!GEMINI_API_KEY) {
        showArchError(getArchErrorText('arch.error_no_api_key'), true);
        return;
      }

      try {
        var imageBase64 = null;
        var finalImg = document.getElementById('arch-final-image');
        if (finalImg && finalImg.src && finalImg.src.indexOf('data:image') === 0) {
          var m = finalImg.src.match(/base64,(.+)/);
          if (m && m[1]) imageBase64 = m[1];
        }
        if (!imageBase64) imageBase64 = window.__lastArchBuildingImageBase64 || null;
        if (!imageBase64) {
          showArchError(window.__simsI18n && window.__simsI18n.t ? window.__simsI18n.t('arch.video_need_final_image') : '3. 최종 건축 디자인을 먼저 생성한 뒤 영상 보기를 눌러 주세요.', true);
          return;
        }
        setLoadingVideo();
        var videoPrompt = buildArchitectureVideoPromptFromImage();
        var opName = await startVeoVideoGenerationFromImage(videoPrompt, imageBase64);
        var result = await pollVeoOperation(opName);
        var videoUri = result.response && result.response.generateVideoResponse && result.response.generateVideoResponse.generatedSamples && result.response.generateVideoResponse.generatedSamples[0] && result.response.generateVideoResponse.generatedSamples[0].video && result.response.generateVideoResponse.generatedSamples[0].video.uri;
        if (!videoUri) {
          showArchError('영상 생성 결과를 가져올 수 없습니다.', true);
          return;
        }
        var blob = await fetchVeoVideoBlob(videoUri);
        showArchVideoResult(blob);
      } catch (err) {
        var msg = (err && err.message) ? String(err.message) : '';
        if (/unregistered callers|API Key|API key|identity|quota|not available|403|404/i.test(msg)) {
          msg = getArchErrorText('arch.error_veo_hint');
        }
        showArchError(msg || '한글 건축 영상 생성 중 오류가 발생했습니다.', true);
        console.error('Architecture video error:', err);
      }
    }

    var archComingSoonModal = document.getElementById('arch-coming-soon-modal');
    var archComingSoonClose = document.getElementById('arch-coming-soon-close');
    var archComingSoonConfirm = document.getElementById('arch-coming-soon-confirm');
    function openArchComingSoonModal() {
      if (archComingSoonModal) {
        archComingSoonModal.classList.add('active');
        archComingSoonModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }
    function closeArchComingSoonModal() {
      if (archComingSoonModal) {
        archComingSoonModal.classList.remove('active');
        archComingSoonModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
    if (archComingSoonClose) archComingSoonClose.addEventListener('click', closeArchComingSoonModal);
    if (archComingSoonConfirm) archComingSoonConfirm.addEventListener('click', closeArchComingSoonModal);
    if (archComingSoonModal) archComingSoonModal.addEventListener('click', function(e) { if (e.target === archComingSoonModal) closeArchComingSoonModal(); });

    if (archModal && openArchBtn) {
      // openArchBtn is now an <a> tag in index.html, no need for click listener here
      archCloseBtn.addEventListener('click', closeArchitectureModal);
      archModal.addEventListener('click', function(e) { if (e.target === archModal) closeArchitectureModal(); });
    }

    // Fandom Modal (Community, Events, Content)
    var fandomModal = document.getElementById('fandom-modal');
    var fandomModalClose = document.getElementById('fandom-modal-close');
    var fandomModalBody = document.getElementById('fandom-modal-body');

    function openFandomModal(type) {
      if (!fandomModal || !fandomModalBody) return;
      var content = '';
      if (type === 'community') {
        content = `
          <div style="text-align: center;">
            <h2 style="margin-bottom: 20px; color: var(--primary);">💜 팬 커뮤니티</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left;">
              <div class="feature-card" style="padding: 20px;">
                <h4>#자유게시판</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">아미들과 자유롭게 소통하는 공간</p>
                <div style="margin-top: 10px; font-size: 0.8rem;">최근 게시글: 보라해 3.0 너무 좋아요! (방금전)</div>
              </div>
              <div class="feature-card" style="padding: 20px;">
                <h4>#나눔장터</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">굿즈 나눔 및 교환 정보 공유</p>
              </div>
              <div class="feature-card" style="padding: 20px;">
                <h4>#팬아트</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">여러분의 금손 실력을 보여주세요</p>
              </div>
              <div class="feature-card" style="padding: 20px;">
                <h4>#응원글</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">아티스트에게 전하는 따뜻한 메시지</p>
              </div>
            </div>
            <button class="btn-primary" style="margin-top: 30px;">글쓰기</button>
          </div>
        `;
      } else if (type === 'events') {
        content = `
          <div style="text-align: center;">
            <h2 style="margin-bottom: 20px; color: var(--secondary);">✨ 이벤트 기획</h2>
            <div style="max-height: 65vh; overflow-y: auto; padding-right: 4px;" class="events-scroll-area">

              <!-- 메인 이미지 (0번) -->
              <div style="margin-bottom: 20px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
                <img src="image/contents/instagram/0.jpg" alt="BTS ARIRANG 컴백" style="width:100%; display:block; border-radius: 16px;">
              </div>

              <!-- BTS 아리랑 · 광화문 공연 (팩트 뉴스) -->
              <div style="margin-bottom: 20px; padding: 18px; border-left: 4px solid #7C3AED; background: linear-gradient(135deg, rgba(124,58,237,0.06), rgba(124,58,237,0.02)); border-radius: 0 12px 12px 0; text-align: left;">
                <div style="font-weight: 800; font-size: 1.05rem; margin-bottom: 6px;">🔥 [예정] BTS 정규 5집 'ARIRANG' 발매 & 광화문 컴백 라이브</div>
                <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.65;">
                  <strong>3월 20일 오후 1시</strong> — BTS 정규 5집 'ARIRANG' 전 세계 동시 발매 (14곡 수록)<br>
                  <strong>3월 21일 오후 8시</strong> — 서울 광화문 광장 'BTS 컴백 라이브: ARIRANG' 개최<br>
                  광화문 광장 최초 가수 단독 공연 · 약 3만 4천 석 규모 (무료, 위버스 사전예약)<br>
                  <strong>넷플릭스 190개국 실시간 생중계</strong> (넷플릭스 최초 단독 콘서트 실시간 중계)<br>
                  3월 27일 넷플릭스 다큐멘터리 'BTS: 더 리턴' 공개<br>
                  3월 20일~4월 12일 'BTS 더 시티 아리랑 서울' — 서울 랜드마크 미디어 파사드 · 참여형 이벤트
                </div>
                <div style="margin-top: 8px; font-size: 0.75rem; color: var(--text-muted);">출처: 조선일보, YTN, 문화체육관광부</div>
              </div>

              <div style="text-align: left;">
                <div style="margin-bottom: 16px; padding: 15px; border-left: 4px solid var(--primary); background: var(--bg-secondary); border-radius: 0 12px 12px 0;">
                  <div style="font-weight: 700;">[진행중] 2월 보라해 컵홀더 이벤트</div>
                  <div style="font-size: 0.85rem; color: var(--text-muted);">강남구 테헤란로 소재 카페 보라</div>
                </div>
                <div style="margin-bottom: 16px; padding: 15px; border-left: 4px solid var(--secondary); background: var(--bg-secondary); border-radius: 0 12px 12px 0;">
                  <div style="font-weight: 700;">[예정] 3월 보라빛 스트리밍 파티</div>
                  <div style="font-size: 0.85rem; color: var(--text-muted);">3월 10일 오후 8시 (온라인)</div>
                </div>
                <div style="margin-bottom: 16px; padding: 15px; border-left: 4px solid var(--accent); background: var(--bg-secondary); border-radius: 0 12px 12px 0;">
                  <div style="font-weight: 700;">[상시] 팬메이드 굿즈 공모전</div>
                  <div style="font-size: 0.85rem; color: var(--text-muted);">최우수작 실제 굿즈 제작 지원</div>
                </div>
              </div>

              <!-- 한글런 이벤트 -->
              <div style="margin-top: 16px; margin-bottom: 20px; padding: 18px; border-left: 4px solid #10B981; background: linear-gradient(135deg, rgba(16,185,129,0.06), rgba(16,185,129,0.02)); border-radius: 0 12px 12px 0; text-align: left;">
                <div style="font-weight: 800; font-size: 1.05rem; margin-bottom: 6px;">🏃 [예정] 보라해 한글런 — 한글의 길을 달리다</div>
                <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.65;">
                  <strong>4월 19일(토) 오전 8시</strong> — 서울 여의도 한강공원 출발<br>
                  한글 자음 'ㄱ~ㅎ' 14자를 코스에 새긴 7km 러닝 · 보라빛 야광 레이스<br>
                  완주자 전원 <strong>한글 페르소나 메달 + 보라해 피니셔 티셔츠</strong> 증정<br>
                  참가비 무료 (보라해 앱 사전등록 선착순 5,000명)<br>
                  BTS 'ARIRANG' 수록곡이 흐르는 구간별 응원 스테이션 운영<br>
                  달리면서 만나는 한글 조형물 포토존 · 완주 후 팬 커뮤니티 애프터 파티
                </div>
                <div style="margin-top: 8px; font-size: 0.75rem; color: var(--text-muted);">주최: 보라해 BORAHAE · 서울시체육회 | 후원: 한글문화연대</div>
              </div>

              <!-- 한글런 이미지 -->
              <div style="margin-bottom: 20px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
                <img src="image/contents/run/all.jpeg" alt="보라해 한글런 — 한글의 길을 달리다" style="width:100%; display:block; border-radius: 16px;">
              </div>

              <!-- 인스타그램 이미지 갤러리 (6장) -->
              <div style="margin-top: 12px; margin-bottom: 16px;">
                <p style="font-weight: 700; font-size: 0.95rem; margin-bottom: 12px; text-align: left;">📸 팬 이벤트 현장 스케치</p>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                  <div style="aspect-ratio: 1; border-radius: 10px; overflow: hidden;"><img src="image/contents/instagram/1.jpg" alt="이벤트 현장 1" style="width:100%; height:100%; object-fit:cover;"></div>
                  <div style="aspect-ratio: 1; border-radius: 10px; overflow: hidden;"><img src="image/contents/instagram/2.jpg" alt="이벤트 현장 2" style="width:100%; height:100%; object-fit:cover;"></div>
                  <div style="aspect-ratio: 1; border-radius: 10px; overflow: hidden;"><img src="image/contents/instagram/3.jpg" alt="이벤트 현장 3" style="width:100%; height:100%; object-fit:cover;"></div>
                  <div style="aspect-ratio: 1; border-radius: 10px; overflow: hidden;"><img src="image/contents/instagram/4.jpg" alt="이벤트 현장 4" style="width:100%; height:100%; object-fit:cover;"></div>
                  <div style="aspect-ratio: 1; border-radius: 10px; overflow: hidden;"><img src="image/contents/instagram/5.jpg" alt="이벤트 현장 5" style="width:100%; height:100%; object-fit:cover;"></div>
                  <div style="aspect-ratio: 1; border-radius: 10px; overflow: hidden;"><img src="image/contents/instagram/0.jpg" alt="BTS ARIRANG" style="width:100%; height:100%; object-fit:cover;"></div>
                </div>
              </div>

            </div>
            <button class="btn-primary" style="margin-top: 20px; background: var(--secondary);">이벤트 제안하기</button>
          </div>
        `;
      } else if (type === 'content') {
        content = `
          <div style="text-align: center;">
            <h2 style="margin-bottom: 20px; color: var(--accent);">🎨 팬 콘텐츠 갤러리</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
              <div style="aspect-ratio: 1; background: #eee; border-radius: 8px; overflow: hidden; background-image: url('image/contents/1.png'); background-size: cover; background-position: center;"></div>
              <div style="aspect-ratio: 1; background: #eee; border-radius: 88px; overflow: hidden; position: relative;">
                <video src="image/contents/22.mp4" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
              </div>
              <div style="aspect-ratio: 1; background: #eee; border-radius: 8px; overflow: hidden; background-image: url('image/contents/3.png'); background-size: cover; background-position: center;"></div>
              <div style="aspect-ratio: 1; background: #eee; border-radius: 8px; overflow: hidden; background-image: url('image/contents/4.png'); background-size: cover; background-position: center;"></div>
              <div style="aspect-ratio: 1; background: #eee; border-radius: 8px; overflow: hidden; background-image: url('image/contents/5.png'); background-size: cover; background-position: center;"></div>
              <div style="aspect-ratio: 1; background: #eee; border-radius: 8px; overflow: hidden; background-image: url('image/contents/6.png'); background-size: cover; background-position: center;"></div>
            </div>
            <p style="margin-top: 20px; font-size: 0.9rem; color: var(--text-muted);">여러분의 소중한 팬 콘텐츠를 앱에서 더 많이 확인하세요.</p>
            <button class="btn-primary" style="margin-top: 10px; background: var(--accent);">작품 업로드</button>
          </div>
        `;
      }
      fandomModalBody.innerHTML = content;
      fandomModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    document.getElementById('open-community-btn')?.addEventListener('click', function() { openFandomModal('community'); });
    document.getElementById('open-events-btn')?.addEventListener('click', function() { openFandomModal('events'); });
    document.getElementById('open-content-btn')?.addEventListener('click', function() { openFandomModal('content'); });
    fandomModalClose?.addEventListener('click', function() {
      fandomModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    fandomModal?.addEventListener('click', function(e) {
      if (e.target === fandomModal) {
        fandomModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // TEROS Story Modal Logic
    var terosModal = document.getElementById('teros-story-modal');
    var terosClose = document.getElementById('teros-story-close');
    var terosAppBtn = document.getElementById('boratime-app-cta');
    var shopAppBtns = document.querySelectorAll('.shop-app-cta');
    var terosNext = document.getElementById('teros-next');
    var terosPrev = document.getElementById('teros-prev');
    var terosSteps = document.querySelectorAll('.teros-step');
    var terosDots = document.querySelectorAll('.teros-dot');
    var currentTerosStep = 0;

    function updateTerosModal() {
      var t = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t : function(k, d) { return d || k; };
      terosSteps.forEach(function(step, idx) {
        step.classList.toggle('active', idx === currentTerosStep);
      });
      terosDots.forEach(function(dot, idx) {
        dot.classList.toggle('active', idx === currentTerosStep);
      });
      terosPrev.disabled = currentTerosStep === 0;
      terosNext.textContent = currentTerosStep === terosSteps.length - 1 ? t('teros.start_btn') : t('teros.next');
    }

    function showTerosStory(e) {
      e.preventDefault();
      currentTerosStep = 0;
      updateTerosModal();
      terosModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    terosAppBtn?.addEventListener('click', showTerosStory);
    shopAppBtns.forEach(btn => btn.addEventListener('click', showTerosStory));

    terosClose?.addEventListener('click', function() {
      terosModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    terosNext?.addEventListener('click', function() {
      if (currentTerosStep < terosSteps.length - 1) {
        currentTerosStep++;
        updateTerosModal();
      } else {
        terosModal.classList.remove('active');
        document.body.style.overflow = '';
        // Could redirect or show a final toast here
      }
    });

    terosPrev?.addEventListener('click', function() {
      if (currentTerosStep > 0) {
        currentTerosStep--;
        updateTerosModal();
      }
    });

    terosModal?.addEventListener('click', function(e) {
      if (e.target === terosModal) {
        terosModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    if (archNanoDownload) {
      archNanoDownload.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        try {
          if (!lastArchNanoBase64) return;
          var bin = atob(lastArchNanoBase64);
          var arr = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
          var blob = new Blob([arr], { type: 'image/png' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'hangeul-architecture-nano.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (err) { console.error('Download failed:', err); }
      });
    }

    if (archRetryBtn) {
      archRetryBtn.addEventListener('click', runNanoBananaArchitecture);
    }

    // 음악 입력 → 한글 건축물 이미지 생성 (샘플 / MIDI 업로드 → 생성 버튼 → 이미지)
    (function initArchitectureGenerate() {
      var useSampleBtn = document.getElementById('arch-use-sample-btn');
      var midiInput = document.getElementById('arch-midi-input');
      var statusEl = document.getElementById('arch-input-status');
      var generateBtn = document.getElementById('arch-generate-btn');
      var loadingEl = document.getElementById('arch-loading');
      var resultEl = document.getElementById('arch-result');
      var resultImg = document.getElementById('arch-result-image');
      var downloadLink = document.getElementById('arch-download-link');
      var againBtn = document.getElementById('arch-generate-again-btn');

      if (!useSampleBtn || !generateBtn || !resultImg || typeof window.HANGEUL_ARCHITECTURE === 'undefined') return;

      function t(key) {
        return (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t(key) : key;
      }
      var dropzoneEl = document.getElementById('magicshop-dropzone');
      var dropzoneTextEl = dropzoneEl ? dropzoneEl.querySelector('.magicshop-dropzone-text') : null;

      function setInputReady(message) {
        if (statusEl) statusEl.textContent = message;
        generateBtn.disabled = false;
      }
      function setDropzoneFileLabel(fileName) {
        if (!dropzoneTextEl) return;
        if (fileName) {
          dropzoneTextEl.textContent = (t('arch.file_selected') || '\u2713 \uc120\ud0dd\ub41c \ud30c\uc77c: ') + fileName;
          dropzoneTextEl.style.fontWeight = '600';
          dropzoneTextEl.style.color = 'var(--primary)';
        } else {
          dropzoneTextEl.textContent = t('magicshop.dropzone');
          dropzoneTextEl.style.fontWeight = '';
          dropzoneTextEl.style.color = '';
        }
      }

      var archUploadedImageDataUrl = null;

      useSampleBtn.addEventListener('click', function() {
        if (midiInput) midiInput.value = '';
        archUploadedImageDataUrl = null;
        setInputReady(t('arch.status_sample'));
        setDropzoneFileLabel(null);
      });

      if (midiInput) {
        midiInput.addEventListener('change', function() {
          var file = this.files && this.files[0];
          if (file) {
            var isPdf = file.type === 'application/pdf' || (file.name && file.name.toLowerCase().endsWith('.pdf'));
            var isImage = (file.type && file.type.indexOf('image/') === 0) || (file.name && /\.(png|jpe?g|gif|webp)$/i.test(file.name));
            if (isImage) {
              var fr = new FileReader();
              fr.onload = function() { archUploadedImageDataUrl = fr.result; };
              fr.readAsDataURL(file);
            } else {
              archUploadedImageDataUrl = null;
            }
            var msg = isPdf ? t('arch.status_uploaded_pdf') : isImage ? t('arch.status_uploaded_image') : t('arch.status_uploaded');
            setInputReady(msg + ' \u300c' + file.name + '\u300d');
            setDropzoneFileLabel(file.name);
          } else {
            archUploadedImageDataUrl = null;
            if (statusEl) statusEl.textContent = '';
            generateBtn.disabled = true;
            setDropzoneFileLabel(null);
          }
        });
      }

      function buildArchitecturePromptForNano(pieceTitle, useSheetImage) {
        var pieceLine = (pieceTitle && useSheetImage)
          ? ('The attached image is sheet music for the piece: **' + pieceTitle + '**. ')
          : 'Input piece: "Salut d\'Amour" (Love\'s Greeting) Op.12, E Major. ';
        return 'Generate a single photorealistic architectural image based on the following system.\n\n'
          + '**Hangeul Synesthetic Architecture System (한글 공감각 건축):**\n'
          + '- Structure: foundations, walls, ornament (windows, facades), beams, columns, expressed with 7 colors (Do=red, Re=orange, Mi=yellow, Fa=green, Sol=blue, La=indigo, Si=violet) and Hangeul jamo shapes.\n'
          + '- ' + pieceLine + 'Express bass, melody, accompaniments as Hangeul-inspired architecture with the 7 colors.\n\n'
          + '**Task — FUTURE ARCHITECTURE (미래 건축물):** Design a **futuristic** main building that embodies this system and represents THIS piece of music. The building must be **future architecture**: innovative, forward-looking forms (flowing curves, crystalline or organic shapes, smart materials), with Hangeul jamo or calligraphic patterns integrated elegantly on facades—not traditional hanok or historical style. Use the 7 colors in harmony. Include a **plaza or forecourt** in front. No traditional Korean village.\n'
          + '**Surroundings (required):** Show a **future urban or campus context**: other futuristic structures, skywalks, or sleek landscape in the background—not a historical village. Clean, innovative atmosphere.\n'
          + '**Style (required):** Photorealistic, natural or dramatic daylight, soft shadows, detailed textures (glass, metal, sustainable materials). Beautiful and serene. No text or labels. One cohesive scene: main future building with plaza + futuristic context.\n\n'
          + '**Composition:** Frame the main building with its plaza in the foreground; future surroundings in the mid/background. Entire scene visible, no plain white background.';
      }

      /** 3단계: 컨셉 디자인 — 참조 이미지(최종 건축물)와 동일한 건축물이 보드에 나오도록 (미래 건축 일치성) */
      function buildArchitectureConceptDesignPromptFromReference(pieceTitle, useSheetImage) {
        var pieceLine = (pieceTitle && useSheetImage) ? ('Project title: "Hangeul Culture Sharing Block @ ' + pieceTitle + '". ') : 'Project title: "Hangeul Culture Sharing Block @ Salut d\'Amour". ';
        return 'Generate a single architectural concept design PRESENTATION BOARD (one image), professional and clean. The attached building is FUTURISTIC architecture in a FUTURE CITY context—no Hanok, no traditional village.\n\n'
          + '**CRITICAL — BUILDING IDENTITY (MANDATORY CONSISTENCY):** The ATTACHED image is the KEY BUILDING. This is the SINGLE SOURCE OF TRUTH. You MUST depict THIS EXACT SAME BUILDING in your board:\n'
          + '- Same building shape, proportions, and futuristic form\n'
          + '- Same color distribution (7 colors: red, orange, yellow, green, blue, indigo, violet)\n'
          + '- Same plaza/forecourt and futuristic city surroundings\n'
          + '- Same Hangeul-inspired patterns or jamo elements\n'
          + 'Do NOT invent a different building. Do NOT change the building design. The aerial view at the top of the board must show THIS EXACT BUILDING from above in its futuristic city context. The perspective thumbnails (3–6 images) must show THE SAME BUILDING from different angles. Every building shown in the board must be the same as the attached image. Consistency is mandatory—this building will also be used for video generation.\n\n'
          + '**Board layout:** Top = aerial 3D bird\'s-eye view featuring THE ATTACHED BUILDING and its site (plaza, futuristic city context). Below or around: small diagrams (concept, massing evolution, program diagram with icons), simplified floor plans, one exploded axonometric, and 3–6 perspective thumbnails in a grid—ALL showing THE SAME ATTACHED BUILDING. Muted palette for board background: whites, light grays, beige, soft greens. The building itself keeps its 7 colors from the attached image. One cohesive presentation board. No long text labels; minimal annotations only. Architectural competition style.';
      }

      /** 5단계: 최종 한글 건축물 (영상·컨셉보드 일치성의 기준 이미지) — 미래 건축 고정 */
      function buildArchitectureFinalBuildingPrompt(pieceTitle, useSheetImage) {
        var pieceLine = (pieceTitle && useSheetImage) ? ('Piece: ' + pieceTitle + '. ') : 'Piece: Salut d\'Amour. ';
        return 'Generate ONE final architectural image. This image is the SINGLE SOURCE OF TRUTH for both the concept board and the video. It will be shown in an aerial view in the concept board and animated in the video—make it distinctive and recognizable.\n\n'
          + '**MANDATORY — FUTURE ARCHITECTURE ONLY (미래 건축물 고정):** ' + pieceLine + 'One main building: 7 colors (red, orange, yellow, green, blue, indigo, violet) distributed clearly across the building (e.g. colored blocks, patterns, or sections). Hangeul jamo-inspired shapes integrated elegantly on facades. The building MUST be **futuristic**: innovative forms (flowing curves, crystalline or organic shapes, glass, metal, smart materials). Include a **plaza or forecourt** in front. **Surroundings (required):** Show a **futuristic city context**: other modern high-rises, skywalks, sleek infrastructure, green tech—NO traditional Hanok, NO Korean village, NO tiled roofs or wooden traditional elements. Photorealistic, natural or dramatic daylight, soft shadows, detailed textures (glass, metal, sustainable materials).\n\n'
          + '**Composition:** Single centered futuristic building, full structure visible from eye-level perspective. No text or labels. Clear silhouette and recognizable color distribution so this EXACT building can be identified from above (aerial view) and from different angles. This image will be reused in the concept board and as the video keyframe—keep the design strong, memorable, and consistent.';
      }

      var archConceptLoading = document.getElementById('arch-concept-loading');
      var archConceptWrap = document.getElementById('arch-concept-wrap');
      var archConceptImage = document.getElementById('arch-concept-image');
      var archConceptDownload = document.getElementById('arch-concept-download');
      var archFinalLoading = document.getElementById('arch-final-loading');
      var archFinalWrap = document.getElementById('arch-final-wrap');
      var archFinalImage = document.getElementById('arch-final-image');
      var archFinalDownload = document.getElementById('arch-final-download');

      function doGenerate() {
        loadingEl.style.display = 'block';
        resultEl.style.display = 'none';
        generateBtn.disabled = true;
        if (archConceptLoading) archConceptLoading.style.display = 'none';
        if (archConceptWrap) archConceptWrap.style.display = 'none';
        if (archFinalLoading) archFinalLoading.style.display = 'none';
        if (archFinalWrap) archFinalWrap.style.display = 'none';

        var lang = (window.__simsI18n && window.__simsI18n.getLang()) ? window.__simsI18n.getLang() : (document.documentElement.lang || 'ko');
        var hasSheetImage = !!archUploadedImageDataUrl;

        (async function() {
          var pieceTitle = null;
          var bars = window.HANGEUL_ARCHITECTURE.SALUT_DAMOUR_BARS;
          if (hasSheetImage && typeof callGeminiImageToText === 'function' && GEMINI_API_KEY) {
            try {
              pieceTitle = await callGeminiImageToText(archUploadedImageDataUrl,
                'This image is sheet music. Reply with ONLY the piece title and artist in one line, e.g. "Dynamite - BTS". No other text.');
            } catch (e) {
              pieceTitle = null;
            }
          }
          if (hasSheetImage && !pieceTitle) pieceTitle = lang === 'ko' ? '업로드한 악보' : 'Uploaded sheet music';
          var uploadedFileName = midiInput && midiInput.files && midiInput.files[0] ? midiInput.files[0].name : null;
          var titleFromFileName = uploadedFileName ? uploadedFileName.replace(/\.[^.]*$/, '').trim() : null;
          var usedSampleOnly = !uploadedFileName && !hasSheetImage;
          var titleForGrid = pieceTitle || titleFromFileName || (usedSampleOnly ? (lang === 'ko' ? '사랑의 인사 (Salut d\'Amour), Op.12' : 'Salut d\'Amour, Op.12') : (lang === 'ko' ? '업로드한 악보' : 'Uploaded score'));

          if (hasSheetImage && typeof callGeminiSheetMusicJamoAnalysis === 'function' && window.HANGEUL_ARCHITECTURE && window.HANGEUL_ARCHITECTURE.notesToJamoBars && GEMINI_API_KEY) {
            try {
              var analysis = await callGeminiSheetMusicJamoAnalysis(archUploadedImageDataUrl);
              if (analysis && analysis.bars && analysis.bars.length) {
                bars = window.HANGEUL_ARCHITECTURE.notesToJamoBars(analysis.bars, analysis.key);
              }
            } catch (e) {
              console.warn('악보 자모 분석 실패, 샘플 그리드 사용:', e);
            }
          }

          var dataUrl = window.HANGEUL_ARCHITECTURE.generateArchitectureImage(bars, { lang: lang, title: titleForGrid });

          resultImg.src = dataUrl;
          downloadLink.href = dataUrl;
          downloadLink.download = 'hangeul-architecture-grid.png';
          loadingEl.style.display = 'none';
          resultEl.style.display = 'block';
          generateBtn.disabled = false;
          var buildWrap = document.getElementById('magicshop-build-wrap');
          if (buildWrap) {
            buildWrap.style.display = 'block';
            buildWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          if (!GEMINI_API_KEY) {
            return;
          }
          var sheetImageForNano = hasSheetImage ? archUploadedImageDataUrl : null;
          try {
            // [일치성 확보] 5단계 최종 건축물을 먼저 생성 → 컨셉 보드는 이 이미지를 참조하여 동일 건축물로 그림
            if (archFinalLoading) archFinalLoading.style.display = 'block';
            var finalPrompt = buildArchitectureFinalBuildingPrompt(pieceTitle || titleForGrid, hasSheetImage);
            var finalBase64 = await callGeminiImageGeneration(finalPrompt, sheetImageForNano);
            if (archFinalLoading) archFinalLoading.style.display = 'none';
            if (!finalBase64) {
            } else {
              if (archFinalWrap && archFinalImage) {
                archFinalImage.src = 'data:image/png;base64,' + finalBase64;
                archFinalDownload.href = 'data:image/png;base64,' + finalBase64;
                archFinalDownload.download = 'hangeul-architecture-final.png';
                archFinalWrap.style.display = 'block';
              }
              window.__lastArchBuildingImageBase64 = finalBase64;

              // 3단계: 컨셉 디자인 — 최종 건축물 이미지를 참조하여 같은 건축물이 보드에 나오도록
              // (최종 건축물이 성공했을 때만 컨셉 생성 시도)
              try {
                if (archConceptLoading) archConceptLoading.style.display = 'block';
                var conceptPrompt = buildArchitectureConceptDesignPromptFromReference(pieceTitle || titleForGrid, hasSheetImage);
                var conceptBase64 = await callGeminiImageGeneration(conceptPrompt, 'data:image/png;base64,' + finalBase64);
                if (archConceptLoading) archConceptLoading.style.display = 'none';
                if (conceptBase64 && archConceptWrap && archConceptImage) {
                  archConceptImage.src = 'data:image/png;base64,' + conceptBase64;
                  if (archConceptDownload) {
                    archConceptDownload.href = 'data:image/png;base64,' + conceptBase64;
                    archConceptDownload.download = 'hangeul-architecture-concept.png';
                  }
                  archConceptWrap.style.display = 'block';
                }
              } catch (conceptErr) {
                if (archConceptLoading) archConceptLoading.style.display = 'none';
                console.warn('Concept design generation failed, but final building is ready:', conceptErr);
              }
            }
          } catch (err) {
            if (archConceptLoading) archConceptLoading.style.display = 'none';
            if (archFinalLoading) archFinalLoading.style.display = 'none';
          }
        })();
      }

      generateBtn.addEventListener('click', doGenerate);
      if (againBtn) againBtn.addEventListener('click', doGenerate);
    })();

    // Step navigation
    function showLsStep(n) {
      lsState.step = n;
      for (var i = 1; i <= 4; i++) {
        var el = document.getElementById('ls-step-' + i);
        if (el) el.style.display = i === n ? 'block' : 'none';
      }
      document.querySelectorAll('.ls-dot').forEach(function(dot) {
        var s = parseInt(dot.getAttribute('data-ls-step'));
        dot.classList.toggle('active', s <= n);
      });
    }

    // Step 1: Name input
    var nameInput = document.getElementById('ls-name-input');
    var nextBtn1 = document.getElementById('ls-next-1');
    nameInput.addEventListener('input', function() {
      lsState.name = nameInput.value.trim();
      nextBtn1.disabled = lsState.name.length === 0;
    });
    nextBtn1.addEventListener('click', function() { if (lsState.name) showLsStep(2); });

    // Step 2: Color selection
    var nextBtn2 = document.getElementById('ls-next-2');
    var backBtn2 = document.getElementById('ls-back-2');
    document.querySelectorAll('.ls-color-item').forEach(function(item) {
      item.addEventListener('click', function() {
        document.querySelectorAll('.ls-color-item').forEach(function(el) { el.classList.remove('selected'); });
        item.classList.add('selected');
        lsState.color = item.getAttribute('data-color');
        lsState.colorName = item.getAttribute('data-color-name');
        nextBtn2.disabled = false;
      });
    });
    nextBtn2.addEventListener('click', function() { if (lsState.color) showLsStep(3); updateDesignSummary(); });
    backBtn2.addEventListener('click', function() { showLsStep(1); });

    // Step 3: Shape selection
    document.querySelectorAll('.ls-shape-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.ls-shape-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        lsState.shape = btn.getAttribute('data-shape');
        lsState.shapeName = btn.textContent.trim();
        updateDesignSummary();
      });
    });

    // Step 3: Prompt tags
    document.querySelectorAll('.ls-tag-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        btn.classList.toggle('active');
        var textarea = document.getElementById('ls-prompt-input');
        var tag = btn.getAttribute('data-tag');
        var val = textarea.value;
        if (btn.classList.contains('active')) {
          textarea.value = val ? val + ', ' + tag : tag;
        } else {
          textarea.value = val.replace(new RegExp(',?\\s*' + tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), '').replace(/^,\s*/, '');
        }
        lsState.prompt = textarea.value.trim();
        updateDesignSummary();
      });
    });
    document.getElementById('ls-prompt-input').addEventListener('input', function() {
      lsState.prompt = this.value.trim();
      updateDesignSummary();
    });
    document.getElementById('ls-back-3').addEventListener('click', function() { showLsStep(2); });

    function _t(key, fallback) {
      if (window.__simsI18n && window.__simsI18n.t) {
        var val = window.__simsI18n.t(key);
        return val || fallback || '';
      }
      return fallback || '';
    }
    function _lang() {
      return (window.__simsI18n && window.__simsI18n.getLang) ? window.__simsI18n.getLang() : 'ko';
    }

    function updateDesignSummary() {
      var summary = document.getElementById('ls-design-summary');
      var text = document.getElementById('ls-summary-text');
      if (lsState.name || lsState.colorName || lsState.shapeName || lsState.prompt) {
        summary.style.display = 'block';
        var parts = [];
        var isEn = _lang() === 'en';
        if (lsState.name) parts.push((isEn ? 'Name: ' : '이름: ') + lsState.name);
        if (lsState.colorName) parts.push((isEn ? 'Color: ' : '컬러: ') + lsState.colorName);
        if (lsState.shapeName) parts.push((isEn ? 'Shape: ' : '모양: ') + lsState.shapeName);
        if (lsState.prompt) parts.push((isEn ? 'Theme: ' : '테마: ') + lsState.prompt);
        text.textContent = parts.join(' | ');
      }
    }

    // Step 3: Generate
    document.getElementById('ls-generate-btn').addEventListener('click', async function() {
      showLsStep(4);
      document.getElementById('ls-loading').style.display = 'block';
      document.getElementById('ls-result-image-wrap').style.display = 'none';
      document.getElementById('ls-result-title').textContent = _t('lightstick.loading', '✨ AI가 응원봉(기억의 등불)을 빚고 있어요...');
      document.getElementById('ls-result-subtitle').textContent = _t('lightstick.loading_sub', '약 10~30초 정도 소요됩니다');

      var designPrompt = buildLightstickPrompt();
      try {
        var imageData = await callGeminiLightstick(designPrompt);
        if (imageData) {
          var img = document.getElementById('ls-result-image');
          img.src = 'data:image/png;base64,' + imageData;
          img.style.display = 'block';
          document.getElementById('ls-loading').style.display = 'none';
          document.getElementById('ls-result-image-wrap').style.display = 'block';
          var isEn = _lang() === 'en';
          document.getElementById('ls-result-title').textContent = isEn
            ? '🎉 ' + lsState.name + '\'s Lantern of Memory is Ready!'
            : '🎉 ' + lsState.name + '님의 응원봉(기억의 등불) 완성!';
          var shapeDesc = lsState.shapeName ? lsState.shapeName + ' ' : '';
          document.getElementById('ls-result-subtitle').textContent = isEn
            ? lsState.colorName + ' · ' + shapeDesc + 'A lantern shining with your soul'
            : lsState.colorName + ' 컬러 · ' + shapeDesc + '당신의 마음이 머무는 등불';
        } else {
          throw new Error('No image data');
        }
      } catch (err) {
        console.error('Lightstick generation error:', err);
        document.getElementById('ls-loading').style.display = 'none';
        document.getElementById('ls-result-image-wrap').style.display = 'block';
        document.getElementById('ls-result-image').style.display = 'none';
        document.getElementById('ls-result-title').textContent = _lang() === 'en' ? '⚠️ Generation Failed' : '⚠️ 잠시 후 다시 시도해주세요';
        var errDetail = err.message || (_lang() === 'en' ? 'Unknown error' : '알 수 없는 오류');
        if (errDetail.length > 100) errDetail = errDetail.substring(0, 100) + '...';
        document.getElementById('ls-result-subtitle').textContent = errDetail;
      }
    });

    function buildLightstickPrompt() {
      var colorHex = lsState.color;
      var colorName = lsState.colorName;
      var userName = lsState.name;
      var shape = lsState.shape || '';
      var userPrompt = lsState.prompt || '';

      // 모양: 사용자가 선택한 모양 또는 기본 라운드
      var shapeDesc = shape
        ? 'The lantern head/top is shaped like: ' + shape + '.'
        : 'The lantern has an elegant, unique shape designed by the user\'s preference.';

      // 테마/분위기
      var themeDesc = userPrompt
        ? 'User\'s design vision and theme: "' + userPrompt + '". Interpret this creatively and incorporate it into the lantern design, decorations, patterns, and overall mood.'
        : 'The overall design should be elegant, premium, and visually stunning.';

      return 'Generate a single beautiful product photo of a custom decorative lantern, a "Lantern of Memory" (기억의 등불, cheering stick style but more philosophical/artistic).\n\n'
        + 'USER\'S DESIGN CHOICES:\n'
        + '- Name to display: "' + userName + '" — elegantly engraved, illuminated, or embossed on the lantern body\n'
        + '- Primary glow color: ' + colorName + ' (' + colorHex + ') — the lantern emits and glows in this color\n'
        + '- ' + shapeDesc + '\n'
        + '- ' + themeDesc + '\n\n'
        + 'LANTERN STRUCTURE:\n'
        + '- A handheld decorative lantern with a beautiful glowing head on top and a premium grip handle at the bottom\n'
        + '- The head/top part is the main design element (where the shape and glow are)\n'
        + '- Transparent or semi-transparent crystal/glass-like material with inner LED glow, intricate patterns\n'
        + '- The handle should look sleek and premium (metallic, matte black, or matching the theme)\n\n'
        + 'PHOTO STYLE:\n'
        + '- Dark/black studio background to showcase the glowing effect beautifully\n'
        + '- Professional product photography with soft studio lighting\n'
        + '- Single lantern centered in frame, slightly angled for a dynamic look\n'
        + '- Photorealistic, high detail, 4K quality\n\n'
        + 'IMPORTANT: Do NOT include any real brand logos, real artist/group names, or trademarked symbols. '
        + 'This is an original philosophical lantern concept. Focus on the user\'s creative vision.';
    }

    async function callGeminiLightstick(prompt) {
      if (!GEMINI_API_KEY) {
        throw new Error('API 키가 설정되지 않았습니다. config.js를 확인하세요.');
      }
      var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + encodeURIComponent(GEMINI_API_KEY);
      var body = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["image", "text"],
          responseMimeType: "text/plain"
        }
      };
      var resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      var data = await resp.json();
      if (data.error) {
        var errMsg = data.error.message || JSON.stringify(data.error);
        console.error('Gemini API error:', errMsg);
        throw new Error(errMsg);
      }
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        for (var i = 0; i < data.candidates[0].content.parts.length; i++) {
          var part = data.candidates[0].content.parts[i];
          if (part.inlineData && part.inlineData.data) return part.inlineData.data;
        }
      }
      throw new Error('이미지가 생성되지 않았습니다. 다른 프롬프트로 시도해주세요.');
    }

    // Download
    document.getElementById('ls-download-btn').addEventListener('click', function() {
      var img = document.getElementById('ls-result-image');
      if (!img.src || img.src === window.location.href) return;
      var a = document.createElement('a');
      a.href = img.src;
      a.download = 'borahae-lightstick-' + lsState.name + '.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    // Share — copy to clipboard + show community links
    document.getElementById('ls-share-btn').addEventListener('click', async function() {
      var img = document.getElementById('ls-result-image');
      var linksDiv = document.getElementById('ls-community-links');
      if (!img.src || img.src === window.location.href) return;

      // Toggle community links
      if (linksDiv.style.display === 'none') {
        linksDiv.style.display = 'block';
        this.textContent = _lang() === 'en' ? '✅ Links opened!' : '✅ 함께 응원해요!';
      } else {
        linksDiv.style.display = 'none';
        this.textContent = _t('lightstick.modal_step4_share', '📤 커뮤니티 공유');
        return;
      }

      // Also try to copy image to clipboard
      try {
        var resp = await fetch(img.src);
        var blob = await resp.blob();
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      } catch (e) {
        // clipboard copy failed silently, user can still download manually
      }
    });

    // Retry
    document.getElementById('ls-retry-btn').addEventListener('click', function() {
      showLsStep(3);
    });
  })();

  // Shop category toggle functionality
  (function() {
    var shopCatBtns = document.querySelectorAll('.shop-cat-btn');
    var shopCatBlocks = document.querySelectorAll('.shop-cat-block');
    var boratimeSection = document.getElementById('boratime');
    
    // Initialize: Hide all shop-cat-blocks, show boratime
    shopCatBlocks.forEach(function(block) {
      block.classList.remove('active');
    });
    
    // Set boratime button as active by default
    var boratimeBtn = document.querySelector('.shop-cat-btn[href="#boratime"]');
    if (boratimeBtn) {
      boratimeBtn.classList.add('active');
    }
    
    // Handle button clicks
    shopCatBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var targetId = this.getAttribute('href');
        
        if (targetId === '#boratime') {
          // Handle boratime section (it's not a shop-cat-block)
          shopCatBlocks.forEach(function(block) {
            block.classList.remove('active');
          });
          shopCatBtns.forEach(function(b) {
            b.classList.remove('active');
          });
          this.classList.add('active');
          
          // Scroll to boratime section
          if (boratimeSection) {
            boratimeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          // Handle shop-cat-block sections
          var targetBlock = document.querySelector(targetId);
          
          if (targetBlock && targetBlock.classList.contains('shop-cat-block')) {
            // Toggle the clicked block
            var isActive = targetBlock.classList.contains('active');
            
            // Close all blocks first
            shopCatBlocks.forEach(function(block) {
              block.classList.remove('active');
            });
            
            // Remove active class from all buttons
            shopCatBtns.forEach(function(b) {
              b.classList.remove('active');
            });
            
            // If it wasn't active, open it
            if (!isActive) {
              targetBlock.classList.add('active');
              this.classList.add('active');
              
              // Scroll to the opened section
              setTimeout(function() {
                targetBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            } else {
              // If it was active, close it and show boratime instead
              if (boratimeBtn) {
                boratimeBtn.classList.add('active');
                if (boratimeSection) {
                  boratimeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            }
          }
        }
      });
    });
  })();

  // 소아베 히어로 비디오 — 순차 자동재생 + 좌우 네비게이션 (ani_soave 65개 + ani_han 5개)
  (function() {
    var video = document.getElementById('soave-hero-video');
    var overlay = document.getElementById('soave-video-overlay');
    var counter = document.getElementById('soave-video-counter');
    var muteBtn = document.getElementById('soave-mute-btn');
    var prevBtn = document.getElementById('soave-nav-prev');
    var nextBtn = document.getElementById('soave-nav-next');
    if (!video) return;

    var videoPool = [];
    var i;
    for (i = 1; i <= 65; i++) videoPool.push('image/soave/ani/ani_soave/ (' + i + ').mp4');
    for (i = 1; i <= 4; i++) videoPool.push('image/soave/ani/ani_han/2 (' + i + ').mp4');
    var totalVideos = videoPool.length;

    // 셔플된 재생 순서 생성
    var playOrder = [];
    function shuffleOrder() {
      playOrder = [];
      for (var j = 0; j < totalVideos; j++) playOrder.push(j);
      for (var k = playOrder.length - 1; k > 0; k--) {
        var r = Math.floor(Math.random() * (k + 1));
        var tmp = playOrder[k]; playOrder[k] = playOrder[r]; playOrder[r] = tmp;
      }
    }
    shuffleOrder();
    var playPos = 0;

    function loadVideoAt(pos) {
      if (pos < 0) pos = totalVideos - 1;
      if (pos >= totalVideos) { shuffleOrder(); pos = 0; }
      playPos = pos;
      var poolIdx = playOrder[playPos];
      video.style.opacity = '0';
      if (overlay) overlay.style.opacity = '1';
      video.src = videoPool[poolIdx];
      if (counter) counter.textContent = (playPos + 1) + ' / ' + totalVideos;
      video.load();
    }

    function nextVideo() { loadVideoAt(playPos + 1); }
    function prevVideo() { loadVideoAt(playPos - 1); }

    video.addEventListener('canplay', function() {
      video.style.opacity = '1';
      video.play().catch(function() {});
      setTimeout(function() {
        if (overlay) overlay.style.opacity = '0';
      }, 80);
    });

    video.addEventListener('ended', function() {
      nextVideo();
    });

    video.addEventListener('error', function() {
      setTimeout(nextVideo, 300);
    });

    if (prevBtn) prevBtn.addEventListener('click', function() { prevVideo(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { nextVideo(); });

    if (muteBtn) {
      muteBtn.addEventListener('click', function() {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
        muteBtn.title = video.muted ? '소리 켜기' : '소리 끄기';
      });
    }

    loadVideoAt(0);
  })();

  console.log('BORAHAE loaded successfully!');
})();
