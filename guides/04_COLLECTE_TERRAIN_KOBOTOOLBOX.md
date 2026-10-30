# Mini-Guide 04 : Collecte de Données Terrain avec KoboToolbox & Smartphone
## Du questionnaire numérique au champ jusqu'à l'export Excel propre sans saisie papier ni perte de données

> **Collection :** Ressources Libres TEAM Sahélia · Édition Spéciale Terrain 2026  
> **Signature :** *Apprendre aujourd’hui. Construire demain.*  
> **Contexte de déploiement :** Enquêtes agronomiques, suivis d'exploitations, études socio-économiques et inventaires ruraux au Bénin et en Afrique de l'Ouest.  
> **Public visé :** Étudiants en agronomie (FA-UP, FSA, EPAC...), élèves ingénieurs, enquêteurs de projets et jeunes chercheurs.  
> **Prérequis :** Un smartphone Android avec l'application gratuite KoboCollect et un accès à un navigateur web (ordinateur ou téléphone) pour concevoir le formulaire.

---

## Sommaire du Guide
1. **Introduction :** Pourquoi la fiche d'enquête papier est devenue votre pire ennemi sur le terrain.
2. **Étape 1 :** Créer son compte gratuit sur le bon serveur KoboToolbox (Humanitarian vs Non-Humanitarian).
3. **Étape 2 :** Concevoir son premier formulaire d'enquête sans coder (Interface web intuitive).
4. **Étape 3 :** Les types de questions indispensables en agronomie (Texte, Nombre, Choix unique, GPS, Photo, Date).
5. **Étape 4 :** Poser des verrous logiques (Sauts conditionnels : *« Si culture = Maïs, afficher question variété »*).
6. **Étape 5 :** Verrouiller les valeurs aberrantes (Contraintes de validation : éviter un rendement de 500 t/ha par faute de frappe).
7. **Étape 6 :** Déployer le formulaire et lier l'application mobile Android **KoboCollect**.
8. **Étape 7 :** Le mode hors-ligne complet : Enquêter en zone blanche sans aucune connexion internet.
9. **Étape 8 :** Relever le point GPS et capturer des photos de parcelles ou de ravageurs directement dans le formulaire.
10. **Étape 9 :** Synchroniser les données au retour au campement ou en ville.
11. **Étape 10 :** Exporter les données vers Excel / CSV propre et exploitable pour RStudio ou SPSS.
12. **Checklist & Bonnes pratiques :** Les 7 règles de survie d'un chef d'équipe d'enquêteurs.

---

### 1. Pourquoi abandonner définitivement la fiche d'enquête papier
Dans beaucoup d'universités, les étudiants partent encore au village avec 200 photocopies papier dans un sac. Résultat :
- Fiches détrempées par une averse soudaine ou salies par la poussière de piste.
- Écritures d'enquêteurs illisibles, ratures impossibles à déchiffrer 3 semaines plus tard.
- 40 heures perdues à ressaisir manuellement les questionnaires dans Excel, avec une faute de frappe toutes les 10 lignes.
- Aucune preuve de géolocalisation réelle : impossible de prouver au jury que vous êtes bien allé dans le village interrogé.

**Avec KoboToolbox :**
Vous préparez le questionnaire sur votre ordinateur. Vos enquêteurs le remplissent sur leur smartphone hors connexion. Les points GPS et les photos sont horodatés et intégrés automatiquement. Au retour, vous téléchargez un tableau Excel parfaitement nettoyé en 1 clic.

---

