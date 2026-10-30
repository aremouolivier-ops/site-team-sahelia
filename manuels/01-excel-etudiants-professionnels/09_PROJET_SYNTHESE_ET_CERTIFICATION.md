# GRAND PROJET DE SYNTHÈSE & CERTIFICATION OFFICIELLE
## L'Audit Intégral de la Campagne Agricole du Borgou 2026
### *Évaluation Pratique pour l'Obtention du Badge de Compétence Excel Pro · TEAM Sahélia*

> **Manuel Associé :** Manuel 01 — Excel pour les Étudiants & Professionnels  
> **Norme de Certification :** Référentiel de Compétences TEAM Sahélia (Code : `TS-SKL-EXCEL-01`)  
> **Durée estimée de l'épreuve :** 2 heures de travail autonome en conditions réelles  
> **Fichier support :** `datasets/dataset_agronomique_parakou.csv`

---

## 1. Contexte de la Mission Professionnelle

Vous êtes recruté(e) comme Consultant(e) Junior en analyse de données par la Fédération des Producteurs Agricoles du Borgou (Bénin).  
Le coordonnateur vous remet le fichier brut d'enquête issu de la campagne 2026 portant sur les communes de Parakou, N'Dali, Tchaourou et Bembèrèkè.

**La situation :**  
Le bailleur de fonds international et le conseil d'administration exigent un rapport d'audit technique et financier avant vendredi soir. Les données brutes doivent être assainies, les marges économiques calculées, les performances comparées par culture et un tableau de bord interactif doit être présenté lors de l'assemblée générale.

---

## 2. Les 5 Épreuves du Projet de Synthèse

### ÉPREUVE 1 : Nettoyage & Sécurisation de la Base (20 Points)
1. **Suppression des anomalies de texte :** Créez une feuille `Donnees_Nettoyees`. Vérifiez que tous les noms de producteurs sont formatés en casse propre (`NOMPROPRE`), sans aucun espace parasite au début ou à la fin (`SUPPRESPACE`).
2. **Élimination des doublons :** Vérifiez qu'il n'existe aucun doublon sur la colonne `ID_Parcelle`.
3. **Validation des données futures :** Mettez en place sur la colonne `Commune` une liste déroulante interdisant toute autre saisie que : `Parakou`, `N'Dali`, `Tchaourou`, `Bembèrèkè`.
4. **Validation numérique :** Verrouillez la colonne `Superficie_ha` pour refuser toute valeur inférieure à `0,1 ha` ou supérieure à `20 ha`.

---

### ÉPREUVE 2 : Formules Arithmétiques & Gestion du Dollar (20 Points)
En utilisant les cellules de paramètres fixes hors tableau (`Prix_NPK_sac = 24 000 FCFA`, `Prix_Uree_sac = 25 000 FCFA`, `Taux_Inflation = 8 %`) :
1. Calculez pour chaque parcelle la **Récolte totale en kg** (`=Superficie * Rendement`).
2. Calculez le **Revenu brut de vente** en FCFA.
3. Calculez la **Marge nette d'exploitation** (`Revenu brut - Coût total`) en utilisant impérativement les références absolues `$` là où cela s'impose.
4. Calculez la **Marge nette à l'hectare** (`FCFA/ha`).
5. Aucune formule ne doit comporter de chiffre écrit "en dur" qui devrait être lié à une cellule de paramètre.

---

### ÉPREUVE 3 : Bilan Statistique Académique pour le Rapport (20 Points)
Construisez un encadré de synthèse statistique respectant les standards de jury :
1. Calculez la **Moyenne globale**, la **Médiane**, le **Minimum**, le **Maximum** et l'**Écart-Type Standard** (`ECARTYPE.STANDARD`) des rendements.
2. Calculez le **Coefficient de Variation (CV %)** et rédigez en une phrase votre interprétation agronomique sous le tableau.
3. Utilisez la formule avec fonction `TEXTE()` pour afficher la ligne de résultat de mémoire officielle :  
   `Moyenne ± Écart-type` arrondie à deux décimales avec l'unité `kg/ha`.

