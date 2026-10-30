# CHAPITRE 6 : PROJET CAPSTONE — CHECKLIST D’AUDIT & AUTOMATISATION DU PC PROFESSIONNEL
## Mettre son ordinateur aux normes professionnelles, automatiser son entretien et valider sa certification

> **Manuel :** 03 — 50 Astuces & Raccourcis Informatiques du Débutant au Pro  
> **Auteurs :** Sègla Bio KPEROU, Olivier AREMOU & TEAM Sahélia  
> **Temps d’apprentissage :** 45 minutes  
> **Illustration associée :** `schemas/schema_06_checklist_certification_pc.svg`

---

## 1. Objectifs du Projet Capstone
Ce projet de synthèse clôture le **Pôle 1 : Bureautique & Outils Essentiels** de TEAM Sahélia.  
À l’issue de cet atelier pratique, vous aurez :
1. **Audité intégralement un poste de travail** (votre propre ordinateur ou celui d'un camarade/collègue) selon la grille officielle en 20 points.
2. **Créé et déployé un script d’automatisation en 1 clic** (`maintenance_sahelia.bat`) pour purger les fichiers inutiles et optimiser le réseau chaque semaine.
3. **Appliqué la règle 3-2-1** et sécurisé vos données d'études et de recherche contre tout risque de ransomware ou vol de clé USB.
4. **Validé les compétences pratiques** requises pour l'obtention du Badge Officiel de Compétence **« Productivité & Maintenance PC »** (`TS-SKL-2026-003`).

---

## 2. Le Script d’Entretien Automatique : `maintenance_sahelia.bat`

Au lieu de faire manuellement chaque semaine la manipulation des dossiers temporaires et des caches DNS, vous allez concevoir un fichier de script Windows Batch natif qui s'exécute en 3 secondes.

### Procédure de Création Pas à Pas
1. Ouvrez le Bloc-notes de Windows (`Win + R`, tapez `notepad`, appuyez sur **Entrée**).
2. Copiez-collez scrupuleusement le code script suivant :

```bat
@echo off
title TEAM SAHELIA - SCRIPT OFFICIEL DE MAINTENANCE EXPRESS
color 0A

echo ======================================================================
echo          TEAM SAHELIA - MAINTENANCE AUTOMATIQUE DU POSTE DE TRAVAIL
echo                   Norme Academique & Professionnelle 2026
echo ======================================================================
echo.

echo [1/4] Nettoyage du cache temporaire utilisateur (%temp%)...
del /q /f /s "%temp%\*.*" >nul 2>&1
echo       -> Cache utilisateur purge avec succes.

echo.
echo [2/4] Nettoyage des fichiers temporaires systeme de Windows...
del /q /f /s "C:\Windows\Temp\*.*" >nul 2>&1
echo       -> Cache Windows purge.

echo.
echo [3/4] Vidage du cache de resolution DNS (Acceleration Navigation)...
ipconfig /flushdns >nul
echo       -> Cache DNS reinitialise.

echo.
echo [4/4] Verification rapide de l'integrite du disque dur...
wmic diskdrive get status

echo.
echo ======================================================================
echo    FELICITATIONS ! Votre session est propre, legere et optimisee.
echo                  TEAM Sahelis - Apprendre. Creer. Innover.
echo ======================================================================
echo.
pause
```

3. Cliquez sur **Fichier > Enregistrer sous...** :
   * Emplacement : `D:\UNIVERSITE_ET_PROJETS_2026\04_ADMIN_CONTRATS_ET_CV\` ou sur votre Bureau.
   * Nom du fichier : changez l'extension pour mettre `"maintenance_sahelia.bat"` (avec les guillemets pour éviter qu'il ne se nomme `.bat.txt`).
   * Type : **Tous les fichiers (*.*)**.
   * Encodage : **UTF-8**.
4. **Pour l'exécuter :** Faites un simple clic droit sur le fichier > **Exécuter en tant qu'administrateur**.  
   En 5 secondes, votre PC est nettoyé, son cache DNS est vidé et la santé de votre disque est confirmée !

![Checklist d'audit et automatisation PC](../schemas/schema_06_checklist_certification_pc.svg)

---

## 3. La Grille d'Audit Officielle des 20 Critères (Sur 100 Points)

Passez votre ordinateur au crible de cette grille d'évaluation. Chaque critère validé rapporte **5 points** :

### Pôle A : Hygiène du Stockage & Disque Système (25 Points)
* [ ] **Critère 1 :** Moins de 10 icônes sur le Bureau (Bureau désencombré). *(5 pts)*
* [ ] **Critère 2 :** Plus de 20 % d'espace libre sur la partition principale `C:\`. *(5 pts)*
* [ ] **Critère 3 :** Dossier `%temp%` vidé de ses vieux fichiers d'installation. *(5 pts)*
* [ ] **Critère 4 :** Nettoyage de disque `cleanmgr` exécuté sur les fichiers de mise à jour Windows Update. *(5 pts)*
* [ ] **Critère 5 :** Statut physique du disque dur confirmé à `OK` via `wmic diskdrive get status`. *(5 pts)*

### Pôle B : Arborescence & Sauvegardes Infaillibles (25 Points)
* [ ] **Critère 6 :** Arborescence en 4 piliers (`01_COURS`, `02_RECHERCHE`, `03_DONNEES`, `04_ADMIN`) créée sur une partition ou un dossier racine dédié. *(5 pts)*
* [ ] **Critère 7 :** Tous les fichiers récents renommés selon la norme ISO 8601 `AAAA-MM-JJ_Projet_Etape_vX.X`. *(5 pts)*
* [ ] **Critère 8 :** Sous-dossier `01_Brut_LectureSeule` sanctuarisé pour les données d'enquêtes de terrain. *(5 pts)*
* [ ] **Critère 9 :** Synchronisation Cloud active (Google Drive ou OneDrive) sur le dossier stratégique du mémoire. *(5 pts)*
* [ ] **Critère 10 :** Une copie miroir hors-ligne présente sur un deuxième support matériel (Règle 3-2-1). *(5 pts)*

### Pôle C : Cybersécurité & Protection Matérielle (25 Points)
* [ ] **Critère 11 :** Dossier leurre `autorun.inf` créé à la racine de toutes les clés USB utilisées. *(5 pts)*
* [ ] **Critère 12 :** Affichage des extensions de fichiers activé dans l'Explorateur (pour démasquer les faux `.pdf.exe`). *(5 pts)*
* [ ] **Critère 13 :** Double authentification (2FA) configurée et active sur le compte Google principal. *(5 pts)*
* [ ] **Critère 14 :** Aucun mot de passe identique partagé entre les comptes stratégiques. *(5 pts)*
* [ ] **Critère 15 :** Antivirus Windows Defender à jour sans alerte critique en suspens. *(5 pts)*

### Pôle D : Vitesse, Raccourcis & Automatisation (25 Points)
* [ ] **Critère 16 :** Historique du presse-papier `Win + V` activé et maîtrisé. *(5 pts)*
* [ ] **Critère 17 :** Outil de capture de zone `Win + Maj + S` utilisé à la place des photos au smartphone. *(5 pts)*
* [ ] **Critère 18 :** Moins de 5 applications non indispensables autorisées au démarrage dans le Gestionnaire des tâches. *(5 pts)*
* [ ] **Critère 19 :** Analyse d'intégrité système `sfc /scannow` exécutée avec succès. *(5 pts)*
* [ ] **Critère 20 :** Script `maintenance_sahelia.bat` créé et testé avec succès. *(5 pts)*

---

## 4. Barème d'Attribution & Certification

| Score Obtenu | Diagnostic & Décision du Conseil |
| :--- | :--- |
| **0 à 45 points** | ⚠️ **Poste Vulnérable & À Risque :** Danger critique de perte de mémoire ou d'infection USB. Révision immédiate des chapitres 2 et 3 requise. |
| **50 à 75 points** | 🟡 **Poste En Voie de Professionnalisation :** Bonnes bases, mais sauvegardes ou hygiène de démarrage encore incomplètes. |
| **80 à 100 points** | 🟢 **POSTE DE TRAVAIL CERTIFIÉ CONFORME :** Machine rapide, résiliente et parfaitement organisée. |

---

## 5. Comment Obtenir Votre Badge de Compétence Officiel

Les étudiants et membres de TEAM Sahélia ayant obtenu **au moins 80/100** à la grille d'audit sont éligibles à la délivrance du **Badge Officiel de Compétence n°3** :
* **Intitulé :** Certificat de Compétence en Productivité & Maintenance Informatique
* **Identifiant :** `TS-SKL-2026-003`
* **Autorité :** Conseil Académique & Technique de TEAM Sahélia · FA-UP Parakou

Pour soumettre votre validation :
1. Prenez une capture nette (`Win + Maj + S`) de votre script `maintenance_sahelia.bat` s'exécutant dans l'invite de commande.
2. Prenez une capture de votre arborescence en 4 piliers propre.
3. Remplissez votre grille d'évaluation et présentez-la au responsable technique de cohorte ou téléversez-la sur le portail de validation.

---

## 6. Fiche Synthèse du Pôle 1 (Bureautique & Outils Essentiels)

Toutes nos félicitations ! Avec l'achèvement de ce Manuel 03, vous avez complété l'intégralité du **Pôle 1** :
* **Manuel 01 :** Excel pour Étudiants & Professionnels (Formules, Dollar, TCD, Statistiques).
* **Manuel 02 :** Word & PowerPoint Pro (Styles automatiques, Pagination, Zotero APA, Soutenances 6x6).
* **Manuel 03 :** 50 Astuces & Raccourcis Informatiques (Productivité, Règle 3-2-1, Dépannage sans formater, Script batch).

Vous disposez désormais de la boîte à outils numérique complète du chercheur et du professionnel moderne.

```text
================================================================================
TEAM Sahélia · Apprendre. Créer. Innover.
Faculté d'Agronomie (FA-UP) · Campus de Parakou · République du Bénin
================================================================================
```
