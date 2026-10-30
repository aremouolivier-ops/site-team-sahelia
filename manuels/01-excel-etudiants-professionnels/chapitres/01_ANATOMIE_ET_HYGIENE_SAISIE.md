# CHAPITRE 1 : ANATOMIE D’UNE FEUILLE EXCEL & HYGIÈNE DE SAISIE
## Du tableau brouillon au fichier de données professionnel, standardisé et infaillible

> **Manuel :** 01 — Excel pour les Étudiants & Professionnels  
> **Auteur :** Olivier AGUIN & TEAM Sahélia  
> **Temps d’apprentissage estimé :** 45 minutes de lecture active + 30 minutes d'atelier pratique  
> **Fichiers associés :** `datasets/dataset_agronomique_parakou.csv` · `schemas/schema_01_anatomie_cellule.svg`

---

## 1. Objectifs d'Impact Réel (Ce que vous saurez faire)
À la fin de ce chapitre, vous serez capable de :
1. **Identifier instantanément la nature d'une donnée** (Texte, Nombre pur, Date, Formule) au premier coup d'œil sans cliquer dessus.
2. **Éradiquer le bogue n°1 en Afrique de l'Ouest :** Le conflit entre la virgule française (`,`) et le point décimal anglo-saxon (`.`).
3. **Multiplier par 5 votre vitesse de saisie** grâce à la poignée de recopie intelligente et aux séries automatiques.
4. **Naviguer dans une base de données de 5 000 lignes** en 1 seconde sans toucher à la souris (Raccourcis `Ctrl + Flèches`).
5. **Livrer un tableau propre et standardisé**, prêt pour l'analyse statistique sous R ou l'export vers QGIS.

---

## 2. Anatomie d'une Feuille de Calcul : Comprendre ce qui se passe sous le capot

Un classeur Excel n'est pas une simple page de traitement de texte quadrillée. C’est une matrice mathématique géante composée de **1 048 576 lignes** numérotées de 1 à 1 048 576 et de **16 384 colonnes** nommées de A jusqu'à XFD.

L'intersection d'une colonne et d'une ligne forme une **cellule unique**, repérée par ses coordonnées (ex : `B2` désigne la colonne B, ligne 2).

### Les 4 zones maîtresses de l'écran Excel
1. **La Zone Nom (en haut à gauche, sous le ruban) :** Elle affiche en permanence l’adresse de la cellule active (ex : `B2`). Elle permet aussi de nommer une plage de cellules pour simplifier des formules complexes.
2. **La Barre de Formule (`fx`) :** C'est le miroir de vérité. Une cellule peut afficher visuellement `5 000 FCFA`, mais la barre de formule révèle ce qu'elle contient réellement : soit le nombre brut `5000`, soit une formule `=SOMME(D2:D10)`.
3. **La Grille de Travail :** L'espace matriciel où vous visualisez vos données.
4. **La Barre d'État (en bas à droite) :** Un outil d'audit instantané méconnu ! Dès que vous sélectionnez plusieurs cellules numériques, la barre d'état calcule automatiquement en temps réel leur **Moyenne**, le **Nombre de valeurs** et la **Somme**, sans que vous n'ayez à taper la moindre formule.

