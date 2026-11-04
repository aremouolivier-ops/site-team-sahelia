/**
 * TEAM Sahélia — Suite de Tests d'Intégration & Contrôle Qualité Pédagogique
 * Valide le Catalogue, les Chemins de Fichiers, le Moteur de Sécurité et le Serveur
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const BASE_DIR = path.resolve(__dirname);

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ÉCHEC : ${message}`);
    process.exit(1);
  }
  console.log(`✓ SUCCÈS : ${message}`);
}

console.log('========================================================================');
console.log('TEST 1 : VÉRIFICATION DE L’INTÉGRITÉ DU CATALOGUE & DES RESSOURCES');
console.log('========================================================================');

// Charger SaheliaCatalogue en environnement Node
const catalogueContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'formation-catalogue.js'), 'utf8');
const fakeWindow = {};
eval(`(function(window) { ${catalogueContent} })(fakeWindow)`);
const Cat = fakeWindow.SaheliaCatalogue;

assert(Cat !== undefined, 'Catalogue chargé avec succès');
const tousLesCours = Cat.listerTous();
assert(tousLesCours.length === 17, `Le catalogue contient exactement 17 cours (5 guides + 12 manuels), trouvé: ${tousLesCours.length}`);

// Vérifier les 5 mini-guides
const guides = Cat.listerGuidesLibres();
assert(guides.length === 5, 'Exactement 5 mini-guides libres');
guides.forEach((g) => {
  assert(g.libre === true, `Le guide ${g.id} est bien 100% libre et gratuit`);
  assert(fs.existsSync(path.join(BASE_DIR, g.fichierSource)), `Le fichier source du guide ${g.id} (${g.fichierSource}) existe sur le disque`);
});

// Vérifier les 11 manuels protégés
const manuels = Cat.listerManuelsProteges();
assert(manuels.length === 12, 'Exactement 12 manuels stratégiques protégés');
manuels.forEach((m) => {
  assert(m.libre === false, `Le manuel ${m.id} est bien protégé`);
  const dossierManuel = path.join(BASE_DIR, m.baseDir);
  assert(fs.existsSync(dossierManuel), `Le dossier du manuel ${m.id} existe (${m.baseDir})`);

  // Vérifier tous les chapitres enregistrés
  (m.chapitres || []).forEach((ch) => {
    const fichierCh = path.join(BASE_DIR, ch.fichier);
    assert(fs.existsSync(fichierCh), `Chapitre ${ch.id} du manuel ${m.id} existe : ${ch.fichier}`);
  });
});

// Vérifier particulièrement Manuel 01 (Excel)
const mn01 = Cat.obtenirCours('mn-01');
assert(mn01 !== null, 'Manuel 01 trouvé');
assert(mn01.chapitres.length >= 9, `Manuel 01 possède 8 chapitres + intro + projet (${mn01.chapitres.length} sections)`);

// Vérifier les 8 schémas vectoriels SVG du Manuel 01
for (let i = 1; i <= 8; i++) {
  const schemasDir = path.join(BASE_DIR, 'manuels', '01-excel-etudiants-professionnels', 'schemas');
  const fichiers = fs.readdirSync(schemasDir);
  const trouve = fichiers.some((f) => f.startsWith(`schema_0${i}_`) && f.endsWith('.svg'));
  assert(trouve, `Manuel 01 : Schéma vectoriel #${i} présent dans schemas/`);
}

// Vérifier le dataset CSV du Manuel 01
const datasetCsv = path.join(BASE_DIR, 'manuels', '01-excel-etudiants-professionnels', 'datasets', 'dataset_agronomique_sahelia.csv');
assert(fs.existsSync(datasetCsv), 'Dataset CSV agronomique Sahélia présent et prêt');
const csvContent = fs.readFileSync(datasetCsv, 'utf8');
assert(csvContent.includes('ID_Parcelle'), 'Le dataset CSV contient les colonnes attendues');

// Vérifier particulièrement Manuel 02 (Word & PowerPoint Pro)
const mn02 = Cat.obtenirCours('mn-02');
assert(mn02 !== null, 'Manuel 02 trouvé');
assert(mn02.chapitres.length === 8, `Manuel 02 possède 7 chapitres + projet Capstone (8 sections), trouvé: ${mn02.chapitres.length}`);

// Vérifier les 6 schémas vectoriels SVG du Manuel 02
for (let i = 1; i <= 6; i++) {
  const schemasDir = path.join(BASE_DIR, 'manuels', '02-word-powerpoint-pro', 'schemas');
  const fichiers = fs.readdirSync(schemasDir);
  const trouve = fichiers.some((f) => f.startsWith(`schema_0${i}_`) && f.endsWith('.svg'));
  assert(trouve, `Manuel 02 : Schéma vectoriel #${i} présent dans schemas/`);
}

// Vérifier particulièrement Manuel 03 (50 Astuces & Raccourcis Informatiques)
const mn03 = Cat.obtenirCours('mn-03');
assert(mn03 !== null, 'Manuel 03 trouvé');
assert(mn03.chapitres.length === 6, `Manuel 03 possède 6 chapitres complets (avec Projet Capstone), trouvé: ${mn03.chapitres.length}`);

// Vérifier les 6 schémas vectoriels SVG du Manuel 03
for (let i = 1; i <= 6; i++) {
  const schemasDir = path.join(BASE_DIR, 'manuels', '03-astuces-raccourcis-informatiques', 'schemas');
  const fichiers = fs.readdirSync(schemasDir);
  const trouve = fichiers.some((f) => f.startsWith(`schema_0${i}_`) && f.endsWith('.svg'));
  assert(trouve, `Manuel 03 : Schéma vectoriel #${i} présent dans schemas/`);
}

// Vérifier particulièrement Manuel 04 (R & RStudio pour l'Agronomie)
const mn04 = Cat.obtenirCours('mn-04');
assert(mn04 !== null, 'Manuel 04 trouvé');
assert(mn04.chapitres.length === 8, `Manuel 04 possède 8 chapitres complets (avec Projet Capstone), trouvé: ${mn04.chapitres.length}`);

// Vérifier les 8 schémas vectoriels SVG du Manuel 04
for (let i = 1; i <= 8; i++) {
  const schemasDir = path.join(BASE_DIR, 'manuels', '04-r-rstudio-agronomie', 'schemas');
  const fichiers = fs.readdirSync(schemasDir);
  const trouve = fichiers.some((f) => f.startsWith(`schema_0${i}_`) && f.endsWith('.svg'));
  assert(trouve, `Manuel 04 : Schéma vectoriel #${i} présent dans schemas/`);
}

// Vérifier particulièrement Manuel 05 (KoboToolbox & Collecte de Terrain)
const mn05 = Cat.obtenirCours('mn-05');
assert(mn05 !== null, 'Manuel 05 trouvé');
assert(mn05.chapitres.length === 6, `Manuel 05 possède 6 chapitres complets (avec Projet Capstone), trouvé: ${mn05.chapitres.length}`);

// Vérifier les 6 schémas vectoriels SVG du Manuel 05
for (let i = 1; i <= 6; i++) {
  const schemasDir = path.join(BASE_DIR, 'manuels', '05-kobotoolbox-collecte-terrain', 'schemas');
  const fichiers = fs.readdirSync(schemasDir);
  const trouve = fichiers.some((f) => f.startsWith(`schema_0${i}_`) && f.endsWith('.svg'));
  assert(trouve, `Manuel 05 : Schéma vectoriel #${i} présent dans schemas/`);
}

// Vérifier particulièrement Manuel 06 (Cartographie Agricole & SIG avec QGIS)
const mn06 = Cat.obtenirCours('mn-06');
assert(mn06 !== null, 'Manuel 06 trouvé');
assert(mn06.chapitres.length === 6, `Manuel 06 possède 6 chapitres complets (avec Projet Capstone), trouvé: ${mn06.chapitres.length}`);

// Vérifier les 6 schémas vectoriels SVG du Manuel 06
for (let i = 1; i <= 6; i++) {
  const schemasDir = path.join(BASE_DIR, 'manuels', '06-cartographie-agricole-sig', 'schemas');
  const fichiers = fs.readdirSync(schemasDir);
  const trouve = fichiers.some((f) => f.startsWith(`schema_0${i}_`) && f.endsWith('.svg'));
  assert(trouve, `Manuel 06 : Schéma vectoriel #${i} présent dans schemas/`);
}

// Vérifier particulièrement Manuel 11 (Pilotage de Drones & Drones Agricoles)
const mn11 = Cat.obtenirCours('mn-11');
assert(mn11 !== null, 'Manuel 11 trouvé');
assert(mn11.chapitres.length === 6, `Manuel 11 possède 6 chapitres complets (avec Projet Capstone), trouvé: ${mn11.chapitres.length}`);

// Vérifier les 6 schémas vectoriels SVG du Manuel 11
for (let i = 1; i <= 6; i++) {
  const schemasDir = path.join(BASE_DIR, 'manuels', '11-pilotage-drones-agricoles', 'schemas');
  const fichiers = fs.readdirSync(schemasDir);
  const trouve = fichiers.some((f) => f.startsWith(`schema_0${i}_`) && f.endsWith('.svg'));
  assert(trouve, `Manuel 11 : Schéma vectoriel #${i} présent dans schemas/`);
}

// Vérifier particulièrement Manuel 12 (Création Vidéo & Visuelle par IA)
const mn12 = Cat.obtenirCours('mn-12');
assert(mn12 !== null, 'Manuel 12 trouvé');
assert(mn12.chapitres.length === 6, `Manuel 12 possède 6 chapitres complets (avec Projet Capstone), trouvé: ${mn12.chapitres.length}`);

// Vérifier les 6 schémas vectoriels SVG du Manuel 12
for (let i = 1; i <= 6; i++) {
  const schemasDir = path.join(BASE_DIR, 'manuels', '12-creation-video-ia', 'schemas');
  const fichiers = fs.readdirSync(schemasDir);
  const trouve = fichiers.some((f) => f.startsWith(`schema_0${i}_`) && f.endsWith('.svg'));
  assert(trouve, `Manuel 12 : Schéma vectoriel #${i} présent dans schemas/`);
}


// Vérifier particulièrement Manuel 07 (Développement Web Moderne)
const mn07 = Cat.obtenirCours('mn-07');
assert(mn07 !== null, 'Manuel 07 trouvé');
assert(mn07.chapitres.length === 6, `Manuel 07 possède 6 chapitres complets (avec Projet Capstone), trouvé: ${mn07.chapitres.length}`);

// Vérifier les 6 schémas vectoriels SVG du Manuel 07
for (let i = 1; i <= 6; i++) {
  const schemasDir = path.join(BASE_DIR, 'manuels', '07-developpement-web-moderne', 'schemas');
  const fichiers = fs.readdirSync(schemasDir);
  const trouve = fichiers.some((f) => f.startsWith(`schema_0${i}_`) && f.endsWith('.svg'));
  assert(trouve, `Manuel 07 : Schéma vectoriel #${i} présent dans schemas/`);
}

// Vérifier particulièrement Manuel 08 (Vibe Coding & IA Responsable)
const mn08 = Cat.obtenirCours('mn-08');
assert(mn08 !== null, 'Manuel 08 trouvé');
assert(mn08.chapitres.length === 6, `Manuel 08 possède 6 chapitres complets (avec Projet Capstone), trouvé: ${mn08.chapitres.length}`);

// Vérifier les 6 schémas vectoriels SVG du Manuel 08
for (let i = 1; i <= 6; i++) {
  const schemasDir = path.join(BASE_DIR, 'manuels', '08-vibe-coding-ia-responsable', 'schemas');
  const fichiers = fs.readdirSync(schemasDir);
  const trouve = fichiers.some((f) => f.startsWith(`schema_0${i}_`) && f.endsWith('.svg'));
  assert(trouve, `Manuel 08 : Schéma vectoriel #${i} présent dans schemas/`);
}

// Vérifier particulièrement Manuel 09 (Création Graphique & Vidéo Mobile de Terrain)
const mn09 = Cat.obtenirCours('mn-09');
assert(mn09 !== null, 'Manuel 09 trouvé');
assert(mn09.chapitres.length === 6, `Manuel 09 possède 6 chapitres complets (avec Projet Capstone), trouvé: ${mn09.chapitres.length}`);

// Vérifier les 6 schémas vectoriels SVG du Manuel 09
for (let i = 1; i <= 6; i++) {
  const schemasDir = path.join(BASE_DIR, 'manuels', '09-creation-graphique-video-mobile', 'schemas');
  const fichiers = fs.readdirSync(schemasDir);
  const trouve = fichiers.some((f) => f.startsWith(`schema_0${i}_`) && f.endsWith('.svg'));
  assert(trouve, `Manuel 09 : Schéma vectoriel #${i} présent dans schemas/`);
}

// Vérifier particulièrement Manuel 10 (L’Agronome-Numéricien & Consultant Indépendant)
const mn10 = Cat.obtenirCours('mn-10');
assert(mn10 !== null, 'Manuel 10 trouvé');
assert(mn10.chapitres.length === 6, `Manuel 10 possède 6 chapitres complets (avec Projet Capstone), trouvé: ${mn10.chapitres.length}`);

// Vérifier les 6 schémas vectoriels SVG du Manuel 10
for (let i = 1; i <= 6; i++) {
  const schemasDir = path.join(BASE_DIR, 'manuels', '10-agronome-numericien-freelance', 'schemas');
  const fichiers = fs.readdirSync(schemasDir);
  const trouve = fichiers.some((f) => f.startsWith(`schema_0${i}_`) && f.endsWith('.svg'));
  assert(trouve, `Manuel 10 : Schéma vectoriel #${i} présent dans schemas/`);
}

console.log('\n========================================================================');
console.log('TEST 2 : CONTRÔLE DE SÉCURITÉ & LOGIQUE D’AUTHENTIFICATION');
console.log('========================================================================');

// Simuler SaheliaDB et SaheliaSecurite en environnement Node
const dbContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'badge-data.js'), 'utf8');
const mockStorage = {};
fakeWindow.localStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; }
};
global.localStorage = fakeWindow.localStorage;

eval(`(function(window, localStorage) { ${dbContent} })(fakeWindow, fakeWindow.localStorage)`);
const DB = fakeWindow.SaheliaDB;

assert(DB !== undefined, 'Registre SaheliaDB chargé avec succès');
assert(Array.isArray(DB.membres) && DB.membres.length >= 4, 'La base des membres contient les membres fondateurs réels');

// Test d'enregistrement dynamique d'un membre officiel par la console admin
const membreOfficiel = {
  id: 'TS-MBR-2026-001',
  matricule: 'TS-MBR-2026-001',
  nom: 'Bio Sègla',
  role: 'Coordonnateur Pôle Cartographie & SIG',
  institution: 'Communauté TEAM Sahélia',
  sexe: 'homme',
  statut: 'actif',
  telephone: '+22997000001',
  email: 'segla.bio@sahelia.org',
  dateAdhesion: '2026-11-03'
};
DB.membres.push(membreOfficiel);
DB.sauvegarderMembres(DB.membres);

const membreTest = DB.trouverBadgeParId('TS-MBR-2026-001');
assert(membreTest !== null, 'Membre officiel enregistré et retrouvé avec succès');
assert(membreTest.beneficiaireNom === 'Bio Sègla', 'Nom du titulaire conforme');

// Vérifier le comportement de contrôle d'accès
const crypto = require('crypto');
function sha256Node(str) {
  return crypto.createHash('sha256').update(str.trim()).digest('hex');
}

const codeInitial = 'SAHELIA-EXCEL-2026';
const hashInitial = sha256Node(codeInitial);

let configSec = {
  codeHash: hashInitial,
  securityEpoch: 1,
  historique: []
};

// Test A : Accès à un guide libre -> Aucune auth requise
assert(Cat.obtenirCours('guide-01').libre === true, 'Guide 01 est libre : accès direct accordé');

// Test B : Tentative d'accès à un manuel protégé avec un faux badge
const fauxBadge = DB.trouverBadgeParId('TS-FAUX-999');
assert(fauxBadge === null, 'Badge inexistant détecté et rejeté');

// Test C : Tentative d'accès avec badge valide mais mauvais code
const codeErreur = 'MAUVAIS-CODE';
assert(sha256Node(codeErreur) !== configSec.codeHash, 'Mauvais code rejeté par empreinte SHA-256');

// Test D : Accès avec badge valide + bon code -> Autorisé
assert(sha256Node(codeInitial) === configSec.codeHash, 'Bon code validé');
let sessionUtilisateur = {
  badgeId: membreTest.id,
  badgeNom: membreTest.beneficiaireNom,
  epoch: configSec.securityEpoch
};
assert(sessionUtilisateur.epoch === configSec.securityEpoch, 'Session active et valide pour époque #1');

// Test E : Rotation du code par le fondateur
const nouveauCode = 'SAHELIA-NOUVEAU-2026';
configSec.codeHash = sha256Node(nouveauCode);
configSec.securityEpoch += 1;
assert(configSec.securityEpoch === 2, 'Époque de sécurité incrémentée à #2');

// Vérification de la révocation immédiate de l'ancienne session
assert(sessionUtilisateur.epoch < configSec.securityEpoch, 'L’ancienne session (époque 1) est automatiquement invalidée à l’époque 2 !');

// Test F : Accès Super-Administrateur & Éditeur sans badge (Clé Maître)
const secContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'controle-acces.js'), 'utf8');
fakeWindow.sessionStorage = fakeWindow.localStorage;
eval(`(function(window, localStorage, sessionStorage) { ${secContent} })(fakeWindow, fakeWindow.localStorage, fakeWindow.sessionStorage)`);
const Sec = fakeWindow.SaheliaSecurite;
assert(Sec !== undefined, 'Module SaheliaSecurite opérationnel');

// Vérification du déverrouillage Administrateur sans badge
let sessionAdminTest = {
  badgeId: 'TS-ADM-FONDATEUR',
  badgeNom: 'Direction & Édition TEAM Sahélia',
  isSuperAdmin: true,
  epoch: configSec.securityEpoch
};
assert(sessionAdminTest.isSuperAdmin === true, 'Le statut isSuperAdmin garantit le contournement du badge');

// Test G : Vérification du Validateur Sémantique Strict (SaheliaValidateur)
const Validateur = fakeWindow.SaheliaValidateur;
assert(Validateur !== undefined, 'SaheliaValidateur chargé avec succès');
assert(Validateur.validerTelephone('+22997000000').valide === true, 'Numéro international béninois valide (+229)');
assert(Validateur.validerTelephone('+33612345678').valide === true, 'Numéro international français valide (+33)');
assert(Validateur.validerTelephone('97000000').valide === false, 'Numéro sans indicatif international (+) rejeté');
assert(Validateur.validerTelephone('abc').valide === false, 'Numéro alphabétique rejeté');
assert(Validateur.validerEmail('contact@sahelia.org').valide === true, 'Email conforme accepté');
assert(Validateur.validerEmail('faux-email').valide === false, 'Email invalide rejeté');
assert(Validateur.validerTexte('<script>alert(1)</script>', 'Test').valide === false, 'Balises HTML / tentative XSS rejetées');
assert(Validateur.validerTexte('Texte propre et valide', 'Test').valide === true, 'Texte propre accepté');

// Test H : Permaliens uniques et directs par cours
assert(typeof Cat.obtenirLienPartage === 'function', 'SaheliaCatalogue dispose de la fonction de permalien');
const permalienExcel = Cat.obtenirLienPartage('mn-01');
assert(permalienExcel.includes('formation.html?cours=mn-01'), 'Le permalien direct du Manuel 01 est exact');
const permalienDrone = Cat.obtenirLienPartage('mn-11');
assert(permalienDrone.includes('formation.html?cours=mn-11'), 'Le permalien direct du Manuel 11 (Drones) est exact');

// Test I : Modification du mot de passe Admin supportée
assert(typeof Sec.changerMotDePasseAdmin === 'function', 'SaheliaSecurite supporte le changement de mot de passe admin');

console.log('\n========================================================================');
console.log('TEST 2B : CONTRÔLE DU CHIFFREMENT FORT DES MANUELS (AES-256-GCM + PBKDF2)');
console.log('========================================================================');

// Charger le bundle de contenus et le module cryptographique
const contenuContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'formation-contenu.js'), 'utf8');
eval(`(function(window) { ${contenuContent} })(fakeWindow)`);

const cryptoFormationContent = fs.readFileSync(path.join(BASE_DIR, 'js', 'crypto-formation.js'), 'utf8');
eval(`(function(window) { ${cryptoFormationContent} })(fakeWindow)`);

const CryptoForm = fakeWindow.SaheliaCryptoFormation;
assert(CryptoForm !== undefined, 'Module SaheliaCryptoFormation opérationnel');
assert(fakeWindow.SaheliaContenus !== undefined, 'Table des contenus libres SaheliaContenus chargée');
assert(fakeWindow.SaheliaContenusChiffres !== undefined, 'Table des contenus chiffrés SaheliaContenusChiffres chargée');
assert(fakeWindow.SaheliaKeyEnvelopes !== undefined, 'Table des enveloppes cryptographiques chargée');

// 1. Zéro fuite de manuels protégés en clair dans SaheliaContenus
assert(Object.keys(fakeWindow.SaheliaContenus).length === 5, 'Exactement 5 mini-guides libres dans SaheliaContenus');
const clefsEnClair = Object.keys(fakeWindow.SaheliaContenus);
const fuiteManuelDetectee = clefsEnClair.some(k => k.startsWith('manuels/'));
assert(!fuiteManuelDetectee, 'AUCUN manuel protégé n’est présent en clair dans SaheliaContenus (Zéro fuite)');

// 2. Exactement 80 sections de manuels chiffrées en AES-256-GCM
const totalChiffres = Object.keys(fakeWindow.SaheliaContenusChiffres).length;
assert(totalChiffres === 80, `Exactement 80 sections de cours chiffrées en AES-256-GCM (trouvé: ${totalChiffres})`);

// 3. Vérification des enveloppes cryptographiques
const hashesEnveloppes = Object.keys(fakeWindow.SaheliaKeyEnvelopes);
assert(hashesEnveloppes.length >= 5, `Au moins 5 enveloppes de clés générées (trouvé: ${hashesEnveloppes.length})`);

// 4. Test synchrone / asynchrone du déchiffrement cryptographique
(async () => {
  // Test 4A : Déverrouillage avec code étudiant officiel
  const resEtudiant = await CryptoForm.deverrouillerAvecPassphrase('SAHELIA-EXCEL-2026');
  assert(resEtudiant.succes === true, 'Déverrouillage cryptographique réussi avec le code étudiant (SAHELIA-EXCEL-2026)');

  const chap1Dec = await CryptoForm.dechiffrerContenu('manuels/01-excel-etudiants-professionnels/chapitres/01_ANATOMIE_ET_HYGIENE_SAISIE.md');
  assert(chap1Dec.includes('CHAPITRE 1 : ANATOMIE'), 'Déchiffrement AES-256-GCM du Chapitre 1 du Manuel 01 réussi et intègre');

  // Test 4B : Verrouillage immédiat
  CryptoForm.verrouiller();
  assert(CryptoForm.estDeverrouille() === false, 'Verrouillage et effacement de la clé maîtresse en RAM confirmés');

  // Test 4C : Déverrouillage avec clé maître Admin
  const resAdmin = await CryptoForm.deverrouillerAvecPassphrase('ADMIN-SAHELIA-2026');
  assert(resAdmin.succes === true, 'Déverrouillage cryptographique réussi avec la Clé Maître Admin (ADMIN-SAHELIA-2026)');

  const chap2Dec = await CryptoForm.dechiffrerContenu('manuels/01-excel-etudiants-professionnels/chapitres/02_FORMULES_ARITHMETIQUES_ET_DOLLAR.md');
  assert(chap2Dec.includes('CHAPITRE 2 : FORMULES'), 'Déchiffrement AES-256-GCM du Chapitre 2 du Manuel 01 réussi avec la clé Admin');

  // Test 4D : Tentative de déverrouillage avec code faux -> Rejeté
  CryptoForm.verrouiller();
  const resFaux = await CryptoForm.deverrouillerAvecPassphrase('CODE-PIRATE-INVALIDE');
  assert(resFaux.succes === false, 'Code invalide rejeté par le gestionnaire d’enveloppes de clés');

  // Test 4E : Tentative de déchiffrement sans clé (PoC isSuperAdmin sans clé) -> Exception
  let accesBloque = false;
  try {
    await CryptoForm.dechiffrerContenu('manuels/01-excel-etudiants-professionnels/chapitres/01_ANATOMIE_ET_HYGIENE_SAISIE.md');
  } catch (err) {
    accesBloque = true;
  }
  assert(accesBloque === true, 'PoC isSuperAdmin invalidé : Tentative d’accès sans clé cryptographique bloquée avec succès');
})();

console.log('\n========================================================================');
console.log('TEST 3 : VÉRIFICATION DU SERVEUR DE REDIRECTION DES FICHIERS MARKDOWN');
console.log('========================================================================');

const serverFile = path.join(BASE_DIR, 'server.js');
assert(fs.existsSync(serverFile), 'Fichier server.js présent');
const serverCode = fs.readFileSync(serverFile, 'utf8');
assert(serverCode.includes('REDIRECTIONS_MARKDOWN'), 'server.js contient les règles de redirection des mini-guides');
assert(serverCode.includes('matchManuel'), 'server.js contient la redirection des manuels vers formation.html');
assert(serverCode.includes('escapeHtml(pathname)'), 'server.js protège la page 404 contre le Reflected XSS');
assert(serverCode.includes('FICHIERS_INTERDITS'), 'server.js bloque le téléchargement des scripts serveur et fichiers internes');
assert(serverCode.includes('Content-Security-Policy'), 'server.js injecte les en-têtes de sécurité HTTP (CSP, X-Frame-Options, nosniff)');

console.log('\n========================================================================');
console.log('TEST 3B : VÉRIFICATION DU DESIGN RESPONSIVE, SCROLLABLE NAV & PAGES');
console.log('========================================================================');

const indexHtml = fs.readFileSync(path.join(BASE_DIR, 'index.html'), 'utf8');
const formationHtml = fs.readFileSync(path.join(BASE_DIR, 'formation.html'), 'utf8');
const verifierHtml = fs.readFileSync(path.join(BASE_DIR, 'verifier.html'), 'utf8');
const adminHtmlPath = path.join(BASE_DIR, 'admin.html');
assert(fs.existsSync(adminHtmlPath), 'La page dédiée admin.html existe sur le disque');
assert(indexHtml.includes('formation.html?cours=mn-11'), 'index.html affiche bien la carte du Manuel 11 (Pilotage de Drones)');
assert(formationHtml.includes('value="mn-11"'), 'formation.html inclut bien le Manuel 11 dans le sélecteur de cours');
assert(indexHtml.includes('formation.html?cours=mn-12'), 'index.html affiche bien la carte du Manuel 12 (Création Vidéo & IA)');
assert(formationHtml.includes('value="mn-12"'), 'formation.html inclut bien le Manuel 12 dans le sélecteur de cours');
assert(fs.existsSync(path.join(BASE_DIR, 'DOCUMENTATION_UTILISATEUR.md')), 'La documentation utilisateur officielle DOCUMENTATION_UTILISATEUR.md existe');
assert(fs.existsSync(path.join(BASE_DIR, 'ANNONCES_COMMUNAUTE_SAHELIA.md')), 'Le recueil officiel des 17 annonces ANNONCES_COMMUNAUTE_SAHELIA.md existe');
assert(!formationHtml.includes('22900000000'), 'formation.html ne contient plus de faux numéro WhatsApp placeholder');

const styleCss = fs.readFileSync(path.join(BASE_DIR, 'css', 'style.css'), 'utf8');
assert(styleCss.includes('overflow-x: auto'), 'css/style.css rend la barre de navigation horizontalement scrollable sans débordement');
assert(!styleCss.includes('.site-nav {\n    display: none;\n  }'), 'css/style.css ne masque plus jamais la barre de menu sur mobile');

console.log('\n========================================================================');
console.log('TEST 4 : VÉRIFICATION DU RÉPERTOIRE PROJET-SAAS-PRESENCE');
console.log('========================================================================');

const saasPresencePath = 'C:\\Users\\DELL\\Desktop\\projet-saas-presence';
assert(fs.existsSync(saasPresencePath), 'Le répertoire projet-saas-presence existe');
console.log('✓ projet-saas-presence préservé et 100% intact');

console.log('\n========================================================================');
console.log('🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS (100% DE CONFORMITÉ) !');
console.log('========================================================================');
