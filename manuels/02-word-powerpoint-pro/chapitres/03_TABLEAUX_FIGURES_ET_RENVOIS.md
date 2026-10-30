# CHAPITRE 3 : TABLEAUX, FIGURES, LÉGENDES & TABLES DES ILLUSTRATIONS
## Bannir le bricolage manuel et automatiser les renvois croisés de votre mémoire

> **Manuel :** 02 — Word & PowerPoint Pro pour Mémoires & Soutenances  
> **Auteur :** Olivier AGUIN & TEAM Sahélia  
> **Temps d’apprentissage :** 35 minutes de lecture active + 20 minutes d'atelier pratique  
> **Illustration associée :** `schemas/schema_03_legendes_et_renvois_figures.svg`

---

## 1. Pourquoi le Jury Vérifie Immédiatement Vos Tableaux et Figures

Dès l'ouverture d'un mémoire de Master ou de fin d'études d'ingénieur, le regard d'un professeur ou d'un rapporteur se pose sur deux éléments clés :
1. **La conformité académique des légendes** : une figure avec un titre placé au-dessus ou un tableau sans source indiquée trahit un travail bâclé.
2. **La présence des Tables des matières spéciales** : la *Liste des Tableaux* et la *Liste des Figures* placées en début de document après le sommaire général.

Le piège meurtrier de l'étudiant est d'écrire à la main sous une image :  
`Figure 3 : Carte pédologique de Parakou`.  
Trois semaines plus tard, votre tuteur vous demande d'ajouter une carte d'Afrique de l'Ouest au Chapitre 1. Votre `Figure 3` devient la `Figure 4`. Vous devez alors relire vos 80 pages pour corriger manuellement toutes les occurrences de « comme nous le voyons dans la Figure 3 ». Si vous en oubliez une, le jury vous sanctionne pour incohérence méthodologique.

Dans ce chapitre, nous allons automatiser l'intégralité du cycle de vie de vos illustrations.

---

## 2. La Norme Académique Fondamentale : Règle Dessus / Dessous

![Normes de légendes et tables des illustrations](../schemas/schema_03_legendes_et_renvois_figures.svg)

En rédaction scientifique (normes CAMES, FAO, APA et universités internationales), la règle est absolue et ne souffre aucune exception :

### Règle A : Les Tableaux (Table)
- **Position de la légende :** Toujours **AU-DESSUS** du tableau.
- **Raison ergonomique :** Le lecteur doit connaître la nature et les variables des données avant de commencer à lire les colonnes chiffrées.
- **Exemple normé :**  
  `Tableau 1.1 : Caractéristiques physico-chimiques des sols de Parakou (0-20 cm)`  
  *(Grille du tableau)*  
  *(En-dessous, en petit et italique) : Source : Analyses de laboratoire LASDEL / FA-UP (2025)*

### Règle B : Les Figures, Cartes, Graphiques et Photos (Figure)
- **Position de la légende :** Toujours **EN-DESSOUS** de l'illustration.
- **Raison ergonomique :** L'œil explore d'abord l'image ou le graphique globalement avant d'en lire la description détaillée.
- **Exemple normé :**  
  *(Image de la carte QGIS ou graphique Excel)*  
  `Figure 2.3 : Délimitation GPS et zonage de la station pilote de Parakou`  
  *(En-dessous en petit) : Source : Enquête terrain QGIS TEAM Sahélia (2026)*

---

## 3. Insérer une Légende Automatique dans Word

Ne tapez jamais le mot « Figure » ou « Tableau » au clavier. Laissez le moteur Word s'en charger :

1. Cliquez sur l'image ou sélectionnez votre tableau.
2. Allez dans le ruban **Références**, puis cliquez sur **Insérer une légende**.
3. Dans la boîte de dialogue :
   - Sous **Texte**, choisissez l'étiquette appropriée : `Figure` ou `Tableau`.
   - Si l'étiquette souhaitée n'existe pas, cliquez sur **Nouvelle étiquette...** pour la créer.
   - Sous **Position** :
     - Pour un Tableau : choisissez impérativement **Au-dessus de la sélection**.
     - Pour une Figure : choisissez impérativement **Sous la sélection**.
4. Dans le champ de saisie en haut, ajoutez deux-points et le titre de votre illustration :  
   `: Rendements moyens du maïs selon les doses de compost`.
