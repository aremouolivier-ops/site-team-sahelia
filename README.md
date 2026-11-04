# 🌾 TEAM Sahélia — Plateforme Officielle & Système de Badges Certifiés

> **Communauté Panafricaine des Praticiens du Numérique & de l’Agronomie**  
> Formations professionnelles, manuels stratégiques, cartographie de précision et certification numérique décentralisée.

---

## 🚀 Démarrage Rapide

1. **Cloner ou ouvrir le projet :**
   ```bash
   cd site-team-sahelia
   ```

2. **Lancer le serveur local de développement :**
   ```bash
   node server.js
   ```
   Puis rendez-vous sur : `http://localhost:8080`

---

## 📇 Système de Certification W3C Open Badges 3.0 (Verifiable Credentials)

Le système de certification de TEAM Sahélia repose sur les spécifications internationales **W3C Verifiable Credentials Data Model v2.0** et **1EdTech Open Badges v3.0**, avec vérification cryptographique mathématique décentralisée exécutable directement dans le navigateur client via **Web Cryptography API (ECDSA P-256 / SHA-256)** sans dépendance de serveur payant ou base de données externe.

### 4 Formats Déclaratifs Disponibles :
1. **🏅 Insigne Open Badge 3.0 (800×800 px) :** Géométrie héraldique vectorielle pure (Pentagone, Hexagone, Écusson, Octogone), biseau métallique 3D or/argent/bronze/platine, icône métier et aura d'honneur.
2. **🪪 Paysage CR80 (1000×500 px) :** Carte d'identité et attestation professionnelle avec photo/initiales, QR code scannable, puce d'état et critères.
3. **🏷️ Tour de Cou Événementiel (720×1150 px) :** Badge vertical d'atelier ou de conférence avec repères et passe-cordon.
4. **📸 Carré Réseaux Sociaux (1080×1080 px) :** Format optimisé pour les publications LinkedIn, WhatsApp, X et portfolios.

### 3 Niveaux d'Usage Réel :
* **👤 1. Badge de Membre (Appartenance) :** Identifie un membre actif ou pionnier de la communauté TEAM Sahélia.
* **🎓 2. Badge de Formation & Cohorte :** Atteste du suivi ou de la complétion d'un programme de formation avec cohorte datée.
* **🏆 3. Certification de Compétence Évaluée :** Certifie la maîtrise technique contrôlée sur projet réel de terrain (ex: *Cartographie Parcellaire QGIS*, *Opérateur Drone & Télédétection*, *Vibe Coding & Ingénieur Solutions IA*).

### 🔍 Portail Public de Vérification Décentralisée (`verifier.html`)
* **Accès 100% public :** N'exige aucun compte administrateur ni mot de passe.
* **Audit mathématique en temps réel :** Télécharge le document justificatif `credentials/{id}.json` et vérifie la signature numérique auprès de la clé publique officielle de TEAM Sahélia (`issuers/team-sahelia.json#key-1`) au standard **W3C JsonWebSignature2020 / RFC 7797 Detached JWS**.
* **Registre de révocation à 3 états (Fail-Closed) :** Contrôle instantané contre `status/revocations.json` (`VALIDE`, `REVOQUE`, `SUSPENDU`, `STATUT_INCONNU`). En cas de rupture réseau, la politique stricte de sécurité n'accorde jamais de statut vert permissif.
* **Titre opposable & Représentation graphique :** Seul le document Verifiable Credential W3C signé fait juridiquement foi ; le rendu graphique (Canvas/PNG) constitue une représentation visuelle illustrative d'accompagnement.
* **Audit hors-ligne :** Permet à tout recruteur ou institution de glisser-déposer un fichier Verifiable Credential (`.json`) pour en certifier l'intégrité sans transmission réseau.

---

## 📚 Espace Formation & Bibliothèque Stratégique

* **5 Mini-Guides Pratiques (Libres & Gratuits) :**
  1. *Urgence Mémoire & Rapport Académique* (Word & Excel)
  2. *Tracer sa Parcelle Agricole au GPS Smartphone & QGIS*
  3. *Vibe Coding, IA & Prompts de Recherche*
  4. *Collecte Mobile de Données de Terrain avec KoboToolbox*
  5. *Création Graphique & Affiches Professionnelles*
* **12 Manuels Stratégiques de Référence (4 Pôles Métiers) :**
  - **Pôle Bureautique & Données :** Manuel 01 (Excel), Manuel 02 (Word/PowerPoint), Manuel 03 (50 Astuces Informatiques), Manuel 04 (R & RStudio).
  - **Pôle Agronomie & SIG :** Manuel 05 (Collecte Mobile KoboToolbox), Manuel 06 (SIG & Cartographie), Manuel 11 (Pilotage de Drones & Télédétection Agricole).
  - **Pôle Innovation & IA :** Manuel 07 (Développement Web Moderne), Manuel 08 (Vibe Coding & IA), Manuel 12 (Création Vidéo & IA).
  - **Pôle Freelance & Entrepreneuriat :** Manuel 09 (Création Graphique & Vidéo Mobile), Manuel 10 (L’Agronome-Numéricien Indépendant).

---

## 📦 Organisation des Fichiers Clés

* **`index.html`** : Plateforme officielle, manifeste, équipe, fil d'actualités et Studio de Badges à 4 formats.
* **`verifier.html`** : Portail public d'authentification cryptographique et de contrôle de conformité.
* **`formation.html`** : Plateforme interactive de formation, lecture des guides libres et déverrouillage sécurisé des manuels.
* **`achievements/`** : Définitions canoniques W3C des compétences (`membre-pionnier.json`, `sig-parcelle.json`, `drone-terrain.json`, `vibe-coding-ia.json`).
* **`credentials/`** : Verifiable Credentials W3C signés mathématiquement (`TS-SKL-2026-001.json` à `004.json`).
* **`issuers/`** : Profil d'émetteur officiel et clé publique ECDSA P-256 (`team-sahelia.json`).
* **`status/`** : Registre public des révocations (`revocations.json`).
* **`js/badge-crypto.js`** : Moteur de vérification cryptographique W3C via Web Crypto API.
* **`js/badge-data.js`** : Registre déclaratif centralisé des membres, compétences et cohortes.
* **`js/badge-engine.js`** : Moteur de rendu Canvas 2D vectoriel pour les 4 formats.
* **`scripts/emettre_badge.js`** : Outil CLI d'émission et de signature cryptographique de nouvelles certifications.

---

## 🛡️ Sécurité & Confidentialité

* **Clé Privée d'Émission :** Stockée localement dans `scripts/cles/private_key.json` et strictement exclue de git via `.gitignore`.
* **Zero Tracker / Zero Server Cost :** Déployable à 100% sur GitHub Pages avec intégrité cryptographique garantie.
