/* 🤪 난장판 모드 (v71 · 옛 지하금고) — XP 1천만부터
   들어가면 3초 뒤 바로 시작 · 웨이브마다 더 많이·더 세게 좀비처럼 몰려와요 · 3웨이브마다 🗿 레이드 거인 · 5웨이브마다 👑 마진콜 군주
   쓰러지면 끝 → 결과(웨이브·처치·XP) · 처치할 때마다 XP·코인 · 거인/군주는 🔑 조각 + 장비 · 교환소에서 SS·SSS */
(window.WB_REALMS = window.WB_REALMS || {}).vault = function (api) {
  const { THREE, group, GEO, mesh, M, sign, addInter, setInter, toast, tapeNote, gauge, G, saveG, addCoin, floatW, spark, leave, dropItem } = api;
  const hyp = Math.hypot, rnd = Math.random, add = o => { group.add(o); return o; }, R = 30;
  const BASIC = (c, o) => new THREE.MeshBasicMaterial(Object.assign({ color: c, fog: false }, o || {}));
  const fmtN = n => n >= 1e12 ? (n / 1e12).toFixed(1) + '조' : n >= 1e8 ? (n / 1e8).toFixed(1) + '억' : n >= 1e4 ? (n / 1e4).toFixed(1) + '만' : Math.round(n).toLocaleString();
  const V = G.vault || (G.vault = { sh: 0, best: 0, bk: 0 }); if (V.best == null) V.best = 0;
  add(mesh(GEO.cyl, M(0x1a1420, { roughness: .6, metalness: .4 }), [R + 2, .4, R + 2], [0, -.2, 0]));
  [[R - .3, 0xff2a6a], [R * .66, 0xffc94a], [R * .33, 0x41c9ff]].forEach(([r, c]) => { const l = new THREE.Mesh(new THREE.RingGeometry(r - .2, r + .2, 96), BASIC(c, { transparent: true, opacity: .6, side: THREE.DoubleSide })); l.rotation.x = -Math.PI / 2; l.position.y = .03; add(l); });
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; add(mesh(GEO.cyl, M(i % 2 ? 0xff2a6a : 0xffc94a, { emissive: i % 2 ? 0x6a0020 : 0x6a4a00, metalness: .6 }), [1.2, 6, 1.2], [Math.cos(a) * (R + 1.5), 3, Math.sin(a) * (R + 1.5)])); }
  add(sign('🤪 난장판 모드 — 끝까지 버텨요!!', 12, 1.3, '#fff', '#ff2a6a')).position.set(0, 9, -R - 1);
  const MC = {}, mat = c => MC[c] || (MC[c] = M(c, { roughness: .5, emissive: c, emissiveIntensity: .2 })), EYE = BASIC(0xffe04a), EYE2 = BASIC(0xff2a3a), GOLD = M(0xffc94a, { emissive: 0x6a4a00, metalness: .8, roughness: .3 });
  const part = (g, geo, m, s, p) => { const o = new THREE.Mesh(geo, m); o.scale.set(s[0], s[1], s[2]); o.position.set(p[0], p[1], p[2]); g.add(o); return o; };
  const KINDS = [
    { n: '💰 운반 개미', hp: 2, pct: .012, spd: 5.2, sc: 1, shape: 'ant', c: 0x8a5a2b }, { n: '🧟 물린개미 좀비', hp: 3, pct: .016, spd: 4.2, sc: 1.1, shape: 'blob', c: 0x6a9a4a },
    { n: '🚨 경보 드론', hp: 2, pct: .012, spd: 6, sc: .9, shape: 'orb', c: 0xff3a5a }, { n: '📉 반대매매 졸개', hp: 3, pct: .018, spd: 4.8, sc: 1, shape: 'ant', c: 0x3a3a48 },
    { n: '🛡 방패 경비병', hp: 7, pct: .025, spd: 3.2, sc: 1.3, shape: 'box', c: 0x4a5568 }, { n: '🦇 역배 박쥐', hp: 2, pct: .014, spd: 6.5, sc: .9, shape: 'orb', c: 0x4a3a5a },
    { n: '🐺 청산 늑대', hp: 4, pct: .02, spd: 6, sc: 1.1, shape: 'box', c: 0x5a6a7a }, { n: '👻 데드캣 망령', hp: 3, pct: .02, spd: 4.5, sc: 1.1, shape: 'blob', c: 0xffb0d0 }];
  const BIG = [{ n: '🗿 레이드 거인', hp: 60, pct: .08, spd: 2.6, sc: 2.6, shape: 'box', c: 0x7a6a5a, big: 1 }, { n: '🌋 폭락 운석괴', hp: 70, pct: .09, spd: 2.4, sc: 2.8, shape: 'blob', c: 0xff6a2a, big: 1 }, { n: '🐉 서킷브레이커 기계룡', hp: 80, pct: .1, spd: 3, sc: 2.6, shape: 'box', c: 0xc8d0dc, big: 1 }];
  const BOSS = { n: '👑 마진콜 군주', hp: 260, pct: .14, spd: 2.8, sc: 3.4, shape: 'boss', c: 0x3a0a14, boss: 1 };
  function body(K) { const g = new THREE.Group(), m = mat(K.c);
    if (K.shape === 'ant') { part(g, GEO.sph, m, [.5, .4, .7], [0, .5, 0]); part(g, GEO.sph, m, [.36, .36, .36], [0, .62, .6]); part(g, GEO.sph, EYE, [.08, .08, .08], [0, .72, .92]); }
    else if (K.shape === 'blob') { part(g, GEO.sph, m, [.8, .7, .8], [0, .7, 0]); part(g, GEO.sph, EYE2, [.12, .12, .12], [0, .95, .7]); }
    else if (K.shape === 'orb') { part(g, GEO.sph, m, [.5, .4, .5], [0, 1.8, 0]); part(g, GEO.sph, EYE2, [.13, .13, .13], [0, 1.8, .42]); }
    else if (K.shape === 'boss') { part(g, GEO.box, m, [1.5, 1.6, 1.1], [0, 1.4, 0]); part(g, GEO.box, m, [.9, .8, .8], [0, 2.6, .1]); part(g, GEO.cone, GOLD, [.6, .6, .6], [0, 3.4, .1]); part(g, GEO.sph, EYE2, [.15, .15, .15], [0, 2.65, .52]); }
    else { part(g, GEO.box, m, [1, 1.3, .8], [0, 1.0, 0]); part(g, GEO.box, m, [.6, .5, .55], [0, 1.95, .1]); part(g, GEO.sph, EYE, [.1, .1, .1], [0, 2.0, .4]); }
    return g; }
  function nameTex(txt, col) { const c = document.createElement('canvas'); c.width = 320; c.height = 56; const x = c.getContext('2d'); x.font = '800 30px "Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 6; x.strokeStyle = 'rgba(0,0,0,.85)'; x.strokeText(txt, 160, 30); x.fillStyle = col; x.fillText(txt, 160, 30); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
  const sprite = (map, w, h, col) => { const s = new THREE.Sprite(new THREE.SpriteMaterial(Object.assign(map ? { map } : { color: col }, { fog: false, depthTest: false, transparent: true }))); s.scale.set(w, h, 1); s.renderOrder = 999; return s; };
  let mobs = [], st = 'cd', cdT = 3, wave = 0, waveT = 0, kills = 0, xpRun = 0, t0 = 0, me = { x: 0, z: 0 };
  const unit = () => Math.max(1, api.unit());
  function spawnOne(K, mul) {
    const a = rnd() * 6.283, x = Math.cos(a) * (R - 1.5), z = Math.sin(a) * (R - 1.5), g = body(K); g.scale.setScalar(K.sc); g.position.set(x, 0, z); group.add(g);
    const hp = Math.round(unit() * K.hp * mul), m = { K, x, z, g, hp, max: hp, atkT: rnd(), dead: 0, h: (K.shape === 'orb' ? 2.4 : K.shape === 'ant' ? 1.1 : 2.4) * K.sc };
    if (K.big || K.boss) { m.lab = sprite(nameTex(K.n, K.boss ? '#ffd23a' : '#ffb38a'), 5, .9); m.bg = sprite(null, 4, .22, 0x200810); m.fg = sprite(null, 3.9, .15, K.boss ? 0xffd23a : 0xff7a3a); m.fg.center.set(0, .5); group.add(m.lab, m.bg, m.fg); }
    mobs.push(m); return m; }
  function nextWave() {
    wave++; const mul = 1.6 + wave * .45, n = Math.max(0, Math.min(70 - mobs.filter(m => !m.dead).length, 10 + wave * 4));
    for (let i = 0; i < n; i++) spawnOne(KINDS[Math.floor(rnd() * Math.min(KINDS.length, 3 + wave))], mul);
    if (wave % 3 === 0) for (let i = 0; i < Math.min(4, Math.ceil(wave / 3)); i++) spawnOne(BIG[Math.floor(rnd() * BIG.length)], mul * .8);
    if (wave % 5 === 0) { spawnOne(BOSS, mul * .8); api.quake(.6, 1); tapeNote(`👑 마진콜 군주 등장!! (웨이브 ${wave})`, { ms: 2400, cls: 'tip' }); }
    else tapeNote(`🤪 웨이브 ${wave}! ${n}마리 몰려와요${wave % 3 === 0 ? ' · 🗿 거인 등장' : ''}`, { ms: 1600 });
    waveT = Math.max(5, 9 - wave * .2); }
  function free(m) { group.remove(m.g); if (m.lab) { group.remove(m.lab, m.bg, m.fg); try { m.lab.material.map.dispose(); [m.lab, m.bg, m.fg].forEach(s => s.material.dispose()); } catch (e) {} } }
  function hitMob(m, dmg, crit, big) { if (m.dead) return; m.hp -= dmg; if (m.K.big || m.K.boss || crit || big || rnd() < .25) floatW(m.x, m.h + .3, m.z, (big ? '💥' : crit ? '⚡' : '') + fmtN(dmg), big ? 'df' : crit ? 'dc' : 'dn'); if (rnd() < .5) spark(m.x, 1, m.z, crit || big ? 8 : 4, crit ? 0xffe04a : 0xffb38a, 4, 4, .4, 1); if (m.hp <= 0) kill(m); }
  function kill(m) { m.dead = 1; free(m); kills++; const gap = api.stepGap(), xp = Math.round(gap * (m.K.boss ? .06 : m.K.big ? .015 : .0012) * (1 + wave * .08)); api.addPts(xp); xpRun += xp; addCoin(Math.max(1, Math.round(xp / 40)), '난장판');
    if (m.K.big || m.K.boss) { spark(m.x, 2, m.z, m.K.boss ? 160 : 60, 0xffd23a, 6, 4, 1, 2); V.sh += m.K.boss ? 3 : 1; if (m.K.boss) V.bk = (V.bk || 0) + 1; saveG(); setTimeout(() => dropItem(20, m.K.boss ? (rnd() < .3 ? 8 : 7) : 6), 500); floatW(m.x, m.h + 1, m.z, `🔑 +${m.K.boss ? 3 : 1} · +${fmtN(xp)} XP`, 'dc'); } else if (rnd() < .004) setTimeout(() => dropItem(10, 6), 400); }
  function start() { mobs.forEach(m => { if (!m.dead) free(m); }); mobs = []; st = 'run'; wave = 0; kills = 0; xpRun = 0; t0 = performance.now(); nextWave(); api.heal(api.hp().max); }
  function end() { if (st !== 'run') return; st = 'over'; const sec = Math.round((performance.now() - t0) / 1000); if (wave > (V.best || 0)) V.best = wave; saveG();
    tapeNote(`💀 난장판 끝! 웨이브 ${wave} · 처치 ${kills} · ${sec}초 · XP +${fmtN(xpRun)} · 🔑 ${V.sh} (최고 웨이브 ${V.best})`, { ms: 7000, cls: 'tip' }); toast('🤪 다시 하려면 가운데 받침대에서 E'); }
  function shop() {
    let P = document.getElementById('vaultShop'); if (P) { P.remove(); return; } P = document.createElement('div'); P.id = 'vaultShop'; P.className = 'pe';
    P.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:60;background:rgba(20,8,14,.97);border:1px solid #ff2a6a;border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:7px;min-width:260px;color:#ffe3ec;font-size:13px';
    const b = document.createElement('b'); b.textContent = `🔑 교환소 · 조각 ${V.sh} · 최고 웨이브 ${V.best} · 군주 처치 ${V.bk || 0}`; P.appendChild(b);
    [[15, 'SS 확정 장비 (랜덤 칸)', () => api.grantItem(['h', 'f', 'n', 's', 'b', 'k', 'w', 'l', 't', 'o'][Math.floor(rnd() * 10)], 7)], [45, 'SSS 날개 🪽', () => api.grantItem('g', 8)], [75, 'SSS 휘장 🎖', () => api.grantItem('c', 8)]].forEach(([c, t, fn]) => {
      const x = document.createElement('button'); x.type = 'button'; x.className = 'gbtn' + (V.sh >= c ? ' hot' : ''); x.textContent = `🔑${c} → ${t}`; x.disabled = V.sh < c; x.onclick = () => { if (V.sh < c) return; if (fn()) { V.sh -= c; saveG(); } P.remove(); shop(); }; P.appendChild(x); });
    const cl = document.createElement('button'); cl.type = 'button'; cl.className = 'gbtn'; cl.textContent = '닫기'; cl.onclick = () => P.remove(); P.appendChild(cl); document.body.appendChild(P); }
  addInter('rz_vs', { name: '🤪 다시 난장판 (E)', X: 0, Z: 0, h: 2.4, btn: '🤪<br>다시', fn: () => { if (st === 'run') { toast('🤪 이미 난장판 중!'); return; } start(); } });
  addInter('rz_vx', { name: '🔑 교환소 (E)', X: 3.5, Z: 2, h: 2.4, btn: '🔑<br>교환', fn: shop });
  addInter('rz_exit', { name: '🚪 개미시티로 (E)', X: -3.5, Z: 2, h: 2.4, btn: '🚪<br>나가기', fn: () => leave() });
  const nearest = (x, z, md) => { let b = null, bd = md; for (const m of mobs) { if (m.dead) continue; const d = hyp(m.x - x, m.z - z) - m.K.sc * .6; if (d < bd) { bd = d; b = m; } } return b; };
  addInter('rz_hit', { name: '⚔ 공격', X: 0, Z: -500, h: 2.2, btn: '⚔<br>공격', fn: () => { const tg = nearest(me.x, me.z, 4.6); if (!tg) return; api.face(tg.x, tg.z); const a = api.attack(); if (a) hitMob(tg, a.dmg, a.crit); } });
  let autoT = 0;
  function tryAuto(dt) { if (!api.auto() || api.manual() || st !== 'run') return; autoT -= dt; if (autoT > 0) return; autoT = .2; const tg = nearest(me.x, me.z, 99); if (!tg) return; const d = hyp(tg.x - me.x, tg.z - me.z) - tg.K.sc * .6;
    if (d > 3) api.walkTo(tg.x - (tg.x - me.x) / (d + 1) * 2, tg.z - (tg.z - me.z) / (d + 1) * 2); else { api.face(tg.x, tg.z); const a = api.attack(); if (a) hitMob(tg, a.dmg, a.crit); if (api.autoM() >= 1) for (let s = 3; s >= 0; s--) if (api.skillReady(s)) { api.cast(s); break; } api.autoPower(); } }
  tapeNote('🤪 난장판 모드! 3초 뒤 시작 — 좀비처럼 몰려와요!!', { ms: 2600, cls: 'tip' });
  return {
    sky: 'vault', camDist: () => (api.touch ? 30 : 25), spawn: { x: 0, z: 4, ry: Math.PI },
    bounds: { x0: -R, x1: R, z0: -R, z1: R },
    walk: (x, z) => hyp(x, z) < R - .6,
    onAuto() { const on = !api.auto(); api.setAuto(on); toast(on ? '🤖 자동사냥 시작!' : '🤖 자동사냥 멈춤'); },
    onKo() { end(); },
    onSkill(s, dmg) { const RR = [6, 7, 10, 15][s] || 8, mul = [1.2, 2.2, 1.4, 2.6][s] || 1.5; for (const m of mobs) if (!m.dead && hyp(m.x - me.x, m.z - me.z) < RR + m.K.sc * .5) hitMob(m, Math.round(dmg * mul), false, true); spark(me.x, 1, me.z, 40 + RR * 4, [0xff7a1a, 0x41c9ff, 0x2fe07a, 0xffd76a][s], RR * .6, 2, .7, 1); },
    tick(dt, t, pm) {
      me = pm; if (st === 'cd') { cdT -= dt; if (cdT <= 0) start(); }
      if (st === 'run') { waveT -= dt; if (waveT <= 0 || mobs.filter(m => !m.dead).length < 6) nextWave(); }
      tryAuto(dt);
      const near = nearest(pm.x, pm.z, 4.6); if (near) { const dx = pm.x - near.x, dz = pm.z - near.z, L = hyp(dx, dz) || 1, k = Math.min(L, near.K.sc * .6) / L; setInter('rz_hit', near.x + dx * k, near.z + dz * k, false); } else setInter('rz_hit', 0, -500, true);
      for (const m of mobs) { if (m.dead) continue; const dx = pm.x - m.x, dz = pm.z - m.z, d = hyp(dx, dz), rng = .9 + m.K.sc * .7;
        if (st === 'run') { if (d > rng) { const sp = m.K.spd * dt; m.x += dx / d * sp; m.z += dz / d * sp; } m.atkT -= dt; if (d < rng + .5 && m.atkT <= 0) { m.atkT = m.K.boss ? 1.2 : m.K.big ? 1.5 : 1.1; api.hurt(Math.max(1, Math.round(api.hp().max * m.K.pct * (1 + wave * .03))), m.x, m.z, m.K.boss ? '👑' : m.K.big ? '🗿' : ''); } }
        m.g.position.set(m.x, m.K.shape === 'orb' ? Math.sin(t * 4 + m.x) * .2 : 0, m.z); m.g.rotation.y = Math.atan2(dx, dz);
        if (m.lab) { m.lab.position.set(m.x, m.h + .8, m.z); m.bg.position.set(m.x, m.h + .3, m.z); m.fg.scale.x = Math.max(.001, 3.9 * m.hp / m.max); m.fg.position.set(m.x - 1.95, m.h + .301, m.z); } }
      for (let i = 0; i < mobs.length; i += 2) { const a = mobs[i], b = mobs[(i + 7) % mobs.length]; if (!a || !b || a === b || a.dead || b.dead) continue; const dx = a.x - b.x, dz = a.z - b.z, d = hyp(dx, dz), r = (a.K.sc + b.K.sc) * .5; if (d < r && d > .01) { const k = (r - d) / d * .5; a.x += dx * k; a.z += dz * k; b.x -= dx * k; b.z -= dz * k; } }
      if (mobs.length > 80) mobs = mobs.filter(m => !m.dead);
      const alive = mobs.filter(m => !m.dead).length, sec = st === 'run' ? Math.round((performance.now() - t0) / 1000) : 0;
      gauge(st === 'cd' ? `🤪 난장판 모드 — ${Math.ceil(cdT)}초 뒤 시작!` : st === 'over' ? `💀 끝! 웨이브 ${wave} · 처치 ${kills} · XP +${fmtN(xpRun)} — 가운데에서 E로 다시` : `🤪 웨이브 ${wave} · 남은 몹 ${alive} · 처치 ${kills} · XP +${fmtN(xpRun)} · ${sec}초`, st === 'run' ? Math.min(100, alive) : 100, '#ff2a6a');
    },
    dbg: { st: () => ({ st, wave, kills, alive: mobs.filter(m => !m.dead).length, xpRun, V: Object.assign({}, V) }), start, killAll: () => mobs.forEach(m => !m.dead && kill(m)), wave: () => nextWave() },
    dispose() { mobs.forEach(m => { if (!m.dead) free(m); }); mobs = []; const P = document.getElementById('vaultShop'); if (P) P.remove(); }
  };
};
