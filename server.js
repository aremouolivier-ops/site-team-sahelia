/**
 * TEAM Sahélia — Serveur HTTP Local & Passerelle de Sécurité Pédagogique
 * 1. Sert les fichiers statiques de la plateforme officielle (HTML, CSS, JS, SVG, PNG)
 * 2. Intercepte les accès directs aux fichiers Markdown (.md) et redirige vers le Lecteur Interactif (formation.html)
 * 3. Protège les manuels stratégiques contre le téléchargement direct non autorisé
 *
 * Utilisation : node server.js [port] (par défaut : 3000)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT || process.argv[2] || '3000', 10);
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

// Table de correspondance directe des guides et manuels vers l'interface pédagogique
const REDIRECTIONS_MARKDOWN = {
  '/guides/01_URGENCE_MEMOIRE_ET_RAPPORT.md': '/formation.html?cours=guide-01',
  '/guides/02_TRACER_SA_PARCELLE_GPS_QGIS.md': '/formation.html?cours=guide-02',
  '/guides/03_PROMPTS_RECHERCHE_ET_VIBE_CODING.md': '/formation.html?cours=guide-03',
  '/guides/04_COLLECTE_TERRAIN_KOBOTOOLBOX.md': '/formation.html?cours=guide-04',
  '/guides/05_CREATION_VISUELLE_ET_AFFICHES_PRO.md': '/formation.html?cours=guide-05'
};

const server = http.createServer((req, res) => {
  // Sécurisation CORS basique pour le développement local
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Redirection racine vers index.html
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // =========================================================================
  // RÈGLE DE SÉCURITÉ & EXPÉRIENCE UTILISATEUR :
  // Si un visiteur tente d'ouvrir directement un fichier .md dans son navigateur
  // (Requête navigateur de type navigation avec Accept: text/html),
  // on le redirige immédiatement vers l'interface de formation interactive !
  // =========================================================================
  const acceptHeader = req.headers['accept'] || '';
  const estRequeteNavigationNavigateur = acceptHeader.includes('text/html');

  if (pathname.endsWith('.md') && estRequeteNavigationNavigateur) {
    // 1. Cas d'un des 5 mini-guides
    if (REDIRECTIONS_MARKDOWN[pathname]) {
      res.writeHead(302, { Location: REDIRECTIONS_MARKDOWN[pathname] });
      res.end();
      return;
    }

    // 2. Cas d'un manuel stratégique protégé
    const matchManuel = pathname.match(/\/manuels\/(\d+)-([^\/]+)/);
    if (matchManuel) {
      const numManuel = parseInt(matchManuel[1], 10);
      const codeCours = `mn-${String(numManuel).padStart(2, '0')}`;
      res.writeHead(302, { Location: `/formation.html?cours=${codeCours}` });
      res.end();
      return;
    }

    // Repli général pour tout autre fichier markdown
    res.writeHead(302, { Location: '/formation.html' });
    res.end();
    return;
  }

  // Résolution du chemin sur le disque
  const filePath = path.normalize(path.join(ROOT_DIR, pathname));

  // Protection contre le Path Traversal (Directory Traversal)
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 - Accès interdit (Path Traversal détecté)');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>404 - Ressource Introuvable · TEAM Sahélia</title>
          <link rel="stylesheet" href="/css/style.css">
        </head>
        <body style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#08130f;color:#eaf4ee;font-family:sans-serif;text-align:center;">
          <div style="padding:2rem;background:#0e2019;border:1px solid #25463a;border-radius:16px;max-width:500px;">
            <h1 style="color:#5fd0a0;margin-bottom:1rem;">Page ou Document Non Trouvé</h1>
            <p style="color:#a9c4b6;margin-bottom:1.5rem;">La ressource <code>${pathname}</code> n'existe pas ou a été déplacée.</p>
            <a href="/" class="v-btn v-btn--vert" style="display:inline-block;padding:0.7rem 1.4rem;background:#5fd0a0;color:#06100c;text-decoration:none;border-radius:8px;font-weight:700;">Retour à l'accueil</a>
          </div>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`
========================================================================
  TEAM SAHÉLIA — SERVEUR PÉDAGOGIQUE ACTIF
========================================================================
  Plateforme principale : http://localhost:${PORT}/
  Lecteur de formation  : http://localhost:${PORT}/formation.html
  Portail vérification  : http://localhost:${PORT}/verifier.html
  Sécurisation Markdown : Redirections automatiques actives
========================================================================
  `);
});
