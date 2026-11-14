# Backend Serverless TEAM Sahélia (0 €/mois)

Ce module optionnel permet de faire passer la plateforme TEAM Sahélia d'un stockage strictement local (`localStorage` + GitHub Pages) à une architecture full-stack gratuite (**Cloudflare Workers + D1 SQLite**, gratuit jusqu'à 100 000 requêtes/jour et 5 Go de stockage) :

- **Synchronisation multi-appareils** des chapitres validés et XP (`POST /api/progress/sync`).
- **Authentification administrateur serveur** par jeton signé HMAC-SHA256 (`POST /api/auth/login`) sans aucun secret stocké dans le frontend statique.
- **Vérification / Révocation instantanée** des badges Open Badges 3.0 (`GET /api/badges/verify`, `POST /api/admin/badges/revoke`).

## Déploiement en 4 commandes (0 €/mois)

```bash
npm install -g wrangler
wrangler login
wrangler d1 create team_sahelia_db
# Copier le database_id généré dans wrangler.toml, puis :
wrangler d1 execute team_sahelia_db --file=./schema.sql
wrangler secret put TOKEN_SECRET
wrangler secret put ADMIN_PASSWORD_HASH
wrangler deploy
```

Une fois déployé, définissez `localStorage.setItem('sahelia_api_endpoint', 'https://team-sahelia-api.<sous-domaine>.workers.dev')` ou `window.SAHELIA_API_BASE` pour activer la synchronisation automatique dans `js/sahelia-cloud-adapter.js`.
