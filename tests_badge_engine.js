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
      quadraticCurveTo: () => {},
      bezierCurveTo: () => {},
      ellipse: () => {},
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
    institution: 'TEAM Sahélia · Bénin',
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
    mention: 'Mémoire Pédagogique validé sans faille',
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

console.log('--- TEST 6 : RENDU DU FORMAT OPEN BADGE 3.0 (INSIGNE SEUL 800x800) ---');
const tracks = ['pionnier', 'sig', 'drone', 'vibe'];
tracks.forEach((track) => {
  const canvasInsigne = document.createElement('canvas');
  window.BadgeEngine.genererBadgeSurCanvas(canvasInsigne, {
    type: 'competence-' + track,
    format: 'badge_seul',
    data: {
      id: `TS-SKL-2026-${track.toUpperCase()}`,
      beneficiaireNom: 'Olivier AREMOU',
      beneficiaireRole: 'Membre Certifié',
      titre: `Badge Spécialisé ${track.toUpperCase()}`
    }
  });
  console.log(`✓ Rendu Insigne ${track.toUpperCase()} terminé (${canvasInsigne.width}x${canvasInsigne.height})`);
});

console.log('--- TEST 7 : INTÉGRATION LINKEDIN & MÉTADONNÉES W3C VC ---');
const linkedInUrl = window.BadgeEngine.genererLienLinkedIn({
  id: 'TS-SKL-2026-001',
  titre: 'Praticien SIG & Cartographie Parcellaire'
});
if (!linkedInUrl.includes('startTask=CERTIFICATION_NAME') || !linkedInUrl.includes('TEAM')) {
  console.error('❌ URL LinkedIn invalide', linkedInUrl);
  process.exit(1);
}
console.log('✓ URL LinkedIn valide et pré-remplie');

const jsonld = window.BadgeEngine.exporterOpenBadgeJSONLD({
  id: 'TS-SKL-2026-001',
  titre: 'Praticien SIG & Cartographie Parcellaire',
  beneficiaireNom: 'Ségla Bio KPEROU'
});
if (!jsonld['@context'] || jsonld.type[1] !== 'OpenBadgeCredential') {
  console.error('❌ JSON-LD Open Badges 3.0 invalide');
  process.exit(1);
}
console.log('✓ Métadonnées cryptographiques Open Badges 3.0 / W3C conformes');

console.log('--- TEST 8 : VÉRIFICATION CRYPTOGRAPHIQUE W3C (ECDSA P-256) ---');
// Charger Web Crypto pour Node.js
const { webcrypto } = require('crypto');
global.window.crypto = webcrypto;

require('./js/badge-crypto.js');
if (!window.BadgeCrypto) {
  console.error('❌ BadgeCrypto non trouvé');
  process.exit(1);
}

