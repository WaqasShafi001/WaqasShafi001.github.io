'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "9096d2a1c401d0b6be9b5b0cdf108ba8",
"assets/assets/Montserrat-Medium.ttf": "c8b6e083af3f94009801989c3739425e",
"assets/FontManifest.json": "e80a334f375b7a9daaecfe39f1f12a59",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/Images/aboutus3.jpg": "dc4abc164a99f6dafe3fc9ae195db167",
"assets/Images/aboutusillustration.png": "b520d0154c0b6cf406cc65e1d23a4a60",
"assets/Images/businesslive_img.jpg": "3dbb78d01367370d8395d0857f5146df",
"assets/Images/card_bg_new_f.flr": "683b7d5e383b89fb7abef3dd4dcde0c5",
"assets/Images/cas_app_bar_logo.png": "2905fee2995caf07f9cd9c39232bdec2",
"assets/Images/cms_img.jpg": "dfdea14e8c3e0eb08edc088772061d12",
"assets/Images/diamond_img.png": "1dd5054f0e363ca9ee833d2a2daf125e",
"assets/Images/drawer_btn.png": "11a556a9bbacb26deacfb723dabf5d8a",
"assets/Images/easy_budget_img.jpeg": "02064473d40404ce9a551c0294c726fa",
"assets/Images/elms_img.jpg": "8e79c27a9d1e1b2b09a48a68f8b0f787",
"assets/Images/erp_img.jpg": "06858cf6a62354d6fd60a6ca1b162301",
"assets/Images/e_commerce_img.jpg": "1dd1bf72231482e9e0577b82a3c276c5",
"assets/Images/fastgrowing.png": "81b84797096cfd65dea7f7b93881d9df",
"assets/Images/fast_easy.png": "7b265116d428dfaaff8ec85c4b9cb07d",
"assets/Images/filemanagment.png": "6a756cc2eab674add13bb98473c001cc",
"assets/Images/main_logo.png": "32dd9089d6f45bfe4401741b61b6b636",
"assets/Images/mission_card_bg_final.flr": "51b8f2ec4a1b417bef14c9265331d14d",
"assets/Images/nodocs.png": "5ba97824d5db225dbba486507bc49bcd",
"assets/Images/onlycas.png": "9799de05d1a2b05849ef7dcd82c817a5",
"assets/Images/pos_img.jpg": "9ca4b4d47eb25ff186482986744609f1",
"assets/Images/salesuit_img.png": "b569707af2d55620c5d1fcb4aa759935",
"assets/Images/scrum_img.png": "9e79332f3bf2c9bd2936b04bb035c1b1",
"assets/Images/sirnoman.jpg": "2751d01e8baf7c41338bc5fdda26ce19",
"assets/Images/splash_background.flr": "ad931ccadf281177700fb8518c04adab",
"assets/Images/wecare.png": "49403dee65d27f751976e166cf2cc98b",
"assets/NOTICES": "3ac5c0bf06a0b33d765b5aaf803b2fc9",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"assets/packages/flutter_inappwebview/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"favicon.png": "6018be547f8ba992b14bf5bde2d85545",
"icons/Icon-192.png": "7a463ae6b9f804d042bd4af40cde7924",
"icons/Icon-512.png": "859fd6639d6ef0658799538128b957bf",
"index.html": "3618acffe475625b50aaff9f94039433",
"/": "3618acffe475625b50aaff9f94039433",
"main.dart.js": "63d2beb82f9a3045175e29e6f0deb9a5",
"manifest.json": "2eb480ef496d2edb8f96075d929daecc",
"version.json": "00562bc815003c653fec8c1caa3c8437"
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
