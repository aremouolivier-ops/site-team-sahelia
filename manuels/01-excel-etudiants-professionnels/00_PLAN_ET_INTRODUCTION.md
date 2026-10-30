# MANUEL OFFICIEL 01 : EXCEL POUR LES ÉTUDIANTS & PROFESSIONNELS
## Du premier tableau aux tableaux croisés dynamiques : La méthode pratique de terrain
### *Collection des Manuels Stratégiques TEAM Sahélia · Volume 01*

> **Édition :** Version Officielle 2026 · République du Bénin  
> **Signature :** *Apprendre aujourd’hui. Construire demain.*  
> **Auteur principal :** Olivier AGUIN & le collectif TEAM Sahélia  
> **Public visé :** Étudiants en agronomie, économie, gestion, sciences de la santé, élèves ingénieurs, techniciens de projets et professionnels administratifs.  
> **Compatibilité logicielle :** Microsoft Excel (2016, 2019, 2021, Microsoft 365), Google Sheets et LibreOffice Calc.  
> **Volume global estimé :** 60 pages d'équivalent livre avec schémas, tableaux de données réelles, exercices corrigés et défis communautaires.

---

## 1. Pourquoi ce manuel est différent des cours théoriques classiques
La quasi-totalité des cours universitaires sur Excel souffrent du même défaut : ils enseignent des définitions abstraites sans lien avec la réalité du travail au Bénin. On apprend par cœur des noms de boutons, mais le jour où il faut :
1. Nettoyer un fichier d'enquête de 300 producteurs avec des espaces invisibles et des fautes d'orthographe,
2. Calculer le rendement moyen d'une parcelle de maïs avec son écart-type pour un mémoire de fin de cycle,
3. Bloquer une cellule de taux de change ou de prix d'engrais avec `$`,
4. Ou sortir un tableau de bord en 2 minutes avec un Tableau Croisé Dynamique sans retaper un seul chiffre...

... l'étudiant ou le jeune professionnel se retrouve bloqué, passe des nuits blanches et commet des erreurs graves qui décrédibilisent son travail devant un jury ou un employeur.

**Ce manuel prend le contrepied total :**
Chaque chapitre part d'un **cas réel de terrain** (données agricoles de Parakou, budgets d'associations, relevés d'essais, enquêtes démographiques). Vous apprenez en faisant, avec les vraies touches de raccourci, les formules exactes et les pièges éliminatoires à contourner.

---

## 2. Table des Matières Détaillée du Manuel 01

### **MODULE 1 : LES FONDATIONS SOLIDES D'UNE FEUILLE DE CALCUL PRO**
* **Chapitre 1 : Anatomie d'une feuille Excel & Hygiène de Saisie**
  - Les 3 types de données fondamentales : Texte, Nombres réels, Dates/Heures.
  - Pourquoi aligner les nombres à droite et le texte à gauche est une règle non négociable.
  - La poignée de recopie et les séries automatiques (gagner 30 minutes de saisie).
  - Raccourcis clavier incontournables sur clavier AZERTY et QWERTY.
  - *Atelier : Structurer un tableau de dépenses de stage propre et sans erreur.*

### **MODULE 2 : FORMULES ARITHMÉTIQUES & LE SECRET DU DOLLAR ($)**
* **Chapitre 2 : Priorités Mathématiques & Références Absolues vs Relatives**
  - L'ordre des opérations (PEMDAS) et le piège des parenthèses oubliées.
  - Le symbole `$` expliqué simplement : bloquer une ligne, bloquer une colonne, bloquer une cellule (`$B$1`).
  - Cas réel : Appliquer un prix unitaire d'urée fixe à 20 parcelles sans recopier le prix 20 fois.
  - Décoder et corriger les messages d'erreur : `#VALEUR!`, `#DIV/0!`, `#REF!`, `#NOM?`.
  - *Atelier : Calcul de marges brutes agricoles par hectare.*

### **MODULE 3 : STATISTIQUES DESCRIPTIVES & FORMATAGE ACADÉMIQUE**
* **Chapitre 3 : Moyennes, Écarts-types & Mise en Forme de Jury**
  - Fonctions centrales : `SOMME()`, `MOYENNE()`, `MIN()`, `MAX()`, `NB()`, `NBVAL()`.
  - Mesurer la variabilité : `ECARTYPE.STANDARD()` vs `ECARTYPE.PE`.
  - Formater un résultat scientifique pour un mémoire : la notation `Moyenne ± Écart-type` (ex: `4,85 ± 0,32 t/ha`).
  - Gérer les décimales sans arrondir les données sous-jacentes.
  - *Atelier : Analyse comparative de 3 variétés de soja testées en milieu paysan.*

