/**
 * TEAM Sahélia - Moteur Officiel de Génération de Badges HD (Canvas 2D)
 * 
 * 1. Prend en charge les 3 types de badges :
 *    - Type 1 : Badge de Membre (Appartenance vert profond)
 *    - Type 2 : Badge de Formation / Cohorte (Accent bleu, données de cohorte & statut explicite)
 *    - Type 3 : Badge de Compétence / Réalisation (Variante claire prestigieuse, critères réels)
 * 2. Formats :
 *    - Tour de cou vertical (720 × 1150 px)
 *    - Carré réseaux sociaux (1080 × 1080 px)
 * 3. Icônes vectorielles pures dessinées sur Canvas (Zéro carré / caractère manquant)
 * 4. QR Code 100% scannable via qrcode.min.js pointant vers verifier.html
 */

(function () {
  'use strict';

  // Polyfill roundRect
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
  // 1. DESSIN VECTORIEL D'ICÔNES PURS (AUCUN EMOJI / ZÉRO BUG DE GLYPHES)
  // ---------------------------------------------------------------------------
  const IconesVectorielles = {
    // 🌿 Feuille agronomie
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

      // Nervure centrale
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.8, cy + s * 0.8);
      ctx.quadraticCurveTo(cx, cy, cx + s * 0.9, cy - s * 0.9);
      ctx.stroke();
      ctx.restore();
    },

    // 📍 Punaise géomatique / SIG
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

      // Pointe
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.8, cy);
      ctx.lineTo(cx, cy + r * 1.3);
      ctx.lineTo(cx + r * 0.8, cy);
      ctx.stroke();
      ctx.restore();
    },

    // </> Balises Code & Tech
    code(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(2, size * 0.1);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const w = size * 0.45;
      const h = size * 0.35;

      // <
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.3, cy - h);
      ctx.lineTo(cx - w * 0.9, cy);
      ctx.lineTo(cx - w * 0.3, cy + h);
      ctx.stroke();

      // >
      ctx.beginPath();
      ctx.moveTo(cx + w * 0.3, cy - h);
      ctx.lineTo(cx + w * 0.9, cy);
      ctx.lineTo(cx + w * 0.3, cy + h);
      ctx.stroke();

      // /
      ctx.beginPath();
      ctx.moveTo(cx + w * 0.2, cy - h * 1.1);
      ctx.lineTo(cx - w * 0.2, cy + h * 1.1);
      ctx.stroke();
      ctx.restore();
    },

    // 👥 Silhouettes communauté
    communaute(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.5, size * 0.08);
      ctx.lineCap = 'round';

      const r = size * 0.2;
      // Tête principale
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.6, r, 0, Math.PI * 2);
      ctx.stroke();

      // Épaules principales
      ctx.beginPath();
      ctx.arc(cx, cy + r * 1.2, r * 1.4, Math.PI, 0, false);
      ctx.stroke();

      // Tête secondaire
      ctx.beginPath();
      ctx.arc(cx - r * 1.3, cy - r * 0.3, r * 0.7, 0, Math.PI * 2);
      ctx.stroke();

      // Tête tertiaire
      ctx.beginPath();
      ctx.arc(cx + r * 1.3, cy - r * 0.3, r * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    },

    // 🎓 Chapeau académique (Formation)
    chapeau(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.09);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const w = size * 0.6;
      const h = size * 0.3;

      // Losange supérieur
      ctx.beginPath();
      ctx.moveTo(cx, cy - h);
      ctx.lineTo(cx + w, cy - h * 0.2);
      ctx.lineTo(cx, cy + h * 0.6);
      ctx.lineTo(cx - w, cy - h * 0.2);
      ctx.closePath();
      ctx.stroke();

      // Calotte inférieure
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.55, cy + h * 0.1);
      ctx.quadraticCurveTo(cx, cy + h * 1.1, cx + w * 0.55, cy + h * 0.1);
      ctx.stroke();

      // Gland de mortier
      ctx.beginPath();
      ctx.moveTo(cx + w * 0.8, cy);
      ctx.lineTo(cx + w * 0.9, cy + h * 0.8);
      ctx.stroke();
      ctx.restore();
    },

    // 🏆 Trophée / Médaille de Compétence
    trophee(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.09);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const w = size * 0.45;
      const h = size * 0.5;

      // Coupe
      ctx.beginPath();
      ctx.moveTo(cx - w, cy - h);
      ctx.lineTo(cx + w, cy - h);
      ctx.lineTo(cx + w * 0.7, cy + h * 0.1);
      ctx.quadraticCurveTo(cx, cy + h * 0.5, cx - w * 0.7, cy + h * 0.1);
      ctx.closePath();
      ctx.stroke();

      // Pied
      ctx.beginPath();
      ctx.moveTo(cx, cy + h * 0.4);
      ctx.lineTo(cx, cy + h * 0.8);
      ctx.moveTo(cx - w * 0.6, cy + h * 0.8);
      ctx.lineTo(cx + w * 0.6, cy + h * 0.8);
      ctx.stroke();

      // Anses
      ctx.beginPath();
      ctx.arc(cx - w * 0.9, cy - h * 0.4, w * 0.35, Math.PI * 0.5, Math.PI * 1.5, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + w * 0.9, cy - h * 0.4, w * 0.35, Math.PI * 1.5, Math.PI * 0.5, false);
      ctx.stroke();
      ctx.restore();
    },

    // 🛡️ Sceau de validation officielle
    sceau(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.09);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const s = size * 0.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - s);
      ctx.lineTo(cx + s * 0.8, cy - s * 0.5);
      ctx.lineTo(cx + s * 0.8, cy + s * 0.2);
      ctx.quadraticCurveTo(cx, cy + s, cx, cy + s);
      ctx.quadraticCurveTo(cx, cy + s, cx - s * 0.8, cy + s * 0.2);
      ctx.lineTo(cx - s * 0.8, cy - s * 0.5);
      ctx.closePath();
      ctx.stroke();

      // Coche interne ✓
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.35, cy);
      ctx.lineTo(cx - s * 0.05, cy + s * 0.3);
      ctx.lineTo(cx + s * 0.45, cy - s * 0.25);
      ctx.stroke();
      ctx.restore();
    },

    // 🚁 Drone quadricoptère (Télédétection & Agriculture de Précision)
    drone(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.08);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const s = size * 0.45;
      // Bras croisés
      ctx.beginPath();
      ctx.moveTo(cx - s, cy - s * 0.6);
      ctx.lineTo(cx + s, cy + s * 0.6);
      ctx.moveTo(cx + s, cy - s * 0.6);
      ctx.lineTo(cx - s, cy + s * 0.6);
      ctx.stroke();

      // Corps central du drone
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Lentille capteur centrale
      ctx.fillStyle = '#061711';
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.16, 0, Math.PI * 2);
      ctx.fill();

      // 4 rotors avec hélices
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

      // Ondes de scan multispectral vers le bas
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

    // ⚡ IA & Puce Microprocesseur (Vibe Coding & Solutions IA)
    ia(ctx, cx, cy, size, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = Math.max(1.8, size * 0.08);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const s = size * 0.42;

      // Puce carrée centrale
      ctx.beginPath();
      ctx.roundRect(cx - s * 0.65, cy - s * 0.65, s * 1.3, s * 1.3, s * 0.15);
      ctx.stroke();

      // Broches / Connecteurs (4 côtés)
      const pinLength = s * 0.3;
      [-0.35, 0, 0.35].forEach((offset) => {
        // Haut et Bas
        ctx.beginPath();
        ctx.moveTo(cx + offset * s, cy - s * 0.65);
        ctx.lineTo(cx + offset * s, cy - s * 0.65 - pinLength);
        ctx.moveTo(cx + offset * s, cy + s * 0.65);
        ctx.lineTo(cx + offset * s, cy + s * 0.65 + pinLength);
        ctx.stroke();

        // Gauche et Droite
        ctx.beginPath();
        ctx.moveTo(cx - s * 0.65, cy + offset * s);
        ctx.lineTo(cx - s * 0.65 - pinLength, cy + offset * s);
        ctx.moveTo(cx + s * 0.65, cy + offset * s);
        ctx.lineTo(cx + s * 0.65 + pinLength, cy + offset * s);
        ctx.stroke();
      });

      // Balises de code central </>
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
  };

  // ---------------------------------------------------------------------------
  // 1B. FORMES GÉOMÉTRIQUES VECTORIELLES OPEN BADGES 3.0
  // ---------------------------------------------------------------------------
  const FormesGeometriques = {
    // Pentagone régulier (Palier Bronze · Membre Pionnier)
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

    // Hexagone régulier (Palier Argent · Praticien SIG & Cartographie)
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

    // Écusson héraldique contemporain (Palier Or · Opérateur Drone)
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

    // Octogone biseauté technique (Palier Platine · Vibe Coding & IA)
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
  // 2. INTÉGRATION QR CODE 100% SCANNABLE (VIA QRCODE.MIN.JS)
  // ---------------------------------------------------------------------------
  function dessinerQRReel(ctx, x, y, size, payloadUrl, fgColor = '#0b2b24', bgColor = '#ffffff') {
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.fillRect(x - 8, y - 8, size + 16, size + 16);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 8, y - 8, size + 16, size + 16);

    const qrGenerator = typeof qrcode !== 'undefined' ? qrcode : (typeof window !== 'undefined' && window.qrcode ? window.qrcode : null);
    if (qrGenerator) {
      try {
        const qr = qrGenerator(0, 'M');
        qr.addData(payloadUrl);
        qr.make();
        const count = qr.getModuleCount();
        const cellSize = size / count;

        ctx.fillStyle = fgColor;
        for (let r = 0; r < count; r++) {
          for (let c = 0; c < count; c++) {
            if (qr.isDark(r, c)) {
              ctx.fillRect(x + c * cellSize, y + r * cellSize, cellSize + 0.35, cellSize + 0.35);
            }
          }
        }
      } catch (e) {
        console.warn('Erreur rendu QR code', e);
        fallbackQR(ctx, x, y, size, fgColor, bgColor);
      }
    } else {
      fallbackQR(ctx, x, y, size, fgColor, bgColor);
    }
    ctx.restore();
  }

  function fallbackQR(ctx, x, y, size, fg, bg) {
    ctx.fillStyle = fg;
    ctx.font = '700 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('QR CODE', x + size / 2, y + size / 2);
  }

  // ---------------------------------------------------------------------------
  // 3. LOGO OFFICIEL VECTORIEL
  // ---------------------------------------------------------------------------
  function dessinerLogo(ctx, cx, cy, isDark) {
    const textCol = isDark ? '#eaf4ee' : '#0b2b24';
    const subCol = isDark ? '#a9c4b6' : '#506e5f';

    // Soleil levant terracotta
    ctx.fillStyle = '#e8946a';
    ctx.beginPath();
    ctx.arc(cx, cy + 10, 36, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    // Barres d'horizon
    ctx.fillStyle = isDark ? '#ffffff' : '#f0f5f2';
    ctx.beginPath();
    ctx.roundRect(cx - 48, cy + 12, 96, 6, 3);
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.roundRect(cx - 34, cy + 22, 68, 5, 2.5);
    ctx.fill();

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(cx - 20, cy + 31, 40, 4, 2);
    ctx.fill();

    // Satellite bleu
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(cx + 34, cy - 12, 6, 0, Math.PI * 2);
    ctx.fill();

    // Typographie
    ctx.textAlign = 'center';
    ctx.fillStyle = textCol;
    ctx.font = '700 15px "Bricolage Grotesque", -apple-system, sans-serif';
    ctx.fillText('TEAM', cx, cy + 54);

    ctx.font = '800 34px "Bricolage Grotesque", -apple-system, sans-serif';
    ctx.fillText('SAHÉLIA', cx, cy + 86);

    ctx.fillStyle = subCol;
    ctx.font = '500 16px "Figtree", sans-serif';
    ctx.fillText('Apprendre. Créer. Innover.', cx, cy + 114);
  }

  // Barre des 4 icônes vectorielles du manifeste
  function dessinerBarreIcones(ctx, cx, cy, isDark) {
    const colIco = isDark ? '#5fd0a0' : '#0b5e3b';
    const colLbl = isDark ? '#a9c4b6' : '#5a7369';
    const colLine = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

    const items = [
      { key: 'agronomie', label: 'Agronomie' },
      { key: 'sig', label: 'SIG' },
      { key: 'code', label: 'Tech' },
      { key: 'communaute', label: 'Communauté' },
    ];

    const spacing = 135;
    const startX = cx - spacing * 1.5;

    ctx.textAlign = 'center';
    items.forEach((item, i) => {
      const curX = startX + i * spacing;
      if (i > 0) {
        ctx.strokeStyle = colLine;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(curX - spacing / 2, cy - 16);
        ctx.lineTo(curX - spacing / 2, cy + 24);
        ctx.stroke();
      }

      IconesVectorielles[item.key](ctx, curX, cy - 4, 26, colIco);

      ctx.fillStyle = colLbl;
      ctx.font = '600 13px "Figtree", sans-serif';
      ctx.fillText(item.label, curX, cy + 24);
    });
  }

  // Rubans ondulés signatures
  function dessinerVagues(ctx, W, H, prim, sec, acc) {
    ctx.fillStyle = acc;
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, H - 140);
    for (let x = 0; x <= W; x += 10) {
      const y = H - 130 + Math.sin(x * 0.008) * 35 + Math.cos(x * 0.004) * 20;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = sec;
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, H - 100);
    for (let x = 0; x <= W; x += 10) {
      const y = H - 90 + Math.sin((x + 120) * 0.009) * 30 + Math.sin(x * 0.003) * 15;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = prim;
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, H - 60);
    for (let x = 0; x <= W; x += 10) {
      const y = H - 55 + Math.sin((x + 280) * 0.007) * 28;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
  }

  // Helper pour dessiner du texte avec réduction dynamique de taille (anti-débordement)
  function dessinerTexteAutoShrink(ctx, texte, x, y, maxLargeur, fontFamille, tailleMax, tailleMin = 14, poids = '800') {
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

  // Helper pour calculer l'URL absolue de vérification
  function fabriquerUrlVerification(badgeId) {
    if (typeof window !== 'undefined' && window.location) {
      const loc = window.location;
      try {
        const customHost = localStorage.getItem('sahelia_domaine_verif');
        if (customHost) {
          const base = customHost.endsWith('/') ? customHost : customHost + '/';
          return base + 'verifier.html?id=' + encodeURIComponent(badgeId);
        }
      } catch (e) {}

      if (loc.protocol === 'file:') {
        const fullDir = loc.href.substring(0, loc.href.lastIndexOf('/') + 1);
        return fullDir + 'verifier.html?id=' + encodeURIComponent(badgeId);
      }
      const basePath = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
      return loc.origin + basePath + 'verifier.html?id=' + encodeURIComponent(badgeId);
    }
    return 'verifier.html?id=' + encodeURIComponent(badgeId);
  }

  // ---------------------------------------------------------------------------
  // 4. RENDU : BADGE TYPE 1 (MEMBRE DE LA COMMUNAUTÉ)
  // ---------------------------------------------------------------------------
  function dessinerBadgeMembre(ctx, W, H, format, data) {
    if (format === 'paysage') {
      dessinerBadgePaysage(ctx, W, H, 'membre', data);
      return;
    }
    const isCarre = format === 'carre';
    const accentCol = data.accentColor || '#5fd0a0';
    const bgDark = true;
    const badgeId = data.id || 'TS-MBR-2026-001';
    const qrUrl = fabriquerUrlVerification(badgeId);

    // Fond vert profond
    ctx.fillStyle = '#081a14';
    ctx.fillRect(0, 0, W, H);

    // Halo subtil
    const glow = ctx.createRadialGradient(W / 2, isCarre ? 450 : 380, 50, W / 2, isCarre ? 450 : 380, W * 0.6);
    glow.addColorStop(0, 'rgba(23, 112, 74, 0.4)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    if (isCarre) {
      // Grille décorative
      ctx.strokeStyle = 'rgba(95, 208, 160, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 60; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, H - 40); ctx.stroke();
      }
      for (let y = 60; y < H; y += 60) {
        ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W - 40, y); ctx.stroke();
      }
      ctx.strokeStyle = '#1b4d3a';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(32, 32, W - 64, H - 64, 24); ctx.stroke();
      ctx.strokeStyle = accentCol;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(44, 44, W - 88, H - 88, 18); ctx.stroke();
    } else {
      // Fente tour de cou
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.roundRect((W - 100) / 2, 16, 100, 16, 8);
      ctx.fill();
    }

    // Logo officiel
    const logoY = isCarre ? 75 : 75;
    dessinerLogo(ctx, W / 2, logoY, bgDark);

    // Pastille de rôle / Type
    const pillY = isCarre ? 245 : 220;
    const pillText = '★  MEMBRE OFFICIEL DE LA COMMUNAUTÉ  ★';
    ctx.font = '700 15px "Figtree", sans-serif';
    const pillW = Math.max(340, ctx.measureText(pillText).width + 50);
    const pillH = 36;
    ctx.fillStyle = '#0e2b20';
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect((W - pillW) / 2, pillY, pillW, pillH, 18);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#eaf4ee';
    ctx.textAlign = 'center';
    ctx.fillText(pillText, W / 2, pillY + 23);

    // Photo ou initiales du membre
    const cx = W / 2;
    const cy = isCarre ? 440 : 380;
    const r = isCarre ? 140 : 105;

    // Anneaux de distinction & Forme selon le genre (Femme = Cercle, Homme = Carré)
    const isFemme = (data.sexe === 'F' || data.genre === 'femme');
    if (isFemme) {
      ctx.strokeStyle = '#1b4d3a'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(cx, cy, r + 10, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = accentCol; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, r + 4, 0, Math.PI * 2); ctx.stroke();

      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    } else {
      ctx.strokeStyle = '#1b4d3a'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(cx - r - 10, cy - r - 10, (r + 10) * 2, (r + 10) * 2, 22); ctx.stroke();
      ctx.strokeStyle = accentCol; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(cx - r - 4, cy - r - 4, (r + 4) * 2, (r + 4) * 2, 18); ctx.stroke();

      ctx.save();
      ctx.beginPath(); ctx.roundRect(cx - r, cy - r, r * 2, r * 2, 16); ctx.clip();
    }
    if (data.photoImg) {
      const pImg = data.photoImg;
      const imgW = pImg.naturalWidth || pImg.videoWidth || pImg.width || 1;
      const imgH = pImg.naturalHeight || pImg.videoHeight || pImg.height || 1;
      const minDim = Math.min(imgW, imgH);
      const srcX = (imgW - minDim) / 2;
      const srcY = (imgH - minDim) / 2;
      ctx.drawImage(pImg, srcX, srcY, minDim, minDim, cx - r, cy - r, r * 2, r * 2);
    } else {
      ctx.fillStyle = '#102a20';
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.fillStyle = accentCol;
      ctx.font = `800 ${isCarre ? '84px' : '68px'} "Bricolage Grotesque", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const init = (data.beneficiaireNom || 'Membre').trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
      ctx.fillText(init, cx, cy);
    }
    ctx.restore();

    // Nom & Rôle avec Auto-Shrink intelligent (zéro débordement)
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    const nomY = isCarre ? 640 : 540;
    dessinerTexteAutoShrink(
      ctx,
      (data.beneficiaireNom || 'Olivier AREMOU').toUpperCase(),
      cx,
      nomY,
      isCarre ? W - 140 : W - 90,
      '"Bricolage Grotesque", sans-serif',
      isCarre ? 42 : 36,
      18,
      '800'
    );

    ctx.fillStyle = '#a9ceba';
    dessinerTexteAutoShrink(
      ctx,
      data.beneficiaireRole || 'Coordinateur Pédagogique',
      cx,
      nomY + 34,
      isCarre ? W - 160 : W - 100,
      '"Figtree", sans-serif',
      isCarre ? 22 : 19,
      13,
      '600'
    );

    if (data.institution) {
      ctx.fillStyle = '#7fb0ee';
      dessinerTexteAutoShrink(
        ctx,
        data.institution,
        cx,
        nomY + 62,
        isCarre ? W - 180 : W - 120,
        '"Figtree", sans-serif',
        16,
        11,
        '500'
      );
    }

    if (!isCarre) {
      // Barres d'icônes
      dessinerBarreIcones(ctx, cx, 665, true);

      // Section QR Code scannable
      const qrY = 745;
      dessinerQRReel(ctx, cx - 180, qrY, 115, qrUrl, '#081814', '#ffffff');

      ctx.textAlign = 'left';
      ctx.fillStyle = '#eaf4ee';
      ctx.font = '700 16px "Bricolage Grotesque", sans-serif';
      ctx.fillText('Scanne pour authentifier', cx - 45, qrY + 34);

      ctx.fillStyle = '#a9c4b6';
      ctx.font = '500 14px "Figtree", sans-serif';
      ctx.fillText('et vérifier le profil du membre.', cx - 45, qrY + 58);

      ctx.fillStyle = accentCol;
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText(`ID : ${badgeId}`, cx - 45, qrY + 86);

      // Rubans inférieurs
      dessinerVagues(ctx, W, H, '#082018', '#22c55e', '#e8946a');

      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 14px "Figtree", sans-serif';
      ctx.fillText('« Apprendre aujourd’hui. Construire demain. »', cx, H - 24);
    } else {
      // Format Carré
      const qrSize = 130;
      const qrX = W / 2 - qrSize / 2;
      const qrY = 740;
      dessinerQRReel(ctx, qrX, qrY, qrSize, qrUrl, '#081814', '#ffffff');

      ctx.textAlign = 'center';
      ctx.fillStyle = '#7fb0ee';
      ctx.font = '700 15px "JetBrains Mono", monospace';
      ctx.fillText(`ID VÉRIFIÉ : ${badgeId}`, W / 2, 910);

      ctx.fillStyle = '#a9c4b6';
      ctx.font = '500 16px "Figtree", sans-serif';
      ctx.fillText('Scannez pour ouvrir la fiche officielle de membre', W / 2, 938);

      ctx.fillStyle = '#5fd0a0';
      ctx.font = '700 14px "Bricolage Grotesque", sans-serif';
      ctx.fillText('TEAM SAHÉLIA · RÉPUBLIQUE DU BÉNIN', W / 2, 985);
    }
  }

  // ---------------------------------------------------------------------------
  // 5. RENDU : BADGE TYPE 2 (FORMATION OU COHORTE)
  // ---------------------------------------------------------------------------
  function dessinerBadgeFormation(ctx, W, H, format, data) {
    if (format === 'paysage') {
      dessinerBadgePaysage(ctx, W, H, 'formation', data);
      return;
    }
    const isCarre = format === 'carre';
    const accentCol = data.accentColor || '#2563eb'; // Bleu d'accent formation
    const bgDark = true;
    const badgeId = data.id || 'TS-FOR-2026-Q1-001';
    const qrUrl = fabriquerUrlVerification(badgeId);

    // Fond bleu nuit / vert ardoise
    ctx.fillStyle = '#081724';
    ctx.fillRect(0, 0, W, H);

    // Halo d'accent bleu
    const glow = ctx.createRadialGradient(W / 2, isCarre ? 450 : 380, 50, W / 2, isCarre ? 450 : 380, W * 0.6);
    glow.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    if (isCarre) {
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(32, 32, W - 64, H - 64, 24); ctx.stroke();
      ctx.strokeStyle = accentCol;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(44, 44, W - 88, H - 88, 18); ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.roundRect((W - 100) / 2, 16, 100, 16, 8); ctx.fill();
    }

    // Logo
    dessinerLogo(ctx, W / 2, 75, bgDark);

    // Cartouche Cohorte dynamique (sans dépassement)
    const cohY = isCarre ? 230 : 215;
    const cohText = (data.cohorteNom || 'Cohorte Pionniers · TEAM Sahélia').toUpperCase();
    ctx.font = '800 13px "JetBrains Mono", monospace';
    const cohMaxW = isCarre ? W - 140 : W - 80;
    const cohRawW = ctx.measureText(`COHORTE : ${cohText}`).width + 40;
    const cohW = Math.min(cohMaxW, Math.max(300, cohRawW));
    ctx.fillStyle = '#0e243d';
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect((W - cohW) / 2, cohY, cohW, 30, 15); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#93c5fd';
    ctx.textAlign = 'center';
    dessinerTexteAutoShrink(ctx, `COHORTE : ${cohText}`, W / 2, cohY + 20, cohW - 30, '"JetBrains Mono", monospace', 13, 10, '800');

    // Intitulé Formation avec Auto-Shrink
    const titY = isCarre ? 295 : 275;
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(
      ctx,
      data.titre || 'Cartographie Parcellaire Smartphone & QGIS',
      W / 2,
      titY,
      isCarre ? W - 140 : W - 80,
      '"Bricolage Grotesque", sans-serif',
      isCarre ? 32 : 26,
      15,
      '800'
    );

    // Période & Pôle
    ctx.fillStyle = '#93c5fd';
    dessinerTexteAutoShrink(
      ctx,
      `${data.periode || 'Octobre — Novembre 2026'}  ·  ${data.lieu || 'Terrain & En ligne'}`,
      W / 2,
      titY + 28,
      isCarre ? W - 160 : W - 100,
      '"Figtree", sans-serif',
      15,
      11,
      '500'
    );

    // Icône centrale chapeau formation avec anneau
    const cx = W / 2;
    const cy = isCarre ? 470 : 420;
    const r = isCarre ? 100 : 75;

    ctx.fillStyle = '#0f2942';
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = accentCol; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

    IconesVectorielles.chapeau(ctx, cx, cy, isCarre ? 80 : 60, accentCol);

    // Statut EXPLICITE selon les données réelles (terminé / en cours / inscrit)
    const stY = isCarre ? 600 : 525;
    const statut = data.statut || 'en_cours';
    let statutTxt = 'INSCRIT & CONFIRMÉ';
    let statutBg = '#1e3a5f';
    let statutCol = '#93c5fd';
    let statutIco = '•';

    if (statut === 'termine') {
      statutTxt = 'FORMATION COMPLÉTÉE · VALIDÉ';
      statutBg = 'rgba(34, 197, 94, 0.2)';
      statutCol = '#4ade80';
      statutIco = '✓';
    } else if (statut === 'en_cours') {
      statutTxt = 'APPRENTISSAGE EN COURS';
      statutBg = 'rgba(245, 158, 11, 0.2)';
      statutCol = '#fbbf24';
      statutIco = '⏳';
    }

    ctx.font = '800 14px "JetBrains Mono", monospace';
    const rawStW = ctx.measureText(`${statutIco}  ${statutTxt}`).width + 36;
    const stW = Math.min(W - 80, rawStW);
    ctx.fillStyle = statutBg;
    ctx.strokeStyle = statutCol;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect((W - stW) / 2, stY, stW, 32, 16); ctx.fill(); ctx.stroke();
    ctx.fillStyle = statutCol;
    dessinerTexteAutoShrink(ctx, `${statutIco}  ${statutTxt}`, W / 2, stY + 21, stW - 24, '"JetBrains Mono", monospace', 14, 10, '800');

    // Participant Nom & Titre avec Auto-Shrink
    const partY = isCarre ? 675 : 595;
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(
      ctx,
      (data.beneficiaireNom || 'Participant').toUpperCase(),
      cx,
      partY,
      isCarre ? W - 140 : W - 90,
      '"Bricolage Grotesque", sans-serif',
      isCarre ? 40 : 34,
      18,
      '800'
    );

    ctx.fillStyle = '#cbd5e1';
    dessinerTexteAutoShrink(
      ctx,
      data.beneficiaireRole || 'Membre Apprenant',
      cx,
      partY + 30,
      isCarre ? W - 160 : W - 100,
      '"Figtree", sans-serif',
      isCarre ? 20 : 18,
      13,
      '500'
    );

    // Formateur
    if (data.formateur) {
      ctx.fillStyle = '#94a3b8';
      dessinerTexteAutoShrink(
        ctx,
        `Formateur référent : ${data.formateur}`,
        cx,
        partY + 56,
        isCarre ? W - 180 : W - 110,
        '"Figtree", sans-serif',
        14,
        11,
        '500'
      );
    }

    if (!isCarre) {
      // QR Code scannable vertical
      const qrY = 745;
      dessinerQRReel(ctx, cx - 180, qrY, 115, qrUrl, '#081724', '#ffffff');

      ctx.textAlign = 'left';
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '700 16px "Bricolage Grotesque", sans-serif';
      ctx.fillText('Scanne pour authentifier', cx - 45, qrY + 34);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 14px "Figtree", sans-serif';
      ctx.fillText('le statut et l’assiduité du participant.', cx - 45, qrY + 58);

      ctx.fillStyle = accentCol;
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText(`ID : ${badgeId}`, cx - 45, qrY + 86);

      // Rubans inférieurs (bleu nuit, vert prairie, or)
      dessinerVagues(ctx, W, H, '#06131f', '#2563eb', '#5fd0a0');

      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 14px "Figtree", sans-serif';
      ctx.fillText('Cohorte Officielle TEAM Sahélia · République du Bénin', cx, H - 24);
    } else {
      // Format Carré
      const qrSize = 125;
      const qrX = W / 2 - qrSize / 2;
      const qrY = 750;
      dessinerQRReel(ctx, qrX, qrY, qrSize, qrUrl, '#081724', '#ffffff');

      ctx.textAlign = 'center';
      ctx.fillStyle = '#93c5fd';
      ctx.font = '700 15px "JetBrains Mono", monospace';
      ctx.fillText(`ID VÉRIFIÉ : ${badgeId}`, W / 2, 915);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 15px "Figtree", sans-serif';
      ctx.fillText('Scannez pour vérifier le dossier officiel de participation', W / 2, 942);

      ctx.fillStyle = '#7fb0ee';
      ctx.font = '700 14px "Bricolage Grotesque", sans-serif';
      ctx.fillText('PROGRAMME ACADÉMIQUE · TEAM SAHÉLIA', W / 2, 985);
    }
  }

  // ---------------------------------------------------------------------------
  // 6. RENDU : BADGE TYPE 3 (COMPÉTENCE OU RÉALISATION DÉMONTRÉE)
  // ---------------------------------------------------------------------------
  function dessinerBadgeCompetence(ctx, W, H, format, data) {
    if (format === 'paysage') {
      dessinerBadgePaysage(ctx, W, H, 'competence', data);
      return;
    }
    const isCarre = format === 'carre';
    const accentCol = data.accentColor || '#d97706'; // Doré / Terracotta prestigieux
    const badgeId = data.id || 'TS-SKL-2026-001';
    const qrUrl = fabriquerUrlVerification(badgeId);

    // VARIANTE CLAIRE PRESTIGIEUSE (Ivoire marbré / vert sauge très pâle)
    ctx.fillStyle = '#f8faf9';
    ctx.fillRect(0, 0, W, H);

    // Cadre double or & forêt
    ctx.strokeStyle = '#d1e5db';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(isCarre ? 32 : 16, isCarre ? 32 : 16, W - (isCarre ? 64 : 32), H - (isCarre ? 64 : 32), 24);
    ctx.stroke();

    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(isCarre ? 44 : 26, isCarre ? 44 : 26, W - (isCarre ? 88 : 52), H - (isCarre ? 88 : 52), 18);
    ctx.stroke();

    // Coins élégants
    const cLen = 28;
    const corners = [
      [isCarre ? 44 : 26, isCarre ? 44 : 26, 1, 1],
      [W - (isCarre ? 44 : 26), isCarre ? 44 : 26, -1, 1],
      [isCarre ? 44 : 26, H - (isCarre ? 44 : 26), 1, -1],
      [W - (isCarre ? 44 : 26), H - (isCarre ? 44 : 26), -1, -1],
    ];
    ctx.strokeStyle = '#0b5e3b';
    ctx.lineWidth = 4;
    corners.forEach(([cxC, cyC, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(cxC, cyC); ctx.lineTo(cxC + dx * cLen, cyC);
      ctx.moveTo(cxC, cyC); ctx.lineTo(cxC, cyC + dy * cLen);
      ctx.stroke();
    });

    // Logo officiel (sur fond clair)
    dessinerLogo(ctx, W / 2, isCarre ? 75 : 75, false);

    // Titre de reconnaissance
    const recY = isCarre ? 230 : 215;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0b5e3b';
    ctx.font = '800 13px "JetBrains Mono", monospace';
    ctx.fillText('ATTESTATION OFFICIELLE DE RÉALISATION DE TERRAIN', W / 2, recY);

    // Médaille / Trophée centrale
    const cx = W / 2;
    const cy = isCarre ? 350 : 320;
    const rMed = isCarre ? 70 : 55;

    ctx.fillStyle = '#edf6f1';
    ctx.beginPath(); ctx.arc(cx, cy, rMed, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = accentCol; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, rMed, 0, Math.PI * 2); ctx.stroke();

    IconesVectorielles.trophee(ctx, cx, cy, isCarre ? 65 : 52, accentCol);

    // Intitulé précis de la compétence avec Auto-Shrink
    const compY = isCarre ? 465 : 415;
    ctx.fillStyle = '#08281d';
    dessinerTexteAutoShrink(
      ctx,
      data.titre || 'Délimitation & Cartographie Parcellaire QGIS',
      cx,
      compY,
      isCarre ? W - 140 : W - 80,
      '"Bricolage Grotesque", sans-serif',
      isCarre ? 34 : 28,
      15,
      '800'
    );

    // Niveau atteint (cartouche dynamique)
    const nivY = compY + 36;
    const niveau = (data.niveau || 'Pratique Validée').toUpperCase();
    const nivTxt = `NIVEAU ATTEINT : ${niveau}`;
    ctx.font = '800 14px "JetBrains Mono", monospace';
    const rawNivW = ctx.measureText(nivTxt).width + 36;
    const nivW = Math.min(W - 80, rawNivW);
    ctx.fillStyle = '#0b5e3b';
    ctx.beginPath(); ctx.roundRect((W - nivW) / 2, nivY - 20, nivW, 30, 15); ctx.fill();
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, nivTxt, cx, nivY, nivW - 20, '"JetBrains Mono", monospace', 14, 10, '800');

    // Bénéficiaire avec Auto-Shrink
    const benY = isCarre ? 570 : 495;
    ctx.fillStyle = '#557568';
    ctx.font = '600 14px "Figtree", sans-serif';
    ctx.fillText('Décerné avec les honneurs à :', cx, benY);

    ctx.fillStyle = '#08281d';
    dessinerTexteAutoShrink(
      ctx,
      (data.beneficiaireNom || 'Babatoundé Eric DOSSOU').toUpperCase(),
      cx,
      benY + 38,
      isCarre ? W - 140 : W - 90,
      '"Bricolage Grotesque", sans-serif',
      isCarre ? 38 : 32,
      18,
      '800'
    );

    ctx.fillStyle = '#426354';
    dessinerTexteAutoShrink(
      ctx,
      data.beneficiaireRole || 'Apprenant Certifié',
      cx,
      benY + 66,
      isCarre ? W - 160 : W - 100,
      '"Figtree", sans-serif',
      isCarre ? 18 : 16,
      12,
      '500'
    );

    // Validateur & Date
    const valY = isCarre ? 700 : 615;
    ctx.strokeStyle = '#d1e5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 220, valY); ctx.lineTo(cx + 220, valY);
    ctx.stroke();

    ctx.fillStyle = '#0b5e3b';
    dessinerTexteAutoShrink(
      ctx,
      `Validé par : ${data.validePar || 'Sègla Bio KPEROU (Référent SIG)'}`,
      cx,
      valY + 22,
      isCarre ? W - 160 : W - 100,
      '"Figtree", sans-serif',
      14,
      11,
      '700'
    );

    ctx.fillStyle = '#658577';
    dessinerTexteAutoShrink(
      ctx,
      `Date d'attribution : ${data.dateEmission || '25 Octobre 2026'}`,
      cx,
      valY + 42,
      isCarre ? W - 160 : W - 100,
      '"JetBrains Mono", monospace',
      13,
      10,
      '500'
    );

    if (!isCarre) {
      // Bloc Critères Validés
      const critBoxY = 680;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#d1e5db';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(60, critBoxY, W - 120, 110, 12);
      ctx.fill(); ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#0b5e3b';
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.fillText('✓ CRITÈRES CONTRÔLÉS SUR PROJET RÉEL :', 75, critBoxY + 24);

      ctx.fillStyle = '#3f5e51';
      const criteresAffiches = (data.criteres && data.criteres.length ? data.criteres : [
        'Relevé de 4 sommets au GPS smartphone avec pause stabilisée',
        'Import CSV sous QGIS et projection métrique UTM zone 31N',
        'Calcul exact de superficie en hectares ($area / 10000)',
      ]).slice(0, 3);

      criteresAffiches.forEach((crit, idx) => {
        dessinerTexteAutoShrink(ctx, `• ${crit}`, 75, critBoxY + 46 + idx * 20, W - 160, '"Figtree", sans-serif', 12, 10, '500');
      });

      // Section QR Code scannable
      const qrY = 820;
      dessinerQRReel(ctx, cx - 180, qrY, 115, qrUrl, '#0b2b24', '#ffffff');

      ctx.textAlign = 'left';
      ctx.fillStyle = '#08281d';
      ctx.font = '700 16px "Bricolage Grotesque", sans-serif';
      ctx.fillText('Scanne pour authentifier', cx - 45, qrY + 34);

      ctx.fillStyle = '#426354';
      ctx.font = '500 14px "Figtree", sans-serif';
      ctx.fillText('le projet réel et les livrables validés.', cx - 45, qrY + 58);

      ctx.fillStyle = '#0b5e3b';
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText(`ID : ${badgeId}`, cx - 45, qrY + 86);

      // Rubans inférieurs vert et or clair
      dessinerVagues(ctx, W, H, '#0b5e3b', '#5fd0a0', accentCol);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 14px "Figtree", sans-serif';
      ctx.fillText('Dispositif d’Évaluation des Compétences · TEAM Sahélia', cx, H - 24);
    } else {
      // Format Carré
      const qrSize = 120;
      const qrX = W / 2 - qrSize / 2;
      const qrY = 770;
      dessinerQRReel(ctx, qrX, qrY, qrSize, qrUrl, '#0b2b24', '#ffffff');

      ctx.textAlign = 'center';
      ctx.fillStyle = '#0b5e3b';
      ctx.font = '700 15px "JetBrains Mono", monospace';
      ctx.fillText(`ID VÉRIFIÉ : ${badgeId}`, W / 2, 922);

      ctx.fillStyle = '#557568';
      ctx.font = '500 15px "Figtree", sans-serif';
      ctx.fillText('Scannez pour consulter les critères d’évaluation validés', W / 2, 948);

      ctx.fillStyle = '#0b5e3b';
      ctx.font = '700 14px "Bricolage Grotesque", sans-serif';
      ctx.fillText('RÉFÉRENTIEL DE COMPÉTENCES · 2026', W / 2, 985);
    }
  }

  // ---------------------------------------------------------------------------
  // 7. RENDU : VERSO OFFICIEL (FACE ARRIÈRE DU BADGE / PLIURE A4)
  // ---------------------------------------------------------------------------
  function dessinerBadgeVerso(ctx, W, H, format, data) {
    const isCarre = format === 'carre';
    const badgeId = data.id || 'TS-OFFICIEL';
    const qrUrl = fabriquerUrlVerification(badgeId);

    // Fond vert ardoise profond
    ctx.fillStyle = '#06130e';
    ctx.fillRect(0, 0, W, H);

    // Halo d'honneur
    const glow = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W * 0.7);
    glow.addColorStop(0, 'rgba(23, 112, 74, 0.28)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Bordure officielle
    ctx.strokeStyle = '#1b4d3a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(isCarre ? 32 : 16, isCarre ? 32 : 16, W - (isCarre ? 64 : 32), H - (isCarre ? 64 : 32), 24);
    ctx.stroke();

    if (!isCarre) {
      // Fente tour de cou
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.roundRect((W - 100) / 2, 16, 100, 16, 8);
      ctx.fill();
    }

    // Logo & En-tête officiel
    dessinerLogo(ctx, W / 2, 70, true);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#5fd0a0';
    ctx.font = '800 14px "JetBrains Mono", monospace';
    ctx.fillText('DISPOSITIF OFFICIEL DE CONTRÔLE & ENGAGEMENTS', W / 2, 215);

    // Les 4 engagements éthiques avec icônes
    const startY = 250;
    const boxW = W - 100;
    const principes = [
      {
        titre: '1. Le terrain d’abord',
        desc: 'Un besoin réel décide de ce que nous concevons, jamais la mode ou le buzz.',
        ico: 'agronomie',
        col: '#5fd0a0',
      },
      {
        titre: '2. Bâtir pour de vrai',
        desc: 'Des compétences opérationnelles sur un téléphone ordinaire avec faible connexion.',
        ico: 'code',
        col: '#7fb0ee',
      },
      {
        titre: '3. Solutions conçues ici',
        desc: 'Pour les réalités de l’agronomie et de la jeunesse au Bénin et en Afrique.',
        ico: 'sig',
        col: '#e8946a',
      },
      {
        titre: '4. Honnêteté et rigueur',
        desc: 'Transparence absolue, aucun faux diplôme, certification sur projet réel.',
        ico: 'communaute',
        col: '#5fd0a0',
      },
    ];

    principes.forEach((p, idx) => {
      const y = startY + idx * 74;
      ctx.fillStyle = '#0a2219';
      ctx.strokeStyle = '#1b4d3a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(50, y, boxW, 62, 10);
      ctx.fill();
      ctx.stroke();

      IconesVectorielles[p.ico](ctx, 80, y + 31, 26, p.col);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#eaf4ee';
      ctx.font = '700 15px "Bricolage Grotesque", sans-serif';
      ctx.fillText(p.titre, 110, y + 26);

      ctx.fillStyle = '#a9c4b6';
      ctx.font = '500 12px "Figtree", sans-serif';
      ctx.fillText(p.desc, 110, y + 47);
    });

    // Bloc Sécurité & QR Code central
    const secBoxY = startY + 4 * 74 + 18;
    ctx.fillStyle = '#081a14';
    ctx.strokeStyle = '#25463a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(50, secBoxY, boxW, 185, 14);
    ctx.fill();
    ctx.stroke();

    const qrSize = 115;
    const qrX = 75;
    const qrY = secBoxY + 35;
    dessinerQRReel(ctx, qrX, qrY, qrSize, qrUrl, '#081814', '#ffffff');

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 16px "Bricolage Grotesque", sans-serif';
    ctx.fillText('CONTRÔLE D’AUTHENTICITÉ', 225, secBoxY + 48);

    ctx.fillStyle = '#a9c4b6';
    ctx.font = '500 13px "Figtree", sans-serif';
    ctx.fillText('Scannez ce QR code pour ouvrir', 225, secBoxY + 72);
    ctx.fillText('le registre de vérification en direct.', 225, secBoxY + 92);

    ctx.fillStyle = '#5fd0a0';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText(`ID : ${badgeId}`, 225, secBoxY + 122);

    ctx.fillStyle = '#e8946a';
    ctx.font = '600 12px "Figtree", sans-serif';
    ctx.fillText('Propriété de TEAM Sahélia · Rép. du Bénin', 225, secBoxY + 146);

    // Mention légale inférieure
    const footY = H - (isCarre ? 90 : 75);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#658577';
    ctx.font = '500 12px "Figtree", sans-serif';
    ctx.fillText('Ce titre est délivré sous la supervision du Conseil Académique de TEAM Sahélia.', W / 2, footY);
    ctx.fillText('En cas de perte, merci de le retourner : teamsahelia@gmail.com · TEAM Sahélia', W / 2, footY + 18);

    // Vagues décoratives en bas
    dessinerVagues(ctx, W, H, '#040f0b', '#103829', '#e8946a');
  }

  // ---------------------------------------------------------------------------
  // 7. LOGO VECTORIEL HORIZONTAL OFFICIEL (POUR FORMAT PAYSAGE)
  // ---------------------------------------------------------------------------
  function dessinerLogoHorizontal(ctx, x, y) {
    ctx.save();
    // Soleil levant terracotta
    ctx.fillStyle = '#e8946a';
    ctx.beginPath();
    ctx.arc(x + 24, y + 22, 18, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    // Barres d'horizon officielles
    ctx.fillStyle = '#eaf4ee';
    ctx.beginPath();
    ctx.roundRect(x + 14, y + 25, 48, 4, 2);
    ctx.fill();

    ctx.fillStyle = '#3fae7a';
    ctx.beginPath();
    ctx.roundRect(x + 20, y + 32, 36, 3, 1.5);
    ctx.fill();

    ctx.fillStyle = '#7fb0ee';
    ctx.beginPath();
    ctx.roundRect(x + 26, y + 38, 24, 2.5, 1.25);
    ctx.fill();

    // Satellite bleu officiel
    ctx.fillStyle = '#7fb0ee';
    ctx.beginPath();
    ctx.arc(x + 54, y + 8, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Typographie officielle
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#a9c4b6';
    ctx.font = '700 12px "Bricolage Grotesque", -apple-system, sans-serif';
    ctx.fillText('TEAM', x + 76, y + 23);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 22px "Bricolage Grotesque", -apple-system, sans-serif';
    ctx.fillText('SAHÉLIA', x + 76, y + 43);
    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // 8. RENDU : BADGE PAYSAGE CR80 OFFICIEL (1000 × 500 PX)
  // ---------------------------------------------------------------------------
  function dessinerBadgePaysage(ctx, W, H, type, data) {
    const isFemme = (data.sexe === 'F' || data.genre === 'femme');
    let bgGrad0 = '#061711';
    let bgGrad1 = '#0d2e23';
    let borderCol = '#23654b';
    let accentCol = data.accentColor || '#5fd0a0';
    let defaultBadgeId = 'TS-MBR-2026-001';
    let pillText = isFemme ? 'MEMBRE ACTIVE' : 'MEMBRE ACTIF';
    let authorityTitle = 'Direction & Conseil Académique TEAM Sahélia';
    let defaultSlogan = 'L’agronomie de demain maîtrise la terre et la donnée.';

    let meta1 = { label: "Domaine d'Action", val: data.beneficiaireRole || data.role || 'Cartographie SIG & Agronomie' };
    let meta2 = { label: "Matricule Officiel", val: data.id || defaultBadgeId };
    let meta3 = { label: "Institution d'Attache", val: data.institution || 'TEAM Sahélia · Communauté Officielle' };
    let meta4 = { label: "Statut d'Adhésion", val: (data.dateEmission || data.dateAdhesion || '15 Janvier 2026') + ' · Actif' };

    if (type === 'formation') {
      bgGrad0 = '#071726';
      bgGrad1 = '#0f2c4a';
      borderCol = '#1e3a5f';
      accentCol = data.accentColor || '#38bdf8';
      defaultBadgeId = 'TS-FOR-2026-B1-001';
      pillText = isFemme ? 'STAGIAIRE CERTIFIÉE' : 'STAGIAIRE CERTIFIÉ';
      authorityTitle = 'Certificat de Formation TEAM Sahélia';
      defaultSlogan = 'Bâtir pour de vrai : des compétences solides pour la jeunesse.';

      meta1 = { label: "Programme de Formation", val: data.titre || 'Bureautique Académique : Mémoires Word & Excel' };
      meta2 = { label: "Matricule Stagiaire", val: data.id || defaultBadgeId };
      meta3 = { label: "Cohorte Académique", val: data.cohorteNom || 'Cohorte Urgence Mémoire · Novembre 2026' };
      meta4 = { label: "Décision du Jury", val: data.mention || 'Mémoire & Projet validés avec mention' };
    } else if (type === 'competence') {
      bgGrad0 = '#131411';
      bgGrad1 = '#2b2214';
      borderCol = '#42341d';
      accentCol = data.accentColor || '#e8946a';
      defaultBadgeId = 'TS-SKL-2026-001';
      pillText = isFemme ? 'COMPÉTENCE PRATICIENNE VALIDÉE' : 'COMPÉTENCE EXPERT TERRAIN';
      authorityTitle = 'Conseil Académique & Technique TEAM Sahélia';
      defaultSlogan = 'Le terrain d’abord : des compétences opérationnelles.';

      meta1 = { label: "Compétence Validée", val: data.titre || 'Délimitation & Cartographie Parcellaire QGIS' };
      meta2 = { label: "Accréditation ID", val: data.id || defaultBadgeId };
      meta3 = { label: "Domaine d’Expertise", val: data.domaine || 'Géomatique Appliquée à l’Agronomie' };
      meta4 = { label: "Dispositif d’Évaluation", val: (data.dateEmission || '28 Octobre 2026') + ' · Projet Réel' };
    }

    const badgeId = data.id || defaultBadgeId;
    const qrUrl = fabriquerUrlVerification(badgeId);
    const sloganFinal = data.slogan || defaultSlogan;

    // 1. Fond dégradé officiel & Bordure
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, bgGrad0);
    grad.addColorStop(1, bgGrad1);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 20);
    ctx.fill();

    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(6, 6, W - 12, H - 12, 18);
    ctx.stroke();

    // 2. En-tête : Logo vectoriel + Devise
    dessinerLogoHorizontal(ctx, 38, 22);

    // Ligne verticale de séparation dans l'en-tête
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(225, 22);
    ctx.lineTo(225, 72);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = accentCol;
    ctx.font = '800 12px "Figtree", sans-serif';
    ctx.fillText('APPRENDRE. CRÉER. INNOVER.', 240, 42);

    ctx.fillStyle = '#a9c4b6';
    ctx.font = '500 11px "Figtree", sans-serif';
    ctx.fillText('TEAM Sahélia · Pôle Pédagogique Panafricain', 240, 62);

    // QR Code 100% scannable en haut à droite
    const qrX = W - 148;
    const qrY = 16;
    const qrSize = 96;
    dessinerQRReel(ctx, qrX, qrY, qrSize, qrUrl, '#071812', '#ffffff');

    ctx.textAlign = 'center';
    ctx.fillStyle = accentCol;
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillText('SCANNER POUR VÉRIFIER', qrX + qrSize / 2, qrY + qrSize + 18);

    // Ligne horizontale de démarcation supérieure
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 136);
    ctx.lineTo(W - 36, 136);
    ctx.stroke();

    // 3. Corps Central : Photo d'identité agrandie (195 × 195 px)
    const photoX = 45;
    const photoY = 152;
    const photoW = 195;
    const photoH = 195;
    const cx = photoX + photoW / 2;
    const cy = photoY + photoH / 2;
    const r = photoW / 2;

    // Tracé extérieur d'accentuation
    if (isFemme) {
      ctx.strokeStyle = accentCol;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
    } else {
      ctx.strokeStyle = accentCol;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.roundRect(photoX - 2, photoY - 2, photoW + 4, photoH + 4, 18);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoW, photoH, 16);
      ctx.clip();
    }

    if (data.photoImg) {
      const pImg = data.photoImg;
      const imgW = pImg.naturalWidth || pImg.videoWidth || pImg.width || 1;
      const imgH = pImg.naturalHeight || pImg.videoHeight || pImg.height || 1;
      const minDim = Math.min(imgW, imgH);
      const srcX = (imgW - minDim) / 2;
      const srcY = (imgH - minDim) / 2;
      ctx.drawImage(pImg, srcX, srcY, minDim, minDim, photoX, photoY, photoW, photoH);
    } else {
      ctx.fillStyle = '#081e16';
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.fillStyle = accentCol;
      ctx.font = '800 68px "Bricolage Grotesque", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const init = (data.beneficiaireNom || data.nom || 'Membre').trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
      ctx.fillText(init, cx, cy);
    }
    ctx.restore();

    // Légende sous la photo
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = accentCol;
    ctx.font = '800 11px "Figtree", sans-serif';
    ctx.fillText(isFemme ? 'CERTIFIÉE OFFICIELLE' : 'CERTIFIÉ OFFICIEL', cx, photoY + photoH + 20);

    // 4. Colonne d'informations du titulaire
    const infoX = 265;
    const infoY = 152;
    const nomAffiche = (data.beneficiaireNom || data.nom || 'Sègla Bio KPEROU');

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, nomAffiche, infoX, infoY + 28, W - infoX - 45, '"Bricolage Grotesque", sans-serif', 30, 20, '800');

    // Pilule de rôle
    ctx.font = '800 11px "Figtree", sans-serif';
    const pillW = ctx.measureText(pillText).width + 32;
    const pillH = 28;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(infoX, infoY + 42, pillW, pillH, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = accentCol;
    ctx.textAlign = 'center';
    ctx.fillText('● ' + pillText, infoX + pillW / 2, infoY + 60);

    // Grille des 4 métadonnées réelles
    const gridX = infoX;
    const gridY = infoY + 80;
    const gridW = W - infoX - 45;
    const gridH = 118;

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
    const row2Y = gridY + 74;

    // Métadonnée 1
    ctx.textAlign = 'left';
    ctx.fillStyle = '#a9c4b6';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText(meta1.label.toUpperCase(), col1X, row1Y);
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, meta1.val, col1X, row1Y + 19, gridW / 2 - 25, '"Figtree", sans-serif', 13.5, 11, '700');

    // Métadonnée 2 (Matricule en JetBrains Mono)
    ctx.fillStyle = '#a9c4b6';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText(meta2.label.toUpperCase(), col2X, row1Y);
    ctx.fillStyle = accentCol;
    ctx.font = '700 13.5px "JetBrains Mono", monospace';
    ctx.fillText(meta2.val, col2X, row1Y + 19);

    // Métadonnée 3
    ctx.fillStyle = '#a9c4b6';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText(meta3.label.toUpperCase(), col1X, row2Y);
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, meta3.val, col1X, row2Y + 19, gridW / 2 - 25, '"Figtree", sans-serif', 13.5, 11, '700');

    // Métadonnée 4
    ctx.fillStyle = '#a9c4b6';
    ctx.font = '700 10px "Figtree", sans-serif';
    ctx.fillText(meta4.label.toUpperCase(), col2X, row2Y);
    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, meta4.val, col2X, row2Y + 19, gridW / 2 - 25, '"Figtree", sans-serif', 13.5, 11, '700');

    // 5. Pied de page
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 422);
    ctx.lineTo(W - 36, 422);
    ctx.stroke();

    // Gauche : Autorité & Vrai Slogan
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 12px "Figtree", sans-serif';
    ctx.fillText(authorityTitle.toUpperCase(), 45, 448);

    ctx.fillStyle = accentCol;
    ctx.font = 'italic 11.5px "Figtree", sans-serif';
    dessinerTexteAutoShrink(ctx, `« ${sloganFinal} »`, 45, 468, 480, '"Figtree", sans-serif', 11.5, 10, '500');

    // Centre : Bouton d'action / sceau
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(W / 2, 458, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#061711';
    ctx.font = '900 16px "Figtree", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('↓', W / 2, 459);

    // Droite : Ancrage & URL
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#eaf4ee';
    ctx.font = '700 11px "Figtree", sans-serif';
    ctx.fillText('Communauté TEAM Sahélia · Bénin', W - 45, 448);

    ctx.fillStyle = '#5fd0a0';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillText(`sahelia.org/verifier?id=${badgeId}`, W - 45, 468);
  }

  // ---------------------------------------------------------------------------
  // 9. ROUTEUR GÉNÉRAL DE RENDU
  // ---------------------------------------------------------------------------
  
  // ---------------------------------------------------------------------------
  // 8B. RENDU DE L'INSIGNE ISOLÉ OPEN BADGES 3.0 (FORMAT 800 × 800 HD)
  // ---------------------------------------------------------------------------
  function dessinerInsigneOpenBadge(ctx, W, H, type, data) {
    const cx = W / 2;
    const cy = H * 0.44;
    const r = Math.min(W, H) * 0.35;

    // Identifier la filière et la forme
    const idLower = String(data.id || '').toLowerCase();
    const titreLower = String(data.titre || data.titreCompetence || '').toLowerCase();

    let track = 'bronze';
    let forme = 'pentagone';
    let metal0 = '#e8946a';
    let metal1 = '#cd7f32';
    let metal2 = '#78350f';
    let bgInner = '#091c15';
    let accent = '#5fd0a0';
    let labelNiveau = 'MEMBRE PIONNIER';
    let labelFiliere = 'COMMUNAUTÉ SAHÉLIA';
    let badgeCode = 'BRONZE · FOUNDATION';

    if (idLower.includes('sig') || titreLower.includes('sig') || titreLower.includes('carto') || type === 'competence-sig') {
      track = 'argent';
      forme = 'hexagone';
      metal0 = '#f8fafc';
      metal1 = '#cbd5e1';
      metal2 = '#475569';
      bgInner = '#061713';
      accent = '#5fd0a0';
      labelNiveau = 'PRATICIEN SIG & GPS';
      labelFiliere = 'QGIS 3 · UTM 31N';
      badgeCode = 'ARGENT · PRACTITIONER';
    } else if (idLower.includes('drn') || idLower.includes('drone') || titreLower.includes('drone') || type === 'competence-drone') {
      track = 'or';
      forme = 'ecusson';
      metal0 = '#fef08a';
      metal1 = '#f59e0b';
      metal2 = '#b45309';
      bgInner = '#081410';
      accent = '#fbbf24';
      labelNiveau = 'OPÉRATEUR DRONE';
      labelFiliere = 'TÉLÉDÉTECTION NDVI';
      badgeCode = 'OR · SPECIALIST';
    } else if (idLower.includes('vibe') || idLower.includes('ia') || titreLower.includes('vibe') || titreLower.includes('ia') || type === 'competence-vibe') {
      track = 'platine';
      forme = 'octogone';
      metal0 = '#e0f2fe';
      metal1 = '#38bdf8';
      metal2 = '#0284c7';
      bgInner = '#051410';
      accent = '#7fb0ee';
      labelNiveau = 'VIBE CODING & IA';
      labelFiliere = 'SOLUTIONS ARCHITECT';
      badgeCode = 'PLATINE · ARCHITECT';
    }

    // 1. Fond du Canvas
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

    // 2. Halo lumineux externe (Aura)
    const aura = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.25);
    aura.addColorStop(0, accent + '33');
    aura.addColorStop(0.7, accent + '0d');
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // 3. Dessin de la Forme Géométrique Métallique Externe
    function tracer(rayonMult, offset = 0) {
      if (forme === 'hexagone') {
        FormesGeometriques.hexagone(ctx, cx, cy + offset, r * rayonMult);
      } else if (forme === 'ecusson') {
        FormesGeometriques.ecusson(ctx, cx, cy + offset, r * 1.8 * rayonMult, r * 2.1 * rayonMult);
      } else if (forme === 'octogone') {
        FormesGeometriques.octogone(ctx, cx, cy + offset, r * rayonMult);
      } else {
        FormesGeometriques.pentagone(ctx, cx, cy + offset, r * rayonMult);
      }
    }

    // Contour Métallique Externe (Biseau)
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

    // Liseré fin métallique intérieur
    tracer(0.89);
    ctx.strokeStyle = gradMetal;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 4. Icône vectorielle centrale & Décoration
    if (track === 'argent') {
      // Polygone parcellaire SIG
      IconesVectorielles.sig(ctx, cx, cy - 25, 110, accent);
    } else if (track === 'or') {
      // Drone
      IconesVectorielles.drone(ctx, cx, cy - 25, 120, accent);
    } else if (track === 'platine') {
      // Puce IA & Code
      IconesVectorielles.ia(ctx, cx, cy - 25, 115, accent);
    } else {
      // Membre Pionnier (Agronomie & Monogramme)
      IconesVectorielles.agronomie(ctx, cx, cy - 35, 110, accent);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = metal0;
      ctx.font = '800 28px "Bricolage Grotesque", sans-serif';
      ctx.fillText('TS', cx, cy + 28);
    }

    // 5. Inscriptions gravées sur l'insigne
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // Filière (haut de l'insigne)
    ctx.fillStyle = metal0;
    ctx.font = '800 13px "JetBrains Mono", monospace';
    ctx.fillText(labelFiliere, cx, cy - r * 0.58);

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
    ctx.font = '800 12.5px "Figtree", sans-serif';
    ctx.fillText(labelNiveau, cx, rubanY + 22);

    // Millésime & Pays
    ctx.fillStyle = accent;
    ctx.font = '700 10.5px "JetBrains Mono", monospace';
    ctx.fillText('RÉPUBLIQUE DU BÉNIN · 2026', cx, cy + r * 0.74);

    // 6. Section Récipient & Authentification (Sous l'insigne)
    const nomTitulaire = (data.beneficiaireNom || data.nom || 'Olivier AREMOU').toUpperCase();
    const idBadge = data.id || 'TS-SKL-2026-001';
    const roleTitulaire = data.beneficiaireRole || data.institution || 'Communauté TEAM Sahélia';

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(cx - 160, H - 150, 320, 1);

    ctx.fillStyle = '#ffffff';
    dessinerTexteAutoShrink(ctx, nomTitulaire, cx, H - 118, W - 80, '"Bricolage Grotesque", sans-serif', 26, 18, '800');

    ctx.fillStyle = '#a9c4b6';
    ctx.font = '600 13px "Figtree", sans-serif';
    ctx.fillText(roleTitulaire, cx, H - 94);

    // Identifiant & Standard
    ctx.fillStyle = accent;
    ctx.font = '700 11.5px "JetBrains Mono", monospace';
    ctx.fillText(`${badgeCode}  ·  ID : ${idBadge}`, cx, H - 72);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.fillText('OPEN BADGES 3.0 · W3C VERIFIABLE CREDENTIAL', cx, H - 52);
  }

  function genererBadgeSurCanvas(canvas, options) {
    if (!canvas) return;
    const {
      type = 'membre', // 'membre' | 'formation' | 'competence' | 'verso'
      format = 'vertical', // 'vertical' | 'carre' | 'paysage'
      data = {},
    } = options || {};

    const ctx = canvas.getContext('2d');
        const isBadgeSeul = (format === 'badge_seul' || format === 'insigne');
    const W = isBadgeSeul ? 800 : (format === 'carre' ? 1080 : (format === 'paysage' ? 1000 : 720));
    const H = isBadgeSeul ? 800 : (format === 'carre' ? 1080 : (format === 'paysage' ? 500 : 1150));
    canvas.width = W;
    canvas.height = H;

    if (isBadgeSeul) {
      dessinerInsigneOpenBadge(ctx, W, H, type, data);
    } else if (type === 'verso') {
      dessinerBadgeVerso(ctx, W, H, format, data);
    } else if (type === 'formation') {
      dessinerBadgeFormation(ctx, W, H, format, data);
    } else if (type === 'competence') {
      dessinerBadgeCompetence(ctx, W, H, format, data);
    } else {
      dessinerBadgeMembre(ctx, W, H, format, data);
    }
  }

  // Exposition globale
  
  // ---------------------------------------------------------------------------
  // 10. INTÉGRATIONS LINKEDIN & OPEN BADGES 3.0 / W3C VERIFIABLE CREDENTIALS
  // ---------------------------------------------------------------------------
  function genererLienLinkedIn(data) {
    const titre = encodeURIComponent(data.titre || data.titreCompetence || 'Certification TEAM Sahélia');
    const certId = encodeURIComponent(data.id || 'TS-2026-001');
    const baseUrl = 'https://aremouolivier-ops.github.io/site-team-sahelia';
    const certUrl = encodeURIComponent(`${baseUrl}/verifier.html?id=${certId}`);
    const orgName = encodeURIComponent('TEAM Sahélia');
    return `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${titre}&organizationName=${orgName}&issueYear=2026&issueMonth=11&certUrl=${certUrl}&certId=${certId}`;
  }

  function exporterOpenBadgeJSONLD(data) {
    const certId = data.id || 'TS-2026-001';
    const baseUrl = 'https://aremouolivier-ops.github.io/site-team-sahelia';
    return {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"
      ],
      "id": `urn:uuid:${certId.toLowerCase()}`,
      "type": ["VerifiableCredential", "OpenBadgeCredential"],
      "issuer": {
        "id": `${baseUrl}/issuers/team-sahelia.json`,
        "type": ["Profile"],
        "name": "Communauté TEAM Sahélia · République du Bénin",
        "url": baseUrl,
        "email": "teamsahelia@gmail.com"
      },
      "validFrom": "2026-11-03T00:00:00Z",
      "name": data.titre || data.titreCompetence || "Certification TEAM Sahélia",
      "description": data.description || "Micro-certification de compétence de terrain vérifiable délivrée par la communauté TEAM Sahélia.",
      "credentialSubject": {
        "id": `did:sahelia:${certId.toLowerCase()}`,
        "type": ["AchievementSubject"],
        "name": data.beneficiaireNom || data.nom || "Membre Certifié",
        "achievement": {
          "id": `${baseUrl}/achievements/${certId.toLowerCase()}.json`,
          "type": ["Achievement"],
          "name": data.titre || data.titreCompetence || "Compétence Validée",
          "criteria": {
            "narrative": (Array.isArray(data.criteres) && data.criteres.length) ? data.criteres.join(' ; ') : "Validation par livrable de terrain réel selon le protocole de référence de TEAM Sahélia."
          }
        }
      }
    };
  }

  window.BadgeEngine = {
    genererLienLinkedIn,
    exporterOpenBadgeJSONLD,
    dessinerInsigneOpenBadge,
    FormesGeometriques,
    genererBadgeSurCanvas,
    dessinerBadgeMembre,
    dessinerBadgeFormation,
    dessinerBadgeCompetence,
    dessinerBadgePaysage,
    dessinerBadgeVerso,
    IconesVectorielles,
    fabriquerUrlVerification,
  };
})();
