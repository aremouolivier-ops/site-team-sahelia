# CHAPITRE 3 : STATISTIQUES DESCRIPTIVES & FORMATAGE ACADÉMIQUE
## Calculer la moyenne, l'écart-type et formater ses résultats scientifiques pour les jurys de mémoire

> **Manuel :** 01 — Excel pour les Étudiants & Professionnels  
> **Auteur :** Olivier AGUIN & TEAM Sahélia  
> **Temps d’apprentissage :** 40 minutes de lecture + 30 minutes d'atelier pratique  
> **Illustration associée :** `schemas/schema_03_statistiques_agronomiques.svg`  
> **Jeu de données :** `../datasets/dataset_agronomique_sahelia.csv`

---

## 1. Objectifs d'Impact Réel
À la fin de ce chapitre, vous saurez :
1. **Distinguer la Moyenne de la Médiane** et savoir pourquoi un jury rejettera une moyenne non accompagnée de son écart-type.
2. **Utiliser la bonne formule d'écart-type** : Pourquoi `=ECARTYPE.STANDARD()` est obligatoire sur un échantillon d'essai (et non `ECARTYPE.PE`).
3. **Calculer le Coefficient de Variation (CV %)** pour évaluer l'homogénéité d'un essai agronomique.
4. **Maîtriser les fonctions de comptage** (`NB`, `NBVAL`, `NB.VIDE`) pour auditer les données manquantes dans une enquête.
5. **Générer automatiquement la notation académique officielle** `Moyenne ± Écart-type` (ex : `2428,25 ± 915,10 kg/ha`) en une seule formule sans retouche manuelle.

---

## 2. Tendance Centrale : Moyenne vs Médiane

Face à une colonne de données (ex : les rendements de 20 parcelles), l'erreur courante est de ne calculer que la moyenne arithmétique.

### A. La Moyenne Arithmétique : `=MOYENNE(plage)`
- Elle additionne toutes les valeurs et divise par le nombre d'observations.
- **Faiblesse majeure :** Elle est extrêmement sensible aux valeurs extrêmes (*outliers*).
  - *Exemple :* 4 petits producteurs récoltent `1 000 kg`, `1 200 kg`, `1 100 kg` et `1 000 kg`. Un gros producteur mécanisé récolte `15 000 kg`.
  - La moyenne est de `3 860 kg`. **Ce chiffre ne représente la réalité de personne !** Aucun des 4 petits ne fait 3 800 kg, et le gros fait 4 fois plus.

### B. La Médiane : `=MEDIANE(plage)`
- Elle trie les données par ordre croissant et prend la valeur exacte qui coupe l'échantillon en deux parts égales (50 % au-dessus, 50 % en dessous).
- Dans l'exemple ci-dessus, la médiane est de `1 100 kg`. Elle reflète fidèlement la réalité de la majorité des exploitants.

> [!NOTE]
> **Règle de soutenance de mémoire :**  
> Si vos données sont distribuées symétriquement (distribution normale de Gauss), moyenne et médiane sont proches. Si elles sont très différentes, vous devez obligatoirement présenter les deux valeurs au jury pour démontrer votre honnêteté scientifique.

![Statistiques descriptives et dispersion agronomique](../schemas/schema_03_statistiques_agronomiques.svg)

---

## 3. Mesurer la Variabilité : L'Écart-Type et le Coefficient de Variation

La moyenne seule ne dit rien sans la dispersion.
- Deux essais agronomiques peuvent avoir la même moyenne de `3 000 kg/ha`.
- Dans l'essai A, toutes les parcelles font entre `2 900` et `3 100 kg/ha` (résultat ultra-stable et fiable).
- Dans l'essai B, les parcelles oscillent entre `800` et `5 200 kg/ha` (résultat instable, forte hétérogénéité du sol ou attaque parasitaire).

### A. Quelle formule d'écart-type choisir ?
Excel propose deux formules différentes :
1. **`=ECARTYPE.STANDARD(plage)` (ou `=STDEV.S()` en anglais) : OBLIGATOIRE EN RECHERCHE.**  
   Elle divise la somme des carrés par `n - 1` (degrés de liberté). Elle corrige le biais d'échantillonnage quand on étudie un échantillon (20 parcelles, 100 enquêtés).
