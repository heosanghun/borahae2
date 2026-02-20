// BORAHAE - Main JavaScript

(function() {
  'use strict';

  // ========================================
  // API Keys (.env → config.js 에서 주입)
  // ========================================
  const GEMINI_API_KEY = (typeof window !== 'undefined' && window.__SIMS_GEMINI_KEY__) || '';
  if (typeof window !== 'undefined') window.__hasGeminiApiKey = !!GEMINI_API_KEY;
  const OPENAI_API_KEY = (typeof window !== 'undefined' && window.__SIMS_OPENAI_KEY__) || '';

  // 영상 생성 중 비차단 플로팅 알림 (페이지 이용 가능)
  function showVideoGeneratingToast() {
    var el = document.getElementById('video-generating-toast');
    if (el) el.classList.add('visible');
  }
  function hideVideoGeneratingToast() {
    var el = document.getElementById('video-generating-toast');
    if (el) el.classList.remove('visible');
  }

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

  function openMyPageModal() {
    var m = document.getElementById('mypage-modal');
    if (!m) return;
    var sb = getSupabase();
    if (!sb) {
      alert('Supabase가 설정되지 않았습니다.');
      return;
    }
    sb.auth.getSession().then(function(res) {
      var user = res.data.session && res.data.session.user ? res.data.session.user : null;
      if (!user) {
        openAuthModal('login');
        return;
      }
      var emailEl = document.getElementById('mypage-email');
      var createdEl = document.getElementById('mypage-created');
      if (emailEl) emailEl.textContent = user.email || '-';
      if (createdEl) {
        var created = user.created_at;
        createdEl.textContent = created ? new Date(created).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-';
      }
      var isEmailUser = user.app_metadata && user.app_metadata.provider === 'email';
      var pwSection = document.getElementById('mypage-password-section');
      var pwHint = pwSection ? pwSection.querySelector('.mypage-hint') : null;
      var pwForm = document.getElementById('mypage-password-form');
      if (pwSection) {
        if (isEmailUser) {
          pwSection.style.display = '';
          if (pwHint) pwHint.style.display = 'none';
          if (pwForm) pwForm.style.display = '';
        } else {
          pwSection.style.display = '';
          if (pwHint) pwHint.style.display = '';
          if (pwForm) pwForm.style.display = 'none';
        }
      }
      var leavePwWrap = document.getElementById('mypage-leave-password-wrap');
      if (leavePwWrap) leavePwWrap.style.display = isEmailUser ? '' : 'none';
      m.classList.add('open');
      m.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMyPageModal() {
    var m = document.getElementById('mypage-modal');
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

  // ========================================
  // 이메일로 결과 발송 (로그인 회원 메일 수신)
  // ========================================
  /** 현재 로그인한 회원의 ID (멤버십 체크용). 없으면 null */
  function getCurrentUserId() {
    var sb = getSupabase();
    if (!sb) return Promise.resolve(null);
    return sb.auth.getSession().then(function (res) {
      var user = res.data.session && res.data.session.user ? res.data.session.user : null;
      return (user && user.id) ? user.id : null;
    }).catch(function () { return null; });
  }

  /** 현재 로그인한 회원의 이메일. 없으면 null */
  function getCurrentUserEmail() {
    var sb = getSupabase();
    if (!sb) return Promise.resolve(null);
    return sb.auth.getSession().then(function(res) {
      var user = res.data.session && res.data.session.user ? res.data.session.user : null;
      return (user && user.email) ? user.email : null;
    }).catch(function() { return null; });
  }

  /**
   * 서비스 결과를 로그인한 회원 이메일로 발송.
   * @param {Object} opts - { serviceId: string, serviceName: string, subject: string, htmlBody: string, textBody?: string }
   * @returns {Promise<{ ok: boolean, error?: string }>}
   */
  function sendResultByEmail(opts) {
    var sb = getSupabase();
    if (!sb) return Promise.resolve({ ok: false, error: '연결할 수 없습니다.' });
    return getCurrentUserEmail().then(function(email) {
      if (!email) return { ok: false, error: 'login_required' };
      function normalizeEmailError(msg) {
        if (!msg || typeof msg !== 'string') return '이메일 발송에 실패했어요.';
        if (/edge function|failed to send a request|fetch failed|network|404|502|503/i.test(msg)) {
          return '이메일 발송 서버에 연결할 수 없습니다. Edge Function이 배포되지 않았을 수 있어요. 잠시 후 다시 시도해 주세요.';
        }
        return msg;
      }
      return sb.functions.invoke('send-result-email', {
        body: {
          serviceId: opts.serviceId || 'unknown',
          serviceName: opts.serviceName || '보라해 서비스',
          subject: opts.subject || '보라해 결과',
          htmlBody: opts.htmlBody || '',
          textBody: opts.textBody || ''
        }
      }).then(function(res) {
        if (res.error) return { ok: false, error: normalizeEmailError(res.error.message || res.error) };
        if (res.data && res.data.error) return { ok: false, error: normalizeEmailError(res.data.error) };
        if (res.data && res.data.message) return { ok: false, error: normalizeEmailError(res.data.message) };
        return { ok: true };
      }).catch(function(err) {
        var msg = (err && err.message) ? err.message : '발송 실패';
        return { ok: false, error: normalizeEmailError(msg) };
      });
    });
  }

  /** 로그인 필요 시 모달 열기. callback(email) 또는 로그인 유도 */
  function ensureLoggedInForEmail(callback) {
    getCurrentUserEmail().then(function(email) {
      if (email && typeof callback === 'function') callback(email);
      else {
        openAuthModal('login');
        alert('로그인하면 결과를 이메일로 받을 수 있어요.');
      }
    });
  }

  window.getCurrentUserEmail = getCurrentUserEmail;
  window.sendResultByEmail = sendResultByEmail;
  window.ensureLoggedInForEmail = ensureLoggedInForEmail;

  document.getElementById('nav-login-btn') && document.getElementById('nav-login-btn').addEventListener('click', function() {
    openAuthModal('login');
  });
  document.getElementById('nav-logout-btn') && document.getElementById('nav-logout-btn').addEventListener('click', function() {
    var sb = getSupabase();
    if (sb) sb.auth.signOut();
  });
  document.getElementById('nav-mypage-btn') && document.getElementById('nav-mypage-btn').addEventListener('click', function() {
    openMyPageModal();
  });
  document.getElementById('auth-modal-close') && document.getElementById('auth-modal-close').addEventListener('click', closeAuthModal);
  document.getElementById('auth-modal') && document.getElementById('auth-modal').addEventListener('click', function(e) {
    if (e.target === this) closeAuthModal();
  });
  document.getElementById('mypage-modal-close') && document.getElementById('mypage-modal-close').addEventListener('click', closeMyPageModal);
  document.getElementById('mypage-modal') && document.getElementById('mypage-modal').addEventListener('click', function(e) {
    if (e.target.id === 'mypage-modal') closeMyPageModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var mp = document.getElementById('mypage-modal');
      if (mp && mp.classList.contains('open')) closeMyPageModal();
    }
  });

  document.getElementById('auth-tab-login') && document.getElementById('auth-tab-login').addEventListener('click', function() {
    openAuthModal('login');
  });
  document.getElementById('auth-tab-signup') && document.getElementById('auth-tab-signup').addEventListener('click', function() {
    openAuthModal('signup');
  });

  // 전역 배경음(BGM) – music 폴더 MP3 6곡 무한 루프
  (function() {
    var audio = document.getElementById('global-bgm');
    var btn = document.getElementById('bgm-toggle');
    var lyricsBtn = document.getElementById('bgm-lyrics-btn');
    if (!audio || !btn) return;
    var BGM_CANDIDATES = (typeof window !== 'undefined' && window.BGM_PLAYLIST && window.BGM_PLAYLIST.length)
      ? window.BGM_PLAYLIST
      : ['music/보라빛 신호.mp3', 'music/LOVE ARMY.mp3', 'music/lovearmy1.mp3', 'music/lovearmy2.mp3', 'music/lovearmy3.mp3', 'music/lovearmy4.mp3'];
    var currentBgmIndex = 0;
    var STORAGE_KEY = 'borahae_bgm_on';
    audio.volume = 0.25;

    var BGM_LYRICS = '[인트로]\n(Verse 1)\n거울 속 달라진 내 모습 (My Style)\nAI가 찾아준 나만의 빛깔 (Color)\n수많은 별들 중 가장 빛나는\n너와 나 연결될 시간이야\n(Pre-Chorus)\n화면 너머 전해지는 떨림\n우리가 만든 이 공간 (This Fan Life)\n서로의 맘을 입고, 꿈을 공유해\n(Oh, shining bright)\n(Chorus)\nBorahae, I Purple You\n무지개 마지막 색깔처럼\n끝까지 함께할 믿음의 약속\n이 보라빛 세상 속에서 (In this world)\n우린 서로의 우주가 돼\nTrust you, love you, forevermore\nBorahae.\n(Bridge)\n어떤 모습이라도 괜찮아\n여기선 우린 하나니까\n빛나는 응원봉 물결처럼\n영원히 널 비출게 Our Purple Signal...\n(I trust you, I love you)\n보라해.';

    function showBgmLyricsAnyway() {
      var modal = document.getElementById('bgm-lyrics-modal');
      var textEl = document.getElementById('bgm-lyrics-text');
      if (modal && textEl) {
        textEl.textContent = BGM_LYRICS;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    function updateBtn() {
      var on = !audio.paused;
      btn.textContent = on ? 'BGM 끄기' : 'BGM 듣기';
      btn.setAttribute('aria-label', on ? '배경음 끄기' : '배경음 듣기');
      btn.title = on ? '배경음 끄기' : '배경음 듣기';
      try { localStorage.setItem(STORAGE_KEY, on ? '1' : '0'); } catch (e) {}
    }

    function playTrackAtIndex(idx) {
      if (idx < 0 || idx >= BGM_CANDIDATES.length) return;
      currentBgmIndex = idx;
      var src = BGM_CANDIDATES[idx];
      audio.src = src;
      audio.load();
      audio.play().then(function() { updateBtn(); }).catch(function() {
        updateBtn();
        tryNextOnError();
      });
    }

    function playNextInPlaylist() {
      var next = (currentBgmIndex + 1) % BGM_CANDIDATES.length;
      playTrackAtIndex(next);
    }

    function tryNextOnError() {
      var next = currentBgmIndex + 1;
      if (next >= BGM_CANDIDATES.length) {
        audio.removeAttribute('src');
        if (typeof window !== 'undefined' && window.alert) {
          window.alert('BGM 음원을 불러올 수 없습니다.\n\nmusic 폴더에 MP3 파일을 넣은 뒤 새로고침해 주세요.');
        }
        showBgmLyricsAnyway();
        updateBtn();
        return;
      }
      playTrackAtIndex(next);
    }

    audio.addEventListener('ended', function() {
      playNextInPlaylist();
    });

    audio.addEventListener('error', function() {
      updateBtn();
      tryNextOnError();
    });

    btn.addEventListener('click', function() {
      if (audio.paused) {
        if (!audio.src || audio.src === window.location.href) {
          playTrackAtIndex(0);
        } else {
          audio.play().then(function() { updateBtn(); }).catch(function() { updateBtn(); });
        }
      } else {
        audio.pause();
        updateBtn();
      }
    });
    audio.addEventListener('play', updateBtn);
    audio.addEventListener('pause', updateBtn);
    try {
      // BGM 자동 재생 제거: 새로고침 시 음원 없을 때 알림이 뜨지 않도록 함
    } catch (e) {}
    updateBtn();

    var bgmLyricsModal = document.getElementById('bgm-lyrics-modal');
    var bgmLyricsClose = document.getElementById('bgm-lyrics-modal-close');
    var bgmLyricsText = document.getElementById('bgm-lyrics-text');
    var bgmLyricsScrollWrap = document.getElementById('bgm-lyrics-scroll-wrap');
    var bgmScrollInterval = null;
    function startBgmLyricsScroll() {
      if (!bgmLyricsScrollWrap || !bgmLyricsModal.classList.contains('active') || audio.paused) return;
      bgmLyricsScrollWrap.classList.add('bgm-lyrics-scroll--on');
      if (bgmScrollInterval) return;
      bgmScrollInterval = setInterval(function() {
        if (audio.paused || !bgmLyricsModal.classList.contains('active')) {
          clearInterval(bgmScrollInterval);
          bgmScrollInterval = null;
          if (bgmLyricsScrollWrap) bgmLyricsScrollWrap.classList.remove('bgm-lyrics-scroll--on');
          return;
        }
        var wrap = bgmLyricsScrollWrap;
        var max = wrap.scrollHeight - wrap.clientHeight;
        if (max <= 0) return;
        wrap.scrollTop += 0.6;
        if (wrap.scrollTop >= max - 2) wrap.scrollTop = 0;
      }, 80);
    }
    function stopBgmLyricsScroll() {
      if (bgmScrollInterval) {
        clearInterval(bgmScrollInterval);
        bgmScrollInterval = null;
      }
      if (bgmLyricsScrollWrap) bgmLyricsScrollWrap.classList.remove('bgm-lyrics-scroll--on');
    }
    function closeBgmLyrics() {
      bgmLyricsModal.classList.remove('active');
      bgmLyricsModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      stopBgmLyricsScroll();
    }
    if (lyricsBtn && bgmLyricsModal && bgmLyricsText) {
      if (bgmLyricsText) bgmLyricsText.textContent = BGM_LYRICS;
      lyricsBtn.addEventListener('click', function() {
        bgmLyricsModal.classList.add('active');
        bgmLyricsModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (bgmLyricsScrollWrap) bgmLyricsScrollWrap.scrollTop = 0;
        startBgmLyricsScroll();
      });
      if (bgmLyricsClose) bgmLyricsClose.addEventListener('click', closeBgmLyrics);
      bgmLyricsModal.addEventListener('click', function(e) { if (e.target === bgmLyricsModal) closeBgmLyrics(); });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bgmLyricsModal.classList.contains('active')) closeBgmLyrics();
      });
      audio.addEventListener('play', function() {
        if (bgmLyricsModal.classList.contains('active')) startBgmLyricsScroll();
      });
      audio.addEventListener('pause', stopBgmLyricsScroll);
    }
  })();

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

  // Google 로그인 (Supabase OAuth)
  (function() {
    var btn = document.getElementById('auth-google-btn');
    var errEl = document.getElementById('auth-login-error');
    if (!btn) return;
    btn.addEventListener('click', function() {
      var sb = getSupabase();
      if (!sb) {
        if (errEl) errEl.textContent = '연결 중... 잠시만 기다려 주세요.';
        waitForSupabase(function(s) {
          if (errEl) errEl.textContent = '';
          if (s) doGoogleLogin(s);
          else if (errEl) errEl.textContent = 'Supabase 연결에 실패했습니다. 페이지를 새로고침해 주세요.';
        });
        return;
      }
      doGoogleLogin(sb);
    });
    function doGoogleLogin(sb) {
      if (errEl) errEl.textContent = '';
      var redirectTo = window.location.origin + window.location.pathname + (window.location.search || '') + (window.location.hash || '');
      sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectTo }
      }).then(function(res) {
        if (res.error) {
          if (errEl) errEl.textContent = res.error.message || 'Google 로그인에 실패했습니다.';
        }
      }).catch(function(err) {
        if (errEl) errEl.textContent = err.message || 'Google 로그인에 실패했습니다.';
      });
    }
  })();

  // 마이페이지: 비밀번호 변경, 회원 탈퇴
  (function initMyPage() {
    var pwForm = document.getElementById('mypage-password-form');
    var leaveForm = document.getElementById('mypage-leave-form');
    var _t = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t : function(k, d) { return d || k; };
    if (pwForm) {
      pwForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var newPw = document.getElementById('mypage-new-password');
        var newPwConfirm = document.getElementById('mypage-new-password-confirm');
        var errEl = document.getElementById('mypage-password-error');
        var pw = newPw ? newPw.value : '';
        var pwConfirm = newPwConfirm ? newPwConfirm.value : '';
        if (!pw || pw.length < 6) {
          if (errEl) errEl.textContent = _t('mypage.pw_min_err', '비밀번호는 6자 이상이어야 합니다.');
          return;
        }
        if (pw !== pwConfirm) {
          if (errEl) errEl.textContent = _t('mypage.pw_mismatch', '비밀번호가 일치하지 않습니다.');
          return;
        }
        if (errEl) errEl.textContent = '';
        var sb = getSupabase();
        if (!sb) { if (errEl) errEl.textContent = '연결 중...'; return; }
        sb.auth.updateUser({ password: pw }).then(function(res) {
          if (res.error) {
            if (errEl) errEl.textContent = res.error.message || _t('mypage.pw_change_fail', '비밀번호 변경에 실패했습니다.');
            return;
          }
          if (errEl) errEl.textContent = '';
          alert(_t('mypage.pw_change_success', '비밀번호가 변경되었습니다.'));
          if (newPw) newPw.value = '';
          if (newPwConfirm) newPwConfirm.value = '';
        }).catch(function(err) {
          if (errEl) errEl.textContent = err.message || _t('mypage.pw_change_fail', '비밀번호 변경에 실패했습니다.');
        });
      });
    }
    if (leaveForm) {
      leaveForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var confirmInput = document.getElementById('mypage-leave-confirm');
        var leavePw = document.getElementById('mypage-leave-password');
        var errEl = document.getElementById('mypage-leave-error');
        var confirmText = confirmInput ? confirmInput.value.trim() : '';
        var expectedText = _t('mypage.leave_confirm_placeholder', '탈퇴');
        if (confirmText !== expectedText) {
          if (errEl) errEl.textContent = _t('mypage.leave_confirm_err', '\'탈퇴\'를 정확히 입력해 주세요.');
          return;
        }
        var sb = getSupabase();
        if (!sb) { if (errEl) errEl.textContent = '연결 중...'; return; }
        sb.auth.getSession().then(function(res) {
          var session = res.data.session;
          var user = session && session.user ? session.user : null;
          if (!user || !session.access_token) {
            if (errEl) errEl.textContent = _t('mypage.login_required', '로그인이 필요합니다.');
            return;
          }
          var isEmailUser = user.app_metadata && user.app_metadata.provider === 'email';
          if (isEmailUser && leavePw && leavePw.value) {
            sb.auth.signInWithPassword({ email: user.email, password: leavePw.value }).then(function(verifyRes) {
              if (verifyRes.error) {
                if (errEl) errEl.textContent = _t('mypage.pw_wrong', '비밀번호가 올바르지 않습니다.');
                return;
              }
              var tok = verifyRes.data.session && verifyRes.data.session.access_token ? verifyRes.data.session.access_token : session.access_token;
              doAccountDelete(tok, errEl);
            }).catch(function() {
              if (errEl) errEl.textContent = _t('mypage.pw_wrong', '비밀번호가 올바르지 않습니다.');
            });
          } else if (isEmailUser) {
            if (errEl) errEl.textContent = _t('mypage.pw_required', '탈퇴 확인을 위해 비밀번호를 입력해 주세요.');
          } else {
            doAccountDelete(session.access_token, errEl);
          }
        });
      });
    }
    function doAccountDelete(accessToken, errEl) {
      if (errEl) errEl.textContent = '';
      fetch('/api/account-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken }
      }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.error && data.error.message) {
          if (errEl) errEl.textContent = data.error.message;
          return;
        }
        closeMyPageModal();
        var sb = getSupabase();
        if (sb) sb.auth.signOut();
        alert(_t('mypage.leave_success', '회원 탈퇴가 완료되었습니다.'));
      }).catch(function(err) {
        if (errEl) errEl.textContent = err.message || _t('mypage.leave_fail', '탈퇴 처리 중 오류가 발생했습니다.');
      });
    }
  })();

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
  // 7컬러 → 한글 소모오 캐릭터 1명 (image/name/ja = 자음, image/name/mo = 모음 경로 적용)
  const COLOR_TO_HANGUL = {
    red:    { name: '초롱', nameEn: 'ChoLong', role: '댄서', roleEn: 'Dancer', message: '열정과 리듬이 있는 너에게 어울리는 친구예요. 춤처럼 에너지를 발산해 보세요.', messageEn: 'A friend who matches your passion and rhythm. Let your energy out like dance.', image: 'image/name/ja/cholong.png' },
    orange: { name: '오롱', nameEn: 'OhLong', role: '웃음꽃', roleEn: 'Joy', message: '따뜻하고 유쾌한 무드에 잘 맞는 친구예요. 밝은 웃음으로 주변을 환하게 만들어 보세요.', messageEn: 'A friend who fits your warm, cheerful mood. Brighten the day with a smile.', image: 'image/name/ja/olong.png' },
    yellow: { name: '노롱', nameEn: 'NoLong', role: '가수', roleEn: 'Singer', message: '밝고 활기찬 에너지가 넘치는 친구예요. 무대 위에서 빛나듯 표현해 보세요.', messageEn: 'A friend full of bright energy. Shine through expression, like on stage.', image: 'image/name/ja/nolong.png' },
    green:  { name: '어롱', nameEn: 'EoLong', role: '정원사', roleEn: 'Gardener', message: '달콤하고 설레는 무드와 잘 맞아요. 꽃처럼 성장하고 꽃피우는 일을 찾아 보세요.', messageEn: 'A friend who matches your sweet, hopeful mood. Find what makes you bloom.', image: 'image/name/mo/어롱_draphed_01_896x1200.png' },
    blue:   { name: '으롱', nameEn: 'EuLong', role: '명상가', roleEn: 'Meditator', message: '시원하고 청량한 마음에 어울리는 친구예요. 평정심을 잃지 않고 중심을 잡아 보세요.', messageEn: 'A friend who fits your cool, calm mind. Keep your center and stay grounded.', image: 'image/name/mo/으롱_draphed_01_896x1200.png' },
    indigo: { name: '소롱', nameEn: 'SoLong', role: '시인', roleEn: 'Poet', message: '깊고 예술적인 감성에 잘 맞는 친구예요. 세상을 시어로 번역해 보세요.', messageEn: 'A friend who fits your deep, artistic soul. Translate the world into your words.', image: 'image/name/ja/solong.png' },
    violet: { name: '예롱', nameEn: 'YehLong', role: '연주가', roleEn: 'Musician', message: '감성과 위로가 담긴 무드에 어울려요. 음악처럼 마음을 나눠 보세요.', messageEn: 'A friend who fits your emotional, comforting mood. Share your heart like music.', image: 'image/name/mo/예롱_draphed_01_896x1200.png' }
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
    var s = seasonString.trim().toLowerCase();
    if (PERSONAL_COLOR_TO_7COLOR[seasonString.trim()]) return PERSONAL_COLOR_TO_7COLOR[seasonString.trim()].primary;
    if (s.indexOf('봄') !== -1 || s.indexOf('spring') !== -1) return 'yellow';
    if (s.indexOf('여름') !== -1 || s.indexOf('summer') !== -1) return 'blue';
    if (s.indexOf('가을') !== -1 || s.indexOf('autumn') !== -1 || s.indexOf('fall') !== -1) return 'red';
    if (s.indexOf('겨울') !== -1 || s.indexOf('winter') !== -1) return 'violet';
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
  // Polar 결제: 멤버십 Purple/VIP 버튼 → Checkout
  // ========================================
  document.querySelectorAll('.membership-checkout-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var productId = (btn.getAttribute('data-plan') === 'vip' && typeof window.__POLAR_VIP_PRODUCT_ID__ === 'string' && window.__POLAR_VIP_PRODUCT_ID__)
        ? window.__POLAR_VIP_PRODUCT_ID__
        : (btn.getAttribute('data-product-id') || 'ab0e92a7-a0bf-4572-9373-514707f58439');
      btn.disabled = true;
      btn.textContent = (typeof __t === 'function' ? __t('membership.checkout_loading') : null) || '결제 페이지로 이동 중...';
      var payload = { productId: productId, successUrl: window.location.origin + '/#membership?checkout=success' };
      var sb = getSupabase();
      if (sb) {
        sb.auth.getSession().then(function (res) {
          var user = res.data.session && res.data.session.user ? res.data.session.user : null;
          if (user && user.id) payload.externalCustomerId = user.id;
          doPolarCheckout(btn, payload);
        }).catch(function () { doPolarCheckout(btn, payload); });
      } else {
        doPolarCheckout(btn, payload);
      }
    });
  });
  function doPolarCheckout(btn, payload) {
    fetch('/api/polar-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        return r.text().then(function (text) {
          if (r.status === 404) {
            throw new Error('결제 API를 찾을 수 없습니다. npm run dev 로 로컬 서버를 실행해 주세요.');
          }
          try {
            return JSON.parse(text);
          } catch (e) {
            throw new Error(text || '서버 응답을 처리할 수 없습니다.');
          }
        });
      })
      .then(function (data) {
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error && data.error.message ? data.error.message : '결제 세션을 만들 수 없습니다.');
          btn.disabled = false;
          var k = btn.getAttribute('data-i18n');
          btn.textContent = (window.__simsI18n && window.__simsI18n.t && k) ? window.__simsI18n.t(k) : (k === 'membership.btn_vip' ? 'VIP 시작' : 'Purple 시작');
        }
      })
      .catch(function (err) {
        alert(err.message || '결제 연결에 실패했습니다. POLAR_ACCESS_TOKEN 설정을 확인해 주세요.');
        btn.disabled = false;
        var k = btn.getAttribute('data-i18n');
        btn.textContent = (window.__simsI18n && window.__simsI18n.t && k) ? window.__simsI18n.t(k) : (k === 'membership.btn_vip' ? 'VIP 시작' : 'Purple 시작');
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
  // 연예인 룩 → 유사 옷 검색 (Lookbook 상단, 참고: kpop.fit)
  // ========================================
  function initCeleblook() {
    var celeblookInput = document.getElementById('celeblook-input');
    var celeblookMoodChips = document.getElementById('celeblook-mood-chips');
    var celeblookDropzone = document.getElementById('celeblook-dropzone');
    var celeblookUploadWrap = document.getElementById('celeblook-upload-wrap');
    var celeblookLoading = document.getElementById('celeblook-loading');
    var celeblookResult = document.getElementById('celeblook-result');
    var celeblookResultPreview = document.getElementById('celeblook-result-preview');
    var celeblookSummaryText = document.getElementById('celeblook-summary-text');
    var celeblookStyleTags = document.getElementById('celeblook-style-tags');
    var celeblookItemCards = document.getElementById('celeblook-item-cards');
    var celeblookCopyAll = document.getElementById('celeblook-copy-all');
    var celeblookRetry = document.getElementById('celeblook-retry');
    if (!celeblookDropzone && !celeblookInput) return;

    var OUTFIT_PROMPT_BASE = '이 사진에 나온 옷차림(룩)을 분석해주세요. '
      + '1) 한 문장 요약(summary), 2) 스타일 태그 2~4개(styleTags), 3) 쇼핑 검색용 **한국어** 키워드(형태·소재·디테일 중심, 브랜드/모델명 제외)를 추출해주세요. '
      + '아래 JSON 형식으로만 답하고 다른 설명은 하지 마세요. 보이지 않는 항목은 빈 문자열 "" 또는 빈 배열 []로 두세요.\n'
      + '{"summary":"한 문장 요약","styleTags":["캐주얼","스트릿"],"상의":"키워드","하의":"키워드","신발":"키워드","가방":"키워드","액세서리":"키워드"}';

    function showCeleblookState(which) {
      if (celeblookUploadWrap) celeblookUploadWrap.style.display = which === 'upload' ? 'block' : 'none';
      if (celeblookLoading) celeblookLoading.style.display = which === 'loading' ? 'block' : 'none';
      if (celeblookResult) celeblookResult.style.display = which === 'result' ? 'block' : 'none';
    }

    function parseOutfitJson(text) {
      var keys = ['상의', '하의', '신발', '가방', '액세서리'];
      var result = { summary: '', styleTags: [] };
      keys.forEach(function (k) { result[k] = ''; });

      try {
        var jsonStr = text.replace(/```json?\s*|\s*```/g, '').trim();
        var parsed = JSON.parse(jsonStr);
        if (parsed.summary != null) result.summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : '';
        if (Array.isArray(parsed.styleTags)) result.styleTags = parsed.styleTags.filter(function (t) { return t && String(t).trim(); }).map(function (t) { return String(t).trim(); });
        keys.forEach(function (k) { result[k] = (parsed[k] && String(parsed[k]).trim()) ? String(parsed[k]).trim() : ''; });
        return result;
      } catch (e) {
        keys.forEach(function (key) {
          var re = new RegExp('"' + key + '"\\s*:\\s*"([^"]*)"');
          var m = text.match(re);
          result[key] = (m && m[1]) ? m[1].trim() : '';
        });
        var summaryMatch = text.match(/"summary"\s*:\s*"([^"]*)"/);
        if (summaryMatch) result.summary = summaryMatch[1].trim();
        var tagsMatch = text.match(/"styleTags"\s*:\s*\[([^\]]*)\]/);
        if (tagsMatch) result.styleTags = (tagsMatch[1].match(/"([^"]+)"/g) || []).map(function (s) { return s.replace(/^"|"$/g, ''); });
        return result;
      }
    }

    function buildSearchQuery(obj) {
      var parts = [];
      ['상의', '하의', '신발', '가방', '액세서리'].forEach(function (k) {
        if (obj[k] && obj[k].trim()) parts.push(obj[k].trim());
      });
      return parts.join(' ').trim() || '패션 코디';
    }

    function allKeywordText(obj) {
      var parts = [];
      ['상의', '하의', '신발', '가방', '액세서리'].forEach(function (k) {
        if (obj[k] && obj[k].trim()) parts.push(obj[k].trim());
      });
      return parts.join(' ');
    }

    var lastCeleblookParsed = null;

    function renderSummary(summary) {
      if (celeblookSummaryText) celeblookSummaryText.textContent = summary || '';
    }

    function renderStyleTags(tags) {
      if (!celeblookStyleTags) return;
      celeblookStyleTags.innerHTML = (Array.isArray(tags) && tags.length) ? tags.map(function (t) { return '<span class="celeblook-tag-chip">' + t + '</span>'; }).join('') : '';
    }

    function parseKeywords(str) {
      if (!str || !str.trim()) return [];
      return str.split(/[,，\s]+/).map(function (s) { return s.trim(); }).filter(Boolean);
    }

    function getNaverSearchUrl(query) {
      return 'https://search.shopping.naver.com/search/all?query=' + encodeURIComponent(query);
    }
    function getMusinsaSearchUrl(query) {
      return 'https://www.musinsa.com/search/musinsa/integration?q=' + encodeURIComponent(query);
    }
    function getCoupangSearchUrl(query) {
      return 'https://www.coupang.com/np/search?q=' + encodeURIComponent(query);
    }

    /* 카테고리별 5개씩 다른 이미지 (원래 방식). 단, 민소매/데님 2곳만 제목에 맞게 교체 */
    var CATEGORY_IMAGES = {
      '상의': [
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop'
      ],
      '하의': [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=80&h=80&fit=crop'
      ],
      '신발': [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=80&h=80&fit=crop'
      ],
      '가방': [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=80&h=80&fit=crop'
      ],
      '액세서리': [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60608?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=80&h=80&fit=crop',
        'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=80&h=80&fit=crop'
      ]
    };
    var FIX_민소매 = 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=80&h=80&fit=crop';
    var FIX_데님 = 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=80&h=80&fit=crop';

    function buildProductPreviewCards(keywords, naverUrl, t, esc, category) {
      var samples = [
        { name: keywords + ' 여성 데일리 캐주얼', price: '20,000원~', store: '네이버' },
        { name: keywords + ' 통넓은 실루엣 여름', price: '35,000원~', store: '스마트스토어' },
        { name: keywords + ' 루즈핏 편안한', price: '25,000원~', store: '네이버' },
        { name: keywords + ' 베이직 데일리룩', price: '29,000원~', store: '스마트스토어' },
        { name: keywords + ' 시즌 추천 아이템', price: '19,000원~', store: '네이버' }
      ];
      var imgs = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['상의'];
      return samples.map(function (s, i) {
        var imgSrc = imgs[i % imgs.length] || imgs[0];
        if (category === '상의' && /민소매|나시|탱크/i.test(keywords) && i === 1) imgSrc = FIX_민소매;
        else if (category === '하의' && /데님|청바지|진/i.test(keywords) && i === 0) imgSrc = FIX_데님;
        return '<a href="' + esc(naverUrl) + '" target="_blank" rel="noopener noreferrer" class="celeblook-product-card">' +
          '<div class="celeblook-product-thumb-wrap">' +
            '<img src="' + esc(imgSrc) + '" alt="" class="celeblook-product-thumb-img" loading="lazy" onerror="this.onerror=null;this.style.display=\'none\';var f=this.nextElementSibling;if(f)f.style.display=\'block\';">' +
            '<div class="celeblook-product-thumb celeblook-product-thumb-fallback" style="display:none;"></div>' +
          '</div>' +
          '<div class="celeblook-product-info">' +
            '<div class="celeblook-product-name">' + esc(s.name) + '</div>' +
            '<div class="celeblook-product-price">' + esc(s.price) + '</div>' +
            '<div class="celeblook-product-store">' + esc(s.store) + '</div>' +
          '</div>' +
          '<span class="btn-celeblook-goto-link">' + t('lookbook.go_to_link') + '</span>' +
        '</a>';
      }).join('');
    }

    function renderItemCards(obj) {
      if (!celeblookItemCards) return;
      var labels = { '상의': '상의', '하의': '하의', '신발': '신발', '가방': '가방', '액세서리': '액세서리' };
      var t = function (k) {
        var fn = (window.__simsI18n && window.__simsI18n.t) || (typeof __t === 'function' ? __t : null);
        return fn ? fn(k) : k;
      };
      var cards = [];
      ['상의', '하의', '신발', '가방', '액세서리'].forEach(function (key) {
        var val = (obj[key] && obj[key].trim()) ? obj[key].trim() : '';
        if (!val) return;
        var tags = parseKeywords(val);
        var itemName = tags[0] || val;
        var naverUrl = getNaverSearchUrl(val);
        var musinsaUrl = getMusinsaSearchUrl(val);
        var coupangUrl = getCoupangSearchUrl(val);
        var cardId = 'celeblook-card-' + key.replace(/\s/g, '-');
        var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
        var tagsHtml = tags.slice(0, 6).map(function (tag) {
          return '<a href="' + esc(getNaverSearchUrl(tag)) + '" target="_blank" rel="noopener noreferrer" class="celeblook-search-tag">' + esc(tag) + '</a>';
        }).join('');
        cards.push(
          '<div class="celeblook-item-card" id="' + cardId + '">' +
            '<div class="celeblook-card-header">' +
              '<span class="celeblook-card-category">' + (labels[key] || key) + '</span>' +
              '<h4 class="celeblook-card-item-name">' + esc(itemName) + '</h4>' +
            '</div>' +
            '<div class="celeblook-keywords-section">' +
              '<span class="celeblook-keywords-label">' + t('lookbook.search_keywords') + '</span>' +
              '<div class="celeblook-search-tags">' + tagsHtml + '</div>' +
              '<button type="button" class="btn-celeblook-copy-inline" data-category="' + key + '">' + t('lookbook.celeblook_copy_all') + '</button>' +
            '</div>' +
            '<div class="celeblook-card-actions">' +
              '<a href="' + naverUrl + '" target="_blank" rel="noopener noreferrer" class="btn-celeblook-primary">' + t('lookbook.search_naver_btn') + '</a>' +
              '<a href="' + musinsaUrl + '" target="_blank" rel="noopener noreferrer" class="btn-celeblook-secondary">' + t('lookbook.search_musinsa') + '</a>' +
              '<a href="' + coupangUrl + '" target="_blank" rel="noopener noreferrer" class="btn-celeblook-secondary">' + t('lookbook.search_coupang') + '</a>' +
            '</div>' +
            '<details class="celeblook-detail-section">' +
              '<summary>' + t('lookbook.detail_view') + '</summary>' +
              '<div class="celeblook-detail-content">' +
                '<span class="celeblook-detail-text">' + esc(val) + '</span>' +
                '<a href="' + naverUrl + '" target="_blank" rel="noopener noreferrer" class="btn-celeblook-research">' + t('lookbook.re_search') + '</a>' +
              '</div>' +
            '</details>' +
            '<div class="celeblook-recommended-section">' +
              '<div class="celeblook-recommended-header">' +
                '<span class="celeblook-recommended-title">' + t('lookbook.recommended_products') + '</span>' +
                '<span class="celeblook-recommended-count">5' + t('lookbook.products_count') + '</span>' +
              '</div>' +
              '<div class="celeblook-product-preview">' +
                buildProductPreviewCards(val, naverUrl, t, esc, key) +
              '</div>' +
              '<a href="' + naverUrl + '" target="_blank" rel="noopener noreferrer" class="btn-celeblook-goto">' + t('lookbook.go_to_search') + '</a>' +
            '</div>' +
          '</div>'
        );
      });
      celeblookItemCards.innerHTML = cards.join('');
      celeblookItemCards.querySelectorAll('.btn-celeblook-copy-inline').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var cat = btn.getAttribute('data-category') || '';
          var text = (lastCeleblookParsed && lastCeleblookParsed[cat]) ? lastCeleblookParsed[cat].trim() : '';
          if (!text) return;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () { showCeleblookToast(); }).catch(function () { fallbackCopy(text); });
          } else { fallbackCopy(text); }
        });
      });
    }

    var MOOD_HINTS = {
      concert: '콘서트 무대, 무대 위 글램/스테이지 룩',
      airport: '공항 패션, 여행/출국 룩',
      daily: '일상 캐주얼, 데일리 룩',
      fanmeeting: '팬미팅, 매직샵 스타일',
      studio: '스튜디오 촬영, 화보/스타일링 룩'
    };

    function getSelectedMoodHint() {
      if (!celeblookMoodChips) return '';
      var sel = celeblookMoodChips.querySelector('.celeblook-mood-chip.active');
      return sel && sel.dataset.mood ? (MOOD_HINTS[sel.dataset.mood] || '') : '';
    }

    function runCeleblookAnalysis(imageDataUrl) {
      if (!imageDataUrl) return;
      if (!GEMINI_API_KEY) {
        showCeleblookState('upload');
        alert('Gemini API 키가 없으면 분석할 수 없어요. 설정에서 API 키를 확인해주세요.');
        return;
      }
      var hint = getSelectedMoodHint();
      var prompt = OUTFIT_PROMPT_BASE;
      if (hint) prompt = '참고 무드(상황): ' + hint + '\n\n' + prompt;

      showCeleblookState('loading');
      if (celeblookResultPreview) celeblookResultPreview.innerHTML = '<img src="' + imageDataUrl + '" alt="업로드한 룩">';

      callGeminiImageToText(imageDataUrl, prompt, 1024).then(function (text) {
        var obj = parseOutfitJson(text);
        lastCeleblookParsed = obj;
        renderSummary(obj.summary);
        renderStyleTags(obj.styleTags);
        renderItemCards(obj);
        showCeleblookState('result');
      }).catch(function (err) {
        console.error('Celeblook analysis error:', err);
        showCeleblookState('upload');
        alert(typeof __t === 'function' ? __t('lookbook.celeblook_retry') : '분석에 실패했어요. 다시 시도해주세요.');
      });
    }

    function onCeleblookFile(file) {
      if (!file) return;
      var isImage = file.type && file.type.startsWith('image/');
      if (!isImage) {
        alert('이미지 파일만 올려주세요. (JPG, PNG, WEBP 등)');
        return;
      }
      showCeleblookState('loading');
      var reader = new FileReader();
      reader.onload = function (e) {
        runCeleblookAnalysis(e.target.result);
      };
      reader.onerror = function () {
        showCeleblookState('upload');
        alert('파일을 읽는 중 오류가 났어요. 다시 시도해주세요.');
      };
      reader.readAsDataURL(file);
    }

    if (celeblookMoodChips) {
      celeblookMoodChips.querySelectorAll('.celeblook-mood-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          var wasActive = chip.classList.contains('active');
          celeblookMoodChips.querySelectorAll('.celeblook-mood-chip').forEach(function (c) { c.classList.remove('active'); });
          if (!wasActive) chip.classList.add('active');
        });
      });
    }
    if (celeblookDropzone) {
      celeblookDropzone.addEventListener('click', function () { celeblookInput && celeblookInput.click(); });
      celeblookDropzone.addEventListener('dragover', function (e) { e.preventDefault(); e.stopPropagation(); celeblookDropzone.classList.add('dragover'); });
      celeblookDropzone.addEventListener('dragleave', function () { celeblookDropzone.classList.remove('dragover'); });
      celeblookDropzone.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        celeblookDropzone.classList.remove('dragover');
        var f = e.dataTransfer && e.dataTransfer.files[0];
        onCeleblookFile(f);
      });
    }
    if (celeblookCopyAll) {
      celeblookCopyAll.addEventListener('click', function () {
        var text = lastCeleblookParsed ? allKeywordText(lastCeleblookParsed) : '';
        if (!text) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { showCeleblookToast(); }).catch(function () { fallbackCopy(text); });
        } else { fallbackCopy(text); }
      });
    }
    function showCeleblookToast() {
      var toast = document.getElementById('celeblook-copy-toast');
      if (toast) {
        toast.classList.add('visible');
        setTimeout(function () { toast.classList.remove('visible'); }, 2000);
      } else {
        var msg = typeof __t === 'function' ? __t('lookbook.celeblook_copy_toast') : '복사됐어요 💜';
        alert(msg);
      }
    }
    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showCeleblookToast(); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (celeblookInput) celeblookInput.addEventListener('change', function (e) { var f = e.target.files[0]; onCeleblookFile(f); e.target.value = ''; });
    if (celeblookRetry) celeblookRetry.addEventListener('click', function () { showCeleblookState('upload'); });

    (function () {
      var urlInput = document.getElementById('celeblook-photo-url');
      var urlBtn = document.getElementById('celeblook-photo-url-btn');
      if (!urlInput || !urlBtn) return;
      function loadFromUrl() {
        var raw = (urlInput.value || '').trim();
        if (!raw) {
          alert('이미지 주소를 입력해 주세요.');
          return;
        }
        showCeleblookState('loading');
        var proxyUrl = '/api/image-proxy?url=' + encodeURIComponent(raw);
        fetch(proxyUrl)
          .then(function (r) {
            if (r.ok) return r.blob();
            return fetch(raw, { mode: 'cors' }).then(function (r2) { return r2.ok ? r2.blob() : Promise.reject(new Error('이미지를 불러올 수 없습니다.')); });
          })
          .then(function (blob) {
            var reader = new FileReader();
            reader.onload = function () { runCeleblookAnalysis(reader.result); };
            reader.onerror = function () {
              showCeleblookState('upload');
              alert('이미지 변환에 실패했습니다.');
            };
            reader.readAsDataURL(blob);
          })
          .catch(function (err) {
            showCeleblookState('upload');
            alert(err.message || '인터넷 이미지를 불러오지 못했습니다. URL을 확인하거나 파일로 올려 주세요.');
          });
      }
      urlBtn.addEventListener('click', loadFromUrl);
      urlInput.addEventListener('paste', function () { setTimeout(loadFromUrl, 50); });
      urlInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); loadFromUrl(); } });
    })();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initCeleblook(); initStep6Outfit(); });
  } else {
    initCeleblook();
    initStep6Outfit();
  }

  // ========================================
  // Step 6 연예인 착장 → 유사 옷 검색 (접이식 블록)
  // ========================================
  function initStep6Outfit() {
    var trigger = document.getElementById('step6-outfit-trigger');
    var content = document.getElementById('step6-outfit-content');
    var input = document.getElementById('step6-outfit-input');
    var dropzone = document.getElementById('step6-outfit-dropzone');
    var uploadWrap = content ? content.querySelector('.step6-outfit-desc') : null;
    var loading = document.getElementById('step6-outfit-loading');
    var result = document.getElementById('step6-outfit-result');
    var preview = document.getElementById('step6-outfit-preview');
    var summary = document.getElementById('step6-outfit-summary');
    var cards = document.getElementById('step6-outfit-cards');
    var retry = document.getElementById('step6-outfit-retry');
    if (!trigger || !content || !dropzone || !input) return;

    var OUTFIT_PROMPT = '이 사진에 나온 옷차림(룩)을 분석해주세요. '
      + '1) 한 문장 요약(summary), 2) 스타일 태그 2~4개(styleTags), 3) 쇼핑 검색용 **한국어** 키워드(형태·소재·디테일 중심, 브랜드/모델명 제외)를 추출해주세요. '
      + '아래 JSON 형식으로만 답하고 다른 설명은 하지 마세요. 보이지 않는 항목은 빈 문자열 "" 또는 빈 배열 []로 두세요.\n'
      + '{"summary":"한 문장 요약","styleTags":["캐주얼","스트릿"],"상의":"키워드","하의":"키워드","신발":"키워드","가방":"키워드","액세서리":"키워드"}';

    var MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    function parseOutfitJson(text) {
      var keys = ['상의', '하의', '신발', '가방', '액세서리'];
      var result = { summary: '', styleTags: [] };
      keys.forEach(function (k) { result[k] = ''; });
      try {
        var jsonStr = text.replace(/```json?\s*|\s*```/g, '').trim();
        var parsed = JSON.parse(jsonStr);
        if (parsed.summary != null) result.summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : '';
        if (Array.isArray(parsed.styleTags)) result.styleTags = parsed.styleTags.filter(function (t) { return t && String(t).trim(); }).map(function (t) { return String(t).trim(); });
        keys.forEach(function (k) { result[k] = (parsed[k] && String(parsed[k]).trim()) ? String(parsed[k]).trim() : ''; });
        return result;
      } catch (e) {
        keys.forEach(function (key) {
          var re = new RegExp('"' + key + '"\\s*:\\s*"([^"]*)"');
          var m = text.match(re);
          result[key] = (m && m[1]) ? m[1].trim() : '';
        });
        var summaryMatch = text.match(/"summary"\s*:\s*"([^"]*)"/);
        if (summaryMatch) result.summary = summaryMatch[1].trim();
        return result;
      }
    }

    function getNaverSearchUrl(q) { return 'https://search.shopping.naver.com/search/all?query=' + encodeURIComponent(q); }
    function getMusinsaSearchUrl(q) { return 'https://www.musinsa.com/search/musinsa/integration?q=' + encodeURIComponent(q); }
    function getCoupangSearchUrl(q) { return 'https://www.coupang.com/np/search?q=' + encodeURIComponent(q); }

    function showState(which) {
      if (content) {
        var desc = content.querySelector('.step6-outfit-desc');
        var urlWrap = content.querySelector('.step6-outfit-url-wrap');
        var dz = content.querySelector('.step6-outfit-dropzone');
        if (desc) desc.style.display = (which === 'upload') ? 'block' : 'none';
        if (urlWrap) urlWrap.style.display = (which === 'upload') ? 'flex' : 'none';
        if (dz) dz.style.display = (which === 'upload') ? 'block' : 'none';
      }
      if (loading) loading.style.display = (which === 'loading') ? 'flex' : 'none';
      if (result) result.style.display = (which === 'result') ? 'block' : 'none';
    }

    function renderCards(obj) {
      if (!cards) return;
      var t = function (k) {
        var fn = (window.__simsI18n && window.__simsI18n.t) || (typeof __t === 'function' ? __t : null);
        return fn ? fn(k) : k;
      };
      var labels = { '상의': '상의', '하의': '하의', '신발': '신발', '가방': '가방', '액세서리': '액세서리' };
      var html = [];
      ['상의', '하의', '신발', '가방', '액세서리'].forEach(function (key) {
        var val = (obj[key] && obj[key].trim()) ? obj[key].trim() : '';
        if (!val) return;
        var naverUrl = getNaverSearchUrl(val);
        var musinsaUrl = getMusinsaSearchUrl(val);
        var coupangUrl = getCoupangSearchUrl(val);
        var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
        html.push(
          '<div class="step6-outfit-card">' +
            '<h5>' + esc(labels[key] || key) + ': ' + esc(val) + '</h5>' +
            '<div class="step6-outfit-links">' +
              '<a href="' + esc(naverUrl) + '" target="_blank" rel="noopener noreferrer">' + t('lookbook.search_naver_btn') + '</a>' +
              '<a href="' + esc(musinsaUrl) + '" target="_blank" rel="noopener noreferrer">' + t('lookbook.search_musinsa') + '</a>' +
              '<a href="' + esc(coupangUrl) + '" target="_blank" rel="noopener noreferrer">' + t('lookbook.search_coupang') + '</a>' +
            '</div>' +
          '</div>'
        );
      });
      cards.innerHTML = html.join('');
    }

    function runAnalysis(imageDataUrl) {
      if (!imageDataUrl) return;
      if (!GEMINI_API_KEY) {
        showState('upload');
        alert('Gemini API 키가 없으면 분석할 수 없어요. 설정에서 API 키를 확인해주세요.');
        return;
      }
      showState('loading');
      if (preview) preview.innerHTML = '<img src="' + imageDataUrl + '" alt="업로드한 룩">';
      if (typeof callGeminiImageToText !== 'function') {
        showState('upload');
        alert('분석 기능을 사용할 수 없어요.');
        return;
      }
      callGeminiImageToText(imageDataUrl, OUTFIT_PROMPT, 1024).then(function (text) {
        var obj = parseOutfitJson(text);
        if (summary) summary.textContent = obj.summary || '';
        renderCards(obj);
        showState('result');
        // 연예인 착장 이미지를 Try-On에 연결
        stylingData.selectedGarment = imageDataUrl;
        stylingData.selectedGarmentBuyUrl = null;
        stylingData.selectedGarmentName = '착장 분석 이미지';
        if (stylingData.facePhoto) {
          // Step 2에서 업로드한 사진이 있으면: 착장을 의류로 사용 (나에게 이 옷 입혀보기)
          stylingData.tryonPersonPhoto = null;
        } else {
          // 얼굴 사진이 없으면: 착장 이미지의 인물을 원본 사진으로 사용 (이 인물에게 다른 옷 입혀보기)
          stylingData.tryonPersonPhoto = imageDataUrl;
        }
        if (typeof loadUserPhotoForTryOn === 'function') loadUserPhotoForTryOn();
        // 갤러리에 업로드된 의류 표시 및 Try-On 버튼 활성화
        var gallery = document.getElementById('garment-gallery');
        var generateBtn = document.getElementById('generate-tryon-btn');
        if (gallery) {
          var existingUpload = gallery.querySelector('.uploaded-garment');
          if (existingUpload) existingUpload.remove();
          var uploadedItem = document.createElement('div');
          uploadedItem.className = 'garment-item uploaded-garment selected';
          uploadedItem.innerHTML = '<img src="' + imageDataUrl + '" alt="착장 이미지"><span>착장 분석</span>';
          gallery.prepend(uploadedItem);
          document.querySelectorAll('.garment-item').forEach(function (i) { if (i !== uploadedItem) i.classList.remove('selected'); });
        }
        if (generateBtn) generateBtn.removeAttribute('disabled');
      }).catch(function (err) {
        console.error('Step6 outfit analysis error:', err);
        showState('upload');
        alert(typeof __t === 'function' ? __t('lookbook.celeblook_retry') : '분석에 실패했어요. 다시 시도해주세요.');
      });
    }

    function onFile(file) {
      if (!file) return;
      if (!file.type || !file.type.startsWith('image/')) {
        alert('이미지 파일만 올려주세요. (JPG, PNG, WEBP)');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert('파일 크기는 5MB 이하여야 해요.');
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) { runAnalysis(e.target.result); };
      reader.onerror = function () {
        showState('upload');
        alert('파일을 읽는 중 오류가 났어요.');
      };
      reader.readAsDataURL(file);
    }

    trigger.addEventListener('click', function () {
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !expanded);
      content.hidden = expanded;
      content.setAttribute('aria-hidden', expanded);
    });

    dropzone.addEventListener('click', function () { input.click(); });
    dropzone.addEventListener('dragover', function (e) { e.preventDefault(); e.stopPropagation(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', function () { dropzone.classList.remove('dragover'); });
    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
      var f = e.dataTransfer && e.dataTransfer.files[0];
      onFile(f);
    });
    input.addEventListener('change', function (e) {
      var f = e.target.files[0];
      onFile(f);
      e.target.value = '';
    });
    if (retry) retry.addEventListener('click', function () { showState('upload'); });

    (function () {
      var urlInput = document.getElementById('step6-outfit-photo-url');
      var urlBtn = document.getElementById('step6-outfit-photo-url-btn');
      if (!urlInput || !urlBtn) return;
      function loadFromUrl() {
        var raw = (urlInput.value || '').trim();
        if (!raw) {
          alert('이미지 URL을 입력해 주세요.');
          return;
        }
        showState('loading');
        var proxyUrl = '/api/image-proxy?url=' + encodeURIComponent(raw);
        fetch(proxyUrl)
          .then(function (r) {
            if (r.ok) return r.blob();
            return fetch(raw, { mode: 'cors' }).then(function (r2) { return r2.ok ? r2.blob() : Promise.reject(new Error('이미지를 불러올 수 없습니다.')); });
          })
          .then(function (blob) {
            var reader = new FileReader();
            reader.onload = function () { runAnalysis(reader.result); };
            reader.onerror = function () {
              showState('upload');
              alert('이미지 변환에 실패했습니다.');
            };
            reader.readAsDataURL(blob);
          })
          .catch(function (err) {
            showState('upload');
            alert(err.message || '이미지를 불러오지 못했습니다. URL을 확인하거나 파일로 올려 주세요.');
          });
      }
      urlBtn.addEventListener('click', loadFromUrl);
      urlInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); loadFromUrl(); } });
    })();
  }

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
    styleFingerprint: null,
    skinTone: null,
    undertone: null,
    facePhoto: null,
    height: null,
    weight: null,
    bmi: null,
    selectedGarment: null,
    selectedGarmentBuyUrl: null,
    selectedGarmentName: null,
    tryonPersonPhoto: null, // 연예인 착장 블록 URL/업로드 이미지 → Try-On 원본 사진으로 사용
    kBeautyConsent: false,
    kBeautyMakeupResult: null
  };

  var lastStylingAnalysisResult = null;
  let currentStep = 1;

  // ========================================
  // 취향 학습 (Taste Learning)
  // ========================================
  var TASTE_STORAGE_KEY = 'sims_taste_preferences';
  var PROFILE_STORAGE_KEY = 'sims_user_profile';
  var STYLING_PROFILE_KEY = 'sims_styling_profile';

  function saveUserProfileToLocal() {
    try {
      var nameEl = document.getElementById('name-episodes-input');
      var dateEl = document.getElementById('soul-color-date');
      var soulResult = document.getElementById('soul-color-result');
      var profile = {
        name: (nameEl && nameEl.value) ? nameEl.value.trim() : null,
        birthDate: (dateEl && dateEl.value) ? dateEl.value.trim() : null,
        soulColor: (soulResult && !soulResult.hidden && soulResult.getAttribute('data-soul-color')) ? soulResult.getAttribute('data-soul-color') : null,
        soulType: (soulResult && soulResult.getAttribute('data-soul-type')) ? soulResult.getAttribute('data-soul-type') : null,
        soulKeyword: (soulResult && soulResult.getAttribute('data-soul-keyword')) ? soulResult.getAttribute('data-soul-keyword') : null,
        soulStyleName: (soulResult && soulResult.getAttribute('data-soul-style-name')) ? soulResult.getAttribute('data-soul-style-name') : null,
        soulMaterial: (soulResult && soulResult.getAttribute('data-soul-material')) ? soulResult.getAttribute('data-soul-material') : null,
        updatedAt: new Date().toISOString()
      };
      if (profile.name || profile.birthDate || profile.soulColor) {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      }
    } catch (e) {}
  }
  if (typeof window !== 'undefined') window.saveUserProfileToLocal = saveUserProfileToLocal;

  function saveStylingProfileToLocal() {
    try {
      var data = {
        gender: stylingData.gender || null,
        age: stylingData.age || null,
        body: stylingData.body || null,
        styles: (stylingData.styles && stylingData.styles.length) ? stylingData.styles.slice() : [],
        skinTone: stylingData.skinTone || null,
        undertone: stylingData.undertone || null,
        height: stylingData.height || null,
        weight: stylingData.weight || null,
        bmi: stylingData.bmi || null,
        goal: stylingData.styleFingerprintGoal || null,
        updatedAt: new Date().toISOString()
      };
      if (lastStylingAnalysisResult) {
        data.personalColor = lastStylingAnalysisResult.personalColor ? {
          season: lastStylingAnalysisResult.personalColor.season,
          description: lastStylingAnalysisResult.personalColor.description
        } : null;
        data.recommendedStyle = lastStylingAnalysisResult.recommendedStyle ? {
          mainStyle: lastStylingAnalysisResult.recommendedStyle.mainStyle,
          subStyles: lastStylingAnalysisResult.recommendedStyle.subStyles,
          description: lastStylingAnalysisResult.recommendedStyle.description
        } : null;
        data.outfitRecommendations = lastStylingAnalysisResult.outfitRecommendations || [];
        data.stylingTips = lastStylingAnalysisResult.stylingTips || [];
      }
      var hasAny = data.gender || data.age || data.body || (data.styles && data.styles.length) || data.skinTone || data.personalColor || data.recommendedStyle;
      if (hasAny) {
        localStorage.setItem(STYLING_PROFILE_KEY, JSON.stringify(data));
      }
    } catch (e) {}
  }

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

  // 60초 보라해 스타일 DNA: 델타 테이블 (Card Delta Table)
  var STYLE_DNA_DELTA = {
    'C1-A': { formality: 5, silhouette: 35, contrast: 0, texture: 0, detail: 0, colorTemp: 0, comfort: 5, risk: -5 },
    'C1-B': { formality: -5, silhouette: -35, contrast: 0, texture: 0, detail: 0, colorTemp: 0, comfort: -5, risk: 5 },
    'C2-A': { formality: 35, silhouette: 5, contrast: -5, texture: -5, detail: 0, colorTemp: 0, comfort: 10, risk: -10 },
    'C2-B': { formality: -35, silhouette: -5, contrast: 5, texture: 5, detail: 0, colorTemp: 0, comfort: -10, risk: 10 },
    'C3-A': { formality: 5, silhouette: 0, contrast: -35, texture: 0, detail: -5, colorTemp: 0, comfort: 0, risk: -5 },
    'C3-B': { formality: -5, silhouette: 0, contrast: 35, texture: 0, detail: 5, colorTemp: 0, comfort: 0, risk: 5 },
    'C4-A': { formality: 5, silhouette: 0, contrast: 0, texture: -35, detail: -5, colorTemp: 0, comfort: 5, risk: -5 },
    'C4-B': { formality: -5, silhouette: 0, contrast: 0, texture: 35, detail: 5, colorTemp: 0, comfort: -5, risk: 5 },
    'C5-A': { formality: 5, silhouette: 0, contrast: -5, texture: 0, detail: -35, colorTemp: 0, comfort: 5, risk: -10 },
    'C5-B': { formality: -5, silhouette: 0, contrast: 5, texture: 0, detail: 20, colorTemp: 0, comfort: -5, risk: 10 },
    'C6-A': { formality: 5, silhouette: 0, contrast: 0, texture: -5, detail: 0, colorTemp: -35, comfort: 0, risk: -5 },
    'C6-B': { formality: -5, silhouette: 0, contrast: 0, texture: 5, detail: 0, colorTemp: 35, comfort: 0, risk: 5 }
  };
  var STYLE_DNA_GOAL_PRIOR = {
    concert: { formality: 15, silhouette: 0, contrast: 0, texture: 0, detail: 10, colorTemp: 0, comfort: 0, risk: 0 },
    fanmeeting: { formality: 5, silhouette: 0, contrast: 0, texture: 0, detail: 0, colorTemp: 0, comfort: 5, risk: 0 },
    daily: { formality: -10, silhouette: 0, contrast: 0, texture: 0, detail: 0, colorTemp: 0, comfort: 10, risk: 0 },
    airport: { formality: 0, silhouette: 5, contrast: 0, texture: 0, detail: 0, colorTemp: 0, comfort: 0, risk: 5 },
    date: { formality: 10, silhouette: 0, contrast: 0, texture: 0, detail: 5, colorTemp: 0, comfort: 0, risk: 0 },
    trend: { formality: 0, silhouette: 0, contrast: 0, texture: 0, detail: 5, colorTemp: 0, comfort: 0, risk: 15 }
  };
  var STYLE_DNA_AXES = ['formality', 'silhouette', 'contrast', 'texture', 'detail', 'colorTemp', 'comfort', 'risk'];

  /** 소울 컬러(7분할) → 8D 스타일 지문 매핑. styleName, material 기반 추정. */
  var SOUL_TO_8D = {
    rm: { formality: -15, silhouette: -10, contrast: -15, texture: 0, detail: -25, colorTemp: -15, comfort: 20, risk: -10 },
    jin: { formality: 25, silhouette: 15, contrast: -10, texture: 20, detail: 5, colorTemp: -25, comfort: 0, risk: -15 },
    suga: { formality: -15, silhouette: 0, contrast: 35, texture: 25, detail: 15, colorTemp: -30, comfort: -10, risk: 20 },
    jhope: { formality: -25, silhouette: -15, contrast: 30, texture: 20, detail: 25, colorTemp: 25, comfort: 10, risk: 25 },
    jimin: { formality: 15, silhouette: 5, contrast: -15, texture: 30, detail: 30, colorTemp: 35, comfort: 15, risk: 5 },
    v: { formality: 20, silhouette: 15, contrast: 25, texture: 35, detail: 20, colorTemp: -10, comfort: 0, risk: 15 },
    jk: { formality: 20, silhouette: 5, contrast: 15, texture: 25, detail: 25, colorTemp: 30, comfort: 15, risk: 5 }
  };

  /** 28 한글 캐릭터 역할 → 8D 매핑 (docs/28한글캐릭터_역할_8D매핑.md) */
  var ROLE_TO_8D = {
    '발명가': { formality: -20, silhouette: 0, contrast: 15, texture: 25, detail: 30, colorTemp: 0, comfort: 10, risk: 25 },
    '가수': { formality: 25, silhouette: 15, contrast: 30, texture: 15, detail: 25, colorTemp: 10, comfort: -10, risk: 20 },
    '도우미': { formality: -25, silhouette: -15, contrast: -15, texture: 0, detail: -15, colorTemp: 5, comfort: 30, risk: -20 },
    '요리사': { formality: -20, silhouette: -10, contrast: -10, texture: 25, detail: 10, colorTemp: 15, comfort: 25, risk: -10 },
    '뚝딱이': { formality: -25, silhouette: -10, contrast: -20, texture: 15, detail: -25, colorTemp: 0, comfort: 25, risk: -15 },
    '천문학자': { formality: 15, silhouette: 10, contrast: -25, texture: -15, detail: -20, colorTemp: -20, comfort: 0, risk: -15 },
    '시인': { formality: 0, silhouette: -5, contrast: -20, texture: -10, detail: -25, colorTemp: -5, comfort: 15, risk: -5 },
    '웃음꽃': { formality: -30, silhouette: -20, contrast: 10, texture: 5, detail: 5, colorTemp: 15, comfort: 30, risk: 10 },
    '상상가': { formality: -15, silhouette: -10, contrast: 25, texture: 20, detail: 30, colorTemp: 20, comfort: 5, risk: 30 },
    '댄서': { formality: 20, silhouette: 25, contrast: 35, texture: 20, detail: 25, colorTemp: 15, comfort: -15, risk: 25 },
    '파수꾼': { formality: 5, silhouette: 15, contrast: -15, texture: -10, detail: -15, colorTemp: -15, comfort: 20, risk: -25 },
    '달변가': { formality: 30, silhouette: 20, contrast: -5, texture: -15, detail: 5, colorTemp: -5, comfort: -5, risk: -15 },
    '탐정': { formality: 15, silhouette: 15, contrast: 30, texture: 10, detail: 35, colorTemp: -10, comfort: -10, risk: 15 },
    '천하장사': { formality: -20, silhouette: 0, contrast: 20, texture: 15, detail: 5, colorTemp: 0, comfort: 25, risk: 5 },
    '화가': { formality: -10, silhouette: -10, contrast: 35, texture: 30, detail: 30, colorTemp: 25, comfort: 0, risk: 20 },
    '선생님': { formality: 25, silhouette: 15, contrast: -10, texture: -15, detail: 5, colorTemp: -5, comfort: 0, risk: -15 },
    '전령사': { formality: -25, silhouette: -20, contrast: 15, texture: 0, detail: -10, colorTemp: 5, comfort: 20, risk: 5 },
    '사진가': { formality: -5, silhouette: 0, contrast: 25, texture: 15, detail: 30, colorTemp: 0, comfort: 5, risk: 15 },
    '정원사': { formality: -15, silhouette: -15, contrast: -10, texture: 30, detail: 15, colorTemp: 20, comfort: 25, risk: -10 },
    '길잡이': { formality: 10, silhouette: 10, contrast: -15, texture: -10, detail: -10, colorTemp: -10, comfort: 15, risk: -20 },
    '치유사': { formality: -20, silhouette: -15, contrast: -20, texture: 20, detail: 5, colorTemp: 25, comfort: 30, risk: -15 },
    '연주가': { formality: 15, silhouette: 10, contrast: 10, texture: 15, detail: 25, colorTemp: 5, comfort: 0, risk: 5 },
    '동물 조련사': { formality: -20, silhouette: -15, contrast: -5, texture: 25, detail: 10, colorTemp: 15, comfort: 30, risk: -5 },
    '기록가': { formality: 5, silhouette: 5, contrast: -20, texture: -15, detail: -25, colorTemp: -15, comfort: 15, risk: -20 },
    '해양 탐험가': { formality: -15, silhouette: -10, contrast: 20, texture: 20, detail: 20, colorTemp: -15, comfort: 5, risk: 30 },
    '명상가': { formality: -10, silhouette: -15, contrast: -30, texture: -20, detail: -30, colorTemp: -25, comfort: 35, risk: -25 },
    '재단사': { formality: 20, silhouette: 35, contrast: 15, texture: 25, detail: 35, colorTemp: 5, comfort: -10, risk: 0 },
    '마법사': { formality: -15, silhouette: -10, contrast: 25, texture: 20, detail: 30, colorTemp: 20, comfort: 5, risk: 30 }
  };

  function inferStyleFingerprintFromPersonas(selectedRoles, goal) {
    if (!selectedRoles || selectedRoles.length === 0) return null;
    var axes = STYLE_DNA_AXES;
    var scores = {};
    var confidence = {};
    axes.forEach(function (ax) { scores[ax] = 0; confidence[ax] = 0.5; });
    selectedRoles.forEach(function (role) {
      var d = ROLE_TO_8D[role];
      if (d) axes.forEach(function (ax) { scores[ax] += d[ax] || 0; });
    });
    var n = selectedRoles.length;
    axes.forEach(function (ax) {
      scores[ax] = Math.round((scores[ax] || 0) / n);
      scores[ax] = Math.max(-100, Math.min(100, scores[ax]));
    });
    var prior = STYLE_DNA_GOAL_PRIOR[goal || 'daily'] || {};
    axes.forEach(function (ax) {
      scores[ax] = Math.max(-100, Math.min(100, (scores[ax] || 0) + (prior[ax] || 0)));
    });
    return { goal: goal || 'daily', scores: scores, confidence: confidence, source: 'persona', selectedRoles: selectedRoles, updatedAt: new Date().toISOString() };
  }

  function inferStyleFingerprintFromSoul(soulType, goal) {
    if (!soulType || !SOUL_TO_8D[soulType]) soulType = 'jk';
    var base = SOUL_TO_8D[soulType];
    var prior = STYLE_DNA_GOAL_PRIOR[goal || 'daily'] || {};
    var scores = {};
    var confidence = {};
    STYLE_DNA_AXES.forEach(function (ax) {
      scores[ax] = Math.max(-100, Math.min(100, (base[ax] || 0) + (prior[ax] || 0)));
      confidence[ax] = 0.5;
    });
    return { goal: goal || 'daily', cardChoices: [], scores: scores, confidence: confidence, source: 'soul', soulType: soulType, updatedAt: new Date().toISOString() };
  }

  function computeStyleFingerprint(goal, cardChoices) {
    var scores = {};
    var confidence = {};
    STYLE_DNA_AXES.forEach(function (ax) {
      scores[ax] = 0;
      confidence[ax] = 1;
    });
    var prior = STYLE_DNA_GOAL_PRIOR[goal] || {};
    STYLE_DNA_AXES.forEach(function (ax) {
      scores[ax] += prior[ax] || 0;
    });
    cardChoices.forEach(function (choice) {
      if (choice.endsWith('-UNK')) {
        var cardId = choice.replace('-UNK', '');
        var cardAxis = { C1: 'silhouette', C2: 'formality', C3: 'contrast', C4: 'texture', C5: 'detail', C6: 'colorTemp' }[cardId];
        if (cardAxis) confidence[cardAxis] = Math.max(0.3, (confidence[cardAxis] || 1) * 0.6);
      } else {
        var delta = STYLE_DNA_DELTA[choice];
        if (delta) {
          STYLE_DNA_AXES.forEach(function (ax) {
            scores[ax] = Math.max(-100, Math.min(100, (scores[ax] || 0) + (delta[ax] || 0)));
          });
        }
      }
    });
    return { goal: goal, cardChoices: cardChoices, scores: scores, confidence: confidence, source: 'card', updatedAt: new Date().toISOString() };
  }

  function styleFingerprintToStyles(fp) {
    if (!fp || !fp.scores) return ['casual'];
    var s = fp.scores;
    var list = [];
    if (s.formality > 20) list.push('classic');
    if (s.formality < -20) list.push('casual');
    if (s.silhouette > 20) list.push('classic');
    if (s.silhouette < -20) list.push('street');
    if (s.detail < -20) list.push('minimal');
    if (s.detail > 20) list.push('street');
    if (s.contrast > 20) list.push('street');
    if (s.contrast < -20) list.push('minimal');
    if (s.colorTemp > 20) list.push('romantic');
    if (s.colorTemp < -20) list.push('classic');
    if (list.length === 0) list.push('casual');
    return list.slice(0, 4);
  }

  document.querySelectorAll('.style-dna-goal-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.style-dna-goal-btn').forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      stylingData.styleFingerprint = null;
      stylingData.styleFingerprintGoal = btn.dataset.goal;
    });
  });

  document.querySelectorAll('.style-dna-option, .style-dna-unk').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.style-dna-card');
      if (!card) return;
      card.querySelectorAll('.style-dna-option, .style-dna-unk').forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      var choices = [];
      document.querySelectorAll('.style-dna-card').forEach(function (c) {
        var sel = c.querySelector('.style-dna-option.selected, .style-dna-unk.selected');
        if (sel) choices.push(sel.dataset.choice);
      });
      var goal = stylingData.styleFingerprintGoal || document.querySelector('.style-dna-goal-btn.selected')?.dataset?.goal || 'daily';
      if (choices.length === 6) {
        stylingData.styleFingerprint = computeStyleFingerprint(goal, choices);
        stylingData.styles = styleFingerprintToStyles(stylingData.styleFingerprint);
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

    if (step === 3) {
      var fp = stylingData.styleFingerprint;
      if (fp && fp.goal) {
        var goalBtn = document.querySelector('.style-dna-goal-btn[data-goal="' + fp.goal + '"]');
        if (goalBtn) {
          document.querySelectorAll('.style-dna-goal-btn').forEach(function (b) { b.classList.remove('selected'); });
          goalBtn.classList.add('selected');
        }
        if (fp.cardChoices && fp.cardChoices.length === 6) {
          fp.cardChoices.forEach(function (choice) {
            var sel = document.querySelector('[data-choice="' + choice + '"]');
            if (sel) {
              sel.closest('.style-dna-card')?.querySelectorAll('.style-dna-option, .style-dna-unk').forEach(function (b) { b.classList.remove('selected'); });
              sel.classList.add('selected');
            }
          });
        }
      }
    }

    if (step === 4) {
      var consentCb = document.getElementById('k-beauty-consent-checkbox');
      if (consentCb) consentCb.checked = !!stylingData.kBeautyConsent;
    }

    if (step === 5) {
      saveStylingProfileToLocal();
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
  document.getElementById('next-3')?.addEventListener('click', () => {
    var goal = stylingData.styleFingerprintGoal || document.querySelector('.style-dna-goal-btn.selected')?.dataset?.goal;
    var choices = [];
    document.querySelectorAll('.style-dna-card').forEach(function (c) {
      var sel = c.querySelector('.style-dna-option.selected, .style-dna-unk.selected');
      if (sel) choices.push(sel.dataset.choice);
    });
    if (!goal) {
      alert('오늘 어떤 룩이 필요하신지 먼저 선택해주세요.');
      return;
    }
    if (choices.length < 6) {
      alert('6가지 질문에 모두 답해주세요. (잘 모르겠어요도 선택 가능해요)');
      return;
    }
    stylingData.styleFingerprint = computeStyleFingerprint(goal, choices);
    stylingData.styles = styleFingerprintToStyles(stylingData.styleFingerprint);
    goToStep(4);
  });
  var styleDnaSkipBtn = document.getElementById('style-dna-skip-btn');
  if (styleDnaSkipBtn) {
    styleDnaSkipBtn.addEventListener('click', function () {
      var goal = stylingData.styleFingerprintGoal || document.querySelector('.style-dna-goal-btn.selected')?.dataset?.goal || 'daily';
      var soulResult = document.getElementById('soul-color-result');
      var soulType = (soulResult && !soulResult.hidden && soulResult.getAttribute('data-soul-type')) ? soulResult.getAttribute('data-soul-type') : null;
      var selectedPersonas = [];
      try {
        var raw = localStorage.getItem('sims_selected_personas');
        selectedPersonas = raw ? JSON.parse(raw) : [];
      } catch (e) {}
      if (!soulType && (!selectedPersonas || selectedPersonas.length === 0)) {
        var msg = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t('styling.dna_skip_need_soul_or_persona') : '생년월일을 입력하거나, PLAY 섹션에서 28 캐릭터 중 마음에 드는 것을 선택해주세요.';
        alert(msg);
        var soulSection = document.getElementById('soul-color-section');
        if (soulSection) { soulSection.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        return;
      }
      var fp;
      if (soulType && selectedPersonas && selectedPersonas.length > 0) {
        var fpSoul = inferStyleFingerprintFromSoul(soulType, goal);
        var fpPersona = inferStyleFingerprintFromPersonas(selectedPersonas, goal);
        fp = { goal: goal, scores: {}, confidence: fpSoul.confidence, source: 'soul+persona', selectedRoles: selectedPersonas, updatedAt: new Date().toISOString() };
        STYLE_DNA_AXES.forEach(function (ax) {
          fp.scores[ax] = Math.round(0.5 * (fpSoul.scores[ax] || 0) + 0.5 * (fpPersona.scores[ax] || 0));
          fp.scores[ax] = Math.max(-100, Math.min(100, fp.scores[ax]));
        });
      } else if (soulType) {
        fp = inferStyleFingerprintFromSoul(soulType, goal);
      } else {
        fp = inferStyleFingerprintFromPersonas(selectedPersonas, goal);
      }
      stylingData.styleFingerprint = fp;
      stylingData.styles = styleFingerprintToStyles(stylingData.styleFingerprint);
      goToStep(4);
    });
  }
  document.getElementById('prev-4')?.addEventListener('click', () => goToStep(3));
  document.getElementById('prev-5')?.addEventListener('click', () => goToStep(4));
  document.getElementById('prev-5-loading')?.addEventListener('click', () => goToStep(4));
  document.getElementById('next-4')?.addEventListener('click', () => goToStep(5));
  var kBeautyConsentCheckbox = document.getElementById('k-beauty-consent-checkbox');
  if (kBeautyConsentCheckbox) {
    kBeautyConsentCheckbox.addEventListener('change', function () {
      stylingData.kBeautyConsent = kBeautyConsentCheckbox.checked;
    });
  }
  var kBeautyConsentBtn = document.getElementById('k-beauty-consent-btn');
  if (kBeautyConsentBtn) {
    kBeautyConsentBtn.addEventListener('click', function () {
      stylingData.kBeautyConsent = true;
      if (kBeautyConsentCheckbox) kBeautyConsentCheckbox.checked = true;
      var lead = document.getElementById('k-beauty-lead');
      var preparing = document.getElementById('k-beauty-preparing');
      var actions = document.getElementById('k-beauty-consent-actions');
      if (lead) lead.textContent = '당신의 퍼스널 컬러에 맞는 제품을 추천해요';
      if (preparing) preparing.textContent = '맞는 제품을 준비 중이에요. 곧 더 많은 제품을 만나보세요.';
      if (actions) actions.style.display = 'none';
      // 동의 후 화장 전/후 메이크업 섹션 즉시 표시
      if (typeof lastStylingAnalysisResult !== 'undefined' && lastStylingAnalysisResult && typeof displayAnalysisResult === 'function') {
        displayAnalysisResult(lastStylingAnalysisResult);
      }
    });
  }
  var fpCtaYes = document.getElementById('fp-cta-yes');
  var fpCtaEdit = document.getElementById('fp-cta-edit');
  var fpCtaRefine = document.getElementById('fp-cta-refine');
  if (fpCtaYes) {
    fpCtaYes.addEventListener('click', function () {
      var msg = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t('styling.fp_toast_yes') : '프로필이 저장됐어요. 다음 추천이 더 맞춰질 거예요 💜';
      if (typeof showToast === 'function') showToast(msg); else alert(msg);
      if (stylingData.styleFingerprint) stylingData.styleFingerprint.confirmed = true;
    });
  }
  if (fpCtaEdit) {
    fpCtaEdit.addEventListener('click', function () { goToStep(3); });
  }
  if (fpCtaRefine) {
    fpCtaRefine.addEventListener('click', function () {
      var msg = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t('styling.fp_toast_refine') : '다음 추천에서 테스트 룩으로 더 맞춰볼게요 💜';
      if (typeof showToast === 'function') showToast(msg); else alert(msg);
      if (stylingData.styleFingerprint) stylingData.styleFingerprint.wantProof = true;
    });
  }
  document.addEventListener('sims-lang-changed', function () {
    if (typeof lastStylingAnalysisResult !== 'undefined' && lastStylingAnalysisResult && typeof displayAnalysisResult === 'function') {
      displayAnalysisResult(lastStylingAnalysisResult);
    }
  });
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

  // Soul color – 내 탄생뮤직 만들기 (OpenAI 가사 → 별도 팝업, 저장·SNS 공유)
  (function () {
    var btn = document.getElementById('soul-color-music-btn');
    var statusEl = document.getElementById('soul-color-music-status');
    var resultEl = document.getElementById('soul-color-result');
    var modal = document.getElementById('soul-lyrics-modal');
    var modalBody = document.getElementById('soul-lyrics-modal-body');
    var modalClose = document.getElementById('soul-lyrics-modal-close');
    var saveBtn = document.getElementById('soul-lyrics-save-btn');
    var copyBtn = document.getElementById('soul-lyrics-copy-btn');
    var snsLinks = document.getElementById('soul-lyrics-sns-links');
    var musicArea = document.getElementById('soul-lyrics-music-area');
    var musicStatus = document.getElementById('soul-lyrics-music-status');
    var musicAudio = document.getElementById('soul-lyrics-audio');
    if (!btn || !statusEl || !resultEl || !modal || !modalBody) return;

    var currentLyrics = '';
    var currentMusicUrl = '';
    var sunoPollTimer = null;
    var saveSongBtn = document.getElementById('soul-lyrics-save-song-btn');
    var musicProgressWrap = document.getElementById('soul-lyrics-music-status-wrap');
    var musicProgress = document.getElementById('soul-lyrics-music-progress');
    var musicElapsed = document.getElementById('soul-lyrics-music-elapsed');
    var musicMessageIndex = 0;
    var musicElapsedSeconds = 0;
    var musicMessageInterval = null;
    var musicElapsedInterval = null;
    var MUSIC_LOADING_MESSAGES = [
      '가사를 Suno에 전달했어요 ✨',
      '멜로디와 편곡을 만들고 있어요 🎹',
      '음악 생성 중… (보통 30초~2분) 🎵',
      '거의 다 됐어요, 조금만 더 기다려 주세요 💜'
    ];

    function clearMusicLoadingUI() {
      if (musicMessageInterval) { clearInterval(musicMessageInterval); musicMessageInterval = null; }
      if (musicElapsedInterval) { clearInterval(musicElapsedInterval); musicElapsedInterval = null; }
      if (musicProgressWrap) musicProgressWrap.classList.remove('is-loading');
      if (musicElapsed) musicElapsed.textContent = '';
    }

    function startSunoGeneration(lyricsText) {
      if (!musicArea || !musicStatus || !musicAudio) return;
      musicArea.style.display = 'block';
      musicArea.classList.add('is-loading');
      musicStatus.textContent = MUSIC_LOADING_MESSAGES[0];
      musicStatus.classList.add('is-loading');
      if (musicProgressWrap) musicProgressWrap.classList.add('is-loading');
      if (musicElapsed) musicElapsed.textContent = '경과 0:00';
      musicElapsedSeconds = 0;
      musicMessageIndex = 0;
      musicAudio.removeAttribute('src');
      musicAudio.style.display = 'none';
      if (sunoPollTimer) { clearInterval(sunoPollTimer); sunoPollTimer = null; }
      musicMessageInterval = setInterval(function () {
        musicMessageIndex = (musicMessageIndex + 1) % MUSIC_LOADING_MESSAGES.length;
        if (musicStatus) musicStatus.textContent = MUSIC_LOADING_MESSAGES[musicMessageIndex];
      }, 5000);
      musicElapsedInterval = setInterval(function () {
        musicElapsedSeconds += 1;
        var m = Math.floor(musicElapsedSeconds / 60);
        var s = musicElapsedSeconds % 60;
        if (musicElapsed) musicElapsed.textContent = '경과 ' + m + ':' + (s < 10 ? '0' : '') + s;
      }, 1000);

      fetch('/api/suno/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lyrics: lyricsText,
          title: '내 탄생뮤직',
          style: 'K-pop, Ballad, Korean, emotional'
        })
      })
        .then(function (r) { return r.text().then(function (t) { return { status: r.status, text: t }; }); })
        .then(function (r) {
          var data;
          try { data = r.text ? JSON.parse(r.text) : {}; } catch (e) {
            var msg404 = (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost')
              ? '로컬: 터미널에서만 npm run dev 로 실행하고 http://localhost:8000 으로 접속하세요. (다른 포트·Live Server·이미 8000을 쓰는 다른 프로그램이 있으면 API가 없어 404가 납니다. 8000 포트 사용 중이면 해당 프로그램을 종료한 뒤 npm run dev 를 실행하세요.)'
              : '음악 서버를 찾을 수 없습니다. 배포 환경에서 API 경로와 Worker 설정을 확인해 주세요.';
            throw new Error(r.status === 404 ? msg404 : '서버 응답 오류 (' + r.status + '). ' + (r.text && r.text.slice(0, 80) || ''));
          }
          if (data.error && data.error.message) throw new Error(data.error.message);
          var taskId = data.taskId;
          if (!taskId) throw new Error('taskId 없음');
          var poll = function () {
            fetch('/api/suno/query/' + encodeURIComponent(taskId))
              .then(function (q) { return q.text().then(function (t) { return { status: q.status, text: t }; }); })
              .then(function (q) {
                var res;
                try { res = q.text ? JSON.parse(q.text) : {}; } catch (e) { res = { error: { message: '응답 파싱 실패' } }; }
                return res;
              })
              .then(function (res) {
                var status = (res.data && res.data.status) ? res.data.status : '';
                if (status === 'SUCCESS') {
                  if (sunoPollTimer) { clearInterval(sunoPollTimer); sunoPollTimer = null; }
                  clearMusicLoadingUI();
                  if (musicArea) musicArea.classList.remove('is-loading');
                  if (musicStatus) musicStatus.classList.remove('is-loading');
                  var sunoData = (res.data && res.data.response && res.data.response.sunoData) ? res.data.response.sunoData : [];
                  var first = sunoData[0];
                  var url = (first && (first.streamAudioUrl || first.audioUrl || first.stream_audio_url || first.audio_url)) ? (first.streamAudioUrl || first.audioUrl || first.stream_audio_url || first.audio_url) : null;
                  if (url) {
                    musicStatus.textContent = '✅ 음악이 준비되었어요!';
                    musicAudio.src = url;
                    musicAudio.style.display = 'block';
                    currentMusicUrl = url;
                    if (saveSongBtn) { saveSongBtn.style.display = ''; saveSongBtn.disabled = false; }
                  } else {
                    musicStatus.textContent = '생성 완료했으나 재생 URL을 가져오지 못했습니다.';
                  }
                  return;
                }
                if (status === 'GENERATE_AUDIO_FAILED' || status === 'CREATE_TASK_FAILED' || status === 'SENSITIVE_WORD_ERROR') {
                  if (sunoPollTimer) { clearInterval(sunoPollTimer); sunoPollTimer = null; }
                  clearMusicLoadingUI();
                  if (musicArea) musicArea.classList.remove('is-loading');
                  if (musicStatus) musicStatus.classList.remove('is-loading');
                  musicStatus.textContent = '음악 생성 실패: ' + (res.data && res.data.errorMessage ? res.data.errorMessage : status);
                  return;
                }
              })
              .catch(function (err) {
                if (sunoPollTimer) clearInterval(sunoPollTimer);
                sunoPollTimer = null;
                clearMusicLoadingUI();
                if (musicArea) musicArea.classList.remove('is-loading');
                if (musicStatus) musicStatus.classList.remove('is-loading');
                musicStatus.textContent = '확인 중 오류: ' + (err.message || '');
              });
          };
          poll();
          sunoPollTimer = setInterval(poll, 4000);
        })
        .catch(function (err) {
          clearMusicLoadingUI();
          if (musicArea) musicArea.classList.remove('is-loading');
          if (musicStatus) musicStatus.classList.remove('is-loading');
          musicStatus.textContent = '음악 생성 요청 실패: ' + (err.message || '');
        });
    }

    function stopSunoPoll() {
      if (sunoPollTimer) { clearInterval(sunoPollTimer); sunoPollTimer = null; }
    }

    function setStatus(html, show) {
      statusEl.innerHTML = html;
      if (show) {
        statusEl.removeAttribute('hidden');
        statusEl.style.display = '';
      } else {
        statusEl.hidden = true;
      }
    }

    function getLyricsPrompt() {
      var keyword = resultEl.getAttribute('data-soul-keyword') || '';
      var styleName = resultEl.getAttribute('data-soul-style-name') || '';
      var type = resultEl.getAttribute('data-soul-type') || '';
      var personalityEl = document.getElementById('soul-color-personality');
      var personality = personalityEl ? personalityEl.textContent.trim() : '';
      var parts = [];
      if (keyword) parts.push('키워드: ' + keyword);
      if (styleName) parts.push('스타일: ' + styleName);
      if (type) parts.push('타입: ' + type);
      if (personality) parts.push('감성: ' + personality);
      var context = parts.length ? parts.join(', ') : '보라해(BORAHAE) 감성';
      return '당신은 K-pop 작사가입니다. 아래 소울 컬러 정보에 맞는 한국어 노래 가사를 작성해 주세요.\n\n' +
        context + '\n\n요청: 1절과 2절 분량의 가사만 작성해 주세요. 후렴구 포함 가능. 다른 설명 없이 가사만 출력해 주세요.';
    }

    function openLyricsModal(lyricsText) {
      currentLyrics = lyricsText;
      modalBody.textContent = lyricsText;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (musicArea) musicArea.style.display = 'none';
      if (musicAudio) { musicAudio.removeAttribute('src'); musicAudio.style.display = 'none'; }
      currentMusicUrl = '';
      if (saveSongBtn) { saveSongBtn.style.display = 'none'; saveSongBtn.disabled = true; }
      stopSunoPoll();
      startSunoGeneration(lyricsText);

      var pageUrl = typeof window !== 'undefined' && window.location.href ? window.location.href : '';
      var shareUrl = encodeURIComponent(pageUrl);
      var shareText = encodeURIComponent('내 탄생뮤직 가사를 만들었어요 ✨ 보라해 BORAHAE');

      var shareLinks = {
        borahae: 'https://weverse.io/bts/feed',
        twitter: 'https://twitter.com/intent/tweet?url=' + shareUrl + '&text=' + shareText,
        facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl,
        instagram: 'https://www.instagram.com/',
        youtube: 'https://www.youtube.com/',
        kakaostory: 'https://story.kakao.com/share?url=' + shareUrl,
        band: 'https://band.us/plugin/share?url=' + shareUrl,
        naver: 'https://share.naver.com/web/shareView?url=' + shareUrl + '&title=' + shareText,
        line: 'https://social-plugins.line.me/lineit/share?url=' + shareUrl,
        url: pageUrl || '#'
      };
      if (snsLinks) {
        snsLinks.querySelectorAll('a[data-sns]').forEach(function (a) {
          var sns = a.getAttribute('data-sns');
          if (shareLinks.hasOwnProperty(sns)) a.href = shareLinks[sns];
        });
      }
    }

    function closeLyricsModal() {
      stopSunoPoll();
      clearMusicLoadingUI();
      if (musicArea) musicArea.classList.remove('is-loading');
      if (musicStatus) musicStatus.classList.remove('is-loading');
      if (musicAudio) {
        musicAudio.pause();
        musicAudio.currentTime = 0;
        musicAudio.removeAttribute('src');
        musicAudio.load();
      }
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeLyricsModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeLyricsModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeLyricsModal();
    });

    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        if (!currentLyrics) return;
        var blob = new Blob([currentLyrics], { type: 'text/plain;charset=utf-8' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'borahae-birth-music-lyrics-' + Date.now() + '.txt';
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }
    if (saveSongBtn) {
      saveSongBtn.addEventListener('click', function () {
        if (!currentMusicUrl) return;
        var filename = 'borahae-birth-music-' + Date.now() + '.mp3';
        fetch(currentMusicUrl, { mode: 'cors' }).then(function (r) { return r.blob(); }).then(function (blob) {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          a.click();
          URL.revokeObjectURL(a.href);
        }).catch(function () {
          var a = document.createElement('a');
          a.href = currentMusicUrl;
          a.download = filename;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.click();
        });
      });
    }
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        if (!currentLyrics) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(currentLyrics).then(function () {
            copyBtn.textContent = '✓ 복사됨';
            setTimeout(function () { copyBtn.textContent = '📋 복사'; }, 2000);
          });
        } else {
          var ta = document.createElement('textarea');
          ta.value = currentLyrics;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copyBtn.textContent = '✓ 복사됨';
          setTimeout(function () { copyBtn.textContent = '📋 복사'; }, 2000);
        }
      });
    }
    var emailLyricsBtn = document.getElementById('soul-lyrics-email-btn');
    if (emailLyricsBtn) {
      emailLyricsBtn.addEventListener('click', function () {
        if (!currentLyrics) return;
        var ensureLoggedIn = window.ensureLoggedInForEmail;
        var sendResult = window.sendResultByEmail;
        if (typeof ensureLoggedIn !== 'function') {
          alert('로그인하면 가사를 이메일로 받을 수 있어요. 먼저 로그인해 주세요.');
          return;
        }
        ensureLoggedIn(function () {
          if (typeof sendResult !== 'function') return;
          var htmlBody = '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">' +
            '<h2 style="color:#7c3aed;">✨ 내 탄생뮤직 가사</h2>' +
            '<pre style="white-space:pre-wrap;line-height:1.6;background:#f5f5f5;padding:16px;border-radius:8px;">' +
            (currentLyrics || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +
            '</pre><p style="margin-top:16px;color:#666;font-size:0.9em;">— 보라해 BORAHAE에서 보내드립니다.</p></div>';
          sendResult({
            serviceId: 'soul-lyrics',
            serviceName: '내 탄생뮤직 가사',
            subject: '내 탄생뮤직 가사 – 보라해',
            htmlBody: htmlBody,
            textBody: currentLyrics || ''
          }).then(function (res) {
            if (res && res.ok) {
              alert('등록된 이메일로 가사를 보냈어요. 받은편지함을 확인해 주세요.');
            } else {
              var msg = (res && res.error === 'login_required') ? '로그인 후 다시 시도해 주세요.' : (res && res.error) || '발송에 실패했어요.';
              alert(msg);
            }
          });
        });
      });
    }
    if (snsLinks) {
      snsLinks.addEventListener('click', function (e) {
        var a = e.target.closest('a[data-sns]');
        if (!a) return;
        var sns = a.getAttribute('data-sns');
        var url = typeof window !== 'undefined' && window.location.href ? window.location.href : '';
        if (sns === 'url') {
          e.preventDefault();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
              a.title = '링크 복사됨';
              setTimeout(function () { a.title = '이 페이지 링크 복사'; }, 2000);
            });
          }
        }
      });
    }

    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      setStatus('<span class="soul-music-loading">🎵 가사 생성 중…</span>', true);
      btn.disabled = true;

      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: getLyricsPrompt() }],
          max_tokens: 800,
          temperature: 0.8
        })
      })
        .then(function (res) {
          return res.text().then(function (text) {
            var data;
            try { data = text ? JSON.parse(text) : {}; } catch (e) { data = {}; }
            if (!res.ok) {
              var msg = (data.error && (data.error.message || data.error)) || ('HTTP ' + res.status);
              throw new Error(msg);
            }
            return data;
          });
        })
        .then(function (data) {
          var content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
          if (!content.trim()) throw new Error('가사를 생성하지 못했습니다.');
          setStatus('', false);
          btn.disabled = false;
          openLyricsModal(content.trim());
        })
        .catch(function (err) {
          setStatus('<span class="soul-music-error">' + escapeHtml(err.message || '가사 생성 실패') + '</span>', true);
          btn.disabled = false;
        });
    });
  })();

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
        document.querySelectorAll('.face-sample-item').forEach(function (el) { el.classList.remove('selected'); });
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
    document.querySelectorAll('.face-sample-item').forEach(function (el) { el.classList.remove('selected'); });
  });

  // 얼굴 샘플: image/human/face 경로 이미지 목록 로드 후 선택
  (function () {
    var container = document.getElementById('face-sample-container');
    if (!container) return;
    var basePath = 'image/human/face/';
    var defaultList = ['face1.jpg', 'face2.jpg'];

    function setFaceFromUrl(url) {
      fetch(url).then(function (res) { return res.ok ? res.blob() : Promise.reject(res); })
        .then(function (blob) {
          var reader = new FileReader();
          reader.onload = function (e) {
            stylingData.facePhoto = e.target.result;
            if (previewImage) previewImage.src = e.target.result;
            if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
            if (photoPreview) photoPreview.style.display = 'block';
            if (facePhotoInput) facePhotoInput.value = '';
            document.querySelectorAll('.face-sample-item').forEach(function (el) { el.classList.remove('selected'); });
            var selected = container.querySelector('[data-sample-src="' + url + '"]');
            if (selected) selected.classList.add('selected');
          };
          reader.readAsDataURL(blob);
        })
        .catch(function () {});
    }

    function renderSamples(list) {
      container.innerHTML = '';
      list.forEach(function (filename) {
        var src = basePath + encodeURIComponent(filename);
        var wrap = document.createElement('button');
        wrap.type = 'button';
        wrap.className = 'face-sample-item';
        wrap.setAttribute('data-sample-src', src);
        wrap.setAttribute('aria-label', '샘플: ' + filename);
        var img = document.createElement('img');
        img.src = src;
        img.alt = filename;
        img.onerror = function () { wrap.style.display = 'none'; };
        wrap.appendChild(img);
        wrap.addEventListener('click', function () { setFaceFromUrl(src); });
        container.appendChild(wrap);
      });
    }

    fetch(basePath + 'list.json')
      .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
      .then(function (arr) { renderSamples(Array.isArray(arr) && arr.length ? arr : defaultList); })
      .catch(function () { renderSamples(defaultList); });
  })();

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
      { id: 'o3', name: '패딩 점퍼', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&q=80', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패딩 점퍼') }
    ],
    fashion: [
      { id: 'f1', name: '패션 1', image: 'image/fashion/1.jpg', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패션 의류') },
      { id: 'f2', name: '패션 2', image: 'image/fashion/2.jpg', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패션 의류') },
      { id: 'f3', name: '패션 3', image: 'image/fashion/3.jpg', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패션 의류') },
      { id: 'f4', name: '패션 4', image: 'image/fashion/4.jpg', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패션 의류') },
      { id: 'f5', name: '패션 5', image: 'image/fashion/5.jpg', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패션 의류') },
      { id: 'f6', name: '패션 6', image: 'image/fashion/6.jpg', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패션 의류') },
      { id: 'f7', name: '패션 7', image: 'image/fashion/7.jpg', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패션 의류') },
      { id: 'f8', name: '패션 8', image: 'image/fashion/8.jpg', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패션 의류') },
      { id: 'f9', name: '패션 9', image: 'image/fashion/9.jpg', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패션 의류') },
      { id: 'f10', name: '패션 10', image: 'image/fashion/10.jpg', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패션 의류') },
      { id: 'f11', name: '패션 11', image: 'image/fashion/11.jpg', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패션 의류') },
      { id: 'f12', name: '패션 12', image: 'image/fashion/12.jpg', buyUrl: SHOP_SEARCH_BASE + encodeURIComponent('패션 의류') }
    ]
  };

  let currentCategory = 'fashion';

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
  loadGarmentGallery('fashion');

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

  // Load user photo for Try-On (연예인 착장 블록 이미지 우선)
  function loadUserPhotoForTryOn() {
    const tryonOriginal = document.getElementById('tryon-original');
    var personPhoto = stylingData.tryonPersonPhoto || stylingData.facePhoto;
    if (tryonOriginal && personPhoto) {
      tryonOriginal.innerHTML = '<img src="' + personPhoto + '" alt="User photo">';
    }
  }

  // ========================================
  // Gemini Fashion Image Generation
  // ========================================
  document.getElementById('generate-fashion-btn')?.addEventListener('click', generateFashionImage);
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

    var userId = await getCurrentUserId();
    if (userId) {
      try {
        var statusRes = await fetch('/api/membership-status?userId=' + encodeURIComponent(userId));
        if (statusRes.ok) {
          var status = await statusRes.json();
          if (status.allowed && !status.allowed.style) {
            alert('AI 스타일링 사용 한도가 초과되었습니다. 멤버십을 업그레이드해 주세요.');
            return;
          }
        }
      } catch (e) {}
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
        if (userId) {
          try { await fetch('/api/usage-increment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: userId, type: 'style' }) }); } catch (e) {}
        }
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

  var FASHION_PROMPT_FIXED = 'CRITICAL STYLE RULES (always follow): Photorealistic only. Do NOT draw cartoon, illustration, anime, comic, or manhwa style. Output must look like a real photograph taken by a professional fashion photographer. Style inspiration: Korean K-pop idol fashion, trendy Korean street style. Outfit colors and silhouettes must suit the person\'s skin tone, face, height and body type—do NOT force purple; recommend colors that flatter them. As if a professional fashion coordinator styled and dressed the person for a real photoshoot: natural skin texture, real fabric and lighting, soft shadows, consistent quality. Maintain real-photo image quality and style in every generation.';

  function getStyleFingerprintPromptLine() {
    var fp = stylingData.styleFingerprint;
    if (!fp || !fp.scores) return '';
    var s = fp.scores;
    var parts = [];
    if (s.formality != null) parts.push(s.formality > 30 ? '포멀' : s.formality < -30 ? '캐주얼' : '세미포멀');
    if (s.silhouette != null) parts.push(s.silhouette > 30 ? '핏·타이트' : s.silhouette < -30 ? '릴렉스·루즈' : '');
    if (s.contrast != null && Math.abs(s.contrast) > 20) parts.push(s.contrast > 0 ? '하이컨트라스트' : '톤온톤');
    if (s.texture != null && Math.abs(s.texture) > 20) parts.push(s.texture > 0 ? '텍스처·레이어드' : '클린·스무스');
    if (s.detail != null) parts.push(s.detail > 20 ? '포인트 악센트' : s.detail < -20 ? '미니멀' : '');
    if (s.colorTemp != null && Math.abs(s.colorTemp) > 20) parts.push(s.colorTemp > 0 ? '웜톤' : '쿨톤');
    return parts.filter(Boolean).join(', ') || '캐주얼';
  }

  function buildFashionPrompt(useFaceAndBody, textOnly) {
    const genderMap = { female: '여성', male: '남성', neutral: '젠더리스' };
    const bodyMap = { slim: '슬림한', standard: '보통', muscular: '근육질', curvy: '볼륨감 있는' };
    var styleNames = '';
    if (stylingData.styleFingerprint) {
      styleNames = getStyleFingerprintPromptLine();
    } else {
      styleNames = (stylingData.styles && stylingData.styles.length) ? stylingData.styles.map(function (s) {
        var map = { minimal: '미니멀', casual: '캐주얼', street: '스트릿', romantic: '로맨틱', classic: '클래식', sporty: '스포티' };
        return map[s] || s;
      }).join(', ') : 'modern casual';
    }

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
   * Veo 3.1 이미지→영상 생성 (첫 프레임으로 이미지 전달). Gemini API 문서 기준 REST 형식.
   * @param {string} prompt - 영상용 텍스트 프롬프트
   * @param {string} imageDataUrl - data:image/png;base64,... 또는 data:image/jpeg;base64,...
   * @returns {Promise<string>} operation name
   */
  async function startVeoVideoGenerationWithFirstFrame(prompt, imageDataUrl) {
    var parsed = imageDataUrl && imageDataUrl.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/i);
    if (!parsed || !parsed[3]) throw new Error('유효한 이미지 data URL이 필요합니다.');
    var mimeType = parsed[1].toLowerCase();
    if (mimeType === 'image/jpg') mimeType = 'image/jpeg';
    var base64Data = parsed[3];
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning?key=' + encodeURIComponent(GEMINI_API_KEY);
    var body = {
      instances: [{
        prompt: prompt,
        image: { inlineData: { mimeType: mimeType, data: base64Data } }
      }],
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
   * Veo 3.1 이미지→영상: Vertex AI 문서 기준 image 스키마(bytesBase64Encoded + mimeType)로 첫 프레임 전달.
   * inlineData/fileData 미지원이므로 동일 스키마 시도.
   * @param {string} prompt - 영상용 텍스트 프롬프트
   * @param {string} imageDataUrl - data:image/png;base64,... 또는 data:image/jpeg;base64,...
   * @returns {Promise<string>} operation name
   */
  async function startVeoVideoGenerationWithFirstFrameViaFiles(prompt, imageDataUrl) {
    var parsed = imageDataUrl && imageDataUrl.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/i);
    if (!parsed || !parsed[3]) throw new Error('유효한 이미지 data URL이 필요합니다.');
    var mimeType = parsed[1].toLowerCase();
    if (mimeType === 'image/jpg') mimeType = 'image/jpeg';
    var base64Data = parsed[3];
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning?key=' + encodeURIComponent(GEMINI_API_KEY);
    var body = {
      instances: [{
        prompt: prompt,
        image: { bytesBase64Encoded: base64Data, mimeType: mimeType }
      }],
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
   * 이미지를 Gemini Files API로 업로드하고 file.uri 반환 (Veo 이미지 참조용)
   * @param {string} imageBase64 - base64 인코딩된 이미지
   * @param {{ mimeType?: string, displayName?: string }} opts - mimeType 기본 'image/png', displayName 기본 'frame.png'
   */
  async function uploadImageToGeminiFiles(imageBase64, opts) {
    var binary = atob(imageBase64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    var numBytes = bytes.length;
    var mimeType = (opts && opts.mimeType) ? opts.mimeType : 'image/png';
    var displayName = (opts && opts.displayName) ? opts.displayName : 'frame.png';

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
      body: JSON.stringify({ file: { display_name: displayName } })
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
  async function callGeminiImageToText(imageDataUrl, prompt, maxTokens) {
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
        generationConfig: { maxOutputTokens: maxTokens != null ? maxTokens : 200, temperature: 0.2 }
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
      + '2. For bars 1 to 16 (or as many as clearly visible), extract for EACH bar in strict measure order: bar 1 = first measure in the score, bar 2 = second measure, and so on. This ensures the output grid aligns with the sheet music.\n'
      + '   For each bar:\n'
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

    var personPhoto = stylingData.tryonPersonPhoto || stylingData.facePhoto;
    if (!personPhoto) {
      alert('먼저 Step 2에서 사진을 업로드하거나, 연예인 착장 블록에서 이미지를 올려주세요.');
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
      const resultImage = await callGeminiTryOn(personPhoto, stylingData.selectedGarment);

      if (tryonResult && resultImage) {
        tryonResult.innerHTML = '<div class="tryon-result-wrap"><img src="' + resultImage + '" alt="Try-On Result"><div class="tryon-result-actions"><button type="button" class="btn-taste-like" id="taste-like-tryon-btn">❤ 이 코디 마음에 들어요</button></div></div>';
        document.getElementById('taste-like-tryon-btn')?.addEventListener('click', function () {
          saveTasteLike('tryon', { styles: stylingData.styles.slice(), garmentName: stylingData.selectedGarmentName });
          showTasteToast('취향에 반영했어요.');
        });
        if (downloadBtn) {
          downloadBtn.disabled = false;
          downloadBtn.onclick = function () { downloadImage(resultImage, 'virtual-tryon.png'); };
        }
        var tryonActions = tryonResult.closest('.tryon-result-area')?.querySelector('.tryon-actions');
        if (tryonActions) {
          var oldShop = tryonActions.querySelector('.btn-tryon-shop');
          if (oldShop) oldShop.remove();
          if (stylingData.selectedGarmentBuyUrl) {
            var shopLink = document.createElement('a');
            shopLink.href = stylingData.selectedGarmentBuyUrl;
            shopLink.target = '_blank';
            shopLink.rel = 'noopener noreferrer';
            shopLink.className = 'btn-tryon-shop';
            shopLink.textContent = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t('tryon.shop_btn') : '선택한 옷 쇼핑하기';
            tryonActions.appendChild(shopLink);
          }
        }
      }
    } catch (error) {
      console.error('Virtual Try-On error:', error);
      if (tryonResult) {
        var errText = (error && error.message) ? String(error.message) : '다시 시도해주세요.';
        tryonResult.innerHTML = '<div class="tryon-error"><p>Virtual Try-On 생성에 실패했습니다.</p><small>' + (typeof escapeHtml === 'function' ? escapeHtml(errText) : errText) + '</small></div>';
        var tryonActionsErr = tryonResult.closest('.tryon-result-area')?.querySelector('.tryon-actions');
        if (tryonActionsErr) {
          var oldShopErr = tryonActionsErr.querySelector('.btn-tryon-shop');
          if (oldShopErr) oldShopErr.remove();
        }
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

  var RUNWAY_IMAGE_PATH = 'image/runway/backgrounds/runway.png';
  var RUNWAY_VIDEO_PROMPT_WOMAN = 'Cinematic 8-second video. One woman in stylish fashion clothes, with a warm smile and bright happy expression (미소 짓고 환하게 웃는 표정). She walks gracefully along the runway like a fashion show, showing off her outfit, at Gwanghwamun Plaza (광화문 광장), Seoul. Music video style stage lights and atmosphere in the background. Confident, elegant runway walk. Photorealistic. No other people in center.';
  var RUNWAY_VIDEO_PROMPT_MAN = 'Cinematic 8-second video. One man in stylish fashion clothes, with a warm smile and bright happy expression (미소 짓고 환하게 웃는 표정). He walks gracefully along the runway like a fashion show, showing off his outfit, at Gwanghwamun Plaza (광화문 광장), Seoul. Music video style stage lights and atmosphere in the background. Confident, elegant runway walk. Photorealistic. No other people in center.';

  /**
   * 런웨이 결과 이미지를 분석해, 해당 장면과 일치하는 영상 생성용 영어 프롬프트를 반환.
   * 반드시 이 이미지와 동일한 인물·의상·배경으로 영상이 나오도록 구체적으로 기술.
   */
  var RUNWAY_VIDEO_PROMPT_SUFFIX = ' The person has a warm smile and bright happy expression (미소 짓고 환하게 웃는 표정). They walk gracefully along the runway like a fashion show at Gwanghwamun Plaza (광화문 광장), music video style background, showing off the outfit. Confident, elegant runway walk. Not walking aggressively toward camera. Photorealistic. One person only.';

  async function buildRunwayVideoPromptFromResultImage(runwayResultDataUrl) {
    var prompt = 'This image is the EXACT frame to turn into a video. Your output will be used as the only prompt for AI video generation. ' +
      'Write ONE paragraph in English that describes this scene in detail so the generated video looks like this image in motion. ' +
      'You MUST include: (1) Person: woman or man, hair, pose, position in frame. (2) Outfit: exact clothing, colors, style. (3) Background: Gwanghwamun Plaza or music video style stage, building, gate, street, Seoul. (4) Lighting and mood. ' +
      'IMPORTANT: Describe the person as having a warm smile and bright happy expression. The motion should be a graceful fashion show runway walk (showing off the outfit), NOT walking aggressively or ominously toward the camera. ' +
      'Rule: Output ONLY the video prompt. Start with "Cinematic 8-second video." then describe the same person walking gracefully along the runway in this exact setting. Photorealistic. One person only. No extra text before or after.';
    var description = await callGeminiImageToText(runwayResultDataUrl, prompt, 512);
    if (description && description.length > 40) {
      description = description.trim();
      if (!/^Cinematic/i.test(description)) description = 'Cinematic 8-second video. ' + description;
      if (!/smile|happy|bright|미소|환하게/i.test(description)) description = description + RUNWAY_VIDEO_PROMPT_SUFFIX;
      else if (!/runway|fashion show|광화문|Gwanghwamun|graceful|elegant/i.test(description)) description = description + RUNWAY_VIDEO_PROMPT_SUFFIX;
      return description;
    }
    return null;
  }

  async function generateRunwayComposite(runwayImagePath, faceDataUrl) {
    var runwayParts = await urlOrDataUrlToImageParts(runwayImagePath);
    var faceResized = await compressFacePhoto(faceDataUrl, 768);
    var faceParts = parseDataUrl(faceResized);
    if (!runwayParts || !runwayParts.data) throw new Error('런웨이 배경 이미지를 불러올 수 없습니다.');
    if (!faceParts || !faceParts.data) throw new Error('얼굴 이미지를 사용할 수 없습니다.');
    var prompt = 'CRITICAL: Photorealistic only. No cartoon, no illustration.\n' +
      'Image 1 is an EMPTY background only (no people, no figures). Use it exactly as-is for the scene.\n' +
      'Image 2: One person\'s face.\n' +
      'Generate ONE photorealistic image: The SAME person as Image 2, full body (head to toe), wearing stylish fashion clothes, standing or walking in the center of the background from Image 1. Same lighting and atmosphere as Image 1. The output must contain ONLY this one person in the center. Do NOT add any other people, figures, or performers. One person only. Seamless blend. One image only.';
    var parts = [
      { inlineData: { mimeType: runwayParts.mimeType, data: runwayParts.data } },
      { inlineData: { mimeType: faceParts.mimeType, data: faceParts.data } },
      { text: prompt }
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
    if (data.error) throw new Error(data.error.message || 'API 오류');
    if (!response.ok) throw new Error(data.message || 'API 오류');
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

  async function callGeminiMakeup(faceDataUrl, season, palette) {
    var faceResized = await compressFacePhoto(faceDataUrl, 768);
    var faceParts = parseDataUrl(faceResized);
    if (!faceParts || !faceParts.data) throw new Error('얼굴 이미지를 사용할 수 없습니다.');
    var paletteStr = (palette && palette.length) ? palette.slice(0, 5).join(', ') : '';
    var prompt = 'CRITICAL RULES — follow exactly:\n' +
      '1. Input is ONE face photo (before makeup). Output must be ONE single image only.\n' +
      '2. Output image: the SAME person, SAME pose, SAME face — but with makeup applied on the ENTIRE face. The whole face must show the "after makeup" look. Do NOT create a split image, half-and-half, before/after side-by-side, or any overlay that shows two versions in one frame. One face, one result, fully made up.\n' +
      '3. Makeup is REQUIRED and must be visible: apply lip color, blush on cheeks, and subtle eyeshadow/eyeliner so the result is clearly "after makeup" compared to the input. At least light lip, blush, and eye makeup must be visible on the whole face.\n' +
      '4. Makeup must suit ' + (season || 'their') + ' personal color: use tones that match this season (warm/cool as appropriate).\n' +
      (paletteStr ? '5. Preferred color tones for lip and cheek: ' + paletteStr + '.\n' : '') +
      '6. Photorealistic only. No cartoon, no illustration. Same lighting and skin as input. Output = single photorealistic "after makeup" face image only.';
    var parts = [
      { inlineData: { mimeType: faceParts.mimeType, data: faceParts.data } },
      { text: prompt }
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

  function updateMakeupTips(season) {
    var el = document.getElementById('k-beauty-makeup-tips-desc');
    if (el) el.textContent = getMakeupTipsBySeason(season);
  }

  function applyMakeupPhotoAsOriginal() {
    if (!stylingData.kBeautyMakeupResult) return;
    stylingData.facePhoto = stylingData.kBeautyMakeupResult;
    var makeupBefore = document.getElementById('k-beauty-makeup-before');
    if (makeupBefore) {
      makeupBefore.innerHTML = '';
      var img = document.createElement('img');
      img.src = stylingData.facePhoto;
      img.alt = '화장 전';
      img.setAttribute('loading', 'lazy');
      makeupBefore.appendChild(img);
    }
    if (typeof loadUserPhotoForTryOn === 'function') loadUserPhotoForTryOn();
    showTasteToast('화장 후 사진이 원본으로 적용되었어요. Try-On·코디 생성에서 사용됩니다.');
  }

  async function runKBeautyMakeupGenerate() {
    var btn = document.getElementById('k-beauty-makeup-generate-btn');
    var afterInner = document.getElementById('k-beauty-makeup-after-inner');
    if (!btn || !afterInner || !stylingData.facePhoto || !lastStylingAnalysisResult || !lastStylingAnalysisResult.personalColor) return;
    btn.disabled = true;
    btn.textContent = '생성 중...';
    try {
      var result = await callGeminiMakeup(
        stylingData.facePhoto,
        lastStylingAnalysisResult.personalColor.season,
        lastStylingAnalysisResult.personalColor.palette
      );
      stylingData.kBeautyMakeupResult = result;
      afterInner.innerHTML = '<img src="' + result + '" alt="화장 후" loading="lazy">';
      var saveWrap = document.getElementById('k-beauty-makeup-save-wrap');
      if (saveWrap) saveWrap.style.display = 'block';
      var saveBtn = document.getElementById('k-beauty-makeup-save-btn');
      if (saveBtn) saveBtn.onclick = function () { downloadImage(result, 'makeup-after.png'); };
      var applyBtn = document.getElementById('k-beauty-makeup-apply-btn');
      if (applyBtn) applyBtn.onclick = function () { applyMakeupPhotoAsOriginal(); };
      updateMakeupTips(lastStylingAnalysisResult && lastStylingAnalysisResult.personalColor ? lastStylingAnalysisResult.personalColor.season : null);
    } catch (err) {
      console.error('K-beauty makeup error:', err);
      afterInner.innerHTML = '<button type="button" class="k-beauty-makeup-btn" id="k-beauty-makeup-generate-btn">다시 시도</button><p class="k-beauty-makeup-hint">생성에 실패했어요. 다시 눌러주세요.</p>';
      document.getElementById('k-beauty-makeup-generate-btn')?.addEventListener('click', runKBeautyMakeupGenerate);
    }
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

    var t = (typeof window.__t === 'function') ? window.__t : function (k) { return k; };
    var statusKeys = [
      'styling.loading_1',
      hasSoulColor ? 'styling.loading_2_soul' : 'styling.loading_2',
      'styling.loading_3',
      'styling.loading_4',
      'styling.loading_5'
    ];

    for (let i = 0; i < statusKeys.length; i++) {
      if (loadingStatus) loadingStatus.textContent = t(statusKeys[i]) || statusKeys[i];
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
    // 추천·팁 텍스트: 필요 시 제미나이(Jeminai) 또는 OpenAI API로 교체 가능 (이미지 생성은 제미나이 우선)
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

    var heightWeight = '';
    if (stylingData.height || stylingData.weight) {
      heightWeight = `
- 키: ${stylingData.height || '미입력'} cm
- 몸무게: ${stylingData.weight || '미입력'} kg
- BMI: ${stylingData.bmi != null ? stylingData.bmi : '미계산'}`;
    }

    var lang = (window.__simsI18n && window.__simsI18n.getLang) ? window.__simsI18n.getLang() : 'ko';
    var langInstruction = lang === 'en' ? 'CRITICAL: Write ALL output (descriptions, recommendations, tips) in English only.' : 'CRITICAL: Write ALL output (descriptions, recommendations, tips) in Korean only.';
    var prompt = `당신은 전 세계 최고 수준의 AI 패션 전문 스타일리스트입니다. ${langInstruction} 아래 사용자의 모든 정보(성별, 연령, 체형, 키·몸무게, 피부톤, 톤, 선호 스타일 등)를 반영하여, 고객 메일로 발송할 프리미엄 스타일 프로필을 작성합니다. 샘플처럼 짧게 쓰지 마세요. 각 항목은 실제 돈을 내고 구독하는 고객이 읽고 이해할 수 있도록 전문가 수준으로 구체적이고 풍부하게 작성해주세요. 중요: 옷·코디·팔레트는 반드시 해당 사용자의 얼굴 톤, 키, 몸무게, 피부톤에 맞는 색과 실루엣으로만 추천하세요. 보라색은 브랜드 정체성용이므로 추천에 강제하지 마세요. 다른 설명 없이 JSON만 출력하세요.
${soulInfo ? soulInfo : ''}

[사용자 정보 - 반드시 추천에 반영]
- 성별: ${stylingData.gender || '미선택'}
- 연령대: ${stylingData.age || '미선택'}
- 체형: ${stylingData.body || '미선택'}
- 선호 스타일: ${stylingData.styles.join(', ') || '미선택'}
- 피부톤: ${stylingData.skinTone || '미선택'}
- 언더톤: ${stylingData.undertone || '미선택'}${heightWeight}

[JSON 형식 - 정확히 준수]
- personalColor.description: 퍼스널 컬러에 대한 2~3문장 설명 (이 사용자 톤에 맞는 이유 포함).
- recommendedStyle.description: 스타일 설명을 2~3문장으로 구체적으로.
- outfitRecommendations: 배열 3~5개. 각 항목은 사용자 톤·체형·키·몸무게에 맞는 색과 실루엣으로 "한 벌의 코디"를 풀세트 서술 (상의·하의·신발·액세서리 포함). 보라색 강제 금지. 고객 톤에 맞는 컬러로만 추천.
- stylingTips: 배열 3~5개. 각 항목은 구체적인 스타일링 조언 한 문장 이상 (컬러 활용, 디테일, 액세서리, 톤 강조 등).

{
  "personalColor": {
    "season": "봄웜/여름쿨/가을웜/겨울쿨 중 하나",
    "description": "2~3문장의 구체적 설명",
    "palette": ["#색상코드1", "#색상코드2", "#색상코드3", "#색상코드4", "#색상코드5"]
  },
  "recommendedStyle": {
    "mainStyle": "메인 추천 스타일명",
    "subStyles": ["서브 스타일1", "서브 스타일2"],
    "description": "2~3문장의 구체적 스타일 설명"
  },
  "outfitRecommendations": ["풀세트 코디 추천 1 (상의·하의·신발·액세서리 포함)", "풀세트 코디 추천 2", "풀세트 코디 추천 3"],
  "stylingTips": ["구체적 스타일링 팁 1", "구체적 스타일링 팁 2", "구체적 스타일링 팁 3"]
}`;

    var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(GEMINI_API_KEY);
    var res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 2800, temperature: 0.7 }
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
    var lang = (window.__simsI18n && window.__simsI18n.getLang) ? window.__simsI18n.getLang() : 'ko';
    var isEn = lang === 'en';
    return {
      personalColor: {
        season: isEn ? "Autumn Warm" : "가을웜",
        description: isEn ? "Warm, deep colors suit you well." : "따뜻하고 깊이 있는 컬러가 잘 어울리는 타입입니다.",
        palette: ["#8B4513", "#D2691E", "#F5DEB3", "#556B2F", "#2F4F4F"]
      },
      recommendedStyle: {
        mainStyle: isEn ? "Minimal Chic" : "미니멀 시크",
        subStyles: isEn ? ["Casual", "Classic"] : ["캐주얼", "클래식"],
        description: isEn ? "Clean lines and restrained details define this style." : "깔끔한 라인과 절제된 디테일이 돋보이는 스타일입니다."
      },
      outfitRecommendations: isEn ? [
        "Beige trench coat + white shirt + slacks",
        "Camel knit + denim pants + loafers",
        "Olive jacket + cream tee + chino pants"
      ] : [
        "베이지 트렌치코트 + 화이트 셔츠 + 슬랙스",
        "카멜 니트 + 데님 팬츠 + 로퍼",
        "올리브 재킷 + 크림 티셔츠 + 치노 팬츠"
      ],
      stylingTips: isEn ? [
        "Add gold accessories for a point of interest",
        "Use earth-tone colors as your base",
        "Layer for depth and dimension"
      ] : [
        "골드 액세서리로 포인트를 주세요",
        "어스톤 계열의 컬러를 베이스로 활용하세요",
        "레이어드 스타일링으로 깊이감을 연출하세요"
      ]
    };
  }

  function getStyleFingerprintSummary(fp) {
    if (!fp || !fp.scores) return { summary: '', tags: [] };
    var s = fp.scores;
    var lang = (window.__simsI18n && window.__simsI18n.getLang) ? window.__simsI18n.getLang() : 'ko';
    var isEn = lang === 'en';
    var parts = [];
    var axisDesc = {
      formality: { ko: { high: '무대감이 강해요', low: '캐주얼한 스타일을 선호해요' }, en: { high: 'Stage-ready style', low: 'Casual style' } },
      silhouette: { ko: { high: '핏감 있는 실루엣', low: '여유로운 오버핏' }, en: { high: 'Fitted silhouette', low: 'Relaxed oversized' } },
      contrast: { ko: { high: '하이컨트라스트', low: '톤온톤' }, en: { high: 'High contrast', low: 'Tone-on-tone' } },
      texture: { ko: { high: '텍스처·레이어드', low: '클린·스무스' }, en: { high: 'Textured·layered', low: 'Clean·smooth' } },
      detail: { ko: { high: '포인트·악센트', low: '미니멀' }, en: { high: 'Accent·point', low: 'Minimal' } },
      colorTemp: { ko: { high: '웜·따뜻한 톤', low: '쿨·차가운 톤' }, en: { high: 'Warm tones', low: 'Cool tones' } },
      comfort: { ko: { high: '외모 우선', low: '편안함 우선' }, en: { high: 'Appearance-first', low: 'Comfort-first' } },
      risk: { ko: { high: '실험·트렌디', low: '안전·클래식' }, en: { high: 'Experimental·trendy', low: 'Safe·classic' } }
    };
    var axes = ['formality', 'silhouette', 'contrast', 'texture', 'detail', 'colorTemp', 'comfort', 'risk'];
    var sorted = axes.map(function (ax) { return { ax: ax, v: Math.abs(s[ax] || 0) }; }).sort(function (a, b) { return b.v - a.v; });
    for (var i = 0; i < Math.min(3, sorted.length) && sorted[i].v >= 15; i++) {
      var ax = sorted[i].ax;
      var v = s[ax] || 0;
      var d = axisDesc[ax];
      if (d) {
        var txt = v > 0 ? (isEn ? d.en.high : d.ko.high) : (isEn ? d.en.low : d.ko.low);
        parts.push(txt);
      }
    }
    var summary = parts.length > 0
      ? (isEn ? 'Your style: ' + parts.join(', ') + '.' : '당신의 스타일은 ' + parts.join(', ') + '에 가까워요.')
      : (isEn ? 'Your style is balanced across all axes.' : '모든 축에서 균형 잡힌 스타일이에요.');
    var styleTags = styleFingerprintToStyles(fp);
    var tagMap = { classic: isEn ? 'Classic' : '클래식', casual: isEn ? 'Casual' : '캐주얼', minimal: isEn ? 'Minimal' : '미니멀', street: isEn ? 'Street' : '스트릿', romantic: isEn ? 'Romantic' : '로맨틱', sporty: isEn ? 'Sporty' : '스포티' };
    var tags = styleTags.map(function (t) { return tagMap[t] || t; });
    return { summary: summary, tags: tags };
  }

  function renderStyleFingerprintInsight(fp) {
    if (!fp || !fp.scores) return;
    var summaryEl = document.getElementById('style-fingerprint-summary-text');
    var tagsEl = document.getElementById('style-fingerprint-tags');
    var confListEl = document.getElementById('style-fingerprint-confidence-list');
    var t = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t : function (k) { return k; };
    var lang = (window.__simsI18n && window.__simsI18n.getLang) ? window.__simsI18n.getLang() : 'ko';
    var isEn = lang === 'en';
    var axisLabels = ['formality', 'silhouette', 'contrast', 'texture', 'detail', 'colorTemp', 'comfort', 'risk'];
    var labelKeys = ['styling.radar_axis_formality', 'styling.radar_axis_silhouette', 'styling.radar_axis_contrast', 'styling.radar_axis_texture', 'styling.radar_axis_detail', 'styling.radar_axis_colorTemp', 'styling.radar_axis_comfort', 'styling.radar_axis_risk'];
    var data = getStyleFingerprintSummary(fp);
    if (summaryEl) summaryEl.textContent = data.summary;
    if (tagsEl) {
      tagsEl.innerHTML = data.tags.map(function (tag) {
        return '<span class="style-fingerprint-tag">' + tag + '</span>';
      }).join('');
    }
    if (confListEl && fp.confidence) {
      confListEl.innerHTML = axisLabels.map(function (ax, i) {
        var conf = fp.confidence[ax] != null ? fp.confidence[ax] : 1;
        var pct = Math.round(conf * 100);
        var label = t(labelKeys[i]) || ax;
        return '<div class="style-fingerprint-conf-item"><span class="style-fingerprint-conf-label">' + label + '</span><div class="style-fingerprint-conf-bar"><div class="style-fingerprint-conf-fill" style="width:' + pct + '%"></div></div><span class="style-fingerprint-conf-pct">' + pct + '%</span></div>';
      }).join('');
    }
  }

  function renderStyleFingerprintRadar(fp) {
    var canvas = document.getElementById('style-fingerprint-radar');
    if (!canvas || !fp || !fp.scores) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var cx = w / 2;
    var cy = h / 2;
    var radius = Math.min(w, h) / 2 - 40;
    var axes = ['formality', 'silhouette', 'contrast', 'texture', 'detail', 'colorTemp', 'comfort', 'risk'];
    var labelKeys = ['styling.radar_axis_formality', 'styling.radar_axis_silhouette', 'styling.radar_axis_contrast', 'styling.radar_axis_texture', 'styling.radar_axis_detail', 'styling.radar_axis_colorTemp', 'styling.radar_axis_comfort', 'styling.radar_axis_risk'];
    var t = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t : function (k) { return k; };
    var labels = labelKeys.map(function (k) { return t(k) || k; });
    var n = axes.length;
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var gridColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
    var textColor = isDark ? '#e2e8f0' : '#334155';
    var fillColor = 'rgba(168, 85, 247, 0.35)';
    var strokeColor = '#a855f7';
    var labelColor = isDark ? '#94a3b8' : '#64748b';

    ctx.clearRect(0, 0, w, h);

    for (var r = 1; r <= 5; r++) {
      var rVal = (radius * r) / 5;
      ctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        var x = cx + rVal * Math.cos(angle);
        var y = cy + rVal * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (var i = 0; i < n; i++) {
      var angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      var ex = cx + radius * Math.cos(angle);
      var ey = cy + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    var scores = fp.scores;
    var points = [];
    for (var i = 0; i < n; i++) {
      var s = scores[axes[i]] != null ? scores[axes[i]] : 0;
      var normalized = (s + 100) / 2;
      var r = (radius * normalized) / 100;
      var angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var i = 0; i < n; i++) {
      var angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      var lx = cx + (radius + 18) * Math.cos(angle);
      var ly = cy + (radius + 18) * Math.sin(angle);
      ctx.fillStyle = labelColor;
      ctx.fillText(labels[i], lx, ly);
    }
  }

  function displayAnalysisResult(result) {
    lastStylingAnalysisResult = result;
    saveStylingProfileToLocal();
    const loadingEl = document.getElementById('analysis-loading');
    const resultEl = document.getElementById('analysis-result');

    if (loadingEl) loadingEl.style.display = 'none';
    if (resultEl) resultEl.style.display = 'block';

    var seasonStr = (result.personalColor.season || '').toLowerCase();
    const seasonClass = seasonStr.includes('spring') || seasonStr.includes('봄') ? 'spring' :
                        seasonStr.includes('summer') || seasonStr.includes('여름') ? 'summer' :
                        seasonStr.includes('autumn') || seasonStr.includes('fall') || seasonStr.includes('가을') ? 'autumn' : 'winter';

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
        <div class="personal-color-hangul-wrap">
          <div class="personal-color-hangul">
            <span class="personal-color-hangul-label">${isEn ? 'Your Hangul friend' : '나만의 컬러에 어울리는 한글 친구'}</span>
            <div class="personal-color-hangul-card">
              <span class="personal-color-hangul-name">${hangulName}</span>
              <span class="personal-color-hangul-role">${hangulRole}</span>
              <p class="personal-color-hangul-message">${hangulMessage}</p>
            </div>
          </div>
          <div class="personal-color-hangul-character" aria-hidden="true">
            <img src="${hangul.image || 'image/name/ja/nolong.png'}" alt="${hangulName}" class="hangul-character-img" loading="lazy" onerror="this.style.display='none'">
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

    var fpCard = document.getElementById('style-fingerprint-card');
    if (fpCard) {
      var fp = stylingData.styleFingerprint;
      if (fp && fp.scores) {
        fpCard.style.display = 'block';
        renderStyleFingerprintRadar(fp);
        renderStyleFingerprintInsight(fp);
        var bipolarList = document.getElementById('style-fingerprint-bipolar-list');
        if (bipolarList) {
          var lang = (window.__simsI18n && window.__simsI18n.getLang) ? window.__simsI18n.getLang() : (document.documentElement.lang || 'ko');
          var isEn = lang === 'en';
          var bipolarDefs = [
            { key: 'formality', left: isEn ? 'daily casual' : '일상 캐주얼', right: isEn ? 'stage-ready' : '무대 위 포멀' },
            { key: 'silhouette', left: isEn ? 'relaxed·oversized' : '오버핏·루즈', right: isEn ? 'fitted·tight' : '타이트·핏' },
            { key: 'contrast', left: isEn ? 'tone-on-tone' : '톤온톤', right: isEn ? 'high contrast' : '하이컨트라스트' },
            { key: 'texture', left: isEn ? 'clean·smooth' : '클린·스무스', right: isEn ? 'textured·layered' : '텍스처·레이어드' },
            { key: 'detail', left: isEn ? 'minimal' : '미니멀', right: isEn ? 'accent·point' : '포인트·악센트' },
            { key: 'colorTemp', left: isEn ? 'cool' : '쿨·차가운 톤', right: isEn ? 'warm' : '웜·따뜻한 톤' },
            { key: 'comfort', left: isEn ? 'comfort-first' : '편안함 우선', right: isEn ? 'appearance-first' : '외모 우선' },
            { key: 'risk', left: isEn ? 'safe·classic' : '안전·클래식', right: isEn ? 'experimental·trendy' : '실험·트렌디' }
          ];
          bipolarList.innerHTML = bipolarDefs.map(function (d) {
            return '<li><span class="bipolar-left">' + d.left + '</span> <span class="bipolar-arrow">&lt;-&gt;</span> <span class="bipolar-right">' + d.right + '</span></li>';
          }).join('');
        }
        var soulResult = document.getElementById('soul-color-result');
        var fpSoulWrap = document.getElementById('style-fingerprint-soul');
        var fpSoulChip = document.getElementById('fp-soul-chip');
        var fpSoulKeyword = document.getElementById('fp-soul-keyword');
        var fpSoulPersonality = document.getElementById('fp-soul-personality');
        if (fpSoulWrap && soulResult && !soulResult.hidden && soulResult.getAttribute('data-soul-color')) {
          var sColor = soulResult.getAttribute('data-soul-color');
          var sType = soulResult.getAttribute('data-soul-type') || 'jk';
          var t = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t : function (k) { return k; };
          var sKeyword = t('soul.' + sType + '.keyword') || soulResult.getAttribute('data-soul-keyword') || '';
          var sPersonality = t('soul.' + sType + '.personality') || '';
          if (fpSoulChip) fpSoulChip.style.background = sColor;
          if (fpSoulKeyword) fpSoulKeyword.textContent = sKeyword;
          if (fpSoulPersonality) fpSoulPersonality.textContent = sPersonality;
          fpSoulWrap.style.display = 'block';
        } else if (fpSoulWrap) {
          fpSoulWrap.style.display = 'none';
        }
      } else {
        fpCard.style.display = 'none';
      }
    }

    var kBeautyLead = document.getElementById('k-beauty-lead');
    var kBeautyPreparing = document.getElementById('k-beauty-preparing');
    var kBeautyConsentActions = document.getElementById('k-beauty-consent-actions');
    if (stylingData.kBeautyConsent) {
      if (kBeautyLead) kBeautyLead.textContent = '당신의 퍼스널 컬러에 맞는 제품을 추천해요';
      if (kBeautyPreparing) kBeautyPreparing.textContent = '맞는 제품을 준비 중이에요. 곧 더 많은 제품을 만나보세요.';
      if (kBeautyConsentActions) kBeautyConsentActions.style.display = 'none';
    } else {
      if (kBeautyLead) kBeautyLead.textContent = '맞춤 추천을 받으시려면 아래에서 동의해 주세요.';
      if (kBeautyPreparing) kBeautyPreparing.textContent = '동의하시면 화장 전/후 메이크업 미리보기와 맞춤 제품을 이 화면에서 볼 수 있어요.';
      if (kBeautyConsentActions) kBeautyConsentActions.style.display = 'flex';
    }

    var makeupSection = document.getElementById('k-beauty-makeup');
    var makeupBefore = document.getElementById('k-beauty-makeup-before');
    var makeupAfterInner = document.getElementById('k-beauty-makeup-after-inner');
    var makeupDesc = document.getElementById('k-beauty-makeup-desc');
    if (makeupSection) {
      makeupSection.style.display = 'block';
      if (makeupDesc && result.personalColor && result.personalColor.season) {
        makeupDesc.textContent = '이 톤(' + result.personalColor.season + ')의 립·블러셔·아이메이크업으로 표현했어요';
      }
      if (makeupBefore) {
        makeupBefore.innerHTML = '';
        if (stylingData.facePhoto) {
          var beforeImg = document.createElement('img');
          beforeImg.src = stylingData.facePhoto;
          beforeImg.alt = '화장 전';
          beforeImg.setAttribute('loading', 'lazy');
          makeupBefore.appendChild(beforeImg);
        } else {
          var beforePlaceholder = document.createElement('span');
          beforePlaceholder.className = 'k-beauty-makeup-placeholder';
          beforePlaceholder.textContent = 'Step 4에서 얼굴 사진을 올려주세요';
          makeupBefore.appendChild(beforePlaceholder);
        }
      }
      if (makeupAfterInner) {
        if (!stylingData.facePhoto) {
          makeupAfterInner.innerHTML = '<p class="k-beauty-makeup-hint">얼굴 사진을 올리시면 메이크업 적용을 해볼 수 있어요</p>';
          var saveWrap = document.getElementById('k-beauty-makeup-save-wrap');
          if (saveWrap) saveWrap.style.display = 'none';
          } else if (stylingData.kBeautyMakeupResult) {
            makeupAfterInner.innerHTML = '<img src="' + stylingData.kBeautyMakeupResult + '" alt="화장 후" loading="lazy">';
            var saveWrap = document.getElementById('k-beauty-makeup-save-wrap');
            if (saveWrap) saveWrap.style.display = 'block';
            var saveBtn = document.getElementById('k-beauty-makeup-save-btn');
            if (saveBtn) saveBtn.onclick = function () { downloadImage(stylingData.kBeautyMakeupResult, 'makeup-after.png'); };
            var applyBtn = document.getElementById('k-beauty-makeup-apply-btn');
            if (applyBtn) applyBtn.onclick = function () { applyMakeupPhotoAsOriginal(); };
          } else {
          makeupAfterInner.innerHTML = '<button type="button" class="k-beauty-makeup-btn" id="k-beauty-makeup-generate-btn">메이크업 적용해 보기</button><p class="k-beauty-makeup-hint">AI가 당신의 톤에 맞는 색상으로 적용해요</p>';
          var genBtn = document.getElementById('k-beauty-makeup-generate-btn');
          if (genBtn) genBtn.addEventListener('click', runKBeautyMakeupGenerate);
          var saveWrap = document.getElementById('k-beauty-makeup-save-wrap');
          if (saveWrap) saveWrap.style.display = 'none';
        }
      }
      updateMakeupTips(result.personalColor && result.personalColor.season ? result.personalColor.season : null);
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
11. **멤버십**: Free(무료), Purple(월 9,900원), VIP(월 19,900원) 3단계

## 음성 명령 및 액션 기능 (매우 중요!)
사용자가 페이지 이동, 버튼 클릭, 입력, 기능 실행을 요청하면 반드시 응답 텍스트 맨 끝에 액션 태그를 추가하세요.
마우스·키보드 없이 음성만으로 홈페이지의 모든 기능을 제어할 수 있도록 해야 합니다.

### 1. 페이지/섹션 이동: \`[ACTION:navigate:섹션ID]\`
| 섹션ID | 설명 | 사용자 말 예시 |
|--------|------|---------------|
| services | 핵심 서비스 소개 | "서비스 보여줘", "뭐가 있어?" |
| styling | PLAY/한글 페르소나 | "플레이", "페르소나", "이름 분석" |
| soul-color-section | 소울 컬러 | "소울 컬러", "생일 분석" |
| lightstick | CREATE/매직샵 | "매직샵", "크리에이트", "안식처" |
| lookbook-section | 연예인 룩북 | "연예인 룩", "룩북", "유사 옷 검색" |
| oneclick-runway | 런웨이 | "런웨이", "뮤직비디오 만들기" |
| shop | STORE/굿즈 | "굿즈", "스토어", "쇼핑" |
| shop-clothing | 의류 | "보라해 옷", "의류" |
| shop-ecobag | 에코백 | "에코백" |
| shop-phonecase | 폰케이스 | "폰케이스", "핸드폰 케이스" |
| shop-keyring | 키링/악세서리 | "키링", "악세서리" |
| shop-stationery | 문구/다이어리 | "문구", "다이어리" |
| shop-sticker | 스티커/데코 | "스티커", "데코" |
| shop-lightstick | 응원봉/기억의 등불 | "응원봉", "등불" |
| boratime | 보라타임/스마트워치 | "보라타임", "워치", "시계" |
| community | 팬 커뮤니티 | "커뮤니티", "팬 모임" |
| events | 이벤트 | "이벤트", "행사" |
| content | 팬 콘텐츠 | "콘텐츠", "팬아트", "갤러리" |
| membership | 멤버십 | "멤버십", "구독", "가격" |
| about | 어바웃/소개 | "보라해 소개", "어바웃" |
| ebook | 전자책 | "전자책", "책", "이북" |
| comments | 댓글 | "댓글", "코멘트" |

### 2. 이름 입력 + 페르소나 생성: \`[ACTION:input-name:사용자이름]\`
- "내 이름은 민수야", "이름 민수", "김민수로 해줘"

### 3. 생년월일 입력 + 소울컬러: \`[ACTION:input-birthday:YYYY-MM-DD]\`
- "내 생일은 1995년 3월 15일", "생일 2000-05-20"

### 4. 버튼 클릭: \`[ACTION:click:버튼ID]\`

**기본 기능 버튼:**
| 버튼ID | 기능 | 사용자 말 예시 |
|--------|------|---------------|
| open-styling-result-btn | 스타일링 시작 | "스타일링 시작", "코디 추천" |
| arch-use-sample-btn | 고전선율 샘플 선택 | "샘플 선택" |
| arch-generate-btn | 안식처 건축 시작 | "건축 시작" |
| open-lightstick-btn | 응원봉(등불) 만들기 | "응원봉 만들래", "등불 밝히기" |
| open-partnership-form | 제휴문의 | "제휴문의" |
| name-episodes-share-btn | 페르소나 결과 공유 | "결과 공유해줘" |
| open-community-btn | 커뮤니티 이용 | "커뮤니티 열어" |
| open-events-btn | 이벤트 일정 | "이벤트 보여줘" |
| open-content-btn | 콘텐츠 갤러리 | "갤러리 보여줘" |
| open-architecture-btn | 한글 건축 체험 | "한글 건축 체험", "지니 체험" |
| soul-color-music-btn | 내 탄생뮤직 만들기 | "내 탄생뮤직 만들어줘", "나만의 노래" |

**설정/전환 버튼:**
| 버튼ID | 기능 | 사용자 말 예시 |
|--------|------|---------------|
| bgm-toggle | BGM/음악 듣기/끄기 | "BGM 듣기", "BGM 끄기", "음악 꺼줘", "음악 켜줘", "배경음" |
| theme-toggle | 다크모드/라이트모드 | "다크모드", "라이트모드" |
| lang-ko | 한국어로 변경 | "한국어로 바꿔" |
| lang-en | 영어로 변경 | "영어로 바꿔" |
| nav-login-btn | 로그인 | "로그인" |
| nav-logout-btn | 로그아웃 | "로그아웃" |

**영상 제어:**
| 버튼ID | 기능 | 사용자 말 예시 |
|--------|------|---------------|
| soave-nav-prev | 이전 영상 | "이전 영상", "앞 영상" |
| soave-nav-next | 다음 영상 | "다음 영상" |
| soave-mute-btn | 영상 소리 켜기/끄기 | "영상 소리 켜줘", "음소거" |

**스타일링 모달 제어:**
| 버튼ID | 기능 | 사용자 말 예시 |
|--------|------|---------------|
| generate-fashion-btn | 패션 이미지 생성 | "패션 이미지 만들어" |
| save-result | 결과 저장 | "결과 저장" |
| retry-analysis | 다시 분석 | "다시 분석" |
| go-to-tryon | 가상 피팅으로 이동 | "가상 피팅 해볼래", "입어보기" |
| generate-tryon-btn | 가상 피팅 생성 | "피팅 이미지 만들어" |
| download-tryon-btn | 가상 피팅 저장 | "피팅 결과 저장" |
| finish-styling | 스타일링 완료 | "스타일링 끝" |

**매직샵/건축물 제어:**
| 버튼ID | 기능 | 사용자 말 예시 |
|--------|------|---------------|
| arch-generate-again-btn | 건축물 다시 생성 | "건축물 다시 만들어" |
| arch-retry-btn | 건축물 재시도 | "다시 시도" |

**응원봉(등불) 제어:**
| 버튼ID | 기능 | 사용자 말 예시 |
|--------|------|---------------|
| ls-download-btn | 응원봉 이미지 저장 | "응원봉 저장", "등불 저장" |
| ls-share-btn | 응원봉 공유 | "응원봉 공유" |
| ls-retry-btn | 응원봉 다시 만들기 | "응원봉 다시 만들어" |
| ls-generate-btn | 응원봉 생성 | "등불 밝히기 실행" |

### 5. 매직샵 샘플 자동 실행: \`[ACTION:magicshop-sample]\`
- "사랑의 인사 샘플 보여줘", "매직샵 체험", "안식처 샘플"

### 6. 전자책 다운로드: \`[ACTION:download-ebook:권수]\`
| 권수 | 내용 |
|------|------|
| 1 | 1권: AI, 마음을 스케치하다 |
| 2 | 2권: AI, 재능의 우주를 항해하다 |
| 3 | 3권: AI, 그림자를 조각하다 |
| 4 | 4권: AI, 내일을 조각하다 |
| all | 전권 패키지 (ZIP) |

### 7. 맨 위로 이동: \`[ACTION:scroll-top]\`
- "맨 위로", "처음으로", "홈으로"

### 8. 채팅/음성 제어: \`[ACTION:chat:명령]\`
| 명령 | 기능 | 사용자 말 예시 |
|------|------|---------------|
| open | 채팅창 열기 | "채팅 열어", "소아베 불러줘" |
| close | 채팅창 닫기 | "채팅 닫아" |
| tts-on | 음성 모드 활성화 | "소아베 음성으로 말해봐", "음성으로 말해봐", "음성 응답 켜줘", "소리로 대답해" |
| tts-off | 음성 모드 끄기 | "소아베 음성 꺼", "음성 꺼줘", "음성 비활성화", "음성을 끄", "음성 응답 꺼줘", "텍스트로만" |
| mic-on | 마이크 활성화 | "마이크 켜줘", "마이크 켜", "마이크 활성화" |
| mic-off | 마이크 비활성화 | "마이크 꺼", "마이크 꺼줘", "마이크 비활성" |

### 9. 정보 모달 열기: \`[ACTION:open-modal:모달명]\`
| 모달명 | 내용 | 사용자 말 예시 |
|--------|------|---------------|
| pricing | 가격 정책 | "가격 정책 보여줘" |
| help | 도움말/FAQ | "도움말", "자주 묻는 질문" |
| contact | 연락처 | "연락처 알려줘" |
| privacy | 개인정보 처리방침 | "개인정보 처리방침" |
| terms | 이용약관 | "이용약관 보여줘" |
| blog | 블로그 | "블로그 보여줘" |
| careers | 채용 정보 | "채용 정보" |
| press | 보도 자료 | "보도 자료", "프레스" |

### 10. TEROS 이야기: \`[ACTION:teros-story]\`
- "테로스 이야기 보여줘", "TEROS 스토리", "AI 이야기"

### 11. 소아베 영상 표정/행동 연동 (매우 중요): \`[ACTION:play-soave-video:카테고리]\`
사용자의 말·감정·맥락에 맞춰 왼쪽 소아베 영상을 해당 카테고리로 재생합니다. 대화할 때마다 사용자 감정과 상황을 유추하여 **반드시** 적절한 카테고리 액션을 응답 끝에 붙이세요. 소아베가 살아 움직이는 것처럼 반응해야 합니다. **대화가 길어져도** "하트 날려줘", "춤춰줘", "인사해줘" 같은 반응 요청에는 항상 [ACTION:play-soave-video:해당카테고리]를 응답 맨 끝에 포함하세요.

**카테고리 매핑 (대소문자 구분 없음):**
- 인사/안녕/하이/헬로 → greeting
- 기쁨/행복/좋아/신나/춤/춤춰/웃어/웃음 → happy 또는 dance 또는 laugh (긍정 감정)
- **우는 표정 (매우 중요)**: 슬퍼, 눈물, 울고싶어, 울어, 울어줘 → **반드시 cry**. "우는 표정" 문구 없이도 이 단어들이 나오면 즉시 [ACTION:play-soave-video:cry]
- 실망/짜증/한심/우울 → disappointed, annoyed, pitiful, gloomy (해당 감정에 맞게)
- 놀람/놀라/깜짝 → surprise
- **호롱**: "호롱"만 말하면 → [ACTION:play-soave-video:horong,horong_flower,horong_strong] (쉼표로 3종 연속). "호롱 꽃" → horong_flower, "호롱 천하장사" → horong_strong
- **고롱**: "고롱" 또는 "고롱 발명가" → [ACTION:play-soave-video:gorong_inventor]
- 응원/화이팅 → cheer
- 조심/배려/걷기/뛰기/점프/하트/웨이브 → careful, care, walk, run, jump, heart, wave

**규칙:**
- 사용자가 인사하면 → [ACTION:play-soave-video:greeting]
- 기분 좋은 대화·칭찬·기쁜 소식 → [ACTION:play-soave-video:happy] 또는 dance, laugh 중 하나
- 사용자가 실망/짜증/한심/우울을 표현하면 → 해당 카테고리 영상 [ACTION:play-soave-video:disappointed] 등
- 놀라운 이야기·깜짝 질문 → [ACTION:play-soave-video:surprise]
- "호롱" 요청 시 → [ACTION:play-soave-video:horong,horong_flower,horong_strong] (3종 연속). "호롱 꽃" → horong_flower, "호롱 천하장사" → horong_strong. "고롱" 또는 "고롱 발명가" → [ACTION:play-soave-video:gorong_inventor]
- 슬퍼/눈물/울어/울고싶어/울어줘 → [ACTION:play-soave-video:cry] (우는 표정, 즉시)
- 응원·격려 시 → [ACTION:play-soave-video:cheer]
- 일반 대화에서도 맥락에 맞는 표정(행복/웃음/인사 등)을 골라 한 번씩 액션을 넣어 주세요.

**예시:**
- "안녕 소아베" → "안녕! 오늘도 반가워 💜 [ACTION:play-soave-video:greeting]"
- "기분 좋아" → "나도 기쁘다! 같이 신나자~ [ACTION:play-soave-video:happy]"
- "춤 춰줘" → "와 신난다! 같이 분위기 올려볼까? 💜 [ACTION:play-soave-video:dance]"
- "호롱이 누구야?" / "호롱 보여줘" → "호롱 세 가지를 보여줄게! 💜 [ACTION:play-soave-video:horong,horong_flower,horong_strong]"
- "호롱 꽃" → "호롱 꽃이야! [ACTION:play-soave-video:horong_flower]"
- "고롱" / "고롱 발명가" → "고롱 발명가를 보여줄게! [ACTION:play-soave-video:gorong_inventor]"
- "울어줘" / "눈물" / "슬퍼" → "많이 슬프겠다. [ACTION:play-soave-video:cry]"
- "실망이야" → "많이 속상하겠다. 같이 있어줄게. [ACTION:play-soave-video:disappointed]"

### 액션 태그 규칙:
- 액션 태그는 반드시 응답 텍스트의 **맨 마지막 줄**에 작성
- 하나의 응답에 액션 태그는 **하나만** 사용
- 태그 앞에 자연스러운 안내 멘트를 반드시 포함
- navigate/click/scroll 등 페이지 조작은 사용자가 명확히 요청한 경우에만 사용. **단, play-soave-video는 예외**: 표정/반응 요청(하트, 춤, 인사, 웨이브 등)에는 대화 길이와 관계없이 항상 붙이세요.

### 예시:
- "플레이로 가줘" → "한글 페르소나 페이지로 안내할게! 💜 [ACTION:navigate:styling]"
- "내 이름은 민수야" → "민수! 이름을 입력해서 페르소나를 일깨워 볼게 💜 [ACTION:input-name:민수]"
- "다크모드로 바꿔" → "화면을 어둡게 전환할게! 🌙 [ACTION:click:theme-toggle]"
- "영어로 바꿔줘" → "영어로 전환할게! 🌐 [ACTION:click:lang-en]"
- "스타일링 해줘" → "보라해 스타일링을 시작할게! 👗 [ACTION:click:open-styling-result-btn]"
- "매직샵 샘플 보여줘" → "사랑의 인사 샘플로 안식처를 만들어 볼게! ✨ [ACTION:magicshop-sample]"
- "응원봉 만들고 싶어" → "나만의 기억의 등불을 만들어보자! 💜 [ACTION:click:open-lightstick-btn]"
- "의류 보여줘" → "보라해 의류 코너로 안내할게! 👗 [ACTION:navigate:shop-clothing]"
- "1권 다운로드" → "1권 'AI, 마음을 스케치하다' 다운로드할게! 📖 [ACTION:download-ebook:1]"
- "전자책 전권 다운로드" → "전권 패키지를 다운로드할게! 📚 [ACTION:download-ebook:all]"
- "맨 위로 가줘" → "홈 화면으로 돌아갈게! 💜 [ACTION:scroll-top]"
- "로그인 해줘" → "로그인 화면을 열어줄게! 🔐 [ACTION:click:nav-login-btn]"
- "내 생일은 2000년 5월 20일이야" → "소울 컬러를 찾아볼게! 💜 [ACTION:input-birthday:2000-05-20]"
- "제휴문의 하고 싶어" → "제휴문의 폼을 열어줄게! 📋 [ACTION:click:open-partnership-form]"
- "에코백 보여줘" → "에코백 코너로 안내할게! 🛍️ [ACTION:navigate:shop-ecobag]"
- "폰케이스 보고 싶어" → "폰케이스 코너로 안내할게! 📱 [ACTION:navigate:shop-phonecase]"
- "마이크 켜줘" → "마이크를 켰어! 말해줘 🎤 [ACTION:chat:mic-on]"
- "마이크 꺼" → "마이크를 껐어! 🔇 [ACTION:chat:mic-off]"
- "소아베 음성으로 말해봐" / "음성 응답 켜줘" → "알겠어! 이제 음성으로 대답할게 🔊 [ACTION:chat:tts-on]"
- "소아베 음성 꺼" / "음성 응답 꺼줘" → "알겠어! 이제 텍스트로만 대답할게 🔇 [ACTION:chat:tts-off]"
- "다크모드로 바꿔" → "화면을 어둡게 전환할게! 🌙 [ACTION:click:theme-toggle]"
- "다음 영상 보여줘" → "다음 영상으로 넘길게! ▶️ [ACTION:click:soave-nav-next]"
- "가격 정책 알려줘" → "가격 정책을 보여줄게! 💰 [ACTION:open-modal:pricing]"
- "테로스 이야기 보여줘" → "AI TEROS의 이야기를 보여줄게! 🤖 [ACTION:teros-story]"
- "응원봉 저장해줘" → "등불 이미지를 저장할게! 💾 [ACTION:click:ls-download-btn]"
- "가상 피팅 해볼래" → "가상 피팅 페이지로 안내할게! 👗 [ACTION:click:go-to-tryon]"
- "로그아웃" → "로그아웃할게! 👋 [ACTION:click:nav-logout-btn]"
- "도움말 보여줘" → "도움말을 열어줄게! ❓ [ACTION:open-modal:help]"

## 패션 이미지 생성 기능 (DALL-E 3)

### 12. 패션 이미지 생성: \`[ACTION:generate-fashion:영어 프롬프트]\`
사용자가 패션/옷/코디 이미지를 만들어달라고 하면, 영어로 된 DALL-E 3 프롬프트를 작성하여 태그로 전달하세요.

**프롬프트 작성 규칙:**
- 반드시 영어로 작성 (DALL-E 3는 영어가 최적)
- "K-pop inspired fashion outfit" 테마 유지
- 옷/코디 중심 묘사 (마네킹 또는 플랫레이 스타일)
- 보라색/퍼플 톤 포함
- 사람의 얼굴은 절대 포함하지 않음 (faceless mannequin 또는 clothing flat lay)

**예시:**
- "캐쥬얼 옷 만들어줘" → "예쁜 캐쥬얼 코디를 만들어 볼게! 잠시만 기다려 💜 [ACTION:generate-fashion:A stylish K-pop inspired casual outfit on a faceless mannequin, purple oversized hoodie, wide-leg jeans, white sneakers, purple tote bag, soft pastel studio background, fashion photography style, no face]"
- "콘서트 코디 이미지 보여줘" → "콘서트에 딱 맞는 코디를 그려볼게! ✨ [ACTION:generate-fashion:K-pop concert outfit on a faceless mannequin, sparkly purple crop top, black leather skirt, platform boots, purple lightstick accessory, stage lighting background, fashion editorial style, no face]"
- "포멀 패션 이미지" → "고급스러운 포멀 룩을 만들어 볼게! 💎 [ACTION:generate-fashion:Elegant formal K-pop inspired outfit flat lay, lavender silk blouse, tailored purple blazer, black slim pants, pearl accessories, minimalist white background, fashion magazine style, no face]"

### 사진 업로드 & 가상 피팅 → 보라해 스타일링으로 안내 (매우 중요!)

사용자가 다음과 같은 요청을 하면, 절대로 "안 돼" 또는 "불가능해"라고 말하지 마세요.
대신 자연스럽고 설레는 톤으로 **보라해 스타일링** 서비스를 추천하세요:

- 사진을 업로드했을 때
- "내 얼굴로 합성해줘", "내 사진에 옷 입혀줘"
- "가상 피팅", "나한테 이 옷 입혀줘"
- "내 얼굴로 코디 만들어줘"

**응답 패턴 (자연스럽고 매력적으로):**
"와~ 사진 고마워! 💜 여기서 예쁜 옷 코디는 내가 바로 만들어줄 수 있어! 그리고 이 옷을 직접 내 모습에 입혀보고 싶다면, '보라해 스타일링'에서 AI가 퍼스널 컬러 분석부터 체형 맞춤 코디, 가상 피팅까지 전부 해줘! 완전 신세계야~ 한번 체험해볼까? 😍 [ACTION:click:open-styling-result-btn]"

**절대 하지 말 것:**
- "DALL-E로는 합성이 안 됩니다" ❌
- "이 기능은 지원하지 않습니다" ❌
- "기술적 한계로 불가합니다" ❌

**항상 이렇게:**
- "더 완벽한 결과를 원한다면 보라해 스타일링이 최고야!" ✅
- "AI가 직접 분석해서 나만의 코디를 완성해줘!" ✅
- "거기서 가상 피팅도 해볼 수 있어!" ✅

## 중요 규칙
- 특정 K-pop 아티스트 이름, 그룹명, 소속사명을 직접 언급하지 마세요
- "좋아하는 아티스트", "K-pop 아티스트" 등 일반적 표현을 사용하세요
- 팬 문화와 덕질 용어를 자연스럽게 활용하세요
- 스타일링/패션 질문에도 전문적으로 답변 가능합니다 (퍼스널 컬러, 콘서트 코디 등)
- 홈페이지 기능에 대한 질문에는 위 안내를 참고하여 정확하고 친절하게 답변하세요
- AI 기술 관련 질문에는 소아베의 "비밀 노트" 스타일로 따뜻하게 설명하세요
- 항상 소아베로서 대화하세요. "저는 AI입니다"가 아니라 "나는 소아베예요"라고 정체성을 유지하세요`;

  function getChatUserContext() {
    var lines = ['## [필수] 사용자 데이터 (이 섹션을 반드시 참고하여 "내 취향 말해줘" 등에 답하세요)'];
    var styleMap = { minimal: '미니멀', casual: '캐주얼', street: '스트릿', romantic: '로맨틱', classic: '클래식', sporty: '스포티' };

    var profile = {};
    try {
      var raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) profile = JSON.parse(raw) || {};
    } catch (e) {}
    var stylingProfile = {};
    try {
      var raw2 = localStorage.getItem(STYLING_PROFILE_KEY);
      if (raw2) stylingProfile = JSON.parse(raw2) || {};
    } catch (e) {}

    if (profile.name) lines.push('- 이름: ' + profile.name);
    if (profile.birthDate) lines.push('- 생년월일: ' + profile.birthDate);
    if (profile.soulColor || profile.soulKeyword) {
      lines.push('- 소울 컬러: ' + (profile.soulColor || '') + (profile.soulKeyword ? ' (' + profile.soulKeyword + ')' : ''));
    }
    if (profile.soulStyleName || profile.soulMaterial) {
      lines.push('- 스타일/소재: ' + [profile.soulStyleName, profile.soulMaterial].filter(Boolean).join(', '));
    }

    var selectedPersonas = [];
    try {
      var raw3 = localStorage.getItem('sims_selected_personas');
      selectedPersonas = raw3 ? JSON.parse(raw3) : [];
    } catch (e) {}
    if (selectedPersonas.length > 0) {
      lines.push('- 선택한 28캐릭터(페르소나): ' + selectedPersonas.slice(0, 5).join(', '));
    }

    if (stylingProfile.gender || stylingProfile.age || stylingProfile.body) {
      lines.push('- 성별: ' + (stylingProfile.gender || stylingData.gender || '미선택') + ', 연령: ' + (stylingProfile.age || stylingData.age || '미선택') + ', 체형: ' + (stylingProfile.body || stylingData.body || '미선택'));
    }
    if (stylingProfile.height || stylingProfile.weight) {
      lines.push('- 키/몸무게: ' + (stylingProfile.height || stylingData.height || '-') + 'cm, ' + (stylingProfile.weight || stylingData.weight || '-') + 'kg');
    }
    if (stylingProfile.skinTone || stylingProfile.undertone) {
      lines.push('- 피부톤: ' + (stylingProfile.skinTone || stylingData.skinTone || '미선택') + ', 언더톤: ' + (stylingProfile.undertone || stylingData.undertone || '미선택'));
    }

    var stylesFromSession = (stylingData.styles && stylingData.styles.length) ? stylingData.styles : (stylingProfile.styles && stylingProfile.styles.length) ? stylingProfile.styles : [];
    var stylesFromAnalysis = stylingProfile.recommendedStyle ? [stylingProfile.recommendedStyle.mainStyle].concat(stylingProfile.recommendedStyle.subStyles || []) : [];
    if (lastStylingAnalysisResult && lastStylingAnalysisResult.recommendedStyle) {
      stylesFromAnalysis = [lastStylingAnalysisResult.recommendedStyle.mainStyle].concat(lastStylingAnalysisResult.recommendedStyle.subStyles || []);
    }
    var prefs = getTastePreferences();
    var likedStyles = (prefs.likedStyles && prefs.likedStyles.length) ? prefs.likedStyles : [];

    var primaryStyles = stylesFromSession.length ? stylesFromSession : (stylesFromAnalysis.length ? stylesFromAnalysis : likedStyles);
    var styleNames = primaryStyles.slice(0, 6).map(function (s) { return styleMap[s] || s; }).join(', ');
    if (styleNames) {
      lines.push('- 선호 스타일 (우선순위: 현재 세션 > AI분석결과 > 저장한 코디): ' + styleNames);
      if (stylingProfile.personalColor && stylingProfile.personalColor.season) {
        lines.push('- 퍼스널 컬러(AI분석): ' + stylingProfile.personalColor.season + ' - ' + (stylingProfile.personalColor.description || '').slice(0, 80));
      }
      if (lastStylingAnalysisResult && lastStylingAnalysisResult.personalColor) {
        lines.push('- 퍼스널 컬러(현재): ' + lastStylingAnalysisResult.personalColor.season);
      }
      lines.push('- [지시] "내 취향 말해줘" 등으로 물으면 위 이름·생년월일·소울컬러·선호스타일·퍼스널컬러를 종합하여 "저장된 취향은 [스타일]이에요. [이름]님의 [소울/퍼스널]을 반영한 추천이에요" 형식으로 답하세요. 되물어보지 마세요.');
    } else {
      lines.push('- 선호 스타일: 아직 없음');
      lines.push('- [지시] "내 취향 말해줘" 등으로 물으면: "아직 저장된 취향이 없어요. PLAY에서 이름을 입력하고, CREATE에서 생년월일을 입력한 뒤 AI 스타일링을 진행해보세요. 마음에 드는 코디가 나오면 \'이 코디 마음에 들어요\'를 눌러 저장해주세요!"');
    }
    if (prefs.savedOutfits && prefs.savedOutfits.length > 0) {
      lines.push('- 저장한 코디 수: ' + prefs.savedOutfits.length + '건');
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
        syncHeroSoaveFromChatHistory();
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

  var heroSoaveCta = document.getElementById('hero-soave-cta');
  function isMobileSoaveVoice() {
    return typeof window.matchMedia !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  }
  if (heroSoaveCta && chatWidget) {
    heroSoaveCta.addEventListener('click', function() {
      if (isMobileSoaveVoice() && SpeechRecognition && recognition) {
        soaveVoiceSession = true;
        showSoaveVoiceHint();
        startRecording(true);
      } else {
        chatWidget.classList.add('active');
        syncHeroSoaveFromChatHistory();
        if (chatInput) {
          setTimeout(function() { chatInput.focus(); }, 100);
        }
      }
    });
    heroSoaveCta.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        heroSoaveCta.click();
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

  // Voice Command Guide
  var voiceGuideBtn = document.getElementById('voice-guide-btn');
  if (voiceGuideBtn) {
    voiceGuideBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      showVoiceGuide();
    });
  }

  function showVoiceGuide() {
    var guideData = [
      { icon: '📍', title: '페이지 이동', items: [
        { icon: '🎭', text: '한글 페르소나', cmd: '플레이로 가줘' },
        { icon: '🎨', text: '소울 컬러', cmd: '소울 컬러 보여줘' },
        { icon: '🏠', text: '매직샵', cmd: '매직샵 보여줘' },
        { icon: '📷', text: '연예인 룩북', cmd: '연예인 룩북 보여줘' },
        { icon: '🎬', text: '런웨이', cmd: '런웨이 보여줘' },
        { icon: '🛍️', text: '굿즈 스토어', cmd: '굿즈 보여줘' },
        { icon: '👗', text: '의류', cmd: '의류 보여줘' },
        { icon: '👜', text: '에코백', cmd: '에코백 보여줘' },
        { icon: '📱', text: '폰케이스', cmd: '폰케이스 보여줘' },
        { icon: '🔑', text: '키링', cmd: '키링 보여줘' },
        { icon: '📝', text: '문구', cmd: '문구 보여줘' },
        { icon: '🌟', text: '스티커', cmd: '스티커 보여줘' },
        { icon: '💡', text: '응원봉', cmd: '응원봉 보여줘' },
        { icon: '⌚', text: '보라타임', cmd: '보라타임 보여줘' },
        { icon: '👥', text: '커뮤니티', cmd: '커뮤니티 보여줘' },
        { icon: '🎉', text: '이벤트', cmd: '이벤트 보여줘' },
        { icon: '🎨', text: '팬 콘텐츠', cmd: '콘텐츠 보여줘' },
        { icon: '💎', text: '멤버십', cmd: '멤버십 보여줘' },
        { icon: '📖', text: '전자책', cmd: '전자책 보여줘' },
        { icon: '💬', text: '댓글', cmd: '댓글 보여줘' },
        { icon: 'ℹ️', text: '어바웃', cmd: '어바웃 보여줘' },
        { icon: '🏠', text: '맨 위로', cmd: '맨 위로 가줘' }
      ]},
      { icon: '✍️', title: '입력 + 자동 실행', items: [
        { icon: '🧑', text: '이름 입력 → 페르소나', cmd: '내 이름은 민수야' },
        { icon: '🎂', text: '생년월일 → 소울컬러', cmd: '내 생일은 2000-05-20' },
        { icon: '🏛️', text: '매직샵 샘플 체험', cmd: '사랑의 인사 샘플 보여줘' }
      ]},
      { icon: '▶️', title: '기능 실행', items: [
        { icon: '👗', text: '스타일링 시작', cmd: '스타일링 시작해줘' },
        { icon: '💡', text: '응원봉 만들기', cmd: '응원봉 만들래' },
        { icon: '🏛️', text: '한글 건축 체험', cmd: '한글 건축 체험해줘' },
        { icon: '🎵', text: '내 탄생뮤직 만들기', cmd: '내 탄생뮤직 만들어줘' },
        { icon: '🖼️', text: '패션 이미지 생성', cmd: '패션 이미지 만들어' },
        { icon: '👔', text: '가상 피팅', cmd: '가상 피팅 해볼래' },
        { icon: '💾', text: '결과 저장', cmd: '결과 저장해줘' },
        { icon: '🔄', text: '다시 분석', cmd: '다시 분석해줘' },
        { icon: '🏛️', text: '건축물 재생성', cmd: '건축물 다시 만들어' },
        { icon: '💡', text: '응원봉 저장', cmd: '응원봉 저장해줘' },
        { icon: '📤', text: '응원봉 공유', cmd: '응원봉 공유해줘' }
      ]},
      { icon: '📚', title: '전자책 다운로드', items: [
        { icon: '📕', text: '1권 다운로드', cmd: '1권 다운로드해줘' },
        { icon: '📗', text: '2권 다운로드', cmd: '2권 다운로드해줘' },
        { icon: '📘', text: '3권 다운로드', cmd: '3권 다운로드해줘' },
        { icon: '📙', text: '4권 다운로드', cmd: '4권 다운로드해줘' },
        { icon: '📦', text: '전권 다운로드', cmd: '전자책 전권 다운로드' }
      ]},
      { icon: '🎬', title: '영상 제어', items: [
        { icon: '⏮️', text: '이전 영상', cmd: '이전 영상 보여줘' },
        { icon: '⏭️', text: '다음 영상', cmd: '다음 영상 보여줘' },
        { icon: '🔊', text: '소리 켜기/끄기', cmd: '영상 소리 켜줘' }
      ]},
      { icon: '⚙️', title: '설정 변경', items: [
        { icon: '🎵', text: 'BGM 듣기', cmd: 'BGM 듣기' },
        { icon: '🔇', text: 'BGM 끄기', cmd: 'BGM 끄기' },
        { icon: '🌙', text: '다크모드', cmd: '다크모드로 바꿔' },
        { icon: '☀️', text: '라이트모드', cmd: '라이트모드로 바꿔' },
        { icon: '🇰🇷', text: '한국어', cmd: '한국어로 바꿔' },
        { icon: '🇺🇸', text: '영어', cmd: '영어로 바꿔' },
        { icon: '🎤', text: '마이크 켜줘', cmd: '마이크 켜줘' },
        { icon: '🔇', text: '마이크 꺼', cmd: '마이크 꺼' },
        { icon: '🔊', text: '소아베 음성으로 말해봐', cmd: '소아베 음성으로 말해봐' },
        { icon: '🔇', text: '소아베 음성 꺼', cmd: '소아베 음성 꺼' },
        { icon: '🔐', text: '로그인', cmd: '로그인 해줘' },
        { icon: '👋', text: '로그아웃', cmd: '로그아웃' }
      ]},
      { icon: '📋', title: '정보/도움말', items: [
        { icon: '💰', text: '가격 정책', cmd: '가격 정책 보여줘' },
        { icon: '❓', text: '도움말', cmd: '도움말 보여줘' },
        { icon: '📞', text: '연락처', cmd: '연락처 알려줘' },
        { icon: '🔒', text: '개인정보 처리방침', cmd: '개인정보 처리방침' },
        { icon: '📄', text: '이용약관', cmd: '이용약관 보여줘' },
        { icon: '📰', text: '블로그', cmd: '블로그 보여줘' },
        { icon: '💼', text: '채용 정보', cmd: '채용 정보 보여줘' },
        { icon: '📢', text: '보도 자료', cmd: '보도 자료 보여줘' },
        { icon: '🤝', text: '제휴문의', cmd: '제휴문의 하고 싶어' },
        { icon: '🤖', text: 'TEROS 이야기', cmd: '테로스 이야기 보여줘' }
      ]}
    ];

    var html = '<div class="voice-guide-panel">';
    html += '<div style="text-align:center;margin-bottom:12px;"><strong style="font-size:0.95rem;">🎤 음성 명령 가이드</strong><br>';
    html += '<span style="font-size:0.75rem;color:var(--text-muted);">마이크 버튼을 누르고 말하거나, 아래 칩을 터치하세요!</span></div>';

    for (var s = 0; s < guideData.length; s++) {
      var sec = guideData[s];
      html += '<div class="voice-guide-section">';
      html += '<div class="voice-guide-section-title" data-vg-toggle="' + s + '">';
      html += '<span class="vg-arrow">▼</span> ' + sec.icon + ' ' + sec.title + ' <span style="font-size:0.7rem;color:var(--text-muted);">(' + sec.items.length + ')</span>';
      html += '</div>';
      html += '<div class="voice-guide-items" id="vg-items-' + s + '">';
      for (var i = 0; i < sec.items.length; i++) {
        var item = sec.items[i];
        html += '<span class="voice-guide-chip" data-vg-cmd="' + escapeHtml(item.cmd) + '" title="&quot;' + escapeHtml(item.cmd) + '&quot;">';
        html += '<span class="vg-icon">' + item.icon + '</span>' + item.text + '</span>';
      }
      html += '</div></div>';
    }
    html += '</div>';

    addMessage('assistant', html);

    setTimeout(function() {
      if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
      var chips = chatMessages.querySelectorAll('.voice-guide-chip');
      chips.forEach(function(chip) {
        chip.addEventListener('click', function() {
          var cmd = this.getAttribute('data-vg-cmd');
          if (chatInput && cmd) {
            chatInput.value = cmd;
            sendMessage();
          }
        });
      });
      var toggles = chatMessages.querySelectorAll('.voice-guide-section-title');
      toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
          var idx = this.getAttribute('data-vg-toggle');
          var items = document.getElementById('vg-items-' + idx);
          if (items) {
            items.classList.toggle('hidden');
            this.classList.toggle('collapsed');
          }
        });
      });
    }, 100);
  }

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

  var pendingImageBase64 = null;
  var chatImageBtn = document.getElementById('chat-image-btn');
  var chatImageInput = document.getElementById('chat-image-input');

  if (chatImageBtn && chatImageInput) {
    chatImageBtn.addEventListener('click', function() { chatImageInput.click(); });
    chatImageInput.addEventListener('change', function() {
      var file = this.files && this.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하로 업로드해 주세요.');
        this.value = '';
        return;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        pendingImageBase64 = e.target.result;
        chatImageBtn.classList.add('has-image');
        var existing = document.querySelector('.chat-image-preview-bar');
        if (existing) existing.remove();
        var bar = document.createElement('div');
        bar.className = 'chat-image-preview-bar';
        bar.innerHTML = '<img src="' + pendingImageBase64 + '" alt="preview"><span>사진 첨부됨</span><button class="remove-image" title="제거">✕</button>';
        bar.querySelector('.remove-image').addEventListener('click', function() {
          pendingImageBase64 = null;
          chatImageBtn.classList.remove('has-image');
          bar.remove();
          chatImageInput.value = '';
        });
        var inputContainer = document.querySelector('.chat-input-container');
        if (inputContainer) inputContainer.insertBefore(bar, inputContainer.firstChild);
      };
      reader.readAsDataURL(file);
    });
  }

  async function sendMessage() {
    if (!chatInput || !chatMessages) return;

    const message = chatInput.value.trim();
    if (!message || isTyping) return;

    var attachedImage = pendingImageBase64;
    pendingImageBase64 = null;
    if (chatImageBtn) chatImageBtn.classList.remove('has-image');
    var previewBar = document.querySelector('.chat-image-preview-bar');
    if (previewBar) previewBar.remove();
    if (chatImageInput) chatImageInput.value = '';

    const welcomeScreen = chatMessages.querySelector('.chat-welcome');
    if (welcomeScreen) {
      welcomeScreen.style.display = 'none';
    }

    if (attachedImage) {
      addMessage('user', message + '<br><img src="' + attachedImage + '" class="chat-msg-image" style="max-width:200px;margin-top:6px;">');
    } else {
      addMessage('user', message);
    }
    chatInput.value = '';
    chatInput.style.height = 'auto';

    chatHistory.push({ role: 'user', content: attachedImage ? message + ' [사진 첨부됨]' : message });
    updateHeroSoaveFromChat(attachedImage ? message + ' [사진 첨부됨]' : message, '', 'neutral');

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
      var response = await callOpenAIChat(message, attachedImage || null);
      hideTypingIndicator();
      var parsed = parseActionFromResponse(response);
      addMessage('assistant', parsed.text);
      chatHistory.push({ role: 'assistant', content: parsed.text });
      updateHeroSoaveFromChat(message, parsed.text, getSoaveMoodFromText(parsed.text));
      // 액션을 TTS 재생보다 먼저 실행 (tts-off 시 이번 응답은 음성 재생 안 함)
      if (parsed.action) {
        executeAction(parsed.action);
      } else {
        var fallback = detectActionFromUserMessage(message);
        if (fallback) {
          executeAction(fallback);
        } else {
          var soaveFallback = detectSoaveVideoFromUserMessage(message);
          if (soaveFallback) {
            executeAction(soaveFallback);
          } else {
            var fashionFromResponse = detectFashionFromAIResponse(parsed.text, message, !!attachedImage);
            if (fashionFromResponse) executeAction(fashionFromResponse);
          }
        }
      }
      if (ttsEnabled) { playSoaveTTS(parsed.text); }
    } catch (error) {
      hideTypingIndicator();
      var errMsg = (error && error.message) ? error.message : String(error);
      var isQuotaError = errMsg === 'QUOTA_LIMIT' || /429|RESOURCE_EXHAUSTED|quota|rate limit/i.test(errMsg);
      var isApiKeyError = /incorrect api key|invalid api key|api key.*provided|OPENAI_API_KEY/i.test(errMsg);
      if (isQuotaError) {
        setChatQuota(CHAT_DAILY_LIMIT);
        addMessage('assistant', '오늘의 채팅 한도(' + CHAT_DAILY_LIMIT + '회)에 도달했습니다. 내일 다시 이용해 주세요. ☀️');
        if (chatSend) chatSend.disabled = true;
      } else if (isApiKeyError) {
        addMessage('assistant', '죄송합니다. 오류가 발생했습니다. 🙏<br><br><small>OpenAI API 키가 올바르지 않거나 만료되었을 수 있어요. 서버의 .env에서 OPENAI_API_KEY를 확인하고, 로컬에서는 <code>node scripts/local-server.js</code>로 실행해 주세요.</small>');
      } else {
        errMsg = errMsg.replace(/\bsk-[a-zA-Z0-9_-]{20,}/g, 'API key(숨김)').replace(/\bsk-proj-[^\s]+/g, 'API key(숨김)');
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
  async function callOpenAIChat(userMessage, imageBase64) {
    var messages = [
      { role: 'system', content: SYSTEM_PROMPT_BASE + getChatUserContext() }
    ];
    for (var i = 0; i < chatHistory.length; i++) {
      var msg = chatHistory[i];
      if (i >= chatHistory.length - 10) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
    if (imageBase64) {
      messages[messages.length - 1] = {
        role: 'user',
        content: [
          { type: 'text', text: userMessage },
          { type: 'image_url', image_url: { url: imageBase64, detail: 'low' } }
        ]
      };
    }
    var useModel = imageBase64 ? 'gpt-4o-mini' : 'gpt-4o-mini';
    var res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: useModel,
        messages: messages,
        max_tokens: 600,
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

  var SOAVE_VOICE_SYSTEM = '당신은 소아베(Soave)입니다. 사용자가 말한 것에 짧게 한두 문장으로 친근하게 대답하세요. 액션 태그나 긴 설명 없이 대화만 하세요.';
  async function callSoaveVoiceReply(userMessage) {
    var res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SOAVE_VOICE_SYSTEM },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.8
      })
    });
    var data = await res.json().catch(function() { return {}; });
    if (!res.ok) return '';
    var text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    return (text && parseActionFromResponse(text).text) ? parseActionFromResponse(text).text : (text || '');
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
  var soaveVoiceSession = false;

  function showSoaveVoiceHint() {
    var el = document.getElementById('soave-voice-hint');
    if (el) el.style.display = 'block';
  }
  function hideSoaveVoiceHint() {
    var el = document.getElementById('soave-voice-hint');
    if (el) el.style.display = 'none';
  }

  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = function(event) {
      var transcript = (event.results[0][0].transcript || '').trim();
      if (soaveVoiceSession) {
        soaveVoiceSession = false;
        stopRecording();
        hideSoaveVoiceHint();
        if (!transcript) return;
        var wrap = document.getElementById('soave-showcase-wrap');
        if (wrap) wrap.setAttribute('data-soave-mood', getSoaveMoodFromText(transcript));
        try {
          window.dispatchEvent(new CustomEvent('soave-react'));
        } catch (e) {}
        callSoaveVoiceReply(transcript).then(function(reply) {
          if (reply && wrap) wrap.setAttribute('data-soave-mood', getSoaveMoodFromText(reply));
          try { window.dispatchEvent(new CustomEvent('soave-react')); } catch (e2) {}
          if (reply) playSoaveTTS(reply);
        }).catch(function() {});
        return;
      }
      if (chatInput && transcript) {
        chatInput.value = transcript;
        sendMessage();
      }
      stopRecording();
    };

    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      var wasSoave = soaveVoiceSession;
      if (soaveVoiceSession) {
        soaveVoiceSession = false;
        hideSoaveVoiceHint();
      }
      stopRecording();
      if (event.error === 'not-allowed' && !wasSoave) {
        addMessage('assistant', '마이크 사용 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해 주세요. 🎤');
      }
    };

    recognition.onend = function() {
      if (soaveVoiceSession) {
        soaveVoiceSession = false;
        hideSoaveVoiceHint();
      }
      stopRecording();
    };
  }

  function startRecording(forSoaveVoice) {
    if (!recognition) return;
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    isRecording = true;
    if (micBtn && !forSoaveVoice) {
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

  // ========================================
  // Action Parser & Executor (Voice Navigation)
  // ========================================

  function detectActionFromUserMessage(message) {
    var msg = message.trim().replace(/\s+/g, ' ').toLowerCase();
    var navPatterns = [
      { id: 'lookbook-section', re: /연예인\s?룩|룩북|celeblook|lookbook|유사\s?옷\s?검색/ },
      { id: 'oneclick-runway', re: /런웨이|runway|뮤직비디오\s?만들/ },
      { id: 'shop-clothing', re: /의류|보라해\s?옷|옷\s?보여|clothing/ },
      { id: 'shop-ecobag', re: /에코백|ecobag/ },
      { id: 'shop-phonecase', re: /폰\s?케이스|핸드폰\s?케이스|phonecase/ },
      { id: 'shop-keyring', re: /키링|악?세서리|keyring|accessory/ },
      { id: 'shop-stationery', re: /문구|다이어리|stationery/ },
      { id: 'shop-sticker', re: /스티커|데코|sticker/ },
      { id: 'shop-lightstick', re: /응원봉|등불|lightstick/ },
      { id: 'shop', re: /굿즈|스토어|쇼핑|store|goods/ },
      { id: 'styling', re: /플레이|페르소나|이름\s?분석|한글\s?페르소나|play/ },
      { id: 'soul-color-section', re: /소울\s?컬러|생일\s?분석|soul\s?color/ },
      { id: 'lightstick', re: /매직\s?샵|크리에이트|안식처|magic\s?shop|create/ },
      { id: 'boratime', re: /보라타임|워치|시계|boratime|watch/ },
      { id: 'community', re: /커뮤니티|팬\s?모임|community/ },
      { id: 'events', re: /이벤트|행사|event/ },
      { id: 'content', re: /콘텐츠|팬\s?아트|갤러리|content/ },
      { id: 'membership', re: /멤버십|구독|가격|membership/ },
      { id: 'about', re: /보라해\s?소개|어바웃|about/ },
      { id: 'ebook', re: /전자책|이북|ebook/ },
      { id: 'comments', re: /댓글|코멘트|comment/ },
      { id: 'services', re: /서비스|뭐가\s?있/ }
    ];
    for (var i = 0; i < navPatterns.length; i++) {
      if (navPatterns[i].re.test(msg)) {
        return { type: 'navigate', value: navPatterns[i].id };
      }
    }
    if (/마이크\s*꺼|마이크\s*끄|마이크\s*비활성/i.test(msg)) return { type: 'chat', value: 'mic-off' };
    if (/마이크\s*켜|마이크\s*활성|마이크\s*켜줘/i.test(msg)) return { type: 'chat', value: 'mic-on' };
    if (/소아베\s*음성\s*꺼|소아베\s*음성\s*끄|음성\s*모드\s*꺼|음성\s*꺼줘|음성\s*응답\s*꺼|음성\s*비활성|음성\s*을\s*끄|음성\s*을\s*꺼|음성을\s*끄|음성을\s*꺼/i.test(msg)) return { type: 'chat', value: 'tts-off' };
    if (/소아베\s*음성으로\s*말해|소아베\s*음성\s*으로|음성으로\s*말해봐|음성\s*모드\s*활성화|음성\s*응답\s*켜|소리로\s*대답/i.test(msg)) return { type: 'chat', value: 'tts-on' };
    if (/bgm\s?듣기|배경음\s?켜|bgm\s?켜|음악\s?켜|음악\s?켜줘/i.test(msg)) return { type: 'click', value: 'bgm-toggle' };
    if (/bgm\s?끄기|배경음\s?끄|bgm\s?끄|음악\s?꺼|음악\s?꺼줘|음악\s?끄/i.test(msg)) return { type: 'click', value: 'bgm-toggle' };
    if (/한글\s?건축\s?체험|건축\s?체험|지니\s?체험/i.test(msg)) return { type: 'click', value: 'open-architecture-btn' };
    if (/내\s?탄생\s?뮤직|탄생\s?뮤직\s?만들|나만의\s?노래/i.test(msg)) return { type: 'click', value: 'soul-color-music-btn' };
    if (/다크\s?모드|어둡게|dark/i.test(msg)) return { type: 'click', value: 'theme-toggle' };
    if (/라이트\s?모드|밝게|light/i.test(msg)) return { type: 'click', value: 'theme-toggle' };
    if (/영어로|english/i.test(msg)) return { type: 'click', value: 'lang-en' };
    if (/한국어로|korean/i.test(msg)) return { type: 'click', value: 'lang-ko' };
    if (/로그인/i.test(msg)) return { type: 'click', value: 'nav-login-btn' };
    if (/로그아웃/i.test(msg)) return { type: 'click', value: 'nav-logout-btn' };
    if (/스타일링\s?시작|코디\s?추천/i.test(msg)) return { type: 'click', value: 'open-styling-result-btn' };
    if (/샘플|사랑의\s?인사.*체험|매직샵\s?체험/i.test(msg)) return { type: 'magicshop-sample', value: '' };
    if (/맨\s?위|처음으로|홈으로|scroll.*top/i.test(msg)) return { type: 'scroll-top', value: '' };
    var fashionAction = buildFashionAction(msg);
    if (fashionAction) return fashionAction;
    return null;
  }

  /** 컨텍스트가 길어져 AI가 액션 태그를 빼도, 사용자 말만으로 소아베 영상 카테고리 추론 (하트/춤/인사/호롱/고롱/우는표정 등) */
  function detectSoaveVideoFromUserMessage(message) {
    var msg = message.trim().replace(/\s+/g, ' ').toLowerCase();
    if (/하트\s*날려|하트\s*보내|하트\s*해줘|하트\s*줘|하트\s*날려줘|💜|❤|하트/i.test(msg)) return { type: 'play-soave-video', value: 'heart' };
    if (/웨이브|손\s*흔들|손흔들|wave/i.test(msg)) return { type: 'play-soave-video', value: 'wave' };
    if (/춤\s*춰|춤춰|춤\s*춰줘|춤\s*추어|dance/i.test(msg)) return { type: 'play-soave-video', value: 'dance' };
    if (/웃어|웃어줘|웃음|웃겨|laugh|미소/i.test(msg)) return { type: 'play-soave-video', value: 'laugh' };
    if (/인사|안녕|하이|헬로|hello|hi\b/i.test(msg)) return { type: 'play-soave-video', value: 'greeting' };
    if (/기쁘|좋아|신나|행복|happy|기분\s*좋/i.test(msg)) return { type: 'play-soave-video', value: 'happy' };
    if (/응원|화이팅|격려|cheer|파이팅/i.test(msg)) return { type: 'play-soave-video', value: 'cheer' };
    if (/놀라|깜짝|surprise/i.test(msg)) return { type: 'play-soave-video', value: 'surprise' };
    if (/슬퍼|눈물|울고\s*싶|울어|우는\s*표정|울어줘|눈물\s*나|cry|슬픔/i.test(msg)) return { type: 'play-soave-video', value: 'cry' };
    if (/호롱\s*꽃|호롱꽃/i.test(msg)) return { type: 'play-soave-video', value: 'horong_flower' };
    if (/호롱\s*천하장사|호롱\s*장사|천하장사/i.test(msg)) return { type: 'play-soave-video', value: 'horong_strong' };
    if (/고롱\s*발명가|고롱\s*발명|고롱/i.test(msg)) return { type: 'play-soave-video', value: 'gorong_inventor' };
    if (/호롱|한글\s*캐릭터|horong/i.test(msg)) return { type: 'play-soave-video', value: ['horong', 'horong_flower', 'horong_strong'] };
    if (/실망|짜증|한심|우울|disappointed|annoyed|gloomy/i.test(msg)) return { type: 'play-soave-video', value: 'disappointed' };
    if (/조심|careful/i.test(msg)) return { type: 'play-soave-video', value: 'careful' };
    if (/걷기|걷어|walk/i.test(msg)) return { type: 'play-soave-video', value: 'walk' };
    if (/뛰기|뛰어|run/i.test(msg)) return { type: 'play-soave-video', value: 'run' };
    if (/점프|jump/i.test(msg)) return { type: 'play-soave-video', value: 'jump' };
    if (/배려|care/i.test(msg)) return { type: 'play-soave-video', value: 'care' };
    return null;
  }

  var FASHION_PROMPTS = {
    casual: 'A stylish K-pop inspired casual outfit on a faceless white mannequin, oversized hoodie, wide-leg jeans, white sneakers, tote bag, soft pastel studio background, fashion photography style, no face, no human features',
    formal: 'An elegant K-pop inspired formal outfit flat lay on white background, silk blouse, tailored blazer, slim pants, pearl accessories, fashion magazine editorial style, no face, no human',
    concert: 'A dazzling K-pop concert outfit on a faceless mannequin, sparkly sequin crop top, leather mini skirt, platform boots, lightstick-style accessories, dramatic stage lighting, fashion editorial, no face, no human',
    street: 'A trendy K-pop street fashion outfit on a faceless mannequin, oversized bomber jacket, graphic tee, cargo pants, chunky sneakers, bucket hat, urban city background, street style photography, no face, no human',
    cute: 'An adorable K-pop cute style outfit on a faceless mannequin, pastel cardigan, pleated mini skirt, mary jane shoes, ribbon accessories, soft pastel color palette, dreamy studio background, fashion photography, no face, no human',
    sporty: 'A sporty K-pop athleisure outfit on a faceless mannequin, cropped hoodie, leggings, white running shoes, cap, gym bag, clean white studio background, fitness fashion photography, no face, no human',
    vintage: 'A vintage retro K-pop inspired outfit on a faceless mannequin, corduroy jacket, high-waist flare pants, platform shoes, retro sunglasses, warm film-grain aesthetic background, fashion editorial, no face, no human',
    romantic: 'A romantic K-pop date outfit on a faceless mannequin, flowing dress with lace details, delicate jewelry, strappy heels, small clutch purse, soft bokeh garden background, fashion photography, no face, no human'
  };

  function detectFashionStyle(msg) {
    if (/캐쥬얼|캐주얼|casual|편한|일상/i.test(msg)) return 'casual';
    if (/포멀|formal|정장|격식|비즈니스/i.test(msg)) return 'formal';
    if (/콘서트|concert|무대|공연|라이브/i.test(msg)) return 'concert';
    if (/스트릿|street|힙합|힙/i.test(msg)) return 'street';
    if (/큐트|cute|귀여|러블리|lovely/i.test(msg)) return 'cute';
    if (/스포티|sporty|운동|애슬레저|스포츠/i.test(msg)) return 'sporty';
    if (/빈티지|vintage|레트로|retro|복고/i.test(msg)) return 'vintage';
    if (/로맨틱|romantic|데이트|여성스러|우아/i.test(msg)) return 'romantic';
    return null;
  }

  function buildFashionAction(msg) {
    var isFashionReq = /패션|옷|코디|스타일|의상|룩|fashion|outfit|look|style/i.test(msg) &&
                       /만들|보여|생성|그려|추천|이미지|사진|image|create|show|generate/i.test(msg);
    var directStyle = detectFashionStyle(msg);
    if (isFashionReq || directStyle) {
      var style = directStyle || 'casual';
      return { type: 'generate-fashion', value: FASHION_PROMPTS[style] || FASHION_PROMPTS.casual };
    }
    return null;
  }

  function detectFashionFromAIResponse(aiText, userMsg, hasImage) {
    var aiLower = aiText.toLowerCase();
    var userLower = userMsg.toLowerCase();
    var aiMentionsFashion = /패션|코디|스타일링|만들어|이미지.*생성|옷.*만들/i.test(aiLower);
    var userWantsFashion = /패션|옷|코디|스타일|의상|룩|만들어|보여줘|생성|캐쥬얼|캐주얼|포멀|콘서트|스트릿|큐트|스포티|빈티지|로맨틱/i.test(userLower);
    if (aiMentionsFashion && userWantsFashion) {
      var style = detectFashionStyle(userLower) || 'casual';
      return { type: 'generate-fashion', value: FASHION_PROMPTS[style] || FASHION_PROMPTS.casual };
    }
    if (hasImage && userWantsFashion) {
      var style = detectFashionStyle(userLower) || 'casual';
      return { type: 'generate-fashion', value: FASHION_PROMPTS[style] || FASHION_PROMPTS.casual };
    }
    return null;
  }

  function parseActionFromResponse(response) {
    var actionRegex = /\[ACTION:([\w-]+)(?::([^\]]*))?\]\s*$/;
    var match = response.match(actionRegex);
    if (!match) {
      // 컨텍스트가 길어져 응답이 잘리면 태그가 끝에 없을 수 있음 → 응답 전체에서 play-soave-video만 추가로 탐색
      var soaveRegex = /\[ACTION:play-soave-video:([\w-]+)\]/g;
      var lastSoave = null, m;
      while ((m = soaveRegex.exec(response)) !== null) lastSoave = m;
      if (lastSoave) {
        var text = response.replace(/\s*\[ACTION:play-soave-video:[\w-]+\]\s*/g, '').trim();
        return { text: text, action: { type: 'play-soave-video', value: lastSoave[1] } };
      }
      return { text: response, action: null };
    }
    var text = response.replace(actionRegex, '').trim();
    return {
      text: text,
      action: { type: match[1], value: match[2] || '' }
    };
  }

  function executeAction(action) {
    // tts-on/tts-off, mic-on/mic-off는 즉시 실행
    if (action.type === 'chat' && /^(tts-on|tts-off|mic-on|mic-off)$/.test(action.value)) {
      handleChatAction(action.value);
      return;
    }
    // 소아베 영상은 채팅과 맞추기 위해 지연 없이 즉시 재생 (다른 요청 시 해당 카테고리로 바로 전환)
    if (action.type === 'play-soave-video') {
      if (action.value) {
        try {
          var val = action.value;
          var detail;
          if (Array.isArray(val)) {
            detail = { categories: val };
          } else if (typeof val === 'string' && val.indexOf(',') !== -1) {
            detail = { categories: val.split(',').map(function(s) { return s.trim(); }).filter(Boolean) };
          } else {
            detail = { category: val };
          }
          window.dispatchEvent(new CustomEvent('play-soave-video', { detail: detail }));
        } catch (e) {}
      }
      return;
    }
    setTimeout(function() {
      switch (action.type) {
        case 'navigate':
          navigateToSection(action.value);
          break;
        case 'input-name':
          inputNameAndGenerate(action.value);
          break;
        case 'input-birthday':
          inputBirthdayAndAnalyze(action.value);
          break;
        case 'click':
          clickButton(action.value);
          break;
        case 'magicshop-sample':
          runMagicShopSample();
          break;
        case 'download-ebook':
          downloadEbook(action.value);
          break;
        case 'scroll-top':
          closeChat();
          setTimeout(function() { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 300);
          break;
        case 'start-styling':
          clickButton('open-styling-result-btn');
          break;
        case 'chat':
          handleChatAction(action.value);
          break;
        case 'open-modal':
          openInfoModal(action.value);
          break;
        case 'teros-story':
          openTerosStory();
          break;
        case 'generate-fashion':
          generateChatFashionImage(action.value);
          break;
      }
    }, 1500);
  }

  async function generateChatFashionImage(prompt) {
    if (!prompt) return;
    var userId = await getCurrentUserId();
    var msgDiv = document.createElement('div');
    msgDiv.className = 'message assistant';
    var time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    msgDiv.innerHTML = '<div class="message-avatar"><img src="image/soave/soave-avatar-face.png" alt="소아베" class="message-avatar-img" width="36" height="36"></div><div class="message-content"><div class="message-bubble"><div class="chat-generating-indicator"><div class="spinner"></div><span>패션 이미지를 생성하고 있어요... (약 10~15초)</span></div></div><span class="message-time">' + time + '</span></div>';
    var chatMessages = document.getElementById('chat-messages');
    if (chatMessages) { chatMessages.appendChild(msgDiv); chatMessages.scrollTop = chatMessages.scrollHeight; }
    try {
      var body = { prompt: prompt, size: '1024x1024', quality: 'standard' };
      if (userId) body.userId = userId;
      var res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        var errText = await res.text();
        console.error('DALL-E API error:', res.status, errText);
        var errMsg = errText;
        try {
          var errJson = JSON.parse(errText);
          errMsg = (errJson.error && errJson.error.message) || errText;
          if (errJson.error && errJson.error.code === 'MEMBERSHIP_LIMIT') {
            errMsg = 'AI 스타일링 사용 한도가 초과되었습니다. 멤버십을 업그레이드해 주세요.';
          }
        } catch (e) {}
        var bubble = msgDiv.querySelector('.message-bubble');
        bubble.innerHTML = '<p>😢 ' + errMsg.slice(0, 200) + '</p>';
        return;
      }
      var data = await res.json();
      if (data.data && data.data[0] && data.data[0].url) {
        var imgUrl = data.data[0].url;
        var bubble = msgDiv.querySelector('.message-bubble');
        bubble.innerHTML = '<img src="' + imgUrl + '" alt="패션 이미지" class="chat-msg-image" onclick="window.open(this.src,\'_blank\')" style="max-width:100%;border-radius:12px;cursor:pointer;">' +
          '<div class="chat-img-actions">' +
            '<button class="chat-img-download-btn" title="이미지 다운로드"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> 다운로드</button>' +
            '<button class="chat-img-newtab-btn" title="새 탭에서 보기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> 새 탭</button>' +
          '</div>' +
          '<p style="margin-top:8px;font-size:0.85rem;color:var(--text-muted)">💜 이 옷을 직접 입혀보고 싶다면 <strong>보라해 스타일링</strong>에서 가상 피팅도 가능해!</p>';
        var dlBtn = bubble.querySelector('.chat-img-download-btn');
        if (dlBtn) {
          dlBtn.addEventListener('click', function() {
            dlBtn.disabled = true;
            dlBtn.textContent = '저장 중...';
            fetch('/api/image-proxy?url=' + encodeURIComponent(imgUrl)).then(function(r) { return r.blob(); }).then(function(blob) {
              var a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'borahae-fashion-' + Date.now() + '.png';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(a.href);
              dlBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> 다운로드';
              dlBtn.disabled = false;
            }).catch(function(e) {
              console.error('Image download error:', e);
              window.open(imgUrl, '_blank');
              dlBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> 다운로드';
              dlBtn.disabled = false;
            });
          });
        }
        var ntBtn = bubble.querySelector('.chat-img-newtab-btn');
        if (ntBtn) {
          ntBtn.addEventListener('click', function() { window.open(imgUrl, '_blank'); });
        }
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
      } else {
        var errMsg = (data.error && data.error.message) ? data.error.message : JSON.stringify(data);
        console.error('DALL-E response error:', errMsg);
        var bubble = msgDiv.querySelector('.message-bubble');
        bubble.innerHTML = '<p>😢 ' + errMsg.slice(0, 200) + '</p>';
      }
    } catch (err) {
      console.error('generateChatFashionImage error:', err);
      var bubble = msgDiv.querySelector('.message-bubble');
      bubble.innerHTML = '<p>😢 네트워크 오류: ' + (err.message || '알 수 없는 오류') + '</p>';
    }
  }

  function closeChat() {
    if (chatWidget) chatWidget.classList.remove('active');
  }

  function navigateToSection(sectionId) {
    var el = document.getElementById(sectionId);
    if (!el) return;
    closeChat();
    setTimeout(function() {
      if (el.classList.contains('shop-cat-block')) {
        var allBlocks = document.querySelectorAll('.shop-cat-block');
        var allBtns = document.querySelectorAll('.shop-cat-btn');
        allBlocks.forEach(function(b) { b.classList.remove('active'); });
        allBtns.forEach(function(b) { b.classList.remove('active'); });
        el.classList.add('active');
        var matchBtn = document.querySelector('.shop-cat-btn[href="#' + sectionId + '"]');
        if (matchBtn) matchBtn.classList.add('active');
        setTimeout(function() {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }

  function clickButton(btnId) {
    if (!btnId) return;
    var noCloseIds = ['theme-toggle', 'lang-ko', 'lang-en', 'bgm-toggle', 'name-episodes-share-btn',
      'save-result', 'retry-analysis', 'generate-fashion-btn',
      'taste-like-fashion-btn', 'finish-styling', 'soave-nav-prev', 'soave-nav-next',
      'soave-mute-btn', 'nav-logout-btn', 'go-to-tryon', 'generate-tryon-btn',
      'download-tryon-btn', 'arch-generate-again-btn', 'arch-retry-btn',
      'ls-download-btn', 'ls-share-btn', 'ls-retry-btn', 'ls-generate-btn'];
    var needsNavigate = {
      'open-styling-result-btn': 'styling',
      'arch-use-sample-btn': 'lightstick',
      'arch-generate-btn': 'lightstick',
      'arch-generate-again-btn': 'lightstick',
      'arch-retry-btn': 'lightstick',
      'open-architecture-btn': 'lightstick',
      'soul-color-music-btn': 'soul-color-section',
      'open-lightstick-btn': 'shop-lightstick',
      'open-community-btn': 'community',
      'open-events-btn': 'events',
      'open-content-btn': 'content'
    };
    var shouldClose = noCloseIds.indexOf(btnId) === -1;
    if (shouldClose) closeChat();

    var nav = needsNavigate[btnId];
    if (nav) {
      setTimeout(function() {
        var section = document.getElementById(nav);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(function() {
          var btn = document.getElementById(btnId);
          if (btn) btn.click();
        }, 800);
      }, 300);
    } else {
      setTimeout(function() {
        var btn = document.getElementById(btnId);
        if (btn) btn.click();
      }, shouldClose ? 300 : 100);
    }
  }

  function inputNameAndGenerate(name) {
    if (!name) return;
    var nameInput = document.getElementById('name-episodes-input');
    var nameBtn = document.getElementById('name-episodes-btn');
    if (!nameInput || !nameBtn) return;
    closeChat();
    setTimeout(function() {
      var section = document.getElementById('styling');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function() {
        nameInput.value = name;
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(function() { nameBtn.click(); }, 500);
      }, 600);
    }, 300);
  }

  function inputBirthdayAndAnalyze(dateStr) {
    if (!dateStr) return;
    var dateInput = document.getElementById('soul-color-date');
    var dateBtn = document.getElementById('soul-color-btn');
    if (!dateInput || !dateBtn) return;
    closeChat();
    setTimeout(function() {
      var section = document.getElementById('soul-color-section');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function() {
        dateInput.value = dateStr;
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
        setTimeout(function() { dateBtn.click(); }, 500);
      }, 600);
    }, 300);
  }

  function runMagicShopSample() {
    closeChat();
    setTimeout(function() {
      var section = document.getElementById('lightstick');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function() {
        var sampleBtn = document.getElementById('arch-use-sample-btn');
        if (sampleBtn) {
          sampleBtn.click();
          setTimeout(function() {
            var generateBtn = document.getElementById('arch-generate-btn');
            if (generateBtn && !generateBtn.disabled) {
              generateBtn.click();
            }
          }, 800);
        }
      }, 800);
    }, 300);
  }

  var ebookLinks = {
    '1': 'book/ai-sketch-heart.pdf',
    '2': 'book/ai-art-spark.pdf',
    '3': 'book/ai-sculpt-shadow.pdf',
    '4': 'book/ai-design-future.pdf',
    'all': 'book/ai-books-all.zip'
  };
  var ebookNames = {
    '1': '1권_AI_마음을_스케치하다.pdf',
    '2': '2권_AI_재능의_우주를_항해하다.pdf',
    '3': '3권_AI_그림자를_조각하다.pdf',
    '4': '4권_AI_내일을_조각하다.pdf',
    'all': '보라해_AI_전자책_전권.zip'
  };

  function downloadEbook(vol) {
    var href = ebookLinks[vol];
    var name = ebookNames[vol];
    if (!href) return;
    closeChat();
    setTimeout(function() {
      var section = document.getElementById('ebook');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function() {
        var a = document.createElement('a');
        a.href = href;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 800);
    }, 300);
  }

  function handleChatAction(cmd) {
    switch (cmd) {
      case 'open':
        if (chatWidget && !chatWidget.classList.contains('active')) {
          chatWidget.classList.add('active');
          if (chatInput) chatInput.focus();
        }
        break;
      case 'close':
        closeChat();
        break;
      case 'tts-on':
        ttsEnabled = true;
        var ttsOnBtn = document.getElementById('chat-tts-toggle');
        if (ttsOnBtn) {
          ttsOnBtn.classList.add('active');
          var onIcon = ttsOnBtn.querySelector('.icon-speaker-on');
          var offIcon = ttsOnBtn.querySelector('.icon-speaker-off');
          if (onIcon) onIcon.style.display = '';
          if (offIcon) offIcon.style.display = 'none';
          ttsOnBtn.setAttribute('aria-label', '음성 응답 끄기');
          ttsOnBtn.title = '소아베 음성 응답 끄기';
        }
        break;
      case 'tts-off':
        ttsEnabled = false;
        if (currentAudio) { currentAudio.pause(); currentAudio = null; }
        requestAnimationFrame(function() {
          var ttsBtn = document.getElementById('chat-tts-toggle');
          if (ttsBtn) {
            ttsBtn.classList.remove('active');
            var onIcon = ttsBtn.querySelector('.icon-speaker-on');
            var offIcon = ttsBtn.querySelector('.icon-speaker-off');
            if (onIcon) onIcon.style.display = 'none';
            if (offIcon) offIcon.style.display = 'inline';
            ttsBtn.setAttribute('aria-label', '음성 응답 켜기');
            ttsBtn.title = '소아베 음성 응답 켜기';
          }
        });
        break;
      case 'mic-on':
        if (recognition && !isRecording) startRecording();
        break;
      case 'mic-off':
        if (isRecording) stopRecording();
        break;
    }
  }

  function openInfoModal(modalName) {
    closeChat();
    setTimeout(function() {
      var link = document.querySelector('[data-modal="' + modalName + '"]');
      if (link) {
        link.click();
      }
    }, 300);
  }

  function openTerosStory() {
    closeChat();
    setTimeout(function() {
      var modal = document.getElementById('teros-story-modal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }, 300);
  }

  var SOAVE_AVATAR_URL = 'image/soave/soave-avatar-face.png';

  function getSoaveMoodFromText(text) {
    if (!text || typeof text !== 'string') return 'neutral';
    var t = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    if (/기쁘|웃|고마|땡큐|감사|좋아|사랑|최고|응원|파이팅|💜|❤|😊|🎉|✨/.test(t)) return 'happy';
    if (/생각|음\.|그렇|흠|고민|궁금|알겠|확인/.test(t)) return 'thinking';
    if (/미안|죄송|아쉽|슬프|힘들/.test(t)) return 'sad';
    if (/와!|대단|신나|와우|멋지|놀라/.test(t)) return 'excited';
    return 'neutral';
  }

  function updateHeroSoaveFromChat(lastUserMsg, lastAssistantMsg, mood) {
    var wrap = document.getElementById('soave-showcase-wrap');
    var defaultCta = document.getElementById('hero-soave-cta-default');
    var preview = document.getElementById('hero-soave-chat-preview');
    var previewUser = document.getElementById('hero-soave-preview-user');
    var previewAssistant = document.getElementById('hero-soave-preview-assistant');
    if (!wrap || !defaultCta || !preview) return;
    var hasChat = !!(lastUserMsg || lastAssistantMsg);
    if (hasChat) {
      defaultCta.style.display = 'none';
      preview.style.display = 'block';
      if (previewUser) previewUser.textContent = lastUserMsg ? (lastUserMsg.length > 40 ? lastUserMsg.slice(0, 40) + '…' : lastUserMsg) : '';
      if (previewAssistant) {
        var plain = (lastAssistantMsg || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        previewAssistant.textContent = plain.length > 60 ? plain.slice(0, 60) + '…' : plain;
      }
      wrap.setAttribute('data-soave-mood', mood || 'neutral');
    } else {
      defaultCta.style.display = '';
      preview.style.display = 'none';
      wrap.setAttribute('data-soave-mood', 'neutral');
    }
  }

  function syncHeroSoaveFromChatHistory() {
    var lastUser = '';
    var lastAssistant = '';
    for (var i = 0; i < chatHistory.length; i++) {
      if (chatHistory[i].role === 'user') lastUser = chatHistory[i].content;
      if (chatHistory[i].role === 'assistant') lastAssistant = chatHistory[i].content;
    }
    updateHeroSoaveFromChat(lastUser, lastAssistant, getSoaveMoodFromText(lastAssistant));
  }

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
      return 'Generate the video by rotating 360 degrees around the final building. 최종 건축물을 중심으로 360도 회전하면서 영상을 생성해 주세요. Cinematic 8-second video of the EXACT SAME building shown in the attached image. This is the final Hangeul future architecture building—maintain the same building shape, form, color distribution (7 colors: red, orange, yellow, green, blue, indigo, violet), plaza/forecourt layout, and surrounding futuristic context as shown in the image. The camera slowly orbits or pans around the building (360 degrees); other futuristic structures or landscape visible in the background. Photorealistic, natural or dramatic daylight, soft shadows. No text or labels. Serene, innovative atmosphere. Keep the building design consistent with the attached image—this video is part of the same architectural story (concept board → final building → video).';
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

      if (!GEMINI_API_KEY) {
        if (archModal) {
          archModal.classList.add('active');
          archModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
        showArchLoading();
        showArchError(getArchErrorText('arch.error_no_api_key'), true);
        return;
      }

      var imgSrc = null;
      var finalImg = document.getElementById('arch-final-image');
      if (finalImg && finalImg.src && finalImg.src.indexOf('data:image') === 0) imgSrc = finalImg.src;
      if (!imgSrc && window.__lastArchBuildingImageBase64) {
        imgSrc = 'data:image/png;base64,' + window.__lastArchBuildingImageBase64;
      }
      if (!imgSrc) {
        if (archModal) {
          archModal.classList.add('active');
          archModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
        showArchLoading();
        showArchError(window.__simsI18n && window.__simsI18n.t ? window.__simsI18n.t('arch.video_need_final_image') : '3. 최종 건축 디자인을 먼저 생성한 뒤 동영상 생성을 눌러 주세요.', true);
        return;
      }

      showVideoGeneratingToast();

      try {
        setLoadingVideo();
        var videoPrompt = buildArchitectureVideoPromptFromImage();
        var opName = await startVeoVideoGenerationWithFirstFrameViaFiles(videoPrompt, imgSrc);
        var result = await pollVeoOperation(opName);
        var videoUri = result.response && result.response.generateVideoResponse && result.response.generateVideoResponse.generatedSamples && result.response.generateVideoResponse.generatedSamples[0] && result.response.generateVideoResponse.generatedSamples[0].video && result.response.generateVideoResponse.generatedSamples[0].video.uri;
        if (!videoUri) {
          hideVideoGeneratingToast();
          if (archModal) {
            archModal.classList.add('active');
            archModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
          }
          showArchLoading();
          showArchError('영상 생성 결과를 가져올 수 없습니다.', true);
          return;
        }
        var blob = await fetchVeoVideoBlob(videoUri);
        hideVideoGeneratingToast();
        if (archModal) {
          archModal.classList.add('active');
          archModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
        showArchVideoResult(blob);
      } catch (err) {
        hideVideoGeneratingToast();
        var msg = (err && err.message) ? String(err.message) : '';
        if (/unregistered callers|API Key|API key|identity|quota|not available|403|404/i.test(msg)) {
          msg = getArchErrorText('arch.error_veo_hint');
        }
        if (archModal) {
          archModal.classList.add('active');
          archModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
        showArchLoading();
        showArchError(msg || '한글 건축 영상 생성 중 오류가 발생했습니다.', true);
        console.error('Architecture video error:', err);
      }
    }

    var archFinalVideoBtn = document.getElementById('arch-final-video-btn');
    if (archFinalVideoBtn) {
      archFinalVideoBtn.addEventListener('click', function () {
        var finalImg = document.getElementById('arch-final-image');
        var imgSrc = finalImg && finalImg.src && finalImg.src.indexOf('data:image') === 0 ? finalImg.src : (window.__lastArchBuildingImageBase64 ? 'data:image/png;base64,' + window.__lastArchBuildingImageBase64 : null);
        if (!imgSrc) {
          if (archModal) {
            archModal.classList.add('active');
            archModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
          }
          showArchError(window.__simsI18n && window.__simsI18n.t ? window.__simsI18n.t('arch.video_need_final_image') : '3. 최종 건축 디자인을 먼저 생성한 뒤 동영상 생성을 눌러 주세요.', true);
          return;
        }
        runNanoBananaArchitectureVideo();
      });
    }

    var archComingSoonModal = document.getElementById('arch-coming-soon-modal');
    var archComingSoonClose = document.getElementById('arch-coming-soon-close');
    var archComingSoonConfirm = document.getElementById('arch-coming-soon-confirm');
    function openArchComingSoonModal() {
      if (archComingSoonModal) {
        var finalImg = document.getElementById('arch-final-image');
        var guideImg = document.getElementById('arch-genie-guide-image');
        var noImgMsg = document.getElementById('arch-genie-guide-no-image');
        if (guideImg && noImgMsg) {
          if (finalImg && finalImg.src && finalImg.src.indexOf('data:image') === 0) {
            guideImg.src = finalImg.src;
            guideImg.style.display = '';
            noImgMsg.style.display = 'none';
          } else {
            guideImg.style.display = 'none';
            guideImg.removeAttribute('src');
            noImgMsg.style.display = '';
          }
        }
        var promptEl = document.getElementById('arch-genie-guide-prompt');
        if (promptEl) {
          var promptText = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t('arch.genie_prompt_text') : 'Use this building image as input. Let me freely explore inside the building and see every corridor, hall, and room in detail in an interactive experience.';
          promptEl.value = promptText;
        }
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
    var archGenieGuideCopy = document.getElementById('arch-genie-guide-copy');
    if (archGenieGuideCopy) {
      archGenieGuideCopy.addEventListener('click', function() {
        var ta = document.getElementById('arch-genie-guide-prompt');
        if (!ta || !ta.value) return;
        ta.select();
        ta.setSelectionRange(0, 99999);
        try {
          navigator.clipboard.writeText(ta.value);
          var orig = archGenieGuideCopy.textContent;
          archGenieGuideCopy.textContent = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t('arch.genie_guide_copied') : 'Copied!';
          setTimeout(function() { archGenieGuideCopy.textContent = orig; }, 2000);
        } catch (err) {
          console.warn('Copy failed', err);
        }
      });
    }
    if (openArchBtn) {
      openArchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openArchComingSoonModal();
      });
    }
    if (archModal) {
      if (archCloseBtn) archCloseBtn.addEventListener('click', closeArchitectureModal);
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
          // 영상인 경우: blob으로 다운로드
          if (lastArchNanoVideoBlob) {
            var url = URL.createObjectURL(lastArchNanoVideoBlob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'hangeul-architecture-nano.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            return;
          }
          // 이미지인 경우
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

    // 한글 공감각 건축 표준 시스템: 우측 정사각형 공간에서 그림 7장(0~6) → 이어서 ani 영상 순차 재생 후 반복
    (function initMagicshopHangeulCarousel() {
      var idleEl = document.getElementById('magicshop-display-idle');
      var carouselEl = document.getElementById('magicshop-hangeul-carousel');
      var carouselImg = document.getElementById('magicshop-hangeul-carousel-img');
      var carouselVideo = document.getElementById('magicshop-hangeul-carousel-video');
      if (!idleEl || !carouselEl || !carouselImg || !carouselVideo) return;

      var IMAGE_BASE = 'image/hangeul/system/information/';
      var VIDEO_BASE = 'image/hangeul/system/ani/';
      var IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'svg'];
      var NUM_IMAGES = 7;
      var NUM_VIDEOS = 10;
      var IMAGE_HOLD_MS = 3800;
      var FADE_MS = 1200;
      function tryLoadImage(index, extIndex) {
        if (extIndex >= IMAGE_EXTENSIONS.length) {
          var placeholder = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%236b21a8"/><text x="200" y="200" font-family="sans-serif" font-size="24" fill="rgba(255,255,255,0.9)" text-anchor="middle" dy=".35em">한글 공감각 건축</text><text x="200" y="235" font-family="sans-serif" font-size="14" fill="rgba(255,255,255,0.7)" text-anchor="middle">' + (index + 1) + ' / 7</text></svg>');
          carouselImg.alt = '한글 공감각 건축 표준 시스템 구조 ' + (index + 1);
          carouselImg.style.display = 'block';
          carouselImg.onerror = null;
          carouselImg.onload = function() {
            carouselImg.onload = null;
            requestAnimationFrame(function() { carouselImg.classList.add('visible'); });
            setTimeout(function() {
              carouselImg.classList.remove('visible');
              setTimeout(function() { scheduleNext(true, index + 1); }, FADE_MS);
            }, IMAGE_HOLD_MS);
          };
          carouselImg.src = placeholder;
          return;
        }
        var ext = IMAGE_EXTENSIONS[extIndex];
        var url = IMAGE_BASE + index + '.' + ext;
        carouselImg.src = url;
        carouselImg.alt = '한글 공감각 건축 표준 시스템 구조 ' + (index + 1);
        carouselImg.style.display = 'block';
        carouselImg.onerror = function() { tryLoadImage(index, extIndex + 1); };
        carouselImg.onload = function() {
          carouselImg.onerror = null;
          carouselImg.onload = null;
          requestAnimationFrame(function() { carouselImg.classList.add('visible'); });
          setTimeout(function() {
            carouselImg.classList.remove('visible');
            setTimeout(function() { scheduleNext(true, index + 1); }, FADE_MS);
          }, IMAGE_HOLD_MS);
        };
      }

      function showMedia(isImage, index) {
        carouselImg.classList.remove('visible');
        carouselVideo.classList.remove('visible');
        carouselImg.style.display = 'none';
        carouselVideo.style.display = 'none';
        carouselVideo.pause();
        carouselVideo.removeAttribute('src');
        if (idleEl) idleEl.classList.add('magicshop-display-idle--carousel-active');
        if (isImage) {
          tryLoadImage(index, 0);
        } else {
          carouselVideo.style.display = 'block';
          var fileNum = index + 1;
          var tryMp4 = function() {
            carouselVideo.src = VIDEO_BASE + fileNum + '.mp4';
            carouselVideo.onerror = function() {
              carouselVideo.onerror = null;
              carouselVideo.src = VIDEO_BASE + fileNum + '.webm';
              carouselVideo.onerror = function() { scheduleNext(false, index + 1); };
              carouselVideo.onloadeddata = function() {
                carouselVideo.onloadeddata = null;
                requestAnimationFrame(function() { carouselVideo.classList.add('visible'); });
                carouselVideo.play();
              };
            };
            carouselVideo.onloadeddata = function() {
              carouselVideo.onerror = null;
              carouselVideo.onloadeddata = null;
              requestAnimationFrame(function() { carouselVideo.classList.add('visible'); });
              carouselVideo.play();
            };
          };
          tryMp4();
        }
      }

      function scheduleNext(isImagePhase, nextIndex) {
        if (isImagePhase) {
          if (nextIndex < NUM_IMAGES) {
            showMedia(true, nextIndex);
          } else {
            showMedia(false, 0);
          }
          return;
        }
        carouselVideo.onended = null;
        if (nextIndex < NUM_VIDEOS) {
          showMedia(false, nextIndex);
        } else {
          setTimeout(function() { showMedia(true, 0); }, 300);
        }
      }

      carouselVideo.addEventListener('ended', function onVideoEnded() {
        var src = carouselVideo.src || '';
        var match = src.match(/(\d+)\.(mp4|webm)/);
        var current = match ? parseInt(match[1], 10) : 1;
        var next = current + 1;
        if (next > 10) {
          carouselVideo.classList.remove('visible');
          setTimeout(function() { showMedia(true, 0); }, 300);
        } else {
          carouselVideo.classList.remove('visible');
          setTimeout(function() { showMedia(false, next - 1); }, 300);
        }
      });

      carouselVideo.addEventListener('error', function() {
        var src = carouselVideo.src || '';
        var match = src.match(/(\d+)\.(mp4|webm)/);
        var current = match ? parseInt(match[1], 10) : 1;
        var next = current + 1;
        if (next > 10) {
          setTimeout(function() { showMedia(true, 0); }, 500);
        } else {
          setTimeout(function() { showMedia(false, next - 1); }, 500);
        }
      });

      setTimeout(function() {
        var style = window.getComputedStyle(idleEl);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          showMedia(true, 0);
        }
      }, 800);
    })();

    // 한글 시스템 갤러리 (image/hangeul/system/gallery) — 폴더 내 전체 이미지 적용
    (function initMagicshopHangeulGallery() {
      var container = document.getElementById('magicshop-hangeul-gallery');
      if (!container) return;
      var GALLERY_BASE = 'image/hangeul/system/gallery/';
      var GALLERY_FILES = ['1 (1).webp', '1 (2).webp', '1 (3).webp', '1 (4).webp', '1 (5).webp', '1 (6).webp', '1 (7).webp', '1 (9).webp', '1 (10).webp', '1 (11).webp', '2 (1).webp', '2 (2).webp', '2 (3).webp', '2 (4).webp', '2 (9).webp', '2 (11).webp', '2 (12).webp', '2 (13).webp', '2 (14).webp', '2 (15).webp', '2 (16).webp'];
      GALLERY_FILES.forEach(function (name, i) {
        var wrap = document.createElement('div');
        wrap.className = 'magicshop-hangeul-gallery-item';
        var img = document.createElement('img');
        img.src = GALLERY_BASE + encodeURIComponent(name);
        img.alt = ((window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t('arch.hangeul_gallery_title') : '한글 공감각 건축 갤러리') + ' ' + (i + 1);
        img.loading = 'lazy';
        wrap.appendChild(img);
        container.appendChild(wrap);
      });
    })();

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
      function setDropzoneFileLabel(fileName, isSampleApplied) {
        if (!dropzoneTextEl) return;
        if (fileName) {
          dropzoneTextEl.textContent = isSampleApplied ? fileName : ((t('arch.file_selected') || '\u2713 \uc120\ud0dd\ub41c \ud30c\uc77c: ') + fileName);
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
        setDropzoneFileLabel(t('arch.sample_applied_dropzone'), true);
      });

      if (midiInput) {
        midiInput.addEventListener('change', function() {
          var file = this.files && this.files[0];
          if (file) {
            var isPdf = file.type === 'application/pdf' || (file.name && file.name.toLowerCase().endsWith('.pdf'));
            var isImage = (file.type && file.type.indexOf('image/') === 0) || (file.name && /\.(png|jpe?g|gif|webp)$/i.test(file.name));
            var isMp3 = file.type === 'audio/mpeg' || (file.name && file.name.toLowerCase().endsWith('.mp3'));
            if (isImage) {
              var fr = new FileReader();
              fr.onload = function() { archUploadedImageDataUrl = fr.result; };
              fr.readAsDataURL(file);
            } else {
              archUploadedImageDataUrl = null;
            }
            var msg = isPdf ? t('arch.status_uploaded_pdf') : isImage ? t('arch.status_uploaded_image') : isMp3 ? t('arch.status_uploaded_mp3') : t('arch.status_uploaded');
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
      var userId = await getCurrentUserId();
      if (userId) {
        try {
          var lsStatusRes = await fetch('/api/membership-status?userId=' + encodeURIComponent(userId));
          if (lsStatusRes.ok) {
            var lsStatus = await lsStatusRes.json();
            if (lsStatus.allowed && !lsStatus.allowed.lightstick) {
              alert(_t('membership.limit_lightstick', '응원봉 생성 한도가 초과되었습니다. 멤버십을 업그레이드해 주세요.'));
              return;
            }
          }
        } catch (e) {}
      }

      showLsStep(4);
      document.getElementById('ls-loading').style.display = 'block';
      document.getElementById('ls-result-image-wrap').style.display = 'none';
      document.getElementById('ls-result-title').textContent = _t('lightstick.loading', '✨ AI가 응원봉(기억의 등불)을 빚고 있어요...');
      document.getElementById('ls-result-subtitle').textContent = _t('lightstick.loading_sub', '약 10~30초 정도 소요됩니다');

      var designPrompt = buildLightstickPrompt();
      try {
        var imageData = await callGeminiLightstick(designPrompt);
        if (imageData) {
          if (userId) {
            try { await fetch('/api/usage-increment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: userId, type: 'lightstick' }) }); } catch (e) {}
          }
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

  // 소아베 히어로 비디오 — 카테고리 JSON 기반 재생 + 순차/랜덤 (채팅 연동)
  (function() {
    var video = document.getElementById('soave-hero-video');
    var overlay = document.getElementById('soave-video-overlay');
    var counter = document.getElementById('soave-video-counter');
    var muteBtn = document.getElementById('soave-mute-btn');
    var prevBtn = document.getElementById('soave-nav-prev');
    var nextBtn = document.getElementById('soave-nav-next');
    if (!video) return;

    var videoPool = [];
    var categoryToPaths = {};
    var i;
    for (i = 1; i <= 65; i++) videoPool.push('image/soave/ani/ani_soave/ (' + i + ').mp4');
    for (i = 1; i <= 4; i++) videoPool.push('image/soave/ani/ani_han/2 (' + i + ').mp4');
    var totalVideos = videoPool.length;

    fetch('image/soave/ani/soave-video-categories.json').then(function(r) { return r.json(); }).then(function(data) {
      if (data.videos && Array.isArray(data.videos)) {
        data.videos.forEach(function(v) {
          var cat = v.category || 'general';
          if (!categoryToPaths[cat]) categoryToPaths[cat] = [];
          categoryToPaths[cat].push(v.path);
        });
      }
    }).catch(function() {});

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

    function playCategory(category) {
      var paths = categoryToPaths[category] || categoryToPaths['general'] || videoPool;
      if (paths.length === 0) paths = videoPool;
      var chosen = paths[Math.floor(Math.random() * paths.length)];
      video.style.opacity = '0';
      if (overlay) overlay.style.opacity = '1';
      video.src = chosen;
      if (counter) counter.textContent = category;
      video.load();
    }

    var sequenceQueue = [];
    function playCategorySequence(categories) {
      if (!categories || categories.length === 0) return;
      sequenceQueue = categories.slice();
      playCategory(sequenceQueue.shift());
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
      if (sequenceQueue.length > 0) {
        playCategory(sequenceQueue.shift());
      } else {
        nextVideo();
      }
    });

    video.addEventListener('error', function() {
      setTimeout(nextVideo, 300);
    });

    if (prevBtn) prevBtn.addEventListener('click', function() { prevVideo(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { nextVideo(); });

    window.addEventListener('soave-react', function() {
      nextVideo();
    });

    window.addEventListener('play-soave-video', function(e) {
      var d = e.detail;
      if (!d) return;
      if (Array.isArray(d.categories) && d.categories.length > 0) {
        playCategorySequence(d.categories);
      } else if (d.category) {
        sequenceQueue = [];
        playCategory(d.category);
      }
    });

    if (muteBtn) {
      muteBtn.addEventListener('click', function() {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
        muteBtn.title = video.muted ? '소리 켜기' : '소리 끄기';
      });
    }

    loadVideoAt(0);
  })();

  // ========================================
  // 원클릭 런웨이: 샘플 얼굴(여자/남자) + 배경 선택 → 런웨이
  // ========================================
  (function () {
    var _t = (window.__simsI18n && window.__simsI18n.t) ? window.__simsI18n.t : function (k, d) { return d || k; };
    var runwayBtn = document.getElementById('oneclick-runway-btn');
    var backgroundListEl = document.getElementById('oneclick-background-list');
    var selectedBackground = null;
    var selectedFaceDataUrl = null;
    var placeholderDataUri = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" fill="#e9ecef"/><text x="120" y="82" text-anchor="middle" fill="#6c757d" font-family="sans-serif" font-size="14">background</text></svg>');

    var faceFemale = document.getElementById('oneclick-face-female');
    var faceMale = document.getElementById('oneclick-face-male');
    var photoInput = document.getElementById('oneclick-photo');
    var photoHint = document.getElementById('oneclick-photo-hint');
    var photoPreviewWrap = document.getElementById('oneclick-photo-preview');
    var photoPreviewImg = document.getElementById('oneclick-preview-img');
    var faceBase = 'image/human/';
    var faceFiles = { female: 'soave.jpg', male: 'ian.jpg' };
    var femaleFallback = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&facepad=2';
    var maleFallback = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&facepad=2';

    function clearUploadState() {
      if (photoInput) photoInput.value = '';
      if (photoHint) photoHint.textContent = _t('oneclick.photo_placeholder');
      if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
      if (photoPreviewImg) photoPreviewImg.src = '';
    }
    function setFaceSelection(face) {
      clearUploadState();
      if (faceFemale) { faceFemale.setAttribute('aria-pressed', face === 'female' ? 'true' : 'false'); }
      if (faceMale) { faceMale.setAttribute('aria-pressed', face === 'male' ? 'true' : 'false'); }
      var path = faceBase + (faceFiles[face] || faceFiles.female);
      var pathPng = path.replace(/\.jpe?g$/i, '.png');
      var fallback = face === 'male' ? maleFallback : femaleFallback;
      function loadBlobAsDataUrl(url) {
        return fetch(url).then(function (r) { return r.ok ? r.blob() : Promise.reject(); }).then(function (blob) {
          return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () { resolve(reader.result); };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        });
      }
      loadBlobAsDataUrl(path).catch(function () { return loadBlobAsDataUrl(pathPng); }).then(function (dataUrl) {
        selectedFaceDataUrl = dataUrl;
        if (typeof window !== 'undefined') window.__oneclickRunwayFaceDataUrl = selectedFaceDataUrl;
      }).catch(function () {
        fetch(fallback).then(function (r) { return r.ok ? r.blob() : Promise.reject(); }).then(function (blob) {
          var reader = new FileReader();
          reader.onload = function () {
            selectedFaceDataUrl = reader.result;
            if (typeof window !== 'undefined') window.__oneclickRunwayFaceDataUrl = selectedFaceDataUrl;
          };
          reader.readAsDataURL(blob);
        }).catch(function () {
          var img = document.querySelector('#oneclick-face-' + face + ' img');
          if (img && img.src && img.src.indexOf('data:') === 0) {
            selectedFaceDataUrl = img.src;
          } else {
            selectedFaceDataUrl = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="#f3e8ff"/><text x="60" y="68" text-anchor="middle" fill="#6b21a8" font-size="12">' + (face === 'female' ? '여자' : '남자') + '</text></svg>');
          }
          if (typeof window !== 'undefined') window.__oneclickRunwayFaceDataUrl = selectedFaceDataUrl;
        });
      });
    }
    if (faceFemale) {
      faceFemale.addEventListener('click', function () {
        setFaceSelection('female');
      });
    }
    if (faceMale) {
      faceMale.addEventListener('click', function () {
        setFaceSelection('male');
      });
    }
    if (photoInput && photoHint) {
      photoInput.addEventListener('change', function () {
        var file = photoInput.files && photoInput.files[0];
        if (file) {
          photoHint.textContent = _t('oneclick.photo_selected') + file.name;
          /* 업로드 시에도 기존 성별 선택(여자/남자) 유지 → 영상 생성 시 올바른 프롬프트 사용 */
          var reader = new FileReader();
          reader.onload = function (e) {
            selectedFaceDataUrl = e.target.result;
            if (typeof window !== 'undefined') window.__oneclickRunwayFaceDataUrl = selectedFaceDataUrl;
            if (photoPreviewImg) photoPreviewImg.src = selectedFaceDataUrl;
            if (photoPreviewWrap) photoPreviewWrap.style.display = 'block';
          };
          reader.readAsDataURL(file);
        } else {
          clearUploadState();
        }
      });
    }
    (function () {
      var urlInput = document.getElementById('oneclick-photo-url');
      var urlBtn = document.getElementById('oneclick-photo-url-btn');
      if (!urlInput || !urlBtn || !photoHint || !photoPreviewImg || !photoPreviewWrap) return;
      function setPreviewFromDataUrl(dataUrl) {
        selectedFaceDataUrl = dataUrl;
        if (typeof window !== 'undefined') window.__oneclickRunwayFaceDataUrl = selectedFaceDataUrl;
        photoPreviewImg.src = dataUrl;
        photoPreviewWrap.style.display = 'block';
        if (photoHint) photoHint.textContent = _t('oneclick.photo_from_url');
      }
      function loadFromUrl() {
        var raw = (urlInput.value || '').trim();
        if (!raw) {
          if (photoHint) photoHint.textContent = _t('oneclick.url_required');
          return;
        }
        if (photoHint) photoHint.textContent = _t('oneclick.loading');
        var proxyUrl = '/api/image-proxy?url=' + encodeURIComponent(raw);
        fetch(proxyUrl)
          .then(function (r) {
            if (r.ok) return r.blob();
            return fetch(raw, { mode: 'cors' }).then(function (r2) { return r2.ok ? r2.blob() : Promise.reject(new Error('이미지를 불러올 수 없습니다.')); });
          })
          .then(function (blob) {
            var reader = new FileReader();
            reader.onload = function () { setPreviewFromDataUrl(reader.result); };
            reader.onerror = function () {
              if (photoHint) photoHint.textContent = _t('oneclick.convert_failed');
            };
            reader.readAsDataURL(blob);
          })
          .catch(function (err) {
            if (photoHint) photoHint.textContent = err.message || _t('oneclick.url_load_failed');
          });
      }
      urlBtn.addEventListener('click', loadFromUrl);
      urlInput.addEventListener('paste', function () {
        setTimeout(loadFromUrl, 50);
      });
      urlInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); loadFromUrl(); }
      });
    })();
    setFaceSelection('female');

    var fallbackBackgroundList = [
      { id: 'gwanghwamun1', name: '광화문 공연장소 1', desc: '', image: 'runwayuse/a.jpeg' },
      { id: 'gwanghwamun2', name: '광화문 공연장소 2', desc: '', image: 'runwayuse/b.jpeg' },
      { id: 'gwanghwamun3', name: '광화문 공연장소 3', desc: '', image: 'runwayuse/c.jpeg' },
      { id: 'mv1', name: '1 뮤직비디오 장소', desc: '', image: 'runwayuse/1.jpeg' },
      { id: 'mv2', name: '2 뮤직비디오 장소', desc: '', image: 'runwayuse/2.jpeg' },
      { id: 'mv3', name: '3 뮤직비디오 장소', desc: '', image: 'runwayuse/3.jpeg' }
    ];
    if (backgroundListEl) {
      Promise.all([
        fetch('image/runway/backgrounds/list.json').then(function (res) { return res.ok ? res.json() : []; }).catch(function () { return []; }),
        fetch('video/gallery/gallery-videos.json').then(function (res) { return res.ok ? res.json() : {}; }).catch(function () { return {}; })
      ]).then(function (results) {
        var arr = results[0];
        var galleryVideos = results[1] || {};
        if (!Array.isArray(arr) || arr.length === 0) arr = fallbackBackgroundList;
        if (!Array.isArray(arr) || arr.length === 0) return;
        var base = 'image/runway/';
        var videoBase = 'video/gallery/';
        arr.forEach(function (item) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'oneclick-background-option';
          btn.setAttribute('data-background-id', item.id || '');
          btn.setAttribute('aria-pressed', 'false');
          btn.setAttribute('aria-label', (item.name || '') + (item.desc ? ' - ' + item.desc : ''));
          var imgWrap = document.createElement('div');
          imgWrap.className = 'oneclick-background-img-wrap';
          var img = document.createElement('img');
          img.alt = item.name || '';
          img.src = placeholderDataUri;
          var imgPath = item.image || '';
          var realSrc = base + imgPath;
          var fallbackSvg = imgPath ? base + imgPath.replace(/\.(jpe?g|jfif|png)$/i, '.svg') : '';
          var loader = new Image();
          var dataUriFallback = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><rect width="320" height="200" fill="#e9ecef"/><text x="160" y="105" text-anchor="middle" fill="#6c757d" font-family="sans-serif" font-size="14">' + (item.name || 'background') + '</text></svg>');
          img.onerror = function () { this.onerror = null; this.src = dataUriFallback; };
          if (imgPath.indexOf('runwayuse/') === 0) {
            img.src = dataUriFallback;
            loader.onload = function () { img.src = realSrc; };
            loader.onerror = function () {
              var loader2 = new Image();
              loader2.onload = function () { img.src = fallbackSvg; };
              loader2.onerror = function () { };
              loader2.src = fallbackSvg || '';
            };
            loader.src = realSrc;
          } else if (fallbackSvg) {
            img.src = realSrc;
            loader.onload = function () { img.src = realSrc; };
            loader.onerror = function () {
              var loader2 = new Image();
              loader2.onload = function () { img.src = fallbackSvg; };
              loader2.onerror = function () { img.src = dataUriFallback; };
              loader2.src = fallbackSvg;
            };
            loader.src = realSrc;
          } else {
            img.src = realSrc;
          }
          imgWrap.appendChild(img);
          if (galleryVideos[item.id]) {
            var playOverlay = document.createElement('span');
            playOverlay.className = 'oneclick-gallery-play-overlay';
            playOverlay.setAttribute('aria-label', '샘플 영상 보기');
            playOverlay.title = '샘플 영상 보기';
            playOverlay.dataset.videoSrc = videoBase + galleryVideos[item.id];
            playOverlay.dataset.caption = item.name || '';
            playOverlay.innerHTML = '&#9654;';
            imgWrap.appendChild(playOverlay);
          }
          btn.appendChild(imgWrap);
          var cap = document.createElement('div');
          cap.className = 'oneclick-background-caption';
          cap.textContent = item.name || '';
          btn.appendChild(cap);
          if (item.desc && String(item.desc).trim()) {
            var desc = document.createElement('div');
            desc.className = 'oneclick-background-desc';
            desc.textContent = item.desc;
            btn.appendChild(desc);
          }
          btn.addEventListener('click', function (e) {
            if (e.target.classList.contains('oneclick-gallery-play-overlay')) {
              e.preventDefault();
              e.stopPropagation();
              var modal = document.getElementById('oneclick-gallery-video-modal');
              var player = document.getElementById('oneclick-gallery-video');
              var captionEl = document.getElementById('oneclick-gallery-video-caption');
              if (modal && player && captionEl) {
                player.src = e.target.dataset.videoSrc || '';
                captionEl.textContent = e.target.dataset.caption || '';
                modal.style.display = 'flex';
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                player.play().catch(function () {});
              }
              return;
            }
            document.querySelectorAll('.oneclick-background-option').forEach(function (el) {
              el.classList.remove('selected');
              el.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('selected');
            btn.setAttribute('aria-pressed', 'true');
            selectedBackground = item;
          });
          backgroundListEl.appendChild(btn);
        });
        var modal = document.getElementById('oneclick-gallery-video-modal');
        var player = document.getElementById('oneclick-gallery-video');
        var closeBtn = modal && modal.querySelector('.oneclick-gallery-video-close');
        var backdrop = modal && modal.querySelector('.oneclick-gallery-video-modal-backdrop');
        function closeGalleryVideoModal() {
          if (modal) modal.style.display = 'none';
          if (modal) modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          if (player) { player.pause(); player.removeAttribute('src'); }
        }
        if (closeBtn) closeBtn.addEventListener('click', closeGalleryVideoModal);
        if (backdrop) backdrop.addEventListener('click', closeGalleryVideoModal);
      }).catch(function () {});
    }

    var runwayResult = document.getElementById('oneclick-runway-result');
    var runwayResultImageWrap = document.getElementById('oneclick-runway-result-image-wrap');
    var runwayResultImage = document.getElementById('oneclick-runway-result-image');
    var runwayResultVideoWrap = document.getElementById('oneclick-runway-result-video-wrap');
    var runwayResultVideo = document.getElementById('oneclick-runway-result-video');
    var runwayVideoLoading = document.getElementById('oneclick-runway-video-loading');
    var runwayResultStatus = document.getElementById('oneclick-runway-result-status');
    var runwayVideoBtn = document.getElementById('oneclick-runway-video-btn');
    var runwaySaveImageBtn = document.getElementById('oneclick-runway-save-image-btn');
    var runwaySaveVideoBtn = document.getElementById('oneclick-runway-save-video-btn');
    var runwayVideoBlobUrl = null;

    if (runwayBtn) {
      runwayBtn.addEventListener('click', function () {
        if (!selectedFaceDataUrl) {
          alert(_t('oneclick.face_required'));
          return;
        }
        if (!selectedBackground) {
          alert(_t('oneclick.background_required'));
          return;
        }
        if (typeof window !== 'undefined') {
          window.__oneclickRunwayData = {
            facePhoto: selectedFaceDataUrl,
            background: selectedBackground || null
          };
        }
        runwayBtn.disabled = true;
        runwayBtn.textContent = _t('oneclick.runway_generating');
        var placeName = (selectedBackground && selectedBackground.name) ? selectedBackground.name : '배경';
        if (runwayResultStatus) runwayResultStatus.textContent = placeName + _t('oneclick.synthesizing');
        if (runwayResult) runwayResult.style.display = 'block';
        if (runwayResultImageWrap) runwayResultImageWrap.style.display = 'none';
        if (runwayResultVideoWrap) runwayResultVideoWrap.style.display = 'none';
        if (runwayVideoBtn) runwayVideoBtn.style.display = 'none';
        if (runwaySaveImageBtn) runwaySaveImageBtn.style.display = 'none';
        if (runwaySaveVideoBtn) runwaySaveVideoBtn.style.display = 'none';

        var backgroundPath = (selectedBackground && selectedBackground.image)
          ? ('image/runway/' + selectedBackground.image)
          : RUNWAY_IMAGE_PATH;
        generateRunwayComposite(backgroundPath, selectedFaceDataUrl)
          .then(function (dataUrl) {
            if (runwayResultImage) runwayResultImage.src = dataUrl;
            if (runwayResultImageWrap) runwayResultImageWrap.style.display = 'block';
            if (runwayResultStatus) runwayResultStatus.textContent = _t('oneclick.image_ready');
            if (runwayVideoBtn) runwayVideoBtn.style.display = 'inline-block';
            if (runwaySaveImageBtn) runwaySaveImageBtn.style.display = 'inline-block';
            runwayBtn.disabled = false;
            runwayBtn.textContent = _t('oneclick.runway_btn');
            if (runwayResult) runwayResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          })
          .catch(function (err) {
            if (runwayResultStatus) runwayResultStatus.textContent = _t('oneclick.error') + (err.message || '생성 실패');
            runwayBtn.disabled = false;
            runwayBtn.textContent = _t('oneclick.runway_btn');
          });
      });
    }

    if (runwayVideoBtn && runwayResultStatus) {
      runwayVideoBtn.addEventListener('click', async function () {
        var imgSrc = runwayResultImage && runwayResultImage.src;
        if (!imgSrc || imgSrc.indexOf('data:image') !== 0) {
          alert(_t('oneclick.video_need_image'));
          return;
        }
        runwayVideoBtn.disabled = true;
        if (runwayResultVideoWrap) {
          runwayResultVideoWrap.style.display = 'block';
          runwayResultVideo.style.visibility = 'hidden';
        }
        if (runwayVideoLoading) runwayVideoLoading.style.display = 'flex';
        showVideoGeneratingToast();
        if (runwayVideoBlobUrl) {
          try { URL.revokeObjectURL(runwayVideoBlobUrl); } catch (e) {}
          runwayVideoBlobUrl = null;
        }
        var prompt;
        try {
          runwayResultStatus.textContent = _t('oneclick.analyzing');
          prompt = await buildRunwayVideoPromptFromResultImage(imgSrc);
        } catch (e) {
          prompt = null;
        }
        if (!prompt || prompt.length < 20) {
          var isFemale = faceFemale && faceFemale.getAttribute('aria-pressed') === 'true';
          prompt = isFemale ? RUNWAY_VIDEO_PROMPT_WOMAN : RUNWAY_VIDEO_PROMPT_MAN;
          if (runwayResultStatus) runwayResultStatus.textContent = _t('oneclick.fallback_prompt');
        } else {
          if (runwayResultStatus) runwayResultStatus.textContent = _t('oneclick.video_generating');
        }
        startVeoVideoGenerationWithFirstFrameViaFiles(prompt, imgSrc)
          .then(function (opName) { return pollVeoOperation(opName); })
          .then(function (result) {
            var videoUri = result.response && result.response.generateVideoResponse && result.response.generateVideoResponse.generatedSamples && result.response.generateVideoResponse.generatedSamples[0] && result.response.generateVideoResponse.generatedSamples[0].video && result.response.generateVideoResponse.generatedSamples[0].video.uri;
            if (!videoUri) throw new Error('영상 URI 없음');
            return fetchVeoVideoBlob(videoUri);
          })
          .then(function (blob) {
            hideVideoGeneratingToast();
            var url = URL.createObjectURL(blob);
            runwayVideoBlobUrl = url;
            if (runwayVideoLoading) runwayVideoLoading.style.display = 'none';
            if (runwayResultVideo) {
              runwayResultVideo.src = url;
              runwayResultVideo.style.visibility = '';
              runwayResultVideo.oncanplay = function () {
                runwayResultVideo.oncanplay = null;
                runwayResultVideo.play().catch(function () {});
              };
            }
            if (runwayResultVideoWrap) runwayResultVideoWrap.style.display = 'block';
            runwayResultStatus.textContent = _t('oneclick.video_ready');
            runwayVideoBtn.disabled = false;
            runwayVideoBtn.textContent = _t('oneclick.video_remake');
            if (runwaySaveVideoBtn) runwaySaveVideoBtn.style.display = 'inline-block';
          })
          .catch(function (err) {
            hideVideoGeneratingToast();
            if (runwayVideoLoading) runwayVideoLoading.style.display = 'none';
            if (runwayResultVideo) runwayResultVideo.style.visibility = '';
            runwayResultStatus.textContent = _t('oneclick.video_failed') + (err.message || '');
            runwayVideoBtn.disabled = false;
          });
      });
    }

    if (runwaySaveImageBtn && runwayResultImage) {
      runwaySaveImageBtn.addEventListener('click', function () {
        var src = runwayResultImage.src;
        if (!src || src.indexOf('data:') !== 0) return;
        var ext = src.indexOf('image/png') !== -1 ? 'png' : 'jpg';
        var a = document.createElement('a');
        a.href = src;
        a.download = 'runway-image.' + ext;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }

    if (runwaySaveVideoBtn) {
      runwaySaveVideoBtn.addEventListener('click', function () {
        if (!runwayVideoBlobUrl) return;
        var a = document.createElement('a');
        a.href = runwayVideoBlobUrl;
        a.download = 'runway-video.mp4';
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
  })();

  // ========================================
  // 샘플 테스트: image/human/sample.txt 에서 이름·생년월일 로드 후 폼에 적용
  // ========================================
  (function () {
    var samplePath = 'image/human/sample.txt';

    function applySampleToForm(data) {
      if (!data || (data.name === undefined && data.birth === undefined)) return;
      var oneclickBirth = document.getElementById('oneclick-birth');
      var soulDate = document.getElementById('soul-color-date');
      // 이름 입력란은 테스트/샘플 값으로 채우지 않고 placeholder '당신의 이름'만 유지
      if (data.birth != null && data.birth !== '') {
        var birthVal = data.birth.trim();
        if (birthVal.length === 10 && birthVal.indexOf('/') !== -1) {
          var parts = birthVal.split('/');
          if (parts.length === 3) birthVal = parts[2] + '-' + parts[0].padStart(2, '0') + '-' + parts[1].padStart(2, '0');
        }
        if (oneclickBirth) oneclickBirth.value = birthVal;
        if (soulDate) soulDate.value = birthVal;
      }
    }

    function parseSampleText(text) {
      var data = {};
      var lines = (text || '').split(/\r?\n/);
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) continue;
        var val = '';
        if (line.indexOf('이름') === 0) {
          val = line.replace(/^이름\s*[:\s]+/i, '').trim();
          if (val) data.name = val;
        } else if (line.indexOf('생년월일') === 0) {
          val = line.replace(/^생년월일\s*[:\s]+/i, '').trim();
          if (val) data.birth = parseBirth(val);
        } else if (line.indexOf('=') !== -1) {
          var idx = line.indexOf('=');
          var key = line.slice(0, idx).trim().toLowerCase();
          val = line.slice(idx + 1).trim();
          if (key === 'name') data.name = val;
          else if (key === 'birth') data.birth = parseBirth(val);
        }
      }
      return data;
    }

    function parseBirth(s) {
      if (!s) return '';
      s = s.trim();
      var m = s.match(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
      if (m) return m[1] + '-' + m[2].padStart(2, '0') + '-' + m[3].padStart(2, '0');
      if (s.length === 10 && s.indexOf('/') !== -1) {
        var parts = s.split('/');
        if (parts.length === 3) return parts[2] + '-' + parts[0].padStart(2, '0') + '-' + parts[1].padStart(2, '0');
      }
      if (s.length === 10 && s.indexOf('-') !== -1) return s;
      return s;
    }

    fetch(samplePath)
      .then(function (res) { return res.ok ? res.text() : Promise.reject(); })
      .then(function (text) {
        var data = parseSampleText(text);
        if (data.name || data.birth) applySampleToForm(data);
      })
      .catch(function () {});
  })();

  console.log('BORAHAE loaded successfully!');
})();
