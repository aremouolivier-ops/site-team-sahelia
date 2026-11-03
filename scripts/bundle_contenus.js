const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const catPath = path.join(baseDir, 'js', 'formation-catalogue.js');
const contenuPath = path.join(baseDir, 'js', 'formation-contenu.js');

const code = fs.readFileSync(catPath, 'utf8');
const fakeWindow = {};
eval('(function(window){' + code + '})(fakeWindow)');
const Cat = fakeWindow.SaheliaCatalogue;

const cours = Cat.listerTous();
const bundle = {};

let totalDocs = 0;

cours.forEach(c => {
  if (c.type === 'guide') {
    const fullPath = path.join(baseDir, c.fichierSource);
    if (fs.existsSync(fullPath)) {
      bundle[c.fichierSource.replace(/\\/g, '/')] = fs.readFileSync(fullPath, 'utf8');
      totalDocs++;
    } else {
      console.warn('Fichier manquant :', c.fichierSource);
    }
  } else if (c.chapitres) {
    c.chapitres.forEach(ch => {
      const fullPath = path.join(baseDir, ch.fichier);
      if (fs.existsSync(fullPath)) {
        bundle[ch.fichier.replace(/\\/g, '/')] = fs.readFileSync(fullPath, 'utf8');
        totalDocs++;
      } else {
        console.warn('Fichier chapitre manquant :', ch.fichier);
      }
    });
  }
});

const out = `/**
 * TEAM Sahélia — Contenus Pédagogiques Embarqués (Mode Hybride Offline / file:// & Online)
 * Permet le chargement instantané sous file:/// sans blocage CORS du navigateur
 * Généré automatiquement le ${new Date().toISOString()}
 */

(function () {
  'use strict';

  window.SaheliaContenus = ${JSON.stringify(bundle, null, 2)};

  console.log('📖 Contenus pédagogiques TEAM Sahélia chargés (${totalDocs} documents synchronisés).');
})();
`;

fs.writeFileSync(contenuPath, out, 'utf8');
console.log(`✓ js/formation-contenu.js généré avec ${totalDocs} documents synchronisés !`);
