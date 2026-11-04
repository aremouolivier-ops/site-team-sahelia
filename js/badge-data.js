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
      niveauRequis: 'Ouvert à tous (Étudiants, Chercheurs, Professionnels)',
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
  // 4. RÉFÉRENTIEL DES 4 BADGES OFFICIELS OPEN BADGES 3.0 & CRITÈRES DE TERRAIN
  // ---------------------------------------------------------------------------
  const COMPETENCES_INIT = [
    {
      id: 'SKL-MBR-PIONNIER',
      code: 'pionnier',
      titre: 'Membre Pionnier · Communauté TEAM Sahélia',
      domaine: 'Engagement Communautaire & Citoyenneté Numérique',
      niveau: 'Bronze · Foundation',
      formeGeometrique: 'pentagone',
      accentColor: '#cd7f32',
      niveaux: ['Bronze · Foundation'],
      criteres: [
        'Adhésion officielle et inscription validée au registre officiel TEAM Sahélia',
        'Participation active aux canaux collaboratifs et entraide communautaire WhatsApp',
        'Engagement formel envers la charte d’éthique et de partage libre des savoirs'
      ],
      dispositif: 'Enregistrement validé par la coordination générale de TEAM Sahélia.',
      validateur: 'Olivier AREMOU (Coordinateur Général)'
    },
    {
      id: 'SKL-SIG-PARCELLE',
      code: 'sig',
      titre: 'Praticien SIG & Cartographie Parcellaire (QGIS & GPS)',
      domaine: 'Géomatique Appliquée à l’Agronomie',
      niveau: 'Argent · Practitioner',
      formeGeometrique: 'hexagone',
      accentColor: '#94a3b8',
      niveaux: ['Argent · Practitioner', 'Expert Terrain'],
      criteres: [
        'Relevé de 4 sommets minimum au GPS smartphone avec pause stabilisée (précision < 4m)',
        'Import CSV sous QGIS et projection métrique UTM zone 31N (EPSG:32631)',
        'Numérisation vectorielle du polygone et calcul de surface en hectares ($area / 10000)',
        'Export d’une carte d’essai normalisée 300 DPI avec flèche Nord, échelle graphique et fond satellite'
      ],
      dispositif: 'Évaluation sur livrable de terrain réel validée par le référent SIG selon les normes CAMES.',
      validateur: 'Ségla Bio KPEROU (Référent SIG · TEAM Sahélia)'
    },
    {
      id: 'SKL-DRONE-TERRAIN',
      code: 'drone',
      titre: 'Opérateur Drone & Télédétection Agricole',
      domaine: 'Drones & Agriculture de Précision',
      niveau: 'Or · Specialist',
      formeGeometrique: 'ecusson',
      accentColor: '#e8946a',
      niveaux: ['Or · Specialist', 'Opérateur Agréé'],
      criteres: [
        'Check-list pré-vol, calibration compas/IMU et conformité réglementaire ANAC Bénin',
        'Pilotage manuel Mode 2 avec atterrissage de précision sur cible',
        'Programmation de mission photogrammétrique automatisée (GSD < 2,5 cm/px)',
        'Génération d’orthomosaïque et calcul d’indices de végétation multispectrale NDVI'
      ],
      dispositif: 'Vol de contrôle en conditions réelles et traitement photogrammétrique complet.',
      validateur: 'Olivier AREMOU & Unité Drones TEAM Sahélia'
    },
    {
      id: 'SKL-VIBE-CLEANING',
      code: 'vibe',
      titre: 'Vibe Coding & Ingénieur Solutions IA',
      domaine: 'Génie Logiciel & Intelligence Artificielle Appliquée',
      niveau: 'Platine · Architect',
      formeGeometrique: 'octogone',
      accentColor: '#7fb0ee',
      niveaux: ['Platine · Architect', 'Maître d’Œuvre'],
      criteres: [
        'Prompt engineering avancé selon la méthode C.R.E.D. sans hallucination bibliographique',
        'Conception, sécurisation et déploiement d’un outil web ou script d’automatisation en production',
        'Résolution d’un cas d’usage concret de terrain au bénéfice de la communauté',
        'Revue de code, architecture logicielle propre et tests fonctionnels vérifiés'
      ],
      dispositif: 'Revue de code et audit de l’application déployée en direct.',
      validateur: 'Pôle Innovation TEAM Sahélia'
    }
  ];

    // ---------------------------------------------------------------------------
  // 5. ATTRIBUTIONS RÉELLES DE COMPÉTENCES & CERTIFICATIONS FONDATEURS
  // ---------------------------------------------------------------------------
  const ATTRIBUTIONS_INIT = [
    {
      id: 'TS-SKL-2026-001',
      membreId: 'TS-MBR-2026-001',
      beneficiaireNom: 'Olivier AREMOU',
      beneficiaireRole: 'Fondateur & Ingénieur Tech',
      competenceId: 'SKL-VIBE-CLEANING',
      titreCompetence: 'Vibe Coding & Ingénieur Solutions IA',
      niveau: 'Platine · Architect',
      dateAttribution: '15 Janvier 2026',
      validePar: 'Pôle Innovation TEAM Sahélia',
      statut: 'valide',
      preuveProjet: 'Architecture, développement et déploiement de la plateforme officielle TEAM Sahélia.',
      slogan: 'Apprendre aujourd’hui. Construire demain.'
    },
    {
      id: 'TS-SKL-2026-002',
      membreId: 'TS-MBR-2026-002',
      beneficiaireNom: 'Ségla Bio KPEROU',
      beneficiaireRole: 'Référent SIG & Données de Terrain',
      competenceId: 'SKL-SIG-PARCELLE',
      titreCompetence: 'Praticien SIG & Cartographie Parcellaire (QGIS & GPS)',
      niveau: 'Argent · Practitioner',
      dateAttribution: '20 Janvier 2026',
      validePar: 'Ségla Bio KPEROU (Référent SIG · TEAM Sahélia)',
      statut: 'valide',
      preuveProjet: 'Cartographie parcellaire UTM 31N et encadrement des protocoles GPS KoboToolbox.',
      slogan: 'Le terrain d’abord : la donnée géographique au service de la terre.'
    },
    {
      id: 'TS-SKL-2026-003',
      membreId: 'TS-MBR-2026-003',
      beneficiaireNom: 'Mariam DIALLO',
      beneficiaireRole: 'Chargée de Communauté & Partenariats',
      competenceId: 'SKL-MBR-PIONNIER',
      titreCompetence: 'Membre Pionnier · Communauté TEAM Sahélia',
      niveau: 'Bronze · Foundation',
      dateAttribution: '01 Février 2026',
      validePar: 'Olivier AREMOU (Coordinateur Général)',
      statut: 'valide',
      preuveProjet: 'Animation du réseau d’adhérents et organisation des cycles d’entraide.',
      slogan: 'L’entraide et le réseau font grandir les compétences.'
    },
    {
      id: 'TS-SKL-2026-004',
      membreId: 'TS-MBR-2026-004',
      beneficiaireNom: 'Amina CHABI',
      beneficiaireRole: 'Référente Pédagogique & Méthodologie',
      competenceId: 'SKL-MBR-PIONNIER',
      titreCompetence: 'Membre Pionnier · Communauté TEAM Sahélia',
      niveau: 'Bronze · Foundation',
      dateAttribution: '10 Février 2026',
      validePar: 'Olivier AREMOU (Coordinateur Général)',
      statut: 'valide',
      preuveProjet: 'Conception des fiches mémo et contrôle qualité des manuels méthodologiques.',
      slogan: 'Rigueur scientifique, clarté méthodologique et impact concret.'
    }
  ];

  // ---------------------------------------------------------------------------
  // 6. RÉFÉRENTIEL DES ACTIVITÉS & ANNONCES PUBLIQUES DU SITE (Vierge en production)
  // ---------------------------------------------------------------------------
  const ACTIVITES_INIT = [];
  const CONFIG_SITE_DEFAUT = {
    whatsappGroupe: 'https://chat.whatsapp.com/Gzp3bkauIIz8341VeMHOv7',
    whatsappNumero: '+229 40 73 84 69',
    emailOfficiel: 'teamsahelia@gmail.com',
    youtube: '',
    tiktok: '',
    instagram: '',
    linkedin: '',
    facebook: '',
    twitter: ''
  };

  const ANNONCES_INIT = [
    {
      id: 'ann-bienvenue-sahelia',
      titre: '🚀 Rejoignez la Communauté Officielle TEAM Sahélia !',
      message: 'Le groupe WhatsApp officiel de TEAM Sahélia est ouvert. Rejoignez nos agronomes, chercheurs et innovateurs au Bénin.',
      type: 'succes',
      lien: 'https://chat.whatsapp.com/Gzp3bkauIIz8341VeMHOv7',
      texteLien: 'Rejoindre le Groupe WhatsApp',
      date: new Date().toLocaleDateString('fr-FR'),
      actif: true
    }
  ];

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
    // ---------------------------------------------------------------------------
  // 1B. RÉFÉRENTIEL DES MEMBRES FONDATEURS RÉELS (Pour presets & trombinoscope)
  // ---------------------------------------------------------------------------
  const MEMBRES_FONDATEURS_REELS = [
    {
      id: 'TS-MBR-2026-001',
      matricule: 'TS-MBR-2026-001',
      nom: 'Olivier AREMOU',
      role: 'Fondateur & Coordinateur Général',
      institution: 'Communauté TEAM Sahélia · Bénin',
      sexe: 'M',
      dateAdhesion: '15 Janvier 2026',
      slogan: 'Apprendre aujourd’hui. Construire demain.',
      tags: ['Vibe Coding', 'Drones', 'Innovation Logicielle', 'Coordination'],
      statut: 'actif',
      email: 'teamsahelia@gmail.com',
      tel: '+229 40 73 84 69'
    },
    {
      id: 'TS-MBR-2026-002',
      matricule: 'TS-MBR-2026-002',
      nom: 'Ségla Bio KPEROU',
      role: 'Référent SIG & Cartographie de Terrain',
      institution: 'Communauté TEAM Sahélia · Bénin',
      sexe: 'M',
      dateAdhesion: '20 Janvier 2026',
      slogan: 'Le terrain d’abord : la donnée géographique au service de la terre.',
      tags: ['QGIS 3', 'GPS Smartphone', 'KoboToolbox', 'Agronomie'],
      statut: 'actif',
      email: 'teamsahelia@gmail.com',
      tel: '+229 40 73 84 69'
    },
    {
      id: 'TS-MBR-2026-003',
      matricule: 'TS-MBR-2026-003',
      nom: 'Mariam DIALLO',
      role: 'Chargée de Communauté & Partenariats',
      institution: 'Communauté TEAM Sahélia · Bénin',
      sexe: 'F',
      dateAdhesion: '01 Février 2026',
      slogan: 'L’entraide et le réseau font grandir les compétences.',
      tags: ['Animation Réseau', 'Partenariats', 'Coordination Terrain'],
      statut: 'actif',
      email: 'teamsahelia@gmail.com',
      tel: '+229 40 73 84 69'
    },
    {
      id: 'TS-MBR-2026-004',
      matricule: 'TS-MBR-2026-004',
      nom: 'Amina CHABI',
      role: 'Référente Pédagogique & Méthodologie',
      institution: 'Communauté TEAM Sahélia · Bénin',
      sexe: 'F',
      dateAdhesion: '10 Février 2026',
      slogan: 'Rigueur scientifique, clarté méthodologique et impact concret.',
      tags: ['Méthodologie', 'Rédaction Scientifique', 'Analyse RStudio'],
      statut: 'actif',
      email: 'teamsahelia@gmail.com',
      tel: '+229 40 73 84 69'
    }
  ];

  const DB = {
    membresFondateurs: MEMBRES_FONDATEURS_REELS,
    membres: chargerRegistre('membres_db', MEMBRES_INIT),
    formations: chargerRegistre('formations_db', FORMATIONS_INIT),
    cohortes: chargerRegistre('cohortes_db', COHORTES_INIT),
    competences: chargerRegistre('competences_db', COMPETENCES_INIT),
    attributions: chargerRegistre('attributions_db', ATTRIBUTIONS_INIT),
    activites: chargerRegistre('activites_db', ACTIVITES_INIT),
    annonces: chargerRegistre('annonces_db', ANNONCES_INIT),
    configSite: Object.assign({}, CONFIG_SITE_DEFAUT, chargerRegistre('config_site', CONFIG_SITE_DEFAUT)),

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
    sauvegarderConfigSite() {
      sauvegarderRegistre('config_site', this.configSite);
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
        validePar: data.validePar || 'Ségla Bio KPEROU (Référent SIG & Drones · TEAM Sahélia)',
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
      let mem = this.membres.find((m) => m && String(m.id || m.matricule || '').trim().toUpperCase() === cleanId);
      if (!mem && Array.isArray(this.membresFondateurs)) {
        mem = this.membresFondateurs.find((m) => m && String(m.id || m.matricule || '').trim().toUpperCase() === cleanId);
      }
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
