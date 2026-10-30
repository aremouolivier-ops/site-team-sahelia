# CHAPITRE 2 : ORGANISATION INFAILLIBLE DES FICHIERS & NOMENCLATURE ACADÉMIQUE
## En finir avec le chaos du Bureau et retrouver n’importe quel document en moins de 5 secondes

> **Manuel :** 03 — 50 Astuces & Raccourcis Informatiques du Débutant au Pro  
> **Auteurs :** Sègla Bio KPEROU, Olivier AREMOU & TEAM Sahélia  
> **Temps d’apprentissage :** 30 minutes  
> **Illustration associée :** `schemas/schema_02_arborescence_fichiers.svg`

---

## 1. Objectifs d'Impact Réel
À la fin de ce chapitre, vous saurez :
1. **Éradiquer le Bureau-poubelle** : Ne plus jamais avoir un écran d'accueil saturé de 150 fichiers éparpillés.
2. **Adopter la norme internationale de nommage ISO 8601** pour que vos fichiers se classent chronologiquement de façon automatique sans aucune intervention manuelle.
3. **Structurer un disque en 4 Piliers Clés** (Cours, Mémoire/Recherche, Données d'enquêtes, Administratif).
4. **Renommer 50 fichiers en série en 2 minutes** au clavier avec le duo magique `F2` + `Touche Tabulation`.
5. **Retrouver un document enfoui** grâce aux filtres de recherche avancée (`ext:pdf`, `taille:>15Mo`, `modifié:ce_mois`).

---

## 2. L’Arborescence en 4 Piliers : La Pyramide de Rangement

Un professionnel ou un chercheur ne sauvegarde **jamais** ses documents de travail directement sur le Bureau (`Desktop`), ni en vrac dans le dossier Téléchargements (`Downloads`). Si le système d'exploitation Windows plante ou doit être réinstallé, le Bureau et le dossier Téléchargements situés sur la partition `C:\` sont les premiers à être écrasés.

Le bon réflexe consiste à créer un dossier racine sur une partition secondaire (`D:\` ou dans un dossier synchronisé spécifique), structuré en **4 piliers numérotés** :

```text
D:\UNIVERSITE_ET_PROJETS_2026\
├── 01_COURS_ET_FORMATIONS\
│   ├── Agronomie_Generale\
│   ├── SIG_Cartographie\
│   └── Statistiques_R\
├── 02_RECHERCHE_ET_MEMOIRE\
│   ├── 01_Articles_PDF_Sources\
│   ├── 02_Redaction_Word_Versions\
│   ├── 03_Illustrations_et_Graphiques\
│   └── 04_Soutenance_PowerPoint\
├── 03_DONNEES_ET_ENQUETES\
│   ├── 01_Brut_LectureSeule\  <-- JAMAIS MODIFIÉ
│   ├── 02_Nettoye_CSV\
│   └── 03_Sorties_Analyses\
└── 04_ADMIN_CONTRATS_ET_CV\
    ├── CV_MisAJour\
    ├── Attestations_et_Badges\
    └── Releves_Notes_Diplomes\
```

![Arborescence des fichiers et nomenclature](../schemas/schema_02_arborescence_fichiers.svg)

> [!TIP]
> **Pourquoi numéroter avec 01, 02, 03 ?**  
> Les explorateurs de fichiers (Windows, macOS, Linux) trient par défaut les dossiers par ordre alphabétique. En préfixant vos dossiers par `01_`, `02_`, `03_`, vous maîtrisez l'ordre logique d'affichage sans qu'un dossier accessoire vienne se glisser en haut de liste.

---

## 3. La Règle d'Or du Nommage : La Norme ISO 8601

### Les erreurs toxiques fréquentes
Observez ces noms de fichiers classiques chez les étudiants :
* ❌ `memoire.docx` (Quel mémoire ? De quelle année ? Quel chapitre ?)
* ❌ `memoire_final.docx`
* ❌ `memoire_final_v2.docx`
* ❌ `memoire_final_vrai_avec_corrections_professeur.docx`
* ❌ `tableau 1 sans titre (3).xlsx`

Ces noms provoquent immanquablement l'envoi de la mauvaise version au maître de mémoire ou l'impression d'un fichier non corrigé le jour du dépôt officiel.

### Le Modèle Professionnel Universel
Adoptez scrupuleusement la structure suivante :
$$\text{AAAA-MM-JJ\_Projet\_Objet\_Version.extension}$$

* **AAAA-MM-JJ :** Année sur 4 chiffres, Mois sur 2 chiffres, Jour sur 2 chiffres (norme ISO 8601).
* **Projet :** Nom du projet ou du cours (ex: `Memoire_Parakou`, `Enquete_Coton`).
* **Objet :** Ce que contient réellement le fichier (ex: `Chapitre1_Introduction`, `DonneesBrutes`).
* **Version :** Numéro incrémental strict (ex: `v1.0`, `v1.1`, `v2.0`).

**Exemples concrets conformes :**
* `2026-10-30_Memoire_Parakou_CadreTheorique_v1.2.docx`
* `2026-10-30_Enquete_Mais_DonneesBrutes_v1.0.csv`
* `2026-10-30_Soutenance_Jury_Support_v2.0.pptx`

> [!IMPORTANT]
> **Pourquoi le format AAAA-MM-JJ est supérieur à JJ-MM-AAAA ?**  
> Si vous écrivez `30-10-2026` puis `05-11-2026`, l'ordinateur placera `05-11` avant `30-10` car 05 vient avant 30 dans l'alphabet.  
> En écrivant `2026-10-30` puis `2026-11-05`, le tri numérique respecte **parfaitement la chronologie réelle** d'année en année.

---

## 4. Renommer en Série sans Souris : L'enchaînement `F2` + `Tab`

Renommer 20 photos d'enquêtes ou 15 fichiers scannés par un clic droit est une perte de temps intolérable.

**La méthode éclair :**
1. Dans l'Explorateur Windows, sélectionnez le premier fichier avec les touches fléchées.
2. Appuyez sur la touche **`F2`** : le nom du fichier passe en surbrillance pour modification.
3. Tapez votre nouveau nom normé (ex: `2026-10-30_Photo_Parcelle_01`).
4. **N'appuyez PAS sur Entrée !** Appuyez sur la touche **`Tab` (Tabulation)** :
   * Le nouveau nom est validé instantanément.
   * Le focus passe automatiquement au fichier suivant en surbrillance d'édition !
5. Tapez le nom du fichier 02, réappuyez sur `Tab`, et ainsi de suite.
6. En moins de 60 secondes, 25 fichiers sont parfaitement renommés sans avoir touché la souris une seule fois.

---

## 5. Recherche Chirurgicale dans Windows (`Win + S`)

Lorsque vous avez des milliers de documents, utiliser la barre de recherche avec des mots vagues donne des centaines de résultats inutiles. Utilisez les **opérateurs de filtrage Windows** :

| Syntaxe de Recherche | Résultat Précis | Cas d'Usage |
| :--- | :--- | :--- |
| `ext:pdf rendement` | Cherche uniquement les fichiers PDF contenant le mot "rendement". | Évite de ressortir les pages web ou fichiers Word. |
| `ext:xlsx taille:>5Mo` | Trouve les tableurs Excel lourds qui occupent de la place. | Identifier les bases de données d'enquêtes volumineuses. |
| `sorte:dossier "Parakou"` | Recherche exclusivement les répertoires contenant "Parakou". | Retrouver un dossier sans voir les 500 fichiers qu'il contient. |
| `date:cette semaine` | Affiche tous les fichiers modifiés au cours des 7 derniers jours. | Retrouver le document sur lequel vous travailliez hier. |

---

## 6. Atelier Pratique : Remettre de l'Ordre en 5 Minutes

1. Ouvrez l'Explorateur de fichiers (`Win + E`).
2. Allez sur votre partition de travail (ou dans `Documents`).
3. Créez votre dossier racine `2026_UNIVERSITE_ET_PROJETS` (`Ctrl + Maj + N`).
4. Créez à l'intérieur les 4 dossiers clés : `01_COURS`, `02_RECHERCHE_ET_MEMOIRE`, `03_DONNEES_TERRAIN`, `04_ADMIN_ET_CV`.
5. Prenez 5 fichiers dispersés sur votre bureau ou dans vos téléchargements. Renommez-les avec la norme `AAAA-MM-JJ_Sujet_v1.0` avec `F2` + `Tab`.
6. Glissez-les dans leurs dossiers respectifs.

---

## 7. Fiche Mémo Récapitulative Détachable

```text
================================================================================
          FICHE MÉMO · NOMENCLATURE & CLASSEMENT PROFESSIONNEL
================================================================================
1. STRUCTURE PYRAMIDALE :
   - 01_COURS / 02_RECHERCHE / 03_DONNEES / 04_ADMIN

2. NORME ISO 8601 UNIVERSELLE :
   - AAAA-MM-JJ_Projet_Etape_Version.ext
   - Exemple : 2026-10-30_Rapport_Stage_Parakou_v1.0.docx

3. DUO CLAVIER DE RENOMMAGE :
   - F2 : Édite le nom du fichier sélectionné.
   - Touche Tabulation : Valide et passe directement au fichier suivant.

4. SÉCURITÉ DES DONNÉES DE TERRAIN :
   - Toujours conserver un sous-dossier 01_Brut_LectureSeule jamais modifié !
================================================================================
TEAM Sahélia · Apprendre. Créer. Innover.
================================================================================
```
