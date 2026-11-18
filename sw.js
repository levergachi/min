// 원복 객장 3D 서비스워커 — 게임 파일은 캐시, 시세·DB·버전은 항상 네트워크
const C = 'wonbok-v33';
const CORE = ['room3d.html', 'live.js?v=21', 'config.js', 'vendor/three.module.min.js', 'icon-192.png', 'icon-512.png', 'manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;            // Firebase·시세 등 외부는 손대지 않음
  if (/version\.json|preview/.test(u.pathname)) return;                       // 업데이트 확인·미리보기는 항상 네트워크
  if (/vendor\/|\.png$|\.svg$|\.webmanifest$/.test(u.pathname)) {            // 잘 안 바뀌는 파일: 캐시 먼저
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); return res; })));
    return;
  }
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match(r, { ignoreSearch: true })));  // 게임 본체: 네트워크 먼저(항상 최신), 오프라인이면 캐시
});