5. Cliquez sur **OK**.

Word insère un champ dynamique protégé. Si vous insérez une nouvelle figure au milieu de votre document demain, toutes les figures suivantes se renuméroteront automatiquement sans aucune intervention de votre part !

---

## 4. L'Arme Secrète des Professionnels : Le Renvoi Croisé Dynamique

Lorsque vous commentez une illustration dans votre texte, vous devez faire référence à son numéro.

Au lieu d'écrire manuellement :  
*« Comme illustré dans la Figure 2 (page 14)... »*

**Appliquez la méthode du Renvoi Croisé :**
1. Écrivez dans votre paragraphe : *« Comme illustré dans la »*.
2. Allez dans **Références > Renvoi**.
3. Dans la boîte de dialogue :
   - **Type de référence :** choisissez `Figure` (ou `Tableau`).
   - **Insérer un renvoi à :** choisissez **Texte et numéro seulement** (ou *Numéro de page* si vous voulez mentionner la page).
   - Dans la liste du bas, sélectionnez l'illustration visée.
4. Cliquez sur **Insérer**.

Dans votre texte apparaît : `Figure 2.3`.  
Ce n'est pas un texte ordinaire : c'est un lien dynamique. Si la figure devient la `Figure 3.1` plus tard, il vous suffira de sélectionner votre texte et d'appuyer sur la touche magique **F9** : toutes les citations dans vos paragraphes s'actualiseront instantanément !

---

## 5. Générer la Liste des Tableaux et la Liste des Figures

Une fois vos légendes insérées avec la commande officielle, générer vos tables d'illustrations prend exactement 5 secondes :

1. Placez votre curseur dans vos pages liminaires (Section 2), sur la page dédiée à la **Liste des Tableaux**.
2. Allez dans **Références > Insérer une table des illustrations**.
3. Choisissez l'étiquette **Tableau**, cochez *Afficher les numéros de page* et *Aligner les numéros de page à droite*, puis validez.
4. La table complète apparaît avec les titres exacts et les numéros de page correspondants.
5. Répétez l'opération sur la page suivante en choisissant l'étiquette **Figure** pour créer la **Liste des Figures**.

> [!TIP]
> ### Tout mettre à jour avant d'exporter en PDF
> Avant d'envoyer votre document à l'imprimerie ou à votre jury, faites toujours le réflexe de sécurité ultime :  
> Appuyez sur `Ctrl + A` (sélectionner tout le document), puis sur la touche **F9**. Word actualisera simultanément le Sommaire général, la Liste des tableaux, la Liste des figures et l'ensemble des renvois croisés !

---

## 6. Défi Pratique du Chapitre

> ### ⚡ Défi d'Application : Le Trio Tableau, Figure & Renvoi
> 
> 1. Ouvrez un document d'exercice.
> 2. Insérez un tableau de 3 colonnes et appliquez une légende **au-dessus** (`Tableau 1 : Données pluviométriques`).
> 3. Insérez une image et appliquez une légende **en-dessous** (`Figure 1 : Station météo de Parakou`).
> 4. Rédigez un court paragraphe utilisant la commande **Renvoi** pour citer la Figure 1.
> 5. Insérez une nouvelle image avant la première et observez la réactualisation automatique des numéros via la touche **F9**.

---

## 7. Fiche Mémo Récapitulative

```text
================================================================================
          FICHE MÉMO · WORD ACADÉMIQUE : LÉGENDES & RENVOIS
================================================================================
1. RÈGLE DES POSITIONS :
   - TABLEAU  -> Légende AU-DESSUS de la grille chiffrée.
   - FIGURE   -> Légende EN-DESSOUS de l'image ou du graphique.

2. INSÉRER UNE LÉGENDE SANS FAUTE :
   - Clic sur l'élément > Références > Insérer une légende.
   - Jamais de saisie de numéro à la main.

3. RENVOI CROISÉ DANS LE TEXTE :
   - Références > Renvoi > Type : Figure/Tableau > "Texte et numéro seulement".

4. TABLES DES ILLUSTRATIONS :
   - Références > Insérer une table des illustrations (filtrer par Tableau ou Figure).

5. ACTUALISATION GÉNÉRALE :
   - Ctrl + A (tout sélectionner) puis touche F9 (Mettre à jour tous les champs).
================================================================================
```
