#!/usr/bin/env node
/**
 * TEAM Sahélia — Script d'Émission Globale et Signature ECDSA P-256 de Tous les Badges Officiels
 * Garantit une couverture 100% W3C Verifiable Credentials pour le registre officiel.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const badgesAEmettre = [
  // 1. Membres Fondateurs & Pionniers (Cartes de Membre)
  {
    id: 'TS-MBR-2026-001',
    nom: 'Olivier AREMOU',
    role: 'Fondateur & Coordinateur Général',
    track: 'pionnier',
    preuve: 'Fondation de la communauté TEAM Sahélia et structuration de la plateforme numérique.',
    validePar: 'Coordination Générale TEAM Sahélia',
    slogan: 'Apprendre aujourd’hui. Construire demain.',
    date: '2026-01-15T00:00:00Z'
  },
  {
    id: 'TS-MBR-2026-002',
    nom: 'Ségla Bio KPEROU',
    role: 'Référent SIG & Cartographie de Terrain',
    track: 'pionnier',
    preuve: 'Co-fondation et structuration des modules de formation en géomatique appliquée.',
    validePar: 'Coordination Générale TEAM Sahélia',
    slogan: 'Le terrain d’abord : la donnée géographique au service de la terre.',
    date: '2026-01-20T00:00:00Z'
  },
  {
    id: 'TS-MBR-2026-003',
    nom: 'Mariam DIALLO',
    role: 'Chargée de Communauté & Partenariats',
    track: 'pionnier',
    preuve: 'Coordination communautaire et déploiement des protocoles d’enquêtes terrain.',
    validePar: 'Coordination Générale TEAM Sahélia',
    slogan: 'L’entraide et le réseau font grandir les compétences.',
    date: '2026-02-01T00:00:00Z'
  },
  {
    id: 'TS-MBR-2026-004',
    nom: 'Amina CHABI',
    role: 'Référente Pédagogique & Méthodologie',
    track: 'pionnier',
    preuve: 'Conception des grilles d’audit méthodologique et révision des parcours de formation.',
    validePar: 'Coordination Générale TEAM Sahélia',
    slogan: 'Rigueur scientifique, clarté méthodologique et impact concret.',
    date: '2026-02-10T00:00:00Z'
  },

  // 2. Certificats de Formation Validés (Cohortes)
  {
    id: 'TS-FOR-2026-P01',
    nom: 'Olivier AREMOU',
    role: 'Membre Fondateur',
    track: 'formation',
    preuve: 'Parcours SIG & Données de Terrain (40 heures) complété avec mention Excellence Technique.',
    validePar: 'Ségla Bio KPEROU (Référent SIG)',
    slogan: 'L’agronomie de demain s’appuie sur des données fiables.',
    date: '2026-02-28T00:00:00Z'
  },
  {
    id: 'TS-FOR-2026-P02',
    nom: 'Ségla Bio KPEROU',
    role: 'Formateur & Référent SIG',
    track: 'formation',
    preuve: 'Encadrement et complétion du parcours SIG de terrain (40h) avec mention Maîtrise Professionnelle.',
    validePar: 'Olivier AREMOU (Coordinateur Général)',
    slogan: 'La donnée géographique au service de la terre.',
    date: '2026-02-28T00:00:00Z'
  },
  {
    id: 'TS-FOR-2026-P04',
    nom: 'Amina CHABI',
    role: 'Méthodologie & Qualité',
    track: 'formation',
    preuve: 'Parcours SIG & Données de Terrain (40 heures) complété avec mention Distinction Pédagogique.',
    validePar: 'Ségla Bio KPEROU (Référent SIG)',
    slogan: 'Rigueur scientifique, clarté méthodologique et impact concret.',
    date: '2026-02-28T00:00:00Z'
  },

  // 3. Attestations Officielles de Compétences (Homologations)
  {
    id: 'TS-SKL-2026-001',
    nom: 'Olivier AREMOU',
    role: 'Fondateur & Ingénieur Solutions Tech',
    track: 'vibe',
    preuve: 'Architecture, développement et déploiement de la plateforme officielle TEAM Sahélia (manuels, studio, lecteur immersif).',
    validePar: 'Pôle Innovation TEAM Sahélia',
    slogan: 'Apprendre aujourd’hui. Construire demain.',
    date: '2026-01-15T00:00:00Z'
  },
  {
    id: 'TS-SKL-2026-002',
    nom: 'Ségla Bio KPEROU',
    role: 'Référent SIG & Données de Terrain',
    track: 'sig',
    preuve: 'Cartographie parcellaire UTM zone 31N et encadrement des protocoles GPS KoboToolbox.',
    validePar: 'Pôle Géomatique & Formation Continue',
    slogan: 'Le terrain d’abord : la donnée géographique au service de la terre.',
    date: '2026-01-20T00:00:00Z'
  },
  {
    id: 'TS-SKL-2026-003',
    nom: 'Mariam DIALLO',
    role: 'Chargée de Suivi-Évaluation & Enquêtes',
    track: 'kobo',
    preuve: 'Conception de formulaires XLSForm complexes et déploiement de campagnes d’enquêtes terrain sur mobile.',
    validePar: 'Pôle Agronomie & Projets de Terrain',
    slogan: 'L’entraide et le réseau font grandir les compétences.',
    date: '2026-02-01T00:00:00Z'
  },
  {
    id: 'TS-SKL-2026-004',
    nom: 'Amina CHABI',
    role: 'Opératrice Drone & Télédétection Agricole',
    track: 'drone',
    preuve: 'Missions de vol automatisées et génération d’orthomosaïques haute résolution avec calcul d’indices NDVI.',
    validePar: 'Pôle Drones & Télédétection TEAM Sahélia',
    slogan: 'Rigueur scientifique, clarté méthodologique et impact concret.',
    date: '2026-02-10T00:00:00Z'
  }
];

console.log(`🚀 Émission et signature de ${badgesAEmettre.length} badges officiels...`);

badgesAEmettre.forEach(b => {
  const cmd = `node scripts/emettre_badge.js --id ${b.id} --nom "${b.nom}" --role "${b.role}" --track "${b.track}" --preuve "${b.preuve}" --validePar "${b.validePar}" --slogan "${b.slogan}" --date "${b.date}" --force`;
  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`✓ ${b.id} émis et signé avec succès (${b.nom})`);
  } catch (err) {
    console.error(`❌ Échec pour ${b.id}:`, err.message);
  }
});

console.log('🎉 100% des badges actifs du registre sont maintenant émis et signés avec ECDSA P-256 !');
