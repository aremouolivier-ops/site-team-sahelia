# CHAPITRE 4 : LE FILTRAGE CONDITIONNEL AVANCÉ
## Compter, sommer et calculer des moyennes sous critères simples et multiples

> **Manuel :** 01 — Excel pour les Étudiants & Professionnels  
> **Auteur :** Olivier AGUIN & TEAM Sahélia  
> **Temps d’apprentissage :** 45 minutes de lecture + 30 minutes d'atelier pratique  
> **Illustration associée :** `schemas/schema_04_fonctions_conditionnelles.svg`  
> **Jeu de données :** `../datasets/dataset_agronomique_parakou.csv`

---

## 1. Objectifs d'Impact Réel
À la fin de ce chapitre, vous saurez :
1. **Extraire des statistiques ciblées** sans jamais trier, couper ou modifier votre base de données brute.
2. **Compter des effectifs sous condition** avec `=NB.SI()` (ex: nombre de parcelles de maïs, nombre d'exploitants de plus de 40 ans).
3. **Additionner des grandeurs spécifiques** avec `=SOMME.SI()` (ex: récolte totale produite dans la commune de N'Dali).
4. **Calculer des rendements moyens par culture ou par variété** avec `=MOYENNE.SI()` pour des comparaisons agronomiques rigoureuses.
5. **Maîtriser les fonctions multi-critères** (`NB.SI.ENS`, `SOMME.SI.ENS`, `MOYENNE.SI.ENS`) et éviter le piège mortel d'inversion des arguments.

---

## 2. Pourquoi les Fonctions Conditionnelles Révolutionnent l'Analyse

Dans beaucoup de mémoires, les étudiants commettent l'erreur de dupliquer leur fichier Excel en 4 sous-fichiers : un pour le maïs, un pour le soja, un pour le coton et un pour le sorgho.
- **Résultat :** Si une donnée est corrigée sur le terrain, il faut modifier 4 classeurs. C'est la porte ouverte aux erreurs et aux incohérences devant le jury.

**La méthode professionnelle :**
Vous gardez **une seule base de données unique et propre**. Et vous utilisez les formules conditionnelles pour interroger cette base en direct.

![Mécanique des fonctions conditionnelles](../schemas/schema_04_fonctions_conditionnelles.svg)

---

## 3. Les Fonctions à Critère Unique : `NB.SI`, `SOMME.SI`, `MOYENNE.SI`

### A. La fonction `NB.SI(plage ; critère)`
Elle compte le nombre de cellules qui respectent une condition donnée.
- **Syntaxe :** `=NB.SI(Plage_à_tester ; Critère)`
- **Exemples réels :**
  - Compter les parcelles situées à Parakou :  
    `=NB.SI(B2:B21 ; "Parakou")` -> Résultat : **6**
  - Compter les parcelles ayant un rendement supérieur à 3 000 kg/ha :  
    `=NB.SI(H2:H21 ; ">3000")` -> Résultat : **6**
  - Compter les parcelles différentes de la culture du coton :  
    `=NB.SI(D2:D21 ; "<>Coton")` -> Résultat : **16**

### B. La fonction `SOMME.SI(plage_critère ; critère ; [plage_somme])`
Elle additionne les nombres d'une colonne uniquement lorsque la condition est vraie sur une autre colonne.
- **Syntaxe :** `=SOMME.SI(Plage_test ; Critère ; Plage_des_nombres_à_sommer)`
- **Exemples réels :**
  - Calculer la superficie totale emblavée en Soja :  
    `=SOMME.SI(D2:D21 ; "Soja" ; F2:F21)` -> Résultat : **9,00 ha**
  - Calculer la dépense totale d'engrais engagée dans la commune de N'Dali :  
    `=SOMME.SI(B2:B21 ; "N'Dali" ; I2:I21)` -> Résultat : **1 290 000 FCFA**

### C. La fonction `MOYENNE.SI(plage_critère ; critère ; [plage_moyenne])`
Elle calcule la moyenne arithmétique ciblée.
- **Exemple réel :**  
  Rendement moyen du Maïs sur l'ensemble de l'essai :  
  `=MOYENNE.SI(D2:D21 ; "Maïs" ; H2:H21)` -> Résultat : **3 218,75 kg/ha**

---

## 4. Le Grand Piège : L'Inversion des Arguments dans les Fonctions `.ENS`

Dès que vous avez **2 conditions ou plus** (ex: *Quelle est la production de Maïs à Parakou ?*), vous devez utiliser la famille `.ENS`.

> [!CAUTION]
> ### Erreur classique : L'inversion de la plage de somme !
> C’est l'erreur qui fait perdre des heures aux débutants :
> - Dans `=SOMME.SI()`, la plage des nombres à additionner se trouve **À LA FIN** :  
>   `=SOMME.SI(Plage_Critère ; Critère ; Plage_Somme)`
> - Dans `=SOMME.SI.ENS()`, la plage des nombres à additionner passe **TOUT AU DÉBUT** :  
>   `=SOMME.SI.ENS(Plage_Somme ; Plage_Critère_1 ; Critère_1 ; Plage_Critère_2 ; Critère_2 ; ...)`
> 
> Si vous mettez la plage de somme à la fin dans `SOMME.SI.ENS`, Excel affichera une erreur de formule ou un résultat nul !

---

## 5. La Syntaxe des Opérateurs de Comparaison

Lorsque vous comparez des chiffres avec un seuil contenu dans une cellule :

| Ce que vous voulez tester | Formule Incorrecte ❌ | Formule Correcte  |
| :--- | :--- | :--- |
| Supérieur à 2 000 | `=NB.SI(H2:H21 ; >2000)` (manque guillemets) | `=NB.SI(H2:H21 ; ">2000")` |
| Supérieur ou égal à la cellule `K1` | `=NB.SI(H2:H21 ; ">=K1")` (cherche le texte "K1") | `=NB.SI(H2:H21 ; ">=" & K1)` |
| Différent du texte "Coton" | `=NB.SI(D2:D21 ; != "Coton")` (syntaxe invalide) | `=NB.SI(D2:D21 ; "<>Coton")` |

---

## 6. Atelier Pratique : Le Tableau Comparatif des 4 Cultures

Ouvrez `dataset_agronomique_parakou.csv`.  
À droite de vos données (à partir de la colonne `Q`), construisez le tableau de synthèse suivant :

| Culture | Nb Parcelles | Superficie Totale (ha) | Rendement Moyen (kg/ha) | Coût Total Engagé (FCFA) |
| :--- | :--- | :--- | :--- | :--- |
| **Maïs** | `=NB.SI(D$2:D$21; Q2)` | `=SOMME.SI(D$2:D$21; Q2; F$2:F$21)` | `=MOYENNE.SI(D$2:D$21; Q2; H$2:H$21)` | `=SOMME.SI(D$2:D$21; Q2; I$2:I$21)` |
| **Soja** | `=NB.SI(D$2:D$21; Q3)` | `=SOMME.SI(D$2:D$21; Q3; F$2:F$21)` | `=MOYENNE.SI(D$2:D$21; Q3; H$2:H$21)` | `=SOMME.SI(D$2:D$21; Q3; I$2:I$21)` |
| **Coton** | `=NB.SI(D$2:D$21; Q4)` | `=SOMME.SI(D$2:D$21; Q4; F$2:F$21)` | `=MOYENNE.SI(D$2:D$21; Q4; H$2:H$21)` | `=SOMME.SI(D$2:D$21; Q4; I$2:I$21)` |
| **Sorgho** | `=NB.SI(D$2:D$21; Q5)` | `=SOMME.SI(D$2:D$21; Q5; F$2:F$21)` | `=MOYENNE.SI(D$2:D$21; Q5; H$2:H$21)` | `=SOMME.SI(D$2:D$21; Q5; I$2:I$21)` |

### Résultats de contrôle qualité :
- **Maïs :** 8 parcelles, `19,20 ha`, moyenne de `3 218,75 kg/ha`, coût total = `2 245 000 FCFA`.
- **Soja :** 5 parcelles, `9,00 ha`, moyenne de `1 740,00 kg/ha`, coût total = `990 000 FCFA`.
- **Coton :** 4 parcelles, `14,20 ha`, moyenne de `1 937,50 kg/ha`, coût total = `1 660 000 FCFA`.
- **Sorgho :** 3 parcelles, `3,70 ha`, moyenne de `1 150,00 kg/ha`, coût total = `255 000 FCFA`.
- **Total général vérifié :** 20 parcelles, `46,10 ha`, dépense globale = `5 150 000 FCFA`.

---

## 7. Le Défi Communautaire TEAM Sahélia

> ### 🏆 Défi Hebdo n°04 : Le Filtre Multi-Critères d'Expert
> 
> En utilisant la fonction `=MOYENNE.SI.ENS()`, répondez à la question précise d'un chercheur du CRA-Nord Bénin :
> *« Quel est le rendement moyen des parcelles de **Maïs** situées exclusivement dans la commune de **Parakou** ET ayant reçu une dose d'engrais NPK **supérieure ou égale à 200 kg/ha** ? »*
> 
> 1. Écrivez la formule complète avec les 3 critères simultanés.
> 2. Vérifiez le résultat obtenu.
> 3. Prenez une capture d'écran nette de votre cellule avec la barre de formule visible.
> 4. Postez-la sur le canal officiel avec la mention :  
>    *« Défi Manuel 01 - Chapitre 4 Multi-Critères .ENS Maîtrisé ! »*.

---

## 8. Fiche Mémo Récapitulative Détachable

```text
================================================================================
             FICHE MÉMO · FONCTIONS CONDITIONNELLES DANS EXCEL
================================================================================
1. CRITÈRE UNIQUE (1 condition) :
   - =NB.SI(Plage_Test ; Critère)
   - =SOMME.SI(Plage_Test ; Critère ; Plage_Somme)
   - =MOYENNE.SI(Plage_Test ; Critère ; Plage_Moyenne)
   -> La plage à calculer se trouve TOUJOURS À LA FIN.

2. MULTI-CRITÈRES (2 conditions ou plus) :
   - =NB.SI.ENS(Plage1 ; Crit1 ; Plage2 ; Crit2 ; ...)
   - =SOMME.SI.ENS(Plage_Somme ; Plage1 ; Crit1 ; Plage2 ; Crit2 ; ...)
   - =MOYENNE.SI.ENS(Plage_Moyenne ; Plage1 ; Crit1 ; Plage2 ; Crit2 ; ...)
   -> La plage à calculer se trouve TOUJOURS AU DÉBUT !

3. SYNTAXE AVEC CELLULE :
   - ">=" & A1  (avec esperluette pour lier l'opérateur et la cellule).
================================================================================
TEAM Sahélia · Apprendre aujourd’hui. Construire demain.
================================================================================
```
