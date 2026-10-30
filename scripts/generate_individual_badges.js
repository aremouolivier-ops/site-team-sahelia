const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BRAIN_DIR = path.resolve('C:/Users/DELL/.gemini/antigravity/brain/f059b97b-0db9-4f81-b62c-ea0e1ed8efa6');
const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const TEMPLATE_HTML = path.join(BRAIN_DIR, 'single_badge_render.html');

const BADGES = [
  {
    id: '01',
    nomFichier: 'badge_01_membre_officiel_paysage.png',
    theme: 'theme-1',
    nom: 'Aïcha Diallo',
    role: 'Membre Actif',
    formation: 'Développement Web',
    badgeNo: 'TS-2026-0047',
    dateVal: '31/12/2027',
    avatar: 'avatars/aicha_diallo.jpg',
    slogan: '« Unis par le savoir, forts par l’action. »',
    badgeTypeLogo: 'Apprendre · Créer · Réussir',
    logoColor: '#ffffff',
    subColor: '#f59e0b',
    shield: 'TEAM SAHÉLIA',
    shieldColor: '#f59e0b',
    isSquare: false,
    hasCurve: true,
    qrFill: '#0c2340',
    wingColor: '#38bdf8'
  },
  {
    id: '02',
    nomFichier: 'badge_02_formation_cursus_paysage.png',
    theme: 'theme-2',
    nom: 'Fatou Sow',
    role: 'Stagiaire Certifiée',
    formation: 'Bureautique & Mémoires',
    badgeNo: 'TS-2026-0128',
    dateVal: '15/03/2027',
    avatar: 'avatars/fatou_sow.jpg',
    slogan: '« Des compétences solides pour demain. »',
    badgeTypeLogo: 'Apprendre · Créer · Réussir',
    logoColor: '#0f2b48',
    subColor: '#d97706',
    shield: 'CERTIFICATION OFFICIELLE',
    shieldColor: '#d97706',
    isSquare: true,
    hasCurve: false,
    qrFill: '#0f2b48',
    wingColor: '#0f2b48'
  },
  {
    id: '03',
    nomFichier: 'badge_03_vibe_coding_ia_paysage.png',
    theme: 'theme-3',
    nom: 'Moussa Diop',
    role: 'Vibe Coder Accrédité',
    formation: 'Intelligence Artificielle',
    badgeNo: 'TS-2026-0093',
    dateVal: '30/11/2027',
    avatar: 'avatars/moussa_diop.jpg',
    slogan: '« Piloter l’intelligence pour bâtir l’avenir. »',
    badgeTypeLogo: 'Innovation · IA · Code',
    logoColor: '#ffffff',
    subColor: '#38bdf8',
    shield: 'EXPERT IA ACCRÉDITÉ',
    shieldColor: '#f59e0b',
    isSquare: false,
    hasCurve: false,
    isIa: true,
    qrFill: '#091a30',
    wingColor: '#38bdf8'
  },
  {
    id: '04',
    nomFichier: 'badge_04_agronomie_sig_paysage.png',
    theme: 'theme-4',
    nom: 'Sègla Bio KPEROU',
    role: 'Référent SIG & Agronomie',
    formation: 'Cartographie QGIS',
    badgeNo: 'TS-MBR-2026-001',
    dateVal: 'FA-UP · Parakou / Bénin',
    avatar: 'avatars/segla_kperou.jpg',
    slogan: '« Maîtriser la terre, valoriser la donnée. »',
    badgeTypeLogo: 'Agronomie · Données · SIG',
    logoColor: '#ffffff',
    subColor: '#e8946a',
    shield: 'EXPERT SIG & DONNÉES',
    shieldColor: '#e8946a',
    isSquare: false,
    hasCurve: false,
    labelStation: true,
    qrFill: '#0a261c',
    wingColor: '#10b981'
  },
  {
    id: '05',
    nomFichier: 'badge_05_enqueteur_terrain_paysage.png',
    theme: 'theme-5',
    nom: 'Oumar Traoré',
    role: 'Enquêteur Accrédité Kobo',
    formation: 'Essais Coton Parakou',
    badgeNo: 'TS-2026-0075',
    dateVal: '28/02/2027',
    avatar: 'avatars/oumar_traore.jpg',
    isTerrainSpecial: true,
    qrFill: '#0a1f33'
  },
  {
    id: '06',
    nomFichier: 'badge_06_creation_media_paysage.png',
    theme: 'theme-6',
    nom: 'Lina Keita',
    role: 'Membre Actif',
    formation: 'Design Graphique & Vidéo',
    badgeNo: 'TS-2026-0164',
    dateVal: '10/06/2027',
    avatar: 'avatars/lina_keita.jpg',
    slogan: '« La créativité au service de l’impact. »',
    badgeTypeLogo: 'Créativité · Vidéo · Média',
    logoColor: '#ffffff',
    subColor: '#fbbf24',
    shield: 'TEAM SAHÉLIA',
    shieldColor: '#fbbf24',
    isSquare: false,
    hasCurve: false,
    qrFill: '#0e1626',
    wingColor: '#f43f5e'
  }
];

