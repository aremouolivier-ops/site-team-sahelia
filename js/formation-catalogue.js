/**
 * TEAM Sahélia — Catalogue Central des Formations, Guides & Manuels Stratégiques
 * Référentiel unifié des ressources pédagogiques (Libres et Protégées)
 */

(function () {
  'use strict';

  const POLES = {
    BUREAUTIQUE: {
      id: 'bureautique',
      nom: 'Pôle 1 : Bureautique & Productivité Fondamentale',
      accent: '#5fd0a0',
      icone: '📊'
    },
    AGRONOMIE_SIG: {
      id: 'agronomie_sig',
      nom: 'Pôle 2 : Agronomie, Données & Cartographie de Terrain',
      accent: '#2563eb',
      icone: '🌱'
    },
    CODE_IA: {
      id: 'code_ia',
      nom: 'Pôle 3 : Code, IA & Vibe Coding',
      accent: '#e8946a',
      icone: '💻'
    },
    COMMUNICATION_CARRIERE: {
      id: 'communication_carriere',
      nom: 'Pôle 4 : Création de Contenu & Carrière Professionnelle',
      accent: '#a855f7',
      icone: '🚀'
    }
  };

  const CATALOGUE = {
    // =========================================================================
    // 1. LES 5 MINI-GUIDES PRATIQUES (100% LIBRES & GRATUITS)
    // =========================================================================
    'guide-01': {
      id: 'guide-01',
      type: 'guide',
      libre: true,
      titre: 'Urgence Mémoire & Rapport sous Word & Excel',
      sousTitre: 'Les 10 règles d’or pour un document académique impeccable, structuré et sans stress',
      pole: POLES.BUREAUTIQUE.nom,
      poleId: POLES.BUREAUTIQUE.id,
      accentColor: '#5fd0a0',
      niveau: 'Tous niveaux (Licence & Master)',
      duree: '8-10 pages · 30 min de lecture active',
      description: 'Styles automatiques, sommaire dynamique en 2 clics, pagination différenciée (chiffres romains et arabes) et alignement des tableaux de données.',
      fichierSource: 'guides/01_URGENCE_MEMOIRE_ET_RAPPORT.md',
      baseDir: 'guides/',
      chapitres: [
        {
          id: 'unique',
          numero: 1,
          titre: 'Manuel Complet : Les 10 Règles d’Or',
          fichier: 'guides/01_URGENCE_MEMOIRE_ET_RAPPORT.md',
          duree: '30 min'
        }
      ]
    },

    'guide-02': {
      id: 'guide-02',
      type: 'guide',
      libre: true,
      titre: 'Tracer sa Parcelle Agricole avec GPS & QGIS',
      sousTitre: 'Guide terrain pas à pas pour agronomes et géomètres de terrain',
      pole: POLES.AGRONOMIE_SIG.nom,
      poleId: POLES.AGRONOMIE_SIG.id,
      accentColor: '#2563eb',
      niveau: 'Débutant à Intermédiaire',
      duree: '10-12 pages · 40 min',
      description: 'Enregistrement de waypoints GPS sur smartphone Android, conversion GPX vers GeoJSON/Shapefile, projection UTM Zone 31N WGS84 et calcul de superficie exacte en hectares.',
      fichierSource: 'guides/02_TRACER_SA_PARCELLE_GPS_QGIS.md',
      baseDir: 'guides/',
      chapitres: [
        {
          id: 'unique',
          numero: 1,
          titre: 'Guide Pratique : De la Marche Terrain à la Carte QGIS',
          fichier: 'guides/02_TRACER_SA_PARCELLE_GPS_QGIS.md',
          duree: '40 min'
        }
      ]
    },

    'guide-03': {
      id: 'guide-03',
      type: 'guide',
      libre: true,
      titre: 'Prompts de Recherche Scientifique & Vibe Coding IA',
      sousTitre: 'Formuler des requêtes d’ingénierie et prototyper des outils sans être programmeur',
      pole: POLES.CODE_IA.nom,
      poleId: POLES.CODE_IA.id,
      accentColor: '#e8946a',
      niveau: 'Accessible à tous',
      duree: '8-10 pages · 30 min',
      description: 'Méthode RTCE (Rôle, Tâche, Contexte, Exigence), synthèses bibliographiques sans hallucinations, génération de scripts Python/R et création d’applications utiles.',
      fichierSource: 'guides/03_PROMPTS_RECHERCHE_ET_VIBE_CODING.md',
      baseDir: 'guides/',
      chapitres: [
        {
          id: 'unique',
          numero: 1,
          titre: 'Guide Pratique : Dompter l’IA Générative et Coder en Français',
          fichier: 'guides/03_PROMPTS_RECHERCHE_ET_VIBE_CODING.md',
          duree: '30 min'
        }
      ]
    },

    'guide-04': {
      id: 'guide-04',
      type: 'guide',
      libre: true,
      titre: 'Collecte Numérique de Terrain avec KoboToolbox',
      sousTitre: 'Créer, déployer et synchroniser des enquêtes agricoles hors-ligne',
      pole: POLES.AGRONOMIE_SIG.nom,
      poleId: POLES.AGRONOMIE_SIG.id,
      accentColor: '#2563eb',
      niveau: 'Intermédiaire',
      duree: '10-12 pages · 45 min',
      description: 'Formulaires XLSForm et constructeur web Kobo, capture de coordonnées GPS, photos horodatées, contraintes de validation et export propre vers Excel.',
      fichierSource: 'guides/04_COLLECTE_TERRAIN_KOBOTOOLBOX.md',
      baseDir: 'guides/',
      chapitres: [
        {
          id: 'unique',
          numero: 1,
          titre: 'Guide Pratique : Enquêtes Mobiles et Zéro Papier',
          fichier: 'guides/04_COLLECTE_TERRAIN_KOBOTOOLBOX.md',
          duree: '45 min'
        }
      ]
    },

    'guide-05': {
      id: 'guide-05',
      type: 'guide',
      libre: true,
      titre: 'Création Visuelle, Infographies & Affiches Pro',
      sousTitre: 'Concevoir des supports de communication scientifique percutants sur smartphone et PC',
      pole: POLES.COMMUNICATION_CARRIERE.nom,
      poleId: POLES.COMMUNICATION_CARRIERE.id,
      accentColor: '#a855f7',
      niveau: 'Débutant',
      duree: '8-10 pages · 35 min',
      description: 'Règles typographiques, contrastes de couleurs, mise en page en grille, préparation d’affiches de soutenance et de visuels de vulgarisation pour réseaux sociaux.',
      fichierSource: 'guides/05_CREATION_VISUELLE_ET_AFFICHES_PRO.md',
      baseDir: 'guides/',
      chapitres: [
        {
          id: 'unique',
          numero: 1,
          titre: 'Guide Pratique : Graphisme et Communication Visuelle',
          fichier: 'guides/05_CREATION_VISUELLE_ET_AFFICHES_PRO.md',
          duree: '35 min'
        }
      ]
    },

    // =========================================================================
    // 2. LES 10 MANUELS STRATÉGIQUES (ACCÈS RÉSERVÉ : BADGE VALIDE + CODE FONDATION)
    // =========================================================================
    'mn-01': {
      id: 'mn-01',
      type: 'manuel',
      libre: false,
      titre: 'Excel pour les Étudiants & Professionnels',
      sousTitre: 'Du premier tableau aux tableaux croisés dynamiques — Analyse de données de terrain',
      pole: POLES.BUREAUTIQUE.nom,
      poleId: POLES.BUREAUTIQUE.id,
      accentColor: '#5fd0a0',
      niveau: 'Complet (Débutant à Expert Métier)',
      duree: '65 pages équivalent · 8 chapitres + Projet Capstone',
      description: 'Manuel officiel complet : anatomie d’une cellule, formules absolues/relatives ($), statistiques agronomiques, filtres conditionnels, fonctions logiques SI imbriquées, nettoyage de bases réelles, graphiques de jury et tableaux croisés dynamiques (TCD).',
      baseDir: 'manuels/01-excel-etudiants-professionnels/',
      badgeRequis: 'Membre Officiel ou Stagiaire Certifié TEAM Sahélia',
      ressources: [
        {
          nom: 'Dataset Agronomique Parakou (CSV)',
          fichier: 'manuels/01-excel-etudiants-professionnels/datasets/dataset_agronomique_parakou.csv',
          description: 'Fichier d’exercice réel contenant 20 parcelles d’essais avec rendements, doses d’engrais et dates de semis.'
        },
        {
          nom: 'Pack Schémas Vectoriels Officiels (SVG)',
          dossier: 'manuels/01-excel-etudiants-professionnels/schemas/',
          description: '8 schémas pédagogiques explicatifs en haute définition.'
        }
      ],
      chapitres: [
        {
          id: 'ch-00',
          numero: 0,
          titre: 'Plan Stratégique & Introduction Méthodologique',
          fichier: 'manuels/01-excel-etudiants-professionnels/00_PLAN_ET_INTRODUCTION.md',
          duree: '20 min'
        },
        {
          id: 'ch-01',
          numero: 1,
          titre: 'Chapitre 1 : Anatomie d’Excel & Hygiène de Saisie',
          fichier: 'manuels/01-excel-etudiants-professionnels/chapitres/01_ANATOMIE_ET_HYGIENE_SAISIE.md',
          schema: 'schemas/schema_01_anatomie_cellule.svg',
          duree: '45 min'
        },
        {
          id: 'ch-02',
          numero: 2,
          titre: 'Chapitre 2 : Formules Arithmétiques & La Règle d’Or du Dollar ($)',
          fichier: 'manuels/01-excel-etudiants-professionnels/chapitres/02_FORMULES_ARITHMETIQUES_ET_DOLLAR.md',
          schema: 'schemas/schema_02_references_absolues_dollar.svg',
          duree: '45 min'
        },
        {
          id: 'ch-03',
          numero: 3,
          titre: 'Chapitre 3 : Statistiques Descriptives & Formatage Professionnel',
          fichier: 'manuels/01-excel-etudiants-professionnels/chapitres/03_STATISTIQUES_DESCRIPTIVES_ET_FORMATAGE.md',
          schema: 'schemas/schema_03_statistiques_agronomiques.svg',
          duree: '40 min'
        },
        {
          id: 'ch-04',
          numero: 4,
          titre: 'Chapitre 4 : Filtrage Conditionnel Avancé (SOMME.SI, NB.SI, MOYENNE.SI)',
          fichier: 'manuels/01-excel-etudiants-professionnels/chapitres/04_FILTRAGE_CONDITIONNEL_AVANCE.md',
          schema: 'schemas/schema_04_fonctions_conditionnelles.svg',
          duree: '45 min'
        },
        {
          id: 'ch-05',
          numero: 5,
          titre: 'Chapitre 5 : Logique Décisionnelle avec la Fonction SI & Opérateurs',
          fichier: 'manuels/01-excel-etudiants-professionnels/chapitres/05_LOGIQUE_DECISIONNELLE_FONCTION_SI.md',
          schema: 'schemas/schema_05_arbre_decisionnel_si.svg',
          duree: '40 min'
        },
        {
          id: 'ch-06',
          numero: 6,
          titre: 'Chapitre 6 : Nettoyage & Préparation de Bases de Données Brutes',
          fichier: 'manuels/01-excel-etudiants-professionnels/chapitres/06_NETTOYAGE_ET_PREPARATION_BASES_DONNEES.md',
          schema: 'schemas/schema_06_nettoyage_donnees.svg',
          duree: '50 min'
        },
        {
          id: 'ch-07',
          numero: 7,
          titre: 'Chapitre 7 : Graphiques Scientifiques de Jury & Règles Visuelles',
          fichier: 'manuels/01-excel-etudiants-professionnels/chapitres/07_GRAPHIQUES_SCIENTIFIQUES_DE_JURY.md',
          schema: 'schemas/schema_07_graphique_scientifique.svg',
          duree: '45 min'
        },
        {
          id: 'ch-08',
          numero: 8,
          titre: 'Chapitre 8 : Tableaux Croisés Dynamiques (TCD) & Tableaux de Bord',
          fichier: 'manuels/01-excel-etudiants-professionnels/chapitres/08_TABLEAUX_CROISES_DYNAMIQUES_TCD.md',
          schema: 'schemas/schema_08_anatomie_tcd.svg',
          duree: '50 min'
        },
        {
          id: 'ch-09',
          numero: 9,
          titre: 'Projet Capstone & Critères d’Attribution du Badge',
          fichier: 'manuels/01-excel-etudiants-professionnels/09_PROJET_SYNTHESE_ET_CERTIFICATION.md',
          duree: '60 min'
        }
      ]
    },

    'mn-02': {
      id: 'mn-02',
      type: 'manuel',
      libre: false,
      titre: 'Word & PowerPoint Pro : Mémoires & Soutenances',
      sousTitre: 'Rédiger des documents académiques parfaits et captiver son jury sans panique',
      pole: POLES.BUREAUTIQUE.nom,
      poleId: POLES.BUREAUTIQUE.id,
      accentColor: '#5fd0a0',
      niveau: 'Complet (Intermédiaire à Expert Mémoire)',
      duree: '60 pages équivalent · 7 chapitres + Projet Capstone',
      description: 'Feuilles de style automatiques, sauts de section, double pagination (chiffres romains et arabes), légendes normées, renvois croisés dynamiques, gestion bibliographique APA 7e / Zotero, règle des 6x6 sous PowerPoint et gestion du jury.',
      baseDir: 'manuels/02-word-powerpoint-pro/',
      badgeRequis: 'Membre Officiel ou Stagiaire Certifié TEAM Sahélia',
      ressources: [
        {
          nom: 'Pack Schémas Vectoriels Mémoires (SVG)',
          dossier: 'manuels/02-word-powerpoint-pro/schemas/',
          description: '6 schémas pédagogiques officiels haute définition pour la rédaction et la soutenance.'
        }
      ],
      chapitres: [
        {
          id: 'ch-01',
          numero: 1,
          titre: 'Chapitre 1 : Feuilles de Styles & Sommaire Automatique',
          fichier: 'manuels/02-word-powerpoint-pro/chapitres/01_FEUILLES_DE_STYLES_ET_SOMMAIRE.md',
          schema: 'schemas/schema_01_hierarchie_styles_word.svg',
          duree: '45 min'
        },
        {
          id: 'ch-02',
          numero: 2,
          titre: 'Chapitre 2 : Sauts de Section & Pagination Différenciée (Romains / Arabes)',
          fichier: 'manuels/02-word-powerpoint-pro/chapitres/02_PAGINATION_DIFFERENCIEE_ET_SECTIONS.md',
          schema: 'schemas/schema_02_pagination_sections_word.svg',
          duree: '35 min'
        },
        {
          id: 'ch-03',
          numero: 3,
          titre: 'Chapitre 3 : Tableaux, Figures, Légendes Normées & Renvois Croisés',
          fichier: 'manuels/02-word-powerpoint-pro/chapitres/03_TABLEAUX_FIGURES_ET_RENVOIS.md',
          schema: 'schemas/schema_03_legendes_et_renvois_figures.svg',
          duree: '40 min'
        },
        {
          id: 'ch-04',
          numero: 4,
          titre: 'Chapitre 4 : Références Bibliographiques & Zotero aux Normes APA 7e / CAMES',
          fichier: 'manuels/02-word-powerpoint-pro/chapitres/04_REFERENCES_BIBLIOGRAPHIQUES_ET_ZOTERO.md',
          schema: 'schemas/schema_04_normes_citations_apa.svg',
          duree: '45 min'
        },
        {
          id: 'ch-05',
          numero: 5,
          titre: 'Chapitre 5 : PowerPoint de Soutenance — Règle des 6x6 & Lisibilité 10 Mètres',
          fichier: 'manuels/02-word-powerpoint-pro/chapitres/05_POWERPOINT_SOUTENANCE_ET_REGLE_6X6.md',
          schema: 'schemas/schema_05_anatomie_diapositive_soutenance.svg',
          duree: '40 min'
        },
        {
          id: 'ch-06',
          numero: 6,
          titre: 'Chapitre 6 : Remplacer le Texte par des Graphiques & Schémas Parlants',
          fichier: 'manuels/02-word-powerpoint-pro/chapitres/06_GRAPHIQUES_ET_SCHEMAS_DE_SOUTENANCE.md',
          schema: 'schemas/schema_05b_graphiques_soutenance.svg',
          duree: '35 min'
        },
        {
          id: 'ch-07',
          numero: 7,
          titre: 'Chapitre 7 : Chronogramme des 20 Minutes & Gestion du Feu des Questions',
          fichier: 'manuels/02-word-powerpoint-pro/chapitres/07_GESTION_DU_CHRONO_ET_JURY.md',
          schema: 'schemas/schema_06_chrono_soutenance_jury.svg',
          duree: '45 min'
        },
        {
          id: 'ch-08',
          numero: 8,
          titre: 'Projet Capstone : Le Kit Mémoire & Soutenance Officiel',
          fichier: 'manuels/02-word-powerpoint-pro/08_PROJET_SYNTHESE_ET_CERTIFICATION.md',
          duree: '60 min'
        }
      ]
    },

    'mn-03': {
      id: 'mn-03',
      type: 'manuel',
      libre: false,
      titre: '50 Astuces & Raccourcis Informatiques du Débutant au Pro',
      sousTitre: 'Sécurité, sauvegardes infaillibles, vitesse d’exécution et maintenance PC',
      pole: POLES.BUREAUTIQUE.nom,
      poleId: POLES.BUREAUTIQUE.id,
      accentColor: '#5fd0a0',
      niveau: 'Tous niveaux',
      duree: '55 pages équivalent · 6 chapitres + Projet Capstone',
      description: 'Raccourcis indispensables sous Windows, gestion saine de la mémoire vive, sauvegarde 3-2-1 anti-perte de données, désinfection clé USB et automatisation par script.',
      baseDir: 'manuels/03-astuces-raccourcis-informatiques/',
      badgeRequis: 'Membre Officiel TEAM Sahélia',
      ressources: [
        {
          nom: 'Pack Schémas Vectoriels Productivité & Maintenance (SVG)',
          dossier: 'manuels/03-astuces-raccourcis-informatiques/schemas/',
          description: '6 schémas pédagogiques officiels haute définition.'
        }
      ],
      chapitres: [
        {
          id: 'ch-01',
          numero: 1,
          titre: 'Chapitre 1 : Les 15 Touches Systèmes de Productivité Absolue',
          fichier: 'manuels/03-astuces-raccourcis-informatiques/chapitres/01_RACCOURCIS_ET_PRODUCTIVITE_SYSTEME.md',
          schema: 'schemas/schema_01_raccourcis_productivite.svg',
          duree: '30 min'
        },
        {
          id: 'ch-02',
          numero: 2,
          titre: 'Chapitre 2 : Organisation Infaillible des Fichiers & Nomenclature ISO 8601',
          fichier: 'manuels/03-astuces-raccourcis-informatiques/chapitres/02_ORGANISATION_FICHIERS_ET_NOMENCLATURE.md',
          schema: 'schemas/schema_02_arborescence_fichiers.svg',
          duree: '35 min'
        },
        {
          id: 'ch-03',
          numero: 3,
          titre: 'Chapitre 3 : La Stratégie de Sauvegarde 3-2-1 & Sécurité des Clés USB',
          fichier: 'manuels/03-astuces-raccourcis-informatiques/chapitres/03_STRATEGIE_SAUVEGARDE_321_ET_ANTIVIRUS.md',
          schema: 'schemas/schema_03_strategie_sauvegarde_321.svg',
          duree: '40 min'
        },
        {
          id: 'ch-04',
          numero: 4,
          titre: 'Chapitre 4 : Optimisation, Vitesse & Dépannage d’un PC Lent Sans Formater',
          fichier: 'manuels/03-astuces-raccourcis-informatiques/chapitres/04_OPTIMISATION_MAINTENANCE_ET_DEPANNAGE.md',
          schema: 'schemas/schema_04_diagnostic_maintenance_pc.svg',
          duree: '40 min'
        },
        {
          id: 'ch-05',
          numero: 5,
          titre: 'Chapitre 5 : Maîtrise du Navigateur Web & Recherche Scientifique Avancée',
          fichier: 'manuels/03-astuces-raccourcis-informatiques/chapitres/05_MAITRISE_NAVIGATEUR_ET_RECHERCHE_WEB.md',
          schema: 'schemas/schema_05_recherche_avancee_web.svg',
          duree: '35 min'
        },
        {
          id: 'ch-06',
          numero: 6,
          titre: 'Chapitre 6 : Projet Capstone — Checklist d’Audit & Automatisation PC Pro',
          fichier: 'manuels/03-astuces-raccourcis-informatiques/chapitres/06_CHECKLIST_ET_AUTOMATISATION_PC.md',
          schema: 'schemas/schema_06_checklist_certification_pc.svg',
          duree: '50 min'
        }
      ]
    },

    'mn-04': {
      id: 'mn-04',
      type: 'manuel',
      libre: false,
      titre: 'R & RStudio pour l’Agronomie & la Recherche',
      sousTitre: 'Analyse statistique des essais et enquêtes sans paniquer — De l’import à l’ANOVA',
      pole: POLES.AGRONOMIE_SIG.nom,
      poleId: POLES.AGRONOMIE_SIG.id,
      accentColor: '#2563eb',
      niveau: 'Intermédiaire à Avancé',
      duree: '70 pages équivalent · 8 chapitres + Projet Capstone',
      description: 'Importation propre de fichiers Excel, manipulation de tables avec tidyverse, tests de normalité de Shapiro-Wilk, ANOVA à 1 et 2 facteurs, test de Tukey et graphiques ggplot2 prêts pour publication.',
      baseDir: 'manuels/04-r-rstudio-agronomie/',
      badgeRequis: 'Formation R & Agronomie TEAM Sahélia',
      ressources: [
        {
          nom: 'Pack Schémas Vectoriels Biométrie & R (SVG)',
          dossier: 'manuels/04-r-rstudio-agronomie/schemas/',
          description: '8 schémas pédagogiques officiels haute définition.'
        },
        {
          nom: 'Dataset Essais Maïs Parakou (CSV)',
          fichier: 'manuels/01-excel-etudiants-professionnels/datasets/dataset_agronomique_parakou.csv',
          description: 'Jeu de données agronomiques réelles pour les ateliers R.'
        }
      ],
      chapitres: [
        {
          id: 'ch-01',
          numero: 1,
          titre: 'Chapitre 1 : Prise en main RStudio & Importation de Données',
          fichier: 'manuels/04-r-rstudio-agronomie/chapitres/01_PRISE_EN_MAIN_RSTUDIO_ET_IMPORTATION.md',
          schema: 'schemas/schema_01_quadrants_rstudio.svg',
          duree: '35 min'
        },
        {
          id: 'ch-02',
          numero: 2,
          titre: 'Chapitre 2 : Manipulation des Tables Agronomiques avec Tidyverse & Dplyr',
          fichier: 'manuels/04-r-rstudio-agronomie/chapitres/02_MANIPULATION_TIDYVERSE_ET_DPLYR.md',
          schema: 'schemas/schema_02_pipeline_dplyr.svg',
          duree: '40 min'
        },
        {
          id: 'ch-03',
          numero: 3,
          titre: 'Chapitre 3 : Statistiques Descriptives & Visualisation Exploratoire avec ggplot2',
          fichier: 'manuels/04-r-rstudio-agronomie/chapitres/03_STATISTIQUES_ET_VISUALISATION_GGPLOT2.md',
          schema: 'schemas/schema_03_anatomie_ggplot2.svg',
          duree: '45 min'
        },
        {
          id: 'ch-04',
          numero: 4,
          titre: 'Chapitre 4 : Vérification des Conditions de l’ANOVA (Shapiro-Wilk & Bartlett)',
          fichier: 'manuels/04-r-rstudio-agronomie/chapitres/04_CONDITIONS_NORMALITE_ET_HOMOSCEDASTICITE.md',
          schema: 'schemas/schema_04_arbre_decision_tests_statistiques.svg',
          duree: '40 min'
        },
        {
          id: 'ch-05',
          numero: 5,
          titre: 'Chapitre 5 : L’Analyse de Variance (ANOVA) à 1 Facteur & Test de Fisher',
          fichier: 'manuels/04-r-rstudio-agronomie/chapitres/05_ANOVA_1_FACTEUR_ET_TABLEAU_FISHER.md',
          schema: 'schemas/schema_05_anatomie_tableau_anova.svg',
          duree: '45 min'
        },
        {
          id: 'ch-06',
          numero: 6,
          titre: 'Chapitre 6 : Comparaisons Multiples Post-Hoc & Lettres Statistiques de Tukey (HSD)',
          fichier: 'manuels/04-r-rstudio-agronomie/chapitres/06_TEST_TUKEY_HSD_ET_LETTRES_SIGNIFICATIVITE.md',
          schema: 'schemas/schema_06_lettres_tukey_groupes.svg',
          duree: '45 min'
        },
        {
          id: 'ch-07',
          numero: 7,
          titre: 'Chapitre 7 : ANOVA à 2 Facteurs & Analyse des Interactions',
          fichier: 'manuels/04-r-rstudio-agronomie/chapitres/07_ANOVA_2_FACTEURS_ET_INTERACTIONS.md',
          schema: 'schemas/schema_07_graphique_interaction_factorielle.svg',
          duree: '45 min'
        },
        {
          id: 'ch-08',
          numero: 8,
          titre: 'Chapitre 8 : Projet Capstone — Le Script d’Analyse Agronomique Reproductible',
          fichier: 'manuels/04-r-rstudio-agronomie/chapitres/08_PROJET_CAPSTONE_SCRIPT_REPRODUCTIBLE.md',
          schema: 'schemas/schema_08_pipeline_complet_recherche_r.svg',
          duree: '60 min'
        }
      ]
    },

    'mn-05': {
      id: 'mn-05',
      type: 'manuel',
      libre: false,
      titre: 'KoboToolbox & Collecte Numérique de Terrain sur Smartphone',
      sousTitre: 'Formulaires d’enquêtes complexes, GPS hors-ligne et synchronisation cloud',
      pole: POLES.AGRONOMIE_SIG.nom,
      poleId: POLES.AGRONOMIE_SIG.id,
      accentColor: '#2563eb',
      niveau: 'Intermédiaire à Avancé',
      duree: '60 pages équivalent · 6 chapitres',
      description: 'Conception de formulaires XLSForm avec sauts logiques, géolocalisation GPS sans réseau internet, contrôle qualité des enquêteurs, détection des fraudes et passerelles d’export propres vers R et QGIS.',
      baseDir: 'manuels/05-kobotoolbox-collecte-terrain/',
      badgeRequis: 'Membre Officiel ou Participant Formation',
      chapitres: [
        {
          id: 'ch-01',
          numero: 1,
          titre: 'Chapitre 1 : Conception de Formulaire & Variables Terrain',
          fichier: 'manuels/05-kobotoolbox-collecte-terrain/chapitres/01_CONCEPTION_FORMULAIRE_ET_VARIABLES.md',
          schema: 'schemas/schema_01_cycle_kobotoolbox.svg',
          duree: '45 min'
        },
        {
          id: 'ch-02',
          numero: 2,
          titre: 'Chapitre 2 : Sauts Logiques & Conditions d\'Affichage',
          fichier: 'manuels/05-kobotoolbox-collecte-terrain/chapitres/02_SAUTS_LOGIQUES_ET_CONDITIONS_AFFICHAGE.md',
          schema: 'schemas/schema_02_skip_logic_arborescence.svg',
          duree: '40 min'
        },
        {
          id: 'ch-03',
          numero: 3,
          titre: 'Chapitre 3 : Critères de Validation & Contrôle Qualité',
          fichier: 'manuels/05-kobotoolbox-collecte-terrain/chapitres/03_CRITERES_VALIDATION_ET_CONTROLE_QUALITE.md',
          schema: 'schemas/schema_03_criteres_validation_erreurs.svg',
          duree: '45 min'
        },
        {
          id: 'ch-04',
          numero: 4,
          titre: 'Chapitre 4 : La Puissance du Format XLSForm dans Excel',
          fichier: 'manuels/05-kobotoolbox-collecte-terrain/chapitres/04_LA_PUISSANCE_DU_FORMAT_XLSFORM.md',
          schema: 'schemas/schema_04_structure_tableur_xlsform.svg',
          duree: '50 min'
        },
        {
          id: 'ch-05',
          numero: 5,
          titre: 'Chapitre 5 : Déploiement Mobile & Collecte Hors-Ligne',
          fichier: 'manuels/05-kobotoolbox-collecte-terrain/chapitres/05_DEPLOIEMENT_MOBILE_ET_COLLECTE_HORS_LIGNE.md',
          schema: 'schemas/schema_05_deploiement_mobile_odk_qrcode.svg',
          duree: '40 min'
        },
        {
          id: 'ch-06',
          numero: 6,
          titre: 'Chapitre 6 : Exportation, Contrôle Qualité & Passerelle R / QGIS',
          fichier: 'manuels/05-kobotoolbox-collecte-terrain/chapitres/06_EXPORTATION_SUPERVISION_ET_CARTOGRAPHIE.md',
          schema: 'schemas/schema_06_audit_export_supervision.svg',
          duree: '45 min'
        }
      ]
    },

    'mn-06': {
      id: 'mn-06',
      type: 'manuel',
      libre: false,
      titre: 'Cartographie Agricole & SIG : QGIS, ArcGIS & Google Earth',
      sousTitre: 'Délimitation parcellaire, calcul d’aires, indices Sentinel et cartes professionnelles',
      pole: POLES.AGRONOMIE_SIG.nom,
      poleId: POLES.AGRONOMIE_SIG.id,
      accentColor: '#2563eb',
      niveau: 'Complet (Débutant à Professionnel)',
      duree: '70 pages équivalent · 6 chapitres',
      description: 'Systèmes de coordonnées et projections (UTM 31N), digitalisation vecteur, calcul d’aires en hectares, intégration d’imagerie satellite Sentinel-2 (indices NDVI) et mise en page cartographique aux normes CAMES.',
      baseDir: 'manuels/06-cartographie-agricole-sig/',
      badgeRequis: 'Badge SIG TEAM Sahélia ou Membre',
      chapitres: [
        {
          id: 'ch-01',
          numero: 1,
          titre: 'Chapitre 1 : Fondations SIG & Coordonnées au Bénin (UTM 31N)',
          fichier: 'manuels/06-cartographie-agricole-sig/chapitres/01_FONDATIONS_SIG_ET_COORDONNEES_BENIN.md',
          schema: 'schemas/schema_01_superposition_couches_sig.svg',
          duree: '50 min'
        },
        {
          id: 'ch-02',
          numero: 2,
          titre: 'Chapitre 2 : Importation GPS & Géoréférencement de Plans Terrain',
          fichier: 'manuels/06-cartographie-agricole-sig/chapitres/02_ACQUISITION_GPS_IMPORT_ET_GEOREFERENCEMENT.md',
          schema: 'schemas/schema_02_georeferencement_points_calage.svg',
          duree: '45 min'
        },
        {
          id: 'ch-03',
          numero: 3,
          titre: 'Chapitre 3 : Digitalisation Parcellaire & Calcul d\'Aires en Hectares',
          fichier: 'manuels/06-cartographie-agricole-sig/chapitres/03_NUMERISATION_PARCELLAIRE_ET_CALCUL_HECTARES.md',
          schema: 'schemas/schema_03_topologie_et_calcul_surface.svg',
          duree: '50 min'
        },
        {
          id: 'ch-04',
          numero: 4,
          titre: 'Chapitre 4 : Jointures de Données & Cartographie Thématique',
          fichier: 'manuels/06-cartographie-agricole-sig/chapitres/04_JOINTURES_TABLES_ET_ANALYSE_THEMATIQUE.md',
          schema: 'schemas/schema_04_jointure_attributaire_carte_choroplethe.svg',
          duree: '45 min'
        },
        {
          id: 'ch-05',
          numero: 5,
          titre: 'Chapitre 5 : Télédétection Optique & Calcul de l\'Indice NDVI',
          fichier: 'manuels/06-cartographie-agricole-sig/chapitres/05_TELEDETECTION_SENTINEL2_ET_INDICE_NDVI.md',
          schema: 'schemas/schema_05_calcul_ndvi_spectre_vegetation.svg',
          duree: '50 min'
        },
        {
          id: 'ch-06',
          numero: 6,
          titre: 'Chapitre 6 : Mise en Page & Carte de Soutenance aux Normes CAMES',
          fichier: 'manuels/06-cartographie-agricole-sig/chapitres/06_MISE_EN_PAGE_ET_CARTE_DE_SOUTENANCE_CAMES.md',
          schema: 'schemas/schema_06_anatomie_composeur_impression_cames.svg',
          duree: '55 min'
        }
      ]
    },

    'mn-11': {
      id: 'mn-11',
      type: 'manuel',
      libre: false,
      titre: 'Pilotage de Drones & Drones Agricoles : Cartographie & Pulvérisation',
      sousTitre: 'Typologie, commandes Mode 2, photogrammétrie, effet Downwash et agriculture de précision',
      pole: POLES.AGRONOMIE_SIG.nom,
      poleId: POLES.AGRONOMIE_SIG.id,
      accentColor: '#10b981',
      niveau: 'Complet (Débutant à Professionnel)',
      duree: '75 pages équivalent · 6 chapitres',
      description: 'Anatomie des drones civils et agricoles, pilotage en Mode 2, réglementation ANAC Bénin, programmation de plans de vol en peigne, calcul du GSD, calibrage des atomiseurs rotatifs de pulvérisation et boucle complète d\'agriculture de précision avec QGIS.',
      baseDir: 'manuels/11-pilotage-drones-agricoles/',
      badgeRequis: 'Badge Pilote TEAM Sahélia ou Membre',
      chapitres: [
        {
          id: 'ch-01',
          numero: 1,
          titre: 'Chapitre 1 : Typologie & Anatomie des Drones Agricoles',
          fichier: 'manuels/11-pilotage-drones-agricoles/chapitres/01_TYPOLOGIE_ET_ANATOMIE_DES_DRONES.md',
          schema: 'schemas/schema_01_anatomie_et_types_drones.svg',
          duree: '45 min'
        },
        {
          id: 'ch-02',
          numero: 2,
          titre: 'Chapitre 2 : Fondements du Pilotage & Commandes en Mode 2',
          fichier: 'manuels/11-pilotage-drones-agricoles/chapitres/02_COMMANDES_MODE2_ET_PILOTAGE_DE_BASE.md',
          schema: 'schemas/schema_02_joysticks_mode2_et_mouvements.svg',
          duree: '50 min'
        },
        {
          id: 'ch-03',
          numero: 3,
          titre: 'Chapitre 3 : Sécurité Aérienne, Météo & Réglementation ANAC',
          fichier: 'manuels/11-pilotage-drones-agricoles/chapitres/03_SECURITE_METEO_ET_REGLEMENTATION.md',
          schema: 'schemas/schema_03_securite_meteo_et_checklist.svg',
          duree: '45 min'
        },
        {
          id: 'ch-04',
          numero: 4,
          titre: 'Chapitre 4 : Missions Automatisées & Photogrammétrie',
          fichier: 'manuels/11-pilotage-drones-agricoles/chapitres/04_MISSIONS_AUTOMATISEES_ET_PHOTOGRAMMETRIE.md',
          schema: 'schemas/schema_04_plan_de_vol_photogrammetrie_gsd.svg',
          duree: '50 min'
        },
        {
          id: 'ch-05',
          numero: 5,
          titre: 'Chapitre 5 : Drones de Pulvérisation Agricole & Calibration',
          fichier: 'manuels/11-pilotage-drones-agricoles/chapitres/05_DRONES_DE_PULVERISATION_ET_CALIBRATION.md',
          schema: 'schemas/schema_05_drone_pulverisation_downwash.svg',
          duree: '50 min'
        },
        {
          id: 'ch-06',
          numero: 6,
          titre: 'Chapitre 6 : Le Cycle Complet d\'Agriculture de Précision par Drone & SIG',
          fichier: 'manuels/11-pilotage-drones-agricoles/chapitres/06_BOUCLE_COMPLETE_AGRICULTURE_DE_PRECISION.md',
          schema: 'schemas/schema_06_boucle_complete_agriculture_precision_drone.svg',
          duree: '55 min'
        }
      ]
    },

    'mn-07': {
      id: 'mn-07',
      type: 'manuel',
      libre: false,
      titre: 'Développement Web Moderne (HTML5, CSS3 & JavaScript)',
      sousTitre: 'Comprendre l’architecture du web, créer des pages interactives et héberger ses outils',
      pole: POLES.CODE_IA.nom,
      poleId: POLES.CODE_IA.id,
      accentColor: '#e8946a',
      niveau: 'Débutant à Développeur Junior',
      duree: '65 pages équivalent · 6 chapitres',
      description: 'Structure sémantique HTML5, design responsive CSS (Flexbox, Grid), programmation événementielle JavaScript, manipulation du DOM, persistance localStorage et déploiement gratuit sur GitHub Pages.',
      baseDir: 'manuels/07-developpement-web-moderne/',
      badgeRequis: 'Membre Officiel TEAM Sahélia',
      chapitres: [
        {
          id: 'ch-01',
          numero: 1,
          titre: 'Chapitre 1 : Anatomie du Web & Squelette HTML5',
          fichier: 'manuels/07-developpement-web-moderne/chapitres/01_ANATOMIE_WEB_ET_SQUELETTE_HTML5.md',
          schema: 'schemas/schema_01_trilogie_web.svg',
          duree: '45 min'
        },
        {
          id: 'ch-02',
          numero: 2,
          titre: 'Chapitre 2 : CSS3 Moderne, Flexbox & Design Responsive',
          fichier: 'manuels/07-developpement-web-moderne/chapitres/02_CSS3_FLEXBOX_ET_DESIGN_RESPONSIVE.md',
          schema: 'schemas/schema_02_flexbox_et_grid_css.svg',
          duree: '45 min'
        },
        {
          id: 'ch-03',
          numero: 3,
          titre: 'Chapitre 3 : JavaScript Moderne, Logique & Moteur Événementiel',
          fichier: 'manuels/07-developpement-web-moderne/chapitres/03_JAVASCRIPT_VARIABLES_FONCTIONS_EVENEMENTS.md',
          schema: 'schemas/schema_03_moteur_evenementiel_javascript.svg',
          duree: '50 min'
        },
        {
          id: 'ch-04',
          numero: 4,
          titre: 'Chapitre 4 : Manipulation du DOM & Formulaires Interactifs',
          fichier: 'manuels/07-developpement-web-moderne/chapitres/04_MANIPULATION_DOM_ET_FORMULAIRES.md',
          schema: 'schemas/schema_04_arbre_dom_et_interactions.svg',
          duree: '45 min'
        },
        {
          id: 'ch-05',
          numero: 5,
          titre: 'Chapitre 5 : LocalStorage & Applications Web Hors-Ligne',
          fichier: 'manuels/07-developpement-web-moderne/chapitres/05_LOCALSTORAGE_ET_APPLICATIONS_HORS_LIGNE.md',
          schema: 'schemas/schema_05_cycle_localstorage_offline.svg',
          duree: '45 min'
        },
        {
          id: 'ch-06',
          numero: 6,
          titre: 'Chapitre 6 : Projet Capstone · L\'Application Web Métier Déployée',
          fichier: 'manuels/07-developpement-web-moderne/chapitres/06_PROJET_CAPSTONE_APPLICATION_WEB_DEPLOYEE.md',
          schema: 'schemas/schema_06_pipeline_git_et_deploiement_web.svg',
          duree: '55 min'
        }
      ]
    },

    'mn-08': {
      id: 'mn-08',
      type: 'manuel',
      libre: false,
      titre: 'Vibe Coding & IA Responsable : Bâtir ses Outils sur Mesure',
      sousTitre: 'Piloter l’IA avec discernement, orchestrer le code et éviter les hallucinations',
      pole: POLES.CODE_IA.nom,
      poleId: POLES.CODE_IA.id,
      accentColor: '#e8946a',
      niveau: 'Tous profils créatifs & professionnels',
      duree: '65 pages équivalent · 6 chapitres',
      description: 'Le paradigme du Vibe Coding : comment passer d’une idée exprimée en langage naturel à un logiciel fonctionnel, ingénierie de prompt C.R.E.D., architecture modulaire, audit critique des hallucinations et déploiement.',
      baseDir: 'manuels/08-vibe-coding-ia-responsable/',
      badgeRequis: 'Badge Vibe Coding ou Membre Sahélia',
      chapitres: [
        {
          id: 'ch-01',
          numero: 1,
          titre: 'Chapitre 1 : Comprendre le Vibe Coding & les LLMs',
          fichier: 'manuels/08-vibe-coding-ia-responsable/chapitres/01_COMPRENDRE_LE_VIBE_CODING_ET_LES_LLM.md',
          schema: 'schemas/schema_01_cycle_vibe_coding.svg',
          duree: '40 min'
        },
        {
          id: 'ch-02',
          numero: 2,
          titre: 'Chapitre 2 : L\'Ingénierie du Prompt Méthodique & Standard C.R.E.D.',
          fichier: 'manuels/08-vibe-coding-ia-responsable/chapitres/02_INGENIERIE_DU_PROMPT_CRED_ET_FEW_SHOT.md',
          schema: 'schemas/schema_02_anatomie_prompt_cred_systeme.svg',
          duree: '45 min'
        },
        {
          id: 'ch-03',
          numero: 3,
          titre: 'Chapitre 3 : Architecture Modulaire & Découpage en Vibe Coding',
          fichier: 'manuels/08-vibe-coding-ia-responsable/chapitres/03_ARCHITECTURE_MODULAIRE_ET_DECOUPAGE.md',
          schema: 'schemas/schema_03_architecture_modulaire_composants.svg',
          duree: '45 min'
        },
        {
          id: 'ch-04',
          numero: 4,
          titre: 'Chapitre 4 : Audit du Code & Détection des Hallucinations',
          fichier: 'manuels/08-vibe-coding-ia-responsable/chapitres/04_AUDIT_DU_CODE_ET_DETECTION_HALLUCINATIONS.md',
          schema: 'schemas/schema_04_matrice_audit_hallucinations_code.svg',
          duree: '45 min'
        },
        {
          id: 'ch-05',
          numero: 5,
          titre: 'Chapitre 5 : Environnements Assistés, Cursor & Modèles Locaux',
          fichier: 'manuels/08-vibe-coding-ia-responsable/chapitres/05_ENVIRONNEMENTS_ASSISTES_CURSOR_ET_MODELES.md',
          schema: 'schemas/schema_05_ecosysteme_outils_vibe_coding.svg',
          duree: '50 min'
        },
        {
          id: 'ch-06',
          numero: 6,
          titre: 'Chapitre 6 : Projet Capstone · Concevoir une Application Métier par Vibe Coding',
          fichier: 'manuels/08-vibe-coding-ia-responsable/chapitres/06_PROJET_CAPSTONE_APPLICATION_VIBE_CODING.md',
          schema: 'schemas/schema_06_cycle_complet_vibe_coding_production.svg',
          duree: '55 min'
        }
      ]
    },

    'mn-09': {
      id: 'mn-09',
      type: 'manuel',
      libre: false,
      titre: 'Création Graphique & Vidéo Mobile de Terrain',
      sousTitre: 'Produire des infographies percutantes et des vidéos de vulgarisation avec son smartphone',
      pole: POLES.COMMUNICATION_CARRIERE.nom,
      poleId: POLES.COMMUNICATION_CARRIERE.id,
      accentColor: '#a855f7',
      niveau: 'Accessible à tous',
      duree: '55 pages équivalent · 6 chapitres',
      description: 'Cadrage smartphone, prise de son en milieu rural venteux, montage vidéo rythmé sur CapCut/VN, infographies de résultats agricoles sur Canva et diffusion impactante.',
      baseDir: 'manuels/09-creation-graphique-video-mobile/',
      badgeRequis: 'Membre Officiel TEAM Sahélia',
      ressources: [
        {
          nom: 'Pack Schémas Vectoriels Média & Vidéo Mobile (SVG)',
          dossier: 'manuels/09-creation-graphique-video-mobile/schemas/',
          description: '6 schémas pédagogiques officiels haute définition.'
        }
      ],
      chapitres: [
        {
          id: 'ch-01',
          numero: 1,
          titre: 'Chapitre 1 : Règles de Graphisme, Formats Réseaux & Safe Zones',
          fichier: 'manuels/09-creation-graphique-video-mobile/chapitres/01_REGLES_GRAPHISME_ET_FORMATS_RESEAUX.md',
          schema: 'schemas/schema_01_formats_et_safe_zones.svg',
          duree: '40 min'
        },
        {
          id: 'ch-02',
          numero: 2,
          titre: 'Chapitre 2 : Charte Graphique, Couleurs & Typographie d\'Impact',
          fichier: 'manuels/09-creation-graphique-video-mobile/chapitres/02_CHARTE_GRAPHIQUE_ET_TYPOGRAPHIE_CANVA.md',
          schema: 'schemas/schema_02_harmonie_couleurs_et_typographie.svg',
          duree: '35 min'
        },
        {
          id: 'ch-03',
          numero: 3,
          titre: 'Chapitre 3 : Infographies Agronomiques & Vulgarisation Scientifique',
          fichier: 'manuels/09-creation-graphique-video-mobile/chapitres/03_INFOGRAPHIES_AGRONOMIQUES_ET_VULGARISATION.md',
          schema: 'schemas/schema_03_anatomie_infographie_scientifique.svg',
          duree: '40 min'
        },
        {
          id: 'ch-04',
          numero: 4,
          titre: 'Chapitre 4 : Tournage Smartphone sur le Terrain : Cadrage & Prise de Son',
          fichier: 'manuels/09-creation-graphique-video-mobile/chapitres/04_TOURNAGE_SMARTPHONE_CADRAGE_ET_PRISE_DE_SON.md',
          schema: 'schemas/schema_04_tournage_terrain_cadrage_et_audio.svg',
          duree: '45 min'
        },
        {
          id: 'ch-05',
          numero: 5,
          titre: 'Chapitre 5 : Montage Vidéo Mobile : Rythme, CapCut & VN Editor',
          fichier: 'manuels/09-creation-graphique-video-mobile/chapitres/05_MONTAGE_VIDEO_RYTHME_CAPCUT_VN.md',
          schema: 'schemas/schema_05_timeline_montage_capcut_rythme.svg',
          duree: '45 min'
        },
        {
          id: 'ch-06',
          numero: 6,
          titre: 'Chapitre 6 : Projet Capstone · Conception & Déploiement d\'un Kit Média Complet',
          fichier: 'manuels/09-creation-graphique-video-mobile/chapitres/06_PROJET_CAPSTONE_KIT_MEDIA_CAMPAGNE.md',
          schema: 'schemas/schema_06_kit_media_multicanal_diffusion.svg',
          duree: '60 min'
        }
      ]
    },

    'mn-10': {
      id: 'mn-10',
      type: 'manuel',
      libre: false,
      titre: 'L’Agronome-Numéricien & Consultant Indépendant',
      sousTitre: 'Monétiser ses compétences, répondre à des appels d’offres et structurer son offre',
      pole: POLES.COMMUNICATION_CARRIERE.nom,
      poleId: POLES.COMMUNICATION_CARRIERE.id,
      accentColor: '#a855f7',
      niveau: 'Avancé / Fin d’études & Jeunes Diplômés',
      duree: '65 pages équivalent · 6 chapitres + Projet Capstone',
      description: 'Positionnement sur le marché ouest-africain, décodage des termes de référence (TDR), fixation de tarifs honoraires en FCFA, devis avec jalons 50-30-20 et rapports d’expertise professionnels.',
      baseDir: 'manuels/10-agronome-numericien-freelance/',
      badgeRequis: 'Membre Officiel ou Certifié TEAM Sahélia',
      ressources: [
        {
          nom: 'Pack Schémas Vectoriels Consulting & Affaires (SVG)',
          dossier: 'manuels/10-agronome-numericien-freelance/schemas/',
          description: '6 schémas pédagogiques officiels haute définition.'
        }
      ],
      chapitres: [
        {
          id: 'ch-01',
          numero: 1,
          titre: 'Chapitre 1 : Cartographier ses Compétences & Fixer ses Tarifs en FCFA',
          fichier: 'manuels/10-agronome-numericien-freelance/chapitres/01_COMPETENCES_ET_TARIFS_FCFA.md',
          schema: 'schemas/schema_01_entonnoir_prestation.svg',
          duree: '40 min'
        },
        {
          id: 'ch-02',
          numero: 2,
          titre: 'Chapitre 2 : Rédaction d\'un Devis Professionnel & Conditions de Paiement',
          fichier: 'manuels/10-agronome-numericien-freelance/chapitres/02_REDACTION_DEVIS_ET_CONDITIONS_PAIEMENT.md',
          schema: 'schemas/schema_02_anatomie_devis_pro_et_jalons.svg',
          duree: '40 min'
        },
        {
          id: 'ch-03',
          numero: 3,
          titre: 'Chapitre 3 : Répondre aux TDR & Candidater aux Appels d\'Offres d\'ONG',
          fichier: 'manuels/10-agronome-numericien-freelance/chapitres/03_REPONDRE_AUX_TDR_ET_APPELS_OFFRES.md',
          schema: 'schemas/schema_03_decodage_tdr_et_offre_technique.svg',
          duree: '45 min'
        },
        {
          id: 'ch-04',
          numero: 4,
          titre: 'Chapitre 4 : Relation Client, Gestion des Litiges & Recouvrement',
          fichier: 'manuels/10-agronome-numericien-freelance/chapitres/04_RELATION_CLIENT_LITIGES_ET_RECOUVREMENT.md',
          schema: 'schemas/schema_04_gestion_revisions_et_recouvrement.svg',
          duree: '40 min'
        },
        {
          id: 'ch-05',
          numero: 5,
          titre: 'Chapitre 5 : Personal Branding sur LinkedIn & Réseautage Professionnel',
          fichier: 'manuels/10-agronome-numericien-freelance/chapitres/05_PERSONAL_BRANDING_LINKEDIN_ET_RESEAU_BENIN.md',
          schema: 'schemas/schema_05_profil_linkedin_magnetique_consultant.svg',
          duree: '45 min'
        },
        {
          id: 'ch-06',
          numero: 6,
          titre: 'Chapitre 6 : Projet Capstone · Le Dossier Complet du Consultant Indépendant',
          fichier: 'manuels/10-agronome-numericien-freelance/chapitres/06_PROJET_CAPSTONE_DOSSIER_CONSULTANT_INDEPENDANT.md',
          schema: 'schemas/schema_06_portfolio_complet_consultant_sahelia.svg',
          duree: '60 min'
        }
      ]
    }
  };

  // Chargement des cours créés dynamiquement par l'administrateur
  try {
    if (typeof localStorage !== 'undefined') {
      const rawCustom = localStorage.getItem('sahelia_cours_custom_db');
      if (rawCustom) {
        const customObj = JSON.parse(rawCustom);
        Object.assign(CATALOGUE, customObj);
      }
    }
  } catch (e) {
    console.warn('Impossible de charger les cours personnalisés', e);
  }

  window.SaheliaCatalogue = {
    POLES,
    CATALOGUE,

    obtenirCours(id) {
      return CATALOGUE[id] || null;
    },

    listerTous() {
      return Object.values(CATALOGUE);
    },

    listerGuidesLibres() {
      return Object.values(CATALOGUE).filter((c) => c.libre === true);
    },

    listerManuelsProteges() {
      return Object.values(CATALOGUE).filter((c) => c.libre === false);
    },

    listerParPole(poleId) {
      return Object.values(CATALOGUE).filter((c) => c.poleId === poleId);
    },

    /**
     * Génère le lien direct unique pour un cours (existant ou futur)
     */
    obtenirLienPartage(coursId) {
      const base = (typeof window !== 'undefined' && window.location)
        ? window.location.href.split('?')[0].replace(/\/[^/]*$/, '')
        : 'https://aremouolivier-ops.github.io/site-team-sahelia';
      return `${base}/formation.html?cours=${encodeURIComponent(coursId)}`;
    },

    /**
     * Enregistre un nouveau cours créé par l'administrateur
     */
    ajouterCours(coursObj) {
      if (!coursObj || !coursObj.id) return { succes: false, erreur: 'ID de cours manquant' };
      CATALOGUE[coursObj.id] = coursObj;
      try {
        if (typeof localStorage !== 'undefined') {
          const rawCustom = localStorage.getItem('sahelia_cours_custom_db');
          const customs = rawCustom ? JSON.parse(rawCustom) : {};
          customs[coursObj.id] = coursObj;
          localStorage.setItem('sahelia_cours_custom_db', JSON.stringify(customs));
        }
        return {
          succes: true,
          lien: this.obtenirLienPartage(coursObj.id),
          cours: coursObj
        };
      } catch (e) {
        return { succes: false, erreur: 'Erreur lors de la sauvegarde : ' + e.message };
      }
    }
  };
})();
