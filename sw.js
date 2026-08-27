// Service worker for offline play. Bump CACHE_VERSION on every deploy that
// changes any cached file, so returning players pick up the new version.
const CACHE_VERSION = "v3";
const CACHE_NAME = "benatky-" + CACHE_VERSION;

const PRECACHE_URLS = [
  "assets/icons/apple-touch-icon.png",
  "assets/icons/favicon-32.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/maskable-512.png",
  "assets/images/trasa1/img1.jpg",
  "assets/images/trasa1/img2.jpg",
  "assets/images/trasa1/img3.jpg",
  "assets/images/trasa1/img4.jpg",
  "assets/images/trasa1/img5.jpg",
  "assets/images/trasa1/img6.jpg",
  "assets/images/trasa1/img7.jpg",
  "assets/images/trasa2/img1.jpg",
  "assets/images/trasa2/img2.jpg",
  "assets/images/trasa2/img3.jpg",
  "assets/images/trasa2/img4.jpg",
  "assets/images/trasa2/img5.jpg",
  "assets/images/trasa2/img6.jpg",
  "assets/images/trasa2/img7.jpg",
  "assets/images/trasa3/img1.jpg",
  "assets/images/trasa3/img2.jpg",
  "assets/images/trasa3/img3.jpg",
  "assets/images/trasa3/img4.jpg",
  "assets/images/trasa3/img5.jpg",
  "assets/images/trasa3/img6.jpg",
  "assets/images/trasa4/img1.jpg",
  "assets/images/trasa4/img2.jpg",
  "assets/images/trasa4/img3.jpg",
  "assets/images/trasa4/img4.jpg",
  "assets/images/trasa4/img5.jpg",
  "assets/images/trasa5/img1.jpg",
  "assets/images/trasa5/img2.png",
  "assets/images/trasa5/img3.jpg",
  "assets/images/trasa5/img4.jpg",
  "assets/images/trasa5/img5.jpg",
  "assets/images/trasa5/img6.jpg",
  "assets/images/trasa5/img7.jpg",
  "assets/images/trasa5/img8.jpg",
  "assets/images/trasa6/image1.jpeg",
  "assets/images/trasa6/image2.png",
  "assets/images/trasa6/image3.jpg",
  "assets/images/trasa6/image4.jpg",
  "assets/images/trasa6/image5.jpeg",
  "assets/images/trasa6/image6.jpeg",
  "assets/images/trasa6/image7.jpeg",
  "assets/images/trasa7/image1.jpeg",
  "assets/images/trasa7/image2.png",
  "assets/images/trasa7/image3.jpg",
  "assets/images/trasa7/image4.jpg",
  "assets/images/trasa7/image5.jpeg",
  "assets/images/trasa7/image6.jpeg",
  "assets/images/trasa7/image7.jpeg",
  "assets/images/trasa7/image8.jpeg",
  "assets/images/trasa8/image1.jpeg",
  "assets/images/trasa8/image2.jpeg",
  "assets/images/trasa8/image3.jpeg",
  "assets/images/trasa8/image4.jpg",
  "assets/images/trasa8/image5.jpg",
  "assets/images/trasa8/image6.jpg",
  "assets/images/trasa8/image7.jpg",
  "assets/images/trasa8/image8.jpeg",
  "assets/images/trasa8/image9.jpeg",
  "assets/images/trasa8/image10.jpg",
  "assets/images/trasa8/image11.jpeg",
  "css/style.css",
  "data/trasa1.js",
  "data/trasa2.js",
  "data/trasa3.js",
  "data/trasa4.js",
  "data/trasa5.js",
  "data/trasa6.js",
  "data/trasa7.js",
  "data/trasa8.js",
  "index.html",
  "js/app.js",
  "js/i18n.js",
  "js/routes-config.js",
  "manifest.json",
  "./"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

// Cache-first for everything same-origin: this is a static, infrequently
// updated site, so serving from cache first keeps the whole game (routes,
// hints, fun facts, images) playable with no network at all once installed.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          if (req.mode === "navigate") return caches.match("index.html");
          return undefined;
        });
    })
  );
});
