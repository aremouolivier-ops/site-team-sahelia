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
    formatBadge: 'badge_seul', // 'vertical' | 'carre' | 'paysage'

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
              `<option value="${escapeHTML(m.id)}" ${idx === 0 ? 'selected' : ''}>✓ ${escapeHTML(m.nom)} (${escapeHTML(m.role)}) — ${escapeHTML(m.id)}</option>`
          )
          .join('');
        selectMembrePreset.innerHTML = opts;
        etatApp.membreSelectionne = membres[0];
      } else {
        selectMembrePreset.innerHTML = `<option value="" disabled selected>Aucun membre enregistré</option>`;
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

      // Verrouillage en lecture seule pour garantir l'intégrité institutionnelle
      const champs = [inputMembreNom, inputMembreRole, inputMembreInst, inputMembreTel, inputMembreEmail, inputMembreId, inputMembreSlogan];
      champs.forEach(c => { if (c) c.readOnly = true; });

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
        etatApp.participantSelectionne = null;
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
        const statutApp = m.statutAppartenance || m.categorie || 'Membre Officiel';
        dataBadge = {
          id: inputMembreId ? inputMembreId.value : (m.id || 'TS-MBR-2026-001'),
          titre: `${statutApp} · Communauté TEAM Sahélia`,
          type: 'membre',
          famille: 'appartenance',
          track: 'pionnier',
          statutAppartenance: statutApp,
          formeGeometrique: 'pentagone',
          beneficiaireNom: inputMembreNom && inputMembreNom.value ? inputMembreNom.value : (m.nom || 'Olivier AREMOU'),
          beneficiaireRole: inputMembreRole && inputMembreRole.value ? inputMembreRole.value : (m.role || 'Fondateur & Coordinateur Général'),
          institution: inputMembreInst && inputMembreInst.value ? inputMembreInst.value : (m.institution || 'Communauté TEAM Sahélia · République du Bénin'),
          sexe: inputMembreSexe ? inputMembreSexe.value : (m.sexe || 'M'),
          slogan: (inputMembreSlogan && inputMembreSlogan.value) ? inputMembreSlogan.value : (m.slogan || 'Apprendre aujourd’hui. Construire demain.'),
          dateAdhesion: m.dateAdhesion || '15 Janvier 2026',
          dateEmission: m.dateAdhesion || '15 Janvier 2026',
          photoImg: etatApp.photoMembreTemp,
          accentColor: '#22c55e',
          metal0: '#a7f3d0',
          metal1: '#22c55e',
          metal2: '#15803d',
          bgInner: '#06170f',
          code: 'pionnier'
        };
      } else if (type === 'formation') {
        const form = etatApp.formationSelectionnee || {};
        const coh = etatApp.cohorteSelectionnee || {};
        const part = etatApp.participantSelectionne || {};

        dataBadge = {
          id: part.id || 'TS-FOR-2026-Q1-001',
          type: 'formation',
          famille: 'formation',
          track: 'formation',
          titre: form.titre || 'Formation TEAM Sahélia',
          cohorteNom: coh.nom || 'Cohorte Pilote',
          periode: coh.periode || 'Janvier — Février 2026',
          lieu: coh.lieu || 'Terrain & En ligne (Format Hybride)',
          formateur: coh.formateurPrincipal || form.formateur || 'Ségla Bio KPEROU',
          beneficiaireNom: part.nom || 'Participant Officiel',
          beneficiaireRole: part.role || 'Apprenant de Cohorte',
          sexe: part.sexe || 'M',
          statut: part.statut || 'termine',
          mention: part.mention || 'Excellence Technique',
          dateEmission: part.dateValidation || coh.dateValidation || '28 Février 2026',
          validFrom: '2026-02-28T00:00:00Z',
          slogan: part.slogan || 'Bâtir pour de vrai : des compétences solides pour la jeunesse.',
          accentColor: form.accentColor || '#38bdf8',
          formeGeometrique: 'hexagone',
          volumeHoraire: form.volumeHoraire || '40 heures de travaux pratiques',
          code: 'formation'
        };
      } else {
        // Compétence & Spécialités Open Badges 3.0
        const attr = etatApp.attributionSelectionnee || DB.attributions[0] || {};
        const comp = DB.competences.find((c) => c.id === attr.competenceId || c.track === attr.track) || {};

        let titreComp = attr.titreCompetence || comp.titre || 'Praticien SIG & Cartographie QGIS';
        let codeTrack = comp.track || comp.code || attr.track || 'sig';
        let formeGeo = comp.formeGeometrique || 'hexagone';
        let accColor = comp.accentColor || '#94a3b8';

        if (type === 'competence-drone' || (attr.competenceId && String(attr.competenceId).includes('DRONE'))) {
          titreComp = 'Opérateur Drone & Télédétection Agricole';
          accColor = '#f59e0b';
          codeTrack = 'drone';
          formeGeo = 'ecusson';
        } else if (type === 'competence-vibe' || (attr.competenceId && String(attr.competenceId).includes('VIBE'))) {
          titreComp = 'Vibe Coding & Ingénieur Solutions IA';
          accColor = '#7fb0ee';
          codeTrack = 'vibe';
          formeGeo = 'octogone';
        } else if (type === 'competence-sig' || (attr.competenceId && String(attr.competenceId).includes('SIG'))) {
          titreComp = 'Praticien SIG & Cartographie QGIS';
          accColor = '#94a3b8';
          codeTrack = 'sig';
          formeGeo = 'hexagone';
        }

        dataBadge = {
          id: attr.id || 'TS-SKL-2026-001',
          type: 'competence',
          famille: comp.famille || attr.famille || 'competence',
          titre: titreComp,
          titreCompetence: titreComp,
          niveau: attr.niveau || comp.niveau || 'Pratique Validée',
          beneficiaireNom: attr.beneficiaireNom || 'Ségla Bio KPEROU',
          beneficiaireRole: attr.beneficiaireRole || 'Référent SIG & Cartographie',
          sexe: attr.sexe || 'M',
          validePar: attr.validePar || comp.validateur || 'Pôle Géomatique & Formation Continue',
          dateEmission: attr.dateAttribution || attr.dateEmission || '20 Janvier 2026',
          validFrom: attr.validFrom || '2026-01-20T00:00:00Z',
          preuveProjet: attr.preuveProjet || 'Évaluation sur livrable de terrain réel validée par les pairs.',
          slogan: attr.slogan || 'Le terrain d’abord : la donnée géographique au service de la terre.',
          criteres: comp.criteres || [],
          domaine: comp.domaine || 'Géomatique Appliquée à l’Agronomie',
          accentColor: accColor,
          track: codeTrack,
          code: codeTrack,
          formeGeometrique: formeGeo,
          metal0: comp.metal0 || '#f8fafc',
          metal1: comp.metal1 || '#cbd5e1',
          metal2: comp.metal2 || '#475569',
          bgInner: comp.bgInner || '#061713'
        };
      }

      window.BadgeEngine.genererBadgeSurCanvas(canvas, {
        type,
        format,
        data: dataBadge,
      });

      // Synchroniser le bouton LinkedIn
      const btnLinkedIn = document.getElementById('btn-partager-linkedin');
      if (btnLinkedIn && window.BadgeEngine.genererLienLinkedIn) {
        btnLinkedIn.href = window.BadgeEngine.genererLienLinkedIn(dataBadge);
      }

      // Synchroniser le bouton Copie JSON-LD Open Badges 3.0
      const btnCopierJsonLd = document.getElementById('btn-copier-jsonld');
      if (btnCopierJsonLd) {
        btnCopierJsonLd.onclick = async () => {
          if (!window.BadgeEngine.exporterOpenBadgeJSONLD) return;
          const json = window.BadgeEngine.exporterOpenBadgeJSONLD(dataBadge);
          try {
            await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
            const feedback = document.getElementById('badge-form-feedback');
            if (feedback) {
              feedback.style.display = 'block';
              feedback.style.background = 'rgba(34, 197, 94, 0.15)';
              feedback.style.color = '#86efac';
              feedback.style.border = '1px solid #22c55e';
              feedback.textContent = '✓ Métadonnées W3C / Open Badges 3.0 copiées dans le presse-papier !';
              setTimeout(() => { feedback.style.display = 'none'; }, 4000);
            }
          } catch (e) {
            alert('Métadonnées W3C générées avec succès !');
          }
        };
      }

      // Mettre à jour le lien de vérification direct
      if (btnLienVerif && dataBadge.id) {
        btnLienVerif.href = `verifier.html?id=${encodeURIComponent(dataBadge.id)}`;
      }
    }

    // -------------------------------------------------------------------------
    // C. Écouteurs d'Événements & Interactions
    // -------------------------------------------------------------------------
        // Changement de Type de Badge (4 Paliers Open Badges 3.0)
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
        if (etatApp.typeBadge === 'membre') {
          const panel = document.getElementById('panneau-type-membre');
          if (panel) panel.style.display = 'block';
        } else if (etatApp.typeBadge === 'formation') {
          const panel = document.getElementById('panneau-type-formation');
          if (panel) panel.style.display = 'block';
        } else {
          // Afficher le panneau compétences pour les badges de spécialités
          const panel = document.getElementById('panneau-type-competence');
          if (panel) panel.style.display = 'block';

          // Présélectionner l'attribution adéquate
          let matchAttr = null;
          if (etatApp.typeBadge === 'competence-sig') {
            matchAttr = DB.attributions.find((a) => a.competenceId === 'SKL-SIG-PARCELLE');
          } else if (etatApp.typeBadge === 'competence-drone') {
            matchAttr = DB.attributions.find((a) => a.competenceId === 'SKL-DRONE-TERRAIN') || DB.attributions[2];
          } else if (etatApp.typeBadge === 'competence-vibe') {
            matchAttr = DB.attributions.find((a) => a.competenceId === 'SKL-VIBE-CLEANING') || DB.attributions[0];
          }

          if (matchAttr && selectAttribution) {
            selectAttribution.value = matchAttr.id;
            etatApp.attributionSelectionnee = matchAttr;
            synchroniserVueAttribution();
          }
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
            institution: 'Communauté TEAM Sahélia',
          };
          inputMembreId.value = 'TS-MBR-2026-NOUVEAU';
          inputMembreNom.value = '';
          inputMembreRole.value = '';
          inputMembreInst.value = 'Communauté TEAM Sahélia';
          inputMembreNom.focus();
        } else {
          const tous = (DB.membresFondateurs || []).concat(DB.membres || []);
          etatApp.membreSelectionne = tous.find((m) => m.id === id) || null;
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

        if (type === 'formation') {
          const part = etatApp.participantSelectionne || {};
          if (part.statut !== 'termine') {
            afficherErreur(`L’attestation officielle de formation ne peut être délivrée tant que le parcours n’est pas validé. Statut actuel du participant : « ${part.statut === 'en_cours' ? 'En cours d’apprentissage' : (part.statut || 'Non terminé')} ». Seuls les apprenants ayant validé l'ensemble des modules peuvent télécharger leur attestation.`);
            return;
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

    // Pont depuis formation.html (?badgeCours=mn-XX#badges)
    try {
      const params = new URLSearchParams(window.location.search);
      const badgeCours = params.get('badgeCours');
      if (badgeCours) {
        const formationMatch = DB.formations.find((f) => f && f.id === badgeCours);
        if (formationMatch && selectFormation) {
          const btnForm = document.querySelector('.btn-type-badge[data-type="formation"]');
          if (btnForm) btnForm.click();
          selectFormation.value = badgeCours;
          selectFormation.dispatchEvent(new Event('change'));
        } else {
          const btnComp = document.querySelector('.btn-type-badge[data-type="competence"]');
          if (btnComp) btnComp.click();
        }

        const sectionBadges = document.getElementById('badges');
        if (sectionBadges && !document.getElementById('bandeau-completion-bridge')) {
          const coursObj = window.SaheliaCatalogue && window.SaheliaCatalogue.obtenirCours
            ? window.SaheliaCatalogue.obtenirCours(badgeCours)
            : null;
          const nomCours = coursObj ? coursObj.titre : badgeCours;
          const note = document.createElement('div');
          note.id = 'bandeau-completion-bridge';
          note.style.cssText = 'margin: 0 auto 1.25rem; max-width: 960px; padding: 0.9rem 1.2rem; border-radius: 12px; border: 1px solid rgba(52, 211, 153, 0.45); background: rgba(16, 185, 129, 0.12); color: var(--texte); font-size: 0.9rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem;';
          note.innerHTML = `<span>🏆 <strong>Parcours « ${escapeHTML(nomCours)} » complété à 100 % sur ce poste !</strong> Prévisualisez le modèle officiel ou soumettez votre reçu JSON à l’administration pour délivrance signée.</span>`;
          const conteneurStudio = sectionBadges.querySelector('.enveloppe') || sectionBadges;
          conteneurStudio.insertBefore(note, conteneurStudio.firstChild);
        }
      }
    } catch (e) {}
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
  // 5. RECHERCHE GLOBALE (CTRL+K), FILTRES PÔLES & PASSEPORT APPRENANT (WAVE 2)
  // ---------------------------------------------------------------------------
  function initialiserExperienceEdtorialeVitrine() {
    const actionsHeader = document.querySelector('.site-entete-actions') || document.querySelector('.site-entete .enveloppe');
    if (actionsHeader && !document.getElementById('btn-ouvrir-recherche-globale')) {
      const btnSearch = document.createElement('button');
      btnSearch.type = 'button';
      btnSearch.id = 'btn-ouvrir-recherche-globale';
      btnSearch.className = 'nav-action-pill';
      btnSearch.title = 'Rechercher parmi les 17 formations et 85 chapitres (Ctrl+K)';
      btnSearch.innerHTML = '🔍 Rechercher <kbd>Ctrl+K</kbd>';

      const btnPasseport = document.createElement('button');
      btnPasseport.type = 'button';
      btnPasseport.id = 'btn-ouvrir-passeport';
      btnPasseport.className = 'nav-action-pill';
      btnPasseport.title = 'Exporter ou restaurer votre progression et vos XP';
      const statsInit = window.SaheliaCloud ? window.SaheliaCloud.obtenirStatistiquesLocales() : { xpTotal: 0 };
      btnPasseport.innerHTML = statsInit.xpTotal > 0 ? `🎒 Passeport (${statsInit.xpTotal} XP)` : '🎒 Passeport';

      actionsHeader.prepend(btnPasseport);
      actionsHeader.prepend(btnSearch);
    }

    // Indexation des 17 cours & 85 chapitres pour Ctrl+K
    const indexCatalogue = [];
    if (window.SaheliaCatalogue) {
      window.SaheliaCatalogue.listerTous().forEach((c) => {
        indexCatalogue.push({
          type: c.type === 'guide' ? 'Mini-Guide Libre' : 'Manuel Stratégique',
          titre: c.titre,
          sousTitre: c.pole || '',
          mots: `${c.id} ${c.titre} ${c.sousTitre || ''} ${c.description || ''} ${c.pole || ''}`.toLowerCase(),
          url: `formation.html?cours=${encodeURIComponent(c.id)}`
        });
        (c.chapitres || []).forEach((ch) => {
          if (ch.id === 'unique') return;
          indexCatalogue.push({
            type: c.titre,
            titre: ch.titre,
            sousTitre: `${c.pole || ''} · ${ch.duree || ''}`,
            mots: `${c.id} ${c.titre} ${ch.id} ${ch.titre}`.toLowerCase(),
            url: `formation.html?cours=${encodeURIComponent(c.id)}&ch=${encodeURIComponent(ch.id)}`
          });
        });
      });
    }

    let modalSearch = document.getElementById('sa-modal-recherche-globale');
    if (!modalSearch) {
      modalSearch = document.createElement('div');
      modalSearch.id = 'sa-modal-recherche-globale';
      modalSearch.className = 'sa-overlay-palette';
      modalSearch.setAttribute('role', 'dialog');
      modalSearch.setAttribute('aria-label', 'Recherche globale dans les formations');
      modalSearch.innerHTML = `
        <div class="sa-palette-card">
          <div class="sa-palette-header">
            <span>🔍</span>
            <input type="search" id="sa-palette-input-recherche" class="sa-palette-input" placeholder="Rechercher un manuel, chapitre, QGIS, NDVI, Excel, Vibe Coding…">
            <button type="button" id="sa-palette-fermer" aria-label="Fermer la recherche" style="background:transparent;border:none;color:var(--texte-3);font-size:1.15rem;cursor:pointer;min-width:38px;min-height:38px;display:inline-flex;align-items:center;justify-content:center;">✕</button>
          </div>
          <div id="sa-palette-results" class="sa-palette-results"></div>
        </div>
      `;
      document.body.appendChild(modalSearch);
    }

    const inputSearch = document.getElementById('sa-palette-input-recherche');
    const resultsBox = document.getElementById('sa-palette-results');

    function afficherResultats(requete) {
      if (!resultsBox) return;
      const q = String(requete || '').trim().toLowerCase();
      const matches = q
        ? indexCatalogue.filter((item) => item.mots.includes(q)).slice(0, 14)
        : indexCatalogue.filter((item) => !item.url.includes('&ch=')).slice(0, 12);

      if (matches.length === 0) {
        resultsBox.innerHTML = `<p style="padding:1.5rem;text-align:center;color:var(--texte-3);font-size:0.88rem;">Aucun chapitre ou manuel trouvé pour « ${escapeHTML(requete)} ».</p>`;
        return;
      }

      resultsBox.innerHTML = matches.map((m) => `
        <a href="${m.url}" class="sa-palette-item">
          <div>
            <div class="sa-palette-item-titre">${escapeHTML(m.titre)}</div>
            <div class="sa-palette-item-meta">${escapeHTML(m.type)}${m.sousTitre ? ' · ' + escapeHTML(m.sousTitre) : ''}</div>
          </div>
          <span style="color:var(--marque);font-weight:700;font-size:0.82rem;white-space:nowrap;">Ouvrir →</span>
        </a>
      `).join('');
    }

    function ouvrirRecherche() {
      modalSearch.classList.add('ouvert');
      afficherResultats('');
      if (inputSearch) setTimeout(() => inputSearch.focus(), 40);
    }

    const btnOpenSearch = document.getElementById('btn-ouvrir-recherche-globale');
    if (btnOpenSearch) btnOpenSearch.addEventListener('click', ouvrirRecherche);
    const btnCloseSearch = document.getElementById('sa-palette-fermer');
    if (btnCloseSearch) btnCloseSearch.addEventListener('click', () => modalSearch.classList.remove('ouvert'));
    modalSearch.addEventListener('click', (e) => {
      if (e.target === modalSearch) modalSearch.classList.remove('ouvert');
    });
    if (inputSearch) {
      inputSearch.addEventListener('input', (e) => afficherResultats(e.target.value));
    }

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        ouvrirRecherche();
      } else if (e.key === 'Escape') {
        modalSearch.classList.remove('ouvert');
        const modPass = document.getElementById('sa-modal-passeport');
        if (modPass) modPass.classList.remove('ouvert');
      }
    });

    // Filtres par Pôle + Pastilles de progression sur les 12 cartes manuels
    const sectionManuels = document.getElementById('manuels');
    if (sectionManuels && window.SaheliaCatalogue) {
      const cartes = Array.from(sectionManuels.querySelectorAll('article'));
      const gridManuels = cartes[0]?.parentElement;
      cartes.forEach((carte) => {
        const lien = carte.querySelector('a[href*="formation.html?cours="]');
        if (!lien) return;
        const m = lien.getAttribute('href').match(/cours=([a-z0-9-]+)/i);
        if (!m) return;
        const coursId = m[1];
        const info = window.SaheliaCatalogue.obtenirCours(coursId);
        if (!info) return;
        carte.setAttribute('data-pole-id', info.poleId || '');

        const totalCh = (info.chapitres || []).length;
        let valides = 0;
        (info.chapitres || []).forEach((ch) => {
          try {
            if (localStorage.getItem(`sahelia_prog_${coursId}_${ch.id}`) === 'valide') valides++;
          } catch (e) {}
        });
        if (valides > 0) {
          const badgeProg = document.createElement('div');
          badgeProg.className = 'badge-progression-carte';
          badgeProg.textContent = valides >= totalCh
            ? `✓ Terminé (${valides}/${totalCh} chap.)`
            : `▶ En cours : ${valides}/${totalCh} chapitres`;
          const innerDiv = carte.querySelector('div');
          if (innerDiv) innerDiv.prepend(badgeProg);
        }
      });

      if (gridManuels && !document.getElementById('barre-filtres-poles')) {
        const barreFiltres = document.createElement('div');
        barreFiltres.id = 'barre-filtres-poles';
        barreFiltres.className = 'catalogue-filtres-barre';
        barreFiltres.innerHTML = `
          <div class="catalogue-chips-groupe" role="tablist" aria-label="Filtrer par pôle métier">
            <button type="button" class="chip-filtre-pole actif" data-pole="tous">Tous les manuels</button>
            <button type="button" class="chip-filtre-pole" data-pole="bureautique">📊 Bureautique</button>
            <button type="button" class="chip-filtre-pole" data-pole="agronomie_sig">🌱 Agronomie & SIG</button>
            <button type="button" class="chip-filtre-pole" data-pole="code_ia">💻 Code & IA</button>
            <button type="button" class="chip-filtre-pole" data-pole="communication_carriere">🚀 Création & Carrière</button>
          </div>
          <span style="font-size:0.78rem;color:var(--texte-3);">Accès libre · Certification Open Badges 3.0</span>
        `;
        gridManuels.parentElement.insertBefore(barreFiltres, gridManuels);

        barreFiltres.querySelectorAll('.chip-filtre-pole').forEach((chip) => {
          chip.addEventListener('click', () => {
            barreFiltres.querySelectorAll('.chip-filtre-pole').forEach((c) => c.classList.remove('actif'));
            chip.classList.add('actif');
            const pole = chip.getAttribute('data-pole');
            cartes.forEach((card) => {
              card.style.display = (pole === 'tous' || card.getAttribute('data-pole-id') === pole) ? 'flex' : 'none';
            });
          });
        });
      }
    }

    // Modale Passeport d'Apprentissage (Export/Import JSON & Cloud Sync)
    const btnPass = document.getElementById('btn-ouvrir-passeport');
    if (btnPass && window.SaheliaCloud) {
      btnPass.addEventListener('click', () => {
        let mod = document.getElementById('sa-modal-passeport');
        if (!mod) {
          mod = document.createElement('div');
          mod.id = 'sa-modal-passeport';
          mod.className = 'sa-overlay-palette';
          mod.innerHTML = `
            <div class="sa-palette-card" style="padding:1.5rem;gap:1rem;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <h3 style="font-size:1.15rem;font-weight:800;color:#fff;margin:0;">🎒 Mon Passeport d’Apprentissage TEAM Sahélia</h3>
                <button type="button" id="sa-passeport-fermer" aria-label="Fermer le passeport" style="background:transparent;border:none;color:var(--texte-3);font-size:1.15rem;cursor:pointer;min-width:38px;min-height:38px;display:inline-flex;align-items:center;justify-content:center;">✕</button>
              </div>
              <div id="sa-passeport-stats" style="font-size:0.88rem;color:var(--texte-2);background:#071410;padding:0.9rem;border-radius:10px;border:1px solid var(--bordure);"></div>
              <div style="display:flex;flex-wrap:wrap;gap:0.75rem;">
                <button type="button" id="sa-btn-export-passeport" class="v-btn v-btn--vert" style="font-size:0.85rem;">⬇ Exporter mon Passeport (.json)</button>
                <label class="v-btn v-btn--fantome" style="font-size:0.85rem;cursor:pointer;">
                  ⬆ Importer un Passeport (.json)
                  <input type="file" id="sa-input-import-passeport" accept="application/json,.json" style="display:none;">
                </label>
              </div>
              <p id="sa-passeport-feedback" style="font-size:0.8rem;color:var(--marque);margin:0;"></p>
            </div>
          `;
          document.body.appendChild(mod);
          document.getElementById('sa-passeport-fermer').addEventListener('click', () => mod.classList.remove('ouvert'));
          mod.addEventListener('click', (e) => { if (e.target === mod) mod.classList.remove('ouvert'); });
          document.getElementById('sa-btn-export-passeport').addEventListener('click', () => {
            window.SaheliaCloud.telechargerPasseport();
            document.getElementById('sa-passeport-feedback').textContent = '✓ Passeport téléchargé. Conservez-le pour restaurer vos chapitres sur tout autre téléphone ou PC.';
          });
          document.getElementById('sa-input-import-passeport').addEventListener('change', (ev) => {
            const f = ev.target.files && ev.target.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = (re) => {
              try {
                const res = window.SaheliaCloud.importerPasseportJSON(re.target.result);
                document.getElementById('sa-passeport-feedback').textContent = `✓ ${res.chapitresRestaures} chapitre(s) validé(s) restaurés sur cet appareil !`;
                setTimeout(() => window.location.reload(), 900);
              } catch (err) {
                document.getElementById('sa-passeport-feedback').textContent = '❌ ' + err.message;
              }
            };
            r.readAsText(f);
          });
        }
        const st = window.SaheliaCloud.obtenirStatistiquesLocales();
        document.getElementById('sa-passeport-stats').innerHTML = `
          <div>Identifiant apprenant : <code style="color:var(--marque);">${escapeHTML(st.learnerId)}</code></div>
          <div style="margin-top:0.4rem;">Chapitres validés : <strong>${st.chapitresValides}</strong> · XP cumulés : <strong>${st.xpTotal} XP</strong></div>
          <div style="margin-top:0.4rem;">Mode de persistance : <strong>${st.cloudActif ? '☁️ Cloud Worker D1 + Local' : '📱 Autonome Local + Export JSON'}</strong></div>
        `;
        mod.classList.add('ouvert');
      });
    }
  }

  // ---------------------------------------------------------------------------
  // ACTUALISATION DYNAMIQUE DES COMPTEURS DE FORMATIONS (AUTO-INCREMENT)
  // ---------------------------------------------------------------------------
  function actualiserCompteursFormations() {
    if (!window.SaheliaCatalogue) return;
    const Cat = window.SaheliaCatalogue;
    const tous = Cat.listerTous();
    const manuels = Cat.listerManuelsProteges();
    const guides = Cat.listerGuidesLibres();

    document.querySelectorAll('.compteur-total-cours').forEach(el => el.textContent = tous.length);
    document.querySelectorAll('.compteur-manuels').forEach(el => el.textContent = manuels.length);
    document.querySelectorAll('.compteur-guides').forEach(el => el.textContent = guides.length);
  }

  // 6. INITIALISATION
  // ---------------------------------------------------------------------------
  function demarrer() {
    actualiserVitrine();
    initialiserStudioMultiBadges();
    actualiserCompteursFormations();
    initialiserLecteurGuides();
    initialiserExperienceEdtorialeVitrine();

    // Enregistrement PWA Service Worker (Mode Hors-Ligne)
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch((err) => {
        console.warn('PWA hors-ligne :', err);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();