### **MODULE 4 : LE FILTRAGE CONDITIONNEL AVANCÉ**
* **Chapitre 4 : Compter, Sommer et Moyonner sous Conditions**
  - `NB.SI()` : Compter le nombre d'enquêtés masculins ou de parcelles irriguées.
  - `SOMME.SI()` : Sommer la récolte totale uniquement pour la commune de N'Dali.
  - `MOYENNE.SI()` : Calculer le rendement moyen conditionnel selon la variété.
  - Les fonctions multi-critères : `NB.SI.ENS()`, `SOMME.SI.ENS()`.
  - *Atelier : Bilan synthétique d'une campagne de collecte de données.*

### **MODULE 5 : LA LOGIQUE DÉCISIONNELLE AVEC LA FONCTION SI**
* **Chapitre 5 : Tests Logiques, Conditions Multiples & Alertes Automatiques**
  - La structure de base : `=SI(Test_logique ; Valeur_si_vrai ; Valeur_si_faux)`.
  - Combiner avec `ET()` et `OU()` : Définir des règles d'éligibilité strictes.
  - Les conditions imbriquées et la fonction `SI.CONDITIONS()`.
  - Mise en forme conditionnelle : Colorer automatiquement en rouge les rendements déficitaires et en vert les réussites.
  - *Atelier : Barème de validation des parcelles éligibles à une prime de semences certifiées.*

### **MODULE 6 : NETTOYAGE & PRÉPARATION DE BASES DE DONNÉES POLLUÉES**
* **Chapitre 6 : Rendre Exploitable un Fichier d'Enquête Réel**
  - Supprimer les espaces invisibles parasites avec `SUPPRESPACE()`.
  - Harmoniser les textes : `MAJUSCULE()`, `MINUSCULE()`, `NOMPROPRE()`.
  - Découper une colonne en plusieurs : L'outil *« Convertir / Texte en colonnes »* (séparer nom et téléphone).
  - Détecter et supprimer les doublons en 1 clic.
  - Sécuriser la saisie future : Créer des listes déroulantes avec la *Validation des données*.
  - *Atelier : Nettoyage d'une base brute de 200 lignes issue de KoboToolbox.*

### **MODULE 7 : GRAPHIQUES SCIENTIFIQUES POUR SOUTENANCE & RAPPORTS**
* **Chapitre 7 : Choisir, Épurer et Exporter un Graphique de Qualité Jury**
  - Quel graphique pour quelle donnée ? (Histogramme, Courbe temporelle, Nuage de points).
  - Supprimer la pollution visuelle (chartjunk) : adieu aux effets 3D ringards et aux quadrillages lourds.
  - Ajouter des barres d'erreur (écart-type) professionnelles sur un histogramme.
  - Exporter le graphique vers Word ou PowerPoint en vectoriel ou haute résolution sans pixelisation.
  - *Atelier : Conception de la figure maîtresse de résultats pour une soutenance de mémoire.*

### **MODULE 8 : LES TABLEAUX CROISÉS DYNAMIQUES (TCD)**
* **Chapitre 8 : L'Outil Ultime de Synthèse & Mini Tableaux de Bord**
  - Pourquoi le TCD est la compétence la plus demandée par les recruteurs.
  - Les 4 règles d'or de la base de données source (pas de cellules fusionnées, pas de totaux dans la table).
  - Disposition : Lignes, Colonnes, Valeurs, Filtres.
  - Afficher en pourcentages du total ou par tranches numériques.
  - Créer des filtres visuels interactifs avec les Segments (*Slicers*).
  - *Atelier : Création d'un tableau de bord de suivi d'exploitation en 10 minutes.*

---

### **GRAND DÉFI FINAL & CERTIFICATION COMMUNAUTAIRE TEAM SAHÉLIA**
* Étude de cas intégrale : 1 base de données réelle de 100 producteurs de la région de Parakou.
* 5 livrables demandés (nettoyage, formules conditionnelles, statistiques, graphique de jury, TCD).
* Critères de validation pour obtention du **Badge de Compétence Excel Pro TEAM Sahélia**.
