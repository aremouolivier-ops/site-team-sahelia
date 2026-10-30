# Plateforme Officielle & Espace Communauté · TEAM Sahélia

Bienvenue sur le projet web officiel et indépendant de **TEAM Sahélia**.

---

## 🚀 Comment lancer et tester le site en local

1. **Ouverture immédiate (Sans installation ni serveur) :**
   Double-cliquez simplement sur le fichier [`index.html`](file:///C:/Users/DELL/Desktop/site-team-sahelia/index.html) pour l'ouvrir dans votre navigateur (Chrome, Edge, Firefox).

2. **Portail de Vérification des Badges :**
   Ouvrez [`verifier.html`](file:///C:/Users/DELL/Desktop/site-team-sahelia/verifier.html) ou scannez directement le QR code d'un badge généré avec l'appareil photo de votre smartphone.

3. **Avec un serveur local (Optionnel) :**
   Si vous avez Python d'installé, ouvrez un terminal dans ce dossier et lancez :
   ```bash
   python -m http.server 8080
   ```
   Puis rendez-vous sur : `http://localhost:8080`

---

## 📇 Le Système de Badges Authentifiés (3 Types d'Usage Réel)

Le générateur ne se limite pas à des variantes graphiques : il est relié au registre officiel de TEAM Sahélia (`js/badge-data.js`).

### 1. 👤 Badge de Membre (Appartenance)
* **Usage :** Identifie un membre actif de la communauté TEAM Sahélia.
* **Visuel :** Fond vert profond d'appartenance (`#081a14`), signature émeraude et terracotta, anneau d'honneur pour la photo ou les initiales, 4 icônes vectorielles du manifeste (Agronomie, SIG, Tech, Communauté).
* **Données réelles :** Nom, rôle, institution (`FA-UP Parakou`), date d'adhésion et identifiant unique stable (`TS-MBR-2026-001`).
* **QR Code :** 100% scannable, ouvre la fiche officielle du membre sur `verifier.html`.

### 2. 🎓 Badge de Formation & Cohorte
* **Usage :** Certifie l'inscription ou la réussite d'un participant à une cohorte de formation précise.
* **Visuel :** Accent bleu royal (`#2563eb`), cartouche de cohorte, période, pôle et icône de mortier académique.
* **Données réelles :** Intitulé officiel du cours (ex: *Cartographie Parcellaire Smartphone & QGIS*), nom de la cohorte (*Cohorte Alpha FA-UP*), formateur référent (*Sègla Bio KPEROU*), et **statut explicite vérifié** :
  - `✓ FORMATION COMPLÉTÉE · VALIDÉ` (coche verte)
  - `⏳ APPRENTISSAGE EN COURS` (ambre)
  - `• INSCRIT & CONFIRMÉ` (bleu ciel)
* **Génération en série (Lot) :** Un clic sur **« ⚡ Générer le lot de la cohorte »** génère instantanément tous les badges individuels de la promotion et les télécharge dans un fichier `.zip` prêt à distribuer.

### 3. 🏆 Badge de Compétence & Réalisation
* **Usage :** Atteste d'une compétence pratique démontrée et évaluée sur projet de terrain réel.
* **Visuel :** **Variante claire prestigieuse** (fond ivoire marbré, cadre or et vert forêt, médaille d'honneur vectorielle).
* **Rigueur :** N'emploie le terme de validation que sur la base des critères officiels contrôlés :
  - Relevé de 4 sommets stabilisés au GPS smartphone (< 4m)
  - Import CSV et projection métrique UTM zone 31N (EPSG:32631)
  - Calcul de superficie en hectares ($area / 10000) sous QGIS
  - Export de carte normalisée aux normes académiques
* **Sécurité :** Identifiant `TS-SKL-2026-001`. Comprend également un test de révocation démontrant qu'un badge invalidé (`TS-SKL-2026-REVOKED`) affiche explicitement une alerte rouge de non-conformité.

---

## 🖨️ Export PNG HD & Fiche A4 Imprimable (PDF)

* **PNG Haute Définition :** Fichier exporté au pixel près (720×1150 px vertical ou 1080×1080 px carré).
* **Fiche Imprimable A4 (PDF) :** Le bouton **« 🖨️ Fiche A4 (PDF) »** prépare automatiquement une page d'impression normalisée au format A4 avec :
  - Dimensions de tour de cou réelles (échelle 100%)
  - Repères de découpe pointillés pour massicot ou ciseaux
  - Consignes de scan officielles pour les jurys et évaluateurs

---

## 📦 Organisation des Fichiers

* **`index.html`** : Plateforme officielle, manifeste, vitrine de l'équipe, fil d'actualités et Studio de Badges à 3 onglets.
* **`verifier.html`** : Portail officiel d'authentification et de contrôle de conformité des badges (cible des QR codes).
* **`css/style.css`** : Design system officiel et règles d'impression A4 (`@media print`).
* **`js/badge-data.js`** : Registre centralisé des membres, formations, cohortes, compétences et attributions.
* **`js/badge-engine.js`** : Moteur Canvas 2D vectoriel pur (icônes dessinées au trait, vagues signatures, QR codes réels).
* **`js/qrcode.min.js`** : Générateur autonome de matrice QR Code ISO/CEI 18004 (zéro dépendance externe).
* **`js/jszip.min.js`** : Moteur de compression pour l'export en série des cohortes (.zip).
* **`js/app.js`** : Contrôleur applicatif, persistance et console privée.
* **`guides/`** : Les 3 mini-guides pratiques en libre accès (Word/Excel, GPS/QGIS, IA & Vibe Coding).
* **`assets/`** : Logo vectoriel officiel et badges modèles.

---

## 🔒 Accès à la Console Privée de l'Éditeur

1. Descendez tout en bas de la page (pied de page).
2. Cliquez sur la petite icône de cadenas 🔒 à droite.
3. Saisissez le mot de passe éditeur : `sahelia2026`.
4. Vous pouvez gérer les membres de l'équipe, réordonner le trombinoscope et modifier le lien d'invitation WhatsApp public.
