/**
 * Service Worker - PWA Support
 * Offline-first caching strategy
 * 2025 Best Practices
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `wedding-invitation-${CACHE_VERSION}`;

// Assets to cache immediately on install
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/src/styles/main.css',
  '/src/scripts/main.js',
  '/public/manifest.json',
  // Add fonts
  'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;700&display=swap',
  // Add critical images here
  // '/public/images/hero.webp',
];

// Dynamic cache for images and other assets
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;
const MAX_DYNAMIC_ITEMS = 50;

// ==================== Install Event ====================
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...', CACHE_VERSION);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// ==================== Activate Event ====================
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...', CACHE_VERSION);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Delete old caches
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('wedding-invitation-') &&
                     cacheName !== CACHE_NAME &&
                     cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// ==================== Fetch Event ====================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    // Cache Google Fonts
    if (url.origin === 'https://fonts.googleapis.com' ||
        url.origin === 'https://fonts.gstatic.com') {
      event.respondWith(cacheFirst(request));
    }
    return;
  }

  // API requests - Network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Images - Cache first, then network
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML pages - Network first, fallback to cache
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request));
    return;
  }

  // CSS, JS - Cache first
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Default: Cache first
  event.respondWith(cacheFirst(request));
});

// ==================== Caching Strategies ====================

/**
 * Cache First Strategy
 * Try cache first, fallback to network
 */
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[Service Worker] Cache hit:', request.url);
      return cachedResponse;
    }

    console.log('[Service Worker] Cache miss, fetching:', request.url);
    const networkResponse = await fetch(request);

    // Cache the new response
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());

      // Limit dynamic cache size
      limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_ITEMS);
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);

    // Return offline page if available
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }

    // Return basic offline response
    return new Response('오프라인 상태입니다. 네트워크 연결을 확인해주세요.', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain; charset=utf-8'
      })
    });
  }
}

/**
 * Network First Strategy
 * Try network first, fallback to cache
 */
async function networkFirst(request) {
  try {
    console.log('[Service Worker] Network request:', request.url);
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback
    return new Response('네트워크 요청 실패', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain; charset=utf-8'
      })
    });
  }
}

/**
 * Limit cache size to prevent storage issues
 */
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    console.log(`[Service Worker] Cache size limit reached, cleaning up ${cacheName}`);
    // Delete oldest items (FIFO)
    const itemsToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(itemsToDelete.map(key => cache.delete(key)));
  }
}

// ==================== Message Handling ====================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Skip waiting received');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    console.log('[Service Worker] Manual cache request:', event.data.urls);
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then(cache => cache.addAll(event.data.urls))
    );
  }
});

// ==================== Background Sync (Future Enhancement) ====================
// For RSVP form submissions when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-rsvp') {
    console.log('[Service Worker] Background sync: RSVP');
    event.waitUntil(syncRSVP());
  }
});

async function syncRSVP() {
  // TODO: Implement background sync for RSVP submissions
  console.log('[Service Worker] Syncing pending RSVP submissions');
}

// ==================== Push Notifications (Future Enhancement) ====================
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '결혼식 정보가 업데이트되었습니다',
    icon: '/public/images/icon-192x192.png',
    badge: '/public/images/badge.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: '확인하기'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('결혼식 초대장', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[Service Worker] Loaded successfully');
