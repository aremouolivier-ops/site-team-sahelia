/**
 * TEAM Sahélia — Moteur Graphique Vectoriel 2D Haute Définition pour Badges & Cartes
 * Respecte les standards W3C Verifiable Credentials Data Model v2.0 & 1EdTech Open Badges v3.0
 * Formats supportés :
 * - Insigne Numérique W3C HD (800 × 800)
 * - Carte Réseaux Sociaux HD (1080 × 1080)
 * - Tour de Cou Événementiel (720 × 1150)
 * - Carte Officielle CR80 / ISO-IEC 7810 ID-1 (1012 × 638, Ratio 1.586:1) :
 *     * Composition 1 : Carte Officielle de Membre (Appartenance)
 *     * Composition 2 : Attestation de Validation de Formation (Formation)
 *     * Composition 3 : Homologation de Compétence Technique (Compétence & Projet)
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. FORMES GÉOMÉTRIQUES VECTORIELLES HÉRALDIQUES
  // ---------------------------------------------------------------------------
  const FormesGeometriques = {
    pentagone(ctx, cx, cy, r) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - (Math.PI / 2);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    },

    hexagone(ctx, cx, cy, r) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI / 6) - (Math.PI / 6);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    },

    ecusson(ctx, cx, cy, w, h) {
      const x = cx - w / 2;
      const y = cy - h / 2;
      const r = w * 0.12;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h * 0.58);
      ctx.bezierCurveTo(x + w, y + h * 0.86, cx + w * 0.25, y + h, cx, y + h);
      ctx.bezierCurveTo(cx - w * 0.25, y + h, x, y + h * 0.86, x, y + h * 0.58);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    },

    octogone(ctx, cx, cy, r) {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * 2 * Math.PI / 8) - (Math.PI / 8);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    },

    rond(ctx, cx, cy, r) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.closePath();
    }
  };

  // ---------------------------------------------------------------------------
  // 2. ICÔNES VECTORIELLES MÉTIERS (ZÉRO EMOJI / 100% CANEVAS GÉOMÉTRIQUE)
  // ---------------------------------------------------------------------------
  const IconesVectorielles = {
    agronomie(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.08);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const s = size * 0.5;
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.8, cy + s * 0.8);
      ctx.bezierCurveTo(cx - s * 0.8, cy - s * 0.5, cx, cy - s * 0.9, cx + s * 0.9, cy - s * 0.9);
      ctx.bezierCurveTo(cx + s * 0.9, cy, cx + s * 0.5, cy + s * 0.8, cx - s * 0.8, cy + s * 0.8);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - s * 0.8, cy + s * 0.8);
      ctx.quadraticCurveTo(cx, cy, cx + s * 0.9, cy - s * 0.9);
      ctx.stroke();

      // Pousse montante
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.1, cy + s * 0.1);
      ctx.lineTo(cx + s * 0.35, cy + s * 0.3);
      ctx.stroke();

      ctx.restore();
    },

    sig(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.09);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const r = size * 0.35;
      // Cercle de repère
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.4, r, 0, Math.PI * 2);
      ctx.stroke();

      // Point central
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.4, r * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Flèche de pointeur
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.8, cy);
      ctx.lineTo(cx, cy + r * 1.3);
      ctx.lineTo(cx + r * 0.8, cy);
      ctx.stroke();

      // Carroyage méridien
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx - r * 1.1, cy - r * 0.4);
      ctx.lineTo(cx + r * 1.1, cy - r * 0.4);
      ctx.moveTo(cx, cy - r * 1.5);
      ctx.lineTo(cx, cy + r * 0.7);
      ctx.stroke();

      ctx.restore();
    },

    drone(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.08);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const s = size * 0.45;
      // Bras en croix
      ctx.beginPath();
      ctx.moveTo(cx - s, cy - s * 0.6);
      ctx.lineTo(cx + s, cy + s * 0.6);
      ctx.moveTo(cx + s, cy - s * 0.6);
      ctx.lineTo(cx - s, cy + s * 0.6);
      ctx.stroke();

      // Corps central
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#061711';
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.16, 0, Math.PI * 2);
      ctx.fill();

      // 4 rotors
      ctx.fillStyle = color;
      const rotors = [
        [cx - s, cy - s * 0.6],
        [cx + s, cy - s * 0.6],
        [cx - s, cy + s * 0.6],
        [cx + s, cy + s * 0.6]
      ];
      rotors.forEach(([rx, ry]) => {
        ctx.beginPath();
        ctx.arc(rx, ry, s * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(rx, ry, s * 0.28, s * 0.08, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Ondes radar descendantes
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy + s * 0.5, s * 0.6, Math.PI * 0.25, Math.PI * 0.75);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy + s * 0.7, s * 0.9, Math.PI * 0.28, Math.PI * 0.72);
      ctx.stroke();

      ctx.restore();
    },

    ia(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.08);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const s = size * 0.42;
      // Boîtier CPU
      ctx.beginPath();
      ctx.roundRect(cx - s * 0.65, cy - s * 0.65, s * 1.3, s * 1.3, s * 0.15);
      ctx.stroke();

      // Pins de connexion
      const pinLength = s * 0.3;
      [-0.35, 0, 0.35].forEach((offset) => {
        ctx.beginPath();
        ctx.moveTo(cx + offset * s, cy - s * 0.65);
        ctx.lineTo(cx + offset * s, cy - s * 0.65 - pinLength);
        ctx.moveTo(cx + offset * s, cy + s * 0.65);
        ctx.lineTo(cx + offset * s, cy + s * 0.65 + pinLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx - s * 0.65, cy + offset * s);
        ctx.lineTo(cx - s * 0.65 - pinLength, cy + offset * s);
        ctx.moveTo(cx + s * 0.65, cy + offset * s);
        ctx.lineTo(cx + s * 0.65 + pinLength, cy + offset * s);
        ctx.stroke();
      });

      // Chevrons de code < / >
      const cw = s * 0.35;
      const ch = s * 0.3;
      ctx.beginPath();
      ctx.moveTo(cx - cw * 0.3, cy - ch);
      ctx.lineTo(cx - cw * 0.9, cy);
      ctx.lineTo(cx - cw * 0.3, cy + ch);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + cw * 0.3, cy - ch);
      ctx.lineTo(cx + cw * 0.9, cy);
      ctx.lineTo(cx + cw * 0.3, cy + ch);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + cw * 0.2, cy - ch * 1.1);
      ctx.lineTo(cx - cw * 0.2, cy + ch * 1.1);
      ctx.stroke();

      ctx.restore();
    },

    data(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.08);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const s = size * 0.45;
      const bw = s * 0.32;
      // 3 colonnes de données
      ctx.fillRect(cx - s * 0.8, cy + s * 0.5 - s * 0.45, bw, s * 0.45);
      ctx.fillRect(cx - s * 0.2, cy + s * 0.5 - s * 0.85, bw, s * 0.85);
      ctx.fillRect(cx + s * 0.4, cy + s * 0.5 - s * 1.15, bw, s * 1.15);

      // Courbe de régression / tendance
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.95, cy + s * 0.15);
      ctx.quadraticCurveTo(cx - s * 0.1, cy - s * 0.4, cx + s * 0.85, cy - s * 0.95);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx + s * 0.85, cy - s * 0.95, s * 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },

    kobo(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.08);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const s = size * 0.45;
      // Smartphone de collecte
      ctx.beginPath();
      ctx.roundRect(cx - s * 0.5, cy - s * 0.9, s, s * 1.8, s * 0.18);
      ctx.stroke();

      // Coche de validation centrale
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.22, cy - s * 0.05);
      ctx.lineTo(cx - s * 0.05, cy + s * 0.15);
      ctx.lineTo(cx + s * 0.25, cy - s * 0.2);
      ctx.stroke();

      // Géopoint supérieur
      ctx.beginPath();
      ctx.arc(cx, cy - s * 0.5, s * 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },

    projet(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.08);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const s = size * 0.45;
      // Ampoule d'innovation & solution
      ctx.beginPath();
      ctx.arc(cx, cy - s * 0.25, s * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Étoile d'impact centrale
      ctx.beginPath();
      ctx.moveTo(cx, cy - s * 0.55);
      ctx.lineTo(cx, cy + s * 0.05);
      ctx.moveTo(cx - s * 0.25, cy - s * 0.25);
      ctx.lineTo(cx + s * 0.25, cy - s * 0.25);
      ctx.stroke();

      // Base
      ctx.fillRect(cx - s * 0.22, cy + s * 0.28, s * 0.44, s * 0.14);
      ctx.fillRect(cx - s * 0.14, cy + s * 0.44, s * 0.28, s * 0.1);

      ctx.restore();
    },

    mentor(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.08);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const s = size * 0.45;
      // Mentor & Apprenant (Binôme de transmission)
      ctx.beginPath();
      ctx.arc(cx - s * 0.35, cy - s * 0.3, s * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + s * 0.35, cy - s * 0.15, s * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Épaules
      ctx.beginPath();
      ctx.arc(cx - s * 0.35, cy + s * 0.4, s * 0.45, Math.PI, 0, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + s * 0.35, cy + s * 0.45, s * 0.35, Math.PI, 0, false);
      ctx.stroke();

      // Étoile de transmission
      ctx.beginPath();
      ctx.arc(cx, cy - s * 0.75, s * 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },

    formation(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.08);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const s = size * 0.45;
      // Livre ouvert
      ctx.beginPath();
      ctx.moveTo(cx, cy + s * 0.4);
      ctx.lineTo(cx, cy - s * 0.35);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy - s * 0.35);
      ctx.quadraticCurveTo(cx - s * 0.45, cy - s * 0.65, cx - s * 0.9, cy - s * 0.4);
      ctx.lineTo(cx - s * 0.9, cy + s * 0.35);
      ctx.quadraticCurveTo(cx - s * 0.45, cy + s * 0.1, cx, cy + s * 0.4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy - s * 0.35);
      ctx.quadraticCurveTo(cx + s * 0.45, cy - s * 0.65, cx + s * 0.9, cy - s * 0.4);
      ctx.lineTo(cx + s * 0.9, cy + s * 0.35);
      ctx.quadraticCurveTo(cx + s * 0.45, cy + s * 0.1, cx, cy + s * 0.4);
      ctx.stroke();

      // Sceau
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy - s * 0.65, s * 0.16, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  };

  // ---------------------------------------------------------------------------
  // 3. FONCTIONS UTILITAIRES DE RENDU (TEXT SHRINK, LOGO & QR)
  // ---------------------------------------------------------------------------
  function dessinerTexteAutoShrink(ctx, texte, x, y, maxLargeur, fontFamille, tailleMax, tailleMin = 11, poids = '700') {
    if (!texte) return tailleMax;
    let taille = tailleMax;
    ctx.font = `${poids} ${taille}px ${fontFamille}`;
    let w = ctx.measureText(texte).width;
    while (w > maxLargeur && taille > tailleMin) {
      taille -= 1;
      ctx.font = `${poids} ${taille}px ${fontFamille}`;
      w = ctx.measureText(texte).width;
    }
    let txtAffiche = texte;
    if (w > maxLargeur) {
      while (ctx.measureText(txtAffiche + '...').width > maxLargeur && txtAffiche.length > 3) {
        txtAffiche = txtAffiche.slice(0, -1);
      }
      txtAffiche += '...';
    }
    ctx.fillText(txtAffiche, x, y);
    return taille;
  }

  function dessinerQR(ctx, x, y, size, url, fg = '#06130e', bg = '#ffffff') {
    ctx.save();
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(x - 6, y - 6, size + 12, size + 12, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const qrGen = typeof qrcode !== 'undefined' ? qrcode : (typeof window !== 'undefined' && window.qrcode ? window.qrcode : null);
    if (qrGen) {
      try {
        const qr = qrGen(0, 'M');
        qr.addData(url);
        qr.make();
        const count = qr.getModuleCount();
        const cellSize = size / count;
        ctx.fillStyle = fg;
        for (let r = 0; r < count; r++) {
          for (let c = 0; c < count; c++) {
            if (qr.isDark(r, c)) {
              ctx.fillRect(x + c * cellSize, y + r * cellSize, cellSize + 0.35, cellSize + 0.35);
            }
          }
        }
      } catch (e) {
        fallbackQR(ctx, x, y, size, fg);
      }
    } else {
      fallbackQR(ctx, x, y, size, fg);
    }
    ctx.restore();
  }

  function fallbackQR(ctx, x, y, size, fg) {
    ctx.fillStyle = fg;
    ctx.font = '700 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('QR CODE W3C', x + size / 2, y + size / 2);
  }

  function dessinerLogo(ctx, cx, cy) {
    ctx.save();
    ctx.fillStyle = '#e8946a';
    ctx.beginPath();
    ctx.arc(cx, cy + 10, 32, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(cx - 42, cy + 12, 84, 5, 2.5);
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.roundRect(cx - 30, cy + 20, 60, 4.5, 2.2);
    ctx.fill();

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(cx - 18, cy + 28, 36, 3.5, 1.7);
    ctx.fill();

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(cx + 30, cy - 10, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#eaf4ee';
    ctx.font = '700 14px "Bricolage Grotesque", sans-serif';
    ctx.fillText('TEAM', cx, cy + 48);

    ctx.font = '800 26px "Bricolage Grotesque", sans-serif';
    ctx.fillText('SAHÉLIA', cx, cy + 74);
    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // 4. RENDU 1 : L'INSIGNE OPEN BADGE 3.0 HD (800 × 800)
  // ---------------------------------------------------------------------------
  function dessinerInsigneOpenBadge(ctx, W, H, data) {
    const cx = W / 2;
    const cy = H * 0.40;
    const r = Math.min(W, H) * 0.33;

    const track = data.track || 'pionnier';
    const forme = data.formeGeometrique || (data.forme || 'pentagone');
    const metal0 = data.metal0 || '#e8946a';
    const metal1 = data.metal1 || '#cd7f32';
    const metal2 = data.metal2 || '#78350f';
    const bgInner = data.bgInner || '#091c15';
    const accent = data.accentColor || '#5fd0a0';
    const niveau = data.niveau || 'Pratique Validée';
    const titre = data.titre || 'Certification TEAM Sahélia';
    const nom = (data.beneficiaireNom || '').toUpperCase();
    const id = data.id || 'TS-OFFICIEL';

    // Fond avec halo sombre profond
    const bgRad = ctx.createRadialGradient(cx, cy, 50, cx, cy, W * 0.7);
    bgRad.addColorStop(0, '#0c241b');
    bgRad.addColorStop(0.65, '#05120d');
    bgRad.addColorStop(1, '#020705');
    ctx.fillStyle = bgRad;
    ctx.fillRect(0, 0, W, H);

    // Grille de points subtils
    ctx.fillStyle = 'rgba(95, 208, 160, 0.05)';
    for (let gx = 40; gx < W; gx += 40) {
      for (let gy = 40; gy < H; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Halo d'aura sobre
    const aura = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.2);
    aura.addColorStop(0, accent + '22');
    aura.addColorStop(0.7, accent + '0a');
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Traceur de forme selon géométrie
    function tracer(rayonMult) {
      if (forme === 'hexagone') {
        FormesGeometriques.hexagone(ctx, cx, cy, r * rayonMult);
      } else if (forme === 'ecusson') {
        FormesGeometriques.ecusson(ctx, cx, cy, r * 1.8 * rayonMult, r * 2.1 * rayonMult);
      } else if (forme === 'octogone') {
        FormesGeometriques.octogone(ctx, cx, cy, r * rayonMult);
      } else if (forme === 'rond') {
        FormesGeometriques.rond(ctx, cx, cy, r * rayonMult);
      } else {
        FormesGeometriques.pentagone(ctx, cx, cy, r * rayonMult);
      }
    }

    // Biseau métallique externe
    const gradMetal = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    gradMetal.addColorStop(0, metal0);
    gradMetal.addColorStop(0.35, metal1);
    gradMetal.addColorStop(0.7, metal2);
    gradMetal.addColorStop(1, metal0);

    ctx.save();
    tracer(1.0);
    ctx.fillStyle = gradMetal;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();

    // Bordure interne foncée
    tracer(0.94);
    ctx.fillStyle = bgInner;
    ctx.fill();

    // Liseré métallique intérieur
    tracer(0.89);
    ctx.strokeStyle = gradMetal;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Icône vectorielle métier centrale
    if (track === 'sig') {
      IconesVectorielles.sig(ctx, cx, cy - 25, 110, accent);
    } else if (track === 'drone') {
      IconesVectorielles.drone(ctx, cx, cy - 25, 120, accent);
    } else if (track === 'vibe' || track === 'ia') {
      IconesVectorielles.ia(ctx, cx, cy - 25, 115, accent);
    } else if (track === 'data') {
      IconesVectorielles.data(ctx, cx, cy - 25, 110, accent);
    } else if (track === 'kobo') {
      IconesVectorielles.kobo(ctx, cx, cy - 25, 110, accent);
    } else if (track === 'projet') {
      IconesVectorielles.projet(ctx, cx, cy - 25, 115, accent);
    } else if (track === 'mentor') {
      IconesVectorielles.mentor(ctx, cx, cy - 25, 115, accent);
    } else if (track === 'formation') {
      IconesVectorielles.formation(ctx, cx, cy - 25, 115, accent);
    } else {
      IconesVectorielles.agronomie(ctx, cx, cy - 35, 110, accent);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = metal0;
      ctx.font = '800 28px "Bricolage Grotesque", sans-serif';
      ctx.fillText('TS', cx, cy + 28);
    }

    // Inscriptions gravées sur l'insigne
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = metal0;
    ctx.font = '800 11px "JetBrains Mono", monospace';
    ctx.fillText('TEAM SAHÉLIA · PANAFRICAIN', cx, cy - r * 0.58);

    // Ruban Titre de Compétence (Directement lisible)
    const rubanW = r * 1.65;
    const rubanH = 36;
    const rubanY = cy + r * 0.40;

    ctx.fillStyle = 'rgba(5, 18, 14, 0.92)';
    ctx.strokeStyle = gradMetal;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - rubanW / 2, rubanY, rubanW, rubanH, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, titre.toUpperCase(), cx, rubanY + 23, rubanW - 20, '"Figtree", sans-serif', 12.5, 9, '800');

    // Section Récipient & Identité W3C (Sous l'insigne)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(cx - 180, H - 150, 360, 1);

    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, nom || 'TITULAIRE OFFICIEL', cx, H - 116, W - 80, '"Bricolage Grotesque", sans-serif', 26, 16, '800');

    ctx.fillStyle = '#a9c4b6';
    dessinerTexteAutoShrink(ctx, `${data.beneficiaireRole || 'Praticien'} · ${niveau}`, cx, H - 90, W - 100, '"Figtree", sans-serif', 13.5, 11, '600');

    ctx.fillStyle = accent;
    ctx.font = '700 11.5px "JetBrains Mono", monospace';
    ctx.fillText(`ID OFFICIEL : ${id}`, cx, H - 68);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 9.5px "JetBrains Mono", monospace';
    ctx.fillText('TITRE OPPOSABLE W3C VERIFIABLE CREDENTIAL · OPEN BADGES 3.0', cx, H - 48);
  }

  // ---------------------------------------------------------------------------
  // 5. COMPOSITION 1 : CARTE OFFICIELLE DE MEMBRE (CR80 · 1012 × 638 PX)
  // ---------------------------------------------------------------------------
  function dessinerCarteMembreCR80(ctx, W, H, data) {
    const id = data.id || 'TS-MBR-2026-001';
    const qrUrl = `https://aremouolivier-ops.github.io/site-team-sahelia/verifier.html?id=${encodeURIComponent(id)}`;
    const cat = data.statutAppartenance || data.categorie || 'Membre Officiel';

    // Fond institutionnel vert nuit très profond
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#04120d');
    grad.addColorStop(0.5, '#071f16');
    grad.addColorStop(1, '#0a2b1f');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 24);
    ctx.fill();

    // Liseré double de sécurité
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(8, 8, W - 16, H - 16, 20);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(232, 148, 106, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(14, 14, W - 28, H - 28, 16);
    ctx.stroke();

    // En-tête : Bandeau institutionnel
    dessinerLogo(ctx, 80, 26);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#4ade80';
    ctx.font = '800 12px "JetBrains Mono", monospace';
    ctx.fillText('RÉPUBLIQUE DU BÉNIN & AFRIQUE DE L’OUEST', 180, 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 18px "Bricolage Grotesque", sans-serif';
    ctx.fillText('TEAM SAHÉLIA · CARTE OFFICIELLE DE MEMBRE', 180, 72);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11.5px "Figtree", sans-serif';
    ctx.fillText('Communauté Panafricaine des Praticiens du Numérique & de l’Agronomie', 180, 92);

    // Pilule Catégorie de Membre (Haut Droit)
    const piluleTxt = cat.toUpperCase();
    ctx.font = '800 11px "Figtree", sans-serif';
    const piluleW = ctx.measureText(piluleTxt).width + 32;
    const piluleX = W - piluleW - 45;
    const piluleY = 40;

    ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(piluleX, piluleY, piluleW, 30, 15);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#86efac';
    ctx.textAlign = 'center';
    ctx.fillText('★ ' + piluleTxt, piluleX + piluleW / 2, piluleY + 19);

    // Ligne de démarcation
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 125);
    ctx.lineTo(W - 36, 125);
    ctx.stroke();

    // Bloc Photo / Monogramme (Gauche)
    const photoX = 45;
    const photoY = 145;
    const photoSize = 220;

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(photoX - 3, photoY - 3, photoSize + 6, photoSize + 6, 20);
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoSize, photoSize, 18);
    ctx.clip();

    if (data.photoImg) {
      const pImg = data.photoImg;
      const imgW = pImg.naturalWidth || pImg.width || 1;
      const imgH = pImg.naturalHeight || pImg.height || 1;
      const minDim = Math.min(imgW, imgH);
      ctx.drawImage(pImg, (imgW - minDim) / 2, (imgH - minDim) / 2, minDim, minDim, photoX, photoY, photoSize, photoSize);
    } else {
      ctx.fillStyle = '#061711';
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
      ctx.fillStyle = '#4ade80';
      ctx.font = '800 72px "Bricolage Grotesque", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const init = (data.beneficiaireNom || 'Membre').trim().split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
      ctx.fillText(init, photoX + photoSize / 2, photoY + photoSize / 2);
    }
    ctx.restore();

    // Sous la photo : statut d'adhésion
    ctx.fillStyle = '#10b981';
    ctx.font = '700 10.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✓ ADHÉSION ENREGISTRÉE', photoX + photoSize / 2, photoY + photoSize + 25);

    // Colonne Centrale : Métadonnées Titulaire
    const infoX = 300;
    const infoY = 150;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillText('TITULAIRE DE LA CARTE', infoX, infoY + 10);

    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, (data.beneficiaireNom || 'Nom & Prénom').toUpperCase(), infoX, infoY + 44, 460, '"Bricolage Grotesque", sans-serif', 32, 20, '800');

    ctx.fillStyle = '#38bdf8';
    dessinerTexteAutoShrink(ctx, data.beneficiaireRole || 'Praticien de Terrain', infoX, infoY + 70, 460, '"Figtree", sans-serif', 15, 12, '600');

    // Grille 4 cellules d'informations
    const gridX = infoX;
    const gridY = infoY + 95;
    const gridW = 460;
    const gridH = 150;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(gridX, gridY, gridW, gridH, 14);
    ctx.fill();
    ctx.stroke();

    const c1 = gridX + 18;
    const c2 = gridX + gridW / 2 + 10;
    const r1 = gridY + 28;
    const r2 = gridY + 82;
    const r3 = gridY + 132;

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText('MATRICULE OFFICIEL', c1, r1);
    ctx.fillStyle = '#4ade80';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText(id, c1, r1 + 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText('DATE D’ADHÉSION', c2, r1);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillText(data.dateAdhesion || data.dateEmission || '15 Janvier 2026', c2, r1 + 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText('DOMAINE D’ENGAGEMENT', c1, r2);
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, data.domaine || 'Agronomie & Numérique', c1, r2 + 18, 200, '"Figtree", sans-serif', 12, 10, '600');

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText('RATTACHEMENT', c2, r2);
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, data.institution || 'TEAM Sahélia · Bénin', c2, r2 + 18, 200, '"Figtree", sans-serif', 12, 10, '600');

    // Slogan personnel
    ctx.fillStyle = '#a9c4b6';
    ctx.font = 'italic 11px "Figtree", sans-serif';
    dessinerTexteAutoShrink(ctx, `« ${data.slogan || 'Apprendre aujourd’hui. Construire demain.'} »`, c1, r3, gridW - 36, '"Figtree", sans-serif', 11, 9, '500');

    // Bloc QR Code (Droite)
    const qrSize = 150;
    const qrX = W - qrSize - 45;
    const qrY = 175;
    dessinerQR(ctx, qrX, qrY, qrSize, qrUrl, '#061711', '#ffffff');

    ctx.textAlign = 'center';
    ctx.fillStyle = '#4ade80';
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillText('SCANNER POUR AUDITER', qrX + qrSize / 2, qrY + qrSize + 22);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 8.5px "JetBrains Mono", monospace';
    ctx.fillText('Vérification W3C VC', qrX + qrSize / 2, qrY + qrSize + 36);

    // Pied de carte
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, H - 75);
    ctx.lineTo(W - 36, H - 75);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 12px "Figtree", sans-serif';
    ctx.fillText('ÉMIS PAR TEAM SAHÉLIA · COORDINATION GÉNÉRALE', 45, H - 42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 10.5px "Figtree", sans-serif';
    ctx.fillText('Ce titre atteste de l’appartenance communautaire et renvoie au registre officiel vérifiable.', 45, H - 24);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#4ade80';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillText(`verifier.html?id=${id}`, W - 45, H - 35);
  }

  // ---------------------------------------------------------------------------
  // 6. COMPOSITION 2 : ATTESTATION DE FORMATION VALIDÉE (CR80 · 1012 × 638 PX)
  // ---------------------------------------------------------------------------
  function dessinerAttestationFormationCR80(ctx, W, H, data) {
    const id = data.id || 'TS-FOR-2026-001';
    const qrUrl = `https://aremouolivier-ops.github.io/site-team-sahelia/verifier.html?id=${encodeURIComponent(id)}`;

    // Fond bleu nuit académique sobre
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#061320');
    grad.addColorStop(0.5, '#0b2138');
    grad.addColorStop(1, '#0e2d4d');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 24);
    ctx.fill();

    // Bordure académique or & argent
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(8, 8, W - 16, H - 16, 20);
    ctx.stroke();

    // En-tête
    dessinerLogo(ctx, 80, 26);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#38bdf8';
    ctx.font = '800 12px "JetBrains Mono", monospace';
    ctx.fillText('PÔLE PÉDAGOGIQUE & FORMATION CONTINUE', 180, 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 18px "Bricolage Grotesque", sans-serif';
    ctx.fillText('ATTESTATION DE VALIDATION DE FORMATION', 180, 72);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11.5px "Figtree", sans-serif';
    ctx.fillText('Certification des Acquis Pratiques & Travaux Dirigés sur Cas Réels', 180, 92);

    // Statut de validation (Haut Droit)
    const statutTxt = (data.statut === 'termine') ? 'FORMATION ACHEVÉE · VALIDÉE' : 'EN COURS D’APPRENTISSAGE';
    const statutColor = (data.statut === 'termine') ? '#4ade80' : '#fbbf24';

    ctx.font = '800 10.5px "Figtree", sans-serif';
    const statW = ctx.measureText(statutTxt).width + 30;
    const statX = W - statW - 45;
    const statY = 40;

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeStyle = statutColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(statX, statY, statW, 30, 15);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = statutColor;
    ctx.textAlign = 'center';
    ctx.fillText(statutTxt, statX + statW / 2, statY + 19);

    // Ligne
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 125);
    ctx.lineTo(W - 36, 125);
    ctx.stroke();

    // Corps de l'attestation
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 13px "Figtree", sans-serif';
    ctx.fillText('Il est officiellement certifié que :', 55, 160);

    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, (data.beneficiaireNom || 'Nom de l’Apprenant').toUpperCase(), 55, 198, 650, '"Bricolage Grotesque", sans-serif', 32, 22, '800');

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 13px "Figtree", sans-serif';
    ctx.fillText('a suivi et validé avec succès l’ensemble des modules pratiques et travaux de terrain du programme :', 55, 230);

    // Boîte du Programme Validé
    const coursX = 55;
    const coursY = 248;
    const coursW = 680;
    const coursH = 55;

    ctx.fillStyle = 'rgba(37, 99, 235, 0.15)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(coursX, coursY, coursW, coursH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, (data.titre || 'Formation TEAM Sahélia').toUpperCase(), coursX + 20, coursY + 34, coursW - 40, '"Bricolage Grotesque", sans-serif', 18, 13, '800');

    // Grille 4 métadonnées pédagogiques
    const pGridX = 55;
    const pGridY = 325;
    const pGridW = 680;
    const pGridH = 175;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(pGridX, pGridY, pGridW, pGridH, 14);
    ctx.fill();
    ctx.stroke();

    const pc1 = pGridX + 20;
    const pc2 = pGridX + pGridW / 2 + 10;
    const pr1 = pGridY + 30;
    const pr2 = pGridY + 90;
    const pr3 = pGridY + 145;

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10.5px "Figtree", sans-serif';
    ctx.fillText('COHORTE ACADÉMIQUE', pc1, pr1);
    ctx.fillStyle = '#38bdf8';
    dessinerTexteAutoShrink(ctx, data.cohorteNom || 'Cohorte Pilote', pc1, pr1 + 20, 300, '"Figtree", sans-serif', 14, 11, '700');

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10.5px "Figtree", sans-serif';
    ctx.fillText('PÉRIODE & VOLUME', pc2, pr1);
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, `${data.periode || '2026'} · ${data.volumeHoraire || '40h de pratique'}`, pc2, pr1 + 20, 300, '"Figtree", sans-serif', 13, 11, '700');

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10.5px "Figtree", sans-serif';
    ctx.fillText('FORMATEUR RÉFÉRENT', pc1, pr2);
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, data.formateur || 'Équipe Pédagogique TEAM Sahélia', pc1, pr2 + 20, 300, '"Figtree", sans-serif', 13, 11, '700');

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10.5px "Figtree", sans-serif';
    ctx.fillText('MENTION D’ÉVALUATION', pc2, pr2);
    ctx.fillStyle = '#4ade80';
    dessinerTexteAutoShrink(ctx, data.mention || 'Excellence Technique', pc2, pr2 + 20, 300, '"Figtree", sans-serif', 13.5, 11, '700');

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 11px "Figtree", sans-serif';
    dessinerTexteAutoShrink(ctx, `Matricule Certifié : ${id} · Date d’émission : ${data.dateEmission || '2026'}`, pc1, pr3, pGridW - 40, '"JetBrains Mono", monospace', 11, 9, '600');

    // QR Code (Droite)
    const qrSize = 160;
    const qrX = W - qrSize - 45;
    const qrY = 190;
    dessinerQR(ctx, qrX, qrY, qrSize, qrUrl, '#061726', '#ffffff');

    ctx.textAlign = 'center';
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillText('VÉRIFICATION W3C LIVE', qrX + qrSize / 2, qrY + qrSize + 22);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 8.5px "JetBrains Mono", monospace';
    ctx.fillText('Attestation Infalsifiable', qrX + qrSize / 2, qrY + qrSize + 36);

    // Pied
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, H - 75);
    ctx.lineTo(W - 36, H - 75);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 12px "Figtree", sans-serif';
    ctx.fillText('CONSEIL PÉDAGOGIQUE & COORDINATION DE FORMATION', 45, H - 42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 10.5px "Figtree", sans-serif';
    ctx.fillText('Délivré sous mandat de transmission libre des savoirs et d’excellence technique.', 45, H - 24);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillText(`verifier.html?id=${id}`, W - 45, H - 35);
  }

  // ---------------------------------------------------------------------------
  // 7. COMPOSITION 3 : HOMOLOGATION DE COMPÉTENCE TECHNIQUE (CR80 · 1012 × 638 PX)
  // ---------------------------------------------------------------------------
  function dessinerCarteCompetenceCR80(ctx, W, H, data) {
    const id = data.id || 'TS-SKL-2026-001';
    const qrUrl = `https://aremouolivier-ops.github.io/site-team-sahelia/verifier.html?id=${encodeURIComponent(id)}`;
    const accentCol = data.accentColor || '#5fd0a0';

    // Fond vert ardoise technique
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#061711');
    grad.addColorStop(0.5, '#0b261d');
    grad.addColorStop(1, '#0f3327');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 24);
    ctx.fill();

    // Liseré métallique
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(8, 8, W - 16, H - 16, 20);
    ctx.stroke();

    // En-tête
    dessinerLogo(ctx, 80, 26);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = accentCol;
    ctx.font = '800 12px "JetBrains Mono", monospace';
    ctx.fillText('PÔLE CERTIFICATION & HOMOLOGATION DE COMPÉTENCES', 180, 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 18px "Bricolage Grotesque", sans-serif';
    ctx.fillText('TITRE OFFICIEL DE COMPÉTENCE CERTIFIÉE', 180, 72);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11.5px "Figtree", sans-serif';
    ctx.fillText('Évaluation Rigoureuse sur Livrable Réel de Terrain & Projet Appliqué', 180, 92);

    // Pilule Niveau
    const nivTxt = (data.niveau || 'Pratique Validée').toUpperCase();
    ctx.font = '800 11px "Figtree", sans-serif';
    const nivW = ctx.measureText(nivTxt).width + 32;
    const nivX = W - nivW - 45;
    const nivY = 40;

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(nivX, nivY, nivW, 30, 15);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = accentCol;
    ctx.textAlign = 'center';
    ctx.fillText('● ' + nivTxt, nivX + nivW / 2, nivY + 19);

    // Ligne
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 125);
    ctx.lineTo(W - 36, 125);
    ctx.stroke();

    // Compétence Homologuée en Vedette (Bandeau Majeur)
    const bandeauX = 45;
    const bandeauY = 145;
    const bandeauW = W - 90;
    const bandeauH = 68;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bandeauX, bandeauY, bandeauW, bandeauH, 14);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = accentCol;
    ctx.font = '800 10.5px "JetBrains Mono", monospace';
    ctx.fillText('COMPÉTENCE HOMOLOGUÉE :', bandeauX + 20, bandeauY + 24);

    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, (data.titre || 'Praticien SIG & Cartographie QGIS').toUpperCase(), bandeauX + 20, bandeauY + 52, bandeauW - 40, '"Bricolage Grotesque", sans-serif', 22, 14, '800');

    // Colonne Gauche : Titulaire & Preuve de projet
    const cX = 45;
    const cY = 235;

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10.5px "JetBrains Mono", monospace';
    ctx.fillText('TITULAIRE DU TITRE', cX, cY + 10);

    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, (data.beneficiaireNom || 'Titulaire Officiel').toUpperCase(), cX, cY + 40, 480, '"Bricolage Grotesque", sans-serif', 28, 18, '800');

    ctx.fillStyle = accentCol;
    dessinerTexteAutoShrink(ctx, data.beneficiaireRole || 'Praticien Certifié', cX, cY + 64, 480, '"Figtree", sans-serif', 14.5, 12, '600');

    // Boîte Réalisation & Validateur
    const cBoxX = cX;
    const cBoxY = cY + 84;
    const cBoxW = 680;
    const cBoxH = 150;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(cBoxX, cBoxY, cBoxW, cBoxH, 14);
    ctx.fill();
    ctx.stroke();

    const cc1 = cBoxX + 18;
    const cc2 = cBoxX + cBoxW / 2 + 10;
    const cr1 = cBoxY + 26;
    const cr2 = cBoxY + 76;
    const cr3 = cBoxY + 126;

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText('MATRICULE DU TITRE', cc1, cr1);
    ctx.fillStyle = accentCol;
    ctx.font = '700 13.5px "JetBrains Mono", monospace';
    ctx.fillText(id, cc1, cr1 + 18);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText('DATE D’ÉMISSION', cc2, cr1);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 12.5px "JetBrains Mono", monospace';
    ctx.fillText(data.dateEmission || '2026', cc2, cr1 + 18);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText('AUTORITÉ D’ÉVALUATION', cc1, cr2);
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, data.validePar || 'Conseil Pédagogique TEAM Sahélia', cc1, cr2 + 18, 300, '"Figtree", sans-serif', 12.5, 10, '600');

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText('DOMAINE TECHNIQUE', cc2, cr2);
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, data.domaine || 'Géomatique & Numérique', cc2, cr2 + 18, 300, '"Figtree", sans-serif', 12.5, 10, '600');

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 11px "Figtree", sans-serif';
    const preuveTxt = data.preuveProjet ? `Projet vérifié : ${data.preuveProjet}` : `« ${data.slogan || 'La donnée et le terrain au service de l’impact.'} »`;
    dessinerTexteAutoShrink(ctx, preuveTxt, cc1, cr3, cBoxW - 36, '"Figtree", sans-serif', 11, 9, '500');

    // QR Code (Droite)
    const qrSize = 160;
    const qrX = W - qrSize - 45;
    const qrY = 240;
    dessinerQR(ctx, qrX, qrY, qrSize, qrUrl, '#061711', '#ffffff');

    ctx.textAlign = 'center';
    ctx.fillStyle = accentCol;
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillText('SCANNER POUR AUDITER', qrX + qrSize / 2, qrY + qrSize + 22);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 8.5px "JetBrains Mono", monospace';
    ctx.fillText('Verifiable Credential W3C', qrX + qrSize / 2, qrY + qrSize + 36);

    // Pied
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, H - 75);
    ctx.lineTo(W - 36, H - 75);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 12px "Figtree", sans-serif';
    ctx.fillText('ÉMIS PAR TEAM SAHÉLIA · COORDINATION GÉNÉRALE', 45, H - 42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 10.5px "Figtree", sans-serif';
    ctx.fillText('Aperçu visuel d’accompagnement. Seul le Verifiable Credential W3C fait juridiquement foi.', 45, H - 24);

    ctx.textAlign = 'right';
    ctx.fillStyle = accentCol;
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillText(`verifier.html?id=${id}`, W - 45, H - 35);
  }

  // ---------------------------------------------------------------------------
  // 8. ROUTEUR GÉNÉRAL DE RENDU SUR CANVAS
  // ---------------------------------------------------------------------------
  function genererBadgeSurCanvas(canvas, options) {
    if (!canvas) return;
    const {
      format = 'insigne', // 'insigne' | 'paysage' | 'vertical' | 'carre'
      data = {}
    } = options || {};

    const ctx = canvas.getContext('2d');
    let W = 800;
    let H = 800;

    if (format === 'paysage') {
      // Norme ISO/IEC 7810 ID-1 (CR80) : 85.60 mm × 53.98 mm (Ratio 1.5862:1)
      W = 1012;
      H = 638;
    } else if (format === 'carre') {
      W = 1080;
      H = 1080;
    } else if (format === 'vertical') {
      W = 720;
      H = 1150;
    }

    canvas.width = W;
    canvas.height = H;

    if (format === 'paysage') {
      const type = data.type || (options && options.type);
      const famille = data.famille;
      if (type === 'formation' || famille === 'formation') {
        dessinerAttestationFormationCR80(ctx, W, H, data);
      } else if (type === 'membre' || famille === 'appartenance') {
        dessinerCarteMembreCR80(ctx, W, H, data);
      } else {
        dessinerCarteCompetenceCR80(ctx, W, H, data);
      }
    } else {
      dessinerInsigneOpenBadge(ctx, W, H, data);
    }
  }

  // ---------------------------------------------------------------------------
  // 9. INTÉGRATIONS EXTERNES : LINKEDIN & W3C OPEN BADGES 3.0 EXPORT
  // ---------------------------------------------------------------------------
  function genererLienLinkedIn(data) {
    const titre = encodeURIComponent(data.titre || 'Certification TEAM Sahélia');
    const certId = encodeURIComponent(data.id || 'TS-OFFICIEL');
    const certUrl = encodeURIComponent(`https://aremouolivier-ops.github.io/site-team-sahelia/verifier.html?id=${certId}`);
    const orgName = encodeURIComponent('TEAM Sahélia');

    let year = 2026;
    let month = 1;

    if (data.validFrom) {
      const d = new Date(data.validFrom);
      if (!isNaN(d.getTime())) {
        year = d.getUTCFullYear();
        month = d.getUTCMonth() + 1;
      }
    } else if (data.dateEmission) {
      const mMatch = data.dateEmission.match(/(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\s+(\d{4})/i);
      if (mMatch) {
        const moisNoms = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const idx = moisNoms.findIndex(m => m.startsWith(mMatch[1].toLowerCase().slice(0, 3)));
        if (idx !== -1) month = idx + 1;
        year = parseInt(mMatch[2], 10);
      }
    }

    return `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${titre}&organizationName=${orgName}&issueYear=${year}&issueMonth=${month}&certUrl=${certUrl}&certId=${certId}`;
  }

  function exporterOpenBadgeJSONLD(data) {
    const certId = data.id || 'TS-SKL-2026-001';
    const baseUrl = 'https://aremouolivier-ops.github.io/site-team-sahelia';
    const validFrom = data.validFrom || new Date().toISOString();
    const trackCode = data.track || data.code || 'sig';

    return {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://purl.imsglobal.org/spec/ob/v3p0/context.json"
      ],
      "id": `${baseUrl}/credentials/${certId}.json`,
      "type": [
        "VerifiableCredential",
        "OpenBadgeCredential"
      ],
      "issuer": {
        "id": `${baseUrl}/issuers/team-sahelia.json`,
        "type": ["Profile"],
        "name": "TEAM Sahélia",
        "url": baseUrl,
        "email": "teamsahelia@gmail.com"
      },
      "validFrom": validFrom,
      "name": data.titre || "Certification TEAM Sahélia",
      "description": data.slogan || "Titre officiel certifié par TEAM Sahélia.",
      "credentialSubject": {
        "id": `did:key:${certId}`,
        "type": ["AchievementSubject"],
        "name": data.beneficiaireNom || "Membre Certifié",
        "role": data.beneficiaireRole || "Praticien",
        "achievement": {
          "id": `${baseUrl}/achievements/${trackCode}.json`,
          "type": ["Achievement"],
          "name": data.titre || "Compétence TEAM Sahélia",
          "criteria": {
            "narrative": (data.criteres && data.criteres.length) ? data.criteres.join(' ; ') : "Maîtrise des standards techniques de terrain."
          }
        }
      }
    };
  }

  // Export global
  window.BadgeEngine = {
    FormesGeometriques,
    IconesVectorielles,
    dessinerTexteAutoShrink,
    genererBadgeSurCanvas,
    dessinerInsigneOpenBadge,
    dessinerCarteMembreCR80,
    dessinerAttestationFormationCR80,
    dessinerCarteCompetenceCR80,
    genererLienLinkedIn,
    exporterOpenBadgeJSONLD
  };
})();