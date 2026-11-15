/**
 * TEAM Sahélia — Service Worker PWA & Mode Hors-Ligne (v9 Rapide & Modulaire)
 * Pré-cache uniquement le noyau léger pour installation instantanée, puis met en cache
 * les chapitres, schémas SVG et ressources à la demande ou sur action « 📥 Hors-ligne ».
 */

const APP_VERSION = '2026.10';
const CACHE_NAME = 'sahelia-v11-cache';

const ASSETS_A_METTRE_EN_CACHE = [
  './',
  'index.html',
  'formation.html',
  'verifier.html',
  'outils.html',
  'documentation.html',
  'manifest.json',
  'css/style.css',
  'css/formation.css',
  'css/sahelia-ui.css',
  'js/app.js',
  'js/badge-data.js',
  'js/controle-acces.js',
  'js/formation-catalogue.js',
  'js/formation-contenu-socle.js',
  'js/crypto-formation.js',
  'js/lecteur-formation.js',
  'js/sahelia-cloud-adapter.js',
  'assets/logo-sahelia.svg',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/images/hero_terrain_agronomie.webp',
  'assets/images/immersion_terrain_recherche.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        ASSETS_A_METTRE_EN_CACHE.map(async (asset) => {
          try {
            const resp = await fetch(asset);
            if (resp && resp.ok) {
              await cache.put(asset, resp.clone());
              if (asset.endsWith('.js') || asset.endsWith('.css')) {
                await cache.put(`${asset}?v=${APP_VERSION}`, resp.clone());
              }
            }
          } catch (err) {
            console.warn('[SW] Pré-cache ignoré :', asset);
          }
        })
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'CACHE_COURSE' || !Array.isArray(event.data.urls)) return;
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        event.data.urls.map(async (u) => {
          try {
            const resp = await fetch(u);
            if (resp && resp.ok) await cache.put(u, resp);
          } catch (e) {}
        })
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cles) => {
      return Promise.all(
        cles.map((cle) => {
          if (cle !== CACHE_NAME) {
            return caches.delete(cle);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  
  // Ignorer les requêtes non GET ou externes non critiques
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      // Stratégie Réseau en premier avec secours sur le Cache pour le contenu HTML
      if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
        return fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const respClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((c) => c.put(req, respClone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse || caches.match('index.html'));
      }

      // Pour les autres assets (CSS, JS, images, polices) : Cache en premier avec mise à jour en tâche de fond
      if (cachedResponse) {
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((c) => c.put(req, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const respClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, respClone));
        }
        return networkResponse;
      }).catch(() => {
        // En cas d'échec total (déconnexion complète sans cache)
        if (req.url.endsWith('.csv') || req.url.endsWith('.geojson')) {
          return new Response('Ressource hors-ligne non disponible dans le cache.', { status: 503 });
        }
      });
    })
  );
});
