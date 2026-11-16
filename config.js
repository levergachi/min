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
  finnhubKey: "",

  // 시세 갱신 주기(초). Finnhub 무료 한도(분당 60회)를 넘지 않도록 10초 이상 권장
  priceRefreshSec: 15,

  // ── 객장 채널 ──────────────────────────────────────────────
  // 채널 수(ch1 … chN)와 채널 하나의 정원. 꽉 찬 채널은 입장이 막히고 다른 채널로 안내됩니다.
  // ※ Firebase 무료(Spark) 요금제는 사이트 전체 '동시 접속 100명' 제한이 있습니다.
  //   그 이상 받으려면 Firebase 콘솔에서 Blaze(종량제)로 바꾸세요.
  channels: 10,
  roomCapacity: 300,

  // ── 운영자 프로필 (비워 두면 안 보임) ───────────────────────
  // photo: 저장소에 올린 사진 파일 이름(예: "profile.jpg") 또는 https:// 주소
  // link : 누르면 열릴 주소(예: 네이버 블로그) — 비워도 됨
  profile: { name: "레버가치전문가", photo: "", link: "" },

  // ── 후원 (비워 두면 '후원하기' 버튼이 안 보임) ───────────────
  // text: 후원 안내 문구(예: 은행명·계좌·예금주를 직접 적기)  link: 후원 페이지 주소(선택)
  donate: { text: "", link: "" }
};
