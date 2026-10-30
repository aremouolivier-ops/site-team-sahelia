# CHAPITRE 3 : LA STRATÉGIE DE SAUVEGARDE 3-2-1 & SÉCURITÉ DES CLÉS USB
## Protéger ses données de recherche, désinfecter une clé vérolée et ne plus jamais perdre un mémoire

> **Manuel :** 03 — 50 Astuces & Raccourcis Informatiques du Débutant au Pro  
> **Auteurs :** Sègla Bio KPEROU, Olivier AREMOU & TEAM Sahélia  
> **Temps d’apprentissage :** 35 minutes  
> **Illustration associée :** `schemas/schema_03_strategie_sauvegarde_321.svg`

---

## 1. Objectifs d'Impact Réel
À la fin de ce chapitre, vous saurez :
1. **Appliquer la règle universelle 3-2-1** : Assurer une résilience absolue face au vol d'ordinateur, au crash matériel ou à l'incendie.
2. **Désinfecter une clé USB infectée par le virus de raccourcis** dans les cybercafés ou secrétariats en 30 secondes sans logiciel payant.
3. **Récupérer vos fichiers disparus** masqués par les scripts malveillants avec la commande système `attrib`.
4. **Vacciner votre support amovible** pour empêcher les virus de s'exécuter automatiquement via `autorun.inf`.
5. **Activer la synchronisation Cloud automatique gratuite** (Google Drive ou OneDrive) sur vos dossiers vitaux sans saturer votre connexion internet.

---

## 2. Le Drame de la Clé USB Unique et le Principe 3-2-1

Chaque année à l'université et dans les entreprises, des centaines de personnes perdent des mois de travail acharné à cause d'une illusion : *« Mon mémoire est en sécurité car il est sur ma clé USB dans ma poche »*.

