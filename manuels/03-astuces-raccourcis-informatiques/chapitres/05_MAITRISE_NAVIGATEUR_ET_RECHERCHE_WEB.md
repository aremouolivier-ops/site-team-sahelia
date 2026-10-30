# CHAPITRE 5 : MAÎTRISE DU NAVIGATEUR WEB & RECHERCHE SCIENTIFIQUE AVANCÉE
## Dompter internet, trouver des mémoires en 10 secondes et naviguer en toute sécurité

> **Manuel :** 03 — 50 Astuces & Raccourcis Informatiques du Débutant au Pro  
> **Auteurs :** Sègla Bio KPEROU, Olivier AREMOU & TEAM Sahélia  
> **Temps d’apprentissage :** 30 minutes  
> **Illustration associée :** `schemas/schema_05_recherche_avancee_web.svg`

---

## 1. Objectifs d'Impact Réel
À la fin de ce chapitre, vous saurez :
1. **Ressusciter en 1 seconde un onglet de recherche fermé par inadvertance** grâce à `Ctrl + Maj + T`.
2. **Télécharger des mémoires, thèses et rapports officiels au format PDF direct** sans errer sur des blogs publicitaires (`filetype:pdf`).
3. **Cibler les bases de données d’institutions scientifiques fiables** (CIRAD, IRD, FAO, universités) grâce à l'opérateur `site:`.
4. **Ouvrir 15 articles de recherche en arrière-plan** sans jamais quitter votre page de résultats (`Ctrl + Clic`).
5. **Protéger vos comptes académiques et emails professionnels** contre le vol d’identité avec la double authentification (2FA) et un coffre-fort de mots de passe.

---

## 2. Les 8 Raccourcis Maîtres de Navigation

La plupart des utilisateurs passent leur journée à cliquer avec la souris sur la petite croix des onglets, sur le bouton "Précédent" ou dans la barre d'adresse. En mémorisant ces combinaisons, votre navigation devient fluide et instantanée :

| Raccourci Clavier | Action Concrète | Bénéfice Quotidien |
| :--- | :--- | :--- |
| `Ctrl + Maj + T` | **Ressusciter l'onglet fermé** | Retrouver un article précieux fermé trop vite par erreur. |
| `Ctrl + T` | **Nouvel onglet direct** | Lancer une recherche sans bouger la souris. |
| `Ctrl + W` | **Fermer l'onglet actif** | Nettoyer rapidement ses 40 onglets ouverts. |
| `Ctrl + L` ou `Alt + D` | **Surligner la barre d'adresse** | Taper une nouvelle URL ou copier l'adresse instantanément. |
| `Ctrl + Clic` | **Ouvrir le lien en arrière-plan** | Lire une liste de résultats et pré-charger 10 pages d'un coup. |
| `Ctrl + F` | **Rechercher dans la page** | Trouver le mot "rendement" ou "conclusion" dans un document de 80 pages. |
| `Ctrl + Tab` | **Onglet suivant** | Parcourir ses sources de gauche à droite sans souris. |
| `Ctrl + F5` | **Actualisation forcée** | Vider le cache de la page et forcer le rechargement de la dernière version d'un site. |

![Raccourcis de navigation et recherche scientifique](../schemas/schema_05_recherche_avancee_web.svg)

---

## 3. Les Opérateurs Booléens : Trouver des Pépites Scientifiques sur Google

Quand un étudiant tape simplement *« agriculture biologique au Bénin »* sur Google, il tombe sur des articles de presse grand public, des blogs commerciaux ou des publicités.  
Un chercheur ou un ingénieur de TEAM Sahélia utilise **les opérateurs booléens** pour interroger les serveurs de manière ciblée :

### 1. L'Opérateur de Format : `filetype:pdf`
Cet opérateur ordonne à Google d'ignorer toutes les pages web classiques (HTML) et de ne renvoyer **que des fichiers PDF réels** directement téléchargeables.
* Requête : `filetype:pdf "variétés de maïs" "Parakou"`
* Résultat : Vous obtenez immédiatement des thèses de doctorat, des mémoires d'ingénieurs agronomes et des publications du CRA-Nord (INRAB).