### 2. Étape 1 : Choisir le bon serveur KoboToolbox
Rendez-vous sur [kobotoolbox.org](https://www.kobotoolbox.org) et cliquez sur **Create an Account**. Deux serveurs sont proposés :
1. **Global KoboToolbox Server (Recommandé pour tous) :** Hébergé pour les chercheurs, ONG, universités et particuliers.
2. **Humanitarian Server :** Réservé aux agences humanitaires sous mandat ONU.

Créez votre compte gratuit sur le **Global Server** avec votre adresse e-mail universitaire ou personnelle. Notez précieusement votre nom d'utilisateur et votre mot de passe.

---

### 3. Étape 2 : Créer son premier formulaire
Dans votre tableau de bord :
1. Cliquez sur le bouton bleu **New** > **Build from scratch**.
2. Renseignez :
   - **Project Name :** *Exemple : Enquête_Fertilisation_Mais_Parakou_2026*
   - **Sector :** *Agriculture and Food Security*
   - **Country :** *Benin*
3. Vous arrivez sur l'éditeur visuel de formulaire. Chaque question s'ajoute en cliquant sur le bouton **+** (Ajouter une question).

---

### 4. Étape 3 : Les types de questions incontournables
Chaque question doit avoir un type technique adapté pour garantir des données propres :

| Question d'exemple | Type Kobo à choisir | Pourquoi ce type |
| :--- | :--- | :--- |
| *Nom & Prénoms du producteur* | **Text** (Texte court) | Saisie libre du nom |
| *Âge de l'exploitant* | **Number (Integer)** | Empêche d'écrire des lettres |
| *Sexe* | **Select One** (Choix unique) | Choix strict : Homme / Femme |
| *Cultures pratiquées* | **Select Many** (Choix multiple) | Permet de cocher Maïs, Soja, Coton... |
| *Superficie estimée (ha)* | **Decimal** (Nombre décimal) | Autorise les virgules (ex: 2.75) |
| *Position GPS du champ* | **Point (Geopoint)** | Enregistre latitude, longitude, altitude et précision |
| *Photo de la parcelle / ravageur* | **Photo** | Photo compressée horodatée liée à la ligne |
| *Date de l'entretien* | **Date** | Calendrier automatique sans erreur de format |

---

### 5. Étape 4 : Les sauts conditionnels (Skip Logic)
Ne fatiguez pas votre enquêteur avec des questions hors sujet.
*Exemple : Vous ne voulez poser la question « Quelle variété de soja hybride utilisez-vous ? » QUE SI le producteur a répondu qu'il cultive du soja.*

**Comment faire :**
1. Cliquez sur l'engrenage (Paramètres) de la question cible.
2. Rendez-vous dans l'onglet **Skip Logic** (Logique de saut).
3. Cliquez sur **Add a condition** :
   - Choisir la question source : *« Pratiquez-vous la culture du soja ? »*
   - Condition : *« = Oui »*.
4. Résultat : Sur le téléphone, cette question restera invisible tant que l'option « Oui » n'aura pas été cochée.

---

### 6. Étape 5 : Les contraintes de validation (Anti-fautes de frappe)
Un enquêteur fatigué après 6 heures de marche peut taper `350` au lieu de `35` pour l'âge, ou `1200` sacs au lieu de `12` pour le rendement.

**Verrouiller avec les Contraintes (Validation Criteria) :**
1. Dans les paramètres de la question *Âge*, onglet **Validation Criteria**.
2. Condition : `. >= 18 and . <= 95` *(Le point représente la réponse entrée)*.
3. Message d'erreur personnalisé : *« Attention : L'âge doit être compris entre 18 et 95 ans. »*
4. Si l'enquêteur tape `150`, le téléphone bloque le passage à la question suivante en affichant l'alerte en rouge.

---

### 7. Étape 6 : Déployer et configurer KoboCollect sur Android
Une fois le formulaire testé sur ordinateur :
1. Cliquez sur **Save** puis sur **Deploy** (Déployer). Votre formulaire passe au statut actif avec une version v1.
2. Sur votre smartphone Android : installez **KoboCollect** depuis le Google Play Store.
3. Ouvrez KoboCollect, allez dans **Paramètres du projet** (icône en haut à droite) > **Paramètres du serveur** :
   - **URL :** `https://kc.kobotoolbox.org` (ou l'URL exacte affichée dans vos paramètres de compte).
   - **Nom d'utilisateur :** votre identifiant Kobo.
   - **Mot de passe :** votre mot de passe.
4. Revenez à l'écran d'accueil de l'application et appuyez sur **Télécharger un formulaire vierge**.
5. Cochez votre formulaire d'enquête et validez : votre questionnaire est désormais stocké dans la mémoire locale du téléphone !

---

### 8. Étape 7 : Collecter hors connexion sur le terrain (Mode Hors-ligne)
Vous pouvez couper complètement les données mobiles et le Wi-Fi, ou partir dans une zone forestière sans aucun réseau :
1. Appuyez sur **Remplir un formulaire**.
2. Répondez aux questions en swipant de droite à gauche avec le doigt.
3. À la fin du questionnaire, cochez **Marquer le formulaire comme finalisé** et appuyez sur **Enregistrer le formulaire et quitter**.
4. Le questionnaire est sauvegardé dans le dossier sécurisé du téléphone. Vous pouvez enchaîner 10, 50 ou 100 enquêtes dans la journée sans une seule goutte de connexion internet.

---

### 9. Étape 8 : Relevé GPS et photo de terrain
Quand vous arrivez à la question GPS :
1. Sortez à ciel ouvert (ne restez pas sous un hangar en tôle).
2. Cliquez sur **Enregistrer la localisation GPS**.
3. Observez l'indicateur de précision : attendez qu'il passe **sous les 5 mètres** avant de valider.
4. Pour la photo : cadrez correctement le plant ou la parcelle avec bonne luminosité. KoboCollect compresse automatiquement la photo pour ne pas saturer la mémoire du téléphone.

---

### 10. Étape 9 : Synchronisation et export Excel propre
Dès que vous retrouvez une connexion Wi-Fi ou 4G :
1. Dans KoboCollect, appuyez sur **Envoyer un formulaire finalisé**.
2. Cliquez sur **Tout sélectionner** puis **Envoyer les éléments sélectionnés**. En 30 secondes, toutes vos fiches de la journée sont transmises au serveur central.
3. Sur votre ordinateur, connectez-vous à KoboToolbox :
   - Allez dans l'onglet **Data** > **Downloads**.
   - Type d'export : **XLS (Excel)** ou **CSV**.
   - Format de libellé : **XML values and headers** (pour les codes statistiques) ou **Labels** (pour les libellés en clair).
   - Cliquez sur **Export** puis **Download**.
4. Vous obtenez un tableau Excel parfait : 1 ligne = 1 producteur interrogé, chaque colonne = 1 variable, avec les coordonnées GPS exactes prêtes pour QGIS et RStudio !

---

### 11. Checklist des 7 règles de survie sur le terrain
- [ ] **1. Test pilote obligatoire :** Remplissez vous-même 3 fiches fictives complètes sur le téléphone avant d'envoyer les enquêteurs au champ.
- [ ] **2. Batterie externe (Power Bank) :** Le GPS actif consomme la batterie deux fois plus vite. Ayez toujours une batterie externe de 10 000 ou 20 000 mAh.
- [ ] **3. Paramétrer l'heure et la date automatiques :** Assurez-vous que tous les smartphones de l'équipe ont la date et l'heure réglées sur le réseau pour éviter les horodatages erronés.
- [ ] **4. Sauvegarde locale quotidienne :** Même sans internet, vérifiez chaque soir le compteur de formulaires finalisés sur chaque téléphone.
- [ ] **5. Attribution d'un ID enquêteur :** Ajoutez toujours une question au début : *« Code enquêteur »* pour savoir qui a saisi chaque fiche et auditer la qualité du travail.
- [ ] **6. Pas de modification du formulaire en cours d'enquête :** Si vous modifiez une question sur le serveur en plein milieu de la campagne sans redéployer sur tous les téléphones, vous risquez de mélanger deux versions de données.
- [ ] **7. Confidentialité :** Ne partagez jamais le mot de passe administrateur de votre compte Kobo avec les enquêteurs ; donnez-leur uniquement l'accès collecteur.
