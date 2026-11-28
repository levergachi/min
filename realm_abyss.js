/* 🌑 심연 대륙 — 고렙 전용 넓은 사냥 세계 (v68)
   반지름 72 · 바깥으로 갈수록 강해지는 4구역 (Lv100 → Lv3000) · 신종 24종 · ✨황금 변종 · 👑 필드 보스 4
   build(api) → { bounds, walk, spawn, tick(dt,t,me), sky, onSkill, dispose, dbg } */
(window.WB_REALMS = window.WB_REALMS || {}).abyss = function (api) {
  const { THREE, group, GEO, mesh, M, sign, addInter, setInter, toast, tapeNote, gauge, LS, G, saveG, dropItem, addCoin, floatW, spark, leave } = api;
  const R = 72, HUB = 7.5, hyp = Math.hypot, rnd = Math.random;
  const add = o => { group.add(o); return o; }; const DECO = [];
  const BASIC = (c, o) => new THREE.MeshBasicMaterial(Object.assign({ color: c, fog: false }, o || {}));
  const fmtN = n => n >= 1e12 ? (n / 1e12).toFixed(1) + '조' : n >= 1e8 ? (n / 1e8).toFixed(1) + '억' : n >= 1e4 ? (n / 1e4).toFixed(1) + '만' : Math.round(n).toLocaleString();
  // ── 몬스터 수치 (야외 공식과 같은 곡선을 Lv3000까지 이어서)
  const HPF = L => Math.round(100 * Math.pow(100, 1.65) * Math.pow(L / 100, 1.05 + .45 * Math.log10(L / 100)) * 2);
  const EXPF = L => Math.round(7300 * Math.pow(L / 100, 2.6) * .5);
  const COINF = L => Math.round(63 * Math.pow(L / 100, 1.6));
  const DROPP = L => Math.min(.3, .04 + L / 12000);
  const MING = L => L >= 2500 ? 7 : L >= 1600 ? 6 : L >= 800 ? 5 : L >= 300 ? 4 : 3;
  // ── 구역
  const ZONES = [
    { r0: HUB, r1: 23, col: 0x2a2048, line: 0x9a7aff, n: '🟣 심연 입구', lv: [100, 300], cnt: 14 },
    { r0: 23, r1: 40, col: 0x152638, line: 0x5ab0ff, n: '🔵 침묵의 협곡', lv: [300, 800], cnt: 18 },
    { r0: 40, r1: 56, col: 0x33190f, line: 0xff8a3a, n: '🟠 마그마 평원', lv: [800, 1600], cnt: 18 },
    { r0: 56, r1: R, col: 0x2a0812, line: 0xff3a5a, n: '🔴 종말의 끝자락', lv: [1600, 3000], cnt: 16 }];
  const zoneOf = r => r < HUB ? -1 : ZONES.findIndex(z => r >= z.r0 && r < z.r1);
  // 바닥
  add(mesh(GEO.cyl, M(0x0d0816, { roughness: 1 }), [R + 3, .6, R + 3], [0, -.31, 0]));
  ZONES.forEach(z => { const m = new THREE.Mesh(new THREE.RingGeometry(z.r0, z.r1, 96), M(z.col, { roughness: .95, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; m.position.y = .01; add(m);
    const l = new THREE.Mesh(new THREE.RingGeometry(z.r0 - .15, z.r0 + .15, 128), BASIC(z.line, { transparent: true, opacity: .55, side: THREE.DoubleSide })); l.rotation.x = -Math.PI / 2; l.position.y = .04; add(l); });
  { const hub = new THREE.Mesh(new THREE.CircleGeometry(HUB, 48), M(0x3a3070, { emissive: 0x16103a, roughness: .6 })); hub.rotation.x = -Math.PI / 2; hub.position.y = .03; add(hub);
    const edge = new THREE.Mesh(new THREE.RingGeometry(R - .6, R, 128), BASIC(0xff2a4a, { transparent: true, opacity: .7, side: THREE.DoubleSide })); edge.rotation.x = -Math.PI / 2; edge.position.y = .05; add(edge); }
  // 장식: 크리스털·바위 (인스턴스 2개 = 그리기 2번)
  { const S = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(68068), cry = new THREE.InstancedMesh(new THREE.ConeGeometry(.6, 3.2, 5), M(0x8a6aff, { emissive: 0x3a1a8a, roughness: .3 }), 110), rock = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1.2, 0), M(0x2a2430, { roughness: 1 }), 90), o = new THREE.Object3D();
    const place = (im, n, sc) => { for (let i = 0; i < n; i++) { let x, z; do { const a = S() * 6.283, r = HUB + 3 + S() * (R - HUB - 4); x = Math.cos(a) * r; z = Math.sin(a) * r; } while (Math.abs(x) < 3 && z > 0); const k = sc * (.6 + S() * 1.1); o.position.set(x, k * .8, z); o.rotation.set((S() - .5) * .5, S() * 6, (S() - .5) * .5); o.scale.setScalar(k); o.updateMatrix(); im.setMatrixAt(i, o.matrix); DECO.push([x, z, k * 1.05]); } im.instanceMatrix.needsUpdate = true; add(im); };
    place(cry, 110, 1); place(rock, 90, 1.1); }
  // 구역 표지판 (남쪽 길)
  ZONES.forEach((z, i) => { const s = add(sign(`${z.n} · Lv${z.lv[0]}~${z.lv[1]}`, 8, .9, '#f4ecff', '#' + z.line.toString(16).padStart(6, '0'))); s.position.set(0, 3.6, -(z.r0 + 1.5)); s.rotation.y = 0; });
  add(sign('🌑 심연 대륙 — 바깥으로 갈수록 강해요 · 가운데는 안전지대', 13, 1.1, '#efe4ff', '#6a3aff')).position.set(0, 5.2, -4);
  // 나가기
  add(mesh(GEO.cyl, BASIC(0x7a5aff, { transparent: true, opacity: .35 }), [1.4, 3.4, 1.4], [0, 1.7, 5.4]));
  addInter('rz_exit', { name: '🚪 개미시티로 돌아가기 (E)', X: 0, Z: 5.4, h: 3.6, btn: '🚪<br>나가기', fn: () => leave() });

  // ── 종족 24 (구역마다 6종 + 아래 구역 종이 섞여 나와요)
  const SP = [
    ['그림자 개미귀신', 'blob', 0x6a3aa0], ['심연 해파리', 'jelly', 0x7ad8ff], ['역배 박쥐', 'bat', 0x4a3a5a], ['물린개미 좀비', 'blob', 0x6a9a4a], ['데드캣 망령', 'ghost', 0xffb0d0], ['빚더미 슬라임', 'jelly', 0xb08a3a],
    ['청산 늑대', 'wolf', 0x5a6a7a], ['반대매매 전갈', 'scorp', 0xc0502a], ['공포지수 눈알', 'eye', 0xff4a6a], ['하한가 가고일', 'garg', 0x5a5a68], ['헤지 구렁이', 'snake', 0x2a9a6a], ['마진콜 망령', 'ghost', 0xd8e0ff],
    ['붕괴 골렘', 'golem', 0x8a7a6a], ['레버리지 키메라', 'wolf', 0x9a3a8a], ['폭락 운석괴', 'golem', 0xff6a2a], ['인플레 불사조', 'bat', 0xff8a2a], ['선물만기 거미', 'scorp', 0x3a1a2a], ['VIX 폭풍정령', 'eye', 0x4ab0ff],
    ['금리 서리거인', 'golem', 0x9ad8ff], ['상폐 해골기사', 'garg', 0xd8d0b8], ['유동성 블랙홀', 'orb', 0x3a0a5a], ['서킷브레이커 기계룡', 'snake', 0xc8d0dc], ['스태그플레이션 히드라', 'snake', 0x7a2a1a], ['블랙먼데이 사신', 'ghost', 0x2a0a10]];
  const BOSSES = [['👑 대공황의 군주', 'golem', 0x7a0a1a, 2400], ['👑 레버리지 청산 마왕', 'garg', 0x3a0a3a, 2600], ['👑 차트 밖의 거대 눈', 'eye', 0xffd23a, 2800], ['👑 종말의 흑룡', 'snake', 0x111118, 3000]];
  const GG = { sph: GEO.sph, box: GEO.box, cone: GEO.cone, cyl: GEO.cyl, tor: new THREE.TorusGeometry(1, .12, 6, 24) };
  const MC = {}, matOf = (c, k) => MC[c + k] || (MC[c + k] = k === 'g' ? M(c, { transparent: true, opacity: .6, emissive: c, emissiveIntensity: .5 }) : k === 'gold' ? M(0xffd23a, { emissive: 0xaa7a00, emissiveIntensity: .9, metalness: .6, roughness: .3 }) : M(c, { roughness: .6, emissive: c, emissiveIntensity: .18 }));
  const EYE = BASIC(0xffe04a), EYE2 = BASIC(0xff2a3a);
  const part = (g, geo, m, s, p, r) => { const o = new THREE.Mesh(geo, m); o.scale.set(s[0], s[1], s[2]); o.position.set(p[0], p[1], p[2]); if (r) o.rotation.set(r[0], r[1], r[2]); g.add(o); return o; };
  function body(shape, col, gold, boss) {
    const g = new THREE.Group(), m = gold ? matOf(0, 'gold') : matOf(col, shape === 'ghost' || shape === 'jelly' ? 'g' : ''), e = boss ? EYE2 : EYE, anim = [];
    const eyes = (y, z, sp, s) => { [-1, 1].forEach(k => part(g, GG.sph, e, [s, s, s], [k * sp, y, z])); };
    if (shape === 'blob') { part(g, GG.sph, m, [.9, .75, .9], [0, .75, 0]); eyes(1.05, .7, .3, .13); }
    else if (shape === 'jelly') { part(g, GG.sph, m, [.9, .7, .9], [0, 1.6, 0]); for (let i = 0; i < 4; i++) anim.push(['sway', part(g, GG.cyl, m, [.08, 1.2, .08], [Math.cos(i * 1.57) * .45, .8, Math.sin(i * 1.57) * .45])]); eyes(1.7, .75, .28, .12); }
    else if (shape === 'bat') { part(g, GG.sph, m, [.55, .55, .55], [0, 1.6, 0]); [-1, 1].forEach(k => anim.push(['flap', part(g, GG.box, m, [1.3, .06, .7], [k * .9, 1.65, 0]), k])); eyes(1.7, .45, .18, .1); }
    else if (shape === 'ghost') { part(g, GG.sph, m, [.7, .7, .7], [0, 1.9, 0]); part(g, GG.cone, m, [.75, 1.5, .75], [0, 1.0, 0], [Math.PI, 0, 0]); eyes(2.0, .6, .24, .12); }
    else if (shape === 'wolf') { part(g, GG.box, m, [.8, .7, 1.6], [0, .9, 0]); part(g, GG.box, m, [.6, .55, .65], [0, 1.3, .95]); [[-.3, .55], [.3, .55], [-.3, -.55], [.3, -.55]].forEach(([x, z]) => part(g, GG.box, m, [.18, .6, .18], [x, .3, z])); eyes(1.4, 1.28, .17, .09); }
    else if (shape === 'scorp') { part(g, GG.sph, m, [1.1, .45, 1.4], [0, .55, 0]); anim.push(['tail', part(g, GG.cone, m, [.25, 1.3, .25], [0, 1.4, -1.0], [-.6, 0, 0])]); [-1, 1].forEach(k => part(g, GG.sph, m, [.35, .2, .5], [k * .8, .55, 1.2])); eyes(.85, 1.15, .2, .09); }
    else if (shape === 'eye') { part(g, GG.sph, BASIC(0xf4f0ff), [1, 1, 1], [0, 1.8, 0]); part(g, GG.sph, m, [.5, .5, .25], [0, 1.8, .88]); part(g, GG.sph, BASIC(0x0a0a10), [.22, .22, .1], [0, 1.8, 1.05]); anim.push(['spin', part(g, GG.tor, m, [1.35, 1.35, 1.35], [0, 1.8, 0], [Math.PI / 2, 0, 0])]); }
    else if (shape === 'garg') { part(g, GG.box, m, [1, 1.2, .8], [0, 1.0, 0]); part(g, GG.box, m, [.7, .6, .6], [0, 1.95, .1]); [-1, 1].forEach(k => { part(g, GG.cone, m, [.14, .45, .14], [k * .25, 2.4, .1], [0, 0, -k * .4]); anim.push(['flap', part(g, GG.box, m, [1.1, .06, .6], [k * .95, 1.5, -.3]), k]); }); eyes(2.0, .42, .17, .09); }
    else if (shape === 'snake') { for (let i = 0; i < 6; i++) anim.push(['wave', part(g, GG.sph, m, [.55 - i * .05, .55 - i * .05, .55 - i * .05], [0, .55, .9 - i * .55]), i]); eyes(.75, 1.35, .2, .1); }
    else if (shape === 'golem') { part(g, GG.box, m, [1.4, 1.5, 1.0], [0, 1.25, 0]); part(g, GG.box, m, [.8, .7, .7], [0, 2.35, 0]); [-1, 1].forEach(k => part(g, GG.box, m, [.45, 1.3, .45], [k * 1.0, 1.1, 0])); eyes(2.4, .37, .2, .1); }
    else { part(g, GG.sph, m, [.9, .9, .9], [0, 1.6, 0]); anim.push(['spin', part(g, GG.tor, m, [1.5, 1.5, 1.5], [0, 1.6, 0], [Math.PI / 2.3, 0, 0])]); eyes(1.65, .85, .28, .12); }
    return { g, anim };
  }
  // 이름표(캔버스 한 장) + 체력바
  function nameTex(txt, col) { const c = document.createElement('canvas'); c.width = 320; c.height = 56; const x = c.getContext('2d'); x.font = '800 30px "Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 6; x.strokeStyle = 'rgba(0,0,0,.85)'; x.strokeText(txt, 160, 30); x.fillStyle = col; x.fillText(txt, 160, 30); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
  const sprite = (map, w, h, col) => { const s = new THREE.Sprite(new THREE.SpriteMaterial(Object.assign(map ? { map } : { color: col }, { fog: false, depthTest: false, transparent: true }))); s.scale.set(w, h, 1); s.renderOrder = 999; return s; };

  // ── 몬스터
  const mobs = [];
  let kills = 0, xpRun = 0, coinRun = 0, bossK = 0;
  const S = LS.get('lv3d_abyss', null) || { k: 0, b: 0, best: 0 };
  function pickSpot(zi) { const Z = ZONES[zi]; for (let tr = 0; tr < 20; tr++) { const a = rnd() * 6.283, r = Z.r0 + 1.5 + rnd() * (Z.r1 - Z.r0 - 3), x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.abs(x) < 3 && z < 0) continue; return [x, z]; } return [0, -(Z.r0 + 4)]; }
  function spawnMob(zi, opt) {
    opt = opt || {}; const Z = ZONES[zi]; let sp, L, boss = opt.boss;
    if (boss) { sp = [boss[0], boss[1], boss[2]]; L = boss[3]; }
    else { const pool = zi * 6 + Math.floor(rnd() * 6), low = Math.floor(rnd() * (zi * 6 + 6)); sp = SP[rnd() < .25 ? low : pool]; const u = rnd(); L = Math.round(Z.lv[0] + (Z.lv[1] - Z.lv[0]) * u * u * (1 + rnd() * .2)); L = Math.min(Z.lv[1], L); }
    const gold = !boss && rnd() < .06, [x, z] = opt.at || pickSpot(zi);
    const k = boss ? 20 : gold ? 3 : 1, sc = boss ? 3.2 : Math.min(2.4, .9 + Math.log10(L / 100) * .9) * (gold ? 1.15 : 1);
    const { g, anim } = body(sp[1], sp[2], gold, !!boss); g.scale.setScalar(sc); g.position.set(x, 0, z); group.add(g);
    const nm = (gold ? '✨황금 ' : '') + sp[0], col = boss ? '#ffd23a' : gold ? '#ffe27a' : ['#d8c8ff', '#9ad8ff', '#ffc08a', '#ff9aa8'][zi];
    const lab = sprite(nameTex(`Lv.${L} ${nm}`, col), 4.2, .74); const bg = sprite(null, 2.4, .2, 0x200810), fg = sprite(null, 2.3, .14, boss ? 0xffd23a : 0xff4a5a); fg.center.set(0, .5); bg.renderOrder = 998;
    group.add(lab, bg, fg);
    const hpMax = Math.round(HPF(L) * k), m = { sp, L, zi, nm, boss: !!boss, gold, x, z, hx: x, hz: z, sc, g, anim, lab, bg, fg, h: (sp[1] === 'golem' ? 3 : sp[1] === 'eye' || sp[1] === 'ghost' ? 2.8 : 2.2) * sc + .4,
      hp: hpMax, max: hpMax, aggro: 0, atkT: 1 + rnd(), wind: 0, flash: 0, wT: rnd() * 4, wx: x, wz: z, dead: 0, resp: 0, bossDef: boss };
    mobs.push(m); return m;
  }
  function freeMob(m) { group.remove(m.g, m.lab, m.bg, m.fg); m.lab.material.map.dispose(); [m.lab, m.bg, m.fg].forEach(s => s.material.dispose()); }
  ZONES.forEach((Z, zi) => { for (let i = 0; i < Z.cnt; i++) spawnMob(zi); });
  BOSSES.forEach((b, i) => { const a = i / 4 * 6.283 + .785; spawnMob(3, { boss: b, at: [Math.cos(a) * 64, Math.sin(a) * 64] }); });
  const alive = () => mobs.filter(m => !m.dead);
  const nearest = (x, z, maxD) => { let b = null, bd = maxD; mobs.forEach(m => { if (m.dead) return; const d = hyp(m.x - x, m.z - z) - m.sc * .9; if (d < bd) { bd = d; b = m; } }); return b; };
  let me = { x: 0, z: 4.5 };
  function hitMob(m, dmg, crit, big) {
    if (m.dead) return; m.hp -= dmg; m.flash = .12; m.aggro = 8; floatW(m.x + (rnd() - .5), m.h * .8, m.z, (big ? '💥 ' : crit ? '⚡ ' : '') + fmtN(dmg), big ? 'df' : crit ? 'dc' : 'dn');
    spark(m.x, 1.3 * m.sc, m.z, crit || big ? 14 : 6, crit ? 0xffe04a : 0xffb38a, 4, 5, .5, 1); api.snd('punch', !!crit);
    if (m.hp <= 0) killMob(m);
  }
  function killMob(m) {
    m.dead = 1; m.resp = m.boss ? 90 : 3 + rnd() * 3; m.g.visible = m.lab.visible = m.bg.visible = m.fg.visible = false; kills++; S.k++;
    const mul = (m.boss ? 15 : m.gold ? 4 : 1) * 1.6, xp = EXPF(m.L) * mul, cn = COINF(m.L) * (m.boss ? 10 : m.gold ? 3 : 1);
    api.addPts(xp); addCoin(cn, '심연 사냥'); xpRun += xp; coinRun += cn;
    spark(m.x, 1.5, m.z, m.boss ? 160 : m.gold ? 70 : 30, m.boss || m.gold ? 0xffd23a : 0xb89aff, 6, 4, 1.2, 2);
    floatW(m.x, m.h + .6, m.z, `+${fmtN(xp)} XP`, 'dc');
    if (m.boss) { bossK++; S.b++; api.quake(.8, .9); tapeNote(`👑 ${m.nm} 처치!! 확정 SS 이상 장비 · XP +${fmtN(xp)}`, { ms: 3600, cls: 'tip' }); setTimeout(() => dropItem(20, rnd() < .25 ? 8 : 7), 700); }
    else if (m.gold || rnd() < DROPP(m.L)) setTimeout(() => dropItem(Math.min(20, m.L / 40), MING(m.L) + (m.gold ? 1 : 0)), 600);
    if (kills % 25 === 0) toast(`🌑 심연 대륙 ${kills}마리 처치! 이번 입장 XP +${fmtN(xpRun)} · 🪙 +${fmtN(coinRun)}`);
    if (kills > (S.best || 0)) S.best = kills; LS.set('lv3d_abyss', S);
  }
  function respawn(m) { const i = mobs.indexOf(m); freeMob(m); if (i >= 0) mobs.splice(i, 1); if (m.bossDef) { const a = Math.atan2(m.hz, m.hx); spawnMob(3, { boss: m.bossDef, at: [Math.cos(a) * 64, Math.sin(a) * 64] }); } else spawnMob(m.zi); }
  // 공격 (E · 꾹 누르면 연타 · 폰은 공격 버튼)
  addInter('rz_hit', { name: '⚔ 공격', X: 0, Z: -200, h: 2.2, btn: '⚔<br>공격', fn: () => { const tg = nearest(me.x, me.z, 4.4); if (!tg) { toast('⚔ 몬스터에게 가까이 가요!'); return; } api.face(tg.x, tg.z); const a = api.attack(); if (!a) return; hitMob(tg, a.dmg, a.crit); } });
  const unit = () => Math.max(1, api.unit());
  let autoT = 0; const stuck = { x: null, z: null, n: 0 };
  function tryAuto(dt) {
    if (!api.auto() || api.manual()) return; autoT -= dt; if (autoT > 0) return; autoT = .2;
    // 맵 전체에서 가장 가까운 몬스터(보스는 근처일 때만) → 걸어가요 · 크리스털에 걸리면 옆으로 비켜요
    let tg = nearest(me.x, me.z, 30); if (!tg) { let bd = 1e9; mobs.forEach(m => { if (m.dead || m.boss) return; const d = hyp(m.x - me.x, m.z - me.z); if (d < bd) { bd = d; tg = m; } }); } if (!tg) return;
    const d = hyp(tg.x - me.x, tg.z - me.z) - tg.sc * .9;
    if (stuck.x != null && hyp(me.x - stuck.x, me.z - stuck.z) < .3 && d > 3.2) { stuck.n++; } else stuck.n = 0; stuck.x = me.x; stuck.z = me.z;
    if (stuck.n >= 6) { stuck.n = 0; const a = rnd() * 6.283; api.walkTo(me.x + Math.cos(a) * 4, me.z + Math.sin(a) * 4); return; }
    if (d > 3.2) api.walkTo(tg.x - (tg.x - me.x) / (d + 1) * 2.4, tg.z - (tg.z - me.z) / (d + 1) * 2.4);
    else { api.face(tg.x, tg.z); const a = api.attack(); if (a) hitMob(tg, a.dmg, a.crit); if (api.autoM() >= 1) for (let s = 3; s >= 0; s--) if (api.skillReady(s)) { api.cast(s); break; } api.autoPower(); }
  }
  let near = null, cullT = 0;
  return {
    onAuto() { const on = !api.auto(); api.setAuto(on); toast(on ? '🤖 자동사냥 시작! 직접 움직이면 잠깐 멈춰요' : '🤖 자동사냥 멈춤'); },
    sky: 'abyss', camDist: () => (api.touch ? 32 : 26),
    bounds: { x0: -R + 1, x1: R - 1, z0: -R + 1, z1: R - 1 }, spawn: { x: 0, z: 3, ry: Math.PI },
    walk: (x, z) => { const r = hyp(x, z); if (r > R - 1) return false; for (let i = 0; i < DECO.length; i++) { const d = DECO[i]; if (Math.abs(d[0] - x) < d[2] && Math.abs(d[1] - z) < d[2] && hyp(d[0] - x, d[1] - z) < d[2]) return false; } return true; },
    onSkill(s, dmg) { const RR = [6, 7, 11, 18][s] || 8, mul = [1.2, 2.2, 1.4, 2.6][s] || 1.5; let n = 0; mobs.forEach(m => { if (!m.dead && hyp(m.x - me.x, m.z - me.z) < RR + m.sc * .6) { n++; hitMob(m, Math.round(dmg * mul), false, true); } }); spark(me.x, 1, me.z, 40 + RR * 4, [0xff7a1a, 0x41c9ff, 0x2fe07a, 0xffd76a][s], RR * .6, 2, .7, 1); if (!n) toast('✨ 범위 안에 몬스터가 없어요'); },
    tick(dt, t, pm) {
      me = pm; const r = hyp(pm.x, pm.z), zi = zoneOf(r), safe = r < HUB;
      if (safe && t % 1 < dt) api.heal(api.hp().max * .05);
      // 가까운 몬스터에 공격 버튼
      near = nearest(pm.x, pm.z, 4.4); if (near) { const dx = pm.x - near.x, dz = pm.z - near.z, L = hyp(dx, dz) || 1, k = Math.min(L, near.sc * .8) / L; setInter('rz_hit', near.x + dx * k, near.z + dz * k, false); } else setInter('rz_hit', 0, -200, true);
      tryAuto(dt);
      cullT -= dt; const doCull = cullT <= 0; if (doCull) cullT = .25;
      mobs.forEach(m => {
        if (m.dead) { m.resp -= dt; if (m.resp <= 0) respawn(m); return; }
        const dx = pm.x - m.x, dz = pm.z - m.z, d = hyp(dx, dz), vis = d < 36;
        if (doCull) { m.g.visible = vis; m.lab.visible = m.bg.visible = m.fg.visible = vis && d < 22; }
        if (!vis && !m.aggro) return;
        // 어그로
        const pr = hyp(pm.x, pm.z) < HUB + .5; if (!pr && d < (m.boss ? 16 : 11)) m.aggro = Math.max(m.aggro, 4);
        if (m.aggro > 0 && (d > 28 || pr)) m.aggro -= dt * 3; else if (m.aggro > 0 && d > 3) m.aggro -= dt * .3;
        const spd = (m.boss ? 3.2 : 4.2) * (m.aggro > 0 ? 1 : .35), atkR = 1.5 + m.sc * .7;
        if (m.aggro > 0 && !pr) {
          if (m.wind > 0) { m.wind -= dt; m.g.scale.setScalar(m.sc * (1 + .2 * Math.sin((1 - m.wind / .6) * Math.PI))); if (m.wind <= 0) { m.g.scale.setScalar(m.sc); if (d < atkR + .7 && pm.y < 1.4) { const hp = api.hp(), pct = Math.min(m.boss ? .35 : .22, (.05 + .015 * Math.log2(Math.max(1, m.hp / unit()))) * (m.boss ? 1.6 : m.gold ? 1.2 : 1)); api.hurt(Math.max(1, Math.round(hp.max * pct)), m.x, m.z, m.boss ? '👑' : ''); } } }
          else { if (d > atkR * .8) { m.x += dx / (d || 1) * spd * dt; m.z += dz / (d || 1) * spd * dt; } m.atkT -= dt; if (m.atkT <= 0 && d < atkR) { m.atkT = m.boss ? 1.1 : 1.4; m.wind = .5; } }
          m.g.rotation.y = Math.atan2(dx, dz);
        } else { m.wT -= dt; if (m.wT <= 0) { m.wT = 3 + rnd() * 4; const a = rnd() * 6.283; m.wx = m.hx + Math.cos(a) * 4; m.wz = m.hz + Math.sin(a) * 4; } const wx = m.wx - m.x, wz = m.wz - m.z, wd = hyp(wx, wz); if (wd > .3) { m.x += wx / wd * spd * dt; m.z += wz / wd * spd * dt; m.g.rotation.y = Math.atan2(wx, wz); } if (m.hp < m.max) m.hp = Math.min(m.max, m.hp + m.max * .05 * dt); }
        // 안전지대 밖으로 (가운데엔 못 들어와요) · 맵 밖으로도 못 나가요
        { const mr = hyp(m.x, m.z); if (mr < HUB + 1) { m.x *= (HUB + 1) / (mr || 1); m.z *= (HUB + 1) / (mr || 1); } if (mr > R - 1.5) { m.x *= (R - 1.5) / mr; m.z *= (R - 1.5) / mr; } }
        m.g.position.set(m.x, m.anim.length && (m.sp[1] === 'bat' || m.sp[1] === 'ghost' || m.sp[1] === 'eye') ? Math.sin(t * 2 + m.hx) * .25 : 0, m.z);
        if (m.flash > 0) m.flash -= dt;
        if (d < 22) { m.anim.forEach(([k, o, a]) => { if (k === 'flap') o.rotation.z = (a || 1) * Math.sin(t * 10 + m.hx) * .5; else if (k === 'spin') o.rotation.z += dt * 2; else if (k === 'sway') o.rotation.x = Math.sin(t * 3 + m.hz) * .3; else if (k === 'tail') o.rotation.x = -.6 + Math.sin(t * 5) * .2; else if (k === 'wave') o.position.x = Math.sin(t * 4 - a * .8) * .3; });
          const y = m.h; m.lab.position.set(m.x, y + .45, m.z); m.bg.position.set(m.x, y, m.z); const f = Math.max(0, m.hp / m.max); m.fg.scale.x = Math.max(.001, 2.3 * f); m.fg.position.set(m.x - 1.15, y + .001, m.z); }
      });
      const Z = zi >= 0 ? ZONES[zi] : null;
      gauge(`🌑 심연 대륙 · ${Z ? Z.n + ' Lv' + Z.lv[0] + '~' + Z.lv[1] : '🛡 안전지대 (회복)'} · 처치 ${kills} · XP +${fmtN(xpRun)}${api.auto() ? ' · 🤖' : ''}`, Z ? Math.round((zi + 1) / 4 * 100) : 100, Z ? '#' + Z.line.toString(16).padStart(6, '0') : '#7a5aff');
    },
    dbg: { st: () => ({ n: alive().length, total: mobs.length, kills, xpRun, coinRun, bossK, me, zones: ZONES.map((z, i) => alive().filter(m => m.zi === i && !m.boss).length), bosses: alive().filter(m => m.boss).map(m => [m.nm, m.L, m.hp]) }),
      nearest: () => { const m = nearest(me.x, me.z, 999); return m && { nm: m.nm, L: m.L, hp: m.hp, x: m.x, z: m.z }; }, kill: () => { const m = nearest(me.x, me.z, 999); if (m) hitMob(m, m.hp + 1, true); }, mobs: () => mobs.length, hpf: HPF, expf: EXPF },
    dispose() { mobs.forEach(m => { try { freeMob(m); } catch (e) {} }); }
  };
};