### 2. Les Guillemets Stricts : `"expression exacte"`
Par défaut, si vous tapez trois mots, Google cherche les pages qui contiennent ces mots éparpillés. Les guillemets forcent la présence des mots **dans l'ordre exact**.
* Requête : `"système de culture sous couverture végétale"`
* Résultat : Élimine tous les articles parlant vaguement de toitures ou de couvertures végétales urbaines pour ne cibler que l'agroécologie.

### 3. L'Opérateur de Domaine Institutionnel : `site:`
Permet de fouiller l'intégralité d'un portail scientifique ou gouvernemental, même s'il dispose d'un moteur de recherche interne médiocre.
* Requête : `site:cirad.fr "chenille légionnaire" anacarde`
* Requête : `site:fao.org semences maraîchères Afrique de l'Ouest`
* Résultat : Seuls les rapports officiels validés par les comités scientifiques des institutions sélectionnées apparaissent.

### 4. L'Opérateur d'Exclusion : `-mot`
Élimine le bruit et les résultats commerciaux parasites.
* Requête : `tomate variétés résistantes flétrissement -achat -vente -prix`
* Résultat : Élimine les boutiques de vente en ligne de graines pour isoler les études de phytopathologie.

---

## 4. Google Scholar : Le Moteur des Chercheurs

Ne cherchez pas vos citations académiques sur le Google classique. Rendez-vous sur **`scholar.google.com`** :
1. Chaque résultat affiche le nombre de fois où l'article a été cité par d'autres scientifiques (*« Cité 48 fois »*). Un article très cité est un socle théorique solide.
2. Cliquez sur l'icône de guillemets **`"`** sous l'article : Google Scholar génère automatiquement la citation au format **APA**, **ISO 690** ou **MLA**, prête à être copiée-collée dans votre bibliographie !
3. Cliquez sur **Importer dans BibTeX** ou **Zotero** pour l'intégrer dans votre gestionnaire de références en 1 clic.

---

## 5. Sécurité Web : Coffre-Fort de Mots de Passe & Double Authentification (2FA)

### L'Erreur Mortelle : Le Mot de Passe Unique
Avoir le même mot de passe pour son email, son compte Facebook, son portail universitaire et sa boîte de stockage Cloud est une bombe à retardement. Dès qu'un petit site secondaire est piraté, votre mot de passe fuite sur le Dark Web et tous vos comptes stratégiques sont compromis simultanément.

### Les 2 Règles Inviolables de Protection
1. **Activer la Double Authentification (2FA / Double Facteur) :**
   * Activez-la impérativement sur votre compte Google principal et vos boîtes emails.
   * Même si un pirate devine votre mot de passe, il ne pourra pas se connecter sans le code temporaire envoyé sur votre smartphone (via Google Authenticator ou notification).
2. **Utiliser le Générateur de Mots de Passe Intégré :**
   * Dans Chrome, Edge ou Firefox, faites un clic droit dans un champ de création de mot de passe > **Suggérer un mot de passe fort**.
   * Le navigateur génère une suite aléatoire inviolable de 20 caractères (ex: `k8#mP!9zL$wQ2@vR`) et l'enregistre de manière chiffrée dans votre coffre-fort de compte personnel.

---

## 6. Fiche Mémo Récapitulative Détachable

```text
================================================================================
          FICHE MÉMO · NAVIGATION MAÎTRISÉE & RECHERCHE SCIENTIFIQUE
================================================================================
1. TOP 3 RACCOURCIS NAVIGATEUR :
   - Ctrl + Maj + T : Rouvre instantanément l'onglet fermé par erreur.
   - Ctrl + L : Donne la main sur la barre d'adresse pour copier/chercher.
   - Ctrl + Clic : Ouvre le lien dans un nouvel onglet en arrière-plan.

2. COMBINAISON MAGIQUE GOOGLE SCIENTIFIQUE :
   - filetype:pdf "sujet exact" site:domaine.org -terme_parasite
   - Exemple : filetype:pdf "agroécologie" site:ird.fr -vente

3. CITATIONS INSTANTANÉES :
   - Sur Google Scholar, cliquer sur les guillemets sous un article pour
     copier la référence propre aux normes APA !

4. CYBERSÉCURITÉ :
   - Activer sans attendre la Double Authentification (2FA) sur son compte Google.
================================================================================
TEAM Sahélia · Apprendre. Créer. Innover.
================================================================================
```
