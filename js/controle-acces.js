/**
 * TEAM Sahélia — Système de Sécurité & Contrôle d'Accès Pédagogique
 * Double Authentification : Badge Officiel Vérifié + Code d'Accès Fondation Rotatif
 * Gestion des Sessions Sécurisées & Révocation Immédiate par Époque de Sécurité
 */

(function () {
  'use strict';

  const STORAGE_KEY_CONFIG = 'ts_securite_formation_config';
  const STORAGE_KEY_SESSION = 'ts_securite_formation_session';
  const STORAGE_KEY_TENTATIVES = 'ts_securite_tentatives_bruteforce';

  // Empreintes cryptographiques SHA-256 des clés maîtres autorisées (Zéro mot de passe en clair)
  const EMPREINTES_ADMIN_AUTORISEES = new Set([
    'ac652d8d99483da8d0ad7377bf9fe819502d8ed7a62aa3fe41948182b8d7a799',
    '2f52815c4bc49674a4acd945e4c29dc21ccd514f0de9f3ba058c8e9c57dd39ba',
    '651ac027036f331d4073184debe2d4d04261d70eba0e52880cb2b20603982b44',
    '53f3d117a6ee2df6ab132a696496867067bd7193e5b2622fb8c1edec21f72e98',
    'cd91a826ff1f5a3aacd47dbb5aa5846b2d265cf4a14bac53d1176f60e7ce4faa',
    'fallback_2954e5f4',
    'fallback_20532d6d',
    'fallback_1d09768c',
    'fallback_436bbceb',
    'fallback_3452c73b'
  ]);

  // Empreinte initiale du code de lancement de la plateforme
  const HASH_INITIAL_DEFAUT = 'ac652d8d99483da8d0ad7377bf9fe819502d8ed7a62aa3fe41948182b8d7a799';
  const HASH_FALLBACK_DEFAUT = 'fallback_2954e5f4';

  /**
   * Calcul d'une empreinte SHA-256 (Web Crypto API avec repli synchrone déterministe pour file:///)
   */
  async function sha256(chaine) {
    const texte = String(chaine || '').trim().toUpperCase();
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      try {
        const msgUint8 = new TextEncoder().encode(texte);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        // En cas de contexte non-sécurisé (file:///), passer au repli déterministe
      }
    }
    let hash = 0;
    for (let i = 0; i < texte.length; i++) {
      const char = texte.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
  }

  const Securite = {
    _config: null,
    _modeAdminSuggereParUrl: false,

    /**
     * Initialisation et chargement de la configuration de sécurité
     */
    async init() {
      let brut = null;
      try {
        brut = localStorage.getItem(STORAGE_KEY_CONFIG);
      } catch (e) {}

      if (brut) {
        try {
          this._config = JSON.parse(brut);
        } catch (e) {
          this._config = null;
        }
      }

      if (!this._config || !this._config.codeHash) {
        const supporteWebCrypto = Boolean(typeof window !== 'undefined' && window.crypto && window.crypto.subtle);
        const hashInitial = supporteWebCrypto ? HASH_INITIAL_DEFAUT : HASH_FALLBACK_DEFAUT;
        this._config = {
          codeHash: hashInitial,
          codeFallbackHash: HASH_FALLBACK_DEFAUT,
          securityEpoch: 1,
          dateCreation: new Date().toISOString(),
          derniereRotation: new Date().toISOString(),
          auteurDerniereModif: 'Fondateur (Configuration Initiale)',
          historique: [
            {
              date: new Date().toISOString(),
              action: 'Initialisation du système de sécurité',
              auteur: 'Fondateur',
              epoch: 1,
              note: 'Double authentification activée'
            }
          ]
        };
        this._sauvegarderConfig();
      }

      // SÉCURITÉ : Aucun contournement automatique par paramètre d'URL !
      // Le paramètre ?admin=1 ou ?mode=editeur sert uniquement à pré-sélectionner l'onglet UI Admin.
      try {
        if (typeof window !== 'undefined' && window.location && window.location.search) {
          const params = new URLSearchParams(window.location.search);
          const adminParam = params.get('admin') || params.get('mode');
          if (adminParam) {
            this._modeAdminSuggereParUrl = true;
          }
        }
      } catch (e) {}
    },

    _sauvegarderConfig() {
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(this._config));
      } catch (e) {}
    },

    /**
     * Récupération publique des métadonnées de sécurité (sans exposer de secret)
     */
    obtenirStatutSecurite() {
      if (!this._config) return { actif: false };
      return {
        actif: true,
        epoch: this._config.securityEpoch,
        derniereRotation: this._config.derniereRotation,
        auteurDerniereModif: this._config.auteurDerniereModif,
        nombreRotations: (this._config.historique || []).length
      };
    },

    /**
     * Vérifie si le visiteur subit actuellement un ralentissement anti-bruteforce
     * Stocké dans localStorage ET sessionStorage pour empêcher le contournement par nouvel onglet
     */
    _verifierBlocageBruteforce() {
      try {
        const brut = localStorage.getItem(STORAGE_KEY_TENTATIVES) || sessionStorage.getItem(STORAGE_KEY_TENTATIVES) || '{}';
        const donnees = JSON.parse(brut);
        const now = Date.now();
        if (donnees.bloqueJusquA && donnees.bloqueJusquA > now) {
          const secondesRestantes = Math.ceil((donnees.bloqueJusquA - now) / 1000);
          return { bloque: true, secondes: secondesRestantes };
        }
      } catch (e) {}
      return { bloque: false, secondes: 0 };
    },

    _enregistrerEchecBruteforce() {
      try {
        const brut = localStorage.getItem(STORAGE_KEY_TENTATIVES) || sessionStorage.getItem(STORAGE_KEY_TENTATIVES) || '{}';
        const donnees = JSON.parse(brut);
        donnees.echecs = (donnees.echecs || 0) + 1;
        const now = Date.now();

        if (donnees.echecs >= 5) {
          donnees.bloqueJusquA = now + 30 * 1000; // 30 secondes de gel
        } else if (donnees.echecs >= 3) {
          donnees.bloqueJusquA = now + 5 * 1000; // 5 secondes de gel
        }
        const json = JSON.stringify(donnees);
        localStorage.setItem(STORAGE_KEY_TENTATIVES, json);
        sessionStorage.setItem(STORAGE_KEY_TENTATIVES, json);
      } catch (e) {}
    },

    _reinitialiserEchecsBruteforce() {
      try {
        localStorage.removeItem(STORAGE_KEY_TENTATIVES);
        sessionStorage.removeItem(STORAGE_KEY_TENTATIVES);
      } catch (e) {}
    },

    /**
     * Contrôle d'accès à un cours spécifique du catalogue
     */
    verifierAccesCours(coursId) {
      if (!window.SaheliaCatalogue) {
        return { autorise: false, raison: 'Catalogue indisponible' };
      }

      const cours = window.SaheliaCatalogue.obtenirCours(coursId);
      if (!cours) {
        return { autorise: false, raison: 'Cours inexistant dans le catalogue' };
      }

      // MODE ACCÈS 100% LIBRE : Tous les manuels et guides sont ouverts à tous sans restriction
      const session = this.obtenirSessionValide();
      return {
        autorise: true,
        mode: 'libre',
        cours: cours,
        session: session
      };
    },

    /**
     * Récupère la session courante si elle existe et respecte l'époque de sécurité
     */
    obtenirSessionValide() {
      if (!this._config) return null;

      let session = null;
      try {
        const sessionBrute = sessionStorage.getItem(STORAGE_KEY_SESSION) || localStorage.getItem(STORAGE_KEY_SESSION);
        if (sessionBrute) {
          session = JSON.parse(sessionBrute);
        }
      } catch (e) {
        return null;
      }

      if (!session || !session.badgeId) return null;

      // 1. Révocation immédiate si l'époque de sécurité est dépassée (s'applique aussi aux sessions antérieures)
      if (typeof session.epoch !== 'number' || session.epoch < this._config.securityEpoch) {
        this.deconnecter();
        return null;
      }

      // 2. Super-Administrateur / Éditeur validé pour l'époque courante
      if (session.isSuperAdmin === true) {
        // Sécurité anti-falsification : si un hash ou une clé est présente, vérifier sa conformité
        if (session.passHash && !EMPREINTES_ADMIN_AUTORISEES.has(session.passHash) && (!this._config || session.passHash !== this._config.codeHash)) {
          this.deconnecter();
          return null;
        }
        return session;
      }

      // 3. Contrôle de conformité dynamique du badge via SaheliaDB
      if (window.SaheliaDB && typeof window.SaheliaDB.trouverBadgeParId === 'function') {
        const badge = window.SaheliaDB.trouverBadgeParId(session.badgeId);
        if (!badge) {
          this.deconnecter();
          return null;
        }

        // Si le badge a été révoqué ou suspendu entre-temps
        if (badge.statut === 'revoque' || badge.statut === 'suspendu') {
          this.deconnecter();
          return null;
        }

        // Rafraîchir les métadonnées utiles
        session.badgeNom = badge.beneficiaireNom;
        session.badgeRole = badge.beneficiaireRole || badge.institution || '';
        session.badgeType = badge.type;
        session.statut = badge.statut;
      }

      return session;
    },

    /**
     * Authentification Super-Administrateur & Éditeur (Sans Badge)
     * Permet au fondateur ou à l'équipe pédagogique d'accéder à 100% des manuels et à la console
     */
    async authentifierAdmin(cleAdmin, seSouvenir = true) {
      // 1. Contrôle anti-bruteforce obligatoire
      const controleBlocage = this._verifierBlocageBruteforce();
      if (controleBlocage.bloque) {
        return {
          succes: false,
          erreur: `Trop de tentatives erronées. Veuillez patienter ${controleBlocage.secondes} seconde(s) avant de réessayer.`
        };
      }

      const clePropre = String(cleAdmin || '').trim();
      if (!clePropre) {
        this._enregistrerEchecBruteforce();
        return {
          succes: false,
          erreur: 'Veuillez saisir votre Clé Maître d’Administration / Édition.'
        };
      }

      await this.init();
      const hashSaisi = await sha256(clePropre);

      const correspondConfig =
        this._config &&
        (hashSaisi === this._config.codeHash ||
          hashSaisi === this._config.codeFallbackHash ||
          hashSaisi === this._config.customAdminHash);

      const autorise = EMPREINTES_ADMIN_AUTORISEES.has(hashSaisi) || correspondConfig;

      if (!autorise) {
        this._enregistrerEchecBruteforce();
        return {
          succes: false,
          erreur: 'Clé d’Administration / Édition invalide.'
        };
      }

      this._reinitialiserEchecsBruteforce();

      // Déverrouillage cryptographique en mémoire vive des manuels stratégiques
      if (typeof window !== 'undefined' && window.SaheliaCryptoFormation && typeof window.SaheliaCryptoFormation.deverrouillerAvecPassphrase === 'function') {
        try {
          await window.SaheliaCryptoFormation.deverrouillerAvecPassphrase(clePropre);
        } catch (e) {}
      }

      const session = {
        badgeId: 'TS-ADM-FONDATEUR',
        badgeNom: 'Direction & Édition TEAM Sahélia',
        badgeRole: 'Super-Administrateur & Éditeur en Chef',
        badgeType: 'admin',
        statut: 'actif',
        isSuperAdmin: true,
        epoch: this._config ? this._config.securityEpoch : 1,
        dateConnexion: new Date().toISOString(),
        cleDeverrouillage: clePropre,
        passHash: hashSaisi
      };

      const sessionJson = JSON.stringify(session);
      try {
        sessionStorage.setItem(STORAGE_KEY_SESSION, sessionJson);
        if (seSouvenir) {
          localStorage.setItem(STORAGE_KEY_SESSION, sessionJson);
        }
      } catch (e) {}

      return {
        succes: true,
        session: session,
        message: 'Accès Super-Administrateur & Éditeur validé avec succès.'
      };
    },

    /**
     * Authentification complète : Vérification Badge + Code Fondation
     */
    async authentifier(badgeId, codeClair, seSouvenir = false) {
      // 1. Vérification bruteforce
      const controleBlocage = this._verifierBlocageBruteforce();
      if (controleBlocage.bloque) {
        return {
          succes: false,
          erreur: `Trop de tentatives erronées. Veuillez patienter ${controleBlocage.secondes} seconde(s) avant de réessayer.`
        };
      }

      const idPropre = String(badgeId || '').trim().toUpperCase();
      const codePropre = String(codeClair || '').trim();

      // Raccourci direct Super-Administrateur / Éditeur
      if (idPropre === 'ADMIN' || idPropre === 'FONDATEUR' || idPropre === 'EDITEUR' || idPropre === 'TS-ADM-FONDATEUR') {
        return await this.authentifierAdmin(codePropre, seSouvenir);
      }

      if (!idPropre) {
        this._enregistrerEchecBruteforce();
        return {
          succes: false,
          erreur: 'Veuillez saisir votre identifiant de badge officiel TEAM Sahélia (ex: TS-MBR-2026-001).'
        };
      }

      if (!codePropre) {
        this._enregistrerEchecBruteforce();
        return {
          succes: false,
          erreur: 'Veuillez saisir le code d’accès communiqué par le fondateur.'
        };
      }

      // 2. Vérification de l'existence et du statut du badge
      if (!window.SaheliaDB || typeof window.SaheliaDB.trouverBadgeParId !== 'function') {
        return {
          succes: false,
          erreur: 'Le registre central des badges est momentanément indisponible.'
        };
      }

      const badge = window.SaheliaDB.trouverBadgeParId(idPropre);
      if (!badge) {
        this._enregistrerEchecBruteforce();
        return {
          succes: false,
          erreur: `Aucun badge officiel correspondant à « ${idPropre} » n’a été trouvé dans le registre TEAM Sahélia.`
        };
      }

      if (badge.statut === 'revoque') {
        this._enregistrerEchecBruteforce();
        return {
          succes: false,
          erreur: `Ce badge (${idPropre}) a été révoqué par l’administration. Motif : ${badge.motifRevocation || 'Non spécifié'}. Accès refusé.`
        };
      }

      // 3. Vérification du code d'accès par rapport au hash stocké
      await this.init();
      const hashSaisi = await sha256(codePropre);
      const correspondCode =
        hashSaisi === this._config.codeHash ||
        hashSaisi === this._config.codeFallbackHash ||
        EMPREINTES_ADMIN_AUTORISEES.has(hashSaisi);

      if (!correspondCode) {
        this._enregistrerEchecBruteforce();
        return {
          succes: false,
          erreur: 'Le code d’accès saisi est invalide ou a été renouvelé par le fondateur.'
        };
      }

      // Réinitialisation des erreurs bruteforce en cas de succès
      this._reinitialiserEchecsBruteforce();

      // Déverrouillage cryptographique en mémoire vive des manuels stratégiques
      if (typeof window !== 'undefined' && window.SaheliaCryptoFormation && typeof window.SaheliaCryptoFormation.deverrouillerAvecPassphrase === 'function') {
        try {
          await window.SaheliaCryptoFormation.deverrouillerAvecPassphrase(codePropre);
        } catch (e) {}
      }

      // 4. Création de la session autorisée
      const session = {
        badgeId: badge.id,
        badgeNom: badge.beneficiaireNom,
        badgeRole: badge.beneficiaireRole || badge.institution || '',
        badgeType: badge.type,
        statut: badge.statut,
        epoch: this._config.securityEpoch,
        dateConnexion: new Date().toISOString(),
        cleDeverrouillage: codePropre,
        passHash: hashSaisi
      };

      const sessionJson = JSON.stringify(session);
      try {
        sessionStorage.setItem(STORAGE_KEY_SESSION, sessionJson);
        if (seSouvenir) {
          localStorage.setItem(STORAGE_KEY_SESSION, sessionJson);
        } else {
          localStorage.removeItem(STORAGE_KEY_SESSION);
        }
      } catch (e) {}

      return {
        succes: true,
        session: session,
        badge: badge
      };
    },

    /**
     * Déconnexion et suppression des jetons de session
     */
    deconnecter() {
      try {
        sessionStorage.removeItem(STORAGE_KEY_SESSION);
        localStorage.removeItem(STORAGE_KEY_SESSION);
        if (typeof window !== 'undefined' && window.SaheliaCryptoFormation && typeof window.SaheliaCryptoFormation.verrouiller === 'function') {
          window.SaheliaCryptoFormation.verrouiller();
        }
        if (typeof window !== 'undefined' && window.Lecteur && typeof window.Lecteur.viderCacheMemoire === 'function') {
          window.Lecteur.viderCacheMemoire();
        }
      } catch (e) {}
    },

    // =========================================================================
    // FONCTIONNALITÉS FONDATION & ADMINISTRATION SÉCURISÉE
    // =========================================================================

    /**
     * Modification du code d'accès par le fondateur
     * Incrémente automatiquement l'époque de sécurité pour invalider les anciennes sessions
     */
    async mettreAJourCode(nouveauCode, auteur = 'Fondateur', raison = 'Renouvellement périodique') {
      const codePropre = String(nouveauCode || '').trim();
      if (!codePropre || codePropre.length < 6) {
        return {
          succes: false,
          erreur: 'Le nouveau code doit contenir au moins 6 caractères.'
        };
      }

      await this.init();
      const nouveauHash = await sha256(codePropre);
      const nouvelleEpoch = (this._config.securityEpoch || 1) + 1;

      this._config.codeHash = nouveauHash;
      this._config.securityEpoch = nouvelleEpoch;
      this._config.derniereRotation = new Date().toISOString();
      this._config.auteurDerniereModif = auteur;

      if (!Array.isArray(this._config.historique)) {
        this._config.historique = [];
      }

      this._config.historique.unshift({
        date: new Date().toISOString(),
        action: 'Rotation du code d’accès',
        auteur: auteur,
        epoch: nouvelleEpoch,
        note: raison
      });

      this._sauvegarderConfig();

      return {
        succes: true,
        nouvelleEpoch: nouvelleEpoch,
        date: this._config.derniereRotation,
        message: 'Code d’accès mis à jour avec succès. Toutes les sessions actives antérieures ont été révoquées instantanément.'
      };
    },

    /**
     * Révocation d'urgence immédiate de tous les accès actifs (sans forcément changer le code)
     */
    revoquerTousLesAcces(auteur = 'Fondateur', raison = 'Révocation générale préventive') {
      if (!this._config) return { succes: false };

      const nouvelleEpoch = (this._config.securityEpoch || 1) + 1;
      this._config.securityEpoch = nouvelleEpoch;
      this._config.derniereRotation = new Date().toISOString();
      this._config.auteurDerniereModif = auteur;

      if (!Array.isArray(this._config.historique)) {
        this._config.historique = [];
      }

      this._config.historique.unshift({
        date: new Date().toISOString(),
        action: 'Révocation générale d’urgence',
        auteur: auteur,
        epoch: nouvelleEpoch,
        note: raison
      });

      this._sauvegarderConfig();

      return {
        succes: true,
        nouvelleEpoch: nouvelleEpoch,
        message: `Révocation appliquée. L’époque de sécurité passe à ${nouvelleEpoch}. Tous les apprenants devront se réauthentifier.`
      };
    },

    /**
     * Modification du mot de passe Administrateur
     * Vérifie l'ancien mot de passe puis hache et enregistre le nouveau mot de passe
     */
    async changerMotDePasseAdmin(ancienMdp, nouveauMdp) {
      await this.init();
      const ancPropre = String(ancienMdp || '').trim();
      const nouvPropre = String(nouveauMdp || '').trim();

      if (!ancPropre) {
        return { succes: false, erreur: 'Veuillez saisir votre mot de passe administrateur actuel.' };
      }
      if (!nouvPropre || nouvPropre.length < 6) {
        return { succes: false, erreur: 'Le nouveau mot de passe administrateur doit comporter au moins 6 caractères.' };
      }

      const ancHash = await sha256(ancPropre);
      const estValide =
        (this._config && (ancHash === this._config.customAdminHash || ancHash === this._config.codeHash)) ||
        EMPREINTES_ADMIN_AUTORISEES.has(ancHash);

      if (!estValide) {
        return { succes: false, erreur: 'Le mot de passe administrateur actuel est incorrect.' };
      }

      const nouvHash = await sha256(nouvPropre);
      this._config.customAdminHash = nouvHash;
      this._config.derniereModifAdmin = new Date().toISOString();

      if (!Array.isArray(this._config.historique)) {
        this._config.historique = [];
      }
      this._config.historique.unshift({
        date: new Date().toISOString(),
        action: 'Modification mot de passe administrateur',
        auteur: 'Direction',
        epoch: this._config.securityEpoch || 1,
        note: 'Clé d’accès administrateur mise à jour'
      });

      this._sauvegarderConfig();

      return {
        succes: true,
        message: 'Votre mot de passe Administrateur a été modifié avec succès.'
      };
    },

    /**
     * Récupère le journal d'audit de sécurité
     */
    obtenirJournalSecurite() {
      if (!this._config) return [];
      return this._config.historique || [];
    }
  };

  // Initialisation immédiate
  Securite.init().catch(console.error);

  window.SaheliaSecurite = Securite;

  // =========================================================================
  // SYSTÈME DE VALIDATION SÉMANTIQUE STRICTE (SAHELIA VALIDATEUR)
  // =========================================================================
  window.SaheliaValidateur = {
    // Format international strict (+ indicatif pays de 1 à 3 chiffres puis 6 à 14 chiffres)
    // Exemples : +22997000000 (Bénin), +33612345678 (France), +22507000000 (Côte d'Ivoire)
    validerTelephone(tel, obligatoire = true) {
      if (!tel || !String(tel).trim()) {
        if (!obligatoire) return { valide: true, valeur: '' };
        return { valide: false, message: 'Le numéro de téléphone est obligatoire.' };
      }
      const propre = String(tel).trim().replace(/[\s.-]/g, '');
      const regex = /^\+[1-9]\d{7,14}$/;
      if (!regex.test(propre)) {
        return {
          valide: false,
          message: 'Format international obligatoire (+ et indicatif pays, ex: +22997000000).'
        };
      }
      return { valide: true, valeur: propre };
    },

    // Nom & Prénoms : lettres alphabétiques, accents, tirets, espaces
    validerNom(nom, libelle = 'Nom') {
      if (!nom || !String(nom).trim()) {
        return { valide: false, message: `Le champ « ${libelle} » est obligatoire.` };
      }
      const propre = String(nom).trim();
      if (propre.length < 2 || propre.length > 70) {
        return { valide: false, message: `Le champ « ${libelle} » doit comporter entre 2 et 70 caractères.` };
      }
      const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,70}$/;
      if (!regex.test(propre)) {
        return { valide: false, message: `Le champ « ${libelle} » contient des caractères non autorisés.` };
      }
      return { valide: true, valeur: propre };
    },

    // Email conforme standard RFC
    validerEmail(email, obligatoire = false) {
      if (!email || !String(email).trim()) {
        if (!obligatoire) return { valide: true, valeur: '' };
        return { valide: false, message: 'L’adresse email est obligatoire.' };
      }
      const propre = String(email).trim().toLowerCase();
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regex.test(propre)) {
        return { valide: false, message: 'Adresse email invalide (ex: contact@domaine.com).' };
      }
      return { valide: true, valeur: propre };
    },

    // Texte général nettoyé de balises HTML
    validerTexte(texte, libelle, min = 2, max = 255, obligatoire = true) {
      if (!texte || !String(texte).trim()) {
        if (!obligatoire) return { valide: true, valeur: '' };
        return { valide: false, message: `Le champ « ${libelle} » est obligatoire.` };
      }
      const propre = String(texte).trim();
      if (propre.length < min || propre.length > max) {
        return { valide: false, message: `Le champ « ${libelle} » doit comporter entre ${min} et ${max} caractères.` };
      }
      if (/<[^>]*>/g.test(propre)) {
        return { valide: false, message: `Le champ « ${libelle} » ne doit pas contenir de balises HTML.` };
      }
      return { valide: true, valeur: propre };
    },

    // URL sécurisée (http ou https)
    validerUrl(url, obligatoire = false) {
      if (!url || !String(url).trim()) {
        if (!obligatoire) return { valide: true, valeur: '' };
        return { valide: false, message: 'L’adresse web (URL) est obligatoire.' };
      }
      const propre = String(url).trim();
      try {
        const parsed = new URL(propre);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          return { valide: false, message: 'L’URL doit débuter par http:// ou https://' };
        }
        return { valide: true, valeur: parsed.href };
      } catch (e) {
        return { valide: false, message: 'Format d’URL invalide (ex: https://exemple.com).' };
      }
    }
  };
})();
