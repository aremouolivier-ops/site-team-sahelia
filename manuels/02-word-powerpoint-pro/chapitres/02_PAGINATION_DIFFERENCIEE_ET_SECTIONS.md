# CHAPITRE 2 : SAUTS DE SECTION & PAGINATION DIFFÉRENCIÉE SOUS WORD
## Résoudre définitivement le casse-tête de la page de garde, des chiffres romains et de la page 1

> **Manuel :** 02 — Word & PowerPoint Pro pour Mémoires & Soutenances  
> **Auteur :** Olivier AGUIN & TEAM Sahélia  
> **Temps d’apprentissage :** 30 minutes de lecture active + 15 minutes d'application sur machine  
> **Illustration associée :** `schemas/schema_02_pagination_sections_word.svg`

---

## 1. Le Cauchemar Universitaire Classique

Tout étudiant ou jeune chercheur a vécu ce drame la veille d'une soumission de mémoire :
- Vous insérez un numéro de page en bas de votre document.
- Un gros **« 1 »** apparaît fièrement sur votre **Page de garde officielle** avec le logo de votre université.
- Vous effacez le « 1 » sur la page de garde : **tous les numéros de page de votre mémoire de 80 pages disparaissent instantanément**.
- Pire encore : la commission des thèses ou le secrétariat pédagogique exige que les pages préliminaires (dédicaces, remerciements, sigles, résumé, sommaire) soient numérotées en **chiffres romains minuscules (i, ii, iii, iv)**, et que le corps de texte commence strictement à la **page 1 sur l'Introduction Générale**.

Vous tentez de créer trois fichiers Word différents pour bricoler l'impression : résultat, la table des matières automatique est fausse et le document PDF final est désynchronisé.

Dans ce chapitre, nous allons désamorcer ce problème une bonne fois pour toutes grâce aux **Sauts de section** et à la règle d'or de **désactivation de la liaison**.

---

## 2. Anatomie d'un Mémoire en Trois Sections Indépendantes

Pour que Word applique des règles de numérotation différentes au sein du même fichier, il faut diviser le document en **Sections**. Une section est une frontière hermétique pour les en-têtes et les pieds de page.

![Pagination différenciée et sauts de section](../schemas/schema_02_pagination_sections_word.svg)

Comme le démontre le schéma officiel ci-dessus, un mémoire académique professionnel comporte toujours **trois sections distinctes** :

1. **Section 1 : La Couverture (Page de Garde)**
   - Une seule page (ou deux si page de titre intérieure).
   - **Pied de page :** Totalement vide (aucun chiffre affiché).
2. **Section 2 : Les Pages Liminaires**
   - Dédicace, Remerciements, Table des matières, Liste des tableaux, Liste des figures, Sigles et abréviations, Résumé (Français) et Abstract (Anglais).
   - **Pied de page :** Chiffres romains minuscules : `i, ii, iii, iv, v...`.
3. **Section 3 : Le Cœur du Mémoire**
   - De l'Introduction Générale jusqu'aux Annexes.
   - **Pied de page :** Chiffres arabes classiques commençant impérativement à `1` : `1, 2, 3, 4, 5...`.

---

## 3. La Procédure Exacte en 5 Étapes Chronométrées

