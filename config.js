// =====================================================================
//  레버가치 원복 계산기 / 원복 법당 — 설정 파일
//  비워 두면: 시세는 수동 입력, 법당은 '같은 브라우저 탭끼리'만 연결되는 미리보기 모드
//  채우면:   누구나 접속해 같은 법당에서 만나고, 시세가 자동 반영됩니다.
//  (설정 방법은 README.md 참고)
// =====================================================================
window.LEVER_CONFIG = {
  // Firebase 콘솔 > 프로젝트 설정 > 내 앱(웹) > SDK 구성 값을 그대로 붙여 넣기
  // 예: { apiKey: "AIza...", authDomain: "xxx.firebaseapp.com",
  //       databaseURL: "https://xxx-default-rtdb.asia-southeast1.firebasedatabase.app",
  //       projectId: "xxx", appId: "1:...:web:..." }
  firebase: {
    apiKey: "AIzaSyDQm1IcdcjItUlOufrY7jpkkU7In3bWzJY",
    authDomain: "wonbok-gaekjang.firebaseapp.com",
    databaseURL: "https://wonbok-gaekjang-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wonbok-gaekjang",
    storageBucket: "wonbok-gaekjang.firebasestorage.app",
    messagingSenderId: "268108760695",
    appId: "1:268108760695:web:40acf78ac828ca6a5ca872"
  },

  // https://finnhub.io 무료 API 키 (없으면 빈 문자열)
  finnhubKey:"dbtf0r9r01qnliuuevpgdbtf0r9r01qnliuuevq0",

  // 시세 갱신 주기(초). Finnhub 무료 한도(분당 60회)를 넘지 않도록 10초 이상 권장
  priceRefreshSec: 15,

  // ── 객장 채널 ──────────────────────────────────────────────
  // 채널 수(ch1 … chN)와 채널 하나의 정원. 꽉 찬 채널은 입장이 막히고 다른 채널로 안내됩니다.
  // ※ Firebase 무료(Spark) 요금제는 사이트 전체 '동시 접속 100명' 제한이 있습니다.
  //   그 이상 받으려면 Firebase 콘솔에서 Blaze(종량제)로 바꾸세요.
  channels: 3,
  roomCapacity: 100,

  // ── 운영자 프로필 (비워 두면 안 보임) ───────────────────────
  // photo: 저장소에 올린 사진 파일 이름(예: "profile.jpg") 또는 https:// 주소
  // link : 누르면 열릴 주소(예: 네이버 블로그) — 비워도 됨
  profile: { name: "레버가치전문가", photo: "", link: "" },

  // ── 레버가치 채널 홍보 (상단 「📣 레버가치」 메뉴 · 후원 페이지 · 객장 입장 안내에 표시) ──
  links: [
    { icon: "📝", name: "네이버 블로그", desc: "미국주식·AI 인프라·레버리지 분석 글", url: "https://blog.naver.com/leverage_expert" },
    { icon: "💬", name: "오픈카톡방", desc: "저점매수 신호봇 가입 · 같이 이야기해요", url: "https://open.kakao.com/o/gq92qKDi" },
    { icon: "📈", name: "저점매수 신호 웹페이지", desc: "레버가치 신호봇 등급·성과 한눈에", url: "https://levergachi.github.io/" }
  ],

  // ── 후원 (비워 두면 '후원하기' 버튼이 안 보임) ───────────────
  // bank·account·holder: 후원 계좌(QR·복사·토스 송금 버튼이 자동으로 생김)  text: 추가 안내 문구  link: 다른 후원 페이지(선택)
  donate: { bank: "토스뱅크", account: "1000-0583-9441", holder: "김명선", text: "", link: "" }
};
