/**
 * TEAM Sahélia — Service Worker PWA & Mode Hors-Ligne (v8 Versionné & Modulaire)
 * Cache les ressources statiques, les calculateurs terrain, les socles et les modules de cours
 * pour une disponibilité intégrale en milieu rural sans connexion Internet.
 */

const APP_VERSION = '2026.6';
const CACHE_NAME = 'sahelia-v8-cache';

const ASSETS_A_METTRE_EN_CACHE = [
  './',
  'index.html',
  'formation.html',
  'verifier.html',
  'outils.html',
  'admin.html',
  'documentation.html',
  'manifest.json',
  'css/style.css',
  'css/formation.css',
  'js/app.js',
  'js/badge-crypto.js',
  'js/badge-data.js',
  'js/badge-engine.js',
  'js/controle-acces.js',
  'js/formation-catalogue.js',
  'js/formation-contenu-socle.js',
  'js/formation-contenu.js',
  'js/crypto-formation.js',
  'js/lecteur-formation.js',
  'js/qrcode.min.js',
  'js/jszip.min.js',
  // Modules de cours individuels pour disponibilité hors-ligne intégrale :
  'js/contenus/cours-mn-01.js',
  'js/contenus/cours-mn-02.js',
  'js/contenus/cours-mn-03.js',
  'js/contenus/cours-mn-04.js',
  'js/contenus/cours-mn-05.js',
  'js/contenus/cours-mn-06.js',
  'js/contenus/cours-mn-07.js',
  'js/contenus/cours-mn-08.js',
  'js/contenus/cours-mn-09.js',
  'js/contenus/cours-mn-10.js',
  'js/contenus/cours-mn-11.js',
  'js/contenus/cours-mn-12.js',
  'assets/logo-sahelia.svg',
  'assets/images/hero_terrain_agronomie.webp',
  'assets/images/hero_terrain_agronomie.jpg',
  'assets/images/immersion_terrain_recherche.webp',
  'assets/images/immersion_terrain_recherche.jpg',
  'assets/Badge_TEAM_Sahelia_Membre_Officiel.png',
  'assets/Badge_TEAM_Sahelia_Competence_Agronomie.png',
  'assets/Badge_TEAM_Sahelia_Competence_SIG.png',
  'assets/Badge_TEAM_Sahelia_Competence_VibeCoding.png',
  'datasets/dataset_agronomique_sahelia.csv',
  'datasets/dataset_brut_a_nettoyer_sahelia.csv',
  'datasets/modele_enquete_agricole_kobo.csv',
  'datasets/parcelles_agricoles_borgou.geojson'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of ASSETS_A_METTRE_EN_CACHE) {
        try {
          const resp = await fetch(asset);
          if (resp && resp.ok) {
            // Mettre en cache la clé propre
            await cache.put(asset, resp.clone());
            // Pour les scripts et feuilles de style, indexer également la version active pour match instantané
            if (asset.endsWith('.js') || asset.endsWith('.css')) {
              await cache.put(`${asset}?v=${APP_VERSION}`, resp.clone());
            }
          }
        } catch (err) {
          console.warn('[SW] Pré-cache partiel pour :', asset, err);
        }
      }
    }).then(() => self.skipWaiting())
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
