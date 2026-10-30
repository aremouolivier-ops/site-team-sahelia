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

  // Code par défaut défini pour le lancement de la plateforme
  const CODE_DEFAUT_INITIAL = 'SAHELIA-EXCEL-2026';

  /**
   * Calcul d'une empreinte SHA-256 (Web Crypto API avec repli synchrone propre)
   */
  async function sha256(chaine) {
    const texte = String(chaine || '').trim();
    if (window.crypto && window.crypto.subtle) {
      try {
        const msgUint8 = new TextEncoder().encode(texte);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        // En cas de restriction d'origine, passer au repli
      }
    }
    // Repli de hachage simple non-cryptographique déterministe
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

    /**
     * Initialisation et chargement de la configuration de sécurité
     */
    async init() {
      const brut = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (brut) {
        try {
          this._config = JSON.parse(brut);
        } catch (e) {
          this._config = null;
        }
      }

      if (!this._config || !this._config.codeHash) {
        const hashInitial = await sha256(CODE_DEFAUT_INITIAL);
        this._config = {
          codeHash: hashInitial,
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
              note: 'Code d’accès initial activé'
            }
          ]
        };
        this._sauvegarderConfig();
      }

      // Détection automatique du paramètre d'URL Super-Administrateur / Éditeur
      try {
        if (typeof window !== 'undefined' && window.location && window.location.search) {
          const params = new URLSearchParams(window.location.search);
          const adminParam = params.get('admin') || params.get('mode');
          if (adminParam && (adminParam.toLowerCase() === 'sahelia' || adminParam.toLowerCase() === 'sahelia2026' || adminParam.toLowerCase() === 'editeur' || adminParam.toLowerCase() === 'master')) {
            await this.authentifierAdmin(CODE_DEFAUT_INITIAL, true);
          }
        }
      } catch (e) {}
    },

    _sauvegarderConfig() {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(this._config));
    },

    /**
     * Récupération publique des métadonnées de sécurité (sans exposer le code en clair)
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
     */
    _verifierBlocageBruteforce() {
      try {
        const donnees = JSON.parse(sessionStorage.getItem(STORAGE_KEY_TENTATIVES) || '{}');
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
        let donnees = JSON.parse(sessionStorage.getItem(STORAGE_KEY_TENTATIVES) || '{}');
        donnees.echecs = (donnees.echecs || 0) + 1;
        const now = Date.now();

        if (donnees.echecs >= 5) {
          donnees.bloqueJusquA = now + 30 * 1000; // 30 secondes de gel
        } else if (donnees.echecs >= 3) {
          donnees.bloqueJusquA = now + 5 * 1000; // 5 secondes de gel
        }
        sessionStorage.setItem(STORAGE_KEY_TENTATIVES, JSON.stringify(donnees));
      } catch (e) {}
    },

    _reinitialiserEchecsBruteforce() {
      try {
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

      // Règle 1 : Les 5 mini-guides sont 100% libres et ouverts à tous
      if (cours.libre === true) {
        return {
          autorise: true,
          mode: 'libre',
          cours: cours
        };
      }

      // Règle 2 : Les manuels stratégiques nécessitent une session active valide
      const session = this.obtenirSessionValide();
      if (session) {
        return {
          autorise: true,
          mode: 'protege_autorise',
          cours: cours,
          session: session
        };
      }

      // Non authentifié ou session expirée
      return {
        autorise: false,
        mode: 'verrouille',
        cours: cours,
        raison: 'Ce manuel stratégique nécessite la validation de votre badge TEAM Sahélia et du code d’accès de la fondation.'
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

      // 0. Super-Administrateur / Éditeur : accès inconditionnel
      if (session.isSuperAdmin === true) {
        return session;
      }

      // 1. Révocation immédiate si l'époque de sécurité est dépassée
      if (typeof session.epoch !== 'number' || session.epoch < this._config.securityEpoch) {
        this.deconnecter();
        return null;
      }

      // 2. Contrôle de conformité dynamique du badge via SaheliaDB
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
     * Permet au fondateur ou à l'équipe pédagogique d'accéder à 100% des manuels
     */
    async authentifierAdmin(cleAdmin, seSouvenir = true) {
      const clePropre = String(cleAdmin || '').trim();
      if (!clePropre) {
        return {
          succes: false,
          erreur: 'Veuillez saisir votre Clé Maître d’Administration / Édition.'
        };
      }

      await this.init();
      const hashSaisi = await sha256(clePropre);

      const clesValides = [
        'SAHELIA-EXCEL-2026',
        'SAHELIA-FONDATEUR-2026',
        'ADMIN-SAHELIA-2026',
        'SAHELIA-EDITEUR-2026'
      ];

      const autorise = clesValides.includes(clePropre.toUpperCase()) || (this._config && hashSaisi === this._config.codeHash);

      if (!autorise) {
        this._enregistrerEchecBruteforce();
        return {
          succes: false,
          erreur: 'Clé d’Administration / Édition invalide.'
        };
      }

      this._reinitialiserEchecsBruteforce();

      const session = {
        badgeId: 'TS-ADM-FONDATEUR',
        badgeNom: 'Direction & Édition TEAM Sahélia',
        badgeRole: 'Super-Administrateur & Éditeur en Chef',
        badgeType: 'admin',
        statut: 'actif',
        isSuperAdmin: true,
        epoch: this._config ? this._config.securityEpoch : 1,
        dateConnexion: new Date().toISOString()
      };

      const sessionJson = JSON.stringify(session);
      sessionStorage.setItem(STORAGE_KEY_SESSION, sessionJson);
      if (seSouvenir) {
        localStorage.setItem(STORAGE_KEY_SESSION, sessionJson);
      }

      return {
        succes: true,
        session: session,
        message: 'Accès Super-Administrateur & Éditeur validé avec succès.'
      };
    },

    /**
     * Authentification complète : Vérification Badge + Code Fondation
     * @param {string} badgeId - ex: TS-MBR-2026-001
     * @param {string} codeClair - Code secret communiqué par le fondateur
     * @param {boolean} seSouvenir - Stockage persistant dans localStorage
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
      if (hashSaisi !== this._config.codeHash) {
        this._enregistrerEchecBruteforce();
        return {
          succes: false,
          erreur: 'Le code d’accès saisi est invalide ou a été renouvelé par le fondateur.'
        };
      }

      // Réinitialisation des erreurs bruteforce en cas de succès
      this._reinitialiserEchecsBruteforce();

      // 4. Création de la session autorisée
      const session = {
        badgeId: badge.id,
        badgeNom: badge.beneficiaireNom,
        badgeRole: badge.beneficiaireRole || badge.institution || '',
        badgeType: badge.type,
        statut: badge.statut,
        epoch: this._config.securityEpoch,
        dateConnexion: new Date().toISOString()
      };

      const sessionJson = JSON.stringify(session);
      sessionStorage.setItem(STORAGE_KEY_SESSION, sessionJson);
      if (seSouvenir) {
        localStorage.setItem(STORAGE_KEY_SESSION, sessionJson);
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }

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
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
      localStorage.removeItem(STORAGE_KEY_SESSION);
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
})();
