/* 개미시티 영어 문구 사전 (v45 1차: 입장·HUD·조작·오류·자주 나오는 알림)
   window.I18N_EN = { dict: {한국어: English}, rx: [[정규식, 바꿀 말 또는 함수]] } — 새 문구는 dict 에 추가 */
(function () {
  var W = { '찜질방': 'Sauna', '별 관측소': 'Star Observatory', '폭락의 지하 묘지': 'Crash Catacombs', '세계 포털 광장': 'World Portal Plaza' };
  var dict = {
    // 첫 화면·오류
    '👆 화면을 눌러 조작을 시작하세요': '👆 Tap the screen to start',
    '이 기기에서는 3D(WebGL)를 쓸 수 없습니다': '3D (WebGL) is not available on this device',
    '그래픽 가속이 꺼져 있거나 지원되지 않는 브라우저입니다.': 'Graphics acceleration is off or not supported by this browser.',
    '최신 크롬(Chrome)이나 사파리로 열거나, 브라우저를 업데이트한 뒤 다시 시도해 주세요. 설정에서 「하드웨어 가속」이 켜져 있어야 합니다.': 'Open it in the latest Chrome or Safari, or update your browser and try again. "Hardware acceleration" must be on in settings.',
    '원복 계산기로 가기 →': 'Go to the break-even calculator →',
    '연결 실패 — 새로고침 해 주세요': 'Connection failed — please refresh',
    // 머리 메뉴
    '☰ 메뉴': '☰ Menu', '✕ 닫기': '✕ Close', '채널 고르는 중…': 'Choosing a channel…', '📈 시장 리포트': '📈 Market report', '🔮 오늘의 예측': '🔮 Daily poll',
    '📖 방명록': '📖 Guestbook', '🏆 주간 랭킹': '🏆 Weekly ranking', '📅 출석': '📅 Check-in', '📊 히트맵': '📊 Heatmap', '🔋 절전': '🔋 Power save',
    '🎆 축포': '🎆 Fireworks', '시세 입력': 'Enter prices', '🎒 가방': '🎒 Bag', '🔎 메뉴 검색': '🔎 Search', '🌐 세계': '🌐 Worlds', '🗺 지도·이동': '🗺 Map',
    '📸 사진': '📸 Photo', '📲 앱 설치': '📲 Install app', '👑 방장 관리': '👑 Host tools', '🎵 음악': '🎵 Music', '🔔 소리 켬': '🔔 Sound on', '🔕 소리 끔': '🔕 Sound off',
    '내 정보': 'My profile', '방 링크': 'Room link', '계산기 →': 'Calculator →', '❓ 사용법': '❓ Help', '📣 레버가치': '📣 Levergachi', '☕ 후원': '☕ Support',
    // 상태 카드·채팅
    '개미': 'Ant', '공덕': 'XP', '🔍 눌러서 진화 도감 보기': '🔍 Tap to open the evolution book', '/ 108배': '/ 108 bows', '108배 방석에서 E': 'Press E on the 108-bow cushion',
    '시황: 데이터 없음 → 평온': 'Market mood: no data → calm', '대화': 'Chat', '몸짓': 'Emotes', '랭킹': 'Ranking', '친구': 'Friends', '💬 채널': '💬 Channel',
    '🌐 거시': '🌐 Macro', '🏟 토론': '🏟 Debate', '⬇ 새 메시지': '⬇ New messages', '전송': 'Send', '💬 말하기…': '💬 Say something…', '몸짓 · 전광판을 향해': 'Emotes · toward the big board',
    '🙇 절하기': '🙇 Bow', '👏 박수': '👏 Clap', '💧 물타기': '💧 Pour water', '🔴 매수연타': '🔴 Buy! Buy!', '🦘 점프': '🦘 Jump', '🕺 춤': '🕺 Dance',
    '🔥 파이어!': '🔥 FIRE!', '🔔 타종': '🔔 Ring the bell', '🚀 떡상기원': '🚀 To the moon', '이모티콘': 'Emoji', '지금 객장에 있는 개미 공덕 순위': 'XP ranking of the ants here now',
    // 빠른 막대·조작
    '더보기': 'More', '검색': 'Search', '자동사냥': 'Auto-hunt', '이동': 'Travel', '세계': 'Worlds', '야외': 'Outdoors', '시야': 'View', '강화': 'Upgrade',
    '상점': 'Shop', '카드': 'Card', '이벤트': 'Events', '가방': 'Bag', '✕ 취소': '✕ Cancel',
    'WASD·방향키 이동 · Shift 달리기 · Space 점프 · E 상호작용 · 드래그 시점 · 휠 줌 · 바닥 클릭 이동': 'WASD/arrows move · Shift run · Space jump · E interact · drag to look · wheel zoom · click the ground to walk',
    '달리기': 'Run', '앉기': 'Sit', '일어나기': 'Stand', '점프': 'Jump', '스킬': 'Skill', '목탁': 'Moktak', '상호': 'Use', '작용': '', '자동': 'Auto',
    '재미용 · 투자 조언 아님 · 시세는 출처·시각과 함께 표시 · 수익 빨강▲ 손실 파랑▼': 'For fun · not investment advice · prices shown with source and time · Korean colors: red ▲ up, blue ▼ down',
    // 입장 창
    '닉네임 (12자)': 'Nickname (12 characters)', '이름 뽑기': 'Random', '📌 내 대표 종목': '📌 My main stock', '(국내·미국 아무 종목 · 선택)': '(Korean or US · optional)',
    '종목·수익률 공개': 'Show stock and return', '종목만 공개': 'Show stock only', '나만 보기': 'Only me', 'KORU 평단 ($)': 'KORU avg. price ($)', 'SOXL 평단 ($)': 'SOXL avg. price ($)',
    '방장 코드': 'Host code', '(방장만 · 비워 두세요)': '(host only · leave empty)', '넥타이 색': 'Tie color', '머리띠 문구 (레벨이 오르면 더 열림)': 'Headband text (more unlock as you level up)',
    '🔐 내 기록 저장 · 이어하기': '🔐 Save and continue my progress', '(선택 — 다른 기기에서도 이어서)': '(optional — continue on other devices)',
    '처음이면 새로 만들어지고, 있던 아이디면 기록을 불러옵니다.': 'A new ID is created the first time; an existing ID loads your progress.', '로그아웃': 'Log out', '🔄 레벨 초기화': '🔄 Reset level', '입장하기': 'Enter',
    '평단·수익률은 다른 참가자에게도 말풍선으로 보입니다. 원치 않으면 비워 두세요.': 'Your average price and return appear to others in a speech bubble. Leave them empty to keep them private.',
    'ⓘ 게임·교육·소통 공간입니다. 시세는 지연·오류가 있을 수 있고 매매 권유나 수익 보장이 아닙니다. 투자 판단과 책임은 본인에게 있습니다. 허위정보·투자 사기·리딩방 유도는 금지입니다.': 'ⓘ A place to play, learn and chat. Prices may be delayed or wrong. Nothing here recommends buying or selling or promises returns. Your investment decisions are your own. Misinformation, scams and paid "signal room" promotion are not allowed.',
    '닉네임을 입력하거나 «이름 뽑기»를 눌러 주세요.': 'Type a nickname or press «Random».', '평단은 0보다 큰 숫자여야 합니다.': 'Average price must be a number above 0.',
    '방장 코드가 맞지 않습니다. (방장이 아니면 비워 두세요)': 'Wrong host code. (Leave it empty unless you are the host)',
    // 창·도움말
    '🗺 원복 월드 지도 · 순간이동': '🗺 World map · teleport', '닫기': 'Close', '닫기 ✕': 'Close ✕', '취소': 'Cancel', '🌐 세계 관문': '🌐 World gate',
    'Enter=첫 결과 · ↑↓ 선택 · Esc 닫기 ·': 'Enter = first result · ↑↓ select · Esc close ·', '로 언제든 열기': 'opens this anytime',
    '🎉 진화!': '🎉 Evolved!', '새로 생긴 능력과 버프예요 — 계속 키우면 더 강해져요!': 'New abilities and buffs — keep growing to get stronger!', '좋아요! 💪': 'Nice! 💪',
    '👢 강퇴되었어요': '👢 You were removed from the room', '시간이 지나면 자동으로 다시 들어올 수 있어요': 'You can come back automatically after a while',
    '🎒 내 가방': '🎒 My bag', '🧠 제일 센 걸로 자동 장착': '🧠 Equip the best', '🧺 전부 벗기': '🧺 Unequip all', '🔨 강화소': '🔨 Upgrade shop',
    '🃏 내 개미 카드': '🃏 My ant card', '📤 공유하기': '📤 Share', '💾 저장': '💾 Save', '🔗 링크 복사': '🔗 Copy link', '🔀 문구 바꾸기': '🔀 New caption',
    '🎵 배경음악 · 효과음': '🎵 Music and sound effects', '배경음악 크기': 'Music volume', '효과음 크기': 'Effects volume',
    '📲 앱처럼 설치하기': '📲 Install like an app', '홈 화면에 아이콘이 생기고 주소창 없이 전체 화면으로 열려요': 'Adds an icon to your home screen and opens full screen',
    '🏆 주간 시즌 랭킹': '🏆 Weekly season ranking',
    // 속성(placeholder·title)
    '예: 존버보살27': 'e.g. LuckyAnt27', '예) 현대차 · 005380 · TSLA · 엔비디아': 'e.g. TSLA · NVDA · 005930', '평단가': 'Avg. price', '선택': 'Optional',
    '방장이 아니면 비워 두세요': 'Leave empty unless you are the host', '아이디': 'ID', '비밀번호(4자 이상)': 'Password (4+ characters)', '한마디 (Enter)': 'Say something (Enter)',
    '🔎 무엇을 할까요? 예) 지도 · 낚시 · 찜질방 · 가방 · 108배': '🔎 What do you want to do? e.g. map · fishing · sauna · bag', '채널 바꾸기': 'Change channel',
    '눌러서 큰 지도 · 순간이동': 'Tap for the big map · teleport', '쪽지함': 'Messages', '누르면 자동 이동 취소': 'Tap to cancel auto-walk', '각성 (V)': 'Awaken (V)', '원기옥 (B)': 'Spirit bomb (B)', '탈것 타기/내리기 (X)': 'Ride / dismount (X)',
    // 알림
    '✨ 부활! 체력 가득': '✨ Revived! Full HP', '😵 기절! 5초 뒤 입구에서 부활해요': '😵 Knocked out! You respawn at the entrance in 5 s',
    '😵 기절! 5초 뒤 💬 라운지 모닥불에서 부활 (앉아 있으면 공격 안 받아요)': '😵 Knocked out! You respawn at the 💬 lounge campfire in 5 s (sitting keeps you safe)',
    '🤖 자동사냥 시작! 가까운 몬스터를 찾아 싸워요 (조이스틱을 움직이면 멈춰요)': '🤖 Auto-hunt on! It finds and fights nearby monsters (move the joystick to stop)',
    '😥 세계를 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요': '😥 Could not load the world. Please try again in a moment',
    '😵 기절 중에는 못 들어가요': '😵 You cannot enter while knocked out', '🌋 레이드 중에는 못 들어가요': '🌋 You cannot enter during a raid',
    '지금은 세계 안이에요. 🚪 문 앞에서 나가면 메뉴 검색을 쓸 수 있어요': 'You are inside a world. Leave through the 🚪 door to use search',
    '🤖 이 세계에서는 자동사냥이 안 돼요': '🤖 Auto-hunt is not available in this world', '🤖 자동사냥 멈춤': '🤖 Auto-hunt off',
    '이미 다른 개미가 앉아 있어요': 'Another ant is already sitting there',
    '🗺 오른쪽 위 지도(또는 🌀 포털)를 누르면 사냥터·투기장·레이드 광장으로 순간이동!': '🗺 Tap the map at the top right (or a 🌀 portal) to teleport to hunting grounds, the arena and the raid plaza!',
    '🌐 푸른 빛기둥 = 세계 관문! 들어가면 찜질방·포털 광장으로 가요': '🌐 The blue light pillar is the world gate! Step in to reach the sauna and the portal plaza',
    '확인': 'OK'
  };
  var WHY = { '출석': 'check-in', '진화 축하': 'evolution bonus', '잭팟': 'jackpot', '던전 클리어': 'dungeon clear', '퀘스트': 'quest' };
  var rx = [
    [/^(.+) 입장! 나가려면 🚪 문 앞에서 \[나가기\]$/, function (m, a) { return (W[a] || a) + ' — you are in! To leave, use [Exit] at the 🚪 door'; }],
    [/^🤖 자동사냥 멈춤 — (.+)$/, '🤖 Auto-hunt off — $1'],
    [/^(\d+)채널은 꽉 찼어요 \((\d+)명\) — 다른 채널을 골라 주세요$/, 'Channel $1 is full ($2) — please pick another'],
    [/^(.+)은 (\d+)단계부터 도전할 수 있어요 \(지금 (\d+)단계\)$/, function (m, a, b, c) { return (W[a] || a) + ' opens at stage ' + b + ' (you are at stage ' + c + ')'; }],
    [/^🔒 (.+) 은 (\d+)단계부터!$/, '🔒 $1 unlocks at stage $2!'],
    [/^🪙 \+([\d,]+) 코인 \((.+)\)$/, function (m, n, w) { return '🪙 +' + n + ' coins (' + (WHY[w] || w) + ')'; }],
    [/^🎉 진화! (.+) \((\d+)\/100단계\) · 다음은 (.+)$/, '🎉 Evolved! $1 (stage $2/100) · next: $3'],
    [/^🎁 오늘 첫 입장 보너스 \+([\d,]+)$/, '🎁 First visit today +$1 XP'],
    [/^📅 출석 (\d+)일째! \+공덕 \(7일 연속이면 전설 상자\)$/, '📅 Check-in day $1! +XP (7 days in a row: legendary box)'],
    [/^🎯 (.+)까지 ([\d,]+) 공덕 · 레이드 1승 ≈ (\d+)%$/, '🎯 $2 XP to $1 · one raid win ≈ $3%']
  ];
  window.I18N_EN = { dict: dict, rx: rx, worlds: W };
})();
