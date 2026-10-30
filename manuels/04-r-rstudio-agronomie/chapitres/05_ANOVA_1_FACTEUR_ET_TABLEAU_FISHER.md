# CHAPITRE 5 : L'ANALYSE DE VARIANCE (ANOVA) À 1 FACTEUR & LE TEST DE FISHER
## Du modèle linéaire à l'interprétation académique irréprochable du tableau de résultats

> **Manuel :** 04 — R & RStudio pour l'Agronomie : Analyse statistique des essais et enquêtes  
> **Auteurs :** Sègla Bio KPEROU, Olivier AREMOU & TEAM Sahélia  
> **Temps d’apprentissage :** 45 minutes de lecture active + 30 minutes d'atelier pratique  
> **Illustration associée :** `schemas/schema_05_anatomie_tableau_anova.svg`  
> **Jeu de données :** `../../01-excel-etudiants-professionnels/datasets/dataset_agronomique_parakou.csv`

---

## 1. Objectifs d'Impact Réel
À la fin de ce chapitre, vous saurez :
1. **Formuler mathématiquement le modèle de l'ANOVA à 1 facteur** ($Y_{ij} = \mu + \alpha_i + \varepsilon_{ij}$).
2. **Exécuter l'analyse de variance** sous R avec la fonction `aov()`.
3. **Décrypter chaque colonne du tableau de l'ANOVA** (`Df`, `Sum Sq`, `Mean Sq`, `F value`, `Pr(>F)`).
4. **Comprendre la mécanique du test $F$ de Fisher-Snedecor** (comparaison de la variance expliquée par le traitement face à la variance résiduelle du hasard).
5. **Rédiger la phrase de conclusion scientifique officielle** dans votre mémoire selon les normes internationales.

---

## 2. Le Modèle Mathématique de l'ANOVA à 1 Facteur

L'Analyse de Variance à 1 facteur (One-Way ANOVA) est utilisée lorsque l'on veut comparer les moyennes d'une variable quantitative continue (ex : Rendement en kg/ha) entre **au moins 3 modalités d'un facteur qualitatif** (ex : Traitements de fertilisation : Témoin, NPK seul, Compost seul, NPK + Compost).

L'équation du modèle linéaire s'écrit :
$$Y_{ij} = \mu + \alpha_i + \varepsilon_{ij}$$

Où :
* $Y_{ij}$ est le rendement mesuré sur la parcelle $j$ ayant reçu le traitement $i$.
* $\mu$ est la moyenne générale théorique de l'essai.
* $\alpha_i$ est **l'effet spécifique du traitement $i$** (ce qu'on cherche à tester).
* $\varepsilon_{ij}$ est l'erreur résiduelle aléatoire (le bruit de fond, micro-variabilité du sol, météo locale).

### Les Deux Hypothèses en Compétition :
* **Hypothèse nulle ($H_0$) :** $\alpha_1 = \alpha_2 = \dots = \alpha_k = 0$ (Aucun des engrais n'a d'effet, toutes les moyennes sont égales).
* **Hypothèse alternative ($H_1$) :** Au moins deux moyennes sont significativement différentes.

![Anatomie du tableau ANOVA de Fisher dans R](../schemas/schema_05_anatomie_tableau_anova.svg)

---

## 3. L'Exécution sous RStudio

Dans votre script R, l'ANOVA s'exécute en deux lignes limpides :

```r
# 1. Ajustement du modèle ANOVA
modele_fertilisation <- aov(Rendement_kg_ha ~ Traitement, data = donnees)

# 2. Affichage du tableau de Fisher officiel
summary(modele_fertilisation)
```

---

## 4. Décryptage Colonne par Colonne du Tableau Résultat

Voici la sortie réelle produite par RStudio sur les données d'essais de Parakou :

```text
            Df  Sum Sq  Mean Sq F value   Pr(>F)    
Traitement   3 8452100 2817367   42.18 1.45e-07 ***
Residuals   16 1068800   66800                     
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1
```

### 1. `Df` (Degrés de liberté) :
* Pour le facteur `Traitement` : $k - 1 = 4 - 1 = \mathbf{3}$ (nous avions 4 modalités de fertilisation).
* Pour les `Residuals` (Erreurs) : $N - k = 20 - 4 = \mathbf{16}$ (20 parcelles au total moins 4 traitements).

### 2. `Sum Sq` (Somme des carrés des écarts) :
* Mesure la dispersion globale. $8\,452\,100$ est la variabilité générée par les engrais, face à $1\,068\,800$ de variabilité résiduelle due au hasard.

### 3. `Mean Sq` (Carrés moyens = Variances) :
* Calcul : $\text{Sum Sq} / \text{Df}$.  
  $\text{Mean Sq(Traitement)} = 8\,452\,100 / 3 = \mathbf{2\,817\,367}$.  
  $\text{Mean Sq(Résidus)} = 1\,068\,800 / 16 = \mathbf{66\,800}$.

### 4. `F value` (Statistique de Fisher) :
* C'est le ratio décisif : $\text{Mean Sq(Traitement)} / \text{Mean Sq(Résidus)}$.  
  $F = 2\,817\,367 / 66\,800 = \mathbf{42{,}18}$.  
* **Ce que cela signifie :** L'effet des engrais est **42 fois plus puissant** que le bruit aléatoire de terrain !

### 5. `Pr(>F)` ($p$-value) & Étoiles de Significativité :
* $p = 1{,}45 \times 10^{-7} = 0{,}000000145$.
* Comme $p < 0{,}001$, R attribue la mention maximale **`***`** (hautement significatif au seuil de $0{,}1$ %).
* On rejette catégoriquement $H_0$.

---

## 5. Comment Rédiger le Résultat dans Son Mémoire ou Article

Ne collez jamais une capture d'écran brute de la console R dans votre document Word !  
Rédigez la phrase canonique adoptée par les revues agronomiques internationales :

> **Formulation académique recommandée :**  
> *« L'analyse de variance à un facteur montre que le type de fertilisation influence de manière hautement significative le rendement en grains du maïs ($F(3, 16) = 42{,}18$ ; $p < 0{,}001$). L'hypothèse nulle d'égalité des rendements est donc rejetée au seuil de 5 %. »*

> [!IMPORTANT]
> **La Limite Fondamentale de l'ANOVA :**  
> L'ANOVA vous prouve qu'il existe une différence significative globale. Mais elle ne vous dit **PAS** quel est le meilleur engrais, ni si le Compost seul est équivalent ou supérieur au NPK !  
> Pour identifier les groupes homogènes et classer les traitements, il faut impérativement enchaîner avec **le test post-hoc de Tukey** (Chapitre 6).

---

## 6. Fiche Mémo Récapitulative Détachable

```text
================================================================================
             FICHE MÉMO · L'ANOVA À 1 FACTEUR SOUS R
================================================================================
1. SYNTAXE OFFICIELLE :
   modele <- aov(Variable_Reponse ~ Facteur_Traitement, data = mon_tableau)
   summary(modele)

2. DEGRÉS DE LIBERTÉ :
   - Df(Facteur)  = k - 1
   - Df(Résidus)  = N - k
   - Total        = N - 1

3. DÉCISION STATISTIQUE :
   - Si Pr(>F) < 0.05 : Effet traitement prouvé scientifiquement (***).
   - Rejeter H0 et procéder au test de comparaison multiple de Tukey.
================================================================================
TEAM Sahélia · Apprendre. Créer. Innover.
================================================================================
```
