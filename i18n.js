// BORAHAE - Internationalization (i18n)
// 한국어(ko) / English(en) 다국어 지원

(function() {
  'use strict';

  // ========================================
  // Translation Data
  // ========================================
  var translations = {
    // --- Navigation ---
    'nav.services': { ko: '서비스', en: 'Services' },
    'nav.styling': { ko: '스타일링', en: 'Styling' },
    'nav.shop': { ko: '굿즈샵', en: 'Shop' },
    'nav.membership': { ko: '멤버십', en: 'Membership' },
    'nav.login': { ko: '로그인', en: 'Login' },
    'nav.logout': { ko: '로그아웃', en: 'Logout' },

    // --- Hero ---
    'hero.badge': { ko: 'K-pop Fan Lifestyle Platform', en: 'K-pop Fan Lifestyle Platform' },
    'hero.tagline': { ko: 'I Purple You · 끝까지 함께', en: 'I Purple You · Together Forever' },
    'hero.title_line': { ko: '보라해', en: 'BORAHAE' },
    'hero.title_highlight': { ko: '팬이 만드는 보라빛 세상', en: 'A Purple World Made by Fans' },
    'hero.desc': {
      ko: 'K-pop을 사랑하는 팬들의 라이프스타일 플랫폼.<br>AI 스타일링, 팬 굿즈, 커뮤니티, 이벤트까지<br><strong>보라빛으로 물든</strong> 특별한 팬 경험을 시작하세요',
      en: 'A lifestyle platform for K-pop fans.<br>AI styling, fan goods, community & events —<br>start your <strong>purple-tinted</strong> special fan experience'
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

    // --- Features ---
    'features.badge': { ko: 'Services', en: 'Services' },
    'features.title': { ko: '보라해가 만드는 팬 라이프스타일', en: 'Fan Lifestyle by BORAHAE' },
    'features.desc': { ko: 'K-pop을 사랑하는 당신을 위한 올인원 플랫폼', en: 'All-in-one platform for K-pop lovers' },
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
    'ai.badge': { ko: 'AI Styling', en: 'AI Styling' },
    'ai.title': { ko: '3단계로 완성되는<br>K-pop 감성 코디', en: 'K-pop Style<br>in 3 Steps' },
    'ai.step1_title': { ko: '프로필 분석', en: 'Profile Analysis' },
    'ai.step1_desc': { ko: '간단한 설문과 사진으로 AI가 퍼스널 컬러와 체형을 분석합니다', en: 'AI analyzes your personal color and body type' },
    'ai.step2_title': { ko: 'K-pop 스타일 매칭', en: 'K-pop Style Matching' },
    'ai.step2_desc': { ko: '콘서트, 팬미팅, 일상 등 상황별 최적의 스타일을 찾습니다', en: 'Finding the best style for concerts, fan meetings & daily life' },
    'ai.step3_title': { ko: '보라해 코디 완성', en: 'Borahae Outfit Complete' },
    'ai.step3_desc': { ko: 'AI가 생성한 코디로 보라빛 감성을 완성하세요', en: 'Complete your purple vibe with AI-generated outfits' },
    'ai.cta': { ko: '보라해 스타일링 시작', en: 'Start Borahae Styling' },

    // --- Shop ---
    'shop.badge': { ko: 'Shop', en: 'Shop' },
    'shop.title': { ko: '보라해 굿즈샵', en: 'Borahae Goods Shop' },
    'shop.desc': { ko: '보라빛 감성을 담은 팬메이드 아이템', en: 'Fan-made items infused with purple vibes' },
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

    // --- BORATIME (시계 디자인 · 팬심 소장) ---
    'boratime.badge': { ko: 'BORATIME', en: 'BORATIME' },
    'boratime.title': { ko: '시계도 패션이다.<br>팬심을 간직하다', en: 'Watches Are Fashion.<br>Keep Your Fan Heart' },
    'boratime.desc': { ko: '앱에서 다운로드로 보라빛 시계 페이스를 소장하세요. 콘서트, 보라해, 일곱 개의 달, 꽃길까지—소중한 순간을 시계에 담습니다.', en: 'Download watch faces in the app. Purple ocean, seven moons, flower path—keep your precious moments on your wrist.' },
    'boratime.cta': { ko: '앱에서 만나기', en: 'Get the App' },
    'boratime.cta_sub': { ko: '앱스토어 · 플레이스토어 다운로드', en: 'Download on App Store & Play Store' },

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
    'lightstick.badge': { ko: '보라빛 응원봉', en: 'Purple Lightstick' },
    'lightstick.title': { ko: '보라빛 응원봉, 너를 위해 빛나는 💜', en: 'Purple Lightstick, Shining for You 💜' },
    'lightstick.desc': { ko: '당신의 사랑과 응원을 담아, 세상에 단 하나뿐인 나만의 응원봉을 AI가 만들어드려요', en: 'Filled with your love & support, AI creates a one-of-a-kind lightstick just for you' },
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
