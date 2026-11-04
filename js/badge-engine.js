/**
 * TEAM Sahélia — Moteur de Rendu Graphique HD de Badges & Insignes Vectoriels (Canvas 2D)
 * 100% Déclaratif · Conforme W3C Open Badges 3.0 · Zéro stéréotype · Tracé vectoriel pur
 */

(function () {
  'use strict';

  // Polyfill universel roundRect pour Canvas
  if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (typeof r === 'undefined') r = 0;
      if (typeof r === 'number') r = [r, r, r, r];
      const rad = Array.isArray(r) ? r[0] : 0;
      this.beginPath();
      this.moveTo(x + rad, y);
      this.arcTo(x + w, y, x + w, y + h, rad);
      this.arcTo(x + w, y + h, x, y + h, rad);
      this.arcTo(x, y + h, x, y, rad);
      this.arcTo(x, y, x + w, y, rad);
      this.closePath();
      return this;
    };
  }

  // ---------------------------------------------------------------------------
  // 1. TRACÉS VECTORIELS DES FORMES GÉOMÉTRIQUES OPEN BADGES 3.0
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
    }
  };

  // ---------------------------------------------------------------------------
  // 2. ICÔNES VECTORIELLES MÉTIERS (ZÉRO EMOJI / 100% CANEVAS)
  // ---------------------------------------------------------------------------
  const IconesVectorielles = {
    agronomie(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.5, size * 0.08);
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
      ctx.restore();
    },

    sig(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.5, size * 0.09);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const r = size * 0.35;
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.4, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.4, r * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx - r * 0.8, cy);
      ctx.lineTo(cx, cy + r * 1.3);
      ctx.lineTo(cx + r * 0.8, cy);
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
      ctx.beginPath();
      ctx.moveTo(cx - s, cy - s * 0.6);
      ctx.lineTo(cx + s, cy + s * 0.6);
      ctx.moveTo(cx + s, cy - s * 0.6);
      ctx.lineTo(cx - s, cy + s * 0.6);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#061711';
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.16, 0, Math.PI * 2);
      ctx.fill();

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

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
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
      ctx.beginPath();
      ctx.roundRect(cx - s * 0.65, cy - s * 0.65, s * 1.3, s * 1.3, s * 0.15);
      ctx.stroke();

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
    }
  };

  // ---------------------------------------------------------------------------
  // 3. FONCTIONS UTILITAIRES DE RENDU (TEXT SHRINk, LOGO & QR)
  // ---------------------------------------------------------------------------
  function dessinerTexteAutoShrink(ctx, texte, x, y, maxLargeur, fontFamille, tailleMax, tailleMin = 12, poids = '700') {
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
    ctx.fillRect(x - 6, y - 6, size + 12, size + 12);
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 6, y - 6, size + 12, size + 12);

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
    ctx.fillText('QR CODE', x + size / 2, y + size / 2);
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

    ctx.font = '800 28px "Bricolage Grotesque", sans-serif';
    ctx.fillText('SAHÉLIA', cx, cy + 76);
    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // 4. RENDU 1 : L'INSIGNE OPEN BADGE 3.0 HD (800 × 800)
  // ---------------------------------------------------------------------------
  function dessinerInsigneOpenBadge(ctx, W, H, data) {
    const cx = W / 2;
    const cy = H * 0.43;
    const r = Math.min(W, H) * 0.35;

    const track = data.track || 'pionnier';
    const forme = data.formeGeometrique || 'pentagone';
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

    // Halo d'aura lumineuse
    const aura = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.25);
    aura.addColorStop(0, accent + '33');
    aura.addColorStop(0.7, accent + '0d');
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // Traceur de forme selon géométrie
    function tracer(rayonMult) {
      if (forme === 'hexagone') {
        FormesGeometriques.hexagone(ctx, cx, cy, r * rayonMult);
      } else if (forme === 'ecusson') {
        FormesGeometriques.ecusson(ctx, cx, cy, r * 1.8 * rayonMult, r * 2.1 * rayonMult);
      } else if (forme === 'octogone') {
        FormesGeometriques.octogone(ctx, cx, cy, r * rayonMult);
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
    ctx.shadowColor = accent;
    ctx.shadowBlur = 24;
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
    } else if (track === 'vibe') {
      IconesVectorielles.ia(ctx, cx, cy - 25, 115, accent);
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
    ctx.font = '800 12px "JetBrains Mono", monospace';
    ctx.fillText('TEAM SAHÉLIA · PANAFRICAIN', cx, cy - r * 0.58);

    // Ruban de Niveau (bas de l'insigne)
    const rubanW = r * 1.55;
    const rubanH = 34;
    const rubanY = cy + r * 0.42;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.strokeStyle = gradMetal;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - rubanW / 2, rubanY, rubanW, rubanH, 17);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 12px "Figtree", sans-serif';
    dessinerTexteAutoShrink(ctx, niveau.toUpperCase(), cx, rubanY + 22, rubanW - 20, '"Figtree", sans-serif', 12, 9, '800');

    // Section Récipient & Identité W3C (Sous l'insigne)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(cx - 160, H - 150, 320, 1);

    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, nom || 'TITULAIRE DU BADGE', cx, H - 118, W - 80, '"Bricolage Grotesque", sans-serif', 26, 16, '800');

    ctx.fillStyle = '#a9c4b6';
    dessinerTexteAutoShrink(ctx, data.beneficiaireRole || titre, cx, H - 94, W - 100, '"Figtree", sans-serif', 13, 11, '600');

    ctx.fillStyle = accent;
    ctx.font = '700 11.5px "JetBrains Mono", monospace';
    ctx.fillText(`ID : ${id}`, cx, H - 72);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.fillText('W3C VERIFIABLE CREDENTIAL · OPEN BADGES 3.0', cx, H - 52);
  }

  // ---------------------------------------------------------------------------
  // 5. RENDU 2 : FORMAT PAYSAGE CR80 (1000 × 500 PX)
  // ---------------------------------------------------------------------------
  function dessinerBadgePaysage(ctx, W, H, data) {
    const accentCol = data.accentColor || '#5fd0a0';
    const id = data.id || 'TS-OFFICIEL';
    const qrUrl = `https://aremouolivier-ops.github.io/site-team-sahelia/verifier.html?id=${encodeURIComponent(id)}`;

    // Fond dégradé vert profond / bleu nuit
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#061711');
    grad.addColorStop(1, '#0d2e23');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 20);
    ctx.fill();

    ctx.strokeStyle = '#23654b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(6, 6, W - 12, H - 12, 18);
    ctx.stroke();

    // En-tête : Logo + Slogan
    dessinerLogo(ctx, 80, 24);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = accentCol;
    ctx.font = '800 12px "Figtree", sans-serif';
    ctx.fillText('APPRENDRE. CRÉER. INNOVER.', 180, 42);

    ctx.fillStyle = '#a9c4b6';
    ctx.font = '500 11px "Figtree", sans-serif';
    ctx.fillText('TEAM Sahélia · Communauté Panafricaine', 180, 62);

    // QR Code scannable en haut à droite
    const qrSize = 96;
    const qrX = W - 140;
    const qrY = 18;
    dessinerQR(ctx, qrX, qrY, qrSize, qrUrl, '#06130e', '#ffffff');

    ctx.textAlign = 'center';
    ctx.fillStyle = accentCol;
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillText('SCANNER POUR VÉRIFIER', qrX + qrSize / 2, qrY + qrSize + 16);

    // Ligne de démarcation
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 136);
    ctx.lineTo(W - 36, 136);
    ctx.stroke();

    // Photo ou Initiales avec cadre universel (zéro distinction de genre)
    const photoX = 45;
    const photoY = 155;
    const photoSize = 190;
    const cx = photoX + photoSize / 2;
    const cy = photoY + photoSize / 2;

    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(photoX - 2, photoY - 2, photoSize + 4, photoSize + 4, 18);
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoSize, photoSize, 16);
    ctx.clip();

    if (data.photoImg) {
      const pImg = data.photoImg;
      const imgW = pImg.naturalWidth || pImg.width || 1;
      const imgH = pImg.naturalHeight || pImg.height || 1;
      const minDim = Math.min(imgW, imgH);
      ctx.drawImage(pImg, (imgW - minDim) / 2, (imgH - minDim) / 2, minDim, minDim, photoX, photoY, photoSize, photoSize);
    } else {
      ctx.fillStyle = '#081e16';
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
      ctx.fillStyle = accentCol;
      ctx.font = '800 64px "Bricolage Grotesque", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const init = (data.beneficiaireNom || 'Membre').trim().split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
      ctx.fillText(init, cx, cy);
    }
    ctx.restore();

    // Colonne Titulaire & Métadonnées réelles
    const infoX = 265;
    const infoY = 155;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, (data.beneficiaireNom || 'Titulaire Officiel').toUpperCase(), infoX, infoY + 28, W - infoX - 45, '"Bricolage Grotesque", sans-serif', 28, 18, '800');

    // Pilule niveau
    const pillTxt = (data.niveau || 'Pratique Validée').toUpperCase();
    ctx.font = '800 11px "Figtree", sans-serif';
    const pillW = ctx.measureText(pillTxt).width + 30;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(infoX, infoY + 42, pillW, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = accentCol;
    ctx.textAlign = 'center';
    ctx.fillText('● ' + pillTxt, infoX + pillW / 2, infoY + 59);

    // Grille 4 métadonnées
    const gridX = infoX;
    const gridY = infoY + 80;
    const gridW = W - infoX - 45;
    const gridH = 115;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(gridX, gridY, gridW, gridH, 14);
    ctx.fill();
    ctx.stroke();

    const col1X = gridX + 16;
    const col2X = gridX + gridW / 2 + 10;
    const row1Y = gridY + 22;
    const row2Y = gridY + 72;

    // Métadonnée 1 : Compétence
    ctx.textAlign = 'left';
    ctx.fillStyle = '#a9c4b6';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText('COMPÉTENCE VALIDÉE', col1X, row1Y);
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, data.titre || 'Spécialité Validée', col1X, row1Y + 19, gridW / 2 - 25, '"Figtree", sans-serif', 13, 10, '700');

    // Métadonnée 2 : Matricule
    ctx.fillStyle = '#a9c4b6';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText('MATRICULE OFFICIEL', col2X, row1Y);
    ctx.fillStyle = accentCol;
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillText(id, col2X, row1Y + 19);

    // Métadonnée 3 : Rôle
    ctx.fillStyle = '#a9c4b6';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText('RÔLE DU TITULAIRE', col1X, row2Y);
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, data.beneficiaireRole || 'Praticien de Terrain', col1X, row2Y + 19, gridW / 2 - 25, '"Figtree", sans-serif', 13, 10, '700');

    // Métadonnée 4 : Date
    ctx.fillStyle = '#a9c4b6';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText('DATE D’ÉMISSION', col2X, row2Y);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 12.5px "JetBrains Mono", monospace';
    ctx.fillText(data.dateEmission || '15 Janvier 2026', col2X, row2Y + 19);

    // Pied de carte
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 422);
    ctx.lineTo(W - 36, 422);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 11.5px "Figtree", sans-serif';
    ctx.fillText('CONSEIL ACADÉMIQUE TEAM SAHÉLIA', 45, 448);

    ctx.fillStyle = accentCol;
    ctx.font = 'italic 11px "Figtree", sans-serif';
    dessinerTexteAutoShrink(ctx, `« ${data.slogan || 'Apprendre aujourd’hui. Construire demain.'} »`, 45, 468, 500, '"Figtree", sans-serif', 11, 9, '500');

    ctx.textAlign = 'right';
    ctx.fillStyle = '#eaf4ee';
    ctx.font = '700 11px "Figtree", sans-serif';
    ctx.fillText('W3C Open Badges 3.0 Verified', W - 45, 448);

    ctx.fillStyle = '#5fd0a0';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillText(`verifier.html?id=${id}`, W - 45, 468);
  }

  // ---------------------------------------------------------------------------
  // 6. ROUTEUR GÉNÉRAL DE RENDU SUR CANVAS
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
      W = 1000;
      H = 500;
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
      dessinerBadgePaysage(ctx, W, H, data);
    } else {
      // Par défaut ou format insigne/carré : Rendu Insigne HD W3C
      dessinerInsigneOpenBadge(ctx, W, H, data);
    }
  }

  // ---------------------------------------------------------------------------
  // 7. INTÉGRATIONS EXTERNES : LINKEDIN AVEC DATES RÉELLES & W3C EXPORT
  // ---------------------------------------------------------------------------
  function genererLienLinkedIn(data) {
    const titre = encodeURIComponent(data.titre || 'Certification TEAM Sahélia');
    const certId = encodeURIComponent(data.id || 'TS-OFFICIEL');
    const certUrl = encodeURIComponent(`https://aremouolivier-ops.github.io/site-team-sahelia/verifier.html?id=${certId}`);
    const orgName = encodeURIComponent('TEAM Sahélia');

    // Extraction de la véritable date d'émission (Année et Mois)
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
            "narrative": (data.criteres && data.criteres.length) ? data.criteres.join(' ; ') : "Maîtrise des standards techniques."
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
    dessinerBadgePaysage,
    genererLienLinkedIn,
    exporterOpenBadgeJSONLD
  };
})();