2. **`=ECARTYPE.PE(plage)` (ou `=STDEV.P()`) :**  
   Elle divise par `n`. Elle ne s'utilise que si vous possédez l'intégralité absolue de la population (ex: les 12 millions d'habitants du Bénin).

### B. Le Coefficient de Variation (CV %)
En agronomie et en sciences expérimentales, le Coefficient de Variation mesure la fiabilité de l'essai :
$$\text{CV} = \left(\frac{\text{Écart-Type}}{\text{Moyenne}}\right) \times 100$$

- **CV < 15 % :** Essai très homogène, grande précision expérimentale.
- **15 % ≤ CV ≤ 25 % :** Variabilité modérée, acceptable en conditions de milieu paysan.
- **CV > 30 % :** Essai très hétérogène, résultats à interpréter avec prudence devant le jury.

---

## 4. Les Fonctions de Comptage et Détection de Trous

Lors d'un dépouillement d'enquête, il faut vérifier qu'aucune donnée n'a été oubliée :

| Fonction | Ce qu'elle compte | Exemple d'usage |
| :--- | :--- | :--- |
| `=NB(plage)` | Uniquement les cellules contenant des **nombres** | Compter combien de rendements réels sont mesurés |
| `=NBVAL(plage)` | Toutes les cellules **non vides** (texte, chiffres, dates) | Compter le nombre de fiches d'enquête remplies |
| `=NB.VIDE(plage)` | Uniquement les cellules **totalement vides** | Détecter les oublis d'enquêteurs ou données manquantes |

---

## 5. La Formule Magique de Formatage de Jury : `Moyenne ± Écart-Type`

Dans un tableau de mémoire, vous ne devez jamais coller deux colonnes séparées « Moyenne » et « Écart-type » avec 8 chiffres après la virgule (ex: `2428.25487` et `915.10458`). C'est un signe immédiat de travail amateur.

**La formule professionnelle qui fusionne et arrondit proprement :**
```excel
=TEXTE(MOYENNE(H2:H21); "0,00") & " ± " & TEXTE(ECARTYPE.STANDARD(H2:H21); "0,00") & " kg/ha"
```

### Explication de la formule :
- `MOYENNE(H2:H21)` : Calcule la moyenne des rendements.
- `TEXTE(... ; "0,00")` : Force l'affichage à deux décimales strictes (ex: `2428,25`).
- `& " ± " &` : L'opérateur de concaténation `&` colle le symbole plus ou moins `±`.
- `TEXTE(ECARTYPE.STANDARD(...) ; "0,00")` : Calcule et arrondit l'écart-type.
- **Résultat généré automatiquement dans la cellule :**  
  `2428,25 ± 915,10 kg/ha`

---

## 6. Atelier Pratique : Bilan Statistique de l'Essai de Parakou

Ouvrez `dataset_agronomique_sahelia.csv` dans Excel.  
Sous le tableau de données, construisez le bloc de synthèse statistique suivant :

| Ligne | Libellé de l'Indicateur | Formule Excel à taper | Résultat Attendu |
| :--- | :--- | :--- | :--- |
| **Ligne 24** | *Nombre de parcelles évaluées* | `=NB(H2:H21)` | **20** |
| **Ligne 25** | *Rendement Minimum (kg/ha)* | `=MIN(H2:H21)` | **1 100 kg/ha** |
| **Ligne 26** | *Rendement Maximum (kg/ha)* | `=MAX(H2:H21)` | **4 100 kg/ha** |
| **Ligne 27** | *Rendement Moyen (kg/ha)* | `=MOYENNE(H2:H21)` | **2 428,25 kg/ha** |
| **Ligne 28** | *Rendement Médian (kg/ha)* | `=MEDIANE(H2:H21)` | **2 325,00 kg/ha** |
| **Ligne 29** | *Écart-Type Standard (kg/ha)* | `=ECARTYPE.STANDARD(H2:H21)` | **915,10 kg/ha** |
| **Ligne 30** | *Coefficient de Variation (CV %)* | `=(B29 / B27) * 100` | **37,68 %** |
| **Ligne 31** | *Présentation Académique Jury* | `=TEXTE(B27;"0,00") & " ± " & TEXTE(B29;"0,00") & " kg/ha"` | **2428,25 ± 915,10 kg/ha** |

### Analyse agronomique du résultat :
Le CV de 37,68 % est supérieur à 30 %. Pourquoi ? Parce que l'échantillon mélange 4 cultures différentes (le maïs donne jusqu'à 4 100 kg/ha alors que le sorgho plafonne à 1 200 kg/ha). Dans le prochain chapitre, nous apprendrons à calculer ces moyennes **par culture et par commune** grâce aux fonctions conditionnelles !

---

## 7. Le Défi Communautaire TEAM Sahélia

> ### 🏆 Défi Hebdo n°03 : L'Audit Statistique des Coûts
> 
> 1. À partir de la colonne `Cout_Total_FCFA` (Colonne I), calculez :
>    - Le coût moyen de production par exploitation.
>    - L'écart-type des coûts.
>    - Le Coefficient de Variation (CV %) des dépenses des paysans.
> 2. Appliquez la formule de formatage de jury pour afficher :  
>    `"Coût moyen : " & TEXTE(...) & " ± " & TEXTE(...) & " FCFA"`.
> 3. Prenez une capture d'écran nette de votre cellule avec la barre de formule visible.
> 4. Postez-la sur le canal officiel avec la mention :  
>    *« Défi Manuel 01 - Chapitre 3 Statistiques & Formatage Validés ! »*.

---

## 8. Fiche Mémo Récapitulative Détachable

```text
================================================================================
             FICHE MÉMO · STATISTIQUES & FORMATAGE SCIENTIFIQUE
================================================================================
1. LES FONCTIONS DE BASE :
   - =MOYENNE(plage)          : Tendance centrale classique.
   - =MEDIANE(plage)          : Valeur centrale qui coupe la série en 50/50.
   - =MIN(plage) / =MAX(plage): Valeurs extrêmes de l'essai.

2. L'ÉCART-TYPE OBLIGATOIRE SUR ÉCHANTILLON :
   - =ECARTYPE.STANDARD(plage) (divise par n-1, obligatoire en recherche).
   - Ne pas utiliser ECARTYPE.PE (réservé aux recensements complets de population).

3. FORMULE DU COEFFICIENT DE VARIATION :
   - =(Écart-Type / Moyenne) * 100
   - Interprétation : < 15% (très homogène) | > 30% (très hétérogène).

4. NOTATION SCIENTIFIQUE DE SOUTENANCE :
   - =TEXTE(MOYENNE(A1:A20); "0,00") & " ± " & TEXTE(ECARTYPE.STANDARD(A1:A20); "0,00")
================================================================================
TEAM Sahélia · Apprendre aujourd’hui. Construire demain.
================================================================================
```
