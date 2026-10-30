# CHAPITRE 2 : FORMULES ARITHMÉTIQUES & LE SECRET DU DOLLAR ($)
## Maîtriser les références relatives, mixtes et absolues pour automatiser ses calculs sans décalage

> **Manuel :** 01 — Excel pour les Étudiants & Professionnels  
> **Auteur :** Olivier AGUIN & TEAM Sahélia  
> **Temps d’apprentissage :** 40 minutes de lecture active + 30 minutes d'atelier pratique  
> **Illustration associée :** `schemas/schema_02_references_absolues_dollar.svg`  
> **Jeu de données :** `../datasets/dataset_agronomique_parakou.csv`

---

## 1. Objectifs d'Impact Réel
À la fin de ce chapitre, vous saurez :
1. **Écrire une formule mathématique infaillible** en respectant la priorité des opérations (règle PEMDAS).
2. **Comprendre pourquoi une formule se décale** quand on l'étire vers le bas ou vers la droite.
3. **Verrouiller une cellule clé avec le symbole dollar `$B$1`** (prix unitaire d'un engrais, taux de change, coefficient fixe).
4. **Utiliser la touche `F4`** pour basculer entre référence relative, absolue et mixte en un quart de seconde.
5. **Déchiffrer et réparer instantanément** les 5 grands messages d'erreur d'Excel (`#VALEUR!`, `#DIV/0!`, `#REF!`, `#NOM?`, `#####`).
6. **Calculer des marges brutes agricoles réelles** pour 20 exploitations sans jamais retaper un chiffre.

---

## 2. Anatomie d'une Formule Excel & Priorités Mathématiques

Toute formule Excel commence **obligatoirement par le signe égal (`=`)**. Sans le signe `=`, Excel considère que vous écrivez du simple texte.

### Les 4 opérateurs arithmétiques de base :
- **Addition :** `+` (ex : `=A1 + B1`)
- **Soustraction :** `-` (ex : `=A1 - B1`)
- **Multiplication :** `*` (l'astérisque, ex : `=A1 * B1`)
- **Division :** `/` (la barre oblique, ex : `=A1 / B1`)
- **Puissance / Carré :** `^` (l'accent circonflexe, ex : `=A1^2`)

### L'ordre de priorité universel (PEMDAS) :
Excel calcule dans l'ordre strict suivant :
1. **P**arenthèses d'abord
2. **E**xposants / Puissances
3. **M**ultiplications et **D**ivisions (de gauche à droite)
4. **A**dditions et **S**oustractions (de gauche à droite)

> [!CAUTION]
> ### Erreur classique : L'oubli fatal des parenthèses dans les calculs de ratios
> Supposons que vous voulez calculer le rendement moyen entre deux parcelles en A1 (3 000 kg) et B1 (4 000 kg) :
> - ❌ Si vous tapez `=A1 + B1 / 2`, Excel divise **uniquement B1 par 2** (soit 2 000) et l'ajoute à A1 : résultat faux de `5 000` !
> -  Vous devez impérativement forcer la somme avec des parenthèses : `=(A1 + B1) / 2` pour obtenir le vrai résultat : `3 500`.

---

## 3. Le Secret du Symbole Dollar ($) : Relatif vs Absolu

C'est la notion la plus importante d'Excel. Si vous la comprenez, vous maîtrisez 80 % du tableur.

### A. La Référence Relative (Par défaut : `A1`)
Lorsque vous écrivez `=B2 * C2` en ligne 2 et que vous étirez la formule vers le bas :
- En ligne 3, la formule devient automatiquement `=B3 * C3`.
- En ligne 4, elle devient `=B4 * C4`.
- **Comportement :** Excel ne retient pas *« la cellule B2 »*, il retient *« prends la cellule située une colonne à gauche et multiplie-la par celle située deux colonnes à gauche »*. Les coordonnées se décalent en même temps que votre mouvement.

### B. Le Piège du Facteur Unique
Supposons que le prix du sac d'engrais NPK soit stocké dans **une seule cellule isolée : `E1` (24 000 FCFA)**.
Dans votre tableau, la colonne B contient le nombre de sacs achetés par chaque producteur :
- Ligne 2 : `=B2 * E1` -> *2 sacs × 24 000 = 48 000 FCFA* (Correct).
- Ligne 3 : Quand vous étirez vers le bas, la formule devient `=B3 * E2`. Mais la cellule `E2` est vide ! Le résultat affiche `0` !
- Ligne 4 : La formule devient `=B4 * E3`. Si `E3` contient du texte, Excel affiche l'erreur `#VALEUR!` !

![Le secret du dollar dans Excel](../schemas/schema_02_references_absolues_dollar.svg)

### C. La Référence Absolue (`$E$1`)
Pour empêcher la cellule du prix de bouger, on pose un cadenas : le symbole dollar **`$`**.
- Le premier `$` bloque la **colonne E** : `$E`.
- Le second `$` bloque la **ligne 1** : `$1`.
- La formule devient : `=B2 * $E$1`.
- Lorsque vous étirez sur 500 lignes :
  - `B2` devient `B3`, puis `B4`, puis `B5` (car il n'a pas de dollar : il s'adapte à chaque producteur).
  - Mais `$E$1` reste **strictement figé sur la cellule E1** pour tout le monde !

### D. Les Références Mixtes (`$E1` ou `E$1`)
- `$E1` : La colonne E est bloquée, mais la ligne est libre de descendre (très utile quand on étire vers la droite).
- `E$1` : La colonne est libre, mais la ligne 1 est verrouillée (très utile pour des barèmes horizontaux).

> [!TIP]
> ### L'Astuce du Pro : La touche magique F4
> Ne tapez jamais le symbole `$` à la main avec votre clavier.  
> Lorsque vous écrivez votre formule et que vous cliquez sur `E1`, appuyez immédiatement sur la touche **`F4`** (ou `Fn + F4` sur certains ordinateurs portables) :
> - 1er appui sur F4 : `E1` devient `$E$1` (Absolu complet).
> - 2e appui sur F4 : `$E$1` devient `E$1` (Ligne bloquée).
> - 3e appui sur F4 : `E$1` devient `$E1` (Colonne bloquée).
> - 4e appui sur F4 : `$E1` redevient `E1` (Relatif normal).

---

## 4. Décrypter et Corriger les 5 Grandes Erreurs d'Excel

Quand Excel affiche un mot commençant par `#`, il ne faut pas paniquer. C’est un message précis qui vous indique exactement quoi réparer :

| Message d'Erreur | Cause Réelle | Solution Immédiate |
| :--- | :--- | :--- |
| **`#VALEUR!`** | Incompatibilité de type : vous essayez de faire une opération mathématique sur du texte (ex: `=A1 * 10` alors que A1 contient `25 kg` ou un espace invisible). | Vérifier que la cellule contient un chiffre pur sans lettres et supprimer les espaces parasites. |
| **`#DIV/0!`** | Division par zéro : votre formule tente de diviser par `0` ou par une cellule complètement vide. | Remplir la cellule diviseur ou utiliser la sécurité `=SIERREUR(formule; 0)`. |
| **`#REF!`** | Référence disparue : la cellule, ligne ou colonne qui était utilisée dans la formule a été supprimée. | Faire `Ctrl + Z` immédiatement, ou réécrire la formule en pointant vers la nouvelle cellule existante. |
| **`#NOM?`** | Faute d'orthographe dans le nom de la fonction (ex: `=SOMM(A1:A10)` ou `=MOYEN(B1:B5)`). | Corriger le nom de la fonction (`=SOMME()`, `=MOYENNE()`). |
| **`#####`** | La colonne est trop étroite pour afficher le nombre, ou le résultat est une date négative. | Double-cliquer sur le trait séparateur entre les en-têtes de colonnes pour ajuster la largeur automatiquement. |

---

## 5. Atelier Pratique : Calcul de Rentabilité des 20 Parcelles de Parakou

Ouvrez le fichier `datasets/dataset_agronomique_parakou.csv` dans Excel.

### Données fixes de l'étude (à placer en dehors du tableau principal) :
Dans la feuille, placez dans les cellules isolées suivantes :
- `M1` : `Prix_Kilo_Mais_Fixe` = `180` (en FCFA/kg)
- `M2` : `Prix_Kilo_Soja_Fixe` = `350` (en FCFA/kg)
- `M3` : `Subvention_Etat_ha` = `15 000` (en FCFA/ha)

### Travail à réaliser pas à pas :
1. **Créer la colonne `Recolte_Totale_kg` (Colonne K) :**  
   Formule en K2 : `=H2 * F2` *(Rendement en kg/ha multiplié par la superficie en ha)*.  
   *Ici, pas de dollar : les deux cellules doivent descendre pour chaque producteur.*
2. **Créer la colonne `Aide_Subvention_FCFA` (Colonne L) :**  
   Chaque hectare reçoit 15 000 FCFA de subvention.  
   Formule en L2 : `=F2 * $M$3`.  
   *`F2` descend avec le producteur, mais `$M$3` reste cadenassé sur la cellule de subvention.*
3. **Créer la colonne `Revenu_Brut_Global_FCFA` (Colonne M) :**  
   Formule en M2 : `=(K2 * J2) + L2` *(Vente de la récolte + aide subvention)*.
4. **Créer la colonne `Marge_Nette_Parcelle_FCFA` (Colonne N) :**  
   Formule en N2 : `=M2 - I2` *(Revenu global moins coût total de production)*.
5. **Créer la colonne `Marge_Par_Hectare_FCFA` (Colonne O) :**  
   Formule en O2 : `=N2 / F2` *(Marge nette totale divisée par la superficie)*.
6. Étirez toutes les formules sur les 20 lignes en double-cliquant sur la poignée de recopie.

### Contrôle qualité du résultat :
- Pour le producteur `P001` (BIO Gounou Bio, 2,5 ha de maïs) :
  - Récolte totale = `8 000 kg`.
  - Subvention = `37 500 FCFA`.
  - Revenu brut = `1 477 500 FCFA`.
  - Marge nette = `1 192 500 FCFA`.
  - Marge par hectare = `477 000 FCFA/ha`.
- Aucune erreur `#VALEUR!` ni `#DIV/0!`. Le tableau calcule instantanément l'intégralité de l'échantillon.

---

## 6. Le Défi Communautaire TEAM Sahélia

> ### 🏆 Défi Hebdo n°02 : Le Simulateur d'Augmentation du Prix des Carburants
> 
> Les coûts de transport augmentent de **12 %** dans toute la région de Parakou.
> 1. Créez une cellule isolée `P1` contenant le taux d'inflation : `0,12`.
> 2. Créez une nouvelle colonne `Cout_Ajuste_FCFA` qui recalcule le coût de chaque exploitation avec la formule :  
>    `=Cout_Total_FCFA * (1 + $P$1)`.
> 3. Identifiez combien d'exploitations basculent en marge nette négative (déficitaires) après cette hausse.
> 4. Faites une capture d'écran nette montrant votre cellule `$P$1` et la formule appliquée.
> 5. Postez-la sur le canal officiel avec la mention :  
>    *« Défi Manuel 01 - Chapitre 2 Dollar & F4 Maîtrisés ! »*.

---

## 7. Fiche Mémo Récapitulative Détachable

```text
================================================================================
             FICHE MÉMO · LES FORMULES & LE DOLLAR ($) DANS EXCEL
================================================================================
1. PRIORITÉ MATHÉMATIQUE (PEMDAS) :
   - Les parenthèses d'abord ! =(A1 + B1) / 2 et non =A1 + B1 / 2.

2. LE SYMBOLE DOLLAR ($) :
   - A1   : Relatif (la cellule bouge quand on étire).
   - $A$1 : Absolu total (ligne et colonne bloquées, la cible ne bouge jamais).
   - $A1  : Colonne bloquée, ligne libre.
   - A$1  : Ligne bloquée, colonne libre.

3. LE RACCOURCI F4 :
   - Cliquez sur la référence et appuyez sur F4 pour poser les dollars en 1 seconde.

4. RÉPERTOIRE DES ERREURS :
   - #VALEUR! : Du texte ou un espace s'est glissé dans un calcul mathématique.
   - #DIV/0!  : Division par zéro ou par cellule vide.
   - #REF!    : Une ligne ou colonne utilisée dans la formule a été supprimée.
   - #NOM?    : Faute d'orthographe dans le nom de la fonction (=SOMME).
   - #####    : Colonne trop étroite -> double-cliquer sur le bord de l'en-tête.
================================================================================
TEAM Sahélia · Apprendre aujourd’hui. Construire demain.
================================================================================
```
