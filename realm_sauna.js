/* ♨ 찜질방 (원복 객장 세계 #1) — 휴식형 · S 크기
   build(api) → { bounds, walk(x,z), spawn, tick(dt,t) }  좌표는 세계 안 로컬(−14..14, −11..11) */
(window.WB_REALMS = window.WB_REALMS || {}).sauna = function (api) {
  const { THREE, group, GEO, mesh, M, sign, addInter, toast, tapeNote, gauge, LS, kstDate, givePts, growCoin, addCoin, G, floatMe, fx, leave, dropItem, saveG } = api;
  const WOOD = M(0xb98a52, { roughness: .8 }), WOOD2 = M(0x8a5f32, { roughness: .85 }), WALL = M(0xd8b98a, { roughness: .9 }), CLAY = M(0x9c4a2a, { roughness: .9, emissive: 0x3a1204 });
  const add = o => { group.add(o); return o; };
  // 바닥·벽 (천장 없음: 위에서 내려다보는 디오라마)
  add(mesh(GEO.box, WOOD, [28, .2, 22], [0, -.1, 0]));
  const wall = (w, d, x, z) => add(mesh(GEO.box, WALL, [w, 3.2, d], [x, 1.6, z]));
  wall(28.4, .4, 0, -11.2); wall(.4, 22.4, -14.2, 0); wall(.4, 22.4, 14.2, 0); wall(11, .4, -8.5, 11.2); wall(11, .4, 8.5, 11.2);
  // 불가마 (왼쪽 위)
  add(mesh(GEO.box, M(0xd9733a, { roughness: .9, emissive: 0x4a1606 }), [11, .06, 10], [-8.5, .03, -6]));
  const kiln = add(mesh(GEO.sph, CLAY, [2.6, 1.9, 2.6], [-8.5, 0, -8])); const kmouth = add(mesh(GEO.sph, M(0xffa22e, { emissive: 0xff7a10, emissiveIntensity: 1.6 }), [1, .75, .4], [-8.5, .9, -6.3]));
  const kwall = (w, d, x, z) => add(mesh(GEO.box, WOOD2, [w, 1.2, d], [x, .6, z]));
  kwall(11, .3, -8.5, -1); kwall(.3, 10, -14, -6);
  add(sign('🔥 불가마', 5, 1.1, '#ffd9a0', '#ff7a10')).position.set(-8.5, 3, -10.9);
  // 얼음방 (오른쪽 위)
  add(mesh(GEO.box, M(0xcdeaff, { roughness: .35, emissive: 0x0b2a48 }), [11, .06, 10], [8.5, .03, -6]));
  for (let i = 0; i < 9; i++) { const a = i * 2.1; add(mesh(GEO.cone, M(0x9fe4ff, { emissive: 0x2da8e8, emissiveIntensity: .9, transparent: true, opacity: .85, roughness: .2 }), [.45 + (i % 3) * .15, 1.2 + (i % 4) * .5, .45], [6 + (i * 1.1) % 5.6, .6 + (i % 4) * .25, -9.5 + (i % 3) * 1.4], [0, a, 0])); }
  for (let i = 0; i < 5; i++) add(mesh(GEO.sph, M(0xffffff, { roughness: .9 }), [.9 + i * .1, .5, .9], [4.5 + i * 2.2, .2, -2.6 - (i % 2) * .5]));
  kwall(11, .3, 8.5, -1).material = M(0x7ab6e0, { roughness: .4 }); kwall(.3, 10, 14, -6).material = M(0x7ab6e0, { roughness: .4 });
  add(sign('❄ 얼음방', 5, 1.1, '#d6f3ff', '#2da8e8')).position.set(8.5, 3, -10.9);
  // 휴게 홀: 벤치 · 양머리 수건 · 식혜 판매대 · 단골 카드 · 출입문
  [[-10, 3.5], [-6, 3.5], [10, 3.5], [6, 3.5]].forEach(([x, z]) => { add(mesh(GEO.box, WOOD2, [3, .5, .9], [x, .25, z])); [-1, 1].forEach(s => add(mesh(GEO.sph, M(0xffffff, { roughness: .9 }), [.28, .22, .28], [x + s * .8, .72, z])));
    add(mesh(GEO.sph, M(0xf5f0e6, { roughness: .95 }), [.34, .26, .3], [x, .74, z - .1])); });
  add(mesh(GEO.box, WOOD2, [4, 1.1, 1.2], [-8, .55, 8])); add(mesh(GEO.box, M(0xfff1d0), [4.2, .1, 1.4], [-8, 1.15, 8]));
  for (let i = 0; i < 4; i++) add(mesh(GEO.cyl, M(0xffe6c0, { roughness: .6 }), [.18, .34, .18], [-9.2 + i * .8, 1.37, 8]));
  add(sign('🥤 식혜 · 맥반석 계란', 6, 1, '#fff3c4', '#ffb020')).position.set(-8, 3, 8.4);
  add(mesh(GEO.box, WOOD2, [2.2, 1.1, 1.0], [8, .55, 8])); add(mesh(GEO.box, M(0xffd76a, { emissive: 0x6a4a00, emissiveIntensity: .6 }), [1.9, .08, .8], [8, 1.14, 8]));
  add(sign('🎫 단골 카드', 4, .9, '#fff3c4', '#ffb020')).position.set(8, 2.6, 8.4);
  add(mesh(GEO.box, M(0x6b3f1d), [3.2, 2.6, .25], [0, 1.3, 11.1])); add(sign('🚪 나가기', 3.2, .8, '#ffe2e6', '#ff4d57')).position.set(0, 3, 10.6);
  const doorLbl = true; void doorLbl;
  // 상호작용
  const S = LS.get('lv3d_sauna', null) || { d: '', n: 0, tot: 0, claim: 0 }; if (S.d !== kstDate()) { S.d = kstDate(); S.n = 0; } const save = () => LS.set('lv3d_sauna', S);
  const now0 = () => performance.now(); let lastCine = 0, lastIceC = 0, wasIce = false; const DAILY = 150; let heat = 5, sik = 0, lastTick = 0, lockUntil = 0, comboT = 0, wasHot = 0, lastSq = 0, inKiln = false, inIce = false, over = 0;
  addInter('rz_kiln', { name: '🔥 불가마 땀 짜내기', X: -8.5, Z: -4.6, h: 2.6, btn: '🔥<br>땀', fn: () => { const t = performance.now();
    if (t < lockUntil) { toast('🥵 잠깐 쉬어야 해요…'); return; } if (t - lastSq < 5000) { toast('⏳ 땀은 5초에 한 번만 짜져요'); return; }
    if (heat < 60) { toast('😌 아직 덜 달궈졌어요! 가마 안에서 조금 더 버텨요 (60% 이상)'); return; } if (heat >= 96) { toast('🚨 너무 뜨거워요! 지금 나가요!'); return; }
    lastSq = t; const sweet = heat >= 70 && heat <= 92, g = givePts(sweet ? 14 : 5, sweet ? .05 : .02); S.tot += sweet ? 5 : 2; save(); fx.sweat(); if (now0() - lastCine > 22000) { lastCine = now0(); api.cine && api.cine('sauna'); } floatMe(sweet ? `💦 황금 땀방울! +${g}` : `💧 +${g}`, sweet ? 'big' : 'txt'); if (sweet) tapeNote(`💦 황금 땀방울! 공덕 +${g}`, { ms: 1800, cls: 'tip' }); } });
  addInter('rz_sik', { name: '🥤 식혜 (코인 30)', X: -8, Z: 6.6, h: 1.8, btn: '🥤<br>식혜', fn: () => { if ((G.coin | 0) < 30) { toast('🪙 코인이 부족해요 (30코인)'); return; } G.coin -= 30; saveG(); try { api.hud(); } catch (e) {} sik = performance.now() + 5 * 60e3; toast('🥤 시원한 식혜! 5분간 열이 천천히 올라요'); fx.sweat(); api.cine && api.cine('sikhye'); } });
  addInter('rz_card', { name: '🎫 단골 카드 (한정 칭호)', X: 8, Z: 6.6, h: 1.8, btn: '🎫<br>카드', fn: () => { const T = [[100, '찜질방 단골', 120], [300, '맥반석 달인', 400], [1000, '불가마 전설', 1500]];
    const nx = T.find(x => S.tot >= x[0] && S.claim < x[0]);
    if (nx) { S.claim = nx[0]; save(); G.title = nx[1]; saveG(); addCoin(growCoin(nx[2]), '단골 카드'); dropItem(nx[0] >= 1000 ? 4 : 2); toast(`🎫 한정 칭호 「${nx[1]}」 획득!`); fx.firework(); return; }
    const nn = T.find(x => S.claim < x[0]); toast(nn ? `🎫 땀방울 ${S.tot}/${nn[0]} — 「${nn[1]}」까지! (오늘 남은 보상 ${Math.max(0, DAILY - S.n)})` : '🎫 모든 칭호를 모았어요! 🏆'); } });
  addInter('rz_out', { name: '🚪 나가기', X: 0, Z: 9.4, h: 2.6, btn: '🚪<br>나가기', fn: () => leave() });
  const rect = (x, z, r) => x >= r[0] && x <= r[1] && z >= r[2] && z <= r[3];
  const KILN = [-13.8, -3, -10.8, -1.4], ICE = [3, 13.8, -10.8, -1.4];
  const blocks = [[-10.3, -6.7, -9.9, -6.2], [-11.5, -4.5, 7.2, 8.8], [6.8, 9.2, 7.5, 8.5]];
  return {
    bounds: { x0: -13.8, x1: 13.8, z0: -10.8, z1: 10.8 }, spawn: { x: 0, z: 7, ry: Math.PI },
    walk: (x, z) => { if (x < -13.8 || x > 13.8 || z < -10.8 || z > 10.8) return false; for (const b of blocks) if (rect(x, z, b)) return false; return true; },
    tick(dt, t, me) {
      inKiln = rect(me.x, me.z, KILN); inIce = rect(me.x, me.z, ICE); const now = performance.now(), res = now < sik ? .5 : 1;
      if (inKiln) { heat = Math.min(100, heat + 4.5 * res * dt); wasHot = Math.max(wasHot, heat); } else if (inIce) heat = Math.max(0, heat - 14 * dt); else heat = Math.max(0, heat - 3 * dt);
      if (heat >= 100 && now > lockUntil) { lockUntil = now + 10000; heat = 45; over++; api.warp(8.5, -4.5); toast('🥵 너무 뜨거워 기절! 얼음방으로 실려갔어요 (10초간 보상 없음)'); }
      if (inIce && wasHot >= 70 && heat <= 30 && now - comboT > 30000) { comboT = now; wasHot = 0; const g = givePts(10, .04); S.tot += 3; save(); tapeNote(`❄🔥 냉온욕 콤보! 공덕 +${g}`, { ms: 2200, cls: 'tip' }); fx.firework(); }
      if (inIce && !wasIce && heat >= 45 && now - lastIceC > 15000) { lastIceC = now; api.cine && api.cine('ice'); } wasIce = inIce;
      if (inIce && heat <= 10) wasHot = 0;
      if (inKiln && heat >= 30 && heat < 95 && now > lockUntil && now - lastTick > 4000) { lastTick = now; if (S.n < DAILY) { S.n++; S.tot++; const g = givePts(2, .01); save(); floatMe(`💧 +${g}`, 'txt'); } else if (S.n === DAILY) { S.n++; tapeNote('오늘 땀 보상은 여기까지! 내일 또 와요 🧖', { ms: 2600, cls: 'tip' }); } }
      const pct = Math.round(heat), col = pct >= 90 ? '#ff2a2a' : pct >= 70 ? '#ff8a1e' : pct >= 30 ? '#e8b020' : '#2da8e8';
      gauge(`${inKiln ? '🔥 불가마' : inIce ? '❄ 얼음방' : '♨ 찜질방'} · 열기 ${pct}%` + (now < sik ? ' · 🥤식혜' : '') + (pct >= 90 && inKiln ? ' · 🚨 나가요!' : pct >= 70 && inKiln ? ' · 🔥 땀 짜내기!' : inKiln && pct < 60 ? ' · 🎯 60%부터 황금 땀(E)' : ''), pct, col, 60);
      kmouth.material.emissiveIntensity = 1.4 + Math.sin(t * 6) * .4;
    },
    dbg: { setHeat: v => { heat = v; wasHot = Math.max(wasHot, v); }, get: () => ({ heat, S, over }) },
    dispose() { }
  };
};
