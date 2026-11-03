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
   * Parser Markdown complet en HTML sémantique
   */
  function parserMarkdown(md, options = {}) {
    if (!md) return '';
    const baseDir = options.baseDir || '';
    const titresSommaire = [];

    // 1. Découpage en blocs et extraction des blocs de code pour éviter les collisions
    const blocsCode = [];
    let texte = md.replace(/```([a-zA-Z0-9_\-\+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const id = `__BLOC_CODE_${blocsCode.length}__`;
      const langueAffichee = lang ? lang.toUpperCase() : 'TEXTE';
      const codeSecurise = echapperHtml(code.trim());
      blocsCode.push(`
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
      `);
      return id;
    });

    // 2. Traitement des blocs d'alertes spéciales (Callouts GitHub-style)
    // > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION]
    const typesCallouts = {
      'NOTE': { classe: 'callout-note', icone: 'ℹ️', titre: 'Information Pédagogique' },
      'TIP': { classe: 'callout-tip', icone: '💡', titre: 'Astuce Sahélia de Terrain' },
      'ASTUCE': { classe: 'callout-tip', icone: '💡', titre: 'Astuce Sahélia' },
      'IMPORTANT': { classe: 'callout-important', icone: '📌', titre: 'Règle Essentielle' },
      'WARNING': { classe: 'callout-warning', icone: '⚠️', titre: 'Attention / Piège Fréquent' },
      'ATTENTION': { classe: 'callout-warning', icone: '⚠️', titre: 'Point de Vigilance' },
      'CAUTION': { classe: 'callout-danger', icone: '🛑', titre: 'Erreur Critique à Éviter' }
    };

    // Traitement des citations et callouts
    texte = texte.replace(/(^> ?.*(?:\n> ?.*)*)/gm, (bloc) => {
      const lignes = bloc.split('\n').map((l) => l.replace(/^> ?/, ''));
      const premiereLigne = lignes[0].trim();
      const matchCallout = premiereLigne.match(/^\[!(NOTE|TIP|ASTUCE|IMPORTANT|WARNING|ATTENTION|CAUTION)\](?:\s*(.*))?$/i);

      if (matchCallout) {
        const typeCle = matchCallout[1].toUpperCase();
        const conf = typesCallouts[typeCle] || typesCallouts['NOTE'];
        const titrePersonnalise = matchCallout[2] ? matchCallout[2].trim() : conf.titre;
        const contenuReste = lignes.slice(1).join('\n').trim();
        return `
          <div class="callout-pedagogique ${conf.classe}">
            <div class="callout-entete">
              <span class="callout-icone">${conf.icone}</span>
              <strong class="callout-titre">${echapperHtml(titrePersonnalise)}</strong>
            </div>
            <div class="callout-corps">${parserLignesEnParagraphes(contenuReste)}</div>
          </div>
        `;
      }

      // Citation standard
      return `<blockquote class="citation-pedagogique">${parserLignesEnParagraphes(lignes.join('\n'))}</blockquote>`;
    });

    // 3. Traitement des Tableaux Markdown (| col | col |)
    texte = texte.replace(/((?:^|\n)\|[^\n]+\|\n\|[\s\-:|]+\|\n(?:\|[^\n]+\|\n?)+)/g, (matchTable) => {
      const lignes = matchTable.trim().split('\n').filter((l) => l.trim().length > 0);
      if (lignes.length < 2) return matchTable;

      const enteteLigne = lignes[0];
      const colonnesEntete = enteteLigne
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());

      const corpsLignes = lignes.slice(2);
      let htmlTable = `
        <div class="tableau-conteneur-responsive">
          <table class="tableau-pedagogique">
            <thead>
              <tr>
                ${colonnesEntete.map((c) => `<th>${parserFormatInline(c)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
      `;

      corpsLignes.forEach((l) => {
        const cols = l
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        htmlTable += `
          <tr>
            ${cols.map((c) => `<td>${parserFormatInline(c)}</td>`).join('')}
          </tr>
        `;
      });

      htmlTable += `
            </tbody>
          </table>
        </div>
      `;
      return '\n\n' + htmlTable + '\n\n';
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

      return `<h${niveau} id="${slug}" class="titre-pedagogique-h${niveau}">
        <a href="#${slug}" class="lien-ancre-titre" title="Lien direct vers cette section">#</a>
        ${parserFormatInline(texteAffiche)}
      </h${niveau}>`;
    });

    // 5. Images et Schémas vectoriels avec zoom
    texte = texte.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
      const cheminFinal = corrigerCheminImage(src.trim(), baseDir);
      const legende = alt ? `<figcaption class="figure-legende">${echapperHtml(alt)}</figcaption>` : '';
      const estSvg = cheminFinal.toLowerCase().endsWith('.svg');
      return `
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
    });

    // 6. Séparateurs horizontaux
    texte = texte.replace(/^(\-{3,}|\*{3,}|_{3,})$/gm, '<hr class="separateur-pedagogique">');

    // 7. Listes à puces et listes ordonnées
    // Traitement des listes avec cases à cocher [x] et [ ]
    texte = texte.replace(/^- \[([ xX])\] (.*)$/gm, (match, coche, reste) => {
      const estCoche = coche.toLowerCase() === 'x';
      return `<li class="element-liste-tache"><input type="checkbox" ${estCoche ? 'checked' : ''} disabled> ${parserFormatInline(reste)}</li>`;
    });

    // Listes ordonnées (1. 2. 3.)
    texte = texte.replace(/^(\d+)\.\s+(.+)$/gm, (match, num, reste) => {
      return `<li class="element-liste-ordonnee" value="${num}">${parserFormatInline(reste)}</li>`;
    });

    // Listes à puces simples (- ou *)
    texte = texte.replace(/^[\-\*]\s+(.+)$/gm, (match, reste) => {
      return `<li class="element-liste-puce">${parserFormatInline(reste)}</li>`;
    });

    // Emballer les li consécutifs dans <ul> ou <ol>
    texte = texte.replace(/((?:<li class="element-liste-puce">.*<\/li>\s*)+)/g, '<ul class="liste-pedagogique-ul">$1</ul>');
    texte = texte.replace(/((?:<li class="element-liste-ordonnee".*<\/li>\s*)+)/g, '<ol class="liste-pedagogique-ol">$1</ol>');
    texte = texte.replace(/((?:<li class="element-liste-tache".*<\/li>\s*)+)/g, '<ul class="liste-pedagogique-taches">$1</ul>');

    // 8. Paragraphes normaux
    const paragraphes = texte.split(/\n{2,}/);
    const htmlFinal = paragraphes
      .map((p) => {
        const propre = p.trim();
        if (!propre) return '';
        // Si le bloc commence déjà par un élément HTML structurel, ne pas l'envelopper dans <p>
        if (
          propre.startsWith('<h') ||
          propre.startsWith('<div') ||
          propre.startsWith('<figure') ||
          propre.startsWith('<blockquote') ||
          propre.startsWith('<ul') ||
          propre.startsWith('<ol') ||
          propre.startsWith('<hr') ||
          propre.startsWith('__BLOC_CODE_')
        ) {
          return propre;
        }
        return `<p class="paragraphe-pedagogique">${parserFormatInline(propre)}</p>`;
      })
      .join('\n\n');

    // 9. Réinjection des blocs de code
    let resultatFinal = htmlFinal;
    blocsCode.forEach((bloc, i) => {
      resultatFinal = resultatFinal.replace(`__BLOC_CODE_${i}__`, bloc);
    });

    return {
      html: resultatFinal,
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
   * Formatage inline : gras, italique, code inline, liens
   */
  function parserFormatInline(texte) {
    if (!texte) return '';
    return texte
      // Code inline `code`
      .replace(/`([^`]+)`/g, '<code class="code-inline">$1</code>')
      // Gras **texte**
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="texte-gras">$1</strong>')
      // Italique *texte*
      .replace(/\*([^*]+)\*/g, '<em class="texte-italique">$1</em>')
      // Liens [texte](url) avec filtrage strict des protocoles dangereux
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, href) => {
        const cleanHref = estUrlSecurisee(href) ? echapperHtml(href.trim()) : '#';
        return `<a href="${cleanHref}" target="_blank" rel="noopener noreferrer" class="lien-pedagogique">${echapperHtml(label)}</a>`;
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

      // Gestion de la taille de police
      const btnFontMinus = document.getElementById('btn-font-minus');
      const btnFontPlus = document.getElementById('btn-font-plus');
      const conteneurLecture = document.getElementById('conteneur-article-pedagogique');

      if (btnFontMinus && conteneurLecture) {
        btnFontMinus.addEventListener('click', () => {
          conteneurLecture.classList.remove('font-grand');
          conteneurLecture.classList.toggle('font-petit');
        });
      }

      if (btnFontPlus && conteneurLecture) {
        btnFontPlus.addEventListener('click', () => {
          conteneurLecture.classList.remove('font-petit');
          conteneurLecture.classList.toggle('font-grand');
        });
      }

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

      // Bouton Mode Zen (Plein Écran sans distractions)
      const btnZen = document.getElementById('btn-zen-mode');
      if (btnZen) {
        btnZen.addEventListener('click', () => {
          document.body.classList.toggle('mode-zen');
          const estZen = document.body.classList.contains('mode-zen');
          btnZen.textContent = estZen ? '✕ Quitter Zen' : '⛶ Zen';
          btnZen.title = estZen ? 'Revenir à l’affichage complet avec panneaux' : 'Basculer en mode lecture zen (plein écran)';
        });
      }

      // Bouton Validation de Défi Interactif (Système de Badges & XP)
      const btnDefi = document.getElementById('btn-valider-defi');
      if (btnDefi) {
        btnDefi.addEventListener('click', () => {
          if (!this.coursActif || !this.chapitreActif) return;
          const cle = `sahelia_prog_${this.coursActif.id}_${this.chapitreActif.id}`;
          try {
            localStorage.setItem(cle, 'valide');
          } catch (e) {}

          const feedback = document.getElementById('defi-statut-feedback');
          if (feedback) {
            feedback.className = 'defi-feedback-texte succes';
            feedback.innerHTML = '🎉 <strong>Défi Validé !</strong> +150 XP enregistrés pour l’obtention du badge.';
          }

          btnDefi.textContent = '✓ Défi Validé avec Succès';
          btnDefi.classList.add('v-btn--fantome');
          btnDefi.classList.remove('v-btn--vert');

          this._mettreAJourProgressionEtBadges(this.coursActif);
          this._rendreSidebarChapitres(this.coursActif, this.chapitreActif);
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

      // 2. Contrôle de sécurité et d'accès
      const controle = window.SaheliaSecurite ? window.SaheliaSecurite.verifierAccesCours(cours.id) : { autorise: cours.libre };

      if (!controle.autorise) {
        // Affichage du Gatekeeper pour les manuels protégés
        this.afficherGatekeeper(cours, controle.raison);
        return;
      }

      // Si autorisé, masquer le Gatekeeper et charger le contenu
      this.masquerGatekeeper(controle.session);

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
          badgeDesc: 'Attribué après validation du Projet Capstone Parakou',
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
          badgeNom: 'Expert Cartographie & SIG',
          badgeDesc: 'Délimitation parcellaire et télédétection Sentinel QGIS',
          heroImg: 'assets/images/immersion_terrain_recherche.jpg',
          objectifs: [
            'Systèmes de coordonnées et projection UTM 31N WGS84',
            'Calcul d’aires exactes en hectares sur polygones GPS',
            'Mise en page de cartes officielles pour rapports d’expertise'
          ]
        },
        'mn-07': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Competence_VibeCoding.png',
          badgeNom: 'Développement Web Moderne',
          badgeDesc: 'HTML5, CSS3 responsive et manipulation JavaScript',
          heroImg: 'assets/images/hero_terrain_agronomie.jpg',
          objectifs: [
            'Architecture web sémantique et responsive mobile',
            'Manipulation dynamique des données en JavaScript',
            'Déploiement et sécurisation de projets web en ligne'
          ]
        },
        'mn-08': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Competence_VibeCoding.png',
          badgeNom: 'Vibe Coding & Ingénierie IA',
          badgeDesc: 'Création d’outils métiers pilotés par l’IA responsable',
          heroImg: 'assets/images/hero_terrain_agronomie.jpg',
          objectifs: [
            'Spécification rigoureuse et orchestration de code par LLM',
            'Détection et neutralisation des hallucinations techniques',
            'Développement autonome d’outils professionnels pour le terrain'
          ]
        },
        'mn-09': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Membre_Officiel.png',
          badgeNom: 'Création Graphique & Vidéo Mobile',
          badgeDesc: 'Affiches professionnelles et montage vidéo smartphone',
          heroImg: 'assets/images/hero_terrain_agronomie.jpg',
          objectifs: [
            'Règles d’or de composition visuelle et psychologie des couleurs',
            'Storytelling et montage vidéo percutant sur mobile',
            'Production d’affiches de colloques et vulgarisation sur réseaux'
          ]
        },
        'mn-10': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Membre_Officiel.png',
          badgeNom: 'Consultant & Freelance Sahélia',
          badgeDesc: 'Monétisation des compétences auprès des ONG et projets',
          heroImg: 'assets/images/immersion_terrain_recherche.jpg',
          objectifs: [
            'Grilles tarifaires adaptées au marché béninois et ouest-africain',
            'Rédaction de devis et propositions techniques convaincantes',
            'Fidélisation clients et livraison de prestations irréprochables'
          ]
        },
        'mn-11': {
          badgeImg: 'assets/Badge_TEAM_Sahelia_Competence_SIG.png',
          badgeNom: 'Pilote de Drones & Agriculture de Précision',
          badgeDesc: 'Cartographie photogrammétrique et pulvérisation agricole calibrée',
          heroImg: 'assets/images/immersion_terrain_recherche.jpg',
          objectifs: [
            'Pilotage en Mode 2 et respect strict de la réglementation ANAC Bénin',
            'Plans de vol en peigne, calcul du GSD et orthomosaïque photogrammétrique',
            'Calibrage des atomiseurs rotatifs, maîtrise du Downwash et boucle drone-QGIS'
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

      // Statut d'accès dans la barre supérieure
      const statutBadgeTop = document.getElementById('topbar-statut-acces');
      if (statutBadgeTop) {
        if (cours.libre) {
          statutBadgeTop.innerHTML = `<span class="etiquette-acces libre">✓ Accès Libre Gratuit</span>`;
        } else {
          statutBadgeTop.innerHTML = `<span class="etiquette-acces protege">🔒 Réservé Membres & Formations</span>`;
        }
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

      // Mettre à jour l'état du bouton Défi dans le bac à sable
      if (chapitreSelectionne) {
        let estValide = false;
        try {
          estValide = localStorage.getItem(`sahelia_prog_${cours.id}_${chapitreSelectionne.id}`) === 'valide';
        } catch (e) {}

        const btnDefi = document.getElementById('btn-valider-defi');
        const feedback = document.getElementById('defi-statut-feedback');
        const defiTitre = document.getElementById('defi-titre');
        const defiDesc = document.getElementById('defi-description');

        if (defiTitre) {
          defiTitre.textContent = `Défi Terrain : ${chapitreSelectionne.titre}`;
        }
        if (defiDesc) {
          defiDesc.textContent = `Mettez en pratique les compétences de cette section sur vos fichiers ou avec les datasets téléchargeables, puis validez pour enrichir votre portfolio et débloquer votre badge officiel.`;
        }

        if (btnDefi) {
          if (estValide) {
            btnDefi.textContent = '✓ Défi Validé avec Succès';
            btnDefi.classList.add('v-btn--fantome');
            btnDefi.classList.remove('v-btn--vert');
            if (feedback) {
              feedback.className = 'defi-feedback-texte succes';
              feedback.innerHTML = '✓ Acquis certifié sur ce poste de travail.';
            }
          } else {
            btnDefi.textContent = '✓ Valider ce chapitre & Débloquer la suite';
            btnDefi.classList.remove('v-btn--fantome');
            btnDefi.classList.add('v-btn--vert');
            if (feedback) {
              feedback.className = 'defi-feedback-texte';
              feedback.textContent = '';
            }
          }
        }
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
          // 1. Priorité aux contenus embarqués (Permet un fonctionnement immédiat sous le protocole file:///)
          texteMd = window.SaheliaContenus[cleNormalisee];
        } else {
          // 2. Repli réseau fetch standard (lorsque le site est servi via HTTP/HTTPS)
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
      const gatekeeper = document.getElementById('gatekeeper-cours-protege');
      const zoneContenu = document.getElementById('zone-lecture-principale');
      const badgeSessionTop = document.getElementById('topbar-session-info');

      if (badgeSessionTop) badgeSessionTop.innerHTML = '';
      if (zoneContenu) zoneContenu.style.display = 'none';
      if (!gatekeeper) return;

      gatekeeper.style.display = 'block';

      // Remplir les informations du cours ciblé
      const titreCible = document.getElementById('gatekeeper-cours-titre');
      const descCible = document.getElementById('gatekeeper-cours-desc');
      const erreurBox = document.getElementById('gatekeeper-message-erreur');

      if (titreCible) titreCible.textContent = cours.titre;
      if (descCible) descCible.textContent = cours.description;
      if (erreurBox) {
        erreurBox.style.display = 'none';
        erreurBox.textContent = '';
      }

      // Mode d'accès : Apprenant VS Super-Administrateur / Éditeur
      let modeActuel = 'apprenant';
      const tabApprenant = document.getElementById('tab-mode-apprenant');
      const tabAdmin = document.getElementById('tab-mode-admin');
      const groupeBadge = document.getElementById('gk-groupe-badge');
      const labelCode = document.getElementById('gk-label-code');
      const inputCode = document.getElementById('gk-input-code');
      const btnValider = document.getElementById('gk-btn-deverrouiller');

      function basculerMode(mode) {
        modeActuel = mode;
        if (mode === 'admin') {
          if (tabAdmin) {
            tabAdmin.style.background = 'var(--marque)';
            tabAdmin.style.color = '#06100c';
            tabAdmin.style.fontWeight = '700';
          }
          if (tabApprenant) {
            tabApprenant.style.background = 'transparent';
            tabApprenant.style.color = 'var(--texte-2)';
            tabApprenant.style.fontWeight = '600';
          }
          if (groupeBadge) groupeBadge.style.display = 'none';
          if (labelCode) labelCode.textContent = 'Clé Maître d’Administration & Édition (Sans Badge) :';
          if (inputCode) inputCode.placeholder = 'Entrez la clé maître (ex: SAHELIA-EXCEL-2026)';
          if (btnValider) btnValider.textContent = '👑 Déverrouiller en Mode Administrateur & Éditeur';
        } else {
          if (tabApprenant) {
            tabApprenant.style.background = 'var(--marque)';
            tabApprenant.style.color = '#06100c';
            tabApprenant.style.fontWeight = '700';
          }
          if (tabAdmin) {
            tabAdmin.style.background = 'transparent';
            tabAdmin.style.color = 'var(--texte-2)';
            tabAdmin.style.fontWeight = '600';
          }
          if (groupeBadge) groupeBadge.style.display = 'block';
          if (labelCode) labelCode.textContent = '2. Code d’Accès Fondation :';
          if (inputCode) inputCode.placeholder = 'Code secret transmis par le fondateur';
          if (btnValider) btnValider.textContent = 'Déverrouiller l’accès au Manuel';
        }
        if (erreurBox) erreurBox.style.display = 'none';
      }

      if (tabApprenant) tabApprenant.onclick = () => basculerMode('apprenant');
      if (tabAdmin) tabAdmin.onclick = () => basculerMode('admin');

      if (window.SaheliaSecurite && window.SaheliaSecurite._modeAdminSuggereParUrl) {
        basculerMode('admin');
      }

      // Pré-remplissage éventuel
      const inputBadge = document.getElementById('gk-input-badge-id');
      const feedbackBadge = document.getElementById('gk-feedback-badge');
      if (inputBadge && feedbackBadge) {
        inputBadge.addEventListener('input', () => {
          const id = inputBadge.value.trim().toUpperCase();
          if (id.length >= 6 && window.SaheliaDB && window.SaheliaDB.trouverBadgeParId) {
            const badge = window.SaheliaDB.trouverBadgeParId(id);
            if (badge) {
              feedbackBadge.className = 'gk-feedback valide';
              feedbackBadge.textContent = `✓ ${badge.beneficiaireNom} (${badge.titre})`;
              return;
            }
          }
          feedbackBadge.className = 'gk-feedback neutre';
          feedbackBadge.textContent = 'Saisissez votre identifiant (ex: TS-MBR-2026-001)';
        });
      }

      // Écouteur de validation
      if (btnValider) {
        btnValider.onclick = async () => {
          const badgeId = (document.getElementById('gk-input-badge-id')?.value || '').trim();
          const code = (document.getElementById('gk-input-code')?.value || '').trim();
          const seSouvenir = document.getElementById('gk-checkbox-souvenir')?.checked || true;

          btnValider.disabled = true;
          btnValider.textContent = 'Vérification en cours...';

          let resultat;
          if (modeActuel === 'admin') {
            resultat = await window.SaheliaSecurite.authentifierAdmin(code, seSouvenir);
          } else {
            resultat = await window.SaheliaSecurite.authentifier(badgeId, code, seSouvenir);
          }

          btnValider.disabled = false;
          btnValider.textContent = modeActuel === 'admin' ? '👑 Déverrouiller en Mode Administrateur & Éditeur' : 'Déverrouiller l’accès au Manuel';

          if (resultat.succes) {
            // Recharger le cours maintenant déverrouillé
            await this.chargerCours(cours.id, null);
          } else {
            if (erreurBox) {
              erreurBox.textContent = resultat.erreur;
              erreurBox.style.display = 'block';
            }
          }
        };
      }
    },

    masquerGatekeeper(session) {
      const gatekeeper = document.getElementById('gatekeeper-cours-protege');
      const zoneContenu = document.getElementById('zone-lecture-principale');
      const badgeSessionTop = document.getElementById('topbar-session-info');

      if (gatekeeper) gatekeeper.style.display = 'none';
      if (zoneContenu) zoneContenu.style.display = 'grid';

      // Afficher l'indicateur de session active dans la topbar
      if (badgeSessionTop && session) {
        const estAdmin = session.isSuperAdmin === true;
        const safeNom = echapperHtml(session.badgeNom || 'Membre');
        const safeId = echapperHtml(session.badgeId || 'TS');
        badgeSessionTop.innerHTML = `
          <div class="session-active-pill" style="${estAdmin ? 'border-color: #e8946a; background: rgba(232, 148, 106, 0.15);' : ''}" title="Connecté en tant que ${safeNom}">
            <span class="pastille-verte" style="${estAdmin ? 'background: #e8946a;' : ''}"></span>
            <span class="session-nom" style="${estAdmin ? 'color: #e8946a; font-weight: bold;' : ''}">${estAdmin ? '👑 ' : ''}${safeNom}</span>
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
  });
})();
