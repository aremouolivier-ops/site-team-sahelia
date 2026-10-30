# CHAPITRE 4 : OPTIMISATION, MAINTENANCE & DÉPANNAGE D’UN PC LENT
## Retrouver la fluidité du premier jour sans payer un technicien ni formater Windows

> **Manuel :** 03 — 50 Astuces & Raccourcis Informatiques du Débutant au Pro  
> **Auteurs :** Sègla Bio KPEROU, Olivier AREMOU & TEAM Sahélia  
> **Temps d’apprentissage :** 35 minutes  
> **Illustration associée :** `schemas/schema_04_diagnostic_maintenance_pc.svg`

---

## 1. Objectifs d'Impact Réel
À la fin de ce chapitre, vous saurez :
1. **Diviser par 3 le temps de démarrage de votre ordinateur** en éliminant les programmes parasites qui s'exécutent en cachette.
2. **Récupérer entre 10 et 30 Go d'espace disque** sur votre partition système `C:\` en purgeant les caches invisibles (`%temp%` et `cleanmgr`).
3. **Réparer les fichiers système Windows endommagés** grâce aux commandes natives `sfc /scannow` et `DISM`.
4. **Vérifier la santé mécanique de votre disque dur** en 10 secondes pour anticiper un crash avant qu'il ne détruise vos données (`wmic diskdrive get status`).
5. **Régler le bug classique du clavier qui inverse les lettres A/Q et Z/W** en 1 seconde (`Alt + Maj`).

---

## 2. Pourquoi Votre PC Rame : Les 4 Vérités Cachées

Quand un ordinateur devient lent après 1 an d'utilisation, 95 % des utilisateurs pensent qu'il est "vieux" ou qu'il faut formater le disque dur. C'est faux. L'usure d'un ordinateur n'est pas mécanique : elle est logicielle et due à un encombrement progressif de 4 goulets d'étranglement :

