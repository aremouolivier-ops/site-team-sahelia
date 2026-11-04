#!/usr/bin/env node
/**
 * TEAM Sahélia — Outil Administratif d'Émission Sécurisée de Certifications W3C Open Badges 3.0
 * Signe numériquement les certificats avec la clé privée protégée hors ligne.
 *
 * Utilisation :
 * node scripts/emettre_badge.js --id TS-SKL-2026-005 --nom "Prénom NOM" --role "Agronome" --track "sig-parcelle" --preuve "Projet de délimitation parcellaire validé" --validePar "Ségla Bio KPEROU"
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baseDir = path.join(__dirname, '..');
const clesDir = path.join(__dirname, 'cles');
const privateKeyFile = path.join(clesDir, 'private_key.json');

if (!fs.existsSync(privateKeyFile)) {
  console.error('❌ ERREUR : La clé privée d\'émission est introuvable dans scripts/cles/private_key.json');
  process.exit(1);
}

const privJwk = JSON.parse(fs.readFileSync(privateKeyFile, 'utf8'));
const privateKey = crypto.createPrivateKey({ format: 'jwk', key: privJwk });

const BASE_URL = 'https://aremouolivier-ops.github.io/site-team-sahelia';

// Parser les arguments CLI
const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i += 2) {
  const cle = args[i].replace(/^--/, '');
  params[cle] = args[i + 1];
}

const id = params.id;
const nom = params.nom;
const role = params.role || 'Membre Certifié';
const institution = params.institution || 'TEAM Sahélia · République du Bénin';
const track = params.track || 'membre-pionnier';
const preuve = params.preuve || 'Évaluation pratique validée selon les critères officiels de terrain.';
const validePar = params.validePar || 'Conseil Pédagogique TEAM Sahélia';
const slogan = params.slogan || 'Apprendre aujourd’hui. Construire demain.';
const date = params.date || new Date().toISOString().split('T')[0] + 'T00:00:00Z';

if (!id || !nom) {
  console.log(`
Usage:
  node scripts/emettre_badge.js --id <ID> --nom <Nom> [options]

Options:
  --id           Identifiant unique (ex: TS-SKL-2026-005) [Requis]
  --nom          Nom et prénom du titulaire [Requis]
  --role         Rôle ou spécialité (défaut: Membre Certifié)
  --track        Compétence visée: membre-pionnier | sig-parcelle | drone-terrain | vibe-coding-ia
  --institution  Institution d'attache (défaut: TEAM Sahélia)
  --preuve       Description du livrable vérifié
  --validePar    Nom de l'évaluateur habilité
  --slogan       Devise ou slogan personnel
  --date         Date de validité ISO (défaut: date du jour)
`);
  process.exit(0);
}

// Charger l'achievement canonique
const achFile = path.join(baseDir, 'achievements', `${track}.json`);
if (!fs.existsSync(achFile)) {
  console.error(`❌ Compétence inconnue : ${track}. Fichier manquant dans achievements/${track}.json`);
  process.exit(1);
}
const ach = JSON.parse(fs.readFileSync(achFile, 'utf8'));

// Canonicalisation récursive
function canonicaliserObjet(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(canonicaliserObjet);
  const trie = {};
  Object.keys(obj).sort().forEach(cle => {
    trie[cle] = canonicaliserObjet(obj[cle]);
  });
  return trie;
}

// Construire le W3C Verifiable Credential Open Badges 3.0
const credential = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"
  ],
  "id": `${BASE_URL}/credentials/${id}.json`,
  "type": ["VerifiableCredential", "OpenBadgeCredential"],
  "issuer": `${BASE_URL}/issuers/team-sahelia.json`,
  "validFrom": date,
  "name": ach.name,
  "description": ach.description,
  "credentialSubject": {
    "id": `${BASE_URL}/credentials/${id}.json#subject`,
    "type": ["AchievementSubject"],
    "name": nom,
    "role": role,
    "institution": institution,
    "slogan": slogan,
    "achievement": ach.id
  },
  "evidence": [
    {
      "type": ["Evidence"],
      "narrative": preuve,
      "evaluatedBy": validePar
    }
  ],
  "credentialStatus": {
    "id": `${BASE_URL}/status/revocations.json#${id}`,
    "type": "BitstringStatusListEntry",
    "statusPurpose": "revocation"
  }
};

// Signature cryptographique
const copie = JSON.parse(JSON.stringify(credential));
delete copie.proof;
const canonicalString = JSON.stringify(canonicaliserObjet(copie));
const dataOctets = Buffer.from(canonicalString, 'utf8');

const signatureIeee = crypto.sign('sha256', dataOctets, { key: privateKey, dsaEncoding: 'ieee-p1363' });
credential.proof = {
  "type": "JsonWebSignature2020",
  "created": new Date().toISOString(),
  "verificationMethod": `${BASE_URL}/issuers/team-sahelia.json#key-1`,
  "proofPurpose": "assertionMethod",
  "signatureValue": signatureIeee.toString('hex')
};

const destPath = path.join(baseDir, 'credentials', `${id}.json`);
fs.writeFileSync(destPath, JSON.stringify(credential, null, 2), 'utf8');

console.log(`
======================================================
✓ CERTIFICATION OFFICIELLE ÉMISE ET SIGNÉE !
======================================================
Identifiant   : ${id}
Titulaire     : ${nom} (${role})
Compétence    : ${ach.name} (${ach.level})
Évaluateur    : ${validePar}
Fichier émis  : credentials/${id}.json
Signature W3C : ${credential.proof.signatureValue.slice(0, 32)}...
Lien de vérif : ${BASE_URL}/verifier.html?id=${id}
======================================================
`);
