/**
 * TEAM Sahélia - Application Principale & Moteur d'Interactions
 * Gère la Vitrine, la Console Privée, et le Studio Multi-Usages (Membres, Formations, Compétences).
 * 100% autonome sur file:/// (double-clic) et hébergeurs statiques.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 0. UTILITAIRES DE SÉCURITÉ & ASSAINISSEMENT
  // ---------------------------------------------------------------------------
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeFileName(str) {
    if (!str) return 'Badge';
    return String(str)
      .replace(/[/\\:*?"<>|]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_');
  }

  function sanitizeId(str) {
    return String(str || '').replace(/[^A-Za-z0-9_-]/g, '');
  }

  function isSafeHttpUrl(urlStr) {
    if (!urlStr) return false;
    try {
      const parsed = new URL(urlStr, window.location.origin);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch (e) {
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // 1. ÉTAT GLOBAL DE L'APPLICATION & COORDONNÉES OFFICIELLES
  // ---------------------------------------------------------------------------
  const LIEN_WHATSAPP_DEFAUT = 'https://chat.whatsapp.com/Gzp3bkauIIz8341VeMHOv7';
  const EMAIL_OFFICIEL_SAHELIA = 'teamsahelia@gmail.com';
  const NUMERO_WHATSAPP_SAHELIA = '+229 40 73 84 69';
  const LIEN_WHATSAPP_DIRECT = 'https://wa.me/22940738469';

  const GUIDES_DETAILS = {
    'guide-01': {
      numero: 'MINI-GUIDE 01',
      titre: 'Urgence Mémoire & Rapport sous Word & Excel',
      badge: 'BUREAUTIQUE & ACADÉMIQUE',
      couleur: '#5fd0a0',
      description: '10 règles d’or indispensables pour structurer son mémoire sans voir sa mise en page exploser la veille de l’impression.',
      points: [
        'Adopter les Styles (Titre 1, Titre 2) pour générer le Sommaire en 1 clic.',
        'Pagination différenciée : chiffres romains (I, II) pour le résumé et arabes (1, 2) pour l’Introduction.',
        'Utiliser Ctrl + Entrée pour un saut de page propre (jamais 15 touches Entrée).',
        'Tableaux académiques sans quadrillage lourd et avec répétition automatique des en-têtes.',
        'Aligner les décimales à droite sous Excel et formater les moyennes (± Écart-type).',
        'Exporter en PDF optimisé pour l’impression afin d’éviter les décalages de polices.',
      ],
      fichier: 'formation.html?cours=guide-01',
    },
    'guide-02': {
      numero: 'MINI-GUIDE 02 · AGRONOMIE',
      titre: 'Tracer sa Parcelle au GPS Smartphone & QGIS',
      badge: 'GÉOMATIQUE & PARCELLES',
      couleur: '#e8946a',
      description: 'De la collecte de points au champ sur téléphone ordinaire jusqu’à la carte officielle avec calcul de surface (ha).',
      points: [
        'Relever des points précis au smartphone avec pause de 20s au sommet (précision < 4m).',
        'Structurer son tableau CSV : Colonnes ID, Point, Longitude (X), Latitude (Y).',
        'Éviter le piège de l’inversion : Au Bénin, Longitude ≈ 2°E et Latitude ≈ 9°N.',
        'Le secret de la projection métrique : toujours projeter en UTM zone 31N (EPSG:32631).',
        'Calculer la surface en hectares dans la calculatrice de champ avec la formule : $area / 10000.',
        'Composer la carte avec Flèche Nord, Échelle graphique et image satellite Google.',
      ],
      fichier: 'formation.html?cours=guide-02',
    },
    'guide-03': {
      numero: 'MINI-GUIDE 03 · IA',
      titre: 'Prompts de Recherche & Vibe Coding Sans Tricher',
      badge: 'INTELLIGENCE ARTIFICIELLE',
      couleur: '#7fb0ee',
      description: 'Exploiter l’IA comme assistant scientifique sans plagiat ni hallucination bibliographique.',
      points: [
        'Ne jamais demander à l’IA d’inventer des citations : fournir le texte réel de l’article.',
        'La méthode de prompt C.R.E.D. : Contexte, Rôle, Exigence et Délimitation.',
        'Fiche de lecture automatique d’un PDF de recherche en 4 questions clés.',
        'Comprendre le Vibe Coding : décrire en français ce qu’on veut pour générer des scripts d’analyse.',
        'Exemple de script Python pour nettoyer un fichier de 500 mesures de maïs en 2 secondes.',
        'Déclarer honnêtement son usage de l’IA dans les remerciements de son mémoire.',
      ],
      fichier: 'formation.html?cours=guide-03',
    },
    'guide-04': {
      numero: 'MINI-GUIDE 04 · TERRAIN',
      titre: 'Collecte de Données Terrain avec KoboToolbox & Smartphone',
      badge: 'ENQUÊTES & FORMULAIRES',
      couleur: '#5fd0a0',
      description: 'Du questionnaire numérique au champ jusqu’à l’export Excel propre sans saisie papier ni perte de données.',
      points: [
        'Enquêter en mode 100 % hors-ligne en zone blanche sans aucune connexion internet.',
        'Intégrer les types clés : texte, entiers, choix unique/multiple, points GPS et photos de parcelles.',
        'Poser des sauts conditionnels (Skip Logic) pour n’afficher que les questions pertinentes.',
        'Verrouiller les valeurs aberrantes avec les contraintes de validation (ex: rendement max, tranche d’âge).',
        'Synchroniser instantanément les fiches collectées dès le retour au campement ou en zone réseau.',
        'Exporter en 1 clic vers Excel/CSV avec variables prêtes pour RStudio, SPSS ou QGIS.',
      ],
      fichier: 'formation.html?cours=guide-04',
    },
    'guide-05': {
      numero: 'MINI-GUIDE 05 · DESIGN',
      titre: 'Création Visuelle, Affiches Pro & Supports Réseaux',
      badge: 'COMMUNICATION & DESIGN',
      couleur: '#e8946a',
      description: 'Concevoir des affiches de soutenance, présentations et visuels réseaux percutants sans graphiste ni outil payant.',
      points: [
        'Les 4 formats maîtres : Carré 1:1, Portrait 4:5 (Instagram/LinkedIn), Vertical 9:16 (TikTok/Statut) et Affiche A3/A4.',
        'La hiérarchie visuelle en 3 niveaux : Accroche en 1s, Contexte en 3s, Coordonnées/Action en bas.',
        'La règle d’or des couleurs 60-30-10 : 60% fond sobre, 30% structure, 10% accentuation forte.',
        'Typographie pro : 2 polices maximum (1 sans-serif percutante pour titres, 1 neutre pour le corps).',
        'L’art du Negative Space : laisser 60 à 80 px de marges et du vide pour rendre le visuel haut de gamme.',
        'Détourage de logos en PNG transparent et exports optimisés : PNG HD pour le web, PDF 300 DPI pour l’impression.',
      ],
      fichier: 'formation.html?cours=guide-05',
    },
  };

  const etatApp = {
    lienWhatsApp: (function() {
      const stored = localStorage.getItem('sahelia_lien_whatsapp');
      if (!stored || stored.includes('SahéliaOfficiel2026') || stored.includes('G9L8v')) {
        return LIEN_WHATSAPP_DEFAUT;
      }
      return stored;
    })(),
    typeBadge: 'membre', // 'membre' | 'formation' | 'competence'
    formatBadge: 'paysage', // 'vertical' | 'carre' | 'paysage'

    // Sélection active
    membreSelectionne: null,
    formationSelectionnee: null,
    cohorteSelectionnee: null,
    participantSelectionne: null,
    attributionSelectionnee: null,

    photoMembreTemp: null,
    photoAdminTemp: null,
  };

  // ---------------------------------------------------------------------------
  // 2. ACTUALISATION DE LA VITRINE PUBLIQUE
  // ---------------------------------------------------------------------------
  function initialiserBanniereAnnonces() {
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
      <div style="background: linear-gradient(90deg, #0b2b24, #123e34); border-bottom: 1px solid var(--bordure); padding: 0.65rem 1rem; color: var(--texte); font-size: 0.88rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <span class="etiquette etiquette--or" style="font-size: 0.65rem;">${escapeHTML(libelleType)}</span>
          <strong style="color: var(--texte);">${escapeHTML(a.titre)} :</strong>
          <span style="color: var(--texte-2);">${escapeHTML(a.message)}</span>
          ${a.lien ? `<a href="${escapeHTML(a.lien)}" target="_blank" rel="noopener noreferrer" style="color: var(--marque); text-decoration: underline; font-weight: bold;">En savoir plus →</a>` : ''}
        </div>
        <button type="button" onclick="document.getElementById('banniere-annonces-sahelia').style.display='none'" style="background: transparent; border: none; color: var(--texte-3); cursor: pointer; font-size: 1.1rem; padding: 0 0.4rem;" title="Masquer l’annonce">✕</button>
      </div>
    `;
  }

  function actualiserVitrine() {
    initialiserBanniereAnnonces();
    const DB = window.SaheliaDB;

    // Boutons WhatsApp (avec validation stricte du protocole http/https)
    const safeWaUrl = isSafeHttpUrl(etatApp.lienWhatsApp) ? etatApp.lienWhatsApp : LIEN_WHATSAPP_DEFAUT;
    document.querySelectorAll('.btn-lien-whatsapp').forEach((btn) => {
      btn.href = safeWaUrl;
    });

    // Liens contacts officiels
    document.querySelectorAll('.lien-email-officiel').forEach((el) => {
      el.href = 'mailto:' + EMAIL_OFFICIEL_SAHELIA;
      if (el.dataset.autoTexte) el.textContent = EMAIL_OFFICIEL_SAHELIA;
    });
    document.querySelectorAll('.lien-tel-officiel').forEach((el) => {
      el.href = LIEN_WHATSAPP_DIRECT;
      if (el.dataset.autoTexte) el.textContent = NUMERO_WHATSAPP_SAHELIA;
    });

    // Grille auto-adaptative des membres (utilise SaheliaDB)
    const grille = document.getElementById('grille-membres');
    const membres = DB ? DB.membres : [];

    if (grille) {
      if (!membres || membres.length === 0) {
        grille.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 2rem; border: 1px dashed var(--bordure); border-radius: 12px; color: var(--texte-2);">
            La présentation des membres arrive bientôt. Notre mission, elle, est déjà claire : transformer des idées en compétences solides.
          </div>`;
      } else {
        grille.innerHTML = membres
          .map(
            (m) => `
          <article class="sa-carte">
            <div>
              ${
                m.photo
                  ? `<img src="${escapeHTML(m.photo)}" class="sa-membre-photo" alt="Photo de ${escapeHTML(m.nom)}">`
                  : `<div class="sa-membre-initiale" aria-hidden="true">${escapeHTML((m.nom || 'M').charAt(0).toUpperCase())}</div>`
              }
              <h3 class="sa-membre-nom">${escapeHTML(m.nom)}</h3>
              <p class="sa-membre-role">${escapeHTML(m.role)}</p>
              ${m.slogan ? `<blockquote class="sa-membre-phrase">« ${escapeHTML(m.slogan)} »</blockquote>` : ''}
            </div>
            ${
              m.tags && m.tags.length
                ? `
              <div class="sa-membre-tags">
                ${m.tags.map((t) => `<span class="sa-tag">${escapeHTML(t)}</span>`).join('')}
              </div>`
                : ''
            }
          </article>
        `
          )
          .join('');
      }
    }

    // Grille des activités
    const grilleAct = document.getElementById('grille-activites');
    const activites = DB && DB.activites ? DB.activites : [];

    if (grilleAct) {
      if (!activites || activites.length === 0) {
        grilleAct.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 2rem; border: 1px dashed var(--bordure); border-radius: 12px; color: var(--texte-2);">
            Aucune publication récente pour le moment.
          </div>`;
      } else {
        grilleAct.innerHTML = activites
          .map(
            (a) => `
          <article style="background: var(--surface); border: 1px solid var(--bordure); border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                <span style="font-size: 0.72rem; font-family: var(--police-mono); font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 4px; background: ${escapeHTML(a.couleur || '#5fd0a0')}25; color: ${escapeHTML(a.couleur || '#5fd0a0')};">
                  ${escapeHTML(a.type)}
                </span>
                <span style="font-size: 0.75rem; font-family: var(--police-mono); color: var(--texte-3);">${escapeHTML(a.date)}</span>
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--texte); margin-bottom: 0.5rem;">${escapeHTML(a.titre)}</h3>
              <p style="font-size: 0.85rem; color: var(--texte-2); line-height: 1.5; margin-bottom: 1rem;">${escapeHTML(a.description)}</p>
            </div>
            <div style="padding-top: 0.8rem; border-top: 1px solid var(--bordure); font-size: 0.75rem; font-family: var(--police-mono); color: var(--texte-3);">
              Statut : <strong style="color: var(--texte);">${escapeHTML(a.statut)}</strong>
            </div>
          </article>
        `
          )
          .join('');
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 3. STUDIO MULTI-BADGES (MEMBRES, FORMATIONS & COMPÉTENCES)
  // ---------------------------------------------------------------------------
  function initialiserStudioMultiBadges() {
    const canvas = document.getElementById('badge-canvas');
    if (!canvas || !window.BadgeEngine || !window.SaheliaDB) return;

    const DB = window.SaheliaDB;

    // Éléments du DOM
    const selectMembrePreset = document.getElementById('select-membre-preset');
    const inputMembreNom = document.getElementById('membre-nom-input');
    const inputMembreRole = document.getElementById('membre-role-input');
    const inputMembreInst = document.getElementById('membre-inst-input');
    const inputMembreId = document.getElementById('membre-id-input');
    const fileMembrePhoto = document.getElementById('membre-photo-file');
    const btnUploadPhotoMembre = document.getElementById('btn-upload-photo-membre');
    const btnResetPhotoMembre = document.getElementById('btn-reset-photo-membre');

    const selectFormation = document.getElementById('select-formation-catalogue');
    const selectCohorte = document.getElementById('select-cohorte-catalogue');
    const listeParticipants = document.getElementById('liste-participants-cohorte');
    const badgeStatsCohorte = document.getElementById('cohorte-stats-badge');
    const partNomTxt = document.getElementById('part-selectionne-nom');
    const partStatutTxt = document.getElementById('part-selectionne-statut');
    const partIdTxt = document.getElementById('part-selectionne-id');

    const selectAttribution = document.getElementById('select-attribution-preset');
    const compNiveauBadge = document.getElementById('comp-niveau-badge');
    const compValidateurTxt = document.getElementById('comp-validateur-txt');
    const compDateTxt = document.getElementById('comp-date-txt');
    const compCriteresListe = document.getElementById('comp-criteres-liste');

    const btnTelecharger = document.getElementById('btn-telecharger-badge');
    const btnImprimerPdf = document.getElementById('btn-imprimer-pdf');
    const btnLienVerif = document.getElementById('btn-lien-verif-direct');
    const btnBatchCohorte = document.getElementById('btn-batch-cohorte');
    const boxActionBatch = document.getElementById('box-action-batch');
    const batchProgressTxt = document.getElementById('batch-progress-txt');

    // -------------------------------------------------------------------------
    // A. Peuplement des Sélecteurs depuis la Base Réelle
    // -------------------------------------------------------------------------
    function peuplerSelectMembres() {
      if (!selectMembrePreset) return;
      const membres = Array.isArray(DB.membres) ? DB.membres : [];
      if (membres.length > 0) {
        const opts = membres
          .map(
            (m, idx) =>
              `<option value="${escapeHTML(m.id)}" ${idx === 0 ? 'selected' : ''}>${escapeHTML(m.nom)} (${escapeHTML(m.role)}) — ${escapeHTML(m.id)}</option>`
          )
          .join('');
        selectMembrePreset.innerHTML = opts + `<option value="custom">➕ Saisie libre / Mon profil...</option>`;
        etatApp.membreSelectionne = membres[0];
      } else {
        selectMembrePreset.innerHTML = `<option value="custom" selected>➕ Saisie libre / Mon profil...</option>`;
        etatApp.membreSelectionne = null;
      }
      synchroniserChampsMembre();
    }

    function synchroniserChampsMembre() {
      const m = etatApp.membreSelectionne;
      const inputMembreTel = document.getElementById('membre-tel-input');
      const inputMembreEmail = document.getElementById('membre-email-input');
      const inputMembreSexe = document.getElementById('membre-sexe-input');
      const inputMembreSlogan = document.getElementById('membre-slogan-input');

      if (!m) {
        if (inputMembreNom) inputMembreNom.value = '';
        if (inputMembreRole) inputMembreRole.value = '';
        if (inputMembreInst) inputMembreInst.value = '';
        if (inputMembreTel) inputMembreTel.value = '';
        if (inputMembreEmail) inputMembreEmail.value = '';
        if (inputMembreId) inputMembreId.value = 'TS-MBR-2026-001';
        if (inputMembreSexe) inputMembreSexe.value = 'M';
        if (inputMembreSlogan) inputMembreSlogan.value = '';
        return;
      }
      if (inputMembreNom) inputMembreNom.value = m.nom || '';
      if (inputMembreRole) inputMembreRole.value = m.role || '';
      if (inputMembreInst) inputMembreInst.value = m.institution || '';
      if (inputMembreTel) inputMembreTel.value = m.telephone || '';
      if (inputMembreEmail) inputMembreEmail.value = m.email || '';
      if (inputMembreId) inputMembreId.value = m.id || '';
      if (inputMembreSexe) inputMembreSexe.value = m.sexe || 'M';
      if (inputMembreSlogan) inputMembreSlogan.value = m.slogan || '';
    }

    function peuplerSelectFormations() {
      if (!selectFormation) return;
      selectFormation.innerHTML = DB.formations
        .map(
          (f, idx) => `<option value="${escapeHTML(f.id)}" ${idx === 0 ? 'selected' : ''}>${escapeHTML(f.titre)} (${escapeHTML(f.pole)})</option>`
        )
        .join('');

      etatApp.formationSelectionnee = DB.formations[0] || null;
      peuplerSelectCohortes();
    }

    function peuplerSelectCohortes() {
      if (!selectCohorte || !etatApp.formationSelectionnee) return;
      const cohortes = DB.cohortes.filter((c) => c && c.formationId === etatApp.formationSelectionnee.id);
      if (cohortes.length === 0) {
        selectCohorte.innerHTML = '<option value="">Aucune cohorte active</option>';
        etatApp.cohorteSelectionnee = null;
        if (listeParticipants) listeParticipants.innerHTML = '<div style="padding: 0.5rem; color: var(--texte-3);">Aucun participant</div>';
        return;
      }

      selectCohorte.innerHTML = cohortes
        .map((c, idx) => `<option value="${escapeHTML(c.id)}" ${idx === 0 ? 'selected' : ''}>${escapeHTML(c.nom)} — ${escapeHTML(c.periode)}</option>`)
        .join('');

      etatApp.cohorteSelectionnee = cohortes[0];
      peuplerParticipantsCohorte();
    }

    function peuplerParticipantsCohorte() {
      if (!listeParticipants || !etatApp.cohorteSelectionnee) return;
      const coh = etatApp.cohorteSelectionnee;
      const parts = Array.isArray(coh.participants) ? coh.participants : [];

      if (badgeStatsCohorte) {
        badgeStatsCohorte.innerText = `${parts.length} participant${parts.length > 1 ? 's' : ''}`;
      }

      if (parts.length === 0) {
        listeParticipants.innerHTML = '<div style="padding: 0.5rem; color: var(--texte-3);">Aucun participant inscrit.</div>';
        etatApp.participantSelectionne = null;
        return;
      }

      listeParticipants.innerHTML = parts
        .map((p, idx) => {
          let statutBadge = '<span style="color: #60a5fa; font-weight: bold;">• Inscrit</span>';
          if (p.statut === 'termine') {
            statutBadge = '<span style="color: #4ade80; font-weight: bold;">✓ Terminé</span>';
          } else if (p.statut === 'en_cours') {
            statutBadge = '<span style="color: #fbbf24; font-weight: bold;">⏳ En cours</span>';
          } else if (p.statut === 'revoque') {
            statutBadge = '<span style="color: #f87171; font-weight: bold;">✕ Révoqué</span>';
          }

          return `
          <div class="participant-item ${idx === 0 ? 'actif' : ''}" data-id="${escapeHTML(p.id)}">
            <div>
              <strong style="color: var(--texte); display: block;">${escapeHTML(p.nom)}</strong>
              <span style="font-size: 0.72rem; color: var(--texte-3);">${escapeHTML(p.id)} · ${escapeHTML(p.role)}</span>
            </div>
            <div>${statutBadge}</div>
          </div>
        `;
        })
        .join('');

      // Clic participant
      listeParticipants.querySelectorAll('.participant-item').forEach((item) => {
        item.addEventListener('click', () => {
          listeParticipants.querySelectorAll('.participant-item').forEach((el) => el.classList.remove('actif'));
          item.classList.add('actif');
          const id = item.dataset.id;
          etatApp.participantSelectionne = coh.participants.find((p) => p && p.id === id) || null;
          synchroniserVueParticipant();
          actualiserApercuBadge();
        });
      });

      etatApp.participantSelectionne = parts[0];
      synchroniserVueParticipant();
    }

    function synchroniserVueParticipant() {
      const p = etatApp.participantSelectionne;
      if (!p) return;
      if (partNomTxt) partNomTxt.innerText = p.nom;
      if (partIdTxt) partIdTxt.innerText = p.id;
      if (partStatutTxt) {
        let txt = 'INSCRIT';
        let col = '#60a5fa';
        if (p.statut === 'termine') {
          txt = 'FORMATION COMPLÉTÉE · VALIDÉ';
          col = '#4ade80';
        } else if (p.statut === 'en_cours') {
          txt = 'APPRENTISSAGE EN COURS';
          col = '#fbbf24';
        } else if (p.statut === 'revoque') {
          txt = 'PARTICIPATION INVALIDÉE';
          col = '#f87171';
        }
        partStatutTxt.innerText = txt;
        partStatutTxt.style.color = col;
        partStatutTxt.style.borderColor = col;
      }
    }

    function peuplerSelectAttributions() {
      if (!selectAttribution) return;
      selectAttribution.innerHTML = DB.attributions
        .map((a, idx) => {
          const revoq = a.statut === 'revoque' ? ' [RÉVOQUÉ - TEST]' : '';
          return `<option value="${escapeHTML(a.id)}" ${idx === 0 ? 'selected' : ''}>${escapeHTML(a.beneficiaireNom)} — ${escapeHTML(a.titreCompetence)} (${escapeHTML(a.niveau)})${revoq}</option>`;
        })
        .join('');

      etatApp.attributionSelectionnee = DB.attributions[0] || null;
      synchroniserVueAttribution();
    }

    function synchroniserVueAttribution() {
      const a = etatApp.attributionSelectionnee;
      if (!a) return;
      if (compNiveauBadge) compNiveauBadge.innerText = a.niveau;
      if (compValidateurTxt) compValidateurTxt.innerText = a.validePar;
      if (compDateTxt) compDateTxt.innerText = a.dateAttribution;

      if (compCriteresListe) {
        const comp = DB.competences.find((c) => c && c.id === a.competenceId);
        const crit = comp && Array.isArray(comp.criteres) ? comp.criteres : [];
        compCriteresListe.innerHTML = crit.map((c) => `<li>• ${escapeHTML(c)}</li>`).join('');
      }
    }

    // -------------------------------------------------------------------------
    // B. Moteur de Rendu en Direct sur Canvas
    // -------------------------------------------------------------------------
    function actualiserApercuBadge() {
      let dataBadge = {};
      const type = etatApp.typeBadge;
      const format = etatApp.formatBadge;

      if (type === 'membre') {
        const m = etatApp.membreSelectionne || {};
        const inputMembreSexe = document.getElementById('membre-sexe-input');
        const inputMembreSlogan = document.getElementById('membre-slogan-input');
        dataBadge = {
          id: inputMembreId ? inputMembreId.value : m.id,
          beneficiaireNom: inputMembreNom ? inputMembreNom.value : m.nom,
          beneficiaireRole: inputMembreRole ? inputMembreRole.value : m.role,
          institution: inputMembreInst ? inputMembreInst.value : m.institution,
          sexe: inputMembreSexe ? inputMembreSexe.value : (m.sexe || 'M'),
          slogan: (inputMembreSlogan && inputMembreSlogan.value) ? inputMembreSlogan.value : (m.slogan || 'L’agronomie de demain maîtrise la terre et la donnée.'),
          dateAdhesion: m.dateAdhesion || '15 Janvier 2026',
          photoImg: etatApp.photoMembreTemp,
          accentColor: '#5fd0a0',
        };
      } else if (type === 'formation') {
        const form = etatApp.formationSelectionnee || {};
        const coh = etatApp.cohorteSelectionnee || {};
        const part = etatApp.participantSelectionne || {};

        dataBadge = {
          id: part.id || 'TS-FOR-2026-Q1-001',
          titre: form.titre || 'Formation TEAM Sahélia',
          cohorteNom: coh.nom || 'Cohorte Pilote',
          periode: coh.periode || 'Octobre — Novembre 2026',
          lieu: coh.lieu || 'Campus FA-UP Parakou',
          formateur: coh.formateurPrincipal || form.formateur,
          beneficiaireNom: part.nom || 'Participant',
          beneficiaireRole: part.role || 'Étudiant FA-UP',
          sexe: part.sexe || 'M',
          statut: part.statut || 'en_cours',
          mention: part.mention || '',
          slogan: part.slogan || 'Bâtir pour de vrai : des compétences solides pour la jeunesse.',
          accentColor: form.accentColor || '#2563eb',
        };
      } else if (type === 'competence') {
        const attr = etatApp.attributionSelectionnee || {};
        const comp = DB.competences.find((c) => c.id === attr.competenceId) || {};

        dataBadge = {
          id: attr.id || 'TS-SKL-2026-001',
          titre: attr.titreCompetence || 'Délimitation & Cartographie Parcellaire QGIS',
          niveau: attr.niveau || 'Pratique Validée',
          beneficiaireNom: attr.beneficiaireNom || 'Titulaire',
          beneficiaireRole: attr.beneficiaireRole || 'Étudiant Agronome',
          sexe: attr.sexe || 'M',
          validePar: attr.validePar || 'Référent SIG',
          dateEmission: attr.dateAttribution || '25 Octobre 2026',
          slogan: attr.slogan || 'Le terrain d’abord : des compétences opérationnelles.',
          criteres: comp.criteres || [],
          domaine: comp.domaine || 'Géomatique Appliquée à l’Agronomie',
          accentColor: comp.accentColor || '#d97706',
        };
      }

      window.BadgeEngine.genererBadgeSurCanvas(canvas, {
        type,
        format,
        data: dataBadge,
      });

      // Mettre à jour le lien de vérification direct
      if (btnLienVerif && dataBadge.id) {
        btnLienVerif.href = `verifier.html?id=${encodeURIComponent(dataBadge.id)}`;
      }
    }

    // -------------------------------------------------------------------------
    // C. Écouteurs d'Événements & Interactions
    // -------------------------------------------------------------------------
    // Changement de Type de Badge
    document.querySelectorAll('.btn-type-badge').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-type-badge').forEach((b) => {
          b.style.background = 'var(--surface)';
          b.style.color = 'var(--texte-2)';
          b.classList.remove('actif');
        });
        btn.style.background = 'var(--marque)';
        btn.style.color = '#06100c';
        btn.classList.add('actif');

        etatApp.typeBadge = btn.dataset.type;

        // Afficher le bon panneau de formulaire
        document.querySelectorAll('.panneau-type-form').forEach((p) => (p.style.display = 'none'));
        const panel = document.getElementById(`panneau-type-${etatApp.typeBadge}`);
        if (panel) panel.style.display = 'block';

        // Afficher ou masquer le bouton de lot cohorte
        if (boxActionBatch) {
          boxActionBatch.style.display = etatApp.typeBadge === 'formation' ? 'block' : 'none';
        }

        actualiserApercuBadge();
      });
    });

    // Bascule Format Vertical vs Carré
    document.querySelectorAll('.btn-format-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-format-toggle').forEach((b) => {
          b.style.background = 'var(--fond)';
          b.style.color = 'var(--texte-2)';
          b.classList.remove('actif');
        });
        btn.style.background = 'var(--surface-2)';
        btn.style.color = 'var(--texte)';
        btn.classList.add('actif');

        etatApp.formatBadge = btn.dataset.format;
        actualiserApercuBadge();
      });
    });

    // Formulaire Membre
    if (selectMembrePreset) {
      selectMembrePreset.addEventListener('change', () => {
        const id = selectMembrePreset.value;
        if (id === 'custom') {
          etatApp.membreSelectionne = {
            id: 'TS-MBR-2026-CUSTOM',
            nom: '',
            role: '',
            institution: 'FA-UP · Université de Parakou',
          };
          inputMembreId.value = 'TS-MBR-2026-NOUVEAU';
          inputMembreNom.value = '';
          inputMembreRole.value = '';
          inputMembreInst.value = 'FA-UP · Université de Parakou';
          inputMembreNom.focus();
        } else {
          etatApp.membreSelectionne = DB.membres.find((m) => m.id === id) || null;
          synchroniserChampsMembre();
        }
        actualiserApercuBadge();
      });
    }

    const inputMembreSexe = document.getElementById('membre-sexe-input');
    if (inputMembreSexe) {
      inputMembreSexe.addEventListener('change', actualiserApercuBadge);
    }
    const inputMembreSlogan = document.getElementById('membre-slogan-input');
    if (inputMembreSlogan) {
      inputMembreSlogan.addEventListener('input', actualiserApercuBadge);
    }

    [inputMembreNom, inputMembreRole, inputMembreInst].forEach((inp) => {
      if (inp) inp.addEventListener('input', actualiserApercuBadge);
    });

    // Photo Membre
    if (btnUploadPhotoMembre && fileMembrePhoto) {
      btnUploadPhotoMembre.addEventListener('click', () => fileMembrePhoto.click());
      fileMembrePhoto.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            etatApp.photoMembreTemp = img;
            actualiserApercuBadge();
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    if (btnResetPhotoMembre) {
      btnResetPhotoMembre.addEventListener('click', () => {
        etatApp.photoMembreTemp = null;
        if (fileMembrePhoto) fileMembrePhoto.value = '';
        actualiserApercuBadge();
      });
    }

    // Formulaire Formation & Cohorte
    if (selectFormation) {
      selectFormation.addEventListener('change', () => {
        const id = selectFormation.value;
        etatApp.formationSelectionnee = DB.formations.find((f) => f.id === id) || null;
        peuplerSelectCohortes();
        actualiserApercuBadge();
      });
    }

    if (selectCohorte) {
      selectCohorte.addEventListener('change', () => {
        const id = selectCohorte.value;
        etatApp.cohorteSelectionnee = DB.cohortes.find((c) => c.id === id) || null;
        peuplerParticipantsCohorte();
        actualiserApercuBadge();
      });
    }

    // Formulaire Compétence
    if (selectAttribution) {
      selectAttribution.addEventListener('change', () => {
        const id = selectAttribution.value;
        etatApp.attributionSelectionnee = DB.attributions.find((a) => a.id === id) || null;
        synchroniserVueAttribution();
        actualiserApercuBadge();
      });
    }

    // Téléchargement Unique PNG HD (avec validation stricte des formulaires)
    if (btnTelecharger) {
      btnTelecharger.addEventListener('click', () => {
        const feedback = document.getElementById('badge-form-feedback');
        const afficherErreur = (msg) => {
          if (feedback) {
            feedback.style.display = 'block';
            feedback.style.background = 'rgba(239, 68, 68, 0.15)';
            feedback.style.border = '1px solid #ef4444';
            feedback.style.color = '#fca5a5';
            feedback.textContent = '⚠️ ' + msg;
          } else {
            alert(msg);
          }
        };

        const type = etatApp.typeBadge;
        if (type === 'membre') {
          const valNom = window.SaheliaValidateur
            ? window.SaheliaValidateur.validerNom(inputMembreNom ? inputMembreNom.value : '', 'Nom & Prénom')
            : { valide: true };
          if (!valNom.valide) {
            afficherErreur(valNom.message);
            if (inputMembreNom) inputMembreNom.focus();
            return;
          }

          const valRole = window.SaheliaValidateur
            ? window.SaheliaValidateur.validerTexte(inputMembreRole ? inputMembreRole.value : '', 'Rôle / Titre', 2, 60)
            : { valide: true };
          if (!valRole.valide) {
            afficherErreur(valRole.message);
            if (inputMembreRole) inputMembreRole.focus();
            return;
          }

          const valInst = window.SaheliaValidateur
            ? window.SaheliaValidateur.validerTexte(inputMembreInst ? inputMembreInst.value : '', 'Institution / Faculté', 2, 80)
            : { valide: true };
          if (!valInst.valide) {
            afficherErreur(valInst.message);
            if (inputMembreInst) inputMembreInst.focus();
            return;
          }

          const inputMembreTel = document.getElementById('membre-tel-input');
          const valTel = window.SaheliaValidateur
            ? window.SaheliaValidateur.validerTelephone(inputMembreTel ? inputMembreTel.value : '', true)
            : { valide: true };
          if (!valTel.valide) {
            afficherErreur(valTel.message);
            if (inputMembreTel) inputMembreTel.focus();
            return;
          }

          const inputMembreEmail = document.getElementById('membre-email-input');
          if (inputMembreEmail && inputMembreEmail.value.trim()) {
            const valEmail = window.SaheliaValidateur
              ? window.SaheliaValidateur.validerEmail(inputMembreEmail.value, false)
              : { valide: true };
            if (!valEmail.valide) {
              afficherErreur(valEmail.message);
              inputMembreEmail.focus();
              return;
            }
          }
        }

        if (feedback) {
          feedback.style.display = 'none';
        }

        let nomFichier = 'Badge_TEAM_SAHELIA';
        if (type === 'membre') {
          const nom = safeFileName(inputMembreNom ? inputMembreNom.value : 'Membre');
          const id = safeFileName(inputMembreId ? inputMembreId.value : 'TS-MBR');
          nomFichier = `Badge_Membre_${nom}_${id}_${etatApp.formatBadge}.png`;
        } else if (type === 'formation') {
          const part = etatApp.participantSelectionne || {};
          const nom = safeFileName(part.nom || 'Participant');
          const id = safeFileName(part.id || 'TS-FOR');
          nomFichier = `Badge_Formation_${nom}_${id}_${etatApp.formatBadge}.png`;
        } else if (type === 'competence') {
          const attr = etatApp.attributionSelectionnee || {};
          const nom = safeFileName(attr.beneficiaireNom || 'Titulaire');
          const id = safeFileName(attr.id || 'TS-SKL');
          nomFichier = `Attestation_Competence_${nom}_${id}_${etatApp.formatBadge}.png`;
        }

        const a = document.createElement('a');
        a.download = nomFichier;
        a.href = canvas.toDataURL('image/png');
        a.click();
      });
    }

    // -------------------------------------------------------------------------
    // D. Génération en Série pour Toute une Cohorte (Archive ZIP)
    // -------------------------------------------------------------------------
    if (btnBatchCohorte) {
      btnBatchCohorte.addEventListener('click', async () => {
        if (!etatApp.cohorteSelectionnee || !window.JSZip) {
          alert('Veuillez sélectionner une cohorte avec des participants.');
          return;
        }

        const coh = etatApp.cohorteSelectionnee;
        const form = etatApp.formationSelectionnee || {};
        const participants = coh.participants || [];

        if (participants.length === 0) {
          alert('Cette cohorte ne compte aucun participant enregistré.');
          return;
        }

        if (batchProgressTxt) {
          batchProgressTxt.style.display = 'block';
          batchProgressTxt.innerText = `Préparation de la génération (0/${participants.length})...`;
        }

        try {
          const zip = new JSZip();
          const safeCohorteNom = safeFileName(coh.nom || 'Cohorte');
          const dossier = zip.folder(`Badges_${safeCohorteNom}`);

          const cvsTemp = document.createElement('canvas');
          const format = etatApp.formatBadge;

          for (let i = 0; i < participants.length; i++) {
            const p = participants[i];
            if (batchProgressTxt) {
              batchProgressTxt.innerText = `Génération du badge (${i + 1}/${participants.length}) : ${p.nom}...`;
            }

            const dataBadge = {
              id: p.id,
              titre: form.titre || 'Formation TEAM Sahélia',
              cohorteNom: coh.nom,
              periode: coh.periode,
              lieu: coh.lieu,
              formateur: coh.formateurPrincipal || form.formateur,
              beneficiaireNom: p.nom,
              beneficiaireRole: p.role,
              statut: p.statut,
              accentColor: form.accentColor || '#2563eb',
            };

            window.BadgeEngine.genererBadgeSurCanvas(cvsTemp, {
              type: 'formation',
              format,
              data: dataBadge,
            });

            // Convertir en Blob/Base64
            const dataUrl = cvsTemp.toDataURL('image/png');
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
            const safePartNom = safeFileName(p.nom || 'Participant');
            const safePartId = safeFileName(p.id || 'TS');
            const nomFichier = `Badge_${safePartId}_${safePartNom}.png`;
            dossier.file(nomFichier, base64Data, { base64: true });
          }

          if (batchProgressTxt) {
            batchProgressTxt.innerText = 'Compression de l’archive ZIP en cours...';
          }

          const content = await zip.generateAsync({ type: 'blob' });
          const urlZip = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = urlZip;
          a.download = `Lot_Badges_${safeCohorteNom}_${format}.zip`;
          a.click();
          URL.revokeObjectURL(urlZip);

          if (batchProgressTxt) {
            batchProgressTxt.innerText = `✓ Archive ZIP téléchargée avec succès (${participants.length} badges).`;
            setTimeout(() => {
              batchProgressTxt.style.display = 'none';
            }, 4000);
          }
        } catch (err) {
          console.error('Erreur génération lot', err);
          alert('Erreur lors de la création du fichier ZIP : ' + err.message);
          if (batchProgressTxt) batchProgressTxt.style.display = 'none';
        }
      });
    }

    // Initialisation des données
    peuplerSelectMembres();
    peuplerSelectFormations();
    peuplerSelectAttributions();

    // Rendu au chargement des polices
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(actualiserApercuBadge);
    }
    actualiserApercuBadge();
  }

  // ---------------------------------------------------------------------------
  // 4. LECTEUR DE MINI-GUIDES
  // ---------------------------------------------------------------------------
  function initialiserLecteurGuides() {
    const modalGuide = document.getElementById('modal-guide-viewer');
    const btnFermer = document.getElementById('btn-fermer-guide');

    window.ouvrirApercuGuide = function (id) {
      const g = GUIDES_DETAILS[id];
      if (!g || !modalGuide) return;

      document.getElementById('guide-modal-badge').innerText = g.numero;
      document.getElementById('guide-modal-badge').style.color = g.couleur;
      document.getElementById('guide-modal-badge').style.borderColor = g.couleur;
      document.getElementById('guide-modal-titre').innerText = g.titre;
      document.getElementById('guide-modal-desc').innerText = g.description;

      const liste = document.getElementById('guide-modal-points');
      liste.innerHTML = g.points
        .map(
          (pt) => `
        <li style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.88rem; color: var(--texte); line-height: 1.5;">
          <span style="color: ${g.couleur}; font-weight: bold;">✓</span>
          <span>${escapeHTML(pt)}</span>
        </li>`
        )
        .join('');

      const btnFichier = document.getElementById('guide-modal-lien-fichier');
      if (btnFichier) btnFichier.href = g.fichier;

      modalGuide.classList.add('ouvert');
    };

    if (btnFermer && modalGuide) {
      btnFermer.addEventListener('click', () => modalGuide.classList.remove('ouvert'));
    }
  }

  // ---------------------------------------------------------------------------
  // 5. CONSOLE PRIVÉE DE L'ÉDITEUR (CADENAS FOOTER)
  // ---------------------------------------------------------------------------
  function initialiserConsoleAdmin() {
    const modal = document.getElementById('modal-editeur');
    const btnOuvrir = document.getElementById('btn-cadenas-admin');
    const btnFermer = document.getElementById('btn-fermer-admin');
    const DB = window.SaheliaDB;

    if (!modal || !btnOuvrir) return;

    btnOuvrir.addEventListener('click', async () => {
      const mdp = prompt('Accès réservé à l’éditeur de TEAM Sahélia.\nVeuillez saisir votre Clé Maître d’Administration :', '');
      if (mdp === null) return;

      let autorise = false;
      let msgErreur = 'Mot de passe ou clé maître incorrecte.';

      if (window.SaheliaSecurite && typeof window.SaheliaSecurite.authentifierAdmin === 'function') {
        const res = await window.SaheliaSecurite.authentifierAdmin(mdp, true);
        autorise = res.succes === true;
        if (!autorise && res.erreur) msgErreur = res.erreur;
      }

      if (autorise) {
        modal.classList.add('ouvert');
        actualiserListeAdminMembres();
        actualiserListeAdminActivites();
        actualiserListeAdminCertifs();
        peuplerSelectsAdminCertifs();
        actualiserAdminFormationSecurite();

        const inputWa = document.getElementById('admin-whatsapp-input');
        if (inputWa) inputWa.value = etatApp.lienWhatsApp;
      } else {
        alert(msgErreur);
      }
    });

    if (btnFermer) {
      btnFermer.addEventListener('click', () => modal.classList.remove('ouvert'));
    }

    // Onglets admin
    document.querySelectorAll('.admin-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab-btn').forEach((b) => {
          b.style.background = 'transparent';
          b.style.color = 'var(--texte-2)';
        });
        document.querySelectorAll('.admin-tab-panel').forEach((p) => (p.style.display = 'none'));

        btn.style.background = 'var(--marque)';
        btn.style.color = '#06100c';
        const panel = document.getElementById(`admin-panel-${btn.dataset.tab}`);
        if (panel) panel.style.display = 'block';

        if (btn.dataset.tab === 'formation') {
          actualiserAdminFormationSecurite();
        }
      });
    });

    // Gestion du code d'accès formation
    const btnChangerCode = document.getElementById('btn-changer-code-formation');
    if (btnChangerCode) {
      btnChangerCode.addEventListener('click', async () => {
        const nouveauCode = (document.getElementById('admin-input-nouveau-code')?.value || '').trim();
        const motif = (document.getElementById('admin-input-motif-rotation')?.value || '').trim() || 'Renouvellement par le Fondateur';

        if (!nouveauCode || nouveauCode.length < 6) {
          alert('Le nouveau code doit contenir au moins 6 caractères.');
          return;
        }

        btnChangerCode.disabled = true;
        btnChangerCode.textContent = 'Mise à jour en cours...';

        const res = await window.SaheliaSecurite.mettreAJourCode(nouveauCode, 'Fondateur', motif);
        btnChangerCode.disabled = false;
        btnChangerCode.textContent = 'Mettre à jour le Code & Révoquer les Sessions Antérieures';

        if (res.succes) {
          alert(`✓ Succès !\n${res.message}\nNouvelle époque de sécurité : #${res.nouvelleEpoch}`);
          const inputC = document.getElementById('admin-input-nouveau-code');
          const inputM = document.getElementById('admin-input-motif-rotation');
          if (inputC) inputC.value = '';
          if (inputM) inputM.value = '';
          actualiserAdminFormationSecurite();
        } else {
          alert('Erreur : ' + res.erreur);
        }
      });
    }

    // Révocation générale d'urgence
    const btnRevoquerAcces = document.getElementById('btn-revoquer-tous-acces-formation');
    if (btnRevoquerAcces) {
      btnRevoquerAcces.addEventListener('click', () => {
        const ok = confirm('⚠️ ATTENTION : Vous allez révoquer immédiatement 100% des sessions actives sur les manuels stratégiques.\nTous les étudiants et membres devront saisir à nouveau le code pour continuer. Confirmer ?');
        if (!ok) return;

        const res = window.SaheliaSecurite.revoquerTousLesAcces('Fondateur', 'Révocation générale d’urgence');
        if (res.succes) {
          alert(`✓ Révocation appliquée avec succès !\n${res.message}`);
          actualiserAdminFormationSecurite();
        }
      });
    }

    // Enregistrement du lien WhatsApp (validation HTTPS/HTTP anti-XSS)
    const btnSaveWa = document.getElementById('btn-save-whatsapp');
    if (btnSaveWa) {
      btnSaveWa.addEventListener('click', () => {
        const url = document.getElementById('admin-whatsapp-input').value.trim();
        if (!url || !isSafeHttpUrl(url)) {
          alert('Veuillez saisir une adresse URL valide commençant par https:// ou http://');
          return;
        }
        etatApp.lienWhatsApp = url;
        localStorage.setItem('sahelia_lien_whatsapp', url);
        actualiserVitrine();
        alert('✓ Lien d’invitation WhatsApp officiel mis à jour avec succès sur l’ensemble du site !');
      });
    }

    // Photo nouveau membre
    const inputPhotoMembre = document.getElementById('admin-photo-input');
    if (inputPhotoMembre) {
      inputPhotoMembre.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            const cvs = document.createElement('canvas');
            cvs.width = 256;
            cvs.height = 256;
            const cote = Math.min(img.width, img.height);
            cvs.getContext('2d').drawImage(img, (img.width - cote) / 2, (img.height - cote) / 2, cote, cote, 0, 0, 256, 256);
            etatApp.photoAdminTemp = cvs.toDataURL('image/jpeg', 0.85);
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    // Enregistrement nouveau membre
    const btnAjouterMembre = document.getElementById('btn-valider-membre');
    if (btnAjouterMembre) {
      btnAjouterMembre.addEventListener('click', () => {
        const nom = document.getElementById('admin-nom-input').value.trim();
        const role = document.getElementById('admin-role-input').value.trim();
        const phrase = document.getElementById('admin-phrase-input').value.trim();
        const tags = document
          .getElementById('admin-tags-input')
          .value.split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        if (!nom || !role) {
          alert('Veuillez renseigner au minimum le nom et le rôle du membre.');
          return;
        }

        const nouveauMembre = {
          id: 'TS-MBR-2026-' + String(DB.membres.length + 1).padStart(3, '0'),
          nom,
          role,
          slogan: phrase,
          institution: 'TEAM Sahélia · Parakou',
          dateAdhesion: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
          photo: etatApp.photoAdminTemp,
          tags,
        };

        DB.membres.push(nouveauMembre);
        DB.sauvegarderMembres();

        etatApp.photoAdminTemp = null;
        document.getElementById('form-nouveau-membre').reset();
        document.getElementById('box-nouveau-membre').style.display = 'none';

        actualiserListeAdminMembres();
        actualiserVitrine();
        initialiserStudioMultiBadges();
      });
    }

    // Publication nouvelle activité
    const btnAjouterAct = document.getElementById('btn-valider-activite');
    if (btnAjouterAct) {
      btnAjouterAct.addEventListener('click', () => {
        const titre = document.getElementById('admin-act-titre').value.trim();
        const type = document.getElementById('admin-act-type').value.trim() || 'Atelier Pratique';
        const date = document.getElementById('admin-act-date').value.trim() || 'À venir';
        const statut = document.getElementById('admin-act-statut').value.trim() || 'Disponible';
        const desc = document.getElementById('admin-act-desc').value.trim();

        if (!titre || !desc) {
          alert('Veuillez saisir un titre et une description.');
          return;
        }

        DB.ajouterActivite({
          titre,
          type,
          date,
          statut,
          description: desc,
          couleur: '#5fd0a0',
        });

        document.getElementById('form-nouvelle-activite').reset();
        document.getElementById('box-nouvelle-activite').style.display = 'none';

        actualiserListeAdminActivites();
        actualiserVitrine();
      });
    }

    // Attribution nouvelle compétence
    const btnValiderCertif = document.getElementById('btn-valider-certif');
    if (btnValiderCertif) {
      btnValiderCertif.addEventListener('click', () => {
        const nom = document.getElementById('admin-certif-nom').value.trim();
        const role = document.getElementById('admin-certif-role').value.trim() || 'Étudiant Agronome';
        const compId = document.getElementById('admin-certif-comp').value;
        const niveau = document.getElementById('admin-certif-niveau').value;
        const validateur = document.getElementById('admin-certif-validateur').value.trim();
        const projet = document.getElementById('admin-certif-projet').value.trim();

        if (!nom) {
          alert('Veuillez renseigner le nom du titulaire.');
          return;
        }

        const comp = DB.competences.find((c) => c.id === compId) || {};

        DB.delivrerCompetence({
          beneficiaireNom: nom,
          beneficiaireRole: role,
          competenceId: compId,
          titreCompetence: comp.titre || 'Compétence Validée',
          niveau,
          validePar: validateur,
          preuveProjet: projet,
        });

        document.getElementById('form-nouvelle-certif').reset();
        document.getElementById('box-nouvelle-certif').style.display = 'none';

        actualiserListeAdminCertifs();
        initialiserStudioMultiBadges();
        alert('✓ Attestation de compétence enregistrée avec succès dans le registre officiel !');
      });
    }

    // Inscription nouveau participant cohorte
    const btnValiderPart = document.getElementById('btn-valider-participant');
    if (btnValiderPart) {
      btnValiderPart.addEventListener('click', () => {
        const cohId = document.getElementById('admin-part-cohorte').value;
        const nom = document.getElementById('admin-part-nom').value.trim();
        const role = document.getElementById('admin-part-role').value.trim() || 'Étudiant FA-UP';
        const statut = document.getElementById('admin-part-statut').value;

        if (!nom) {
          alert('Veuillez renseigner le nom de l’étudiant.');
          return;
        }

        DB.inscrireParticipantCohorte(cohId, {
          nom,
          role,
          statut,
          dateEmission: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
        });

        document.getElementById('form-nouveau-part').reset();
        document.getElementById('box-nouveau-participant').style.display = 'none';

        initialiserStudioMultiBadges();
        alert('✓ Étudiant inscrit avec succès dans la cohorte !');
      });
    }
  }

  function peuplerSelectsAdminCertifs() {
    const DB = window.SaheliaDB;
    const selectComp = document.getElementById('admin-certif-comp');
    if (selectComp && DB.competences) {
      selectComp.innerHTML = DB.competences
        .map((c) => `<option value="${escapeHTML(c.id)}">${escapeHTML(c.titre)} (${escapeHTML(c.domaine)})</option>`)
        .join('');
    }

    const selectCoh = document.getElementById('admin-part-cohorte');
    if (selectCoh && DB.cohortes) {
      selectCoh.innerHTML = DB.cohortes
        .map((c) => `<option value="${escapeHTML(c.id)}">${escapeHTML(c.nom)} (${escapeHTML(c.periode)})</option>`)
        .join('');
    }
  }

  function actualiserListeAdminActivites() {
    const container = document.getElementById('admin-liste-activites');
    const DB = window.SaheliaDB;
    if (!container || !DB || !DB.activites) return;

    container.innerHTML = DB.activites
      .map(
        (a) => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: var(--fond); border: 1px solid var(--bordure); border-radius: 10px; margin-bottom: 0.5rem;">
        <div>
          <strong style="display: block; font-size: 0.92rem; color: var(--texte);">${escapeHTML(a.titre)}</strong>
          <span style="font-size: 0.75rem; color: var(--texte-2);">${escapeHTML(a.type)} · ${escapeHTML(a.date)} · Statut : ${escapeHTML(a.statut)}</span>
        </div>
        <button onclick="window.supprimerActiviteAdmin('${sanitizeId(a.id)}')" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; background: rgba(220,53,69,0.15); border: 1px solid rgba(220,53,69,0.3); color: #ff6b6b; border-radius: 4px; cursor: pointer;">
          Supprimer
        </button>
      </div>
    `
      )
      .join('');
  }

  window.supprimerActiviteAdmin = function (id) {
    if (confirm('Supprimer cette publication ?')) {
      window.SaheliaDB.supprimerActivite(id);
      actualiserListeAdminActivites();
      actualiserVitrine();
    }
  };

  function actualiserListeAdminCertifs() {
    const container = document.getElementById('admin-liste-certifs');
    const DB = window.SaheliaDB;
    if (!container || !DB || !DB.attributions) return;

    container.innerHTML = DB.attributions
      .map((a) => {
        const estRevoque = a.statut === 'revoque';
        const badgeStatut = estRevoque
          ? `<span style="color: #ff6b6b; font-weight: bold;">✕ Révoqué</span>`
          : `<span style="color: #4ade80; font-weight: bold;">✓ Valide</span>`;

        const safeId = sanitizeId(a.id);
        const boutonAction = estRevoque
          ? `<button onclick="window.rehabiliterBadgeAdmin('${safeId}')" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; background: rgba(34,197,94,0.15); border: 1px solid #22c55e; color: #4ade80; border-radius: 4px; cursor: pointer;">Réhabiliter</button>`
          : `<button onclick="window.revoquerBadgeAdmin('${safeId}')" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; background: rgba(220,53,69,0.15); border: 1px solid #ef4444; color: #ff6b6b; border-radius: 4px; cursor: pointer;">Révoquer</button>`;

        return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: var(--fond); border: 1px solid var(--bordure); border-radius: 10px; margin-bottom: 0.5rem;">
          <div>
            <strong style="display: block; font-size: 0.92rem; color: var(--texte);">${escapeHTML(a.beneficiaireNom)} — ${escapeHTML(a.titreCompetence)}</strong>
            <span style="font-size: 0.75rem; font-family: var(--police-mono); color: var(--texte-2);">ID : ${escapeHTML(a.id)} · ${escapeHTML(a.niveau)} · ${badgeStatut}</span>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            ${boutonAction}
            <a href="verifier.html?id=${encodeURIComponent(a.id)}" target="_blank" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; background: var(--surface); border: 1px solid var(--bordure); color: var(--texte-2); border-radius: 4px;">Inspecter ↗</a>
          </div>
        </div>
      `;
      })
      .join('');
  }

  window.revoquerBadgeAdmin = function (id) {
    const motif = prompt('Veuillez indiquer le motif officiel de révocation du badge :', 'Non-conformité des données de terrain.');
    if (motif === null) return;
    window.SaheliaDB.revoquerBadge(id, motif);
    actualiserListeAdminCertifs();
    initialiserStudioMultiBadges();
    alert(`✓ Le badge ${id} a été révoqué avec succès.`);
  };

  window.rehabiliterBadgeAdmin = function (id) {
    if (confirm(`Confirmez-vous la réhabilitation du badge ${id} ?`)) {
      window.SaheliaDB.rehabiliterBadge(id);
      actualiserListeAdminCertifs();
      initialiserStudioMultiBadges();
      alert(`✓ Le badge ${id} est à nouveau certifié conforme.`);
    }
  };

  function actualiserListeAdminMembres() {
    const container = document.getElementById('admin-liste-membres');
    if (!container || !window.SaheliaDB) return;

    container.innerHTML = window.SaheliaDB.membres
      .map(
        (m, i) => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: var(--fond); border: 1px solid var(--bordure); border-radius: 10px; margin-bottom: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          ${
            m.photo
              ? `<img src="${escapeHTML(m.photo)}" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover;">`
              : `<div style="width: 42px; height: 42px; border-radius: 50%; background: var(--surface-2); color: var(--marque); display: grid; place-items: center; font-weight: 700;">${escapeHTML(m.nom ? m.nom.charAt(0) : 'M')}</div>`
          }
          <div>
            <strong style="display: block; font-size: 0.95rem; color: var(--texte);">${escapeHTML(m.nom)}</strong>
            <span style="font-size: 0.78rem; color: var(--texte-2);">${escapeHTML(m.role)} · ${escapeHTML(m.id)}</span>
          </div>
        </div>
        <div style="display: flex; gap: 0.35rem;">
          <button onclick="window.deplacerMembreAdmin(${i}, -1)" ${i === 0 ? 'disabled' : ''} style="padding: 0.3rem 0.6rem; font-size: 0.75rem; background: var(--surface); border: 1px solid var(--bordure); color: var(--texte); border-radius: 4px; cursor: pointer;">↑</button>
          <button onclick="window.deplacerMembreAdmin(${i}, 1)" ${i === window.SaheliaDB.membres.length - 1 ? 'disabled' : ''} style="padding: 0.3rem 0.6rem; font-size: 0.75rem; background: var(--surface); border: 1px solid var(--bordure); color: var(--texte); border-radius: 4px; cursor: pointer;">↓</button>
          <button onclick="window.supprimerMembreAdmin('${sanitizeId(m.id)}')" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; background: rgba(220,53,69,0.15); border: 1px solid rgba(220,53,69,0.3); color: #ff6b6b; border-radius: 4px; cursor: pointer;">Supprimer</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  window.deplacerMembreAdmin = function (i, dir) {
    const membres = window.SaheliaDB.membres;
    const j = i + dir;
    if (j < 0 || j >= membres.length) return;
    const tmp = membres[i];
    membres[i] = membres[j];
    membres[j] = tmp;
    window.SaheliaDB.sauvegarderMembres();
    actualiserListeAdminMembres();
    actualiserVitrine();
  };

  window.supprimerMembreAdmin = function (id) {
    if (confirm('Voulez-vous vraiment supprimer ce membre de l’équipe ?')) {
      window.SaheliaDB.membres = window.SaheliaDB.membres.filter((m) => m.id !== id);
      window.SaheliaDB.sauvegarderMembres();
      actualiserListeAdminMembres();
      actualiserVitrine();
    }
  };

  function actualiserAdminFormationSecurite() {
    if (!window.SaheliaSecurite) return;
    const statut = window.SaheliaSecurite.obtenirStatutSecurite();
    const elemEpoch = document.getElementById('admin-sec-epoch');
    const elemDate = document.getElementById('admin-sec-date');
    const elemAuteur = document.getElementById('admin-sec-auteur');
    const elemJournal = document.getElementById('admin-journal-securite-formation');

    if (elemEpoch) elemEpoch.textContent = `#${statut.epoch || 1}`;
    if (elemDate) {
      elemDate.textContent = statut.derniereRotation
        ? new Date(statut.derniereRotation).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
        : 'Config initiale';
    }
    if (elemAuteur) elemAuteur.textContent = `Par : ${statut.auteurDerniereModif || 'Fondateur'}`;

    if (elemJournal) {
      const journal = window.SaheliaSecurite.obtenirJournalSecurite();
      if (!journal || journal.length === 0) {
        elemJournal.innerHTML = `<p style="color: var(--texte-3); padding: 0.5rem;">Aucun événement de rotation enregistré.</p>`;
      } else {
        elemJournal.innerHTML = journal
          .map(
            (evt) => `
          <div style="border-bottom: 1px solid var(--bordure); padding: 0.5rem 0.2rem;">
            <div style="display: flex; justify-content: space-between; font-weight: 600; color: var(--texte);">
              <span>${escapeHTML(evt.action)} (Époque #${evt.epoch})</span>
              <small style="color: var(--texte-3); font-family: var(--police-mono);">${new Date(evt.date).toLocaleDateString('fr-FR')}</small>
            </div>
            <div style="color: var(--texte-2); font-size: 0.72rem; margin-top: 0.2rem;">
              ${escapeHTML(evt.note || '')} · Par ${escapeHTML(evt.auteur || 'Fondateur')}
            </div>
          </div>
        `
          )
          .join('');
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 6. INITIALISATION
  // ---------------------------------------------------------------------------
  function demarrer() {
    actualiserVitrine();
    initialiserStudioMultiBadges();
    initialiserConsoleAdmin();
    initialiserLecteurGuides();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();