(async () => {
  const credentialsIds = ['TS-SKL-2026-001', 'TS-SKL-2026-002', 'TS-SKL-2026-003', 'TS-SKL-2026-004'];
  for (const id of credentialsIds) {
    const credPath = path.join(__dirname, 'credentials', `${id}.json`);
    if (!fs.existsSync(credPath)) {
      console.error(`❌ Fichier ${credPath} manquant`);
      process.exit(1);
    }
    const cred = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    const audit = await window.BadgeCrypto.verifierSignatureCredential(cred);
    if (!audit.valide) {
      console.error(`❌ Échec signature pour ${id} :`, audit.erreur);
      process.exit(1);
    }
    console.log(`✓ Signature authentique W3C VC validée pour ${id} (${cred.credentialSubject.name})`);
  }

  // Test de falsification du contenu
  const credAlt = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials', 'TS-SKL-2026-001.json'), 'utf8'));
  credAlt.credentialSubject.name = 'Faux Bénéficiaire';
  const auditFaux = await window.BadgeCrypto.verifierSignatureCredential(credAlt);
  if (auditFaux.valide) {
    console.error('❌ La signature aurait dû échouer pour le document altéré !');
    process.exit(1);
  }
  console.log('✓ Détection mathématique immédiate de tentative de falsification du corps du document');

  // Test de falsification des métadonnées de preuve (created)
  const credAltProof = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials', 'TS-SKL-2026-001.json'), 'utf8'));
  credAltProof.proof.created = '2020-01-01T00:00:00.000Z';
  const auditFauxProof = await window.BadgeCrypto.verifierSignatureCredential(credAltProof);
  if (auditFauxProof.valide) {
    console.error('❌ La signature aurait dû échouer pour les métadonnées de preuve altérées !');
    process.exit(1);
  }
  console.log('✓ Détection mathématique de falsification des métadonnées de preuve (proof.created)');

  // Test du registre de révocation à 3 états (Fail-Closed)
  console.log('--- TEST 8B : AUDIT DE RÉVOCATION À 3 ÉTATS (FAIL-CLOSED) ---');
  // 1. Titre valide non révoqué
  global.fetch = async (url) => {
    if (url === 'status/revocations.json') {
      return {
        ok: true,
        json: async () => ({
          derniereMiseAJour: '2026-11-04T00:00:00Z',
          revocations: [{ id: 'TS-REV-001', motif: 'Test révocation', date: '2026-11-04' }],
          suspensions: [{ id: 'TS-SUS-001', motif: 'Test suspension', date: '2026-11-04' }]
        })
      };
    }
    throw new Error('404 Not Found');
  };

  const stValide = await window.BadgeCrypto.verifierStatutRevocation('TS-SKL-2026-001');
  if (stValide.statut !== 'VALIDE' || stValide.revoque !== false) {
    console.error('❌ Statut VALIDE attendu pour TS-SKL-2026-001, reçu:', stValide);
    process.exit(1);
  }
  console.log('✓ Contrôle registre : Titre actif certifié VALIDE (revoque: false)');

  const stRevoque = await window.BadgeCrypto.verifierStatutRevocation('TS-REV-001');
  if (stRevoque.statut !== 'REVOQUE' || stRevoque.revoque !== true) {
    console.error('❌ Statut REVOQUE attendu pour TS-REV-001, reçu:', stRevoque);
    process.exit(1);
  }
  console.log('✓ Contrôle registre : Titre révoqué formellement détecté REVOQUE (revoque: true)');

  const stSuspendu = await window.BadgeCrypto.verifierStatutRevocation('TS-SUS-001');
  if (stSuspendu.statut !== 'SUSPENDU' || stSuspendu.revoque !== true) {
    console.error('❌ Statut SUSPENDU attendu pour TS-SUS-001, reçu:', stSuspendu);
    process.exit(1);
  }
  console.log('✓ Contrôle registre : Titre suspendu formellement détecté SUSPENDU (revoque: true)');

  // Test fail-closed en cas d'erreur réseau
  global.fetch = async () => { throw new Error('Réseau inaccessible (offline)'); };
  const stOffline = await window.BadgeCrypto.verifierStatutRevocation('TS-SKL-2026-001');
  if (stOffline.statut !== 'STATUT_INCONNU' || stOffline.revoque !== null) {
    console.error('❌ Statut STATUT_INCONNU attendu en cas d\'erreur réseau (Fail-Closed), reçu:', stOffline);
    process.exit(1);
  }
  console.log('✓ Principe Fail-Closed respecté : Erreur réseau -> STATUT_INCONNU (revoque: null)');

  console.log('--- TEST 9 : CONTRÔLE STRICT D’ABSENCE DE RÉSIDUS PARAKOU / FA-UP ---');
  const badgeFiles = [
    'js/badge-data.js',
    'js/badge-engine.js',
    'js/badge-crypto.js',
    'verifier.html'
  ];
  for (const bf of badgeFiles) {
    const text = fs.readFileSync(path.join(__dirname, bf), 'utf8');
    if (/parakou/i.test(text) || /fa-up/i.test(text)) {
      console.error(`❌ Résidu Parakou/FA-UP trouvé dans ${bf}`);
      process.exit(1);
    }
    console.log(`✓ Zéro résidu institutionnel dans ${bf}`);
  }

  console.log('🎉 TOUS LES TESTS DU MOTEUR DE BADGES SONT VALIDES AVEC SUCCÈS (100% SUCCÈS) !');
})();
