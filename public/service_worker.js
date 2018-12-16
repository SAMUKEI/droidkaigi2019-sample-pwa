// ServiceWorker

// キャッシュ名とキャッシュファイルの指定
const version = "v1::";
const staticCacheName = `${version}static-resources`;
const urlsToCache = [
  '/',
  '/assets/css/main.min.css',
  '/assets/javascript/bundle.js',
];

// インストール時の処理(キャッシュコントロール)
self.addEventListener('install', (e) => {
  // e.waitUntil(
  //   caches
  //     .open(staticCacheName)
  //     .then(cache => {
  //       return cache.addAll(urlsToCache);
  //     })
  // );
});

// 古いキャッシュの削除
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (version.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', (e) => {
  // e.respondWith(
  //   caches
  //     .match(e.request)
  //     .then(response => {
  //       return response ? response : fetch(e.request);
  //     })
  // );
});

self.addEventListener('sync', (e) => {
  console.info('sync', e);

  if (e.tag.startsWith('sync-upload')) {
    self.clients.matchAll().then(clients =>
      clients.forEach(client => client.postMessage("upload")));
  }
});