---

### ÉPREUVE 4 : Décisions Stratégiques & Filtrage Conditionnel (20 Points)
1. À l'aide de `=MOYENNE.SI()` et `=SOMME.SI()`, construisez le tableau récapitulatif comparant les 4 cultures :
   - Nombre de parcelles
   - Superficie cumulée (ha)
   - Rendement moyen (kg/ha)
   - Marge nette cumulée (FCFA)
2. À l'aide de la fonction `=SI(ET(...))`, créez une colonne `Statut_Prime` :
   - Si la culture est du **Maïs** ET que la marge nette par hectare dépasse **400 000 FCFA** : attribuez `"Prime d'Excellence"`.
   - Si la marge nette par hectare est inférieure à **100 000 FCFA** : attribuez `"Alerte Vulnérabilité"`.
   - Sinon : attribuez `"Marge Normale"`.
3. Appliquez une mise en forme conditionnelle discrète (pastels) pour faire ressortir ces statuts.

---

### ÉPREUVE 5 : Le Tableau Croisé Dynamique & Tableau de Bord Interactif (20 Points)
1. Créez un TCD sur une feuille séparée nommée `Dashboard_Direction`.
2. Croisez la variable `Commune` (en Lignes) avec la variable `Culture` (en Colonnes).
3. Affichez dans la zone Valeurs la **Moyenne du Rendement (kg/ha)** avec format monétaire/nombre propre (séparateur de milliers, 1 décimale).
4. Insérez un **Segment interactif (*Slicer*)** sur la variable `Commune`.
5. Insérez un **Graphique Croisé Dynamique épuré** (sans quadrillage lourd, axes nommés clairement) lié au TCD.

---

## 3. Barème de Notation & Critères de Validation

| Épreuve | Points | Critères d'Évaluation Stricts |
| :--- | :--- | :--- |
| **Épreuve 1 (Nettoyage)** | / 20 | Zéro espace parasite, liste déroulante opérationnelle, contrôle de saisie actif |
| **Épreuve 2 (Formules & $)** | / 20 | Utilisation rigoureuse de `$`, formules étirables sans bogue, aucun chiffre en dur |
| **Épreuve 3 (Statistiques)** | / 20 | Bon choix de formule d'écart-type (`.STANDARD`), CV calculé, formule `TEXTE` propre |
| **Épreuve 4 (Logique & SI)** | / 20 | Syntaxe de `ET` sans erreur, guillemets respectés, tableau comparatif équilibré |
| **Épreuve 5 (TCD & Dashboard)** | / 20 | Structure du TCD conforme, moyenne bien paramétrée, segment interactif fonctionnel |
| **TOTAL** | **/ 100** | **Seuil d'Admissibilité à la Certification : 80 / 100** |

---

## 4. Obtention du Badge Officiel de Compétence TEAM Sahélia

Une fois votre classeur Excel finalisé :
1. Enregistrez votre fichier sous le nom standardisé :  
   `EXCEL_PRO_2026_[VOTRE_NOM]_[VOTRE_PRENOM].xlsx`.
2. Soumettez votre fichier lors de la session de revue hebdomadaire de la communauté TEAM Sahélia ou envoyez-le au comité technique pour audit.
3. Dès validation avec une note supérieure ou égale à **80/100** :
   - Votre identifiant unique de certification est généré (ex : `TS-SKL-2026-EXCEL-001`).
   - Votre **Badge Numérique Haute Définition avec QR Code de Vérification Officiel** est émis sur la plateforme web TEAM Sahélia ([`site-team-sahelia/verifier.html`](file:///C:/Users/DELL/Desktop/site-team-sahelia/verifier.html)).
   - Vous pouvez l'ajouter à votre CV, votre profil LinkedIn et votre dossier de soutenance universitaire.