Une clé USB est le support de stockage **le plus fragile et le plus vulnérable au monde** :
* Elle s'égare facilement ou peut être volée.
* Ses cellules de mémoire flash peuvent griller instantanément si retirée brutalement sans éjection sécurisée.
* Elle s'infecte immédiatement dès qu'elle est branchée sur un ordinateur public (imprimerie, cybercafé, vidéoprojecteur d'amphithéâtre).

### La Règle d'Or 3-2-1 : Le Standard Militaire
Pour qu'un document de recherche ou un rapport professionnel soit considéré comme "existant", il doit respecter la formule suivante :

$$\text{3 Copies} \quad \longrightarrow \quad \text{2 Supports Physiques Différents} \quad \longrightarrow \quad \text{1 Copie Hors-Site (Cloud)}$$

1. **3 Copies Distinctes :**
   * Copie 1 : Votre version de travail quotidienne sur votre ordinateur.
   * Copie 2 : Une sauvegarde miroir sur un support externe (disque dur externe ou clé de sauvegarde dédiée qui reste chez vous).
   * Copie 3 : Une copie déportée accessible à distance.
2. **2 Supports Physiques Différents :**
   * Ne faites pas vos 3 copies sur le même disque dur dans des dossiers différents ! Si le disque interne tombe en panne, toutes les copies sont anéanties simultanément. Utilisez au moins deux supports de technologies distinctes (SSD interne + disque externe).
3. **1 Copie Hors-Site (Déportée / Cloud) :**
   * Si votre sacoche est dérobée avec votre PC et votre clé USB ensemble, seule la copie hors-site (Google Drive, OneDrive, serveur distant) vous sauvera la vie.

![Stratégie de sauvegarde 3-2-1 et désinfection clé USB](../schemas/schema_03_strategie_sauvegarde_321.svg)

---

## 3. Le Virus des Raccourcis USB : Diagnostic & Traitement de Choc

### Le Symptôme Classique
Vous branchez votre clé USB après être passé dans une imprimerie ou un cybercafé. Horreur : tous vos dossiers (ex: `Cours`, `Memoire_Final`, `Photos`) ont disparu ! À la place, vous voyez des icônes de raccourcis portant les mêmes noms, avec une petite flèche bleue et une taille dérisoire de 1 Ko.

> [!CAUTION]
> **LE PIÈGE MORTEL : NE CLIQUEZ SURTOUT PAS SUR CES RACCOURCIS !**  
> Ce ne sont pas vos dossiers. Ce sont des scripts VBS ou des exécutables malveillants (`.lnk` pointant vers un fichier `.vbs`). En double-cliquant dessus, vous installez immédiatement le cheval de Troie sur votre propre PC !

### La Vérité : Vos Fichiers Sont Toujours Là !
Le virus n'a pas effacé vos données. Il s'est contenté de :
1. Modifier les attributs de vos vrais dossiers en les déclarant **fichiers système ultra-cachés** (invisibles même si vous cochez "Afficher les éléments masqués").
2. Créer des faux raccourcis portant le même nom pour vous tromper.

### La Commande de Sauvetage Miraculeuse (`attrib`)
Voici la procédure exacte pas à pas pour récupérer 100 % de vos données sans installer aucun antivirus :

1. Branchez la clé USB et repérez sa lettre de lecteur dans l'Explorateur (par exemple `G:` ou `F:`).
2. Ouvrez l'Invite de commandes en mode administrateur :
   * Pressez **`Win + R`**, tapez **`cmd`**, puis pressez **`Ctrl + Maj + Entrée`** (pour ouvrir en Administrateur).
3. Tapez la commande suivante en remplaçant impérativement la lettre `G:` par celle de votre clé USB, puis appuyez sur **Entrée** :

```cmd
attrib -h -r -s /s /d G:\*.*
```

**Que fait cette commande chirurgicale ?**
* `-h` (Un-hide) : Supprime l'attribut *Caché* imposé par le virus.
* `-r` (Read-only) : Supprime l'attribut *Lecture seule*.
* `-s` (System) : Supprime l'attribut *Fichier Système*.
* `/s` : Applique le traitement à tous les sous-dossiers et fichiers imbriqués.
* `/d` : Traite également les répertoires eux-mêmes.

4. Retournez dans votre clé USB : **tous vos vrais dossiers sont réapparus intacts !**
5. Supprimez manuellement tous les petits raccourcis parasites de 1 Ko ainsi que les fichiers suspects à l'extension bizarre (`.vbs`, `.exe` inconnus dans un dossier caché `Drive` ou `System Volume Information`).

---

## 4. Vaccination Préventive de la Clé USB (`autorun.inf`)

Pour empêcher les anciens virus de propager automatiquement leur infection dès l'insertion de la clé :
1. Ouvrez votre clé USB à la racine.
2. Créez un nouveau dossier (`Ctrl + Maj + N`).
3. Nommez ce dossier exactement : `autorun.inf`.
4. Ouvrez ce dossier et déposez-y un fichier texte vide nommé `lecture_seule.txt`.
5. Lorsqu'un malware tente de créer son propre fichier de démarrage `autorun.inf` à la racine pour infecter d'autres ordinateurs, Windows lui interdira l'écriture car un répertoire du même nom existe déjà et ne peut être écrasé !

---

## 5. Synchronisation Cloud Automatique Sans Dépenser 1 Franc

Pour automatiser la copie hors-site (le "1" de la règle 3-2-1) :
1. Téléchargez et installez l'application officielle **Google Drive pour ordinateur** ou connectez votre compte **OneDrive** intégré à Windows.
2. Ne synchronisez pas tout votre disque dur (cela saturerait votre forfait data et votre espace gratuit de 15 Go).
3. Synchronisez uniquement votre dossier stratégique : `02_RECHERCHE_ET_MEMOIRE`.
4. À chaque fois que vous faites `Ctrl + S` dans Word, le fichier est instantanément sauvegardé sur votre SSD et envoyé sur les serveurs sécurisés en arrière-plan.
5. Même si votre ordinateur est détruit ou volé ce soir, vous empruntez un smartphone ou le PC d'un collègue, vous vous connectez à votre compte Google Drive : votre mémoire est disponible, à la virgule près de votre dernière sauvegarde.

---

## 6. Fiche Mémo Récapitulative Détachable

```text
================================================================================
          FICHE MÉMO · SAUVEGARDE INFAILLIBLE & DÉCONTAMINATION USB
================================================================================
1. LA FORMULE DE SURVIE 3-2-1 :
   - 3 copies / 2 supports physiques distincts / 1 copie cloud déportée.

2. VIRUS DE RACCOURCIS CLÉ USB :
   - Ne jamais cliquer sur les raccourcis de 1 Ko !
   - Ouvrir CMD en Administrateur (Win + R -> cmd -> Ctrl + Maj + Entrée).
   - Taper : attrib -h -r -s /s /d G:\*.*  (remplacer G: par la lettre de la clé).

3. VACCINATION PRÉVENTIVE :
   - Créer un dossier nommé "autorun.inf" à la racine de chaque clé USB.

4. RÉFLEXE QUOTIDIEN :
   - À chaque fin de session de rédaction : envoyer une copie PDF de son mémoire
     sur sa propre adresse email universitaire.
================================================================================
TEAM Sahélia · Apprendre. Créer. Innover.
================================================================================
```
