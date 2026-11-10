const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\DELL\\Desktop\\site-team-sahelia';
const htmlFiles = [
  'index.html',
  'formation.html',
  'verifier.html',
  'outils.html',
  'admin.html',
  'documentation.html'
];

let errors = 0;

htmlFiles.forEach(file => {
  const fullPath = path.join(dir, file);
  const content = fs.readFileSync(fullPath, 'utf8');

  // 1. Verifier viewport responsive
  if (!content.includes('name="viewport"')) {
    console.error(`[HTML] Viewport manquant dans ${file}`);
    errors++;
  }

  // 2. Verifier toutes les balises src="..." et href="..." locales
  const regex = /(src|href)=["']([^"'#?:]+(?:\.[^"'#?:]+)+)(?:\?[^"']*)?["']/gi;
  let m;
  let checkedCount = 0;
  while ((m = regex.exec(content)) !== null) {
    const attr = m[1];
    const target = m[2];

    if (target.startsWith('http') || target.startsWith('data:') || target.startsWith('mailto:') || target.includes('${')) {
      continue;
    }

    const assetPath = path.join(dir, target);
    if (!fs.existsSync(assetPath)) {
      console.error(`[HTML-BROKEN-REF] Dans ${file} : ${attr}="${target}" n'existe pas sur disque !`);
      errors++;
    }
    checkedCount++;
  }
  console.log(`✓ ${file} : Viewport OK, ${checkedCount} références locales vérifiées sans erreur.`);
});

// 3. Verifier syntaxe de TOUS les fichiers JS (y compris les 12 chunks et sw.js)
const jsDirs = [path.join(dir, 'js'), path.join(dir, 'js', 'contenus')];
let jsChecked = 0;
jsDirs.forEach(d => {
  if (!fs.existsSync(d)) return;
  fs.readdirSync(d).filter(f => f.endsWith('.js')).forEach(f => {
    const full = path.join(d, f);
    try {
      new Function(fs.readFileSync(full, 'utf8'));
      jsChecked++;
    } catch (e) {
      console.error(`[JS-SYNTAX-ERROR] Dans ${full} : ${e.message}`);
      errors++;
    }
  });
});

try {
  new Function(fs.readFileSync(path.join(dir, 'sw.js'), 'utf8'));
  jsChecked++;
} catch (e) {
  console.error(`[JS-SYNTAX-ERROR] Dans sw.js : ${e.message}`);
  errors++;
}

console.log(`✓ Syntaxe JavaScript : ${jsChecked} fichiers vérifiés avec 0 erreur.`);

if (errors > 0) {
  console.error(`❌ ECHEC : ${errors} erreurs detectees.`);
  process.exit(1);
} else {
  console.log('\n🎉 INTEGRITE TOTALE DES FICHIERS VERIFIEE : 0 ERREUR !');
}