1. **L'asphyxie du démarrage :** Chaque logiciel installé (Zoom, Skype, Teams, Spotify, uTorrent, pilotes d'imprimante) s'auto-autorise à démarrer en même temps que Windows.
2. **La saturation du disque `C:\` :** Quand un disque SSD ou HDD a moins de 15 % d'espace libre, Windows ne peut plus créer ses fichiers d'échange mémoire temporaires (Swap/Pagefile), ce qui fige la machine.
3. **La corruption silencieuse de bibliothèques Windows :** Suite à des coupures d'électricité brutales ou des arrêts forcés au bouton, des fichiers DLL deviennent illisibles.
4. **Le bridage d'économie d'énergie :** Par défaut sur batterie ou en mode "Utilisation normale", le processeur fonctionne à 50 % de sa fréquence réelle.

![Diagnostic et maintenance PC](../schemas/schema_04_diagnostic_maintenance_pc.svg)

---

## 3. Étape 1 : Nettoyer le Démarrage en 30 Secondes

1. Pressez la combinaison magique : **`Ctrl + Maj + Échap`** pour ouvrir directement le Gestionnaire des tâches.
2. Cliquez sur l'onglet **Applications de démarrage** (ou l'icône de compteur de vitesse).
3. Vous voyez la liste de tous les logiciels qui se lancent automatiquement au démarrage du PC.
4. Regardez la colonne **Impact du démarrage** :
   * Les logiciels marqués **Élevé** ralentissent considérablement l'allumage.
5. Faites un clic droit > **Désactiver** sur tous les programmes non indispensables :
   * Spotify, Discord, Teams, Skype, Steam, Adobe Update Helper, Cortana, etc.
   * *Note de sécurité : Ne désactivez pas votre antivirus (Windows Security) ni vos pilotes audio/touchpad.*
6. Au prochain redémarrage, votre PC sera prêt à l'emploi en quelques secondes au lieu de plusieurs minutes.

---

## 4. Étape 2 : La Purge des 3 Dossiers Poubelles Invisibles

Windows stocke tous les fichiers d'installation décompressés et les miniatures de photos dans des répertoires temporaires oubliés.

### Action A : Vider le dossier temporaire utilisateur (`%temp%`)
1. Pressez **`Win + R`** (Exécuter).
2. Tapez exactement : `%temp%` puis appuyez sur **Entrée**.
3. Un dossier s'ouvre contenant des milliers de fichiers obsolètes.
4. Faites **`Ctrl + A`** (Tout sélectionner), puis **`Maj + Suppr`** (Suppression définitive directe sans passer par la corbeille).
5. Si Windows affiche une boîte de dialogue disant qu'un fichier est actuellement utilisé, cochez *"Faire ceci pour tous les éléments actuels"* et cliquez sur **Ignorer**.

### Action B : Le Nettoyage de Disque Approfondi (`cleanmgr`)
1. Pressez **`Win + R`**, tapez `cleanmgr`, puis pressez **Entrée**.
2. Sélectionnez le lecteur `C:`.
3. Cliquez impérativement sur le bouton **Nettoyer les fichiers système** en bas à gauche (nécessite les droits administrateur).
4. Cochez :
   * *Nettoyage de Windows Update* (peut libérer jusqu'à 15 Go d'anciennes mises à jour !).
   * *Fichiers journaux de mise à niveau de Windows*.
   * *Fichiers temporaires*.
   * *Corbeille*.
5. Cliquez sur **OK** et confirmez.

---

## 5. Étape 3 : La Commande de Réparation Miraculeuse (`sfc /scannow`)

Si Windows subit des blocages inexpliqués, la barre des tâches ne répond plus ou l'Explorateur redémarre tout seul, il est inutile de réinstaller le système.

1. Ouvrez l'Invite de commandes en Administrateur :
   * **`Win + R`** > tapez `cmd` > pressez **`Ctrl + Maj + Entrée`**.
2. Tapez la commande suivante et appuyez sur **Entrée** :

```cmd
sfc /scannow
```

Windows va scanner l'intégralité de ses fichiers vitaux (System File Checker). S'il détecte un fichier altéré ou corrompu par un arrêt forcé, il va automatiquement le remplacer par une copie saine conservée en cache compressé.  
À la fin de l'opération, le message réparateur s'affiche :  
*« Le programme de protection des ressources Windows a trouvé des fichiers endommagés et les a réparés avec succès. »*

> [!TIP]
> **En cas d'erreur tenace : la commande DISM**  
> Si `sfc` indique qu'il n'a pas pu réparer certains fichiers, lancez la commande de restauration de l'image Windows :  
> `DISM /Online /Cleanup-Image /RestoreHealth`  
> Puis relancez `sfc /scannow`. Le système sera 100 % neuf.

---

## 6. Étape 4 : Vérifier l'État de Santé de Son Disque Dur en 5 Secondes

Pour savoir si votre disque dur va lâcher la semaine prochaine :
1. Dans l'Invite de commandes (`cmd`), tapez :

```cmd
wmic diskdrive get status
```

2. Si la réponse est **`OK`**, les sondes d'autodiagnostic matériel S.M.A.R.T. du disque indiquent une mécanique ou des cellules flash saines.
3. Si la commande répond **`Caution`**, **`Bad`** ou **`Pred Fail`** : **ALERTE ROUGE !** Votre disque est en train de mourir. Sauvegardez immédiatement l'intégralité de vos documents sur un disque externe ou sur le Cloud avant la panne finale.

---

## 7. Fiche Mémo Récapitulative Détachable

```text
================================================================================
          FICHE MÉMO · MAINTENANCE EXPRESS & DÉPANNAGE PC
================================================================================
1. ACCÉLÉRER LE DÉMARRAGE :
   - Ctrl + Maj + Échap -> Onglet Démarrage -> Désactiver tout le superflu.

2. LIBÉRER 10 À 20 GO :
   - Win + R -> %temp% -> Tout sélectionner (Ctrl+A) -> Supprimer (Maj+Suppr).
   - Win + R -> cleanmgr -> Nettoyer les fichiers système -> Windows Update.

3. RÉPARER LES PLANTAGES DU SYSTÈME :
   - CMD en Administrateur -> sfc /scannow

4. CLAVIER INVERSÉ (A au lieu de Q) :
   - Pressez Alt + Maj (ou Win + Espace) pour repasser en Français AZERTY.

5. SANTÉ DU DISQUE DUR :
   - CMD -> wmic diskdrive get status (Doit impérativement renvoyer "OK").
================================================================================
TEAM Sahélia · Apprendre. Créer. Innover.
================================================================================
```
