# Mini-Guide 03 : Prompts de Recherche & Vibe Coding Sans Tricher
## Exploiter l’Intelligence Artificielle pour ses mémoires, analyses et synthèses sans hallucination ni plagiat

> **Collection :** Ressources Libres TEAM Sahélia · Édition Numérique 2026  
> **Signature :** *Apprendre aujourd’hui. Construire demain.*  
> **Public visé :** Étudiants, chercheurs, développeurs débutants et agronomes souhaitant gagner du temps sans détruire leur crédibilité académique.  
> **Modèles compatibles :** Claude, ChatGPT, Gemini, Perplexity, DeepSeek.

---

## Sommaire du Guide
1. **Introduction :** Le paradoxe de l'étudiant avec l'IA (accélérateur puissant ou piège mortel).
2. **Ce que l'IA fait magnifiquement bien** vs **Ce qu'elle ne sait pas faire seule**.
3. **Le danger absolu : Les fausses citations et articles imaginaires (Hallucinations).**
4. **La Méthode C.R.E.D. :** Structurer un prompt académique irréprochable.
5. **Prompt Type n°1 :** Synthétiser un article scientifique PDF de 25 pages en 5 minutes.
6. **Prompt Type n°2 :** Reformuler un paragraphe confus sans perdre la rigueur scientifique.
7. **Prompt Type n°3 :** Vérifier la cohérence d'un protocole expérimental.
8. **Le Vibe Coding expliqué simplement :** Qu'est-ce que c'est et comment ça change la donne ?
9. **Exemple pratique de Vibe Coding :** Écrire un script Python pour nettoyer un fichier de données sans avoir appris la syntaxe pendant 3 ans.
10. **La Charte d'Honnêteté de TEAM Sahélia :** Comment déclarer son usage de l'IA en soutenance.

---

### 1. Le paradoxe de l'étudiant avec l'IA
L'intelligence artificielle est désormais accessible à tous sur smartphone et ordinateur. Mais face à un travail académique, deux attitudes extrêmes se manifestent :
1. **Le refus stérile :** Refuser d'utiliser ces outils par peur de tricher, et perdre des dizaines d'heures sur des tâches mécaniques que l'IA réalise en 30 secondes.
2. **Le copier-coller aveugle :** Demander à l'IA de « rédiger le chapitre 2 de mon mémoire », coller le résultat sans relire, et se faire humilier par le jury parce que les références citées n'existent nulle part dans le monde réel.

**La position de TEAM Sahélia :** L'IA est un **assistant de laboratoire**, pas l'auteur de votre mémoire. Vous êtes le pilote, l'IA est le copilote.

---

### 2. Le piège n°1 : L'hallucination bibliographique
Les modèles de langage (LLM) sont conçus pour prédire des suites de mots cohérentes, pas pour stocker une base de données de vérité absolue. Si vous demandez :
> *« Donne-moi 5 articles scientifiques publiés au Bénin sur la chenille légionnaire d'automne avec leurs auteurs et dates. »*

L'IA va très probablement fabriquer des noms de chercheurs béninois crédibles, des titres d'articles parfaits et des noms de revues réelles, mais **l'article n'existe pas**. Si votre tuteur ou un membre du jury tape le titre sur Google Scholar, votre tricherie est exposée immédiatement.

**La règle d'or :**
Ne demandez JAMAIS à un LLM classique de vous inventer des références bibliographiques. Fournissez-lui vous-même le texte réel de l'article (copié-collé ou PDF téléversé) et demandez-lui d'analyser **exclusivement** ce texte.

---

### 3. La méthode de prompt C.R.E.D. (Contexte, Rôle, Exigence, Délimitation)
Pour obtenir une réponse précise et scientifique, ne tapez jamais une phrase vague. Utilisez la structure C.R.E.D. :

