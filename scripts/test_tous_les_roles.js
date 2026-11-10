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
    data: new Map(),
    getItem: function(k) { return this.data.get(k) || null; },
    setItem: function(k, v) { this.data.set(k, String(v)); },
    removeItem: function(k) { this.data.delete(k); }
  },
  localStorage: {
    data: new Map(),
    getItem: function(k) { return this.data.get(k) || null; },
    setItem: function(k, v) { this.data.set(k, String(v)); },
    removeItem: function(k) { this.data.delete(k); }
  }
};

global.window = mockWindow;
global.document = mockWindow.document;
global.crypto = mockWindow.crypto;
global.sessionStorage = mockWindow.sessionStorage;
global.localStorage = mockWindow.localStorage;

// Charger tous les composants de l'application
eval(fs.readFileSync(path.join(dir, 'js', 'badge-crypto.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'badge-data.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'badge-engine.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'formation-catalogue.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'formation-contenu-socle.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'formation-contenu.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'crypto-formation.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'controle-acces.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'js', 'lecteur-formation.js'), 'utf8'));

(async () => {
  console.log('================================================================');
  console.log('AUDIT DE QUALITE INTEGRALE : SIMULATION MULTI-ROLES SAHELIA');
  console.log('================================================================');

  const DB = mockWindow.SaheliaDB;
  const BadgeEngine = mockWindow.SaheliaBadgeEngine;
  const Securite = mockWindow.SaheliaSecurite;
  const Crypto = mockWindow.SaheliaCryptoFormation;
  const Cat = mockWindow.SaheliaCatalogue;
  const Lecteur = mockWindow.Lecteur;

  // --------------------------------------------------------------------------
  // ROLE 1 : APPRENANT / VISITEUR
  // --------------------------------------------------------------------------
  console.log('\n[ROLE 1 : APPRENANT & VISITEUR PUBLIC]');
  // Ouverture d'un guide libre
  await Lecteur.chargerCours('guide-01');
  if (!getMockEl('corps-cours-rendu').innerHTML.includes('Mini-Guide 01')) {
    throw new Error('Echec affichage Guide 01 pour Apprenant');
  }
  // Ouverture d'un manuel protege (chargement automatique via master key)
  await Lecteur.chargerCours('mn-01');
  if (!getMockEl('corps-cours-rendu').innerHTML.includes('Manuel')) {
    throw new Error('Echec affichage Manuel 01 pour Apprenant');
  }
  console.log('-> Acces 100% libre et fluide pour les apprenants : VALIDE');

  // --------------------------------------------------------------------------
  // ROLE 2 : VERIFICATEUR DE BADGES (verifier.html)
  // --------------------------------------------------------------------------
  console.log('\n[ROLE 2 : VERIFICATEUR EXTERNE DE BADGES]');
  const tousBadges = DB.attestations || [];
  console.log('-> Total attestations dans l annuaire public :', tousBadges.length);
  if (tousBadges.length === 0) throw new Error('Annuaire des badges vide !');

  const premierBadge = tousBadges[0];
  const badgeTrouve = DB.trouverBadgeParId(premierBadge.id);
  if (!badgeTrouve || badgeTrouve.id !== premierBadge.id) {
    throw new Error('Impossible de retrouver le badge : ' + premierBadge.id);
  }
  console.log('-> Recherche et verification instantanee par ID (' + premierBadge.id + ') : VALIDE');

  // --------------------------------------------------------------------------
  // ROLE 3 : EDITEUR PEDAGOGIQUE (admin.html)
  // --------------------------------------------------------------------------
  console.log('\n[ROLE 3 : EDITEUR PEDAGOGIQUE]');
  // Authentification de l'editeur avec son mot de passe reserve
  const authEditeur = await Securite.authentifierAdmin('SAHELIA-EDITEUR-2026', false);
  if (!authEditeur.succes) throw new Error('Echec authentification Editeur !');
  console.log('-> Authentification Editeur (SAHELIA-EDITEUR-2026) : SUCCES');

  // L'editeur cree un contenu personnalise
  const contenuPersonnalise = '# Chapitre Edite par la Direction Peda\nContenu exclusif actualise.';
  const coursMn01 = Cat.obtenirCours('mn-01');
  coursMn01.chapitres[0].contenuMarkdown = contenuPersonnalise;

  // Le lecteur doit immediatement afficher ce contenu sans etre bloque par le cache
  await Lecteur.chargerCours('mn-01', coursMn01.chapitres[0].id);
  const renduEdite = getMockEl('corps-cours-rendu').innerHTML;
  if (!renduEdite.includes('Chapitre Edite par la Direction Peda')) {
    throw new Error('Le lecteur a servi une version en cache au lieu du contenu edite !');
  }
  console.log('-> Prise en compte immediate des modifications de l Editeur sans cache stale : VALIDE');

  // Nettoyage de l'override pour restaurer le catalogue initial
  delete coursMn01.chapitres[0].contenuMarkdown;

  // --------------------------------------------------------------------------
  // ROLE 4 : ADMINISTRATEUR / FONDATEUR
  // --------------------------------------------------------------------------
  console.log('\n[ROLE 4 : ADMINISTRATEUR & FONDATEUR]');
  // Authentification Fondateur
  const authFondateur = await Securite.authentifierAdmin('SAHELIA-FONDATEUR-2026', false);
  if (!authFondateur.succes) throw new Error('Echec authentification Fondateur !');
  console.log('-> Authentification Fondateur (SAHELIA-FONDATEUR-2026) : SUCCES');

  // Creation d'une nouvelle enveloppe cryptographique (rotation de cle)
  const codeNouveau = 'CODE-PROMO-SAHELIA-2026';
  const nouvEnv = await Crypto.creerNouvelleEnveloppe(codeNouveau);
  if (!nouvEnv.succes || !nouvEnv.hash) {
    throw new Error('Echec generation nouvelle enveloppe cryptographique !');
  }
  console.log('-> Generation d enveloppe cryptographique dynamique pour rotation : VALIDE');

  // Deconnexion et purge du cache memoire
  Securite.deconnecter();
  if (Crypto.estDeverrouille()) {
    throw new Error('La cle CEK est restee en memoire apres deconnexion !');
  }
  if (Lecteur.cacheChapitresRendus.size !== 0) {
    throw new Error('Le cache memoire session n a pas ete purge lors de la deconnexion admin !');
  }
  console.log('-> Verrouillage strict et purge totale de session a la deconnexion : VALIDE');

  // --------------------------------------------------------------------------
  // BILAN FINAL
  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log('RESULTAT DE L AUDIT MULTI-ROLES : 100% SUCCES SUR TOUS LES ROLES');
  console.log('================================================================');
})();
