/**
 * TEAM Sahélia — Script de Chiffrement & Synchronisation Pédagogique (AES-256-GCM + PBKDF2)
 * Génère js/formation-contenu.js :
 * 1. Guides 01 à 05 : 100% libres et en clair pour le référencement et l'accès ouvert.
 * 2. Manuels 01 à 12 : Chiffrés en AES-256-GCM avec enveloppes de clés sécurisées.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baseDir = path.join(__dirname, '..');
const catPath = path.join(baseDir, 'js', 'formation-catalogue.js');
const contenuPath = path.join(baseDir, 'js', 'formation-contenu.js');

const code = fs.readFileSync(catPath, 'utf8');
const fakeWindow = {};
eval('(function(window){' + code + '})(fakeWindow)');
const Cat = fakeWindow.SaheliaCatalogue;

const cours = Cat.listerTous();

// Sel universel de dérivation TEAM Sahélia (doit concorder exactement avec js/crypto-formation.js)
const SALT = Buffer.from('TEAM_SAHELIA_SALT_2026', 'utf8');
const PBKDF2_ITERATIONS = 100000;

// Clé maîtresse de contenu (256 bits)
const MASTER_CEK = crypto.createHash('sha256').update('TEAM_SAHELIA_MASTER_CONTENT_KEY_2026_PARAKOU').digest();

// Liste des codes autorisés d'origine
const PASSPHRASES_AUTORISEES = [
  'SAHELIA-EXCEL-2026',
  'SAHELIA-FONDATEUR-2026',
  'ADMIN-SAHELIA-2026',
  'SAHELIA-EDITEUR-2026',
  'SAHELIA2026'
];

// 1. Génération des enveloppes de clé pour chaque mot de passe
const envelopes = {};
PASSPHRASES_AUTORISEES.forEach(pass => {
  const cleanPass = pass.trim().toUpperCase();
  const passHash = crypto.createHash('sha256').update(cleanPass).digest('hex');
  const kAuth = crypto.pbkdf2Sync(cleanPass, SALT, PBKDF2_ITERATIONS, 32, 'sha256');

  // Chiffrer MASTER_CEK avec kAuth
  const envIv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', kAuth, envIv);
  const encKey = Buffer.concat([cipher.update(MASTER_CEK), cipher.final(), cipher.getAuthTag()]);

  envelopes[passHash] = {
    iv: envIv.toString('hex'),
    data: encKey.toString('hex')
  };
});

// 2. Parcourir tous les cours et séparer guides libres et manuels protégés
const contenusLibres = {};
const contenusChiffres = {};
const contenusChiffresParCours = {};

let totalGuides = 0;
let totalChapitresChiffres = 0;

cours.forEach(c => {
  if (c.type === 'guide') {
    const fullPath = path.join(baseDir, c.fichierSource);
    if (fs.existsSync(fullPath)) {
      contenusLibres[c.fichierSource.replace(/\\/g, '/')] = fs.readFileSync(fullPath, 'utf8');
      totalGuides++;
    } else {
      console.warn('⚠️ Fichier guide manquant :', c.fichierSource);
    }
  } else if (c.chapitres) {
    contenusChiffresParCours[c.id] = {};
    c.chapitres.forEach(ch => {
      const fullPath = path.join(baseDir, ch.fichier);
      if (fs.existsSync(fullPath)) {
        const texteClair = fs.readFileSync(fullPath, 'utf8');

        // Chiffrer avec MASTER_CEK en AES-256-GCM
        const chapIv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', MASTER_CEK, chapIv);
        const ciphertext = Buffer.concat([
          cipher.update(texteClair, 'utf8'),
          cipher.final(),
          cipher.getAuthTag()
        ]);

        const cleNormalisee = ch.fichier.replace(/\\/g, '/');
        const payload = {
          iv: chapIv.toString('hex'),
          data: ciphertext.toString('hex')
        };
        contenusChiffres[cleNormalisee] = payload;
        contenusChiffresParCours[c.id][cleNormalisee] = payload;
        totalChapitresChiffres++;
      } else {
        console.warn('⚠️ Fichier chapitre manquant :', ch.fichier);
      }
    });
  }
});

// 3. Écrire le bundle JS unifié (js/formation-contenu.js)
const out = `/**
 * TEAM Sahélia — Contenus Pédagogiques Embarqués & Chiffrés (AES-256-GCM + PBKDF2)
 * Généré automatiquement le ${new Date().toISOString()}
 * 
 * - window.SaheliaContenus : 5 Mini-Guides 100% libres & ouverts (référencement public)
 * - window.SaheliaContenusChiffres : 12 Manuels Stratégiques sous chiffrement fort
 * - window.SaheliaKeyEnvelopes : Enveloppes cryptographiques des clés d'accès
 */

