const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, '..', 'admin.html');
let content = fs.readFileSync(adminPath, 'utf8');

// 1. Ajouter le lien vers manifest.json si absent
if (!content.includes('rel="manifest"')) {
  content = content.replace(
    '<link rel="icon" type="image/svg+xml" href="assets/logo-sahelia.svg">',
    '<link rel="icon" type="image/svg+xml" href="assets/logo-sahelia.svg">\n  <link rel="manifest" href="manifest.json">'
  );
}

// 2. Ajouter l'onglet de navigation
const navTarget = '<button type="button" class="admin-tab-btn" data-target="panel-verification">🔍 Contrôle & Vérification Badges</button>';
const navReplace = '<button type="button" class="admin-tab-btn" data-target="panel-verification">🔍 Contrôle & Vérification Badges</button>\n        <button type="button" class="admin-tab-btn" data-target="panel-github-sync">🚀 Synchronisation GitHub (Git-as-CMS)</button>';

if (!content.includes('data-target="panel-github-sync"')) {
  content = content.replace(navTarget, navReplace);
}

// 3. Ajouter la section panel-github-sync
const sectionGithubSync = `
      <!-- =================================================================== -->
      <!-- ONGLET 6 : SYNCHRONISATION GITHUB (GIT-AS-A-CMS)                    -->
      <!-- =================================================================== -->
      <section id="panel-github-sync" class="admin-panel-section">
        <div class="admin-card" style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <h2 style="font-size: 1.25rem; font-weight: 800;">🚀 Connecteur Git-as-a-CMS &amp; Publication Directe</h2>
            <span class="etiquette etiquette--vert">REST API GitHub v3</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--texte-2); line-height: 1.6; margin-bottom: 1.5rem;">
            Publiez directement vos modifications d’annonces, de membres et de coordonnées sur le dépôt GitHub officiel <code>aremouolivier-ops/site-team-sahelia</code> en un seul clic, sans passer par le terminal. Votre site en ligne se met à jour automatiquement via GitHub Pages.
          </p>

          <!-- Configuration du Jeton GitHub -->
          <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--bordure); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem; color: #ffffff;">Paramètres de Connexion GitHub</h3>
            <div class="grille-2-cols-responsive" style="margin-bottom: 1rem;">
              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; margin-bottom: 0.35rem;">Dépôt Cible (owner/repo) :</label>
                <input type="text" id="gh-repo-input" class="champ-saisie" value="aremouolivier-ops/site-team-sahelia" style="font-family: var(--police-mono);">
              </div>
              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; margin-bottom: 0.35rem;">Branche de Déploiement :</label>
                <input type="text" id="gh-branch-input" class="champ-saisie" value="main" style="font-family: var(--police-mono);">
              </div>
            </div>
            <div style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.78rem; font-weight: 700; margin-bottom: 0.35rem;">GitHub Personal Access Token (PAT avec scope repo:contents) :</label>
              <input type="password" id="gh-token-input" class="champ-saisie" placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" style="font-family: var(--police-mono);">
              <span style="font-size: 0.72rem; color: var(--texte-3); margin-top: 0.25rem; display: block;">Le jeton est conservé exclusivement dans le stockage local de votre navigateur (localStorage).</span>
            </div>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button type="button" id="btn-sauvegarder-gh-config" class="v-btn v-btn--vert" style="min-height: 38px; font-size: 0.82rem; padding: 0 1rem;">
                💾 Enregistrer la Clé
              </button>
              <button type="button" id="btn-tester-gh-connexion" class="v-btn v-btn--fantome" style="min-height: 38px; font-size: 0.82rem; padding: 0 1rem;">
                🧪 Tester la Connexion API
              </button>
            </div>
            <div id="gh-test-feedback" style="margin-top: 0.75rem; font-size: 0.82rem;"></div>
          </div>

          <!-- Actions de Publication -->
          <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 1.25rem;">
            <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; color: #10b981;">Actions de Synchronisation</h3>
            <p style="font-size: 0.82rem; color: var(--texte-2); margin-bottom: 1rem;">
              Sélectionnez les données à synchroniser avec les fichiers sources du site sur GitHub.
            </p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button type="button" id="btn-push-annonces-gh" class="v-btn v-btn--vert" style="min-height: 42px; font-size: 0.85rem;">
                🚀 Pousser les Annonces &amp; Coordonnées sur GitHub
              </button>
              <button type="button" id="btn-push-membres-gh" class="v-btn v-btn--vert" style="min-height: 42px; font-size: 0.85rem;">
                🚀 Pousser le Registre des Membres sur GitHub
              </button>
              <button type="button" id="btn-telecharger-bundle-offline" class="v-btn v-btn--fantome" style="min-height: 42px; font-size: 0.85rem;">
                📥 Télécharger le Bundle JSON de Secours (Hors-Ligne)
              </button>
            </div>
            <div id="gh-sync-feedback" style="margin-top: 1rem; font-size: 0.85rem; font-weight: 600;"></div>
          </div>
        </div>
      </section>
`;

