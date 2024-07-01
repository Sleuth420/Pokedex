const staticCacheName = 'pokedex-static-v1';
const contentImgsCache = 'pokedex-content-imgs';

// Function to install the service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          // Add other static assets (CSS, JS) as needed
        ]);
      })
  );
});

// Function to handle asset requests
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Check for static assets in cache
  if (url.origin === location.origin && request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request);
        })
    );
  } else if (url.pathname.startsWith('/static/img/')) {
    // Cache Pokemon images separately
    event.respondWith(
      caches.open(contentImgsCache)
        .then(cache => {
          return fetch(request)
            .then(response => {
              cache.put(request, response.clone());
              return response;
            });
        })
    );
  } else if (url.pathname.startsWith('/api/v2/pokemon/')) {
    // Handle API requests for Pokemon data (assuming your API endpoint starts with this path)
    event.respondWith(
      tryNetworkThenCache(request)
    );
  } else {
    // Fallback for non-cached requests
    event.respondWith(fetch(request));
  }
});

// Function to try network request then fallback to cache for specific API requests
async function tryNetworkThenCache(request) {
  const cache = await caches.open(staticCacheName);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone()); // Cache the successful response
    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.warn('Falling back to cached Pokemon data:', request.url);
      return cachedResponse; // Return cached data if available
    }
    return new Response('API request failed and no cached data available.', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}
