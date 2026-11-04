/**
 * TEAM Sahélia — Registre Officiel des Référentiels & Certifications W3C Open Badges 3.0
 * Architecture matricielle en 5 Familles de Reconnaissance & 4 Niveaux de Maîtrise
 * Conformité : W3C Verifiable Credentials Data Model v2.0 & 1EdTech Open Badges v3.0
 */

(function () {
  'use strict';

  const BASE_URL = 'https://aremouolivier-ops.github.io/site-team-sahelia';

  // ---------------------------------------------------------------------------
  // 1. LES 5 FAMILLES DE RECONNAISSANCE COMMUNAUTAIRE
  // ---------------------------------------------------------------------------
  const FAMILLES_BADGES = {
    appartenance: {
      id: 'appartenance',
      nom: 'Appartenance Communautaire',
      description: 'Reconnaissance de l’engagement, de l’adhésion et de la contribution citoyenne à TEAM Sahélia.',
      couleur: '#22c55e',
      prefixe: 'TS-MBR',
      categories: ['Membre Officiel', 'Membre Fondateur', 'Membre Pionnier', 'Membre Actif', 'Contributeur Communautaire']
    },
    formation: {
      id: 'formation',
      nom: 'Apprentissage & Formations',
      description: 'Validation de l’achèvement rigoureux d’un parcours de formation pratique et de ses travaux dirigés.',
      couleur: '#3b82f6',
      prefixe: 'TS-FOR',
      categories: ['Participant de Cohorte', 'Parcours Achevé', 'Mention d’Excellence', 'Projet Capstone Validé']
    },
    competence: {
      id: 'competence',
      nom: 'Compétences Techniques Certifiées',
      description: 'Homologation d’un savoir-faire professionnel évalué sur livrable de terrain réel par un pair référent.',
      couleur: '#eab308',
      prefixe: 'TS-SKL',
      categories: ['Géomatique & SIG', 'Données & Statistiques', 'Collecte Mobile', 'Drones & Précision', 'Solutions IA & Code']
    },
    projet: {
      id: 'projet',
      nom: 'Innovation & Projets Déployés',
      description: 'Valorisation des solutions numériques, des études de terrain et des outils déployés pour l’impact agricole.',
      couleur: '#a855f7',
      prefixe: 'TS-PRJ',
      categories: ['Créateur de Solution', 'Projet Pilote Déployé', 'Contributeur Technique']
    },
    leadership: {
      id: 'leadership',
      nom: 'Leadership & Mentorat',
      description: 'Distinction des membres qui encadrent les cohortes, transmettent leurs savoirs et animent la communauté.',
      couleur: '#f97316',
      prefixe: 'TS-LDR',
      categories: ['Mentor Certifié', 'Formateur Référent', 'Animateur de Pôle', 'Ambassadeur Panafricain']
    }
  };

  // ---------------------------------------------------------------------------
  // 2. LES 4 NIVEAUX DE MAÎTRISE PÉDAGOGIQUE (ORTHOGONAUX AUX DOMAINES)
  // ---------------------------------------------------------------------------
  const NIVEAUX_MAITRISE = {
    initiation: {
      id: 'initiation',
      code: 'N1',
      label: 'Initiation & Fondamentaux',
      description: 'Compréhension des concepts fondamentaux et manipulation guidée des outils.'
    },
    pratique: {
      id: 'pratique',
      code: 'N2',
      label: 'Pratique de Terrain Validée',
      description: 'Réalisation autonome d’un protocole professionnel avec livrable vérifié sans assistance.'
    },
    avance: {
      id: 'avance',
      code: 'N3',
      label: 'Maîtrise Avancée & Autonomie',
      description: 'Résolution de problèmes complexes, optimisation de méthodes et contrôle qualité rigoureux.'
    },
    referent: {
      id: 'referent',
      code: 'N4',
      label: 'Expertise & Référent Pédagogique',
      description: 'Capacité démontrée à encadrer les apprenants, concevoir des protocoles et auditer les certifications.'
    }
  };

  // ---------------------------------------------------------------------------
  // 3. RÉFÉRENTIEL DES DOMAINES DE COMPÉTENCES TECHNIQUES (CANONIQUES)
  // ---------------------------------------------------------------------------
  const REFERENTIEL_COMPETENCES = {
    'pionnier': {
      id: 'membre-pionnier',
      code: 'pionnier',
      famille: 'appartenance',
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
      famille: 'competence',
      titre: 'Praticien SIG & Cartographie QGIS',
      domaine: 'Géomatique Appliquée à l’Agronomie',
      niveau: 'Pratique Validée',
      formeGeometrique: 'hexagone',
      accentColor: '#94a3b8',
      metal0: '#f8fafc',
      metal1: '#cbd5e1',
      metal2: '#475569',
      bgInner: '#061713',
      criteres: [
        'Relevé de sommets au GPS smartphone avec pause stabilisée (précision < 4m)',
        'Import CSV sous QGIS et projection métrique UTM zone 31N (EPSG:32631)',
        'Numérisation vectorielle du polygone parcellaire et calcul de surface en hectares',
        'Export d’une carte d’essai normalisée 300 DPI avec orientation Nord, échelle et fond satellite'
      ],
      dispositif: 'Évaluation sur livrable cartographique de terrain réel validée par le référent SIG.',
      validateur: 'Ségla Bio KPEROU (Référent SIG · TEAM Sahélia)'
    },
    'data': {
      id: 'data-agronomie',
      code: 'data',
      famille: 'competence',
      titre: 'Analyste de Données Agronomiques (Excel & R)',
      domaine: 'Statistiques & Analyse de Données Agricoles',
      niveau: 'Pratique Validée',
      formeGeometrique: 'hexagone',
      accentColor: '#38bdf8',
      metal0: '#e0f2fe',
      metal1: '#38bdf8',
      metal2: '#0284c7',
      bgInner: '#05141b',
      criteres: [
        'Nettoyage et structuration d’un dataset agronomique brut selon les normes scientifiques',
        'Calcul de statistiques descriptives, tableaux croisés dynamiques (TCD) et formules matricielles',
        'Modélisation de variance (ANOVA) et corrélation de rendements sous RStudio / Excel',
        'Conception de graphiques scientifiques prêts pour publication académique et jury de soutenance'
      ],
      dispositif: 'Audit d’un script d’analyse et rapport statistique conforme aux normes de jury.',
      validateur: 'Amina CHABI (Référente Méthodologie & Data)'
    },
    'kobo': {
      id: 'kobo-collecte',
      code: 'kobo',
      famille: 'competence',
      titre: 'Collecte Mobile & Numérisation Terrain (KoboToolbox)',
      domaine: 'Ingénierie des Enquêtes de Terrain',
      niveau: 'Pratique Validée',
      formeGeometrique: 'pentagone',
      accentColor: '#10b981',
      metal0: '#a7f3d0',
      metal1: '#10b981',
      metal2: '#047857',
      bgInner: '#051811',
      criteres: [
        'Conception d’un formulaire XLSForm structuré avec sauts logiques conditionnels et validation regex',
        'Configuration des géopoints obligatoires, saisie hors-ligne et synchronisation KoboCollect',
        'Déploiement sur flotte de smartphones enquêteurs et supervision qualité des soumissions en direct',
        'Exportation propre vers tableur pour croisement cartographique et statistique'
      ],
      dispositif: 'Déploiement effectif d’une campagne d’enquête terrain sans doublon ni perte de donnée.',
      validateur: 'Mariam DIALLO (Chargée Suivi-Évaluation & Terrain)'
    },
    'drone': {
      id: 'drone-terrain',
      code: 'drone',
      famille: 'competence',
      titre: 'Opérateur Drone & Télédétection Agricole',
      domaine: 'Drones & Agriculture de Précision',
      niveau: 'Pratique Validée',
      formeGeometrique: 'ecusson',
      accentColor: '#f59e0b',
      metal0: '#fef08a',
      metal1: '#f59e0b',
      metal2: '#b45309',
      bgInner: '#140f06',
      criteres: [
        'Check-list pré-vol, calibration compas/IMU et conformité réglementaire de sécurité aérienne',
        'Pilotage manuel Mode 2 avec atterrissage de précision sur cible délimitée',
        'Programmation de mission photogrammétrique automatisée (recouvrement > 75%, GSD < 2,5 cm/px)',
        'Génération d’orthomosaïque et calcul d’indices de végétation multispectrale NDVI'
      ],
      dispositif: 'Vol de contrôle en conditions réelles et traitement photogrammétrique complet.',
      validateur: 'Pôle Drones & Télédétection TEAM Sahélia'
    },
    'vibe': {
      id: 'vibe-coding-ia',
      code: 'vibe',
      famille: 'competence',
      titre: 'Vibe Coding & Ingénieur Solutions IA',
      domaine: 'Génie Logiciel & Intelligence Artificielle Appliquée',
      niveau: 'Maîtrise Avancée',
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
    },
    'agro': {
      id: 'agro-precision',
      code: 'agro',
      famille: 'competence',
      titre: 'Agronomie Numérique & Précision Parcellaire',
      domaine: 'Agronomie Appliquée & Expérimentation',
      niveau: 'Pratique Validée',
      formeGeometrique: 'pentagone',
      accentColor: '#4ade80',
      metal0: '#bbf7d0',
      metal1: '#4ade80',
      metal2: '#15803d',
      bgInner: '#06170d',
      criteres: [
        'Conception d’un dispositif expérimental en blocs complets randomisés (Fisher)',
        'Suivi agrométéorologique et spatialisation des besoins hydriques ou fertilisants',
        'Croisement des cartes NDVI avec les rendements mesurés sur parcelles de contrôle',
        'Rédaction d’un protocole de recommandations techniques agronomiques pour les producteurs'
      ],
      dispositif: 'Évaluation d’un protocole expérimental complet validé par les agronomes référents.',
      validateur: 'Ségla Bio KPEROU (Agronome Référent)'
    },
    'projet': {
      id: 'projet-solution',
      code: 'projet',
      famille: 'projet',
      titre: 'Créateur de Solution Numérique de Terrain',
      domaine: 'Innovation & Développement de Projets',
      niveau: 'Maîtrise Avancée',
      formeGeometrique: 'octogone',
      accentColor: '#c084fc',
      metal0: '#f3e8ff',
      metal1: '#c084fc',
      metal2: '#7e22ce',
      bgInner: '#14071f',
      criteres: [
        'Identification d’un problème réel non résolu au sein d’une exploitation ou filière agricole',
        'Développement autonome d’une solution technique fonctionnelle (logiciel, cartographie, base de données)',
        'Déploiement sur le terrain et tests avec de vrais utilisateurs agricoles ou étudiants',
        'Mesure d’impact, documentation complète et partage libre avec la communauté'
      ],
      dispositif: 'Soutenance de projet devant le comité d’innovation communautaire.',
      validateur: 'Pôle Projets & Innovation TEAM Sahélia'
    },
    'mentor': {
      id: 'mentor-leadership',
      code: 'mentor',
      famille: 'leadership',
      titre: 'Mentor & Formateur Communautaire',
      domaine: 'Transmission & Leadership Pédagogique',
      niveau: 'Expertise & Référent',
      formeGeometrique: 'ecusson',
      accentColor: '#fb923c',
      metal0: '#fed7aa',
      metal1: '#fb923c',
      metal2: '#c2410c',
      bgInner: '#170c04',
      criteres: [
        'Encadrement actif d’au moins une cohorte de formation avec suivi personnalisé des apprenants',
        'Animation d’ateliers pratiques de résolution de bugs et sessions d’entraide technique',
        'Production de supports pédagogiques libres (tutoriels, fiches mémos, guides méthodologiques)',
        'Évaluation impartiale des livrables selon les grilles de certification officielles'
      ],
      dispositif: 'Reconnaissance par les pairs et plébiscite des apprenants encadrés.',
      validateur: 'Coordination Générale TEAM Sahélia'
    }
  };

  // ---------------------------------------------------------------------------
  // 4. CATALOGUE PILOTE DES 12 BADGES STRATÉGIQUES DE LA COMMUNAUTÉ
  // ---------------------------------------------------------------------------
  const CATALOGUE_12_PILOTES = [
    {
      num: 1,
      id: 'TS-MBR-OFFICIEL',
      famille: 'appartenance',
      titre: 'Membre Officiel TEAM Sahélia',
      domaine: 'Citoyenneté Numérique & Réseau',
      niveau: 'Adhésion Validée',
      track: 'pionnier',
      forme: 'pentagone',
      icone: 'agronomie',
      couleur: '#22c55e',
      description: 'Atteste de l’adhésion formelle et de l’appartenance active au réseau panafricain TEAM Sahélia.'
    },
    {
      num: 2,
      id: 'TS-MBR-PIONNIER',
      famille: 'appartenance',
      titre: 'Membre Pionnier Fondateur',
      domaine: 'Engagement Historique',
      niveau: 'Distinction Fondatrice',
      track: 'pionnier',
      forme: 'pentagone',
      icone: 'agronomie',
      couleur: '#cd7f32',
      description: 'Distingue les acteurs clés ayant initié et bâti les fondations de la communauté.'
    },
    {
      num: 3,
      id: 'TS-MBR-ACTIF',
      famille: 'appartenance',
      titre: 'Membre Contributeur Actif',
      domaine: 'Entraide & Dynamique Communautaire',
      niveau: 'Engagement Remarquable',
      track: 'pionnier',
      forme: 'pentagone',
      icone: 'agronomie',
      couleur: '#10b981',
      description: 'Reconnaît les membres qui animent l’entraide quotidienne et partagent leurs connaissances.'
    },
    {
      num: 4,
      id: 'TS-FOR-ACHEVE',
      famille: 'formation',
      titre: 'Parcours de Formation Achevé',
      domaine: 'Formation Continue Pratique',
      niveau: 'Complétion Validée',
      track: 'pionnier',
      forme: 'hexagone',
      icone: 'formation',
      couleur: '#3b82f6',
      description: 'Certifie que le titulaire a suivi 100% des modules et validé les travaux pratiques d’une formation.'
    },
    {
      num: 5,
      id: 'TS-SKL-SIG',
      famille: 'competence',
      titre: 'Praticien SIG & Cartographie QGIS',
      domaine: 'Géomatique & Cadastre Agricole',
      niveau: 'Pratique Validée',
      track: 'sig',
      forme: 'hexagone',
      icone: 'sig',
      couleur: '#94a3b8',
      description: 'Maîtrise du relevé GPS terrain, de la numérisation vectorielle et de la cartographie parcellaire UTM.'
    },
    {
      num: 6,
      id: 'TS-SKL-DATA',
      famille: 'competence',
      titre: 'Analyste de Données Agronomiques',
      domaine: 'Statistiques & Modélisation',
      niveau: 'Pratique Validée',
      track: 'data',
      forme: 'hexagone',
      icone: 'data',
      couleur: '#38bdf8',
      description: 'Nettoyage de bases de données de recherche, analyses statistiques et graphiques scientifiques de jury.'
    },
    {
      num: 7,
      id: 'TS-SKL-KOBO',
      famille: 'competence',
      titre: 'Collecte Mobile & Numérisation Terrain',
      domaine: 'KoboToolbox & Protocoles Mobiles',
      niveau: 'Pratique Validée',
      track: 'kobo',
      forme: 'pentagone',
      icone: 'kobo',
      couleur: '#10b981',
      description: 'Création de formulaires XLSForm avancés, géolocalisation et déploiement d’enquêtes hors-ligne.'
    },
    {
      num: 8,
      id: 'TS-SKL-AGRO',
      famille: 'competence',
      titre: 'Agronomie Numérique & Précision',
      domaine: 'Agronomie & Expérimentation',
      niveau: 'Pratique Validée',
      track: 'agro',
      forme: 'pentagone',
      icone: 'agronomie',
      couleur: '#4ade80',
      description: 'Mise en place d’essais agronomiques comparatifs, croisement de cartes NDVI et bilans de rendements.'
    },
    {
      num: 9,
      id: 'TS-SKL-VIBE',
      famille: 'competence',
      titre: 'IA Appliquée & Vibe Coding',
      domaine: 'Génie Logiciel & IA Assistée',
      niveau: 'Maîtrise Avancée',
      track: 'vibe',
      forme: 'octogone',
      icone: 'ia',
      couleur: '#7fb0ee',
      description: 'Conception rapide et déploiement d’applications web et d’outils d’automatisation via IA et code propre.'
    },
    {
      num: 10,
      id: 'TS-SKL-DRONE',
      famille: 'competence',
      titre: 'Opérateur Drone & Télédétection',
      domaine: 'Aviation Sans Pilote & Photogrammétrie',
      niveau: 'Pratique Validée',
      track: 'drone',
      forme: 'ecusson',
      icone: 'drone',
      couleur: '#f59e0b',
      description: 'Pilotage de drone en conditions de sécurité, plans de vol automatisés et calcul d’indices de vigueur NDVI.'
    },
    {
      num: 11,
      id: 'TS-PRJ-CREATEUR',
      famille: 'projet',
      titre: 'Créateur de Solution Numérique',
      domaine: 'Innovation de Terrain',
      niveau: 'Maîtrise Avancée',
      track: 'projet',
      forme: 'octogone',
      icone: 'projet',
      couleur: '#c084fc',
      description: 'Développement et mise en production d’une solution concrète résolvant un goulet d’étranglement agricole.'
    },
    {
      num: 12,
      id: 'TS-LDR-MENTOR',
      famille: 'leadership',
      titre: 'Mentor & Formateur Communautaire',
      domaine: 'Transmission & Pédagogie Active',
      niveau: 'Expertise & Référent',
      track: 'mentor',
      forme: 'ecusson',
      icone: 'mentor',
      couleur: '#fb923c',
      description: 'Encadrement régulier d’apprenants, animation technique d’ateliers et validation des acquis par les pairs.'
    }
  ];

  // ---------------------------------------------------------------------------
  // 5. REGISTRE DES ATTESTATIONS OFFICIELLES PUBLIÉES & SIGNÉES
  // ---------------------------------------------------------------------------
  const ATTESTATIONS_OFFICIELLES = [
    {
      id: 'TS-SKL-2026-001',
      track: 'vibe',
      famille: 'competence',
      beneficiaireNom: 'Olivier AREMOU',
      beneficiaireRole: 'Fondateur & Ingénieur Solutions Tech',
      institution: 'TEAM Sahélia · République du Bénin',
      dateEmission: '15 Janvier 2026',
      validFrom: '2026-01-15T00:00:00Z',
      validePar: 'Pôle Innovation TEAM Sahélia',
      preuveProjet: 'Architecture, développement et déploiement de la plateforme officielle TEAM Sahélia (manuels, studio, lecteur immersif).',
      slogan: 'Apprendre aujourd’hui. Construire demain.',
      statut: 'valide'
    },
    {
      id: 'TS-SKL-2026-002',
      track: 'sig',
      famille: 'competence',
      beneficiaireNom: 'Ségla Bio KPEROU',
      beneficiaireRole: 'Référent SIG & Données de Terrain',
      institution: 'TEAM Sahélia · République du Bénin',
      dateEmission: '20 Janvier 2026',
      validFrom: '2026-01-20T00:00:00Z',
      validePar: 'Pôle Géomatique & Formation Continue',
      preuveProjet: 'Cartographie parcellaire UTM zone 31N et encadrement des protocoles GPS KoboToolbox.',
      slogan: 'Le terrain d’abord : la donnée géographique au service de la terre.',
      statut: 'valide'
    },
    {
      id: 'TS-SKL-2026-003',
      track: 'kobo',
      famille: 'competence',
      beneficiaireNom: 'Mariam DIALLO',
      beneficiaireRole: 'Chargée de Suivi-Évaluation & Enquêtes',
      institution: 'TEAM Sahélia · République du Bénin',
      dateEmission: '01 Février 2026',
      validFrom: '2026-02-01T00:00:00Z',
      validePar: 'Pôle Agronomie & Projets de Terrain',
      preuveProjet: 'Conception de formulaires XLSForm complexes et déploiement de campagnes d’enquêtes terrain sur mobile.',
      slogan: 'L’entraide et la rigueur de la donnée font grandir nos terroirs.',
      statut: 'valide'
    },
    {
      id: 'TS-SKL-2026-004',
      track: 'drone',
      famille: 'competence',
      beneficiaireNom: 'Amina CHABI',
      beneficiaireRole: 'Opératrice Drone & Télédétection Agricole',
      institution: 'TEAM Sahélia · République du Bénin',
      dateEmission: '10 Février 2026',
      validFrom: '2026-02-10T00:00:00Z',
      validePar: 'Pôle Drones & Télédétection TEAM Sahélia',
      preuveProjet: 'Missions de vol automatisées et génération d’orthomosaïques haute résolution avec calcul d’indices NDVI.',
      slogan: 'Rigueur scientifique, clarté méthodologique et impact concret.',
      statut: 'valide'
    }
  ];

  // ---------------------------------------------------------------------------
  // 6. MEMBRES OFFICIELS & FONDATEURS RÉELS
  // ---------------------------------------------------------------------------
  const MEMBRES_FONDATEURS = [
    {
      id: 'TS-MBR-2026-001',
      matricule: 'TS-MBR-2026-001',
      nom: 'Olivier AREMOU',
      role: 'Fondateur & Coordinateur Général',
      categorie: 'Fondateur',
      statutAppartenance: 'Membre Fondateur',
      institution: 'TEAM Sahélia · République du Bénin',
      dateAdhesion: '15 Janvier 2026',
      slogan: 'Apprendre aujourd’hui. Construire demain.',
      tags: ['Vibe Coding', 'Drones', 'Innovation Logicielle', 'Coordination'],
      email: 'teamsahelia@gmail.com',
      telephone: '+229 40 73 84 69',
      statut: 'actif'
    },
    {
      id: 'TS-MBR-2026-002',
      matricule: 'TS-MBR-2026-002',
      nom: 'Ségla Bio KPEROU',
      role: 'Référent SIG & Cartographie de Terrain',
      categorie: 'Fondateur',
      statutAppartenance: 'Membre Fondateur',
      institution: 'TEAM Sahélia · République du Bénin',
      dateAdhesion: '20 Janvier 2026',
      slogan: 'Le terrain d’abord : la donnée géographique au service de la terre.',
      tags: ['QGIS 3', 'GPS Smartphone', 'KoboToolbox', 'Agronomie'],
      email: 'teamsahelia@gmail.com',
      telephone: '+229 40 73 84 69',
      statut: 'actif'
    },
    {
      id: 'TS-MBR-2026-003',
      matricule: 'TS-MBR-2026-003',
      nom: 'Mariam DIALLO',
      role: 'Chargée de Communauté & Partenariats',
      categorie: 'Pionnier',
      statutAppartenance: 'Membre Pionnier',
      institution: 'TEAM Sahélia · République du Bénin',
      dateAdhesion: '01 Février 2026',
      slogan: 'L’entraide et le réseau font grandir les compétences.',
      tags: ['Animation Réseau', 'Partenariats', 'Coordination Terrain'],
      email: 'teamsahelia@gmail.com',
      telephone: '+229 40 73 84 69',
      statut: 'actif'
    },
    {
      id: 'TS-MBR-2026-004',
      matricule: 'TS-MBR-2026-004',
      nom: 'Amina CHABI',
      role: 'Référente Pédagogique & Méthodologie',
      categorie: 'Pionnier',
      statutAppartenance: 'Membre Pionnier',
      institution: 'TEAM Sahélia · République du Bénin',
      dateAdhesion: '10 Février 2026',
      slogan: 'Rigueur scientifique, clarté méthodologique et impact concret.',
      tags: ['Méthodologie', 'Rédaction Scientifique', 'Analyse RStudio'],
      email: 'teamsahelia@gmail.com',
      telephone: '+229 40 73 84 69',
      statut: 'actif'
    }
  ];

  // ---------------------------------------------------------------------------
  // 7. CONFIGURATION DU SITE & CANAUX COMMUNAUTAIRES
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
  // 8. FORMATIONS PÉDAGOGIQUES & COHORTES ACTIVES
  // ---------------------------------------------------------------------------
  const FORMATIONS = [
    {
      id: 'mn-01',
      titre: 'Bureautique Avancée & Analyse de Données (Excel & Word)',
      pole: 'Bureautique & Données',
      formateur: 'Olivier AREMOU',
      accentColor: '#2563eb',
      volumeHoraire: '35 heures'
    },
    {
      id: 'mn-06',
      titre: 'Cartographie Parcellaire & SIG de Terrain (QGIS & GPS)',
      pole: 'Agronomie & SIG',
      formateur: 'Ségla Bio KPEROU',
      accentColor: '#16a34a',
      volumeHoraire: '40 heures'
    },
    {
      id: 'mn-11',
      titre: 'Pilotage de Drone & Télédétection Agricole',
      pole: 'Drones & Télédétection',
      formateur: 'Pôle Drones TEAM Sahélia',
      accentColor: '#e8946a',
      volumeHoraire: '45 heures'
    },
    {
      id: 'mn-08',
      titre: 'Vibe Coding & Ingénierie de Solutions IA',
      pole: 'Innovation & IA',
      formateur: 'Olivier AREMOU',
      accentColor: '#7fb0ee',
      volumeHoraire: '40 heures'
    }
  ];

  const COHORTES = [
    {
      id: 'cohorte-pilote-2026',
      formationId: 'mn-06',
      nom: 'Cohorte Pilote SIG & Données de Terrain',
      periode: 'Janvier — Février 2026',
      lieu: 'Terrain & En ligne (Format Hybride)',
      formateurPrincipal: 'Ségla Bio KPEROU',
      dateValidation: '28 Février 2026',
      participants: [
        {
          id: 'TS-FOR-2026-P01',
          nom: 'Olivier AREMOU',
          role: 'Membre Fondateur',
          sexe: 'M',
          statut: 'termine',
          mention: 'Excellence Technique',
          dateValidation: '28 Février 2026',
          slogan: 'L’agronomie de demain s’appuie sur des données fiables.'
        },
        {
          id: 'TS-FOR-2026-P02',
          nom: 'Ségla Bio KPEROU',
          role: 'Formateur & Référent SIG',
          sexe: 'M',
          statut: 'termine',
          mention: 'Maîtrise Professionnelle',
          dateValidation: '28 Février 2026',
          slogan: 'La donnée géographique au service de la terre.'
        },
        {
          id: 'TS-FOR-2026-P03',
          nom: 'Mariam DIALLO',
          role: 'Auditrice & Terrain',
          sexe: 'F',
          statut: 'en_cours',
          mention: 'En cours d’évaluation',
          dateValidation: 'En cours',
          slogan: 'L’entraide et le réseau font grandir les compétences.'
        },
        {
          id: 'TS-FOR-2026-P04',
          nom: 'Amina CHABI',
          role: 'Méthodologie & Qualité',
          sexe: 'F',
          statut: 'termine',
          mention: 'Distinction Pédagogique',
          dateValidation: '28 Février 2026',
          slogan: 'Rigueur scientifique et impact concret.'
        }
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // 9. API PUBLIQUE SAHELIADB
  // ---------------------------------------------------------------------------
  const DB = {
    familles: FAMILLES_BADGES,
    niveaux: NIVEAUX_MAITRISE,
    cataloguePilote12: CATALOGUE_12_PILOTES,
    referentiel: REFERENTIEL_COMPETENCES,
    membres: MEMBRES_FONDATEURS,
    membresFondateurs: MEMBRES_FONDATEURS,
    attestations: ATTESTATIONS_OFFICIELLES,
    attributions: ATTESTATIONS_OFFICIELLES.map(a => {
      const comp = REFERENTIEL_COMPETENCES[a.track] || {};
      return {
        id: a.id,
        track: a.track,
        famille: a.famille || comp.famille || 'competence',
        competenceId: comp.id || a.track,
        titreCompetence: comp.titre || 'Compétence TEAM Sahélia',
        niveau: comp.niveau || 'Pratique Validée',
        beneficiaireNom: a.beneficiaireNom,
        beneficiaireRole: a.beneficiaireRole,
        institution: a.institution,
        validePar: a.validePar,
        dateAttribution: a.dateEmission,
        dateEmission: a.dateEmission,
        preuveProjet: a.preuveProjet,
        slogan: a.slogan,
        sexe: (a.beneficiaireNom === 'Mariam DIALLO' || a.beneficiaireNom === 'Amina CHABI') ? 'F' : 'M',
        statut: a.statut
      };
    }),
    competences: Object.values(REFERENTIEL_COMPETENCES).map(c => ({
      id: c.id,
      code: c.code,
      track: c.code,
      famille: c.famille,
      titre: c.titre,
      domaine: c.domaine,
      niveau: c.niveau,
      formeGeometrique: c.formeGeometrique,
      criteres: c.criteres,
      validateur: c.validateur,
      accentColor: c.accentColor,
      metal0: c.metal0,
      metal1: c.metal1,
      metal2: c.metal2,
      bgInner: c.bgInner
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
          famille: att.famille || comp.famille || 'competence',
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

      // 2. Recherche dans les membres
      const listeMembres = (DB.membres && DB.membres.length) ? DB.membres.slice().reverse() : MEMBRES_FONDATEURS;
      const mem = listeMembres.find(m => (m.id && m.id.toUpperCase() === cleanId) || (m.matricule && m.matricule.toUpperCase() === cleanId));
      if (mem) {
        const comp = REFERENTIEL_COMPETENCES['pionnier'] || {};
        const cat = mem.statutAppartenance || mem.categorie || 'Membre Officiel';
        return {
          id: mem.id || mem.matricule,
          type: 'membre',
          famille: 'appartenance',
          track: 'pionnier',
          titre: `${cat} · Communauté TEAM Sahélia`,
          domaine: 'Engagement Communautaire & Citoyenneté Numérique',
          niveau: cat,
          statutAppartenance: cat,
          formeGeometrique: 'pentagone',
          accentColor: '#22c55e',
          metal0: '#a7f3d0',
          metal1: '#22c55e',
          metal2: '#15803d',
          bgInner: '#06170f',
          beneficiaireNom: mem.nom || mem.beneficiaireNom,
          beneficiaireRole: mem.role || mem.beneficiaireRole,
          institution: mem.institution || 'Communauté TEAM Sahélia',
          slogan: mem.slogan || 'Apprendre aujourd’hui. Construire demain.',
          dateEmission: mem.dateAdhesion || '15 Janvier 2026',
          validFrom: '2026-01-15T00:00:00Z',
          validePar: 'Olivier AREMOU (Coordinateur Général)',
          preuveProjet: 'Adhésion et contribution active à la communauté TEAM Sahélia.',
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
            famille: 'formation',
            track: 'pionnier',
            titre: form.titre || 'Formation TEAM Sahélia',
            cohorteNom: coh.nom,
            periode: coh.periode,
            lieu: coh.lieu,
            formateur: coh.formateurPrincipal || form.formateur,
            dateEmission: p.dateValidation || coh.dateValidation || '28 Février 2026',
            beneficiaireNom: p.nom,
            beneficiaireRole: p.role,
            statut: p.statut || 'valide',
            mention: p.mention || 'Parcours Validé',
            slogan: p.slogan || 'L’apprentissage rigoureux transforme le potentiel en impact.',
            accentColor: form.accentColor || '#3b82f6',
            volumeHoraire: form.volumeHoraire || '40 heures'
          };
        }
      }

      return null;
    }
  };

  window.SaheliaDB = DB;
})();