if (!content.includes('id="panel-github-sync"')) {
  content = content.replace('</section>\n\n    </div>\n  </main>', '</section>\n' + sectionGithubSync + '\n    </div>\n  </main>');
  // Fallback si saut de ligne CRLF
  if (!content.includes('id="panel-github-sync"')) {
    content = content.replace('</section>\r\n\r\n    </div>\r\n  </main>', '</section>\r\n' + sectionGithubSync + '\r\n    </div>\r\n  </main>');
  }
}

// 4. Ajouter la logique JS Git-as-a-CMS
const jsGitSync = `
      // -----------------------------------------------------------------------
      // SYNCHRONISATION GITHUB (GIT-AS-A-CMS)
      // -----------------------------------------------------------------------
      const inputGhRepo = document.getElementById('gh-repo-input');
      const inputGhBranch = document.getElementById('gh-branch-input');
      const inputGhToken = document.getElementById('gh-token-input');
      const btnSaveGh = document.getElementById('btn-sauvegarder-gh-config');
      const btnTestGh = document.getElementById('btn-tester-gh-connexion');
      const btnPushAnnonces = document.getElementById('btn-push-annonces-gh');
      const btnPushMembres = document.getElementById('btn-push-membres-gh');
      const btnDownloadBundle = document.getElementById('btn-telecharger-bundle-offline');
      const testFeedback = document.getElementById('gh-test-feedback');
      const syncFeedback = document.getElementById('gh-sync-feedback');

      try {
        if (inputGhRepo && localStorage.getItem('sahelia_gh_repo')) inputGhRepo.value = localStorage.getItem('sahelia_gh_repo');
        if (inputGhBranch && localStorage.getItem('sahelia_gh_branch')) inputGhBranch.value = localStorage.getItem('sahelia_gh_branch');
        if (inputGhToken && localStorage.getItem('sahelia_gh_token')) inputGhToken.value = localStorage.getItem('sahelia_gh_token');
      } catch (e) {}

      if (btnSaveGh) {
        btnSaveGh.addEventListener('click', () => {
          try {
            localStorage.setItem('sahelia_gh_repo', inputGhRepo.value.trim());
            localStorage.setItem('sahelia_gh_branch', inputGhBranch.value.trim());
            localStorage.setItem('sahelia_gh_token', inputGhToken.value.trim());
            testFeedback.innerHTML = '<span style="color:#4ade80;">✓ Paramètres GitHub enregistrés avec succès dans votre navigateur.</span>';
          } catch (e) {
            testFeedback.innerHTML = '<span style="color:#f87171;">Erreur : ' + escapeHTML(e.message) + '</span>';
          }
        });
      }

      if (btnTestGh) {
        btnTestGh.addEventListener('click', async () => {
          const repo = inputGhRepo.value.trim();
          const token = inputGhToken.value.trim();
          if (!repo || !token) {
            testFeedback.innerHTML = '<span style="color:#f87171;">⚠️ Veuillez renseigner le nom du dépôt et votre Personal Access Token.</span>';
            return;
          }
          testFeedback.innerHTML = '<span style="color:#60a5fa;">⏳ Test de connexion en cours vers GitHub API...</span>';
          try {
            const res = await fetch(\`https://api.github.com/repos/\${repo}\`, {
              headers: {
                'Authorization': \`Bearer \${token}\`,
                'Accept': 'application/vnd.github.v3+json'
              }
            });
            if (res.ok) {
              const data = await res.json();
              testFeedback.innerHTML = \`<span style="color:#4ade80;">✓ Connexion Réussie ! Dépôt "\${escapeHTML(data.full_name)}" accessible (\${data.visibility || 'public'}).</span>\`;
            } else {
              const errData = await res.json().catch(() => ({}));
              testFeedback.innerHTML = \`<span style="color:#f87171;">❌ Échec de connexion (HTTP \${res.status}) : \${escapeHTML(errData.message || 'Token invalide')}.</span>\`;
            }
          } catch (err) {
            testFeedback.innerHTML = \`<span style="color:#f87171;">❌ Erreur réseau : \${escapeHTML(err.message)}</span>\`;
          }
        });
      }

      async function pousserFichierGitHub(cheminFichier, contenuTexte, messageCommit) {
        const repo = inputGhRepo.value.trim();
        const branch = inputGhBranch.value.trim() || 'main';
        const token = inputGhToken.value.trim();

        if (!token) {
          throw new Error('Veuillez configurer et enregistrer votre Personal Access Token GitHub.');
        }

        const url = \`https://api.github.com/repos/\${repo}/contents/\${cheminFichier}?ref=\${branch}\`;
        
        let sha = null;
        try {
          const getRes = await fetch(url, {
            headers: {
              'Authorization': \`Bearer \${token}\`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          if (getRes.ok) {
            const data = await getRes.json();
            sha = data.sha;
          }
        } catch (e) {}

        const bytes = new TextEncoder().encode(contenuTexte);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const b64 = btoa(binary);

        const putBody = {
          message: messageCommit,
          content: b64,
          branch: branch
        };
        if (sha) putBody.sha = sha;

        const putRes = await fetch(\`https://api.github.com/repos/\${repo}/contents/\${cheminFichier}\`, {
          method: 'PUT',
          headers: {
            'Authorization': \`Bearer \${token}\`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(putBody)
        });

        if (!putRes.ok) {
          const errData = await putRes.json().catch(() => ({}));
          throw new Error(errData.message || \`Erreur HTTP \${putRes.status}\`);
        }

        return await putRes.json();
      }

      if (btnPushAnnonces) {
        btnPushAnnonces.addEventListener('click', async () => {
          const DB = window.SaheliaDB;
          if (!DB) return;
          syncFeedback.innerHTML = '<span style="color:#60a5fa;">⏳ Publication des annonces et de la configuration vers GitHub...</span>';
          try {
            const payload = JSON.stringify({
              annonces: DB.annonces || [],
              configSite: DB.configSite || {},
              dateMiseAJour: new Date().toISOString()
            }, null, 2);

            await pousserFichierGitHub(
              'data/annonces.json',
              payload,
              'chore(admin): mise à jour des annonces et de la configuration du site'
            );
            syncFeedback.innerHTML = '<span style="color:#4ade80;">🎉 Succès ! Le fichier <code>data/annonces.json</code> a été commité sur GitHub. Le site en ligne sera actualisé d’ici 1 à 2 minutes par GitHub Pages.</span>';
          } catch (err) {
            syncFeedback.innerHTML = \`<span style="color:#f87171;">❌ Échec de synchronisation : \${escapeHTML(err.message)}</span>\`;
          }
        });
      }

      if (btnPushMembres) {
        btnPushMembres.addEventListener('click', async () => {
          const DB = window.SaheliaDB;
          if (!DB) return;
          syncFeedback.innerHTML = '<span style="color:#60a5fa;">⏳ Publication du registre des membres vers GitHub...</span>';
          try {
            const payload = JSON.stringify(DB.membres || [], null, 2);

            await pousserFichierGitHub(
              'data/membres.json',
              payload,
              'chore(admin): mise à jour du registre officiel des membres'
            );
            syncFeedback.innerHTML = '<span style="color:#4ade80;">🎉 Succès ! Le fichier <code>data/membres.json</code> a été commité sur GitHub avec succès.</span>';
          } catch (err) {
            syncFeedback.innerHTML = \`<span style="color:#f87171;">❌ Échec de synchronisation : \${escapeHTML(err.message)}</span>\`;
          }
        });
      }

      if (btnDownloadBundle) {
        btnDownloadBundle.addEventListener('click', () => {
          const DB = window.SaheliaDB;
          const bundle = {
            exportDate: new Date().toISOString(),
            membres: DB ? DB.membres : [],
            annonces: DB ? DB.annonces : [],
            configSite: DB ? DB.configSite : {}
          };
          const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = \`Sahelia_Data_Bundle_\${new Date().toISOString().slice(0, 10)}.json\`;
          a.click();
          URL.revokeObjectURL(url);
          syncFeedback.innerHTML = '<span style="color:#4ade80;">✓ Bundle complet téléchargé sur votre poste.</span>';
        });
      }
`;

if (!content.includes('pousserFichierGitHub')) {
  content = content.replace("document.addEventListener('DOMContentLoaded', () => {", jsGitSync + "\n      document.addEventListener('DOMContentLoaded', () => {");
}

fs.writeFileSync(adminPath, content, 'utf8');
console.log('✓ admin.html patché avec succès pour le connecteur Git-as-a-CMS !');