function buildBadgeHtml(b) {
  if (b.isTerrainSpecial) {
    return `
      <div class="badge-card ${b.theme}">
        <div class="t5-top">
          <div class="b-photo rounded-square">
            <img src="${b.avatar}" alt="${b.nom}">
          </div>
          <div class="b-info">
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 8px;">
              <span style="font-size: 24px; font-weight: 900; color: #0a1f33;">TEAM SAHÉLIA</span>
              <span style="font-size: 16px; color: #64748b; font-weight: 700;">· Mission Terrain</span>
            </div>
            <h2 class="b-nom" style="color: #0a1f33; font-size: 34px;">${b.nom}</h2>
            <div style="display: inline-block; background: #fef3c7; color: #92400e; font-weight: 800; font-size: 16px; padding: 4px 14px; border-radius: 6px; margin-top: 6px;">
              ENQUÊTEUR ACCRÉDITÉ KOBOTOOLBOX
            </div>
          </div>
          <div class="b-qr" style="border: 2px solid #cbd5e1;">
            <svg viewBox="0 0 24 24" fill="${b.qrFill}"><path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4-2h2v2h-2v-2zm4 4h2v2h-2v-2zm-2 2h2v2h-2v-2zM6 6h2v2H6V6zm12 0h2v2h-2V6zM6 18h2v2H6v-2z"/></svg>
          </div>
        </div>
        <div class="t5-bottom">
          <div>
            <div style="font-size: 14px; color: #94a3b8; text-transform: uppercase;">Badge N°</div>
            <div style="font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #f59e0b; font-size: 20px;">${b.badgeNo}</div>
          </div>
          <div>
            <div style="font-size: 14px; color: #94a3b8; text-transform: uppercase;">Campagne</div>
            <div style="font-weight: 800; font-size: 19px;">${b.formation}</div>
          </div>
          <div>
            <div style="font-size: 14px; color: #94a3b8; text-transform: uppercase;">Valide jusqu'au</div>
            <div style="font-weight: 800; font-size: 19px;">${b.dateVal}</div>
          </div>
          <div style="color: #f59e0b; font-weight: 900; font-size: 18px;">
            ✓ ACCRÉDITÉ
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="badge-card ${b.theme}">
      ${b.hasCurve ? '<div class="curve-gold"></div>' : ''}
      <div class="b-head">
        <div class="b-brand">
          <svg class="b-brand-logo" viewBox="0 0 64 64" fill="none">
            <path d="M12 44 C12 28, 28 14, 32 10 C36 14, 52 28, 52 44 C42 44, 34 38, 32 28 C30 38, 22 44, 12 44 Z" fill="${b.wingColor}"/>
            <circle cx="32" cy="18" r="6" fill="#f59e0b"/>
          </svg>
          <div class="b-brand-titles">
            <span class="b-brand-name" style="color: ${b.logoColor};">TEAM SAHÉLIA</span>
            <span class="b-brand-sub" style="color: ${b.subColor};">${b.badgeTypeLogo}</span>
          </div>
        </div>
        <div class="b-qr">
          <svg viewBox="0 0 24 24" fill="${b.qrFill}"><path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4-2h2v2h-2v-2zm4 4h2v2h-2v-2zm-2 2h2v2h-2v-2zM6 6h2v2H6V6zm12 0h2v2h-2V6zM6 18h2v2H6v-2z"/></svg>
        </div>
      </div>

      <div class="b-body">
        <div class="b-photo ${b.isSquare ? 'rounded-square' : ''}">
          <img src="${b.avatar}" alt="${b.nom}">
        </div>
        <div class="b-info">
          <h2 class="b-nom">${b.nom}</h2>
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <span class="b-role-pill" style="margin-bottom: 0;">${b.role}</span>
            ${b.isIa ? '<span class="tag-ia-gold">IA TEAM</span>' : ''}
          </div>
          <div class="b-meta-list">
            <div class="b-meta-row">
              <span>${b.labelStation ? '🌱' : '🎓'}</span>
              <span class="b-meta-label">${b.labelStation ? 'Spécialité :' : 'Formation :'}</span>
              <span class="b-meta-val">${b.formation}</span>
            </div>
            <div class="b-meta-row">
              <span>🪪</span>
              <span class="b-meta-label">Badge N° :</span>
              <span class="b-meta-val" style="font-family: 'JetBrains Mono', monospace; color: #f59e0b;">${b.badgeNo}</span>
            </div>
            <div class="b-meta-row">
              <span>${b.labelStation ? '📍' : '📅'}</span>
              <span class="b-meta-label">${b.labelStation ? 'Station :' : 'Valide jusqu\'au :'}</span>
              <span class="b-meta-val">${b.dateVal}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="b-footer">
        <span class="b-slogan">${b.slogan}</span>
        <div class="b-shield" style="color: ${b.shieldColor};">
          <span>🛡️</span>
          <span>${b.shield}</span>
        </div>
      </div>
    </div>
  `;
}

// Lire template
const template = fs.readFileSync(TEMPLATE_HTML, 'utf8');

BADGES.forEach((b) => {
  const badgeContent = buildBadgeHtml(b);
  const fullHtml = template.replace('<body id="render-body">\n  <!-- Rempli dynamiquement par script Node ou test -->\n</body>', `<body id="render-body">\n${badgeContent}\n</body>`);

  const tmpHtmlPath = path.join(BRAIN_DIR, `tmp_badge_${b.id}.html`);
  fs.writeFileSync(tmpHtmlPath, fullHtml, 'utf8');

  const outPng = path.join(BRAIN_DIR, b.nomFichier);
  const cmd = `"${EDGE_PATH}" --headless --screenshot="${outPng}" --window-size=1012,638 "${tmpHtmlPath}"`;
  console.log(`Génération de ${b.nomFichier}...`);
  execSync(cmd, { stdio: 'ignore' });
  fs.unlinkSync(tmpHtmlPath);
  console.log(`✓ ${b.nomFichier} généré avec succès (${(fs.statSync(outPng).size / 1024).toFixed(1)} Ko).`);
});

console.log('✓ Tous les 6 badges individuels ont été générés en PNG HD !');
