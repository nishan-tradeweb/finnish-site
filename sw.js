/* finnish web app: offline support. Creator: Nishan */
var V = 'finnish-web-1.0.0';
var SHELL = ['./', 'index.html', 'windows.html', 'mac.html', 'linux.html', 'docs.html', 'privacy.html', 'terms.html', 'refunds.html', 'license.html',
  'css/style.css', 'js/main.js', 'js/config.js', 'manifest.webmanifest',
  'js/i18n/hi.js', 'js/i18n/fr.js', 'js/i18n/es.js', 'js/i18n/de.js', 'js/i18n/ja.js', 'js/i18n/zh.js', 'js/i18n/ar.js',
  'assets/icon-192.png', 'assets/icon-512.png', 'assets/apple-touch-icon.png', 'assets/favicon-64.png', 'assets/finnish-wordmark.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) {
    return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () { }); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
function put(req, res) { if (res && res.ok && res.type !== 'opaque') { var cp = res.clone(); caches.open(V).then(function (c) { c.put(req, cp); }); } return res; }
self.addEventListener('fetch', function (e) {
  var req = e.request; if (req.method !== 'GET') return;
  var u = new URL(req.url), same = u.origin === self.location.origin;
  var font = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (!same && !font) return;                       // price lookups and downloads always go to the network
  if (font || /\.(png|webp|jpg|jpeg|svg|woff2?)$/i.test(u.pathname)) {   // images and fonts: cache first
    e.respondWith(caches.match(req).then(function (m) { return m || fetch(req).then(function (r) { return put(req, r); }); }));
    return;
  }
  e.respondWith(fetch(req).then(function (r) { return put(req, r); }).catch(function () {   // pages, css, js: network first, cache when offline
    return caches.match(req).then(function (m) { return m || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()); });
  }));
});
