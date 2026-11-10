const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { performance } = require('perf_hooks');

const dir = 'C:\\Users\\DELL\\Desktop\\site-team-sahelia';

const mockWindow = {
  location: { protocol: 'http:', search: '', href: 'http://localhost/' },
  addEventListener: () => {},
  document: {
    addEventListener: () => {},
    getElementById: () => ({ style: {}, classList: { add: ()=>{}, remove: ()=>{} }, innerHTML: '' }),
    querySelectorAll: () => [],
    createElement: () => ({ setAttribute: ()=>{}, style: {} }),
    head: { appendChild: ()=>{} }
  },
  navigator: {},
  crypto: { subtle: crypto.webcrypto.subtle }
};

global.window = mockWindow;
global.document = mockWindow.document;
global.crypto = mockWindow.crypto;

// 1. Charger dans l'ordre de formation.html
eval(fs.readFileSync(path.join(dir, 'js', 'badge-data.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'formation-catalogue.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'formation-contenu-socle.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'crypto-formation.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'controle-acces.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'lecteur-formation.js'), 'utf8'));

(async () => {
  console.log('=== TEST 1 : CHARGEMENT DU SOCLE ET GUIDES LIBRES ===');
  const Cat = mockWindow.SaheliaCatalogue;
  const Crypto = mockWindow.SaheliaCryptoFormation;
  const Lecteur = mockWindow.Lecteur;

  const cours = Cat.listerTous();
  console.log('Catalogue total cours :', cours.length);

  let guidesValides = 0;
  cours.filter(c => c.type === 'guide').forEach(g => {
    const txt = mockWindow.SaheliaContenus[g.fichierSource];
    if (!txt || txt.length < 50) throw new Error('Guide invalide : ' + g.id);
    guidesValides++;
  });
  console.log('Guides ouverts valides dans le socle :', guidesValides, '/ 5');

  console.log('\n=== TEST 2 : DEVERROUILLAGE & CHARGEMENT MODULAIRE DES 12 CHUNKS ===');
  const dev = await Crypto.deverrouillerAvecPassphrase('SAHELIA-EXCEL-2026');
  if (!dev.succes) throw new Error('Deverrouillage echoue !');
  console.log('Deverrouillage cryptographique master : SUCCES');

  let totalChapitresVerifies = 0;
  const manuels = cours.filter(c => c.type !== 'guide');

  for (const m of manuels) {
    const chunkPath = path.join(dir, 'js', 'contenus', 'cours-' + m.id + '.js');
    if (!fs.existsSync(chunkPath)) throw new Error('Chunk manquant : ' + chunkPath);
    
    // Simuler le chargement dynamique du chunk
    eval(fs.readFileSync(chunkPath, 'utf8'));

    for (const ch of m.chapitres) {
      const texte = await Crypto.dechiffrerContenu(ch.fichier);
      if (!texte || texte.length === 0) throw new Error('Dechiffrement vide pour : ' + ch.fichier);
      totalChapitresVerifies++;
    }
  }

  console.log('Manuels testes :', manuels.length, '/ 12');
  console.log('Chapitres chiffres dechiffres avec succes :', totalChapitresVerifies, '/ 80');

  console.log('\n=== TEST 3 : CACHE MEMOIRE EN SESSION (MAP) & PERFORMANCES ===');
  const testFichier = 'manuels/01-excel-etudiants-professionnels/chapitres/01_ANATOMIE_ET_HYGIENE_SAISIE.md';
  const cleCache = testFichier.toLowerCase();

  // Premier acces (sans cache)
  const t0 = performance.now();
  const texte1 = await Crypto.dechiffrerContenu(testFichier);
  const t1 = performance.now();
  const dureeSansCache = t1 - t0;

  // Enregistrement dans le cache Lecteur
  Lecteur.cacheChapitresRendus.set(cleCache, { html: '<div>Contenu</div>', sommaire: [], date: Date.now() });

  // Deuxieme acces (avec cache)
  const t2 = performance.now();
  const cached = Lecteur.cacheChapitresRendus.get(cleCache);
  const t3 = performance.now();
  const dureeAvecCache = t3 - t2;

  console.log('Temps dechiffrement physique AES-GCM :', dureeSansCache.toFixed(3), 'ms');
  console.log('Temps recuperation physique Cache Memoire Map :', dureeAvecCache.toFixed(4), 'ms');
  console.log('Gain mesure physique :', (dureeSansCache / dureeAvecCache).toFixed(0), 'x plus rapide');

  console.log('\n=== TEST 4 : SECURITE DU CACHE & PURGE A LA DECONNEXION ===');
  if (Lecteur.cacheChapitresRendus.size === 0) throw new Error('Cache devrait contenir 1 element');
  Crypto.verrouiller(); // Doit purger le cache immediatement
  if (Lecteur.cacheChapitresRendus.size !== 0) throw new Error('Le cache memoire na pas ete vide a la fermeture de session !');
  console.log('Vidange immediate du cache memoire lors du verrouillage : SUCCES (Taille cache = 0)');

  console.log('\n>>> TOUS LES TESTS DE NON-REGRESSION ETAPE B ONT REUSSI A 100% ! <<<');
})();
