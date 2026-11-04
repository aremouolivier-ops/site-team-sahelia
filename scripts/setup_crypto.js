const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baseDir = path.join(__dirname, '..');
const clesDir = path.join(__dirname, 'cles');
const achievementsDir = path.join(baseDir, 'achievements');
const credentialsDir = path.join(baseDir, 'credentials');
const issuersDir = path.join(baseDir, 'issuers');
const statusDir = path.join(baseDir, 'status');

[clesDir, achievementsDir, credentialsDir, issuersDir, statusDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. Mise à jour de .gitignore pour protéger la clé privée
const gitignorePath = path.join(baseDir, '.gitignore');
let gitignore = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';
if (!gitignore.includes('scripts/cles')) {
  gitignore += '\n# Clés cryptographiques privées d\'émission (Strictement confidentiel)\nscripts/cles/\n';
  fs.writeFileSync(gitignorePath, gitignore, 'utf8');
  console.log('✓ .gitignore mis à jour pour exclure scripts/cles/');
}

// 2. Génération / Chargement de la clé P-256
const privateKeyFile = path.join(clesDir, 'private_key.json');
let keyPair;

if (fs.existsSync(privateKeyFile)) {
  const privJwk = JSON.parse(fs.readFileSync(privateKeyFile, 'utf8'));
  const privKey = crypto.createPrivateKey({ format: 'jwk', key: privJwk });
  const pubKey = crypto.createPublicKey(privKey);
  keyPair = {
    privateKey: privKey,
    publicKey: pubKey,
    privJwk: privJwk,
    pubJwk: pubKey.export({ format: 'jwk' })
  };
  console.log('✓ Clé cryptographique existante chargée avec succès.');
} else {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'P-256'
  });
  const privJwk = privateKey.export({ format: 'jwk' });
  const pubJwk = publicKey.export({ format: 'jwk' });
  fs.writeFileSync(privateKeyFile, JSON.stringify(privJwk, null, 2), 'utf8');
  keyPair = { privateKey, publicKey, privJwk, pubJwk };
  console.log('✓ Nouvelle paire de clés asymétriques ECDSA P-256 générée.');
}

const BASE_URL = 'https://aremouolivier-ops.github.io/site-team-sahelia';

// 3. Profil officiel de l'Émetteur (W3C Issuer Profile)
const issuerProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"
  ],
  "id": `${BASE_URL}/issuers/team-sahelia.json`,
  "type": ["Profile"],
  "name": "TEAM Sahélia · Communauté Panafricaine d'Agronomie, Technologies & Innovation",
  "url": `${BASE_URL}/`,
  "email": "teamsahelia@gmail.com",
  "telephone": "+229 40 73 84 69",
  "description": "Organisation communautaire œuvrant pour l'émancipation technique et scientifique de la jeunesse ouest-africaine en agronomie numérique, géomatique SIG, drones et génie logiciel.",
  "publicKey": {
    "id": `${BASE_URL}/issuers/team-sahelia.json#key-1`,
    "type": "JsonWebKey2020",
    "controller": `${BASE_URL}/issuers/team-sahelia.json`,
    "publicKeyJwk": keyPair.pubJwk
  }
};

fs.writeFileSync(path.join(issuersDir, 'team-sahelia.json'), JSON.stringify(issuerProfile, null, 2), 'utf8');
console.log('✓ issuers/team-sahelia.json généré avec clé publique JWK.');

