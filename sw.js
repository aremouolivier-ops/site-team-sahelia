/**
 * TEAM Sahélia — Service Worker PWA & Mode Hors-Ligne
 * Cache les ressources statiques, les calculateurs terrain et les contenus de formation
 * pour une disponibilité intégrale en milieu rural sans connexion Internet.
 */

const CACHE_NAME = 'sahelia-v2-cache';
const ASSETS_A_METTRE_EN_CACHE = [
  './',
  'index.html',
  'formation.html',
  'verifier.html',
  'outils.html',
  'admin.html',
  'manifest.json',
  'css/style.css',
  'css/formation.css',
  'css/verifier.css',
  'css/admin.css',
  'js/app.js',
  'js/badge-crypto.js',
  'js/badges-donnees.js',
  'js/controle-acces.js',
  'js/formation-contenu.js',
  'js/lecteur-formation.js',
  'assets/logo-sahelia.svg',
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
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_A_METTRE_EN_CACHE).catch((err) => {
        console.warn('[SW] Pré-cache partiel réussi :', err);
      });
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
        // En cas d'échec total
        if (req.url.endsWith('.csv') || req.url.endsWith('.geojson')) {
          return new Response('Ressource hors-ligne non disponible dans le cache.', { status: 503 });
        }
      });
    })
  );
});
