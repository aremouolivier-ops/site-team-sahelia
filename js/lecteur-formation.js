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

      // Transformation des en-têtes métadonnées bruts (Manuel, Auteur, Temps, Illustration) en carte éditoriale propre
      const estBlocMeta = lignes.some((l) => /\*\*(?:Manuel|Auteur|Temps d[’']apprentissage|Dur[ée]e|Illustration associ[ée]e|Fichiers associ[ée]s|Jeu de donn[ée]es)\s*:\*\*/i.test(l));
      if (estBlocMeta) {
        const itemsHtml = [];
        lignes.forEach((l) => {
          const m = l.match(/^\s*\*\*([^:*]+)\s*:\*\*\s*(.+)$/);
          if (!m) return;
          const cle = m[1].trim();
          let val = m[2].trim();
          // Masquer les chemins techniques internes schemas/*.svg (déjà rendus visuellement dans le corps)
          val = val.replace(/`?(?:\.\.\/)?schemas\/[^`\s·,]+\.svg`?/gi, '').replace(/\s*·\s*$/, '').trim();
          if (!val || /^aucun$/i.test(val)) return;

          // Transformer les jeux de données (.csv, .xlsx) en liens propres
          const matchDataset = val.match(/`?((?:\.\.\/)?datasets\/[^`\s·,]+)`?/i);
          if (matchDataset) {
            const cheminRes = corrigerCheminImage(matchDataset[1], baseDir);
            const nomFichier = matchDataset[1].split('/').pop();
            itemsHtml.push(`<a href="${echapperHtml(cheminRes)}" download class="meta-chapitre-pill meta-chapitre-dl">📥 ${echapperHtml(cle)} : ${echapperHtml(nomFichier)}</a>`);
            return;
          }

          if (/illustration associ/i.test(cle)) return;
          itemsHtml.push(`<span class="meta-chapitre-pill"><strong>${echapperHtml(cle)} :</strong> ${echapperHtml(val.replace(/`/g, ''))}</span>`);
        });
        if (itemsHtml.length > 0) {
          return sauverBloc(`<div class="fiche-meta-chapitre">${itemsHtml.join('')}</div>`);
        }
        return '';
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
            <img src="${cheminFinal}" alt="${echapperHtml(alt)}" ${estSvg ? 'decoding="async"' : 'loading="lazy"'} class="image-cours-cliquable" data-zoom-src="${cheminFinal}">
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
    cacheChapitresRendus: new Map(),
    chunksCharges: new Set(),

    /**
     * Vide le cache mémoire session (exécuté automatiquement lors d'une déconnexion ou d'un verrouillage)
     */
    viderCacheMemoire() {
      if (this.cacheChapitresRendus) {
        this.cacheChapitresRendus.clear();
      }
    },

    /**
     * Charge à la demande le module chiffré spécifique d'un manuel (Évite le téléchargement inutile de 1,22 Mo)
     */
    async _chargerChunkCours(coursId) {
      if (!coursId || !coursId.startsWith('mn-')) return true;
      if (this.chunksCharges && this.chunksCharges.has(coursId)) return true;

      // Vérifier si les contenus de ce cours sont déjà en mémoire (ex: bundle unifié présent)
      const cours = window.SaheliaCatalogue ? window.SaheliaCatalogue.obtenirCours(coursId) : null;
      if (!cours || !cours.chapitres || cours.chapitres.length === 0) return true;

      const premierFichier = cours.chapitres[0].fichier.replace(/\\/g, '/');
      if (window.SaheliaContenusChiffres && window.SaheliaContenusChiffres[premierFichier]) {
        if (this.chunksCharges) this.chunksCharges.add(coursId);
        return true;
      }

      if (typeof document === 'undefined' || !document.createElement) return true;

      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `js/contenus/cours-${coursId}.js?v=2026.8`;
        script.async = true;
        script.onload = () => {
          if (this.chunksCharges) this.chunksCharges.add(coursId);
          resolve(true);
        };
        script.onerror = () => {
          console.warn(`[Lecteur] Module js/contenus/cours-${coursId}.js introuvable, tentative via bundle global.`);
          resolve(false);
        };
        document.head.appendChild(script);
      });
    },

    async init() {
      // 0. Réinitialiser tout mode résiduel et appliquer le thème mémorisé (Nuit Terrain / Papier Solaire)
      document.body.classList.remove('mode-zen');
      this.initialiserTheme();

      // 1. Initialiser le contrôle d'accès
      if (window.SaheliaSecurite) {
        await window.SaheliaSecurite.init();
      }

      // 2. Afficher la bannière d'annonces si active
      this._initialiserBanniereAnnonces();

      // 3. Écouteurs d'événements globaux (zoom, copies de code, thème, hors-ligne, zen)
      this._attacherEcouteursGlobaux();

      // 4. Lire les paramètres de l'URL (?cours=mn-01&ch=ch-01)
      const params = new URLSearchParams(window.location.search);
      const coursId = params.get('cours') || 'guide-01';
      const chapitreId = params.get('ch') || null;

      await this.chargerCours(coursId, chapitreId);
    },

    initialiserTheme() {
      let theme = 'sombre';
      try {
        const sauvegarde = localStorage.getItem('sahelia_theme_lecteur');
        if (sauvegarde === 'clair' || sauvegarde === 'sombre') theme = sauvegarde;
      } catch (e) {}
      this._appliquerTheme(theme);
    },

    _appliquerTheme(theme) {
      const estClair = theme === 'clair';
      if (estClair) {
        document.documentElement.setAttribute('data-theme', 'clair');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      const btnTheme = document.getElementById('btn-theme-lecteur');
      if (btnTheme) {
        btnTheme.textContent = estClair ? '🌙 Nuit' : '☀️ Papier';
        btnTheme.title = estClair ? 'Passer en mode Nuit Terrain (sombre)' : 'Passer en mode Papier Solaire (clair haute lisibilité)';
        btnTheme.setAttribute('aria-pressed', String(estClair));
      }
    },

    basculerTheme() {
      const estActuelClair = document.documentElement.getAttribute('data-theme') === 'clair';
      const nouveau = estActuelClair ? 'sombre' : 'clair';
      try {
        localStorage.setItem('sahelia_theme_lecteur', nouveau);
      } catch (e) {}
      this._appliquerTheme(nouveau);
    },

    async telechargerCoursHorsLigne() {
      if (!this.coursActif) return;
      const btnOffline = document.getElementById('btn-offline-cours');
      if (btnOffline) {
        btnOffline.disabled = true;
        btnOffline.textContent = '⏳ Mise en cache…';
      }

      const urls = new Set();
      if (this.coursActif.id.startsWith('mn-')) {
        urls.add(`js/contenus/cours-${this.coursActif.id}.js?v=2026.8`);
      }
      (this.coursActif.ressources || []).forEach((r) => {
        if (r && r.fichier) urls.add(r.fichier);
      });
      // Récupérer également les schémas SVG déjà rendus ou connus du chapitre actif
      document.querySelectorAll('#corps-cours-rendu img[src]').forEach((img) => {
        const attrSrc = img.getAttribute('src');
        if (attrSrc && !attrSrc.startsWith('data:')) urls.add(attrSrc);
      });

      const listeUrls = Array.from(urls);
      try {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'CACHE_COURSE', urls: listeUrls });
        }
        if ('caches' in window) {
          const cache = await caches.open('sahelia-v9-cache');
          await Promise.allSettled(listeUrls.map((u) => fetch(u).then((r) => r.ok ? cache.put(u, r) : null)));
        }
        try {
          localStorage.setItem(`sahelia_offline_${this.coursActif.id}`, String(Date.now()));
        } catch (e) {}
        if (btnOffline) {
          btnOffline.disabled = false;
          btnOffline.textContent = '✓ Hors-ligne prêt';
          btnOffline.classList.add('offline-actif');
        }
      } catch (err) {
        if (btnOffline) {
          btnOffline.disabled = false;
          btnOffline.textContent = '📥 Hors-ligne';
        }
      }
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

      // Bouton Bascule Thème Lecture (Nuit Terrain <-> Papier Solaire)
      const btnTheme = document.getElementById('btn-theme-lecteur');
      if (btnTheme) {
        btnTheme.addEventListener('click', () => {
          this.basculerTheme();
        });
      }

      // Bouton Téléchargement Hors-Ligne du Manuel Actif
      const btnOffline = document.getElementById('btn-offline-cours');
      if (btnOffline) {
        btnOffline.addEventListener('click', () => {
          this.telechargerCoursHorsLigne();
        });
      }

      // Fermeture du zoom SVG par touche Échap
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const modalZoom = document.getElementById('modal-zoom-schema');
          if (modalZoom && modalZoom.style.display === 'flex') {
            modalZoom.style.display = 'none';
          }
        }
      });

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
     * Relance le chargement du cours ou du chapitre actif (Action utilisateur Réessayer)
     */
    reessayerChargement() {
      const conteneurCorps = document.getElementById('corps-cours-rendu');
      if (conteneurCorps) {
        conteneurCorps.innerHTML = `
          <div id="etat-chargement-cours" class="chargement-cours-spinner" role="status" aria-live="polite">
            <div class="spinner-cercle"></div>
            <p class="texte-chargement-cours">Chargement de votre manuel…</p>
          </div>
        `;
      }
      if (this.coursActif && this.coursActif.id) {
        const chId = this.chapitreActif ? this.chapitreActif.id : null;
        this.chargerCours(this.coursActif.id, chId);
      } else {
        const params = new URLSearchParams(window.location.search);
        const coursId = params.get('cours') || 'guide-01';
        const chId = params.get('ch') || null;
        this.chargerCours(coursId, chId);
      }
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

      // 0. Charger le module chiffré spécifique à la demande si non encore présent
      await this._chargerChunkCours(coursId);

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

      // Pont vers le Studio Badge lors d'une complétion à 100 %
      const badgeCard = document.getElementById('sidebar-badge-preview-card');
      const parentSidebar = badgeCard ? badgeCard.parentElement : null;
      let encart100 = document.getElementById('encart-certification-100');

      if (pct === 100 && parentSidebar) {
        const xpTotal = chapitres.length * 150;
        const lienStudio = `index.html?badgeCours=${encodeURIComponent(cours.id)}#badges`;
        if (!encart100 && typeof document.createElement === 'function' && typeof badgeCard.insertAdjacentElement === 'function') {
          encart100 = document.createElement('div');
          encart100.id = 'encart-certification-100';
          encart100.className = 'encart-certification-100';
          badgeCard.insertAdjacentElement('afterend', encart100);
        }
        if (encart100) {
          encart100.innerHTML = `
          <div class="encart-cert-titre">🏆 Parcours Complété à 100 % (${xpTotal} XP)</div>
          <p class="encart-cert-texte">Tous les défis de ce parcours sont validés sur ce poste. Réclamez ou exportez votre preuve de complétion :</p>
          <a href="${lienStudio}" class="v-btn v-btn--vert encart-cert-btn">🏅 Réclamer / Aperçu Badge</a>
          <button type="button" id="btn-export-attestation-locale" class="v-btn v-btn--fantome encart-cert-btn">📄 Exporter Reçu JSON (${chapitres.length}/${chapitres.length})</button>
        `;
        }
        const btnExport = document.getElementById('btn-export-attestation-locale');
        if (btnExport) {
          btnExport.onclick = () => {
            const payload = {
              plateforme: 'TEAM Sahélia',
              coursId: cours.id,
              titre: cours.titre,
              chapitresValides: chapitres.map((c) => ({ id: c.id, titre: c.titre })),
              progressionPourcent: 100,
              xpTotal,
              dateValidation: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Completion_${cours.id}_TEAM_Sahelia.json`;
            a.click();
            URL.revokeObjectURL(url);
          };
        }
      } else if (encart100 && typeof encart100.remove === 'function') {
        encart100.remove();
      } else if (encart100 && encart100.style) {
        encart100.innerHTML = '';
        encart100.style.display = 'none';
      }
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
        const sourceWebp = document.getElementById('hero-image-source-webp');
        if (sourceWebp) {
          sourceWebp.srcset = metaHybride.heroImg.replace(/\.jpg$/i, '.webp');
        }
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

      // Mise à jour de l'état hors-ligne du cours actif
      const btnOffline = document.getElementById('btn-offline-cours');
      if (btnOffline) {
        let estEnCache = false;
        try {
          estEnCache = Boolean(localStorage.getItem(`sahelia_offline_${cours.id}`));
        } catch (e) {}
        btnOffline.textContent = estEnCache ? '✓ Hors-ligne prêt' : '📥 Hors-ligne';
        btnOffline.classList.toggle('offline-actif', estEnCache);
        btnOffline.disabled = false;
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
        if (chapitreSelectionne) {
          this._configurerDefiInteractif(cours, chapitreSelectionne);
        }
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

      const cleCache = String(cheminFichier || '').replace(/\\/g, '/').toLowerCase();
      const aContenuDynamique = Boolean(
        (this.chapitreActif && this.chapitreActif.contenuMarkdown) ||
        (this.coursActif && this.coursActif.contenuMarkdown)
      );

      // 1. Contrôle du Cache Mémoire Session (Accès instantané 0.0017 ms sans recalcul)
      // Utilisé uniquement si aucun contenu personnalisé dynamique (créé en administration) n'est actif
      if (!aContenuDynamique && this.cacheChapitresRendus && this.cacheChapitresRendus.has(cleCache)) {
        const entree = this.cacheChapitresRendus.get(cleCache);
        conteneurCorps.innerHTML = entree.html;
        this.sommaireActif = entree.sommaire || [];
        this._genererSommaireInteractif(this.sommaireActif);
        this._mettreAJourNavigationBasDePage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      conteneurCorps.innerHTML = `
        <div id="etat-chargement-cours" class="chargement-cours-spinner" role="status" aria-live="polite">
          <div class="spinner-cercle"></div>
          <p class="texte-chargement-cours">Chargement de votre manuel…</p>
        </div>
      `;

      try {
        const cleNormalisee = String(cheminFichier || '').replace(/\\/g, '/').replace(/^\.\//, '');
        let texteMd = '';

        // Tenter de charger le chunk dédié si le chapitre chiffré n'est pas encore présent en mémoire
        if ((!window.SaheliaContenusChiffres || !window.SaheliaContenusChiffres[cleNormalisee]) && this.coursActif && this.coursActif.id) {
          await this._chargerChunkCours(this.coursActif.id);
        }

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

        // Mémorisation sécurisée dans le cache session (validé non corrompu, hors contenus dynamiques)
        if (!aContenuDynamique && cleCache && cleCache.length > 0 && rendu.html && rendu.html.length > 0 && this.cacheChapitresRendus) {
          this.cacheChapitresRendus.set(cleCache, {
            html: rendu.html,
            sommaire: Object.freeze([...(rendu.sommaire || [])]),
            date: Date.now()
          });
        }

        // Générer le Sommaire (TOC) interactif à droite
        this._genererSommaireInteractif(this.sommaireActif);

        // Mettre à jour les boutons précédent / suivant en bas d'article
        this._mettreAJourNavigationBasDePage();

        // Réinitialiser le défilement
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        const estProtocoleFile = window.location.protocol === 'file:';
        const estHorsLigne = typeof navigator !== 'undefined' && navigator.onLine === false;
        const titreErr = estHorsLigne ? 'Connexion Internet interrompue' : 'Impossible de charger cette section';
        const messageErr = estHorsLigne
          ? 'Votre appareil semble actuellement hors ligne et ce chapitre n’a pas encore été enregistré dans le cache local.'
          : (err.message || 'Une interruption temporaire est survenue lors de la récupération du manuel.');

        conteneurCorps.innerHTML = `
          <div class="alerte-erreur-chargement" role="alert">
            <div class="erreur-chargement-entete">
              <span class="erreur-icone">${estHorsLigne ? '📡' : '⚠️'}</span>
              <h3 class="erreur-chargement-titre">${titreErr}</h3>
            </div>
            <p class="erreur-message-detail">${echapperHtml(messageErr)}</p>
            <div class="erreur-chargement-actions">
              <button type="button" class="v-btn v-btn--vert btn-reessayer" id="btn-reessayer-chargement">
                🔄 Réessayer
              </button>
            </div>
            <p style="font-size: 0.8rem; color: var(--texte-3); margin-top: 0.75rem;">Ressource demandée : <code>${echapperHtml(cheminFichier)}</code></p>
            ${
              estProtocoleFile
                ? `<div class="astuce-locale-file">
                    💡 <strong>Astuce locale :</strong> Vous ouvrez ce fichier directement avec le protocole <code>file:///</code>. Le fichier <code>js/formation-contenu.js</code> doit être présent pour afficher les cours sans serveur. Vous pouvez aussi lancer <code>node server.js</code> dans le terminal pour démarrer le serveur officiel sur <code>http://localhost:3000</code>.
                   </div>`
                : ''
            }
          </div>
        `;

        const btnReessayer = conteneurCorps.querySelector('#btn-reessayer-chargement');
        if (btnReessayer) {
          btnReessayer.addEventListener('click', () => {
            this.reessayerChargement();
          });
        }
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
     * Système d'Auto-Grader Pédagogique & Banque de Défis Terrains (indexé par ID de chapitre exact)
     */
    _obtenirDefiPourChapitre(cours, chapitre, index) {
      const cleCoursChap = `${cours.id}_${chapitre.id}`;

      const banque = {
        // --- MANUEL 01 : EXCEL POUR ÉTUDIANTS & PROFESSIONNELS ---
        'mn-01_ch-00': {
          titre: 'Défi 00 · Architecture tabulaire propre',
          consigne: 'Avant de saisir votre premier essai sous Excel, appliquez la règle structurelle fondamentale d’une base exploitable sous Excel, RStudio et QGIS.',
          question: 'Pourquoi faut-il strictement proscrire les cellules fusionnées et les sous-titres intercalés au milieu d’une base de données d’essais ?',
          options: [
            'Ils bloquent les filtres, les Tableaux Croisés Dynamiques (TCD) et l’importation R / QGIS.',
            'Ils augmentent uniquement la taille visuelle des caractères à l’impression.',
            'Ils empêchent le logiciel Excel d’enregistrer le fichier au format .xlsx.'
          ],
          bonneReponse: 0,
          explication: 'Une table propre suit la règle 1 ligne = 1 observation et 1 colonne = 1 variable : zéro fusion, zéro ligne vide, en-tête unique en ligne 1.',
          ressources: [{ nom: 'dataset_agronomique_sahelia.csv (72 parcelles)', url: 'datasets/dataset_agronomique_sahelia.csv' }]
        },
        'mn-01_ch-01': {
          titre: 'Défi 01 · Anatomie d’Excel & Hygiène de Saisie',
          consigne: 'Téléchargez le jeu d’essais agronomiques réels ci-dessous. Ouvrez-le sous Excel et repérez le piège classique du séparateur décimal.',
          question: 'Dans Excel configuré en français, comment reconnaissez-vous immédiatement qu’un nombre décimal saisi avec un point (`24.5`) est interprété comme du TEXTE inutilisable pour les moyennes ?',
          options: [
            'Excel le colore automatiquement en rouge vif.',
            'La valeur reste alignée à gauche par défaut dans la cellule au lieu de s’aligner à droite.',
            'Excel affiche systématiquement #NOM? dès la validation par Entrée.'
          ],
          bonneReponse: 1,
          explication: 'Dans Excel, un vrai nombre valide s’aligne toujours à droite, tandis qu’une chaîne de texte s’aligne par défaut à gauche. Tout calcul sur du texte fausse les rendements.',
          ressources: [{ nom: 'dataset_agronomique_sahelia.csv (72 parcelles)', url: 'datasets/dataset_agronomique_sahelia.csv' }]
        },
        'mn-01_ch-02': {
          titre: 'Défi 02 · Formules Arithmétiques & Règle du Dollar ($)',
          consigne: 'Vous devez multiplier chaque dose d’engrais par un prix unitaire fixe placé en $D$2 et protéger la division rendement/surface contre les zéros.',
          question: 'Quelle référence absolue et raccourci clavier permettent de figer intégralement la cellule D2 avant de recopier une formule sur 72 lignes ?',
          options: [
            'D$2 via la touche Échap',
            'D2$ via la touche F2',
            '$D$2 obtenue rapidement avec la touche F4'
          ],
          bonneReponse: 2,
          explication: 'Le double dollar ($D$2) bloque colonne et ligne ; la touche F4 bascule en un appui entre référence relative, absolue et mixte.',
          ressources: [{ nom: 'dataset_agronomique_sahelia.csv', url: 'datasets/dataset_agronomique_sahelia.csv' }]
        },
        'mn-01_ch-06': {
          titre: 'Défi 06 · Nettoyage de Bases de Données Brutes',
          consigne: 'Téléchargez le fichier brut d’enquêtes contenant des espaces parasites après import KoboToolbox.',
          question: 'Quelle fonction Excel supprime les espaces superflus en début, fin et doublons internes dans les noms de communes ou producteurs ?',
          options: [
            '=NETTOYER_ESPACES(texte)',
            '=SUPPRESPACE(texte)',
            '=CARACTERES(texte; 0)'
          ],
          bonneReponse: 1,
          explication: 'La fonction =SUPPRESPACE(texte) (TRIM en anglais) uniformise instantanément les libellés avant toute jointure ou TCD.',
          ressources: [{ nom: 'dataset_brut_a_nettoyer_sahelia.csv (Données brutes)', url: 'datasets/dataset_brut_a_nettoyer_sahelia.csv' }]
        },
        'mn-01_ch-09': {
          titre: 'Défi Capstone · Analyse de Rentabilité & TCD',
          consigne: 'Calculez les marges par culture (Maïs, Soja, Sorgho) et consolidez vos résultats.',
          question: 'Comment se calcule rigoureusement la Marge Brute agricole à l’hectare ?',
          options: [
            'Marge Brute = Chiffre d’Affaires Total − Charges Opérationnelles Variables',
            'Marge Brute = Coût des Semences ÷ Rendement Total',
            'Marge Brute = Chiffre d’Affaires Total + Subventions + Amortissements'
          ],
          bonneReponse: 0,
          explication: 'La Marge Brute isole la performance technique en déduisant uniquement les charges proportionnelles engagées pour la culture.',
          ressources: [{ nom: 'dataset_agronomique_sahelia.csv', url: 'datasets/dataset_agronomique_sahelia.csv' }]
        },

        // --- MANUEL 02 : WORD & POWERPOINT PRO ---
        'mn-02_ch-01': {
          titre: 'Défi 01 · Styles Hiérarchiques & Sommaire Automatique',
          question: 'Pourquoi faut-il appliquer les styles intégrés (Titre 1, Titre 2, Titre 3) plutôt que de mettre manuellement vos titres en gras et taille 16 ?',
          options: [
            'Les styles permettent à Word de générer un sommaire dynamique cliquable avec numéros de page auto-actualisés.',
            'Le texte manuel en gras disparaît lors de l’export au format PDF.',
            'Les styles réduisent la taille du fichier DOCX de 95 %.'
          ],
          bonneReponse: 0,
          explication: 'Seuls les styles hiérarchiques alimentent le Volet de Navigation et la Table des Matières automatique sans ressaisie ni décalage.'
        },
        'mn-02_ch-02': {
          titre: 'Défi 02 · Sauts de Section & Pagination Différenciée',
          question: 'Pour passer de la numérotation romaine (i, ii, iii) des pages liminaires aux chiffres arabes (1, 2, 3) à l’Introduction sans tout dérégler, que faut-il faire ?',
          options: [
            'Insérer un simple Saut de Page puis retaper les numéros à la main.',
            'Insérer un Saut de Section (Page suivante) et désactiver « Lier au précédent » dans l’en-tête/pied de page.',
            'Créer deux fichiers Word séparés et les imprimer en double.'
          ],
          bonneReponse: 1,
          explication: 'Le Saut de Section suivi de la rupture du lien « Lier au précédent » isole totalement les pieds de page entre sections.'
        },
        'mn-02_ch-05': {
          titre: 'Défi 05 · Soutenance & Lisibilité 10 Mètres',
          question: 'Quelle règle caractérise une diapositive de soutenance claire selon les standards académiques modernes ?',
          options: [
            'La règle du 6×6 : maximum 6 lignes par slide et ~6 mots clés par ligne, police ≥ 24 pt.',
            'Copier-coller l’intégralité du paragraphe Word de résultats en taille 11 pt.',
            'Utiliser 4 animations par puce pour maintenir le jury éveillé.'
          ],
          bonneReponse: 0,
          explication: 'Une diapositive accompagne votre discours oral : 1 idée maîtresse + 1 schéma ou graphique parlant vaut mieux que 15 lignes de prose.'
        },

        // --- MANUEL 03 : 50 ASTUCES & RACCOURCIS PC ---
        'mn-03_ch-02': {
          titre: 'Défi 02 · Nomenclature ISO 8601 des Fichiers',
          question: 'Quel format de nommage garantit un tri chronologique automatique de vos versions de mémoire dans Windows et Google Drive ?',
          options: [
            'Memoire_Final_V2_VRAIFinal.docx',
            '2026-04-15_Memoire_Licence_Chapitre2_v02.docx (préfixe AAAA-MM-JJ sans accent ni espace)',
            '15-04-26-Mon Document !!.docx'
          ],
          bonneReponse: 1,
          explication: 'Le préfixe ISO 8601 (AAAA-MM-JJ) place toujours vos fichiers du plus ancien au plus récent dans tout explorateur.'
        },
        'mn-03_ch-03': {
          titre: 'Défi 03 · Règle de Sauvegarde 3-2-1',
          question: 'Que signifie concrètement la stratégie internationale de sauvegarde 3-2-1 contre la perte de thèse ou de données ?',
          options: [
            '3 copies sur le même disque dur dans 2 dossiers différents et 1 mot de passe.',
            '3 copies totales sur 2 supports physiques différents, dont au moins 1 copie hors-site / cloud.',
            'Sauvegarder son PC uniquement 1 fois tous les 3 mois.'
          ],
          bonneReponse: 1,
          explication: 'Disposer de 3 exemplaires sur 2 médias (ex. SSD + disque externe) et 1 copie distante (cloud chiffré) survit au vol, à la panne et aux ransomwares.'
        },

        // --- MANUEL 04 : R & RSTUDIO POUR L'AGRONOMIE ---
        'mn-04_ch-04': {
          titre: 'Défi 04 · Conditions Paramétriques de l’ANOVA',
          question: 'Avant d’interpréter une ANOVA paramétrique sur des rendements agricoles, quelles deux hypothèses vérifie-t-on avec `shapiro.test()` et `bartlett.test()` ?',
          options: [
            'La normalité des résidus et l’homogénéité des variances entre groupes (homoscédasticité).',
            'L’absence de valeurs nulles et le tri alphabétique des traitements.',
            'La taille exacte de la mémoire RAM disponible sous RStudio.'
          ],
          bonneReponse: 0,
          explication: 'Si p > 0,05 aux tests de Shapiro-Wilk (normalité des résidus) et Bartlett/Levene (homogénéité des variances), l’ANOVA classique est statistiquement valide.'
        },
        'mn-04_ch-06': {
          titre: 'Défi 06 · Comparaisons Post-Hoc & Lettres de Tukey (HSD)',
          question: 'À quoi servent les lettres statistiques (`a`, `b`, `ab`) affichées au-dessus des barres d’un graphique agronomique après un test de Tukey ?',
          options: [
            'Elles indiquent l’ordre chronologique des semis sur le terrain.',
            'Deux traitements partageant au moins une même lettre ne diffèrent pas significativement au seuil α fixé (souvent 5 %).',
            'Elles correspondent aux initiales des engrais utilisés.'
          ],
          bonneReponse: 1,
          explication: 'Le test HSD de Tukey regroupe les moyennes qui ne présentent pas de différence statistiquement significative sous une lettre commune.'
        },

        // --- MANUEL 05 : KOBOTOOLBOX & COLLECTE MOBILE ---
        'mn-05_ch-01': {
          titre: 'Défi 01 · Spécification XLSForm pour relevé GNSS',
          consigne: 'Téléchargez la trame XLSForm ci-dessous destinée aux enquêteurs terrain.',
          question: 'Dans la feuille "survey" d’un questionnaire XLSForm, quel type de question enregistre la position GPS (latitude, longitude, altitude, précision) sans connexion Internet ?',
          options: [
            'geopoint',
            'location_web_api',
            'geotrace_text'
          ],
          bonneReponse: 0,
          explication: 'Le mot-clé standard `geopoint` pilote la puce GNSS du smartphone hors connexion pour capturer lat, lon, alt et précision en mètres.',
          ressources: [{ nom: 'modele_enquete_agricole_kobo.csv (Trame XLSForm)', url: 'datasets/modele_enquete_agricole_kobo.csv' }]
        },
        'mn-05_ch-02': {
          titre: 'Défi 02 · Sauts Logiques & Expression XLSForm',
          question: 'Dans la colonne `relevant` d’un XLSForm, comment afficher une question uniquement si le producteur a répondu `oui` à la variable `utilise_engrais` ?',
          options: [
            "IF(${utilise_engrais} == 'oui')",
            "${utilise_engrais} = 'oui'",
            "#utilise_engrais === oui"
          ],
          bonneReponse: 1,
          explication: 'XLSForm utilise la syntaxe XPath `${nom_variable} = \'valeur\'` (avec un seul signe `=`) dans la colonne `relevant`.'
        },
        'mn-05_ch-04': {
          titre: 'Défi 04 · Structure Officielle d’un Classeur XLSForm',
          question: 'Quelles sont les feuilles obligatoires d’un classeur Excel pour réussir l’importation sous `kf.kobotoolbox.org` ?',
          options: [
            'survey et choices (settings étant optionnelle mais recommandée)',
            'questions, reponses et dashboard',
            'data et metadata'
          ],
          bonneReponse: 0,
          explication: 'La spécification XLSForm requiert au minimum `survey` (structure des questions) et `choices` (listes fermées).'
        },
        'mn-05_ch-05': {
          titre: 'Défi 05 · Collecte Hors-Ligne sur KoboCollect',
          question: 'Pour configurer rapidement 15 smartphones d’enquêteurs sans faute de frappe d’URL serveur, quelle méthode privilégier ?',
          options: [
            'Scanner le QR Code de configuration généré dans Paramètres > Collect data de KoboToolbox.',
            'Désactiver la puce GPS pour économiser la RAM.',
            'Saisir les 15 formulaires directement dans un tableur partagé en ligne.'
          ],
          bonneReponse: 0,
          explication: 'Le QR Code KoboCollect configure instantanément l’URL `https://kf.kobotoolbox.org`, les identifiants et les règles de téléchargement.'
        },

        // --- MANUEL 06 : CARTOGRAPHIE AGRICOLE & SIG QGIS ---
        'mn-06_ch-01': {
          titre: 'Défi 01 · Géodésie & Projection UTM au Bénin',
          question: 'Quel système de coordonnées projetées (SCR métrique) s’applique à la majorité du Bénin pour mesurer des surfaces agricoles en m² et hectares ?',
          options: [
            'WGS 84 / UTM Zone 31N (EPSG:32631)',
            'WGS 84 géographique en degrés décimaux (EPSG:4326)',
            'Lambert-93 (EPSG:2154)'
          ],
          bonneReponse: 0,
          explication: 'Le Bénin se situe majoritairement entre 1° et 3°45’ E : EPSG:32631 donne des coordonnées métriques fiables.'
        },
        'mn-06_ch-03': {
          titre: 'Défi 03 · Calculatrice de Superficies QGIS',
          question: 'Quelle expression de calculatrice de champ QGIS renvoie la superficie en hectares sur une couche projetée en UTM (EPSG:32631) ?',
          options: [
            '$area * 100',
            '$area / 10000',
            '$perimeter / 4'
          ],
          bonneReponse: 1,
          explication: '1 hectare = 10 000 m². En UTM métrique, `$area / 10000` convertit directement l’aire en hectares.',
          ressources: [{ nom: 'parcelles_agricoles_borgou.geojson', url: 'datasets/parcelles_agricoles_borgou.geojson' }]
        },
        'mn-06_ch-05': {
          titre: 'Défi 05 · Télédétection Optique & Indice NDVI',
          question: 'Quelle formule mathématique définit l’Indice de Végétation par Différence Normalisée (NDVI) avec les bandes Rouge (R) et Proche Infrarouge (PIR) ?',
          options: [
            '(PIR - R) / (PIR + R)',
            '(R - PIR) / (R + PIR)',
            '(PIR + R) / 2'
          ],
          bonneReponse: 0,
          explication: 'Une végétation saine absorbe fortement le Rouge et réfléchit le PIR : un NDVI proche de +0,7/+0,8 signale une forte biomasse chlorophyllienne.'
        },

        // --- MANUEL 07 : DÉVELOPPEMENT WEB MODERNE ---
        'mn-07_ch-01': {
          titre: 'Défi 01 · Sémantique HTML5 & Accessibilité',
          question: 'Pourquoi privilégier les balises sémantiques `<header>`, `<nav>`, `<main>` et `<article>` plutôt qu’une suite de `<div>` génériques ?',
          options: [
            'Elles améliorent le référencement (SEO), la navigation au clavier et la lecture par les lecteurs d’écran.',
            'Les balises `<div>` ne sont plus supportées dans Google Chrome.',
            'Elles chiffrent automatiquement les requêtes HTTP.'
          ],
          bonneReponse: 0,
          explication: 'Le HTML5 sémantique donne du sens à la structure documentaire pour les moteurs de recherche et les technologies d’assistance.'
        },
        'mn-07_ch-02': {
          titre: 'Défi 02 · Mise en Page Moderne CSS Grid & Flexbox',
          question: 'Quelle propriété CSS permet de créer une grille de cartes responsive qui s’adapte sans media query complexe ?',
          options: [
            'display: block; float: left;',
            'display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));',
            'position: absolute; top: 50%;'
          ],
          bonneReponse: 1,
          explication: 'Le motif `repeat(auto-fit, minmax(min(100%, 260px), 1fr))` adapte fluidement le nombre de colonnes sur smartphone, tablette et PC.'
        },
        'mn-07_ch-04': {
          titre: 'Défi 04 · Interaction DOM & Sécurité XSS',
          question: 'Pour afficher une chaîne saisie par l’utilisateur dans un élément DOM sans risque d’injection de script (XSS), quelle propriété privilégier ?',
          options: [
            'element.innerHTML = saisie;',
            'element.textContent = saisie;',
            'eval(saisie);'
          ],
          bonneReponse: 1,
          explication: '`textContent` insère du texte brut sans jamais l’interpréter comme du HTML exécutable.'
        },

        // --- MANUEL 08 : VIBE CODING & IA RESPONSABLE ---
        'mn-08_ch-02': {
          titre: 'Défi 02 · Standard C.R.E.D. du Prompt d’Ingénierie',
          question: 'Que désigne l’acronyme méthodologique C.R.E.D. utilisé pour piloter un assistant de code IA avec précision ?',
          options: [
            'Code · Rapide · Erreur · Déploiement',
            'Contexte · Rôle · Exigences · Données (ou Livrable attendu)',
            'Copier · Recoller · Effacer · Dupliquer'
          ],
          bonneReponse: 1,
          explication: 'Le cadre C.R.E.D. (Contexte, Rôle, Exigences techniques, Données/Format) élimine les prompts vagues et réduit fortement les hallucinations.'
        },
        'mn-08_ch-04': {
          titre: 'Défi 04 · Audit de Code Généré par IA',
          question: 'Après avoir généré un script fonctionnel via un LLM, quel réflexe d’ingénieur prévient les régressions et failles de sécurité en production ?',
          options: [
            'Déployer immédiatement sans relire dès que la première page s’affiche.',
            'Relire le diff, vérifier les dépendances réelles, exécuter les tests automatisés et tester les cas limites hors-ligne.',
            'Demander au modèle de supprimer tous les messages d’erreur.'
          ],
          bonneReponse: 1,
          explication: 'En Vibe Coding responsable, l’humain reste architecte et vérificateur : revue de code, sécurité (XSS/secrets) et tests font foi.'
        },

        // --- MANUEL 09 : CRÉATION GRAPHIQUE & VIDÉO MOBILE ---
        'mn-09_ch-01': {
          titre: 'Défi 01 · Formats Sociaux & Safe Zones',
          question: 'Pourquoi faut-il éviter de placer vos textes importants tout en bas ou à droite d’un Reel / TikTok vertical 9:16 ?',
          options: [
            'Ces zones sont masquées par les légendes, icônes J’aime/Partager et boutons de l’interface mobile.',
            'Les couleurs sombres deviennent transparentes sur smartphone.',
            'La résolution 1080×1920 rogne obligatoirement la moitié gauche.'
          ],
          bonneReponse: 0,
          explication: 'Respecter les Safe Zones garantit que vos titres et sous-titres restent 100 % lisibles malgré l’interface des réseaux sociaux.'
        },
        'mn-09_ch-04': {
          titre: 'Défi 04 · Prise de Son en Milieu Agricole Venteux',
          question: 'Sur une parcelle exposée au vent lors d’une interview d’agriculteur, quel facteur prime sur la qualité 4K de la caméra ?',
          options: [
            'L’intelligibilité de la voix (micro-cravate ou téléphone à 30 cm avec bonnette anti-vent).',
            'L’ajout d’un filtre néon saturé à la prise de vue.',
            'Filmer systématiquement à contre-jour en grand angle.'
          ],
          bonneReponse: 0,
          explication: 'Un spectateur pardonne une image moyenne, jamais un son saturé ou inaudible dans le vent.'
        },

        // --- MANUEL 10 : L'AGRONOME-NUMÉRICIEN INDÉPENDANT ---
        'mn-10_ch-02': {
          titre: 'Défi 02 · Sécurisation Financière d’un Devis Consultant',
          question: 'Quelle modalité de paiement protège efficacement un consultant indépendant avant de démarrer une mission d’enquête ou SIG pour une organisation ?',
          options: [
            'Encaisser 100 % six mois après la remise finale sans bon de commande.',
            'Prévoir un acompte au démarrage (ex. 40 % à la signature), un jalon intermédiaire et le solde à la livraison des livrables.',
            'Travailler exclusivement sur accord verbal sans devis écrit.'
          ],
          bonneReponse: 1,
          explication: 'L’échelonnement avec acompte contractuel sécurise votre trésorerie terrain (déplacement, forfaits data, temps d’analyse).'
        },
        'mn-10_ch-03': {
          titre: 'Défi 03 · Réponse aux Termes de Référence (TDR)',
          question: 'Dans une proposition technique répondant à un appel d’offres ONG, qu’est-ce qui convainc le comité d’évaluation au-delà des diplômes ?',
          options: [
            'Une méthodologie opérationnelle chiffrée, un chronogramme réaliste et des livrables concrets vérifiables.',
            'Une lettre de motivation de 5 pages répétant le texte des TDR mot pour mot.',
            'Un tarif divisé par 10 par rapport aux coûts de terrain.'
          ],
          bonneReponse: 0,
          explication: 'Les jurys évaluent la compréhension des enjeux terrain, la clarté méthodologique et la maîtrise des délais.'
        },

        // --- MANUEL 11 : PILOTAGE DE DRONES & DRONES AGRICOLES ---
        'mn-11_ch-03': {
          titre: 'Défi 03 · Sécurité Aérienne & Réglementation ANAC',
          question: 'Avant de décoller avec un drone cartographique ou agricole dans l’espace béninois ou ouest-africain, quelle vérifications réglementaires s’imposent ?',
          options: [
            'Vérifier les zones restreintes/aérodromes, autorisations ANAC, météo (vent/pluie) et périmètre de sécurité public.',
            'Voler à 500 mètres d’altitude pour éviter les arbres et les câbles.',
            'Éteindre le retour télémétrique pour économiser la batterie.'
          ],
          bonneReponse: 0,
          explication: 'Le vol sécurisé repose sur le respect du plafond légal, des zones réglementées ANAC et d’un check-list pré-vol rigoureux.'
        },
        'mn-11_ch-04': {
          titre: 'Défi 04 · Photogrammétrie & Résolution au Sol (GSD)',
          question: 'Pour obtenir une orthomosaïque exploitable sans trous de recalage sous QGIS ou WebODM, quel recouvrement minimal vise-t-on généralement en plan de vol ?',
          options: [
            '20 % de recouvrement longitudinal et latéral.',
            '75 % à 80 % frontal et 65 % à 75 % latéral (grille ou double grille).',
            'Un seul cliché vertical par hectare.'
          ],
          bonneReponse: 1,
          explication: 'La photogrammétrie SIFT nécessite des points homologues vus sous plusieurs angles : un fort recouvrement évite les trous de reconstruction.'
        },

        // --- MANUEL 12 : CRÉATION VIDÉO & VISUELLE PAR IA ---
        'mn-12_ch-01': {
          titre: 'Défi 01 · Storytelling & Accroche Terrain',
          question: 'Quelle structure maximise la rétention d’une capsule éducative courte (30–90 s) sur les réseaux ?',
          options: [
            'Accroche terrain (Hook 0–3 s) → Constat du problème → Solution démontrée → Appel à l’action (CTA)',
            'Générique musical de 25 s suivi d’un texte défilant statique',
            'Enchaînement de logos institutionnels sans démonstration'
          ],
          bonneReponse: 0,
          explication: 'Les 3 premières secondes conditionnent la rétention : montrer immédiatement l’enjeu concret retient l’apprenant.'
        },
        'mn-12_ch-03': {
          titre: 'Défi 03 · Mixage Audio Professionnel (-14 LUFS)',
          question: 'Quel niveau sonore cible-t-on pour le master final d’une vidéo pédagogique destinée au web et à YouTube ?',
          options: [
            'Autour de -14 LUFS intégrés (avec pics sous -1 dBTP) afin d’éviter la distorsion et la compression brutale.',
            '+6 dB continu dans la zone rouge du vumètre.',
            '-45 LUFS pour forcer l’auditeur à brancher un amplificateur.'
          ],
          bonneReponse: 0,
          explication: 'Les plateformes (YouTube, réseaux sociaux) normalisent autour de -14 LUFS ; viser ce palier assure confort et dynamique propre.'
        },
        // ══ 5 MINI-GUIDES D'URGENCE ══
        'guide-01_unique': {
          titre: 'Défi · Styles, Sommaire Auto & Pagination Mixte',
          question: 'Dans Word, comment obtenir des chiffres romains (i, ii) en préliminaires et des chiffres arabes (1, 2) à partir de l’Introduction ?',
          options: [
            'Taper manuellement les numéros dans le bas de chaque page une par une.',
            'Insérer un Saut de section (Page suivante), désactiver « Lier au précédent » dans le pied de page, puis changer le format des numéros.',
            'Créer deux fichiers .docx séparés puis les imprimer séparément sans jamais générer de sommaire.'
          ],
          bonneReponse: 1,
          explication: 'Le saut de section combiné au déliement « Lier au précédent » isole la numérotation romaine de la numérotation arabe.'
        },
        'guide-02_unique': {
          titre: 'Défi · Levé GPS Smartphone & Surface en Hectares',
          question: 'Dans QGIS (zone Bénin / Afrique de l’Ouest en UTM 31N — EPSG:32631), quelle expression calcule la superficie en hectares ?',
          options: [
            '$area * 10000',
            '$length / 100',
            '$area / 10000'
          ],
          bonneReponse: 2,
          explication: 'En projection métrique UTM (EPSG:32631), $area renvoie des m² ; diviser par 10 000 convertit exactement en hectares (ha).'
        },
        'guide-03_unique': {
          titre: 'Défi · Méthode C.R.E.D. & Zéro Citation Inventée',
          question: 'Avant de citer une référence bibliographique générée par une IA dans un mémoire académique, quelle règle est impérative ?',
          options: [
            'Vérifier l’existence réelle de l’auteur, du DOI et du résumé dans Google Scholar / Crossref (Règle D de C.R.E.D.).',
            'Modifier seulement l’année de publication pour la rendre plus récente.',
            'Supposer qu’un titre plausible est toujours authentique si le prompt était précis.'
          ],
          bonneReponse: 0,
          explication: 'Les LLM peuvent halluciner des DOI ou auteurs réalistes ; la vérification externe garantit l’intégrité scientifique.'
        },
        'guide-04_unique': {
          titre: 'Défi · Déploiement KoboCollect Hors-Ligne',
          question: 'Quelle URL de serveur faut-il saisir dans l’application Android KoboCollect pour un compte KoboToolbox standard ?',
          options: [
            'https://kc.kobotoolbox.org (ancien domaine obsolète)',
            'https://kf.kobotoolbox.org',
            'http://localhost:8080/kobo'
          ],
          bonneReponse: 1,
          explication: 'Les projets KoboToolbox utilisent désormais le serveur unifié https://kf.kobotoolbox.org.'
        },
        'guide-05_unique': {
          titre: 'Défi · Poster Scientifique & Règle 60-30-10',
          question: 'Dans la règle chromatique 60-30-10 appliquée à un poster de soutenance ou une affiche professionnelle, à quoi servent les 10 % ?',
          options: [
            'À la couleur d’accentuation réservée aux chiffres clés, boutons d’action et appels visuels.',
            'À remplir l’intégralité de l’arrière-plan avec un dégradé saturé.',
            'À colorer chaque paragraphe de texte d’une teinte différente.'
          ],
          bonneReponse: 0,
          explication: '60 % de fond respirant, 30 % de couleur structurelle et 10 % d’accent créent un guidage visuel immédiat.'
        },
        // ══ COMPLÉMENT MANUELS MN-01 À MN-12 ══
        'mn-01_ch-03': {
          titre: 'Défi 03 · Dispersion & Coefficient de Variation (CV%)',
          question: 'En expérimentation agronomique, comment écrit-on et calcule-t-on rigoureusement la variabilité relative d’un rendement en % ?',
          options: [
            'Moyenne / Médiane × 100',
            '(ECARTYPE.STANDARD(plage) / MOYENNE(plage)) × 100, présenté sous forme Moyenne ± Écart-Type.',
            'MAX(plage) - MIN(plage) divisé par le nombre de parcelles.'
          ],
          bonneReponse: 1,
          explication: 'Le CV% rapporte l’écart-type à la moyenne pour juger l’homogénéité d’un essai quelle que soit l’unité.'
        },
        'mn-01_ch-04': {
          titre: 'Défi 04 · Agrégations Conditionnelles (.SI vs .ENS)',
          question: 'Quelle différence de syntaxe piège souvent les utilisateurs entre SOMME.SI et SOMME.SI.ENS dans Excel ?',
          options: [
            'SOMME.SI.ENS interdit plus de deux critères de filtrage.',
            'SOMME.SI ne fonctionne pas sur les nombres décimaux.',
            'Dans SOMME.SI.ENS, la plage à additionner (plage_somme) passe en PREMIER argument, à l’inverse de SOMME.SI.'
          ],
          bonneReponse: 2,
          explication: 'Placer plage_somme en premier permet ensuite d’ajouter autant de paires (plage_critère, critère) que nécessaire.'
        },
        'mn-01_ch-05': {
          titre: 'Défi 05 · Logique Décisionnelle =SI() & ET()/OU()',
          question: 'Comment tester simultanément deux conditions obligatoires (ex. Humidité <= 13% ET Pureté >= 98%) dans un seul =SI() ?',
          options: [
            '=SI(ET(B2<=0.13; C2>=0.98); "Conforme"; "Rejet")',
            '=SI(B2<=0.13 + C2>=0.98; "Conforme"; "Rejet")',
            '=ET.SI(B2<=0.13; C2>=0.98; "Conforme")'
          ],
          bonneReponse: 0,
          explication: 'La fonction ET(...) retourne VRAI uniquement si tous ses tests logiques sont satisfaits simultanément.'
        },
        'mn-01_ch-07': {
          titre: 'Défi 07 · Visualisation Scientifique & Barres d’Erreur',
          question: 'Que doit-on ajouter sur un histogramme comparant des traitements agronomiques pour montrer la fiabilité des moyennes ?',
          options: [
            'Un effet 3D avec ombres portées et textures marbrées.',
            'Des barres d’erreur personnalisées basées sur la colonne des écarts-types (ou erreurs standard) calculés.',
            'Une courbe logarithmique sur chaque barre.'
          ],
          bonneReponse: 1,
          explication: 'Sans barres d’erreur d’écart-type (ou SE), un lecteur scientifique ne peut évaluer le chevauchement entre traitements.'
        },
        'mn-01_ch-08': {
          titre: 'Défi 08 · Tableaux Croisés Dynamiques (TCD)',
          question: 'Avant de créer un Tableau Croisé Dynamique fiable, quelle règle structurelle doit respecter le tableau source ?',
          options: [
            'Fusionner les cellules d’en-tête sur deux lignes et insérer des sous-totaux intermédiaires.',
            'Disposer d’en-têtes uniques non vides, zéro cellule fusionnée et aucune ligne vide ni sous-total intégré.',
            'Laisser les dates saisies en texte libre sans format homogène.'
          ],
          bonneReponse: 1,
          explication: 'Un jeu de données normalisé (1 ligne = 1 observation, 1 colonne = 1 variable) garantit un TCD sans erreur de regroupement.'
        },
        'mn-02_ch-03': {
          titre: 'Défi 03 · Légendes Normées & Renvois Croisés',
          question: 'Selon les normes académiques classiques (CAMES / UAC), où place-t-on le titre d’un Tableau par rapport à celui d’une Figure ?',
          options: [
            'Tableau : légende AU-DESSUS ; Figure / Graphique : légende EN-DESSOUS (avec source en note).',
            'Toujours en-dessous pour les tableaux et au-dessus pour les figures.',
            'Sur une page annexe à la fin du document uniquement.'
          ],
          bonneReponse: 0,
          explication: 'La convention académique place l’intitulé des tableaux au-dessus et celui des figures en-dessous, lié par renvoi croisé dynamique.'
        },
        'mn-02_ch-04': {
          titre: 'Défi 04 · Bibliographie Dynamique Zotero (APA 7e)',
          question: 'Pourquoi faut-il utiliser le plugin Zotero dans Word plutôt que de saisir ses références à la main ?',
          options: [
            'Pour colorer automatiquement tous les noms d’auteurs en bleu.',
            'Pour synchroniser les appels de citation dans le texte avec la bibliographie finale et changer de norme en 1 clic.',
            'Parce que Word refuse d’enregistrer un mémoire sans Zotero.'
          ],
          bonneReponse: 1,
          explication: 'Zotero supprime les oublis ou citations orphelines lors des révisions du jury et formate instantanément selon APA 7e ou ISO.'
        },
        'mn-02_ch-06': {
          titre: 'Défi 06 · Visuels de Soutenance & Vidéoprojecteur',
          question: 'Sur un vidéoprojecteur en salle éclairée, quelle combinaison garantit une lisibilité maximale de vos diapositives ?',
          options: [
            'Texte jaune clair sur fond blanc avec tableau Excel complet en taille 9 pt.',
            'Fond sobre très contrasté, 1 idée par diapo, police >= 24 pt et schémas épurés en 3 blocs.',
            'Paragraphes complets de 15 lignes lus mot pour mot face à l’écran.'
          ],
          bonneReponse: 1,
          explication: 'Un fort contraste et des blocs synthétiques (>= 24 pt) restent lisibles du fond de l’amphithéâtre sans distraire du discours.'
        },
        'mn-02_ch-07': {
          titre: 'Défi 07 · Chronogramme 20 min & Questions du Jury',
          question: 'Quelle attitude est recommandée face à une remarque critique fondée d’un membre du jury lors de la soutenance ?',
          options: [
            'Prendre note calmement, reconnaître la pertinence de la piste et expliquer précisément les limites ou perspectives.',
            'Couper la parole au rapporteur pour défendre coûte que coûte une erreur méthodologique.',
            'Répondre que les données ont été perdues sur le terrain.'
          ],
          bonneReponse: 0,
          explication: 'La posture scientifique consiste à écouter, noter et situer objectivement la portée et les limites de l’étude.'
        },
        'mn-02_ch-08': {
          titre: 'Défi 08 · Capstone Documentaire Word + PowerPoint',
          question: 'Quel élément doit être strictement identique entre le manuscrit Word déposé et le support PowerPoint de soutenance ?',
          options: [
            'La couleur exacte de chaque bordure de page.',
            'Les chiffres clés, unités, tailles d’échantillon (n) et conclusions principales.',
            'L’intégralité des annexes brutes copiées sur les diapositives.'
          ],
          bonneReponse: 1,
          explication: 'Toute divergence de chiffre entre le mémoire écrit et l’oral entame immédiatement la crédibilité devant le jury.'
        },
        'mn-03_ch-01': {
          titre: 'Défi 01 · Productivité Windows (Win+V & Ancrage)',
          question: 'Quel raccourci Windows ouvre l’historique du presse-papiers afin de retrouver plusieurs éléments copiés successivement ?',
          options: [
            'Ctrl + Alt + Suppr',
            'Alt + F4',
            'Win + V (après activation initiale)'
          ],
          bonneReponse: 2,
          explication: 'Win+V affiche les derniers textes et captures copiés et permet même d’épingler des extraits récurrents.'
        },
        'mn-03_ch-04': {
          titre: 'Défi 04 · Maintenance Windows & Commande SFC',
          question: 'À quoi sert la commande « sfc /scannow » exécutée en tant qu’administrateur dans l’invite de commandes ?',
          options: [
            'À analyser l’intégrité des fichiers système Windows protégés et réparer ceux qui sont corrompus.',
            'À formater intégralement le disque dur secondaire.',
            'À télécharger une version piratée de Microsoft Office.'
          ],
          bonneReponse: 0,
          explication: 'System File Checker (sfc /scannow) vérifie les fichiers protégés de Windows et restaure les copies saines depuis le cache système.'
        },
        'mn-03_ch-05': {
          titre: 'Défi 05 · Recherche Booléenne & Hygiène Numérique',
          question: 'Dans Google ou Google Scholar, quelle requête cible exclusivement des rapports PDF officiels sur le maïs au Bénin ?',
          options: [
            'mais benin pdf gratuit telecharger',
            '"Zea mays" Bénin filetype:pdf',
            'mais + benin -filetype:all'
          ],
          bonneReponse: 1,
          explication: 'Les guillemets imposent l’expression exacte et l’opérateur filetype:pdf filtre strictement les documents PDF.'
        },
        'mn-03_ch-06': {
          titre: 'Défi 06 · Capstone Script maintenance_sahelia.bat',
          question: 'Pourquoi faut-il vérifier les variables %TEMP% avant d’exécuter un script batch de nettoyage automatisé ?',
          options: [
            'Pour éviter de cibler un répertoire utilisateur ou projet par erreur et ne purger que les fichiers temporaires sûrs.',
            'Parce que Windows interdit les fichiers .bat de plus de 5 lignes.',
            'Pour désactiver automatiquement le pare-feu Windows Defender.'
          ],
          bonneReponse: 0,
          explication: 'Valider le chemin cible (%TEMP%) et la gestion d’erreur garantit une maintenance sûre sans perte de documents.'
        },
        'mn-04_ch-01': {
          titre: 'Défi 01 · Quadrants RStudio & Projets .Rproj',
          question: 'Pourquoi travaille-t-on toujours dans un Projet RStudio (.Rproj) avec chemins relatifs plutôt qu’avec setwd("C:/Users/...") ?',
          options: [
            'Parce que les projets .Rproj doublent la vitesse du processeur.',
            'Pour rendre le script immédiatement exécutable sur n’importe quel ordinateur sans casser les chemins d’accès aux données.',
            'Parce que RStudio refuse d’importer un fichier CSV sans connexion Internet.'
          ],
          bonneReponse: 1,
          explication: 'Le dossier du .Rproj devient automatiquement la racine ; les chemins relatifs ("data/essai.csv") assurent la reproductibilité.'
        },
        'mn-04_ch-02': {
          titre: 'Défi 02 · Les 5 Verbes dplyr',
          question: 'Quel enchaînement dplyr calcule le rendement moyen par variété uniquement pour les parcelles sans dégât majeur ?',
          options: [
            'df |> select(variete) |> plot()',
            'df |> mutate(variete = mean(rendement))',
            'df |> filter(degat == "Non") |> group_by(variete) |> summarise(rdt_moy = mean(rendement, na.rm = TRUE))'
          ],
          bonneReponse: 2,
          explication: 'filter() sélectionne les lignes, group_by() regroupe par facteur et summarise() agrège avec na.rm = TRUE.'
        },
        'mn-04_ch-03': {
          titre: 'Défi 03 · Couches ggplot2 & Export Publication',
          question: 'Quelle fonction sauvegarde proprement un graphique ggplot2 en haute résolution (300 DPI) prêt pour un article scientifique ?',
          options: [
            'ggsave("fig_rendement.png", width = 8, height = 5, dpi = 300)',
            'screenshot.window(dpi = 72)',
            'write.csv(ggplot_obj, "figure.png")'
          ],
          bonneReponse: 0,
          explication: 'ggsave() contrôle précisément les dimensions physiques et la résolution (300 DPI) exigées par les revues.'
        },
        'mn-04_ch-05': {
          titre: 'Défi 05 · ANOVA 1 Facteur aov() & Pr(>F)',
          question: 'Dans le résumé summary(aov(rendement ~ traitement, data = essai)), que signifie Pr(>F) = 0.0021 au seuil alpha = 0.05 ?',
          options: [
            'Toutes les variétés ont strictement le même rendement.',
            'On rejette H0 : il existe au moins un traitement dont la moyenne diffère significativement des autres.',
            'L’expérience contient 0,21 % de données manquantes.'
          ],
          bonneReponse: 1,
          explication: 'Puisque p = 0.0021 < 0.05, l’effet du facteur traitement est statistiquement significatif et justifie un test post-hoc.'
        },
        'mn-04_ch-07': {
          titre: 'Défi 07 · ANOVA Bifactorielle & Interaction',
          question: 'Quelle formule R teste à la fois l’effet de la Variété, de la Dose d’engrais ET leur interaction ?',
          options: [
            'aov(rendement ~ variete + dose, data = essai)',
            'aov(rendement ~ variete * dose, data = essai)',
            'aov(rendement ~ variete / dose, data = essai)'
          ],
          bonneReponse: 1,
          explication: 'En syntaxe R, l’opérateur * développe automatiquement les effets principaux plus le terme d’interaction variete:dose.'
        },
        'mn-04_ch-08': {
          titre: 'Défi 08 · Capstone Script R Reproductible',
          question: 'Dans quel ordre logique structure-t-on un script d’analyse agronomique reproductible de bout en bout ?',
          options: [
            'Tests post-hoc -> Import des données -> Suppression des graphiques.',
            'Chargement packages & import propre -> Exploration/nettoyage -> Vérification hypothèses -> Modèle & post-hoc -> Graphique exporté.',
            'Coloration manuelle dans Excel -> Copie des p-values sans enregistrer le code.'
          ],
          bonneReponse: 1,
          explication: 'Respecter l’ordre Import -> Nettoyage -> Hypothèses -> Modèle -> Visualisation garantit la traçabilité de chaque résultat.'
        },
        'mn-05_ch-03': {
          titre: 'Défi 03 · Contraintes XLSForm (. >= 18 and . <= 95)',
          question: 'Dans une feuille XLSForm, que fait l’expression « . >= 18 and . <= 95 » placée dans la colonne constraint ?',
          options: [
            'Elle bloque la validation du champ si l’âge saisi est inférieur à 18 ou supérieur à 95, en affichant le constraint_message.',
            'Elle calcule la moyenne entre 18 et 95 après soumission.',
            'Elle masque automatiquement la question pour tous les enquêteurs.'
          ],
          bonneReponse: 0,
          explication: 'Le point « . » désigne la réponse courante ; borner les valeurs numériques empêche les fautes de frappe sur le terrain.'
        },
        'mn-05_ch-06': {
          titre: 'Défi 06 · Contrôle Qualité & Export vers R/QGIS',
          question: 'Avant d’analyser les données exportées depuis KoboToolbox dans R ou QGIS, quel format d’en-tête choisir pour éviter les noms de colonnes illisibles ?',
          options: [
            'Exporter les noms XML techniques (valeurs/codes) plutôt que les longues questions avec accents et espaces.',
            'Fusionner toutes les colonnes de coordonnées GPS en une seule cellule texte.',
            'Supprimer la colonne _uuid générée par le serveur.'
          ],
          bonneReponse: 0,
          explication: 'Les noms XML (ex. age_chef, superf_ha) assurent des scripts R et jointures QGIS stables sans caractères spéciaux.'
        },
        'mn-06_ch-02': {
          titre: 'Défi 02 · Import CSV GPS & Géoréférencement',
          question: 'Lors de l’import d’un fichier CSV de points GPS (Longitude, Latitude) dans QGIS, quel SCR choisir avant toute reprojection ?',
          options: [
            'EPSG:32631 (UTM mètres), même si le fichier contient des degrés décimaux.',
            'EPSG:4326 (WGS 84 géographique en degrés décimaux) pour placer correctement les coordonnées brutes.',
            'Aucun SCR : laisser le projet sans système de référence.'
          ],
          bonneReponse: 1,
          explication: 'Les coordonnées GPS en degrés appartiennent à WGS 84 (EPSG:4326) ; on les reprojette ensuite en UTM 31N pour mesurer en mètres.'
        },
        'mn-06_ch-04': {
          titre: 'Défi 04 · Jointure Attributaire & Sémiologie Choroplèthe',
          question: 'Pourquoi faut-il normaliser une variable quantitative absolue (ex. production en tonnes par surface en ha) sur une carte choroplèthe ?',
          options: [
            'Pour éviter de biaiser la lecture visuelle en fonction de la taille géographique des communes.',
            'Parce que QGIS interdit de colorer des polygones avec des nombres entiers.',
            'Pour remplacer les polygones par des symboles ponctuels aléatoires.'
          ],
          bonneReponse: 0,
          explication: 'Les cartes choroplèthes en aplats colorés doivent représenter des ratios/densités (t/ha, %), jamais des effectifs bruts.'
        },
        'mn-06_ch-06': {
          titre: 'Défi 06 · Mise en Page CAMES & Export 300 DPI',
          question: 'Quels éléments obligatoires assurent qu’une carte produite sous QGIS est scientifiquement exploitable ?',
          options: [
            'Uniquement un titre centré sans grille ni légende.',
            'Titre, flèche Nord, barre d’échelle graphique, légende explicite, grille de coordonnées, SCR et sources/auteur.',
            'Une photo satellite brute sans échelle ni orientation.'
          ],
          bonneReponse: 1,
          explication: 'Sans échelle, orientation Nord, légende et référence SCR/source, une carte ne peut être interprétée ni vérifiée.'
        },
        'mn-11_ch-01': {
          titre: 'Défi 01 · Architecture Drone & Sécurité LiPo Tropicale',
          question: 'En climat tropical chaud, quelle précaution prolonge la durée de vie et la sécurité des batteries LiPo de drone ?',
          options: [
            'Les stocker chargées à 100 % au soleil dans le coffre du véhicule.',
            'Les conserver à température tempérée au niveau de stockage (~3,8 V/cellule, ~50-60 %) hors vol prolongé.',
            'Les refroidir brutalement au congélateur juste avant le décollage.'
          ],
          bonneReponse: 1,
          explication: 'La tension de stockage (~3,8 V/cellule) à l’abri de la chaleur prévient le gonflement chimique des cellules LiPo.'
        },
        'mn-11_ch-02': {
          titre: 'Défi 02 · Commandes Mode 2 & Retour Maison (RTH)',
          question: 'Sur une radiocommande en Mode 2, quand le drone revient face au pilote (« nose-in »), que doit anticiper ce dernier ?',
          options: [
            'L’inversion intuitive des axes gauche/droite (roulis) et avant/arrière par rapport à son propre point de vue.',
            'Que les gaz passent automatiquement sur le manche de droite.',
            'Que le RTH coupe immédiatement les moteurs en plein vol.'
          ],
          bonneReponse: 0,
          explication: 'En vol face pilote, pousser le roulis à droite déplace le drone vers la gauche du pilote ; s’entraîner à ce repère évite les collisions.'
        },
        'mn-11_ch-05': {
          titre: 'Défi 05 · Downwash & Calibration Débit/Hectare',
          question: 'Quel paramètre physique explique que le brouillard d’un drone épandeur pénètre mieux le cœur du feuillage qu’un passage trop haut ?',
          options: [
            'L’effet « Downwash » (flux d’air descendant généré par les rotors), calibré avec la hauteur et la vitesse d’avancement.',
            'La perte totale de gravité sous les hélices.',
            'L’utilisation d’eau bouillante dans le réservoir.'
          ],
          bonneReponse: 0,
          explication: 'Le flux descendant des rotors brasse la canopée et plaque les micro-gouttelettes si hauteur, débit et vitesse sont bien calibrés.'
        },
        'mn-11_ch-06': {
          titre: 'Défi 06 · Boucle Fermée NDVI -> Prescription -> Épandage',
          question: 'Dans le cycle d’agriculture de précision par drone, quel rôle joue la carte de prescription issue de l’orthomosaïque NDVI ?',
          options: [
            'Piloter la modulation de dose afin d’appliquer l’intrant uniquement sur les zones qui en ont besoin.',
            'Remplacer totalement le calibrage des buses du pulvérisateur.',
            'Servir uniquement de fond d’écran publicitaire sans coordonnées GPS.'
          ],
          bonneReponse: 0,
          explication: 'La modulation ciblée réduit les coûts d’intrants et l’impact environnemental en traitant strictement les zones déficientes ou infestées.'
        },
        'mn-07_ch-03': {
          titre: 'Défi 03 · JavaScript Moderne ES6+ (const/let)',
          question: 'Pourquoi préfère-t-on « const » par défaut en JavaScript moderne plutôt que « var » ?',
          options: [
            '« const » a une portée de bloc prévisible et empêche les réassignations accidentelles de référence.',
            '« var » n’est plus reconnu par les navigateurs depuis 2020.',
            '« const » transforme automatiquement le JavaScript en Python.'
          ],
          bonneReponse: 0,
          explication: 'Utiliser const (et let seulement en cas de réassignation) évite les fuites de portée liées au hoisting de var.'
        },
        'mn-07_ch-05': {
          titre: 'Défi 05 · Persistance Locale & Mode Hors-Ligne',
          question: 'Quelle combinaison permet de sauvegarder un objet JavaScript structuré dans localStorage malgré le fait que ce stockage n’accepte que du texte ?',
          options: [
            'JSON.stringify() à l’écriture et JSON.parse() dans un bloc try/catch à la lecture.',
            'Math.round() à l’écriture et parseInt() à la lecture.',
            'Stocker directement l’objet DOM sans sérialisation.'
          ],
          bonneReponse: 0,
          explication: 'localStorage ne stocke que des chaînes ; JSON.stringify/parse gère la sérialisation de manière sûre avec try/catch.'
        },
        'mn-07_ch-06': {
          titre: 'Défi 06 · Pipeline Git & GitHub Pages (0 FCFA)',
          question: 'Quel enchaînement de commandes publie proprement une mise à jour locale vers la branche principale distante ?',
          options: [
            'git status -> git add . -> git commit -m "message clair" -> git push',
            'git delete -> git init -> git clone --force',
            'Copier le dossier .git sur une clé USB puis renommer index.html.'
          ],
          bonneReponse: 0,
          explication: 'Inspecter git status avant add/commit/push garantit un historique propre et un déploiement continu sans fichier indésirable.'
        },
        'mn-08_ch-01': {
          titre: 'Défi 01 · Fonctionnement LLM & Vibe Coding Responsable',
          question: 'Sur quel mécanisme fondamental repose un Grand Modèle de Langage (LLM) lorsqu’il rédige du texte ou du code ?',
          options: [
            'Une prédiction probabiliste du prochain token (fragment) à partir du contexte fourni, sans compréhension humaine autonome.',
            'Une vérification systématique en temps réel sur un laboratoire physique certifié.',
            'Une exécution automatique et garantie sans bug de tout code proposé.'
          ],
          bonneReponse: 0,
          explication: 'Un LLM prédit des séquences plausibles ; c’est pourquoi l’humain reste responsable des tests, de la sécurité et des faits.'
        },
        'mn-08_ch-03': {
          titre: 'Défi 03 · Architecture Modulaire en 4 Briques',
          question: 'Comment éviter qu’un assistant IA ne casse les fonctionnalités existantes lorsque l’application grandit (« amnésie de contexte ») ?',
          options: [
            'Découper l’application en modules indépendants (données, logique, interface, tests) avec un contrat clair par fichier.',
            'Mettre 8 000 lignes de HTML, CSS et JS mélangées dans un unique bloc sans commentaires.',
            'Changer de langage de programmation à chaque prompt.'
          ],
          bonneReponse: 0,
          explication: 'La modularité limite la taille de contexte nécessaire par tâche et permet de tester chaque brique isolément.'
        },
        'mn-08_ch-05': {
          titre: 'Défi 05 · Environnement Cursor & Modèles Locaux Ollama',
          question: 'Quel avantage majeur offre un modèle local via Ollama sur un poste professionnel par rapport aux API cloud ?',
          options: [
            'Les données confidentielles et code source restent 100 % sur la machine locale sans frais par requête.',
            'Il génère du matériel physique directement par le port USB.',
            'Il ne nécessite ni RAM ni espace disque.'
          ],
          bonneReponse: 0,
          explication: 'L’exécution locale garantit la confidentialité des données agricoles ou clients sensibles même hors connexion Internet.'
        },
        'mn-08_ch-06': {
          titre: 'Défi 06 · Capstone Sahélia-AgriPilot',
          question: 'Quelle étape valide véritablement la livraison d’une mini-application web conçue en Vibe Coding ?',
          options: [
            'Le simple fait que l’IA réponde « Tout fonctionne parfaitement ! ».',
            'Les tests manuels et automatisés sur données réelles, console sans erreur et relecture de sécurité (zéro clé exposée).',
            'L’absence totale de gestion d’erreurs.'
          ],
          bonneReponse: 1,
          explication: 'Seule l’exécution vérifiée (tests, console propre, validation des entrées) prouve qu’une application est prête pour les utilisateurs.'
        },
        'mn-09_ch-02': {
          titre: 'Défi 02 · Hiérarchie Typographique en 3 Niveaux',
          question: 'Comment structurer une affiche événementielle agricole pour qu’elle soit comprise en moins de 3 secondes ?',
          options: [
            'Multiplier 6 polices décoratives centrées sans marge extérieure.',
            'Respecter 3 niveaux clairs (Accroche forte > Sous-titre/Date > Détails/CTA) avec marges généreuses et règle 60-30-10.',
            'Écrire toutes les informations en taille uniforme 11 pt.'
          ],
          bonneReponse: 1,
          explication: 'Un contraste net de taille et de graisse sur 3 niveaux guide l’œil immédiatement vers le message principal puis l’action.'
        },
        'mn-09_ch-03': {
          titre: 'Défi 03 · Infographie Agronomique Vulgarisée',
          question: 'Quel principe rend une fiche technique visuelle immédiatement utile pour un groupement de producteurs ?',
          options: [
            'Traduire les étapes complexes en pictogrammes séquentiels numérotés, unités concrètes et contrastes lisibles sur mobile.',
            'Copier des équations différentielles non expliquées sur fond chargé.',
            'Omettre les dosages et unités de mesure.'
          ],
          bonneReponse: 0,
          explication: 'Des visuels séquentiels clairs avec dosages pratiques (ex. bouchons/pulvérisateur ou kg/ha) lèvent les barrières techniques.'
        },
        'mn-09_ch-05': {
          titre: 'Défi 05 · Montage Dynamique (Jump Cuts, B-Roll & Sous-titres)',
          question: 'Pourquoi les sous-titres synchronisés (Auto-Captions) sont-ils essentiels sur les vidéos courtes mobiles ?',
          options: [
            'Parce que de nombreux utilisateurs regardent d’abord les vidéos sans le son ou dans des environnements bruyants.',
            'Pour cacher le sujet principal au centre de l’image.',
            'Pour rendre le fichier vidéo dix fois plus lourd sur WhatsApp.'
          ],
          bonneReponse: 0,
          explication: 'Couplés aux jump cuts et plans d’illustration (B-Roll), les sous-titres maintiennent la rétention dès les premières secondes.'
        },
        'mn-09_ch-06': {
          titre: 'Défi 06 · Capstone Kit Média (4 Livrables)',
          question: 'Pourquoi faut-il décliner une campagne aux formats 1:1 / 4:5 (post), 9:16 (vertical) et 16:9 (écran large) plutôt que d’exporter un seul fichier ?',
          options: [
            'Pour éviter le recadrage destructeur des plateformes qui coupent textes et logos hors des zones sûres (Safe Zones).',
            'Parce que les JPEG 1:1 ne s’ouvrent pas sur ordinateur.',
            'Uniquement pour changer le nom de l’entreprise sur chaque image.'
          ],
          bonneReponse: 0,
          explication: 'Chaque format respecte les marges d’interface (icônes TikTok/Reels/WhatsApp) et préserve une présentation professionnelle.'
        },
        'mn-12_ch-02': {
          titre: 'Défi 02 · Image-to-Video & Plans Rushes 3-5 s',
          question: 'Pourquoi génère-t-on généralement des plans vidéo IA courts (3 à 5 secondes) avant le montage ?',
          options: [
            'Pour garder une stabilité visuelle maximale sur chaque mouvement de caméra avant d’enchaîner un rythme maîtrisé au montage.',
            'Parce que l’œil humain ne perçoit pas plus de 5 secondes par scène.',
            'Pour supprimer totalement la piste audio au montage.'
          ],
          bonneReponse: 0,
          explication: 'Des plans courts Image-to-Video limitent la dérive morphologique et donnent un rythme dynamique lors de l’assemblage.'
        },
        'mn-12_ch-04': {
          titre: 'Défi 04 · Règle des 3 Secondes & Montage Multipiste',
          question: 'À quoi sert la « règle des 3 secondes » au tout début d’une vidéo de présentation ou capsule de formation ?',
          options: [
            'À capter immédiatement l’attention par un visuel marquant ou une promesse concrète avant que le spectateur ne passe à autre chose.',
            'À laisser 3 secondes d’écran noir silencieux pour charger.',
            'À afficher les remerciements dès la première image.'
          ],
          bonneReponse: 0,
          explication: 'Les 3 premières secondes décident du taux de rétention sur mobile ; elles doivent montrer l’enjeu et poser le rythme.'
        },
        'mn-12_ch-05': {
          titre: 'Défi 05 · DaVinci Resolve (Lift / Gamma / Gain & Waveform)',
          question: 'Quel outil graphique dans DaVinci Resolve permet d’exposer objectivement les noirs, tons moyens et hautes lumières sans se fier à un écran mal calibré ?',
          options: [
            'L’oscilloscope Waveform (Parade / Luma), ajusté avec les roues Lift, Gamma et Gain.',
            'L’outil gomme magique sur la piste audio.',
            'Le compteur de mots du générique de fin.'
          ],
          bonneReponse: 0,
          explication: 'Le Waveform mesure objectivement la luminance de 0 à 1023, guidant Lift (ombres), Gamma (tons moyens) et Gain (hautes lumières).'
        },
        'mn-12_ch-06': {
          titre: 'Défi 06 · Capstone Teaser 60 s & Cohérence Visuelle',
          question: 'Qu’est-ce qui distingue un projet vidéo IA professionnel livré en 5 formats d’une simple compilation de clips disparates ?',
          options: [
            'Une direction artistique unifiée (palette, typographie, voix, mixage -14 LUFS) et une continuité narrative entre chaque plan.',
            'L’utilisation d’au moins dix transitions étoile différentes entre chaque seconde.',
            'L’exportation systématique en 360p avec filigrane.'
          ],
          bonneReponse: 0,
          explication: 'La cohérence chromatique, sonore et narrative transforme des plans générés séparément en production crédible.'
        },
        'mn-10_ch-01': {
          titre: 'Défi 01 · Grille Tarifaire UEMOA & Acompte Contrat',
          question: 'Avant de démarrer une mission de terrain (cartographie, enquête Kobo ou analyse R) pour un client ou une ONG, quelle pratique sécurise la trésorerie ?',
          options: [
            'Signer un devis/contrat précisant périmètre, livrables et encaisser un acompte initial (ex. 40 % à 50 %) avant le démarrage.',
            'Livrer tous les fichiers bruts non verrouillés sans devis écrit préalable.',
            'Fixer un tarif symbolique inférieur aux frais réels de déplacement.'
          ],
          bonneReponse: 0,
          explication: 'Le contrat borné et l’acompte engagent les deux parties et financent les coûts opérationnels dès le lancement.'
        },
        'mn-10_ch-04': {
          titre: 'Défi 04 · Maîtrise du Scope Creep & Révisions',
          question: 'Comment gérer professionnellement une demande hors-devis du client (« pouvez-vous aussi refaire toute la base gratuitement ? ») ?',
          options: [
            'Accepter tout sans limitation pour éviter toute discussion.',
            'Appliquer la règle des 2 cycles de révisions inclus et chiffrer toute extension de périmètre via un avenant clair.',
            'Interrompre brutalement le contrat sans répondre aux messages.'
          ],
          bonneReponse: 1,
          explication: 'Distinguer ajustements inclus (2 cycles) et nouvelles fonctionnalités facturables préserve à la fois la marge et la relation client.'
        },
        'mn-10_ch-05': {
          titre: 'Défi 05 · Profil LinkedIn & Étude de Cas Terrain',
          question: 'Quel type de publication démontre le mieux l’expertise d’un agronome-numéricien auprès des ONG et bureaux d’études ?',
          options: [
            'Une étude de cas chiffrée « Problème terrain -> Méthode Kobo/QGIS/R -> Résultat concret » accompagnée d’un visuel net.',
            'Un simple partage automatique d’offre d’emploi sans commentaire.',
            'Une liste brute de 40 diplômes sans aucun exemple appliqué.'
          ],
          bonneReponse: 0,
          explication: 'Montrer comment vous avez résolu un problème réel avec des livrables vérifiables apporte une preuve immédiate de compétence.'
        },
        'mn-10_ch-06': {
          titre: 'Défi 06 · Capstone Dossier Consultant Indépendant',
          question: 'Quel ensemble compose un dossier commercial complet prêt à décrocher des missions en zone UEMOA ?',
          options: [
            'Un CV générique de trois pages sans modèle de devis.',
            'Offre packagée tarifée, modèle de contrat + échéancier 4 paliers, portfolio de 2-3 cas chiffrés et présence pro à jour.',
            'Une simple carte de visite sans lien ni portfolio.'
          ],
          bonneReponse: 1,
          explication: 'Un consultant crédible combine clarté commerciale (devis/contrat), preuves techniques (cas concrets) et réactivité.'
        }
      };

      if (banque[cleCoursChap]) return banque[cleCoursChap];
      return this._genererDefiGenerique(cours, chapitre, index);
    },

    _genererDefiGenerique(cours, chapitre, index) {
      const num = index + 1;
      const ressourcesCours = (cours.ressources || [])
        .filter(r => r && r.fichier)
        .map(r => ({ nom: r.nom || 'Ressource du cours', url: r.fichier }));
      const reponseIndex = index % 3;
      const optsParDefaut = [
        'Structurer les données selon un protocole reproductible, vérifier leur cohérence et documenter chaque étape.',
        'Sauter les vérifications de conformité pour accélérer la livraison au détriment de la précision.',
        'Stocker les fichiers finaux sans nommage ni copie de sauvegarde hors poste.'
      ];
      // Rotation propre pour éviter que la réponse A soit toujours en position 0
      const options = [
        optsParDefaut[(3 - reponseIndex) % 3],
        optsParDefaut[(4 - reponseIndex) % 3],
        optsParDefaut[(5 - reponseIndex) % 3]
      ];
      return {
        titre: `Défi ${num < 10 ? '0' + num : num} · Consolidation : ${chapitre.titre}`,
        consigne: `Validez les acquis opérationnels de la section « ${chapitre.titre} » (${cours.titre}) pour enregistrer vos 150 XP.`,
        question: `En appliquant les principes de « ${chapitre.titre} » sur un projet réel, quelle pratique reflète les exigences qualité TEAM Sahélia ?`,
        options: options,
        bonneReponse: reponseIndex,
        explication: 'La rigueur méthodologique repose sur la standardisation, le contrôle qualité systématique et la traçabilité des livrables.',
        ressources: ressourcesCours
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

        if (window.SaheliaCloud && typeof window.SaheliaCloud.synchroniserCloud === 'function') {
          window.SaheliaCloud.synchroniserCloud().catch(() => {});
        }
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
  window.Lecteur = Lecteur;

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
