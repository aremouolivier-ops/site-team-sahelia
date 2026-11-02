const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const html = path.resolve('C:/Users/DELL/.gemini/antigravity/brain/f059b97b-0db9-4f81-b62c-ea0e1ed8efa6/affiche_bienvenue_template.html');
const outArtifact = path.resolve('C:/Users/DELL/.gemini/antigravity/brain/f059b97b-0db9-4f81-b62c-ea0e1ed8efa6/affiche_bienvenue_team_sahelia.png');
const outSite = path.resolve('C:/Users/DELL/Desktop/site-team-sahelia/assets/affiches/affiche_bienvenue_team_sahelia.png');

const cmd = `"${edge}" --headless --disable-gpu --hide-scrollbars --window-size=1080,1350 --screenshot="${outArtifact}" "${html}"`;
console.log('Rendering affiche...');
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(outArtifact)) {
  fs.copyFileSync(outArtifact, outSite);
  console.log(`✓ Affiche générée avec succès : ${(fs.statSync(outArtifact).size / 1024).toFixed(1)} Ko`);
} else {
  console.error('❌ Échec de génération.');
  process.exit(1);
}
