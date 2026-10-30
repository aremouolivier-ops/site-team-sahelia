# Mini-Guide 02 : Tracer sa Parcelle au GPS Smartphone & QGIS
## De la collecte des coordonnées au champ jusqu’à la carte d’illustration avec calcul de surface (ha)

> **Collection :** Ressources Libres TEAM Sahélia · Édition Spéciale Agronomie 2026  
> **Signature :** *Apprendre aujourd’hui. Construire demain.*  
> **Contexte géographique :** République du Bénin (Fuseaux UTM 31N et 32N)  
> **Public visé :** Étudiants en agronomie (FA-UP, FSA, EPAC, etc.), techniciens agricoles et stagiaires devant délimiter des parcelles d'essais ou d'exploitations.  
> **Prérequis :** Un smartphone Android/iOS ordinaire et un ordinateur avec QGIS 3 (logiciel libre et gratuit).

---

## Sommaire du Guide
1. **Introduction :** Pourquoi la cartographie par satellite est devenue obligatoire en agronomie.
2. **Étape 1 :** Relever des points GPS fiables avec son smartphone (sans appareil GPS coûteux).
3. **Étape 2 :** Structurer son fichier de relevés dans un tableau Excel / CSV.
4. **Étape 3 :** La question cruciale des coordonnées : Degrés Décimaux vs Degrés Minutes Secondes.
5. **Étape 4 :** Importer les coordonnées dans QGIS 3 sans erreur de décalage géographique.
6. **Étape 5 :** Choisir le bon système de projection (Le secret de l'UTM 31N pour le Bénin).
7. **Étape 6 :** Convertir les points GPS en polygone de parcelle fermé.
8. **Étape 7 :** Calculer la superficie exacte en hectares et en mètres carrés avec la calculatrice de champ.
9. **Étape 8 :** Ajouter un fond de carte satellite Google Satellite ou OpenStreetMap.
10. **Étape 9 :** Mettre en page la carte finale avec Flèche Nord, Échelle graphique et Titre officiel.
11. **Checklist & Pièges fréquents :** Les 5 erreurs éliminatoires devant un jury de soutenance.

---

### 1. Pourquoi la cartographie par satellite est devenue incontournable
Dans un rapport de stage en agronomie ou un mémoire de Master, présenter un schéma dessiné à la main d'un champ ou simplement mentionner « la parcelle mesure environ 2 hectares » n'est plus accepté par les jurys. Un agronome moderne doit être capable de prouver la localisation exacte de son site d'expérimentation avec des coordonnées géographiques réelles, un polygone vectoriel et un calcul géométrique certifié.

---

### 2. Étape 1 : Relever les coordonnées au smartphone
Vous n’avez pas besoin d’un récepteur GPS Garmin à 300 000 FCFA pour délimiter une parcelle d’essai. Un smartphone ordinaire doté d’une puce GPS activée suffit, à condition de respecter ces règles :

1. Téléchargez une application de relevé GPS simple et gratuite, par exemple :
   - **GPS Point** ou **GPS Waypoints Navigator** (Android)
   - **Locus GIS** ou **SW Maps** (très recommandés pour l'agronomie)
2. Activez la **Localisation haute précision** dans les paramètres du téléphone.
3. Rendez-vous au premier coin de la parcelle. **Attendez 15 à 30 secondes** sur place sans bouger pour que le téléphone capte un nombre suffisant de satellites (la précision affichée doit descendre sous les 3 à 5 mètres).
4. Enregistrez le point : nommez-le `P1`.
5. Marchez le long de la bordure jusqu'au coin suivant et enregistrez `P2`.
6. Répétez l'opération pour tous les sommets de la parcelle (`P3`, `P4`...) en tournant dans le sens des aiguilles d'une montre.

---

### 3. Étape 2 : Structurer le fichier Excel / CSV
Ouvrez Excel et créez un tableau à 4 colonnes strictes :

| ID | Point | Longitude | Latitude |
| :--- | :--- | :--- | :--- |
| 1 | P1 | 2.61452 | 9.35120 |
| 2 | P2 | 2.61780 | 9.35135 |
| 3 | P3 | 2.61795 | 9.34890 |
| 4 | P4 | 2.61460 | 9.34875 |

**Règles impératives :**
- Pas d’accents dans les noms de colonnes (`Longitude`, `Latitude`, `Point`).
- Utilisez le **point décimal** (`2.61452`) et non la virgule (`2,61452`) si votre logiciel est configuré en anglais.
- Sauvegardez le fichier au format **CSV (séparateur : point-virgule ou virgule)** : `parcelle_essai_2026.csv`.

---

### 4. Étape 3 : Comprendre Longitude et Latitude au Bénin
- Au Bénin, la **Longitude** (axe X, Est-Ouest) est comprise entre environ **0.7° Est** (vers la frontière togolaise) et **3.8° Est** (vers la frontière nigériane). C’est toujours un petit chiffre positif.
- La **Latitude** (axe Y, Nord-Sud) est comprise entre environ **6.2° Nord** (littoral Cotonou) et **12.4° Nord** (Malanville/Karimama). À Parakou, elle est autour de **9.3° Nord**.
- **Si vos points atterrissent dans l'océan Atlantique au large du Gabon sur QGIS :** vous avez simplement inversé la Longitude (X) et la Latitude (Y) !

---

### 5. Étape 4 : Importer les points dans QGIS 3
1. Lancez QGIS (version 3.28 LTR ou 3.34 recommandée).
2. Rendez-vous dans le menu **Couche > Ajouter une couche > Ajouter une couche de texte délimité**.
3. Sélectionnez votre fichier `parcelle_essai_2026.csv`.
4. Dans **Format de fichier**, cochez le bon séparateur (point-virgule ou virgule).
5. Dans **Définition de la géométrie** :
   - Coordonnées de point.
   - Champ X : choisissez `Longitude`.
   - Champ Y : choisissez `Latitude`.
   - SCR de la géométrie : choisissez **EPSG:4326 - WGS 84**.
6. Cliquez sur **Ajouter**. Vos 4 points apparaissent dans la fenêtre principale !

---

### 6. Étape 5 : Le secret de la projection (UTM 31N vs WGS 84)
> [!IMPORTANT]
> **Pourquoi ne pas calculer une superficie en WGS 84 ?**
> Le système WGS 84 (EPSG:4326) mesure des angles en **degrés décimaux**, pas des mètres ! Si vous demandez la superficie d'une parcelle en WGS 84, QGIS vous donnera un résultat en « degrés carrés », ce qui n'a aucun sens agronomique.
> 
> Pour le Bénin, le système métrique officiel est le système projeté **UTM (Universal Transverse Mercator)** :
> - **EPSG:32631 (WGS 84 / UTM zone 31N)** : couvre la quasi-totalité du Bénin (Cotonou, Bohicon, Parakou, Djougou, Natitingou, Kandi).
> - **EPSG:32632 (WGS 84 / UTM zone 32N)** : pour l'extrême Est (Nikki, Kalalé, Malanville).

**Comment reprojeter vos points :**
Faites Clic droit sur votre couche de points > **Exporter > Sauvegarder les entités sous...**
- Format : **GeoPackage** ou **Shapefile**.
- Nom : `parcelle_points_utm31n`.
- SCR : cliquez sur le globe et cherchez **EPSG:32631**.
- Cliquez sur OK.

---

### 7. Étape 6 : Relier les points pour créer la parcelle (Polygone)
Pour fermer la parcelle :
1. Dans la boîte à outils de traitement (Ctrl + Alt + T), cherchez l'outil **« Points vers ligne »**.
2. Sélectionnez vos points, ordonnez par le champ `ID` et cochez **« Ligne fermée »**.
3. Exécutez : vous obtenez le contour fermé de votre parcelle.
4. Cherchez ensuite l'outil **« Lignes vers polygones »** pour remplir l'intérieur de la parcelle avec une couleur semi-transparente.

*(Méthode alternative rapide : créez une nouvelle couche de polygones en mode édition, activez l'accrochage magnétique et cliquez sur chaque point pour dessiner le polygone).*

---

### 8. Étape 7 : Calculer la superficie exacte en Hectares (ha)
1. Ouvrez la **Table attributaire** de votre couche de polygone (clic droit > Ouvrir la table d'attributs).
2. Cliquez sur l'icône **Ouvrir la calculatrice de champ** (icône en forme d'abaque).
3. Cochez **« Créer un nouveau champ »**.
4. Nom du champ de sortie : `Surface_ha`.
5. Type de champ : **Nombre décimal (réel)**, Précision : 2.
6. Dans la zone de formule au centre, tapez exactement :
   ```sql
   $area / 10000
   ```
   *(Puisque 1 hectare = 10 000 m², la fonction `$area` calcule la surface en mètres carrés selon la projection UTM 31N, puis la divise par 10 000).*
7. Cliquez sur **OK**. La superficie exacte apparaît dans votre table (exemple : `1.45 ha`).
8. Pour avoir également le périmètre en mètres, créez un champ `Perim_m` avec la formule :
   ```sql
   $perimeter
   ```

---

### 9. Étape 8 : Ajouter l'image satellite en arrière-plan
Pour vérifier visuellement que votre polygone correspond bien aux arbres et sentiers réels :
1. Installez l'extension **QuickMapServices** (menu *Extensions > Installer/Gérer les extensions*).
2. Rendez-vous dans **Web > QuickMapServices > Google > Google Satellite** (ou *ESRI Satellite*).
3. L'image satellite mondiale se charge sous vos données : vous voyez votre champ d'essai apparaître exactement là où vous avez marché sur le terrain.

---

### 10. Étape 9 : La mise en page finale (Prête pour le mémoire)
Dans QGIS, n'exportez jamais une simple capture d'écran de votre fenêtre de travail !
1. Allez dans **Projet > Nouvelle mise en page d'impression** (Ctrl + P), nommez-la `Carte_Parcelle`.
2. Cliquez sur **Ajouter une carte** et tracez un rectangle occupant la page.
3. Ajoutez les éléments indispensables imposés par les normes cartographiques :
   - **L'Échelle graphique** (*Ajouter une échelle*).
   - **La Flèche Nord** (*Ajouter une flèche nord*).
   - **La Légende** (*Ajouter une légende* pour identifier la parcelle et les parcelles témoins).
   - **Le Cartouche d'information :** Titre, Auteur (votre nom), Date, Source des données (GPS Garmin/Smartphone & Google Satellite), Système de projection (*WGS 84 / UTM zone 31N*).
4. Cliquez sur **Exporter au format PDF** ou **Exporter au format Image (PNG 300 DPI)**.

---

### Les 5 erreurs qui font perdre des points devant le jury
| Erreur constatée | Conséquence | Solution |
| :--- | :--- | :--- |
| Oubli de la flèche Nord | Le lecteur ne sait pas où est le Nord géographique | Toujours insérer le symbole Nord en haut à droite |
| Absence d'échelle | Impossible d'estimer la taille du champ | Ajouter une échelle graphique en mètres (ex: 0 - 50 - 100 m) |
| Calcul de surface en WGS 84 | Résultats fantaisistes en degrés carrés | Toujours projeter en UTM zone 31N (EPSG:32631) |
| Inversion Longitude / Latitude | La parcelle atterrit dans l'Océan | X = Longitude (≈ 2°E au Bénin), Y = Latitude (≈ 9°N à Parakou) |
| Capture d'écran floue | Rendu amateur qui dégrade la note | Exporter en PDF vectoriel ou PNG à 300 DPI |

---
**TEAM Sahélia · Faculté d'Agronomie & Géomatique**  
*Consultez nos tutoriels vidéo complémentaires et notre assistance technique sur notre plateforme officielle.*
