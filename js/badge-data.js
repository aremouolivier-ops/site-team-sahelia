/**
 * TEAM Sahélia - Registre Central des Badges & Référentiel de Données
 * Gère les Membres, Formations, Cohortes, Compétences et Attributions.
 * Persistance sécurisée dans localStorage avec données initiales de terrain.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. RÉFÉRENTIEL DES MEMBRES OFFICIELS (Vierge pour démarrage en production)
  // ---------------------------------------------------------------------------
  const MEMBRES_INIT = [];

  // ---------------------------------------------------------------------------
  // 2. RÉFÉRENTIEL DES FORMATIONS DU CATALOGUE
  // ---------------------------------------------------------------------------
  const FORMATIONS_INIT = [
    {
      id: 'FOR-SIG-01',
      titre: 'Cartographie Parcellaire Smartphone & QGIS',
      pole: 'Géomatique & Agronomie de Précision',
      accentColor: '#2563eb', // Bleu royal
      duree: '30 heures (6 semaines)',
      niveauRequis: 'Étudiants FA-UP (L2 à Master)',
      description: 'Relevé GPS smartphone au champ, projection métrique UTM zone 31N, calcul de surface en hectares et export de cartes d’essais agronomiques.',
      formateur: 'Référent Géomatique TEAM Sahélia',
    },
    {
      id: 'FOR-BUR-01',
      titre: 'Bureautique Académique : Mémoires Word & Excel',
      pole: 'Outils de Recherche & Méthodologie',
      accentColor: '#5fd0a0', // Vert épi / forêt
      duree: '18 heures (3 semaines)',
      niveauRequis: 'Tout étudiant de fin de cycle',
      description: 'Styles hiérarchiques automatiques, pagination mixte (romains/arabes) et tableaux de données d’essais conformes aux jurys.',
      formateur: 'Conseil Pédagogique TEAM Sahélia',
    },
    {
      id: 'FOR-IA-01',
      titre: 'Vibe Coding & IA pour la Recherche Agricole',
      pole: 'Intelligence Artificielle & Automatisation',
      accentColor: '#10b981', // Émeraude tech
      duree: '24 heures (4 semaines)',
      niveauRequis: 'Agronomes et curieux du numérique',
      description: 'Prompts de recherche avec méthode C.R.E.D. sans hallucination bibliographique et génération de scripts d’analyse de données de récolte.',
      formateur: 'Pôle Innovation TEAM Sahélia',
    },
    {
      id: 'FOR-DRN-01',
      titre: 'Pilotage de Drones & Agriculture de Précision',
      pole: 'Drones & Télédétection',
      accentColor: '#38bdf8',
      duree: '35 heures',
      niveauRequis: 'Agronomes et opérateurs terrain',
      description: 'Pilotage Mode 2, plans de vol automatisés, photogrammétrie et pulvérisation calibrée.',
      formateur: 'Unité Drones TEAM Sahélia',
    }
  ];

  // ---------------------------------------------------------------------------
  // 3. COHORTES (Vierge pour démarrage en production)
  // ---------------------------------------------------------------------------
  const COHORTES_INIT = [];

  // ---------------------------------------------------------------------------
  // 4. RÉFÉRENTIEL DES COMPÉTENCES & DISPOSITIF D'ÉVALUATION
  // ---------------------------------------------------------------------------
  const COMPETENCES_INIT = [
    {
      id: 'SKL-SIG-PARCELLE',
      titre: 'Délimitation & Cartographie Parcellaire QGIS',
      domaine: 'Géomatique Appliquée à l’Agronomie',
      accentColor: '#e8946a', // Terracotta / or
      niveaux: ['Pratique Validée', 'Avancé', 'Expert Terrain'],
      criteres: [
        'Relevé de 4 sommets minimum au GPS smartphone avec pause stabilisée (précision < 4m)',
        'Import CSV sous QGIS et projection métrique UTM zone 31N (EPSG:32631)',
        'Numérisation vectorielle du polygone et calcul de surface en hectares ($area / 10000)',
        'Export d’une carte d’essai normalisée avec flèche Nord, échelle graphique et fond satellite',
      ],
      dispositif: 'Évaluation sur livrable de terrain réel validée par le référent SIG de TEAM Sahélia.',
    },
    {
      id: 'SKL-VIBE-CLEANING',
      titre: 'Vibe Coding : Automatisation & Nettoyage de Données',
      domaine: 'Informatique & Intelligence Artificielle',
      accentColor: '#5fd0a0', // Vert émeraude
      niveaux: ['Pratique Validée', 'Avancé'],
      criteres: [
        'Rédaction d’un prompt structuré selon la méthode C.R.E.D. (Contexte, Rôle, Exigence, Délimitation)',
        'Génération et exécution d’un script Python de nettoyage d’un tableau d’essais agronomiques',
        'Vérification croisée des moyennes et détection d’aberrations sans hallucination de l’IA',
      ],
      dispositif: 'Revue de code en direct sur un jeu de données réel.',
    },
    {
      id: 'SKL-BUR-MEMOIRE',
      titre: 'Structuration Avancée de Document Académique',
      domaine: 'Méthodologie de Recherche',
      accentColor: '#7fb0ee', // Bleu ciel
      niveaux: ['Pratique Validée'],
      criteres: [
        'Mise en place de styles hiérarchiques avec numérotation automatique sans sauts de lignes vides',
        'Gestion de la pagination mixte (chiffres romains en liminaire, arabes pour le corps du mémoire)',
        'Mise en forme des tableaux statistiques avec répétition automatique de la ligne d’en-tête',
      ],
      dispositif: 'Contrôle technique du fichier Word et validation académique.',
    },
    {
      id: 'SKL-DRONE-TERRAIN',
      titre: 'Pilotage & Télédétection par Drone Agricole',
      domaine: 'Drones & Agriculture de Précision',
      accentColor: '#38bdf8',
      niveaux: ['Pratique Validée', 'Avancé', 'Opérateur Agréé'],
      criteres: [
        'Check-list pré-vol et calibration compas/IMU en milieu rural',
        'Pilotage manuel Mode 2 avec atterrissage de précision sur cible',
        'Programmation de mission photogrammétrique avec GSD < 2,5 cm/px',
        'Sécurité ANAC Bénin et calcul de dérive vent / downwash',
      ],
      dispositif: 'Vol de contrôle en conditions réelles supervisé par un instructeur.',
    }
  ];

  // ---------------------------------------------------------------------------
  // 5. ATTRIBUTIONS RÉELLES DE COMPÉTENCES (Vierge pour démarrage en production)
  // ---------------------------------------------------------------------------
  const ATTRIBUTIONS_INIT = [];

  // ---------------------------------------------------------------------------
  // 6. RÉFÉRENTIEL DES ACTIVITÉS & ANNONCES PUBLIQUES DU SITE (Vierge en production)
  // ---------------------------------------------------------------------------
  const ACTIVITES_INIT = [];
  const ANNONCES_INIT = [];

  // ---------------------------------------------------------------------------
  // 7. GESTION DU STOCKAGE PERSISTANT (LOCALSTORAGE SAFE & PURGE FICTIVE)
  // ---------------------------------------------------------------------------
  // Migration de version : purger immédiatement toute ancienne donnée de test/fictive
  try {
    if (typeof localStorage !== 'undefined') {
      const dbVersion = localStorage.getItem('sahelia_db_production_ver');
      if (dbVersion !== 'prod_v3_pure') {
        localStorage.removeItem('sahelia_membres_db');
        localStorage.removeItem('sahelia_cohortes_db');
        localStorage.removeItem('sahelia_attributions_db');
        localStorage.removeItem('sahelia_activites_db');
        localStorage.setItem('sahelia_db_production_ver', 'prod_v3_pure');
      }
    }
  } catch (e) {}

  function chargerRegistre(cle, fallback) {
    try {
      if (typeof localStorage === 'undefined') return fallback;
      const val = localStorage.getItem('sahelia_' + cle);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      console.warn('Stockage non disponible pour', cle, e);
      return fallback;
    }
  }

  function sauvegarderRegistre(cle, data) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem('sahelia_' + cle, JSON.stringify(data));
    } catch (e) {
      console.warn('Erreur écriture stockage pour', cle, e);
    }
  }

  // État singleton de la base
  const DB = {
    membres: chargerRegistre('membres_db', MEMBRES_INIT),
    formations: chargerRegistre('formations_db', FORMATIONS_INIT),
    cohortes: chargerRegistre('cohortes_db', COHORTES_INIT),
    competences: chargerRegistre('competences_db', COMPETENCES_INIT),
    attributions: chargerRegistre('attributions_db', ATTRIBUTIONS_INIT),
    activites: chargerRegistre('activites_db', ACTIVITES_INIT),
    annonces: chargerRegistre('annonces_db', ANNONCES_INIT),

    sauvegarderMembres() {
      sauvegarderRegistre('membres_db', this.membres);
    },
    sauvegarderCohortes() {
      sauvegarderRegistre('cohortes_db', this.cohortes);
    },
    sauvegarderAttributions() {
      sauvegarderRegistre('attributions_db', this.attributions);
    },
    sauvegarderActivites() {
      sauvegarderRegistre('activites_db', this.activites);
    },
    sauvegarderAnnonces() {
      sauvegarderRegistre('annonces_db', this.annonces);
    },

    // Inscrire un participant dans une cohorte
    inscrireParticipantCohorte(cohorteId, part) {
      const coh = this.cohortes.find((c) => c && c.id === cohorteId);
      if (!coh) return null;
      if (!Array.isArray(coh.participants)) {
        coh.participants = [];
      }
      if (!part.id) {
        // Calcul d'un ID unique sans collision
        let maxNum = coh.participants.length;
        coh.participants.forEach((p) => {
          const m = String(p.id || '').match(/(\d+)$/);
          if (m) {
            const val = parseInt(m[1], 10);
            if (val > maxNum) maxNum = val;
          }
        });
        const num = String(maxNum + 1).padStart(3, '0');
        const codeCohorte = String(coh.id || 'COH').replace(/[^A-Za-z0-9]/g, '').slice(0, 6).toUpperCase();
        part.id = `TS-FOR-2026-${codeCohorte}-${num}`;
      }
      coh.participants.push(part);
      this.sauvegarderCohortes();
      return part;
    },

    // Délivrer une nouvelle attestation de compétence
    delivrerCompetence(data) {
      // Calcul d'un ID unique sans collision
      let maxNum = this.attributions.length;
      this.attributions.forEach((a) => {
        const m = String(a.id || '').match(/(\d+)$/);
        if (m) {
          const val = parseInt(m[1], 10);
          if (val > maxNum) maxNum = val;
        }
      });
      const num = String(maxNum + 1).padStart(3, '0');
      const nouvelId = `TS-SKL-2026-${num}`;
      const nouvelleAttribution = {
        id: nouvelId,
        membreId: data.membreId || null,
        beneficiaireNom: data.beneficiaireNom || 'Titulaire',
        beneficiaireRole: data.beneficiaireRole || 'Étudiant Agronome',
        competenceId: data.competenceId,
        titreCompetence: data.titreCompetence || 'Compétence Validée',
        niveau: data.niveau || 'Pratique Validée',
        dateAttribution: data.dateAttribution || new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
        validePar: data.validePar || 'Sègla Bio KPEROU (Référent SIG · FA-UP)',
        statut: 'valide',
        preuveProjet: data.preuveProjet || 'Projet de terrain validé selon le protocole officiel.',
      };
      this.attributions.push(nouvelleAttribution);
      this.sauvegarderAttributions();
      return nouvelleAttribution;
    },

    // Révocation d'un badge
    revoquerBadge(badgeId, motif) {
      if (!badgeId) return false;
      const cleanId = String(badgeId).trim().toUpperCase();
      // Chercher dans attributions
      const attr = this.attributions.find((a) => a && String(a.id || '').trim().toUpperCase() === cleanId);
      if (attr) {
        attr.statut = 'revoque';
        attr.motifRevocation = motif || 'Badge révoqué par décision du Conseil Académique.';
        this.sauvegarderAttributions();
        return true;
      }
      // Chercher dans participants de cohorte
      for (const coh of this.cohortes) {
        const parts = Array.isArray(coh?.participants) ? coh.participants : [];
        const part = parts.find((p) => p && String(p.id || '').trim().toUpperCase() === cleanId);
        if (part) {
          part.statut = 'revoque';
          part.motifRevocation = motif || 'Participation invalidée.';
          this.sauvegarderCohortes();
          return true;
        }
      }
      return false;
    },

    // Réhabilitation d'un badge révoqué
    rehabiliterBadge(badgeId) {
      if (!badgeId) return false;
      const cleanId = String(badgeId).trim().toUpperCase();
      const attr = this.attributions.find((a) => a && String(a.id || '').trim().toUpperCase() === cleanId);
      if (attr) {
        attr.statut = 'valide';
        delete attr.motifRevocation;
        this.sauvegarderAttributions();
        return true;
      }
      for (const coh of this.cohortes) {
        const parts = Array.isArray(coh?.participants) ? coh.participants : [];
        const part = parts.find((p) => p && String(p.id || '').trim().toUpperCase() === cleanId);
        if (part) {
          part.statut = 'termine';
          delete part.motifRevocation;
          this.sauvegarderCohortes();
          return true;
        }
      }
      return false;
    },

    // Gestion des activités
    ajouterActivite(act) {
      if (!act.id) act.id = 'act-' + Date.now();
      this.activites.push(act);
      this.sauvegarderActivites();
      return act;
    },

    supprimerActivite(actId) {
      this.activites = this.activites.filter((a) => a && a.id !== actId);
      this.sauvegarderActivites();
    },

    // Recherche d'un badge par ID universel (pour vérification)
    trouverBadgeParId(badgeId) {
      if (!badgeId) return null;
      const cleanId = String(badgeId).trim().toUpperCase();

      // 1. Chercher dans les attestations de compétences
      const attr = this.attributions.find((a) => a && String(a.id || '').trim().toUpperCase() === cleanId);
      if (attr) {
        const comp = this.competences.find((c) => c && c.id === attr.competenceId) || {};
        return {
          id: attr.id,
          type: 'competence',
          titre: attr.titreCompetence,
          niveau: attr.niveau,
          beneficiaireNom: attr.beneficiaireNom,
          beneficiaireRole: attr.beneficiaireRole,
          sexe: attr.sexe || 'M',
          photo: attr.photo || null,
          dateEmission: attr.dateAttribution,
          validePar: attr.validePar,
          statut: attr.statut, // 'valide' | 'revoque'
          motifRevocation: attr.motifRevocation || null,
          preuveProjet: attr.preuveProjet,
          criteres: Array.isArray(comp.criteres) ? comp.criteres : [],
          dispositif: comp.dispositif || '',
          domaine: comp.domaine || 'Compétence Certifiée',
          accentColor: comp.accentColor || '#e8946a',
        };
      }

      // 2. Chercher dans les participants de cohortes
      for (const coh of this.cohortes) {
        const parts = Array.isArray(coh?.participants) ? coh.participants : [];
        const part = parts.find((p) => p && String(p.id || '').trim().toUpperCase() === cleanId);
        if (part) {
          const form = this.formations.find((f) => f && f.id === coh.formationId) || {};
          return {
            id: part.id,
            type: 'formation',
            titre: form.titre || 'Formation TEAM Sahélia',
            pole: form.pole || 'Pôle Académique',
            cohorteNom: coh.nom,
            periode: coh.periode,
            lieu: coh.lieu,
            formateur: coh.formateurPrincipal || form.formateur,
            beneficiaireNom: part.nom,
            beneficiaireRole: part.role,
            sexe: part.sexe || 'M',
            photo: part.photo || null,
            statut: part.statut, // 'termine' | 'en_cours' | 'inscrit' | 'revoque'
            motifRevocation: part.motifRevocation || null,
            dateEmission: part.dateEmission,
            mention: part.mention || '',
            description: form.description || '',
            accentColor: form.accentColor || '#2563eb',
          };
        }
      }

      // 3. Chercher dans les membres de la communauté
      const mem = this.membres.find((m) => m && String(m.id || m.matricule || '').trim().toUpperCase() === cleanId);
      if (mem) {
        return {
          id: mem.id || mem.matricule,
          type: 'membre',
          titre: 'Membre Officiel de la Communauté',
          beneficiaireNom: mem.nom,
          beneficiaireRole: mem.role,
          sexe: mem.sexe || 'M',
          institution: mem.institution,
          dateEmission: mem.dateAdhesion,
          statut: mem.statut || 'actif',
          photo: mem.photo,
          slogan: mem.slogan,
          tags: Array.isArray(mem.tags) ? mem.tags : [],
          accentColor: '#5fd0a0',
        };
      }

      return null;
    },
  };

  window.SaheliaDB = DB;
})();
