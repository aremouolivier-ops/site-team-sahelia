/**
 * TEAM Sahélia — Serveur HTTP Local & Passerelle de Sécurité Pédagogique
 * 1. Sert les fichiers statiques de la plateforme officielle (HTML, CSS, JS, SVG, PNG)
 * 2. Intercepte les accès directs aux fichiers Markdown (.md) et redirige vers le Lecteur Interactif (formation.html)
 * 3. Protège les manuels stratégiques, les fichiers cachés et les scripts internes contre le téléchargement non autorisé
 * 4. Intègre des en-têtes de cybersécurité complets (CSP, X-Frame-Options, nosniff, Referrer-Policy) et protection XSS/DoS
 *
 * Utilisation : node server.js [port] (par défaut : 3000)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || process.argv[2] || '3000', 10);
const ROOT_DIR = path.resolve(__dirname);

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

// Routes conviviales (Clean URLs)
const ROUTES_RACCOURCIS = {
  '/': '/index.html',
  '/accueil': '/index.html',
  '/formation': '/formation.html',
  '/verifier': '/verifier.html',
  '/admin': '/admin.html'
};

// Fichiers et répertoires internes strictement interdits au téléchargement HTTP public
const FICHIERS_INTERDITS = new Set([
  'server.js',
  'tests_verification.js',
  'tests_badge_engine.js',
  'package.json',
  'package-lock.json',
  'vercel.json',
  'netlify.toml',
  '_redirects'
]);

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const server = http.createServer((req, res) => {
  // En-têtes de cybersécurité HTTP (Hardening OWASP)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https: data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; script-src 'self' 'unsafe-inline'; frame-ancestors 'self';"
  );

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('405 - Méthode HTTP non autorisée');
    return;
  }

  let pathname = '/';
  try {
    const parsedUrl = new URL(req.url || '/', 'http://localhost');
    pathname = decodeURIComponent(parsedUrl.pathname || '/');
  } catch (uriErr) {
    // Protection DoS contre les URL malformées (%E0%A4%A)
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('400 - Requête invalide (URI malformée)');
    return;
  }

  // Redirection /badges vers l'ancre du générateur
  if (pathname === '/badges') {
    res.writeHead(302, { Location: '/index.html#badges' });
    res.end();
    return;
  }

  // Résolution des routes conviviales
  if (ROUTES_RACCOURCIS[pathname]) {
    pathname = ROUTES_RACCOURCIS[pathname];
  }

  // =========================================================================
  // RÈGLE DE SÉCURITÉ & EXPÉRIENCE UTILISATEUR :
  // Si un visiteur tente d'ouvrir directement un fichier .md dans son navigateur
  // ou de télécharger un manuel protégé sans passer par l'interface,
  // on redirige vers l'interface de formation interactive !
  // =========================================================================
  const acceptHeader = req.headers['accept'] || '';
  const estRequeteNavigationNavigateur = acceptHeader.includes('text/html');
  const estDansManuelsProteges = pathname.startsWith('/manuels/');

  if (pathname.endsWith('.md') && (estRequeteNavigationNavigateur || estDansManuelsProteges)) {
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

  // Résolution sécurisée du chemin sur le disque
  const safeRelativeInput = pathname.replace(/^[/\\]+/, '');
  const filePath = path.resolve(ROOT_DIR, safeRelativeInput);
  const relPath = path.relative(ROOT_DIR, filePath);

  // Protection stricte contre le Path Traversal (Directory Traversal) et les fichiers cachés (.git, .env, scripts/)
  const segments = relPath.split(path.sep);
  const contientSegmentCache = segments.some((seg) => seg.startsWith('.') && seg !== '.');
  const estDossierScriptInterne = segments[0] === 'scripts';
  const nomBase = path.basename(filePath);

  if (
    relPath.startsWith('..') ||
    path.isAbsolute(relPath) ||
    contientSegmentCache ||
    estDossierScriptInterne ||
    FICHIERS_INTERDITS.has(nomBase)
  ) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 - Accès interdit (Ressource protégée par la politique de sécurité TEAM Sahélia)');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const safePathname = escapeHtml(pathname);
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404 - Ressource Introuvable · TEAM Sahélia</title>
          <link rel="stylesheet" href="/css/style.css">
        </head>
        <body style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#08130f;color:#eaf4ee;font-family:sans-serif;text-align:center;padding:1rem;">
          <div style="padding:2rem;background:#0e2019;border:1px solid #25463a;border-radius:16px;max-width:500px;width:100%;">
            <h1 style="color:#5fd0a0;margin-bottom:1rem;font-size:1.5rem;">Page ou Document Non Trouvé</h1>
            <p style="color:#a9c4b6;margin-bottom:1.5rem;word-break:break-word;">La ressource <code>${safePathname}</code> n'existe pas ou a été déplacée.</p>
            <div style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:center;">
              <a href="/index.html" class="v-btn v-btn--vert" style="display:inline-flex;padding:0.7rem 1.4rem;background:#5fd0a0;color:#06100c;text-decoration:none;border-radius:8px;font-weight:700;">← Accueil Vitrine</a>
              <a href="/formation.html" class="v-btn v-btn--fantome" style="display:inline-flex;padding:0.7rem 1.4rem;border:1px solid #25463a;color:#eaf4ee;text-decoration:none;border-radius:8px;font-weight:700;">📚 Espace Formation</a>
            </div>
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

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      }
      res.end('500 - Erreur interne de lecture');
    });
    stream.pipe(res);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`
========================================================================
  TEAM SAHÉLIA — SERVEUR PÉDAGOGIQUE & SÉCURITÉ ACTIF
========================================================================
  Plateforme principale : http://localhost:${PORT}/
  Lecteur de formation  : http://localhost:${PORT}/formation.html
  Portail vérification  : http://localhost:${PORT}/verifier.html
  Console d'admin       : http://localhost:${PORT}/admin.html
  Sécurisation OWASP    : Headers CSP, Anti-XSS, Anti-Traversal actifs
========================================================================
    `);
  });
}

module.exports = server;