### Étape 1 : Créer la rupture entre la Couverture et les Liminaires
1. Placez votre curseur tout en bas du texte de votre page de garde.
2. Rendez-vous dans le ruban **Mise en page** (ou **Disposition** selon la version d'Office).
3. Cliquez sur **Sauts de page**, puis sous la rubrique **Sauts de section**, cliquez sur **Page suivante**.
4. Vous avez créé la frontière entre la **Section 1** et la **Section 2**.

> [!NOTE]
> Ne choisissez JAMAIS un simple *Saut de page standard (`Ctrl + Entrée`)* pour séparer ces blocs. Seul le *Saut de section (Page suivante)* permet de couper la dépendance des pieds de page.

### Étape 2 : Créer la rupture entre les Liminaires et l'Introduction
1. Rendez-vous à la fin de votre page de Résumé / Abstract (dernière page avant l'Introduction).
2. Cliquez à nouveau sur **Mise en page > Sauts de page > Sauts de section > Page suivante**.
3. Vous êtes désormais au tout début de votre Chapitre 1 (Introduction Générale), marquant le début de la **Section 3**.

### Étape 3 : La manipulation décisive — DÉSACTIVER « Lier au précédent »
C'est ici que 95% des étudiants échouent : par défaut, Word connecte secrètement le pied de page d'une nouvelle section à celui de la précédente. Il faut rompre ce cordon ombilical.

1. Allez sur la première page de la **Section 2** (votre page de dédicace ou de sommaire).
2. Faites un double-clic tout en bas dans la zone de pied de page pour l'activer.
3. Regardez le ruban supérieur qui vient d'apparaître : **En-tête et pied de page**.
4. Dans le groupe *Navigation*, le bouton **« Lier au précédent »** est surligné en gris ou jaune (actif).
5. **Cliquez dessus pour le DÉSACTIVER**.
6. Répétez exactement la même opération sur la première page de la **Section 3** (Introduction Générale) : double-cliquez sur son pied de page et **désactivez impérativement « Lier au précédent »**.

> [!CAUTION]
> Si vous oubliez de désactiver *« Lier au précédent »*, toute modification apportée au pied de page de la Section 2 effacera ou modifiera le pied de page de la Couverture !

### Étape 4 : Numéroter la Section 2 en chiffres romains (i, ii, iii)
1. Tout en ayant votre curseur dans le pied de page de la **Section 2** :
2. Cliquez sur **Numéro de page > Format des numéros de page...**.
3. Dans la liste déroulante *Format de la numérotation*, sélectionnez : `i, ii, iii, ...`.
4. En bas, cochez **À la suite de la section précédente** (ou *Commencer à : i*).
5. Cliquez sur **OK**, puis insérez votre numéro : **Numéro de page > Bas de page > Numéro normal 3 (centré ou aligné à droite)**.
6. Vos pages liminaires affichent désormais `i, ii, iii` sans qu'aucun chiffre n'apparaisse sur votre couverture !

### Étape 5 : Démarrer le corps de texte à la page 1 (Section 3)
1. Placez votre curseur dans le pied de page de la **Section 3** (Introduction).
2. Cliquez sur **Numéro de page > Format des numéros de page...**.
3. Choisissez le format classique `1, 2, 3, ...`.
4. Sous la rubrique *Numérotation des pages*, cochez impérativement le bouton radio :  
   **Commencer à : 1**.
5. Validez avec **OK**, puis insérez le numéro centré.

🎉 **Félicitations !** Votre document est scellé selon les normes académiques internationales les plus strictes.

---

## 4. Astuce Bonus : Alterner Page Portrait et Page Paysage (Grands Tableaux)

En agronomie ou en sciences économiques, il arrive fréquemment qu'un grand tableau d'analyses de sol ou qu'une carte de zonage parcellaire QGIS doive s'afficher en **mode Paysage (horizontal)** au milieu d'un mémoire au format Portrait.

Sans les sauts de section, changer l'orientation fait basculer les 80 pages en paysage.

**La méthode professionnelle en 3 clics :**
1. Juste avant le grand tableau : **Mise en page > Sauts de page > Sauts de section > Page suivante**.
2. Basculez la page du tableau en paysage : **Mise en page > Orientation > Paysage**.
3. Juste après le grand tableau : réinsérez un autre saut de section : **Mise en page > Sauts de page > Sauts de section > Page suivante**.
4. Remettez la page suivante en portrait : **Mise en page > Orientation > Portrait**.
5. Seule la page du tableau est horizontale, et la numérotation se poursuit sans la moindre coupure !

---

## 5. Défi Pratique du Chapitre

> ### ⚡ Défi d'Application : Le Gabarit à Trois Sections
> 
> 1. Créez un nouveau document Word de 5 pages.
> 2. Configurez les 3 sections selon les directives apprises.
> 3. Vérifiez la conformité :
>    - Page 1 : Page de garde (Pied vide).
>    - Pages 2 et 3 : Sommaire et Sigles (Numérotées `i` et `ii`).
>    - Pages 4 et 5 : Introduction et Matériel (Numérotées `1` et `2`).
> 4. Cliquez sur **Fichier > Imprimer** pour prévisualiser la perfection du résultat.

---

## 6. Fiche Mémo Récapitulative

```text
================================================================================
          FICHE MÉMO · WORD ACADÉMIQUE : SAUTS DE SECTION & PAGINATION
================================================================================
1. RÈGLE D'OR N°1 :
   - Jamais de saut de page standard (Ctrl + Entrée) pour changer de format de page.
   - Toujours : Mise en page > Sauts de page > Sauts de section (Page suivante).

2. RÈGLE D'OR N°2 (INDISPENSABLE) :
   - Double-clic dans le Pied de page de la nouvelle section.
   - DÉSACTIVER le bouton "Lier au précédent" dans le ruban supérieur.

3. PAGINATION DES LIMINAIRES :
   - Format des numéros de page > Chiffres romains (i, ii, iii).

4. PAGINATION DE L'INTRODUCTION :
   - Format des numéros de page > Chiffres arabes (1, 2, 3) > Commencer à : 1.

5. CHANGEMENT D'ORIENTATION LOCALISÉ (TABLEAU GÉANT PAYSAGE) :
   - Entourer la page spéciale de 2 sauts de section, puis Orientation > Paysage.
================================================================================
```
