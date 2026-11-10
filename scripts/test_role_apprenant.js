const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir = 'C:\\Users\\DELL\\Desktop\\site-team-sahelia';

const mockElements = new Map();
function getMockEl(id) {
  if (!mockElements.has(id)) {
    mockElements.set(id, {
      id: id,
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
        toggle: () => {}
      },
      innerHTML: '',
      textContent: '',
      value: '',
      dataset: {},
      attributes: {},
      setAttribute: function(k, v) { this.attributes[k] = v; },
      getAttribute: function(k) { return this.attributes[k]; },
      removeAttribute: function(k) { delete this.attributes[k]; },
      appendChild: function(c) { return c; },
      addEventListener: () => {},
      querySelector: () => null,
      querySelectorAll: () => []
    });
  }
  return mockElements.get(id);
}

const mockWindow = {
  location: { protocol: 'http:', search: '?cours=mn-01', href: 'http://localhost/formation.html?cours=mn-01' },
  addEventListener: () => {},
  document: {
    addEventListener: () => {},
    getElementById: (id) => getMockEl(id),
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: (tag) => {
      const el = getMockEl('dynamic-' + Math.random());
      el.tagName = tag.toUpperCase();
      return el;
    },
    head: { appendChild: () => {} },
    body: getMockEl('body')
  },
  navigator: {},
  history: { replaceState: () => {} },
  scrollTo: () => {},
  crypto: { subtle: crypto.webcrypto.subtle },
  sessionStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  }
};

global.window = mockWindow;
global.document = mockWindow.document;
global.crypto = mockWindow.crypto;
global.sessionStorage = mockWindow.sessionStorage;
global.localStorage = mockWindow.localStorage;

eval(fs.readFileSync(path.join(dir, 'js', 'badge-data.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'formation-catalogue.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'formation-contenu-socle.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'crypto-formation.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'controle-acces.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'lecteur-formation.js'), 'utf8'));

(async () => {
  console.log('>>> DEBUT SIMULATION ROLE APPRENANT <<<');
  const Lecteur = mockWindow.Lecteur;
  const Crypto = mockWindow.SaheliaCryptoFormation;
  const Cat = mockWindow.SaheliaCatalogue;

  // 1. Déverrouillage automatique avec le mot de passe public
  await Crypto.deverrouillerAvecPassphrase('SAHELIA-EXCEL-2026');

  // 2. Tester l'ouverture de chacun des 5 guides libres
  for (let i = 1; i <= 5; i++) {
    const guideId = 'guide-0' + i;
    await Lecteur.chargerCours(guideId);
    const corpsHtml = getMockEl('corps-cours-rendu').innerHTML;
    if (!corpsHtml || corpsHtml.length < 50 || corpsHtml.includes('Impossible de charger')) {
      throw new Error('Echec affichage guide : ' + guideId);
    }
  }
  console.log('Role Apprenant : 5 / 5 Guides libres ouverts et affiches avec succes !');

  // 3. Tester l'ouverture de chacun des 12 manuels strategiques
  for (let i = 1; i <= 12; i++) {
    const mnId = 'mn-' + (i < 10 ? '0' + i : i);
    // Charger le chunk correspondant en memoire vive
    const chunkPath = path.join(dir, 'js', 'contenus', 'cours-' + mnId + '.js');
    eval(fs.readFileSync(chunkPath, 'utf8'));

    await Lecteur.chargerCours(mnId);
    const corpsHtml = getMockEl('corps-cours-rendu').innerHTML;
    if (!corpsHtml || corpsHtml.length < 50 || corpsHtml.includes('Impossible de charger')) {
      throw new Error('Echec affichage manuel : ' + mnId);
    }

    // Tester la navigation interne de chapitre (ch-01 -> ch-02 -> ch-01 pour verifier le cache session)
    const cours = Cat.obtenirCours(mnId);
    if (cours.chapitres && cours.chapitres.length >= 2) {
      await Lecteur.chargerCours(mnId, cours.chapitres[1].id);
      const ch2Html = getMockEl('corps-cours-rendu').innerHTML;
      if (!ch2Html || ch2Html.includes('Impossible de charger')) throw new Error('Echec ch-02 de ' + mnId);

      // Retour sur ch-01 : Doit venir du cache mmoire (0 ms)
      const tailleCacheAvant = Lecteur.cacheChapitresRendus.size;
      await Lecteur.chargerCours(mnId, cours.chapitres[0].id);
      const ch1Html = getMockEl('corps-cours-rendu').innerHTML;
      if (!ch1Html || ch1Html.includes('Impossible de charger')) throw new Error('Echec retour ch-01 de ' + mnId);
      if (Lecteur.cacheChapitresRendus.size < tailleCacheAvant) throw new Error('Cache perdu sur ' + mnId);
    }
  }
  console.log('Role Apprenant : 12 / 12 Manuels strategiques ouverts et navigues sans erreur !');
  console.log('Role Apprenant : Cache session actif, taille en memoire :', Lecteur.cacheChapitresRendus.size, 'chapitres mémorises.');

  console.log('>>> ROLE APPRENANT VALIDE A 100% SANS AUCUNE ANOMALIE ! <<<');
})();