// 4. Définitions canoniques des 4 Compétences (Achievements immuables)
const ACHIEVEMENTS = {
  'membre-pionnier': {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"
    ],
    "id": `${BASE_URL}/achievements/membre-pionnier.json`,
    "type": ["Achievement"],
    "name": "Membre Pionnier · Communauté TEAM Sahélia",
    "description": "Reconnaissance d'engagement fondateur, de participation active aux travaux d'entraide communautaire et d'adhésion formelle à la charte de partage libre des savoirs scientifiques.",
    "achievementType": "Membership",
    "criteria": {
      "narrative": "1. Inscription et identification officielle au registre TEAM Sahélia ; 2. Participation régulière aux sessions d'entraide et d'apprentissage ; 3. Respect de la charte d'éthique communautaire."
    },
    "creator": `${BASE_URL}/issuers/team-sahelia.json`,
    "track": "pionnier",
    "level": "Bronze · Foundation",
    "shape": "pentagone",
    "accentColor": "#cd7f32"
  },
  'sig-parcelle': {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"
    ],
    "id": `${BASE_URL}/achievements/sig-parcelle.json`,
    "type": ["Achievement"],
    "name": "Praticien SIG & Cartographie Parcellaire (QGIS & GPS)",
    "description": "Capacité opérationnelle démontrée sur le terrain : acquisition GPS smartphone stabilisée, import et projection métrique UTM 31N sous QGIS, calcul vectoriel de superficie en hectares et production d'une carte d'essai conforme aux normes de publication.",
    "achievementType": "Certificate",
    "criteria": {
      "narrative": "1. Relevé de 4 sommets minimum au GPS smartphone avec pause stabilisée (précision < 4m) ; 2. Import CSV sous QGIS et projection métrique UTM zone 31N (EPSG:32631) ; 3. Numérisation vectorielle du polygone et calcul de surface en hectares ($area / 10000) ; 4. Export d'une carte d'essai normalisée 300 DPI avec orientation Nord, échelle graphique et fond cartographique vérifié."
    },
    "creator": `${BASE_URL}/issuers/team-sahelia.json`,
    "track": "sig",
    "level": "Argent · Practitioner",
    "shape": "hexagone",
    "accentColor": "#94a3b8"
  },
  'drone-terrain': {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"
    ],
    "id": `${BASE_URL}/achievements/drone-terrain.json`,
    "type": ["Achievement"],
    "name": "Opérateur Drone & Télédétection Agricole (Pratique Évaluée)",
    "description": "Maîtrise pratique du pilotage de drone civil en Mode 2, exécution de plans de vol automatisés pour la photogrammétrie agricole, respect strict de la sécurité aérienne et traitement des orthomosaïques NDVI.",
    "achievementType": "Certificate",
    "criteria": {
      "narrative": "1. Check-list pré-vol, calibration compas/IMU et respect des règles de sécurité aéronautique ; 2. Pilotage manuel Mode 2 avec atterrissage de précision sur cible ; 3. Programmation de mission photogrammétrique automatisée (GSD < 2,5 cm/px) ; 4. Génération d'orthomosaïque et calcul d'indices de végétation multispectrale NDVI."
    },
    "creator": `${BASE_URL}/issuers/team-sahelia.json`,
    "track": "drone",
    "level": "Or · Specialist",
    "shape": "ecusson",
    "accentColor": "#e8946a"
  },
  'vibe-coding-ia': {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"
    ],
    "id": `${BASE_URL}/achievements/vibe-coding-ia.json`,
    "type": ["Achievement"],
    "name": "Vibe Coding & Ingénieur Solutions IA",
    "description": "Conception, développement assisté par IA, sécurisation et déploiement en production d'une solution numérique résolvant un cas d'usage concret au bénéfice de l'agronomie ou de la communauté.",
    "achievementType": "Certification",
    "criteria": {
      "narrative": "1. Prompt engineering avancé selon le standard C.R.E.D. avec vérification stricte des sources ; 2. Conception, sécurisation et déploiement d'un outil web ou script d'automatisation en production ; 3. Résolution d'un cas d'usage concret de terrain au bénéfice de la communauté ; 4. Revue de code, architecture logicielle propre et tests fonctionnels vérifiés."
    },
    "creator": `${BASE_URL}/issuers/team-sahelia.json`,
    "track": "vibe",
    "level": "Platine · Architect",
    "shape": "octogone",
    "accentColor": "#7fb0ee"
  }
};

Object.entries(ACHIEVEMENTS).forEach(([key, val]) => {
  fs.writeFileSync(path.join(achievementsDir, `${key}.json`), JSON.stringify(val, null, 2), 'utf8');
});
console.log('✓ achievements/ 4 compétences canoniques créées.');

// 5. Registre public de révocation & suspension
const revocationsList = {
  "@context": "https://www.w3.org/ns/credentials/v2",
  "id": `${BASE_URL}/status/revocations.json`,
  "type": "BitstringStatusList",
  "statusPurpose": "revocation",
  "derniereMiseAJour": "2026-11-04T00:00:00Z",
  "revocations": [],
  "suspensions": []
};
fs.writeFileSync(path.join(statusDir, 'revocations.json'), JSON.stringify(revocationsList, null, 2), 'utf8');
console.log('✓ status/revocations.json initialisé.');

// Base64URL
function base64urlEncode(octets) {
  return Buffer.from(octets).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Fonction de canonicalisation déterministe récursive
function canonicaliserObjet(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(canonicaliserObjet);
  }
  const trie = {};
  Object.keys(obj).sort().forEach(cle => {
    trie[cle] = canonicaliserObjet(obj[cle]);
  });
  return trie;
}

