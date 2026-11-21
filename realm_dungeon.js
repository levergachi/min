/* 🏰 던전 「폭락의 지하 묘지」 — 혼자 도전하는 웨이브 4 + 보스 · 인스턴스(각자 따로)
   build(api) → { bounds, walk, spawn, tick(dt,t,me), sky, onSkill, onKo, dbg, dispose }  좌표는 세계 안 로컬(원형 반경 15) */
(window.WB_REALMS = window.WB_REALMS || {}).dungeon = function (api) {
  const { THREE, group, GEO, mesh, M, sign, addInter, toast, tapeNote, gauge, LS, kstDate, givePts, growCoin, addCoin, G, floatW, spark, saveG, dropItem, leave, camera } = api;
  const add = o => { group.add(o); return o; };
  const R = 15.2, hyp = Math.hypot;
  const BASIC = (c, o) => new THREE.MeshBasicMaterial(Object.assign({ color: c, fog: false }, o || {}));
  // ── 바닥·벽·기둥
  const FLOOR = M(0x1d151c, { roughness: .9, emissive: 0x0a0408 }), WALL = M(0x2a1c26, { roughness: .85, emissive: 0x120810 });
  add(mesh(GEO.cyl, FLOOR, [R + .5, .5, R + .5], [0, -.25, 0]));
  { const ring = (r, w, c, op) => { const m = new THREE.Mesh(new THREE.RingGeometry(r - w, r, 72), BASIC(c, { transparent: true, opacity: op, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; m.position.y = .08; return add(m); };
    ring(R - .5, .3, 0xff4a3a, .7); ring(11, .12, 0x9a2a3a, .6); ring(6.5, .12, 0x9a2a3a, .6); ring(2.6, .1, 0xffa03a, .7); }
  // 바닥 룬 (12개)
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const r = mesh(GEO.box, BASIC(0xff5a3a, { transparent: true, opacity: .75 }), [.5, .04, 1.4], [Math.cos(a) * 8.8, .1, Math.sin(a) * 8.8]); r.rotation.y = -a; add(r); }
  // 벽(둘레 낮은 돌담) + 출입구(남쪽)
  const flames = [], PILL = [];
  for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, x = Math.cos(a) * (R - .1), z = Math.sin(a) * (R - .1); if (z > 10 && Math.abs(x) < 3.2) continue; add(mesh(GEO.box, WALL, [1.7, 1.6 + (i % 3) * .5, .9], [x, .8, z])).rotation.y = -a + Math.PI / 2; }
  for (let i = 0; i < 8; i++) { const a = (i + .5) / 8 * Math.PI * 2, x = Math.cos(a) * 11.5, z = Math.sin(a) * 11.5; PILL.push([x, z]);
    add(mesh(GEO.cyl, WALL, [.7, 3.0, .7], [x, 1.5, z])); add(mesh(GEO.cyl, WALL, [1.0, .35, 1.0], [x, 3.1, z]));
    const f = add(mesh(GEO.sph, BASIC(0xff8a2a), [.45, .7, .45], [x, 3.7, z])); flames.push(f); add(mesh(GEO.sph, BASIC(0xff5a1a, { transparent: true, opacity: .2, depthWrite: false }), [1.4, 1.6, 1.4], [x, 3.7, z])); }
  // 출입문 (남쪽)
  [-1, 1].forEach(s => add(mesh(GEO.box, WALL, [.7, 3.6, .7], [s * 2.4, 1.8, R - .5]))); add(mesh(GEO.box, WALL, [5.5, .6, .8], [0, 3.7, R - .5]));
  add(mesh(GEO.box, BASIC(0xff6a3a, { transparent: true, opacity: .35, side: THREE.DoubleSide, depthWrite: false }), [4.1, 3.3, .05], [0, 1.7, R - .5]));
  add(sign('🚪 나가기', 3.4, .8, '#ffe1d9', '#c0394b')).position.set(0, 4.6, R - .5);
  // 도전 제단
  const ALT = { x: 0, z: 6.2 };
  add(mesh(GEO.cyl, WALL, [1.7, .5, 1.7], [ALT.x, .25, ALT.z])); add(mesh(GEO.cyl, BASIC(0xffb04a), [1.3, .08, 1.3], [ALT.x, .52, ALT.z]));
  const orbM = BASIC(0xff7a3a); const orb = add(mesh(GEO.sph, orbM, [.55, .55, .55], [ALT.x, 1.6, ALT.z]));
  add(sign('⚔ 도전 시작', 3.4, .8, '#fff0d0', '#d9622a')).position.set(ALT.x, 3.1, ALT.z);
  // 기록비
  const REC = { x: -9.5, z: 8 };
  add(mesh(GEO.box, WALL, [1.8, 2.8, .5], [REC.x, 1.4, REC.z])); add(mesh(GEO.box, BASIC(0xffb04a), [1.5, 2.5, .06], [REC.x, 1.4, REC.z + .28]));
  add(sign('🏆 던전 기록', 3.6, .8, '#fff0d0', '#d9622a')).position.set(REC.x, 3.6, REC.z);
  // 반짝 먼지(불씨)
  const embers = (() => { const N = 90, p = new Float32Array(N * 3); let s = 5; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < N; i++) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * (R - 1); p.set([Math.cos(a) * r, .3 + rnd() * 6, Math.sin(a) * r], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); const pt = new THREE.Points(g, new THREE.PointsMaterial({ size: 3, sizeAttenuation: false, color: 0xff9a4a, transparent: true, opacity: .8, fog: false, depthWrite: false })); pt.frustumCulled = false; return add(pt); })();

  // ── 저장
  const S = LS.get('lv3d_dng', null) || { d: '', cl: 0, tot: 0, best: 0, maxW: 0, title: 0 }; if (S.d !== kstDate()) { S.d = kstDate(); S.cl = 0; } const save = () => LS.set('lv3d_dng', S);
  const DAILY_CLEARS = 3;
  // ── 적 정의
  const TYPES = {
    imp:   { nm: '도깨비', hp: 3, sp: 3.5, dmg: .05, r: .7, atkR: 1.5, cd: 1.1, col: 0xd0402f, em: 0x500a08, sc: .85 },
    brute: { nm: '곰 짐승', hp: 9, sp: 2.0, dmg: .09, r: 1.2, atkR: 2.1, cd: 1.7, col: 0x6a3a8a, em: 0x1a0a30, sc: 1.4 },
    mage:  { nm: '하락 마법사', hp: 4, sp: 2.2, dmg: .07, r: .8, atkR: 9, cd: 2.4, col: 0x2a6a9a, em: 0x0a2a4a, sc: 1.0, ranged: true },
    boss:  { nm: '폭락 대마왕', hp: 150, sp: 1.5, dmg: .1, r: 2.6, atkR: 3.6, cd: 1.3, col: 0x241018, em: 0x6a0a1a, sc: 3.0, boss: true }
  };
  const WAVES = [['imp', 'imp', 'imp', 'imp'], ['imp', 'imp', 'imp', 'brute', 'brute'], ['mage', 'mage', 'imp', 'imp', 'imp', 'imp'], ['brute', 'brute', 'mage', 'mage', 'imp', 'imp', 'imp', 'imp'], ['boss']];
  const mobs = [], proj = [], tele = []; let phase = 'lobby', wave = 0, lives = 3, t0 = 0, runMs = 0, countdown = 0, unit = 100, bossT = 2.5, bossStage = 0, ringSh = null, healed = false;
  const mkBody = (k) => { const T = TYPES[k], g = new THREE.Group(); g.scale.setScalar(T.sc);
    const bm = M(T.col, { roughness: .7, emissive: T.em, emissiveIntensity: .8 }); const body = new THREE.Mesh(GEO.sph, bm); body.scale.set(.8, .9, .8); body.position.y = .9; g.add(body);
    const eyeM = BASIC(k === 'mage' ? 0x9ae8ff : 0xffe04a); [-.28, .28].forEach(s => { const e = new THREE.Mesh(GEO.sph, eyeM); e.scale.setScalar(.13); e.position.set(s, 1.1, .62); g.add(e); });
    if (k === 'imp' || k === 'brute' || k === 'boss') [-.45, .45].forEach(s => { const h = new THREE.Mesh(GEO.cone, M(0xe8d9b0, { roughness: .6 })); h.scale.set(.18, .5, .18); h.position.set(s, 1.75, 0); h.rotation.z = -s * .6; g.add(h); });
    if (k === 'brute') [-.8, .8].forEach(s => { const sp = new THREE.Mesh(GEO.cone, M(0x3a2a4a)); sp.scale.set(.25, .6, .25); sp.position.set(s, 1.5, 0); sp.rotation.z = -s * 1.0; g.add(sp); });
    if (k === 'mage') { const c = new THREE.Mesh(GEO.cone, M(0x1a3a5a)); c.scale.set(.8, 1.5, .8); c.position.y = .75; g.add(c); const st = new THREE.Mesh(GEO.sph, BASIC(0x7ad8ff)); st.scale.setScalar(.22); st.position.set(.7, 1.6, .2); g.add(st); }
    if (k === 'boss') { for (let i = 0; i < 7; i++) { const a = (i / 7 - .5) * 2.4, c = new THREE.Mesh(GEO.cone, M(0x3a0a1a, { emissive: 0x8a0a1a, emissiveIntensity: .6 })); c.scale.set(.16, .6, .16); c.position.set(Math.sin(a) * .8, 1.9 + Math.cos(a) * .15, -.1); c.rotation.z = -a * .6; g.add(c); }
      const core = new THREE.Mesh(GEO.sph, BASIC(0xff2a3a)); core.scale.setScalar(.22); core.position.set(0, .75, .7); g.add(core); }
    return { g, bm }; };
  const mkBar = (w) => { const bg = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x120608, fog: false, depthTest: false, transparent: true, opacity: .85 })), fg = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xff4a4a, fog: false, depthTest: false, transparent: true }));
    bg.scale.set(w + .06, .26, 1); fg.scale.set(w, .18, 1); fg.center.set(0, .5); bg.renderOrder = 998; fg.renderOrder = 999; return { bg, fg, w }; };
  const spawnMob = (k, x, z) => { const T = TYPES[k], { g, bm } = mkBody(k), hpMax = Math.round(unit * T.hp * (T.boss ? 1 : 1)); g.position.set(x, 0, z); group.add(g);
    const bar = mkBar(T.boss ? 4 : 1.5); bar.bg.position.set(x, (T.boss ? 7.4 : 2.9 * T.sc / 1.2), z); bar.fg.position.set(x - bar.w / 2, bar.bg.position.y + .001, z); group.add(bar.bg, bar.fg);
    const m = { k, T, g, bm, bar, x, z, hp: hpMax, max: hpMax, atkT: T.cd * Math.random(), wind: 0, flash: 0, kx: 0, kz: 0, dead: 0, shotT: 1 + Math.random() * 1.5 }; mobs.push(m); return m; };
  const killMob = m => { m.dead = 1; group.remove(m.g, m.bar.bg, m.bar.fg); m.g.traverse(o => { if (o.isMesh && o.geometry && !Object.values(GEO).includes(o.geometry)) o.geometry.dispose(); }); m.bar.bg.material.dispose(); m.bar.fg.material.dispose(); spark(m.x, 1.2, m.z, m.T.boss ? 80 : 16, m.T.boss ? 0xff4a3a : 0xffd76a); };
  const barUpdate = m => { const f = Math.max(0, m.hp / m.max); m.bar.fg.scale.x = Math.max(.001, m.bar.w * f); m.bar.fg.position.x = m.x - m.bar.w / 2; m.bar.bg.position.x = m.x; m.bar.bg.position.z = m.bar.fg.position.z = m.z; };
  const alive = () => mobs.filter(m => !m.dead);
  const nearest = (x, z, maxD) => { let b = null, bd = maxD; alive().forEach(m => { const d = hyp(m.x - x, m.z - z) - m.T.r; if (d < bd) { bd = d; b = m; } }); return b; };
  const dmgMob = (m, d, crit) => { if (m.dead || phase !== 'run') return; m.hp -= d; m.flash = .12; const dx = m.x - me.x, dz = m.z - me.z, L = hyp(dx, dz) || 1; if (!m.T.boss) { m.kx += dx / L * 4; m.kz += dz / L * 4; }
    floatW(m.x, 2.4 * m.T.sc / 1.3 + .6, m.z, (crit ? '💥' : '') + d.toLocaleString(), crit ? 'crit' : 'txt'); spark(m.x, 1.3, m.z, crit ? 12 : 6, crit ? 0xffe04a : 0xff8a5a); try { api.snd && api.snd('punch'); } catch (e) {}
    if (m.hp <= 0) { killMob(m); if (m.T.boss) { clearRun(); } else checkWave(); } };
  let me = { x: 0, z: 10, y: 0 };
  // ── 진행
  const say = (t, ms) => tapeNote(t, { ms: ms || 2600, cls: 'tip' });
  const startWave = () => { const list = WAVES[wave]; unit = Math.max(20, api.unit()); healed = false; list.forEach((k, i) => { const a = i / list.length * 6.28 + Math.random() * .5, r = k === 'boss' ? 0 : 9 + Math.random() * 2; spawnMob(k, Math.cos(a) * r, Math.sin(a) * r - 2); });
    bossT = 2.5; bossStage = 0; say(wave === 4 ? '👹 보스 「폭락 대마왕」 등장! 장판은 피하고, 충격파는 점프로!' : `⚔ 웨이브 ${wave + 1}/${WAVES.length} 시작! (${list.length}마리)`, 2800); };
  const checkWave = () => { if (alive().length) return; if (wave >= WAVES.length - 1) return; const g = givePts(30 + wave * 10, .05); wave++; S.maxW = Math.max(S.maxW, wave); save(); api.heal(Math.round(api.hp().max * .4)); say(`✅ 웨이브 클리어! 공덕 +${g} · 체력 회복 · 다음 웨이브 준비…`, 2600); countdown = 3.2; };
  const startRun = () => { if (phase === 'run' || countdown > 0) { toast('이미 도전 중이에요!'); return; } if (api.hp().ko) return; mobs.slice().forEach(killMob); mobs.length = 0; proj.forEach(p => group.remove(p.m)); proj.length = 0; tele.forEach(t => group.remove(t.m)); tele.length = 0; if (ringSh) { group.remove(ringSh.m); ringSh = null; }
    phase = 'run'; wave = 0; lives = 3; t0 = performance.now(); countdown = 3.2; api.heal(api.hp().max); say('🏰 던전 도전 시작! 목숨 3개 — 3초 뒤 첫 웨이브', 2800); };
  const failRun = () => { phase = 'lobby'; countdown = 0; mobs.slice().forEach(killMob); mobs.length = 0; proj.forEach(p => group.remove(p.m)); proj.length = 0; tele.forEach(t => group.remove(t.m)); tele.length = 0; if (ringSh) { group.remove(ringSh.m); ringSh = null; }
    say(`💀 던전 실패… (웨이브 ${wave + 1}에서 쓰러짐) 제단에서 다시 도전할 수 있어요`, 3600); };
  const clearRun = () => { phase = 'win'; runMs = Math.round(performance.now() - t0); mobs.slice().forEach(m => { if (!m.dead) killMob(m); }); mobs.length = 0; tele.forEach(t => group.remove(t.m)); tele.length = 0; if (ringSh) { group.remove(ringSh.m); ringSh = null; }
    S.tot++; S.maxW = WAVES.length; if (!S.best || runMs < S.best) S.best = runMs; const paid = S.cl < DAILY_CLEARS; S.cl++;
    if (paid) { const g = givePts(220, .3); addCoin(growCoin(600), '던전 클리어'); dropItem(3); api.fx.firework(); say(`🏆 던전 클리어! ${(runMs / 1000).toFixed(1)}초 · 공덕 +${g} · 장비 상자! (오늘 ${S.cl}/${DAILY_CLEARS})`, 4200); }
    else say(`🏆 던전 클리어! ${(runMs / 1000).toFixed(1)}초 (오늘 보상 ${DAILY_CLEARS}번은 모두 받았어요)`, 4200);
    if (!S.title) { S.title = 1; G.title = '던전 정복자'; saveG(); dropItem(5); toast('🏅 한정 칭호 「던전 정복자」 + 전설 상자!'); }
    save(); setTimeout(() => { if (phase === 'win') phase = 'lobby'; }, 1500); };
  // ── 상호작용
  addInter('rz_start', { name: '⚔ 던전 도전', X: ALT.x, Z: ALT.z + 2.4, h: 2.8, btn: '⚔<br>도전', fn: () => startRun() });
  addInter('rz_rec', { name: '🏆 기록 보기', X: REC.x + 2, Z: REC.z + 1.2, h: 2.8, btn: '🏆<br>기록', fn: () => toast(`🏆 최고 ${S.best ? (S.best / 1000).toFixed(1) + '초' : '기록 없음'} · 클리어 ${S.tot}번 · 오늘 ${S.cl}/${DAILY_CLEARS}`) });
  addInter('rz_out', { name: '🚪 나가기', X: 0, Z: R - 2.6, h: 2.6, btn: '🚪<br>나가기', fn: () => leave() });
  addInter('rz_hit', { name: '⚔ 공격', X: 0, Z: -40, h: 2.2, btn: '⚔<br>공격', fn: () => { if (phase !== 'run') return; const m = nearest(me.x, me.z, 3.4); if (!m) { toast('⚔ 가까이 다가가요!'); return; } const a = api.attack(); if (a) dmgMob(m, a.dmg, a.crit); } });

  const hurtMe = (pct, x, z, why) => api.hurt(Math.max(1, Math.round(api.hp().max * pct)), x, z, why);
  const mkTele = (x, z, r, delay, dmgPct) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 40), BASIC(0xff2a2a, { transparent: true, opacity: .25, side: THREE.DoubleSide, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.set(x, .14, z); group.add(m); tele.push({ m, x, z, r, t: delay, d: delay, pct: dmgPct }); };
  const mkProj = (x, z, tx, tz, pct) => { const m = new THREE.Mesh(GEO.sph, BASIC(0x7ad8ff)); m.scale.setScalar(.35); m.position.set(x, 1.2, z); group.add(m); const L = hyp(tx - x, tz - z) || 1; proj.push({ m, x, z, vx: (tx - x) / L * 7.5, vz: (tz - z) / L * 7.5, life: 3, pct }); };

  return {
    sky: 'dungeon', camDist: () => (api.touch ? 32 : 27),
    bounds: { x0: -R + .8, x1: R - .8, z0: -R + .8, z1: R - .8 }, spawn: { x: 0, z: 11, ry: Math.PI },
    walk: (x, z) => { if (hyp(x, z) > R - .9) return false; for (const p of PILL) if (hyp(x - p[0], z - p[1]) < 1.1) return false; if (hyp(x - ALT.x, z - ALT.z) < 1.5) return false; if (x > REC.x - 1 && x < REC.x + 1 && z > REC.z - .5 && z < REC.z + .5) return false; return true; },
    onSkill(s, dmg) { if (phase !== 'run') { toast('⚔ 던전에 도전 중일 때만 스킬이 나가요'); return; } const hit = m => dmgMob(m, dmg, true); if (s === 2) alive().filter(m => hyp(m.x - me.x, m.z - me.z) < 11).forEach(hit); else { const m = nearest(me.x, me.z, 11); if (m) hit(m); } api.quake(.25, .25); },
    onKo() { if (phase !== 'run') return; lives--; if (lives <= 0) { setTimeout(failRun, 300); } else say(`😵 쓰러졌어요! 남은 목숨 ${lives}개 — 입구에서 부활해요`, 2800); },
    tick(dt, t, pm) {
      me = pm; embers.material.opacity = .6 + Math.sin(t * 3) * .25; embers.rotation.y += dt * .03; flames.forEach((f, i) => { f.scale.set(.5 + Math.sin(t * 9 + i) * .08, .8 + Math.sin(t * 7 + i * 2) * .15, .5); }); orb.position.y = 1.6 + Math.sin(t * 2) * .15; orb.rotation.y += dt;
      const hp = api.hp();
      if (phase === 'run') {
        if (countdown > 0) { countdown -= dt; if (countdown <= 0) startWave(); }
        else if (!hp.ko) {
          // 공격 대상 안내
          const nm = nearest(pm.x, pm.z, 40); if (nm) { const dx = pm.x - nm.x, dz = pm.z - nm.z, L = hyp(dx, dz) || 1, k = Math.min(L, nm.T.r * .8) / L; api.setInter('rz_hit', nm.x + dx * k, nm.z + dz * k, false); } else api.setInter('rz_hit', 0, -40, true);
          // 적 AI
          const arr = alive();
          arr.forEach(m => { const T = m.T; if (m.flash > 0) { m.flash -= dt; m.bm.emissiveIntensity = 3; } else m.bm.emissiveIntensity = .8;
            m.x += m.kx * dt; m.z += m.kz * dt; m.kx *= Math.max(0, 1 - dt * 9); m.kz *= Math.max(0, 1 - dt * 9);
            const dx = pm.x - m.x, dz = pm.z - m.z, d = hyp(dx, dz) || 1; const stopD = T.ranged ? 7 : T.atkR * .72; let mv = 0; m.g.rotation.y = Math.atan2(dx, dz);
            if (m.wind > 0) { m.wind -= dt; m.g.scale.setScalar(T.sc * (1 + .18 * Math.sin((1 - m.wind / .5) * Math.PI))); if (m.wind <= 0) { m.g.scale.setScalar(T.sc); if (!T.ranged && hyp(pm.x - m.x, pm.z - m.z) < T.atkR + .6) hurtMe(T.dmg, m.x, m.z, ''); } }
            else { if (T.ranged) { if (d > stopD + 1) mv = 1; else if (d < stopD - 2) mv = -1; } else if (d > stopD) mv = 1;
              if (mv) { m.x += dx / d * T.sp * mv * dt; m.z += dz / d * T.sp * mv * dt; }
              m.atkT -= dt; if (!T.boss && m.atkT <= 0 && ((!T.ranged && d <= T.atkR) || (T.ranged && d <= T.atkR + 2))) { m.atkT = T.cd; if (T.ranged) { mkProj(m.x, m.z, pm.x, pm.z, T.dmg); } else m.wind = .5; }
              if (T.boss && m.atkT <= 0 && d <= T.atkR + 1) { m.atkT = T.cd; m.wind = .5; } }
            m.g.position.set(m.x, 0, m.z); });
          // 분리
          for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) { const a = arr[i], b = arr[j], dx = b.x - a.x, dz = b.z - a.z, d = hyp(dx, dz) || .01, mn = a.T.r + b.T.r; if (d < mn) { const p = (mn - d) / 2; a.x -= dx / d * p; a.z -= dz / d * p; b.x += dx / d * p; b.z += dz / d * p; } }
          arr.forEach(m => { const d = hyp(m.x, m.z); if (d > R - 1.6) { m.x *= (R - 1.6) / d; m.z *= (R - 1.6) / d; } m.g.position.set(m.x, 0, m.z); barUpdate(m); });
          // 보스 패턴
          const B = arr.find(m => m.T.boss); if (B) { bossT -= dt * (B.hp < B.max * .25 ? 1.5 : 1); if (bossT <= 0) { bossStage++; const pat = bossStage % 3;
              if (pat === 1) { mkTele(pm.x, pm.z, 3.4, 1.3, .22); if (B.hp < B.max * .5) mkTele(pm.x + (Math.random() * 8 - 4), pm.z + (Math.random() * 8 - 4), 3.2, 1.5, .22); say('🔴 붉은 장판! 벗어나요!', 1400); bossT = 2.6; }
              else if (pat === 2) { if (!ringSh) { ringSh = { m: new THREE.Mesh(new THREE.RingGeometry(.94, 1, 72), BASIC(0xffd24a, { transparent: true, opacity: .9, side: THREE.DoubleSide, depthWrite: false })), r: 1.5, x: B.x, z: B.z, hit: false }; ringSh.m.rotation.x = -Math.PI / 2; ringSh.m.position.set(B.x, .3, B.z); group.add(ringSh.m); say('⚡ 충격파! 점프로 넘어요!', 1800); } bossT = 3.4; }
              else { const n = alive().filter(m => !m.T.boss).length; if (n < 4) { for (let i = 0; i < 2; i++) { const a = Math.random() * 6.28; spawnMob('imp', Math.cos(a) * 9, Math.sin(a) * 9); } say('😈 부하 도깨비 소환!', 1600); } bossT = 2.4; } } }
          // 장판
          for (let i = tele.length - 1; i >= 0; i--) { const e = tele[i]; e.t -= dt; e.m.material.opacity = .22 + .4 * (1 - e.t / e.d); if (e.t <= 0) { if (hyp(pm.x - e.x, pm.z - e.z) < e.r) hurtMe(e.pct, e.x, e.z, '장판'); spark(e.x, .5, e.z, 24, 0xff5a3a); api.quake(.3, .3); group.remove(e.m); e.m.geometry.dispose(); e.m.material.dispose(); tele.splice(i, 1); } }
          // 충격파
          if (ringSh) { ringSh.r += dt * 6; ringSh.m.scale.set(ringSh.r, ringSh.r, 1); ringSh.m.material.opacity = Math.max(0, 1 - ringSh.r / 17); if (!ringSh.hit && pm.y < 1.0 && Math.abs(hyp(pm.x - ringSh.x, pm.z - ringSh.z) - ringSh.r) < .9) { ringSh.hit = true; hurtMe(.18, ringSh.x, ringSh.z, '충격파'); } if (ringSh.r > 17) { group.remove(ringSh.m); ringSh.m.geometry.dispose(); ringSh.m.material.dispose(); ringSh = null; } }
          // 투사체
          for (let i = proj.length - 1; i >= 0; i--) { const p = proj[i]; p.x += p.vx * dt; p.z += p.vz * dt; p.life -= dt; p.m.position.set(p.x, 1.2, p.z); if (hyp(pm.x - p.x, pm.z - p.z) < .9 && pm.y < 1.6) { hurtMe(p.pct, p.x - p.vx, p.z - p.vz, ''); p.life = 0; } if (p.life <= 0 || hyp(p.x, p.z) > R) { group.remove(p.m); p.m.material.dispose(); proj.splice(i, 1); } }
        }
      } else api.setInter('rz_hit', 0, -40, true);
      const left = alive().length;
      gauge(phase === 'run' ? (countdown > 0 ? `🏰 던전 · 곧 시작… ❤️×${lives}` : `🏰 던전 · 웨이브 ${wave + 1}/${WAVES.length} · 남은 적 ${left} · ❤️×${lives} · ${((performance.now() - t0) / 1000).toFixed(0)}초`) : `🏰 폭락의 지하 묘지 · 최고 ${S.best ? (S.best / 1000).toFixed(1) + '초' : '-'} · 오늘 ${S.cl}/${DAILY_CLEARS} · 제단에서 도전!`, phase === 'run' ? Math.round((wave + (WAVES[wave] ? 1 - left / WAVES[wave].length : 1)) / WAVES.length * 100) : 100, phase === 'run' ? '#ff4a3a' : '#d9622a');
    },
    dbg: { st: () => ({ phase, wave, lives, mobs: alive().length, hp: alive().map(m => [m.k, m.hp, m.max, +m.x.toFixed(1), +m.z.toFixed(1)]), countdown: +countdown.toFixed(1), unit, S, tele: tele.length, ring: !!ringSh }), start: () => startRun(), killAll: () => { alive().forEach(m => { m.hp = 1; }); }, hitAll: () => { alive().forEach(m => dmgMob(m, 1e9, true)); }, nextWave: () => { alive().forEach(m => dmgMob(m, 1e9, false)); }, bossNow: () => { bossT = 0; }, skip: () => { countdown = .01; }, hurt: pct => hurtMe(pct, 0, 0, 'test') },
    dispose() { group.traverse(o => { if ((o.isPoints || o.isLine) && o.geometry) { o.geometry.dispose(); o.material && o.material.dispose(); } if (o.isSprite) o.material.dispose(); }); }
  };
};
