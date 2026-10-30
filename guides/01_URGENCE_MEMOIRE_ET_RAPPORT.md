# Mini-Guide 01 : Urgence Mémoire & Rapport sous Word & Excel
## Les 10 règles d'or pour un document académique impeccable, structuré et sans stress de mise en page

> **Collection :** Ressources Libres TEAM Sahélia · Édition 2026  
> **Signature :** *Apprendre aujourd’hui. Construire demain.*  
> **Public visé :** Étudiants de Licence et Master (Agronomie, Sciences, Droit, Gestion) préparant un mémoire, un rapport de stage ou un projet d’étude.  
> **Format :** Manuel pratique direct (8 pages d'équivalent imprimé), zéro blabla, étapes reproductibles.

---

## Sommaire du Guide
1. **La règle n°1 :** Ne touchez jamais à la taille de police à la main (Utiliser les Styles).
2. **Le piège de la page blanche :** Créer un sommaire automatique en 2 clics.
3. **Le casse-tête de la pagination :** Numéroter en chiffres romains (I, II...) puis arabes (1, 2, 3...).
4. **Les sauts de section vs sauts de page :** Pourquoi votre mise en page saute la veille de l'impression.
5. **Tableaux d’essais propres sous Word :** Ne collez plus de captures d’écran floues.
6. **Excel pour non-statisticiens :** Aligner les décimales et formater un tableau de données d’essai.
7. **Formules de base indispensables :** `MOYENNE`, `ECARTYPE`, `NB.SI` sans se tromper.
8. **Graphiques lisibles pour jury :** Supprimer le quadrillage inutile et nommer les axes.
9. **Légendes automatiques de figures :** Éviter de retaper « Figure 12 » à chaque ajout d'image.
10. **L’export PDF final sans surprise :** Préserver la netteté et les polices avant impression.

---

### Règle 1 : Adoptez les « Styles » dès la première ligne
L’erreur la plus fréquente chez l'étudiant est de sélectionner un titre, de le mettre en taille 16, en gras et en couleur verte à la main. Quand le document fait 60 pages et que le tuteur demande de changer la police, il faut 4 heures pour tout refaire.

**La méthode pro :**
- Utilisez le volet **Accueil > Styles**.
- Pour votre grand titre de chapitre : appliquez le style **Titre 1**.
- Pour les sous-parties : appliquez le style **Titre 2**.
- Pour les détails : appliquez **Titre 3**.
- Pour changer l’apparence de tous vos titres en 5 secondes : faites **Clic droit sur le style > Modifier**, changez la police ou la couleur. Tout votre mémoire s'actualise instantanément.

---

### Règle 2 : Le Sommaire automatique (Table des matières)
Une fois que vos titres ont leurs styles (Titre 1, Titre 2) :
1. Placez votre curseur là où vous voulez votre sommaire.
2. Allez dans l'onglet **Références > Table des matières**.
3. Choisissez le premier modèle automatique.
4. Votre table des matières est créée avec les numéros de page exacts.
5. **Mise à jour :** Si vous ajoutez du texte, faites simplement un clic droit sur la table > **Mettre à jour les champs > Mettre à jour toute la table**.

---

### Règle 3 : Pagination différenciée (Romains I, II, III puis Arabes 1, 2, 3)
Tout jury universitaire exige que les pages liminaires (Dédicace, Remerciements, Résumé, Sommaire) soient numérotées en chiffres romains ou sans numéro, et que l'Introduction commence à la **page 1**.

**Procédure infaillible en 4 étapes :**
1. Allez à la fin de votre Sommaire (la dernière page avant l'Introduction).
2. Rendez-vous dans **Disposition > Sauts de page > Sauts de section : Page suivante**. *(Attention : ne faites pas un simple saut de page !)*
3. Allez sur la page de l'Introduction, double-cliquez dans le pied de page.
4. Dans le ruban supérieur, **DÉCOCHEZ** le bouton **« Lier au précédent »**.
5. Allez dans **Numéro de page > Format des numéros de page** : cochez **« À partir de : 1 »**.
6. Sur la section précédente (vos remerciements), réglez le format en chiffres romains (i, ii, iii). Vos deux sections sont désormais totalement indépendantes.

---

### Règle 4 : Fini les touches « Entrée » à répétition
Quand vous voulez changer de page pour démarrer un nouveau chapitre, **n'appuyez jamais 15 fois sur la touche Entrée** ! Si vous ajoutez une seule phrase 20 pages plus haut, tout votre texte descendra de trois lignes et vos titres se retrouveront au milieu d'une page.
- Utilisez toujours le raccourci clavier universel : **Ctrl + Entrée**.
- Cela crée un saut de page propre. Votre nouveau chapitre débutera toujours exactement en haut de la page suivante, quoi que vous modifiiez avant.

---

### Règle 5 : Tableaux de données dans Word sans catastrophe
Un tableau dans un mémoire scientifique doit être aéré, sobre et professionnel :
- Évitez les quadrillages noirs épais sur toutes les cases.
- Adoptez le standard académique : un trait horizontal en haut, un trait sous la ligne d'en-tête, et un trait en bas du tableau. Aucun trait vertical.
- Dans les propriétés du tableau : cochez **« Répéter la ligne d'en-tête sur chaque page »**. Si votre tableau s'étend sur deux pages, le lecteur aura toujours les noms des colonnes en haut de la seconde page sans que vous ayez à les recopier.
- Cochez également **« Ne pas autoriser le fractionnement des lignes sur plusieurs pages »** pour éviter qu'une phrase ne soit coupée en deux horizontalement entre deux pages.

---

### Règle 6 : Excel — Décimales et chiffres significatifs
Dans un essai agronomique ou une enquête socio-économique, rien ne discrédite plus un étudiant que d'afficher des moyennes avec 9 chiffres après la virgule (`14,3829472 kg/ha`).
- Sélectionnez votre colonne de valeurs.
- Clic droit > **Format de cellule > Nombre**.
- Fixez le nombre de décimales à **1** ou **2** selon la précision de votre instrument de mesure.
- Alignez toujours les **textes à gauche** et les **chiffres à droite**. De cette façon, les virgules sont visuellement alignées et le lecteur repère immédiatement les grandeurs.

---

### Règle 7 : Les 3 formules Excel qui sauvent vos analyses
1. **La Moyenne :** `=MOYENNE(B2:B31)`
   *Calcule la moyenne arithmétique de votre échantillon.*
2. **L'Écart-type (dispersion) :** `=ECARTYPE.STANDARD(B2:B31)`
   *Montre la variabilité de vos mesures. Dans votre rapport, écrivez toujours vos résultats sous la forme : `Moyenne ± Écart-type` (ex : `24,5 ± 1,8 q/ha`).*
3. **Le comptage sous condition :** `=NB.SI(C2:C100; "Attaqué")`
   *Compte instantanément le nombre de plants ou d'individus répondant à un critère précis sans comptage manuel.*

---

### Règle 8 : Graphiques scientifiques qui plaisent aux jurys
- Supprimez le fond gris et les effets 3D (strictement interdits dans les mémoires scientifiques).
- Supprimez le quadrillage horizontal lourd ou passez-le en gris très clair (#E0E0E0).
- Nommez toujours clairement l'axe horizontal (abscisses avec variable et unité) et l'axe vertical (ordonnées avec variable et unité, ex : *Rendement en grains (t/ha)*).
- Mettez une légende uniquement si vous avez plusieurs séries de données. Si vous n'avez qu'une seule barre, le titre de l'axe suffit.

---

### Règle 9 : Numérotation automatique des Figures et Tableaux
Au lieu d'écrire manuellement « Figure 1 : Carte des parcelles » dans le texte :
1. Faites un clic droit sur votre image ou carte dans Word.
2. Choisissez **Insérer une légende**.
3. Choisissez l'étiquette **Figure** (ou **Tableau**).
4. Tapez votre titre explicatif.
5. Quand vous devez citer la figure dans un paragraphe, allez dans **Références > Renvoi**, choisissez « Figure » et « Numéro et texte seulement ». Si vous déplacez la figure plus tard, son numéro se mettra à jour automatiquement partout dans le texte !

---

### Règle 10 : L'enregistrement et l'export PDF final
La veille de l'impression, l'ordinateur de l'imprimeur n'a souvent pas les mêmes polices ou la même version de Word que vous.
- **N'emmenez JAMAIS seulement un fichier .docx à l'imprimerie !**
- Allez dans **Fichier > Exporter > Créer un document PDF/XPS**.
- Cliquez sur **Options** et vérifiez que **« Optimiser pour la qualité d'impression »** est coché.
- Feuilletez attentivement le fichier PDF généré de la première à la dernière page sur votre écran : ce que vous voyez sur ce PDF est **exactement** ce qui sortira de l'imprimante papier.

---

### Checklist de fin de document (À imprimer et cocher)
- [ ] Le sommaire a été mis à jour après la relecture finale.
- [ ] L'introduction commence bien à la page 1 en chiffres arabes.
- [ ] Tous les tableaux ont une ligne d'en-tête et sont cités dans le texte.
- [ ] Toutes les figures ont une légende et leur source mentionnée.
- [ ] Les moyennes dans les résultats sont accompagnées de leur unité.
- [ ] Le document a été exporté en PDF et vérifié.
- [ ] Une copie de sauvegarde est enregistrée sur une clé USB et envoyée sur votre propre adresse email.

---
**TEAM Sahélia · Communauté Numérique & Agronomie**  
*Rejoignez nos ateliers pratiques et découvrez nos formations complètes sur notre plateforme officielle.*
