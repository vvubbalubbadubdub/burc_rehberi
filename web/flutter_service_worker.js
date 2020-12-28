'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "df3d06f532d5d86bcac68aa1a6efb5f4",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/images/akrep8.png": "de6fd20a606ca9c8e9ef484b485f2c63",
"assets/images/akrep_buyuk8.png": "3b45ed16a9bec3761018f6d4894c2267",
"assets/images/aslan5.png": "dcd82a769655b05f69f47c2408f14d52",
"assets/images/aslan_buyuk5.png": "50e3d47144e07f89448e78edcede590a",
"assets/images/balik12.png": "4fa6719303a04de6d37eb238407b6247",
"assets/images/balik_buyuk12.png": "85d0507f826e18d748f572af9b6cc0de",
"assets/images/basak6.png": "475073999d906239a71723e778be5ece",
"assets/images/basak_buyuk6.png": "e11098ffcac54ea9129f7d870b4a3430",
"assets/images/boga2.png": "d1fbf0ed41eb7222ecf1edad07880876",
"assets/images/boga_buyuk2.png": "699f800bc4f4036d9146cee6287c9e5b",
"assets/images/ikizler3.png": "f3d1aaa48decd9d2a99fb74aa1a6462a",
"assets/images/ikizler_buyuk3.png": "0ee79482d99d3b580a3f687e40b2c45a",
"assets/images/koc1.png": "28603f98b563d5b20db617095b4f779e",
"assets/images/koc_buyuk1.png": "4bfc7939c9038abceb1ea327ede96cb8",
"assets/images/kova11.png": "afe567b5fe6fad673e51f4bb390e8da3",
"assets/images/kova_buyuk11.png": "32310db1dd8c9837c100a69b6bbba984",
"assets/images/oglak10.png": "e8aa97eeed72ae414ae2321c9adb3562",
"assets/images/oglak_buyuk10.png": "8a51866868d12b81e404c0be30ee224d",
"assets/images/terazi7.png": "8eeb4a083cfa9bce5f313e14250b386a",
"assets/images/terazi_buyuk7.png": "9f146ecc8608ba605651a1dc81524269",
"assets/images/yay9.png": "abd4c1119c37b0a5008b16b66b7c5c0d",
"assets/images/yay_buyuk9.png": "f8ae9669d04b2dd89975e9123365f0ce",
"assets/images/yengec4.png": "5853a4d87b8cf11b6cfb0f89a1c726db",
"assets/images/yengec_buyuk4.png": "939597bdb6208ca57c4a94679e9bcc89",
"assets/NOTICES": "9352daf81488cac6d5058222e6a865b9",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "be4a489291a2ebc93c8d2feced23cb78",
"/": "be4a489291a2ebc93c8d2feced23cb78",
"main.dart.js": "5d29b0a3825ee78f10b74d5ffebea4fc",
"manifest.json": "ce50049ebee16afdce749079e54147db",
"version.json": "66c372cb6a139fee972bb96a11c9fb70"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
