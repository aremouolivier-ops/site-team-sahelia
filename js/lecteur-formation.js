/**
 * TEAM Sahélia — Moteur de Lecture & Interface Pédagogique
 * Rendu Markdown immersif, Sommaire dynamique (TOC), Gestionnaire de Sessions & Gatekeeper
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. ANALYSEUR MARKDOWN ROBUSTE & SPÉCIALISÉ ÉDUCATION
  // =========================================================================

  function echapperHtml(texte) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(texte || '').replace(/[&<>"']/g, (m) => map[m]);
  }

  function genererSlug(texte) {
    return String(texte || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  /**
   * Résout intelligemment les chemins d'images relatifs par rapport au dossier du cours
   */
  function corrigerCheminImage(src, baseDir) {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/') || src.startsWith('data:')) {
      return src;
    }
    // Si l'image commence par ../schemas/ et que le fichier était dans chapitres/
    let propre = src;
    if (propre.startsWith('../')) {
      propre = propre.replace(/^\.\.\//, '');
    }
    // Nettoyer baseDir
    const base = (baseDir || '').endsWith('/') ? baseDir : baseDir + '/';
    return base + propre;
  }

  /**
   * Parser Markdown complet en HTML sémantique avec isolation stricte des blocs
   * Empêche tout échappement accidentel des balises HTML et garantit la fluidité mobile
   */
  function parserMarkdown(md, options = {}) {
    if (!md) return { html: '', sommaire: [] };
    const baseDir = options.baseDir || '';
    const titresSommaire = [];

    const blocsHtml = [];
    function sauverBloc(html) {
      const id = `__BLOC_HTML_${blocsHtml.length}__`;
      blocsHtml.push(html.trim());
      return `\n\n${id}\n\n`;
    }

    // 1. Découpage en blocs et extraction des blocs de code
    let texte = md.replace(/```([a-zA-Z0-9_\-\+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const langueAffichee = lang ? lang.toUpperCase() : 'TEXTE';
      const codeSecurise = echapperHtml(code.trim());
      const htmlCode = `
        <div class="bloc-code-conteneur">
          <div class="bloc-code-barre">
            <span class="bloc-code-langue">${langueAffichee}</span>
            <button type="button" class="btn-copier-code" data-code="${encodeURIComponent(code.trim())}">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              Copier
            </button>
          </div>
          <pre class="bloc-code-pre"><code>${codeSecurise}</code></pre>
        </div>
      `;
      return sauverBloc(htmlCode);
    });

    // 2. Traitement des blocs d'alertes spéciales (Callouts GitHub-style)
    const typesCallouts = {
      'NOTE': { classe: 'callout-note', icone: 'ℹ️', titre: 'Information Pédagogique' },
      'TIP': { classe: 'callout-tip', icone: '💡', titre: 'Astuce Sahélia de Terrain' },
      'ASTUCE': { classe: 'callout-tip', icone: '💡', titre: 'Astuce Sahélia' },
      'IMPORTANT': { classe: 'callout-important', icone: '📌', titre: 'Règle Essentielle' },
      'WARNING': { classe: 'callout-warning', icone: '⚠️', titre: 'Attention / Piège Fréquent' },
      'ATTENTION': { classe: 'callout-warning', icone: '⚠️', titre: 'Point de Vigilance' },
      'CAUTION': { classe: 'callout-danger', icone: '🛑', titre: 'Erreur Critique à Éviter' }
    };

    texte = texte.replace(/(^> ?.*(?:\n> ?.*)*)/gm, (bloc) => {
      const lignes = bloc.split('\n').map((l) => l.replace(/^> ?/, ''));
      const premiereLigne = lignes[0].trim();
      const matchCallout = premiereLigne.match(/^\[!(NOTE|TIP|ASTUCE|IMPORTANT|WARNING|ATTENTION|CAUTION)\](?:\s*(.*))?$/i);

      if (matchCallout) {
        const typeCle = matchCallout[1].toUpperCase();
        const conf = typesCallouts[typeCle] || typesCallouts['NOTE'];
        const titrePersonnalise = matchCallout[2] ? matchCallout[2].trim() : conf.titre;
        const contenuReste = lignes.slice(1).join('\n').trim();
        const htmlCallout = `
          <div class="callout-pedagogique ${conf.classe}">
            <div class="callout-entete">
              <span class="callout-icone">${conf.icone}</span>
              <strong class="callout-titre">${echapperHtml(titrePersonnalise)}</strong>
            </div>
            <div class="callout-corps">${parserLignesEnParagraphes(contenuReste)}</div>
          </div>
        `;
        return sauverBloc(htmlCallout);
      }

      return sauverBloc(`<blockquote class="citation-pedagogique">${parserLignesEnParagraphes(lignes.join('\n'))}</blockquote>`);
    });

    // 3. Traitement des Tableaux Markdown (| col | col |)
    texte = texte.replace(/((?:^|\n)\|[^\n]+\|\n\|[\s\-:|]+\|\n(?:\|[^\n]+\|\n?)+)/g, (matchTable) => {
      const lignes = matchTable.trim().split('\n').filter((l) => l.trim().length > 0);
      if (lignes.length < 2) return matchTable;

      const enteteLigne = lignes[0];
      const colonnesEntete = enteteLigne.split('|').slice(1, -1).map((c) => c.trim());
      const corpsLignes = lignes.slice(2);

      let htmlTable = `
        <div class="tableau-conteneur-responsive">
          <table class="tableau-pedagogique">
            <thead>
              <tr>${colonnesEntete.map((c) => `<th>${parserFormatInline(c)}</th>`).join('')}</tr>
            </thead>
            <tbody>
      `;

      corpsLignes.forEach((l) => {
        const cols = l.split('|').slice(1, -1).map((c) => c.trim());
        htmlTable += `<tr>${cols.map((c) => `<td>${parserFormatInline(c)}</td>`).join('')}</tr>`;
      });

      htmlTable += `
            </tbody>
          </table>
        </div>
      `;
      return sauverBloc(htmlTable);
    });

    // 4. Traitement des Titres (H1, H2, H3, H4) et extraction pour Sommaire
    texte = texte.replace(/^(#{1,4})\s+(.+)$/gm, (match, hashes, titre) => {
      const niveau = hashes.length;
      const slug = genererSlug(titre);
      const texteAffiche = titre.trim();

      if (niveau === 2 || niveau === 3) {
        titresSommaire.push({
          id: slug,
          niveau: niveau,
          texte: texteAffiche.replace(/\*\*/g, '').replace(/`/g, '')
        });
      }

      const htmlTitre = `<h${niveau} id="${slug}" class="titre-pedagogique-h${niveau}">
        <a href="#${slug}" class="lien-ancre-titre" title="Lien direct vers cette section">#</a>
        ${parserFormatInline(texteAffiche)}
      </h${niveau}>`;
      return sauverBloc(htmlTitre);
    });

    // 5. Images et Schémas vectoriels avec zoom
    texte = texte.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
      const cheminFinal = corrigerCheminImage(src.trim(), baseDir);
      const legende = alt ? `<figcaption class="figure-legende">${echapperHtml(alt)}</figcaption>` : '';
      const estSvg = cheminFinal.toLowerCase().endsWith('.svg');
      const htmlImg = `
        <figure class="figure-pedagogique ${estSvg ? 'figure-schema-svg' : ''}">
          <div class="figure-image-wrapper">
            <img src="${cheminFinal}" alt="${echapperHtml(alt)}" loading="lazy" class="image-cours-cliquable" data-zoom-src="${cheminFinal}">
            <button type="button" class="btn-agrandir-image" title="Agrandir le schéma" data-zoom-src="${cheminFinal}">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
            </button>
          </div>
          ${legende}
        </figure>
      `;
      return sauverBloc(htmlImg);
    });

    // 6. Séparateurs horizontaux
    texte = texte.replace(/^(\-{3,}|\*{3,}|_{3,})$/gm, () => {
      return sauverBloc('<hr class="separateur-pedagogique">');
    });

    // 7. Listes à puces et ordonnées
    texte = texte.replace(/^- \[([ xX])\] (.*)$/gm, (match, coche, reste) => {
      const estCoche = coche.toLowerCase() === 'x';
      return `<li class="element-liste-tache"><input type="checkbox" ${estCoche ? 'checked' : ''} disabled> ${parserFormatInline(reste)}</li>`;
    });
    texte = texte.replace(/^(\d+)\.\s+(.+)$/gm, (match, num, reste) => {
      return `<li class="element-liste-ordonnee" value="${num}">${parserFormatInline(reste)}</li>`;
    });
    texte = texte.replace(/^[\-\*]\s+(.+)$/gm, (match, reste) => {
      return `<li class="element-liste-puce">${parserFormatInline(reste)}</li>`;
    });

    texte = texte.replace(/((?:<li class="element-liste-puce">.*<\/li>\s*)+)/g, (match) => {
      return sauverBloc(`<ul class="liste-pedagogique-ul">${match.trim()}</ul>`);
    });
    texte = texte.replace(/((?:<li class="element-liste-ordonnee".*<\/li>\s*)+)/g, (match) => {
      return sauverBloc(`<ol class="liste-pedagogique-ol">${match.trim()}</ol>`);
    });
    texte = texte.replace(/((?:<li class="element-liste-tache".*<\/li>\s*)+)/g, (match) => {
      return sauverBloc(`<ul class="liste-pedagogique-taches">${match.trim()}</ul>`);
    });

    // 8. Paragraphes normaux
    const paragraphes = texte.split(/\n{2,}/);
    let htmlIntermediaire = paragraphes
      .map((p) => {
        const propre = p.trim();
        if (!propre) return '';
        if (/^__BLOC_HTML_\d+__$/.test(propre)) {
          return propre;
        }
        return `<p class="paragraphe-pedagogique">${parserFormatInline(propre)}</p>`;
      })
      .filter(Boolean)
      .join('\n\n');

    // 9. Ré-injection des blocs HTML (avec fonction de remplacement pour neutraliser les séquences $& ou $<)
    blocsHtml.forEach((bloc, i) => {
      htmlIntermediaire = htmlIntermediaire.replace(`__BLOC_HTML_${i}__`, () => bloc);
    });

    return {
      html: htmlIntermediaire,
      sommaire: titresSommaire
    };
  }

  /**
   * Vérifie qu'une URL est sûre (bloque javascript:, data:, vbscript:)
   */
  function estUrlSecurisee(urlStr) {
    const propre = String(urlStr || '').trim().toLowerCase();
    if (propre.startsWith('javascript:') || propre.startsWith('vbscript:') || propre.startsWith('data:')) {
      return false;
    }
    return true;
  }

  /**
   * Formatage inline : gras, italique, code inline, liens avec assainissement HTML
   */
  function parserFormatInline(texte) {
    if (!texte) return '';
    // Assainissement préalable pour neutraliser toute balise HTML brute non autorisée
    const propre = echapperHtml(texte);
    return propre
      // Code inline `code`
      .replace(/`([^`]+)`/g, '<code class="code-inline">$1</code>')
      // Gras **texte**
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="texte-gras">$1</strong>')
      // Italique *texte*
      .replace(/\*([^*]+)\*/g, '<em class="texte-italique">$1</em>')
      // Liens [texte](url) avec filtrage strict des protocoles dangereux
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, href) => {
        const decodedHref = href.replace(/&amp;/g, '&');
        const cleanHref = estUrlSecurisee(decodedHref) ? echapperHtml(decodedHref.trim()) : '#';
        return `<a href="${cleanHref}" target="_blank" rel="noopener noreferrer" class="lien-pedagogique">${label}</a>`;
      });
  }

  function parserLignesEnParagraphes(texte) {
    if (!texte) return '';
    return texte
      .split('\n\n')
      .map((t) => `<p>${parserFormatInline(t.trim())}</p>`)
      .join('');
  }

  // =========================================================================
  // 2. CONTRÔLEUR D'INTERFACE & GESTIONNAIRE DU LECTEUR
  // =========================================================================

  const Lecteur = {
    coursActif: null,
    chapitreActif: null,
    donneesCours: null,
    sommaireActif: [],

    async init() {
      // 0. Réinitialiser tout mode résiduel pour garantir un affichage fluide dès le chargement
      document.body.classList.remove('mode-zen');

      // 1. Initialiser le contrôle d'accès
      if (window.SaheliaSecurite) {
        await window.SaheliaSecurite.init();
      }

      // 2. Afficher la bannière d'annonces si active
      this._initialiserBanniereAnnonces();

      // 3. Écouteurs d'événements globaux (boutons de zoom, copies de code, tailles police)
      this._attacherEcouteursGlobaux();

      // 4. Lire les paramètres de l'URL (?cours=mn-01&ch=ch-01)
      const params = new URLSearchParams(window.location.search);
      const coursId = params.get('cours') || 'guide-01';
      const chapitreId = params.get('ch') || null;

      await this.chargerCours(coursId, chapitreId);
    },

    _initialiserBanniereAnnonces() {
      const conteneur = document.getElementById('banniere-annonces-sahelia');
      if (!conteneur || !window.SaheliaDB) return;
      const annonces = (window.SaheliaDB.annonces || []).filter((a) => a && a.actif);
      if (annonces.length === 0) {
        conteneur.style.display = 'none';
        return;
      }
      const a = annonces[0];
      const typeIcons = {
        info: '📢 Information',
        pub: '🌟 Annonce Partenaire',
        alerte: '🚨 Flash Info',
        partenariat: '🤝 Coopération'
      };
      const libelleType = typeIcons[a.type] || '📢 Annonce';
      conteneur.style.display = 'block';
      conteneur.innerHTML = `
        <div style="background: linear-gradient(90deg, #0b2b24, #123e34); border-bottom: 1px solid var(--bordure); padding: 0.6rem 1rem; color: var(--texte); font-size: 0.85rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <span class="etiquette etiquette--or" style="font-size: 0.65rem;">${echapperHtml(libelleType)}</span>
            <strong>${echapperHtml(a.titre)} :</strong>
            <span>${echapperHtml(a.message)}</span>
            ${a.lien ? `<a href="${echapperHtml(a.lien)}" target="_blank" rel="noopener noreferrer" style="color: var(--marque); text-decoration: underline; font-weight: bold;">En savoir plus →</a>` : ''}
          </div>
          <button type="button" onclick="document.getElementById('banniere-annonces-sahelia').style.display='none'" style="background: transparent; border: none; color: var(--texte-3); cursor: pointer; font-size: 1rem; padding: 0 0.4rem;" title="Masquer l’annonce">✕</button>
        </div>
      `;
    },

    _attacherEcouteursGlobaux() {
      // Copie de code dans le presse-papier
      document.addEventListener('click', (e) => {
        const btnCopier = e.target.closest('.btn-copier-code');
        if (btnCopier) {
          const code = decodeURIComponent(btnCopier.getAttribute('data-code') || '');
          if (navigator.clipboard) {
            navigator.clipboard.writeText(code).then(() => {
              const ancienTexte = btnCopier.innerHTML;
              btnCopier.innerHTML = '<span>✓ Copié !</span>';
              btnCopier.classList.add('copie-succes');
              setTimeout(() => {
                btnCopier.innerHTML = ancienTexte;
                btnCopier.classList.remove('copie-succes');
              }, 2000);
            });
          }
        }

        // Zoom image / schéma vectoriel
        const btnZoom = e.target.closest('.btn-agrandir-image') || e.target.closest('.image-cours-cliquable');
        if (btnZoom) {
          const src = btnZoom.getAttribute('data-zoom-src');
          if (src) this.ouvrirModalZoom(src);
        }
      });

      // Bouton Partage / Copie du lien direct unique
      const btnPartager = document.getElementById('btn-partager-lien-cours');
      if (btnPartager) {
        btnPartager.addEventListener('click', async () => {
          if (!this.coursActif) return;
          const urlPartage = window.SaheliaCatalogue
            ? window.SaheliaCatalogue.obtenirLienPartage(this.coursActif.id)
            : window.location.href;
          try {
            await navigator.clipboard.writeText(urlPartage);
            const texteOrig = btnPartager.innerHTML;
            btnPartager.innerHTML = '✓ Copié !';
            btnPartager.style.color = '#4ade80';
            btnPartager.style.borderColor = '#4ade80';
            setTimeout(() => {
              btnPartager.innerHTML = texteOrig;
              btnPartager.style.color = '';
              btnPartager.style.borderColor = '';
            }, 2500);
          } catch (e) {
            prompt('Lien direct de ce cours à copier :', urlPartage);
          }
        });
      }

      // Bouton Mode Zen (Plein Écran sans distractions) - Uniquement pour grands écrans PC (> 1100px)
      const btnZen = document.getElementById('btn-zen-mode');
      if (btnZen) {
        btnZen.addEventListener('click', () => {
          document.body.classList.toggle('mode-zen');
          const estZen = document.body.classList.contains('mode-zen');
          btnZen.textContent = estZen ? '✕ Quitter Zen' : '⛶ Zen';
          btnZen.title = estZen ? 'Revenir à l’affichage complet avec panneaux' : 'Basculer en mode lecture zen (plein écran)';
        });

        window.addEventListener('resize', () => {
          if (window.innerWidth <= 1100 && document.body.classList.contains('mode-zen')) {
            document.body.classList.remove('mode-zen');
            btnZen.textContent = '⛶ Zen';
          }
        });
      }

      // Bouton Validation de Défi Interactif (Système de Badges & XP)
      const btnDefi = document.getElementById('btn-valider-defi');
      if (btnDefi) {
        btnDefi.addEventListener('click', () => {
          this._validerReponseDefi();
        });
      }

      // Barre de progression de lecture au défilement
      window.addEventListener('scroll', () => {
        const barre = document.getElementById('barre-progression-lecture');
        if (!barre) return;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0) {
          const pct = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
          barre.style.width = pct + '%';
        }
      });
    },

    /**
     * Charge et affiche un cours du catalogue
     */
    async chargerCours(coursId, chapitreId = null) {
      if (!window.SaheliaCatalogue) {
        this.afficherErreur('Le catalogue des formations est inaccessible.');
        return;
      }

      const cours = window.SaheliaCatalogue.obtenirCours(coursId);
      if (!cours) {
        this.afficherErreur(`Le cours « ${coursId} » n’existe pas dans le catalogue officiel.`);
        return;
      }

      this.coursActif = cours;

      // 1. Mettre à jour l'en-tête et les métadonnées de la page
      this._mettreAJourEnTeteCours(cours);

      // 2. Accès Libre Total : Masquer le Gatekeeper et ouvrir le contenu à tous
      const session = window.SaheliaSecurite ? window.SaheliaSecurite.obtenirSessionValide() : null;
      this.masquerGatekeeper(session);

      // 3. Déterminer le chapitre à afficher
      const chapitres = cours.chapitres || [];
      let cibleChapitre = null;

      if (chapitreId) {
        cibleChapitre = chapitres.find((c) => c.id === chapitreId);
      }
      if (!cibleChapitre && chapitres.length > 0) {
        cibleChapitre = chapitres[0];
      }

      this.chapitreActif = cibleChapitre;

      // 4. Mettre à jour le volet latéral gauche (liste des chapitres et ressources)
      this._rendreSidebarChapitres(cours, cibleChapitre);

      // 5. Charger le fichier Markdown correspondant
      if (cibleChapitre && cibleChapitre.fichier) {
        await this._telechargerEtRendreMarkdown(cibleChapitre.fichier, cours.baseDir);
      } else if (cours.fichierSource) {
        await this._telechargerEtRendreMarkdown(cours.fichierSource, cours.baseDir);
      } else {
        this.afficherErreur('Aucun fichier de contenu associé à cette section.');
      }

      // 6. Mettre à jour l'URL sans recharger la page
      const nouvelleUrl = new URL(window.location.href);
      nouvelleUrl.searchParams.set('cours', cours.id);
      if (cibleChapitre && cibleChapitre.id) {
        nouvelleUrl.searchParams.set('ch', cibleChapitre.id);
      } else {
        nouvelleUrl.searchParams.delete('ch');
      }
      window.history.replaceState({}, '', nouvelleUrl.toString());
    },

    _obtenirMetadonneesHybrides(cours) {
      const configBadges = {
        'mn-01': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Competence_Agronomie.png',
          badgeNom: 'Compétence Agronomie & Données',
          badgeDesc: 'Attribué après validation du Projet Capstone Certifiant',
          heroImg: 'assets/images/hero_terrain_agronomie.jpg',
          objectifs: [
            'Structure tabulaire stricte (0 cellule fusionnée)',
            'Références absolues et relatives ($) sans erreur',
            'Nettoyage de bases brutes et TCD d’expertise agronomique'
          ]
        },
        'mn-02': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Membre_Officiel.png',
          badgeNom: 'Rédaction Scientifique & Soutenance',
          badgeDesc: 'Styles hiérarchiques automatiques et diapositives percutantes',
          heroImg: 'assets/images/hero_terrain_agronomie.jpg',
          objectifs: [
            'Feuilles de styles Titre 1, 2, 3 et sommaires 100% automatiques',
            'Double pagination (chiffres romains et arabes) pour mémoire',
            'Diapositives de soutenance visuelles et synthétiques'
          ]
        },
        'mn-03': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Membre_Officiel.png',
          badgeNom: 'Productivité & Sauvegarde 3-2-1',
          badgeDesc: 'Sécurité de ses données et 50 raccourcis indispensables',
          heroImg: 'assets/images/hero_terrain_agronomie.jpg',
          objectifs: [
            'Protocole de sauvegarde 3-2-1 pour mémoires et thèses',
            '50 raccourcis clavier ultimes Windows et bureautique',
            'Diagnostic rapide des pannes courantes sans paniquer'
          ]
        },
        'mn-04': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Competence_Agronomie.png',
          badgeNom: 'Biométrie & Statistique R',
          badgeDesc: 'Analyse des essais agronomiques (ANOVA, régressions)',
          heroImg: 'assets/images/immersion_terrain_recherche.jpg',
          objectifs: [
            'Importation propre de tableaux Excel sous RStudio',
            'Tests statistiques rigoureux (ANOVA, corrélations, Tukey)',
            'Graphiques publiables conformes aux revues scientifiques'
          ]
        },
        'mn-05': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Competence_SIG.png',
          badgeNom: 'Collecte Mobile KoboToolbox',
          badgeDesc: 'Enquêtes géoréférencées hors connexion sur smartphone',
          heroImg: 'assets/images/immersion_terrain_recherche.jpg',
          objectifs: [
            'Conception de formulaires XLSXForm avec sauts logiques',
            'Relevés GPS de terrain fiables sans connexion internet',
            'Synchronisation serveur et contrôle qualité des données'
          ]
        },
        'mn-06': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Competence_SIG.png',
          badgeNom: 'Praticien SIG & Cartographie Parcellaire (Argent)',
          badgeDesc: 'Hexagone Open Badges 3.0 · Délimitation parcellaire QGIS et GPS de terrain',
          heroImg: 'assets/images/immersion_terrain_recherche.jpg',
          objectifs: [
            'Systèmes de coordonnées et projection UTM 31N WGS84',
            'Calcul d’aires exactes en hectares sur polygones GPS',
            'Mise en page de cartes officielles conformes aux normes CAMES'
          ]
        },
        'mn-07': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Competence_VibeCoding.png',
          badgeNom: 'Vibe Coding & Ingénieur Solutions IA (Platine)',
          badgeDesc: 'Octogone Open Badges 3.0 · Développement Web Moderne & Architecture IA',
          heroImg: 'assets/images/hero_terrain_agronomie.jpg',
          objectifs: [
            'Architecture web sémantique et responsive mobile',
            'Manipulation dynamique des données en JavaScript',
            'Déploiement et sécurisation de projets web en ligne'
          ]
        },
        'mn-08': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Competence_VibeCoding.png',
          badgeNom: 'Vibe Coding & Ingénieur Solutions IA (Platine)',
          badgeDesc: 'Octogone Open Badges 3.0 · Création d’outils métiers pilotés par l’IA',
          heroImg: 'assets/images/hero_terrain_agronomie.jpg',
          objectifs: [
            'Spécification rigoureuse et orchestration de code par LLM',
            'Détection et neutralisation des hallucinations techniques',
            'Développement autonome d’outils professionnels pour le terrain'
          ]
        },
        'mn-09': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Membre_Officiel.png',
          badgeNom: 'Membre Pionnier · Création Graphique & Vidéo (Bronze)',
          badgeDesc: 'Pentagone Open Badges 3.0 · Affiches professionnelles et vulgarisation mobile',
          heroImg: 'assets/images/hero_terrain_agronomie.jpg',
          objectifs: [
            'Règles d’or de composition visuelle et psychologie des couleurs',
            'Storytelling et montage vidéo percutant sur mobile',
            'Production d’affiches de colloques et vulgarisation sur réseaux'
          ]
        },
        'mn-10': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Membre_Officiel.png',
          badgeNom: 'Membre Pionnier · Consultant & Numéricien (Bronze)',
          badgeDesc: 'Pentagone Open Badges 3.0 · Monétisation des compétences auprès des ONG et projets',
          heroImg: 'assets/images/immersion_terrain_recherche.jpg',
          objectifs: [
            'Grilles tarifaires adaptées au marché béninois et ouest-africain',
            'Rédaction de devis et propositions techniques convaincantes',
            'Fidélisation clients et livraison de prestations irréprochables'
          ]
        },
        'mn-11': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Competence_SIG.png',
          badgeNom: 'Opérateur Drone & Télédétection Agricole (Or)',
          badgeDesc: 'Écusson Open Badges 3.0 · Cartographie photogrammétrique et indices NDVI',
          heroImg: 'assets/images/immersion_terrain_recherche.jpg',
          objectifs: [
            'Pilotage en Mode 2 et respect strict de la réglementation ANAC Bénin',
            'Plans de vol en peigne, calcul du GSD et orthomosaïque photogrammétrique',
            'Calibrage des atomiseurs rotatifs, maîtrise du Downwash et boucle drone-QGIS'
          ]
        },
        'mn-12': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Competence_VibeCoding.png',
          badgeNom: 'Création Vidéo & Visuelle par IA (Platine · N3)',
          badgeDesc: 'Octogone Open Badges 3.0 · Production audiovisuelle IA, montage CapCut & étalonnage DaVinci',
          heroImg: 'assets/images/hero_terrain_agronomie.jpg',
          objectifs: [
            'Prompting visuel C.R.E.D. et génération vidéo Image-to-Video cohérente',
            'Narration vocale de synthèse éthique et mixage audio à -14 LUFS',
            'Montage dynamique multipiste et étalonnage couleur sous DaVinci Resolve'
          ]
        }
      };

      const defaut = {
        badgeImg: 'assets/Badge_TEAM_Sahelia_Membre_Officiel.png',
        badgeNom: 'Badge Officiel TEAM Sahélia',
        badgeDesc: 'Validation des compétences fondamentales du guide',
        heroImg: cours.poleId === 'agronomie_sig' ? 'assets/images/immersion_terrain_recherche.jpg' : 'assets/images/hero_terrain_agronomie.jpg',
        objectifs: [
          'Assimilation des règles de méthodologie de terrain',
          'Application immédiate sur un cas pratique concret',
          'Intégration des standards d’excellence TEAM Sahélia'
        ]
      };

      return configBadges[cours.id] || defaut;
    },

    _mettreAJourProgressionEtBadges(cours) {
      if (!cours) return;
      const chapitres = cours.chapitres || [];
      if (chapitres.length === 0) return;

      let valides = 0;
      chapitres.forEach((ch) => {
        const cle = `sahelia_prog_${cours.id}_${ch.id}`;
        try {
          if (localStorage.getItem(cle) === 'valide') valides++;
        } catch (e) {}
      });

      const pct = Math.round((valides / chapitres.length) * 100);
      const elemPct = document.getElementById('progression-pourcentage-nav');
      const elemBarre = document.getElementById('progression-barre-nav');

      if (elemPct) elemPct.textContent = `${pct}%`;
      if (elemBarre) elemBarre.style.width = `${pct}%`;
    },

    _mettreAJourEnTeteCours(cours) {
      document.title = `${cours.titre} · Formation TEAM Sahélia`;

      const metaHybride = this._obtenirMetadonneesHybrides(cours);

      const titreElem = document.getElementById('cours-titre-principal');
      const sousTitreElem = document.getElementById('cours-soustitre');
      const badgePoleElem = document.getElementById('cours-badge-pole');
      const dureeElem = document.getElementById('cours-duree-totale');
      const niveauElem = document.getElementById('cours-niveau');

      const heroFond = document.getElementById('hero-image-fond');
      if (heroFond && metaHybride.heroImg) {
        heroFond.src = metaHybride.heroImg;
      }

      const badgeCibleTexte = document.getElementById('cours-badge-cible-texte');
      if (badgeCibleTexte) {
        badgeCibleTexte.textContent = metaHybride.badgeNom;
      }

      if (titreElem) titreElem.textContent = cours.titre;
      if (sousTitreElem) sousTitreElem.textContent = cours.sousTitre || '';
      if (badgePoleElem) {
        badgePoleElem.textContent = cours.pole || 'Pôle Académique';
        if (cours.accentColor) badgePoleElem.style.borderColor = cours.accentColor;
      }
      if (dureeElem) dureeElem.textContent = cours.duree || '';
      if (niveauElem) niveauElem.textContent = cours.niveau || 'Tous niveaux';

      // Statut d'accès dans la barre supérieure : Accès libre à 100% des manuels et guides
      const statutBadgeTop = document.getElementById('topbar-statut-acces');
      if (statutBadgeTop) {
        statutBadgeTop.innerHTML = `<span class="etiquette-acces libre">✓ Accès 100% Libre &amp; Gratuit</span>`;
      }

      // Mise à jour de l'Inspecteur Droit (Objectifs & Badge)
      const sidebarBadgeImg = document.getElementById('sidebar-badge-img');
      const sidebarBadgeNom = document.getElementById('sidebar-badge-nom');
      const sidebarBadgeDesc = document.getElementById('sidebar-badge-desc');
      if (sidebarBadgeImg) sidebarBadgeImg.src = metaHybride.badgeImg;
      if (sidebarBadgeNom) sidebarBadgeNom.textContent = metaHybride.badgeNom;
      if (sidebarBadgeDesc) sidebarBadgeDesc.textContent = metaHybride.badgeDesc;

      const sidebarObjectifs = document.getElementById('sidebar-objectifs-cles');
      if (sidebarObjectifs && metaHybride.objectifs) {
        sidebarObjectifs.innerHTML = metaHybride.objectifs.map((obj) => `
          <div class="sidebar-objectif-item">
            <span>✓</span>
            <div>${echapperHtml(obj)}</div>
          </div>
        `).join('');
      }

      this._mettreAJourProgressionEtBadges(cours);
    },

    _rendreSidebarChapitres(cours, chapitreSelectionne) {
      const conteneur = document.getElementById('liste-navigation-chapitres');
      if (!conteneur) return;

      const chapitres = cours.chapitres || [];

      // S'il n'y a qu'un seul chapitre (cas des 5 mini-guides)
      if (chapitres.length <= 1) {
        conteneur.innerHTML = `
          <div class="info-guide-unique">
            <span class="guide-type-pill">Mini-Guide de Synthèse</span>
            <p style="font-size: 0.85rem; color: var(--texte-2); margin-top: 0.4rem;">
              Ce document forme un tout cohérent à lecture directe. Utilisez le sommaire dynamique à droite pour naviguer entre les règles et sections.
            </p>
          </div>
        `;
        return;
      }

      let html = `<div class="titre-bloc-sidebar">Programme du Manuel (${chapitres.length} Sections)</div>`;
      html += `<div class="liste-onglets-chapitres">`;

      chapitres.forEach((chap, index) => {
        const estActif = chapitreSelectionne && chap.id === chapitreSelectionne.id;
        let estValide = false;
        try {
          estValide = localStorage.getItem(`sahelia_prog_${cours.id}_${chap.id}`) === 'valide';
        } catch (e) {}

        html += `
          <button type="button" class="btn-onglet-chapitre ${estActif ? 'actif' : ''}" data-ch-id="${chap.id}">
            <div class="chap-badge-num">${estValide ? '✓' : (chap.numero === 0 ? 'Intro' : (chap.numero === 9 ? 'Projet' : `Ch. ${chap.numero}`))}</div>
            <div class="chap-details">
              <span class="chap-titre">${echapperHtml(chap.titre)}</span>
              <span class="chap-duree">${estValide ? '<span style="color:#4ade80;">✓ Validé (+150 XP)</span>' : (chap.duree || '')}</span>
            </div>
          </button>
        `;
      });

      html += `</div>`;

      // Section ressources téléchargeables (ex: CSV pour Excel)
      if (cours.ressources && cours.ressources.length > 0) {
        html += `
          <div class="titre-bloc-sidebar" style="margin-top: 1.5rem;">Fichiers & Ressources Pratiques</div>
          <div class="liste-ressources-telechargement">
        `;
        cours.ressources.forEach((res) => {
          if (res.fichier) {
            html += `
              <a href="${res.fichier}" download class="carte-ressource-telechargement">
                <span class="ressource-icone">📥</span>
                <div class="ressource-texte">
                  <strong>${echapperHtml(res.nom)}</strong>
                  <small>${echapperHtml(res.description || 'Fichier d’exercice')}</small>
                </div>
              </a>
            `;
          }
        });
        html += `</div>`;
      }

      conteneur.innerHTML = html;

      // Écouteurs de clics sur les onglets de chapitres
      conteneur.querySelectorAll('.btn-onglet-chapitre').forEach((btn) => {
        btn.addEventListener('click', () => {
          const chId = btn.getAttribute('data-ch-id');
          this.chargerCours(this.coursActif.id, chId);
        });
      });

      // Configurer le Défi Interactif (Auto-Grader Pédagogique)
      if (chapitreSelectionne) {
        this._configurerDefiInteractif(cours, chapitreSelectionne);
      }
    },

    /**
     * Télécharge le fichier Markdown et le passe au parseur
     * Supporte le mode hybride : Contenus embarqués (file:// & offline) + Fetch réseau (http://)
     */
    async _telechargerEtRendreMarkdown(cheminFichier, baseDir) {
      const conteneurCorps = document.getElementById('corps-cours-rendu');
      if (!conteneurCorps) return;

      conteneurCorps.innerHTML = `
        <div class="chargement-cours-spinner">
          <div class="spinner-cercle"></div>
          <p>Chargement du document pédagogique...</p>
        </div>
      `;

      try {
        const cleNormalisee = String(cheminFichier || '').replace(/\\/g, '/').replace(/^\.\//, '');
        let texteMd = '';

        // 0. Si le cours a un contenu dynamique personnalisé (créé depuis l'administration)
        if (this.chapitreActif && this.chapitreActif.contenuMarkdown) {
          texteMd = this.chapitreActif.contenuMarkdown;
        } else if (this.coursActif && this.coursActif.contenuMarkdown) {
          texteMd = this.coursActif.contenuMarkdown;
        } else if (window.SaheliaContenus && typeof window.SaheliaContenus[cleNormalisee] === 'string') {
          // 1. Guides libres ouverts (Plaintext pour SEO et accès instantané)
          texteMd = window.SaheliaContenus[cleNormalisee];
        } else if (window.SaheliaContenusChiffres && window.SaheliaContenusChiffres[cleNormalisee]) {
          // 2. Manuels stratégiques protégés : Déchiffrement AES-256-GCM en mémoire vive
          if (!window.SaheliaCryptoFormation) {
            throw new Error('Module de déchiffrement cryptographique indisponible.');
          }

          if (!window.SaheliaCryptoFormation.estDeverrouille()) {
            const session = window.SaheliaSecurite ? window.SaheliaSecurite.obtenirSessionValide() : null;
            const clePass = (session && session.cleDeverrouillage) ? session.cleDeverrouillage : 'SAHELIA-EXCEL-2026';
            const resDev = await window.SaheliaCryptoFormation.deverrouillerAvecPassphrase(clePass);
            if (!resDev.succes) {
              await window.SaheliaCryptoFormation.deverrouillerAvecPassphrase('SAHELIA2026');
            }
          }

          texteMd = await window.SaheliaCryptoFormation.dechiffrerContenu(cleNormalisee);
        } else {
          // 3. Repli réseau fetch standard si fichier présent sur serveur
          try {
            const rep = await fetch(cheminFichier);
            if (!rep.ok) {
              throw new Error(`Erreur HTTP ${rep.status} lors de l'accès au document.`);
            }
            texteMd = await rep.text();
          } catch (fetchErr) {
            // Si fetch échoue (ex: restriction de sécurité locale file:///), re-vérifier les contenus embarqués
            if (window.SaheliaContenus && window.SaheliaContenus[cleNormalisee]) {
              texteMd = window.SaheliaContenus[cleNormalisee];
            } else {
              throw fetchErr;
            }
          }
        }

        if (!texteMd || texteMd.trim().length === 0) {
          throw new Error('Le document est vide ou introuvable.');
        }

        // Rendu Markdown
        const rendu = parserMarkdown(texteMd, { baseDir: baseDir });
        conteneurCorps.innerHTML = rendu.html;
        this.sommaireActif = rendu.sommaire || [];

        // Générer le Sommaire (TOC) interactif à droite
        this._genererSommaireInteractif(this.sommaireActif);

        // Mettre à jour les boutons précédent / suivant en bas d'article
        this._mettreAJourNavigationBasDePage();

        // Réinitialiser le défilement
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        const estProtocoleFile = window.location.protocol === 'file:';
        conteneurCorps.innerHTML = `
          <div class="alerte-erreur-chargement" style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 14px; padding: 1.5rem; text-align: left;">
            <h3 style="color: #f87171; font-size: 1.1rem; margin-bottom: 0.5rem;">Impossible de charger cette section</h3>
            <p style="color: #fca5a5; font-size: 0.92rem; line-height: 1.5;">${echapperHtml(err.message)}</p>
            <p style="font-size: 0.82rem; color: var(--texte-3); margin-top: 0.5rem;">Fichier ciblé : <code>${echapperHtml(cheminFichier)}</code></p>
            ${
              estProtocoleFile
                ? `<div style="margin-top: 1rem; padding-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.82rem; color: var(--texte-2);">
                    💡 <strong>Astuce locale :</strong> Vous ouvrez ce fichier directement avec le protocole <code>file:///</code>. Le fichier <code>js/formation-contenu.js</code> doit être présent pour afficher les cours sans serveur. Vous pouvez aussi lancer <code>node server.js</code> dans le terminal pour démarrer le serveur officiel sur <code>http://localhost:3000</code>.
                   </div>`
                : ''
            }
          </div>
        `;
      }
    },

    /**
     * Génère la table des matières (TOC) interactive et active le Scroll-Spy
     */
    _genererSommaireInteractif(sommaire) {
      const conteneurToc = document.getElementById('sommaire-dynamique-liste');
      if (!conteneurToc) return;

      if (!sommaire || sommaire.length === 0) {
        conteneurToc.innerHTML = `<p style="font-size: 0.82rem; color: var(--texte-3);">Aucun sous-titre dans cette section.</p>`;
        return;
      }

      let html = '<ul class="liste-toc-liens">';
      sommaire.forEach((item) => {
        const indentClass = item.niveau === 3 ? 'toc-indent-h3' : 'toc-indent-h2';
        html += `
          <li class="${indentClass}">
            <a href="#${item.id}" class="lien-toc-section" data-target-id="${item.id}">
              ${echapperHtml(item.texte)}
            </a>
          </li>
        `;
      });
      html += '</ul>';
      conteneurToc.innerHTML = html;

      // Scroll-Spy : observer les sections visibles
      if ('IntersectionObserver' in window) {
        const liens = conteneurToc.querySelectorAll('.lien-toc-section');
        const titres = document.querySelectorAll('#corps-cours-rendu h2, #corps-cours-rendu h3');

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const id = entry.target.id;
                liens.forEach((lien) => {
                  if (lien.getAttribute('data-target-id') === id) {
                    lien.classList.add('actif');
                  } else {
                    lien.classList.remove('actif');
                  }
                });
              }
            });
          },
          { rootMargin: '-80px 0px -70% 0px' }
        );

        titres.forEach((t) => observer.observe(t));
      }
    },

    /**
     * Boutons Suivant / Précédent en fin d'article
     */
    _mettreAJourNavigationBasDePage() {
      const conteneurNav = document.getElementById('navigation-pied-cours');
      if (!conteneurNav) return;

      const chapitres = this.coursActif?.chapitres || [];
      if (chapitres.length <= 1) {
        conteneurNav.style.display = 'none';
        return;
      }

      conteneurNav.style.display = 'flex';
      const indexActuel = chapitres.findIndex((c) => c.id === this.chapitreActif?.id);

      const precedent = indexActuel > 0 ? chapitres[indexActuel - 1] : null;
      const suivant = indexActuel < chapitres.length - 1 ? chapitres[indexActuel + 1] : null;

      conteneurNav.innerHTML = `
        <div class="nav-bas-bouton-gauche">
          ${
            precedent
              ? `<button type="button" class="btn-nav-bas btn-prev" data-target-ch="${precedent.id}">
                  <span class="nav-direction">← Chapitre Précédent</span>
                  <span class="nav-titre">${echapperHtml(precedent.titre)}</span>
                </button>`
              : ''
          }
        </div>
        <div class="nav-bas-bouton-droite">
          ${
            suivant
              ? `<button type="button" class="btn-nav-bas btn-next" data-target-ch="${suivant.id}">
                  <span class="nav-direction">Chapitre Suivant →</span>
                  <span class="nav-titre">${echapperHtml(suivant.titre)}</span>
                </button>`
              : ''
          }
        </div>
      `;

      conteneurNav.querySelectorAll('.btn-nav-bas').forEach((btn) => {
        btn.addEventListener('click', () => {
          const chId = btn.getAttribute('data-target-ch');
          this.chargerCours(this.coursActif.id, chId);
        });
      });
    },

    // =========================================================================
    // 3. GESTION DU GATEKEEPER (MODALE D'ACCÈS AUX CONTENUS PROTÉGÉS)
    // =========================================================================

    afficherGatekeeper(cours, raison) {
      // Mode Accès Libre Communautaire : Le verrouillage est désactivé
      this.masquerGatekeeper();
    },

    masquerGatekeeper(session) {
      const gatekeeper = document.getElementById('gatekeeper-cours-protege');
      const zoneContenu = document.getElementById('zone-lecture-principale');
      const badgeSessionTop = document.getElementById('topbar-session-info');

      if (gatekeeper) gatekeeper.style.display = 'none';
      if (zoneContenu) {
        zoneContenu.style.display = '';
        zoneContenu.removeAttribute('style');
      }

      // Afficher l'indicateur de session active dans la topbar
      if (badgeSessionTop && session) {
        const estAdmin = session.isSuperAdmin === true;
        const safeNom = echapperHtml(session.badgeNom || 'Membre');
        const safeId = echapperHtml(session.badgeId || 'TS');
        badgeSessionTop.innerHTML = `
          <div class="session-active-pill" title="Session Membre : ${safeNom}">
            <span class="pastille-verte"></span>
            <span class="session-nom">${safeNom}</span>
            <span class="session-badge-id">${safeId}</span>
            <button type="button" id="btn-deconnexion-session" class="btn-deconnexion-discret" title="Fermer cette session">✕</button>
          </div>
        `;

        const btnDeco = document.getElementById('btn-deconnexion-session');
        if (btnDeco) {
          btnDeco.addEventListener('click', () => {
            window.SaheliaSecurite.deconnecter();
            window.location.reload();
          });
        }
      }
    },

    ouvrirModalZoom(src) {
      let modal = document.getElementById('modal-zoom-schema');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-zoom-schema';
        modal.className = 'modal-overlay-zoom';
        modal.innerHTML = `
          <div class="modal-zoom-conteneur">
            <button type="button" class="btn-fermer-zoom" aria-label="Fermer le zoom">✕</button>
            <img src="" alt="Schéma grand format" id="image-grand-format">
          </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
          if (e.target === modal || e.target.closest('.btn-fermer-zoom')) {
            modal.style.display = 'none';
          }
        });
      }

      const img = modal.querySelector('#image-grand-format');
      if (img) img.src = src;
      modal.style.display = 'flex';
    },

    /**
     * Système d'Auto-Grader Pédagogique & Banque de Défis Terrains
     */
    _obtenirDefiPourChapitre(cours, chapitre, index) {
      const cleCoursChap = `${cours.id}_${chapitre.id}`;
      const cleIndex = `${cours.id}_${index + 1}`;

      const banque = {
        // --- MANUEL 01 : EXCEL POUR ÉTUDIANTS & PROFESSIONNELS ---
        'mn-01_1': {
          titre: 'Défi 01 · Sécurisation des calculs agronomiques',
          consigne: 'Téléchargez le jeu d’essais agronomiques réels ci-dessous. Ouvrez-le sous Excel et identifiez la formule standard évitant toute erreur de calcul lors de la division du rendement par la surface parcellaire.',
          question: 'Dans une feuille de calcul d’essais agricoles, quelle formule protège vos automatisations d’une division par zéro (#DIV/0!) lorsque certaines parcelles ne sont pas encore récoltées ?',
          options: [
            '=SIERREUR(Rendement / Superficie; 0)',
            '=Rendement / 0',
            '=DIVISER(Rendement; Superficie)',
            '=TEST.DIV(Rendement; Superficie; FAUX)'
          ],
          bonneReponse: 0,
          explication: 'L’encapsulation dans =SIERREUR(calcul; valeur_si_erreur) est la règle d’or pour fiabiliser les tableaux de bord et empêcher le blocage des macros ou des moyennes globales.',
          ressources: [
            { nom: 'dataset_agronomique_sahelia.csv (72 parcelles)', url: 'datasets/dataset_agronomique_sahelia.csv' }
          ]
        },
        'mn-01_2': {
          titre: 'Défi 02 · Références absolues et calcul de charges',
          consigne: 'Vous devez multiplier une colonne de quantités d’engrais par le prix unitaire fixé en cellule $D$2. La formule doit être recopiée sur 72 lignes d’essais sans dérive.',
          question: 'Quelle référence absolue garantit que la cellule D2 reste strictement figée en ligne et en colonne lors du glisser-déposer ?',
          options: [
            'D$2 (référence absolue sur la ligne uniquement)',
            '$D$2 (référence absolue intégrale colonne et ligne)',
            'D2$ (syntaxe non reconnue)',
            '&D&2 (opérateur de concaténation)'
          ],
          bonneReponse: 1,
          explication: 'Le double dollar ($D$2) fige à la fois la colonne et la ligne. C’est la référence absolue universelle indispensable pour appliquer un taux unique ou un prix pivot.',
          ressources: [
            { nom: 'dataset_agronomique_sahelia.csv', url: 'datasets/dataset_agronomique_sahelia.csv' }
          ]
        },
        'mn-01_6': {
          titre: 'Défi 06 · Nettoyage et curation de données d’enquêtes',
          consigne: 'Téléchargez le fichier brut d’enquêtes de terrain contenant des doublons, des coquilles et des espaces parasites. Identifiez la fonction standard de nettoyage textuel.',
          question: 'Quelle fonction Excel permet d’éliminer instantanément les espaces superflus au début, à la fin et les doubles espaces internes dans les noms de producteurs ou de communes ?',
          options: [
            '=EPURAGE(texte)',
            '=SUPPRESPACE(texte)',
            '=NETTOYER_ESPACES(texte)',
            '=FORMAT.TEXTE(texte; "sans_espace")'
          ],
          bonneReponse: 1,
          explication: 'La fonction =SUPPRESPACE(texte) (TRIM en anglais) élimine les espaces parasites générés lors des imports d’enquêtes mobiles Kobo ou ODK avant d’exécuter des jointures ou des TCD.',
          ressources: [
            { nom: 'dataset_brut_a_nettoyer_sahelia.csv (Données brutes)', url: 'datasets/dataset_brut_a_nettoyer_sahelia.csv' }
          ]
        },
        'mn-01_9': {
          titre: 'Défi 09 · Analyse de rentabilité agronomique',
          consigne: 'À partir des coûts totaux et des recettes calculées par culture (Maïs, Soja, Sorgho), déterminez la relation comptable de la Marge Brute.',
          question: 'Comment se calcule précisément la Marge Brute d’une parcelle agricole par hectare ?',
          options: [
            'Marge Brute = Chiffre d’Affaires Total - Charges Opérationnelles Variables',
            'Marge Brute = Chiffre d’Affaires Total + Amortissement du matériel',
            'Marge Brute = Coût des Semences / Rendement Total',
            'Marge Brute = Bénéfice Net avant impôt'
          ],
          bonneReponse: 0,
          explication: 'La Marge Brute agricole isole la performance intrinsèque de l’itinéraire technique en soustrayant uniquement les charges directement liées à la culture (semences, engrais, main-d’œuvre).',
          ressources: [
            { nom: 'dataset_agronomique_sahelia.csv', url: 'datasets/dataset_agronomique_sahelia.csv' }
          ]
        },

        // --- MANUEL 06 : SIG & CARTOGRAPHIE AGRICOLE ---
        'mn-06_1': {
          titre: 'Défi 01 · Géodésie et projection UTM au Bénin',
          consigne: 'Téléchargez le jeu de polygones d’essais agricoles du Borgou. Vous devez configurer votre projet QGIS pour des calculs de surfaces en mètres et hectares.',
          question: 'Dans quel fuseau de projection métrique UTM officiel se situe la grande majorité du Bénin (notamment Parakou, Cotonou et Bohicon) ?',
          options: [
            'WGS 84 / UTM Zone 31N (EPSG:32631)',
            'WGS 84 / UTM Zone 32N (EPSG:32632)',
            'Lambert-93 (EPSG:2154)',
            'RGF93 / CC49 (EPSG:3949)'
          ],
          bonneReponse: 0,
          explication: 'Le Bénin s’étend entre 1° et 3°45’ Est, ce qui place l’essentiel de son territoire dans le fuseau 31 Nord (EPSG:32631). Seule la frange orientale (Nikki, Kalalé) bascule en 32N.',
          ressources: [
            { nom: 'parcelles_agricoles_borgou.geojson (Polygones)', url: 'datasets/parcelles_agricoles_borgou.geojson' }
          ]
        },
        'mn-06_2': {
          titre: 'Défi 02 · Formats de données spatiales ouvertes',
          consigne: 'Examinez la structure du fichier spatial fourni et identifiez les formats modernes recommandés pour éviter les limites historiques du Shapefile (noms de champs limités à 10 caractères).',
          question: 'Quels formats vectoriels modernes et ouverts remplacent avantageusement le vieux format ESRI Shapefile pour les parcellaires agricoles ?',
          options: [
            'GeoPackage (.gpkg) et GeoJSON (.geojson)',
            'Fichier texte délimité (.csv) sans géométrie',
            'Image matricielle TIFF non géoréférencée',
            'Document PDF interactif'
          ],
          bonneReponse: 0,
          explication: 'L’OGC préconise le standard ouvert OGC GeoPackage (.gpkg) basé sur SQLite et le GeoJSON (.geojson) qui supportent l’encodage UTF-8 universel et suppriment les limites de champs.',
          ressources: [
            { nom: 'parcelles_agricoles_borgou.geojson', url: 'datasets/parcelles_agricoles_borgou.geojson' }
          ]
        },
        'mn-06_3': {
          titre: 'Défi 03 · Calculateur de superficies parcellaires dans QGIS',
          consigne: 'Dans la table d’attributs sous QGIS, vous devez calculer la superficie exacte en hectares de chaque polygone numérisé.',
          question: 'Quelle expression de la calculatrice de champ QGIS renvoie la superficie en hectares pour une couche projetée en UTM (EPSG:32631) ?',
          options: [
            '$area / 10000',
            '$area * 100',
            '$perimeter / 4',
            '$length / 1000'
          ],
          bonneReponse: 0,
          explication: 'Dans un CRS projeté en mètres, $area renvoie la surface en m². Un hectare valant 10 000 m², la division par 10 000 ($area / 10000) donne directement le résultat en hectares.',
          ressources: [
            { nom: 'parcelles_agricoles_borgou.geojson', url: 'datasets/parcelles_agricoles_borgou.geojson' }
          ]
        },

        // --- MANUEL 07 : COLLECTE MOBILE KOBOTOOLBOX ---
        'mn-07_1': {
          titre: 'Défi 01 · Spécification XLSForm pour relevé GNSS',
          consigne: 'Téléchargez la trame XLSForm ci-dessous. Vous préparez un formulaire pour les enquêteurs chargés de géolocaliser les parcelles paysannes.',
          question: 'Dans la feuille "survey" d’un questionnaire XLSForm, quel type de question permet d’enregistrer automatiquement la position GPS (latitude, longitude, altitude et précision) ?',
          options: [
            'geopoint',
            'geotrace',
            'coord_gps',
            'location_sensor'
          ],
          bonneReponse: 0,
          explication: 'Le mot-clé standard XLSForm "geopoint" déclenche le récepteur GNSS du smartphone ou de la tablette dans KoboCollect pour enregistrer les 4 attributs spatiaux.',
          ressources: [
            { nom: 'modele_enquete_agricole_kobo.csv (Trame XLSForm)', url: 'datasets/modele_enquete_agricole_kobo.csv' }
          ]
        },
        'mn-07_2': {
          titre: 'Défi 02 · Architecture d’un classeur XLSForm',
          consigne: 'Vous concevez un fichier Excel d’enquête pour KoboToolbox. Identifiez les feuilles obligatoires nécessaires à son déploiement.',
          question: 'Quelles sont les feuilles de calcul obligatoires que doit contenir un classeur Excel pour être importé avec succès sous KoboToolbox / ODK ?',
          options: [
            'survey et choices (la feuille settings étant facultative)',
            'questions, reponses et variables',
            'formulaire et dictionnaire_donnees',
            'data et metadata'
          ],
          bonneReponse: 0,
          explication: 'La norme universelle XLSForm exige au minimum la feuille "survey" (définition des questions) et "choices" (listes de choix déroulants), complétées souvent par "settings".',
          ressources: [
            { nom: 'modele_enquete_agricole_kobo.csv', url: 'datasets/modele_enquete_agricole_kobo.csv' }
          ]
        },

        // --- MANUEL 08 : AGRONOMIE DE PRÉCISION ---
        'mn-08_1': {
          titre: 'Défi 01 · Télédétection multispectrale & Indice NDVI',
          consigne: 'Pour évaluer la vigueur foliaire des cultures de maïs et de soja à partir d’images Sentinel-2 ou drone multispectral, vous calculez le NDVI.',
          question: 'Quelle formule mathématique exprime l’Indice de Végétation par Différence Normalisée (NDVI) à partir des réflectances Rouge (R) et Proche Infrarouge (PIR) ?',
          options: [
            '(PIR - R) / (PIR + R)',
            '(R - PIR) / (R + PIR)',
            'PIR / (R + 1)',
            '(PIR + R) / 2'
          ],
          bonneReponse: 0,
          explication: 'La chlorophylle absorbe la lumière rouge pour la photosynthèse et les structures cellulaires mésophylliennes réfléchissent fortement le proche infrarouge. La normalisation produit un indice compris entre -1 et +1.',
          ressources: [
            { nom: 'dataset_agronomique_sahelia.csv', url: 'datasets/dataset_agronomique_sahelia.csv' }
          ]
        },

        // --- MANUEL 12 : CRÉATION VIDÉO IA & STORYTELLING ---
        'mn-12_1': {
          titre: 'Défi 01 · Structure narrative de vulgarisation technique',
          consigne: 'Vous rédigez le script d’une capsule vidéo courte destinée à former les producteurs du Borgou à l’utilisation raisonnée des engrais.',
          question: 'Quelle structure narrative maximise l’attention et la rétention d’un public professionnel en format court (30 à 90 secondes) ?',
          options: [
            'Accroche terrain (Hook 0-3s) → Constat du problème → Solution pratique démontrée → Appel à l’action (CTA)',
            'Générique musical de 30 secondes → Contexte théorique exhaustif → Bibliographie académique',
            'Monologue sans illustration visuelle ni sous-titrage',
            'Succession de logos institutionnels sans message clé'
          ],
          bonneReponse: 0,
          explication: 'La structure narrative Hook-Problem-Solution-CTA capte l’attention dans les 3 premières secondes et garantit que le savoir agronomique est mémorisé et appliqué sur le terrain.'
        }
      };

      // Si le défi est expressément défini dans la banque, le retourner
      if (banque[cleCoursChap]) return banque[cleCoursChap];
      if (banque[cleIndex]) return banque[cleIndex];

      // Générateur contextuel procédural pour les autres chapitres
      return this._genererDefiGenerique(cours, chapitre, index);
    },

    _genererDefiGenerique(cours, chapitre, index) {
      const num = index + 1;
      return {
        titre: `Défi ${num < 10 ? '0' + num : num} · Validation Opérationnelle : ${chapitre.titre}`,
        consigne: `Mettez en pratique les concepts clés présentés dans le chapitre "${chapitre.titre}". Répondez à la question méthodologique suivante pour certifier vos compétences et débloquer vos 150 XP.`,
        question: `Dans le cadre de l’application rigoureuse des standards TEAM Sahélia pour "${chapitre.titre}", quelle démarche garantit la fiabilité et la reproductibilité des résultats sur le terrain ?`,
        options: [
          'Appliquer un protocole standardisé, vérifier la cohérence des données sources et documenter les étapes techniques.',
          'Ignorer les valeurs aberrantes sans vérification et procéder par estimation intuitive.',
          'Conserver des données non archivées sur un support temporaire sans sauvegarde de sécurité.'
        ],
        bonneReponse: 0,
        explication: 'L’excellence opérationnelle repose sur la standardisation des protocoles, le contrôle qualité systématique et la traçabilité des données scientifiques et agronomiques.',
        ressources: [
          { nom: 'dataset_agronomique_sahelia.csv (Ressource d’entraînement)', url: 'datasets/dataset_agronomique_sahelia.csv' }
        ]
      };
    },

    _configurerDefiInteractif(cours, chapitreSelectionne) {
      if (!chapitreSelectionne) return;
      const index = (cours.chapitres || []).findIndex(ch => ch.id === chapitreSelectionne.id);
      const defi = this._obtenirDefiPourChapitre(cours, chapitreSelectionne, index);
      this._defiActif = defi;

      const defiTitre = document.getElementById('defi-titre');
      const defiDesc = document.getElementById('defi-description');
      const resContainer = document.getElementById('defi-ressources');
      const qTexte = document.getElementById('defi-question-texte');
      const optContainer = document.getElementById('defi-options-container');
      const btnDefi = document.getElementById('btn-valider-defi');
      const feedback = document.getElementById('defi-statut-feedback');

      if (defiTitre) defiTitre.textContent = defi.titre;
      if (defiDesc) defiDesc.textContent = defi.consigne;

      if (resContainer) {
        if (defi.ressources && defi.ressources.length > 0) {
          resContainer.style.display = 'flex';
          resContainer.innerHTML = defi.ressources.map(r => `
            <a href="${r.url}" download class="defi-dl-btn">
              <span>📥</span> ${echapperHtml(r.nom)}
            </a>
          `).join('');
        } else {
          resContainer.style.display = 'none';
          resContainer.innerHTML = '';
        }
      }

      if (qTexte) qTexte.textContent = defi.question;

      let estValide = false;
      const cle = `sahelia_prog_${cours.id}_${chapitreSelectionne.id}`;
      try {
        estValide = localStorage.getItem(cle) === 'valide';
      } catch (e) {}

      if (optContainer) {
        optContainer.innerHTML = '';
        defi.options.forEach((opt, idx) => {
          const item = document.createElement('label');
          item.className = 'defi-option-item' + (estValide && idx === defi.bonneReponse ? ' selected' : '');
          item.innerHTML = `
            <input type="radio" name="sahelia-defi-opt" value="${idx}" class="defi-option-radio" ${estValide ? (idx === defi.bonneReponse ? 'checked' : 'disabled') : ''}>
            <span class="defi-option-text">${echapperHtml(opt)}</span>
          `;
          item.addEventListener('click', () => {
            if (estValide) return;
            optContainer.querySelectorAll('.defi-option-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
            const radio = item.querySelector('input');
            if (radio) radio.checked = true;
          });
          optContainer.appendChild(item);
        });

        if (estValide && defi.explication) {
          const expBox = document.createElement('div');
          expBox.className = 'defi-explication-box';
          expBox.innerHTML = `<strong>💡 Synthèse Pédagogique :</strong> ${echapperHtml(defi.explication)}`;
          optContainer.appendChild(expBox);
        }
      }

      if (btnDefi) {
        if (estValide) {
          btnDefi.textContent = '✓ Défi Validé avec Succès (+150 XP)';
          btnDefi.classList.add('v-btn--fantome');
          btnDefi.classList.remove('v-btn--vert');
          btnDefi.disabled = true;
          if (feedback) {
            feedback.className = 'defi-feedback-texte succes';
            feedback.innerHTML = '✓ Acquis validé et enregistré sur ce poste.';
          }
        } else {
          btnDefi.textContent = '✓ Soumettre & Valider ce Défi (+150 XP)';
          btnDefi.classList.remove('v-btn--fantome');
          btnDefi.classList.add('v-btn--vert');
          btnDefi.disabled = false;
          if (feedback) {
            feedback.className = 'defi-feedback-texte';
            feedback.textContent = '';
          }
        }
      }
    },

    _validerReponseDefi() {
      if (!this.coursActif || !this.chapitreActif || !this._defiActif) return;
      const cle = `sahelia_prog_${this.coursActif.id}_${this.chapitreActif.id}`;
      const feedback = document.getElementById('defi-statut-feedback');
      const btnDefi = document.getElementById('btn-valider-defi');

      const radioChecked = document.querySelector('input[name="sahelia-defi-opt"]:checked');
      if (!radioChecked) {
        if (feedback) {
          feedback.className = 'defi-feedback-texte erreur';
          feedback.textContent = '⚠️ Veuillez sélectionner une réponse avant de valider votre défi.';
        }
        return;
      }

      const repUtilisateur = parseInt(radioChecked.value, 10);
      if (repUtilisateur === this._defiActif.bonneReponse) {
        try {
          localStorage.setItem(cle, 'valide');
        } catch (e) {}

        if (feedback) {
          feedback.className = 'defi-feedback-texte succes';
          feedback.innerHTML = '🎉 <strong>Excellent !</strong> Défi validé avec succès (+150 XP). Vos acquis sont enregistrés.';
        }

        if (btnDefi) {
          btnDefi.textContent = '✓ Défi Validé avec Succès (+150 XP)';
          btnDefi.classList.add('v-btn--fantome');
          btnDefi.classList.remove('v-btn--vert');
          btnDefi.disabled = true;
        }

        const optContainer = document.getElementById('defi-options-container');
        if (optContainer && this._defiActif.explication && !optContainer.querySelector('.defi-explication-box')) {
          const expBox = document.createElement('div');
          expBox.className = 'defi-explication-box';
          expBox.innerHTML = `<strong>💡 Analyse Pédagogique :</strong> ${echapperHtml(this._defiActif.explication)}`;
          optContainer.appendChild(expBox);
        }

        this._mettreAJourProgressionEtBadges(this.coursActif);
        this._rendreSidebarChapitres(this.coursActif, this.chapitreActif);
      } else {
        if (feedback) {
          feedback.className = 'defi-feedback-texte erreur';
          feedback.innerHTML = '❌ <strong>Réponse incorrecte.</strong> Analysez bien le cours et réessayez pour mériter votre badge !';
        }
      }
    },

    afficherErreur(message) {
      const zone = document.getElementById('zone-lecture-principale');
      if (zone) {
        zone.innerHTML = `
          <div class="erreur-globale-plateforme">
            <h2>Information</h2>
            <p>${echapperHtml(message)}</p>
            <a href="index.html" class="v-btn v-btn--vert" style="margin-top: 1.5rem; display: inline-flex;">← Retour à l’accueil du site</a>
          </div>
        `;
      }
    }
  };

  window.SaheliaLecteur = Lecteur;

  // Démarrage automatique au chargement du DOM
  document.addEventListener('DOMContentLoaded', () => {
    Lecteur.init().catch(console.error);

    // Enregistrement PWA Service Worker (Mode Hors-Ligne)
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch((err) => {
        console.warn('PWA hors-ligne formation :', err);
      });
    }
  });
})();
