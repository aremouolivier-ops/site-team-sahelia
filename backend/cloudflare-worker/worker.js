/**
 * TEAM Sahélia — Backend Serverless Zéro Coût (Cloudflare Workers + D1)
 * 0 €/mois (jusqu'à 100 000 requêtes/jour et 5 Go de base SQLite D1).
 * Prend en charge la synchronisation multi-appareils, la vérification/révocation
 * temps réel des badges et l'authentification administrateur signée HMAC-SHA256.
 */

function corsHeaders(origin = '*') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

function jsonResponse(data, status = 200, origin = '*') {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders(origin) });
}

async function hmacSha256Hex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifierAdminToken(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ') || !env.TOKEN_SECRET) return null;
  const token = auth.slice(7).trim();
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sigHex] = parts;
  const attendu = await hmacSha256Hex(env.TOKEN_SECRET, payloadB64);
  if (sigHex !== attendu) return null;
  try {
    const payload = JSON.parse(atob(payloadB64));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = env.ALLOWED_ORIGIN || '*';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (url.pathname === '/api/health' && request.method === 'GET') {
      return jsonResponse({ ok: true, service: 'team-sahelia-api', version: '2026.8' }, 200, origin);
    }

    // 1. Synchronisation de progression multi-appareils (Apprenants)
    if (url.pathname === '/api/progress/sync' && request.method === 'POST') {
      try {
        const body = await request.json();
        const learnerId = String(body.learnerId || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
        const progression = body.progression && typeof body.progression === 'object' ? body.progression : {};
        if (!learnerId || learnerId.length < 6) {
          return jsonResponse({ error: 'Identifiant apprenant invalide.' }, 400, origin);
        }

        await env.DB.prepare(
          'INSERT INTO learners (learner_id) VALUES (?) ON CONFLICT(learner_id) DO UPDATE SET updated_at = datetime("now")'
        ).bind(learnerId).run();

        const entrees = Object.entries(progression).filter(
          ([k, v]) => /^sahelia_prog_[a-zA-Z0-9_-]+$/.test(k) && v === 'valide'
        );

        for (const [cle] of entrees) {
          await env.DB.prepare(
            'INSERT INTO course_progress (learner_id, progress_key, status, xp) VALUES (?, ?, "valide", 150) ON CONFLICT(learner_id, progress_key) DO NOTHING'
          ).bind(learnerId, cle).run();
        }

        const { results } = await env.DB.prepare(
          'SELECT progress_key, status FROM course_progress WHERE learner_id = ?'
        ).bind(learnerId).all();

        const merged = {};
        (results || []).forEach((r) => { merged[r.progress_key] = r.status; });

        return jsonResponse({ ok: true, learnerId, totalValides: Object.keys(merged).length, merged }, 200, origin);
      } catch (err) {
        return jsonResponse({ error: err.message }, 500, origin);
      }
    }

    // 2. Vérification en direct du statut d'un badge (Registre D1 temps réel)
    if (url.pathname === '/api/badges/verify' && request.method === 'GET') {
      const badgeId = url.searchParams.get('id') || '';
      if (!badgeId) return jsonResponse({ error: 'Paramètre id manquant.' }, 400, origin);
      const badge = await env.DB.prepare(
        'SELECT badge_id, holder_name, achievement_id, issued_on, status, revocation_reason FROM badges WHERE badge_id = ?'
      ).bind(badgeId).first();
      if (!badge) return jsonResponse({ found: false }, 404, origin);
      return jsonResponse({ found: true, badge }, 200, origin);
    }

    // 3. Authentification administrateur côté serveur (zéro secret dans le JS client)
    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      const body = await request.json();
      const motDePasse = String(body.password || '');
      if (!env.ADMIN_PASSWORD_HASH || !env.TOKEN_SECRET) {
        return jsonResponse({ error: 'Secrets serveur non configurés (ADMIN_PASSWORD_HASH / TOKEN_SECRET).' }, 503, origin);
      }
      const hashCandidat = await hmacSha256Hex('TEAM-SAHELIA-AUTH-2026', motDePasse);
      if (hashCandidat !== env.ADMIN_PASSWORD_HASH) {
        return jsonResponse({ error: 'Identifiants invalides.' }, 401, origin);
      }
      const payloadB64 = btoa(JSON.stringify({ role: 'admin', exp: Date.now() + 8 * 3600 * 1000 }));
      const sig = await hmacSha256Hex(env.TOKEN_SECRET, payloadB64);
      return jsonResponse({ ok: true, token: `${payloadB64}.${sig}` }, 200, origin);
    }

    // 4. Révocation d'un badge authentifiée par jeton admin
    if (url.pathname === '/api/admin/badges/revoke' && request.method === 'POST') {
      const session = await verifierAdminToken(request, env);
      if (!session) return jsonResponse({ error: 'Non autorisé.' }, 401, origin);
      const body = await request.json();
      const badgeId = String(body.badgeId || '').trim();
      const reason = String(body.reason || 'Révocation administrative').trim();
      if (!badgeId) return jsonResponse({ error: 'badgeId requis.' }, 400, origin);
      await env.DB.prepare(
        'UPDATE badges SET status = "revoked", revocation_reason = ? WHERE badge_id = ?'
      ).bind(reason, badgeId).run();
      return jsonResponse({ ok: true, badgeId, status: 'revoked' }, 200, origin);
    }

    return jsonResponse({ error: 'Route inconnue.' }, 404, origin);
  }
};
