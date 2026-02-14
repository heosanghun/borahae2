// BORAHAE - Internationalization (i18n)
// 한국어(ko) / English(en) 다국어 지원

(function() {
  'use strict';

  // ========================================
  // Translation Data
  // ========================================
  var translations = {
    // --- Navigation (BORAHAE 3.0: 3대 핵심) ---
    'nav.play': { ko: 'PLAY (놀기)', en: 'PLAY' },
    'nav.create': { ko: 'CREATE (짓기)', en: 'CREATE' },
    'nav.store': { ko: 'STORE (소장)', en: 'STORE' },
    'nav.services': { ko: '서비스', en: 'Services' },
    'nav.styling': { ko: '스타일링', en: 'Styling' },
    'nav.shop': { ko: '굿즈샵', en: 'Shop' },
    'nav.membership': { ko: '멤버십', en: 'Membership' },
    'nav.login': { ko: '로그인', en: 'Login' },
    'nav.logout': { ko: '로그아웃', en: 'Logout' },

    // --- Hero (BORAHAE 3.0 메인 카피) ---
    'hero.badge': { ko: 'AI Magic Shop for Global Fandom', en: 'AI Magic Shop for Global Fandom' },
    'hero.tagline': { ko: 'I Purple You · 끝까지 함께', en: 'I Purple You · Together Forever' },
    'hero.title_line': { ko: '보라해', en: 'BORAHAE' },
    'hero.title_highlight': { ko: '당신의 이름이 캐릭터가 되고, 당신의 노래가 집이 되는 곳', en: 'Where your name becomes a character, and your song becomes a home' },
    'hero.desc': {
      ko: '한글 페르소나로 <strong>캐릭터</strong>를 만들고,<br>매직샵에서 <strong>노래로 집</strong>을 짓고,<br>보라 굿즈로 <strong>소장</strong>하세요',
      en: 'Create your <strong>character</strong> with Hangeul Persona,<br>build a <strong>home from your song</strong> at Magic Shop,<br>and <strong>collect</strong> with Bora Goods'
    },
    'hero.cta_start': { ko: '무료로 시작하기', en: 'Get Started Free' },
    'hero.cta_explore': { ko: '어떤 경험인지 보기', en: 'See What\'s in Store' },
    'hero.stat_users': { ko: '보라해 팬', en: 'Borahae Fans' },
    'hero.stat_goods': { ko: '굿즈 아이템', en: 'Goods Items' },
    'hero.stat_styles': { ko: '스타일링 완성', en: 'Styles Created' },

    // Hero phone mockup
    'hero.phone_title': { ko: '보라해 스타일링', en: 'Borahae Styling' },
    'hero.phone_sub': { ko: '나만의 K-pop 코디', en: 'My K-pop Outfit' },
    'hero.mood_1': { ko: '무드 · 보라빛 에너지', en: 'Mood · Purple Energy' },
    'hero.mood_2': { ko: '무드 · 설레는 만남', en: 'Mood · Exciting Encounter' },
    'hero.ai_suggestion': {
      ko: '보라빛으로 물든 <strong>나만의 스타일</strong>, 지금 시작하세요',
      en: 'Your <strong>purple-tinted style</strong> — start now'
    },

    // --- Features (BORAHAE 3.0: 3대 핵심 서비스) ---
    'features.badge': { ko: 'BORAHAE 3.0', en: 'BORAHAE 3.0' },
    'features.title': { ko: '캐릭터 만들고, 집 짓고, 시계에 넣는다', en: 'Create a character. Build a home. Put it on your watch.' },
    'features.desc': { ko: '한글과 AI로 완성하는 글로벌 팬덤 경험', en: 'Global fandom experience powered by Hangeul & AI' },
    'features.pillar1_title': { ko: '한글 페르소나', en: 'Hangeul Persona' },
    'features.pillar1_desc': { ko: '이름으로 재미있는 한글 캐릭터 웹툰이 만들어지고, 쉬운 선택으로 취향을 담아 나를 위한 초개인맞춤 스타일을 AI가 추천합니다', en: 'Your name becomes a fun Hangeul character webtoon; then easy choices shape your taste so AI recommends ultra-personalized style for you' },
    'features.pillar1_btn': { ko: '놀기 · PLAY', en: 'PLAY' },
    'features.pillar2_title': { ko: '매직샵', en: 'Magic Shop' },
    'features.pillar2_desc': { ko: '음악(MIDI)을 업로드하면 한글 건축물이 생성되고, 그 공간의 열쇠가 되는 나만의 응원봉을 만듭니다', en: 'Upload music (MIDI) to generate Hangeul architecture, then create your lightstick as the key to that space' },
    'features.pillar2_btn': { ko: '짓기 · CREATE', en: 'CREATE' },
    'features.pillar3_title': { ko: '보라 굿즈', en: 'Bora Goods' },
    'features.pillar3_desc': { ko: '페르소나·건축물을 워치페이스로, 실물 굿즈(무드등·포토카드·의류)로 소장하세요', en: 'Collect watch faces, mood lamps, photocards, apparel — digital and physical goods from your creations' },
    'features.pillar3_btn': { ko: '소장 · STORE', en: 'STORE' },
    'features.styling_title': { ko: 'AI K-pop 스타일링', en: 'AI K-pop Styling' },
    'features.styling_desc': { ko: '콘서트, 팬미팅, 일상까지 — AI가 퍼스널 컬러와 체형을 분석해 K-pop 감성 코디를 추천합니다', en: 'From concerts to fan meetings & daily life — AI analyzes your personal color & body type to recommend K-pop style outfits' },
    'features.shop_title': { ko: '보라해 굿즈샵', en: 'Borahae Goods Shop' },
    'features.shop_desc': { ko: '보라빛 감성의 팬메이드 굿즈 마켓플레이스. 의류, 액세서리, 문구, 폰케이스까지 한곳에서', en: 'A purple-themed fan-made goods marketplace. Clothing, accessories, stationery & phone cases — all in one place' },
    'features.styling_btn': { ko: '스타일링 시작하기', en: 'Start Styling' },
    'features.shop_btn': { ko: '굿즈샵 보기', en: 'View Shop' },
    'features.community_title': { ko: '팬 커뮤니티', en: 'Fan Community' },
    'features.community_desc': { ko: '같은 마음으로 보라해를 외치는 팬들과 소통하고, 덕질 일상을 공유하는 따뜻한 공간', en: 'A warm space to connect with fellow fans and share your fandom daily life' },
    'features.event_title': { ko: '이벤트 기획', en: 'Event Planning' },
    'features.event_desc': { ko: '생일 카페, 스트리밍 파티, 팬 프로젝트 — 함께 만드는 특별한 순간을 기획하고 참여하세요', en: 'Birthday cafes, streaming parties, fan projects — plan and join special moments together' },
    'features.content_title': { ko: '팬 콘텐츠', en: 'Fan Content' },
    'features.content_desc': { ko: '팬아트, 팬픽션, 에디트 영상 — 크리에이터들의 작품을 감상하고, 내 작품도 공유하세요', en: 'Fan art, fan fiction, edit videos — enjoy creators\' works and share your own' },
    'features.membership_title': { ko: '프리미엄 멤버십', en: 'Premium Membership' },
    'features.membership_desc': { ko: '독점 콘텐츠, 굿즈 할인, 이벤트 우선 참여 — 보라해 VIP만의 특별한 혜택을 누리세요', en: 'Exclusive content, goods discounts, priority events — enjoy special perks as a Borahae VIP' },
    'features.community_btn': { ko: '커뮤니티 들어가기', en: 'Enter Community' },
    'features.event_btn': { ko: '이벤트 더보기', en: 'See Events' },
    'features.content_btn': { ko: '콘텐츠 보기', en: 'View Content' },
    'features.membership_btn': { ko: '멤버십 알아보기', en: 'Learn about Membership' },
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
    'ai.badge': { ko: 'PLAY · 한글 페르소나', en: 'PLAY · Hangeul Persona' },
    'ai.title': { ko: '이름으로 캐릭터를 만들고,<br>나만의 스타일 추천 받으세요', en: 'Create a character from your name,<br>get your own style recommendations' },
    'ai.step1_title': { ko: '프로필 분석', en: 'Profile Analysis' },
    'ai.step1_desc': { ko: '쉬운 선택(성별·연령·체형)으로 당신의 기본 프로필을 담습니다', en: 'Easy choices (gender, age, body type) capture your profile' },
    'ai.step2_title': { ko: 'K-pop 스타일 매칭', en: 'K-pop Style Matching' },
    'ai.step2_desc': { ko: '콘서트, 팬미팅, 일상 등 상황별 당신에게 맞는 스타일을 찾습니다', en: 'Find styles that fit you for concerts, fan meetings & daily life' },
    'ai.step3_title': { ko: '보라해 코디 완성', en: 'Borahae Outfit Complete' },
    'ai.step3_desc': { ko: '당신만을 위한 초개인맞춤 코디로 보라빛 감성을 완성하세요', en: 'Complete your purple vibe with ultra-personalized outfits for you' },
    'ai.cta': { ko: '보라해 스타일링 시작', en: 'Start Borahae Styling' },
    'ai.subtitle': { ko: '나만의 이름으로 캐릭터도 만들고, 나만의 컬러로 패션 AI 추천도 받아보세요.', en: 'Create your character from your name and get fashion AI recommendations in your colors.' },
    'ai.connector': { ko: '이름으로 나만의 캐릭터 · 에피소드 만들기', en: 'Create your character & episode from your name' },

    // --- Shop ---
    'shop.badge': { ko: 'STORE · 보라 굿즈', en: 'STORE · Bora Goods' },
    'shop.title': { ko: '만든 캐릭터와 공간을, 워치페이스와 굿즈로 소장', en: 'Collect your character & space as watch faces and goods' },
    'shop.desc': { ko: '디지털 워치페이스, 무드등, 포토카드, 의류까지 — 생성한 결과물을 상품으로 만나보세요', en: 'Digital watch faces, mood lamps, photocards, apparel — turn your creations into products' },
    'shop.cat_clothing': { ko: '보라해 의류', en: 'Borahae Clothing' },
    'shop.cat_ecobag': { ko: '에코백', en: 'Eco Bags' },
    'shop.cat_phonecase': { ko: '폰케이스', en: 'Phone Cases' },
    'shop.cat_keyring': { ko: '키링 · 액세서리', en: 'Keyrings & Accessories' },
    'shop.cat_stationery': { ko: '문구 · 다이어리', en: 'Stationery & Diaries' },
    'shop.cat_sticker': { ko: '스티커 · 데코', en: 'Stickers & Deco' },
    'shop.cat_boratime': { ko: '시계 · 보라타임', en: 'Watch · BORATIME' },
    'shop.cat_clothing_title': { ko: '보라해 의류', en: 'Borahae Apparel' },
    'shop.cat_clothing_desc': { ko: '보라빛 감성의 티셔츠, 후드, 악세서리', en: 'Purple vibe tees, hoodies & accessories' },
    'shop.cat_ecobag_title': { ko: '에코백', en: 'Eco Bags' },
    'shop.cat_ecobag_desc': { ko: '일상과 콘서트 모두 담는 보라빛 가방', en: 'Purple totes for daily & concert' },
    'shop.cat_phonecase_title': { ko: '폰케이스', en: 'Phone Cases' },
    'shop.cat_phonecase_desc': { ko: '보라해 감성의 스마트폰 케이스', en: 'Borahae-style phone cases' },
    'shop.cat_keyring_title': { ko: '키링 · 악세서리', en: 'Keyrings & Accessories' },
    'shop.cat_keyring_desc': { ko: '가방에 달아두는 보라빛 키링과 소품', en: 'Purple keyrings & small accessories' },
    'shop.cat_stationery_title': { ko: '문구 · 다이어리', en: 'Stationery & Diaries' },
    'shop.cat_stationery_desc': { ko: '덕질 기록을 담는 노트와 다이어리', en: 'Notebooks & diaries for fan life' },
    'shop.cat_sticker_title': { ko: '스티커 · 데코', en: 'Stickers & Deco' },
    'shop.cat_sticker_desc': { ko: '폰·노트북을 꾸미는 보라빛 스티커', en: 'Purple stickers & deco for devices' },
    'shop.app_cta': { ko: '앱에서 만나기', en: 'Get the App' },
    'shop.app_cta_sub': { ko: '앱에서 더 많은 굿즈를 만나보세요', en: 'Discover more goods in the app' },
    'shop.view_naver': { ko: '네이버 쇼핑에서 보기', en: 'View on Naver Shopping' },
    'shop.cat_lightstick': { ko: '응원봉 · 나만의 굿즈', en: 'Lightstick · My Goods' },
    'shop.cat_lightstick_title': { ko: '나만의 응원봉 · 커스텀 굿즈', en: 'My Lightstick · Custom Goods' },
    'shop.cat_lightstick_desc': { ko: '매직샵에서 만든 건축물을 담은 응원봉으로, 세상에 하나뿐인 굿즈를 만드세요.', en: 'Create one-of-a-kind goods with a lightstick that holds the architecture you made at Magic Shop.' },
    'shop.lightstick_digital': { ko: '디지털 굿즈', en: 'Digital Goods' },
    'shop.lightstick_watchface': { ko: '매직샵 건축물을 워치페이스로 다운로드', en: 'Download Magic Shop architecture as watch face' },
    'shop.lightstick_custom': { ko: '커스텀 응원봉', en: 'Custom Lightstick' },
    'shop.lightstick_custom_desc': { ko: '나만의 건축물을 담은 응원봉 · 홀로그램 프리뷰', en: 'Lightstick with your architecture · Hologram preview' },
    'shop.lightstick_order_btn': { ko: '제작 신청하기', en: 'Request Production' },
    'shop.lightstick_nft_btn': { ko: 'NFT 발급받기', en: 'Get NFT' },
    'shop.lightstick_create_btn': { ko: '나의 응원봉, 지금 만들기 💜', en: 'Create My Lightstick Now 💜' },

    // --- Magic Shop (CREATE · 음악 → 한글 건축) ---
    'magicshop.connector': { ko: '음악으로 나만의 한글 건축물 · 매직샵', en: 'Your Hangeul architecture from music · Magic Shop' },
    'magicshop.input_title': { ko: '당신의 최애곡을 들려주세요', en: 'Share your favorite song' },
    'magicshop.input_desc': { ko: '소리가 머무는 집을 지어드립니다. MIDI·PDF·악보 이미지를 올리거나 샘플을 사용하세요.', en: 'We build a home where sound dwells. Upload MIDI, PDF or sheet image, or use a sample.' },
    'magicshop.dropzone': { ko: '파일을 여기에 놓거나 클릭하여 선택', en: 'Drop file here or click to choose' },
    'magicshop.start_btn': { ko: '건축 시작하기', en: 'Start Building' },
    'magicshop.display_idle': { ko: '텅 빈 우주에 은은한 오로라가 일렁입니다. 음악을 올려 주세요.', en: 'A gentle aurora sways in the empty cosmos. Upload your music.' },
    'magicshop.loading': { ko: '파형이 한글 자모로, 건축물로 조립됩니다...', en: 'Waveform becomes jamo, then assembles into architecture...' },

    // --- BORATIME (시계 디자인 · 팬심 소장) ---
    'boratime.badge': { ko: 'BORATIME', en: 'BORATIME' },
    'boratime.title': { ko: '시계도 패션이다.<br>팬심을 간직하다', en: 'Watches Are Fashion.<br>Keep Your Fan Heart' },
    'boratime.desc': { ko: '앱에서 다운로드로 보라빛 시계 페이스를 소장하세요. 콘서트, 보라해, 일곱 개의 달, 꽃길까지—소중한 순간을 시계에 담습니다.', en: 'Download watch faces in the app. Purple ocean, seven moons, flower path—keep your precious moments on your wrist.' },
    'boratime.cta': { ko: '앱에서 만나기', en: 'Get the App' },
    'boratime.cta_sub': { ko: '앱스토어 · 플레이스토어 다운로드', en: 'Download on App Store & Play Store' },
    'boratime.jamo_consonant': { ko: '자음타임', en: 'Consonant Time' },
    'boratime.jamo_vowel': { ko: '모음타임', en: 'Vowel Time' },

    // --- Community / Events / Fan Content (상세 섹션) ---
    'community.badge': { ko: 'Community', en: 'Community' },
    'community.title': { ko: '팬 커뮤니티', en: 'Fan Community' },
    'community.desc': { ko: '같은 마음으로 보라해를 외치는 팬들과 소통하고, 덕질 일상을 공유하는 따뜻한 공간입니다. 앱에서 실시간 채팅, 게시판, 팬 소모임을 만나보세요.', en: 'A warm space to connect with fellow fans and share your fandom daily life. Chat, boards, and fan clubs are available in the app.' },
    'community.cta': { ko: '앱에서 커뮤니티 이용하기', en: 'Use Community in the App' },
    'events.badge': { ko: 'Events', en: 'Events' },
    'events.title': { ko: '이벤트 기획', en: 'Event Planning' },
    'events.desc': { ko: '생일 카페, 스트리밍 파티, 팬 프로젝트—함께 만드는 특별한 순간을 기획하고 참여하세요. 진행 중인 이벤트와 참여 방법을 앱에서 확인할 수 있습니다.', en: 'Birthday cafes, streaming parties, fan projects—plan and join special moments together. Check ongoing events in the app.' },
    'events.cta': { ko: '이벤트 일정 보기', en: 'View Event Schedule' },
    'content.badge': { ko: 'Fan Content', en: 'Fan Content' },
    'content.title': { ko: '팬 콘텐츠', en: 'Fan Content' },
    'content.desc': { ko: '팬아트, 팬픽션, 에디트 영상—크리에이터들의 작품을 감상하고, 내 작품도 공유하세요. 보라해 앱 갤러리에서 팬 제작 콘텐츠를 만나보실 수 있습니다.', en: 'Fan art, fan fiction, edit videos—enjoy creators\' works and share your own. Find fan-made content in the app gallery.' },
    'content.cta': { ko: '콘텐츠 갤러리 보기', en: 'View Content Gallery' },

    // --- Membership ---
    'membership.badge': { ko: 'Membership', en: 'Membership' },
    'membership.title': { ko: '보라해 멤버십', en: 'Borahae Membership' },
    'membership.desc': { ko: '당신의 팬 라이프에 딱 맞는 플랜을 선택하세요', en: 'Choose the plan that fits your fan life' },
    'membership.free': { ko: 'Free', en: 'Free' },
    'membership.purple': { ko: 'Purple', en: 'Purple' },
    'membership.vip': { ko: 'VIP 보라해', en: 'VIP Borahae' },
    'membership.popular': { ko: 'POPULAR', en: 'POPULAR' },
    'membership.per_month': { ko: '/월', en: '/mo' },
    'membership.free_f1': { ko: 'AI 스타일링 월 3회', en: 'AI Styling 3x/month' },
    'membership.free_f2': { ko: '커뮤니티 접근', en: 'Community Access' },
    'membership.free_f3': { ko: '룩북 갤러리', en: 'Lookbook Gallery' },
    'membership.free_f4': { ko: '굿즈 할인', en: 'Goods Discount' },
    'membership.free_f5': { ko: '독점 콘텐츠', en: 'Exclusive Content' },
    'membership.purple_f1': { ko: 'AI 스타일링 무제한', en: 'Unlimited AI Styling' },
    'membership.purple_f2': { ko: '커뮤니티 + 이벤트', en: 'Community + Events' },
    'membership.purple_f3': { ko: '굿즈 10% 할인', en: '10% Goods Discount' },
    'membership.purple_f4': { ko: '독점 콘텐츠', en: 'Exclusive Content' },
    'membership.purple_f5': { ko: '1:1 코디 상담', en: '1:1 Style Consult' },
    'membership.vip_f1': { ko: 'AI 스타일링 무제한', en: 'Unlimited AI Styling' },
    'membership.vip_f2': { ko: '모든 Purple 혜택', en: 'All Purple Benefits' },
    'membership.vip_f3': { ko: '굿즈 20% 할인', en: '20% Goods Discount' },
    'membership.vip_f4': { ko: '1:1 AI 코디 상담', en: '1:1 AI Style Consult' },
    'membership.vip_f5': { ko: '이벤트 우선 참여 + VIP 배지', en: 'Priority Events + VIP Badge' },
    'membership.btn_free': { ko: '무료로 시작', en: 'Start Free' },
    'membership.btn_purple': { ko: 'Purple 시작', en: 'Start Purple' },
    'membership.btn_vip': { ko: 'VIP 시작', en: 'Start VIP' },

    // --- Lightstick Designer ---
    'lightstick.badge': { ko: 'CREATE · 매직샵', en: 'CREATE · Magic Shop' },
    'lightstick.title': { ko: '노래가 건축이 되고, 그 공간의 열쇠가 응원봉이 됩니다 💜', en: 'Your song becomes architecture; the key to that space is your lightstick 💜' },
    'lightstick.desc': { ko: '음악(MIDI)을 업로드하면 한글 건축물이 생성되고, 그 안에 나만의 응원봉을 배치하세요', en: 'Upload music (MIDI) to generate Hangeul architecture, then place your own lightstick inside' },
    'lightstick.step1_label': { ko: 'STEP 1', en: 'STEP 1' },
    'lightstick.step1_html': { ko: '응원봉에 담을<br><strong>나의 마음</strong>을 새기다', en: 'Engrave <strong>your heart</strong><br>on the lightstick' },
    'lightstick.step2_label': { ko: 'STEP 2', en: 'STEP 2' },
    'lightstick.step2_html': { ko: '마음을 비추는<br><strong>보라빛 7컬러</strong> 선택', en: 'Choose from<br><strong>7 purple-inspired colors</strong>' },
    'lightstick.step3_label': { ko: 'STEP 3', en: 'STEP 3' },
    'lightstick.step3_html': { ko: 'AI가 빚어낸<br><strong>나만의 응원봉</strong> 탄생', en: 'AI crafts<br><strong>your unique lightstick</strong>' },
    'lightstick.step4_label': { ko: 'STEP 4', en: 'STEP 4' },
    'lightstick.step4_html': { ko: '함께 나누는<br><strong>보라빛 응원</strong>', en: 'Share your<br><strong>purple support</strong>' },
    'lightstick.btn_start': { ko: '나의 응원봉, 지금 만들기 💜', en: 'Create My Lightstick Now 💜' },
    'lightstick.plan_info': { ko: 'Free: 월 1회 | Purple: 월 10회 | VIP: 무제한 생성', en: 'Free: 1/month | Purple: 10/month | VIP: Unlimited' },
    'lightstick.modal_step1_title': { ko: '✍️ 응원봉에 새길 이름', en: '✍️ Name on Your Lightstick' },
    'lightstick.modal_step1_desc': { ko: '소중한 마음을 담아, 응원봉에 새길 이름이나 닉네임을 입력하세요', en: 'With all your heart, enter the name to engrave on your lightstick' },
    'lightstick.modal_step1_placeholder': { ko: '예: 지영, 보라해♡, 끝까지 함께', en: 'e.g. Jiyoung, Borahae♡, Together Forever' },
    'lightstick.modal_step1_max': { ko: '최대 20자', en: 'Max 20 characters' },
    'lightstick.modal_step1_next': { ko: '다음: 컬러 선택 →', en: 'Next: Choose Color →' },
    'lightstick.modal_step2_title': { ko: '🎨 마음을 비추는 컬러', en: '🎨 Color That Reflects Your Heart' },
    'lightstick.modal_step2_desc': { ko: '당신의 마음을 가장 잘 표현하는 보라빛 컬러를 선택하세요', en: 'Choose the purple-inspired color that best expresses your heart' },
    'lightstick.modal_step2_prev': { ko: '← 이전', en: '← Back' },
    'lightstick.modal_step2_next': { ko: '다음: 디자인 →', en: 'Next: Design →' },
    'lightstick.modal_step3_title': { ko: '🤖 응원봉 디자인', en: '🤖 Lightstick Design' },
    'lightstick.modal_step3_desc': { ko: '어떤 모양으로 마음을 전하고 싶나요? 테마와 아이디어를 자유롭게 담아주세요', en: 'What shape carries your heart? Freely add your themes and ideas' },
    'lightstick.modal_step3_shape': { ko: '🔷 응원봉 모양 선택', en: '🔷 Choose Lightstick Shape' },
    'lightstick.modal_step3_theme': { ko: '💡 테마 · 분위기 선택 (복수 가능)', en: '💡 Choose Theme & Mood (multiple OK)' },
    'lightstick.modal_step3_free': { ko: '✏️ 나만의 응원 메시지', en: '✏️ Your Creative Vision' },
    'lightstick.modal_step3_placeholder': { ko: '은하수가 흐르는 투명한 응원봉, 나비 날개 장식, 보라빛 별빛이 감도는 크리스탈...', en: 'A transparent lightstick with flowing galaxy, butterfly wing decorations, purple starlight crystal...' },
    'lightstick.modal_step3_summary_title': { ko: '📋 나의 응원봉 요약', en: '📋 My Lightstick Summary' },
    'lightstick.modal_step3_prev': { ko: '← 이전', en: '← Back' },
    'lightstick.modal_step3_generate': { ko: '💜 보라빛 응원봉 만들기', en: '💜 Create My Purple Lightstick' },
    'lightstick.modal_step4_title': { ko: '🎉 나만의 보라빛 응원봉 완성!', en: '🎉 Your Purple Lightstick is Ready!' },
    'lightstick.modal_step4_subtitle': { ko: '당신의 사랑과 응원이 빛나는, 세상에 단 하나뿐인 응원봉입니다', en: 'A one-of-a-kind lightstick shining with your love and support' },
    'lightstick.modal_step4_download': { ko: '💾 소중히 간직하기', en: '💾 Save to Keep' },
    'lightstick.modal_step4_share': { ko: '📤 함께 응원하기', en: '📤 Share & Cheer Together' },
    'lightstick.modal_step4_retry': { ko: '🔄 다시 만들기', en: '🔄 Try Again' },
    'lightstick.modal_step4_community_desc': { ko: '응원봉을 저장한 후, 같은 마음의 팬들과 함께 나눠요!', en: 'Save your lightstick and share it with fellow fans who share your heart!' },
    'lightstick.loading': { ko: '💜 당신의 마음을 담아 응원봉을 빚고 있어요...', en: '💜 Crafting your lightstick with all your heart...' },
    'lightstick.loading_sub': { ko: '보라빛 마법이 완성되기까지 잠시만 기다려주세요', en: 'Please wait while the purple magic comes to life' },
    'lightstick.link_weverse': { ko: 'Weverse (공식)', en: 'Weverse (Official)' },
    'lightstick.link_fancafe': { ko: '팬카페', en: 'Fan Cafe' },

    // --- Lightstick Colors ---
    'lightstick.color_purple': { ko: '보라빛 꿈', en: 'Purple Dream' },
    'lightstick.color_rose': { ko: '로즈 블러쉬', en: 'Rose Blush' },
    'lightstick.color_mint': { ko: '민트 프레시', en: 'Mint Fresh' },
    'lightstick.color_gold': { ko: '선샤인 골드', en: 'Sunshine Gold' },
    'lightstick.color_ocean': { ko: '오션 딥', en: 'Ocean Deep' },
    'lightstick.color_forest': { ko: '포레스트', en: 'Forest' },
    'lightstick.color_coral': { ko: '코랄 파이어', en: 'Coral Fire' },

    // --- 한글 건축 (사랑의 인사 샘플) ---
    'arch.sample_title': { ko: '사랑의 인사 (Salut d\'Amour) Op.12', en: 'Salut d\'Amour, Op.12' },
    'arch.sample_desc': { ko: '에드워드 엘가 곡을 한글 공감각 건축 메뉴얼에 따라 1~16마디 한글 자모로 번역한 결과를 시각화합니다.', en: 'Visualize bars 1–16 translated into Hangeul jamo by the Hangeul Synesthetic Architecture manual (Edward Elgar).' },
    'arch.sample_btn': { ko: '한글 건축 체험하기', en: 'Try Hangeul Architecture' },
    'arch.sample_video_btn': { ko: '한글 건축 영상 체험하기', en: 'Try Hangeul Architecture Video' },
    'arch.video_btn_hint': { ko: '건축물 생성 후 영상 체험이 가능합니다.', en: 'Video experience is available after the architecture is generated.' },
    'arch.video_btn_ready': { ko: '한글 건축 영상 체험을 시작할 수 있습니다.', en: 'You can now try the Hangeul architecture video experience.' },
    'arch.coming_soon_title': { ko: '곧 만나요', en: 'Coming soon' },
    'arch.coming_soon_desc': { ko: '한글 건축 체험이 곧 준비되고 있어요. Google의 프로젝트 지니(Genie)와 함께 더 풍부한 세계를 만들 수 있도록 열심히 준비 중입니다. 조금만 기다려 주세요!', en: 'Hangeul architecture experience is in preparation. We\'re working with Google\'s Project Genie to bring you richer worlds—thank you for your patience!' },
    'arch.coming_soon_confirm': { ko: '확인', en: 'OK' },
    'arch.genie_caption': { ko: 'Create your own worlds', en: 'Create your own worlds' },
    'arch.genie_desc': { ko: '한글 건축 체험은 Google의 실험적 프로젝트 지니(Genie)와 함께 무한히 다양한 세계를 만들고 탐험합니다.', en: 'Hangeul architecture experience is powered by Google\'s experimental Project Genie — create and explore infinitely diverse worlds.' },
    'arch.modal_title': { ko: '사랑의 인사 (Salut d\'Amour), Op.12', en: 'Salut d\'Amour, Op.12' },
    'arch.modal_piece_title': { ko: '작은것들을 위한 시', en: 'A Poem for Little Things' },
    'arch.modal_subtitle': { ko: '1~16마디 한글 자모 건축 그리드', en: 'Bars 1–16 Hangeul jamo architecture grid' },
    'arch.nano_loading': { ko: '나노 바나나가 한글 공감각 건축 메뉴얼을 기준으로 건축물을 생성하고 있습니다...', en: 'Nano Banana is generating architecture from the Hangeul Synesthetic Architecture manual...' },
    'arch.nano_loading_sub': { ko: '구조·멜로디·반주 요소가 건축 이미지로 변환됩니다 (약 10~30초)', en: 'Structure, melody & accompaniment become architecture (about 10–30 sec)' },
    'arch.nano_loading_video': { ko: '한글 건축 영상을 생성하고 있습니다... (1~2분 소요될 수 있습니다)', en: 'Generating Hangeul architecture video... (may take 1–2 minutes)' },
    'arch.nano_loading_image_first': { ko: '1단계: 악보 그리드 기준 이미지를 생성하고 있습니다...', en: 'Step 1: Generating image from sheet music grid...' },
    'arch.modal_save_hint': { ko: '닫기 전에 저장 버튼으로 다운로드하세요.', en: 'Use the save button to download before closing.' },
    'arch.download_video_btn': { ko: '💾 영상 저장', en: '💾 Save video' },
    'arch.modal_result_title': { ko: '나노 바나나가 만든 한글 건축물', en: 'Hangeul architecture by Nano Banana' },
    'arch.modal_result_subtitle': { ko: '한글 공감각 건축 시스템 표준 설계 메뉴얼 기반', en: 'Based on Hangeul Synesthetic Architecture System Standard Manual' },
    'arch.show_grid': { ko: '📋 자모 그리드 보기', en: '📋 View jamo grid' },
    'arch.error_title': { ko: '건축물 생성에 실패했습니다', en: 'Architecture generation failed' },
    'arch.video_error_title': { ko: '영상 생성에 실패했습니다', en: 'Video generation failed' },
    'arch.error_veo_hint': { ko: 'Veo 영상 생성은 Google AI Studio에서 Veo 모델 사용이 허용된 API 키가 필요합니다. .env에 GEMINI_API_KEY를 넣고 node scripts/build-config.js 실행 후 새로고침해 주세요.', en: 'Veo video generation requires an API key with Veo access in Google AI Studio. Add GEMINI_API_KEY to .env, run node scripts/build-config.js, then refresh.' },
    'arch.error_no_api_key': { ko: 'Gemini API 키가 없습니다. 프로젝트 루트에 .env 파일을 만들고 GEMINI_API_KEY=키값 을 넣은 뒤, 터미널에서 node scripts/build-config.js 를 실행하고 페이지를 새로고침해 주세요.', en: 'Gemini API key is not set. Add GEMINI_API_KEY=your_key to a .env file in the project root, run node scripts/build-config.js, then refresh the page.' },
    'arch.build_title': { ko: '🎵 음악을 올리면 한글 건축물이 됩니다', en: '🎵 Your music becomes Hangeul architecture' },
    'arch.build_desc': { ko: '샘플(사랑의 인사)을 선택하거나 MIDI·PDF·악보 이미지를 업로드한 뒤, 생성 버튼을 누르면 한글 건축물 이미지가 만들어집니다.', en: 'Choose the sample (Salut d\'Amour) or upload a MIDI, PDF or sheet music image, then click Generate to create your Hangeul architecture image.' },
    'arch.use_sample': { ko: '사랑의 인사 샘플 사용', en: 'Use Salut d\'Amour sample' },
    'arch.upload_midi': { ko: 'MIDI 파일 업로드', en: 'Upload MIDI file' },
    'arch.upload_midi_pdf': { ko: 'MIDI · PDF · 악보 이미지 업로드', en: 'Upload MIDI, PDF or sheet image' },
    'arch.generate_btn': { ko: '🏛️ 한글 건축물 생성', en: '🏛️ Generate Hangeul architecture' },
    'arch.generating': { ko: '한글 건축물 이미지를 생성하고 있어요...', en: 'Generating your Hangeul architecture image...' },
    'arch.result_title': { ko: '생성된 한글 건축물', en: 'Your Hangeul architecture' },
    'arch.step1_jamo_grid': { ko: '1. 한글 자모 그리드', en: '1. Hangeul jamo grid' },
    'arch.result_grid_desc': { ko: '구조·멜로디·반주 한글 자모 그리드', en: 'Structure, melody & accompaniment jamo grid' },
    'arch.step2_concept_title': { ko: '2. 건축 컨셉 디자인', en: '2. Architecture concept design' },
    'arch.step3_final_title': { ko: '3. 최종 건축 디자인', en: '3. Final architecture design' },
    'arch.step4_video_title': { ko: '5. 최종 영상', en: '5. Final video' },
    'arch.download_grid': { ko: '💾 그리드 이미지 저장', en: '💾 Save grid image' },
    'arch.result_building_title': { ko: '4. 한글 건축 이미지', en: '4. Hangeul architecture image' },
    'arch.concept_design_title': { ko: '3. 컨셉 디자인', en: '3. Concept design' },
    'arch.concept_design_desc': { ko: '건축 프레젠테이션 보드 (조감도·다이어그램·플랜·퍼스펙티브)', en: 'Architectural presentation board (aerial view, diagrams, plans, perspectives)' },
    'arch.concept_loading': { ko: '컨셉 디자인 이미지를 생성하고 있어요...', en: 'Generating concept design image...' },
    'arch.final_building_title': { ko: '5. 최종 한글 건축물', en: '5. Final Hangeul architecture' },
    'arch.final_building_desc': { ko: '최종 한글 건축물 이미지입니다.', en: 'Final Hangeul architecture image.' },
    'arch.final_loading': { ko: '최종 건축물 이미지를 생성하고 있어요...', en: 'Generating final building image...' },
    'arch.result_building_desc': { ko: '나노 바나나가 한글 공감각 건축 메뉴얼로 건축물을 생성합니다', en: 'Nano Banana generates a building from the Hangeul Synesthetic Architecture manual' },
    'arch.nano_building_loading': { ko: '건축물 이미지를 생성하고 있어요... (약 10~30초)', en: 'Generating building image... (about 10–30 sec)' },
    'arch.error_no_api_key_short': { ko: 'API 키 설정 시 건축물 이미지를 생성할 수 있습니다.', en: 'Building image is available when API key is set.' },
    'arch.download_btn': { ko: '💾 이미지 저장', en: '💾 Save image' },
    'arch.video_from_image_btn': { ko: '🎬 이 이미지로 영상 생성', en: '🎬 Generate video from this image' },
    'arch.auto_video_hint': { ko: '이미지 생성 후 같은 이미지로 영상이 자동 생성됩니다.', en: 'After the image is created, a video is generated automatically from it.' },
    'arch.video_retry_btn': { ko: '🎬 영상 다시 생성', en: '🎬 Generate video again' },
    'arch.video_view_btn': { ko: '🎬 건축물 영상 보기', en: '🎬 View architecture video' },
    'arch.video_need_final_image': { ko: '3. 최종 건축 디자인을 먼저 생성한 뒤 영상 보기를 눌러 주세요.', en: 'Please generate the final architecture design first, then click View video.' },
    'arch.generate_again': { ko: '🔄 다시 생성', en: '🔄 Generate again' },
    'arch.status_sample': { ko: '사랑의 인사 샘플이 선택되었습니다.', en: 'Salut d\'Amour sample selected.' },
    'arch.status_uploaded': { ko: 'MIDI 파일이 업로드되었습니다. (생성 시 샘플로 시연)', en: 'MIDI file uploaded. (Demo uses sample for now)' },
    'arch.status_uploaded_pdf': { ko: 'PDF 파일이 업로드되었습니다. (생성 시 샘플로 시연)', en: 'PDF file uploaded. (Demo uses sample for now)' },
    'arch.status_uploaded_image': { ko: '악보 이미지가 업로드되었습니다. (생성 시 샘플로 시연)', en: 'Sheet music image uploaded. (Demo uses sample for now)' },
    'arch.file_selected': { ko: '✓ 선택된 파일: ', en: '✓ Selected file: ' },

    // --- Footer extra ---
    'footer.ai_styling_link': { ko: 'AI 스타일링', en: 'AI Styling' },
    'footer.shop_link': { ko: '보라해 굿즈샵', en: 'Borahae Shop' },
    'footer.membership_link': { ko: '멤버십', en: 'Membership' },

    // --- Lookbook ---
    'lookbook.badge': { ko: 'Lookbook', en: 'Lookbook' },
    'lookbook.title': { ko: "K-pop 감성 Today's Pick", en: "K-pop Today's Pick" },
    'lookbook.desc': { ko: '보라해 AI가 추천하는 오늘의 K-pop 코디', en: "Today's K-pop outfits recommended by Borahae AI" },
    'lookbook.concert': { ko: '콘서트 글램', en: 'Concert Glam' },
    'lookbook.concert_desc': { ko: '무대 위 조명 아래 빛나는 보라빛 콘서트 룩', en: 'A purple concert look that shines under stage lights' },
    'lookbook.fanmeeting': { ko: '팬미팅 코디', en: 'Fan Meeting' },
    'lookbook.daily': { ko: '데일리 K-pop', en: 'Daily K-pop' },
    'lookbook.casual': { ko: '덕질 캐주얼', en: 'Fan Casual' },
    'lookbook.purple': { ko: '보라해 무드', en: 'Borahae Mood' },

    // --- Testimonials ---
    'testimonials.badge': { ko: 'Reviews', en: 'Reviews' },
    'testimonials.title': { ko: '보라해 팬들의 이야기', en: 'Borahae Fan Stories' },
    'testimonials.review1': {
      ko: '"콘서트 갈 때 뭘 입을지 항상 고민이었는데, AI가 퍼스널 컬러에 맞춰 추천해줘서 매번 완벽한 코디 완성!"',
      en: '"I always worried about what to wear to concerts, but AI recommends based on my personal color — perfect outfit every time!"'
    },
    'testimonials.author1_name': { ko: '지영', en: 'Jiyoung' },
    'testimonials.author1_role': { ko: 'K-pop 팬, 28세', en: 'K-pop Fan, 28' },
    'testimonials.review2': {
      ko: '"보라해 굿즈샵에서 보라빛 에코백 구매했는데 팬미팅에서 옆자리 팬이 같은 거 들고 와서 바로 친구됨 ㅋㅋ"',
      en: '"Bought a purple eco bag from the Borahae shop and the fan next to me at the fan meeting had the same one — instant friends lol"'
    },
    'testimonials.author2_name': { ko: '민준', en: 'Minjun' },
    'testimonials.author2_role': { ko: '대학생, 24세', en: 'College Student, 24' },
    'testimonials.review3': {
      ko: '"멤버십 가입하고 이벤트 기획에 참여했어요. 같은 마음의 팬들과 함께하니까 덕질이 100배 즐거워요!"',
      en: '"Joined the membership and participated in event planning. Being with like-minded fans makes fandom 100x more fun!"'
    },
    'testimonials.author3_name': { ko: '서현', en: 'Seohyun' },
    'testimonials.author3_role': { ko: '보라해 VIP, 32세', en: 'Borahae VIP, 32' },

    // --- About ---
    'about.badge': { ko: 'About Us', en: 'About Us' },
    'about.title': { ko: '보라해,<br>팬이 만드는 세상', en: 'BORAHAE,<br>A World Made by Fans' },
    'about.desc': {
      ko: '보라해(BORAHAE)는 K-pop을 사랑하는 팬들이 만들어가는 독립 라이프스타일 플랫폼입니다. AI 스타일링, 팬 굿즈, 커뮤니티, 이벤트를 통해 팬덤의 새로운 가능성을 열어갑니다.',
      en: 'BORAHAE is an independent lifestyle platform built by K-pop fans. We open new possibilities for fandom through AI styling, fan goods, community, and events.'
    },
    'about.tech_title': { ko: 'AI 스타일링', en: 'AI Styling' },
    'about.tech_desc': { ko: 'K-pop 감성 맞춤 코디 추천', en: 'K-pop vibe custom outfit recommendations' },
    'about.realtime_title': { ko: '팬 커뮤니티', en: 'Fan Community' },
    'about.realtime_desc': { ko: '보라해를 외치는 팬들의 공간', en: 'A space for fans who say Borahae' },
    'about.users_title': { ko: '50K+ 보라해 팬', en: '50K+ Borahae Fans' },
    'about.users_desc': { ko: '함께 만드는 팬 라이프', en: 'Fan life built together' },

    // --- CTA ---
    'cta.title': { ko: '보라해, 끝까지 함께해요', en: 'BORAHAE, Together Forever' },
    'cta.desc': { ko: '보라빛으로 물든 팬 라이프를 지금 시작하세요', en: 'Start your purple fan life now' },
    'cta.start': { ko: '무료로 시작하기', en: 'Get Started Free' },
    'cta.learn': { ko: '더 알아보기', en: 'Learn More' },

    // --- Footer ---
    'footer.tagline': { ko: 'K-pop 팬 라이프스타일 플랫폼', en: 'K-pop Fan Lifestyle Platform' },
    'footer.product': { ko: 'Product', en: 'Product' },
    'footer.ai_styling': { ko: 'AI 스타일링', en: 'AI Styling' },
    'footer.personal_color': { ko: '퍼스널 컬러', en: 'Personal Color' },
    'footer.virtual_fitting': { ko: '가상 피팅', en: 'Virtual Fitting' },
    'footer.pricing': { ko: '가격 정책', en: 'Pricing' },
    'footer.company': { ko: 'Company', en: 'Company' },
    'footer.partnership': { ko: '제휴문의', en: 'Partnership' },
    'footer.support': { ko: 'Support', en: 'Support' },
    'footer.copyright': { ko: '© 2026 BORAHAE. All rights reserved. | 팬이 만드는 보라빛 세상', en: '© 2026 BORAHAE. All rights reserved. | A Purple World Made by Fans' },

    // --- 법적 고지 (Legal Disclaimer) ---
    'disclaimer.title': { ko: '⚠️ 법적 고지 (Legal Disclaimer)', en: '⚠️ Legal Disclaimer' },
    'disclaimer.p1': { ko: '이 웹사이트는 K-pop 팬이 운영하는 독립적인 팬 라이프스타일 플랫폼 입니다.', en: 'This website is an independent fan lifestyle platform operated by K-pop fans.' },
    'disclaimer.p2': { ko: '특정 아티스트, 엔터테인먼트 소속사와 제휴, 후원, 승인 관계가 없습니다.', en: 'It is not affiliated with, sponsored by, or endorsed by any specific artist or entertainment company.' },
    'disclaimer.p3': { ko: '\'보라해(Borahae)\'는 한국 특허청(KIPO)에서 상표등록이 거절되어 등록 상표가 아닌, 팬 문화에서 자연발생적으로 사용되는 표현입니다 (특허법원 2023허10361, 2023.10.27 확정).', en: '\'Borahae\' is not a registered trademark; it is an expression used organically in fan culture (Patent Court 2023Heo10361, Oct 27, 2023).' },
    'disclaimer.p4': { ko: '본 플랫폼에서 사용되는 모든 아티스트 관련 권리는 해당 권리자에게 있으며, 본 사이트의 콘텐츠는 팬 문화·팬 활동 지원 목적으로 제공됩니다. 유료 멤버십 등 수익은 플랫폼 운영 및 서비스 유지에 사용되며, 특정 아티스트·소속사와의 수익 분배나 공식 승인을 의미하지 않습니다.', en: 'All artist-related rights used on this platform belong to their respective owners. Site content is provided to support fan culture and fan activities. Revenue from paid membership is used for platform operation and service maintenance and does not imply revenue sharing or official endorsement by any artist or company.' },

    // --- Comments ---
    'comments.title': { ko: '댓글', en: 'Comments' },

    // --- Auth Modal ---
    'auth.welcome': { ko: 'Welcome', en: 'Welcome' },
    'auth.subtitle': { ko: '보라해에 오신 것을 환영합니다', en: 'Welcome to BORAHAE' },
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
    'partnership.desc': { ko: '보라해와 함께하고 싶으시다면 아래 양식을 작성해 주세요.', en: 'Fill out the form below to partner with BORAHAE.' },
    'partnership.name': { ko: '이름 / 담당자', en: 'Name / Contact Person' },
    'partnership.email': { ko: '이메일', en: 'Email' },
    'partnership.company': { ko: '회사 / 브랜드', en: 'Company / Brand' },
    'partnership.message': { ko: '문의 내용', en: 'Message' },
    'partnership.submit': { ko: '보내기', en: 'Send' },

    // --- Chat ---
    'chat.title': { ko: '소아베', en: 'Soave' },
    'chat.status': { ko: '온라인', en: 'Online' },
    'chat.hello': { ko: '안녕!', en: 'Hey!' },
    'chat.intro': {
      ko: '나는 보라해를 사랑하는 아미, <strong>소아베</strong>야.<br>코디나 스타일 고민 같이 나눠 보자.',
      en: "I'm Soave, an ARMY who loves BORAHAE.<br>Let's talk about outfit & style together."
    },
    'chat.placeholder': { ko: '메시지를 입력하세요...', en: 'Type a message...' },
    'chat.q1': { ko: '💜 콘서트 코디 추천', en: '💜 Concert Outfit' },
    'chat.q2': { ko: '🎨 퍼스널 컬러 진단', en: '🎨 Personal Color' },
    'chat.q3': { ko: '🎤 팬미팅 스타일링', en: '🎤 Fan Meeting Style' },
    'chat.q4': { ko: '🟣 보라해 코디', en: '🟣 Purple Outfit' },
    'chat.q5': { ko: '✨ 내 취향 말해줘', en: '✨ Tell My Taste' }
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
      ? 'BORAHAE - K-pop Fan Lifestyle Platform'
      : '보라해 BORAHAE - I Purple You';
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
