/**
 * TEAM Sahélia — Registre Officiel des Référentiels & Certifications W3C Open Badges 3.0
 * Architecture déclarative, données réelles, liaison avec les schémas /achievements/ et /credentials/.
 */

(function () {
  'use strict';

  const BASE_URL = 'https://aremouolivier-ops.github.io/site-team-sahelia';

  // ---------------------------------------------------------------------------
  // 1. RÉFÉRENTIEL DES 4 COMPÉTENCES CANONIQUES (ACHIEVEMENTS)
  // ---------------------------------------------------------------------------
  const REFERENTIEL_COMPETENCES = {
    'pionnier': {
      id: 'membre-pionnier',
      code: 'pionnier',
      titre: 'Membre Pionnier · Communauté TEAM Sahélia',
      domaine: 'Engagement Communautaire & Citoyenneté Numérique',
      niveau: 'Bronze · Foundation',
      formeGeometrique: 'pentagone',
      accentColor: '#cd7f32',
      metal0: '#e8946a',
      metal1: '#cd7f32',
      metal2: '#78350f',
      bgInner: '#091c15',
      criteres: [
        'Adhésion officielle et inscription validée au registre officiel TEAM Sahélia',
        'Participation active aux canaux collaboratifs et entraide communautaire WhatsApp',
        'Engagement formel envers la charte d’éthique et de partage libre des savoirs'
      ],
      dispositif: 'Validation par la coordination générale de TEAM Sahélia.',
      validateur: 'Olivier AREMOU (Coordinateur Général)'
    },
    'sig': {
      id: 'sig-parcelle',
      code: 'sig',
      titre: 'Praticien SIG & Cartographie Parcellaire (QGIS & GPS)',
      domaine: 'Géomatique Appliquée à l’Agronomie',
      niveau: 'Argent · Practitioner',
      formeGeometrique: 'hexagone',
      accentColor: '#94a3b8',
      metal0: '#f8fafc',
      metal1: '#cbd5e1',
      metal2: '#475569',
      bgInner: '#061713',
      criteres: [
        'Relevé de 4 sommets minimum au GPS smartphone avec pause stabilisée (précision < 4m)',
        'Import CSV sous QGIS et projection métrique UTM zone 31N (EPSG:32631)',
        'Numérisation vectorielle du polygone et calcul de surface en hectares ($area / 10000)',
        'Export d’une carte d’essai normalisée 300 DPI avec orientation Nord, échelle graphique et fond satellite'
      ],
      dispositif: 'Évaluation sur livrable de terrain réel validée par le référent SIG selon les normes scientifiques.',
      validateur: 'Ségla Bio KPEROU (Référent SIG · TEAM Sahélia)'
    },
    'drone': {
      id: 'drone-terrain',
      code: 'drone',
      titre: 'Opérateur Drone & Télédétection Agricole (Pratique Évaluée)',
      domaine: 'Drones & Agriculture de Précision',
      niveau: 'Or · Specialist',
      formeGeometrique: 'ecusson',
      accentColor: '#e8946a',
      metal0: '#fef08a',
      metal1: '#f59e0b',
      metal2: '#b45309',
      bgInner: '#081410',
      criteres: [
        'Check-list pré-vol, calibration compas/IMU et conformité réglementaire de sécurité aérienne',
        'Pilotage manuel Mode 2 avec atterrissage de précision sur cible',
        'Programmation de mission photogrammétrique automatisée (GSD < 2,5 cm/px)',
        'Génération d’orthomosaïque et calcul d’indices de végétation multispectrale NDVI'
      ],
      dispositif: 'Vol de contrôle en conditions réelles et traitement photogrammétrique complet.',
      validateur: 'Pôle Drones & Télédétection TEAM Sahélia'
    },
    'vibe': {
      id: 'vibe-coding-ia',
      code: 'vibe',
      titre: 'Vibe Coding & Ingénieur Solutions IA',
      domaine: 'Génie Logiciel & Intelligence Artificielle Appliquée',
      niveau: 'Platine · Architect',
      formeGeometrique: 'octogone',
      accentColor: '#7fb0ee',
      metal0: '#e0f2fe',
      metal1: '#38bdf8',
      metal2: '#0284c7',
      bgInner: '#051410',
      criteres: [
        'Prompt engineering avancé selon la méthode C.R.E.D. avec vérification stricte des sources',
        'Conception, sécurisation et déploiement d’un outil web ou script d’automatisation en production',
        'Résolution d’un cas d’usage concret de terrain au bénéfice de la communauté',
        'Revue de code, architecture logicielle propre et tests fonctionnels vérifiés'
      ],
      dispositif: 'Revue de code et audit de l’application déployée en production.',
      validateur: 'Pôle Innovation TEAM Sahélia'
    }
  };

  // ---------------------------------------------------------------------------
  // 2. REGISTRE STATIQUE DES ATTESTATIONS OFFICIELLES SIGNÉES
  // ---------------------------------------------------------------------------
  const ATTESTATIONS_OFFICIELLES = [
    {
      id: 'TS-SKL-2026-001',
      track: 'vibe',
      beneficiaireNom: 'Olivier AREMOU',
      beneficiaireRole: 'Fondateur & Ingénieur Solutions Tech',
      institution: 'TEAM Sahélia · République du Bénin',
      dateEmission: '15 Janvier 2026',
      validFrom: '2026-01-15T00:00:00Z',
      validePar: 'Pôle Innovation TEAM Sahélia',
      preuveProjet: 'Architecture, développement et déploiement de la plateforme officielle TEAM Sahélia.',
      slogan: 'Apprendre aujourd’hui. Construire demain.',
      statut: 'valide'
    },
    {
      id: 'TS-SKL-2026-002',
      track: 'sig',
      beneficiaireNom: 'Ségla Bio KPEROU',
      beneficiaireRole: 'Référent SIG & Données de Terrain',
      institution: 'TEAM Sahélia · République du Bénin',
      dateEmission: '20 Janvier 2026',
      validFrom: '2026-01-20T00:00:00Z',
      validePar: 'Conseil Pédagogique TEAM Sahélia',
      preuveProjet: 'Cartographie parcellaire UTM zone 31N et encadrement des protocoles GPS KoboToolbox.',
      slogan: 'Le terrain d’abord : la donnée géographique au service de la terre.',
      statut: 'valide'
    },
    {
      id: 'TS-SKL-2026-003',
      track: 'pionnier',
      beneficiaireNom: 'Mariam DIALLO',
      beneficiaireRole: 'Chargée de Communauté & Partenariats',
      institution: 'TEAM Sahélia · République du Bénin',
      dateEmission: '01 Février 2026',
      validFrom: '2026-02-01T00:00:00Z',
      validePar: 'Olivier AREMOU (Coordinateur Général)',
      preuveProjet: 'Animation du réseau d’adhérents et organisation des cycles d’entraide.',
      slogan: 'L’entraide et le réseau font grandir les compétences.',
      statut: 'valide'
    },
    {
      id: 'TS-SKL-2026-004',
      track: 'pionnier',
      beneficiaireNom: 'Amina CHABI',
      beneficiaireRole: 'Référente Pédagogique & Méthodologie',
      institution: 'TEAM Sahélia · République du Bénin',
      dateEmission: '10 Février 2026',
      validFrom: '2026-02-10T00:00:00Z',
      validePar: 'Olivier AREMOU (Coordinateur Général)',
      preuveProjet: 'Conception des fiches mémo et contrôle qualité des manuels méthodologiques.',
      slogan: 'Rigueur scientifique, clarté méthodologique et impact concret.',
      statut: 'valide'
    }
  ];

  // ---------------------------------------------------------------------------
  // 3. MEMBRES FONDATEURS OFFICIELS
  // ---------------------------------------------------------------------------
  const MEMBRES_FONDATEURS = [
    {
      id: 'TS-MBR-2026-001',
      nom: 'Olivier AREMOU',
      role: 'Fondateur & Coordinateur Général',
      institution: 'TEAM Sahélia · République du Bénin',
      dateAdhesion: '15 Janvier 2026',
      slogan: 'Apprendre aujourd’hui. Construire demain.',
      tags: ['Vibe Coding', 'Drones', 'Innovation Logicielle', 'Coordination'],
      email: 'teamsahelia@gmail.com',
      tel: '+229 40 73 84 69'
    },
    {
      id: 'TS-MBR-2026-002',
      nom: 'Ségla Bio KPEROU',
      role: 'Référent SIG & Cartographie de Terrain',
      institution: 'TEAM Sahélia · République du Bénin',
      dateAdhesion: '20 Janvier 2026',
      slogan: 'Le terrain d’abord : la donnée géographique au service de la terre.',
      tags: ['QGIS 3', 'GPS Smartphone', 'KoboToolbox', 'Agronomie'],
      email: 'teamsahelia@gmail.com',
      tel: '+229 40 73 84 69'
    },
    {
      id: 'TS-MBR-2026-003',
      nom: 'Mariam DIALLO',
      role: 'Chargée de Communauté & Partenariats',
      institution: 'TEAM Sahélia · République du Bénin',
      dateAdhesion: '01 Février 2026',
      slogan: 'L’entraide et le réseau font grandir les compétences.',
      tags: ['Animation Réseau', 'Partenariats', 'Coordination Terrain'],
      email: 'teamsahelia@gmail.com',
      tel: '+229 40 73 84 69'
    },
    {
      id: 'TS-MBR-2026-004',
      nom: 'Amina CHABI',
      role: 'Référente Pédagogique & Méthodologie',
      institution: 'TEAM Sahélia · République du Bénin',
      dateAdhesion: '10 Février 2026',
      slogan: 'Rigueur scientifique, clarté méthodologique et impact concret.',
      tags: ['Méthodologie', 'Rédaction Scientifique', 'Analyse RStudio'],
      email: 'teamsahelia@gmail.com',
      tel: '+229 40 73 84 69'
    }
  ];

  // ---------------------------------------------------------------------------
  // 4. CONFIGURATION DU SITE & CANAUX COMMUNAUTAIRES
  // ---------------------------------------------------------------------------
  const CONFIG_SITE = {
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

  // ---------------------------------------------------------------------------
  // 4.BIS. CATALOGUE DES FORMATIONS & COHORTES OFFICIELLES
  // ---------------------------------------------------------------------------
  const FORMATIONS = [
    {
      id: 'mn-01',
      titre: 'Bureautique Avancée & Analyse de Données (Excel & Word)',
      pole: 'Bureautique & Données',
      formateur: 'Olivier AREMOU',
      accentColor: '#2563eb'
    },
    {
      id: 'mn-04',
      titre: 'Cartographie Parcellaire & SIG de Terrain (QGIS & GPS)',
      pole: 'Agronomie & SIG',
      formateur: 'Ségla Bio KPEROU',
      accentColor: '#16a34a'
    },
    {
      id: 'mn-11',
      titre: 'Pilotage de Drone & Télédétection Agricole',
      pole: 'Drones & Télédétection',
      formateur: 'Mariam DIALLO',
      accentColor: '#e8946a'
    },
    {
      id: 'mn-08',
      titre: 'Vibe Coding & Ingénierie de Solutions IA',
      pole: 'Innovation & IA',
      formateur: 'Amina CHABI',
      accentColor: '#7fb0ee'
    }
  ];

  const COHORTES = [
    {
      id: 'cohorte-pilote-2026',
      formationId: 'mn-04',
      nom: 'Cohorte Pilote SIG & Données de Terrain',
      periode: 'Janvier — Février 2026',
      lieu: 'Terrain & En ligne',
      formateurPrincipal: 'Ségla Bio KPEROU',
      participants: [
        {
          id: 'TS-FOR-2026-P01',
          nom: 'Olivier AREMOU',
          role: 'Membre Fondateur',
          sexe: 'M',
          statut: 'termine',
          mention: 'Excellence Technique',
          slogan: 'L’agronomie de demain s’appuie sur des données fiables.'
        },
        {
          id: 'TS-FOR-2026-P02',
          nom: 'Ségla Bio KPEROU',
          role: 'Formateur & Référent SIG',
          sexe: 'M',
          statut: 'termine',
          mention: 'Maîtrise Professionnelle',
          slogan: 'La donnée géographique au service de la terre.'
        },
        {
          id: 'TS-FOR-2026-P03',
          nom: 'Mariam DIALLO',
          role: 'Auditrice & Terrain',
          sexe: 'F',
          statut: 'en_cours',
          mention: 'Pratique Validée',
          slogan: 'L’entraide et le réseau font grandir les compétences.'
        },
        {
          id: 'TS-FOR-2026-P04',
          nom: 'Amina CHABI',
          role: 'Méthodologie & Qualité',
          sexe: 'F',
          statut: 'termine',
          mention: 'Distinction Pédagogique',
          slogan: 'Rigueur scientifique et impact concret.'
        }
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // 5. API PUBLIQUE SAHELIADB (CONSULTATION & VÉRIFICATION)
  // ---------------------------------------------------------------------------
  const DB = {
    referentiel: REFERENTIEL_COMPETENCES,
    membres: MEMBRES_FONDATEURS,
    membresFondateurs: MEMBRES_FONDATEURS,
    attestations: ATTESTATIONS_OFFICIELLES,
    attributions: ATTESTATIONS_OFFICIELLES.map(a => ({
      id: a.id,
      competenceId: a.track === 'sig' ? 'SKL-SIG-PARCELLE' : (a.track === 'drone' ? 'SKL-DRONE-TERRAIN' : (a.track === 'vibe' ? 'SKL-VIBE-CLEANING' : 'SKL-PIONNIER')),
      titreCompetence: (REFERENTIEL_COMPETENCES[a.track] || {}).titre || 'Compétence TEAM Sahélia',
      niveau: (REFERENTIEL_COMPETENCES[a.track] || {}).niveau || 'Pratique Validée',
      beneficiaireNom: a.beneficiaireNom,
      beneficiaireRole: a.beneficiaireRole,
      institution: a.institution,
      validePar: a.validePar,
      dateAttribution: a.dateEmission,
      dateEmission: a.dateEmission,
      slogan: a.slogan,
      sexe: (a.beneficiaireNom === 'Mariam DIALLO' || a.beneficiaireNom === 'Amina CHABI') ? 'F' : 'M',
      statut: a.statut
    })),
    competences: Object.values(REFERENTIEL_COMPETENCES).map(c => ({
      id: c.code === 'sig' ? 'SKL-SIG-PARCELLE' : (c.code === 'drone' ? 'SKL-DRONE-TERRAIN' : (c.code === 'vibe' ? 'SKL-VIBE-CLEANING' : 'SKL-PIONNIER')),
      track: c.code,
      titre: c.titre,
      domaine: c.domaine,
      niveau: c.niveau,
      criteres: c.criteres,
      validateur: c.validateur,
      accentColor: c.accentColor
    })),
    formations: FORMATIONS,
    cohortes: COHORTES,
    configSite: CONFIG_SITE,

    sauvegarderMembres(liste) {
      if (Array.isArray(liste)) {
        DB.membres = liste;
      }
    },

    obtenirCompetenceParCode(code) {
      if (!code) return null;
      const codePropre = String(code).trim().toLowerCase();
      return REFERENTIEL_COMPETENCES[codePropre] || null;
    },

    trouverBadgeParId(badgeId) {
      if (!badgeId) return null;
      const cleanId = String(badgeId).trim().toUpperCase();

      // 1. Recherche dans les attestations de compétences
      const att = ATTESTATIONS_OFFICIELLES.find(a => a.id.toUpperCase() === cleanId);
      if (att) {
        const comp = REFERENTIEL_COMPETENCES[att.track] || {};
        return {
          id: att.id,
          type: 'competence',
          track: att.track,
          titre: comp.titre || 'Compétence Validée',
          domaine: comp.domaine || 'Agronomie & Numérique',
          niveau: comp.niveau || 'Pratique Validée',
          formeGeometrique: comp.formeGeometrique || 'hexagone',
          accentColor: comp.accentColor || '#94a3b8',
          metal0: comp.metal0 || '#f8fafc',
          metal1: comp.metal1 || '#cbd5e1',
          metal2: comp.metal2 || '#475569',
          bgInner: comp.bgInner || '#061713',
          beneficiaireNom: att.beneficiaireNom,
          beneficiaireRole: att.beneficiaireRole,
          institution: att.institution,
          slogan: att.slogan,
          dateEmission: att.dateEmission,
          validFrom: att.validFrom,
          validePar: att.validePar,
          preuveProjet: att.preuveProjet,
          criteres: comp.criteres || [],
          statut: att.statut || 'valide'
        };
      }

      // 2. Recherche dans les membres (derniers enregistrés en priorité pour permettre la mise à jour)
      const listeMembres = (DB.membres && DB.membres.length) ? DB.membres.slice().reverse() : MEMBRES_FONDATEURS;
      const mem = listeMembres.find(m => (m.id && m.id.toUpperCase() === cleanId) || (m.matricule && m.matricule.toUpperCase() === cleanId));
      if (mem) {
        const comp = REFERENTIEL_COMPETENCES['pionnier'] || {};
        return {
          id: mem.id || mem.matricule,
          type: 'membre',
          track: 'pionnier',
          titre: 'Membre Officiel de la Communauté',
          domaine: 'Engagement Communautaire',
          niveau: 'Bronze · Foundation',
          formeGeometrique: 'pentagone',
          accentColor: '#cd7f32',
          metal0: '#e8946a',
          metal1: '#cd7f32',
          metal2: '#78350f',
          bgInner: '#091c15',
          beneficiaireNom: mem.nom || mem.beneficiaireNom,
          beneficiaireRole: mem.role || mem.beneficiaireRole,
          institution: mem.institution || 'Communauté TEAM Sahélia',
          slogan: mem.slogan || 'Apprendre aujourd’hui. Construire demain.',
          dateEmission: mem.dateAdhesion || '15 Janvier 2026',
          validFrom: '2026-01-15T00:00:00Z',
          validePar: 'Olivier AREMOU (Coordinateur Général)',
          preuveProjet: 'Adhésion et engagement actif dans la communauté.',
          criteres: comp.criteres || [],
          statut: mem.statut || 'valide'
        };
      }

      // 3. Recherche dans les participants des cohortes
      for (const coh of COHORTES) {
        const p = (coh.participants || []).find(part => part.id && part.id.toUpperCase() === cleanId);
        if (p) {
          const form = FORMATIONS.find(f => f.id === coh.formationId) || {};
          return {
            id: p.id,
            type: 'formation',
            titre: form.titre || 'Formation TEAM Sahélia',
            cohorteNom: coh.nom,
            periode: coh.periode,
            lieu: coh.lieu,
            formateur: coh.formateurPrincipal || form.formateur,
            beneficiaireNom: p.nom,
            beneficiaireRole: p.role,
            statut: p.statut || 'valide',
            mention: p.mention,
            slogan: p.slogan,
            accentColor: form.accentColor || '#2563eb'
          };
        }
      }

      return null;
    }
  };

  window.SaheliaDB = DB;
})();
