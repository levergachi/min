/* 🏦 폐장 후 지하금고 — 초고수 던전 (v69)
   공덕(XP) 1천만부터 · 연습/표준 · 4스테이지: ① 금고 진입로(운반 개미+경보 드론) ② 냉각실(방패 경비병+수리 벌레)
   ③ 중앙 금고: 보스 「마진콜 군주」 — 돌진을 기둥으로 유도하면 기절+약점 노출(피해 3배), 50%·25%에 반대매매(부하 소환+바닥 붕괴)
   ④ 과열 단계(40% 이하): 바닥 과열 구역 + 냉각 드론(잡으면 체력 회복)
   보상: 지금 진화 단계 간격의 4%(연습)·12%(표준) XP + 금고 조각 → 교환소(SS 장비 · SSS 날개 · SSS 휘장) */
(window.WB_REALMS = window.WB_REALMS || {}).vault = function (api) {
  const { THREE, group, GEO, mesh, M, sign, addInter, setInter, toast, tapeNote, gauge, G, saveG, addCoin, floatW, spark, leave } = api;
  const hyp = Math.hypot, rnd = Math.random, add = o => { group.add(o); return o; };
  const BASIC = (c, o) => new THREE.MeshBasicMaterial(Object.assign({ color: c, fog: false }, o || {}));
  const fmtN = n => n >= 1e12 ? (n / 1e12).toFixed(1) + '조' : n >= 1e8 ? (n / 1e8).toFixed(1) + '억' : n >= 1e4 ? (n / 1e4).toFixed(1) + '만' : Math.round(n).toLocaleString();
  const V = G.vault || (G.vault = { sh: 0, p: 0, s: 0, best: 0 });
  // ── 지도: 대기실(z 6~20) · 방1(z -2~-30) · 방2(z -34~-62) · 보스방(z -66~-112, 넓음)
  const ROOMS = [{ x: 9, z0: 22, z1: 4 }, { x: 9, z0: 2, z1: -30 }, { x: 9, z0: -32, z1: -62 }, { x: 17, z0: -64, z1: -112 }];
  const DOORZ = [3, -31, -63];
  const PILLARS = [[-8, -80], [8, -80], [-8, -97], [8, -97]];
  const floorM = M(0x2a2f38, { roughness: .55, metalness: .4 }), wallM = M(0x3a404c, { roughness: .5, metalness: .6 }), goldM = M(0xffc94a, { emissive: 0x6a4a00, metalness: .8, roughness: .3 });
  ROOMS.forEach((r, i) => { const L = r.z0 - r.z1, cz = (r.z0 + r.z1) / 2; add(mesh(GEO.box, i === 3 ? M(0x2a2218, { roughness: .5, metalness: .5 }) : floorM, [r.x * 2, .4, L], [0, -.2, cz]));
    [-1, 1].forEach(k => add(mesh(GEO.box, wallM, [.8, 6, L], [k * (r.x + .4), 3, cz]))); });
  add(mesh(GEO.box, wallM, [36, 6, .8], [0, 3, -112.4])); add(mesh(GEO.box, wallM, [18, 6, .8], [0, 3, 22.4]));
  // 금화 더미·금괴 (보스방)
  for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283, x = Math.cos(a) * 14.5, z = -88 + Math.sin(a) * 21; if (Math.abs(x) > 16) continue; add(mesh(GEO.cone, goldM, [1.4, 1, 1.4], [Math.max(-15.5, Math.min(15.5, x)), .5, Math.max(-111, Math.min(-65, z))])); }
  PILLARS.forEach(([x, z]) => { add(mesh(GEO.cyl, M(0x9aa6bb, { metalness: .8, roughness: .25 }), [1.6, 7, 1.6], [x, 3.5, z])); add(mesh(GEO.cyl, goldM, [1.9, .4, 1.9], [x, 7.1, z])); });
  const vdoor = add(mesh(GEO.cyl, M(0xc8d0dc, { metalness: .9, roughness: .2 }), [9, .6, 9], [0, 5, -111.6])); vdoor.rotation.x = Math.PI / 2;
  // 문 (방을 다 치우면 열려요)
  const doors = DOORZ.map((z, i) => { const d = add(mesh(GEO.box, BASIC(0xff3a5a, { transparent: true, opacity: .45 }), [i === 2 ? 18 : 18, 5, .5], [0, 2.5, z])); return d; });
  const doorOpen = [false, false, false];
  const setDoor = (i, open) => { doorOpen[i] = open; doors[i].visible = !open; };
  add(sign('🏦 폐장 후 지하금고 — 장이 끝나면 경비 장치가 폭주해요', 13, 1.1, '#fff3c4', '#7a5200')).position.set(0, 5, 21.5);
  add(sign('① 금고 진입로', 6, .8, '#ffe9a0', '#3a2a10')).position.set(0, 5.4, 2.6);
  add(sign('② 냉각실', 6, .8, '#bfe8ff', '#10283a')).position.set(0, 5.4, -31.4);
  add(sign('③ 중앙 금고 — 기둥으로 돌진을 유도해요!', 11, .9, '#ffd76a', '#4a0a10')).position.set(0, 5.4, -63.4);

  // ── 몬스터 모양 (단순 도형 몇 개)
  const MC = {}, matOf = (c, k) => MC[c + (k || '')] || (MC[c + (k || '')] = k === 'g' ? M(c, { transparent: true, opacity: .7, emissive: c, emissiveIntensity: .5 }) : M(c, { roughness: .5, metalness: .3, emissive: c, emissiveIntensity: .15 }));
  const EYE = BASIC(0xffe04a), EYE2 = BASIC(0xff2a3a);
  const part = (g, geo, m, s, p, r) => { const o = new THREE.Mesh(geo, m); o.scale.set(s[0], s[1], s[2]); o.position.set(p[0], p[1], p[2]); if (r) o.rotation.set(r[0], r[1], r[2]); g.add(o); return o; };
  function body(kind) {
    const g = new THREE.Group(), anim = [];
    if (kind === 'ant') { const m = matOf(0x8a5a2b); part(g, GEO.sph, m, [.5, .4, .7], [0, .5, 0]); part(g, GEO.sph, m, [.38, .38, .38], [0, .65, .6]); part(g, GEO.box, goldM, [.7, .35, .5], [0, 1.0, -.1]); [-1, 1].forEach(k => part(g, GEO.sph, EYE, [.08, .08, .08], [k * .14, .75, .9])); }
    else if (kind === 'drone' || kind === 'cool') { const m = matOf(kind === 'cool' ? 0x41c9ff : 0xff3a5a, 'g'); part(g, GEO.sph, m, [.55, .35, .55], [0, 2.2, 0]); anim.push(['spin', part(g, GEO.box, matOf(0x9aa6bb), [1.8, .05, .14], [0, 2.5, 0])]); part(g, GEO.sph, kind === 'cool' ? BASIC(0xbfe8ff) : EYE2, [.18, .18, .18], [0, 2.15, .45]); }
    else if (kind === 'guard') { const m = matOf(0x4a5568); part(g, GEO.box, m, [1.1, 1.5, .8], [0, 1.2, 0]); part(g, GEO.box, m, [.7, .6, .6], [0, 2.3, 0]); part(g, GEO.box, matOf(0x9aa6bb), [1.6, 1.8, .2], [0, 1.3, .7]); [-1, 1].forEach(k => part(g, GEO.sph, EYE, [.09, .09, .09], [k * .16, 2.35, .32])); }
    else if (kind === 'bug') { const m = matOf(0x30d07a, 'g'); part(g, GEO.sph, m, [.45, .35, .55], [0, 1.4, 0]); [-1, 1].forEach(k => anim.push(['flap', part(g, GEO.box, matOf(0xbfffe0, 'g'), [.8, .03, .4], [k * .55, 1.55, 0]), k])); }
    else if (kind === 'boss') { const m = matOf(0x3a0a14); part(g, GEO.box, m, [1.5, 1.6, 1.1], [0, 1.4, 0]); part(g, GEO.box, m, [.9, .8, .8], [0, 2.6, .1]); [-1, 1].forEach(k => { part(g, GEO.box, m, [.5, 1.4, .5], [k * 1.1, 1.3, .2]); part(g, GEO.cone, goldM, [.18, .6, .18], [k * .3, 3.25, .1]); part(g, GEO.sph, EYE2, [.12, .12, .12], [k * .22, 2.65, .52]); }); part(g, GEO.cone, goldM, [.5, .5, .5], [0, 3.35, .1]); anim.push(['vault', part(g, GEO.cyl, goldM, [.9, .2, .9], [0, 1.6, -.62], [Math.PI / 2, 0, 0])]); }
    return { g, anim };
  }
  function nameTex(txt, col) { const c = document.createElement('canvas'); c.width = 320; c.height = 56; const x = c.getContext('2d'); x.font = '800 30px "Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 6; x.strokeStyle = 'rgba(0,0,0,.85)'; x.strokeText(txt, 160, 30); x.fillStyle = col; x.fillText(txt, 160, 30); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
  const sprite = (map, w, h, col) => { const s = new THREE.Sprite(new THREE.SpriteMaterial(Object.assign(map ? { map } : { color: col }, { fog: false, depthTest: false, transparent: true }))); s.scale.set(w, h, 1); s.renderOrder = 999; return s; };
  const DEF = { ant: ['💰 운반 개미', 3, .04, 1.0, 4.2], drone: ['🚨 경보 드론', 4, .03, .9, 3.2], guard: ['🛡 방패 경비병', 9, .07, 1.1, 2.6], bug: ['🔧 수리 벌레', 3, .02, .9, 3.6], cool: ['❄ 냉각 드론', 3, 0, 1, 2.4], boss: ['👑 마진콜 군주', 170, .1, 2.6, 2.4], add: ['📉 반대매매 졸개', 4, .05, 1.0, 4.4] };
  let mobs = [], mode = '', st = 'lobby', t0 = 0, me = { x: 0, z: 14 }, boss = null, phase2 = 0, summoned = [false, false], hazards = [], dronesT = 0, heatT = 0, alarmT = 0, runXP = 0;
  const hard = () => (mode === 's' ? 1 : .6);
  function spawn(kind, x, z) {
    const D = DEF[kind], { g, anim } = body(kind === 'add' ? 'ant' : kind), sc = kind === 'boss' ? 2.4 : 1; g.scale.setScalar(sc); g.position.set(x, 0, z); group.add(g);
    const lab = sprite(nameTex(D[0], kind === 'boss' ? '#ffd23a' : '#f4ecff'), kind === 'boss' ? 5 : 3.4, kind === 'boss' ? .9 : .6), bg = sprite(null, kind === 'boss' ? 4 : 2, .2, 0x200810), fg = sprite(null, kind === 'boss' ? 3.9 : 1.9, .14, kind === 'boss' ? 0xffd23a : 0xff4a5a); fg.center.set(0, .5); group.add(lab, bg, fg);
    const hp = Math.round(Math.max(1, api.unit()) * D[1] * (kind === 'boss' ? hard() * (mode === 's' ? 1 : .7) : hard())), m = { kind, x, z, sc, g, anim, lab, bg, fg, hp, max: hp, pct: D[2], spd: D[4], atkT: 1 + rnd(), wind: 0, dead: 0, h: (kind === 'boss' ? 3.6 : kind === 'guard' ? 2.8 : kind === 'drone' || kind === 'cool' ? 2.9 : 1.6) * sc + .3, fbw: kind === 'boss' ? 3.9 : 1.9 };
    mobs.push(m); return m;
  }
  function freeMob(m) { group.remove(m.g, m.lab, m.bg, m.fg); try { m.lab.material.map.dispose(); [m.lab, m.bg, m.fg].forEach(s => s.material.dispose()); } catch (e) {} }
  const alive = k => mobs.filter(m => !m.dead && (!k || m.kind === k));
  function clearMobs() { mobs.forEach(freeMob); mobs = []; hazards.forEach(h => group.remove(h.o)); hazards = []; boss = null; }
  function hitMob(m, dmg, crit, big) {
    if (m.dead) return; let d = dmg;
    if (m.kind === 'guard' && alive('bug').length) { d = Math.round(dmg * .1); if (rnd() < .3) floatW(m.x, m.h, m.z, '🛡 수리 중! 벌레 먼저', 'dn'); }
    if (m.kind === 'boss') { if (boss.weak > 0) { d *= 3; big = true; } }
    m.hp -= d; m.flash = .1; floatW(m.x + (rnd() - .5), m.h * .8, m.z, (big ? '💥 ' : crit ? '⚡ ' : '') + fmtN(d), big ? 'df' : crit ? 'dc' : 'dn'); spark(m.x, 1.3 * m.sc, m.z, crit || big ? 12 : 5, crit ? 0xffe04a : 0xffb38a, 4, 5, .5, 1); api.snd('punch', !!crit);
    if (m.hp <= 0) kill(m);
  }
  function kill(m) {
    m.dead = 1; group.remove(m.g, m.lab, m.bg, m.fg); spark(m.x, 1.3, m.z, m.kind === 'boss' ? 200 : 26, m.kind === 'boss' ? 0xffd23a : 0xffc94a, 6, 4, 1, 2);
    if (m.kind === 'cool') { api.heal(api.hp().max * .15); floatW(me.x, 2.6, me.z, '❄ 냉각! 체력 +15%', 'dc'); }
    if (m.kind === 'boss') win();
  }
  // ── 진행
  function start(md) {
    if ((G.pts || 0) < 1e7) { toast('🔒 지하금고는 XP 1천만부터 들어갈 수 있어요'); return; }
    if (md === 's' && !V.p) { toast('🔒 표준은 연습을 한 번 깨야 열려요'); return; }
    clearMobs(); mode = md; st = 'r1'; t0 = performance.now(); phase2 = 0; summoned = [false, false]; alarmT = 6; runXP = 0; [0, 1, 2].forEach(i => setDoor(i, i === 0));
    for (let i = 0; i < 8; i++) spawn('ant', (rnd() - .5) * 14, -8 - rnd() * 18); spawn('drone', -6, -26); spawn('drone', 6, -26);
    tapeNote(`🏦 ${md === 's' ? '표준' : '연습'} 시작! ① 운반 개미를 잡고, 증원을 부르는 🚨 경보 드론부터 노려요`, { ms: 3200, cls: 'tip' });
  }
  function enterRoom(n) {
    if (n === 2) { st = 'r2'; for (let i = 0; i < 3; i++) spawn('guard', -6 + i * 6, -50); for (let i = 0; i < 3; i++) spawn('bug', -7 + i * 7, -58); tapeNote('② 냉각실: 🔧 수리 벌레가 살아 있으면 🛡 경비병은 피해를 거의 안 받아요 — 벌레 먼저!', { ms: 3200, cls: 'tip' }); }
    if (n === 3) { st = 'boss'; boss = spawn('boss', 0, -100); boss.st = 'walk'; boss.cT = 4; boss.weak = 0; boss.stun = 0; tapeNote('③ 👑 마진콜 군주! 빨간 줄이 보이면 기둥 뒤로 — 돌진이 기둥에 부딪히면 약점(등 쪽 금고)이 열려요', { ms: 4200, cls: 'tip' }); api.quake(.4, .6); }
  }
  function win() {
    st = 'done'; const sec = Math.round((performance.now() - t0) / 1000), gap = api.stepGap(), xp = Math.round(gap * (mode === 's' ? .12 : .04)), sh = mode === 's' ? 3 : (V.p ? 1 : 2), coin = Math.round(xp / 30);
    api.addPts(xp); addCoin(coin, '지하금고'); V.sh += sh; if (mode === 's') V.s++; else V.p++; if (!V.best || sec < V.best) V.best = sec; saveG();
    let extra = ''; if (mode === 's' && rnd() < .03) { const it = api.grantItem('g', 8); extra = ` · 🎁 금고 외형 상자: ${it ? it.full : 'SSS 날개'}!`; }
    try { api.firework && api.firework(); api.cine && api.cine('levelup'); } catch (e) {}
    tapeNote(`🏆 금고 탈환! ${Math.floor(sec / 60)}분 ${sec % 60}초 · XP +${fmtN(xp)} · 🪙 +${fmtN(coin)} · 🔑 금고 조각 +${sh} (보유 ${V.sh})${extra}`, { ms: 6000, cls: 'tip' });
    toast(`🏦 클리어! 조각 ${V.sh}개 — 대기실 교환소에서 장비로 바꿔요`); setDoor(0, true); setDoor(1, true); setDoor(2, true);
  }
  function fail() { if (st === 'lobby' || st === 'done') return; st = 'lobby'; clearMobs(); [0, 1, 2].forEach(i => setDoor(i, false)); tapeNote('😵 금고 경비에 당했어요… 대기실에서 다시 도전!', { ms: 3000 }); }
  // 교환소
  function shop() {
    let P = document.getElementById('vaultShop'); if (P) { P.remove(); return; } P = document.createElement('div'); P.id = 'vaultShop'; P.className = 'pe';
    P.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:60;background:rgba(20,14,6,.97);border:1px solid #ffc94a;border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:7px;min-width:260px;color:#fff3c4;font-size:13px;box-shadow:0 10px 30px rgba(0,0,0,.6)';
    const b = t => { const e = document.createElement('b'); e.textContent = t; return e; }; P.appendChild(b(`🔑 금고 교환소 · 조각 ${V.sh}개 · 연습 ${V.p}회 · 표준 ${V.s}회${V.best ? ' · 최고 ' + V.best + '초' : ''}`));
    [[15, 'SS 확정 장비 (랜덤 칸)', () => api.grantItem(['h', 'f', 'n', 's', 'b', 'k', 'w', 'l', 't', 'o'][Math.floor(rnd() * 10)], 7)], [45, 'SSS 날개 🪽', () => api.grantItem('g', 8)], [75, 'SSS 휘장 🎖 (표준 1회 이상)', () => V.s ? api.grantItem('c', 8) : (toast('🔒 표준을 한 번 깨야 해요'), null)]].forEach(([c, t, fn]) => {
      const x = document.createElement('button'); x.type = 'button'; x.className = 'gbtn' + (V.sh >= c ? ' hot' : ''); x.textContent = `🔑${c} → ${t}`; x.disabled = V.sh < c;
      x.onclick = () => { if (V.sh < c) return; const r = fn(); if (r) { V.sh -= c; saveG(); } P.remove(); shop(); }; P.appendChild(x); });
    const cl = document.createElement('button'); cl.type = 'button'; cl.className = 'gbtn'; cl.textContent = '닫기'; cl.onclick = () => P.remove(); P.appendChild(cl); document.body.appendChild(P);
  }
  addInter('rz_vp', { name: '🏦 연습 시작 (E)', X: -5, Z: 12, h: 2.6, btn: '🏦<br>연습', fn: () => start('p') });
  addInter('rz_vs', { name: '🏦 표준 시작 (E)', X: 0, Z: 12, h: 2.6, btn: '🏦<br>표준', fn: () => start('s') });
  addInter('rz_vx', { name: '🔑 금고 교환소 (E)', X: 5, Z: 12, h: 2.6, btn: '🔑<br>교환', fn: shop });
  addInter('rz_exit', { name: '🚪 개미시티로 (E)', X: 0, Z: 19, h: 2.6, btn: '🚪<br>나가기', fn: () => leave() });
  [[-5, 0xb8c4d8], [0, 0xffc94a], [5, 0x41c9ff]].forEach(([x, c]) => add(mesh(GEO.cyl, M(c, { emissive: c, emissiveIntensity: .3, metalness: .5 }), [1.2, 1.2, 1.2], [x, .6, 12])));
  const nearest = (x, z, md) => { let b = null, bd = md; mobs.forEach(m => { if (m.dead) return; const d = hyp(m.x - x, m.z - z) - m.sc * .7; if (d < bd) { bd = d; b = m; } }); return b; };
  addInter('rz_hit', { name: '⚔ 공격', X: 0, Z: -500, h: 2.2, btn: '⚔<br>공격', fn: () => { const tg = nearest(me.x, me.z, 4.6); if (!tg) return; api.face(tg.x, tg.z); const a = api.attack(); if (a) hitMob(tg, a.dmg, a.crit); } });
  // 위험 지대 (바닥 붕괴·과열): 빨간 원 → 터짐
  function hazard(x, z, r, delay, pct, label) { const o = new THREE.Mesh(new THREE.CircleGeometry(r, 32), BASIC(0xff2a3a, { transparent: true, opacity: .25, side: THREE.DoubleSide })); o.rotation.x = -Math.PI / 2; o.position.set(x, .06, z); group.add(o); hazards.push({ o, x, z, r, t: delay, d0: delay, pct, label }); }
  let autoT = 0;
  function tryAuto(dt) { if (!api.auto() || api.manual() || st === 'lobby' || st === 'done') return; autoT -= dt; if (autoT > 0) return; autoT = .2; const tg = nearest(me.x, me.z, 200); if (!tg) { const nz = st === 'r1' && doorOpen[1] ? -40 : st === 'r2' && doorOpen[2] ? -72 : null; if (nz != null) api.walkTo(0, nz); return; }
    const d = hyp(tg.x - me.x, tg.z - me.z) - tg.sc * .7; if (d > 3) api.walkTo(tg.x - (tg.x - me.x) / (d + 1) * 2.2, tg.z - (tg.z - me.z) / (d + 1) * 2.2); else { api.face(tg.x, tg.z); const a = api.attack(); if (a) hitMob(tg, a.dmg, a.crit); if (api.autoM() >= 1) for (let s = 3; s >= 0; s--) if (api.skillReady(s)) { api.cast(s); break; } api.autoPower(); } }
  const inPillar = (x, z, r) => PILLARS.some(([px, pz]) => hyp(px - x, pz - z) < r);
  return {
    sky: 'vault', camDist: () => (api.touch ? 26 : 21), spawn: { x: 0, z: 16, ry: Math.PI },
    bounds: { x0: -17, x1: 17, z0: -112, z1: 22 },
    walk: (x, z) => { const r = ROOMS.find(r => z <= r.z0 && z >= r.z1); if (!r || Math.abs(x) > r.x - .6) return false; for (let i = 0; i < 3; i++) if (!doorOpen[i] && Math.abs(z - DOORZ[i]) < .7) return false; if (inPillar(x, z, 1.4)) return false; return true; },
    onAuto() { const on = !api.auto(); api.setAuto(on); toast(on ? '🤖 자동사냥 시작!' : '🤖 자동사냥 멈춤'); },
    onKo() { setTimeout(fail, 300); },
    onSkill(s, dmg) { const RR = [6, 7, 10, 15][s] || 8, mul = [1.2, 2.2, 1.4, 2.6][s] || 1.5; mobs.forEach(m => { if (!m.dead && hyp(m.x - me.x, m.z - me.z) < RR + m.sc * .6) hitMob(m, Math.round(dmg * mul), false, true); }); spark(me.x, 1, me.z, 40 + RR * 4, [0xff7a1a, 0x41c9ff, 0x2fe07a, 0xffd76a][s], RR * .6, 2, .7, 1); },
    tick(dt, t, pm) {
      me = pm; tryAuto(dt);
      const near = nearest(pm.x, pm.z, 4.6); if (near) { const dx = pm.x - near.x, dz = pm.z - near.z, L = hyp(dx, dz) || 1, k = Math.min(L, near.sc * .7) / L; setInter('rz_hit', near.x + dx * k, near.z + dz * k, false); } else setInter('rz_hit', 0, -500, true);
      // 방 진행
      if (st === 'r1') { alarmT -= dt; if (alarmT <= 0) { alarmT = 7; const dr = alive('drone'); if (dr.length && alive('ant').length < 12) { dr.forEach(d => spawn('ant', d.x + (rnd() - .5) * 3, d.z + 2)); tapeNote('🚨 경보 드론이 증원을 불렀어요! 드론부터!', { ms: 1600 }); } } if (!alive().length) { setDoor(1, true); st = 'r1c'; tapeNote('① 진입로 돌파! 다음 문이 열렸어요', { ms: 2000 }); } }
      if (st === 'r1c' && pm.z < -34) enterRoom(2);
      if (st === 'r2' && !alive().length) { setDoor(2, true); st = 'r2c'; tapeNote('② 냉각실 돌파! 중앙 금고로…', { ms: 2000 }); }
      if (st === 'r2c' && pm.z < -68) enterRoom(3);
      // 보스
      if (st === 'boss' && boss && !boss.dead) {
        const B = boss, f = B.hp / B.max, dx = pm.x - B.x, dz = pm.z - B.z, d = hyp(dx, dz);
        if (f < .5 && !summoned[0] || f < .25 && !summoned[1]) { const i = summoned[0] ? 1 : 0; summoned[i] = true; for (let k = 0; k < 4; k++) spawn('add', B.x + Math.cos(k * 1.57) * 4, B.z + Math.sin(k * 1.57) * 4); for (let k = 0; k < 5; k++) hazard(-13 + rnd() * 26, -108 + rnd() * 40, 3, 1.6, .2, '바닥 붕괴'); tapeNote('📉 반대매매!! 졸개 소환 + 바닥이 무너져요 — 빨간 원에서 나와요!', { ms: 2600, cls: 'tip' }); api.quake(.5, .8); }
        if (f < .4 && !phase2) { phase2 = 1; tapeNote('④ 🔥 과열 단계! 바닥이 달아올라요 — ❄ 냉각 드론을 잡으면 체력 회복', { ms: 3000, cls: 'tip' }); }
        if (phase2) { heatT -= dt; if (heatT <= 0) { heatT = 4; for (let k = 0; k < 3; k++) hazard(pm.x + (rnd() - .5) * 8, pm.z + (rnd() - .5) * 8, 2.4, 1.2, .12, '과열'); } dronesT -= dt; if (dronesT <= 0) { dronesT = 10; spawn('cool', -12 + rnd() * 24, -72 - rnd() * 34); } }
        if (B.stun > 0) { B.stun -= dt; B.weak = B.stun; B.g.rotation.z = Math.sin(t * 20) * .05; if (B.stun <= 0) { B.weak = 0; B.st = 'walk'; B.cT = 6; } }
        else if (B.st === 'aim') { B.aT -= dt; if (B.aT <= 0) { B.st = 'dash'; B.dT = 1.3; group.remove(B.line); } }
        else if (B.st === 'dash') { B.dT -= dt; const sp = 22 * dt, nx = B.x + B.ux * sp, nz = B.z + B.uz * sp; if (inPillar(nx, nz, 2.3)) { B.st = 'stun'; B.stun = 4.5; api.quake(.6, .6); spark(B.x, 2, B.z, 120, 0xffd23a, 6, 4, 1, 2); tapeNote('💥 기둥에 박았어요! 약점 노출 — 지금 공격하면 3배!', { ms: 2200, cls: 'tip' }); }
          else if (Math.abs(nx) > 15.5 || nz > -66 || nz < -110 || B.dT <= 0) { B.st = 'walk'; B.cT = 6; } else { B.x = nx; B.z = nz; if (hyp(pm.x - B.x, pm.z - B.z) < 2.6 && !B.hitMe) { B.hitMe = 1; api.hurt(Math.round(api.hp().max * .25 * hard()), B.x, B.z, '👑 돌진'); } } }
        else { B.cT -= dt; if (d > 3) { B.x += dx / d * 2.2 * dt; B.z += dz / d * 2.2 * dt; } B.g.rotation.y = Math.atan2(dx, dz); B.atkT -= dt; if (d < 4 && B.atkT <= 0) { B.atkT = 1.6; api.hurt(Math.round(api.hp().max * .1 * hard()), B.x, B.z, '👑'); }
          if (B.cT <= 0) { B.st = 'aim'; B.aT = 1.1; B.hitMe = 0; const L = d || 1; B.ux = dx / L; B.uz = dz / L; B.g.rotation.y = Math.atan2(dx, dz); const ln = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 28), BASIC(0xff2a3a, { transparent: true, opacity: .35, side: THREE.DoubleSide })); ln.rotation.x = -Math.PI / 2; ln.rotation.z = -Math.atan2(B.ux, B.uz); ln.position.set(B.x + B.ux * 14, .07, B.z + B.uz * 14); group.add(ln); B.line = ln; } }
        B.g.position.set(B.x, 0, B.z); const glow = B.weak > 0; B.anim.forEach(([k, o]) => { if (k === 'vault') o.material = glow ? matOf(0xffe04a, 'g') : goldM; });
      }
      // 위험 지대
      hazards = hazards.filter(h => { h.t -= dt; h.o.material.opacity = .2 + .5 * (1 - h.t / h.d0); if (h.t <= 0) { if (hyp(pm.x - h.x, pm.z - h.z) < h.r) api.hurt(Math.round(api.hp().max * h.pct * hard()), h.x, h.z, h.label); spark(h.x, .5, h.z, 30, 0xff5a2a, 4, 4, .6, 1); group.remove(h.o); h.o.geometry.dispose(); return false; } return true; });
      // 일반 몬스터
      mobs.forEach(m => { if (m.dead || m.kind === 'boss') { if (!m.dead) { m.lab.position.set(m.x, m.h + .5, m.z); m.bg.position.set(m.x, m.h, m.z); m.fg.scale.x = Math.max(.001, m.fbw * m.hp / m.max); m.fg.position.set(m.x - m.fbw / 2, m.h + .001, m.z); } return; }
        const dx = pm.x - m.x, dz = pm.z - m.z, d = hyp(dx, dz);
        if (m.kind !== 'cool' && pm.z < 22 && d < 30) { const rng = m.kind === 'drone' ? 7 : 1.6; if (d > rng) { m.x += dx / d * m.spd * dt; m.z += dz / d * m.spd * dt; }
          m.atkT -= dt; if (m.pct && d < rng + .6 && m.atkT <= 0) { m.atkT = m.kind === 'drone' ? 2.4 : 1.8; api.hurt(Math.max(1, Math.round(api.hp().max * m.pct * hard())), m.x, m.z, m.kind === 'drone' ? '🚨' : ''); if (m.kind === 'drone') spark(m.x, 2.2, m.z, 8, 0xff3a5a, 6, 0, .4, 1); }
          if (m.kind === 'bug' && rnd() < dt * .5) { const gd = alive('guard'); gd.forEach(g => { g.hp = Math.min(g.max, g.hp + g.max * .04); }); } }
        m.g.rotation.y = Math.atan2(dx, dz); m.g.position.set(m.x, 0, m.z);
        m.anim.forEach(([k, o, a]) => { if (k === 'spin') o.rotation.y += dt * 14; else if (k === 'flap') o.rotation.z = (a || 1) * Math.sin(t * 16) * .5; });
        m.lab.position.set(m.x, m.h + .45, m.z); m.bg.position.set(m.x, m.h, m.z); m.fg.scale.x = Math.max(.001, m.fbw * m.hp / m.max); m.fg.position.set(m.x - m.fbw / 2, m.h + .001, m.z); });
      if (mobs.length > 40) mobs = mobs.filter(m => !m.dead);
      const sec = st === 'lobby' || st === 'done' ? 0 : Math.round((performance.now() - t0) / 1000);
      gauge(st === 'lobby' ? `🏦 지하금고 대기실 · 🔑 조각 ${V.sh} · 연습 ${V.p}회 · 표준 ${V.s}회 — 연습/표준 받침대에서 E` : st === 'done' ? `🏆 금고 탈환! · 🔑 조각 ${V.sh} — 교환소(대기실)에서 장비로` : st === 'boss' && boss ? `👑 마진콜 군주 ${Math.max(0, Math.round(boss.hp / boss.max * 100))}%${boss.weak > 0 ? ' · 💥 약점 노출!' : ''} · ${sec}초` : `🏦 ${mode === 's' ? '표준' : '연습'} · ${st.startsWith('r1') ? '① 진입로' : '② 냉각실'} · 남은 적 ${alive().length} · ${sec}초`, st === 'boss' && boss ? Math.round(boss.hp / boss.max * 100) : 100, '#ffc94a');
    },
    dbg: { st: () => ({ st, mode, n: alive().length, kinds: alive().map(m => m.kind), boss: boss && { hp: boss.hp, max: boss.max, st: boss.st, weak: boss.weak }, V: Object.assign({}, V), doors: doorOpen.slice(), hz: hazards.length, me }), start, killAll: () => alive().forEach(m => m.kind !== 'boss' && kill(m)), boss: () => boss, hit: (f) => boss && hitMob(boss, Math.round(boss.max * f)), enter: enterRoom },
    dispose() { clearMobs(); const P = document.getElementById('vaultShop'); if (P) P.remove(); }
  };
};