![Anatomie d'une feuille Excel](../schemas/schema_01_anatomie_cellule.svg)

---

## 3. Les Trois Familles de Données & La Règle d'Or de l'Alignement

Excel ne traite pas toutes les informations de la même façon. Il classe chaque saisie dans l'une des 3 familles suivantes :

### A. Le Texte (Chaîne de caractères)
- *Exemples :* `Parakou`, `DMR-ESR-W`, `BIO Gounou`, `Variété 1`.
- **Comportement par défaut :** S'aligne automatiquement à **GAUCHE** de la cellule.
- **Propriété :** Impossible de faire des additions, moyennes ou multiplications sur du texte.

### B. Les Nombres Purs (Valeurs numériques réelles)
- *Exemples :* `12`, `2.50`, `3200`, `-15`.
- **Comportement par défaut :** S'aligne automatiquement à **DROITE** de la cellule.
- **Règle fondamentale :** Un nombre ne doit contenir AUCUNE lettre ni symbole d'unité saisi à la main.
  - ❌ **Saisie interdite :** Taper `25 kg` ou `3500 FCFA` dans la cellule. Dès que vous tapez « kg » ou « FCFA », Excel bascule la cellule en Texte (elle s'aligne à gauche) et toute tentative de calcul retournera l'erreur `#VALEUR!`.
  -  **Saisie professionnelle :** Tapez uniquement le chiffre `25`. L'unité `kg` doit être précisée dans le titre de la colonne (ex : `Rendement (kg/ha)`) ou configurée via le format de cellule monétaire.

### C. Les Dates & Heures
- *Exemples :* `15/06/2026`, `08:30:00`.
- **Comportement par défaut :** S'aligne automatiquement à **DROITE**.
- **Le secret d'Excel :** Pour le logiciel, une date est simplement un nombre entier déguisé ! Le jour 1 correspond au 1er janvier 1900. Le 15 juin 2026 correspond au nombre `46188`. C’est pourquoi vous pouvez soustraire deux dates pour calculer un nombre de jours de cycle de culture (`Date_Récolte - Date_Semis`).

> [!CAUTION]
> ### Erreur classique à éviter n°1 : Le piège du Point vs la Virgule
> C’est la cause de 80 % des calculs bloqués chez les étudiants au Bénin.
> - Si votre ordinateur est configuré en **Français (France)** : le séparateur décimal officiel est la **virgule** (`,`). Si vous tapez `2.5`, Excel croit que c'est du texte et l'aligne à gauche. Votre formule `=MOYENNE()` ignorera silencieusement cette valeur !
> - Si votre ordinateur est configuré en **Anglais (US)** : le séparateur est le **point** (`.`).
> 
> **Le test infaillible :** Tapez un nombre à virgule dans une cellule vierge sans modifier l'alignement. S'il saute immédiatement à droite, votre séparateur est validé. S'il reste bloqué à gauche, changez de séparateur !

---

## 4. La Poignée de Recopie & Les Séries Automatiques

La **poignée de recopie** est le petit carré noir situé dans le coin inférieur droit de la cellule sélectionnée. Lorsque vous survolez ce carré, votre curseur se transforme en une fine croix noire `+`.

### Ce que permet la poignée de recopie :
1. **Incrémenter une suite de chiffres (1, 2, 3...) :**
   - Tapez `1` en cellule A1 et `2` en cellule A2.
   - Sélectionnez les deux cellules ensemble.
   - Double-cliquez sur la poignée de recopie : Excel comprend le motif (+1) et prolonge la série jusqu'au bas de votre tableau, même s'il fait 1 000 lignes !
2. **Incrémenter des codes d'échantillons ou de parcelles :**
   - Tapez `P001`. Tirez la poignée vers le bas : Excel génère automatiquement `P002`, `P003`, `P004`...
3. **Séries temporelles automatiques :**
   - Tapez `Lundi`, tirez : vous obtenez `Mardi`, `Mercredi`...
   - Tapez `Janvier`, tirez : vous obtenez `Février`, `Mars`...
   - Tapez `15/06/2026`, tirez : vous incrémentez les jours calendaires un à un.

> [!TIP]
> ### L'Astuce du Pro n°1 : Le Double-Clic Magique
> Ne perdez jamais votre temps à faire glisser la souris vers le bas sur 500 lignes. Si vous avez déjà une colonne de données remplie à gauche (ex : vos noms de producteurs), placez votre curseur sur le carré de recopie de votre première formule et faites un **double-clic gauche rapide**. Excel calcule instantanément la hauteur du tableau adjacent et duplique la formule jusqu'à la dernière ligne exacte, sans dépasser d'un millimètre.

---

## 5. Les Raccourcis Clavier Fondamentaux de Navigation Rapide

Oubliez la roulette de la souris pour vous déplacer dans un grand fichier d'enquête. Adoptez les combinaisons des professionnels :

| Raccourci Clavier | Action Immédiate | Contexte d'usage sur le terrain |
| :--- | :--- | :--- |
| `Ctrl + Flèche Bas` | Saute directement à la dernière ligne non vide | Trouver la fin d'une base de 2 000 enquêtés |
| `Ctrl + Flèche Droite` | Saute à la dernière colonne du tableau | Aller voir le dernier paramètre mesuré |
| `Ctrl + Début` (`Ctrl + Home`) | Revient immédiatement à la cellule `A1` | Ne jamais se perdre après avoir scrollé |
| `Ctrl + Maj + Flèche Bas` | Sélectionne toutes les cellules jusqu'en bas | Sélectionner 500 rendements pour calculer la moyenne |
| `Ctrl + A` | Sélectionne tout le tableau actuel | Préparer un tri global ou un export |
| `F4` ou `Ctrl + Y` | Répète la dernière action effectuée | Appliquer la même couleur à plusieurs en-têtes |
| `Alt + =` | Insère automatiquement la fonction `=SOMME()` | Sommer une colonne entière en un quart de seconde |

---

## 6. Atelier Pratique : Structurer le Tableau d'Essai de Parakou

Vous venez de recevoir les notes de terrain du stagiaire responsable du suivi de 5 parcelles de maïs dans la commune de Parakou. Voici les données brutes sur son carnet :
- *Parcelle 1 : BIO Gounou Bio, superficie 2,5 ha, 200 kg d'engrais NPK, récolte totale 8 000 kg.*
- *Parcelle 2 : CHABI Orou, superficie 3,0 ha, 250 kg d'engrais NPK, récolte totale 11 400 kg.*
- *Parcelle 3 : TAMA Orou, superficie 2,8 ha, 200 kg d'engrais NPK, récolte totale 9 660 kg.*
- *Parcelle 4 : WOROU Issa, superficie 2,0 ha, 200 kg d'engrais NPK, récolte totale 5 800 kg.*
- *Parcelle 5 : MAMA Aïcha, superficie 1,8 ha, 150 kg d'engrais NPK, récolte totale 4 950 kg.*

### Consignes de l'Atelier :
1. Ouvrez une feuille vierge Excel.
2. Créez les en-têtes sur la **Ligne 1** :
   - `A1` : `Code_Parcelle`
   - `B1` : `Producteur`
   - `C1` : `Superficie_ha`
   - `D1` : `Dose_NPK_kg`
   - `E1` : `Recolte_Totale_kg`
   - `F1` : `Rendement_kg_ha`
3. Utilisez la série automatique pour générer les codes `P01` à `P05` dans la colonne A.
4. Saisissez les données numériques sans aucune unité dans les cellules (juste les chiffres purs).
5. Dans la cellule `F2`, calculez le rendement à l'hectare avec la formule arithmétique :
   `=E2/C2` *(Récolte totale divisée par la superficie en ha)*.
6. Dupliquez la formule vers le bas avec le double-clic sur la poignée de recopie.
7. Sur la ligne 7, utilisez le raccourci `Alt + =` pour calculer la somme totale des récoltes.

### Résultat attendu :
- Pour `P01`, le rendement calculé doit afficher exactement `3200` kg/ha.
- Pour `P02`, vous obtenez `3800` kg/ha.
- La récolte totale de l'essai atteint `39 810 kg`.
- Tous les nombres sont parfaitement calés à droite ; le tableau est lisible, propre et sans cellule fusionnée.

---

## 7. Le Défi Communautaire TEAM Sahélia (Validation Hebdomadaire)

> ### 🏆 Défi Hebdo n°01 : L'Audit du Fichier Agricole Corrompu
> 
> Rendez-vous dans le dossier `datasets/` et ouvrez le fichier `dataset_agronomique_parakou.csv`.
> 
> **Votre Mission :**
> 1. Créez une nouvelle colonne `Revenu_Brut_FCFA` calculée par la formule :  
>    `=Rendement_kg_ha * Superficie_ha * Prix_Vente_kg_FCFA`
> 2. Créez une colonne `Marge_Nette_FCFA` égale à :  
>    `=Revenu_Brut_FCFA - Cout_Total_FCFA`
> 3. Identifiez le producteur qui a dégagé la plus forte marge nette de toute la base.
> 4. Faites une capture d'écran nette de vos 5 premières lignes avec la barre de formule visible sur la cellule `Marge_Nette_FCFA`.
> 5. **Partage Communauté :** Postez votre capture d'écran sur le canal de discussion TEAM Sahélia avec votre nom et la mention :  
>    *« Défi Manuel 01 - Chapitre 1 Relevé ! »* pour valider votre premier jalon de progression lors de la revue hebdomadaire.

---

## 8. Fiche Mémo Récapitulative Détachable

```text
================================================================================
             FICHE MÉMO DU NUMÉRICIEN & AGRONOME · EXCEL CHAPITRE 1
================================================================================
1. ALIGNEMENT AUTOMATIQUE :
   - Texte à GAUCHE | Nombre à DROITE | Date à DROITE.
   - Si un nombre reste à gauche : c'est du faux texte, il sera ignoré par les calculs.

2. UNITÉS INTERDITES DANS LES CELLULES :
   - Ne tapez jamais "kg", "ha" ou "FCFA" dans la même cellule qu'un chiffre.
   - Mettez l'unité dans l'en-tête de colonne : "Superficie (ha)".

3. SÉPARATEUR DÉCIMAL :
   - Ordinateur FR -> Virgule (2,5).
   - Ordinateur US -> Point (2.5).

4. POIGNÉE DE RECOPIE :
   - Fine croix noire (+) en bas à droite de la cellule active.
   - Double-clic gauche = duplique la formule jusqu'au bas du tableau adjacent.

5. RACCOURCIS SECRETS :
   - Ctrl + Flèche Bas : Saute au bas de la colonne en 1 ms.
   - Ctrl + Maj + Flèche Bas : Sélectionne toutes les données.
   - Alt + = : Génère automatiquement la fonction SOMME.
================================================================================
TEAM Sahélia · Apprendre aujourd’hui. Construire demain.
================================================================================
```
