# CHAPITRE 4 : LA PUISSANCE DU FORMAT XLSFORM SOUS EXCEL
## Concevoir des enquêtes professionnelles massives et multilingues dans un tableur

> **Manuel :** 05 — KoboToolbox & Collecte Numérique de Terrain sur Smartphone  
> **Auteurs :** Sègla Bio KPEROU, Olivier AREMOU & TEAM Sahélia  
> **Temps d’apprentissage :** 45 minutes de lecture active + 35 minutes de conception sous Excel  
> **Illustration associée :** `schemas/schema_04_structure_tableur_xlsform.svg`

---

## 1. Objectifs d'Impact Réel
À la fin de ce chapitre, vous saurez :
1. **Comprendre le standard international XLSForm**, adopté par l'ONU, la FAO, le CIRAD et la Banque Mondiale.
2. **Créer un classeur Excel structuré en 3 feuilles** obligatoires (`survey`, `choices`, `settings`).
3. **Paramétrer des enquêtes de plus de 100 questions en quelques minutes** par copier-coller sans subir la lenteur de la souris.
4. **Traduire votre questionnaire en langues locales** (ex : Français et Bariba ou Fon) via les en-têtes `label::Français` et `label::Bariba`.
5. **Téléverser votre fichier `.xlsx` directement sur KoboToolbox** pour un déploiement instantané.

---

## 2. Pourquoi le Concepteur Web Ne Suffit Plus

L'interface web de KoboToolbox (cliquer sur `+`, taper le texte, ouvrir les paramètres) est excellente pour un petit devoir de 10 questions. Mais pour une **enquête nationale agricole ou une thèse d'ingénieur de 80 questions avec des sauts complexes**, cliquer sur chaque case devient interminable.

Le format **XLSForm** permet de rédiger l'intégralité du questionnaire directement dans **Microsoft Excel**. Vous pouvez :
* Dupliquer des questions par poignée de recopie.
* Réutiliser des listes de 77 communes du Bénin en 1 seconde.
* Conserver une sauvegarde physique de votre questionnaire sur votre ordinateur.

![Architecture du format XLSForm dans Excel](../schemas/schema_04_structure_tableur_xlsform.svg)

---

## 3. Les 3 Feuilles Obligatoires du Classeur Excel

Votre fichier Excel doit obligatoirement être enregistré au format **`.xlsx`** et comporter 3 onglets aux noms strictement orthographiés en minuscules :

### Feuille 1 : `survey` (L'arborescence des questions)
Chaque ligne correspond à une question ou une consigne affichée à l'écran.

| `type` | `name` | `label` | `relevant` | `constraint` | `constraint_message` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text` | `nom_resp` | *Nom du chef d'exploitation* | | | |
| `select_one liste_sexe` | `sexe` | *Sexe du producteur* | | | |
| `select_one liste_engrais` | `a_engrais` | *Avez-vous apporté des engrais minéraux ?* | | | |
| `decimal` | `dose_npk` | *Dose totale de NPK apportée (kg/ha)* | `${a_engrais} = 'oui'` | `. >= 50 and . <= 400` | *Dose NPK hors normes* |
| `geopoint` | `gps_champ` | *Enregistrer les coordonnées GPS de la parcelle* | | | |

### Feuille 2 : `choices` (Les options de réponses)
Contient les listes déroulantes utilisées par les types `select_one` et `select_multiple`.

| `list_name` | `name` | `label` |
| :--- | :--- | :--- |
| `liste_sexe` | `m` | Masculin |
| `liste_sexe` | `f` | Féminin |
| `liste_engrais` | `oui` | Oui, apport effectué |
| `liste_engrais` | `non` | Non, aucun engrais chimique |
| `liste_communes` | `parakou` | Parakou |
| `liste_communes` | `ndali` | N'Dali |
| `liste_communes` | `tchaourou` | Tchaourou |

### Feuille 3 : `settings` (Les paramètres du projet)
| `form_title` | `form_id` | `version` |
| :--- | :--- | :--- |
| Enquête Agronomique Parakou 2026 | `enquete_fa_up_2026` | `20261030` |

---

## 4. Questionnaires Bilingues & Multilingues dans XLSForm

Sur le terrain dans les villages autour de Parakou, les producteurs ne parlent pas tous français. Pour que l'enquêteur dispose de la traduction exacte sans déformer la question scientifique :

Dans la feuille `survey`, remplacez la colonne `label` par deux colonnes :
* `label::Français (fr)` : *Quelle est votre culture principale ?*
* `label::Bariba (ba)` : *[Texte traduit de la question en Bariba]*

Dans l'application mobile ODK/KoboCollect, l'enquêteur dispose d'un menu **Changer de langue** : en 1 seconde, tout le questionnaire bascule dans la langue locale choisie !

---

## 5. Téléverser sur KoboToolbox

1. Sur votre compte KoboToolbox, cliquez sur **New > Upload an XLSForm**.
2. Glissez votre fichier `.xlsx`.
3. Kobo vérifie la syntaxe en 2 secondes : s'il n'y a pas d'erreur, votre projet est créé avec toutes ses questions, ses contraintes et ses sauts logiques !
4. Vous pouvez à tout moment faire l'inverse : télécharger le XLSForm depuis Kobo pour le modifier dans Excel (**Project Settings > Download XLS**).

---

## 6. Fiche Mémo Récapitulative Détachable

```text
================================================================================
             FICHE MÉMO · RÈGLES D'OR DU FORMAT XLSFORM
================================================================================
1. LES 3 ONGLETS EXCEL IMPÉRATIFS :
   - survey   : Déclare chaque question (type, name, label).
   - choices  : Déclare chaque liste de choix (list_name, name, label).
   - settings : Déclare le titre et l'identifiant (form_title, form_id).

2. RÈGLE DES NOMS DE VARIABLES (name) :
   - Strictement en minuscules, sans espaces (tiret bas _), sans accents.

3. LES TYPES CLÉS :
   - select_one [nom_de_liste]      : Choix unique.
   - select_multiple [nom_de_liste] : Choix multiple.
   - geopoint, photo, date, integer, decimal, text.
================================================================================
TEAM Sahélia · Apprendre. Créer. Innover.
================================================================================
```
