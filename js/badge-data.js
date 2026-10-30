/**
 * TEAM Sahélia - Registre Central des Badges & Référentiel de Données
 * Gère les Membres, Formations, Cohortes, Compétences et Attributions.
 * Persistance sécurisée dans localStorage avec données initiales de terrain.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. RÉFÉRENTIEL DES MEMBRES OFFICIELS
  // ---------------------------------------------------------------------------
  const MEMBRES_INIT = [
    {
      id: 'TS-ADM-FONDATEUR',
      nom: 'Direction & Édition TEAM Sahélia',
      sexe: 'M',
      role: 'Fondateur & Éditeur en Chef',
      institution: 'TEAM Sahélia · Campus de Parakou',
      dateAdhesion: '01 Janvier 2026',
      statut: 'actif',
      photo: 'assets/avatars/segla_kperou.jpg',
      slogan: 'Apprendre. Créer. Innover.',
      tags: ['Administration', 'Édition', 'Superviseur'],
    },
    {
      id: 'TS-MBR-2026-001',
      nom: 'Sègla Bio KPEROU',
      sexe: 'M',
      role: 'Référent Cartographie SIG & Agronomie',
      institution: 'Faculté d’Agronomie (FA-UP) · Parakou',
      dateAdhesion: '15 Janvier 2026',
      statut: 'actif',
      photo: 'assets/avatars/segla_kperou.jpg',
      slogan: 'L’agronomie de demain maîtrise la terre et la donnée.',
      tags: ['QGIS', 'ArcGIS', 'GPS Smartphone', 'FA-UP'],
    },
    {
      id: 'TS-MBR-2026-002',
      nom: 'Olivier AREMOU',
      sexe: 'M',
      role: 'Coordinateur Pédagogique & Innovation',
      institution: 'TEAM Sahélia · Parakou',
      dateAdhesion: '15 Janvier 2026',
      statut: 'actif',
      photo: 'assets/avatars/oumar_traore.jpg',
      slogan: 'Bâtir pour de vrai : des compétences solides pour la jeunesse.',
      tags: ['Vibe Coding', 'Pédagogie', 'Innovation Logicielle'],
    },
    {
      id: 'TS-MBR-2026-003',
      nom: 'Mariam DIALLO',
      sexe: 'F',
      role: 'Communication & Vulgarisation Scientifique',
      institution: 'TEAM Sahélia · Parakou',
      dateAdhesion: '01 Février 2026',
      statut: 'actif',
      photo: 'assets/avatars/fatou_sow.jpg',
      slogan: 'Rendre le numérique accessible à chaque étudiant sans jargon.',
      tags: ['Vulgarisation', 'Design', 'Réseaux'],
    },
    {
      id: 'TS-MBR-2026-004',
      nom: 'Babatoundé Eric DOSSOU',
      sexe: 'M',
      role: 'Étudiant Agronome (Master Production Végétale)',
      institution: 'FA-UP · Université de Parakou',
      dateAdhesion: '10 Février 2026',
      statut: 'actif',
      photo: null,
      slogan: 'La donnée parcellaire au service des rendements agricoles.',
      tags: ['Agronomie', 'Production Végétale', 'Parcelles'],
    },
    {
      id: 'TS-MBR-2026-005',
      nom: 'Amina CHABI',
      sexe: 'F',
      role: 'Étudiante Agronome (L3 Économie Rurale)',
      institution: 'FA-UP · Université de Parakou',
      dateAdhesion: '12 Février 2026',
      statut: 'actif',
      photo: 'assets/avatars/aicha_diallo.jpg',
      slogan: 'Collecte mobile et analyse d’enquêtes terrain fiables.',
      tags: ['KoboToolbox', 'Enquêtes', 'Économie Rurale'],
    },
  ];

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
      formateur: 'Sègla Bio KPEROU',
    },
    {
      id: 'FOR-BUR-01',
      titre: 'Bureautique Académique : Mémoires Word & Excel',
      pole: 'Outils de Recherche & Méthodologie',
      accentColor: '#5fd0a0', // Vert épi / forêt
      duree: '18 heures (3 semaines)',
      niveauRequis: 'Tout étudiant de fin de cycle',
      description: 'Styles hiérarchiques automatiques, pagination mixte (romains/arabes) et tableaux de données d’essais conformes aux jurys.',
      formateur: 'Olivier AREMOU',
    },
    {
      id: 'FOR-IA-01',
      titre: 'Vibe Coding & IA pour la Recherche Agricole',
      pole: 'Intelligence Artificielle & Automatisation',
      accentColor: '#10b981', // Émeraude tech
      duree: '24 heures (4 semaines)',
      niveauRequis: 'Agronomes et curieux du numérique',
      description: 'Prompts de recherche avec méthode C.R.E.D. sans hallucination bibliographique et génération de scripts d’analyse de données de récolte.',
      formateur: 'Olivier AREMOU',
    },
  ];

  // ---------------------------------------------------------------------------
  // 3. COHORTES & PARTICIPANTS RÉELS
  // ---------------------------------------------------------------------------
  const COHORTES_INIT = [
    {
      id: 'COH-2026-QGIS-1',
      formationId: 'FOR-SIG-01',
      nom: 'Cohorte Alpha — FA-UP Parakou',
      periode: '15 Octobre — 28 Novembre 2026',
      lieu: 'Campus FA-UP & Parcelles d’Essais Parakou',
      formateurPrincipal: 'Sègla Bio KPEROU (Référent SIG)',
      participants: [
        {
          id: 'TS-FOR-2026-Q1-001',
          nom: 'Babatoundé Eric DOSSOU',
          sexe: 'M',
          role: 'Étudiant Master FA-UP',
          statut: 'termine', // termine | en_cours | inscrit
          dateEmission: '28 Octobre 2026',
          mention: 'Projet parcellaire validé avec mention Très Bien',
        },
        {
          id: 'TS-FOR-2026-Q1-002',
          nom: 'Amina CHABI',
          sexe: 'F',
          role: 'Étudiante L3 FA-UP',
          statut: 'en_cours',
          dateEmission: '15 Octobre 2026',
          mention: 'Module QGIS 2 en cours · Présence 100%',
          photo: 'assets/avatars/aicha_diallo.jpg',
        },
        {
          id: 'TS-FOR-2026-Q1-003',
          nom: 'Rodrigue K. HONVO',
          sexe: 'M',
          role: 'Étudiant L3 Agronomie',
          statut: 'en_cours',
          dateEmission: '15 Octobre 2026',
          mention: 'Collecte GPS terrain effectuée avec succès',
        },
        {
          id: 'TS-FOR-2026-Q1-004',
          nom: 'Clarisse T. MEDEGAN',
          sexe: 'F',
          role: 'Doctorante FA-UP',
          statut: 'termine',
          dateEmission: '28 Octobre 2026',
          mention: 'Carte d’essai expérimentale maïs validée',
        },
        {
          id: 'TS-FOR-2026-Q1-005',
          nom: 'Pascal A. BIO GOURA',
          sexe: 'M',
          role: 'Technicien de Recherche Agricole',
          statut: 'inscrit',
          dateEmission: '15 Octobre 2026',
          mention: 'Dossier administratif confirmé',
        },
      ],
    },
    {
      id: 'COH-2026-BUR-1',
      formationId: 'FOR-BUR-01',
      nom: 'Cohorte Urgence Mémoire — Novembre 2026',
      periode: '03 Novembre — 24 Novembre 2026',
      lieu: 'Laboratoire Informatique FA-UP & En ligne',
      formateurPrincipal: 'Olivier AREMOU',
      participants: [
        {
          id: 'TS-FOR-2026-B1-001',
          nom: 'Amina CHABI',
          sexe: 'F',
          role: 'Étudiante L3 FA-UP',
          statut: 'termine',
          dateEmission: '26 Octobre 2026',
          mention: 'Modèle de mémoire FA-UP structuré sans faille',
          photo: 'assets/avatars/aicha_diallo.jpg',
        },
        {
          id: 'TS-FOR-2026-B1-002',
          nom: 'Rodrigue K. HONVO',
          sexe: 'M',
          role: 'Étudiant L3 Agronomie',
          statut: 'en_cours',
          dateEmission: '03 Novembre 2026',
          mention: 'En cours d’apprentissage',
        },
        {
          id: 'TS-FOR-2026-B1-003',
          nom: 'Florentin B. KORA',
          sexe: 'M',
          role: 'Étudiant Master FA-UP',
          statut: 'inscrit',
          dateEmission: '03 Novembre 2026',
          mention: 'Inscription confirmée',
        },
      ],
    },
  ];

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
      dispositif: 'Revue de code en direct sur un jeu de données réel de la Faculté d’Agronomie.',
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
      dispositif: 'Contrôle technique du fichier Word et export PDF avant impression finale.',
    },
  ];

  // ---------------------------------------------------------------------------
  // 5. ATTRIBUTIONS RÉELLES DE COMPÉTENCES (VALIDÉES PAR L'AUTORITÉ)
  // ---------------------------------------------------------------------------
  const ATTRIBUTIONS_INIT = [
    {
      id: 'TS-SKL-2026-001',
      membreId: 'TS-MBR-2026-004',
      beneficiaireNom: 'Babatoundé Eric DOSSOU',
      beneficiaireRole: 'Étudiant Master FA-UP · Université de Parakou',
      competenceId: 'SKL-SIG-PARCELLE',
      titreCompetence: 'Délimitation & Cartographie Parcellaire QGIS',
      niveau: 'Pratique Validée',
      dateAttribution: '25 Octobre 2026',
      validePar: 'Sègla Bio KPEROU (Référent SIG · FA-UP)',
      statut: 'valide', // valide | revoque
      preuveProjet: 'Parcelle expérimentale de maïs (Zone périurbaine de Parakou · 2,45 ha). Shapefile (.shp) et carte PDF vérifiés.',
    },
    {
      id: 'TS-SKL-2026-002',
      membreId: 'TS-MBR-2026-001',
      beneficiaireNom: 'Sègla Bio KPEROU',
      beneficiaireRole: 'Référent Cartographie SIG & Agronomie',
      competenceId: 'SKL-SIG-PARCELLE',
      titreCompetence: 'Délimitation & Cartographie Parcellaire QGIS',
      niveau: 'Expert Terrain',
      dateAttribution: '15 Janvier 2026',
      validePar: 'Conseil Pédagogique TEAM Sahélia',
      statut: 'valide',
      preuveProjet: 'Formateur principal du programme géomatique et encadrement des sorties de terrain FA-UP.',
    },
    {
      id: 'TS-SKL-2026-003',
      membreId: 'TS-MBR-2026-002',
      beneficiaireNom: 'Olivier AREMOU',
      beneficiaireRole: 'Coordinateur Pédagogique & Innovation',
      competenceId: 'SKL-VIBE-CLEANING',
      titreCompetence: 'Vibe Coding : Automatisation & Nettoyage de Données',
      niveau: 'Avancé',
      dateAttribution: '18 Janvier 2026',
      validePar: 'Comité Technique TEAM Sahélia',
      statut: 'valide',
      preuveProjet: 'Conception des modules pratiques et scripts de traitement automatique des relevés de parcelles.',
    },
    {
      id: 'TS-SKL-2026-REVOKED',
      membreId: null,
      beneficiaireNom: 'Exemple Révocation Test',
      beneficiaireRole: 'Auditeur Externe Non Certifié',
      competenceId: 'SKL-SIG-PARCELLE',
      titreCompetence: 'Délimitation & Cartographie Parcellaire QGIS',
      niveau: 'Pratique Validée',
      dateAttribution: '01 Février 2026',
      validePar: 'Comité de Discipline',
      statut: 'revoque',
      motifRevocation: 'Dossier incomplet : les données de bornes GPS relevées étaient non conformes au protocole de vérification.',
      preuveProjet: 'Données caduques.',
    },
  ];

  // ---------------------------------------------------------------------------
  // 6. RÉFÉRENTIEL DES ACTIVITÉS & ACTUALITÉS DU SITE
  // ---------------------------------------------------------------------------
  const ACTIVITES_INIT = [
    {
      id: 'act-01',
      type: 'Lancement Officiel',
      titre: 'Publication des 2 Vidéos d’Annonce',
      date: 'Octobre 2026',
      description: 'Diffusion de la vidéo Grand Public et de l’édition spéciale Étudiants FA-UP Parakou avec univers sonore calibré.',
      statut: 'Diffusé',
      couleur: '#5fd0a0',
    },
    {
      id: 'act-02',
      type: 'Atelier Pratique',
      titre: 'Session Terrain : Relevés GPS & Cartographie QGIS',
      date: 'En préparation',
      description: 'Formation pas-à-pas pour les agronomes : importation des coordonnées d’essais et calcul de surface en hectares.',
      statut: 'Inscriptions Ouvertes',
      couleur: '#e8946a',
    },
    {
      id: 'act-03',
      type: 'Guide Pratique',
      titre: 'Parution du Mini-Guide n°01 : Urgence Mémoire & Rapport',
      date: 'Disponible',
      description: 'Les 10 règles incontournables sous Word & Excel pour structurer un document académique sans stress.',
      statut: 'Accès Libre',
      couleur: '#7fb0ee',
    },
  ];

  // ---------------------------------------------------------------------------
  // 7. GESTION DU STOCKAGE PERSISTANT (LOCALSTORAGE SAFE)
  // ---------------------------------------------------------------------------
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
      const mem = this.membres.find((m) => m && String(m.id || '').trim().toUpperCase() === cleanId);
      if (mem) {
        return {
          id: mem.id,
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