- **C - Contexte :** Expliquez la situation (*« Je suis étudiant en Master d'agronomie, je prépare une revue de littérature sur la fertilisation organique du maïs au Nord-Bénin. »*).
- **R - Rôle :** Définissez la posture de l'IA (*« Agis comme un chercheur senior en agronomie et sciences du sol. »*).
- **E - Exigence :** Détaillez ce que vous attendez (*« Relève dans le texte fourni ci-dessous : 1. La dose optimale testée, 2. Le rendement moyen obtenu, 3. Les limites méthodologiques relevées par les auteurs. »*).
- **D - Délimitation :** Posez les barrières de sécurité (*« Réponds uniquement à partir du texte ci-dessous. Si une information n'est pas présente, écris explicitement 'Non mentionné par l'auteur' sans spéculer. »*).

---

### 4. Les 3 Prompts Pratiques Prêts à l'Emploi

#### Prompt 1 : Fiche de lecture accélérée d'un article scientifique
```text
Tu es un relecteur scientifique exigeant. 
Voici l'extrait (ou le document PDF) d'un article de recherche :
[COLLER L'EXTRAIT DU DOCUMENT]

Rédige une fiche de lecture synthétique comprenant :
1. La question centrale de recherche (en 1 phrase).
2. Le dispositif expérimental utilisé (taille de l'échantillon, répétitions, facteurs étudiés).
3. Les 3 résultats numériques majeurs avec leurs unités de mesure.
4. La conclusion des auteurs.
Règle stricte : N'invente aucun chiffre non présent dans le texte.
```

#### Prompt 2 : Reformulation académique sans perte de sens
```text
Voici un paragraphe préliminaire rédigé pour mon rapport :
"[COLLER VOTRE PARAGRAPHE BRUT]"

Propose deux reformulations plus académiques et fluides, en respectant :
- L'utilisation du vocabulaire agronomique / scientifique précis.
- La concision (supprime les répétitions et adverbes superflus).
- La préservation rigoureuse de l'idée d'origine sans en altérer la conclusion.
```

#### Prompt 3 : Détecteur de faiblesses avant la soutenance
```text
Voici le résumé de ma méthodologie d'essai :
"[DÉCRIRE VOTRE DISPOSITIF, PAR EXEMPLE 4 TRAITEMENTS ET 3 RÉPÉTITIONS]"

Identifie les 3 principales questions pièges ou critiques qu'un jury d'agronomie pourrait soulever sur ce dispositif, et explique comment je devrais argumenter pour y répondre.
```

---

### 5. Qu'est-ce que le « Vibe Coding » ?
Le terme de **Vibe Coding** (popularisé par Andrej Karpathy, ancien directeur IA de Tesla et cofondateur d'OpenAI) désigne une nouvelle manière de créer des outils logiciels :
> *Au lieu d'écrire chaque ligne de syntaxe (les points-virgules, les boucles `for`, les variables) de mémoire, le créateur décrit en langage naturel, étape par étape, le résultat qu'il veut atteindre. L'IA génère le code, l'utilisateur teste, observe le résultat (« la vibe »), demande des corrections et itère jusqu'à obtenir un outil fonctionnel.*

Ce n'est pas du code au hasard : c'est la capacité pour un non-informaticien (un agronome, un gestionnaire, un logisticien) de **construire des programmes réels en quelques minutes** sans avoir suivi un cursus d'ingénieur de 5 ans.

---

### 6. Exemple concret de Vibe Coding pour l'agronomie
**Problème réel :** Vous avez un fichier Excel avec 500 relevés de terrain. Dans la colonne des hauteurs de plants, certaines valeurs sont en centimètres, d'autres en mètres, et certaines cellules contiennent des textes accidentels comme « mort » ou « non mesuré ». À la main, nettoyer ce fichier prend 3 heures.

**Le prompt de Vibe Coding (adressé à l'IA) :**
```text
J'ai un fichier Excel nommé 'mesures_mais.xlsx'.
La colonne A s'appelle 'ID_Plante', la colonne B s'appelle 'Traitement', et la colonne C s'appelle 'Hauteur'.
Dans la colonne C, j'ai des valeurs mixtes :
- Des chiffres normaux en cm (ex: 145, 160)
- Des chiffres en mètres (ex: 1.45, 1.60) qui devraient être multipliés par 100 pour être en cm
- Du texte comme 'non germé', 'mort' ou des cases vides.

Écris-moi un petit script Python utilisant la bibliothèque pandas qui :
1. Ouvre 'mesures_mais.xlsx'
2. Convertit toutes les hauteurs en centimètres propres
3. Remplace les textes par la valeur vide (NaN)
4. Calcule la moyenne et l'écart-type de la hauteur pour chaque groupe de Traitement
5. Enregistre le résultat propre dans un nouveau fichier 'mesures_propres.xlsx'
Explique-moi pas à pas comment exécuter ce script sur mon ordinateur en 3 commandes simples.
```

**Résultat :** L'IA vous fournit un script Python complet de 15 lignes. Vous le lancez, vos données sont nettoyées en 2 secondes, sans aucune erreur de calcul manuel.

---

### 7. La Charte d'Éthique & Honnêteté TEAM Sahélia
Pour rester irréprochable face à votre université ou votre employeur :
1. **Transparence :** Si vous utilisez l'IA pour améliorer votre syntaxe ou déboguer un script de calcul, mentionnez-le dans la section *« Outils informatiques et remerciements »* de votre rapport (*« L'auteur a utilisé l'outil Claude 3.5 Sonnet pour l'assistance à la mise en forme rédactionnelle et l'aide au codage des scripts statistiques. L'ensemble des données et conclusions reste sous la responsabilité exclusive de l'auteur. »*).
2. **Vérification systématique :** Ne laissez jamais une formule ou une phrase générée par l'IA entrer dans votre document final sans l'avoir comprise et validée vous-même.
3. **Zéro imposture :** La valeur d'un diplômé de TEAM Sahélia réside dans sa maîtrise réelle du terrain et de la donnée.

---
**TEAM Sahélia · Pôle Innovation & Vibe Coding**  
*Participez à nos ateliers en direct pour apprendre à coder et analyser avec l'IA sur des cas réels du Bénin.*
