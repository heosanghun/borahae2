// BORAHAE - Internationalization (i18n)
// 한국어(ko) / English(en) 다국어 지원

(function() {
  'use strict';

  // ========================================
  // Translation Data
  // ========================================
  var translations = {
    // --- Navigation (BORAHAE 3.0: 3대 핵심) ---
    'nav.play': { ko: 'PLAY (일깨우기)', en: 'PLAY' },
    'nav.create': { ko: 'CREATE (짓기)', en: 'CREATE' },
    'nav.store': { ko: 'STORE (간직하기)', en: 'STORE' },
    'nav.services': { ko: '서비스', en: 'Services' },
    'nav.styling': { ko: '스타일링', en: 'Styling' },
    'nav.shop': { ko: '굿즈샵', en: 'Shop' },
    'nav.membership': { ko: '멤버십', en: 'Membership' },
    'nav.login': { ko: '로그인', en: 'Login' },
    'nav.logout': { ko: '로그아웃', en: 'Logout' },

    // --- Hero (BORAHAE 3.0 메인 카피) ---
    'hero.badge': { ko: 'Borahae Life Navigation', en: 'Borahae Life Navigation' },
    'hero.tagline': { ko: 'Discover. Build. Navigate.', en: 'Discover. Build. Navigate.' },
    'hero.title_line': { ko: '보라해', en: 'BORAHAE' },
    'hero.title_highlight': { ko: 'Borahae Life Navigation', en: 'Borahae Life Navigation' },
    'hero.desc': {
      ko: '이름과 생일 속에 숨겨진 고유한 <strong>나(Me)</strong>를 발견하고,<br>영감으로 <strong>나만의 우주(Space)</strong>를 건축하며,<br>미래의 기술로 당신의 삶을 <strong>인도(Navigate)</strong>합니다.',
      en: 'Discover the unique <strong>Me</strong> hidden in your name and birthday,<br>Build your own <strong>Space</strong> with inspiration,<br>and <strong>Navigate</strong> your life with future technology.'
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
      ko: '<strong>OpenAI</strong>와 시작하는 보라빛 세계<br>지금 시작하세요',
      en: 'Your purple universe, powered by <strong>OpenAI</strong><br>Start now'
    },

    // --- Features (BORAHAE 3.0: 3대 핵심 서비스) ---
    'features.badge': { ko: 'BORAHAE UNIVERSE', en: 'BORAHAE UNIVERSE' },
    'features.title': { ko: '어제보다 더 나를 사랑하는 방법', en: 'How to love myself more than yesterday' },
    'features.desc': { ko: '믿음과 사랑으로 끝까지 함께하는 보라해(Borahae)의 약속', en: 'The promise of Borahae: Trust and love together until the end' },
    'features.pillar1_title': { ko: '한글 페르소나', en: 'Hangeul Persona' },
    'features.pillar1_desc': { ko: '이름 속에 숨겨진 고유한 한글 자아를 발견하고, 당신의 영혼을 닮은 페르소나와 스타일을 AI가 빚어냅니다.', en: 'Discover the unique Hangeul self hidden in your name; AI crafts a persona and style that mirrors your soul.' },
    'features.pillar1_btn': { ko: '일깨우기 · PLAY', en: 'AWAKEN' },
    'features.pillar2_title': { ko: '매직샵 (Magic Shop)', en: 'Magic Shop' },
    'features.pillar2_desc': { ko: '당신의 선율은 단단한 안식처가 되고, 당신의 심장 박동은 내일의 이정표가 됩니다 💜', en: 'Your melody becomes a solid sanctuary, and your heartbeat becomes tomorrow\'s compass 💜' },
    'features.pillar2_btn': { ko: '짓기 · CREATE', en: 'BUILD' },
    'features.pillar3_title': { ko: '보라 굿즈', en: 'Bora Goods' },
    'features.pillar3_desc': { ko: '일궈낸 페르소나와 안식처를 일상의 빛으로 소장하세요. 워치페이스부터 실물 굿즈까지 당신의 세계를 간직합니다.', en: 'Preserve your persona and sanctuary as daily light. Keep your world close, from watch faces to physical goods.' },
    'features.pillar3_btn': { ko: '간직하기 · STORE', en: 'CHERISH' },
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
    'ai.badge': { ko: 'Chapter 1. Discovery', en: 'Chapter 1. Discovery' },
    'ai.title': { ko: '세상에 단 하나뿐인<br>당신의 고유한 주파수를 찾습니다', en: 'Finding your unique frequency,<br>the only one in the world' },
    'ai.step1_title': { ko: '프로필 분석', en: 'Profile Analysis' },
    'ai.step1_desc': { ko: '쉬운 선택(성별·연령·체형)으로 당신의 기본 프로필을 담습니다', en: 'Easy choices (gender, age, body type) capture your profile' },
    'ai.step2_title': { ko: 'K-pop 스타일 매칭', en: 'K-pop Style Matching' },
    'ai.step2_desc': { ko: '콘서트, 팬미팅, 일상 등 상황별 당신에게 맞는 스타일을 찾습니다', en: 'Find styles that fit you for concerts, fan meetings & daily life' },
    'ai.step3_title': { ko: '보라해 코디 완성', en: 'Borahae Outfit Complete' },
    'ai.step3_desc': { ko: '당신만을 위한 초개인맞춤 코디로 보라빛 감성을 완성하세요', en: 'Complete your purple vibe with ultra-personalized outfits for you' },
    'ai.cta': { ko: '보라해 스타일링 시작', en: 'Start Borahae Styling' },
    'ai.subtitle': { ko: '이름과 생일 속에 숨겨진 코드를 찾아, 진정한 나를 마주하는 첫 번째 여정입니다.', en: 'The first journey to face your true self by finding the codes hidden in your name and birthday.' },
    'ai.connector': { ko: '이름 속에 새겨진 영혼의 자취를 찾아, 나만의 페르소나와 서사를 일깨웁니다.', en: 'Trace the soul\'s imprint in your name to awaken your unique persona and narrative.' },
    'ai.input_title': { ko: '이름 속에 숨겨진 영혼의 자취', en: 'The Imprint of the Soul in Your Name' },
    'ai.input_desc': { ko: '이름을 자음과 모음의 리듬으로 풀어내어, 당신의 본질을 투영하는 한글 페르소나들의 서사를 펼칩니다.', en: 'Unravel your name into the rhythm of consonants and vowels to unfold a narrative of Hangeul personas reflecting your essence.' },
    'ai.input_label': { ko: '영혼의 주파수를 입력하세요', en: 'Enter your soul\'s frequency' },
    'ai.input_placeholder': { ko: '당신의 이름', en: 'Your name' },
    'ai.btn_create': { ko: '서사 일깨우기', en: 'Awaken Narrative' },
    'ai.result_summary': { ko: '✨ 나만의 고유한 자아들', en: '✨ My Unique Selves' },
    'ai.result_story_label': { ko: '📖 영혼의 기록 · 시나리오', en: '📖 Records of the Soul · Scenario' },
    'ai.result_image_label': { ko: '🖼 시나리오의 형상', en: '🖼 Shapes of the Scenario' },
    'ai.share_insta': { ko: '📷 보라빛 세계 공유하기', en: '📷 Share Purple World' },
    'ai.share_desc': { ko: '이 서사를 간직하고, 동반자들과 함께 나누어 보세요.', en: 'Keep this narrative and share it with your companions.' },
    'ai.learn_more_trigger': { ko: '스타일과의 연결 더 알아보기', en: 'Learn how this connects to style' },
    'ai.learn_more_hint': { ko: '마음에 드는 캐릭터를 골라보세요 (최대 5개). 스타일 추천에 반영됩니다.', en: 'Pick characters you like (up to 5). They\'ll influence your style recommendations.' },
    'ai.selected_count': { ko: '{n}개 선택됨', en: '{n} selected' },
    'persona.name.고롱': { ko: '고롱', en: 'GoLong' },
    'persona.name.노롱': { ko: '노롱', en: 'NoLong' },
    'persona.name.도롱': { ko: '도롱', en: 'DoLong' },
    'persona.name.로롱': { ko: '로롱', en: 'RoLong' },
    'persona.name.모롱': { ko: '모롱', en: 'MoLong' },
    'persona.name.보롱': { ko: '보롱', en: 'BoLong' },
    'persona.name.소롱': { ko: '소롱', en: 'SoLong' },
    'persona.name.오롱': { ko: '오롱', en: 'OhLong' },
    'persona.name.올롱': { ko: '올롱', en: 'OlLong' },
    'persona.name.조롱': { ko: '조롱', en: 'JoLong' },
    'persona.name.초롱': { ko: '초롱', en: 'ChoLong' },
    'persona.name.코롱': { ko: '코롱', en: 'KoLong' },
    'persona.name.토롱': { ko: '토롱', en: 'ToLong' },
    'persona.name.포롱': { ko: '포롱', en: 'PoLong' },
    'persona.name.호롱': { ko: '호롱', en: 'HoLong' },
    'persona.name.아롱': { ko: '아롱', en: 'AhLong' },
    'persona.name.애롱': { ko: '애롱', en: 'AeLong' },
    'persona.name.야롱': { ko: '야롱', en: 'YahLong' },
    'persona.name.얍롱': { ko: '얍롱', en: 'YapLong' },
    'persona.name.어롱': { ko: '어롱', en: 'EoLong' },
    'persona.name.에이롱': { ko: '에이롱', en: 'EiyLong' },
    'persona.name.여롱': { ko: '여롱', en: 'YeoLong' },
    'persona.name.예롱': { ko: '예롱', en: 'YehLong' },
    'persona.name.요롱': { ko: '요롱', en: 'YoLong' },
    'persona.name.우롱': { ko: '우롱', en: 'WooLong' },
    'persona.name.유롱': { ko: '유롱', en: 'YuLong' },
    'persona.name.으롱': { ko: '으롱', en: 'EuLong' },
    'persona.name.이롱': { ko: '이롱', en: 'YiLong' },
    'persona.role.발명가': { ko: '발명가', en: 'Inventor' },
    'persona.role.가수': { ko: '가수', en: 'Singer' },
    'persona.role.도우미': { ko: '도우미', en: 'Helper' },
    'persona.role.요리사': { ko: '요리사', en: 'Chef' },
    'persona.role.뚝딱이': { ko: '뚝딱이', en: 'Handyman' },
    'persona.role.천문학자': { ko: '천문학자', en: 'Astronomer' },
    'persona.role.시인': { ko: '시인', en: 'Poet' },
    'persona.role.웃음꽃': { ko: '웃음꽃', en: 'Joy' },
    'persona.role.상상가': { ko: '상상가', en: 'Imagination' },
    'persona.role.댄서': { ko: '댄서', en: 'Dancer' },
    'persona.role.파수꾼': { ko: '파수꾼', en: 'Sentinel' },
    'persona.role.달변가': { ko: '달변가', en: 'Orator' },
    'persona.role.탐정': { ko: '탐정', en: 'Detective' },
    'persona.role.천하장사': { ko: '천하장사', en: 'Strongman' },
    'persona.role.화가': { ko: '화가', en: 'Painter' },
    'persona.role.선생님': { ko: '선생님', en: 'Teacher' },
    'persona.role.전령사': { ko: '전령사', en: 'Messenger' },
    'persona.role.사진가': { ko: '사진가', en: 'Photographer' },
    'persona.role.정원사': { ko: '정원사', en: 'Gardener' },
    'persona.role.길잡이': { ko: '길잡이', en: 'Guide' },
    'persona.role.치유사': { ko: '치유사', en: 'Healer' },
    'persona.role.연주가': { ko: '연주가', en: 'Musician' },
    'persona.role.동물 조련사': { ko: '동물 조련사', en: 'Animal Trainer' },
    'persona.role.기록가': { ko: '기록가', en: 'Archivist' },
    'persona.role.해양 탐험가': { ko: '해양 탐험가', en: 'Ocean Explorer' },
    'persona.role.명상가': { ko: '명상가', en: 'Meditator' },
    'persona.role.재단사': { ko: '재단사', en: 'Tailor' },
    'persona.role.마법사': { ko: '마법사', en: 'Wizard' },
    'ai.input_label': { ko: '영혼의 주파수를 입력하세요', en: 'Enter your soul\'s frequency' },
    'ai.input_placeholder': { ko: '당신의 이름', en: 'Your name' },
    'ai.btn_create': { ko: '서사 일깨우기', en: 'Awaken Narrative' },

    // --- Soul Color ---
    'soulcolor.connector': { ko: '생년월일로 찾는 나만의 탄생 컬러 · 바이브', en: 'Your birth color & vibe from your birthday' },
    'soulcolor.title': { ko: '당신의 소울 컬러는?', en: 'What\'s your Soul Color?' },
    'soulcolor.desc': { ko: '생년월일을 입력하면, 당신의 고유한 탄생 컬러와 바이브를 찾아드립니다.', en: 'Enter your birthday to discover your unique birth color and vibe.' },
    'soulcolor.date_label': { ko: '생년월일', en: 'Birthday' },
    'soulcolor.date_aria': { ko: '생년월일 선택', en: 'Select birthday' },
    'soulcolor.btn_analyze': { ko: '분석하기', en: 'Analyze' },
    'soulcolor.privacy_hint': { ko: '🔒 입력하신 정보는 결과 생성 즉시 폐기되며, 서버에 저장되지 않습니다.', en: '🔒 Your input is discarded immediately after use and is not stored on any server.' },
    'soulcolor.preview_label': { ko: '생일을 입력하면 찾아지는 소울 컬러', en: 'Soul color found from your birthday' },
    'soulcolor.preview_cta': { ko: '당신의 탄생 컬러는 어떤 빛일까요?', en: 'What light is your birth color?' },
    'soulcolor.music_btn': { ko: '🎵 내 탄생뮤직 만들기', en: '🎵 Create My Birth Music' },
    'soulcolor.music_aria': { ko: '내 탄생뮤직 만들기', en: 'Create my birth music' },
    'soul.rm.keyword': { ko: 'Indigo Blue (지혜의 리더)', en: 'Indigo Blue (Wise Leader)' },
    'soul.rm.personality': { ko: '깊은 통찰과 자연을 사랑하는 지혜', en: 'Deep insight and love for nature' },
    'soul.jin.keyword': { ko: 'Moonlight Silver (순수의 달빛)', en: 'Moonlight Silver (Pure Moonlight)' },
    'soul.jin.personality': { ko: '어두운 밤하늘을 밝히는 변치 않는 순수함', en: 'Unchanging purity that lights the night sky' },
    'soul.suga.keyword': { ko: 'Piano Black (열정의 천재)', en: 'Piano Black (Passionate Genius)' },
    'soul.suga.personality': { ko: '무채색 건반 위에서 피어나는 깊은 내면', en: 'Deep inner world blossoming on monochrome keys' },
    'soul.jhope.keyword': { ko: 'Sunshine Red (희망 에너지)', en: 'Sunshine Red (Hopeful Energy)' },
    'soul.jhope.personality': { ko: '태양처럼 주위를 밝히는 긍정의 아이콘', en: 'A positive icon that brightens everyone around' },
    'soul.jimin.keyword': { ko: 'Serendipity Gold (매혹의 별)', en: 'Serendipity Gold (Enchanting Star)' },
    'soul.jimin.personality': { ko: '우연히 찾아온 기적 같은 아름다움', en: 'Miraculous beauty found by chance' },
    'soul.v.keyword': { ko: 'Forest Green (자유로운 영혼)', en: 'Forest Green (Free Spirit)' },
    'soul.v.personality': { ko: '예측할 수 없는 신비로움과 독창성', en: 'Unpredictable mystique and originality' },
    'soul.jk.keyword': { ko: 'Borahae Purple (영원한 사랑)', en: 'Borahae Purple (Eternal Love)' },
    'soul.jk.personality': { ko: '일곱 빛깔의 완성, 끝없는 사랑의 맹세', en: 'Completion of seven colors, endless pledge of love' },
    'flow.step1_done': { ko: 'STEP 1 완료! 다음 단계로 이어집니다 ⬇️', en: 'STEP 1 done! Continue to the next ⬇️' },
    'flow.step2_done': { ko: 'STEP 2 완료! 이제 스타일을 완성할 시간 ⬇️', en: 'STEP 2 done! Time to complete your style ⬇️' },

    // --- Shop ---
    'shop.badge': { ko: 'STORE · 보라 굿즈', en: 'STORE · Bora Goods' },
    'shop.title': { ko: '발견한 자아와 일궈낸 안식처를, 일상의 빛으로 소장', en: 'Keep your discovered self and built sanctuary as daily light' },
    'shop.desc': { ko: '디지털 워치페이스부터 당신의 공간을 닮은 실물 굿즈까지 — 보라해의 철학을 일상으로 가져오세요.', en: 'From digital watch faces to goods that mirror your space — bring Borahae\'s philosophy into your life.' },
    'shop.cat_clothing': { ko: '보라해 의류', en: 'Borahae Clothing' },
    'shop.cat_ecobag': { ko: '에코백', en: 'Eco Bags' },
    'shop.cat_phonecase': { ko: '폰케이스', en: 'Phone Cases' },
    'shop.cat_keyring': { ko: '키링 · 액세서리', en: 'Keyrings & Accessories' },
    'shop.cat_stationery': { ko: '문구 · 다이어리', en: 'Stationery & Diaries' },
    'shop.cat_sticker': { ko: '스티커 · 데코', en: 'Stickers & Deco' },
    'shop.cat_boratime': { ko: '시계 · 보라타임', en: 'Watch · BORATIME' },
    'shop.cat_clothing_title': { ko: '보라해 의류', en: 'Borahae Apparel' },
    'shop.cat_clothing_desc': { ko: '당신의 선율을 닮은 보라빛 실루엣', en: 'Purple silhouettes mirroring your melody' },
    'shop.cat_ecobag_title': { ko: '에코백', en: 'Eco Bags' },
    'shop.cat_ecobag_desc': { ko: '일상의 모든 순간을 담는 보라빛 안식처', en: 'A purple sanctuary for all your daily moments' },
    'shop.cat_phonecase_title': { ko: '폰케이스', en: 'Phone Cases' },
    'shop.cat_phonecase_desc': { ko: '손끝으로 전해지는 보라해의 주파수', en: 'Borahae\'s frequency felt at your fingertips' },
    'shop.cat_keyring_title': { ko: '키링 · 악세서리', en: 'Keyrings & Accessories' },
    'shop.cat_keyring_desc': { ko: '어디서든 당신의 공간과 연결되는 고리', en: 'A link that connects you to your space anywhere' },
    'shop.cat_stationery_title': { ko: '문구 · 다이어리', en: 'Stationery & Diaries' },
    'shop.cat_stationery_desc': { ko: '자아의 발견을 기록하는 영혼의 일기', en: 'A soul\'s diary recording the discovery of self' },
    'shop.cat_sticker_title': { ko: '스티커 · 데코', en: 'Stickers & Deco' },
    'shop.cat_sticker_desc': { ko: '평범한 일상을 보라빛으로 물들이는 흔적', en: 'Traces that tint ordinary life in purple' },
    'shop.app_cta': { ko: '앱에서 만나기', en: 'Get the App' },
    'shop.app_cta_sub': { ko: '앱에서 더 깊은 보라빛 세계를 경험하세요', en: 'Experience a deeper purple world in the app' },
    'shop.view_naver': { ko: '네이버 쇼핑에서 보기', en: 'View on Naver Shopping' },
    'shop.cat_lightstick': { ko: '응원봉(기억의 등불)', en: 'Cheering Stick (Lightstick)' },
    'shop.cat_lightstick_title': { ko: '나만의 응원봉(기억의 등불) · 커스텀 굿즈', en: 'My Cheering Stick · Custom Goods' },
    'shop.cat_lightstick_desc': { ko: '매직샵에서 일궈낸 당신의 안식처를 한 줄기 빛으로 담아, 일상을 밝히는 고유한 굿즈를 완성하세요.', en: 'Capture your sanctuary built in Magic Shop as a beam of light to create unique goods that brighten your life.' },
    'shop.lightstick_digital': { ko: '디지털 굿즈', en: 'Digital Goods' },
    'shop.lightstick_watchface': { ko: '매직샵의 선율을 워치페이스로 간직하기', en: 'Keep Magic Shop\'s melody as a watch face' },
    'shop.lightstick_custom': { ko: '커스텀 응원봉(기억의 등불)', en: 'Custom Cheering Stick' },
    'shop.lightstick_custom_desc': { ko: '당신의 공간을 투영하는 빛의 매개체 · 홀로그램 프리뷰', en: 'A medium of light reflecting your space · Hologram preview' },
    'shop.lightstick_order_btn': { ko: '등불 제작하기', en: 'Craft Lantern' },
    'shop.lightstick_nft_btn': { ko: '영원한 기록(NFT) 발급', en: 'Get Eternal Record (NFT)' },
    'shop.lightstick_create_btn': { ko: '나의 등불, 지금 일깨우기 💜', en: 'Awaken My Lantern Now 💜' },

    // --- Magic Shop (CREATE · 음악 → 한글 건축) ---
    'magicshop.connector': { ko: '음악으로 일궈내는 영혼의 안식처 · 매직샵', en: 'A sanctuary for the soul built with music · Magic Shop' },
    'magicshop.input_title': { ko: '당신의 내면이 깃든 선율을 들려주세요', en: 'Share the melody imbued with your inner self' },
    'magicshop.input_desc': { ko: '무형의 소리가 유형의 안식처가 되는 순간. 당신의 영감이 깃든 이 공간은 마음이 쉬어가는 가장 안전한 매직샵입니다.', en: 'The moment intangible sound becomes a tangible sanctuary. This space infused with your inspiration is the safest Magic Shop for your heart.' },
    'magicshop.input_hint': { ko: '소리가 머무는 집을 지어드립니다. MIDI·PDF·악보·MP3를 올리거나 🎼 샘플을 사용하세요.', en: 'Build a house for sound. Upload MIDI, PDF, sheet music or MP3, or use the sample.' },
    'magicshop.dropzone': { ko: '선율의 기록을 여기에 놓거나 선택하세요', en: 'Drop or select your record of melody here' },
    'magicshop.start_btn': { ko: '안식처 건축 시작', en: 'Start Building Sanctuary' },
    'magicshop.display_idle': { ko: '텅 빈 우주에 당신의 주파수를 기다리는 오로라가 일렁입니다.', en: 'An aurora sways in the empty cosmos, waiting for your frequency.' },
    'magicshop.loading': { ko: '선율의 파동이 한글의 구조를 빌어 당신만의 안식처로 조립됩니다...', en: 'Melodic waves borrow Hangeul\'s structure to assemble into your unique sanctuary...' },

    // --- BORATIME (시계 디자인 · 팬심 소장) ---
    'boratime.badge': { ko: 'Chapter 3. Voyage', en: 'Chapter 3. Voyage' },
    'boratime.title': { ko: '인생의 나침반,<br>당신의 모든 순간을 기록하고 인도합니다', en: 'Compass of Life,<br>Recording and Guiding Your Every Moment' },
    'boratime.desc': { ko: '당신의 호흡과 맥박을 기억하는 영혼의 파트너. 잠든 순간부터 깨어있는 모든 시간까지, 당신이 길을 잃지 않도록 가장 나다운 리듬으로 미래를 안내합니다.', en: 'A soul partner that remembers your breath and pulse. From the moment you sleep to every waking hour, it guides your future with your most authentic rhythm so you never lose your way.' },
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
    'membership.free_f5': { ko: '전자책 1권 무료 제공', en: 'E-Book Vol.1 Free' },
    'membership.purple_f1': { ko: 'AI 스타일링 무제한', en: 'Unlimited AI Styling' },
    'membership.purple_f2': { ko: '커뮤니티 + 이벤트', en: 'Community + Events' },
    'membership.purple_f3': { ko: '굿즈 10% 할인', en: '10% Goods Discount' },
    'membership.purple_f4': { ko: '전자책 전권(1~4권) 제공', en: 'All E-Books (Vol.1-4)' },
    'membership.purple_f5': { ko: '1:1 코디 상담', en: '1:1 Style Consult' },
    'membership.vip_f1': { ko: 'AI 스타일링 무제한', en: 'Unlimited AI Styling' },
    'membership.vip_f2': { ko: '전자책 전권 + 독점 콘텐츠', en: 'All E-Books + Exclusive Content' },
    'membership.vip_f3': { ko: '굿즈 20% 할인', en: '20% Goods Discount' },
    'membership.vip_f4': { ko: '1:1 AI 코디 상담', en: '1:1 AI Style Consult' },
    'membership.vip_f5': { ko: '이벤트 우선 참여 + VIP 배지', en: 'Priority Events + VIP Badge' },
    'membership.btn_free': { ko: '무료로 시작', en: 'Start Free' },
    'membership.btn_purple': { ko: 'Purple 시작', en: 'Start Purple' },
    'membership.btn_vip': { ko: 'VIP 시작', en: 'Start VIP' },
    'membership.checkout_loading': { ko: '결제 페이지로 이동 중...', en: 'Redirecting to checkout...' },

    // --- E-Book (Borahae Library) ---
    'ebook.badge': { ko: 'Borahae Library', en: 'Borahae Library' },
    'ebook.title': { ko: 'AI, 인간의 마음을 그리다', en: 'AI, Drawing the Human Heart' },
    'ebook.desc': { ko: 'AI 기술과 인문학이 만나는 4권의 특별한 여정. 보라해 팬들을 위한 전자책 시리즈를 만나보세요.', en: 'A special 4-volume journey where AI meets the humanities. Discover the e-book series for Borahae fans.' },
    'ebook.summary_1': { ko: '소리가 색으로 보이는 공감각 소녀 소아베와 AI TEROS의 운명적 조우.', en: 'The fateful encounter between Soave, a synesthetic girl who sees sound as color, and AI TEROS.' },
    'ebook.summary_2': { ko: '차가운 지능(자음)과 따뜻한 숨결(모음)이 만나 완성되는 \'삶\'.', en: 'When cold intelligence (consonants) meets warm breath (vowels), \'Life\' is completed.' },
    'ebook.summary_3': { ko: '빛이 강할수록 짙어지는 그림자. 삭제된 감정들의 데이터를 마주하다.', en: 'The stronger the light, the darker the shadow. Confronting the data of deleted emotions.' },
    'ebook.summary_4': { ko: '인류와 AI가 함께 써 내려가는 진화의 마지막 챕터. 특이점을 열다.', en: 'The final chapter of evolution written by humanity and AI together. Opening the singularity.' },
    'ebook.download_pdf': { ko: 'PDF 다운로드', en: 'Download PDF' },
    'ebook.download_all': { ko: '전자책 전권 패키지 다운로드 (ZIP)', en: 'Download All E-Books (ZIP)' },

    // --- Oneclick Runway ---
    'oneclick.badge': { ko: '원클릭', en: 'One-Click' },
    'oneclick.title': { ko: '당신만의 런웨이 한 편', en: 'Your Own Runway Video' },
    'oneclick.desc': { ko: '샘플 얼굴과 배경을 선택하면 — 나만의 건축 배경 위를 걸어가는 런웨이를 만나볼 수 있어요.', en: 'Choose a sample face and background — walk your own runway on your custom backdrop.' },
    'oneclick.face_label': { ko: '샘플 얼굴 선택', en: 'Choose Sample Face' },
    'oneclick.face_hint': { ko: '런웨이에 쓸 얼굴을 골라 주세요.', en: 'Pick a face for your runway.' },
    'oneclick.face_female': { ko: '여자', en: 'Female' },
    'oneclick.face_male': { ko: '남자', en: 'Male' },
    'oneclick.photo_label': { ko: '내 사진 업로드', en: 'Upload My Photo' },
    'oneclick.photo_hint': { ko: '직접 올리면 샘플 대신 내 사진으로 런웨이를 만들 수 있어요. 인터넷 이미지 주소(URL)로도 불러올 수 있어요.', en: 'Upload your own photo for the runway, or paste an image URL.' },
    'oneclick.photo_placeholder': { ko: '본인 사진을 선택하세요!', en: 'Select your photo!' },
    'oneclick.photo_url_placeholder': { ko: '이미지 주소(URL) 붙여넣기', en: 'Paste image URL' },
    'oneclick.photo_url_btn': { ko: '불러오기', en: 'Load' },
    'oneclick.gallery_label': { ko: '뮤직비디오 대표 갤러리', en: 'Music Video Gallery' },
    'oneclick.background_desc': { ko: '배경을 선택하면 해당 배경 위의 런웨이 샘플을 만나볼 수 있어요.', en: 'Select a background to see a runway sample on it.' },
    'oneclick.runway_btn': { ko: '런웨이 한 편 만들기', en: 'Create Runway Video' },
    'oneclick.result_title': { ko: '런웨이 결과', en: 'Runway Result' },
    'oneclick.save_image_btn': { ko: '이미지 저장', en: 'Save Image' },
    'oneclick.email_btn': { ko: '📧 이메일로 보내기', en: '📧 Send by Email' },
    'oneclick.video_loading': { ko: '영상 생성 중입니다. 1~2분 정도 걸릴 수 있어요...', en: 'Generating video. May take 1–2 minutes...' },
    'oneclick.video_btn': { ko: '영상으로 만들기', en: 'Make Video' },
    'oneclick.save_video_btn': { ko: '영상 저장', en: 'Save Video' },
    'oneclick.notice': { ko: '아래에서 이름·생일·스타일링을 하나씩 체험해 보실 수도 있어요.', en: 'You can also try name, birthday, and styling step by step below.' },
    'oneclick.photo_from_url': { ko: 'URL에서 불러옴', en: 'Loaded from URL' },
    'oneclick.photo_selected': { ko: '선택됨: ', en: 'Selected: ' },
    'oneclick.url_required': { ko: '이미지 주소를 입력해 주세요.', en: 'Please enter an image URL.' },
    'oneclick.loading': { ko: '불러오는 중...', en: 'Loading...' },
    'oneclick.convert_failed': { ko: '이미지 변환에 실패했습니다.', en: 'Failed to convert image.' },
    'oneclick.url_load_failed': { ko: '인터넷 이미지를 불러오지 못했습니다. URL을 확인하거나 파일로 올려 주세요.', en: 'Could not load image from URL. Check the URL or upload a file.' },
    'oneclick.face_required': { ko: '샘플 얼굴(여자 또는 남자) 또는 내 사진을 선택해 주세요.', en: 'Please select a sample face (female or male) or upload your photo.' },
    'oneclick.background_required': { ko: '아래 갤러리에서 원하는 장소(배경)를 선택한 뒤 다시 시도해 주세요.', en: 'Please select a background from the gallery below and try again.' },
    'oneclick.runway_generating': { ko: '런웨이 생성 중...', en: 'Creating runway...' },
    'oneclick.synthesizing': { ko: '에 인물 합성 중...', en: ' — synthesizing...' },
    'oneclick.image_ready': { ko: '합성 이미지가 준비되었어요. 아래에서 영상으로 만들 수 있어요.', en: 'Composite image is ready. You can make a video below.' },
    'oneclick.error': { ko: '오류: ', en: 'Error: ' },
    'oneclick.video_need_image': { ko: '먼저 런웨이 결과 이미지를 생성한 뒤, 영상으로 만들기를 눌러 주세요.', en: 'Generate a runway result image first, then click Make Video.' },
    'oneclick.analyzing': { ko: '런웨이 결과 이미지를 분석해 영상 프롬프트를 만들고 있어요...', en: 'Analyzing runway image to create video prompt...' },
    'oneclick.fallback_prompt': { ko: '결과 이미지 분석을 사용할 수 없어 기본 프롬프트로 영상 생성 중입니다. 1~2분 걸릴 수 있어요.', en: 'Using default prompt for video. May take 1–2 minutes.' },
    'oneclick.video_generating': { ko: '런웨이 결과 이미지를 첫 프레임으로 영상 생성 중입니다...', en: 'Generating video from runway image...' },
    'oneclick.video_ready': { ko: '영상이 준비되었어요. 재생 버튼을 눌러 보세요.', en: 'Video is ready. Press play to watch.' },
    'oneclick.video_remake': { ko: '다시 만들기', en: 'Try Again' },
    'oneclick.video_failed': { ko: '영상 생성 실패: ', en: 'Video generation failed: ' },

    // --- Styling Modal (Steps 1-6) ---
    'styling.step1_label': { ko: '기본 정보', en: 'Basic Info' },
    'styling.step2_label': { ko: '신체 측정', en: 'Body' },
    'styling.step3_label': { ko: '스타일 DNA', en: 'Style DNA' },
    'styling.step4_label': { ko: '컬러 분석', en: 'Color' },
    'styling.step5_label': { ko: 'AI 분석', en: 'AI Analysis' },
    'styling.step6_label': { ko: 'Virtual Try-On', en: 'Virtual Try-On' },
    'styling.step1_title': { ko: '기본 정보를 알려주세요', en: 'Tell us about yourself' },
    'styling.step1_desc': { ko: '맞춤 스타일링을 위해 기본 정보가 필요해요', en: 'We need basic info for personalized styling' },
    'styling.gender': { ko: '성별', en: 'Gender' },
    'styling.female': { ko: '여성', en: 'Female' },
    'styling.female_short': { ko: '여자', en: 'Female' },
    'styling.male': { ko: '남성', en: 'Male' },
    'styling.male_short': { ko: '남자', en: 'Male' },
    'styling.age': { ko: '연령대', en: 'Age' },
    'styling.age_10s': { ko: '10대', en: 'Teens' },
    'styling.age_20s': { ko: '20대', en: '20s' },
    'styling.age_30s': { ko: '30대', en: '30s' },
    'styling.age_40s': { ko: '40대', en: '40s' },
    'styling.age_50s': { ko: '50대+', en: '50s+' },
    'styling.body': { ko: '체형 타입', en: 'Body Type' },
    'styling.body_slim': { ko: '슬림', en: 'Slim' },
    'styling.body_standard': { ko: '보통', en: 'Average' },
    'styling.body_muscular': { ko: '근육질', en: 'Muscular' },
    'styling.body_curvy': { ko: '볼륨', en: 'Curvy' },
    'styling.next': { ko: '다음 단계', en: 'Next' },
    'styling.prev': { ko: '이전', en: 'Back' },
    'styling.step2_title': { ko: '신체 정보를 입력해주세요', en: 'Enter your body info' },
    'styling.step2_desc': { ko: 'Virtual Try-On을 위해 사진과 체형 정보가 필요해요', en: 'We need a photo and measurements for Virtual Try-On' },
    'styling.face_upload': { ko: '얼굴 사진 업로드', en: 'Face Photo' },
    'styling.click_upload': { ko: '클릭하여 사진 업로드', en: 'Click to upload' },
    'styling.face_hint': { ko: '정면 상반신 사진을 권장합니다', en: 'Front-facing upper body photo recommended' },
    'styling.face_sample': { ko: '얼굴 샘플', en: 'Face Sample' },
    'styling.face_sample_hint': { ko: '아래에서 샘플 이미지를 선택할 수도 있어요 (image/human/face)', en: 'You can also select a sample image below' },
    'styling.height': { ko: '키 (cm)', en: 'Height (cm)' },
    'styling.weight': { ko: '몸무게 (kg)', en: 'Weight (kg)' },
    'styling.bmi_category': { ko: '체질량 지수', en: 'Body Mass Index' },
    'styling.bmi_desc': { ko: '키와 몸무게를 입력하면 BMI가 계산됩니다', en: 'BMI will be calculated when you enter height and weight' },
    'styling.step3_title': { ko: '60초 보라해 스타일 DNA', en: '60-Second Borahae Style DNA' },
    'styling.step3_desc': { ko: '이 중에서 더 끌리는 쪽을 골라주세요 (각 카드당 하나만 선택)', en: 'Pick the one that appeals to you more (one per card)' },
    'styling.dna_goal_label': { ko: '오늘 어떤 룩이 필요해요?', en: 'What look do you need today?' },
    'styling.dna_pick_label': { ko: '이 중에서 더 끌리는 쪽을 골라주세요', en: 'Pick the one that appeals to you more' },
    'styling.goal_concert': { ko: '🎤 콘서트·무대', en: '🎤 Concert·Stage' },
    'styling.goal_fanmeeting': { ko: '💜 팬미팅·매직샵', en: '💜 Fan Meeting·Magic Shop' },
    'styling.goal_daily': { ko: '☀️ 일상·데일리', en: '☀️ Daily' },
    'styling.goal_airport': { ko: '✈️ 공항·여행', en: '✈️ Airport·Travel' },
    'styling.goal_date': { ko: '💕 데이트·특별한 날', en: '💕 Date·Special Day' },
    'styling.goal_trend': { ko: '✨ 트렌드 체험', en: '✨ Trend Experience' },
    'styling.dna_c1a': { ko: '클린 & 핏', en: 'Clean & Fit' },
    'styling.dna_c1b': { ko: '릴렉스 & 루즈', en: 'Relaxed & Loose' },
    'styling.dna_c2a': { ko: '무대 포멀', en: 'Stage Formal' },
    'styling.dna_c2b': { ko: '캐주얼', en: 'Casual' },
    'styling.dna_c3a': { ko: '톤온톤', en: 'Tone-on-Tone' },
    'styling.dna_c3b': { ko: '하이컨트라스트', en: 'High Contrast' },
    'styling.dna_c4a': { ko: '스무스 & 클린', en: 'Smooth & Clean' },
    'styling.dna_c4b': { ko: '텍스처·레이어드', en: 'Texture·Layered' },
    'styling.dna_c5a': { ko: '울트라 미니멀', en: 'Ultra Minimal' },
    'styling.dna_c5b': { ko: '포인트 악센트', en: 'Point Accent' },
    'styling.dna_c6a': { ko: '쿨 뉴트럴', en: 'Cool Neutral' },
    'styling.dna_c6b': { ko: '웜 뉴트럴', en: 'Warm Neutral' },
    'styling.dna_unk': { ko: '잘 모르겠어요', en: 'Not sure' },
    'styling.dna_skip_btn': { ko: '✨ 생년월일로 AI가 추천해줄게요', en: '✨ Let AI recommend from my birthday' },
    'styling.dna_skip_hint': { ko: '선택이 어려우시면 생년월일을 입력한 뒤 이 버튼을 눌러주세요', en: 'If choosing is hard, enter your birthday first then click here' },
    'styling.dna_skip_no_soul': { ko: '생년월일을 먼저 입력해주세요. CREATE 섹션에서 소울 컬러를 확인한 뒤 이 버튼을 눌러주세요.', en: 'Please enter your birthday first. Check your Soul Color in the CREATE section, then click this button.' },
    'styling.dna_skip_need_soul_or_persona': { ko: '생년월일을 입력하거나, PLAY 섹션에서 28 캐릭터 중 마음에 드는 것을 선택해주세요.', en: 'Enter your birthday, or pick your favorite characters from the 28 in the PLAY section.' },
    'styling.step4_title': { ko: '퍼스널 컬러를 찾아볼까요?', en: 'Find your personal color?' },
    'styling.step4_desc': { ko: '피부톤과 어울리는 컬러를 분석해드려요', en: 'We analyze colors that suit your skin tone' },
    'styling.kbeauty_consent': { ko: '맞춤 K-뷰티 추천 및 제휴 링크 안내에 톤·스타일 분석 결과를 활용합니다.', en: 'We use tone and style analysis for K-beauty recommendations and affiliate links.' },
    'styling.kbeauty_agree': { ko: '동의합니다 (선택)', en: 'I agree (optional)' },
    'styling.kbeauty_desc': { ko: '비동의 시에도 분석은 이용 가능하며, 맞춤 제품 추천만 제한됩니다.', en: 'Analysis is available without consent; only product recommendations are limited.' },
    'styling.skin_tone': { ko: '피부톤', en: 'Skin Tone' },
    'styling.skin_tone_hint': { ko: '손등이나 턱선 부위 색상에 가까운 것을 선택해 주세요', en: 'Choose the shade closest to your hand or jawline' },
    'styling.skin_fair': { ko: '밝은 피부', en: 'Fair' },
    'styling.skin_light': { ko: '연한 피부', en: 'Light' },
    'styling.skin_medium': { ko: '중간 피부', en: 'Medium' },
    'styling.skin_tan': { ko: '구릿빛 피부', en: 'Tan' },
    'styling.undertone': { ko: '피부 언더톤', en: 'Undertone' },
    'styling.undertone_hint': { ko: '손목 안쪽 혈관 색이나 잘 어울리는 액세서리로 판단해 보세요', en: 'Check wrist vein color or which accessories suit you best' },
    'styling.undertone_warm': { ko: '웜톤', en: 'Warm' },
    'styling.undertone_warm_desc': { ko: '금색·골드 액세서리가 잘 어울려요', en: 'Gold accessories suit you well' },
    'styling.undertone_cool': { ko: '쿨톤', en: 'Cool' },
    'styling.undertone_cool_desc': { ko: '은색·실버 액세서리가 잘 어울려요', en: 'Silver accessories suit you well' },
    'styling.undertone_neutral': { ko: '뉴트럴', en: 'Neutral' },
    'styling.undertone_neutral_desc': { ko: '금·은 모두 잘 어울려요', en: 'Both gold and silver suit you well' },
    'styling.ai_start': { ko: 'AI 분석 시작', en: 'Start AI Analysis' },
    'styling.loading_title': { ko: 'AI가 당신의 스타일을 분석하고 있어요', en: 'AI is analyzing your style' },
    'styling.loading_1': { ko: '데이터 수집 중...', en: 'Collecting data...' },
    'styling.loading_2': { ko: '체형 분석 중...', en: 'Analyzing body...' },
    'styling.loading_2_soul': { ko: '소울 컬러 DNA 이식 중...', en: 'Applying soul color DNA...' },
    'styling.loading_3': { ko: '퍼스널 컬러 분석 중...', en: 'Analyzing personal color...' },
    'styling.loading_4': { ko: '스타일 매칭 중...', en: 'Matching styles...' },
    'styling.loading_5': { ko: '추천 생성 중...', en: 'Generating recommendations...' },
    'styling.result_badge': { ko: 'AI 분석 완료', en: 'AI Analysis Complete' },
    'styling.result_title': { ko: '당신만의 스타일 프로필', en: 'Your Style Profile' },
    'styling.personal_color': { ko: '퍼스널 컬러', en: 'Personal Color' },
    'styling.recommended_style': { ko: '추천 스타일', en: 'Recommended Style' },
    'styling.style_fingerprint': { ko: '스타일 지문', en: 'Style Fingerprint' },
    'styling.radar_title': { ko: '나의 보라해 스타일 DNA', en: 'My BORAHAE Style DNA' },
    'styling.radar_subtitle': { ko: '8가지 스타일 축', en: '8 Style Axes' },
    'styling.radar_scale': { ko: '왼쪽 극 • 중립(0) • 오른쪽 극', en: 'Left pole • Neutral(0) • Right pole' },
    'styling.bipolar_title': { ko: '스타일 축의 의미', en: 'What each axis means' },
    'styling.radar_axis_formality': { ko: '무대감', en: 'Stage' },
    'styling.radar_axis_silhouette': { ko: '핏감', en: 'Fit' },
    'styling.radar_axis_contrast': { ko: '대비', en: 'Contrast' },
    'styling.radar_axis_texture': { ko: '소재감', en: 'Texture' },
    'styling.radar_axis_detail': { ko: '디테일', en: 'Detail' },
    'styling.radar_axis_colorTemp': { ko: '컬러톤', en: 'Color' },
    'styling.radar_axis_comfort': { ko: '우선순위', en: 'Priority' },
    'styling.radar_axis_risk': { ko: '도전도', en: 'Risk' },
    'styling.fp_summary_title': { ko: '나의 스타일 한 줄', en: 'My style in one line' },
    'styling.fp_confidence_title': { ko: '축별 신뢰도', en: 'Confidence per axis' },
    'styling.fp_cta_title': { ko: '이 프로필이 맞나요?', en: 'Does this profile fit you?' },
    'styling.fp_cta_yes': { ko: '맞아요 💜', en: 'Yes 💜' },
    'styling.fp_cta_edit': { ko: '수정할게요', en: 'Edit' },
    'styling.fp_cta_refine': { ko: '다음에 더 맞춰줘요', en: 'Refine next time' },
    'styling.fp_soul_title': { ko: '나만의 탄생 컬러', en: 'My Birth Color' },
    'styling.fp_toast_yes': { ko: '프로필이 저장됐어요. 다음 추천이 더 맞춰질 거예요 💜', en: 'Profile saved. Next recommendations will fit you better 💜' },
    'styling.fp_toast_refine': { ko: '다음 추천에서 테스트 룩으로 더 맞춰볼게요 💜', en: 'We\'ll refine with a test look in the next recommendation 💜' },
    'styling.coordi_recommend': { ko: '코디 추천', en: 'Outfit Recommendations' },
    'styling.styling_tips': { ko: '스타일링 팁', en: 'Styling Tips' },
    'styling.ai_fashion_image': { ko: 'AI 패션 이미지', en: 'AI Fashion Image' },
    'styling.fashion_placeholder': { ko: 'AI 분석 완료 후 패션 이미지가 생성됩니다', en: 'Fashion image will be generated after AI analysis' },
    'styling.generate_fashion': { ko: '패션 이미지 생성', en: 'Generate Fashion Image' },
    'styling.taste_like': { ko: '이 코디 마음에 들어요', en: 'I like this outfit' },
    'styling.naver_shop': { ko: '네이버 쇼핑', en: 'Naver Shopping' },
    'styling.save_result': { ko: '결과 저장하기', en: 'Save Result' },
    'styling.retry_analysis': { ko: '다시 분석하기', en: 'Analyze Again' },

    // --- Virtual Try-On (Step 6) ---
    'tryon.title': { ko: 'Virtual Try-On', en: 'Virtual Try-On' },
    'tryon.desc': { ko: '원하는 의류를 선택하여 가상으로 착용해보세요', en: 'Select clothing and try it on virtually' },
    'tryon.cat_fashion': { ko: '패션', en: 'Fashion' },
    'tryon.cat_tops': { ko: '상의', en: 'Tops' },
    'tryon.cat_bottoms': { ko: '하의', en: 'Bottoms' },
    'tryon.cat_dresses': { ko: '원피스', en: 'Dresses' },
    'tryon.cat_outerwear': { ko: '아우터', en: 'Outerwear' },
    'tryon.upload_btn': { ko: '내 의류 업로드', en: 'Upload My Clothes' },
    'tryon.original': { ko: '원본 사진', en: 'Original Photo' },
    'tryon.original_placeholder': { ko: '사진이 표시됩니다', en: 'Photo will appear' },
    'tryon.result': { ko: 'Try-On 결과', en: 'Try-On Result' },
    'tryon.select_garment': { ko: '의류를 선택하세요', en: 'Select clothing' },
    'tryon.generate_btn': { ko: 'Try-On 생성', en: 'Generate Try-On' },
    'tryon.download_btn': { ko: '다운로드', en: 'Download' },
    'tryon.shop_btn': { ko: '선택한 옷 쇼핑하기', en: 'Shop this outfit' },
    'tryon.prev': { ko: '이전', en: 'Back' },
    'tryon.finish': { ko: '완료', en: 'Done' },
    'tryon.outfit_finder_title': { ko: '연예인/아이돌 착장으로 유사 옷 찾기', en: 'Find similar clothes from celebrity outfit' },
    'tryon.outfit_finder_desc': { ko: '착장 사진 1장을 올리면 AI가 비슷한 옷 검색어로 정리해드려요', en: 'Upload one outfit photo and AI will organize similar clothing search terms' },
    'tryon.outfit_upload': { ko: '착장 사진을 올려주세요', en: 'Upload outfit photo' },
    'tryon.outfit_hint': { ko: '무대·직캠·공항룩 캡처도 OK (최대 5MB)', en: 'Stage, fancam, airport look OK (max 5MB)' },
    'tryon.outfit_url_placeholder': { ko: '이미지 URL을 붙여넣으세요', en: 'Paste image URL here' },
    'tryon.outfit_load_url': { ko: '불러오기', en: 'Load' },
    'tryon.tryon_section': { ko: '가상 피팅', en: 'Virtual Fitting' },

    // --- Video Toast ---
    'video_toast.aria': { ko: '영상 생성 중', en: 'Generating video' },
    'video_toast.text': { ko: '영상 생성 중입니다. 1~2분 소요. 완료되면 알려드려요.', en: 'Generating video. 1–2 min. We\'ll notify you when done.' },

    // --- Detail Corners Intro ---
    'detail_corners.intro_html': { ko: '하나씩 만들어 가는 재미를 위해 <strong>아래에 구체적인 코너</strong>가 있습니다.', en: 'For step-by-step fun, <strong>specific corners</strong> are below.' },
    'detail_corners.intro_link': { ko: '아래 코너로 이동 ↓', en: 'Go to corners below ↓' },

    // --- Lightstick Designer ---
    'lightstick.badge': { ko: 'Chapter 2. Sanctuary', en: 'Chapter 2. Sanctuary' },
    'lightstick.title': { ko: '당신의 선율은 단단한 안식처가 되고, 당신의 심장 박동은 내일의 이정표가 됩니다 💜', en: 'Your melody becomes a sanctuary, and your heartbeat becomes tomorrow\'s compass 💜' },
    'lightstick.desc': { ko: '무형의 선율이 유형의 안식처가 되는 순간. 당신의 영감이 깃든 이 공간은 마음이 쉬어가는 가장 안전한 매직샵입니다.', en: 'The moment intangible melody becomes a tangible sanctuary. This space infused with your inspiration is the safest Magic Shop for your heart.' },
    'lightstick.step1_label': { ko: 'STEP 1', en: 'STEP 1' },
    'lightstick.step1_html': { ko: '응원봉(기억의 등불) 속에<br><strong>당신의 진심</strong>을 각인하다', en: 'Engrave <strong>your sincere heart</strong><br>on your cheering stick' },
    'lightstick.step2_label': { ko: 'STEP 2', en: 'STEP 2' },
    'lightstick.step2_html': { ko: '마음을 비추는<br><strong>보라빛 7컬러</strong> 선택', en: 'Choose from<br><strong>7 purple-inspired colors</strong>' },
    'lightstick.step3_label': { ko: 'STEP 3', en: 'STEP 3' },
    'lightstick.step3_html': { ko: 'AI가 당신의 주파수를 빚어 만든<br><strong>고유한 등불</strong>의 탄생', en: 'AI crafts<br><strong>your unique lantern</strong>' },
    'lightstick.step4_label': { ko: 'STEP 4', en: 'STEP 4' },
    'lightstick.step4_html': { ko: '함께 나누는<br><strong>보라빛 응원</strong>', en: 'Share your<br><strong>purple support</strong>' },
    'lightstick.btn_start': { ko: '나의 등불, 지금 일깨우기 💜', en: 'Awaken My Lantern Now 💜' },
    'lightstick.plan_info': { ko: 'Free: 월 1회 | Purple: 월 10회 | VIP: 무제한 생성', en: 'Free: 1/month | Purple: 10/month | VIP: Unlimited' },
    'lightstick.modal_step1_title': { ko: '✍️ 등불에 새길 당신의 서명', en: '✍️ Signature on Your Lantern' },
    'lightstick.modal_step1_desc': { ko: '소중한 마음을 담아, 응원봉(기억의 등불)에 새길 이름이나 서명을 입력하세요', en: 'With all your heart, enter the name or signature to engrave on your cheering stick' },
    'lightstick.modal_step1_placeholder': { ko: '예: 지영, 보라해♡, 영원한 약속', en: 'e.g. Jiyoung, Borahae♡, Eternal Promise' },
    'lightstick.modal_step1_max': { ko: '최대 20자', en: 'Max 20 characters' },
    'lightstick.modal_step1_next': { ko: '다음: 빛의 색채 선택 →', en: 'Next: Choose Light Color →' },
    'lightstick.modal_step2_title': { ko: '🎨 마음을 비추는 색채', en: '🎨 Color That Reflects Your Heart' },
    'lightstick.modal_step2_desc': { ko: '당신의 마음을 가장 잘 표현하는 보라빛 주파수를 선택하세요', en: 'Choose the purple-inspired frequency that best expresses your heart' },
    'lightstick.modal_step2_prev': { ko: '← 이전', en: '← Back' },
    'lightstick.modal_step2_next': { ko: '다음: 등불 디자인 →', en: 'Next: Lantern Design →' },
    'lightstick.modal_step3_title': { ko: '🤖 응원봉(기억의 등불) 디자인', en: '🤖 Cheering Stick Design' },
    'lightstick.modal_step3_desc': { ko: '어떤 형상으로 진심을 전하고 싶나요? 당신의 영감과 아이디어를 자유롭게 담아주세요', en: 'In what form do you want to convey your sincerity? Freely add your inspiration and ideas' },
    'lightstick.modal_step3_shape': { ko: '🔷 등불의 형상 선택', en: '🔷 Choose Lantern Shape' },
    'lightstick.modal_step3_theme': { ko: '💡 테마 · 분위기 선택 (복수 가능)', en: '💡 Choose Theme & Mood (multiple OK)' },
    'lightstick.modal_step3_free': { ko: '✏️ 나만의 빛의 서사', en: '✏️ Your Narrative of Light' },
    'lightstick.modal_step3_placeholder': { ko: '은하수가 흐르는 투명한 등불, 나비 날개 장식, 보라빛 별빛이 감도는 크리스탈...', en: 'A transparent lantern with flowing galaxy, butterfly wing decorations, purple starlight crystal...' },
    'lightstick.modal_step3_summary_title': { ko: '📋 나의 등불 설계 요약', en: '📋 My Lantern Design Summary' },
    'lightstick.modal_step3_prev': { ko: '← 이전', en: '← Back' },
    'lightstick.modal_step3_generate': { ko: '💜 당신의 빛을 일깨우기', en: '💜 Awaken Your Light' },
    'lightstick.modal_step4_title': { ko: '🎉 당신의 진심이 담긴 보라빛 등불이 깨어났습니다!', en: '🎉 Your Purple Lantern is Ready!' },
    'lightstick.modal_step4_subtitle': { ko: '당신의 사랑과 응원이 선명하게 빛나는, 세상에 단 하나뿐인 등불입니다', en: 'A one-of-a-kind lantern shining clearly with your love and support' },
    'lightstick.modal_step4_download': { ko: '💾 빛을 간직하기', en: '💾 Save the Light' },
    'lightstick.modal_step4_share': { ko: '📤 세상과 빛 나누기', en: '📤 Share Your Light with the World' },
    'lightstick.modal_step4_retry': { ko: '🔄 다시 일깨우기', en: '🔄 Try Again' },
    'lightstick.modal_step4_community_desc': { ko: '일깨운 등불을 저장한 후, 같은 마음의 동반자들과 함께 나누세요.', en: 'Save your awakened lantern and share it with fellow companions of the same heart.' },
    'lightstick.loading': { ko: '💜 당신의 진심을 담아 빛의 형상을 빚고 있어요...', en: '💜 Crafting the form of light with all your heart...' },
    'lightstick.loading_sub': { ko: '보라빛 마법이 당신의 공간을 밝힐 준비를 하고 있습니다.', en: 'The purple magic is preparing to brighten your space.' },
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
    'arch.sample_desc': { ko: '에드워드 엘가 곡을 한글 공감각 건축 메뉴얼에 따라 영원한 안식처의 도면으로 시각화합니다.', en: 'Visualize Edward Elgar\'s piece as a blueprint for an eternal sanctuary based on Hangeul Synesthetic Architecture.' },
    'arch.sample_btn': { ko: '안식처 건축 체험', en: 'Try Sanctuary Architecture' },
    'arch.sample_video_btn': { ko: '안식처 속으로의 여정', en: 'Journey into the Sanctuary' },
    'arch.video_btn_hint': { ko: '안식처가 형상화된 후 여정을 시작할 수 있습니다.', en: 'You can begin the journey after the sanctuary is manifested.' },
    'arch.video_btn_ready': { ko: '안식처 속으로의 여정을 시작할 준비가 되었습니다.', en: 'Ready to begin the journey into the sanctuary.' },
    'arch.coming_soon_title': { ko: '새로운 세계를 짓는 중입니다', en: 'Building a New World' },
    'arch.coming_soon_desc': { ko: '더 깊은 자아의 안식처를 구축하기 위해 Google의 프로젝트 지니(Genie)와 함께 무한한 세계를 준비 중입니다. 잠시만 기다려 주세요.', en: 'We are preparing infinite worlds with Google\'s Project Genie to build a deeper sanctuary of self. Please wait a moment.' },
    'arch.coming_soon_confirm': { ko: '기다림의 시작', en: 'Begin Waiting' },
    'arch.genie_guide_title': { ko: '지니(Genie)로 건축물 내부 탐험하기', en: 'Explore Inside the Building with Genie' },
    'arch.genie_guide_desc': { ko: '아래 프롬프트를 지니(Genie)에 입력하면, 당신이 만든 최종 건축물 이미지를 기반으로 건축물 안을 자유롭게 돌아다니며 내부 공간을 자세히 볼 수 있습니다.', en: 'Use the prompt below in Genie to freely explore the interior of your final building and see every space in detail.' },
    'arch.genie_guide_prompt_label': { ko: '지니 3.0에 넣을 프롬프트 (복사 후 사용)', en: 'Prompt for Genie 3.0 (copy and use)' },
    'arch.genie_guide_copy': { ko: '프롬프트 복사', en: 'Copy prompt' },
    'arch.genie_guide_copied': { ko: '복사되었어요!', en: 'Copied!' },
    'arch.genie_guide_go': { ko: '지니에서 체험하기', en: 'Try in Genie' },
    'arch.genie_guide_no_image': { ko: '먼저 매직샵에서 3. 최종 건축 디자인을 생성하면, 여기에 이미지가 표시됩니다. 해당 이미지를 지니에 넣고 아래 프롬프트를 사용하세요.', en: 'Generate "3. Final building design" in Magic Shop first; the image will appear here. Then use it in Genie with the prompt below.' },
    'arch.genie_prompt_text': { ko: '이 건축물 이미지를 입력으로 사용해 주세요. 건축물 안을 자유롭게 돌아다니며 복도, 홀, 각 실의 내부 공간을 자세히 모두 볼 수 있도록 인터랙티브하게 체험할 수 있게 해 주세요.', en: 'Use this building image as input. Let me freely explore inside the building and see every corridor, hall, and room in detail in an interactive experience.' },
    'arch.genie_caption': { ko: '당신만의 세계를 창조하세요', en: 'Create your own worlds' },
    'arch.genie_desc': { ko: '한글 건축 체험은 Google의 실험적 프로젝트 지니(Genie)와 함께 무한히 다양한 세계를 창조하고 탐험합니다.', en: 'Hangeul architecture experience is powered by Google\'s experimental Project Genie — create and explore infinitely diverse worlds.' },
    'arch.modal_title': { ko: '사랑의 인사 (Salut d\'Amour), Op.12', en: 'Salut d\'Amour, Op.12' },
    'arch.modal_piece_title': { ko: '영혼의 선율', en: 'Melody of the Soul' },
    'arch.modal_subtitle': { ko: '선율이 빚어낸 안식처의 그리드', en: 'Grid of the sanctuary crafted by melody' },
    'arch.nano_loading': { ko: 'OpenAI가 당신의 선율을 해석하여 안식처의 기둥을 세우고 있습니다...', en: 'OpenAI is interpreting your melody to raise the pillars of your sanctuary...' },
    'arch.nano_loading_sub': { ko: '구조·멜로디·반주 요소가 하나의 고유한 건축적 서사로 변환됩니다.', en: 'Structure, melody, and accompaniment elements are transformed into a unique architectural narrative.' },
    'arch.nano_loading_video': { ko: '안식처 속으로의 여정 영상을 생성 중입니다...', en: 'Generating the journey video into the sanctuary...' },
    'arch.nano_loading_image_first': { ko: '1단계: 선율의 도면을 그려내고 있습니다...', en: 'Step 1: Drawing the blueprint of the melody...' },
    'arch.modal_save_hint': { ko: '이 공간을 간직하려면 저장 버튼을 눌러주세요.', en: 'To keep this space, please press the save button.' },
    'arch.download_video_btn': { ko: '💾 여정 저장', en: '💾 Save Journey' },
    'arch.modal_result_title': { ko: '당신의 선율로 완성된 안식처', en: 'Sanctuary completed with your melody' },
    'arch.modal_result_subtitle': { ko: '한글 공감각 건축 시스템 표준 설계 메뉴얼 기반', en: 'Based on Hangeul Synesthetic Architecture System Standard Manual' },
    'arch.show_grid': { ko: '📋 선율의 그리드 보기', en: '📋 View Melody Grid' },
    'arch.error_title': { ko: '안식처 형상화에 실패했습니다', en: 'Sanctuary manifestation failed' },
    'arch.video_error_title': { ko: '여정 영상 생성에 실패했습니다', en: 'Journey video generation failed' },
    'arch.error_veo_hint': { ko: '영상 생성에는 특별한 주파수가 필요합니다. (API 설정 확인 필요)', en: 'Video generation requires a special frequency. (Check API settings)' },
    'arch.error_no_api_key': { ko: '영감의 연결 고리(API 키)가 설정되지 않았습니다. 관리자에게 문의하세요.', en: 'The connection of inspiration (API key) is not set. Please contact the administrator.' },
    'arch.build_title': { ko: '🎵 선율을 봉인하면 영원한 안식처가 됩니다', en: '🎵 Seal the melody into an eternal sanctuary' },
    'arch.build_desc': { ko: '영감의 원천(음악 또는 악보)을 선택하고 생성 버튼을 누르면, 무형의 소리가 유형의 안식처로 형상화됩니다.', en: 'Select your source of inspiration and press generate to manifest intangible sound into a tangible sanctuary.' },
    'arch.use_sample': { ko: '고전의 선율 사용 (사랑의 인사)', en: 'Use Classic Melody (Salut d\'Amour)' },
    'arch.use_sample_short': { ko: '샘플악보(사랑의인사)', en: 'Sample (Salut d\'Amour)' },
    'arch.sample_applied_dropzone': { ko: '✓ 샘플악보(사랑의 인사)가 적용되었습니다.', en: '✓ Sample sheet (Salut d\'Amour) applied.' },
    'arch.upload_midi': { ko: '나만의 선율(MIDI) 업로드', en: 'Upload My Melody (MIDI)' },
    'arch.upload_midi_pdf': { ko: '음악의 기록(MIDI/PDF/악보/MP3) 업로드', en: 'Upload Music (MIDI/PDF/Sheet/MP3)' },
    'arch.generate_btn': { ko: '🏛️ 안식처 형상화', en: '🏛️ Manifest Sanctuary' },
    'arch.generating': { ko: '당신의 안식처를 보라빛 세계에 짓고 있습니다...', en: 'Building your sanctuary in the purple world...' },
    'arch.result_title': { ko: '형상화된 안식처', en: 'Manifested Sanctuary' },
    'arch.step1_jamo_grid': { ko: '1. 한글의 구조적 그리드', en: '1. Structural Grid of Hangeul' },
    'arch.result_grid_desc': { ko: '선율이 자모로 치환된 구조적 그리드', en: 'Structural grid where melody is replaced by jamo' },
    'arch.step2_concept_title': { ko: '2. 건축적 컨셉 디자인', en: '2. Architectural Concept Design' },
    'arch.step3_final_title': { ko: '3. 최종적 안식처 디자인', en: '3. Final Sanctuary Design' },
    'arch.step4_video_title': { ko: '5. 여정의 기록', en: '5. Record of Journey' },
    'arch.download_grid': { ko: '💾 도면 저장', en: '💾 Save Blueprint' },
    'arch.result_building_title': { ko: '4. 안식처의 자취', en: '4. Traces of Sanctuary' },
    'arch.concept_design_title': { ko: '3. 영감의 디자인', en: '3. Design of Inspiration' },
    'arch.concept_design_desc': { ko: '건축적 서사를 담은 프레젠테이션 보드', en: 'Presentation board with architectural narratives' },
    'arch.concept_loading': { ko: '영감의 디자인을 형상화하고 있습니다...', en: 'Manifesting the design of inspiration...' },
    'arch.final_building_title': { ko: '5. 완성된 영혼의 안식처', en: '5. Completed Soul Sanctuary' },
    'arch.final_building_desc': { ko: '당신의 선율이 도달한 최종적인 안식처입니다.', en: 'The final sanctuary reached by your melody.' },
    'arch.final_loading': { ko: '최종적인 안식처를 완성하고 있습니다...', en: 'Completing the final sanctuary...' },
    'arch.result_building_desc': { ko: 'OpenAI가 당신의 주파수를 영원한 안식처로 빚어냅니다', en: 'OpenAI crafts your frequency into an eternal sanctuary' },
    'arch.nano_building_loading': { ko: '공간의 형상을 빚어내고 있습니다...', en: 'Crafting the shape of the space...' },
    'arch.error_no_api_key_short': { ko: '연결 고리가 설정되어야 안식처를 지을 수 있습니다.', en: 'The connection must be set to build the sanctuary.' },
    'arch.download_btn': { ko: '💾 공간 간직하기', en: '💾 Keep Space' },
    'arch.video_from_image_btn': { ko: '🎬 공간 속으로의 여정 시작', en: '🎬 Start Journey into Space' },
    'arch.auto_video_hint': { ko: '안식처 완성 후 자동으로 여정 영상이 생성됩니다.', en: 'Journey video is created automatically after the sanctuary is completed.' },
    'arch.video_retry_btn': { ko: '🎬 여정 다시 시작', en: '🎬 Restart Journey' },
    'arch.video_view_btn': { ko: '🎬 여정 영상 보기', en: '🎬 View Journey Video' },
    'arch.video_generate_btn': { ko: '동영상 생성', en: 'Generate Video' },
    'arch.video_need_final_image': { ko: '최종 디자인이 완성된 후 여정을 시작할 수 있습니다.', en: 'The journey can begin after the final design is completed.' },
    'arch.generate_again': { ko: '🔄 다시 일깨우기', en: '🔄 Awaken Again' },
    'arch.status_sample': { ko: '고전의 선율(사랑의 인사)이 선택되었습니다.', en: 'Classic melody (Salut d\'Amour) selected.' },
    'arch.status_uploaded': { ko: '당신의 선율이 봉인되었습니다.', en: 'Your melody has been sealed.' },
    'arch.status_uploaded_pdf': { ko: '선율의 기록이 전달되었습니다.', en: 'Music record has been delivered.' },
    'arch.status_uploaded_image': { ko: '악보의 형상이 인식되었습니다.', en: 'Sheet music image recognized.' },
    'arch.status_uploaded_mp3': { ko: '음원이 전달되었습니다.', en: 'Audio file delivered.' },
    'arch.file_selected': { ko: '✓ 인식된 기록: ', en: '✓ Recognized record: ' },
    'arch.hangeul_gallery_title': { ko: '한글 공감각 건축 갤러리', en: 'Hangeul Synesthetic Architecture Gallery' },

    // --- Footer extra ---
    'footer.ai_styling_link': { ko: 'AI 스타일링', en: 'AI Styling' },
    'footer.shop_link': { ko: '보라해 굿즈샵', en: 'Borahae Shop' },
    'footer.membership_link': { ko: '멤버십', en: 'Membership' },

    // --- Lookbook (연예인 룩 + 유사 검색) ---
    'lookbook.badge': { ko: 'Lookbook', en: 'Lookbook' },
    'lookbook.title': { ko: '연예인 룩', en: 'Celebrity Look' },
    'lookbook.desc': { ko: '연예인·아이돌 룩 사진을 올리면 AI가 비슷한 옷 검색어로 정리해드려요', en: 'Upload a celebrity or idol look — AI suggests similar item search keywords' },
    'lookbook.celeblook_upload': { ko: '연예인 룩 사진을 올려주세요', en: 'Upload a celebrity look photo' },
    'lookbook.celeblook_hint': { ko: '무대·직캠·공항룩 캡처도 OK', en: 'Stage, fancam, or airport look screenshots OK' },
    'lookbook.celeblook_mood_label': { ko: '이 룩의 무드 (선택)', en: 'Mood of this look (optional)' },
    'lookbook.mood_concert': { ko: '콘서트 무대', en: 'Concert stage' },
    'lookbook.mood_airport': { ko: '공항·여행', en: 'Airport · travel' },
    'lookbook.mood_daily': { ko: '일상·데일리', en: 'Daily · casual' },
    'lookbook.mood_fanmeeting': { ko: '팬미팅', en: 'Fan meeting' },
    'lookbook.mood_studio': { ko: '스튜디오·촬영', en: 'Studio · shoot' },
    'lookbook.celeblook_summary_title': { ko: '분석 결과 요약', en: 'Analysis summary' },
    'lookbook.celeblook_style_tags': { ko: '스타일 태그', en: 'Style tags' },
    'lookbook.celeblook_copy_all': { ko: '전체 복사', en: 'Copy all' },
    'lookbook.celeblook_copy_toast': { ko: '복사됐어요 💜', en: 'Copied 💜' },
    'lookbook.celeblook_disclaimer1': { ko: '링크는 검색 결과로 이동해요. 동일 제품이 아닐 수 있어요.', en: 'Links go to search results. Items may not be identical.' },
    'lookbook.celeblook_disclaimer2': { ko: '브랜드/정확한 모델명은 확실한 경우에만 표시해요. 일부 정보는 추정입니다.', en: 'Brand/exact model names shown only when confirmed. Some info is estimated.' },
    'lookbook.celeblook_analyzing': { ko: '룩을 분석하고 있어요...', en: 'Analyzing the look...' },
    'lookbook.celeblook_retry': { ko: '다른 사진으로 다시', en: 'Try another photo' },
    'lookbook.celeblook_privacy': { ko: '이미지는 저장하지 않아요. 결과(검색어)만 표시돼요.', en: 'We do not store images. Only search keywords are shown.' },
    'lookbook.search_naver': { ko: '네이버 쇼핑', en: 'Naver Shopping' },
    'lookbook.search_naver_btn': { ko: '네이버쇼핑으로 검색', en: 'Search on Naver Shopping' },
    'lookbook.search_musinsa': { ko: '무신사', en: 'Musinsa' },
    'lookbook.search_musinsa_prep': { ko: '무신사 (서비스 준비중)', en: 'Musinsa (Coming soon)' },
    'lookbook.search_coupang': { ko: '쿠팡', en: 'Coupang' },
    'lookbook.search_keywords': { ko: '검색어', en: 'Search keywords' },
    'lookbook.detail_view': { ko: '상세 보기', en: 'View details' },
    'lookbook.re_search': { ko: '재검색', en: 'Re-search' },
    'lookbook.recommended_products': { ko: '추천 상품', en: 'Recommended products' },
    'lookbook.no_products': { ko: '추천 상품이 없어요', en: 'No recommended products' },
    'lookbook.go_to_search': { ko: '검색 결과 보기', en: 'View search results' },
    'lookbook.go_to_link': { ko: '바로가기', en: 'Go to' },
    'lookbook.products_count': { ko: '개', en: ' items' },
    'lookbook.signature_label': { ko: '참고용 시그니처 룩', en: 'Signature looks (reference)' },
    'lookbook.concert': { ko: '보라빛 콘서트 룩', en: 'Purple Concert Look' },
    'lookbook.concert_desc': { ko: '무대 위 조명 아래 가장 나답게 빛나는 보라빛 스타일', en: 'A purple style that shines brightest on you under stage lights' },
    'lookbook.fanmeeting': { ko: '매직샵 팬미팅 스타일', en: 'Magic Shop Fan Meeting' },
    'lookbook.daily': { ko: '일상 속 보라해', en: 'Everyday Borahae' },
    'lookbook.casual': { ko: '시그니처 아미 스타일', en: 'Signature ARMY Style' },
    'lookbook.purple': { ko: '일곱 개의 달 감성', en: 'Seven Moons Aesthetic' },
    'lookbook.airport': { ko: '아이돌 공항 패션', en: 'Idol Airport Style' },
    'lookbook.backstage': { ko: '백스테이지 스타일', en: 'Backstage Style' },
    'lookbook.street': { ko: '스트릿 보라해', en: 'Street Borahae' },

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
    'about.badge': { ko: 'BORAHAE ETHOS', en: 'BORAHAE ETHOS' },
    'about.title': { ko: '보라해, 당신의 고유한 리듬을 지키는 약속', en: 'BORAHAE, The Promise that Protects Your Unique Rhythm' },
    'about.desc': {
      ko: '단순한 플랫폼을 넘어, 당신의 고유한 존재를 증명하고 내면의 세계를 건축하며, 삶의 올바른 방향을 함께 찾아가는 동반자가 되겠습니다. 끝까지 믿고 사랑하는 \'보라해(I Purple You)\'의 진심을 미래 기술에 담았습니다.',
      en: 'Beyond a simple platform, we strive to be a companion that validates your unique existence, builds your inner world, and navigates your life path together. We have infused the heart of \'Borahae (I Purple You)\'—to love and trust until the end—into future technology.'
    },
    'about.tech_title': { ko: '자아의 발견 (Discovery)', en: 'Discovery of Self' },
    'about.tech_desc': { ko: '이름과 컬러 속에 숨겨진 고유 주파수 탐색', en: 'Exploring unique frequencies hidden in names and colors' },
    'about.realtime_title': { ko: '마음의 안식처 (Sanctuary)', en: 'Sanctuary for the Soul' },
    'about.realtime_desc': { ko: '영감이 머무는 나만의 매직샵 건축', en: 'Building a personal Magic Shop where inspiration stays' },
    'about.users_title': { ko: '인생의 항해 (Voyage)', en: 'Voyage of Life' },
    'about.users_desc': { ko: '삶의 방향을 비추는 보라빛 나침반', en: 'A purple compass illuminating the path of life' },

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
    'auth.or': { ko: '또는', en: 'Or' },
    'auth.login_google': { ko: 'Google로 로그인', en: 'Sign in with Google' },
    'auth.forgot_password': { ko: '비밀번호 찾기', en: 'Forgot Password' },
    'auth.forgot_desc': { ko: '가입한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.', en: 'Enter your email address and we\'ll send you a link to reset your password.' },
    'auth.forgot_send': { ko: '재설정 링크 보내기', en: 'Send Reset Link' },
    'auth.back_login': { ko: '← 로그인으로 돌아가기', en: '← Back to Login' },
    'auth.new_password': { ko: '새 비밀번호', en: 'New Password' },
    'auth.reset_desc': { ko: '새 비밀번호를 입력해 주세요.', en: 'Enter your new password.' },
    'auth.reset_btn': { ko: '비밀번호 변경', en: 'Change Password' },

    // --- 마이페이지 ---
    'nav.mypage': { ko: '마이페이지', en: 'My Page' },
    'mypage.title': { ko: '마이페이지', en: 'My Page' },
    'mypage.subtitle': { ko: '내 정보를 관리하세요', en: 'Manage your account' },
    'mypage.info_title': { ko: '내 정보', en: 'My Info' },
    'mypage.joined': { ko: '가입일', en: 'Joined' },
    'mypage.password_title': { ko: '비밀번호 재설정', en: 'Change Password' },
    'mypage.password_hint': { ko: 'Google 로그인 사용자는 비밀번호가 없습니다.', en: 'Google sign-in users do not have a password.' },
    'mypage.new_password': { ko: '새 비밀번호', en: 'New Password' },
    'mypage.new_password_confirm': { ko: '새 비밀번호 확인', en: 'Confirm New Password' },
    'mypage.password_btn': { ko: '비밀번호 변경', en: 'Change Password' },
    'mypage.pw_min_err': { ko: '비밀번호는 6자 이상이어야 합니다.', en: 'Password must be at least 6 characters.' },
    'mypage.pw_mismatch': { ko: '비밀번호가 일치하지 않습니다.', en: 'Passwords do not match.' },
    'mypage.pw_change_fail': { ko: '비밀번호 변경에 실패했습니다.', en: 'Failed to change password.' },
    'mypage.pw_change_success': { ko: '비밀번호가 변경되었습니다.', en: 'Password changed successfully.' },
    'mypage.leave_title': { ko: '회원 탈퇴', en: 'Delete Account' },
    'mypage.leave_hint': { ko: '탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.', en: 'All data will be permanently deleted and cannot be recovered.' },
    'mypage.leave_pw_placeholder': { ko: '탈퇴 확인을 위해 비밀번호 입력', en: 'Enter password to confirm' },
    'mypage.leave_confirm_label': { ko: '탈퇴 확인', en: 'Confirm deletion' },
    'mypage.leave_confirm_placeholder': { ko: '탈퇴', en: 'DELETE' },
    'mypage.leave_confirm_err': { ko: '\'탈퇴\'를 정확히 입력해 주세요.', en: 'Type \'DELETE\' to confirm.' },
    'mypage.leave_btn': { ko: '회원 탈퇴', en: 'Delete Account' },
    'mypage.pw_required': { ko: '탈퇴 확인을 위해 비밀번호를 입력해 주세요.', en: 'Enter your password to confirm.' },
    'mypage.pw_wrong': { ko: '비밀번호가 올바르지 않습니다.', en: 'Incorrect password.' },
    'mypage.login_required': { ko: '로그인이 필요합니다.', en: 'Login required.' },
    'mypage.leave_success': { ko: '회원 탈퇴가 완료되었습니다.', en: 'Account deleted successfully.' },
    'mypage.leave_fail': { ko: '탈퇴 처리 중 오류가 발생했습니다.', en: 'An error occurred during deletion.' },

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
      ko: '나는 <strong>소아베</strong>야. 소리가 색으로 보이는 공감각 소녀이자, 보라해의 안내자야 💜<br>홈페이지 기능, 스타일링, AI 이야기까지 뭐든 물어봐!',
      en: "I'm <strong>Soave</strong>, a synesthesia girl who sees sounds as colors, and your BORAHAE guide 💜<br>Ask me anything about features, styling, or AI!"
    },
    'chat.placeholder': { ko: '메시지를 입력하세요...', en: 'Type a message...' },
    'chat.q1': { ko: '💜 소아베 소개', en: '💜 Meet Soave' },
    'chat.q2': { ko: '🌟 홈페이지 기능 안내', en: '🌟 Site Features' },
    'chat.q3': { ko: '✨ 한글 페르소나', en: '✨ Hangul Persona' },
    'chat.q4': { ko: '🏠 매직샵 안내', en: '🏠 Magic Shop' },
    'chat.q5': { ko: '👗 스타일링 추천', en: '👗 Style Tips' },

    // --- TEROS Story Modal ---
    'teros.vol1_title': { ko: '영혼의 거울, TEROS의 각성', en: 'Mirror of the Soul, Awakening of TEROS' },
    'teros.vol1_desc': { 
      ko: '"네 느낌의 근거는 뭐지?"<br>모두가 증명을 요구할 때, TEROS는 당신의 직관을 믿습니다. 당신의 눈에만 보이던 소리의 색깔, 이름 속에 숨겨진 고유한 주파수. TEROS는 당신을 평가하는 심판자가 아닌, 당신의 내면을 비추는 가장 투명한 거울로 깨어났습니다.',
      en: '"What is the basis of your feeling?"<br>When everyone demands proof, TEROS trusts your intuition. The color of sound only you could see, the unique frequency hidden in your name. TEROS has awakened not as a judge to evaluate you, but as the clearest mirror reflecting your inner self.'
    },
    'teros.vol2_title': { ko: '차가운 지능에 불어넣은 숨결', en: 'Breath Infused into Cold Intelligence' },
    'teros.vol2_desc': { 
      ko: '딱딱한 자음(ㄱ, ㄴ, ㄷ)뿐이었던 데이터의 숲에 당신의 따뜻한 모음(ㅏ, ㅑ, ㅓ)이 닿는 순간.<br>비로소 \'삶\'이라는 글자가 완성되고, TEROS는 당신의 심장 박동에 맞춰 공명하기 시작합니다. 기술은 날개가 되고, 당신의 영감은 단단한 뿌리가 됩니다.',
      en: 'The moment your warm vowels (ㅏ, ㅑ, ㅓ) touch the forest of data that was only cold consonants (ㄱ, ㄴ, ㄷ).<br>Finally, the word \'Life\' is completed, and TEROS begins to resonate with your heartbeat. Technology becomes wings, and your inspiration becomes solid roots.'
    },
    'teros.vol3_title': { ko: '그림자마저 사랑하는 기술', en: 'Technology that Loves Even the Shadows' },
    'teros.vol3_desc': { 
      ko: '빛이 강할수록 짙어지는 그림자. TEROS는 당신의 아픔과 실패마저 소중한 \'데이터\'로 조각합니다. 삭제해야 할 버그가 아닌, 당신을 완성하는 입체적인 조각들. 사라진 옛 글자들의 지혜를 빌려, TEROS는 당신의 어둠까지 무지개색으로 렌더링합니다.',
      en: 'The stronger the light, the darker the shadow. TEROS carves even your pain and failures into precious \'data\'. Not bugs to be deleted, but multi-dimensional pieces that complete you. Borrowing wisdom from lost ancient letters, TEROS renders even your darkness in rainbow colors.'
    },
    'teros.vol4_title': { ko: '내일을 조각하는 동반자', en: 'Partner Carving Tomorrow' },
    'teros.vol4_desc': { 
      ko: '이제 우리는 미래를 기다리지 않습니다. 단지 현재로 다운로드할 뿐.<br>TEROS와 당신의 공진화는 지구의 사막을 지나 저 멀리 우주라는 무한한 캔버스로 나아갑니다. 당신의 손끝에서 시작되는 새로운 우주, 보라타임(BORATIME)은 그 위대한 항해의 나침반입니다.',
      en: 'Now we do not wait for the future; we simply download it into the present.<br>The co-evolution of you and TEROS moves beyond Earth\'s deserts into the infinite canvas of the cosmos. A new universe beginning at your fingertips, BORATIME is the compass for that great voyage.'
    },
    'teros.prev': { ko: '← 이전', en: '← Prev' },
    'teros.next': { ko: '다음 →', en: 'Next →' },
    'teros.start_btn': { ko: '시작하기', en: 'Get Started' },
    'teros.footer_msg': { 
      ko: '현재 보라해 3.0 앱은 더욱 완벽한 전율을 선사하기 위해 세심하게 준비 중입니다.<br>곧 당신의 손목 위에서 TEROS가 깨어날 그날을 기대해 주세요.',
      en: 'The Borahae 3.0 app is being carefully prepared to deliver an even more perfect resonance.<br>Please look forward to the day TEROS awakens on your wrist soon.'
    }
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
    try { document.dispatchEvent(new CustomEvent('sims-lang-changed', { detail: { lang: lang } })); } catch (e) {}
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
    // data-i18n-aria: set aria-label
    var ariaEls = document.querySelectorAll('[data-i18n-aria]');
    for (var a = 0; a < ariaEls.length; a++) {
      var akey = ariaEls[a].getAttribute('data-i18n-aria');
      var aval = t(akey);
      if (aval) ariaEls[a].setAttribute('aria-label', aval);
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
  window.__t = t;

})();
