/* =====================================================================
 *  extras.js — 계산기·객장 공용 UI 부품 (일반 <script>, 전역 LVX)
 *   · ❓ 사용법 알약 + 첫 방문 3단계 안내 카드
 *   · 프로필(레버가치전문가 사진·이름) / ☕ 후원하기 — config.js 에 값이 있을 때만 표시
 *   · 채널 고르기 창 (ch1…ch10, 인원 표시, 자동 입장, 정원 초과 막기)
 * ===================================================================== */
(function () {
  "use strict";
  var CFG = window.LEVER_CONFIG || {};
  var CAP = Math.max(2, Math.min(2000, Math.floor(Number(CFG.roomCapacity) || 300)));
  var NCH = Math.max(1, Math.min(30, Math.floor(Number(CFG.channels) || 10)));
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function safeUrl(u) { u = String(u || "").trim(); if (!u) return ""; if (/^(https?:)?\/\//i.test(u) || /^[\w\-./]+\.(png|jpe?g|webp|gif|svg)$/i.test(u)) return u; return ""; }
  function safeLink(u) { u = String(u || "").trim(); return /^https?:\/\//i.test(u) ? u : ""; }

  var css = [
    ".lvx-pill{display:inline-flex;align-items:center;gap:5px;font:700 12.5px/1 inherit;font-family:inherit;padding:7px 11px;border-radius:999px;border:1px solid #f1c76a;background:#fff8e6;color:#7a4b00;cursor:pointer;white-space:nowrap;box-shadow:0 2px 6px rgba(160,110,0,.12)}",
    ".lvx-pill:hover{background:#ffefc2}",
    ".lvx-guide{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:95;width:min(420px,calc(100% - 20px));background:#fff;color:#1d2433;border-radius:16px;box-shadow:0 12px 40px rgba(30,50,90,.22);border:1px solid #e3e8f2;padding:14px 16px 12px;font-family:inherit;animation:lvxUp .3s ease-out}",
    "@keyframes lvxUp{from{transform:translate(-50%,16px);opacity:0}to{transform:translate(-50%,0);opacity:1}}",
    ".lvx-guide h4{margin:0 0 8px;font-size:15px;display:flex;align-items:center;gap:6px}",
    ".lvx-guide ol{margin:0;padding:0;list-style:none;display:grid;gap:6px}",
    ".lvx-guide li{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;line-height:1.4}",
    ".lvx-guide li b{flex:0 0 22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#ff7a59,#ffb020);color:#fff;display:grid;place-items:center;font-size:12px}",
    ".lvx-guide .x{display:flex;justify-content:flex-end;margin-top:10px}",
    ".lvx-guide .x button{border:0;border-radius:10px;padding:8px 16px;background:#2f6bff;color:#fff;font-weight:800;font-family:inherit;cursor:pointer}",
    ".lvx-prof{display:inline-flex;align-items:center;gap:7px;text-decoration:none;color:inherit;font-weight:800;font-size:13px;white-space:nowrap}",
    ".lvx-prof img{width:30px;height:30px;border-radius:50%;object-fit:cover;border:2px solid #fff;box-shadow:0 0 0 2px #ffb020}",
    ".lvx-prof.big img{width:44px;height:44px}",
    ".lvx-don{font-family:inherit;font-weight:800;font-size:12.5px;padding:7px 12px;border-radius:999px;border:0;background:linear-gradient(135deg,#ff8a65,#ffb74d);color:#fff;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(255,120,60,.3)}",
    ".lvx-modal{position:fixed;inset:0;z-index:90;background:rgba(30,40,60,.42);display:flex;align-items:center;justify-content:center;padding:14px;font-family:inherit}",
    ".lvx-box{width:min(460px,100%);max-height:calc(100vh - 28px);overflow:auto;background:#fff;color:#1d2433;border-radius:18px;padding:18px;box-shadow:0 20px 60px rgba(30,50,90,.3)}",
    ".lvx-box h3{margin:0 0 4px;font-size:19px;text-align:center}",
    ".lvx-box .s{text-align:center;color:#66708a;font-size:12.5px;margin-bottom:12px}",
    ".lvx-chs{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}",
    ".lvx-ch{display:flex;flex-direction:column;gap:5px;text-align:left;border:1px solid #e3e8f2;background:#f7f9fd;border-radius:12px;padding:9px 11px;cursor:pointer;font-family:inherit;color:#1d2433}",
    ".lvx-ch:hover{border-color:#2f6bff;background:#eef3ff}",
    ".lvx-ch.cur{border-color:#ffb020;box-shadow:0 0 0 2px #ffe2a3}",
    ".lvx-ch.full{opacity:.55;cursor:not-allowed}",
    ".lvx-ch .t{display:flex;justify-content:space-between;font-weight:800;font-size:14px}",
    ".lvx-ch .t span{font-weight:700;font-size:12px;color:#66708a;font-variant-numeric:tabular-nums}",
    ".lvx-ch .bar{height:6px;border-radius:3px;background:#e6ebf5;overflow:hidden}",
    ".lvx-ch .bar i{display:block;height:100%;background:linear-gradient(90deg,#36c98e,#2f6bff)}",
    ".lvx-ch.hot .bar i{background:linear-gradient(90deg,#ffb020,#ff5a5f)}",
    ".lvx-auto{width:100%;margin-top:12px;padding:12px;border:0;border-radius:12px;background:linear-gradient(90deg,#ff7a59,#ffb020);color:#fff;font-weight:900;font-size:16px;font-family:inherit;cursor:pointer}",
    ".lvx-msg{min-height:18px;color:#d0343a;font-size:12.5px;text-align:center;margin-top:8px}",
    ".lvx-note{font-size:11px;color:#8a93a8;text-align:center;margin-top:6px;line-height:1.5}",
    ".lvx-dtext{white-space:pre-wrap;word-break:break-all;font-size:14px;line-height:1.6;background:#f7f9fd;border-radius:10px;padding:10px 12px;margin:8px 0}",
    ".lvx-btn{display:block;width:100%;text-align:center;padding:11px;border-radius:12px;border:0;background:#2f6bff;color:#fff;font-weight:800;font-family:inherit;cursor:pointer;text-decoration:none;margin-top:8px}",
    ".lvx-btn.sec{background:#eef1f7;color:#3a4256}"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = css; (document.head || document.documentElement).appendChild(st);

  /* ---------- 사용법 ---------- */
  var GUIDES = {
    room: { title: "🐜 원복 객장 사용법", steps: ["닉네임·평단 넣고 <입장>", "방향키·조이스틱으로 이동 — 시주함·목탁 같은 물건 가까이 가면 <E>", "이모티콘·몸짓·채팅으로 같이 기도하고 수다 떨기"] },
    calc: { title: "🧮 원복 계산기 사용법", steps: ["내 평단·현재가 입력", "현재 코스피(또는 필라델피아 반도체지수) 입력", "결과 카드에서 '몇 포인트 가야 원복인지' 확인"] }
  };
  var guideEl = null;
  function showGuide(kind) {
    hideGuide(); var g = GUIDES[kind] || GUIDES.room;
    guideEl = el("div", "lvx-guide"); guideEl.setAttribute("role", "dialog");
    guideEl.appendChild(el("h4", null, g.title));
    var ol = el("ol"); g.steps.forEach(function (t, i) { var li = el("li"); li.appendChild(el("b", null, String(i + 1))); li.appendChild(el("span", null, t)); ol.appendChild(li); });
    guideEl.appendChild(ol);
    var x = el("div", "x"); var b = el("button", null, "알겠어요"); b.type = "button"; b.onclick = function () { store("lvx_guide_" + kind, "1"); hideGuide(); }; x.appendChild(b); guideEl.appendChild(x);
    document.body.appendChild(guideEl);
  }
  function hideGuide() { if (guideEl) { guideEl.remove(); guideEl = null; } }
  function helpPill(container, kind) {
    var b = el("button", "lvx-pill", "❓ 사용법"); b.type = "button"; b.id = "lvxHelp";
    b.onclick = function () { if (guideEl) hideGuide(); else showGuide(kind); };
    if (container) container.appendChild(b);
    if (!store("lvx_guide_" + kind)) setTimeout(function () { showGuide(kind); }, 400);
    return b;
  }

  /* ---------- 프로필 · 후원 (config.js 값이 있을 때만) ---------- */
  function profileEl(big) {
    var p = CFG.profile || {}; var src = safeUrl(p.photo); if (!src) return null;
    var link = safeLink(p.link); var a = el(link ? "a" : "span", "lvx-prof" + (big ? " big" : ""));
    if (link) { a.href = link; a.target = "_blank"; a.rel = "noopener"; }
    var img = el("img"); img.src = src; img.alt = String(p.name || "프로필"); img.loading = "lazy"; a.appendChild(img);
    a.appendChild(el("span", null, String(p.name || "").slice(0, 20)));
    return a;
  }
  function donateBtn() {
    var d = CFG.donate || {}; var txt = String(d.text || "").trim(), link = safeLink(d.link);
    if (!txt && !link) return null;
    var b = el("button", "lvx-don", "☕ 후원하기"); b.type = "button"; b.id = "lvxDonate";
    b.onclick = function () {
      var m = el("div", "lvx-modal"), box = el("div", "lvx-box"); m.appendChild(box);
      box.appendChild(el("h3", null, "☕ 후원하기"));
      box.appendChild(el("div", "s", "객장 운영을 응원해 주셔서 감사합니다"));
      if (txt) box.appendChild(el("div", "lvx-dtext", txt.slice(0, 400)));
      if (link) { var a = el("a", "lvx-btn", "후원 페이지 열기"); a.href = link; a.target = "_blank"; a.rel = "noopener"; box.appendChild(a); }
      var c = el("button", "lvx-btn sec", "닫기"); c.type = "button"; c.onclick = function () { m.remove(); }; box.appendChild(c);
      m.addEventListener("pointerdown", function (e) { if (e.target === m) m.remove(); });
      document.body.appendChild(m);
    };
    return b;
  }
  function decorate(container) { // 헤더에 프로필·후원 붙이기
    if (!container) return;
    var p = profileEl(false); if (p) container.insertBefore(p, container.children[1] || null);
    var d = donateBtn(); if (d) container.appendChild(d);
  }

  /* ---------- 채널 ---------- */
  var CHS = []; for (var i = 1; i <= NCH; i++) CHS.push("ch" + i);
  function chNo(r) { var m = /^ch(\d{1,2})$/.exec(String(r || "")); return m ? +m[1] : 0; }
  function chLabel(r, n) { var k = chNo(r); return (k ? k + "채널" : "방 " + r) + " · " + n + "/" + CAP + "명"; }
  function roomFromUrl() { try { var r = new URLSearchParams(location.search).get("room"); if (!r) return null; r = r.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 24); return r || null; } catch (e) { return null; } }
  function counter(live, cb) {
    if (LVX.forceCounts) { var f = LVX.forceCounts.slice(); cb(f); var t = setInterval(function () { cb(LVX.forceCounts.slice()); }, 500); return function () { clearInterval(t); }; }
    if (live && live.channelCounts) return live.channelCounts(cb);
    cb(CHS.map(function () { return -1; })); return function () {};
  }
  // 한 채널의 현재 인원 한 번 읽기 (최대 1.5초)
  function countOnce(live, room) {
    return new Promise(function (res) {
      var k = chNo(room); if (!k) { res(0); return; }
      var done = false, off = null, best = 0;
      off = counter(live, function (arr) { best = Math.max(best, arr[k - 1] || 0); });
      setTimeout(function () { if (done) return; done = true; try { off && off(); } catch (e) {} res(best); }, LVX.forceCounts ? 50 : 1500);
    });
  }
  function pickChannel(live, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var m = el("div", "lvx-modal"); m.id = "lvxCh"; var box = el("div", "lvx-box"); m.appendChild(box);
      box.appendChild(el("h3", null, opts.title || "📈 채널 고르기"));
      box.appendChild(el("div", "s", "채널마다 최대 " + CAP + "명 · 같은 채널에 들어온 개미끼리 함께 보여요"));
      var grid = el("div", "lvx-chs"); box.appendChild(grid);
      var btns = CHS.map(function (name, i) {
        var b = el("button", "lvx-ch" + (opts.current === name ? " cur" : "")); b.type = "button"; b.dataset.ch = name;
        var t = el("div", "t"); t.appendChild(el("b", null, (i + 1) + "채널")); var n = el("span", null, "…"); t.appendChild(n);
        var bar = el("div", "bar"), fill = el("i"); bar.appendChild(fill);
        b.appendChild(t); b.appendChild(bar); grid.appendChild(b);
        b.onclick = function () { choose(name); };
        return { b: b, n: n, fill: fill };
      });
      var auto = el("button", "lvx-auto", "⚡ 자동 입장 (여유 있는 채널로)"); auto.type = "button"; auto.id = "lvxAuto"; box.appendChild(auto);
      var msg = el("div", "lvx-msg"); box.appendChild(msg);
      box.appendChild(el("div", "lvx-note", "무료 서버 요금제에서는 사이트 전체 동시 접속이 100명으로 제한될 수 있어요."));
      if (opts.cancel) { var c = el("button", "lvx-btn sec", "취소"); c.type = "button"; c.onclick = function () { close(); resolve(null); }; box.appendChild(c); }
      document.body.appendChild(m);
      var counts = CHS.map(function () { return 0; });
      var off = counter(live, function (arr) {
        counts = arr;
        arr.forEach(function (v, i) {
          var x = btns[i]; if (!x) return; var full = v >= CAP;
          x.n.textContent = v < 0 ? "-" : v + "/" + CAP + "명"; x.fill.style.width = Math.min(100, Math.max(0, v) / CAP * 100) + "%";
          x.b.classList.toggle("full", full); x.b.classList.toggle("hot", v >= CAP * 0.8 && !full); x.b.dataset.n = v;
        });
      });
      function close() { try { off && off(); } catch (e) {} m.remove(); }
      function choose(name) {
        var i = CHS.indexOf(name), v = counts[i] || 0;
        if (v >= CAP && name !== opts.current) { msg.textContent = (i + 1) + "채널은 꽉 찼어요 (" + CAP + "명). 다른 채널을 골라 주세요 🙏"; return; }
        close(); resolve(name);
      }
      auto.onclick = function () {
        for (var i = 0; i < CHS.length; i++) if ((counts[i] || 0) < CAP) { choose(CHS[i]); return; }
        msg.textContent = "모든 채널이 꽉 찼어요. 잠시 후 다시 시도해 주세요 🙏";
      };
    });
  }

  window.LVX = {
    CAP: CAP, CHANNELS: CHS, chNo: chNo, chLabel: chLabel, roomFromUrl: roomFromUrl,
    pickChannel: pickChannel, countOnce: countOnce, helpPill: helpPill, showGuide: showGuide, hideGuide: hideGuide,
    profileEl: profileEl, donateBtn: donateBtn, decorate: decorate, forceCounts: window.LVX_FORCE || null
  };
})();
