const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_FILE = path.join(ROOT_DIR, 'js', 'formation-contenu.js');

const contenus = {};

function scannerDossier(dir, prefixRelatif = '') {
  const entrees = fs.readdirSync(dir, { withFileTypes: true });
  for (const entree of entrees) {
    const nom = entree.name;
    const cheminAbs = path.join(dir, nom);
    const cheminRel = prefixRelatif ? `${prefixRelatif}/${nom}` : nom;

    if (entree.isDirectory()) {
      scannerDossier(cheminAbs, cheminRel);
    } else if (entree.isFile() && nom.endsWith('.md') && nom !== 'README.md') {
      const contenu = fs.readFileSync(cheminAbs, 'utf8');
      contenus[cheminRel] = contenu;
    }
  }
}

// Scanner guides/ et manuels/
const dossierGuides = path.join(ROOT_DIR, 'guides');
if (fs.existsSync(dossierGuides)) {
  scannerDossier(dossierGuides, 'guides');
}

const dossierManuels = path.join(ROOT_DIR, 'manuels');
if (fs.existsSync(dossierManuels)) {
  scannerDossier(dossierManuels, 'manuels');
}

const sortieJs = `/**
 * TEAM Sahélia — Contenus Pédagogiques Embarqués (Mode Hybride Offline / file:// & Online)
 * Permet le chargement instantané sous file:/// sans blocage CORS du navigateur
 * Généré automatiquement le ${new Date().toISOString()}
 */

(function () {
  'use strict';

  window.SaheliaContenus = ${JSON.stringify(contenus, null, 2)};

  console.log('✓ Contenus pédagogiques TEAM Sahélia chargés (${Object.keys(contenus).length} documents synchronisés).');
})();
`;

fs.writeFileSync(OUT_FILE, sortieJs, 'utf8');
console.log(`✓ Fichier généré avec succès : ${OUT_FILE} (${Object.keys(contenus).length} fichiers embarqués, ${(fs.statSync(OUT_FILE).size / 1024).toFixed(1)} Ko)`);
