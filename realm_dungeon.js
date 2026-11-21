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
  // 큰 수는 만/억으로 줄여서 (공격력이 99999를 넘어도 읽기 쉽게)
  const fmtN = n => n >= 1e8 ? (n / 1e8).toFixed(n >= 1e9 ? 1 : 2) + '억' : n >= 1e5 ? Math.round(n / 1e4) + '만' : Math.round(n).toLocaleString();
  // ── 적 정의 (hp 는 "내 공격 한 방 = 1" 기준 배수 — 공격력이 얼마든 같은 타수로 잡혀요)
  const TYPES = {
    imp:   { nm: '도깨비', hp: 2.5, sp: 3.5, dmg: .05, r: .7, atkR: 1.5, cd: 1.1, col: 0xd0402f, em: 0x500a08, sc: .85 },
    brute: { nm: '곰 짐승', hp: 7, sp: 2.0, dmg: .12, r: 1.2, atkR: 2.4, cd: 2.0, col: 0x6a3a8a, em: 0x1a0a30, sc: 1.4 },
    mage:  { nm: '하락 마법사', hp: 3.5, sp: 2.2, dmg: .07, r: .8, atkR: 9, cd: 2.4, col: 0x2a6a9a, em: 0x0a2a4a, sc: 1.0, ranged: true },
    boss:  { nm: '폭락 대마왕', hp: 110, sp: 1.5, dmg: .1, r: 2.6, atkR: 3.6, cd: 1.5, col: 0x241018, em: 0x6a0a1a, sc: 3.0, boss: true }
  };
  const WAVES = [['imp', 'imp', 'imp', 'imp'], ['imp', 'imp', 'imp', 'brute', 'brute'], ['mage', 'mage', 'imp', 'imp', 'imp', 'imp'], ['brute', 'brute', 'mage', 'mage', 'imp', 'imp', 'imp', 'imp'], ['boss']];
  // 보스 패턴 (체력 단계별)
  const PAT = [['circle', 'ring', 'summon', 'circle'], ['circle', 'charge', 'ring', 'meteor', 'summon'], ['meteor', 'charge', 'ring', 'circle2', 'charge']];
  const mobs = [], proj = [], tele = [], heals = [], fxs = [];
  let phase = 'lobby', wave = 0, lives = 3, t0 = 0, runMs = 0, countdown = 0, unit = 100, bossT = 2.5, bossStage = 0, ringSh = null, healed = false;
  let combo = 0, comboT = 0, cstep = 0, lastAtk = 0, rage = 0, frenzy = 0, hs = 0, slow = 0, jd = 0, dodgeAt = -9999, dodgeAuto = false, autoOn = false, autoUsed = false, autoT = 0, autoStart = 0, maxCombo = 0;
  let me = { x: 0, z: 10, y: 0, ry: 0 };
  const now = () => performance.now();
  const mkBody = (k) => { const T = TYPES[k], g = new THREE.Group(); g.scale.setScalar(T.sc);
    const bm = M(T.col, { roughness: .7, emissive: T.em, emissiveIntensity: .8 }); const body = new THREE.Mesh(GEO.sph, bm); body.scale.set(.8, .9, .8); body.position.y = .9; g.add(body);
    const eyeM = BASIC(k === 'mage' ? 0x9ae8ff : 0xffe04a); [-.28, .28].forEach(s => { const e = new THREE.Mesh(GEO.sph, eyeM); e.scale.setScalar(.13); e.position.set(s, 1.1, .62); g.add(e); });
    if (k === 'imp' || k === 'brute' || k === 'boss') [-.45, .45].forEach(s => { const h = new THREE.Mesh(GEO.cone, M(0xe8d9b0, { roughness: .6 })); h.scale.set(.18, .5, .18); h.position.set(s, 1.75, 0); h.rotation.z = -s * .6; g.add(h); });
    if (k === 'brute') [-.8, .8].forEach(s => { const sp = new THREE.Mesh(GEO.cone, M(0x3a2a4a)); sp.scale.set(.25, .6, .25); sp.position.set(s, 1.5, 0); sp.rotation.z = -s * 1.0; g.add(sp); });
    if (k === 'mage') { const c = new THREE.Mesh(GEO.cone, M(0x1a3a5a)); c.scale.set(.8, 1.5, .8); c.position.y = .75; g.add(c); const st = new THREE.Mesh(GEO.sph, BASIC(0x7ad8ff)); st.scale.setScalar(.22); st.position.set(.7, 1.6, .2); g.add(st); }
    if (k === 'boss') { for (let i = 0; i < 7; i++) { const a = (i / 7 - .5) * 2.4, c = new THREE.Mesh(GEO.cone, M(0x3a0a1a, { emissive: 0x8a0a1a, emissiveIntensity: .6 })); c.scale.set(.16, .6, .16); c.position.set(Math.sin(a) * .8, 1.9 + Math.cos(a) * .15, -.1); c.rotation.z = -a * .6; g.add(c); }
      const core = new THREE.Mesh(GEO.sph, BASIC(0xff2a3a)); core.scale.setScalar(.22); core.position.set(0, .75, .7); g.add(core); }
    return { g, bm }; };
  const mkBar = (w, col) => { const bg = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x120608, fog: false, depthTest: false, transparent: true, opacity: .85 })), fg = new THREE.Sprite(new THREE.SpriteMaterial({ color: col || 0xff4a4a, fog: false, depthTest: false, transparent: true }));
    bg.scale.set(w + .06, .26, 1); fg.scale.set(w, .18, 1); fg.center.set(0, .5); bg.renderOrder = 998; fg.renderOrder = 999; return { bg, fg, w }; };
  const spawnMob = (k, x, z) => { const T = TYPES[k], { g, bm } = mkBody(k), hpMax = Math.round(unit * T.hp); g.position.set(x, 0, z); group.add(g);
    const bar = mkBar(T.boss ? 4 : 1.5); bar.bg.position.set(x, (T.boss ? 7.4 : 2.9 * T.sc / 1.2), z); bar.fg.position.set(x - bar.w / 2, bar.bg.position.y + .001, z); group.add(bar.bg, bar.fg);
    let bb = null; if (T.boss) { bb = mkBar(4, 0xffd24a); bb.bg.position.set(x, 6.95, z); bb.fg.position.set(x - 2, 6.951, z); bb.fg.scale.x = .001; group.add(bb.bg, bb.fg); }
    const m = { k, T, g, bm, bar, bb, x, z, hp: hpMax, max: hpMax, atkT: T.cd * Math.random(), wind: 0, windD: .5, flash: 0, kx: 0, kz: 0, dead: 0, shotT: 1 + Math.random() * 1.5, stag: 0, stun: 0, brk: 0, brkT: 0, ch: null, tel: null, ph: 0 }; mobs.push(m); return m; };
  const rmLane = m => { if (m.ch && m.ch.lane) { group.remove(m.ch.lane); m.ch.lane.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } }); } m.ch = null; };
  const killMob = m => { m.dead = 1; rmLane(m); group.remove(m.g, m.bar.bg, m.bar.fg); m.g.traverse(o => { if (o.isMesh && o.geometry && !Object.values(GEO).includes(o.geometry)) o.geometry.dispose(); }); m.bar.bg.material.dispose(); m.bar.fg.material.dispose(); if (m.bb) { group.remove(m.bb.bg, m.bb.fg); m.bb.bg.material.dispose(); m.bb.fg.material.dispose(); } spark(m.x, 1.2, m.z, m.T.boss ? 90 : 18, m.T.boss ? 0xff4a3a : 0xffd76a); };
  const barUpdate = m => { const f = Math.max(0, m.hp / m.max); m.bar.fg.scale.x = Math.max(.001, m.bar.w * f); m.bar.fg.position.x = m.x - m.bar.w / 2; m.bar.bg.position.x = m.x; m.bar.bg.position.z = m.bar.fg.position.z = m.z;
    if (m.bb) { m.bb.fg.scale.x = Math.max(.001, m.bb.w * (m.stun > 0 ? 1 : m.brk / 100)); m.bb.fg.material.color.setHex(m.stun > 0 ? 0xffffff : 0xffd24a); m.bb.fg.position.x = m.x - m.bb.w / 2; m.bb.bg.position.x = m.x; m.bb.bg.position.z = m.bb.fg.position.z = m.z; } };
  const alive = () => mobs.filter(m => !m.dead);
  const nearest = (x, z, maxD) => { let b = null, bd = maxD; alive().forEach(m => { const d = hyp(m.x - x, m.z - z) - m.T.r; if (d < bd) { bd = d; b = m; } }); return b; };
  const say = (t, ms) => tapeNote(t, { ms: ms || 2600, cls: 'tip' });

  // ── 이펙트 (칼날 호 / 퍼지는 링)
  const slashFx = (x, z, ry, big, flip) => { const g = new THREE.Group(); g.position.set(x, .95, z); g.rotation.y = ry;
    const len = big ? Math.PI * 2 - .01 : 2.0, mat = BASIC(big ? 0xff8a3a : 0xfff0c0, { transparent: true, opacity: .9, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    const m = new THREE.Mesh(new THREE.RingGeometry(big ? 1.2 : 1.1, big ? 3.0 : 2.2, 28, 1, big ? 0 : -Math.PI / 2 - len / 2, len), mat); m.rotation.x = -Math.PI / 2; if (!big) m.rotation.z = flip ? .5 : -.5; g.add(m); group.add(g); fxs.push({ g, mat, t: 0, d: big ? .26 : .17, kind: 'slash', big }); };
  const ringFx = (x, z, r1, col, d) => { const mat = BASIC(col, { transparent: true, opacity: .85, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }); const m = new THREE.Mesh(new THREE.RingGeometry(.86, 1, 56), mat); m.rotation.x = -Math.PI / 2; m.position.set(x, .22, z); group.add(m); fxs.push({ g: m, mat, t: 0, d: d || .45, kind: 'ring', r1 }); };
  const tickFx = dt => { for (let i = fxs.length - 1; i >= 0; i--) { const f = fxs[i]; f.t += dt; const k = Math.min(1, f.t / f.d);
      if (f.kind === 'slash') { f.g.scale.setScalar((f.big ? .7 : .85) + k * (f.big ? .9 : .5)); f.mat.opacity = .9 * (1 - k * k); } else { const r = .5 + (f.r1 - .5) * (1 - Math.pow(1 - k, 2)); f.g.scale.set(r, r, 1); f.mat.opacity = .85 * (1 - k); }
      if (k >= 1) { group.remove(f.g); f.g.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } }); fxs.splice(i, 1); } } };
  // 폭주 오라 (내 발밑 불꽃 링)
  const aura = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.35, 40), BASIC(0xff6a1a, { transparent: true, opacity: .6, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); aura.rotation.x = -Math.PI / 2; aura.visible = false; add(aura);

  // ── 힐 오브
  const dropOrb = (x, z) => { const m = new THREE.Mesh(GEO.sph, BASIC(0x5affa0, { transparent: true, opacity: .95 })); m.scale.setScalar(.34); m.position.set(x, .8, z); group.add(m); heals.push({ m, x, z, t: 14 }); };

  // ── 전투
  const cancelWind = m => { if (m.wind > 0) { m.wind = 0; m.g.scale.setScalar(m.T.sc); } if (m.tel) { const i = tele.indexOf(m.tel); if (i >= 0) rmTele(i); m.tel = null; } };
  const addRage = n => { if (frenzy > 0) return; rage = Math.min(100, rage + n); };
  const breakBoss = m => { m.brk = 0; m.stun = 3.6; m.wind = 0; m.g.scale.setScalar(m.T.sc); rmLane(m); say('💥 BREAK! 대마왕이 비틀거려요 — 지금 공격!', 2400); floatW(m.x, 6.4, m.z, '💥 BREAK!', 'dk'); api.quake(.6, .5); api.flash('#fff2c0', .45, 200); spark(m.x, 1.5, m.z, 70, 0xffe04a, 6, 4, .9, 2); ringFx(m.x, m.z, 8, 0xffe04a, .6); slow = .5; api.snd('boom'); };
  const dmgMob = (m, d, crit, o) => { o = o || {}; if (m.dead || phase !== 'run') return; let dd = d; if (m.stun > 0) dd = Math.round(dd * 1.8); m.hp -= dd; m.flash = .12; hs = Math.max(hs, o.fin ? .1 : o.skill ? .08 : .045);
    const dx = m.x - me.x, dz = m.z - me.z, L = hyp(dx, dz) || 1;
    if (!m.T.boss) { const k = o.fin ? 12 : o.skill ? 8 : 4; m.kx += dx / L * k; m.kz += dz / L * k; if (o.fin || o.skill || Math.random() < .45) { cancelWind(m); m.stag = o.fin ? .6 : .32; } }
    else if (m.stun <= 0) { m.brk = Math.min(100, m.brk + (o.brk || 2.5)); m.brkT = 4; if (m.brk >= 100) breakBoss(m); }
    floatW(m.x + (Math.random() - .5) * .8, 2.4 * m.T.sc / 1.3 + .6, m.z, (o.fin ? '💥 ' : crit ? '⚡ ' : '') + fmtN(dd), o.fin ? 'df' : crit ? 'dc' : 'dn');
    spark(m.x, 1.3, m.z, o.fin ? 26 : crit ? 14 : 7, o.fin ? 0xff8a3a : crit ? 0xffe04a : 0xffb38a, o.fin ? 6 : 4, 5, .55, 1);
    api.snd('punch', !!(crit || o.fin)); api.quake(o.fin ? .38 : o.skill ? .3 : crit ? .16 : .08, o.fin ? .3 : .16); if (crit || o.fin) api.flash(o.fin ? '#ff9a4a' : '#fff6c0', o.fin ? .22 : .12, 90);
    addRage(o.fin ? 6 : o.skill ? 10 : crit ? 4 : 3);
    if (m.hp <= 0) { killMob(m); addRage(6); hs = Math.max(hs, .14); api.quake(.35, .3); if (Math.random() < (m.T.boss ? 0 : m.k === 'imp' ? .14 : .3)) dropOrb(m.x, m.z); if (m.T.boss) clearRun(); else checkWave(); } };
  // 일반 공격: 3타 콤보 — 3타째는 범위 강타(피니셔)
  const doAttack = () => { if (phase !== 'run' || countdown > 0) return false; const tg = nearest(me.x, me.z, 3.6); if (!tg) return false;
    const t = now(); if (t - lastAtk > 1300) cstep = 0; const fin = cstep === 2; const useJd = jd > 0;
    const a = api.attack({ spd: frenzy > 0 ? 1.8 : 1, mul: (fin ? 2.2 : 1) * (1 + Math.min(.5, combo * .02)) * (frenzy > 0 ? 1.5 : 1) * (useJd ? 1.6 : 1), crit: useJd }); if (!a) return false;
    lastAtk = t; cstep = fin ? 0 : cstep + 1; combo++; comboT = 2.2; maxCombo = Math.max(maxCombo, combo); if (useJd) { jd = 0; floatW(me.x, 2.8, me.z, '✨ 카운터!', 'dj'); }
    api.face(tg.x, tg.z); const ry = Math.atan2(tg.x - me.x, tg.z - me.z); slashFx(me.x + Math.sin(ry) * .6, me.z + Math.cos(ry) * .6, ry, fin, cstep % 2);
    if (fin) { ringFx(me.x, me.z, 4.2, 0xffa24a, .35); api.snd('boom'); alive().forEach(m => { if (m !== tg && hyp(m.x - me.x, m.z - me.z) - m.T.r < 3.6) dmgMob(m, Math.round(a.dmg * .7), a.crit, { fin: true, brk: 5 }); }); }
    dmgMob(tg, a.dmg, a.crit, { fin, brk: fin ? 7 : 2.5 }); return true; };
  const startFrenzy = () => { if (phase !== 'run') { toast('🔥 던전 도전 중일 때만 폭주할 수 있어요'); return; } if (frenzy > 0) return; if (rage < 100) { toast(`🔥 폭주 게이지 ${Math.floor(rage)}% — 싸우고 회피하면 차올라요`); return; }
    frenzy = 8; rage = 0; api.flash('#ff7a1a', .4, 220); api.quake(.5, .4); api.snd('level'); floatW(me.x, 3, me.z, '🔥 폭주!', 'df'); ringFx(me.x, me.z, 9, 0xff6a1a, .6); spark(me.x, 1, me.z, 60, 0xff8a2a, 6, 3, .9, 2); say('🔥 폭주! 8초간 공격속도·위력 UP', 2200); };
  const justDodge = () => { jd = 3.2; addRage(25); slow = .45; floatW(me.x, 3, me.z, '✨ 저스트 회피!', 'dj'); api.snd('clink'); api.flash('#aef2ff', .28, 150); spark(me.x, 1, me.z, 24, 0x9ef0ff, 5, 2, .6, 1); const B = alive().find(m => m.T.boss); if (B && B.stun <= 0) { B.brk = Math.min(100, B.brk + 15); B.brkT = 4; if (B.brk >= 100) breakBoss(B); } say('✨ 저스트 회피! 다음 공격이 반드시 치명타!', 1600); };
  const doDodge = (dx, dz, byAuto) => { if (!api.dodge(dx || 0, dz || 0)) return false; dodgeAt = now(); dodgeAuto = !!byAuto; return true; };
  const hurtMe = (pct, x, z, why) => { if (api.dodging()) { if (!dodgeAuto && now() - dodgeAt < 480) justDodge(); return; } const was = api.hp().hp; api.hurt(Math.max(1, Math.round(api.hp().max * pct)), x, z, why); if (api.hp().hp < was) { if (combo >= 5) floatW(me.x, 2.8, me.z, '콤보 끊김…', 'dn'); combo = 0; cstep = 0; } };

  // ── 진행
  const startWave = () => { const list = WAVES[wave]; unit = Math.max(20, api.unit()); healed = false; list.forEach((k, i) => { const a = i / list.length * 6.28 + Math.random() * .5, r = k === 'boss' ? 0 : 9 + Math.random() * 2; spawnMob(k, Math.cos(a) * r, Math.sin(a) * r - 2); });
    bossT = 2.5; bossStage = 0; say(wave === 4 ? '👹 보스 「폭락 대마왕」! 구르기(Z)로 피하고, 균열 게이지를 채워 BREAK!' : `⚔ 웨이브 ${wave + 1}/${WAVES.length} 시작! (${list.length}마리)`, 2800); };
  const checkWave = () => { if (alive().length) return; if (wave >= WAVES.length - 1) return; const g = givePts(30 + wave * 10, .05); wave++; S.maxW = Math.max(S.maxW, wave); save(); api.heal(Math.round(api.hp().max * .4)); say(`✅ 웨이브 클리어! 공덕 +${g} · 체력 회복 · 다음 웨이브 준비…`, 2600); countdown = 3.2; };
  const clearAll = () => { mobs.slice().forEach(m => { if (!m.dead) killMob(m); }); mobs.length = 0; proj.forEach(p => group.remove(p.m)); proj.length = 0; for (let i = tele.length - 1; i >= 0; i--) rmTele(i); heals.forEach(h => group.remove(h.m)); heals.length = 0; if (ringSh) { group.remove(ringSh.m); ringSh = null; } };
  const setAutoUi = on => { autoOn = !!on; api.setAuto(autoOn); };
  const startRun = () => { if (phase === 'run' || countdown > 0) { toast('이미 도전 중이에요!'); return; } if (api.hp().ko) return; clearAll();
    phase = 'run'; wave = 0; lives = 3; t0 = now(); countdown = 3.2; combo = 0; cstep = 0; rage = 0; frenzy = 0; jd = 0; maxCombo = 0; autoUsed = autoOn; api.heal(api.hp().max); say('🏰 던전 도전 시작! 목숨 3개 — 구르기 Z · 폭주 C · 3타째는 강타!', 3200); };
  const failRun = () => { phase = 'lobby'; countdown = 0; clearAll(); if (autoOn) setAutoUi(false); say(`💀 던전 실패… (웨이브 ${wave + 1}에서 쓰러짐) 제단에서 다시 도전할 수 있어요`, 3600); };
  const clearRun = () => { phase = 'win'; runMs = Math.round(now() - t0); clearAll();
    S.tot++; S.maxW = WAVES.length; const newBest = !autoUsed && (!S.best || runMs < S.best); if (newBest) S.best = runMs; const paid = S.cl < DAILY_CLEARS; S.cl++;
    if (paid) { const g = givePts(220, .3); addCoin(growCoin(600), '던전 클리어'); dropItem(3); api.fx.firework(); say(`🏆 던전 클리어! ${(runMs / 1000).toFixed(1)}초 · 최고 ${maxCombo}콤보 · 공덕 +${g} · 장비 상자!${autoUsed ? ' (자동사냥은 기록 제외)' : ''} (오늘 ${S.cl}/${DAILY_CLEARS})`, 4600); }
    else say(`🏆 던전 클리어! ${(runMs / 1000).toFixed(1)}초 · 최고 ${maxCombo}콤보 (오늘 보상 ${DAILY_CLEARS}번은 모두 받았어요)`, 4600);
    if (!S.title) { S.title = 1; G.title = '던전 정복자'; saveG(); dropItem(5); toast('🏅 한정 칭호 「던전 정복자」 + 전설 상자!'); }
    if (autoOn) setAutoUi(false); save(); setTimeout(() => { if (phase === 'win') phase = 'lobby'; }, 1500); };
  // ── 상호작용
  addInter('rz_start', { name: '⚔ 던전 도전', X: ALT.x, Z: ALT.z + 2.4, h: 2.8, btn: '⚔<br>도전', fn: () => startRun() });
  addInter('rz_rec', { name: '🏆 기록 보기', X: REC.x + 2, Z: REC.z + 1.2, h: 2.8, btn: '🏆<br>기록', fn: () => toast(`🏆 최고 ${S.best ? (S.best / 1000).toFixed(1) + '초' : '기록 없음'} · 클리어 ${S.tot}번 · 오늘 ${S.cl}/${DAILY_CLEARS}`) });
  addInter('rz_out', { name: '🚪 나가기', X: 0, Z: R - 2.6, h: 2.6, btn: '🚪<br>나가기', fn: () => leave() });
  addInter('rz_hit', { name: '⚔ 공격', X: 0, Z: -40, h: 2.2, btn: '⚔<br>공격', fn: () => { if (phase !== 'run') return; if (!doAttack() && !nearest(me.x, me.z, 3.6)) toast('⚔ 가까이 다가가요!'); } });
  // 화면 버튼: 구르기 / 폭주
  const mkB = (id, html, fn) => { const b = api.hudBtn(id, html, fn); const f = document.createElement('i'); f.className = 'fill'; b.appendChild(f); return { b, f }; };
  const bD = mkB('dodge', '💨<br>구르기<small>Z</small>', () => doDodge(0, 0, false)), bR = mkB('rage', '🔥<br>폭주<small>C</small>', () => startFrenzy());
  let bRt = '';

  // ── 보스 패턴
  const mkTele = (x, z, r, delay, dmgPct, col) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 40), BASIC(col || 0xff2a2a, { transparent: true, opacity: .25, side: THREE.DoubleSide, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.set(x, .14, z); group.add(m); const e = { m, x, z, r, t: delay, d: delay, pct: dmgPct }; tele.push(e); return e; };
  const rmTele = i => { const e = tele[i]; group.remove(e.m); e.m.geometry.dispose(); e.m.material.dispose(); tele.splice(i, 1); };
  const mkProj = (x, z, tx, tz, pct) => { const m = new THREE.Mesh(GEO.sph, BASIC(0x7ad8ff)); m.scale.setScalar(.35); m.position.set(x, 1.2, z); group.add(m); const L = hyp(tx - x, tz - z) || 1; proj.push({ m, x, z, vx: (tx - x) / L * 7.5, vz: (tz - z) / L * 7.5, life: 3, pct }); };
  const startCharge = (B, pm) => { let dx = pm.x - B.x, dz = pm.z - B.z; const L = hyp(dx, dz) || 1; dx /= L; dz /= L;
    const lane = new THREE.Group(); lane.position.set(B.x, .16, B.z); lane.rotation.y = Math.atan2(dx, dz); const pl = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 26), BASIC(0xff2a2a, { transparent: true, opacity: .15, side: THREE.DoubleSide, depthWrite: false })); pl.rotation.x = Math.PI / 2; pl.position.z = 13; lane.add(pl); group.add(lane);
    B.ch = { st: 'aim', t: 1.15, t0: 1.15, dx, dz, lane, hit: false }; B.wind = 0; B.g.scale.setScalar(B.T.sc); say('🐗 돌진! 붉은 길에서 옆으로 구르세요 (Z) — 벽에 박으면 딜 찬스!', 1900); };
  const bossPattern = (B, pm, ph) => { const list = PAT[ph], p = list[bossStage++ % list.length];
    if (p === 'circle') { mkTele(pm.x, pm.z, 3.4, 1.3, .2); if (ph >= 1) mkTele(pm.x + (Math.random() * 8 - 4), pm.z + (Math.random() * 8 - 4), 3.2, 1.5, .2); say('🔴 붉은 장판! 벗어나요!', 1400); bossT = 2.6; }
    else if (p === 'circle2') { mkTele(pm.x, pm.z, 3.2, 1.0, .2); for (let i = 0; i < 2; i++) mkTele(pm.x + (Math.random() * 10 - 5), pm.z + (Math.random() * 10 - 5), 3.0, 1.25 + i * .3, .2); say('🔴🔴 장판 연타!', 1400); bossT = 2.4; }
    else if (p === 'ring') { if (!ringSh) { ringSh = { m: new THREE.Mesh(new THREE.RingGeometry(.94, 1, 72), BASIC(0xffd24a, { transparent: true, opacity: .9, side: THREE.DoubleSide, depthWrite: false })), r: 1.5, x: B.x, z: B.z, hit: false }; ringSh.m.rotation.x = -Math.PI / 2; ringSh.m.position.set(B.x, .3, B.z); group.add(ringSh.m); say('⚡ 충격파! 점프로 넘으면 폭주 게이지 UP!', 1800); } bossT = 3.4; }
    else if (p === 'summon') { const n = alive().filter(m => !m.T.boss).length; if (n < 4) { for (let i = 0; i < 2; i++) { const a = Math.random() * 6.28; spawnMob('imp', Math.cos(a) * 9, Math.sin(a) * 9); } say('😈 부하 도깨비 소환!', 1600); } bossT = 2.4; }
    else if (p === 'meteor') { for (let i = 0; i < 6; i++) { const a = Math.random() * 6.28, r = Math.random() * 3.2; mkTele(pm.x + Math.cos(a) * r, pm.z + Math.sin(a) * r, 2.6, .9 + i * .38, .16, 0xff7a2a); } say('☄ 유성우! 계속 움직여요!', 1700); bossT = 4.4; }
    else if (p === 'charge') startCharge(B, pm); };
  const chargeTick = (B, dt, pm) => { const C = B.ch; B.g.rotation.y = Math.atan2(C.dx, C.dz);
    if (C.st === 'aim') { C.t -= dt; C.lane.children[0].material.opacity = .15 + .45 * (1 - C.t / C.t0); B.g.position.y = 0; if (C.t <= 0) { C.st = 'run'; C.t = 1.7; C.lane.children[0].material.opacity = .08; api.snd('boom'); } return; }
    B.x += C.dx * 17 * dt; B.z += C.dz * 17 * dt; C.t -= dt; if (Math.random() < .6) spark(B.x, .5, B.z, 3, 0xffa060, 3, 3, .5);
    if (!C.hit && hyp(pm.x - B.x, pm.z - B.z) < B.T.r + .8 && pm.y < 1.2) { C.hit = true; hurtMe(.22, B.x - C.dx * 2, B.z - C.dz * 2, '돌진'); }
    let crash = hyp(B.x, B.z) > R - B.T.r - 1.0; for (const p of PILL) if (hyp(B.x - p[0], B.z - p[1]) < B.T.r + .9) crash = true;
    if (crash) { B.x -= C.dx * 1.2; B.z -= C.dz * 1.2; rmLane(B); B.stun = 3.2; B.brk = 0; bossT = 2.2; api.quake(.7, .5); api.flash('#fff2c0', .4, 200); api.snd('boom'); spark(B.x, 1.5, B.z, 60, 0xffc06a, 6, 4, .9, 2); ringFx(B.x, B.z, 7, 0xffe04a, .5); floatW(B.x, 6.4, B.z, '💥 쾅! 딜 찬스!', 'dk'); say('💥 벽에 쾅! 대마왕 기절 — 마음껏 때려요!', 2000); }
    else if (C.t <= 0) { rmLane(B); bossT = 1.6; } };

  // ── 자동사냥
  const autoTick = (dt, pm, hp) => { if (!autoOn) return;
    if (phase === 'lobby') { if (!autoStart) autoStart = now(); if (now() - autoStart > 1600 && !hp.ko) { autoStart = 0; startRun(); } return; } autoStart = 0;
    if (phase !== 'run' || countdown > 0 || hp.ko || api.manual()) return; autoT -= dt; if (autoT > 0) return; autoT = .14;
    const arr = alive(); if (!arr.length) return;
    for (const e of tele) if (hyp(pm.x - e.x, pm.z - e.z) < e.r + .7 && e.t < e.d * .9) { const dx = pm.x - e.x, dz = pm.z - e.z, L = hyp(dx, dz) || 1, k = e.r + 2.4; let tx = e.x + dx / L * k, tz = e.z + dz / L * k; const dd = hyp(tx, tz); if (dd > R - 1.8) { tx *= (R - 1.8) / dd; tz *= (R - 1.8) / dd; } api.walkTo(tx, tz); return; }
    if (ringSh && !ringSh.hit && pm.y < .3 && Math.abs(hyp(pm.x - ringSh.x, pm.z - ringSh.z) - ringSh.r) < 2.0) { api.jump(); return; }
    const B = arr.find(m => m.T.boss);
    if (B && B.ch && B.ch.st === 'aim' && B.ch.t < .5) { const px = pm.x - B.x, pz = pm.z - B.z, side = px * B.ch.dz - pz * B.ch.dx; if (Math.abs(side) < 2.4) { const s = side >= 0 ? 1 : -1; doDodge(B.ch.dz * s, -B.ch.dx * s, true); return; } }
    if (rage >= 100 && frenzy <= 0 && (B || arr.length >= 3)) startFrenzy();
    for (const s of [2, 3, 1, 0]) { if (!api.skillReady(s)) continue; if (s === 2) { if (arr.filter(m => hyp(m.x - pm.x, m.z - pm.z) < 11).length >= 2 || (B && hyp(B.x - pm.x, B.z - pm.z) < 11)) { api.cast(2); return; } } else { const n = nearest(pm.x, pm.z, 10); if (n) { api.cast(s); return; } } }
    const t = nearest(pm.x, pm.z, 80); if (!t) return; const L = hyp(t.x - pm.x, t.z - pm.z) || 1, d = L - t.T.r;
    if (d > 2.7) { const k = t.T.r + 1.5; api.walkTo(t.x - (t.x - pm.x) / L * k, t.z - (t.z - pm.z) / L * k); } else { api.walkTo(pm.x, pm.z); doAttack(); } };

  return {
    sky: 'dungeon', camDist: () => (api.touch ? 32 : 27),
    bounds: { x0: -R + .8, x1: R - .8, z0: -R + .8, z1: R - .8 }, spawn: { x: 0, z: 11, ry: Math.PI },
    walk: (x, z) => { if (hyp(x, z) > R - .9) return false; for (const p of PILL) if (hyp(x - p[0], z - p[1]) < 1.1) return false; if (hyp(x - ALT.x, z - ALT.z) < 1.5) return false; if (x > REC.x - 1 && x < REC.x + 1 && z > REC.z - .5 && z < REC.z + .5) return false; return true; },
    onSkill(s, dmg) { if (phase !== 'run') { toast('⚔ 던전에 도전 중일 때만 스킬이 나가요'); return; } const o = { skill: true, brk: 14 }; if (s === 2) { ringFx(me.x, me.z, 11, 0x9ad8ff, .55); alive().filter(m => hyp(m.x - me.x, m.z - me.z) < 11).forEach(m => dmgMob(m, dmg, true, o)); } else { const m = nearest(me.x, me.z, 11); if (m) { api.face(m.x, m.z); slashFx(m.x, m.z, Math.atan2(m.x - me.x, m.z - me.z), true); dmgMob(m, dmg, true, o); } } api.quake(.4, .3); },
    onKo() { if (phase !== 'run') return; lives--; combo = 0; cstep = 0; rage = Math.max(0, rage - 30); if (lives <= 0) { setTimeout(failRun, 300); } else say(`😵 쓰러졌어요! 남은 목숨 ${lives}개 — 입구에서 부활해요`, 2800); },
    onKey(k) { if (k === 'z') { doDodge(0, 0, false); return true; } if (k === 'c') { startFrenzy(); return true; } return false; },
    onAuto() { if (autoOn) { setAutoUi(false); toast('🤖 자동사냥 멈춤'); } else { setAutoUi(true); toast(phase === 'run' ? '🤖 자동사냥 시작! 직접 움직이면 잠깐 멈췄다가 이어서 해요' : '🤖 자동사냥 켜짐 — 잠시 뒤 던전 도전을 시작해요 (자동은 최고기록에서 제외)'); } },
    tick(dt, t, pm) {
      me = pm; embers.material.opacity = .6 + Math.sin(t * 3) * .25; embers.rotation.y += dt * .03; flames.forEach((f, i) => { f.scale.set(.5 + Math.sin(t * 9 + i) * .08, .8 + Math.sin(t * 7 + i * 2) * .15, .5); }); orb.position.y = 1.6 + Math.sin(t * 2) * .15; orb.rotation.y += dt;
      const hp = api.hp(); if (hs > 0) hs -= dt; if (slow > 0) slow -= dt; const edt = hs > 0 ? dt * .06 : slow > 0 ? dt * .35 : dt; tickFx(dt); if (jd > 0) jd -= dt;
      if (comboT > 0) { comboT -= dt; if (comboT <= 0) { combo = 0; cstep = 0; } }
      if (frenzy > 0) { frenzy -= dt; aura.visible = true; aura.position.set(pm.x, .15, pm.z); aura.scale.setScalar(1 + .12 * Math.sin(t * 14)); if (Math.random() < .5) spark(pm.x + (Math.random() - .5), .3, pm.z + (Math.random() - .5), 2, 0xff7a2a, 2, -2, .5, 3); if (frenzy <= 0) { aura.visible = false; say('🔥 폭주 종료', 1200); } } else aura.visible = false;
      // 버튼 상태
      { const dc = Math.max(0, 1 - (now() - dodgeAt) / 800); bD.f.style.height = (dc * 100) + '%'; bD.b.classList.toggle('cdn', dc > 0); const rdy = rage >= 100 && frenzy <= 0; bR.b.classList.toggle('rdy', rdy); bR.f.style.height = (frenzy > 0 ? frenzy / 8 * 100 : rage) + '%'; const tx = frenzy > 0 ? `🔥<br>${frenzy.toFixed(1)}초` : `🔥<br>폭주<small>${Math.floor(rage)}% · C</small>`; if (tx !== bRt) { bRt = tx; bR.b.innerHTML = tx; bR.b.appendChild(bR.f); } }
      // 회복 오브
      for (let i = heals.length - 1; i >= 0; i--) { const h = heals[i]; h.t -= dt; h.m.position.y = .8 + Math.sin(t * 5 + i) * .15; if (hyp(pm.x - h.x, pm.z - h.z) < 1.3 && !hp.ko) { api.heal(Math.round(hp.max * .12)); floatW(h.x, 1.8, h.z, '❤ +12%', 'dj'); spark(h.x, .8, h.z, 14, 0x5affa0, 3, -1, .6, 1); api.snd('coin'); group.remove(h.m); h.m.material.dispose(); heals.splice(i, 1); } else if (h.t <= 0) { group.remove(h.m); h.m.material.dispose(); heals.splice(i, 1); } }
      autoTick(dt, pm, hp);
      if (phase === 'run') {
        if (countdown > 0) { countdown -= dt; if (countdown <= 0) startWave(); }
        else if (!hp.ko) {
          // 공격 대상 안내
          const nm = nearest(pm.x, pm.z, 40); if (nm) { const dx = pm.x - nm.x, dz = pm.z - nm.z, L = hyp(dx, dz) || 1, k = Math.min(L, nm.T.r * .8) / L; api.setInter('rz_hit', nm.x + dx * k, nm.z + dz * k, false); } else api.setInter('rz_hit', 0, -40, true);
          // 적 AI
          const arr = alive();
          arr.forEach(m => { const T = m.T; if (m.flash > 0) { m.flash -= dt; m.bm.emissiveIntensity = 3; } else m.bm.emissiveIntensity = m.stun > 0 ? 2 + Math.sin(t * 20) : .8;
            m.x += m.kx * edt; m.z += m.kz * edt; m.kx *= Math.max(0, 1 - dt * 9); m.kz *= Math.max(0, 1 - dt * 9);
            const dx = pm.x - m.x, dz = pm.z - m.z, d = hyp(dx, dz) || 1; const stopD = T.ranged ? 7 : T.atkR * .72; let mv = 0;
            if (m.ch) { m.g.position.set(m.x, 0, m.z); return; }
            if (m.stun > 0) { m.stun -= edt; m.g.rotation.z = Math.sin(t * 30) * .09; m.g.position.set(m.x, 0, m.z); if (m.stun <= 0) { m.g.rotation.z = 0; m.atkT = 1; } return; }
            if (m.stag > 0) { m.stag -= edt; m.g.rotation.z = Math.sin(t * 40) * .15; if (m.stag <= 0) m.g.rotation.z = 0; m.g.position.set(m.x, 0, m.z); return; }
            m.g.rotation.y = Math.atan2(dx, dz);
            if (m.wind > 0) { m.wind -= edt; m.g.scale.setScalar(T.sc * (1 + .18 * Math.sin((1 - m.wind / m.windD) * Math.PI))); if (m.wind <= 0) { m.g.scale.setScalar(T.sc); m.tel = null; if (!T.ranged && m.k !== 'brute' && hyp(pm.x - m.x, pm.z - m.z) < T.atkR + .6) hurtMe(T.dmg, m.x, m.z, ''); } }
            else { if (T.ranged) { if (d > stopD + 1) mv = 1; else if (d < stopD - 2) mv = -1; } else if (d > stopD) mv = 1;
              if (mv) { m.x += dx / d * T.sp * mv * edt; m.z += dz / d * T.sp * mv * edt; }
              m.atkT -= edt;
              if (!T.boss && m.atkT <= 0 && ((!T.ranged && d <= T.atkR) || (T.ranged && d <= T.atkR + 2))) { m.atkT = T.cd;
                if (T.ranged) { if (m.hp < m.max * .5) { [-.3, 0, .3].forEach(a => { const ca = Math.cos(a), sa = Math.sin(a), vx = pm.x - m.x, vz = pm.z - m.z; mkProj(m.x, m.z, m.x + vx * ca - vz * sa, m.z + vx * sa + vz * ca, T.dmg); }); } else mkProj(m.x, m.z, pm.x, pm.z, T.dmg); }
                else if (m.k === 'brute') { m.windD = m.wind = .95; m.tel = mkTele(m.x + dx / d * 1.8, m.z + dz / d * 1.8, 2.2, .95, T.dmg); }
                else { m.windD = m.wind = .5; } }
              if (T.boss && m.atkT <= 0 && d <= T.atkR + 1) { m.atkT = T.cd; m.windD = m.wind = .5; } }
            m.g.position.set(m.x, 0, m.z); });
          // 분리
          for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) { const a = arr[i], b = arr[j], dx = b.x - a.x, dz = b.z - a.z, d = hyp(dx, dz) || .01, mn = a.T.r + b.T.r; if (d < mn) { const p = (mn - d) / 2; a.x -= dx / d * p; a.z -= dz / d * p; b.x += dx / d * p; b.z += dz / d * p; } }
          arr.forEach(m => { if (!m.ch) { const d = hyp(m.x, m.z); if (d > R - 1.6) { m.x *= (R - 1.6) / d; m.z *= (R - 1.6) / d; } } m.g.position.set(m.x, 0, m.z); barUpdate(m); });
          // 보스
          const B = arr.find(m => m.T.boss); if (B) { if (B.brkT > 0) B.brkT -= edt; else if (B.brk > 0 && B.stun <= 0) B.brk = Math.max(0, B.brk - dt * 6);
            const hf = B.hp / B.max, ph = hf > .66 ? 0 : hf > .33 ? 1 : 2; if (ph !== B.ph) { B.ph = ph; if (ph === 1) say('⚠ 대마왕이 분노했다! 돌진 주의!', 2400); else say('☄ 대마왕 폭주! 유성우 + 돌진!', 2400); }
            if (B.ch) chargeTick(B, edt, pm); else if (B.stun <= 0) { bossT -= edt * (hf < .25 ? 1.5 : 1); if (bossT <= 0) bossPattern(B, pm, ph); } }
          // 장판
          for (let i = tele.length - 1; i >= 0; i--) { const e = tele[i]; e.t -= edt; e.m.material.opacity = .22 + .4 * (1 - e.t / e.d); if (e.t <= 0) { if (hyp(pm.x - e.x, pm.z - e.z) < e.r) hurtMe(e.pct, e.x, e.z, '장판'); spark(e.x, .5, e.z, 24, 0xff5a3a); api.quake(.3, .3); rmTele(i); } }
          // 충격파
          if (ringSh) { ringSh.r += edt * 6; ringSh.m.scale.set(ringSh.r, ringSh.r, 1); ringSh.m.material.opacity = Math.max(0, 1 - ringSh.r / 17); if (!ringSh.hit && Math.abs(hyp(pm.x - ringSh.x, pm.z - ringSh.z) - ringSh.r) < .9) { ringSh.hit = true; if (pm.y < 1.0) hurtMe(.18, ringSh.x, ringSh.z, '충격파'); else { addRage(14); floatW(pm.x, 2.8, pm.z, '🦘 점프 회피!', 'dj'); api.snd('clink'); const Bm = alive().find(m => m.T.boss); if (Bm && Bm.stun <= 0) { Bm.brk = Math.min(100, Bm.brk + 8); Bm.brkT = 4; } } } if (ringSh.r > 17) { group.remove(ringSh.m); ringSh.m.geometry.dispose(); ringSh.m.material.dispose(); ringSh = null; } }
          // 투사체
          for (let i = proj.length - 1; i >= 0; i--) { const p = proj[i]; p.x += p.vx * edt; p.z += p.vz * edt; p.life -= edt; p.m.position.set(p.x, 1.2, p.z); if (hyp(pm.x - p.x, pm.z - p.z) < .9 && pm.y < 1.6) { hurtMe(p.pct, p.x - p.vx, p.z - p.vz, ''); p.life = 0; } if (p.life <= 0 || hyp(p.x, p.z) > R) { group.remove(p.m); p.m.material.dispose(); proj.splice(i, 1); } }
        }
      } else api.setInter('rz_hit', 0, -40, true);
      const left = alive().length; const Bn = alive().find(m => m.T.boss);
      const info = phase === 'run' ? (countdown > 0 ? `🏰 던전 · 곧 시작… ❤️×${lives}` : `🏰 ${wave + 1}/${WAVES.length} · 적 ${left} · ❤️×${lives}${combo >= 2 ? ' · 🔥' + combo + '콤보' : ''}${frenzy > 0 ? ' · 폭주!' : ''}${Bn ? ' · 균열 ' + (Bn.stun > 0 ? 'BREAK' : Math.floor(Bn.brk) + '%') : ''}${autoOn ? ' · 🤖' : ''}`) : `🏰 폭락의 지하 묘지 · 최고 ${S.best ? (S.best / 1000).toFixed(1) + '초' : '-'} · 오늘 ${S.cl}/${DAILY_CLEARS} · 제단에서 도전!${autoOn ? ' · 🤖' : ''}`;
      gauge(info, phase === 'run' ? (Bn ? Math.round(Math.max(0, Bn.hp / Bn.max) * 100) : Math.round((wave + (WAVES[wave] ? 1 - left / WAVES[wave].length : 1)) / WAVES.length * 100)) : 100, phase === 'run' ? (frenzy > 0 ? '#ff8a1a' : '#ff4a3a') : '#d9622a');
    },
    dbg: { st: () => ({ phase, wave, lives, mobs: alive().length, hp: alive().map(m => [m.k, m.hp, m.max, +m.x.toFixed(1), +m.z.toFixed(1), +(m.brk || 0).toFixed(1), +(m.stun || 0).toFixed(1), !!m.ch]), countdown: +countdown.toFixed(1), unit, S, tele: tele.length, ring: !!ringSh, combo, rage: Math.floor(rage), frenzy: +frenzy.toFixed(1), jd: +jd.toFixed(1), autoOn, heals: heals.length, fx: fxs.length, maxCombo }),
      start: () => startRun(), killAll: () => { alive().forEach(m => { m.hp = 1; }); }, hitAll: () => { alive().forEach(m => dmgMob(m, 1e9, true)); }, nextWave: () => { alive().forEach(m => dmgMob(m, 1e9, false)); }, bossNow: () => { bossT = 0; }, skip: () => { countdown = .01; }, hurt: pct => hurtMe(pct, 0, 0, 'test'),
      atk: () => doAttack(), dodge: () => doDodge(0, 0, false), rage: n => { rage = n; }, frenzy: () => startFrenzy(), charge: () => { const B = alive().find(m => m.T.boss); if (B) { B.stun = 0; startCharge(B, me); } }, brk: n => { const B = alive().find(m => m.T.boss); if (B) { B.brk = n; dmgMob(B, 1, false, { brk: 0 }); } }, pat: p => { const B = alive().find(m => m.T.boss); if (B) { PAT[0] = [p]; bossStage = 0; bossT = 0; } }, jd: v => { jd = v; }, setHp: (i, v) => { const m = alive()[i]; if (m) m.hp = v; }, autoSet: v => setAutoUi(v) },
    dispose() { group.traverse(o => { if ((o.isPoints || o.isLine) && o.geometry) { o.geometry.dispose(); o.material && o.material.dispose(); } if (o.isSprite) o.material.dispose(); }); fxs.forEach(f => { f.g.traverse && f.g.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } }); }); }
  };
};
