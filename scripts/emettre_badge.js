#!/usr/bin/env node
/**
 * TEAM Sahélia — Outil Administratif d'Émission Sécurisée de Certifications W3C Open Badges 3.0
 * Signe numériquement les certificats avec la clé privée protégée hors ligne.
 * Format standard : JsonWebSignature2020 / RFC 7797 Detached JWS Payload
 *
 * Utilisation :
 * node scripts/emettre_badge.js --id TS-SKL-2026-005 --nom "Prénom NOM" --role "Agronome" --track "sig-parcelle" --preuve "Projet de délimitation" --validePar "Ségla Bio KPEROU"
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baseDir = path.join(__dirname, '..');
const clesDir = path.join(__dirname, 'cles');
const credentialsDir = path.join(baseDir, 'credentials');
const privateKeyFile = path.join(clesDir, 'private_key.json');

if (!fs.existsSync(privateKeyFile)) {
  console.error('❌ ERREUR : La clé privée d\'émission est introuvable dans scripts/cles/private_key.json');
  process.exit(1);
}

const privJwk = JSON.parse(fs.readFileSync(privateKeyFile, 'utf8'));
const privateKey = crypto.createPrivateKey({ format: 'jwk', key: privJwk });

const BASE_URL = 'https://aremouolivier-ops.github.io/site-team-sahelia';

// Base64URL
function base64urlEncode(octets) {
  return Buffer.from(octets).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Parser les arguments CLI
const args = process.argv.slice(2);
const params = {};
let force = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--force') {
    force = true;
  } else if (args[i].startsWith('--')) {
    const cle = args[i].replace(/^--/, '');
    params[cle] = args[i + 1];
    i++;
  }
}

const id = params.id ? String(params.id).trim().toUpperCase() : '';
const nom = params.nom ? String(params.nom).trim() : '';
const role = params.role ? String(params.role).trim() : 'Membre Certifié';
const institution = params.institution ? String(params.institution).trim() : 'TEAM Sahélia · République du Bénin';
const ALIASES = {
  'pionnier': 'membre-pionnier',
  'officiel': 'membre-officiel',
  'actif': 'membre-actif',
  'formation': 'formation-achevee',
  'sig': 'sig-parcelle',
  'data': 'data-agronomie',
  'kobo': 'kobo-collecte',
  'agro': 'agro-precision',
  'vibe': 'vibe-coding-ia',
  'drone': 'drone-terrain',
  'projet': 'projet-solution',
  'mentor': 'mentor-leadership'
};

const rawTrack = params.track ? String(params.track).trim().toLowerCase() : 'membre-pionnier';
const track = ALIASES[rawTrack] || rawTrack;
const preuve = params.preuve ? String(params.preuve).trim() : 'Évaluation pratique validée selon les critères officiels de terrain.';
const validePar = params.validePar ? String(params.validePar).trim() : 'Conseil Pédagogique TEAM Sahélia';
const slogan = params.slogan ? String(params.slogan).trim() : 'Apprendre aujourd’hui. Construire demain.';
const date = params.date ? String(params.date).trim() : new Date().toISOString().split('T')[0] + 'T00:00:00Z';

if (!id || !nom) {
  console.log(`
Usage:
  node scripts/emettre_badge.js --id <ID> --nom <Nom> [options]

Options:
  --id           Identifiant unique (format standard: TS-SKL-YYYY-XXX ou TS-MBR-YYYY-XXX) [Requis]
  --nom          Nom et prénom du titulaire [Requis]
  --role         Rôle ou spécialité (défaut: Membre Certifié)
  --track        Compétence visée: membre-pionnier | sig-parcelle | drone-terrain | vibe-coding-ia
  --institution  Institution d'attache (défaut: TEAM Sahélia · République du Bénin)
  --preuve       Description du livrable vérifié
  --validePar    Nom de l'évaluateur habilité
  --slogan       Devise ou slogan personnel
  --date         Date de validité ISO (défaut: date du jour)
  --force        Autorise l'écrasement exceptionnel d'un titre existant (Immutabilité par défaut)
`);
  process.exit(0);
}

// 1. Validation stricte du format de l'identifiant
if (!/^TS-[A-Z0-9_-]+$/.test(id)) {
  console.error(`❌ ERREUR : L'identifiant "${id}" ne respecte pas le format réglementaire (ex: TS-SKL-2026-005).`);
  process.exit(1);
}

// 2. Sécurisation anti-traversée de chemin (Path Traversal Protection)
const destPath = path.join(credentialsDir, `${id}.json`);
const destResolue = path.resolve(destPath);
const dossierAttendu = path.resolve(credentialsDir);
if (!destResolue.startsWith(dossierAttendu)) {
  console.error('❌ ERREUR DE SÉCURITÉ : Tentative de traversée de répertoire détectée.');
  process.exit(1);
}

// 3. Protection d'immutabilité : interdiction d'écrasement silencieux
if (fs.existsSync(destPath) && !force) {
  console.error(`❌ CONFLIT D'IMMUTABILITÉ : Le titre ${id} a déjà été émis dans credentials/${id}.json.`);
  console.error('Une certification délivrée ne peut être écrasée silencieusement.');
  console.error('Pour corriger un document erroné, utilisez formellement le drapeau --force.');
  process.exit(1);
}

// 4. Validation métier du titulaire et de la compétence
if (nom.length < 2 || /[<>]/.test(nom)) {
  console.error('❌ ERREUR : Le nom du titulaire est trop court ou comporte des caractères HTML interdits.');
  process.exit(1);
}

const achFile = path.join(baseDir, 'achievements', `${track}.json`);
if (!fs.existsSync(achFile)) {
  console.error(`❌ Compétence inconnue : "${track}". Fichier introuvable dans achievements/${track}.json`);
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

// 5. Construction du Verifiable Credential W3C
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

// 6. Signature cryptographique JWS détachée liant le document ET les options de preuve
const copie = JSON.parse(JSON.stringify(credential));
delete copie.proof;
const docCanonique = JSON.stringify(canonicaliserObjet(copie));
const docHash = crypto.createHash('sha256').update(docCanonique).digest('hex');

const createdDate = new Date().toISOString();
const proofConfig = {
  type: "JsonWebSignature2020",
  created: createdDate,
  verificationMethod: `${BASE_URL}/issuers/team-sahelia.json#key-1`,
  proofPurpose: "assertionMethod"
};
const proofCanonique = JSON.stringify(canonicaliserObjet(proofConfig));
const proofHash = crypto.createHash('sha256').update(proofCanonique).digest('hex');

const payloadSigne = `${docHash}:${proofHash}`;
const header = { alg: "ES256", b64: false, crit: ["b64"] };
const headerB64 = base64urlEncode(Buffer.from(JSON.stringify(header)));
const donneesASigner = Buffer.from(`${headerB64}.${payloadSigne}`, 'utf8');

const signatureIeee = crypto.sign('sha256', donneesASigner, { key: privateKey, dsaEncoding: 'ieee-p1363' });
const jws = `${headerB64}..${base64urlEncode(signatureIeee)}`;

credential.proof = {
  "type": "JsonWebSignature2020",
  "created": createdDate,
  "verificationMethod": `${BASE_URL}/issuers/team-sahelia.json#key-1`,
  "proofPurpose": "assertionMethod",
  "jws": jws
};

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
Format preuve : JsonWebSignature2020 (RFC 7797 JWS Detached)
Signature JWS : ${credential.proof.jws.slice(0, 40)}...
Lien de vérif : ${BASE_URL}/verifier.html?id=${id}
======================================================
`);
