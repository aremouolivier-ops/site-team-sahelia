/**
 * TEAM Sahélia — Adaptateur Cloud Hybride & Passeport d'Apprentissage (0 €/mois)
 * Fonctionne 100% hors-ligne / GitHub Pages via localStorage, avec passerelle
 * optionnelle vers un Worker Cloudflare D1 et Export/Import JSON portable.
 */
(function () {
  'use strict';

  const STORAGE_ENDPOINT_KEY = 'sahelia_api_endpoint';
  const STORAGE_LEARNER_KEY = 'sahelia_learner_uid';

  function genererIdentifiantApprenant() {
    try {
      let uid = localStorage.getItem(STORAGE_LEARNER_KEY);
      if (uid && uid.length >= 8) return uid;
      const alea = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : ('ts-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10));
      localStorage.setItem(STORAGE_LEARNER_KEY, alea);
      return alea;
    } catch (e) {
      return 'ts-local-guest';
    }
  }

  function listerProgressionLocale() {
    const prog = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (cle && cle.startsWith('sahelia_prog_')) {
          prog[cle] = localStorage.getItem(cle);
        }
      }
    } catch (e) {}
    return prog;
  }

  const CloudAdapter = {
    obtenirEndpoint() {
      if (typeof window !== 'undefined' && window.SAHELIA_API_BASE) {
        return String(window.SAHELIA_API_BASE).replace(/\/+$/, '');
      }
      try {
        const val = localStorage.getItem(STORAGE_ENDPOINT_KEY);
        return val ? val.replace(/\/+$/, '') : '';
      } catch (e) {
        return '';
      }
    },

    configurerEndpoint(url) {
      const propre = String(url || '').trim().replace(/\/+$/, '');
      try {
        if (!propre) {
          localStorage.removeItem(STORAGE_ENDPOINT_KEY);
        } else if (/^https?:\/\//i.test(propre)) {
          localStorage.setItem(STORAGE_ENDPOINT_KEY, propre);
        }
      } catch (e) {}
      return this.obtenirEndpoint();
    },

    obtenirStatistiquesLocales() {
      const prog = listerProgressionLocale();
      const cles = Object.keys(prog).filter((k) => prog[k] === 'valide');
      return {
        learnerId: genererIdentifiantApprenant(),
        chapitresValides: cles.length,
        xpTotal: cles.length * 150,
        cloudActif: Boolean(this.obtenirEndpoint())
      };
    },

    exporterPasseportJSON() {
      const prog = listerProgressionLocale();
      let theme = 'sombre';
      try {
        theme = localStorage.getItem('sahelia_theme_lecteur') || 'sombre';
      } catch (e) {}

      const payload = {
        format: 'team-sahelia-passeport-v1',
        exportDate: new Date().toISOString(),
        learnerId: genererIdentifiantApprenant(),
        themeLecteur: theme,
        progression: prog,
        statistiques: this.obtenirStatistiquesLocales()
      };
      return JSON.stringify(payload, null, 2);
    },

    telechargerPasseport() {
      const json = this.exporterPasseportJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Passeport_TEAM_Sahelia_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },

    importerPasseportJSON(jsonStr) {
      const data = JSON.parse(jsonStr);
      if (!data || data.format !== 'team-sahelia-passeport-v1' || typeof data.progression !== 'object') {
        throw new Error('Fichier Passeport TEAM Sahélia invalide.');
      }
      let ajouts = 0;
      Object.entries(data.progression).forEach(([cle, valeur]) => {
        if (cle.startsWith('sahelia_prog_') && valeur === 'valide') {
          localStorage.setItem(cle, 'valide');
          ajouts++;
        }
      });
      if (data.themeLecteur === 'clair' || data.themeLecteur === 'sombre') {
        localStorage.setItem('sahelia_theme_lecteur', data.themeLecteur);
      }
      return { succes: true, chapitresRestaures: ajouts };
    },

    async synchroniserCloud() {
      const endpoint = this.obtenirEndpoint();
      if (!endpoint || (typeof navigator !== 'undefined' && navigator.onLine === false)) {
        return { mode: 'local', synchronise: false };
      }

      const learnerId = genererIdentifiantApprenant();
      const progression = listerProgressionLocale();
      try {
        const resp = await fetch(`${endpoint}/api/progress/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ learnerId, progression })
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const res = await resp.json();
        if (res && res.merged && typeof res.merged === 'object') {
          Object.entries(res.merged).forEach(([cle, val]) => {
            if (cle.startsWith('sahelia_prog_') && val === 'valide') {
              localStorage.setItem(cle, 'valide');
            }
          });
        }
        return { mode: 'cloud', synchronise: true, donnees: res };
      } catch (err) {
        return { mode: 'local', synchronise: false, erreur: err.message };
      }
    }
  };

  window.SaheliaCloud = CloudAdapter;
})();
