const fs = require('fs');
const path = require('path');

// Mock DOM elements to run badge-engine in Node.js test environment
global.window = {};
global.document = {
  createElement: () => ({
    getContext: () => ({
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      arcTo: () => {},
      roundRect: () => {},
      stroke: () => {},
      fill: () => {},
      strokeRect: () => {},
      fillRect: () => {},
      drawImage: () => {},
      clip: () => {},
      measureText: (txt) => ({ width: (txt || '').length * 8 }),
      fillText: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      createLinearGradient: () => ({ addColorStop: () => {} })
    })
  })
};

// Charger qrcode
require('./js/qrcode.min.js');
global.qrcode = window.qrcode;

// Charger badge-data
require('./js/badge-data.js');

// Charger badge-engine
require('./js/badge-engine.js');

console.log('--- TEST 1 : INITIALISATION BADGE ENGINE ---');
if (!window.BadgeEngine) {
  console.error('❌ BadgeEngine non trouvé');
  process.exit(1);
}
console.log('✓ BadgeEngine chargé avec succès');

console.log('--- TEST 2 : RENDU DU FORMAT PAYSAGE MEMBRE (HOMME) ---');
const canvasMembre = document.createElement('canvas');
window.BadgeEngine.genererBadgeSurCanvas(canvasMembre, {
  type: 'membre',
  format: 'paysage',
  data: {
    id: 'TS-MBR-2026-001',
    beneficiaireNom: 'Sègla Bio KPEROU',
    beneficiaireRole: 'Référent Cartographie SIG & Agronomie',
    institution: 'Faculté d’Agronomie (FA-UP) · Parakou',
    sexe: 'M',
    slogan: 'L’agronomie de demain maîtrise la terre et la donnée.'
  }
});
console.log('✓ Rendu Membre Homme Paysage terminé (Canvas ' + canvasMembre.width + 'x' + canvasMembre.height + ')');

console.log('--- TEST 3 : RENDU DU FORMAT PAYSAGE FORMATION (FEMME) ---');
const canvasFormation = document.createElement('canvas');
window.BadgeEngine.genererBadgeSurCanvas(canvasFormation, {
  type: 'formation',
  format: 'paysage',
  data: {
    id: 'TS-FOR-2026-B1-001',
    beneficiaireNom: 'Amina CHABI',
    titre: 'Bureautique Académique : Mémoires Word & Excel',
    cohorteNom: 'Cohorte Urgence Mémoire · Novembre 2026',
    mention: 'Mémoire FA-UP validé sans faille',
    sexe: 'F',
    slogan: 'Collecte mobile et analyse d’enquêtes terrain fiables.'
  }
});
console.log('✓ Rendu Formation Femme Paysage terminé (Canvas ' + canvasFormation.width + 'x' + canvasFormation.height + ')');

console.log('--- TEST 4 : RENDU DU FORMAT PAYSAGE COMPÉTENCE (HOMME) ---');
const canvasCompetence = document.createElement('canvas');
window.BadgeEngine.genererBadgeSurCanvas(canvasCompetence, {
  type: 'competence',
  format: 'paysage',
  data: {
    id: 'TS-SKL-2026-001',
    beneficiaireNom: 'Babatoundé Eric DOSSOU',
    titre: 'Délimitation & Cartographie Parcellaire QGIS',
    domaine: 'Géomatique Appliquée à l’Agronomie',
    sexe: 'M',
    slogan: 'La donnée parcellaire au service des rendements agricoles.'
  }
});
console.log('✓ Rendu Compétence Homme Paysage terminé (Canvas ' + canvasCompetence.width + 'x' + canvasCompetence.height + ')');

console.log('--- TEST 5 : VÉRIFICATION DU MOTEUR QR CODE ---');
const qr = window.qrcode(0, 'M');
qr.addData('https://sahelia.org/verifier?id=TS-MBR-2026-001');
qr.make();
const count = qr.getModuleCount();
console.log(`✓ QR Code généré avec succès : matrice ${count}x${count} modules`);

console.log('🎉 TOUS LES TESTS DU MOTEUR DE BADGES SONT VALIDES AVEC SUCCÈS !');