// 6. Fonction de signature canonique pour les attestations individuelles (Format JWS détaché RFC 7797)
function signerDocument(payload, privateKey) {
  const copie = JSON.parse(JSON.stringify(payload));
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

  // Signature ECDSA P-256 avec encodage IEEE P1363 (64 octets natif WebCrypto)
  const signatureIeee = crypto.sign('sha256', donneesASigner, { key: privateKey, dsaEncoding: 'ieee-p1363' });
  const jws = `${headerB64}..${base64urlEncode(signatureIeee)}`;

  copie.proof = {
    "type": "JsonWebSignature2020",
    "created": createdDate,
    "verificationMethod": `${BASE_URL}/issuers/team-sahelia.json#key-1`,
    "proofPurpose": "assertionMethod",
    "jws": jws
  };
  return copie;
}

// 7. Émission des 4 certifications officielles des fondateurs avec dates réelles & preuves
const CREDENTIALS_INIT = [
  {
    id: 'TS-SKL-2026-001',
    validFrom: '2026-01-15T00:00:00Z',
    achievementKey: 'vibe-coding-ia',
    beneficiaireNom: 'Olivier AREMOU',
    beneficiaireRole: 'Fondateur & Ingénieur Solutions Tech',
    institution: 'TEAM Sahélia · République du Bénin',
    validePar: 'Pôle Innovation TEAM Sahélia',
    preuveProjet: 'Architecture, développement et déploiement de la plateforme officielle TEAM Sahélia (manuels, studio, lecteur immersif).',
    slogan: 'Apprendre aujourd’hui. Construire demain.'
  },
  {
    id: 'TS-SKL-2026-002',
    validFrom: '2026-01-20T00:00:00Z',
    achievementKey: 'sig-parcelle',
    beneficiaireNom: 'Ségla Bio KPEROU',
    beneficiaireRole: 'Référent SIG & Données de Terrain',
    institution: 'TEAM Sahélia · République du Bénin',
    validePar: 'Conseil Pédagogique TEAM Sahélia',
    preuveProjet: 'Cartographie parcellaire UTM zone 31N et encadrement des protocoles de relevés GPS KoboToolbox.',
    slogan: 'Le terrain d’abord : la donnée géographique au service de la terre.'
  },
  {
    id: 'TS-SKL-2026-003',
    validFrom: '2026-02-01T00:00:00Z',
    achievementKey: 'membre-pionnier',
    beneficiaireNom: 'Mariam DIALLO',
    beneficiaireRole: 'Chargée de Communauté & Partenariats',
    institution: 'TEAM Sahélia · République du Bénin',
    validePar: 'Olivier AREMOU (Coordinateur Général)',
    preuveProjet: 'Animation du réseau d’adhérents et organisation des cycles d’entraide collaborative sur le forum WhatsApp.',
    slogan: 'L’entraide et le réseau font grandir les compétences.'
  },
  {
    id: 'TS-SKL-2026-004',
    validFrom: '2026-02-10T00:00:00Z',
    achievementKey: 'membre-pionnier',
    beneficiaireNom: 'Amina CHABI',
    beneficiaireRole: 'Référente Pédagogique & Méthodologie',
    institution: 'TEAM Sahélia · République du Bénin',
    validePar: 'Olivier AREMOU (Coordinateur Général)',
    preuveProjet: 'Conception des fiches mémo et contrôle qualité pédagogique des manuels méthodologiques.',
    slogan: 'Rigueur scientifique, clarté méthodologique et impact concret.'
  }
];

CREDENTIALS_INIT.forEach(item => {
  const ach = ACHIEVEMENTS[item.achievementKey];
  const doc = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"
    ],
    "id": `${BASE_URL}/credentials/${item.id}.json`,
    "type": ["VerifiableCredential", "OpenBadgeCredential"],
    "issuer": `${BASE_URL}/issuers/team-sahelia.json`,
    "validFrom": item.validFrom,
    "name": ach.name,
    "description": ach.description,
    "credentialSubject": {
      "id": `${BASE_URL}/credentials/${item.id}.json#subject`,
      "type": ["AchievementSubject"],
      "name": item.beneficiaireNom,
      "role": item.beneficiaireRole,
      "institution": item.institution,
      "slogan": item.slogan,
      "achievement": ach.id
    },
    "evidence": [
      {
        "type": ["Evidence"],
        "narrative": item.preuveProjet,
        "evaluatedBy": item.validePar
      }
    ],
    "credentialStatus": {
      "id": `${BASE_URL}/status/revocations.json#${item.id}`,
      "type": "BitstringStatusListEntry",
      "statusPurpose": "revocation"
    }
  };

  const docSigne = signerDocument(doc, keyPair.privateKey);
  fs.writeFileSync(path.join(credentialsDir, `${item.id}.json`), JSON.stringify(docSigne, null, 2), 'utf8');
  console.log(`✓ credentials/${item.id}.json émis et signé avec succès.`);
});

console.log('\n======================================================');
console.log('✓ FONDATIONS W3C OPEN BADGES 3.0 OPÉRATIONNELLES !');
console.log('======================================================\n');
