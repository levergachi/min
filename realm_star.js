/* 🔭 별 관측소 (개미시티 세계 #2) — 힐링 + 수집형 · M 크기
   build(api) → { bounds, walk(x,z), spawn, tick(dt,t,me), sky, dbg, dispose }  좌표는 세계 안 로컬(원형 반경 14.5) */
(window.WB_REALMS = window.WB_REALMS || {}).star = function (api) {
  const { THREE, group, GEO, mesh, M, sign, addInter, toast, tapeNote, gauge, LS, kstDate, givePts, growCoin, addCoin, G, floatMe, fx, leave, dropItem, saveG, camera } = api;
  const add = o => { group.add(o); return o; };
  const R = 14.5;
  const STONE = M(0x2b3563, { roughness: .8, emissive: 0x0a0f26 }), STONE2 = M(0x3a4680, { roughness: .7, emissive: 0x101a3e }), GLOW = new THREE.MeshBasicMaterial({ color: 0x8fb4ff, fog: false });
  // ── 하늘: 별 · 달 (카메라를 따라다녀서 아주 멀리 있는 것처럼 보임)
  const sky = new THREE.Group(); group.add(sky);
  { const N = 900, pos = new Float32Array(N * 3), col = new Float32Array(N * 3); let s = 7;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < N; i++) { const u = rnd() * 2 - 1, a = rnd() * Math.PI * 2, h = Math.abs(u) * .92 + .04, r = Math.sqrt(1 - h * h); pos.set([Math.cos(a) * r * 360, h * 360, Math.sin(a) * r * 360], i * 3);
      const k = rnd(), c = k < .6 ? [1, 1, 1] : k < .85 ? [.7, .82, 1] : [1, .88, .6]; col.set(c, i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    var stars = new THREE.Points(g, new THREE.PointsMaterial({ size: 2.6, sizeAttenuation: false, vertexColors: true, fog: false, transparent: true, opacity: .95, depthWrite: false })); stars.frustumCulled = false; sky.add(stars); }
  { const mg = new THREE.Mesh(new THREE.SphereGeometry(18, 24, 18), new THREE.MeshBasicMaterial({ color: 0xfff3cf, fog: false })); mg.position.set(-150, 150, -260); sky.add(mg);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(30, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffe9b0, fog: false, transparent: true, opacity: .16, depthWrite: false })); hl.position.copy(mg.position); sky.add(hl);
    const hl2 = new THREE.Mesh(new THREE.SphereGeometry(52, 20, 14), new THREE.MeshBasicMaterial({ color: 0xbfd2ff, fog: false, transparent: true, opacity: .07, depthWrite: false })); hl2.position.copy(mg.position); sky.add(hl2); }
  // ── 바닥: 떠 있는 별빛 정원
  add(mesh(GEO.cyl, STONE, [R + .6, .5, R + .6], [0, -.25, 0]));
  add(mesh(GEO.cyl, STONE2, [R - .6, .12, R - .6], [0, .04, 0]));
  { const ring = (r, w, c) => { const m = new THREE.Mesh(new THREE.RingGeometry(r - w, r, 64), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .55, side: THREE.DoubleSide, fog: false })); m.rotation.x = -Math.PI / 2; m.position.y = .12; return add(m); };
    ring(R - .5, .22, 0x8fb4ff); ring(10.5, .1, 0x6a8ee8); ring(6.6, .1, 0x6a8ee8); ring(3, .08, 0xffd76a); }
  { // 별자리 무늬(바닥)
    const pts = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * 10.5, .13, Math.sin(a) * 10.5)); }
    for (let i = 0; i < 12; i++) add(mesh(GEO.sph, GLOW, [.22, .06, .22], [pts[i].x, .15, pts[i].z])); }
  // 아래로 매달린 바위 (떠 있는 섬 느낌)
  [[0, 0, 7.5, 6], [-7, 4, 4, 4.5], [6.5, -3, 4.5, 4], [3, 7, 3, 3.2]].forEach(([x, z, w, h]) => { const c = mesh(GEO.cone, M(0x1c2347, { roughness: .95 }), [w, h, w], [x, -.5 - h / 2, z]); c.rotation.x = Math.PI; add(c); });
  // 난간 + 등불 (남쪽 출입구 비움)
  const lanterns = [];
  for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2; const x = Math.cos(a) * (R - .15), z = Math.sin(a) * (R - .15); if (z > 11 && Math.abs(x) < 3.2) continue;
    add(mesh(GEO.cyl, STONE2, [.14, 1.1, .14], [x, .55, z])); if (i % 2 === 0) { const l = add(mesh(GEO.sph, new THREE.MeshBasicMaterial({ color: 0xffd98a, fog: false }), [.26, .26, .26], [x, 1.3, z])); lanterns.push(l); } }
  // 출입문 (남쪽)
  [-1, 1].forEach(s => add(mesh(GEO.box, STONE2, [.5, 3.4, .5], [s * 2.3, 1.7, R - .6]))); add(mesh(GEO.box, STONE2, [5.1, .5, .6], [0, 3.5, R - .6]));
  add(mesh(GEO.box, new THREE.MeshBasicMaterial({ color: 0x4a6ee0, transparent: true, opacity: .4, fog: false, side: THREE.DoubleSide, depthWrite: false }), [4, 3.2, .05], [0, 1.7, R - .6]));
  add(sign('🚪 나가기', 3.4, .8, '#e1ebff', '#4a6ee0')).position.set(0, 4.4, R - .6);
  // ── 대망원경
  const SC = { x: 0, z: -5.5 };
  add(mesh(GEO.cyl, STONE2, [1.5, .5, 1.5], [SC.x, .25, SC.z])); add(mesh(GEO.cyl, M(0x56608f, { roughness: .5, metalness: .4 }), [.5, 1.6, .5], [SC.x, 1.2, SC.z]));
  const tube = new THREE.Group(); tube.position.set(SC.x, 2.1, SC.z); group.add(tube); tube.rotation.set(.85, .35, 0);
  { const t1 = mesh(GEO.cyl, M(0x9aa8d8, { roughness: .55, metalness: .35 }), [.5, 3.2, .5], [0, 1.3, 0]), t2 = mesh(GEO.cyl, M(0x8fa4e8, { roughness: .35, metalness: .6, emissive: 0x1a2a6a }), [.62, .45, .62], [0, 3.0, 0]);
    const lens = mesh(GEO.sph, new THREE.MeshBasicMaterial({ color: 0xaad0ff, fog: false }), [.45, .1, .45], [0, 3.24, 0]); tube.add(t1, t2, lens); }
  add(sign('🔭 대망원경', 4, .9, '#e1ebff', '#4a6ee0')).position.set(SC.x, 5.6, SC.z);
  // ── 소원 돌 (별똥별이 떨어질 때 빌기)
  const WS = { x: 8.6, z: 2.6 };
  add(mesh(GEO.cyl, STONE2, [1.5, .35, 1.5], [WS.x, .17, WS.z]));
  const crystalM = M(0x9fd0ff, { roughness: .2, emissive: 0x4a8cff, emissiveIntensity: .8, transparent: true, opacity: .9 });
  const crystal = add(mesh(GEO.cone, crystalM, [.7, 2.2, .7], [WS.x, 1.5, WS.z])); const crystal2 = add(mesh(GEO.cone, crystalM, [.7, 1.1, .7], [WS.x, .55, WS.z])); crystal2.rotation.x = Math.PI;
  add(sign('🌠 소원 돌', 3.4, .8, '#e1ebff', '#7a8cff')).position.set(WS.x, 3.8, WS.z);
  // ── 별빛 담요 (누워서 별 헤기)
  const BL = { x0: -11.5, x1: -5.5, z0: 2, z1: 8 };
  add(mesh(GEO.box, M(0x5a3d8a, { roughness: .95, emissive: 0x1a1030 }), [6, .08, 6], [-8.5, .1, 5])); add(mesh(GEO.box, M(0xffd76a, { roughness: .9, emissive: 0x3a2a00 }), [5.2, .09, .25], [-8.5, .12, 5]));
  [[-10, 3.6], [-8.3, 3.4], [-7, 3.8]].forEach(([x, z]) => add(mesh(GEO.sph, M(0xf1e6ff, { roughness: .95 }), [.55, .25, .4], [x, .28, z])));
  add(sign('🌌 별빛 담요 · 올라서 별 헤기', 5.6, .8, '#efe6ff', '#8a5ae0')).position.set(-8.5, 3, 8.6);
  // ── 별자리 도감 비석
  const BK = { x: -9, z: -6.5 };
  add(mesh(GEO.box, STONE2, [1.6, 2.6, .5], [BK.x, 1.3, BK.z])); add(mesh(GEO.box, new THREE.MeshBasicMaterial({ color: 0x8fb4ff, fog: false }), [1.3, 2.3, .06], [BK.x, 1.3, BK.z + .27]));
  add(sign('📜 별자리 도감', 4, .8, '#e1ebff', '#4a6ee0')).position.set(BK.x, 3.5, BK.z);
  // ── 반짝이는 별가루 (바닥 위)
  const dust = (() => { const N = 120, p = new Float32Array(N * 3); let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < N; i++) { const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * (R - 1); p.set([Math.cos(a) * r, .3 + rnd() * 5, Math.sin(a) * r], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); const pt = new THREE.Points(g, new THREE.PointsMaterial({ size: 3.2, sizeAttenuation: false, color: 0xcfe0ff, transparent: true, opacity: .8, fog: false, depthWrite: false })); pt.frustumCulled = false; return add(pt); })();

  // ── 별자리 8개 (좌표는 -1..1 평면, 선분은 점 번호 쌍)
  const CONS = [
    { id: 'bull', ico: '🐂', nm: '황소자리', sub: '불장의 별 — 강세장이 오면 가장 먼저 반짝여요', p: [[-.9, .5], [-.4, .15], [0, 0], [.4, .2], [.9, .65], [.35, -.4], [.7, -.75], [0, .45]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [2, 7]] },
    { id: 'bear', ico: '🐻', nm: '곰자리', sub: '하락장의 별 — 곰은 자는 척하지만 지켜보고 있어요', p: [[-.9, -.2], [-.5, -.35], [-.1, -.2], [.25, 0], [.6, .3], [.9, .1], [.7, -.35]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] },
    { id: 'lion', ico: '🦁', nm: '사자자리', sub: '존버의 별 — 갈기가 길수록 오래 버텼다는 뜻', p: [[-.8, -.5], [-.5, -.1], [-.55, .4], [-.15, .7], [.2, .5], [.1, .05], [.6, -.1], [.9, -.5]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 1], [5, 6], [6, 7]] },
    { id: 'scor', ico: '🦂', nm: '전갈자리', sub: '물타기의 별 — 꼬리의 독침이 평단을 낮춰요', p: [[-.9, .55], [-.55, .35], [-.2, .15], [.1, -.1], [.4, -.4], [.75, -.55], [.95, -.2], [.85, .15]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]] },
    { id: 'lyra', ico: '🎵', nm: '거문고자리', sub: '배당의 별 — 통장에 울리는 아름다운 소리', p: [[0, .8], [-.35, .3], [.35, .3], [-.35, -.35], [.35, -.35], [0, -.8]], e: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [1, 2], [3, 5], [4, 5]] },
    { id: 'swan', ico: '🦢', nm: '백조자리', sub: '반등의 별 — 물 밑에서는 쉬지 않고 발을 저어요', p: [[0, .85], [0, .3], [0, -.2], [0, -.8], [-.7, .15], [.7, .15]], e: [[0, 1], [1, 2], [2, 3], [4, 1], [1, 5]] },
    { id: 'orion', ico: '🏹', nm: '오리온자리', sub: '손절의 별 — 허리띠 세 별이 지지선을 알려줘요', p: [[-.5, .8], [.5, .8], [-.15, .05], [0, .02], [.15, -.01], [-.55, -.8], [.5, -.8]], e: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [0, 1]] },
    { id: 'twin', ico: '👯', nm: '쌍둥이자리', sub: '레버리지의 별 — 두 배로 오르고 두 배로 내려요', p: [[-.45, .85], [.45, .85], [-.4, .3], [.4, .3], [-.35, -.3], [.35, -.3], [-.5, -.85], [.5, -.85]], e: [[0, 2], [2, 4], [4, 6], [1, 3], [3, 5], [5, 7], [2, 3]] }
  ];
  const consGrp = new THREE.Group(); consGrp.position.set(0, 4.6, -10.5); group.add(consGrp); let consT = 0;
  const showCons = c => { while (consGrp.children.length) { const o = consGrp.children.pop(); o.geometry && o.geometry.dispose(); o.material && o.material.dispose(); }
    const Sx = 5.2, Sy = 3.1, pts = c.p.map(([x, y]) => new THREE.Vector3(x * Sx, y * Sy, 0)); const lp = []; c.e.forEach(([a, b]) => { lp.push(pts[a], pts[b]); });
    const ln = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lp), new THREE.LineBasicMaterial({ color: 0x9fc4ff, transparent: true, opacity: .9, fog: false })); consGrp.add(ln);
    pts.forEach(v => { const sp = new THREE.Mesh(new THREE.SphereGeometry(.26, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff1b8, fog: false, transparent: true })); sp.position.copy(v); consGrp.add(sp); });
    consT = 9; };

  // ── 저장 데이터
  const S = LS.get('lv3d_star', null) || { d: '', n: 0, sc: 0, wn: 0, seen: [], wish: 0, claim: 0 }; if (!Array.isArray(S.seen)) S.seen = []; if (S.d !== kstDate()) { S.d = kstDate(); S.n = 0; S.sc = 0; S.wn = 0; } const save = () => LS.set('lv3d_star', S);
  const DAILY = 120, SCOPE_DAILY = 16, WISH_DAILY = 10;
  // ── 별똥별
  const meteors = []; let nextMeteor = 9, winUntil = 0, lastScope = 0, lastBlanket = 0, wasBlanket = false;
  const mkMeteor = big => { const g = new THREE.Group(), head = new THREE.Mesh(GEO.sph, new THREE.MeshBasicMaterial({ color: big ? 0xfff6d0 : 0xdfeaff, fog: false }));
    head.scale.setScalar(big ? .8 : .35); const tail = new THREE.Mesh(GEO.cone, new THREE.MeshBasicMaterial({ color: big ? 0xffd88a : 0xaac8ff, transparent: true, opacity: big ? .6 : .45, fog: false, depthWrite: false }));
    tail.scale.set(big ? 1.1 : .5, big ? 11 : 6, big ? 1.1 : .5); tail.position.y = big ? 5.5 : 3; g.add(head, tail); group.add(g); return g; };
  const spawnMeteor = big => { const g = mkMeteor(big), a = Math.random() * Math.PI * 2, from = new THREE.Vector3(Math.cos(a) * 34, 16 + Math.random() * 8, Math.sin(a) * 34), to = new THREE.Vector3(-Math.cos(a) * 20 + (Math.random() * 10 - 5), 2 + Math.random() * 3, -Math.sin(a) * 20 + (Math.random() * 10 - 5));
    const dir = to.clone().sub(from).normalize(); g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().negate()); g.position.copy(from); meteors.push({ g, from, to, t: 0, dur: big ? 3.4 : 1.8 }); };
  const wishNow = () => performance.now() < winUntil;
  // ── 상호작용
  addInter('rz_scope', { name: '🔭 별자리 관측', X: SC.x, Z: SC.z + 2.2, h: 3, btn: '🔭<br>관측', fn: () => { const t = performance.now(); if (t - lastScope < 4500) { toast('🔭 렌즈를 맞추는 중… 잠깐만요'); return; } lastScope = t;
    const unseen = CONS.filter(c => !S.seen.includes(c.id)), c = unseen.length && Math.random() < .75 ? unseen[(Math.random() * unseen.length) | 0] : CONS[(Math.random() * CONS.length) | 0], isNew = !S.seen.includes(c.id);
    showCons(c); try { api.snd && api.snd('pop'); } catch (e) {} if (isNew) { S.seen.push(c.id); save(); addCoin(growCoin(40), '새 별자리 발견'); givePts(12, .05); fx.firework(); tapeNote(`✨ 새 별자리 발견! ${c.ico} ${c.nm} (${S.seen.length}/${CONS.length})`, { ms: 3200, cls: 'tip' }); }
    else if (S.sc < SCOPE_DAILY) { S.sc++; const g = givePts(6, .02); save(); floatMe(`🔭 +${g}`, 'txt'); tapeNote(`${c.ico} ${c.nm} — ${c.sub}`, { ms: 3200, cls: 'tip' }); } else tapeNote(`${c.ico} ${c.nm} — ${c.sub}`, { ms: 3200, cls: 'tip' });
    toast(`${c.ico} ${c.nm}${isNew ? ' · NEW' : ''}`); } });
  addInter('rz_wish', { name: '🌠 소원 빌기', X: WS.x - 2, Z: WS.z, h: 2.6, btn: '🌠<br>소원', fn: () => { const t = performance.now();
    if (!wishNow()) { toast('🌠 별똥별이 떨어지는 순간에 빌어야 이뤄져요! 하늘을 지켜봐요 ✨'); return; }
    winUntil = 0; if (S.wn >= WISH_DAILY) { toast('🌠 오늘은 소원을 충분히 빌었어요 (내일 또!)'); return; } S.wn++; S.wish++; const g = givePts(28, .08); addCoin(growCoin(70), '소원 성취'); save(); fx.firework(); floatMe(`🌠 +${g}`, 'txt');
    tapeNote(`🌠 소원이 하늘에 닿았어요! XP +${g} (오늘 ${S.wn}/${WISH_DAILY})`, { ms: 3000, cls: 'tip' }); if (S.wish % 5 === 0) { dropItem(2); toast('🎁 소원 5번 성취! 별빛 선물이 떨어졌어요'); } } });
  addInter('rz_book', { name: '📜 별자리 도감 (칭호)', X: BK.x + 2, Z: BK.z + 1.4, h: 2.6, btn: '📜<br>도감', fn: () => { const T = [[3, '별 헤는 개미', 150], [6, '별자리 박사', 380], [8, '은하수 개미', 800]], n = S.seen.length, nx = T.find(x => n >= x[0] && S.claim < x[0]);
    if (nx) { S.claim = nx[0]; save(); G.title = nx[1]; saveG(); addCoin(growCoin(nx[2]), '도감 보상'); dropItem(nx[0] >= 8 ? 4 : 2); fx.firework(); toast(`📜 한정 칭호 「${nx[1]}」 획득!`); return; }
    const nn = T.find(x => S.claim < x[0]); toast(nn ? `📜 별자리 ${n}/${CONS.length} — ${nn[0]}개를 모으면 「${nn[1]}」!` : '📜 모든 별자리를 모았어요. 당신은 은하수 개미 ✨'); } });
  addInter('rz_out', { name: '🚪 나가기', X: 0, Z: R - 2.6, h: 2.6, btn: '🚪<br>나가기', fn: () => leave() });
  const hyp = Math.hypot;
  return {
    sky: 'night', camDist: () => (api.touch ? 30 : 25),
    bounds: { x0: -R + .7, x1: R - .7, z0: -R + .7, z1: R - .7 }, spawn: { x: 0, z: 9, ry: Math.PI },
    walk: (x, z) => { if (hyp(x, z) > R - .7) return false; if (hyp(x - SC.x, z - SC.z) < 1.2) return false; if (hyp(x - WS.x, z - WS.z) < 1.1) return false; if (x > BK.x - .9 && x < BK.x + .9 && z > BK.z - .4 && z < BK.z + .4) return false; return true; },
    tick(dt, t, me) {
      const cam = camera.position; sky.position.set(cam.x - group.position.x, cam.y - group.position.y, cam.z - group.position.z);
      stars.material.opacity = .78 + Math.sin(t * 1.7) * .17; dust.material.opacity = .55 + Math.sin(t * 2.3) * .3; dust.rotation.y += dt * .02;
      lanterns.forEach((l, i) => { const s = .26 + Math.sin(t * 2 + i) * .03; l.scale.set(s, s, s); });
      crystal.rotation.y += dt * .6; crystal2.rotation.y -= dt * .6; const on = wishNow(); crystalM.emissiveIntensity = on ? 2.2 + Math.sin(t * 12) * .8 : .7 + Math.sin(t * 2) * .15; crystal.position.y = 1.5 + Math.sin(t * 1.5) * .12;
      // 별똥별 일정: 큰 별똥별(소원 창) + 작은 장식 별똥별
      nextMeteor -= dt; if (nextMeteor <= 0) { nextMeteor = 28 + Math.random() * 22; spawnMeteor(true); winUntil = performance.now() + 5200; tapeNote('🌠 별똥별이다! 지금 소원 돌에서 [소원]!', { ms: 3600, cls: 'tip' }); }
      if (Math.random() < dt * .12) spawnMeteor(false);
      for (let i = meteors.length - 1; i >= 0; i--) { const m = meteors[i]; m.t += dt / m.dur; if (m.t >= 1) { group.remove(m.g); m.g.traverse(o => { if (o.material) o.material.dispose(); }); meteors.splice(i, 1); continue; } m.g.position.lerpVectors(m.from, m.to, m.t); }
      if (consT > 0) { consT -= dt; const a = Math.min(1, consT / 1.5); consGrp.children.forEach(o => { if (o.material) o.material.opacity = a; }); consGrp.visible = consT > 0; if (consT <= 0) { while (consGrp.children.length) { const o = consGrp.children.pop(); o.geometry && o.geometry.dispose(); o.material && o.material.dispose(); } } }
      // 담요 위: 별 헤기 (XP 천천히)
      const inB = me.x >= BL.x0 && me.x <= BL.x1 && me.z >= BL.z0 && me.z <= BL.z1, now = performance.now();
      if (inB && !wasBlanket) tapeNote('🌌 담요에 올라 별을 헤는 중… 조용히 XP가 쌓여요', { ms: 2400, cls: 'tip' }); wasBlanket = inB;
      if (inB && now - lastBlanket > 4000) { lastBlanket = now; if (S.n < DAILY) { S.n++; const g = givePts(2, .01); save(); floatMe(`✨ +${g}`, 'txt'); } }
      gauge(`🔭 별 관측소 · 별자리 ${S.seen.length}/${CONS.length} · 소원 ${S.wn}/${WISH_DAILY}` + (on ? ' · 🌠 지금 소원 빌기!' : inB ? ` · 🌌 별 헤기 ${S.n}/${DAILY}` : ''), Math.round(S.seen.length / CONS.length * 100), on ? '#ffd76a' : '#6a8ee8');
    },
    dbg: { sky, tube, group, consGrp, meteor: () => { spawnMeteor(true); winUntil = performance.now() + 5200; }, get: () => ({ S, win: wishNow(), meteors: meteors.length }), setNext: v => { nextMeteor = v; }, seeAll: () => { S.seen = CONS.map(c => c.id); save(); } },
    dispose() { group.traverse(o => { if ((o.isPoints || o.isLine || o.isLineSegments) && o.geometry) { o.geometry.dispose(); o.material && o.material.dispose(); } }); }
  };
};
