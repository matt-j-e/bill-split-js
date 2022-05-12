const splitIt = "split-it-site-v1";
const assets = [
  "/",
  "/index.html",
  "/css/normalize.css",
  "/css/style.css",
  "/js/bill.js",
  "/js/controller.js",
  "/js/item.js",
  "/js/person.js",
  "/bg.jpg"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(splitIt).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});