(function () {
  'use strict';

  // 1. Guides Libres et Ouverts (Plaintext pour SEO et accès instantané)
  window.SaheliaContenus = ${JSON.stringify(contenusLibres, null, 2)};

  // 2. Enveloppes de Clés d'Accès (Déverrouillage par mot de passe valide)
  window.SaheliaKeyEnvelopes = ${JSON.stringify(envelopes, null, 2)};

  // 3. Manuels Stratégiques Chiffrés (AES-256-GCM)
  window.SaheliaContenusChiffres = ${JSON.stringify(contenusChiffres, null, 2)};

  console.log('🔒 Contenus pédagogiques sécurisés TEAM Sahélia chargés : ${totalGuides} guides libres, ${totalChapitresChiffres} chapitres chiffrés.');
})();
`;

fs.writeFileSync(contenuPath, out, 'utf8');
console.log(`✓ js/formation-contenu.js généré avec succès !`);

// 4. Écrire le socle léger (js/formation-contenu-socle.js)
const soclePath = path.join(baseDir, 'js', 'formation-contenu-socle.js');
const outSocle = `/**
 * TEAM Sahélia — Socle Pédagogique Immédiat & Guides Libres (AES-256-GCM + PBKDF2)
 * Généré automatiquement le ${new Date().toISOString()}
 * 
 * - window.SaheliaContenus : 5 Mini-Guides 100% libres & ouverts (chargement immédiat)
 * - window.SaheliaKeyEnvelopes : Enveloppes cryptographiques des clés d'accès
 * - window.SaheliaContenusChiffres : Initialisé pour chargement modulaire des 12 manuels
 */

(function () {
  'use strict';

  // 1. Guides Libres et Ouverts (Plaintext pour SEO et accès instantané)
  window.SaheliaContenus = ${JSON.stringify(contenusLibres, null, 2)};

  // 2. Enveloppes de Clés d'Accès (Déverrouillage par mot de passe valide)
  window.SaheliaKeyEnvelopes = ${JSON.stringify(envelopes, null, 2)};

  // 3. Initialisation du dictionnaire des chapitres chiffrés (complété à la demande)
  window.SaheliaContenusChiffres = window.SaheliaContenusChiffres || {};

  console.log('🔒 Socle pédagogique TEAM Sahélia actif : 5 guides libres et enveloppes prêtes.');
})();
`;

fs.writeFileSync(soclePath, outSocle, 'utf8');
console.log(`✓ js/formation-contenu-socle.js généré avec succès !`);

// 5. Écrire les modules de cours individuels (js/contenus/cours-mn-XX.js)
const dossiersContenus = path.join(baseDir, 'js', 'contenus');
fs.mkdirSync(dossiersContenus, { recursive: true });

let totalChunks = 0;
for (const [coursId, chapitresMap] of Object.entries(contenusChiffresParCours)) {
  const nbChaps = Object.keys(chapitresMap).length;
  const chunkCode = `/**
 * TEAM Sahélia — Module Chiffré pour le cours : ${coursId} (${nbChaps} chapitres)
 * Chiffrement fort AES-256-GCM
 */
(function () {
  'use strict';
  window.SaheliaContenusChiffres = window.SaheliaContenusChiffres || {};
  Object.assign(window.SaheliaContenusChiffres, ${JSON.stringify(chapitresMap, null, 2)});
})();
`;
  const chunkPath = path.join(dossiersContenus, `cours-${coursId}.js`);
  fs.writeFileSync(chunkPath, chunkCode, 'utf8');
  totalChunks++;
}

console.log(`✓ ${totalChunks} modules de cours modulaires générés dans js/contenus/ !`);
console.log(`  - Guides libres : ${totalGuides}`);
console.log(`  - Chapitres protégés (chiffrés AES-256-GCM) : ${totalChapitresChiffres}`);
console.log(`  - Enveloppes de clés : ${Object.keys(envelopes).length}`);
